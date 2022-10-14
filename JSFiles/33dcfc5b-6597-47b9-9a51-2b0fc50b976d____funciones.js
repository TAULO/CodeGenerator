
var ancho_pantalla,alto_pantalla,alto_menu;   // se declara para poder trabajar con ellos 



new WOW().init();



var acciones = {
	listo : function(){
	
		jQuery(".cabecera .hamb").click(acciones.abrirmenu);
		// jQuery(".saltarina").click(acciones.irsaltarina);
		jQuery("#mostrar-nav-1").click(acciones.abrirmenu1);
	},

	abrirmenu:function(e)
	{
		e.preventDefault();
		
		jQuery(".cabecera .menu").toggleClass("abierto");      /*agregar y remover class abrir y cerrar menu*/ 
		jQuery("body").toggleClass("abierto");                 // para sacar la imagen de la pantalla  adicionar y remover
		jQuery(this).find("i").toggleClass("fa-times");        /* al dar click buscar la i (hamb)cambiar por X */

	
	jQuery(".cabecera .menu").click(function()
	{

		jQuery(".cabecera .menu").removeClass("abierto");
		jQuery(".hamb i").removeClass("fa-times");

		jQuery(this).find("href").toggleClass("fa-times");

		// var dev = jQuery(this).attr("href");

		// jQuery("html,body").animate({
		// 	"scrollTop": jQuery(dev).offset().top
		// });

	});	

		
	},

	scrollventana:function(){

		if(jQuery(window).scrollTop() > 60)                //al pasar toda la foto de banner mete un fondo en la cabecera menu
		{
			jQuery(".cabecera").addClass("fondo");
		}else

			jQuery(".cabecera").removeClass("fondo");


		
		ancho_pantalla = jQuery(window).width();

		     if(ancho_pantalla > 991)                    //solo si la pantalla es mayor a 991 hace lo de abajo 

		

			if(jQuery(window).scrollTop() > 380)                
		{
			jQuery("#lacarta-1").addClass("subir");			//al pasar por 380px mete la clase subir y lacarta-1 sube 100px
		}else

			jQuery("#lacarta-1").removeClass("subir");


		
	},


	abrirmenu1:function(e)
	{
		e.preventDefault();

		
	    jQuery("#mostrar-nav-1").toggleClass("mostrar");  /*abrir y cerrar menu1 vertical con click en hamburguesa1*/
	    jQuery("nav-1").toggleClass("mostrar");


	    jQuery(this).find("i").toggleClass("fa-times");        /*cambiar la hamb1 por la X*/

	    // jQuery(".hamb1 i").toggleClass("fa-angle-left");      /*cambiar la hamb1 por la X*/
    
	    
	},    


	precarga:function(){						
		acciones.redimensionar();
	},
	

	redimensionar:function(){
		ancho_pantalla = jQuery(window).width();
		alto_menu = jQuery(".cabecera").innerHeight();

		if((ancho_pantalla >= 640) && (ancho_pantalla<=768))
		    //=============si la pantalla esta entre 640 y 678  mete una nueva class y realiza los cambios especificados 
		{
			jQuery("#banner .container h1").addClass("titulo-inicio");   //mete una class en h1 y cambia m-bottom
			jQuery("#profesores .contenedor-cuadrado.cont-rect").addClass("margin-left-prof");  //mete una class en fotos prof cambia m-left
			jQuery(".flexslider").addClass("titulo-inicio");     //mete una class en flexslider y cambia alto en img carrusel
			jQuery(".fondo-1").addClass("fondo1-2");  //en inicio la carta y profesores mete una nueva class y cambia el alto de fondo-1
			jQuery(".fondo-1-login").addClass("fondo1-2");
            jQuery(".titulos-sedes").addClass("sedes-margin-top"); //mete una clase en movil-acostado sedes-h4, cambia el margin-top
            jQuery("#sedes .contenedor-serv").addClass("mb-alto"); //mete una clase en sedes fotos movil-acostado, cambia el alto
            jQuery("#sedes .contenedor-serv-sedes").addClass("mb-ancho-sedes"); //mete una clase en cont-serv-sedes y cambia el ancho 

		}else{
			jQuery("#banner .container h1").removeClass("titulo-inicio");
			jQuery("#profesores .contenedor-cuadrado.cont-rect").removeClass("margin-left-prof");	
			jQuery(".flexslider").removeClass("titulo-inicio");	
			jQuery(".fondo-1").removeClass("fondo1-2");
            jQuery(".fondo-1-login").removeClass("fondo1-2");
            jQuery(".titulos-sedes").removeClass("sedes-margin-top");
            jQuery("#sedes .contenedor-serv").removeClass("mb-alto");	
            jQuery("#sedes .contenedor-serv-sedes").removeClass("mb-ancho-sedes");

		}

	},                      

							
};



