/* 
 * Nombre: functions.js
 * Autor: FIGG - DIRAC 
 * Fecha: 31-Julio-2017
 * Descripcion: Archivo que contiene funciones para actividades extra a arjion
 */
$(document).ready(function () {
    $("#complaintForm").submit(function (event) {
        event.preventDefault();
        $.ajax({
            type: "POST",
            url: 'controller/controllerMx.php',
            data: $('#complaintForm').serializeArray(),
            dataType: 'json',
            beforeSend: function () {
                console.log("AddProject");
                $("#msg").html("Enviando mensaje....");
            },
            success: function (response) {
                console.log(response);
                $("#msg").html("Enviando mensaje....");
                if (response.errorCode === 0) {
                    $("#msg").html("Informaci&oacute;n enviada.");
                    setTimeout(function () {
                        window.location = 'http://www.dirac.mx/';

                    }, 500);
                } else {
                    $("#msg").html("Ha ocurrido un error, por favor intente m&aacute;s tarde.");
                }
                setTimeout(function () {
                    $("#msg").html('');
                }, 1500);

            },
            error: function (a, b, c) {
                console.log(a, b, c);
            }
        });
    });

    $("#formPhoto").submit(function (event) {
        event.preventDefault();
        var formData = new FormData($('#formPhoto')[0]);
        formData.append('id_visitor', $("#id_registro").val());
        $.ajax({
            type: "POST",
            url: 'controller/savePhotos.php',
            data: formData,
            contentType: false,
            processData: false,
            dataType: 'json',
            beforeSend: function () {
                console.log("Upload Photo");
                $("#msg").html("Cargando imagen....");
            },
            success: function (response) {
                console.log(response);
                if (response.errorCode === 0) {
                    $("#msg").html(response.msg);
                    setTimeout(function () {
                        $("#msg").html("");
                        $("#photo1").removeClass("active");
                        $("#indications1").addClass("active");
                        $("#part2").removeClass("active in");
                        $("#part3").addClass("active in");
                    }, 500);
                } else {
                    $("#msg").html("Ha ocurrido un error, por favor intente m&aacute;s tarde.");
                }
                setTimeout(function () {
                    $("#msg").html('');
                }, 1500);

            },
            error: function (a, b, c) {
                console.log(a, b, c);
            }
        });
    });

//    $("#inspectionButton").on("click", function (event) {
//        event.preventDefault();
//        addBuildingInfo(2);
//    });

    $("#clientInspectionForm").submit(function (event) {
        event.preventDefault();
        $.ajax({
            type: "POST",
            url: 'controller/controllerMx.php',
            data: $('#clientInspectionForm').serializeArray(),
            dataType: 'json',
            beforeSend: function () {
                console.log("Add Client Building Inspection");
                $("#msg").html("Registrando inspección...");
            },
            success: function (response) {
                console.log(response);
//                $("#msg").html("Registrando inspección...");
                if (response.errorCode === 0) {
//                    $("#msg").html('Informaci&oacute;n enviada.<br /><button class="btn btn-primary" name="registrarNuevo" onClick="location.reload();" id="registrarNuevo" type="submit">Registrar nuevo</button>');
                    /********************************************************************************
                     ** 10-Octubre-2017 
                     **Guardamos el Local Storage al cliente por si no se pued eocmpletar el registro  
                     *********************************************************************************/
                    localStorage.setItem("clientQUBI", 1);
                    localStorage.setItem("id_clientQUBI", response.data);
                    /* ******************************************************************************/
                    setTimeout(function () {
                        $("#id_cliente").val(response.data);
                        $("#building").attr("data-toggle", "tab");
                        $("#part1").removeClass("active");
                        $("#clientl").removeClass("active");
                        $("#part2").attr("class", "tab-pane fade in active");
                        $("#buildingl").attr("class", "active");
                        $("#msg").html("");
                    }, 500);
                } else {
                    $("#msg").html("Ha ocurrido un error, por favor intente m&aacute;s tarde.");
                }

                setTimeout(function () {
//                    $("#msg").html('');
                }, 1500);

            },
            error: function (a, b, c) {
                console.log(a, b, c);
            }
        });
    });

    $("#clientInspectionFormEdit").submit(function (event) {
        event.preventDefault();
        $.ajax({
            type: "POST",
            url: 'controller/controllerMx.php',
            data: $('#clientInspectionFormEdit').serializeArray(),
            dataType: 'json',
            beforeSend: function () {
                console.log("Update Client Building Inspection");
//                $("#msg").html("Registrando inspección...");
            },
            success: function (response) {
                console.log(response);
//                $("#msg").html("Registrando inspección...");
                if (response.errorCode === 0) {
//                    $("#msg").html('Informaci&oacute;n enviada.<br /><button class="btn btn-primary" name="registrarNuevo" onClick="location.reload();" id="registrarNuevo" type="submit">Registrar nuevo</button>');
                    $("#msg").html("Cliente actualizado exitosamente.");
                } else {
                    $("#msg").html("Ha ocurrido un error, por favor intente m&aacute;s tarde.");
                }
                setTimeout(function () {
                    $("#msg").html('');
                }, 1500);

            },
            error: function (a, b, c) {
                console.log(a, b, c);
            }
        });
    });

    $("#inspectionForm").submit(function (event) {
        event.preventDefault();
        $.ajax({
            type: "POST",
            url: 'controller/controllerMx.php',
            data: $('#inspectionForm').serializeArray(),
            dataType: 'json',
            beforeSend: function () {
                console.log("Add Client Building Inspection");
//                $("#msg").html("Registrando inspección...");
            },
            success: function (response) {
                console.log(response);
//                $("#msg").html("Registrando inspección...");
                if (response.errorCode === 0) {
//                    $("#msg").html('Informaci&oacute;n enviada.<br /><button class="btn btn-primary" name="registrarNuevo" onClick="location.reload();" id="registrarNuevo" type="submit">Registrar nuevo</button>');
                    /********************************************************************************
                     ** 10-Octubre-2017 
                     **Borramos valores de Local Storage  
                     *********************************************************************************/
                    localStorage.removeItem("clientQUBI");
                    localStorage.removeItem("id_clientQUBI");
                    localStorage.clear();
                    /* ******************************************************************************/
                    setTimeout(function () {
                        $("#id_registro").val(response.data);
                        $("#images").attr("data-toggle", "tab");
                        $("#part2").removeClass("active");
                        $("#buildingl").removeClass("active");
                        $("#part3").attr("class", "tab-pane fade in active");
                        $("#imagesl").attr("class", "active");

                    }, 500);
                } else {
                    $("#msg").html("Ha ocurrido un error, por favor intente m&aacute;s tarde.");
                }

                setTimeout(function () {
//                    $("#msg").html('');
                }, 1500);

            },
            error: function (a, b, c) {
                console.log(a, b, c);
            }
        });
    });

    $("#inspectionFormEdit").submit(function (event) {
        event.preventDefault();
        $.ajax({
            type: "POST",
            url: 'controller/controllerMx.php',
            data: $('#inspectionFormEdit').serializeArray(),
            dataType: 'json',
            beforeSend: function () {
                console.log("Add Client Building Inspection");
//                $("#msg").html("Registrando inspección...");
            },
            success: function (response) {
                console.log(response);
//                $("#msg").html("Registrando inspección...");
                if (response.errorCode === 0) {
//                    $("#msg").html('Informaci&oacute;n enviada.<br /><button class="btn btn-primary" name="registrarNuevo" onClick="location.reload();" id="registrarNuevo" type="submit">Registrar nuevo</button>');
                    $("#msg").html("Información de edificio actualizada exitosamente.");
                } else {
                    $("#msg").html("Ha ocurrido un error, por favor intente m&aacute;s tarde.");
                }

                setTimeout(function () {
//                    $("#msg").html('');
                }, 1500);

            },
            error: function (a, b, c) {
                console.log(a, b, c);
            }
        });
    });


    $("#observaciones_revisor").submit(function (event) {
        event.preventDefault();
        $.ajax({
            type: "POST",
            url: 'controller/controllerMx.php',
            data: $('#observaciones_revisor').serializeArray(),
            dataType: 'json',
            beforeSend: function () {
                $("#msg").html("Enviando mensaje....");
            },
            success: function (response) {
                if (response.errorCode === 0) {
                    $("#msg").html("Informaci&oacute;n enviada.");
                    setTimeout(function () {
                        $("#msg").html("");
                        history.back();
                    }, 500);
                } else {
                    $("#msg").html("Ha ocurrido un error, por favor intente m&aacute;s tarde.");
                }
                setTimeout(function () {
                    $("#msg").html('');
                }, 1500);

            },
            error: function (a, b, c) {
                console.log(a, b, c);
            }
        });
    });

    $("#add_visitor").submit(function (event) {
        event.preventDefault();
        var check = validateForm($("#add_visitor"));
        if (check) {
            $.ajax({
                type: "POST",
                url: 'controller/controllerMx.php',
                data: $('#add_visitor').serializeArray(),
                dataType: 'json',
                beforeSend: function () {
                    $("#msg").html("<b class='text-warning'>Registrando visita....</b>");
                    $("#add_visitor_btn").prop("disabled", true);
                },
                success: function (response) {
                    if (response.errorCode === 0) {
                        $("#add_visitor_btn").prop("disabled", false);
                        $("#msg").html("<b class='text-success'>Informaci&oacute;n enviada.<b class='text-warning'>");
                        $("#id_registro").val(response.data);
                        $("#visitor_save").val("1");
                        $("#nombre_visitante").html($("#nombre").val());

                        $("#clientl").removeClass("active");
                        $("#photo1").addClass("active");
                        $("#part1").removeClass("active in");
                        $("#part2").addClass("active in");


                        /* FINISHED RECORD */
                        $("#persona").val($('#id_usuario option:selected').text());
                        $("#no_gafete").val($("#gafete").val());
                        $("#visitante").val($("#nombre").val());

                        getVideoId($("#id_usuario option:selected").attr("id_piso"));
                    } else {
                        $("#msg").html("Ha ocurrido un error, por favor intente m&aacute;s tarde.");
                    }
                    setTimeout(function () {
                        $("#msg").html('');
                    }, 1500);
                },
                error: function (a, b, c) {
                    console.log(a, b, c);
                }
            });
        } else {
            $("#msg").html('<b class="text-danger">Favor de llenar todos los campos</b>');
            setTimeout(function () {
                $("#msg").html('');
            }, 2000);
            return false;
        }
    });

});

