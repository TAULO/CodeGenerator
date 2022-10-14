// -- GLOBAL
const functions = new Functions()
var ListDarkFactor = null
var ListNationalRestrictiveLists = null
var ListDefinitionMilitarySituation = null
var ListFinancialBehavior = null
var listFirma = null
var ListPhotografym = null
// --
getListStatusCivil();
getListDocumentType();
// --
function getFileExtension(filename) {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
}

// --
function getDatos(variable) {
    // --
    let query = window.location.search.substring(1);
    let vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] === variable) {
            return pair[1];
        }
    }
    return false;
}
/*function GenerateDocument() {
    // --
    let idIntegridad = getDatos("key");
    var itemIntegridad = getDatos("item");
    let url = urlGenerateDocument + "?IdIntegridad=" + idIntegridad + "&ItemIntegridadDet=" + itemIntegridad + "&idDocumentFile=0";
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        success: function (d) {
            console.log(d);
            var typeAlert = (d.Data.status == "0") ? 'success' : 'error';
            var Message = (d.Data.status == "0") ? 'Se genero el documento correctamente' : 'Ocurrio un problema, Comuniquese con sistemas';
            // --
            Swal.fire(
                'Generación de documentos',
                Message,
                typeAlert
            )
        }
    })
}*/



// --
function calculateGraphic() {
    // --
    let txt_escala_sinceridad = $("#txt_escala_sinceridad").val()
    let txt_nivel_riesgo = $("#txt_nivel_riesgo").val()
    // --
    if (txt_escala_sinceridad <= 100 & txt_nivel_riesgo <= 100 && txt_escala_sinceridad > 0 & txt_nivel_riesgo > 0) {
        // --
        var chart = Highcharts.chart('container-graphic', {

            title: {
                text: 'Resultados Test Psicologico'
            },

            subtitle: {
                text: ''
            },

            xAxis: {
                categories: ['Escala sinceridad', 'Nivel de Riesgo']
            },

            series: [{
                type: 'column',
                colorByPoint: true,
                data: [parseFloat(txt_escala_sinceridad), parseFloat(txt_nivel_riesgo)],
                showInLegend: false
            }]

        });

    } else {
        // -- alert("Ingrese digitos entre 1 y 50")
    }
    svg_to_png('container-graphic')
}


// --
function svg_to_png(container) {
    // --
    var wrapper = document.getElementById(container);
    var svg = wrapper.querySelector("svg");
    // --
    if (svg != null) {
        // --
        if (typeof window.XMLSerializer != "undefined") {
            var svgData = (new XMLSerializer()).serializeToString(svg);
        } else if (typeof svg.xml != "undefined") {
            var svgData = svg.xml;
        }
        // --
        var canvas = document.createElement("canvas");
        var svgSize = svg.getBoundingClientRect();
        canvas.width = svgSize.width;
        canvas.height = svgSize.height;
        var ctx = canvas.getContext("2d");
        // --
        var img = document.createElement("img");
        img.setAttribute("src", "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData))));

        img.onload = function () {
            ctx.drawImage(img, 0, 0);
            var imgsrc = canvas.toDataURL("image/png");
        };
    }

}

function dataURLtoFile(dataurl, filename) {
    // --
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    // --
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    // --
    return new File([u8arr], filename, { type: mime });
}




function GenerateDocument() {
    // --
    let idIntegridad = getDatos("key");
    var itemIntegridad = getDatos("item");
    let url = urlGenerateDocument + "?IdIntegridad=" + idIntegridad + "&ItemIntegridadDet=" + itemIntegridad + "&idDocumentFile=6";
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        success: function (d) {
            console.log(d);
            var typeAlert = (d.Data.status == "0") ? 'success' : 'error';
            var Message = (d.Data.status == "0") ? 'Se genero el documento correctamente' : 'Ocurrio un problema, Comuniquese con sistemas';
            // --
            Swal.fire(
                'Generación de documentos',
                Message,
                typeAlert
            )
        }
    })
}


$("#btn_3_10_Generar").on('click', function () {
    GenerateDocument();
});

// --
function getDatos(variable) {
    // --
    let query = window.location.search.substring(1);
    let vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] === variable) {
            return pair[1];
        }
    }
    return false;
}

// --
function validateNumber(value) {
    // --
    if (value === undefined || value === null || value === 'null' || value === '') {
        return 0
    } else {
        return value
    }
}


// -- PROCESOS JUDICIALES

// -- VARIABLES
var listProcesosJudiciales = new Array()
var indexListProcesosJudiciales = 1

// -- TABLE
var tableProcesosJudiciales = $('#tbl_1_2_list').DataTable({
    responsive: true,
    language: {
        "url": "../Files/lenguaje-spanish.json"
    }
})

// -- AGREGAR DATOS A LA TABLA
$("#btn_1_2_agregar").on('click', function () {
    // --
    let txt_1_2_ciudad = $('#txt_1_2_ciudad').val()
    let txt_1_2_despacho = $('#txt_1_2_despacho').val()
    let txt_1_2_proceso = $('#txt_1_2_proceso').val()
    let txt_1_2_clase = $('#txt_1_2_clase').val()
    let txt_1_2_demandantes = $('#txt_1_2_demandantes').val()
    let txt_1_2_demandados = $('#txt_1_2_demandados').val()

    // -- Validar 
    if (
        txt_1_2_ciudad.length > 0 &&
        txt_1_2_despacho.length > 0 &&
        txt_1_2_proceso.length > 0 &&
        txt_1_2_clase.length > 0 &&
        txt_1_2_demandantes.length > 0 &&
        txt_1_2_demandados.length > 0
    ) {
        // --
        let object = {
            "IdProcesoJudicial": 0,
            "ItemProcesoJudicial": 0,
            "Ciudad": txt_1_2_ciudad,
            "Despacho": txt_1_2_despacho,
            "Proceso": txt_1_2_proceso,
            "Clase": txt_1_2_clase,
            "Demandantes": txt_1_2_demandantes,
            "Demandados": txt_1_2_demandados,
        }

        // -- Agregar objeto al listado
        listProcesosJudiciales.push(object)

        // -- Agregar datos a la tabla
        tableProcesosJudiciales.row.add([
            indexListProcesosJudiciales,
            txt_1_2_ciudad,
            txt_1_2_despacho,
            txt_1_2_proceso,
            txt_1_2_clase,
            txt_1_2_demandantes,
            txt_1_2_demandados,
            ' <button class= "btn btn-sm btn-danger" data-id="' + indexListProcesosJudiciales + '" id="btn_1_2_delete_row"> <i class="fa fa-trash"></i></button >'
        ]).draw(false);
        tableProcesosJudiciales.columns.adjust()
            .responsive.recalc();
        // --
        indexListProcesosJudiciales++
        clearFormularyProcesosJudiciales()
    } else {
        functions.notify_message(MESSAGE.es.complete_formulary, 'warning')
    }
})

// -- ELIMINAR DATOS DE LA TABLA
$(document).on('click', '#btn_1_2_delete_row', function () {
    // --
    let value = $(this).attr('data-id')
    let index = null;
    // --
    tableProcesosJudiciales.rows(function (idx, data, node) {
        if (data[0] == value) {
            index = idx;
        }
    });
    // --
    tableProcesosJudiciales.row(index).remove().draw(false);
    // --
    let indexObject = listProcesosJudiciales.findIndex(x => x.index == value);
    listProcesosJudiciales.splice(indexObject, 1);
    // --
})

// -- LIMPIAR FORMULARIO
function clearFormularyProcesosJudiciales() {
    // --
    $('#txt_1_2_ciudad').val('')
    $('#txt_1_2_despacho').val('')
    $('#txt_1_2_proceso').val('')
    $('#txt_1_2_clase').val('')
    $('#txt_1_2_demandantes').val('')
    $('#txt_1_2_demandados').val('')
}




// -- PROCESO LA/FT

// -- VARIABLES
var listProcesoLavadoActivos = new Array()
var indexListProcesoLavadoActivos = 1

// -- TABLE
var tableLavadoActivos = $('#tbl_1_3_list').DataTable({
    responsive: true,
    language: {
        "url": "../Files/lenguaje-spanish.json"
    }
})

