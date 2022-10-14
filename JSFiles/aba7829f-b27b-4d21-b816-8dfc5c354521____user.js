'use strict'
var validator = require('validator');
const user = require('../models/user');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
var fs = require('fs');
var path = require('path');
const jwt = require('jsonwebtoken');
const { TokenExpiredError } = jwt;
const RefreshToken = require('../models/refreshtoken');
const transporter = require('../config/email');
const { tokenExpires } = require('../config/Global');

const {google} = require('googleapis');
const {CLIENT_ID,CLIENT_SECRET,REDIRECT_URI,REFRESH_TOKEN} = require ('./../config/googleAuth');

var controller = {
    //metodo de prueba
    datosCurso: (req, res) => {
        console.log("Hola mundo");
        var hola = req.body.hola;
        return res.status(200).send({
            curso: 'Master en FramWorks JS',
            autor: 'Lariza XD',
            url: 'no tengo xD',
            hola
        });
    },
    //Guardar datos en la base de datos
    saveUser: (request, response) => {
        //Recoger los paremetros por post
        var params = request.body;
        //console.log(request.body);

        user.find({ '$or': [{ 'email': params.email }, { 'user': params.user.trim() }] }, (err, existingUser) => {
            console.log(existingUser);
            if (existingUser.length > 0) {

                if (existingUser[0].email == params.email) {
                    return response.status(404).send({ status: "error", message: "Correo en uso, intente nuevamente" });
                }
                else if (existingUser[0].user == params.user) {
                    return response.status(404).send({ status: "error", message: "Usario en uso, intente nuevamente" });
                }

            } else {
                if (err) {
                    console.log(err);
                } else {

                    //Inicio de todo lo demás
                    //Validar los datos con validator
                    try {
                        var validateUser = !validator.isEmpty(params.user);
                        var validatePassword = !validator.isEmpty(params.password);
                    } catch (err) {
                        return response.status(400).send({
                            status: 'error',
                            message: "Faltan datos por enviar"
                        });
                    }
                    //Si los datos son validos
                    if (validateUser && validatePassword) { //Deberiamos validar el nombre tambien 

                        //Encriptando la contrasena
                        const hash = bcrypt.hashSync(params.password, 10)
                        //Crear el objeto a guardar

                        var userToSave = new user(); //instanciando el modelo de datos

                        //Asiganar valores
                        userToSave.user = params.user;
                        userToSave.password = hash;
                        userToSave.email = params.email;
                        userToSave.name = params.name;
                        userToSave.lastname = params.lastname;

                        //Guardar el usuario a la base
                        userToSave.save((err, userStored) => {
                            console.log(userStored, err)
                            if (err || !userStored) {
                                return response.status(400).send({
                                    status: 'error',
                                    message: 'El usuario no se ha guardado'
                                });
                            } else {
                                //Devolver una respuestas
                                return response.status(200).send({
                                    status: 'success',
                                    user: userStored
                                });
                            }
                        });
                    } else {
                        return response.status(401).send({
                            status: 'error',
                            message: "Los datos no son validos"
                        });
                    }
                    //Fin de todo lo demás.
                }

            }
        });
    },
    //Obtener usuario por ID de la Base de Datos.
    getUser: (request, response) => {
        var userId = request.params.id;

        user.findById(userId, (error, foundUser) => {
            if (error || !foundUser || foundUser == undefined) {
                return response.status(404).json({
                    status: 'error',
                    message: 'No se encuentra el usuario.'
                })
            } else {
                return response.status(200).json({
                    status: 'success',
                    user: foundUser
                })
            }
        })
    },
    getUserByUsername: (request, response) => {
        var userName = request.params.nick;
        console.log(userName);

        if (userName === 'undefined') {
            return response.status(404).send({
                status: 'failed',
                message: 'No se ha enviado ningún nombre.'
            });
        }

        user.find({ user: userName }, (error, foundUser) => {
            if (error || !foundUser || foundUser == undefined) {
                console.log(error);
                console.log(foundUser);
                return response.status(404).json({
                    status: 'error',
                    message: 'No se encuentra el usuario.'
                })
            } else {
                return response.status(200).json({
                    status: 'success',
                    user: foundUser
                })
            }
        })
    },
    //Busqueda de usuarios
    searchUsers: (request, response) => {
        var valueToSearch = request.params.search;
        user.find({
            "$or": [
                {
                    "user": { "$regex": valueToSearch, "$options": "i" },
                }, {
                    "name": { "$regex": valueToSearch, "$options": "i" },
                },
                {
                    "lastname": { "$regex": valueToSearch, "$options": "i" }
                },

            ]
        }).sort([['date', 'descending']]).exec((err, users) => {
            if (err) {
                return response.status(500).send({
                    status: 'error',
                    message: 'error en la peticion'
                });
            }
            if (!users || users.length <= 0) {
                return response.status(404).send({
                    status: 'error',
                    message: 'no hay libros para mostrar con esa busqueda'
                });
            }
            return response.status(200).send({
                status: 'success',
                users
            });
        });
    },
    getUsers: (request, response) => {
        user.find({}).sort('-date').exec((error, users) => {
            if (error) {
                return response.status(404).send({
                    status: 'error',
                    message: 'Error al devolver los usuarios.'
                });
            }
            else if (!users || users.length == 0) {
                return response.status(404).send({
                    status: 'error',
                    message: 'Es que no hay artículos.'
                });
            } else {
                //Si no hay problema con las condiciones anteriores.
                return response.status(200).send({
                    status: 'success',
                    users
                });
            }
        });
    },
    login: (request, response) => {
        var params = request.body;
        var username = params.user;
        var password = params.password;

        console.log(username);
        console.log(password);

        //Buscar el usuario.

        user.findOne({ user: username }, (err, userFound) => {
            if (!userFound) {
                return response.status(404).send({
                    status: 'error',
                    message: 'No existe el usuario.'
                });
            }
            if (err) {
                console.log(error);
            } else {
                //Verificando la contraseña.
                var contrasenaCompatible = bcrypt.compareSync(password, userFound.password);
                if (!contrasenaCompatible) { //No hay acceso.
                    response.status(403).send({
                        status: 'error',
                        message: 'Tu contraseña es incorrecta, man.'
                    });
                } else { //Hay acceso.
                    //Generación del Token.
                    jwt.sign({ user: userFound.user, email: userFound.email }, 'secretkey', { expiresIn: tokenExpires }, (err, token) => {
                        if (err || !token || token == undefined) {
                            console.log(err);
                            response.status(404).send({
                                status: 'failed',
                                message: 'Ocurrio un error.'
                            });
                        } else {

                            //Creación del refresh token
                            var refreshToken;
                            RefreshToken.createToken(userFound)
                                .then(data => {
                                    console.log(data)
                                    refreshToken = data;
                                    if (refreshToken) {
                                        response.status(200).send({
                                            status: 'success',
                                            message: 'Acceso concedido.',
                                            user: userFound,
                                            token,
                                            refreshToken
                                        });
                                    }
                                })
                                .catch(err => console.log(err));


                        }

                    });
                }
            }
        })

        //return response.status(200).json(params);
    },

    refreshToken: async (req, res) => {
        const { refreshToken: requestToken } = req.body;

        if (requestToken == null) {
            return res.status(403).json({ status: 'noToken', message: "Refresh Token is required!" });
        }

        try {
            let refreshToken = await RefreshToken.findOne({ token: requestToken });

            if (!refreshToken) {
                res.status(403).json({ status: 'noToken', message: "Refresh token is not in database!" });
                return;
            }

            if (RefreshToken.verifyExpiration(refreshToken)) {
                RefreshToken.findByIdAndRemove(refreshToken._id, { useFindAndModify: false }).exec();

                res.status(403).json({
                    status: 'noTokenExp',
                    message: "Refresh token was expired. Please make a new signin request",
                });
                return;
            }

            let newAccessToken = jwt.sign({ id: refreshToken.user._id }, 'secretkey', {
                expiresIn: tokenExpires,
            });

            return res.status(200).json({
                status: 'newToken',
                accessToken: newAccessToken,
                refreshToken: refreshToken.token,
            });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ status: 'failed2', message: err });
        }
    },

    //Metodo para enviar correo electronico
    sendMail: (request, response) => {

        //Establecemos la opciones de envio

        var mailOptions = {
            from: "UNAHLibrate <unahlibate-noreply@gmail.com>",
            to: request.body.user.email,
            subject: "Confirmación de cuenta: UNAHLibrate",
            //text: "Holaaaa, soy sexi XD"
            html: `<div><h3>¡Bienvenido a UNAHLibrate!</h3>
            <p>Clickea el siguiente enlace para verificar tu cuenta y sé parte de la comunidad:</p>
            <a href="http://unahlibrate.herokuapp.com/verify-user/${request.body.user._id}">Verifica tu cuenta</a></div>`
        }

        //Finalmente se envia el correo
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("hubo error");
                console.log(error)
                return response.status(500).send(error.message);
            } else {
                console.log("Email enviando");
                return response.status(200).send({
                    status: "success",
                    userMailSent: request.body.user.email
                });
            }
        });
    },
    verifyUser: (request, response) => {
        var userId = request.params.id;

        user.findOneAndUpdate({ _id: userId }, { verified: true }, { new: true }, (err, verifiedUser) => {
            if (err || !verifiedUser) {
                console.log(err);
                return response.status(404).send({
                    status: 'error',
                    message: "El usuario no ha podido ser verificado."
                });
            } else {
                /*
                return response.status(200).send({
                    status: 'success',
                    user: verifiedUser
                })
                */
                return response.status(200).send(`<div style='margin:auto;background-color: lightgrey; color: black;text-align:center;font-family:courier,arial,helvetica;margin-top:10%;'>
                    Tu cuenta de UNAHLibrate "${verifiedUser.user}" en el correo ${verifiedUser.email} ha sido verificada.
                    </div>`);
            }
        });

    },

    //Método para probar el acceso a recursos con usuario autenticado.
    userPanel: (request, response) => {
        /*
        response.status(200).json({
            status: 'success',
            message: 'Acceso concedido al contenido.'
        });
        */
        console.log('Se llegó al userPanel');
        return response.status(200).send({
            status: 'success',
            message: 'Tienes acceso, es permitido.',
            loggedUser: response.userData
        });
    },

    //Método de acceso público (que no necesita acceso de usuario).
    generalPanel: (request, response) => {
        return response.status(200).send({
            status: 'success'
        })
    },

    //Metodo para cargar imagen de perfil
    uploadProfileImage: (req, res) => {
        //configurar el modulo connect multiparty router/user_routes.js Listo!!
        console.log(req);
        console.log(req.files);
        // Recoger el archivo de la peticion
        var fileName = 'imagen no subida';
        var files = req.files;
        if (!files) {
            return res.status(404).send({
                status: 'error',
                message: fileName
            });
        }
        //Conseguir el nombre y la extension del archivo
        var filePath = req.files.file0.path;
        var fileSplit = filePath.split(`${path.sep}`) //Para linux es /

        //Nombre del archivo
        fileName = fileSplit[fileSplit.length - 1];
        //Extension del archivo
        var extensionSplit = fileName.split('\.');
        var fileExtension = extensionSplit[extensionSplit.length - 1];
        //Comprobar con la extension, solo imagenes, si no es valida borrar el fichero
        if
            (fileExtension != 'png' && fileExtension != 'jpg' && fileExtension != 'jpeg' && fileExtension != 'gif') {
            //borrar el archivo
            fs.unlink(filePath, (err) => {
                return res.status(200).send({
                    status: 'error',
                    message: 'extension de la imagen invalida'
                });
            });
        } else {
            //Si todo es valido, sacar ide de la URL
            var userID = req.params.id;
            //Si todo es valido, buscar el articulo, asiganar le la imagen y actulizarlo
            user.findOneAndUpdate({ _id: userID }, { imageProfile: fileName }, { new: true }, (err, userUpdate) => {

                if (err || !userUpdate) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'error al guardar la imagen del perfil'
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    user: userUpdate
                });
            });
        }
    },
    uploadProfileImageGoogle: (req, res) => {

    var userID = req.params.id;

    const oauth2Client = new google.auth.OAuth2(
      CLIENT_ID,
      CLIENT_SECRET,
      REDIRECT_URI
    )

    oauth2Client.setCredentials({refresh_token: REFRESH_TOKEN});

    const drive = google.drive({version: 'v3', auth: oauth2Client});

    var fileName = 'imagen no subida';
    var files = req.files;
    if (!files) {
        return res.status(404).send({
            status: 'error',
            message: fileName
        });
    }
    //Conseguir el nombre y la extension del archivo
    var filePath = req.files.file0.path;
    var fileSplit = filePath.split(`${path.sep}`) //Para linux es /

    //Nombre del archivo
    fileName = fileSplit[fileSplit.length - 1];
    //Extension del archivo
    var extensionSplit = fileName.split('\.');
    var fileExtension = extensionSplit[extensionSplit.length - 1];
    //Comprobar con la extension, solo imagenes, si no es valida borrar el fichero
    if
        (fileExtension != 'png' && fileExtension != 'jpg' && fileExtension != 'jpeg' && fileExtension != 'gif') {
        //borrar el archivo
        fs.unlink(filePath, (err) => {
            return res.status(501).send({
                status: 'error',
                message: 'extension de la imagen invalida'
            });
        });
    } else {

        drive.files.create({
              requestBody: {
                'name': fileName,
                'parents': [''], //Id de la carpeta users, preguntar por él
                   'mimeType': `image/${fileExtension}`
             },
              media: {
                mimeType: `image/${fileExtension}`,
                body: fs.createReadStream(`${filePath}`)
              }
        }, (err, file) => {
            if (err){
                console.log(err);
                return res.status(500).send({
                    status: 'error', 
                    message: 'Error en la subida de la imagen'
                })
            } else {
                console.log('FileId: ' + file.data.id);
                drive.permissions.create({fileId: file.data.id, requestBody: {role: 'reader', type: 'anyone'}}, (err2, permission) => {
                    if (err2) {
                        console.log(err2);
                        return res.status(500).send({
                            status: 'error', 
                            message: 'Error en los permisos de la imagen'
                        });
                    } else {
                        console.log(file.data.id);
                        drive.files.get({fileId: file.data.id, fields: '*'}, (err3, gotFile) => { //fields: 'webViewLink, webContentLink'
                            if (err3){
                                console.log(file.data.id);
                                console.log(err3);
                                return res.status(500).send({
                                    status: 'error', 
                                    message: 'Error en los permisos de la imagen'
                                });
                            } else {
                                let fileLink = gotFile.data.webContentLink.split(`&`)[0];

                                //var {fileLink} = response;

                                user.findOneAndUpdate({ _id: userID }, { imageProfile: fileLink }, { new: true }, (err, userUpdate) => {

                                        if (err || !userUpdate) {
                                            return res.status(404).send({
                                                status: 'error',
                                                message: 'error al guardar la imagen del perfil'
                                            });
                                        }
                                        return res.status(200).send({
                                            status: 'success',
                                            user: userUpdate
                                        });
                                    });

                            }
                        })
                    }
                });
            }
        });
    }

    },
    
    //Metodo para obtner imagen de perfil(get)
    //Creo que hay que hacer algunos cambios
    getProfileImage: (req, res) => {
        var file = req.params.image;
        var pathFile = '../uploads/users/' + file;
        console.log(pathFile);
        fs.stat(pathFile, (err, exists) => {

            if (err) {
                return res.status(404).send({
                    status: 'error',
                    message: 'imagen no encontrada',
                    error: err
                });
            } else {
                return res.sendFile(path.resolve(pathFile));
            }
        });
    },

    //Actualizar usuario -sin contraseña-.
    updateUser: (request, response) => {

        //Recoger el id del usuario por la URL
        var userId = request.params.id;

        //Recoger los datos que llegan por put
        var params = request.body;
        console.log('Params con campos especiales.');
        console.log(params);

        //Si viene una contraseña en el cuerpo de la petición.
        if (params._id) delete params._id;
        if (params.password) delete params.password;

        if (params.verified != undefined) {
            console.log('El verified se comprueba aquí.');
            delete params.verified;
        }

        if (params.date) delete params.date;
        if (params.restoreToken) delete params.restoreToken;
        console.log('Params con lo eliminado.');
        console.log(params);

        //Por si se va a cambiar el correo:
        var verificarOtraVez;
        var newParams = params;

        console.log(newParams);

        //Por el momento, es obligatorio recibir en la petición el "user" y el "email" del usuario a actualizar.
        if (!params.user || !params.email) return response.status(404).json({ status: 'failed', message: 'Faltan datos.' });

        //Encontrar el usuario que se va a actualizar:
        user.findById(userId, (errr, userToUpdate) => {

            if (errr || !userToUpdate) {
                console.log(errr);
                return response.status(500).send({ status: 'serverError', message: '(find) Error del servidor.' });
            }

            else if (userToUpdate) { //Si está, hacer las comparaciones.

                //Buscar por el usuario.
                user.find({ 'user': params.user }, (err, foundUser) => {

                    if (err) {
                        console.log(err);
                        return response.status(500).send({ status: 'serverError', message: '(user) Error del servidor.' });
                    }

                    if (foundUser.length == 0 || foundUser[0].user === userToUpdate.user) {

                        //No hay problema con el usuario, ahora veremos el correo.
                        user.find({ 'email': params.email }, (error, foundEmail) => {

                            if (error) {
                                console.log(error);
                                return response.status(500).send({ status: 'serverError', message: '(email) Error del servidor.' });
                            }

                            if (foundEmail.length == 0 || foundEmail[0].email === userToUpdate.email) {

                                console.log(foundEmail);
                                //Esto es por si se cambió de correo el usuario. Necesita volverse a validar.
                                if (foundEmail.length == 0) verificarOtraVez = true;

                                //Se gana acceso a actualizar el usuario.
                                //Es decir, es permitido que se actualice el usuario.
                                console.log('Llego acá, a ver con verificarOtraVez', verificarOtraVez);
                                //Validar los datos con validator
                                try {
                                    console.log('Llego acá.');
                                    var validateUser = !validator.isEmpty(params.user);
                                    var validateEmail = !validator.isEmpty(params.email);
                                    var validateName = !validator.isEmpty(params.name);
                                    var validateLastName = !validator.isEmpty(params.lastname);
                                } catch (err) {
                                    return response.status(400).send({
                                        status: 'error',
                                        message: "Faltan datos por enviar"
                                    });
                                }

                                if (verificarOtraVez === true) {
                                    console.log(verificarOtraVez);
                                    newParams.verified = false;
                                }

                                if (validateUser && validateEmail && validateName && validateLastName) {
                                    //Find and update
                                    user.findOneAndUpdate({ _id: userId }, newParams, { new: true }, (error, userUpdated) => {
                                        if (error) {
                                            return response.status(500).send({
                                                status: 'error',
                                                message: 'Error al actualizar.'
                                            });
                                        }
                                        if (!userUpdated) {
                                            return response.status(404).send({
                                                status: 'error',
                                                message: 'El usuario no existe.'
                                            });
                                        }

                                        //Se guardan los datos
                                        console.log('Lo logré:');
                                        return response.status(200).send({
                                            status: 'success',
                                            user: userUpdated
                                        })
                                    })
                                } else {
                                    return response.status(404).send({
                                        status: 'error',
                                        message: 'La validación no es correcta.'
                                    });
                                }

                            } else {
                                console.log(foundUser[0]);
                                return response.status(404).send({ status: 'emailError', message: 'Correo en uso ya.' });
                            }

                        }); //Fin del find por correo.

                    } else {
                        console.log(foundUser[0]);
                        return response.status(404).send({ status: 'userError', message: 'Usuario en uso ya.' });
                    }

                }); //Fin del find por user.

            }

        }) //Fin del user.findById.

    }, //Fin del método updateUser.
    //Método para cambiar la contraseña, con la sesión iniciada. Se tiene que tratar con una promesa.
    changePassword: async (request, response) => {
        // return response.status(200).send({status: 'success'});
        var userId = request.params.id;
        var params = request.body;

        if (!(params.oldPass) || !(params.newPass)) {
            console.log("Falta algún parámetro.");
            return response.status(404).send({ status: 'dataError', message: 'Faltan datos. Se necesitan contraseña actual y nueva.' });
        } else if (params.oldPass == params.newPass) {
            console.log("Contraseñas iguales");
            return response.status(404).send({ status: 'sameValuesError', message: "Son la misma contraseña, intenta con diferentes." });
        }

        try {
            var foundUser = await user.findById(userId).exec();
        }
        catch (findError) {
            console.log(findError);
            return response.status(500).send({ status: 'findFailed', message: 'Error en el servidor, intente de nuevo.' });
        }

        try {
            var validateOldPass = !(validator.isEmpty(params.oldPass));
            var validateNewPass = !(validator.isEmpty(params.oldPass));
        }
        catch (err) {
            console.log(err);
            return response.status(500).send({ status: 'validateFailed', message: 'Faltan datos por enviar, intente de nuevo.' });
        }

        if (validateOldPass && validateNewPass) {

            //var hashOldPass = bcrypt.hashSync(params.oldPass, 10);

            //var contrasenaCompatible = bcrypt.compareSync(hashOldPass, foundUser.password);
            var contrasenaCompatible = bcrypt.compareSync(params.oldPass, foundUser.password);
            if (!contrasenaCompatible) {
                console.log(contrasenaCompatible);
                return response.status(404).send({ status: 'oldPassError', message: 'Tu contraseña actual es incorrecta.' });
            }
            else {
                try {

                    var hashNewPass = bcrypt.hashSync(params.newPass, 10);

                    var userUpdated = await user.findOneAndUpdate({ _id: userId }, { password: hashNewPass }, { new: true }).exec();

                    return response.status(200).send(
                        {
                            status: 'success',
                            user: userUpdated
                        }
                    );

                } catch (updateError) {
                    console.log(updateError);
                    return response.status(500).send({ status: 'failed', message: 'Error, intente de nuevo.' });
                }
            }

        } else {
            return response.status(404).send({
                status: 'error',
                message: 'Validacion incorrecta.'
            });
        }

    }, //Fin de changePassword.
    forgotPassword: async (request, response) => {

        //¿Tengo una pregunta existencial acá, lo voy a dejar como usuario o como correo? Jaja. Lo dejaré por usuario, el método por correo solo llevaría pequeños cambios.

        //Por usuario, acá:

        var userName = request.body.user;
        console.log(userName);

        try {
            var foundUser = await user.findOne({ user: userName }).exec();
            console.log(foundUser);
            //Si se encuentra, generar el token.
            var restoreToken = jwt.sign({ user: foundUser.user, email: foundUser.email }, 'secretsecret', { expiresIn: '5m' });
            //Generar también un enlace para enviar en el correo al que se va a recuperar la contraseña.
            var linkForEmail = `http://unahlibrate.herokuapp.com/restore-password/${restoreToken}`;

        } catch (foundUserErr) {
            console.log(foundUserErr);
            if (foundUser == null) return response.status(404).send({ status: 'userError', message: 'No existe usuario.' });
            return response.status(500).send({ status: 'serverError', message: 'Error en la búsqueda.' });
        }

        try {

            //Agregar al modelo ese último token. Se agrega al modelo "user" este campo para tener un mayor control de las recuperaciones de contraseña.
            var userUpdated = await user.findOneAndUpdate({ user: userName }, { restoreToken }, { new: true }).exec();

        } catch (userUpdatedError) {
            console.log(userUpdatedError);
            return response.status(500).send({ status: 'serverError', message: 'Error en la actualización.' });
        }

        //Si se hace lo anterior correctamente, se envía el correo. (PARA ESTO, EL TRANSPORTER DEBE ESTAR ACTIVADO CON LAS CREDENCIALES QUE DEBEN SER).
        if (linkForEmail) {
            var mailOptions = {
                from: "UNAHLibrate <unahlibate-noreply@gmail.com>",
                to: foundUser.email,
                subject: "Recuperación de cuenta: UNAHLibrate",
                //text: "Holaaaa, soy sexi XD"
                html: `<div>
            <p>Clickea el siguiente enlace para recuperar tu cuenta y tener una nueva contraseña:</p>
            <a href="${linkForEmail}">Recupera tu contraseña</a></div>`
            }

            //Finalmente se envia el correo
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log("hubo error enviando correo");
                    console.log(error)
                    return response.status(500).send({ status: 'emailFailed', message: error.message });
                } else {
                    console.log("Email de recuperación enviado");
                    return response.status(200).send({
                        status: "success",
                        userMailSent: foundUser.email,
                        message: "Revisa tu correo, te enviamos uno con pasos para recuperar tu cuenta."
                    });
                }
            });
        }

        /* RETORNO PARA MOTIVOS DE PRUEBAS. ESTE RETORNO SE USA EN CASO DE QUE NO SE IMPLEMENTE EL CORREO.
        return response.status(200).send({
            status: "success",
            userMailSent: foundUser.email,
            message: "Revisa tu correo, te enviamos uno con pasos para recuperar tu cuenta.",
            //token: restoreToken,
            //userUpdated,
            //linkForEmail
        });
        */

    }, //Fin forgotPassword
    restorePassword: (request, response) => {

        //Tomando los parámetros, el token -que se envía en el header de la petición, uno llamado "reset"- y la nueva contraseña en los parámetros.
        const restoreToken = request.headers.reset;
        const { newPass } = request.body; //La nueva contraseña.

        //Verificar que el token esté válido y aún no expirado.
        jwt.verify(restoreToken, 'secretsecret', (err, payloadFound) => {
            if (err || !payloadFound) {
                if (err instanceof TokenExpiredError) {
                    return response.status(403).send({
                        status: 'expired',
                        message: 'El token ha expirado.'
                    });
                } else {
                    console.log(err);
                    return response.status(401).send({
                        status: 'tokenError',
                        message: 'El token no sirve.'
                    });
                }
            } else if (payloadFound) {
                console.log(`Este es payload:`);
                console.log(payloadFound);
                //Esto, traer la información decodificada.
                var payload = payloadFound;


                //Se encontró que el token es bueno, ese lo utilizaremos para encontrar el usuario en cuestión.
                //Ahora, tengo que buscar el usuario por el restoreToken.
                user.findOne({ restoreToken: restoreToken }, (error, foundUser) => {

                    if (error || !foundUser || foundUser == undefined) {
                        console.log(error);
                        return response.status(404).send({ status: 'userError', message: "Error encontrando al usuario" });
                    } else {

                        //Se encontró el usuario.
                        //Validación de que exista newPass.
                        try {
                            var validateNewPass = !validator.isEmpty(newPass);
                        } catch (errorr) {
                            return response.status(501).send({ status: 'passFailed', message: 'Error en las validaciones.' });
                        }

                        if (validateNewPass) {

                            //Aquí hacemos lo referente al cambio de contraseña.

                            var hash = bcrypt.hashSync(newPass, 10);

                            //Actualizo la contraseña del usuario.
                            user.findOneAndUpdate({ restoreToken }, { password: hash }, { new: true }, (updateErr, userUpdated) => {

                                if (updateErr || !userUpdated || userUpdated == undefined) {
                                    console.log(updateErr);
                                    return response.status(501).send({ status: 'updateFailed', message: 'Error en la actualización.' });
                                } else {
                                    console.log('This is the updated user: ');
                                    console.log(userUpdated);
                                    return response.status(200).send({
                                        status: 'success',
                                        message: 'Contraseña cambiada.',
                                        //user: userUpdated
                                    })
                                }

                            }); //Fin del user.findOneandUpdate

                        } else return response.status(404).send({ status: 'passFailed', message: 'La contraseña debe ingresarse.' });

                    }

                }); //Fin del user.findOne

            }
        }); //Fin del jwt.verify.

    } //Fin restorePassword


};



module.exports = controller;