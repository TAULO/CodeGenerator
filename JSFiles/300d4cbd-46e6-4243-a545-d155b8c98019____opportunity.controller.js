let request = require('request')
const formidable = require('formidable');
const path = require('path');
const fs = require('fs')
const { Requirement } = require('../models/requirement')
const { Proposal } = require('../models/proposal')
const { User } = require('../models/user')
const { Wallet } = require('../models/wallet')

const ejs = require('ejs');
const moment = require('moment');

const { transporter } = require('../utilities');

const opportunityCtrl = {};

function convertUTCDateToLocalDate(date) {
    var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);

    var offset = date.getTimezoneOffset() / 60;
    var hours = date.getHours();

    newDate.setHours(hours - offset);

    return newDate;
}

/**
 * Hnadles the opportunity rejection by the partner
 * @param {string} opportunity - the requirement ID.
 */
opportunityCtrl.reject = async (req, res) =>{
  try {
    var opportunity = await Requirement.findOneAndUpdate(
    {_id: req.body.opportunity},
    {$push: {rejected: req.body.user}},
    {new: true});
    var proposal = await Proposal.findOneAndRemove({requirement: req.body.opportunity, partner: req.body.user})
    res.status(200).redirect("/partner")
  } catch(e){
    console.log(e);
    res.status(500).redirect("/partner");
  }
}

/**
 * Creates a proposal for the opportunity
 * @param {string} opportunity - the requirement ID.
 * @param {int} price - The rating from very bad to very good.
 * @param {date} deadline - the requirement ID.
 * @param {int} time - The rating from very bad to very good.
 * @param {string} estimated - the requirement ID.
 * @param {string} client - The rating from very bad to very good.
 * @param {string} user - the requirement ID.
 * @return {string} message of the operation
*/
opportunityCtrl.proposalCreate = async (req, res) =>{

  try {

    const form1 = formidable({ multiples: true });

    form1.uploadDir = "src/assets/uploads/proposals"
    form1.keepExtensions = true;

    form1.parse(req, async function (err, fields, files) {

      var date = new Date(fields.deadline)

      var offset = date.getTimezoneOffset() / 60;
      var formated_deadline = new Date(date.setHours(date.getHours() + offset));
      var proposal = new Proposal;
      client = await User.findById(fields.client);
      var partner = await User.findById(fields.user);
      proposal.requirement = fields.opportunity
      proposal.price = fields.price
      proposal.deadline = formated_deadline
      proposal.timeStampCreate = new Date();
      proposal.estimatedTime = fields.time
      proposal.estimatedUnit = fields.estimated
      proposal.partner = fields.user
      proposal.client = fields.client

      var newProposal = await proposal.save();
      var currentDate = new Date()
      var expireDate = new Date(currentDate.setDate(currentDate.getDate() + 2));


      // first job notified after 24 hours
      setTimeout(proposalNotificationEmail, 86400000, newProposal._id, client, fields.opportunity);

      // second Job after 48 hours remove proposal and send notification to the partner
      setTimeout(expirationEmail, 172800000, newProposal._id, partner, fields.opportunity);

      var mailOptions = {
        from: 'Asilinks <admin@asilinks.com>',
        to: client.email, // list of receivers
        subject: 'Tienes una nueva propuesta', // Subject line
        html: '<html><body>Hola has recibido una propuesta.<br> Recuerda que tienes hasta 48 horas para aceptarla. <br><a href="http://'+`${req.headers.host}`+'/client/requirement-description?id='+`${fields.opportunity}`+'">Pulsa aquí para verlo</a></body></html>'
      };

      await transporter.sendMail(mailOptions, async function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log(info);
        }
      })
    });

    form1.on('end', () => {
      res.status(200).send("ok")
    });

  } catch (e){
    console.log(e)
    res.status(500).send(e);
  }
}

/**
 * Edits a proposal for the opportunity
 * @param {string} proposal - the proposal ID.
 * @param {int} price - The rating from very bad to very good.
 * @param {date} deadline - the requirement ID.
 * @param {int} time - The rating from very bad to very good.
 * @param {string} estimated - the requirement ID.
 * @return {string} message of the operation
 */
opportunityCtrl.proposalEdit = async (req, res) =>{
try {
    var proposal = await Proposal.findOneAndUpdate({_id: req.body.proposal},
    {$set: {price:req.body.price, deadline:req.body.deadline, estimatedTime:req.body.time,
    estimatedUnit:req.body.estimated}},
    {new: true});

    res.status(200).send("ok")
  } catch (e){
    console.log(e)
    res.status(500).send(e);
  }
}

/**
 * Rejects a proposal for the opportunity
 * @param {string} proposal - the proposal ID.
 * @return {string} message of the operation
 */