// -- AGREGAR DATOS A LA TABLA
$("#btn_1_3_agregar").on('click', function () {
    // --
    let txt_1_3_evaluacion_nacional_riesgo = $('#txt_1_3_evaluacion_nacional_riesgo').val()
    let txt_1_3_ciudad = $('#txt_1_3_ciudad').val()
    let txt_1_3_despacho = $('#txt_1_3_despacho').val()
    let txt_1_3_proceso = $('#txt_1_3_proceso').val()
    let txt_1_3_clase = $('#txt_1_3_clase').val()
    let txt_1_3_demandantes = $('#txt_1_3_demandantes').val()
    let txt_1_3_demandados = $('#txt_1_3_demandados').val()

    // -- Validar 
    if (
        txt_1_3_ciudad.length > 0 &&
        txt_1_3_despacho.length > 0 &&
        txt_1_3_proceso.length > 0 &&
        txt_1_3_clase.length > 0 &&
        txt_1_3_demandantes.length > 0 &&
        txt_1_3_demandados.length > 0
    ) {
        // --
        let object = {
            "IdLavadoActivos": 0,
            "ItemLavadoActivos": 0,
            "Ciudad": txt_1_3_ciudad,
            "Despacho": txt_1_3_despacho,
            "Proceso": txt_1_3_proceso,
            "Clase": txt_1_3_clase,
            "Demandantes": txt_1_3_demandantes,
            "Demandados": txt_1_3_demandados,
        }

        // -- Agregar objeto al listado
        listProcesoLavadoActivos.push(object)

        // -- Agregar datos a la tabla
        tableLavadoActivos.row.add([
            indexListProcesoLavadoActivos,
            txt_1_3_ciudad,
            txt_1_3_despacho,
            txt_1_3_proceso,
            txt_1_3_clase,
            txt_1_3_demandantes,
            txt_1_3_demandados,
            ' <button class= "btn btn-sm btn-danger" data-id="' + indexListProcesoLavadoActivos + '" id="btn_1_3_delete_row"> <i class="fa fa-trash"></i></button >'
        ]).draw(false);
        tableLavadoActivos.columns.adjust()
            .responsive.recalc();
        // --
        indexListProcesoLavadoActivos++
        clearFormularyProcesoLavadoActivos()
    } else {
        functions.notify_message(MESSAGE.es.complete_formulary, 'warning')
    }
})

// -- ELIMINAR DATOS DE LA TABLA
$(document).on('click', '#btn_1_3_delete_row', function () {
    // --
    let value = $(this).attr('data-id')
    let index = null;
    // --
    tableLavadoActivos.rows(function (idx, data, node) {
        if (data[0] == value) {
            index = idx;
        }
    });
    // --
    tableLavadoActivos.row(index).remove().draw(false);
    // --
    let indexObject = listProcesoLavadoActivos.findIndex(x => x.index == value);
    listProcesoLavadoActivos.splice(indexObject, 1);
    // --
})

// -- LIMPIAR FORMULARIO
function clearFormularyProcesoLavadoActivos() {
    // --
    $('#txt_1_3_ciudad').val('')
    $('#txt_1_3_despacho').val('')
    $('#txt_1_3_proceso').val('')
    $('#txt_1_3_clase').val('')
    $('#txt_1_3_demandantes').val('')
    $('#txt_1_3_demandados').val('')
}




// -- DEFINICION DE LA SITUACION MILITAR
// -- IMG
var file_1_6 = $('#file_1_6').prop("files")[0];
if (file_1_6 !== undefined) {
    // --
    let ext_1_6 = getFileExtension(file_1_6.name)
    // --
    if (ext_1_6.toLowerCase() == "pdf") {
        // --
        formData.append("dataFile", file_2_1_pdf, "FactorOscuro." + ext2_1_factor_oscuro).append("imagen", file_1_6);
    }
}




// -- COMPORTAMIENTO FINANCIERO
// -- IMG
var file_1_7 = $('#file_1_7').prop("files")[0];
if (file_1_7 !== undefined) {
    // --
    let ext_1_7 = getFileExtension(file_1_7.name)
    // --
    if (ext_1_7.toLowerCase() == "pdf") {
        // --
        formData.append("dataFile", file_2_1_pdf, "FactorOscuro." + ext2_1_factor_oscuro).append("imagen", file_1_7);
    }
}




// -- 1.11 ANEXOS

// -- VARIABLES
var listAnexos = new Array()
var listFilesAnexos = new Array()
var indexListAnexos = 1

// -- TABLE
var tableAnexos = $('#tbl_1_11_list').DataTable({
    responsive: true,
    language: {
        "url": "../Files/lenguaje-spanish.json"
    }
})


// -- AGREGAR DATOS A LA TABLA
$("#btn_1_11_agregar").on('click', function () {

    // -- 
    var file = $("#file_1_11").prop("files")[0]

    var ext = ""
    // --
    if (file !== undefined) {
        // --
        ext = getFileExtension(file.name)
        // --
        if (ext != "") {
            // --
            indexListAnexos = tableAnexos.rows().count() + 1
            // --
            let object = {
                "IdAnexo": 0,
                "ItemAnexo": 0,
                "ArchivoAdjuntoAnexo":
                {
                    "IdArchivoAdjunto": 0,
                    "NombreArchivo": "Anexo_" + indexListAnexos + "." + ext,
                    "RutaArchivo": null,
                    "ExtensionArchivo": ext,
                    "FecRegistro": null,
                    "IdUsuarioRegistro": 0
                }
            }
            console.log('Anexo', object)
            // -- Agregar objeto al listado
            listAnexos.push(object)
            // --
            file.id = indexListAnexos
            listFilesAnexos.push(file)

            // -- Agregar datos a la tabla
            tableAnexos.row.add([
                indexListAnexos,
                'Anexo_' + indexListAnexos,
                ' <button class= "btn btn-sm btn-danger" data-id="' + indexListAnexos + '" id="btn_1_11_delete_row"> <i class="fa fa-trash"></i></button >'
            ]).draw(false);
            // --
            tableAnexos.columns.adjust()
                .responsive.recalc();

            // --
            indexListAnexos++
            // --
            $('#file_1_11').val(null);

        }

    }

})

// -- ELIMINAR DATOS DE LA TABLA
$(document).on('click', '#btn_1_11_delete_row', function () {
    // --
    let value = $(this).attr('data-id')
    let index = null;
    // --
    tableAnexos.rows(function (idx, data, node) {
        if (data[0] == value) {
            index = idx;
        }
    });
    // --
    tableAnexos.row(index).remove().draw(false);
    // --
    let indexObject = listAnexos.findIndex(x => x.index == value)
    listAnexos.splice(indexObject, 1)
    // --
    $.each(listFilesAnexos, function (key, item) {
        if (item != undefined) {
            if (item.id == value) {
                listFilesAnexos.splice(key, 1)
            }
        }
    });

})