jQuery(document).ready(acciones.listo);

jQuery(window).on("load",acciones.precarga);

jQuery(window).resize("load",acciones.redimensionar);        //cambiar tamaÃ±o de un elemento al cambiar el ancho de la pantalla//

jQuery(window).scroll("load",acciones.scrollventana);        /* colocar oscuro en menu al scrolar*/


/*================================================================== ABRE CUALQUIER CARPETA O ARCHIVO ========================================================================*/
function abrir(dir)
{
    var request = new XMLHttpRequest();
    request.open('GET', "php/abrircarpeta.php?dir=" + dir, false); // false for synchronous request
    request.send(null);
   
    var resultado = request.responseText;
    
    return resultado;
}

/*================================================================== PAGINA DE LICEO EN CASA / DOCUMENTOS ===================================================================*/
function documentos(dir)
{
    
    if(dir == "documentos/")
    {
        document.getElementById("atras").disabled = true;
    }
    else
    {
        document.getElementById("atras").disabled = false;
    }
    ficheros = abrir(dir);
    
    ficheros = ficheros.split('"');
    
    if(ficheros.length == 7)
    {
        var html = "<table id='tabla-archivos' style='padding-bottom: 173px'><tbody><tr><th colspan='3'><hr></th></tr>";
    } else if(ficheros.length == 5) // carpeta vacia
    {
        var html = "<table id='tabla-archivos' style='padding-bottom: 199px'><tbody><tr><th colspan='3'><hr></th></tr>";
    } else if(ficheros.length == 9)
    {
        var html = "<table id='tabla-archivos' style='padding-bottom: 120px'><tbody><tr><th colspan='3'><hr></th></tr>";
    } else if(ficheros.length == 11)
    {
        var html = "<table id='tabla-archivos' style='padding-bottom: 67px'><tbody><tr><th colspan='3'><hr></th></tr>";
    } else if(ficheros.length == 13)
    {
        var html = "<table id='tabla-archivos' style='padding-bottom: 14px'><tbody><tr><th colspan='3'><hr></th></tr>";
    } else
    {
        var html = "<table id='tabla-archivos'><tbody><tr><th colspan='3'><hr></th></tr>";
    }
    
    var html_c = "";
    var html_f = "";
    if(ficheros.length > 5){
        for(i=1; i<ficheros.length; i=i+2)
        {
            if(ficheros[i].includes("/.") == false)
            {
                ubicacion = ficheros[i].replace("/public_html/", "");
                elemento = ubicacion.replace(dir, "");
                // console.log("elemento: " + elemento);
                // console.log("ubicacion: " + ubicacion);
                
                if(elemento.includes("."))
                {
                    var extension = elemento.split(".");
    
                    if(extension[1] == "doc" || extension[1] == "docx")
                    {
                        var icono = '<i class="fas fa-file-word"></i>';
                        var clase = 'word';
                        var clase_ico = "word_ico";
                    }
                    
                    if(extension[1] == "ppt" || extension[1] == "pptx")
                    {
                        var icono = '<i class="fas fa-file-word"></i>';
                        var clase = 'powerpoint';
                        var clase_ico = "powerpoint_ico";
                    }
    
                    if(extension[1] == "xls" || extension[1] == "xlsx")
                    {
                        var icono = '<i class="fas fa-file-excel"></i>';
                        var clase = 'excel';
                        var clase_ico = "excel_ico";
                    }
    
                    if(extension[1] == "pdf")
                    {
                        var icono = '<i class="fas fa-file-pdf"></i>';
                        var clase = 'pdf';
                        var clase_ico = "pdf_ico";
                    }
    
                    if(extension[1] == "jpg" || extension[1] == "jpeg" || extension[1] == "png" || extension[1] == "JPG")
                    {
                        var icono = '<i class="fas fa-file-image"></i>';
                        var clase = 'imagen';
                        var clase_ico = "imagen_ico";
                    }
    
                    if(extension[1] == "txt" || extension[1] == "js" || extension[1] == "html" || extension[1] == "php" || extension[1] == "css")
                    {
                        var icono = '<i class="fas fa-file-code"></i>';
                        var clase = 'archivo';
                        var clase_ico = "archivo_ico";
                    }
                    html_f = html_f +   '<tr class="'+ clase + '"">'+
                                            '<td class="' + clase_ico + '" valign="top">'+
                                                icono +
                                            '</td>'+
                                            '<td class="nombres">'+
                                                elemento +
                                            '</td>'+
                                            '<td class="abrir-carpetas1" >'+
                                                '<button id="abrir" onclick="abrirarchivo(' + "'" + ubicacion + "'" +  ')">Abrir</button>' +
                                            '</td>'+
                                        '</tr>';
                }   else
                {
                   html_c = html_c +   '<tr class="carpetas">'+
    	                                    '<td class="carpetas-ico" valign="top">'+
    	                                        '<i class="fas fa-folder-open"></i>'+
    	                                    '</td>'+
    	                                    '<td class="nombres">'+
    	                                        elemento.replace('/',"") +
    	                                    '</td>'+
    	                                    '<td class="abrir-carpetas1">'+
    	                                        '<button id="abrir" onclick="documentos(' + "'" + ubicacion + "/'" +  ')">Abrir</button>' +
    	                                    '</td>'+
                                    	'</tr>'; 
                }
            }
        }
    } else
    {
       html_c = html_c +    '<tr>'+
    	                        '<td>'+
    	                            "CARPETA VACIA"+
    	                        '</td>'+
    	                    '</tr>';  
    }
    
    html = html + html_c + html_f + "</table></tbody>";
    document.getElementById("tabla-elementos").innerHTML = html;
    document.getElementById("direccion").innerHTML = dir;
}