function obtenerRegistrosBI(usr) {
    $.post("controller/controllerMx.php",
            {evento: 3},
            function (response) {
                console.log(response.data);
                if (response.errorCode === 0) {
                    console.log(response.data);
                    var records = "";
                    $.each(response.data, function (index, value) {
                        if ((parseInt(response.data[index].id_supervisor) === parseInt(usr) && parseInt(response.data[index].revisado) === 0) || parseInt(response.data[index].reviso) === parseInt(usr) || (parseInt(usr) === 331 && parseInt(response.data[index].dro) === 1) || (parseInt(usr) === 102 || parseInt(usr) === 93 || parseInt(usr) === 108 || parseInt(usr) === 17 || parseInt(usr) === 9 || parseInt(usr) === 21)) {
                            records += '<tr>'
                                    + '<td>' + value.id + '</td>'
                                    + '<td>' + value.nombre_edificio + '</td>'
                                    + '<td>' + value.nombre + '</td>'
                                    + '<td>' + value.fecha_inspeccion + '</td>'
                                    + '<td>' + value.resultado.substring(0, 100) + '...</td>';


                            records += '<td>' + value.comentarios.substring(0, 100) + '...</td>'
                                    + '<td>' + value.supervisor + '</td>';
                            if (parseInt(value.tipo) === 1) {
                                records += '<td>Oficina</td>';
                            } else if (parseInt(value.tipo) === 2) {
                                records += '<td>Industria</td>';
                            } else if (parseInt(value.tipo) === 3) {
                                records += '<td>Bodega/Almacen</td>';
                            } else if (parseInt(value.tipo) === 4) {
                                records += '<td>Vivienda</td>';
                            } else if (parseInt(value.tipo) === 5) {
                                records += '<td>Infraestructura</td>';
                            } else if (parseInt(value.tipo) === 6) {
                                records += '<td>Hospital</td>';
                            } else if (parseInt(value.tipo) === 7) {
                                records += '<td>Escuela</td>';
                            } else if (parseInt(value.tipo) === 8) {
                                records += '<td>Otro</td>';
                            } else {
                                records += '<td>Sin Registro</td>';
                            }
                            //Estado del edeificio
                            if (parseInt(value.estado_h) === 1) {
                                records += '<td class="text-success text-bold"> <i class="fa fa-lightbulb-o"></i>Habitable</strong></td>';
                            } else if (parseInt(value.estado_h) === 2) {
                                records += '<td class="text-danger text-bold"> <i class="fa fa-lightbulb-o"></i>No habitable</strong></td>';
                            } else {
                                records += '<td class="text-warning text-bold"><strong> <i class="fa fa-lightbulb-o"></i>Riesgo </strong></td>';
                            }

                            if (parseInt(value.revisado) === 0) {
                                records += '<td class="text-warning text-bold"><strong>Por revisar </strong></td>';
                            } else {
                                records += '<td class="text-success text-bold"><strong> Revisado</strong></td>';
                            }

                            records += '<td>' + value.revisor + '</td>';

                            records += '<td><a href="vista_registros.php?id=' + value.id + '">Ver informaci&oacute;n</a></td>'
                                    + '</tr>';
                        }
                    });
                    $("#dirac_building_records").append(records);
                    $("#dirac_BI").dataTable({
                        "dom": 'Bfrtip',
                        "buttons": [
                            'colvis', 'csv', 'excel', 'pdf', 'print'
//                            'excel', 'pdf', 'print'
                        ],
                        "bPaginate": true,
                        "bLengthChange": true,
                        "bFilter": true,
                        "bSort": true,
                        "bInfo": true,
                        "bAutoWidth": false,
                        "oLanguage": {
                            "sProcessing": "Procesando...",
                            "sLengthMenu": "Mostrar _MENU_ registros",
                            "sZeroRecords": "No se encontraron resultados",
                            "sEmptyTable": "Ningún dato disponible en esta tabla",
                            "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                            "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
                            "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
                            "sInfoPostFix": "",
                            "sSearch": "Buscar:",
                            "sUrl": "",
                            "sInfoThousands": ",",
                            "sLoadingRecords": "Cargando...",
                            "sButtonText": "Imprimir",
                            "oPaginate": {
                                "sFirst": "Primero",
                                "sLast": "Último",
                                "sNext": "Siguiente",
                                "sPrevious": "Anterior"
                            },
                            "buttons": {
                                "print": "Imprimir",
                                "colvis": "Columnas mostradas"
                            }
                        }
                    });
                } else {
                    $("#msg").html("Ha ocurrido un error, por favor intente m&aacute;s tarde.");
                }
            }, 'json');
}