opportunityCtrl.proposalReject = async (req, res) =>{
  try {
    var proposal = await Proposal.findOneAndUpdate({_id: req.body.proposal},
    {$set: {status: "Rejected"}},
    {new: true});
    res.status(200).send("ok")
  } catch (e){
    console.log(e)
    res.status(500).send(e);
  }
}

/**
 * Accepts a proposal for the opportunity
 * @param {string} proposal - the proposal ID.
 * @return {string} message of the operation
 */
opportunityCtrl.proposalAccept = async (req, res) =>{
  try {
    var proposal = await Proposal.findOneAndUpdate({_id: req.body.proposal},
    {$set: {status: "Accepted", acceptedTime: new Date()}},
    {new: true});
    var requirement = await Requirement.findOneAndUpdate({_id: proposal.requirement},
    {$set: {status: "Iniciado", acceptedDate: new Date()}},
    {new: true});
    await Proposal.updateMany({_id:{$ne: req.body.proposal}},
    {$set: {status: "Rejected"}},
    {new: true});
    res.status(200).send("ok")
  } catch (e){
    console.log(e)
    res.status(500).send(e);
  }
}

/**
 * Proposal payment by wallet
 * @param {string} proposal - the proposal ID.
 * @return {string} message of the operation
 */
opportunityCtrl.walletPayment = async (req, res) => {

  try {

    var proposal = await Proposal.findById(req.body.proposal)
    var client = await User.findOne({_id: proposal.client})
    var partner = await User.findOne({_id: proposal.partner})
    var requirement = await Requirement.findOne({_id:proposal.requirement})

    var fee = proposal.price * 0.1 // 10% fee
    var partner_payment = proposal.price*0.6 // 60% to partner
    var amount = Number((fee + partner_payment).toFixed(2));

    if (client.wallet < amount) {
      res.status(400).send("Monto insuficiente")
    } else {

      var wallet = new Wallet();
      wallet.retirementWallet.amount = amount
      wallet.retirementWallet.name = client.firstname+" "+client.lastname
      wallet.retirementWallet.bank = "Wallet"
      wallet.retirementWallet.routing = "Wallet"
      wallet.retirementWallet.bankAccountNumber = "Wallet"
      wallet.retirementWallet.checkoutMethod = "Wallet"
      wallet.historyWallet = client.wallet
      wallet.user = client._id
      wallet.status = "Aprobada"
      await wallet.save()

      var wallet_p = new Wallet();
      wallet_p.user = partner._id
      wallet_p.rechargeWallet.amount = Number((partner_payment).toFixed(2))
      wallet_p.rechargeWallet.email = partner.email
      wallet_p.rechargeWallet.nameCard = partner.firstname+" "+partner.lastname
      wallet_p.rechargeWallet.country = partner.country
      wallet_p.status = "Aprobada"
      wallet_p.historyWallet = partner.wallet
      await wallet_p.save();

      var admin = await User.findOne({"email":"asilinks.ve@gmail.com"});
      var wallet_admin = new Wallet();
      wallet_admin.user = admin._id
      wallet_admin.rechargeWallet.amount = Number((fee).toFixed(2))
      wallet_admin.rechargeWallet.email = admin.email
      wallet_admin.rechargeWallet.nameCard = admin.firstname+" "+partner.lastname
      wallet_admin.rechargeWallet.country = admin.country
      wallet_admin.status = "Aprobada"
      wallet_admin.historyWallet = admin.wallet
      await wallet_admin.save();
      await User.findOneAndUpdate({"email":"asilinks.ve@gmail.com"},
      {$inc: {"wallet": Number((fee).toFixed(2))}},{new: true})

      await User.findOneAndUpdate({"_id": proposal.client},
      {$inc: {"wallet": -amount}},{new: true})
      await User.findOneAndUpdate({"_id": proposal.partner},
      {$inc: {"wallet": Number((partner_payment).toFixed(2))}},{new: true})

      // payment done
      var currentDate = new Date();

      await Proposal.findOneAndUpdate({_id: req.body.proposal},
                                      {$set: {status: "Accepted", acceptedTime: new Date(), acceptedDate: moment().format("DD/MM/yyyy")}},
                                      {new: true});
      await Requirement.findOneAndUpdate({_id: proposal.requirement},
                                      {$set: {status: "Iniciado", acceptedDate: new Date(), proposal: req.body.proposal, partner: proposal.partner}},
                                      {new: true});
      await Proposal.updateMany({_id:{$ne: req.body.proposal}, requirement: proposal.requirement},
                                      {$set: {status: "Rejected"}},
                                      {new: true});


      // send timeout emails
      var current_date = new Date()
      var five_days = proposal.deadline.getTime() - 5*24*60*60*1000;
      var fiveDays = five_days - current_date.getTime();
      var three_days = proposal.deadline.getTime() - 3*24*60*60*1000;
      var threeDays = three_days - current_date.getTime();
      var one_day = proposal.deadline.getTime() - 24*60*60*1000;
      var oneDay = one_day - current_date.getTime();

      if (fiveDays > 0){
        setTimeout(deadlineNotification, fiveDays, 5, partner, client, proposal, requirement)
      }

      if (threeDays > 0){
        setTimeout(deadlineNotification, threeDays, 3, partner, client, proposal, requirement)
      }

      if (oneDay >0){
        setTimeout(deadlineNotification, oneDay, 1, partner, client, proposal, requirement)
      }
      //

      var mailOptions = {
        from: 'Asilinks <admin@asilinks.com>',
        to: partner.email, // list of receivers
        subject: 'Tu propuesta ha sido aceptada!', // Subject line
        html: '<html><body>Hola el cliente ha aceptado tu propuesta.<br><a href="http://'+`${req.headers.host}`+'/partner/opportunity/'+`${proposal.requirement}`+'">Pulsa aquí para ver el requerimiento</a></body></html>'
      };

      var check_services = ejs.compile(fs.readFileSync(__dirname + '/../views/email_templates/check.ejs', 'utf-8'));
      var html_services = check_services({ date : moment(currentDate).format("DD/MM/YYYY"),
                                          time : moment(currentDate).format("hh:mm a") ,
                                          to: partner.firstname +" "+partner.lastname+" por concepto de: Servicios profesionales",
                                          amount: Number((partner_payment).toFixed(2)),
                                          paymentType: "Wallet"
                                        });
      var check_fee = ejs.compile(fs.readFileSync(__dirname + '/../views/email_templates/check.ejs', 'utf-8'));
      var html_fee = check_fee({ date : moment(currentDate).format("DD/MM/YYYY"),
                                time : moment(currentDate).format("hh:mm a") ,
                                to: "Asilinks CORP por concepto de: Comisiones de Asilinks",
                                amount: Number((fee).toFixed(2)),
                                paymentType: "Wallet"
      });

      // Send Email
      await transporter.sendMail(mailOptions, async function(error, info){
        if (error) {
          console.log(error);
          res.sendStatus(500)
        } else {
          console.log(info);
          res.status(200).send({html_services,html_fee})
        }
      })
    }
  } catch (e){
    console.log(e);
    res.sendStatus(500)
  }
}

