myApp.controller('proyectoController', ['$scope','$log','$http', '$filter', '$window', function($scope, $log, $http, $filter, $window){
	$scope.cantidad_mostrar = 20;
	$scope.total_rows = 0;
	$scope.pages = 1;
	$scope.q = '';

    $scope.currentPage = 0;	



	$scope.filtrarProyecto = function(){
		$scope.consultarProyecto();
	};

	$scope.limpiarFiltro = function(){
		$scope.nombre_proyecto = '';
		$scope.proyecto_estado_id = 'all';
		$scope.cliente_id = 'all';
		$scope.numero_contrato = '';
		$scope.orden_compra = '';
		$scope.provincia_id = 'all';
		$scope.canton_id = 'all';
		$scope.distrito_id = 'all';		
		$scope.fecha_registro_from = '';
		$scope.fecha_registro_to = '';		
		$scope.fecha_firma_contrato_from = '';
		$scope.fecha_firma_contrato_to = '';		
		$scope.fecha_inicio_from = '';
		$scope.fecha_inicio_to = '';	
		$scope.fecha_entrega_estimada_from = '';
		$scope.fecha_entrega_estimada_to = '';
		$scope.consultarProyecto();	
	}

	$scope.consultarProyecto = function(){
		$http({
			url: BASE_URL + 'proyecto/consultaProyectosAjax/',
	        method: "POST",
	        data: {  filtros: { 
									nombre_proyecto: $scope.nombre_proyecto, 
									proyecto_estado_id: $scope.proyecto_estado_id, 
									cliente_id: $scope.cliente_id,
									numero_contrato: $scope.numero_contrato,
									orden_compra: $scope.orden_compra,
									provincia_id: $scope.provincia_id,
									canton_id: $scope.canton_id,
									distrito_id: $scope.distrito_id,
									fecha_registro: {
										from: $scope.fecha_registro_from,
										to: $scope.fecha_registro_to,
									},
									fecha_firma_contrato: {
										from: $scope.fecha_firma_contrato_from,
										to: $scope.fecha_firma_contrato_to,
									},
									fecha_inicio: {
										from: $scope.fecha_inicio_from,
										to: $scope.fecha_inicio_to,
									},
									fecha_entrega_estimada: {
										from: $scope.fecha_entrega_estimada_from,
										to: $scope.fecha_entrega_estimada_to,
									},
								},
								cantidad_mostrar: $scope.cantidad_mostrar,
	    			},
	    })
		.then(function(result){
			//$log.log(result.data);
			if (result.data !== "false") {
				$scope.proyectos = result.data.datos;
				$scope.total_rows = result.data.total_rows;
				$scope.calcularPaginas();
			} else {
				$scope.proyectos = false;
			}
		},function(result){
			$log.error(result);
		});
	}

	$scope.validarPrev = function(){
		if($scope.currentPage > 0){
			return false;
		}else{
			return	true;
		}
	}

	$scope.validarNext = function(){
		if($scope.currentPage >= ($scope.pages-1)){
			return true;
		}else{
			return	false;
		}
	}

	$scope.pagePrev = function(){
		$scope.currentPage = $scope.currentPage-1;
	}

	$scope.pageNext = function(){
		$scope.currentPage = $scope.currentPage+1;
	}

	$scope.calcularPaginas =  function(){
		if($scope.total_rows > $scope.cantidad_mostrar){
			$scope.pages = Math.ceil($scope.total_rows / $scope.cantidad_mostrar);
		}
	}

	$scope.consultarProyecto();



	$scope.getCantones = function(){
		$scope.canton_id = 'all';
		$scope.distrito_id = 'all';
		$scope.consultarCantones();
	}

	$scope.getDistritos = function(){
		$scope.distrito_id = 'all';
		$scope.consultarDistritos();
	}

	$scope.consultarCantones = function(){
		if($scope.provincia_id!='none'){
			$http({
				url: BASE_URL + 'proyecto/consultaCantonesAjax/',
		        method: "POST",
		        data: {  provincia_id: $scope.provincia_id },
		    })
			.then(function(result){
				$scope.cantones = result.data.datos;
			},function(result){
				$scope.cantones = '';
				$log.error(result);
			});
			
		}else{
			$scope.cantones = '';
		}
	}


	$scope.consultarDistritos = function(){
		if($scope.canton_id!='none'){
			$http({
				url: BASE_URL + 'proyecto/consultaDistritosAjax/',
		        method: "POST",
		        data: {  canton_id: $scope.canton_id },
		    })
			.then(function(result){
				$scope.distritos = result.data.datos;
			},function(result){
				$scope.distritos = '';
				$log.error(result);
			});
		}else{
			$scope.distritos = '';
		}
	}


	$scope.borrarRow = function(row_id){
		$http({
			url: BASE_URL + 'proyecto/eliminarProyectoAjax/',
	        method: "POST",
	        data: {  proyecto_id: row_id },
	    })
		.then(function(result){
			if(result.data!=="false"){
				$window.location.href ='/controlcostos/proyectos';
				return true;

			}else{
				$window.location.href = '/controlcostos/proyectos';
				return false;
			}
		},function(result){
			$log.error(result);
		});
	}

}]);

myApp.controller('agregarProyectoController', ['$scope','$log','$http', '$filter', '$window', function($scope, $log, $http, $filter, $window){

	//Variables
	$scope.valor_utilidad = 0;
	$scope.valor_materiales = 0;
	$scope.valor_mano_obra = 0;
	$scope.valor_gastos_operacion = 0;
	$scope.valor_gastos_administrativos = 0;
	$scope.total_oferta = 0;

	$scope.getCantones = function(){
		$scope.canton_id = '';
		$scope.distrito_id = '';
		$scope.consultarCantones();
	}

	$scope.getDistritos = function(){
		$scope.distrito_id = '';
		$scope.consultarDistritos();
	}

	$scope.updateValorOferta = function(){
		$scope.calcularValorOferta();
	}

	$scope.consultarCantones = function(){
		if($scope.provincia_id!='none'){
			$http({
				url: BASE_URL + 'proyecto/consultaCantonesAjax/',
		        method: "POST",
		        data: {  provincia_id: $scope.provincia_id },
		    })
			.then(function(result){
				$scope.cantones = result.data.datos;
			},function(result){
				$scope.cantones = '';
				$log.error(result);
			});
			
		}else{
			$scope.cantones = '';
		}
	}


	$scope.consultarDistritos = function(){
		if($scope.canton_id!='none'){
			$http({
				url: BASE_URL + 'proyecto/consultaDistritosAjax/',
		        method: "POST",
		        data: {  canton_id: $scope.canton_id },
		    })
			.then(function(result){
				$scope.distritos = result.data.datos;
			},function(result){
				$scope.distritos = '';
				$log.error(result);
			});
		}else{
			$scope.distritos = '';
		}
	}

	$scope.calcularValorOferta = function(){
		var valMateriales = ($scope.valor_materiales)?$scope.valor_materiales.toString().replace(' ',''):0;
		var valManoObra = ($scope.valor_mano_obra)?$scope.valor_mano_obra.toString().replace(' ',''):0;
		var valGastosOpe = ($scope.valor_gastos_operacion)?$scope.valor_gastos_operacion.toString().replace(' ',''):0;
		var valGastosAdm = ($scope.valor_gastos_administrativos)?$scope.valor_gastos_administrativos.toString().replace(' ',''):0;
		var valUtilidad = ($scope.valor_utilidad)?$scope.valor_utilidad.toString().replace(' ',''):0;
		if(valMateriales!='' || valManoObra!='' || valGastosOpe!='' || valGastosAdm!='' ||valUtilidad!=''){
			return parseFloat(valMateriales) + parseFloat(valManoObra) + parseFloat(valGastosOpe) + parseFloat(valGastosAdm) + parseFloat(valUtilidad);
		}else{
			return 0;
		}
	}

}]);


myApp.controller('editarProyectoController', ['$scope','$log','$http', '$filter', '$window', function($scope, $log, $http, $filter, $window){

	//Variables


	$scope.getCantones = function(){
		$scope.canton_id = '';
		$scope.distrito_id = '';
		$scope.consultarCantones();
	}

	$scope.getDistritos = function(){
		$scope.distrito_id = '';
		$scope.consultarDistritos();
	}

	$scope.updateValorOferta = function(){
		$scope.calcularValorOferta();
	}

	$scope.consultarCantones = function(){
		if($scope.provincia_id!='none'){
			$http({
				url: BASE_URL + 'proyecto/consultaCantonesAjax/',
		        method: "POST",
		        data: {  provincia_id: $scope.provincia_id },
		    })
			.then(function(result){
				$scope.cantones = result.data.datos;
			},function(result){
				$scope.cantones = '';
				$log.error(result);
			});
			
		}else{
			$scope.cantones = '';
		}
	}


	$scope.consultarDistritos = function(){
		if($scope.canton_id!='none'){
			$http({
				url: BASE_URL + 'proyecto/consultaDistritosAjax/',
		        method: "POST",
		        data: {  canton_id: $scope.canton_id },
		    })
			.then(function(result){
				$scope.distritos = result.data.datos;
			},function(result){
				$scope.distritos = '';
				$log.error(result);
			});
		}else{
			$scope.distritos = '';
		}
	}

	$scope.calcularValorOferta = function(){
		var valMateriales = ($scope.valor_materiales)?$scope.valor_materiales.toString().replace(' ',''):0;
		var valManoObra = ($scope.valor_mano_obra)?$scope.valor_mano_obra.toString().replace(' ',''):0;
		var valGastosOpe = ($scope.valor_gastos_operacion)?$scope.valor_gastos_operacion.toString().replace(' ',''):0;
		var valGastosAdm = ($scope.valor_gastos_administrativos)?$scope.valor_gastos_administrativos.toString().replace(' ',''):0;
		var valUtilidad = ($scope.valor_utilidad)?$scope.valor_utilidad.toString().replace(' ',''):0;
		if(valMateriales!='' || valManoObra!='' || valGastosOpe!='' || valGastosAdm!='' ||valUtilidad!=''){
			return parseFloat(valMateriales) + parseFloat(valManoObra) + parseFloat(valGastosOpe) + parseFloat(valGastosAdm) + parseFloat(valUtilidad);
		}else{
			return 0;
		}
	}

}]);


