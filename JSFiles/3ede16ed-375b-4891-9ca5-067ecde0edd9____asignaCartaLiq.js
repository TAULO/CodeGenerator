esTab = false;
var parametroBean = consultaParametrosSession();
//Definicion de Constantes y Enums
var catTipoTransCarta = {
	  'agrega':'1',
	  'modifica':'2'
  };

var catTipoConsultaCarta = {
	  'principal'	: 1,
	  'solCred'	: 3
};

var catTipoConsultaCliente = {
		  'principal':1,
		  'foranea':2
};

var catTipoTransArchivo = {
		  'adjuntar':'1'
	  };

var estSolicitud = '';
var listaEstatus = ['L','I'];

$(document).ready(function() {
//------------ Msetodos y Manejo de Eventos -----------------------------------------
agregaFormatoControles('formaGenerica');
deshabilitaBoton('grabar', 'submit');

$('#consolidacionCartaID').focus();

$(':text').bind('keydown',function(e){
	if (e.which == 9 && !e.shiftKey){
		esTab= true;
	}
});

$(':text').focus(function() {
	 esTab = false;
});

$('#consolidacionCartaID').bind('keyup',function(e) {
	lista('consolidacionCartaID', '2', '2', 'consolidacionCartaID', $('#consolidacionCartaID').val(), 'listaConsolidacion.htm');
});

$('#consolidacionCartaID').blur(function() {
	var consolidaCartaID =	$('#consolidacionCartaID').val();
	estSolicitud = '';
	if( consolidaCartaID != 0 && consolidaCartaID != '' ){
		funcionConsultaConsolidacion(this.id);
	}else{
		if(consolidaCartaID == 0){
			habilitaBoton("grabar","submint")
			$("#gridCartaLiq").html("");
			$("#gridCartaLiq").hide();
			$("#gridCartaLiqInt").html("");
			$("#gridCartaLiqInt").hide();

			$("#clienteID").val('');
			$("#clienteID").focus();
			$("#solicitudCreditoID").val('');
			$("#nombreCliente").val('');
		}
		if(typeof var_consolidacion !== 'undefined')
		{
			$("#solic").hide();
		}
	}
});


$('#clienteID').bind('keyup',function(e) {
	if (this.value.length >= 0) {
		lista('clienteID', '2', '1', 'nombreCompleto',$('#clienteID').val(), 'listaCliente.htm');
	}
});

$('#clienteID').blur(function(){
	consultaNombreCliente('clienteID');
	funcionValidaCampos();
});

$('#grabarE').click(function(event){
	$('#tipoTransaccionGridE').val(catTipoTransCarta.agrega);
	funcionGrabaConsolidacion(event);
});

$('#grabar').click(function(event){
	$('#tipoTransaccion').val(catTipoTransCarta.agrega);
	funcionGrabaConsolidacion(event);
});


//------------ Validaciones de la Forma -------------------------------------

$('#formaGenerica').validate({
	rules: {
		consolidacionCartaID: {
			required: true,
		},
		solicitudCreditoID: {
			required: true,
			numeroPositivo: true
		},
		clienteID: {
			number: true,
			required: true,
		}

	},
	messages: {
		consolidacionCartaID: {
			required: 'Especifica No. consolidación',
		},
		solicitudCreditoID: {
			required: 'Especificar No. de Solicitud de Crédito.',
			numeroPositivo: 'Solo Números'
		},
		clienteID: {
			required: 'Especifica No. cliente',
			number: 'Este campo debe ser numérico'
		}
	}
});

//------------ Validaciones de Controles -------------------------------------
/**
 * Función para consultar Solicitud de Credito
 */
function consultaSolicitud(idControl) {
	var jqSolicitud = eval("'#" + idControl + "'");
	var numSolicitud = $(jqSolicitud).val();
	var conSolicitud = 1;

	var SolicitudBeanCon = {
			'solicitudCreditoID' : numSolicitud
	};

	estSolicitud = '';

	setTimeout("$('#cajaLista').hide();", 200);
	if (numSolicitud != '' && !isNaN(numSolicitud) && esTab) {
		solicitudCredServicio.consulta(conSolicitud, SolicitudBeanCon, { async : false, callback : function(solicitud) {
			if (solicitud != null) {
				estSolicitud = solicitud.estatus;
			}else{
				mensajeSis('La Solicitud de Crédito no Existe');

				$('#solicitudCreditoID').val('');
				$('#clienteID').val('');
				$('#nombreCliente').val('');
				$('#solicitudCreditoID').focus();
			}
		}
		});
	}
}

/**
* Funcion que llena las listas de cartas de liquidacion
**/

function rellenarListas (solicitudCredito){
	if(solicitudCredito != '0' && solicitudCredito != ''){
		listaCartas(1);
		listaCartasInt(2);
	}else{
		listaCartas(3);
		listaCartasInt(4);
	}
}

// Graba la consolidación
function funcionGrabaConsolidacion(event) {
	if($("#formaGenerica").valid()) {
		grabaFormaTransaccionRetrollamada(event, 'formaGenerica', 'contenedorForma', 'mensaje','true','consolidacionCartaID','funcionExito','funcionError');
	}
}

function funcionGrabaAsigInterna(event) {
		$('#solicitudID').val($('#solicitudCreditoID'));
		$('#rutaArchivosInt').val(parametroBean.rutaArchivos);
		grabaFormaTransaccionRetrollamada(event, 'formaGenerica2', 'contenedorForma', 'mensaje','true','consolidacionCartaID','funcionExito','funcionError');
}

function funcionIsNumeric(input){
	var RE = /^-{0,1}\d*\.{0,1}\d+$/;
	return (RE.test(input));
}

function funcionValidaCampos() {
	var consolidaID = $('#consolidacionCartaID').val();
	var clienteID = $('#clienteID').val();

	if(consolidaID == '0' && clienteID != '' && funcionIsNumeric(clienteID)) {
		habilitaBoton('grabar', 'submit');
	}
}

function funcionConsultaConsolidacion() {
	var consolidacionID = $('#consolidacionCartaID').val();
	var tipoConsulta = 1;

	if(consolidacionID != '' && !isNaN(consolidacionID) && esTab) {
		//Aqui deberia ir el ID del usuario para auditoria
		var asignaCartaBean = {
			'consolidacionID': consolidacionID
		}

		asignaCartaLiqServicio.consulta(tipoConsulta, asignaCartaBean,  { async : false, callback : function(asigCartaLiq) {
			if(asigCartaLiq != null) {

				$('#solicitudCreditoID').val(asigCartaLiq.solicitudCreditoID);
				$('#clienteID').val(asigCartaLiq.clienteID);
				$('#nombreCliente').val(asigCartaLiq.nombreCliente);

				$('#estatus').val(asigCartaLiq.estatus);
				$('#esConsolidado').val(asigCartaLiq.esConsolidado);
				$('#tipoCredito').val(asigCartaLiq.tipoCredito);
				$('#relacionado').val(asigCartaLiq.relacionado);
				$('#montoConsolida').val(asigCartaLiq.montoConsolida);

				//bloque para flujo de consolidacion

				rellenarListas(asigCartaLiq.solicitudCreditoID);
				if(typeof var_consolidacion !== 'undefined')
				{
					var_consolidacion.consolidaCartaID = consolidacionID;
					var_consolidacion.consolidacionCartaID = consolidacionID;
					var_consolidacion.clienteID = asigCartaLiq.clienteID;
					var_consolidacion.solicitudCreditoID = asigCartaLiq.solicitudCreditoID;
					var_consolidacion.estatus = asigCartaLiq.estatus;
					var_consolidacion.esConsolidado = asigCartaLiq.esConsolidado;
					var_consolidacion.tipoCredito = asigCartaLiq.tipoCredito;
					var_consolidacion.relacionado = asigCartaLiq.relacionado;
					var_consolidacion.montoConsolida = asigCartaLiq.montoConsolida;
					if(var_consolidacion.montoConsolida>0)
					$("#solic").show();
					else
					$("#solic").hide();
				}
				deshabilitaBoton('grabar','submit');

				if((asigCartaLiq.solicitudCreditoID) * 1 > 0){
					consultaSolicitud('solicitudCreditoID');
				}

			} else {
				mensajeSis('La consolidación capturada no existe: ' + consolidacionID);
				habilitaBoton('grabar','submit')
			}
		}});
	}
}

/**
 * Función para consultar el Cliente de la Solicitud de Credito
 */
function consultaNombreCliente(idControl) {
	var jqCliente = eval("'#" + idControl + "'");
	var numCliente = $(jqCliente).val();

	setTimeout("$('#cajaLista').hide();", 200);
	if(numCliente != '' && !isNaN(numCliente) && esTab){
		clienteServicio.consulta(1,	numCliente, { async : false, callback : function(cliente) {
			if (cliente != null) {
				$('#nombreCliente').val(cliente.nombreCompleto);

			}
			else{
				$('#nombreCliente').val("");
			}
		}
		});
	}
}

if(typeof var_consolidacion !== 'undefined')
{
	if( var_consolidacion.consolidaCartaID !== undefined)
		{
			 $('#consolidacionCartaID').val(var_consolidacion.consolidaCartaID);
			esTab = true;
			$('#consolidacionCartaID').blur();
		}
	if( var_consolidacion.solicitudCreditoID !== undefined && var_consolidacion.solicitudCreditoID !== '0')
		{
			var asignaCartaBean = {
				'solicitudCreditoID': var_consolidacion.solicitudCreditoID
			}
			asignaCartaLiqServicio.consulta(catTipoConsultaCarta.solCred, asignaCartaBean, function(asigCartaLiq) {
			if(asigCartaLiq != null) {
			$('#consolidacionCartaID').val(asigCartaLiq.consolidacionID);
			esTab = true;
			$('#consolidacionCartaID').blur();
			} else {
				mensajeSis('No existe consolidación para solicitud '+ var_consolidacion.solicitudCreditoID);
			}
		});
		}
}

}); // DOCUMENT READY FIN


