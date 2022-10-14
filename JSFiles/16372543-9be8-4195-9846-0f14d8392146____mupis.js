var intervalID;
var screen_bussy_intervalID;
var Sending_program_intervalID;

var ip_service ="192.168.20.50"
var port_service ="8082"

var SendingImage=false;
var Counter_Program=0;

var ScreenInfo;
var MediaInfo;
$(document).ready(function(){   
    
    screen_change()
});
var counter=1;
function retry_connection(){
    
    ScreenInfo = cantidad_programa();
    if(ScreenInfo.response_status==404){
        counter=counter+1;
        console.log("Still not connection",counter);
        $('#loader.loader').removeClass('loader2');
        $('#loader').addClass('loader');
        $('#loader').css('display','block')
        intervalID =  setTimeout(retry_connection, 5000);
    }
    else{
        $('#loader').css('display','none')
        console.log("connected")
        clearTimeout(intervalID);
        seccion(ScreenInfo.cantidad_programas); 
        pantallas()

    }
}
function estado_remoto(){
    var id = $('#select_pantalla_remote').val();
    $.ajax({
        url: "estado_remoto.php",
        type: "GET",
        data: {
            id_pantalla : id,
            db_port : ScreenInfo.db_port,
            host_ip : ScreenInfo.host_ip
        },
        async: false,
        success: function(data)
        {
            datos = data;
            
        },
        error: function(err){
            console.log("error ccargando cantidad de programas",err)
        }
    });
    return datos;
}
function screen_bussy(){
    let datos = estado_remoto();
    console.log(datos)
    if(datos.response_status==404){
        
        console.log("Not db connection");

        clearTimeout(screen_bussy_intervalID);
        intervalID =  setTimeout(retry_connection, 5000);
        
    }else{
        if(datos.estado_remoto==0){
            $('#loader').css('display','none')

            clearTimeout(screen_bussy_intervalID);
            console.log("NOT BUSSY")
            SendingImage=false

        }else{
            screen_bussy_intervalID =  setTimeout(screen_bussy, 4000);

            SendingImage=true
            $('#loader.loader').removeClass('loader');
            $('#loader').addClass('loader2');
            console.log("Still bussy",counter);
            $('#loader').css('display','block')
        }
    }
}
$("#subir").click(function() {
    var formdata = new FormData($('#fileupload')[0]);  
    $.ajax({
        url: "uploadfile.php",
        type: "POST",
        data: formdata,
        async: true,
        contentType: false,
        cache: false,
        processData:false,
        success: function(data)
        {                  
            var comprobar = $.parseJSON(data);
            switch (comprobar){
                case "Este archivo no es una imagen":
                    alert('Este no es un archivo multimedia');
                    break;
                case "Este archivo ya existe.":
                    alert(comprobar);
                    break;
                case "Solo se permite GIF como formato permitido.":
                    alert('Solo se permite GIF, PNG, JPG, JPEG, MP4, FLV como formato permitido.');
                    break;
                case "El archivo pesa demaciado.":
                    alert(comprobar);
                    break;
                case " Error al intentar subir este archivo.":
                    alert(comprobar);
                    break;
                default:        
                                                                               
                    pantallas();             
            }           
        }         
    });   
});
$('#select_pantalla_remote').change(function(){
   
    $("#seccion").empty();    


    clearTimeout(screen_bussy_intervalID);
    clearTimeout(Sending_program_intervalID)
    clearTimeout(intervalID);
    SendingImage=false
    Counter_Program=0
    ScreenInfo.ScreenInfo_remote = cantidad_programa_remota();
    console.log(ScreenInfo)
    if(ScreenInfo.ScreenInfo_remote["response_status"]==404){
        intervalID =  setTimeout(retry_connection, 5000);
    }  
    else{
        seccion(ScreenInfo.ScreenInfo_remote["cantidad_programas"]); 
        pantallas()
    }
    
});

