'use strict';
angular.module('app').constant('OnpeCargaConst',{
    PE_TYPE_CARGA_ODPE:1, //ODPE 
    PE_TYPE_CARGA_LOCAL:2, //LOCALES
    PE_TYPE_CARGA_PAGINA:3, //PAGINA INSTITUCIONAL
    PE_TYPE_CARGA_CONADIS:4, //CONADIS
    
    PE_TYPE_CARGA_PADRON:5, //PADRON ELECTORAL
    PE_TYPE_CARGA_ETLV:6, //ETLV
    PE_TYPE_CARGA_SIGE:7, //SIGE
    PE_TYPE_CARGA_RAE:8, //RAE   
    
    PE_TYPE_CARGA_SECCION:9, //SECCION_ELECTOR 
    PE_TYPE_CARGA_PREF:10, //PREFERENCIALES 
    
    PE_COLOR_EMPTY:'cardStnadbyEstado',
    PE_COLOR_OBS:'cardObservadoEstado',
    PE_COLOR_SUCCES:'cardOkEstado',
    PE_COLOR_ERROR:'cardErrorEstado',
    PE_COLOR_DISABLE:'cargaDBaseDatosInactivo',    
    
    PE_MSG_LONGFILE:'El archivo seleccionado tiene un nombre muy extenso, modifíquelo y vuelva a intentar.',
    PE_MSG_EXTENSIONFILE: 'El archivo seleccionado tiene una extensión no válida.',
    PE_MSG_FILEERROR:'El archivo cargado tiene una estructura desconocida.'
});

