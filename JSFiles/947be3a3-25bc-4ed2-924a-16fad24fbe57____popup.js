var errorsInLogin = 0;
var errorsInRecording = 0;
var attempts = 0;

checkTheCookie();


document.addEventListener('DOMContentLoaded', function() {
  try {
    var link = document.getElementById('startFromHereRadio');
    // onClick's logic below:
    link.addEventListener('click', function() {
      document.getElementById("urlInput").style.display = "none";
      $("body").css("min-height", "150px");
      $("body").css("height", "150px");
      $("html").css("height", "150px");
      document.getElementById("errorForUrlInput").innerHTML = "";
    });
  } catch (err) {
    // do nada;
  }
  try {
    var link = document.getElementById('startFromUrlRadio');
    // onClick's logic below:
    link.addEventListener('click', function() {
      document.getElementById("urlInput").style.display = "block";
      $("body").css("min-height", "220px");
      $("body").css("height", "220px");
      $("html").css("height", "220px");
      document.getElementById("errorForUrlInput").innerHTML = "";
    });
  } catch (err) {
    // do nada;
  }

  try {
    var link = document.getElementById('settings_icon');
    // onClick's logic below:
    link.addEventListener('click', function() {
      showSettings();
      hideLogin();
      hideStartRecorder();
      hideStoppedRecorder();
      hideCurrentlyRecording();
      $("body").css("min-height", "220px");
      $("body").css("height", "220px");
      $("html").css("height", "220px");
    });
  } catch (err) {
    // do nada;
  }

  try {
    var link = document.getElementById('done_button');
    // onClick's logic below:
    link.addEventListener('click', function() {
      hideSettings();
      checkTheCookie();
      deliverValuesFromSettings();
    });
  } catch (err) {
    // do nada;
  }


  try {
    var recordScrollEventsCheckbox = document.getElementById('recordScrollEventsCheckbox');
    // onClick's logic below:
    recordScrollEventsCheckbox.addEventListener('click', function() {
      if (document.getElementById("recordScrollEventsCheckbox").checked == false) {
        chrome.storage.local.set({
          'endtest_record_scroll_events': '0'
        }, function() {});
      }
      if (document.getElementById("recordScrollEventsCheckbox").checked == true) {
        chrome.storage.local.set({
          'endtest_record_scroll_events': '1'
        }, function() {});
      }

    });
  } catch (err) {
    // do nada;
  }


  try {
    var pauseButton = document.getElementById('pauseRecordingButton');

    chrome.storage.local.get(['endtest_extension_currently_recording'], function(the_data) {
      if (the_data.endtest_extension_currently_recording == "1") {
        pauseRecordingButton.classList.remove("paused_button");
      }
      if (the_data.endtest_extension_currently_recording == "3") {

        pauseRecordingButton.classList.add("paused_button");
      }
    });
  } catch (err) {
    // do nada;
  }


  try {
    var recordHoverEventsCheckbox = document.getElementById('recordHoverEventsCheckbox');
    // onClick's logic below:
    recordHoverEventsCheckbox.addEventListener('click', function() {
      if (document.getElementById("recordHoverEventsCheckbox").checked == false) {
        chrome.storage.local.set({
          'endtest_record_hover_events': '0'
        }, function() {});
      }
      if (document.getElementById("recordHoverEventsCheckbox").checked == true) {
        chrome.storage.local.set({
          'endtest_record_hover_events': '1'
        }, function() {});
      }

    });
  } catch (err) {
    // do nada;
  }


  try {
    var doNotUseIdAttribute = document.getElementById('doNotUseIdAttribute');
    // onClick's logic below:
    doNotUseIdAttribute.addEventListener('click', function() {
      if (document.getElementById("doNotUseIdAttribute").checked == false) {
        chrome.storage.local.set({
          'endtest_do_not_use_id_attribute': '0'
        }, function() {});
      }
      if (document.getElementById("doNotUseIdAttribute").checked == true) {
        chrome.storage.local.set({
          'endtest_do_not_use_id_attribute': '1'
        }, function() {});
      }

    });
  } catch (err) {
    // do nada;
  }

  try {
    var doNotUseNameAttribute = document.getElementById('doNotUseNameAttribute');
    // onClick's logic below:
    doNotUseNameAttribute.addEventListener('click', function() {
      if (document.getElementById("doNotUseNameAttribute").checked == false) {
        chrome.storage.local.set({
          'endtest_do_not_use_name_attribute': '0'
        }, function() {});
      }
      if (document.getElementById("doNotUseNameAttribute").checked == true) {
        chrome.storage.local.set({
          'endtest_do_not_use_name_attribute': '1'
        }, function() {});
      }

    });
  } catch (err) {
    // do nada;
  }

  try {
    var doNotUseUrlQueryStrings = document.getElementById('doNotUseUrlQueryStrings');
    // onClick's logic below:
    doNotUseUrlQueryStrings.addEventListener('click', function() {
      if (document.getElementById("doNotUseUrlQueryStrings").checked == false) {
        chrome.storage.local.set({
          'endtest_do_not_use_url_query_strings': '0'
        }, function() {});
      }
      if (document.getElementById("doNotUseUrlQueryStrings").checked == true) {
        chrome.storage.local.set({
          'endtest_do_not_use_url_query_strings': '1'
        }, function() {});
      }

    });
  } catch (err) {
    // do nada;
  }


  try {
    var ignoreClasses = document.getElementById('blacklist_classes');
    // onClick's logic below:
    ignoreClasses.addEventListener('change', function() {
      classes_to_ignore_list = "ng-, active, checked, selected, focused ,correct, disable, enable, highlight, over, hvr, cursor, show, focus, pressed, pushed, touch, dirty, pristine, require, select, valid, open, hidden, hide, desktop, mobile, tablet, grid, col-, row-";
      if (document.getElementById("blacklist_classes").value && document.getElementById("blacklist_classes").value != '') {
        classes_to_ignore_new = document.getElementById("blacklist_classes").value;
        chrome.storage.local.set({
          'endtest_ignore_classes': classes_to_ignore_new
        }, function() {});
      } else {
        chrome.storage.local.set({
          'endtest_ignore_classes': classes_to_ignore_list
        }, function() {});
      }

    });
  } catch (err) {
    // do nada;
  }


  try {
    var customDataAttributes = document.getElementById('custom_data_attributes');
    // onClick's logic below:

    customDataAttributes.addEventListener('change', function() {
      custom_data_attributes_list = "data-test, data-testing, data-qa, data-testid, data-test-id";
      if (document.getElementById("custom_data_attributes").value && document.getElementById("custom_data_attributes").value != '') {
        custom_data_attributes_list_new = document.getElementById("custom_data_attributes").value;
        chrome.storage.local.set({
          'endtest_custom_data_attributes': custom_data_attributes_list_new
        }, function() {});
      } else {
        chrome.storage.local.set({
          'endtest_custom_data_attributes': custom_data_attributes_list
        }, function() {});
      }

    });
  } catch (err) {
    // do nada;
  }



});




