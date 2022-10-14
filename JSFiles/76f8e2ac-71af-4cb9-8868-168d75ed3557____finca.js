const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isNotLoggedIn } = require('../lib/auth');
const pool = require('../database');
const helpers = require('../lib/helpers');
var fs = require('fs');

//Api para obtener los departamentos
router.post('/api/get_departamentos', async (req, res) => {
    let departamentos = await pool.query("SELECT DISTINCT id_departamento_dane, nombre_departamento FROM municipio order by nombre_departamento");
    if (departamentos.rows.length > 0) {
        data = {
            "code": "0",
            "data": departamentos.rows
        };
    } else {
        data = {
            "code": "1",
            "error": "No existen departamentos"
        };
    }
    res.status(200).json(data);
});


//Api para obtener los municipios por departamento
router.post('/api/get_municipios', async (req, res) => {
    const { id_departamento } = req.body;
    let municipios = await pool.query("SELECT id, id_municipio_dane, nombre_municipio FROM municipio where id_departamento_dane = $1 order by nombre_municipio", [id_departamento]);
    if (municipios.rows.length > 0) {
        data = {
            "code": "0",
            "data": municipios.rows
        };
    } else {
        data = {
            "code": "1",
            "error": "No existen municipios"
        };
    }
    res.status(200).json(data);
});


//Api para obtener las veredas por municipio de la base de datos
router.post('/api/get_veredas', async (req, res) => {
    const { id_municipio_dane } = req.body;
    let veredas = await pool.query("SELECT id, nombre_vereda as nombre FROM vereda where id_municipio = $1 order by nombre_vereda", [id_municipio_dane]);
    if (veredas.rows.length > 0) {
        data = {
            "code": "0",
            "data": veredas.rows
        };
    } else {
        data = {
            "code": "1",
            "error": "No existen veredas"
        };
    }
    res.status(200).json(data);
});


//Guardar informacion de finca para carga inicial
router.post('/api/save_finca_inicial', async (req, res) => {
    const { nombre, id_vereda, longitud, latitud, documento_tecnico } = req.body;
    const finca = await pool.query('INSERT INTO finca(nombre, id_vereda, longitud, latitud, documento_tecnico) VALUES ($1, $2, $3, $4, $5)', [nombre, id_vereda, longitud, latitud, documento_tecnico]);
    const idFinca = await pool.query('SELECT LASTVAL()');
   

    let fecha = new Date();
    const encuesta = await pool.query("SELECT id, nombre FROM encuesta where activo is true order by nombre");

    const encuesta_finca = await pool.query('INSERT INTO encuesta_respuesta(terminada, fecha, id_finca, id_encuesta) VALUES (false, $1, $2, $3)', [fecha, idFinca.rows[0].lastval, encuesta.rows[0].id]);

    
    if (finca) {
        data = {
            "code": "0",
            "message": "Información de la finca guardada correctamente",
            "idFinca": idFinca.rows,
            "save": true
        };
    } else {
        data = {
            "code": "1",
            "update": false,
            "error": "Error al guardar los datos de la finca"
        };
    }
    res.status(200).json(data);
});

//Api para obtener las tipo vias activos de la base de datos
router.post('/api/get_tipo_via', async (req, res) => {
    let tipoVias = await pool.query("SELECT id, nombre FROM tipo_via where estado is true order by nombre");
    if (tipoVias.rows.length > 0) {
        data = {
            "code": "0",
            "data": tipoVias.rows
        };
    } else {
        data = {
            "code": "1",
            "error": "No existen tipo Vias"
        };
    }
    res.status(200).json(data);
});

//Api para obtener los tipos de los estados vias activos de la base de datos
router.post('/api/get_estado_via', async (req, res) => {
    let estadoVias = await pool.query("SELECT id, nombre FROM estado_via where estado is true order by nombre");
    if (estadoVias.rows.length > 0) {
        data = {
            "code": "0",
            "data": estadoVias.rows
        };
    } else {
        data = {
            "code": "1",
            "error": "No existen estados Vias"
        };
    }
    res.status(200).json(data);
});


//Api para obtener los tipos de los estados vias activos de la base de datos
router.post('/api/get_tipos_gases', async (req, res) => {
    let tiposGases = await pool.query("SELECT id, nombre FROM gas where estado is true order by nombre");
    if (tiposGases.rows.length > 0) {
        data = {
            "code": "0",
            "data": tiposGases.rows
        };
    } else {
        data = {
            "code": "1",
            "error": "No existen tipos de gases"
        };
    }
    res.status(200).json(data);
});

//Api para obtener los tipos de agua
router.post('/api/get_tipos_agua', async (req, res) => {
    let tiposAgua = await pool.query("SELECT id, nombre FROM agua where estado is true order by nombre");
    if (tiposAgua.rows.length > 0) {
        data = {
            "code": "0",
            "data": tiposAgua.rows
        };
    } else {
        data = {
            "code": "1",
            "error": "No existen tipos de agua"
        };
    }
    res.status(200).json(data);
});

//Api para obtener los de operadores de television
router.post('/api/get_operator_tv', async (req, res) => {
    let operadorTv = await pool.query("SELECT id, nombre FROM operador_tv where estado is true order by nombre");
    if (operadorTv.rows.length > 0) {
        data = {
            "code": "0",
            "data": operadorTv.rows
        };
    } else {
        data = {
            "code": "1",
            "error": "No existen tipos de operadores"
        };
    }
    res.status(200).json(data);
});

//Api para obtener las actividades Productivas activas de la base de datos
router.post('/api/get_actividades_productivas', async (req, res) => {
    let actividadesProductivas = await pool.query("SELECT id, nombre FROM actividades_productivas where estado is true order by nombre");
    if (actividadesProductivas.rows.length > 0) {
        data = {
            "code": "0",
            "data": actividadesProductivas.rows
        };
    } else {
        data = {
            "code": "1",
            "error": "No existen actividades Productivas"
        };
    }
    res.status(200).json(data);
});


//Api para obtener las tipos de predios activos de la base de datos
router.post('/api/get_tipos_predios', async (req, res) => {
    let tiposPredios = await pool.query("SELECT id, nombre FROM predio where estado is true order by nombre");
    if (tiposPredios.rows.length > 0) {
        data = {
            "code": "0",
            "data": tiposPredios
        };
    } else {
        data = {
            "code": "1",
            "error": "No existen tipos Predios"
        };
    }
    res.status(200).json(data);
});

