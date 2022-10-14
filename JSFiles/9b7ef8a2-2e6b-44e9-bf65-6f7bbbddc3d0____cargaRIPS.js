tday  =new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday");
tmonth=new Array("January","February","March","April","May","June","July","August","September","October","November","December");

function GetClock()
{
d = new Date();
nday   = d.getDay();
nmonth = d.getMonth();
ndate  = d.getDate();
nyear = d.getYear();
nhour  = d.getHours();
nmin   = d.getMinutes();
nsec   = d.getSeconds();

if(nyear<1000) nyear=nyear+1900;

     if(nhour ==  0) {ap = " AM";nhour = 12;} 
else if(nhour <= 11) {ap = " AM";} 
else if(nhour == 12) {ap = " PM";} 
else if(nhour >= 13) {ap = " PM";nhour -= 12;}

if(nmin <= 9) {nmin = "0" +nmin;}
if(nsec <= 9) {nsec = "0" +nsec;}


//document.getElementById('clockbox').innerHTML=""+tday[nday]+", "+tmonth[nmonth]+" "+ndate+", "+nyear+" "+nhour+":"+nmin+":"+nsec+ap+"";
document.getElementById('clockbox').innerHTML=""+nhour+":"+nmin+":"+nsec+ap+"";
setTimeout("GetClock()", 1000);
}//fin if funcion obtener reloj
window.onload=GetClock;

function seleccionar_periodo()
{
	var fecha_corte = document.getElementById("fechas_corte").value;
	if(fecha_corte=="3-31")
	{
		document.getElementById("periodo").value="1";
	}
	if(fecha_corte=="6-30")
	{
		document.getElementById("periodo").value="2";
	}
	if(fecha_corte=="9-30")
	{
		document.getElementById("periodo").value="3";
	}
	if(fecha_corte=="12-31")
	{
		document.getElementById("periodo").value="4";
	}
}

function seleccionar_fecha_de_corte()
{
	var periodo = document.getElementById("periodo").value;
	
	if(periodo==1)
	{
		document.getElementById("fechas_corte").value="3-31";
	}
	if(periodo==2)
	{
		document.getElementById("fechas_corte").value="6-30";
	}
	if(periodo==3)
	{
		document.getElementById("fechas_corte").value="9-30";
	}
	if(periodo==4)
	{
		document.getElementById("fechas_corte").value="12-31";
	}
}

$(function() 
{
    $("#prestador").popover({placement: 'right', html: true, trigger: 'hover', title: '<b>Descripcion<b>', content: 'Por favor seleccione la sede de la entidad prestadora a la que le corresponde el cargue<br>'});
    $("#eapb").popover({placement: 'right', html: true, trigger: 'hover', title: '<b>Descripcion<b>', content: 'Por favor seleccione la entidad administradora asociada al cargue<br>'});
    $("#fecha_remision").popover({placement: 'right', html: true, trigger: 'hover', title: '<b>Descripcion<b>', content: 'Por favor registre la fecha de remisi&oacuten del archivo de control (CT)<br>'});
    $("#fechas_corte").popover({placement: 'right', html: true, trigger: 'hover', title: '<b>Descripcion<b>', content: 'Por favor registre la fecha de corte correspondiente al cargue<br>'});
	$("#year_de_corte").popover({placement: 'right', html: true, trigger: 'hover', title: '<b>Descripcion<b>', content: 'Por favor seleccione el a&ntildeo para la fecha de corte correspondiente al cargue<br>'});
    $("#periodo").popover({placement: 'right', html: true, trigger: 'hover', title: '<b>Descripcion<b>', content: 'Por favor, seleccione el periodo correspondiente al cargue de PyP<br>'});
    
	$("#ct_control").popover({placement: 'bottom', html: true, trigger: 'hover', title: '<b>Descripcion<b>', content: 'El tama&ntildeo del archivo no debe superar los 250 Mega Bytes<br>'});
	$("#af_transacciones").popover({placement: 'bottom', html: true, trigger: 'hover', title: '<b>Descripcion<b>', content: 'El tama&ntildeo del archivo no debe superar los 250 Mega Bytes<br>'});
	$("#us_usuarios").popover({placement: 'bottom', html: true, trigger: 'hover', title: '<b>Descripcion<b>', content: 'El tama&ntildeo del archivo no debe superar los 250 Mega Bytes<br>'});
	$("#ad_descripcion").popover({placement: 'bottom', html: true, trigger: 'hover', title: '<b>Descripcion<b>', content: 'El tama&ntildeo del archivo no debe superar los 250 Mega Bytes<br>'});
	$("#ac_consulta").popover({placement: 'bottom', html: true, trigger: 'hover', title: '<b>Descripcion<b>', content: 'El tama&ntildeo del archivo no debe superar los 250 Mega Bytes<br>'});
	$("#ap_procedimientos").popover({placement: 'bottom', html: true, trigger: 'hover', title: '<b>Descripcion<b>', content: 'El tama&ntildeo del archivo no debe superar los 250 Mega Bytes<br>'});
	$("#au_urgencias").popover({placement: 'bottom', html: true, trigger: 'hover', title: '<b>Descripcion<b>', content: 'El tama&ntildeo del archivo no debe superar los 250 Mega Bytes<br>'});
	$("#ah_hospitalizacion").popover({placement: 'bottom', html: true, trigger: 'hover', title: '<b>Descripcion<b>', content: 'El tama&ntildeo del archivo no debe superar los 250 Mega Bytes<br>'});
	$("#an_recien_nacidos").popover({placement: 'bottom', html: true, trigger: 'hover', title: '<b>Descripcion<b>', content: 'El tama&ntildeo del archivo no debe superar los 250 Mega Bytes<br>'});
	$("#am_medicamentos").popover({placement: 'bottom', html: true, trigger: 'hover', title: '<b>Descripcion<b>', content: 'El tama&ntildeo del archivo no debe superar los 250 Mega Bytes<br>'});
	$("#at_otros_servicios").popover({placement: 'bottom', html: true, trigger: 'hover', title: '<b>Descripcion<b>', content: 'El tama&ntildeo del archivo no debe superar los 250 Mega Bytes<br>'});
	

});