/**
* Llama al función grabaFormaTransaccionRetrollamada.
* @param idControl : ID de la Tabla a grabar.
*/
function grabaDetalleCartas(idControl, event){
var solicitud =  "#solicitudCreditoID";

$("#rutaFiles").val(parametroBean.rutaArchivos);
if(validarTabla()){
	if ($("#formaGenerica").valid()) {
		if(llenarDetalle())
			if($(solicitud).val()=='' || $(solicitud).val()=='null' || $(solicitud).val()== 0 || $(solicitud).val()=='0'){
				$("#tipoTransaccion").val(3); //Indicar que se va a guardar grid externas sin solicitud
			}else{
				$("#tipoTransaccion").val(4); //Indicar que se va a guardar grid interno con solicitud
			}
			grabaFormaTransaccionRetrollamada(event, 'formaGenerica', 'contenedorForma', 'mensaje','true','consolidacionCreditoID','funcionExito','funcionError');
			$("#tipoTransaccion").val(''); //Volver a valor 0
	}else{
		event.preventDefault();
	}
}else{
	event.preventDefault();
}
}

/****
* Alta de los detalles
***/
function altaDetalleCartas(){
$('#tbParametrizacion tr').each(function(index){
	if(index>1){
		var asignacionCartaID = "#"+$(this).find("input[name^='asignacionCartaID"+"']").attr("id");
		var casaComercialID="#"+$(this).find("input[name^='casaComercialID"+"']").attr("id");
		var monto="#"+$(this).find("input[name^='monto"+"']").attr("id");
		var montoAnterior="#"+$(this).find("input[name^='montoAnterior"+"']").attr("id");
		var fechaVigencia="#"+$(this).find("input[name^='fechaVigencia"+"']").attr("id");

		var nombreCartaLiq ="#"+$(this).find("input[name^='nombreCartaLiq"+"']").attr("id");
		var recurso ="#"+$(this).find("input[name^='recurso"+"']").attr("id");
		var extension ="#"+$(this).find("input[name^='extension"+"']").attr("id");
		var comentario ="#"+$(this).find("input[name^='comentario"+"']").attr("id");
		var idCarta ="#"+$(this).find("input[name^='archivoIDCarta"+"']").attr("id");
		var modificaArchCarta ="#"+$(this).find("input[name^='modificaArchCarta"+"']").attr("id");
		var recursoFin ="#"+$(this).find("input[name^='recursoFinal"+"']").attr("id");


		var nombreComproPago ="#"+$(this).find("input[name^='nombreComproPago"+"']").attr("id");
		var recursoPago ="#"+$(this).find("input[name^='recursoPago"+"']").attr("id");
		var extensionPago ="#"+$(this).find("input[name^='extensionPago"+"']").attr("id");
		var comentarioPago ="#"+$(this).find("input[name^='comentarioPago"+"']").attr("id");
		var idPago ="#"+$(this).find("input[name^='archivoIDPago"+"']").attr("id");
		var modificaArchPago ="#"+$(this).find("input[name^='modificaArchPago"+"']").attr("id");
		var recursoFinPago ="#"+$(this).find("input[name^='recursoFinalPago"+"']").attr("id");



		var asignacionCarta = $(asignacionCartaID).val().trim();
		var casaCom = $(casaComercialID).val().trim();
		var cant = $(monto).asNumber();
		var cantAnterior = $(montoAnterior).asNumber();
		var fechaVig = $(fechaVigencia).val().trim();

		var nombreArch = $(nombreCartaLiq).val().trim();
		var recursoArch = $(recurso).val().trim();
		var extensionArch = $(extension).val().trim();
		var comentarioArch = $(comentario).val().trim();
		var archivoIDCarta = $(idCarta).val().trim();
		var modArchCarta = $(modificaArchCarta).val().trim();
		var recursoFinArch = $(recursoFin).val().trim();


		var nombreArchPago = $(nombreComproPago).val().trim();
		var recursoArchPago = $(recursoPago).val().trim();
		var extensionArchPago = $(extensionPago).val().trim();
		var comentarioArchPago = $(comentarioPago).val().trim();
		var archivoIDPago = $(idPago).val().trim();
		var modArchPago = $(modificaArchPago).val().trim();
		var recursoFinArchPago = $(recursoFinPago).val().trim();


		if(nombreArchPago == null || nombreArchPago == undefined || nombreArchPago == ""){
			nombreArchPago = " ";
			recursoArchPago = " ";
			extensionArchPago = " ";
			comentarioArchPago = " ";
			modArchPago = " ";
			recursoFinArchPago = " ";
		}


		if (index == 1) {
			$(idDetalle).val( $(idDetalle).val()+
			 asignacionCarta+']'+ casaCom+']'+ cant+']' + cantAnterior+']' + fechaVig+']'+ nombreArch+']'+ recursoArch+']'+ extensionArch+']'+ comentarioArch+']'
			 + archivoIDCarta+']'  + modArchCarta+']' + nombreArchPago+']'+ recursoArchPago+']'+ extensionArchPago+']'+ comentarioArchPago+']' + archivoIDPago+']'  + modArchPago+']' + recursoFinArch+']' + recursoFinArchPago+']' );
		} else{
			$(idDetalle).val( $(idDetalle).val()+'['+
			+ asignacionCarta+']'+ casaCom+']'+ cant+']' + cantAnterior+']' + fechaVig+']'+ nombreArch+']'+ recursoArch+']'+ extensionArch+']'+ comentarioArch+']'
			 + archivoIDCarta+']' + modArchCarta+']' + nombreArchPago+']'+ recursoArchPago+']'+ extensionArchPago+']'+ comentarioArchPago+']' + archivoIDPago+']'  + modArchPago+']' + recursoFinArch+']' + recursoFinArchPago+']');
		}

	}
});
}

/**
* Función para listar las Cartas Externas de Liquidacion
*  @tipoLista : Parametro para deteminar el tipo de lista a deplegar
*/
function listaCartas(tipoLista){
$("#gridCartaLiq").html("");
$("#consolidacionCartaID").val()
//TipoCarta
var cartaBean = {
	'tipoLista'				: tipoLista,
	'consolidacionCartaID'	: $('#consolidacionCartaID').val(),
	'solicitudCreditoID'	: $('#solicitudCreditoID').val(),
	'recurso'				: parametroBean.rutaArchivos
};


$.post("asignaCartaLiqGrid.htm", cartaBean, function(data) {
	if (data.length > 0 ) {
		bloquearPantallaCarga();
		$("#gridCartaLiq").html(data);
		$("#gridCartaLiq").show();
		agregaFormatoControles('formaGenerica');
		if($('#tbParametrizacion tr').length>2)	{
			if(($('#solicitudCreditoID').val()) * 1 > 0){
				if(!listaEstatus.includes(estSolicitud)){
					deshabilitaBoton('grabarE', 'submit');
					deshabilitaBoton('btnAgregarE', 'submit');
					$('input[name=eliminar]').each(function() {
						var jqCicInf = eval("'#" + this.id + "'");
						$(jqCicInf).remove();
					});
					$('input[name=agrega]').each(function() {
						var jqCicInf = eval("'#" + this.id + "'");
						$(jqCicInf).remove();
					});
				}else{
					habilitaBoton('grabarE', 'submit');
				}
			}else{
				habilitaBoton('grabarE', 'submit');
			}
		}else{
			deshabilitaBoton('grabarE', 'submit');
			if(($('#solicitudCreditoID').val()) * 1 > 0){
				if(!listaEstatus.includes(estSolicitud)){
					deshabilitaBoton('btnAgregarE', 'submit');
				}else{
					habilitaBoton('btnAgregarE', 'submit');
				}
			}
		}

//		deshabilitaBoton('graba', 'submit')
		$('#contenedorForma').unblock(); // desbloquear
	} else {
		$("#numTab").val(3);
		$("#gridCartaLiq").html("");
		$("#gridCartaLiq").show();
		deshabilitaBoton('grabarE', 'submit')
		if(($('#solicitudCreditoID').val()) * 1 > 0){
			if(!listaEstatus.includes(estSolicitud)){
				deshabilitaBoton('btnAgregarE', 'submit');
			}else{
				habilitaBoton('btnAgregarE', 'submit');
			}
		}
	}
});
}