myApp.controller('proyectoDashboard', ['$scope','$log','$http', '$filter', '$window', function($scope, $log, $http, $filter, $window){
	$scope.datasetOverride = {
	    backgroundColor: ['#F20600', '#2915A8', '#0A920A', '#DFDF00', '#DD0C82', '#0EA1BD', '#8A14C6', '#FF7B0E'],
	    hoverBackgroundColor: ['#C00500', '#1F0F85', '#007700', '#BDBD35', '#920153', '#045F70', '#520779', '#B65402'],
	    hoverBorderColor: ['#C00500', '#1F0F85', '#007700', '#BDBD35', '#920153', '#045F70', '#520779', '#B65402']
	};
	var pieOptions = {
	  legend: {
	            display: true,
	            position: 'bottom',
	        },
	  /*animation: {
	    duration: 500,
	    easing: "easeOutQuart",
	    onComplete: function () {
	      var ctx = this.chart.ctx;
	      ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontFamily, 'normal', Chart.defaults.global.defaultFontFamily);
	      ctx.textAlign = 'center';
	      ctx.textBaseline = 'bottom';

	      this.data.datasets.forEach(function (dataset) {

	        for (var i = 0; i < dataset.data.length; i++) {
	          var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model,
	              total = dataset._meta[Object.keys(dataset._meta)[0]].total,
	              mid_radius = model.innerRadius + (model.outerRadius - model.innerRadius)/2,
	              start_angle = model.startAngle,
	              end_angle = model.endAngle,
	              mid_angle = start_angle + (end_angle - start_angle)/2;

	          var x = mid_radius * Math.cos(mid_angle);
	          var y = mid_radius * Math.sin(mid_angle);

	          ctx.fillStyle = '#fff';
	          if (i == 3){ // Darker text color for lighter background
	            ctx.fillStyle = '#444';
	          }
	          var percent = String(Math.round(dataset.data[i]/total*100)) + "%";
	          ctx.fillText('$ '+dataset.data[i], model.x + x, model.y + y);
	          // Display percent in another line, line break doesn't work for fillText
	          ctx.fillText(percent, model.x + x, model.y + y + 15);
	        }
	      });               
	    }
	  },*/
	  	tooltips: {
			callbacks: {
				label: function(tooltipItem, data) {
					var allData = data.datasets[tooltipItem.datasetIndex].data;
					var tooltipLabel = data.labels[tooltipItem.index];
					var tooltipData = allData[tooltipItem.index];
					var total = 0;
					for (var i in allData) {
						total += allData[i];
					}
					var tooltipPercentage = Math.round((tooltipData / total) * 100);
					return tooltipLabel + ': $ ' + parseFloat(tooltipData).toFixed(2)  + ' (' + tooltipPercentage + '%)';
				}
			}
		},
		backgroundColor: ['rgba(151,187,205,0.7)', 'rgba(220,220,220,0.7)', 'rgba(247,70,740, 0.7)', 'rgba(70,191,189,0.7)', 'rgba(253,180,92,0.7)', 'rgba(148,159,177,0.7)', 'rgba(77,83,96,0.7)'],
	};


	// Valor de oferta
	$scope.total_valor_oferta = 0;
	$scope.total_valor_oferta_colones = 0;
	$scope.data_chart_valor_oferta = { 
		labels: [], 
		data: [], 
		options : pieOptions,
	};
	$scope.data_valor_oferta = {};

	// Valor de gastos
	$scope.total_gastos = 0;
	$scope.data_chart_gastos = { 
		labels: [], 
		data: [], 
		options : pieOptions,
	};
	$scope.data_gastos = {};

	// Valor de utilidad
	$scope.total_utilidad = 0;	
	$scope.data_utilidad = {};



	$scope.consultarInfoProyecto = function (){
		$http({
			url: BASE_URL + 'proyecto/consultaProyectoInfoAjax/',
	        method: "POST",
	        data: {  proyecto_id : $scope.proyecto_id, }
	    })
		.then(function(result){
			for(var x in result.data.valor_oferta.desgloce){
				$scope.data_chart_valor_oferta.labels.push(result.data.valor_oferta.desgloce[x].tipo);
				$scope.data_chart_valor_oferta.data.push(result.data.valor_oferta.desgloce[x].valor);
			}

			$scope.data_valor_oferta = result.data.valor_oferta.desgloce;
			$scope.total_valor_oferta = result.data.valor_oferta.total;
			$scope.total_valor_oferta_colones = result.data.valor_oferta.total_colones;


			for(var x in result.data.gastos.desgloce){
				$scope.data_chart_gastos.labels.push(result.data.gastos.desgloce[x].tipo);
				$scope.data_chart_gastos.data.push(result.data.gastos.desgloce[x].valor);
			}

			$scope.data_gastos = result.data.gastos.desgloce;
			$scope.total_gastos = result.data.gastos.total;
			$scope.total_gastos_colones = result.data.gastos.total_colones;

			
			$scope.total_utilidad = result.data.valor_oferta.total - result.data.gastos.total;

			
			$scope.data_tiempo_colaboradores = result.data.tiempo_colaboradores;

			
		},function(result){
			$log.error(result);
		});
	}

	$scope.borrarRow = function(row_id){
		$http({
			url: BASE_URL + 'proyecto/eliminarProyectoAjax/',
	        method: "POST",
	        data: {  proyecto_id: row_id },
	    })
		.then(function(result){
			if(result.data!=="false"){
				$window.location.href ='/controlcostos/proyectos';
				return true;

			}else{
				$window.location.href = '/controlcostos/proyectos';
				return false;
			}
		},function(result){
			$log.error(result);
		});
	}

}]);


myApp.controller('proyectoExtensionesController', ['$scope','$log','$http', '$filter', '$window', function($scope, $log, $http, $filter, $window){
	$scope.cantidad_mostrar = 20;
	$scope.total_rows = 0;
	$scope.pages = 1;
	$scope.q = '';

    $scope.currentPage = 0;	

    $scope.proyecto_valor_oferta_extension_tipo_id = 'all';		
	$scope.fecha_registro_from = '';
	$scope.fecha_registro_to = '';	

    $scope.filtrar = function(){
		$scope.consultarExtensionesProyecto();
	};

	$scope.limpiarFiltro = function(){
		$scope.proyecto_valor_oferta_extension_tipo_id = 'all';		
		$scope.fecha_registro_from = '';
		$scope.fecha_registro_to = '';		
		$scope.consultarExtensionesProyecto();	
	}



	$scope.consultarExtensionesProyecto = function(){
		$http({
			url: BASE_URL + 'proyecto/consultaExtensionesProyectosAjax/',
	        method: "POST",
	        data: {  filtros: { 
									proyecto_id: $scope.proyecto_id,
									proyecto_valor_oferta_extension_tipo_id: $scope.proyecto_valor_oferta_extension_tipo_id,
									fecha_registro: {
										from: $scope.fecha_registro_from,
										to: $scope.fecha_registro_to,
									}, 									
								},
								cantidad_mostrar: $scope.cantidad_mostrar,
	    			},
	    })
		.then(function(result){
			if(result.data!=="false"){
				$scope.extensiones = result.data.datos;
				$scope.total_rows = result.data.total_rows;
				$scope.calcularPaginas();

			}else{
				$scope.extensiones = false;
			}
		},function(result){
			$log.error(result);
		});
	}

	$scope.validarPrev = function(){
		if($scope.currentPage > 0){
			return false;
		}else{
			return	true;
		}
	}

	$scope.validarNext = function(){
		if($scope.currentPage >= ($scope.pages-1)){
			return true;
		}else{
			return	false;
		}
	}

	$scope.pagePrev = function(){
		$scope.currentPage = $scope.currentPage-1;
	}

	$scope.pageNext = function(){
		$scope.currentPage = $scope.currentPage+1;
	}

	$scope.calcularPaginas =  function(){
		if($scope.total_rows > $scope.cantidad_mostrar){
			$scope.pages = Math.ceil($scope.total_rows / $scope.cantidad_mostrar);
		}
	}

	$scope.borrarRow = function(row_id){
		$http({
			url: BASE_URL + 'proyecto/eliminarExtensionAjax/',
	        method: "POST",
	        data: {  extension_id: row_id },
	    })
		.then(function(result){
			if(result.data!=="false"){
				$window.location.reload();
				return true;

			}else{
				$window.location.reload();
				return false;
			}
		},function(result){
			$log.error(result);
		});
	}

}]);

myApp.controller('agregarExtensionProyecto', ['$scope', '$log', '$http', '$filter', '$window', function ($scope, $log, $http, $filter, $window) {

}]);

myApp.controller('editarExtensionProyecto', ['$scope', '$log', '$http', '$filter', '$window', function ($scope, $log, $http, $filter, $window) {
	$scope.cantidad_mostrar = 20;
	$scope.total_rows = 0;
	$scope.pages = 1;
	$scope.q = '';
	$scope.bloqueo_button_email = false;

	$scope.currentPage = 0;


	$scope.filtrar = function () {
		$scope.consultarExtensionCambiosProyecto();
	};

	$scope.limpiarFiltro = function () {
		$scope.consultarExtensionCambiosProyecto();
	}



	$scope.consultarExtensionCambiosProyecto = function () {
		$http({
			url: BASE_URL + 'proyecto/consultarExtensionCambiosProyectoAjax/',
			method: "POST",
			data: {
				filtros: {
					proyecto_valor_oferta_id: $scope.proyecto_valor_oferta_id,
				},
				cantidad_mostrar: $scope.cantidad_mostrar,
			},
		})
			.then(function (result) {
				if (result.data !== "false") {
					if (result.data.cambios !== false) {
						$scope.cambios = result.data.cambios.datos;
						$scope.total_rows = result.data.cambios.total_rows;
						$scope.calcularPaginas();
					} else {
						$scope.cambios = false;
					}

					if (result.data.cambios_totales !== false) {
						$scope.cambios_totales = result.data.cambios_totales;
					} else {
						$scope.cambios_totales = false;
					}


				} else {
					$scope.cambios = false;
					$scope.cambios_totales = false;
				}
			}, function (result) {
				$log.error(result);
			});
	}

	$scope.validarPrev = function () {
		if ($scope.currentPage > 0) {
			return false;
		} else {
			return true;
		}
	}

	$scope.validarNext = function () {
		if ($scope.currentPage >= ($scope.pages - 1)) {
			return true;
		} else {
			return false;
		}
	}

	$scope.pagePrev = function () {
		$scope.currentPage = $scope.currentPage - 1;
	}

	$scope.pageNext = function () {
		$scope.currentPage = $scope.currentPage + 1;
	}

	$scope.calcularPaginas = function () {
		if ($scope.total_rows > $scope.cantidad_mostrar) {
			$scope.pages = Math.ceil($scope.total_rows / $scope.cantidad_mostrar);
		}
	}

	$scope.borrarRow = function (row_id) {
		$http({
			url: BASE_URL + 'proyecto/eliminarExtensionCambioAjax/',
			method: "POST",
			data: { proyecto_valor_oferta_extension_cambio_id: row_id },
		})
			.then(function (result) {
				if (result.data !== "false") {
					$window.location.reload();
					return true;

				} else {
					$window.location.reload();
					return false;
				}
			}, function (result) {
				$log.error(result);
			});
	}

	$scope.enviarCorreos = function() {
		$scope.bloqueo_button_email = true;
		$http({
			url: BASE_URL + 'proyecto/enviarCorreoContactoExtensionAjax/',
			method: "POST",
			data: { 
				proyecto_id: $scope.proyecto_id, 
				proyecto_valor_oferta_id: $scope.proyecto_valor_oferta_id,
				correos_seleccionados: $scope.correo_envio,
			},
		})
			.then(function (result) {
				if (result.data !== "false") {
					//$window.location.reload();
					$scope.bloqueo_button_email = false;
					return true;

				} else {
					//$window.location.reload();
					$scope.bloqueo_button_email = false;
					return false;
				}
			}, function (result) {
				$log.error(result);
			});
	}

}]);

