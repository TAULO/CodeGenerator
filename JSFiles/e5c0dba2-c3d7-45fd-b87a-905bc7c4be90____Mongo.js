print("Création de la base de données...");
db = db.getSiblingDB('na17vivienleclercq');
print("done.");
print();

print("Notice : Les données se trouvent dans la base na17vivienleclercq.");

//SUPPRESSION DES DONNEES
print("Suppression des anciennes données...");
db.personne.remove({});
db.produit.remove({});
db.stock.remove({});
db.bondecommande.remove({});
db.remise.remove({});
db.ticketsav.remove({});
print("done.");
print();

//AJOUT DES DONNEES
print("Ajout des nouvelles données...");
db.personne.insert(
  [
      {
        nom: "Leclercq",
        prenom: "Vivien",
        date_de_naissance: new Date("1999-12-14"),
        email: "vivien.leclercq@gmail.com",
        adresse: {
          numero: 62,
          rue: "rue du Val",
          code_postal: "60000",
          ville: "Beauvais"
        },
        membre_entreprise: true,
        service: "SAV",
        factures: [
          {
            produits: [
              {
                reference: "Asus Vivobook R509JA-EJ032T",
                numero_de_serie: 78,
                prix: 799.99,
                garantie: null,
                installation_par_specialiste: null
              },
            ],

            reparations: null,

            remises: [
              {
                code: "JOYEUXNOEL",
                type: "promotion",
                montant: 10.0
              },
              {
                code: "PROMO2020",
                type: "pourcentage",
                montant: 3
              }
            ],

            montant_total: 766.30,
            payee: true,
            date_paiement: new Date(),

            done_by: {
              nom: "Lemoine",
              prenom: "Sylvain",
              date_de_naissance: new Date("1978-08-10")
            },
          },
          {
            produits: [
              {
                reference: "Brandt B5006UHD",
                numero_de_serie: 43,
                prix: 430.20,
                garantie: null,
                installation_par_specialiste: null
              },
            ],

            reparations: null,

            remises: null,

            montant_total: 430.20,
            payee: true,
            date_paiement: new Date(),

            done_by: {
              nom: "Lemoine",
              prenom: "Sylvain",
              date_de_naissance: new Date("1978-08-10")
            },
          },
          {
            produits: null,

            reparations: [
              {
                numero_reparation: 1,
                produit: {
                  reference: "Asus Vivobook R509JA-EJ032T",
                  numero_de_serie: 78
                },
                date_achat: new Date(),
                prix: 299.99
              }
            ],

            remises: [
              {
                code: "TJTTEGFTJRTZCGUEE",
                type: "garantie",
                montant: 299.99
              }
            ],

            montant_total: 0.0,
            payee: true,
            date_paiement: new Date(),

            done_by: {
              nom: "Lemoine",
              prenom: "Sylvain",
              date_de_naissance: new Date("1978-08-10")
            },
          }
        ]
      },
      {
        nom: "Martin",
        prenom: "Robert",
        date_de_naissance: new Date("1967-12-30"),
        email: "robert.martin@gmail.com",
        adresse: {
          numero: 230,
          rue: "Grande Rue",
          code_postal: "60000",
          ville: "Beauvais"
        },
        membre_entreprise: false,
        service: null,
        factures: null
      },
      {
        nom: "Robert",
        prenom: "Charles",
        date_de_naissance: new Date("1982-10-21"),
        email: "charles.robert@gmail.com",
        adresse: {
          numero: 36,
          rue: "rue du Sel",
          code_postal: "59310",
          ville: "Seclin"
        },
        membre_entreprise: true,
        service: "achat",
        factures: [
          {
            produits: [
              {
                reference: "Brandt B5006UHD",
                numero_de_serie: 42,
                prix: 430.20,
                garantie: 50.0,
                installation_par_specialiste: 10
              }
            ],

            reparations: null,

            remises: [
              {
                code: "JOYEUXNOEL",
                type: "promotion",
                montant: 10.0
              },
              {
                code: "PROMO2020",
                type: "pourcentage",
                montant: 3
              }
            ],

            montant_total: 465.80,
            payee: true,
            date_paiement: new Date(),

            done_by: {
              nom: "Lemoine",
              prenom: "Sylvain",
              date_de_naissance: new Date("1978-08-10")
            },
          }
        ]
      },
      {
        nom: "Huet",
        prenom: "Alice",
        date_de_naissance: new Date("1979-03-19"),
        email: "alice.huet@gmail.com",
        adresse: {
          numero: 12,
          rue: "boulevard des Chaussettes Mouillées",
          code_postal: "60000",
          ville: "Beauvais"
        },
        membre_entreprise: false,
        service: null,
        factures: null
      },
      {
        nom: "Morel",
        prenom: "Jade",
        date_de_naissance: new Date("2001-05-03"),
        email: "jade.morel@gmail.com",
        adresse: {
          numero: 12,
          rue: "rue du Dr Froma",
          code_postal: "60000",
          ville: "Beauvais"
        },
        membre_entreprise: true,
        service: "vente",
        factures: [
          {
            produits: [
              {
                reference: "Canon PIXMA TS8251",
                numero_de_serie: 52,
                prix: 109.0,
                garantie: null,
                installation_par_specialiste: null
              }
            ],

            reparations: null,

            remises: [
              {
                code: "JOYEUXNOEL",
                type: "promotion",
                montant: 10.0
              },
              {
                code: "PROMO2020",
                type: "pourcentage",
                montant: 3
              }
            ],

            montant_total: 96.03,
            payee: true,
            date_paiement: new Date(),

            done_by: {
              nom: "Lemoine",
              prenom: "Sylvain",
              date_de_naissance: new Date("1978-08-10")
            },
          }
        ]
      },
      {
        nom: "Lebrun",
        prenom: "Martine",
        date_de_naissance: new Date("1978-08-10"),
        email: "martine.lebrun@gmail.com",
        adresse: {
          numero: 3,
          rue: "impasse des Fossés",
          code_postal: "06000",
          ville: "Nice"
        },
        membre_entreprise: false,
        service: null,
        factures: [
          {
            produits: [
              {
                reference: "Brandt B5006UHD",
                numero_de_serie: 46,
                prix: 430.20,
                garantie: null,
                installation_par_specialiste: 10
              },
              {
                reference: "Samsung RB31FERNCSA",
                numero_de_serie: 64,
                prix: 594.99,
                garantie: 50,
                installation_par_specialiste: null
              }
            ],

            reparations: null,

            remises: [
              {
                code: "JOYEUXNOEL",
                type: "promotion",
                montant: 10.0
              },
              {
                code: "PROMO2020",
                type: "pourcentage",
                montant: 3
              }
            ],

            montant_total: 1042.94,
            payee: true,
            date_paiement: new Date(),

            done_by: {
              nom: "Lemoine",
              prenom: "Sylvain",
              date_de_naissance: new Date("1978-08-10")
            },
          }
        ]
      },
      {
        nom: "Lemoine",
        prenom: "Sylvain",
        date_de_naissance: new Date("1978-08-10"),
        email: "sylvain.lemoine@gmail.com",
        adresse: {
          numero: 269,
          rue: "rue du Fromage",
          code_postal: "60200",
          ville: "Compiègne"
        },
        membre_entreprise: true,
        service: "vente",
        factures: null
      },
      {
        nom: "Vidal",
        prenom: "Romane",
        date_de_naissance: new Date("1984-11-24"),
        email: "romane.vidal@gmail.com",
        adresse: {
          numero: 92,
          rue: "rue de la Victoire",
          code_postal: "80000",
          ville: "Amiens"
        },
        membre_entreprise: true,
        service: null,
        factures: null
      },
      {
        nom: "Dubois",
        prenom: "Patricia",
        date_de_naissance: new Date("1998-06-29"),
        email: "patricia.dubois@gmail.com",
        adresse: {
          numero: 59,
          rue: "rue des Vignes",
          code_postal: "60000",
          ville: "Beauvais"
        },
        membre_entreprise: false,
        service: null,
        factures: null
      }
  ]
);

