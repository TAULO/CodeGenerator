export default {
  resourceType: "Bundle",
  id: "b2a4443f-a6ac-4378-89fd-8a9759675d09",
  type: "searchset",
  link: [
    {
      relation: "self",
      url:
        "https://fhir-ehr.sandboxcerner.com/r4/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/MedicationRequest?patient=4342012"
    },
    {
      relation: "next",
      url:
        "https://fhir-ehr.sandboxcerner.com/r4/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/MedicationRequest?patient=4342012&-pageContext=87314553_87314554_4342012_4464007_1&-pageDirection=NEXT"
    }
  ],
  entry: [
    {
      fullUrl:
        "https://fhir-ehr.sandboxcerner.com/r4/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/MedicationRequest/22717913",
      resource: {
        resourceType: "MedicationRequest",
        id: "22717913",
        meta: {
          versionId: "0",
          lastUpdated: "2017-09-07T15:33:25.000Z"
        },
        text: {
          status: "generated",
          div:
            '<div xmlns="http://www.w3.org/1999/xhtml"><p><b>Medication Request</b></p><p><b>Status</b>: Active</p><p><b>Intent</b>: Order</p><p><b>Medication</b>: Dextrose 2.5% with 0.45% NaCl 1000 mL</p><p><b>Dosage Instructions</b>: 30 mL/hr, IV</p><p><b>Patient</b>: SMART, Timmy</p><p><b>Authored On</b>: Sep  7, 2017  3:33 P.M. UTC</p></div>'
        },
        status: "active",
        intent: "order",
        category: [
          {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/medicationrequest-category",
                code: "outpatient",
                display: "Outpatient",
                userSelected: false
              }
            ]
          }
        ],
        reportedBoolean: false,
        medicationCodeableConcept: {
          coding: [
            {
              system: "http://www.nlm.nih.gov/research/umls/rxnorm",
              code: "244095",
              display:
                "Glucose 25 MG/ML / Sodium Chloride 0.0769 MEQ/ML Injectable Solution",
              userSelected: false
            }
          ],
          text: "Dextrose 2.5% with 0.45% NaCl 1000 mL"
        },
        subject: {
          reference: "Patient/4342012",
          display: "SMART, Timmy"
        },
        encounter: {
          reference: "Encounter/4027933"
        },
        authoredOn: "2017-09-07T10:33:04.000-05:00",
        requester: {
          reference: "Practitioner/3622007",
          display: "Argonaut, Test"
        },
        dosageInstruction: [
          {
            text: "30 mL/hr, IV",
            patientInstruction: "30 Milliliter/hour Intravenous. Refills: 0.",
            timing: {
              repeat: {
                boundsPeriod: {
                  start: "2017-09-07T08:33:00.000-07:00"
                },
                duration: 33.3,
                durationUnit: "h"
              }
            },
            route: {
              coding: [
                {
                  system:
                    "https://fhir.cerner.com/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/codeSet/4001",
                  code: "318170",
                  display: "IV",
                  userSelected: true
                },
                {
                  system: "http://snomed.info/sct",
                  code: "47625008",
                  display: "Intravenous route (qualifier value)",
                  userSelected: false
                }
              ],
              text: "IV"
            },
            doseAndRate: [
              {
                doseQuantity: {
                  value: 1000.0,
                  unit: "mL",
                  system: "http://unitsofmeasure.org",
                  code: "mL"
                },
                rateQuantity: {
                  value: 30.0,
                  unit: "mL/hr",
                  system: "http://unitsofmeasure.org",
                  code: "mL/h"
                }
              }
            ]
          }
        ],
        dispenseRequest: {
          validityPeriod: {
            start: "2017-09-07T10:33:04.000-05:00"
          }
        }
      }
    },
    {
      fullUrl:
        "https://fhir-ehr.sandboxcerner.com/r4/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/MedicationRequest/22589913",
      resource: {
        resourceType: "MedicationRequest",
        id: "22589913",
        meta: {
          versionId: "0",
          lastUpdated: "2017-07-27T21:22:44.000Z"
        },
        text: {
          status: "generated",
          div:
            '<div xmlns="http://www.w3.org/1999/xhtml"><p><b>Medication Request</b></p><p><b>Status</b>: Active</p><p><b>Intent</b>: Order</p><p><b>Medication</b>: Misc Prescription (Med1)</p><p><b>Patient</b>: SMART, Timmy</p><p><b>Authored On</b>: Jul 27, 2017  9:22 P.M. UTC</p></div>'
        },
        status: "active",
        intent: "order",
        category: [
          {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/medicationrequest-category",
                code: "community",
                display: "Community",
                userSelected: false
              }
            ]
          },
          {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/medication-statement-category",
                code: "patientspecified",
                display: "Patient Specified",
                userSelected: false
              }
            ]
          }
        ],
        reportedBoolean: true,
        medicationCodeableConcept: {
          text: "Misc Prescription (Med1)"
        },
        subject: {
          reference: "Patient/4342012",
          display: "SMART, Timmy"
        },
        encounter: {
          reference: "Encounter/4027930"
        },
        authoredOn: "2017-07-27T14:22:39.000-07:00",
        requester: {
          extension: [
            {
              url: "http://hl7.org/fhir/StructureDefinition/data-absent-reason",
              valueCode: "unknown"
            }
          ]
        },
        courseOfTherapyType: {
          coding: [
            {
              system:
                "https://fhir.cerner.com/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/codeSet/4009",
              code: "2338",
              display: "Soft Stop",
              userSelected: true
            },
            {
              system:
                "http://terminology.hl7.org/CodeSystem/medicationrequest-course-of-therapy",
              code: "continuous",
              display: "Continuous long term therapy",
              userSelected: false
            }
          ],
          text: "Soft Stop"
        },
        dosageInstruction: [
          {
            timing: {
              repeat: {
                boundsPeriod: {
                  start: "2017-07-27T14:22:00.000-07:00"
                }
              }
            }
          }
        ],
        dispenseRequest: {
          validityPeriod: {
            start: "2017-07-27T14:22:39.000-07:00"
          }
        }
      }
    },
    {
      fullUrl:
        "https://fhir-ehr.sandboxcerner.com/r4/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/MedicationRequest/22589923",
      resource: {
        resourceType: "MedicationRequest",
        id: "22589923",
        meta: {
          versionId: "0",
          lastUpdated: "2017-07-27T21:23:11.000Z"
        },
        text: {
          status: "generated",
          div:
            '<div xmlns="http://www.w3.org/1999/xhtml"><p><b>Medication Request</b></p><p><b>Status</b>: Active</p><p><b>Intent</b>: Order</p><p><b>Medication</b>: Misc Prescription (Med2)</p><p><b>Patient</b>: SMART, Timmy</p><p><b>Authored On</b>: Jul 27, 2017  9:23 P.M. UTC</p></div>'
        },
        status: "active",
        intent: "order",
        category: [
          {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/medicationrequest-category",
                code: "community",
                display: "Community",
                userSelected: false
              }
            ]
          },
          {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/medication-statement-category",
                code: "patientspecified",
                display: "Patient Specified",
                userSelected: false
              }
            ]
          }
        ],
        reportedBoolean: true,
        medicationCodeableConcept: {
          text: "Misc Prescription (Med2)"
        },
        subject: {
          reference: "Patient/4342012",
          display: "SMART, Timmy"
        },
        encounter: {
          reference: "Encounter/4027930"
        },
        authoredOn: "2017-07-27T14:23:11.000-07:00",
        requester: {
          extension: [
            {
              url: "http://hl7.org/fhir/StructureDefinition/data-absent-reason",
              valueCode: "unknown"
            }
          ]
        },
        courseOfTherapyType: {
          coding: [
            {
              system:
                "https://fhir.cerner.com/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/codeSet/4009",
              code: "2338",
              display: "Soft Stop",
              userSelected: true
            },
            {
              system:
                "http://terminology.hl7.org/CodeSystem/medicationrequest-course-of-therapy",
              code: "continuous",
              display: "Continuous long term therapy",
              userSelected: false
            }
          ],
          text: "Soft Stop"
        },
        dosageInstruction: [
          {
            timing: {
              repeat: {
                boundsPeriod: {
                  start: "2017-07-27T14:23:00.000-07:00"
                }
              }
            }
          }
        ],
        dispenseRequest: {
          validityPeriod: {
            start: "2017-07-27T14:23:11.000-07:00"
          }
        }
      }
    },
    {
      fullUrl:
        "https://fhir-ehr.sandboxcerner.com/r4/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/MedicationRequest/22589933",
      resource: {
        resourceType: "MedicationRequest",
        id: "22589933",
        meta: {
          versionId: "0",
          lastUpdated: "2017-07-27T21:25:10.000Z"
        },
        text: {
          status: "generated",
          div:
            '<div xmlns="http://www.w3.org/1999/xhtml"><p><b>Medication Request</b></p><p><b>Status</b>: Active</p><p><b>Intent</b>: Order</p><p><b>Medication</b>: Misc Prescription (Med2)</p><p><b>Patient</b>: SMART, Timmy</p><p><b>Authored On</b>: Jul 27, 2017  9:25 P.M. UTC</p></div>'
        },
        status: "active",
        intent: "order",
        category: [
          {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/medicationrequest-category",
                code: "community",
                display: "Community",
                userSelected: false
              }
            ]
          },
          {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/medication-statement-category",
                code: "patientspecified",
                display: "Patient Specified",
                userSelected: false
              }
            ]
          }
        ],
        reportedBoolean: true,
        medicationCodeableConcept: {
          text: "Misc Prescription (Med2)"
        },
        subject: {
          reference: "Patient/4342012",
          display: "SMART, Timmy"
        },
        encounter: {
          reference: "Encounter/4027930"
        },
        authoredOn: "2017-07-27T14:25:10.000-07:00",
        requester: {
          extension: [
            {
              url: "http://hl7.org/fhir/StructureDefinition/data-absent-reason",
              valueCode: "unknown"
            }
          ]
        },
        courseOfTherapyType: {
          coding: [
            {
              system:
                "https://fhir.cerner.com/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/codeSet/4009",
              code: "2338",
              display: "Soft Stop",
              userSelected: true
            },
            {
              system:
                "http://terminology.hl7.org/CodeSystem/medicationrequest-course-of-therapy",
              code: "continuous",
              display: "Continuous long term therapy",
              userSelected: false
            }
          ],
          text: "Soft Stop"
        },
        dosageInstruction: [
          {
            timing: {
              repeat: {
                boundsPeriod: {
                  start: "2017-07-27T14:25:00.000-07:00"
                }
              }
            }
          }
        ],
        dispenseRequest: {
          validityPeriod: {
            start: "2017-07-27T14:25:10.000-07:00"
          }
        }
      }
    },
    {
      fullUrl:
        "https://fhir-ehr.sandboxcerner.com/r4/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/MedicationRequest/22589943",
      resource: {
        resourceType: "MedicationRequest",
        id: "22589943",
        meta: {
          versionId: "0",
          lastUpdated: "2017-07-28T12:50:26.000Z"
        },
        text: {
          status: "generated",
          div:
            '<div xmlns="http://www.w3.org/1999/xhtml"><p><b>Medication Request</b></p><p><b>Status</b>: Active</p><p><b>Intent</b>: Order</p><p><b>Medication</b>: Misc Prescription (Applesauce)</p><p><b>Patient</b>: SMART, Timmy</p><p><b>Authored On</b>: Jul 28, 2017 12:50 P.M. UTC</p></div>'
        },
        status: "active",
        intent: "order",
        category: [
          {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/medicationrequest-category",
                code: "community",
                display: "Community",
                userSelected: false
              }
            ]
          },
          {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/medication-statement-category",
                code: "patientspecified",
                display: "Patient Specified",
                userSelected: false
              }
            ]
          }
        ],
        reportedBoolean: true,
        medicationCodeableConcept: {
          text: "Misc Prescription (Applesauce)"
        },
        subject: {
          reference: "Patient/4342012",
          display: "SMART, Timmy"
        },
        encounter: {
          reference: "Encounter/4027930"
        },
        authoredOn: "2017-07-28T05:50:23.000-07:00",
        requester: {
          extension: [
            {
              url: "http://hl7.org/fhir/StructureDefinition/data-absent-reason",
              valueCode: "unknown"
            }
          ]
        },
        courseOfTherapyType: {
          coding: [
            {
              system:
                "https://fhir.cerner.com/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/codeSet/4009",
              code: "2338",
              display: "Soft Stop",
              userSelected: true
            },
            {
              system:
                "http://terminology.hl7.org/CodeSystem/medicationrequest-course-of-therapy",
              code: "continuous",
              display: "Continuous long term therapy",
              userSelected: false
            }
          ],
          text: "Soft Stop"
        },
        dosageInstruction: [
          {
            timing: {
              repeat: {
                boundsPeriod: {
                  start: "2017-07-28T05:50:00.000-07:00"
                }
              }
            }
          }
        ],
        dispenseRequest: {
          validityPeriod: {
            start: "2017-07-28T05:50:23.000-07:00"
          }
        }
      }
    },
    {
      fullUrl:
        "https://fhir-ehr.sandboxcerner.com/r4/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/MedicationRequest/22589953",
      resource: {
        resourceType: "MedicationRequest",
        id: "22589953",
        meta: {
          versionId: "0",
          lastUpdated: "2017-07-28T12:52:13.000Z"
        },
        text: {
          status: "generated",
          div:
            '<div xmlns="http://www.w3.org/1999/xhtml"><p><b>Medication Request</b></p><p><b>Status</b>: Active</p><p><b>Intent</b>: Order</p><p><b>Medication</b>: Misc Prescription (Apple a day)</p><p><b>Patient</b>: SMART, Timmy</p><p><b>Authored On</b>: Jul 28, 2017 12:52 P.M. UTC</p></div>'
        },
        status: "active",
        intent: "order",
        category: [
          {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/medicationrequest-category",
                code: "community",
                display: "Community",
                userSelected: false
              }
            ]
          },
          {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/medication-statement-category",
                code: "patientspecified",
                display: "Patient Specified",
                userSelected: false
              }
            ]
          }
        ],
        reportedBoolean: true,
        medicationCodeableConcept: {
          text: "Misc Prescription (Apple a day)"
        },
        subject: {
          reference: "Patient/4342012",
          display: "SMART, Timmy"
        },
        encounter: {
          reference: "Encounter/4027930"
        },
        authoredOn: "2017-07-28T05:52:12.000-07:00",
        requester: {
          extension: [
            {
              url: "http://hl7.org/fhir/StructureDefinition/data-absent-reason",
              valueCode: "unknown"
            }
          ]
        },
        courseOfTherapyType: {
          coding: [
            {
              system:
                "https://fhir.cerner.com/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/codeSet/4009",
              code: "2338",
              display: "Soft Stop",
              userSelected: true
            },
            {
              system:
                "http://terminology.hl7.org/CodeSystem/medicationrequest-course-of-therapy",
              code: "continuous",
              display: "Continuous long term therapy",
              userSelected: false
            }
          ],
          text: "Soft Stop"
        },
        dosageInstruction: [
          {
            timing: {
              repeat: {
                boundsPeriod: {
                  start: "2017-07-28T05:52:00.000-07:00"
                }
              }
            }
          }
        ],
        dispenseRequest: {
          validityPeriod: {
            start: "2017-07-28T05:52:12.000-07:00"
          }
        }
      }
    },
    {
      fullUrl:
        "https://fhir-ehr.sandboxcerner.com/r4/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/MedicationRequest/22589963",
      resource: {
        resourceType: "MedicationRequest",
        id: "22589963",
        meta: {
          versionId: "0",
          lastUpdated: "2017-07-28T13:19:43.000Z"
        },
        text: {
          status: "generated",
          div:
            '<div xmlns="http://www.w3.org/1999/xhtml"><p><b>Medication Request</b></p><p><b>Status</b>: Active</p><p><b>Intent</b>: Order</p><p><b>Medication</b>: Misc Prescription (Banana)</p><p><b>Patient</b>: SMART, Timmy</p><p><b>Authored On</b>: Jul 28, 2017  1:19 P.M. UTC</p></div>'
        },
        status: "active",
        intent: "order",
        category: [
          {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/medicationrequest-category",
                code: "community",
                display: "Community",
                userSelected: false
              }
            ]
          },
          {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/medication-statement-category",
                code: "patientspecified",
                display: "Patient Specified",
                userSelected: false
              }
            ]
          }
        ],
        reportedBoolean: true,
        medicationCodeableConcept: {
          text: "Misc Prescription (Banana)"
        },
        subject: {
          reference: "Patient/4342012",
          display: "SMART, Timmy"
        },
        encounter: {
          reference: "Encounter/4027930"
        },
        authoredOn: "2017-07-28T06:19:41.000-07:00",
        requester: {
          extension: [
            {
              url: "http://hl7.org/fhir/StructureDefinition/data-absent-reason",
              valueCode: "unknown"
            }
          ]
        },
        courseOfTherapyType: {
          coding: [
            {
              system:
                "https://fhir.cerner.com/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/codeSet/4009",
              code: "2338",
              display: "Soft Stop",
              userSelected: true
            },
            {
              system:
                "http://terminology.hl7.org/CodeSystem/medicationrequest-course-of-therapy",
              code: "continuous",
              display: "Continuous long term therapy",
              userSelected: false
            }
          ],
          text: "Soft Stop"
        },
        dosageInstruction: [
          {
            timing: {
              repeat: {
                boundsPeriod: {
                  start: "2017-07-28T06:19:00.000-07:00"
                }
              }
            }
          }
        ],
        dispenseRequest: {
          validityPeriod: {
            start: "2017-07-28T06:19:41.000-07:00"
          }
        }
      }
    },
    {
      fullUrl:
        "https://fhir-ehr.sandboxcerner.com/r4/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/MedicationRequest/22589973",
      resource: {
        resourceType: "MedicationRequest",
        id: "22589973",
        meta: {
          versionId: "0",
          lastUpdated: "2017-07-28T13:20:33.000Z"
        },
        text: {
          status: "generated",
          div:
            '<div xmlns="http://www.w3.org/1999/xhtml"><p><b>Medication Request</b></p><p><b>Status</b>: Active</p><p><b>Intent</b>: Order</p><p><b>Medication</b>: Misc Prescription (newmed)</p><p><b>Patient</b>: SMART, Timmy</p><p><b>Authored On</b>: Jul 28, 2017  1:20 P.M. UTC</p></div>'
        },
        status: "active",
        intent: "order",
        category: [
          {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/medicationrequest-category",
                code: "community",
                display: "Community",
                userSelected: false
              }
            ]
          },
          {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/medication-statement-category",
                code: "patientspecified",
                display: "Patient Specified",
                userSelected: false
              }
            ]
          }
        ],
        reportedBoolean: true,
        medicationCodeableConcept: {
          text: "Misc Prescription (newmed)"
        },
        subject: {
          reference: "Patient/4342012",
          display: "SMART, Timmy"
        },
        encounter: {
          reference: "Encounter/4027930"
        },
        authoredOn: "2017-07-28T06:20:33.000-07:00",
        requester: {
          extension: [
            {
              url: "http://hl7.org/fhir/StructureDefinition/data-absent-reason",
              valueCode: "unknown"
            }
          ]
        },
        courseOfTherapyType: {
          coding: [
            {
              system:
                "https://fhir.cerner.com/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/codeSet/4009",
              code: "2338",
              display: "Soft Stop",
              userSelected: true
            },
            {
              system:
                "http://terminology.hl7.org/CodeSystem/medicationrequest-course-of-therapy",
              code: "continuous",
              display: "Continuous long term therapy",
              userSelected: false
            }
          ],
          text: "Soft Stop"
        },
        dosageInstruction: [
          {
            timing: {
              repeat: {
                boundsPeriod: {
                  start: "2017-07-28T06:20:00.000-07:00"
                }
              }
            }
          }
        ],
        dispenseRequest: {
          validityPeriod: {
            start: "2017-07-28T06:20:33.000-07:00"
          }
        }
      }
    },
    {
      fullUrl:
        "https://fhir-ehr.sandboxcerner.com/r4/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/MedicationRequest/22589983",
      resource: {
        resourceType: "MedicationRequest",
        id: "22589983",
        meta: {
          versionId: "0",
          lastUpdated: "2017-07-28T13:25:21.000Z"
        },
        text: {
          status: "generated",
          div:
            '<div xmlns="http://www.w3.org/1999/xhtml"><p><b>Medication Request</b></p><p><b>Status</b>: Active</p><p><b>Intent</b>: Order</p><p><b>Medication</b>: Misc Prescription (Med3)</p><p><b>Patient</b>: SMART, Timmy</p><p><b>Authored On</b>: Jul 28, 2017  1:25 P.M. UTC</p></div>'
        },
        status: "active",
        intent: "order",
        category: [
          {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/medicationrequest-category",
                code: "community",
                display: "Community",
                userSelected: false
              }
            ]
          },
          {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/medication-statement-category",
                code: "patientspecified",
                display: "Patient Specified",
                userSelected: false
              }
            ]
          }
        ],
        reportedBoolean: true,
        medicationCodeableConcept: {
          text: "Misc Prescription (Med3)"
        },
        subject: {
          reference: "Patient/4342012",
          display: "SMART, Timmy"
        },
        encounter: {
          reference: "Encounter/4027930"
        },
        authoredOn: "2017-07-28T06:25:21.000-07:00",
        requester: {
          extension: [
            {
              url: "http://hl7.org/fhir/StructureDefinition/data-absent-reason",
              valueCode: "unknown"
            }
          ]
        },
        courseOfTherapyType: {
          coding: [
            {
              system:
                "https://fhir.cerner.com/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/codeSet/4009",
              code: "2338",
              display: "Soft Stop",
              userSelected: true
            },
            {
              system:
                "http://terminology.hl7.org/CodeSystem/medicationrequest-course-of-therapy",
              code: "continuous",
              display: "Continuous long term therapy",
              userSelected: false
            }
          ],
          text: "Soft Stop"
        },
        dosageInstruction: [
          {
            timing: {
              repeat: {
                boundsPeriod: {
                  start: "2017-07-28T06:25:00.000-07:00"
                }
              }
            }
          }
        ],
        dispenseRequest: {
          validityPeriod: {
            start: "2017-07-28T06:25:21.000-07:00"
          }
        }
      }
    },
    {
      fullUrl:
        "https://fhir-ehr.sandboxcerner.com/r4/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/MedicationRequest/22589993",
      resource: {
        resourceType: "MedicationRequest",
        id: "22589993",
        meta: {
          versionId: "0",
          lastUpdated: "2017-07-28T13:53:00.000Z"
        },
        text: {
          status: "generated",
          div:
            '<div xmlns="http://www.w3.org/1999/xhtml"><p><b>Medication Request</b></p><p><b>Status</b>: Active</p><p><b>Intent</b>: Order</p><p><b>Medication</b>: Misc Prescription (Med4)</p><p><b>Patient</b>: SMART, Timmy</p><p><b>Authored On</b>: Jul 28, 2017  1:53 P.M. UTC</p></div>'
        },
        status: "active",
        intent: "order",
        category: [
          {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/medicationrequest-category",
                code: "community",
                display: "Community",
                userSelected: false
              }
            ]
          },
          {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/medication-statement-category",
                code: "patientspecified",
                display: "Patient Specified",
                userSelected: false
              }
            ]
          }
        ],
        reportedBoolean: true,
        medicationCodeableConcept: {
          text: "Misc Prescription (Med4)"
        },
        subject: {
          reference: "Patient/4342012",
          display: "SMART, Timmy"
        },
        encounter: {
          reference: "Encounter/4027930"
        },
        authoredOn: "2017-07-28T06:53:00.000-07:00",
        requester: {
          extension: [
            {
              url: "http://hl7.org/fhir/StructureDefinition/data-absent-reason",
              valueCode: "unknown"
            }
          ]
        },
        courseOfTherapyType: {
          coding: [
            {
              system:
                "https://fhir.cerner.com/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/codeSet/4009",
              code: "2338",
              display: "Soft Stop",
              userSelected: true
            },
            {
              system:
                "http://terminology.hl7.org/CodeSystem/medicationrequest-course-of-therapy",
              code: "continuous",
              display: "Continuous long term therapy",
              userSelected: false
            }
          ],
          text: "Soft Stop"
        },
        dosageInstruction: [
          {
            timing: {
              repeat: {
                boundsPeriod: {
                  start: "2017-07-28T06:52:00.000-07:00"
                }
              }
            }
          }
        ],
        dispenseRequest: {
          validityPeriod: {
            start: "2017-07-28T06:53:00.000-07:00"
          }
        }
      }
    },
    {
      fullUrl:
        "https://fhir-ehr.sandboxcerner.com/r4/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/MedicationRequest/22590003",
      resource: {
        resourceType: "MedicationRequest",
        id: "22590003",
        meta: {
          versionId: "0",
          lastUpdated: "2017-07-28T13:53:01.000Z"
        },
        text: {
          status: "generated",
          div:
            '<div xmlns="http://www.w3.org/1999/xhtml"><p><b>Medication Request</b></p><p><b>Status</b>: Active</p><p><b>Intent</b>: Order</p><p><b>Medication</b>: Misc Prescription (Med4)</p><p><b>Patient</b>: SMART, Timmy</p><p><b>Authored On</b>: Jul 28, 2017  1:53 P.M. UTC</p></div>'
        },
        status: "active",
        intent: "order",
        category: [
          {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/medicationrequest-category",
                code: "community",
                display: "Community",
                userSelected: false
              }
            ]
          },
          {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/medication-statement-category",
                code: "patientspecified",
                display: "Patient Specified",
                userSelected: false
              }
            ]
          }
        ],
        reportedBoolean: true,
        medicationCodeableConcept: {
          text: "Misc Prescription (Med4)"
        },
        subject: {
          reference: "Patient/4342012",
          display: "SMART, Timmy"
        },
        encounter: {
          reference: "Encounter/4027930"
        },
        authoredOn: "2017-07-28T06:53:01.000-07:00",
        requester: {
          extension: [
            {
              url: "http://hl7.org/fhir/StructureDefinition/data-absent-reason",
              valueCode: "unknown"
            }
          ]
        },
        courseOfTherapyType: {
          coding: [
            {
              system:
                "https://fhir.cerner.com/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/codeSet/4009",
              code: "2338",
              display: "Soft Stop",
              userSelected: true
            },
            {
              system:
                "http://terminology.hl7.org/CodeSystem/medicationrequest-course-of-therapy",
              code: "continuous",
              display: "Continuous long term therapy",
              userSelected: false
            }
          ],
          text: "Soft Stop"
        },
        dosageInstruction: [
          {
            timing: {
              repeat: {
                boundsPeriod: {
                  start: "2017-07-28T06:53:00.000-07:00"
                }
              }
            }
          }
        ],
        dispenseRequest: {
          validityPeriod: {
            start: "2017-07-28T06:53:01.000-07:00"
          }
        }
      }
    },
    {
      fullUrl:
        "https://fhir-ehr.sandboxcerner.com/r4/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/MedicationRequest/22590013",
      resource: {
        resourceType: "MedicationRequest",
        id: "22590013",
        meta: {
          versionId: "0",
          lastUpdated: "2017-07-28T13:53:18.000Z"
        },
        text: {
          status: "generated",
          div:
            '<div xmlns="http://www.w3.org/1999/xhtml"><p><b>Medication Request</b></p><p><b>Status</b>: Active</p><p><b>Intent</b>: Order</p><p><b>Medication</b>: Misc Prescription (Med4)</p><p><b>Patient</b>: SMART, Timmy</p><p><b>Authored On</b>: Jul 28, 2017  1:53 P.M. UTC</p></div>'
        },
        status: "active",
        intent: "order",
        category: [
          {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/medicationrequest-category",
                code: "community",
                display: "Community",
                userSelected: false
              }
            ]
          },
          {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/medication-statement-category",
                code: "patientspecified",
                display: "Patient Specified",
                userSelected: false
              }
            ]
          }
        ],
        reportedBoolean: true,
        medicationCodeableConcept: {
          text: "Misc Prescription (Med4)"
        },
        subject: {
          reference: "Patient/4342012",
          display: "SMART, Timmy"
        },
        encounter: {
          reference: "Encounter/4027930"
        },
        authoredOn: "2017-07-28T06:53:18.000-07:00",
        requester: {
          extension: [
            {
              url: "http://hl7.org/fhir/StructureDefinition/data-absent-reason",
              valueCode: "unknown"
            }
          ]
        },
        courseOfTherapyType: {
          coding: [
            {
              system:
                "https://fhir.cerner.com/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/codeSet/4009",
              code: "2338",
              display: "Soft Stop",
              userSelected: true
            },
            {
              system:
                "http://terminology.hl7.org/CodeSystem/medicationrequest-course-of-therapy",
              code: "continuous",
              display: "Continuous long term therapy",
              userSelected: false
            }
          ],
          text: "Soft Stop"
        },
        dosageInstruction: [
          {
            timing: {
              repeat: {
                boundsPeriod: {
                  start: "2017-07-28T06:53:00.000-07:00"
                }
              }
            }
          }
        ],
        dispenseRequest: {
          validityPeriod: {
            start: "2017-07-28T06:53:18.000-07:00"
          }
        }
      }
    },
    {
      fullUrl:
        "https://fhir-ehr.sandboxcerner.com/r4/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/MedicationRequest/22590023",
      resource: {
        resourceType: "MedicationRequest",
        id: "22590023",
        meta: {
          versionId: "0",
          lastUpdated: "2017-07-28T13:55:57.000Z"
        },
        text: {
          status: "generated",
          div:
            '<div xmlns="http://www.w3.org/1999/xhtml"><p><b>Medication Request</b></p><p><b>Status</b>: Active</p><p><b>Intent</b>: Order</p><p><b>Medication</b>: Misc Prescription (Med5)</p><p><b>Patient</b>: SMART, Timmy</p><p><b>Authored On</b>: Jul 28, 2017  1:55 P.M. UTC</p></div>'
        },
        status: "active",
        intent: "order",
        category: [
          {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/medicationrequest-category",
                code: "community",
                display: "Community",
                userSelected: false
              }
            ]
          },
          {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/medication-statement-category",
                code: "patientspecified",
                display: "Patient Specified",
                userSelected: false
              }
            ]
          }
        ],
        reportedBoolean: true,
        medicationCodeableConcept: {
          text: "Misc Prescription (Med5)"
        },
        subject: {
          reference: "Patient/4342012",
          display: "SMART, Timmy"
        },
        encounter: {
          reference: "Encounter/4027930"
        },
        authoredOn: "2017-07-28T06:55:57.000-07:00",
        requester: {
          extension: [
            {
              url: "http://hl7.org/fhir/StructureDefinition/data-absent-reason",
              valueCode: "unknown"
            }
          ]
        },
        courseOfTherapyType: {
          coding: [
            {
              system:
                "https://fhir.cerner.com/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/codeSet/4009",
              code: "2338",
              display: "Soft Stop",
              userSelected: true
            },
            {
              system:
                "http://terminology.hl7.org/CodeSystem/medicationrequest-course-of-therapy",
              code: "continuous",
              display: "Continuous long term therapy",
              userSelected: false
            }
          ],
          text: "Soft Stop"
        },
        dosageInstruction: [
          {
            timing: {
              repeat: {
                boundsPeriod: {
                  start: "2017-07-28T06:55:00.000-07:00"
                }
              }
            }
          }
        ],
        dispenseRequest: {
          validityPeriod: {
            start: "2017-07-28T06:55:57.000-07:00"
          }
        }
      }
    },
    {
      fullUrl:
        "https://fhir-ehr.sandboxcerner.com/r4/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/MedicationRequest/22590033",
      resource: {
        resourceType: "MedicationRequest",
        id: "22590033",
        meta: {
          versionId: "0",
          lastUpdated: "2017-07-28T13:56:20.000Z"
        },
        text: {
          status: "generated",
          div:
            '<div xmlns="http://www.w3.org/1999/xhtml"><p><b>Medication Request</b></p><p><b>Status</b>: Active</p><p><b>Intent</b>: Order</p><p><b>Medication</b>: Misc Prescription (Newest Med)</p><p><b>Patient</b>: SMART, Timmy</p><p><b>Authored On</b>: Jul 28, 2017  1:56 P.M. UTC</p></div>'
        },
        status: "active",
        intent: "order",
        category: [
          {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/medicationrequest-category",
                code: "community",
                display: "Community",
                userSelected: false
              }
            ]
          },
          {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/medication-statement-category",
                code: "patientspecified",
                display: "Patient Specified",
                userSelected: false
              }
            ]
          }
        ],
        reportedBoolean: true,
        medicationCodeableConcept: {
          text: "Misc Prescription (Newest Med)"
        },
        subject: {
          reference: "Patient/4342012",
          display: "SMART, Timmy"
        },
        encounter: {
          reference: "Encounter/4027930"
        },
        authoredOn: "2017-07-28T06:56:20.000-07:00",
        requester: {
          extension: [
            {
              url: "http://hl7.org/fhir/StructureDefinition/data-absent-reason",
              valueCode: "unknown"
            }
          ]
        },
        courseOfTherapyType: {
          coding: [
            {
              system:
                "https://fhir.cerner.com/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/codeSet/4009",
              code: "2338",
              display: "Soft Stop",
              userSelected: true
            },
            {
              system:
                "http://terminology.hl7.org/CodeSystem/medicationrequest-course-of-therapy",
              code: "continuous",
              display: "Continuous long term therapy",
              userSelected: false
            }
          ],
          text: "Soft Stop"
        },
        dosageInstruction: [
          {
            timing: {
              repeat: {
                boundsPeriod: {
                  start: "2017-07-28T06:56:00.000-07:00"
                }
              }
            }
          }
        ],
        dispenseRequest: {
          validityPeriod: {
            start: "2017-07-28T06:56:20.000-07:00"
          }
        }
      }
    },
    {
      fullUrl:
        "https://fhir-ehr.sandboxcerner.com/r4/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/MedicationRequest/22590043",
      resource: {
        resourceType: "MedicationRequest",
        id: "22590043",
        meta: {
          versionId: "0",
          lastUpdated: "2017-07-28T14:00:02.000Z"
        },
        text: {
          status: "generated",
          div:
            '<div xmlns="http://www.w3.org/1999/xhtml"><p><b>Medication Request</b></p><p><b>Status</b>: Active</p><p><b>Intent</b>: Order</p><p><b>Medication</b>: Misc Prescription (Glargine)</p><p><b>Patient</b>: SMART, Timmy</p><p><b>Authored On</b>: Jul 28, 2017  2:00 P.M. UTC</p></div>'
        },
        status: "active",
        intent: "order",
        category: [
          {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/medicationrequest-category",
                code: "community",
                display: "Community",
                userSelected: false
              }
            ]
          },
          {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/medication-statement-category",
                code: "patientspecified",
                display: "Patient Specified",
                userSelected: false
              }
            ]
          }
        ],
        reportedBoolean: true,
        medicationCodeableConcept: {
          text: "Misc Prescription (Glargine)"
        },
        subject: {
          reference: "Patient/4342012",
          display: "SMART, Timmy"
        },
        encounter: {
          reference: "Encounter/4027930"
        },
        authoredOn: "2017-07-28T07:00:02.000-07:00",
        requester: {
          extension: [
            {
              url: "http://hl7.org/fhir/StructureDefinition/data-absent-reason",
              valueCode: "unknown"
            }
          ]
        },
        courseOfTherapyType: {
          coding: [
            {
              system:
                "https://fhir.cerner.com/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/codeSet/4009",
              code: "2338",
              display: "Soft Stop",
              userSelected: true
            },
            {
              system:
                "http://terminology.hl7.org/CodeSystem/medicationrequest-course-of-therapy",
              code: "continuous",
              display: "Continuous long term therapy",
              userSelected: false
            }
          ],
          text: "Soft Stop"
        },
        dosageInstruction: [
          {
            timing: {
              repeat: {
                boundsPeriod: {
                  start: "2017-07-28T07:00:00.000-07:00"
                }
              }
            }
          }
        ],
        dispenseRequest: {
          validityPeriod: {
            start: "2017-07-28T07:00:02.000-07:00"
          }
        }
      }
    },
    {
      fullUrl:
        "https://fhir-ehr.sandboxcerner.com/r4/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/MedicationRequest/22590053",
      resource: {
        resourceType: "MedicationRequest",
        id: "22590053",
        meta: {
          versionId: "0",
          lastUpdated: "2017-07-28T14:00:14.000Z"
        },
        text: {
          status: "generated",
          div:
            '<div xmlns="http://www.w3.org/1999/xhtml"><p><b>Medication Request</b></p><p><b>Status</b>: Active</p><p><b>Intent</b>: Order</p><p><b>Medication</b>: Misc Prescription (Aspirin)</p><p><b>Patient</b>: SMART, Timmy</p><p><b>Authored On</b>: Jul 28, 2017  2:00 P.M. UTC</p></div>'
        },
        status: "active",
        intent: "order",
        category: [
          {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/medicationrequest-category",
                code: "community",
                display: "Community",
                userSelected: false
              }
            ]
          },
          {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/medication-statement-category",
                code: "patientspecified",
                display: "Patient Specified",
                userSelected: false
              }
            ]
          }
        ],
        reportedBoolean: true,
        medicationCodeableConcept: {
          text: "Misc Prescription (Aspirin)"
        },
        subject: {
          reference: "Patient/4342012",
          display: "SMART, Timmy"
        },
        encounter: {
          reference: "Encounter/4027930"
        },
        authoredOn: "2017-07-28T07:00:14.000-07:00",
        requester: {
          extension: [
            {
              url: "http://hl7.org/fhir/StructureDefinition/data-absent-reason",
              valueCode: "unknown"
            }
          ]
        },
        courseOfTherapyType: {
          coding: [
            {
              system:
                "https://fhir.cerner.com/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/codeSet/4009",
              code: "2338",
              display: "Soft Stop",
              userSelected: true
            },
            {
              system:
                "http://terminology.hl7.org/CodeSystem/medicationrequest-course-of-therapy",
              code: "continuous",
              display: "Continuous long term therapy",
              userSelected: false
            }
          ],
          text: "Soft Stop"
        },
        dosageInstruction: [
          {
            timing: {
              repeat: {
                boundsPeriod: {
                  start: "2017-07-28T07:00:00.000-07:00"
                }
              }
            }
          }
        ],
        dispenseRequest: {
          validityPeriod: {
            start: "2017-07-28T07:00:14.000-07:00"
          }
        }
      }
    },
    {
      fullUrl:
        "https://fhir-ehr.sandboxcerner.com/r4/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/MedicationRequest/22590063",
      resource: {
        resourceType: "MedicationRequest",
        id: "22590063",
        meta: {
          versionId: "0",
          lastUpdated: "2017-07-28T14:23:41.000Z"
        },
        text: {
          status: "generated",
          div:
            '<div xmlns="http://www.w3.org/1999/xhtml"><p><b>Medication Request</b></p><p><b>Status</b>: Active</p><p><b>Intent</b>: Order</p><p><b>Medication</b>: Misc Prescription (Placebo)</p><p><b>Patient</b>: SMART, Timmy</p><p><b>Authored On</b>: Jul 28, 2017  2:23 P.M. UTC</p></div>'
        },
        status: "active",
        intent: "order",
        category: [
          {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/medicationrequest-category",
                code: "community",
                display: "Community",
                userSelected: false
              }
            ]
          },
          {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/medication-statement-category",
                code: "patientspecified",
                display: "Patient Specified",
                userSelected: false
              }
            ]
          }
        ],
        reportedBoolean: true,
        medicationCodeableConcept: {
          text: "Misc Prescription (Placebo)"
        },
        subject: {
          reference: "Patient/4342012",
          display: "SMART, Timmy"
        },
        encounter: {
          reference: "Encounter/4027930"
        },
        authoredOn: "2017-07-28T07:23:40.000-07:00",
        requester: {
          extension: [
            {
              url: "http://hl7.org/fhir/StructureDefinition/data-absent-reason",
              valueCode: "unknown"
            }
          ]
        },
        courseOfTherapyType: {
          coding: [
            {
              system:
                "https://fhir.cerner.com/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/codeSet/4009",
              code: "2338",
              display: "Soft Stop",
              userSelected: true
            },
            {
              system:
                "http://terminology.hl7.org/CodeSystem/medicationrequest-course-of-therapy",
              code: "continuous",
              display: "Continuous long term therapy",
              userSelected: false
            }
          ],
          text: "Soft Stop"
        },
        dosageInstruction: [
          {
            timing: {
              repeat: {
                boundsPeriod: {
                  start: "2017-07-28T07:23:00.000-07:00"
                }
              }
            }
          }
        ],
        dispenseRequest: {
          validityPeriod: {
            start: "2017-07-28T07:23:40.000-07:00"
          }
        }
      }
    },
    {
      fullUrl:
        "https://fhir-ehr.sandboxcerner.com/r4/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/MedicationRequest/22590073",
      resource: {
        resourceType: "MedicationRequest",
        id: "22590073",
        meta: {
          versionId: "0",
          lastUpdated: "2017-07-28T14:25:37.000Z"
        },
        text: {
          status: "generated",
          div:
            '<div xmlns="http://www.w3.org/1999/xhtml"><p><b>Medication Request</b></p><p><b>Status</b>: Active</p><p><b>Intent</b>: Order</p><p><b>Medication</b>: Misc Prescription (Glargine)</p><p><b>Patient</b>: SMART, Timmy</p><p><b>Authored On</b>: Jul 28, 2017  2:25 P.M. UTC</p></div>'
        },
        status: "active",
        intent: "order",
        category: [
          {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/medicationrequest-category",
                code: "community",
                display: "Community",
                userSelected: false
              }
            ]
          },
          {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/medication-statement-category",
                code: "patientspecified",
                display: "Patient Specified",
                userSelected: false
              }
            ]
          }
        ],
        reportedBoolean: true,
        medicationCodeableConcept: {
          text: "Misc Prescription (Glargine)"
        },
        subject: {
          reference: "Patient/4342012",
          display: "SMART, Timmy"
        },
        encounter: {
          reference: "Encounter/4027930"
        },
        authoredOn: "2017-07-28T07:25:37.000-07:00",
        requester: {
          extension: [
            {
              url: "http://hl7.org/fhir/StructureDefinition/data-absent-reason",
              valueCode: "unknown"
            }
          ]
        },
        courseOfTherapyType: {
          coding: [
            {
              system:
                "https://fhir.cerner.com/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/codeSet/4009",
              code: "2338",
              display: "Soft Stop",
              userSelected: true
            },
            {
              system:
                "http://terminology.hl7.org/CodeSystem/medicationrequest-course-of-therapy",
              code: "continuous",
              display: "Continuous long term therapy",
              userSelected: false
            }
          ],
          text: "Soft Stop"
        },
        dosageInstruction: [
          {
            timing: {
              repeat: {
                boundsPeriod: {
                  start: "2017-07-28T07:25:00.000-07:00"
                }
              }
            }
          }
        ],
        dispenseRequest: {
          validityPeriod: {
            start: "2017-07-28T07:25:37.000-07:00"
          }
        }
      }
    },
    {
      fullUrl:
        "https://fhir-ehr.sandboxcerner.com/r4/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/MedicationRequest/22590083",
      resource: {
        resourceType: "MedicationRequest",
        id: "22590083",
        meta: {
          versionId: "0",
          lastUpdated: "2017-07-28T14:26:22.000Z"
        },
        text: {
          status: "generated",
          div:
            '<div xmlns="http://www.w3.org/1999/xhtml"><p><b>Medication Request</b></p><p><b>Status</b>: Active</p><p><b>Intent</b>: Order</p><p><b>Medication</b>: Misc Prescription (Glargine)</p><p><b>Patient</b>: SMART, Timmy</p><p><b>Authored On</b>: Jul 28, 2017  2:26 P.M. UTC</p></div>'
        },
        status: "active",
        intent: "order",
        category: [
          {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/medicationrequest-category",
                code: "community",
                display: "Community",
                userSelected: false
              }
            ]
          },
          {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/medication-statement-category",
                code: "patientspecified",
                display: "Patient Specified",
                userSelected: false
              }
            ]
          }
        ],
        reportedBoolean: true,
        medicationCodeableConcept: {
          text: "Misc Prescription (Glargine)"
        },
        subject: {
          reference: "Patient/4342012",
          display: "SMART, Timmy"
        },
        encounter: {
          reference: "Encounter/4027930"
        },
        authoredOn: "2017-07-28T07:26:22.000-07:00",
        requester: {
          extension: [
            {
              url: "http://hl7.org/fhir/StructureDefinition/data-absent-reason",
              valueCode: "unknown"
            }
          ]
        },
        courseOfTherapyType: {
          coding: [
            {
              system:
                "https://fhir.cerner.com/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/codeSet/4009",
              code: "2338",
              display: "Soft Stop",
              userSelected: true
            },
            {
              system:
                "http://terminology.hl7.org/CodeSystem/medicationrequest-course-of-therapy",
              code: "continuous",
              display: "Continuous long term therapy",
              userSelected: false
            }
          ],
          text: "Soft Stop"
        },
        dosageInstruction: [
          {
            timing: {
              repeat: {
                boundsPeriod: {
                  start: "2017-07-28T07:26:00.000-07:00"
                }
              }
            }
          }
        ],
        dispenseRequest: {
          validityPeriod: {
            start: "2017-07-28T07:26:22.000-07:00"
          }
        }
      }
    },
    {
      fullUrl:
        "https://fhir-ehr.sandboxcerner.com/r4/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/MedicationRequest/22590093",
      resource: {
        resourceType: "MedicationRequest",
        id: "22590093",
        meta: {
          versionId: "0",
          lastUpdated: "2017-07-28T14:34:02.000Z"
        },
        text: {
          status: "generated",
          div:
            '<div xmlns="http://www.w3.org/1999/xhtml"><p><b>Medication Request</b></p><p><b>Status</b>: Active</p><p><b>Intent</b>: Order</p><p><b>Medication</b>: Misc Prescription (Water)</p><p><b>Patient</b>: SMART, Timmy</p><p><b>Authored On</b>: Jul 28, 2017  2:34 P.M. UTC</p></div>'
        },
        status: "active",
        intent: "order",
        category: [
          {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/medicationrequest-category",
                code: "community",
                display: "Community",
                userSelected: false
              }
            ]
          },
          {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/medication-statement-category",
                code: "patientspecified",
                display: "Patient Specified",
                userSelected: false
              }
            ]
          }
        ],
        reportedBoolean: true,
        medicationCodeableConcept: {
          text: "Misc Prescription (Water)"
        },
        subject: {
          reference: "Patient/4342012",
          display: "SMART, Timmy"
        },
        encounter: {
          reference: "Encounter/4027930"
        },
        authoredOn: "2017-07-28T07:34:02.000-07:00",
        requester: {
          extension: [
            {
              url: "http://hl7.org/fhir/StructureDefinition/data-absent-reason",
              valueCode: "unknown"
            }
          ]
        },
        courseOfTherapyType: {
          coding: [
            {
              system:
                "https://fhir.cerner.com/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/codeSet/4009",
              code: "2338",
              display: "Soft Stop",
              userSelected: true
            },
            {
              system:
                "http://terminology.hl7.org/CodeSystem/medicationrequest-course-of-therapy",
              code: "continuous",
              display: "Continuous long term therapy",
              userSelected: false
            }
          ],
          text: "Soft Stop"
        },
        dosageInstruction: [
          {
            timing: {
              repeat: {
                boundsPeriod: {
                  start: "2017-07-28T07:34:00.000-07:00"
                }
              }
            }
          }
        ],
        dispenseRequest: {
          validityPeriod: {
            start: "2017-07-28T07:34:02.000-07:00"
          }
        }
      }
    },
    {
      fullUrl:
        "https://fhir-ehr.sandboxcerner.com/r4/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/MedicationRequest/22590103",
      resource: {
        resourceType: "MedicationRequest",
        id: "22590103",
        meta: {
          versionId: "0",
          lastUpdated: "2017-07-28T14:35:03.000Z"
        },
        text: {
          status: "generated",
          div:
            '<div xmlns="http://www.w3.org/1999/xhtml"><p><b>Medication Request</b></p><p><b>Status</b>: Active</p><p><b>Intent</b>: Order</p><p><b>Medication</b>: Misc Prescription (Glargine)</p><p><b>Patient</b>: SMART, Timmy</p><p><b>Authored On</b>: Jul 28, 2017  2:35 P.M. UTC</p></div>'
        },
        status: "active",
        intent: "order",
        category: [
          {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/medicationrequest-category",
                code: "community",
                display: "Community",
                userSelected: false
              }
            ]
          },
          {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/medication-statement-category",
                code: "patientspecified",
                display: "Patient Specified",
                userSelected: false
              }
            ]
          }
        ],
        reportedBoolean: true,
        medicationCodeableConcept: {
          text: "Misc Prescription (Glargine)"
        },
        subject: {
          reference: "Patient/4342012",
          display: "SMART, Timmy"
        },
        encounter: {
          reference: "Encounter/4027930"
        },
        authoredOn: "2017-07-28T07:35:03.000-07:00",
        requester: {
          extension: [
            {
              url: "http://hl7.org/fhir/StructureDefinition/data-absent-reason",
              valueCode: "unknown"
            }
          ]
        },
        courseOfTherapyType: {
          coding: [
            {
              system:
                "https://fhir.cerner.com/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/codeSet/4009",
              code: "2338",
              display: "Soft Stop",
              userSelected: true
            },
            {
              system:
                "http://terminology.hl7.org/CodeSystem/medicationrequest-course-of-therapy",
              code: "continuous",
              display: "Continuous long term therapy",
              userSelected: false
            }
          ],
          text: "Soft Stop"
        },
        dosageInstruction: [
          {
            timing: {
              repeat: {
                boundsPeriod: {
                  start: "2017-07-28T07:35:00.000-07:00"
                }
              }
            }
          }
        ],
        dispenseRequest: {
          validityPeriod: {
            start: "2017-07-28T07:35:03.000-07:00"
          }
        }
      }
    },
    {
      fullUrl:
        "https://fhir-ehr.sandboxcerner.com/r4/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/MedicationRequest/22590113",
      resource: {
        resourceType: "MedicationRequest",
        id: "22590113",
        meta: {
          versionId: "0",
          lastUpdated: "2017-07-28T14:37:29.000Z"
        },
        text: {
          status: "generated",
          div:
            '<div xmlns="http://www.w3.org/1999/xhtml"><p><b>Medication Request</b></p><p><b>Status</b>: Active</p><p><b>Intent</b>: Order</p><p><b>Medication</b>: Misc Prescription (Water)</p><p><b>Patient</b>: SMART, Timmy</p><p><b>Authored On</b>: Jul 28, 2017  2:37 P.M. UTC</p></div>'
        },
        status: "active",
        intent: "order",
        category: [
          {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/medicationrequest-category",
                code: "community",
                display: "Community",
                userSelected: false
              }
            ]
          },
          {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/medication-statement-category",
                code: "patientspecified",
                display: "Patient Specified",
                userSelected: false
              }
            ]
          }
        ],
        reportedBoolean: true,
        medicationCodeableConcept: {
          text: "Misc Prescription (Water)"
        },
        subject: {
          reference: "Patient/4342012",
          display: "SMART, Timmy"
        },
        encounter: {
          reference: "Encounter/4027930"
        },
        authoredOn: "2017-07-28T07:37:29.000-07:00",
        requester: {
          extension: [
            {
              url: "http://hl7.org/fhir/StructureDefinition/data-absent-reason",
              valueCode: "unknown"
            }
          ]
        },
        courseOfTherapyType: {
          coding: [
            {
              system:
                "https://fhir.cerner.com/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/codeSet/4009",
              code: "2338",
              display: "Soft Stop",
              userSelected: true
            },
            {
              system:
                "http://terminology.hl7.org/CodeSystem/medicationrequest-course-of-therapy",
              code: "continuous",
              display: "Continuous long term therapy",
              userSelected: false
            }
          ],
          text: "Soft Stop"
        },
        dosageInstruction: [
          {
            timing: {
              repeat: {
                boundsPeriod: {
                  start: "2017-07-28T07:37:00.000-07:00"
                }
              }
            }
          }
        ],
        dispenseRequest: {
          validityPeriod: {
            start: "2017-07-28T07:37:29.000-07:00"
          }
        }
      }
    },
    {
      fullUrl:
        "https://fhir-ehr.sandboxcerner.com/r4/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/MedicationRequest/22590123",
      resource: {
        resourceType: "MedicationRequest",
        id: "22590123",
        meta: {
          versionId: "0",
          lastUpdated: "2017-07-28T14:38:22.000Z"
        },
        text: {
          status: "generated",
          div:
            '<div xmlns="http://www.w3.org/1999/xhtml"><p><b>Medication Request</b></p><p><b>Status</b>: Active</p><p><b>Intent</b>: Order</p><p><b>Medication</b>: Misc Prescription (Apple)</p><p><b>Patient</b>: SMART, Timmy</p><p><b>Authored On</b>: Jul 28, 2017  2:38 P.M. UTC</p></div>'
        },
        status: "active",
        intent: "order",
        category: [
          {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/medicationrequest-category",
                code: "community",
                display: "Community",
                userSelected: false
              }
            ]
          },
          {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/medication-statement-category",
                code: "patientspecified",
                display: "Patient Specified",
                userSelected: false
              }
            ]
          }
        ],
        reportedBoolean: true,
        medicationCodeableConcept: {
          text: "Misc Prescription (Apple)"
        },
        subject: {
          reference: "Patient/4342012",
          display: "SMART, Timmy"
        },
        encounter: {
          reference: "Encounter/4027930"
        },
        authoredOn: "2017-07-28T07:38:22.000-07:00",
        requester: {
          extension: [
            {
              url: "http://hl7.org/fhir/StructureDefinition/data-absent-reason",
              valueCode: "unknown"
            }
          ]
        },
        courseOfTherapyType: {
          coding: [
            {
              system:
                "https://fhir.cerner.com/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/codeSet/4009",
              code: "2338",
              display: "Soft Stop",
              userSelected: true
            },
            {
              system:
                "http://terminology.hl7.org/CodeSystem/medicationrequest-course-of-therapy",
              code: "continuous",
              display: "Continuous long term therapy",
              userSelected: false
            }
          ],
          text: "Soft Stop"
        },
        dosageInstruction: [
          {
            timing: {
              repeat: {
                boundsPeriod: {
                  start: "2017-07-28T07:38:00.000-07:00"
                }
              }
            }
          }
        ],
        dispenseRequest: {
          validityPeriod: {
            start: "2017-07-28T07:38:22.000-07:00"
          }
        }
      }
    },
    {
      fullUrl:
        "https://fhir-ehr.sandboxcerner.com/r4/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/MedicationRequest/22590133",
      resource: {
        resourceType: "MedicationRequest",
        id: "22590133",
        meta: {
          versionId: "0",
          lastUpdated: "2017-07-28T14:39:16.000Z"
        },
        text: {
          status: "generated",
          div:
            '<div xmlns="http://www.w3.org/1999/xhtml"><p><b>Medication Request</b></p><p><b>Status</b>: Active</p><p><b>Intent</b>: Order</p><p><b>Medication</b>: Misc Prescription (Glargine)</p><p><b>Patient</b>: SMART, Timmy</p><p><b>Authored On</b>: Jul 28, 2017  2:39 P.M. UTC</p></div>'
        },
        status: "active",
        intent: "order",
        category: [
          {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/medicationrequest-category",
                code: "community",
                display: "Community",
                userSelected: false
              }
            ]
          },
          {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/medication-statement-category",
                code: "patientspecified",
                display: "Patient Specified",
                userSelected: false
              }
            ]
          }
        ],
        reportedBoolean: true,
        medicationCodeableConcept: {
          text: "Misc Prescription (Glargine)"
        },
        subject: {
          reference: "Patient/4342012",
          display: "SMART, Timmy"
        },
        encounter: {
          reference: "Encounter/4027930"
        },
        authoredOn: "2017-07-28T07:39:16.000-07:00",
        requester: {
          extension: [
            {
              url: "http://hl7.org/fhir/StructureDefinition/data-absent-reason",
              valueCode: "unknown"
            }
          ]
        },
        courseOfTherapyType: {
          coding: [
            {
              system:
                "https://fhir.cerner.com/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/codeSet/4009",
              code: "2338",
              display: "Soft Stop",
              userSelected: true
            },
            {
              system:
                "http://terminology.hl7.org/CodeSystem/medicationrequest-course-of-therapy",
              code: "continuous",
              display: "Continuous long term therapy",
              userSelected: false
            }
          ],
          text: "Soft Stop"
        },
        dosageInstruction: [
          {
            timing: {
              repeat: {
                boundsPeriod: {
                  start: "2017-07-28T07:39:00.000-07:00"
                }
              }
            }
          }
        ],
        dispenseRequest: {
          validityPeriod: {
            start: "2017-07-28T07:39:16.000-07:00"
          }
        }
      }
    },
    {
      fullUrl:
        "https://fhir-ehr.sandboxcerner.com/r4/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/MedicationRequest/22590143",
      resource: {
        resourceType: "MedicationRequest",
        id: "22590143",
        meta: {
          versionId: "0",
          lastUpdated: "2017-07-28T14:39:37.000Z"
        },
        text: {
          status: "generated",
          div:
            '<div xmlns="http://www.w3.org/1999/xhtml"><p><b>Medication Request</b></p><p><b>Status</b>: Active</p><p><b>Intent</b>: Order</p><p><b>Medication</b>: Misc Prescription (Two)</p><p><b>Patient</b>: SMART, Timmy</p><p><b>Authored On</b>: Jul 28, 2017  2:39 P.M. UTC</p></div>'
        },
        status: "active",
        intent: "order",
        category: [
          {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/medicationrequest-category",
                code: "community",
                display: "Community",
                userSelected: false
              }
            ]
          },
          {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/medication-statement-category",
                code: "patientspecified",
                display: "Patient Specified",
                userSelected: false
              }
            ]
          }
        ],
        reportedBoolean: true,
        medicationCodeableConcept: {
          text: "Misc Prescription (Two)"
        },
        subject: {
          reference: "Patient/4342012",
          display: "SMART, Timmy"
        },
        encounter: {
          reference: "Encounter/4027930"
        },
        authoredOn: "2017-07-28T07:39:37.000-07:00",
        requester: {
          extension: [
            {
              url: "http://hl7.org/fhir/StructureDefinition/data-absent-reason",
              valueCode: "unknown"
            }
          ]
        },
        courseOfTherapyType: {
          coding: [
            {
              system:
                "https://fhir.cerner.com/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/codeSet/4009",
              code: "2338",
              display: "Soft Stop",
              userSelected: true
            },
            {
              system:
                "http://terminology.hl7.org/CodeSystem/medicationrequest-course-of-therapy",
              code: "continuous",
              display: "Continuous long term therapy",
              userSelected: false
            }
          ],
          text: "Soft Stop"
        },
        dosageInstruction: [
          {
            timing: {
              repeat: {
                boundsPeriod: {
                  start: "2017-07-28T07:39:00.000-07:00"
                }
              }
            }
          }
        ],
        dispenseRequest: {
          validityPeriod: {
            start: "2017-07-28T07:39:37.000-07:00"
          }
        }
      }
    }
  ]
};