function obtenerInfoRegistro(id, usr) {
    $.post("controller/controllerMx.php",
            {evento: 5, id: id},
            function (response) {
                console.log(response.data);
                if (response.errorCode === 0) {
                    $("#inspeccionA").html(response.data.fecha_inspeccion);
                    $("#nombreA").html(response.data.nombre_edificio);
                    $("#supervisorA").html(response.data.supervisor);
                    $("#referenciasA").html(response.data.referencias);
                    $("#clienteA").html(response.data.nombre);

                    if (parseInt(response.data.reviso) === parseInt(usr) || parseInt(usr) === 331) {
                        $("#opcionesRevisor").toggle("slow");
                        $("#opcionesSupervisor").toggle("slow");
                        if (parseInt(usr) === 331) {
                            $("#btnDRO").toggle("slow");
                        }
                    }
                    console.log(parseInt(response.data.id_supervisor) + " ===" + parseInt(usr))
                    if (parseInt(response.data.id_supervisor) === parseInt(usr) && parseInt(response.data.revisado) === 0) {
                        $("#opcionesSupervisor").toggle("slow");
                    }

                    $("#idRevisor").val(response.data.reviso);
                    if (parseInt(response.data.tipo) === 1) {
                        $("#tipoA").html("Oficina");
                    } else if (parseInt(response.data.tipo) === 2) {
                        $("#tipoA").html("Industria");
                    } else if (parseInt(response.data.tipo) === 3) {
                        $("#tipoA").html("Bodega/Almacen");
                    } else if (parseInt(response.data.tipo) === 4) {
                        $("#tipoA").html("Vivienda");
                    } else if (parseInt(response.data.tipo) === 5) {
                        $("#tipoA").html("Infraestructura");
                    } else if (parseInt(response.data.tipo) === 6) {
                        $("#tipoA").html("Hospital");
                    } else if (parseInt(response.data.tipo) === 7) {
                        $("#tipoA").html("Escuela");
                    } else if (parseInt(response.data.tipo) === 8) {
                        $("#tipoA").html("Otro");
                    } else {
                        $("#tipoA").html("Sin Registro");
                    }


                    $("#pisosA").html(response.data.no_pisos);
                    $("#sotanosA").html(response.data.no_sotanos);
                    $("#solucionA").html(response.data.solucion_estructural);


                    if (parseInt(response.data.estado_h) === 1) {
                        $("#estadoA").html("<p class='text-success'>Habitable</p>");
                    } else if (parseInt(response.data.estado_h) === 2) {
                        $("#estadoA").html("<p class='text-danger'>No habitable</p>");
                    } else {
                        $("#estadoA").html("<p class='text-warning'>Riesgo</p>");
                    }
                    $("#comentariosA").html(response.data.comentarios);

                    if (parseInt(response.data.revisado) === 0) {
                        $("#revisadoA").html("<p class='text-danger'>El reporte no ha sido envíado al cliente.</p>");
                    } else {
                        $("#revisadoA").html("<p class='text-info'>El reporte ya ha sido envíado.</p>");
                    }
                    //                    $("#direccionA").html(response.data.direccion);
                    $("#resultadoA").html(response.data.resultado);

                    //Obtenemos direccion  de edificio
//                    obtenerDireccionVista(response.data.id_colonia, response.data.calle, response.data.numero, response.data.latitud, response.data.longitud);
                    $("#direccionA").html("Calle " + response.data.calle + " n&uacute;mero " + response.data.numero + " colonia " + response.data.colonia + ", C.P. " + response.data.cp + " , " + response.data.municipio + "; " + response.data.estado + ". <br /> Latitud: " + response.data.latitud + ", Longitud: " + response.data.longitud + ".");

                    $.each(response.data.resultados, function (key, value) {
                        printResult(value);
                    });
                    $.each(response.data.actividades, function (key, value) {
                        printActivities(value);
                    });
                    setTimeout(function () {
                        $("#resultadosA").append("  " + response.data.otros);

                    }, 2000);

                } else {
                    $("#msg").html("Ha ocurrido un error, por favor intente m&aacute;s tarde.");
                }
            }, 'json');
}