function isValidEmailAddress(emailAddress) {
  var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
  return pattern.test(emailAddress);
}

function trimSpaces(that) {
  $(that).val($(that).val().replace(/^\s\s*/, '').replace(/\s\s*$/, ''));
}

function addValidationFront(idOfInput, idOfErrorDiv, validationMessage) {
  $("#" + idOfInput).css("border", "1px solid red");
  $("#" + idOfErrorDiv).html(validationMessage);
  $("#" + idOfInput).on('input', function(e) {
    var value = $("#" + idOfInput).val();
    if (value.length > 0) {
      $("#" + idOfInput).css({
        'border-color': 'black'
      });
      $("#" + idOfErrorDiv).html('');
    }
  });
  $("#" + idOfInput).blur(
    function() {
      var value = $("#" + idOfInput).val();
      if (value.length == 0) {
        $("#" + idOfInput).css({
          'border': '1px solid red'
        });
        $("#" + idOfErrorDiv).html(validationMessage);
      }
    });
}

function doNothing() {
  console.log('went to doNothing()');
}

function submitLogin() {
  document.getElementById('userEmailLoginInput').style.borderColor = "red";
}

function deliverValuesFromSettings() {
  try {
    chrome.storage.local.get(['endtest_do_not_use_id_attribute', 'endtest_do_not_use_name_attribute', 'endtest_do_not_use_url_query_strings', 'endtest_record_hover_events', 'endtest_record_scroll_events', 'endtest_ignore_classes', 'endtest_custom_data_attributes'], function(all_settings_values) {
      if (all_settings_values) {
        to_not_use_id_attribute = all_settings_values.endtest_do_not_use_id_attribute;
        to_not_use_name_attribute = all_settings_values.endtest_do_not_use_name_attribute;
        to_not_use_url_query_strings = all_settings_values.endtest_do_not_use_url_query_strings;
        to_record_hover = all_settings_values.endtest_record_hover_events;
        to_record_scroll = all_settings_values.endtest_record_scroll_events;
        classes_to_ignore = all_settings_values.endtest_ignore_classes;
        custom_data_attributes_to_use = all_settings_values.endtest_custom_data_attributes;


        var all_the_settings = {
          to_not_use_id_attribute: all_settings_values.endtest_do_not_use_id_attribute,
          to_not_use_name_attribute: all_settings_values.endtest_do_not_use_name_attribute,
          to_not_use_url_query_strings: all_settings_values.endtest_do_not_use_url_query_strings,
          to_record_hover: all_settings_values.endtest_record_hover_events,
          to_record_scroll: all_settings_values.endtest_record_scroll_events,
          classes_to_ignore: all_settings_values.endtest_ignore_classes,
          custom_data_attributes_to_use: all_settings_values.endtest_custom_data_attributes
        };

        chrome.tabs.query({
          currentWindow: true,
          active: true
        }, function(tabs) {
          activeTab = tabs[0];
          chrome.tabs.sendMessage(activeTab.id, {
            "message": "done",
            "all_the_settings": all_the_settings
          });
        });

      }
    });
  } catch (err) {
    the_error = err;
  }
}