/**
 * Pays the proposal by credit card Payment
 * @param {string} proposal - the proposal ID.
 * @param {int} creditCardNumber - Credit card number.
 * @param {int} cvv - Credit card CVC/CVV .
 * @param {string} expiration_month - two digit month .
 * @param {int} expiration_year - four digit year.
 * @param {string} email - credit card owner email.
 * @return {string} Message and status
 */
opportunityCtrl.cardPayment = async (req, res) => {

  var proposal = await Proposal.findById(req.body.proposal)
  var client = await User.findOne({_id: proposal.client})
  var partner = await User.findOne({_id: proposal.partner})
  var requirement = await Requirement.findOne({_id:proposal.requirement})

  var fee = proposal.price * 0.1 // 10% fee
  var partner_payment = proposal.price*0.6 // 60% to partner
  var amount = Number((fee + partner_payment).toFixed(2));

  let form_sitca = {
    monto: amount,
    numero: req.body.creditCardNumber,
    cvc: req.body.cvv,
    mes: req.body.expiration_month,
    ano: req.body.expiration_year,
    moneda: "USD",
    referencia: String(requirement._id)
  }

  options = {
    method: 'POST',
    url: process.env.BANCAMIGA_URL,
    headers: {'apikey': process.env.BANCAMIGA_KEY,'Content-Type': 'application/json' },
    formData: form_sitca
  }

  request(options, async function (error, response, ibody) {
    if (error) {
      console.log(error);
      res.sendStatus(500);
    } else {

      let parsedResponse = JSON.parse(ibody);
      if(parsedResponse.aprobado){
        await Proposal.findOneAndUpdate({_id: req.body.proposal},
                                        {$set: {status: "Accepted", acceptedTime: new Date(), acceptedDate: moment().format("DD/MM/yyyy")}},
                                        {new: true});
        await Requirement.findOneAndUpdate({_id: proposal.requirement},
                                          {$set: {status: "Iniciado", proposal: req.body.proposal, partner: proposal.partner}},
                                          {new: true});
        await Proposal.updateMany({_id:{$ne: req.body.proposal}, requirement: proposal.requirement},
                                  {$set: {status: "Rejected"}},
                                  {new: true});

        var wallet = new Wallet();
        wallet.user = partner._id
        wallet.rechargeWallet.amount = Number((partner_payment).toFixed(2))
        wallet.rechargeWallet.email = partner.email
        wallet.rechargeWallet.nameCard = partner.firstname+" "+partner.lastname
        wallet.rechargeWallet.country = partner.country
        wallet.status = "Aprobada"
        wallet.historyWallet = partner.wallet
        await wallet.save();

        var admin = await User.findOne({"email":"asilinks.ve@gmail.com"});
        var wallet_admin = new Wallet();
        wallet_admin.user = admin._id
        wallet_admin.rechargeWallet.amount = Number((fee).toFixed(2))
        wallet_admin.rechargeWallet.email = admin.email
        wallet_admin.rechargeWallet.nameCard = admin.firstname+" "+partner.lastname
        wallet_admin.rechargeWallet.country = admin.country
        wallet_admin.status = "Aprobada"
        wallet_admin.historyWallet = admin.wallet
        await wallet_admin.save();
        await User.findOneAndUpdate({"email":"asilinks.ve@gmail.com"},
                                    {$inc: {"wallet": Number((fee).toFixed(2))}},{new: true})

        await User.findOneAndUpdate({"_id": proposal.partner},
                                    {$inc: {"wallet": Number((partner_payment).toFixed(2))}},{new: true})


        // send timeout emails
        var current_date = new Date()
        var five_days = proposal.deadline.getTime() - 5*24*60*60*1000;
        var fiveDays = five_days - current_date.getTime();
        var three_days = proposal.deadline.getTime() - 3*24*60*60*1000;
        var threeDays = three_days - current_date.getTime();
        var one_day = proposal.deadline.getTime() - 24*60*60*1000;
        var oneDay = one_day - current_date.getTime();

        if (fiveDays > threeDays){
          setTimeout(deadlineNotification, fiveDays, 5, partner, client, proposal, requirement)
        }

        if (threeDays > oneDay){
          setTimeout(deadlineNotification, threeDays, 3, partner, client, proposal, requirement)
        }

        if (oneDay >0){
          setTimeout(deadlineNotification, oneDay, 1, partner, client, proposal, requirement)
        }
        //


        var mailOptions = {
          from: 'Asilinks <admin@asilinks.com>',
          to: partner.email, // list of receivers
          subject: 'Tu propuesta ha sido aceptada!', // Subject line
          html: '<html><body>Hola el cliente ha aceptado tu propuesta.<br><a href="http://'+`${req.headers.host}` +'/partner/opportunity/'+`${proposal.requirement}`+'">Pulsa aquí para ver el requerimiento</a></body></html>'
        };

        var currentDate = new Date();
        var check_services = ejs.compile(fs.readFileSync(__dirname + '/../views/email_templates/check.ejs', 'utf-8'));
        var html_services = check_services({ date : moment(currentDate).format("DD/MM/YYYY"),
                                            time : moment(currentDate).format("hh:mm a") ,
                                            to: partner.firstname +" "+partner.lastname+" por concepto de: Servicios profesionales",
                                            amount: Number((partner_payment).toFixed(2)),
                                            paymentType: "Tarjeta de crédito"
        });
        var check_fee = ejs.compile(fs.readFileSync(__dirname + '/../views/email_templates/check.ejs', 'utf-8'));
        var html_fee = check_fee({ date : moment(currentDate).format("DD/MM/YYYY"),
                                  time : moment(currentDate).format("hh:mm a") ,
                                  to: "Asilinks CORP por concepto de: Comisiones de Asilinks",
                                  amount: Number((fee).toFixed(2)),
                                  paymentType: "Tarjeta de crédito"
        });

        // Send Email
        await transporter.sendMail(mailOptions, async function(error, info){
          if (error) {
            console.log(error);
            res.sendStatus(500)
          } else {
            console.log(info);
            res.status(200).send({html_services,html_fee})
          }
        })
      } else {
        res.sendStatus(500);
      }
    }
  })
}


