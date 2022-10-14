/*-----------------------------------------------*\
         GLOBAL VARIABLES
\*-----------------------------------------------*/

// URLS:
var url_hallazgo_proceso = window.location.origin + "/api-calidad/hallazgoproceso/"
var url_analisis_hallazgo = window.location.origin + "/api-calidad/analisishallazgo/"
var url_profile = window.location.origin + "/api-seguridad/profile/"
var url_archivo = window.location.origin + "/api-home/archivo/"
var url_metodologia = window.location.origin + "/api-calidad/metodologia/"
var url_plan_accion_hallazgo = window.location.origin + "/api-calidad/planaccionhallazgo/"
var url_seguimiento_plan = window.location.origin + "/api-calidad/seguimientoplanaccion/"
var url_evidencia_hallazgo = window.location.origin + "/api-calidad/evidenciahallazgo/"


// OBJS
var menu = null
var tarjeta_detalle_hallazgo = null
var tarjeta_analisis = null
var tarjeta_plan_accion = null
var popup_analisis = null
var popup_actividad = null
var popup_acciones = null
var popup_evaluacion_plan = null
var popup_seguimiento_plan = null
var tarjeta_evidencia = null
var popup_evidencia = null

/*-----------------------------------------------*\
         LOAD
\*-----------------------------------------------*/

$(document).ready(function () {

   menu = new Menu()
   tarjeta_detalle_hallazgo = new TarjetaDetalleHallazgo()
   tarjeta_analisis = new TarjetaAnalisis()
   tarjeta_plan_accion = new TarjetaPlanAccion()
   tarjeta_evidencia = new TarjetaEvidencia()
})

/*-----------------------------------------------*\
         OBJETO: Menu
\*-----------------------------------------------*/

function Menu() {

   this.$elemento_lista = $('#id_lista>a[href*=\\#]')
   this.$ventana = $(window)
   this.$topPosition = $('.nova-slider-menu').offset().top - 60
   this.$menu_flotante = $('.nova-slider-menu')
   this.init_Events()
}
Menu.prototype.init_Events = function () {

   this.$elemento_lista.on("click", this, this.click_ElementoLista)
   this.$ventana.on("scroll", this, this.scroll_Ventana)
   this.$ventana.on("resize", this, this.resize_Ventana)
   this.$lista_acciones = $("#lista_acciones")
}
Menu.prototype.click_ElementoLista = function () {

   $(this).addClass('active').siblings().removeClass('active')

   if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {

      var $target = $(this.hash)

      $target = $target.length && $target || $('[name=' + this.hash.slice(1) +']')

      if ($target.length) {
         var targetOffset = $target.offset().top
         $('html,body').animate({scrollTop: targetOffset-60}, 1000)
         return false
      }
   }
}
Menu.prototype.scroll_Ventana = function (e) {

   var menu_flotante_ancho = $('.nova-slider').outerWidth()
   e.data.$lista_acciones.css("width", menu_flotante_ancho)

   if (window.matchMedia('(min-width: 992px)').matches) {
      if ((e.data.$ventana.scrollTop() > e.data.$topPosition) ) {
         e.data.$menu_flotante.addClass('sticky')
      }
      else {
         e.data.$menu_flotante.removeClass('sticky')
      }
   }
   else {
      e.data.$menu_flotante.removeClass('sticky')
   }
}
Menu.prototype.resize_Ventana = function (e) {

   var menu_flotante_ancho = $('.nova-slider').outerWidth()
   e.data.$lista_acciones.css("width", menu_flotante_ancho)

   if (window.matchMedia('(max-width: 992px)').matches) {
      e.data.$menu_flotante.addClass('nova-slider-menu-fixed')
   }
   else {
      e.data.$menu_flotante.removeClass('nova-slider-menu-fixed')
   }
}

/*-----------------------------------------------*\
         OBJETO: TarjetaDetalleHallazgo
\*-----------------------------------------------*/

function TarjetaDetalleHallazgo(){

   this.$id_titulo = $('#id_titulo')
   this.$id_requisito_referencia = $('#id_requisito_referencia')
   this.$id_descripciones = $('#id_descripciones')
   this.$id_tipo_hallazgo = $('#id_tipo_hallazgo')
   this.$id_observaciones = $('#id_observaciones')
   this.$id_actual_user = $('#id_actual_user')
   this.$id_pk_hal = $('#id_pk_hal')
   this.$cerrado = $('#cerrado').val()
   this.init_Components()
}
TarjetaDetalleHallazgo.prototype.init_Components = function () {

   this.$id_requisito_referencia.multiselect(this.get_ConfMultiSelect())
   this.$id_requisito_referencia.siblings("div.btn-group").find("ul.multiselect-container").addClass('nova-bootstrap-multiselect-width-ul')
   this.$id_descripciones.multiselect(this.get_ConfMultiSelect())
   this.$id_descripciones.siblings("div.btn-group").find("ul.multiselect-container").addClass('nova-bootstrap-multiselect-width-ul')
   this.$id_tipo_hallazgo.select2(appnova.get_ConfigSelect2())
}
TarjetaDetalleHallazgo.prototype.get_ConfMultiSelect = function () {

   return {

      enableFiltering: true,
      buttonWidth: '100%',
      numberDisplayed: 2,
      maxHeight: 250,
      nonSelectedText: "Sin Selección",
      allSelectedText: "Todo Seleccionado",
      nSelectedText: "Seleccionados",
      filterPlaceholder: "Buscar",
      disableIfEmpty: true,
   }
}

/*-----------------------------------------------*\
         OBJETO: Tarjeta Analisis
\*-----------------------------------------------*/

function TarjetaAnalisis() {

   this.toolbar = new ToolBarAnalisis()
   this.grid = new GridAnalisis()
}

/*-----------------------------------------------*\
         OBJETO: ToolBar Analisis
\*-----------------------------------------------*/

function ToolBarAnalisis() {

   popup_analisis = new PopupAnalisis()
   this.$boton_nuevo = $('#id_boton_analisis')
   this.init_Events()
}
ToolBarAnalisis.prototype.init_Events = function () {

   this.$boton_nuevo.on("click", this, this.click_BotonNuevo)
}
ToolBarAnalisis.prototype.click_BotonNuevo = function (e) {

   popup_analisis.mostrar( 0, "nuevo" )
}

/*-----------------------------------------------*\
         OBJETO: Grid Analisis
\*-----------------------------------------------*/

function GridAnalisis() {

   this.$id = $('#id_grid_analisis_causa')
   this.$id_tbody = $('#id_tbody_analisis')
   this.init_Events()
   this.load_Data()
}
GridAnalisis.prototype.init_Events = function () {

   this.$id.on("click", '.clickable-row', this.click_FilaGrid)
   this.$id.on("click", '[data-event=\'editarAnalisis\']', this.click_EditarAnalisis)
   this.$id.on("click", '[data-event=\'eliminarAnalisis\']', this.click_EliminarAnalisis)
}
GridAnalisis.prototype.click_FilaGrid = function () {

   $(this).addClass('nova-active-row').siblings().removeClass('nova-active-row')
}
GridAnalisis.prototype.click_EditarAnalisis = function (e) {

   e.preventDefault()
   pk = this.getAttribute("data-id")
   popup_analisis.mostrar( pk, "editar")
}
GridAnalisis.prototype.click_EliminarAnalisis = function (e) {

   e.preventDefault()
   pk = this.getAttribute("data-id")
   tarjeta_analisis.grid.eliminar(pk)
}
GridAnalisis.prototype.load_Data = function () {

   $.ajax({

      url: url_analisis_hallazgo,
      method: "GET",
      context: this,
      data: {

         hallazgo_id: tarjeta_detalle_hallazgo.$id_pk_hal.val(),
      },
      success: function (_response) {

         this.refresh_Data(_response)
     },
     error: function (_response) {

        alertify.error("Ocurrio error al cargar datos")
     }
  })
}
GridAnalisis.prototype.refresh_Data = function (_response) {

   this.$id_tbody.text()
   var datos = ''
   if (_response.length) {

      if (tarjeta_detalle_hallazgo.$cerrado == "Si") {

         for (var i = 0; i < _response.length; i++) {

             datos += '<tr class="clickable-row">' +
                         '<td>' +
                            '<button class="btn btn-default nova-url" data-event="editarAnalisis" data-id="' + _response[i].pk + '">' + _response[i].titulo + '</button>' +
                         '</td>' +
                         '<td>' +
                            _response[i].metodologia_nombre +
                         '</td>' +
                         '<td>' +
                            _response[i].causa +
                         '</td>' +
                      '</tr>'
         }
      }
      else {

         for (var i = 0; i < _response.length; i++) {

             datos += '<tr class="clickable-row">' +
                         '<td>' +
                            '<button class="btn nova-btn btn-default nova-btn-delete" data-id="' + _response[i].pk + '" data-event="eliminarAnalisis">' +
                               '<i class="icon icon-left icon mdi mdi-delete nova-white"></i>' +
                            '</button>' +
                         '</td>' +
                         '<td>' +
                            '<button class="btn btn-default nova-url" data-event="editarAnalisis" data-id="' + _response[i].pk + '">' + _response[i].titulo + '</button>' +
                         '</td>' +
                         '<td>' +
                            _response[i].metodologia_nombre +
                         '</td>' +
                         '<td>' +
                            _response[i].causa +
                         '</td>' +
                      '</tr>'
         }
      }
   }
   else {

      datos +=  '<tr class="clickable-row">' +
                   '<td colspan="4" class="nova-aling-center nova-sin-resultados">No se encontraron resultados.</td>' +
                '</tr>'
   }
   this.$id_tbody.html(datos)
}
GridAnalisis.prototype.eliminar = function (_pk) {

   alertify.confirm(

      'Eliminar Registro',
      '¿Desea Eliminar este registro?',
      function (e) {

         $.ajax({
            url: url_analisis_hallazgo + _pk + '/',
            method: "DELETE",
            headers: { "X-CSRFToken": appnova.galletita },
            success: function () {
               tarjeta_analisis.grid.load_Data()
               alertify.success("Se eliminó registro correctamente")
            },
            error: function () {

               alertify.error("Ocurrió un error al eliminar")
            }
         })
      },
      null
   )
}