myApp.controller('agregarExtensionCambioProyecto', ['$scope', '$log', '$http', '$filter', '$window', '$timeout', function ($scope, $log, $http, $filter, $window, $timeout) {
	$scope.moneda_id = 1;
	$scope.cantidad = 1;

	$scope.calcularTotal = function() {
		if ($scope.cantidad == 0){
			$scope.cantidad = 1;
		}
		if ($scope.precio_unitario !== undefined && $scope.precio_unitario !== '' && Number(String($scope.precio_unitario).replace(/[^0-9.-]+/g, "")) > 0) {
			$scope.total = Number(String($scope.precio_unitario).replace(/[^0-9.-]+/g, "")) * $scope.cantidad;
		}
	}

	$scope.calcularUnitario = function () {
		if ($scope.cantidad == 0) {
			$scope.cantidad = 1;
		}
		
		if ($scope.total !== undefined && $scope.total !== '' && Number(String($scope.total).replace(/[^0-9.-]+/g, "")) > 0) {
			$scope.precio_unitario =Number(String($scope.total).replace(/[^0-9.-]+/g, "")) / $scope.cantidad;
		}
	}

	$scope.inputMask = function () {
		$timeout(function () {
			jQuery(".input-money-mask").maskMoney({ prefix: '$ ', allowNegative: true, thousands: '', decimal: '.', affixesStay: false });
			jQuery(".input-money-mask-colones").maskMoney({ prefix: '₡ ', allowNegative: true, thousands: '', decimal: '.', affixesStay: false });

		}, 1);
	}

	$scope.chosenSelect = function () {
		$timeout(function () {
			jQuery(".chosen-select").chosen({ no_results_text: "Sin resultados." });
		}, 1);
	}
}]);

myApp.controller('editarExtensionCambioProyecto', ['$scope', '$log', '$http', '$filter', '$window', '$timeout', function ($scope, $log, $http, $filter, $window, $timeout) {

	$scope.calcularTotal = function () {
		if ($scope.cantidad == 0) {
			$scope.cantidad = 1;
		}
		if ($scope.precio_unitario !== undefined && $scope.precio_unitario !== '' && Number(String($scope.precio_unitario).replace(/[^0-9.-]+/g, "")) > 0) {
			$scope.total = Number(String($scope.precio_unitario).replace(/[^0-9.-]+/g, "")) * $scope.cantidad;
		}
	}

	$scope.calcularUnitario = function () {
		if ($scope.cantidad == 0) {
			$scope.cantidad = 1;
		}

		if ($scope.total !== undefined && $scope.total !== '' && Number(String($scope.total).replace(/[^0-9.-]+/g, "")) > 0) {
			$scope.precio_unitario = Number(String($scope.total).replace(/[^0-9.-]+/g, "")) / $scope.cantidad;
		}
	}

	$scope.inputMask = function () {
		$timeout(function () {
			jQuery(".input-money-mask").maskMoney({ prefix: '$ ', allowNegative: true, thousands: '', decimal: '.', affixesStay: false });
			jQuery(".input-money-mask-colones").maskMoney({ prefix: '₡ ', allowNegative: true, thousands: '', decimal: '.', affixesStay: false });

		}, 1);
	}

	$scope.chosenSelect = function () {
		$timeout(function () {
			jQuery(".chosen-select").chosen({ no_results_text: "Sin resultados." });
		}, 1);
	}
}]);

myApp.controller('proyectoContactosController', ['$scope', '$log', '$http', '$filter', '$window', function ($scope, $log, $http, $filter, $window) {
	$scope.total_rows = 0;
	$scope.q = '';


	$scope.consultarContactosProyecto = function () {
		$http({
			url: BASE_URL + 'proyecto/consultaContactosProyectosAjax/',
			method: "POST",
			data: {
				filtros: {
					proyecto_id: $scope.proyecto_id,
				},
			},
		})
			.then(function (result) {
				if (result.data !== "false") {
					$scope.contactos = result.data.datos;
					$scope.total_rows = result.data.total_rows;

				} else {
					$scope.contactos = false;
				}
			}, function (result) {
				$log.error(result);
			});
	}



	$scope.borrarRow = function (row_id) {
		$http({
			url: BASE_URL + 'proyecto/eliminarContactoAjax/',
			method: "POST",
			data: { contacto_id: row_id, proyecto_id: $scope.proyecto_id },
		})
			.then(function (result) {
				if (result.data !== "false") {
					$window.location.reload();
					return true;

				} else {
					$window.location.reload();
					return false;
				}
			}, function (result) {
				$log.error(result);
			});
	}

}]);

myApp.controller('proyectoGastosController', ['$scope','$log','$http', '$filter', '$window','$timeout', function($scope, $log, $http, $filter, $window, $timeout){
	$scope.cantidad_mostrar = 20;
	$scope.total_rows = 0;
	$scope.pages = 1;
	$scope.q = '';

    $scope.currentPage = 0;	


    $scope.proyecto_gasto_tipo_id = 'all';
    $scope.proveedor_id = 'all';
	$scope.proyecto_gasto_estado_id = 'all';		
	$scope.numero_factura = '';
	$scope.fecha_registro_from = '';
	$scope.fecha_registro_to = '';
	$scope.fecha_gasto_from = '';
	$scope.fecha_gasto_to = '';	

    $scope.filtrar = function(){
		$scope.consultarGastosProyecto();
	};

	$scope.limpiarFiltro = function(){
		$scope.proyecto_gasto_tipo_id = 'all';
		$scope.proveedor_id = 'all';
		$scope.proyecto_gasto_estado_id = 'all';		
		$scope.numero_factura = '';
		$scope.fecha_registro_from = '';
		$scope.fecha_registro_to = '';		
		$scope.fecha_gasto_from = '';
		$scope.fecha_gasto_to = '';	
		$scope.consultarGastosProyecto();	
	}

	$scope.consultarGastosProyecto = function(){
		$http({
			url: BASE_URL + 'proyecto/consultaGastosProyectosAjax/',
	        method: "POST",
	        data: {  filtros: { 
									proyecto_id: $scope.proyecto_id, 
									proyecto_gasto_tipo_id: $scope.proyecto_gasto_tipo_id,
									fecha_registro: {
										from: $scope.fecha_registro_from,
										to: $scope.fecha_registro_to,
									},
									fecha_gasto: {
										from: $scope.fecha_gasto_from,
										to: $scope.fecha_gasto_to,
									},
									proveedor_id: $scope.proveedor_id,
									numero_factura: $scope.numero_factura,
									proyecto_gasto_estado_id: $scope.proyecto_gasto_estado_id,									
								},
								cantidad_mostrar: $scope.cantidad_mostrar,
	    			},
	    })
		.then(function(result){
			if(result.data!=="false"){
				$scope.gastos = result.data.datos;
				$scope.total_rows = result.data.total_rows;
				$scope.currentPage = 0;	
				$scope.calcularPaginas();
			}else{
				$scope.gastos = false;
			}
		},function(result){
			$log.error(result);
		});
	}

	$scope.validarPrev = function(){
		if($scope.currentPage > 0){
			return false;
		}else{
			return	true;
		}
	}

	$scope.validarNext = function(){
		if($scope.currentPage >= ($scope.pages-1)){
			return true;
		}else{
			return	false;
		}
	}

	$scope.pagePrev = function(){
		$scope.currentPage = $scope.currentPage-1;
	}

	$scope.pageNext = function(){
		$scope.currentPage = $scope.currentPage+1;
	}

	$scope.calcularPaginas =  function(){
		if($scope.total_rows > $scope.cantidad_mostrar){
			$scope.pages = Math.ceil($scope.total_rows / $scope.cantidad_mostrar);
		}
	}

	$scope.borrarRow = function(row_id){
		$http({
			url: BASE_URL + 'proyecto/eliminarGastoAjax/',
	        method: "POST",
	        data: {  gasto_id: row_id },
	    })
		.then(function(result){
			if(result.data!=="false"){
				$window.location.reload();
				return true;

			}else{
				$window.location.reload();
				return false;
			}
		},function(result){
			$log.error(result);
		});
	}


	$scope.inputMask = function(){
		$timeout(function(){
			jQuery(".input-money-mask").maskMoney({prefix:'$ ', allowNegative: true, thousands:' ', decimal:'.', affixesStay: false});
			jQuery(".input-money-mask-colones").maskMoney({prefix:'₡ ', allowNegative: true, thousands:' ', decimal:'.', affixesStay: false});
			
		},1);
	}

	$scope.chosenSelect = function(){
		$timeout(function(){
			jQuery(".chosen-select").chosen({no_results_text: "Sin resultados."}); 
		},1);
	}

}]);

myApp.controller('agregarProyectoGastoController', ['$scope','$log','$http', '$filter', '$window', '$timeout', function($scope, $log, $http, $filter, $window, $timeout){
	$scope.moneda_id = 1;



	$scope.inputMask = function(){
		$timeout(function(){
			jQuery(".input-money-mask").maskMoney({prefix:'$ ', allowNegative: true, thousands:' ', decimal:'.', affixesStay: false});
			jQuery(".input-money-mask-colones").maskMoney({prefix:'₡ ', allowNegative: true, thousands:' ', decimal:'.', affixesStay: false});
			
		},1);
	}

	$scope.chosenSelect = function(){
		$timeout(function(){
			jQuery(".chosen-select").chosen({no_results_text: "Sin resultados."}); 
		},1);
	}

}]);

myApp.controller('editarProyectoGastoController', ['$scope','$log','$http', '$filter', '$window', '$timeout', function($scope, $log, $http, $filter, $window, $timeout){
	$scope.moneda_id = 1;



	$scope.inputMask = function(){
		$timeout(function(){
			jQuery(".input-money-mask").maskMoney({prefix:'$ ', allowNegative: true, thousands:' ', decimal:'.', affixesStay: false});
			jQuery(".input-money-mask-colones").maskMoney({prefix:'₡ ', allowNegative: true, thousands:' ', decimal:'.', affixesStay: false});
			
		},1);
	}

	$scope.chosenSelect = function(){
		$timeout(function(){
			jQuery(".chosen-select").chosen({no_results_text: "Sin resultados."}); 
		},1);
	}

}]);