function checkTheCookie() {
  try {
    chrome.cookies.get({
      "url": 'https://app.endtest.io',
      "name": 'ceva_orbtset'
    }, function(cookie) {
      if (cookie) {
        that_cookie = cookie.value;
        //chrome.cookies.get({"url": 'https://endtest.io', "name": 'endtest_extension_currently_recording'}, function(the_cookie) {
        chrome.storage.local.get(['endtest_extension_currently_recording'], function(the_cookie) {
          if (the_cookie.endtest_extension_currently_recording) {
            the_recording_cookie = the_cookie.endtest_extension_currently_recording;
            if (the_recording_cookie == 1 || the_recording_cookie == 3 || the_recording_cookie == 4) {
              hideLogin();
              hideStartRecorder();
              showCurrentlyRecording();

              //chrome.cookies.get({"url": 'https://endtest.io', "name": 'endtest_extension_recorded_steps'}, function(the_cookie_with_steps) {
              chrome.storage.local.get(['endtest_extension_recorded_steps'], function(the_cookie_with_steps) {

                if (the_cookie_with_steps) {
                  //the_steps_from_the_cookie=the_cookie_with_steps.value;
                  the_steps_from_the_cookie = the_cookie_with_steps.endtest_extension_recorded_steps;
                  if (the_steps_from_the_cookie) {

                    the_json_with_steps_from_the_cookie = JSON.parse(the_steps_from_the_cookie);

                    var myNode = document.getElementById("containerForRecordedSteps");
                    while (myNode.firstChild) {
                      myNode.removeChild(myNode.firstChild);
                    }
                    for (key in the_json_with_steps_from_the_cookie) {
                      the_action = the_json_with_steps_from_the_cookie[key]['Action'];
                      the_param_1 = the_json_with_steps_from_the_cookie[key]['param1'];
                      the_param_2 = the_json_with_steps_from_the_cookie[key]['param2'];
                      the_param_3 = the_json_with_steps_from_the_cookie[key]['param3'];
                      the_label = the_json_with_steps_from_the_cookie[key]['label'];

                      if (the_action == 'Go to URL') {
                        $("#containerForRecordedSteps").append('<li>' +
                          '<b>Step Name:</b> ' + "Go to URL" + '</br>' +
                          '<b>Action:</b> ' + the_action + '</br>' +
                          '<b>Full URL:</b> ' + the_param_1 + '</br>' +
                          '</li>');
                      }
                      if (the_action == 'Refresh Page') {
                        $("#containerForRecordedSteps").append('<li>' +
                          '<b>Step Name:</b> ' + "Refresh Page" + '</br>' +
                          '<b>Action:</b> ' + the_action + '</br>' +
                          '</li>');
                      }
                      if (the_action == 'Click') {
                        $("#containerForRecordedSteps").append('<li>' +

                          '<b>Step Name:</b> ' + "Click on " + the_label + '</br>' +
                          '<b>Action:</b> ' + the_action + '</br>' +
                          '<b>Locate By:</b> ' + the_param_1 + '</br>' +
                          '<b>' + the_param_1 + ':</b> ' + the_param_2 + '</br>' +
                          '</li>');
                      }
                      if (the_action == 'Right Click') {
                        $("#containerForRecordedSteps").append('<li>' +
                          '<b>Step Name:</b> ' + "Right Click on " + the_label + '</br>' +
                          '<b>Action:</b> ' + the_action + '</br>' +
                          '<b>Locate By:</b> ' + the_param_1 + '</br>' +
                          '<b>' + the_param_1 + ':</b> ' + the_param_2 + '</br>' +
                          '</li>');
                      }
                      if (the_action == 'Hover') {
                        $("#containerForRecordedSteps").append('<li>' +
                          '<b>Step Name:</b> ' + "Hover on " + the_label + '</br>' +
                          '<b>Action:</b> ' + the_action + '</br>' +
                          '<b>Locate By:</b> ' + the_param_1 + '</br>' +
                          '<b>' + the_param_1 + ':</b> ' + the_param_2 + '</br>' +
                          '</li>');
                      }
                      if (the_action == 'Write Text') {
                        $("#containerForRecordedSteps").append('<li>' +
                          '<b>Step Name:</b> ' + "Write text in " + the_label + '</br>' +
                          '<b>Action:</b> ' + the_action + '</br>' +
                          '<b>Locate By:</b> ' + the_param_1 + '</br>' +
                          '<b>' + the_param_1 + ':</b> ' + the_param_2 + '</br>' +
                          '<b>' + 'Text to write:' + '</b> ' + the_param_3 + '</br>' +
                          '</li>');
                      }

                      if (the_action == 'Add Assertion') {
                        $("#containerForRecordedSteps").append('<li>' +
                          '<b>Step Name:</b> ' + "Add Assertion for " + the_label + '</br>' +
                          '<b>Action:</b> ' + the_action + '</br>' +
                          '<b>Assertion Type:</b> ' + "Element is present" + '</br>' +
                          '<b>Locate By:</b> ' + the_param_1 + '</br>' +
                          '<b>' + the_param_1 + ':</b> ' + the_param_2 + '</br>' +
                          '</li>');
                      }

                      if (the_action == 'Select Option') {
                        $("#containerForRecordedSteps").append('<li>' +
                          '<b>Step Name:</b> ' + "Select Option from " + the_label + '</br>' +
                          '<b>Action:</b> ' + the_action + '</br>' +
                          '<b>Locate By:</b> ' + the_param_1 + '</br>' +
                          '<b>' + the_param_1 + ':</b> ' + the_param_2 + '</br>' +
                          '<b>' + 'Option to pick:' + '</b> ' + the_param_3 + '</br>' +
                          '</li>');
                      }

                      if (the_action == 'Upload File') {
                        $("#containerForRecordedSteps").append('<li>' +
                          '<b>Step Name:</b> ' + "Upload File " + '</br>' +
                          '<b>Action:</b> ' + the_action + '</br>' +
                          '<b>Locate By:</b> ' + the_param_1 + '</br>' +
                          '<b>' + the_param_1 + ':</b> ' + the_param_2 + '</br>' +
                          '</li>');
                      }

                      if (the_action == 'Open new tab') {
                        $("#containerForRecordedSteps").append('<li>' +
                          '<b>Step Name:</b> ' + "Open new tab" + '</br>' +
                          '<b>Action:</b> ' + the_action +
                          '</li>');
                      }

                      if (the_action == 'Take Screenshot') {
                        $("#containerForRecordedSteps").append('<li>' +
                          '<b>Step Name:</b> ' + "Take Screenshot" + '</br>' +
                          '<b>Action:</b> ' + the_action +
                          '</li>');
                      }


                      if (the_action == 'Switch to next tab') {
                        $("#containerForRecordedSteps").append('<li>' +
                          '<b>Step Name:</b> ' + "Switch to next tab" + '</br>' +
                          '<b>Action:</b> ' + the_action +
                          '</li>');
                      }

                      if (the_action == 'Switch to previous tab') {
                        $("#containerForRecordedSteps").append('<li>' +
                          '<b>Step Name:</b> ' + "Switch to previous tab" + '</br>' +
                          '<b>Action:</b> ' + the_action +
                          '</li>');
                      }

                      if (the_action == 'Close tab') {
                        $("#containerForRecordedSteps").append('<li>' +
                          '<b>Step Name:</b> ' + "Close tab" + '</br>' +
                          '<b>Action:</b> ' + the_action +
                          '</li>');
                      }

                      if (the_action == 'Switch back to main') {
                        $("#containerForRecordedSteps").append('<li>' +
                          '<b>Step Name:</b> ' + "Switch back to main" + '</br>' +
                          '<b>Action:</b> ' + the_action +
                          '</li>');
                      }

                      if (the_action == 'Scroll') {
                        $("#containerForRecordedSteps").append('<li>' +
                          '<b>Step Name:</b> ' + the_param_1 + '</br>' +
                          '<b>Action:</b> ' + the_action + '</br>' +
                          '<b>Scroll Type:</b> ' + the_param_1 + '</br>' +
                          '<b>' + 'Scroll Distance' + ':</b> ' + the_param_2 + 'px</br>' +
                          '</li>');
                      }

                      if (the_action == 'Switch to iframe') {
                        $("#containerForRecordedSteps").append('<li>' +
                          '<b>Step Name:</b> ' + "Switch to iframe " + the_label + '</br>' +
                          '<b>Action:</b> ' + the_action + '</br>' +
                          '<b>Locate By:</b> ' + the_param_1 + '</br>' +
                          '<b>' + the_param_1 + ':</b> ' + the_param_2 + '</br>' +
                          '</li>');
                      }

                      if (the_action == 'Press Key') {
                        $("#containerForRecordedSteps").append('<li>' +
                          '<b>Step Name:</b> ' + "Press Key " + the_param_3 + '</br>' +
                          '<b>Action:</b> ' + the_action + '</br>' +
                          '<b>Locate By:</b> ' + the_param_1 + '</br>' +
                          '<b>' + the_param_1 + ':</b> ' + the_param_2 + '</br>' +
                          '<b>' + 'Key to press:' + '</b> ' + the_param_3 + '</br>' +
                          '</li>');
                      }



                      //console.log(obj.id);
                    }
                  }

                }
              });

              //PANA AICI BOSS

            }
            if (the_recording_cookie == 0) {
              hideLogin();
              showStartRecorder();

              chrome.storage.local.get(['last_tested_url'], function(the_stored_url) {
                if (the_stored_url.last_tested_url) {
                  document.getElementById("urlInput").value = the_stored_url.last_tested_url;

                }
              });


            }
            if (the_recording_cookie == 2) {
              hideLogin();
              hideStartRecorder();
              hideCurrentlyRecording();
              showStoppedRecorder();
            }
          } else {
            hideLogin();
            showStartRecorder();
          }
        });
      } else {
        hideStartRecorder();
        hideCurrentlyRecording();
        hideStoppedRecorder();
        showLogin();
      }
    });

    $("#containerForRecordedSteps").scrollTop($("#containerForRecordedSteps")[0].scrollHeight);
  } catch (err) {
    var the_error = err;
  }
}