/*-----------------------------------------------*\
         OBJETO: Popup Analisis
\*-----------------------------------------------*/

function PopupAnalisis() {

   this.$id = $('#id_tarjeta_analisis')
   this.$id_mensaje_error = $('#id_mensaje_error_analisis')
   this.$id_popup_titulo = $('#id_popup_titulo_analisis')
   this.$id_titulo = $('#id_titulo_analisis')
   this.$id_metodologia = $('#id_metodologia')
   this.$id_causas = $('#id_causas')
   this.$id_archivo = $('#id_archivo_analisis')
   this.$id_boton_guardar = $('#id_boton_guardar_analisis')
   this.$accion
   this.$pk_analisis
   this.$ocultar = false
   this.init_Components()
   this.init_Events()
}
PopupAnalisis.prototype.init_Components = function () {

   this.$id_metodologia.select2(appnova.get_ConfigSelect2())
   this.$id_archivo.fileinput(this.get_ConfigFileInput(true, false, [], []))
}
PopupAnalisis.prototype.init_Events = function () {

   this.$id_boton_guardar.on("click", this, this.click_BotonGuardar)
   this.$id_archivo.on("filebatchuploadcomplete", this, this.uploadcomplete_Filebatch)
   this.$id_archivo.on('filezoomhidden', this, this.hidden_FileZoom)
   this.$id.on("hidden.bs.modal", this, this.hidden_Modal)
}
PopupAnalisis.prototype.get_ConfigFileInput = function (_show_delete, _show_upload_button, _initial_preview, _initial_preview_config ) {

   return {

          uploadUrl: url_archivo,
          ajaxSettings: {  headers: { "X-CSRFToken": appnova.galletita }  },
          ajaxDeleteSettings: {  method: "DELETE", headers: { "X-CSRFToken": appnova.galletita }  },
          allowedFileExtensions: ['jpg', 'jpeg', 'png', 'bmp', 'txt', 'pdf'],
          allowedPreviewMimeTypes: ['jpg', 'jpeg', 'png', 'bmp', 'txt', 'pdf'],
          uploadAsync: true,
          maxFileCount: 15,
          showRemove: false,
          showClose: false,
          maxFileSize: 2048,
          showUpload: _show_upload_button,
          initialPreviewShowDelete: _show_delete,
          showCaption: false,
          showBrowse: false,
          browseOnZoneClick: true,
          fileActionSettings: {
             showUpload: false,
          },
          uploadExtraData: function(previewId, index) {
             if (popup_analisis.$id_archivo.fileinput('getFileStack').length > 0) {

                return {

                   archivo: popup_analisis.$id_archivo.fileinput('getFileStack')[index],
                   tipo_archivo: "cal_anali",
                   content_object: url_analisis_hallazgo + popup_analisis.$pk_analisis + "/",
                   created_by: url_profile + tarjeta_detalle_hallazgo.$id_actual_user.val() + "/",
                }
             }
          },
          overwriteInitial: false,
          initialPreviewAsData: true,
          initialPreview: _initial_preview,
          initialPreviewConfig: _initial_preview_config,
          language:"es",
     }
}
PopupAnalisis.prototype.click_BotonGuardar = function (e) {

   e.data.$ocultar = true
   if (tarjeta_detalle_hallazgo.$cerrado == "No") {
      e.data.guardar_Analisis(e)
   }

}
PopupAnalisis.prototype.uploadcomplete_Filebatch = function (e, files) {

   if(e.data.$ocultar) {

      e.data.$id.modal('hide')
      tarjeta_analisis.grid.load_Data()
      e.data.$ocultar = false
   }
}
PopupAnalisis.prototype.hidden_FileZoom = function (e) {

   $("body").addClass("modal-open")
   $("html").addClass("be-modal-open")
}
PopupAnalisis.prototype.hidden_Modal = function (e) {

   e.data.clear_Estilos(e)
   e.data.clear_Formulario(e)
}
PopupAnalisis.prototype.guardar_Analisis = function (e) {

   if (e.data.$accion == "nuevo") {

      e.data.clear_Estilos(e)
      e.data.crear(e)
   }
   else if (e.data.$accion == "editar") {

      pk = e.data.$id.attr("data-primaryKey")
      e.data.editar(e, pk)
   }
}
PopupAnalisis.prototype.clear_Estilos = function (e) {

   e.data.$id_titulo.removeClass("nova-has-error")
   e.data.$id_metodologia.data('select2').$selection.removeClass("nova-has-error")
   e.data.$id_causas.removeClass("nova-has-error")
   e.data.$id_mensaje_error.html('')
}
PopupAnalisis.prototype.clear_Formulario = function (e) {

   e.data.$id_titulo.val("")
   e.data.$id_metodologia.val("").trigger("change")
   e.data.$id_causas.val("")
   e.data.$id_archivo.fileinput('destroy')
   e.data.$id_archivo.fileinput(this.get_ConfigFileInput(true, false, [], [] ))
}
PopupAnalisis.prototype.mostrar = function (_pk, _accion) {

   this.$id.modal('show').attr("data-primaryKey", _pk)
   this.$accion = _accion

   if (_accion == "nuevo") {

      this.$id_popup_titulo.text('Nuevo Analisis de Causas')
   }
   else if (_accion == "editar") {

      this.$id_popup_titulo.text('Editar Analisis de Causas')
      this.set_Data(_pk)
      this.$pk_analisis = _pk
   }
}
PopupAnalisis.prototype.validar = function () {

   var bandera = true

   if ( appnova.validar_EspaciosSaltos(this.$id_titulo.val()) == "" ) {

      this.$id_titulo.addClass("nova-has-error")
      bandera = false
   }
   if ( this.$id_metodologia.val() == "" ) {

      this.$id_metodologia.data('select2').$selection.addClass("nova-has-error")
      bandera = false
   }
   if ( appnova.validar_EspaciosSaltos(this.$id_causas.val()) == "" ) {

      this.$id_causas.addClass("nova-has-error")
      bandera = false
   }

   if ( !bandera ){

      this.$id_mensaje_error.html('Completa los campos marcados en rojo.')
   }

   return bandera
}
PopupAnalisis.prototype.crear = function (e) {

   if (e.data.validar()) {

      $.ajax({
         url: url_analisis_hallazgo,
         method: "POST",
         headers: { "X-CSRFToken": appnova.galletita },
         data: {

            "titulo": e.data.$id_titulo.val(),
            "metodologia": url_metodologia + e.data.$id_metodologia.val() + "/",
            "causa": e.data.$id_causas.val(),
            "hallazgo": url_hallazgo_proceso + tarjeta_detalle_hallazgo.$id_pk_hal.val() + "/",
            "create_by": url_profile + tarjeta_detalle_hallazgo.$id_actual_user.val() + "/",
         },
         success: function (_response) {

            if (e.data.$id_archivo.fileinput('getFileStack').length > 0) {

               e.data.$pk_analisis = _response.pk
               e.data.$id_archivo.fileinput('upload')
            }
            else {
               e.data.$id.modal('hide')
               tarjeta_analisis.grid.load_Data()
               e.data.$ocultar = false
            }
         },
         error: function (_response) {

            alertify.error("Ocurrio error al insertar analisis")
         }
      })
   }
}
PopupAnalisis.prototype.editar = function (e, _pk) {

   if (e.data.validar()) {

      $.ajax({
         url: url_analisis_hallazgo + _pk + "/",
         method: "PUT",
         headers: { "X-CSRFToken": appnova.galletita },
         data: {

            "titulo": e.data.$id_titulo.val(),
            "metodologia": url_metodologia + e.data.$id_metodologia.val() + "/",
            "causa": e.data.$id_causas.val(),
            "hallazgo": url_hallazgo_proceso + tarjeta_detalle_hallazgo.$id_pk_hal.val() + "/",
            "update_by": url_profile + tarjeta_detalle_hallazgo.$id_actual_user.val() + "/",
         },
         success: function (_response) {

            if (e.data.$id_archivo.fileinput('getFileStack').length > 0) {

               e.data.$pk_analisis = _response.pk
               e.data.$id_archivo.fileinput('upload')
            }
            else {

               e.data.$id.modal('hide')
               tarjeta_analisis.grid.load_Data()
               e.data.$ocultar = false
            }
         },
         error: function (_response) {

            alertify.error("Ocurrio error al editar analisis")
         }
      })
   }
}
PopupAnalisis.prototype.set_Data = function (_pk) {

   $.ajax({

      url: url_analisis_hallazgo + _pk +"/",
      method: "GET",
      context: this,
      success: function (_response) {

         this.$id_titulo.val(_response.titulo)
         this.$id_metodologia.val(_response.metodologia_id).trigger("change")
         this.$id_causas.val(_response.causa)
         this.cargar_Archivos(_response)
      },
      error: function (_response) {

         alertify.error("Ocurrio error al cargar datos")
      }
   })
}
PopupAnalisis.prototype.cargar_Archivos = function (_response) {

   var initial_preview = []
   var initial_preview_config = []

   for (var i = 0; i < _response.relacion_archivo.length; i++) {

      initial_preview.push(_response.relacion_archivo[i]["archivo"])
      var url_archivo_response = _response.relacion_archivo[i]["archivo"].split('/')
      var nombre_archivo = url_archivo_response[url_archivo_response.length-1]
      var extension_archivo = nombre_archivo.split('.')
      var extension = extension_archivo[extension_archivo.length-1]

      if (extension == "pdf") {

         initial_preview_config.push(
            {  type: extension, caption: nombre_archivo, url: _response.relacion_archivo[i]["pk"] }
         )
      }
      else if (extension == "txt" || extension == "docx") {

         initial_preview_config.push(
            {  type: "text", caption: nombre_archivo, url: _response.relacion_archivo[i]["pk"] }
         )
      }
      else if (extension == "jpg" || extension == "jpeg" || extension == "png" || extension == "bmp") {

         initial_preview_config.push(
            {  caption: nombre_archivo, url: _response.relacion_archivo[i]["pk"] }
         )
      }
   }

   this.$id_archivo.fileinput('destroy')
   if (tarjeta_detalle_hallazgo.$cerrado == "Si") {
      this.$id_archivo.fileinput(this.get_ConfigFileInput(false, false, initial_preview, initial_preview_config))
   }
   else {
      this.$id_archivo.fileinput(this.get_ConfigFileInput(true, true, initial_preview, initial_preview_config))
   }

}