myApp.controller('proyectoColaboradoresController', ['$scope', '$log', '$http', '$filter', '$window', '$timeout', function ($scope, $log, $http, $filter, $window, $timeout) {
	$scope.cantidad_mostrar = 20;
	$scope.total_rows = 0;
	$scope.pages = 1;
	$scope.q = '';
	$scope.currentPage = 0;
	
	$scope.colaboradores = {};

	
	
	$scope.consultarColaboradoresProyecto = function () {
		$http({
			url: BASE_URL + 'proyecto/consultaColaboradoresActivosProyectoAjax/',
			method: "POST",
			data: {
				proyecto_id: $scope.proyecto_id,				
				cantidad_mostrar: $scope.cantidad_mostrar,
			},
		})
			.then(function (result) {
				if (result.data.colaboradores_proyecto !== false) {
					//$log.log(result.data);					
					$scope.colaboradores = result.data.colaboradores_proyecto.datos;
					$scope.total_rows = result.data.colaboradores_proyecto.total_rows;
					$scope.currentPage = 0;
					$scope.calcularPaginas();
				} else {
					$scope.colaboradores = false;
				}
			}, function (result) {
				$log.error(result);
			});
	}

	$scope.validarPrev = function () {
		if ($scope.currentPage > 0) {
			return false;
		} else {
			return true;
		}
	}

	$scope.validarNext = function () {
		if ($scope.currentPage >= ($scope.pages - 1)) {
			return true;
		} else {
			return false;
		}
	}

	$scope.pagePrev = function () {
		$scope.currentPage = $scope.currentPage - 1;
	}

	$scope.pageNext = function () {
		$scope.currentPage = $scope.currentPage + 1;
	}

	$scope.calcularPaginas = function () {
		if ($scope.total_rows > $scope.cantidad_mostrar) {
			$scope.pages = Math.ceil($scope.total_rows / $scope.cantidad_mostrar);
		}
	}

}]);


myApp.controller('editarProyectoColaboradoresController', ['$scope', '$log', '$http', '$filter', '$window', '$timeout', function ($scope, $log, $http, $filter, $window, $timeout) {
	$scope.colaboradoresCurrent = {};
	$scope.colaboradores_proyecto = {};
	$scope.colaboradores = {};
	$scope.resultado_insert = '';
	$scope.colaborador_nuevo_id = '';

	
	
	$scope.consultarColaboradores = function(){
		$scope.consultarColaboradoresProyecto();
	}
	

	$scope.consultarColaboradoresProyecto = function () {
		$http({
			url: BASE_URL + 'proyecto/consultaColaboradoresProyectoAjax/',
			method: "POST",
			data: {
				proyecto_id: $scope.proyecto_id,
			},
		})
		.then(function (result) {
			if (result.data.colaboradores !== false) {
				//$scope.colaboradores = result.data.colaboradores;
				$log.log(result.data.colaboradores_proyecto.datos);
				$scope.colaboradores_proyecto = result.data.colaboradores_proyecto.datos;
			} else {
				$scope.colaboradores_proyecto = false;
			}
		}, function (result) {
			$log.error(result);
		});
	}

	$scope.agregarColaboradorNuevo = function(){
		if ($scope.colaborador_nuevo_id!==''){
			$http({
				url: BASE_URL + 'proyecto/relacionarColaboradorProyecto/',
				method: "POST",
				data: {
					proyecto_id: $scope.proyecto_id,
					colaborador_id: $scope.colaborador_nuevo_id
				},
			})
			.then(function (result) {
				if (result.data !== "false") {
					$scope.resultado_insert = 'Colaborador relacionado con éxito';
					$scope.resultado_type = 'success';
					$timeout(function () {
						$window.location.reload();
					}, 2000);
				} else {
					$scope.resultado_insert = 'Hubo un error al relacionar el colaborador al proyecto';
					$scope.resultado_type = 'danger';
					$timeout(function () {
						$window.location.reload();
					}, 2000);
				}
				$scope.consultarColaboradoresProyecto();
			}, function (result) {
				$log.error(result);
			});
			
			$timeout(function () {
				$scope.resultado_insert = '';
			}, 5000);
			
		}else{
			$scope.resultado_insert = 'Debe seleccionar un colaborador de la lista';
			$scope.resultado_type = 'warning';
			$timeout(function(){
				$scope.resultado_insert = '';
			},5000);
		}
	}

	$scope.addRow = function (row_id) {
		$http({
			url: BASE_URL + 'proyecto/relacionarColaboradorProyecto/',
			method: "POST",
			data: { colaborador_id: row_id, proyecto_id: $scope.proyecto_id },
		})
		.then(function (result) {
			if (result.data !== "false") {
				$scope.resultado_insert = 'Colaborador relacionado con éxito al proyecto nuevamente';
				$scope.resultado_type = 'success';
				$timeout(function () {
					$window.location.reload();
				}, 2000);
			} else {
				$scope.resultado_insert = 'Hubo un error al relacionar el colaborador al proyecto';
				$scope.resultado_type = 'danger';
				$timeout(function () {
					$window.location.reload();
				}, 2000);
			}
			$scope.consultarColaboradoresProyecto();
		}, function (result) {
			$log.error(result);
		});
	}

	$scope.borrarRow = function (row_id) {
		$http({
			url: BASE_URL + 'proyecto/removerColaboradorProyectoAjax/',
			method: "POST",
			data: { colaborador_id: row_id, proyecto_id: $scope.proyecto_id },
		})
			.then(function (result) {
				if (result.data !== "false") {
					$window.location.reload();
					return true;

				} else {
					$window.location.reload();
					return false;
				}
			}, function (result) {
				$log.error(result);
			});
	}

	
	$scope.chosenSelect = function () {
		$timeout(function () {
			jQuery(".chosen-select").chosen({ no_results_text: "Sin resultados." });
		}, 1);
	}

}]);

myApp.controller('registrarTiempoColaboradoresController', ['$scope', '$log', '$http', '$filter', '$window', '$timeout', function ($scope, $log, $http, $filter, $window, $timeout) {
	$scope.colaboradoresCurrent = {};
	$scope.colaboradores_proyecto = {};
	$scope.colaboradores = {};
	$scope.resultado_insert = '';
	$scope.colaborador_nuevo_id = '';
	$scope.today = true;
	$scope.loader = false;

	var todayDate = new Date();
	var dd = todayDate.getDate();
	var mm = todayDate.getMonth() + 1; //January is 0!
	var yyyy = todayDate.getFullYear();

	if (dd < 10) {
		dd = '0' + dd
	}

	if (mm < 10) {
		mm = '0' + mm
	}

	var today = dd + '/' + mm + '/' + yyyy;

	$scope.fecha_gasto = today;



	$scope.consultarTiempos = function () {
		$scope.consultarTiemposColaboradores();
	}

	
	$scope.consultarTiemposColaboradores = function () {
		$scope.loader = true;
		var todayDate = new Date();
		var dd = todayDate.getDate();
		var mm = todayDate.getMonth() + 1; //January is 0!
		var yyyy = todayDate.getFullYear();

		if (dd < 10) {
			dd = '0' + dd
		}

		if (mm < 10) {
			mm = '0' + mm
		}

		var today = dd + '/' + mm + '/' + yyyy;
		if($scope.fecha_gasto==today){
			$scope.today = true;
		}else{
			$scope.today = false;
		}

		$http({
			url: BASE_URL + 'proyecto/consultaTiemposColaboradoresAjax/',
			method: "POST",
			data: {
				proyecto_id: $scope.proyecto_id,
				fecha_gasto: $scope.fecha_gasto,
			},
		})
			.then(function (result) {
				if (result.data.colaboradores_tiempos !== false) {
					$scope.colaboradores_proyecto = result.data.colaboradores_tiempos;
				} else if (result.data.colaboradores_proyecto !== false) {
					$scope.colaboradores_proyecto = result.data.colaboradores_proyecto; 
				} else {
					$scope.colaboradores_proyecto = false;
				}
				$scope.loader = false;
			}, function (result) {
				$log.error(result);
				$scope.loader = false;
			});
	}

	

	$scope.chosenSelect = function () {
		$timeout(function () {
			jQuery(".chosen-select").chosen({ no_results_text: "Sin resultados." });
		}, 1);
	}


}]);

myApp.controller('registrarTiempoColaboradoresDashboardController', ['$scope', '$log', '$http', '$filter', '$window', '$timeout', function ($scope, $log, $http, $filter, $window, $timeout) {
	$scope.colaboradoresCurrent = {};
	$scope.colaboradores_proyecto = {};
	$scope.colaboradores = {};
	$scope.resultado_insert = '';
	$scope.colaborador_nuevo_id = '';
	$scope.today = true;
	$scope.loader = false;

	var todayDate = new Date();
	var dd = todayDate.getDate();
	var mm = todayDate.getMonth() + 1; //January is 0!
	var yyyy = todayDate.getFullYear();

	if (dd < 10) {
		dd = '0' + dd
	}

	if (mm < 10) {
		mm = '0' + mm
	}

	var today = dd + '/' + mm + '/' + yyyy;

	$scope.fecha_gasto = today;



	$scope.consultarTiempos = function () {
		$scope.consultarTiemposColaboradores();
	}


	$scope.consultarTiemposColaboradores = function () {
		$scope.loader = true;
		var todayDate = new Date();
		var dd = todayDate.getDate();
		var mm = todayDate.getMonth() + 1; //January is 0!
		var yyyy = todayDate.getFullYear();

		if (dd < 10) {
			dd = '0' + dd
		}

		if (mm < 10) {
			mm = '0' + mm
		}

		var today = dd + '/' + mm + '/' + yyyy;
		if ($scope.fecha_gasto == today) {
			$scope.today = true;
		} else {
			$scope.today = false;
		}

		$http({
			url: BASE_URL + 'proyecto/consultaTiemposColaboradoresAjax/',
			method: "POST",
			data: {
				proyecto_id: $scope.proyecto_id,
				fecha_gasto: $scope.fecha_gasto,
			},
		})
			.then(function (result) {
				$log.log(result.data);
				if (result.data.colaboradores_tiempos !== false) {
					$scope.colaboradores_proyecto = result.data.colaboradores_tiempos;
				} else if (result.data.colaboradores_proyecto !== false) {
					$scope.colaboradores_proyecto = result.data.colaboradores_proyecto;
				} else {
					$scope.colaboradores_proyecto = false;
				}
				$scope.loader = false;
			}, function (result) {
				$log.error(result);
				$scope.loader = false;
			});
	}



	$scope.chosenSelect = function () {
		$timeout(function () {
			jQuery(".chosen-select").chosen({ no_results_text: "Sin resultados." });
		}, 1);
	}


}]);


