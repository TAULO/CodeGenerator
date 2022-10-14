let express = require("express");
let router = express.Router();
let auth = require("../Middleware/Auth");
let User = require("../Models/User");
let Armes = require("../Models/Armes");
let puppeteer = require("puppeteer");
let handlebars = require("handlebars");
let multer = require("multer");
let Munition = require("../Models/Munitions");
let Ceder = require("../Models/Ceder");
let Facture = require("../Models/Factures");
let fs = require("fs");
let path = require("path");
let admin = require("../Routes/FirebaseConfig.js");
let transporter = require("./Nodemailer.js");

let storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./autorisation/");
  },
  filename: function (req, file, callback) {
    callback(null, `${new Date().getTime()}${file.originalname}`);
  },
});

let upload = multer({ storage: storage });

require("dotenv").config();

let compile = async (templateName, data) => {
  let filePath = path.join(process.cwd(), "/PDF", `${templateName}.hbs`);
  let html = fs.readFileSync(filePath, "utf-8", (err, succes) => {
    if (err) {
      throw err;
    }
  });
  return handlebars.compile(html)(data);
};

router.get("/armes", auth, async (req, res) => {
  try {
    let armes = await User.findById(req.user.id)
      .populate("armes")
      .select("-motdepasse -mdpsecret");
    res.json(armes);
  } catch (err) {
    res.status(500).send("SERVOR ERROR");
  }
});