/**
* Función para listar las Cartas Internas
* @tipoLista : Parametro para deteminar el tipo de lista a deplegar
*/
function listaCartasInt(tipoLista){
$("#gridCartaLiqInt").html("");

//TipoCarta
var cartaBean = {
	'tipoLista'				: tipoLista,
	'consolidacionCartaID'	: $('#consolidacionCartaID').val(),
	'solicitudCreditoID'	: $('#solicitudCreditoID').val(),
	'recurso'				: parametroBean.rutaArchivos
};

$.post("asignaCartaLiqGrid.htm", cartaBean, function(data) {
	if (data.length > 0 ) {
		bloquearPantallaCarga();

		$("#gridCartaLiqInt").html(data);
		$("#gridCartaLiqInt").show();
		agregaFormatoControles('formaGenerica2');
		$('#contenedorForma').unblock(); // desbloquear
		if($('#tbParametrizacion2 tr').length>2){
			if(($('#solicitudCreditoID').val()) * 1 > 0){
				if(!listaEstatus.includes(estSolicitud)){
					deshabilitaBoton('grabarInt', 'submit');
					deshabilitaBoton('btnAgregarI', 'submit');
					$('input[name=eliminar]').each(function() {
						var jqCicInf = eval("'#" + this.id + "'");
						$(jqCicInf).remove();
					});
					$('input[name=agrega]').each(function() {
						var jqCicInf = eval("'#" + this.id + "'");
						$(jqCicInf).remove();
					});
				}else{
					habilitaBoton('grabarInt', 'submit');
				}
			}else{
				habilitaBoton('grabarInt', 'submit');
			}
		}else{
			deshabilitaBoton('grabarInt', 'submit');

			if(($('#solicitudCreditoID').val()) * 1 > 0){
				if(!listaEstatus.includes(estSolicitud)){
					deshabilitaBoton('btnAgregarI', 'submit');
				}else{
					habilitaBoton('btnAgregarI', 'submit');
				}
			}
		}
	} else {
		$("#numTab").val(3);
		$("#gridCartaLiqInt").html("");
		$("#gridCartaLiqInt").show();
		deshabilitaBoton('grabarInt', 'submit');
		if(($('#solicitudCreditoID').val()) * 1 > 0){
			if(!listaEstatus.includes(estSolicitud)){
				deshabilitaBoton('btnAgregarI', 'submit');
			}else{
				habilitaBoton('btnAgregarI', 'submit');
			}
		}
	}
});
}

function agregarDetalle(){
reasignaTabIndex();
if(validarTabla()){
	var numTab=$("#numTab").asNumber();

	var numeroFila=parseInt(getRenglones('tbParametrizacion'));
	numTab++;
	numeroFila++;
	var nuevaFila=
	"<tr id=\"tr"+numeroFila+"\" name=\"tr"+"\">"+
		"<td nowrap=\"nowrap\">"+
			"<input type=\"hidden\" id=\"asignacionCartaID"+numeroFila+"\" tabindex=\""+(numTab)+"\" name=\"asignacionCartaID"+"\" size=\"5\" disabled=\"disabled\" value=\""+(numeroFila)+"\" />"+
			"<input type=\"text\" id=\"casaComercialID"+numeroFila+"\" tabindex=\""+(numTab)+"\" name=\"casaComercialID"+"\" size=\"5\" maxlength=\"10\" onBlur='consultaCasa(\""+numeroFila+"\");' onkeypress='listaCasa(this.id)'/>"+
			"<input type=\"text\" id=\"nombreCasa"+numeroFila+"\" tabindex=\""+(numTab)+"\" name=\"nombreCasa"+"\" size=\"22\" maxlength=\"100\" readonly='readonly' disabled=\"disabled\"/>"+
			"<input type=\"hidden\" id=\"estatus"+numeroFila+"\" tabindex=\""+(numTab)+"\" name=\"estatus"+"\" size=\"5\" disabled=\"disabled\"/>"+
		"</td><td></td>"+
		"<td>"+
			"<input type=\"text\" id=\"monto"+numeroFila+"\" tabindex=\""+(numTab)+"\" name=\"monto"+"\" size=\"15\" maxlength=\"10\" style='text-align: right;' esMoneda='true' onBlur='validaMontoAsignado(this.id,"+(numeroFila)+" )'/>"+
			"<input type=\"hidden\" id=\"montoAnterior"+numeroFila+"\" tabindex=\""+(numTab)+"\" name=\"montoAnterior"+"\" size=\"15\" style='text-align: right;' esMoneda='true'/>"+
		"</td><td></td>"+
		"<td nowrap=\"nowrap\">"+
			"<input type=\"text\" id=\"fechaVigencia"+numeroFila+"\" tabindex=\""+(numTab)+"\" name=\"fechaVigencia"+"\" size=\"15\"  autocomplete='off' onchange='validaFecha(this.id)'  esCalendario='true'/>"+
		"</td>"+
		"<td nowrap=\"nowrap\">"+
			"<input type=\"button\" id=\"cartaLiq"+numeroFila+"\"name=\"cartaLiq"+"\" value=\"Adjuntar\" class=\"submit\" tabindex=\""+(numTab)+"\" onclick=\"subirArchivos('cartaLiq',"+(numeroFila)+",'1')\"  />"+
			"<input type=\"text\" id=\"nombreCartaLiq"+numeroFila+"\" tabindex=\""+(numTab)+"\" name=\"nombreCartaLiq"+"\" size=\"30\" readonly='readonly' disabled=\"disabled\"/>"+
			"<input type=\"hidden\" id=\"recurso"+numeroFila+"\" tabindex=\""+(numTab)+"\" name=\"recurso"+"\" size=\"22\" readonly='readonly' disabled=\"disabled\"/>"+
			"<input type=\"hidden\" id=\"extension"+numeroFila+"\" tabindex=\""+(numTab)+"\" name=\"extension"+"\" size=\"22\" readonly='readonly' disabled=\"disabled\"/>"+
			"<input type=\"hidden\" id=\"comentario"+numeroFila+"\" tabindex=\""+(numTab)+"\" name=\"comentario"+"\" size=\"22\" readonly='readonly' disabled=\"disabled\"/>"+
			"<input type=\"hidden\" id=\"archivoIDCarta"+numeroFila+"\" tabindex=\""+(numTab)+"\" name=\"archivoIDCarta"+"\" size=\"22\" readonly='readonly' disabled=\"disabled\"/>"+
			"<input type=\"hidden\" id=\"modificaArchCarta"+numeroFila+"\" tabindex=\""+(numTab)+"\" name=\"modificaArchCarta"+"\" size=\"22\" readonly='readonly' disabled=\"disabled\"/>"+
			"<input type=\"hidden\" id=\"recursoFinal"+numeroFila+"\" tabindex=\""+(numTab)+"\" name=\"recursoFinal"+"\" size=\"22\" readonly='readonly' disabled=\"disabled\"/>"+

		"</td>"+
		"<td nowrap=\"nowrap\">"+
			"<input type=\"button\" id=\"comproPago"+numeroFila+"\"name=\"comproPago"+"\" value=\"Adjuntar\" class=\"submit\" tabindex=\""+(numTab)+"\" onclick=\"subirArchivos('comproPago',"+(numeroFila)+",'2')\"/> "+
			"<input type=\"text\" id=\"nombreComproPago"+numeroFila+"\" tabindex=\""+(numTab)+"\" name=\"nombreComproPago"+"\" size=\"22\" readonly='readonly' disabled=\"disabled\"/>"+
			"<input type=\"hidden\" id=\"recursoPago"+numeroFila+"\" tabindex=\""+(numTab)+"\" name=\"recursoPago"+"\" size=\"22\" readonly='readonly' disabled=\"disabled\"/>"+
			"<input type=\"hidden\" id=\"extensionPago"+numeroFila+"\" tabindex=\""+(numTab)+"\" name=\"extensionPago"+"\" size=\"22\" readonly='readonly' disabled=\"disabled\"/>"+
			"<input type=\"hidden\" id=\"comentarioPago"+numeroFila+"\" tabindex=\""+(numTab)+"\" name=\"comentarioPago"+"\" size=\"22\" readonly='readonly' disabled=\"disabled\"/>"+
			"<input type=\"hidden\" id=\"archivoIDPago"+numeroFila+"\" tabindex=\""+(numTab)+"\" name=\"archivoIDPago"+"\" size=\"22\" readonly='readonly' disabled=\"disabled\"/>"+
			"<input type=\"hidden\" id=\"modificaArchPago"+numeroFila+"\" tabindex=\""+(numTab)+"\" name=\"modificaArchPago"+"\" size=\"22\" readonly='readonly' disabled=\"disabled\"/>"+
			"<input type=\"hidden\" id=\"recursoFinalPago"+numeroFila+"\" tabindex=\""+(numTab)+"\" name=\"recursoFinalPago"+"\" size=\"22\" readonly='readonly' disabled=\"disabled\"/>"+
		"</td>"+
		"<td nowrap=\"nowrap\">"+
			"<input type=\"button\" id=\"eliminar"+numeroFila+"\"name=\"eliminar"+"\" value=\"\" class=\"btnElimina\" onclick=\"eliminarParam('tr"+numeroFila+"')\" tabindex=\""+(numTab)+"\"/> "+
			"<input type=\"button\" id=\"agrega"+numeroFila+"\" name=\"agrega"+"\" value=\"\" class=\"btnAgrega\" onclick=\"agregarDetalle(this.id)\" tabindex=\""+(numTab)+"\"/>"+
		"</td>"+
	"</tr>";
	$('#tbParametrizacion').append(nuevaFila);
	$("#numTab").val(numTab);
	$("#numeroFila").val(numeroFila);
	$('#fechaVigencia'+numeroFila).val(parametroBean.fechaSucursal);
	agregaFormatoControles('formaGenerica');
	habilitaBoton('grabarE', 'submit');
}
habilitaGrabar();
var numeroFila=parseInt(getRenglones('tbParametrizacion'));
$("#casaComercialID"+numeroFila).focus();
}