/* Para agregar mantenimiento de Tipos de orden de cambio */
myApp.controller('proyectoVerTiposOrdenCambio', ['$scope', '$log', '$http', '$filter', '$window', function ($scope, $log, $http, $filter, $window) {
    $scope.proyecto_valor_oferta_extension_tipo = '';
    $scope.cantidad_mostrar = 20;
    $scope.total_rows = 0;
    $scope.pages = 1;
    $scope.q = '';

    $scope.currentPage = 0;



    $scope.filtrarTipos = function () {
        $scope.consultarTipos();
    };

    $scope.consultarTipos = function () {
        $http({
			url: BASE_URL + 'proyecto/consultaTiposOrdenCambioAjax/',
            method: "POST",
            data: {
                filtros: {
                    proyecto_valor_oferta_extension_tipo: $scope.proyecto_valor_oferta_extension_tipo,
                },
                cantidad_mostrar: $scope.cantidad_mostrar,
            },
        })
            .then(function (result) {
                //$log.log(result);
                $scope.proyecto_valor_oferta_extension_tipos = result.data.datos;
                $scope.total_rows = result.data.total_rows;
                $scope.calcularPaginas();
            }, function (result) {
                $log.error(result);
            });
    }

    $scope.validarPrev = function () {
        if ($scope.currentPage > 0) {
            return false;
        } else {
            return true;
        }
    }

    $scope.validarNext = function () {
        if ($scope.currentPage >= ($scope.pages - 1)) {
            return true;
        } else {
            return false;
        }
    }

    $scope.pagePrev = function () {
        $scope.currentPage = $scope.currentPage - 1;
    }

    $scope.pageNext = function () {
        $scope.currentPage = $scope.currentPage + 1;
    }

    $scope.calcularPaginas = function () {
        if ($scope.total_rows > $scope.cantidad_mostrar) {
            $scope.pages = Math.ceil($scope.total_rows / $scope.cantidad_mostrar);
        }
    }

    $scope.consultarTipos();

    $scope.borrarRow = function (row_id) {
        $scope.error = false;
        $scope.error_message ='';
        $http({
			url: BASE_URL + 'proyecto/eliminarTiposOrdenCambioAjax/',
            method: "POST",
            data: { proyecto_valor_oferta_extension_tipo_id: row_id },
        })
            .then(function (result) {
                if (result.data !== "false") {
                    $window.location.href = '/controlcostos/proyectos/ordenes-cambio/tipos-orden-cambio';
                   return true;

                } else {
                    $scope.error = true;
                    $scope.error_message = 'No se puede eliminar el tipo de orden de cambio';
                    return false;
                }
            }, function (result) {
                $log.error(result);
            });
    }

   
}]);


myApp.controller('agregarTipoOrdenCambioController', ['$scope', '$log', '$http', '$filter', '$timeout', function ($scope, $log, $http, $filter, $timeout) {

}]);

myApp.controller('editarTipoOrdenCambioController', ['$scope', '$log', '$http', '$filter', '$timeout', function ($scope, $log, $http, $filter, $timeout) {

}]);



/* Para manejo de materiales */

myApp.controller('proyectoMaterialesController', ['$scope', '$log', '$http', '$filter', '$window', '$timeout', function ($scope, $log, $http, $filter, $window, $timeout) {
	$scope.materialesCurrent = {};
	$scope.materiales_iniciales_proyecto = [];
	$scope.materiales_extensiones_proyecto = [];
	$scope.materiales = {};
	$scope.editar_cantidad = {};
	$scope.guardando = {};
	$scope.proyecto_material_cantidad = {};
	$scope.proyecto_material_unidad = {};
	$scope.proyecto_material_comentario = {};
	$scope.resultado_insert = '';
	$scope.material_nuevo_id = '';
	$scope.agregar_material = false;

	
	$scope.consultarMateriales = function(){
		$scope.consultarMaterialesProyecto();
	}
	

	$scope.consultarMaterialesProyecto = function () {
		$http({
			url: BASE_URL + 'proyecto/consultarMaterialesActivosProyectoAjax/',
			method: "POST",
			data: {
				proyecto_id: $scope.proyecto_id,
			},
		})
		.then(function (result) {
			if (result.data.materiales_proyecto_activos !== false) {
				if (result.data.materiales_proyecto_activos.datos !== undefined){
					for (material_index in  result.data.materiales_proyecto_activos.datos){
						if (result.data.materiales_proyecto_activos.datos[material_index].proyecto_material_tipo == 1) {
							$scope.materiales_iniciales_proyecto.push(result.data.materiales_proyecto_activos.datos[material_index]);
						} else {
							$scope.materiales_extensiones_proyecto.push(result.data.materiales_proyecto_activos.datos[material_index]);
						}
					}
				} else {
					for (material_index in  result.data.materiales_proyecto_activos){
						if (result.data.materiales_proyecto_activos[material_index].proyecto_material_tipo == 1) {
							$scope.materiales_iniciales_proyecto.push(result.data.materiales_proyecto_activos[material_index]);
						} else {
							$scope.materiales_extensiones_proyecto.push(result.data.materiales_proyecto_activos[material_index]);
						}
					}
				}
			} else {
				$scope.materiales_iniciales_proyecto = false;
				$scope.materiales_extensiones_proyecto = false;
			}
			
		}, function (result) {
			$log.error(result);
		});
	}


	$scope.chosenSelect = function () {
		$timeout(function () {
			jQuery(".chosen-select").chosen({ no_results_text: "Sin resultados." });
		}, 1);
	}

}]);

myApp.controller('editarMaterialesProyectoController', ['$scope', '$log', '$http', '$filter', '$window', '$timeout', function ($scope, $log, $http, $filter, $window, $timeout) {
	$scope.materialesCurrent = {};
	$scope.materiales_iniciales_proyecto = {};
	$scope.materiales_extensiones_proyecto = {};
	$scope.materiales = {};
	$scope.editar_cantidad = {};
	$scope.guardando = {};
	$scope.proyecto_material_cantidad = {};
	$scope.proyecto_material_unidad = {};
	$scope.proyecto_material_comentario = {};
	$scope.resultado_insert = '';
	$scope.material_nuevo_id = '';
	$scope.agregar_material = false;

	$scope.habilitarFormMaterialExistente = function() {
		$scope.agregar_material = false;
	}
	
	$scope.habilitarFormMaterialNuevo = function() {
		$scope.agregar_material = true;
	}

	$scope.habilitarEdicionMaterial = function(proyecto_material_id){
		$scope.editar_cantidad[proyecto_material_id] = true;
		$scope.guardando[proyecto_material_id] = false;
	}

	$scope.cancelarEdicionMaterial = function(proyecto_material_id){
		$scope.editar_cantidad[proyecto_material_id] = false;
		$scope.guardando[proyecto_material_id] = false;
	}

	$scope.consultarMateriales = function(){
		$scope.consultarMaterialesProyecto();
	}
	

	$scope.consultarMaterialesProyecto = function () {
		$http({
			url: BASE_URL + 'proyecto/consultarMaterialesProyectoAjax/',
			method: "POST",
			data: {
				proyecto_id: $scope.proyecto_id,
			},
		})
		.then(function (result) {
			if (result.data.materiales_iniciales_proyecto !== false) {
				if (result.data.materiales_iniciales_proyecto.datos !== undefined){
					$scope.materiales_iniciales_proyecto = result.data.materiales_iniciales_proyecto.datos;
				} else {
					$scope.materiales_iniciales_proyecto = result.data.materiales_iniciales_proyecto;
				}
				$scope.materiales_iniciales_proyecto.map(function(value, index){
					$scope.editar_cantidad[value.proyecto_material_id] = false;
					$scope.proyecto_material_cantidad[value.proyecto_material_id] = Number(value.cantidad);
					$scope.proyecto_material_unidad[value.proyecto_material_id] = Number(value.material_unidad_id);
					$scope.proyecto_material_comentario[value.proyecto_material_id] = value.comentario;
				});
			} else {
				$scope.materiales_iniciales_proyecto = false;
			}

			if (result.data.materiales_extensiones_proyecto !== false) {
				if (result.data.materiales_extensiones_proyecto.datos !== undefined){
					$scope.materiales_extensiones_proyecto = result.data.materiales_extensiones_proyecto.datos;
				} else {
					$scope.materiales_extensiones_proyecto = result.data.materiales_extensiones_proyecto;
				}
				$scope.materiales_extensiones_proyecto.map(function(value2, index2){
					$scope.editar_cantidad[value2.proyecto_material_id] = false;
					$scope.proyecto_material_cantidad[value2.proyecto_material_id] = Number(value2.cantidad);
					$scope.proyecto_material_unidad[value2.proyecto_material_id] = Number(value2.material_unidad_id);
					$scope.proyecto_material_comentario[value2.proyecto_material_id] = value2.comentario;
				});
			} else {
				$scope.materiales_extensiones_proyecto = false;
			}
			
		}, function (result) {
			$log.error(result);
		});
	}

	$scope.actualizarMaterial = function(proyecto_material_id) {
		$scope.guardando[proyecto_material_id] = true;
		$http({
			url: BASE_URL + 'proyecto/actualizarInformacionMaterialProyectoAjax/',
			method: "POST",
			data: {
				proyecto_material_id: proyecto_material_id,
				cantidad: $scope.proyecto_material_cantidad[proyecto_material_id],
				material_unidad_id: $scope.proyecto_material_unidad[proyecto_material_id],
				comentario: $scope.proyecto_material_comentario[proyecto_material_id],
			},
		})
		.then(function (result) {
			if (result.data.datos.resultado == true) {
				$scope.editar_cantidad[proyecto_material_id] = false;
				$scope.guardando[proyecto_material_id] = false;
				$scope.consultarMaterialesProyecto();
			} else {

			}
			
		}, function (result) {
			$log.error(result);
		});
	}



	$scope.addRow = function (row_id) {
		$http({
			url: BASE_URL + 'proyecto/toggleEstadoMaterialProyectoAjax/',
			method: "POST",
			data: { proyecto_material_id: row_id },
		})
		.then(function (result) {
			if (result.data !== "false") {
				$scope.consultarMaterialesProyecto();
				return true;
			} else {
				$scope.consultarMaterialesProyecto(); 
				return false;
			}
		}, function (result) {
			$log.error(result);
		});
	}

	$scope.borrarRow = function (row_id) {
		$http({
			url: BASE_URL + 'proyecto/toggleEstadoMaterialProyectoAjax/',
			method: "POST",
			data: { proyecto_material_id: row_id },
		})
		.then(function (result) {
			if (result.data !== "false") {
				$window.location.reload();
				return true;

			} else {
				$window.location.reload();
				return false;
			}
		}, function (result) {
			$log.error(result);
		});
	}

	
	$scope.chosenSelect = function () {
		$timeout(function () {
			jQuery(".chosen-select").chosen({ no_results_text: "Sin resultados." });
		}, 1);
	}

}]);

