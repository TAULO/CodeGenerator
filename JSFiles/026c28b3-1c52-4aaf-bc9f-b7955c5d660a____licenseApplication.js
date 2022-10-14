appModule.controller('ApplicationCreate', function ($scope, $http, $state) {
    $scope.breadcrumb.splice(0, $scope.breadcrumb.length);
    $scope.title = "New Application";
    $scope.stakeholdersLocations = [{}];
    $scope.takeOffPoints = [{}];
    $scope.gasShipperCustomers = [{}];
    $scope.licenseFees = [];
    $scope.submittingInformation === 'false';
    $scope.submitButtonText = 'Submit Application';
    $scope.breadcrumb.push(
        {
            title: 'License Applications',
            link: 'site.application.list'
        },
        {
            title: $scope.title,
        }
    );
    var maxFileSize = 2500000; // 2 Megabytes
    $scope.licenseApplicationUpload = {
        HoldRelatedLicenseFileName: '', HoldRelatedLicenseFileExtension: '', HoldRelatedLicenseBase64: '',
        HasRelatedLicenseFileName: '', HasRelatedLicenseFileExtension: '', HasRelatedLicenseBase64: '',
        HasLicenseRevokedFileName: '', HasLicenseRevokedFileExtension: '', HasLicenseRevokedLicenseBase64: '',
        HasLicenseRefusedFileName: '', HasLicenseRefusedFileExtension: '', HasLicenseRefusedLicenseBase64: '',
        ProposedArrangementAttachmentFileName: '', ProposedArrangementAttachmentFileExtension: '', ProposedArrangementAttachmentBase64: '',
        DeclarationSignatureFileName: '', DeclarationSignatureFileExtension: '', DeclarationSignatureBase64: '',
        OPLFileName: '', OPLFileExtension: '', OPLBase64: '',
        SafetyCaseFileName: '', SafetyCaseFileExtension: '', SafetyCaseBase64: '',
        SCADAFileName: '', SCADAFileExtension: '', SCADABase64: '',
        GTSFileName: '', GTSFileExtension: '', GTSBase64: '',
        TechnicalAttributeFileName: '', TechnicalAttributeFileExtension: '', TechnicalAttributeBase64: '',
        AuxiliarySystemFileName: '', AuxiliarySystemFileExtension: '', AuxiliarySystemBase64: '',
        TariffAndPricingFileName: '', TariffAndPricingFileExtension: '', TariffAndPricingBase64: '',
        RiskManagmentFileName: '', RiskManagmentFileExtension: '', RiskManagmentBase64: '',
        CommunityMOUFileName: '', CommunityMOUFileExtension: '', CommunityMOUBase64: '',
        NetworkAgentOPLFileName: '', NetworkAgentOPLFileExtension: '', NetworkAgentOPLBase64: '',
        GasShipperOPLFileName: '', GasShipperOPLFileExtension: '', GasShipperOPLBase64: ''
    };
    $scope.licenseApplicationModel = {
        FileUploads: $scope.licenseApplicationUpload,
        StakeholderLocations: $scope.stakeholdersLocations,
        TakeOffPoints: $scope.takeOffPoints,
        GasShipperCustomers: $scope.gasShipperCustomers
    };
    $scope.licenseApplicationModel.EffectiveDate = new Date();
    $scope.licensetypes = [
        { "Name": "Network Agent", "Value": "NetworkAgent", "Selected": true },
        { "Name": "Gas Shipper License", "Value": "GasShipperLicense", "Selected": false },
        { "Name": "Gas Transporter License", "Value": "GasTransporterLicense", "Selected": false }
    ];

    $scope.GasShipperPointType = [
        { "Name": "Delivery", "Value": "Delivery" },
        { "Name": "Take Off", "Value": "TakeOff" }
    ];

    $scope.GasShipperCustCategory = [
        { "Name": "Buyer", "Value": "Buyer" },
        { "Name": "Seller", "Value": "Seller" }

    ];
    $scope.getLicenseFees = function () {
        $http({
            method: 'GET',
            url: baseUrl + 'applications/licensefees/'
        }).then(function (response) {
            $scope.licenseFees = response.data;
            console.log($scope.licenseFees);
        }, function (error) {
            console.log(error);
        });
    };
    $scope.addCustomerStakeholder = function () {
        $scope.stakeholdersLocations.push({});
    };
    $scope.removeCustomerStakeholder = function (objectToRemove) {
        var objectToRemovePosition = $scope.stakeholdersLocations.indexOf(objectToRemove);
        $scope.stakeholdersLocations.splice(objectToRemovePosition, 1);
    };

    $scope.addGasShipperCustomer = function () {
        $scope.gasShipperCustomers.push({});
    };

    $scope.removeGasShipperCustomer = function (objectToRemove) {
        var objectToRemovePosition = $scope.gasShipperCustomers.indexOf(objectToRemove);
        $scope.gasShipperCustomers.splice(objectToRemovePosition, 1);
    };

    $scope.addTakeOffPoint = function () {
        $scope.takeOffPoints.push({});
    };

    $scope.removeTakeOffPoint = function (objectToRemove) {
        var objectToRemovePosition = $scope.takeOffPoints.indexOf(objectToRemove);
        $scope.takeOffPoints.splice(objectToRemovePosition, 1);
    };
    $scope.submitButtonText = 'Submitting Application...';
    $scope.submittingInformation = 'true';
    $scope.setFileRecord = function ($event, tag) {
        var file = $event.target.files[0];
        var filename = file.name;
        var extension = extractExtensionFromFileName(filename);
        var reader = new FileReader();

        reader.readAsBinaryString(file);
        reader.onload = (function () {
            return function (e) {
                var base64Str = window.btoa(e.target.result);
                if (tag === "proposedDetail") {
                    $scope.licenseApplicationUpload.ProposedArrangementAttachmentFileName = filename;
                    $scope.licenseApplicationUpload.ProposedArrangementAttachmentFileExtension = extension;
                    $scope.licenseApplicationUpload.ProposedArrangementAttachmentBase64 = base64Str;
                }
                else if (tag === "OPLLicense") {
                    $scope.licenseApplicationUpload.OPLFileName = filename;
                    $scope.licenseApplicationUpload.OPLFileExtension = extension;
                    $scope.licenseApplicationUpload.OPLBase64 = base64Str;
                }
                else if (tag === "SafetyCase") {
                    $scope.licenseApplicationUpload.SafetyCaseFileName = filename;
                    $scope.licenseApplicationUpload.SafetyCaseFileExtension = extension;
                    $scope.licenseApplicationUpload.SafetyCaseBase64 = base64Str;
                }
                else if (tag === "SCADA") {
                    $scope.licenseApplicationUpload.SCADAFileName = filename;
                    $scope.licenseApplicationUpload.SCADAFileExtension = extension;
                    $scope.licenseApplicationUpload.SCADABase64 = base64Str;
                }
                else if (tag === "GTS") {
                    $scope.licenseApplicationUpload.GTSFileName = filename;
                    $scope.licenseApplicationUpload.GTSFileExtension = extension;
                    $scope.licenseApplicationUpload.GTSBase64 = base64Str;
                }
                else if (tag === "technicalAttr") {
                    $scope.licenseApplicationUpload.TechnicalAttributeFileName = filename;
                    $scope.licenseApplicationUpload.TechnicalAttributeFileExtension = extension;
                    $scope.licenseApplicationUpload.TechnicalAttributeBase64 = base64Str;
                }
                else if (tag === "auxSystems") {
                    $scope.licenseApplicationUpload.AuxiliarySystemFileName = filename;
                    $scope.licenseApplicationUpload.AuxiliarySystemFileExtension = extension;
                    $scope.licenseApplicationUpload.AuxiliarySystemBase64 = base64Str;
                }
                else if (tag === "tariff") {
                    $scope.licenseApplicationUpload.TariffAndPricingFileName = filename;
                    $scope.licenseApplicationUpload.TariffAndPricingFileExtension = extension;
                    $scope.licenseApplicationUpload.TariffAndPricingBase64 = base64Str;
                }
                else if (tag === "riskManagement") {
                    $scope.licenseApplicationUpload.RiskManagementFileName = filename;
                    $scope.licenseApplicationUpload.RiskManagementFileExtension = extension;
                    $scope.licenseApplicationUpload.RiskManagementBase64 = base64Str;
                }
                else if (tag === "MOU") {
                    $scope.licenseApplicationUpload.CommunityMOUFileName = filename;
                    $scope.licenseApplicationUpload.CommunityMOUFileExtension = extension;
                    $scope.licenseApplicationUpload.CommunityMOUBase64 = base64Str;
                }
                else if (tag === "NetworkAgentOPL") {
                    $scope.licenseApplicationUpload.NetworkAgentOPLFileName = filename;
                    $scope.licenseApplicationUpload.NetworkAgentOPLFileExtension = extension;
                    $scope.licenseApplicationUpload.NetworkAgentOPLBase64 = base64Str;
                }
                else if (tag === "GasShipperOPL") {
                    $scope.licenseApplicationUpload.GasShipperOPLFileName = filename;
                    $scope.licenseApplicationUpload.GasShipperOPLFileExtension = extension;
                    $scope.licenseApplicationUpload.GasShipperOPLBase64 = base64Str;
                }
                else if (tag === "Signature") {
                    $scope.licenseApplicationUpload.DeclarationSignatureFileName = filename;
                    $scope.licenseApplicationUpload.DeclarationSignatureFileExtension = extension;
                    $scope.licenseApplicationUpload.DeclarationSignatureBase64 = base64Str;
                }
                else if (tag === "holdRelatedLicense") {
                    $scope.licenseApplicationUpload.HoldRelatedLicenseFileName = filename;
                    $scope.licenseApplicationUpload.HoldRelatedLicenseFileExtension = extension;
                    $scope.licenseApplicationUpload.HoldRelatedLicenseBase64 = base64Str;
                }
                else if (tag === "hasRelatedLicense") {
                    $scope.licenseApplicationUpload.HasRelatedLicenseFileName = filename;
                    $scope.licenseApplicationUpload.HasRelatedLicenseFileExtension = extension;
                    $scope.licenseApplicationUpload.HasRelatedLicenseBase64 = base64Str;
                }
                else if (tag === "hasLicenseRevoked") {
                    $scope.licenseApplicationUpload.HasLicenseRevokedFileName = filename;
                    $scope.licenseApplicationUpload.HasLicenseRevokedFileExtension = extension;
                    $scope.licenseApplicationUpload.HasLicenseRevokedLicenseBase64 = base64Str;
                }
                else if (tag ==="hasRefusedLicense") {
                    $scope.licenseApplicationUpload.HasLicenseRefusedFileName = filename;
                    $scope.licenseApplicationUpload.HasLicenseRefusedFileExtension = extension;
                    $scope.licenseApplicationUpload.HasLicenseRefusedLicenseBase64 = base64Str;
                }
            };
        })(file);
    };

    $scope.licenseApplicationUploadsFileSizeCheckModel = {
        HoldRelatedLicenseFileSizeValid: '', HasRelatedLicenseFileSizeValid: '', HasLicenseRevokedFileSizeValid: '', HasLicenseRefusedFileSizeValid: '', DeclarationSignatureValid: ''
    };


    $scope.evaluateGasShipperNominalCapacity = function (capacity) {
        $scope.licenseFeeEvaluated = false;

        for (var i = 0; i < $scope.licenseFees.length - 1; i++) {
            var currentLicenseFee = $scope.licenseFees[i];

            if (currentLicenseFee.licenseType === 'GasShipperLicense' && capacity >= currentLicenseFee.minimum && capacity <= currentLicenseFee.maximum) {
                $scope.licenseFeeEvaluated = true;
                $scope.statutoryFee = currentLicenseFee.statutory;
                $scope.processingFee = currentLicenseFee.processingFee;
                $scope.totalFee = parseInt($scope.statutoryFee) + parseInt($scope.processingFee);
                $scope.licenseApplicationModel.CustomerTier = currentLicenseFee.categoryDescription;
                $scope.licenseApplicationModel.LicenseFeeCategory = currentLicenseFee.recordId;
            }
        }
    };

    $scope.evaluateGasTransporterNominalCapacity = function (capacity) {
        $scope.licenseFeeEvaluated = false;

        for (var i = 0; i < $scope.licenseFees.length - 1; i++) {
            var currentLicenseFee = $scope.licenseFees[i];

            if (currentLicenseFee.licenseType === 'GasTransporterLicense' && capacity >= currentLicenseFee.minimum && capacity <= currentLicenseFee.maximum) {
                $scope.licenseFeeEvaluated = true;
                $scope.statutoryFee = currentLicenseFee.statutory;
                $scope.processingFee = currentLicenseFee.processingFee;
                $scope.totalFee = parseInt($scope.statutoryFee) + parseInt($scope.processingFee);
                $scope.licenseApplicationModel.LicenseFeeCategory = currentLicenseFee.recordId;
                $scope.licenseApplicationModel.CustomerTier = currentLicenseFee.categoryDescription;
            }
        }
    };

    $scope.getLicenseFees = function () {
        $http({
            method: 'GET',
            url: baseUrl + 'applications/licensefees/'
        }).then(function (response) {
            $scope.licenseFees = response.data;
        }, function (error) {
            console.log(error);
        });
    };

    $scope.getStates = function () {
        $http({
            method: 'GET',
            url: baseUrl + 'applications/states/'
        }).then(function (response) {
            $scope.states = response.data;
        }, function (error) {
            console.log(error);
        });
    };

    $scope.getLicenseFees();
    $scope.getStates();
    $scope.setCustomerRecId = function () {
        var loggedInUser = localStorage.getItem('loggedInUser');
        $scope.loggedInUser = JSON.parse(loggedInUser);

        $scope.licenseApplicationModel.Customer = $scope.loggedInUser.custTableRecId;
        $scope.licenseApplicationModel.CompanyName = $scope.loggedInUser.companyName;

        if ($scope.loggedInUser.recordId) {
            $scope.licenseApplicationModel.SubmittedBy = $scope.loggedInUser.recordId;
        }
    };
    $scope.setCustomerRecId();
    //set errors from the validation directive;
    $scope.setError = function (errors) {
        $scope.errors = [];
        $scope.errors = errors;
    };

    $scope.submitForm = function () {
        $scope.errors = [];
        var proposedArrangementDetails = document.getElementById("proposedArrangementDetails").value;
        var effectiveDate = document.getElementById("effectiveDate").value;
        var declarationDate = document.getElementById("declarationDate").value;

        $scope.licenseApplicationModel.ProposedArrangementLicensingActivity = proposedArrangementDetails;
        $scope.licenseApplicationModel.EffectiveDate = effectiveDate;
        $scope.licenseApplicationModel.DeclarationDate = declarationDate;
        $scope.licenseApplicationModel.MaximumNominatedCapacity = parseFloat($scope.licenseApplicationModel.MaximumNominatedCapacity);

        $scope.submittingInformation = 'true';
        $scope.waiting++;
        $http({
            method: 'POST',
            url: baseUrl + 'applications/savelicenseapplication',
            data: $scope.licenseApplicationModel,
            dataType: 'json'
        }).then(function (response) {
            $state.go('site.application.list');
            $scope.waiting--;
        }, function (error) {
            $scope.waiting--;
            console.log(error);
        });
    };
});