// -- GUARDAR
$('#btn_3_10_agregar').on('click', function () {
    // --
    var formData = new FormData();
    // -- GET VALUES
    let idIntegridad = getDatos("key");
    var itemIntegridad = getDatos("item");

    // -- I. INFORME ANTECEDENTES JUDICIALES

    // -- 1.1 DATOS BASICOS DEL CANDIDATO
    var txt_1_1_nombre = $('#txt_1_1_nombre').val()
    var txt_1_1_identificacion = $('#txt_1_1_identificacion').val()
    var txt_1_1_lugar_nacimiento = $('#txt_1_1_lugar_nacimiento').val()
    var txt_1_1_fecha_nacimiento = formatSave($('#txt_1_1_fecha_nacimiento').val())
    var txt_1_1_nacionalidad = $('#txt_1_1_nacionalidad').val()
    var txt_1_1_edad = $('#txt_1_1_edad').val()
    var txt_1_1_estado_civil = $('#txt_1_1_estado_civil').val()

    // -- 1.2 PROCESOS JUDICIALES
    var txt_1_2_procesos_contra = $('#txt_1_2_procesos_contra').val()
    var txt_1_2_procesos_interpuestos = $('#txt_1_2_procesos_interpuestos').val()


    // -- 1.3 PROCESO LA/FT
    var txt_1_3_evaluacion_nacional_riesgo = $('#txt_1_3_evaluacion_nacional_riesgo').val()


    // -- 1.5 LISTAS RESTRICTIVAS NACIONALES
    var txt_antec_fiscal = $('#txt_antec_fiscal').val()
    var txt_antec_disciplinario = $('#txt_antec_disciplinario').val()
    var txt_simit = $('#txt_simit').val()
    var txt_runt = $('#txt_runt').val()
    var txt_consul_afiliados_bdua = $('#txt_consul_afiliados_bdua').val()
    var txt_perso_expuesta_politicamente = $('#txt_perso_expuesta_politicamente').val()
    var txt_policia_nacional = $('#txt_policia_nacional').val()

    var file_1_5_antec_fiscal = $('#file_1_5_antec_fiscal').prop("files")[0];
    var txt_antec_fiscal = $('#txt_antec_fiscal').val()
    var file_1_5_antec_disciplinario = $('#file_1_5_antec_disciplinario').prop("files")[0];
    var txt_antec_disciplinario = $('#txt_antec_disciplinario').val()
    var file_1_5_simit = $('#file_1_5_simit').prop("files")[0];
    var txt_simit = $('#txt_simit').val()
    var file_1_5_runt = $('#file_1_5_runt').prop("files")[0];
    var txt_runt = $('#txt_runt').val()
    var file_1_5_consul_afiliados_bdua = $('#file_1_5_consul_afiliados_bdua').prop("files")[0];
    var txt_consul_afiliados_bdua = $('#txt_consul_afiliados_bdua').val()
    var file_1_5_perso_expuesta_politicamente = $('#file_1_5_perso_expuesta_politicamente').prop("files")[0];
    var txt_perso_expuesta_politicamente = $('#txt_perso_expuesta_politicamente').val()
    var file_1_5_policia_nacional = $('#file_1_5_policia_nacional').prop("files")[0];
    var txt_policia_nacional = $('#txt_policia_nacional').val()
    var ext1_5_antec_fiscal = ""
    var ext1_5_antec_disciplinario = ""
    var ext1_5_simit = ""
    var ext1_5_runt = ""
    var ext1_5_consul_afiliados_bdua = ""
    var ext1_5_perso_expuesta_politicamente = ""
    var ext1_5_policia_nacional = ""
    // --
    if (file_1_5_antec_fiscal !== undefined) {
        // --
        ext1_5_antec_fiscal = getFileExtension(file_1_5_antec_fiscal.name)
        // --
        if (ext1_5_antec_fiscal.toLowerCase() == "pdf") {
            // --
            formData.append("dataFile", file_1_5_antec_fiscal, "AntecFiscal." + ext1_5_antec_fiscal);
        }
    }
    // --
    if (file_1_5_antec_disciplinario !== undefined) {
        // --
        ext1_5_antec_disciplinario = getFileExtension(file_1_5_antec_disciplinario.name)
        // --
        if (ext1_5_antec_disciplinario.toLowerCase() == "pdf") {
            // --
            formData.append("dataFile", file_1_5_antec_disciplinario, "AntecDisciplinario." + ext1_5_antec_disciplinario);
        }
    }
    // --
    if (file_1_5_simit !== undefined) {
        // --
        ext1_5_simit = getFileExtension(file_1_5_simit.name)
        // --
        if (ext1_5_simit.toLowerCase() == "pdf") {
            // --
            formData.append("dataFile", file_1_5_simit, "Simit." + ext1_5_simit);
        }
    }
    // --
    if (file_1_5_runt !== undefined) {
        // --
        ext1_5_runt = getFileExtension(file_1_5_runt.name)
        // --
        if (ext1_5_runt.toLowerCase() == "pdf") {
            // --
            formData.append("dataFile", file_1_5_runt, "RUNT." + ext1_5_runt);
        }
    }
    // --
    if (file_1_5_consul_afiliados_bdua !== undefined) {
        // --
        ext1_5_consul_afiliados_bdua = getFileExtension(file_1_5_consul_afiliados_bdua.name)
        // --
        if (ext1_5_consul_afiliados_bdua.toLowerCase() == "pdf") {
            // --
            formData.append("dataFile", file_1_5_consul_afiliados_bdua, "BDUA." + ext1_5_consul_afiliados_bdua);
        }
    }
    // --
    if (file_1_5_perso_expuesta_politicamente !== undefined) {
        // --
        ext1_5_perso_expuesta_politicamente = getFileExtension(file_1_5_perso_expuesta_politicamente.name)
        // --
        if (ext1_5_perso_expuesta_politicamente.toLowerCase() == "pdf") {
            // --
            formData.append("dataFile", file_1_5_perso_expuesta_politicamente, "PersExpPolit." + ext1_5_perso_expuesta_politicamente);
        }
    }
    // --
    if (file_1_5_policia_nacional !== undefined) {
        // --
        ext1_5_policia_nacional = getFileExtension(file_1_5_policia_nacional.name)
        // --
        if (ext1_5_policia_nacional.toLowerCase() == "pdf") {
            // --
            formData.append("dataFile", file_1_5_policia_nacional, "PoliciaNacional." + ext1_5_policia_nacional);
        }
    }

    // -- 1.6 DEFINICION DE LA SITUACION MILITAR
    var txt_definicion_situacion_militar = $('#txt_definicion_situacion_militar').val()
    var file_1_6 = $('#file_1_6').prop("files")[0];
    var ext1_6 = ""
    // --
    if (file_1_6 !== undefined) {
        // --
        ext1_6 = getFileExtension(file_1_6.name)
        // --
        if (ext1_6.toLowerCase() == "pdf") {
            // --
            formData.append("dataFile", file_1_6, "DefSitMilitar." + ext1_6);
        }
    }

    // -- 1.7 COMPORTAMIENTO FINANCIERO
    var txt_comportamiento_financiero = $('#txt_comportamiento_financiero').val()
    var file_1_7 = $('#file_1_7').prop("files")[0];
    var ext1_7 = ""
    // --
    if (file_1_7 !== undefined) {
        // --
        ext1_7 = getFileExtension(file_1_7.name)
        // --
        if (ext1_7.toLowerCase() == "pdf") {
            // --
            formData.append("dataFile", file_1_7, "CompFinanciero." + ext1_7);
        }
    }

    // -- 1.8 VERIFICACIONES LABORALES
    var txt_1_8_nombre_empresa = $('#txt_1_8_nombre_empresa').val()
    var txt_1_8_cargo_desempenado = $('#txt_1_8_cargo_desempenado').val()
    var txt_1_8_fecha_inicio = formatSave($('#txt_1_8_fecha_inicio').val())
    var txt_1_8_fecha_termino = formatSave($('#txt_1_8_fecha_termino').val())
    var txt_1_8_motivo_retiro = $('#txt_1_8_motivo_retiro').val()
    var txt_1_8_tiempo_experiencia = $('#txt_1_8_tiempo_experiencia').val()
    var txt_1_8_persona_brinda_infomacion = $('#txt_1_8_persona_brinda_infomacion').val()
    var txt_1_8_cargo = $('#txt_1_8_cargo').val()
    var txt_1_8_telefonos_correo = $('#txt_1_8_telefonos_correo').val()
    var txt_1_8_experiencia_cargo_postula = $('#txt_1_8_experiencia_cargo_postula').val()
    var txt_1_8_experiencia_especifica = $('#txt_1_8_experiencia_especifica').val()
    var sl_1_8_desempeno = $('#sl_1_8_desempeno').val()
    var sl_1_8_volveria_contratar = $('#sl_1_8_volveria_contratar').val()
    var txt_1_8_observaciones = $('#txt_1_8_observaciones').val()
    var txt_1_8_conclusion = $('#txt_1_8_conclusion').val()

    // -- 1.9 VERIFICACIONES ACADÉMICAS
    var txt_1_9_nombre_institucion = $('#txt_1_9_nombre_institucion').val()
    var txt_1_9_titulo_grado = $('#txt_1_9_titulo_grado').val()
    var txt_1_9_fecha_finalizacion = formatSave($('#txt_1_9_fecha_finalizacion').val())
    var txt_1_9_estudio_terminado_proceso = $('#txt_1_9_estudio_terminado_proceso').val()
    var sl_1_9_acta_folio_diploma = $('#sl_1_9_acta_folio_diploma').val()
    var txt_1_9_persona_brinda_infomacion = $('#txt_1_9_persona_brinda_infomacion').val()
    var txt_1_9_cargo = $('#txt_1_9_cargo').val()
    var txt_1_9_telefono = $('#txt_1_9_telefono').val()
    var txt_1_9_correo = $('#txt_1_9_correo').val()
    var txt_1_9_conclusion = $('#txt_1_9_conclusion').val()

    // -- 1.11 ANEXOS
    var file_1_11 = $('#file_1_11').prop("files")[0];
    var ext1_11 = ""
    // --
    if (file_1_11 !== undefined) {
        // --
        ext1_11 = getFileExtension(file_1_11.name)
        // --
        if (ext1_11.toLowerCase() == "pdf") {
            // --
            formData.append("dataFile", file_2_1_pdf, "FactorOscuro." + ext2_1_factor_oscuro).append("dataFile", file_1_11, "Anexo." + ext1_11);
        }
    }

    // -- 2.1 FACTOR OSCURO
    var file_2_1_pdf = $('#file_2_1_factor_oscuro').prop("files")[0];
    var ext2_1_factor_oscuro = ""
    // --
    if (file_2_1_pdf !== undefined) {
        // --
        ext2_1_factor_oscuro = getFileExtension(file_2_1_pdf.name)
        // --
        if (ext2_1_factor_oscuro == "pdf") {
            // --
            formData.append("dataFile", file_2_1_pdf, "FactorOscuro." + ext2_1_factor_oscuro)
        }
    }



    // -- NEW
    // --
    var txt_1_nombres_apellidos = $("#txt_1_nombres_apellidos").val()
    var txt_1_nro_documento = $("#txt_1_nro_documento").val()
    var txt_1_fecha_expedicion = formatSave($("#txt_1_fecha_expedicion").val())
    var txt_1_direccion = $("#txt_1_direccion").val()
    var txt_1_lugar_nacimiento = $("#txt_1_lugar_nacimiento").val()
    var txt_1_fecha_nacimiento = formatSave($("#txt_1_fecha_nacimiento").val())
    var txt_1_nacionalidad = $("#txt_1_nacionalidad").val()
    var txt_1_edad = $("#txt_1_edad").val()
    var txt_1_estado_civil = $("#txt_1_estado_civil").val()
    var txt_1_nivel_educativo = $("#txt_1_nivel_educativo").val()

    // --
    var radioNivel = $('input:radio[name=radioNivel]:checked').val()
    var radioCalificacion = $('input:radio[name=radioCalificacion]:checked').val()

    // --
    var txt_escala_sinceridad = $("#txt_escala_sinceridad").val()
    var txt_nivel_riesgo = $("#txt_nivel_riesgo").val()

    // --
    // --
    var wrapper = document.getElementById("container-graphic");
    var svg = wrapper.querySelector("svg");
    // --
    if (svg != null) {
        // --
        if (typeof window.XMLSerializer != "undefined") {
            var svgData = (new XMLSerializer()).serializeToString(svg);
        } else if (typeof svg.xml != "undefined") {
            var svgData = svg.xml;
        }

        // --
        var canvas = document.createElement("canvas");
        var svgSize = svg.getBoundingClientRect();
        canvas.width = svgSize.width;
        canvas.height = svgSize.height;
        var ctx = canvas.getContext("2d");
        // --
        var img = document.createElement("img");
        img.setAttribute("src", "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData))));

        img.onload = function () {
            // --
            ctx.drawImage(img, 0, 0);
            // --
            var imgsrc = canvas.toDataURL("image/png");
            var file = dataURLtoFile(imgsrc, "FotoGrafico.png");
            formData.append("dataFile", file, "FotoGrafico.png");
        };
    }


    // --
    var radio_2_analisis = $('input:radio[name=radio_2_analisis]:checked').val()
    var txt_2_observaciones = $("#txt_2_observaciones").val()
    var txt_2_analisis = $("#txt_2_analisis").val()

    // --
    var sl_3_nivel_riesgo_financiero = $("#sl_3_nivel_riesgo_financiero").val()
    var txt_3_observaciones = $("#txt_3_observaciones").val()
    var txt_3_analisis = $("#txt_3_analisis").val()

    // --
    var txt_4_analisis = $("#txt_4_analisis").val()

    // -- OBJECT
    var objectData = {
        // --
        "oBasicDataFlt": {
            "IdDatoBasico": 0,
            "IdIntegridad": idIntegridad,
            "ItemIntegridadDet": itemIntegridad,
            "Nombre": txt_1_1_nombre,
            "Identificacion": txt_1_1_identificacion,
            "LugarNacimiento": txt_1_1_lugar_nacimiento,
            "FechaNacimiento": txt_1_1_fecha_nacimiento,
            "Nacionalidad": txt_1_1_nacionalidad,
            "Edad": txt_1_1_edad,
            "IdEstadoCivil": txt_1_1_estado_civil
        },
        // --
        "oJudicialProceedingsFlt": {
            "IdProcesoJudicial": 0,
            "IdIntegridad": idIntegridad,
            "ItemIntegridadDet": itemIntegridad,
            "NumProcesosContra": validateNumber(txt_1_2_procesos_contra),
            "NumProcesosInterpuestos": validateNumber(txt_1_2_procesos_interpuestos),
            "ListJudicialProceedingsDetailFlt": listProcesosJudiciales
        },
        // -- 
        "oMoneyLaunderingFlt":
        {
            "IdLavadoActivos": 0,
            "IdIntegridad": idIntegridad,
            "ItemIntegridadDet": itemIntegridad,
            "EvaluaNacionalRiesgo": validateNumber(txt_1_3_evaluacion_nacional_riesgo),
            "ListMoneyLaunderingDetailFlt": listProcesoLavadoActivos
        },
        "oNationalRestrictiveListsFlt":
        {
            "IdListaRestrictivaNacional": 0,
            "IdIntegridad": idIntegridad,
            "ItemIntegridadDet": itemIntegridad,
            "ArchivoAntecFiscal":
            {
                "IdArchivoAdjunto": 0,
                "NombreArchivo": "AntecFiscal",
                "RutaArchivo": null,
                "ExtensionArchivo": ext1_5_antec_fiscal,
                "FecRegistro": null,
                "IdUsuarioRegistro": 0
            },
            "AntecFiscal": txt_antec_fiscal,
            "ArchivoAntecDisciplinario":
            {
                "IdArchivoAdjunto": 0,
                "NombreArchivo": "AntecDisciplinario",
                "RutaArchivo": null,
                "ExtensionArchivo": ext1_5_antec_disciplinario,
                "FecRegistro": null,
                "IdUsuarioRegistro": 0
            },
            "AntecDisciplinario": txt_antec_disciplinario,
            "ArchivoSIMIT":
            {
                "IdArchivoAdjunto": 0,
                "NombreArchivo": "Simit",
                "RutaArchivo": null,
                "ExtensionArchivo": ext1_5_simit,
                "FecRegistro": null,
                "IdUsuarioRegistro": 0
            },
            "SIMIT": txt_simit,
            "ArchivoRUNT":
            {
                "IdArchivoAdjunto": 0,
                "NombreArchivo": "RUNT",
                "RutaArchivo": null,
                "ExtensionArchivo": ext1_5_runt,
                "FecRegistro": null,
                "IdUsuarioRegistro": 0
            },
            "RUNT": txt_runt,
            "ArchivoConsulAfiliadosBDUA":
            {
                "IdArchivoAdjunto": 0,
                "NombreArchivo": "BDUA",
                "RutaArchivo": null,
                "ExtensionArchivo": ext1_5_consul_afiliados_bdua,
                "FecRegistro": null,
                "IdUsuarioRegistro": 0
            },
            "ConsulAfiliadosBDUA": txt_consul_afiliados_bdua,
            "ArchivoPersoExpuestaPoliticamente":
            {
                "IdArchivoAdjunto": 0,
                "NombreArchivo": "PersExpPolit",
                "RutaArchivo": null,
                "ExtensionArchivo": ext1_5_perso_expuesta_politicamente,
                "FecRegistro": null,
                "IdUsuarioRegistro": 0
            },
            "PersoExpuestaPoliticamente": txt_perso_expuesta_politicamente,
            "ArchivoPoliciaNacional":
            {
                "IdArchivoAdjunto": 0,
                "NombreArchivo": "PoliciaNacional." + ext1_5_policia_nacional,
                "RutaArchivo": null,
                "ExtensionArchivo": ext1_5_policia_nacional,
                "FecRegistro": null,
                "IdUsuarioRegistro": 0
            },
            "PoliciaNacional": txt_policia_nacional
        },
        "oDefinitionMilitarySituationFlt":
        {
            "IdDefSituacionMilitar": 0,
            "IdIntegridad": idIntegridad,
            "ItemIntegridadDet": itemIntegridad,
            "ArchivoDefSituacionMilitar":
            {
                "IdArchivoAdjunto": 0,
                "NombreArchivo": "DefSitMilitar",
                "RutaArchivo": null,
                "ExtensionArchivo": ext1_6,
                "FecRegistro": null,
                "IdUsuarioRegistro": 0
            },
            "DefSituacionMilitar": txt_definicion_situacion_militar
        },
        "oFinancialBehaviorFlt":
        {
            "IdComportamientoFinanciero": 0,
            "IdIntegridad": idIntegridad,
            "ItemIntegridadDet": itemIntegridad,
            "ArchivoCompFinanciero":
            {
                "IdArchivoAdjunto": 0,
                "NombreArchivo": "CompFinanciero",
                "RutaArchivo": null,
                "ExtensionArchivo": ext1_7,
                "FecRegistro": null,
                "IdUsuarioRegistro": 0
            },
            "ComportamientoFinanciero": txt_comportamiento_financiero
        },
        "oLaborVerificationFlt":
        {
            "IdVerifLaboral": 0,
            "IdIntegridad": idIntegridad,
            "ItemIntegridadDet": itemIntegridad,
            "NombreEmpresa": txt_1_8_nombre_empresa,
            "CargoDesempeñado": txt_1_8_cargo_desempenado,
            "FechaInicio": txt_1_8_fecha_inicio,
            "FechaTerminacion": txt_1_8_fecha_termino,
            "MotivoRetiro": txt_1_8_motivo_retiro,
            "TiempoExperiencia": txt_1_8_tiempo_experiencia,
            "NombrePersonBrindaInfo": txt_1_8_persona_brinda_infomacion,
            "Cargo": txt_1_8_cargo,
            "Telefonos_Correo": txt_1_8_telefonos_correo,
            "ExpTotalCargoPostula": txt_1_8_experiencia_cargo_postula,
            "ExpEspecifica": txt_1_8_experiencia_especifica,
            "DescripcionDesempeño": sl_1_8_desempeno,
            "PreguntaVolveriaAContratar": sl_1_8_volveria_contratar,
            "Observaciones": txt_1_8_observaciones,
            "Conclusion": txt_1_8_conclusion
        },
        "oAcademicVerification_ColFlt":
        {
            "IdVerifAcademicasCol": 0,
            "IdIntegridad": idIntegridad,
            "ItemIntegridadDet": itemIntegridad,
            "NombreInstitucion": txt_1_9_nombre_institucion,
            "GradoObtenido": txt_1_9_titulo_grado,
            "FecFinalizacion": txt_1_9_fecha_finalizacion,
            "EstudioTerminadoOProceso": txt_1_9_estudio_terminado_proceso,
            "Diploma": sl_1_9_acta_folio_diploma,
            "NombrePersonBrindaInfo": txt_1_9_persona_brinda_infomacion,
            "Cargo": txt_1_9_cargo,
            "Telefono": txt_1_9_telefono,
            "Correo": txt_1_9_correo,
            "Conclusion": txt_1_9_conclusion
        },
        "oAnexosFlt":
        {
            "IdAnexo": 0,
            "IdIntegridad": idIntegridad,
            "ItemIntegridadDet": itemIntegridad,
            "ListAnexosDetFlt": listAnexos
        },
        // --
        "oDarkFactorFlt": {
            "IdFactorOscuro": 0,
            "IdIntegridad": idIntegridad,
            "ItemIntegridadDet": itemIntegridad,
            "ArchivoAdjunto": {
                "IdArchivoAdjunto": 0,
                "NombreArchivo": "FactorOscuro." + ext2_1_factor_oscuro,
                "RutaArchivo": null,
                "ExtensionArchivo": ext2_1_factor_oscuro,
                "FecRegistro": null,
                "IdUsuarioRegistro": 0
            }
        },
        // -- New
        "oPersonalDataEvaluatedFlt": {
            "IdDatoPersonalEvaluado": 0,
            "IdIntegridad": idIntegridad,
            "ItemIntegridadDet": itemIntegridad,
            "NombresApellidos": txt_1_nombres_apellidos,
            "NroDocumento": txt_1_nro_documento,
            "FechaInscripcion": null,
            "FechaExpedicion": txt_1_fecha_expedicion,
            "Caducidad": "",
            "Direccion": txt_1_direccion,
            "LugarNacimiento": txt_1_lugar_nacimiento,
            "FechaNacimiento": txt_1_fecha_nacimiento,
            "Nacionalidad": txt_1_nacionalidad,
            "Edad": validateNumber(txt_1_edad),
            "IdEstadoCivil": txt_1_estado_civil,
            "GradoInstruccion": txt_1_nivel_educativo,
            "Estatura": "",
            "NombreMadre": "",
            "NombrePadre": ""
        },
        "oEndResultFlt": {
            "IdResultadoFinal": 0,
            "IdIntegridad": idIntegridad,
            "ItemIntegridadDet": itemIntegridad,
            "Riesgo": radioNivel,
            "Calificacion": radioCalificacion,
            "EscalaSinceridad": validateNumber(txt_escala_sinceridad),
            "NivelRiesgo": validateNumber(txt_nivel_riesgo)
        },
        "oPremiumPersonalHistoryFlt": {
            "IdAntecPersonalPremium": 0,
            "IdIntegridad": idIntegridad,
            "ItemIntegridadDet": itemIntegridad,
            "Observaciones": txt_2_observaciones,
            "Analisis": txt_2_analisis,
            "Registra": radio_2_analisis
        },
        "oFinancialRecordsAnalysis_ColFlt": {
            "IdAnalisisAntecFinanciero": 0,
            "IdIntegridad": idIntegridad,
            "ItemIntegridadDet": itemIntegridad,
            "NivelRiesgoFinanciero": sl_3_nivel_riesgo_financiero,
            "Observaciones": txt_3_observaciones,
            "Analisis": txt_3_analisis
        },
        "oAnalysisReliabilityTestFlt": {
            "IdTestConfiabilidad": 0,
            "IdIntegridad": idIntegridad,
            "ItemIntegridadDet": itemIntegridad,
            "Analisis": txt_4_analisis
        }
    }


    if (ListNationalRestrictiveLists != null) {
        if (ListNationalRestrictiveLists.ArchivoAntecFiscal != null) {
            objectData.oNationalRestrictiveListsFlt.ArchivoAntecFiscal = ListNationalRestrictiveLists.ArchivoAntecFiscal
        }
        if (ListNationalRestrictiveLists.ArchivoAntecDisciplinario != null) {
            objectData.oNationalRestrictiveListsFlt.ArchivoAntecDisciplinario = ListNationalRestrictiveLists.ArchivoAntecDisciplinario
        }
        if (ListNationalRestrictiveLists.ArchivoSIMIT != null) {
            objectData.oNationalRestrictiveListsFlt.ArchivoSIMIT = ListNationalRestrictiveLists.ArchivoSIMIT
        }
        if (ListNationalRestrictiveLists.ArchivoRUNT != null) {
            objectData.oNationalRestrictiveListsFlt.ArchivoRUNT = ListNationalRestrictiveLists.ArchivoRUNT
        }
        if (ListNationalRestrictiveLists.ArchivoConsulAfiliadosBDUA != null) {
            objectData.oNationalRestrictiveListsFlt.ArchivoConsulAfiliadosBDUA = ListNationalRestrictiveLists.ArchivoConsulAfiliadosBDUA
        }
        if (ListNationalRestrictiveLists.ArchivoPersoExpuestaPoliticamente != null) {
            objectData.oNationalRestrictiveListsFlt.ArchivoPersoExpuestaPoliticamente = ListNationalRestrictiveLists.ArchivoPersoExpuestaPoliticamente
        }
        if (ListNationalRestrictiveLists.ArchivoPoliciaNacional != null) {
            objectData.oNationalRestrictiveListsFlt.ArchivoPoliciaNacional = ListNationalRestrictiveLists.ArchivoPoliciaNacional
        }
    }

    //if (ListDefinitionMilitarySituation != null) {
    //    if (ListDefinitionMilitarySituation.ArchivoAdjunto != null) {
    //        objectData.oDefinitionMilitarySituationFlt.ArchivoDefSituacionMilitar = ListDefinitionMilitarySituation.ArchivoAdjunto
    //    }
    //}

    if (ListDefinitionMilitarySituation != null) {
        if (ListDefinitionMilitarySituation.ArchivoDefSituacionMilitar != null) {
            objectData.oDefinitionMilitarySituationFlt.ArchivoDefSituacionMilitar = ListDefinitionMilitarySituation.ArchivoDefSituacionMilitar
        }
    }

    if (ListFinancialBehavior != null) {
        if (ListFinancialBehavior.ArchivoCompFinanciero != null) {
            objectData.oFinancialBehaviorFlt.ArchivoCompFinanciero = ListFinancialBehavior.ArchivoCompFinanciero
        }
    }

    if (ListDarkFactor != null) {
        if (ListDarkFactor.ArchivoAdjunto != null) {
            objectData.oDarkFactorFlt.ArchivoAdjunto = ListDarkFactor.ArchivoAdjunto
        }
    }

    // --
    if (listFilesAnexos != undefined && listFilesAnexos.length > 0) {
        // --
        listFilesAnexos.forEach((element) => {
            // --
            if (element !== undefined) {
                // --
                var ext = getFileExtension(element.name)
                // --
                if (ext == "pdf" || ext == "PDF") {
                    // --
                    formData.append("dataFile", element, "Anexo_" + element.id + "." + ext);
                }
            }

        })
    }

    // --
    if (ListPhotografym != null) {
        if (ListPhotografym.ArchivoAdjunto_EntradaDomicilio != null) {
            objectData.oPhotographicRecordFlt.ArchivoAdjunto_EntradaDomicilio = ListPhotografym.ArchivoAdjunto_EntradaDomicilio
        }
        if (ListPhotografym.ArchivoAdjunto_AmbSocial != null) {
            objectData.oPhotographicRecordFlt.ArchivoAdjunto_AmbSocial = ListPhotografym.ArchivoAdjunto_AmbSocial
        }
        if (ListPhotografym.ArchivoAdjunto_Habitaciones != null) {
            objectData.oPhotographicRecordFlt.ArchivoAdjunto_Habitaciones = ListPhotografym.ArchivoAdjunto_Habitaciones
        }
        if (ListPhotografym.ArchivoAdjunto_Cocina != null) {
            objectData.oPhotographicRecordFlt.ArchivoAdjunto_Cocina = ListPhotografym.ArchivoAdjunto_Cocina
        }
    }

    console.log(objectData)

    // -- I. INFORME ANTECEDENTES JUDICIALES
    var camposVacios = ""
    // --
    if (txt_1_1_nombre == "") {                            // -- 1.1 DATOS BASICOS DEL CANDIDATO
        camposVacios += "<span>1.1 DATOS BASICOS DEL CANDIDATO</span>"
    }
    if (listProcesosJudiciales.length < 1) {                // -- 1.2 PROCESOS JUDICIALES
        camposVacios += "<br><span>1.2 PROCESOS JUDICIALES</span> "
    }
    if (listProcesoLavadoActivos.length < 1) {                   // -- 1.3 PROCESOS LAVADO DE ACTIVOS
        camposVacios += "<br><span>1.3 PROCESOS LAVADO DE ACTIVOS</span>"
    }
    if (txt_1_8_nombre_empresa == "" ||
        txt_1_8_cargo_desempenado == "" ||
        txt_1_8_fecha_inicio == "" ||
        txt_1_8_fecha_termino == "" ||
        txt_1_8_motivo_retiro == "" ||
        txt_1_8_tiempo_experiencia == "" ||
        txt_1_8_persona_brinda_infomacion == "" ||
        txt_1_8_cargo == "" ||
        txt_1_8_telefonos_correo == "" ||
        txt_1_8_experiencia_cargo_postula == "" ||
        txt_1_8_experiencia_especifica == "" ||
        txt_1_8_observaciones == "" ||
        txt_1_8_conclusion == "" ||
        sl_1_8_desempeno == "" ||
        sl_1_8_volveria_contratar == "") {                // -- 1.8 VERIFICACIONES LABORALES
        camposVacios += "<br><span>1.8 VERIFICACIONES LABORALES</span>"
    }
    if (txt_1_9_nombre_institucion == "" ||
        txt_1_9_titulo_grado == "" ||
        txt_1_9_fecha_finalizacion == "" ||
        txt_1_9_estudio_terminado_proceso == "" ||
        sl_1_9_acta_folio_diploma == "" ||
        txt_1_9_persona_brinda_infomacion == "" ||
        txt_1_9_cargo == "" ||
        txt_1_9_telefono == "" ||
        txt_1_9_correo == "" ||
        txt_1_9_conclusion == "") {            // --  1.9 VERIFICACIONES ACADÉMICAS
        camposVacios += "<br><span>1.9 VERIFICACIONES ACADÉMICAS</span>"
    }

    // --
    formData.append(
        "JsonMaster",
        JSON.stringify(objectData)
    );
    // --
    console.log(ListNationalRestrictiveLists)
    console.log(objectData)

    if (camposVacios != "") {

        // --
        Swal.queue([{
            icon: 'warning',
            title: 'Formularios incompletos...',
            html: camposVacios,
            confirmButtonText: 'Guardar',
            cancelButtonText: 'Cancelar',
            cancelButtonColor: '#d33',
            showCancelButton: true,
            showLoaderOnConfirm: true,
            preConfirm: () => {
                // --
                return $.ajax({
                    type: "POST",
                    url: urlSaveorUpdateIntegrity360Colombia,
                    data: formData,
                    dataType: 'json',
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (data) {
                        console.log('DATA', data)
                        var typeAlert = (data.response.status == "OK") ? 'success' : 'error';
                        var Message = (data.response.status == "OK") ? 'Se guardo la información correctamente' : 'Ocurrio un problema, Comuniquese con sistemas';
                        // --
                        Swal.queue([{
                            title: 'Guardar información',
                            confirmButtonText: 'OK',
                            text: Message,
                            icon: typeAlert,
                            showLoaderOnConfirm: true,
                            preConfirm: () => {
                                return fetch()
                                    .then(window.location.reload())
                                    .catch(() => {
                                    })
                            }
                        }]);
                    }
                });
            }
        }])
    } else {
        Swal.queue([{
            icon: 'info',
            title: '¿Desea guardar el registro?',
            html: camposVacios,
            confirmButtonText: 'Guardar',
            cancelButtonText: 'Cancelar',
            cancelButtonColor: '#d33',
            showCancelButton: true,
            showLoaderOnConfirm: true,
            preConfirm: () => {

                return $.ajax({
                    type: "POST",
                    url: urlSaveorUpdateIntegrity360Colombia,
                    data: formData,
                    dataType: 'json',
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (data) {
                        console.log('DATA', data)
                        var typeAlert = (data.response.status == "OK") ? 'success' : 'error';
                        var Message = (data.response.status == "OK") ? 'Se guardo la información correctamente' : 'Ocurrio un problema, Comuniquese con sistemas';
                        // --
                        Swal.queue([{
                            title: 'Guardar información',
                            confirmButtonText: 'OK',
                            text: Message,
                            icon: typeAlert,
                            showLoaderOnConfirm: true,
                            preConfirm: () => {
                                return fetch()
                                    .then(window.location.reload())
                                    .catch(() => {
                                    })
                            }
                        }]);
                    }
                });
            }
        }])
    }

})

function getListStatusCivil() {
    console.log(UrlGetStatusCivil);
    // --
    $.ajax({
        url: UrlGetStatusCivil,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            // --
            let html = ''
            html += '<option value=0>[Seleccionar]</option>'
            // --
            let obj = data.Data
            // --
            if (obj.length > 0) { // -- Verificar si tiene datos
                // --
                $.each(obj, function (key, value) {
                    // --
                    html += '<option value="' + value.IdEstadoCivil + '"> ' + value.DesEstadoCivil + '</option>'
                });
            }
            // --
            $('.ClassStatusCivil').html(html);
        }
    })
}