function atras(pass)
{
    var direccion = document.getElementById("direccion").innerHTML;
    
    direccion = direccion.split("/");
    var new_direccion = '';
 
    for(i = 0; i < direccion.length-2; i++)
    {
        new_direccion = new_direccion + direccion[i] + "/";
    }
    

    if(pass == true)
    {
        documentos(new_direccion);
    } else
    {
        platform(new_direccion);
    }

};

function abrirarchivo(file)
{
    window.open(file, '_blank');
    document.getElementById('fileupload').value = null;
    document.getElementById('newfolder').value = null;
};
/*================================================================== CARRUSEL ===============================================================================================*/
async function carrusel()
{
    imagenes = abrir("img/carrusel");
    
    imagenes = imagenes.split('"');
    
    var html = '<ul class="slides">';
    for(i=0; i<imagenes.length; i++)
    {
        if(imagenes[i].includes(".") && imagenes[i].includes("/.") == false)
        {
            //console.log(imagenes[i]);
            html = html +  '<li>'+
                              '<img src="' + imagenes[i].replace("/public_html/","") + '">' +
                              '<section class="caption">' +
                              '</section>' +
                            '</li>';
        }
    }
    html = html + '</ul>';
    document.getElementById("carrusel").innerHTML = html;
}

async function carrusel2()
{
    imagenes = abrir("img/carrusel");
    novedades = abrir("documentos/Documentos Institucionales/Novedades");
    
    imagenes = imagenes.split('"');
    novedades = novedades.split('"');
    
    var html = '<ul class="slides">';
    for(i=0; i<imagenes.length; i++)
    {
        if(imagenes[i].includes(".") && imagenes[i].includes("/.") == false)
        {
            //console.log(imagenes[i]);
            f1 = imagenes[i].replace("/public_html/img/carrusel/","");
            f1 = f1.split(".")[0];
            console.log("f1: " + f1);
            
            bandera = 0;
            link = "";
            for(j=0; j<novedades.length; j++)
            {
                if(novedades[j].includes(".") && novedades[j].includes("/.") == false)
                {
                    f2 = novedades[j].replace("/public_html/documentos/Documentos Institucionales/Novedades/","");
                    f2 = f2.split(".")[0];
                    console.log("f2: " + f2);
                    
                    if(f1 == f2)
                    {
                        bandera = 1;
                        link = novedades[j].replace("/public_html/","");
                    }
                }
            }
            
            if(bandera == 0)
            {
                html = html +  '<li>'+
                                    '<img src="' + imagenes[i].replace("/public_html/","") + '">' +
                                    '<section class="caption">' +
                                    '</section>' +
                                '</li>';  
            } else 
            {
                html = html +  '<li>'+
                                    '<a href="' + link + '" target="_blank"><img src="' + imagenes[i].replace("/public_html/","") + '"></a>' +
                                    '<section class="caption">' +
                                    '</section>' +
                                '</li>';  
            }
            // html = html +  '<li>'+
            //                   '<img src="' + imagenes[i].replace("/public_html/","") + '">' +
            //                   '<section class="caption">' +
            //                   '</section>' +
            //                 '</li>';
        }
    }
    html = html + '</ul>';
    document.getElementById("carrusel").innerHTML = html;
}

