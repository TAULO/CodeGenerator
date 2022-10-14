export const DEFAULT_RECURRING_QUESTIONS = {
  "resourceType": "Questionnaire",
  "id": "coronascience-recurring-questions-QR1",
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
      "id": "QR1.yes-no.valueset",
      "url": "http://fhir.ch/ig/covid-19-prom/Questionnaire/coronascience-recurring-questions-QR1#QR1.yes-no.valueset",
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
      "id": "QR1.IS3.valueset",
      "url": "http://fhir.ch/ig/covid-19-prom/Questionnaire/coronascience-recurring-questions-QR1#QR1.IS3.valueset",
      "title": "Coronavirus test result",
      "status": "active",
      "compose": {
        "include": [
          {
            "system": "http://fhir.ch/ig/covid-19-prom/codesystem/coronascience-coronavirus-test-result",
            "concept": [
              {
                "code": "testPositive",
                "display": "positive",
                "designation": [
                  {
                    "language": "de",
                    "value": "positiv"
                  },
                  {
                    "language": "en",
                    "value": "positive"
                  },
                  {
                    "language": "fr",
                    "value": "positif"
                  },
                  {
                    "language": "gsw",
                    "value": "positiv"
                  },
                  {
                    "language": "it",
                    "value": "positivo"
                  },
                  {
                    "language": "rm",
                    "value": "positiv"
                  }
                ]
              },
              {
                "code": "testNegative",
                "display": "negative",
                "designation": [
                  {
                    "language": "de",
                    "value": "negativ"
                  },
                  {
                    "language": "en",
                    "value": "negative"
                  },
                  {
                    "language": "fr",
                    "value": "négatif"
                  },
                  {
                    "language": "gsw",
                    "value": "negativ"
                  },
                  {
                    "language": "it",
                    "value": "negativo"
                  },
                  {
                    "language": "rm",
                    "value": "negativ"
                  }
                ]
              },
              {
                "code": "testPending",
                "display": "pending",
                "designation": [
                  {
                    "language": "de",
                    "value": "ausstehend"
                  },
                  {
                    "language": "en",
                    "value": "pending"
                  },
                  {
                    "language": "fr",
                    "value": "en attente"
                  },
                  {
                    "language": "gsw",
                    "value": "warte no druf"
                  },
                  {
                    "language": "it",
                    "value": "in attesa"
                  },
                  {
                    "language": "rm",
                    "value": "pendent"
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
      "id": "QR1.IE1.valueset",
      "url": "http://fhir.ch/ig/covid-19-prom/Questionnaire/coronascience-recurring-questions-QR1#QR1.IE1.valueset",
      "title": "Mood",
      "status": "active",
      "compose": {
        "include": [
          {
            "system": "http://fhir.ch/ig/covid-19-prom/codesystem/coronascience-mood",
            "concept": [
              {
                "code": "good",
                "display": "good",
                "designation": [
                  {
                    "language": "de",
                    "value": "gut"
                  },
                  {
                    "language": "en",
                    "value": "good"
                  },
                  {
                    "language": "fr",
                    "value": "bien"
                  },
                  {
                    "language": "gsw",
                    "value": "guet"
                  },
                  {
                    "language": "it",
                    "value": "bene"
                  },
                  {
                    "language": "rm",
                    "value": "bain"
                  }
                ]
              },
              {
                "code": "ratherGood",
                "display": "rather good",
                "designation": [
                  {
                    "language": "de",
                    "value": "eher gut"
                  },
                  {
                    "language": "en",
                    "value": "rather good"
                  },
                  {
                    "language": "fr",
                    "value": "plutôt bien"
                  },
                  {
                    "language": "gsw",
                    "value": "eher guet"
                  },
                  {
                    "language": "it",
                    "value": "abbastanza bene"
                  },
                  {
                    "language": "rm",
                    "value": "plitost bain"
                  }
                ]
              },
              {
                "code": "ratherBad",
                "display": "rather bad",
                "designation": [
                  {
                    "language": "de",
                    "value": "eher schlecht"
                  },
                  {
                    "language": "en",
                    "value": "rather bad"
                  },
                  {
                    "language": "fr",
                    "value": "pas bien"
                  },
                  {
                    "language": "gsw",
                    "value": "eher schlächt"
                  },
                  {
                    "language": "it",
                    "value": "piuttosto male"
                  },
                  {
                    "language": "rm",
                    "value": "plitost mal"
                  }
                ]
              },
              {
                "code": "bad",
                "display": "bad",
                "designation": [
                  {
                    "language": "de",
                    "value": "schlecht"
                  },
                  {
                    "language": "en",
                    "value": "bad"
                  },
                  {
                    "language": "fr",
                    "value": "mal"
                  },
                  {
                    "language": "gsw",
                    "value": "schlächt"
                  },
                  {
                    "language": "it",
                    "value": "molto male"
                  },
                  {
                    "language": "rm",
                    "value": "mal"
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
      "id": "QR1.IE2.valueset",
      "url": "http://fhir.ch/ig/covid-19-prom/Questionnaire/coronascience-recurring-questions-QR1#QR1.IE2.valueset",
      "title": "Worries",
      "status": "active",
      "compose": {
        "include": [
          {
            "system": "http://fhir.ch/ig/covid-19-prom/codesystem/coronascience-worries",
            "concept": [
              {
                "code": "nothing",
                "display": "nothing",
                "designation": [
                  {
                    "language": "de",
                    "value": "nichts"
                  },
                  {
                    "language": "en",
                    "value": "nothing"
                  },
                  {
                    "language": "fr",
                    "value": "rien"
                  },
                  {
                    "language": "gsw",
                    "value": "nüt"
                  },
                  {
                    "language": "it",
                    "value": "nulla"
                  },
                  {
                    "language": "rm",
                    "value": "nagut"
                  }
                ]
              },
              {
                "code": "family",
                "display": "my family",
                "designation": [
                  {
                    "language": "de",
                    "value": "meine Familie"
                  },
                  {
                    "language": "en",
                    "value": "my family"
                  },
                  {
                    "language": "fr",
                    "value": "ma famille"
                  },
                  {
                    "language": "gsw",
                    "value": "mini Familie"
                  },
                  {
                    "language": "it",
                    "value": "la mia famiglia"
                  },
                  {
                    "language": "rm",
                    "value": "mia famiglia"
                  }
                ]
              },
              {
                "code": "health",
                "display": "my health",
                "designation": [
                  {
                    "language": "de",
                    "value": "meine Gesundheit"
                  },
                  {
                    "language": "en",
                    "value": "my health"
                  },
                  {
                    "language": "fr",
                    "value": "ma santé"
                  },
                  {
                    "language": "gsw",
                    "value": "mini Gsundheit"
                  },
                  {
                    "language": "it",
                    "value": "la mia salute"
                  },
                  {
                    "language": "rm",
                    "value": "mia sanadad"
                  }
                ]
              },
              {
                "code": "future",
                "display": "my future",
                "designation": [
                  {
                    "language": "de",
                    "value": "meine Zukunft"
                  },
                  {
                    "language": "en",
                    "value": "my future"
                  },
                  {
                    "language": "fr",
                    "value": "mon avenir"
                  },
                  {
                    "language": "gsw",
                    "value": "mini Zuekunft"
                  },
                  {
                    "language": "it",
                    "value": "il mio futuro"
                  },
                  {
                    "language": "rm",
                    "value": "mes futur"
                  }
                ]
              },
              {
                "code": "finance",
                "display": "my finance",
                "designation": [
                  {
                    "language": "de",
                    "value": "meine Finanzen"
                  },
                  {
                    "language": "en",
                    "value": "my finance"
                  },
                  {
                    "language": "fr",
                    "value": "mes finances"
                  },
                  {
                    "language": "gsw",
                    "value": "mini Finanze"
                  },
                  {
                    "language": "it",
                    "value": "le mie finanze"
                  },
                  {
                    "language": "rm",
                    "value": "mias finanzas"
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
      "id": "QR1.IE3.valueset",
      "url": "http://fhir.ch/ig/covid-19-prom/Questionnaire/coronascience-recurring-questions-QR1#QR1.IE3.valueset",
      "title": "Going outside",
      "status": "active",
      "compose": {
        "include": [
          {
            "system": "http://fhir.ch/ig/covid-19-prom/codesystem/coronascience-going-outside",
            "concept": [
              {
                "code": "severalTimesADay",
                "display": "several times a day",
                "designation": [
                  {
                    "language": "de",
                    "value": "mehrmals pro Tag"
                  },
                  {
                    "language": "en",
                    "value": "several times a day"
                  },
                  {
                    "language": "fr",
                    "value": "plusieurs fois par jour"
                  },
                  {
                    "language": "gsw",
                    "value": "mehrmaus am Tag"
                  },
                  {
                    "language": "it",
                    "value": "più volte al giorno"
                  },
                  {
                    "language": "rm",
                    "value": "pliras giadas per di"
                  }
                ]
              },
              {
                "code": "severalTimesAWeek",
                "display": "several times a week",
                "designation": [
                  {
                    "language": "de",
                    "value": "mehrmals pro Woche"
                  },
                  {
                    "language": "en",
                    "value": "several times a week"
                  },
                  {
                    "language": "fr",
                    "value": "plusieurs fois par semaine"
                  },
                  {
                    "language": "gsw",
                    "value": "mehrmaus ir Wuche"
                  },
                  {
                    "language": "it",
                    "value": "più volte alla settimana"
                  },
                  {
                    "language": "rm",
                    "value": "pliras giadas l’emna"
                  }
                ]
              },
              {
                "code": "onceAWeek",
                "display": "once a week",
                "designation": [
                  {
                    "language": "de",
                    "value": "einmal pro Woche"
                  },
                  {
                    "language": "en",
                    "value": "once a week"
                  },
                  {
                    "language": "fr",
                    "value": "une fois par semaine"
                  },
                  {
                    "language": "gsw",
                    "value": "einisch ir Wuche"
                  },
                  {
                    "language": "it",
                    "value": "una volta alla settimana"
                  },
                  {
                    "language": "rm",
                    "value": "ina giada l'emna"
                  }
                ]
              },
              {
                "code": "never",
                "display": "never",
                "designation": [
                  {
                    "language": "de",
                    "value": "nie"
                  },
                  {
                    "language": "en",
                    "value": "never"
                  },
                  {
                    "language": "fr",
                    "value": "jamais"
                  },
                  {
                    "language": "gsw",
                    "value": "gar nid"
                  },
                  {
                    "language": "it",
                    "value": "mai"
                  },
                  {
                    "language": "rm",
                    "value": "mai"
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
      "id": "QR1.IE4.valueset",
      "url": "http://fhir.ch/ig/covid-19-prom/Questionnaire/coronascience-recurring-questions-QR1#QR1.IE4.valueset",
      "title": "Feeling",
      "status": "active",
      "compose": {
        "include": [
          {
            "system": "http://fhir.ch/ig/covid-19-prom/codesystem/coronascience-feeling",
            "concept": [
              {
                "code": "supported",
                "display": "supported",
                "designation": [
                  {
                    "language": "de",
                    "value": "gut aufgehoben"
                  },
                  {
                    "language": "en",
                    "value": "supported"
                  },
                  {
                    "language": "fr",
                    "value": "très soutenu-e"
                  },
                  {
                    "language": "gsw",
                    "value": "guet ufghobe"
                  },
                  {
                    "language": "it",
                    "value": "molto supportata/o"
                  },
                  {
                    "language": "rm",
                    "value": "en buns mauns"
                  }
                ]
              },
              {
                "code": "ratherSupported",
                "display": "rather supported",
                "designation": [
                  {
                    "language": "de",
                    "value": "eher gut aufgehoben"
                  },
                  {
                    "language": "en",
                    "value": "rather supported"
                  },
                  {
                    "language": "fr",
                    "value": "plutôt soutenu-e"
                  },
                  {
                    "language": "gsw",
                    "value": "eher guet ufghobe"
                  },
                  {
                    "language": "it",
                    "value": "abbastanza supportata/o"
                  },
                  {
                    "language": "rm",
                    "value": "plitost en buns mauns"
                  }
                ]
              },
              {
                "code": "ratherLonely",
                "display": "rather lonely",
                "designation": [
                  {
                    "language": "de",
                    "value": "eher einsam"
                  },
                  {
                    "language": "en",
                    "value": "rather lonely"
                  },
                  {
                    "language": "fr",
                    "value": "relativement seul-e"
                  },
                  {
                    "language": "gsw",
                    "value": "eher elei"
                  },
                  {
                    "language": "it",
                    "value": "relativamente sola/o"
                  },
                  {
                    "language": "rm",
                    "value": "plitost sulet"
                  }
                ]
              },
              {
                "code": "lonely",
                "display": "lonely",
                "designation": [
                  {
                    "language": "de",
                    "value": "einsam"
                  },
                  {
                    "language": "en",
                    "value": "lonely"
                  },
                  {
                    "language": "fr",
                    "value": "très seul-e"
                  },
                  {
                    "language": "gsw",
                    "value": "elei"
                  },
                  {
                    "language": "it",
                    "value": "molto sola/o"
                  },
                  {
                    "language": "rm",
                    "value": "sulet"
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
        "reference": "#QR1.yes-no.valueset"
      }
    },
    {
      "url": "http://midata.coop/extensions/valueset-reference",
      "valueReference": {
        "reference": "#QR1.IS3.valueset"
      }
    },
    {
      "url": "http://midata.coop/extensions/valueset-reference",
      "valueReference": {
        "reference": "#QR1.IE1.valueset"
      }
    },
    {
      "url": "http://midata.coop/extensions/valueset-reference",
      "valueReference": {
        "reference": "#QR1.IE2.valueset"
      }
    },
    {
      "url": "http://midata.coop/extensions/valueset-reference",
      "valueReference": {
        "reference": "#QR1.IE3.valueset"
      }
    },
    {
      "url": "http://midata.coop/extensions/valueset-reference",
      "valueReference": {
        "reference": "#QR1.IE4.valueset"
      }
    }
  ],
  "url": "http://fhir.ch/ig/covid-19-prom/Questionnaire/coronascience-recurring-questions-QR1",
  "version": "1.2",
  "name": "coronascience-recurring-questions-QR1",
  "title": "Corona Science - Recurring questions",
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
            "valueString": "Corona Science - Wiederkehrende Fragen"
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
            "valueString": "Corona Science - Recurring questions"
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
            "valueString": "Corona Science - Questions récurrentes"
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
            "valueString": "Corona Science - Wederkehrendi Frage"
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
            "valueString": "Corona Science - Questioni ricorrenti"
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
            "valueString": "Corona Science - Dumondas che sa repetan"
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
            "code": "recurring-questions"
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
      "linkId": "QR1.IS0",
      "text": "Symptoms",
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
                "valueString": "Symptome"
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
                "valueString": "Symptoms"
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
                "valueString": "Symptômes"
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
                "valueString": "Symptom"
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
                "valueString": "Sintomi"
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
                "valueString": "Sintoms"
              }
            ]
          }
        ]
      },
      "type": "group",
      "repeats": false,
      "item": [
        {
          "linkId": "QR1.IS1",
          "text": "Do you suspect having contracted with the coronavirus?",
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
                    "valueString": "Hast du den Verdacht, am Coronavirus zu leiden?"
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
                    "valueString": "Do you suspect having contracted the coronavirus?"
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
                    "valueString": "Penses-tu souffrir du coronavirus?"
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
                    "valueString": "Hesch du ds Gfüeu, am Coronavirus z'lide?"
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
                    "valueString": "Pensi di avere il coronavirus?"
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
                    "valueString": "Suspectas ti d’avair il coronavirus?"
                  }
                ]
              }
            ]
          },
          "type": "choice",
          "repeats": false,
          "answerValueSet": "#QR1.yes-no.valueset"
        },
        {
          "linkId": "QR1.IS2",
          "text": "Have you been tested for the coronavirus?",
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
                    "valueString": "Wurdest du auf das Coronavirus getestet?"
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
                    "valueString": "Have you been tested for the coronavirus?"
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
                    "valueString": "As-tu été testé-e pour le coronavirus?"
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
                    "valueString": "Bisch du uf ds Coronavirus testet worde?"
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
                    "valueString": "Hai effettuato un test per il coronavirus?"
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
                    "valueString": "Has ti fatg in coronavirus test?"
                  }
                ]
              }
            ]
          },
          "type": "choice",
          "repeats": false,
          "answerValueSet": "#QR1.yes-no.valueset"
        },
        {
          "linkId": "QR1.IS3",
          "text": "What is the test result?",
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
                    "valueString": "Wie lautet das Testergebnis?"
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
                    "valueString": "What is the test result?"
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
                    "valueString": "Quel est le résultat du test?"
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
                    "valueString": "Wie lutet dis Testergäbnis?"
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
                    "valueString": "Qual è il risultato del test?"
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
                    "valueString": "Co è il resultat dal test?"
                  }
                ]
              }
            ]
          },
          "type": "choice",
          "enableWhen": [
            {
              "question": "QR1.IS2",
              "operator": "=",
              "answerCoding": {
                "system": "http://snomed.info/sct",
                "code": "373066001"
              }
            }
          ],
          "repeats": false,
          "answerValueSet": "#QR1.IS3.valueset"
        },
        {
          "linkId": "QR1.IS4",
          "text": "Have you contacted a doctor's office or an emergency room?",
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
                    "valueString": "Hast du eine Arztpraxis oder eine Notfallaufnahme kontaktiert?"
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
                    "valueString": "Have you contacted a doctor's office or an emergency room?"
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
                    "valueString": "As-tu contacté un cabinet médical ou les urgences?"
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
                    "valueString": "Hesch du en Arztpraxis oder e Notufnahm kontaktiert?"
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
                    "valueString": "Hai contattato uno studio medico o un pronto soccorso?"
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
                    "valueString": "Has ti contactà ina pratica da medi u ina recepziun da cas urgents?"
                  }
                ]
              }
            ]
          },
          "type": "choice",
          "repeats": false,
          "answerValueSet": "#QR1.yes-no.valueset"
        }
      ]
    },
    {
      "linkId": "QR1.IE0",
      "text": "Emotional state",
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
                "valueString": "Befindlichkeit"
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
                "valueString": "Emotional state"
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
                "valueString": "État émotionnel"
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
                "valueString": "Befindlechkeit"
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
                "valueString": "Stato emotivo"
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
                "valueString": "Stadi da l'olma"
              }
            ]
          }
        ]
      },
      "type": "group",
      "repeats": false,
      "item": [
        {
          "linkId": "QR1.IE1",
          "text": "How are you?",
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
                    "valueString": "Wie geht es dir?"
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
                    "valueString": "How are you?"
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
                    "valueString": "Comment vas-tu?"
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
                    "valueString": "Wie geit's dir so?"
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
                    "valueString": "Come stai?"
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
                    "valueString": "Co vai?"
                  }
                ]
              }
            ]
          },
          "type": "choice",
          "repeats": false,
          "answerValueSet": "#QR1.IE1.valueset"
        },
        {
          "extension": [
            {
              "url": "http://midata.coop/extensions/valueset-unselect-others",
              "extension": [
                {
                  "url": "concept",
                  "valueCode": "nothing"
                }
              ]
            }
          ],
          "linkId": "QR1.IE2",
          "text": "I'm worried about...",
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
                    "valueString": "Ich mache mir Sorgen über..."
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
                    "valueString": "I'm worried about..."
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
                    "valueString": "Je me fais du soucis pour..."
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
                    "valueString": "I mache mir Sorge um..."
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
                    "valueString": "Sono preoccupata/o per..."
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
                    "valueString": "Jau hai quità per..."
                  }
                ]
              }
            ]
          },
          "type": "choice",
          "repeats": true,
          "answerValueSet": "#QR1.IE2.valueset"
        },
        {
          "linkId": "QR1.IE3",
          "text": "I go outside...",
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
                    "valueString": "Ich gehe nach draussen..."
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
                    "valueString": "I go outside..."
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
                    "valueString": "Je vais dehors..."
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
                    "valueString": "I go voruse..."
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
                    "valueString": "Esco di casa..."
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
                    "valueString": "Jau vegn dadora..."
                  }
                ]
              }
            ]
          },
          "type": "choice",
          "repeats": false,
          "answerValueSet": "#QR1.IE3.valueset"
        },
        {
          "linkId": "QR1.IE4",
          "text": "I'm feeling....",
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
                    "valueString": "Ich fühle mich..."
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
                    "valueString": "I'm feeling..."
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
                    "valueString": "Je me sens..."
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
                    "valueString": "I füehle mi..."
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
                    "valueString": "Mi sento..."
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
                    "valueString": "Jau sun..."
                  }
                ]
              }
            ]
          },
          "type": "choice",
          "repeats": false,
          "answerValueSet": "#QR1.IE4.valueset"
        }
      ]
    }
  ]
}