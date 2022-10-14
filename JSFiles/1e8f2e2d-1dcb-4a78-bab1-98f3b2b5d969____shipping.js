/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'jquery',
    'underscore',
    'Magento_Ui/js/form/form',
    'ko',
    'Magento_Customer/js/model/customer',
    'Magento_Customer/js/model/address-list',
    'Magento_Checkout/js/model/address-converter',
    'Magento_Checkout/js/model/quote',
    'Magento_Checkout/js/action/create-shipping-address',
    'Magento_Checkout/js/action/select-shipping-address',
    'Magento_Checkout/js/model/shipping-rates-validator',
    'Magento_Checkout/js/model/shipping-address/form-popup-state',
    'Magento_Checkout/js/model/shipping-service',
    'Magento_Checkout/js/action/select-shipping-method',
    'Magento_Checkout/js/model/shipping-rate-registry',
    'Magento_Checkout/js/action/set-shipping-information',
    'Magento_Checkout/js/model/step-navigator',
    'Magento_Ui/js/modal/modal',
    'Magento_Checkout/js/model/checkout-data-resolver',
    'Magento_Checkout/js/checkout-data',
    'uiRegistry',
    'Magento_GiftMessage/js/model/gift-message',
    'mage/translate',
    'Magento_Checkout/js/model/shipping-rate-service'
], function (
    $,
    _,
    Component,
    ko,
    customer,
    addressList,
    addressConverter,
    quote,
    createShippingAddress,
    selectShippingAddress,
    shippingRatesValidator,
    formPopUpState,
    shippingService,
    selectShippingMethodAction,
    rateRegistry,
    setShippingInformationAction,
    stepNavigator,
    modal,
    checkoutDataResolver,
    checkoutData,
    registry,
    giftMessage,
    $t
) {
    'use strict';

    var popUp = null;

    return Component.extend({
        defaults: {
            template: 'Magento_Checkout/shipping',
            shippingFormTemplate: 'Magento_Checkout/shipping-address/form',
            shippingMethodListTemplate: 'Magento_Checkout/shipping-address/shipping-method-list',
            shippingMethodItemTemplate: 'Magento_Checkout/shipping-address/shipping-method-item'
        },
        visible: ko.observable(!quote.isVirtual()),
        errorValidationMessage: ko.observable(false),
        isCustomerLoggedIn: customer.isLoggedIn,
        isFormPopUpVisible: formPopUpState.isVisible,
        isFormInline: addressList().length === 0,
        isNewAddressAdded: ko.observable(false),
        saveInAddressBook: 1,
        quoteIsVirtual: quote.isVirtual(),

        /**
         * @return {exports}
         */
        initialize: function () {
            console.log("AHA!");
            var self = this,
                hasNewAddress,
                fieldsetName = 'checkout.steps.shipping-step.shippingAddress.shipping-address-fieldset';

            this._super();

            if (!quote.isVirtual()) {
                stepNavigator.registerStep(
                    'shipping',
                    '',
                    $t('Shipping'),
                    this.visible,
                    _.bind(this.navigate, this),
                    this.sortOrder
                );
            }
            checkoutDataResolver.resolveShippingAddress();

            hasNewAddress = addressList.some(function (address) {
                return address.getType() == 'new-customer-address'; //eslint-disable-line eqeqeq
            });

            this.isNewAddressAdded(hasNewAddress);

            this.isFormPopUpVisible.subscribe(function (value) {
                if (value) {
                    self.getPopUp().openModal();
                }
            });

            quote.shippingMethod.subscribe(function () {
                self.errorValidationMessage(false);
            });

            registry.async('checkoutProvider')(function (checkoutProvider) {
                var shippingAddressData = checkoutData.getShippingAddressFromData();

                if (shippingAddressData) {
                    checkoutProvider.set(
                        'shippingAddress',
                        $.extend(true, {}, checkoutProvider.get('shippingAddress'), shippingAddressData)
                    );
                }
                checkoutProvider.on('shippingAddress', function (shippingAddrsData) {
                    checkoutData.setShippingAddressFromData(shippingAddrsData);
                });
                shippingRatesValidator.initFields(fieldsetName);
            });

            return this;
        },

        /**
         * Navigator change hash handler.
         *
         * @param {Object} step - navigation step
         */
        navigate: function (step) {
            step && step.isVisible(true);
        },

        /**
         * @return {*}
         */
        getPopUp: function () {
            var self = this,
                buttons;

            if (!popUp) {
                buttons = this.popUpForm.options.buttons;
                this.popUpForm.options.buttons = [
                    {
                        text: buttons.save.text ? buttons.save.text : $t('Save Address'),
                        class: buttons.save.class ? buttons.save.class : 'action primary action-save-address',
                        click: self.saveNewAddress.bind(self)
                },
                    {
                        text: buttons.cancel.text ? buttons.cancel.text : $t('Cancel'),
                        class: buttons.cancel.class ? buttons.cancel.class : 'action secondary action-hide-popup',

                        /** @inheritdoc */
                        click: this.onClosePopUp.bind(this)
                }
                ];

                /** @inheritdoc */
                this.popUpForm.options.closed = function () {
                    self.isFormPopUpVisible(false);
                };

                this.popUpForm.options.modalCloseBtnHandler = this.onClosePopUp.bind(this);
                this.popUpForm.options.keyEventHandlers = {
                    escapeKey: this.onClosePopUp.bind(this)
                };

                /** @inheritdoc */
                this.popUpForm.options.opened = function () {
                    // Store temporary address for revert action in case when user click cancel action
                    self.temporaryAddress = $.extend(true, {}, checkoutData.getShippingAddressFromData());
                };
                popUp = modal(this.popUpForm.options, $(this.popUpForm.element));
            }

            return popUp;
        },

        /**
         * Revert address and close modal.
         */
        onClosePopUp: function () {
            checkoutData.setShippingAddressFromData($.extend(true, {}, this.temporaryAddress));
            this.getPopUp().closeModal();
        },

        /**
         * Show address form popup
         */
        showFormPopUp: function () {
            this.isFormPopUpVisible(true);
        },
        bingBongo: function () {
            alert("FU");
        },
        /**
         * Save new shipping address
         */
        saveNewAddress: function () {
            var addressData,
                newShippingAddress;

            this.source.set('params.invalid', false);
            this.triggerShippingDataValidateEvent();

            if (!this.source.get('params.invalid')) {
                addressData = this.source.get('shippingAddress');
                // if user clicked the checkbox, its value is true or false. Need to convert.
                addressData['save_in_address_book'] = this.saveInAddressBook ? 1 : 0;

                // New address must be selected as a shipping address
                newShippingAddress = createShippingAddress(addressData);
                selectShippingAddress(newShippingAddress);
                checkoutData.setSelectedShippingAddress(newShippingAddress.getKey());
                checkoutData.setNewCustomerShippingAddress($.extend(true, {}, addressData));
                this.getPopUp().closeModal();
                this.isNewAddressAdded(true);
            }
        },

        /**
         * Shipping Method View
         */
        rates: shippingService.getShippingRates(),
        isLoading: shippingService.isLoading,
        isSelected: ko.computed(function () {
            console.log(quote.shippingMethod());
            return quote.shippingMethod() ?
                quote.shippingMethod()['carrier_code'] + '_' + quote.shippingMethod()['method_code'] :
                null;
        }),

        /**
         * @param {Object} shippingMethod
         * @return {Boolean}
         */
    selectShippingMethod: function (shippingMethod) {


        //crafty_address_field_hidden
        console.log('selectShippingmethod fired');
        console.log(shippingMethod);
        // if Delivery Method Was deliveryoption, but now isn't we need to clear the title that was set on frontend
        if (shippingMethod.carrier_code != 'deliveryoption') {
            console.log('Not Delivery Option');
            jQuery('#label_method_deliveryoption_deliveryoption').text("Courier");
            jQuery('#label_carrier_deliveryoption_deliveryoption').text("Courier");
        } else {
            console.log('Delivery Option Ok Deliveryinfo Then Quote:');
            var deliveryinfo = quote['deliveryinfo'];
            console.log(deliveryinfo);
            var shippingAddress = quote.shippingAddress();


            if (shippingAddress['extension_attributes'] === undefined) {
                shippingAddress['extension_attributes'] = {};
            }

            console.log(quote);
            var shippingMethod = quote.shippingMethod();

            if (shippingMethod.hasOwnProperty('method_code')) {
                if (shippingMethod.method_code == "deliveryoption") {
                    var detailed_delivery_info_dates = jQuery('.delivery-radio-selector').find('input[name="deliveryMobile"]:checked').attr('methodrangedates');
                    var detailed_delivery_teamnumber = jQuery('.delivery-radio-selector').find('input[name="deliveryMobile"]:checked').attr('data-deliveryteamnumber');

                    // What if it isn't set?

                    shippingAddress['extension_attributes']['detailed_delivery_info_dates'] = detailed_delivery_info_dates;
                    shippingAddress['extension_attributes']['detailed_delivery_info'] = 'I dunno';

                    shippingAddress['extension_attributes']['detailed_delivery_teamnumber'] = detailed_delivery_teamnumber;
                    var dateval = jQuery('.delivery-radio-selector').find('input[name="deliveryMobile"]:checked').val();


                    var summarytext = jQuery('.delivery-radio-selector').find('input[name="deliveryMobile"]:checked').attr('data-methodsummarytext');

                    console.log("Method Title = Summary Text");
                    //shippingMethod.carrier_title = summarytext;
                    shippingMethod.method_title = summarytext;
                    shippingAddress['extension_attributes']['delivery_selected_summarytext'] = summarytext;
                    if (typeof dateval != "undefined") {
                        var date = dateval.split("_", 3);

                        // 0 - date value
                        // 1 - method
                        // 2 - area?

                        if (date.hasOwnProperty(0)) {
                            // Date Set
                            console.log('date set');
                            shippingAddress['extension_attributes']['delivery_date_selected'] = date[0];
                        } else {
                            // No Date Set
                            console.log("no date set");
                        }

                        if (date.hasOwnProperty(1)) {
                            // Date Set
                            console.log('date method');
                            shippingAddress['extension_attributes']['delivery_option_selected'] = date[1];
                        } else {
                            // No Date Set
                            console.log("no date method set");
                        }

                        if (date.hasOwnProperty(2)) {
                            // Date Set
                            console.log('date area');
                            shippingAddress['extension_attributes']['delivery_area_selected'] = date[2];
                        } else {
                            // No Date Set
                            console.log("no date area set");
                        }
                    }
                    if (typeof summarytext != 'undefined') {
                        shippingAddress['extension_attributes']['delivery_selected_summarytext'] = summarytext;
                    }
                    console.log("Shipping Address");
                    console.log(shippingAddress);
                    //var methodid = jQuery('.delivery-radio-selector').find('input[name="deliveryMobile"]').attr('method');
                    var elementthatwewant = jQuery('#checkout-shipping-method-load .radio:checked').val();

                    var value = jQuery('#deliveryMethodSelected').val();
                    //console.log(value);

                    var whatschecked = jQuery('#mobile-dates-container').find('input[name="deliveryMobile"] :checked').val();

                    var compareval = jQuery(whatschecked).val();

                    if (elementthatwewant == 'deliveryoption_deliveryoption') {
                        var whatschecked = jQuery('input[name="deliveryMobile"]:checked');
                        if (whatschecked.length == 0 || whatschecked == false) {
                            // No Date Option Selected -

                            console.log('Value Null, Not going forward!');

                            var options = {
                                type: 'popup',
                                responsive: true,
                                innerScroll: true,
                                modalClass: 'checkout-error-modal',
                                title: '<i class="fa fa-exclamation-triangle"></i> Error',
                                buttons: [{
                                    text: $.mage.__('Continue'),
                                    class: '',
                                    click: function () {
                                        this.closeModal();
                                    }
                                }]
                            };
                            jQuery('#checkout-modal .content').html('<p>No date option selected. Please select an option and try again.</p>');
                            var popup = modal(options, jQuery('#checkout-modal'));
                            jQuery('#checkout-modal').modal('openModal');

                            jQuery('#modal-container').show();
                        }
                    } else {
                        console.log("Not right elemetn?");
                    }
                }
            }
        }
        console.log("shipping Method:");
        console.log(shippingMethod);

        // Validate Price/etc?
        console.log("validate me");
        var validationcheck = this.validateMethod(summarytext);


        selectShippingMethodAction(shippingMethod);
        console.log("Shipping Method Action Fired Now Method:");
        console.log(shippingMethod);

        //mixin.updateDeliveryCarrierTitle(shippingMethod,'Courier');
        //console.log(shippingMethod);
        checkoutData.setSelectedShippingRate(shippingMethod['carrier_code'] + '_' + shippingMethod['method_code']);
        console.log('delivery object:')
        console.log(delivery);
        var something = delivery.getDeliveryOptions();

        console.log('something');
        console.log(something);
        //quote.shippingmethod(shippingMethod);


        return true;
    },

        /**
         * Set shipping information handler
         */
        setShippingInformation: function () {
            console.log('Set Shipping Infomation');
            if (this.validateShippingInformation()) {
                quote.billingAddress(null);
                checkoutDataResolver.resolveBillingAddress();
                console.log("delivery Info:");
                var deliveryinfo = quote['deliveryinfo'];
                console.log(deliveryinfo);
                var shippingAddress = quote.shippingAddress();

                registry.async('checkoutProvider')(function (checkoutProvider) {
                    var shippingAddressData = checkoutData.getShippingAddressFromData();

                    if (shippingAddressData) {
                        checkoutProvider.set(
                            'shippingAddress',
                            $.extend(true, {}, checkoutProvider.get('shippingAddress'), shippingAddressData)
                        );
                    }
                    if (shippingAddress['extension_attributes'] === undefined) {
                        shippingAddress['extension_attributes'] = {};
                    }
                    console.log('Quote Object');
                    console.log(quote);
                    if (quote['extension_attributes'] === undefined) {
                        quote['extension_attributes'] = {};
                    }

                    var shippingMethod = quote.shippingMethod();
                    if (shippingMethod.hasOwnProperty('method_code')) {
                        var detailed_delivery_info_dates = jQuery('.delivery-radio-selector').find('input[name="deliveryMobile"]:checked').attr('methodrangedates');
                        var detailed_delivery_teamnumber = jQuery('.delivery-radio-selector').find('input[name="deliveryMobile"]:checked').attr('data-deliveryteamnumber');

                        // What if it isn't set?

                        if (shippingMethod.method_code == "deliveryoption") {
                            var postcode = jQuery('input[name=postcode]').val();
                            var country = jQuery('[name="country_id"]').val();

                            // For Logged In Customers
                            if (!postcode) {
                                postcode = jQuery('.selected-item .sel-postcode').text();
                            }
                            if (!country) {
                                country = jQuery('.selected-item .sel-countryid').text()
                            }


                            var price = jQuery('.delivery-radio-selector').find('input[name="deliveryMobile"]:checked').attr('data-price');
                            var date = jQuery('.delivery-radio-selector').find('input[name="deliveryMobile"]:checked').val();
                            var methodrangedates = jQuery('.delivery-radio-selector').find('input[name="deliveryMobile"]:checked').attr('methodrangedates');
                            var summarytext = jQuery('.delivery-radio-selector').find('input[name="deliveryMobile"]:checked').attr('data-methodsummarytext');
                            var teamnumber = jQuery('.delivery-radio-selector').find('input[name="deliveryMobile"]:checked').attr('data-deliveryteamnumber');
                            var methodid = jQuery('.delivery-radio-selector').find('input[name="deliveryMobile"]:checked').attr('method');
                            var quoteid = quote.getQuoteId();
                            console.log(methodid);
                            var tS = new Date().getTime();

                            console.log('Validating');
                            var url = '/deliveryoptions/delivery/getprice/postcode/' + postcode + '/country/' + country + '/method/' + methodid + '/date/' + date + '/price/' + price + '/summarytext/' + summarytext + '/rangedates/' + methodrangedates + '/teamnumber/' + teamnumber + '/quoteid/' + quoteid + '/&ts=' + tS;


                            var data = jQuery('#co-shipping-form').serializeArray();

                            var proceed = false;
                            $.ajax({
                                url: url,
                                dataType: 'json',
                                type: 'post',
                                data: data,
                                //context: this,

                                /** @inheritdoc */
                                beforeSend: function () {
                                    //ajaxOverlayPostcodeShow();
                                },

                                /** @inheritdoc */
                                complete: function () {

                                }
                            }).done(function (response) {
                                console.log('done ajax validate');
                                console.log(response);

                                if (response.hasOwnProperty('error_message')) {
                                    // Nope Error

                                    var error_message = response.error_message;
                                    $('#elevateLightboxModal .bs-modal-title').html('Error');
                                    $('#elevateLightboxModal .bs-modal-body').html(error_message);
                                    $('#elevateLightboxModal').bsmodal('show');
                                } else {
                                    // Ok All Good
                                    console.log("dateval");
                                    console.log(date);
                                    var summarytext = jQuery('.delivery-radio-selector').find('input[name="deliveryMobile"]:checked').attr('data-methodsummarytext');
                                    console.log("summary text: " + summarytext);
                                    //shippingMethod.carrier_title = summarytext;
                                    shippingMethod.method_title = summarytext;
                                    console.log(shippingMethod);
                                    checkoutData.setSelectedShippingRate(shippingMethod['carrier_code'] + '_' + shippingMethod['method_code']);

                                    // Add Date from Input To Quote Object
                                    // TODO - Should htis be only if confirmed by above

                                    if (typeof date != "undefined") {
                                        var datenew = date.split("_", 3);

                                        // 0 - date value
                                        // 1 - method
                                        // 2 - area?

                                        if (datenew.hasOwnProperty(0)) {
                                            // Date Set
                                            console.log('date set');
                                            shippingAddress['extension_attributes']['delivery_date_selected'] = datenew[0];
                                        } else {
                                            // No Date Set
                                            console.log("no date set");
                                        }

                                        if (datenew.hasOwnProperty(1)) {
                                            // datenew Set
                                            console.log('datenew method');
                                            shippingAddress['extension_attributes']['delivery_option_selected'] = datenew[1];
                                        } else {
                                            // No datenew Set
                                            console.log("no datenew method set");
                                        }

                                        if (datenew.hasOwnProperty(2)) {
                                            // datenew Set
                                            console.log('datenew area');
                                            shippingAddress['extension_attributes']['delivery_area_selected'] = datenew[2];
                                        } else {
                                            // No datenew Set
                                            console.log("no datenew area set");
                                        }
                                    }
                                    shippingAddress['extension_attributes']['delivery_selected_summarytext'] = summarytext;
                                    var detailed_delivery_info_dates = jQuery('.delivery-radio-selector').find('input[name="deliveryMobile"]:checked').attr('methodrangedates');
                                    var detailed_delivery_teamnumber = jQuery('.delivery-radio-selector').find('input[name="deliveryMobile"]:checked').attr('data-deliveryteamnumber');

                                    var detailed_delivery_start_time = jQuery('.delivery-radio-selector').find('input[name="deliveryMobile"]:checked').attr('data-delivery-start-time');
                                    var detailed_delivery_end_time = jQuery('.delivery-radio-selector').find('input[name="deliveryMobile"]:checked').attr('data-delivery-end-time');
                                    var detailed_delivery_before_time = jQuery('.delivery-radio-selector').find('input[name="deliveryMobile"]:checked').attr('data-delivery-before-time');

                                    var ev_giftmessagemessage = jQuery('#gift-message-message').val();


                                    quote['extension_attributes']['detailed_delivery_info_dates'] = detailed_delivery_info_dates;
                                    quote['extension_attributes']['detailed_delivery_info'] = '';
                                    quote['extension_attributes']['detailed_delivery_teamnumber'] = detailed_delivery_teamnumber;
                                    quote['extension_attributes']['detailed_delivery_start_time'] = detailed_delivery_start_time;
                                    quote['extension_attributes']['detailed_delivery_end_time'] = detailed_delivery_end_time;
                                    quote['extension_attributes']['detailed_delivery_before_time'] = detailed_delivery_before_time;
                                    quote['extension_attributes']['ev_giftmessagemessage'] = ev_giftmessagemessage;
                                    console.log(quote);
                                    console.log('Quote Object in Set Shipping Information Function By Extension Attrb');


                                    shippingAddress['extension_attributes']['detailed_delivery_info_dates'] = detailed_delivery_info_dates;
                                    shippingAddress['extension_attributes']['detailed_delivery_info'] = '';
                                    shippingAddress['extension_attributes']['detailed_delivery_teamnumber'] = detailed_delivery_teamnumber;
                                    shippingAddress['extension_attributes']['detailed_delivery_start_time'] = detailed_delivery_start_time;
                                    shippingAddress['extension_attributes']['detailed_delivery_end_time'] = detailed_delivery_end_time;
                                    shippingAddress['extension_attributes']['detailed_delivery_before_time'] = detailed_delivery_before_time;
                                    shippingAddress['extension_attributes']['ev_giftmessagemessage'] = ev_giftmessagemessage;
                                    setShippingInformationAction().done(
                                        function () {

                                            var shippingmethodvalue = jQuery('.totals.shipping th .value').text();

                                            /* TODO pull the default title and compare agaisnt that not like this */
                                            //console.log('shipping methodvalue: ' + shippingmethodvalue);

                                            if (shippingmethodvalue == "DeliveryOption - DeliveryOption") {
                                                // Setting Value because of first forward not setting it properly visually - it does programatically!
                                                jQuery('.totals.shipping th .value').text(summarytext);
                                                jQuery('.shipping-information-content .value').text(summarytext);
                                                //console.log(jQuery('.totals.shipping th .value'));
                                            }
                                            // Need to fix if not this method!
                                            jQuery('.shipping-information-content .value').text(summarytext);
                                            jQuery('.totals.shipping th .value').text(summarytext);

                                            console.log('Set Shipping Information Action Done, Moving to Next Step');

                                            stepNavigator.next();
                                        }
                                    );

                                    //var methodid = jQuery('.delivery-radio-selector').find('input[name="deliveryMobile"]').attr('method');


                                    //shippingAddress['extension_attributes']['delivery_option_selected'] = "A";
                                }


                            }).fail(function (jqXHR, textStatus) {
                                alert("Request failed: " + textStatus);


                            });
                        } else {
                            shippingAddress['extension_attributes']['delivery_date_selected'] = "0000-00-00";
                            shippingAddress['extension_attributes']['delivery_option_selected'] = "";
                            shippingAddress['extension_attributes']['delivery_area_selected'] = "";
                            shippingAddress['extension_attributes']['delivery_selected_summarytext'] = "";
                            shippingAddress['extension_attributes']['detailed_delivery_info_dates'] = "";
                            shippingAddress['extension_attributes']['detailed_delivery_info'] = "";
                            shippingAddress['extension_attributes']['detailed_delivery_teamnumber'] = "";
                            shippingAddress['extension_attributes']['detailed_delivery_start_time'] = "";
                            shippingAddress['extension_attributes']['detailed_delivery_end_time'] = "";
                            shippingAddress['extension_attributes']['detailed_delivery_before_time'] = "";
                            shippingAddress['extension_attributes']['ev_giftmessagemessage'] = "";
                            setShippingInformationAction().done(
                                function () {
                                    stepNavigator.next();
                                }
                            );
                        }
                    }
                    console.log("shipping Address");
                    console.log(shippingAddress);
                });
            }


        },

        /**
         * @return {Boolean}
         */
        validateShippingInformation: function () {
            var shippingAddress,
                addressData,
                loginFormSelector = 'form[data-role=email-with-possible-login]',
                emailValidationResult = customer.isLoggedIn(),
                field,
                country = registry.get(this.parentName + '.shippingAddress.shipping-address-fieldset.country_id'),
                countryIndexedOptions = country.indexedOptions,
                option = countryIndexedOptions[quote.shippingAddress().countryId],
                messageContainer = registry.get('checkout.errors').messageContainer;

            if (!quote.shippingMethod()) {
                this.errorValidationMessage(
                    $t('The shipping method is missing. Select the shipping method and try again.')
                );

                return false;
            }

            if (!customer.isLoggedIn()) {
                $(loginFormSelector).validation();
                emailValidationResult = Boolean($(loginFormSelector + ' input[name=username]').valid());
            }

            if (this.isFormInline) {
                this.source.set('params.invalid', false);
                this.triggerShippingDataValidateEvent();

                if (emailValidationResult &&
                    this.source.get('params.invalid') ||
                    !quote.shippingMethod()['method_code'] ||
                    !quote.shippingMethod()['carrier_code']
                ) {
                    this.focusInvalid();

                    return false;
                }

                shippingAddress = quote.shippingAddress();
                addressData = addressConverter.formAddressDataToQuoteAddress(
                    this.source.get('shippingAddress')
                );

                //Copy form data to quote shipping address object
                for (field in addressData) {
                    if (addressData.hasOwnProperty(field) &&  //eslint-disable-line max-depth
                        shippingAddress.hasOwnProperty(field) &&
                        typeof addressData[field] != 'function' &&
                        _.isEqual(shippingAddress[field], addressData[field])
                    ) {
                        shippingAddress[field] = addressData[field];
                    } else if (typeof addressData[field] != 'function' &&
                        !_.isEqual(shippingAddress[field], addressData[field])) {
                        shippingAddress = addressData;
                        break;
                    }
                }

                if (customer.isLoggedIn()) {
                    shippingAddress['save_in_address_book'] = 1;
                }
                selectShippingAddress(shippingAddress);
            } else if (customer.isLoggedIn() &&
                option &&
                option['is_region_required'] &&
                !quote.shippingAddress().region
            ) {
                messageContainer.addErrorMessage({
                    message: $t('Please specify a regionId in shipping address.')
                });

                return false;
            }

            if (!emailValidationResult) {
                $(loginFormSelector + ' input[name=username]').focus();

                return false;
            }

            return true;
        },

        /**
         * Trigger Shipping data Validate Event.
         */
        triggerShippingDataValidateEvent: function () {
            this.source.trigger('shippingAddress.data.validate');

            if (this.source.get('shippingAddress.custom_attributes')) {
                this.source.trigger('shippingAddress.custom_attributes.data.validate');
            }
        },
        validateMethod: function () {


            var postcode = jQuery('input[name=postcode]').val();
            var country = jQuery('[name="country_id"]').val();

            var tS = new Date().getTime();

            //console.log(parent);
            var postcode = jQuery('input[name=postcode]').val();
            var country = jQuery('[name="country_id"]').val();
            var price = jQuery('.delivery-radio-selector').find('input[name="deliveryMobile"]:checked').attr('data-price');
            var date = jQuery('.delivery-radio-selector').find('input[name="deliveryMobile"]:checked').val();


            var methodid = jQuery('.delivery-radio-selector').find('input[name="deliveryMobile"]:checked').attr('method');
            console.log(methodid);
            var tS = new Date().getTime();

            console.log('Validating 1');

            var url = '/deliveryoptions/delivery/getprice/postcode/' + postcode + '/country/' + country + '/method/' + methodid + '/date/' + date + '/price/' + price + '/&ts=' + tS;

            //console.log(this);
            //console.log(quote);
            // url = url.replace("https://","http://"); // New Code
            var data = jQuery('#co-shipping-form').serializeArray();
            //var myvar = this;

            $.ajax({
                url: url,
                dataType: 'json',
                type: 'post',
                data: data,
                //context: this,

                /** @inheritdoc */
                beforeSend: function () {
                    //ajaxOverlayPostcodeShow();
                },

                /** @inheritdoc */
                complete: function () {

                }
            })

                .done(function (response) {
                    console.log('done ajax validate');
                    if (response.hasOwnProperty("error_message")) {
                        $('#elevateLightboxModal .bs-modal-title').html('Error');
                        $('#elevateLightboxModal .bs-modal-body').html(error_message);
                        $('#elevateLightboxModal').bsmodal('show');
                        console.log(response.error_message);
                        return false;
                    } else {
                        quote.ShippingMethod.carrier_title = summarytext;
                        quote.ShippingMethod.method_title = summarytext;
                        return true;
                    }


                    //his.deliveryinfo = response.methods_available;
                    //quote['deliveryinfo'] = this.deliveryinfo;
                    //jQuery('.display-this').show();
                })
                .fail(function (jqXHR, textStatus) {
                    alert("Request failed: " + textStatus);
                    return false;
                });
            // So Default Click happens

        },
        updateDeliveryOptionPrice(value) {

            if (value == "Free") {
                jQuery('.price_deliveryoption').text('£' + value);
            } else {
                jQuery('.price_deliveryoption').text('£' + value);
            }
        },
        updateDeliveryOptionTitle(partone, parttwo) {
            //console.log('updatedeliveryoptiontitle');
            jQuery('#label_method_deliveryoption_deliveryoption').text(partone);
            jQuery('#label_carrier_deliveryoption_deliveryoption').text(partone + parttwo);
        },
        updateDeliveryCarrierTitle(shippingMethod, newtitle) {
            shippingMethod.carrier_title = newtitle;
        },
        updateDeliveryMethodTitle(shippingMethod, newtitle) {
            shippingMethod.method_title = newtitle;
        },
    });
});
