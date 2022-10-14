var ErrorManagement = require('./../../app/config/ErrorHandling.js');
var CubeModel = require('../models/Cubes.model.js');
var UserModel = require('../models/User.model.js');
var PostModel = require('../models/Post.model.js');
var multer = require('multer');

var api_key = 'key-1018902c1f72fc21e3dc109706b593e3';
var domain = 'www.inscube.com';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});



// Cube Image Upload Disk Storage and Validate Functions ----------------------------------------------------------------------------------------
var Cube_Image_Storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, './Uploads/Cubes'); },
    filename: (req, file, cb) => { cb(null, 'Cube_' + Date.now() + '.png'); }
});
var Cube_Image_Upload = multer({
    storage: Cube_Image_Storage,
    fileFilter: function (req, file, callback) {
        let extArray = file.originalname.split(".");
        let extension = (extArray[extArray.length - 1]).toLowerCase();
        if(extension !== 'png' && extension !== 'jpg' && extension !== 'gif' && extension !== 'jpeg') {
            return callback("Only 'png, gif, jpg and jpeg' images are allowed");
        }
        callback(null, true);
    }
}).single('image');


// Cube Topic File Upload Disk Storage and Validate Functions ----------------------------------------------------------------------------------------
var Cube_Topic_File_Storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, './Uploads/Topic_Attachments'); },
    filename: (req, file, cb) => {
        let extArray = file.originalname.split(".");
        let extension = (extArray[extArray.length - 1]).toLowerCase();
     cb(null, 'Topic_' + Date.now() + '.' + extension); }
});
var Cube_Topic_File_Upload = multer({
    storage: Cube_Topic_File_Storage,
    fileFilter: function (req, file, callback) {
        let extArray = file.originalname.split(".");
        let extension = (extArray[extArray.length - 1]).toLowerCase();
        if(extension !== 'png' && extension !== 'jpg' && extension !== 'gif' && extension !== 'jpeg' && extension !== 'mp4' && extension !== 'mkv' && extension !== '3gp' && extension !== 'flv') {
            return callback("Only 'png, gif, jpg, jpeg,  mp4, mkv, flv and 3gp' images are allowed");
        }
        callback(null, true);
    }
}).any('attachments', 20);



// ---------------------------------------------------------------------- Category List ----------------------------------------------------------
exports.CategoryList = function(req, res) {
    CubeModel.Cube_CategorySchema.find({}, {__v: 0}, function(err, data) {
        if(err) {
            ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Category List Find Query Error', 'Cubes.controller.js - 12', err);
            res.status(500).send({status:"False", Error:err, message: "Some error occurred while Find The Category List."});
        } else {

            const GetCubeCount = (result) => Promise.all(  // Main Promise For Cube List Get --------------
                result.map(info => getCubeInfo(info)) 
            ).then( result_1 => {  
                res.status(200).send({ Status:"True", Output: "True", Response: result_1 });
            }).catch( err_1 => { 
                ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Category List Cube Count Find Main Promise Error', 'Cubes.controller.js - 226', err_1);
                res.status(500).send({Status:"False", Error:err_1, Message: "Some error occurred while Find the Category List Cube Count Find Promise Error "});
            });

            const getCubeInfo = info => // Sub Promise For Cube Count Find --------------
                Promise.all([ 
                    CubeModel.CubesSchema.count({ 'Category_Id': info._id, Active_Status: 'Active' }).exec(),
                    ]).then( Data => {
                        var result = JSON.parse(JSON.stringify(info)); 
                        result.Cubes_Count = Data[0];
                        return result;
                    }).catch(error => {
                        ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Category List Cube Count Find Sub Promise Error', 'Cubes.controller.js - 67', error);
                    });     
            GetCubeCount(data); // Main Promise Call Function Cube --------------
        }
    });
};


// ---------------------------------------------------------------------- Category Info ----------------------------------------------------------
exports.CategoryInfo = function(req, res) {
    CubeModel.Cube_CategorySchema.findOne({'_id': req.params.Category_Id}, function(err, result) {
        if(err) {
            ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Category Info Find Query Error', 'Cubes.controller.js - 87', err);
            res.status(500).send({status:"False", Error:err, message: "Some error occurred while Find The Category Info."});
        } else { 
            res.status(200).send({ Status:"True", Output: "True", Response: result });
        }
    });
};


// ---------------------------------------------------------------------- Cube Creation ----------------------------------------------------------
exports.CreateCube = function(req, res) {
    Cube_Image_Upload(req, res, function(upload_err) {

        if(!req.body.User_Id || req.body.User_Id === '') {
            res.status(200).send({Status:"True", Output:"False", Message: "User Id can not be empty" });
        }else if(!req.body.Category_Id && req.body.Category_Id === ''){
            res.status(200).send({Status:"True", Output:"False", Message: "Category Id can not be empty" });
        }else if(!req.body.Name || req.body.Name === '' ){
            res.status(200).send({Status:"True", Output:"False", Message: "Name can not be empty" });
        }else if(!req.body.Security || req.body.Security === '' ){
            res.status(200).send({Status:"True", Output:"False", Message: "Security Status can not be empty" });
        }else{

            CubeModel.Cube_CategorySchema.findOne({'_id': req.body.Category_Id }, function(err, data) {
                if(err){
                    ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Cube Creation Category Info Find Query Error', 'Cubes.controller.js - 35', err);
                    res.status(500).send({Status:"False", Error:err, Message: "Some error occurred while Cube Creation"});
                }else {
                    var Cube_Image = '';
                        if (req.file !== undefined ) {  Cube_Image = req.file.filename;
                        } else { Cube_Image = data.Image; }

                        var Country = {};
                        var State = {};
                        var City = {};
                        if (req.body.Country !== '') {
                            Country = JSON.parse(req.body.Country);
                        }
                        if (req.body.State !== '') {
                            State = JSON.parse(req.body.State);
                        }
                        if (req.body.City !== '') {
                            City = JSON.parse(req.body.City);
                        }

                    var varCubesSchema = new CubeModel.CubesSchema({
                        User_Id: req.body.User_Id,
                        Category_Id: req.body.Category_Id,
                        Name: req.body.Name,
                        Image: Cube_Image,
                        Security: req.body.Security || '',
                        Security_Code: req.body.Security_Code || '',
                        Description: req.body.Description || '',
                        Country: Country,
                        State: State,
                        City: City,
                        Web: req.body.Web || '',
                        Mail: req.body.Mail || '',
                        Contact: req.body.Contact || '',
                        Active_Status: 'Active'
                    });
                    varCubesSchema.save(function(Submit_err, result) { // Cube Creation -----------------------------
                        if(Submit_err) {
                            ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Cube Creation Query Error', 'Cubes.controller.js - 81', Submit_err);
                            res.status(500).send({Status:"False", Error:Submit_err, Message: "Some error occurred while Cube Creation"});           
                        } else {
                            result = JSON.parse(JSON.stringify(result));
                            delete result.Security_Code;
                            delete result.__v;
                            var varCube_Followersschema = new CubeModel.Cube_Followersschema({
                                User_Id: req.body.User_Id,
                                Cube_Id: result._id,
                                Active_Status: 'Active'
                            });
                            varCube_Followersschema.save(function(err_1, result_1) {
                                if (err_1) {
                                    ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Create Cube Follow Query Error', 'Cubes.controller.js - 227', err_1);
                                    res.status(500).send({Status:"False", Error:err_1, Message: "Some error occurred while Follow The Cube!"});           
                                } else { 
                                    res.status(200).send({ Status:"True", Output: "True", Response: result });
                                }
                            });
                        }
                    });
                }
            });
         }
    });
};