/**
 * 40% of the payment by wallet
 * @param {string} proposal - the proposal ID.
 * @return {string} message of the operation
 */
opportunityCtrl.progressWalletPayment = async (req, res) => {

  try {

  var proposal = await Proposal.findById(req.body.proposal)
  var client = await User.findOne({_id: proposal.client})
  var partner = await User.findOne({_id: proposal.partner})
  var requirement = await Requirement.findOne({_id:proposal.requirement})

  var fee = proposal.price * 0.1 // 10% fee
  var partner_payment = proposal.price*0.4 // 40% to partner
  var amount = Number((partner_payment).toFixed(2));

  if (client.wallet < amount) {
    res.status(400).send("Monto insuficiente")
  } else {

    var wallet = new Wallet();
    wallet.retirementWallet.amount = amount
    wallet.retirementWallet.name = client.firstname+" "+client.lastname
    wallet.retirementWallet.bank = "Wallet"
    wallet.retirementWallet.routing = "Wallet"
    wallet.retirementWallet.bankAccountNumber = "Wallet"
    wallet.retirementWallet.checkoutMethod = "Wallet"
    wallet.historyWallet = client.wallet
    wallet.user = client._id
    wallet.status = "Aprobada"
    await wallet.save()


    var wallet_p = new Wallet();
    wallet_p.user = partner._id
    wallet_p.rechargeWallet.amount = Number((partner_payment).toFixed(2))
    wallet_p.rechargeWallet.email = partner.email
    wallet_p.rechargeWallet.nameCard = partner.firstname+" "+partner.lastname
    wallet_p.rechargeWallet.country = partner.country
    wallet_p.status = "Aprobada"
    wallet_p.historyWallet = partner.wallet
    await wallet_p.save();

    await User.findOneAndUpdate({"_id": proposal.client},
    {$inc: {"wallet": -amount}},{new: true})
    await User.findOneAndUpdate({"_id": proposal.partner},
    {$inc: {"wallet": Number((partner_payment).toFixed(2))}},{new: true})

    // payment done

    await Requirement.findOneAndUpdate({_id: proposal.requirement},
    {$set: {status: "Finalizado", paymentDone: true, paymentDate: new Date()}},
    {new: true});

    var mailOptions = {
    from: 'Asilinks <admin@asilinks.com>',
    to: partner.email, // list of receivers
    subject: 'Servicio finalizado con éxito!', // Subject line
    html: '<html><body>Hola el cliente ha aprobado tu entrega.<br><a href="http://'+`${req.headers.host}` +'/partner/opportunity/'+`${proposal.requirement}`+'">Pulsa aquí para ver el requerimiento</a></body></html>'
    };

    var currentDate = new Date();
    var check_services = ejs.compile(fs.readFileSync(__dirname + '/../views/email_templates/check.ejs', 'utf-8'));
    var html_services = check_services({ date : moment(currentDate).format("DD/MM/YYYY"),
    time : moment(currentDate).format("hh:mm a") ,
    to: partner.firstname +" "+partner.lastname+" por concepto de: Servicios profesionales",
    amount: Number((amount).toFixed(2)),
    paymentType: "Wallet"
    });

    // Send Email
    await transporter.sendMail(mailOptions, async function(error, info){
      if (error) {
        console.log(error);
        res.sendStatus(500)
      } else {
        console.log(info);
        res.status(200).send({html_services})
      }
    })
    }
  } catch (e){
    console.log(e);
    res.sendStatus(500)
  }
}


