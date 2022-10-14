'use strict';

/**
 * @ngdoc function
 * @name vasaApp.controller:TransaksiRealisasiTundaCtrl
 * @description
 * # TransaksiRealisasiTundaCtrl
 * Controller of the vasaApp
 */
 angular.module('vasaApp')
 .controller('TransaksiRealisasiTundaCtrl', ['$scope','$filter','$routeParams','$rootScope','$controller','AppParam','AppParamValue','PermohonanDetail','PenetapanDetail','RealisasiTunda','RealisasiTundabyPpkJasa','RealisasiTundaEdit','MdmDermagaJasa','MdmDermagaPerJasa','Notification','MdmKapalSearchByName',
 	'AddReaKapalTunda','ReaKapalTundaByPpkJasa','DeleteReaKapalTunda','SearchReaKapalTunda','ReaKapalTundaGandengByPpkJasa','AddReaKapalTundaGandeng','DeleteReaKapalTundaGandeng','SearchReaKapalTundaGandeng','HistoryRevisiTunda','JenisRevisiRealisasiTunda','StatusRealisasiTunda','JasaTunda','JasaPandu',
 	'PermohonanMultiDetail','PermohonanTunda','PenetapanTunda','ModeRealisasi','PermohonanTundaDelete','PenetapanTundaDelete','Validations','validationForm','BindEskalasi','UpdateStatusReaAfterEskalasi','BuildPDF',
 	function ($scope,$filter,$routeParams,$rootScope,$controller,AppParam,AppParamValue,PermohonanDetail,PenetapanDetail,RealisasiTunda,RealisasiTundabyPpkJasa,RealisasiTundaEdit,MdmDermagaJasa,MdmDermagaPerJasa,Notification,MdmKapalSearchByName,
 		AddReaKapalTunda,ReaKapalTundaByPpkJasa ,DeleteReaKapalTunda,SearchReaKapalTunda,ReaKapalTundaGandengByPpkJasa,AddReaKapalTundaGandeng,DeleteReaKapalTundaGandeng,SearchReaKapalTundaGandeng,HistoryRevisiTunda,JenisRevisiRealisasiTunda,
 		StatusRealisasiTunda,JasaTunda,JasaPandu,PermohonanMultiDetail,PermohonanTunda,PenetapanTunda,ModeRealisasi,PermohonanTundaDelete,PenetapanTundaDelete,Validations,validationForm,BindEskalasi,UpdateStatusReaAfterEskalasi,BuildPDF) {
 	/*
 	** tab labuh
 	*/
 	// extend controller di atasnya (penetapan new); untuk mengambil data permohonan, supaya tidak request berkali-kali
 	//alert ('Cek tab jasa labuh controller');
 	angular.extend(this, $controller('RealisasiPermohonanCtrl', {$scope: $scope}));
	$scope.options = {
		autoclose: true,
		todayBtn: 'linked',
		todayHighlight: true
	};

 	$scope.tempSelection = null;
 	$scope.rightSelection = null;
 	$scope.itemSelected = [];
 	$scope.avoidClick = false;
 	$scope.rightReadOnly = true;
 	$scope.realisasitunda = {};
 	$scope.kapalTundaArray = [];
 	$scope.kapalTundaUpdateArray = [];
 	$scope.kapalTunda = {};
 	$scope.kapalTundaGandengArray = [];
 	$scope.kapalTundaGandengUpdateArray = [];
 	$scope.kapalTundaGandeng = {};
 	$scope.tundaGandengGrid = false;
 	$scope.realisasitunda.jenisTunda = '1';
 	$scope.realisasitunda.jamKerja = '1';
 	BindEskalasi.setDefaultEskalasi();
 	var mainPpkJasa = '';
 	var checkunique = [];
 	$scope.modeRealisasi = '1';
 	var tmpmoderea = [];
 	var tempAllDataPandu = [];
 	var dataModeRealisasi = {};
 	dataModeRealisasi.mode = '1';
 	var fakeSelect = {};
 	$scope.tooltipInfo = Notification.setMessageValidFile();

    $scope.$watch(function () {
    	return JasaTunda.getJasaTunda();
    },function(newVal, oldVal) {
    	var value = JasaTunda.getJasaTunda();
    	if(value.bindData){
    		$scope.tundaItems = value.content;
    		$scope.tundaItems.bindData = value.bindData;
    		getTundaItems();
    	}
    }, true);

    /* ambil data yang dikirim pandu*/
    $scope.$watch(function () {
    	return ModeRealisasi.getMode();
    },function(newVal, oldVal) {
    	if(ModeRealisasi.getMode() != null){
	    	dataModeRealisasi = ModeRealisasi.getMode();
    	}
    }, true);   

 	$scope.listOfDermagaTundaAsal = [];
 	$scope.changeDermagaLokasiAsal = function(){
 		if($scope.rightSelection.lokasiAsal){
 			MdmDermagaPerJasa.get({
 				//jasa:'tunda',
 				nama:$scope.rightSelection.lokasiAsal,
 				kodeTerminal : localStorage.getItem('kodeTerminal'),
 				limit:10
 			},
 			function(response){
 				$scope.listOfDermagaTundaAsal = response;
 			});
 		}
 	};

	$scope.listOfDermagaTundaTujuan = [];
	$scope.changeDermagaLokasiTujuan = function(){
 		if($scope.rightSelection.lokasiTujuan){
 			MdmDermagaPerJasa.get({
 				nama:$scope.rightSelection.lokasiTujuan,
 				kodeTerminal : localStorage.getItem('kodeTerminal'),
 				limit:10
 			},
 			function(response){
 				$scope.listOfDermagaTundaTujuan = response;
 			});
 		}
 	};

 	var historyTunda = function(ppkJasa){
		HistoryRevisiTunda.get({noPpkJasa:ppkJasa}, function(response){
			if(response.length > 0){
				$scope.tempSelection = response[0];
				$scope.tempSelection.noPpkJasa = mainPpkJasa;
				$scope.tempSelection.tglMulai = new Date(response[0].tglMulai);
				var jamMulai = (moment.utc(response[0].tglMulai).format()).split("T")[1].split("Z");
				$scope.tempSelection.jamMulai = jamMulai[0];
				$scope.tempSelection.tglMulaiTunda = $scope.tempSelection.tglMulai;
			}
		});
	};

	var originItems = $scope.tundaItems;
 	var getTundaItems = function(){
 		if($scope.tundaItems.length >0){ 
 			$scope.items = JSON.parse(JSON.stringify($scope.tundaItems));

 			if(dataModeRealisasi.mode != '3' ){
 				tmpmoderea = [];
 				$scope.config.selectedItems = [];
				if(!$scope.tundaItems.bindData){
					$scope.tundaItems = originItems;
				}else{
					$scope.config.selectedItems = [];
				}		
			}else{
				tmpmoderea.push($scope.items);
				$scope.config.selectedItems = $scope.tundaItems;
			}

 			
 			for (var i = 0; i < $scope.tundaItems.length; i++) {
                var itemPpkJasa = $scope.tundaItems[i].noPpkJasa;
                RealisasiTundabyPpkJasa.get({noPpkJasa: itemPpkJasa}, function(response) {
                    var item = JSON.parse(JSON.stringify(response));                                
                    SearchReaKapalTunda.get({noPpk1 : item.noPpk1, noPpkJasa : item.noPpkJasa},function(response){
						if (response.totalElements > 0) {
							item.kapalTunda = response.content;	
						}
					});
					// kapal tunda gandeng
					SearchReaKapalTundaGandeng.get({noPpk1 : item.noPpk1, noPpkJasa : item.noPpkJasa},function(response){
						if (response.totalElements > 0) {
							item.kapalTundaGandeng = response.content;	
						}
					});
                   	if(response.id){
						$scope.itemSelected.push(item);
					}
                });
            }
            if(!$scope.tundaItems.bindData){
            	$scope.config.selectedItems.push($scope.items[0]);
				$scope.tempSelection = $scope.items[0];
            }
 			
			mainPpkJasa = $scope.tempSelection.noPpkJasa;
			$scope.tempSelection.jamMulai = $filter('date')($scope.tempSelection.tglMulai, 'HH:mm');
			$scope.tempSelection.tglMulai = $filter('date')($scope.tempSelection.tglMulai,'dd-MM-yyyy');

			//default jamtanggal
			document.getElementById('timetundaMulai').querySelector('input').value	= moment().format('HH:mm');
			document.getElementById('timetundaSelesai').querySelector('input').value = moment().format('HH:mm');
			$scope.realisasitunda.tglMulai = new Date();
			$scope.realisasitunda.tglSelesai = new Date();
			historyTunda($scope.tempSelection.noPpkJasa);
			
			$scope.kapalTundaArray = [];
			$scope.kapalTundaGandengArray = [];
			$scope.kapalTunda = {};
			$scope.kapalTundaGandeng = {};
 		}
 	};

 	$scope.$watch('dataUmum', function(newVal, oldVal){
 		getTundaItems();
 	});

 	$scope.btnKapalTundaGandeng = function(){ 		
 		if($scope.realisasitunda.jenisTunda !== '1'){
 			$scope.tundaGandengGrid = true;
 		}else{
 			$scope.tundaGandengGrid = false;
 		}
 	}

 	var matchDataSelected = function(item){
 		var match = {};
 		var items = JSON.parse(JSON.stringify($scope.tundaItems));
		for(var i=0;i < items.length;i++){
			if(items[i].noPpkJasa==item.noPpkJasa){
				match = items[i];
			}
		}
		return match;
 	}

	/*=========mode realisasi===============================*/
 	$scope.$watch('dataModeRealisasi.mode', function(newVal, oldVal){
 		tmpmoderea = [];
 		$scope.config.selectedItems = [];
		if(dataModeRealisasi.mode == '3'){
			getalldataTunda();
			$scope.config.multiSelect = true;
		}else{
			getdatarea();
			$scope.config.multiSelect = false;
		}
	})
	/*==============================================*/

 	var handleSelect = function (item, e) {
 		if($scope.tundaItems.bindData){
	 		/* mode realisasi */
			if(dataModeRealisasi.mode == '3'){
				$scope.config.multiSelect = true;
				if(tmpmoderea.length === 2){
					tmpmoderea = [];
					$scope.config.selectedItems = [];			
					tmpmoderea.push(item);
					$scope.config.selectedItems.push(item);
				}else{
					tmpmoderea.push(item);
				}
			}
			/*-------------------------*/			
 		}

 		mainPpkJasa = item.noPpkJasa;
 		var getData = matchDataSelected(item);
 		$scope.tempSelection = getData;
 		$scope.tempSelection.jamMulai = $filter('date')($scope.tempSelection.tglMulai,'HH:mm');
 		$scope.tempSelection.tglMulai = $filter('date')($scope.tempSelection.tglMulai,'dd-MM-yyyy');
 		historyTunda($scope.tempSelection.noPpkJasa);
	};

	$scope.getRealisasiTundaDetailbyPpkJasa = function(item){
		RealisasiTundabyPpkJasa.get({noPpkJasa: item.noPpkJasa}, function(response) { 
			if(response.status!=='404'){
				/* validasi jika data sudah di verifikasi, maka data tidak bisa di edit*/
				if(Validations.checkStatusIsVerified(response)){
					$scope.rightReadOnly = true;
					return false;
				}else{
					// $scope.rightReadOnly = false;
					$scope.rightSelection = response;
					$scope.realisasitunda = response;			
					$scope.rightSelection.lokasiAsal = {mdmgKode:$scope.rightSelection.kodeLokasiAsal, mdmgNama:$scope.rightSelection.namaLokasiAsal};
					$scope.rightSelection.lokasiTujuan = {mdmgKode:$scope.rightSelection.kodeLokasiTujuan, mdmgNama:$scope.rightSelection.namaLokasiTujuan};
					
					if($scope.rightSelection.statusTunda!==undefined){
						AppParamValue.get({nama:'JENIS_KEG_TUNDA',value:$scope.rightSelection.statusTunda},function(response){
							$scope.realisasitunda.jenisKegiatanText = response[0].caption;
						});
						AppParamValue.get({nama:'JAM_KERJA',value:$scope.rightSelection.statusTunda},function(response){
							$scope.realisasitunda.jamKerjaText = response[0].caption;
						});
					}
					$scope.realisasitunda.jenisTunda = $scope.rightSelection.jenisTunda;			
					$scope.realisasitunda.jamKerja = ''+$scope.rightSelection.jamKerja;
					$scope.realisasitunda.catatan = $scope.rightSelection.catatan;
					$scope.realisasitunda.jamMulai = $filter('date')($scope.rightSelection.tglMulai, 'HH:mm');
					$scope.realisasitunda.jamSelesai = $filter('date')($scope.rightSelection.tglSelesai, 'HH:mm');
					document.getElementById('tglMulaiTunda').querySelector('input').value = $filter('date')($scope.rightSelection.tglMulai,'dd-MM-yyyy');
					document.getElementById('tglSelesaiTunda').querySelector('input').value = $filter('date')($scope.rightSelection.tglSelesai,'dd-MM-yyyy');
					$scope.realisasitunda.tglMulai = $filter('date')($scope.rightSelection.tglMulai,'dd-MM-yyyy');
					$scope.realisasitunda.tglSelesai = $filter('date')($scope.rightSelection.tglSelesai,'dd-MM-yyyy');

					ReaKapalTundaByPpkJasa.get({noPpkJasa: $scope.rightSelection.noPpkJasa},function(response){
						$scope.kapalTundaArray = response;
						for (var i = 0; i < $scope.kapalTundaArray.length; i++) {
							if (checkunique.indexOf($scope.kapalTundaArray[i].kodeKapalTunda) === -1) {
								checkunique.push($scope.kapalTundaArray[i].kodeKapalTunda);
							}
						}
					});
						
					if($scope.rightSelection.jenisTunda !== '1' ){
						$scope.tundaGandengGrid = true;
					}
					ReaKapalTundaGandengByPpkJasa.get({noPpkJasa: $scope.rightSelection.noPpkJasa},function(response){
						$scope.kapalTundaGandengArray = response;
					});
				}
			}else{ 
				var getDataPtp = matchDataSelected(item);
				HistoryRevisiTunda.get({noPpkJasa:getDataPtp.noPpkJasa}, function(response){
					if(response.length > 0){
						$scope.rightSelection = response[0];
						$scope.rightSelection.noPpkJasa = getDataPtp.noPpkJasa;
						$scope.rightSelection.lokasiAsal = {mdmgKode:$scope.rightSelection.kodeLokasiAsal, mdmgNama:$scope.rightSelection.namaLokasiAsal};
						$scope.rightSelection.lokasiTujuan = {mdmgKode:$scope.rightSelection.kodeLokasiTujuan, mdmgNama:$scope.rightSelection.namaLokasiTujuan};
						if($scope.rightSelection.statusTunda!==undefined){
							AppParamValue.get({nama:'JENIS_KEG_TUNDA',value:$scope.rightSelection.statusTunda},function(response){
								$scope.realisasitunda.jenisKegiatanText = response[0].caption;
							});
							AppParamValue.get({nama:'JAM_KERJA',value:$scope.rightSelection.statusTunda},function(response){
								$scope.realisasitunda.jamKerjaText = response[0].caption;
							});
						}
						$scope.realisasitunda.jenisTunda = '1';
			 			$scope.realisasitunda.jamKerja = '1';
						$scope.realisasitunda.catatan = '';
						$scope.realisasitunda.jamMulai = $filter('date')($scope.rightSelection.tglMulai, 'HH:mm');
						//$scope.realisasitunda.tglMulai = new Date($scope.rightSelection.tglMulai);
						$scope.realisasitunda.jamSelesai = $filter('date')(new Date(), 'HH:mm');
						//$scope.realisasitunda.tglSelesai = new Date($scope.rightSelection.tglSelesai);
						document.getElementById('tglMulaiTunda').querySelector('input').value = $filter('date')($scope.rightSelection.tglMulai,'dd-MM-yyyy');
						document.getElementById('tglSelesaiTunda').querySelector('input').value = $filter('date')(new Date(),'dd-MM-yyyy');
						
						ReaKapalTundaByPpkJasa.get({noPpkJasa: $scope.rightSelection.noPpkJasa},function(response){
							$scope.kapalTundaArray = response
						});
						
						if($scope.rightSelection.jenisTunda !== '1' ){
							$scope.tundaGandengGrid = true;
						}

						ReaKapalTundaGandengByPpkJasa.get({noPpkJasa: $scope.rightSelection.noPpkJasa},function(response){
							$scope.kapalTundaGandengArray = response;
						});	
					}else{
						$scope.rightSelection = getDataPtp;
						$scope.rightSelection.lokasiAsal = {mdmgKode:$scope.rightSelection.kodeLokasiAsal, mdmgNama:$scope.rightSelection.namaLokasiAsal};
						$scope.rightSelection.lokasiTujuan = {mdmgKode:$scope.rightSelection.kodeLokasiTujuan, mdmgNama:$scope.rightSelection.namaLokasiTujuan};
						if($scope.rightSelection.statusTunda!==undefined){
							AppParamValue.get({nama:'JENIS_KEG_TUNDA',value:$scope.rightSelection.statusTunda},function(response){
								$scope.realisasitunda.jenisKegiatanText = response[0].caption;
							});
							AppParamValue.get({nama:'JAM_KERJA',value:$scope.rightSelection.statusTunda},function(response){
								$scope.realisasitunda.jamKerjaText = response[0].caption;
							});
						}
						$scope.realisasitunda.jenisTunda = '1';
			 			$scope.realisasitunda.jamKerja = '1';
						$scope.realisasitunda.catatan = '';
						$scope.realisasitunda.jamMulai = $filter('date')($scope.rightSelection.tglMulai, 'HH:mm');
						//$scope.realisasitunda.tglMulai = new Date($scope.rightSelection.tglMulai);
						$scope.realisasitunda.jamSelesai = $filter('date')(new Date(), 'HH:mm');
						//$scope.realisasitunda.tglSelesai = new Date($scope.rightSelection.tglSelesai);
						document.getElementById('tglMulaiTunda').querySelector('input').value = $filter('date')($scope.rightSelection.tglMulai,'dd-MM-yyyy');
						document.getElementById('tglSelesaiTunda').querySelector('input').value = $filter('date')(new Date(),'dd-MM-yyyy');
						
						ReaKapalTundaByPpkJasa.get({noPpkJasa: $scope.rightSelection.noPpkJasa},function(response){
							$scope.kapalTundaArray = response
						});
						
						if($scope.rightSelection.jenisTunda !== '1' ){
							$scope.tundaGandengGrid = true;
						}

						ReaKapalTundaGandengByPpkJasa.get({noPpkJasa: $scope.rightSelection.noPpkJasa},function(response){
							$scope.kapalTundaGandengArray = response;
						});	
					}
				})
				if(fakeSelect.flagFake == true){ 
					$scope.rightSelection.kodeLokasiAsal = dataModeRealisasi.kodeLokasiAsal;
					$scope.rightSelection.namaLokasiAsal = dataModeRealisasi.namaLokasiAsal;
					$scope.rightSelection.kodeLokasiTujuan = dataModeRealisasi.kodeLokasiTujuan;
					$scope.rightSelection.namaLokasiTujuan = dataModeRealisasi.namaLokasiTujuan;
					document.getElementById('tglMulaiTunda').querySelector('input').value = $filter('date')(new Date(),'dd-MM-yyyy');
					$scope.realisasitunda.jamMulai = $filter('date')(new Date(), 'HH:mm'); 
					$scope.realisasitunda.jenisTunda = '1';
			 		$scope.realisasitunda.jamKerja = '1';
					$scope.realisasitunda.catatan = '';
					$scope.tundaGandengGrid = false;
					$scope.rightSelection.flagFake = true;
				}
			}
			setTimeout(function(){
				setDisableDate();
	 		}, 500);
		});
	}

	var handleSelectRight = function (item, e) {
		$scope.rightReadOnly = true;
		$scope.getRealisasiTundaDetailbyPpkJasa(item);
	};

	var handleDblClickRight = function(item, e){
		$scope.rightReadOnly = false;
		$scope.getRealisasiTundaDetailbyPpkJasa(item);
	}

	// untuk membandingkan scope yang akan di-push; identifier adalah properti dari item
	var isIncludeItem = function(array, item, identifier){
		var match = false;
		if(array){
			for(var i=0,len=array.length;i<len;i++){
				if(array[i][identifier]==item[identifier]){
					match = true;
				}
			}
		}

		return match;
	};

	$scope.$on('editByListNoPPKJasa', function(event, item) {
		$('.btn-list-mobile').removeClass('fa-pencil-square').addClass('fa-pencil-square-o');
		$('#datarea-'+item.noPpkJasa).removeClass('fa-pencil-square-o').addClass('fa-pencil-square');
 		handleSelectRight(item);
 		handleDblClickRight(item);
	});

	$scope.validationLookupAsalTunda = function(){
		if($scope.valueField !== $scope.rightSelection.namaLokasiAsal){
			if(typeof $scope.rightSelection.namaLokasiAsal != 'object'){
				$scope.setNotification  = {
					type	: 'warning',
					message	: 'Data yang Anda Masukan, <b>Tidak Ada dalam Pilihan</b>.<br><br>Kode validasi : <b>VALREA-008</b>'
				};
				Notification.setNotification($scope.setNotification);
				$scope.rightSelection.namaLokasiAsal = '';
			}
		}
	}

	$scope.validationLookupTujuanTunda = function(){
		if($scope.valueField !== $scope.rightSelection.namaLokasiTujuan){
			if(typeof $scope.rightSelection.namaLokasiTujuan != 'object'){
				$scope.setNotification  = {
					type	: 'warning',
					message	: 'Data yang Anda Masukan, <b>Tidak Ada dalam Pilihan</b>.<br><br>Kode validasi : <b>VALREA-008</b>'
				};
				Notification.setNotification($scope.setNotification);
				$scope.rightSelection.namaLokasiTujuan = '';
			}
		}
	}
	
	$scope.validationLookupKapalTunda = function(){
		if($scope.valueField !== $scope.kapalTunda.kapal){
			if(typeof $scope.kapalTunda.kapal != 'object'){
				$scope.setNotification  = {
					type	: 'warning',
					message	: 'Data yang Anda Masukan, <b>Tidak Ada dalam Pilihan</b>.<br><br>Kode validasi : <b>VALREA-009</b>'
				};
				Notification.setNotification($scope.setNotification);
				$scope.kapalTunda.kapal = '';
			}
		}
	}

	$scope.validationLookupTundaGandengAsal = function(){
		if($scope.valueField !== $scope.kapalTundaGandeng.namaLokasiAsal){
			if(typeof $scope.kapalTundaGandeng.namaLokasiAsal != 'object'){
				$scope.setNotification  = {
					type	: 'warning',
					message	: 'Data yang Anda Masukan, <b>Tidak Ada dalam Pilihan</b>.<br><br>Kode validasi : <b>VALREA-009</b>'
				};
				Notification.setNotification($scope.setNotification);
				$scope.kapalTundaGandeng.namaLokasiAsal = '';
			}
		}
	}

	$scope.validationLookupTundaGandengTujuan = function(){
		if($scope.valueField !== $scope.kapalTundaGandeng.namaLokasiTujuan){
			if(typeof $scope.kapalTundaGandeng.namaLokasiTujuan != 'object'){
				$scope.setNotification  = {
					type	: 'warning',
					message	: 'Data yang Anda Masukan, <b>Tidak Ada dalam Pilihan</b>'
				};
				Notification.setNotification($scope.setNotification);
				$scope.kapalTundaGandeng.namaLokasiTujuan = '';
			}
		}
	}

	$scope.moveSelection = function(){
		if(dataModeRealisasi != null){
			if(dataModeRealisasi.mode == '3'){
				if(dataModeRealisasi.jenisGerakan == '2'){
					if(tmpmoderea.length <= 1){
						$scope.setNotification  = {
							type	: 'warning',
							message	: 'Anda Memilih 2 Penetapan 1 Realisasi, Silahkan Pilih Lebih dari 1 No. PPK Jasa.<br><br>Kode validasi : <b>VALREA-017</b>'
						};
						Notification.setNotification($scope.setNotification);
						return false;
					}
				}			
			}

			if(dataModeRealisasi.mode == '2'){
				var match = isIncludeItem($scope.itemSelected, $scope.tempSelection, 'noPpkJasa');
				if(!match){ 
					$scope.avoidClick = true;
					var select = JSON.parse(JSON.stringify($scope.tempSelection));
					
					$scope.itemSelected.push(select);

					var idx = $scope.itemSelected.indexOf(select);
					$scope.configRight.selectedItems.push($scope.itemSelected[idx]);
					$scope.rightSelection = $scope.itemSelected[idx];
					switch(dataModeRealisasi.jenisGerakan) {
					    case '1':
							$scope.rightSelection.kodeLokasiAsal = dataModeRealisasi.kodeLokasiAsal;
							$scope.rightSelection.namaLokasiAsal = dataModeRealisasi.namaLokasiAsal;
							$scope.rightSelection.kodeLokasiTujuan = dataModeRealisasi.kodeLokasiTujuan;
							$scope.rightSelection.namaLokasiTujuan = dataModeRealisasi.namaLokasiTujuan; 
							$scope.realisasitunda.jenisTunda = '1';
					 		$scope.realisasitunda.jamKerja = '1';
							$scope.realisasitunda.catatan = '';
					        break;
					    case '2':	    
							$scope.rightSelection.lokasiAsal = {mdmgNama:dataModeRealisasi.namaAsal, mdmgKode:dataModeRealisasi.kodeAsal};
							$scope.rightSelection.lokasiTujuan = {mdmgNama:dataModeRealisasi.namaTujuan, mdmgKode:dataModeRealisasi.kodeTujuan};
							$scope.rightSelection.kodeLokasiAsal = dataModeRealisasi.kodeAsal;
							$scope.rightSelection.namaLokasiAsal = dataModeRealisasi.namaAsal;
							$scope.rightSelection.kodeLokasiTujuan = dataModeRealisasi.kodeTujuan;
							$scope.rightSelection.namaLokasiTujuan = dataModeRealisasi.namaTujuan; 
							$scope.realisasitunda.jenisTunda = '1';
				 			$scope.realisasitunda.jamKerja = '1';
							$scope.realisasitunda.catatan = '';
							fakeSelect.noPpkJasa = '<no. PPK Jasa>';
							fakeSelect.noPpk1 = '';
							fakeSelect.flagFake = true;
							$scope.itemSelected.push(fakeSelect);
					        break;
					    case '3':
							$scope.rightSelection.lokasiAsal = {mdmgNama:dataModeRealisasi.namaAsal, mdmgKode:dataModeRealisasi.kodeAsal};
							$scope.rightSelection.lokasiTujuan = {mdmgNama:dataModeRealisasi.namaTujuan, mdmgKode:dataModeRealisasi.kodeTujuan};
							$scope.rightSelection.kodeLokasiAsal = dataModeRealisasi.kodeAsal;
							$scope.rightSelection.namaLokasiAsal = dataModeRealisasi.namaAsal;
							$scope.rightSelection.kodeLokasiTujuan = dataModeRealisasi.kodeTujuan;
							$scope.rightSelection.namaLokasiTujuan = dataModeRealisasi.namaTujuan; 
							$scope.realisasitunda.jenisTunda = '1';
				 			$scope.realisasitunda.jamKerja = '1';
							$scope.realisasitunda.catatan = '';
							break;
					}

					$scope.rightReadOnly = false;					
				}				
			}else if(dataModeRealisasi.mode == '3'){
				var match = isIncludeItem($scope.itemSelected, tmpmoderea[0], 'noPpkJasa');
				if(!match){
					$scope.avoidClick = true;
					var select = JSON.parse(JSON.stringify(tmpmoderea[0]));
					
					$scope.itemSelected.push(select);

					var idx = $scope.itemSelected.indexOf(select);
					$scope.configRight.selectedItems.push($scope.itemSelected[idx]);
					$scope.rightSelection = $scope.itemSelected[idx];
					$scope.rightSelection.kodeLokasiAsal = dataModeRealisasi.kodeLokasiAsal;
					$scope.rightSelection.namaLokasiAsal = dataModeRealisasi.namaLokasiAsal;
					$scope.rightSelection.kodeLokasiTujuan = dataModeRealisasi.kodeLokasiTujuan;
					$scope.rightSelection.namaLokasiTujuan = dataModeRealisasi.namaLokasiTujuan; 
					$scope.realisasitunda.jenisTunda = '1';
			 		$scope.realisasitunda.jamKerja = '1';
					$scope.realisasitunda.catatan = '';
					$scope.rightSelection.childmode = tmpmoderea[1].noPpkJasa;

					$scope.rightReadOnly = false;					
				}
			}else{
			/*normal*/
				if($scope.tempSelection != null){
					var match = isIncludeItem($scope.itemSelected, $scope.tempSelection, 'noPpkJasa');
					if(!match){
						$scope.avoidClick = true;
						var select = JSON.parse(JSON.stringify($scope.tempSelection));

						$scope.itemSelected.push(select);
						var idx = $scope.itemSelected.indexOf(select);
						$scope.configRight.selectedItems.push($scope.itemSelected[idx]);
							
						$scope.rightSelection = $scope.itemSelected[idx];
						$scope.realisasitunda.jenisTunda = '1';
				 		$scope.realisasitunda.jamKerja = '1';
						$scope.realisasitunda.catatan = '';
						$scope.realisasitunda.tglMulai = $scope.itemSelected[idx].tglMulai;
						$scope.realisasitunda.jamMulai = $scope.itemSelected[idx].jamMulai;
							
						$scope.rightReadOnly = false;
					}
				}
			/*--*/
			}
		}else{
			/*normal*/
			if($scope.tempSelection != null){
				var match = isIncludeItem($scope.itemSelected, $scope.tempSelection, 'noPpkJasa');
				if(!match){
					$scope.avoidClick = true;
					var select = JSON.parse(JSON.stringify($scope.tempSelection));

					$scope.itemSelected.push(select);
					var idx = $scope.itemSelected.indexOf(select);
					$scope.configRight.selectedItems.push($scope.itemSelected[idx]);
						
					$scope.rightSelection = $scope.itemSelected[idx];
					$scope.realisasitunda.jenisTunda = '1';
			 		$scope.realisasitunda.jamKerja = '1';
					$scope.realisasitunda.catatan = '';
					$scope.realisasitunda.tglMulai = $scope.itemSelected[idx].tglMulai;
					$scope.realisasitunda.jamMulai = $scope.itemSelected[idx].jamMulai;
						
					$scope.rightReadOnly = false;
				}
			}
			/*--*/
		}
	};
	
	/*get after mode realisasi*/
	var getdatarea = function(){
		var tempTundaItem = [];
		PenetapanDetail.get({ppk1: $routeParams.ppk1, urutan: $routeParams.urutan}, function(response) {
			var jasa = [];
			var temp = response;
			for (var i = 0; i < temp.details[0].ptpJasa.length; i++) {
				var namaJasa = temp.details[0].ptpJasa[i].nama.substr(temp.details[0].ptpJasa[i].nama.indexOf("_") + 1);
				jasa.push(namaJasa);
				if(temp.details[0].ptpJasa[i].status != 9){
					 if (namaJasa === "tunda") {
						if(temp.details[0].ptpJasa[i].status  != 10){
							tempTundaItem.push(temp.details[0].ptpJasa[i]);
						}
					}				
				}
			}
			$scope.items =  JSON.parse(JSON.stringify(tempTundaItem));
			$scope.items = $filter('orderBy')($scope.items, 'noPpkJasa');
		});
	}

/*------------------*/
	var getalldataTunda = function(){
		var tempAllDataTunda = [];
		PermohonanDetail.get({id:$routeParams.ppk1},function(response){
			if(response.details.length > 0){
				for (var i = 0; i < response.details.length; i++) {
					if(response.details[i].status === 'C' || response.details[i].status === 'R'){
						PenetapanDetail.get({ppk1: $routeParams.ppk1, urutan: response.details[i].urutanPermohonan}, function(response) {
							var jasa = [];
							var temp = response;
							for (var i = 0; i < temp.details[0].ptpJasa.length; i++) {
								var namaJasa = temp.details[0].ptpJasa[i].nama.substr(temp.details[0].ptpJasa[i].nama.indexOf("_") + 1);
								if(temp.details[0].ptpJasa[i].status != 9){
									if (namaJasa === "tunda") {
										if(temp.details[0].ptpJasa[i].status  != 10){
											if(temp.details[0].ptpJasa[i].status  != 2){
												tempAllDataTunda.push(temp.details[0].ptpJasa[i]);
											}
										}
									}
									if (namaJasa === "pandu") {
										if(temp.details[0].ptpJasa[i].status  != 10){
											if(temp.details[0].ptpJasa[i].status  != 2){
												tempAllDataPandu.push(temp.details[0].ptpJasa[i]);
											}
										}
									}				
								}
							}							
							if(tempAllDataTunda.length > 0){
								$scope.items =  $filter('orderBy')(JSON.parse(JSON.stringify(tempAllDataTunda)), 'noPpkJasa');
								$scope.tundaItems = $scope.items;
							}			
						});	

					}					
				}
				
			}
		})
	};

	var saveAwal = function(arraypmh, arrayptp, arrayrea, noPpkJasa){ 
		PermohonanTunda.save(arraypmh, function(responsepmh) {
			arrayptp.noPpkJasa = responsepmh.noPpkJasa;
			PenetapanTunda.save(arrayptp, function(responseptp){ 
				arrayrea.noPpkJasa = responsepmh.noPpkJasa;
				arrayrea.dokumen = $scope.uploadFile === undefined || $scope.uploadFile.length === 0 ? null : $scope.uploadFile[0].name;

			    //untuk menyimpan file upload
			    if(arrayrea.jenisTunda==='4' && arrayrea.dokumen){
				    var fileName = arrayrea.dokumen;
				    var fileExtension = fileName.replace(/^.*\./, '');
				    if(fileExtension === 'pdf' || fileExtension === 'PDF' || fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'JPG' || fileExtension === 'JPEG'){
				      if(fileExtension==='pdf' || fileExtension==='PDF'){
				        arrayrea.dokumen = arrayrea.dokumen.replace(fileExtension,'pdf');
				      }else{
				        arrayrea.dokumen = arrayrea.dokumen.replace(fileExtension,'jpg');
				      }
				    }else{
				      $scope.setNotification  = {
				          type    : "warning", //ex : danger, warning, success, info
				          message : "Dokumen pendukung harus format PDF dan JPG"
				      };
				      Notification.setNotification($scope.setNotification);
				      return;
				    }

			    }else{
			    	arrayrea.dokumen = '';
			    }

				var formData = new FormData();
				formData.append('reaTunda', new Blob([JSON.stringify(arrayrea)], { type: "application/json" }));
				if ($scope.uploadFile !== undefined && $scope.uploadFile.length > 0 && arrayrea.jenisTunda==='4') formData.append("file", $scope.uploadFile[0]);

				RealisasiTunda.save(formData, function(responserea){ 
					if (responserea.id) {
						if($scope.kapalTundaArray.length > 0){					
							for (var y = 0; y < $scope.kapalTundaArray.length; y++) {							
								$scope.kapalTunda[y] = $scope.kapalTundaArray[y];
								$scope.kapalTunda[y].noPpk1 = responserea.noPpk1;
								$scope.kapalTunda[y].noPpkJasa = responserea.noPpkJasa;
								AddReaKapalTunda.save($scope.kapalTunda[y],function(response){
									$scope.setNotification  = {
										type	: "success", 
										message	: "Data berhasil tersimpan"
									};
									Notification.setNotification($scope.setNotification);
								},function(){
									$scope.setNotification  = {
										type	: "warning",
										message	: "Data tidak berhasil tersimpan"
									};
									Notification.setNotification($scope.setNotification);
								});
							}
							checkunique = [];						
						}
						if($scope.kapalTundaGandengArray.length > 0){			
							for (var y = 0; y < $scope.kapalTundaGandengArray.length; y++) {							
								$scope.kapalTundaGandeng[y] = $scope.kapalTundaGandengArray[y];
								$scope.kapalTundaGandeng[y].noPpk1 = responserea.noPpk1;
								$scope.kapalTundaGandeng[y].noPpkJasa = responserea.noPpkJasa;
								AddReaKapalTundaGandeng.save($scope.kapalTundaGandeng[y],function(response){
									$scope.setNotification  = {
										type	: "success", 
										message	: "Data berhasil tersimpan"
									};
									Notification.setNotification($scope.setNotification);
								},function(){
									$scope.setNotification  = {
										type	: "warning",
										message	: "Data tidak berhasil tersimpan"
									};
									Notification.setNotification($scope.setNotification);
								});
							}						
						}
						var note  = {
							type	: "success",
							message	: "Data berhasil tersimpan"
						};
						Notification.setNotification(note);
						BindEskalasi.setDefaultEskalasi();

						/*Hapus permohonan tunda bila jenis pandu normal*/
						if(dataModeRealisasi.jenisGerakan == '1'){
							PenetapanTundaDelete.delete({ppkjasa: noPpkJasa},{},function(){
								console.log('terhapus');
							});
							PermohonanTundaDelete.delete({id: noPpkJasa},{},function(){
								console.log('terhapus');
							});						
						}						
						
						setTimeout(function(){
							tmpmoderea = [];
							$scope.items = [];
							getdatarea();
				 		}, 1000);
					} else {
						var note = {
							type: "error",
							message: "Data gagal disimpan"
						};
						Notification.setNotification(note);
					}
				})				
			})
		});	
	}

	var savedetail = function(arraytunda){ 
		var arraypmh = {};
		var arrayptp = {};
		var arrayrea = {};

		arraypmh.noPpk1 = arraytunda.noPpk1;
		arraypmh.tglMulai = arraytunda.tglMulai;
		arraypmh.tglSelesai = arraytunda.tglSelesai;
		arraypmh.kodeLokasiAsal = arraytunda.kodeLokasiAsal;
		arraypmh.namaLokasiAsal = arraytunda.namaLokasiAsal;
		arraypmh.kodeLokasiTujuan = arraytunda.kodeLokasiTujuan;
		arraypmh.namaLokasiTujuan = arraytunda.namaLokasiTujuan;

		arrayptp.noPpk1 = arraytunda.noPpk1;
		arrayptp.tglSetuju = arraytunda.tglMulai;
		arrayptp.kodeLokasiAsal = arraytunda.kodeLokasiAsal;
		arrayptp.namaLokasiAsal = arraytunda.namaLokasiAsal;
		arrayptp.kodeLokasiTujuan = arraytunda.kodeLokasiTujuan;
		arrayptp.namaLokasiTujuan = arraytunda.namaLokasiTujuan;
		arrayptp.tglMulai = arraytunda.tglMulai;

		arrayrea.noPpk1 = arraytunda.noPpk1;
		arrayrea.tglMulai = arraytunda.tglMulai;
		arrayrea.tglSelesai = arraytunda.tglSelesai;
		arrayrea.jamKerja = parseInt(arraytunda.jamKerja);
		arrayrea.jenisTunda = arraytunda.jamKerja;
		arrayrea.namaLokasiAsal = arraytunda.namaLokasiAsal;
		arrayrea.kodeLokasiAsal = arraytunda.kodeLokasiAsal;
		arrayrea.namaLokasiTujuan = arraytunda.namaLokasiTujuan;
		arrayrea.kodeLokasiTujuan = arraytunda.kodeLokasiTujuan;	
		arrayrea.dokumen = arraytunda.dokumen;

		arraypmh.detailPmhId = dataModeRealisasi.detailPmhId;
		arraypmh.urutanPermohonan = dataModeRealisasi.urutan;

		if(dataModeRealisasi.jenisGerakan == '1'){
			saveAwal(arraypmh,arrayptp,arrayrea,arraytunda.noPpkJasa);
		}else{//if(dataModeRealisasi.jenisGerakan == '2') 
			if(arraytunda.noPpkJasa == undefined){ 
				saveAwal(arraypmh,arrayptp,arrayrea,arraytunda.noPpkJasa);
			}else{
				arrayrea.noPpkJasa = arraytunda.noPpkJasa; 
				if(arrayrea.jenisTunda==='4' && arrayrea.dokumen){
				    var fileName = arrayrea.dokumen;
				    var fileExtension = fileName.replace(/^.*\./, '');
				    if(fileExtension === 'pdf' || fileExtension === 'PDF' || fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'JPG' || fileExtension === 'JPEG'){
				      if(fileExtension==='pdf' || fileExtension==='PDF'){
				        arrayrea.dokumen = arrayrea.dokumen.replace(fileExtension,'pdf');
				      }else{
				        arrayrea.dokumen = arrayrea.dokumen.replace(fileExtension,'jpg');
				      }
				    }else{
				      $scope.setNotification  = {
				          type    : "warning", //ex : danger, warning, success, info
				          message : "Dokumen pendukung harus format PDF dan JPG"
				      };
				      Notification.setNotification($scope.setNotification);
				      return;
				    }
				}else{
			    	arrayrea.dokumen = '';
			    }

				var formData = new FormData();
				formData.append('reaTunda', new Blob([JSON.stringify(arrayrea)], { type: "application/json" }));
				if ($scope.uploadFile !== undefined && $scope.uploadFile.length > 0 && arrayrea.jenisTunda==='4') formData.append("file", $scope.uploadFile[0]);

			    RealisasiTunda.save(formData,function(response){
					if(response.id){
						var note  = {
							type	: "success",
							message	: "Data berhasil tersimpan"
						};
						Notification.setNotification(note);
						if($scope.kapalTundaArray.length > 0){					
							for (var y = 0; y < $scope.kapalTundaArray.length; y++) {							
								$scope.kapalTunda[y] = $scope.kapalTundaArray[y];
								$scope.kapalTunda[y].noPpk1 = $scope.dataUmum.noPpk1;
								$scope.kapalTunda[y].noPpkJasa = response.noPpkJasa;
								AddReaKapalTunda.save($scope.kapalTunda[y],function(response){
									$scope.setNotification  = {
										type	: "success", 
										message	: "Data berhasil tersimpan"
									};
									Notification.setNotification($scope.setNotification);
									BindEskalasi.setDefaultEskalasi();
								},function(){
									$scope.setNotification  = {
										type	: "warning",
										message	: "Data tidak berhasil tersimpan"
									};
									Notification.setNotification($scope.setNotification);
								});
							}
							checkunique = [];						
						}
						if($scope.kapalTundaGandengArray.length > 0){			
							for (var y = 0; y < $scope.kapalTundaGandengArray.length; y++) {							
								$scope.kapalTundaGandeng[y] = $scope.kapalTundaGandengArray[y];
								$scope.kapalTundaGandeng[y].noPpk1 = $scope.dataUmum.noPpk1;
								$scope.kapalTundaGandeng[y].noPpkJasa = response.noPpkJasa;
								AddReaKapalTundaGandeng.save($scope.kapalTundaGandeng[y],function(response){
									$scope.setNotification  = {
										type	: "success", 
										message	: "Data berhasil tersimpan"
									};
									Notification.setNotification($scope.setNotification);
									BindEskalasi.setDefaultEskalasi();
								},function(){
									$scope.setNotification  = {
										type	: "warning",
										message	: "Data tidak berhasil tersimpan"
									};
									Notification.setNotification($scope.setNotification);
								});
							}						
						}
					}else{
						var note  = {
							type	: "error",
							message	: "Data gagal disimpan"
						};
						Notification.setNotification(note);
					}
					setDefaultTgl();
					if(dataModeRealisasi.jenisGerakan == '2'){
						$('html,body').scrollTop(0);
						if($scope.itemSelected.length > 0){
							for (var i = 0; i < $scope.itemSelected.length; i++) {
								if($scope.itemSelected[i].flagFake){					
									$scope.configRight.selectedItems.push($scope.itemSelected[i]);
									handleSelectRight($scope.itemSelected[i]);
									break;
								}
							}
						}					
					}

					$scope.kapalTundaArray = [];
					$scope.kapalTundaGandengArray = [];
					$scope.kapalTunda = {};
					$scope.kapalTundaGandeng = {};
				},function(response){
					var note  = {
						type	: "error",
						message	: "Data gagal disimpan"
					};
					Notification.setNotification(note);
				});			
			}
		}
	}

	$scope.openTab = function(evt){
		var i, tabcontent, tablinks;
		tabcontent = document.getElementsByClassName("tab-pane");
		for (i = 0; i < tabcontent.length; i++) {
			tabcontent[i].style.display = "none";
		}
		tablinks = document.getElementsByClassName("tablinks");
		for (i = 0; i < tablinks.length; i++) {
			tablinks[i].className = tablinks[i].className.replace(" active", "");
		}
		menuJasa = document.getElementsByClassName("menu-jasa");
		for (i = 0; i < menuJasa.length; i++) {
			menuJasa[i].className = menuJasa[i].className.replace(" active", "");
		}
		document.getElementById("panduTab").style.display = "block";
		document.getElementById("pandu").style.display = "block";		
		$('.tab-pandu').addClass("active");

		if(tempAllDataPandu.length > 0){
			var dataPandu = {};
			dataPandu.bindData = true;
			dataPandu.content = tempAllDataPandu;
			JasaPandu.addJasaPandu(dataPandu);
		}
	}

	$scope.confirmSimpanTunda = function(){
		var jamMulai = document.getElementById('timetundaMulai').querySelector('input').value;
		var jamSelesai = document.getElementById('timetundaSelesai').querySelector('input').value;
		var 
			tglMulai,
			tglSelesai;

		if(typeof $scope.realisasitunda.tglMulai === 'object'){
			if($scope.realisasitunda.tglMulai.toString().indexOf('-') === -1){
				tglMulai = $filter('date')($scope.realisasitunda.tglMulai,'yyyy-MM-dd')+'T'+jamMulai;
			}
		}else{
			var formatTglMulai = $scope.realisasitunda.tglMulai.split('-');
			var newFormatTglMulai = formatTglMulai[1]+'-'+formatTglMulai[0]+'-'+formatTglMulai[2];
			tglMulai = $filter('date')(new Date(newFormatTglMulai),'yyyy-MM-dd')+'T'+jamMulai;
		}

		if($scope.realisasitunda.tglSelesai != null){
			if(typeof $scope.realisasitunda.tglSelesai === 'object'){
				if($scope.realisasitunda.tglSelesai.toString().indexOf('-') === -1){
					tglSelesai = $filter('date')($scope.realisasitunda.tglSelesai,'yyyy-MM-dd')+'T'+jamSelesai;
				}
			}else{
				var formatTglSelesai = $scope.realisasitunda.tglSelesai.split('-');
				var newFormatTglSelesai = formatTglSelesai[1]+'-'+formatTglSelesai[0]+'-'+formatTglSelesai[2];
				tglSelesai = $filter('date')(new Date(newFormatTglSelesai),'yyyy-MM-dd')+'T'+jamSelesai;
			}				
		}

		var 
			parseTglMulai = Date.parse(tglMulai),
			parseTglSelesai = Date.parse(tglSelesai),
			hourDiff = parseTglSelesai-parseTglMulai,
			minDiff = hourDiff / 60 / 1000;

		// start Validasi Tgl & Jam Mulai harus melebihi Tgl & Jam Selesai
		if(parseTglMulai>=parseTglSelesai){
			var note =  {
							type 	: "warning",
							message : "Tgl & Jam Selesai harus melebihi Tgl & Jam Mulai.<br><br>Kode validasi : <b>VALREA-001</b>"
						};
			Notification.setNotification(note);
			$scope.resetTunda();
			return false;
		}
		// end Validasi Tgl & Jam Mulai harus melebihi Tgl & Jam Selesai

		if(minDiff>180 && $scope.realisasitunda.jenisTunda=='1'){
			$('#confirmInfoJamTunda').modal('show');
		}else{
			$scope.saveTunda();
		}
	}

	$scope.saveTunda= function(){
		if($scope.configRight.selectedItems.length>0){
			var jamMulai = document.getElementById('timetundaMulai').querySelector('input').value;
			var jamSelesai = document.getElementById('timetundaSelesai').querySelector('input').value;
			$scope.realisasitunda.noPpk1 = $scope.dataUmum.noPpk1;
			$scope.realisasitunda.noPpkJasa = $scope.rightSelection.noPpkJasa;
			$scope.realisasitunda.jamKerja = parseInt($scope.realisasitunda.jamKerja);

			// var jamMulai = $scope.realisasitunda.jamMulai;
			// var jamSelesai = $scope.realisasitunda.jamSelesai;
			$scope.realisasitunda.noPpk1 = $scope.dataUmum.noPpk1;
			$scope.realisasitunda.noPpkJasa = $scope.rightSelection.noPpkJasa;
			$scope.realisasitunda.jamKerja = parseInt($scope.realisasitunda.jamKerja);

			if(typeof $scope.realisasitunda.tglMulai === 'object'){
				if($scope.realisasitunda.tglMulai.toString().indexOf('-') === -1){
					$scope.realisasitunda.tglMulai = $filter('date')($scope.realisasitunda.tglMulai,'yyyy-MM-dd')+'T'+jamMulai;
				}
			}else{
				var formatTglMulai = $scope.realisasitunda.tglMulai.split('-');
				var newFormatTglMulai = formatTglMulai[1]+'-'+formatTglMulai[0]+'-'+formatTglMulai[2];
				$scope.realisasitunda.tglMulai = $filter('date')(new Date(newFormatTglMulai),'yyyy-MM-dd')+'T'+jamMulai;
			}

			if($scope.realisasitunda.tglSelesai != null){
				if(typeof $scope.realisasitunda.tglSelesai === 'object'){
					if($scope.realisasitunda.tglSelesai.toString().indexOf('-') === -1){
						$scope.realisasitunda.tglSelesai = $filter('date')($scope.realisasitunda.tglSelesai,'yyyy-MM-dd')+'T'+jamSelesai;
					}
				}else{
					var formatTglSelesai = $scope.realisasitunda.tglSelesai.split('-');
					var newFormatTglSelesai = formatTglSelesai[1]+'-'+formatTglSelesai[0]+'-'+formatTglSelesai[2];
					$scope.realisasitunda.tglSelesai = $filter('date')(new Date(newFormatTglSelesai),'yyyy-MM-dd')+'T'+jamSelesai;
				}				
			}

			if (typeof $scope.rightSelection.namaLokasiAsal === 'object') {
				$scope.realisasitunda.kodeLokasiAsal = $scope.rightSelection.namaLokasiAsal.mdmgKode;
				$scope.realisasitunda.namaLokasiAsal = $scope.rightSelection.namaLokasiAsal.mdmgNama;				
			}else{
				$scope.realisasitunda.namaLokasiAsal = $scope.rightSelection.namaLokasiAsal;
				$scope.realisasitunda.kodeLokasiAsal = $scope.rightSelection.kodeLokasiAsal;
			}
			
			if (typeof $scope.rightSelection.namaLokasiTujuan === 'object') {
				$scope.realisasitunda.kodeLokasiTujuan = $scope.rightSelection.namaLokasiTujuan.mdmgKode;
				$scope.realisasitunda.namaLokasiTujuan = $scope.rightSelection.namaLokasiTujuan.mdmgNama;				
			}else{
				$scope.realisasitunda.namaLokasiTujuan = $scope.rightSelection.namaLokasiTujuan;
				$scope.realisasitunda.kodeLokasiTujuan = $scope.rightSelection.kodeLokasiTujuan;	
			}
			
			var rightPpkJasa = $scope.rightSelection.noPpkJasa;
	        for (var i = 0; i < $scope.items.length; i++) {
	            if ($scope.items[i].noPpkJasa === rightPpkJasa) {
	               var status = $scope.items[i].status;
	            }
	        }

			/*validation form*/
			var R1 = validationForm.required('Lokasi Asal Tunda', $scope.realisasitunda.namaLokasiAsal);
			if(!R1){return R1;}	
			var R2 = validationForm.required('Lokasi Tujuan Tunda', $scope.realisasitunda.namaLokasiTujuan);
			if(!R2){return R2;}	
			var R3 = validationForm.required('Waktu Mulai Pandu', jamMulai);
			if(!R3){return R3;}
			var R4 = validationForm.required('Waktu Mulai Pandu', jamSelesai);
			if(!R4){return R4;}
			var R5 = validationForm.required('Jam Kerja', $scope.realisasitunda.jamKerja);
			if(!R5){return R5;}
			var R6 = validationForm.required('Jam Kerja', $scope.realisasitunda.jenisTunda);
			if(!R6){return R6;}

			//untuk menyimpan file upload
			if($scope.realisasitunda.jenisTunda==='4' && $scope.realisasitunda.dokumen){
			    var fileName = $scope.realisasitunda.dokumen;
			    var fileExtension = fileName.replace(/^.*\./, '');
			    if(fileExtension === 'pdf' || fileExtension === 'PDF' || fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'JPG' || fileExtension === 'JPEG'){
			      if(fileExtension==='pdf' || fileExtension==='PDF'){
			        $scope.realisasitunda.dokumen = $scope.realisasitunda.dokumen.replace(fileExtension,'pdf');
			      }else{
			        $scope.realisasitunda.dokumen = $scope.realisasitunda.dokumen.replace(fileExtension,'jpg');
			      }
			    }else{
			      $scope.setNotification  = {
			          type    : "warning", //ex : danger, warning, success, info
			          message : "Dokumen pendukung harus format PDF dan JPG"
			      };
			      Notification.setNotification($scope.setNotification);
			      return;
			    }
			}else{
		    	$scope.realisasitunda.dokumen = '';
		    }

			var formData = new FormData();
			formData.append('reaTunda', new Blob([JSON.stringify($scope.realisasitunda)], { type: "application/json" }));

			if ($scope.uploadFile !== undefined && $scope.uploadFile.length > 0 && $scope.realisasitunda.jenisTunda==='4') formData.append("file", $scope.uploadFile[0]);

	        if($scope.rightSelection.tglVerifikasi === undefined){
	        	if(dataModeRealisasi.mode == '2'){ 
	        		if($scope.rightSelection.flagFake === true){
						$scope.realisasitunda.noPpkJasa = undefined;
					}
					savedetail($scope.realisasitunda);
				}else{			
		        	RealisasiTunda.save(formData,
		        		function(response){
							if(response.id){
								/*mode realisasi*/
								if(dataModeRealisasi.mode == '3'){
									if(dataModeRealisasi.jenisGerakan = '2'){
										JenisRevisiRealisasiTunda.update({ppkjasa:$scope.rightSelection.childmode,jenisRevisi:10}, {},function(response){
											StatusRealisasiTunda.update({ppkjasa:$scope.rightSelection.childmode,status:10}, {},function(response){
												var note = {
													type: "success",
													message: "Data berhasil tersimpan"
												};
												Notification.setNotification(note);
												tmpmoderea = [];
												$scope.items = [];
											});
										});									
									}							
								}							
								/*-----------------*/

								var note  = {
									type	: "success",
									message	: "Data berhasil tersimpan"
								};
								Notification.setNotification(note);
								if($scope.kapalTundaArray.length > 0){	
									$scope.kapalTundaArray.forEach(function(item) {	
										$scope.kapalTunda= item;
										$scope.kapalTunda.noPpk1 = $scope.dataUmum.noPpk1;
										$scope.kapalTunda.noPpkJasa = response.noPpkJasa;
										AddReaKapalTunda.save($scope.kapalTunda,function(response){
											if(response.status != '500'){
												$scope.setNotification  = {
													type	: "success", 
													message	: "Data berhasil tersimpan"
												};
												Notification.setNotification($scope.setNotification);
											}else{
												$scope.setNotification  = {
													type	: "danger",
													message	: response.description
												};
												Notification.setNotification($scope.setNotification);
											}
										},function(){
											$scope.setNotification  = {
												type	: "warning",
												message	: "Data tidak berhasil tersimpan"
											};
											Notification.setNotification($scope.setNotification);
										});
									});														
								}
								if($scope.kapalTundaGandengArray.length > 0){			
									for (var y = 0; y < $scope.kapalTundaGandengArray.length; y++) {							
										$scope.kapalTundaGandeng[y] = $scope.kapalTundaGandengArray[y];
										$scope.kapalTundaGandeng[y].noPpk1 = $scope.dataUmum.noPpk1;
										$scope.kapalTundaGandeng[y].noPpkJasa = response.noPpkJasa;
										AddReaKapalTundaGandeng.save($scope.kapalTundaGandeng[y],function(response){
											$scope.setNotification  = {
												type	: "success", 
												message	: "Data berhasil tersimpan"
											};
											Notification.setNotification($scope.setNotification);
										},function(){
											$scope.setNotification  = {
												type	: "warning",
												message	: "Data tidak berhasil tersimpan"
											};
											Notification.setNotification($scope.setNotification);
										});
									}						
								}
								checkunique = [];
							}
							else{
								var note  = {
									type	: "error",
									message	: "Data gagal disimpan"
								};
								Notification.setNotification(note);
							}
							setDefaultTgl();
						},
						function(response){
							var note  = {
								type	: "error",
								message	: "Data gagal disimpan"
							};
							Notification.setNotification(note);
						}
		        	);					
				}
	        }
	        else {
	        	RealisasiTundaEdit.update({noPpkJasa:$scope.rightSelection.noPpkJasa},formData,
					function(response){
						if(response.id){
							if($scope.kapalTundaUpdateArray.length > 0){	
								$scope.kapalTundaUpdateArray.forEach(function(item) {	
									$scope.kapalTunda= item;
									$scope.kapalTunda.noPpk1 = $scope.dataUmum.noPpk1;
									$scope.kapalTunda.noPpkJasa = response.noPpkJasa;
									AddReaKapalTunda.save($scope.kapalTunda,function(response){
										if(response.status != '500'){
											$scope.setNotification  = {
												type	: "success", 
												message	: "Data berhasil tersimpan"
											};
											Notification.setNotification($scope.setNotification);
										}else{
											$scope.setNotification  = {
												type	: "danger",
												message	: response.description
											};
											Notification.setNotification($scope.setNotification);
										}
									},function(){
										$scope.setNotification  = {
											type	: "warning",
											message	: "Data tidak berhasil tersimpan"
										};
										Notification.setNotification($scope.setNotification);
									});
								});														
							}
							
							if($scope.kapalTundaGandengUpdateArray.length > 0){						
								for (var y = 0; y < $scope.kapalTundaGandengUpdateArray.length; y++) {							
									$scope.kapalTundaGandeng[y] = $scope.kapalTundaGandengUpdateArray[y];
									$scope.kapalTundaGandeng[y].noPpk1 = response.noPpk1;
									$scope.kapalTundaGandeng[y].noPpkJasa = response.noPpkJasa;
									AddReaKapalTundaGandeng.save($scope.kapalTundaGandeng[y],function(response){
										$scope.setNotification  = {
											type	: "success", 
											message	: "Data berhasil tersimpan"
										};
										Notification.setNotification($scope.setNotification);
									},function(){
										$scope.setNotification  = {
											type	: "warning",
											message	: "Data tidak berhasil tersimpan"
										};
										Notification.setNotification($scope.setNotification);
									});	
								}						
							}
							checkunique = [];
							var note  = {
								type	: "success",
								message	: "Data berhasil tersimpan"
							};
							Notification.setNotification(note);								
							setDefaultTgl();
							$scope.resetTunda();
							if(response.status===2){
								UpdateStatusReaAfterEskalasi.update({noPpkJasa:response.noPpkJasa},{},function(response){
									console.log(response);
								});
							}
							BindEskalasi.setDefaultEskalasi();
						}else{
							var note  = {
								type	: "error",
								message	: "Data gagal disimpan"
							};
							Notification.setNotification(note);
						}
					},
					function(response){
						var note  = {
							type	: "error",
							message	: "Data gagal disimpan"
						};
						Notification.setNotification(note);
					}
				);
	        }

			$scope.configRight.selectedItems = [];
			$scope.avoidClick = false;
			$scope.rightReadOnly = true;
		}
	};


	$scope.config = {
		selectItems: true,
		multiSelect: false,
		dblClick: false,
		selectionMatchProp: 'noPpkJasa',
		selectedItems: [],
		showSelectBox: false,
		onSelect: handleSelect,
	};

	$scope.configRight = {
		selectItems: true,
		multiSelect: false,
		dblClick: true,
		selectionMatchProp: 'noPpkJasa',
		selectedItems: [],
		showSelectBox: false,
		onSelect: handleSelectRight,
		onDblClick:handleDblClickRight,
	};

	//function reset tunda
	$scope.resetTunda = function() {
		$scope.avoidClick = false;
		var select = [];
		$scope.itemSelected = select;

		var idx = $scope.itemSelected.indexOf(select);
		$scope.configRight.selectedItems.shift($scope.itemSelected[idx]);
		$scope.rightSelection = $scope.itemSelected[idx];
		$scope.rightReadOnly = true;
		$scope.realisasitunda.jamKerja = '1';	
		$scope.kapalTundaArray = [];
		$scope.kapalTundaUpdateArray = [];
		$scope.kapalTundaGandengArray = [];
		$scope.kapalTundaGandengUpdateArray = [];
		checkunique = [];
		getTundaItems();
	};

	//autocomplete
	$scope.getListKapal = function(value) {
		if (value) {
			return new Promise(function(resolve, reject) {
				MdmKapalSearchByName.get({
					"nama": value,
					"limit": 10
				}, function(response) {
					resolve(response);
				});
			});
		}
	};

	//submit kapal tunda
	$scope.submitKapalTunda = function(){
		var temp = $scope.kapalTunda.kapal;
		var kapalInfo = {};
		$scope.kapalTunda.kapal = '';
		if (checkunique.indexOf(temp.noRegistrasi) === -1) {
		    checkunique.push(temp.noRegistrasi);
			kapalInfo.kodeKapalTunda = temp.noRegistrasi;
			kapalInfo.namaKapalTunda = temp.nama;
			$scope.kapalTundaArray.push(kapalInfo);
			if ($scope.itemSelected.length > 0) {
				$scope.kapalTundaUpdateArray.push(kapalInfo);
			}
			$('#kplTundaModal').modal('hide');
		} else if (checkunique.indexOf(temp.noRegistrasi) > -1) {
			$('#kplTundaModal').modal('hide');
			$scope.setNotification  = {
				type	: 'warning',
				message	: 'Kapal '+ temp.nama + ' sudah dientry. <br> Silahkan Masukan Nama Kapal Lain.<br><br>Kode validasi : <b>VALREA-010<b>'
			};
			Notification.setNotification($scope.setNotification);
			$scope.kapalTunda.kapal = '';
		}			
	}

	$scope.deleteKapalTundaView = function(i){
		var checkDeleteTunda = confirm('Apakah Anda akan Menghapus data ini?');
		if(checkDeleteTunda){
			checkunique.splice(i, 1);
			$scope.kapalTundaArray.splice(i, 1);
			if ($scope.itemSelected.length > 0) {
				$scope.kapalTundaUpdateArray.splice(parseInt(i-1), 1);
			}			
		}
	}

	$scope.deleteKapalTunda = function(idKapalTunda,i){	
		if($scope.kapalTundaArray.length == 1){
			$scope.setNotification  = {
				type	: "warning", 
				message	: "Jasa Tunda harus memiliki minimal satu kapal tunda."
			};
			Notification.setNotification($scope.setNotification);
		}else{
			var checkDeleteTunda = confirm('Apakah Anda akan Menghapus data ini?');
			if(checkDeleteTunda){
				DeleteReaKapalTunda.delete({id:idKapalTunda},function(response){
					if(response.status !== '500'){
						$scope.setNotification  = {
							type	: "success", 
							message	: "Data berhasil dihapus"
						};
						Notification.setNotification($scope.setNotification);
						$scope.kapalTundaArray.splice(i, 1);
						if ($scope.itemSelected.length > 0) {
							$scope.kapalTundaUpdateArray.splice(i, 1);
						}
					}else{
						$scope.setNotification  = {
							type	: "danger",
							message	: "Data tidak berhasil dihapus"
						};
						Notification.setNotification($scope.setNotification);
					}					
				},function(){
					$scope.setNotification  = {
						type	: "danger",
						message	: "Data tidak berhasil dihapus"
					};
					Notification.setNotification($scope.setNotification);
				});				
			}
		}
	}

	//submit kapal tunda gandeng
	$scope.submitKapalTundaGandeng =  function(){
		var tempAsal = $scope.kapalTundaGandeng.namaLokasiAsal;
		var tempTujuan = $scope.kapalTundaGandeng.namaLokasiTujuan;
		var kapalInfo = {};
		// kapalInfo.kodeLokasiAwal = tempAsal.mdmgKode;
		// kapalInfo.namaLokasiAwal = tempAsal.mdmgNama;
		// kapalInfo.kodeLokasiTujuan = tempTujuan.mdmgKode;
		// kapalInfo.namaLokasiTujuan = tempTujuan.mdmgNama;
		kapalInfo.jenisKegiatan = $scope.kapalTundaGandeng.jenisKegiatan;
		AppParamValue.get({nama:'JENIS_KEGIATAN',value:$scope.kapalTundaGandeng.jenisKegiatan},function(response){
			$scope.kapalTundaGandeng.jenisKegiatanText = response[0].caption;
			kapalInfo.jenisKegiatanText = $scope.kapalTundaGandeng.jenisKegiatanText;
		});
		var jamMulai = document.getElementById('jamKGTundaMulai').querySelector('input').value;
		var jamSelesai = document.getElementById('jamKGTundaSelesai').querySelector('input').value;
		kapalInfo.tglMulai = $filter('date')($scope.kapalTundaGandeng.tglMulai, 'yyyy-MM-dd')+'T'+jamMulai;
		kapalInfo.tglSelesai = $filter('date')($scope.kapalTundaGandeng.tglSelesai, 'yyyy-MM-dd')+'T'+jamSelesai; 

		// start Validasi Tgl & Jam Mulai harus melebihi Tgl & Jam Selesai
		var parseTglMulai = Date.parse(kapalInfo.tglMulai);
		var parseTglSelesai = Date.parse(kapalInfo.tglSelesai);
		if(parseTglMulai>=parseTglSelesai){
			var note =  {
							type 	: "warning",
							message : "Data tidak berhasil disimpan, <br> Tgl & Jam Mulai harus melebihi Tgl & Jam Selesai.<br><br>Kode validasi : <b>VALREA-001</b>"
						};
			Notification.setNotification(note);
			return false;
		}
		// end Validasi Tgl & Jam Mulai harus melebihi Tgl & Jam Selesai

		$scope.kapalTundaGandengArray.push(kapalInfo);
		if ($scope.itemSelected.length > 0) {
			$scope.kapalTundaGandengUpdateArray.push(kapalInfo);
		}
		$scope.kapalTundaGandeng.kapal = '';
	}

	$scope.deleteKapalTundaGandengView = function(i){
		var checkDeleteTundaGandeng = confirm('Apakah Anda akan Menghapus data ini?');
		if(checkDeleteTundaGandeng){
			$scope.kapalTundaGandengArray.splice(i, 1);
			if ($routeParams.id != null) {
				$scope.kapalTundaGandengUpdateArray.splice(i, 1);
			}
		}
	}

	$scope.deleteKapalTundaGandeng = function(idKapalTunda,i){
		var checkDeleteTundaGandeng = confirm('Apakah Anda akan Menghapus data ini?');
		if(checkDeleteTundaGandeng){
			DeleteReaKapalTundaGandeng.delete({id:idKapalTunda},function(response){
				if(response.status !== '500'){
					$scope.setNotification  = {
						type	: "success", 
						message	: "Data berhasil dihapus"
					};
					Notification.setNotification($scope.setNotification);
					$scope.kapalTundaArray.splice(i, 1);
				}else{
					$scope.setNotification  = {
						type	: "danger",
						message	: "Data tidak berhasil dihapus"
					};
					Notification.setNotification($scope.setNotification);
				}
				$scope.kapalTundaGandengArray.splice(i, 1);					
			},function(){
				$scope.setNotification  = {
					type	: "danger",
					message	: "Data tidak berhasil dihapus"
				};
				Notification.setNotification($scope.setNotification);
			});	
		}
	}
	// $scope.config.selectedItems.push($scope.items[0]);
	// $scope.tempSelection = $scope.items[0];
	$scope.$watch('realisasitunda.tglMulai', function(){
		setTimeout(function(){
			setDisableDate();
 		}, 500);
	});

	$scope.$watch('realisasitunda.tglSelesai', function(){
		setTimeout(function(){
			setDisableDate();
 		}, 500);
	});

	$scope.$watch('kapalTundaGandeng.tglMulai', function(){
		setTimeout(function(){
			setDisableDateKapalTundaGandeng();
 		}, 500);
	});

	var setDefaultTgl = function(){
		$scope.realisasitunda.tglMulai = $filter('date')(new Date(), 'dd-MM-yyyy');
		$scope.realisasitunda.tglSelesai = $filter('date')(new Date(), 'dd-MM-yyyy');		
		$scope.realisasitunda.jamMulai = $filter('date')(new Date(), 'HH:mm');	
		$scope.realisasitunda.jamSelesai = $filter('date')(new Date(), 'HH:mm');
	}

	var setDisableDate = function(){
		var tglMulai = document.getElementById('tglMulaiTunda').querySelector('input').value;
		var setTglMulai = $('#tglMulaiTunda').datepicker('getDate','+1d');
		if(setTglMulai)setTglMulai.setDate(setTglMulai.getDate() + 1);
		var tglMulaiPlus1Day = $filter('date')(setTglMulai,'dd-MM-yyyy');
		$scope.realisasitunda.tglMulai = $filter('date')(tglMulai,'dd-MM-yyyy');

		$('#tglMulaiTunda').datepicker('update');
	 	//$('#tglSelesaiTunda').datepicker('setStartDate',tglMulai);
	 	$('#tglSelesaiTunda').datepicker('setEndDate',tglMulaiPlus1Day);

	}

	var setDisableDateKapalTundaGandeng = function(){
	 	$('#tglSelesaiKapalTundaGandeng').datepicker('setStartDate',$scope.kapalTundaGandeng.tglMulai);
		$('#tglMulaiKapalTundaGandeng').mask('99-99-9999');
		$('#tglSelesaiKapalTundaGandeng').mask('99-99-9999');
	}

	$scope.createPDF = function(fileName){
		BuildPDF.build(fileName);
	}

	$scope.isKapalTender=false;

	$scope.$watch('realisasitunda.jenisTunda', function(newVal, oldVal){
		if (newVal=='4') {
			$scope.isRequiredDokumen = true;
		} else {
			$scope.isRequiredDokumen = false;
		}
	});
 }]);