function screen_change(){

    clearTimeout(screen_bussy_intervalID);
    clearTimeout(Sending_program_intervalID)
    clearTimeout(intervalID);
    SendingImage=false
    Counter_Program=0
    ScreenInfo = cantidad_programa();

    $('#loader.loader').removeClass('loader2');
    $('#loader').addClass('loader');
    $('#loader').css('display','block')
    if(ScreenInfo){
        if(ScreenInfo.response_status==404){
            intervalID =  setTimeout(retry_connection, 5000);
        }  else{
            seccion(ScreenInfo.cantidad_programas); 

            get_on_off_status()
            pantallas()

            $('#loader').css('display','none')

        }
    }else{
        console.log("something wrong with screen id");
    }
}

$('#selectpantalla').change(function(){
    $("#seccion").empty();    
    screen_change()
    
});

function pantallas(){

    // WE LOAD MEDIA FROM LOCAL SERVER
    data={
        screen_id: $('#selectpantalla').val(),
        db_port : "5432",
        host_ip : "localhost"
    }

    $.ajax({
        url: "showfile.php",
        type: "POST",
        data: data,
        async: true,
        success: function(data)
        {                  
            var mostrar = data.media_array;
            var ruta = "../CONTROLADORES/MEDIA/GIFS/";          
            $(".gif").remove();
            //LOAD MEDIA IN SERVER
            if(mostrar){
                for (i=0; i < mostrar.length ; i++){
                    var file = (mostrar[i].name_multimedia);
                    var id_media=mostrar[i].id_multimedia;
                    var formato = file.split('.');
                    formato = formato[1];
                    if(formato === "gif"){
                        $("#galeria").append('<img id="'+id_media+'" class="gif" src="'+ruta+file+'" alt="" title="'+file+'" style=" width: 200px; height: 150px; padding: 5px; cursor:pointer">');
                    }
                    else if (formato === "mp4" || formato === "flv"){
                        $("#videos").append('<video muted autoplay id="'+id_media+'" src="'+ruta+file+'" type="video/mp4" class="gif" style=" width: 200px; height: 150px; padding: 5px; cursor:pointer">');
                   
                    }
                    else {
                        $("#imagenes").append('<img id="'+id_media+'" class="gif" src="'+ruta+file+'" alt="" title="'+file+'" style=" width: 200px; height: 150px; padding: 5px; cursor:pointer">');
                    }                                                     
                }  
            }
            // LOAD MEDIA OF SCREEN
            var cursor = cargar_programa();
            asignar_programa(cursor);
            
        }       
    });

    screen_bussy_intervalID =  setTimeout(screen_bussy, 200);
    
}
var MediaInfo_array;
$("#enviar").click(function (){ 
    
                

    if(SendingImage){
        alert("pantalla ocupada")
        return;
    }
    SendingImage=true

    MediaInfo_array=MediaInfo.media_inf_array

    Sending_program_intervalID =  setTimeout(main_send_program, 200);

})
function main_send_program(){
    if(!MediaInfo_array){

        clearTimeout(Sending_program_intervalID)
        Counter_Program=0
        SendingImage=false
        console.log("NO PROGRAMS LOADED")
        return
    }
    

    let before_program=Counter_Program-1
    if(before_program<0){
        before_program=0;
    }
    if(ScreenInfo["is_server_ip"]=='t'){

        data={
            screen_id: $('#select_pantalla_remote').val(),
            db_port : ScreenInfo.db_port,
            host_ip : ScreenInfo.host_ip,
            program_id:MediaInfo_array[before_program].id_programa
        }
    }else{
        data={
            screen_id: $('#selectpantalla').val(),
            db_port : "5432",
            host_ip : "localhost",
            program_id:MediaInfo_array[before_program].id_programa
        }
    }
    console.log(data)
    var estado=0;
    $.ajax({
        url: "get_sending_status.php",
        type: "POST",
        data: data,
        async: false,
        success: function(datos)
        {
            console.log("STATUS", datos);
            estado=datos.estado
            progress=datos.progress

            let programa=parseInt(MediaInfo_array[before_program].id_programa,10)+1
            console.log("PROGRM",programa,progress+" %")
            $('#porcentaje'+programa).text(progress+" %");
        },
        error: function(err){
            console.log("ERROR ",err)
            console.log('esta pantalla no tiene nigun programa'); 
            limpiar_programa();
            programa = 0;
        }
    });
    if(estado==0){

        $('#loader').css('display','none')

        if(Counter_Program>=(MediaInfo_array.length)){
            clearTimeout(Sending_program_intervalID)
            Counter_Program=0
            SendingImage=false
            console.log("END")
            return
        }
        if(Counter_Program>=(ScreenInfo.cantidad_programas)){
            clearTimeout(Sending_program_intervalID)
            Counter_Program=0
            SendingImage=false
            console.log("END")
        }
        if(MediaInfo_array[Counter_Program].progress==100){
            console.log("Media already updated")
            Counter_Program=Counter_Program+1
            Sending_program_intervalID =  setTimeout(main_send_program, 200); 
            return;
        }
        var formato = MediaInfo_array[Counter_Program].name_multimedia.split('.');

        var extension = formato[1];
        var type_media='GIFS';
        if(extension=='jpg' || extension=='jpeg' || extension=='png' || extension=='JPEG' || extension=='JPG' ){
            type_media='IMAGES';
        }else if(extension=='gif' || extension=='GIF'){
            type_media='GIFS';
        }else if(extension=='avi' || extension=='mp4' || extension=='flv'){
            type_media='VIDEO';

        }
        let id_remote=$('#select_pantalla_remote').val();
        if(id_remote==null)
        {
            id_remote=0;
        }
        url_service="http://"+ip_service+":"+port_service+"/rest/screens/send/"+MediaInfo_array[Counter_Program].name_multimedia+"/0/"+type_media+"/"+
        MediaInfo_array[Counter_Program].id_programa+"/"+$('#selectpantalla').val()+"/"+MediaInfo_array[Counter_Program].id_multimedia+"/"+id_remote
        console.log(url_service)
        Counter_Program=Counter_Program+1
        $.ajax({
            url: url_service,
            type: "GET",
            async: false,
            timeout: 5000, 
            success: function(data)
            {
                console.log("SUCCESS UPLOAD PRIGRAM ", data )  
                if(data=="connect failed"){
                    alert("Existen problemas con la conexión a la tarjeta controladora de la pantalla")
                    clearTimeout(Sending_program_intervalID)
                    Counter_Program=0
                    SendingImage=false
                    alert("Operación terminada...")

                } 

            },
            error: function(err){
                
                console.log("error ccargando cantidad de programas",err)
            }
        });
    }else{
        console.log("screen_is_bussy")

        $('#loader.loader').removeClass('loader');
        $('#loader').addClass('loader2');
        $('#loader').css('display','block')
        
    }

    if(SendingImage){
        Sending_program_intervalID =  setTimeout(main_send_program, 200);
    }
}

