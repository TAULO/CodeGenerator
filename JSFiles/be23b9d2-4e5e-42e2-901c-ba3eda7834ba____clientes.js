(function( $ ){
    
   
   /*
    * Handle input. Call public functions and initializers
    */
   
    $.fn.clientes = function(data){
        var _this = $(this);
        var plugin = _this.data('clientes');
        
        /*Inicializado ?*/
        if (!plugin) {
            
            plugin = new $.clientes(this, data);
            
            _this.data('clientes', plugin);
            
            return plugin;
        /*Si ya fue inizializado regresamos el plugin*/    
        }else{
            return plugin;
        }
        
    };
    
    /*
    * Plugin Constructor
    */
   
    $.clientes = function(container, options){
        
        var plugin = this;
        
        /* 
        * Default Values
        */ 
       
       var defaults = {
           successMessages:new Array(),
       };
       
       /* 
        * Important Components
        */ 
        var $container = $(container);  
        
        var settings;
        var $table;

        /*
        * Private methods
        */

       /*
        * Public methods
        */
       
        plugin.list = function(){
            
            //RESPONSIVIDAD
            var responsiveHelper = undefined;
            var breakpointDefinition = {
                tablet: 1024,
                phone : 480
            };   
            
            var tableElement = $('#example');

            //INICILIZAMOS NUNESTRA TABLA
            $.ajax({
                 url: '/json/datatable/lang_es.json',
                 async:false,
                 success: function (data) {
                    $table = $container.find('table').DataTable({
                         autoWidth: false,
                         serverSide: true,
                         processing: true,
                         language:data,
                         iDisplayLength:25,
                         order:[],
                         columns: [
                            { data: "cliente_razonsocial" },
                            { data: "cliente_nombrecontacto" },
                            { data: "cliente_email" },
                            { data: "cliente_telefono" },
                            { data: "cliente_ciudad" },
                            { data: "cliente_pais" },
                            { data: "cliente_options",bSearchable: false, bSortable: false, className:'options'},
                        ],
                        ajax: {
                            url: '/clientes/serverside',
                            type: 'POST',
                            async:false,
                        },
                        fnDrawCallback : function (oSettings) {

                            
                                                    
                        },
                        fnRowCallback  : function (nRow) {
                            
                            //DELETE MODAL
                            $(nRow).find('td.options a.delete').on('click',function(){
                                var id = $(this).closest('tr').attr('id');
                                $.ajax({
                                    url:'/clientes/eliminar',
                                    data:{id:id},
                                    success:function(source){
                                        source = $('<div>'+source+'</div>');
                                        source.find('button[btn-action=eliminar]').on('click',function(){
                                            $.ajax({
                                                url:'/clientes/eliminar',
                                                type:'POST',
                                                dataType:'json',
                                                data:{id:id},
                                                success:function(data){
                                                    if(data){
                                                        window.location.replace('/clientes');
                                                    }
                                                }
                                            });
                                        });
                                        
                                        $container.append(source);
                                        
                                        source.find('.modal').modal();
                                  
                                    }
                                });
                                
                            });
                            //responsiveHelper.createExpandIcon(nRow);
                        },
                        
                    });

                    //INICIALIZAMOS NUESTROS SELECT
                    $container.find("select").select2({
                        minimumResultsForSearch: -1
                    });
                    
                 }
            });

        }
        
        plugin.listProveedores = function(){
            
            var tableElement = $('#table_proveedores');
            var idcliente = $container.find('input[name=idcliente]').val();
            
            $.ajax({
                 url: '/json/datatable/lang_es.json',
                 async:false,
                 success: function (data) {
                    $table = tableElement.DataTable({
                         autoWidth: false,
                         serverSide: true,
                         processing: true,
                         language:data,
                         iDisplayLength:25,
                         order:[],
                         columns: [
                            { data: "proveedorcliente_nombre" },
                            { data: "proveedorcliente_taxid" },                           
                            { data: "proveedorcliente_nombrecontacto" },
                            { data: "proveedorcliente_telefonocontacto" },
                            { data: "proveedorcliente_options",bSearchable: false, bSortable: false, className:'options'},
                        ],
                        ajax: {
                            url: '/clientes/proveedorserverside',
                            type: 'POST',
                            async:false,
                            data:{idcliente:idcliente},
                        },
                        fnDrawCallback : function (oSettings) {

                            
                                                    
                        },
                        fnRowCallback  : function (nRow) {
                            
                            //DELETE MODAL
                            $(nRow).find('td.options a.delete').on('click',function(){
                                var id = $(this).closest('tr').attr('id');
                                $.ajax({
                                    url:'/clientes/ver/'+idcliente+'/proveedores/eliminar/'+id,
                                    //data:{id:id},
                                    success:function(source){
                                        source = $('<div>'+source+'</div>');
                                        source.find('button[btn-action=eliminar]').on('click',function(){
                                            $.ajax({
                                                url:'/clientes/ver/'+idcliente+'/proveedores/eliminar/'+id,
                                                type:'POST',
                                                dataType:'json',
                                                data:{id:id},
                                                success:function(data){
                                                    if(data){
                                                        window.location.replace('/clientes/ver/'+idcliente+'?active=proveedores');
                                                    }
                                                }
                                            });
                                        });
                                        
                                        $container.append(source);
                                        
                                        source.find('.modal').modal();
                                  
                                    }
                                });
                                
                            });
                            //responsiveHelper.createExpandIcon(nRow);
                        },
                        
                    });

                    //INICIALIZAMOS NUESTROS SELECT
                    $container.find("select").select2({
                        minimumResultsForSearch: -1
                    });
                    
                 }
            });
        };
        
        plugin.listClientes = function(){
            
            var tableElement = $('#table_clientes');
            var idcliente = $container.find('input[name=idcliente]').val();
            
            $.ajax({
                 url: '/json/datatable/lang_es.json',
                 async:false,
                 success: function (data) {
                    $table = tableElement.DataTable({
                         autoWidth: false,
                         serverSide: true,
                         processing: true,
                         language:data,
                         iDisplayLength:25,
                         order:[],
                         columns: [
                            { data: "proveedorcliente_nombre" },
                            { data: "proveedorcliente_taxid" },                           
                            { data: "proveedorcliente_nombrecontacto" },
                            { data: "proveedorcliente_telefonocontacto" },
                            { data: "proveedorcliente_options",bSearchable: false, bSortable: false, className:'options'},
                        ],
                        ajax: {
                            url: '/clientes/ver/'+idcliente+'/clientes/serverside',
                            type: 'POST',
                            async:false,
                            data:{idcliente:idcliente},
                        },
                        fnDrawCallback : function (oSettings) {                            
                        },
                        fnRowCallback  : function (nRow) {
                            
                            //DELETE MODAL
                            $(nRow).find('td.options a.delete').on('click',function(){
                                var id = $(this).closest('tr').attr('id');
                                $.ajax({
                                    url:'/clientes/ver/'+idcliente+'/clientes/eliminar/'+id,
                                    //data:{id:id},
                                    success:function(source){
                                        source = $('<div>'+source+'</div>');
                                        source.find('button[btn-action=eliminar]').on('click',function(){
                                            $.ajax({
                                                url:'/clientes/ver/'+idcliente+'/clientes/eliminar/'+id,
                                                type:'POST',
                                                dataType:'json',
                                                data:{id:id},
                                                success:function(data){
                                                    if(data){
                                                        window.location.replace('/clientes/ver/'+idcliente+'?active=clientes');
                                                    }
                                                }
                                            });
                                        });
                                        
                                        $container.append(source);
                                        source.find('.modal').modal();

                                    }
                                });
                                
                            });
                            //responsiveHelper.createExpandIcon(nRow);
                        },
                        
                    });

                    //INICIALIZAMOS NUESTROS SELECT
                    $container.find("select").select2({
                        minimumResultsForSearch: -1
                    });
                    
                 }
            });
        };
        
        plugin.listExpedientes = function(){
            
            var tableElement = $('#table_expedientes');
            var idcliente = $container.find('input[name=idcliente]').val();
            
            $.ajax({
                 url: '/json/datatable/lang_es.json',
                 async:false,
                 success: function (data) {
                    $table = tableElement.DataTable({
                         autoWidth: false,
                         serverSide: true,
                         processing: true,
                         language:data,
                         iDisplayLength:25,
                         order:[],
                         columns: [
                            { data: "expediente_folio" },
                            { data: "expediente_fechainicio" },
                            { data: "expediente_tipo" },   
                            { data: "expediente_consignatario" , bSortable: false},
                            { data: "expediente_embarcador" , bSortable: false},
                            { data: "expediente_estatus" },
                            { data: "expediente_options",bSearchable: false, bSortable: false, className:'options'},
                        ],
                        ajax: {
                            url: '/clientes/ver/'+idcliente+'/expedientes/serverside',
                            type: 'POST',
                            async:false,
                            data:{idcliente:idcliente},
                        },
                        fnDrawCallback : function (oSettings) {                            
                        },
                        fnRowCallback  : function (nRow) {
                            
                            //DELETE MODAL
                            $(nRow).find('td.options a.delete').on('click',function(){
                                var id = $(this).closest('tr').attr('id');
                                $.ajax({
                                    url:'/clientes/ver/'+idcliente+'/clientes/eliminar/'+id,
                                    //data:{id:id},
                                    success:function(source){
                                        source = $('<div>'+source+'</div>');
                                        source.find('button[btn-action=eliminar]').on('click',function(){
                                            $.ajax({
                                                url:'/clientes/ver/'+idcliente+'/clientes/eliminar/'+id,
                                                type:'POST',
                                                dataType:'json',
                                                data:{id:id},
                                                success:function(data){
                                                    if(data){
                                                        window.location.replace('/clientes/ver/'+idcliente+'?active=clientes');
                                                    }
                                                }
                                            });
                                        });
                                        
                                        $container.append(source);
                                        source.find('.modal').modal();

                                    }
                                });
                                
                            });
                            //responsiveHelper.createExpandIcon(nRow);
                        },
                        
                    });

                    //INICIALIZAMOS NUESTROS SELECT
                    $container.find("select").select2({
                        minimumResultsForSearch: -1
                    });
                    
                 }
            });
        };
        
        plugin.init = function(){
            
            settings = plugin.settings = $.extend({}, defaults, options);
            
            $.each(settings.successMessages,function(){
                Messenger().post({
                    message: this,
                    type: 'success',
                    showCloseButton: true,
                });	
            });
            
            //INICIALIZAMOS EL FUNCIONAMIENTO DE NUESTRAS TABS
            var $tabs = $container.find('#myTab');
            
            $tabs.find('a').on('click',function(e){
                e.preventDefault();
                var href = $(this).attr('href');
               
                //OCULTAMOS Y MOSTRAMOS LAS PESTAÑAS
                $tabs.find('li').removeClass('active');
                $(this).closest('li').addClass('active');
                //OCULTAMOS Y MOSTRAMOS LOS PANELES
                $container.find('.tab-pane').hide();
                $container.find('.tab-pane'+href).show();
                //ACTIVAMOS LA URL
                var active = href.split('#'); active = active[1];
                var url = $.query.set('active',active);
                history.replaceState( {} , 'active', url );
            });
            
            //ACTIVAMOS LA URL
            var active = $.query.get('active') != "" ? $.query.get('active'): 'info';
            var url = $.query.set('active',active);
            history.replaceState( {} , 'active', url );
            //LA PESTAÑA
            $tabs.find('li').removeClass('active');
            $container.find('a[href=#'+active+']').closest('li').addClass('active');
            
            $container.find('.tab-pane').hide();
            $container.find('.tab-pane#'+active).show()
            

        }
        
        plugin.formBind = function(edit,entity,files){
            
            var edit = typeof edit != 'undefined' ? true : false;
            
            //INICIALIZAMOS NUESTROS SELECT
            $container.find("select").select2({
                placeholder: "Select a state",
                allowClear: true,
                language: "es"
            });

            //INICIALIZAMOS NUESTRO CALENDARIO
            $container.find('.input-append.date').datepicker({
                autoclose: true,
                todayHighlight: true,
                format:'dd/mm/yyyy'
            });

              
            if(edit){

                var idcliente = $container.find('input[name=idcliente]').val();
                var image_extension = ['jpeg','gif','png'];
                //NUESTRO DROPZONE DEL PERFIL LEGAL
                Dropzone.autoDiscover = false; 
                
                var myDropzonefiles = new Dropzone("#dropzonefiles", {
                    url: "/clientes/filesdropzone",
                    addRemoveLinks: true,
                    dictRemoveFile:'Eliminar',
                    addedfile: function (file) {

                        var _this = this;

                        file.previewElement = Dropzone.createElement(this.options.previewTemplate);
                        file.previewTemplate = file.previewElement;
                        this.previewsContainer.appendChild(file.previewElement);
                        file.previewElement.querySelector("[data-dz-name]").textContent = file.name;
                        file.previewElement.querySelector("[data-dz-size]").innerHTML = this.filesize(file.size);
                        if (this.options.addRemoveLinks && typeof file.status == 'undefined') {
                            file._removeLink = Dropzone.createElement("<a class=\"dz-remove\" href=\"javascript:undefined;\">" + this.options.dictRemoveFile + "</a>");
                            file._downloadLink = Dropzone.createElement("<a class=\"dz-download\" href=" + file.status + "><i class=\"fa fa-download\"></i></a>");
                            //file._downloadLink = Dropzone.createElement("<a class=\"btn\" id=\"bt-down\" style=\"margin-left:5px; cursor:pointer;\" href=\"javascript:Download('"+file.name+"');\" title=\"Download\" data-dz-download><i class=\"fa fa-download\"></i></a>");
                            file._removeLink.addEventListener("click", function (e) {
                                e.preventDefault();
                                e.stopPropagation();
                                if (file.status === Dropzone.UPLOADING) {
                                    return Dropzone.confirm(_this.options.dictCancelUploadConfirmation, function () {
                                        return _this.removeFile(file);
                                    });
                                } else {
                                    if (_this.options.dictRemoveFileConfirmation) {
                                        return Dropzone.confirm(_this.options.dictRemoveFileConfirmation, function () {
                                            return _this.removeFile(file);
                                        });
                                    } else {
                                        return _this.removeFile(file);
                                    }
                                }
                            });
                            file._downloadLink.addEventListener("click", function (e) {
                                e.preventDefault();
                                e.stopPropagation();
                                //HACEMOS LA PETICION AJAX PARA OBTENER EL BASE64
                                $.ajax({
                                    type: 'POST',
                                    url: '/clientes/filesdropzonedownload',
                                    data: {id: file.id},
                                    dataType: 'json',
                                    success: function (base64) {
                                        download("data:" + base64.type + ";base64," + base64.base64, base64.name, base64.type);
                                    }
                                });

                            });
                            file.previewElement.appendChild(file._removeLink);
                            file.previewElement.appendChild(file._downloadLink);
                        }
                        return this._updateMaxFilesReachedClass();
                    },
                    removedfile: function (file) {
                        $.ajax({
                            type: 'POST',
                            url: '/clientes/filesdropzonedelete',
                            data: {id: file.id},
                            dataType: 'json',
                            success: function (data) {

                                if (data) {
                                    var _ref;
                                    return (_ref = file.previewElement) != null ? _ref.parentNode.removeChild(file.previewElement) : void 0;
                                }

                            }

                        });
                    },
                });
                
                myDropzonefiles.on('sending', function(file, xhr, formData){
                    formData.append('id', idcliente);
                });

                $.each(files, function (key, value) {


                    var mockFile = {id: value.id, name: value.name, size: value.size, url: '/Applications/AMPPS/www/itrade'};

                    myDropzonefiles.options.addedfile.call(myDropzonefiles, mockFile);

                    //SI ES IMAGEN AGREGAMOS EL THUMBNAIL
                    if (value.type.indexOf('image') >= 0) {
                        myDropzonefiles.emit("thumbnail", mockFile, '/files/clientes/' + idcliente + '/' + value.name);
                    }


                });
                var myDropzone = new Dropzone("#mydropzone", {
                    url: "/clientes/legaldropzone",
                    addRemoveLinks: true,
                    dictRemoveFile:'Eliminar',
                    autoProcessQueue:false,
                    addedfile:function(file){    
                        $('.modal').remove();
                        var _this = this;
                        if(_this.files.length > 0){
                            $.ajax({
                                url:'/clientes/selectfile',
                                success:function(source){
                                     source = $('<div>'+source+'</div>');
                                     $container.append(source);
                                     source.find('.modal').modal();

                                     //EL EVENTO DE NUESTROS BOTONES
                                     source.find('.btn-default').on('click',function(){
                                         _this.removeFile(file);
                                          $('.modal').modal('toggle');
                                     });
                                     source.find('.btn-success').on('click',function(){

                                        var id = $container.find('input[name=idcliente]').val();
                                        var file_name = 'cliente_'+ source.find('input[name=optionyes]:checked').val();

                                        myDropzone.on('sending', function(file, xhr, formData){
                                            formData.append('idcliente', id);
                                            formData.append('file_name', file_name);
                                        });
                                        
                                        myDropzone.processQueue();
                                        $('.modal').modal('toggle');
                                        $container.find('#'+file_name).find('i').removeClass('fa-times-circle').addClass('fa-check');
                                        $container.find('#'+file_name).find('span').removeClass('notyet').addClass('ok');
                                        
                                     });

                                }
                            });
                        }

                        file.previewElement = Dropzone.createElement(_this.options.previewTemplate);
                        file.previewTemplate = file.previewElement;
                        _this.previewsContainer.appendChild(file.previewElement);
                        file.previewElement.querySelector("[data-dz-name]").textContent = file.name;
                        file.previewElement.querySelector("[data-dz-size]").innerHTML = _this.filesize(file.size);
                        
                        if (this.options.addRemoveLinks && typeof file.status == 'undefined') {
                            file._removeLink = Dropzone.createElement("<a class=\"dz-remove\" href=\"javascript:undefined;\">" + this.options.dictRemoveFile + "</a>");
                            file._downloadLink = Dropzone.createElement("<a class=\"dz-download\" href=" + file.status + "><i class=\"fa fa-download\"></i></a>");
                            //file._downloadLink = Dropzone.createElement("<a class=\"btn\" id=\"bt-down\" style=\"margin-left:5px; cursor:pointer;\" href=\"javascript:Download('"+file.name+"');\" title=\"Download\" data-dz-download><i class=\"fa fa-download\"></i></a>");
                            file._removeLink.addEventListener("click", function (e) {
                                e.preventDefault();
                                e.stopPropagation();
                                if (file.status === Dropzone.UPLOADING) {
                                    return Dropzone.confirm(_this.options.dictCancelUploadConfirmation, function () {
                                        return _this.removeFile(file);
                                    });
                                } else {
                                    if (_this.options.dictRemoveFileConfirmation) {
                                        return Dropzone.confirm(_this.options.dictRemoveFileConfirmation, function () {
                                            return _this.removeFile(file);
                                        });
                                    } else {
                                        return _this.removeFile(file);
                                    }
                                }
                            });
                            file._downloadLink.addEventListener("click", function (e) {
                                e.preventDefault();
                                e.stopPropagation();
                                //HACEMOS LA PETICION AJAX PARA OBTENER EL BASE64
                                $.ajax({
                                    type: 'POST',
                                    url: '/clientes/legaldropzonedownload',
                                    data: {idcliente:idcliente,id: file.id},
                                    dataType: 'json',
                                    success: function (base64) {

                                        download("data:" + base64.type + ";base64," + base64.base64, base64.name, base64.type);

                                    }

                                });

                            });
                            file.previewElement.appendChild(file._removeLink);
                            file.previewElement.appendChild(file._downloadLink);
                        }
                        return this._updateMaxFilesReachedClass();
                    },
                    removedfile: function (file) {
                        $.ajax({
                            type: 'POST',
                            url: '/clientes/legaldropzonedelete',
                            data: {idcliente:idcliente,id: file.id},
                            dataType: 'json',
                            success: function (data) {
                                if (data) {
                                    var _ref;
                                    $container.find('#'+file.id).find('i').removeClass('fa-check').addClass('fa-times-circle');
                                    $container.find('#'+file.id).find('span').removeClass('ok').addClass('notyet');
                                    return (_ref = file.previewElement) != null ? _ref.parentNode.removeChild(file.previewElement) : void 0;
                                }

                            }

                        });
                    },
                });

                $container.find('input[name=cliente_email]').removeClass('validate-ajax');
                                
                //EL EVENTO CAMBIAR CONTRASEÑA
                $container.find('a#change_password').on('click',function(){
                    var id = $container.find('input[name=idcliente]').val();
                    $.ajax({
                        url:'/clientes/changepassword',
                        data:{id:id},
                        success:function(source){
                             source = $('<div>'+source+'</div>');
                             $container.append(source);
                             source.find('.modal').modal();
                        }
                    });
                });
                
                myDropzone.autoDiscover = false;
                
                //HACEMOS LA VALIDACION DEL LISTADO DEL PERFIL LEGAL
                
                if(entity.cliente_padronimportador !== null){
                    
                    $container.find('#cliente_padronimportador').find('i').addClass('fa fa-check');
                    $container.find('#cliente_padronimportador').find('span').addClass('ok');
                    
                    var id = 'cliente_padronimportador';
                    var name = entity.cliente_padronimportador.split('/perfil_legal/');
                    name = name[1];
                    var mockFile = { id:id,name: name, size: 10000}; 
                    myDropzone.emit("addedfile", mockFile);
                    
                    var extension = name.split('.');
                    extension = extension[1];
                    if($.inArray(extension,image_extension)>=0){
                        myDropzone.emit("thumbnail", mockFile, '/files/clientes/'+idcliente+'/perfil_legal/'+name);   
                    }
                     
                    
                    
                }else{
                    $container.find('#cliente_padronimportador').find('i').addClass('fa fa-times-circle');
                    $container.find('#cliente_padronimportador').find('span').addClass('notyet');
                }
                
                if(entity.cliente_encargadoconferido !== null){
                    $container.find('#cliente_encargadoconferido').find('i').addClass('fa fa-check');
                    $container.find('#cliente_encargadoconferido').find('span').addClass('ok');
                    
                    var id = 'cliente_encargadoconferido';
                    var name = entity.cliente_encargadoconferido.split('/perfil_legal/');
                    name = name[1];
                    var mockFile = { id:id,name: name, size: 10000}; 
                    myDropzone.emit("addedfile", mockFile);
                    var extension = name.split('.');
                    extension = extension[1];
                    if($.inArray(extension,image_extension)>=0){
                        myDropzone.emit("thumbnail", mockFile, '/files/clientes/'+idcliente+'/perfil_legal/'+name);   
                    }
                    
                    
                }else{
                    $container.find('#cliente_encargadoconferido').find('i').addClass('fa fa-times-circle');
                    $container.find('#cliente_encargadoconferido').find('span').addClass('notyet');
                }
                
                if(entity.cliente_r1 !== null){
                    $container.find('#cliente_r1').find('i').addClass('fa fa-check');
                    $container.find('#cliente_r1').find('span').addClass('ok');
                    
                    var id = 'cliente_r1';
                    var name = entity.cliente_r1.split('/perfil_legal/');
                    name = name[1];
                    var mockFile = { id:id,name: name, size: 10000}; 
                    myDropzone.emit("addedfile", mockFile);
                    var extension = name.split('.');
                    extension = extension[1];
                    if($.inArray(extension,image_extension)>=0){
                        myDropzone.emit("thumbnail", mockFile, '/files/clientes/'+idcliente+'/perfil_legal/'+name);   
                    }
                    
                    
                }else{
                    $container.find('#cliente_r1').find('i').addClass('fa fa-times-circle');
                    $container.find('#cliente_r1').find('span').addClass('notyet');
                }
                
                if(entity.cliente_r2 !== null){
                    $container.find('#cliente_r2').find('i').addClass('fa fa-check');
                    $container.find('#cliente_r2').find('span').addClass('ok');
                    
                    var id = 'cliente_r2';
                    var name = entity.cliente_r2.split('/perfil_legal/');
                    name = name[1];
                    var mockFile = { id:id,name: name, size: 10000}; 
                    myDropzone.emit("addedfile", mockFile);
                    var extension = name.split('.');
                    extension = extension[1];
                    if($.inArray(extension,image_extension)>=0){
                        myDropzone.emit("thumbnail", mockFile, '/files/clientes/'+idcliente+'/perfil_legal/'+name);   
                    }
                    
                    
                }else{
                    $container.find('#cliente_r2').find('i').addClass('fa fa-times-circle');
                    $container.find('#cliente_r2').find('span').addClass('notyet');
                }
                
                if(entity.cliente_identificacionrepresentantelegal !== null){
                    $container.find('#cliente_identificacionrepresentantelegal').find('i').addClass('fa fa-check');
                    $container.find('#cliente_identificacionrepresentantelegal').find('span').addClass('ok');
                    
                    var id = 'cliente_identificacionrepresentantelegal';
                    var name = entity.cliente_identificacionrepresentantelegal.split('/perfil_legal/');
                    name = name[1];
                    var mockFile = { id:id,name: name, size: 10000}; 
                    myDropzone.emit("addedfile", mockFile);
                    var extension = name.split('.');
                    extension = extension[1];
                    if($.inArray(extension,image_extension)>=0){
                        myDropzone.emit("thumbnail", mockFile, '/files/clientes/'+idcliente+'/perfil_legal/'+name);   
                    }
                    
                    
                }else{
                    $container.find('#cliente_identificacionrepresentantelegal').find('i').addClass('fa fa-times-circle');
                    $container.find('#cliente_identificacionrepresentantelegal').find('span').addClass('notyet');
                }
                
                if(entity.cliente_rfcrepresentantelegal !== null){
                    
                    $container.find('#cliente_rfcrepresentantelegal').find('i').addClass('fa fa-check');
                    $container.find('#cliente_rfcrepresentantelegal').find('span').addClass('ok');
                    
                    var id = 'cliente_rfcrepresentantelegal';
                    var name = entity.cliente_rfcrepresentantelegal.split('/perfil_legal/');
                    name = name[1];
                    var mockFile = { id:id,name: name, size: 10000}; 
                    myDropzone.emit("addedfile", mockFile);
                    var extension = name.split('.');
                    extension = extension[1];
                    if($.inArray(extension,image_extension)>=0){
                        myDropzone.emit("thumbnail", mockFile, '/files/clientes/'+idcliente+'/perfil_legal/'+name);   
                    }
                    
                    
                }else{
                    $container.find('#cliente_rfcrepresentantelegal').find('i').addClass('fa fa-times-circle');
                    $container.find('#cliente_rfcrepresentantelegal').find('span').addClass('notyet');
                }
                
                if(entity.cliente_podernotarial !== null){
                    $container.find('#cliente_podernotarial').find('i').addClass('fa fa-check');
                    $container.find('#cliente_podernotarial').find('span').addClass('ok');
                    
                    var id = 'cliente_podernotarial';
                    var name = entity.cliente_podernotarial.split('/perfil_legal/');
                    name = name[1];
                    var mockFile = { id:id,name: name, size: 10000}; 
                    myDropzone.emit("addedfile", mockFile);
                    var extension = name.split('.');
                    extension = extension[1];
                    if($.inArray(extension,image_extension)>=0){
                        myDropzone.emit("thumbnail", mockFile, '/files/clientes/'+idcliente+'/perfil_legal/'+name);   
                    }
                    
                    
                }else{
                    $container.find('#cliente_podernotarial').find('i').addClass('fa fa-times-circle');
                    $container.find('#cliente_podernotarial').find('span').addClass('notyet');
                }

                if(entity.cliente_cartaencomienda != null){
                    
                    var id = 'cliente_cartaencomienda';
                    var name = entity.cliente_cartaencomienda.split('/perfil_legal/');
                    name = name[1];
                    var mockFile = { id:id,name: name, size: 10000}; 
                    myDropzone.emit("addedfile", mockFile);
                    var extension = name.split('.');
                    extension = extension[1];
                    if($.inArray(extension,image_extension)>=0){
                        myDropzone.emit("thumbnail", mockFile, '/files/clientes/'+idcliente+'/perfil_legal/'+name);   
                    }

                    $container.find('#cliente_cartaencomienda').find('i').addClass('fa fa-check');
                    $container.find('#cliente_cartaencomienda').find('span').addClass('ok');
                    
                    
                }else{
                    $container.find('#cliente_cartaencomienda').find('i').addClass('fa fa-times-circle');
                    $container.find('#cliente_cartaencomienda').find('span').addClass('notyet');
                }
                
                if(entity.cliente_actaconstitutiva !== null){
                    
                    var id = 'cliente_actaconstitutiva';
                    var name = entity.cliente_actaconstitutiva.split('/perfil_legal/');
                    name = name[1];
                    var mockFile = { id:id,name: name, size: 10000}; 
                    myDropzone.emit("addedfile", mockFile);
                    var extension = name.split('.');
                    extension = extension[1];
                    if($.inArray(extension,image_extension)>=0){
                        myDropzone.emit("thumbnail", mockFile, '/files/clientes/'+idcliente+'/perfil_legal/'+name);   
                    }

                    $container.find('#cliente_actaconstitutiva').find('i').addClass('fa fa-check');
                    $container.find('#cliente_actaconstitutiva').find('span').addClass('ok');

                    $container.find('#cliente_actaconstitutiva').find('i').addClass('fa fa-check');
                    $container.find('#cliente_actaconstitutiva').find('span').addClass('ok');
                }else{
                    $container.find('#cliente_actaconstitutiva').find('i').addClass('fa fa-times-circle');
                    $container.find('#cliente_actaconstitutiva').find('span').addClass('notyet');
                }

                if(entity.cliente_comprobantedomicilio !== null){
                    
                    var id = 'cliente_comprobantedomicilio';
                    var name = entity.cliente_comprobantedomicilio.split('/perfil_legal/');
                    name = name[1];
                    var mockFile = { id:id,name: name, size: 10000}; 
                    myDropzone.emit("addedfile", mockFile);
                    var extension = name.split('.');
                    extension = extension[1];
                    if($.inArray(extension,image_extension)>=0){
                        myDropzone.emit("thumbnail", mockFile, '/files/clientes/'+idcliente+'/perfil_legal/'+name);   
                    }

                    $container.find('#cliente_comprobantedomicilio').find('i').addClass('fa fa-check');
                    $container.find('#cliente_comprobantedomicilio').find('span').addClass('ok');
                    
                    
                    $container.find('#cliente_comprobantedomicilio').find('i').addClass('fa fa-check');
                    $container.find('#cliente_comprobantedomicilio').find('span').addClass('ok');
                }else{
                    $container.find('#cliente_comprobantedomicilio').find('i').addClass('fa fa-times-circle');
                    $container.find('#cliente_comprobantedomicilio').find('span').addClass('notyet');
                }
                
                if(entity.cliente_archivoszip !== null){
                    
                    var id = 'cliente_archivoszip';
                    $container.find('#cliente_archivoszip').find('i').addClass('fa fa-check');
                    $container.find('#cliente_archivoszip').find('span').addClass('ok');
                    
                    var name = entity.cliente_archivoszip.split('/perfil_legal/');
                    name = name[1];
                    var mockFile = { id:id,name: name, size: 10000}; 
                    myDropzone.emit("addedfile", mockFile);
                    var extension = name.split('.');
                    extension = extension[1];
                    if($.inArray(extension,image_extension)>=0){
                        myDropzone.emit("thumbnail", mockFile, '/files/clientes/'+idcliente+'/perfil_legal/'+name);   
                    }
                    
                    
                }else{
                    $container.find('#cliente_archivoszip').find('i').addClass('fa fa-times-circle');
                    $container.find('#cliente_archivoszip').find('span').addClass('notyet');
                }

                if(entity.cliente_fotografiasdomicilio !== null){
                    
                    var id = 'cliente_fotografiasdomicilio';
                    $container.find('#cliente_fotografiasdomicilio').find('i').addClass('fa fa-check');
                    $container.find('#cliente_fotografiasdomicilio').find('span').addClass('ok');
                    
                    var name = entity.cliente_fotografiasdomicilio.split('/perfil_legal/');
                    name = name[1];
                    var mockFile = { id:id,name: name, size: 10000}; 
                    myDropzone.emit("addedfile", mockFile);
                    var extension = name.split('.');
                    extension = extension[1];
                    if($.inArray(extension,image_extension)>=0){
                        myDropzone.emit("thumbnail", mockFile, '/files/clientes/'+idcliente+'/perfil_legal/'+name);   
                    }
                    
                    
                }else{
                    $container.find('#cliente_fotografiasdomicilio').find('i').addClass('fa fa-times-circle');
                    $container.find('#cliente_fotografiasdomicilio').find('span').addClass('notyet');
                }
                
                if(entity.cliente_comprobanteclabe !== null){
                    $container.find('#cliente_comprobanteclabe').find('i').addClass('fa fa-check');
                    $container.find('#cliente_comprobanteclabe').find('span').addClass('ok');
                    
                    var id = 'cliente_comprobanteclabe';
                    var name = entity.cliente_comprobanteclabe.split('/perfil_legal/');
                    name = name[1];
                    var mockFile = { id:id,name: name, size: 10000}; 
                    myDropzone.emit("addedfile", mockFile);
                    var extension = name.split('.');
                    extension = extension[1];
                    if($.inArray(extension,image_extension)>=0){
                        myDropzone.emit("thumbnail", mockFile, '/files/clientes/'+idcliente+'/perfil_legal/'+name);   
                    }
                    
                }else{
                    $container.find('#cliente_comprobanteclabe').find('i').addClass('fa fa-times-circle');
                    $container.find('#cliente_comprobanteclabe').find('span').addClass('notyet');
                }
                
                /*
                 * INICIA SECCION DE PROVEEDORES
                 */
                
                
                plugin.listProveedores();
                plugin.listClientes();
                plugin.listExpedientes();
                
                
            }
        }

        /*
        * Plugin initializing
        */
        
        plugin.init();
       
    }
    
    
    
})( jQuery );