function carruselmod()
{
    imagenes = abrir("img/carrusel");
    
    imagenes = imagenes.split('"');
    
    var html = '<div class="container">' +   
                    '<div class="fila fila-centrada">' + 
                        '<h2>Imagenes de Novedades</h2>' +
                    '</div>' +
                    
                    '<div class="contenedor-carpetas-archivos">' + 
                        '<div class="cargar-archivos">' + 
                            '<h2 class="cargar-archivos1"> Cargar Imagenes</h2>' + 
                            '<input id="imgcarrusel" type="file" name="imgcarrusel" value="" />' + 
                            '<button id="upload-button" onclick="cargarimagen()">cargar</button>' + 
                        '</div>' + 
                    '</div>' + 
                    
                    '<div class="fila margin-arriba pag-alternativas borde">';
                
    
    for(i=0; i<imagenes.length; i++)
    {
        if(imagenes[i].includes(".") && imagenes[i].includes("/.") == false)
        {
            html = html +   '<div class="columna columna-20 columna-mb-100">' +
                                '<div class="contenedor-serv">' + 
                                    '<a href="#" target="_blank">' + 
                                        '<img class="logo-sis" src="' + imagenes[i].replace("/public_html/","") + '" width="20" height="20">' + 
                                    '</a>' + 
                                    '<h1>' + imagenes[i].replace("/public_html/img/carrusel/","") + '</h1>' + 
                                    '<button id= "carrusel-modificar" onclick="eliminarimagen(' + "'" +imagenes[i].replace('/public_html/','') + "'" + ')"><i class="fas fa-times"></i>Eliminar</button>' +
                                    '<button id= "carrusel-modificar" onclick="renombrarcarrusel(' + "'" +imagenes[i].replace('/public_html/','') + "'" + ')"><i class="fas fa-pencil-alt"></i>Renombrar</button>' +
                                '</div>' + 
                            '</div>';
        }
    }
    html = html + '</div></div></section>';
    document.getElementById("carrusel-modif").innerHTML = html;
}

async function cargarimagen()
{
    var direccion = "img/carrusel/"
    
    let file2 = document.getElementById("imgcarrusel").files[0];
    var tipo = file2.type.split("/")[0];
    
    if(tipo == "image")
    {
        console.log("es una imagen");
        let formData = new FormData();
        formData.append("file2", file2);
        
        var request = new XMLHttpRequest();
        await request.open('POST', 'php/upload.php?dir=' + direccion, false); // false for synchronous request
        request.send(formData);
    
        carruselmod();
    }  else
    {
        alert("Para cargar a novedades debe ser una imagen");
    }

    
};

async function eliminarimagen(dir)
{   
    var confirmar = confirm("Desea eliminar la imagen?");
    var direccion = dir;
    // var nombre = document.getElementById("newfolder").value;
    
    if(confirmar == true)
    {
        var result = window.prompt("Ingrese codigo de seguridad",'');
        if(result == "olimpia")
        {
            let file2 = document.getElementById("imgcarrusel").files[0];
        
            let formData = new FormData();
            formData.append("file2", file2);
            
            var request = new XMLHttpRequest();
            await request.open('POST', 'php/eliminararchivo.php?dir=' + direccion, false); // false for synchronous request
            request.send(formData);
            
            carruselmod();
        } else {
            alert("Contrase«Ða incorrecta");
        }
        
    }
};

