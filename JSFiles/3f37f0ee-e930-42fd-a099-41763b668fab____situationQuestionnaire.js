export const DEFAULT_SITUATION_QUESTIONS = {
  "resourceType": "Questionnaire",
  "id": "coronascience-situation-questions-QS1",
  "meta": {
    "security": [
      {
        "system": "http://midata.coop/codesystems/security",
        "code": "public"
      }
    ]
  },
  "contained": [
    {
      "resourceType": "ValueSet",
      "id": "QS1.yes-no.valueset",
      "url": "http://fhir.ch/ig/covid-19-prom/Questionnaire/coronascience-situation-questions-QS1#QS1.yes-no.valueset",
      "title": "Yes/No",
      "status": "active",
      "compose": {
        "include": [
          {
            "system": "http://snomed.info/sct",
            "concept": [
              {
                "code": "373066001",
                "display": "Yes",
                "designation": [
                  {
                    "language": "de",
                    "value": "ja"
                  },
                  {
                    "language": "en",
                    "value": "yes"
                  },
                  {
                    "language": "fr",
                    "value": "oui"
                  },
                  {
                    "language": "gsw",
                    "value": "ja"
                  },
                  {
                    "language": "it",
                    "value": "si"
                  },
                  {
                    "language": "rm",
                    "value": "gea"
                  }
                ]
              },
              {
                "code": "373067005",
                "display": "No",
                "designation": [
                  {
                    "language": "de",
                    "value": "nein"
                  },
                  {
                    "language": "en",
                    "value": "no"
                  },
                  {
                    "language": "fr",
                    "value": "non"
                  },
                  {
                    "language": "gsw",
                    "value": "nei"
                  },
                  {
                    "language": "it",
                    "value": "no"
                  },
                  {
                    "language": "rm",
                    "value": "na"
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    {
      "resourceType": "ValueSet",
      "id": "QS1.IR1.valueset",
      "url": "http://fhir.ch/ig/covid-19-prom/Questionnaire/coronascience-situation-questions-QS1#QS1.IR1.valueset",
      "title": "Risk factors",
      "status": "active",
      "compose": {
        "include": [
          {
            "system": "http://snomed.info/sct",
            "concept": [
              {
                "code": "260413007",
                "display": "None",
                "designation": [
                  {
                    "language": "de",
                    "value": "keiner"
                  },
                  {
                    "language": "en",
                    "value": "none"
                  },
                  {
                    "language": "fr",
                    "value": "aucun"
                  },
                  {
                    "language": "gsw",
                    "value": "kene"
                  },
                  {
                    "language": "it",
                    "value": "nessuno"
                  },
                  {
                    "language": "rm",
                    "value": "nagin"
                  }
                ]
              },
              {
                "code": "46635009",
                "display": "Diabetes mellitus type 1 (disorder)",
                "designation": [
                  {
                    "language": "de",
                    "value": "Diabetes Typ 1"
                  },
                  {
                    "language": "en",
                    "value": "diabetes type 1"
                  },
                  {
                    "language": "fr",
                    "value": "diabète type 1"
                  },
                  {
                    "language": "gsw",
                    "value": "Diabetes Typ 1"
                  },
                  {
                    "language": "it",
                    "value": "diabete tipo 1"
                  },
                  {
                    "language": "rm",
                    "value": "diabetes tip 1"
                  }
                ]
              },
              {
                "code": "44054006",
                "display": "Diabetes mellitus type 2 (disorder)",
                "designation": [
                  {
                    "language": "de",
                    "value": "Diabetes Typ 2"
                  },
                  {
                    "language": "en",
                    "value": "diabetes type 2"
                  },
                  {
                    "language": "fr",
                    "value": "diabète type 2"
                  },
                  {
                    "language": "gsw",
                    "value": "Diabetes Typ 2"
                  },
                  {
                    "language": "it",
                    "value": "diabete tipo 2"
                  },
                  {
                    "language": "rm",
                    "value": "diabetes tip 2"
                  }
                ]
              },
              {
                "code": "49601007",
                "display": "Disorder of cardiovascular system (disorder)",
                "designation": [
                  {
                    "language": "de",
                    "value": "Herz-Kreislauf-Erkrankung"
                  },
                  {
                    "language": "en",
                    "value": "cardiovascular disease"
                  },
                  {
                    "language": "fr",
                    "value": "maladie cardiovasculaire"
                  },
                  {
                    "language": "gsw",
                    "value": "Härz-Kreislouf-Erchrankig"
                  },
                  {
                    "language": "it",
                    "value": "malattie cardiovascolari"
                  },
                  {
                    "language": "rm",
                    "value": "malsogna cardiovasculara"
                  }
                ]
              },
              {
                "code": "17097001",
                "display": "Chronic disease of respiratory system (disorder)",
                "designation": [
                  {
                    "language": "de",
                    "value": "Chronische Atemwegserkrankung"
                  },
                  {
                    "language": "en",
                    "value": "chronic respiratory disease"
                  },
                  {
                    "language": "fr",
                    "value": "maladie respiratoire chronique"
                  },
                  {
                    "language": "gsw",
                    "value": "Chronischi Atemwägserchrankig"
                  },
                  {
                    "language": "it",
                    "value": "malattie respiratorie croniche"
                  },
                  {
                    "language": "rm",
                    "value": "malsogna cronica da la via respiratorica"
                  }
                ]
              },
              {
                "code": "363346000",
                "display": "Malignant neoplastic disease (disorder)",
                "designation": [
                  {
                    "language": "de",
                    "value": "Krebs"
                  },
                  {
                    "language": "en",
                    "value": "cancer"
                  },
                  {
                    "language": "fr",
                    "value": "cancer"
                  },
                  {
                    "language": "gsw",
                    "value": "Chräbs"
                  },
                  {
                    "language": "it",
                    "value": "cancro"
                  },
                  {
                    "language": "rm",
                    "value": "cancer"
                  }
                ]
              },
              {
                "code": "68605000",
                "display": "Immunosuppression-related infectious disease (disorder)",
                "designation": [
                  {
                    "language": "de",
                    "value": "Immunsuppression"
                  },
                  {
                    "language": "en",
                    "value": "immunosuppression"
                  },
                  {
                    "language": "fr",
                    "value": "immunosuppression"
                  },
                  {
                    "language": "gsw",
                    "value": "Immunsuppression"
                  },
                  {
                    "language": "it",
                    "value": "immunodepressione"
                  },
                  {
                    "language": "rm",
                    "value": "immunosuppressiun"
                  }
                ]
              },
              {
                "code": "27624003",
                "display": "Chronic disease (disorder)",
                "designation": [
                  {
                    "language": "de",
                    "value": "andere chronische Krankheit"
                  },
                  {
                    "language": "en",
                    "value": "other chronic disease"
                  },
                  {
                    "language": "fr",
                    "value": "autre maladie chronique"
                  },
                  {
                    "language": "gsw",
                    "value": "anderi chronischi Chrankheit"
                  },
                  {
                    "language": "it",
                    "value": "altre malattie croniche"
                  },
                  {
                    "language": "rm",
                    "value": "autras malsognas cronicas"
                  }
                ]
              },
              {
                "code": "38341003",
                "display": "Hypertensive disorder, systemic arterial (disorder)",
                "designation": [
                  {
                    "language": "de",
                    "value": "Bluthochdruck"
                  },
                  {
                    "language": "en",
                    "value": "high blood pressure"
                  },
                  {
                    "language": "fr",
                    "value": "hypertension artérielle"
                  },
                  {
                    "language": "gsw",
                    "value": "Bluethochdruck"
                  },
                  {
                    "language": "it",
                    "value": "ipertensione"
                  },
                  {
                    "language": "rm",
                    "value": "ipertensiun"
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    {
      "resourceType": "ValueSet",
      "id": "QS1.IR2.valueset",
      "url": "http://fhir.ch/ig/covid-19-prom/Questionnaire/coronascience-situation-questions-QS1#QS1.IR2.valueset",
      "title": "Smoker",
      "status": "active",
      "compose": {
        "include": [
          {
            "system": "http://snomed.info/sct",
            "concept": [
              {
                "code": "8392000",
                "display": "Non-smoker (finding)",
                "designation": [
                  {
                    "language": "de",
                    "value": "Nichtraucher/in"
                  },
                  {
                    "language": "en",
                    "value": "non-smoker"
                  },
                  {
                    "language": "fr",
                    "value": "non fumeur"
                  },
                  {
                    "language": "gsw",
                    "value": "Nichtroucher/in"
                  },
                  {
                    "language": "it",
                    "value": "non fumatore"
                  },
                  {
                    "language": "rm",
                    "value": "nunfimader/dra"
                  }
                ]
              },
              {
                "code": "8517006",
                "display": "Ex-smoker (finding)",
                "designation": [
                  {
                    "language": "de",
                    "value": "Ex-Raucher/in"
                  },
                  {
                    "language": "en",
                    "value": "ex-smoker"
                  },
                  {
                    "language": "fr",
                    "value": "ex-fumeur"
                  },
                  {
                    "language": "gsw",
                    "value": "Ex-Roucher/in"
                  },
                  {
                    "language": "it",
                    "value": "ex-fumatore"
                  },
                  {
                    "language": "rm",
                    "value": "ex fimader/dra"
                  }
                ]
              },
              {
                "code": "428041000124106",
                "display": "Occasional tobacco smoker (finding)",
                "designation": [
                  {
                    "language": "de",
                    "value": "Gelegenheitsraucher/in"
                  },
                  {
                    "language": "en",
                    "value": "occasional smoker"
                  },
                  {
                    "language": "fr",
                    "value": "fumeur occasionnel"
                  },
                  {
                    "language": "gsw",
                    "value": "Glägeheitsroucher/in"
                  },
                  {
                    "language": "it",
                    "value": "fumatore occasionale"
                  },
                  {
                    "language": "rm",
                    "value": "fimader/dra occasiunal/a"
                  }
                ]
              },
              {
                "code": "77176002",
                "display": "Smoker (finding)",
                "designation": [
                  {
                    "language": "de",
                    "value": "Raucher/in"
                  },
                  {
                    "language": "en",
                    "value": "smoker"
                  },
                  {
                    "language": "fr",
                    "value": "fumeur"
                  },
                  {
                    "language": "gsw",
                    "value": "Roucher/in"
                  },
                  {
                    "language": "it",
                    "value": "fumatore"
                  },
                  {
                    "language": "rm",
                    "value": "fimader/dra"
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    {
      "resourceType": "ValueSet",
      "id": "QS1.IL1.valueset",
      "url": "http://fhir.ch/ig/covid-19-prom/Questionnaire/coronascience-situation-questions-QS1#QS1.IL1.valueset",
      "title": "Workplace",
      "status": "active",
      "compose": {
        "include": [
          {
            "system": "http://fhir.ch/ig/covid-19-prom/codesystem/coronascience-workplace",
            "concept": [
              {
                "code": "usualWorkplace",
                "display": "usual workplace",
                "designation": [
                  {
                    "language": "de",
                    "value": "üblicher Arbeitsplatz"
                  },
                  {
                    "language": "en",
                    "value": "usual workplace"
                  },
                  {
                    "language": "fr",
                    "value": "lieu de travail usuel"
                  },
                  {
                    "language": "gsw",
                    "value": "üblech Arbeitsplatz"
                  },
                  {
                    "language": "it",
                    "value": "luogo di lavoro abituale"
                  },
                  {
                    "language": "rm",
                    "value": "lieu da lavur usità"
                  }
                ]
              },
              {
                "code": "homeOffice",
                "display": "home office",
                "designation": [
                  {
                    "language": "de",
                    "value": "Home-Office/Fernstudium"
                  },
                  {
                    "language": "en",
                    "value": "home office/distance learning"
                  },
                  {
                    "language": "fr",
                    "value": "télétravail/enseignement à distance"
                  },
                  {
                    "language": "gsw",
                    "value": "Home-Office/Fernstudium"
                  },
                  {
                    "language": "it",
                    "value": "smart working/formazione a distanza"
                  },
                  {
                    "language": "rm",
                    "value": "home office/distance learning"
                  }
                ]
              },
              {
                "code": "other",
                "display": "other",
                "designation": [
                  {
                    "language": "de",
                    "value": "sonstiges"
                  },
                  {
                    "language": "en",
                    "value": "other"
                  },
                  {
                    "language": "fr",
                    "value": "autre"
                  },
                  {
                    "language": "gsw",
                    "value": "süsch öppis"
                  },
                  {
                    "language": "it",
                    "value": "altro"
                  },
                  {
                    "language": "rm",
                    "value": "auter"
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    {
      "resourceType": "ValueSet",
      "id": "QS1.IL4.valueset",
      "url": "http://fhir.ch/ig/covid-19-prom/Questionnaire/coronascience-situation-questions-QS1#QS1.IL4.valueset",
      "title": "Employment status",
      "status": "active",
      "compose": {
        "include": [
          {
            "system": "http://fhir.ch/ig/covid-19-prom/codesystem/coronascience-employment-status",
            "concept": [
              {
                "code": "fullTime",
                "display": "full-time",
                "designation": [
                  {
                    "language": "de",
                    "value": "voll beschäftigt"
                  },
                  {
                    "language": "en",
                    "value": "full-time"
                  },
                  {
                    "language": "fr",
                    "value": "à plein temps"
                  },
                  {
                    "language": "gsw",
                    "value": "vou beschäftiget"
                  },
                  {
                    "language": "it",
                    "value": "a tempo pieno"
                  },
                  {
                    "language": "rm",
                    "value": "cumplainamain"
                  }
                ]
              },
              {
                "code": "shortTime",
                "display": "on short time",
                "designation": [
                  {
                    "language": "de",
                    "value": "in Kurzarbeit"
                  },
                  {
                    "language": "en",
                    "value": "on short time"
                  },
                  {
                    "language": "fr",
                    "value": "au chômage partiel"
                  },
                  {
                    "language": "gsw",
                    "value": "ir Churzarbeit"
                  },
                  {
                    "language": "it",
                    "value": "part-time"
                  },
                  {
                    "language": "rm",
                    "value": "lavur curta"
                  }
                ]
              },
              {
                "code": "student",
                "display": "student",
                "designation": [
                  {
                    "language": "de",
                    "value": "Student/in"
                  },
                  {
                    "language": "en",
                    "value": "student"
                  },
                  {
                    "language": "fr",
                    "value": "étudiant-e"
                  },
                  {
                    "language": "gsw",
                    "value": "Student/in"
                  },
                  {
                    "language": "it",
                    "value": "studente/ssa"
                  },
                  {
                    "language": "rm",
                    "value": "student/a"
                  }
                ]
              },
              {
                "code": "housework",
                "display": "housework",
                "designation": [
                  {
                    "language": "de",
                    "value": "im Haushalt tätig"
                  },
                  {
                    "language": "en",
                    "value": "domestic work"
                  },
                  {
                    "language": "fr",
                    "value": "travail domestique"
                  },
                  {
                    "language": "gsw",
                    "value": "im Haushaut tätig"
                  },
                  {
                    "language": "it",
                    "value": "casalinga/o"
                  },
                  {
                    "language": "rm",
                    "value": "occupà en chasada"
                  }
                ]
              },
              {
                "code": "unemployed",
                "display": "unemployed",
                "designation": [
                  {
                    "language": "de",
                    "value": "arbeitslos"
                  },
                  {
                    "language": "en",
                    "value": "unemployed"
                  },
                  {
                    "language": "fr",
                    "value": "sans emploi"
                  },
                  {
                    "language": "gsw",
                    "value": "arbeitslos"
                  },
                  {
                    "language": "it",
                    "value": "disoccupata/o"
                  },
                  {
                    "language": "rm",
                    "value": "dischoccupà"
                  }
                ]
              },
              {
                "code": "retired",
                "display": "retired",
                "designation": [
                  {
                    "language": "de",
                    "value": "pensioniert"
                  },
                  {
                    "language": "en",
                    "value": "retired"
                  },
                  {
                    "language": "fr",
                    "value": "retraité-e"
                  },
                  {
                    "language": "gsw",
                    "value": "pensioniert"
                  },
                  {
                    "language": "it",
                    "value": "pensionata/o"
                  },
                  {
                    "language": "rm",
                    "value": "pensiunà"
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  ],
  "extension": [
    {
      "url": "http://midata.coop/extensions/valueset-reference",
      "valueReference": {
        "reference": "#QS1.yes-no.valueset"
      }
    },
    {
      "url": "http://midata.coop/extensions/valueset-reference",
      "valueReference": {
        "reference": "#QS1.IR1.valueset"
      }
    },
    {
      "url": "http://midata.coop/extensions/valueset-reference",
      "valueReference": {
        "reference": "#QS1.IR2.valueset"
      }
    },
    {
      "url": "http://midata.coop/extensions/valueset-reference",
      "valueReference": {
        "reference": "#QS1.IL1.valueset"
      }
    },
    {
      "url": "http://midata.coop/extensions/valueset-reference",
      "valueReference": {
        "reference": "#QS1.IL4.valueset"
      }
    }
  ],
  "url": "http://fhir.ch/ig/covid-19-prom/Questionnaire/coronascience-situation-questions-QS1",
  "version": "1.4",
  "name": "coronascience-situation-questions-QS1",
  "title": "Corona Science - Situation",
  "_title": {
    "extension": [
      {
        "url": "http://hl7.org/fhir/StructureDefinition/translation",
        "extension": [
          {
            "url": "lang",
            "valueCode": "de"
          },
          {
            "url": "content",
            "valueString": "Corona Science - Situation"
          }
        ]
      },
      {
        "url": "http://hl7.org/fhir/StructureDefinition/translation",
        "extension": [
          {
            "url": "lang",
            "valueCode": "en"
          },
          {
            "url": "content",
            "valueString": "Corona Science - Situation"
          }
        ]
      },
      {
        "url": "http://hl7.org/fhir/StructureDefinition/translation",
        "extension": [
          {
            "url": "lang",
            "valueCode": "fr"
          },
          {
            "url": "content",
            "valueString": "Corona Science - Situation"
          }
        ]
      },
      {
        "url": "http://hl7.org/fhir/StructureDefinition/translation",
        "extension": [
          {
            "url": "lang",
            "valueCode": "gsw"
          },
          {
            "url": "content",
            "valueString": "Corona Science - Situation"
          }
        ]
      },
      {
        "url": "http://hl7.org/fhir/StructureDefinition/translation",
        "extension": [
          {
            "url": "lang",
            "valueCode": "it"
          },
          {
            "url": "content",
            "valueString": "Corona Science - Situazione"
          }
        ]
      },
      {
        "url": "http://hl7.org/fhir/StructureDefinition/translation",
        "extension": [
          {
            "url": "lang",
            "valueCode": "rm"
          },
          {
            "url": "content",
            "valueString": "Corona Science - Situaziun"
          }
        ]
      }
    ]
  },
  "status": "active",
  "subjectType": [
    "Patient"
  ],
  "publisher": "Corona Science",
  "useContext": [
    {
      "code": {
        "system": "http://midata.coop/codesystems/usecontext-type",
        "code": "prom"
      },
      "valueCodeableConcept": {
        "coding": [
          {
            "system": "http://midata.coop/codesystems/coronascience-questionnaire-type",
            "code": "situation-questions"
          }
        ]
      }
    }
  ],
  "effectivePeriod": {
    "start": "2020-04-01"
  },
  "code": [
    {
      "system": "http://loinc.org",
      "code": "89196-0",
      "display": "Patient reported outcome measure panel"
    }
  ],
  "item": [
    {
      "linkId": "QS1.IR0",
      "text": "Risk factors",
      "_text": {
        "extension": [
          {
            "url": "http://hl7.org/fhir/StructureDefinition/translation",
            "extension": [
              {
                "url": "lang",
                "valueCode": "de"
              },
              {
                "url": "content",
                "valueString": "Risikofaktoren"
              }
            ]
          },
          {
            "url": "http://hl7.org/fhir/StructureDefinition/translation",
            "extension": [
              {
                "url": "lang",
                "valueCode": "en"
              },
              {
                "url": "content",
                "valueString": "Risk factors"
              }
            ]
          },
          {
            "url": "http://hl7.org/fhir/StructureDefinition/translation",
            "extension": [
              {
                "url": "lang",
                "valueCode": "fr"
              },
              {
                "url": "content",
                "valueString": "Facteurs de risque"
              }
            ]
          },
          {
            "url": "http://hl7.org/fhir/StructureDefinition/translation",
            "extension": [
              {
                "url": "lang",
                "valueCode": "gsw"
              },
              {
                "url": "content",
                "valueString": "Risikofaktore"
              }
            ]
          },
          {
            "url": "http://hl7.org/fhir/StructureDefinition/translation",
            "extension": [
              {
                "url": "lang",
                "valueCode": "it"
              },
              {
                "url": "content",
                "valueString": "Fattori di rischio"
              }
            ]
          },
          {
            "url": "http://hl7.org/fhir/StructureDefinition/translation",
            "extension": [
              {
                "url": "lang",
                "valueCode": "rm"
              },
              {
                "url": "content",
                "valueString": "Facturs da ristga"
              }
            ]
          }
        ]
      },
      "type": "group",
      "repeats": false,
      "item": [
        {
          "extension": [
            {
              "url": "http://midata.coop/extensions/valueset-unselect-others",
              "extension": [
                {
                  "url": "concept",
                  "valueCode": "260413007"
                }
              ]
            }
          ],
          "linkId": "QS1.IR1",
          "text": "Are you affected by any of the following risk factors?",
          "_text": {
            "extension": [
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "de"
                  },
                  {
                    "url": "content",
                    "valueString": "Bist du von einem der folgenden Risikofaktoren betroffen?"
                  }
                ]
              },
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "en"
                  },
                  {
                    "url": "content",
                    "valueString": "Are you affected by any of the following risk factors?"
                  }
                ]
              },
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "fr"
                  },
                  {
                    "url": "content",
                    "valueString": "Es-tu concerné-e par un ou des facteurs de risque suivants?"
                  }
                ]
              },
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "gsw"
                  },
                  {
                    "url": "content",
                    "valueString": "Bisch du vo eim vo de fougende Risikofaktore betroffe?"
                  }
                ]
              },
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "it"
                  },
                  {
                    "url": "content",
                    "valueString": "Sei affetto da uno dei seguenti fattori di rischio?"
                  }
                ]
              },
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "rm"
                  },
                  {
                    "url": "content",
                    "valueString": "Ès ti affectà d’in dals suandants facturs da ristga?"
                  }
                ]
              }
            ]
          },
          "type": "choice",
          "repeats": true,
          "answerValueSet": "#QS1.IR1.valueset"
        },
        {
          "linkId": "QS1.IR2",
          "text": "Smoking behavior",
          "_text": {
            "extension": [
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "de"
                  },
                  {
                    "url": "content",
                    "valueString": "Rauchverhalten"
                  }
                ]
              },
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "en"
                  },
                  {
                    "url": "content",
                    "valueString": "Smoking behavior"
                  }
                ]
              },
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "fr"
                  },
                  {
                    "url": "content",
                    "valueString": "Comportement tabagique"
                  }
                ]
              },
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "gsw"
                  },
                  {
                    "url": "content",
                    "valueString": "Rouchverhalte"
                  }
                ]
              },
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "it"
                  },
                  {
                    "url": "content",
                    "valueString": "Abitudine al fumo"
                  }
                ]
              },
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "rm"
                  },
                  {
                    "url": "content",
                    "valueString": "Compurtament envers il tabac"
                  }
                ]
              }
            ]
          },
          "type": "choice",
          "repeats": false,
          "answerValueSet": "#QS1.IR2.valueset"
        },
        {
          "extension": [
            {
              "url": "http://hl7.org/fhir/StructureDefinition/questionnaire-observationLinkPeriod",
              "valueDuration": {
                "value": 200,
                "system": "http://unitsofmeasure.org",
                "code": "a"
              }
            }
          ],
          "linkId": "QS1.IR3",
          "code": [
            {
              "system": "http://loinc.org",
              "code": "46251-5",
              "display": "Age group"
            }
          ],
          "text": "Age group",
          "_text": {
            "extension": [
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "de"
                  },
                  {
                    "url": "content",
                    "valueString": "Altersgruppe"
                  }
                ]
              },
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "en"
                  },
                  {
                    "url": "content",
                    "valueString": "Age group"
                  }
                ]
              },
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "fr"
                  },
                  {
                    "url": "content",
                    "valueString": "Groupe d'âge"
                  }
                ]
              },
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "gsw"
                  },
                  {
                    "url": "content",
                    "valueString": "Autersgruppe"
                  }
                ]
              },
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "it"
                  },
                  {
                    "url": "content",
                    "valueString": "Gruppo d'età"
                  }
                ]
              },
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "rm"
                  },
                  {
                    "url": "content",
                    "valueString": "Gruppa da vegliadetgna "
                  }
                ]
              }
            ]
          },
          "type": "string",
          "repeats": false,
          "readOnly": true
        }
      ]
    },
    {
      "linkId": "QS1.IL0",
      "text": "Life situation",
      "_text": {
        "extension": [
          {
            "url": "http://hl7.org/fhir/StructureDefinition/translation",
            "extension": [
              {
                "url": "lang",
                "valueCode": "de"
              },
              {
                "url": "content",
                "valueString": "Lebenssituation"
              }
            ]
          },
          {
            "url": "http://hl7.org/fhir/StructureDefinition/translation",
            "extension": [
              {
                "url": "lang",
                "valueCode": "en"
              },
              {
                "url": "content",
                "valueString": "Life situation"
              }
            ]
          },
          {
            "url": "http://hl7.org/fhir/StructureDefinition/translation",
            "extension": [
              {
                "url": "lang",
                "valueCode": "fr"
              },
              {
                "url": "content",
                "valueString": "Situation de vie"
              }
            ]
          },
          {
            "url": "http://hl7.org/fhir/StructureDefinition/translation",
            "extension": [
              {
                "url": "lang",
                "valueCode": "gsw"
              },
              {
                "url": "content",
                "valueString": "Läbessituation"
              }
            ]
          },
          {
            "url": "http://hl7.org/fhir/StructureDefinition/translation",
            "extension": [
              {
                "url": "lang",
                "valueCode": "it"
              },
              {
                "url": "content",
                "valueString": "Situazione di vita"
              }
            ]
          },
          {
            "url": "http://hl7.org/fhir/StructureDefinition/translation",
            "extension": [
              {
                "url": "lang",
                "valueCode": "rm"
              },
              {
                "url": "content",
                "valueString": "Situaziun da vita"
              }
            ]
          }
        ]
      },
      "type": "group",
      "repeats": false,
      "item": [
        {
          "extension": [
            {
              "url": "http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl",
              "valueCodeableConcept": {
                "coding": [
                  {
                    "system": "http://hl7.org/fhir/questionnaire-item-control",
                    "code": "lookup"
                  }
                ]
              }
            }
          ],
          "linkId": "QS1.IL8",
          "text": "Postal code of current place of residence",
          "_text": {
            "extension": [
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "de"
                  },
                  {
                    "url": "content",
                    "valueString": "Postleitzahl des aktuellen Wohnorts"
                  }
                ]
              },
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "en"
                  },
                  {
                    "url": "content",
                    "valueString": "Postal code of current place of residence"
                  }
                ]
              },
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "fr"
                  },
                  {
                    "url": "content",
                    "valueString": "Code postal du lieu de résidence actuel"
                  }
                ]
              },
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "gsw"
                  },
                  {
                    "url": "content",
                    "valueString": "Postleitzau vo dim aktueue Wohnort"
                  }
                ]
              },
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "it"
                  },
                  {
                    "url": "content",
                    "valueString": "Codice postale del luogo di residenza attuale"
                  }
                ]
              },
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "rm"
                  },
                  {
                    "url": "content",
                    "valueString": "Numer postal da tes domicil"
                  }
                ]
              }
            ]
          },
          "type": "choice",
          "repeats": false,
          "answerValueSet": "http://fhir.ch/ig/covid-19-prom/ValueSet/PLZ"
        },
        {
          "linkId": "QS1.IL6",
          "text": "How many people live in your household (including you)?",
          "_text": {
            "extension": [
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "de"
                  },
                  {
                    "url": "content",
                    "valueString": "Wie viele Personen leben in deinem Haushalt (du inklusive)?"
                  }
                ]
              },
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "en"
                  },
                  {
                    "url": "content",
                    "valueString": "How many people live in your household (including you)?"
                  }
                ]
              },
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "fr"
                  },
                  {
                    "url": "content",
                    "valueString": "Combien de personnes vivent dans ton ménage (toi y compris)?"
                  }
                ]
              },
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "gsw"
                  },
                  {
                    "url": "content",
                    "valueString": "Wie viu Lüt läbe i dim Hushaut (dir inklusive)?"
                  }
                ]
              },
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "it"
                  },
                  {
                    "url": "content",
                    "valueString": "Quante persone vivono nella tua casa (te compreso)?"
                  }
                ]
              },
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "rm"
                  },
                  {
                    "url": "content",
                    "valueString": "Quantas persunas vivan en tia chasada (ti inclus)?"
                  }
                ]
              }
            ]
          },
          "type": "integer",
          "repeats": false
        },
        {
          "linkId": "QS1.IL2",
          "text": "I take care of children, young people",
          "_text": {
            "extension": [
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "de"
                  },
                  {
                    "url": "content",
                    "valueString": "Ich übernehme Betreuungsaufgaben von Kindern, Jugendlichen"
                  }
                ]
              },
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "en"
                  },
                  {
                    "url": "content",
                    "valueString": "I take care of children, young people"
                  }
                ]
              },
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "fr"
                  },
                  {
                    "url": "content",
                    "valueString": "Je prends en charge des tâches de soins aux enfants, jeunes"
                  }
                ]
              },
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "gsw"
                  },
                  {
                    "url": "content",
                    "valueString": "Ig übernime Betreuigsufgabe vo Ching und Jugendliche"
                  }
                ]
              },
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "it"
                  },
                  {
                    "url": "content",
                    "valueString": "Mi prendo cura ed assisto bambini"
                  }
                ]
              },
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "rm"
                  },
                  {
                    "url": "content",
                    "valueString": "Jau surpigl incumbensas d’assistenza per uffants e giuvenils"
                  }
                ]
              }
            ]
          },
          "type": "choice",
          "repeats": false,
          "answerValueSet": "#QS1.yes-no.valueset"
        },
        {
          "linkId": "QS1.IL3",
          "text": "I take care of neighbors, parents, grandparents, etc.",
          "_text": {
            "extension": [
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "de"
                  },
                  {
                    "url": "content",
                    "valueString": "Ich übernehme Betreuungsarbeiten von Nachbarn, Eltern, Grosseltern, etc."
                  }
                ]
              },
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "en"
                  },
                  {
                    "url": "content",
                    "valueString": "I take care of neighbors, parents, grandparents, etc."
                  }
                ]
              },
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "fr"
                  },
                  {
                    "url": "content",
                    "valueString": "J'assure le soutien de voisins, parents, grands-parents, etc."
                  }
                ]
              },
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "gsw"
                  },
                  {
                    "url": "content",
                    "valueString": "Ig übernime Betreuigsufgabe vo Nachbare, Eutere, Grosseutere und so witer"
                  }
                ]
              },
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "it"
                  },
                  {
                    "url": "content",
                    "valueString": "Mi prendo cura o assisto vicini, genitori, nonni, ecc."
                  }
                ]
              },
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "rm"
                  },
                  {
                    "url": "content",
                    "valueString": "Jau surpigl incumbensas d’assistenza per vaschins, geniturs, nons, etc."
                  }
                ]
              }
            ]
          },
          "type": "choice",
          "repeats": false,
          "answerValueSet": "#QS1.yes-no.valueset"
        },
        {
          "linkId": "QS1.IL7",
          "text": "Has anyone close to you been tested positive for the coronavirus?",
          "_text": {
            "extension": [
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "de"
                  },
                  {
                    "url": "content",
                    "valueString": "Ist jemand aus deinem nahen Umfeld positiv auf das Coronavirus getestet worden?"
                  }
                ]
              },
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "en"
                  },
                  {
                    "url": "content",
                    "valueString": "Has anyone close to you been tested positive for the coronavirus?"
                  }
                ]
              },
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "fr"
                  },
                  {
                    "url": "content",
                    "valueString": "Un de tes proches a-t-il été testé positif au coronavirus?"
                  }
                ]
              },
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "gsw"
                  },
                  {
                    "url": "content",
                    "valueString": "Isch öpper us dim nache Umfäud positiv uf ds Coronavirus testet worde?"
                  }
                ]
              },
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "it"
                  },
                  {
                    "url": "content",
                    "valueString": "Qualcuno vicino a te è risultato positivo al coronavirus?"
                  }
                ]
              },
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "rm"
                  },
                  {
                    "url": "content",
                    "valueString": "È insatgi da tia chasada resultà positiv al coronavirus?"
                  }
                ]
              }
            ]
          },
          "type": "choice",
          "repeats": false,
          "answerValueSet": "#QS1.yes-no.valueset"
        },
        {
          "linkId": "QS1.IL1",
          "text": "Current workplace",
          "_text": {
            "extension": [
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "de"
                  },
                  {
                    "url": "content",
                    "valueString": "Aktueller Arbeitsort"
                  }
                ]
              },
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "en"
                  },
                  {
                    "url": "content",
                    "valueString": "Current workplace"
                  }
                ]
              },
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "fr"
                  },
                  {
                    "url": "content",
                    "valueString": "Lieu de travail actuel"
                  }
                ]
              },
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "gsw"
                  },
                  {
                    "url": "content",
                    "valueString": "Aktueu Arbeitsort"
                  }
                ]
              },
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "it"
                  },
                  {
                    "url": "content",
                    "valueString": "Luogo di lavoro attuale"
                  }
                ]
              },
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "rm"
                  },
                  {
                    "url": "content",
                    "valueString": "Lieu da lavur actual"
                  }
                ]
              }
            ]
          },
          "type": "choice",
          "repeats": false,
          "answerValueSet": "#QS1.IL1.valueset"
        },
        {
          "linkId": "QS1.IL4",
          "text": "Current employment status",
          "_text": {
            "extension": [
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "de"
                  },
                  {
                    "url": "content",
                    "valueString": "Aktueller Beschäftigungsstatus"
                  }
                ]
              },
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "en"
                  },
                  {
                    "url": "content",
                    "valueString": "Current employment status"
                  }
                ]
              },
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "fr"
                  },
                  {
                    "url": "content",
                    "valueString": "Situation d'emploi actuelle"
                  }
                ]
              },
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "gsw"
                  },
                  {
                    "url": "content",
                    "valueString": "Aktueue Beschäftigungsstatus"
                  }
                ]
              },
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "it"
                  },
                  {
                    "url": "content",
                    "valueString": "Situazione lavorativa attuale"
                  }
                ]
              },
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "rm"
                  },
                  {
                    "url": "content",
                    "valueString": "Status d’occupaziun"
                  }
                ]
              }
            ]
          },
          "type": "choice",
          "repeats": false,
          "answerValueSet": "#QS1.IL4.valueset"
        },
        {
          "linkId": "QS1.IL5",
          "text": "Do you work in an medical setting with patient contact?",
          "_text": {
            "extension": [
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "de"
                  },
                  {
                    "url": "content",
                    "valueString": "Arbeitest du im medizinischen Umfeld mit Patientenkontakt?"
                  }
                ]
              },
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "en"
                  },
                  {
                    "url": "content",
                    "valueString": "Do you work in an medical setting with patient contact?"
                  }
                ]
              },
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "fr"
                  },
                  {
                    "url": "content",
                    "valueString": "Travailles-tu dans un environnement médical en contact avec des patients?"
                  }
                ]
              },
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "gsw"
                  },
                  {
                    "url": "content",
                    "valueString": "Arbeitisch du im medizinische Umfäud mit Patientekontakt?"
                  }
                ]
              },
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "it"
                  },
                  {
                    "url": "content",
                    "valueString": "Lavori in un ambiente medico ed hai contatti con pazienti?"
                  }
                ]
              },
              {
                "url": "http://hl7.org/fhir/StructureDefinition/translation",
                "extension": [
                  {
                    "url": "lang",
                    "valueCode": "rm"
                  },
                  {
                    "url": "content",
                    "valueString": "Lavuras ti en il circul medicinal cun contact culs pazients?"
                  }
                ]
              }
            ]
          },
          "type": "choice",
          "repeats": false,
          "answerValueSet": "#QS1.yes-no.valueset"
        }
      ]
    }
  ]
}