function obtenerArchivoR(id) {
    $.post("controller/controllerMx.php",
            {evento: 4, id: id},
            function (response) {
                console.log(response.data);
                if (response.errorCode === 0) {
                    var records = "";
                    $.each(response.data, function (index, value) {
                        records += '<tr>'
//                                + '<td>' + value.id + '</td>'
                                + '<td>' + value.archivo + '</td>'
                                + '<td>' + value.descripcion + '</td>'
                                + '<td><img width="150" height="150" alt="archivo" title="archivo" id="archivo" src="inspecciones/' + value.archivo + '" /></td>'
                                + '<td>' + value.fecha + '</td>';

                        records += '<td><a href="#" onClick="verArchivo(\'' + value.archivo + '\',\'' + value.descripcion + '\'); return false">Ver archivo</a></td>'
                                + '</tr>';
                    });
                    $("#dirac_archivos_b").append(records);
                    $("#dirac_archivos").dataTable({
                        "dom": 'Bfrtip',
                        "buttons": [
                            'colvis', 'csv', 'excel', 'pdf', 'print'
//                            'excel', 'pdf', 'print'
                        ],
                        "bPaginate": true,
                        "bLengthChange": true,
                        "bFilter": true,
                        "bSort": true,
                        "bInfo": true,
                        "bAutoWidth": false,
                        "oLanguage": {
                            "sProcessing": "Procesando...",
                            "sLengthMenu": "Mostrar _MENU_ registros",
                            "sZeroRecords": "No se encontraron resultados",
                            "sEmptyTable": "Ningún dato disponible en esta tabla",
                            "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                            "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
                            "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
                            "sInfoPostFix": "",
                            "sSearch": "Buscar:",
                            "sUrl": "",
                            "sInfoThousands": ",",
                            "sLoadingRecords": "Cargando...",
                            "sButtonText": "Imprimir",
                            "oPaginate": {
                                "sFirst": "Primero",
                                "sLast": "Último",
                                "sNext": "Siguiente",
                                "sPrevious": "Anterior"
                            },
                            "buttons": {
                                "print": "Imprimir",
                                "colvis": "Columnas mostradas"
                            }
                        }
                    });
                } else {
                    $("#msg").html("Ha ocurrido un error, por favor intente m&aacute;s tarde.");
                }
            }, 'json');
}

function verArchivo(archivo, descripcion) {
    var extension = getExtension(archivo);
    if (extension === 'jpg' || extension === 'png' || extension === 'jpeg' || extension === 'JPG' || extension === 'PNG' || extension === 'JPEG') {
        $("#contenido_archivo").html('  <div class="modal-body text-center"><img width="400" height="400" alt="archivo" title="archivo" id="archivo" src="inspecciones/' + archivo + '" /><p class="text-justify">' + descripcion + '</p> </div>');
    } else if (extension === 'mp4' || extension === 'mov' || extension === '3gp' || extension === 'MP4' || extension === 'MOV' || extension === '3GP') {
        $("#contenido_archivo").html('  <div class="modal-body text-center"><video width="400" height="400" controls id="videoPlayer" ><source src="inspecciones/' + archivo + '"></video><p class="text-justify">' + descripcion + '</p></div>');
    } else {
        $("#contenido_archivo").html('  <div class="modal-body text-center"><a href="inspecciones/' + archivo + '" >Descargar archivo</a><p class="text-justify">' + descripcion + '</p></div>');
    }
    $("#myModal").modal("show");
}