// ---------------------------------------------------------------------- Add Cube Topic ----------------------------------------------------------
exports.AddCubeTopic = function(req, res) {
    Cube_Topic_File_Upload(req, res, function(upload_err) {

        if(!req.body.User_Id || req.body.User_Id === '') {
            res.status(200).send({Status:"True", Output:"False", Message: "User Id can not be empty" });
        }else if(!req.body.Cube_Id || req.body.Cube_Id === ''){
            res.status(200).send({Status:"True", Output:"False", Message: "Cube Id can not be empty" });
        }else if(!req.body.Name || req.body.Name === '' ){
            res.status(200).send({Status:"True", Output:"False", Message: "Name can not be empty" });
        }else{

            var Json = JSON.parse(JSON.stringify(req.files));
            var Return_Json = Json.map((Objects) => {
                let extArray = Objects.filename.split(".");
                let extension = (extArray[extArray.length - 1]).toLowerCase();
                if (extension === 'png' || extension === 'jpg' || extension === 'gif' || extension === 'jpeg' ) {
                    return { File_Name: Objects.filename, File_Type: 'Image', Size: Objects.size};
                }else {
                    return { File_Name: Objects.filename, File_Type: 'Video', Size: Objects.size};
                }
            });

            var varCube_Topicschema = new CubeModel.Cube_Topicschema({
                User_Id: req.body.User_Id,
                Cube_Id: req.body.Cube_Id,
                Name: req.body.Name,
                Description: req.body.Description || '',
                Attachments: Return_Json,
                Active_Status: 'Active'
            });
            varCube_Topicschema.save(function(err, result) {
                if(err) {
                    ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Cube Topic Add Query Error', 'Cubes.controller.js - 152', err);
                    res.status(500).send({Status:"False", Error:err, Message: "Some error occurred while Add Cube Topic"});           
                } else {
                    result = JSON.parse(JSON.stringify(result));
                    delete result.__v;
                    res.status(200).send({ Status:"True", Output: "True", Response: result });
                }
            });
         }
    });
};


// ---------------------------------------------------------------------- Update Cube Topic ----------------------------------------------------------
exports.UpdateCubeTopic = function(req, res) {
    Cube_Topic_File_Upload(req, res, function(upload_err) {

        if(!req.body.Topic_Id || req.body.Topic_Id === '') {
            res.status(200).send({Status:"True", Output:"False", Message: "Topic Id can not be empty" });
        }else if(!req.body.User_Id || req.body.User_Id === ''){
            res.status(200).send({Status:"True", Output:"False", Message: "User Id can not be empty" });
        }else if(!req.body.Cube_Id || req.body.Cube_Id === ''){
            res.status(200).send({Status:"True", Output:"False", Message: "Cube Id can not be empty" });
        }else if(!req.body.Name || req.body.Name === '' ){
            res.status(200).send({Status:"True", Output:"False", Message: "Name can not be empty" });
        }else{

            CubeModel.Cube_Topicschema.findOne({'_id': req.body.Topic_Id, 'User_Id': req.body.User_Id }, function(err, result) {
                if(err) {
                    ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'User Followed Cube List Find Query Error', 'Cubes.controller.js - 12', err);
                    res.status(500).send({status:"False", Error:err, message: "Some error occurred while Find The  User Followed Cube List."});
                } else {
                    var Json = JSON.parse(JSON.stringify(req.files));
                    var Return_Json = Json.map((Objects) => {
                        let extArray = Objects.filename.split(".");
                        let extension = (extArray[extArray.length - 1]).toLowerCase();
                        if (extension === 'png' || extension === 'jpg' || extension === 'gif' || extension === 'jpeg' ) {
                            return { File_Name: Objects.filename, File_Type: 'Image', Size: Objects.size};
                        }else {
                            return { File_Name: Objects.filename, File_Type: 'Video', Size: Objects.size};
                        }
                    });
                    var Old_Json = [];
        
                    if (req.body.Old_Attachments && req.body.Old_Attachments !== undefined ) {
                        Old_Json = JSON.parse(req.body.Old_Attachments);
                    }

                    result.Name = req.body.Name;
                    result.Description = req.body.Description;
                    result.Attachments = Return_Json.concat(Old_Json);
                    result.save(function(err_1, result_1) {
                        if(err_1) {
                            ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Cube Topic Add Query Error', 'Cubes.controller.js - 152', err_1);
                            res.status(500).send({Status:"False", Error:err_1, Message: "Some error occurred while Add Cube Topic"});           
                        } else {
                            result_1 = JSON.parse(JSON.stringify(result_1));
                            delete result_1.__v;
                            res.status(200).send({ Status:"True", Output: "True", Response: result_1 });
                        }
                    });
                }
            });


         }
    });
};