/**
 * Pays 40% by credit card Payment
 * @param {string} proposal - the proposal ID.
 * @param {int} creditCardNumber - Credit card number.
 * @param {int} cvv - Credit card CVC/CVV .
 * @param {string} expiration_month - two digit month .
 * @param {int} expiration_year - four digit year.
 * @param {string} email - credit card owner email.
 * @return {string} Message and status
 */
opportunityCtrl.progressCardPayment = async (req, res) => {

  var proposal = await Proposal.findById(req.body.proposal)
  var client = await User.findOne({_id: proposal.client})
  var partner = await User.findOne({_id: proposal.partner})
  var requirement = await Requirement.findOne({_id:proposal.requirement})

  var fee = proposal.price * 0.1 // 10% fee
  var partner_payment = proposal.price*0.4 // 60% to partner
  var amount = Number((partner_payment).toFixed(2));

  let form_sitca = {
  monto: amount,
  numero: req.body.creditCardNumber,
  cvc: req.body.cvv,
  mes: req.body.expiration_month,
  ano: req.body.expiration_year,
  moneda: "USD",
  referencia: String(requirement._id)
  }

  console.log(form_sitca)

  options = {
  method: 'POST',
  url: process.env.BANCAMIGA_URL,
  headers: {'apikey': process.env.BANCAMIGA_KEY,'Content-Type': 'application/json' },
  formData: form_sitca
  }

  console.log(options);

  request(options, async function (error, response, ibody) {
  if (error) {

  console.log(error);
  res.sendStatus(500);

  } else {

  console.log(response);
  console.log(ibody);
  let parsedResponse = JSON.parse(ibody);

  if(parsedResponse.aprobado){

  await Requirement.findOneAndUpdate({_id: proposal.requirement},
  {$set: {status: "Finalizado", paymentDone: true, paymentDate: new Date()}},
  {new: true});


  var wallet = new Wallet();
  wallet.user = partner._id
  wallet.rechargeWallet.amount = Number((partner_payment).toFixed(2))
  wallet.rechargeWallet.email = partner.email
  wallet.rechargeWallet.nameCard = partner.firstname+" "+partner.lastname
  wallet.rechargeWallet.country = partner.country
  wallet.status = "Aprobada"
  wallet.historyWallet = partner.wallet
  await wallet.save();

  await User.findOneAndUpdate({"_id": proposal.partner},
  {$inc: {"wallet": Number((partner_payment).toFixed(2))}},{new: true})

  var mailOptions = {
  from: 'Asilinks <admin@asilinks.com>',
  to: partner.email, // list of receivers
  subject: 'El cliente ha aprobado tu entrega!', // Subject line
  html: '<html><body>Hola el cliente ha aprobado tu entrega.<br><a href="http://'+`${req.headers.host}` +'/partner/opportunity/'+`${proposal.requirement}`+'">Pulsa aquí para ver el requerimiento</a></body></html>'
  };

  var currentDate = new Date();
  var check_services = ejs.compile(fs.readFileSync(__dirname + '/../views/email_templates/check.ejs', 'utf-8'));
  var html_services = check_services({ date : moment(currentDate).format("DD/MM/YYYY"),
  time : moment(currentDate).format("hh:mm a") ,
  to: partner.firstname +" "+partner.lastname+" por concepto de: Servicios profesionales",
  amount: Number((amount).toFixed(2)),
  paymentType: "Tarjeta de crédito"
  });

  // Send Email
  await transporter.sendMail(mailOptions, async function(error, info){
  if (error) {
  console.log(error);
  res.sendStatus(500)
  } else {
  console.log(info);
  res.status(200).send({html_services})
  }
  })
  } else {
  res.sendStatus(500);
  }
  }
  })
}