db.produit.insert(
  [
    {
      reference: "Brandt B5006UHD",
      description: {
        short: "Télévision LED UHD 4K",
        long: "Cette télévision 4K est faite pour vous ! Avec sa résolution UHD et la technologie LED vous disposerez d une image incroyable."
      },
      prix_conseille: 449.99,
      consommation: 126,
      marque: "Brandt",
      souscategorie: "TV",
      categorie: "Loisirs"
    },
    {
      reference: "Philips 43PFS5503",
      description: {
        short: "Télévision LED UHD 4K",
        long: "Cette télévision 4K est faite pour vous ! Avec sa résolution UHD et la technologie LED vous disposerez d une image incroyable."
      },
      prix_conseille: 334.67,
      consommation: 126,
      marque: "Philips",
      souscategorie: "TV",
      categorie: "Loisirs"
    },
    {
      reference: "Philips The One 65PUS7354",
      description: {
        short: "Télévision LED UHD 4K",
        long: "Cette télévision est faite pour vous ! Le technologie LED vous permet une basse consommation."
      },
      prix_conseille: 669.99,
      consommation: 89,
      marque: "Philips",
      souscategorie: "TV",
      categorie: "Loisirs"
    },
    {
      reference: "Asus TUF505DT-BQ437T",
      description: {
        short: "Ordinateur portable Gamer",
        long: "Enfin un ordinateur gamer de qualité à très bon prix."
      },
      prix_conseille: 879.67,
      consommation: 254,
      marque: "Asus",
      souscategorie: "Ordinateur",
      categorie: "Informatique"
    },
    {
      reference: "HP 15-DC1066NF",
      description: {
        short: "Ordinateur portable Gamer",
        long: "Ce PC portable Gamer haut de gamme vous permettre de jouer aux meilleurs jeux facilement et en haute résolution."
      },
      prix_conseille: 1469.99,
      consommation: 367,
      marque: "HP",
      souscategorie: "Ordinateur",
      categorie: "Informatique"
    },
    {
      reference: "Acer PH315-52-56SX",
      description: {
        short: "Ordinateur portable Gamer",
        long: "Ce PC portable Gamer haut de gamme vous permettre de jouer aux meilleurs jeux facilement et en haute résolution."
      },
      prix_conseille: 1439.87,
      consommation: 112,
      marque: "Acer",
      souscategorie: "Ordinateur",
      categorie: "Informatique"
    },
    {
      reference: "Asus Vivobook R509JA-EJ032T",
      description: {
        short: "Ordinateur portable",
        long: "Ce PC portable est fait pour vos actions de bureautique. Haut de gamme il tiendra longtemps et sera efficace."
      },
      prix_conseille: 799.99,
      consommation: 112,
      marque: "Asus",
      souscategorie: "Ordinateur",
      categorie: "Informatique"
    },
    {
      reference: "Samsung RB31FERNCSA",
      description: {
        short: "Réfrigérateur congélateur en bas",
        long: "Un congélateur assez grand pour pouvoir cacher un corps à l intérieur."
      },
      prix_conseille: 549.99,
      consommation: 306,
      marque: "Samsung",
      souscategorie: "Réfrigérateur",
      categorie: "Electroménager"
    },
    {
      reference: "Beko RCNA340K20S SILVER",
      description: {
        short: "Réfrigérateur congélateur en bas",
        long: "Congeler c est pratique parfois quand on veut conserver plus longtemps."
      },
      prix_conseille: 334.67,
      consommation: 304,
      marque: "Beko",
      souscategorie: "Réfrigérateur",
      categorie: "Electroménager"
    },
    {
      reference: "Proline PSBS92IX",
      description: {
        short: "Réfrigérateur congélateur en bas",
        long: "J ai envie d un mojito."
      },
      prix_conseille: 549.00,
      consommation: 287,
      marque: "Proline",
      souscategorie: "Réfrigérateur",
      categorie: "Electroménager"
    },
    {
      reference: "LG GBB61DSJZN",
      description: {
        short: "Télévision LED UHD 4K",
        long: "Encore une télivision 4K UHC, pas très originale mais au moins c est une LG."
      },
      prix_conseille: 699.99,
      consommation: 298,
      marque: "LG",
      souscategorie: "Réfrigérateur",
      categorie: "Electroménager"
    },
    {
      reference: "LG 55C9",
      description: {
        short: "Télévision LED UHD 4K",
        long: "Encore une télévision mais peu chère cette fois."
      },
      prix_conseille: 334.67,
      consommation: 112,
      marque: "LG",
      souscategorie: "TV",
      categorie: "Loisirs"
    }
    ,
    {
      reference: "Proline PLCH104",
      description: {
        short: "Télévision LED UHD 4K",
        long: "Un énorme congélateur pour congeler"
      },
      prix_conseille: 159.90,
      consommation: 168,
      marque: "Proline",
      souscategorie: "Congélateur",
      categorie: "Electroménager"
    },
    {
      reference: "Proline DW 486 WHITE",
      description: {
        short: "Lave-vaisselle bon marché",
        long: "Un lave-vaisselle pour vous éviter de faire la vaisselle, parce que la vaisselle c est long à faire."
      },
      prix_conseille: 159.90,
      consommation: 258,
      marque: "Lave-vaisselle",
      souscategorie: "TV",
      categorie: "Electroménager"
    },
    {
      reference: "Thomson TDW 6047 WH",
      description: {
        short: "Lave-vaisselle haut de gamme",
        long: "Un lave-vaisselle très cher qui fera la vaisselle à votre place."
      },
      prix_conseille: 349.90,
      consommation: 266,
      marque: "Thomson",
      souscategorie: "Lave-vaisselle",
      categorie: "Electroménager"
    },
    {
      reference: "Canon PIXMA TS8251",
      description: {
        short: "Imprimante à jet d'encre",
        long: "Cette imprimante est bon marché mais après vous devrez acheter beaucoup de cartouches d encre."
      },
      prix_conseille: 109.90,
      consommation: 159,
      marque: "Canon",
      souscategorie: "Imprimante",
      categorie: "Informatique"
    },
    {
      reference: "HP LaserJet Pro M283FDW",
      description: {
        short: "Imprimante laser",
        long: "Une très bonne imprimante laser pour imprimer vos cours chez vous et ne plus aller au Polar."
      },
      prix_conseille: 159.90,
      consommation: 168,
      marque: "HP",
      souscategorie: "Imprimante",
      categorie: "Informatique"
    },
    {
      reference: "Dyson CYCLONE V10 ABSOLUTE",
      description: {
        short: "Aspirateur balai",
        long: "Un aspirateur cher, très cher. Après tout c est un aspirateur. Avez-vous besoin de mettre autant d argent juste pour aspirateur ?"
      },
      prix_conseille: 449.99,
      consommation: 108,
      marque: "Dyson",
      souscategorie: "Aspirateur",
      categorie: "Electroménager"
    },
    {
      reference: "Rowenta RO7455EA",
      description: {
        short: "Aspirateur avec sac",
        long: "Un aspirateur avez sac comme ça vous devrez acheter des sacs et polluer la planète."
      },
      prix_conseille: 199.90,
      consommation: 117,
      marque: "Rowenta",
      souscategorie: "Aspirateur",
      categorie: "Electroménager"
    },
    {
      reference: "Irobot ROOMBA I7",
      description: {
        short: "Aspirateur robot",
        long: "Un aspirateur robot comme ça vous n aurez même plus besoin de passer l aspirateur."
      },
      prix_conseille: 599.99,
      consommation: 268,
      marque: "Irobot",
      souscategorie: "Aspirateur",
      categorie: "Electroménager"
    },
    {
      reference: "Hoover HF122PTA",
      description: {
        short: "Aspirateur balai",
        long: "Un aspirateur balai... En fait c est un aspirateur qui ressemble un peu à un balai du coup on appelle ça comme ça."
      },
      prix_conseille: 159.00,
      consommation: 1303,
      marque: "Hoover",
      souscategorie: "Aspirateur",
      categorie: "Electroménager"
    },
    {
      reference: "Miele NEW Compact C2 Silence E",
      description: {
        short: "Aspirateur avec sac",
        long: "Bref."
      },
      prix_conseille: 249.99,
      consommation: 181,
      marque: "Miele",
      souscategorie: "Aspirateur",
      categorie: "Electroménager"
    }
  ]
);