//especificar none si el resultado de la peticion ajax no sera contenida en un div
function ConsultaAJAX(parametros,filePHP,divContent)
{
	var xmlhttp;
	if (window.XMLHttpRequest)
	{// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}
	else
	{// code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	if(divContent!="none")
	{
		xmlhttp.open("GET",filePHP+"?"+parametros+"&campodiv="+divContent,false);
		xmlhttp.send();
		document.getElementById(divContent).innerHTML=xmlhttp.responseText;
	}
	else
	{
		xmlhttp.open("GET",filePHP+"?"+parametros,false);
		xmlhttp.send();
		//alert(xmlhttp.responseText);
		return xmlhttp.responseText;
	}

}//fin funcion consulta ajax

function mirar_fecha_entre(fecha_revisar,fecha_ini,fecha_fin)
{
	//alert(fecha_ini+" "+fecha_fin);
	var d1 = fecha_ini.split("/");
	var d2 = fecha_fin.split("/");
	var c = fecha_revisar.split("/");

	var ini = new Date();  // -1 because months are from 0 to 11
	var fin   = new Date();
	var check = new Date();
	
	ini.setFullYear(d1[2], d1[0]-1, d1[1]);
	fin.setFullYear(d2[2], d2[0]-1, d2[1]);
	check.setFullYear(c[2], c[0]-1, c[1]);

	
	if (check >= ini && check <= fin)
	{
		//alert("aceptable");
		return true;
	}
	else
	{		
		//alert("no "+ini+" "+fin+" "+check);
		return false;
	}
}//fin funcion

var fecha_dentro_de_periodo=false; 
function seleccionar_periodo_automaticamente(modo)
{
	var fecha_a_revisar=$("#fecha_remision").val();
	//alert(fecha_a_revisar);
	if(isDate(fecha_a_revisar))
	{
		var fecha_dividida = fecha_a_revisar.split("/");
		
		var year=fecha_dividida[2];
		//alert(year);
		
		var fecha_ini_p1="03/31/"+year;
		var fecha_ini_p2="06/30/"+year;
		var fecha_ini_p3="09/30/"+year;
		var fecha_ini_p4_1="12/31/"+year;
		var fecha_ini_p4_2="01/01/"+year;
		
		var fecha_fin_p1="04/25/"+year;
		var fecha_fin_p2="07/25/"+year;
		var fecha_fin_p3="10/25/"+year;
		var fecha_fin_p4_1="12/31/"+year;
		var fecha_fin_p4_2="01/25/"+year;
		
		var encontro_periodo=false;
		if(mirar_fecha_entre(fecha_a_revisar,fecha_ini_p1,fecha_fin_p1))
		{
			$('#periodo').val('1');
			encontro_periodo=true;
		}
		if(mirar_fecha_entre(fecha_a_revisar,fecha_ini_p2,fecha_fin_p2))
		{
			$('#periodo').val('2');
			encontro_periodo=true;
		}
		if(mirar_fecha_entre(fecha_a_revisar,fecha_ini_p3,fecha_fin_p3))
		{
			$('#periodo').val('3');
			encontro_periodo=true;
		}
		if(mirar_fecha_entre(fecha_a_revisar,fecha_ini_p4_1,fecha_fin_p4_1))
		{
			$('#periodo').val('4');
			encontro_periodo=true;
		}
		if(mirar_fecha_entre(fecha_a_revisar,fecha_ini_p4_2,fecha_fin_p4_2))
		{
			$('#periodo').val('4');
			encontro_periodo=true;
		}
		
		if(encontro_periodo==false)
		{
			fecha_dentro_de_periodo=false;
			if(modo!="verificar")
			{
				alert("La fecha no corresponde a ningun periodo");
			}
		}
		else
		{
			fecha_dentro_de_periodo=true;			
		}
	}
}

function isDate(txtDate)
{
    var reg = /^(0[1-9]|1[012])([\/-])(0[1-9]|[12][0-9]|3[01])\2(\d{4})$/;
    return reg.test(txtDate);
}

function isDate2(txtDate)
{
    var reg = /^(0[1-9]|[12][0-9]|3[01])([\/-])(0[1-9]|1[012])\2(\d{4})$/;
    return reg.test(txtDate);
}

function funciones_fecha_restriciones()
{
seleccionar_periodo_automaticamente();
seleccionar_fecha_de_corte();
poner_year();
}

function poner_year()
{
	var fecha_a_revisar=$("#fecha_remision").val();
	//alert(fecha_a_revisar);
	if(isDate(fecha_a_revisar))
	{
		var fecha_dividida = fecha_a_revisar.split("/");
		
		var year=fecha_dividida[2];
		
		document.getElementById("year_de_corte").value=year;
	}
}

$(function() {
    $("#fecha_remision").datepicker();
    $("#fecha_remision").datepicker("option", "dateFormat", 'mm/dd/yy');
    $("#fecha_remision").datepicker($.datepicker.regional[ "es" ]);
});

var errores_archivos=false;

function obtener_nombre_file_upload(id_file,id_div_destino,estado_div)
{
	if (estado_div === undefined) {estado_div = "archivos_cargados_en_server";}	
	var tipo_archivo_rips_seleccionado = document.getElementById('tipo_archivo_rips').value;
	
	document.getElementById("ultimos_archivos_subido").value="";
	
	var archivos_subidos = document.getElementById(id_file);
	var nombres_archivos="";
	var estados_archivo="";
	var numero_remision="";
	
	var hubo_error_archivos=false;
	
	if (tipo_archivo_rips_seleccionado=="ips" || tipo_archivo_rips_seleccionado=="eapb")
	{
		if (tipo_archivo_rips_seleccionado=="ips" && archivos_subidos.files.length<=11)
		{
			//PARTE PARA OBTENER EL NUMERO DE REMISION DEL CT
			var archivo_ct="";
			var numero_rem_ct="";
			for (var x = 0; x < archivos_subidos.files.length; x++)
			{
				array_nombre_revisar_extension= new Array();
				array_nombre_revisar_extension=archivos_subidos.files[x].name.split(".");
				if (array_nombre_revisar_extension.length==2 && array_nombre_revisar_extension[1]=="txt")
				{
					var pattern_rips_nombre_pre_ct=/(CT)[0-9][0-9][0-9][0-9][0-9][0-9]/g;
					resultado_numero_remision_ct_match=array_nombre_revisar_extension[0].match(pattern_rips_nombre_pre_ct);
					if (resultado_numero_remision_ct_match==array_nombre_revisar_extension[0])
					{
						archivo_ct=array_nombre_revisar_extension[0];
						document.getElementById("nombre_archivo_rips").value=archivo_ct;
						var pattern_pre_ct_numero_remision=/[0-9][0-9][0-9][0-9][0-9][0-9]/g;
						resultado_numero_remision_pre_ct_match=archivo_ct.match(pattern_pre_ct_numero_remision);
						if (resultado_numero_remision_pre_ct_match!=null)
						{
							numero_rem_ct=resultado_numero_remision_pre_ct_match;
						}
					}
				}
			}			
			//FIN PARTE PARA OBTENER EL NUMERO DE REMISION DEL CT
			
			for (var x = 0; x < archivos_subidos.files.length; x++)
			{
				array_nombre_revisar_extension= new Array();
				array_nombre_revisar_extension=archivos_subidos.files[x].name.split(".");
				if (array_nombre_revisar_extension.length==2 && array_nombre_revisar_extension[1]=="txt")
				{
					
					var pattern_rips_prestador=/((AC)|(CT)|(US)|(AF)|(AD)|(AU)|(AH)|(AN)|(AM)|(AP)|(AT))[0-9][0-9][0-9][0-9][0-9][0-9]/g;
					
					resultado_match=array_nombre_revisar_extension[0].match(pattern_rips_prestador);
					if (resultado_match==array_nombre_revisar_extension[0])
					{
						var pattern_numero_remision=/[0-9][0-9][0-9][0-9][0-9][0-9]/g;
						resultado_numero_remision_match=array_nombre_revisar_extension[0].match(pattern_numero_remision);
						
						nombres_archivos+="<label id='label_"+array_nombre_revisar_extension[0]+"'>"+array_nombre_revisar_extension[0]+"</label><br>";
						
						if (resultado_numero_remision_match!==null)
						{
							if (numero_rem_ct==resultado_numero_remision_match[0])
							{
								estados_archivo+="<label id='label_ec_"+array_nombre_revisar_extension[0]+"' name='label_ec_"+array_nombre_revisar_extension[0]+"'>- Sin Cargar</label><br>";
								estados_archivo+="<input type='hidden' name='"+array_nombre_revisar_extension[0]+"_valido' id='"+array_nombre_revisar_extension[0]+"_valido' value='si'/>";							
							}
							else if (numero_rem_ct!="")
							{
								estados_archivo+="<label id='label_ec_"+array_nombre_revisar_extension[0]+"' name='label_ec_"+array_nombre_revisar_extension[0]+"'>- El numero de remision "+resultado_numero_remision_match[0]+" no corresponde al del CT encontrado "+numero_rem_ct+" </label><br>";
								estados_archivo+="<input type='hidden' name='"+array_nombre_revisar_extension[0]+"_valido' id='"+array_nombre_revisar_extension[0]+"_valido' value='no'/>";
								hubo_error_archivos=true;
							}
							else
							{
								estados_archivo+="<label id='label_ec_"+array_nombre_revisar_extension[0]+"' name='label_ec_"+array_nombre_revisar_extension[0]+"'>- No se encontro un archivo CT para comparar el numero de remision</label><br>";
								estados_archivo+="<input type='hidden' name='"+array_nombre_revisar_extension[0]+"_valido' id='"+array_nombre_revisar_extension[0]+"_valido' value='no'/>";
								hubo_error_archivos=true;
							}
						}
						else
						{
							estados_archivo+="<label id='label_ec_"+array_nombre_revisar_extension[0]+"' name='label_ec_"+array_nombre_revisar_extension[0]+"'>- No corresponde el numero de remision  </label><br>";
							estados_archivo+="<input type='hidden' name='"+array_nombre_revisar_extension[0]+"_valido' id='"+array_nombre_revisar_extension[0]+"_valido' value='no'/>";
							hubo_error_archivos=true;
						}
						
					}
					else
					{
						nombres_archivos+="<label id='label_"+array_nombre_revisar_extension[0]+"'>"+array_nombre_revisar_extension[0]+"</label><br>";
						estados_archivo+="<label id='label_ec_"+array_nombre_revisar_extension[0]+"' name='label_ec_"+array_nombre_revisar_extension[0]+"'>- No corresponde a un archivo RIPS </label><br>";
						estados_archivo+="<input type='hidden' name='"+array_nombre_revisar_extension[0]+"_valido' id='"+array_nombre_revisar_extension[0]+"_valido' value='no'/>";
						hubo_error_archivos=true;
					}//fin else no es rips
					
				}
				else
				{					
					nombres_archivos+="<label id='label_"+archivos_subidos.files[x].name+"'>"+archivos_subidos.files[x].name+"</label><br>";
					estados_archivo+="<label id='label_ec_"+array_nombre_revisar_extension[0]+"' name='label_ec_"+array_nombre_revisar_extension[0]+"'>- El archivo tiene una extension invalida, debe ser un txt </label><br>";
					estados_archivo+="<input type='hidden' name='"+array_nombre_revisar_extension[0]+"_valido' id='"+array_nombre_revisar_extension[0]+"_valido' value='no'/>";
					hubo_error_archivos=true;
				}
				
				estados_archivo+="<input type='hidden' name='"+array_nombre_revisar_extension[0]+"_estado_carga' id='"+array_nombre_revisar_extension[0]+"_estado_carga' value='no'/>";
				
				
			}//fin foreach
			
			
			estados_archivo+="<input type='hidden' name='numero_remision_archivos' id='numero_remision_archivos' value='"+numero_remision+"'/>";
			
		}//if los archivos son 11 o menos y el nombre del archivo es de 8 caracteres
		else if (tipo_archivo_rips_seleccionado=="ips")
		{			
			nombres_archivos+="El numero maximo de archivos es 11 no "+archivos_subidos.files.length+" ";
			hubo_error_archivos=true;
		}
		else if (tipo_archivo_rips_seleccionado=="eapb" && archivos_subidos.files.length==1)
		{
			//code
			var x = 0;
			array_nombre_revisar_extension= new Array();
			array_nombre_revisar_extension=archivos_subidos.files[x].name.split(".");
			if (array_nombre_revisar_extension.length==2 && array_nombre_revisar_extension[1]=="zip")
			{
				var pattern_nombre_largo=/(RIP170RIPS)[0-9][0-9][0-9][0-9](([0][0-9])|([1][0-2]))(([0-2][0-9])|([0-3][0-1]))(NI)[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][A-Z][0-9][0-9]/g;
				resultado_nombre_comprimido_match=array_nombre_revisar_extension[0].match(pattern_nombre_largo);
				if (resultado_nombre_comprimido_match==array_nombre_revisar_extension[0])
				{
					document.getElementById("nombre_archivo_rips").value=array_nombre_revisar_extension[0];
					
					nombres_archivos+="<label id='label_"+array_nombre_revisar_extension[0]+"'>"+array_nombre_revisar_extension[0]+"</label><br>";
					
					estados_archivo+="<label id='label_ec_"+array_nombre_revisar_extension[0]+"' name='label_ec_"+array_nombre_revisar_extension[0]+"'>- Sin Cargar</label><br>";
					estados_archivo+="<input type='hidden' name='"+array_nombre_revisar_extension[0]+"_valido' id='"+array_nombre_revisar_extension[0]+"_valido' value='si'/>";
					nombres_archivos+="<div id='div_para_archivos_del_comprimido'></div>";
					estados_archivo+="<div id='div_para_estado_archivos_del_comprimido'></div>";
					
				}
				else
				{
					nombres_archivos+="<label id='label_"+array_nombre_revisar_extension[0]+"'>"+array_nombre_revisar_extension[0]+"</label><br>";
					estados_archivo+="<label id='label_ec_"+array_nombre_revisar_extension[0]+"' name='label_ec_"+array_nombre_revisar_extension[0]+"'>- No corresponde a un archivo RIPS </label><br>";
					estados_archivo+="<input type='hidden' name='"+array_nombre_revisar_extension[0]+"_valido' id='"+array_nombre_revisar_extension[0]+"_valido' value='no'/>";
					hubo_error_archivos=true;
				}//fin else no es rips
			
	
			}
			else
			{
				nombres_archivos+="<label id='label_"+archivos_subidos.files[x].name+"'>"+archivos_subidos.files[x].name+"</label><br>";
				estados_archivo+="<label id='label_ec_"+array_nombre_revisar_extension[0]+"' name='label_ec_"+array_nombre_revisar_extension[0]+"'>- El archivo tiene una extension invalida, debe ser un zip </label><br>";
				estados_archivo+="<input type='hidden' name='"+array_nombre_revisar_extension[0]+"_valido' id='"+array_nombre_revisar_extension[0]+"_valido' value='no'/>";
				hubo_error_archivos=true;
			}
		}
		else if(tipo_archivo_rips_seleccionado=="eapb")
		{
			nombres_archivos+="Debe subirse como maximo un archivo comprimido, no "+archivos_subidos.files.length+" numero de archivos ";
			hubo_error_archivos=true;
		}
		
	}//fin if si el nombre de archivo escrito tiene una longitud de 8 o 35 caracteres
	else
	{
		nombres_archivos+="Seleccione el tipo de archivo RIPS a validar ";
		hubo_error_archivos=true;
		
	}
	
	errores_archivos=hubo_error_archivos;
	
	//escribe en divs
	document.getElementById(id_div_destino).innerHTML=nombres_archivos;
		
	if (estado_div!="")
	{
		document.getElementById(estado_div).innerHTML=estados_archivo;
	}
	
	
}

function clearFileInput(ctrl) 
{
  try {
    ctrl.value = null;
  } catch(ex) { }
  if (ctrl.value) {
    ctrl.parentNode.replaceChild(ctrl.cloneNode(true), ctrl);
  }
}

function consultar_mpio()
{
	var cod_dpto = document.getElementById("dpto").value;
	if(cod_dpto!="none")
	{
		//document.getElementById("mostrar_mpio").style.display="inline";
		ConsultaAJAX("cod_dpto="+cod_dpto,"consulta_mpio.php","mpio_div");
	}
	else
	{
		//document.getElementById("mostrar_mpio").style.display="none";
		ConsultaAJAX("none_cod=none","consulta_mpio.php","mpio_div");
	}
	//colocar ayuda
	$("#mpio").popover({placement: 'right', html: true, trigger: 'hover', title: '<b>Descripcion<b>', content: 'Por favor, seleccione el municipio<br>'});
}

function mostrar_selectores_geograficos()
{
	obtener_nombre_file_upload('uploader_rips','nombres_archivo_a_cargar');
	if (document.getElementById("tipo_archivo_rips").value=="eapb")
	{
		document.getElementById("campos_filtro_geografico").style.display="block";
	}
	else
	{
		document.getElementById("campos_filtro_geografico").style.display="none";
	}
}

function sube_archivos()
{
	var nombre_archivo_rips=document.getElementById('nombre_archivo_rips').value;
	if (errores_archivos==false)
	{
		//alert('preparando para subir');
		document.getElementById('boton_cargar_archivos').value="Subiendo Archivo(s)";
		document.getElementById('error_upload').innerHTML="";
		
		if (document.getElementById("ultimos_archivos_subido").value==nombre_archivo_rips)
		{
			var pregunta_subir_archivos = confirm("Desea subir el mismo archivo");
			if (pregunta_subir_archivos==true)
			{
				document.getElementById("boton_cargar_archivos").disabled =true;
				cargar_archivos_ajax('uploader_rips');
			}
		}
		else
		{
			document.getElementById("boton_cargar_archivos").disabled =true;
			cargar_archivos_ajax('uploader_rips');
		}
		document.getElementById('boton_cargar_archivos').value="Subir Otros Archivos";
	}
	else
	{
		document.getElementById('error_upload').innerHTML="No se puede subir si hay errores en los archivos";
	}
}




function cargar_archivos_ajax(id_file)
{
	var archivos_a_subir = document.getElementById(id_file).files;	
	var tipo_archivo_rips_seleccionado = document.getElementById('tipo_archivo_rips').value;
	var nombre_archivo_rips=document.getElementById('nombre_archivo_rips').value;
	var formData = new FormData();
	
	for (var i = 0; i < archivos_a_subir.length; i++)
	{
	  var archivo = archivos_a_subir[i];
		
	  formData.append('archivos_rips[]', archivo, archivo.name);
	}
	
	if (tipo_archivo_rips_seleccionado=="ips" )
	{
		formData.append("tipo_rips", "prestador_rips");
	}
	else if (tipo_archivo_rips_seleccionado=="eapb" )
	{
		formData.append("tipo_rips", "eapb_rips");
	}
	else if (tipo_archivo_rips_seleccionado=="ips" )
	{
		formData.append("tipo_rips", "prestador_rips_error");
	}
	else if (tipo_archivo_rips_seleccionado=="eapb" )
	{
		formData.append("tipo_rips", "eapb_rips_error");
	}
	
	
	formData.append("nick", document.getElementById('act_user').value);
	
	if (document.getElementById('date_ruta'))
	{
		formData.append("ruta_fecha_anterior", document.getElementById('date_ruta').value);
	}
	
	var xhr = new XMLHttpRequest();
	
	
	
	xhr.open('POST', 'cargador_de_archivos.php', true);
	
	
	
	//se envian los archivos al servidor
	xhr.send(formData);
	
	xhr.upload.addEventListener('progress', function(e){document.getElementById('progress_upload').value = Math.ceil(e.loaded/e.total) * 100 + '%'; }, false);
	
	
	/*
	xhr.onload = function ()
	{
		if (xhr.status === 200)
		{
		  // File(s) uploaded.
		  document.getElementById('boton_cargar_archivos').innerHTML = 'Upload';
		}
		else
		{
		  alert('An error occurred!');
		}
	};
	*/
	
	/*
	var progressBar = document.getElementById('progress_upload');
	xhr.upload.onprogress = function(e)
	{
	  if (e.lengthComputable) {
	    document.getElementById('progress_upload').value = (e.loaded / e.total) * 100;
	}
	*/
	
	
	//http://codular.com/javascript-ajax-file-upload-with-progress
	
	xhr.onreadystatechange=function()
	{
		if (xhr.readyState==4 && xhr.status==200)
		{
		      var cadena_respuesta=xhr.responseText;
		      array_cadena_respuesta=cadena_respuesta.split("|");
		      document.getElementById('date_ruta').value=array_cadena_respuesta[0];
		      var cont=0;
		      while (cont<array_cadena_respuesta.length)
		      {
			      nombre_label="label_ec_"+array_cadena_respuesta[cont];
			      if (document.getElementById(nombre_label))
			      {
				      document.getElementById(nombre_label).innerHTML="- Cargado";
			      }
			      nombre_estado_carga=array_cadena_respuesta[cont]+"_estado_carga";
			      //alert(nombre_estado_carga);
			      if (document.getElementById(nombre_estado_carga))
			      {
				      document.getElementById(nombre_estado_carga).value="si";
				      //alert(document.getElementById(nombre_estado_carga).value);
			      }
			      cont++;
		      }
		      if (tipo_archivo_rips_seleccionado=="eapb")
			{
				//alert(cadena_respuesta);
				var cont_compresed_files=1;
				var html_para_div_comprimidos="";
				var html_para_div_estado_comprimidos="";
				var numero_remision_archivos_rips_eapb="";
				var pattern_rips_ct_eapb=/(CT)[0-9][0-9][0-9][0-9][0-9][0-9]/g;
				var pattern_rips_us_eapb=/(US)[0-9][0-9][0-9][0-9][0-9][0-9]/g;
				var pattern_rips_numero_remision_eapb=/[0-9][0-9][0-9][0-9][0-9][0-9]/g;
				//parte busca el numero de remision del ct para comparar con los otros si es el mismo
				var esta_us=false;
				while(cont_compresed_files<array_cadena_respuesta.length)
				{
					archivo_actual_descomprimido=array_cadena_respuesta[cont_compresed_files];
					if (archivo_actual_descomprimido!=nombre_archivo_rips)
					{	
						resultado_match_es_ct=archivo_actual_descomprimido.match(pattern_rips_ct_eapb);
						resultado_match_es_us=archivo_actual_descomprimido.match(pattern_rips_us_eapb);
						if (resultado_match_es_ct==archivo_actual_descomprimido)
						{
							
							numero_remision_archivos_rips_eapb=""+archivo_actual_descomprimido.match(pattern_rips_numero_remision_eapb);
							html_para_div_comprimidos+="<input type='hidden' name='label_numero_remision_archivos_rips_eapb' id='label_numero_remision_archivos_rips_eapb'>"+numero_remision_archivos_rips_eapb+"</label>";
							html_para_div_estado_comprimidos+="<input type='hidden' >Numero remision de acuerdo al nombre del CT</label>";
							html_para_div_estado_comprimidos+="<input type='hidden' name='numero_remision_archivos_rips_eapb' id='numero_remision_archivos_rips_eapb' value='"+numero_remision_archivos_rips_eapb+"'/>";
						}
						if (resultado_match_es_us==archivo_actual_descomprimido)
						{
							//se encontro el US
							esta_us=true;
						}
					}
					cont_compresed_files++;
				}
				$mensaje_archivos_faltantes="";
				if (numero_remision_archivos_rips_eapb=="")
				{
					$mensaje_archivos_faltantes+="ERROR Falta el archivo de control (CT).<br>";
				}
				if (esta_us==false)
				{
					$mensaje_archivos_faltantes+="ERROR Falta el archivo de usuarios (US).<br>";
				}
				//fin parte busca el numero de remision del ct para comparar con los otros si es el mismo
				if ($mensaje_archivos_faltantes!="")
				{
					document.getElementById('error_upload').innerHTML=$mensaje_archivos_faltantes;
					errores_archivos=true;
				}
				
				cont_compresed_files=1;
				
				while(cont_compresed_files<array_cadena_respuesta.length)
				{
					archivo_actual_descomprimido=array_cadena_respuesta[cont_compresed_files];
					if (archivo_actual_descomprimido!=nombre_archivo_rips)
					{
						//code
						html_para_div_comprimidos+="<label id='label_"+archivo_actual_descomprimido+"'>"+archivo_actual_descomprimido+"</label><br>";
						//mirar aca para indicar si contiene archivos que corresponden o no corresponden
						var pattern_rips_eapb=/((AC)|(CT)|(US)|(AV)|(AU)|(AH)|(AN)|(AM)|(AP))[0-9][0-9][0-9][0-9][0-9][0-9]/g;
						var pattern_rips_eapb_no_requeridos=/((AT)|(AF)|(AD))[0-9][0-9][0-9][0-9][0-9][0-9]/g;
						resultado_eapb_archivos_match=archivo_actual_descomprimido.match(pattern_rips_eapb);
						resultado_eapb_archivos_match_no_requeridos=archivo_actual_descomprimido.match(pattern_rips_eapb_no_requeridos);
						if (resultado_eapb_archivos_match==archivo_actual_descomprimido)
						{
							var resultado_numero_remision_actual= ""+archivo_actual_descomprimido.match(pattern_rips_numero_remision_eapb);
							if (resultado_numero_remision_actual==numero_remision_archivos_rips_eapb)
							{
								html_para_div_estado_comprimidos+="<label id='label_ec_"+archivo_actual_descomprimido+"' name='label_ec_"+archivo_actual_descomprimido+"'>- Fue descomprimido y es un archivo valido</label><br>";						
								html_para_div_estado_comprimidos+="<input type='hidden' name='"+archivo_actual_descomprimido+"_valido' id='"+archivo_actual_descomprimido+"_valido' value='si'/>";
							}
							else
							{
								html_para_div_estado_comprimidos+="<label id='label_ec_"+archivo_actual_descomprimido+"' name='label_ec_"+archivo_actual_descomprimido+"'>- El numero de remision no coincide con el archivo CT</label><br>";						
								html_para_div_estado_comprimidos+="<input type='hidden' name='"+archivo_actual_descomprimido+"_valido' id='"+archivo_actual_descomprimido+"_valido' value='no'/>";
								errores_archivos=true;
							}
						}
						else
						{
							if (resultado_eapb_archivos_match_no_requeridos==archivo_actual_descomprimido)
							{
								html_para_div_estado_comprimidos+="<label id='label_ec_"+archivo_actual_descomprimido+"' name='label_ec_"+archivo_actual_descomprimido+"'>- El archivo no es requerido para rips eapb</label><br>";						
								html_para_div_estado_comprimidos+="<input type='hidden' name='"+archivo_actual_descomprimido+"_valido' id='"+archivo_actual_descomprimido+"_valido' value='no'/>";
								errores_archivos=true;
							}
							else
							{
								html_para_div_estado_comprimidos+="<label id='label_ec_"+archivo_actual_descomprimido+"' name='label_ec_"+archivo_actual_descomprimido+"'>- El archivo no es valido para rips eapb</label><br>";						
								html_para_div_estado_comprimidos+="<input type='hidden' name='"+archivo_actual_descomprimido+"_valido' id='"+archivo_actual_descomprimido+"_valido' value='no'/>";
								errores_archivos=true;
							}
						}
						
					}					
					
					cont_compresed_files++;
				}
				document.getElementById("div_para_archivos_del_comprimido").innerHTML=html_para_div_comprimidos;
				//div_para_estado_archivos_del_comprimido
				document.getElementById("div_para_estado_archivos_del_comprimido").innerHTML=html_para_div_estado_comprimidos;
			}//fin if
			
			document.getElementById("ultimos_archivos_subido").value=nombre_archivo_rips;
		      //alert(document.getElementById('date_ruta').value);
		      document.getElementById("boton_cargar_archivos").disabled =false;
		}
		else if (xhr.status!=200) 
		{
			document.getElementById('error_upload').innerHTML="ERROR mientras se subian los archivos, revise su conexion al aplicativo en la red";
			errores_archivos=true;
			document.getElementById("boton_cargar_archivos").disabled =false;
		}
	}
	
}

var error_nombre_registrado_rips=false;



function validar_campos()
{
	var hay_errores= false;
	var mensaje ="";
	
	var fechaActual = new Date();
	var fechaIngreso = new Date($("#fecha_remision").val());
	var nombre_archivo_rips = document.getElementById('nombre_archivo_rips').value;
	var tipo_archivo_rips_seleccionado = document.getElementById('tipo_archivo_rips').value;
	
	
	if(document.getElementById("prestador").value=="none")
	{
		mensaje+='<br>-Seleccione un prestador \n';
	}
	if(document.getElementById("eapb").value=="none")
	{
		mensaje+='<br>-Seleccione un eapb \n';
	}	
	if(document.getElementById("nombre_archivo_rips").value=="")
	{
		mensaje+='<br>-No ha cargado ningun archivo \n';
	}
	if (fechaIngreso > fechaActual)
	{
        mensaje += '<br>-La fecha de remision no puede ser mayor a la actual\n';
	}
	if ($("#fecha_remision").val() == "")
	{
        mensaje += '<br>-La fecha de remision es obligatoria\n';
	}
	
	if(isDate($("#fecha_remision").val())==false)
	{	
		mensaje += '<br>-La fecha de remision no es una fecha valida\n';
	}
	
	//verificacion de carga de los archivos RIPS
	if(document.getElementById("uploader_rips").value=="")
	{
		mensaje+='<br>-Seleccione los/el archivo(s) RIPS \n';
	}
	
	if (errores_archivos==true)
	{
		mensaje+='<br>-Hay Errores en los archivos a validar \n';
	}
	
	if (error_nombre_registrado_rips==true)
	{
		mensaje+='<br>-Hay Errores en el registro del nombre de los archivos rips \n';
	}
	
	if (tipo_archivo_rips_seleccionado=="ips" && error_nombre_registrado_rips==false && errores_archivos==false)
	{
		//alert(nombre_archivo_rips);
		var pattern_numero_remision=/[0-9][0-9][0-9][0-9][0-9][0-9]/g;
		resultado_numero_remision_match=nombre_archivo_rips.match(pattern_numero_remision);
		//alert(resultado_numero_remision_match);
		//mensaje+="<br>CT"+resultado_numero_remision_match;
		
		nombre_estado_carga="CT"+resultado_numero_remision_match+"_estado_carga";		
		if (document.getElementById(nombre_estado_carga))
		{
			if(document.getElementById(nombre_estado_carga).value=="no")
			{
				mensaje+='<br>-Presione el boton de cargar archivos para subir el archivo CT';
			}
		}
		else
		{
			mensaje+='<br>-Seleccione un archivo CT';
		}
		
		nombre_estado_carga="AF"+resultado_numero_remision_match+"_estado_carga";		
		if (document.getElementById(nombre_estado_carga))
		{
			if(document.getElementById(nombre_estado_carga).value=="no")
			{
				mensaje+='<br>-Presione el boton de cargar archivos para subir el archivo AF';
			}
		}
		else
		{
			mensaje+='<br>-Seleccione un archivo AF';
		}
		
		nombre_estado_carga="US"+resultado_numero_remision_match+"_estado_carga";		
		if (document.getElementById(nombre_estado_carga))
		{
			if(document.getElementById(nombre_estado_carga).value=="no")
			{
				mensaje+='<br>-Presione el boton de cargar archivos para subir el archivo US';
			}
		}
		else
		{
			mensaje+='<br>-Seleccione un archivo US';
		}
		
		contador_archivos_op=0;
		
		nombre_estado_carga="AC"+resultado_numero_remision_match+"_estado_carga";		
		if (document.getElementById(nombre_estado_carga))
		{
			if(document.getElementById(nombre_estado_carga).value=="no")
			{
				mensaje+='<br>-Presione el boton de cargar archivos para subir el archivo AC';
			}
			contador_archivos_op++;
		}
		
		nombre_estado_carga="AP"+resultado_numero_remision_match+"_estado_carga";		
		if (document.getElementById(nombre_estado_carga))
		{
			if(document.getElementById(nombre_estado_carga).value=="no")
			{
				mensaje+='<br>-Presione el boton de cargar archivos para subir el archivo AP';
			}
			contador_archivos_op++;
		}
		
		nombre_estado_carga="AM"+resultado_numero_remision_match+"_estado_carga";		
		if (document.getElementById(nombre_estado_carga))
		{
			if(document.getElementById(nombre_estado_carga).value=="no")
			{
				mensaje+='<br>-Presione el boton de cargar archivos para subir el archivo AM';
			}
			contador_archivos_op++;
		}
		
		nombre_estado_carga="AT"+resultado_numero_remision_match+"_estado_carga";		
		if (document.getElementById(nombre_estado_carga))
		{
			if(document.getElementById(nombre_estado_carga).value=="no")
			{
				mensaje+='<br>-Presione el boton de cargar archivos para subir el archivo AT';
			}
			contador_archivos_op++;
		}
		
		if(contador_archivos_op==0)
		{
			mensaje+='<br>-Seleccione al menos un archivo para servicios(AC,AP,AM,AT) \n';
		}
	}//fin if si longitud nombre rips es 8 yno hay errores en el nombre o archivos pero falta cargarlos o faltan algunos
	
	if (tipo_archivo_rips_seleccionado=="eapb" && document.getElementById("numero_remision_archivos_rips_eapb"))
	{
		var nombre_ct=$("#numero_remision_archivos_rips_eapb").val();
		var cadena_fecha_reorganizada=nombre_ct.substr(2,nombre_ct.length)+nombre_ct.substr(0,2);
		var pattern_nombre_largo=new RegExp("(RIP170RIPS)("+cadena_fecha_reorganizada+")(([0-2][0-9])|([0-3][0-1]))(NI)[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][A-Z][0-9][0-9]","g");
		resultado_comprimido_match=nombre_archivo_rips.match(pattern_nombre_largo);
		//mensaje+='<br>- exp '+cadena_fecha_reorganizada+' '+nombre_archivo_rips+' \n';
		if (resultado_comprimido_match!=nombre_archivo_rips)
		{
			mensaje+='<br>- El a&ntildeo o mes del ct no coinciden con la fecha indicada en el comprimido \n';
		}
	}
	
	if (tipo_archivo_rips_seleccionado=="eapb" && document.getElementById("numero_remision_archivos_rips_eapb"))
	{
		var numero_remision_eapb=document.getElementById("numero_remision_archivos_rips_eapb").value;
		
		nombre_valido="CT"+numero_remision_eapb+"_valido";
		
		if (document.getElementById(nombre_valido))
		{
			
		}
		else
		{
			mensaje+='<br>- No esta el archivo de control \n';
		}
		
		nombre_valido="US"+numero_remision_eapb+"_valido";
		
		if (document.getElementById(nombre_valido))
		{
			
		}
		else
		{
			mensaje+='<br>- No esta el archivo de usuarios \n';
		}
		
		var contador_servicios_al_menos_uno_eapb=0;
		
		nombre_valido="AC"+numero_remision_eapb+"_valido";		
		if (document.getElementById(nombre_valido))
		{
			contador_servicios_al_menos_uno_eapb++;
		}
		
		nombre_valido="AH"+numero_remision_eapb+"_valido";		
		if (document.getElementById(nombre_valido))
		{
			contador_servicios_al_menos_uno_eapb++;
		}
		
		nombre_valido="AM"+numero_remision_eapb+"_valido";		
		if (document.getElementById(nombre_valido))
		{
			contador_servicios_al_menos_uno_eapb++;
		}
		
		nombre_valido="AN"+numero_remision_eapb+"_valido";		
		if (document.getElementById(nombre_valido))
		{
			contador_servicios_al_menos_uno_eapb++;
		}
		
		nombre_valido="AP"+numero_remision_eapb+"_valido";		
		if (document.getElementById(nombre_valido))
		{
			contador_servicios_al_menos_uno_eapb++;
		}
		
		nombre_valido="AU"+numero_remision_eapb+"_valido";		
		if (document.getElementById(nombre_valido))
		{
			contador_servicios_al_menos_uno_eapb++;
		}
		
		
		if (contador_servicios_al_menos_uno_eapb==0)
		{
			mensaje+='<br>- Debe subir al menos unarchivo de servicios AC,AH,AM,AN,AU,AP \n';
		}
		
		
		
	}
	else if(tipo_archivo_rips_seleccionado=="eapb")
	{
		mensaje+='<br>- Cargue el comprimido \n';
	}
	
	if(tipo_archivo_rips_seleccionado=="eapb")
	{
		if (document.getElementById("dpto"))
		{
			if (document.getElementById("dpto").value=="none")
			{
				mensaje+='<br>- Seleccione un departamento para filtrar \n';
			}
		}
	}
	//fin verificaciond e carga de los archivos RIPS
	
	
	if (mensaje == "") 
	{
		return false;
	}
	else 
	{
		$("h3#tituloVentana").html("Advertencia");
		$("div#mensajeVentana").html("<p>" + mensaje + "</p>");
		$('#myModal').modal('toggle');
	
	
		return true;
	}
	
	return hay_errores;
}

function cargarRIPS()
{
	var hay_errores = validar_campos();		   
	
	document.getElementById('accion').value="validar";
	
	if (hay_errores==false)
	{
		window.onbeforeunload = function(e){};
		document.forms['formulario'].submit();
	}
}

function download_inconsistencias_campos(ruta)
{
	
	window.open(ruta,'Download');
}


function reset_file_elem(elem)
{
	try{
		elem.value = '';
		if(elem.value)
		{
			elem.type = "text";
			elem.type = "file";
		}
	}
	catch(e){}
}

function limpiar_files()
{
	
	
	if(document.getElementById('uploader_rips'))
	{
		reset_file_elem(document.getElementById('uploader_rips'));
		obtener_nombre_file_upload('uploader_rips','nombres_archivo_a_cargar');
	}
	
	document.getElementById('eapb').value="none";
	document.getElementById('nombre_archivo_rips').value="";
	document.getElementById('fecha_remision').value="";
	
}


onbeforeunload = function(e){	
		return 'Recuerde que se perderan los cambios realizados.';	
}