angular.module('app').controller('cargaController', ['$scope','CargaService', 'OnpeCargaConst', '$mdDialog', function ($scope, CargaService, OnpeCargaConst, $mdDialog) {
    
    var self = this;         
    
    self.typeCarga_Padron = OnpeCargaConst.PE_TYPE_CARGA_PADRON;
    self.typeCarga_Odpe = OnpeCargaConst.PE_TYPE_CARGA_ODPE;
    self.typeCarga_Local = OnpeCargaConst.PE_TYPE_CARGA_LOCAL;
    self.typeCarga_Etlv = OnpeCargaConst.PE_TYPE_CARGA_ETLV;
    self.typeCarga_Sige = OnpeCargaConst.PE_TYPE_CARGA_SIGE;
    self.typeCarga_Rae = OnpeCargaConst.PE_TYPE_CARGA_RAE;
    self.typeCarga_Pagina = OnpeCargaConst.PE_TYPE_CARGA_PAGINA;
    self.typeCarga_Conadis = OnpeCargaConst.PE_TYPE_CARGA_CONADIS;      
    self.typeCarga_Seccion = OnpeCargaConst.PE_TYPE_CARGA_SECCION; 
    self.typeCarga_Pref = OnpeCargaConst.PE_TYPE_CARGA_PREF; 
    
    self.descargarDetalleFormato = descargarDetalleFormato;
    self.descargarDetalle = descargarDetalle;
    self.descargarPlantilla = descargarPlantilla;
    self.onChangeSwitch = onChangeSwitch;
    self.updateProcess = updateProcess;    
    self.procesar = procesar;
    self.next = next;
    self.getEstado = getEstado;              
        
    //Para Archivos    
    self.cargandoFormatoCargaOdpe = false;
    self.errorFormatoCargaOdpe = false;
    self.errorSystemCargaOdpe = false;
    self.errorNombreFormatoCargaOdpe = false;
    self.errorExtensionCargaOdpe = false;
    
    self.cargandoFormatoCargaLocal = false;
    self.errorFormatoCargaLocal = false;
    self.errorSystemCargaLocal = false;
    self.errorNombreFormatoCargaLocal = false;
    self.errorExtensionCargaLocal = false;
    
    self.cargandoFormatoCargaPagina = false;
    self.errorFormatoCargaPagina = false;
    self.errorSystemCargaPagina = false;
    self.errorNombreFormatoCargaPagina = false;
    self.errorExtensionCargaPagina = false;
    
    self.cargandoFormatoCargaConadis = false;
    self.errorFormatoCargaConadis = false;
    self.errorSystemCargaConadis = false;
    self.errorNombreFormatoCargaConadis = false;
    self.errorExtensionCargaConadis = false;
    
    //Para procesos
    self.cargandoFormatoCargaPadron = false;    
    self.cargandoFormatoCargaEtlv = false;
    self.cargandoFormatoCargaSige = false;
    self.cargandoFormatoCargaRae = false;
    self.cargandoFormatoCargaPref = false;
        
    self.cargaOdpe = {
        id: 0,
        jsonExcel: [],
        observacionGeneral: '',
        observacionDetalle: '',
        nombreArchivo: '',
        archivoExcel: []                                
    };
    
    self.cargaLocal = {
        id: 0,
        jsonExcel: [],
        observacionGeneral: '',
        observacionDetalle: '',
        nombreArchivo: '',
        archivoExcel: []                                
    };
    
    self.cargaPagina = {
        id: 0,
        jsonExcel: [],
        observacionGeneral: '',
        observacionDetalle: '',
        nombreArchivo: '',
        archivoExcel: [],
        estado: true
    };
    
    self.cargaConadis = {
        id: 0,
        jsonExcel: [],
        observacionGeneral: '',
        observacionDetalle: '',
        nombreArchivo: '',
        archivoExcel: [],
        estado: true
    };        
    
    self.cargaPadron = {
        N_CONEXION_PK: 0,
        N_TIPO_CONEXION: 0,
        B_TIPO_CONEXION: true,
        D_AUD_FECHA_ACTUALIZACION: '',
        D_FECHA_PADRON: '',
        N_ESTADO: 0,
        B_ESTADO: true
    };
    
    self.cargaEtlv = {
        N_CONEXION_PK: 0,
        N_TIPO_CONEXION: 0,
        B_TIPO_CONEXION: true,
        D_AUD_FECHA_ACTUALIZACION: '',
        N_ESTADO: 0,
        B_ESTADO: true
    };
    
    self.cargaSige = {
        N_CONEXION_PK: 0,
        N_TIPO_CONEXION: 0,
        B_TIPO_CONEXION: true,
        D_AUD_FECHA_ACTUALIZACION: '',
        N_ESTADO: 0,
        B_ESTADO: true
    };
    
    self.cargaRae = {
        N_CONEXION_PK: 0,
        N_TIPO_CONEXION: 0,
        B_TIPO_CONEXION: true,
        D_AUD_FECHA_ACTUALIZACION: '',
        N_ESTADO: 0,
        B_ESTADO: true
    };
    
    self.cargaPref = {
        N_CONEXION_PK: 0,
        N_TIPO_CONEXION: 0,
        B_TIPO_CONEXION: true,
        D_AUD_FECHA_ACTUALIZACION: '',
        N_ESTADO: 0,
        B_ESTADO: true
    };
    
    self.observacionGeneralOdpe = {
        cantidadRegistros: 0,
        cantidadRegistrosCorrectos: 0,
        cantidadRegistrosError: 0,
        cantidadRegistrosCargados: 0
    };
    
    self.observacionGeneralLocal = {
        cantidadRegistros: 0,
        cantidadRegistrosCorrectos: 0,
        cantidadRegistrosError: 0,
        cantidadRegistrosCargados: 0
    };
    
    self.observacionGeneralPagina = {
        cantidadRegistros: 0,
        cantidadRegistrosCorrectos: 0,
        cantidadRegistrosError: 0,
        cantidadRegistrosCargados: 0
    };
    
    self.observacionGeneralConadis = {
        cantidadRegistros: 0,
        cantidadRegistrosCorrectos: 0,
        cantidadRegistrosError: 0,
        cantidadRegistrosCargados: 0
    };
               
    self.finallyProcessPadron = false;
    self.finallyProcessOdpe = false;
    self.finallyProcessLocal = false;
    self.finallyProcessPref = false;
        
    self.colorCargaOdpe = OnpeCargaConst.PE_COLOR_EMPTY;
    self.colorCargaLocal = OnpeCargaConst.PE_COLOR_EMPTY;
    self.colorCargaPagina = OnpeCargaConst.PE_COLOR_EMPTY;
    self.colorCargaConadis = OnpeCargaConst.PE_COLOR_EMPTY;
    self.colorStateEtlv = '';
    self.colorStateSige = '';
    self.colorStateRae = '';        
          
    getLastUpload(self.typeCarga_Padron);
    getLastUpload(self.typeCarga_Odpe);    
    getLastUpload(self.typeCarga_Local); 
    getLastUpload(self.typeCarga_Etlv);
    getLastUpload(self.typeCarga_Sige);
    getLastUpload(self.typeCarga_Rae);
    getLastUpload(self.typeCarga_Pagina);        
    getLastUpload(self.typeCarga_Conadis); 
    getLastUpload(self.typeCarga_Pref);
        
    function getLastUpload(tipoCarga) {
        
        if (tipoCarga === self.typeCarga_Pagina) {
            getEstado(self.typeCarga_Pagina);            
        } else if (tipoCarga === self.typeCarga_Conadis) {
            getEstado(self.typeCarga_Conadis);           
        }
        
        CargaService.getLastUpload(tipoCarga)
            .then(
            function(data){                  
                if (data.carga != null) {
                    if (tipoCarga === self.typeCarga_Odpe) {                        
                        self.cargaOdpe = data.carga;
                        self.observacionGeneralOdpe = JSON.parse(self.cargaOdpe.observacionGeneral);
                        self.colorCargaOdpe = (self.observacionGeneralOdpe.cantidadRegistrosError === 0 ? OnpeCargaConst.PE_COLOR_SUCCES : OnpeCargaConst.PE_COLOR_OBS);
                        self.finallyProcessOdpe = (self.observacionGeneralOdpe.cantidadRegistrosError === 0 ? true : false);                        
                    } else if (tipoCarga === self.typeCarga_Local) {                        
                        self.cargaLocal = data.carga;
                        self.observacionGeneralLocal = JSON.parse(self.cargaLocal.observacionGeneral);
                        self.colorCargaLocal = (self.observacionGeneralLocal.cantidadRegistrosError === 0 ? OnpeCargaConst.PE_COLOR_SUCCES : OnpeCargaConst.PE_COLOR_OBS);
                        self.finallyProcessLocal = (self.observacionGeneralLocal.cantidadRegistrosError === 0 ? true : false);                        
                    } else if (tipoCarga === self.typeCarga_Pagina) {                        
                        self.cargaPagina = data.carga;                                       
                        self.observacionGeneralPagina = JSON.parse(self.cargaPagina.observacionGeneral);
                        self.colorCargaPagina = (self.observacionGeneralPagina.cantidadRegistrosError === 0 ? OnpeCargaConst.PE_COLOR_SUCCES : OnpeCargaConst.PE_COLOR_OBS);
                    } else if (tipoCarga === self.typeCarga_Conadis) {
                        self.cargaConadis = data.carga;                        
                        self.observacionGeneralConadis = JSON.parse(self.cargaConadis.observacionGeneral);
                        self.colorCargaConadis = (self.observacionGeneralConadis.cantidadRegistrosError === 0 ? OnpeCargaConst.PE_COLOR_SUCCES : OnpeCargaConst.PE_COLOR_OBS);
                    } else if (tipoCarga === self.typeCarga_Padron) {
                        self.cargaPadron = data.carga;                        
                        CargaService.getVersionPadron().then(
                            function(data){
                                self.cargaPadron.D_FECHA_PADRON = data.version.D_FECHA_ACTUALIZACION;
                            });                        
                        self.cargaPadron.B_ESTADO = (self.cargaPadron.N_ESTADO == 0) ? true: false;                        
                        self.cargaPadron.B_TIPO_CONEXION = (self.cargaPadron.N_TIPO_CONEXION == 0) ? true: false;                        
                        self.finallyProcessPadron = (self.cargaPadron.D_AUD_FECHA_ACTUALIZACION === undefined ? false : true);
                    } else if (tipoCarga === self.typeCarga_Etlv) {
                        self.cargaEtlv = data.carga;
                        self.cargaEtlv.B_ESTADO = (self.cargaEtlv.N_ESTADO == 0) ? true: false;                        
                        self.cargaEtlv.B_TIPO_CONEXION = (self.cargaEtlv.N_TIPO_CONEXION == 0) ? true: false;                        
                        self.colorStateEtlv = (self.cargaEtlv.B_ESTADO?'':OnpeCargaConst.PE_COLOR_DISABLE);
                    } else if (tipoCarga === self.typeCarga_Sige) {
                        self.cargaSige = data.carga; 
                        self.cargaSige.B_ESTADO = (self.cargaSige.N_ESTADO == 0) ? true: false;                        
                        self.cargaSige.B_TIPO_CONEXION = (self.cargaSige.N_TIPO_CONEXION == 0) ? true: false;
                        self.colorStateSige = (self.cargaSige.B_ESTADO?'':OnpeCargaConst.PE_COLOR_DISABLE);
                    } else if (tipoCarga === self.typeCarga_Rae) {
                        self.cargaRae = data.carga;
                        self.cargaRae.B_ESTADO = (self.cargaRae.N_ESTADO == 0) ? true: false;                        
                        self.cargaRae.B_TIPO_CONEXION = (self.cargaRae.N_TIPO_CONEXION == 0) ? true: false;
                        self.colorStateRae = (self.cargaRae.B_ESTADO?'':OnpeCargaConst.PE_COLOR_DISABLE);
                    } else if (tipoCarga === self.typeCarga_Pref) {                        
                        self.cargaPref = data.carga;
                        self.cargaPref.B_ESTADO = (self.cargaRae.N_ESTADO == 0) ? true: false;
                        self.cargaPref.B_TIPO_CONEXION = (self.cargaRae.N_TIPO_CONEXION == 0) ? true: false;
                        self.finallyProcessPref = (self.cargaPref.D_AUD_FECHA_ACTUALIZACION === undefined ? false : true);                        
                    }                       
    
                } else {
                    if (tipoCarga === self.typeCarga_Odpe) {
                        self.observacionGeneralOdpe.cantidadRegistrosCargados = 0;
                        self.errorFormatoCargaOdpe = false; 
                        self.errorSystemCargaOdpe = false; 
                        self.cargandoFormatoCargaOdpe = false;
                        self.observacionGeneralOdpe.cantidadRegistrosCargados = 0; 
                        self.observacionGeneralOdpe.cantidadRegistrosError = 0;
                        self.colorCargaOdpe = OnpeCargaConst.PE_COLOR_EMPTY;
                        self.finallyProcessOdpe = false;
                    } else if (tipoCarga === self.typeCarga_Local) {
                        self.observacionGeneralLocal.cantidadRegistrosCargados = 0;
                        self.errorFormatoCargaLocal = false;
                        self.errorSystemCargaLocal = false; 
                        self.cargandoFormatoCargaLocal = false;
                        self.observacionGeneralLocal.cantidadRegistrosCargados = 0;
                        self.observacionGeneralLocal.cantidadRegistrosError = 0;
                        self.colorCargaLocal = OnpeCargaConst.PE_COLOR_EMPTY;                        
                        self.finallyProcessLocal = false;
                    } else if (tipoCarga === self.typeCarga_Pref) {                        
                        self.cargandoFormatoCargaPref = false;
                        self.finallyProcessPref = false;
                    }                                     
                }           
            },
            function(errResponse){
                console.error('Error while getLastUpload:'+errResponse);
            }
        );                                        
    };
    
    function getEstado(id){
        
        var fd = new FormData();
        fd.append('id', id);                     
        
        CargaService.getEstado(fd)
            .then(
            function(data){                 
                var status = data.status;
                if (id == self.typeCarga_Pagina) {                    
                    self.viewPagina = status;                    
                } else if (id == self.typeCarga_Conadis) {                    
                    self.viewConadis = status;                    
                }                
            },
            function(errResponse){
                console.log("GET ESTADO ERROR: " + errResponse);
            }
        );
                
        return status;
        
    };
    
    $scope.$watch('cargaOdpe.length', function (newVal, oldVal) {         
        if ($scope.cargaOdpe !== undefined && $scope.cargaOdpe.length > 0) {            
            self.cargandoFormatoCargaOdpe = true;
            self.errorFormatoCargaOdpe = false;
            self.errorSystemCargaOdpe = false; 
            self.errorNombreFormatoCargaOdpe = false;
            self.errorExtensionCargaOdpe = false;
            
            self.mensajeLfInput_Padron = "";
                        
            uploadFile($scope.cargaOdpe[0], self.typeCarga_Odpe);
        }
    });
    
    $scope.$watch('cargaLocal.length', function (newVal, oldVal) {                 
        if ($scope.cargaLocal !== undefined && $scope.cargaLocal.length > 0) {            
            self.cargandoFormatoCargaLocal = true;
            self.errorFormatoCargaLocal = false;
            self.errorSystemCargaLocal = false; 
            self.errorNombreFormatoCargaLocal = false;
            self.errorExtensionCargaLocal = false;
                             
            uploadFile($scope.cargaLocal[0], self.typeCarga_Local);
        }
    });
    
    $scope.$watch('cargaPagina.length', function (newVal, oldVal) {        
        if ($scope.cargaPagina !== undefined && $scope.cargaPagina.length > 0) {            
            self.cargandoFormatoCargaPagina = true;
            self.errorFormatoCargaPagina = false;
            self.errorSystemCargaPagina = false; 
            self.errorNombreFormatoCargaPagina = false;
            self.errorExtensionCargaPagina = false;
                                         
            uploadFile($scope.cargaPagina[0], self.typeCarga_Pagina);
        }
    });
    
    $scope.$watch('cargaConadis.length', function (newVal, oldVal) {                 
        if ($scope.cargaConadis !== undefined && $scope.cargaConadis.length > 0) {            
            self.cargandoFormatoCargaConadis = true;
            self.errorFormatoCargaConadis = false;
            self.errorSystemCargaConadis = false; 
            self.errorNombreFormatoCargaConadis = false;
            self.errorExtensionCargaConadis = false;
                             
            uploadFile($scope.cargaConadis[0], self.typeCarga_Conadis);
        }
    });
    
    function uploadFile (file, tipoCarga) {         
        self.tipoCarga = tipoCarga;        
        self.file = file.lfFile;
        
        if (self.file.type !== "application/vnd.ms-excel" && self.file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {            
            if (self.tipoCarga === self.typeCarga_Odpe) {
                $scope.cargaOdpe = [];                
                self.errorExtensionCargaOdpe = true;
            } else if (self.tipoCarga === self.typeCarga_Local) {
                $scope.cargaLocal = [];
                self.errorExtensionCargaLocal = true;
            } else if (self.tipoCarga === self.typeCarga_Pagina) {
                $scope.cargaPagina = [];                
                self.errorExtensionCargaPagina = true;
            } else if (self.tipoCarga === self.typeCarga_Conadis) {
                $scope.cargaConadis = [];                
                self.errorExtensionCargaConadis = true;
            }             
            initErrorExtension(OnpeCargaConst.PE_MSG_EXTENSIONFILE);            
            return;
        }
        
        if (self.file.name.length > 45) {
            if (self.tipoCarga === self.typeCarga_Odpe) {
                $scope.cargaOdpe = [];
                self.errorNombreFormatoCargaOdpe = false; 
                self.errorExtensionCargaOdpe = true;
            } else if (self.tipoCarga === self.typeCarga_Local) {
                $scope.cargaLocal = [];
                self.errorNombreFormatoCargaLocal = false;
                self.errorExtensionCargaLocal = true;
            } else if (self.tipoCarga === self.typeCarga_Pagina) {
                $scope.cargaPagina = [];
                self.errorNombreFormatoCargaPagina = false;
                self.errorExtensionCargaPagina = true;
            } else if (self.tipoCarga === self.typeCarga_Conadis) {
                $scope.cargaConadis = [];
                self.errorNombreFormatoCargaConadis = false;
                self.errorExtensionCargaConadis = true;
            }
            initErrorCarga(OnpeCargaConst.PE_MSG_LONGFILE);            
            return;
        }
        
        uploadFileToUrl(self.file);                    
    };
    
    function uploadFileToUrl (file) {
        if (self.tipoCarga === self.typeCarga_Odpe) {
            self.observacionGeneralOdpe = {};
            self.observacionGeneralOdpe.cantidadRegistros = 0;
            self.observacionGeneralOdpe.cantidadRegistrosError = 0;
            self.observacionGeneralOdpe.cantidadRegistrosCorrectos = 0;
        } else if (self.tipoCarga === self.typeCarga_Local) {
            self.observacionGeneralLocal = {};
            self.observacionGeneralLocal.cantidadRegistros = 0;
            self.observacionGeneralLocal.cantidadRegistrosError = 0;
            self.observacionGeneralLocal.cantidadRegistrosCorrectos = 0;
        } else if (self.tipoCarga === self.typeCarga_Pagina) {
            self.observacionGeneralPagina = {};
            self.observacionGeneralPagina.cantidadRegistros = 0;
            self.observacionGeneralPagina.cantidadRegistrosError = 0;
            self.observacionGeneralPagina.cantidadRegistrosCorrectos = 0;
        } else if (self.tipoCarga === self.typeCarga_Conadis) {
            self.observacionGeneralConadis = {};
            self.observacionGeneralConadis.cantidadRegistros = 0;
            self.observacionGeneralConadis.cantidadRegistrosError = 0;
            self.observacionGeneralConadis.cantidadRegistrosCorrectos = 0;
        }
                                
        setTimeout(function () {
            var fd = new FormData();
            fd.append('file', file);
            fd.append('tipoCarga', self.tipoCarga);
            
            CargaService.validate(fd)
                .then(
                function(data){                    
                    if (data.success === true) {                                                                                                                   
                        self.result = JSON.parse(data.json);
                        self.resultCopy = angular.copy(self.result);                        
                        self.resultCopyUnique = angular.copy(self.result);                                             
                        self.columns = JSON.parse(data.columns);                        
                        
                        if (self.tipoCarga === self.typeCarga_Odpe) {
                                $scope.cargaOdpe = [];
                        } else if (self.tipoCarga === self.typeCarga_Local) {
                                $scope.cargaLocal = [];
                        } else if (self.tipoCarga === self.typeCarga_Pagina) {
                                $scope.cargaPagina = [];
                        } else if (self.tipoCarga === self.typeCarga_Conadis) {
                                $scope.cargaConadis = [];
                        }
			                        
                        if (self.result.message.length > 0) {                            
                            if (self.tipoCarga === self.typeCarga_Odpe) {                                 
                                if (self.cargandoFormatoCargaOdpe) {
                                    if (self.result.data !== undefined) {
                                        if (self.result.data.length === 0) {
                                            initErrorCarga(self.result.message[0].DOCUMENTO_VACIO);
                                        } else {
                                            initErrorCarga(OnpeCargaConst.PE_MSG_FILEERROR);
                                        }
                                    } else {
                                        initErrorCarga(OnpeCargaConst.PE_MSG_FILEERROR);
                                    }                                                                                                                                                
                                    self.colorCargaOdpe = OnpeCargaConst.PE_COLOR_ERROR;
                                }    
                            } else if (self.tipoCarga === self.typeCarga_Local) {                                 
                                if (self.cargandoFormatoCargaLocal) {
                                    if (self.result.data !== undefined) {
                                        if (self.result.data.length === 0) {
                                            initErrorCarga(self.result.message[0].DOCUMENTO_VACIO);
                                        } else {
                                            initErrorCarga(OnpeCargaConst.PE_MSG_FILEERROR);
                                        }
                                    } else {
                                        initErrorCarga(OnpeCargaConst.PE_MSG_FILEERROR);
                                    }
                                    self.colorCargaLocal = OnpeCargaConst.PE_COLOR_ERROR;
                                }
                            } else if (self.tipoCarga === self.typeCarga_Pagina) {                                 
                                if (self.cargandoFormatoCargaPagina) {
                                    if (self.result.data !== undefined) {
                                        if (self.result.data.length === 0) {
                                            initErrorCarga(self.result.message[0].DOCUMENTO_VACIO);
                                        } else {
                                            initErrorCarga(OnpeCargaConst.PE_MSG_FILEERROR);
                                        }
                                    } else {
                                        initErrorCarga(OnpeCargaConst.PE_MSG_FILEERROR);
                                    }
                                    self.colorCargaPagina = OnpeCargaConst.PE_COLOR_ERROR;
                                }
                            } else if (self.tipoCarga === self.typeCarga_Conadis) {                                 
                                if (self.cargandoFormatoCargaConadis) {
                                    if (self.result.data !== undefined) {
                                        if (self.result.data.length === 0) {
                                            initErrorCarga(self.result.message[0].DOCUMENTO_VACIO);
                                        } else {
                                            initErrorCarga(OnpeCargaConst.PE_MSG_FILEERROR);
                                        }
                                    } else {
                                        initErrorCarga(OnpeCargaConst.PE_MSG_FILEERROR);
                                    }
                                    self.colorCargaConadis = OnpeCargaConst.PE_COLOR_ERROR;
                                }
                            }                                                      
                        } else {                            
                            validarCarga();                                
                        }                        										
                    } else {                        
                        mostrarMensaje(data.message);
                    }                   
                },
                function(errResponse){                     
                    if (self.tipoCarga === self.typeCarga_Odpe) {
                        self.cargandoFormatoCargaOdpe = false;
                        self.errorSystemCargaOdpe === true;
                    } else if (self.tipoCarga === self.typeCarga_Local) {
                        self.cargandoFormatoCargaLocal = false;
                        self.errorSystemCargaLocal === true;
                    } else if (self.tipoCarga === self.typeCarga_Pagina) {
                        self.cargandoFormatoCargaPagina = false;
                        self.errorSystemCargaPagina === true;
                    } else if (self.tipoCarga === self.typeCarga_Conadis) {
                        self.cargandoFormatoCargaConadis = false;
                        self.errorSystemCargaConadis === true;
                    }                   
                    mostrarMensajeSystem("El servidor encontró una condición inesperada.");
                }
            );                                    
            
        }, 800);
    };
    
    function initErrorExtension(mensajeError) {
        if (self.tipoCarga === self.typeCarga_Odpe) {
            self.mensajeFormatoCargaOdpe = mensajeError;
            self.cargandoFormatoCargaOdpe = false;
            self.errorFormatoCargaOdpe = true;
        } else if (self.tipoCarga === self.typeCarga_Local) {
            self.mensajeFormatoCargaLocal = mensajeError;
            self.cargandoFormatoCargaLocal = false;            
            self.errorFormatoCargaLocal = true;
        } else if (self.tipoCarga === self.typeCarga_Pagina) {
            self.mensajeFormatoCargaPagina = mensajeError;
            self.cargandoFormatoCargaPagina = false;  
            self.errorFormatoCargaPagina = true;
        } else if (self.tipoCarga === self.typeCarga_Conadis) {
            self.mensajeFormatoCargaConadis = mensajeError;
            self.cargandoFormatoCargaConadis = false;            
            self.errorFormatoCargaConadis = true;
        }                
    };   
    
    function initErrorCarga(mensajeError) {
        if (self.tipoCarga === self.typeCarga_Odpe) {
            self.mensajeFormatoCargaOdpe = mensajeError;
            self.cargandoFormatoCargaOdpe = false;
            self.errorFormatoCargaOdpe = true; 
            self.errorSystemCargaOdpe = false; 
            self.observacionGeneralOdpe.cantidadRegistrosError = 1;
            self.colorCargaOdpe = OnpeCargaConst.PE_COLOR_ERROR;
        } else if (self.tipoCarga === self.typeCarga_Local) {
            self.mensajeFormatoCargaLocal = mensajeError;
            self.cargandoFormatoCargaLocal = false;
            self.errorFormatoCargaLocal = true;        
            self.errorSystemCargaLocal = false; 
            self.observacionGeneralLocal.cantidadRegistrosError = 1;
            self.colorCargaLocal = OnpeCargaConst.PE_COLOR_ERROR;
        } else if (self.tipoCarga === self.typeCarga_Pagina) {
            self.mensajeFormatoCargaPagina = mensajeError;
            self.cargandoFormatoCargaPagina = false;
            self.errorFormatoCargaPagina = true; 
            self.errorSystemCargaPagina = false; 
            self.observacionGeneralPagina.cantidadRegistrosError = 1;
            self.colorCargaPagina = OnpeCargaConst.PE_COLOR_ERROR;
        } else if (self.tipoCarga === self.typeCarga_Conadis) {
            self.mensajeFormatoCargaConadis = mensajeError;
            self.cargandoFormatoCargaConadis = false;
            self.errorFormatoCargaConadis = true;        
            self.errorSystemCargaConadis = false; 
            self.observacionGeneralConadis.cantidadRegistrosError = 1;
            self.colorCargaConadis = OnpeCargaConst.PE_COLOR_ERROR;
        }                
    };  
    
    function initErrorSystem(mensajeError) {
        if (self.tipoCarga === self.typeCarga_Odpe) {
            self.mensajeFormatoCargaOdpe = mensajeError;
            self.cargandoFormatoCargaOdpe = false;
            self.errorFormatoCargaOdpe = true; 
            self.errorSystemCargaOdpe = true; 
            self.observacionGeneralOdpe.cantidadRegistrosError = 1;
            self.colorCargaOdpe = OnpeCargaConst.PE_COLOR_ERROR;
        } else if (self.tipoCarga === self.typeCarga_Local) {
            self.mensajeFormatoCargaLocal = mensajeError;
            self.cargandoFormatoCargaLocal = false;
            self.errorFormatoCargaLocal = true;        
            self.errorSystemCargaLocal = true; 
            self.observacionGeneralLocal.cantidadRegistrosError = 1;
            self.colorCargaLocal = OnpeCargaConst.PE_COLOR_ERROR;
        } else if (self.tipoCarga === self.typeCarga_Pagina) {
            self.mensajeFormatoCargaPagina = mensajeError;
            self.cargandoFormatoCargaPagina = false;
            self.errorFormatoCargaPagina = true; 
            self.errorSystemCargaPagina = true; 
            self.observacionGeneralPagina.cantidadRegistrosError = 1;
            self.colorCargaPagina = OnpeCargaConst.PE_COLOR_ERROR;
        } else if (self.tipoCarga === self.typeCarga_Conadis) {
            self.mensajeFormatoCargaConadis = mensajeError;
            self.cargandoFormatoCargaConadis = false;
            self.errorFormatoCargaConadis = true;        
            self.errorSystemCargaConadis = true; 
            self.observacionGeneralConadis.cantidadRegistrosError = 1;
            self.colorCargaConadis = OnpeCargaConst.PE_COLOR_ERROR;
        }                
    };
    
    function validarCarga() {        
        if (self.tipoCarga === self.typeCarga_Odpe) {
            self.observacionGeneralOdpe.cantidadRegistros = self.result.data.length;                
            self.observacionGeneralOdpe.cantidadRegistrosError = 0;            
            self.observacionDetalleCargaOdpe = [];
        } else if (self.tipoCarga === self.typeCarga_Local) {
            self.observacionGeneralLocal.cantidadRegistros = self.result.data.length;                
            self.observacionGeneralLocal.cantidadRegistrosError = 0;
            self.observacionDetalleCargaLocal = [];
        } else if (self.tipoCarga === self.typeCarga_Pagina) {
            self.observacionGeneralPagina.cantidadRegistros = self.result.data.length;                
            self.observacionGeneralPagina.cantidadRegistrosError = 0;
            self.observacionDetalleCargaPagina = [];
        } else if (self.tipoCarga === self.typeCarga_Conadis) {
            self.observacionGeneralConadis.cantidadRegistros = self.result.data.length;                
            self.observacionGeneralConadis.cantidadRegistrosError = 0;
            self.observacionDetalleCargaConadis = [];
        }      
               
        for (var i = 0; i < self.resultCopy.data.length; i++) {             
            var obj = self.resultCopy.data[i];             
            var error = false;
            var message = "";
            for (var j = 0; j < self.columns.length; j++) {                
                var column = self.columns[j];                 
                if (column.unico == 1) {                    
                    var isUnique = isUniqueField(obj[column.columnaTabla], i, column.columnaTabla);                    
                    if (!isUnique) {                                                
                        if (!error)
                            error = true;
                        //message += column.columnaExcel + ":Registro duplicado|";
                        message += column.columnaExcel + ": Registro duplicado" + (message !== "" ? "| " : "");
                        obj.N_DUPLICADO = 1;
                    }
                }
                if (column.validacion) {                    
                    var regex = new RegExp(column.validacion);
                    var res = regex.test(obj[column.columnaTabla]);                    
                    if (!res) {                          
                        if (!error) {
                            error = true;
                        }
                        //message += column.columnaExcel + ":" + column.mensajeValidacion + "|";
                        message += column.columnaExcel + ": " + column.mensajeValidacion + (message !== "" ? "| " : "");
                    }
                }
                if (column.obligatorio == 1 && column.unico == 0) {                    
                    var valueCell = obj[column.columnaTabla];
                    if (valueCell.trim() === "") {
                        if (!error) {
                            error = true;
                        }                      
                        message += column.columnaExcel + ": " + column.comentario + (message !== "" ? "| " : "");
                    }                    
                }
            }                                    
            
            if (error) {                 
                if (self.tipoCarga === self.typeCarga_Odpe) {
                    self.observacionGeneralOdpe.cantidadRegistrosError += 1;
                    self.observacionDetalleCargaOdpe.push(obj);
                } else if (self.tipoCarga === self.typeCarga_Local) {
                    self.observacionGeneralLocal.cantidadRegistrosError += 1;
                    self.observacionDetalleCargaLocal.push(obj);
                } else if (self.tipoCarga === self.typeCarga_Pagina) {
                    self.observacionGeneralPagina.cantidadRegistrosError += 1;
                    self.observacionDetalleCargaPagina.push(obj);
                } else if (self.tipoCarga === self.typeCarga_Conadis) {
                    self.observacionGeneralConadis.cantidadRegistrosError += 1;
                    self.observacionDetalleCargaConadis.push(obj);
                }                                                                                                                                 
                
//                console.log(JSON.stringify(self.resultCopy.data[i]));                
//                var indexDelete = self.result.data.indexOf(self.resultCopy.data[i]);                
//                self.result.data.splice(indexDelete, 1);
                obj.C_VALIDACION = message;
                
            } else {
                obj.C_VALIDACION = '';
            }
        }                      
              
        if (self.tipoCarga === self.typeCarga_Odpe) {            
            self.observacionGeneralOdpe.cantidadRegistrosCorrectos = self.observacionGeneralOdpe.cantidadRegistros - self.observacionGeneralOdpe.cantidadRegistrosError;        
            if (self.errorFormatoCargaOdpe === true) self.colorCargaOdpe = OnpeCargaConst.PE_COLOR_OBS;
            self.colorCargaOdpe = (self.observacionGeneralOdpe.cantidadRegistrosError > 0 ? OnpeCargaConst.PE_COLOR_OBS: OnpeCargaConst.PE_COLOR_SUCCES);
        } else if (self.tipoCarga === self.typeCarga_Local) {
            self.observacionGeneralLocal.cantidadRegistrosCorrectos = self.observacionGeneralLocal.cantidadRegistros - self.observacionGeneralLocal.cantidadRegistrosError;        
            if (self.errorFormatoCargaLocal === true) self.colorCargaLocal = OnpeCargaConst.PE_COLOR_OBS;
            self.colorCargaLocal = (self.observacionGeneralLocal.cantidadRegistrosError > 0 ? OnpeCargaConst.PE_COLOR_OBS: OnpeCargaConst.PE_COLOR_SUCCES);
        } else if (self.tipoCarga === self.typeCarga_Pagina) {
            self.observacionGeneralPagina.cantidadRegistrosCorrectos = self.observacionGeneralPagina.cantidadRegistros - self.observacionGeneralPagina.cantidadRegistrosError;        
            if (self.errorFormatoCargaPagina === true) self.colorCargaPagina = OnpeCargaConst.PE_COLOR_OBS;
            self.colorCargaPagina = (self.observacionGeneralPagina.cantidadRegistrosError > 0 ? OnpeCargaConst.PE_COLOR_OBS: OnpeCargaConst.PE_COLOR_SUCCES);
        } else if (self.tipoCarga === self.typeCarga_Conadis) {
            self.observacionGeneralConadis.cantidadRegistrosCorrectos = self.observacionGeneralConadis.cantidadRegistros - self.observacionGeneralConadis.cantidadRegistrosError;        
            if (self.errorFormatoCargaConadis === true) self.colorCargaConadis = OnpeCargaConst.PE_COLOR_OBS;
            self.colorCargaConadis = (self.observacionGeneralConadis.cantidadRegistrosError > 0 ? OnpeCargaConst.PE_COLOR_OBS: OnpeCargaConst.PE_COLOR_SUCCES);
        }                              
        
        self.arrayTemp = [];
        for (var k in self.resultCopy.data) {            
            if (self.resultCopy.data[k].C_VALIDACION === '') {
                self.arrayTemp.push(self.resultCopy.data[k]);
            }
        }
                
        guardar();
                        
    };        
    
    function isUniqueField (data, index, field) {                             
        for (var h = 0; h < self.resultCopyUnique.data.length; h++) {            
            if (h !== index) {                
                var objH = self.resultCopyUnique.data[h];                
                if (data.trim() !== "" && data === objH[field]) {                    
                    return false;
                }
            }
        }                   
        return true;
    };
    
    function guardar() {                 
        if (self.tipoCarga === self.typeCarga_Odpe) {
            if (self.cargandoFormatoCargaOdpe) {
                self.cabCarga = self.cargaOdpe;
                self.cabCarga.observacionGeneral = self.observacionGeneralOdpe;
                self.cabCarga.observacionDetalle = self.observacionDetalleCargaOdpe;
            }     
        } else if (self.tipoCarga === self.typeCarga_Local) {
            if (self.cargandoFormatoCargaLocal) {
                self.cabCarga = self.cargaLocal;
                self.cabCarga.observacionGeneral = self.observacionGeneralLocal;
                self.cabCarga.observacionDetalle = self.observacionDetalleCargaLocal;
            }
        } else if (self.tipoCarga === self.typeCarga_Pagina) {
            if (self.cargandoFormatoCargaPagina) {
                self.cabCarga = self.cargaPagina;
                self.cabCarga.observacionGeneral = self.observacionGeneralPagina;
                self.cabCarga.observacionDetalle = self.observacionDetalleCargaPagina;
            }
        } else if (self.tipoCarga === self.typeCarga_Conadis) {
            if (self.cargandoFormatoCargaConadis) {
                self.cabCarga = self.cargaConadis;
                self.cabCarga.observacionGeneral = self.observacionGeneralConadis;
                self.cabCarga.observacionDetalle = self.observacionDetalleCargaConadis;
            }
        } 
        
        self.cabCarga.jsonExcel = self.arrayTemp;         
        self.cabCarga.nombreArchivo = self.file.name;
        self.cabCarga.archivoExcel = [];                 
        
        var fd = new FormData();                    
            fd.append('cabCarga', JSON.stringify(self.cabCarga));                        
            fd.append('tipoCarga', self.tipoCarga);
            
        CargaService.save(fd)
            .then(
            function(data){                
                if (data.success === true) {
                    if (self.tipoCarga === self.typeCarga_Odpe) {
                        self.cargaOdpe = data.cabeceraCarga;
                        var idCarga = self.cargaOdpe.id;
                        self.observacionGeneralOdpe = JSON.parse(data.cabeceraCarga.observacionGeneral);                                                                            
                        if (idCarga !== 0) self.cargandoFormatoCargaOdpe = false;
                        self.finallyProcessOdpe = (self.observacionGeneralOdpe.cantidadRegistrosError === 0 ? true : false);
                        if (self.observacionGeneralOdpe.cantidadRegistrosError > 0) {
                            self.colorCargaOdpe = OnpeCargaConst.PE_COLOR_OBS;
                            data.procces = 2;
                        }
                        getLastUpload(self.typeCarga_Local);
                        getLastUpload(self.typeCarga_Pref);
                    } else if (self.tipoCarga === self.typeCarga_Local) {
                        self.cargaLocal = data.cabeceraCarga;
                        var idCarga = self.cargaLocal.id;
                        self.observacionGeneralLocal = JSON.parse(data.cabeceraCarga.observacionGeneral);                                                                            
                        if (idCarga !== 0) self.cargandoFormatoCargaLocal = false;
                        self.finallyProcessLocal = (self.observacionGeneralLocal.cantidadRegistrosError === 0 ? true : false);
                        if (self.observacionGeneralLocal.cantidadRegistrosError > 0) {
                            self.colorCargaLocal = OnpeCargaConst.PE_COLOR_OBS;
                            data.procces = 2;
                        }
                        getLastUpload(self.typeCarga_Odpe);
                        getLastUpload(self.typeCarga_Pref);
                    } else if (self.tipoCarga === self.typeCarga_Pagina) {
                        self.cargaPagina = data.cabeceraCarga;
                        var idCarga = self.cargaPagina.id;
                        self.observacionGeneralPagina = JSON.parse(data.cabeceraCarga.observacionGeneral);                                                                            
                        if (idCarga !== 0) self.cargandoFormatoCargaPagina = false;                        
                        if (self.observacionGeneralPagina.cantidadRegistrosError > 0) {
                            self.colorCargaPagina = OnpeCargaConst.PE_COLOR_OBS
                            data.procces = 2;
                        }
                    } else if (self.tipoCarga === self.typeCarga_Conadis) {
                        self.cargaConadis = data.cabeceraCarga;
                        var idCarga = self.cargaConadis.id;
                        self.observacionGeneralConadis = JSON.parse(data.cabeceraCarga.observacionGeneral);                                                                            
                        if (idCarga !== 0) self.cargandoFormatoCargaConadis = false;                        
                        if (self.observacionGeneralConadis.cantidadRegistrosError > 0) {
                            self.colorCargaConadis = OnpeCargaConst.PE_COLOR_OBS;
                            data.procces = 2;
                        }
                    }   
                                        
                    if (data.procces == 1) {
                        showMessageAlert("El proceso se ha actualizado correctamente.");                        
                    } else if (data.procces == 2) {
                        //showMessageAlert("Ocurrió un error al momento de actualizar el proceso. Inténtelo de nuevo.");                        
                    }                                                       
                } else {                    
                    mostrarMensaje(data.message);
                }   
                                
            },
            function(errResponse){                
                if (self.tipoCarga === self.typeCarga_Odpe) {
                    self.cargandoFormatoCargaOdpe = false;
                } else if (self.tipoCarga === self.typeCarga_Local) {
                    self.cargandoFormatoCargaLocal = false;
                } else if (self.tipoCarga === self.typeCarga_Pagina) {
                    self.cargandoFormatoCargaPagina = false;
                } else if (self.tipoCarga === self.typeCarga_Conadis) {
                    self.cargandoFormatoCargaConadis = false;
                }              
                mostrarMensajeSystem("El servidor encontró una condición inesperada.");
            }
        );                
    };
    
    function mostrarMensaje(mensaje) {
        initErrorCarga(mensaje);
        if (self.tipoCarga === self.typeCarga_Odpe) {
            $scope.cargaOdpe = [];            
            self.errorNombreFormatoCargaOdpe = true;
        } else if (self.tipoCarga === self.typeCarga_Local) {
            $scope.cargaLocal = [];            
            self.errorNombreFormatoCargaLocal = true;
        } else if (self.tipoCarga === self.typeCarga_Pagina) {
            $scope.cargaPagina = [];            
            self.errorNombreFormatoCargaPagina = true;
        } else if (self.tipoCarga === self.typeCarga_Conadis) {
            $scope.cargaConadis = [];            
            self.errorNombreFormatoCargaConadis = true;
        }
    };
    
    function mostrarMensajeSystem(mensaje) {
        initErrorSystem(mensaje);
        if (self.tipoCarga === self.typeCarga_Odpe) {
            $scope.cargaOdpe = [];            
            self.errorNombreFormatoCargaOdpe = true;
        } else if (self.tipoCarga === self.typeCarga_Local) {
            $scope.cargaLocal = [];            
            self.errorNombreFormatoCargaLocal = true;
        } else if (self.tipoCarga === self.typeCarga_Pagina) {
            $scope.cargaPagina = [];            
            self.errorNombreFormatoCargaPagina = true;
        } else if (self.tipoCarga === self.typeCarga_Conadis) {
            $scope.cargaConadis = [];            
            self.errorNombreFormatoCargaConadis = true;
        }
    };
    
    function descargarDetalleFormato(tipoCarga) {        
        window.open(C_SERVER + "/carga/downloadTemplateDetail/" + tipoCarga);
    };
    
    function descargarDetalle(tipoCarga, tipo) {  
        window.open(C_SERVER + "/carga/downloadDetail/" + tipoCarga + "/" + tipo);
    };
    
    function descargarPlantilla(tipoCarga) {
        window.open(C_SERVER + "/carga/download/" + tipoCarga);
    };
    
    function onChangeSwitch(type, tipoCarga, state) {        
        var fd = new FormData();
            fd.append('type', type); 
            fd.append('id', tipoCarga); 
            fd.append('status', state);
        
        CargaService.updateState(fd)
            .then( 
            function(data){
                if (type === 1) {
                    if (tipoCarga === self.typeCarga_Etlv) {
                        self.colorStateEtlv = (state?'':OnpeCargaConst.PE_COLOR_DISABLE);                        
                    } else if (tipoCarga === self.typeCarga_Sige) {
                        self.colorStateSige = (state?'':OnpeCargaConst.PE_COLOR_DISABLE);
                    } else if (tipoCarga === self.typeCarga_Rae) {
                        self.colorStateRae = (state?'':OnpeCargaConst.PE_COLOR_DISABLE);
                    }                    
                }                
            },
            function(errResponse){
                console.log("ERROR AL ACTUALIZAR" + errResponse);
            }
        );
    };
    
    function updateProcess(id) { 

        if (id == self.typeCarga_Pref) {            
//            var confirm = $mdDialog.confirm()
//                    .title('Preferenciales.')
//                    .textContent('¿Está seguro que desea ejecutar este proceso?').targetEvent()
//                    .ok('Si').cancel('No');
//            $mdDialog.show(confirm).then(function () {

                executeProcess(self.typeCarga_Pref);

//            }, function () {
//            });                                    
        } else if (id == self.typeCarga_Sige) {
            executeProcess(id);
        } else {
            var confirm = $mdDialog.confirm()
                    .title('Actualizar Proceso.')
                    .textContent('¿Está seguro que desea actualizar este proceso?').targetEvent()
                    .ok('Si').cancel('No');
            $mdDialog.show(confirm).then(function () {

                executeProcess(id);

            }, function () {
            });
        }                                
                                                            
    };
    
    function executeProcess(id) {
        $scope.$emit('executeProcedure', 'carga');         
        var fd = new FormData();
                fd.append('id', id); 
                if (id == self.typeCarga_Padron) {
                    self.cargandoFormatoCargaPadron = true;
                    fd.append('url', self.serviceNamePadron);
                } else if (id == self.typeCarga_Etlv) {
                    self.cargandoFormatoCargaEtlv = true;
                    fd.append('url', self.serviceNameEtlv);
                } else if (id == self.typeCarga_Sige) {
                    self.cargandoFormatoCargaSige = true;
                    fd.append('url', self.serviceNameSige);                                                            
                } else if (id == self.typeCarga_Rae) {
                    self.cargandoFormatoCargaRae = true;
                    fd.append('url', self.serviceNameRae);                    
                } else if (id == self.typeCarga_Pref) {
                    self.cargandoFormatoCargaPref = true;
                    fd.append('url', 'undefined');
                }
            
            CargaService.executeProcess(fd)
                .then(
                function(data){                
                    if (data.success === true) {                        
                        if (id == self.typeCarga_Sige) {
                            showMessageAlert("El proceso se ha verificado satisfactoriamente.");
                            self.onChangeSwitch(1, self.typeCarga_Sige, true);
                            self.cargaEtlv.B_ESTADO = true;
                        } else {
                            if (id == self.typeCarga_Padron) {
                                getLastUpload(self.typeCarga_Odpe);    
                                getLastUpload(self.typeCarga_Local);
                            }
                            if (id == self.typeCarga_Odpe) {
                                getLastUpload(self.typeCarga_Local);
                                getLastUpload(self.typeCarga_Pref);
                            }
                            if (id == self.typeCarga_Local) {
                                getLastUpload(self.typeCarga_Pref);
                            }                            
                            //showMessageAlert("El proceso se ha actualizado correctamente.");
                        }                        
                    } else {
                        if (id == self.typeCarga_Sige) {
                            showMessageAlert("No se ha podido verificar el proceso.");
                            self.onChangeSwitch(1, self.typeCarga_Sige, false);
                            self.cargaEtlv.B_ESTADO = false;
                        } else {
                            showMessageAlert("No se ha podido actualizar el proceso. Inténtelo de nuevo.");
                        }
                        
                        if (id == self.typeCarga_Padron) {
                            self.finallyProcessPadron = false;
                            self.finallyProcessOdpe = false;
                            self.finallyProcessLocal = false;
                            self.finallyProcessPref = false;
                        } else if (id == self.typeCarga_Odpe) {                            
                            self.finallyProcessOdpe = false;
                            self.finallyProcessLocal = false;
                            self.finallyProcessPref = false;
                        } else if (id == self.typeCarga_Local) {
                            self.finallyProcessLocal = false;
                            self.finallyProcessPref = false;
                        } else if (id == self.typeCarga_Pref) {                            
                            self.finallyProcessPref = false;
                        }
                    }  
                    
                    if (id == self.typeCarga_Padron) {                        
                        getLastUpload(self.typeCarga_Padron);                         
                        self.cargandoFormatoCargaPadron = false;
                    } else if (id == self.typeCarga_Etlv) {
                        getLastUpload(self.typeCarga_Etlv);
                        self.cargandoFormatoCargaEtlv = false;
                    } else if (id == self.typeCarga_Sige) {
                        getLastUpload(self.typeCarga_Sige);
                        self.cargandoFormatoCargaSige = false;
                    } else if (id == self.typeCarga_Rae) {
                        getLastUpload(self.typeCarga_Rae);
                        self.cargandoFormatoCargaRae = false;
                    } else if (id == self.typeCarga_Pref) {
                        getLastUpload(self.typeCarga_Pref);
                        self.cargandoFormatoCargaPref = false;                                              
                    }
                },
                function(errResponse){
                    console.log("PROCESS ERROR: " + errResponse);
                }
            );
        
    };        
    
    function showMessageAlert(mensaje) {      
        var alert = $mdDialog.alert({
            title: 'Actualizar Proceso.',
            textContent: mensaje,
            ok: 'ACEPTAR'
        });
        $mdDialog.show(alert).finally(function () {
            alert = undefined;
        });
    };
    
    function procesar() {                        
        updateProcess(self.typeCarga_Pref);        
    };
    
    function next() {                        
        $scope.$emit('StepNext', true);                        
    };        
    
}     
]);