function editarArchivo(archivo, descripcion, id, id_registro) {
    var extension = getExtension(archivo);
    if (extension === 'jpg' || extension === 'png' || extension === 'jpeg' || extension === 'JPG' || extension === 'PNG' || extension === 'JPEG') {
        $("#contenido_archivo").html('<div class="modal-body text-center"><img width="400" height="400" alt="archivo" title="archivo" id="archivo" src="inspecciones/' + archivo + '" /><br /><textarea name="pie_pagina" id="pie_pagina" value="' + descripcion + '" class="form-control" rows="5" cols="40" >' + descripcion + '</textarea><input type="hidden" name="id_img" id="id_img" value="' + id + '" /><br /><button name="Edit" id="Edit" onclick="editarPieImg(' + id_registro + ');" class="btn btn-primary">Editar descripci&oacute;n</button></div>');
    } else if (extension === 'mp4' || extension === 'mov' || extension === '3gp' || extension === 'MP4' || extension === 'MOV' || extension === '3GP') {
        $("#contenido_archivo").html('<div class="modal-body text-center"><video width="400" height="400" controls id="videoPlayer" ><source src="inspecciones/' + archivo + '"></video><br /><textarea name="pie_pagina" id="pie_pagina" value="' + descripcion + '" class="form-control" rows="5" cols="40" >' + descripcion + '</textarea><input type="hidden" name="id_img" id="id_img" value="' + id + '" /><br /><button name="Edit" id="Edit" onclick="editarPieImg(' + id_registro + ');" class="btn btn-primary">Editar descripci&oacute;n</button></div>');
    } else {
        $("#contenido_archivo").html('<div class="modal-body text-center"><br /><textarea name="pie_pagina" id="pie_pagina" value="' + descripcion + '" class="form-control" rows="5" cols="40" >' + descripcion + '</textarea><input type="hidden" name="id_img" id="id_img" value="' + id + '" /><br /><button name="Edit" id="Edit" onclick="editarPieImg(' + id_registro + ');" class="btn btn-primary">Editar descripci&oacute;n</button></div>');
    }
    $("#myModal").modal("show");
}

function getExtension(nombre) {
    return (/[.]/.exec(nombre)) ? /[^.]+$/.exec(nombre)[0] : undefined;
}

function addBuildingInfo(op) {
    $.ajax({
        type: "POST",
        url: 'controller/controllerMx.php',
        data: $('#inspectionForm').serializeArray(),
        dataType: 'json',
        beforeSend: function () {
            console.log("Add Building Inspection");
//            $("#msg").html("Registrando inspección...");
        },
        success: function (response) {
            console.log(response);
//            $("#msg").html("Registrando inspección...");
            if (response.errorCode === 0) {
//                    $("#msg").html('Informaci&oacute;n enviada.<br /><button class="btn btn-primary" name="registrarNuevo" onClick="location.reload();" id="registrarNuevo" type="submit">Registrar nuevo</button>');
                setTimeout(function () {
                    if (op === 1) {
                        location.reload();
                    } else {
                        $("#id_registro").val(response.data);
                        $("#images").attr("data-toggle", "tab");
                        $("#part2").removeClass("active");
                        $("#buildingl").removeClass("active");
                        $("#part3").attr("class", "tab-pane fade in active");
                        $("#imagesl").attr("class", "active");
                    }

                }, 500);
            } else {
                $("#msg").html("Ha ocurrido un error, por favor intente m&aacute;s tarde.");
            }

            setTimeout(function () {
//                    $("#msg").html('');
            }, 1500);

        },
        error: function (a, b, c) {
            console.log(a, b, c);
        }
    });
}

function obtenerDireccionVista(id_colonia, calle, numero, latitud, longitud) {
//    $.post("http://148.243.10.117/sgi-dirac/controller/addressController.php",
    $.post("http://201.149.54.149/sgi-dirac/controller/addressController.php",
            {evento: 6, colony: id_colonia},
            function (response) {
                if (response.errorCode === 0) {
                    console.log(response);
                    $("#direccionA").html("Calle " + calle + " n&uacute;mero " + numero + " colonia " + response.data[0].nombre_colonia + ", " + response.data[0].nombre_ciudad + "; " + response.data[0].nombre_estado + ". <br /> Latitud: " + latitud + ", Longitud: " + longitud + ".");
                } else {
                    $("#msg").html("Ha ocurrido un error, por favor intente m&aacute;s tarde.");
                }
            }, 'json');
}

function printResult(clave) {
    console.log("get Result:" + clave);
    $.post("controller/controllerMx.php",
            {evento: 7, clave: clave},
            function (response) {
                if (response.errorCode === 0) {
                    console.log(response.data);
                    $("#resultadosA").append(response.data[0].descripcion + " <br />");
                } else {
                    $("#msg").html("Ha ocurrido un error, por favor intente m&aacute;s tarde.");
                }
            }, 'json');
}
function printActivities(clave) {
    $.post("controller/controllerMx.php",
            {evento: 8, clave: clave},
            function (response) {
                if (response.errorCode === 0) {
                    $("#actividadesA").append(response.data[0].descripcion + " <br />");
                } else {
                    $("#msg").html("Ha ocurrido un error, por favor intente m&aacute;s tarde.");
                }
            }, 'json');
}

/* ***************************** UTILS ***************************** */
function getStatesByCountry(country) {
//    $.post("http://148.243.10.117/sgi-dirac/controller/addressController.php",
    $.post("http://201.149.54.149/sgi-dirac/controller/addressController.php",
            {evento: 1, country: country},
            function (response) {
                if (response.errorCode === 0) {
                    var states = '<option value="0">Seleccione opci&oacute;n</option>';
                    $.each(response.data, function (index, value) {
                        states += '<option value="' + value.id_estado + '">' + value.nombre_estado + '</option>';
                    });
                    $("#estados").append(states);
                } else {
                    $("#msg").html("Ha ocurrido un error, por favor intente m&aacute;s tarde.");
                }
            }, 'json');
}