appModule.controller('ApplicationList', function ($scope, $http, $state) {
    $scope.title = "Applications";
    $scope.breadcrumb.splice(0, $scope.breadcrumb.length);
    $scope.breadcrumb.push(
        {
            title: $scope.title
        }
    );
    if ($scope.loggedInUser.custTableRecId) {
        $scope.waiting++;
        getCustomerApplications($scope.loggedInUser.custTableRecId);
        $scope.waiting--;
    }


    function getCustomerApplications(custrecid) {
        $http({
            method: 'GET',
            url: baseUrl + 'applications/customer/' + custrecid
        }).then(function (response) {
            $scope.applications = response.data;
            // if the datatable instance already exist, destroy before recreating, otherwise, just create
            if ($.fn.DataTable.isDataTable('#applicationsTable')) {
                $('#applicationsTable').DataTable().destroy();
            }

            angular.element(document).ready(function () {
                dTable = $('#applicationsTable');
                dTable.DataTable({
                    "aaSorting": [] // disables first colum auto-sorting
                });
            });
        }, function (error) {
            console.log(error);
        });
    }



    $scope.getLicenseCertificateBase64 = function (applicationRecId) {
        $scope.licenseCertificateModel = {};
        $scope.licenseCertificateModel.payload = { custLicenseApplicationId: applicationRecId };
        console.log($scope.licenseCertificateModel);

        $scope.waiting++;
        $http({
            method: 'POST',
            url: baseUrl + 'licensecertificate/generate',
            data: $scope.licenseCertificateModel,
            dataType: 'json'
        }).then(function (response) {
            $scope.waiting--;
            if (response.data) {
                $scope.generateLicensePdf(response.data);
            }
        }, function (error) {
            $scope.waiting--;
            console.log(error);
        });
    };

    $scope.generateLicensePdf = function (base64String) {
        const linkSource = `data:application/pdf;base64, ${base64String}`;
        const downloadLink = document.createElement("a");
        const fileName = "license.pdf";
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
    };

});