/**
 * Uploads all the works
 * @return {string} Message and status
 */
opportunityCtrl.uploadAttachment = async (req, res) =>{

  try {
    const form = formidable({ multiples: true });
    var file_name;
    form.uploadDir = "src/assets/uploads/works"
    form.keepExtensions = true;
    /* this is where the renaming happens */
    form.on ('fileBegin', function(name, file){
      file_name = file.name;
      //rename the incoming file to the file's name
      file.path = form.uploadDir + "/" + req.params.id+ "_" +file.name;
    })

    form.parse(req, async function (err, fields, files) {

    try {
      // si tiene archivo nuevo, elimina el previo y cambia el path
      if (files.attachment.size > 0){

      var attachment_path = "/assets/uploads/works/"+path.basename(files.attachment.path)

      await Requirement.findOneAndUpdate({_id: req.params.id},
                                        {$set: {
                                          file:attachment_path,
                                          fileName: files.attachment.name,
                                          fileComment: fields.comment_attachment
                                        }},
                                        {new: true}
                                      )
      }

      for (var f=0; f<files.other_attachment.length; f++){
        var attachment_path = "/assets/uploads/works/"+path.basename(files.other_attachment[f].path)
        await Requirement.findOneAndUpdate({_id: req.params.id},
              {$push: {
                otherFiles: {
                fileName: files.other_attachment[f].name,
                filePath: attachment_path}
              }},
              {new: true})
      }

      var requirement= await Requirement.findById(req.params.id).populate('client partner')
      var text = `Hola ${requirement.client.firstname}, ${requirement.partner.firstname} ${requirement.partner.lastname} ha enviado los entregables del requerimiento ${requirement.name}`
      text += ". Puedes pulsar <a href='"+`http://${req.headers.host}/partner/opportunity/inProgress/${requirement._id}`+"'>Aquí</a> para verlo.";

      var mailOptions = {
        from: 'Asilinks <admin@asilinks.com>',
        to: requirement.client.email, // list of receivers
        subject: 'Entregables Recibidos!', // Subject line
        html: '<html><body>'+text+'</body></html>'
      };

      // Send Email
      await transporter.sendMail(mailOptions, async function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log(info);
        }
      })


    } catch (e) {
      console.log(e)
      return res.status(500).send("Error subiendo archivos")
      }
    });

    form.on('end', function() {
      console.log('done!')
      return res.redirect("/partner/opportunity/inProgress/"+req.params.id);
    });

  } catch(e){
    console.log(e);
    return res.status(500).send("Error subiendo archivos");
  }
}


/**
 * Adds an extension for the deadline
 * @param {string} requirement - the requirement ID
 * @return {string} Message and status
 */
opportunityCtrl.extension = async (req, res) =>{
  try {
  var requirement = await Requirement.findById(req.body.requirement).populate('proposal');

  //calc extension
  var extensionDate;
  var requestExtension = false;
  var newDeadline = Number((requirement.proposal.estimatedTime / 2).toFixed(0));

  if (!requirement.proposal.extension.requested){

  // no extension yet
  var a = convertUTCDateToLocalDate(requirement.proposal.acceptedTime).getTime();
  var d = requirement.proposal.deadline.getTime();
  var t = (d-a)/2;
  var c = new Date().getTime();
  var max = a+t;
  if (c <= max){

  // less or equal to 50% of estimated time
  requestExtension = true;
  // new deadline
  extensionDate = new Date(d+t);
  var extension =  {
  requested: true,
  estimatedTime: newDeadline,
  estimatedUnit: requirement.proposal.estimatedUnit,
  previousDeadline: requirement.proposal.deadline,
  comment: req.body.comment,
  acceptedDate: new Date()
  }
  var newEstimatedTime = newDeadline + Number(requirement.proposal.estimatedTime)
  await Proposal.findOneAndUpdate(
  {requirement:req.body.requirement},
  {$set: {deadline: extensionDate, estimatedTime: newEstimatedTime, extension: extension}},
  {new: true}
  )

  res.status(200).send("ok")
  } else {

  return res.status(500).send("Tiempo excedido")
  }

  } else {

  return res.status(500).send("Prórroga ya solicitada")
  }
  } catch(e){
  console.log(e);
  return res.status(500).send("Error al procesar solicitud")
  }
}

