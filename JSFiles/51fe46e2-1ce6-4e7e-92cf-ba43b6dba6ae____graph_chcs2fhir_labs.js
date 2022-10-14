/**
 * Translate chcs Lab object to fhir Observation.
 */

var prefix = '../translate/';
var chcs = require(prefix + 'chcs');
// Abbreviations to shorten functions
var pattern = chcs.chcssJsonPattern;
var chcss = chcs.chcss;
var fhir = require(prefix + 'fhir');
var _ = require('underscore');
var JSONPath = require('jsonpath-plus');
var format = require('string-format');
var assert = require('assert');
var fdt = require(prefix + 'chcs2fhir_datatypes');
var chcs_utils = require(prefix + 'util/chcs_utils');
var Av = require('autovivify');





/**
 * IMPLEMENTATION NOT COMPLETE! Translate a chcsLabResultObject into a fhir_Observation.
 * @param {object} chcsLabResultObjectModified - javascript object with type 'chccs:Lab_Result-63'
 * @param {{policy: boolean, warnings: boolean, eat: boolean}} [_options={policy: false, warnings: false, eat: true}]
 * @returns {object} -- fhir translation
 * @see {http://hl7-fhir.github.io/observation.html}
 *
 *  Implementation notes:
 *
 *  - mongodb query db.schema.find_one({fmDD: 'fmdd:63'}, {'properties.id':true})
 *    will find the mongodb document that enumerates the chcs fields available. They are:
 *
 *    "patient-63"
 *    "micro_conversion_flag-63"
 *    "blood_bank-63"
 *    "clinical_chemistry-63"
 *    "parasitology_buffer-63"
 *    "bacteriology_buffer-63"
 *    "mycobacterium_buffer-63"
 *    "mycology_buffer-63"
 *    "virology_buffer-63"
 *    "delta_check-63"
 *    "surgical_pathology-63"
 *    "cytology_gyn-63"
 *    "autopsy-63"
 *    "bone_marrow-63"
 *    "cytology_nongyn-63"
 *    "parasitology-63"
 *    "bacteriology-63"
 *    "mycobacterium-63"
 *    "mycology-63"
 *    "virology-63"
 *
 *  - mongodb query db['63'].find({}) will find instances of 'Lab_Result-63'.
 */