function agregarDetalleInterna(){
reasignaTabIndex();
if(validarTabla()){
	var numTab=$("#numTab").asNumber();

	var numeroFila=parseInt(getRenglones('tbParametrizacion2'));
	numTab++;
	numeroFila++;
	var nuevaFila=
				"<tr id=\"trInt"+numeroFila+"\">"+
					"<td>"+
						"<input type=\"text\" id=\"creditoIDInt"+numeroFila+"\" tabindex=\"<%=counter %>\" name=\"creditoID\" "+
						"size=\"20\" value=\"\" maxlength=\"10\" "+ "onblur=\"funcionConsultaCartaInt("+numeroFila+",event)\" "+
						"onkeypress=\"funcionListaCredito(this.id)\" onkeypress=\"return validaNumero(event)\"  onkeydown=\"funcionValidaTab(event)\"/>"+
					"</td>"+
					"<td></td>"+
					"<td nowrap=\"nowrap\">"+
						"<input type=\"text\" id=\"fechaVigenciaInt"+numeroFila+"\"  readonly=\"true\" tabindex=\"<%=counter %>\" name=\"fechaVigencia\" "+
						"size=\"15\" value=\"\" autocomplete=\"off\"  onchange=\"validaFecha(this.id)\" "+
						"/>"+
					"</td>"+
					"<td></td>"+
					"<td>"+
						"<input type=\"text\" id=\"montoInt"+numeroFila+"\"  readonly=\"true\" tabindex=\"<%=counter %>\" name=\"monto\" path=\"monto\" "+
						"size=\"15\" value=\"\" style=\"text-align:"+ "right;\" "+
						"onblur=\"validaMontoAsignado(this.id,<%=numFilas %>)\" esMoneda=\"true\"/>"+
					"</td>"+
					"<td nowrap=\"nowrap\">"+
						"<img src=\"images/continuar.png\" id=\"descargar"+numeroFila+"\" name=\"descargar\" value=\"\" class=\"btnDescarga\" "+
						"onClick=\"funcionVisualizaCarta("+numeroFila+")\""+ "tabindex=\"<%=counter %>\"/>"+
						"<input type=\"hidden\" id=\"recursoInt"+numeroFila+"\" name=\"recurso\" value=\"\"/>"+
						"<input type=\"hidden\" id=\"recursoPathInt"+numeroFila+"\" name=\"recursoPath\" value=\"\"/>"+
						"<input type=\"hidden\" id=\"archivoCredIDInt"+numeroFila+"\" name=\"archivoIDCarta\" value=\"\"/>"+
						"<input type=\"hidden\" id=\"cartaLiquidaIDInt"+numeroFila+"\" name=\"cartaLiquidaID\" value=\"\"/>"+
						"<input type=\"button\" id=\"eliminar"+numeroFila+"\" name=\"eliminar\" value=\"\" class=\"btnElimina\" "+
						"onclick=\"eliminarParamInt('trInt"+numeroFila+"')\""+ "tabindex=\"<%=counter %>\"/>"+
						"<input type=\"button\" id=\"agrega"+numeroFila+"\" name=\"agrega\" value=\"\" class=\"btnAgrega\" "+
						"onclick=\"agregarDetalleInterna()\" tabindex=\"<%=counter %>\"/>"+
					"</td>"+
				"</tr>";
	$('#tbParametrizacion2').append(nuevaFila);
	$("#numTab").val(numTab);
	$("#numeroFila").val(numeroFila);
	$('#fechaVigenciaInt'+numeroFila).val();
	agregaFormatoControles('formaGenerica2');
	habilitaBoton('grabarInt', 'submit');
}
habilitaGrabar();
var numeroFila=parseInt(getRenglones('tbParametrizacion2'));
$("#casaComercialID"+numeroFila).focus();
}

function funcionValidaTab(e)
{
	if (e.which == 9 && !e.shiftKey){
		esTab= true;
	}
}
/**
* Remueve de la tabla un tr.
* @param id : ID del tr.
*/
function eliminarParam(id){
	$('#'+id).remove();
	reasignaTabIndex();
	ordenaControles();
	habilitaGrabar();
}

function eliminarParamInt(id){
	$('#'+id).remove();
	reasignaTabIndex();
	ordenaControles();
	habilitaGrabar();
}

function funcionConsultaCartaInt(rowID, event)
{
	if(!esTab)
		return false;
	if(esTab && $('#creditoIDInt'+rowID).val().length==0)
		{
			mensajeSis("El credito está vacío");
			$('#creditoIDInt'+rowID).focus();
			esTab = false;
			return false;
		}

	if($('#creditoIDInt'+rowID).val().indexOf('%') == 0){
		return;
	}
	var beanEntrada = {
		'creditoID': $('#creditoIDInt'+rowID).val(),
		'clienteID': $('#clienteID').val()
	};
	setTimeout("$('#cajaLista').hide();", 200);
	cartaLiquidacionServicio.consulta(beanEntrada,4,function(resultado) {
		if (resultado != null) {
		 $('#fechaVigenciaInt'+rowID).val(resultado.fechaVencimiento);
		 //$('#montoInt'+rowID).val(resultado.montoOriginal);
				var cartaLiquidacionBean = {
					'creditoID': $('#creditoIDInt'+rowID).val()
				}
				 cartaLiquidacionServicio.consulta(cartaLiquidacionBean,2, function(cartaLiq) {
				if(cartaLiq != null) {
					recurso = cartaLiq.recurso;
					$('#recursoInt'+rowID).val(recurso);
					$('#recursoPathInt'+rowID).val(parametroBean.rutaArchivos +recurso);
					//convertToBase64(parametroBean.rutaArchivos + recurso,$('#recursoB64'+rowID));
					$('#archivoCredIDInt'+rowID).val(cartaLiq.archivoIdCarta);
					$('#cartaLiquidaIDInt'+rowID).val(resultado.cartaLiquidaID);
					cartaLiquidacionServicio.consulta(cartaLiquidacionBean,3, function(cartaLiq) {
						if(cartaLiq != null) {
							$('#montoInt'+rowID).val(cartaLiq.montoProyectado);
							if(cartaLiq.montoProyectado==0)
							{
								mensajeSis("Monto de carta de liquidación es 0</b>");
								$('#creditoIDInt'+rowID).focus();
							}
							else
							{
								agregaFormatoControles('formaGenerica2');
							}
						}
						else
						{
							mensajeSis("No existe monto proyectado de carta de liquidación</b>");
							$('#creditoIDInt'+rowID).focus();
						}
					});
				}
				else
				{
					mensajeSis("No existe archivo de carta de liquidación</b>");
					$('#creditoIDInt'+rowID).focus();
				}
			});
		} else {
			mensajeSis("No existe carta de liquidación</b>");
			$('#creditoIDInt'+rowID).focus();
		}
	});
	esTab = false;
}