//Api para obtener los servicios públicos activos de la base de datos
router.post('/api/get_servicios_publicos', async (req, res) => {
    let serviciosPublicos = await pool.query("SELECT id, nombre FROM servicios_publicos where estado is true order by nombre");
    if (serviciosPublicos.rows.length > 0) {
        data = {
            "code": "0",
            "data": serviciosPublicos.rows
        };
    } else {
        data = {
            "code": "1",
            "error": "No existen servicios Publicos"
        };
    }
    res.status(200).json(data);
});



//Api para obtener los estados tendencias tierra activos de la base de datos
router.post('/api/get_tendencias_tierra', async (req, res) => {
    let estadosTendenciaTierra = await pool.query("SELECT id, nombre FROM estado_tendencia_tierra where estado is true order by nombre");
    if (estadosTendenciaTierra.rows.length > 0) {
        data = {
            "code": "0",
            "data": estadosTendenciaTierra.rows
        };
    } else {
        data = {
            "code": "1",
            "error": "No existen estados tendencias tierra"
        };
    }
    res.status(200).json(data);
});

//Api para obtener los datos iniciales guardados de la finca para mostrarlos  y mostrar el restode info de la finca
router.post('/api/get_finca_id', async (req, res) => {
    const { id_finca } = req.body;
    let finca = await pool.query("SELECT id, nombre, id_vereda, longitud, latitud, documento_tecnico FROM finca where id = $1", [id_finca]);
    if (finca.rows.length > 0) {
        data = {
            "code": "0",
            "data": finca.rows
        };
    } else {
        data = {
            "code": "1",
            "error": "No existen la finca"
        };
    }
    res.status(200).json(data);
});

//Update informacion de finca todos los datos
router.post('/api/update_finca', async (req, res) => {
    let { id_tipo_via, id_estado_via, id_gas,
        altitud, analisis_suelos_2_anos, area_total_hectareas,
        disponibilidad_vias_acceso, distancia_cabecera, electricidad,
        acueducto, pozo_septico, internet, celular, infraestructura_productiva_existente,
        television, id_opeador_tv, id_estado_tendencia_tierra, public_service, products_activities, tipo_aguas, id,
        adscrita_organizacion, id_organizacion, otro_operador, medida, valor_promedio_tierra } = req.body;
  
    let organiza = id_organizacion != undefined ? id_organizacion.id : undefined
    let fecha = new Date();
    public_service.forEach(async element => {
        try {
            const insert_public_services_farm = await pool.query("INSERT INTO finca_servicios_publicos(id_finca, id_servicios_publicos, fecha) \
            VALUES ($1, $2, $3)", [id, element.id, fecha]);
        } catch (err) {
            console.log(err);
        }
    });

    products_activities.forEach(async element2 => {
        try {
            const insert_products_activities_farm = await pool.query("INSERT INTO finca_actividades_productivas(id_finca, id_actividades_productivas, fecha) \
            VALUES ($1, $2, $3)", [id, element2.id, fecha]);
        } catch (err) {
            console.log(err);
        }
    });

    tipo_aguas.forEach(async element2 => {
        try {
            const insert_tipo_aguas_finca = await pool.query("INSERT INTO finca_aguas(id_finca, id_agua, fecha) \
            VALUES ($1, $2, $3)", [id, element2.id, fecha]);
        } catch (err) {
            console.log(err);
        }
    });


    

    const finca = await pool.query("UPDATE finca SET   id_tipo_via=$1, id_estado_via=$2, \
        id_gas=$3, altitud=$4, analisis_suelos_2_anos=$5, \
        area_total_hectareas=$6, disponibilidad_vias_acceso=$7, distancia_cabecera=$8, \
        id_agua=$9, electricidad=$10, acueducto=$11, pozo_septico=$12, internet=$13, \
        celular=$14, infraestructura_productiva_existente=$15, fecha=$16, television=$17, \
        id_opeador_tv=$18, id_estado_tendencia_tierra=$19, id_organizacion=$20, adscrita_organizacion=$21, otro_operador=$22, medida=$23, valor_promedio_tierra=$24 WHERE id = $25", [id_tipo_via, id_estado_via, id_gas,
        altitud, analisis_suelos_2_anos, area_total_hectareas,
        disponibilidad_vias_acceso, distancia_cabecera, id_agua, electricidad,
        acueducto, pozo_septico, internet, celular, infraestructura_productiva_existente,
        fecha, television, id_opeador_tv, id_estado_tendencia_tierra, organiza, adscrita_organizacion, otro_operador, medida, valor_promedio_tierra, id]);

    if (finca) {
        data = {
            "code": "0",
            "message": "Información de la finca actualizada correctamente",
            "save": true
        };
    } else {
        data = {
            "code": "1",
            "update": false,
            "error": "Error al guardar los datos de la finca"
        };
    }
    res.status(200).json(data);
});

//Api para obtener los tipos de predios para guardar las imágenes de la finca de acuerdo al tipo de predio
router.post('/api/get_tipo_predios', async (req, res) => {
    let tiposPredio = await pool.query("SELECT id, nombre FROM predio where estado is true order by nombre");
    if (tiposPredio.rows.length > 0) {
        data = {
            "code": "0",
            "data": tiposPredio
        };
    } else {
        data = {
            "code": "1",
            "error": "No existen tipos de predios"
        };
    }
    res.status(200).json(data);
});

//Faltan llenar las tabla n a n, pedende de como envíe la info en front



//Api para obtener las actividades productivas de la finca para mostrar las preguntas respectivas
router.post('/api/get_finca_actividades_productivas', async (req, res) => {
    const { id_finca } = req.body;
    let finca = await pool.query("SELECT id, nombre, id_vereda, longitud, latitud FROM finca where id = $1", [id_finca]);
    if (finca.rows.length > 0) {
        data = {
            "code": "0",
            "data": finca.rows
        };
    } else {
        data = {
            "code": "1",
            "error": "No existen la finca"
        };
    }
    res.status(200).json(data);
});


