  var RC = require('ringcentral')
  var fs = require('fs')
  var request=require('request');
  var async = require("async");
  const pgdb = require('./db')

  const transcriptionist = require('./transcription_engine')
  var number_analysis = require('./number_analysis_telesign')
  var content_analysis = require('./content_analysis')
  const RCPlatform = require('./platform.js')
  //require('dotenv').load()


  var index = 0
  var samplePhoneNumber = [
    '5084330816','9294749128','2025730012',
    '2816488775','6196583462','6507291497',
    '6502246623','6502958113','6504099098',
    '+14082315632','2069735132','4085942101',
    '6507123430','2816488775','6196583462',
    '6507431904','6502958113','2157108508',
    '7574323544','6505387008','6502241277',
    '6504099043','6504099098','6506949812'
  ]

  function User(id, mode) {
    this.id = id;
    this.admin = false;
    this.extensionId = 0;
    this.subscriptionId = ""
    this.extIndex = 0
    this.userName = ""
    this.phoneNumbers = []
    this.companyNumbers = []
    this.newData = false
    this.voiceMailMetaData = []
    this.rc_platform = new RCPlatform(mode)
    this.categoryList = ["Authentication","Notification","Voice","Messaging","Configuration","Integration","Meeting","Data"]
    //this.use3rdPartyTranscription = false
    this.settings = {
      third_party_transcription: false,
      transcribe_spam : false,
      send_confirm_sms : true,
      message: "Thank you for you voice message! We will get back to you as soon as we can.",
      assigned_agents: [],
      agents: [],
      categories: ["Authentication","Notification","Voice","Messaging","Configuration","Integration","Meeting","Data"]
    }
    return this
  }

  var engine = User.prototype = {
    setExtensionId: function(id) {
      this.extensionId = id
    },
    setSubscriptionId: function (id) {
      this.subscriptionId = id
    },
    setAdmin: function() {
      this.admin = true
    },
    setUserName: function (userName){
      this.userName = userName
    },
    isAdmin: function(){
      return this.admin
    },
    getUserId: function(){
      return this.id
    },
    getSubscriptionId: function(){
      return this.subscriptionId
    },
    getExtensionId: function(){
      return this.extensionId
    },
    getUserName: function(){
      return this.userName;
    },
    getPlatform: function(){
      return this.rc_platform.getSDKPlatform()
    },
    loadMainPage: function(req, res){
      var extId = this.getExtensionId()
      var query = "SELECT sub_id from vva_users WHERE ext_id=" + extId
      var thisUser = this
      pgdb.read(query, (err, result) => {
        if (!err){
          var row = result.rows[0]
          if (row['sub_id'] != ""){
            console.log("checkRegisteredSubscription")
            checkRegisteredSubscription(thisUser, null, row['sub_id'])
          }
        }
        res.render('main', {
          userName: this.getUserName(),
          userId: req.session.userId,
          extensionId: req.session.extensionId
        })
      });
    },
    loadSettingsPage: function(req, res){
      var settings = this.settings
      var thisUser = this
      this.rc_platform.getPlatform(function(err, p){
        if (p != null){
          p.get('/restapi/v1.0/account/~/extension', { perPage: 1000})
          .then(function(resp){
            var json = resp.json()
            var agents = []
            for (var ext of json.records){
              //console.log(JSON.stringify(ext))
              var agent = {}
              if (ext.status == "Enabled" && ext.hasOwnProperty("contact")){
                if (ext.id != thisUser.getExtensionId()){
                  agent['id'] = ext.id
                  agent['fullName'] = (ext.contact.firstName != undefined) ? ext.contact.firstName : ""
                  agent['fullName'] += (agent['fullName'] != "") ? " " : ""
                  agent['fullName'] += (ext.contact.lastName != undefined) ? ext.contact.lastName : ""
                  agents.push(agent)
                }
              }
            }
            //settings['categories'] = ["Authentication","Notification","Voice","Messaging","Configuration","Integration","Data"]
            agents.sort(sortAgentsAssend)
            settings['agents'] = agents
            thisUser.settings.agents = agents
            console.log(JSON.stringify(settings))
            res.render('settings', {
              userName: thisUser.getUserName(),
              userId: req.session.userId,
              extensionId: req.session.extensionId,
              settings: settings
            })
          })
          .catch (function(){
            settings['categories'] = []
            settings['agents'] = []
            res.render('settings', {
              userName: this.getUserName(),
              userId: req.session.userId,
              extensionId: req.session.extensionId,
              settings: settings
            })
          })
        }
      })
    },
    loadProcessItemPage: function(req, res){
      var extId = this.getExtensionId()
      var table = "voicemail_" + extId
      var query = "SELECT * from "+ table +" WHERE vm_id=" + req.query.id
      console.log("phoneNumber: " + req.query.phoneNumber)
      var thisUser = this
      pgdb.read(query, (err, result) => {
        if (!err){
          if (result.rows.length > 0){
            var row = result.rows[0]
            var p = thisUser.rc_platform.getPlatform(function(err, p){
              if (p != null){
                // read call log
                var recordingUri = p.createUrl(row['content_uri'], {addToken: true});
                row['content_uri'] = recordingUri
                thisUser.readCallLog(p, req.query.phoneNumber, function(err, result){
                  var missedCalls = []
                  var connectedCalls = []
                  var voicemail = []
                  if (!err){
                    for (var item of result) {
                      var m = {}
                      if (item['direction'] == "Inbound") {
                        m['icon'] = "img/CR_Out.png"
                      }else{
                        m['icon'] = "img/CR_In.png"
                      }
                      let options = {  month: 'short',day: 'numeric',year: 'numeric',hour: '2-digit',minute: '2-digit'}
                      var timestamp = new Date(item['time']).getTime()
                      var str = new Date(parseFloat(timestamp)).toLocaleDateString("en-US", options)

                      if (item['type'] == "Missed") {
                        str += ". Waiting time: " + formatCallDuration(item['duration'])
                        m['info'] = str
                        missedCalls.push(m)
                      }else if (item['type'] == "Call connected"){
                        str += ". Talking time: " + formatCallDuration(item['duration'])
                        m['info'] = str
                        connectedCalls.push(m)
                      }else if (item['type'] == "Voicemail"){
                        str += ". Duration: " + formatCallDuration(item['duration'])
                        m['info'] = str
                        voicemail.push(m)
                      }
                    }
                  }
                  table = "customer_" + extId
                  thisUser.readCustomerInfo(table, req.query.phoneNumber, (err, result) => {
                    res.render('processitem', {
                      userName: thisUser.getUserName(),
                      phoneNumber: thisUser.phoneNumbers[0],
                      customerInfo: result,
                      userId: req.session.userId,
                      extensionId: req.session.extensionId,
                      callInfo: row,
                      missedCalls: missedCalls,
                      connectedCalls: connectedCalls,
                      voicemail: voicemail
                    })
                  })
                })
              }else{
                res.redirect('/index')
              }
            })
          }
        }
      });
    },
    readCustomerInfo: function(customerTable, phoneNumber, callback){
      phoneNumber = phoneNumber.replace("+","").trim()
      var query = "SELECT email, address, ssn FROM " + customerTable + " WHERE phone_number='" + phoneNumber +"'"
      pgdb.read(query, (err, result) => {
        response = {}
        if (err){
          response['customer'] = false
          callback(null, response)
        }else{
          if (result.rows.length > 0){
            response['customer'] = true
            response['email'] = result.rows[0].email
            response['address'] = result.rows[0].address
            response['ssn'] = "XXX-XX-" + result.rows[0].ssn.substr(5, 9)
            callback(null, response)
          }else{
            response['customer'] = false
            callback(null, response)
          }
        }
      })
    },
    login: function(req, res, callback){
      var thisReq = req
      if (req.query.code) {
        var rc_platform = this.rc_platform
        var thisUser = this
        rc_platform.login(req.query.code, function (err, extensionId){
          if (!err){
            thisUser.setExtensionId(extensionId)
            req.session.extensionId = extensionId;
            callback(null, extensionId)
            var thisRes = res
            rc_platform.getPlatform(function(err, p){
              if (p != null){
                p.get('/account/~/extension/~/')
                .then(function(response) {
                  var jsonObj = response.json();
                  if (jsonObj.permissions.admin.enabled){
                    thisUser.setAdmin(true)
                  }
                  var fullName = jsonObj.contact.firstName + " " + jsonObj.contact.lastName
                  thisUser.setUserName(fullName)
                  engine.readPhoneNumber(thisUser, callback, thisRes)
                  // create dbs
                  thisUser.createTable("vva_users", "vva_users", function(err, res){
                    if (err)
                    console.log("create table failed")
                    thisUser.createTable("phonereputation", "phonereputation", function(err, res){
                      if (err)
                      console.log('phonereputation table created failed');
                      else
                      console.log("phonereputation table created")
                      number_analysis.createDemoPhoneReputation(function(err, result){
                        console.log("demo spam number created: " + result)
                      })
                      thisUser.createTable("customer", "customer_"+extensionId, function(err, res){
                        if (err)
                        console.log('customers table created failed');
                        else
                        console.log("customers table created")
                        thisUser.createTable("voicemail", "voicemail_"+extensionId, function(err, res){
                          if (err)
                          console.log('voicemail table created failed');
                          else
                          console.log("voicemail table created")
                          addFakeCustomersData("customer_"+extensionId)
                        })
                      })
                    })
                    var token = JSON.stringify(rc_platform.getTokenJson())
                    storeAccessToken(thisUser, token)
                    loadSettings(thisUser)
                  })
                })
                .catch(function(e) {
                  console.log("Failed")
                  console.error(e);
                });
              }else{
                console.log("CANNOT LOGIN")
              }
            })
          }else {
            console.log("USER HANDLER ERROR: " + thisUser.extensionId)
            callback("error", thisUser.extensionId)
          }
        })
      } else {
        res.send('No Auth code');
        callback("error", null)
      }
    },
    readPhoneNumber: function(thisUser, callback, thisRes){
      thisUser.rc_platform.getPlatform(function(err, p){
        if (p != null){
          thisUser.phoneNumbers = []
          var endpoint = '/account/~/extension/~/phone-number'
          p.get(endpoint, {
            "perPage": 100,
            /*"usageType": ["DirectNumber"]*/
          })
          .then(function(response) {
            var jsonObj =response.json();
            //console.log(JSON.stringify(jsonObj))
            var count = jsonObj.records.length
            for (var record of jsonObj.records){
              if (record.usageType == "DirectNumber"){
                if (record.type != "FaxOnly"){
                  for (var feature of record.features){
                    if (feature == "SmsSender" || feature == "InternationalSmsSender"){
                      thisUser.phoneNumbers.push(record.phoneNumber)
                      //break
                    }
                  }
                }
              }else if (record.usageType == "CompanyNumber"){
                if (record.type != "FaxOnly")
                thisUser.companyNumbers.push(record.phoneNumber)
              }
            }
            thisRes.send('login success');
          })
          .catch(function(e) {
            console.log("Failed")
            console.error(e.message);
            thisRes.send('login success');
          });
        }else{
          console.error(e.message);
          thisRes.send('login failed');
        }
      })

    },
    pollForVoiceMail: function(res){
      var response = {
        status: "ok",
        voicemail: []
      }
      if (this.newData){
        for (var vm of this.voiceMailMetaData){
          response.voicemail.push(vm)
        }
        this.newData = false
        this.voiceMailMetaData = []
      }
      res.send(response)
    },
    readVoiceMail: function(req, res){
      var query = "SELECT * FROM " + "voicemail_"+this.getExtensionId()
      var thisUser = this
      pgdb.read(query, (err, result) => {
        var response = {
          status: "ok",
          voicemail: [],
          agentList: thisUser.settings.agents,
          categoryList: thisUser.settings.categories,
          phoneReputation: {}
        }
        if (err){
          response.status = "failed"
          console.log("cannot read voicemail from db")
        }else{
          if (result.rows.length > 0){
            for (var row of result.rows){
              var reputation = unescape(row['phone_number_info'])
              var item = {
                id: row['vm_id'],
                event_type: row['event_type'],
                contentUri: row['content_uri'],
                fromNumber: row['from_number'],
                fromName: row['from_name'],
                toNumber: row['to_number'],
                toName: row['to_name'],
                date: row['date'],
                duration: row['duration'],
                transcript: row['transcript'],
                status: row['status'],
                confidence: row['confidence'],
                categories: row['categories'],
                processed: row['processed'],
                assigned: row['assigned'],
                reputation: JSON.parse(reputation)
              }
              response.voicemail.push(item)
            }
          }
        }
        res.send(response)
      })
    },
    saveSettings: function(req, res){
      console.log("save settings")
      this.settings.third_party_transcription = req.body.third_party_transcription
      this.settings.transcribe_spam = req.body.transcribe_spam
      this.settings.send_confirm_sms = req.body.send_confirm_sms
      this.settings.message = req.body.message
      this.settings.assigned_agents = JSON.parse(req.body.assigned_agents)
      updateUserSettings(this)
      res.send({"status":"ok","message":"saved"})
    },
    updateAgent: function(req, res){
      console.log("updateAgent")
      console.log(req.body.agent)
      var tableName = "voicemail_" + this.getExtensionId()
      var query = "UPDATE " + tableName + " SET assigned='" + req.body.agent + "' WHERE vm_id=" + req.body.id
      pgdb.update(query, (err, result) =>  {
        console.log("change agent")
        if (err){
          res.send({"status": "failed", "message":"Cannot change agent"})
        }else
        res.send({"status": "ok", "message":"Agent changed"})
      })
    },
    updateCategory: function(req, res){
      var tableName = "voicemail_" + this.getExtensionId()
      var query = "UPDATE " + tableName + " SET categories='" + req.body.category + "' WHERE vm_id=" + req.body.id
      pgdb.update(query, (err, result) =>  {
        console.log("change cat")
        if (err){
          res.send({"status": "failed", "message":"Cannot change category"})
        }else
        res.send({"status": "ok", "message":"Category changed"})
      })
  },
  setProcessed: function(req, res){
    var tableName = "voicemail_" + this.getExtensionId()
    var query = "UPDATE " + tableName + " SET processed=true WHERE vm_id=" + req.query.id
    console.log("Set processed: " + query)
    pgdb.update(query, (err, result) => {
      if (err){
        console.error(err.message);
      }
      console.log("processed set to true")
      res.send({"status":"ok","message":"This voicemail is processed."})
    })
  },
  deleteSelectedItems: function(req, res){
    var itemArr = JSON.parse(req.query.items)
    var tableName = "voicemail_" + this.getExtensionId()
    async.each(itemArr,
      function(id, callback){
        var query = "DELETE FROM " + tableName + " WHERE vm_id=" + id;
        pgdb.remove(query, function (err, result) {
          if (err){
            console.error(err.message);
          }
          callback(null, result)
        });
      },
      function (err){
        console.log("function err")
        res.send({"status":"ok", "message": "items deleted"})
      })
    },
    sendSmsMessage: function (req, res){
      console.log(req.body)
      this.rc_platform.getPlatform(function(err, p){
        if (p != null){
          var params = {
            from: {phoneNumber: req.body.from},
            to: [{phoneNumber: req.body.to}],
            text: req.body.text
          }
          p.post('/account/~/extension/~/sms', params)
          .then(function (response) {
            var jsonObj = response.json()
            console.log("sent SMS")
            res.send({"status":"ok","message":"Sent"})
          })
          .catch(function(e){
            console.log(e.message)
            res.send({"status":"failed","message":"Cannot send SMS"})
          })
        }
      })
    },
    processVoicemailNotification: function(body){
      this.newData = false
      var item = {}
      item['event_type'] = "VoiceMail"
      console.log(JSON.stringify(body))
      if (body.from.hasOwnProperty("phoneNumber")){
        item['fromNumber'] = body.from.phoneNumber
        if (body.from.hasOwnProperty('name'))
        item['fromName'] = body.from.name
        else
        item['fromName'] = "Unknown"
      }else{ // For demo purpose, if "from.phoneNumber" is missing, use predefined spam numbers
        if (index >= samplePhoneNumber.length)
        index = 0
        item['fromNumber'] = samplePhoneNumber[index]
        item['fromName'] = "Unknown"
        index++
      }

      item['numberType'] = "unknown"
      item['toNumber'] = body.to[0].phoneNumber
      item['toName'] = body.to[0].name
      var timestamp = new Date(body.lastModifiedTime).getTime()
      item['date'] = timestamp
      item['id'] = body.id

      for (var attachment of body.attachments){
        if (attachment.type == "AudioRecording"){
          item['duration'] = attachment.vmDuration
          item['contentUri'] = attachment.uri
          var fileName = "attachments/"
          if (attachment.contentType == "audio/mpeg")
            fileName += body.id + ".mp3"
          else
            fileName += body.id + ".wav"

          // don't need to write file for now. Consider to upload to AWS S3 bucket!
          /*
          //item['contentUri'] = fileName
          this.rc_platform.getPlatform(function(err, p){
            if (p != null){
              var recordingUrl = p.createUrl(attachment.uri, {addToken: true});
              p.get(attachment.uri)
                .then(function(res) {
                  return res.response().buffer();
                })
                .then(function(buffer) {
                  fs.writeFile(fileName, buffer, function(){
                  //
                })
              })
              .catch(function(e){
                console.log(e)
              })
            }
          })
          */
          break
        }
      }
      var thisUser = this
      var table = "customer_" + thisUser.getExtensionId()
      number_analysis.isCustomerPhoneNumber(table, item.fromNumber, function(err, result){
        if (result.customer == true) {
          console.log("Dont need to detect scam. Call transcription")
          item['fromName'] = result.fullName
          item['numberType'] =result.number_type
          item['reputation'] = makeCustomerNumberReputationObject()
          if (thisUser.settings.third_party_transcription){
            thisUser.transcribeVoicemail(item)
          }else{ // use RC transcription
            thisUser.useRingCentralTranscription(body, item)
          }
        }else{
          number_analysis.spamNumberDetectionLocal(item.fromNumber, function(err, result){
            if (err){
              number_analysis.spamNumberDetectionRemote(item.fromNumber, function(err, result){
                if (err){
                  console.log("cannot detect phone reputation")
                }else{
                  if (result['score'] > 651 && thisUser.settings.transcribe_spam == false){
                    console.log("Scam! Don't waste money to do transcription or to detect urgency.")
                    item['transcript'] = "N/A"
                    item['categories'] = "N/A"
                    item['reputation'] = result
                    item['status'] = "NotUrgent"
                    item['confidence'] = 0
                    item['assigned'] = "Unassigned"
                    thisUser.voiceMailMetaData.push(item)
                    thisUser.newData = true
                    thisUser.addVoicemailToDB("voicemail_"+thisUser.getExtensionId(), item)
                  }else{
                    item['reputation'] = result
                    console.log("use 3rd party transcription service")
                    if (thisUser.settings.third_party_transcription){
                      thisUser.transcribeVoicemail(item)
                    }else{ // use RC transcription
                      thisUser.useRingCentralTranscription(body, item)
                    }
                  }
                }
              })
            }else{
              if (result['score'] > 651 && thisUser.settings.transcribe_spam == false){
                console.log("Scam! Don't waste money to do transcription or to detect urgency.")
                item['transcript'] = "N/A"
                item['categories'] = "N/A"
                item['reputation'] = result
                item['status'] = "NotUrgent"
                item['confidence'] = 0
                item['assigned'] = "Unassigned"
                thisUser.voiceMailMetaData.push(item)
                thisUser.newData = true
                thisUser.addVoicemailToDB("voicemail_"+thisUser.getExtensionId(), item)
              }else{
                item['reputation'] = result
                console.log("use 3rd party transcription service")
                if (thisUser.settings.third_party_transcription){
                  thisUser.transcribeVoicemail(item)
                }else{ // use RC transcription
                  thisUser.useRingCentralTranscription(body, item)
                }
              }
            }
          })
        }
      })
  },
  useRingCentralTranscription: function(body, item){
    if (body.vmTranscriptionStatus == "Completed")
    this.readVoicemailTranscript(body.attachments, item)
    else{
      this.transcribeVoicemail(item)
    }
  },
  createVoicemailUri: function(req, res){
    var p = this.rc_platform.getPlatform(function(err, p){
      if (p != null){
        var recordingUri = p.createUrl(req.query.uri, {addToken: true});
        res.send({"status":"ok", "uri": recordingUri})
      }
    })
  },
  updatePhoneReputationDB: function(req, res){
    var reputation = {
      level: "high",
      score: 900,
      recommendation: "block",
      source: "Spam"
    }
    number_analysis.addPhoneReputation(req.query.number, reputation)
    var response = {
      status: "ok",
      message: "Added"
    }
    res.send(response)
  },
  updatePhoneSource: function(req, res){
    if (req.body.source == "Spam"){
      var reputation = {
        level: "high",
        score: 900,
        recommendation: "block",
        source: "Spam"
      }
      number_analysis.addPhoneReputation(req.body.phone_number, reputation)
      var response = {
        status: "ok",
        message: "Added"
      }
      res.send(response)
    }else{
      var customerTable = "customer_"+this.getExtensionId()
      var vmTable = "voicemail_"+this.getExtensionId()
      var q = "SELECT count(*) FROM " + customerTable
      pgdb.read(q, function(err, result) {
        var count = parseInt(result.rows[0].count)
        var value = [count+1, req.body.firstName,req.body.lastName,req.body.phone_number, "mobile"]
        var query = "INSERT INTO " + customerTable + " (customer_id, first_name, last_name, phone_number, phone_number_type)"
        query += " VALUES ($1, $2, $3, $4, $5)"
        query += " ON CONFLICT (customer_id) DO NOTHING"
        console.log(query)
        pgdb.insert(query, value, (err, result) =>  {
          if (err){
            console.error(err.message);
          }
          console.log("customer added" + result)
          var name = req.body.firstName + " " + req.body.lastName
          var phone_number_info = {
            level: "Clean",
            score: 0,
            recommendation: "allow",
            source: "Customer"
            }
          query = "UPDATE " + vmTable + " SET phone_number_info='" + JSON.stringify(phone_number_info) + "', from_name='" + name + "', from_number='" + req.body.phone_number + "', number_type='mobile' WHERE vm_id=" + req.body.id
          console.log(query)
          pgdb.update(query, (err, result) =>  {
            if (err){
              console.error(err.message);
            }
            console.log("update customer: " + result)
            var response = {
              status: "ok",
              message: "Added"
            }
            res.send(response)
          })
        })
      })
    }
  },
  transcribeVoicemail: function(item){
    var thisUser = this
    this.rc_platform.getPlatform(function(err, platform){
      if (platform != null){
        var recordingUrl = platform.createUrl(item['contentUri'], {addToken: true});
        transcriptionist.transcribe(recordingUrl, function(err, transcript){
          if (err){
            console.log(err)
          }else{
            var wordArr = transcript.split(" ")
            item['transcript'] = transcript
            if (wordArr.length > 10 && item.reputation.score < 401){
              thisUser.analyzeVoicemail(item)
            } else { // no transcription or message is too short
              item['status'] = 'NotUrgent'
              item['confidence'] = 0
              item['categories'] = "N/A"
              item['assigned'] = "Unassigned"
              thisUser.voiceMailMetaData.push(item)
              thisUser.newData = true
              // save data to vm db
              thisUser.addVoicemailToDB("voicemail_"+thisUser.getExtensionId(), item)
            }
          }
        })
      }
    })
  },
  readVoicemailTranscript: function(attachments, item){
    var thisUser = this
    this.rc_platform.getPlatform(function(err, p){
      if (p != null){
        for (var attachment of attachments){
          if (attachment.type == "AudioTranscription"){
            p.get(attachment.uri)
            .then(function(res) {
              return res.response().buffer();
            })
            .then(function(buffer) {
              var transcript =  buffer.toString()
              item['transcript'] = transcript
              var wordArr = transcript.split(" ")
              if (wordArr.length > 10 && item.reputation.score < 401){
                thisUser.analyzeVoicemail(item)
              } else { // no transcription or message is too short
                item['status'] = 'NotUrgent'
                item['confidence'] = 0
                item['categories'] = "N/A"
                item['assigned'] = "Unassigned"
                thisUser.voiceMailMetaData.push(item)
                thisUser.newData = true
                // save data to vm db
                thisUser.addVoicemailToDB("voicemail_"+thisUser.getExtensionId(), item)
              }
            })
            .catch(function(e){
              console.log(e)
            })
            break
          }
        }
      }
    })
  },
  analyzeVoicemail: function (item){
    var thisUser = this
    content_analysis.classifyUrgency(item.transcript, function(err, result){
      item['status'] = result['status']
      item['confidence'] = result['confidence']
      if (item.fromNumber != "Unknown"){
        if (thisUser.settings.send_confirm_sms){
          if (item.numberType == "mobile"){
            replySmsMessage(thisUser, item.fromNumber, item.id)
          }else{
            number_analysis.detectMobileNumberRemote(item.fromNumber, function(err, result){
              if (!err){
                item.numberType = result
                if (result == "mobile"){
                  replySmsMessage(thisUser, item.fromNumber, item.id)
                }
              }
            })
          }
        }
      }
      // identify category and assign to relevant agent
      content_analysis.classifyCategory(item.transcript, function(err, result){
        if (result){
          item['categories'] = result.category
          var agentName = "Unassigned"
          for (agent of thisUser.settings.assigned_agents){
            for (var cat of agent.category){
              if (cat == result.category){
                var table = "voicemail_" + agent.id
                agentName = agent.name
                item['assigned'] = agent.name
                thisUser.addSupportCaseToAgentDB(table, item)
                if (item.status == "Urgent" && item.confidence > 6){
                  var text = "You have an urgent callback request from " + item.fromNumber  + "\n"
                  text += (item.transcript.length < 150) ? item.transcript : item.transcript.substr(0, 150)
                  notifyAgentBySmsMessage(thisUser, agent.id, text)
                }else{
                  console.log("Not urgent. No need to alert an agent")
                }
                break;
              }
            }
          }
          // save data to vm db
          item['assigned'] = agentName
          thisUser.addVoicemailToDB("voicemail_"+thisUser.getExtensionId(), item)
          thisUser.voiceMailMetaData.push(item)
          thisUser.newData = true
        }else
        console.log("classifyCategory failed.")
      })
    })
  },
  readCallLog: function (platform, phoneNumber, callback){
    var date = new Date()
    var time = date.getTime()
    var less5Days = time - (84600 * 7 * 1000)
    var from = new Date(less5Days)
    var dateFrom = from.toISOString()

    var params = {}
    params['type'] = 'Voice'
    params['phoneNumber'] = phoneNumber.trim()
    params['dateFrom'] = dateFrom.replace('/', ':')

    var recordingId = ""
    platform.get('/account/~/extension/~/call-log', params)
    .then(function(resp){
      var json = resp.json()
      var result = []
      if (json.records.length > 0){
        for (var record of json.records){
          var item = {
            "direction":record.direction,
            "duration": record.duration,
            "type": record.result,
            "time": record.startTime
          }
          result.push(item)
        }
        callback(null, result)
      }else {
        console.log("No log");
        callback(null, [])
      }
    })
    .catch(function(e){
      callback(e, [])
    })
  },
  createTable: function (table, tableName, callback) {
    console.log("CREATE TABLE: " + table)
    pgdb.create_table(table, tableName, (err, res) => {
      if (err) {
        console.log(err, res)
        callback(err, err.message)
      }else{
        console.log("DONE")
        callback(null, "Ok")
      }
    })
  },
  addSupportCaseToAgentDB: function(tableName, item){
    var thisUser = this
    this.createTable("voicemail", tableName, function(err, res){
      if (err)
      console.log('voicemail table created failed');
      else
      console.log("voicemail table created")
      console.log("addSupportCaseToAgentDB")
      thisUser.addVoicemailToDB(tableName, item)
    })
  },
  addVoicemailToDB: function (tableName, item){
    console.log(JSON.stringify(item.reputation))
    var query = "INSERT INTO " + tableName + " VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)"
    var values = [item.id, item.date, item.fromNumber, item.fromName, item.numberType, item.toNumber, item.toName, item.contentUri, item.duration, item.transcript, item.status, item.confidence, JSON.stringify(item.reputation), false, item.event_type, item.categories, item.assigned]
    query += " ON CONFLICT DO NOTHING"
    console.log("voicemail: " + query)
    pgdb.insert(query, values, (err, result) =>  {
      if (err){
        console.error(err.message);
      }
      console.log("stored voicemail to db")
    })
  }
}
  module.exports = User;
  ///
  function formatCallDuration(dur){
    var duration = ""
    if (dur > 3600){
      var h = Math.floor(dur / 3600)
      dur = dur % 3600
      var m = Math.floor(dur / 60)
      m = (m>9) ? m : ("0" + m)
      dur = dur % 60
      var s = (dur>9) ? dur : ("0" + dur)
      return h + ":" + m + ":" + s
    }else if (dur > 60){
      var m = Math.floor(dur / 60)
      dur %= 60
      var s = (dur>9) ? dur : ("0" + dur)
      return m + ":" + s
    }else{
      var s = (dur>9) ? dur : ("0" + dur)
      return "0:" + s
    }
  }

  function makeCustomerNumberReputationObject(){
    var reputation = {
      level: "Clean",
      score: 0,
      recommendation: "allow",
      source: "Customer"
    }
    return reputation
  }

  function replySmsMessage(thisUser, customerNumber, referenceNumber){
    thisUser.rc_platform.getPlatform(function(err, p){
      if (p != null){
        var text = thisUser.settings.message
        text += ". Here is your case reference number " + referenceNumber
        var params = {
          from: {'phoneNumber': thisUser.phoneNumbers[0]},
          to: [{'phoneNumber': customerNumber }],
          text: text
        }
        p.post('/account/~/extension/~/sms', params)
        .then(function (response) {
          var jsonObj = response.json()
          console.log("Replied to customer via SMS with case number.")
        })
        .catch(function(e){
          console.log(e.message)
        })
      }
    })
  }

  function postMessageToGroup(source){
    var https = require('https');
    var title = "There is an urgent callback request from " + source['fromNumber']  + "\n"
    var transcript = source['transcript']
    // : source['transcript'].substr(0, 150)
    var body = {
      "icon": "http://tinyurl.com/pn46fgp",
      "activity": "Callback request",
      "title": title,
      "body": transcript
    }
    var data = JSON.stringify(body)
    var post_options = {
      host: "hooks-glip.devtest.ringcentral.com",
      path: "/webhook/v2/e4badd38-b9ee-4e96-a805-6fef38bbe8d8",
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    }
    var post_req = https.request(post_options, function(res) {
      var response = ""
      res.on('data', function (chunk) {
        response += chunk
      });
      res.on("end", function(){
        console.log(response)
      });
    });

    post_req.write(data);
    post_req.end();
  }

  function notifyAgentBySmsMessage(thisUser, extensionId, text){
    console.log("notifyAgentBySmsMessage")
    thisUser.rc_platform.getPlatform(function(err, p){
      if (p != null){
        var params = {
          from: {extensionId: thisUser.getExtensionId().toString()},
          to: [{extensionId: extensionId.toString()}],
          text: text
        }
        p.post('/account/~/extension/~/company-pager', params)
        .then(function (response) {
          var jsonObj = response.json()
          console.log("Notified an agent via SMS")
        })
        .catch(function(e){
          console.log(e.message)
        })
      }
    })
  }

  function sortAgentsAssend(a, b) {
    return a.fullName - b.fullName;
  }

  function sortVoicemailUrgency(a, b) {
    return b.confidence - a.confidence;
  }

  function storeAccessToken(thisUser, token){
    var query = "INSERT INTO vva_users (ext_id, access_token, sub_id, settings)"
    query += " VALUES ($1, $2, $3, $4)"
    var values = [thisUser.getExtensionId(), token, "", JSON.stringify(thisUser.settings)]
    query += " ON CONFLICT (ext_id) DO UPDATE SET access_token = '" + token + "'"
    console.log("TOKEN: " + query)
    pgdb.insert(query, values, (err, result) =>  {
      if (err){
        console.error(err.message);
      }
      console.log("save token: " + result)
    })
  }

  function loadSettings(thisUser){
    var query = "SELECT settings FROM vva_users WHERE ext_id=" + thisUser.getExtensionId()
    pgdb.read(query, (err, result) => {
      if (err){
        console.error(err.message);
      }
      if (!err && result.rows.length > 0){
        //console.log(result.rows[0].settings)
        var jsonObj = JSON.parse(result.rows[0].settings)
        thisUser.settings.third_party_transcription = (jsonObj.third_party_transcription == "true")
        thisUser.settings.transcribe_spam = (jsonObj.transcribe_spam == "true")
        thisUser.settings.send_confirm_sms =  (jsonObj.send_confirm_sms == "true")
        thisUser.settings.message = jsonObj.message
        thisUser.settings.agents = jsonObj.agents
        thisUser.settings.assigned_agents = jsonObj.assigned_agents
      }
    })
  }

  function updateUserSettings(thisUser){
    var settings = JSON.stringify(thisUser.settings).replace("'", "''")
    console.log(settings)
    var query = "UPDATE vva_users SET settings='" + settings + "' WHERE ext_id=" + thisUser.getExtensionId()
    pgdb.update(query, (err, result) =>  {
      if (err){
        console.error(err.message);
      }
      console.log("settings updated")
    })
  }
  // create test customer db
  function addFakeCustomersData(table){
    var data = [
      [1,	"Smith","Brown","19165464387","landline","smith.brown@gmail.com", "206 E Washington Ave. Sunnyvale CA-94087", "174238712", 1],
      [2,	"James","Bond","16502245476","mobile","james.bond@yahoo.com", "902 Whisman Road. Mountain View CA-94043", "434431752", 1],
      [3,	"Daniel","Cuello","17242680235","landline","dcuello@gmail.com", "1 Simpson Dr. San Jose CA-95123", "003417893", 4],
      [4,	"Martin","Cooper","16504281183","landline","martin.cooper@gmail.com", "334 California Ave. San Francisco CA-92134", "803562056", 1],
      [5,	"Mike","Mahony","4085942101","landline","mike.mahony@gmail.com", "23 Embacadero Blvd. San Francisco CA-2134", "123938444", 3],
      [6, "Francisco","Rincon","16505130930", "mobile","francisco.rincon@gmail.com", "76 5th Ave. New York NY-11111", "143553290", 2],
      [7, "Anna","Madisson","19165464387", "mobile","anna.madisson@gmail.com", "134 George Ave. Cambridge MA-31354", "424050356", 5],
      [8, "Mike","Madisson","16508498071", "mobile","mike.madisson@gmail.com", "134 George Ave. Cambridge MA-31354", "342056356", 1]
    ]

    for (var values of data){
      var query = "INSERT INTO " + table + " (customer_id, first_name, last_name, phone_number, phone_number_type, email, address, ssn, level)"
      query += " VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)"
      query += " ON CONFLICT (customer_id) DO NOTHING"
      pgdb.insert(query, values, (err, result) =>  {
        if (err){
          console.error(err.message);
        }
      })
    }
  }