// ----------------------------------------------------------------------  Delete Topic ----------------------------------------------------------
exports.Delete_Topic = function(req, res) {

    if(!req.body.Topic_Id || req.body.Topic_Id === '') {
        res.status(200).send({Status:"True", Output:"False", Message: "Topic Id can not be empty" });
    } else if(!req.body.User_Id || req.body.User_Id === '') {
        res.status(200).send({Status:"True", Output:"False", Message: "User Id can not be empty" });
    } else {
        CubeModel.Cube_Topicschema.findOne({'_id': req.body.Topic_Id, 'User_Id': req.body.User_Id }, function(err, result) {
            if(err) {
                ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Cube Post Submit Query Error', 'Posts.controller.js - 62', err);
                res.status(500).send({Status:"False", Error:err, Message: "Some error occurred while Cube Post Submit"});           
            } else {
                result.Active_Status = 'Inactive';
                result.save(function(err_1, result_1) {
                    if(err_1) {
                        ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Cube Topic Add Query Error', 'Cubes.controller.js - 152', err_1);
                        res.status(500).send({Status:"False", Error:err_1, Message: "Some error occurred while Add Cube Topic"});           
                    } else {
                        res.status(200).send({ Status:"True", Output: "True", Message: 'Successfully Deleted' });
                    }
                });
            }
        });
     }
};

// ---------------------------------------------------------------------- Cube View ----------------------------------------------------------
exports.CubeView = function(req, res) {
    CubeModel.CubesSchema.findOne({'_id': req.params.Cube_Id, 'Active_Status': 'Active'}, { __v:0}, function(err, result) {
        if(err || result === null) {
            ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Cube View Find Query Error', 'Cubes.controller.js - 101', err);
            res.status(500).send({status:"False", Error:err, message: "Some error occurred while Find The Cube Info."});
        } else {
            const getCubeRelatedInfo = info => // Main Promise For Cube Related Info Find --------------
                Promise.all([ 
                    CubeModel.Cube_Followersschema.count({ 'Cube_Id': info._id }).exec(),
                    CubeModel.Cube_Topicschema.find({'Cube_Id': info._id, 'Active_Status': 'Active'}, {__v: 0}, {sort: { updatedAt: -1 }} ).exec(),
                    CubeModel.Cube_CategorySchema.findOne({'_id': info.Category_Id }).exec(),
                    CubeModel.Cube_Followersschema.findOne({ 'Cube_Id': info._id, 'User_Id': req.params.User_Id }).exec(),
                    ]).then( Data => {
                        info = JSON.parse(JSON.stringify(info)); 
                        info.Members = Data[0];
                        info.Topics =  Data[1];
                        info.Category_Name =  Data[2].Name;
                        if (Data[3] === null) {
                            info.User_Follow = false;
                        } else {
                            info.User_Follow = true;
                        }
                        res.status(200).send({ Status:"True", Output: "True", Response: info });
                    }).catch(error => {
                        ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Cubes View Find Main Promise Error', 'Cubes.controller.js - 226', error);
                        res.status(500).send({Status:"False", Error:error, Message: "Some error occurred while Find the Cube View Promise Error "});
                    });

            getCubeRelatedInfo(result); // Main Promise Call Function Cube --------------
        }
    });
};


// ---------------------------------------------------------------------- Cubes List ----------------------------------------------------------
exports.CubesList = function(req, res) {
    CubeModel.CubesSchema.find({ 'User_Id': { $ne: req.params.User_Id }, 'Category_Id': req.params.Category_Id, 'Active_Status': 'Active'}, {__v: 0}, function(err, result) {
        if(err) {
            ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Cubes List Find Query Error', 'Cubes.controller.js - 12', err);
            res.status(500).send({status:"False", Error:err, message: "Some error occurred while Find The Cubes List."});
        } else {
            
            var Return_Cube_List = [];
            const GetCubeList = (result) => Promise.all(  // Main Promise For Cube List Get --------------
                    result.map(info => getCubeRelatedInfo(info)) 
                ).then( result_1 => {
                    UserModel.UserSchema.findOne({ '_id':  req.params.User_Id }, {Country: 1}, function(err_1, result_1) {
                        if(err_1) {
                            ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'User Info Find Query Error', 'Cubes.controller.js - 12', err_1);
                            res.status(500).send({status:"False", Error:err_1, message: "Some error occurred while Find The User Info."});
                        } else {
                            var Country = "India";
                            if(typeof result_1.Country === 'object' && result_1.Country.Country_Name && result_1.Country.Country_Name !== '') {
                                Country = result_1.Country.Country_Name;
                            }
                            Return_Cube_List = Return_Cube_List.sort( function(x,y) {
                                return x.Country_Location == Country ? -1 : y.Country_Location == Country ? 1 : 0; 
                            });
                            res.status(200).send({ Status:"True", Output: "True", Response: Return_Cube_List });
                        }
                    });
                }).catch( err_1 => {
                    ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Cubes List Find Main Promise Error', 'Cubes.controller.js - 226', err_1);
                    res.status(500).send({Status:"False", Error:err_1, Message: "Some error occurred while Find the Cube List Promise Error "});
                });

            const getCubeRelatedInfo = info => // Sub Promise For Cube Related Info Find --------------
                Promise.all([ 
                    CubeModel.Cube_Followersschema.count({ 'Cube_Id': info._id,  'Active_Status': 'Active' }).exec(),
                    CubeModel.Cube_Followersschema.findOne({'User_Id': req.params.User_Id, 'Cube_Id': info._id, 'Active_Status': 'Active' }).exec(),
                    UserModel.UserSchema.findOne({'_id' : info.User_Id }, {Country: 1}).exec(),
                    ]).then( Data => {
                        
                        if ( Data[1] === null ) {
                            info = JSON.parse(JSON.stringify(info));
                            Data[2]  = JSON.parse(JSON.stringify(Data[2]));


                            if (info.Country !== null && typeof info.Country === 'object' && info.Country.Country_Name && info.Country.Country_Name !== '') {
                                info.Country_Location = info.Country.Country_Name;
                            } else if(typeof Data[2].Country === 'object' && Data[2].Country.Country_Name && Data[2].Country.Country_Name !== '') {
                                info.Country_Location = Data[2].Country.Country_Name;
                            } else {
                                info.Country_Location = 'India';
                            }

                            
                            info.Members = Data[0];
                            Return_Cube_List.push(info);
                        }
                        return info;
                    }).catch(error => {
                        ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Cubes List Find Cube Related Info Sub Promise Error', 'Cubes.controller.js - 237', error);
                    });
            GetCubeList(result); // Main Promise Call Function Cube --------------
        }
    });
};


