module.exports = {
  "resourceType" : "StructureDefinition",
  "id" : "Practitioner",
  "meta" : {
    "lastUpdated" : "2019-11-01T09:29:23.356+11:00"
  },
  "text" : {
    "status" : "generated",
    "div" : "<div>!-- Snipped for Brevity --></div>"
  },
  "extension" : [{
    "url" : "http://hl7.org/fhir/StructureDefinition/structuredefinition-category",
    "valueString" : "Base.Individuals"
  },
  {
    "url" : "http://hl7.org/fhir/StructureDefinition/structuredefinition-standards-status",
    "valueCode" : "trial-use"
  },
  {
    "url" : "http://hl7.org/fhir/StructureDefinition/structuredefinition-fmm",
    "valueInteger" : 3
  },
  {
    "url" : "http://hl7.org/fhir/StructureDefinition/structuredefinition-security-category",
    "valueCode" : "individual"
  },
  {
    "url" : "http://hl7.org/fhir/StructureDefinition/structuredefinition-wg",
    "valueCode" : "pa"
  }],
  "url" : "http://hl7.org/fhir/StructureDefinition/Practitioner",
  "version" : "4.0.1",
  "name" : "Practitioner",
  "status" : "draft",
  "date" : "2019-11-01T09:29:23+11:00",
  "publisher" : "Health Level Seven International (Patient Administration)",
  "contact" : [{
    "telecom" : [{
      "system" : "url",
      "value" : "http://hl7.org/fhir"
    }]
  },
  {
    "telecom" : [{
      "system" : "url",
      "value" : "http://www.hl7.org/Special/committees/pafm/index.cfm"
    }]
  }],
  "description" : "A person who is directly or indirectly involved in the provisioning of healthcare.",
  "purpose" : "Need to track doctors, staff, locums etc. for both healthcare practitioners, funders, etc.",
  "fhirVersion" : "4.0.1",
  "mapping" : [{
    "identity" : "v2",
    "uri" : "http://hl7.org/v2",
    "name" : "HL7 v2 Mapping"
  },
  {
    "identity" : "rim",
    "uri" : "http://hl7.org/v3",
    "name" : "RIM Mapping"
  },
  {
    "identity" : "servd",
    "uri" : "http://www.omg.org/spec/ServD/1.0/",
    "name" : "ServD"
  },
  {
    "identity" : "w5",
    "uri" : "http://hl7.org/fhir/fivews",
    "name" : "FiveWs Pattern Mapping"
  }],
  "kind" : "resource",
  "abstract" : false,
  "type" : "Practitioner",
  "baseDefinition" : "http://hl7.org/fhir/StructureDefinition/DomainResource",
  "derivation" : "specialization",
  "snapshot" : {
    "element" : [{
      "id" : "Practitioner",
      "path" : "Practitioner",
      "short" : "A person with a  formal responsibility in the provisioning of healthcare or related services",
      "definition" : "A person who is directly or indirectly involved in the provisioning of healthcare.",
      "min" : 0,
      "max" : "*",
      "base" : {
        "path" : "Practitioner",
        "min" : 0,
        "max" : "*"
      },
      "constraint" : [{
        "key" : "dom-2",
        "severity" : "error",
        "human" : "If the resource is contained in another resource, it SHALL NOT contain nested Resources",
        "expression" : "contained.contained.empty()",
        "xpath" : "not(parent::f:contained and f:contained)",
        "source" : "http://hl7.org/fhir/StructureDefinition/DomainResource"
      },
      {
        "key" : "dom-3",
        "severity" : "error",
        "human" : "If the resource is contained in another resource, it SHALL be referred to from elsewhere in the resource or SHALL refer to the containing resource",
        "expression" : "contained.where((('#'+id in (%resource.descendants().reference | %resource.descendants().as(canonical) | %resource.descendants().as(uri) | %resource.descendants().as(url))) or descendants().where(reference = '#').exists() or descendants().where(as(canonical) = '#').exists() or descendants().where(as(canonical) = '#').exists()).not()).trace('unmatched', id).empty()",
        "xpath" : "not(exists(for $id in f:contained/*/f:id/@value return $contained[not(parent::*/descendant::f:reference/@value=concat('#', $contained/*/id/@value) or descendant::f:reference[@value='#'])]))",
        "source" : "http://hl7.org/fhir/StructureDefinition/DomainResource"
      },
      {
        "key" : "dom-4",
        "severity" : "error",
        "human" : "If a resource is contained in another resource, it SHALL NOT have a meta.versionId or a meta.lastUpdated",
        "expression" : "contained.meta.versionId.empty() and contained.meta.lastUpdated.empty()",
        "xpath" : "not(exists(f:contained/*/f:meta/f:versionId)) and not(exists(f:contained/*/f:meta/f:lastUpdated))",
        "source" : "http://hl7.org/fhir/StructureDefinition/DomainResource"
      },
      {
        "key" : "dom-5",
        "severity" : "error",
        "human" : "If a resource is contained in another resource, it SHALL NOT have a security label",
        "expression" : "contained.meta.security.empty()",
        "xpath" : "not(exists(f:contained/*/f:meta/f:security))",
        "source" : "http://hl7.org/fhir/StructureDefinition/DomainResource"
      },
      {
        "extension" : [{
          "url" : "http://hl7.org/fhir/StructureDefinition/elementdefinition-bestpractice",
          "valueBoolean" : true
        },
        {
          "url" : "http://hl7.org/fhir/StructureDefinition/elementdefinition-bestpractice-explanation",
          "valueMarkdown" : "When a resource has no narrative, only systems that fully understand the data can display the resource to a human safely. Including a human readable representation in the resource makes for a much more robust eco-system and cheaper handling of resources by intermediary systems. Some ecosystems restrict distribution of resources to only those systems that do fully understand the resources, and as a consequence implementers may believe that the narrative is superfluous. However experience shows that such eco-systems often open up to new participants over time."
        }],
        "key" : "dom-6",
        "severity" : "warning",
        "human" : "A resource should have narrative for robust management",
        "expression" : "text.`div`.exists()",
        "xpath" : "exists(f:text/h:div)",
        "source" : "http://hl7.org/fhir/StructureDefinition/DomainResource"
      }],
      "isModifier" : false,
      "isSummary" : false,
      "mapping" : [{
        "identity" : "rim",
        "map" : "Entity. Role, or Act"
      },
      {
        "identity" : "v2",
        "map" : "PRD (as one example)"
      },
      {
        "identity" : "rim",
        "map" : "Role"
      },
      {
        "identity" : "servd",
        "map" : "Provider"
      }]
    },
    {
      "id" : "Practitioner.id",
      "path" : "Practitioner.id",
      "short" : "Logical id of this artifact",
      "definition" : "The logical id of the resource, as used in the URL for the resource. Once assigned, this value never changes.",
      "comment" : "The only time that a resource does not have an id is when it is being submitted to the server using a create operation.",
      "min" : 0,
      "max" : "1",
      "base" : {
        "path" : "Resource.id",
        "min" : 0,
        "max" : "1"
      },
      "type" : [{
        "extension" : [{
          "url" : "http://hl7.org/fhir/StructureDefinition/structuredefinition-fhir-type",
          "valueUrl" : "string"
        }],
        "code" : "http://hl7.org/fhirpath/System.String"
      }],
      "isModifier" : false,
      "isSummary" : true
    },
    {
      "id" : "Practitioner.meta",
      "path" : "Practitioner.meta",
      "short" : "Metadata about the resource",
      "definition" : "The metadata about the resource. This is content that is maintained by the infrastructure. Changes to the content might not always be associated with version changes to the resource.",
      "min" : 0,
      "max" : "1",
      "base" : {
        "path" : "Resource.meta",
        "min" : 0,
        "max" : "1"
      },
      "type" : [{
        "code" : "Meta"
      }],
      "constraint" : [{
        "key" : "ele-1",
        "severity" : "error",
        "human" : "All FHIR elements must have a @value or children",
        "expression" : "hasValue() or (children().count() > id.count())",
        "xpath" : "@value|f:*|h:div",
        "source" : "http://hl7.org/fhir/StructureDefinition/Element"
      }],
      "isModifier" : false,
      "isSummary" : true
    },
    {
      "id" : "Practitioner.implicitRules",
      "path" : "Practitioner.implicitRules",
      "short" : "A set of rules under which this content was created",
      "definition" : "A reference to a set of rules that were followed when the resource was constructed, and which must be understood when processing the content. Often, this is a reference to an implementation guide that defines the special rules along with other profiles etc.",
      "comment" : "Asserting this rule set restricts the content to be only understood by a limited set of trading partners. This inherently limits the usefulness of the data in the long term. However, the existing health eco-system is highly fractured, and not yet ready to define, collect, and exchange data in a generally computable sense. Wherever possible, implementers and/or specification writers should avoid using this element. Often, when used, the URL is a reference to an implementation guide that defines these special rules as part of it's narrative along with other profiles, value sets, etc.",
      "min" : 0,
      "max" : "1",
      "base" : {
        "path" : "Resource.implicitRules",
        "min" : 0,
        "max" : "1"
      },
      "type" : [{
        "code" : "uri"
      }],
      "constraint" : [{
        "key" : "ele-1",
        "severity" : "error",
        "human" : "All FHIR elements must have a @value or children",
        "expression" : "hasValue() or (children().count() > id.count())",
        "xpath" : "@value|f:*|h:div",
        "source" : "http://hl7.org/fhir/StructureDefinition/Element"
      }],
      "isModifier" : true,
      "isModifierReason" : "This element is labeled as a modifier because the implicit rules may provide additional knowledge about the resource that modifies it's meaning or interpretation",
      "isSummary" : true
    },
    {
      "id" : "Practitioner.language",
      "path" : "Practitioner.language",
      "short" : "Language of the resource content",
      "definition" : "The base language in which the resource is written.",
      "comment" : "Language is provided to support indexing and accessibility (typically, services such as text to speech use the language tag). The html language tag in the narrative applies  to the narrative. The language tag on the resource may be used to specify the language of other presentations generated from the data in the resource. Not all the content has to be in the base language. The Resource.language should not be assumed to apply to the narrative automatically. If a language is specified, it should it also be specified on the div element in the html (see rules in HTML5 for information about the relationship between xml:lang and the html lang attribute).",
      "min" : 0,
      "max" : "1",
      "base" : {
        "path" : "Resource.language",
        "min" : 0,
        "max" : "1"
      },
      "type" : [{
        "code" : "code"
      }],
      "constraint" : [{
        "key" : "ele-1",
        "severity" : "error",
        "human" : "All FHIR elements must have a @value or children",
        "expression" : "hasValue() or (children().count() > id.count())",
        "xpath" : "@value|f:*|h:div",
        "source" : "http://hl7.org/fhir/StructureDefinition/Element"
      }],
      "isModifier" : false,
      "isSummary" : false,
      "binding" : {
        "extension" : [{
          "url" : "http://hl7.org/fhir/StructureDefinition/elementdefinition-maxValueSet",
          "valueCanonical" : "http://hl7.org/fhir/ValueSet/all-languages"
        },
        {
          "url" : "http://hl7.org/fhir/StructureDefinition/elementdefinition-bindingName",
          "valueString" : "Language"
        },
        {
          "url" : "http://hl7.org/fhir/StructureDefinition/elementdefinition-isCommonBinding",
          "valueBoolean" : true
        }],
        "strength" : "preferred",
        "description" : "A human language.",
        "valueSet" : "http://hl7.org/fhir/ValueSet/languages"
      }
    },
    {
      "id" : "Practitioner.text",
      "path" : "Practitioner.text",
      "short" : "Text summary of the resource, for human interpretation",
      "definition" : "A human-readable narrative that contains a summary of the resource and can be used to represent the content of the resource to a human. The narrative need not encode all the structured data, but is required to contain sufficient detail to make it \"clinically safe\" for a human to just read the narrative. Resource definitions may define what content should be represented in the narrative to ensure clinical safety.",
      "comment" : "Contained resources do not have narrative. Resources that are not contained SHOULD have a narrative. In some cases, a resource may only have text with little or no additional discrete data (as long as all minOccurs=1 elements are satisfied).  This may be necessary for data from legacy systems where information is captured as a \"text blob\" or where text is additionally entered raw or narrated and encoded information is added later.",
      "alias" : ["narrative",
      "html",
      "xhtml",
      "display"],
      "min" : 0,
      "max" : "1",
      "base" : {
        "path" : "DomainResource.text",
        "min" : 0,
        "max" : "1"
      },
      "type" : [{
        "code" : "Narrative"
      }],
      "constraint" : [{
        "key" : "ele-1",
        "severity" : "error",
        "human" : "All FHIR elements must have a @value or children",
        "expression" : "hasValue() or (children().count() > id.count())",
        "xpath" : "@value|f:*|h:div",
        "source" : "http://hl7.org/fhir/StructureDefinition/Element"
      }],
      "isModifier" : false,
      "isSummary" : false,
      "mapping" : [{
        "identity" : "rim",
        "map" : "Act.text?"
      }]
    },
    {
      "id" : "Practitioner.contained",
      "path" : "Practitioner.contained",
      "short" : "Contained, inline Resources",
      "definition" : "These resources do not have an independent existence apart from the resource that contains them - they cannot be identified independently, and nor can they have their own independent transaction scope.",
      "comment" : "This should never be done when the content can be identified properly, as once identification is lost, it is extremely difficult (and context dependent) to restore it again. Contained resources may have profiles and tags In their meta elements, but SHALL NOT have security labels.",
      "alias" : ["inline resources",
      "anonymous resources",
      "contained resources"],
      "min" : 0,
      "max" : "*",
      "base" : {
        "path" : "DomainResource.contained",
        "min" : 0,
        "max" : "*"
      },
      "type" : [{
        "code" : "Resource"
      }],
      "isModifier" : false,
      "isSummary" : false,
      "mapping" : [{
        "identity" : "rim",
        "map" : "N/A"
      }]
    },
    {
      "id" : "Practitioner.extension",
      "path" : "Practitioner.extension",
      "short" : "Additional content defined by implementations",
      "definition" : "May be used to represent additional information that is not part of the basic definition of the resource. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension.",
      "comment" : "There can be no stigma associated with the use of extensions by any application, project, or standard - regardless of the institution or jurisdiction that uses or defines the extensions.  The use of extensions is what allows the FHIR specification to retain a core level of simplicity for everyone.",
      "alias" : ["extensions",
      "user content"],
      "min" : 0,
      "max" : "*",
      "base" : {
        "path" : "DomainResource.extension",
        "min" : 0,
        "max" : "*"
      },
      "type" : [{
        "code" : "Extension"
      }],
      "constraint" : [{
        "key" : "ele-1",
        "severity" : "error",
        "human" : "All FHIR elements must have a @value or children",
        "expression" : "hasValue() or (children().count() > id.count())",
        "xpath" : "@value|f:*|h:div",
        "source" : "http://hl7.org/fhir/StructureDefinition/Element"
      },
      {
        "key" : "ext-1",
        "severity" : "error",
        "human" : "Must have either extensions or value[x], not both",
        "expression" : "extension.exists() != value.exists()",
        "xpath" : "exists(f:extension)!=exists(f:*[starts-with(local-name(.), \"value\")])",
        "source" : "http://hl7.org/fhir/StructureDefinition/Extension"
      }],
      "isModifier" : false,
      "isSummary" : false,
      "mapping" : [{
        "identity" : "rim",
        "map" : "N/A"
      }]
    },
    {
      "id" : "Practitioner.modifierExtension",
      "path" : "Practitioner.modifierExtension",
      "short" : "Extensions that cannot be ignored",
      "definition" : "May be used to represent additional information that is not part of the basic definition of the resource and that modifies the understanding of the element that contains it and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer is allowed to define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.\n\nModifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself).",
      "comment" : "There can be no stigma associated with the use of extensions by any application, project, or standard - regardless of the institution or jurisdiction that uses or defines the extensions.  The use of extensions is what allows the FHIR specification to retain a core level of simplicity for everyone.",
      "requirements" : "Modifier extensions allow for extensions that *cannot* be safely ignored to be clearly distinguished from the vast majority of extensions which can be safely ignored.  This promotes interoperability by eliminating the need for implementers to prohibit the presence of extensions. For further information, see the [definition of modifier extensions](extensibility.html#modifierExtension).",
      "alias" : ["extensions",
      "user content"],
      "min" : 0,
      "max" : "*",
      "base" : {
        "path" : "DomainResource.modifierExtension",
        "min" : 0,
        "max" : "*"
      },
      "type" : [{
        "code" : "Extension"
      }],
      "constraint" : [{
        "key" : "ele-1",
        "severity" : "error",
        "human" : "All FHIR elements must have a @value or children",
        "expression" : "hasValue() or (children().count() > id.count())",
        "xpath" : "@value|f:*|h:div",
        "source" : "http://hl7.org/fhir/StructureDefinition/Element"
      },
      {
        "key" : "ext-1",
        "severity" : "error",
        "human" : "Must have either extensions or value[x], not both",
        "expression" : "extension.exists() != value.exists()",
        "xpath" : "exists(f:extension)!=exists(f:*[starts-with(local-name(.), \"value\")])",
        "source" : "http://hl7.org/fhir/StructureDefinition/Extension"
      }],
      "isModifier" : true,
      "isModifierReason" : "Modifier extensions are expected to modify the meaning or interpretation of the resource that contains them",
      "isSummary" : false,
      "mapping" : [{
        "identity" : "rim",
        "map" : "N/A"
      }]
    },
    {
      "id" : "Practitioner.identifier",
      "path" : "Practitioner.identifier",
      "short" : "An identifier for the person as this agent",
      "definition" : "An identifier that applies to this person in this role.",
      "requirements" : "Often, specific identities are assigned for the agent.",
      "min" : 0,
      "max" : "*",
      "base" : {
        "path" : "Practitioner.identifier",
        "min" : 0,
        "max" : "*"
      },
      "type" : [{
        "code" : "Identifier"
      }],
      "constraint" : [{
        "key" : "ele-1",
        "severity" : "error",
        "human" : "All FHIR elements must have a @value or children",
        "expression" : "hasValue() or (children().count() > id.count())",
        "xpath" : "@value|f:*|h:div",
        "source" : "http://hl7.org/fhir/StructureDefinition/Element"
      }],
      "isModifier" : false,
      "isSummary" : true,
      "mapping" : [{
        "identity" : "w5",
        "map" : "FiveWs.identifier"
      },
      {
        "identity" : "v2",
        "map" : "PRD-7 (or XCN.1)"
      },
      {
        "identity" : "rim",
        "map" : "./id"
      },
      {
        "identity" : "servd",
        "map" : "./Identifiers"
      }]
    },
    {
      "id" : "Practitioner.active",
      "path" : "Practitioner.active",
      "short" : "Whether this practitioner's record is in active use",
      "definition" : "Whether this practitioner's record is in active use.",
      "comment" : "If the practitioner is not in use by one organization, then it should mark the period on the PractitonerRole with an end date (even if they are active) as they may be active in another role.",
      "requirements" : "Need to be able to mark a practitioner record as not to be used because it was created in error.",
      "min" : 0,
      "max" : "1",
      "base" : {
        "path" : "Practitioner.active",
        "min" : 0,
        "max" : "1"
      },
      "type" : [{
        "code" : "boolean"
      }],
      "meaningWhenMissing" : "This resource is generally assumed to be active if no value is provided for the active element",
      "constraint" : [{
        "key" : "ele-1",
        "severity" : "error",
        "human" : "All FHIR elements must have a @value or children",
        "expression" : "hasValue() or (children().count() > id.count())",
        "xpath" : "@value|f:*|h:div",
        "source" : "http://hl7.org/fhir/StructureDefinition/Element"
      }],
      "isModifier" : false,
      "isSummary" : true,
      "mapping" : [{
        "identity" : "w5",
        "map" : "FiveWs.status"
      },
      {
        "identity" : "rim",
        "map" : "./statusCode"
      }]
    },
    {
      "id" : "Practitioner.name",
      "path" : "Practitioner.name",
      "short" : "The name(s) associated with the practitioner",
      "definition" : "The name(s) associated with the practitioner.",
      "comment" : "The selection of the use property should ensure that there is a single usual name specified, and others use the nickname (alias), old, or other values as appropriate.  \r\rIn general, select the value to be used in the ResourceReference.display based on this:\r\r1. There is more than 1 name\r2. Use = usual\r3. Period is current to the date of the usage\r4. Use = official\r5. Other order as decided by internal business rules.",
      "requirements" : "The name(s) that a Practitioner is known by. Where there are multiple, the name that the practitioner is usually known as should be used in the display.",
      "min" : 0,
      "max" : "*",
      "base" : {
        "path" : "Practitioner.name",
        "min" : 0,
        "max" : "*"
      },
      "type" : [{
        "code" : "HumanName"
      }],
      "constraint" : [{
        "key" : "ele-1",
        "severity" : "error",
        "human" : "All FHIR elements must have a @value or children",
        "expression" : "hasValue() or (children().count() > id.count())",
        "xpath" : "@value|f:*|h:div",
        "source" : "http://hl7.org/fhir/StructureDefinition/Element"
      }],
      "isModifier" : false,
      "isSummary" : true,
      "mapping" : [{
        "identity" : "v2",
        "map" : "XCN Components"
      },
      {
        "identity" : "rim",
        "map" : "./name"
      },
      {
        "identity" : "servd",
        "map" : "./PreferredName (GivenNames, FamilyName, TitleCode)"
      }]
    },
    {
      "id" : "Practitioner.telecom",
      "path" : "Practitioner.telecom",
      "short" : "A contact detail for the practitioner (that apply to all roles)",
      "definition" : "A contact detail for the practitioner, e.g. a telephone number or an email address.",
      "comment" : "Person may have multiple ways to be contacted with different uses or applicable periods.  May need to have options for contacting the person urgently and to help with identification.  These typically will have home numbers, or mobile numbers that are not role specific.",
      "requirements" : "Need to know how to reach a practitioner independent to any roles the practitioner may have.",
      "min" : 0,
      "max" : "*",
      "base" : {
        "path" : "Practitioner.telecom",
        "min" : 0,
        "max" : "*"
      },
      "type" : [{
        "code" : "ContactPoint"
      }],
      "constraint" : [{
        "key" : "ele-1",
        "severity" : "error",
        "human" : "All FHIR elements must have a @value or children",
        "expression" : "hasValue() or (children().count() > id.count())",
        "xpath" : "@value|f:*|h:div",
        "source" : "http://hl7.org/fhir/StructureDefinition/Element"
      }],
      "isModifier" : false,
      "isSummary" : true,
      "mapping" : [{
        "identity" : "v2",
        "map" : "PRT-15, STF-10, ROL-12"
      },
      {
        "identity" : "rim",
        "map" : "./telecom"
      },
      {
        "identity" : "servd",
        "map" : "./ContactPoints"
      }]
    },
    {
      "id" : "Practitioner.address",
      "path" : "Practitioner.address",
      "short" : "Address(es) of the practitioner that are not role specific (typically home address)",
      "definition" : "Address(es) of the practitioner that are not role specific (typically home address). \rWork addresses are not typically entered in this property as they are usually role dependent.",
      "comment" : "The PractitionerRole does not have an address value on it, as it is expected that the location property be used for this purpose (which has an address).",
      "requirements" : "The home/mailing address of the practitioner is often required for employee administration purposes, and also for some rostering services where the start point (practitioners home) can be used in calculations.",
      "min" : 0,
      "max" : "*",
      "base" : {
        "path" : "Practitioner.address",
        "min" : 0,
        "max" : "*"
      },
      "type" : [{
        "code" : "Address"
      }],
      "constraint" : [{
        "key" : "ele-1",
        "severity" : "error",
        "human" : "All FHIR elements must have a @value or children",
        "expression" : "hasValue() or (children().count() > id.count())",
        "xpath" : "@value|f:*|h:div",
        "source" : "http://hl7.org/fhir/StructureDefinition/Element"
      }],
      "isModifier" : false,
      "isSummary" : true,
      "mapping" : [{
        "identity" : "v2",
        "map" : "ORC-24, STF-11, ROL-11, PRT-14"
      },
      {
        "identity" : "rim",
        "map" : "./addr"
      },
      {
        "identity" : "servd",
        "map" : "./Addresses"
      }]
    },
    {
      "id" : "Practitioner.gender",
      "path" : "Practitioner.gender",
      "short" : "male | female | other | unknown",
      "definition" : "Administrative Gender - the gender that the person is considered to have for administration and record keeping purposes.",
      "requirements" : "Needed to address the person correctly.",
      "min" : 0,
      "max" : "1",
      "base" : {
        "path" : "Practitioner.gender",
        "min" : 0,
        "max" : "1"
      },
      "type" : [{
        "code" : "code"
      }],
      "constraint" : [{
        "key" : "ele-1",
        "severity" : "error",
        "human" : "All FHIR elements must have a @value or children",
        "expression" : "hasValue() or (children().count() > id.count())",
        "xpath" : "@value|f:*|h:div",
        "source" : "http://hl7.org/fhir/StructureDefinition/Element"
      }],
      "isModifier" : false,
      "isSummary" : true,
      "binding" : {
        "extension" : [{
          "url" : "http://hl7.org/fhir/StructureDefinition/elementdefinition-bindingName",
          "valueString" : "AdministrativeGender"
        },
        {
          "url" : "http://hl7.org/fhir/StructureDefinition/elementdefinition-isCommonBinding",
          "valueBoolean" : true
        }],
        "strength" : "required",
        "description" : "The gender of a person used for administrative purposes.",
        "valueSet" : "http://hl7.org/fhir/ValueSet/administrative-gender|4.0.1"
      },
      "mapping" : [{
        "identity" : "v2",
        "map" : "STF-5"
      },
      {
        "identity" : "rim",
        "map" : "./administrativeGender"
      },
      {
        "identity" : "servd",
        "map" : "./GenderCode"
      }]
    },
    {
      "id" : "Practitioner.birthDate",
      "path" : "Practitioner.birthDate",
      "short" : "The date  on which the practitioner was born",
      "definition" : "The date of birth for the practitioner.",
      "requirements" : "Needed for identification.",
      "min" : 0,
      "max" : "1",
      "base" : {
        "path" : "Practitioner.birthDate",
        "min" : 0,
        "max" : "1"
      },
      "type" : [{
        "code" : "date"
      }],
      "constraint" : [{
        "key" : "ele-1",
        "severity" : "error",
        "human" : "All FHIR elements must have a @value or children",
        "expression" : "hasValue() or (children().count() > id.count())",
        "xpath" : "@value|f:*|h:div",
        "source" : "http://hl7.org/fhir/StructureDefinition/Element"
      }],
      "isModifier" : false,
      "isSummary" : true,
      "mapping" : [{
        "identity" : "v2",
        "map" : "STF-6"
      },
      {
        "identity" : "rim",
        "map" : "./birthTime"
      },
      {
        "identity" : "servd",
        "map" : "(not represented in ServD)"
      }]
    },
    {
      "id" : "Practitioner.photo",
      "path" : "Practitioner.photo",
      "short" : "Image of the person",
      "definition" : "Image of the person.",
      "requirements" : "Many EHR systems have the capability to capture an image of patients and personnel. Fits with newer social media usage too.",
      "min" : 0,
      "max" : "*",
      "base" : {
        "path" : "Practitioner.photo",
        "min" : 0,
        "max" : "*"
      },
      "type" : [{
        "code" : "Attachment"
      }],
      "constraint" : [{
        "key" : "ele-1",
        "severity" : "error",
        "human" : "All FHIR elements must have a @value or children",
        "expression" : "hasValue() or (children().count() > id.count())",
        "xpath" : "@value|f:*|h:div",
        "source" : "http://hl7.org/fhir/StructureDefinition/Element"
      }],
      "isModifier" : false,
      "isSummary" : false,
      "mapping" : [{
        "identity" : "rim",
        "map" : "./subjectOf/ObservationEvent[code=\"photo\"]/value"
      },
      {
        "identity" : "servd",
        "map" : "./ImageURI (only supports the URI reference)"
      }]
    },
    {
      "id" : "Practitioner.qualification",
      "path" : "Practitioner.qualification",
      "short" : "Certification, licenses, or training pertaining to the provision of care",
      "definition" : "The official certifications, training, and licenses that authorize or otherwise pertain to the provision of care by the practitioner.  For example, a medical license issued by a medical board authorizing the practitioner to practice medicine within a certian locality.",
      "min" : 0,
      "max" : "*",
      "base" : {
        "path" : "Practitioner.qualification",
        "min" : 0,
        "max" : "*"
      },
      "type" : [{
        "code" : "BackboneElement"
      }],
      "constraint" : [{
        "key" : "ele-1",
        "severity" : "error",
        "human" : "All FHIR elements must have a @value or children",
        "expression" : "hasValue() or (children().count() > id.count())",
        "xpath" : "@value|f:*|h:div",
        "source" : "http://hl7.org/fhir/StructureDefinition/Element"
      }],
      "isModifier" : false,
      "isSummary" : false,
      "mapping" : [{
        "identity" : "v2",
        "map" : "CER?"
      },
      {
        "identity" : "rim",
        "map" : ".playingEntity.playingRole[classCode=QUAL].code"
      },
      {
        "identity" : "servd",
        "map" : "./Qualifications"
      }]
    },
    {
      "id" : "Practitioner.qualification.id",
      "path" : "Practitioner.qualification.id",
      "representation" : ["xmlAttr"],
      "short" : "Unique id for inter-element referencing",
      "definition" : "Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces.",
      "min" : 0,
      "max" : "1",
      "base" : {
        "path" : "Element.id",
        "min" : 0,
        "max" : "1"
      },
      "type" : [{
        "extension" : [{
          "url" : "http://hl7.org/fhir/StructureDefinition/structuredefinition-fhir-type",
          "valueUrl" : "string"
        }],
        "code" : "http://hl7.org/fhirpath/System.String"
      }],
      "isModifier" : false,
      "isSummary" : false,
      "mapping" : [{
        "identity" : "rim",
        "map" : "n/a"
      }]
    },
    {
      "id" : "Practitioner.qualification.extension",
      "path" : "Practitioner.qualification.extension",
      "short" : "Additional content defined by implementations",
      "definition" : "May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension.",
      "comment" : "There can be no stigma associated with the use of extensions by any application, project, or standard - regardless of the institution or jurisdiction that uses or defines the extensions.  The use of extensions is what allows the FHIR specification to retain a core level of simplicity for everyone.",
      "alias" : ["extensions",
      "user content"],
      "min" : 0,
      "max" : "*",
      "base" : {
        "path" : "Element.extension",
        "min" : 0,
        "max" : "*"
      },
      "type" : [{
        "code" : "Extension"
      }],
      "constraint" : [{
        "key" : "ele-1",
        "severity" : "error",
        "human" : "All FHIR elements must have a @value or children",
        "expression" : "hasValue() or (children().count() > id.count())",
        "xpath" : "@value|f:*|h:div",
        "source" : "http://hl7.org/fhir/StructureDefinition/Element"
      },
      {
        "key" : "ext-1",
        "severity" : "error",
        "human" : "Must have either extensions or value[x], not both",
        "expression" : "extension.exists() != value.exists()",
        "xpath" : "exists(f:extension)!=exists(f:*[starts-with(local-name(.), \"value\")])",
        "source" : "http://hl7.org/fhir/StructureDefinition/Extension"
      }],
      "isModifier" : false,
      "isSummary" : false,
      "mapping" : [{
        "identity" : "rim",
        "map" : "n/a"
      }]
    },
    {
      "id" : "Practitioner.qualification.modifierExtension",
      "path" : "Practitioner.qualification.modifierExtension",
      "short" : "Extensions that cannot be ignored even if unrecognized",
      "definition" : "May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.\n\nModifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself).",
      "comment" : "There can be no stigma associated with the use of extensions by any application, project, or standard - regardless of the institution or jurisdiction that uses or defines the extensions.  The use of extensions is what allows the FHIR specification to retain a core level of simplicity for everyone.",
      "requirements" : "Modifier extensions allow for extensions that *cannot* be safely ignored to be clearly distinguished from the vast majority of extensions which can be safely ignored.  This promotes interoperability by eliminating the need for implementers to prohibit the presence of extensions. For further information, see the [definition of modifier extensions](extensibility.html#modifierExtension).",
      "alias" : ["extensions",
      "user content",
      "modifiers"],
      "min" : 0,
      "max" : "*",
      "base" : {
        "path" : "BackboneElement.modifierExtension",
        "min" : 0,
        "max" : "*"
      },
      "type" : [{
        "code" : "Extension"
      }],
      "constraint" : [{
        "key" : "ele-1",
        "severity" : "error",
        "human" : "All FHIR elements must have a @value or children",
        "expression" : "hasValue() or (children().count() > id.count())",
        "xpath" : "@value|f:*|h:div",
        "source" : "http://hl7.org/fhir/StructureDefinition/Element"
      },
      {
        "key" : "ext-1",
        "severity" : "error",
        "human" : "Must have either extensions or value[x], not both",
        "expression" : "extension.exists() != value.exists()",
        "xpath" : "exists(f:extension)!=exists(f:*[starts-with(local-name(.), \"value\")])",
        "source" : "http://hl7.org/fhir/StructureDefinition/Extension"
      }],
      "isModifier" : true,
      "isModifierReason" : "Modifier extensions are expected to modify the meaning or interpretation of the element that contains them",
      "isSummary" : true,
      "mapping" : [{
        "identity" : "rim",
        "map" : "N/A"
      }]
    },
    {
      "id" : "Practitioner.qualification.identifier",
      "path" : "Practitioner.qualification.identifier",
      "short" : "An identifier for this qualification for the practitioner",
      "definition" : "An identifier that applies to this person's qualification in this role.",
      "requirements" : "Often, specific identities are assigned for the qualification.",
      "min" : 0,
      "max" : "*",
      "base" : {
        "path" : "Practitioner.qualification.identifier",
        "min" : 0,
        "max" : "*"
      },
      "type" : [{
        "code" : "Identifier"
      }],
      "constraint" : [{
        "key" : "ele-1",
        "severity" : "error",
        "human" : "All FHIR elements must have a @value or children",
        "expression" : "hasValue() or (children().count() > id.count())",
        "xpath" : "@value|f:*|h:div",
        "source" : "http://hl7.org/fhir/StructureDefinition/Element"
      }],
      "isModifier" : false,
      "isSummary" : false,
      "mapping" : [{
        "identity" : "rim",
        "map" : ".playingEntity.playingRole[classCode=QUAL].id"
      }]
    },
    {
      "id" : "Practitioner.qualification.code",
      "path" : "Practitioner.qualification.code",
      "short" : "Coded representation of the qualification",
      "definition" : "Coded representation of the qualification.",
      "min" : 1,
      "max" : "1",
      "base" : {
        "path" : "Practitioner.qualification.code",
        "min" : 1,
        "max" : "1"
      },
      "type" : [{
        "code" : "CodeableConcept"
      }],
      "constraint" : [{
        "key" : "ele-1",
        "severity" : "error",
        "human" : "All FHIR elements must have a @value or children",
        "expression" : "hasValue() or (children().count() > id.count())",
        "xpath" : "@value|f:*|h:div",
        "source" : "http://hl7.org/fhir/StructureDefinition/Element"
      }],
      "isModifier" : false,
      "isSummary" : false,
      "binding" : {
        "extension" : [{
          "url" : "http://hl7.org/fhir/StructureDefinition/elementdefinition-bindingName",
          "valueString" : "Qualification"
        }],
        "strength" : "example",
        "description" : "Specific qualification the practitioner has to provide a service.",
        "valueSet" : "http://terminology.hl7.org/ValueSet/v2-2.7-0360"
      },
      "mapping" : [{
        "identity" : "rim",
        "map" : ".playingEntity.playingRole[classCode=QUAL].code"
      },
      {
        "identity" : "servd",
        "map" : "./Qualifications.Value"
      }]
    },
    {
      "id" : "Practitioner.qualification.period",
      "path" : "Practitioner.qualification.period",
      "short" : "Period during which the qualification is valid",
      "definition" : "Period during which the qualification is valid.",
      "requirements" : "Qualifications are often for a limited period of time, and can be revoked.",
      "min" : 0,
      "max" : "1",
      "base" : {
        "path" : "Practitioner.qualification.period",
        "min" : 0,
        "max" : "1"
      },
      "type" : [{
        "code" : "Period"
      }],
      "constraint" : [{
        "key" : "ele-1",
        "severity" : "error",
        "human" : "All FHIR elements must have a @value or children",
        "expression" : "hasValue() or (children().count() > id.count())",
        "xpath" : "@value|f:*|h:div",
        "source" : "http://hl7.org/fhir/StructureDefinition/Element"
      }],
      "isModifier" : false,
      "isSummary" : false,
      "mapping" : [{
        "identity" : "rim",
        "map" : ".playingEntity.playingRole[classCode=QUAL].effectiveTime"
      },
      {
        "identity" : "servd",
        "map" : "./Qualifications.StartDate and ./Qualifications.EndDate"
      }]
    },
    {
      "id" : "Practitioner.qualification.issuer",
      "path" : "Practitioner.qualification.issuer",
      "short" : "Organization that regulates and issues the qualification",
      "definition" : "Organization that regulates and issues the qualification.",
      "min" : 0,
      "max" : "1",
      "base" : {
        "path" : "Practitioner.qualification.issuer",
        "min" : 0,
        "max" : "1"
      },
      "type" : [{
        "code" : "Reference",
        "targetProfile" : ["http://hl7.org/fhir/StructureDefinition/Organization"]
      }],
      "constraint" : [{
        "key" : "ele-1",
        "severity" : "error",
        "human" : "All FHIR elements must have a @value or children",
        "expression" : "hasValue() or (children().count() > id.count())",
        "xpath" : "@value|f:*|h:div",
        "source" : "http://hl7.org/fhir/StructureDefinition/Element"
      }],
      "isModifier" : false,
      "isSummary" : false,
      "mapping" : [{
        "identity" : "rim",
        "map" : ".playingEntity.playingRole[classCode=QUAL].scoper"
      }]
    },
    {
      "id" : "Practitioner.communication",
      "path" : "Practitioner.communication",
      "short" : "A language the practitioner can use in patient communication",
      "definition" : "A language the practitioner can use in patient communication.",
      "comment" : "The structure aa-BB with this exact casing is one the most widely used notations for locale. However not all systems code this but instead have it as free text. Hence CodeableConcept instead of code as the data type.",
      "requirements" : "Knowing which language a practitioner speaks can help in facilitating communication with patients.",
      "min" : 0,
      "max" : "*",
      "base" : {
        "path" : "Practitioner.communication",
        "min" : 0,
        "max" : "*"
      },
      "type" : [{
        "code" : "CodeableConcept"
      }],
      "constraint" : [{
        "key" : "ele-1",
        "severity" : "error",
        "human" : "All FHIR elements must have a @value or children",
        "expression" : "hasValue() or (children().count() > id.count())",
        "xpath" : "@value|f:*|h:div",
        "source" : "http://hl7.org/fhir/StructureDefinition/Element"
      }],
      "isModifier" : false,
      "isSummary" : false,
      "binding" : {
        "extension" : [{
          "url" : "http://hl7.org/fhir/StructureDefinition/elementdefinition-maxValueSet",
          "valueCanonical" : "http://hl7.org/fhir/ValueSet/all-languages"
        },
        {
          "url" : "http://hl7.org/fhir/StructureDefinition/elementdefinition-bindingName",
          "valueString" : "Language"
        },
        {
          "url" : "http://hl7.org/fhir/StructureDefinition/elementdefinition-isCommonBinding",
          "valueBoolean" : true
        }],
        "strength" : "preferred",
        "description" : "A human language.",
        "valueSet" : "http://hl7.org/fhir/ValueSet/languages"
      },
      "mapping" : [{
        "identity" : "v2",
        "map" : "PID-15, NK1-20, LAN-2"
      },
      {
        "identity" : "rim",
        "map" : "./languageCommunication"
      },
      {
        "identity" : "servd",
        "map" : "./Languages.LanguageSpokenCode"
      }]
    }]
  },
  "differential" : {
    "element" : [{
      "id" : "Practitioner",
      "path" : "Practitioner",
      "short" : "A person with a  formal responsibility in the provisioning of healthcare or related services",
      "definition" : "A person who is directly or indirectly involved in the provisioning of healthcare.",
      "min" : 0,
      "max" : "*",
      "mapping" : [{
        "identity" : "v2",
        "map" : "PRD (as one example)"
      },
      {
        "identity" : "rim",
        "map" : "Role"
      },
      {
        "identity" : "servd",
        "map" : "Provider"
      }]
    },
    {
      "id" : "Practitioner.identifier",
      "path" : "Practitioner.identifier",
      "short" : "An identifier for the person as this agent",
      "definition" : "An identifier that applies to this person in this role.",
      "requirements" : "Often, specific identities are assigned for the agent.",
      "min" : 0,
      "max" : "*",
      "type" : [{
        "code" : "Identifier"
      }],
      "isSummary" : true,
      "mapping" : [{
        "identity" : "w5",
        "map" : "FiveWs.identifier"
      },
      {
        "identity" : "v2",
        "map" : "PRD-7 (or XCN.1)"
      },
      {
        "identity" : "rim",
        "map" : "./id"
      },
      {
        "identity" : "servd",
        "map" : "./Identifiers"
      }]
    },
    {
      "id" : "Practitioner.active",
      "path" : "Practitioner.active",
      "short" : "Whether this practitioner's record is in active use",
      "definition" : "Whether this practitioner's record is in active use.",
      "comment" : "If the practitioner is not in use by one organization, then it should mark the period on the PractitonerRole with an end date (even if they are active) as they may be active in another role.",
      "requirements" : "Need to be able to mark a practitioner record as not to be used because it was created in error.",
      "min" : 0,
      "max" : "1",
      "type" : [{
        "code" : "boolean"
      }],
      "meaningWhenMissing" : "This resource is generally assumed to be active if no value is provided for the active element",
      "isSummary" : true,
      "mapping" : [{
        "identity" : "w5",
        "map" : "FiveWs.status"
      },
      {
        "identity" : "rim",
        "map" : "./statusCode"
      }]
    },
    {
      "id" : "Practitioner.name",
      "path" : "Practitioner.name",
      "short" : "The name(s) associated with the practitioner",
      "definition" : "The name(s) associated with the practitioner.",
      "comment" : "The selection of the use property should ensure that there is a single usual name specified, and others use the nickname (alias), old, or other values as appropriate.  \r\rIn general, select the value to be used in the ResourceReference.display based on this:\r\r1. There is more than 1 name\r2. Use = usual\r3. Period is current to the date of the usage\r4. Use = official\r5. Other order as decided by internal business rules.",
      "requirements" : "The name(s) that a Practitioner is known by. Where there are multiple, the name that the practitioner is usually known as should be used in the display.",
      "min" : 0,
      "max" : "*",
      "type" : [{
        "code" : "HumanName"
      }],
      "isSummary" : true,
      "mapping" : [{
        "identity" : "v2",
        "map" : "XCN Components"
      },
      {
        "identity" : "rim",
        "map" : "./name"
      },
      {
        "identity" : "servd",
        "map" : "./PreferredName (GivenNames, FamilyName, TitleCode)"
      }]
    },
    {
      "id" : "Practitioner.telecom",
      "path" : "Practitioner.telecom",
      "short" : "A contact detail for the practitioner (that apply to all roles)",
      "definition" : "A contact detail for the practitioner, e.g. a telephone number or an email address.",
      "comment" : "Person may have multiple ways to be contacted with different uses or applicable periods.  May need to have options for contacting the person urgently and to help with identification.  These typically will have home numbers, or mobile numbers that are not role specific.",
      "requirements" : "Need to know how to reach a practitioner independent to any roles the practitioner may have.",
      "min" : 0,
      "max" : "*",
      "type" : [{
        "code" : "ContactPoint"
      }],
      "isSummary" : true,
      "mapping" : [{
        "identity" : "v2",
        "map" : "PRT-15, STF-10, ROL-12"
      },
      {
        "identity" : "rim",
        "map" : "./telecom"
      },
      {
        "identity" : "servd",
        "map" : "./ContactPoints"
      }]
    },
    {
      "id" : "Practitioner.address",
      "path" : "Practitioner.address",
      "short" : "Address(es) of the practitioner that are not role specific (typically home address)",
      "definition" : "Address(es) of the practitioner that are not role specific (typically home address). \rWork addresses are not typically entered in this property as they are usually role dependent.",
      "comment" : "The PractitionerRole does not have an address value on it, as it is expected that the location property be used for this purpose (which has an address).",
      "requirements" : "The home/mailing address of the practitioner is often required for employee administration purposes, and also for some rostering services where the start point (practitioners home) can be used in calculations.",
      "min" : 0,
      "max" : "*",
      "type" : [{
        "code" : "Address"
      }],
      "isSummary" : true,
      "mapping" : [{
        "identity" : "v2",
        "map" : "ORC-24, STF-11, ROL-11, PRT-14"
      },
      {
        "identity" : "rim",
        "map" : "./addr"
      },
      {
        "identity" : "servd",
        "map" : "./Addresses"
      }]
    },
    {
      "id" : "Practitioner.gender",
      "path" : "Practitioner.gender",
      "short" : "male | female | other | unknown",
      "definition" : "Administrative Gender - the gender that the person is considered to have for administration and record keeping purposes.",
      "requirements" : "Needed to address the person correctly.",
      "min" : 0,
      "max" : "1",
      "type" : [{
        "code" : "code"
      }],
      "isSummary" : true,
      "binding" : {
        "extension" : [{
          "url" : "http://hl7.org/fhir/StructureDefinition/elementdefinition-bindingName",
          "valueString" : "AdministrativeGender"
        },
        {
          "url" : "http://hl7.org/fhir/StructureDefinition/elementdefinition-isCommonBinding",
          "valueBoolean" : true
        }],
        "strength" : "required",
        "description" : "The gender of a person used for administrative purposes.",
        "valueSet" : "http://hl7.org/fhir/ValueSet/administrative-gender|4.0.1"
      },
      "mapping" : [{
        "identity" : "v2",
        "map" : "STF-5"
      },
      {
        "identity" : "rim",
        "map" : "./administrativeGender"
      },
      {
        "identity" : "servd",
        "map" : "./GenderCode"
      }]
    },
    {
      "id" : "Practitioner.birthDate",
      "path" : "Practitioner.birthDate",
      "short" : "The date  on which the practitioner was born",
      "definition" : "The date of birth for the practitioner.",
      "requirements" : "Needed for identification.",
      "min" : 0,
      "max" : "1",
      "type" : [{
        "code" : "date"
      }],
      "isSummary" : true,
      "mapping" : [{
        "identity" : "v2",
        "map" : "STF-6"
      },
      {
        "identity" : "rim",
        "map" : "./birthTime"
      },
      {
        "identity" : "servd",
        "map" : "(not represented in ServD)"
      }]
    },
    {
      "id" : "Practitioner.photo",
      "path" : "Practitioner.photo",
      "short" : "Image of the person",
      "definition" : "Image of the person.",
      "requirements" : "Many EHR systems have the capability to capture an image of patients and personnel. Fits with newer social media usage too.",
      "min" : 0,
      "max" : "*",
      "type" : [{
        "code" : "Attachment"
      }],
      "mapping" : [{
        "identity" : "rim",
        "map" : "./subjectOf/ObservationEvent[code=\"photo\"]/value"
      },
      {
        "identity" : "servd",
        "map" : "./ImageURI (only supports the URI reference)"
      }]
    },
    {
      "id" : "Practitioner.qualification",
      "path" : "Practitioner.qualification",
      "short" : "Certification, licenses, or training pertaining to the provision of care",
      "definition" : "The official certifications, training, and licenses that authorize or otherwise pertain to the provision of care by the practitioner.  For example, a medical license issued by a medical board authorizing the practitioner to practice medicine within a certian locality.",
      "min" : 0,
      "max" : "*",
      "type" : [{
        "code" : "BackboneElement"
      }],
      "mapping" : [{
        "identity" : "v2",
        "map" : "CER?"
      },
      {
        "identity" : "rim",
        "map" : ".playingEntity.playingRole[classCode=QUAL].code"
      },
      {
        "identity" : "servd",
        "map" : "./Qualifications"
      }]
    },
    {
      "id" : "Practitioner.qualification.identifier",
      "path" : "Practitioner.qualification.identifier",
      "short" : "An identifier for this qualification for the practitioner",
      "definition" : "An identifier that applies to this person's qualification in this role.",
      "requirements" : "Often, specific identities are assigned for the qualification.",
      "min" : 0,
      "max" : "*",
      "type" : [{
        "code" : "Identifier"
      }],
      "mapping" : [{
        "identity" : "rim",
        "map" : ".playingEntity.playingRole[classCode=QUAL].id"
      }]
    },
    {
      "id" : "Practitioner.qualification.code",
      "path" : "Practitioner.qualification.code",
      "short" : "Coded representation of the qualification",
      "definition" : "Coded representation of the qualification.",
      "min" : 1,
      "max" : "1",
      "type" : [{
        "code" : "CodeableConcept"
      }],
      "binding" : {
        "extension" : [{
          "url" : "http://hl7.org/fhir/StructureDefinition/elementdefinition-bindingName",
          "valueString" : "Qualification"
        }],
        "strength" : "example",
        "description" : "Specific qualification the practitioner has to provide a service.",
        "valueSet" : "http://terminology.hl7.org/ValueSet/v2-2.7-0360"
      },
      "mapping" : [{
        "identity" : "rim",
        "map" : ".playingEntity.playingRole[classCode=QUAL].code"
      },
      {
        "identity" : "servd",
        "map" : "./Qualifications.Value"
      }]
    },
    {
      "id" : "Practitioner.qualification.period",
      "path" : "Practitioner.qualification.period",
      "short" : "Period during which the qualification is valid",
      "definition" : "Period during which the qualification is valid.",
      "requirements" : "Qualifications are often for a limited period of time, and can be revoked.",
      "min" : 0,
      "max" : "1",
      "type" : [{
        "code" : "Period"
      }],
      "mapping" : [{
        "identity" : "rim",
        "map" : ".playingEntity.playingRole[classCode=QUAL].effectiveTime"
      },
      {
        "identity" : "servd",
        "map" : "./Qualifications.StartDate and ./Qualifications.EndDate"
      }]
    },
    {
      "id" : "Practitioner.qualification.issuer",
      "path" : "Practitioner.qualification.issuer",
      "short" : "Organization that regulates and issues the qualification",
      "definition" : "Organization that regulates and issues the qualification.",
      "min" : 0,
      "max" : "1",
      "type" : [{
        "code" : "Reference",
        "targetProfile" : ["http://hl7.org/fhir/StructureDefinition/Organization"]
      }],
      "mapping" : [{
        "identity" : "rim",
        "map" : ".playingEntity.playingRole[classCode=QUAL].scoper"
      }]
    },
    {
      "id" : "Practitioner.communication",
      "path" : "Practitioner.communication",
      "short" : "A language the practitioner can use in patient communication",
      "definition" : "A language the practitioner can use in patient communication.",
      "comment" : "The structure aa-BB with this exact casing is one the most widely used notations for locale. However not all systems code this but instead have it as free text. Hence CodeableConcept instead of code as the data type.",
      "requirements" : "Knowing which language a practitioner speaks can help in facilitating communication with patients.",
      "min" : 0,
      "max" : "*",
      "type" : [{
        "code" : "CodeableConcept"
      }],
      "binding" : {
        "extension" : [{
          "url" : "http://hl7.org/fhir/StructureDefinition/elementdefinition-maxValueSet",
          "valueCanonical" : "http://hl7.org/fhir/ValueSet/all-languages"
        },
        {
          "url" : "http://hl7.org/fhir/StructureDefinition/elementdefinition-bindingName",
          "valueString" : "Language"
        },
        {
          "url" : "http://hl7.org/fhir/StructureDefinition/elementdefinition-isCommonBinding",
          "valueBoolean" : true
        }],
        "strength" : "preferred",
        "description" : "A human language.",
        "valueSet" : "http://hl7.org/fhir/ValueSet/languages"
      },
      "mapping" : [{
        "identity" : "v2",
        "map" : "PID-15, NK1-20, LAN-2"
      },
      {
        "identity" : "rim",
        "map" : "./languageCommunication"
      },
      {
        "identity" : "servd",
        "map" : "./Languages.LanguageSpokenCode"
      }]
    }]
  }
}