db.stock.insert([
  {
    produit_reference: "HP 15-DC1066NF",
    numero_de_serie: 1,
    prix: 1369.99,
    fournisseur: {
      nom: "Amazon",
      adresse: {
        numero: 67,
        rue: "boulevard du Général Leclerc",
        code_postal: "92110",
        ville: "Clichy"
      }
    },
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: false
  },
  {
    produit_reference: "HP 15-DC1066NF",
    numero_de_serie: 2,
    prix: 1369.99,
    fournisseur: {
      nom: "Amazon",
      adresse: {
        numero: 67,
        rue: "boulevard du Général Leclerc",
        code_postal: "92110",
        ville: "Clichy"
      }
    },
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: false
  },
  {
    produit_reference: "HP 15-DC1066NF",
    numero_de_serie: 3,
    prix: 1369.99,
    fournisseur: {
      nom: "Amazon",
      adresse: {
        numero: 67,
        rue: "boulevard du Général Leclerc",
        code_postal: "92110",
        ville: "Clichy"
      }
    },
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: true
  },
  {
    produit_reference: "HP 15-DC1066NF",
    numero_de_serie: 4,
    prix: 1369.99,
    fournisseur: {
      nom: "Amazon",
      adresse: {
        numero: 67,
        rue: "boulevard du Général Leclerc",
        code_postal: "92110",
        ville: "Clichy"
      }
    },
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: false
  },
  {
    produit_reference: "HP 15-DC1066NF",
    numero_de_serie: 5,
    prix: 1369.99,
    fournisseur: {
      nom: "Amazon",
      adresse: {
        numero: 67,
        rue: "boulevard du Général Leclerc",
        code_postal: "92110",
        ville: "Clichy"
      }
    },
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: true
  },
  {
    produit_reference: "HP 15-DC1066NF",
    numero_de_serie: 6,
    prix: 1369.99,
    fournisseur: {
      nom: "Amazon",
      adresse: {
        numero: 67,
        rue: "boulevard du Général Leclerc",
        code_postal: "92110",
        ville: "Clichy"
      }
    },
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: false
  },
  {
    produit_reference: "HP 15-DC1066NF",
    numero_de_serie: 7,
    prix: 1369.99,
    fournisseur: {
      nom: "Amazon",
      adresse: {
        numero: 67,
        rue: "boulevard du Général Leclerc",
        code_postal: "92110",
        ville: "Clichy"
      }
    },
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: false
  },
  {
    produit_reference: "HP 15-DC1066NF",
    numero_de_serie: 8,
    prix: 1369.99,
    fournisseur: {
      nom: "Amazon",
      adresse: {
        numero: 67,
        rue: "boulevard du Général Leclerc",
        code_postal: "92110",
        ville: "Clichy"
      }
    },
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: false
  },
  {
    produit_reference: "HP 15-DC1066NF",
    numero_de_serie: 9,
    prix: 1369.99,
    fournisseur: {
      nom: "Amazon",
      adresse: {
        numero: 67,
        rue: "boulevard du Général Leclerc",
        code_postal: "92110",
        ville: "Clichy"
      }
    },
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: false
  },
  {
    produit_reference: "HP 15-DC1066NF",
    numero_de_serie: 10,
    prix: 1369.99,
    fournisseur: {
      nom: "Amazon",
      adresse: {
        numero: 67,
        rue: "boulevard du Général Leclerc",
        code_postal: "92110",
        ville: "Clichy"
      }
    },
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: false
  },
  {
    produit_reference: "HP 15-DC1066NF",
    numero_de_serie: 11,
    prix: 1369.99,
    fournisseur: {
      nom: "Darty",
      adresse: {
        numero: 129,
        rue: "avenue Galliéni",
        code_postal: "93140",
        ville: "Bondy"
      }
    },
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: false
  },
  {
    produit_reference: "HP 15-DC1066NF",
    numero_de_serie: 12,
    prix: 1369.99,
    fournisseur: {
      nom: "Ali Baba",
      adresse: {
        numero: 10,
        rue: "rue des Patates",
        code_postal: "69000",
        ville: "Lyon"
      }
    },
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: true
  },
  {
    produit_reference: "HP 15-DC1066NF",
    numero_de_serie: 13,
    prix: 1369.99,
    fournisseur: {
      nom: "Top achat",
      adresse: {
        numero: 2,
        rue: "rue des Erables",
        code_postal: "69570",
        ville: "Limonest"
      }
    },
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: false
  },
  {
    produit_reference: "HP 15-DC1066NF",
    numero_de_serie: 14,
    prix: 1369.99,
    fournisseur: {
      nom: "Amazon",
      adresse: {
        numero: 67,
        rue: "boulevard du Général Leclerc",
        code_postal: "92110",
        ville: "Clichy"
      }
    },
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: false
  },
  {
    produit_reference: "HP 15-DC1066NF",
    numero_de_serie: 15,
    prix: 1369.99,
    fournisseur: {
      nom: "Amazon",
      adresse: {
        numero: 67,
        rue: "boulevard du Général Leclerc",
        code_postal: "92110",
        ville: "Clichy"
      }
    },
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: false
  },
  {
    produit_reference: "LG 55C9",
    numero_de_serie: 16,
    prix: 314.67,
    fournisseur: {
      nom: "Darty",
      adresse: {
        numero: 129,
        rue: "avenue Galliéni",
        code_postal: "93140",
        ville: "Bondy"
      }
    },
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: false
  },
  {
    produit_reference: "LG 55C9",
    numero_de_serie: 17,
    prix: 314.67,
    fournisseur: {
      nom: "Ali Baba",
      adresse: {
        numero: 10,
        rue: "rue des Patates",
        code_postal: "69000",
        ville: "Lyon"
      }
    },
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: true
  },
  {
    produit_reference: "LG 55C9",
    numero_de_serie: 18,
    prix: 314.67,
    fournisseur: {
      nom: "Darty",
      adresse: {
        numero: 129,
        rue: "avenue Galliéni",
        code_postal: "93140",
        ville: "Bondy"
      }
    },
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: false
  },
  {
    produit_reference: "LG 55C9",
    numero_de_serie: 19,
    prix: 304.67,
    fournisseur: {
      nom: "Top achat",
      adresse: {
        numero: 2,
        rue: "rue des Erables",
        code_postal: "69570",
        ville: "Limonest"
      }
    },
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: true
  },
  {
    produit_reference: "LG 55C9",
    numero_de_serie: 20,
    prix: 304.67,
    fournisseur: {
      nom: "Top achat",
      adresse: {
        numero: 2,
        rue: "rue des Erables",
        code_postal: "69570",
        ville: "Limonest"
      }
    },
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: true
  },
  {
    produit_reference: "LG 55C9",
    numero_de_serie: 21,
    prix: 304.67,
    fournisseur: {
      nom: "Top achat",
      adresse: {
        numero: 2,
        rue: "rue des Erables",
        code_postal: "69570",
        ville: "Limonest"
      }
    },
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: false
  },
  {
    produit_reference: "Asus Vivobook R509JA-EJ032T",
    numero_de_serie: 22,
    prix: 699.69,
    fournisseur: {
      nom: "Ali Baba",
      adresse: {
        numero: 10,
        rue: "rue des Patates",
        code_postal: "69000",
        ville: "Lyon"
      }
    },
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: true
  },
  {
    produit_reference: "Asus Vivobook R509JA-EJ032T",
    numero_de_serie: 23,
    prix: 799.99,
    fournisseur: {
      nom: "Amazon",
      adresse: {
        numero: 67,
        rue: "boulevard du Général Leclerc",
        code_postal: "92110",
        ville: "Clichy"
      }
    },
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: false
  },
  {
    produit_reference: "Asus Vivobook R509JA-EJ032T",
    numero_de_serie: 24,
    prix: 709.60,
    fournisseur: {
      nom: "Darty",
      adresse: {
        numero: 129,
        rue: "avenue Galliéni",
        code_postal: "93140",
        ville: "Bondy"
      }
    },
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: true
  },
  {
    produit_reference: "Philips 43PFS5503",
    numero_de_serie: 25,
    prix: 304.67,
    fournisseur: {
      nom: "Ali Baba",
      adresse: {
        numero: 10,
        rue: "rue des Patates",
        code_postal: "69000",
        ville: "Lyon"
      }
    },
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: false
  },
  {
    produit_reference: "Philips 43PFS5503",
    numero_de_serie: 26,
    prix: 334.67,
    fournisseur: {
      nom: "Ali Baba",
      adresse: {
        numero: 10,
        rue: "rue des Patates",
        code_postal: "69000",
        ville: "Lyon"
      }
    },
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: false
  },
  {
    produit_reference: "Philips 43PFS5503",
    numero_de_serie: 27,
    prix: 334.67,
    fournisseur: {
      nom: "Amazon",
      adresse: {
        numero: 67,
        rue: "boulevard du Général Leclerc",
        code_postal: "92110",
        ville: "Clichy"
      }
    },
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: false
  },
  {
    produit_reference: "Philips 43PFS5503",
    numero_de_serie: 28,
    prix: 334.67,
    fournisseur: {
      nom: "Amazon",
      adresse: {
        numero: 67,
        rue: "boulevard du Général Leclerc",
        code_postal: "92110",
        ville: "Clichy"
      }
    },
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: false
  },
  {
    produit_reference: "Philips 43PFS5503",
    numero_de_serie: 29,
    prix: 334.67,
    fournisseur: {
      nom: "Ali Baba",
      adresse: {
        numero: 10,
        rue: "rue des Patates",
        code_postal: "69000",
        ville: "Lyon"
      }
    },
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: true
  },
  {
    produit_reference: "Philips 43PFS5503",
    numero_de_serie: 30,
    prix: 334.67,
    fournisseur: {
      nom: "Darty",
      adresse: {
        numero: 129,
        rue: "avenue Galliéni",
        code_postal: "93140",
        ville: "Bondy"
      }
    },
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: false
  },
  {
    produit_reference: "Philips 43PFS5503",
    numero_de_serie: 31,
    prix: 334.67,
    fournisseur: {
      nom: "Darty",
      adresse: {
        numero: 129,
        rue: "avenue Galliéni",
        code_postal: "93140",
        ville: "Bondy"
      }
    },
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: false
  },
  {
    produit_reference: "Philips 43PFS5503",
    numero_de_serie: 32,
    prix: 334.67,
    fournisseur: {
      nom: "Ali Baba",
      adresse: {
        numero: 10,
        rue: "rue des Patates",
        code_postal: "69000",
        ville: "Lyon"
      }
    },
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: false
  },
  {
    produit_reference: "Canon PIXMA TS8251",
    numero_de_serie: 33,
    prix: 109.0,
    fournisseur: {
      nom: "Ali Baba",
      adresse: {
        numero: 10,
        rue: "rue des Patates",
        code_postal: "69000",
        ville: "Lyon"
      }
    },
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: false
  },
  {
    produit_reference: "Canon PIXMA TS8251",
    numero_de_serie: 34,
    prix: 109.0,
    fournisseur: {
      nom: "Ali Baba",
      adresse: {
        numero: 10,
        rue: "rue des Patates",
        code_postal: "69000",
        ville: "Lyon"
      }
    },
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: false
  },
  {
    produit_reference: "Canon PIXMA TS8251",
    numero_de_serie: 35,
    prix: 99.0,
    fournisseur: {
      nom: "Darty",
      adresse: {
        numero: 129,
        rue: "avenue Galliéni",
        code_postal: "93140",
        ville: "Bondy"
      }
    },
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: false
  },
  {
    produit_reference: "Canon PIXMA TS8251",
    numero_de_serie: 36,
    prix: 87.0,
    fournisseur: {
      nom: "Amazon",
      adresse: {
        numero: 67,
        rue: "boulevard du Général Leclerc",
        code_postal: "92110",
        ville: "Clichy"
      }
    },
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: false
  },
  {
    produit_reference: "Canon PIXMA TS8251",
    numero_de_serie: 37,
    prix: 109.0,
    fournisseur: {
      nom: "Ali Baba",
      adresse: {
        numero: 10,
        rue: "rue des Patates",
        code_postal: "69000",
        ville: "Lyon"
      }
    },
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: true
  },
  {
    produit_reference: "Canon PIXMA TS8251",
    numero_de_serie: 38,
    prix: 109.0,
    fournisseur: {
      nom: "Ali Baba",
      adresse: {
        numero: 10,
        rue: "rue des Patates",
        code_postal: "69000",
        ville: "Lyon"
      }
    },
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: false
  },
  {
    produit_reference: "Canon PIXMA TS8251",
    numero_de_serie: 39,
    prix: 109.0,
    fournisseur: {
      nom: "Ali Baba",
      adresse: {
        numero: 10,
        rue: "rue des Patates",
        code_postal: "69000",
        ville: "Lyon"
      }
    },
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: true
  },
  {
    produit_reference: "Canon PIXMA TS8251",
    numero_de_serie: 40,
    prix: 109.0,
    fournisseur: {
      nom: "Ali Baba",
      adresse: {
        numero: 10,
        rue: "rue des Patates",
        code_postal: "69000",
        ville: "Lyon"
      }
    },
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: false
  },
  {
    produit_reference: "Canon PIXMA TS8251",
    numero_de_serie: 41,
    prix: 109.0,
    fournisseur: {
      nom: "Ali Baba",
      adresse: {
        numero: 10,
        rue: "rue des Patates",
        code_postal: "69000",
        ville: "Lyon"
      }
    },
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: false
  },
  {
    produit_reference: "Brandt B5006UHD",
    numero_de_serie: 42,
    prix: 430.20,
    fournisseur: null,
    extension_de_garantie: 50,
    installation_par_specialiste: 10,
    vendu: true
  },
  {
    produit_reference: "Brandt B5006UHD",
    numero_de_serie: 43,
    prix: 430.20,
    fournisseur: null,
    extension_de_garantie: 50,
    installation_par_specialiste: 10,
    vendu: true
  },
  {
    produit_reference: "Brandt B5006UHD",
    numero_de_serie: 44,
    prix: 430.20,
    fournisseur: null,
    extension_de_garantie: 50,
    installation_par_specialiste: 10,
    vendu: false
  },
  {
    produit_reference: "Brandt B5006UHD",
    numero_de_serie: 45,
    prix: 430.20,
    fournisseur: null,
    extension_de_garantie: 50,
    installation_par_specialiste: 10,
    vendu: false
  },
  {
    produit_reference: "Brandt B5006UHD",
    numero_de_serie: 46,
    prix: 430.20,
    fournisseur: null,
    extension_de_garantie: 50,
    installation_par_specialiste: 10,
    vendu: true
  },
  {
    produit_reference: "Brandt B5006UHD",
    numero_de_serie: 47,
    prix: 430.20,
    fournisseur: null,
    extension_de_garantie: 50,
    installation_par_specialiste: 10,
    vendu: false
  },
  {
    produit_reference: "Brandt B5006UHD",
    numero_de_serie: 48,
    prix: 430.20,
    fournisseur: null,
    extension_de_garantie: 50,
    installation_par_specialiste: 10,
    vendu: false
  },
  {
    produit_reference: "LG 55C9",
    numero_de_serie: 49,
    prix: 314.67,
    fournisseur: null,
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: false
  },
  {
    produit_reference: "LG 55C9",
    numero_de_serie: 50,
    prix: 314.67,
    fournisseur: null,
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: false
  },
  {
    produit_reference: "LG 55C9",
    numero_de_serie: 51,
    prix: 314.67,
    fournisseur: null,
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: false
  },
  {
    produit_reference: "Canon PIXMA TS8251",
    numero_de_serie: 52,
    prix: 109.0,
    fournisseur: null,
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: true
  },
  {
    produit_reference: "Canon PIXMA TS8251",
    numero_de_serie: 53,
    prix: 109.0,
    fournisseur: null,
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: false
  },
  {
    produit_reference: "Canon PIXMA TS8251",
    numero_de_serie: 54,
    prix: 109.0,
    fournisseur: null,
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: false
  },
  {
    produit_reference: "Canon PIXMA TS8251",
    numero_de_serie: 55,
    prix: 109.0,
    fournisseur: null,
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: false
  },
  {
    produit_reference: "Canon PIXMA TS8251",
    numero_de_serie: 56,
    prix: 109.0,
    fournisseur: null,
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: false
  },
  {
    produit_reference: "Canon PIXMA TS8251",
    numero_de_serie: 57,
    prix: 109.0,
    fournisseur: null,
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: false
  },
  {
    produit_reference: "Samsung RB31FERNCSA",
    numero_de_serie: 58,
    prix: 594.99,
    fournisseur: null,
    extension_de_garantie: 50,
    installation_par_specialiste: null,
    vendu: false
  },
  {
    produit_reference: "Samsung RB31FERNCSA",
    numero_de_serie: 59,
    prix: 594.99,
    fournisseur: null,
    extension_de_garantie: 50,
    installation_par_specialiste: null,
    vendu: false
  },
  {
    produit_reference: "Samsung RB31FERNCSA",
    numero_de_serie: 60,
    prix: 594.99,
    fournisseur: null,
    extension_de_garantie: 50,
    installation_par_specialiste: null,
    vendu: false
  },
  {
    produit_reference: "Samsung RB31FERNCSA",
    numero_de_serie: 61,
    prix: 594.99,
    fournisseur: null,
    extension_de_garantie: 50,
    installation_par_specialiste: null,
    vendu: false
  },
  {
    produit_reference: "Samsung RB31FERNCSA",
    numero_de_serie: 62,
    prix: 594.99,
    fournisseur: null,
    extension_de_garantie: 50,
    installation_par_specialiste: null,
    vendu: false
  },
  {
    produit_reference: "Samsung RB31FERNCSA",
    numero_de_serie: 63,
    prix: 594.99,
    fournisseur: null,
    extension_de_garantie: 50,
    installation_par_specialiste: null,
    vendu: false
  },
  {
    produit_reference: "Samsung RB31FERNCSA",
    numero_de_serie: 64,
    prix: 594.99,
    fournisseur: null,
    extension_de_garantie: 50,
    installation_par_specialiste: null,
    vendu: true
  },
  {
    produit_reference: "Samsung RB31FERNCSA",
    numero_de_serie: 65,
    prix: 594.99,
    fournisseur: null,
    extension_de_garantie: 50,
    installation_par_specialiste: null,
    vendu: false
  },
  {
    produit_reference: "Thomson TDW 6047 WH",
    numero_de_serie: 66,
    prix: 349.90,
    fournisseur: null,
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: false
  },
  {
    produit_reference: "Thomson TDW 6047 WH",
    numero_de_serie: 67,
    prix: 349.90,
    fournisseur: null,
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: false
  },
  {
    produit_reference: "Thomson TDW 6047 WH",
    numero_de_serie: 68,
    prix: 349.90,
    fournisseur: null,
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: false
  },
  {
    produit_reference: "Thomson TDW 6047 WH",
    numero_de_serie: 69,
    prix: 349.90,
    fournisseur: null,
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: false
  },
  {
    produit_reference: "Acer PH315-52-56SX",
    numero_de_serie: 70,
    prix: 1439.87,
    fournisseur: null,
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: false
  },
  {
    produit_reference: "Acer PH315-52-56SX",
    numero_de_serie: 71,
    prix: 1439.87,
    fournisseur: null,
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: false
  },
  {
    produit_reference: "Acer PH315-52-56SX",
    numero_de_serie: 72,
    prix: 1439.87,
    fournisseur: null,
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: false
  },
  {
    produit_reference: "Acer PH315-52-56SX",
    numero_de_serie: 73,
    prix: 1439.87,
    fournisseur: null,
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: false
  },
  {
    produit_reference: "Acer PH315-52-56SX",
    numero_de_serie: 74,
    prix: 1439.87,
    fournisseur: null,
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: false
  },
  {
    produit_reference: "Acer PH315-52-56SX",
    numero_de_serie: 75,
    prix: 1439.87,
    fournisseur: null,
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: false
  },
  {
    produit_reference: "Acer PH315-52-56SX",
    numero_de_serie: 76,
    prix: 1439.87,
    fournisseur: null,
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: false
  },
  {
    produit_reference: "Asus Vivobook R509JA-EJ032T",
    numero_de_serie: 77,
    prix: 799.99,
    fournisseur: null,
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: false
  },
  {
    produit_reference: "Asus Vivobook R509JA-EJ032T",
    numero_de_serie: 78,
    prix: 799.99,
    fournisseur: null,
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: true
  },
  {
    produit_reference: "Asus Vivobook R509JA-EJ032T",
    numero_de_serie: 79,
    prix: 799.99,
    fournisseur: null,
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: false
  },
  {
    produit_reference: "Asus Vivobook R509JA-EJ032T",
    numero_de_serie: 80,
    prix: 799.99,
    fournisseur: null,
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: false
  },
  {
    produit_reference: "Asus Vivobook R509JA-EJ032T",
    numero_de_serie: 81,
    prix: 799.99,
    fournisseur: null,
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: false
  },
  {
    produit_reference: "Asus Vivobook R509JA-EJ032T",
    numero_de_serie: 82,
    prix: 799.99,
    fournisseur: null,
    extension_de_garantie: null,
    installation_par_specialiste: null,
    vendu: false
  }
]);


