(function () {
    var app = angular.module('app');
    app.component('segment', {
        // defines a two way binding in and out of the component
        bindings: {
            formdata: "=",
            onSave: '='
        },
        // Load the template
        templateUrl: 'app/components/campaign/segment/segment.html',
        controller: ['$scope', 'campaignSrvc', '$stateParams', '$uibModal', 'WizardHandler', '$q', 'utilitySrvc', '$location', 'masterSrvc', '$state', '$cookies', '$interval', function ($scope, campaignSrvc, $stateParams, $uibModal, WizardHandler, $q, utilitySrvc, $location, masterSrvc, $state, $cookies, $interval) {
            var vm = this;
            vm.formdata.segment.name = "";
            // $interval(function () {
            //     $scope.tokyo = moment.tz($cookies.get('timezone')).format('YYYY-MM-DD HH:mm:ss');
            // }, 1000);

            vm.formdata.segment.campignStartDate = "";
            vm.formdata.segment.campignEndDate = "";
            vm.formdata.segment.installedStartDate = "";
            vm.formdata.segment.installedEndDate = "";
            vm.formdata.segment.notClickedStartDate = "";
            vm.formdata.segment.notClickedEndDate = "";
            vm.formdata.segment.accessedWebsiteStartDate = "";
            vm.formdata.segment.accessedWebsiteEndDate = "";
            vm.formdata.segment.urls = [];
            vm.formdata.segment.version = false;
            vm.formdata.segment.internetProvider = false;
            vm.formdata.segment.browser = false;
            vm.formdata.segment.country = false;
            vm.formdata.segment.accessWebsite = false;
            vm.formdata.segment.notClicked = false;
            vm.formdata.segment.installed = false;
            vm.formdata.segment.count = 0;
            // vm.mindate = moment.tz($cookies.get('timezone')).format('YYYY-MM-DD HH:mm:ss').toDate();//new Date();
            // vm.maxdate = moment.tz($cookies.get('timezone')).format('YYYY-MM-DD HH:mm:ss').toDate();//new Date();
            vm.mindate = new Date(moment.tz($cookies.get('timezone')).format('YYYY-MM-DD'));
            vm.maxdate = new Date(moment.tz($cookies.get('timezone')).format('YYYY-MM-DD'));
            vm.isShowTime = true;
            vm.IsNotShowTime = false;
            vm.valid = true;
            vm.calculateCount = true;
            vm.calculated = false;
            vm.saving = false;
            vm.start = "start";
            vm.end = "end";
            vm.currentRoute = $location.path();
            vm.isOnDemand = $location.path().indexOf('ondemand') !== -1 ? false : true;
            var userCookiedData;
            vm.isShowProduct = false;
            // vm.formdata.segment.product=true;
            $scope.$watch(function () {
                return vm.formdata.segment.countries.selectedOptions;
            }, function (newVal) {
                if (newVal && newVal.length > 0) {
                    vm.formdata.segment.country = true;


                } else {
                    vm.formdata.segment.country = false;

                }

                // vm.formdata.segment.campignStartDate = "";
                // vm.formdata.segment.campignEndDate = "";
            });

            // if ($cookies) {
            //     userCookiedData = $cookies.get('userData') ? JSON.parse($cookies.get('userData')) : {};

            //     if (userCookiedData.productList.length > 1)
            //         vm.isShowProduct = true;
            // }

            $scope.$watch(function () {
                return vm.formdata.segment.products.selectedOptions;
            }, function (newVal) {
                if (newVal && newVal.length > 0) {
                    vm.formdata.segment.product = true;
                    vm.checkIfExist();
                } else {
                    vm.formdata.segment.product = false;
                }
            });


            $scope.$watch(function () {
                return vm.formdata.segment.cities.selectedOptions;
            }, function (newVal) {
                if (newVal && newVal.length > 0) {
                    vm.formdata.segment.city = true;
                } else {
                    vm.formdata.segment.city = false;
                }
            });

            $scope.$watch("vm.formdata.segment", function (newVal, oldVal) {
                if (newVal != oldVal) {
                    if (!vm.calculated) {
                        vm.calculateCount = false;
                    }
                    vm.calculated = false
                }
            }, true);

            $scope.$watch(function () {
                return vm.formdata.segment.browsers.selectedOptions;
            }, function (newVal) {
                if (newVal && newVal.length > 0) {
                    vm.formdata.segment.browser = true;
                } else {
                    vm.formdata.segment.browser = false;
                }
            });

            $scope.$watch(function () {
                return vm.formdata.segment.extensionVersion.selectedOptions;
            }, function (newVal) {
                if (newVal && newVal.length > 0) {
                    vm.formdata.segment.version = true;

                } else {
                    vm.formdata.segment.version = false;
                }
            });

            $scope.$watch(function () {
                return vm.formdata.segment.internetProviders.selectedOptions;
            }, function (newVal) {
                if (newVal && newVal.length > 0) {
                    vm.formdata.segment.internetProvider = true;

                } else {
                    vm.formdata.segment.internetProvider = false;
                }
            });



            vm.installeChange = function () {
                if (!vm.formdata.segment.installed) {
                    vm.formdata.segment.installedStartDate = "";
                    vm.formdata.segment.installedEndDate = "";
                }

            };

            vm.notClickChange = function () {
                if (!vm.formdata.segment.notClicked) {
                    vm.formdata.segment.notClickedStartDate = "";
                    vm.formdata.segment.notClickedEndDate = "";
                }
            };

            vm.accessWebsitChange = function () {
                if (!vm.formdata.segment.accessWebsite) {
                    vm.formdata.segment.accessedWebsiteStartDate = "";
                    vm.formdata.segment.accessedWebsiteEndDate = "";
                }
            };

            vm.countryChange = function () {
                vm.formdata.segment.countries.selectedOptions = [];
                if (vm.formdata.segment.country === true) {
                    vm.formdata.segment.countries.options.forEach(function (country) {
                        vm.formdata.segment.countries.selectedOptions.push(country);
                    });
                }
                if (vm.formdata.segment.country === false) {
                    vm.formdata.segment.city = false;
                    vm.formdata.segment.cities.selectedOptions = [];
                }
            };

            vm.versionChange = function () {
                vm.formdata.segment.extensionVersion.selectedOptions = [];
                if (vm.formdata.segment.version === true) {
                    vm.formdata.segment.extensionVersion.options.forEach(function (version) {
                        vm.formdata.segment.extensionVersion.selectedOptions.push(version);
                    });
                }
            };

            vm.internetProviderChange = function () {
                vm.formdata.segment.internetProviders.selectedOptions = [];
                if (vm.formdata.segment.internetProvider === true) {
                    vm.formdata.segment.internetProviders.options.forEach(function (version) {
                        vm.formdata.segment.internetProviders.selectedOptions.push(version);
                    });
                }
            };

            vm.productChange = function () {
                if (vm.formdata.segment.product === false) {
                    vm.formdata.segment.products.selectedOptions = [];
                }
            };

            vm.browserChange = function () {
                vm.formdata.segment.browsers.selectedOptions = [];
                if (vm.formdata.segment.browser === true) {
                    vm.formdata.segment.browsers.options.forEach(function (browser) {
                        vm.formdata.segment.browsers.selectedOptions.push(browser);
                    });
                }
            };


            vm.cityChange = function () {
                vm.formdata.segment.cities.selectedOptions = [];
                if (vm.formdata.segment.city === true) {
                    vm.formdata.segment.cities.options.forEach(function (city) {
                        vm.formdata.segment.cities.selectedOptions.push(city);
                    });
                }
            };




            vm.addUrl = function (urlDetail) {
                if (vm.url) {

                    var list = vm.formdata.segment.websites;
                    var addedlist;
                    var lst = list.filter(function (el) {
                        return el.DisplayText === vm.url.DisplayText;
                    });


                    addedlist1 = vm.formdata.segment.urls;

                    var addedlst2 = addedlist1.filter(function (el) {
                        return el.DisplayText === vm.url.DisplayText;
                    });
                    if (addedlst2.length > 0) {
                        vm.messageBox("URL (" + vm.url.DisplayText + ") already added");
                        vm.url = "";
                        return;
                    }


                    var listcount = lst.length;

                    if (listcount > 0) {

                        addedlist = vm.formdata.segment.urls;

                        var addedlst = addedlist.filter(function (el) {
                            return el.DisplayText === lst[0].DisplayText;
                        });
                        if (addedlst.length > 0) {
                            vm.messageBox("URL (" + lst[0].DisplayText + ") already added");
                            vm.url = "";
                            return;
                        }
                        else {

                            vm.formdata.segment.urls.push({ DisplayText: lst[0].DisplayText, Value: lst[0].Value });
                            vm.url = "";
                        }

                    }
                    else {

                        var urltexts = vm.url.DisplayText.split('.');
                        var firstword;
                        var text;
                        if (urltexts)
                            firstword = urltexts[0];
                        if (firstword.length >= 3) {
                            text = firstword.substring(firstword.length - 3, firstword.length);
                        }
                        else if (firstword.length === 2) {
                            text = firstword;
                        }
                        else if (firstword.length === 1) {
                            text = firstword;
                        }
                        else {
                            text = "";
                        }
                        if (text === "" || text === "WW" || text === "ww" || text === "w" || text === "W") {
                            vm.messageBox("Please enter valid url");
                            return;
                        }
                        // string.substring(start, end)
                        //         if()

                        if (!vm.url.Value) {
                            masterSrvc.saveSiteApi(vm.url.DisplayText).then(function (response) {
                                if (response.responseCode === 200) {
                                    // validationPass = false;
                                    vm.formdata.segment.urls.push({ DisplayText: vm.url.DisplayText, Value: response.responseDescription });

                                }
                                else if (response.responseCode === 206) {
                                    vm.formdata.segment.urls.push({ DisplayText: vm.url.DisplayText, Value: response.responseDescription });

                                    // vm.messageBox("Site already exists");

                                }

                                else {
                                    //TODO insert and select
                                    vm.messageBox("Please enter valid url");
                                }

                            });

                        }
                        else {
                            var _isExist = vm.formdata.segment.urls.some(function (url) {
                                return vm.url.DisplayText === url.DisplayText;
                            })
                            if (!_isExist) {
                                vm.formdata.segment.urls.push(vm.url);
                            }
                            vm.url = "";
                        }
                    }

                }





            }





            vm.removeUrl = function (url) {
                vm.formdata.segment.urls = vm.formdata.segment.urls.filter(function (urldata) {
                    return urldata != url;
                })
            }
            vm.showUrlList = true;
            vm.onSelect = function (item) {
                vm.url = item;
                vm.showUrlList = false;
            };

            vm.handleChange = function () {
                vm.showUrlList = true;
            };
            function formatDate(date) {
                var d = new Date(date),
                    month = '' + (d.getMonth() + 1),
                    day = '' + d.getDate(),
                    year = d.getFullYear();

                if (month.length < 2) month = '0' + month;
                if (day.length < 2) day = '0' + day;

                return [year, month, day].join('-');
            }

            vm.getUserCount = function () {
                var _data = {};
                if (vm.formdata.segment.installed) {
                    _data.installform = formatDate(vm.formdata.segment.installedStartDate.toString()) + ',' + formatDate(vm.formdata.segment.installedEndDate.toString());
                }
                if (vm.formdata.segment.notClicked) {
                    _data.notClick = formatDate(vm.formdata.segment.notClickedStartDate) + ',' + formatDate(vm.formdata.segment.notClickedEndDate.toString());
                }
                // _data.installform = "2016-09-05,2016-09-25";
                // _data.notClick = "2016-09-01,2016-09-25";
                if ((vm.formdata.segment.typeId === 1) || (vm.formdata.segment.typeId === 2) || (vm.formdata.segment.typeId === 3) || (vm.formdata.segment.typeId === 4) || (vm.formdata.segment.typeId === 5))   //On Demand
                {
                    if (vm.formdata.segment.accessWebsite) {
                        var _urls = vm.formdata.segment.urls.map(function (url) { return url.Value })
                        _urls = _urls.length > 1 ? _urls.join(',') : _urls.toString()
                        _data.accesswebsites = _urls
                        _data.accesswebsites_date = formatDate(vm.formdata.segment.accessedWebsiteStartDate.toString()) + ',' + formatDate(vm.formdata.segment.accessedWebsiteEndDate.toString())
                    }
                }

                if (vm.formdata.segment.version) {
                    var extensionVersionValues = vm.formdata.segment.extensionVersion.selectedOptions.map(function (data) {
                        return data.Value;
                    })
                    _data.extensionversions = extensionVersionValues.length > 1 ?
                        extensionVersionValues.join(',') : extensionVersionValues.toString()
                }
                if (vm.formdata.segment.internetProvider) {
                    var internetProviderValues = vm.formdata.segment.internetProviders.selectedOptions.map(function (data) {
                        return data.Value;
                    })
                    _data.ispId = internetProviderValues.length > 1 ?
                        internetProviderValues.join(',') : internetProviderValues.toString();
                }

                if (vm.formdata.segment.browser) {
                    var browsersValues = vm.formdata.segment.browsers.selectedOptions.map(function (data) {
                        return data.Value;
                    });
                    _data.browsers = browsersValues.length > 1 ?
                        browsersValues.join(',') : browsersValues.toString()
                }
                //  _data.browsers = "1";
                if (vm.formdata.segment.country) {
                    var countriesValues = vm.formdata.segment.countries.selectedOptions.map(function (data) {
                        return data.DropdownID;
                    })
                    _data.countries = countriesValues.length > 1 ?
                        countriesValues.join(',') : countriesValues.toString();
                }
                if (vm.isShowProduct && vm.formdata.segment.product) {
                    var productsValues = vm.formdata.segment.products.selectedOptions.map(function (data) {
                        return data.Value;
                    });
                    _data.products = productsValues.length > 1 ?
                        productsValues.join(',') : productsValues.toString();
                }
                else {
                    _data.products = userCookiedData.productList[0].productId.toString();
                }

                if (vm.formdata.segment.countries.length = 1 && vm.formdata.segment.city) {
                    var citiesValues = vm.formdata.segment.cities.selectedOptions.map(function (data) {
                        return data.city_id;
                    })
                    _data.cities = citiesValues.length > 1 ?
                        citiesValues.join(',') : citiesValues.toString();
                }
                //  _data.countries = "1";
                campaignSrvc.getTotalCampaign(
                    {
                        'browserId': _data.browsers === undefined ? "" : _data.browsers,
                        'countryId': _data.countries === undefined ? "" : _data.countries,
                        'extensionId': _data.extensionversions === undefined ? "" : _data.extensionversions,
                        'installedFrom': _data.installform === undefined ? "" : _data.installform,
                        'notClicked': _data.notClick === undefined ? "" : _data.notClick,
                        'accessedWebsites': _data.accesswebsites === undefined ? "" : _data.accesswebsites,
                        'cities': _data.cities === undefined ? "" : _data.cities,
                        'productId': _data.products === undefined ? "" : _data.products,
                        'ispId': _data.ispId === undefined ? "" : _data.ispId
                    }

                ).then(function (response) {
                    if (response.data.Result === "Success") {
                        vm.calculateCount = true;
                        vm.calculated = true;
                        vm.formdata.segment.count = response.data.TotalRecordCount;
                    }
                }, function (response) {

                });

            };
            var _getUrls = function (val) {
                campaignSrvc.getWebsites().then(function (response) {
                    vm.websites = response.data.Records
                }, function (response) {

                })
            } ()


            function deleteCampaign(campaignId, campaignTypeId) {

                campaignSrvc.deleteCampaign({ "campaign_id": campaignId, "campaign_type_id": campaignTypeId });
            }
            vm.formdata.segment.saveCampaign = function (isLaunch) {
                var deferred = $q.defer();



                vm.saving = true
                if (!validate(isLaunch)) { vm.saving = false; return; }

                // if (!valid) return;
                var _data = {
                    campaign_name: vm.formdata.segment.name,
                    campaign_type_id: vm.formdata.segment.typeId,
                    campaign_start_date: utilitySrvc.getDateFormat(vm.formdata.segment.campignStartDate),
                    campaign_end_date: utilitySrvc.getDateFormat(vm.formdata.segment.campignEndDate),
                    campaign_current_date: utilitySrvc.getDateFormat(new Date())


                }

                if (vm.formdata.segment.installed) {
                    _data.installform = formatDate(vm.formdata.segment.installedStartDate.toString()) + ',' + formatDate(vm.formdata.segment.installedEndDate.toString());
                }
                if (vm.formdata.segment.notClicked) {
                    _data.notClick = formatDate(vm.formdata.segment.notClickedStartDate) + ',' + formatDate(vm.formdata.segment.notClickedEndDate.toString());
                }
                if (vm.formdata.segment.accessWebsite) {
                    var _urls = vm.formdata.segment.urls.map(function (url) { return url.Value })
                    _urls = _urls.length > 1 ? _urls.join(',') : _urls.toString()
                    _data.accesswebsites = _urls
                    _data.accesswebsites_date = formatDate(vm.formdata.segment.accessedWebsiteStartDate.toString()) + ',' + formatDate(vm.formdata.segment.accessedWebsiteEndDate.toString())
                }

                if (vm.formdata.segment.version) {
                    var _extensionValues = vm.formdata.segment.extensionVersion.selectedOptions.map(function (data) {
                        return data.Value
                    })
                    _data.extensionversions = _extensionValues.length > 1 ?
                        _extensionValues.join(',') : _extensionValues.toString()
                }

                if (vm.formdata.segment.internetProvider) {
                    var _internetProviderValues = vm.formdata.segment.internetProviders.selectedOptions.map(function (data) {
                        return data.Value
                    })
                    _data.isps = _internetProviderValues.length > 1 ?
                        _internetProviderValues.join(',') : _internetProviderValues.toString()
                }


                if (vm.formdata.segment.browser) {
                    var _browserValues = vm.formdata.segment.browsers.selectedOptions.map(function (data) {
                        return data.Value
                    })
                    _data.browsers = _browserValues.length > 1 ?
                        _browserValues.join(',') : _browserValues.toString()
                }
                if (vm.formdata.segment.country) {
                    var _countryValues = vm.formdata.segment.countries.selectedOptions.map(function (data) {
                        return data.DropdownID
                    })
                    _data.countries = _countryValues.length > 1 ?
                        _countryValues.join(',') : _countryValues.toString()
                }

                if (vm.isShowProduct && vm.formdata.segment.product) {
                    var productsValues = vm.formdata.segment.products.selectedOptions.map(function (data) {
                        return data.Value;
                    })
                    _data.products = productsValues.length > 1 ?
                        productsValues.join(',') : productsValues.toString();
                }

                else {
                    _data.products = userCookiedData.productList[0].productId.toString();
                }


                if (vm.formdata.segment.countries.length = 1 && vm.formdata.segment.city) {
                    var citiesValues = vm.formdata.segment.cities.selectedOptions.map(function (data) {
                        return data.city_id;
                    })
                    _data.cities = citiesValues.length > 1 ?
                        citiesValues.join(',') : citiesValues.toString();
                }

                if (vm.formdata.segment.timezones.selectedOption) {
                    _data.timezone_id = 1;// vm.formdata.segment.timezones.selectedOption.Value;
                }
                // _data.timezone_id=1;
                _data.eligiblecount = vm.formdata.segment.count;
                if ($stateParams.id || vm.formdata.segment.campaign_id) {
                    var id = $stateParams.id;
                    vm.formdata.segment.campaign_id = $stateParams.id ? $stateParams.id : vm.formdata.segment.campaign_id;
                    _data.campaign_id = $stateParams.id ? $stateParams.id : vm.formdata.segment.campaign_id;
                    campaignSrvc.updateCampaign(_data).then(function (response) {
                        if (response.data.Result == "Success") {
                            vm.saving = false
                            vm.onSave();
                            deferred.resolve("Success");
                        }
                        else {
                            deferred.resolve("Failed");
                            vm.formdata.segment.saved = true;
                            // validationPass = false;
                            // vm.saving = false
                            vm.messageBox("Campaign has been already launched.");
                        }
                    }, function () {

                    })
                }
                else {



                    campaignSrvc.saveCampaign(_data).then(function (response) {

                        if (response.data.Result == "Success") {
                            vm.formdata.segment.saved = true;
                            vm.formdata.segment.savedOnly=true;
                            vm.formdata.segment.campaign_id = response.data.Record.campaign_id;

                            // typeid = 2 : NewTab Campaign
                            if (vm.formdata.segment.typeId === 2) {

                                //Begin new tab
                                campaignSrvc.saveNewTab({

                                    campaign_id: response.data.Record.campaign_id,
                                    htmlContent: vm.formdata.newtab.htmlContent,
                                    icon: vm.formdata.newtab.selectedIcon

                                }).then(function (response) {
                                    if (response.data.Result == "Success") {
                                        vm.formdata.newsfeed.saved = true
                                        vm.formdata.segment.isCampaignName = true;
                                        vm.saving = false
                                        vm.onSave();
                                        deferred.resolve("Success");
                                    }
                                    else {
                                        vm.formdata.newsfeed.saved = false;
                                        vm.saving = false
                                        vm.messageBox("Failed to save campaign");
                                        deleteCampaign(vm.formdata.segment.campaign_id, vm.formdata.segment.typeId);


                                    }
                                }, function (response) {

                                })
                                //end new tab
                            }
                            // typeid = 3 : Notification Campaign  ,7 for OnDemand notification
                            else if (vm.formdata.segment.typeId === 3 || vm.formdata.segment.typeId === 7) {
                                //Begin notification
                                campaignSrvc.saveNotification({

                                    campaign_id: response.data.Record.campaign_id,
                                    forwardUrl: vm.formdata.notification.url,
                                    title: vm.formdata.notification.headline,
                                    description: vm.formdata.notification.textdescription,
                                    file: vm.formdata.notification.selectedImage

                                }).then(function (response) {
                                    if (response.data.Result === "Success") {
                                        vm.formdata.newsfeed.saved = true
                                        vm.formdata.segment.isCampaignName = true;
                                        vm.saving = false
                                        vm.onSave();
                                        deferred.resolve("Success");
                                    }
                                    else {
                                        vm.formdata.newsfeed.saved = false;
                                        vm.saving = false
                                        vm.messageBox("Failed to save campaign");
                                        deleteCampaign(vm.formdata.segment.campaign_id, vm.formdata.segment.typeId);

                                    }
                                }, function (response) {

                                })

                                //end notification

                            }

                            // typeid = 5 : Widget Campaign ,6 for ondemand widget
                            else if (vm.formdata.segment.typeId === 5 || vm.formdata.segment.typeId === 6) {
                                //Begin notification
                                campaignSrvc.saveWidget({

                                    campaign_id: response.data.Record.campaign_id,
                                    forwardUrl: vm.formdata.widget.url,
                                    //  title: vm.formdata.notification.headline,
                                    // description: vm.formdata.notification.textdescription,
                                    icon: vm.formdata.widget.selectedIcon,
                                    image: vm.formdata.widget.selectedImage

                                }).then(function (response) {
                                    if (response.data.Result === "Success") {
                                        vm.formdata.newsfeed.saved = true
                                        vm.formdata.segment.isCampaignName = true;
                                        vm.saving = false
                                        vm.onSave();
                                        deferred.resolve("Success");
                                    }
                                    else {
                                        vm.formdata.newsfeed.saved = false;
                                        vm.saving = false
                                        vm.messageBox("Failed to save campaign");
                                        deleteCampaign(vm.formdata.segment.campaign_id, vm.formdata.segment.typeId);
                                    }
                                }, function (response) {

                                })

                                //end Widget Campaign

                            }
                            // typeid = 1 : NewsFeed Campaign
                            else if (vm.formdata.segment.typeId === 1) {
                                //Begin new feed
                                campaignSrvc.saveNewsFeed({
                                    file: vm.formdata.newsfeed.file,
                                    linkUrl: vm.formdata.newsfeed.url,
                                    position: vm.formdata.newsfeed.position,
                                    campaign_id: response.data.Record.campaign_id,
                                    title: vm.formdata.newsfeed.title,
                                    description: vm.formdata.newsfeed.description
                                }).then(function (response) {
                                    if (response.data.Result == "Success") {
                                        vm.formdata.newsfeed.saved = true
                                        vm.formdata.segment.isCampaignName = true;
                                        vm.saving = false
                                        vm.onSave();
                                        deferred.resolve("Success");
                                    }
                                    else {
                                        vm.formdata.newsfeed.saved = false;
                                        vm.saving = false
                                        vm.messageBox("Failed to save campaign");
                                        deleteCampaign(vm.formdata.segment.campaign_id, vm.formdata.segment.typeId);
                                    }
                                }, function (response) {

                                })
                                // //End new feed
                            }

                            // typeid = 8 : videoads Campaign
                            else if (vm.formdata.segment.typeId === 8) {
                                //Begin new feed
                                campaignSrvc.saveVideoAds({
                                    file: vm.formdata.videoads.file,
                                    url: vm.formdata.videoads.url,
                                    position: vm.formdata.videoads.position,
                                    campaign_id: response.data.Record.campaign_id,
                                    title: vm.formdata.videoads.title
                                    //description: vm.formdata.videoads.description
                                }).then(function (response) {
                                    if (response.data.Result === "Success") {
                                        vm.formdata.videoads.saved = true;
                                        vm.formdata.segment.isCampaignName = true;
                                        vm.saving = false;
                                        vm.onSave();
                                        deferred.resolve("Success");
                                    }
                                    else {
                                        vm.formdata.videoads.saved = false;
                                        vm.saving = false;
                                        vm.messageBox("Failed to save campaign");
                                        deleteCampaign(vm.formdata.segment.campaign_id, vm.formdata.segment.typeId);
                                    }
                                }, function (response) {

                                })
                                // //End new feed
                            }
                            // typeid = 4 : MPD Campaign
                            else if (vm.formdata.segment.typeId === 4) {

                                var mpdData = {};
                                mpdData.campaign_id = response.data.Record.campaign_id;
                                mpdData.mpdType = vm.formdata.mpdType;
                                mpdData.icon = vm.formdata.builder.selectedIcon;
                                switch (vm.formdata.mpdType) {

                                    case 'HTML':
                                        mpdData.htmlContent = vm.formdata.html.htmlContent;
                                        mpdData.file = '';
                                        mpdData.description = '';
                                        mpdData.url = '';
                                        mpdData.buttonText = '';
                                        mpdData.buttonStyle = '';
                                        break;
                                    case 'BUILDER':
                                        mpdData.htmlContent = '';
                                        mpdData.file = vm.formdata.builder.selectedImage;
                                        mpdData.description = vm.formdata.builder.description;
                                        mpdData.url = vm.formdata.builder.url;
                                        mpdData.buttonText = vm.formdata.builder.btnText;
                                        mpdData.buttonStyle = "background:" + vm.formdata.builder.btnStyle.background + ';' + "color:" + vm.formdata.builder.btnStyle.color + ';' + 'font-style:' + vm.formdata.builder.btnStyle['font-style'] + ';' + 'font-weight:' + vm.formdata.builder.btnStyle['font-weight'] + ';' + "font-size: 14px";

                                        // mpdData.buttonStyle = vm.formdata.builder.btnStyle;
                                        break;
                                    case 'ICONS': break;
                                    default: break;
                                }
                                //console.log('mpd', response, vm.formdata, mpdData);
                                campaignSrvc.saveMpd({ mpdData }).then(function (response) {
                                    if (response.data.Result == "Success") {
                                        //vm.formdata.newsfeed.saved = true
                                        vm.formdata.segment.isCampaignName = true;
                                        vm.saving = false;
                                        vm.onSave();
                                        deferred.resolve("Success");
                                    }
                                    else {
                                        vm.formdata.newsfeed.saved = false;
                                        vm.saving = false;
                                        vm.messageBox("Failed to save campaign");
                                        deleteCampaign(vm.formdata.segment.campaign_id, vm.formdata.segment.typeId);
                                    }
                                }, function (response) {

                                })

                            }

                        }
                        else {
                            deferred.resolve("Failed");
                            validationPass = false;
                            vm.saving = false
                            vm.messageBox("Campaign with the same name already exist");
                            return;
                        }
                    }, function (response) {
                    })
                }
                return deferred.promise;
            }

            vm.messageBox = function (confirmationMessage) {
                $uibModal.open({
                    animation: true,
                    templateUrl: 'app/shared/templates/warning.html',
                    controller: ['$scope', '$uibModalInstance', '$state', 'confirmationMessage', '$timeout', function (modalScope, $uibModalInstance, $state, confirmationMessage, $timeout) {
                        modalScope.confirmationMessage = confirmationMessage;

                        modalScope.closeModal = function () {
                            $uibModalInstance.dismiss();
                        };

                    }
                    ],
                    backdrop: 'static',
                    size: 'sm',
                    windowClass: 'messages-sm-modal',
                    resolve: {
                        confirmationMessage: function () {
                            return confirmationMessage;
                        }
                    }
                });
            };

            vm.checkIfExist = function () {
                if ($stateParams.id) {
                    vm.valid = true;
                }
                else {
                    var product_;

                    if (vm.isShowProduct) {   //this code will exectue for admin user
                        product_ = vm.formdata.segment.products.selectedOptions.length > 0 ? vm.formdata.segment.products.selectedOptions[0].Value : "0"  //TODO Remove
                    }
                    else {
                        product_ = userCookiedData.productList[0].productId.toString();
                    }
                    campaignSrvc.checkIfExist({
                        campaign_name: vm.formdata.segment.name,
                        products: product_// vm.formdata.segment.products.selectedOptions.length > 0 ? vm.formdata.segment.products.selectedOptions[0].Value : "0"  //TODO Remove
                    }).then(function (response) {
                        if (response.data.responseCode === 200) {
                            validationPass = false;
                            vm.messageBox(response.data.responseDescription);
                            vm.valid = false;
                            return;
                        }
                        else if (response.data.responseCode === 401) {
                            //$cookies.remove('acitveMenu');
                            $state.go('iopush.unauth.login');
                        }


                        else {
                            vm.valid = true;
                        }
                    }, function (response) {

                    })
                }
            }
            vm.next = function () {
                if (validate()) {
                    document.body.classList.remove("segment-page");
                    // vm.formdata.segment.saved = false;
                    WizardHandler.wizard().next();
                }

            }

            vm.previous = function () {
                document.body.classList.remove("segment-page");
            }

            function validate(isLaunch) {
                var validationPass = true;
                // moment.tz($cookies.get('timezone')).format('YYYY-MM-DD HH:mm:ss')
                var currentDate = new Date(moment.tz($cookies.get('timezone')).format('YYYY-MM-DD HH:mm:ss'));
                // currentDate.setHours(00);
                //  currentDate.sett
                var regax = /^[a-z0-9_]+$/i;
                //  alert(moment.tz("Asia/Tokyo").format('YYYY-MM-DD HH:mm:ss'));

                if (!(vm.formdata.segment.name) || vm.formdata.segment.name === '') {
                    validationPass = false;
                    vm.messageBox("Please enter campaign name");
                    return validationPass;
                }
                else if (vm.formdata.segment.name.length > 50) {
                    validationPass = false;
                    vm.messageBox("Campaign name should be less or equal to 50 character");
                    return validationPass;
                }

                else if (!regax.test(vm.formdata.segment.name)) {
                    validationPass = false;
                    vm.messageBox("Campaign name should be alpha numeric");
                    return validationPass;
                }

                else if (vm.formdata.segment.campignStartDate === '') {
                    validationPass = false;
                    vm.messageBox("Please select campaign start date");
                    return validationPass;
                }
                else if (vm.formdata.segment.campignEndDate === '') {
                    validationPass = false;
                    vm.messageBox("Please select campaign end date");
                    return validationPass;
                }
                else if ((new Date(vm.formdata.segment.campignStartDate)) < (currentDate)) {
                    validationPass = false;
                    vm.messageBox("Please choose date in the future");

                }
                else if ((new Date(vm.formdata.segment.campignEndDate)) < (currentDate)) {
                    validationPass = false;
                    vm.messageBox("Please choose date in the future");

                }
                else if ((new Date(vm.formdata.segment.campignEndDate)) < (new Date(vm.formdata.segment.campignStartDate))) {
                    validationPass = false;
                    vm.messageBox("Campaign end date should not be less than start date");
                    return validationPass;

                }

                // else if (vm.formdata.segment.count < 1) {
                //     validationPass = false;
                //     vm.messageBox("Calculate matching users.Please change the criteria");
                //       return;
                // }
                // else if (!vm.calculateCount) {
                //     validationPass = false;
                //     vm.messageBox("Calculate matching users");
                // }



                if (vm.formdata.segment.installed) {

                    if (vm.formdata.segment.installedStartDate === '') {
                        validationPass = false;
                        vm.messageBox("Plase select installed start date");
                        return validationPass;
                    }
                    else if (vm.formdata.segment.installedEndDate === '') {
                        validationPass = false;
                        vm.messageBox("Plase select installed end date");
                        return validationPass;
                    }


                }



                if (vm.formdata.segment.installedStartDate !== '') {

                    if ((new Date(formatDate(vm.formdata.segment.installedStartDate))) > currentDate) {
                        validationPass = false;
                        vm.messageBox("Installed start date should not be greater than current date");
                        return validationPass;

                    }

                }
                if (vm.formdata.segment.installedEndDate !== '') {


                    if ((new Date(formatDate(vm.formdata.segment.installedEndDate))) > currentDate) {
                        validationPass = false;
                        vm.messageBox("Installed end date should not be greater than current date");
                        return validationPass;

                    }

                    else if ((new Date(formatDate(vm.formdata.segment.installedEndDate))) < (new Date(formatDate(vm.formdata.segment.installedStartDate)))) {
                        validationPass = false;
                        vm.messageBox("Installed start date should not be greater than end date");
                        return validationPass;

                    }

                }

                if (vm.formdata.segment.notClicked) {

                    if (vm.formdata.segment.notClickedStartDate === '') {

                        validationPass = false;
                        vm.messageBox("Please select not clicked start date");
                        return validationPass;
                    }
                    else if (vm.formdata.segment.notClickedEndDate === '') {

                        validationPass = false;
                        vm.messageBox("Please select not clicked end date");
                        return validationPass;
                    }

                    if (!vm.formdata.segment.accessWebsite) {
                        validationPass = false;
                        vm.messageBox("Please select access web site filter");
                        return validationPass;

                    }

                }

                if (vm.formdata.segment.notClickedStartDate !== '') {

                    if ((new Date(formatDate(vm.formdata.segment.notClickedStartDate))) > currentDate) {
                        validationPass = false;
                        vm.messageBox("Not clicked start date should not be greater than current date");
                        return validationPass;

                    }

                }

                if (vm.formdata.segment.country && vm.formdata.segment.countries.selectedOptions.length < 1) {
                    validationPass = false;
                    vm.messageBox("Please select atleast one country");
                    return validationPass;
                }
                else if (vm.formdata.segment.city && vm.formdata.segment.cities.selectedOptions.length < 1) {
                    validationPass = false;
                    vm.messageBox("Please select atleast one city");
                    return validationPass;
                }
                else if (vm.formdata.segment.browser && vm.formdata.segment.browsers.selectedOptions.length < 1) {
                    validationPass = false;
                    vm.messageBox("Please select atleast one browser");
                    return validationPass;
                }

                else if (vm.formdata.segment.product && vm.formdata.segment.products.selectedOptions.length < 1 && vm.isShowProduct) {
                    validationPass = false;
                    vm.messageBox("Please select atleast one extension");
                    return validationPass;
                }
                else if (vm.formdata.segment.version && vm.formdata.segment.extensionVersion.selectedOptions.length < 1) {
                    validationPass = false;
                    vm.messageBox("Please select atleast one extension version");
                    return validationPass;
                }
                else if (vm.formdata.segment.internetProvider && vm.formdata.segment.internetProviders.selectedOptions.length < 1) {
                    validationPass = false;
                    vm.messageBox("Please select atleast one internet provider");
                    return validationPass;
                }




                if (vm.formdata.segment.notClickedEndDate !== '') {

                    if ((new Date(formatDate(vm.formdata.segment.notClickedEndDate))) > currentDate) {
                        validationPass = false;
                        vm.messageBox("Not clicked end date should not be greater than current date");
                        return validationPass;

                    }

                    else if ((new Date(formatDate(vm.formdata.segment.notClickedEndDate))) < (new Date(formatDate(vm.formdata.segment.notClickedStartDate)))) {
                        validationPass = false;
                        vm.messageBox("Not clicked start date should not be greater than end date");
                        return validationPass;

                    }

                }

                if (vm.isShowProduct && ((!vm.formdata.segment.product) || vm.formdata.segment.products.selectedOptions.length < 1)) {
                    validationPass = false;
                    vm.messageBox("Please select extension");
                    return validationPass;
                }
                else if (vm.isShowProduct && vm.formdata.segment.products.selectedOptions.length > 1) {
                    validationPass = false;
                    vm.messageBox("Please select only one extension");
                    return validationPass;
                }
                else if (!vm.valid) {
                    validationPass = false;
                    vm.messageBox("Campaign with the same name already exist");
                    return validationPass;
                }


                if (vm.formdata.segment.accessWebsite) {

                    if (vm.formdata.segment.urls.length < 1) {
                        validationPass = false;
                        vm.messageBox("Please select type url");
                        return validationPass;
                    }
                    // if (vm.formdata.segment.typeId !== 6 || vm.formdata.segment.typeId !== 7) {
                    if ((vm.formdata.segment.typeId === 1) || (vm.formdata.segment.typeId === 2) || (vm.formdata.segment.typeId === 3) || (vm.formdata.segment.typeId === 4) || (vm.formdata.segment.typeId === 5))   //On Demand
                    {
                        if (vm.formdata.segment.accessedWebsiteStartDate === '') {
                            validationPass = false;
                            vm.messageBox("Please select access web site start date");
                            return validationPass;
                        }
                        else if (vm.formdata.segment.accessedWebsiteEndDate === '') {
                            validationPass = false;
                            vm.messageBox("Please select access web site end date");
                            return validationPass;
                        }
                    }

                }

                if (vm.formdata.segment.accessedWebsiteStartDate !== '') {

                    if ((new Date(formatDate(vm.formdata.segment.accessedWebsiteStartDate))) > currentDate) {
                        validationPass = false;
                        vm.messageBox("Accessed website  start date should not be greater than current date");
                        return validationPass;

                    }

                }

                if (vm.formdata.segment.accessedWebsiteEndDate !== '') {

                    if ((new Date(formatDate(vm.formdata.segment.accessedWebsiteEndDate))) > currentDate) {
                        validationPass = false;
                        vm.messageBox("Accessed website  end date should not be greater than current date");
                        return validationPass;

                    }

                }


                if (vm.formdata.segment.accessedWebsiteEndDate !== '') {


                    if ((new Date(formatDate(vm.formdata.segment.accessedWebsiteEndDate))) < (new Date(formatDate(vm.formdata.segment.accessedWebsiteStartDate)))) {
                        validationPass = false;
                        vm.messageBox("Accessed website start date should not be greater than end date");
                        return validationPass;

                    }

                }

                if (vm.formdata.segment.typeId === 6 || vm.formdata.segment.typeId === 7) {
                    if (!vm.formdata.segment.accessWebsite) {
                        validationPass = false;
                        vm.messageBox("Please select access web site filter");
                        return validationPass;

                    }

                    else {

                        if (vm.formdata.segment.urls.length < 1) {
                            validationPass = false;
                            vm.messageBox("Please select type url");
                            return validationPass;
                        }
                    }
                }

                if (vm.formdata.segment.count < 1) {
                    validationPass = false;
                    vm.messageBox("Calculate matching users. Please change the criteria");
                    return validationPass;
                }
                if (!isLaunch) {
                    if (!vm.calculateCount) {
                        validationPass = false;
                        vm.messageBox("Calculate matching users");
                        return validationPass;
                    }
                }

                return validationPass;

            }


        }],


        controllerAs: 'vm'
    });
})();