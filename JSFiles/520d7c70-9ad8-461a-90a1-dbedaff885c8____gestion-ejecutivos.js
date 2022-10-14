var gestionEjecutivos = (function(){

	// VARIABLE TEMPORAL PARA GUARDAR LOS ELEMENTOS A DESPHEGAR
	var elementosService = {};

	// ARREGLOS CON CUENTAS/EMPRESAS/GRUPOS

	var currentView = 'mosaico';

	var $currentMainView = null;

	var $mainmosaico = $('.js .group-list-block .mosaico-view');
	var $mainlista = $('.js .lista-view .listado-general');

	var $mainmosaicoP = null;
	var $mainlistaP = null;

	var dataEmpresas = null;
	var dataFiltered = null; //Todos los elementos que se pueden mostrar
	var dataPaginacion = null; //Todos los elementos que se muestran en la paginacion

	var paginacion = null;

	// MODALES
	var formElementsModales = { 
		'nuevoAdmin' : {id : '.form-agregar-administrador #form-agregar-administrador', validator : null, sending: false }, 
		'nuevoAlias' : {id : '.form-agregar-alias #form-agregar-alias', validator : null, sending: false }, 
		'guardarAdmin' : {id : null, validator : null, sending: false }, 
		'editarAdmin' : {id : null, validator : null, sending: false }, 
		'asociarCuentas' : {id : null, validator : null, sending: false }, 
		'eliminarAlias' : {id : null, validator : null, sending: false }, 
		'consultarLineas' : {id: null, validator: null, sending: false } 
	};

	var modalAgregarAlias = null;
	if($('#modal-agregar-alias').length>0)
		initModalAgregarAlias();

	var modalEliminarAlias = null;
	if($('#modal-eliminar-alias').length>0)
		initModalEliminarAlias();

	var modalAgregarAdmin = null;
	if($('#modal-agregar-administrador').length>0)
		initModalAgregarAdmin();
	
	var modalIrAdmin = null;
	if($('#modal-ir-a-admin').length>0)
		initModalIrAdmin();

	var modalEditarAdmin = null;
	if($('#modal-editar-administrador').length>0)
		initModalEditarAdmin();

	var modalEliminarAdmin = null;
	if($('#modal-eliminar-admin').length>0)
		initModalEliminarAdmin();

	function removeGeneralError(){
		$('.modal-mte .system-error-msg').remove();
		$('.modal-mte .has-system-error').removeClass('has-system-error');
	}

	function initActionErrorGeneral(){
		
		$('.modal-mte').on('click', '.system-error-msg #btn-resend-form', function(){
			var $resend = $(this),
			$reform = $('.has-system-error form');
			if($reform.length>0){
				removeGeneralError();
				$reform.submit();
			}
		});

	}

	function initModalEditarAdmin(){
		var $modal = $('#modal-editar-administrador');
		var $formContainer = null; 
  		var index = null;
  		var $parent = null;

		modalEditarAdmin = new modalesTelcel($modal,{
			onInit : function(){
				validateFormEditarAdmin();
			},
			onReset : function(){
				removeGeneralError();
				resetFormModal($('.form-editar-administrador #form-editar-administrador'), 'editarAdmin');
			},
			onOpen : function(){
				setElementInfo();
			}
		});

		function setElementInfo(){
	  		var meta = currentModalData;

	  		$modal.find('input[name="email"]').val(meta.administrador.correo);
	  		$modal.find('input[name="nombre"]').val(meta.administrador.nombre);
	  		$modal.find('input[name="lada"]').val(meta.administrador.lada);
	  		$modal.find('input[name="telefono"]').val(meta.administrador.numero);
	  		$modal.find('input[name="extension"]').val(meta.administrador.extension);
	  		$modal.find('input[name="numero"]').val(meta.administrador.lada+meta.administrador.numero);
	  		$modal.find('.alias-txt').html(meta.texto);
		}


		function validateFormEditarAdmin(){

			var $form = $('.form-editar-administrador #form-editar-administrador');

			disableSumbitButton($form, true);
			checkTelefonoLength($form);
		
			formElementsModales['editarAdmin']['validator'] = $form.validate({
				ignore: "",
				onkeyup:  function(element) { $(element).valid(); },
				rules: {
					email: {
						required: true,
						email: true
					},
					nombre: {
						required: true,
						basicName: true,
						minlength: 3,
						maxlength: 40
					},
					numero : {
						digits: true,
						minlength: 10,
						maxlength: 10,
						required : {
							depends: function(element) {
								var $lada = $form.find('.lada').val(),
								$telefono = $form.find('.telefono').val(),
								$ext = $form.find('.extension').val();

			                	return $lada.length>0 || $telefono.length>0 || $ext.length;
			                }
						}
					},
					extension : {
						digits: true
					},
					checkboxAutorizacionEditar : {
						required: true
					}
				},
				messages: {
					email: {
						required: "Ingresa un correo electrónico.",
						email: "Ingresa un correo electrónico válido."
					},
					nombre: {
						required : "Ingresa el nombre del administrador.",
						basicName: "Este campo solo acepta letras, números, punto y espacios.",
						minlength: "El nombre debe contener al menos 3 caracteres.",
					   	maxlength : "El nombre no debe ser mayor a 40 caracteres."
					},
					numero: {
						required: "Ingresa un número de contacto.",
						digits: "Ingresa un número válido.",
						minlength: "Ingresa un número de 10 dígitos.",
						maxlength: "Ingresa un número de 10 dígitos."
					},
					extension : {
						digits: "Ingresa una extensión válida."
					},
					checkboxAutorizacionEditar: {
						required: "Acepta que se tiene la autorización para usar los datos."
					}
				},
				errorClass : "error-dd error",
				errorPlacement: function(error, $element) {
				   	var $parent = $element.parent();

				   	if($element.attr("name") == "numero"){
				   		$form.find('.lada').addClass('error-dd error');
				   		$form.find('.telefono').addClass('error-dd error');
				   		$parent.append( error );
				   	}
				   	else if( $.inArray( $element.attr("name"), ['checkboxAutorizacionEditar', 'lada', 'telefono']) < 0){
				   		$parent.append( error );
				   	}
   	
				},
				unhighlight: function(element, errorClass, validClass) {

					var $element = $(element);
					if(!$element.hasClass('lada') && !$element.hasClass('telefono') && !$element.hasClass('extension'))
		        		$element.removeClass('error error-dd').addClass('valid');
		        	else{
		        		var $numero = $form.find('.numero');
		        		if($numero.valid()){
				  			$('#numero-error').remove();
				  			$('#lada-error').remove();
				  			$('#telefono-error').remove();
				    		$form.find('.lada').removeClass('error-dd error');
				    		$form.find('.telefono').removeClass('error-dd error');
				  		}
		        	}

		        },
		        highlight : function(element, errorClass){
		        	var $element = $(element);
		        	$element.removeClass('valid').addClass('error error-dd');

		        	if($element.hasClass('numero')){
		        		$form.find('.lada').addClass('error-dd error');
				   		$form.find('.telefono').addClass('error-dd error');
		        	}

		        },
				submitHandler: function(form) {
					if(!formElementsModales['editarAdmin']['sending']){

						formElementsModales['editarAdmin']['sending'] = true;

						$(form).find('button[type="submit"]').prop('disabled', true);
						
						var self = $(form).serialize();
						var selfArray = $(form).serializeArray();

						generalLoadingIcon(form, true);

						var urlPOST = ( $(form).prop('action') == '' ? postURL : $(form).prop('action') ) ;

						$.post( postURL , { data: self, related : currentModalData.administrador.id})
						  .done(function( json ) {
						  	
						  	var elementData = {
								aliasId : currentModalData.id,
								adminId : currentModalData.administrador.id,
								correo: selfArray[1].value,
								nombre : selfArray[0].value,
								lada : ( typeof selfArray[2].value != 'undefined' ?  selfArray[2].value : null),
								numero : ( typeof selfArray[3].value != 'undefined' ?  selfArray[3].value : null),
								extension : ( typeof selfArray[5].value != 'undefined' ?  selfArray[5].value : null)
							};

						  	Services.gestionEjecutivos.editarAdminSuccessCallback(json, form, elementData, updateEditDataDom );
						  	formElementsModales['editarAdmin']['sending'] = false;
						  	$(form).find('button[type="submit"]').prop('disabled', false);
						  	generalLoadingIcon(form, false);

						  })
						  .fail(function( jqxhr, textStatus, error ) {
						  	Services.gestionEjecutivos.editarAdminFailCallback(error, form );
						  	formElementsModales['editarAdmin']['sending'] = false;
						  	generalLoadingIcon(form, false);
						  	
						});

					}

				}
			});

			checkGeneralValidForm($form);

		}

		function updateEditDataDom(newinfo, $parent){
			
			var meta = currentModalData;

			meta.administrador.correo = newinfo.correo;
			meta.administrador.lada = newinfo.lada;
			meta.administrador.numero = newinfo.numero;
			meta.administrador.extension = newinfo.extension;
			meta.administrador.nombre = newinfo.nombre;

			$parent.data('meta', meta);

	  		$parent.find('.admin-correo').html(meta.administrador.correo);
	  		$parent.find('.admin-txt').html(meta.administrador.nombre);

	  		if(meta.administrador.numero!='')
	  			$parent.find('.admin-num').html('- ('+meta.administrador.lada+') '+meta.administrador.numero+(meta.administrador.extension!='' ? ' ext. '+meta.administrador.extension : ''));
	  		else
	  			$parent.find('.admin-num').html('');
		}

	}

	function initModalEliminarAdmin(){

		modalEliminarAdmin = new modalesTelcel($('#modal-eliminar-admin'),{
			onInit : function(){
				setModalActions();
				$('#eliminar-admin-confirmacion').hide();
				$('#eliminar-admin-ya-eliminado').hide();
			},
			onReset : function(){
				removeGeneralError();
				$('#modal-eliminar-admin .in-cont-mod').show();
				$('#confirmar-eliminar-admin').show();
			  	$('#eliminar-admin-confirmacion').hide();
			  	$('#eliminar-admin-ya-eliminado').hide();
			},
			onOpen : function(){
				$('.admin-text').html(currentModalData.administrador.nombre)
				$('#eliminar-admin-confirmacion').hide();
				$('#eliminar-admin-ya-eliminado').hide();
			}
		});

		function setModalActions(){
			$('#btn-eliminar-admin').click(function(){
				postSaveDeleteAdmin();
			});

			$('#modal-eliminar-admin').on('click', '.system-error-msg #btn-resend-form', function(){
				var $resend = $(this);
				removeGeneralError();
				$('#btn-eliminar-admin').trigger('click');
			});
		}

		function postSaveDeleteAdmin(){
			var form = '#modal-eliminar-admin .in-cont-mod';
			
			if(!formElementsModales['editarAdmin']['sending']){

				formElementsModales['editarAdmin']['sending'] = true;
				generalLoadingIcon(form, true);

				var postURL = Services.apiURL.eliminarAdmin();

				$.post( postURL , { delete: currentModalData.administrador.id })
				  .done(function( json ) {
					Services.gestionEjecutivos.eliminarAdminSuccessCallback(json, form, currentModalData, updateDataDom);
				  	formElementsModales['editarAdmin']['sending'] = false;
				  	generalLoadingIcon(form, false);

				  })
				  .fail(function( jqxhr, textStatus, error ) {
				  	Services.gestionEjecutivos.eliminarAdminFailCallback(error, form);
				  	formElementsModales['editarAdmin']['sending'] = false;
				  	generalLoadingIcon(form, false);
				});
			}
		}

		function updateDataDom($parent){
			
			var meta = currentModalData;

			meta.administrador.correo = "";
			meta.administrador.numero = "";
			meta.administrador.nombre = "";

			$parent.data('meta', meta);

			$parent.find('.admin-info-block').html('<p class="dark-blue"> <span class="no-admin">Sin administrador</span> </p> <p><span class="no-admin-time txt-300">En 30 día(s) se eliminará el alias.</span></p>');

			$parent.find('.settings-ri .first-bloq-ri').prepend('<p class="msg-no-admin"><span class="text"><strong>Sin administrador.</strong> En 30 día(s) se eliminará el alias.</span></p>');

			var $btnEditar = $parent.find('.btn-editar-admin');
			var $btnEliminar = $parent.find('.btn-eliminar-admin');
			var $btnHome = $parent.find('.btn-ir-a-home');
			var $btnCuentas = $parent.find('.btn-asocia-desasocia');

			$('<button class="simple btn-agregar-admin" type="button"> <span class="icon io-AllClients"></span> <span class="in-text-fbr">Agregar administrador</span> </button>').insertAfter($btnEditar);

			$btnEditar.remove();
			$btnEliminar.remove();
			$btnHome.remove();
			$btnCuentas.remove();
		}

	}

	function initModalAgregarAdmin(){
		var $form = $('#modal-agregar-administrador #form-agregar-administrador');
		var $input = $form.find('input[name="email"]');

		$input.bind('input', function(e){
			var $errori = $form.find('.general-error-tooltip');
			if($errori.length>0){
				$input.removeClass('error').removeClass('error-dd');
				$errori.remove();
			}
		});

		modalAgregarAdmin = new modalesTelcel($('#modal-agregar-administrador'),{
			onInit : function(){
				validateFormAddAdmin();
				$('#modal-agregar-administrador .secondary-modal-header').hide();
			},
			onReset : function(){
				removeGeneralError();
				resetFormModal($('.form-agregar-administrador #form-agregar-administrador'), 'nuevoAdmin');
				$('#modal-agregar-administrador .main-modal-header').show();
				$('#modal-agregar-administrador .secondary-modal-header').hide();
			}
		});


		function validateFormAddAdmin(){
			var $form = $('.form-agregar-administrador #form-agregar-administrador');

			disableSumbitButton($form, true);
			checkTelefonoLength($form);
			
			formElementsModales['nuevoAdmin']['validator'] = $form.validate({
			ignore: "",
				onkeyup:  function(element) { $(element).valid(); },
				rules: {
					email: {
						required: true,
						email: true
					},
					nombre: {
						required: true,
						basicName: true,
						minlength: 3,
						maxlength: 40
					},
					numero : {
						digits: true,
						minlength: 10,
						maxlength: 10,
						required : {
							depends: function(element) {
								var $lada = $form.find('.lada').val(),
								$telefono = $form.find('.telefono').val(),
								$ext = $form.find('.extension').val();

			                	return $lada.length>0 || $telefono.length>0 || $ext.length;
			                }
						}
					},
					extension : {
						digits: true
					},
					checkboxAutorizacionAddAdmin : {
						required: true
					}
				},
				messages: {
					email: {
						required: "Ingresa un correo electrónico.",
						email: "Ingresa un correo electrónico válido."
					},
					nombre: {
						required : "Ingresa el nombre del administrador.",
						basicName: "Este campo solo acepta letras, números, punto y espacios.",
						minlength: "El nombre debe contener al menos 3 caracteres.",
					   	maxlength : "El nombre no debe ser mayor a 40 caracteres."
					},
					numero: {
						required: "Ingresa un número de contacto.",
						digits: "Ingresa un número válido.",
						minlength: "Ingresa un número de 10 dígitos.",
						maxlength: "Ingresa un número de 10 dígitos."
					},
					extension : {
						digits: "Ingresa una extensión válida."
					},
					checkboxAutorizacionAddAdmin: {
						required: "Acepta que se tiene la autorización para usar los datos."
					}
				},errorClass : "error-dd error",
				errorPlacement: function(error, $element) {
				   	var $parent = $element.parent();

				   	if($element.attr("name") == "numero"){
				   		$form.find('.lada').addClass('error-dd error');
				   		$form.find('.telefono').addClass('error-dd error');
				   		$parent.append( error );
				   	}
				   	else if( $.inArray( $element.attr("name"), ['checkboxAutorizacionAddAdmin', 'lada', 'telefono']) < 0){
				   		$parent.append( error );
				   	}
   	
				},
				unhighlight: function(element, errorClass, validClass) {

					var $element = $(element);
					if(!$element.hasClass('lada') && !$element.hasClass('telefono') && !$element.hasClass('extension'))
		        		$element.removeClass('error error-dd').addClass('valid');
		        	else{
		        		var $numero = $form.find('.numero');
		        		if($numero.valid()){
				  			$('#numero-error').remove();
				  			$('#lada-error').remove();
				  			$('#telefono-error').remove();
				    		$form.find('.lada').removeClass('error-dd error');
				    		$form.find('.telefono').removeClass('error-dd error');
				  		}
		        	}

		        },
		        highlight : function(element, errorClass){
		        	var $element = $(element);
		        	$element.removeClass('valid').addClass('error error-dd');

		        	if($element.hasClass('numero')){
		        		$form.find('.lada').addClass('error-dd error');
				   		$form.find('.telefono').addClass('error-dd error');
		        	}

		        },
				submitHandler: function(form) {
					if(!formElementsModales['nuevoAdmin']['sending']){

						formElementsModales['nuevoAdmin']['sending'] = true;
						$(form).find('button[type="submit"]').prop('disabled', true);
						
						var self = $(form).serialize();
						var selfArray = $(form).serializeArray();

						generalLoadingIcon(form, true);

						var urlPOST = ( $(form).prop('action') == '' ? postURL : $(form).prop('action') ) ;

						$.post( urlPOST , { data: self, related : currentModalData.id})
						  .done(function( json ) {
						  	
							var elementData = {
								aliasId : currentModalData.id,
								correo: selfArray[1].value,
								nombre : selfArray[0].value,
								lada : ( typeof selfArray[2].value != 'undefined' ?  selfArray[2].value : null),
								numero : ( typeof selfArray[3].value != 'undefined' ?  selfArray[3].value : null),
								extension : ( typeof selfArray[5].value != 'undefined' ?  selfArray[5].value : null)
							};

							Services.gestionEjecutivos.agregarAdminSuccessCallback(json, form, elementData, updateAddDataDom );
							formElementsModales['nuevoAdmin']['sending'] = false;
							$(form).find('button[type="submit"]').prop('disabled', false);
						  	generalLoadingIcon(form, false);

						  })
						  .fail(function( jqxhr, textStatus, error ) {
						  	Services.gestionEjecutivos.agregarAdminFailCallback(error, form );
						  	formElementsModales['nuevoAdmin']['sending'] = false;
						  	generalLoadingIcon(form, false);
						});
					}
				}
			});

			checkGeneralValidForm($form);
		}

		function updateAddDataDom(newinfo, $parent){

			var meta = currentModalData;

			meta.administrador.id = newinfo.id;
			meta.administrador.correo = newinfo.correo;
			meta.administrador.lada = newinfo.lada;
			meta.administrador.numero = newinfo.numero;
			meta.administrador.extension = newinfo.extension;
			meta.administrador.nombre = newinfo.nombre;

			$parent.data('meta', meta);

			$parent.find('.admin-info-block').html('<p class="dark-blue"> <span class="admin-txt txt-300">'+meta.administrador.nombre+'</span> <span class="admin-num txt-300">'+(meta.administrador.numero !='' ? '- ('+meta.administrador.lada+') '+meta.administrador.numero+(meta.administrador.extension!='' ? ' ext. '+meta.administrador.extension : '') : '')+'</span> </p> <p><span class="admin-correo">'+meta.administrador.correo+'</span></p>');

			$parent.find('.msg-admin').remove();

			var $btnAdd = $parent.find('.btn-agregar-admin');

			$('<button class="simple btn-editar-admin" type="button"> <span class="icon io-simple-avatar"></span> <span class="in-text-fbr">Editar administrador</span> </button><button class="simple btn-eliminar-admin" type="button"> <span class="icon  io-Less"></span> <span class="in-text-fbr">Eliminar administrador</span> </button><a class="simple btn-asocia-desasocia" href="consulta-cuentas-2.html"> <span class="icon io-chain"></span> <span class="in-text-fbr">Asociar o quitar cuentas</span> </a><a class="simple btn-ir-a-home" href="ingreso-administrador-2.html"> <span class="icon io-ingresar2"></span> <span class="in-text-fbr">Ingresar como administrador</span> </a>').insertAfter($btnAdd);


			$btnAdd.remove();

		}

	}

	function initModalAgregarAlias(){

		var $form = $('.form-agregar-alias #form-agregar-alias');
		var $input = $form.find('input[name="alias"]');

		$input.bind('input', function(e){
			var $errori = $form.find('.error-nombre-alias');
			if($errori.length>0){
				$input.removeClass('error').removeClass('error-dd');
				$errori.remove();
			}
		});

		modalAgregarAlias = new modalesTelcel($('#modal-agregar-alias'),{
			onInit : function(){
				validateFormAddAlias();
				actionAgregarAdmin();

			},
			onReset : function(){
				removeGeneralError();
			},
			onOpen : function(){
				var $errori = $form.find('.error-nombre-alias');
				$errori.remove();
				resetFormModal($('.form-agregar-alias #form-agregar-alias'), 'nuevoAlias');
			}
		});

		function actionAgregarAdmin(){

			$('.add-admin-mod').click(function(){

				var $agregarAdminSecundario = $('.agregar-administrador-secundario');

				if($agregarAdminSecundario.hasClass('active')){

					$agregarAdminSecundario.find("input[type=text], input[type=email], input[type=password], select").val("");

					$('#form-agregar-alias .required-optional').removeClass('required');

					if($('#form-agregar-alias input[name="alias"]').val().length>0){

						disableSumbitButton($('.form-agregar-alias #form-agregar-alias'), false);
					}					

				}

				$agregarAdminSecundario.toggleClass('active');
			});
		}

		function validateFormAddAlias(){

			var $form = $('.form-agregar-alias #form-agregar-alias');

			disableSumbitButton($form, true);
			checkTelefonoLength($form);

			formElementsModales['nuevoAlias']['validator'] = $form.validate({
				ignore: "",
				onkeyup:  function(element) { $(element).valid(); },
				rules: {
					email: {
						required: true,
						email: true
					},
					alias: {
						required: true,
						sinEspacioInicioFin : true,
						minlength: 1,
						maxlength: 50
					},
					nombre: {
						required: true,
						basicName: true,
						minlength: 3,
						maxlength: 40
					},
					numero : {
						digits: true,
						minlength: 10,
						maxlength: 10,
						required : {
							depends: function(element) {
								var $lada = $form.find('.lada').val(),
								$telefono = $form.find('.telefono').val(),
								$ext = $form.find('.extension').val();

			                	return $lada.length>0 || $telefono.length>0 || $ext.length;
			                }
						}
					},
					extension : {
						digits: true
					},
					checkboxAutorizacion : {
						required: true
					}
				},
				messages: {
					email: {
						required: "Ingresa un correo electrónico.",
						email: "Ingresa un correo electrónico válido."
					},
					nombre: {
						required : "Ingresa el nombre del administrador.",
						basicName: "Este campo solo acepta letras, números, punto y espacios.",
						minlength: "El nombre debe contener al menos 3 caracteres.",
					   	maxlength : "El nombre no debe ser mayor a 40 caracteres."
					},
					numero: {
						required: "Ingresa un número de contacto.",
						digits: "Ingresa un número válido.",
						minlength: "Ingresa un número de 10 dígitos.",
						maxlength: "Ingresa un número de 10 dígitos."
					},
					extension : {
						digits: "Ingresa una extensión válida."
					},
					alias: {
						required: "Es necesario ingresar un nombre para el alias.",
					   minlength : "El nombre debe tener al menos 1 caracteres.",
					   sinEspacioInicioFin : "El nombre no debe tener espacio al inicio o final.",
					   maxlength : "El nombre debe tener un máximo de 50 caracteres."
					},
					checkboxAutorizacion: {
						required: "Acepta que se tiene la autorización para usar los datos."
					}
				},
				errorClass : "error-dd error",
				errorPlacement: function(error, $element) {
				   	var $parent = $element.parent();

				   	if($element.attr("name") == "numero"){
				   		$form.find('.lada').addClass('error-dd error');
				   		$form.find('.telefono').addClass('error-dd error');
				   		$parent.append( error );
				   	}
				   	else if( $.inArray( $element.attr("name"), ['checkboxAutorizacion', 'lada', 'telefono']) < 0){
				   		$parent.append( error );
				   	}
   	
				},
				unhighlight: function(element, errorClass, validClass) {

					var $element = $(element);
					if(!$element.hasClass('lada') && !$element.hasClass('telefono') && !$element.hasClass('extension'))
		        		$element.removeClass('error error-dd').addClass('valid');
		        	else{
		        		var $numero = $form.find('.numero');
		        		if($numero.valid()){
				  			$('#numero-error').remove();
				  			$('#lada-error').remove();
				  			$('#telefono-error').remove();
				    		$form.find('.lada').removeClass('error-dd error');
				    		$form.find('.telefono').removeClass('error-dd error');
				  		}
		        	}

		        },
		        highlight : function(element, errorClass){
		        	var $element = $(element);
		        	$element.removeClass('valid').addClass('error error-dd');

		        	if($element.hasClass('numero')){
		        		$form.find('.lada').addClass('error-dd error');
				   		$form.find('.telefono').addClass('error-dd error');
		        	}

		        },
				submitHandler: function(form) {

					if(!formElementsModales['nuevoAlias']['sending']){

						formElementsModales['nuevoAlias']['sending'] = true;
						$(form).find('button[type="submit"]').prop('disabled', true);
						
						var self = $(form).serialize();
						var selfArray = $(form).serializeArray();

						generalLoadingIcon(form, true);

						var urlPOST = ( $(form).prop('action') == '' ? postURL : $(form).prop('action') ) ;

						$.post( urlPOST , { data: self})
						  .done(function( json ) {

						  	var elementData = {
						  		'input' : $input, 
								'texto' : selfArray[0].value,
								'admin' :{
									'nombre' : selfArray[1].value,
									'correo' : selfArray[2].value,
									'lada' : ( typeof selfArray[3].value != 'undefined' ?  selfArray[3].value : null),
									'numero' : ( typeof selfArray[4].value != 'undefined' ?  selfArray[4].value : null),
									'extension' : (typeof selfArray[6].value != 'undefined' ? selfArray[6].value : null)
								}
							};

							Services.gestionEjecutivos.agregarAliasSuccessCallback(json, form, elementData, addCreatedElementToHTML );
						  	formElementsModales['nuevoAlias']['sending'] = false;
						  	generalLoadingIcon(form, false);

						  })
						  .fail(function( jqxhr, textStatus, error ) {
						  	Services.gestionEjecutivos.agregarAliasFailCallback(error, form );
						  	formElementsModales['nuevoAlias']['sending'] = false;
						  	generalLoadingIcon(form, false);
						});

					}

				}
			});

			checkGeneralValidForm($form);
		}

		function addCreatedElementToHTML(id, meta){

			var html = '<div class="col-xs-6 col-sm-6 col-md-4 item-mv"><div class="group-block" id="alias-'+meta.id+'" data-item = "{&quot;id&quot;: &quot;'+meta.id+'&quot; ,&quot;texto&quot;: &quot;'+meta.texto+'&quot;, &quot;lineas&quot; : &quot;0&quot;, &quot;administrador&quot; : { &quot;id&quot; : &quot;'+meta.administrador.id+'&quot;, &quot;nombre&quot; : &quot;'+meta.administrador.nombre+'&quot;, &quot;correo&quot; : &quot;'+meta.administrador.correo+'&quot;, &quot;lada&quot; : &quot;'+meta.administrador.lada+'&quot;, &quot;numero&quot; : &quot;'+meta.administrador.numero+'&quot;, &quot;extension&quot; : &quot;'+meta.administrador.extension+'&quot;}}"> <div class="header-group flexbox clearfix"> <div class="ribbon flexbox"> <span class="icon io-City col-sm-2 left-icon-ri"></span> <div class="flexbox v-align-center col-sm-10 name-container"> <strong class="ribbon-content col-sm-10">'+meta.texto+'</strong> <input type="text" value="'+meta.texto+'" name="editar-alias" class="editar-alias" maxlength="50"/> <button class="simple edit-name-ri col-sm-2 btn-guardar-nombre" title="Guardar Nombre"><span class="icon io-save-doc"></span></button> <button class="simple edit-name-ri col-sm-2 btn-editar-nombre" title="Editar Nombre"><span class="icon io-Admin"></span></button> </div> </div> <div class="icon-container flexbox v-align-center"> <button class="btn-gear simple" title="Configuración"> <span class="icon io-Gear"></span> </button> </div> <div class="col-sm-12 settings-ri"> <div class="col-sm-12 cont-set-ri"> <p class="col-sm-12 title-ri"> <span class="in-text-ri">Configuración</span> <button class="simple icon-text-ri" title="Cerrar"> <span class="icon io-Close"></span> </button> </p> <div class="col-sm-12 title-mod"> <span class="icon io-City col-xs-2 left-icon-ri"></span> <p class="title-ribon-sri">'+meta.texto+'</p> </div> <div class="col-sm-12 submenu-ri"> <div class="first-bloq-ri"> <button class="simple btn-editar-nombre hide-mobile" type="button"> <span class="icon io-Admin"></span> <span class="in-text-fbr">Cambiar nombre</span> </button> <button class="simple btn-editar-admin" type="button"> <span class="icon io-simple-avatar"></span> <span class="in-text-fbr">Editar administrador</span> </button> <button class="simple btn-eliminar-admin" type="button"> <span class="icon  io-Less"></span> <span class="in-text-fbr">Eliminar administrador</span> </button> <a class="simple" href="consulta-cuentas-2.html"> <span class="icon io-chain"></span> <span class="in-text-fbr">Asociar o quitar cuentas</span> </a> <a class="simple btn-ir-a-home" href="ingreso-administrador-2.html"> <span class="icon io-ingresar2"></span> <span class="in-text-fbr">Ingresar como administrador</span> </a> <button class="simple btn-eliminar-alias" type="button"> <span class="icon io-Bin"></span> <span class="in-text-fbr">Eliminar alias</span> </button> </div> <div class="second-bloq-ri"> <a class="simple" href="estados-cuenta-1.html#alias-2"> <span class="icon io-Contract"></span> <span class="in-text-fbr">Estados de cuenta</span> </a> <a class="simple" href="reportes-1.html#alias-2"> <span class="icon io-TutsGuias"></span> <span class="in-text-fbr">Reportes</span> </a> <a class="simple" href="historial-1.html#alias-2"> <span class="icon io-bitacora"></span> <span class="in-text-fbr">Historial de movimientos</span> </a> <a class="simple" href="descargas-1.html"> <span class="icon io-download-mte"></span> <span class="in-text-fbr">Descargas</span> </a> </div> </div> </div> </div> </div> <div class="body-group"> <div class="group-total"> <div class="row desc-imv"> <div class="col-sm-12 details-desc-imv"> <p>0</p> <span>líneas</span> </div></div> </div> <div class="col-xs-12 extend-imv admin-info-block"> <p class="dark-blue"> <span class="admin-txt txt-300">'+meta.administrador.nombre+'</span> <span class="admin-num txt-300">'+(meta.administrador.numero != '' ? '- ('+meta.administrador.lada+') '+meta.administrador.numero+(meta.administrador.extension!='' ? ' ext. '+meta.administrador.extension : '') : ''  )+'</span> </p> <p><span class="admin-correo">'+meta.administrador.correo+'</span></p> </div> </div> </div></div>';

			$('#main-view-block .mosaico-view').append(html);

		}	

	}

	function initModalEliminarAlias(){

		modalEliminarAlias = new modalesTelcel($('#modal-eliminar-alias'),{
			onInit : function(){
				setModalActions();
				$('#eliminar-alias-pre-confirmacion').hide();
				$('#eliminar-alias-confirmacion').hide();
				$('#eliminar-alias-ya-eliminado').hide();
			},
			onReset : function(){
				removeGeneralError();
				$('#modal-eliminar-alias .in-cont-mod').show();
				$('#confirmar-eliminar-alias').show();
				$('#eliminar-alias-pre-confirmacion').hide();
			  	$('#eliminar-alias-confirmacion').hide();
			  	$('#eliminar-alias-ya-eliminado').hide();
			},
			onOpen : function(){
				
			}
		});

		function setModalActions(){

			$('#btn-pre-eliminar-alias').click(function(){
				showPreConfirmDeleteAlias();
			});

			$('#btn-eliminar-alias').click(function(){
				postSaveDeleteAlias();
			});

			$('#modal-eliminar-alias').on('click', '.system-error-msg #btn-resend-form', function(){
				var $resend = $(this);
				removeGeneralError();
				$('#btn-eliminar-alias').trigger('click');
			});
		}

		function showPreConfirmDeleteAlias(){
			$('#confirmar-eliminar-alias').hide();
			$('#eliminar-alias-pre-confirmacion').show();

		}

		function postSaveDeleteAlias(){
			var form = '#modal-eliminar-alias .in-cont-mod';

			if(!formElementsModales['eliminarAlias']['sending']){

				formElementsModales['eliminarAlias']['sending'] = true;

				generalLoadingIcon('#modal-eliminar-alias .in-cont-mod', true);

				var postURL = Services.apiURL.eliminarAlias();

				$.post( postURL , { delete: currentModalData.id })
				  .done(function( json ) {
				  	Services.gestionEjecutivos.eliminarAliasSuccessCallback(json, form, currentModalData );
				  	formElementsModales['eliminarAlias']['sending'] = false;
				  	generalLoadingIcon('#modal-eliminar-alias .in-cont-mod', false);

				  })
				  .fail(function( jqxhr, textStatus, error ) {
				  	//Mensaje de error del sistema
				  	Services.gestionEjecutivos.eliminarAliasFailCallback(error, form);
				  	formElementsModales['eliminarAlias']['sending'] = false;
				  	generalLoadingIcon('#modal-eliminar-alias .in-cont-mod', false);
				});
			}
		}

	}

	function initModalIrAdmin(){
		var loadingContainer = $('#modal-ir-a-admin .form-ge-mod');

		modalIrAdmin = new modalesTelcel($('#modal-ir-a-admin'),{
			onInit : function(){
				setModalActions();
				$('#redirect-txt').hide();
			},
			onReset : function(){
				generalLoadingIcon(loadingContainer, false);
				$('#redirect-txt').hide();
			},
			onOpen : function(){
				$('#modal-ir-a-admin .alias-text').html(currentModalData.texto);
			},
			onClose : function(){

				//Cuando cierre el modal si quieren hacer refresh hay que descomentar esto
				// if(processCompleted)
				// 	location.reload();
			}
		});


		function setModalActions(){
			$('#btn-acceder-admin').click(function(){
				sendToVistaAdmin();
			});
		}

		function sendToVistaAdmin(){
			$('#redirect-txt').show();
			generalLoadingIcon(loadingContainer, true);
			window.location.href="ingreso-administrador-2.html";
		}

	}

	function resetFormModal($form, form){
		$form.find('.general-error-tooltip').remove();
		$form.find("input[type=text], input[type=number], input[type=email], input[type=password], select").val("");
		$form.find("input[type='checkbox']").prop('checked', false);
		$form.find("input[type=text], input[type=number], input[type=email], input[type=password], select, input[type=checkbox]").removeClass("error").removeClass("error-dd");
		$form.find('button[type="submit"]').prop('disabled', true);
		$form.removeClass('success').removeClass('error').show();

		if(formElementsModales[form]['validator']){
			formElementsModales[form]['validator'].resetForm();
		}
	}


	//Variable que guarda la Data de la Cuenta/Grupo/Alias/Línea a Editar
	var modalCurrentData = {};

	// FIN MODALES


	function init(){
		setView();

		if($('.general-group-options-container').length>0)
			setConfigInfo();

		setActions();
	}

	function setConfigInfo(){
		var itemData = $('.general-group-options-container').data('item');
		$('.main-group-text').html(itemData.texto);
	}

	function setActionsGenerales(){

		initActionErrorGeneral();
		/**
			Mostrar/Ocultar tablas
		**/
		$('.collapse-table-block').on('click', '.hide-show-table', function(e){
			var table = ( typeof $(this).data('table') != 'undefined' ? $(this).data('table') : null );

			if(table!=null){
				var text = $(this).text();
				var newtext = (text == "Mostrar detalle" ? "Ocultar detalle" : "Mostrar detalle");

				if($(this).hasClass('filtros'))
					newtext = (text == "Mostrar filtros" ? "Ocultar filtros" : "Mostrar filtros"); 
    			
    			$(this).text( newtext );
				
				$(table).slideToggle( 500 )
			}
		});

		// MOSTRAR OPCIONES DE CONFIGURACIÓN
		$('.group-list-block').on('click', '.btn-gear', function(e){
			e.stopPropagation();
			cancelEditName();
			var $element = $(this).closest('.group-block');
			$('.group-block').removeClass('active');
			$('.general-group-options-container').removeClass('active');

			$('body').addClass('settings-open');
			$element.addClass('active');
		});

		// ESCONDER OPCIONES DE CONFIGURACIÓN
		$('.group-list-block').on('click', '.icon-text-ri', function(e){
			e.stopPropagation();
			var $element = $(this).closest('.group-block');
			$element.removeClass('active');
		});

		// ESCONDER OPCIONES DE CONFIGURACIÓN GENERAL
		$('.general-group-options-container').on('click', '.icon-text-ri', function(e){
			e.stopPropagation();
			cancelEditName();
			var $element = $('.general-group-options-container');
			$element.removeClass('active');
		});

		$('.general-group-options-container').on('click', '.btn-open-general-config', function(e){
			e.stopPropagation();
			cancelEditName();
			var $element = $('.general-group-options-container');
			$('.group-block').removeClass('active');
			$('.row-ls').removeClass('active-settings');

			$('body').addClass('settings-open');
			$element.addClass('active');

			if(is_mobile())
				$('body').addClass('fixed-body');
		});

		$('body').on('click', '.settings-ri', function(e){			
			if(is_mobile()){
				e.stopPropagation();
				$('.general-group-options-container').removeClass('active');
				$('.group-block').removeClass('active');
				$('.row-ls').removeClass('active-settings');
				$('.settings-ri').removeClass('active');
				//$('body').removeClass('fixed-body');
				$('body').removeClass('settings-open');
			}
		});

		// FUNCIONAMIENTOS LISTADO DE RESULTADOS
		$('.lista-results .settings-ico-ls, .group-list-settings .settings-ico-ls').on('click', 'button', function(e){
			e.stopPropagation();
			var $element = $(this).closest('.row-ls');
			$('.general-group-options-container').removeClass('active');
			$('.row-ls, .group-list-settings .settings-ico-ls').removeClass('active-settings');
			
			$('body').addClass('settings-open');
			$element.addClass('active-settings');
		});

		$('.lista-results, .group-list-settings').on('click', '.icon-text-ri', function(){
			var $element = $(this).closest('.row-ls');
			$element.removeClass('active-settings');
		});

		$('.lista-results .arrow-ico-ls, .group-list-settings .arrow-ico-ls').on('click', 'button', function(){
			var $element = $(this).closest('.row-ls');
			
			if($element.hasClass('active-ls')){
				$element.removeClass('active-ls');
				$(this).find('span').removeClass('i-angle-up');
			}
			else{
				if(is_mobile())
				{
					$('.lista-results .row-ls, .group-list-settings .row-ls').removeClass('active-ls');
					$('.lista-results .arrow-ico-ls span, .group-list-settings .arrow-ico-ls span').removeClass('i-angle-up');
				}
				$element.addClass('active-ls');
				$(this).find('span').addClass('i-angle-up');
			}


		});

		$('.manage-particular-options').on('click', '.btn-show-mpo', function(){
			var $element = $(this).closest('.manage-particular-options');
			$element.toggleClass('active');
			$(this).find('.icon').toggleClass('i-angle-up');
		});
		

		//FIN FUNCIONAMIENTOS LISTADO DE RESULTADOS

		// CAMBIAR A VISTA MOSAICO
		$('body').on('click', '#vista-mosaico', function(){
			currentView = 'mosaico';
			cancelEditName();
			$('#vista-mosaico').removeClass('active');
			$('#vista-lista').addClass('active');
			$('#main-view-block').removeClass('group-row-block').addClass('group-list-block');
		});

		// CAMBIAR A VISTA LISTA
		$('body').on('click', '#vista-lista', function(){
			currentView = 'lista';
			cancelEditName();
			$('#vista-lista').removeClass('active');
			$('#vista-mosaico').addClass('active');
			$('#main-view-block').removeClass('group-list-block').addClass('group-row-block');
		});

		//ABRIR MODAL AGREGAR ALIAS
		$('body').on('click', '.btn-add-alias', function(){
			cancelEditName();
			modalAgregarAlias.openModal();
		});

		// ABRIR MODAL EDITAR ADMIN
		$('body').on('click', '.btn-editar-admin', function(){
			var $element = $(this).closest('.group-block');
			setBasicInfoModal($element.data('item'));
			modalEditarAdmin.openModal();
		});

		/**Abrir modal Eliminar Admin**/
		$('body').on('click', '.btn-eliminar-admin', function(e){
			var $element = $(this).closest('.group-block');
			setBasicInfoModal($element.data('item'));
			modalEliminarAdmin.openModal();
		});


		// ABRIR MODAL agregar admin
		$('body').on('click', '.btn-agregar-admin', function(){
			var $element = $(this).closest('.group-block');
			setBasicInfoModal($element.data('item'));
			modalAgregarAdmin.openModal();
		});

	}

	function setBasicInfoModal(item){
		currentModalData = item;
		$('.modal-mte .alias-text, .modal-mte .txt-grupo').html(item.texto);
	}

	function setBasicInfoParent(item){
		var itemData = item;
		$('.parent-text').html(itemData.texto);
	}

	function getElementId($element, selector){
		var id = $element.data('eid');
		var el = document.querySelector(selector);
		el.setAttribute('data-modaleid', id);
		return id;
	}


	function setActionsConfiguracion(){

		$('.settings-ri .submenu-ri').on('click', 'button', function(){
			$('.group-block').removeClass('active');
		});

		// ABRIR EL CUENTAS ASOCIADAS
		$('body').on('click', '.btn-cuentas-asociadas', function(){

			var $element = ($(this).closest('.group-block').length>0 ? $(this).closest('.group-block') : ($(this).closest('.row-ls').length>0 ? $(this).closest('.row-ls') : $(this).closest('.general-group-options-container')));
			setBasicInfoModal($element.data('item'));
			modalCuentasAsociadas.openModal();

		});

		// ABRIR ELIMINAR ALIAS
		$('body').on('click', '.btn-eliminar-alias', function(){
			var $element = ($(this).closest('.group-block').length>0 ? $(this).closest('.group-block') : ($(this).closest('.row-ls').length>0 ? $(this).closest('.row-ls') : $(this).closest('.general-group-options-container')));
			setBasicInfoModal($element.data('item'));
			modalEliminarAlias.openModal();
		});

		// ABRIR EL ELIMINAR GRUPO
		$('body').on('click', '.btn-ir-a-home', function(e){
			e.preventDefault();
			var $element = ($(this).closest('.group-block').length>0 ? $(this).closest('.group-block') : ($(this).closest('.row-ls').length>0 ? $(this).closest('.row-ls') : $(this).closest('.general-group-options-container')));
			setBasicInfoModal($element.data('item'));

			var parentData = $element.data('parent');

			if(typeof parentData =='undefined'){
				$parent = $('#group-data-info');
				parentData = $element.data('item');
			}

			setBasicInfoParent(parentData);
			modalIrAdmin.openModal();
		});

	}

	var editandoNombre = false,
	$closestGuardarElement = null,
	$closestEditarBtn = null,
	editandoNombreValor = null;


	function checkActiveElementEditName($element){
		return (
			$element.hasClass('name-container') && $element.hasClass('name-container') 
			|| $($element).parents('.ribbon').length 
			|| ($element.hasClass('error-tooltip') 
				|| $element.parent().hasClass('error-tooltip'))
		);
	}

	function cancelEditName(){
		editandoNombre = false;
		var $elementos_activos = $('.group-block .name-container.active-edit');
		returnEditaNamePreviousValue($elementos_activos);

		$('.group-block').find('.name-container').removeClass('active-edit');
	}

	function returnEditaNamePreviousValue($elementos_activos){
		if($elementos_activos.length>0){
			//alert('Editando');

			for (var i = 0; i < $elementos_activos.length; i++) {
				var nombre_anterior = $($elementos_activos[i]).find('strong.ribbon-content').html();
				$($elementos_activos[i]).find('.editar-alias').val(nombre_anterior)
					//Remover errores - revisar la mejor forma de hacerlo con el Valid de jquery
					.removeClass('error');
				$($elementos_activos[i]).parent().parent().parent().find('.triangle-tooltip').hide();
			}	

		}
	}

	function checkElementToEdit(){
		editandoNombre = false;
		if($closestEditarBtn!=null){
			$closestEditarBtn.find('.name-container').addClass('active-edit');
			editandoNombre = true;
			editandoNombreValor = $closestEditarBtn.find('input.editar-alias').val();
			$closestGuardarElement = $closestEditarBtn.closest('.group-block').find('.btn-guardar-nombre');
			$closestEditarBtn = null;
		}
	}

	function setActionsEditName(){

		// EDITAR NOMBRE EN MOSAICO
		$('.group-list-block').on('click', '.btn-editar-nombre', function(e){
			e.stopPropagation();
			var $element = $(this).closest('.group-block');
			
			if(!editandoNombre){
				$element.find('.name-container').addClass('active-edit');
				editandoNombre = true;
				$closestGuardarElement = $element.closest('.group-block').find('.btn-guardar-nombre');
				$closestEditarBtn = null;
				editandoNombreValor = $element.find('input.editar-alias').val();
			}
			else{
				$closestGuardarElement.prop('disabled', false);
				$closestGuardarElement.trigger('click');
				$closestEditarBtn = $element;
			}

		});

		// GUARDAR NOMBRE EN MOSAICO
		$('.group-list-block').on('click', '.btn-guardar-nombre', function(e){
			e.stopPropagation();
			var $element = $(this).closest('.group-block');
			verifyName($element);
		});

		$('.group-list-block').on('keydown','.editar-alias', function (e) {
		    var $input = $(this);
		    var $errori = $('.error-tooltip.nombre-error');

			if($errori.length>0){
				$input.removeClass('error').removeClass('error-dd');
				$errori.remove();
			}

		    if (e.keyCode === 13) { //Si es enter
		        var $element = $(this).closest('.group-block');
				verifyName($element);
		    }
		});

		$('.group-list-block .editar-alias').bind('keyup', function (e) {
			var $input = $(this);
			validateNameOnInput($input);
		});


	}


	function setActions(){
		setActionsGenerales();
		setActionsEditName();
		setActionsFilter();
		setActionsConfiguracion();

	}
	
	function setActionsFilter(){

		$('#orderby-gestiongrupos').click(function(){
			cancelEditName();
		});

		$('#orderby-gestiongrupos').change(function(){
			cancelEditName();
			var opciones = $(this).find(":selected").data('value');
			var $main = $(".mosaico-view");
			var $children = $main.children(".item-mv");
			orderItemsE(opciones, $main, $children, '.group-block');
		});

	}

	function orderItemsE(opc, $main, $children, element){
		$children.detach().sort(function(a, b) {

			if(typeof element!= 'undefined'){
			   var aData = $(a).find(element).data('item');
			   var bData = $(b).find(element).data('item');
			}
			else{
				var aData = $(a).data('item');
				var bData = $(b).data('item');
			}
		   
		   if(opc.key != 'texto' && opc.key != 'responsable' && opc.key != 'asignado' && opc.key != 'titular')
		  		return Number(aData[opc.key]) > Number(bData[opc.key]) ? 1 : -1;
		  	else
		  		return aData[opc.key] > bData[opc.key] ? 1 : -1;

		});

		if(opc.orderby == 'desc')
			$main.append($children.get().reverse());
		else
			$main.append($children);

		// opc.key
		// opc.orderby
	}

	function orderItemsModal(opc, elementos){
		var dataOrdered = elementos;

		if(opc.type == 'string')
			dataOrdered = sortByAZ(dataOrdered, opc.key);
		else if(opc.type == 'int')
			dataOrdered = sortByNumber(dataOrdered, opc.key);
		else
			dataOrdered = sortByAZ(dataOrdered, opc.key, true);

		if(opc.orderby == 'desc')
			dataOrdered.reverse();

		return dataOrdered;
	}
	
	function setView(){
		if($('#edit-cuentas-table').length>0)
			initConfigurarCuentas();

	}

	function initConfigurarCuentas(){
		var $listaCuentas = $('#edit-cuentas-table .table-main-block');
		
		var dataListadoCuentasAsociadas = [];
		var allChecked = false;
		initAliasName();
		setActions();

		generarListadoConfirmacionInicial();
		
		function initAliasName(){
			var $aliasData = $('#alias-data-info');
			var aliasData = $aliasData.data('item');
			
			if(typeof aliasData != 'undefined'){
				$('.alias-text').html(aliasData.texto);
			}
			
		}

		function setActions(){
			/**
				Ordenar elementos de listado de líneas 
			**/
			$('.has-filters .order-by-query-btn').on('click', 'button', function(e){

				var opciones = ( typeof $(this).data('opc') != 'undefined' ? $(this).data('opc') : null );
				
				if(opciones!=null){
					orderItemsQuery(opciones);
				}


			});

			$('#search-by-cuentas-block').on('click', '#btn-search-cuentas', function(){

				var index = $('#search-by-cuentas-block').data('searchi');
				var $select = $('#search-by-cuentas-block').find('select[name="searchby"]');
				var opc = $select.find(':selected').data('value');
				
				var query = '?'+opc.key+'='+currentSearch[index];
				searchItemsQuery(query);
			});

			/**Botón Abrir modal desasociar**/
			$('#listado-check-all-container').on('click', '#btn-desasociar-cuentas', function(e){
				if(modalDesasociarConfirmar!=null)
					modalDesasociarConfirmar.openModal();
			});


			/**Botón abrir modal para asociar cuentas**/
			$('#gestion-ejecutivos-view').on('click', '.btn-add-cuentas', function(e){
				if(modalAsociarCuentas!=null)
					modalAsociarCuentas.openModal();
			});



			/**Acciones Checkbox**/
			if($('#edit-cuentas-table').length>0){
				generalCheckBoxAll.inicializar();
			}

		}

		function generarListadoConfirmacionInicial(){

			var $elements = $listaCuentas.find('.linea-batch');
			var total = $elements.length;

			$elements.each(function (index, value) { 
			  var meta = ( typeof $(this).data('meta') != 'undefined' ? $(this).data('meta') : null );
			  var $element = $(this);

				if(meta != null){
					var elemento = generarHTMLCuentasAsociadas(meta, index);
					$element.html(elemento);
					dataListadoCuentasAsociadas.push(meta);

					// bindElementActions();

				}
			});
		}

		function generarListadoConfirmacion(){

			$listaCuentas.html('');

			$.each(dataListadoCuentasAsociadas, function (index, data) {
				if(!data.eliminado)

					var elemento = '';

						$.when (elemento = ($mainReactivacion.length>0 ? generarHTMLReactivacion(data, index) : ($mainCambio.length>0 ? generarHTMLCambio(data, index) : ($mainFacturacion.length>0 ? ( $mainFacturacion.hasClass('reporte-lineas') ?
						generarHTMLFacturacionLineas(data, index) : ($mainFacturacion.hasClass('reporte-facturas') ? generarHTMLFacturacionFacturas(data, index) :generarHTMLFacturacion(data, index) ) ) : generarHTMLSuspension(data, index))) )).done(function(){
							
							$listaconfirmar.append('<div class="col-sm-12 center-block flexbox h-align-center linea-batch '+elemento.additionalClass+'">'+elemento.html+'</div>');

							bindElementActions();
						});
			});


		}

		function generarHTMLCuentasAsociadas(meta, index){

			var html = '';

			html = '<div class="col-sm-12 col-xs-12 content-item-block"><div class="col-sm-1 col-xs-2 checkbox-container flexbox h-align-center"> <input type="checkbox" id="i-'+meta.id+'" name="i-'+meta.id+'" value="'+meta.id+'" data-index="0"> <label for="i-'+meta.id+'"><span class="check-sq"></span></label> </div><div class="col-sm-11 col-xs-10 cuentas-asociadas-info"><div class="col-sm-2 col-xs-12"><label class="hidden-sm hidden-md hidden-lg">Región:</label><p title="'+meta.region+'">'+meta.region+'</p></div><div class="col-sm-3 col-xs-12 flexbox cuenta-container"><p class="flexbox v-align-center"><span class="icon '+(meta.tipo == 1 ? 'io-City' : 'io-simple-avatar')+'" title="'+(meta.tipo == 1 ? 'Cuenta padre' : 'Cuenta hija')+'"></span><span title="'+meta.cuenta+'">'+meta.cuenta+'</span></p></div><div class="col-sm-3 col-xs-12"><p title="'+meta.rfc+'">'+meta.rfc+'</p></div><div class="col-sm-3 col-xs-12"><p title="'+meta.razonsocial+'">'+meta.razonsocial+'</p></div></div></div>';

			return html;

		}

		var modalDesasociarConfirmar = null;
		if($('#modal-desasociar-cuentas').length>0)
			initModalDesasociarConfirmar();

		function initModalDesasociarConfirmar(){

			modalDesasociarConfirmar = new modalesTelcel($('#modal-desasociar-cuentas'),{
				onInit : function(){
					setModalActions();
					$('#desasociar-cuentas-confirmacion').hide();
					$('#confirmar-desasociar-cuentas').show();
					
				},
				onReset : function(){
					$('#desasociar-cuentas-confirmacion').hide();
					$('#confirmar-desasociar-cuentas').show();
				},
				onOpen : function(){
					var elementos = generalCheckBoxAll.getCheckedElements();
					var total = elementos.total;
					$('#confirmar-desasociar-cuentas .total-cuentas').html(total);
				}
			});

			function setModalActions(){
				$('#btn-desasociar').click(function(){
					postDesasociar();
				});
			}

			function postDesasociar(){
				var form  = '#modal-desasociar-cuentas .in-cont-mod';
				var data = { success: false, data: [] };

				if(!formElementsModales['asociarCuentas']['sending']){

					formElementsModales['asociarCuentas']['sending'] = true;

					generalLoadingIcon(form, true);

					var desasociar = generalCheckBoxAll.getCheckedElements();

					var postURL = Services.apiURL.quitarCuentas();

					$.post( postURL , { data: desasociar })
					  .done(function( json ) {

					  	Services.gestionEjecutivos.quitarCuentasSuccessCallback(json, form, desasociar.all, resetBlock);
					  	formElementsModales['asociarCuentas']['sending'] = false;
					  	generalLoadingIcon(form, false);

					  })
					  .fail(function( jqxhr, textStatus, error ) {
					  	Services.gestionEjecutivos.quitarCuentasFailCallback(error, form);
					  	formElementsModales['asociarCuentas']['sending'] = false;
					  	generalLoadingIcon(form, false);
					});
				}
			}

			function resetBlock(){
				//INIT RESET
		  		$('.listado-select-all-block').removeClass('active');
		  		allChecked = false;
		  		// $('#checkbox-all').prop('checked', false);
		  		// $('#btn-desasociar-cuentas').prop('disabled', true);
		  		checkErrorMessage();
				// FIN RESET
			}


			function checkErrorMessage(){
				if($('#listado-cuentas .linea-batch').length == 0){
					$('#sin-cuentas-asociadas').removeClass('hidden');
					$('.ct-pagination').addClass('hidden');
				}
			}

		}

		var _modalCuentasAuxiliar = {};
		var modalCuentasAuxiliar = null;
		initModalCuentasAuxiliar();

		function initModalCuentasAuxiliar(){

			modalCuentasAuxiliar = new modalesTelcel($('#modal-cuentas-auxiliar'),{
				onInit : function(){
					initActionsModalAuxiliar();
				},
				onReset : function(){
					//resetModalAsociarCuentas();
				},
				onOpen : function(){
					updateModalData();
				}
			});

			function initActionsModalAuxiliar(){
				$('.modal-mte').on('click', '.show-md-aux-info', function(){
					_modalCuentasAuxiliar = $(this).data('info');
					modalCuentasAuxiliar.openModal();
				});

				$('body').on('click', '#modal-cuentas-auxiliar.active-up-black', function(e){
					e.preventDefault();
					$(this).removeClass('active-up-black').removeClass('active');
				});
			}

			function updateModalData(){

				$('#modal-cuentas-auxiliar .rfc-txt').html(_modalCuentasAuxiliar.rfc);

				$('#modal-cuentas-auxiliar .razonsocial-txt').html(_modalCuentasAuxiliar.razonsocial);

				$('#modal-cuentas-auxiliar .cuenta-txt').html(_modalCuentasAuxiliar.cuenta);

				$('#modal-cuentas-auxiliar').addClass('active-up-black');
			}

		}

		var _modalAsociarCuentas = {};
		var modalAsociarCuentas = null;
		if($('#modal-asociar-cuentas').length>0)
			initModalAsociarCuentas();

		function initModalAsociarCuentas(){
			var $modal = $('#modal-asociar-cuentas');
			var cuentasAsociadas = [];
			var allCheckedModal = false;

			_modalAsociarCuentas = {
				container: '#modal-asociar-cuentas',
				paginacion : null, 
				modal : null,
				data : [],
				dataPaginacion : [],
				postData : [],
				postDataTemporal : []
			};

			modalAsociarCuentas = new modalesTelcel($('#modal-asociar-cuentas'),{
				onInit : function(){
					initActionsModalAsociarCuentas();
				},
				onReset : function(){
					resetModalAsociarCuentas();
				},
				onOpen : function(){
					resetModalAsociarCuentas();
					setBuscador();
					//updateModalAsociarData('');
				}
			});

			_modalAsociarCuentas['paginacion'] = new PaginacionTelcel(_modalAsociarCuentas['data'], {
				itemsPerPage : 10,
				paginationControlsContainer: '#modal-asociar-cuentas .pagination-block',
				onPageClick : function(data){
					setOnActionsModalAC(data);
				},
				onInit : function(data){
					setOnActionsModalAC(data);
				},
				onReset : function(data){
					setOnActionsModalAC(data);
				}
			});

			function confirmarAsociarCuentas(){
				$('#modal-asociar-cuentas #paso-1').hide();

				var asociadas = []
				var html = '';

				$.each(_modalAsociarCuentas['postData'] , function( index, elemento ) {
					if(_modalAsociarCuentas['postDataAsociada']['c-'+elemento])
						asociadas.push(elemento);
				});

				if(asociadas.length>0){
					$('#modal-asociar-cuentas #paso-2').show();
					$.each(asociadas , function( index, elemento ) {
						html+= '<strong>'+elemento+'</strong>';

						if(index==asociadas.length-2)
							html+= ' y ';
						else
							html+=', ';

					});

					$('#modal-asociar-cuentas #paso-2 #cuentas-ya-asociadas').html(html);
					$('#modal-asociar-cuentas #notif-robo').removeClass('hidden');
				}
				else{
					$('#modal-asociar-cuentas #paso-3').show();
					$('#modal-asociar-cuentas #notif-robo').addClass('hidden');
				}
				
			}

			function initActionsModalAsociarCuentas(){
				
				onCheckboxModalAsociar();
				setActionsSearch();
				// SEARCH
				$('#modal-asociar-cuentas').on('click', '#btn-search-cuentas-aso', function(){
					var $select = $(this).parent().parent('.search-by-container').find('select[name="searchby"]');
					var opc = $select.find(':selected').data('value');
					getModalAsociarData(currentSearch, opc.key);
				});

				
				$('#modal-asociar-cuentas').on('click', '#btn-show-confirmacion', function(){
					confirmarAsociarCuentas();
				});

				$('#modal-asociar-cuentas').on('click', '#btn-submit-cuentas', function(){
					postDataAsociarCuentas();
				});

				$('#modal-asociar-cuentas').on('click', '#btn-regresar', function(){
					$('#paso-2').hide();
					$('#paso-1').show();
				});

				$('#modal-asociar-cuentas .order-by-modal').on('click', 'button', function(){
					var opciones = $(this).data('opc');
					
					_modalAsociarCuentas['data'] = orderItemsModal(opciones, _modalAsociarCuentas['data']);

					_modalAsociarCuentas['paginacion'].updateItems(_modalAsociarCuentas['data']);

					_modalAsociarCuentas['dataPaginacion'] =_modalAsociarCuentas['paginacion'].showPage(1);

					generarListadoAsociarCuentas(_modalAsociarCuentas['dataPaginacion']);
				});

				$('#modal-asociar-cuentas').on('click', '.btn-limpiar-filtro-asoc', function(){
					resetModalAsociarCuentas();
				});

			}

			function setOnActionsModalAC(data){
				_modalAsociarCuentas['dataPaginacion'] = data;
				generarListadoAsociarCuentas(_modalAsociarCuentas['dataPaginacion']);
			}

			function updateModalPostData(flag){
				_modalAsociarCuentas['postData'] = []
				_modalAsociarCuentas['postDataAsociada'] = [];

				if(flag){
					$.each(_modalAsociarCuentas['data'] , function( index, elemento ) {
						_modalAsociarCuentas['postData'].push(elemento.id);
						_modalAsociarCuentas['postDataAsociada']['c-'+elemento.id] = elemento.asociada;
					});
				}

				console.log(_modalAsociarCuentas['postDataAsociada']);

			}


			var limitM = (typeof $('#checkall-modal-cuentas').data('limit') != 'undefined' ? $('#checkall-modal-cuentas').data('limit') : 0),
				isLimitedM = (limitM>0 ? true : false);

			function onCheckboxModalAsociar(){

				function checkButtonsActive(){

					if(_modalAsociarCuentas['postData'].length>0)
						$('#btn-show-confirmacion').prop('disabled', false);
					else
						$('#btn-show-confirmacion').prop('disabled', true);
				}

				// SELECT ALL TODAS LAS PÁGINAS
				$("#check-all-cuentas-modal").click(function(e) {
					e.preventDefault();

					var $checkboxAll = $(this);
					var flag = $checkboxAll.data('value');
					allCheckedModal = flag;

					$('#checkbox-all-modal').prop('checked', flag);

					//Seleccionar los elementos de la página que están visibles
					$('#listado-result-asoc .content-r-asoc input[type="checkbox"]').each(function( index ) {

						var $singleCheckbox = $(this);
						$singleCheckbox.prop( "checked", flag );

						var $parent = $(this).closest('.content-r-asoc');

						if(flag)
							$parent.addClass('checked-element');
						else
							$parent.removeClass('checked-element');

					});

					updateModalPostData(flag);

					$checkboxAll.data('value', !flag);
					
					if(flag){
						setMessageCheckbox(flag);
					}

					else{
						$('#modal-asociar-cuentas .listado-select-all-block').removeClass('active');
						$('#total-cuentas-checkbox-modal').html('esta cuenta.');				
					}


					checkButtonsActive();
				});

				// SELECT ALL POR PÁGINA
				$("#listado-result-asoc .head-r-asoc .checkbox-container input").change(function() {

					var $checkboxAll = $(this);

					//SE ACTUALIZA CADA UNO DE LOS ELEMENTOS DE LA PÁGINA
					$('#listado-result-asoc .content-r-asoc input[type="checkbox"]').each(function( index ) {

						var $singleCheckbox = $(this);

						var $parent = $singleCheckbox.closest('.content-r-asoc');
						var cuentaId = $singleCheckbox.val();

						var index = _modalAsociarCuentas['postData'].indexOf(cuentaId);

						if($checkboxAll.is(":checked")){

							if (index <= -1) {
								_modalAsociarCuentas['postData'].push(cuentaId);
								_modalAsociarCuentas['postDataAsociada']['c-'+cuentaId] = $singleCheckbox.data('asociada');
							}
							
							$singleCheckbox.prop( "checked", true );
							$parent.addClass('checked-element');
						}
						else {
							
							if (index > -1) {
							    _modalAsociarCuentas['postData'].splice(index, 1);
							    delete  _modalAsociarCuentas['postDataAsociada']['c-'+cuentaId];
							}

							$singleCheckbox.prop( "checked", false );
							$parent.removeClass('checked-element');
							
						}

					});

					// MOSTRAR EL MENSAJE PARA PODER SELECCIONAR TODOS
					if($checkboxAll.is(":checked")) {
						setMessageCheckbox(false);
					}
					else{
						$('#modal-asociar-cuentas .listado-select-all-block').removeClass('active');
					}

					allCheckedModal = false;

					checkButtonsActive();
					
				});

				//CHECKBOX INDIVIDUAL
				$('#modal-asociar-cuentas').on('change', '.content-r-asoc .checkbox-container input', function(){

					var $singleCheckbox = $(this);
					var $parent = $singleCheckbox.closest('.content-r-asoc');
					var cuentaId = $singleCheckbox.val();

					if($singleCheckbox.is(":checked")){
						_modalAsociarCuentas['postData'].push(cuentaId);
						_modalAsociarCuentas['postDataAsociada']['c-'+cuentaId] = $singleCheckbox.data('asociada');
					}

					else{
						var index = _modalAsociarCuentas['postData'].indexOf(cuentaId);

						if (index > -1) {
						    _modalAsociarCuentas['postData'].splice(index, 1);
						    delete  _modalAsociarCuentas['postDataAsociada']['c-'+cuentaId];
						}
					}


					//Actualizar checkboxALL activado o desactivado
					var checkboxAllFlag = false;
					

					if($('#listado-result-asoc .content-r-asoc .checkbox-container input[type="checkbox"]').length == $('#listado-result-asoc .content-r-asoc .checkbox-container input[type="checkbox"]:checked').length){
						checkboxAllFlag = true;
						setMessageCheckbox(false);
						$('#modal-asociar-cuentas .listado-select-all-block').addClass('active');
					}
					else
						$('#modal-asociar-cuentas .listado-select-all-block').removeClass('active');

					$('#listado-result-asoc .head-r-asoc .checkbox-container input').prop('checked', checkboxAllFlag);

					if(_modalAsociarCuentas['postData'].length == _modalAsociarCuentas['data'].length )
						allCheckedModal = true;
					else
						allCheckedModal = false; 

					var disabled = _modalAsociarCuentas['postData'].length>0 ? false : true;

					$('#modal-asociar-cuentas #btn-show-confirmacion').prop( "disabled", disabled );

				});
			}

			function setMessageCheckbox(selectAll){
	
				var totalcheckbox = _modalAsociarCuentas['data'].length;
				var totalpagecheckbox = $('#listado-result-asoc .content-r-asoc input[type="checkbox"]').length;

				$('.total-all-pagina-checkbox').html(totalcheckbox);
				if(isLimitedM && totalcheckbox>limitM)
					$('#check-all-cuentas-modal').addClass('hidden');

				if(totalpagecheckbox == 0){
					$('#checkall-modal-cuentas input').prop("checked", false);
					$('#modal-cuentas-asociadas .listado-select-all-block').removeClass('active');
				}
				else if(selectAll){
					$('#check-all-cuentas-modal').html('Anular la selección');
					$('#total-cuentas-checkbox-modal').html('todo el listado.');
					$('#total-checkbox-cuentas-modal').html(totalcheckbox);

				}
				else{
				
					$('#check-all-cuentas-modal').html('Seleccionar las <strong>'+totalcheckbox+'</strong> cuentas del listado');
					$('#total-cuentas-checkbox-modal').html('esta página (puede elegir máximo 50). ');	
					$('#total-checkbox-cuentas-modal').html(totalpagecheckbox);			
				}

				if(isLimitedM && totalpagecheckbox == 0)
					$('#modal-asociar-cuentas .listado-select-all-block').removeClass('active');
				else
					$('#modal-asociar-cuentas .listado-select-all-block').addClass('active');

			}

			function generarListadoAsociarCuentas(data){

				var checkBoxAllBatch = true;

				var $main = $('#modal-asociar-cuentas .results-asoc');

				$( "#modal-asociar-cuentas .results-asoc .content-r-asoc" ).remove();

				$.each(data , function( index, elemento ) {
					var htmlLista = '<div class="col-xs-12 col-sm-12 content-r-asoc '+(elemento.asociada ? 'set-asoc' : '')+'"> <div class="col-sm-1 col-xs-2 content-item-block checkb-r-asoc"> <div class="data-write checkbox-container"> <input type="checkbox" id="asociar-cuenta-'+elemento.id+'" name="cc" value="'+elemento.id+'" '+(_modalAsociarCuentas['postData'].indexOf((elemento.id).toString()) > -1 ? 'checked' : '' )+' data-asociada = "'+elemento.asociada+'"> <label for="asociar-cuenta-'+elemento.id+'"><span class="check-sq"></span></label> </div> </div> <div class="col-sm-11 col-xs-10 content-item-block"> <div class="col-sm-10 col-xs-7 flexbox v-align-center"><div class="col-sm-2 region-container"> <label class="hidden-sm hidden-md hidden-lg">Región:</label><p title="'+elemento.region+'">'+elemento.region+'</p> </div><div class="col-sm-2 flexbox h-align-center"> <span class="icon '+(elemento.tipo == 1 ? 'io-City' : 'io-simple-avatar')+'" title="'+(elemento.tipo == 1 ? 'Cuenta padre' : 'Cuenta hija')+'"></span> <p class="account-hra" title="'+elemento.cuenta+'">'+elemento.cuenta+'</p> </div> <div class="col-sm-4"> <p title="'+elemento.rfc+'">'+elemento.rfc+'</p> </div> <div class="col-sm-4"> <p title="'+elemento.razonsocial+'">'+elemento.razonsocial+'</p> </div> </div><div class="col-sm-2 col-xs-5"> <p title="'+(elemento.asociada ? 'Asociada' : 'Sin asociar')+'">'+(elemento.asociada ? 'Asociada' : 'Sin asociar')+'</p> </div> </div> </div>';

					var i = _modalAsociarCuentas['postData'].indexOf(elemento.id);

					if (i == -1) 
						checkBoxAllBatch = false;

				  	$main.append(htmlLista);

				});

				$('#checkall-modal-cuentas input').prop("checked", checkBoxAllBatch);

				

				if(!checkBoxAllBatch){
					$('#modal-asociar-cuentas .listado-select-all-block').removeClass('active');
				}
				else{
					setMessageCheckbox(allCheckedModal);
				}


			}

			function resetModalAsociarCuentas(){
				$('#modal-asociar-cuentas #btn-show-confirmacion').prop( "disabled", true );
				$('#modal-asociar-cuentas .form-ge-mod').removeClass('success').show();
				$('#modal-asociar-cuentas .listado-select-all-block').removeClass('active');
				$('#modal-asociar-cuentas #listado-result-asoc, #modal-asociar-cuentas .pagination-block, #modal-asociar-cuentas .button-field-mod, #sin-resultados').addClass('hidden');

				$('#modal-asociar-cuentas #paso-1').show();
				$('#modal-asociar-cuentas #paso-2').hide();
				$('#modal-asociar-cuentas #paso-3').hide();

				$('#modal-asociar-cuentas input[type="text"]').val('');
				$('#modal-asociar-cuentas #btn-search-cuentas-aso').prop('disabled', true);

			}

			function getModalAsociarData(search, key){

				_modalAsociarCuentas['postData'] = [];
				_modalAsociarCuentas['postDataAsociada'] = [];

				function hardcodearData(search, key){
					var resultados = [];
					if(typeof search != 'undefined' && typeof key != 'undefined'){
						search = search.toLowerCase();

						for(var i=0; i<cuentasAsociadas.length; i++) {
						  if((cuentasAsociadas[i][key].toLowerCase()).indexOf(search)!=-1) {
						      resultados.push(cuentasAsociadas[i]);
						    }
						}
					}

					return resultados;
				}

				function getCuentasAsociadas(){

					generalLoadingIcon('#modal-asociar-cuentas .in-cont-mod', true);

					// Aquí va el llamado al SERVICIO y a la API json 
					var apiCuentas = (typeof $modal.data('api') != 'undefined' ? $modal.data('api') : postURL);

					$.getJSON( apiCuentas, {id: modalCurrentData.id, search : search, key: key})
					  .done(function( json ) {
					  	
					  	Services.gestionGrupos.cuentasAsociadasSuccessCallback(_modalAsociarCuentas, json, cuentasAsociadas);

					  	generalLoadingIcon('#modal-asociar-cuentas .in-cont-mod', false);
					  	cuentasAsociadas = cuentasAsociadas.value;

					  })
					  .fail(function( jqxhr, textStatus, error ) {

					  	Services.gestionGrupos.cuentasAsociadasFailCallback(_modalAsociarCuentas, json);
					  	generalLoadingIcon('#modal-asociar-cuentas .in-cont-mod', false);
					});

					// _modalAsociarCuentas['data'] = cuentasAsociadas;
				}

				getCuentasAsociadas();

			}

			var validNotEmpty = true;
			var searchby = null;
			var currentSearch = '';

			function setActionsSearch(){
				function addActionSearch($parent){

					$parent.find('button[type="submit"]').click(function(){
						var search = $parent.find('.search-input-block .search-input-'+searchby.key).val();
						var query = '?search-by='+searchby.key+'&search='+search;
						window.location.href = (location.hostname!='localhost' ? '/cliente/2016/mi-telcel-empresas' : '' )+'/sections/gestion-grupos/'+searchby.view+query;
					});
				}

				function getUrlNoQuery(){
					
					var url = window.location.href.split('?')[0];
					return url;
				}

				var $container = $('#modal-asociar-cuentas .search-by-container');
				validNotEmpty = true;
				searchby = null;
				currentSearch = '';

				resetSearchInput($container);  

				$container.find('.search-input-block input').each(function (i) { 
				  	var $element = $(this);
				  	validateNotEmptySearch($element, $container);
				});
				
				if($container.hasClass('gestion-cuentas-search')){
					addActionSearch($container);
				}

				$container.find('.searchby').change(function(){
					searchby = $(this).find(":selected").data('value');
					resetSearchInput($container);
					if(typeof searchby != 'undefined')
						$container.find('.search-input-block .search-input-'+searchby.key).show();

				});
			}

			function setBuscador(){
				var $container = $('#modal-asociar-cuentas .search-by-container');
				var $firstSelected = $container.find(":selected");

				resetSearchInput($container);

				if($firstSelected.val()==''){
					//Seleccionar la primera
					$container.find('option:nth-child(2)').prop("selected", true);
					$firstSelected = $container.find(":selected");
					//Fix safari
					if($firstSelected.length>1)
						$firstSelected = $container.find(":selected:nth-child(2)");
					//Fin fix safari
				}
				
				searchby = $firstSelected.data('value');
				
				
				$container.find('.search-input-block .search-input-'+searchby.key).show();

				//Seleccionar primera opcion
			}

			function resetSearchInput($parent){
				validNotEmpty = true;
				$parent.find('.search-input-block input[type="text"]').val('');
				$parent.find('.search-input-block input[type="text"]').hide();
				$parent.find('.search-input-block button[type="submit"]').prop('disabled', true);
				$parent.find('#btn-search-cuentas-aso').prop('disabled', true);
			}

			function validateNotEmptySearch($element, $container){

				$element.bind('input', function() {

					if(searchby && $container.find('.search-input-'+searchby.key) ){
						var ivalue = $container.find('.search-input-'+searchby.key).val();

						currentSearch = ivalue;

						if (ivalue.length>=searchby.min) 
							validNotEmpty = false;
						else
							validNotEmpty = true;
					}


					disableSumbitButton($container.closest('.search-by-container'), validNotEmpty);

				});

			}

		}

		function postDataAsociarCuentas(){

			var data = { success: false, data: [] };

			var post = _modalAsociarCuentas['postData'];
			var container = '#modal-confirmacion-cuentas .in-cont-mod';

			if(!formElementsModales['asociarCuentas']['sending']){

				formElementsModales['asociarCuentas']['sending'] = true;
				generalLoadingIcon(container, true);

				var urlPOST = Services.apiURL.asociarCuentas();

				$.post( urlPOST , { data: JSON.stringify(post) })
				  .done(function( json ) {

				  	Services.gestionEjecutivos.asociarCuentasSuccessCallback(json, container);
				  	formElementsModales['asociarCuentas']['sending'] = false;
				  	generalLoadingIcon(container, false);

				  })
				  .fail(function( jqxhr, textStatus, error ) {
				  	Services.gestionEjecutivos.asociarCuentasFailCallback(json, container);
				  	formElementsModales['asociarCuentas']['sending'] = false;
				  	generalLoadingIcon(container, false);
				});
			}
		}


	}

	/** Validar nombre de alias al editar **/
	function validName(value){
		var validation = {
			empty : { test : value.length>0 , message: 'Es necesario ingresar un nombre para el alias.' },
			name : 	{ test : value.length == value.toString().trim().length, message: 'El nombre no debe tener espacio al inicio o final.' }
		};

		console.log(validation.empty.test);
		return validation.name.test && validation.empty.test;
	}

	function validNameMsg(value){
		var validation = {
			empty : { test : value.length>0 , message: 'Es necesario ingresar un nombre para el alias.' },
			name : 	{ test : value.length == value.toString().trim().length, message: 'El nombre no debe tener espacio al inicio o final.' }
		};	

		return ( !validation.empty.test ? validation.empty.message : validation.name.message );
	}

	function validateNameOnInput($input){
		var value = $input.val();
		var $element = $input.closest('.group-block');
		var $button = $input.next('.btn-guardar-nombre');

		if(validName(value)){
			$element.find('.triangle-tooltip').remove();
			$input.removeClass('error');
			$button.prop('disabled', false);
		}
		else{
			$button.prop('disabled', true);
			appendError($element, $input, validNameMsg(value));
		}
	}

	function appendError($e, $i, message){
		if($e.find('.triangle-tooltip').length == 0){
			var errorhtml = '<div class="triangle-tooltip error-tooltip triangle-bottom nombre-error"><p>'+message+'</p></div>';
			$e.append(errorhtml);
			$i.addClass('error');
		}
	}

	function verifyName($element){
		var $input = $element.find('.editar-alias');
		var value = $input.val();
		var id = $element.data('item').id;
		if(validName(value)){

			$element.find('.triangle-tooltip').remove();
			$input.removeClass('error');

			var urlPOST = Services.apiURL.editarNombreAlias();

			$.post( urlPOST , { edit: value, id: id })
			  .done(function( json ) {
			  	Services.gestionEjecutivos.editarNombreAliasSuccessCallback( json, value, appendError, {input : $input, element : $element });
			 	//Checar si hay algún elemento que se quiere editar
			  	$input.blur();
				$input.focusout();
				checkElementToEdit();
			  })
			  .fail(function( jqxhr, textStatus, error ) {
			  	Services.gestionEjecutivos.editarNombreAliasFailCallback( error );
			});
		}
		else if(editandoNombre && editandoNombreValor!=null){
			$input.val(editandoNombreValor);
			$closestGuardarElement.trigger('click');
			editandoNombreValor = null;
		}
	}

	/** fin validar nombre de alias al editar **/

	function orderItems(opc){
		if(opc.key == 'nombre')
			dataFiltered = sortByAZ(dataFiltered, opc.key);
		else
			dataFiltered = sortByNumber(dataFiltered, opc.key);

		if(opc.orderby == 'desc')
			dataFiltered.reverse();

		paginacion.updateItems(dataFiltered);
		paginacion.reset();

	}

	return{
		inicializar : init
	}

})();