function translateLabsFhir(chcsLabResultObjectModified, _options, prefix) {
    // Assign the default options, then override what the caller wants. At the end you have the right options.
    var options = {
        warnings: false,
        policy: false,
        eat: true
    };
    for (k in _options) {
        if (_options.hasOwnProperty(k)) options[k] = _options[k];
    }


    var participatingProperties = []; // no participants yet
    var warnings = []; // no warnings yet

    // Create a fetcher for chcsLabResultObject. The fetcher will get data values from
    // input chcsLabResultObject, remembering those that actually have values in list participating_properties.
    // var fetch1 = fdt.peek(chcsLabResultObjectModified, participatingProperties);
    var peek = fdt.peek(chcsLabResultObjectModified, participatingProperties);
    var eat = fdt.eat(chcsLabResultObjectModified, participatingProperties);
    eat('$.type');
    // fetch1(json_pattern[, transformation])

    var identifier = eat('$.type', function (t) { return [ fdt.fhirIdentifier(t) ]; }); // Identifier Id for external references to this report
    var patient = chcsLabResultObjectModified['patient-63'];

    // "internal" conversion functions, if a key is present then its values are an array of
    // tests of that type.

    // "micro_conversion_flag-63"
    function micro_conversion(mc) {
    }

    // "blood_bank-63"
    function blood_bank(bb) {
    }

    // "clinical_chemistry-63"
    function clinical_chemistry(cc) {
        return fdt.clean({

            resourceType: "DiagnosticReport",
            // from Resource: id, meta, implicitRules, and language
            identifier: identifier,
            // from DomainResource: text, contained, extension, and modifierExtension
            status: fdt.required({coding: ["final"]}), // R!  registered | partial | final | corrected | appended | cancelled | entered-in-error

            category: {coding: ['ch'], text: "Chemistry"}, // CodeableConcept, Service category, http://hl7-fhir.github.io/valueset-diagnostic-service-sections.html
            code: fdt.required({}), // R!  Name/Code for this diagnostic report, loinc http://hl7-fhir.github.io/valueset-report-codes.html
            subject: patient, // Reference(Patient|Group|Device|Location) R!  The subject of the report, usually, but not always, the patient
            encounter: {}, // Reference(Encounter) Health care event when test ordered
            // effective[x]: Clinically Relevant time/time-period for report. One of these 2:
            effectiveDateTime: "<dateTime>",
            effectivePeriod: {}, // Period
            issued: fdt.required("<instant>"), // R!  DateTime this version was released
            performer: fdt.required({}), // Reference(Practitioner|Organization) R!  Responsible Diagnostic Service
            request: [{}], // Reference(DiagnosticOrder|ProcedureRequest|ReferralRequest)  What was requested
            specimen: [{}], // Reference(Specimen)  Specimens this report is based on
            result: [{}], // Reference(Observation) Observations - simple, or complex nested groups
            imagingStudy: [{}], // Reference(ImagingStudy|ImagingObjectSelection)  Reference to full details of imaging associated with the diagnostic report
            image: [{ // Key images associated with this report
                comment: "<string>", // Comment about the image (e.g. explanation)
                link: fdt.required({}) // Reference(Media) R!  Reference to the image source
            }],
            conclusion: "<string>", // Clinical Interpretation of test results
            codedDiagnosis: [{}], // CodeableConcept , Codes for the conclusion
            presentedForm: [cc] // Attachment , Entire report as issued
        });
    }

    // "parasitology_buffer-63", https://en.wikipedia.org/wiki/Parasitology
    function parasitology_buffer(pb) {
        // details tbs
        return fdt.clean({

            resourceType: "DiagnosticReport",
            // from Resource: id, meta, implicitRules, and language
            identifier: identifier,
            // from DomainResource: text, contained, extension, and modifierExtension
            status: fdt.required({coding: ["final"]}), // R!  registered | partial | final | corrected | appended | cancelled | entered-in-error

            category: {coding: ['par'], text: "Parasitology"}, // deprecated, CodeableConcept, Service category, http://hl7-fhir.github.io/valueset-diagnostic-service-sections.html
            code: fdt.required({}), // R!  Name/Code for this diagnostic report, loinc http://hl7-fhir.github.io/valueset-report-codes.html
            subject: fdt.required(patient), // Reference(Patient|Group|Device|Location) R!  The subject of the report, usually, but not always, the patient
            encounter: {}, // Reference(Encounter) Health care event when test ordered
            // effective[x]: Clinically Relevant time/time-period for report. One of these 2:
            effectiveDateTime: "<dateTime>",
            effectivePeriod: {}, // Period
            issued: fdt.required("<instant>"), // R!  DateTime this version was released
            performer: fdt.required({}), // Reference(Practitioner|Organization) R!  Responsible Diagnostic Service
            request: [{}], // Reference(DiagnosticOrder|ProcedureRequest|ReferralRequest)  What was requested
            specimen: [{}], // Reference(Specimen)  Specimens this report is based on
            result: [{}], // Reference(Observation) Observations - simple, or complex nested groups
            imagingStudy: [{}], // Reference(ImagingStudy|ImagingObjectSelection)  Reference to full details of imaging associated with the diagnostic report
            image: [{ // Key images associated with this report
                comment: "<string>", // Comment about the image (e.g. explanation)
                link: rdt.required({}) // Reference(Media) R!  Reference to the image source
            }],
            conclusion: "<string>", // Clinical Interpretation of test results
            codedDiagnosis: [{}], // CodeableConcept , Codes for the conclusion
            presentedForm: [pb] // Attachment , Entire report as issued
        });
    }

    // "bacteriology_buffer-63"
    function bacteriology_buffer(bb) {
        return fdt.clean({

            resourceType: "DiagnosticReport",
            // from Resource: id, meta, implicitRules, and language
            identifier: identifier,
            // from DomainResource: text, contained, extension, and modifierExtension
            status: fdt.required({coding: ["final"]}), // R!  registered | partial | final | corrected | appended | cancelled | entered-in-error

            category: {coding: ['oth'], text: "Other"}, // CodeableConcept, Service category, http://hl7-fhir.github.io/valueset-diagnostic-service-sections.html
            code: fdt.required({}), // R!  Name/Code for this diagnostic report, loinc http://hl7-fhir.github.io/valueset-report-codes.html
            subject: fdt.required(patient), // Reference(Patient|Group|Device|Location) R!  The subject of the report, usually, but not always, the patient
            encounter: {}, // Reference(Encounter) Health care event when test ordered
            // effective[x]: Clinically Relevant time/time-period for report. One of these 2:
            effectiveDateTime: "<dateTime>",
            effectivePeriod: {}, // Period
            issued: fdt.required("<instant>"), // R!  DateTime this version was released
            performer: fdt.required({}), // Reference(Practitioner|Organization) R!  Responsible Diagnostic Service
            request: [{}], // Reference(DiagnosticOrder|ProcedureRequest|ReferralRequest)  What was requested
            specimen: [{}], // Reference(Specimen)  Specimens this report is based on
            result: [{}], // Reference(Observation) Observations - simple, or complex nested groups
            imagingStudy: [{}], // Reference(ImagingStudy|ImagingObjectSelection)  Reference to full details of imaging associated with the diagnostic report
            image: [{ // Key images associated with this report
                comment: "<string>", // Comment about the image (e.g. explanation)
                link: fdt.required({}) // Reference(Media) R!  Reference to the image source
            }],
            conclusion: "<string>", // Clinical Interpretation of test results
            codedDiagnosis: [{}], // CodeableConcept , Codes for the conclusion
            presentedForm: [bb] // Attachment , Entire report as issued
        });

    }

    // "mycobacterium_buffer-63"
    function mycobacterium_buffer(mb) {
        return fdt.clean({

            resourceType: "DiagnosticReport",
            // from Resource: id, meta, implicitRules, and language
            identifier: identifier,
            // from DomainResource: text, contained, extension, and modifierExtension
            status: fdt.required({coding: ["final"]}), // R!  registered | partial | final | corrected | appended | cancelled | entered-in-error

            category: {coding: ['mcb'], text: "Mycobacteriology"}, // CodeableConcept, Service category, http://hl7-fhir.github.io/valueset-diagnostic-service-sections.html
            code: fdt.required({}), // R!  Name/Code for this diagnostic report, loinc http://hl7-fhir.github.io/valueset-report-codes.html
            subject: fdt.required(patient), // Reference(Patient|Group|Device|Location) R!  The subject of the report, usually, but not always, the patient
            encounter: {}, // Reference(Encounter) Health care event when test ordered
            // effective[x]: Clinically Relevant time/time-period for report. One of these 2:
            effectiveDateTime: "<dateTime>",
            effectivePeriod: {}, // Period
            issued: fdt.required("<instant>"), // R!  DateTime this version was released
            performer: fdt.required({}), // Reference(Practitioner|Organization) R!  Responsible Diagnostic Service
            request: [{}], // Reference(DiagnosticOrder|ProcedureRequest|ReferralRequest)  What was requested
            specimen: [{}], // Reference(Specimen)  Specimens this report is based on
            result: [{}], // Reference(Observation) Observations - simple, or complex nested groups
            imagingStudy: [{}], // Reference(ImagingStudy|ImagingObjectSelection)  Reference to full details of imaging associated with the diagnostic report
            image: [{ // Key images associated with this report
                comment: "<string>", // Comment about the image (e.g. explanation)
                link: fdt.required({}) // Reference(Media) R!  Reference to the image source
            }],
            conclusion: "<string>", // Clinical Interpretation of test results
            codedDiagnosis: [{}], // CodeableConcept , Codes for the conclusion
            presentedForm: [mb] // Attachment , Entire report as issued
        });

    }

    // "mycology_buffer-63"
    function mycology_buffer(mb) {
        return fdt.clean({

            resourceType: "DiagnosticReport",
            // from Resource: id, meta, implicitRules, and language
            identifier: identifier,
            // from DomainResource: text, contained, extension, and modifierExtension
            status: fdt.required({coding: ["final"]}), // R!  registered | partial | final | corrected | appended | cancelled | entered-in-error

            category: {coding: ['myc'], text: "Mycology"}, // CodeableConcept, Service category, http://hl7-fhir.github.io/valueset-diagnostic-service-sections.html
            code: fdt.required({}), // R!  Name/Code for this diagnostic report, loinc http://hl7-fhir.github.io/valueset-report-codes.html
            subject: fdt.required(patient), // Reference(Patient|Group|Device|Location) R!  The subject of the report, usually, but not always, the patient
            encounter: {}, // Reference(Encounter) Health care event when test ordered
            // effective[x]: Clinically Relevant time/time-period for report. One of these 2:
            effectiveDateTime: "<dateTime>",
            effectivePeriod: {}, // Period
            issued: fdt.required("<instant>"), // R!  DateTime this version was released
            performer: fdt.required({}), // Reference(Practitioner|Organization) R!  Responsible Diagnostic Service
            request: [{}], // Reference(DiagnosticOrder|ProcedureRequest|ReferralRequest)  What was requested
            specimen: [{}], // Reference(Specimen)  Specimens this report is based on
            result: [{}], // Reference(Observation) Observations - simple, or complex nested groups
            imagingStudy: [{}], // Reference(ImagingStudy|ImagingObjectSelection)  Reference to full details of imaging associated with the diagnostic report
            image: [{ // Key images associated with this report
                comment: "<string>", // Comment about the image (e.g. explanation)
                link: fdt.required({}) // Reference(Media) R!  Reference to the image source
            }],
            conclusion: "<string>", // Clinical Interpretation of test results
            codedDiagnosis: [{}], // CodeableConcept , Codes for the conclusion
            presentedForm: [mb] // Attachment , Entire report as issued
        });

    }


    // "virology_buffer-63"
    function virology_buffer(vb) {
        return fdt.clean({

            resourceType: "DiagnosticReport",
            // from Resource: id, meta, implicitRules, and language
            identifier: identifier,
            // from DomainResource: text, contained, extension, and modifierExtension
            status: fdt.required({coding: ["final"]}), // R!  registered | partial | final | corrected | appended | cancelled | entered-in-error

            category: {coding: ['vr'], text: "Virology"}, // CodeableConcept, Service category, http://hl7-fhir.github.io/valueset-diagnostic-service-sections.html
            code: fdt.required({}), // R!  Name/Code for this diagnostic report, loinc http://hl7-fhir.github.io/valueset-report-codes.html
            subject: fdt.required(patient), // Reference(Patient|Group|Device|Location) R!  The subject of the report, usually, but not always, the patient
            encounter: {}, // Reference(Encounter) Health care event when test ordered
            // effective[x]: Clinically Relevant time/time-period for report. One of these 2:
            effectiveDateTime: "<dateTime>",
            effectivePeriod: {}, // Period
            issued: fdt.required("<instant>"), // R!  DateTime this version was released
            performer: fdt.required({}), // Reference(Practitioner|Organization) R!  Responsible Diagnostic Service
            request: [{}], // Reference(DiagnosticOrder|ProcedureRequest|ReferralRequest)  What was requested
            specimen: [{}], // Reference(Specimen)  Specimens this report is based on
            result: [{}], // Reference(Observation) Observations - simple, or complex nested groups
            imagingStudy: [{}], // Reference(ImagingStudy|ImagingObjectSelection)  Reference to full details of imaging associated with the diagnostic report
            image: [{ // Key images associated with this report
                comment: "<string>", // Comment about the image (e.g. explanation)
                link: fdt.required({}) // Reference(Media) R!  Reference to the image source
            }],
            conclusion: "<string>", // Clinical Interpretation of test results
            codedDiagnosis: [{}], // CodeableConcept , Codes for the conclusion
            presentedForm: [vb] // Attachment , Entire report as issued
        });

    }


    // "delta_check-63", http://www.medilexicon.com/medicaldictionary.php?t=23464
    function delta_check(dc) {
        return fdt.clean({

            resourceType: "DiagnosticReport",
            // from Resource: id, meta, implicitRules, and language
            identifier: identifier,
            // from DomainResource: text, contained, extension, and modifierExtension
            status: fdt.required({coding: ["final"]}), // R!  registered | partial | final | corrected | appended | cancelled | entered-in-error

            category: {coding: ['oth'], text: "Other"}, // CodeableConcept, Service category, http://hl7-fhir.github.io/valueset-diagnostic-service-sections.html
            code: fdt.required({}), // R!  Name/Code for this diagnostic report, loinc http://hl7-fhir.github.io/valueset-report-codes.html
            subject: fdt.required(patient), // Reference(Patient|Group|Device|Location) R!  The subject of the report, usually, but not always, the patient
            encounter: {}, // Reference(Encounter) Health care event when test ordered
            // effective[x]: Clinically Relevant time/time-period for report. One of these 2:
            effectiveDateTime: "<dateTime>",
            effectivePeriod: {}, // Period
            issued: fdt.required("<instant>"), // R!  DateTime this version was released
            performer: fdt.required({}), // Reference(Practitioner|Organization) R!  Responsible Diagnostic Service
            request: [{}], // Reference(DiagnosticOrder|ProcedureRequest|ReferralRequest)  What was requested
            specimen: [{}], // Reference(Specimen)  Specimens this report is based on
            result: [{}], // Reference(Observation) Observations - simple, or complex nested groups
            imagingStudy: [{}], // Reference(ImagingStudy|ImagingObjectSelection)  Reference to full details of imaging associated with the diagnostic report
            image: [{ // Key images associated with this report
                comment: "<string>", // Comment about the image (e.g. explanation)
                link: fdt.required({}) // Reference(Media) R!  Reference to the image source
            }],
            conclusion: "<string>", // Clinical Interpretation of test results
            codedDiagnosis: [{}], // CodeableConcept , Codes for the conclusion
            presentedForm: [dc] // Attachment , Entire report as issued
        });

    }


    // "surgical_pathology-63"
    function surgical_pathology(sp) {
        return fdt.clean({

            resourceType: "DiagnosticReport",
            // from Resource: id, meta, implicitRules, and language
            identifier: identifier,
            // from DomainResource: text, contained, extension, and modifierExtension
            status: fdt.required({coding: ["final"]}), // R!  registered | partial | final | corrected | appended | cancelled | entered-in-error

            category: {coding: ['sp'], text: "Surgical Pathology"}, // CodeableConcept, Service category, http://hl7-fhir.github.io/valueset-diagnostic-service-sections.html
            code: fdt.required({}), // R!  Name/Code for this diagnostic report, loinc http://hl7-fhir.github.io/valueset-report-codes.html
            subject: fdt.required(patient), // Reference(Patient|Group|Device|Location) R!  The subject of the report, usually, but not always, the patient
            encounter: {}, // Reference(Encounter) Health care event when test ordered
            // effective[x]: Clinically Relevant time/time-period for report. One of these 2:
            effectiveDateTime: "<dateTime>",
            effectivePeriod: {}, // Period
            issued: fdt.required("<instant>"), // R!  DateTime this version was released
            performer: fdt.required({}), // Reference(Practitioner|Organization) R!  Responsible Diagnostic Service
            request: [{}], // Reference(DiagnosticOrder|ProcedureRequest|ReferralRequest)  What was requested
            specimen: [{}], // Reference(Specimen)  Specimens this report is based on
            result: [{}], // Reference(Observation) Observations - simple, or complex nested groups
            imagingStudy: [{}], // Reference(ImagingStudy|ImagingObjectSelection)  Reference to full details of imaging associated with the diagnostic report
            image: [{ // Key images associated with this report
                comment: "<string>", // Comment about the image (e.g. explanation)
                link: fdt.required({}) // Reference(Media) R!  Reference to the image source
            }],
            conclusion: "<string>", // Clinical Interpretation of test results
            codedDiagnosis: [{}], // CodeableConcept , Codes for the conclusion
            presentedForm: [sp] // Attachment , Entire report as issued
        });

    }


    // "cytology_gyn-63"
    function cytology_gyn(cg) {
        return fdt.clean({

            resourceType: "DiagnosticReport",
            // from Resource: id, meta, implicitRules, and language
            identifier: identifier,
            // from DomainResource: text, contained, extension, and modifierExtension
            status: fdt.required({coding: ["final"]}), // R!  registered | partial | final | corrected | appended | cancelled | entered-in-error

            category: {coding: ['cy'], text: "Cytogenetics"}, // CodeableConcept, Service category, http://hl7-fhir.github.io/valueset-diagnostic-service-sections.html
            code: fdt.required({}), // R!  Name/Code for this diagnostic report, loinc http://hl7-fhir.github.io/valueset-report-codes.html
            subject: fdt.required(patient), // Reference(Patient|Group|Device|Location) R!  The subject of the report, usually, but not always, the patient
            encounter: {}, // Reference(Encounter) Health care event when test ordered
            // effective[x]: Clinically Relevant time/time-period for report. One of these 2:
            effectiveDateTime: "<dateTime>",
            effectivePeriod: {}, // Period
            issued: fdt.required("<instant>"), // R!  DateTime this version was released
            performer: fdt.required({}), // Reference(Practitioner|Organization) R!  Responsible Diagnostic Service
            request: [{}], // Reference(DiagnosticOrder|ProcedureRequest|ReferralRequest)  What was requested
            specimen: [{}], // Reference(Specimen)  Specimens this report is based on
            result: [{}], // Reference(Observation) Observations - simple, or complex nested groups
            imagingStudy: [{}], // Reference(ImagingStudy|ImagingObjectSelection)  Reference to full details of imaging associated with the diagnostic report
            image: [{ // Key images associated with this report
                comment: "<string>", // Comment about the image (e.g. explanation)
                link: fdt.required({}) // Reference(Media) R!  Reference to the image source
            }],
            conclusion: "<string>", // Clinical Interpretation of test results
            codedDiagnosis: [{}], // CodeableConcept , Codes for the conclusion
            presentedForm: [cg] // Attachment , Entire report as issued
        });

    }


    // "autopsy-63"
    function autopsy(a) {
        return fdt.clean({

            resourceType: "DiagnosticReport",
            // from Resource: id, meta, implicitRules, and language
            identifier: identifier,
            // from DomainResource: text, contained, extension, and modifierExtension
            status: fdt.required({coding: ["final"]}), // R!  registered | partial | final | corrected | appended | cancelled | entered-in-error

            category: {coding: ['oth'], text: "Other"}, // CodeableConcept, Service category, http://hl7-fhir.github.io/valueset-diagnostic-service-sections.html
            code: fdt.required({}), // R!  Name/Code for this diagnostic report, loinc http://hl7-fhir.github.io/valueset-report-codes.html
            subject: fdt.required(patient), // Reference(Patient|Group|Device|Location) R!  The subject of the report, usually, but not always, the patient
            encounter: {}, // Reference(Encounter) Health care event when test ordered
            // effective[x]: Clinically Relevant time/time-period for report. One of these 2:
            effectiveDateTime: "<dateTime>",
            effectivePeriod: {}, // Period
            issued: fdt.required("<instant>"), // R!  DateTime this version was released
            performer: fdt.required({}), // Reference(Practitioner|Organization) R!  Responsible Diagnostic Service
            request: [{}], // Reference(DiagnosticOrder|ProcedureRequest|ReferralRequest)  What was requested
            specimen: [{}], // Reference(Specimen)  Specimens this report is based on
            result: [{}], // Reference(Observation) Observations - simple, or complex nested groups
            imagingStudy: [{}], // Reference(ImagingStudy|ImagingObjectSelection)  Reference to full details of imaging associated with the diagnostic report
            image: [{ // Key images associated with this report
                comment: "<string>", // Comment about the image (e.g. explanation)
                link: fdt.required({}) // Reference(Media) R!  Reference to the image source
            }],
            conclusion: "<string>", // Clinical Interpretation of test results
            codedDiagnosis: [{}], // CodeableConcept , Codes for the conclusion
            presentedForm: [a] // Attachment , Entire report as issued
        });

    }


    // "bone_marrow-63"
    function bone_marrow(bm) {
        return fdt.clean({

            resourceType: "DiagnosticReport",
            // from Resource: id, meta, implicitRules, and language
            identifier: identifier,
            // from DomainResource: text, contained, extension, and modifierExtension
            status: fdt.required({coding: ["final"]}), // R!  registered | partial | final | corrected | appended | cancelled | entered-in-error

            category: {coding: ['oth'], text: "Other"}, // CodeableConcept, Service category, http://hl7-fhir.github.io/valueset-diagnostic-service-sections.html
            code: fdt.required({}), // R!  Name/Code for this diagnostic report, loinc http://hl7-fhir.github.io/valueset-report-codes.html
            subject: required(patient), // Reference(Patient|Group|Device|Location) R!  The subject of the report, usually, but not always, the patient
            encounter: {}, // Reference(Encounter) Health care event when test ordered
            // effective[x]: Clinically Relevant time/time-period for report. One of these 2:
            effectiveDateTime: "<dateTime>",
            effectivePeriod: {}, // Period
            issued: fdt.required("<instant>"), // R!  DateTime this version was released
            performer: fdt.required({}), // Reference(Practitioner|Organization) R!  Responsible Diagnostic Service
            request: [{}], // Reference(DiagnosticOrder|ProcedureRequest|ReferralRequest)  What was requested
            specimen: [{}], // Reference(Specimen)  Specimens this report is based on
            result: [{}], // Reference(Observation) Observations - simple, or complex nested groups
            imagingStudy: [{}], // Reference(ImagingStudy|ImagingObjectSelection)  Reference to full details of imaging associated with the diagnostic report
            image: [{ // Key images associated with this report
                comment: "<string>", // Comment about the image (e.g. explanation)
                link: fdt.required({}) // Reference(Media) R!  Reference to the image source
            }],
            conclusion: "<string>", // Clinical Interpretation of test results
            codedDiagnosis: [{}], // CodeableConcept , Codes for the conclusion
            presentedForm: [bm] // Attachment , Entire report as issued
        });

    }


    // "cytology_nongyn-63"
    function cytology_nongyn(cn) {
        return fdt.clean({

            resourceType: "DiagnosticReport",
            // from Resource: id, meta, implicitRules, and language
            identifier: identifier,
            // from DomainResource: text, contained, extension, and modifierExtension
            status: fdt.required({coding: ["final"]}), // R!  registered | partial | final | corrected | appended | cancelled | entered-in-error

            category: {coding: ['oth'], text: "Other"}, // CodeableConcept, Service category, http://hl7-fhir.github.io/valueset-diagnostic-service-sections.html
            code: fdt.required({}), // R!  Name/Code for this diagnostic report, loinc http://hl7-fhir.github.io/valueset-report-codes.html
            subject: fdt.required(patient), // Reference(Patient|Group|Device|Location) R!  The subject of the report, usually, but not always, the patient
            encounter: {}, // Reference(Encounter) Health care event when test ordered
            // effective[x]: Clinically Relevant time/time-period for report. One of these 2:
            effectiveDateTime: "<dateTime>",
            effectivePeriod: {}, // Period
            issued: fdt.required("<instant>"), // R!  DateTime this version was released
            performer: fdt.required({}), // Reference(Practitioner|Organization) R!  Responsible Diagnostic Service
            request: [{}], // Reference(DiagnosticOrder|ProcedureRequest|ReferralRequest)  What was requested
            specimen: [{}], // Reference(Specimen)  Specimens this report is based on
            result: [{}], // Reference(Observation) Observations - simple, or complex nested groups
            imagingStudy: [{}], // Reference(ImagingStudy|ImagingObjectSelection)  Reference to full details of imaging associated with the diagnostic report
            image: [{ // Key images associated with this report
                comment: "<string>", // Comment about the image (e.g. explanation)
                link: fdt.required({}) // Reference(Media) R!  Reference to the image source
            }],
            conclusion: "<string>", // Clinical Interpretation of test results
            codedDiagnosis: [{}], // CodeableConcept , Codes for the conclusion
            presentedForm: [cn] // Attachment , Entire report as issued
        });

    }


    // "parasitology-63"
    function parasitology(p) {
        return fdt.clean({

            resourceType: "DiagnosticReport",
            // from Resource: id, meta, implicitRules, and language
            identifier: identifier,
            // from DomainResource: text, contained, extension, and modifierExtension
            status: fdt.required({coding: ["final"]}), // R!  registered | partial | final | corrected | appended | cancelled | entered-in-error

            category: {coding: ['par'], text: "Parasitology"}, // CodeableConcept, Service category, http://hl7-fhir.github.io/valueset-diagnostic-service-sections.html
            code: fdt.required({}), // R!  Name/Code for this diagnostic report, loinc http://hl7-fhir.github.io/valueset-report-codes.html
            subject: fdt.required(patient), // Reference(Patient|Group|Device|Location) R!  The subject of the report, usually, but not always, the patient
            encounter: {}, // Reference(Encounter) Health care event when test ordered
            // effective[x]: Clinically Relevant time/time-period for report. One of these 2:
            effectiveDateTime: "<dateTime>",
            effectivePeriod: {}, // Period
            issued: fdt.required("<instant>"), // R!  DateTime this version was released
            performer: fdt.required({}), // Reference(Practitioner|Organization) R!  Responsible Diagnostic Service
            request: [{}], // Reference(DiagnosticOrder|ProcedureRequest|ReferralRequest)  What was requested
            specimen: [{}], // Reference(Specimen)  Specimens this report is based on
            result: [{}], // Reference(Observation) Observations - simple, or complex nested groups
            imagingStudy: [{}], // Reference(ImagingStudy|ImagingObjectSelection)  Reference to full details of imaging associated with the diagnostic report
            image: [{ // Key images associated with this report
                comment: "<string>", // Comment about the image (e.g. explanation)
                link: fdt.required({}) // Reference(Media) R!  Reference to the image source
            }],
            conclusion: "<string>", // Clinical Interpretation of test results
            codedDiagnosis: [{}], // CodeableConcept , Codes for the conclusion
            presentedForm: [p] // Attachment , Entire report as issued
        });
    }


    // "bacteriology-63"
    function bacteriology(b) {
        return fdt.clean({

            resourceType: "DiagnosticReport",
            // from Resource: id, meta, implicitRules, and language
            identifier: identifier,
            // from DomainResource: text, contained, extension, and modifierExtension
            status: fdt.required({coding: ["final"]}), // R!  registered | partial | final | corrected | appended | cancelled | entered-in-error

            category: {coding: ['oth'], text: "Other"}, // CodeableConcept, Service category, http://hl7-fhir.github.io/valueset-diagnostic-service-sections.html
            code: fdt.required({}), // R!  Name/Code for this diagnostic report, loinc http://hl7-fhir.github.io/valueset-report-codes.html
            subject: fdt.required(patient), // Reference(Patient|Group|Device|Location) R!  The subject of the report, usually, but not always, the patient
            encounter: {}, // Reference(Encounter) Health care event when test ordered
            // effective[x]: Clinically Relevant time/time-period for report. One of these 2:
            effectiveDateTime: "<dateTime>",
            effectivePeriod: {}, // Period
            issued: fdt.required("<instant>"), // R!  DateTime this version was released
            performer: fdt.required({}), // Reference(Practitioner|Organization) R!  Responsible Diagnostic Service
            request: [{}], // Reference(DiagnosticOrder|ProcedureRequest|ReferralRequest)  What was requested
            specimen: [{}], // Reference(Specimen)  Specimens this report is based on
            result: [{}], // Reference(Observation) Observations - simple, or complex nested groups
            imagingStudy: [{}], // Reference(ImagingStudy|ImagingObjectSelection)  Reference to full details of imaging associated with the diagnostic report
            image: [{ // Key images associated with this report
                comment: "<string>", // Comment about the image (e.g. explanation)
                link: fdt.required({}) // Reference(Media) R!  Reference to the image source
            }],
            conclusion: "<string>", // Clinical Interpretation of test results
            codedDiagnosis: [{}], // CodeableConcept , Codes for the conclusion
            presentedForm: [b] // Attachment , Entire report as issued
        });
    }


    // "mycobacterium-63"
    function mycobacterium(m) {
        return fdt.clean({

            resourceType: "DiagnosticReport",
            // from Resource: id, meta, implicitRules, and language
            identifier: identifier,
            // from DomainResource: text, contained, extension, and modifierExtension
            status: fdt.required({coding: ["final"]}), // R!  registered | partial | final | corrected | appended | cancelled | entered-in-error

            category: {coding: ['mcb'], text: "Mycobacteriology"}, // CodeableConcept, Service category, http://hl7-fhir.github.io/valueset-diagnostic-service-sections.html
            code: fdt.required({}), // R!  Name/Code for this diagnostic report, loinc http://hl7-fhir.github.io/valueset-report-codes.html
            subject: fdt.required(patient), // Reference(Patient|Group|Device|Location) R!  The subject of the report, usually, but not always, the patient
            encounter: {}, // Reference(Encounter) Health care event when test ordered
            // effective[x]: Clinically Relevant time/time-period for report. One of these 2:
            effectiveDateTime: "<dateTime>",
            effectivePeriod: {}, // Period
            issued: fdt.required("<instant>"), // R!  DateTime this version was released
            performer: fdt.required({}), // Reference(Practitioner|Organization) R!  Responsible Diagnostic Service
            request: [{}], // Reference(DiagnosticOrder|ProcedureRequest|ReferralRequest)  What was requested
            specimen: [{}], // Reference(Specimen)  Specimens this report is based on
            result: [{}], // Reference(Observation) Observations - simple, or complex nested groups
            imagingStudy: [{}], // Reference(ImagingStudy|ImagingObjectSelection)  Reference to full details of imaging associated with the diagnostic report
            image: [{ // Key images associated with this report
                comment: "<string>", // Comment about the image (e.g. explanation)
                link: fdt.required({}) // Reference(Media) R!  Reference to the image source
            }],
            conclusion: "<string>", // Clinical Interpretation of test results
            codedDiagnosis: [{}], // CodeableConcept , Codes for the conclusion
            presentedForm: [m] // Attachment , Entire report as issued
        });
    }


    // "mycology-63"
    function mycology(m) {
        return fdt.clean({

            resourceType: "DiagnosticReport",
            // from Resource: id, meta, implicitRules, and language
            identifier: identifier,
            // from DomainResource: text, contained, extension, and modifierExtension
            status: fdt.required({coding: ["final"]}), // R!  registered | partial | final | corrected | appended | cancelled | entered-in-error

            category: {coding: ['myc'], text: "Mycology"}, // CodeableConcept, Service category, http://hl7-fhir.github.io/valueset-diagnostic-service-sections.html
            code: fdt.required({}), // R!  Name/Code for this diagnostic report, loinc http://hl7-fhir.github.io/valueset-report-codes.html
            subject: fdt.required(patient), // Reference(Patient|Group|Device|Location) R!  The subject of the report, usually, but not always, the patient
            encounter: {}, // Reference(Encounter) Health care event when test ordered
            // effective[x]: Clinically Relevant time/time-period for report. One of these 2:
            effectiveDateTime: "<dateTime>",
            effectivePeriod: {}, // Period
            issued: fdt.required("<instant>"), // R!  DateTime this version was released
            performer: fdt.required({}), // Reference(Practitioner|Organization) R!  Responsible Diagnostic Service
            request: [{}], // Reference(DiagnosticOrder|ProcedureRequest|ReferralRequest)  What was requested
            specimen: [{}], // Reference(Specimen)  Specimens this report is based on
            result: [{}], // Reference(Observation) Observations - simple, or complex nested groups
            imagingStudy: [{}], // Reference(ImagingStudy|ImagingObjectSelection)  Reference to full details of imaging associated with the diagnostic report
            image: [{ // Key images associated with this report
                comment: "<string>", // Comment about the image (e.g. explanation)
                link: fdt.required({}) // Reference(Media) R!  Reference to the image source
            }],
            conclusion: "<string>", // Clinical Interpretation of test results
            codedDiagnosis: [{}], // CodeableConcept , Codes for the conclusion
            presentedForm: [m] // Attachment , Entire report as issued
        });
    }


    // "virology-63"
    function virology(v) {
        return fdt.clean({

            resourceType: "DiagnosticReport",
            id: fdt.fhirId(resourceType, eat('$._id')),
            // from Resource: id, meta, implicitRules, and language
            identifier: identifier,
            // from DomainResource: text, contained, extension, and modifierExtension
            status: fdt.required({coding: ["final"]}), // R!  registered | partial | final | corrected | appended | cancelled | entered-in-error

            category: {coding: ['vr'], text: "Virology"}, // CodeableConcept, Service category, http://hl7-fhir.github.io/valueset-diagnostic-service-sections.html
            code: fdt.required({}), // R!  Name/Code for this diagnostic report, loinc http://hl7-fhir.github.io/valueset-report-codes.html
            subject: fdt.required(patient), // Reference(Patient|Group|Device|Location) R!  The subject of the report, usually, but not always, the patient
            encounter: {}, // Reference(Encounter) Health care event when test ordered
            // effective[x]: Clinically Relevant time/time-period for report. One of these 2:
            effectiveDateTime: "<dateTime>",
            effectivePeriod: {}, // Period
            issued: fdt.required("<instant>"), // R!  DateTime this version was released
            performer: fdt.required({}), // Reference(Practitioner|Organization) R!  Responsible Diagnostic Service
            request: [{}], // Reference(DiagnosticOrder|ProcedureRequest|ReferralRequest)  What was requested
            specimen: [{}], // Reference(Specimen)  Specimens this report is based on
            result: [{}], // Reference(Observation) Observations - simple, or complex nested groups
            imagingStudy: [{}], // Reference(ImagingStudy|ImagingObjectSelection)  Reference to full details of imaging associated with the diagnostic report
            image: [{ // Key images associated with this report
                comment: "<string>", // Comment about the image (e.g. explanation)
                link: fdt.required({}) // Reference(Media) R!  Reference to the image source
            }],
            conclusion: "<string>", // Clinical Interpretation of test results
            codedDiagnosis: [{}], // CodeableConcept , Codes for the conclusion
            presentedForm: [c] // Attachment , Entire report as issued
        });
    }






    var labKinds = [micro_conversion, blood_bank, clinical_chemistry,
        parasitology_buffer, bacteriology_buffer, mycobacterium_buffer, mycology_buffer,
        virology_buffer, delta_check, surgical_pathology, cytology_gyn,
        autopsy, bone_marrow, cytology_nongyn, parasitology, bacteriology,
        mycobacterium, mycology, virology];

    var fhirDiagnosticReports = [];
    // Take the cross product of all lab kinds, labKinds by their appearances in a Lab_Reports-63 object and
    // push their translations onto fhirDiagnosticReports.
    labKinds.forEach(function(lk) {
        eat("$." + lk.name + '-63', function (l) {
            if (l) l.forEach(function(i) {
                fhirDiagnosticReports.push(lk(i));
            });
        });
    });

    if (options.participants) fhir.addParticipants(fhirDiagnosticReports, participatingProperties, prefix);
    if (options.warnings) fhir.addWarnings(fhirDiagnosticReports, warnings);
    fdt.clean(fhirDiagnosticReports);
    // Additional semantic processing here

    // var used = new Av();
    // participatingProperties.forEach(function (p) {
    //     var prop = p.substring(1);
    //     eval('used' + prop + '= chcsLabResultObjectModified' + prop);
    // });
    // var object_used = chcs_utils.devivify(used);
    //
    // if (options.eat) {
    //     participatingProperties.forEach(function(p){
    //         var prop = p.substring(1);
    //         eval('delete chcsLabResultObjectModified' + prop);
    //     });
    // }

    return {
        // used: object_used,
        fhir: fhirDiagnosticReports,
        participants: participatingProperties,
        options: options
    };
}

var translate = translateLabsFhir;

// Export the actual functions here. Make sure the names are always consistent.
[translateLabsFhir, translate].forEach(function(f) { module.exports[f.name] = f; });