// ---------------------------------------------------------------------- Cubes List ----------------------------------------------------------
exports.All_Cube_List = function(req, res) {
    CubeModel.CubesSchema.find({'Active_Status': 'Active'}, {__v: 0}, {sort: { updatedAt: -1 }}, function(err, result) {
        if(err) {
            res.status(500).send({status:"False", Error:err, message: "Some error occurred while Find The Cubes List."});
        } else {
            
            const GetCubeList = (result) => Promise.all(
                    result.map(info => getCubeRelatedInfo(info)) 
                ).then( result_1 => {  
                    res.status(200).send({ Status:"True", Output: "True", Response: result_1 });
                }).catch( err_1 => { 
                    res.status(500).send({Status:"False", Error:err_1, Message: "Some error occurred while Find the Cube List Promise Error "});
                });

            const getCubeRelatedInfo = info =>
                Promise.all([ 
                    CubeModel.Cube_Followersschema.count({ 'Cube_Id': info._id,  'Active_Status': 'Active' }).exec(),
                    CubeModel.Cube_CategorySchema.findOne({'_id': info.Category_Id }).exec(),
                    ]).then( Data => {

                        var Return_Data = {};
                        var date = new Date(info.createdAt);
                        year = date.getFullYear();
                        month = date.getMonth()+1;
                        dt = date.getDate();

                        if (dt < 10) { dt = '0' + dt; }
                        if (month < 10) { month = '0' + month; }

                        Return_Data.Name = info.Name;
                        Return_Data.Members = Data[0];
                        Return_Data.Category = Data[1].Name;
                        Return_Data.Created_Date = year+'-' + month + '-'+dt;

                        return Return_Data;
                    });
            GetCubeList(result);
        }
    });
};


// ---------------------------------------------------------------------- User Followed Cubes List ----------------------------------------------------------
exports.User_Followed_Cubes = function(req, res) {
    CubeModel.Cube_Followersschema.find({'User_Id': req.params.User_Id, 'Active_Status': 'Active' }, function(err, result) {
        if(err) {
            ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'User Followed Cube List Find Query Error', 'Cubes.controller.js - 12', err);
            res.status(500).send({status:"False", Error:err, message: "Some error occurred while Find The  User Followed Cube List."});
        } else {
            const GetCubeInfo = (result) => Promise.all(  // Main Promise For Cube List Get --------------
                    result.map(info => CubeInfo(info)) 
                ).then( result_1 => {  
                    res.status(200).send({ Status:"True", Output: "True", Response: result_1 });
                }).catch( err_1 => { 
                    ErrorManagement.ErrorHandling.ErrorLogCreation(req, ' User Followed Cubes List Find Main Promise Error', 'Cubes.controller.js - 226', err_1);
                    res.status(500).send({Status:"False", Error:err_1, Message: "Some error occurred while Find the Cube List Promise Error "});
                });

            const CubeInfo = info => // Sub Promise For Cube Related Info Find --------------
                Promise.all([ 
                    CubeModel.CubesSchema.findOne({'_id': info.Cube_Id, 'Active_Status': 'Active' }, { Category_Id: 1, Name: 1, Image: 1  } ).exec(),
                    ]).then( Data => {
                        return Data[0];
                    }).catch(error => { 
                        ErrorManagement.ErrorHandling.ErrorLogCreation(req, ' User Followed Cubes List Find Cube Related Info Sub Promise Error', 'Cubes.controller.js - 237', error);
                    });

            GetCubeInfo(result); // Main Promise Call Function Cube --------------
        }
    });
};


// ---------------------------------------------------------------------- Follow Cube Creation ----------------------------------------------------------
exports.Follow_Cube = function(req, res) {
    
    if(!req.body.User_Id || req.body.User_Id === '') {
        res.status(200).send({Status:"True", Output:"False", Message: "User Id can not be empty" });
    }else if(!req.body.Cube_Id || req.body.Cube_Id === ''){
        res.status(200).send({Status:"True", Output:"False", Message: "Cube Id can not be empty" });
    }else{
        CubeModel.Cube_Followersschema.findOne({'User_Id': req.body.User_Id, 'Cube_Id': req.body.Cube_Id }, function(err, result) {
            if (err) {
                ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Cube Follow Info Find Query Error', 'Cubes.controller.js - 216', err);
                res.status(500).send({Status:"False", Error:err, Message: "Some error occurred while Find the Cube Follow Info"});
            }else {
                if (result === null) { // Cube Follow New Creation -----------------------------
                    var varCube_Followersschema = new CubeModel.Cube_Followersschema({
                        User_Id: req.body.User_Id,
                        Cube_Id: req.body.Cube_Id,
                        Active_Status: 'Active'
                    });
                    varCube_Followersschema.save(function(err_1, result_1) {
                        if (err_1) {
                            ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Cube Follow Creation Query Error', 'Cubes.controller.js - 227', err_1);
                            res.status(500).send({Status:"False", Error:err_1, Message: "Some error occurred while Follow The Cube!"});           
                        } else {
                            result_1 = JSON.parse(JSON.stringify(result_1));
                            delete result_1.__v;
                            res.status(200).send({ Status:"True", Output: "True", Response: result_1 });
                        }
                    });
                } else if ( result.Active_Status === 'Active' ) {  // Cube Already Follow  -----------------------------
                    res.status(200).send({ Status:"True", Output: "False", Message: " User Already Follow The Cube!" });
                } else if ( result.Active_Status === 'Inactive') { // Cube Already Follow But Inactive  -----------------------------
                    result.Active_Status = 'Active';
                    result.save(function(err_2, result_2) {
                        if (err_2) {
                            ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Cube Follow Update Query Error', 'Cubes.controller.js - 240', err_2);
                            res.status(500).send({Status:"False", Error:err_2, Message: "Some error occurred while Follow Cube Update Error!"});           
                        } else {
                            result_2 = JSON.parse(JSON.stringify(result_2));
                            delete result_2.__v;
                            res.status(200).send({ Status:"True", Output: "True", Response: result_2 });
                        }
                    });
                } else { // Cube Follow Not Match any Conditions  -----------------------------
                    res.status(500).send({Status:"False", Error:'Not Identify', Message: "Some error occurred while Follow The Cube!"}); 
                }
            }
        });
    }
};