async function renombrarcarrusel(old)
{   
    var confirmar = confirm("Desea renombrar la imagen?");
    var direccion = "img/carrusel/";
    // var nombre = document.getElementById("newfolder").value;
    
    if(confirmar == true)
    {
        var result = window.prompt("Ingrese codigo de seguridad",'');
        if(result == "olimpia")
        {   
            var extension = old.split(".")[1];
            
            var result = prompt("Nuevo nombre:");
            var nuevo = direccion + result + "." + extension;
            
            console.log(nuevo);
            
            let file2 = document.getElementById("imgcarrusel").files[0];
        
            let formData = new FormData();
            formData.append("file2", file2);
            
            var request = new XMLHttpRequest();
            await request.open('POST', 'php/renombrar.php?old=' + old + '&&new=' + nuevo, false); // false for synchronous request
            request.send(formData);
            
            //carruselmod();
        } else {
            alert("Codigo de seguridad incorrecta");
        }
        
    }
    carruselmod();
};

/*================================================================== EMPIEZA LOGIN ==========================================================================================*/
function ingresar()
{
    validar = false;
    
    var archivo = new XMLHttpRequest();
    archivo.open('GET', "/users/info.txt", false); // false for synchronous request
    archivo.send(null);
    
    var info = archivo.responseText;
    
    info = info.split("\n");
    
    user = document.getElementById("user").value;
    pass = document.getElementById("pass").value;
    
    if (info.length > 0)
    {
        for (i=0; i < info.length; i++)
        {
            u = info[i].split(",")[0].replace("{", "");
            p = info[i].split(",")[1].replace("}", "");
            n = info[i].split(",")[2].replace("}", "");
            
            if(u == user && p == pass)
            {
                validar = true;
            }
        }
    }
    
    if (validar == false)
    {
        //window.location.href = "https://liceosantander.edu.co/login.html";
        alert("Credenciales incorrectos");
    } else 
    {
        window.location.href = "https://liceosantander.edu.co/platform.html?user="+ user + "&pass=" + pass;
    }
}

function GetURLParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
     {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
    }
}

function permitir()
{
    validar = false;
    
    var archivo = new XMLHttpRequest();
    archivo.open('GET', "/users/info.txt", false); // false for synchronous request
    archivo.send(null);
    
    var info = archivo.responseText;
    
    info = info.split("\n");
    
    var user = GetURLParameter('user');
    var pass = GetURLParameter('pass');
    
    if (info.length > 0)
    {
        for (i=0; i < info.length; i++)
        {
            u = info[i].split(",")[0].replace("{", "");
            p = info[i].split(",")[1].replace("}", "");
            n = info[i].split(",")[2].replace("}", "");
            
            if(u == user && p == pass)
            {
                validar = true;
            }
        }
    }
    
    if (validar == false)
    {
        window.location.href = "https://liceosantander.edu.co/login.html";
        alert("Usuario y contrasena incorrectos");
    }

}

function nombre()
{
    var archivo = new XMLHttpRequest();
    archivo.open('GET', "/users/info.txt", false); // false for synchronous request
    archivo.send(null);
    
    var info = archivo.responseText;
    
    info = info.split("\n");
    
    var user = GetURLParameter('user');
    var pass = GetURLParameter('pass');
    
    if (info.length > 0)
    {
        for (i=0; i < info.length; i++)
        {
            u = info[i].split(",")[0].replace("{", "");
            p = info[i].split(",")[1].replace("}", "");
            n = info[i].split(",")[2].replace("}", "");
            
            
            if(u == user && p == pass)
            {
                validar = true;
                document.getElementById("nombre").innerHTML = n;
            }
        }
    }   
}

