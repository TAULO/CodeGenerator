var mongo = require('mongodb');
var MongoClient = mongo.MongoClient
var crypto = require('crypto');
var cloud = require('../../test')
var config = require('../../config')
var uploadimg = require('./../imageuploader')
var bodyParser = require('body-parser');
var plivo = require('plivo');
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'a13I11ET23';
var time = new Date()


var checkHours = 15
var checkMinutes = 30
var checkHours2 = 23
var n = time.toLocaleTimeString()
// console.log(hours)
function disabledchat(student, stuId) {
    var hours = parseInt(new Date().getHours())
    var mins = parseInt(new Date().getMinutes())
    // console.log('dif '+hours+":"+mins)
    if ((hours > 17 ) || (hours < 9) || (hours === 17 && (mins > 30)) || (hours === 9 && (mins < 30))) {
        // console.log(hours+":"+mins)

        var ObjectId = mongo.ObjectId
        var _id = new ObjectId(stuId)
        var userS = []
        student.findOne({"_id": _id}, function (err5, res5) {
            if (err5 === null) {
                if (res5 !== null) {
                    for (var i = 0; i < res5.regTokens.length; i++)
                        userS.push(res5.regTokens[i])
                    var msg = 'Sorry, I am available from 3pm to 11pm IST. Feel free to ping me then \uD83D\uDE42 Thank you.'
                    cloud.send(userS, msg, 1, 1)

                }
            }
        })


    }
}

function encrypt(buffer) {
    //return buffer;
    var cipher = crypto.createCipher(algorithm, password)
    var crypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
    return crypted;
}