appModule.controller('ApplicationGetDetails', function ($scope, $http, $state) {
    $scope.title = "Details";
    $scope.breadcrumb.splice(0, $scope.breadcrumb.length);
    $scope.breadcrumb.push(
        {
            title: 'License Applications',
            link: 'site.application.list'
        },
        {
            title: $scope.title,
            link: '#'
        }
    );
    $scope.waiting++;
    $http({
        method: 'GET',
        url: baseUrl + 'applications/licenseapplicationdetails/' + $state.params.recordId
    }).then(function (response) {
        $scope.item = response.data;
        $scope.waiting--;
    }, function (error) {
        $scope.waiting--;
    });
});

appModule.controller('ApplicationInvoice', function ($scope, $http, $state, $timeout, $window, $sce) {
    $scope.trustSrc = function (src) {
        return $sce.trustAsResourceUrl(src);
    };

    $scope.waiting++;
    $http({
        method: 'GET',
        url: baseUrl + 'payment/generateRRR/' + $state.params.recordId
    }).then(function (response) {
        $scope.item = response.data;
        $scope.returnUrl = webBaseUrl + $scope.item.onlinePaymentReference.returnUrl;
        $scope.waiting--;
    }, function (error) {
        $scope.waiting--;
    });

    $scope.printInvoice = function () {
        $timeout($window.print, 0);
    };

});