function funcionVisualizaCarta(rowID)
{
	var tipoConsulta = 2;
	var creditoID = $('#creditoIDInt'+rowID).val();
	var tipoDocumento = 9995;
	var recurso = "";
	var archivoCredID;
	var parametros = "";
	var pagina = "";
	recurso = $('#recursoInt'+rowID).val();
	archivoCredID = $('#archivoCredIDInt'+rowID).val();
	parametros = "?creditoID="+creditoID+"&tipoDocumentoID="+
	tipoDocumento+"&recurso="+recurso+"&archivoCreditoID="+archivoCredID;
	pagina = "creditoVerArchivos.htm" + parametros;
	window.open(pagina, '_blank');
}

function funcionListaCredito(controlID)
{
var camposLista = ['creditoID', 'clienteID'];
var parametrosLista = [$('#creditoID').val(), $('#clienteID').val()];
lista(controlID, '2', '60', camposLista, parametrosLista, 'ListaCredito.htm');
}

function convertToBase64(path,elem){
if(path.length > 0) {
	var request = new XMLHttpRequest();
	request.open('GET', path, true);
	request.responseType = 'blob';
	request.onload = function() {
		var reader = new FileReader();
		reader.readAsDataURL(request.response);
		reader.onload =  function(e){
		elem.val(e.target.result);
		};
	};
	request.send();
}
}

function funcionOnSubmit(){
	$('#tipoTransaccionInt').val(catTipoTransCarta.agrega);
	if($('#solicitudCreditoID').val() == '' || $('#solicitudCreditoID').val() == 'null' || $('#solicitudCreditoID').val() == '0')
	$('#solicitudID').val('0');
	else
	$('#solicitudID').val($('#solicitudCreditoID').val());
	$('#consolidaID').val($('#consolidacionCartaID').val());
	$('#rutaArchivosInt').val(parametroBean.rutaArchivos);
	if(validaDetalleInt())
	{
		llenarDetalleInt();
		grabaFormaTransaccionRetrollamada(event, 'formaGenerica2', 'contenedorForma', 'mensaje','true','consolidacionCartaID','funcionExito','funcionError');
	}
}



/**
* Valida los campos de la tabla que no vengan nulos o vacios para poder agregar un nuevo registro
* @param idControl : ID de la tabla a validar.
* @returns {Boolean}
*/
function validarTabla(){
	var validar = true;

	$('#tbParametrizacion tr').each(function(index){
		if(index>1){
			var asignacionCartaID = "#"+$(this).find("input[name^='asignacionCartaID"+"']").attr("id");
			var casaComercialID="#"+$(this).find("input[name^='casaComercialID"+"']").attr("id");
			var monto="#"+$(this).find("input[name^='monto"+"']").attr("id");
			var fechaVigencia ="#"+$(this).find("input[name^='fechaVigencia"+"']").attr("id");
			var archCartaLiq ="#"+$(this).find("input[name^='nombreCartaLiq"+"']").attr("id");
			var btnArcCarta ="#"+$(this).find("input[name^='cartaLiq"+"']").attr("id");

			var asignacionCarta = $(asignacionCartaID).asNumber();
			var casaCom = $(casaComercialID).val().trim();
			var cant = $(monto).asNumber();
			var fechaVig = $(fechaVigencia).val().trim();
			var archCarta = $(archCartaLiq).val().trim();

			if(asignacionCarta==='') {
				agregarFormaError(asignacionCartaID);
				validar=false;
			}

			if(casaCom==='') {
				agregarFormaError(casaComercialID);
				validar=false;
			}

			if(cant===0) {
				agregarFormaError(monto);
				validar=false;
			}

			if(fechaVig==='') {
				agregarFormaError(fechaVigencia);
				validar=false;
			}

			if(archCarta==='') {
				agregarFormaError(btnArcCarta);
				validar=false;
			}
		}
	});
	return validar;
}


/**
* Función arma la cadena con los detalles del grid dependiendo del tipo de catálogo.
* @returns {Boolean}
*/
function llenarDetalle(){
var idDetalle = '#detalleCartas';
$(idDetalle).val('');
$('#tbParametrizacion tr').each(function(index){
	if(index>1){
		var asignacionCartaID = "#"+$(this).find("input[name^='asignacionCartaID"+"']").attr("id");
		var casaComercialID="#"+$(this).find("input[name^='casaComercialID"+"']").attr("id");
		var monto="#"+$(this).find("input[name^='monto"+"']").attr("id");
		var montoAnterior="#"+$(this).find("input[name^='montoAnterior"+"']").attr("id");
		var fechaVigencia="#"+$(this).find("input[name^='fechaVigencia"+"']").attr("id");

		var nombreCartaLiq ="#"+$(this).find("input[name^='nombreCartaLiq"+"']").attr("id");
		var recurso ="#"+$(this).find("input[name^='recurso"+"']").attr("id");
		var extension ="#"+$(this).find("input[name^='extension"+"']").attr("id");
		var comentario ="#"+$(this).find("input[name^='comentario"+"']").attr("id");
		var idCarta ="#"+$(this).find("input[name^='archivoIDCarta"+"']").attr("id");
		var modificaArchCarta ="#"+$(this).find("input[name^='modificaArchCarta"+"']").attr("id");
		var recursoFin ="#"+$(this).find("input[name^='recursoFinal"+"']").attr("id");


		var nombreComproPago ="#"+$(this).find("input[name^='nombreComproPago"+"']").attr("id");
		var recursoPago ="#"+$(this).find("input[name^='recursoPago"+"']").attr("id");
		var extensionPago ="#"+$(this).find("input[name^='extensionPago"+"']").attr("id");
		var comentarioPago ="#"+$(this).find("input[name^='comentarioPago"+"']").attr("id");
		var idPago ="#"+$(this).find("input[name^='archivoIDPago"+"']").attr("id");
		var modificaArchPago ="#"+$(this).find("input[name^='modificaArchPago"+"']").attr("id");
		var recursoFinPago ="#"+$(this).find("input[name^='recursoFinalPago"+"']").attr("id");



		var asignacionCarta = $(asignacionCartaID).val().trim();
		var casaCom = $(casaComercialID).val().trim();
		var cant = $(monto).asNumber();
		var cantAnterior = $(montoAnterior).asNumber();
		var fechaVig = $(fechaVigencia).val().trim();

		var nombreArch = $(nombreCartaLiq).val().trim();
		var recursoArch = $(recurso).val().trim();
		var extensionArch = $(extension).val().trim();
		var comentarioArch = $(comentario).val().trim();
		var archivoIDCarta = $(idCarta).val().trim();
		var modArchCarta = $(modificaArchCarta).val().trim();
		var recursoFinArch = $(recursoFin).val().trim();


		var nombreArchPago = $(nombreComproPago).val().trim();
		var recursoArchPago = $(recursoPago).val().trim();
		var extensionArchPago = $(extensionPago).val().trim();
		var comentarioArchPago = $(comentarioPago).val().trim();
		var archivoIDPago = $(idPago).val().trim();
		var modArchPago = $(modificaArchPago).val().trim();
		var recursoFinArchPago = $(recursoFinPago).val().trim();


		if(nombreArchPago == null || nombreArchPago == undefined || nombreArchPago == ""){
			nombreArchPago = " ";
			recursoArchPago = " ";
			extensionArchPago = " ";
			comentarioArchPago = " ";
			modArchPago = " ";
			recursoFinArchPago = " ";
		}


		if (index == 1) {
			$(idDetalle).val( $(idDetalle).val()+
			 asignacionCarta+']'+ casaCom+']'+ cant+']' + cantAnterior+']' + fechaVig+']'+ nombreArch+']'+ recursoArch+']'+ extensionArch+']'+ comentarioArch+']'
			 + archivoIDCarta+']'  + modArchCarta+']' + nombreArchPago+']'+ recursoArchPago+']'+ extensionArchPago+']'+ comentarioArchPago+']' + archivoIDPago+']'  + modArchPago+']' + recursoFinArch+']' + recursoFinArchPago+']' );
		} else{
			$(idDetalle).val( $(idDetalle).val()+'['+
			+ asignacionCarta+']'+ casaCom+']'+ cant+']' + cantAnterior+']' + fechaVig+']'+ nombreArch+']'+ recursoArch+']'+ extensionArch+']'+ comentarioArch+']'
			 + archivoIDCarta+']' + modArchCarta+']' + nombreArchPago+']'+ recursoArchPago+']'+ extensionArchPago+']'+ comentarioArchPago+']' + archivoIDPago+']'  + modArchPago+']' + recursoFinArch+']' + recursoFinArchPago+']');
		}

	}
});

return true;
}

