var schema = new Schema({
    name: {
        type: String,
    }
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Config', schema);
// var requrl = "http://wohlig.io:1337/api/";
// var requrl = "https://mumbaischool.sfanow.in/api/";
// var requrl = "http://mumbaischool.sfanow.in/2017/api/";
// var requrl = "http://mumbaicollege.sfanow.in/api/";
// var requrl = "http://hyderabadschool.sfanow.in/api/";
// var requrl = "http://hyderabadcollege.sfanow.in/api/";
// var requrl = "http://ahmedabadschool.sfanow.in/api/";
// var requrl = "http://ahmedabadcollege.sfanow.in/api/";
var requrl = "http://testmumbaischool.sfanow.in/api/";
// var requrl = "http://testmumbai2015.sfanow.in/api/";
// var requrl = "http://testmumbai2016.sfanow.in/api/";
// var requrl = "http://testmumbaicollege.sfanow.in/api/";
// var requrl = "http://testhyderabadschool.sfanow.in/api/";
// var requrl = "http://testhyderabadcollege.sfanow.in/api/";
// var requrl = "http://testahmedabadschool.sfanow.in/api/";
// var requrl = "http://testahmedabadcollege.sfanow.in/api/";

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    maxRow: 20,

    medalPoints: {
        "gold": 5,
        "silver": 3,
        "bronze": 1
    },

    getForeignKeys: function (schema) {
        var arr = [];
        _.each(schema.tree, function (n, name) {
            if (n.key) {
                arr.push({
                    name: name,
                    ref: n.ref,
                    key: n.key
                });
            }
        });
        return arr;
    },

    checkRestrictedDelete: function (Model, schema, data, callback) {

        var values = schema.tree;
        var arr = [];
        var ret = true;
        _.each(values, function (n, key) {
            if (n.restrictedDelete) {
                arr.push(key);
            }
        });

        Model.findOne({
            "_id": data._id
        }, function (err, data2) {
            if (err) {
                callback(err, null);
            } else if (data2) {
                _.each(arr, function (n) {
                    if (data2[n].length !== 0) {
                        ret = false;
                    }
                });
                callback(null, ret);
            } else {
                callback("No Data Found", null);
            }
        });
    },

    manageArrayObject: function (Model, id, data, key, action, callback) {
        Model.findOne({
            "_id": id
        }, function (err, data2) {
            if (err) {
                callback(err, null);
            } else if (data2) {
                switch (action) {
                    case "create":
                        {
                            data2[key].push(data);
                            data2[key] = _.uniq(data2[key]);
                            data2.update(data2, {
                                w: 1
                            }, callback);
                        }
                        break;
                    case "delete":
                        {
                            _.remove(data2[key], function (n) {
                                return (n + "") == (data + "");
                            });
                            data2.update(data2, {
                                w: 1
                            }, callback);
                        }
                        break;
                }
            } else {
                callback(null, null);
            }
        });


    },

    olduploadFile: function (filename, callback) {
        var id = mongoose.Types.ObjectId();
        var extension = filename.split(".").pop();
        extension = extension.toLowerCase();
        if (extension == "jpeg") {
            extension = "jpg";
        }
        var newFilename = id + "." + extension;
        var MaxImageSize = 1200;

        var writestream = gfs.createWriteStream({
            filename: newFilename
        });
        writestream.on('finish', function () {
            callback(null, {
                name: newFilename
            });
            fs.unlink(filename);
        });

        var imageStream = fs.createReadStream(filename);

        if (extension == "png" || extension == "jpg" || extension == "gif") {
            Jimp.read(filename, function (err, image) {
                if (err) {
                    callback(err, null);
                } else {
                    if (image.bitmap.width > MaxImageSize || image.bitmap.height > MaxImageSize) {
                        image.scaleToFit(MaxImageSize, MaxImageSize).getBuffer(Jimp.AUTO, function (err, imageBuf) {
                            var bufferStream = new stream.PassThrough();
                            bufferStream.end(imageBuf);
                            bufferStream.pipe(writestream);
                        });
                    } else {
                        image.getBuffer(Jimp.AUTO, function (err, imageBuf) {
                            var bufferStream = new stream.PassThrough();
                            bufferStream.end(imageBuf);
                            bufferStream.pipe(writestream);
                        });
                    }

                }

            });
        } else {
            imageStream.pipe(writestream);
        }


    },

    uploadFile: function (filename, callback) {
        var id = mongoose.Types.ObjectId();
        var extension = filename.split(".").pop();
        extension = extension.toLowerCase();
        if (extension == "jpeg") {
            extension = "jpg";
        }
        var newFilename = id + "." + extension;

        var writestream = gfs.createWriteStream({
            filename: newFilename
        });
        writestream.on('finish', function () {
            callback(null, {
                name: newFilename
            });
            fs.unlink(filename);
        });

        var imageStream = fs.createReadStream(filename);

        if (extension == "png" || extension == "jpg" || extension == "gif") {
            Jimp.read(filename, function (err, image) {
                if (err) {
                    callback(err, null);
                } else {
                    if (image.bitmap.width > MaxImageSize || image.bitmap.height > MaxImageSize) {
                        image.scaleToFit(MaxImageSize, MaxImageSize).getBuffer(Jimp.AUTO, function (err, imageBuf) {
                            var bufferStream = new stream.PassThrough();
                            bufferStream.end(imageBuf);
                            bufferStream.pipe(writestream);
                        });
                    } else {
                        image.getBuffer(Jimp.AUTO, function (err, imageBuf) {
                            var bufferStream = new stream.PassThrough();
                            bufferStream.end(imageBuf);
                            bufferStream.pipe(writestream);
                        });
                    }

                }

            });
        } else {
            imageStream.pipe(writestream);
        }


    },

    oldReadUploaded: function (filename, width, height, style, res) {
        res.set({
            'Cache-Control': 'public, max-age=31557600',
            'Expires': new Date(Date.now() + 345600000).toUTCString()
        });
        var buf;
        var newNameExtire;
        var bufs = [];
        var proceedI = 0;
        var wi;
        var he;



        function proceed() {
            proceedI++;
            if (proceedI === 2) {
                Jimp.read(buf, function (err, image) {
                    if (err) {
                        callback(err, null);
                    } else {
                        if (style === "contain" && width && height) {
                            image.contain(width, height).getBuffer(Jimp.AUTO, writer2);
                        } else if (style === "cover" && (width && width > 0) && (height && height > 0)) {
                            image.cover(width, height).getBuffer(Jimp.AUTO, writer2);
                        } else if ((width && width > 0) && (height && height > 0)) {
                            image.resize(width, height).getBuffer(Jimp.AUTO, writer2);
                        } else if ((width && width > 0) && !(height && height > 0)) {
                            image.resize(width, Jimp.AUTO).getBuffer(Jimp.AUTO, writer2);
                        } else {
                            image.resize(Jimp.AUTO, height).getBuffer(Jimp.AUTO, writer2);
                        }
                    }
                });
            }
        }

        function writer2(err, imageBuf) {
            var writestream2 = gfs.createWriteStream({
                filename: newNameExtire,
            });
            var bufferStream = new stream.PassThrough();
            bufferStream.end(imageBuf);
            bufferStream.pipe(writestream2);
            res.send(imageBuf);
        }

        function read2(filename2) {
            var readstream2 = gfs.createReadStream({
                filename: filename2
            });
            readstream2.on('error', function (err) {
                res.json({
                    value: false,
                    error: err
                });
            });
            readstream2.pipe(res);
        }
        var onlyName = filename.split(".")[0];
        var extension = filename.split(".").pop();
        if ((extension == "jpg" || extension == "png" || extension == "gif") && ((width && width > 0) || (height && height > 0))) {
            //attempt to get same size image and serve
            console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
            var newName = onlyName;
            if (width > 0) {
                newName += "-" + width;
            } else {
                newName += "-" + 0;
            }
            if (height) {
                newName += "-" + height;
            } else {
                newName += "-" + 0;
            }
            if (style && (style == "contain" || style == "cover")) {
                newName += "-" + style;
            } else {
                newName += "-" + 0;
            }
            newNameExtire = newName + "." + extension;
            gfs.exist({
                filename: newNameExtire
            }, function (err, found) {
                if (err) {
                    // res.json({
                    //     value: false,
                    //     error: err
                    // });
                }
                if (found) {
                    read2(newNameExtire);
                } else {
                    proceed();
                }
            });
            //else create a resized image and serve
        } else {
            console.log("--------------------------------------------------------------------");
            var readstream = gfs.createReadStream({
                filename: filename
            });
            readstream.on('error', function (err) {
                res.json({
                    value: false,
                    error: err
                });
            });
            readstream.on('data', function (d) {
                bufs.push(d);
            });
            readstream.on('end', function () {
                buf = Buffer.concat(bufs);
                proceed();
            });
            readstream.pipe(res);
        }
        //error handling, e.g. file does not exist
    },

    readUploaded: function (filename, width, height, style, res) {
        res.set({
            'Cache-Control': 'public, max-age=31557600',
            'Expires': new Date(Date.now() + 345600000).toUTCString()
        });
        var readstream = gfs.createReadStream({
            filename: filename
        });
        readstream.on('error', function (err) {
            res.json({
                value: false,
                error: err
            });
        });
        var buf;
        var newNameExtire;
        var bufs = [];
        var proceedI = 0;
        var wi;
        var he;
        readstream.on('data', function (d) {
            bufs.push(d);
        });
        readstream.on('end', function () {
            buf = Buffer.concat(bufs);
            proceed();
        });


        function proceed() {
            proceedI++;
            if (proceedI === 2) {
                Jimp.read(buf, function (err, image) {
                    if (err) {
                        res.callback(err, null);
                    } else {
                        if (style === "contain" && width && height) {
                            image.contain(width, height).getBuffer(Jimp.AUTO, writer2);
                        } else if (style === "cover" && (width && width > 0) && (height && height > 0)) {
                            image.cover(width, height).getBuffer(Jimp.AUTO, writer2);
                        } else if ((width && width > 0) && (height && height > 0)) {
                            image.resize(width, height).getBuffer(Jimp.AUTO, writer2);
                        } else if ((width && width > 0) && !(height && height > 0)) {
                            image.resize(width, Jimp.AUTO).getBuffer(Jimp.AUTO, writer2);
                        } else {
                            image.resize(Jimp.AUTO, height).getBuffer(Jimp.AUTO, writer2);
                        }
                    }
                });
            }
        }

        function writer2(err, imageBuf) {
            var writestream2 = gfs.createWriteStream({
                filename: newNameExtire,
            });
            var bufferStream = new stream.PassThrough();
            bufferStream.end(imageBuf);
            bufferStream.pipe(writestream2);
            res.send(imageBuf);
        }

        function read2(filename2) {
            var readstream2 = gfs.createReadStream({
                filename: filename2
            });
            readstream2.on('error', function (err) {
                res.json({
                    value: false,
                    error: err
                });
            });
            readstream2.pipe(res);
        }
        var onlyName = filename.split(".")[0];
        var extension = filename.split(".").pop();
        if ((extension == "jpg" || extension == "png" || extension == "gif") && ((width && width > 0) || (height && height > 0))) {
            //attempt to get same size image and serve
            var newName = onlyName;
            if (width > 0) {
                newName += "-" + width;
            } else {
                newName += "-" + 0;
            }
            if (height) {
                newName += "-" + height;
            } else {
                newName += "-" + 0;
            }
            if (style && (style == "contain" || style == "cover")) {
                newName += "-" + style;
            } else {
                newName += "-" + 0;
            }
            newNameExtire = newName + "." + extension;
            gfs.exist({
                filename: newNameExtire
            }, function (err, found) {
                if (err) {
                    res.json({
                        value: false,
                        error: err
                    });
                }
                if (found) {
                    read2(newNameExtire);
                } else {
                    proceed();
                }
            });
            //else create a resized image and serve
        } else {
            readstream.pipe(res);
        }
        //error handling, e.g. file does not exist
    },

    readAttachment: function (filename, callback) {
        console.log("filename", filename);
        var readstream = gfs.createReadStream({
            filename: filename
        });
        readstream.on('error', function (err) {

            callback(err, false);
        });
        var buf;
        var bufs = [];
        readstream.on('data', function (d) {
            bufs.push(d);
        });
        readstream.on('end', function () {
            buf = Buffer.concat(bufs);
            callback(null, buf);
        });
    },

    tempReadUploaded: function (filename, width, height, style, res) {
        res.send();
    },

    import: function (name) {
        var jsonExcel = xlsx.parse(name);
        var retVal = [];
        var firstRow = _.slice(jsonExcel[0].data, 0, 1)[0];
        var excelDataToExport = _.slice(jsonExcel[0].data, 1);
        var dataObj = [];
        _.each(excelDataToExport, function (val, key) {
            dataObj.push({});
            _.each(val, function (value, key2) {
                dataObj[key][firstRow[key2]] = value;
            });
        });
        return dataObj;
    },

    uploadFindOne: function (filename, callback) {
        Upload.findOne({
            _id: filename
        }, function (err, data) {
            if (err || _.isEmpty(data)) {
                callback({
                    error: "no data found"
                });
            } else {
                callback(data);
            }
        });
    },

    importGS: function (filename, callback) {
        async.waterfall([
            function (callback) {
                ConfigProperty.findOne().lean().exec(function (err, property) {
                    if (err) {
                        callback(err, null);
                    } else {
                        if (_.isEmpty(property)) {
                            callback(null, []);
                        } else {
                            callback(null, property);
                        }
                    }
                });
            },
            function (property, callback) {
                console.log(property);
                var Storage = require('@google-cloud/storage');
                var projectId = 'future-oasis-145313';
                var storage = new Storage({
                    projectId: projectId,
                    keyFilename: property.keyfileName
                });
                Config.uploadFindOne(filename, function (uploadData) {
                    console.log('enter', uploadData);
                    if (uploadData) {
                        console.log('entering', uploadData);
                        var bucket = storage.bucket(global.storageBucket);
                        var readstream = bucket.file(uploadData.storageName).createReadStream();
                        console.log('enters', readstream);
                        readstream.on('error', function (err) {
                            callback({
                                value: false,
                                error: err
                            });
                        });
                        var buffers = [];
                        readstream.on('data', function (buffer) {
                            buffers.push(buffer);
                            console.log('data', buffers);
                        });
                        readstream.on('end', function () {
                            var buffer = Buffer.concat(buffers);
                            console.log("buffer", buffers);
                            callback(null, Config.import(buffer));
                        });
                    } else {
                        callback(null, 'Not found');
                    }
                });
            }
        ], function (err, complete) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, complete);
            }
        });
    },

    // importGS: function (filename, callback) {
    //     var readstream = gfs.createReadStream({
    //         filename: filename
    //     });
    //     readstream.on('error', function (err) {
    //         res.json({
    //             value: false,
    //             error: err
    //         });
    //     });
    //     var buffers = [];
    //     readstream.on('data', function (buffer) {
    //         buffers.push(buffer);
    //     });
    //     readstream.on('end', function () {
    //         var buffer = Buffer.concat(buffers);
    //         callback(null, Config.import(buffer));
    //     });
    // },

    generateExcel: function (name, found, res) {
        name = _.kebabCase(name);
        var excelData = [];
        _.each(found, function (singleData) {
            var singleExcel = {};
            _.each(singleData, function (n, key) {
                if (key != "__v" && key != "createdAt" && key != "updatedAt") {
                    // singleExcel[_.capitalize(key)] = n;
                    // console.log("in excel", n);
                    singleExcel[key] = n;
                }
            });
            excelData.push(singleExcel);
        });
        var xls = json2xls(excelData);
        var folder = "././.tmp/";
        var path = name + "-" + moment().format("MMM-DD-YYYY-hh-mm-ss-a") + ".xlsx";
        var finalPath = folder + path;
        fs.writeFile(finalPath, xls, 'binary', function (err) {
            if (err) {
                res.callback(err, null);
            } else {
                fs.readFile(finalPath, function (err, excel) {
                    if (err) {
                        res.callback(err, null);
                    } else {
                        res.set('Content-Type', "application/octet-stream");
                        res.set('Content-Disposition', "attachment;filename=" + path);
                        res.send(excel);
                        fs.unlink(finalPath);
                    }
                });
            }
        });

    },

    generateExcelOld: function (name, found, res) {
        name = _.kebabCase(name);
        var excelData = [];
        _.each(found, function (singleData) {
            var singleExcel = {};
            _.each(singleData, function (n, key) {
                if (key != "__v" && key != "createdAt" && key != "updatedAt") {
                    // singleExcel[_.capitalize(key)] = n;
                    // console.log("in excel", n);
                    singleExcel[key] = n;
                }
            });
            excelData.push(singleExcel);
        });
        var xls = json2xls(excelData);
        var folder = "././.tmp/";
        var path = name + "-" + moment().format("MMM-DD-YYYY-hh-mm-ss-a") + ".xlsx";
        var finalPath = folder + path;
        fs.writeFile(finalPath, xls, 'binary', function (err) {
            if (err) {
                res.callback(err, null);
            } else {
                fs.readFile(finalPath, function (err, excel) {
                    if (err) {
                        res.callback(err, null);
                    } else {
                        res.set('Content-Type', "application/octet-stream");
                        res.set('Content-Disposition', "attachment;filename=" + path);
                        res.send(excel);
                        fs.unlink(finalPath);
                    }
                });
            }
        });

    },

    excelDateToDate: function isDate(value) {
        value = (value - (25567 + 1)) * 86400 * 1000;
        var mom = moment(value);
        if (mom.isValid()) {
            return mom.toDate();
        } else {
            return undefined;
        }
    },

    email: function (data, callback) {
        Password.find().exec(function (err, userdata) {
            // console.log("userdata", userdata);
            if (err) {
                console.log(err);
                callback(err, null);
            } else if (userdata && userdata.length > 0) {
                if (data.filename && data.filename !== "") {
                    request.post({
                        url: requrl + "config/emailReader/",
                        json: data
                    }, function (err, http, body) {
                        console.log("body : ", body);
                        if (err) {
                            console.log(err);
                            callback(err, null);
                        } else {
                            if (body && body.value !== false) {
                                var helper = require('sendgrid').mail;
                                var name = 'No-reply';
                                from_email = new helper.Email(data.from, name);
                                to_email = new helper.Email(data.email);
                                subject = data.subject;
                                content = new helper.Content("text/html", body);
                                mail = new helper.Mail(from_email, subject, to_email, content);
                                // console.log("api_key", userdata[0].name);
                                var sg = require('sendgrid')(userdata[0].name);
                                var request = sg.emptyRequest({
                                    method: 'POST',
                                    path: '/v3/mail/send',
                                    body: mail.toJSON()
                                });

                                sg.API(request, function (error, response) {
                                    if (error) {
                                        callback(null, error);
                                        console.log('Error response received');
                                    } else {
                                        callback(null, response);
                                    }
                                });
                            } else {
                                callback({
                                    message: "Error while sending mail."
                                }, null);
                            }
                        }
                    });
                } else {
                    callback({
                        message: "Please provide params"
                    }, null);
                }
            } else {
                callback({
                    message: "No api keys found"
                }, null);
            }
        });
    },

    emailTo: function (data, callback) {
        Password.find().exec(function (err, userdata) {
            if (err) {
                console.log(err);
                callback(err, null);
            } else if (userdata && userdata.length > 0) {
                if (data.filename && data.filename !== "") {
                    //console.log("filename ", data.filename);
                    request.post({
                        url: requrl + "config/emailReader/",
                        json: data
                    }, function (err, http, body) {
                        console.log("body : ", body);
                        if (err) {
                            console.log(err);
                            callback(err, null);
                        } else {
                            // console.log('email else');
                            if (body && body.value !== false) {
                                var sg = require('sendgrid')(userdata[0].name);

                                var request = sg.emptyRequest({
                                    method: 'POST',
                                    path: '/v3/mail/send',
                                    body: {
                                        personalizations: [{
                                            to: data.email1,
                                            cc: data.cc1,
                                            bcc: data.bcc1,
                                            subject: data.subject
                                        }],
                                        from: {
                                            email: data.from,
                                            name: "No-reply"
                                        },

                                        content: [{
                                            type: 'text/html',
                                            value: body,
                                        }],
                                    },
                                });

                                sg.API(request, function (error, response) {
                                    if (error) {
                                        callback(null, error);
                                        console.log('Error response received');
                                    } else {
                                        // console.log(response.statusCode)
                                        // console.log(response.body)
                                        // console.log(response.headers)
                                        callback(null, response);
                                    }
                                });
                            } else {
                                callback({
                                    message: "Error while sending mail."
                                }, null);
                            }
                        }
                    });
                } else {
                    callback({
                        message: "Please provide params"
                    }, null);
                }
            } else {
                callback({
                    message: "No api keys found"
                }, null);
            }
        });
    },

    sendSms: function (data, callback) {
        if (data.mobile) {
            request.get({
                // url: "http://api-alerts.solutionsinfini.com/v3/?method=sms&api_key=A2673b52d60295c217f83efd42a6ab576&to=" + data.mobile + "&sender=TAGBOS&message=" + data.content + "&format=json"
                url: "http://api-alerts.solutionsinfini.com/v3/?method=sms&api_key=A585fda4adf7602034258066781832097&to=" + data.mobile + "&sender=SFANOW&message=" + data.content + "&format=json"
            }, function (err, http, body) {
                if (err) {
                    console.log(err);
                    callback(err, null);
                } else {
                    console.log("body", body);
                    callback(null, body);
                }
            });
        } else {
            callback({
                message: "Mobile number not found"
            }, null);
        }
    },

    downloadFromUrl: function (url, callback) {
        var dest = "./.tmp/" + moment().valueOf() + "-" + _.last(url.split("/"));
        var file = fs.createWriteStream(dest);
        var request = http.get(url, function (response) {
            response.pipe(file);
            file.on('finish', function () {
                Config.uploadFile(dest, callback);
            });
        }).on('error', function (err) {
            fs.unlink(dest);
            callback(err);
        });
    },

    generatePdf: function (pdfObj, callback) {
        console.log("generatePdf", pdfObj);

        var pdf = require('html-pdf');

        // obj = _.assign(obj, page);
        var obj = {};
        var env = {};


        var file = pdfObj.filename;

        var i = 0;
        sails.hooks.views.render(file, {
            data: pdfObj
        }, function (err, html) {
            if (err) {
                callback(err, null);
            } else {
                //var path = "http://104.155.129.33:1337/upload/readFile/";
                var path = "pdf/";
                var newFilename = pdfObj.newFilename;
                var writestream = fs.createWriteStream(path + newFilename);

                writestream.on('finish', function (err, res) {
                    if (err) {
                        console.log("Something Fishy", err);
                    } else {
                        callback(null, {
                            name: newFilename,
                            url: path + newFilename
                        });
                    }
                });

                var options = {
                    "paginationOffset": 5,
                    "phantomPath": "node_modules/phantomjs-prebuilt/bin/phantomjs",
                    // Export options
                    "directory": "/tmp",
                    "height": "10.5in", // allowed units: mm, cm, in, px
                    "width": "10in",
                    "format": "Letter", // allowed units: A3, A4, A5, Legal, Letter, Tabloid
                    // "orientation": "portrait", // portrait or landscape
                    // "zoomFactor": "1", // default is 1
                    // Page options
                    "border": {
                        "top": "0.5cm", // default is 0, units: mm, cm, in, px
                        "right": "0",
                        "bottom": "0",
                        "left": "0"
                    },
                    // File options
                    "type": "pdf", // allowed file types: png, jpeg, pdf
                    "timeout": 30000, // Timeout that will cancel phantomjs, in milliseconds
                    "footer": {
                        "height": "0",
                    },
                    // "filename": page.filename + ".pdf"
                };

                pdf.create(html, options).toStream(function (err, stream) {
                    if (err) {
                        callback(err);
                    } else {
                        i++;
                        stream.pipe(writestream);
                    }
                });
            }

        });
    },

    merge2pdfs: function (files, path, fileName, callback) {
        const PDFMerge = require('pdf-merge');

        // const files = [
        //     "/home/wohlig/Documents/htdocs/lavasaBackend/pdf/HA17544-Athletics-certificate.pdf",
        //     "/home/wohlig/Documents/htdocs/lavasaBackend/pdf/HA17544-Swimming-certificate.pdf",
        // ];

        async.waterfall([
            function (callback) {
                console.log("asdasdasdasda");
                async.concatSeries(files, function (name, callback) {
                    console.log(path + name);
                    var file = path + name;
                    callback(null, file);
                }, function (err, files) {
                    console.log("files", files);
                    callback(null, files);
                })
            },
            function (finalFiles, callback) {
                // PDFMerge(files, {output: "/home/wohlig/Documents/htdocs/lavasaBackend/pdf/qq.pdf"})
                // .then((buffer) => {

                // });
                var writestream = fs.createWriteStream(path + fileName + ".pdf");

                PDFMerge(finalFiles, {
                        output: 'Stream'
                    })
                    .then((stream) => {
                        stream.pipe(writestream);
                    });

                writestream.on('finish', function (err, res) {
                    if (err) {
                        console.log("Something Fishy", null);
                        callback(err, null);
                    } else {
                        callback(null, finalFiles);
                    }
                });
            },
            function (finalFiles, callback) {
                _.each(finalFiles, function (n, k) {
                    fs.unlink(n, (err) => {
                        if (err) throw err;
                        else {
                            if (finalFiles.length - 1 == k) {
                                callback(null, "merged");
                            }
                        }
                    });
                });
            }
        ], function (err, result) {
            callback(null, result);
        });

    },

    getWriteStreamPdf: function (pdfObj, callback) {
        console.log("generatePdf");

        var pdf = require('html-pdf');

        // obj = _.assign(obj, page);
        var obj = {};
        var env = {};


        var file = pdfObj.filename;

        var i = 0;
        sails.hooks.views.render(file, {
            data: pdfObj
        }, function (err, html) {
            if (err) {
                callback(err, null);
            } else {
                //var path = "http://104.155.129.33:1337/upload/readFile/";
                var path = "pdf/";
                var newFilename = pdfObj.newFilename;
                var writestream = fs.createWriteStream(path + newFilename);

                writestream.on('finish', function (err, res) {
                    if (err) {
                        console.log("Something Fishy", err);
                    } else {
                        callback(null, {
                            name: newFilename,
                            url: newFilename
                        });
                    }
                });

                var options = {
                    "paginationOffset": 5,
                    "phantomPath": "node_modules/phantomjs-prebuilt/bin/phantomjs",
                    // Export options
                    "directory": "/tmp",
                    "height": "10.5in", // allowed units: mm, cm, in, px
                    "width": "10in",
                    "format": "Letter", // allowed units: A3, A4, A5, Legal, Letter, Tabloid
                    // "orientation": "portrait", // portrait or landscape
                    // "zoomFactor": "1", // default is 1
                    // Page options
                    "border": {
                        "top": "0.5cm", // default is 0, units: mm, cm, in, px
                        "right": "0",
                        "bottom": "0",
                        "left": "0"
                    },
                    // File options
                    "type": "pdf", // allowed file types: png, jpeg, pdf
                    "timeout": 30000, // Timeout that will cancel phantomjs, in milliseconds
                    "footer": {
                        "height": "0",
                    },
                    // "filename": page.filename + ".pdf"
                };
                pdf.create(html, options).toStream(function (err, stream) {
                    if (err) {
                        callback(err);
                    } else {
                        i++;
                        stream.pipe(writestream);
                    }
                });
            }

        });
    },

    oldrotateImage: function (filename, angle, callback, res) {

        var readstream = gfs.createReadStream({
            filename: filename
        });
        readstream.on('error', function (err) {
            callback({
                value: false,
                error: err
            });
        });
        var buf;
        var newNameExtire;
        var bufs = [];
        var proceedI = 0;
        var wi;
        var he;
        readstream.on('data', function (d) {
            bufs.push(d);
        });
        readstream.on('end', function () {
            buf = Buffer.concat(bufs);
            proceed();
        });

        function proceed() {
            proceedI++;
            if (proceedI === 1) {
                Jimp.read(buf, function (err, image) {
                    gfs.remove({
                        filename: filename,
                    }, function () {
                        image.rotate(parseInt(angle)).getBuffer(Jimp.AUTO, writer2);
                    });

                });
            }
        }

        function writer2(err, imageBuf) {

            var writestream2 = gfs.createWriteStream({
                filename: filename,
            });
            var bufferStream = new stream.PassThrough();
            bufferStream.end(imageBuf);
            bufferStream.pipe(writestream2);
            writestream2.on('err', function (err) {
                callback(err, null);
            });
            writestream2.on('finish', function () {
                callback(null, filename);
            });
        }
    },

    rotateImage: function (filename, angle, callback, res) {
        var fid = filename.substr(0, filename.lastIndexOf('.')) + "-";
        // console.log("fid", fid);
        var readstream = gfs.createReadStream({
            filename: filename
        });
        readstream.on('error', function (err) {
            callback({
                value: false,
                error: err
            });
        });
        var buf;
        var newNameExtire;
        var bufs = [];
        var proceedI = 0;
        var wi;
        var he;
        readstream.on('data', function (d) {
            bufs.push(d);
        });
        readstream.on('end', function () {
            buf = Buffer.concat(bufs);
            proceed();
        });

        function proceed() {
            proceedI++;
            if (proceedI === 1) {
                Jimp.read(buf, function (err, image) {
                    async.waterfall([
                            function (callback) {
                                // var file = fid + "-";
                                gfs.files.find({
                                    filename: {
                                        $regex: fid,
                                        $options: "i"
                                    }
                                }).toArray(function (err, files) {
                                    if (err) {
                                        res.json(err);
                                    } else if (_.isEmpty(files)) {
                                        callback(null, image);
                                    } else {
                                        // console.log("files****", files);
                                        async.concatSeries(files, function (n, callback) {
                                            console.log("inside remove each", n);
                                            gfs.files.remove({
                                                _id: n._id
                                            }, function (err, found) {
                                                if (err) {
                                                    console.log("error");
                                                } else {
                                                    console.log("image", image);
                                                    callback(null, {
                                                        data: "removed"
                                                    });
                                                }
                                            });
                                        }, function (err, found) {
                                            callback(null, image);
                                        });
                                    }

                                });
                            },
                            function (image, callback) {
                                gfs.files.find({
                                    filename: filename
                                }).toArray(function (err, files) {
                                    if (err) {
                                        res.json(err);
                                    } else {
                                        // console.log("files", files);
                                        async.concatSeries(files, function (n, callback) {
                                            // console.log("inside each", n);
                                            gfs.files.remove({
                                                _id: n._id
                                            }, function (err, found) {
                                                if (err) {
                                                    console.log("error");
                                                } else {
                                                    console.log("image", image);
                                                    image.rotate(parseInt(angle)).getBuffer(Jimp.AUTO, writer2);
                                                }
                                            });
                                        }, function (err, found) {
                                            callback(null, found);
                                        });
                                    }
                                });
                            }
                        ],
                        function (err, complete) {
                            if (err) {
                                callback(null, []);
                            } else if (complete) {
                                if (_.isEmpty(complete)) {
                                    callback(null, complete);
                                } else {
                                    callback(null, complete);
                                }
                            }
                        });
                });
            }
        }

        function writer2(err, imageBuf) {
            console.log("inside", imageBuf);
            var writestream2 = gfs.createWriteStream({
                filename: filename,
            });
            var bufferStream = new stream.PassThrough();
            bufferStream.end(imageBuf);
            bufferStream.pipe(writestream2);
            writestream2.on('err', function (err) {
                callback(err, null);
            });
            writestream2.on('finish', function () {
                callback(null, filename);
            });
        }
    },

    removeChunkCover: function (callback, res) {
        // var readstream = gfs.createReadStream({
        //     filename: {
        //         $regex: "cover",
        //         $options: "i"
        //     }
        // });
        // readstream.on('error', function (err) {
        //     callback({
        //         value: false,
        //         error: err
        //     });
        // });
        var buf;
        var newNameExtire;
        var bufs = [];
        var proceedI = 0;
        var wi;
        var he;
        Jimp.read(buf, function (err, image) {
            gfs.files.find({
                filename: {
                    $regex: "-cover",
                    $options: "i"
                }
            }).toArray(function (err, files) {
                if (err) {
                    res.json(err);
                } else if (_.isEmpty(files)) {
                    callback(null, []);
                } else {
                    _.each(files, function (n) {
                        console.log("inside remove each", n);
                        gfs.files.remove({
                            _id: n._id
                        }, function (err, found) {
                            if (err) {
                                console.log("error");
                            } else {
                                console.log("removed image", image);
                            }
                        });

                    });
                    callback(null, "data removed");
                }
            });
        });
    }
};
module.exports = _.assign(module.exports, exports, model);