myApp.controller('proyectoSolicitudesCotizacionMaterialesController', ['$scope', '$log', '$http', '$filter', '$window', '$timeout', function ($scope, $log, $http, $filter, $window, $timeout) {
	$scope.solicitudes_cotizacion_materiales = {};
	$scope.resultado_insert = '';
	$scope.material_nuevo_id = '';
	$scope.agregar_material = false;

	
	$scope.consultarSolicitudes = function(){
		$scope.consultarSolicitudesCotizacion();
	}
	

	$scope.consultarSolicitudesCotizacion = function () {
		$http({
			url: BASE_URL + 'proyecto/consultarSolicitudesCotizacionMaterialesProyectoAjax/',
			method: "POST",
			data: {
				proyecto_id: $scope.proyecto_id,
			},
		})
		.then(function (result) {
			if (result.data.solicitudes_cotizacion_materiales !== false) {
				if (result.data.solicitudes_cotizacion_materiales.datos !== undefined){
					$scope.solicitudes_cotizacion_materiales = result.data.solicitudes_cotizacion_materiales.datos;
				} else {
					$scope.solicitudes_cotizacion_materiales = result.data.solicitudes_cotizacion_materiales;
				}
			} else {
				$scope.solicitudes_cotizacion_materiales = false;
			}
		}, function (result) {
			$log.error(result);
		});
	}


	$scope.chosenSelect = function () {
		$timeout(function () {
			jQuery(".chosen-select").chosen({ no_results_text: "Sin resultados." });
		}, 1);
	}

}]);

myApp.controller('proyectoCotizacionMaterialesController', ['$scope', '$log', '$http', '$filter', '$window', '$timeout', function ($scope, $log, $http, $filter, $window, $timeout) {
	$scope.materialesCurrent = {};
	$scope.materiales_iniciales_proyecto = [];
	$scope.materiales_extensiones_proyecto = [];
	$scope.materiales = {};
	$scope.material_inicial_check = {};
	$scope.material_extension_check = {};
	$scope.guardando = {};
	$scope.proyecto_material_cantidad = {};
	$scope.proyecto_material_unidad = {};
	$scope.proyecto_material_comentario = {};
	$scope.resultado_insert = '';
	$scope.material_nuevo_id = '';
	$scope.agregar_material = false;

	
	$scope.consultarMateriales = function(){
		$scope.consultarMaterialesProyecto();
	}
	

	$scope.consultarMaterialesProyecto = function () {
		$http({
			url: BASE_URL + 'proyecto/consultarMaterialesActivosProyectoAjax/',
			method: "POST",
			data: {
				proyecto_id: $scope.proyecto_id,
			},
		})
		.then(function (result) {
			if (result.data.materiales_proyecto_activos !== false) {
				if (result.data.materiales_proyecto_activos.datos !== undefined){
					for (material_index in  result.data.materiales_proyecto_activos.datos){
						if (result.data.materiales_proyecto_activos.datos[material_index].proyecto_material_tipo == 1) {
							$scope.materiales_iniciales_proyecto.push(result.data.materiales_proyecto_activos.datos[material_index]);
							$scope.material_inicial_check[result.data.materiales_proyecto_activos.datos[material_index].proyecto_material_id] = false;
						} else {
							$scope.materiales_extensiones_proyecto.push(result.data.materiales_proyecto_activos.datos[material_index]);
							$scope.material_extension_check[result.data.materiales_proyecto_activos.datos[material_index].proyecto_material_id] = false;
						}
					}
				} else {
					for (material_index in  result.data.materiales_proyecto_activos){
						if (result.data.materiales_proyecto_activos[material_index].proyecto_material_tipo == 1) {
							$scope.materiales_iniciales_proyecto.push(result.data.materiales_proyecto_activos[material_index]);
							$scope.material_inicial_check[result.data.materiales_proyecto_activos[material_index].proyecto_material_id] = false;
						} else {
							$scope.materiales_extensiones_proyecto.push(result.data.materiales_proyecto_activos[material_index]);
							$scope.material_extension_check[result.data.materiales_proyecto_activos[material_index].proyecto_material_id] = false;
						}
					}
				}
			} else {
				$scope.materiales_iniciales_proyecto = false;
				$scope.materiales_extensiones_proyecto = false;
			}
			
		}, function (result) {
			$log.error(result);
		});
	}


	$scope.chosenSelect = function () {
		$timeout(function () {
			jQuery(".chosen-select").chosen({ no_results_text: "Sin resultados." });
		}, 1);
	}

}]);

myApp.controller('editarProveedoresMaterialesProyectoController', ['$scope', '$log', '$http', '$filter', '$window', '$timeout', function ($scope, $log, $http, $filter, $window, $timeout) {
	$scope.materiales_iniciales_proyecto = [];
	$scope.materiales_extensiones_proyecto = [];
	$scope.editar_proveedor = {};
	$scope.guardando = {};
	$scope.proveedor_id = {};
	$scope.moneda_id = {};
	$scope.precio = {};
	$scope.tiene_impuesto = {};
	$scope.impuesto = {};
	$scope.mensaje_error = {};


	$scope.habilitarEdicionMaterial = function(proyecto_material_id){
		$scope.editar_proveedor[proyecto_material_id] = true;
		$scope.guardando[proyecto_material_id] = false;
		$scope.inputMask();
	}

	$scope.cancelarEdicionMaterial = function(proyecto_material_id){
		$scope.editar_proveedor[proyecto_material_id] = false;
		$scope.guardando[proyecto_material_id] = false;
	}

	$scope.consultarMateriales = function(){
		$scope.consultarMaterialesProyecto();
	}
	

	$scope.consultarMaterialesProyecto = function () {
		$scope.materiales_iniciales_proyecto = [];
		$scope.materiales_extensiones_proyecto = [];
		$http({
			url: BASE_URL + 'proyecto/consultarMaterialesProveedoresActivosProyectoAjax/',
			method: "POST",
			data: {
				proyecto_id: $scope.proyecto_id,
			},
		})
		.then(function (result) {
			if (result.data.materiales_proyecto_activos !== false) {
				if (result.data.materiales_proyecto_activos.datos !== undefined){
					for (material_index in  result.data.materiales_proyecto_activos.datos){
						if (result.data.materiales_proyecto_activos.datos[material_index].proyecto_material_tipo == 1) {
							$scope.materiales_iniciales_proyecto.push(result.data.materiales_proyecto_activos.datos[material_index]);
						} else {
							$scope.materiales_extensiones_proyecto.push(result.data.materiales_proyecto_activos.datos[material_index]);
						}
					}
					result.data.materiales_proyecto_activos.datos.map(function(value, index){
						$scope.editar_proveedor[value.proyecto_material_id] = false;
						$scope.mensaje_error[value.proyecto_material_id] = {};
						if(value.proveedor_id !== null){
							$scope.proveedor_id[value.proyecto_material_id] = Number(value.proveedor_id);
						} else {
							$scope.proveedor_id[value.proyecto_material_id] = '';
						}
						if(value.moneda_id !== null){
							$scope.moneda_id[value.proyecto_material_id] = Number(value.moneda_id);
						} else {
							$scope.moneda_id[value.proyecto_material_id] = 1;
						}
						if(value.precio !== null){
							$scope.precio[value.proyecto_material_id] = Number(value.precio);
						} else {
							$scope.precio[value.proyecto_material_id] = '';
						}
						if(value.tiene_impuesto !== null){
							$scope.tiene_impuesto[value.proyecto_material_id] = Number(value.tiene_impuesto);
							if (value.tiene_impuesto == 1) {
								if(value.impuesto !== null){
									$scope.impuesto[value.proyecto_material_id] = Number(value.impuesto);
								} else {
									$scope.impuesto[value.proyecto_material_id] = 13;
								}
							} else {
								$scope.impuesto[value.proyecto_material_id] = 13;
							}
						} else {
							$scope.tiene_impuesto[value.proyecto_material_id] = 0;
							$scope.impuesto[value.proyecto_material_id] = 13;
						}
					});
				} else {
					for (material_index in  result.data.materiales_proyecto_activos){
						if (result.data.materiales_proyecto_activos[material_index].proyecto_material_tipo == 1) {
							$scope.materiales_iniciales_proyecto.push(result.data.materiales_proyecto_activos.datos[material_index]);
						} else {
							$scope.materiales_extensiones_proyecto.push(result.data.materiales_proyecto_activos.datos[material_index]);
						}
					}
					result.data.materiales_proyecto_activos.map(function(value, index){
						$scope.editar_proveedor[value.proyecto_material_id] = false;
						$scope.mensaje_error[value.proyecto_material_id] = {};
						if(value.proveedor_id !== null){
							$scope.proveedor_id[value.proyecto_material_id] = Number(value.proveedor_id);
						} else {
							$scope.proveedor_id[value.proyecto_material_id] = '';
						}
						if(value.moneda_id !== null){
							$scope.moneda_id[value.proyecto_material_id] = Number(value.moneda_id);
						} else {
							$scope.moneda_id[value.proyecto_material_id] = 1;
						}
						if(value.precio !== null){
							$scope.precio[value.proyecto_material_id] = Number(value.precio);
						} else {
							$scope.precio[value.proyecto_material_id] = '';
						}
						if(value.tiene_impuesto !== null){
							$scope.tiene_impuesto[value.proyecto_material_id] = Number(value.tiene_impuesto);
							if (value.tiene_impuesto == 1) {
								if(value.impuesto !== null){
									$scope.impuesto[value.proyecto_material_id] = Number(value.impuesto);
								} else {
									$scope.impuesto[value.proyecto_material_id] = 13;
								}
							} else {
								$scope.impuesto[value.proyecto_material_id] = 13;
							}
						} else {
							$scope.tiene_impuesto[value.proyecto_material_id] = 0;
							$scope.impuesto[value.proyecto_material_id] = 13;
						}
					});
				}
				$log.log($scope.moneda_id);

			} else {
				$scope.materiales_iniciales_proyecto = false;
				$scope.materiales_extensiones_proyecto = false;
			}
			
		}, function (result) {
			$log.error(result);
		});
	}

	$scope.actualizarMaterial = function(proyecto_material_id) {
		$scope.mensaje_error[proyecto_material_id] = {};
		$scope.guardando[proyecto_material_id] = true;
		$log.log($scope.moneda_id[proyecto_material_id]);
		if($scope.proveedor_id[proyecto_material_id] !== null) {
			if(($scope.precio[proyecto_material_id] !== null && $scope.precio[proyecto_material_id] !== '') && $scope.moneda_id[proyecto_material_id] !== null) {
				if(($scope.tiene_impuesto[proyecto_material_id] == 1 && $scope.impuesto[proyecto_material_id] !== null) || $scope.tiene_impuesto[proyecto_material_id] == 0) {
					$http({ 
						url: BASE_URL + 'proyecto/actualizarProveedorMaterialProjectoAjax/',
						method: "POST",
						data: {
							proyecto_material_id: proyecto_material_id,
							proveedor_id: $scope.proveedor_id[proyecto_material_id],
							moneda_id: $scope.moneda_id[proyecto_material_id],
							precio: $scope.precio[proyecto_material_id],
							tiene_impuesto: $scope.tiene_impuesto[proyecto_material_id],
							impuesto: $scope.impuesto[proyecto_material_id],
						},
					})
					.then(function (result) {
						if (result.data.datos.resultado == true) {
							$scope.editar_proveedor[proyecto_material_id] = false;
							$scope.guardando[proyecto_material_id] = false;
							$scope.consultarMaterialesProyecto();
						} else {
							$log.error(result.data);
						}
						
					}, function (result) {
						$log.error(result);
					});
				} else {
					$scope.mensaje_error[proyecto_material_id].error_impuesto = 'Debe ingresar el impuesto';
				}
			} else {
				$scope.mensaje_error[proyecto_material_id].error_precio = 'Debe ingresar la moneda y el precio';
			}
		} else {
			$scope.mensaje_error[proyecto_material_id].error_proveedor = 'Debe ingresar seleccionar un proveedor';
		}
		$scope.guardando[proyecto_material_id] = false;
	}
	
	$scope.chosenSelect = function () {
		$timeout(function () {
			jQuery(".chosen-select").chosen({ no_results_text: "Sin resultados." });
		}, 1);
	}

	$scope.inputMask = function(){
		$timeout(function(){
			jQuery(".input-money-mask").maskMoney({prefix:'$ ', allowNegative: true, thousands:' ', decimal:'.', affixesStay: false});
			jQuery(".input-money-mask-colones").maskMoney({prefix:'₡ ', allowNegative: true, thousands:' ', decimal:'.', affixesStay: false});
			jQuery(".input-number").maskMoney({allowNegative: false, thousands:' ', decimal:'.'});
			
		},1);
	}

}]);

