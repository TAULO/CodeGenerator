/**
 * Funcionaliad para la tabla de detalle gasto
 * - mostrar vistas previas
 * - ver, crear y actualizar detalles de gasto
 * - mostrar documentos de la pagina
 * @class
 */
const TablaDetalleGasto = {

    mostrarOpcionesParaCargarImagen() {
        if (device.platform == 'iOS') {
            this.cargarImagen('OTRO');
        } else {
            fn.showActionSheet();
        }
    },

    /**
     * Opcion para cargar imagenes
     * para galeria y camara se usa un plugin
     * para el input se utiliza lo mismo que an iOS
     * 
     * @param {string} fuente CAMARA, GALERIA, OTRO
     */
    cargarImagen(fuente) {
        if (fuente === 'GALERIA' || fuente === 'CAMARA') {
            GastosService.cargarImagenConPlugin(fuente)
                .then(fileEntry => TablaDetalleGasto.mostarComprobanteComoCargado(1, fileEntry))
                .catch(error => {
                    showError('No se pudo cargar el gasto')
                    gastoLog.error('No se pudo cargar el gasto', error);
                })
        } else if (fuente == 'OTRO') {
            document.getElementById('gastos_archivo_file').click();
        }
        fn.hideActionSheet();
    },

    /**
     * Carga la imagen desde un input
     */
    cargarImagenInput(e) {
        let input = document.getElementById('gastos_archivo_file');
        GastosService.cargarImagenDesdeInput(input)
            .then(fileEntry => TablaDetalleGasto.mostarComprobanteComoCargado(1, fileEntry))
            .catch(error => {
                showError('No se pudo cargar el gasto')
                gastoLog.error('No se pudo cargar el gasto', error);
            })
    },

    cargarDocumento(numeroComprobante) {
        if (device.platform == 'iOS') {
            this.cargarDocumentoIOS(numeroComprobante)
        } else if (numeroComprobante == 2) {
            document.getElementById('file_xml').click();
        } else if (numeroComprobante == 3) {
            document.getElementById('file_pdf').click();
        }
    },

    /**
     * Cargar documentos xml y pdf en Android usando inputs
     * 
     * @param {Event} e 
     * @param {number} numeroComprobante 
     */
    cargarDocumentoAndroid(e, numeroComprobante) {
        /** @type {HTMLInputElement} */
        let input = e.target;
        let extension = input.value.split('.').pop().toLowerCase();
        if (numeroComprobante == 2 && extension != 'xml') {
            showError('La extension debe ser xml');
            return;
        } else if (numeroComprobante == 3 && extension != 'pdf') {
            showError('La extension debe ser pdf');
            return;
        }
        GastosService.guardarDocumentoGastoDesdeInput(input).then(fileEntry => {
            return TablaDetalleGasto.mostarComprobanteComoCargado(numeroComprobante, fileEntry);
        }).catch(error => {
            input.value = null;
            TablaDetalleGasto.mostarComprobanteSinSubir(numeroComprobante);
            showError('No se pudo guardar el documento xml');
            gastoLog.error('Error no se pudo guardar el documento', error)
        });
    },

    /**
     * Cargar documentos xml y pdf en iOS el plugin FilePicker
     * 
     * @param {number} numeroComprobante 
     */
    cargarDocumentoIOS(numeroComprobante) {
        //Abre el directorio para seleccionar archivos
        return new Promise((resolve, reject) => {
            FilePicker.pickFile(resolve, reject);
        }).then(file => {
            file = file.replace("/private", "file://");
            let extension = file.split('.').pop().toLowerCase();
            let newName = getUUID() + '.' + extension;
            if (numeroComprobante == 1 && !(extension == 'JPG' || extension == 'JPEG' || extension == 'PNG')) {
                return Promise.reject('Extension invalida')
            } else if (numeroComprobante == 2 && extension != 'XML') {
                return Promise.reject('Extension invalida')
            } else if (numeroComprobante == 3 && extension != 'PDF') {
                return Promise.reject('Extension invalida')
            }
            return GastosService.guardarDocumentoGasto(file, newName).then(fileEntry => {
                if (extension === 'xml') {
                    TablaDetalleGasto.mostarComprobanteComoCargado(2, fileEntry)
                } else if (extension === 'pdf') {
                    TablaDetalleGasto.mostarComprobanteComoCargado(3, fileEntry)
                }
            })
        }).catch(error => {
            showError('No se pudo abrir el archivo')
            uploadLog.error('Error al abrir archivo', error)
        })
    },

    /**
     * Muestra un modal con la imagen previa y las opciones de abrir con otra aplicacion
     * si la imagen no esta en el dispositivo la descarga
     */
    vistaPreviaImagen() {
        let imagen = document.getElementById('previoImagen').dataset.documento;
        let modal = document.getElementById('vistaPreviaImagenGasto');
        let archivoLocal = Promise.resolve(imagen);
        if (imagen.includes('../documentos')) { // no esta en el dispositivo, hay que descargarla
            archivoLocal = GastosService.descargarDocumenetoServidor(imagen);
        }
        archivoLocal
            .then(nativeURL => {
                console.error('nativeURL', nativeURL)
                return Directorios.obtenerBlobArchivo(nativeURL)
            })
            .then(blob => new Promise((resolve, reject) => {
                console.error(blob);
                let reader = new FileReader();
                reader.onloadend = e => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            }))
            .then(base64 => {
                modal.querySelector('img').src = base64;
                modal.show();
            })
            .catch(error => {
                gastoLog.error('Error al abrir imagen previa', error)
                showError('No se pudo abrir la imagen previa')
            })
    },

    /**
     * Muestra un modal con la vista previa del xml y la opcion de abrirlo en otra aplicacion
     * si el xml no esta disponible en local lo descarga
     */
    vistaPreviaXML() {
        let xml = document.getElementById('previoXML').dataset.documento;
        let modal = document.getElementById('vistaPreviaXMLGasto');
        let archivoLocal = Promise.resolve(xml);
        if (xml.includes('../documentos')) {
            archivoLocal = GastosService.descargarDocumenetoServidor(xml);
        }
        archivoLocal
            .then(nativeURL => {
                console.error('obteniendo blob', nativeURL)
                return Directorios.obtenerBlobArchivo(nativeURL)
            })
            .then(blob => new Promise((resolve, reject) => {
                console.error('blob', blob)
                let reader = new FileReader();
                reader.onloadend = e => resolve(e.srcElement.result);
                reader.onerror = e => reject;
                reader.readAsText(blob);
            }))
            .then(xml => {
                return modal.show().then(() => {
                    modal.querySelector('p').innerText = xml;
                })
            })
            .catch(error => {
                gastoLog.error('Error al abrir xml previo', error);
                showError('No se pudo abrir el xml del gasto');
                modal.hide();
            });
    },

    /**
     * Abre la imagen con otra aplicacion
     */
    abrirImagenPrevio() {
        let imagen = document.getElementById('previoImagen').dataset.documento;
        let modal = document.getElementById('vistaPreviaImagenGasto');
        let archivoLocal = Promise.resolve(imagen);
        console.error('abriendo imagen', imagen)
        if (imagen.includes('../documentos')) {
            archivoLocal = GastosService.descargarDocumenetoServidor(imagen);
        }
        archivoLocal
            .then(nativeURL => abrirDocumentoConAplicacionDeTerceros(nativeURL, 'image/png'))
            .catch(error => showError('No se pudo abrir el documento'))
            .finally(() => modal.hide())
    },

    /**
     * Abre el xml con una aplicacion de terceros
     */
    abrirXMLPrevio() {
        let xml = document.getElementById('previoXML').dataset.documento;
        let modal = document.getElementById('vistaPreviaXMLGasto');
        let archivoLocal = Promise.resolve(xml);
        if (xml.includes('../documentos')) {
            archivoLocal = GastosService.descargarDocumenetoServidor(xml);
        }
        archivoLocal
            .then(nativeURL => abrirDocumentoConAplicacionDeTerceros(nativeURL, 'text/xml'))
            .catch(error => showError('No se pudo abrir el documento'))
            .finally(() => modal.hide())
    },

    /**
     * Abre el pdf con una aplicacion de terceros
     */
    abrirDocumentoPrevioPDF() {
        let pdf = document.getElementById('previoPDF').dataset.documento;
        let archivoLocal = Promise.resolve(pdf);
        if (pdf.includes('../documentos')) {
            archivoLocal = GastosService.descargarDocumenetoServidor(pdf);
        }
        archivoLocal
            .then(nativeURL => abrirDocumentoConAplicacionDeTerceros(nativeURL, 'application/pdf'))
            .catch(error => showError('No se pudo abrir el documento'))
            .finally(() => modal.hide())
    },

    /**
     * Muetra el comprobante como cargado
     * 
     * @param {number} numero 
     * @param {*} fileEntry 
     */
    mostarComprobanteComoCargado(numero, fileEntry) {
        let input = document.getElementById('fotoComprobante');
        let previo = document.getElementById('previoImagen')
        if (numero == 1) {
            document.getElementById('gastos_archivo').value = fileEntry.nativeURL; // guardar archivo
        } else if (numero == 2) {
            input = document.getElementById('xmlCargado');
            previo = document.getElementById('previoXML')
            document.getElementById('gastos_archivo_xml').value = fileEntry.nativeURL; // guardar archivo
        } else if (numero == 3) {
            input = document.getElementById('archivoCargado')
            previo = document.getElementById('previoPDF');
            document.getElementById('gastos_archivo_3').value = fileEntry.nativeURL; // guardar archivo
        }
        // mostrar documento como cargado
        input.parentElement.querySelector('span').innerText = `Comprob. ${numero} Cargado`;
        input.parentElement.style.backgroundColor = '#FE8416';
        input.parentElement.style.color = 'white';
        previo.style.display = 'block'; // mostrar vista previa
        previo.dataset.documento = fileEntry.nativeURL; // agregar documento para vista previa
        previo.querySelector('span').innerText = fileEntry.fullPath.split('/').pop() // agregando nombre del documento
    },

    /**
     * Muestra el comprobante como no cargado, con la opcion de subirlo
     * @param {number} numero 
     */
    mostarComprobanteSinSubir(numero) {
        let input = document.getElementById('fotoComprobante');
        let previo = document.getElementById('previoImagen')
        if (numero == 1) {
            document.getElementById('gastos_archivo').value = null; // guardar archivo
        } else if (numero == 2) {
            input = document.getElementById('xmlCargado');
            previo = document.getElementById('previoXML')
            document.getElementById('gastos_archivo_xml').value = null; // guardar archivo
        } else if (numero == 3) {
            input = document.getElementById('archivoCargado')
            previo = document.getElementById('previoPDF');
            document.getElementById('gastos_archivo_3').value = null; // guardar archivo
        }
        // mostrar documento como no cargado
        input.parentElement.querySelector('span').innerText = `Subir`;;
        previo.style.display = 'none'; // ocultar vista previa
        previo.dataset.documento = null; // quitar documento para vista previa
    },

    /**
     * Función que consulta el detalle de un gasto y carga su tabla
     * @param {number|string} idDetalleGasto 
     */
    verDetalleGasto(idDetalleGasto, idGasto) {
        let idSiniestro = window.localStorage.getItem("idSiniestroServidor");
        gastoLog.debug(`consultando detalle gasto idGasto: ${idGasto} idDetalleGasto: ${idDetalleGasto}`);
        window.localStorage.setItem("idDetalleGasto", idDetalleGasto); //Inicio sesión
        fn.load("detalleReporteGasto.html").then(() => {
            document.querySelector('[data-seleccionar-ajustador]').style.display = 'none';
            document.querySelector('[data-limpiar-ajustador]').style.display = 'none';
        })
        showLoading();
        sqlQuery('SELECT * FROM DetalleGasto WHERE idDetalleGasto = ? AND fk_idGasto = ?', [idDetalleGasto, idGasto], function (detalleGasto) {
            if (detalleGasto != true) {
                TablaDetalleGasto.mostrarDetalleGasto(detalleGasto)
            } else {
                showNotice("El gasto no esta disponible");
            }
        });
    },

    /**
     * Elimina el detalle del gasto
     * @returns {Promise<any>}
     */
    eliminarDetalleGasto() {
        let idDetalleGasto = document.getElementById('idDetalleGasto').value;
        ons.notification.confirm('¿Esta seguro que desea eliminar este detalle de gasto?', {
            title: 'Eliminar',
            cancelable: true,
            buttonLabels: ['Cancelar', 'Confirmar']
        }).then(resultado => {
            if (resultado === 0) {
                return Promise.reject(resultado);
            }
            return GastosService.obtenerDetalleGasto(idDetalleGasto);
        }).then(detalleGasto => {
            let estaSincronizado = detalleGasto.gastos_id != null &&
                String(detalleGasto.gastos_id).trim() != '';
            if (!estaSincronizado) { // eliminar localmente
                console.log('no esta sincronizado eliminado localmente')
                return GastosService.eliminarDetalleGasto(idDetalleGasto)
                    .then(() => verReporteGasto(null, detalleGasto.fk_idGasto));
            } else { // dejar pendiente de eliminacion
                return guardarPeticionPromise('', 'POST', 'EliminarDetalleGasto', 'idDetalleGasto', idDetalleGasto)
                    .then(() => verReporteGasto(null, detalleGasto.fk_idGasto));
            }
        }).catch(error => {
            // 0 - fue cancelado por el usuario en el prompt
            if (error !== 0) {
                showError('No se pudo eliminar el gasto')
                gastoLog.error('No se pudo iniciar el proceso para eliminar detalle gasto', error)
            }
        })
    },

    /**
     * Función que permite mostrar
     * la información detallada del reporte de un gasto
     * @param {DetalleGasto[]} detalleGasto 
     */
    mostrarDetalleGasto(detalleGasto) {
        showLoading();
        let botonPrevioXML = document.getElementById('previoXML');
        let botonPrevioPDF = document.getElementById('previoPDF');
        let botonPrevioImagen = document.getElementById('previoImagen');
        let previoPDF = document.getElementById('previoPDF');
        let titleApp = window.localStorage.getItem("titleApp");
        let title = window.localStorage.getItem("tituloGasto");
        $('#titleApp').html(titleApp);
        $('#titlePage').append(title);
        if (detalleGasto != null) {
            console.error(detalleGasto[0])
            let estaSincronizado = detalleGasto[0].gastos_id != null &&
                String(detalleGasto[0].gastos_id).trim() != '';
            if (!estaSincronizado) {
                $('#informacion-extra').append(`
                    <tr data-pendiente-subir>
                        <th colspan="3"><ons-icon icon="md-info"></ons-icon> Pendiente de subir </ons-icon>
                        </th>
                    </tr>
                `);
            }
            GastosService.tieneDocumentosPendientes(detalleGasto[0].idDetalleGasto).then(tieneDocumentosPendientes => {
                if (tieneDocumentosPendientes) {
                    $('#informacion-extra').append(`
                    <tr data-documentos-pendientes>
                        <th colspan="3"><ons-icon icon="md-info"></ons-icon> Documentos pendientes de subir </th>
                    </tr>
                `);
                }
            })
            CatalogoService.obtenerAjustadorPorId(detalleGasto[0].gastos_ajustador).then(ajustador => {
                $('[data-ajustador-nombre]').val(ajustador.nombre);
                $('[data-ajustador-nombre-defecto]').val(ajustador.nombre);
                $('[data-ajustador-iniciales]').val(ajustador.iniciales);
                $('[data-ajustador-iniciales-defecto]').val(ajustador.iniciales);
            }).catch(e => {
                $('[data-ajustador-nombre]').val(detalleGasto[0].ajustador);
                $('[data-ajustador-nombre-defecto]').val(detalleGasto[0].ajustador);
                $('[data-ajustador-iniciales]').val(detalleGasto[0].ajustador);
                $('[data-ajustador-iniciales-defecto]').val(detalleGasto[0].ajustador);
            })
            $('[data-ajustador-id]').val(detalleGasto[0].gastos_ajustador);
            $('[data-ajustador-id-defecto]').val(detalleGasto[0].gastos_ajustador);
            $('#idDetalleGasto').val(detalleGasto[0].idDetalleGasto);
            $('#gastos_id').val(detalleGasto[0].gastos_id);
            $('#gastos_fecha_real').val(detalleGasto[0].gastos_fecha_real);
            $('#gastos_descripcion').val(detalleGasto[0].gastos_descripcion);
            $('#gastos_razon_social').val(detalleGasto[0].gastos_razon_social);
            $('#gastos_emisor').val(detalleGasto[0].gastos_emisor);
            $('#gastos_valor').val(detalleGasto[0].gastos_valor);
            $('#gastos_moneda').html(detalleGasto[0].gastos_moneda);
            $('#gastos_cargar').val(detalleGasto[0].gastos_cargar);
            $('#gastos_amex').val(detalleGasto[0].gastos_amex);
            $('#idGasto').val(detalleGasto[0].fk_idGasto);
            console.error('Detalle gasto mostrado', detalleGasto)
            let comprob1 = detalleGasto[0].gastos_archivo ? detalleGasto[0].gastos_archivo : detalleGasto[0].up_documento_2;
            if (comprob1 != undefined && comprob1 != null) {
                window.localStorage.setItem("comprob1", true);
                //$('#gastos_archivo').val(comprob1);
                $('#titleComprob1').html('<a style="color:#0081BD;"><center><strong>Comprob. 1</strong></center></a>');
                botonPrevioImagen.querySelector('span').innerText = comprob1.substr(comprob1.lastIndexOf('/') + 1);
                botonPrevioImagen.dataset.documento = comprob1;
                botonPrevioImagen.style.display = 'block';
            }

            let comprob2 = detalleGasto[0].gastos_archivo_xml;
            if (comprob2 != null && comprob2.trim() != "") {
                console.error('si hay xml')
                //$('#gastos_archivo_xml').val(comprob2);
                $('#titleComprob2').html('<a style="color:#0081BD;"><center><strong>Comprob. 2</strong></center></a>');
                botonPrevioXML.querySelector('span').innerText = comprob2.substr(comprob2.lastIndexOf('/') + 1);
                botonPrevioXML.dataset.documento = comprob2;
                botonPrevioXML.style.display = 'block';
            }

            let comprob3 = detalleGasto[0].gastos_archivo_3;
            if (comprob3 != null && comprob3.trim() != "") {
                //$('#gastos_archivo_3').val(comprob3);
                $('#titleComprob3').html('<a style="color:#0081BD;"><center><strong>Comprob. 3</strong></center></a>');
                botonPrevioPDF.querySelector('span').innerText = comprob3.substr(comprob3.lastIndexOf('/') + 1);
                botonPrevioPDF.dataset.documento = comprob3;
                botonPrevioPDF.style.display = 'block';
            }

            sqlQuery('SELECT * FROM CatalogoConcepto', null, function (conceptos) {
                if (conceptos != true) {
                    var selectConceptos = '';
                    selectConceptos += '<ons-select id="select_conceptos">';
                    conceptos.forEach(function (concepto) {
                        if (concepto.concepto_tex == detalleGasto[0].gastos_concepto) {
                            selectConceptos += '<option value="' + concepto.concepto_id + '" selected>' + concepto.concepto_tex + '</option>';
                        } else {
                            selectConceptos += '<option value="' + concepto.concepto_id + '" >' + concepto.concepto_tex + '</option>';
                        }
                    });
                    selectConceptos += '</ons-select>'
                    $('#gastos_concepto').html(selectConceptos);
                }
            });
            loadActionSheet('imageOptions.html');
            $('#detalleOptions').html(`
                <ons-row>
                    <ons-col>
                        <center>
                            <ons-button id="btnGuardarDetalleGasto" style="
                                        font-size:18px;
                                        background-color:#D8DADB;
                                        color: #0081BD;
                                        margin-bottom: 1rem;" 
                                    onclick="TablaDetalleGasto.actualizarDetalleGasto()">
                                <ons-icon icon="md-save" style="color: #FE8416;"></ons-icon>
                                &nbsp;Guardar cambios
                            </ons-button>
                        </center>
                    </ons-col>
                </ons-row>
            `);
            GastosService.estaPendienteDeEliminar(detalleGasto[0].idDetalleGasto).then(pendiente => {
                if (!pendiente) {
                    $('#detalleOptions center').append(`  
                        <ons-button id="btnGuardarDetalleGasto" style="
                                    font-size:18px;
                                    background-color:red;
                                    color: #fff" 
                                onclick="TablaDetalleGasto.eliminarDetalleGasto()">
                            <ons-icon icon="md-delete" style="color: #fff;"></ons-icon>
                            &nbsp;Eliminar detalle de gasto
                        </ons-button>
                    `);
                } else {
                    $('#informacion-extra').append(`
                        <tr>
                            <th colspan="3" style="color: red;">
                                <ons-icon icon="md-info"></ons-icon> Pendiente de eliminar
                            </th>
                        </tr>
                    `);
                }
            })

        } else {
            showNotice("No se logró obtener el detalle del gasto");
        }
        hideLoading();
    },

    /**
    * Función que muestra las opciones de la
    * pantalla detalle gastos
    * @param {*} tipo 
    */
    optionsDetalleGasto(tipo) {
        var html = '';
        if (tipo == 'nuevo') {
            html += '<ons-row>'
                + '<ons-col>'
                + '<center>'
                + '<ons-button id="btnCrearYSalir" style="font-size:18px;background-color:#D8DADB;color: #0081BD" onclick="submitNuevoDetalleSalir();">'
                + '<ons-icon icon="md-save" style="color: #FE8416;"></ons-icon>'
                + ' Crear y Salir'
                + '</ons-button>'
                + '</center>'
                + '</ons-col>'
                + '<ons-col>'
                + '<center>'
                + '<ons-button id="btnCrearYNuevo" style="font-size:18px;background-color:#D8DADB;color: #0081BD" onclick="submitNuevoDetalleNuevo();">'
                + '<ons-icon icon="md-save" style="color: #FE8416;"></ons-icon>'
                + ' Crear y Nuevo'
                + '</ons-button>'
                + '</center>'
                + '</ons-col>'
                + '</ons-row>';
        } else {
            html += `
            <ons-row>
                <ons-col>
                    <center>
                        <ons-button id="btnGuardarDetalleGasto" style="
                                    font-size:18px;
                                    background-color:#D8DADB;
                                    color: #0081BD;
                                    margin-bottom: 1rem;" 
                                onclick="TablaDetalleGasto.actualizarDetalleGasto()">
                            <ons-icon icon="md-save" style="color: #FE8416;"></ons-icon>
                            &nbsp;Guardar cambios
                        </ons-button>
                    </center>
                </ons-col>
            </ons-row>`
        }

        $('#detalleOptions').html(html);
    },

    /**
     * Guarda el nuevo detalle
     * accion='salir' crea el detalle y regresa al reporte de gasto
     * accion='nuevo' crea el detalle y vuelve a la pantall para crear detalles de gasto
     * @param {string} accion nuevo, salir
     */
    guardarNuevoDetalle(accion) {
        document.getElementById('btnCrearYSalir').setAttribute('disabled', 'disabled');
        document.getElementById('btnCrearYNuevo').setAttribute('disabled', 'disabled');
        if (accion == 'salir') {
            document.getElementById('btnCrearYSalir').insertAdjacentHTML('beforeend', `<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true" style="margin-bottom: 2px;"></span>`)
        } else if (accion == 'nuevo') {
            document.getElementById('btnCrearYNuevo').insertAdjacentHTML('beforeend', `<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true" style="margin-bottom: 2px;"></span>`)
        }
        gastoLog.debug('guardando nuevo detalle accion:' + accion);

        var idConcepto = $('#select_conceptos').val();
        let idGasto = window.localStorage.getItem("idGasto");
        let gastos_repor_id = window.localStorage.getItem("numeroReporte");
        if ($.trim(gastos_repor_id) == "") {
            verReporteGasto(null, idGasto);
            showError("Ocurrió un problema, intente capturar el gasto nuevamente");
            return;
        }
        getConceptoPorId(idConcepto, function (concepto) {
            console.error('\n\n Guardando nuevo detalle \n\n')
            TablaDetalleGasto.obtenerParametros(concepto.concepto_tex)
                .then(params => {
                    gastoLog.debug('params recibidos', params)
                    GastosService.guardarDetalleGasto(params)
                        .then(r => r.insertId) // obtener id del SQlResultSet
                        .then(idDetalleGasto => {
                            // agregar peticion para el detalle
                            console.error('idDetalleGasto', idDetalleGasto)
                            let agregarPeticionDetalle = guardarPeticionPromise(server + "gasto_detalle.php",
                                'DOCUMENT', 'DetalleGasto', 'idDetalleGasto', idDetalleGasto);
                            let actualizarXML = Promise.resolve();
                            let actualizarPDF = Promise.resolve();
                            // actualizar foto
                            let actualizarFoto = GastosService.actualizarFoto(idGasto, idDetalleGasto, params.up_documento_2)
                                .then(r => r.insertId)
                                .then(idDocumentoGasto => guardarPeticionPromise(server + "archivos_gasto.php", 'DOCUMENT',
                                    'DocumentoGasto', 'idDocumentoGasto', idDocumentoGasto))
                            // actualizar el xml, generar peticion y notificar al usuario
                            if (params.gastos_archivo_xml != null && params.gastos_archivo_xml.trim() != "") {
                                actualizarXML = GastosService.actualizarXML(params.fk_idGasto, idDetalleGasto, params.gastos_archivo_xml)
                                    .then(r => r.insertId) // obtener id del SQlResultSet
                                    .then(idDocumentoGasto => guardarPeticionPromise(server + "archivos_gasto.php", 'DOCUMENT',
                                        'DocumentoGasto', 'idDocumentoGasto', idDocumentoGasto))
                                    .then(() => showSuccess("Se ha guardado el Comprobante 2 exitosamente"))
                            }
                            // actualizar el pdf, generar peticion y notificar al usuario
                            if (params.gastos_archivo_3 != null && params.gastos_archivo_3.trim() != "") {
                                actualizarPDF = GastosService.actualizarPDF(params.fk_idGasto, idDetalleGasto, params.gastos_archivo_3)
                                    .then(r => r.insertId) // obtener id del SQlResultSet
                                    .then(idDocumentoGasto => guardarPeticionPromise(server + "archivos_gasto.php", 'DOCUMENT',
                                        'DocumentoGasto', 'idDocumentoGasto', idDocumentoGasto))
                                    .then(() => showSuccess("Se ha guardado el Comprobante 3 exitosamente"))
                            }
                            return Promise.all([
                                agregarPeticionDetalle,
                                actualizarFoto,
                                actualizarXML,
                                actualizarPDF,
                            ])
                        })
                }).then(() => {
                    if (accion == 'nuevo') {
                        initNuevoDetalle();
                    } else {
                        verReporteGasto(null, idGasto);
                    }
                })
                .catch(error => {
                    if (error === 'Imagen no disponible') {
                        showError('La imagen no esta disponible');
                    } else {
                        showError('No se pudo guardar el detalle de gasto');
                    }
                    gastoLog.error('No se guardo detalle', error);
                    var spinner = document.querySelector('#btnCrearYSalir span');
                    if (spinner != null) {
                        spinner.parentNode.removeChild(spinner)
                    }
                    spinner = document.querySelector('#btnCrearYNuevo span');
                    if (spinner != null) {
                        spinner.parentNode.removeChild(spinner)
                    }
                    document.getElementById('btnCrearYSalir').removeAttribute('disabled');
                    document.getElementById('btnCrearYNuevo').removeAttribute('disabled');
                })
        });
    },

    /**
     * Actualiza el detalle de gasto con los datos del formulario
     */
    actualizarDetalleGasto() {
        document.getElementById('btnGuardarDetalleGasto').setAttribute('disabled', 'disabled');
        document.getElementById('btnGuardarDetalleGasto').insertAdjacentHTML('beforeend', `<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true" style="margin-bottom: 2px;"></span>`)
        gastoLog.debug('actualizando detalle gasto');

        var idConcepto = $('#select_conceptos').val();
        getConceptoPorId(idConcepto, function (concepto) {
            TablaDetalleGasto.obtenerParametros(concepto.concepto_tex)
                .then(params => {
                    let actualizarDetallePromesa = GastosService.actualizarDetalleGastoSinDocumentos(params)
                        .then(() => guardarPeticionPromise('gasto_detalle.php', 'PUT',
                            'DetalleGasto', 'idDetalleGasto', params.idDetalleGasto))
                    let actualizarXML = null;
                    let actualizarPDF = null;
                    let actualizarFoto = null;
                    // actualizar el foto, generar peticion y notificar al usuario
                    if (params.gastos_archivo != null && params.gastos_archivo.trim() != "") {
                        actualizarFoto = GastosService.actualizarFoto(params.gastos_id, params.idDetalleGasto, params.gastos_archivo)
                            .then(r => r.insertId) // obtener id del SQlResultSet
                            .then(idDocumentoGasto => guardarPeticionPromise(server + "archivos_gasto.php", 'DOCUMENT',
                                'DocumentoGasto', 'idDocumentoGasto', idDocumentoGasto))
                            .then(() => showSuccess("Se ha actualizado el Comprobante 1 exitosamente"))
                    }
                    // actualizar el xml, generar peticion y notificar al usuario
                    if (params.gastos_archivo_xml != null && params.gastos_archivo_xml.trim() != "") {
                        actualizarXML = GastosService.actualizarXML(params.gastos_id, params.idDetalleGasto, params.gastos_archivo_xml)
                            .then(r => r.insertId) // obtener id del SQlResultSet
                            .then(idDocumentoGasto => guardarPeticionPromise(server + "archivos_gasto.php", 'DOCUMENT',
                                'DocumentoGasto', 'idDocumentoGasto', idDocumentoGasto))
                            .then(() => showSuccess("Se ha actualizado el Comprobante 2 exitosamente"))
                    }
                    // actualizar el pdf, generar peticion y notificar al usuario
                    if (params.gastos_archivo_3 != null && params.gastos_archivo_3.trim() != "") {
                        actualizarPDF = GastosService.actualizarPDF(params.gastos_id, params.idDetalleGasto, params.gastos_archivo_3)
                            .then(r => r.insertId) // obtener id del SQlResultSet
                            .then(idDocumentoGasto => guardarPeticionPromise(server + "archivos_gasto.php", 'DOCUMENT',
                                'DocumentoGasto', 'idDocumentoGasto', idDocumentoGasto))
                            .then(() => showSuccess("Se ha actualizado el Comprobante 3 exitosamente"))
                    }
                    return Promise.all([
                        actualizarDetallePromesa,
                        actualizarXML,
                        actualizarPDF,
                        actualizarFoto
                    ]).then(() => {
                        showSuccess("Se ha actualizado el detalle del gasto");
                        TablaDetalleGasto.verDetalleGasto(params.idDetalleGasto, params.fk_idGasto);
                    })
                })
                .catch(error => {
                    gastoLog.error('No se guardo detalle', error);
                    if (error === 'Imagen no disponible') {
                        showError('La imagen no esta disponible');
                    } else {
                        showError('No se pudo guardar el detalle de gasto');
                    }
                    var spinner = document.querySelector('#btnGuardarDetalleGasto span');
                    if (spinner != null) {
                        spinner.parentNode.removeChild(spinner)
                    }
                    document.getElementById('btnGuardarDetalleGasto').removeAttribute('disabled');
                })
        });
    },

    /**
     * Función para obtener los parámetros del detalle gasto del formulario
     */
    obtenerParametros(concepto) {
        var idSiniestro = window.localStorage.getItem("idSiniestroServidor");
        var moneda = window.localStorage.getItem("monedaGasto");
        var idGasto = window.localStorage.getItem("idGasto");
        var gastos_repor_id = window.localStorage.getItem("numeroReporte");
        var gastos_id = $('#gastos_id').val();
        var idDetalleGasto = $('#idDetalleGasto').val();
        var fotoComprobanteInput = document.getElementById('fotoComprobante');
        var fotoComprobante = fotoComprobanteInput.value.trim() != '' ? fotoComprobanteInput.value : $('#gastos_archivo').val();
        var fecha_real = $('#gastos_fecha_real').val();
        var detalleGasto = {
            idDetalleGasto: idDetalleGasto ? idDetalleGasto : null,
            gastos_id: gastos_id ? gastos_id : null,
            gastos_caso: idSiniestro ? idSiniestro : 0,
            gastos_ajustador: $('[data-ajustador-id]').val(),
            gastos_visada: null,
            gastos_id_reporte: gastos_repor_id ? gastos_repor_id : 0,
            gastos_valor: $('#gastos_valor').val(),
            gastos_cargar: $('#gastos_cargar').val(),
            gastos_moneda: moneda ? moneda : null,
            gastos_fecha_real: fecha_real ? fecha_real : null,
            gastos_emisor: $('#gastos_emisor').val(),
            gastos_descripcion: $('#gastos_descripcion').val(),
            gastos_concepto: concepto,
            gastos_razon_social: $('#gastos_razon_social').val(),
            gastos_viaje_ini: null,
            gastos_viaje_fin: null,
            gastos_amex: $('#gastos_amex').val(),
            gastos_nulo: null,
            gastos_user: window.localStorage.getItem("idUser"),
            gastos_archivo: $('#gastos_archivo').val(),
            gastos_archivo_xml: $('#gastos_archivo_xml').val(),
            gastos_archivo_3: $('#gastos_archivo_3').val(),
            gastos_fecha: null,
            ajustador: $('[data-ajustador-iniciales]').val(),
            fk_idGasto: idGasto != null ? idGasto : null,
            //Peticion de post
            gastos_repor_id: gastos_repor_id ? gastos_repor_id : 0,
            gastos_movil_caso: idSiniestro ? idSiniestro : 0,
            anio: fecha_real.split("-")[0] ? fecha_real.split("-")[0] : null,
            mes: fecha_real.split("-")[1] ? fecha_real.split("-")[1] : null,
            dia: fecha_real.split("-")[2] ? fecha_real.split("-")[2] : null,
            up_documento_2: $('#gastos_archivo').val(),
        }
        return Promise.resolve(detalleGasto);
    },
}