router.post("/armes", auth, async (req, res) => {
  let { modele, calibre, serie, dateAchat, armurier, marques, type } = req.body;

  try {
    let d = {};
    d.user = req.user.id;
    d.modele = modele;
    d.calibre = calibre;
    d.serie = serie;
    d.dateAchat = dateAchat;
    d.armurier = armurier;
    d.marques = marques;
    d.dateCreation = Date.now();
    d.type = type;

    let user = await User.findById(req.user.id);

    let c = user.marque.filter((x) => x === marques);

    let ff = user.type.filter((x) => x === d.type);

    if (c.length >= 1) {
    } else {
      user.marque.unshift(d.marques);
    }

    if (ff.length >= 1) {
    } else {
      user.type.unshift(d.type);
    }

    let z = new Date(dateAchat).getTime();

    let f = z + 7889400000;

    let exp = new Date(f).getTime();

    d.expiration = exp;

    let ext = z + 63072000000;

    let garant = new Date(ext).getTime();

    d.garantie = garant;

    d.extension = 0;

    d.garantieActuelle = new Date(Number(garant)).getTime();

    d.cedee = false;

    let NumberExpp = Number(d.expiration) + Number(d.extension * 7889400000);

    d.limitDate = NumberExpp;

    let arme = new Armes(d);

    let data = 1630495659066;

    let dataa = {};

    dataa.name = user.nom;

    dataa.prenom = user.prenom;

    dataa.email = user.email;

    dataa.SIA = user.SIA;

    dataa.telephone = user.telephone;

    dataa.adresse = user.adresse;

    dataa.codepostal = user.codepostal;

    dataa.ville = user.ville;

    dataa.identifiant = user.identifiant;

    let da = arme.garantie;

    let ffd = arme.extension * 7889400000;

    let dateGaranti = Number(da) + Number(ffd);

    let dateGarantie = new Date(dateGaranti).toDateString();

    let m = new Date(dateGarantie).getMonth();

    let fff = m + 1;

    if (fff < 10) {
      fff = "0" + fff;
    }

    let j = new Date(dateGarantie).getDate();

    if (j < 10) {
      j = "0" + j;
    }

    let an = new Date(dateGarantie).getFullYear();

    let date = `${j}/${fff}/${an}`;

    let dateB = date.toString();

    dataa.garantie = dateB;

    dataa.extGarantie = new Date(Number(arme.garantie)).toLocaleDateString();

    dataa.munitions = arme.quantite;

    dataa.serie = arme.serie;

    dataa.calibre = arme.calibre;

    dataa.categories = arme.modele;

    dataa.marque = arme.marques === "SMITHWESSON" ? "SMITH & WESSON" : "CZ";

    dataa.type = arme.type;

    dataa.armurier = arme.armurier;

    dataa.dateAchat = arme.dateAchat;

    dataa.cumul = arme.extension;

    dataa.date = new Date().toLocaleDateString("fr-FR");

    let browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"],
    });

    let page = await browser.newPage();

    let content = await compile("template", dataa);

    let dd = new Date(Date.now()).getTime();

    await page.setContent(content);

    await page.emulateMediaType("screen");

    await page.pdf({
      format: "A4",
      path: path.join(process.cwd() + "/PDF", `${dd}${user._id}.pdf`),
      printBackground: true,
    });

    await browser.close();

    let fac = {};

    fac.user = req.user.id;

    fac.armes = req.body.arme;
    fac.serie = arme.serie;
    fac.modele = arme.modele;
    fac.marques = arme.marques;
    fac.type = arme.type;
    fac.nombre = 0;
    fac.munitions = 0;
    fac.valider = true;
    fac.armes = arme._id;
    fac.dateCreation = Date.now();

    console.log(fac);

    fac.fileName = `${dd}${user._id}`;

    fac.file = `/PDF/${dd}${user._id}.pdf`;

    fac.dateCreation = new Date(Date.now()).getTime();

    let factu = new Facture(fac);

    user.factures.unshift(factu);

    user.armes.unshift(arme._id);

    if (Number(f) < Number(data)) {
      if (user.autorisation) {
        await transporter
          .sendMail({
            from: `Extension Garantie <${process.env.EMAIL_ADMIN}>`,
            to: user.email,
            attachments: [
              {
                contentType: "application/pdf",
                filename: `${user.prenom}EXTENSIONGARANTIE.pdf`,
                path: `${process.env.API_URL}${fac.file}`,
              },
            ],
            subject: "CERTIFICAT DE GARANTIE DE VOTRE ARME",
            html: `<div>
        <p>Bonjour ${user.prenom} ${user.nom}, <br></br>
        <ul>
            <li>Suite à l'ajout de votre arme, nous avons le plaisir de vous
            transmettre ci-joint votre certificat de garantie pour l'arme :</li>
            <ul>
                <li>${arme.marques}</li>
                <li> ${arme.modele}</li>
                <li> ${arme.calibre}</li>
                <li> ${arme.type}</li>
                <li> ${arme.serie}</li>
            </ul>
        </ul>
     
        <br> <p>Cordialement, </p> </br>
        <div>
        <img style="margin-top:10px;" width="80%" 
        src="https://sidam.suncha.fr/api/PDF/signature.jpg" />

        <p> <span style="color: blue;font-size: x-small;">Ce message électronique et tous les fichiers attachés qu'il
                contient sont
                confidentiels et
                destinés
                exclusivement à l'usage de la personne à laquelle ils sont adressés. Si vous avez reçu ce message
                par
                erreur, merci de le retourner à son émetteur. Les idées et opinions présentées dans ce message sont
                celles de son auteur, et ne représentent pas nécessairement celles de la société SIDAM ou d'une
                quelconque de ses filiales</span>.<span style="color: red;font-weight: bold;font-size: x-small;"> La
                publication,
                l'usage, la
                distribution, l'impression ou la
                copie non
                autorisée de ce message et des attachements qu'il contient sont strictement interdits.</span><br>
            <span style="color: blue;font-size: x-small;">

                This e-mail and any files transmitted with it are confidential and intended solely for the use of
                the
                individual to whom it is addressed.If you have received this email in error please send it back to
                the
                person that sent it to you. Any views or opinions presented are solely those of its author and do
                not
                necessarily represent those of SIDAM Company or any of its subsidiary companies.</span> <span
                style="color: red;font-weight: bold;font-size: x-small;"> Unauthorized
                publication, use, dissemination, forwarding, printing or copying of this email and its associated
                attachments is strictly prohibited.</span>
        </p>
        </div>
    </div>`,
          })
          .then(async () => {
            await transporter.sendMail({
              from: `Extension Garantie <${process.env.EMAIL_ADMIN}>`,
              to: user.email,
              subject: "EXPIRATION DE VOTRE ARME",
              html: `<div>
            <p>Bonjour ${user.prenom} ${user.nom}, <br></br>
            <ul>
                <li>La date d’enregistrement de munitions SELLIER & BELLOT ou MAGTECH étant dépassée, il n’est plus possible de cumuler des mois d’extension de garantie supplémentaire. Les mois d’extension cumulés restent acquis et associés à l’arme.</li>
                <ul>
                    <li>${arme.marques}</li>
                    <li>${arme.modele}</li>
                    <li>${arme.calibre}</li>
                    <li>${arme.type}</li>
                    <li>${arme.serie}</li>
                </ul>
            </ul>
            <br> <p>Cordialement, </p> </br>
            <div>
            <img style="margin-top:10px;" width="80%" 
            src="https://sidam.suncha.fr/api/PDF/signature.jpg" />
    
            <p> <span style="color: blue;font-size: x-small;">Ce message électronique et tous les fichiers attachés qu'il
                    contient sont
                    confidentiels et
                    destinés
                    exclusivement à l'usage de la personne à laquelle ils sont adressés. Si vous avez reçu ce message
                    par
                    erreur, merci de le retourner à son émetteur. Les idées et opinions présentées dans ce message sont
                    celles de son auteur, et ne représentent pas nécessairement celles de la société SIDAM ou d'une
                    quelconque de ses filiales</span>.<span style="color: red;font-weight: bold;font-size: x-small;"> La
                    publication,
                    l'usage, la
                    distribution, l'impression ou la
                    copie non
                    autorisée de ce message et des attachements qu'il contient sont strictement interdits.</span><br>
                <span style="color: blue;font-size: x-small;">
    
                    This e-mail and any files transmitted with it are confidential and intended solely for the use of
                    the
                    individual to whom it is addressed.If you have received this email in error please send it back to
                    the
                    person that sent it to you. Any views or opinions presented are solely those of its author and do
                    not
                    necessarily represent those of SIDAM Company or any of its subsidiary companies.</span> <span
                    style="color: red;font-weight: bold;font-size: x-small;"> Unauthorized
                    publication, use, dissemination, forwarding, printing or copying of this email and its associated
                    attachments is strictly prohibited.</span>
            </p>
            </div>
        </div>`,
            });
          });
        await arme.save();
        await user.save();
        await factu.save();
        res.json(arme);
      } else {
        await arme.save();
        await user.save();
        await factu.save();
        res.json(arme);
      }
    } else {
      if (user.autorisation) {
        setTimeout(async () => {
          await transporter.sendMail({
            from: `Extension Garantie <${process.env.EMAIL_ADMIN}>`,
            to: user.email,
            subject:
              "ENREGISTREZ VOS NOUVELLES MUNITIONS POUR BENEFICIEZ DE 3 MOIS D’EXTENSION DE GARANTIE SUPPLEMENTAIRE",
            html: `<div>
          <p>Bonjour ${user.prenom} ${user.nom}, <br></br>
          <ul>
              <li>Votre coffre-fort virtuel contient l’arme suivante :</li>
              <ul>
                  <li>${d.marques}</li>
                  <li> ${d.modele}</li>
                  <li> ${d.calibre}</li>
                  <li> ${d.serie}</li>
              </ul>
          </ul>
         Votre arme est garantie jusqu’au ${new Date(
           d.garantie
         ).toLocaleDateString()}. Bénéficiez d’une extension de garantie de 3 mois supplémentaires en enregistrant
          l’achat de 500 munitions SELLIER & BELLOT et/ou MAGTECH avant le ${dateExp}.</br></br>
          N'oubliez pas qu’en acquérant 500 munitions tous les 3 mois, vous bénéficieriez d’autant d’extension de
          garantie de 3 mois supplémentaire !<br>
  </div>
  <br><p>Cordialement, </p> </br>
        <div>

        <img style="margin-top:10px;" width="80%" 
        src="https://sidam.suncha.fr/api/PDF/signature.jpg" />

        <p> <span style="color: blue;font-size: x-small;">Ce message électronique et tous les fichiers attachés qu'il
                contient sont
                confidentiels et
                destinés
                exclusivement à l'usage de la personne à laquelle ils sont adressés. Si vous avez reçu ce message
                par
                erreur, merci de le retourner à son émetteur. Les idées et opinions présentées dans ce message sont
                celles de son auteur, et ne représentent pas nécessairement celles de la société SIDAM ou d'une
                quelconque de ses filiales</span>.<span style="color: red;font-weight: bold;font-size: x-small;"> La
                publication,
                l'usage, la
                distribution, l'impression ou la
                copie non
                autorisée de ce message et des attachements qu'il contient sont strictement interdits.</span><br>
            <span style="color: blue;font-size: x-small;">

                This e-mail and any files transmitted with it are confidential and intended solely for the use of
                the
                individual to whom it is addressed.If you have received this email in error please send it back to
                the
                person that sent it to you. Any views or opinions presented are solely those of its author and do
                not
                necessarily represent those of SIDAM Company or any of its subsidiary companies.</span> <span
                style="color: red;font-weight: bold;font-size: x-small;"> Unauthorized
                publication, use, dissemination, forwarding, printing or copying of this email and its associated
                attachments is strictly prohibited.</span>
        </p>
        </div>
    </div>`,
          });
        }, 86400000);

        await transporter.sendMail({
          from: `Extension Garantie <${process.env.EMAIL_ADMIN}>`,
          to: user.email,
          attachments: [
            {
              contentType: "application/pdf",
              filename: `${user.prenom}EXTENSIONGARANTIE.pdf`,
              path: `${process.env.API_URL}${fac.file}`,
            },
          ],
          subject: "CERTIFICAT DE GARANTIE DE VOTRE ARME",
          html: `<div>
        <p>Bonjour ${user.prenom} ${user.nom}, <br></br>
        <ul>
            <li>Suite à l'ajout de votre arme, nous avons le plaisir de vous
            transmettre ci-joint votre certificat de garantie pour l'arme :</li>
            <ul>
                <li>${arme.marques}</li>
                <li> ${arme.modele}</li>
                <li> ${arme.calibre}</li>
                <li> ${arme.type}</li>
                <li> ${arme.serie}</li>
            </ul>
        </ul>
    
    </div>
    
    <br>
    <p>Cordialement, </p></br>
    <div>

      <img style="margin-top:10px;" width="80%" 
        src="https://sidam.suncha.fr/api/PDF/signature.jpg" />

    <p> <span style="color: blue;font-size: x-small;">Ce message électronique et tous les fichiers attachés qu'il
            contient sont
            confidentiels et
            destinés
            exclusivement à l'usage de la personne à laquelle ils sont adressés. Si vous avez reçu ce message
            par
            erreur, merci de le retourner à son émetteur. Les idées et opinions présentées dans ce message sont
            celles de son auteur, et ne représentent pas nécessairement celles de la société SIDAM ou d'une
            quelconque de ses filiales</span>.<span style="color: red;font-weight: bold;font-size: x-small;"> La
            publication,
            l'usage, la
            distribution, l'impression ou la
            copie non
            autorisée de ce message et des attachements qu'il contient sont strictement interdits.</span><br>
        <span style="color: blue;font-size: x-small;">

            This e-mail and any files transmitted with it are confidential and intended solely for the use of
            the
            individual to whom it is addressed.If you have received this email in error please send it back to
            the
            person that sent it to you. Any views or opinions presented are solely those of its author and do
            not
            necessarily represent those of SIDAM Company or any of its subsidiary companies.</span> <span
            style="color: red;font-weight: bold;font-size: x-small;"> Unauthorized
            publication, use, dissemination, forwarding, printing or copying of this email and its associated
            attachments is strictly prohibited.</span>
    </p>
    </div>
</div>`,
        });

        setTimeout(async () => {
          let message = {
            notification: {
              title: `VOTRE NOUVELLE ARME`,
              body: `Enregistrez vos munitions pour obtenir des mois de garantie supplémentaire`,
              image:
                arme.marques === "CZ"
                  ? `${process.env.API_URL}/notification/CZ.png`
                  : `${process.env.API_URL}/notification/sw.png`,
              icon:
                arme.marques === "CZ"
                  ? `${process.env.API_URL}/notification/CZ.png`
                  : `${process.env.API_URL}/notification/sw.png`,
            },
          };
          await admin.messaging().sendToDevice(user.deviceToken, message);
        }, 172800000);

        await arme.save();
        await user.save();
        await factu.save();
        res.json(arme);
      } else {
        await arme.save();
        await user.save();
        await factu.save();
        res.json(arme);
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("SERVOR ERROR");
  }
});