$('#force_clear_button').click(function(){
    if(ScreenInfo) 
    {
        if(confirm("Desea limpiar los programas de la pantalla?"))
        {
            if(confirm("Este proceso borra los datos directamente de la base de datos e intenta "+
            "limpiar la pantalla, está seguro de proceder?")){
                if(ScreenInfo["is_server_ip"]=='t'){

                    data={
                        screen_id: $('#select_pantalla_remote').val(),
                        db_port : ScreenInfo.db_port,
                        host_ip : ScreenInfo.host_ip
                    }
                }else{
                    data={
                        screen_id: $('#selectpantalla').val(),
                        db_port : "5432",
                        host_ip : "localhost"
                    }
                }
        
                var remote_id = 0;
                if(ScreenInfo.is_server_ip=='t'){
                    remote_id=$('#select_pantalla_remote').val()
                }
                var local_id = $("#selectpantalla").val();
                let url="http://"+ip_service+":"+port_service+"/rest/screens/clear_screen/"+local_id+"/"+remote_id
                $.ajax({
                    url: url,
                    type: "GET",
                    async: false,
                    success: function(data)
                    {              
                        console.log(data)
                        if(ScreenInfo["is_server_ip"]=='t'){
        
                            to_send={
                                screen_id: $('#select_pantalla_remote').val(),
                                db_port : ScreenInfo.db_port,
                                host_ip : ScreenInfo.host_ip
                            }
                        }else{
                            to_send={
                                screen_id: $('#selectpantalla').val(),
                                db_port : "5432",
                                host_ip : "localhost"
                            }
                        }
                        console.log(to_send)
                        $.ajax({
                            url: "clear_programs.php",
                            type: "GET",
                            async: false,
                            data: to_send,
                            success: function(data)
                            {              
                                alert("Tarjeta reseteada")
                                console.log(data)
                            },
                            error: function(err){
                                alert("Hubo un error con el servicio")
                                console.log(err)
                            }           
                        });

                        if(MediaInfo.media_inf_array)
                        {
                            var imagen = "../CONTROLADORES/MEDIA/GIFS/seccion/negro.jpg";
                            for(let kk=0; kk<MediaInfo.media_inf_array.length;kk++){
                               
                                $('#porcentaje'+(parseInt(MediaInfo.media_inf_array[kk].id_programa, 10)+1)).text(" %");
                             
                                $("#seccion"+(parseInt(MediaInfo.media_inf_array[kk].id_programa, 10)+1)).attr('src',imagen);
                            
                            }
                        }
                        MediaInfo.media_inf_array=[]
                        
                    },
                    error: function(err){
                        alert("Hubo un error con el servicio")
                        console.log(err)
                    }           
                });
            }
        }

        
    }
});
$('#boton-onoff').click(function(){
    $('<div>¿Esta seguro que desea encender/apagar la pantalla?</div>').dialog({         
        modal: true, title: 'CONFIRMACIÓN', zIndex: 1000, autoOpen: true,
        width: '170px', resizable: false,
        buttons: {
            SI: function () { 
                servicio_encender();
                $(this).dialog("close");
            },
            No: function () {
                $(this).dialog("close");
            }
        }
    });  
});
function get_on_off_status(){          

    if(ScreenInfo["is_server_ip"]=='t'){

        data={
            screen_id: $('#select_pantalla_remote').val(),
            db_port : ScreenInfo.db_port,
            host_ip : ScreenInfo.host_ip
        }
    }else{
        data={
            screen_id: $('#selectpantalla').val(),
            db_port : "5432",
            host_ip : "localhost"
        }
    }
    var urlstateon = 'stateon.php';
    $.ajax({
        url: "stateon.php",
        type: "POST",
        data: data,
        async: false,
        success: function(datos)
        {
            var encendido=datos.is_on
            if(encendido === '1'){
                $('#boton-onoff').attr('class', 'boton-off btn');
                $('.boton-off').text('OFF'); 
                $('.texto-on').text('La pantalla se encuentra encendida');
                
            }
            else if (encendido === '0') {
                $('#boton-onoff').attr('class', 'boton-on btn');
                $('.boton-on').text('ON');
                $('.texto-on').text('La pantalla se encuentra apagada');
            }
        },
        error: function(err){
            console.log("DONEEE ",err);

        },
    });         
}