/*-----------------------------------------------*\
         OBJETO: Tarjeta Plan Accion
\*-----------------------------------------------*/

function TarjetaPlanAccion() {

   this.toolbar = new ToolBarPlanAccion()
   this.grid = new GridPlanAccion()
}

/*-----------------------------------------------*\
         OBJETO: ToolBar Plan Accion
\*-----------------------------------------------*/

function ToolBarPlanAccion() {

   popup_actividad = new PopupActividad()
   this.$boton_plan_accion = $('#id_boton_plan')
   this.init_Events()
}
ToolBarPlanAccion.prototype.init_Events = function () {

   this.$boton_plan_accion.on("click", this, this.click_BotonNuevo)
}
ToolBarPlanAccion.prototype.click_BotonNuevo = function (e) {

   popup_actividad.mostrar( 0, "nuevo" )
}

/*-----------------------------------------------*\
         OBJETO: Grid Plan Accion
\*-----------------------------------------------*/

function GridPlanAccion() {

   popup_acciones = new PopupAcciones()
  //  popup_editarA = new PopupEditarA()
   this.$id = $('#id_grid_plan_accion')
   this.$id_tbody = $('#id_tbody_plan_accion')
   this.init_Events()
   this.load_Data()
}
GridPlanAccion.prototype.init_Events = function () {

   this.$id.on("click", '.clickable-row', this.click_FilaGrid)
   this.$id.on("click", '[data-event=\'editarPlan\']', this.click_EditarPlan)
   this.$id.on("click", '[data-event=\'accionesPlan\']', this.click_AccionesPlan)
}
GridPlanAccion.prototype.click_FilaGrid = function () {

   $(this).addClass('nova-active-row').siblings().removeClass('nova-active-row')
}
GridPlanAccion.prototype.click_EditarPlan = function (e) {

   // e.preventDefault()
   pk = this.getAttribute("data-id")
   popup_actividad.mostrar( pk, "editar")
}
GridPlanAccion.prototype.click_AccionesPlan = function (e) {

   // e.preventDefault()
   pk = this.getAttribute("data-id") //obtener data id
   popup_acciones.mostrar( pk )
   // e.data.eliminar(pk)
}
GridPlanAccion.prototype.load_Data = function () {

   $.ajax({

      url: url_plan_accion_hallazgo,
      method: "GET",
      context: this,
      data: {

         hallazgo_id: tarjeta_detalle_hallazgo.$id_pk_hal.val(),
      },
      success: function (_response) {

         this.refresh_Data(_response)
      },
      error: function (_response) {

         alertify.error("Ocurrio error al cargar datos")
      }
   })
}
GridPlanAccion.prototype.refresh_Data = function (_response) {

   this.$id_tbody.text()
   var datos = ''
   if (_response.length) {

      for (var i = 0; i < _response.length; i++) {

          datos += '<tr class="clickable-row">' +
                      '<td>' +
                        '<button class="btn nova-btn btn-default" data-event="accionesPlan" data-id="' + _response[i].pk + '">' +
                           '<i class="icon icon-left icon mdi mdi-settings nova-black"></i>' +
                        '</button>' +
                      '</td>' +
                      '<td>' +
                        '<a class="btn btn-default nova-url" data-event="editarPlan" data-id="' + _response[i].pk + '">' + _response[i].titulo + '</a>' +
                      '</td>' +
                      '<td>' + _response[i].actividad + '</td>' +
                      '<td>' + _response[i].responsable + '</td>' +
                      '<td>' + appnova.get_FechaDisplay(_response[i].fecha_programada) + '</td>' +
                      '<td>' + _response[i].evidencia + '</td>' +
                      '<td>' + _response[i].observacion + '</td>' +
                      '<td>' + _response[i].resultado + '</td>' +
                   '</tr>'
      }
   }
   else {

      datos +=  '<tr class="clickable-row">' +
                   '<td colspan="8" class="nova-aling-center nova-sin-resultados">No se encontraron resultados.</td>' +
                '</tr>'
   }
   this.$id_tbody.html(datos)
}
GridPlanAccion.prototype.eliminar = function (_pk) {

   alertify.confirm(

      'Eliminar Registro',
      '¿Desea Eliminar este registro?',
      function (e) {

         $.ajax({
            url: url_plan_accion_hallazgo + _pk + '/',
            method: "DELETE",
            headers: { "X-CSRFToken": appnova.galletita },
            success: function () {
               tarjeta_plan_accion.grid.load_Data()
               alertify.success("Se eliminó registro correctamente")
            },
            error: function () {

               alertify.error("Ocurrió un error al eliminar")
            }
         })
      },
      null
   )
}

/*-----------------------------------------------*\
         OBJETO: Popup Actividad
\*-----------------------------------------------*/

function PopupActividad() {

   this.$id = $('#id_tarjeta_actividad')
   this.$id_popup_titulo = $('#id_popup_titulo_actividad')
   this.$id_titulo = $('#id_titulo_actividad')
   this.$id_actividad = $('#id_actividad_descripcion')
   this.$id_responsable = $('#id_responsable')
   this.$id_fecha_programada = $('#id_fecha_programada_group')
   this.$id_evidencia = $('#id_evidencia_actividad')
   this.$id_boton_guardar = $('#id_boton_guardar_actividad')
   this.$id_mensaje_error = $('#id_mensaje_error_actividad')
   this.$accion

   this.$pk_actividad   //Checar si es necesaria, se usa en la accion mejor para filtrar los seguimientos del popup

   this.init_Components()
   this.init_Events()

   // this.$id_archivo = $('#id_archivo_analisis')
   // this.$ocultar = false
}
PopupActividad.prototype.init_Components = function () {

   this.$id_responsable.select2(appnova.get_ConfigSelect2())
   this.$id_fecha_programada.datepicker(appnova.get_ConfDatePicker())
}
PopupActividad.prototype.init_Events = function () {

   this.$id_boton_guardar.on("click", this, this.click_BotonGuardar)
   this.$id.on("hidden.bs.modal", this, this.hidden_Modal)
}
PopupActividad.prototype.mostrar = function (_pk, _accion) {

   this.$id.modal('show').attr("data-primaryKey", _pk)
   this.$accion = _accion

   if (_accion == "nuevo") {

      this.$id_popup_titulo.text('Nueva Actividad')
   }
   else if (_accion == "editar") {

      this.$id_popup_titulo.text('Editar Actividad')
      this.set_Data(_pk)
      this.$pk_evidencia = _pk
   }
}
PopupActividad.prototype.click_BotonGuardar = function (e) {

   // e.data.$ocultar = true
   e.data.guardar_Actividad(e)
}
PopupActividad.prototype.hidden_Modal = function (e) {

   e.data.clear_Estilos(e)
   e.data.clear_Formulario(e)
}
PopupActividad.prototype.guardar_Actividad = function (e) {

   if (e.data.$accion == "nuevo") {

      e.data.clear_Estilos(e)
      e.data.crear(e)
   }
   else if (e.data.$accion == "editar") {

      pk = e.data.$id.attr("data-primaryKey")
      e.data.editar(e, pk)
   }
}
PopupActividad.prototype.clear_Estilos = function (e) {

   e.data.$id_mensaje_error.html('')
   e.data.$id_titulo.removeClass("nova-has-error")
   e.data.$id_actividad.removeClass("nova-has-error")
   e.data.$id_responsable.data('select2').$selection.removeClass("nova-has-error")
   e.data.$id_fecha_programada.removeClass("nova-has-error")
   e.data.$id_evidencia.removeClass("nova-has-error")
}
PopupActividad.prototype.clear_Formulario = function (e) {

   e.data.$id_titulo.val("")
   e.data.$id_actividad.val("")
   e.data.$id_responsable.val("").trigger("change")
   e.data.$id_fecha_programada.datepicker("clearDates")
   e.data.$id_evidencia.val("")
}
PopupActividad.prototype.crear = function (e) {

   if (e.data.validar()) {

      $.ajax({
         url: url_plan_accion_hallazgo,
         method: "POST",
         headers: { "X-CSRFToken": appnova.galletita },
         data: {

            "titulo": e.data.$id_titulo.val(),
            "actividad": e.data.$id_actividad.val(),
            "responsable": e.data.$id_responsable.val(),
            "fecha_programada": appnova.get_FechaConFormato("#id_fecha_programada_group"),
            "evidencia": e.data.$id_evidencia.val(),
            "hallazgo": url_hallazgo_proceso + tarjeta_detalle_hallazgo.$id_pk_hal.val() + "/",
            "create_by": url_profile + tarjeta_detalle_hallazgo.$id_actual_user.val() + "/",
         },
         success: function (_response) {

            // if (e.data.$id_archivo.fileinput('getFileStack').length > 0) {
            //
            //    e.data.$pk_evidencia = _response.pk
            //    e.data.$id_archivo.fileinput('upload')
            // }
            // else {
               e.data.$id.modal('hide')
               tarjeta_plan_accion.grid.load_Data()
               e.data.$ocultar = false //Checar si es necesario
            // }
         },
         error: function (_response) {

            alertify.error("Ocurrio error al insertar evidencia")
         }
      })
   }
}
PopupActividad.prototype.editar = function (e, _pk) {

   if (e.data.validar()) {

      $.ajax({
         url: url_plan_accion_hallazgo + _pk + "/",
         method: "PUT",
         headers: { "X-CSRFToken": appnova.galletita },
         data: {

            "titulo": e.data.$id_titulo.val(),
            "actividad": e.data.$id_actividad.val(),
            "responsable": e.data.$id_responsable.val(),
            "fecha_programada": appnova.get_FechaConFormato("#id_fecha_programada_group"),
            "evidencia": e.data.$id_evidencia.val(),
            "hallazgo": url_hallazgo_proceso + tarjeta_detalle_hallazgo.$id_pk_hal.val() + "/",
            "update_by": url_profile + tarjeta_detalle_hallazgo.$id_actual_user.val() + "/",
         },
         success: function (_response) {

            // if (e.data.$id_archivo.fileinput('getFileStack').length > 0) {
            //
            //    e.data.$pk_evidencia = _response.pk
            //    e.data.$id_archivo.fileinput('upload')
            // }
            // else {
            //
               e.data.$id.modal('hide')
               tarjeta_plan_accion.grid.load_Data()
               e.data.$ocultar = false
            // }
         },
         error: function (_response) {

            alertify.error("Ocurrio error al editar actividad")

         }
      })
   }
}
PopupActividad.prototype.validar = function () {

   var bandera = true

   if ( appnova.validar_EspaciosSaltos(this.$id_titulo.val()) == "" ) {

      this.$id_titulo.addClass("nova-has-error")
      bandera = false
   }
   if ( appnova.validar_EspaciosSaltos(this.$id_actividad.val()) == "" ) {

      this.$id_actividad.addClass("nova-has-error")
      bandera = false
   }
   if ( this.$id_responsable.val() == "" ) {

      this.$id_responsable.data('select2').$selection.addClass("nova-has-error")
      bandera = false
   }
   if ( appnova.get_FechaConFormato("#id_fecha_programada_group") == "" ) {

      this.$id_fecha_programada.addClass("nova-has-error")
      bandera = false
   }
   if ( appnova.validar_EspaciosSaltos(this.$id_evidencia.val()) == "" ) {

      this.$id_evidencia.addClass("nova-has-error")
      bandera = false
   }

   if ( !bandera ){

      this.$id_mensaje_error.html('Completa los campos marcados en rojo.')
   }

   return bandera
}
PopupActividad.prototype.set_Data = function (_pk) {

   $.ajax({

      url: url_plan_accion_hallazgo + _pk + "/",
      method: "GET",
      context: this,
      success: function (_response) {

         this.$id_titulo.val(_response.titulo)
         this.$id_actividad.val(_response.actividad)
         this.$id_responsable.val(_response.responsable).trigger("change")
         appnova.set_FechaConFormato('#id_fecha_programada_group', _response.fecha_programada)
         this.$id_evidencia.val(_response.evidencia)
      },
      error: function (_response) {

         alertify.error("Ocurrio error al cargar datos")
      }
   })
}