function validaDetalleInt()
{
	var validar = true;
	var creditoControl = null;
	//if($('#tbParametrizacion2 tr').length==2)
	//return false;
		$('#tbParametrizacion2 tr').each(function(index){
			if(index>1)
			{
				var cartaLiquidaID = $(this).find("input[name^='cartaLiquidaID"+"']").val().trim();
				var creditoID = $(this).find("input[name^='creditoID"+"']").val().trim();

					if(cartaLiquidaID==="")
					{
						creditoControl = $(this).find("input[name^='creditoID"+"']");
						validar =  false;
						agregarFormaError(creditoControl);
					}
			}
		});

		return validar;
}

function llenarDetalleInt(){
var idDetalle = '#datosGridInt';
$(idDetalle).val('');
$('#tbParametrizacion2 tr').each(function(index){
	if(index>1){
		var cartaLiquidaID = $(this).find("input[name^='cartaLiquidaID"+"']").val().trim();
		var creditoID = $(this).find("input[name^='creditoID"+"']").val().trim();
		var fechaVigencia = $(this).find("input[name^='fechaVigencia"+"']").val().trim();
		var monto = $(this).find("input[name^='monto"+"']").val().trim();
		var recurso = $(this).find("input[name^='recurso"+"']").val().trim();
		var recursoPath = $(this).find("input[name^='recursoPath"+"']").val().trim();
		var archivoCredID  = $(this).find("input[name^='archivoIDCarta"+"']").val().trim();


		if (index == 1) {
			$(idDetalle).val( $(idDetalle).val()+
			 cartaLiquidaID+']'+ creditoID+']'+ fechaVigencia+']' + monto+']' +
			 recurso+']'+recursoPath+']');
		} else{
			$(idDetalle).val( $(idDetalle).val()+'['+
			 cartaLiquidaID+']'+ creditoID+']'+ fechaVigencia+']' + monto+']' +
			 recurso+']'+recursoPath+']');
		}
	}
});

return true;
}


/**
* Funcion para Listar las Casas Comerciales
* @param id : ID del input que genera el evento.
*/
function listaCasa(idControl){
var camposLista = new Array();
var parametrosLista = new Array();
camposLista[0] = "nombreCasa";
parametrosLista[0] = document.getElementById(idControl).value;
lista(idControl, '1', '2', camposLista,  parametrosLista, 'listaCasaComercial.htm');

}

/**
* Funcion para Consultar la Casa Comercial
* @param id : Num de Fila en la que se Consultara la Casa
*/
function consultaCasa(numControl){
	var casaID = $('#casaComercialID'+numControl).val();
	setTimeout("$('#cajaLista').hide();", 200);
	if(casaID != '' && !isNaN(casaID)){
		var tipoCasaBeanCon = {
				'casaID':$('#casaComercialID'+numControl).val()
		};
		casasComercialesServicio.consulta(1,tipoCasaBeanCon,{ async : false, callback : function(casa) {
			if(casa!=null ){
				if(casa.estatus == 'A'){
				$('#nombreCasa'+numControl).val(casa.nombreCasa);
				}else{
					$('#casaComercialID'+numControl).val('');
					$('#nombreCasa'+numControl).val('');
					$('#casaComercialID'+numControl).focus();
					$('#casaComercialID'+numControl).select();
					mensajeSis('La Casa Comercial no esta Activa');
				}
			}else{
				$('#casaComercialID'+numControl).val('');
				$('#nombreCasa'+numControl).val('');
				$('#casaComercialID'+numControl).focus();
				$('#casaComercialID'+numControl).select();
				mensajeSis('No Existe la Casa Comercial');
			}
		}
		});
	}
}

/**
*Funcion para consultar credito
*@param numControl : Parametro para el row donde se esta haciendo la consulta
*/
function consultaCreditoRow(){
if(!seRepiteCredito(numControl)){
	var creditoID = $('#creditolID'+numControl).val();

	setTimeout("$('#cajaLista').hide();", 200);

	if(creditoID != '' && !isNaN(creditoID)){
		var creditoLiq = {
				'creditoID':$('#creditolID'+numControl).val()
		};

		casasComercialesServicio.consulta(1,tipoCasaBeanCon,{ async : false, callback : function(casa) {
			if(casa!=null ){
				if(casa.estatus == 'A'){
				$('#nombreCasa'+numControl).val(casa.nombreCasa);
				}else{
					$('#casaComercialID'+numControl).val('');
					$('#nombreCasa'+numControl).val('');
					$('#casaComercialID'+numControl).focus();
					$('#casaComercialID'+numControl).select();
					mensajeSis('La Casa Comercial no esta Activa');
				}
			}else{
				$('#casaComercialID'+numControl).val('');
				$('#nombreCasa'+numControl).val('');
				$('#casaComercialID'+numControl).focus();
				$('#casaComercialID'+numControl).select();
				mensajeSis('No Existe la Casa Comercial');
			}
		}
		});
	}
}else{
	$('#creditolID'+numControl).val('').focus();
	$('#fechaVigenciaI'+numControl).val('');
	$('#montoI'+numControl).val('');
	$("#descargar"+numControl).val('');

	mensajeSis("El folio del crédito ya esta asignado");
}
}

/**
* Funcion para valdiar si se repite una Casa Comercial
* @param id : Num de Fila en la que se Consultara la Casa
* @returns Boolean
*/
function seRepite(numControl){
var serepite = 0;
var valor=$('#casaComercialID'+numControl).val();

$('input[name=casaComercialID]').each(function() {
	var valor2=$('#'+this.id).val();
	if (('casaComercialID'+numControl)!=this.id && (valor2!=undefined && valor2!='') && valor == valor2) {
		serepite++;
		return false;
	}
});

if(serepite>0){
	return true;
}
return false;
}


/**
* Funcion para valdiar si se repite una credito
* @param id : Num de Fila en la que se Consultara el credito
* @returns Boolean
*/
function seRepiteCredito(numControl){
var serepite = 0;
var valor=$('#creditolID'+numControl).val();

$('input[name=creditolID]').each(function() {
	var valor2=$('#'+this.id).val();
	if (('creditolID'+numControl)!=this.id && (valor2!=undefined && valor2!='') && valor == valor2) {
		serepite++;
		return false;
	}
});

if(serepite>0){
	return true;
}
return false;
}

/**
* Cancela las teclas [ ] en el formulario
* @param e
* @returns {Boolean}
*/
document.onkeypress = pulsarCorchete;

function pulsarCorchete(e) {
tecla = (document.all) ? e.keyCode : e.which;
if (tecla == 91 || tecla == 93) {
	return false;
}
return true;
}


/**
* Regresa el número de renglones de un grid.
* @param idTablaParametrizacion : ID de la tabla a la que se va a contar el número de renglones.
* @returns Número de renglones de la tabla.
*/
function getRenglones(idTablaParametrizacion){
var numRenglones = $('#'+idTablaParametrizacion+' >tbody >tr').length;
return numRenglones;
}