function servicio_encender(){
    var servicio;
    var valor_on = $('#boton-onoff').text();
//    console.log(valor_on);
    if (valor_on === 'ON'){
        servicio = "http://"+ip_service+":"+port_service+"/rest/screens/turn_on_screen/";
    }
    else if (valor_on === 'OFF'){
        servicio = "http://"+ip_service+":"+port_service+"/rest/screens/turn_off_screen/";
    }

    let remote_ip="0"
    let screen_ip=$('#selectpantalla').val()
    if(ScreenInfo.is_server_ip=='t'){
        remote_ip=$('#select_pantalla_remote').val()
        
    }
    var url = servicio+screen_ip+"/"+remote_ip
    console.log(url)
        
    $.ajax({
        url: url,
        type: "GET",
        async: false,
        success: function(data)
        {
            get_on_off_status()
            alert("DONE ON/OFF")                                              

        },
        error: function(err){
            
            alert("Error with service")
        }
    });

    
}


function seccion(maximo){
    var cantidad = 1;
    var identificador, porcentaje;
    var imagen = "../CONTROLADORES/MEDIA/GIFS/seccion/negro.jpg";
    while (cantidad <= maximo){
        identificador = 'seccion'+cantidad;
        porcentaje = 'porcentaje'+cantidad;
        $('#seccion').append('<div class="contenedor col-md-3 col-sm-6">\n\
                                <div class="contedenor">\n\
                                    <img id="'+identificador+'" class="seccion programa" src="'+imagen+'" alt=""\n\
                                </div>\n\
                                <div class="contenido">\n\
                                    <span class="numprograma">'+cantidad+'</span>\n\
                                </div>\n\
                                <div class="contenido1">\n\
                                    <span id="'+porcentaje+'" class="porcentaje">%</span>\n\
                                </div>\n\
                              </div>');
        cantidad++;
    }
}
function cargar_programa(programa){
    if(ScreenInfo["is_server_ip"]=='t'){

        data={
            screen_id: $('#select_pantalla_remote').val(),
            db_port : ScreenInfo.db_port,
            host_ip : ScreenInfo.host_ip
        }
    }else{
        data={
            screen_id: $('#selectpantalla').val(),
            db_port : "5432",
            host_ip : "localhost"
        }
    }

    $.ajax({
        url: "programa.php",
        type: "POST",
        data: data,
        async: false,
        success: function(datos)
        {
            MediaInfo=datos;
            var media_info=datos.media_inf_array;
            var ruta = "../CONTROLADORES/MEDIA/GIFS/";
            if (media_info === null){            
                console.log('esta pantalla no tiene nigun programa'); 
                limpiar_programa();
                programa = 0;
            }
            else {            
                limpiar_programa();
                for (var i=0; i < media_info.length; i++ ){
                    var file = (media_info[i].name_multimedia);
                    var formato = file.split('.');

                    var extension = formato[1];
                    var gif = file;
                    let programa=parseInt(media_info[i].id_programa,10)+1

                    if (extension === "mp4" || extension === "flv"){
                        $("#seccion"+programa).attr('alt',ruta+gif);
                        gif = "/seccion/icono-video.jpeg";
                        $("#seccion"+programa).attr('src',ruta+gif);
                        
                    } 
                    else {
                        $("#seccion"+programa).attr('src',ruta+gif);
                    }

                    $('#porcentaje'+programa).text(media_info[i].progress+" %");
                }
            }
        },
        error: function(err){
            console.log("ERROR ",err)
            console.log('esta pantalla no tiene nigun programa'); 
            limpiar_programa();
            programa = 0;
        }
    });
    return programa;
}