function showLogin() {
  try {
    $("#containerForLogin").css("display", "block");
    $('.loginInput').keydown(function(event) {
      if (event.keyCode == 13) {
        $("#loginButton").click();
        return false;
      }
    });
  } catch (err) {
    // do nothing;
  }
}

function hideLogin() {
  //$("#containerForLogin").css("display", "none");
  document.getElementById("containerForLogin").style.display = "none";
}

function showStartRecorder() {
  //$("#containerForStartRecording").css("display", "block");
  document.getElementById("containerForStartRecording").style.display = "block";
  document.getElementsByTagName("body")[0].style.minHeight = "220px";
  document.getElementsByTagName("body")[0].style.height = "220px";
  document.getElementsByTagName("html")[0].style.height = "220px";
  /*
  $("body").css("min-height","200px");
  $("body").css("height","200px");
  $("html").css("height","200px");
  */

}

function hideStartRecorder() {
  //$("#containerForStartRecording").css("display", "none");
  try {
    document.getElementById("containerForStartRecording").style.display = "none";
  } catch (err) {
    // do nothing
  }
}

function takeScreenshot() {
  try {
    chrome.runtime.sendMessage({
      "message": "take_screenshot"
    });
    $("#containerForRecordedSteps").append('<li>' +
      '<b>Step Name:</b> ' + "Take Screenshot" + '</br>' +
      '<b>Action:</b> ' + "Take Screenshot" +
      '</li>');
    $("#containerForRecordedSteps").scrollTop($("#containerForRecordedSteps")[0].scrollHeight);
  } catch (err) {

  }
}

