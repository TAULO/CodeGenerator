$(document).ready(function () {
    var summary = $('.summary'),
        configurator = $('.server-configurator'),
        initFixed = summary.offset().top - 10,
        stopFixed = getHeightToStopSticky(),
        form = $('#configurator_form'),
        overwriteScroll = false,
        submitForm = $('.submitForm'),
        hetzner_ipv4_option_container = $('.hetzner_ipv4_option_container'),
        ipOptionListing = [];

    if (hetzner_ipv4_option_container.length) {
        hetzner_ipv4_option_container.find('[type="checkbox"]').each(function () {
            ipOptionListing.push(parseInt($(this).attr('data-total')));
        });

        ipOptionListing = ipOptionListing.sort();
    }


    submitForm.on('click', function (e) {
        e.preventDefault();

        submitForm.find('.submitText').hide();
        submitForm.find('.loading ').show();

        var options = {},
            extensions = {};

        $('.specs [data-option-id]:not([data-extension-id]), .server-summary [data-option-id]').each(function () {
            options[this.dataset.optionId] = [this.dataset.detailId];
        });

        $('.specs [data-option-id][data-extension-id]').each(function () {
            if (! (this.dataset.detailId in extensions))
                extensions[this.dataset.detailId] = [];

            extensions[this.dataset.detailId].push(this.dataset.extensionId);
        });

        var data = {
                _token              : $('[name="_token"]').val(),
                length              : $length,
                settings            : {},
                options             : options,
                extensions          : extensions,
                sku                 : form.find('[name="product_sku"]').val(),
                catalog_product_id  : form.find('[name="catalog_product_id"]').val(),
                unique_id           : unique_page_identifier,
                user_attributes     : {
                    hostname : form.find('[name="hostname"]').val()
                }
            },
            url = location.origin + '/cart/add';

        if (this.classList.value.indexOf('update') > -1)
            url = location.origin + '/cart/edit/' + form.find('[name="cart_item_id"]').val();

        $.ajax(
            new $.ajax_prototype({
                'type'          : 'POST',
                'url'           : url,
                'data'          : data,
                'success'       : function (data) {
                    if (data.success) {
                        //Item added to cart - due to redirect add_to_cart event will be sent on next load
                        if (app_env != 'local' && 'remarketing_items' in data.data)
                            $.setAddToCartConfiguredCart(data.data.remarketing_items);

                        redirect = data.data.id;
                    } else
                        $.cart.errorHandler(data);
                },
                'beforeSend'    : function () {
                    form.find('input').disabled(true);

                    $('.server-configurator .help-block').remove();
                    $('.server-configurator .error').removeClass('error');
                },
                'complete'      : function () {
                    if (typeof redirect != 'undefined') {
                        $.set_cookie('cart_item', redirect, '/', site_map.cart);
                    } else {
                        submitForm.find('.submitText').show();
                        submitForm.find('.loading ').hide();

                        form.find('input').disabled(false);
                    }
                }
            })
        )
    });

    form.find('[type="radio"]:not(.extension-panel input):not(.custom-display input):not(.sub-product input)').on('change', function () {

        var obj = $(this),
            option = obj.closest('[data-option-id]'),
            edit = $('.specs [data-option-id="' + option.attr('data-option-id') + '"][data-detail-id]:not(.extension)');

        if (obj.val() != 'none') {
            if (edit.length)
                editItemInSummary(obj, edit);
            else
                insertItemToSummary(obj);
        } else
            edit.remove();

        calculateTotal();

        if ((configurator.height() - summary.height()) >= 200) {
            if ($.getSizeClassification('large_up'))
                summaryStickHandler();
        }

        var extensionPanel = $('.extension-panel[data-option-id="' + option.attr('data-option-id') + '"]:visible');



        if (extensionPanel.length ) {
            if(!obj.hasClass('extensions-panel-trigger')) {
                extensionPanel.hide();
                extensionPanel.find('[type="checkbox"]').checked(false).trigger('change');
                extensionPanel.find('[value="none"]').checked(true).trigger('change');
            }else{
               if( obj.val() != extensionPanel.attr("data-detail-id")){
                extensionPanel.hide();
                extensionPanel.find('[type="checkbox"]').checked(false).trigger('change');
                extensionPanel.find('[value="none"]').checked(true).trigger('change');
               }

            }
        }


        if (obj.hasClass('extensions-panel-trigger')) {
            $('.extension-panel[data-detail-id="' + obj.val() + '"]').show();
        }
    });

    form.find('.extension-trigger[type="radio"]:not(.custom-display input):not(.sub-product input)').on('change', function () {
        var obj = $(this),
            extensionName = obj.closest('[data-extension-name]'),
            edit;

        if (extensionName.length)
            edit = $('.specs [data-option-id="' + obj.closest('[data-option-id]').attr('data-option-id') + '"][data-extension-name="' + extensionName.attr('data-extension-name') +'"]');
        else
            edit = $('.specs [data-option-id="' + obj.closest('[data-option-id]').attr('data-option-id') + '"][data-extension-id="' + obj.val() +'"]');

        if (obj.val() != 'none') {
            if (edit.length)
                editItemInSummary(obj, edit);
            else
                insertItemToSummary(obj);
        } else
            edit.remove();

        calculateTotal();

        if ((configurator.height() - summary.height()) >= 200) {
            if ($.getSizeClassification('large_up'))
                summaryStickHandler();
        }
    });

    form.find('.extension-trigger[type="checkbox"]:not(.custom-display input)').each(function(){
        $(this).on('change', function () {



        var obj = $(this);


        if (obj.checked())

            insertItemToSummary(obj);

        else


            $('.specs [data-option-id="' + obj.closest('[data-option-id]').attr('data-option-id') + '"][data-extension-id="' + obj.val() +'"]').remove();

        calculateTotal();

        if ((configurator.height() - summary.height()) >= 200) {
            if ($.getSizeClassification('large_up'))
                summaryStickHandler();
        }
    });
    });



    summary.find('.length a').on('click', function (e) {

       e.preventDefault();

        durationWasChanged($(this));
    });

    $('#vatControlsModal').on('modal:opening', function () {
        summary.attr('data-pos-top', summary.css('top'));
        summary.attr('data-pos-type', summary.css('position'));
    });

    $('#vatControlsModal').on('modal:opened', function () {
        overwriteScroll = true;
        summary.css('top', summary.attr('data-pos-top'));
        summary.css('position', summary.attr('data-pos-type'));
    });

    $('#vatControlsModal').on('modal:closed', function () {
        overwriteScroll = false;
    });

    hetzner_ipv4_option_container.find('.ip-subnets').on('change', function () {
        var obj = $(this),
            ipTotal = 0,
            price = 0,
            lengthPrice = 0;

        var selected = obj.find('[type="checkbox"]:checked'),
            slash27 = obj.find('[type="checkbox"][data-total="30"]'),
            additional_ip = $('[data-extension-name="additional_ip"]'),
            option_id = obj.find('[data-option-id]').attr('data-option-id'),
            summaryOption = $('.summary [data-option-id="' + option_id + '"]'),
            inputs, vat;

        if (selected.length == 1) {
            obj.find('[type="checkbox"]:not([data-total="1"])').disabled(false);

            inputs = additional_ip.find('[type="radio"]');
            inputs.disabled(false);

            inputs.filter(':checked').trigger('change');

            ipTotal = 1;
        } else if (slash27.checked()) {
            obj.find('[type="checkbox"]:not([data-total="1"]):not([data-total="30"])').checked(false).disabled(true);

            inputs = additional_ip.find('[type="radio"]');
            inputs.disabled(true);
            $('#additional_ip_none').checked(true).trigger('change');

            ipTotal = 31;

            vat = slash27.closest('li').find('.vat');

            price = vat.get_price();
            lengthPrice = vat.get_price('data-price-length-unit');
        } else {
            var toCheck = [];

            for (var i in ipOptionListing) {
                if (ipOptionListing.hasOwnProperty(i)) {
                    var input = hetzner_ipv4_option_container.find('[data-total="' + ipOptionListing[i] + '"]');

                    if (input.checked()) {
                        ipTotal += ipOptionListing[i];

                        vat = input.closest('li').find('.vat');

                        price += vat.get_price();
                        lengthPrice += vat.get_price('data-price-length-unit');
                    } else
                        toCheck.push(input);
                }
            }

            for (var i in toCheck) {
                if (toCheck.hasOwnProperty(i)) {
                    var tmp = ipTotal + parseInt($(toCheck[i]).attr('data-total'));

                    if (tmp > 30)
                        toCheck[i].checked(false);
                    else
                        toCheck[i].disabled(false);
                }
            }

            if (ipTotal >= 30) {
                $('[name="additional_ip"]:not([value="none"])').checked(false).disabled(true);
                $('[name="additional_ip"][value="none"]').checked(true).disabled(false).trigger('change');
            } else {
                $('[name="additional_ip"]:not([value="none"])').each(function () {
                    var input = $(this);

                    var tmp = ipTotal + parseInt(input.attr('data-total'));

                    if (tmp > 30)
                        input.checked(false).disabled(true);
                    else
                        input.disabled(false);
                });

                $('[name="additional_ip"]:not([value="none"]):checked').trigger('change');
            }
        }

        $('#hetznerTotalIps').text(ipTotal);
        summaryOption.find('.display-name').text('Σύνολο IP: ' + ipTotal + (ipTotal == 1 ? ' IP' : ' IPs'));
        summaryOption.find('.display-price').html($.insert_vat('on-length', lengthPrice, price, {}, [{'mask' : '&euro;', 'replacement' : ' €'}]));

        calculateTotal();
    });

    if ($.getSizeClassification('large_up'))
        summaryStickHandler();

    $.observers.register('configuratorOptions', function () {
        stopFixed = getHeightToStopSticky();

        summaryStickHandler();
    });

    $.observers.register('summary', function () {
        summaryStickHandler();
    });

    $.observers.observe('configuratorOptions', $('#configuratorOptions'), {attributes: true, subtree: true, childList: true});
    $.observers.observe('summary', $('.summary'), {subtree: true, childList: true});

    window.addEventListener('scroll', function () {
        if ((configurator.height() - summary.height()) >= 200) {
            if ($.getSizeClassification('large_up'))
                summaryStickHandler();
        }
    });

    window.addEventListener('resize', function () {
        try {
            clearTimeout(summaryTimmer);
        } catch (e) {}

        summaryTimmer = setTimeout(function () {
            if ($.getSizeClassification('large_up')) {
                summary.css({
                    'position' : 'static',
                    'top'   : 'initial'
                });

                initFixed = summary.offset().top - 10;
                stopFixed = getHeightToStopSticky();

                summaryStickHandler();
            } else {
                summary.css({
                    'position' : 'static',
                    'top'   : 'initial'
                });
            }
        })
    });

    function summaryStickHandler () {
        if (overwriteScroll)
            return;

        if ((configurator.height() - summary.height()) >= 200) {
            if (window.scrollY >= initFixed) {
                summary.css({
                    'position': 'fixed',
                    'top': '18px'
                });

                if (window.scrollY >= stopFixed) {
                    summary.css({
                        'position': 'absolute',
                        'top': $('#configurator_form').height() - $('.inner-wrapper').height() - 20 + 'px'
                    });
                }
            } else {
                summary.css({
                    'position': 'static',
                    'top': 'initial'
                });
            }
        } else {
            summary.css({
                    'position': 'static',
                    'top': 'initial'
                });
        }
    }

    function getHeightToStopSticky () {
        return $('#configurator_form').height() - $('.inner-wrapper').height() * 0.8 + 25;
    }

    function editItemInSummary (obj, edit) {

        var text = obj.next('label').find('.name:first').clone();
        text.find('.adminSuggestion, .descIcon, .descDropdown').remove();
        text = text.text();

        text = obj.closest('.panel').find('.lead').text() + ': ' + text;

        var vatPrice = obj.next('label').find('.vat');

        if (obj.hasClass('extension-trigger'))
            edit.attr('data-extension-id', obj.val());
        else
            edit.attr('data-detail-id', obj.val());

        edit.find('.display-name').text(text);
        edit.find('.vat').update_vat('on-length', vatPrice, 'data-price-length-unit');
    }

    function insertItemToSummary (obj) {


        var optionCont = obj.closest('[data-option-id]'),
            name = obj.next('label').find('.name:first').clone(),
            vatPrice = obj.next('label').find('.vat'),
            optionId = optionCont.attr('data-option-id'),
            orderScreenShotTmp = orderScreenShot,
            before, after, text,classExt;

        if(optionCont.hasClass("extension-panel")){
          classExt = 'class="extension"';
        }else{
            classExt ='';
        }

        name.find('.adminSuggestion, .descIcon, .descDropdown').remove();
        text = name.text();


        var pos = findPos(optionId, orderScreenShotTmp);

        before  = pos['before'];
        after   = pos['after'];

        var distinquisingAttr = '';

        if (obj.hasClass('extension-trigger')) {

            var extensionList = obj.closest('ul'),
                extensionName = extensionList.attr('data-extension-name');

            distinquisingAttr = 'data-detail-id="' + obj.closest('[data-detail-id]').attr('data-detail-id') + '" data-extension-id="' + obj.val() + '"';

            if (typeof extensionName != 'undefined')
                distinquisingAttr += ' data-extension-name="' + extensionName + '"';
        } else {
            distinquisingAttr = 'data-detail-id="' + obj.val() + '"';
        }

        text = obj.closest('.panel').find('.lead').text() + ': ' + text;

        var item = '<li data-option-id="' + optionId + '" ' + distinquisingAttr + classExt+ '><div class="display-name">' + text +'</div><div class="display-price text-right">' + $.insert_vat('on-length', vatPrice.get_price('data-price-length-unit'), vatPrice.get_price(), {}, [{'mask' : '&euro;', 'replacement' : ' €'}]) + '</div></li>';

        var placed = false;
        $('ul.no-bullet li[data-extension-id="'+obj.val()+'"]').remove();
        var isUniqueElements=$('ul.no-bullet li[data-extension-id="'+obj.val()+'"]').length==0;
        if (obj.hasClass('extension-trigger')&& isUniqueElements) {

            var parent = $('.specs [data-option-id="' + optionId + '"]');

            if (parent.length) {
                parent.last().after(item);
                placed = true;
            }
        }

        if (placed === false && isUniqueElements) {
            if (before)
                $('.specs [data-option-id="' + before + '"]').before(item);
            else if (after)
                $('.specs [data-option-id="' + after + '"]').after(item);
            else
                $('.specs ul').append(item);
        }
    }

    function calculateTotal () {
        var total = 0,
            total_per_length = 0,
            discount = 0,
            setup = 0;

        $('.specs [data-option-id]:not([data-extension-id]):not([data-multy-option])').each(function () {
            var obj = $(this),
                option = $allProductPrices[obj.attr('data-option-id')][obj.attr('data-detail-id')];

            total += parseFloat(option['total'][$length]);
            total_per_length += parseFloat(option['total_per_interval'][$length]);
            discount += parseFloat(option["comparison_length_to_smaller_length"]["discount_total"]["monetary"][$length]);

            if ('setup_fee' in option)
                setup += parseFloat(option['setup_fee'][$length]);
        });

        $('.specs [data-option-id][data-extension-id]').each(function () {
            var obj = $(this),
                extension = null;

            try {

                extension = $allProductPrices[obj.attr('data-option-id')][obj.attr('data-detail-id')]['extensions'][obj.attr('data-extension-id')];
            } catch (e) {
                return true;
            }

            total += parseFloat(extension['total'][$length]);
            total_per_length += parseFloat(extension['total_per_interval'][$length]);
            discount += parseFloat(extension["comparison_length_to_smaller_length"]["discount_total"]["monetary"][$length]);
            if ('setup_fee' in extension)
                setup += parseFloat(extension['setup_fee'][$length]);
        });

        $('.specs [data-option-id]:not([data-extension-id])[data-multy-option]').each(function () {
            var obj = $(this),
                optionId = obj.attr('data-option-id'),
                inputs = $('#configuratorOptions [data-option-id="' + optionId + '"]:not([data-detail-id]) input:checked');

            inputs.each(function () {
                var detail = $(this),
                    optionPrices = $allProductPrices[optionId][detail.val()];

                total += parseFloat(optionPrices['total'][$length]);
                total_per_length += parseFloat(optionPrices['total_per_interval'][$length]);
                discount += parseFloat(optionPrices["comparison_length_to_smaller_length"]["discount_total"]["monetary"][$length]);

                if ('setup_fee' in optionPrices)
                    setup += parseFloat(optionPrices['setup_fee'][$length]);
            });
        });


        var defaultOptionPrices = {
            'total'                 : 0,
            'total_per_interval'    : 0,
            'discount_total'        : 0,
            'setup_fee'             : 0
        };

        $('.server-summary [data-option-id]').each(function () {
            var option = $allProductPrices[this.dataset['optionId']][this.dataset['detailId']];

            defaultOptionPrices['total'] += parseFloat(option['total'][$length]);
            defaultOptionPrices['total_per_interval'] += parseFloat(option['total_per_interval'][$length]);
            defaultOptionPrices["discount_total"] += parseFloat(option["comparison_length_to_smaller_length"]["discount_total"]["monetary"][$length]);

            if ('setup_fee' in option)
                defaultOptionPrices['setup_fee'] += parseFloat(option['setup_fee'][$length]);
        });

        var baseProductPricePerInt = parseFloat($productPrices['total_per_interval'][$length]) + defaultOptionPrices['total_per_interval'];

        total += parseFloat($productPrices['total'][$length]) + defaultOptionPrices['total'];
        total_per_length += parseFloat($productPrices['total_per_interval'][$length]) + defaultOptionPrices['total_per_interval'];
        discount += parseFloat($productPrices["comparison_length_to_smaller_length"]["discount_total"]["monetary"][$length]) + defaultOptionPrices["discount_total"];

        total = total.toFixed(2);
        total_per_length = total_per_length.toFixed(2);
        discount = discount.toFixed(2);

        if ('setup_fee' in $productPrices) {
            setup += $productPrices['setup_fee'][$length] + defaultOptionPrices['setup_fee'];
        }

        var summary = $('.summary');
        summary.find('.pricing').update_vat('price', [total_per_length], 0);
        summary.find('#final_price').update_vat('price', [total], 0);
        summary.find('#price_discount').update_vat('price', [discount], 0);
        summary.find('#initial_price').update_vat('price', [parseFloat(total) + parseFloat(discount)], 0);

        var setupFee = summary.find('#setupFee');

        if (setupFee.length)
            setupFee.update_vat('price', [setup], 0);
        else
            summary.find('.packet').after('<li id="setupFee"><div>Κόστος εγκατάστασης</div><div class="text-right">' + $.insert_vat('price', setup) + ' €</div></li>');

        if ($('#baseConf').get_price('data-price-length-unit') != baseProductPricePerInt)
            $('#baseConf').update_vat('on-length', [(parseFloat($productPrices['total'][$length]) + defaultOptionPrices['total']), baseProductPricePerInt], 1)
    }

    function durationWasChanged (obj) {
        var container   = obj.closest('ul'),
            lengthBtn   = obj.closest('li');

        container.find('.active').removeClass('active');
        lengthBtn.addClass('active');

        var tmp = obj.clone();
        tmp.find('.right').remove();

        container.closest('li').find('button').text(tmp.text().trim());

        $length = lengthBtn.attr('data-length');

        updateFormPrices();
    }

    function updateFormPrices () {


        $('.summary .packet').update_vat('on-length', [parseFloat($productPrices.total[$length]), parseFloat($productPrices.total_per_interval[$length])], 1);




        form.find('[type="radio"],[type="checkbox"]').each(function () {








            var obj = $(this),
                cont = obj.closest('[data-option-id]'),
                vat = obj.next('label').find('.vat:first');




            if (vat.length) {
                 
                var config;

                if (obj.hasClass('extension-trigger'))
                    config = $allProductPrices[cont.attr('data-option-id')][cont.attr('data-detail-id')]['extensions'][obj.val()];
                else
                    config = $allProductPrices[cont.attr('data-option-id')][obj.val()];

                vat.update_vat('on-length', [config.total[$length], config.total_per_interval[$length]], 1);




                if (obj.checked())
                    obj.trigger('change');
            }
        });
    }

    function findPos (optionId, orderScreenShotTmp) {
        var before = null,
            after = null;

        for (var i in orderScreenShotTmp) {
            if (orderScreenShotTmp.hasOwnProperty(i) && orderScreenShotTmp[i] == optionId) {
                var j = parseInt(i) + 1;

                if (orderScreenShotTmp.hasOwnProperty(j)) {
                    before = orderScreenShotTmp[j];

                    if ($('.specs [data-option-id="' + before + '"]').length < 1) {
                        orderScreenShotTmp = orderScreenShotTmp.removeIndex(j);

                        var pos = findPos(optionId, orderScreenShotTmp);

                        before = pos['before'];
                    }
                } else
                    after = orderScreenShotTmp[(parseInt(i) - 1)];

                break;
            }
        }

        return {'before' : before, 'after' : after};
    }
});