/**
* Reasigna/actualiza el número de tabindex de los inputs que se encuentran dentro de la tabla.
*/
function reasignaTabIndex(){
var numInicioTabs = 2;
var idTab = '';
	idTab = 'numTab';
$('#tbParametrizacion tr').each(function(index){
	if(index>1){
		var asignacionCartaID = "#"+$(this).find("input[name^='asignacionCartaID"+"']").attr("id");
		var casaComercialID="#"+$(this).find("input[name^='casaComercialID"+"']").attr("id");
		var nombreCasa="#"+$(this).find("input[name^='nombreCasa"+"']").attr("id");
		var estatus ="#"+$(this).find("input[name^='estatus"+"']").attr("id");
		var monto="#"+$(this).find("input[name^='monto"+"']").attr("id");
		var fechaVigencia ="#"+$(this).find("input[name^='fechaVigencia"+"']").attr("id");

		var nombreCartaLiq ="#"+$(this).find("input[name^='nombreCartaLiq"+"']").attr("id");
		var recurso ="#"+$(this).find("input[name^='recurso"+"']").attr("id");
		var extension ="#"+$(this).find("input[name^='extension"+"']").attr("id");
		var comentario ="#"+$(this).find("input[name^='comentario"+"']").attr("id");
		var archivoIDCarta ="#"+$(this).find("input[name^='archivoIDCarta"+"']").attr("id");
		var modArchCarta ="#"+$(this).find("input[name^='modificaArchCarta"+"']").attr("id");
		var recursoFinal ="#"+$(this).find("input[name^='recursoFinal"+"']").attr("id");

		var nombreComproPago ="#"+$(this).find("input[name^='nombreComproPago"+"']").attr("id");
		var recursoPago ="#"+$(this).find("input[name^='recursoPago"+"']").attr("id");
		var extensionPago ="#"+$(this).find("input[name^='extensionPago"+"']").attr("id");
		var comentarioPago ="#"+$(this).find("input[name^='comentarioPago"+"']").attr("id");
		var archivoIDPago ="#"+$(this).find("input[name^='archivoIDPago"+"']").attr("id");
		var modArchPago ="#"+$(this).find("input[name^='modificaArchPago"+"']").attr("id");
		var recursoFinalPago ="#"+$(this).find("input[name^='recursoFinalPago"+"']").attr("id");

		var agrega="#"+$(this).find("input[name^='agrega"+"']").attr("id");
		var elimina="#"+$(this).find("input[name^='eliminar"+"']").attr("id");


		numInicioTabs++;
		$(asignacionCartaID).attr('tabindex' , numInicioTabs);
		$(casaComercialID).attr('tabindex' , numInicioTabs);
		$(nombreCasa).attr('tabindex' , numInicioTabs);
		$(estatus).attr('tabindex' , numInicioTabs);
		$(monto).attr('tabindex' , numInicioTabs);
		$(fechaVigencia).attr('tabindex' , numInicioTabs);

		$(nombreCartaLiq).attr('tabindex' , numInicioTabs);
		$(recurso).attr('tabindex' , numInicioTabs);
		$(extension).attr('tabindex' , numInicioTabs);
		$(comentario).attr('tabindex' , numInicioTabs);
		$(archivoIDCarta).attr('tabindex' , numInicioTabs);
		$(modArchCarta).attr('tabindex' , numInicioTabs);
		$(recursoFinal).attr('tabindex' , numInicioTabs);

		$(nombreComproPago).attr('tabindex' , numInicioTabs);
		$(recursoPago).attr('tabindex' , numInicioTabs);
		$(extensionPago).attr('tabindex' , numInicioTabs);
		$(comentarioPago).attr('tabindex' , numInicioTabs);
		$(archivoIDPago).attr('tabindex' , numInicioTabs);
		$(modArchPago).attr('tabindex' , numInicioTabs);
		$(recursoFinalPago).attr('tabindex' , numInicioTabs);

		$(elimina).attr('tabindex' , numInicioTabs);
		$(agrega).attr('tabindex' , numInicioTabs);
	}
});
$('#'+idTab).val(numInicioTabs);
}

function reasignaTabIndex2(){
var numInicioTabs = 2;
var idTab = '';
	idTab = 'numTabI';

$('#tbParametrizacion2 tr').each(function(index){
	if(index>1){

		var creditolID 		= "#"+$(this).find("input[name^='creditolID"+"']").attr("id");
		var fechaVigencia 	= "#"+$(this).find("input[name^='fechaVigenciaI"+"']").attr("id");
		var monto			= "#"+$(this).find("input[name^='montoI"+"']").attr("id");

		var descargar		= "#"+$(this).find("input[name^='descargar"+"']").attr("id");
		var eliminar		= "#"+$(this).find("input[name^='eliminar"+"']").attr("id");
		var agrega			= "#"+$(this).find("input[name^='agrega"+"']").attr("id");



		numInicioTabs++;
		$(creditolID).attr('tabindex' , numInicioTabs);
		$(fechaVigencia).attr('tabindex' , numInicioTabs);
		$(monto).attr('tabindex' , numInicioTabs);

		$(descargar).attr('tabindex' , numInicioTabs);
		$(eliminar).attr('tabindex' , numInicioTabs);
		$(agrega).attr('tabindex' , numInicioTabs);
	}
});
$('#'+idTab).val(numInicioTabs);
}

/**
* Ordena los IDs de los Campos cuando se elimina algun registro del GRID
*/
function ordenaControles(){
var contador = 1;
$('input[name=asignacionCartaID]').each(function() {
	var jqCicInf = eval("'#" + this.id + "'");
	$(jqCicInf).attr("id", "asignacionCartaID" + contador);

	contador = contador + 1;
});
contador = 1;
$('input[name=casaComercialID]').each(function() {
	var jqCicInf = eval("'#" + this.id + "'");
	$(jqCicInf).attr("id", "casaComercialID" + contador);

	contador = contador + 1;
});
contador = 1;
$('input[name=nombreCasa]').each(function() {
	var jqCicInf = eval("'#" + this.id + "'");
	$(jqCicInf).attr("id", "nombreCasa" + contador);

	contador = contador + 1;
});
contador = 1;
$('input[name=estatus]').each(function() {
	var jqCicInf = eval("'#" + this.id + "'");
	$(jqCicInf).attr("id", "estatus" + contador);

	contador = contador + 1;
});
contador = 1;
$('input[name=monto]').each(function() {
	var jqCicInf = eval("'#" + this.id + "'");
	$(jqCicInf).attr("id", "monto" + contador);

	contador = contador + 1;
});
contador = 1;
$('input[name=montoAnterior]').each(function() {
	var jqCicInf = eval("'#" + this.id + "'");
	$(jqCicInf).attr("id", "montoAnterior" + contador);

	contador = contador + 1;
});
contador = 1;
$('input[name=fechaVigencia]').each(function() {
	var jqCicInf = eval("'#" + this.id + "'");
	$(jqCicInf).attr("id", "fechaVigencia" + contador);

	contador = contador + 1;
});
contador = 1;
$('input[name=cartaLiq]').each(function() {
	var jqCicInf = eval("'#" + this.id + "'");
	$(jqCicInf).attr("id", "cartaLiq" + contador);
	contador = contador + 1;
});
contador = 1;
$('input[name=nombreCartaLiq]').each(function() {
	var jqCicInf = eval("'#" + this.id + "'");
	$(jqCicInf).attr("id", "nombreCartaLiq" + contador);

	contador = contador + 1;
});
contador = 1;
$('input[name=recurso]').each(function() {
	var jqCicInf = eval("'#" + this.id + "'");
	$(jqCicInf).attr("id", "recurso" + contador);

	contador = contador + 1;
});
contador = 1;
$('input[name=extension]').each(function() {
	var jqCicInf = eval("'#" + this.id + "'");
	$(jqCicInf).attr("id", "extension" + contador);

	contador = contador + 1;
});
contador = 1;
$('input[name=comentario]').each(function() {
	var jqCicInf = eval("'#" + this.id + "'");
	$(jqCicInf).attr("id", "comentario" + contador);

	contador = contador + 1;
});
contador = 1;
$('input[name=archivoIDCarta]').each(function() {
	var jqCicInf = eval("'#" + this.id + "'");
	$(jqCicInf).attr("id", "archivoIDCarta" + contador);

	contador = contador + 1;
});
contador = 1;
$('input[name=modificaArchCarta]').each(function() {
	var jqCicInf = eval("'#" + this.id + "'");
	$(jqCicInf).attr("id", "modificaArchCarta" + contador);

	contador = contador + 1;
});
contador = 1;
$('input[name=recursoFinal]').each(function() {
	var jqCicInf = eval("'#" + this.id + "'");
	$(jqCicInf).attr("id", "recursoFinal" + contador);

	contador = contador + 1;
});
contador = 1;
$('input[name=comproPago]').each(function() {
	var jqCicInf = eval("'#" + this.id + "'");
	$(jqCicInf).attr("id", "comproPago" + contador);

	contador = contador + 1;
});
contador = 1;
$('input[name=nombreComproPago]').each(function() {
	var jqCicInf = eval("'#" + this.id + "'");
	$(jqCicInf).attr("id", "nombreComproPago" + contador);

	contador = contador + 1;
});
contador = 1;
$('input[name=recursoPago]').each(function() {
	var jqCicInf = eval("'#" + this.id + "'");
	$(jqCicInf).attr("id", "recursoPago" + contador);

	contador = contador + 1;
});
contador = 1;
$('input[name=extensionPago]').each(function() {
	var jqCicInf = eval("'#" + this.id + "'");
	$(jqCicInf).attr("id", "extensionPago" + contador);

	contador = contador + 1;
});
contador = 1;
$('input[name=comentarioPago]').each(function() {
	var jqCicInf = eval("'#" + this.id + "'");
	$(jqCicInf).attr("id", "comentarioPago" + contador);

	contador = contador + 1;
});
contador = 1;
$('input[name=archivoIDPago]').each(function() {
	var jqCicInf = eval("'#" + this.id + "'");
	$(jqCicInf).attr("id", "archivoIDPago" + contador);

	contador = contador + 1;
});
contador = 1;
$('input[name=modificaArchPago]').each(function() {
	var jqCicInf = eval("'#" + this.id + "'");
	$(jqCicInf).attr("id", "modificaArchPago" + contador);

	contador = contador + 1;
});
contador = 1;
$('input[name=recursoFinalPago]').each(function() {
	var jqCicInf = eval("'#" + this.id + "'");
	$(jqCicInf).attr("id", "recursoFinalPago" + contador);

	contador = contador + 1;
});
 contador = 1;
$('input[name=eliminar]').each(function() {
	var jqCicInf = eval("'#" + this.id + "'");
	$(jqCicInf).attr("id", "eliminar" + contador);

	contador = contador + 1;
});
contador = 1;
$('input[name=agrega]').each(function() {
	var jqCicInf = eval("'#" + this.id + "'");
	$(jqCicInf).attr("id", "agrega" + contador);

	contador = contador + 1;
});

// reordenamiento de la funcion onClick
contador = 1;
$('input[name=cartaLiq]').each(function() {
	var jqCicInf = eval("'#" + this.id + "'");
	$(jqCicInf).attr("onClick", "subirArchivos('cartaLiq'," + contador+",'1')");
	contador = contador + 1;
});

contador = 1;
$('input[name=comproPago]').each(function() {
	var jqCicInf = eval("'#" + this.id + "'");
	$(jqCicInf).attr("onClick", "subirArchivos('comproPago'," + contador+",'2')");

	contador = contador + 1;
});

}