function getListDocumentType() {
    // --
    $.ajax({
        url: UrlGetDocumentType,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            // --
            let html = ''
            html += '<option value=0>[Seleccionar]</option>'
            // --
            let obj = data.Data
            // --
            if (obj.length > 0) { // -- Verificar si tiene datos
                // --
                $.each(obj, function (key, value) {
                    // --
                    html += '<option value="' + value.IdTipoDocIdentidad + '"> ' + value.DesTipoDocIdentidad + '</option>'
                });
            }
            // --
            $('.ClassDocumentType').html(html);
        }
    })
}


// --
function getList360Colombia() {
    let idIntegridad = getDatos("key")
    let Item = getDatos("item")
    // --
    let url = urlGetRiskAnalysisFormat360Colombia + "?IdIntegridad=" + idIntegridad + "&ItemIntegridadDet=" + Item
    // --
    $.ajax({
        type: "GET",
        url: url,
        dataType: 'json',
        success: function (data) {
            let obj = data.Data
            console.log(obj);
            if (obj != null) {
                // -- 1.1 DATOS BASICOS DEL CANDIDATO
                if (obj.oBasicDataVm != null) {
                    // --
                    $('#txt_1_1_nombre').val(obj.oBasicDataVm.Nombre)
                    $('#txt_1_1_identificacion').val(obj.oBasicDataVm.Identificacion)
                    $('#txt_1_1_lugar_nacimiento').val(obj.oBasicDataVm.LugarNacimiento)
                    $('#txt_1_1_fecha_nacimiento').val(obj.oBasicDataVm.FechaNacimiento)
                    $('#txt_1_1_nacionalidad').val(obj.oBasicDataVm.Nacionalidad)
                    $('#txt_1_1_edad').val(obj.oBasicDataVm.Edad)
                    $('#txt_1_1_estado_civil').val(obj.oBasicDataVm.IdEstadoCivil)
                }

                // -- 1.2 PROCESOS JUDICIALES
                if (obj.oJudicialProceedingsVm != null) {
                    // --
                    $('#txt_1_2_procesos_contra').val(obj.oJudicialProceedingsVm.NumProcesosContra)
                    $('#txt_1_2_procesos_interpuestos').val(obj.oJudicialProceedingsVm.NumProcesosInterpuestos)

                    let lista = obj.oJudicialProceedingsVm.ListJudicialProceedingsDetailVm
                    listProcesosJudiciales = lista
                    lista.forEach((element) => {
                        let index = tableProcesosJudiciales.rows().count() + 1;
                        tableProcesosJudiciales.row.add([
                            index,
                            element.Ciudad,
                            element.Despacho,
                            element.Proceso,
                            element.Clase,
                            element.Demandantes,
                            element.Demandados,
                            ' <button class= "btn btn-sm btn-danger" data-id="' + index + '" id="btn_1_2_delete_row"> <i class="fa fa-trash"></i></button >'
                        ]).draw(false);
                        tableProcesosJudiciales.columns.adjust()
                            .responsive.recalc();
                    })
                }

                // -- 1.3 PROCESO LAVADO DE ACTIVOS
                if (obj.oMoneyLaunderingVm != null) {
                    // --
                    $('#txt_1_3_evaluacion_nacional_riesgo').val(obj.oMoneyLaunderingVm.EvaluaNacionalRiesgo)

                    let lista = obj.oMoneyLaunderingVm.ListMoneyLaunderingDetailVm
                    listProcesoLavadoActivos = lista
                    lista.forEach((element) => {
                        let index = tableLavadoActivos.rows().count() + 1;
                        tableLavadoActivos.row.add([
                            index,
                            element.Ciudad,
                            element.Despacho,
                            element.Proceso,
                            element.Clase,
                            element.Demandantes,
                            element.Demandados,
                            ' <button class= "btn btn-sm btn-danger" data-id="' + index + '" id="btn_1_3_delete_row"> <i class="fa fa-trash"></i></button >'
                        ]).draw(false);
                        tableLavadoActivos.columns.adjust()
                            .responsive.recalc();
                    })
                }


                // -- 1.5 LISTAS RESTRICTIVAS NACIONALES
                if (obj.oNationalRestrictiveListsVm != null) {
                    ListNationalRestrictiveLists = obj.oNationalRestrictiveListsVm
                    // --
                    $('#txt_antec_fiscal').val(obj.oNationalRestrictiveListsVm.AntecFiscal)
                    if (obj.oNationalRestrictiveListsVm.ArchivoAntecFiscal != null) {
                        //$("#PreviewAntecFiscal button").attr("data-typefile", obj.oSheetReniecVm.ArchivoAntecFiscal.ExtensionArchivo)
                        //$("#PreviewAntecFiscal button").attr("data-route", btoa(obj.oSheetReniecVm.ArchivoAntecFiscal.RutaArchivo))
                        $("#PreviewAntecFiscal span").text(obj.oNationalRestrictiveListsVm.ArchivoAntecFiscal.NombreArchivo)
                    }

                    $('#txt_antec_disciplinario').val(obj.oNationalRestrictiveListsVm.AntecDisciplinario)
                    if (obj.oNationalRestrictiveListsVm.ArchivoAntecDisciplinario != null) {
                        //$("#PreviewAntecDisciplinario button").attr("data-typefile", obj.oNationalRestrictiveListsVm.ArchivoAntecDisciplinario.ExtensionArchivo)
                        //$("#PreviewAntecDisciplinario button").attr("data-route", btoa(obj.oNationalRestrictiveListsVm.ArchivoAntecDisciplinario.RutaArchivo))
                        $("#PreviewAntecDisciplinario span").text(obj.oNationalRestrictiveListsVm.ArchivoAntecDisciplinario.NombreArchivo)
                    }

                    $('#txt_simit').val(obj.oNationalRestrictiveListsVm.AntecDisciplinario)
                    if (obj.oNationalRestrictiveListsVm.ArchivoSIMIT != null) {
                        //$("#PreviewSimit button").attr("data-typefile", obj.oNationalRestrictiveListsVm.ArchivoSIMIT.ExtensionArchivo)
                        //$("#PreviewSimit button").attr("data-route", btoa(obj.oNationalRestrictiveListsVm.ArchivoSIMIT.RutaArchivo))
                        $("#PreviewSimit span").text(obj.oNationalRestrictiveListsVm.ArchivoSIMIT.NombreArchivo)
                    }

                    $('#txt_runt').val(obj.oNationalRestrictiveListsVm.AntecDisciplinario)
                    if (obj.oNationalRestrictiveListsVm.ArchivoRUNT != null) {
                        //$("#PreviewRunt button").attr("data-typefile", obj.oNationalRestrictiveListsVm.ArchivoRUNT.ExtensionArchivo)
                        //$("#PreviewRunt button").attr("data-route", btoa(obj.oNationalRestrictiveListsVm.ArchivoRUNT.RutaArchivo))
                        $("#PreviewRunt span").text(obj.oNationalRestrictiveListsVm.ArchivoRUNT.NombreArchivo)
                    }

                    $('#txt_consul_afiliados_bdua').val(obj.oNationalRestrictiveListsVm.ConsulAfiliadosBDUA)
                    if (obj.oNationalRestrictiveListsVm.ArchivoConsulAfiliadosBDUA != null) {
                        //$("#PreviewConsultAfiliadosBdua button").attr("data-typefile", obj.oNationalRestrictiveListsVm.ArchivoConsulAfiliadosBDUA.ExtensionArchivo)
                        //$("#PreviewConsultAfiliadosBdua button").attr("data-route", btoa(obj.oNationalRestrictiveListsVm.ArchivoConsulAfiliadosBDUA.RutaArchivo))
                        $("#PreviewConsultAfiliadosBdua span").text(obj.oNationalRestrictiveListsVm.ArchivoConsulAfiliadosBDUA.NombreArchivo)
                    }

                    $('#txt_perso_expuesta_politicamente').val(obj.oNationalRestrictiveListsVm.PersoExpuestaPoliticamente)
                    if (obj.oNationalRestrictiveListsVm.ArchivoPersoExpuestaPoliticamente != null) {
                        //$("#PreviewPersoExpuestaPoliticamente button").attr("data-typefile", obj.oNationalRestrictiveListsVm.ArchivoPersoExpuestaPoliticamente.ExtensionArchivo)
                        //$("#PreviewPersoExpuestaPoliticamente button").attr("data-route", btoa(obj.oNationalRestrictiveListsVm.ArchivoPersoExpuestaPoliticamente.RutaArchivo))
                        $("#PreviewPersoExpuestaPoliticamente span").text(obj.oNationalRestrictiveListsVm.ArchivoPersoExpuestaPoliticamente.NombreArchivo)
                    }

                    $('#txt_policia_nacional').val(obj.oNationalRestrictiveListsVm.PoliciaNacional)
                    if (obj.oNationalRestrictiveListsVm.ArchivoPoliciaNacional != null) {
                        //$("#PreviewPoliciaNacional button").attr("data-typefile", obj.oNationalRestrictiveListsVm.ArchivoPoliciaNacional.ExtensionArchivo)
                        //$("#PreviewPoliciaNacional button").attr("data-route", btoa(obj.oNationalRestrictiveListsVm.ArchivoPoliciaNacional.RutaArchivo))
                        $("#PreviewPoliciaNacional span").text(obj.oNationalRestrictiveListsVm.ArchivoPoliciaNacional.NombreArchivo)
                    }
                }


                // -- 1.6 DEFINICION DE LA SITUACION MILITAR
                //if (obj.oDefinitionMilitarySituationVm != null) {
                //    ListDefinitionMilitarySituation = obj.oDefinitionMilitarySituationVm
                //    $('#txt_definicion_situacion_militar').val(obj.oDefinitionMilitarySituationVm.DefSituacionMilitar)
                //    if (obj.oDefinitionMilitarySituationVm.ArchivoAdjunto != null) {
                //        //$("#PreviewDefSitMilitar button").attr("data-typefile", obj.oDefinitionMilitarySituationVm.ArchivoAdjunto.ExtensionArchivo)
                //        //$("#PreviewDefSitMilitar button").attr("data-route", btoa(obj.oDefinitionMilitarySituationVm.ArchivoAdjunto.RutaArchivo))
                //        $("#PreviewDefSitMilitar span").text(obj.oDefinitionMilitarySituationVm.ArchivoAdjunto.NombreArchivo)
                //    }
                //}

                if (obj.oDefinitionMilitarySituationVm != null) {
                    ListDefinitionMilitarySituation = obj.oDefinitionMilitarySituationVm
                    $('#txt_definicion_situacion_militar').val(obj.oDefinitionMilitarySituationVm.DefSituacionMilitar)
                    if (obj.oDefinitionMilitarySituationVm.ArchivoDefSituacionMilitar != null) {
                        //$("#PreviewDefSitMilitar button").attr("data-typefile", obj.oDefinitionMilitarySituationVm.ArchivoAdjunto.ExtensionArchivo)
                        //$("#PreviewDefSitMilitar button").attr("data-route", btoa(obj.oDefinitionMilitarySituationVm.ArchivoAdjunto.RutaArchivo))
                        $("#PreviewDefSitMilitar span").text(obj.oDefinitionMilitarySituationVm.ArchivoDefSituacionMilitar.NombreArchivo)
                    }
                }


                // -- 1.7 COMPORTAMIENTO FINANCIERO
                if (obj.oFinancialBehaviorVm != null) {
                    ListFinancialBehavior = obj.oFinancialBehaviorVm
                    $('#txt_comportamiento_financiero').val(obj.oFinancialBehaviorVm.ComportamientoFinanciero)
                    if (obj.oFinancialBehaviorVm.ArchivoCompFinanciero != null) {
                        //$("#PreviewCompFinanciero button").attr("data-typefile", obj.oFinancialBehaviorVm.ArchivoCompFinanciero.ExtensionArchivo)
                        //$("#PreviewCompFinanciero button").attr("data-route", btoa(obj.oFinancialBehaviorVm.ArchivoCompFinanciero.RutaArchivo))
                        $("#PreviewCompFinanciero span").text(obj.oFinancialBehaviorVm.ArchivoCompFinanciero.NombreArchivo)
                    }
                }


                // -- 1.8 VERIFICACIONES LABORALES
                if (obj.oLaborVerificationVm != null) {
                    // --
                    $('#txt_1_8_nombre_empresa').val(obj.oLaborVerificationVm.NombreEmpresa)
                    $('#txt_1_8_cargo_desempenado').val(obj.oLaborVerificationVm.CargoDesempeñado)
                    $('#txt_1_8_fecha_inicio').val(obj.oLaborVerificationVm.FechaInicio)
                    $('#txt_1_8_fecha_termino').val(obj.oLaborVerificationVm.FechaTerminacion)
                    $('#txt_1_8_motivo_retiro').val(obj.oLaborVerificationVm.MotivoRetiro)
                    $('#txt_1_8_tiempo_experiencia').val(obj.oLaborVerificationVm.TiempoExperiencia)
                    $('#txt_1_8_persona_brinda_infomacion').val(obj.oLaborVerificationVm.NombrePersonBrindaInfo)
                    $('#txt_1_8_cargo').val(obj.oLaborVerificationVm.Cargo)
                    $('#txt_1_8_telefonos_correo').val(obj.oLaborVerificationVm.Telefonos_Correo)
                    $('#txt_1_8_experiencia_cargo_postula').val(obj.oLaborVerificationVm.ExpTotalCargoPostula)
                    $('#txt_1_8_experiencia_especifica').val(obj.oLaborVerificationVm.ExpEspecifica)
                    $('#sl_1_8_desempeno').val(obj.oLaborVerificationVm.DescripcionDesempeño)
                    $('#sl_1_8_volveria_contratar').val(obj.oLaborVerificationVm.PreguntaVolveriaAContratar)
                    $('#txt_1_8_observaciones').val(obj.oLaborVerificationVm.Observaciones)
                    $('#txt_1_8_conclusion').val(obj.oLaborVerificationVm.Conclusion)
                }


                // -- 1.9 VERIFICACIONES ACADÉMICAS
                if (obj.oAcademicVerification_ColVm != null) {
                    // --
                    $('#txt_1_9_nombre_institucion').val(obj.oAcademicVerification_ColVm.NombreInstitucion)
                    $('#txt_1_9_titulo_grado').val(obj.oAcademicVerification_ColVm.GradoObtenido)
                    $('#txt_1_9_fecha_finalizacion').val(formatDate(obj.oAcademicVerification_ColVm.FecFinalizacion))
                    $('#txt_1_9_estudio_terminado_proceso').val(obj.oAcademicVerification_ColVm.EstudioTerminadoOProceso)
                    $('#sl_1_9_acta_folio_diploma').val(obj.oAcademicVerification_ColVm.Diploma)
                    $('#txt_1_9_persona_brinda_infomacion').val(obj.oAcademicVerification_ColVm.NombrePersonBrindaInfo)
                    $('#txt_1_9_cargo').val(obj.oAcademicVerification_ColVm.Cargo)
                    $('#txt_1_9_telefono').val(obj.oAcademicVerification_ColVm.Telefono)
                    $('#txt_1_9_correo').val(obj.oAcademicVerification_ColVm.Correo)
                    $('#txt_1_9_conclusion').val(obj.oAcademicVerification_ColVm.Conclusion)
                }


                // -- 1.11 ANEXOS
                if (obj.oAnexosVm != null) {
                    // --
                    let lista = obj.oAnexosVm.ListAnexosDetailVm
                    console.log('ListViewAnexos', lista)
                    listAnexos = lista
                    lista.forEach((element) => {
                        // --
                        let index = tableAnexos.rows().count() + 1
                        // --
                        tableAnexos.row.add([
                            index,
                            'Anexo_' + index,
                            ' <button class= "btn btn-sm btn-danger" data-id="' + index + '" id="btn_1_11_delete_row"> <i class="fa fa-trash"></i></button >'
                        ]).draw(false);
                        tableAnexos.columns.adjust()
                            .responsive.recalc();
                    })
                }


                // -- 2.0 FACTOR OSCURO
                if (obj.oDarkFactorVm != null) {
                    // --
                    if (obj.oDarkFactorVm.ArchivoAdjunto != null) {
                        // --
                        ListDarkFactor = obj.oDarkFactorVm

                        //$("#PreviewReniec button").attr("data-typefile", obj.oSheetReniecVm.FotoAdjunta.ExtensionArchivo)
                        //$("#PreviewReniec button").attr("data-route", btoa(obj.oSheetReniecVm.FotoAdjunta.RutaArchivo))
                        $("#PreviewFactorOscuro span").text(obj.oDarkFactorVm.ArchivoAdjunto.NombreArchivo)
                    }
                }

                // -- NEW
                // --
                if (obj.oPersonalDataEvaluatedVm != null) {
                    // --
                    $("#txt_1_nombres_apellidos").val(obj.oPersonalDataEvaluatedVm.NombresApellidos)
                    $("#txt_1_nro_documento").val(obj.oPersonalDataEvaluatedVm.NroDocumento)
                    $("#txt_1_fecha_expedicion").val(obj.oPersonalDataEvaluatedVm.FechaExpedicion)
                    $("#txt_1_direccion").val(obj.oPersonalDataEvaluatedVm.Direccion)
                    $("#txt_1_lugar_nacimiento").val(obj.oPersonalDataEvaluatedVm.LugarNacimiento)
                    $("#txt_1_fecha_nacimiento").val(obj.oPersonalDataEvaluatedVm.FechaNacimiento)
                    $("#txt_1_nacionalidad").val(obj.oPersonalDataEvaluatedVm.Nacionalidad)
                    $("#txt_1_edad").val(obj.oPersonalDataEvaluatedVm.Edad)
                    $("#txt_1_estado_civil").val(obj.oPersonalDataEvaluatedVm.IdEstadoCivil)
                    $("#txt_1_nivel_educativo").val(obj.oPersonalDataEvaluatedVm.GradoInstruccion)
                }

                // --
                if (obj.oEndResultVm != null) {
                    // --
                    $("#txt_escala_sinceridad").val(obj.oEndResultVm.EscalaSinceridad)
                    $("#txt_nivel_riesgo").val(obj.oEndResultVm.NivelRiesgo)
                    // --
                    let radio_nivel = obj.oEndResultVm.Riesgo
                    $("input:radio[name='radioNivel'][value=" + radio_nivel + "]").prop('checked', true)
                    // --
                    let radio_calificacion = obj.oEndResultVm.Calificacion
                    $("input:radio[name='radioCalificacion'][value=" + radio_calificacion + "]").prop('checked', true)
                    // --
                    calculateGraphic()
                }


                // --
                if (obj.oPremiumPersonalHistoryVm != null) {
                    // --
                    let radio_2_analisis = obj.oPremiumPersonalHistoryVm.Registra
                    $("input:radio[name='radio_2_analisis'][value=" + radio_2_analisis + "]").prop('checked', true)
                    $("#txt_2_observaciones").val(obj.oPremiumPersonalHistoryVm.Observaciones)
                    $("#txt_2_analisis").val(obj.oPremiumPersonalHistoryVm.Analisis)
                }

                // --
                if (obj.oFinancialRecordsAnalysis_ColVm != null) {
                    // --
                    $("#sl_3_nivel_riesgo_financiero").val(obj.oFinancialRecordsAnalysis_ColVm.NivelRiesgoFinanciero)
                    $("#txt_3_observaciones").val(obj.oFinancialRecordsAnalysis_ColVm.Observaciones)
                    $("#txt_3_analisis").val(obj.oFinancialRecordsAnalysis_ColVm.Analisis)
                }

                // --
                if (obj.oAnalysisReliabilityTestVm != null) {
                    // --
                    $("#txt_4_analisis").val(obj.oAnalysisReliabilityTestVm.Analisis)
                }


            }

        }
    });
    // --- }

}