// ---------------------------------------------------------------------- UnFollow Cube ----------------------------------------------------------
exports.UnFollow_Cube = function(req, res) {
    
    if(!req.body.User_Id || req.body.User_Id === '') {
        res.status(200).send({Status:"True", Output:"False", Message: "User Id can not be empty" });
    }else if(!req.body.Cube_Id || req.body.Cube_Id === ''){
        res.status(200).send({Status:"True", Output:"False", Message: "Cube Id can not be empty" });
    }else{
        CubeModel.Cube_Followersschema.findOne({'User_Id': req.body.User_Id, 'Cube_Id': req.body.Cube_Id, 'Active_Status': 'Active' }, function(err, result) {
            if (err) {
                ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Cube Follow Info Find Query Error', 'Cubes.controller.js - 216', err);
                res.status(500).send({Status:"False", Error:err, Message: "Some error occurred while Find the Cube Follow Info"});
            }else {
                if (result !== null) { // Cube Follow New Creation -----------------------------
                    result.Active_Status = 'Inactive';
                    result.save(function(err_2, result_2) {
                        if (err_2) {
                            ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Cube Follow Update Query Error', 'Cubes.controller.js - 240', err_2);
                            res.status(500).send({Status:"False", Error:err_2, Message: "Some error occurred while Follow Cube Update Error!"});           
                        } else {
                            result_2 = JSON.parse(JSON.stringify(result_2));
                            delete result_2.__v;
                            res.status(200).send({ Status:"True", Output: "True", Response: result_2 });
                        }
                    });
                } else if ( result.Active_Status === 'Inactive' ) {  // Cube Already UnFollow  -----------------------------
                    res.status(200).send({ Status:"True", Output: "False", Message: " User Already UnFollow The Cube!" });
                } else { // Cube Follow Not Match any Conditions  -----------------------------
                    res.status(500).send({Status:"False", Error:'Not Identify', Message: "Some error occurred while Follow The Cube!"}); 
                }
            }
        });
    }
};

// ---------------------------------------------------------------------- User Created Cubes List ----------------------------------------------------------
exports.User_Created_Cubes = function(req, res) {
    CubeModel.CubesSchema.find({'User_Id': req.params.User_Id, 'Active_Status': 'Active' }, function(err, result) {
        if(err) {
            ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'User Followed Cube List Find Query Error', 'Cubes.controller.js - 12', err);
            res.status(500).send({status:"False", Error:err, message: "Some error occurred while Find The  User Followed Cube List."});
        } else {
            
            var Return_Cubes = [];
            const GetCubeInfo = (result) => Promise.all(  // Main Promise For Cube List Get --------------
                    result.map(info => CubeFilter(info)) 
                ).then( result_1 => {  
                    res.status(200).send({ Status:"True", Output: "True", Response: Return_Cubes });
                }).catch( err_1 => { 
                    ErrorManagement.ErrorHandling.ErrorLogCreation(req, ' User Followed Cubes List Find Main Promise Error', 'Cubes.controller.js - 226', err_1);
                    res.status(500).send({Status:"False", Error:err_1, Message: "Some error occurred while Find the Cube List Promise Error "});
                });

            const CubeFilter = info => // Sub Promise For Cube Related Info Find --------------
                Promise.all([ 
                    CubeModel.Cube_CategorySchema.findOne({'_id': info.Category_Id}).exec(),
                    CubeModel.Cube_Followersschema.count({ 'Cube_Id': info._id,  'Active_Status': 'Active' }).exec(),
                    ]).then( Data => {
                        info = JSON.parse(JSON.stringify(info));
                            info.Category_Name = Data[0].Name;
                            info.Members_Count = Data[1];
                            Return_Cubes.push(info);
                        return Data[1];
                    }).catch(error => {
                        ErrorManagement.ErrorHandling.ErrorLogCreation(req, ' User Followed Cubes List Find Cube Related Info Sub Promise Error', 'Cubes.controller.js - 237', error);
                    });

            GetCubeInfo(result); // Main Promise Call Function Cube --------------
        }
    });
};