/*-----------------------------------------------*\
         OBJETO: popup acciones
\*-----------------------------------------------*/

function PopupAcciones () {

   popup_seguimiento_plan = new PopupSeguimientoPlan()
   popup_evaluacion_plan = new PopupEvaluacionPlan()
   this.$id = $('#id_tarjeta_acciones')
   this.$id_boton_seguimiento_plan = $('#id_boton_seguimiento_plan')
   this.$id_boton_evaluacion_eficacia = $('#id_boton_evaluacion_eficacia')
   this.$id_boton_eliminar = $('#id_boton_eliminar_actividad')
   this.init_Events()
}
PopupAcciones.prototype.init_Events = function () {

   this.$id_boton_evaluacion_eficacia.on("click", this, this.click_BotonEvaluacion)
   this.$id_boton_seguimiento_plan.on("click", this, this.click_BotonSeguimientoPlan )
   this.$id_boton_eliminar.on("click", this, this.click_BotonEliminar)
}
PopupAcciones.prototype.click_BotonSeguimientoPlan = function (e) {

   e.preventDefault()
   pk = e.data.$id.modal('hide').attr("data-primaryKey")
   popup_seguimiento_plan.mostrar(pk)
}
PopupAcciones.prototype.click_BotonEvaluacion = function (e) {

   e.preventDefault()
   pk = e.data.$id.modal('hide').attr("data-primaryKey")
   popup_evaluacion_plan.mostrar(pk)
}
PopupAcciones.prototype.click_BotonEliminar = function (e) {

   e.preventDefault()
   pk = e.data.$id.modal('hide').attr("data-primaryKey")
   tarjeta_plan_accion.grid.eliminar(pk)
}
PopupAcciones.prototype.mostrar = function ( _pk ) {

   this.$id.modal('show').attr("data-primaryKey", _pk)
}

/*-----------------------------------------------*\
         OBJETO: popup seguimiento plan
\*-----------------------------------------------*/