db.bondecommande.insert([
  {
    creation: new Date('2020-05-28 04:05:06'),
    traitement: new Date('2020-05-29 16:05:06'),
    produits: [
      {
        reference: "HP 15-DC1066NF",
        quantite: 3
      },
      {
        reference: "Asus Vivobook R509JA-EJ032T",
        quantite: 1
      }
    ],
    created_by: {
      nom: "Lemoine",
      prenom: "Sylvain",
      date_de_naissance: new Date("1978-08-10")
    },
    done_by: {
      nom: "Robert",
      prenom: "Charles",
      date_de_naissance: new Date("1982-10-21")
    }
  },
  {
    creation: new Date('2020-05-24 04:05:06'),
    traitement: new Date('2020-05-27 19:05:06'),
    produits: [
      {
        reference: "HP 15-DC1066NF",
        quantite: 3
      }
    ],
    created_by: {
      nom: "Lemoine",
      prenom: "Sylvain",
      date_de_naissance: new Date("1978-08-10")
    },
    done_by: {
      nom: "Robert",
      prenom: "Charles",
      date_de_naissance: new Date("1982-10-21")
    }
  },
  {
    creation: new Date(),
    traitement: null,
    produits: [
      {
        reference: "Rowenta RO7455EA",
        quantite: 10
      }
    ],
    created_by: {
      nom: "Lemoine",
      prenom: "Sylvain",
      date_de_naissance: new Date("1978-08-10")
    },
    done_by: null
  }
]);