appModule.controller('applicationLicenses', function ($scope, $http, $state) {


    if ($scope.loggedInUser.custTableRecId) {
        $scope.waiting++;
        // getCustomerApplications($scope.loggedInUser.custTableRecId);
        getApplicationLicenses($scope.loggedInUser.custTableRecId);
        $scope.waiting--;
    }

    if ($scope.loggedInUser.companyName) {
        $scope.companyName = $scope.loggedInUser.companyName;
    }

    function getApplicationLicenses(custrecid) {
        $http({
            method: 'GET',
            url: baseUrl + 'applications/licenses/' + custrecid
        }).then(function (response) {
            $scope.licenses = response.data;
            // if the datatable instance already exist, destroy before recreating, otherwise, just create
            if ($.fn.DataTable.isDataTable('#licensesTable')) {
                $('#licensesTable').DataTable().destroy();
            }

            angular.element(document).ready(function () {
                dTable = $('#licensesTable');
                dTable.DataTable({
                    "aaSorting": [] // disables first colum auto-sorting
                });
            });
        }, function (error) {
            console.log(error);
        });
    }

    $scope.generateLicensePdf = function (base64String, licenseType, licenseNumber) {
        const linkSource = `data:application/pdf;base64, ${base64String}`;
        const downloadLink = document.createElement("a");
        const fileName = $scope.companyName + "_" + licenseType + "_" + licenseNumber + ".pdf";
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
    };

    $scope.getLicenseCertificateBase64 = function (licenseRecId, licenseType, licenseNumber) {
        $scope.licenseCertificateModel = {};
        $scope.licenseCertificateModel.payload = { LicenseId: licenseRecId };
        console.log($scope.licenseCertificateModel);

        $scope.waiting++;
        $http({
            method: 'POST',
            url: baseUrl + 'licensecertificate/generate',
            data: $scope.licenseCertificateModel,
            dataType: 'json'
        }).then(function (response) {
            $scope.waiting--;
            if (response.data) {
                $scope.generateLicensePdf(response.data, licenseType, licenseNumber);
            }
        }, function (error) {
            $scope.waiting--;
            console.log(error);
        });
    };
});

