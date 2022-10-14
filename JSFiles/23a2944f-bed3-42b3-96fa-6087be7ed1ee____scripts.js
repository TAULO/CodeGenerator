new WOW().init();

$(document).ready(function () {
    window.proxmatePlugin = new Plugin();
    window.proxmatePlugin.init(function () {
        var download_buttons = $('.call-to-action-button');
        var download_buttons_no_trial = $('.call-to-action-button-no-trial');
        var download_buttons_again = $('.call-to-action-button-again');
        var pricing_buttons = $('.pricing-plan-button');
        var stripe_email = $('.stripe-plan-option');
        if (window.proxmatePlugin.installed_plugin) {
            if (window.proxmatePlugin.subscription_status == 'trial' || window.proxmatePlugin.subscription_status == 'subscription_expired' || window.proxmatePlugin.subscription_status == 'subscription_canceled') {
                stripe_email.each(function () {
                    $(this).attr("data-email", window.proxmatePlugin.registered_email())
                    $(this).attr("data-key", window.proxmatePlugin.plugin_key)
                })
                $('.pricing-plugin-container.cta-wrapper').hide();
                download_buttons.html('Upgrade Now')
                download_buttons.click(function () {
                    window.location.href = '/pricing/'
                });
                $('.paypal-identifier-api-key').val(window.proxmatePlugin.plugin_key)

                var b = moment(new Date());
                var a = moment(new Date(window.proxmatePlugin.status.plan_expiration_date * 1000));
                if (a.diff(b, 'days') > 0) {
                    if (a.diff(b, 'days') > 90) {
                        if (a.diff(b, 'months') < 24) {
                            $('.paypal-remaining-days.amount').val(a.diff(b, 'months'))
                            $('.paypal-remaining-days.period').val("M")
                        }
                        else {
                            $('.paypal-remaining-days.amount').val("24")
                            $('.paypal-remaining-days.period').val("M")
                        }
                    } else {
                        $('.paypal-remaining-days.amount').val(a.diff(b, 'days'))
                    }
                } else {
                    $('.paypal-remaining-days').remove()
                }
                $('.no-credit-card').hide();
            }
            if (window.proxmatePlugin.subscription_status == 'subscribed') {
                $('.pricing-plugin-container.cta-wrapper').hide();
                selectPlan(window.proxmatePlugin.status.plan_status);
                download_buttons.html('Go To Channels');
                download_buttons.click(function () {
                    window.location.href = '/channels/'
                });
                $('.try-out.white').hide();
                $('.no-credit-card').hide();
                $('#price-list .option[data-plan=' + window.proxmatePlugin.status.plan_status + ']').find('.btn-cta').html('Your plan')
            }
            if (!window.proxmatePlugin.plugin_key) {
                $('.pricing-plugin-container.btn-wrapper').css('visibility', 'hidden')
            }
        } else {
            if (
                window.proxmate_version == '4.2.4'
                || window.proxmate_version == '4.2.5'
                || window.proxmate_version == '4.2.6'
                || window.proxmate_version == '4.2.7'
                || window.proxmate_version == '4.2.8'
                || window.proxmate_version == '4.2.9'
                || window.proxmate_version == '4.3.0'
                || window.proxmate_version == '4.3.1'
            ) {
                return;
            }
            download_buttons_no_trial.html('Get Proxmate');
            download_buttons_again.html('Download Proxmate Again');
            download_buttons.html('14 day free trial');
            pricing_buttons.html('14 day free trial');

            download_buttons.click(function () {
                ga('send', 'event', 'button', $(this).attr('data-ga_eventid'));
                window.proxmatePlugin.extension.install({})
            });

            download_buttons_no_trial.click(function () {
                ga('send', 'event', 'button', $(this).attr('data-ga_eventid'));
                window.proxmatePlugin.extension.install({})
            });

            download_buttons_again.click(function () {
                ga('send', 'event', 'button', $(this).attr('data-ga_eventid'));
                window.proxmatePlugin.extension.install({})
            });

            pricing_buttons.click(function () {
                ga('send', 'event', 'button', $(this).attr('data-ga_eventid'));
                window.proxmatePlugin.extension.install({})
            });

            $('a.channel-link').click(function (e) {
                e.preventDefault()
                $('#warning-need_plugin').modal('show')
            })
        }
    });

    $("a[href=#]").click(function (e) {
        e.preventDefault();
    });

    // The nice little arrow that sits at the bottom of a section
    $(".arrow-lower-wrapper .image").click(function () {
        var section = $(this).attr('data-section');
        $('html, body').animate({
            scrollTop: $("." + section).offset().top
        }, 700);
    });

    // Fade the strikethrough line for discounts
    $(window).on('scroll', function (e) {
        checkPriceVisible();
    });

    // tooltip
    $(document).ready(function(){
        $('[data-toggle="tooltip"]').tooltip();
    });

    // Selecting one of the prices
    $("#price-list .option").click(function () {

        if (!window.proxmatePlugin.installed_plugin || window.proxmatePlugin.subscription_status == 'subscribed') {
            return
        }
        var plan = $(this).attr('data-plan');
        // If we're toggling this
        if ($(this).hasClass('selected')) {
            deselectPlan(plan);
            $("#price-list .option").css('opacity', 1);
        } else {
            selectPlan(plan);
            $(".payment-options").show();
        }
    })
    checkPriceVisible();

    // Trigger channel request modal
    $(".btn-channel-request").click(function () {
        $("#channel-request").modal('show');
    });

    $('#stripe-button').on('click', function (e) {
        selectedPlan = $("#price-list .option.selected");
        initStripe({
            name: selectedPlan.attr('data-name'),
            description: selectedPlan.attr('data-description'),
            amount: selectedPlan.attr('data-amount'),
            period: selectedPlan.attr('data-period'),
            plan: selectedPlan.attr('data-plan'),
            email: selectedPlan.attr('data-email'),
            key: selectedPlan.attr('data-key')
        });

        e.preventDefault();
    })

    $('#pay-pal-button').on('click', function (e) {
        selectedPlan = $("#price-list .option.selected");
        $("#paypal-" + selectedPlan.attr('data-plan')).submit();
    })

    // Triggering the transactional modal
    //$("#transactional").modal('show');

    // Pretty-fying the filter by country select
    $("#filterCountry").select2({
        placeholder: "Filter by Country",
        templateResult: formatCountry
    });

    $(".btn.unsubscribe-confirm").click(function () {
        unsubscribe($(this).attr('data-key'))
    });

    $(".btn.cancel-subscription").click(function () {
        $('#unsubscribe-confirm').modal('show')
    });

    // Email signup trigger
    $(".post-install form").submit(function (e) {
        e.preventDefault();
        $(".container.step1").hide();
        $(".container.step2").show();
    })

    function debounce(fn, threshold) {
        var timeout;
        return function debounced() {
            if (timeout) {
                clearTimeout(timeout);
            }
            function delayed() {
                fn();
                timeout = null;
            }

            setTimeout(delayed, threshold || 100);
        };
    }

    var qsRegex;
    var button_filter = '.ALL';
    var active_netflix = false;
    var previous_button_filter = false;

    $grid = $('.channels-container');
    $grid.isotope(
        {
            itemSelector: '.channel-item',
            //layoutMode: 'masonry',
            masonry: {
                columnWidth: 10,
                isFitWidth: true
            },
            filter: function () {
                var $this = $(this);
                var searchResult = qsRegex ? $this.text().match(qsRegex) : true;
                var buttonResult = button_filter ? $this.is(button_filter) : true;
                return searchResult && buttonResult;
            }
        }
    );

    $("#filterCountry").on("change", function (e) {
        if (active_netflix) {
            active_netflix = false;
            var checkbox = $('.btn-netflix');
            checkbox.css("background-color", "#d1433d");
            checkbox.css("color", "#fff");
        }

        if ($("#filterCountry").val() == 'NETFLIX') {
            active_netflix = true;
            var checkbox = $('.btn-netflix');
            checkbox.css("background-color", "#fff");
            checkbox.css("color", "#d1433d");
            if (button_filter) {
                previous_button_filter = button_filter.substring(1);
            }
        }
        else {
            previous_button_filter = null;
        }

        button_filter = '.' + $("#filterCountry").val();

        if (button_filter != '.ALL') {
            qsRegex = null;
            $('#channel-search').val('')
        }

        $grid.isotope()
    });

    // Trigger netflix countries
    var _netflix_button_event = function (e) {
        qsRegex = null;
        $('#channel-search').val('')
        if (previous_button_filter) {
            $("#filterCountry").val(previous_button_filter).trigger("change");
            previous_button_filter = null;
            return;
        }
        previous_button_filter = $("#filterCountry").val();

        $("#filterCountry").val("NETFLIX").trigger("change");
        $grid.isotope()
    };

    $(".form-group.checkbox").click(_netflix_button_event)
    $('#netflix_checkbox_input').click(_netflix_button_event)


    $("#filterCountry").val("ALL").trigger("change");

    $(".generic-feedback-input").click(function () {
        var email = $("input[name='generic-feedback-email']"),
            comment = $("textarea[name='generic-feedback-comment']"),
            message_content = '';
        message_content += 'E-mail Address: \n';
        message_content += email.val();
        message_content += '\n\nComments: \n';
        message_content += comment.val();

        if( !is_valid_email_address(email.val()) )
        {
            email.css('border', '3px solid #BE3A34');
            return;
        } else {
            email.css('border', '1px solid #ddd');
        }

        if( !comment.val() ) {
            comment.css('border', '3px solid #BE3A34');
            return
        } else {
            comment.css('border', '1px solid #ddd');
        }


        $("#feedback_success").modal('show');
        $('.post-install form').hide();

        postFeedback(
            $(this).attr('data-category'),
            message_content,
            email.val(),
            function () {
                $("#feedback_success").modal('show');
                $('.post-install form').hide();
            }
        )
    });

    $('.alert-card').css('visibility', 'visible');
    $(".send-feedback-button").click(function () {
        var message_content = '',
            email = $("input[name='channel-email']"),
            channel_name = $("input[name='channel-name']"),
            channel_url = $("input[name='channel-url']"),
            channel_country = $("input[name='channel-country']"),
            user_country = $("input[name='channel-user-country']"),
            comments = $("textarea[name='channel-comments']");

        if( !is_valid_email_address(email.val()) )
        {
            email.css('border', '3px solid #BE3A34');
            return;
        } else {
            email.css('border', '1px solid #ddd');
        }

        if( !channel_name.val() ) {
            channel_name.css('border', '3px solid #BE3A34');
            return
        } else {
            channel_name.css('border', '1px solid #ddd');
        }

        if( !channel_url.val() ) {
            channel_url.css('border', '3px solid #BE3A34');
            return
        } else {
            channel_url.css('border', '1px solid #ddd');
        }

        if( !channel_country.val() ) {
            channel_country.css('border', '3px solid #BE3A34');
            return
        } else {
            channel_country.css('border', '1px solid #ddd');
        }

        if( !user_country.val() ) {
            user_country.css('border', '3px solid #BE3A34');
            return
        } else {
            user_country.css('border', '1px solid #ddd');
        }


        message_content += 'E-mail Address: \n';
        message_content += email.val();
        message_content += '\n\nName of service or channel: \n';
        message_content += channel_name.val();
        message_content += '\n\nURL of service or channel: \n';
        message_content += channel_url.val();
        message_content += '\n\nWhat country is this service based in: \n';
        message_content += channel_country.val();
        message_content += '\n\nWhat country are you trying to access the service from? \n';
        message_content += user_country.val();
        message_content += '\n\nComments: \n';
        message_content += comments.val();

        $("#channel-request").modal('hide');
        $("#channel-request_success").modal('show');

        postFeedback(
            $(this).attr('data-category'),
            message_content,
            email.val(),
            function () {
                $("#channel-request").modal('hide');
                $("#channel-request_success").modal('show');
                email.val('')
                channel_name.val('')
                channel_url.val('')
                channel_country.val('')
                user_country.val('')
                comments.val('')
            }
        )
    });

    var $quicksearch = $('#channel-search').keyup(debounce(function () {
        $("#filterCountry").val("ALL").trigger("change");
        qsRegex = new RegExp($quicksearch.val(), 'gi');
        $grid.isotope();
    }));

    $grid.on('arrangeComplete', function () {
    })


    //

})