function platform(dir)
{
    
    if(dir == "documentos/")
    {
        document.getElementById("atras").disabled = true;
    }
    else
    {
        document.getElementById("atras").disabled = false;
    }
    ficheros = abrir(dir);
    
    ficheros = ficheros.split('"');
    
    if(ficheros.length == 7)
    {
        var html = "<table id='tabla-archivos' style='padding-bottom: 173px'><tbody><tr><th colspan='3'><hr></th></tr>";
    } else if(ficheros.length == 5) // carpeta vacia
    {
        var html = "<table id='tabla-archivos' style='padding-bottom: 199px'><tbody><tr><th colspan='3'><hr></th></tr>";
    } else if(ficheros.length == 9)
    {
        var html = "<table id='tabla-archivos' style='padding-bottom: 120px'><tbody><tr><th colspan='3'><hr></th></tr>";
    } else if(ficheros.length == 11)
    {
        var html = "<table id='tabla-archivos' style='padding-bottom: 67px'><tbody><tr><th colspan='3'><hr></th></tr>";
    } else if(ficheros.length == 13)
    {
        var html = "<table id='tabla-archivos' style='padding-bottom: 14px'><tbody><tr><th colspan='3'><hr></th></tr>";
    } else
    {
        var html = "<table id='tabla-archivos'><tbody><tr><th colspan='3'><hr></th></tr>";
    }
    
    var html_c = "";
    var html_f = "";
    if(ficheros.length > 5){
        for(i=1; i<ficheros.length; i=i+2)
        {
            if(ficheros[i].includes("/.") == false)
            {
                ubicacion = ficheros[i].replace("/public_html/", "");
                elemento = ubicacion.replace(dir, "");
                
                if(elemento.includes("."))
                {
                    var extension = elemento.split(".");
    
                    if(extension[1] == "doc" || extension[1] == "docx")
                    {
                        var icono = '<i class="fas fa-file-word"></i>';
                        var clase = 'word';
                        var clase_ico = "word_ico";
                    }
    
                    if(extension[1] == "xls" || extension[1] == "xlsx")
                    {
                        var icono = '<i class="fas fa-file-excel"></i>';
                        var clase = 'excel';
                        var clase_ico = "excel_ico";
                    }
    
                    if(extension[1] == "pdf")
                    {
                        var icono = '<i class="fas fa-file-pdf"></i>';
                        var clase = 'pdf';
                        var clase_ico = "pdf_ico";
                    }
    
                    if(extension[1] == "jpg" || extension[1] == "jpeg" || extension[1] == "png" || extension[1] == "JPG")
                    {
                        var icono = '<i class="fas fa-file-image"></i>';
                        var clase = 'imagen';
                        var clase_ico = "imagen_ico";
                    }
    
                    if(extension[1] == "txt" || extension[1] == "js" || extension[1] == "html" || extension[1] == "php" || extension[1] == "css")
                    {
                        var icono = '<i class="fas fa-file-code"></i>';
                        var clase = 'archivo';
                        var clase_ico = "archivo_ico";
                    }
                    html_f = html_f +   '<tr class="'+ clase + '"">'+
                                            '<td class="' + clase_ico + '" valign="top">'+
                                                icono +
                                            '</td>'+
                                            '<td class="nombres">'+
                                                elemento +
                                            '</td>'+
                                            '<td class="abrir-carpetas" >'+
                                                '<button id="abrir" onclick="abrirarchivo(' + "'" + ubicacion + "'" +  ')">Abrir</button>' +
                                                '<button id="abrir" onclick="eliminararchivo(' + "'" + ubicacion + "'" +  ')">Eliminar</button>'
                                            '</td>'+
                                        '</tr>';
                }   else
                {
                   html_c = html_c +   '<tr class="carpetas">'+
    	                                    '<td class="carpetas-ico" valign="top">'+
    	                                        '<i class="fas fa-folder-open"></i>'+
    	                                    '</td>'+
    	                                    '<td class="nombres">'+
    	                                        elemento.replace('/',"") +
    	                                    '</td>'+
    	                                    '<td class="abrir-carpetas">'+
    	                                        '<button id="abrir" onclick="platform(' + "'" + ubicacion + "/'" +  ')">Abrir</button>' +
    	                                        '<button id="abrir" onclick="eliminarcarpeta(' + "'" + ubicacion + "/'" +  ')">Eliminar</button>' +
                                                '<button id="abrir" onclick="renombrar(' + "'" + ubicacion + "/'" +  ')">Renombrar</button>' +
    	                                    '</td>'+
                                    	'</tr>'; 
                }
            }
        }
    } else
    {
       html_c = html_c +    '<tr>'+
    	                        '<td>'+
    	                            "CARPETA VACIA"+
    	                        '</td>'+
    	                    '</tr>';  
    }
    
    html = html + html_c + html_f + "</table></tbody>";
    document.getElementById("tabla-elementos").innerHTML = html;
    document.getElementById("direccion").innerHTML = dir;
}