/**
 * Adds an extension in case of work rejected
 * @param {string} requirement - the requirement ID
 * @return {string} Message and status
 */
opportunityCtrl.extendWork = async (req, res) =>{
  try {
  var requirement = await Requirement.findById(req.body.requirement).populate('proposal');

  //calc extension
  var extensionDate;
  var requestExtension = false;
  var newDeadline = Number((requirement.proposal.estimatedTime / 2).toFixed(0));

  if (!requirement.proposal.extension.requested){

  // no extension yet
  var a = requirement.proposal.acceptedTime.getTime();
  var d = requirement.proposal.deadline.getTime();
  var t = (d-a)/2;
  var c = new Date().getTime();


  // less or equal to 50% of estimated time
  requestExtension = true;
  // new deadline
  extensionDate = new Date(d+t);
  var extension =  {
  requested: true,
  estimatedTime: newDeadline,
  estimatedUnit: requirement.proposal.estimatedUnit,
  previousDeadline: requirement.proposal.deadline,
  comment: req.body.comment,
  acceptedDate: new Date()
  }
  var newEstimatedTime = Number(requirement.proposal.estimatedTime) + newDeadline;

  await Proposal.findOneAndUpdate(
  {requirement:req.body.requirement},
  {$set: {deadline: extensionDate, estimatedTime: newEstimatedTime, extension: extension}},
  {new: true}
  )

  res.status(200).send("ok")


  } else {

  return res.status(500).send("Prórroga ya solicitada")
  }
  } catch(e){
  console.log(e);
  return res.status(500).send("Error al procesar solicitud")
  }
}

/**
 * Rejects the works and restores the money of the client
 * @param {string} requirement - the requirement ID
 * @return {string} Message and status
 */
opportunityCtrl.rejectWork = async (req, res) => {

  try {

  var requirement = await Requirement.findById(req.body.requirement).populate('proposal')
  var client = await User.findById(requirement.client)
  var partner = await User.findById(requirement.proposal.partner)


  var partner_payment = requirement.proposal.price*0.6 // 60% to partner
  var amount = Number((partner_payment).toFixed(2));


  var wallet = new Wallet();
  wallet.retirementWallet.amount = amount
  wallet.retirementWallet.name = partner.firstname+" "+partner.lastname
  wallet.retirementWallet.bank = "Wallet"
  wallet.retirementWallet.routing = "Wallet"
  wallet.retirementWallet.bankAccountNumber = "Wallet"
  wallet.retirementWallet.checkoutMethod = "Wallet"
  wallet.historyWallet = partner.wallet
  wallet.user = partner._id
  wallet.status = "Aprobada"
  await wallet.save()


  var wallet_c = new Wallet();
  wallet_c.user = partner._id
  wallet_c.rechargeWallet.amount = ammount
  wallet_c.rechargeWallet.email = client.email
  wallet_c.rechargeWallet.nameCard = client.firstname+" "+client.lastname
  wallet_c.rechargeWallet.country = client.country
  wallet_c.status = "Aprobada"
  wallet_c.historyWallet = client.wallet
  await wallet_c.save();


  await User.findOneAndUpdate({"_id": requirement.proposal.client},
  {$inc: {"wallet": amount}},{new: true})
  await User.findOneAndUpdate({"_id": requirement.proposal.partner},
  {$inc: {"wallet": -ammount}},{new: true})

  // payment done
  var currentDate = new Date();

  await Proposal.findOneAndUpdate({_id: requirement.proposal},
  {$set: {status: "Rejected"}},
  {new: true});
  await Requirement.findOneAndUpdate({_id: requirement._id},
  {$set: {status: "Cancelado"}},
  {new: true});

  var mailOptions = {
  from: 'Asilinks <admin@asilinks.com>',
  to: client.email, // list of receivers
  subject: 'Tu inversión ha sido reembolsada!', // Subject line
  html: '<html><body>Lamentamos que tu requerimiento no haya sido culminado con éxito.</body></html>'
  };

  var check_services = ejs.compile(fs.readFileSync(__dirname + '/../views/email_templates/check.ejs', 'utf-8'));
  var html_services = check_services({ date : moment(currentDate).format("DD/MM/YYYY"),
  time : moment(currentDate).format("hh:mm a") ,
  to: partner.firstname +""+partner.lastname+" por concepto de: Servicios profesionales",
  amount: Number((partner_payment).toFixed(2)),
  paymentType: "Wallet"
  });

  // Send Email
  await transporter.sendMail(mailOptions, async function(error, info){
    if (error) {
      console.log(error);
      res.sendStatus(500)
    } else {
      console.log(info);
      res.status(200).send({html_services})
    }
  })

  } catch (e){
  console.log(e);
  res.sendStatus(500)
  }
}