appModule.controller('applicationLicenseUpdate', function ($scope, $http, $state) {
    $scope.waiting++;
    $scope.title = "License Application Update";
    $scope.breadcrumb.splice(0, $scope.breadcrumb.length);
    $scope.breadcrumb.push(
        {
            title: 'License Applications',
            link: 'site.application.list'
        },
        {
            title: $scope.title,
            link: '#'
        }
    );
    $scope.agreementCheck = true;
    $scope.errors = [];
    $scope.stakeholdersLocations = [{}];
    $scope.takeOffPoints = [{}];
    $scope.gasShipperCustomers = [{}];
    $scope.licenseApplicationUpload = {};
    $scope.upload = {};
    var currentLicenseCategory;
    var licenseCategoryDetails;
    $scope.capacityError = "";


    document.title = "License Application Update " + appTitle;

    $scope.GasShipperPointType = [
        { "Name": "Delivery", "Value": "Delivery" },
        { "Name": "Take Off", "Value": "Takeoff" }
    ];

    $scope.GasShipperCustCategory = [
        { "Name": "Buyer", "Value": "Buyer" },
        { "Name": "Seller", "Value": "Seller" }

    ];
    
    
    $scope.addCustomerStakeholder = function () {
        $scope.licenseInformation.stakeholderLocations.push({UniqueId:''});
    };
    $scope.removeCustomerStakeholder = function (objectToRemove) {
        var objectToRemovePosition = $scope.licenseInformation.stakeholderLocations.indexOf(objectToRemove);
        $scope.licenseInformation.stakeholderLocations.splice(objectToRemovePosition, 1);
    };

    $scope.addGasShipperCustomer = function () {
        $scope.licenseInformation.gasShipperCustomers.push({UniqueId:''});
    };

    $scope.removeGasShipperCustomer = function (objectToRemove) {
        var objectToRemovePosition = $scope.licenseInformation.gasShipperCustomers.indexOf(objectToRemove);
        $scope.licenseInformation.gasShipperCustomers.splice(objectToRemovePosition, 1);
    };

    $scope.addTakeOffPoint = function () {
        $scope.licenseInformation.gasShipperTakeOffPoints.push({UniqueId: '' });
    };

    $scope.removeTakeOffPoint = function (objectToRemove) {
        var objectToRemovePosition = $scope.licenseInformation.gasShipperTakeOffPoints.indexOf(objectToRemove);
        $scope.licenseInformation.gasShipperTakeOffPoints.splice(objectToRemovePosition, 1);
    };
    $scope.getStates = function () {
        $http({
            method: 'GET',
            url: baseUrl + 'applications/states/'
        }).then(function (response) {
            $scope.states = response.data;
        }, function (error) {
            console.log(error);
        });
    };
    $scope.setError = function (errors) {
        $scope.errors = errors;
    };
    $scope.submitForm = function () {
        $scope.errors = [];
        if ($scope.capacityError === "") {
            $scope.waiting++;
            $http({
                method: 'PUT',
                url: baseUrl + 'applications/updatelicenseapplication',
                data: $scope.licenseInformation,
                dataType: 'json'
            }).then(function (response) {
                $state.go('site.application.list');
                $scope.waiting--;
            }, function (error) {
                $scope.waiting--;
            });
        }
        else {
            $scope.errors.push($scope.capacityError);
        }
    };

    //Get Application Details
    $http({
        method: 'GET',
        url: baseUrl + 'applications/licenseapplicationdetails/' + $state.params.recordId
    }).then(function (response) {
        $scope.licenseInformation = response.data;
        currentLicenseCategory = $scope.licenseInformation.licenseFeeCategory;
        $scope.licenseInformation.companyName = $scope.currentUser().companyName;   
        $scope.gasShipperCustomers = $scope.licenseInformation.gasShipperCustomers;
        $scope.stakeholdersLocations = $scope.licenseInformation.stakeholdersLocations;
        $scope.takeOffPoints = $scope.licenseInformation.takeOffPoints;
        $scope.licenseInformation.fileUploads = $scope.upload;
        $scope.processLicenseAttachment($scope.licenseInformation.licenseApplicationAttachments);

        $scope.getLicenseFees();
        $scope.waiting--;

        if ($scope.licenseInformation.effectiveDate) {
            $scope.licenseInformation.effectiveDate = new Date($scope.licenseInformation.effectiveDate);
        }

        if ($scope.licenseInformation.declarationDate) {
            $scope.licenseInformation.declarationDate = new Date($scope.licenseInformation.declarationDate);
        }

        document.getElementById("proposedArrangementDetails").value = $scope.licenseInformation.proposedArrangementLicensingActivity;

    }, function (error) {
        $scope.waiting--;
        console.log(error);
    });
    $scope.getLicenseFees = function () {
        $http({
            method: 'GET',
            url: baseUrl + 'applications/licensefees/'
        }).then(function (response) {
            $scope.licenseFees = response.data;
            licenseCategoryDetails = $scope.licenseFees.filter(function (item) {
                if (item.recordId == currentLicenseCategory) {
                    return item;
                }
            });
            $scope.evaluateNominalCapacity($scope.licenseInformation.maximumNominatedCapacity);
        }, function (error) {
            console.log(error);
        });
    };
    $scope.getStates();


    $scope.processLicenseAttachment = function (attachments) {
        attachments.forEach(function (item) {
            if (item.fileName.includes(OPLFileName)) {
                $scope.licenseApplicationUpload.OPLFileName = item.fileName;
            }
            else if (item.fileName.includes(DeclarationSignatureFileName)) {
                $scope.licenseApplicationUpload.DeclarationSignatureFileName = item.fileName;
            }
            else if (item.fileName.includes(HoldRelatedLicenseFileName)) {
                $scope.licenseApplicationUpload.HoldRelatedLicenseFileName = item.fileName;
            }
            else if (item.fileName.includes(HasRelatedLicenseFileName)) {
                $scope.licenseApplicationUpload.HasRelatedLicenseFileName = item.fileName;
            }
            else if (item.fileName.includes(HasLicenseRevokedFileName)) {
                $scope.licenseApplicationUpload.HasLicenseRevokedFileName = item.fileName;
            }
            else if (item.fileName.includes(HasLicenseRefusedFileName)) {
                $scope.licenseApplicationUpload.HasLicenseRefusedFileName = item.fileName;
            }
            else if (item.fileName.includes(SafetyCaseFileName)) {
                $scope.licenseApplicationUpload.SafetyCaseFileName = item.fileName;
            }
            else if (item.fileName.includes(SCADAFileName)) {
                $scope.licenseApplicationUpload.SCADAFileName = item.fileName;
            }
            else if (item.fileName.includes(GTSFileName)) {
                $scope.licenseApplicationUpload.GTSFileName = item.fileName;
            }
            else if (item.fileName.includes(TechnicalAttributeFileName)) {
                $scope.licenseApplicationUpload.TechnicalAttributeFileName = item.fileName;
            }
            else if (item.fileName.includes(AuxiliarySystemFileName)) {
                $scope.licenseApplicationUpload.AuxiliarySystemFileName = item.fileName;
            }
            else if (item.fileName.includes(TariffAndPricingFileName)) {
                $scope.licenseApplicationUpload.TariffAndPricingFileName = item.fileName;
            }
            else if (item.fileName.includes(RiskManagementFileName)) {
                $scope.licenseApplicationUpload.RiskManagementFileName = item.fileName;
            }
            else if (item.fileName.includes(CommunityMOUFileName)) {
                $scope.licenseApplicationUpload.CommunityMOUFileName = item.fileName;
            }
            else if (item.fileName.includes(ProposedArrangementAttachmentFileName)) {
                $scope.licenseApplicationUpload.ProposedArrangementAttachmentFileName = item.fileName;
            }

        });
    }
    $scope.evaluateNominalCapacity = function (capacity) {
        $scope.licenseFeeEvaluated = false;
        for (var i = 0; i < $scope.licenseFees.length - 1; i++) {
            var currentLicenseFee = $scope.licenseFees[i];
            if (currentLicenseFee.licenseType === $scope.licenseInformation.custLicenseType && capacity >= currentLicenseFee.minimum && capacity <= currentLicenseFee.maximum) {
                $scope.licenseFeeEvaluated = true;
                $scope.statutoryFee = currentLicenseFee.statutory;
                $scope.processingFee = currentLicenseFee.processingFee;
                $scope.totalFee = parseInt($scope.statutoryFee) + parseInt($scope.processingFee);
                $scope.licenseInformation.customerTier = currentLicenseFee.categoryDescription;
                $scope.licenseInformation.licenseFeeCategory = currentLicenseFee.recordId;
                break;
            }
        }
        var licenseCategoryDetail = licenseCategoryDetails[0];
        if (currentLicenseCategory != $scope.licenseInformation.licenseFeeCategory) {
            $scope.capacityError = "Allowed capacity update should be between " + licenseCategoryDetail.minimum + " and " + licenseCategoryDetail.maximum;
        }
        else {
            $scope.capacityError = "";
        }
    };

    $scope.setFileRecord = function ($event, tag) {
        var file = $event.target.files[0];
        var filename = file.name;
        var extension = extractExtensionFromFileName(filename);
        var reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = (function () {
            return function (e) {
                var base64Str = window.btoa(e.target.result);
                if (tag === "proposedDetail") {
                    $scope.upload.ProposedArrangementAttachmentFileName = filename;
                    $scope.upload.ProposedArrangementAttachmentFileExtension = extension;
                    $scope.upload.ProposedArrangementAttachmentBase64 = base64Str;
                }
                else if (tag === "OPLLicense") {
                    $scope.upload.OPLFileName = filename;
                    $scope.upload.OPLFileExtension = extension;
                    $scope.upload.OPLBase64 = base64Str;
                }
                else if (tag === "SafetyCase") {
                    $scope.upload.SafetyCaseFileName = filename;
                    $scope.upload.SafetyCaseFileExtension = extension;
                    $scope.upload.SafetyCaseBase64 = base64Str;
                }
                else if (tag === "SCADA") {
                    $scope.upload.SCADAFileName = filename;
                    $scope.upload.SCADAFileExtension = extension;
                    $scope.upload.SCADABase64 = base64Str;
                }
                else if (tag === "GTS") {
                    $scope.upload.GTSFileName = filename;
                    $scope.upload.GTSFileExtension = extension;
                    $scope.upload.GTSBase64 = base64Str;
                }
                else if (tag === "technicalAttr") {
                    $scope.upload.TechnicalAttributeFileName = filename;
                    $scope.upload.TechnicalAttributeFileExtension = extension;
                    $scope.upload.TechnicalAttributeBase64 = base64Str;
                }
                else if (tag === "auxSystems") {
                    $scope.upload.AuxiliarySystemFileName = filename;
                    $scope.upload.AuxiliarySystemFileExtension = extension;
                    $scope.upload.AuxiliarySystemBase64 = base64Str;
                }
                else if (tag === "tariff") {
                    $scope.upload.TariffAndPricingFileName = filename;
                    $scope.upload.TariffAndPricingFileExtension = extension;
                    $scope.upload.TariffAndPricingBase64 = base64Str;
                }
                else if (tag === "riskManagement") {
                    $scope.upload.RiskManagementFileName = filename;
                    $scope.upload.RiskManagementFileExtension = extension;
                    $scope.upload.RiskManagementBase64 = base64Str;
                }
                else if (tag === "MOU") {
                    $scope.upload.CommunityMOUFileName = filename;
                    $scope.upload.CommunityMOUFileExtension = extension;
                    $scope.upload.CommunityMOUBase64 = base64Str;
                }
                else if (tag === "NetworkAgentOPL") {
                    $scope.upload.NetworkAgentOPLFileName = filename;
                    $scope.upload.NetworkAgentOPLFileExtension = extension;
                    $scope.upload.NetworkAgentOPLBase64 = base64Str;
                }
                else if (tag === "GasShipperOPL") {
                    $scope.upload.GasShipperOPLFileName = filename;
                    $scope.upload.GasShipperOPLFileExtension = extension;
                    $scope.upload.GasShipperOPLBase64 = base64Str;
                }
                else if (tag === "Signature") {
                    $scope.upload.DeclarationSignatureFileName = filename;
                    $scope.upload.DeclarationSignatureFileExtension = extension;
                    $scope.upload.DeclarationSignatureBase64 = base64Str;
                }
                else if (tag === "holdRelatedLicense") {
                    $scope.upload.HoldRelatedLicenseFileName = filename;
                    $scope.upload.HoldRelatedLicenseFileExtension = extension;
                    $scope.upload.HoldRelatedLicenseBase64 = base64Str;
                }
                else if (tag === "hasRelatedLicense") {
                     
                    $scope.upload.HasRelatedLicenseFileName = filename;
                    $scope.upload.HasRelatedLicenseFileExtension = extension;
                    $scope.upload.HasRelatedLicenseBase64 = base64Str;
                }
                else if (tag === "hasLicenseRevoked") {
                    $scope.upload.HasLicenseRevokedFileName = filename;
                    $scope.upload.HasLicenseRevokedFileExtension = extension;
                    $scope.upload.HasLicenseRevokedLicenseBase64 = base64Str;
                }
                else if (tag === "hasRefusedLicense") {
                   
                    $scope.upload.HasLicenseRefusedFileName = filename;
                    $scope.upload.HasLicenseRefusedFileExtension = extension;
                    $scope.upload.HasLicenseRefusedLicenseBase64 = base64Str;
                }
                console.log($scope.licenseInformation);

            };
        })(file);
    };
    

});