function limpiar_programa(){
    var imagen = "../CONTROLADORES/MEDIA/GIFS/seccion/negro.jpg";
    var cantidad = 1;
    

    while (cantidad <= ScreenInfo.cantidad_programas){
        $('#seccion'+cantidad).attr('src',imagen);
        cantidad++;
    }
}
function cantidad_programa_remota(){
    var id = $('#select_pantalla_remote').val();
    $.ajax({
        url: "cantidad_remota.php",
        type: "GET",
        data: {
            id_pantalla : id,
            db_port : ScreenInfo.db_port,
            host_ip : ScreenInfo.host_ip
        },
        async: false,
        success: function(data)
        {
            datos = data;
            
        },
        error: function(err){
            console.log("error ccargando cantidad de programas",err)
        }
    });
    return datos;
}

function cantidad_programa(){
    var id = $('#selectpantalla').val();
    var datos={
        response_status:404
    };
    $.ajax({
        url: "cantidad.php",
        type: "GET",
        data: {
            id_pantalla : id
        },
        async: false,
        success: function(data)
        {
            datos = data;
            if(data.is_server_ip=='t'){
                var select = document.getElementById("select_pantalla_remote");
                var length = select.options.length;
                for (i = length-1; i >= 0; i--) {
                    select.options[i] = null;
                }
                for(let i=0;i<data.pantallas_ids.length;i++){

                    let opt = document.createElement("option");
                    opt.value= data.pantallas_ids[i];
                    opt.innerHTML = data.direccion[i];
                    select.appendChild(opt);
                }

                document.getElementById("remote_selector_container").hidden=false;
            }else{
                var select = document.getElementById("select_pantalla_remote");
                var length = select.options.length;
                for (i = length-1; i >= 0; i--) {
                    select.options[i] = null;
                }
                document.getElementById("remote_selector_container").hidden=true;
            }
        },
        error: function(err){
            var select = document.getElementById("select_pantalla_remote");
            var length = select.options.length;
            for (i = length-1; i >= 0; i--) {
                select.options[i] = null;
            }

            document.getElementById("remote_selector_container").hidden=true;
            datos.response_status=404
            //alert("Screen can't connect, trying again")
        }
    });
    return datos;
}