myApp.controller('proyectoVerSolicitudesCompraMaterialesController', ['$scope', '$log', '$http', '$filter', '$window', '$timeout', function ($scope, $log, $http, $filter, $window, $timeout) {
	$scope.solicitudes_compra_materiales = {};
	$scope.resultado_insert = '';
	$scope.material_nuevo_id = '';
	$scope.agregar_material = false;

	
	$scope.consultarSolicitudes = function(){
		$scope.consultarSolicitudesCompra();
	}
	

	$scope.consultarSolicitudesCompra = function () {
		$http({
			url: BASE_URL + 'proyecto/consultarSolicitudesCompraMaterialesProyectoAjax/',
			method: "POST",
			data: {
				proyecto_id: $scope.proyecto_id,
			},
		})
		.then(function (result) {
			if (result.data.solicitudes_compra_materiales !== false) {
				if (result.data.solicitudes_compra_materiales.datos !== undefined){
					$scope.solicitudes_compra_materiales = result.data.solicitudes_compra_materiales.datos;
				} else {
					$scope.solicitudes_compra_materiales = result.data.solicitudes_compra_materiales;
				}
			} else {
				$scope.solicitudes_compra_materiales = false;
			}
		}, function (result) {
			$log.error(result);
		});
	}


	$scope.chosenSelect = function () {
		$timeout(function () {
			jQuery(".chosen-select").chosen({ no_results_text: "Sin resultados." });
		}, 1);
	}

}]);


myApp.controller('proyectoAgregarSolicitudCompraMaterialesController', ['$scope', '$log', '$http', '$filter', '$window', '$timeout', function ($scope, $log, $http, $filter, $window, $timeout) {
	$scope.materiales_iniciales_proyecto = [];
	$scope.materiales_extensiones_proyecto = [];
	$scope.material_check = {};
	$scope.resultado_insert = '';
	$scope.material_nuevo_id = '';
	$scope.agregar_material = false;

	
	$scope.consultarMateriales = function(){
		$scope.consultarMaterialesProyecto();
	}
	

	$scope.consultarMaterialesProyecto = function () {
		$http({
			url: BASE_URL + 'proyecto/consultarMaterialesRestantesActivosProyectoAjax/',
			method: "POST",
			data: {
				proyecto_id: $scope.proyecto_id,
			},
		})
		.then(function (result) {
			$log.log(result.data.materiales_proyecto_activos);
			if (result.data.materiales_proyecto_activos !== false) {
				if (result.data.materiales_proyecto_activos.datos !== undefined){
					result.data.materiales_proyecto_activos.datos.map(function(value, index){
						if (value.proyecto_material_tipo == 1) {
							$scope.materiales_iniciales_proyecto.push(value);
						} else {
							$scope.materiales_extensiones_proyecto.push(value);
						}
						$scope.material_check[value.proyecto_material_id] = false;
					});
				} else {
					result.data.materiales_proyecto_activos.map(function(value, index){
						if (value.proyecto_material_tipo == 1) {
							$scope.materiales_iniciales_proyecto.push(value);
						} else {
							$scope.materiales_extensiones_proyecto.push(value);
						}
						$scope.material_check[value.proyecto_material_id] = false;
					});
				}
			} else {
				$scope.materiales_iniciales_proyecto = false;
				$scope.materiales_extensiones_proyecto = false;
			}
			
		}, function (result) {
			$log.error(result);
		});
	}

	$scope.buscar_material = function(lista) {
		$log.log($scope.buscar_inicial);
	}


	$scope.chosenSelect = function () {
		$timeout(function () {
			jQuery(".chosen-select").chosen({ no_results_text: "Sin resultados." });
		}, 1);
	}

	$scope.inputMask = function(){
		$timeout(function(){
			jQuery(".input-money-mask").maskMoney({prefix:'$ ', allowNegative: true, thousands:' ', decimal:'.', affixesStay: false});
			jQuery(".input-money-mask-colones").maskMoney({prefix:'₡ ', allowNegative: true, thousands:' ', decimal:'.', affixesStay: false});
			jQuery(".input-number").maskMoney({allowNegative: false, thousands:' ', decimal:'.'});
			
		},1);
	}

}]);

myApp.controller('proyectoEditarSolicitudCompraMaterialesController', ['$scope', '$log', '$http', '$filter', '$window', '$timeout', function ($scope, $log, $http, $filter, $window, $timeout) {
	$scope.materiales_iniciales_proyecto = [];
	$scope.materiales_extensiones_proyecto = [];
	$scope.material_check = {};
	$scope.material_cantidad = {};
	$scope.resultado_insert = '';
	$scope.material_nuevo_id = '';
	$scope.agregar_material = false;

	
	$scope.consultarMateriales = function(){
		$scope.consultarMaterialesProyecto();
	}
	

	$scope.consultarMaterialesProyecto = function () {
		$http({
			url: BASE_URL + 'proyecto/consultarMaterialesRestantesActivosProyectoAjax/',
			method: "POST",
			data: {
				proyecto_id: $scope.proyecto_id,
				proyecto_material_solicitud_compra_id: $scope.proyecto_material_solicitud_compra_id,
			},
		})
		.then(function (result) {
			if (result.data.materiales_proyecto_activos !== false) {
				if (result.data.materiales_proyecto_activos.datos !== undefined){
					result.data.materiales_proyecto_activos.datos.map(function(value, index){
						if (value.proyecto_material_tipo == 1) {
							$scope.materiales_iniciales_proyecto.push(value);
						} else {
							$scope.materiales_extensiones_proyecto.push(value);
						}
						$scope.material_check[value.proyecto_material_id] = false;
					});
				} else {
					result.data.materiales_proyecto_activos.map(function(value, index){
						if (value.proyecto_material_tipo == 1) {
							$scope.materiales_iniciales_proyecto.push(value);
						} else {
							$scope.materiales_extensiones_proyecto.push(value);
						}
						$scope.material_check[value.proyecto_material_id] = false;
					});
				}

				if (result.data.materiales_solicitud_compra.datos !== undefined) {
					result.data.materiales_solicitud_compra.datos.map(function(material, index_material){
						$scope.material_check[material.proyecto_material_id] = true;
						$scope.material_cantidad[material.proyecto_material_id] = material.cantidad_compra;
					});
				}
			} else {
				$scope.materiales_iniciales_proyecto = false;
				$scope.materiales_extensiones_proyecto = false;
			}
			
		}, function (result) {
			$log.error(result);
		});
	}


	$scope.chosenSelect = function () {
		$timeout(function () {
			jQuery(".chosen-select").chosen({ no_results_text: "Sin resultados." });
		}, 1);
	}

	$scope.inputMask = function(){
		$timeout(function(){
			jQuery(".input-money-mask").maskMoney({prefix:'$ ', allowNegative: true, thousands:' ', decimal:'.', affixesStay: false});
			jQuery(".input-money-mask-colones").maskMoney({prefix:'₡ ', allowNegative: true, thousands:' ', decimal:'.', affixesStay: false});
			jQuery(".input-number").maskMoney({allowNegative: false, thousands:' ', decimal:'.'});
			
		},1);
	}

}]);