function checkPriceVisible() {
    if ($("#price-list").visible()) {
        $("#price-list .discounted").addClass('strike');
    }
}

function deselectPlan(plan) {
    $("#price-list .option[data-plan=" + plan + "]")
        .removeClass('selected')
        .find('.btn-cta')
        .html('Select Plan');
}

function selectPlan(plan) {
    $("#price-list .option[data-plan=" + plan + "]")
        .addClass('selected')
        .css('opacity', 1)
        .find('.btn-cta')
        .html('Selected');
    $("#price-list .option[data-plan!=" + plan + "]").each(function () {
        $(this).css('opacity', .4);
        var plan = $(this).attr('data-plan');
        deselectPlan(plan);
    })
}

// Makes the select2 options to look better (flags and such)
function formatCountry(country) {
    if (!country.id || country.id == 'ALL' || country.id == 'POPULAR') {
        return country.text;
    }
    var $country = $(
        '<span><img src="/static/img/flags/' + country.id.toLowerCase() + '.png" class="img-flag" /> ' + country.text + '</span>'
    );
    return $country;
}

function Plugin() {
    var _self = this;

    this.init = function (callback) {
        if (window.chrome && chrome.app && chrome.webstore) {
            _self.extension = _self.available_extensions.chrome
        }
        else if (window.opr && window.opr.addons) {
            _self.extension = _self.available_extensions.opera
        }
        else if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
            _self.extension = _self.available_extensions.firefox
        }
        else {
            _self.extension = _self.available_extensions.not_available
        }

        _self.extension.init(callback)
        return true;
    };

    this.extension = {}

    this.installed_plugin = false;

    this.plugin_key = '';

    this.available_extensions = {
        chrome: {
            name: "Chrome",
            plugin_id: "ifalmiidchkjjmkkbkoaibpmoeichmki",
            install: function (args) {
                var _install_check = function () {
                    if ($rootScope.is_plugin_installed) {
                        if (typeof args.on_plugin_installed == 'function') {
                            args.on_plugin_installed()
                        }

                        return;
                    }

                    setTimeout(function () {
                        self.extension.detect_plugin({callback: _install_check()})
                    }, 100)
                };

                chrome.webstore.install(
                    'https://chrome.google.com/webstore/detail/' + this.plugin_id,
                    function () {
                        self.extension.detect_plugin({
                            callback: _install_check
                        });
                    },
                    function (error) {
                        if (typeof args.on_error == 'function') {
                            args.on_error()
                        }
                    }
                );

            },
            detect_plugin: function (args) {
                $.get("chrome-extension://ifalmiidchkjjmkkbkoaibpmoeichmki/manifest.json")
                    .done(function (a, b) {
                        if (b == 'success') {
                            var manifest = JSON.parse(a)
                            window.proxmate_version = manifest.version;
                            if (
                                window.proxmate_version == '4.2.4'
                                || window.proxmate_version == '4.2.5'
                                || window.proxmate_version == '4.2.6'
                                || window.proxmate_version == '4.2.7'
                                || window.proxmate_version == '4.2.8'
                                || window.proxmate_version == '4.2.9'
                                || window.proxmate_version == '4.3.0'
                                || window.proxmate_version == '4.3.1'
                            ) {
                                args.callback(false)
                                return;
                            }
                            args.callback(true)
                        }
                        else {
                            args.callback(false)
                        }
                    })
                    .fail(function () {
                        args.callback(false)
                    });
                //chrome.runtime.sendMessage(_self.extension.plugin_id, {action: "checkInstall"}, {}, function (response) {
                //    args.callback(response ? true : false)
                //});
            },
            select_netflix: function (args) {
                chrome.runtime.sendMessage(_self.extension.plugin_id, {
                    action: "selectNetflix",
                    params: {country: args.country}
                }, {}, function (response) {
                    args.callback(response ? true : false)
                });
            },
            activate_plugin: function (callback) {
                _self.extension.detect_plugin({
                    callback: function (is_installed) {
                        if (!is_installed) {
                            return callback({
                                success: false,
                                error: "no_plugin"
                            })
                        }

                        chrome.runtime.sendMessage(_self.extension.plugin_id, {
                            action: "activatePlugin",
                            params: {
                                activation_code: '{{ key }}'
                            }
                        }, {}, function (response) {
                            return callback(response)
                        })
                    }
                });
            },
            get_key: function (callback) {
                chrome.runtime.sendMessage(_self.extension.plugin_id, {
                    action: "getApiKey",
                }, {}, function (response) {
                    return callback(response)
                })
            },
            get_status: function (callback) {
                chrome.runtime.sendMessage(_self.extension.plugin_id, {
                    action: "getStatus",
                }, {}, function (response) {
                    return callback(response)
                })
            },
            request_status: function (callback) {
                chrome.runtime.sendMessage(_self.extension.plugin_id, {
                    action: "updateStatus",
                }, {}, function (response) {
                    return callback(response)
                })
            },
            registered_email: function () {
                return _self.status.email;
            },
            init: function (callback) {
                _self.extension.detect_plugin({
                    callback: function (data) {
                        _self.installed_plugin = data;
                        if (data) {
                            _self.extension.get_key(function (data) {
                                _self.plugin_key = data;
                                _self.extension.get_status(function (data) {
                                    if (!data) {
                                        callback();
                                        return
                                    }
                                    _self.status = data.data;
                                    _self.subscription_status = data.data.subscription_status;
                                    callback()
                                })
                            })
                        }
                        else {
                            callback()
                        }
                    }
                });
            }
        },
        firefox: {
            name: "Firefox",
            install: function (args) {
                var _self = this;
                // TODO reactivate ga('send', 'event', 'button', 'install', 'install_start');
                InstallTrigger.install(
                    {
                        "Foo": {
                            URL: "https://addons.mozilla.org/firefox/downloads/latest/360079/addon-360079-latest.xpi",
                            IconURL: "https://s3.amazonaws.com/cdn.zapyo.com/images/favicon.png",
                            //Hash: e.target.getAttribute("hash"),
                            toString: function () {
                                return this.URL;
                            }
                        }
                    });

            },
            select_netflix: function (args) {

            },
            init_listeners: function () {
                var self = this;
                window.addEventListener("proxmate-addon-message", function (e) {
                    if (typeof  self.cbs[e.detail.eid] == 'function') {
                        self.cbs[e.detail.eid](e.detail)
                        delete self.cbs[e.detail.eid]
                    }
                });
            },
            cbs: {},
            sendMessage: function (cmd, data, callback) {
                var self = this;
                data.c = cmd;
                data.eid = cmd + '-' + (new Date).getTime() + Math.random().toString(36).substring(7);
                var event = new CustomEvent('proxmate-page-message', {'detail': data});
                window.dispatchEvent(event);
                self.cbs[data.eid] = callback
            },
            detect_plugin: function (callback) {
                if (!window._pluginID) {
                    return callback({is_installed: false})
                }
                _self.extension.sendMessage('checkInstall', {}, function (response) {
                    callback(response)
                });
            },
            activate_plugin: function (callback) {
                _self.extension.detect_plugin(function (data) {
                    if (!data.is_installed) {
                        return callback({
                            success: false,
                            error: "no_plugin"
                        })
                    }

                    _self.extension.sendMessage('activatePlugin', {activation_code: '{{ key }}'}, function (response) {
                        return callback(response)
                    });
                });
            },
            get_key: function (callback) {
                _self.extension.sendMessage('getApiKey', {}, function (response) {
                    callback(response)
                });
            },
            get_status: function (callback) {
                _self.extension.sendMessage('getStatus', {}, function (response) {
                    return callback(response)
                });
            },
            request_status: function (callback) {
                _self.extension.sendMessage('updateStatus', {}, function (response) {
                    return callback(response)
                });
            },
            registered_email: function () {
                return _self.status.email;
            },
            init: function (callback) {
                _self.extension.init_listeners()
                _self.extension.detect_plugin(function (result) {
                    _self.installed_plugin = result.is_installed;
                    if (result.is_installed) {
                        _self.extension.get_key(function (data) {
                            _self.plugin_key = data.key;
                            _self.extension.get_status(function (data) {
                                if (!data.status) {
                                    callback();
                                    return
                                }
                                _self.status = data.status.data;
                                _self.subscription_status = data.status.data.subscription_status;
                                callback()
                            })
                        })
                    }
                    else {
                        callback()
                    }
                })
            }
        },
        opera: {
            name: "Opera",
            plugin_id: "bembolboiohddlgpjeahldiipjemjneh",
            install: function (args) {
                var _install_check = function () {
                    if ($rootScope.is_plugin_installed) {
                        if (typeof args.on_plugin_installed == 'function') {
                            args.on_plugin_installed()
                        }

                        return;
                    }

                    setTimeout(function () {
                        self.extension.detect_plugin({callback: _install_check()})
                    }, 100)
                };
                opr.addons.installExtension(
                    _self.extension.plugin_id,
                    function () {
                        self.extension.detect_plugin({
                            callback: _install_check
                        });
                    },
                    function (errorMessage) {
                        if (typeof args.on_error == 'function') {
                            args.on_error()
                        }
                    }
                );

            },
            detect_plugin: function (args) {
                $.get("chrome-extension://bembolboiohddlgpjeahldiipjemjneh/manifest.json")
                    .done(function (a, b) {
                        if (b == 'success') {
                            var manifest = JSON.parse(a)
                            window.proxmate_version = manifest.version;
                            if (
                                window.proxmate_version == '4.2.4'
                                || window.proxmate_version == '4.2.5'
                                || window.proxmate_version == '4.2.6'
                                || window.proxmate_version == '4.2.7'
                                || window.proxmate_version == '4.2.8'
                                || window.proxmate_version == '4.2.9'
                                || window.proxmate_version == '4.3.0'
                                || window.proxmate_version == '4.3.1'
                            ) {
                                args.callback(false)
                                return;
                            }
                            args.callback(true)
                        }
                        else {
                            args.callback(false)
                        }
                    })
                    .fail(function () {
                        args.callback(false)
                    });
                //chrome.runtime.sendMessage(_self.extension.plugin_id, {action: "checkInstall"}, {}, function (response) {
                //    args.callback(response ? true : false)
                //});
            },
            select_netflix: function (args) {
                chrome.runtime.sendMessage(_self.extension.plugin_id, {
                    action: "selectNetflix",
                    params: {country: args.country}
                }, {}, function (response) {
                    args.callback(response ? true : false)
                });
            },
            activate_plugin: function (callback) {
                _self.extension.detect_plugin({
                    callback: function (is_installed) {
                        if (!is_installed) {
                            return callback({
                                success: false,
                                error: "no_plugin"
                            })
                        }

                        chrome.runtime.sendMessage(_self.extension.plugin_id, {
                            action: "activatePlugin",
                            params: {
                                activation_code: '{{ key }}'
                            }
                        }, {}, function (response) {
                            return callback(response)
                        })
                    }
                });
            },
            get_key: function (callback) {
                chrome.runtime.sendMessage(_self.extension.plugin_id, {
                    action: "getApiKey",
                }, {}, function (response) {
                    return callback(response)
                })
            },
            get_status: function (callback) {
                chrome.runtime.sendMessage(_self.extension.plugin_id, {
                    action: "getStatus",
                }, {}, function (response) {
                    return callback(response)
                })
            },
            request_status: function (callback) {
                chrome.runtime.sendMessage(_self.extension.plugin_id, {
                    action: "updateStatus",
                }, {}, function (response) {
                    return callback(response)
                })
            },
            registered_email: function () {
                return _self.status.email;
            },
            init: function (callback) {
                _self.extension.detect_plugin({
                    callback: function (data) {
                        _self.installed_plugin = data;
                        if (data) {
                            _self.extension.get_key(function (data) {
                                _self.plugin_key = data;
                                _self.extension.get_status(function (data) {
                                    if (!data) {
                                        callback();
                                        return
                                    }
                                    _self.status = data.data;
                                    _self.subscription_status = data.data.subscription_status;
                                    callback()
                                })
                            })
                        }
                        else {
                            callback()
                        }
                    }
                });
            }
        },
        not_available: {
            install: function (args) {
                $('#warning-need_change_browser').modal('show');
            },
            select_netflix: function (args) {

            },
            detect_plugin: function () {

            },
            activate_plugin: function (callback) {
                return callback({
                    success: false,
                    error: 'bad_browser',
                    alt: '{{ browser }}'
                })
            },
            init: function (callback) {
                callback()
            }
        }
    };

    /**
     * Starts the app. Retrieves servers and sets pac
     */

    this.start = function () {
        return true;
    };

}