// ---------------------------------------------------------------------- User Un Followed Cubes List ----------------------------------------------------------
exports.User_UnFollowed_Cubes = function(req, res) {
    if(!req.params.User_Id || req.params.User_Id === '') {
        res.status(200).send({Status:"True", Output:"False", Message: "User Id can not be empty" });
    }else{
        CubeModel.CubesSchema.find({'Active_Status':'Active'}, {User_Id: 1, Category_Id: 1, Name: 1, Image:1, Security:1, Security_Code: 1 },  {sort: { updatedAt: -1 }}, function(err, result) {
            if(err) {
                ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'User Followed Cube List Find Query Error', 'Cubes.controller.js - 12', err);
                res.status(500).send({status:"False", Error:err, message: "Some error occurred while Find The  User Followed Cube List."});
            } else {
                var Return_Cubes = [];
                const GetCubeInfo = (result) => Promise.all(  // Main Promise For Cube List Get --------------
                        result.map(info => CubeFilter(info)) 
                    ).then( result_1 => {  
                        UserModel.UserSchema.findOne({ '_id':  req.params.User_Id }, {Country: 1}, function(err_1, result_1) {
                            if(err_1) {
                                ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'User Info Find Query Error', 'Cubes.controller.js - 12', err_1);
                                res.status(500).send({status:"False", Error:err_1, message: "Some error occurred while Find The User Info."});
                            } else {
                                var Country = "India";
                                if(typeof result_1.Country === 'object' && result_1.Country.Country_Name && result_1.Country.Country_Name !== '') {
                                    Country = result_1.Country.Country_Name;
                                }
                                Return_Cubes = Return_Cubes.sort( function(x,y) {
                                    return x.Country_Location == Country ? -1 : y.Country_Location == Country ? 1 : 0; 
                                });
                                res.status(200).send({ Status:"True", Output: "True", Response: Return_Cubes });
                            }
                        });
                    }).catch( err_1 => { 
                        ErrorManagement.ErrorHandling.ErrorLogCreation(req, ' User Followed Cubes List Find Main Promise Error', 'Cubes.controller.js - 226', err_1);
                        res.status(500).send({Status:"False", Error:err_1, Message: "Some error occurred while Find the Cube List Promise Error "});
                    });

                const CubeFilter = info => // Sub Promise For Cube Related Info Find --------------
                    Promise.all([ 
                        CubeModel.Cube_CategorySchema.findOne({'_id': info.Category_Id}).exec(),
                        CubeModel.Cube_Followersschema.count({ 'Cube_Id': info._id,  'Active_Status': 'Active' }).exec(),
                        CubeModel.Cube_Followersschema.findOne({'Cube_Id': info._id, 'User_Id' : req.params.User_Id, 'Active_Status': 'Active' } ).exec(),
                        UserModel.UserSchema.findOne({'_id' : info.User_Id }, {Country: 1}).exec(),
                        ]).then( Data => {
                            info = JSON.parse(JSON.stringify(info));
                            if (Data[2] === null) {
                                Data[3]  = JSON.parse(JSON.stringify(Data[3]));
                                if (typeof info.Country === 'object' && info.Country.Country_Name && info.Country.Country_Name !== '' ) {
                                    info.Country_Location = info.Country.Country_Name;
                                } else if(typeof Data[3].Country === 'object' && Data[3].Country.Country_Name && Data[3].Country.Country_Name !== '') {
                                    info.Country_Location = Data[3].Country.Country_Name;
                                } else {
                                    info.Country_Location = 'India';
                                }
                                info.Category_Name = Data[0].Name;
                                info.Members_Count = Data[1];
                                Return_Cubes.push(info);
                            }
                            return Data[2];
                        }).catch(error => {
                            ErrorManagement.ErrorHandling.ErrorLogCreation(req, ' User Followed Cubes List Find Cube Related Info Sub Promise Error', 'Cubes.controller.js - 237', error);
                        });

                GetCubeInfo(result); // Main Promise Call Function Cube --------------
            }
        });
    }
};


// ---------------------------------------------------------------------- User Un Followed Cubes List ----------------------------------------------------------
exports.Cube_Members = function(req, res) {
    if(!req.params.Cube_Id || req.params.Cube_Id === '') {
        res.status(200).send({Status:"True", Output:"False", Message: "Cube Id can not be empty" });
    }else{
        CubeModel.Cube_Followersschema.find({'Cube_Id': req.params.Cube_Id, 'Active_Status': 'Active' }, function(err, result) {
            if(err) {
                ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'User Followed Cube List Find Query Error', 'Cubes.controller.js - 12', err);
                res.status(500).send({status:"False", Error:err, message: "Some error occurred while Find The  User Followed Cube List."});
            } else {

                const GetUserInfo = (result) => Promise.all(  // Main Promise For Cube List Get --------------
                        result.map(info => userInfo(info)) 
                    ).then( result_1 => {  
                        res.status(200).send({ Status:"True", Output: "True", Response: result_1 });
                    }).catch( err_1 => { 
                        ErrorManagement.ErrorHandling.ErrorLogCreation(req, ' User Followed Cubes List Find Main Promise Error', 'Cubes.controller.js - 226', err_1);
                        res.status(500).send({Status:"False", Error:err_1, Message: "Some error occurred while Find the Cube List Promise Error "});
                    });

                const userInfo = info => // Sub Promise For Cube Related Info Find --------------
                    Promise.all([ 
                        UserModel.UserSchema.findOne({'_id' : info.User_Id }, {Inscube_Name: 1, Image: 1 } ).exec(),
                        ]).then( Data => {
                            return Data[0];
                        }).catch(error => {
                            ErrorManagement.ErrorHandling.ErrorLogCreation(req, ' User Followed Cubes List Find Cube Related Info Sub Promise Error', 'Cubes.controller.js - 237', error);
                        });

                GetUserInfo(result); // Main Promise Call Function Cube --------------
            }
        });
    }
};


// ---------------------------------------------------------------------- Cube Invite Check if cube is active ----------------------------------------------------------
exports.Check_Invite_CubeId = function(req, res) {
    CubeModel.CubesSchema.findOne({'_id': req.params.Cube_Id}, { __v:0}, function(err, result) {
        if(err) {
            ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Cube View Find Query Error', 'Cubes.controller.js - 101', err);
            res.status(500).send({status:"False", Error:err, message: "Some error occurred while Find The Cube Info."});
        } else {
            if (result !== null) {
                if (result.Active_Status === 'Active'){
                    res.status(200).send({ Status:"True", Output: "True" });
                } else {
                    res.status(200).send({ Status:"True", Output: "False" });
                }
            } else {
                res.status(200).send({ Status:"False", Output: "False" });
            }
        }
    });
};