router.post("/armes/:id", upload.any("autorisation"), async (req, res) => {
  try {
    let armes = await Armes.findById(req.params.id);
    armes.autorisation = req.files[0].path;
    await armes.save();
    res.json(armes);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("SERVEUR ERROR");
  }
});

router.post("/munitionb/:id", upload.any("autorisation"), async (req, res) => {
  try {
    let munition = await Munition.findById(req.params.id);
    munition.preuveachat = req.files[0].path;
    await munition.save();
    res.json(munition);
  } catch (err) {
    console.log(err);
    res.status(500).send("SERVOR ERROR");
  }
});

router.post("/munition/:id", auth, async (req, res) => {
  let { nombre, dateachat, marque, numerolot } = req.body;
  try {
    let DateLimit = new Date(1620204629797 + 31536000000).getTime();

    let dateNox = Date.now();

    let percentage = (Number(nombre) / 500) * 100;

    let arme = await Armes.findById(req.params.id);

    let user = await User.findById(req.user.id);

    let NumberExp =
      Number(arme.expiration) + Number(arme.extension) * Number(7889400000);

    let dadaB = new Date(NumberExp).getTime();

    let dada = new Date().getTime();

    arme.quantite = Number(arme.quantite) + Number(nombre);

    if (dateNox <= DateLimit) {
      if (arme.quantite > 2000) {
        res.json({ msg: "MUNIONLIMIT" });
      } else {
        if (Number(dadaB) < Number(dada)) {
          if (user.autorisation) {
            await transporter.sendMail({
              from: `Extension Garantie <${process.env.EMAIL_ADMIN}>`,
              to: user.email,
              subject: "EXPIRATION DE VOTRE ARME",
              html: `<div>
            <p>Bonjour ${user.prenom} ${user.nom}, <br></br>
            <ul>
                <li>La date d’enregistrement de munitions SELLIER & BELLOT ou MAGTECH étant dépassée, il n’est plus possible de cumuler des mois d’extension de garantie supplémentaire. Les mois d’extension cumulés restent acquis et associés à l’arme.</li>
                <ul>
                    <li>${arme.marques}</li>
                    <li> ${arme.modele}</li>
                    <li> ${arme.calibre}</li>
                    <li> ${arme.type}</li>
                    <li> ${arme.serie}</li>
                </ul>
            </ul>

    </div>
    

    <br> <p>Cordialement, </p> </br>
    <div>

      <img style="margin-top:10px;" width="80%" 
        src="https://sidam.suncha.fr/api/PDF/signature.jpg" />

        <p> <span style="color: blue;font-size: x-small;">Ce message électronique et tous les fichiers attachés qu'il
                contient sont
                confidentiels et
                destinés
                exclusivement à l'usage de la personne à laquelle ils sont adressés. Si vous avez reçu ce message
                par
                erreur, merci de le retourner à son émetteur. Les idées et opinions présentées dans ce message sont
                celles de son auteur, et ne représentent pas nécessairement celles de la société SIDAM ou d'une
                quelconque de ses filiales</span>.<span style="color: red;font-weight: bold;font-size: x-small;"> La
                publication,
                l'usage, la
                distribution, l'impression ou la
                copie non
                autorisée de ce message et des attachements qu'il contient sont strictement interdits.</span><br>
            <span style="color: blue;font-size: x-small;">

                This e-mail and any files transmitted with it are confidential and intended solely for the use of
                the
                individual to whom it is addressed.If you have received this email in error please send it back to
                the
                person that sent it to you. Any views or opinions presented are solely those of its author and do
                not
                necessarily represent those of SIDAM Company or any of its subsidiary companies.</span> <span
                style="color: red;font-weight: bold;font-size: x-small;"> Unauthorized
                publication, use, dissemination, forwarding, printing or copying of this email and its associated
                attachments is strictly prohibited.</span>
        </p>
    </div>
</div>`,
            });

            let message = {
              notification: {
                title: `EXPIRATION DE VOTRE ARME`,
                body: `Arme ${arme.marques} ${arme.modele} est arrivée à expiration`,
                image:
                  arme.marques === "CZ"
                    ? `${process.env.API_URL}/notification/CZ.png`
                    : `${process.env.API_URL}/notification/sw.png`,
                icon:
                  arme.marques === "CZ"
                    ? `${process.env.API_URL}/notification/CZ.png`
                    : `${process.env.API_URL}/notification/sw.png`,
              },
            };

            await admin.messaging().sendToDevice(user.deviceToken, message);
            res.status(500).send("ARMEEXPIRÉ");
          }

          res.status(500).send("ARMEEXPIRÉ");
        }

        let d = {};

        d.user = req.user.id;
        d.armes = arme._id;
        d.nombre = nombre;
        d.dateachat = dateachat;
        d.marque = marque;
        d.numerodelot = numerolot;

        d.dateCreation = Date.now();

        let mun = new Munition(d);

        let munition = await Munition.find({ armes: arme._id });

        let ffff = [];

        munition.map((items, index) => {
          ffff.push(items._id);
        });

        arme.pourcentage = Number(arme.pourcentage) + Number(percentage);

        if (arme.pourcentage >= 100) {
          let df = await Facture.findOne({ armes: arme._id });
          let index = user.factures.findIndex((x) => x === df._id);

          user.factures.splice(index, 1);

          await Facture.findOneAndDelete({ armes: arme._id });

          arme.limitEmail = false;

          arme.extension = arme.extension + 1;

          arme.isDivisible = true;

          if (arme.pourcentage === 100) {
            arme.pourcentage = 0;
          }

          if (arme.pourcentage === 200) {
            arme.pourcentage = 0;
            arme.extension = arme.extension + 1;
          }

          if (arme.pourcentage > 100 && arme.pourcentage <= 200) {
            arme.pourcentage = arme.pourcentage - 100;
          }

          if (arme.pourcentage > 200 && arme.pourcentage < 300) {
            arme.pourcentage = arme.pourcentage - 200;
            arme.extension = arme.extension + 1;
          }

          if (arme.pourcentage > 300 && arme.pourcentage <= 400) {
            arme.pourcentage = arme.pourcentage - 300;
            arme.extension = arme.extension + 2;
          }

          if (arme.pourcentage > 400 && arme.pourcentage <= 500) {
            arme.pourcentage = arme.pourcentage - 400;
            arme.extension = arme.extension + 3;
          }

          if (arme.pourcentage > 500 && arme.pourcentage <= 600) {
            arme.pourcentage = arme.pourcentage - 500;
            arme.extension = arme.extension + 4;
          }

          if (percentage > 600) {
            let d = percentage / 100;
            arme.extension = arme.extension + Math.floor(d) - 1;
            arme.pourcentage = (arme.pourcentage - 100 * Math.floor(d)).toFixed(
              1
            );
          }

          let data = {};

          data.name = user.nom;

          data.prenom = user.prenom;

          data.email = user.email;

          data.SIA = user.SIA;

          data.telephone = user.telephone;

          data.adresse = user.adresse;

          data.codepostal = user.codepostal;

          data.ville = user.ville;

          data.identifiant = user.identifiant;

          let d = arme.garantie;

          let f = arme.extension * 7889400000;

          let dateGaranti = Number(d) + Number(f);

          let dateGarantie = new Date(dateGaranti).toDateString();

          let m = new Date(dateGarantie).getMonth();

          let ff = m + 1;

          if (ff < 10) {
            ff = "0" + ff;
          }

          let j = new Date(dateGarantie).getDate();

          if (j < 10) {
            j = "0" + j;
          }

          let an = new Date(dateGarantie).getFullYear();

          let date = `${j}/${ff}/${an}`;

          let dateB = date.toString();

          data.garantie = dateB;

          data.extGarantie = new Date(
            Number(arme.garantie)
          ).toLocaleDateString();

          data.munitions = arme.quantite;

          data.serie = arme.serie;

          data.calibre = arme.calibre;

          data.categories = arme.modele;

          data.marque =
            arme.marques === "SMITHWESSON" ? "SMITH & WESSON" : "CZ";

          data.type = arme.type;

          data.armurier = arme.armurier;

          data.dateAchat = arme.dateAchat;

          data.cumul = arme.extension;

          data.date = dateB;

          let browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox"],
          });

          let page = await browser.newPage();

          let content = await compile("template", data);

          let dd = new Date(Date.now()).getTime();

          await page.setContent(content);

          await page.emulateMediaType("screen");

          await page.pdf({
            format: "A4",
            path: path.join(process.cwd() + "/PDF", `${dd}${user._id}.pdf`),
            printBackground: true,
          });

          await browser.close();

          let fac = {};

          fac.user = req.user.id;
          fac.munitionsType = ffff;

          fac.armes = req.body.arme;
          fac.serie = arme.serie;
          fac.modele = arme.modele;
          fac.marques = arme.marques;
          fac.type = arme.type;
          fac.nombre = arme.quantite;
          fac.munitions = nombre;
          fac.valider = true;
          fac.armes = arme._id;
          fac.dateCreation = Date.now();

          fac.fileName = `${dd}${user._id}`;

          fac.file = `/PDF/${dd}${user._id}.pdf`;

          fac.dateCreation = new Date(Date.now()).getTime();

          if (user.autorisation) {
            await transporter.sendMail({
              from: `Extension Garantie <${process.env.EMAIL_ADMIN}>`,
              to: user.email,
              attachments: [
                {
                  contentType: "application/pdf",
                  filename: `${user.prenom}EXTENSIONGARANTIE.pdf`,
                  path: `${process.env.API_URL}${fac.file}`,
                },
              ],
              subject: "GARANTIE PROLONGEE ! 3 MOIS SUPPLEMENTAIRES OBTENUS",
              html: `<div>
            <p>Bonjour ${user.prenom} ${user.nom}, <br></br>
            <ul>
                <li>Suite à vos achats de munitions, nous avons le plaisir de vous
                annoncer que la durée de garantie de l’arme ci-dessous est prolongée de 3 mois.</li>
                <ul>
                    <li>${arme.marques}</li>
                    <li> ${arme.modele}</li>
                    <li> ${arme.calibre}</li>
                    <li> ${arme.type}</li>
                    <li> ${arme.serie}</li>
                </ul>
            </ul>
         
            <br> <p>Cordialement, </p> </br>
            <div>
            <img style="margin-top:10px;" width="80%" 
        src="https://sidam.suncha.fr/api/PDF/signature.jpg" />

            <p> <span style="color: blue;font-size: x-small;">Ce message électronique et tous les fichiers attachés qu'il
                    contient sont
                    confidentiels et
                    destinés
                    exclusivement à l'usage de la personne à laquelle ils sont adressés. Si vous avez reçu ce message
                    par
                    erreur, merci de le retourner à son émetteur. Les idées et opinions présentées dans ce message sont
                    celles de son auteur, et ne représentent pas nécessairement celles de la société SIDAM ou d'une
                    quelconque de ses filiales</span>.<span style="color: red;font-weight: bold;font-size: x-small;"> La
                    publication,
                    l'usage, la
                    distribution, l'impression ou la
                    copie non
                    autorisée de ce message et des attachements qu'il contient sont strictement interdits.</span><br>
                <span style="color: blue;font-size: x-small;">
    
                    This e-mail and any files transmitted with it are confidential and intended solely for the use of
                    the
                    individual to whom it is addressed.If you have received this email in error please send it back to
                    the
                    person that sent it to you. Any views or opinions presented are solely those of its author and do
                    not
                    necessarily represent those of SIDAM Company or any of its subsidiary companies.</span> <span
                    style="color: red;font-weight: bold;font-size: x-small;"> Unauthorized
                    publication, use, dissemination, forwarding, printing or copying of this email and its associated
                    attachments is strictly prohibited.</span>
            </p>
            </div>
        </div>`,
            });
          }

          arme.garantieActuelle = new Date(
            Number(arme.garantie) + Number(arme.extension) * Number(7889400000)
          ).getTime();

          arme.munitions.unshift(mun);

          let NumberExpp =
            Number(arme.expiration) + Number(arme.extension * 7889400000);

          arme.limitDate = NumberExpp;

          let facture = new Facture(fac);

          user.factures.unshift(facture);

          if (user.autorisation) {
            let message = {
              notification: {
                title: `Garantie supplémentaire`,
                body: `Vous venez d’obtenir 3 mois de garantie supplémentaire`,
                image:
                  arme.marques === "CZ"
                    ? `${process.env.API_URL}/notification/CZ.png`
                    : `${process.env.API_URL}/notification/sw.png`,
                icon:
                  arme.marques === "CZ"
                    ? `${process.env.API_URL}/notification/CZ.png`
                    : `${process.env.API_URL}/notification/sw.png`,
              },
            };

            await admin.messaging().sendToDevice(user.deviceToken, message);
          }

          await facture.save();

          await user.save();

          await arme.save();

          await mun.save();

          res.json(mun);
        } else {
          arme.limitEmail = true;
          arme.isDivisible = false;

          if (arme.pourcentage < 0) {
            arme.pourcentage = Math.abs(arme.pourcentage);
          }

          if (arme.pourcentage === 100) {
            arme.pourcentage = 0;
          }

          arme.pourcentage = arme.pourcentage;

          let pourcentageM = 500 * (arme.pourcentage / 100);

          let ann = 500 - pourcentageM;

          let c = ann.toFixed(0);

          if (user.autorisation) {
            if (arme.pourcentage > 55) {
              setTimeout(async () => {
                let message = {
                  notification: {
                    title: `ENREGISTRER VOS MUNITIONS`,
                    body: `Plus que ${c} munitions pour votre obtenir 3 mois de garantie supplémentaire.`,
                    image:
                      arme.marques === "CZ"
                        ? `${process.env.API_URL}/notification/CZ.png`
                        : `${process.env.API_URL}/notification/sw.png`,
                    icon:
                      arme.marques === "CZ"
                        ? `${process.env.API_URL}/notification/CZ.png`
                        : `${process.env.API_URL}/notification/sw.png`,
                  },
                };
                await admin.messaging().sendToDevice(user.deviceToken, message);
              }, 172800000);
            }
          }

          arme.munitions.unshift(mun);

          let NumberExpp =
            Number(arme.expiration) + Number(arme.extension * 7889400000);

          arme.limitDate = NumberExpp;

          await user.save();
          await arme.save();
          await mun.save();

          res.json(mun);
        }
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("SERVOR ERROR");
  }
});