function decrypt(buffer) {
    // return buffer
    var decipher = crypto.createDecipher(algorithm, password)
    var dec = Buffer.concat([decipher.update(buffer), decipher.final()]);
    return dec;
}
function firstEntry(req, res, mess, teach, student, admin) {

    // console.log("cofse")
    var findCheck = {"stuId": req.body.stuId, "subId": req.body.subId};
    var cursor = mess.find(findCheck).sort({sendTime: -1}).limit(1)
    var count = 0
    var insertDocument;
    cursor.each(function (err, item) {
        // console.log(item)
        if (err === null) {

            if (count++ == 0) {
                // console.log("check")
                if (item != null) {

                    //check conditions
                    if ((item.iStatus === "unassigned")) {
                        var attachment
                        if ((req.body.attachment === ' ') || (req.body.attachment.length == 0))
                            attachment = ''
                        else {

                            attachment = req.body.attachment
                            //  uploadimg.upload(attachment,req.body.attachment)
                        }
                        insertDocument =
                        {
                            "iStatus": "unassigned",
                            "stuId": req.body.stuId,
                            "msg": req.body.msg,
                            "teachId": "",
                            "firstName": req.body.firstName,

                            "subId": req.body.subId,
                            "localTime": req.body.localTime,
                            "attachment": attachment,
                            "extension": req.body.extension,
                            "seenTime": "",


                            "sendTime": new Date().getTime().toString(),
                            "intId": item.intId,
                            "msgBy": req.body.msgBy
                        }
                    }
                    else if (item.iStatus === "inactive") {
                        var attachment

                        // console.log("diggo"+req.body.attachment.length)
                        if ((req.body.attachment === ' ') || (req.body.attachment.length == 0))
                            attachment = ' '
                        else {
                            attachment = req.body.attachment
                            // uploadimg.upload(attachment,req.body.attachment)
                        }
                        insertDocument =
                        {
                            "iStatus": "unassigned",
                            "stuId": req.body.stuId,
                            "msg": req.body.msg,
                            "firstName": req.body.firstName,
                            "teachId": "",
                            "localTime": req.body.localTime,
                            "subId": req.body.subId,
                            "attachment": attachment,
                            "extension": req.body.extension,
                            "seenTime": "",

                            "sendTime": new Date().getTime().toString(),
                            "intId": req.body.stuId + new Date().getTime().toString(),
                            "msgBy": req.body.msgBy
                        }

                    }


                }
                else {
                    var attachment

                    // console.log("diggo"+req.body.attachment.length)
                    if ((req.body.attachment === ' ') || (req.body.attachment.length == 0))
                        attachment = ' '
                    else {

                        attachment = req.body.attachment
                        //   uploadimg.upload(attachment,req.body.attachment)
                        // uploadimg.upload(req.body.attachment)
                        // attachment="https://myimageping.s3.ap-south-1.amazonaws.com/"+req.body.stuId+new Date().getTime().toString()
                    }
                    insertDocument = {
                        "iStatus": "unassigned",
                        "stuId": req.body.stuId,
                        "msg": req.body.msg,
                        "teachId": "",
                        "subId": req.body.subId,
                        "firstName": req.body.firstName,

                        "attachment": attachment,
                        "extension": req.body.extension,
                        "seenTime": "",
                        "localTime": req.body.localTime,


                        "sendTime": new Date().getTime().toString(),
                        "intId": req.body.stuId + new Date().getTime().toString(),
                        "msgBy": req.body.msgBy
                    }
                }

                var coins = 0;
                var lenghtmsg = req.body.msg.length
                coins = lenghtmsg
                var lenghtimg = 0;
                if ((req.body.attachment !== null) && (req.body.attachment !== undefined) && (req.body.attachment.length !== 0))
                    coins = 200

                var ObjectId = mongo.ObjectId
                var _id = new ObjectId(req.body.stuId)
                student.findAndModify({'_id': _id}, [], {$inc: {'coins': coins * -1}}, {new: true}, function (error, document) {
                    if (error === null) {
                        // console.log(document)

                        {
                            mess.insert(insertDocument, function (err, result) {
                                if (err === null) {

                                    var userS = []

                                    var teacher = db.collection('teacherDetails');
                                    var checkSum = 0;
                                    //add subid
                                    var cursorT = teach.find({"availStatus": "active", subIds: req.body.subId})
                                    cursorT.each(function (err, item) {
                                        if (err === null) {
                                            {
                                                checkSum++;
                                                if (item !== null) {
                                                    // console.log(item.regTokens)
                                                    console.log(item.teachId)
                                                    if (item.regTokens !== undefined && (item.regTokens !== null)) {
                                                        for (var i = 0; i < item.regTokens.length; i++) {
                                                            // console.log("digo"+item.regTokens[i])
                                                            userS.push(item.regTokens[i])
                                                        }
                                                    }


                                                }
                                                else {
                                                    {

                                                        var dataa = []
                                                        //  dataa.push({"coins":document.value.coins})
                                                        result.ops[0]['coins'] = document.value.coins
                                                        result.ops[0]['grade'] = document.value.grade
                                                        console.log(result.ops[0])
                                                        dataa.push(result.ops[0])
                                                        var msg =
                                                        {
                                                            "status": "success",
                                                            "msg": "Message sent",
                                                            "data": result.ops[0]
                                                        }
                                                        res.send(msg);


                                                        var cursoradmin = admin.find();
                                                        var admindata = []
                                                        cursoradmin.each(function (error, item) {
                                                            if (error === null) {

                                                                if (item !== null) {
                                                                    if (item.regTokens !== undefined && item.regTokens !== null) {
                                                                        for (var i = 0; i < item.regTokens.length; i++) {
                                                                            admindata.push(item.regTokens[i])
                                                                            // console.log(item.regTokens[i])
                                                                            // console.log(admindata)
                                                                        }
                                                                    }
                                                                }
                                                                else {
                                                                    // console.log(admindata)
                                                                    cloud.send(admindata, dataa, 0, 3)
                                                                }

                                                            }

                                                        })
                                                        cloud.send(userS, dataa, 1, 0)
                                                        disabledchat(student, req.body.stuId)
                                                        //admin cloud.send(admin,dataa)


                                                        // console.log("bas"+userS)
                                                    }

                                                }
                                            }
                                        }
                                    })
                                    //to here


                                    //

                                    //api call

                                }
                                else {
                                    var msg = {"status": "error", "msg": "Something went wrong"}
                                    res.send(msg);

                                }

                            })

                        }

                    }
                    else {
                        res.send({'status': 'error', 'msg': 'Something went wrong.1'})
                    }

                })

            }


        }

    })

//check last message if it is unassigned then copy interaction id ,if it is active then also else create new interaction id


}

