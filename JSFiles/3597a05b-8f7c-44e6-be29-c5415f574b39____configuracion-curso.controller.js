const db = require("../models")
const {v4: uuidv4} = require('uuid');
const paginationCustom = require("../utils/handle-paginacion")
const path = require("path")
const {extensionValid} = require("../utils/handle-validation-extension");
const {createDirectory, deleteFile} = require("../utils/handle-fs-mkdir");
const {matchedData} = require("express-validator")
const {Op} = require("sequelize")
const {handleErrorResponse} = require("../utils/handle-error")

/**
 * index -> mostrar todos los registros
 * indexAvailable -> mostrar todos los registros disponibles o publicaciones disponibles
 * show/{id} -> monstrar un registro
 * store -> guardar un registro
 * update/{id} -> actualizar un registro
 * delete/{id} -> eliminar un registro
 **/

module.exports = {
    async index(req, res) {

        try {
            //region:: procedimiento si se envia parametros query para la paginacion
            /**
             * 1. obtener el numero de pagina = page
             * 2. obtener el numero de registros por pagina = limit
             */
            if (req.query.page || req.query.limit) {

                /**
                 * helper para validar que los parametros query sean numeros
                 * para la paginacion
                 * @type {{limit: number, page: number}}
                 */
                const pagination = paginationCustom(req)

                /**
                 * obtener los todos los cursos
                 * @type {*}
                 */
                const cursosIndex = await db.ConfiguracionCurso.findAll({
                    attributes: [
                        'id_configuracion_curso',
                        'id_course_moodle',
                        'fecha_inicial',
                        'fecha_final',
                        'carga_horaria',
                        'detalle_curso',
                        'url_pdf',
                        'banner_curso',
                        'celular_referencia',
                        'inversion',
                        'descuento',
                        'fecha_inicio_descuento',
                        'fecha_fin_descuento',
                        'horario',
                        'fecha_inicio_lanzamiento',
                        'mensaje_whatsapp',
                        'estado_curso'
                    ],
                    limit: pagination.limit,
                    offset: pagination.page * pagination.limit
                })

                /**
                 * estructura de data para la respuesta
                 */
                const data = {
                    cursos_disponibles: cursosIndex.rows,
                    totalPages: Math.ceil(cursosIndex.count / pagination.limit),
                }

                /**
                 * enviar respuesta al cliente
                 */
                return res.status(200).json({
                    code: 200,
                    success: true,
                    data
                })

            }

            //endregion

            //region:: procedimiento si no se envia parametros query para la paginacion

            /**
             * * obtener los todos los cursos
             * @type {Model[]}
             */
            const cursosIndex = await db.ConfiguracionCurso.findAll({
                attributes: [
                    'id_configuracion_curso',
                    'id_course_moodle',
                    'fecha_inicial',
                    'fecha_final',
                    'carga_horaria',
                    'detalle_curso',
                    'url_pdf',
                    'banner_curso',
                    'celular_referencia',
                    'inversion',
                    'descuento',
                    'fecha_inicio_descuento',
                    'fecha_fin_descuento',
                    'horario',
                    'fecha_inicio_lanzamiento',
                    'mensaje_whatsapp',
                    'estado_curso'
                ]
            })

            /**
             * enviar resultado a cliente
             */
            return res.status(200).json({
                code: 200,
                success: true,
                data: cursosIndex
            });

        } catch (e) {
            console.log(`Error: ${e}`);
            handleErrorResponse(res, 'Error al obtener todos los curos ', 500);
        }
    },

    async indexAvailable(req, res) {

        try {
            //region:: procedimiento si se envia parametros query para la paginacion
            /**
             * 1. obtener el numero de pagina = page
             * 2. obtener el numero de registros por pagina = limit
             */
            if (req.query.page || req.query.limit) {

                /**
                 * helper para validar que los parametros query sean numeros
                 * para la paginacion
                 * @type {{limit: number, page: number}}
                 */
                const pagination = paginationCustom(req)

                /**
                 * obtener los cursos publicados disponibles
                 * @type {*}
                 */
                const cursosIndexAvailable = await db.ConfiguracionCurso.findAndCountAll({
                    attributes: [
                        'id_configuracion_curso',
                        'id_course_moodle',
                        'fecha_inicial',
                        'fecha_final',
                        'carga_horaria',
                        'detalle_curso',
                        'url_pdf',
                        'banner_curso',
                        'celular_referencia',
                        'inversion',
                        'descuento',
                        'fecha_inicio_descuento',
                        'fecha_fin_descuento',
                        'horario',
                        'fecha_inicio_lanzamiento',
                        'mensaje_whatsapp',
                        'estado_curso'
                    ],
                    where: {
                        fecha_inicial: {
                            [Op.lte]: new Date().toISOString()
                        },
                        fecha_final: {
                            [Op.gte]: new Date().toISOString()
                        }
                    },
                    limit: pagination.limit,
                    offset: pagination.page * pagination.limit
                })

                /**
                 * estructura de data para la respuesta
                 */
                const data = {
                    cursos_disponibles: cursosIndexAvailable.rows,
                    totalPages: Math.ceil(cursosIndexAvailable.count / pagination.limit),
                }

                /**
                 * enviar respuesta al cliente
                 */
                return res.status(200).json({
                    code: 200,
                    success: true,
                    data
                })

            }
            //endregion

            //region:: procedimiento si no hay parametros query en la uri
            /**
             * obtener los cursos publicados disponibles
             * @type {*}
             */
            const cursosIndexAvailable = await db.ConfiguracionCurso.findAll({
                attributes: [
                    'id_configuracion_curso',
                    'id_course_moodle',
                    'fecha_inicial',
                    'fecha_final',
                    'carga_horaria',
                    'detalle_curso',
                    'url_pdf',
                    'banner_curso',
                    'celular_referencia',
                    'inversion',
                    'descuento',
                    'fecha_inicio_descuento',
                    'fecha_fin_descuento',
                    'horario',
                    'fecha_inicio_lanzamiento',
                    'mensaje_whatsapp',
                    'estado_curso'
                ],
                where: {
                    fecha_inicial: {
                        [Op.lte]: new Date().toISOString()
                    },
                    fecha_final: {
                        [Op.gte]: new Date().toISOString()
                    }
                }
            })

            /**
             * enviando resultado a cliente
             */
            return res.status(200).json({
                code: 200,
                success: true,
                data: cursosIndexAvailable
            })
            //endregion

        } catch (e) {
            console.log(`Error: ${e}`);
            handleErrorResponse(res, 'Error al obtgener cursos disponibles', 500)
        }
    },

    async show(req, res) {

        try {
            const {id} = req.params

            /**
             * obtener el detalle de la publicacion del curso
             * @type {Model}
             */
            const cursoConfiguracionShow = await db.ConfiguracionCurso.findOne({
                attributes: [
                    'id_configuracion_curso',
                    'id_course_moodle',
                    'fecha_inicial',
                    'fecha_final',
                    'carga_horaria',
                    'detalle_curso',
                    'url_pdf',
                    'banner_curso',
                    'celular_referencia',
                    'inversion',
                    'descuento',
                    'fecha_inicio_descuento',
                    'fecha_fin_descuento',
                    'horario',
                    'fecha_inicio_lanzamiento',
                    'mensaje_whatsapp'
                ],
                where: {
                    id_configuracion_curso: id,
                    estado_curso: 'REGISTRADO'
                }
            })

            /**
             * verificar si existe el curso
             */
            if (cursoConfiguracionShow) {
                /**
                 * si existe un dato enviar la respuesta al cliente
                 */
                return res.status(200).json({
                    code: 200,
                    success: true,
                    data: cursoConfiguracionShow
                })
            } else {
                /**
                 * si no existe un dato enviar una respuesta de no encontrado
                 */
                handleErrorResponse(res, 'No se encontro el detalle del curso con ese id ingresado', 404)
            }

        } catch (e) {
            console.log(`Error: ${e}`);
            handleErrorResponse(res, 'Error al obtener el detalle del curso', 500)
        }
    },

    async store(req, res) {
        try {

            const bodyClean = matchedData(req)
            const pathDirectoryBannerCurso = path.join(__dirname, './../storage/configuracion-curso/banner-curso')
            const pathDirectoryPdfCurso = path.join(__dirname, './../storage/configuracion-curso/pdf-curso')


            /**
             * crear directorio para almacenar los archivos de bannner de un curso
             */
            if (!createDirectory(pathDirectoryBannerCurso)) {
                handleErrorResponse(res, 'Error al intentar crear el directorio para almacenar los archivos de banner de un curso', 500)
            }

            /**
             * crear directorio para almacenar los archivos de pdf de un curso
             */
            if (!createDirectory(pathDirectoryPdfCurso)) {
                handleErrorResponse(res, 'Error al intentar crear el directorio para almacenar los archivos de pdf de un curso', 500)
            }

            // console.log('-----------APARTADO PARA FILES-----------')
            // console.log(req.files)
            // console.log(Object.keys(req.files))
            // console.log(bodyClean)
            // console.log(req.files.banner_curso)
            // console.log(req.files.url_pdf)
            // console.log('-----------END-----------')

            /**
             * verificar si existe algun archivo
             */
            if (!req.files || Object.keys(req.files).length === 0) {
                return handleErrorResponse(res, 'No se ha seleccionado ningun archivo', 400)
            }

            /**
             * validar que exista un archivo para el banner del curso
             */
            if (!req.files.banner_curso) {
                return handleErrorResponse(res, 'No se ha seleccionado ningun archivo para el banner del curso', 400)
            }

            //region:: cuando selecciona los dos archivos para banner del curso y el pdf del curso
            if (req.files.banner_curso && req.files.url_pdf) {
                // console.log('tiene seleccionado los dos archivos')

                const fileBannerCurso = req.files.banner_curso
                const filePdfCurso = req.files.url_pdf

                /**
                 * sacar la extencion del archivo del banner de curso
                 * @type {T}
                 */
                const extensionFileBanner = fileBannerCurso.name.split('.').pop()
                const extesionFilePdf = filePdfCurso.name.split('.').pop()

                /**
                 * array de validaciones de extensiones de los archivos para banner de cursos
                 * @type {string[]}
                 */

                if (!extensionValid(['jpg', 'jpeg', 'png', 'gif'], extensionFileBanner)) {
                    return handleErrorResponse(res, 'El archivo solo permite archivos de tipo \'jpg\', \'jpeg\', \'png\', \'gif\' ', 400)
                }

                if (!extensionValid(['pdf'], extesionFilePdf)) {
                    return handleErrorResponse(res, 'Solo permite archivos de tipo pdf', 400)
                }

                /**
                 * generar el nombre del archivo "banner y pdf"
                 * @type {string}
                 */
                const nameFileBanner = `${uuidv4()}.${extensionFileBanner}`
                const nameFilePdf = `${uuidv4()}.${extesionFilePdf}`

                /**
                 * agregar al directorio el nombre del archivo "de banner y pdf"
                 * @type {string}
                 */
                const pathFileBannerCurso = `${pathDirectoryBannerCurso}/${nameFileBanner}`
                const pathFilePdfCurso = `${pathDirectoryPdfCurso}/${nameFilePdf}`

                //region:: mover archivo banner
                fileBannerCurso.mv(pathFileBannerCurso, async (err) => {
                    if (err) {
                        return handleErrorResponse(res, 'Error al intentar mover el archivo del banner de curso', 500)
                    }

                    //region:: mover archivo pdf
                    filePdfCurso.mv(pathFilePdfCurso, async (err) => {
                        if (err) {
                            console.log('Error controller: ', err)
                            return handleErrorResponse(res, 'Error al intentar mover el archivo pdf de curso', 500)
                        }

                        //region:: guardar publicaion del curso + banner + pdf
                        await db.ConfiguracionCurso.create({
                            fecha_inicial: bodyClean.fecha_inicial,
                            fecha_final: bodyClean.fecha_final,
                            carga_horaria: bodyClean.carga_horaria,
                            detalle_curso: bodyClean.detalle_curso,
                            url_pdf: nameFilePdf,
                            banner_curso: nameFileBanner,
                            celular_referencia: bodyClean.celular_referencia,
                            inversion: bodyClean.inversion,
                            descuento: bodyClean.descuento,
                            fecha_inicio_descuento: bodyClean.fecha_inicio_descuento,
                            fecha_fin_descuento: bodyClean.fecha_fin_descuento,
                            horario: bodyClean.horario,
                            fecha_inicio_lanzamiento: bodyClean.fecha_inicio_lanzamiento,
                            mensaje_whatsapp: bodyClean.mensaje_whatsapp,
                            estado_curso: 'REGISTRADO'
                        }, {
                            fields: [
                                'id_configuracion_curso',
                                'id_course_moodle',
                                'fecha_inicial',
                                'fecha_final',
                                'carga_horaria',
                                'detalle_curso',
                                'url_pdf',
                                'banner_curso',
                                'celular_referencia',
                                'inversion',
                                'descuento',
                                'fecha_inicio_descuento',
                                'fecha_fin_descuento',
                                'horario',
                                'fecha_inicio_lanzamiento',
                                'mensaje_whatsapp',
                                'estado_curso'
                            ]
                        })

                        /**
                         * enviar respuesta al ciente
                         */
                        res.status(200).json({
                            code: 200,
                            success: true,
                            message: 'Curso registrado con exito + banner + pdf'
                        })

                    })
                    //endregion

                })
                return
                //endregion

            }
            //endregion

            //region:: cuando solo selecciona el un archivo para el banner del curso
            if (req.files.banner_curso) {
                // console.log('solo tiene el banner')

                const fileBannerCurso = req.files.banner_curso

                /**
                 * sacar la extencion del archivo del banner de curso
                 * @type {T}
                 */
                const extensionFile = fileBannerCurso.name.split('.').pop()

                /**
                 * validar la extension del archivo del banner de curso con el array de validaciones de banner de curso
                 */

                if (!extensionValid(['jpg', 'jpeg', 'png', 'gif'], extensionFile)) {
                    return handleErrorResponse(res, 'El archivo solo permite archivos de tipo \'jpg\', \'jpeg\', \'png\', \'gif\' ', 400)
                }

                /**
                 * generar el nombre del archivo
                 * @type {string}
                 */
                const nameFile = `${uuidv4()}.${extensionFile}`

                const pathFileBannerCurso = `${pathDirectoryBannerCurso}/${nameFile}`

                /**
                 * mover el archivo del banner de curso a la carpeta de almacenamiento
                 */
                fileBannerCurso.mv(pathFileBannerCurso, async (err) => {
                    if (err) {
                        handleErrorResponse(res, 'Error al intentar mover el archivo del banner de curso', 500)
                    }

                    /**
                     * guardar registro del curso
                     */
                    await db.ConfiguracionCurso.create({
                        fecha_inicial: bodyClean.fecha_inicial,
                        fecha_final: bodyClean.fecha_final,
                        carga_horaria: bodyClean.carga_horaria,
                        detalle_curso: bodyClean.detalle_curso,
                        url_pdf: null,
                        banner_curso: nameFile,
                        celular_referencia: bodyClean.celular_referencia,
                        inversion: bodyClean.inversion,
                        descuento: bodyClean.descuento,
                        fecha_inicio_descuento: bodyClean.fecha_inicio_descuento,
                        fecha_fin_descuento: bodyClean.fecha_fin_descuento,
                        horario: bodyClean.horario,
                        fecha_inicio_lanzamiento: bodyClean.fecha_inicio_lanzamiento,
                        mensaje_whatsapp: bodyClean.mensaje_whatsapp,
                        estado_curso: 'REGISTRADO'
                    }, {
                        fields: [
                            'id_configuracion_curso',
                            'id_course_moodle',
                            'fecha_inicial',
                            'fecha_final',
                            'carga_horaria',
                            'detalle_curso',
                            'url_pdf',
                            'banner_curso',
                            'celular_referencia',
                            'inversion',
                            'descuento',
                            'fecha_inicio_descuento',
                            'fecha_fin_descuento',
                            'horario',
                            'fecha_inicio_lanzamiento',
                            'mensaje_whatsapp',
                            'estado_curso'
                        ]
                    })

                    res.status(200).json({
                        code: 200,
                        success: true,
                        message: 'Curso registrado con exito + banner'
                    })

                })

                return

            }
            //endregion


        } catch (e) {
            console.log(`Error Controller: ${e}`);
            handleErrorResponse(res, 'Error al intentar guardar un detalle y/o publicacion de un curso', 500)
        }
    },

    async update(req, res) {
        try {
            /**
             * recuperar el parametro {id} de la url de la peticion
             */
            const {id} = req.params

            /**
             * recuperar el body de la peticion
             */
            const bodyClean = matchedData(req)
            const pathDirectoryBannerCurso = path.join(__dirname, './../storage/configuracion-curso/banner-curso')
            const pathDirectoryPdfCurso = path.join(__dirname, './../storage/configuracion-curso/pdf-curso')


            /**
             * verificar si existe algun archivo
             */
            if (!req.files || Object.keys(req.files).length === 0) {
                /**
                 * si no esta seleccionado ningun archivo guardar los campos en la base de datos
                 */

                await db.ConfiguracionCurso.update({
                    fecha_inicial: bodyClean.fecha_inicial,
                    fecha_final: bodyClean.fecha_final,
                    carga_horaria: bodyClean.carga_horaria,
                    detalle_curso: bodyClean.detalle_curso,
                    // url_pdf: nameFilePdf,
                    // banner_curso: nameFileBanner,
                    celular_referencia: bodyClean.celular_referencia,
                    inversion: bodyClean.inversion,
                    descuento: bodyClean.descuento,
                    fecha_inicio_descuento: bodyClean.fecha_inicio_descuento,
                    fecha_fin_descuento: bodyClean.fecha_fin_descuento,
                    horario: bodyClean.horario,
                    fecha_inicio_lanzamiento: bodyClean.fecha_inicio_lanzamiento,
                    mensaje_whatsapp: bodyClean.mensaje_whatsapp,
                }, {
                    where: {
                        id_configuracion_curso: id
                    }
                })

                return res.status(200).json({
                    code: 200,
                    success: true,
                    message: 'Registro de curso actualizado con exito'
                })
            }

            /**
             * consultar datos existentes con el id
             * @type {*}
             */
            const cursoShow = await db.ConfiguracionCurso.findOne({
                where: {
                    id_configuracion_curso: id,
                    estado_curso: 'REGISTRADO'
                }
            })

            /**
             * verificar si el id del curso existe
             */
            if (!cursoShow) {
                return handleErrorResponse(res, 'El id del curso no existe', 404)
            }

            //region:: proceso cuando seleccione los dos archovps pdf y banner
            if (req.files.banner_curso && req.files.url_pdf) {

                const fileBannerCurso = req.files.banner_curso
                const filePdfCurso = req.files.url_pdf

                /**
                 * sacar la extencion del archivo del banner de curso
                 * @type {T}
                 */
                const extensionFileBanner = fileBannerCurso.name.split('.').pop()
                const extesionFilePdf = filePdfCurso.name.split('.').pop()

                /**
                 * array de validaciones de extensiones de los archivos para banner de cursos
                 * @type {string[]}
                 */

                if (!extensionValid(['jpg', 'jpeg', 'png', 'gif'], extensionFileBanner)) {
                    return handleErrorResponse(res, 'El archivo solo permite archivos de tipo \'jpg\', \'jpeg\', \'png\', \'gif\' ', 400)
                }

                if (!extensionValid(['pdf'], extesionFilePdf)) {
                    return handleErrorResponse(res, 'Solo permite archivos de tipo pdf', 400)
                }

                /**
                 * generar el nombre del archivo "banner y pdf"
                 * @type {string}
                 */
                const nameFileBanner = `${uuidv4()}.${extensionFileBanner}`
                const nameFilePdf = `${uuidv4()}.${extesionFilePdf}`

                /**
                 * agregar al directorio el nombre del archivo "de banner y pdf"
                 * @type {string}
                 */
                const pathFileBannerCurso = `${pathDirectoryBannerCurso}/${nameFileBanner}`
                const pathFilePdfCurso = `${pathDirectoryPdfCurso}/${nameFilePdf}`

                //region:: mover archivo banner
                fileBannerCurso.mv(pathFileBannerCurso, async (err) => {
                    if (err) {
                        return handleErrorResponse(res, 'Error al intentar mover el archivo del banner de curso', 500)
                    }

                    /**
                     * borrar el archivo del banner de curso de la carpeta de almacenamiento anterior
                     */
                    const pathOldFileBannerCurso = `${pathDirectoryBannerCurso}/${cursoShow.banner_curso}`
                    deleteFile(pathOldFileBannerCurso)

                    //region:: mover archivo pdf
                    filePdfCurso.mv(pathFilePdfCurso, async (err) => {
                        if (err) {
                            console.log('Error controller: ', err)
                            return handleErrorResponse(res, 'Error al intentar mover el archivo pdf de curso', 500)
                        }

                        /**
                         * borrar el archivo del banner de curso de la carpeta de almacenamiento anterior
                         */
                        const pathOldFilePdfCurso = `${pathDirectoryPdfCurso}/${cursoShow.banner_curso}`
                        deleteFile(pathOldFilePdfCurso)

                        //region:: actualizar publicaion del curso + banner + pdf
                        await db.ConfiguracionCurso.update({
                            fecha_inicial: bodyClean.fecha_inicial,
                            fecha_final: bodyClean.fecha_final,
                            carga_horaria: bodyClean.carga_horaria,
                            detalle_curso: bodyClean.detalle_curso,
                            url_pdf: nameFilePdf,
                            banner_curso: nameFileBanner,
                            celular_referencia: bodyClean.celular_referencia,
                            inversion: bodyClean.inversion,
                            descuento: bodyClean.descuento,
                            fecha_inicio_descuento: bodyClean.fecha_inicio_descuento,
                            fecha_fin_descuento: bodyClean.fecha_fin_descuento,
                            horario: bodyClean.horario,
                            fecha_inicio_lanzamiento: bodyClean.fecha_inicio_lanzamiento,
                            mensaje_whatsapp: bodyClean.mensaje_whatsapp
                        }, {
                            where: {
                                id_configuracion_curso: id
                            }
                        })

                    })
                    //endregion
                })
                //endregion

                /**
                 * enviar respuesta al ciente
                 */
                return res.status(200).json({
                    code: 200,
                    success: true,
                    message: 'Curso actualizado con exito + banner + pdf'
                })
            }
            //endregion

            //region:: proceso cuando seleccione solo el archivo banner
            if (req.files.banner_curso) {

                const fileBannerCurso = req.files.banner_curso

                /**
                 * sacar la extencion del archivo del banner de curso
                 * @type {T}
                 */
                const extensionFile = fileBannerCurso.name.split('.').pop()

                /**
                 * validar la extension del archivo del banner de curso con el array de validaciones de banner de curso
                 */

                if (!extensionValid(['jpg', 'jpeg', 'png', 'gif'], extensionFile)) {
                    return handleErrorResponse(res, 'El archivo solo permite archivos de tipo \'jpg\', \'jpeg\', \'png\', \'gif\' ', 400)
                }

                /**
                 * generar el nombre del archivo
                 * @type {string}
                 */
                const nameFile = `${uuidv4()}.${extensionFile}`

                const pathFileBannerCurso = `${pathDirectoryBannerCurso}/${nameFile}`

                /**
                 * mover el archivo del banner de curso a la carpeta de almacenamiento
                 */
                fileBannerCurso.mv(pathFileBannerCurso, async (err) => {
                    if (err) {
                        return handleErrorResponse(res, 'Error al intentar mover el archivo del banner de curso', 500)
                    }
                    /**
                     * borrar el archivo del banner de curso de la carpeta de almacenamiento anterior
                     */
                    const pathOldFileBannerCurso = `${pathDirectoryBannerCurso}/${cursoShow.banner_curso}`
                    deleteFile(pathOldFileBannerCurso)

                    /**
                     * guardar registro del curso + banner
                     */
                    await db.ConfiguracionCurso.update({
                        fecha_inicial: bodyClean.fecha_inicial,
                        fecha_final: bodyClean.fecha_final,
                        carga_horaria: bodyClean.carga_horaria,
                        detalle_curso: bodyClean.detalle_curso,
                        url_pdf: null,
                        banner_curso: nameFile,
                        celular_referencia: bodyClean.celular_referencia,
                        inversion: bodyClean.inversion,
                        descuento: bodyClean.descuento,
                        fecha_inicio_descuento: bodyClean.fecha_inicio_descuento,
                        fecha_fin_descuento: bodyClean.fecha_fin_descuento,
                        horario: bodyClean.horario,
                        fecha_inicio_lanzamiento: bodyClean.fecha_inicio_lanzamiento,
                        mensaje_whatsapp: bodyClean.mensaje_whatsapp,
                    }, {
                        where: {
                            id_configuracion_curso: id
                        }
                    })

                    // res.status(200).json({
                    //     code: 200,
                    //     success: true,
                    //     message: 'Curso registrado con exito + banner'
                    // })

                })

                /**
                 * enviar respuesta al cliente
                 */
                return res.status(200).json({
                    code: 200,
                    success: true,
                    message: 'Curso actualizado con exito + banner actualizado'
                })

            }
            //endregion

        } catch (e) {
            console.log(`Error: ${e}`);
            return res.status(501).json({
                success: false,
                message: 'Error al obtener los usuarios'
            });
        }
    },

    async delete(req, res) {
        try {
            const {id} = req.params

            await db.ConfiguracionCurso.update({
                estado_curso: 'ELIMINADO'
            }, {
                where: {
                    id_configuracion_curso: id
                }
            })

            return res.status(200).json({
                code: 200,
                success: true,
                message: 'Curso eliminado con exito'
            })

        } catch (e) {
            console.log(`Error: ${e}`);
            handleErrorResponse(res, 'Error al intentar eliminar el curso', 500)

        }
    }

}