router.delete("/munition/:id", auth, async (req, res) => {
  try {
    let arme = await Armes.findById(req.body.id);
    let munition = await Munition.findById(req.params.id);

    let d = arme.munitions.findIndex((x) => (x = munition._id));

    arme.munitions.splice(d, 1);

    arme.quantite = arme.quantite - munition.nombre;

    let percentageMunition = (Number(munition.nombre) / 500) * 100;

    let percentage = arme.pourcentage;

    let newP = percentage - percentageMunition;

    if (newP < 0 && newP >= -100) {
      arme.extension = arme.extension - 1;
      arme.pourcentage = 100 - Math.abs(newP);
    }

    if (newP === 0) {
      arme.pourcentage = 0;
    }

    if (
      percentageMunition === 180 &&
      arme.extension > 1 &&
      arme.pourcentage !== 0
    ) {
      arme.pourcentage = percentageMunition - 100;
      arme.extension = arme.extension - 1;
    }

    if (arme.extension === 1 && percentageMunition === 180) {
      arme.pourcentage = 0;
      arme.extension = 0;
    }

    if (percentageMunition === 180 && arme.pourcentage === 0) {
      arme.pourcentage = 0;
      arme.extension = arme.extension - 1;
    }

    if (percentageMunition > 200 && percentageMunition < 300) {
      arme.pourcentage = percentageMunition - 200;
    }

    if (percentageMunition > 300 && percentageMunition < 400) {
      arme.pourcentage = percentageMunition - 300;
    }

    if (percentageMunition > 400 && percentageMunition < 500) {
      arme.pourcentage = percentageMunition - 400;
    }

    if (percentageMunition > 500 && percentageMunition < 600) {
      arme.pourcentage = percentageMunition - 500;
    }

    if (
      percentageMunition === 160 &&
      arme.extension > 1 &&
      arme.pourcentage !== 0
    ) {
      arme.pourcentage = percentageMunition - 100;
      arme.extension = arme.extension - 1;
    }

    if (percentageMunition === 160 && arme.extension === 1) {
      arme.pourcentage = 0;
      arme.extension = 0;
    }

    if (percentageMunition === 160 && arme.pourcentage === 0) {
      arme.pourcentage = 0;
      arme.extension = 0;
    }

    if (
      percentageMunition === 120 &&
      arme.extension > 1 &&
      arme.pourcentage !== 0
    ) {
      arme.pourcentage = percentageMunition - 100;
      arme.extension = arme.extension - 1;
    }

    if (percentageMunition === 120 && arme.extension === 1) {
      arme.pourcentage = 0;
      arme.extension = 0;
    }

    if (percentageMunition === 120 && arme.pourcentage === 0) {
      arme.pourcentage = 0;
      arme.extension = 0;
    }

    if (
      percentageMunition === 140 &&
      arme.extension > 1 &&
      arme.pourcentage !== 0
    ) {
      arme.pourcentage = percentageMunition - 100;
      arme.extension = arme.extension - 1;
    }

    if (percentageMunition === 140 && arme.extension === 1) {
      arme.pourcentage = 0;
      arme.extension = 0;
    }

    if (percentageMunition === 140 && arme.pourcentage === 0) {
      arme.pourcentage = 0;
      arme.extension = 0;
    }

    if (
      percentageMunition === 120 &&
      arme.extension > 1 &&
      arme.pourcentage !== 0
    ) {
      arme.pourcentage = percentageMunition - 100;
      arme.extension = arme.extension - 1;
    }

    if (percentageMunition === 120 && arme.extension === 1) {
      arme.pourcentage = 0;
      arme.extension = 0;
    }

    if (percentageMunition === 120 && arme.pourcentage === 0) {
      arme.pourcentage = 0;
      arme.extension = 0;
    }

    if (arme.pourcentage <= 0) {
      arme.pourcentage = 0;
    }

    if (
      percentageMunition > 100 &&
      percentageMunition < 200 &&
      percentage !== 120 &&
      percentageMunition !== 140 &&
      percentageMunition !== 120 &&
      percentageMunition !== 160 &&
      percentageMunition !== 180 &&
      arme.extension > 1 &&
      arme.pourcentage !== 0
    ) {
      arme.pourcentage = percentageMunition - 100;
      arme.extension = arme.extension - 1;
    }

    if (
      percentageMunition > 100 &&
      percentageMunition < 200 &&
      percentage !== 120 &&
      percentageMunition !== 140 &&
      percentageMunition !== 120 &&
      percentageMunition !== 160 &&
      percentageMunition !== 180 &&
      arme.extension === 1
    ) {
      arme.pourcentage = 0;
      arme.extension = 0;
    }

    if (
      percentageMunition > 100 &&
      percentageMunition < 200 &&
      percentageMunition !== 140 &&
      percentageMunition !== 120 &&
      percentageMunition !== 160 &&
      percentageMunition !== 180 &&
      arme.pourcentage === 0
    ) {
      arme.pourcentage = 0;
      arme.extension = arme.extension - 1;
    }

    if (percentageMunition > 300) {
      let d = percentageMunition / 100;
      arme.extension = arme.extension - Math.floor(d);
      arme.pourcentage = arme.pourcentage - d * 100;
    }

    if (arme.pourcentage <= 0) {
      arme.pourcentage === 0;
    }

    if (arme.pourcentage > 100) {
      arme.pourcentage = 0;
    }

    if (arme.extension <= 0) {
      arme.extension = 0;
    }

    if (newP < 0) {
      newP = 0;
    }

    if (arme.quantite == 0) {
      arme.pourcentage = 0;
      arme.extension = 0;
    }

    await munition.remove();
    await arme.save();

    let armes = await User.findById(req.user.id).populate("armes");

    res.json(armes);
  } catch (err) {
    res.status(500).send("SERVOR ERROR");
  }
});