db.remise.insert([
  {
    type: "promotion",
    montant: 10.0,
    date_fin: null,
    remise_nombre_utilisations: null,
    created_by: {
      nom: "Lemoine",
      prenom: "Sylvain",
      date_de_naissance: new Date("1978-08-10")
    },
    personne_concernee: null,
    code: 'JOYEUXNOEL'
  },
  {
    type: "pourcentage",
    montant: 3,
    date_fin: null,
    remise_nombre_utilisations: null,
    created_by: {
      nom: "Lemoine",
      prenom: "Sylvain",
      date_de_naissance: new Date("1978-08-10")
    },
    personne_concernee: null,
    code: 'PROMO2020'
  },
  {
    type: "avoir",
    montant: 430.20,
    date_fin: null,
    remise_nombre_utilisations: 1,
    created_by: {
      nom: "Leclercq",
      prenom: "Vivien",
      date_de_naissance: new Date("1999-12-14")
    },
    personne_concernee: null,
    code: 'AKFRGBERGFNERFN'
  },
  {
    type: "garantie",
    montant: 299.99,
    date_fin: null,
    remise_nombre_utilisations: 0,
    created_by: {
      nom: "Leclercq",
      prenom: "Vivien",
      date_de_naissance: new Date("1999-12-14")
    },
    personne_concernee: null,
    code: 'TJTTEGFTJRTZCGUEE'
  }
]);