myApp.controller('proyectoVerSolicitudCompraMaterialesController', ['$scope', '$log', '$http', '$filter', '$window', '$timeout', function ($scope, $log, $http, $filter, $window, $timeout) {
	$scope.materiales_iniciales_proyecto = [];
	$scope.materiales_extensiones_proyecto = [];
	$scope.resultado_insert = '';
	$scope.material_nuevo_id = '';
	$scope.agregar_material = false;

	
	$scope.consultarMateriales = function(){
		$scope.consultarMaterialesProyecto();
	}
	

	$scope.consultarMaterialesProyecto = function () {
		$http({
			url: BASE_URL + 'proyecto/consultarMaterialesSolicitudCompraProyectoAjax/',
			method: "POST",
			data: {
				proyecto_material_solicitud_compra_id: $scope.proyecto_material_solicitud_compra_id,
			},
		})
		.then(function (result) {
			if (result.data.materiales_solicitud_compra !== false) {
				if (result.data.materiales_solicitud_compra.datos !== undefined){
					result.data.materiales_solicitud_compra.datos.map(function(value, index){
						if (value.proyecto_material_tipo == 1) {
							$scope.materiales_iniciales_proyecto.push(value);
						} else {
							$scope.materiales_extensiones_proyecto.push(value);
						}
					});
				} else {
					result.data.materiales_solicitud_compra.map(function(value, index){
						if (value.proyecto_material_tipo == 1) {
							$scope.materiales_iniciales_proyecto.push(value);
						} else {
							$scope.materiales_extensiones_proyecto.push(value);
						}
					});
				}
			} else {
				$scope.materiales_iniciales_proyecto = false;
				$scope.materiales_extensiones_proyecto = false;
			}
			
		}, function (result) {
			$log.error(result);
		});
	}


	$scope.chosenSelect = function () {
		$timeout(function () {
			jQuery(".chosen-select").chosen({ no_results_text: "Sin resultados." });
		}, 1);
	}

	$scope.inputMask = function(){
		$timeout(function(){
			jQuery(".input-money-mask").maskMoney({prefix:'$ ', allowNegative: true, thousands:' ', decimal:'.', affixesStay: false});
			jQuery(".input-money-mask-colones").maskMoney({prefix:'₡ ', allowNegative: true, thousands:' ', decimal:'.', affixesStay: false});
			jQuery(".input-number").maskMoney({allowNegative: false, thousands:' ', decimal:'.'});
			
		},1);
	}

}]);

myApp.controller('proyectoVerProformasController', ['$scope', '$log', '$http', '$filter', '$window', '$timeout', function ($scope, $log, $http, $filter, $window, $timeout) {
	$scope.proveedores = {};
	$scope.editar_proforma = {};
	$scope.mensaje_error = {};
	$scope.guardando = {};
	$scope.proyecto_material_solicitud_compra_proforma_estado_id = {};
	$scope.bloqueo_edicion = {};

	$scope.habilitarEdicionProforma = function(proyecto_material_solicitud_compra_proforma_id){
		$scope.editar_proforma[proyecto_material_solicitud_compra_proforma_id] = true;
		$scope.guardando[proyecto_material_solicitud_compra_proforma_id] = false;
	}

	$scope.cancelarEdicionProforma = function(proyecto_material_solicitud_compra_proforma_id){
		$scope.editar_proforma[proyecto_material_solicitud_compra_proforma_id] = false;
		$scope.guardando[proyecto_material_solicitud_compra_proforma_id] = false;
	}
	
	$scope.consultarProformas = function(){
		$scope.consultarProformasCompra();
	}
	

	$scope.consultarProformasCompra = function () {
		$http({
			url: BASE_URL + 'proyecto/consultarProformasSolicitudCompraMaterialesProyectoAjax/',
			method: "POST",
			data: {
				proyecto_material_solicitud_compra_id: $scope.proyecto_material_solicitud_compra_id,
			},
		})
		.then(function (result) {
			if (result.data.proformas !== false) {
				if (result.data.proformas.datos !== undefined){
					$scope.proveedores = result.data.proformas.datos;
				} else {
					$scope.proveedores = result.data.proformas;
				}
				Object.keys($scope.proveedores).map(function(value) {
					var contador = 1;
					Object.keys($scope.proveedores[value].proformas).map(function(value2){
						var cant_ordenes = $scope.proveedores[value].proformas.length;
						$scope.editar_proforma[$scope.proveedores[value].proformas[value2].proyecto_material_solicitud_compra_proforma_id] = false;
						$scope.mensaje_error[$scope.proveedores[value].proformas[value2].proyecto_material_solicitud_compra_proforma_id] = {};
						$scope.proyecto_material_solicitud_compra_proforma_estado_id[$scope.proveedores[value].proformas[value2].proyecto_material_solicitud_compra_proforma_id] = $scope.proveedores[value].proformas[value2].proyecto_material_solicitud_compra_proforma_estado_id;
						if (cant_ordenes == contador) {
							$scope.bloqueo_edicion[value] = $scope.proveedores[value].proformas[value2].proyecto_material_solicitud_compra_proforma_id;
						}
						contador++;
					});
				});
			} else {
				$scope.proveedores = false;
			}
		}, function (result) {
			$log.error(result);
		});
	}

	$scope.cambiarEstado = function(proyecto_material_solicitud_compra_proforma_id) {
		$scope.mensaje_error[proyecto_material_solicitud_compra_proforma_id] = {};
		$scope.guardando[proyecto_material_solicitud_compra_proforma_id] = true;
		if($scope.proyecto_material_solicitud_compra_proforma_estado_id[proyecto_material_solicitud_compra_proforma_id] !== null) {
			$http({ 
				url: BASE_URL + 'proyecto/actualizarEstadoProformaAjax/',
				method: "POST",
				data: {
					proyecto_material_solicitud_compra_proforma_id: proyecto_material_solicitud_compra_proforma_id,
					proyecto_material_solicitud_compra_proforma_estado_id: $scope.proyecto_material_solicitud_compra_proforma_estado_id[proyecto_material_solicitud_compra_proforma_id],
				},
			})
			.then(function (result) {
				if (result.data.datos.resultado == true) {
					$scope.editar_proforma[proyecto_material_solicitud_compra_proforma_id] = false;
					$scope.guardando[proyecto_material_solicitud_compra_proforma_id] = false;
					$scope.consultarProformasCompra();
				} else {
					$log.error(result.data);
				}
				
			}, function (result) {
				$log.error(result);
			});
				
		} else {
			$scope.mensaje_error[proyecto_material_solicitud_compra_proforma_id].error_estado = 'Debe ingresar seleccionar un estado';
		}
		$scope.guardando[proyecto_material_solicitud_compra_proforma_id] = false;
	}

	$scope.chosenSelect = function () {
		$timeout(function () {
			jQuery(".chosen-select").chosen({ no_results_text: "Sin resultados." });
		}, 1);
	}

}]);


myApp.controller('proyectoVerOrdenesCompraController', ['$scope', '$log', '$http', '$filter', '$window', '$timeout', function ($scope, $log, $http, $filter, $window, $timeout) {
	$scope.proveedores = {};
	$scope.editar_orden = {};
	$scope.mensaje_error = {};
	$scope.guardando = {};
	$scope.proyecto_material_solicitud_compra_orden_compra_estado_id = {};
	$scope.bloqueo_edicion = {};

	$scope.habilitarEdicionOrdenCompra = function(proyecto_material_solicitud_compra_orden_compra_id){
		$scope.editar_orden[proyecto_material_solicitud_compra_orden_compra_id] = true;
		$scope.guardando[proyecto_material_solicitud_compra_orden_compra_id] = false;
	}

	$scope.cancelarEdicionOrdenCompra = function(proyecto_material_solicitud_compra_orden_compra_id){
		$scope.editar_orden[proyecto_material_solicitud_compra_orden_compra_id] = false;
		$scope.guardando[proyecto_material_solicitud_compra_orden_compra_id] = false;
	}
	
	$scope.consultarOrdenesCompra = function(){
		$scope.consultarOrdenesCompraCompra();
	}
	

	$scope.consultarOrdenesCompraCompra = function () {
		$http({
			url: BASE_URL + 'proyecto/consultarOrdenesCompraSolicitudCompraMaterialesProyectoAjax/',
			method: "POST",
			data: {
				proyecto_material_solicitud_compra_id: $scope.proyecto_material_solicitud_compra_id,
			},
		})
		.then(function (result) {
			if (result.data.ordenes_compra !== false) {
				if (result.data.ordenes_compra.datos !== undefined){
					$scope.proveedores = result.data.ordenes_compra.datos;
				} else {
					$scope.proveedores = result.data.ordenes_compra;
				}
				Object.keys($scope.proveedores).map(function(value) {
					var contador = 1;
					Object.keys($scope.proveedores[value].ordenes_compra).map(function(value2){
						var cant_ordenes = $scope.proveedores[value].ordenes_compra.length;
						$scope.editar_orden[$scope.proveedores[value].ordenes_compra[value2].proyecto_material_solicitud_compra_orden_compra_id] = false;
						$scope.mensaje_error[$scope.proveedores[value].ordenes_compra[value2].proyecto_material_solicitud_compra_orden_compra_id] = {};
						$scope.proyecto_material_solicitud_compra_orden_compra_estado_id[$scope.proveedores[value].ordenes_compra[value2].proyecto_material_solicitud_compra_orden_compra_id] = $scope.proveedores[value].ordenes_compra[value2].proyecto_material_solicitud_compra_orden_compra_estado_id;
						if (cant_ordenes == contador) {
							$scope.bloqueo_edicion[value] = $scope.proveedores[value].ordenes_compra[value2].proyecto_material_solicitud_compra_orden_compra_id;
						}
						contador++;
					});
				});
			} else {
				$scope.proveedores = false;
			}
		}, function (result) {
			$log.error(result);
		});
	}

	$scope.cambiarEstado = function(proyecto_material_solicitud_compra_orden_compra_id) {
		$scope.mensaje_error[proyecto_material_solicitud_compra_orden_compra_id] = {};
		$scope.guardando[proyecto_material_solicitud_compra_orden_compra_id] = true;
		if($scope.proyecto_material_solicitud_compra_orden_compra_estado_id[proyecto_material_solicitud_compra_orden_compra_id] !== null) {
			$http({ 
				url: BASE_URL + 'proyecto/actualizarEstadoOrdenCompraAjax/',
				method: "POST",
				data: {
					proyecto_id: $scope.proyecto_id,
					proyecto_material_solicitud_compra_orden_compra_id: proyecto_material_solicitud_compra_orden_compra_id,
					proyecto_material_solicitud_compra_orden_compra_estado_id: $scope.proyecto_material_solicitud_compra_orden_compra_estado_id[proyecto_material_solicitud_compra_orden_compra_id],
				},
			})
			.then(function (result) {
				if (result.data.datos.resultado == true) {
					$scope.editar_orden[proyecto_material_solicitud_compra_orden_compra_id] = false;
					$scope.guardando[proyecto_material_solicitud_compra_orden_compra_id] = false;
					$scope.consultarOrdenesCompraCompra();
				} else {
					$log.error(result.data);
				}
				
			}, function (result) {
				$log.error(result);
			});
				
		} else {
			$scope.mensaje_error[proyecto_material_solicitud_compra_orden_compra_id].error_estado = 'Debe ingresar seleccionar un estado';
		}
		$scope.guardando[proyecto_material_solicitud_compra_orden_compra_id] = false;
	}

	$scope.chosenSelect = function () {
		$timeout(function () {
			jQuery(".chosen-select").chosen({ no_results_text: "Sin resultados." });
		}, 1);
	}

}]);