function getCitiesByState(state) {
//    $.post("http://148.243.10.117/sgi-dirac/controller/addressController.php",
    $.post("http://201.149.54.149/sgi-dirac/controller/addressController.php",
            {evento: 2, state: state},
            function (response) {
                if (response.errorCode === 0) {
                    $("#ciudades").html("");
                    var cities = '<option value="0">Seleccione opci&oacute;n</option>';
                    $.each(response.data, function (index, value) {
                        cities += '<option value="' + value.id_ciudad + '">' + value.nombre_ciudad + '</option>';
                    });
                    $("#ciudades").append(cities);
                } else {
                    $("#msg").html("Ha ocurrido un error, por favor intente m&aacute;s tarde.");
                }
            }, 'json');
}

function getColsByCity(city) {
//    $.post("http://148.243.10.117/sgi-dirac/controller/addressController.php",
    $.post("http://201.149.54.149/sgi-dirac/controller/addressController.php",
            {evento: 3, city: city},
            function (response) {
                if (response.errorCode === 0) {
                    $("#colonias").html("");
                    var colonies = '<option value="0">Seleccione opci&oacute;n</option>';
                    $.each(response.data, function (index, value) {
                        colonies += '<option value="' + value.id_colonia + '">' + value.nombre_colonia + '</option>';
                    });
                    $("#colonias").append(colonies);
                } else {
                    $("#msg").html("Ha ocurrido un error, por favor intente m&aacute;s tarde.");
                }
            }, 'json');
}

function getZCByColony(colony) {
    console.log("Colonia: ", colony);
//    $.post("http://148.243.10.117/sgi-dirac/controller/addressController.php",
    $.post("http://201.149.54.149/sgi-dirac/controller/addressController.php",
            {evento: 4, colony: colony},
            function (response) {
                console.log(response.data);
                if (response.errorCode === 0) {
                    console.log(response.data[0].valor);
                    $("#cp").val(response.data[0].valor);
                    $("#id_cp").val(response.data[0].id_cp);
                } else {
                    $("#msg").html("Ha ocurrido un error, por favor intente m&aacute;s tarde.");
                }
            }, 'json');
}

function agregarOtro() {
    $("#otros").show();
}
function agregarNS() {
    $("#sotanos").toggle();
}

function generarEnviar(id, opcion) {
    $("#msg").html("Enviando reporte...");
    $.post("controller/generar_reporte.php",
            {id: id, opcion: opcion},
            function (response) {
                console.log(response.data);
                if (response.errorCode === 0) {
                    $("#msg").html(response.msg);
                } else {
                    $("#msg").html("Ha ocurrido un error, por favor intente m&aacute;s tarde.");
                }
            }, 'json');
}

function visualizarReporte(id) {
    $("#msg").html("Generando reporte...");
    window.open('controller/visualizar_reporte.php?id=' + id, '_blank');
    $("#msg").html("Reporte generado.");
}

function enviarCorreccionesInspector(id) {
    $("#myModalObservaciones").modal("show");
    $("#id_inspeccionO").val(id);
}

function enviarMejRevisor(id) {
    $("#myModalObservaciones").modal("show");
    $("#id_inspeccionO").val(id);
    $("#tipo").val("2");
    $("#titleMod").html("Mensaje a revisor: ");
}


function obtenerInfoInspeccion(id) {
    $.post("controller/controllerMx.php",
            {evento: 5, id: id},
            function (response) {
                console.log(response.data);
                if (response.errorCode === 0) {
                    /* ****** CLIENTE ****** */
                    $("#id_cliente").val(response.data.id_cliente);
                    $("#nombre_cliente").val(response.data.nombre);
                    $("#correo").val(response.data.correo);
                    $("#telefono").val(response.data.telefono);
                    $("#sexo").select2("val", response.data.sexo);

                    /* ****** EDIFICIO ****** */
//                    setTimeout(function () {
////                        alert(response.data.id_estado);
//                        $("#estados").select2("val", response.data.id_estado);
//                    }, 1000);
//                    setTimeout(function () {
////                        alert(response.data.id_ciudad);
//                        $("#ciudades").select2("val", response.data.id_ciudad);
//                    }, 2000);
//                    setTimeout(function () {
////                        alert(response.data.id_colonia);
//                        $("#colonias").select2("val", response.data.id_colonia);
//                    }, 3000);
                    $("#estados").val(response.data.estado);
                    $("#ciudades").val(response.data.municipio);
                    $("#colonias").val(response.data.colonia);
                    $("#cp").val(response.data.cp);

                    $("#id_inspeccion").val(response.data.id);
                    $("#id_direccion").val(response.data.id_direccion);
                    $("#fecha_inspeccion").val(response.data.fecha_inspeccion);
                    $("#nombre_edificio").val(response.data.nombre_edificio);
                    $("#tipo").select2("val", response.data.tipo);
                    $("#calle").val(response.data.calle);
                    $("#numero").val(response.data.numero);
                    $("#referencias").val(response.data.referencias);
                    $("#latitud").val(response.data.latitud);
                    $("#longitud").val(response.data.longitud);
                    $("#resultado").val(response.data.resultado);
                    $("#estado_h").select2("val", response.data.estado_h);
                    $("#comentarios").val(response.data.comentarios);

                    $("#id_registro").val(response.data.id);

//                    setTimeout(function () {
//                        getAllAddressByCol(response.data.id_colonia);
//                    }, 1000);

                    $.each(response.data.resultados, function (key, value) {
                        $('#r' + value).prop('checked', true);
                    });
                    $.each(response.data.actividades, function (key, value) {
                        $('#a' + value).prop('checked', true);
                    });
                    $("#otros").val(response.data.otros);

                    $("#pisos").val(response.data.no_pisos);
                    $("#numero_sotano").val(response.data.no_sotanos);
                    $("#solucion").val(response.data.solucion_estructural);

                    if (parseInt(response.data.sotano) === 1) {
                        $("#SI").prop("checked", true);
                    } else {
                        $("#NO").prop("checked", true);
                    }





                } else {
                    $("#msg").html("Ha ocurrido un error, por favor intente m&aacute;s tarde.");
                }
            }, 'json');
}