db.ticketsav.insert([
  {
    produit:{
      reference: 'Brandt B5006UHD',
      numero_de_serie: 43
    },
    client:{
      nom: "Leclercq",
      prenom: "Vivien",
      date_de_naissance: new Date("1999-12-14")
    },
    statut: "done",
    issue: 'remise',

    reparations: null,

    done_by: {
      nom: "Leclercq",
      prenom: "Vivien",
      date_de_naissance: new Date("1999-12-14")
    }
  },
  {
    produit:{
      reference: 'Samsung RB31FERNCSA',
      numero_de_serie: 64
    },
    client:{
      nom: "Lebrun",
      prenom: "Martine",
      date_de_naissance: new Date("1978-08-10")
    },
    statut: "done",
    issue: 'retour',

    reparations: null,

    done_by: {
      nom: "Leclercq",
      prenom: "Vivien",
      date_de_naissance: new Date("1999-12-14")
    }
  },
  {
    produit:{
      reference: 'Asus Vivobook R509JA-EJ032T',
      numero_de_serie: 78
    },
    client:{
      nom: "Leclercq",
      prenom: "Vivien",
      date_de_naissance: new Date("1999-12-14")
    },
    statut: "done",
    issue: 'reparation',

    reparations: [
      {
        numero_reparation: 1,
        date_entree: new Date('2020-05-28 04:05:06'),
        date_sortie: new Date('2020-05-29 16:05:06'),
        materiel_utilise: "Ciseaux",
        montant: 299.99
      }
    ],

    done_by: {
      nom: "Leclercq",
      prenom: "Vivien",
      date_de_naissance: new Date("1999-12-14")
    }
  },
  {
    produit:{
      reference: 'Brandt B5006UHD',
      numero_de_serie: 42
    },
    client:{
      nom: "Robert",
      prenom: "Charles",
      date_de_naissance: new Date("1982-10-21")
    },
    statut: "done",
    issue: 'reparation',

    reparations: [
      {
        numero_reparation: 2,
        date_entree: new Date('2020-05-28 04:05:06'),
        date_sortie: null,
        materiel_utilise: "Pâte à fixe",
        montant: 199.99
      }
    ],

    done_by: {
      nom: "Leclercq",
      prenom: "Vivien",
      date_de_naissance: new Date("1999-12-14")
    }
  },
  {
    produit:{
      reference: 'Brandt B5006UHD',
      numero_de_serie: 46
    },
    client:{
      nom: "Lebrun",
      prenom: "Martine",
      date_de_naissance: new Date("1982-10-21")
    },
    statut: "in progress",
    issue: null,

    reparations: null,

    done_by: null
  }
]);