/**
 *  Stripe integration
 **/

function initPayPal(data) {
    $.ajax({
        url: '/paypal/',
        type: 'POST',
        data: {
            plan: JSON.stringify(data),
            key: window.proxmatePlugin.plugin_key
        },
        success: function (data) {
            window.location.href = 'https://www.sandbox.paypal.com/webscr&cmd=_express-checkout&token=' + data;
        },
        error: function (data) {
            console.log("Ajax Error!");
        }
    });
}


/**
 *  Stripe integration
 **/

function unsubscribe(api_key) {
    $.ajax({
        url: '/api/unsubscribe/' + api_key + '/',
        type: 'POST',
        success: function (data) {
            if (!data.success) {
            }
            else {
                $('#unsubscribe-confirm').modal('hide')
                $(".container.step1").hide();
                $(".container.step2").show();
                window.proxmatePlugin.extension.request_status()
            }
        },
        error: function (data) {

        }
    });
}


function initStripe(data) {
    var handler = StripeCheckout.configure({
        key: window.STRIPE_PUBLISHABLE_KEY,
        image: '/static/img/proxmate_200_stripe.png',
        locale: 'auto',
        email: data.email,
        token: function (token) {
            data.email,
                $.ajax({
                    url: '/stripe/',
                    type: 'POST',
                    data: {
                        token: JSON.stringify(token),
                        plan: data.plan,
                        key: data.key
                    },
                    success: function (data) {
                        if (!data.success) {
                            if (data.error == "declined_card") {
                                $("#payment-error").modal('show');
                                window.proxmatePlugin.extension.request_status()
                            }
                        }
                        else {
                            $(document).ready(function () {
                                window.proxmatePlugin.extension.request_status()
                                window.location.href = '/channels/?payment=success';
                            });
                            console.log("Success");
                        }

                    },
                    error: function (data) {
                        console.log("Ajax Error!");
                    }
                }); // end ajax call
        }
    });

    handler.open({
        name: data.name,
        description: data.description,
        amount: data.amount,
        panelLabel: "{{amount}} " + data.period
    });


    // Close Checkout on page navigation
    $(window).on('popstate', function () {
        handler.close();
    });

}