// ---------------------------------------------------------------------- Cube Update ----------------------------------------------------------
exports.Update_Cube = function(req, res) {
    Cube_Image_Upload(req, res, function(upload_err) {

        if(!req.body.User_Id || req.body.User_Id === '') {
            res.status(200).send({Status:"True", Output:"False", Message: "User Id can not be empty" });
        }else if(!req.body.Cube_Id || req.body.Cube_Id === ''){
            res.status(200).send({Status:"True", Output:"False", Message: "Cube Id can not be empty" });
        }else if(!req.body.Category_Id || req.body.Category_Id === ''){
            res.status(200).send({Status:"True", Output:"False", Message: "Category Id can not be empty" });
        }else if(!req.body.Name || req.body.Name === '' ){
            res.status(200).send({Status:"True", Output:"False", Message: "Name can not be empty" });
        }else if(!req.body.Security || req.body.Security === '' ){
            res.status(200).send({Status:"True", Output:"False", Message: "Security Status can not be empty" });
        }else{
            CubeModel.CubesSchema.findOne({'_id': req.body.Cube_Id, 'Active_Status': 'Active'}, { __v:0}, function(err, result) {
                if(err) {
                    ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Cube View Find Query Error', 'Cubes.controller.js - 101', err);
                    res.status(500).send({status:"False", Error:err, message: "Some error occurred while Find The Cube Info."});
                } else {

                    var Cube_Image = '';
                        if (req.file !== undefined ) {  
                            Cube_Image = req.file.filename;
                        } else { 
                            Cube_Image = result.Image; 
                        }
                    var Country = {};
                    var State = {};
                    var City = {};
                    if (req.body.Country !== '') {
                        Country = JSON.parse(req.body.Country);
                    }
                    if (req.body.State !== '') {
                        State = JSON.parse(req.body.State);
                    }
                    if (req.body.City !== '') {
                        City = JSON.parse(req.body.City);
                    }

                    result.Category_Id = req.body.Category_Id;
                    result.Name = req.body.Name;
                    result.Image = Cube_Image;
                    result.Security = req.body.Security;
                    result.Security_Code = req.body.Security_Code;
                    result.Description = req.body.Description;
                    result.Country = Country;
                    result.State = State;
                    result.City = City;
                    result.Web = req.body.Web;
                    result.Mail = req.body.Mail;
                    result.Contact = req.body.Contact;

                    result.save(function(err_1, result_1) { // Cube Creation -----------------------------
                        if(err_1) {
                            ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Cube Creation Query Error', 'Cubes.controller.js - 81', err_1);
                            res.status(500).send({Status:"False", Error:err_1, Message: "Some error occurred while Cube Creation"});           
                        } else {
                            const getCubeRelatedInfo = result_1 => // Main Promise For Cube Related Info Find --------------
                            Promise.all([ 
                                CubeModel.Cube_Followersschema.count({ 'Cube_Id': result_1._id }).exec(),
                                CubeModel.Cube_Topicschema.find({'Cube_Id': result_1._id, 'Active_Status': 'Active'}, {__v: 0}, {sort: { updatedAt: -1 }} ).exec(),
                                CubeModel.Cube_CategorySchema.findOne({'_id': result_1.Category_Id }).exec(),
                                CubeModel.Cube_Followersschema.findOne({ 'Cube_Id': result_1._id, 'User_Id': req.body.User_Id }).exec(),
                                ]).then( Data => {
                                    result_1 = JSON.parse(JSON.stringify(result_1)); 
                                    result_1.Members = Data[0];
                                    result_1.Topics =  Data[1];
                                    result_1.Category_Name =  Data[2].Name;
                                    if (Data[3] === null) {
                                        result_1.User_Follow = false;
                                    } else {
                                        result_1.User_Follow = true;
                                    }
                                    res.status(200).send({ Status:"True", Output: "True", Response: result_1 });
                                }).catch(error => {
                                    ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Cubes View Find Main Promise Error', 'Cubes.controller.js - 226', error);
                                    res.status(500).send({Status:"False", Error:error, Message: "Some error occurred while Find the Cube View Promise Error "});
                                });
            
                        getCubeRelatedInfo(result_1); // Main Promise Call Function Cube --------------
                        }
                    });
                }
            });

         }
    });
};

// ---------------------------------------------------------------------- Cube Update ----------------------------------------------------------
exports.Delete_Cube = function(req, res) {

        if(!req.body.User_Id || req.body.User_Id === '') {
            res.status(200).send({Status:"True", Output:"False", Message: "User Id can not be empty" });
        }else if(!req.body.Cube_Id || req.body.Cube_Id === ''){
            res.status(200).send({Status:"True", Output:"False", Message: "Cube Id can not be empty" });
        }else{
            CubeModel.CubesSchema.findOne({'_id': req.body.Cube_Id, 'User_Id': req.body.User_Id }, function(err, result) {
                if(err) {
                    ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Cube View Find Query Error', 'Cubes.controller.js - 101', err);
                    res.status(500).send({status:"False", Error:err, message: "Some error occurred while Find The Cube Info."});
                } else {

                    result.Active_Status = 'Inactive';

                    result.save(function(err_1, result_1) {
                        if(err_1) {
                            ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Cube Creation Query Error', 'Cubes.controller.js - 81', err_1);
                            res.status(500).send({Status:"False", Error:err_1, Message: "Some error occurred while Cube Creation"});           
                        } else {

                            var CubeIdArray = [];
                            CubeIdArray.push(result_1._id);
                            CubeIdArray = JSON.parse(JSON.stringify(CubeIdArray)); 

                            const getCubeRelatedInfo = result_1 => 
                            Promise.all([
                                CubeModel.Cube_Followersschema.where({ Cube_Id: result_1._id }).updateMany({ $set: { Active_Status: 'Inactive' }}).exec(),
                                UserModel.Post_NotificationSchema.where({ Cube_Id: result_1._id}).updateMany({ $set: { Active_Status: 'Inactive' }}).exec(),
                                PostModel.Cube_Postschema.find({'Cubes_Id': { $in: CubeIdArray }, 'Active_Status': 'Active' }, {Cubes_Id: 1}).exec(),
                                ]).then( Data => {

                                    Post_List = JSON.parse(JSON.stringify(Data[2])); 
                                    
                                    if (Post_List.length > 0 ) {
                                        const GetPost_Info = (Post_List) => Promise.all(
                                                Post_List.map(info => post_Info(info)) 
                                            ).then( result_2 => {
                                                    res.status(200).send({ Status:"True", Output: "True", Message: 'Success' });
                                            }).catch( err_2 => { 
                                                ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Cube Post Submit Category Info Find Main Promise Error', 'Posts.controller.js - 75', err_2);
                                                res.status(200).send({ Status:"True", Output: "True", Message: 'Success but post remove error' });
                                            });

                                        const post_Info = info =>
                                            Promise.all([
                                                PostModel.Cube_Postschema.findOne({'_id': info._id, 'Active_Status': 'Active' }, {Cubes_Id: 1, Active_Status:1 }).exec(),
                                                ]).then( Data_new => {
                                                    var Cube_Ids = JSON.parse(JSON.stringify(Data_new[0].Cubes_Id));
                                                    if(Cube_Ids.length > 1) {
                                                        var index = Data_new[0].Cubes_Id.indexOf(result_1._id);
                                                        if (index > -1) {
                                                            Data_new[0].Cubes_Id.splice(index, 1);
                                                        }
                                                        Data_new[0].save();
                                                    } else{
                                                        Data_new[0].Active_Status = 'Inactive';
                                                        Data_new[0].save();
                                                    }
                                                    return Data_new[0];
                                                }).catch(error_12 => {
                                                    console.log(error_12);
                                                });
    
                                        GetPost_Info(Post_List);
                                    } else {
                                        res.status(200).send({ Status:"True", Output: "True", Message: 'Success' });
                                    }

                                }).catch(error => {
                                    ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Cubes View Find Main Promise Error', 'Cubes.controller.js - 226', error);
                                    res.status(500).send({Status:"False", Error:error, Message: "Some error occurred while Find the Cube View Promise Error "});
                                });
            
                        getCubeRelatedInfo(result_1); // Main Promise Call Function Cube --------------
                        }
                    });
                }
            });

         }
};