//Guardar los adjuntos de la finca
router.post('/api/save_attachments', async (req, res) => {
    const { id_finca, photoDocumentPicture, extensionDocumentPicture, photoCover, extensionCover, photoHouse, extensionHouse, photoInfrastructure, extensionInfrastructure,
    photoColtive, extensionColtive, photoSoilAnalysis, extensionSoilAnalysis, photoPrincipalProductAgricultural, extensionPrincipalProductAgricultural,
    photoSecondaryProductAgricultural, extensionSecondaryProductAgricultural, photoPrincipalProductLivestock, extensionPrincipalProductLivestock,
    photoSecondaryProductLivestock, extensionSecondaryProductLivestock, photoPrincipalProductAquaculture, extensionPrincipalProductAquaculture,
    photoSecondaryProductAquaculture, extensionSecondaryProductAquaculture, photoForest, extensionForest } = req.body;
    //creo carpeta de la finca
    let path = "src/public/fincas/"+id_finca;
    if(!fs.existsSync(path)){
        fs.mkdirSync(path, 0777);
    }

    //Documento
    if(photoDocumentPicture && extensionDocumentPicture){
        let nameDocumentPictureBD = 'documento'+'.'+extensionDocumentPicture;
        let fileDocumentPicture = path+"/"+'documento'+'.'+extensionDocumentPicture;
        let nameFileDocumentPicture = 'http://181.129.226.226:3000/fincas/'+id_finca+"/"+'documento'+'.'+extensionDocumentPicture;
        fs.writeFile(fileDocumentPicture, photoDocumentPicture, {encoding: 'base64'}, async function(err) {
            if (err) {
                console.log("Error al crear la imagen del documento");
            } else {
                let saveFileDocumentPicture = await pool.query('INSERT INTO adjuntos (nombre, ruta, id_finca) VALUES ($1, $2, $3)', [nameDocumentPictureBD, nameFileDocumentPicture, id_finca]);
            }
        });
    }

    //Portada
    if(photoCover && extensionCover){
        let nameCoverPictureBD = 'portada'+'.'+extensionCover;
        let fileCoverPicture = path+"/"+'portada'+'.'+extensionCover;
        let nameCoverPicture = 'http://181.129.226.226:3000/fincas/'+id_finca+"/"+'portada'+'.'+extensionCover;
        fs.writeFile(fileCoverPicture, photoCover, {encoding: 'base64'}, async function(err) {
            if (err) {
                console.log("Error al crear la imagen del portada");
            } else {
                let saveCoverPicture = await pool.query('INSERT INTO adjuntos (nombre, ruta, id_finca) VALUES ($1, $2, $3)', [nameCoverPictureBD, nameCoverPicture, id_finca]);
            }
        });
    }

    //Casa Principal
    if(photoHouse && extensionHouse){
        let nameHousePictureBD = 'casa_principal'+'.'+extensionHouse;
        let fileHousePicture = path+"/"+'casa_principal'+'.'+extensionHouse;
        let nameHousePicture = 'http://181.129.226.226:3000/fincas/'+id_finca+"/"+'casa_principal'+'.'+extensionHouse;
        fs.writeFile(fileHousePicture, photoHouse, {encoding: 'base64'}, async function(err) {
            if (err) {
                console.log("Error al crear la imagen de la casa principal");
            } else {
                let saveHousePicture = await pool.query('INSERT INTO adjuntos (nombre, ruta, id_finca) VALUES ($1, $2, $3)', [nameHousePictureBD, nameHousePicture, id_finca]);
            }
        });
    }

    //Infraestructura
    if(photoInfrastructure && extensionInfrastructure){
        let nameInfrastructureBD = 'infraestructura'+'.'+extensionInfrastructure;
        let fileInfrastructure = path+"/"+'infraestructura'+'.'+extensionInfrastructure;
        let nameInfrastructure = 'http://181.129.226.226:3000/fincas/'+id_finca+"/"+'infraestructura'+'.'+extensionInfrastructure;
        fs.writeFile(fileInfrastructure, photoInfrastructure, {encoding: 'base64'}, async function(err) {
            if (err) {
                console.log("Error al crear la imagen de la Infraestructura");
            } else {
                let saveInfrastructure = await pool.query('INSERT INTO adjuntos (nombre, ruta, id_finca) VALUES ($1, $2, $3)', [nameInfrastructureBD, nameInfrastructure, id_finca]);
            }
        });
    }

    //Cultivo
    if(photoColtive && extensionColtive){
        let nameColtiveBD = 'cultivo'+'.'+extensionColtive;
        let fileColtive = path+"/"+'cultivo'+'.'+extensionColtive;
        let nameColtive = 'http://181.129.226.226:3000/fincas/'+id_finca+"/"+'cultivo'+'.'+extensionColtive;
        fs.writeFile(fileColtive, photoColtive, {encoding: 'base64'}, async function(err) {
            if (err) {
                console.log("Error al crear la imagen del Cultivo");
            } else {
                let saveColtive = await pool.query('INSERT INTO adjuntos (nombre, ruta, id_finca) VALUES ($1, $2, $3)', [nameColtiveBD, nameColtive, id_finca]);
            }
        });
    }

    //Analisis de Suelo
    if(photoSoilAnalysis && extensionSoilAnalysis){
        let nameSoilAnalysisBD = 'analisis_suelo'+'.'+extensionSoilAnalysis;
        let fileSoilAnalysis = path+"/"+'analisis_suelo'+'.'+extensionSoilAnalysis;
        let nameSoilAnalysis = 'http://181.129.226.226:3000/fincas/'+id_finca+"/"+'analisis_suelo'+'.'+extensionSoilAnalysis;
        fs.writeFile(fileSoilAnalysis, photoSoilAnalysis, {encoding: 'base64'}, async function(err) {
            if (err) {
                console.log("Error al crear la imagen del Analisis de Suelo");
            } else {
                let saveSoilAnalysis = await pool.query('INSERT INTO adjuntos (nombre, ruta, id_finca) VALUES ($1, $2, $3)', [nameSoilAnalysisBD, nameSoilAnalysis, id_finca]);
            }
        });
    }

    //Producto Principal Agricultura
    if(photoPrincipalProductAgricultural && extensionPrincipalProductAgricultural){
        let namePrincipalProductAgriculturalBD = 'producto_principal_agricultura'+'.'+extensionPrincipalProductAgricultural;
        let filePrincipalProductAgricultural = path+"/"+'producto_principal_agricultura'+'.'+extensionPrincipalProductAgricultural;
        let namePrincipalProductAgricultural = 'http://181.129.226.226:3000/fincas/'+id_finca+"/"+'producto_principal_agricultura'+'.'+extensionPrincipalProductAgricultural;
        fs.writeFile(filePrincipalProductAgricultural, photoPrincipalProductAgricultural, {encoding: 'base64'}, async function(err) {
            if (err) {
                console.log("Error al crear la imagen de Producto Principal Agricultura");
            } else {
                let savePrincipalProductAgricultural = await pool.query('INSERT INTO adjuntos (nombre, ruta, id_finca) VALUES ($1, $2, $3)', [namePrincipalProductAgriculturalBD, namePrincipalProductAgricultural, id_finca]);
            }
        });
    }

    //Producto Secundario Agricultura
    if(photoSecondaryProductAgricultural && extensionSecondaryProductAgricultural){
        let nameSecondaryProductAgriculturalBD = 'producto_secundario_agricultura'+'.'+extensionSecondaryProductAgricultural;
        let fileSecondaryProductAgricultural = path+"/"+'producto_secundario_agricultura'+'.'+extensionSecondaryProductAgricultural;
        let nameSecondaryProductAgricultural = 'http://181.129.226.226:3000/fincas/'+id_finca+"/"+'producto_secundario_agricultura'+'.'+extensionSecondaryProductAgricultural;
        fs.writeFile(fileSecondaryProductAgricultural, photoSecondaryProductAgricultural, {encoding: 'base64'}, async function(err) {
            if (err) {
                console.log("Error al crear la imagen de Producto Secundario Agricultura");
            } else {
                let saveSecondaryProductAgricultural = await pool.query('INSERT INTO adjuntos (nombre, ruta, id_finca) VALUES ($1, $2, $3)', [nameSecondaryProductAgriculturalBD, nameSecondaryProductAgricultural, id_finca]);
            }
        });
    }

    //Producto Principal Pecuario
    if(photoPrincipalProductLivestock && extensionPrincipalProductLivestock){
        let namePrincipalProductLivestockBD = 'producto_principal_pecuario'+'.'+extensionPrincipalProductLivestock;
        let filePrincipalProductLivestock = path+"/"+'producto_principal_pecuario'+'.'+extensionPrincipalProductLivestock;
        let namePrincipalProductLivestock = 'http://181.129.226.226:3000/fincas/'+id_finca+"/"+'producto_principal_pecuario'+'.'+extensionPrincipalProductLivestock;
        fs.writeFile(filePrincipalProductLivestock, photoPrincipalProductLivestock, {encoding: 'base64'}, async function(err) {
            if (err) {
                console.log("Error al crear la imagen de Producto Principal Pecuario");
            } else {
                let savePrincipalProductLivestock = await pool.query('INSERT INTO adjuntos (nombre, ruta, id_finca) VALUES ($1, $2, $3)', [namePrincipalProductLivestockBD, namePrincipalProductLivestock, id_finca]);
            }
        });
    }

    //Producto Secundario Pecuario
    if(photoSecondaryProductLivestock && extensionSecondaryProductLivestock){
        let nameSecondaryProductLivestockBD = 'producto_secundario_pecuario'+'.'+extensionSecondaryProductLivestock;
        let fileSecondaryProductLivestock = path+"/"+'producto_secundario_pecuario'+'.'+extensionSecondaryProductLivestock;
        let nameSecondaryProductLivestock = 'http://181.129.226.226:3000/fincas/'+id_finca+"/"+'producto_secundario_pecuario'+'.'+extensionSecondaryProductLivestock;
        fs.writeFile(fileSecondaryProductLivestock, photoSecondaryProductLivestock, {encoding: 'base64'}, async function(err) {
            if (err) {
                console.log("Error al crear la imagen de Producto Secundario Pecuario");
            } else {
                let saveSecondaryProductLivestock = await pool.query('INSERT INTO adjuntos (nombre, ruta, id_finca) VALUES ($1, $2, $3)', [nameSecondaryProductLivestockBD, nameSecondaryProductLivestock, id_finca]);
            }
        });
    }

    //Producto Principal Acuicultura
    if(photoPrincipalProductAquaculture && extensionPrincipalProductAquaculture){
        let namePrincipalProductAquacultureBD = 'producto_principal_acuicultura'+'.'+extensionPrincipalProductAquaculture;
        let filePrincipalProductAquaculture = path+"/"+'producto_principal_acuicultura'+'.'+extensionPrincipalProductAquaculture;
        let namePrincipalProductAquaculture = 'http://181.129.226.226:3000/fincas/'+id_finca+"/"+'producto_principal_acuicultura'+'.'+extensionPrincipalProductAquaculture;
        fs.writeFile(filePrincipalProductAquaculture, photoPrincipalProductAquaculture, {encoding: 'base64'}, async function(err) {
            if (err) {
                console.log("Error al crear la imagen de Producto Principal Acuicultura");
            } else {
                let savePrincipalProductAquaculture = await pool.query('INSERT INTO adjuntos (nombre, ruta, id_finca) VALUES ($1, $2, $3)', [namePrincipalProductAquacultureBD, namePrincipalProductAquaculture, id_finca]);
            }
        });
    }

    //Producto Secundario Acuicultura
    if(photoSecondaryProductAquaculture && extensionSecondaryProductAquaculture){
        let nameSecondaryProductAquacultureBD = 'producto_secundario_acuicultura'+'.'+extensionSecondaryProductAquaculture;
        let fileSecondaryProductAquaculture = path+"/"+'producto_secundario_acuicultura'+'.'+extensionSecondaryProductAquaculture;
        let nameSecondaryProductAquaculture = 'http://181.129.226.226:3000/fincas/'+id_finca+"/"+'producto_secundario_acuicultura'+'.'+extensionSecondaryProductAquaculture;
        fs.writeFile(fileSecondaryProductAquaculture, photoSecondaryProductAquaculture, {encoding: 'base64'}, async function(err) {
            if (err) {
                console.log("Error al crear la imagen de Producto Secundario Acuicultura");
            } else {
                let saveSecondaryProductAquaculture = await pool.query('INSERT INTO adjuntos (nombre, ruta, id_finca) VALUES ($1, $2, $3)', [nameSecondaryProductAquacultureBD, nameSecondaryProductAquaculture, id_finca]);
            }
        });
    }

    //Imagen Forestal
    if(photoForest && extensionForest){
        let nameForestBD = 'foto_forestal'+'.'+extensionForest;
        let fileForest = path+"/"+'foto_forestal'+'.'+extensionForest;
        let nameForest = 'http://181.129.226.226:3000/fincas/'+id_finca+"/"+'foto_forestal'+'.'+extensionForest;
        fs.writeFile(fileForest, photoForest, {encoding: 'base64'}, async function(err) {
            if (err) {
                console.log("Error al crear la imagen de Forestal");
            } else {
                let saveForest = await pool.query('INSERT INTO adjuntos (nombre, ruta, id_finca) VALUES ($1, $2, $3)', [nameForestBD, nameForest, id_finca]);
            }
        });
    }

    data = {
        "code": "0",
        "save": true,
        "message": "Los adjuntos se han almacenado correctamente"
    };

    res.status(200).json(data);
});
/*

//Ruta para enviar notificación
router.post('/api/notification', async (req, res) => {
    console.log('llega');
    let token = req.body.token
    try {
        let response = await admin.messaging().send({
            notification: {
                title: 'primera notificación',
                body: 'asdfasdfadsf'
            },
            token: token
        });

        return res.json(response)
    } catch (err) {
        return res.json(err).status(500);
    }
});
//API Capturar id de usuario, consultar informacion de éste y enviarla al front para perfil
/*router.post('/api/get_info_user', async (req, res) => {
    const { user_id } = req.body;

    let profile = await pool.query('SELECT * FROM users \
                                    JOIN user_profile ON user_profile.id_user = users.id_user \
                                    WHERE users.id_user = ?',[user_id]);
    let profile_user = profile[0].id_profile;
    let rows;

    if(profile_user == 2){
        rows = await pool.query(' SELECT us.id_user as id_user, us.names, us.lastnames, us.document, us.email, us.phone,  us.address_walker, us.walker_time_availability, \
                                    barrio.cbar_cdigo as codigo_barrio, barrio.cbar_nmbre_cmuna as comuna, barrio.cbar_nmbre_brrio as nombre_barrio \
                                    FROM users AS us \
                                    INNER JOIN user_profile AS up ON us.id_user = up.id_user \
                                    INNER JOIN profile AS pro ON pro.id_profile = up.id_profile \
                                    LEFT JOIN comuna_barrio AS barrio ON barrio.cbar_cdigo = us.cbar_cdigo_walker \
                                    WHERE us.id_user = ?', [user_id]);
    }else{
        rows = await pool.query('SELECT us.id_user as id_user, us.names, us.lastnames, us.document, us.email, us.phone, \
                                    us_add.address_title as address_title, us_add.user_address as user_address, \
                                    us_add.description_user_address as description_user_address, \
                                    us_add.id_user_address, barrio.cbar_cdigo as codigo_barrio, barrio.cbar_nmbre_cmuna as comuna, \
                                    barrio.cbar_nmbre_brrio as nombre_barrio, us_add.status, us_add.id_user, mun.nombre_muni \
                                    FROM users AS us \
                                    INNER JOIN user_address AS us_add ON us.id_user = us_add.id_user \
                                    LEFT JOIN comuna_barrio AS barrio ON barrio.cbar_cdigo = us_add.cbar_cdigo \
                                    LEFT JOIN municipios AS mun ON mun.id_muni = us_add.id_muni WHERE us.id_user = ?', [user_id]);
    }

    if(rows.length > 0){
        const user = rows[0];
        data = {
            "code": "0",
            "data": user
        };
    }else{
        data = {
            "code": "1",
            "error": "El usuario no existe"
        };
    }
    res.status(200).json(data);
});

//API Actualizar información de usuario desde movil
router.post('/api/update_user_api', async (req, res) => {
    const { id_user, document, names, lastnames, email, phone } = req.body;
    const update_user = await pool.query('UPDATE users SET names = ?, lastnames = ?, document = ?, email = ?, phone = ? WHERE id_user = ?', [names, lastnames, document, email, phone, id_user]);
    if(update_user){
        let profile_user = await pool.query('SELECT * FROM user_profile WHERE id_user = ?',[id_user]);
        let profile;
        if(profile_user[0].id_profile == 2){
            profile = "paseador";
        }else{
            profile = "cliente";
        }
        console.log("entraa");
        // Inicio envio correo
        const transporter = nodemailer.createTransport({
            host: data_email.host,
            port: data_email.port,
            auth: {
                user: data_email.auth.user,
                pass: data_email.auth.pass,
            }
            });
        let last = lastnames ? lastnames: '';
        // Definimos el email
        var mailOptions = {
            from: 'no-responder',
            to: 'infopaseando@gmail.com',
            //to: 'danigb66@gmail.com',
            subject: 'Actualización '+profile+' '+names,
            attachments: [
                {
                filename: 'footer.jpg',
                path: 'src/public/img/correos/footer.jpg',
                cid: 'footer'
            }],
            html: ' <h1 style="text-align: center; color: #DA7F2E;">Señor Administrador</h1>\
                    <p style="text-align: center;">Se le informa que el <strong>'+profile+'</strong> <strong>'+names+' '+last+'</strong> actualizo su información personal</p>\
                    <p style="text-align: center;"><img src="cid:footer"></p>\
                    <p stlye="text-align: center; color: #E3E3E3;">Este correo se genera automaticamente, porfavor no responder.</p>'
        };
        transporter.sendMail(mailOptions, function(error, info){
            if (error){
                console.log(error);
            } else {
                console.log("Email sent");
            }
        });
        //Fin envio correo
        
        data = {
            "code": "0",
            "message": "Usuario actualizado correctamente",
            "update": true
        };
    }else{
        data = {
            "code": "1",
            "update": false,
            "error": "Error al actualizar usuario"
        };
    }
    res.status(200).json(data);
});

//API para capturar id de usuario, consultar direcciones que tiene asociadas y enviarlas al front para gestion de direcciones
router.post('/api/get_address_user', async (req, res) => {
    const { user_id } = req.body;
    const user_address = await pool.query('SELECT us_add.address_title as address_title, us_add.user_address as user_address, \
                                        us_add.description_user_address as description_user_address, \
                                        us_add.id_user_address, barrio.cbar_cdigo as codigo_barrio, barrio.cbar_nmbre_cmuna as comuna, \
                                        barrio.cbar_nmbre_brrio as nombre_barrio, us_add.status, us_add.id_user, mun.nombre_muni FROM users AS us \
                                        INNER JOIN user_address AS us_add ON us.id_user = us_add.id_user \
                                        INNER JOIN comuna_barrio AS barrio ON barrio.cbar_cdigo = us_add.cbar_cdigo \
                                        INNER JOIN municipios AS mun ON mun.id_muni = us_add.id_muni WHERE us.id_user = ?', [user_id]);
    data = {
        "code": "0",
        "data": user_address
    };
    res.status(200).json(data);
});



//Eliminar direccion de un usuario
router.post('/api/delete_address_user', async (req, res) => {
    const { id_user_address } = req.body;
    const delete_address = await pool.query('DELETE FROM user_address WHERE id_user_address = ?', [id_user_address]);
    if(delete_address){
        data = {
            "code": "0",
            "message": "Dirección eliminada correctamente",
            "delete": true
        };
    }else{
        data = {
            "code": "1",
            "update": false,
            "error": "Error al eliminar la dirección"
        };
    }
    res.status(200).json(data);
});

//Capturar id de la direccion de un usuario para poderla editar desde la móvil
router.post('/api/get_address_data_edit', async (req, res) => {
    const { id_user_address } = req.body;
    const rows = await pool.query(' SELECT us_add.address_title as address_title, us_add.user_address as user_address, \
                                    us_add.description_user_address as description_user_address, us_add.id_user_address, \
                                    mun.id_muni, mun.nombre_muni, barrio.cbar_cdigo as codigo_barrio, barrio.cbar_nmbre_cmuna as comuna, \
                                    barrio.cbar_nmbre_brrio as nombre_barrio \
                                    FROM user_address AS us_add \
                                    INNER JOIN municipios AS mun ON mun.id_muni = us_add.id_muni \
                                    INNER JOIN comuna_barrio AS barrio ON barrio.cbar_cdigo = us_add.cbar_cdigo \
                                    WHERE us_add.id_user_address = ?', [id_user_address]);
    if(rows.length > 0){
        const address = rows[0];
        data = {
            "code": "0",
            "data": address
        };
    }else{
        data = {
            "code": "1",
            "error": "La dirección no existe"
        };
    }
    res.status(200).json(data);
});

//Actualizar una direccion de un usuario desde movil
router.post('/api/update_user_address', async (req, res) => {
    const { address_title, user_address, description_user_address, id_user, cbar_cdigo } = req.body;
    var id_muni = req.body.id_muni.id_muni;
    var id_user_address = req.body.id_user_address;

    const update_address = await pool.query('UPDATE user_address \
                                            SET address_title = ?, description_user_address = ?, \
                                            user_address = ?, id_muni = ?, cbar_cdigo = ? WHERE id_user_address = ?', [address_title, description_user_address, user_address, id_muni, cbar_cdigo, id_user_address]);
    if(update_address){
        data = {
            "code": "0",
            "message": "Dirección actualizada correctamente",
            "save": true
        };
    }else{
        data = {
            "code": "1",
            "update": false,
            "error": "Error al editar la dirección"
        };
    }
    res.status(200).json(data);
});

//Api para la movil para cambiar la direccion activa de un usuario
router.post('/api/change_status_address_user', async (req, res) => {
    const { user_address_id, id_user } = req.body;
    const inactive = 0;
    const active = 1;
    const update_status_address_cero = await pool.query('UPDATE user_address set status = ? WHERE id_user = ?', [inactive, id_user]);
    const update_status_address = await pool.query('UPDATE user_address set status = ? WHERE id_user_address = ?', [active, user_address_id]);
    if(update_status_address_cero && update_status_address){
        data = {
            "code": "0",
            "message": "Dirección marcado como principal",
            "delete": true
        };
    }else{
        data = {
            "code": "1",
            "update": false,
            "error": "Error al actualizar la dirección"
        };
    }
    res.status(200).json(data);
});

//Api para la movil para cambiar la direccion activa de un usuario
router.post('/api/save_position_user', async (req, res) => {
    const { latitude, longitude, user } = req.body;
    let updated_position = new Date();
    const update_lat_lon = await pool.query('UPDATE users set latitude = ?, longitude = ?, updated_position = ? WHERE id_user = ?', [latitude, longitude, updated_position, user]);
    data = {
        "code": "0",
        "message": "Se actualiza posicion",
    };
    res.status(200).json(data);
});

//Api para guardar un mensaje de paseador-cliente o cliente-paseador
router.post('/api/save_message', async (req, res) => {
    const { content_message, url_photo, id_user_envia, id_user_recibe } = req.body;
    let created_at = new Date();
    let username = await pool.query('SELECT username FROM users WHERE id_user = ?',[id_user_envia]);
    let user_create = username[0].username;
    const newMessage = {
        content_message,
        url_photo,
        id_user_envia,
        id_user_recibe,
        created_at,
        user_create
    };
    const add_message = await pool.query('INSERT INTO message SET ?', [newMessage]);
    if(add_message){
        data = {
            "code": "0",
            "message": "Mensaje almacenado con éxito",
            "save": true
        };
    }else{
        data = {
            "code": "1",
            "update": false,
            "error": "Error al guardar el mensaje"
        };
    }
    res.status(200).json(data);
});

//Api para listar los mensajes que recibe un usuario
router.post('/api/get_message_receive_user', async (req, res) => {
    const { id_user } = req.body;
    let messages_user = await pool.query('  SELECT mes.id_message, mes.content_message, mes.url_photo, DATE_FORMAT(mes.created_at, "%Y-%m-%d") fecha, \
                                            DATE_FORMAT(mes.created_at,"%H:%i:%s") hora, us.id_user as id_user_envia, us.names as name_user_envia, us.lastnames as lastnames_user_envia,\
                                            us2.id_user as id_user_recibe, us2.names as name_user_recibe, us2.lastnames as lastnames_user_recibe\
                                            FROM message as mes\
                                            JOIN users as us ON us.id_user = mes.id_user_envia\
                                            JOIN users as us2 ON us2.id_user = mes.id_user_recibe\
                                            WHERE mes.id_user_recibe = ?',[id_user]);
    if(messages_user){
        data = {
            "code": "0",
            "message": "Mensajes recibidos listados correctamente",
            "data": messages_user
        };
    }else{
        data = {
            "code": "1",
            "error": "Error al listar los mensajes"
        };
    }
    res.status(200).json(data);
});

//Api para listar los mensajes que envia un usuario
router.post('/api/get_message_send_user', async (req, res) => {
    const { id_user } = req.body;
    let messages_user = await pool.query('SELECT mes.id_message, mes.content_message, mes.url_photo, DATE_FORMAT(mes.created_at, "%Y-%m-%d") fecha, \
                        DATE_FORMAT(mes.created_at,"%H:%i:%s") hora, us.id_user as id_user_envia, us.names as name_user_envia, us.lastnames as lastnames_user_envia,\
                        us2.id_user as id_user_recibe, us2.names as name_user_recibe, us2.lastnames as lastnames_user_recibe\
                        FROM message as mes\
                        JOIN users as us ON us.id_user = mes.id_user_envia\
                        JOIN users as us2 ON us2.id_user = mes.id_user_recibe\
                        WHERE mes.id_user_envia = ?',[id_user]);
    if(messages_user){
        data = {
            "code": "0",
            "message": "Mensajes recibidos listados correctamente",
            "data": messages_user
        };
    }else{
        data = {
            "code": "1",
            "error": "Error al listar los mensajes"
        };
    }
    res.status(200).json(data);
});

//Api para inactivar un usuario
router.post('/inactive_user', async (req, res) => {
    const { id_user } = req.body;

    let deleted_at = new Date();
    let status_user = 2;
    const query_inactive = await pool.query('UPDATE users set status_user = ?, deleted_at = ? WHERE id_user = ?',[status_user, deleted_at, id_user]);
    if(query_inactive){
        data = {
            "code": "0",
            "message": "Usuario inactivo correctamente",
            "update": true
        };
    }else{
        data = {
            "code": "1",
            "error": "Error al deshabilitar el usuario"
        }
    }

});

//Api para inactivar un usuario
router.post('/active_user', async (req, res) => {
    const { id_user } = req.body;

    let updated_at = new Date();
    let status_user = 1;
    const query_active = await pool.query('UPDATE users set status_user = ?, updated_at = ?, deleted_at = null WHERE id_user = ?',[status_user, updated_at, id_user]);
    if(query_active){
        data = {
            "code": "0",
            "message": "Usuario activo correctamente",
            "update": true
        };
    }else{
        data = {
            "code": "1",
            "error": "Error al activar el usuario"
        }
    }

});

//Api para obtener todos los barrios con sus comunas
router.post('/api/get_all_district', async (req, res) => {
    const all_district = await pool.query('SELECT * FROM comuna_barrio');
    if(all_district.length > 0){
        data = {
            "code": "0",
            "message": "Barrios listados correctamente",
            "status": true,
            "data": all_district
        };
    }else{
        data = {
            "code": "1",
            "error": "Error al listar los barrios",
            "status": false
        }
    }
    res.status(200).json(data);
});

//Api para registrar un paseador
router.post('/api/register_walker', async (req, res) => {
    const { names, lastnames, document, email, phone, username, password, term_condition, cbar_cdigo_walker, address_walker, walker_time_availability } = req.body;
    let created_at = new Date();
    const username_result = await pool.query('SELECT username FROM users WHERE username = ?', [username]);
    const document_result = await pool.query('SELECT document FROM users WHERE document = ?', [document]);
    const email_result = await pool.query('SELECT email FROM users WHERE email = ?', [email]);
    if(username_result.length > 0){
        data = {
            "code": "1",
            "save": false,
            "error": "Este nombre de usuario ya se encuentra registrado."
        };
    }else if(document_result.length > 0){
        data = {
            "code": "1",
            "save": false,
            "error": "Este documento ya se encuentra registrado."
        };
    }else if(email_result.length > 0){
        data = {
            "code": "1",
            "save": false,
            "error": "Este email ya se encuentra registrado."
        };
    }else if(req.body.password != req.body.confirm_password){
        data = {
            "code": "1",
            "save": false,
            "error": "Las contraseñas no coinciden."
        };
    }else{
        const newWalker = {
            names,
            lastnames,
            document,
            email,
            phone,
            username,
            term_condition,
            cbar_cdigo_walker,
            address_walker,
            walker_time_availability,
            created_at
        };
        newWalker.password = await helpers.encryptPassword(password);
        const add_walker = await pool.query('INSERT INTO users SET ?', [newWalker]);
        const id_user = add_walker.insertId;
        let id_profile = 2;
        let status_user_profile = 1;

        const newPorfileUser = {
            id_user,
            id_profile,
            status_user_profile
        };
        const query_user_profile = await pool.query('INSERT INTO user_profile SET ?', [newPorfileUser]);

        if(add_walker){
            // Inicio envio correo
            const transporter = nodemailer.createTransport({
                host: data_email.host,
                port: data_email.port,
                auth: {
                    user: data_email.auth.user,
                    pass: data_email.auth.pass,
                }
                });
            // Definimos el email
            var mailOptions = {
                from: 'no-responder',
                to: email,
                subject: 'Bienvenido',
                attachments: [{
                    filename: 'icon.png',
                    path: 'src/public/img/correos/icon.png',
                    cid: 'icon'
                    },
                    {
                    filename: 'footer.jpg',
                    path: 'src/public/img/correos/footer.jpg',
                    cid: 'footer'
                }],
                html: ' <p style="text-align: center;"><img src="cid:icon"></p>\
                        <h1 style="text-align: center; color: #DA7F2E;">Señor paseador '+names+' Bienvenido a paseando tu mascota</h1>\
                        <p style="text-align: center;">Estos son tun datos de acceso a nuestra plataforma:</p>\
                        <p style="text-align: center;"><strong>Usuario: </strong>'+username+' <strong>Contraseña: </strong>'+password+'</p>\
                        <p style="text-align: center;"><img src="cid:footer"></p>\
                        <p stlye="text-align: center; color: #E3E3E3;">Este correo se genera automaticamente, porfavor no responder.</p>'
            };
            transporter.sendMail(mailOptions, function(error, info){
                if (error){
                    console.log(error);
                } else {
                    console.log("Email sent");
                }
            });
            //Fin envio correo
            data = {
                "code": "0",
                "message": "Registro exitoso",
                "save": true
            };
        }else{
            data = {
                "code": "1",
                "error": "Error al realizar el registro. Verifique",
                "save": false
            };
        }
    }
    res.status(200).json(data);
});

//Servicio para listar tips por roles
router.post('/api/get_tips_by_user', async (req, res) => {
    const { id_user } = req.body;
    const user_result = await pool.query('  SELECT * FROM users as us \
                                            JOIN user_profile AS us_pro ON us_pro.id_user = us.id_user \
                                            WHERE us.id_user = ?', [id_user]);
    let profile = user_result[0].id_profile;
    //1: superadmin, 2: paseador, 3: cliente
    if(profile == 2){
        data = {
            "code": "0",
            "profile": "paseador",
            "tips":[
                p0= "Cuida bien a las mascotas.",
                p1= "Se responsable del adecuado manejo de residuos y demás herramientas inherentes al paseo.",
                p2= "Recuerda que por obligacion debes hacer checkin y checkout por cada paseo.",
                p3= "Paseando tu mascota solo te pagara los paseos que queden registrados con checkin y checkout",
                p4= "Recuerda activar la jornada cada que inicies un dia y desactivarla al finalizar.",
                p5= "Recuerda hidratar constantemente a tus mascotas"
            ]
        };
    }else if(profile == 3){
        data = {
            "code": "0",
            "profile": "cliente",
            "tips":[
                p0="Para poder utilizar la app debes crear primero una dirección en el Menú/Mis Direcciones",
                p1="Los paseos tiene una duración estimada de 2 horas. Los horarios que tenemos establecidos son de 7 a 9, de 9 a 11 y de 11 a 1 de la tarde. Si el cliente requiere de otro horario puede programarse sin ningún problema.",
                p2="El tiempo estimado para recoger a la moscota es de 30 minutos",
                p3="Paseando tu mascota se hace responsable del adecuado manejo de residuos y demás herramientas inherentes al paseo.",
                p4="El cliente podrá contar con la opción de la vigilancia del recorrido mediante el GPS",
                p5="Recuerda que en paseando tu mascota nos preocupamos por tu peludo, asi que lo estamos hidratando constantemente durante el paseo",
                p6="Todos los paseos incluyen un seguro basico con nuestro aliado SURA",
                p7="Solo se admite el registro de mascotas mayores a 3 meses y menores a 10 años de edad"
            ]
        };
    }else{
        data = {
            "code": "0",
            "profile": "administrador",
            "tips":[
                p0= "Përfil administrador"
            ]
        };
    }
    res.status(200).json(data);
});

//Servicio para listar tips por roles
router.post('/api/get_schedules', async (req, res) => {
    let shedule =  await pool.query('SELECT * FROM hora_sugerida_paseo');
    data = {
        "code": "0",
        "get": "true",
        "data": shedule
    };
    res.status(200).json(data);
});

//Api para saber si un usuario tiene por lo menos una direccion creada
router.post('/api/user_address_active', async (req, res) => {
    const { id_user } = req.body;
    if(id_user == '' || id_user == undefined || id_user == null){
        data = {
            "code": "2",
            "message": "El usuario no existe",
            "data": false
        };
    }else{
        const user_address = await pool.query('SELECT us_add.address_title as address_title, us_add.user_address as user_address, \
                                        us_add.description_user_address as description_user_address, \
                                        us_add.id_user_address, barrio.cbar_cdigo as codigo_barrio, barrio.cbar_nmbre_cmuna as comuna, \
                                        barrio.cbar_nmbre_brrio as nombre_barrio, us_add.status, us_add.id_user, mun.nombre_muni FROM users AS us \
                                        INNER JOIN user_address AS us_add ON us.id_user = us_add.id_user \
                                        left JOIN comuna_barrio AS barrio ON barrio.cbar_cdigo = us_add.cbar_cdigo \
                                        left JOIN municipios AS mun ON mun.id_muni = us_add.id_muni WHERE us.id_user = ?', [id_user]);
        if(user_address.length > 0){
            data = {
                "code": "0",
                "message": "El usuario existe y tiene direccion principal creada",
                "data": true
            };
        }else{
            data = {
                "code": "1",
                "message": "Debe crear una dirección para poder continuar",
                "data": false
            };
        }
    }


    res.status(200).json(data);
    
});

//Api para almacenar el token de un usuario
router.post('/api/save_token', async (req, res) => {
    let { id_user, token } = req.body;
    let save_token_user =  await pool.query('UPDATE users SET token = ? WHERE id_user = ?',[token, id_user]);
    if(save_token_user){
        data = {
            "code": "0",
            "message": "Token almacenado con exito",
            "save": true
        };
    }else{
        data = {
            "code": "1",
            "message": "Error al almacenar el token",
            "save": false
        };
    }

    res.status(200).json(data);
});

//Api para obtener el token de un usuario con su id
router.post('/api/get_token_user', async (req, res) => {
    let { id_user } = req.body;
    let get_token_user =  await pool.query('SELECT token FROM users WHERE id_user = ?',[id_user]);
    if(get_token_user.length > 0){
        data = {
            "code": "0",
            "message": "Se obtiene el token del usuario",
            "data": get_token_user[0]
        };
    }else{
        data = {
            "code": "1",
            "message": "Error al obtener el token del usuario",
            "get": false
        };
    }

    res.status(200).json(data);
});

//Servicio para probar envio de correos
router.post('/api/send_mail', async (req, res) => {
        // Definimos el transporter
        const transporter = nodemailer.createTransport({
            host: data_email.host,
            port: data_email.port,
            auth: {
              user: data_email.auth.user,
              pass: data_email.auth.pass,
            }
          });
        // Definimos el email
        var mailOptions = {
            from: 'no-responder',
            to: 'danigb66@gmail.com',
            subject: 'Bienvenido',
            attachments: [{
                filename: 'icon.png',
                path: 'src/public/img/correos/icon.png',
                cid: 'icon'
                },
                {
                filename: 'footer.jpg',
                path: 'src/public/img/correos/footer.jpg',
                cid: 'footer'
            }],
            html: ' <p style="text-align: center;"><img src="cid:icon"></p>\
                    <h1 style="text-align: center; color: #DA7F2E;">Bienvendo a paseando tu mascota</h1>\
                    <p style="text-align: center;">Para nosotros es un placer contar con tu registro y que utilices nuestros servicios</p>\
                    <p style="text-align: center;"><img src="cid:footer"></p>\
                    <p stlye="text-align: center; color: #E3E3E3;">Este correo se genera automaticamente, porfavor no responder.</p>'
        };
        // Enviamos el email
        transporter.sendMail(mailOptions, function(error, info){
            if (error){
                console.log(error);
            } else {
                console.log("Email sent");
                //res.status(200).jsonp(req.body);
            }
        });

});*/

module.exports = router;