print("done.");
print();

print("La base de données est prête à être utilisée.");
print();

//AFFICHAGE DES DONNEES
//afin de rendre le contenu plus lisible on évite d'utiliser printjson()

print("Affichage  des données :");
print();
print("Membre de l'entreprise");

membreEntreprise = db.personne.find({"membre_entreprise": true});

var i = 1;
while(membreEntreprise.hasNext()){

  var membre_entreprise = membreEntreprise.next();
  print(i + " nom=" + membre_entreprise.nom + " prenom=" + membre_entreprise.prenom + " date_de_naissance=" + membre_entreprise.date_de_naissance + " email=" + membre_entreprise.email);

  i++;
}

print();
print("Membre Service Achat");

membreServiceAchat = db.personne.find(  {$and: [{"membre_entreprise" : { $exists: true, $ne: null }}, {"service": "achat"}] }  );
i = 1;
while(membreServiceAchat.hasNext()){

  var membre_service_achat = membreServiceAchat.next();
  print(i + " nom=" + membre_service_achat.nom + " prenom=" + membre_service_achat.prenom + " date_de_naissance=" + membre_service_achat.date_de_naissance + " email=" + membre_service_achat.email);

  i++;
}

print();
print("Membre Service Vente");

membreServiceVente = db.personne.find(  {$and: [{"membre_entreprise" : { $exists: true, $ne: null }}, {"service": "vente"}] }  );
i = 1;
while(membreServiceVente.hasNext()){

  var membre_service_vente = membreServiceVente.next();
  print(i + " nom=" + membre_service_vente.nom + " prenom=" + membre_service_vente.prenom + " date_de_naissance=" + membre_service_vente.date_de_naissance + " email=" + membre_service_vente.email);

  i++;
}

print();
print("Membre SAV");

membreSAV = db.personne.find(  {$and: [{"membre_entreprise" : { $exists: true, $ne: null }}, {"service": "SAV"}] }  );
i = 1;
while(membreSAV.hasNext()){

  var membre_sav = membreSAV.next();
  print(i + " nom=" + membre_sav.nom + " prenom=" + membre_sav.prenom + " date_de_naissance=" + membre_sav.date_de_naissance + " email=" + membre_sav.email);

  i++;
}



//pour les vues il faudrait utiliser la fonction aggregate();

print();

print('Fin du programme');

print('');