function getAllAddressByCol(id_colonia) {
    console.log("Colonia: ", id_colonia);
    $.post("controller/controllerMx.php",
            {evento: 9, id_colonia: id_colonia},
            function (response) {
                if (response.errorCode === 0) {
                    $("#estados").select2("val", response.data[0].id_estado);
                    setTimeout(function () {
                        $("#ciudades").select2("val", response.data[0].id_ciudad);
                        setTimeout(function () {
                            $("#colonias").select2("val", response.data[0].id_colonia);
                        }, 1000);
                    }, 1000);
                } else {
                    $("#msg").html("Ha ocurrido un error, por favor intente m&aacute;s tarde.");
                }
            }, 'json');
}

function obtenerArchivoREdit(id) {
    $.post("controller/controllerMx.php",
            {evento: 4, id: id},
            function (response) {
                console.log(response.data);
                if (response.errorCode === 0) {
                    var records = "";
                    $.each(response.data, function (index, value) {
                        records += '<tr>'
//                                + '<td>' + value.id + '</td>'
                                + '<td>' + value.archivo + '</td>'
                                + '<td>' + value.descripcion + '</td>'
                                + '<td>' + value.fecha + '</td>';

                        records += '<td><a href="#" onClick="eliminarArchivo(\'' + value.id + '\', ' + id + ');return false;">Eliminar</a><br /><a href="#" onClick="verArchivo(\'' + value.archivo + '\',\'' + value.descripcion + '\'); return false">Ver archivo</a><br /><a href="#" onClick="editarArchivo(\'' + value.archivo + '\',\'' + value.descripcion + '\',\'' + value.id + '\', ' + id + ');return false;">Editar descripci&oacute;n</a><br /></td>'
                                + '</tr>';
                    });
                    $("#dirac_archivos_b").append(records);
                    $("#dirac_archivos").dataTable({
                        "dom": 'Bfrtip',
                        "buttons": [
                            'colvis', 'csv', 'excel', 'pdf', 'print'
//                            'excel', 'pdf', 'print'
                        ],
                        "bPaginate": true,
                        "bLengthChange": true,
                        "bFilter": true,
                        "bSort": true,
                        "bInfo": true,
                        "bDestroy": true,
                        "bAutoWidth": false,
                        "oLanguage": {
                            "sProcessing": "Procesando...",
                            "sLengthMenu": "Mostrar _MENU_ registros",
                            "sZeroRecords": "No se encontraron resultados",
                            "sEmptyTable": "Ningún dato disponible en esta tabla",
                            "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                            "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
                            "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
                            "sInfoPostFix": "",
                            "sSearch": "Buscar:",
                            "sUrl": "",
                            "sInfoThousands": ",",
                            "sLoadingRecords": "Cargando...",
                            "sButtonText": "Imprimir",
                            "oPaginate": {
                                "sFirst": "Primero",
                                "sLast": "Último",
                                "sNext": "Siguiente",
                                "sPrevious": "Anterior"
                            },
                            "buttons": {
                                "print": "Imprimir",
                                "colvis": "Columnas mostradas"
                            }
                        }
                    });
                } else {
                    $("#msg").html("Ha ocurrido un error, por favor intente m&aacute;s tarde.");
                }
            }, 'json');
}

function eliminarArchivo(id_archivo, id_registro) {
    $.post("controller/controllerMx.php",
            {evento: 10, id_archivo: id_archivo},
            function (response) {
                if (response.errorCode === 0) {
//                    $("#dirac_archivos").dataTable().fnDestroy();
                    $("#dirac_archivos_b").html("");
                    obtenerArchivoREdit(id_registro);
                } else {
                    $("#msg").html("Ha ocurrido un error, por favor intente m&aacute;s tarde.");
                }
            }, 'json');
}

function editarPieImg(id_registro) {
    $.post("controller/controllerMx.php",
            {evento: 18, id_archivo: $("#id_img").val(), descripcion: $("#pie_pagina").val()},
            function (response) {
                console.log(response);
                if (response.errorCode === 0) {
//                    $("#dirac_archivos").dataTable().fnDestroy();
                    $("#myModal").modal("toggle");
                    window.location.href = 'editar_reporte.php?id=' + id_registro;
                } else {
                    $("#msg").html("Ha ocurrido un error, por favor intente m&aacute;s tarde.");
                }
            }, 'json');

}

function getUsrsOC() {
    console.log("Obteniendo usuarios de Oficinas Centrales");
    $.ajax({
        type: "POST",
        url: 'controller/controllerMx.php',
        data: {evento: 20},
        dataType: 'json',
        beforeSend: function () {
            console.log("Get Users.....");
        },
        success: function (response) {
            if (response.errorCode === 0) {
                $.each(response.data, function (index, value) {
                    $("#id_usuario").append('<option value="' + value.id_usuario + '" id_piso="' + value.id_piso + '">' + value.nombre + "  " + value.apellidos + '</option>');
                });

            } else {
                console.log(response);
            }
        },
        error: function (a, b, c) {
            console.log(a, b, c);
        }
    });
}