async function proposalNotificationEmail(id, client, opportunity) {
  try {
    await Proposal.findOneAndUpdate({_id:id},{$set:{notified:true}});
    var mailOptions = {
      from: 'Asilinks <admin@asilinks.com>',
      to: client.email, // list of receivers
      subject: 'Propuesta recibida', // Subject line
      html: '<html><body>Hola recuerda que tienes una propuesta pendiente. Esta caducará en 24 horas.<br><a href="http://'+`${process.env.HOST}`+'/client/requirement-description?id='+`${opportunity}`+'"> Pulsa aquí para verla</a></body></html>'
    };

    // Send Email
    await transporter.sendMail(mailOptions, async function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log(info);
      }
    })

  } catch(e){
    console.log(e);
  }
}


async function expirationEmail(id, partner, opportunity) {
  try {
    await Proposal.findOneAndRemove({_id:id});
    var mailOptions = {
      from: 'Asilinks <admin@asilinks.com>',
      to: partner.email, // list of receivers
      subject: 'Propuesta expirada', // Subject line
      html: '<html><body>Hola han transcurrido 48 horas desde que tu propuesta fue enviada. <br><a href="http://'+`${process.env.HOST}`+'/partner/requirement-description/'+`${opportunity}`+'"> Pulsa aquí para mandar otra propuesta</a></body></html>'
    };

    // Send Email
    await transporter.sendMail(mailOptions, async function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log(info);
      }
    })

  } catch(e){
    console.log(e);
  }
}


async function timeOutProposal(){
  console.log("calculando los tiemouts Proposal");
  try {

    var currentDate = new Date();
    var proposals = await Proposal.find({status:"Pending"}).populate("partner client");

    proposals.forEach((item, i) => {

      var creationTime = new Date(item.timeStampCreate);
      var oneDay = creationTime.getTime() + 86400000;
      var twoDays = creationTime.getTime() + 172800000;

      if (!item.notified){
        var notificationTime = oneDay - currentDate.getTime()
        setTimeout(proposalNotificationEmail, notificationTime, item._id, item.client, item.requirement);
      }

      var expirationTime = twoDays - currentDate.getTime();
      setTimeout(expirationEmail, expirationTime, item, item.partner, item.requirement);
    });
  } catch(e){
    console.log(e);
  }
}


timeOutProposal();




// send timeout emails

async function deadlineNotification(days, partner, client, proposal, requirement){
  var notificationHtml = '<html><body>'
  notificationHtml+='Hola '+partner.firstname +' te faltan '+days+' día(s) para culminar un requerimiento, a continuación te mostramos los detalles:'
  notificationHtml+= "<br>Nombre del Requerimiento: " + requirement.name;
  notificationHtml+= "<br>Descripción: " + requirement.description;
  notificationHtml+= "<br>Cliente: " + client.firstname +" "+client.lastname
  notificationHtml+= "<br>Fecha de entrega: " + moment(proposal.deadline).format("DD/MM/YYYY")
  notificationHtml+= "</body></html>"

  try {

    var mailOptions = {
      from: 'Asilinks <admin@asilinks.com>',
      to: partner.email, // list of receivers
      subject: 'Entrega de requerimiento', // Subject line
      html: notificationHtml
    };
    // Send Email
    await transporter.sendMail(mailOptions, async function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log(info);
      }
    })

  } catch(e){
    console.log(e);
  }
}



//


async function timeOutOpportunity(){
  console.log("calculando los tiemouts Oportunidades");
  try {

    var requirements = await Requirement.find({status:"Iniciado"}).populate("partner client proposal");
    var current_date = new Date()
    requirements.forEach((item, i) => {
      var five_days = item.proposal.deadline.getTime() - 5*24*60*60*1000;
      var fiveDays = five_days - current_date.getTime();
      var three_days = item.proposal.deadline.getTime() - 3*24*60*60*1000;
      var threeDays = three_days - current_date.getTime();
      var one_day = item.proposal.deadline.getTime() - 24*60*60*1000;
      var oneDay = one_day - current_date.getTime();
      if (fiveDays > 0){
        setTimeout(deadlineNotification, fiveDays, 5, item.partner, item.client, item.proposal, item)
      }

      if (threeDays > 0){
        setTimeout(deadlineNotification, threeDays, 3, item.partner, item.client, item.proposal, item)
      }

      if (oneDay >0){
        setTimeout(deadlineNotification, oneDay, 1, item.partner, item.client, item.proposal, item)
      }
    });
  } catch(e){
    console.log(e);
  }
}


timeOutOpportunity();


module.exports = opportunityCtrl;