/**
* Realiza la Subida de Archivos
*/
function subirArchivos(control, numControl, tipoArch) {
$('#tipoTransaccion').val(catTipoTransArchivo.adjuntar);
var consolida = $('#consolidacionCartaID').val();
//EL nombre esta incorrecto
var casaComercial = 48; // Tipo de Documento

var url ="asignaCartaLiqAutUpload.htm?Sol="+$('#solicitudCreditoID').val()+"&td="+casaComercial +"&controlName="+control +"&controlID="+numControl +"&tipoArch="+tipoArch+"&conso="+consolida;
var	leftPosition = (screen.width) ? (screen.width-650)/2 : 0;
var	topPosition = (screen.height) ? (screen.height-500)/2 : 0;

ventanaArchivosCredito = window.open(url,"PopUpSubirArchivo","width=980,height=340,scrollbars=yes,status=yes,location=no,addressbar=0,menubar=0,toolbar=0"+
								"left="+leftPosition+
								",top="+topPosition+
								",screenX="+leftPosition+
								",screenY="+topPosition);
}

/**
* Habilita o deshabilita el boton de GRABAR de la tablas.
*/
function habilitaGrabar(){
setTimeout("$('#cajaLista').hide();", 200);
estatusSol = $('#estatusSolicitud').val();

var parametrosSisCon ={
			  'empresaID' : 1
};

usuario = parametroBean.perfilUsuario;

if(estatusSol == 'I' || estatusSol == 'L'){
	habilitaBoton('btnAgregar', 'submit');
	var numeroRenglones = Number(getRenglones('tbParametrizacion'));
	if(numeroRenglones > 0){
		habilitaBoton('grabar', 'submit');
	} else {
		deshabilitaBoton('grabar', 'submit');
	}

}else if(estatusSol == 'A' || estatusSol == 'D'){
	parametrosSisServicio.consulta(1,parametrosSisCon, { async : false, callback : function(ParamSistema) {
		if (ParamSistema != null) {
			if(ParamSistema.perfilCamCarLiqui == usuario) {
				deshabilitaBtnGrid();
				deshabilitaBoton('btnAgregar', 'submit');
				var numeroRenglones = Number(getRenglones('tbParametrizacion'));
					if(numeroRenglones > 0){
				habilitaBoton('grabar', 'submit');
					} else {
						deshabilitaBoton('grabar', 'submit');
					}

			}else {
				deshabilitaBtnGrid();
				deshabilitaBoton('grabar', 'submit');
				deshabilitaBoton('btnAgregar', 'button');
			}
		}
	}});
}
else{
	deshabilitaBtnGrid();
	deshabilitaBoton('grabar', 'submit');
	deshabilitaBoton('btnAgregar', 'button');
}

}


function deshabilitaBtnGrid(UsuarioCarta){
}

/**
* Valida si el valor del Campo es Numero
*/
function validaNumero(e){
var tecla = (document.all) ? e.keyCode : e.which;

if(tecla==8){
	return true;
}
var teclasPermitidas = /[0-9]/;
var teclaFinal = String.fromCharCode(tecla);
return teclasPermitidas.test(teclaFinal);
}

/**
* funcion que valida el Monto sea numero, que la sumatoria de los registros del GRID no exedan al monto de la Solicitud
*/
function validaMontoAsignado(control, numControl){
var jqMonto = eval("'#" + control + "'");
estatusSol = $('#estatusSolicitud').val();

//Argumento de prueba

if($("#solicitudCreditoID").val() == 'null' || $("#solicitudCreditoID").val() == 0 ){
	return;
}
return;
}

/**
* funcion valida fecha formato (yyyy-MM-dd)
*/
function validaFecha(control){
var Xfecha= $('#'+control).val();
if(esFechaValida(Xfecha)){
	if(Xfecha=='')$('#'+control).val(parametroBean.fechaSucursal);
	var Yfecha= parametroBean.fechaSucursal;
	if ( mayor(Yfecha,Xfecha) )
	{
		mensajeSis("La Fecha de Vigencia es menor a la Fecha de la Sucursal.")	;
		$('#'+control).val(parametroBean.fechaSucursal);
	}
}else{
	$('#'+control).val(parametroBean.fechaSucursal);
}
}
/**
* funcion valida si es fecha con formato (yyyy-MM-dd)
*/
function esFechaValida(fecha){
if (fecha != undefined && fecha.value != "" ){
	var objRegExp = /^\d{4}\-\d{2}\-\d{2}$/;
	if (!objRegExp.test(fecha)){
		mensajeSis("formato de fecha no válido (aaaa-mm-dd)");
		return false;
	}

	var mes=  fecha.substring(5, 7)*1;
	var dia= fecha.substring(8, 10)*1;
	var anio= fecha.substring(0,4)*1;

	switch(mes){
	case 1: case 3:  case 5: case 7:
	case 8: case 10:
	case 12:
		numDias=31;
		break;
	case 4: case 6: case 9: case 11:
		numDias=30;
		break;
	case 2:
		if (comprobarSiBisisesto(anio)){ numDias=29; }else{ numDias=28;}
		break;
	default:
		mensajeSis("Fecha introducida errónea");
	return false;
	}
	if (dia>numDias || dia==0){
		mensajeSis("Fecha introducida errónea");
		return false;
	}
	return true;
}
}

function comprobarSiBisisesto(anio){
if ( ( anio % 100 != 0) && ((anio % 4 == 0) || (anio % 400 == 0))) {
	return true;
}
else {
	return false;
}
}

function mayor(fecha, fecha2){
	//0|1|2|3|4|5|6|7|8|9|
	//2 0 1 2 / 1 1 / 2 0
	var xMes=fecha.substring(5, 7);
	var xDia=fecha.substring(8, 10);
	var xAnio=fecha.substring(0,4);

	var yMes=fecha2.substring(5, 7);
	var yDia=fecha2.substring(8, 10);
	var yAnio=fecha2.substring(0,4);



	if (xAnio > yAnio){
		return true;
	}else{
		if (xAnio == yAnio){
			if (xMes > yMes){
				return true;
			}
			if (xMes == yMes){
				if (xDia > yDia){
					return true;
				}else{
					return false;
				}
			}else{
				return false;
			}
		}else{
			return false ;
		}
	}
}

function funcionSetRecursoPath(id)
{
var rec = $('#recursoInt'+id).val();
$('#recursoPathInt'+id).val(parametroBean.rutaArchivos + rec);
}

//FUNCIÓN DE ÉXITO DE LA TRANSACCIÓN
function funcionExito() {
//	inicializaForma('formaGenerica','casaID');
limpiaCampos();
limpiaGridInterna();
if(typeof var_consolidacion !== 'undefined')
{
	$("#solic").hide();
}
}

//FUNCIÓN DE ERROR DE LA TRANSACCIÓN
function funcionError() {
agregaFormatoControles('formaGenerica');
}

function limpiaCampos(){
$('#clienteID').val("");
$('#nombreCliente').val("");
$('#estatusSolicitud').val("");
$('#montoSolicitud').val("");
$('#solicitudCreditoID').val("");
$('#consolidacionCartaID').focus();
}


function limpiaGridInterna(){
$('#gridCartaLiqInt').html("");
$('#gridCartaLiqInt').hide();
$('#gridCartaLiq').html("");
$('#gridCartaLiq').hide();
}

//funcion que bloquea la pantalla mientras se cargan los datos
function bloquearPantallaCarga() {
 $('#mensaje').html('<img src="images/barras.jpg" alt=""/>');
 $('#contenedorForma').block({
 message : $('#mensaje'),
 css : {
 border : 'none',
 background : 'none'
 }
 });

}