function addAssertion() {
  try {
    chrome.storage.local.set({
      'endtest_extension_currently_recording': '4'
    }, function() {});
    document.getElementById("messageContainerForPause").innerHTML = "Click on an element to add an assertion.";
  } catch (err) {
    the_error = err;
  }
}

function showSettings() {
  document.getElementById("container_for_settings").style.display = "block";
  document.getElementById("settings_icon").style.display = "none";
  $("body").css("min-height", "280px");

  chrome.storage.local.get(['endtest_record_scroll_events'], function(record_scroll_event) {

    if (record_scroll_event) {
      to_record_scroll_event = record_scroll_event.endtest_record_scroll_events;
      if (to_record_scroll_event) {
        if (to_record_scroll_event == "1") {
          document.getElementById("recordScrollEventsCheckbox").checked = true;
        }
        if (to_record_scroll_event == "0") {
          document.getElementById("recordScrollEventsCheckbox").checked = false;
        }
      }
    } else {
      document.getElementById("recordScrollEventsCheckbox").checked = true;
    }

  });


  chrome.storage.local.get(['endtest_record_hover_events'], function(record_hover_event) {

    if (record_hover_event) {
      to_record_hover_event = record_hover_event.endtest_record_hover_events;
      if (to_record_hover_event) {
        if (to_record_hover_event == "1") {
          document.getElementById("recordHoverEventsCheckbox").checked = true;
        }
        if (to_record_hover_event == "0") {
          document.getElementById("recordHoverEventsCheckbox").checked = false;
        }
      }
    } else {
      document.getElementById("recordHoverEventsCheckbox").checked = false;
    }

  });


  chrome.storage.local.get(['endtest_do_not_use_id_attribute'], function(do_not_use_id_attribute) {
    if (do_not_use_id_attribute) {
      to_not_use_id_attribute = do_not_use_id_attribute.endtest_do_not_use_id_attribute;
      if (to_not_use_id_attribute) {
        if (to_not_use_id_attribute == "1") {
          document.getElementById("doNotUseIdAttribute").checked = true;
        }
        if (to_not_use_id_attribute == "0") {
          document.getElementById("doNotUseIdAttribute").checked = false;
        }
      }
    } else {
      document.getElementById("doNotUseIdAttribute").checked = false;
    }

  });


  chrome.storage.local.get(['endtest_do_not_use_name_attribute'], function(do_not_use_name_attribute) {
    if (do_not_use_name_attribute) {
      to_not_use_name_attribute = do_not_use_name_attribute.endtest_do_not_use_name_attribute;
      if (to_not_use_name_attribute) {
        if (to_not_use_name_attribute == "1") {
          document.getElementById("doNotUseNameAttribute").checked = true;
        }
        if (to_not_use_name_attribute == "0") {
          document.getElementById("doNotUseNameAttribute").checked = false;
        }
      }
    } else {
      document.getElementById("doNotUseNameAttribute").checked = false;
    }

  });


  chrome.storage.local.get(['endtest_do_not_use_url_query_strings'], function(do_not_use_url_query_strings) {
    if (do_not_use_url_query_strings) {
      to_not_use_url_query_strings = do_not_use_url_query_strings.endtest_do_not_use_url_query_strings;
      if (to_not_use_url_query_strings) {
        if (to_not_use_url_query_strings == "1") {
          document.getElementById("doNotUseUrlQueryStrings").checked = true;
        }
        if (to_not_use_url_query_strings == "0") {
          document.getElementById("doNotUseUrlQueryStrings").checked = false;
        }
      }
    } else {
      document.getElementById("doNotUseUrlQueryStrings").checked = false;
    }
  });


  chrome.storage.local.get(['endtest_ignore_classes'], function(ignore_classes) {
    if (ignore_classes.endtest_ignore_classes) {
      classes_to_ignore = ignore_classes.endtest_ignore_classes;
      if (classes_to_ignore) {
        document.getElementById("blacklist_classes").value = classes_to_ignore;
      }
    } else {
      document.getElementById("blacklist_classes").value = "ng-, active, checked, selected, focused ,correct, disable, enable, highlight, over, hvr, cursor, show, focus, pressed, pushed, touch, dirty, pristine, require, select, valid, open, hidden, hide, desktop, mobile, tablet, grid, col-, row-";
    }
  });


  chrome.storage.local.get(['endtest_custom_data_attributes'], function(data_attributes) {
    if (data_attributes.endtest_custom_data_attributes) {
      custom_data_attributes_to_use = data_attributes.endtest_custom_data_attributes;
      if (data_attributes) {
        document.getElementById("custom_data_attributes").value = custom_data_attributes_to_use;
      }
    } else {
      document.getElementById("custom_data_attributes").value = "data-test, data-testing, data-qa, data-testid, data-test-id";
    }
  });





}

function hideSettings() {
  document.getElementById("container_for_settings").style.display = "none";
  document.getElementById("settings_icon").style.display = "block";
}

function showCurrentlyRecording() {
  //$("#containerForCurrentlyRecording").css("display", "block");
  try {
    document.getElementById("containerForCurrentlyRecording").style.display = "block";
  } catch (err) {
    // do nothing
  }
}

function hideCurrentlyRecording() {
  //$("#containerForCurrentlyRecording").css("display", "none");
  try {
    document.getElementById("containerForCurrentlyRecording").style.display = "none";
  } catch (err) {
    // do nothing
  }
}

