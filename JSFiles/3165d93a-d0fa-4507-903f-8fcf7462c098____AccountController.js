const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const Cryptr = require("cryptr");
const path = require("path");

const Users = require("../../Model/Trainer/UserSchema");
const { SendMailHtml } = require("../EmailController");
const { errorLog } = require("../Errorcontroller");
const { json } = require("express");

const JWTSECRET = process.env.JWTSECRET;
const ENCRYPTSECRET = process.env.ENCRYPTSECRET;
const WEBRESETPASSWORDHOST = process.env.WEBRESETPASSWORDHOST;

const cryptr = new Cryptr(ENCRYPTSECRET);

const login = async (req, res) => {
    try {
        if (req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Logged in user cannot login again." });

        const userexists = await Users.findOne({ email: req.body.email }).collation({ locale: 'en', strength: 2 });
        if (userexists) {
            if (userexists.statusid != 1)
                return res.status(200).json({ status: 2, message: "User not activated." });

            const passwordverify = await bcrypt.compare(req.body.password, userexists.password);
            if (!passwordverify)
                return res.status(200).json({ status: 2, message: "Incorrect password." });

            // Available Status Active Trainer - Available Now - 1 - Green
            userexists.availablestatus = 1;
            userexists.deviceid = req.body.deviceid || "";
            userexists.devicetype = req.body.devicetype || "";
            userexists.save();

            const token = await JWT.sign({ _id: userexists._id, isAuthenticated: true, role: "trainer" }, JWTSECRET, {})
            // .then((data) => {
            //     res.status(200).json({ status: 1, message: "Registration successfully.", result: data });
            // })
            // .catch(function (error) {
            //     res.status(500).json({ status: 2, message: "Something getting wrong.", error: error.toString(), result: {} });
            // });
            res.cookie("access_token", token);

            return res.status(200).json({
                status: 1, message: "Login successfully.",
                result: { "User": userexists, "token": token }
            });
        }
        return res.status(200).json({ status: 2, message: "User not found." });
    }
    catch (err) {
        errorLog("SaveAccountInfo", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};

const logout = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to get profile." });

        const userexists = await Users.findById({ _id: req.user._id });
        if (userexists) {
            // Available Status Offline Trainer - 0 - Grey
            userexists.availablestatus = 0;
            userexists.deviceid = "";
            userexists.devicetype = "";
            userexists.save();
            return res.status(200).json({ status: 1, message: "Logout successfully." });
        }
        return res.status(200).json({ status: 2, message: "User not found." });
    }
    catch (err) {
        errorLog("SaveAccountInfo", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};

const register = async (req, res) => {
    try {
        console.log(req.body)
        if (req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Logged in user cannot register new users." });

        const userexists = await Users.findOne({ email: req.body.email }).collation({ locale: 'en', strength: 2 });
        if (userexists)
            return res.status(200).json({ status: 2, message: "email already exists." });

        var filename = "";
        var coverfilename = "";
        if (req.files) {
            console.log("File")
            const file = req.files.profile;
            const extensionName = path.extname(file.name); // fetch the file extension
            const allowedExtension = ['.png', '.jpg', '.jpeg'];

            if (!allowedExtension.includes(extensionName))
                return res.status(200).json({ status: 2, message: "Only .png, .jpg and .jpeg format allowed." });

            if (file.size > (1024 * 1024 * 1))
                return res.status(200).json({ status: 2, message: "File size is more than 1 MB." });

            filename = "/public/trainerprofile/" + `profile_${Date.now()}${extensionName}`;

            await file.mv("." + filename);


            const cfile = req.files.coverprofile;
            const cextensionName = path.extname(cfile.name); // fetch the file extension
            const callowedExtension = ['.png', '.jpg', '.jpeg'];

            if (!callowedExtension.includes(cextensionName))
                return res.status(200).json({ status: 2, message: "Only .png, .jpg and .jpeg format allowed." });

            if (file.size > (1024 * 1024 * 1))
                return res.status(200).json({ status: 2, message: "File size is more than 1 MB." });

            coverfilename = "/public/trainercover/" + `cover_${Date.now()}${cextensionName}`;

            await cfile.mv("." + coverfilename);
        }
        //  else {
        //     // console.log("Base64")
        //     // var filebase64Data = req.body.profile.replace(/^data:image\/png;base64,/, "");
        //     // const file = fs.writeFile("out.png", filebase64Data, 'base64', function(err) {
        //     //     console.log(err);
        //     // });
        //     // filename = "/public/trainerprofile/" + `profile_${Date.now()}.jpg`;
        //     // await file.mv("." + filename);

        //     //filename = req.body.profile;

        //     // var coverfilebase64Data = req.body.profile.replace(/^data:image\/png;base64,/, "");
        //     // const cfile = fs.writeFile("cout.png", coverfilebase64Data, 'base64', function(err) {
        //     //     console.log(err);
        //     // });
        //     // coverfilename = "/public/trainercover/" + `cover_${Date.now()}.jpg`;
        //     // await cfile.mv("." + filename);
        //     //coverfilename = req.body.coverprofile;
        // }
        console.log(filename);
        console.log(coverfilename);

        const salt = await bcrypt.genSalt(3);
        const hashpassword = await bcrypt.hash(req.body.password, salt);
        //Store in MongoDB
        const userInput = {
            coverprofile: coverfilename,
            profile: filename,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: hashpassword,
            phoneno: req.body.phoneno,
            gender: req.body.gender,
            aboutus: req.body.aboutus,
            trainingstyle: req.body.trainingstyle,
            quote: req.body.quote,
            experience: req.body.experience,
            specialitys: req.body.specialitys,
            introduction: req.body.introduction,
            emailnotifications: req.body.emailnotifications,
            maillinglist: req.body.maillinglist,
            textnotifications: req.body.textnotifications,
            statusid: 1
            // qualifications: req.body.qualifications,
            // certifications: req.body.certifications,
        };
        const user = new Users(userInput);

        await user.save()
            .then((userdata) => {
                // Mail code.
                fs.readFile("./EmailTemplate/TrainerSignup.html", async (error, data) => {
                    if (error)
                        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: error.toString() });

                    const emailbody = data.toString().replace("##Name##", userInput.firstname);

                    var emaildata = { "to": userInput.email, "subject": "Trainer Registration", "html": emailbody };

                    let emailresult = await SendMailHtml(emaildata);
                    if (emailresult === true)
                        return res.status(200).json({ status: 1, message: "Trainer Registration successfully email sent.", result: userdata });
                    else
                        return res.status(200).json({ status: 1, message: "Trainer Registration successfully.", result: userdata });
                });


                res.status(200).json({ status: 1, message: "Registration successfully.", result: userdata });
            })
            .catch(function (error) {
                errorLog("register", req.body, error);
                res.status(200).json({ status: 2, message: "Something getting wrong.", error: error.toString() });
            });
    }
    catch (err) {
        errorLog("register", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};

const updateTrainerPara = async (req, res) => {
    try {
        var qualificationsObj = (req.body.qualifications != "") ? JSON.parse(req.body.qualifications) : null;
        var certificationsObj = (req.body.certifications != "") ? JSON.parse(req.body.certifications) : null;
        if (req.files) {
            if (req.body.qualifications != "" && qualificationsObj) {
                var Qimgllist = [];
                if (qualificationsObj.path) {
                    qualificationsObj.path.forEach(element => {
                        var qfilename = "";
                        if (element.name == req.files[element.name].name) {
                            const file = req.files[element.name];
                            const extensionName = path.extname(file.name); // fetch the file extension
                            const allowedExtension = ['.png', '.jpg', '.jpeg'];

                            if (!allowedExtension.includes(extensionName))
                                return res.status(422).json({ status: 2, message: "Only .png, .jpg and .jpeg format allowed." });

                            if (file.size > (1024 * 1024 * 1))
                                return res.status(422).json({ status: 2, message: "File size is more than 1 MB." });

                            qfilename = "/public/trainerqualifications/" + `qualification_${Date.now()}${extensionName}`;

                            file.mv("." + qfilename);
                        } else if (element.fpath == req.files[element.name].uri) {
                            const file = req.files[element.name];
                            const extensionName = path.extname(element.name); // fetch the file extension
                            const allowedExtension = ['.png', '.jpg', '.jpeg'];

                            if (!allowedExtension.includes(extensionName))
                                return res.status(422).json({ status: 2, message: "Only .png, .jpg and .jpeg format allowed." });

                            if (file.size > (1024 * 1024 * 1))
                                return res.status(422).json({ status: 2, message: "File size is more than 1 MB." });

                            qfilename = "/public/trainerqualifications/" + `qualification_${Date.now()}${extensionName}`;

                            file.mv("." + qfilename);
                        }
                        Qimgllist.push({
                            "uri": qfilename,
                            "name": element.name,
                            "type": element.type,
                            "qualification":  element.qualification || ""
                        })
                    });
                }
                var qualifi = {
                    "name": (qualificationsObj) ? qualificationsObj.name : "",
                    "path": Qimgllist
                }
            }
            if (req.body.certifications != "" && certificationsObj) {
                var Cimgllist = [];
                if (certificationsObj.path) {
                    certificationsObj.path.forEach(element => {
                        var cfilename = "";
                        if (element.name == req.files[element.name].name) {
                            const file = req.files[element.name];
                            const extensionName = path.extname(file.name); // fetch the file extension
                            const allowedExtension = ['.png', '.jpg', '.jpeg'];

                            if (!allowedExtension.includes(extensionName))
                                return res.status(422).json({ status: 2, message: "Only .png, .jpg and .jpeg format allowed." });

                            if (file.size > (1024 * 1024 * 1))
                                return res.status(422).json({ status: 2, message: "File size is more than 1 MB." });

                            cfilename = "/public/trainercertifications/" + `certification_${Date.now()}${extensionName}`;

                            file.mv("." + cfilename);
                        } else if (element.fpath == req.files[element.name].uri) {
                            const file = req.files[element.name];
                            const extensionName = path.extname(element.name); // fetch the file extension
                            const allowedExtension = ['.png', '.jpg', '.jpeg'];

                            if (!allowedExtension.includes(extensionName))
                                return res.status(422).json({ status: 2, message: "Only .png, .jpg and .jpeg format allowed." });

                            if (file.size > (1024 * 1024 * 1))
                                return res.status(422).json({ status: 2, message: "File size is more than 1 MB." });

                            cfilename = "/public/trainercertifications/" + `certification_${Date.now()}${extensionName}`;

                            file.mv("." + cfilename);
                        }
                        Cimgllist.push({
                            "uri": cfilename,
                            "name": element.name,
                            "type": element.type,
                            "certification":  element.certification || ""
                        })
                    });
                }
                var certifi = {
                    "name": (certificationsObj) ? certificationsObj.name : "",
                    "path": Cimgllist
                }
            }
        }
        const userdata = await Users.findOne({ _id: req.body.id });
        if (userdata) {
            if (req.body.qualifications != "") {
                userdata.qualifications = qualifi;
            }
            if (req.body.certifications != "") {
                userdata.certifications = certifi;
            }

            userdata.save();

            return res.status(200).json({ status: 1, message: "updated successfully." });
        }
        return res.status(200).json({ status: 2, message: "User not found." });
    }
    catch (err) {
        errorLog("updateTrainerPara", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};

const updateprofile = async (req, res) => {
    try {
        console.log(req.body)
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to update profile." });

        const userexists = await Users.findOne({ _id: { $ne: req.user._id }, email: req.body.email }).collation({ locale: 'en', strength: 2 });
        if (userexists)
            return res.status(200).json({ status: 2, message: "email already register with another user." });

        var filename = req.body.edprofile || "";
        var coverfilename = req.body.edcoverprofile || "";
        if (req.files) {
            // Profile Image Upload & Update
            const file = req.files.profile;
            if (file) {
                const extensionName = path.extname(file.name); // fetch the file extension
                const allowedExtension = ['.png', '.jpg', '.jpeg'];

                if (!allowedExtension.includes(extensionName))
                    return res.status(422).json({ status: 2, message: "Only .png, .jpg and .jpeg format allowed." });

                if (file.size > (1024 * 1024 * 1))
                    return res.status(422).json({ status: 2, message: "File size is more than 1 MB." });

                filename = "/public/trainerprofile/" + `profile_${Date.now()}${extensionName}`;

                await file.mv("." + filename);
            }
            // Cover Image Upload & Update
            const cfile = req.files.coverprofile;
            if (cfile) {
                const cextensionName = path.extname(cfile.name); // fetch the file extension
                const callowedExtension = ['.png', '.jpg', '.jpeg'];

                if (!callowedExtension.includes(cextensionName))
                    return res.status(200).json({ status: 2, message: "Only .png, .jpg and .jpeg format allowed." });

                if (file.size > (1024 * 1024 * 1))
                    return res.status(200).json({ status: 2, message: "File size is more than 1 MB." });

                coverfilename = "/public/trainercover/" + `cover_${Date.now()}${cextensionName}`;

                await cfile.mv("." + coverfilename);
            }
        }

        const usernotactive = await Users.findById({ _id: req.user._id });
        //console.log(usernotactive)
        if (usernotactive.statusid != 1)
            return res.status(200).json({ status: 2, message: "User not activated." });

        const salt = await bcrypt.genSalt(3);
        if (req.body.oldpassword != "" && req.body.password != "" && req.body.confirmpassword != "") {
            const passwordverify = await bcrypt.compare(req.body.oldpassword, usernotactive.password);
            if (!passwordverify)
                return res.status(200).json({ status: 2, message: "Old password does not same as password." });
            if (req.body.password != req.body.confirmpassword)
                return res.status(200).json({ status: 2, message: "Password and confirm password should be same." });
        }

        const userdata = await Users.findOne({ _id: req.user._id });
        if (userdata) {
            userdata.profile = filename;
            userdata.coverprofile = coverfilename;
            userdata.firstname = req.body.firstname;
            userdata.lastname = req.body.lastname;
            userdata.email = req.body.email;
            userdata.phoneno = req.body.phoneno;
            userdata.gender = req.body.gender;
            userdata.aboutus = req.body.aboutus;
            userdata.trainingstyle = req.body.trainingstyle;
            userdata.quote = req.body.quote;
            userdata.experience = req.body.experience;

            // userdata.specialitys = req.body.specialitys;
            // userdata.introduction = req.body.introduction;
            // userdata.emailnotifications = req.body.emailnotifications;
            // userdata.maillinglist = req.body.maillinglist;
            // userdata.textnotifications = req.body.textnotifications;

            // userdata.qualifications = req.body.qualifications;
            // userdata.certifications = req.body.certifications;

            if (req.body.oldpassword != "" && req.body.password != "" && req.body.confirmpassword != "") {
                const hashNewpassword = await bcrypt.hash(req.body.password, salt);
                userdata.password = hashNewpassword;
            }
            userdata.save();

            return res.status(200).json({ status: 1, message: "updated successfully." });
        }
        return res.status(200).json({ status: 2, message: "User not found." });
    }
    catch (err) {
        errorLog("updateprofile", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};

const getprofile = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to get profile." });

        const userexists = await Users.findById({ _id: req.user._id });
        if (userexists) {
            if (userexists.statusid != 1)
                return res.status(200).json({ status: 2, message: "User not activated." });
            return res.status(200).json({ status: 1, message: "Get successfully.", result: userexists });
        }
        return res.status(200).json({ status: 2, message: "User not found." });
    }
    catch (err) {
        errorLog("getprofile", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};

const forgotpassword = async (req, res) => {
    try {
        if (req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Logged in user cannot forgot password." });

        const userexists = await Users.findOne({ email: req.body.email }).collation({ locale: 'en', strength: 2 });
        if (userexists) {
            fs.readFile("./EmailTemplate/ForgotPassword.html", async (error, data) => {
                if (error)
                    return res.status(200).json({ status: 2, message: "Something getting wrong.", error: error.toString() });

                let encryptedstr = cryptr.encrypt(Date.now().toString() + ":" + userexists.email);
                var resetpasswordUrl = WEBRESETPASSWORDHOST + "trainer/account/resetpassword/" + encryptedstr;

                const emailbody = data.toString().replace("##ResetPasswordLink##", resetpasswordUrl);

                var emaildata = { "to": userexists.email, "subject": "Reset Password", "html": emailbody };

                let emailresult = await SendMailHtml(emaildata);
                if (emailresult === true)
                    return res.status(200).json({ status: 1, message: "Reset password link sent to your registred email." });
                else
                    return res.status(200).json({ status: 2, message: "Email not sent. Please contact administrative." });
            });
        }
        else
            return res.status(200).json({ status: 2, message: "Email not registered." });
    }
    catch (err) {
        errorLog("forgotpassword", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};

const resetpassword = async (req, res) => {
    try {
        const encryptedstr = req.params.encryptedstr;
        if (!encryptedstr)
            return res.status(200).json({ status: 2, message: "Not found." });

        let decryptedstr = cryptr.decrypt(encryptedstr);
        let paramlist = decryptedstr.split(":");
        let datetime = paramlist[0];
        let email = paramlist[1];

        if (((parseInt(Date.now()) - parseInt(datetime)) / (1000 * 60)) > 30)
            return res.status(200).json({ status: 2, message: "Reset paaword link expire." });

        const userexists = await Users.findOne({ email: email }).collation({ locale: 'en', strength: 2 });
        if (userexists) {
            const salt = await bcrypt.genSalt(3);
            const hashpassword = await bcrypt.hash(req.body.password, salt);
            userexists.password = hashpassword;
            userexists.save();

            return res.status(200).json({ status: 1, message: "Password updated successfully." });
        }
        return res.status(200).json({ status: 2, message: "User not found." });
    }
    catch (err) {
        errorLog("resetpassword", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};


const updateTrainerType = async (req, res) => {
    try {
        if (!req.user.isAuthenticated)
            return res.status(200).json({ status: 2, message: "Please login to update profile." });

        const userdata = await Users.findOne({ _id: req.user._id });
        if (userdata) {
            userdata.type = req.body.type;
            userdata.save();

            return res.status(200).json({ status: 1, message: "updated trainer type successfully." });
        }
        return res.status(200).json({ status: 2, message: "User not found." });
    }
    catch (err) {
        errorLog("updateTrainerType", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};

module.exports = {
    register,
    updateTrainerPara,
    login,
    logout,
    getprofile,
    updateprofile,
    forgotpassword,
    resetpassword,
    updateTrainerType
};
