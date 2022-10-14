// -- GLOBAL
const functions = new Functions()
const byte = 1048576 // -- 1 MB	-> 1048576 B
const maxSize = 20 // -- 20 Megabytes
// --
var listRestrictivasNacionales = null
var listDefinicionSituacionMilitar = null
var listComportamientoFinanciero = null
var listAnexos = null
var listPhotografym = null
var ListTestConfiablidad = null

getListStatusCivil();
getListDocumentType();

// --
function getFileExtension(filename) {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
}

// --
function validateFileSize(file) {
    // --
    if ((file.size / byte) <= maxSize) {
        return true
    } else {
        return false
    }
}


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


// --
$(".previewClass").click(async function () {
    let route = $(this).attr('data-route');
    if (route != undefined && route != null && route != "") {
        $("#imgPreview").attr('src', 'https://i.gifer.com/YCZH.gif');
        $("#modalIMG").modal("show");
        $("#modalIMG").addClass("in");
        let typeFile = $(this).attr('data-typefile');
        var RouteDecode = route;
        await getImgBase64(RouteDecode, typeFile);
    } else {
        console.log("no se encontro");
        Swal.fire(
            'Previsualizar imagen',
            "No se encontro ningun archivo",
            "warning"
        )
    }
});

function GenerateDocument() {
    // --
    let idIntegridad = getDatos("key");
    var itemIntegridad = getDatos("item");
    let url = urlGenerateDocument + "?IdIntegridad=" + idIntegridad + "&ItemIntegridadDet=" + itemIntegridad + "&idDocumentFile=4";
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
async function getImgBase64(route, typeFile) {
    let datos = {
        "route": route
    };
    $.ajax({
        url: urlDownloadBase64,
        type: 'POST',
        dataType: 'json',
        data: datos,
        success: function (d) {
            // -- console.log(d);
            $("#imgPreview").attr('src',
                'data:image/' + typeFile + ';base64,' + d);
        }
    });
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
        indexListProcesosJudiciales = tableProcesosJudiciales.rows().count() + 1

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
        indexListProcesoLavadoActivos = tableLavadoActivos.rows().count() + 1

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




//// -- DEFINICION DE LA SITUACION MILITAR
//var formData1_6_imagen = new FormData();
//// -- IMG
//var file_1_6 = $('#file_1_6').prop("files")[0];
//if (file_1_6 !== undefined) {
//    // --
//    console.log(file_1_6.size)
//    if (file_1_6.size <= fileSize) {
//        // --
//        let ext_1_6 = getFileExtension(file_1_6.name)
//        // --
//        if (ext_1_6 == "pdf" || ext_1_6 == "PDF") {
//            // --
//            formData1_6_imagen.append("imagen", file_1_6);
//        }
//    }
//}




//// -- COMPORTAMIENTO FINANCIERO
//var formData1_7_imagen = new FormData();
//// -- IMG
//var file_1_7 = $('#file_1_7').prop("files")[0];
//if (file_1_7 !== undefined) {
//    // --
//    let ext_1_7 = getFileExtension(file_1_7.name)
//    // --
//    if (ext_1_7 == "img" || ext_1_7 == "png" || ext_1_7 == "jpg" || ext_1_7 == "jpeg") {
//        // --
//        formData1_7_imagen.append("imagen", file_1_7);
//    }
//}

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
    listProcesosJudiciales

    // -- 1.4 TEXTO

    // -- 1.3 PROCESOS LA/FT
    var txt_1_3_evaluacion_nacional_riesgo = $('#txt_1_3_evaluacion_nacional_riesgo').val()
    listProcesoLavadoActivos


    // -- 1.5 LISTAS RESTRICTIVAS NACIONALES
    var txt_antec_fiscal = $('#txt_antec_fiscal').val()
    var txt_antec_disciplinario = $('#txt_antec_disciplinario').val()
    var txt_simit = $('#txt_simit').val()
    var txt_runt = $('#txt_runt').val()
    var txt_consul_afiliados_bdua = $('#txt_consul_afiliados_bdua').val()
    var txt_perso_expuesta_politicamente = $('#txt_perso_expuesta_politicamente').val()
    var txt_policia_nacional = $('#txt_policia_nacional').val()

    var file_1_5_antec_fiscal = $('#file_1_5_antec_fiscal').prop("files")[0];
    var file_1_5_antec_disciplinario = $('#file_1_5_antec_disciplinario').prop("files")[0];
    var file_1_5_simit = $('#file_1_5_simit').prop("files")[0];
    var file_1_5_runt = $('#file_1_5_runt').prop("files")[0];
    var file_1_5_consul_afiliados_bdua = $('#file_1_5_consul_afiliados_bdua').prop("files")[0];
    var file_1_5_perso_expuesta_politicamente = $('#file_1_5_perso_expuesta_politicamente').prop("files")[0];
    var file_1_5_policia_nacional = $('#file_1_5_policia_nacional').prop("files")[0];
    // --
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
        if (validateFileSize(file_1_5_antec_fiscal)) {
            // --
            ext1_5_antec_fiscal = getFileExtension(file_1_5_antec_fiscal.name)
            // --
            if (ext1_5_antec_fiscal.toLowerCase() == "pdf") {
                // --
                formData.append("dataFile", file_1_5_antec_fiscal, "AntecFiscal." + ext1_5_antec_fiscal);
            }
        }
        
    }
    // --
    if (file_1_5_antec_disciplinario !== undefined) {
        // --
        if (validateFileSize(file_1_5_antec_disciplinario)) {
            // --
            ext1_5_antec_disciplinario = getFileExtension(file_1_5_antec_disciplinario.name)
            // --
            if (ext1_5_antec_disciplinario.toLowerCase() == "pdf") {
                // --
                formData.append("dataFile", file_1_5_antec_disciplinario, "AntecDisciplinario." + ext1_5_antec_disciplinario);
            }
        }
    }
    // --
    if (file_1_5_simit !== undefined) {
        // --
        if (validateFileSize(file_1_5_simit)) {
            // --
            ext1_5_simit = getFileExtension(file_1_5_simit.name)
            // --
            if (ext1_5_simit.toLowerCase() == "pdf") {
                // --
                formData.append("dataFile", file_1_5_simit, "Simit." + ext1_5_simit);
            }
        }
    }
    // --
    if (file_1_5_runt !== undefined) {
        // --
        if (validateFileSize(file_1_5_runt)) {
            // --
            ext1_5_runt = getFileExtension(file_1_5_runt.name)
            // --
            if (ext1_5_runt.toLowerCase() == "pdf") {
                // --
                formData.append("dataFile", file_1_5_runt, "Runt." + ext1_5_runt);
            }
        }
    }
    // --
    if (file_1_5_consul_afiliados_bdua !== undefined) {
        // --
        if (validateFileSize(file_1_5_consul_afiliados_bdua)) {
            // --
            ext1_5_consul_afiliados_bdua = getFileExtension(file_1_5_consul_afiliados_bdua.name)
            // --
            if (ext1_5_consul_afiliados_bdua.toLowerCase() == "pdf") {
                // --
                formData.append("dataFile", file_1_5_consul_afiliados_bdua, "BDUA." + ext1_5_consul_afiliados_bdua);
            }
        }
    }
    // --
    if (file_1_5_perso_expuesta_politicamente !== undefined) {
        // --
        if (validateFileSize(file_1_5_perso_expuesta_politicamente)) {
            // --
            ext1_5_perso_expuesta_politicamente = getFileExtension(file_1_5_perso_expuesta_politicamente.name)
            // --
            if (ext1_5_perso_expuesta_politicamente.toLowerCase() == "pdf") {
                // --
                formData.append("dataFile", file_1_5_perso_expuesta_politicamente, "PersExpPolit." + ext1_5_perso_expuesta_politicamente);
            }
        }
    }
    // --
    if (file_1_5_policia_nacional !== undefined) {
        // --
        if (validateFileSize(file_1_5_policia_nacional)) {
            // --
            ext1_5_policia_nacional = getFileExtension(file_1_5_policia_nacional.name)
            // --
            if (ext1_5_policia_nacional.toLowerCase() == "pdf") {
                // --
                formData.append("dataFile", file_1_5_policia_nacional, "PoliciaNacional." + ext1_5_policia_nacional);
            }
        }
    }

    // -- 1.6 DEFINICION DE LA SITUACION MILITAR
    var txt_definicion_situacion_militar = $('#txt_definicion_situacion_militar').val()
    var file_1_6 = $('#file_1_6').prop("files")[0];
    var ext1_6 = ""
    // --
    if (file_1_6 !== undefined) {
        // --
        if (validateFileSize(file_1_6)) {
            // --
            ext1_6 = getFileExtension(file_1_6.name)
            // --
            if (ext1_6.toLowerCase() == "pdf") {
                // --
                formData.append("dataFile", file_1_6, "DefSitMilitar." + ext1_6);
            }
        }
    }

    // -- 1.7 COMPORTAMIENTO FINANCIERO
    var txt_comportamiento_financiero = $('#txt_comportamiento_financiero').val()
    var file_1_7 = $('#file_1_7').prop("files")[0];
    var ext1_7 = ""
    // --
    if (file_1_7 !== undefined) {
        // --
        if (validateFileSize(file_1_7)) {
            // --
            ext1_7 = getFileExtension(file_1_7.name)
            // --
            if (ext1_7.toLowerCase() == "pdf") {
                // --
                formData.append("dataFile", file_1_7, "CompFinanciero." + ext1_7);
            }
        }
    }

    // -- II. TEST CONFIABILIDAD
    var file_2_0_test_confiabilidad = $('#file_2_0_test_confiabilidad').prop("files")[0];
    var ext2_0_test_confiabilidad = ""
    // --
    if (file_2_0_test_confiabilidad !== undefined) {
        // -
        if (validateFileSize(file_2_0_test_confiabilidad)) {
            // --
            ext2_0_test_confiabilidad = getFileExtension(file_2_0_test_confiabilidad.name)
            // --
            if (ext2_0_test_confiabilidad.toLowerCase() == "pdf") {
                // --
                formData.append("dataFile", file_2_0_test_confiabilidad, "TestConfiabilidad." + ext2_0_test_confiabilidad);
            }
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
            "Edad": validateNumber(txt_1_1_edad),
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
                "NombreArchivo": "AntecFiscal." + ext1_5_antec_fiscal,
                "RutaArchivo": null,
                "ExtensionArchivo": ext1_5_antec_fiscal,
                "FecRegistro": null,
                "IdUsuarioRegistro": 0
            },
            "AntecFiscal": txt_antec_fiscal,
            "ArchivoAntecDisciplinario":
            {
                "IdArchivoAdjunto": 0,
                "NombreArchivo": "AntecDisciplinario." + ext1_5_antec_disciplinario,
                "RutaArchivo": null,
                "ExtensionArchivo": ext1_5_antec_disciplinario,
                "FecRegistro": null,
                "IdUsuarioRegistro": 0
            },
            "AntecDisciplinario": txt_antec_disciplinario,
            "ArchivoSIMIT":
            {
                "IdArchivoAdjunto": 0,
                "NombreArchivo": "Simit." + ext1_5_simit,
                "RutaArchivo": null,
                "ExtensionArchivo": ext1_5_simit,
                "FecRegistro": null,
                "IdUsuarioRegistro": 0
            },
            "SIMIT": txt_simit,
            "ArchivoRUNT":
            {
                "IdArchivoAdjunto": 0,
                "NombreArchivo": "RUNT." + ext1_5_runt,
                "RutaArchivo": null,
                "ExtensionArchivo": ext1_5_runt,
                "FecRegistro": null,
                "IdUsuarioRegistro": 0
            },
            "RUNT": txt_runt,
            "ArchivoConsulAfiliadosBDUA":
            {
                "IdArchivoAdjunto": 0,
                "NombreArchivo": "BDUA." + ext1_5_consul_afiliados_bdua,
                "RutaArchivo": null,
                "ExtensionArchivo": ext1_5_consul_afiliados_bdua,
                "FecRegistro": null,
                "IdUsuarioRegistro": 0
            },
            "ConsulAfiliadosBDUA": txt_consul_afiliados_bdua,
            "ArchivoPersoExpuestaPoliticamente":
            {
                "IdArchivoAdjunto": 0,
                "NombreArchivo": "PersExpPolit." + ext1_5_perso_expuesta_politicamente,
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
                "NombreArchivo": "DefSitMilitar." + ext1_6,
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
                "NombreArchivo": "CompFinanciero." + ext1_7,
                "RutaArchivo": null,
                "ExtensionArchivo": ext1_7,
                "FecRegistro": null,
                "IdUsuarioRegistro": 0
            },
            "ComportamientoFinanciero": txt_comportamiento_financiero
        },
        "oReliabilityTestFlt": {
            "IdTestConfiabilidad": 0,
            "IdIntegridad": idIntegridad,
            "ItemIntegridadDet": itemIntegridad,
            "ArchivoAdjunto": {
                "IdArchivoAdjunto": 0,
                "NombreArchivo": "TestConfiabilidad." + ext2_0_test_confiabilidad,
                "RutaArchivo": null,
                "ExtensionArchivo": ext2_0_test_confiabilidad,
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
        "oAnalysisReliabilityTestFlt": {
            "IdTestConfiabilidad": 0,
            "IdIntegridad": idIntegridad,
            "ItemIntegridadDet": itemIntegridad,
            "Analisis": txt_4_analisis
        }
    }


    // -- 1.5 LISTAS RESTRICTIVAS NACIONALES
    if (listRestrictivasNacionales != null) {
        if (listRestrictivasNacionales.ArchivoAntecDisciplinario != null) {
            objectData.oNationalRestrictiveListsFlt.ArchivoAntecDisciplinario = listRestrictivasNacionales.ArchivoAntecDisciplinario
        }
        if (listRestrictivasNacionales.ArchivoAntecFiscal != null) {
            objectData.oNationalRestrictiveListsFlt.ArchivoAntecFiscal = listRestrictivasNacionales.ArchivoAntecFiscal
        }
        if (listRestrictivasNacionales.ArchivoConsulAfiliadosBDUA != null) {
            objectData.oNationalRestrictiveListsFlt.ArchivoConsulAfiliadosBDUA = listRestrictivasNacionales.ArchivoConsulAfiliadosBDUA
        }
        if (listRestrictivasNacionales.ArchivoPersoExpuestaPoliticamente != null) {
            objectData.oNationalRestrictiveListsFlt.ArchivoPersoExpuestaPoliticamente = listRestrictivasNacionales.ArchivoPersoExpuestaPoliticamente
        }
        if (listRestrictivasNacionales.ArchivoPoliciaNacional != null) {
            objectData.oNationalRestrictiveListsFlt.ArchivoPoliciaNacional = listRestrictivasNacionales.ArchivoPoliciaNacional
        }
        if (listRestrictivasNacionales.ArchivoRUNT != null) {
            objectData.oNationalRestrictiveListsFlt.ArchivoRUNT = listRestrictivasNacionales.ArchivoRUNT
        }
        if (listRestrictivasNacionales.ArchivoSIMIT != null) {
            objectData.oNationalRestrictiveListsFlt.ArchivoSIMIT = listRestrictivasNacionales.ArchivoSIMIT
        }
    }


    // -- 1.6 DEFINICION DE LA SITUACION MILITAR
    if (listDefinicionSituacionMilitar != null) {
        if (listDefinicionSituacionMilitar.ArchivoDefSituacionMilitar != null) {
            objectData.oDefinitionMilitarySituationFlt.ArchivoDefSituacionMilitar = listDefinicionSituacionMilitar.ArchivoDefSituacionMilitar
        }
    }


    // -- 1.7 COMPORTAMIENTO FINANCIERO
    if (listComportamientoFinanciero != null) {
        if (listComportamientoFinanciero.ArchivoCompFinanciero != null) {
            objectData.oFinancialBehaviorFlt.ArchivoCompFinanciero = listComportamientoFinanciero.ArchivoCompFinanciero
        }
    }

    if (ListTestConfiablidad != null) {
        if (ListTestConfiablidad.ArchivoAdjunto != null) {
            objectData.oReliabilityTestFlt.ArchivoAdjunto = ListTestConfiablidad.ArchivoAdjunto
        }
    }

    // -- I. INFORME ANTECEDENTES JUDICIALES
    var camposVacios = ""
    // --
    if (txt_1_1_nombre == "") {                            // -- 1.1 DATOS BASICOS DEL CANDIDATO
        camposVacios += "<span>1.1 DATOS BASICOS DEL CANDIDATO</span>"
    }
    if (listProcesosJudiciales.length < 1) {                // -- 1.2 PROCESOS JUDICIALES
        camposVacios += "<br><span>1.2 PROCESOS JUDICIALES</span> "
    }
    if (listProcesoLavadoActivos.length < 1) {                   // -- 1.3 LAVADO DE ACTIVOS
        camposVacios += "<br><span>1.3 LAVADO DE ACTIVOS</span>"
    }

    // --
    formData.append(
        "JsonMaster",
        JSON.stringify(objectData)
    );

    console.log(objectData)
    // --    
    // --
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
                    url: urlSaveorUpdateIntegrity180Colombia,
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
        // --
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
                // --
                return $.ajax({
                    type: "POST",
                    url: urlSaveorUpdateIntegrity180Colombia,
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

// --
function reformatDateString(s) {
    var b = s.split(/\D/);
    return b.reverse().join('-');
}


// --
function getList180Colombia() {
    // --
    // -- $("#txt_1_1_fecha_nacimiento").datepicker({ dateFormat: 'DD/MM/YYYY' });
    // - let status = getDatos("status")
    // --
    // -- if (status == "true" || status == true) {
    // --
    let idIntegridad = getDatos("key")
    let Item = getDatos("item")
    // --
    let url = urlGetRiskAnalysisFormat180Colombia + "?IdIntegridad=" + idIntegridad + "&ItemIntegridadDet=" + Item
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

                // -- 1.5 
                if (obj.oNationalRestrictiveListsVm != null) {
                    listRestrictivasNacionales = obj.oNationalRestrictiveListsVm
                    // --
                    $('#txt_antec_fiscal').val(obj.oNationalRestrictiveListsVm.AntecFiscal)
                    if (obj.oNationalRestrictiveListsVm.ArchivoAntecFiscal != null) {
                        //$("#PreviewAntecFiscal button").attr("data-typefile", obj.oNationalRestrictiveListsVm.ArchivoAntecFiscal.ExtensionArchivo)
                        //$("#PreviewAntecFiscal button").attr("data-route", btoa(obj.oNationalRestrictiveListsVm.ArchivoAntecFiscal.RutaArchivo))
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
                if (obj.oDefinitionMilitarySituationVm != null) {
                    listDefinicionSituacionMilitar = obj.oDefinitionMilitarySituationVm
                    $('#txt_definicion_situacion_militar').val(obj.oDefinitionMilitarySituationVm.DefSituacionMilitar)
                    if (obj.oDefinitionMilitarySituationVm.ArchivoDefSituacionMilitar != null) {
                        //$("#PreviewDefSitMilitar button").attr("data-typefile", obj.oDefinitionMilitarySituationVm.ArchivoDefSituacionMilitar.ExtensionArchivo)
                        //$("#PreviewDefSitMilitar button").attr("data-route", btoa(obj.oDefinitionMilitarySituationVm.ArchivoDefSituacionMilitar.RutaArchivo))
                        $("#PreviewDefSitMilitar span").text(obj.oDefinitionMilitarySituationVm.ArchivoDefSituacionMilitar.NombreArchivo)
                    }
                }


                // -- 1.7 COMPORTAMIENTO FINANCIERO
                if (obj.oFinancialBehaviorVm != null) {
                    listComportamientoFinanciero = obj.oFinancialBehaviorVm
                    $('#txt_comportamiento_financiero').val(obj.oFinancialBehaviorVm.ComportamientoFinanciero)
                    if (obj.oFinancialBehaviorVm.ArchivoCompFinanciero != null) {
                        //$("#PreviewCompFinanciero button").attr("data-typefile", obj.oFinancialBehaviorVm.ArchivoCompFinanciero.ExtensionArchivo)
                        //$("#PreviewCompFinanciero button").attr("data-route", btoa(obj.oFinancialBehaviorVm.ArchivoCompFinanciero.RutaArchivo))
                        $("#PreviewCompFinanciero span").text(obj.oFinancialBehaviorVm.ArchivoCompFinanciero.NombreArchivo)
                    }
                }

                // -- 2.0 TEST CONFIABILIDAD
                if (obj.oReliabilityTestVm != null) {
                    // --
                    if (obj.oReliabilityTestVm.ArchivoAdjunto != null) {
                        // --
                        ListTestConfiablidad = obj.oReliabilityTestVm
                        //$("#PreviewTestConfiabilidad button").attr("data-typefile", obj.oReliabilityTestVm.ArchivoAdjunto.ExtensionArchivo)
                        //$("#PreviewTestConfiabilidad button").attr("data-route", btoa(obj.oReliabilityTestVm.ArchivoAdjunto.RutaArchivo))
                        $("#PreviewTestConfiabilidad span").text(obj.oReliabilityTestVm.ArchivoAdjunto.NombreArchivo)
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
                if (obj.oAnalysisReliabilityTestVm != null) {
                    // --
                    $("#txt_4_analisis").val(obj.oAnalysisReliabilityTestVm.Analisis)
                }



            }

        }
    });
    // --- }

}

// --
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

//Setenado Values input
setInputDatePicker("txt_1_1_fecha_nacimiento")
setInputDatePicker("txt_1_7_fecha_sentencia")
setInputDatePicker("txt_1_7_fecha_ejecutoria")
setInputDatePicker("txt_1_8_fecha_sentencia")
setInputDatePicker("txt_1_8_fecha_ejecutoria")
setInputDatePicker("txt_1_12_fec_ing_spp")
setInputDatePicker("txt_1_12_fec_resol")
// --
setInputDatePicker("txt_1_fecha_expedicion")
setInputDatePicker("txt_1_fecha_nacimiento")

getList180Colombia();
showVisitaDomiciliaria();