function showStoppedRecorder() {
  the_stopped_recorder_container_element = document.getElementById('containerForStoppedRecording');
  the_display_value = the_stopped_recorder_container_element.style.display;
  if (the_display_value != 'block') {
    try {
      document.getElementById("containerForStoppedRecording").style.display = "block";
      $("body").css("min-height", "250px");
      $("body").css("height", "250px");
      $("html").css("height", "250px");


      request = $.ajax({
        url: "https://app.endtest.io/getTestSuitesForExtension.php",
        type: "GET",
        data: {
          action: 'getTestSuitesForExtension',
          cookie_hash: that_cookie
        },
        success: function(data) {

          suitesJson = JSON.parse(data);
          var defaultOption = document.createElement("option");
          defaultOption.text = "Choose Test Suite";
          defaultOption.value = "ChooseTestCase";
          sel = document.getElementById('selectTestSuite');

          sel.appendChild(defaultOption);
          //j.add(defaultOption);
          for (var k = 0; k < suitesJson.length; k++) {
            var option = document.createElement("option");

            the_text_for_option = suitesJson[k].name;
            ending = '...';
            length = 40;
            if (the_text_for_option.length > length) {
              the_text_for_option = the_text_for_option.substring(0, length - ending.length) + ending;
            }

            option.text = the_text_for_option;
            option.value = suitesJson[k].id;


            sel.appendChild(option);

          }


        },
        error: function(e) {
          alert("Error getting list of test suites.");
        }
      });
    } catch (err) {
      // do nothing
    }

  }

}

function hideStoppedRecorder() {
  //$("#containerForStoppedRecording").css("display", "none");
  try {
    document.getElementById("containerForStoppedRecording").style.display = "none";
  } catch (err) {
    // do nothing
  }

}

function removeStoredIframe() {
  chrome.storage.local.remove(['current_iframe'], function(the_current_iframe) {
    //message('Settings saved');
  });
}


function startRecording() {
  removeStoredIframe();


  startFromUrlRadio
  var startFromUrlChecked = document.getElementById("startFromUrlRadio").checked;
  var startFromHereChecked = document.getElementById("startFromHereRadio").checked;

  if (startFromUrlChecked == true && startFromHereChecked == false) {
    var urlToRecord = document.getElementById("urlInput").value;
    if (urlToRecord == '') {
      addValidationFront("urlInput", "errorForUrlInput", "Please provide the URL for your site");
      window.errorsInRecording = window.errorsInRecording + 1;
    } else {
      if (!urlToRecord.includes("http")) {
        addValidationFront("urlInput", "errorForUrlInput", "The full URL is required");
        window.errorsInRecording = window.errorsInRecording + 1;
      } else {
        //chrome.cookies.set({ url: "https://endtest.io", name: "endtest_extension_currently_recording", value: "1", expirationDate: (new Date().getTime()/1000) + 80000 });

        chrome.storage.local.set({
          'endtest_extension_currently_recording': '1'
        }, function() {

        });

        chrome.runtime.sendMessage({
          "message": "open_new_tab",
          "url": urlToRecord
        });


        chrome.storage.local.set({
          'last_tested_url': urlToRecord
        }, function() {

        });


        var firstStep = {
          1: {
            Action: "Go to URL",
            param1: urlToRecord,
            param2: "none",
            param3: "none"
          }
        };

        var firstStepString = JSON.stringify(firstStep);

        chrome.storage.local.set({
          'endtest_extension_recorded_steps': firstStepString
        }, function() {

        });

        checkTheCookie();
        try {
          pauseRecordingButton.classList.remove("paused_button");
          document.getElementById("messageContainerForPause").innerHTML = "";
        } catch (err) {
          // do nada;
        }

      }
    }

  }
  if (startFromUrlChecked == false && startFromHereChecked == true) {

    chrome.tabs.query({
      'active': true,
      'lastFocusedWindow': true
    }, function(tabs) {
      var urlToRecord = tabs[0].url;

      if (urlToRecord == '' || urlToRecord == undefined) {
        addValidationFront("urlInputNo", "errorForUrlInput", "No web page loaded in current tab");
        window.errorsInRecording = window.errorsInRecording + 1;
      } else {

        chrome.storage.local.set({
          'endtest_extension_currently_recording': '1'
        }, function() {
          var firstStep = {
            1: {
              Action: "Go to URL",
              param1: urlToRecord,
              param2: "none",
              param3: "none"
            }
          };

          var firstStepString = JSON.stringify(firstStep);

          chrome.storage.local.set({
            'endtest_extension_recorded_steps': firstStepString
          }, function() {

          });

          chrome.tabs.getSelected(null, function(tab) {
            var code = 'window.location.reload();';
            chrome.tabs.executeScript(tab.id, {
              code: code
            });
          });

          checkTheCookie();

        });


      }


    });






  }
}

function stopRecording() {
  //document.body.style.height='200';
  $("body").css("min-height", "250px");
  $("body").css("height", "250px");
  $("html").css("height", "250px");
  $("body").load(window.location.href + "body");
  //chrome.cookies.set({ url: "https://endtest.io", name: "endtest_extension_currently_recording", value: "2", expirationDate: (new Date().getTime()/1000) + 80000 });
  chrome.storage.local.set({
    'endtest_extension_currently_recording': '2'
  }, function() {
    // Notify that we saved.
    //message('Settings saved');
  });
  hideCurrentlyRecording();
  showStoppedRecorder();
}