function changeNetflix(country) {
    window.proxmatePlugin.extension.select_netflix({
        country: country,
        callback: function () {
        }
    })
}

function postFeedback(cat, msg, email, callback) {
    $.ajax({
        url: '/api/feedback/',
        type: 'POST',
        data: {
            email: email,
            category: cat,
            message: msg
        },
        success: function (data) {
            if (!data.success) {

            }
            else {
                callback()
                console.log("Success");
            }

        },
        error: function (data) {
            console.log("Ajax Error!");
        }
    }); // end ajax call
}

function is_valid_email_address(emailAddress) {
    var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    return pattern.test(emailAddress);
}

function initChangeCard(key, callback) {
    var handler = StripeCheckout.configure({
        key: window.STRIPE_PUBLISHABLE_KEY,
        image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
        locale: 'auto',
        email: window.proxmatePlugin.extension.registered_email(),
        token: function (token) {
            window.proxmatePlugin.extension.registered_email(),
                $.ajax({
                    url: '/api/stripe/card/' + key + '/',
                    type: 'POST',
                    data: {
                        token: JSON.stringify(token),
                        key: window.proxmatePlugin.plugin_key
                    },
                    success: function (data) {
                        if (!data.success) {

                        }
                        else {
                            callback()
                            console.log("Success");
                        }

                    },
                    error: function (data) {
                        console.log("Ajax Error!");
                    }
                }); // end ajax call
        }
    });

    handler.open({
        panelLabel: "Change Details"
    });


    // Close Checkout on page navigation
    $(window).on('popstate', function () {
        handler.close();
    });

}