// -- ADD DYNAMIC
function addInputFile() {
    // --
    let html = ""
    html += '<div class="col-lg-6">'
    html += '   <div class="form-group" >'
    html += '        <label><b>SELECCIONAR ARCHIVO:</b> <span class="tx-danger">*</span></label>'
    html += '        <input type="file" id="file_1_11" class="form-control" placeholder="-" required="">'
    html += '    </div>'
    html += '</div >'
    // --
    $("#anexosInputFile").append(html);
}

function showVisitaDomiciliaria() {
    // --
    let idRol = readCookie("IdRol")
    // --
    if (idRol == "7" || idRol == 7) {
        //$("#formato_visita_domiciliaria").show()
        $("#formato").hide()
        $("#nuevo_formato").hide()
        $("#btn_3_10_Generar").hide()
        $("#btn_3_10_agregar").hide()

    } else {
        // --
        //$("#formato_visita_domiciliaria").show()
        $("#formato").show()
        $("#nuevo_formato").show()
        $("#btn_3_10_Generar").show()
        $("#btn_3_10_agregar").show()
    }
}

// -- DATEPICKER
setInputDatePicker("txt_1_1_fecha_nacimiento")
setInputDatePicker("txt_1_8_fecha_inicio")
setInputDatePicker("txt_1_8_fecha_termino")
setInputDatePicker("txt_1_9_fecha_finalizacion")
setInputDatePicker("txt_1_fecha_expedicion")
setInputDatePicker("txt_1_fecha_nacimiento")

// --

getList360Colombia();
showVisitaDomiciliaria();