function PopupSeguimientoPlan () {

   this.$id = $('#id_tarjeta_seguimiento_plan')
   this.$id_resultado_seguimiento = $('#id_resultado_seguimiento')
   this.$id_fecha_seguimiento = $('#id_fecha_seguimiento_group')
   this.$id_archivo = $('#id_archivo_seguimiento_plan')
   this.$boton_guardar = $('#id_boton_guardar_seguimiento')
   this.$id_boton_nuevo = $('#id_boton_nuevo_seguimiento')
   this.$id_mensaje_error = $('#id_mensaje_error_serguimiento')
   this.$accion
   this.$id_contenedor = $('#id_contenedor_seguimientos')
   this.$pk_seguimiento // usado en el manejo de archivos
   this.$pk_actividad // Used for filter seguimientos
   this.init_Components()
   this.init_Events()
   // this.load_Data()
}
PopupSeguimientoPlan.prototype.init_Components = function () {

   this.$id_fecha_seguimiento.datepicker(appnova.get_ConfDatePicker())
   this.$id_archivo.fileinput(this.get_ConfigFileInput([], []))
}
PopupSeguimientoPlan.prototype.init_Events = function () {

   this.$id.on("shown.bs.modal", this, this.shown_Modal)
   this.$id.on("hidden.bs.modal", this, this.shown_Modal)
   this.$id_archivo.on("filebatchuploadcomplete", this, this.uploadcomplete_Filebatch)
   this.$id_archivo.on('filezoomhidden', this, this.hidden_FileZoom)
   this.$id_boton_nuevo.on("click", this, this.click_BotonNuevo)
   this.$boton_guardar.on("click", this, this.click_BotonGuardar)
   this.$id_contenedor.on("click", '[data-event=\'editar\']', this.click_EditarSeguimiento)
   this.$id_contenedor.on("click", '[data-event=\'eliminar\']', this.click_EliminarSeguimiento)
}
PopupSeguimientoPlan.prototype.get_ConfigFileInput = function (_show_delete, _initial_preview, _initial_preview_config ) {

   return {

          uploadUrl: url_archivo,
          ajaxSettings: {  headers: { "X-CSRFToken": appnova.galletita }  },
          ajaxDeleteSettings: {  method: "DELETE", headers: { "X-CSRFToken": appnova.galletita }  },
          allowedFileExtensions: ['jpg', 'jpeg', 'png', 'bmp', 'txt', 'pdf'],
          allowedPreviewMimeTypes: ['jpg', 'jpeg', 'png', 'bmp', 'txt', 'pdf'],
          uploadAsync: true,
          maxFileCount: 15,
          showRemove: false,
          showUpload: false,
          showClose: false,
          maxFileSize: 2048,
          initialPreviewShowDelete: _show_delete,
          showCaption: false,
          showBrowse: false,
          browseOnZoneClick: true,
          fileActionSettings: {
             showUpload: false,
          },
          uploadExtraData: function(previewId, index) {
             if (popup_seguimiento_plan.$id_archivo.fileinput('getFileStack').length > 0) {

                return {

                   archivo: popup_seguimiento_plan.$id_archivo.fileinput('getFileStack')[index],
                   tipo_archivo: "cal_segui",
                   content_object: url_seguimiento_plan + popup_seguimiento_plan.$pk_seguimiento + "/",
                   created_by: url_profile + tarjeta_detalle_hallazgo.$id_actual_user.val() + "/",
                }
             }
          },
          overwriteInitial: false,
          initialPreviewAsData: true,
          initialPreview: _initial_preview,
          initialPreviewConfig: _initial_preview_config,
          language:"es",
     }
}
PopupSeguimientoPlan.prototype.click_BotonNuevo = function (e) {

   e.preventDefault()
   popup_seguimiento_plan.$accion = "nuevo"
   popup_seguimiento_plan.clear_Formulario(e)
}
PopupSeguimientoPlan.prototype.click_EditarSeguimiento = function (e) {

   e.preventDefault()
   popup_seguimiento_plan.$accion = "editar"
   pk = this.getAttribute("data-id")
   popup_seguimiento_plan.$pk_seguimiento = pk
   popup_seguimiento_plan.set_Data(pk)
   // popup_analisis.mostrar( pk, "editar")
}
PopupSeguimientoPlan.prototype.click_EliminarSeguimiento = function (e) {

   e.preventDefault()
   pk = this.getAttribute("data-id")
   popup_seguimiento_plan.eliminar(pk)
}
PopupSeguimientoPlan.prototype.click_BotonGuardar = function (e) {

   e.preventDefault()
   e.data.guardar_Seguimiento(e)
}
PopupSeguimientoPlan.prototype.load_Data = function () {

   $.ajax({

      url: url_seguimiento_plan,
      method: "GET",
      context: this,
      data: {

         plan_accion_hallazgo_id: this.$pk_actividad,
      },
      success: function (_response) {

         this.refresh_Data(_response)
     },
     error: function (_response) {

        alertify.error("Ocurrio error al cargar datos")
     }
  })
}
PopupSeguimientoPlan.prototype.refresh_Data = function (_response) {

   this.$id_contenedor.text()
   var datos = ''

   if (_response.length) {

      if(tarjeta_detalle_hallazgo.$cerrado == "Si") {

         for (var i = 0; i < _response.length; i++) {

            var header = '<div class="panel panel-border-color panel-border-color-primary nova-modal-margin-contents">'
            if ( !i ) {
               header = '<div class="panel nova-modal-margin-contents">'
            }
            var archivos = ''

            for (var j = 0; j < _response[i].relacion_archivo.length; j++) {
               var archivo = _response[i].relacion_archivo[j]['archivo'].split('/')
               archivos += '<a href="' + _response[i].relacion_archivo[j]['archivo'] + '" target="_blank">' + archivo[archivo.length-1] + '</a>' + '<br/>'
            }
            datos +=  header +
                        '<div class="panel-heading panel-heading-default nova-border-bottom nova-overflow-hidden">' +
                           '<div class="pull-left nova-modal-title-seguimientos">' +
                              'Evaluador: <strong>' + _response[i].evaluador + '</strong>. <br/>Fecha Seguimiento: <strong>' + appnova.get_FechaDisplay(_response[i].fecha_seguimiento) + '</strong>' +
                           '</div>' +
                        '</div>' +
                        '<div class="panel-body">' +
                           '<div class="row">' +
                              '<div class="col-sm-12 nova-modal-informacion">' +
                                 '<textarea class="form-control" readonly="">' + _response[i].resultado_seguimiento+ '</textarea>' +
                              '</div>' +
                              '<div class="col-sm-12 nova-modal-informacion">' +
                                 archivos +
                              '</div>' +
                           '</div>' +
                        '</div>' +
                     '</div>'
         }
      }
      else {

         for (var i = 0; i < _response.length; i++) {

            var archivos = ''

            for (var j = 0; j < _response[i].relacion_archivo.length; j++) {
               var archivo = _response[i].relacion_archivo[j]['archivo'].split('/')
               archivos += '<a href="' + _response[i].relacion_archivo[j]['archivo'] + '" target="_blank">' + archivo[archivo.length-1] + '</a>' + '<br/>'
            }
            datos += '<div class="panel panel-border-color panel-border-color-primary nova-modal-margin-contents">' +
                        '<div class="panel-heading panel-heading-default nova-border-bottom nova-overflow-hidden">' +
                           '<div class="pull-left nova-modal-title-seguimientos">' +
                              'Evaluador: <strong>' + _response[i].evaluador + '</strong>. <br/>Fecha Seguimiento: <strong>' + appnova.get_FechaDisplay(_response[i].fecha_seguimiento) + '</strong>' +
                           '</div>' +
                           '<button type="button" class="btn btn-space btn-social nova-btn-delete pull-right" data-id="' + _response[i].pk + '" data-event="eliminar"><i class="icon mdi mdi-delete nova-white"></i></button>' +
                           '<button type="button" class="btn btn-space btn-social nova-btn-edit pull-right" data-id="' + _response[i].pk + '" data-event="editar"><i class="icon mdi mdi-edit nova-white"></i></button>' +
                        '</div>' +
                        '<div class="panel-body">' +
                           '<div class="row">' +
                              '<div class="col-sm-12 nova-modal-informacion">' +
                                 '<textarea class="form-control" readonly="">' + _response[i].resultado_seguimiento+ '</textarea>' +
                              '</div>' +
                              '<div class="col-sm-12 nova-modal-informacion">' +
                                 archivos +
                              '</div>' +
                           '</div>' +
                        '</div>' +
                     '</div>'
         }
      }
   }
   else {

      datos +=  '<div class="panel panel-border-color panel-border-color-primary nova-modal-margin-contents">' +
                   '<div class="panel-heading panel-heading-default nova-overflow-hidden">' +
                        '<h3 class="nova-aling-center nova-sin-resultados">Sin seguimientos</h3>'+
                   '</div>' +
                '</div>'
   }
   this.$id_contenedor.html(datos)
}
PopupSeguimientoPlan.prototype.eliminar = function (_pk) {

   alertify.confirm(

      'Eliminar Registro',
      '¿Desea Eliminar este registro?',
      function (e) {

         $.ajax({
            url: url_seguimiento_plan + _pk + '/',
            method: "DELETE",
            headers: { "X-CSRFToken": appnova.galletita },
            success: function () {
               popup_seguimiento_plan.load_Data()
               alertify.success("Se eliminó registro correctamente")
            },
            error: function () {

               alertify.error("Ocurrió un error al eliminar")
            }
         })
      },
      null
   )
}
PopupSeguimientoPlan.prototype.uploadcomplete_Filebatch = function (e, files) {

   e.data.load_Data()
   e.data.clear_Formulario(e)
}
PopupSeguimientoPlan.prototype.hidden_FileZoom = function (e) {

   $("body").addClass("modal-open")
   $("html").addClass("be-modal-open")
}
PopupSeguimientoPlan.prototype.guardar_Seguimiento = function (e) {

   if (e.data.$accion == "nuevo") {

      e.data.clear_Estilos(e)
      e.data.crear(e)
   }
   else if (e.data.$accion == "editar") {

      e.data.editar(e)
   }
}
PopupSeguimientoPlan.prototype.clear_Estilos = function (e) {

   e.data.$id_resultado_seguimiento.removeClass("nova-has-error")
   e.data.$id_fecha_seguimiento.removeClass("nova-has-error")
   e.data.$id_mensaje_error.html('')
}
PopupSeguimientoPlan.prototype.clear_Formulario = function (e) {

   e.data.$id_resultado_seguimiento.val("")
   e.data.$id_fecha_seguimiento.datepicker("clearDates")
   e.data.$id_archivo.fileinput('destroy')
   e.data.$id_archivo.fileinput(this.get_ConfigFileInput(true, [], [] ))
}
PopupSeguimientoPlan.prototype.validar = function () {

   var bandera = true

   if ( appnova.validar_EspaciosSaltos(this.$id_resultado_seguimiento.val()) == "" ) {

      this.$id_resultado_seguimiento.addClass("nova-has-error")
      bandera = false
   }
   if ( appnova.get_FechaConFormato("#id_fecha_seguimiento_group") == "" ) {

      this.$id_fecha_seguimiento.addClass("nova-has-error")
      bandera = false
   }

   if ( !bandera ) {

      this.$id_mensaje_error.html('Completa los campos marcados en rojo.')
   }

   return bandera
}
PopupSeguimientoPlan.prototype.crear = function (e) {

   if (e.data.validar()) {

      $.ajax({
         url: url_seguimiento_plan,
         method: "POST",
         headers: { "X-CSRFToken": appnova.galletita },
         data: {

            "resultado_seguimiento": e.data.$id_resultado_seguimiento.val(),
            "fecha_seguimiento": appnova.get_FechaConFormato("#id_fecha_seguimiento_group"),
            "plan_accion_hallazgo": url_plan_accion_hallazgo + e.data.$pk_actividad + "/",
            "create_by": url_profile + tarjeta_detalle_hallazgo.$id_actual_user.val() + "/",
         },
         success: function (_response) {

            if (e.data.$id_archivo.fileinput('getFileStack').length > 0) {

               e.data.$pk_seguimiento = _response.pk
               e.data.$id_archivo.fileinput('upload')
            }
            else {

               e.data.clear_Formulario(e)
               e.data.load_Data()
            }
         },
         error: function (_response) {
            alertify.error("Ocurrio error al insertar seguimiento")
         }
      })
   }
}
PopupSeguimientoPlan.prototype.editar = function (e) {

   if (e.data.validar()) {

      $.ajax({
         url: url_seguimiento_plan + e.data.$pk_seguimiento + "/",
         method: "PUT",
         headers: { "X-CSRFToken": appnova.galletita },
         data: {

            "resultado_seguimiento": e.data.$id_resultado_seguimiento.val(),
            "fecha_seguimiento": appnova.get_FechaConFormato("#id_fecha_seguimiento_group"),
            "plan_accion_hallazgo": url_plan_accion_hallazgo + e.data.$pk_actividad + "/",
            "update_by": url_profile + tarjeta_detalle_hallazgo.$id_actual_user.val() + "/",
         },
         success: function (_response) {

            if (e.data.$id_archivo.fileinput('getFileStack').length > 0) {

               e.data.$pk_seguimiento = _response.pk
               e.data.$id_archivo.fileinput('upload')
            }
            else {

               e.data.clear_Formulario(e)
               e.data.load_Data()
            }
         },
         error: function (_response) {

            alertify.error("Ocurrio error al editar seguimiento")
         }
      })
   }
}
PopupSeguimientoPlan.prototype.set_Data = function (_pk) {

   $.ajax({

      url: url_seguimiento_plan + _pk +"/",
      method: "GET",
      context: this,
      success: function (_response) {

         this.$id_resultado_seguimiento.val(_response.resultado_seguimiento)
         appnova.set_FechaConFormato('#id_fecha_seguimiento_group', _response.fecha_seguimiento)
         this.cargar_Archivos(_response)
      },
      error: function (_response) {

         alertify.error("Ocurrio error al cargar datos")
      }
   })
}
PopupSeguimientoPlan.prototype.cargar_Archivos = function (_response) {

   var initial_preview = []
   var initial_preview_config = []

   for (var i = 0; i < _response.relacion_archivo.length; i++) {

      initial_preview.push(_response.relacion_archivo[i]["archivo"])
      var url_archivo_response = _response.relacion_archivo[i]["archivo"].split('/')
      var nombre_archivo = url_archivo_response[url_archivo_response.length-1]
      var extension_archivo = nombre_archivo.split('.')
      var extension = extension_archivo[extension_archivo.length-1]

      if (extension == "pdf") {

         initial_preview_config.push(
            {  type: extension, caption: nombre_archivo, url: _response.relacion_archivo[i]["pk"] }
         )
      }
      else if (extension == "txt" || extension == "docx") {

         initial_preview_config.push(
            {  type: "text", caption: nombre_archivo, url: _response.relacion_archivo[i]["pk"] }
         )
      }
      else if (extension == "jpg" || extension == "jpeg" || extension == "png" || extension == "bmp") {

         initial_preview_config.push(
            {  caption: nombre_archivo, url: _response.relacion_archivo[i]["pk"] }
         )
      }
   }
   this.$id_archivo.fileinput('destroy')
   this.$id_archivo.fileinput(this.get_ConfigFileInput(true, initial_preview, initial_preview_config))
}
PopupSeguimientoPlan.prototype.hidden_Modal = function (e) {

   e.data.clear_Estilos(e)
   e.data.clear_Formulario(e)
}
PopupSeguimientoPlan.prototype.shown_Modal = function (e) {

   $("body").addClass("modal-open")
   $("html").addClass("be-modal-open")
}
PopupSeguimientoPlan.prototype.mostrar = function ( _pk ) {

   this.$pk_actividad = _pk
   this.$id.modal('show').attr("data-primaryKey", _pk)
   this.$accion = "nuevo"
   this.load_Data()
}