function pauseRecording() {
  var pauseRecordingButton = document.getElementById('pauseRecordingButton');
  pauseRecordingButton.classList.toggle("paused_button");
  if (pauseRecordingButton.classList.contains("paused_button")) {
    document.getElementById("messageContainerForPause").innerHTML = "Recording has been paused.";
    chrome.storage.local.set({
      'endtest_extension_currently_recording': '3'
    }, function() {});
  }
  if (!pauseRecordingButton.classList.contains("paused_button")) {
    document.getElementById("messageContainerForPause").innerHTML = "Recording has been resumed.";
    chrome.storage.local.set({
      'endtest_extension_currently_recording': '1'
    }, function() {});
  }
}

function saveRecording() {
  $('#errorForTestCaseName').empty();
  $('#errorForNewTestSuiteName').empty();
  caseErrorValidationOne = 0;
  caseErrorValidationTwo = 0;
  if ($("#testCaseNameInput").val() == '') {
    addValidationFront("testCaseNameInput", "errorForTestCaseName", 'Please enter a name for the test case');
    caseErrorValidationOne = 1;
  }
  if ($("#testCaseNameInput").val().replace(/^\s+|\s+$/g, "").length != 0) {
    if (/^[a-zA-Z0-9- ]*$/.test($("#testCaseNameInput").val()) == false) {
      addValidationFront("testCaseNameInput", "errorForTestCaseName", 'Only letters and numbers are allowed');
      caseErrorValidationTwo = 1;
    }
  }
  if (caseErrorValidationOne == 0 && caseErrorValidationTwo == 0) {
    var testCaseName = document.getElementById("testCaseNameInput").value;
  }

  chrome.cookies.get({
    "url": 'https://app.endtest.io',
    "name": 'ceva_orbtset'
  }, function(cookie) {
    if (cookie) {
      that_cookie = cookie.value;
    }
  });


  if ($('#newTestSuiteRadio').is(':checked')) {
    newSuiteErrorValidationOne = 0;
    newSuiteErrorValidationTwo = 0;
    if ($("#newTestSuiteName").val() == '') {
      addValidationFront("newTestSuiteName", "errorForNewTestSuiteName", 'Please enter a name for the test suite');
      newSuiteErrorValidationOne = 1;
    }
    if ($("#newTestSuiteName").val().replace(/^\s+|\s+$/g, "").length != 0) {
      if (/^[a-zA-Z0-9- ]*$/.test($("#newTestSuiteName").val()) == false) {
        addValidationFront("newTestSuiteName", "errorForNewTestSuiteName", 'Only letters and numbers are allowed');
        newSuiteErrorValidationTwo = 1;
      }
    }


    if (newSuiteErrorValidationOne == 0 && newSuiteErrorValidationTwo == 0 && caseErrorValidationOne == 0 && caseErrorValidationTwo == 0) {
      var newTestSuiteName = document.getElementById("newTestSuiteName").value;
      chrome.storage.local.get(['endtest_extension_recorded_steps'], function(the_cookie_with_steps) {
        if (the_cookie_with_steps) {
          var the_steps_from_the_cookie = the_cookie_with_steps.endtest_extension_recorded_steps;

          request = $.ajax({
            url: "https://app.endtest.io/saveTestFromExtensionNew.php",
            type: "POST",
            data: {
              action: 'saveTestFromExtension',
              theCookie: that_cookie,
              newOrExistingSuite: 'new',
              testCaseName: testCaseName,
              testSuiteId: 'none',
              testSuiteName: newTestSuiteName,
              jsonWithSteps: the_steps_from_the_cookie,
            },
            success: function(data) {
              if (data == 'saved') {
                chrome.storage.local.set({
                  'endtest_extension_currently_recording': '0'
                }, function() {
                  //message('Settings saved');
                });
                chrome.tabs.create({
                  "url": "https://app.endtest.io/tests"
                });
                hideStoppedRecorder();
                showStartRecorder();
              }
              if (data == 'limit_reached') {
                alert('You cannot add more than 3 test suites during the Free trial. \r\nPlease upgrade to PRO Plan for unlimited test suites.')
              }
            },
            error: function(e) {
              alert("Error saving test.");
            }
          });




        }

      });




    }
  }

  if ($('#existingTestSuiteRadio').is(':checked')) {
    existingSuiteErrorValidationOne = 0;
    if ($("#selectTestSuite").val() == 'ChooseTestCase' || $("#selectTestSuite").val() == '') {
      addValidationFront("newTestSuiteName", "errorForNewTestSuiteName", 'Please choose a test suite');
      existingSuiteErrorValidationOne = 1;
    }
    if (existingSuiteErrorValidationOne == 0 && caseErrorValidationOne == 0 && caseErrorValidationTwo == 0) {
      var selectedTestSuiteId = document.getElementById("selectTestSuite").value;
      chrome.storage.local.get(['endtest_extension_recorded_steps'], function(the_cookie_with_steps) {
        if (the_cookie_with_steps) {
          var the_steps_from_the_cookie = the_cookie_with_steps.endtest_extension_recorded_steps;
          request = $.ajax({
            url: "https://app.endtest.io/saveTestFromExtension.php",
            type: "POST",
            data: {
              action: 'saveTestFromExtension',
              theCookie: that_cookie,
              newOrExistingSuite: 'existing',
              testCaseName: testCaseName,
              testSuiteId: selectedTestSuiteId,
              testSuiteName: 'exists_already',
              jsonWithSteps: the_steps_from_the_cookie,
            },
            success: function(data) {
              if (data == 'limit_reached') {
                alert('You cannot add more than 3 test suites during the Free trial. Please upgrade to PRO Plan for unlimited test suites.')
              }
              if (data == 'saved') {
                chrome.storage.local.set({
                  'endtest_extension_currently_recording': '0'
                }, function() {
                  //message('Settings saved');
                });
                chrome.tabs.create({
                  "url": "https://app.endtest.io/tests"
                });
              }
            },
            error: function(e) {
              alert("Error saving test.");
            }
          });
        }
      });


    }
  }

  /*
   var testCaseName=document.getElementById("testCaseNameInput").value;
   chrome.storage.local.set({'endtest_extension_test_case_name':testCaseName}, function() {
     message('Settings saved');
  });

  */


  //hideStoppedRecorder();
  //showStartRecorder();
}