function getUsrsOC1() {
    console.log("Obteniendo usuarios de Oficinas Centrales: getUsrsOC1");
    $.ajax({
        type: "POST",
        url: 'controller/controllerMx.php',
        data: {evento: 20},
        dataType: 'json',
        beforeSend: function () {
            console.log("Get Users.....");
        },
        success: function (response) {
            if (response.errorCode === 0) {
                $.each(response.data, function (index, value) {

                    if (parseInt(value.id_usuario) !== 1 && parseInt(value.id_usuario) !== 2) {
                        console.log(parseInt(value.id_usuario));
                        $("#id_usuario").append('<option value="' + value.id_usuario + '" id_piso="' + value.id_piso + '">' + value.nombre + "  " + value.apellidos + '</option>');
                    }

                });

            } else {
                console.log(response);
            }
        },
        error: function (a, b, c) {
            console.log(a, b, c);
        }
    });
}

function getVideoId(id_area) {
    var playList = [];
    var piso = null;

    switch (parseInt(id_area)) {
        case 1://PLANTA BAJA
            playList.push("http://201.149.54.149/diracmx/videos/recursos/dirac plano PB-A.mp4");
            playList.push("http://201.149.54.149/diracmx/videos/recursos/dirac plano PB-B.mp4");
            playList.push("http://201.149.54.149/diracmx/videos/recursos/dirac plano PB-C.mp4");
//            playList.push("http://201.149.54.149/diracmx/videos/recursos/dirac plano PB-A.mp4");
//            playList.push("http://201.149.54.149/diracmx/videos/recursos/dirac plano PB-B.mp4");
//            playList.push("http://201.149.54.149/diracmx/videos/recursos/dirac plano PB-C.mp4");
            piso = "Planta Baja";
            break;
        case 2://PISO 1
            playList.push("http://201.149.54.149/diracmx/videos/recursos/dirac plano P1-A.mp4");
            playList.push("http://201.149.54.149/diracmx/videos/recursos/dirac plano P1-B.mp4");
            playList.push("http://201.149.54.149/diracmx/videos/recursos/dirac plano P1-C.mp4");
//            playList.push("http://148.243.10.117/diracmx/videos/recursos/dirac plano P1-A.mp4");
//            playList.push("http://148.243.10.117/diracmx/videos/recursos/dirac plano P1-B.mp4");
//            playList.push("http://148.243.10.117/diracmx/videos/recursos/dirac plano P1-C.mp4");
            piso = "Piso 1";
            break;
        case 3://PISO 2
            playList.push("http://201.149.54.149/diracmx/videos/recursos/dirac plano P2-A.mp4");
            playList.push("http://201.149.54.149/diracmx/videos/recursos/dirac plano P2-B.mp4");
//            playList.push("http://148.243.10.117/diracmx/videos/recursos/dirac plano P2-A.mp4");
//            playList.push("http://148.243.10.117/diracmx/videos/recursos/dirac plano P2-B.mp4");
            piso = "Piso 2";
            break;
        case 4://PISO 3
            playList.push("http://148.243.10.117/diracmx/videos/recursos/dirac plano P3-A.mp4");
            piso = "Piso 3";
            break;
        default:
            playList.push("http://201.149.54.149/diracmx/videos/recursos/dirac plano PB-A.mp4");
            playList.push("http://201.149.54.149/diracmx/videos/recursos/dirac plano PB-B.mp4");
            playList.push("http://201.149.54.149/diracmx/videos/recursos/dirac plano PB-C.mp4");
//            playList.push("http://148.243.10.117/diracmx/videos/recursos/dirac plano PB-A.mp4");
//            playList.push("http://148.243.10.117/diracmx/videos/recursos/dirac plano PB-B.mp4");
//            playList.push("http://148.243.10.117/diracmx/videos/recursos/dirac plano PB-C.mp4");
            piso = "Planta Baja";
            break;
    }

    $("#piso").val(piso);

    //Obtenemos Reproductor
    var vp = document.getElementById("videoPlayer");
    //Realizamos peticion para traer los videos de la BD.
    //Inicializamos contador y playList
    var cont = 0;
    $("#videoPlayer").prop("src", playList[cont]);
    vp.play();

    $("#videoPlayer").on('ended', function () {
        cont++;
        console.log(playList.length + "==" + cont);
        if (playList.length <= cont) {
            vp.pause();
            $("#finished_record").submit();
        } else {
            $("#videoPlayer").prop("src", playList[cont]);
            console.log(cont + " - " + playList[cont]);
            vp.play();
        }
    });

}

function uploadImage() {
    var formData = new FormData($('#formPhoto')[0]);
    formData.append('id_visitor', $("#id_registro").val());
    $.ajax({
        type: "POST",
        url: 'controller/savePhotos.php',
        data: formData,
        contentType: false,
        processData: false,
        dataType: 'json',
        beforeSend: function () {
            console.log("Upload Photo");
            $("#msg").html("Cargando imagen....");
        },
        success: function (response) {
            console.log(response);
            if (response.errorCode === 0) {
                $("#msg").html("Foto almacenada.");
                setTimeout(function () {
                    $("#msg").html("");
                    $("#photo1").removeClass("active");
                    $("#indications1").addClass("active");
                    $("#part2").removeClass("active in");
                    $("#part3").addClass("active in");
                }, 500);
            } else {
                $("#msg").html("Ha ocurrido un error, por favor intente m&aacute;s tarde.");
            }
            setTimeout(function () {
                $("#msg").html('');
            }, 1500);

        },
        error: function (a, b, c) {
            console.log(a, b, c);
        }
    });
}


/* **************************************************************** */