/*========================================================================================EMPIEZA CARGAR Y MODIFICAR==========================================================*/
async function cargararchivo()
{
    var direccion = document.getElementById("direccion").innerHTML;
    
    let file2 = document.getElementById("fileupload").files[0];
    
    let formData = new FormData();
    formData.append("file2", file2);
    
    var request = new XMLHttpRequest();
    await request.open('POST', 'php/upload.php?dir=' + direccion, false); // false for synchronous request
    request.send(formData);

    platform(direccion);
    
};

async function crearcarpeta(pass)
{   
    var direccion = document.getElementById("direccion").innerHTML;
    var nombre = document.getElementById("newfolder").value;
    
    let file2 = document.getElementById("fileupload").files[0];
    
    let formData = new FormData();
    formData.append("file2", file2);
    
    var request = new XMLHttpRequest();
    await request.open('POST', 'php/crear.php?dir=' + direccion + '&nombre=' + nombre, false); // false for synchronous request
    request.send(formData);

    platform(direccion);
    
};

async function eliminararchivo(dir)
{   
    var confirmar = confirm("Desea eliminar el archivo?");
    var direccion = dir;
    var nombre = document.getElementById("newfolder").value;
    
    if(confirmar == true)
    {
        let file2 = document.getElementById("fileupload").files[0];
        
        let formData = new FormData();
        formData.append("file2", file2);
        
        var request = new XMLHttpRequest();
        await request.open('POST', 'php/eliminararchivo.php?dir=' + direccion, false); // false for synchronous request
        request.send(formData);
        
        platform(document.getElementById("direccion").innerHTML);
    }
};

async function eliminarcarpeta(dir)
{   
    var confirmar = confirm("Desea eliminar la carpeta?");
    var direccion = dir;
    var nombre = document.getElementById("newfolder").value;
    
    if(confirmar == true)
    {
        ficheros = abrir(dir);
        ficheros = ficheros.split('"');
        
        if(ficheros.length > 5)
        {
            alert("Para eliminar un carpeta esta debe estar vac«¿a");    
        } else
        {
            let file2 = document.getElementById("fileupload").files[0];
            
            let formData = new FormData();
            formData.append("file2", file2);
            
            var request = new XMLHttpRequest();
            await request.open('POST', 'php/eliminarcarpeta.php?dir=' + direccion, false); // false for synchronous request
            request.send(formData);
            
        }
    
        platform(document.getElementById("direccion").innerHTML);
    }
      
};

async function renombrar(old)
{
    var result = prompt("Nuevo nombre:");
    var direccion = document.getElementById("direccion").innerHTML;
    
    var nuevo = direccion + result;
    
    let file2 = document.getElementById("fileupload").files[0];
            
    let formData = new FormData();
    formData.append("file2", file2);

    var request = new XMLHttpRequest();
    await request.open('POST', 'php/renombrar.php?old=' + old + '&&new=' + nuevo, false); // false for synchronous request
    request.send(formData);
    
    platform(document.getElementById("direccion").innerHTML);
};

/*========================================================================================CORREO================================================================================*/
function correo()
{
    var nombre = document.getElementById("nombre").value;
    var email = document.getElementById("email").value;
    var mensaje = document.getElementById("mensaje").value;
    
    console.log(nombre);
    console.log(email);
    console.log(mensaje);
    
    Email.send({
        Host : "mail.liceosantander.edu.co",
        Username : "contacto@liceosantander.edu.co",
        Password : "Olimpia1992",
        To : "liceosantander@yahoo.es",
        From : "contacto@liceosantander.edu.co",
        Subject : "Correo de Contactos: " + nombre,
        Body : "<html><h2>Contactenos</h2><strong>Mensaje</strong><br></br><em>" + mensaje + "</em></html><br></br>" + email
    }).then(
      message => alert(message)
    );
    
    Email.send({
        Host : "mail.liceosantander.edu.co",
        Username : "contacto@liceosantander.edu.co",
        Password : "Olimpia1992",
        To : email,
        From : "contacto@liceosantander.edu.co",
        Subject : "Mensaje enviado",
        Body : "Su mensaje ha sido enviado al I.E.D Liceo Santander"
    }).then(
      message => alert(message)
    );

    alert("Correos enviados");

    document.getElementById("nombre").value = "";
    document.getElementById("email").value = "";
    document.getElementById("mensaje").value = "";
}

/*==================================================================================INSTITUCIONAL================================================================================*/
function institucionales()
{
    window.location.href = "https://liceosantander.edu.co/documentos.html?bool=1";
}