function asignar_programa(cursor){

    var seccion;
    if (cursor){
        seccion = cursor + 1;
    }
    else {
        seccion = 1;
    }

    var toggle_select_box=false;
    var seccion_selected=1;

    let ruta = "../CONTROLADORES/MEDIA/GIFS/"; 
    var seccionactual, seccionfinal ;            
    var imagen = "../CONTROLADORES/MEDIA/GIFS/seccion/negro.jpg";

    var previous_image, previous_progress,previous_extension,previous_seccion;
    var geting_previous=true;

    $(".seccion").click(function(){
       

            
        //DELETES MEDIA FROM CANVAS, IF YOU SEND BLACK PROGRAM SCREEN EMPTY THAT PROGRAM
        if(toggle_select_box){

            toggle_select_box=!toggle_select_box
            if(MediaInfo.media_inf_array)
            {
                for(let kk=0; kk<MediaInfo.media_inf_array.length;kk++){
                    //SI SELECCIONA LA MISMA SECCIóN
                    if(MediaInfo.media_inf_array[kk].id_programa==(seccion_selected-1))
                    {
                        previous_image=ruta+MediaInfo.media_inf_array[kk].name_multimedia
                        previous_progress=MediaInfo.media_inf_array[kk].progress
                        previous_extension=MediaInfo.media_inf_array[kk].name_multimedia.split('.');
                        previous_extension = previous_extension[1];
                        $('#porcentaje'+seccionactual).text(MediaInfo.media_inf_array[kk].progress+" %");
                        if (previous_extension === "mp4" || previous_extension === "flv"){
                            gif = "/seccion/icono-video.jpeg";
                            $("#seccion"+seccion_selected).attr('src',ruta+gif);
                        } 
                        else {
                            $("#seccion"+seccion_selected).attr('src',previous_image);
                        }
                        break;
                    }
                }
            }else{

                $('#porcentaje'+seccionactual).text("%");
            }
        }

        $('#porcentaje'+seccionactual).text("%");
        seccionfinal = seccion;
        
        seccionactual = $(this).attr('id').replace('seccion',''); //OBTAIN ID
        seccion_selected=seccionactual
        if(!toggle_select_box){
            let confirm_resp; 
            if($("#porcentaje"+seccion_selected).text()=="100 %"){
                confirm_resp=confirm("Gif already uploaded to screen, delete anyway?");
                if(!confirm_resp){
                
                    console.log("DO NOTHING")
                    return  
                }else{
                    $(this).attr('src',imagen);
                    $('#porcentaje'+seccionactual).text("SELECT GIF");
                    toggle_select_box=!toggle_select_box
                }
            }else{

                $(this).attr('src',imagen);
                $('#porcentaje'+seccionactual).text("SELECT GIF");
                toggle_select_box=!toggle_select_box
            }

            

        }
        if (seccion > seccionactual ){
            seccion = seccionactual;
        } 
    });
    $(".gif").click(function(){
        //LLAMAR EL SERVICIO QUE SUBA LA IMÄGEN POR Mí

        geting_previous=true
        var file_media=$(this).attr("src");

        var file_name = $(this).attr("src").split('/')[4];

        var extension = $(this).attr("src").split('.');
            extension = extension[3];
        if(toggle_select_box){
            let is_already_uploaded=false
            if(MediaInfo.media_inf_array)
            {    
                for(let kk=0; kk<MediaInfo.media_inf_array.length;kk++){
                    
                    if(MediaInfo.media_inf_array[kk].id_programa==(seccion_selected-1))
                    {
                        if(geting_previous){
                            geting_previous=!geting_previous
                            previous_image=ruta+MediaInfo.media_inf_array[kk].name_multimedia
                            previous_progress=MediaInfo.media_inf_array[kk].progress
                            previous_extension=MediaInfo.media_inf_array[kk].name_multimedia.split('.');
                            previous_extension = previous_extension[1];
                        }

                        if(MediaInfo.media_inf_array[kk].id_multimedia==$(this).attr("id")){

                            is_already_uploaded=!is_already_uploaded

                            toggle_select_box=!toggle_select_box

                            
                            $('#porcentaje'+seccionactual).text(MediaInfo.media_inf_array[kk].progress+" %");
                            if (extension === "mp4" || extension === "flv"){
                                gif = "/seccion/icono-video.jpeg";
                                $("#seccion"+seccion_selected).attr('src',ruta+gif);
                            } 
                            else {
                                $("#seccion"+seccion_selected).attr('src',file_media);
                            }  
                            break;
                        }
                    }

                }
            }
            if(is_already_uploaded){
                alert("THIS MEDIA IS ALREADY UPLOADED")
                return;
            }
            toggle_select_box=!toggle_select_box
            
            if(ScreenInfo["is_server_ip"]=='t'){

                data_out={
                    screen_id: $('#select_pantalla_remote').val(),
                    db_port : ScreenInfo.db_port,
                    host_ip : ScreenInfo.host_ip,
                    program_id:(seccion_selected-1),
                    multimedia_id:$(this).attr("id")
                }
            }else{
                data_out={
                    screen_id: $('#selectpantalla').val(),
                    db_port : "5432",
                    host_ip : "localhost",
                    program_id:(seccion_selected-1),
                    multimedia_id:$(this).attr("id")
                }
            }
               
            if(ScreenInfo["is_server_ip"]=='t'){
                console.log("http://"+ip_service+":"+port_service+"/rest/screens/send_image_to_remote/"+data_out.multimedia_id+"/"+$('#selectpantalla').val())
                $.ajax({
                    url: "http://"+ip_service+":"+port_service+"/rest/screens/send_image_to_remote/"+data_out.multimedia_id+"/"+$('#selectpantalla').val(),
                    type: "GET",
                    async: false,
                    success: function(data)
                    {
                        console.log("SUCCESS ", data )
                        
                        id_prog=seccionactual-1
                        //AQUI ACTUALIZAR MediaInfo.media_inf_array
                        if(!MediaInfo.media_inf_array){
                            MediaInfo.media_inf_array=[]
                        }

                        MediaInfo.media_inf_array.push(                            {
                            id_programa:id_prog.toString(),
                            id_multimedia: data_out.multimedia_id,
                            progress: "0",
                            name_multimedia: file_name
                        })
                        $('#porcentaje'+seccionactual).text("0 %");
                        if (extension === "mp4" || extension === "flv"){
                            gif = "/seccion/icono-video.jpeg";
                            $("#seccion"+seccion_selected).attr('src',ruta+gif);
                        } 
                        else {
                            $("#seccion"+seccion_selected).attr('src',file_media);
                        }  
                        update_program_db(data_out)
                    },
                    error: function(err){
                        $('#porcentaje'+seccionactual).text(previous_progress+" %");
                        if (previous_extension === "mp4" || previous_extension === "flv"){
                            gif = "/seccion/icono-video.jpeg";
                            $("#seccion"+seccion_selected).attr('src',ruta+gif);
                        } 
                        else {
                            $("#seccion"+seccion_selected).attr('src',previous_image);
                        } 
                        alert("There are problems with the service")
                        console.log("error ccargando cantidad de programas",previous_image)
                    }
                });
            }else{
                //AQUI ACTUALIZAR MediaInfo.media_inf_array
                id_prog=seccionactual-1
                if(!MediaInfo.media_inf_array){
                    MediaInfo.media_inf_array=[]
                }
                
                MediaInfo.media_inf_array.push({
                    id_programa:id_prog.toString(),
                    id_multimedia: data_out.multimedia_id,
                    progress: "0",
                    name_multimedia: $file_name
                })
		
                
                if (extension === "mp4" || extension === "flv"){
                    gif = "/seccion/icono-video.jpeg";
                    $("#seccion"+seccion_selected).attr('src',ruta+gif);
                } 
                else {
                    $("#seccion"+seccion_selected).attr('src',file_media);
                }  
                $('#porcentaje'+seccionactual).text("0 %");
                update_program_db(data_out)
            }
          

                                     
        }
                    
    });

    function update_program_db(data_out){
        $.ajax({
            url: "updata_media_program.php",
            type: "POST",
            data: data_out,
            async: false,
            success: function(data)
            {
               
                datos = data;
                console.log("success",data);

               
            },
            error: function(err){
                console.log("error ccargando cantidad de programas",err)
            }
        });
    }
}