exports.Email_Invite_Cube = function(req, res) {

    if(!req.body.Cube_Id || req.body.Cube_Id === '' ) {
        res.status(200).send({Status:"True", Output:"False", Message: "Cube Id can not be empty" });
    } else if(!req.body.User_Id ||  req.body.User_Id === '' ) {
            res.status(200).send({Status:"True", Output:"False", Message: "User Id can not be empty" });
    } else if(!req.body.Email_Ids ||  (req.body.Email_Ids).length <= 0 ) {
        res.status(200).send({Status:"True", Output:"False", Message: "Email can not be empty" });
    }else{

        UserModel.UserSchema.findOne({'_id': req.body.User_Id}, function(err, User_Info) {
            if(err) {
                ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'User Register Completion User Info Find Query Error', 'SignIn_SignUp.controller.js - 58', err);
                res.status(500).send({ Status:"False", Error:err, Message: "Some error occurred while Validate The E-mail " });
            } else {
                if(User_Info !== null){
                    CubeModel.CubesSchema.findOne({'_id': req.body.Cube_Id}, function(err_1, Cube_Info) {
                        if(err_1) {
                            ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'User Register Completion User Info Find Query Error', 'SignIn_SignUp.controller.js - 58', err_1);
                            res.status(500).send({ Status:"False", Error:err_1, Message: "Some error occurred while Validate The E-mail " });
                        } else {
                            if(Cube_Info !== null){
                                var Email_Objects = JSON.parse(req.body.Email_Ids);
                                var EmailArray = [];
                                var Return_Json = Email_Objects.map((Objects) => {
                                    var EmailValidater = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                                    if ( EmailValidater.test(Objects.email)) {
                                        EmailArray.push(Objects.email);
                                    }
                                });

                                if (EmailArray.length > 0) {
                                    var User_Image = "https://inscube.com/API/Uploads/Users/" + User_Info.Image;
                                    var User_Name = User_Info.Inscube_Name;
                                    var Cube_Name = Cube_Info.Name;
                                    var link = "https://inscube.com/Invite_Cube/" + Cube_Info._id;
                                    var SendData = {
                                        from: 'Inscube <insocialcube@gmail.com>',
                                        to: EmailArray[0],
                                        subject: 'Inscube invitaion - “' + Cube_Info.Name + '”',
                                        html: '<div style="background-color:#f6f6f6;font-size:14px;height:100%;line-height:1.6;margin:0;padding:0;width:100%" bgcolor="#f6f6f6" height="100%" width="100%"><table style="background-color:#f6f6f6;border-collapse:separate;border-spacing:0;box-sizing:border-box;width:100%" width="100%" bgcolor="#f6f6f6"><tbody><tr><td style="box-sizing:border-box;display:block;font-size:14px;font-weight:normal;margin:0 auto;max-width:500px;padding:10px;text-align:center;width:auto" valign="top" align="center" width="auto"><div style="background-color:#dedede; box-sizing:border-box;display:block;margin:0 auto;max-width:500px;padding:10px;text-align:left" align="left"><table style="background:#fff;border:1px solid #e9e9e9;border-collapse:separate;border-radius:3px;border-spacing:0;box-sizing:border-box;width:100%"><tbody><tr><td style="box-sizing:border-box;font-size:14px;font-weight:normal;margin:0;padding:30px;vertical-align:top" valign="top"><table style="border-collapse:separate;border-spacing:0;box-sizing:border-box;width:100%" width="100%"><tbody><tr style="font-family: sans-serif; line-height:20px" ><td style="box-sizing:border-box;font-size:14px;font-weight:normal;margin:0;vertical-align:top" valign="top"> <img src="https://inscube.com/assets/images/logo.png" style="width: 40%; margin-left: 30%;" alt="Inscube Logo" class="CToWUd"> <br> <img src="' + User_Image + '" style="width: 30%; margin-left: 35%; border-radius: 50%; margin-top: 30px;" alt="User Image" > <p style="font-size:16px;font-weight:700;text-align:center;letter-spacing: 0.5px;color: #333;margin: 5px 0px;"> ' + User_Name +' </p> <p style="text-align: center;font-size: 15px;margin: 0px;color: #666;">invited you to join “ <b> ' + Cube_Name + ' </b> ” community in INSCUBE </p> <p style="text-align: center;margin-top: 25px;"> <a href="'+ link +'" style="background-color:#e9472c;box-sizing:border-box;color:#ffffff;display:inline-block;font-size:14px;margin:0;padding:12px 25px;text-decoration:none;letter-spacing:0.5px" bgcolor="#ffda00" target="_blank" data-saferedirecturl=" '+ link +'"> Join the cube </a> </p> <p style="font-size:14px;font-weight:normal;margin:0;margin-bottom:15px;padding:0"> INSCUBE is the world’s first alternate media in which you can create your own social media, exclusive for your communities. Join now to explore and engage with communities around you.</p> <p style="font-size:14px;font-weight:normal;margin:0;margin-bottom:15px;padding:0">Thanks, Inscube Team</p></td></tr></tbody></table></td></tr></tbody></table></div></td></tr></tbody></table></div>'
                                    };
                                    
                                    mailgun.messages().send(SendData, function (error, body) {
                                        if (error) {
                                            res.status(500).send({ Status:"False", Error:error, Message: "Some error occurred while send The E-mail " });
                                        } else {
                                            res.status(200).send({ Status:"True", Output:"True", Response: body, Message: 'Email send successfully!' });
                                        }
                                    });
                                }else {
                                    res.status(200).send({ Status:"True", Output:"False", Response: body, Message: 'Enter valid emails!' }); 
                                }

                                
                            }
                        }
                    });

                } 
            }
        }); 
    }
};