function cancelRecording() {
  //chrome.cookies.set({ url: "https://endtest.io", name: "endtest_extension_currently_recording", value: "0", expirationDate: (new Date().getTime()/1000) + 80000 });
  chrome.storage.local.set({
    'endtest_extension_currently_recording': '0'
  }, function() {
    // Notify that we saved.
    //message('Settings saved');
  });
  hideStoppedRecorder();
  showStartRecorder();
  chrome.storage.local.get(['last_tested_url'], function(the_stored_url) {
    if (the_stored_url.last_tested_url) {
      document.getElementById("urlInput").value = the_stored_url.last_tested_url;

    }
  });
}

function login() {
  window.errorsInLogin = 0;
  if (window.attempts > 9) {
    $("#errorForUserPasswordLoginInput").text('Multiple failed attempts can block your IP');

  } else {
    $("#userEmailLoginInput").html('');
    $("#errorForUserPasswordLoginInput").html('');
    var userLoginEmail = document.getElementById("userEmailLoginInput").value;
    var userLoginPassword = document.getElementById("userPasswordLoginInput").value;
    if (userLoginEmail != '' && isValidEmailAddress(userLoginEmail)) {
      var userLoginEmailValid = userLoginEmail;
    }
    if (userLoginEmail != '' && !isValidEmailAddress(userLoginEmail)) {
      addValidationFront("userEmailLoginInput", "errorForUserEmailLoginInput", "Please enter a valid email");
      window.errorsInLogin = window.errorsInLogin + 1;
    }
    if (userLoginEmail == '') {
      addValidationFront("userEmailLoginInput", "errorForUserEmailLoginInput", "Email is required");
      window.errorsInLogin = window.errorsInLogin + 1;
    }
    if (userLoginPassword != '') {
      var userLoginPasswordValid = userLoginPassword;
    }
    if (userLoginPassword == '') {
      addValidationFront("userPasswordLoginInput", "errorForUserPasswordLoginInput", "Password is required");
      window.errorsInLogin = window.errorsInLogin + 1;
    }
    if (window.errorsInLogin == 0) {
      if (window.attempts < 9) {
        sendLoginRequest(userLoginEmailValid, userLoginPasswordValid)
      }
    }
  }
}


function sendLoginRequest(userEmailForLogin, userPasswordForLogin) {
  request = $.ajax({
    url: "https://app.endtest.io/login_core_extension.php",
    type: "POST",
    data: {
      action: 'loginUser',
      userEmail: userEmailForLogin,
      userPassword: userPasswordForLogin
    },
    success: function(data) {
      if (data == "login_successful") {
        //chrome.cookies.set({ url: "https://endtest.io", name: "werner", value: "123", expirationDate: (new Date().getTime()/1000) + 31536000 });
        hideLogin();
        showStartRecorder();
      }
      if (data == "incorrect_password") {
        addValidationFront("userLoginPassword", "errorForUserPasswordLoginInput", "Invalid email or password");
        window.errorsInLogin = window.errorsInLogin + 1;
        window.attempts = window.attempts + 1;
      }
      if (data == "email_not_valid") {
        addValidationFront("userEmailLoginInput", "errorForUserEmailLoginInput", "Invalid email");
        window.errorsInLogin = window.errorsInLogin + 1;
      }
    },
    error: function(e) {
      addValidationFront("userLoginPassword", "errorForUserPasswordLoginInput", "Error processing request");
    }
  });
}


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    checkTheCookie();
  }
);


try {
  $('input[type=radio][name=existingOrNew]').change(function() {
    if (this.value == 'new') {
      document.getElementById('selectTestSuite').style.display = 'none';
      document.getElementById('newTestSuiteName').style.display = 'block';
      $('#errorForNewTestSuiteName').empty();
    } else if (this.value == 'existing') {
      document.getElementById('newTestSuiteName').style.display = 'none';
      document.getElementById('selectTestSuite').style.display = 'block';
      $('#errorForNewTestSuiteName').empty();
    }
  });
} catch (err) {
  var that_error = err;
}


try {
  document.getElementById('loginButton').addEventListener('click', login);
  document.getElementById('startRecordingButton').addEventListener('click', startRecording);
  document.getElementById('pauseRecordingButton').addEventListener('click', pauseRecording);
  document.getElementById('stopRecordingButton').addEventListener('click', stopRecording);
  document.getElementById('takeScreenshotButton').addEventListener('click', takeScreenshot);
  document.getElementById('addAssertionButton').addEventListener('click', addAssertion);
  document.getElementById('cancelRecordingButton').addEventListener('click', cancelRecording);
  document.getElementById('saveRecordingButton').addEventListener('click', saveRecording);

  document.getElementById('urlInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      startRecording();
    }
  });

} catch (err) {
  var that_other_error = err;
}