/*-----------------------------------------------*\
         OBJETO: popup evaluacion plan
\*-----------------------------------------------*/

// function PopupEvaluacionPlan () {
//
//    this.$id = $('#id_tarjeta_evaluacion')
//    this.$id_resultado = $('#id_resultado_plan_eval')
//    this.$id_resultado_evaluacion = $('#id_resultado_evaluacion_plan_eval')
//    this.$id_fecha_evaluacion = $('#id_fecha_evaluacion_plan_eval')
//    this.$id_fecha_evaluacion_group = $('#id_fecha_evaluacion_group')
//    this.$id_criterio_decision = $('#id_criterio_decision_plan_eval')
//    this.$id_archivo = $('#id_archivo_plan_eval')
//    this.init_Components()
//    this.init_Events()
// }
// PopupEvaluacionPlan.prototype.init_Components = function () {
//
//    this.$id_fecha_evaluacion_group.datepicker(appnova.get_ConfDatePicker())
//    this.$id_archivo.fileinput(this.get_ConfigFileInput())
// }
function PopupEvaluacionPlan () {

   this.$id = $('#id_tarjeta_evaluacion')
   this.$id_mensaje_error = $('#id_mensaje_error_evaluacion')
   this.$id_resultado = $('#id_resultado_plan_eval')
   this.$id_resultado_evaluacion = $('#id_resultado_evaluacion_plan_eval')
   this.$id_fecha_evaluacion = $('#id_fecha_evaluacion_group')
   this.$id_criterio_decision = $('#id_criterio_decision_plan_eval')
   this.$id_observacion_evaluacion = $('#id_observaciones_plan_eval')
   this.$id_archivo = $('#id_archivo_plan_eval')
   this.$id_boton_guardar = $('#id_boton_guardar_evaluacion')
   // this.$accion =
   this.$pk_actividad
   this.$ocultar = false
   this.init_Components()
   this.init_Events()

}
PopupEvaluacionPlan.prototype.init_Components = function () {

   this.$id_fecha_evaluacion.datepicker(appnova.get_ConfDatePicker())
   this.$id_archivo.fileinput(this.get_ConfigFileInput(true, false, [], []))
}
PopupEvaluacionPlan.prototype.init_Events = function () {

   this.$id_boton_guardar.on("click", this, this.click_BotonGuardar)
   this.$id_archivo.on("filebatchuploadcomplete", this, this.uploadcomplete_Filebatch)
   this.$id_archivo.on('filezoomhidden', this, this.hidden_FileZoom)
   this.$id.on("hidden.bs.modal", this, this.hidden_Modal)
   this.$id.on("shown.bs.modal", this, this.shown_Modal)
}
PopupEvaluacionPlan.prototype.get_ConfigFileInput = function (_show_delete, _show_upload_button, _initial_preview, _initial_preview_config ) {

   return {

          uploadUrl: url_archivo,
          ajaxSettings: {  headers: { "X-CSRFToken": appnova.galletita }  },
          ajaxDeleteSettings: {  method: "DELETE", headers: { "X-CSRFToken": appnova.galletita }  },
          allowedFileExtensions: ['jpg', 'jpeg', 'png', 'bmp', 'txt', 'pdf'],
          allowedPreviewMimeTypes: ['jpg', 'jpeg', 'png', 'bmp', 'txt', 'pdf'],
          uploadAsync: true,
          maxFileCount: 15,
          showRemove: false,
          showClose: false,
          maxFileSize: 2048,
          showUpload: _show_upload_button,
          initialPreviewShowDelete: _show_delete,
          showCaption: false,
          showBrowse: false,
          browseOnZoneClick: true,
          fileActionSettings: {
             showUpload: false,
          },
          uploadExtraData: function(previewId, index) {
             if (popup_evaluacion_plan.$id_archivo.fileinput('getFileStack').length > 0) {

                return {

                   archivo: popup_evaluacion_plan.$id_archivo.fileinput('getFileStack')[index],
                   tipo_archivo: "cal_eval",
                   content_object: url_plan_accion_hallazgo + popup_evaluacion_plan.$pk_actividad + "/",
                   created_by: url_profile + tarjeta_detalle_hallazgo.$id_actual_user.val() + "/",
                }
             }
          },
          overwriteInitial: false,
          initialPreviewAsData: true,
          initialPreview: _initial_preview,
          initialPreviewConfig: _initial_preview_config,
          language:"es",
     }
}
PopupEvaluacionPlan.prototype.click_BotonGuardar = function (e) {

   e.data.$ocultar = true
   e.data.guardar_Evaluacion(e)
}
PopupEvaluacionPlan.prototype.uploadcomplete_Filebatch = function (e, files) {

   if(e.data.$ocultar) {

      e.data.$id.modal('hide')
      tarjeta_plan_accion.grid.load_Data()
      e.data.$ocultar = false
   }
}
PopupEvaluacionPlan.prototype.hidden_FileZoom = function (e) {

   $("body").addClass("modal-open")
   $("html").addClass("be-modal-open")
}
PopupEvaluacionPlan.prototype.hidden_Modal = function (e) {

   e.data.clear_Estilos(e)
   e.data.clear_Formulario(e)
}
PopupEvaluacionPlan.prototype.shown_Modal = function (e) {

   $("body").addClass("modal-open")
   $("html").addClass("be-modal-open")
}
PopupEvaluacionPlan.prototype.guardar_Evaluacion = function (e) {

   // if (e.data.$accion == "nuevo") {
   //
   //    e.data.clear_Estilos(e)
   //    e.data.crear(e)
   // }
   // else if (e.data.$accion == "editar") {

   pk = e.data.$id.attr("data-primaryKey")
   e.data.get_Data(pk)
   // }
}
PopupEvaluacionPlan.prototype.clear_Estilos = function (e) {

   e.data.$id_mensaje_error.html('')
   e.data.$id_resultado.removeClass("nova-has-error")
   e.data.$id_resultado_evaluacion.removeClass("nova-has-error")
   e.data.$id_fecha_evaluacion.removeClass("nova-has-error")
   e.data.$id_criterio_decision.removeClass("nova-has-error")
   e.data.$id_observacion_evaluacion.removeClass("nova-has-error")
}
PopupEvaluacionPlan.prototype.clear_Formulario = function (e) {

   e.data.$id_resultado.val("")
   e.data.$id_resultado_evaluacion.val("")
   e.data.$id_fecha_evaluacion.val("")
   e.data.$id_criterio_decision.val("")
   e.data.$id_observacion_evaluacion.val("")
   e.data.$id_archivo.fileinput('destroy')
   e.data.$id_archivo.fileinput(this.get_ConfigFileInput(true, false, [], [] ))
}
PopupEvaluacionPlan.prototype.mostrar = function (_pk) {

   this.$id.modal('show').attr("data-primaryKey", _pk)
   // this.$accion = _accion
   this.set_Data(_pk)
   this.$pk_actividad = _pk
}
PopupEvaluacionPlan.prototype.validar = function () {

   var bandera = true

   if ( this.$id_resultado.val() == "undefined" ) {

      this.$id_resultado.addClass("nova-has-error")
      bandera = false
   }
   if ( appnova.validar_EspaciosSaltos(this.$id_resultado_evaluacion.val()) == "" ) {

      this.$id_resultado_evaluacion.addClass("nova-has-error")
      bandera = false
   }
   if ( appnova.get_FechaConFormato("#id_fecha_evaluacion_group") == "" ) {

      this.$id_fecha_evaluacion.addClass("nova-has-error")
      bandera = false
   }
   if ( appnova.validar_EspaciosSaltos(this.$id_criterio_decision.val()) == "" ) {

      this.$id_criterio_decision.addClass("nova-has-error")
      bandera = false
   }
   if ( appnova.validar_EspaciosSaltos(this.$id_resultado_evaluacion.val()) == "" ) {

      this.$id_resultado_evaluacion.addClass("nova-has-error")
      bandera = false
   }
   if ( appnova.validar_EspaciosSaltos(this.$id_observacion_evaluacion.val()) == "" ) {

      this.$id_resultado_evaluacion.addClass("nova-has-error")
      bandera = false
   }

   if ( !bandera ){

      this.$id_mensaje_error.html('Completa los campos marcados en rojo.')
   }

   return bandera
}
PopupEvaluacionPlan.prototype.editar = function (_pk, _response) {

   if (this.validar()) {

      $.ajax({
         url: url_plan_accion_hallazgo + _pk + "/",
         method: "PUT",
         headers: { "X-CSRFToken": appnova.galletita },
         data: {

            "titulo": _response.titulo,
            "actividad": _response.actividad,
            "responsable": _response.responsable,
            "fecha_programada": _response.fecha_programada,
            "evidencia": _response.evidencia,
            "resultado": $("input[name='resultado']:checked").val(),
            "resultado_evaluacion": this.$id_resultado_evaluacion.val(),
            "fecha_evaluacion": appnova.get_FechaConFormato("#id_fecha_evaluacion_group"),
            "criterio_decision": this.$id_criterio_decision.val(),
            "observacion": this.$id_observacion_evaluacion.val(),
            "hallazgo": url_hallazgo_proceso + tarjeta_detalle_hallazgo.$id_pk_hal.val() + "/",
            "update_by": url_profile + tarjeta_detalle_hallazgo.$id_actual_user.val() + "/",
         },
         success: function (_response) {

            if (popup_evaluacion_plan.$id_archivo.fileinput('getFileStack').length > 0) {

               popup_evaluacion_plan.$pk_actividad = _response.pk
               popup_evaluacion_plan.$id_archivo.fileinput('upload')
            }
            else {

               popup_evaluacion_plan.$id.modal('hide')
               tarjeta_plan_accion.grid.load_Data()
               popup_evaluacion_plan.$ocultar = false
            }
         },
         error: function (_response) {

            alertify.error("Ocurrio error al editar actividad")
         }
      })
   }
}
PopupEvaluacionPlan.prototype.get_Data = function (_pk) {

   $.ajax({

      url: url_plan_accion_hallazgo + _pk +"/",
      method: "GET",
      context: this,
      success: function (_response) {

         this.editar(_pk, _response)
      },
      error: function (_response) {

         alertify.error("Ocurrio error al cargar datos")
      }
   })
}
PopupEvaluacionPlan.prototype.set_Data = function (_pk) {

   $.ajax({

      url: url_plan_accion_hallazgo + _pk +"/",
      method: "GET",
      context: this,
      success: function (_response) {

         // this.$id_resultado.prop('checked', _response.resultado)
         this.set_ValResultado(_response.resultado)
         this.$id_resultado_evaluacion.val(_response.resultado_evaluacion)
         appnova.set_FechaConFormato('#id_fecha_evaluacion_group', _response.fecha_evaluacion)
         this.$id_criterio_decision.val(_response.criterio_decision)
         this.$id_observacion_evaluacion.val(_response.observacion)
         this.cargar_Archivos(_response)
      },
      error: function (_response) {

         alertify.error("Ocurrio error al cargar datos")
      }
   })
}
PopupEvaluacionPlan.prototype.cargar_Archivos = function (_response) {

   var initial_preview = []
   var initial_preview_config = []

   for (var i = 0; i < _response.relacion_archivo.length; i++) {

      initial_preview.push(_response.relacion_archivo[i]["archivo"])
      var url_archivo_response = _response.relacion_archivo[i]["archivo"].split('/')
      var nombre_archivo = url_archivo_response[url_archivo_response.length-1]
      var extension_archivo = nombre_archivo.split('.')
      var extension = extension_archivo[extension_archivo.length-1]

      if (extension == "pdf") {

         initial_preview_config.push(
            {  type: extension, caption: nombre_archivo, url: _response.relacion_archivo[i]["pk"] }
         )
      }
      else if (extension == "txt" || extension == "docx") {

         initial_preview_config.push(
            {  type: "text", caption: nombre_archivo, url: _response.relacion_archivo[i]["pk"] }
         )
      }
      else if (extension == "jpg" || extension == "jpeg" || extension == "png" || extension == "bmp") {

         initial_preview_config.push(
            {  caption: nombre_archivo, url: _response.relacion_archivo[i]["pk"] }
         )
      }
   }
   this.$id_archivo.fileinput('destroy')
   if (tarjeta_detalle_hallazgo.$cerrado == "Si") {
      this.$id_archivo.fileinput(this.get_ConfigFileInput(false, false, initial_preview, initial_preview_config))
   }
   else {
      this.$id_archivo.fileinput(this.get_ConfigFileInput(true, true, initial_preview, initial_preview_config))
   }
}
PopupEvaluacionPlan.prototype.set_ValResultado = function (_resultado) {

   if(_resultado != "") {

         $("input[name='resultado'][value='"+_resultado+"']").prop("checked", "true")
   }
}