router.post("/armes/cedd/:id", auth, async (req, res) => {
  let { email, nom, telephone } = req.body;
  try {
    let user = await User.findById(req.user.id);

    let arme = await Armes.findById(req.params.id);

    let dddsss = new Date(arme.dateAchat);

    let mmmm = new Date(dddsss).getMonth() + 1;

    let jjjj = new Date(dddsss).getDate();

    let aaas = new Date(dddsss).getFullYear();

    if (mmmm < 10) {
      mmmm = "0" + mmmm;
    }

    if (jjjj < 10) {
      jjjj = "0" + jjjj;
    }

    let dateBCCCC = `${jjjj}/${mmmm}/${aaas}`;

    let f = {};
    f.nom = nom;
    f.telephone = telephone;
    f.email = email.toLowerCase();

    let d = {};
    d.from = user.id;
    d.fromNom = user.nom;
    d.fromEmail = user.email;
    d.fromSIA = user.SIA;
    d.armurier = f;
    d.armes = arme;
    d.valider = false;
    d.to = user.id;
    d.toNom = nom;
    d.toSIA = "ARMURIER";
    d.toEmail = email.toLowerCase();
    d.dateCreation = Date.now();

    let ced = new Ceder(d);

    user.ceder.unshift(ced);

    arme.cedee = true;

    let toemail = [];

    toemail.push(user.email);

    toemail.push(email);

    if (user.autorisation) {
      await transporter.sendMail({
        from: `Extension Garantie <${process.env.EMAIL_ADMIN}>`,
        to: toemail,
        subject: "EN COURS DE TRANSFERT",
        html: `<div>

        <p>Bonjour ${user.prenom} ${user.nom}, <br></br>
        <ul>
            <li>Votre arme ${arme.marques} ${arme.modele} ${arme.calibre} ${arme.serie} achetée le ${dateBCCCC} chez ${arme.armurier} 
            est en cours de transfert vers l'armurier dont l'email est ${nom} ${telephone} ${email}.</li>
            <ul>
                <li>${arme.marques}</li>
                <li>${arme.modele}</li>
                <li>${arme.calibre}</li>
                <li>${arme.type}</li>
                <li>${arme.serie}</li>
            </ul>
        </ul>
</div>
<br> <p>Cordialement, </p> </br>
        <div>

        <img style="margin-top:10px;" width="80%" 
        src="https://sidam.suncha.fr/api/PDF/signature.jpg" />

        <p> <span style="color: blue;font-size: x-small;">Ce message électronique et tous les fichiers attachés qu'il
                contient sont
                confidentiels et
                destinés
                exclusivement à l'usage de la personne à laquelle ils sont adressés. Si vous avez reçu ce message
                par
                erreur, merci de le retourner à son émetteur. Les idées et opinions présentées dans ce message sont
                celles de son auteur, et ne représentent pas nécessairement celles de la société SIDAM ou d'une
                quelconque de ses filiales</span>.<span style="color: red;font-weight: bold;font-size: x-small;"> La
                publication,
                l'usage, la
                distribution, l'impression ou la
                copie non
                autorisée de ce message et des attachements qu'il contient sont strictement interdits.</span><br>
            <span style="color: blue;font-size: x-small;">

                This e-mail and any files transmitted with it are confidential and intended solely for the use of
                the
                individual to whom it is addressed.If you have received this email in error please send it back to
                the
                person that sent it to you. Any views or opinions presented are solely those of its author and do
                not
                necessarily represent those of SIDAM Company or any of its subsidiary companies.</span> <span
                style="color: red;font-weight: bold;font-size: x-small;"> Unauthorized
                publication, use, dissemination, forwarding, printing or copying of this email and its associated
                attachments is strictly prohibited.</span>
        </p>
        </div>
    </div>`,
      });

      let message = {
        notification: {
          title: `EN COURS DE TRANSFERT`,
          body: `Arme ${arme.marques} ${arme.modele} en cours de tranfert.`,
          image:
            arme.marques === "CZ"
              ? `${process.env.API_URL}/notification/CZ.png`
              : `${process.env.API_URL}/notification/sw.png`,
          icon:
            arme.marques === "CZ"
              ? `${process.env.API_URL}/notification/CZ.png`
              : `${process.env.API_URL}/notification/sw.png`,
        },
      };

      await admin.messaging().sendToDevice(user.deviceToken, message);
      await arme.save();
      await ced.save();
      await user.save();

      res.json({ msg: "ok" });
    } else {
      await arme.save();
      await ced.save();
      await user.save();

      res.json({ msg: "ok" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("SERVOR ERROR");
  }
});

router.post("/armes/annulez/:id", auth, async (req, res) => {
  try {
    let armes = await Armes.findById(req.params.id);

    armes.cedee = false;

    await Ceder.deleteOne({ armes: armes._id });

    await armes.save();

    res.json({ msg: "ok" });
  } catch (err) {
    res.status(500).send("SERVOR ERROR");
  }
});

router.get("/armes/:id", auth, async (req, res) => {
  try {
    let armes = await Armes.findById(req.params.id)
      .populate("munitions")
      .select("-motdepasse -mdpsecret");

    res.json(armes);
  } catch (err) {
    res.status(500).send("SERVOR ERROR");
  }
});

router.delete("/armes/:id", auth, async (req, res) => {
  try {
    let armes = await Armes.findById(req.params.id);

    let ceder = await Ceder.findOne({ armes: req.params.id });

    let user = await User.findById(req.user.id);

    let facture = await Facture.findOne({ armes: armes._id });

    let f = user.factures.findIndex((x) => x === facture._id);

    user.factures.splice(f, 1);

    let d = user.armes.findIndex((x) => x === armes._id);

    user.armes.splice(d, 1);

    if (ceder) {
      let f = user.ceder.findIndex((x) => x === ceder._id);
      user.ceder.splice(f, 1);
      await ceder.remove();
    }

    if (user.autorisation) {
      let message = {
        notification: {
          title: `ARME SUPPRIMÉE`,
          body: `Votre arme ${armes.marques} ${armes.modele} ${armes.type} ${armes.calibre} ${armes.serie} à bien été supprimée`,
          image:
            armes.marques === "CZ"
              ? `${process.env.API_URL}/notification/CZ.png`
              : `${process.env.API_URL}/notification/sw.png`,
          icon:
            armes.marques === "CZ"
              ? `${process.env.API_URL}/notification/CZ.png`
              : `${process.env.API_URL}/notification/sw.png`,
        },
      };

      await admin.messaging().sendToDevice(user.deviceToken, message);
      await user.save();

      await armes.remove();

      await facture.remove();

      res.json({ msg: "OK" });
    } else {
      await user.save();

      await armes.remove();

      await facture.remove();

      res.json({ msg: "OK" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("SERVOR ERROR");
  }
});

router.post("/armes/ced/:id", auth, async (req, res) => {
  let { email } = req.body;

  try {
    let user = await User.findById(req.user.id);

    let arme = await Armes.findById(req.params.id);

    let newUser = await User.findOne({ email: email.toLowerCase() });

    if (!newUser) {
      res.status(400).send("Utilisateur inconnue");
    } else {
      arme.cedee = true;
      let d = {};
      d.from = user.id;
      d.fromNom = user.nom;
      d.fromSIA = user.SIA;
      d.fromEmail = user.email;
      d.to = newUser.id;
      d.toNom = newUser.nom;
      d.toSIA = newUser.SIA;
      d.toEmail = newUser.email;
      d.armes = arme;
      d.valider = false;
      d.dateCreation = Date.now();

      let ced = new Ceder(d);

      user.ceder.unshift(ced);

      if (user.autorisation) {
        let message = {
          notification: {
            title: `EN COURS DE TRANSFERT`,
            body: `Arme ${arme.marques} ${arme.modele} en cours de transfert`,
            image:
              arme.marques === "CZ"
                ? `${process.env.API_URL}/notification/CZ.png`
                : `${process.env.API_URL}/notification/sw.png`,
            icon:
              arme.marques === "CZ"
                ? `${process.env.API_URL}/notification/CZ.png`
                : `${process.env.API_URL}/notification/sw.png`,
          },
        };

        await admin.messaging().sendToDevice(user.deviceToken, message);

        await transporter.sendMail({
          from: `Extension Garantie <${process.env.EMAIL_ADMIN}>`,
          to: user.email,
          subject: "EN COURS DE TRANSFERT",
          html: `<div>
       
        <p>Bonjour ${user.prenom} ${user.nom}, <br></br>
        <ul>
            <li>Votre arme ${arme.marques} ${arme.modele} ${arme.calibre} ${arme.serie} chez ${arme.armurier} 
            est en cours de transfert vers ${newUser.nom} ${newUser.prenom}.</li>
            <ul>
                <li>${arme.marques}</li>
                <li>${arme.modele}</li>
                <li>${arme.calibre}</li>
                <li>${arme.type}</li>
                <li>${arme.serie}</li>
            </ul>
        </ul>
    </div>
    
    <br> <p>Cordialement, </p> </br>
    <div>

      <img style="margin-top:10px;" width="80%" 
        src="https://sidam.suncha.fr/api/PDF/signature.jpg" />

    <p> <span style="color: blue;font-size: x-small;">Ce message électronique et tous les fichiers attachés qu'il
            contient sont
            confidentiels et
            destinés
            exclusivement à l'usage de la personne à laquelle ils sont adressés. Si vous avez reçu ce message
            par
            erreur, merci de le retourner à son émetteur. Les idées et opinions présentées dans ce message sont
            celles de son auteur, et ne représentent pas nécessairement celles de la société SIDAM ou d'une
            quelconque de ses filiales</span>.<span style="color: red;font-weight: bold;font-size: x-small;"> La
            publication,
            l'usage, la
            distribution, l'impression ou la
            copie non
            autorisée de ce message et des attachements qu'il contient sont strictement interdits.</span><br>
        <span style="color: blue;font-size: x-small;">

            This e-mail and any files transmitted with it are confidential and intended solely for the use of
            the
            individual to whom it is addressed.If you have received this email in error please send it back to
            the
            person that sent it to you. Any views or opinions presented are solely those of its author and do
            not
            necessarily represent those of SIDAM Company or any of its subsidiary companies.</span> <span
            style="color: red;font-weight: bold;font-size: x-small;"> Unauthorized
            publication, use, dissemination, forwarding, printing or copying of this email and its associated
            attachments is strictly prohibited.</span>
    </p>
    </div>
</div>`,
        });
        await ced.save();
        await newUser.save();
        await user.save();
        await arme.save();
        res.json({ msg: "ok" });
      } else {
        await ced.save();
        await newUser.save();
        await user.save();
        await arme.save();
        res.json({ msg: "ok" });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("SERVOR ERROR");
  }
});

module.exports = router;