var jsonParser = bodyParser.json();
var message = {
    sendnew: function (req, res) {
        var Server = mongo.Server,
            Db = mongo.Db,
            BSON = mongo.BSONPure;
        var host = config.development.database.host
        var port = config.development.database.port
        var dbname = config.development.database.db
        var server = new Server(host, port, {auto_reconnect: true});
        db = new Db(dbname, server);
        var api = plivo.RestAPI({
            authId: 'MAYJVLZGU4Y2JMODVLNJ',
            authToken: 'ODEyZjFiZTE1ZGExMDJiOWFiNDgyNGIzZGEzN2Zj',
        });


        MongoClient.connect(host, function (err, db) {

            if (!err) {


                // console.log("Connected to 'signup' database");
                db.collection('message', {strict: true}, function (err, collection) {
                    if (err) {

                        console.log("The otp collection doesn't exist. Creating it with sample data...");

                    }
                    else {
                        var mess = db.collection('message');
                        var findInt = {"stuId": req.body.stuId, "subId": req.body.subId, "iStatus": "active"};
                        console.log('subjec id is ' + req.body.subId)

                        mess.findOne(findInt, function (errors, doc) {
                            if (errors === null) {
                                if (doc === null) {
                                    //if time check here then only
                                    firstEntry(req, res, db.collection('message'), db.collection('teacherDetails'), db.collection('digo'), db.collection('adminDetails'))
//insert


                                }
                                else {
                                    var mess = db.collection('message');
                                    var teacherTime = 0;
                                    var checkTeacher = 0;
                                    var check = 0;
                                    var findCheck = {
                                        "stuId": req.body.stuId,
                                        'subId': req.body.subId,
                                        "iStatus": "active",
                                        "msgBy": "1"
                                    };
                                    var resultteacher = mess.find(findCheck).sort({sendTime: -1}).limit(1)
                                    resultteacher.each(function (err, item) {
                                        if (err === null) {
                                            if (check++ == 0) {
                                                if (item !== null) {

                                                    teacherTime = parseInt(item.sendTime)
                                                    // console.log("check2"+teacherTime)
                                                    var difference = new Date().getTime() - teacherTime;
                                                    // console.log(difference)

                                                    if (difference <= 10 * 60 * 1000) {

                                                        {

                                                            var attachment

                                                            // console.log("diggo"+req.body.attachment.length)
                                                            if ((req.body.attachment === ' ') || (req.body.attachment.length == 0))
                                                                attachment = ' '
                                                            else {

                                                                attachment = req.body.attachment
                                                                //  uploadimg.upload(attachment,req.body.attachment)
                                                                // uploadimg.upload(req.body.attachment)
                                                                // attachment="https://myimageping.s3.ap-south-1.amazonaws.com/"+req.body.stuId+new Date().getTime().toString()
                                                            }
                                                            var ins = {
                                                                "stuId": req.body.stuId,
                                                                "msg": req.body.msg,
                                                                "teachId": item.teachId,
                                                                "firstName": req.body.firstName,
                                                                "subId": req.body.subId,
                                                                "attachment": attachment,
                                                                "extension": req.body.extension,
                                                                "seenTime": "",
                                                                "localTime": req.body.localTime,
                                                                "sendTime": new Date().getTime().toString(),
                                                                "intId": doc.intId,
                                                                "msgBy": req.body.msgBy,
                                                                "iStatus": "active"

                                                            }
                                                            var coins = 0;
                                                            var lenghtmsg = req.body.msg.length
                                                            coins = lenghtmsg
                                                            var lenghtimg = 0;
                                                            if ((req.body.attachment !== null) && (req.body.attachment !== undefined) && (req.body.attachment.length !== 0))
                                                                coins = 200
                                                            var stu = db.collection('digo')
                                                            var ObjectId=mongo.ObjectId
                                                            var _id = new ObjectId(req.body.stuId)
                                                            stu.findAndModify({'_id': _id}, [], {$inc: {'coins': coins * -1}}, {new: true}, function (error, document) {
                                                                if (error === null) {
                                                                    {
                                                                        mess.insert(ins, function (err, result) {
                                                                            if (err === null) {
                                                                                // console.log(result)
                                                                                // var userS=[]
                                                                                //insert teacher tokens
                                                                                //userS.push('e8k3CgDPZpA:APA91bGx5-RGIvI1XHO63pdZ1HLltuqdpjafWQz01HfmyhZC-1qCLwCwqSeRCsVWCvoYXmdrH9bbYwXiruqhJadHJYjqBlqT2rBjMKrjlJNvM3wiJzaG8KytJjQd6Xfx7IPu1Gn-cGdR')
                                                                                var userS = []
                                                                                //insert teacher tokens
                                                                                var teacher = db.collection('teacherDetails');
                                                                                var d = item.teachId

                                                                                teacher.findOne({
                                                                                    "teachId": d,
                                                                                    subIds: req.body.subId
                                                                                }, function (err5, res5) {
                                                                                    if (err5 === null) {

                                                                                        if (res5 !== null) {
                                                                                            console.log(res5.teachId)
                                                                                            if (res5.regTokens !== undefined && (res5.regTokens !== null)) {
                                                                                                for (var i = 0; i < res5.regTokens.length; i++)
                                                                                                    userS.push(res5.regTokens[i])
                                                                                            }

                                                                                            var dataa = []
                                                                                            // dataa.push({"coins":document.value.coins})
                                                                                            result.ops[0]['coins'] = document.value.coins
                                                                                            result.ops[0]['grade'] = document.value.grade
                                                                                            dataa.push(result.ops[0])
                                                                                            var admin = db.collection('adminDetails')


                                                                                            var admindata = []
                                                                                            var cursoradmin = admin.find();
                                                                                            cursoradmin.each(function (error, item) {
                                                                                                if (error === null) {
                                                                                                    if (item !== null) {
                                                                                                        if (item.regTokens !== undefined && item.regTokens !== null) {
                                                                                                            for (var i = 0; i < item.regTokens.length; i++) {
                                                                                                                admindata.push(item.regTokens[i])
                                                                                                                // console.log(item.regTokens[i])
                                                                                                                // console.log(admindata)
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                    else {
                                                                                                        // console.log(admindata)
                                                                                                        cloud.send(admindata, dataa, 0, 3)
                                                                                                    }

                                                                                                }

                                                                                            })
                                                                                            cloud.send(userS, dataa, 0, 0)
                                                                                            // disabledchat(db.collection('digo'),req.body.stuId)
                                                                                            //admin cloud.send(admin,dataa)


                                                                                            var msg = {
                                                                                                "status": "success",
                                                                                                "msg": "Message sent",
                                                                                                "data": result.ops[0],
                                                                                                'coins': document.value.coins,
                                                                                                'grade': document.value.grade
                                                                                            }
                                                                                            res.send(msg);
                                                                                        }
                                                                                        else {
                                                                                            var msg = {
                                                                                                "status": "error",
                                                                                                "msg": "error"
                                                                                            }
                                                                                            res.send(msg);
                                                                                        }
                                                                                    }
                                                                                })

                                                                            }
                                                                            else {
                                                                                var msg = {
                                                                                    "status": "error",
                                                                                    "msg": "Oops something went wrong"
                                                                                }
                                                                                res.send(msg);

                                                                            }

                                                                        })

                                                                    }

                                                                }
                                                                else {
                                                                    res.send({
                                                                        'status': 'error',
                                                                        'msg': 'Something went wrong.'
                                                                    })
                                                                }

                                                            })

                                                            // consolensole.log(doc)
                                                        }
                                                    }
                                                    else {
                                                        {
                                                            //find and modify all
                                                            var findInt = {
                                                                "stuId": req.body.stuId,
                                                                'subId': req.body.subId,
                                                                "iStatus": "active"
                                                            };
                                                            mess.updateMany(findInt, {$set: {"iStatus": "inactive"}}, function (errr, resss) {
                                                                if (errr === null) {
                                                                    var teachDb = db.collection("teacherDetails");
                                                                    //add subid
                                                                    teachDb.update({
                                                                        "teachId": item.teachId,
                                                                        subIds: req.body.subId
                                                                    }, {$set: {"availStatus": "active"}}, function (error1, result1) {
                                                                        if (error1 === null) {
                                                                            // console.log("yahoo"+item.teachId)
                                                                            firstEntry(req, res, mess, db.collection('teacherDetails'), db.collection('digo'), db.collection('adminDetails'))


                                                                        }
                                                                    })


                                                                }
                                                                else {
                                                                    var msg = {
                                                                        "status": "error",
                                                                        "msg": "Oops something went wrong"
                                                                    }
                                                                    res.send(msg);
                                                                }
                                                            })


                                                        }
                                                    }

                                                    // console.log((difference)/(1000*60*60))
                                                }
                                                else {
//here
//check if last message time by student if time is less than 2  minutes then
                                                    var check2 = 0;
                                                    var findCheck = {
                                                        "stuId": req.body.stuId,
                                                        'subId': req.body.subId,
                                                        "iStatus": "active",
                                                        "msgBy": "0"
                                                    };
                                                    var resultteacher = mess.find(findCheck).sort({sendTime: -1}).limit(1)
                                                    resultteacher.each(function (err, item) {
                                                        if (err === null) {
                                                            if (check2++ == 0) {
                                                                if (item !== null) {
                                                                    var firstMsgtime = new Date().getTime()

                                                                    var differenceNow = firstMsgtime - parseInt(item.acceptTime);


                                                                    // console.log("differenceNow"+differenceNow)
                                                                    if (differenceNow <= 5 * 60 * 1000) {

                                                                        var mess = db.collection('message');

                                                                        var attachment

                                                                        // console.log("diggo"+req.body.attachment.length)
                                                                        if ((req.body.attachment === ' ') || (req.body.attachment.length == 0))
                                                                            attachment = ' '
                                                                        else {

                                                                            attachment = req.body.attachment
                                                                            //              uploadimg.upload(attachment,req.body.attachment)
                                                                            // uploadimg.upload(req.body.attachment)
                                                                            // attachment = "https://myimageping.s3.ap-south-1.amazonaws.com/" + req.body.stuId + new Date().getTime().toString()
                                                                        }
                                                                        var ins =
                                                                        {
                                                                            "stuId": req.body.stuId,
                                                                            "msg": req.body.msg,
                                                                            "teachId": doc.teachId,
                                                                            "subId": req.body.subId,
                                                                            "acceptTime": item.sendTime,
                                                                            "attachment": attachment,
                                                                            "extension": req.body.extension,
                                                                            "seenTime": "",
                                                                            "localTime": req.body.localTime,
                                                                            "sendTime": new Date().getTime().toString(),
                                                                            "intId": doc.intId,
                                                                            "firstName": req.body.firstName,
                                                                            "msgBy": req.body.msgBy,
                                                                            "iStatus": "active"

                                                                        }

                                                                        var coins = 0;
                                                                        var lenghtmsg = req.body.msg.length
                                                                        coins = lenghtmsg
                                                                        var lenghtimg = 0;
                                                                        if ((req.body.attachment !== null) && (req.body.attachment !== undefined) && (req.body.attachment.length !== 0))
                                                                            coins = 200
                                                                        var stu = db.collection('digo')
                                                                        var ObjectId = mongo.ObjectId
                                                                        var _id = new ObjectId(req.body.stuId)
                                                                        stu.findAndModify({'_id': _id}, [], {$inc: {'coins': coins * -1}}, {new: true}, function (error, document) {
                                                                            if (error === null) {
                                                                                // if(document.value.coins<=0)
                                                                                //     res.send({'status':'error',
                                                                                //         'msg':'Insufficient coins'})
                                                                                // else
                                                                                {
                                                                                    mess.insert(ins, function (err, result) {
                                                                                        if (err === null) {
                                                                                            // console.log(result)
                                                                                            var userS = []
                                                                                            var teacher = db.collection('teacherDetails');
                                                                                            teacher.findOne({
                                                                                                "teachId": doc.teachId,
                                                                                                subIds: req.body.subId
                                                                                            }, function (errors, resultnew) {
                                                                                                if (errors === null) {
                                                                                                    // console.log("digo+"+resultnew.regTokens[0])
                                                                                                    console.log(resultnew.teachId)
                                                                                                    if (resultnew.regTokens !== undefined && (resultnew.regTokens !== null)) {
                                                                                                        for (var i = 0; i < resultnew.regTokens.length; i++) {
                                                                                                            //console.log(item.regTokens[i])
                                                                                                            userS.push(resultnew.regTokens[i])
                                                                                                        }
                                                                                                    }
                                                                                                    var dataa = []
                                                                                                    result.ops[0]['coins'] = document.value.coins
                                                                                                    result.ops[0]['grade'] = document.value.grade
                                                                                                    // dataa.push({"coins":document.value.coins})
                                                                                                    dataa.push(result.ops[0])
                                                                                                    var admin = db.collection('adminDetails')
                                                                                                    var cursoradmin = admin.find();
                                                                                                    var admindata = []
                                                                                                    cursoradmin.each(function (error, item) {
                                                                                                        if (error === null) {

                                                                                                            if (item !== null) {
                                                                                                                if (item.regTokens !== undefined && item.regTokens !== null) {
                                                                                                                    for (var i = 0; i < item.regTokens.length; i++) {
                                                                                                                        admindata.push(item.regTokens[i])
                                                                                                                        // console.log(item.regTokens[i])
                                                                                                                        // console.log(admindata)
                                                                                                                    }
                                                                                                                }
                                                                                                            }
                                                                                                            else {
                                                                                                                // console.log(admindata)
                                                                                                                cloud.send(admindata, dataa, 0, 3)
                                                                                                            }

                                                                                                        }

                                                                                                    })
                                                                                                    cloud.send(userS, dataa, 0, 0)
                                                                                                    // disabledchat(db.collection('digo'),req.body.stuId)
                                                                                                    var admin = db.collection('adminDetails')
                                                                                                    var cursoradmin = admin.find();
                                                                                                    cursoradmin.each(function (error, item) {
                                                                                                        if (error === null) {
                                                                                                            var admindata = []
                                                                                                            if (item !== null) {
                                                                                                                if (item.regTokens !== undefined && item.regTokens !== null) {
                                                                                                                    for (var i = 0; i < item.regTokens.length; i++) {
                                                                                                                        admindata.push(item.regTokens[i])
                                                                                                                        // console.log(item.regTokens[i])
                                                                                                                        // console.log(admindata)
                                                                                                                    }
                                                                                                                }
                                                                                                            }
                                                                                                            else {
                                                                                                                // console.log(admindata)
                                                                                                                cloud.send(admindata, dataa, 0, 3)
                                                                                                            }

                                                                                                        }

                                                                                                    })
                                                                                                    //admin cloud.send(admin,dataa)

                                                                                                    // disabledchat(db.collection('digo'),req.body.stuId)

                                                                                                    var msg = {
                                                                                                        "status": "success",
                                                                                                        "msg": "Message sent",
                                                                                                        "data": result.ops[0],
                                                                                                        'coins': document.value.coins,
                                                                                                        'grade': document.value.grade
                                                                                                    }
                                                                                                    res.send(msg);
                                                                                                }
                                                                                                else {
                                                                                                    var msg = {
                                                                                                        "status": "error",
                                                                                                        "msg": "Oops something went wrong"
                                                                                                    }
                                                                                                    res.send(msg);
                                                                                                }


                                                                                            })
                                                                                            // userS.push('e8k3CgDPZpA:APA91bGx5-RGIvI1XHO63pdZ1HLltuqdpjafWQz01HfmyhZC-1qCLwCwqSeRCsVWCvoYXmdrH9bbYwXiruqhJadHJYjqBlqT2rBjMKrjlJNvM3wiJzaG8KytJjQd6Xfx7IPu1Gn-cGdR')

                                                                                        }
                                                                                        else {
                                                                                            var msg = {
                                                                                                "status": "error",
                                                                                                "msg": "Oops something went wrong"
                                                                                            }
                                                                                            res.send(msg);

                                                                                        }

                                                                                    })
                                                                                }
                                                                            }
                                                                        })


                                                                    }
                                                                    else {

                                                                        var mess = db.collection('message');
                                                                        var findInt = {
                                                                            "stuId": req.body.stuId,
                                                                            'subId': req.body.subId,
                                                                            "iStatus": "active",
                                                                            "intId": item.intId
                                                                        };
                                                                        mess.updateMany(findInt, {
                                                                            $set: {
                                                                                "iStatus": "unassigned",
                                                                                "teachId": "",
                                                                                "seenTime": "",
                                                                                'receivedTime': ''
                                                                            }
                                                                        }, function (errr, resss) {
                                                                            if (errr === null) {
                                                                                var teachDb = db.collection("teacherDetails");
                                                                                teachDb.update({"teachId": item.teachId}, {$set: {"availStatus": "active"}}, function (error1, result1) {
                                                                                    if (error1 === null) {

                                                                                        var attachment
                                                                                        // console.log("diggo"+req.body.attachment.length)
                                                                                        if ((req.body.attachment === ' ') || (req.body.attachment.length == 0))
                                                                                            attachment = ' '
                                                                                        else {

                                                                                            attachment = req.body.attachment


                                                                                            //uploadimg.upload(attachment,req.body.attachment)
                                                                                            // uploadimg.upload(req.body.attachment)
                                                                                            // attachment = "https://myimageping.s3.ap-south-1.amazonaws.com/" + req.body.stuId + new Date().getTime().toString()
                                                                                        }
                                                                                        var insertDocument = {
                                                                                            "iStatus": "unassigned",
                                                                                            "stuId": req.body.stuId,
                                                                                            "msg": req.body.msg,
                                                                                            "teachId": "",
                                                                                            "firstName": req.body.firstName,
                                                                                            "subId": req.body.subId,
                                                                                            "localTime": req.body.localTime,
                                                                                            "attachment": attachment,
                                                                                            "extension": req.body.extension,
                                                                                            "seenTime": "",


                                                                                            "sendTime": new Date().getTime().toString(),
                                                                                            "intId": item.intId,
                                                                                            "msgBy": req.body.msgBy
                                                                                        }

                                                                                        var coins = 0;
                                                                                        var lenghtmsg = req.body.msg.length
                                                                                        coins = lenghtmsg
                                                                                        var lenghtimg = 0;
                                                                                        if ((req.body.attachment !== null) && (req.body.attachment !== undefined) && (req.body.attachment.length !== 0))
                                                                                            coins = 200
                                                                                        var stu = db.collection('digo')
                                                                                        var ObjectId = mongo.ObjectId
                                                                                        var _id = new ObjectId(req.body.stuId)
                                                                                        stu.findAndModify({'_id': _id}, [], {$inc: {'coins': coins * -1}}, {new: true}, function (error, document) {
                                                                                            if (error === null) {


                                                                                                {
                                                                                                    mess.insert(insertDocument, function (err, result) {
                                                                                                        if (err === null) {
                                                                                                            //her
                                                                                                            var findCheck = {
                                                                                                                "intId": item.intId,
                                                                                                                "stuId": req.body.stuId,
                                                                                                                "subId": req.body.subId
                                                                                                            };
                                                                                                            var cursor = mess.find(findCheck)
                                                                                                            var count = 0
                                                                                                            var insertDocument;
                                                                                                            var noDocs = []
                                                                                                            cursor.each(function (err, item11) {
                                                                                                                if (err === null) {
                                                                                                                    count++;
                                                                                                                    if (item11 != null) {
                                                                                                                        item11['coins']=document.value.coins
                                                                                                                        item11['grade']=document.value.grade

                                                                                                                        // noDocs.push({'coins': document.value.coins})
                                                                                                                        // noDocs.push({'grade': document.value.grade})
                                                                                                                        noDocs.push(item11)
                                                                                                                    }
                                                                                                                    else {
                                                                                                                        if (count > 1) {
                                                                                                                            var userS = []

                                                                                                                            var teacher = db.collection('teacherDetails');
                                                                                                                            var checkSum = 0;
                                                                                                                            var cursorT = teacher.find({
                                                                                                                                "availStatus": "active",
                                                                                                                                subIds: req.body.subId
                                                                                                                            })
                                                                                                                            cursorT.each(function (err, item) {
                                                                                                                                if (err === null) {
                                                                                                                                    {
                                                                                                                                        checkSum++;
                                                                                                                                        if (item !== null) {
                                                                                                                                            console.log(item.teachId)
                                                                                                                                            if (item.regTokens !== undefined && (item.regTokens !== null)) {
                                                                                                                                                for (var i = 0; i < item.regTokens.length; i++) {
                                                                                                                                                    // console.log(item.regTokens[i])
                                                                                                                                                    userS.push(item.regTokens[i])
                                                                                                                                                }

                                                                                                                                            }

                                                                                                                                        }
                                                                                                                                        else {
                                                                                                                                            {

                                                                                                                                                for (var i = 0; i < noDocs.length; i++) {
                                                                                                                                                    var sendMsg = []
                                                                                                                                                    sendMsg.push(noDocs[i])
                                                                                                                                                    cloud.send(userS, sendMsg, 1, 0)
                                                                                                                                                }

                                                                                                                                                //admin cloud.send(admin,dataa)

                                                                                                                                                var admin = db.collection('adminDetails')
                                                                                                                                                var cursoradmin = admin.find();
                                                                                                                                                var admindata = []
                                                                                                                                                cursoradmin.each(function (error, item) {
                                                                                                                                                    if (error === null) {

                                                                                                                                                        if (item !== null) {
                                                                                                                                                            if (item.regTokens !== undefined && item.regTokens !== null) {
                                                                                                                                                                for (var i = 0; i < item.regTokens.length; i++) {
                                                                                                                                                                    admindata.push(item.regTokens[i])
                                                                                                                                                                    // console.log(item.regTokens[i])
                                                                                                                                                                    // console.log(admindata)
                                                                                                                                                                }
                                                                                                                                                            }
                                                                                                                                                        }
                                                                                                                                                        else {
                                                                                                                                                            console.log(admindata)
                                                                                                                                                            // cloud.send(admindata,dataa,0,3)
                                                                                                                                                        }
                                                                                                                                                        disabledchat(db.collection('digo'), req.body.stuId)

                                                                                                                                                    }

                                                                                                                                                })
                                                                                                                                                // console.log("bas"+userS)
                                                                                                                                                res.send({
                                                                                                                                                    "status": "success",
                                                                                                                                                    'coins': document.value.coins,
                                                                                                                                                    'grade': document.value.grade,
                                                                                                                                                    "msg": "Message sent",
                                                                                                                                                    "case": 1,
                                                                                                                                                    "data": noDocs
                                                                                                                                                })
                                                                                                                                            }

                                                                                                                                        }
                                                                                                                                    }
                                                                                                                                }
                                                                                                                            })
                                                                                                                            //fcm to all

                                                                                                                        }
                                                                                                                        else {
                                                                                                                            res.send({
                                                                                                                                "status": "error",
                                                                                                                                "msg": "Oops something went wrong"
                                                                                                                            });
                                                                                                                        }
                                                                                                                    }


                                                                                                                }
                                                                                                            })
                                                                                                            //r


                                                                                                        }
                                                                                                    })
                                                                                                }
                                                                                            }
                                                                                            else {
                                                                                                res.send({
                                                                                                    'status': 'error',
                                                                                                    'msg': 'Something went wrong.'
                                                                                                })

                                                                                            }
                                                                                        })


                                                                                        // console.log("yahoo"+item.teachId)

                                                                                        // firstEntry(req,res,mess)mess
                                                                                    }
                                                                                })


                                                                            }
                                                                            else {
                                                                                var msg = {
                                                                                    "status": "error",
                                                                                    "msg": "Oops something went wrong"
                                                                                }
                                                                                res.send(msg);
                                                                            }
                                                                        })


                                                                    }

                                                                }
                                                            }
                                                        }
                                                    })


                                                }


                                            }
                                        }
                                    })


                                    var w = 0;


                                }
                            }
                            else {
                                res.send({"status": "error", "msg": "Oops something went wrong"})

                            }


                        })
                    }
                });
            }
        });
    }
}
module.exports = message;