// function PopupEvaluacionPlan () {
//
//    this.$id = $('#id_tarjeta_evaluacion')
//    this.$id_resultado = $('#id_resultado_plan_eval')
//    this.$id_resultado_evaluacion = $('#id_resultado_evaluacion_plan_eval')
//    this.$id_fecha_evaluacion = $('#id_fecha_evaluacion_plan_eval')
//    this.$id_fecha_evaluacion_group = $('#id_fecha_evaluacion_group')
//    this.$id_criterio_decision = $('#id_criterio_decision_plan_eval')
//    this.$id_archivo = $('#id_archivo_plan_eval')
//    this.init_Components()
//    this.init_Events()
// }
// PopupEvaluacionPlan.prototype.init_Components = function () {
//
//    this.$id_fecha_evaluacion_group.datepicker(appnova.get_ConfDatePicker())
//    this.$id_archivo.fileinput(this.get_ConfigFileInput())
// }
// PopupEvaluacionPlan.prototype.init_Events = function () {
//
//    this.$id.on("shown.bs.modal", this, this.shown_Modal)
// }
// PopupEvaluacionPlan.prototype.shown_Modal = function (e) {
//
//    $("body").addClass("modal-open")
//    $("html").addClass("be-modal-open")
// }
// PopupEvaluacionPlan.prototype.mostrar = function ( _pk ) {
//
//    this.$id.modal('show').attr("data-primaryKey", _pk)
// }
// PopupEvaluacionPlan.prototype.get_ConfigFileInput = function () {
//
//    return {
//
//           uploadUrl: "una/url/donde/se/subira/",
//           uploadAsync: false,
//           minFileCount: 2,
//           maxFileCount: 5,
//           overwriteInitial: false,
//           language:"es",
//           initialPreview: [
//              "/static/images/referenciavisual/documento.jpg",
//              "/static/images/referenciavisual/1.jpg",
//              "/static/images/referenciavisual/2.jpg",
//              "/static/images/referenciavisual/3.jpg",
//           ],
//           initialPreviewAsData: true,
//           initialPreviewFileType: 'image',
//           initialPreviewConfig: [
//             {  caption: "Documento.jpg", size: 827000, url: "/file-upload-batch/2", key: 1  },
//             {  caption: "1.jpg", size: 827000, url: "/file-upload-batch/2", key: 2  },
//             {  caption: "2.jpg", size: 827000, url: "/file-upload-batch/2", key: 3  },
//             {  caption: "3.jpg", size: 827000, url: "/file-upload-batch/2", key: 4  },
//           ],
//           purifyHtml: true,
//      }
// }

/*-----------------------------------------------*\
            OBJETO: popup editarA
\*-----------------------------------------------*/

// function PopupEditarA() {
//
//     this.$id_evidencia = $('#id_evidencia')
//     this.$id_plan_observaciones = $('#id_plan_observaciones')
//     this.init_Components()
// }
// PopupEditarA.prototype.init_Components = function () {
//
// }

/*-----------------------------------------------*\
         OBJETO: Tarjeta Evidencia
\*-----------------------------------------------*/

function TarjetaEvidencia() {

   this.toolbar = new ToolBarEvidencia()
   this.grid = new GridEvidencia()
}

/*-----------------------------------------------*\
         OBJETO: ToolBar Evidencia
\*-----------------------------------------------*/

function ToolBarEvidencia() {

   popup_evidencia = new PopupEvidencia()
   this.$boton_nuevo = $('#id_boton_evidencia')
   this.init_Events()
}
ToolBarEvidencia.prototype.init_Events = function () {

   this.$boton_nuevo.on("click", this, this.click_BotonNuevo)
}
ToolBarEvidencia.prototype.click_BotonNuevo = function (e) {

   popup_evidencia.mostrar( 0, "nuevo" )
}

/*-----------------------------------------------*\
         OBJETO: Grid Evidencia
\*-----------------------------------------------*/

function GridEvidencia() {

   this.$id = $('#id_grid_evidencia')
   this.$id_tbody = $('#id_tbody_evidencia')
   this.init_Events()
   this.load_Data()
}
GridEvidencia.prototype.init_Events = function () {

   this.$id.on("click", '.clickable-row', this.click_FilaGrid)
   this.$id.on("click", '[data-event=\'editarEvidencia\']', this.click_EditarEvidencia)
   this.$id.on("click", '[data-event=\'eliminarEvidencia\']', this.click_EliminarEvidencia)
}
GridEvidencia.prototype.click_FilaGrid = function () {

   $(this).addClass('nova-active-row').siblings().removeClass('nova-active-row')
}
GridEvidencia.prototype.click_EditarEvidencia = function (e) {

   e.preventDefault()
   pk = this.getAttribute("data-id")
   popup_evidencia.mostrar( pk, "editar")
}
GridEvidencia.prototype.click_EliminarEvidencia = function (e) {

   e.preventDefault()
   pk = this.getAttribute("data-id")
   tarjeta_evidencia.grid.eliminar(pk)
}
GridEvidencia.prototype.load_Data = function () {

   $.ajax({

      url: url_evidencia_hallazgo,
      method: "GET",
      context: this,
      data: {

         hallazgo_id: tarjeta_detalle_hallazgo.$id_pk_hal.val(),
      },
      success: function (_response) {

         this.refresh_Data(_response)
     },
     error: function (_response) {

        alertify.error("Ocurrio error al cargar datos")
     }
  })
}
GridEvidencia.prototype.refresh_Data = function (_response) {

   this.$id_tbody.text()
   var datos = ''
   if (_response.length) {

      if (tarjeta_detalle_hallazgo.$cerrado == "Si") {
         for (var i = 0; i < _response.length; i++) {

             datos += '<tr class="clickable-row">'+
                         '<td>' +
                            '<a href="#id_tarjeta_evidencia" class="btn btn-default nova-url" data-event="editarEvidencia" data-id="'+ _response[i].pk +'">' + _response[i].titulo + '</a>' +
                         '</td>' +
                         '<td>' +  _response[i].observacion + '</td>' +
                      '</tr>'
         }
      }
      else {
         for (var i = 0; i < _response.length; i++) {

             datos += '<tr class="clickable-row">'+
                         '<td>' +
                            '<button class="btn nova-btn nova-btn-delete" data-id="' + _response[i].pk + '" data-event="eliminarEvidencia">' +
                               '<i class="icon icon-left icon mdi mdi-delete nova-white"></i>' +
                            '</button>' +
                         '</td>' +
                         '<td>' +
                            '<a href="#id_tarjeta_evidencia" class="btn btn-default nova-url" data-event="editarEvidencia" data-id="'+ _response[i].pk +'">' + _response[i].titulo + '</a>' +
                         '</td>' +
                         '<td>' +  _response[i].observacion + '</td>' +
                      '</tr>'
         }
      }
   }
   else {

      datos +=  '<tr class="clickable-row">' +
                   '<td colspan="3" class="nova-aling-center nova-sin-resultados">No se encontraron resultados.</td>' +
                '</tr>'
   }
   this.$id_tbody.html(datos)
}
GridEvidencia.prototype.eliminar = function (_pk) {

   alertify.confirm(

      'Eliminar Registro',
      '¿Desea Eliminar este registro?',
      function (e) {

         $.ajax({
            url: url_evidencia_hallazgo + _pk + '/',
            method: "DELETE",
            headers: { "X-CSRFToken": appnova.galletita },
            success: function () {
               tarjeta_evidencia.grid.load_Data()
               alertify.success("Se eliminó registro correctamente")
            },
            error: function () {

               alertify.error("Ocurrió un error al eliminar")
            }
         })
      },
      null
   )
}

/*-----------------------------------------------*\
         OBJETO: popup evidencia
\*-----------------------------------------------*/

function PopupEvidencia () {

   this.$id = $('#id_tarjeta_evidencia')
   this.$id_mensaje_error = $('#id_mensaje_error_evidencia')
   this.$id_popup_titulo = $('#id_popup_titulo_evidencia')

   this.$id_titulo = $('#id_titulo_evidencia')
   this.$id_observacion = $('#id_observacion_evidencia')
   this.$id_archivo = $('#id_archivo_evidencia')

   this.$id_boton_guardar = $('#id_boton_guardar_evidencia')
   this.$accion
   this.$pk_evidencia
   this.$ocultar = false
   this.init_Components()
   this.init_Events()
}
PopupEvidencia.prototype.init_Components = function () {

   this.$id_archivo.fileinput(this.get_ConfigFileInput(true, false, [], []))
}
PopupEvidencia.prototype.init_Events = function () {

   this.$id_boton_guardar.on("click", this, this.click_BotonGuardar)
   this.$id_archivo.on("filebatchuploadcomplete", this, this.uploadcomplete_Filebatch)
   this.$id_archivo.on('filezoomhidden', this, this.hidden_FileZoom)
   this.$id.on("hidden.bs.modal", this, this.hidden_Modal)
}
PopupEvidencia.prototype.get_ConfigFileInput = function (_show_delete, _show_upload_button, _initial_preview, _initial_preview_config ) {

   return {

          uploadUrl: url_archivo,
          ajaxSettings: {  headers: { "X-CSRFToken": appnova.galletita }  },
          ajaxDeleteSettings: {  method: "DELETE", headers: { "X-CSRFToken": appnova.galletita }  },
          allowedFileExtensions: ['jpg', 'jpeg', 'png', 'bmp', 'txt', 'pdf'],
          allowedPreviewMimeTypes: ['jpg', 'jpeg', 'png', 'bmp', 'txt', 'pdf'],
          uploadAsync: true,
          maxFileCount: 15,
          showRemove: false,
          showClose: false,
          maxFileSize: 2048,
          showUpload: _show_upload_button,
          initialPreviewShowDelete: _show_delete,
          showCaption: false,
          showBrowse: false,
          browseOnZoneClick: true,
          fileActionSettings: {
             showUpload: false,
          },
          uploadExtraData: function(previewId, index) {
             if (popup_evidencia.$id_archivo.fileinput('getFileStack').length > 0) {

                return {

                   archivo: popup_evidencia.$id_archivo.fileinput('getFileStack')[index],
                   tipo_archivo: "cal_evid",
                   content_object: url_evidencia_hallazgo + popup_evidencia.$pk_evidencia + "/",
                   created_by: url_profile + tarjeta_detalle_hallazgo.$id_actual_user.val() + "/",
                }
             }
          },
          overwriteInitial: false,
          initialPreviewAsData: true,
          initialPreview: _initial_preview,
          initialPreviewConfig: _initial_preview_config,
          language:"es",
     }
}
PopupEvidencia.prototype.click_BotonGuardar = function (e) {

   e.data.$ocultar = true
   e.data.guardar_Evidencia(e)
}
PopupEvidencia.prototype.uploadcomplete_Filebatch = function (e, files) {

   if(e.data.$ocultar) {

      e.data.$id.modal('hide')
      tarjeta_evidencia.grid.load_Data()
      e.data.$ocultar = false
   }
}
PopupEvidencia.prototype.hidden_FileZoom = function (e) {

   $("body").addClass("modal-open")
   $("html").addClass("be-modal-open")
}
PopupEvidencia.prototype.hidden_Modal = function (e) {

   e.data.clear_Estilos(e)
   e.data.clear_Formulario(e)
}
PopupEvidencia.prototype.guardar_Evidencia = function (e) {

   if (e.data.$accion == "nuevo") {

      e.data.clear_Estilos(e)
      e.data.crear(e)
   }
   else if (e.data.$accion == "editar") {

      pk = e.data.$id.attr("data-primaryKey")
      e.data.editar(e, pk)
   }
}
PopupEvidencia.prototype.clear_Estilos = function (e) {

   e.data.$id_titulo.removeClass("nova-has-error")
   e.data.$id_observacion.removeClass("nova-has-error")
   e.data.$id_mensaje_error.html('')
}
PopupEvidencia.prototype.clear_Formulario = function (e) {

   e.data.$id_titulo.val("")
   e.data.$id_observacion.val("")
   e.data.$id_archivo.fileinput('destroy')
   e.data.$id_archivo.fileinput(this.get_ConfigFileInput(true, false, [], [] ))
}
PopupEvidencia.prototype.mostrar = function (_pk, _accion) {

   this.$id.modal('show').attr("data-primaryKey", _pk)
   this.$accion = _accion

   if (_accion == "nuevo") {

      this.$id_popup_titulo.text('Nueva Evidencia')
   }
   else if (_accion == "editar") {

      this.$id_popup_titulo.text('Editar Evidencia')
      this.set_Data(_pk)
      this.$pk_evidencia = _pk
   }
}
PopupEvidencia.prototype.validar = function () {

   var bandera = true

   if ( appnova.validar_EspaciosSaltos(this.$id_titulo.val()) == "" ) {

      this.$id_titulo.addClass("nova-has-error")
      bandera = false
   }
   if ( appnova.validar_EspaciosSaltos(this.$id_observacion.val()) == "" ) {

      this.$id_observacion.addClass("nova-has-error")
      bandera = false
   }

   if ( !bandera ){

      this.$id_mensaje_error.html('Completa los campos marcados en rojo.')
   }

   return bandera
}
PopupEvidencia.prototype.crear = function (e) {

   if (e.data.validar()) {

      $.ajax({
         url: url_evidencia_hallazgo,
         method: "POST",
         headers: { "X-CSRFToken": appnova.galletita },
         data: {

            "titulo": e.data.$id_titulo.val(),
            "observacion": e.data.$id_observacion.val(),
            "hallazgo": url_hallazgo_proceso + tarjeta_detalle_hallazgo.$id_pk_hal.val() + "/",
            "create_by": url_profile + tarjeta_detalle_hallazgo.$id_actual_user.val() + "/",
         },
         success: function (_response) {

            if (e.data.$id_archivo.fileinput('getFileStack').length > 0) {

               e.data.$pk_evidencia = _response.pk
               e.data.$id_archivo.fileinput('upload')
            }
            else {
               e.data.$id.modal('hide')
               tarjeta_evidencia.grid.load_Data()
               e.data.$ocultar = false
            }
         },
         error: function (_response) {

            alertify.error("Ocurrio error al insertar evidencia")
         }
      })
   }
}
PopupEvidencia.prototype.editar = function (e, _pk) {

   if (e.data.validar()) {

      $.ajax({
         url: url_evidencia_hallazgo + _pk + "/",
         method: "PUT",
         headers: { "X-CSRFToken": appnova.galletita },
         data: {

            "titulo": e.data.$id_titulo.val(),
            "observacion": e.data.$id_observacion.val(),
            "hallazgo": url_hallazgo_proceso + tarjeta_detalle_hallazgo.$id_pk_hal.val() + "/",
            "update_by": url_profile + tarjeta_detalle_hallazgo.$id_actual_user.val() + "/",
         },
         success: function (_response) {

            if (e.data.$id_archivo.fileinput('getFileStack').length > 0) {

               e.data.$pk_evidencia = _response.pk
               e.data.$id_archivo.fileinput('upload')
            }
            else {

               e.data.$id.modal('hide')
               tarjeta_evidencia.grid.load_Data()
               e.data.$ocultar = false
            }
         },
         error: function (_response) {

            alertify.error("Ocurrio error al editar evidencia")
         }
      })
   }
}
PopupEvidencia.prototype.set_Data = function (_pk) {

   $.ajax({

      url: url_evidencia_hallazgo + _pk +"/",
      method: "GET",
      context: this,
      success: function (_response) {

         this.$id_titulo.val(_response.titulo)
         this.$id_observacion.val(_response.observacion)
         this.cargar_Archivos(_response)
      },
      error: function (_response) {

         alertify.error("Ocurrio error al cargar datos")
      }
   })
}
PopupEvidencia.prototype.cargar_Archivos = function (_response) {

   var initial_preview = []
   var initial_preview_config = []

   for (var i = 0; i < _response.relacion_archivo.length; i++) {

      initial_preview.push(_response.relacion_archivo[i]["archivo"])
      var url_archivo_response = _response.relacion_archivo[i]["archivo"].split('/')
      var nombre_archivo = url_archivo_response[url_archivo_response.length-1]
      var extension_archivo = nombre_archivo.split('.')
      var extension = extension_archivo[extension_archivo.length-1]

      if (extension == "pdf") {

         initial_preview_config.push(
            {  type: extension, caption: nombre_archivo, url: _response.relacion_archivo[i]["pk"] }
         )
      }
      else if (extension == "txt" || extension == "docx") {

         initial_preview_config.push(
            {  type: "text", caption: nombre_archivo, url: _response.relacion_archivo[i]["pk"] }
         )
      }
      else if (extension == "jpg" || extension == "jpeg" || extension == "png" || extension == "bmp") {

         initial_preview_config.push(
            {  caption: nombre_archivo, url: _response.relacion_archivo[i]["pk"] }
         )
      }
   }
   this.$id_archivo.fileinput('destroy')
   if (tarjeta_detalle_hallazgo.$cerrado == "Si") {
      this.$id_archivo.fileinput(this.get_ConfigFileInput(false, false, initial_preview, initial_preview_config))
   }
   else {
      this.$id_archivo.fileinput(this.get_ConfigFileInput(true, true, initial_preview, initial_preview_config))
   }
}
