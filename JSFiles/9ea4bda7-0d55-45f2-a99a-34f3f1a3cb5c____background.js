var switchToMainCounter = 0;


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message === "open_new_tab") {
      chrome.tabs.update({
        url: request.url
      });
    }
  }
);



chrome.webNavigation.onCommitted.addListener(function(oEvent) {
  go_to_link = false;
  if (oEvent.transitionType == "typed" && oEvent.url != "chrome-search://local-ntp/local-ntp.html") {
    go_to_link = true;
  } else if (oEvent.transitionType == "keyword_generated" && oEvent.url != "chrome-search://local-ntp/local-ntp.html") {
    go_to_link = true;
  } else if (oEvent.transitionType == "keyword" && oEvent.url != "chrome-search://local-ntp/local-ntp.html") {
    go_to_link = true;
  } else if (oEvent.transitionType == "generated" && oEvent.url != "chrome-search://local-ntp/local-ntp.html") {
    go_to_link = true;
  } else if (oEvent.transitionQualifiers == "forward_back" && oEvent.url != "chrome-search://local-ntp/local-ntp.html") {
    go_to_link = true;
  } else if (oEvent.transitionType == "reload") {

    chrome.storage.local.get(['endtest_extension_currently_recording'], function(the_cookie) {
      if (the_cookie.endtest_extension_currently_recording) {
        the_recording_cookie = the_cookie.endtest_extension_currently_recording;
        if (the_recording_cookie == "1") {
          chrome.storage.local.get(['endtest_extension_recorded_steps'], function(the_cookie_with_steps) {
            if (the_cookie_with_steps) {
              the_steps_from_the_cookie = the_cookie_with_steps.endtest_extension_recorded_steps;
              if (the_steps_from_the_cookie) {
                the_json_with_steps_from_the_cookie = JSON.parse(the_steps_from_the_cookie);
                keys = Object.keys(the_json_with_steps_from_the_cookie)
                current_number_of_recorded_steps = keys.length;
                number_for_this_step = current_number_of_recorded_steps + 1;
                var step = {
                  Action: "Refresh Page",
                  param1: "none",
                  param2: "none",
                  param3: "none"
                };
                var theStepJson = JSON.stringify(step);
                the_json_with_steps_from_the_cookie[number_for_this_step] = step;
                var myJSON = JSON.stringify(the_json_with_steps_from_the_cookie);
                chrome.storage.local.set({
                  'endtest_extension_recorded_steps': myJSON
                }, function() {
                  // Notify that we saved.
                  //message('Settings saved');
                });

              }
            }
          });

        }
      }
    });

  }

  if (go_to_link == true) {

    chrome.storage.local.get(['endtest_extension_currently_recording'], function(the_cookie) {
      if (the_cookie.endtest_extension_currently_recording) {
        the_recording_cookie = the_cookie.endtest_extension_currently_recording;
        if (the_recording_cookie == "1") {
          chrome.storage.local.get(['endtest_extension_recorded_steps'], function(the_cookie_with_steps) {
            if (the_cookie_with_steps) {
              the_steps_from_the_cookie = the_cookie_with_steps.endtest_extension_recorded_steps;
              if (the_steps_from_the_cookie) {
                the_json_with_steps_from_the_cookie = JSON.parse(the_steps_from_the_cookie);
                keys = Object.keys(the_json_with_steps_from_the_cookie)
                current_number_of_recorded_steps = keys.length;
                number_for_this_step = current_number_of_recorded_steps + 1;
                var step = {
                  Action: "Go to URL",
                  param1: oEvent.url,
                  param2: "none",
                  param3: "none"
                };
                var theStepJson = JSON.stringify(step);
                the_json_with_steps_from_the_cookie[number_for_this_step] = step;
                var myJSON = JSON.stringify(the_json_with_steps_from_the_cookie);
                chrome.storage.local.set({
                  'endtest_extension_recorded_steps': myJSON
                }, function() {
                  // Notify that we saved.
                  //message('Settings saved');
                });

              }
            }
          });

        }
      }
    });

  }


});

chrome.tabs.onActivated.addListener(function(activeInfo) {
  previous_tab_id = 0;
  chrome.storage.local.get(['current_tab_id'], function(tab_info) {


    chrome.storage.local.get(['endtest_extension_currently_recording'], function(the_cookie) {
      if (the_cookie.endtest_extension_currently_recording) {
        the_recording_cookie = the_cookie.endtest_extension_currently_recording;
        if (the_recording_cookie == "1") {

          if (tab_info.current_tab_id) {
            previous_tab_id = tab_info.current_tab_id;
            current_tab_id = activeInfo.tabId;

            if (current_tab_id > previous_tab_id) {
              chrome.storage.local.get(['endtest_extension_recorded_steps'], function(the_cookie_with_steps) {
                if (the_cookie_with_steps) {
                  the_steps_from_the_cookie = the_cookie_with_steps.endtest_extension_recorded_steps;
                  if (the_steps_from_the_cookie) {
                    the_json_with_steps_from_the_cookie = JSON.parse(the_steps_from_the_cookie);
                    keys = Object.keys(the_json_with_steps_from_the_cookie)
                    current_number_of_recorded_steps = keys.length;
                    number_for_this_step = current_number_of_recorded_steps + 1;
                    var step = {
                      Action: "Switch to next tab",
                      param1: "none",
                      param2: "none",
                      param3: "none"
                    };
                    var theStepJson = JSON.stringify(step);
                    the_json_with_steps_from_the_cookie[number_for_this_step] = step;
                    var myJSON = JSON.stringify(the_json_with_steps_from_the_cookie);
                    chrome.storage.local.set({
                      'endtest_extension_recorded_steps': myJSON
                    }, function() {
                      // Notify that we saved.
                      //message('Settings saved');
                    });

                  }
                }
              });
            }
            if (current_tab_id < previous_tab_id) {
              chrome.storage.local.get(['endtest_extension_recorded_steps'], function(the_cookie_with_steps) {
                if (the_cookie_with_steps) {
                  the_steps_from_the_cookie = the_cookie_with_steps.endtest_extension_recorded_steps;
                  if (the_steps_from_the_cookie) {
                    the_json_with_steps_from_the_cookie = JSON.parse(the_steps_from_the_cookie);
                    keys = Object.keys(the_json_with_steps_from_the_cookie)
                    current_number_of_recorded_steps = keys.length;
                    number_for_this_step = current_number_of_recorded_steps + 1;
                    var step = {
                      Action: "Switch to previous tab",
                      param1: "none",
                      param2: "none",
                      param3: "none"
                    };
                    var theStepJson = JSON.stringify(step);
                    the_json_with_steps_from_the_cookie[number_for_this_step] = step;
                    var myJSON = JSON.stringify(the_json_with_steps_from_the_cookie);
                    chrome.storage.local.set({
                      'endtest_extension_recorded_steps': myJSON
                    }, function() {
                      // Notify that we saved.
                      //message('Settings saved');
                    });

                  }
                }
              });
            }
          }

        }
      }
    });


  });

  currentTab = activeInfo.tabId;
  chrome.storage.local.set({
    'current_tab_id': currentTab
  }, function() {
    //message('Settings saved');
  });

});


chrome.tabs.onCreated.addListener(function(tab) {

  chrome.storage.local.get(['endtest_extension_currently_recording'], function(the_cookie) {
    if (the_cookie.endtest_extension_currently_recording) {
      the_recording_cookie = the_cookie.endtest_extension_currently_recording;
      if (the_recording_cookie == "1") {

        chrome.storage.local.get(['endtest_extension_recorded_steps'], function(the_cookie_with_steps) {
          if (the_cookie_with_steps) {
            the_steps_from_the_cookie = the_cookie_with_steps.endtest_extension_recorded_steps;
            if (the_steps_from_the_cookie) {
              the_json_with_steps_from_the_cookie = JSON.parse(the_steps_from_the_cookie);
              keys = Object.keys(the_json_with_steps_from_the_cookie)
              current_number_of_recorded_steps = keys.length;
              number_for_this_step = current_number_of_recorded_steps + 1;
              var step = {
                Action: "Open new tab",
                param1: "none",
                param2: "none",
                param3: "none"
              };
              var theStepJson = JSON.stringify(step);
              the_json_with_steps_from_the_cookie[number_for_this_step] = step;
              var myJSON = JSON.stringify(the_json_with_steps_from_the_cookie);
              chrome.storage.local.set({
                'endtest_extension_recorded_steps': myJSON
              }, function() {
                // Notify that we saved.
                //message('Settings saved');
              });

            }
          }
        });

      }
    }
  });


});


chrome.tabs.onRemoved.addListener(function(tab) {

  chrome.storage.local.get(['endtest_extension_currently_recording'], function(the_cookie) {
    if (the_cookie.endtest_extension_currently_recording) {
      the_recording_cookie = the_cookie.endtest_extension_currently_recording;
      if (the_recording_cookie == "1") {

        chrome.storage.local.get(['endtest_extension_recorded_steps'], function(the_cookie_with_steps) {
          if (the_cookie_with_steps) {
            the_steps_from_the_cookie = the_cookie_with_steps.endtest_extension_recorded_steps;
            if (the_steps_from_the_cookie) {
              the_json_with_steps_from_the_cookie = JSON.parse(the_steps_from_the_cookie);
              keys = Object.keys(the_json_with_steps_from_the_cookie)
              current_number_of_recorded_steps = keys.length;
              number_for_this_step = current_number_of_recorded_steps + 1;
              var step = {
                Action: "Close tab",
                param1: "none",
                param2: "none",
                param3: "none"
              };
              var theStepJson = JSON.stringify(step);
              the_json_with_steps_from_the_cookie[number_for_this_step] = step;
              var myJSON = JSON.stringify(the_json_with_steps_from_the_cookie);
              chrome.storage.local.set({
                'endtest_extension_recorded_steps': myJSON
              }, function() {
                //message('Settings saved');
              });

            }
          }
        });

      }
    }
  });

});


function wait(ms) {
  var start = new Date().getTime();
  var end = start;
  while (end < start + ms) {
    end = new Date().getTime();
  }
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {


    if (request.message === "switch_to_main_event") {

      chrome.storage.local.get(['endtest_extension_currently_recording'], function(the_cookie) {
        if (the_cookie.endtest_extension_currently_recording) {
          the_recording_cookie = the_cookie.endtest_extension_currently_recording;
          if (the_recording_cookie == "1") {

            chrome.storage.local.get(['current_iframe'], function(the_current_iframe) {
              if (the_current_iframe.current_iframe) {
                window.switchToMainCounter = 1;
                addSwitchToMain();
              } else {
                // do nada
              }
              removeStoredIframe();
            });

          }
        }
      });


    }


    function removeStoredIframe() {
      chrome.storage.local.remove(['current_iframe'], function(the_current_iframe) {
        //message('Settings saved');
      });
    }

    function addSwitchToMain() {
      chrome.storage.local.get(['endtest_extension_recorded_steps'], function(the_cookie_with_steps) {
        if (the_cookie_with_steps) {
          the_steps_from_the_cookie = the_cookie_with_steps.endtest_extension_recorded_steps;
          if (the_steps_from_the_cookie) {
            the_json_with_steps_from_the_cookie = JSON.parse(the_steps_from_the_cookie);
            keys = Object.keys(the_json_with_steps_from_the_cookie)
            current_number_of_recorded_steps = keys.length;
            number_for_this_step = current_number_of_recorded_steps + 1;
            var step = {
              Action: "Switch back to main",
              param1: "none",
              param2: "none",
              param3: "none"
            };
            var theStepJson = JSON.stringify(step);
            the_json_with_steps_from_the_cookie[number_for_this_step] = step;
            var myJSON = JSON.stringify(the_json_with_steps_from_the_cookie);
            chrome.storage.local.set({
              'endtest_extension_recorded_steps': myJSON
            }, function() {
              // Notify that we saved.
              //message('Settings saved');
            });

          }
        }
      });
    }

    function addSwitchToIframe() {
      chrome.storage.local.get(['endtest_extension_recorded_steps'], function(the_cookie_with_steps) {
        if (the_cookie_with_steps) {
          the_steps_from_the_cookie = the_cookie_with_steps.endtest_extension_recorded_steps;
          if (the_steps_from_the_cookie) {
            the_json_with_steps_from_the_cookie = JSON.parse(the_steps_from_the_cookie);
            keys = Object.keys(the_json_with_steps_from_the_cookie)
            current_number_of_recorded_steps = keys.length;
            number_for_this_step = current_number_of_recorded_steps + 1;
            var step = {
              Action: "Switch to iframe",
              param1: request.locate_by,
              param2: request.locator,
              param3: "none",
              label: request.label
            };
            var theStepJson = JSON.stringify(step);
            the_json_with_steps_from_the_cookie[number_for_this_step] = step;
            var myJSON = JSON.stringify(the_json_with_steps_from_the_cookie);
            chrome.storage.local.set({
              'endtest_extension_recorded_steps': myJSON
            }, function() {
              //message('Settings saved');
            });

          }
        }
      });
    }

    if (request.message === "switch_to_iframe_event") {

      chrome.storage.local.get(['endtest_extension_currently_recording'], function(the_cookie) {
        if (the_cookie.endtest_extension_currently_recording) {
          the_recording_cookie = the_cookie.endtest_extension_currently_recording;
          if (the_recording_cookie == "1") {

            chrome.storage.local.get(['current_iframe'], function(the_current_iframe) {
              if (the_current_iframe.current_iframe && the_current_iframe.current_iframe == request.locator) {
                // do nothing
              } else {
                addSwitchToIframe();
              }
              addIframeInLocalStorage(request.locator)
              //message('Settings saved');
            });

          }
        }
      });
    }

    function addIframeInLocalStorage(the_xpath) {
      chrome.storage.local.set({
        'current_iframe': the_xpath
      }, function() {
        //message('Settings saved');
      });
    }


    if (request.message === "click_event") {
      chrome.storage.local.get(['endtest_extension_currently_recording'], function(the_cookie) {
        if (the_cookie.endtest_extension_currently_recording) {
          the_recording_cookie = the_cookie.endtest_extension_currently_recording;
          if (the_recording_cookie == "1") {
            setTimeout(doTheClick, 1000);
          }
        }
      });

    }

    if (request.message === "add_assertion") {
      setTimeout(doTheAssert, 1000);
    }


    if (request.message === "hover_event") {
      try {
        chrome.storage.local.get(['endtest_record_hover_events'], function(the_data) {
          if (the_data.endtest_record_hover_events) {
            to_record_hover = the_data.endtest_record_hover_events;
            if (to_record_hover == "1") {


              chrome.storage.local.get(['endtest_extension_currently_recording'], function(the_cookie) {
                if (the_cookie.endtest_extension_currently_recording) {
                  the_recording_cookie = the_cookie.endtest_extension_currently_recording;
                  if (the_recording_cookie == "1") {

                    setTimeout(doTheHover, 1000);

                  }
                }
              });


            }
            if (to_record_hover == "0") {
              // do nothing;
            }
          } else {
            // do nothing
          }
        });
      } catch (err) {
        // do nothing;
      }
    }


    function doTheClick() {
      chrome.storage.local.get(['endtest_extension_recorded_steps'], function(the_cookie_with_steps) {
        if (the_cookie_with_steps) {
          the_steps_from_the_cookie = the_cookie_with_steps.endtest_extension_recorded_steps;
          if (the_steps_from_the_cookie) {
            the_json_with_steps_from_the_cookie = JSON.parse(the_steps_from_the_cookie);
            keys = Object.keys(the_json_with_steps_from_the_cookie)
            current_number_of_recorded_steps = keys.length;
            number_for_this_step = current_number_of_recorded_steps + 1;
            if (window.switchToMainCounter == 1) {
              number_for_this_step = number_for_this_step + 1;
            }
            window.switchToMainCounter == 0;
            var step = {
              Action: "Click",
              param1: request.locate_by,
              param2: request.locator,
              param3: "none",
              label: request.label
            };
            var theStepJson = JSON.stringify(step);
            the_json_with_steps_from_the_cookie[number_for_this_step] = step;
            var myJSON = JSON.stringify(the_json_with_steps_from_the_cookie);

            chrome.storage.local.set({
              'endtest_extension_recorded_steps': myJSON
            }, function() {
              // Notify that we saved.
              //message('Settings saved');
            });




          }
        }
      });
    }


    function doTheAssert() {
      chrome.storage.local.get(['endtest_extension_recorded_steps'], function(the_cookie_with_steps) {
        if (the_cookie_with_steps) {
          the_steps_from_the_cookie = the_cookie_with_steps.endtest_extension_recorded_steps;
          if (the_steps_from_the_cookie) {
            the_json_with_steps_from_the_cookie = JSON.parse(the_steps_from_the_cookie);
            keys = Object.keys(the_json_with_steps_from_the_cookie)
            current_number_of_recorded_steps = keys.length;
            number_for_this_step = current_number_of_recorded_steps + 1;
            if (window.switchToMainCounter == 1) {
              number_for_this_step = number_for_this_step + 1;
            }
            window.switchToMainCounter == 0;
            var step = {
              Action: "Add Assertion",
              param1: request.locate_by,
              param2: request.locator,
              param3: "Element is present",
              label: request.label
            };
            var theStepJson = JSON.stringify(step);
            the_json_with_steps_from_the_cookie[number_for_this_step] = step;
            var myJSON = JSON.stringify(the_json_with_steps_from_the_cookie);

            chrome.storage.local.set({
              'endtest_extension_recorded_steps': myJSON
            }, function() {
              // Notify that we saved.
              //message('Settings saved');
            });
            chrome.storage.local.set({
              'endtest_extension_currently_recording': '1'
            }, function() {
              // Notify that we saved.
              //message('Settings saved');
            });




          }
        }
      });
    }





    if (request.message === "right_click_event") {
      chrome.storage.local.get(['endtest_extension_currently_recording'], function(the_cookie) {
        if (the_cookie.endtest_extension_currently_recording) {
          the_recording_cookie = the_cookie.endtest_extension_currently_recording;
          if (the_recording_cookie == "1") {
            setTimeout(doTheRightClick, 1000);
          }
        }
      });

    }

    function doTheHover() {
      chrome.storage.local.get(['endtest_extension_recorded_steps'], function(the_cookie_with_steps) {
        if (the_cookie_with_steps) {

          the_steps_from_the_cookie = the_cookie_with_steps.endtest_extension_recorded_steps;
          if (the_steps_from_the_cookie) {
            the_json_with_steps_from_the_cookie = JSON.parse(the_steps_from_the_cookie);
            keys = Object.keys(the_json_with_steps_from_the_cookie)
            current_number_of_recorded_steps = keys.length;
            number_for_this_step = current_number_of_recorded_steps + 1;
            var step = {
              Action: "Hover",
              param1: request.locate_by,
              param2: request.locator,
              param3: "none",
              label: request.label
            };
            var theStepJson = JSON.stringify(step);
            the_json_with_steps_from_the_cookie[number_for_this_step] = step;
            var myJSON = JSON.stringify(the_json_with_steps_from_the_cookie);

            chrome.storage.local.set({
              'endtest_extension_recorded_steps': myJSON
            }, function() {
              // Notify that we saved.
              //message('Settings saved');
            });
          }
        }
      });
    }

    function doTheRightClick() {
      chrome.storage.local.get(['endtest_extension_recorded_steps'], function(the_cookie_with_steps) {
        if (the_cookie_with_steps) {

          the_steps_from_the_cookie = the_cookie_with_steps.endtest_extension_recorded_steps;
          if (the_steps_from_the_cookie) {
            the_json_with_steps_from_the_cookie = JSON.parse(the_steps_from_the_cookie);
            keys = Object.keys(the_json_with_steps_from_the_cookie)
            current_number_of_recorded_steps = keys.length;
            number_for_this_step = current_number_of_recorded_steps + 1;
            var step = {
              Action: "Right Click",
              param1: request.locate_by,
              param2: request.locator,
              param3: "none",
              label: request.label
            };
            var theStepJson = JSON.stringify(step);
            the_json_with_steps_from_the_cookie[number_for_this_step] = step;
            var myJSON = JSON.stringify(the_json_with_steps_from_the_cookie);

            chrome.storage.local.set({
              'endtest_extension_recorded_steps': myJSON
            }, function() {
              // Notify that we saved.
              //message('Settings saved');
            });
          }
        }
      });
    }

    function doTheTakeScreenshot() {
      chrome.storage.local.get(['endtest_extension_recorded_steps'], function(the_cookie_with_steps) {
        if (the_cookie_with_steps) {

          the_steps_from_the_cookie = the_cookie_with_steps.endtest_extension_recorded_steps;
          if (the_steps_from_the_cookie) {
            the_json_with_steps_from_the_cookie = JSON.parse(the_steps_from_the_cookie);
            keys = Object.keys(the_json_with_steps_from_the_cookie)
            current_number_of_recorded_steps = keys.length;
            number_for_this_step = current_number_of_recorded_steps + 1;
            var step = {
              Action: "Take Screenshot",
              param1: "none",
              param2: "none",
              param3: "none"
            };
            var theStepJson = JSON.stringify(step);
            the_json_with_steps_from_the_cookie[number_for_this_step] = step;
            var myJSON = JSON.stringify(the_json_with_steps_from_the_cookie);

            chrome.storage.local.set({
              'endtest_extension_recorded_steps': myJSON
            }, function() {
              // Notify that we saved.
              //message('Settings saved');
            });
          }
        }
      });
    }


    function doThePressEnterKey() {
      chrome.storage.local.get(['endtest_extension_recorded_steps'], function(the_cookie_with_steps) {
        if (the_cookie_with_steps) {

          the_steps_from_the_cookie = the_cookie_with_steps.endtest_extension_recorded_steps;
          if (the_steps_from_the_cookie) {
            the_json_with_steps_from_the_cookie = JSON.parse(the_steps_from_the_cookie);
            keys = Object.keys(the_json_with_steps_from_the_cookie)
            current_number_of_recorded_steps = keys.length;
            number_for_this_step = current_number_of_recorded_steps + 1;
            var step = {
              Action: "Press Key",
              param1: request.locate_by,
              param2: request.locator,
              param3: "ENTER",
              label: request.label
            };
            var theStepJson = JSON.stringify(step);
            the_json_with_steps_from_the_cookie[number_for_this_step] = step;
            var myJSON = JSON.stringify(the_json_with_steps_from_the_cookie);

            chrome.storage.local.set({
              'endtest_extension_recorded_steps': myJSON
            }, function() {
              // Notify that we saved.
              //message('Settings saved');
            });
          }
        }
      });
    }

    function doThePressDownArrowKey() {
      chrome.storage.local.get(['endtest_extension_recorded_steps'], function(the_cookie_with_steps) {
        if (the_cookie_with_steps) {

          the_steps_from_the_cookie = the_cookie_with_steps.endtest_extension_recorded_steps;
          if (the_steps_from_the_cookie) {
            the_json_with_steps_from_the_cookie = JSON.parse(the_steps_from_the_cookie);
            keys = Object.keys(the_json_with_steps_from_the_cookie)
            current_number_of_recorded_steps = keys.length;
            number_for_this_step = current_number_of_recorded_steps + 1;
            var step = {
              Action: "Press Key",
              param1: request.locate_by,
              param2: request.locator,
              param3: "ARROW_DOWN",
              label: request.label
            };
            var theStepJson = JSON.stringify(step);
            the_json_with_steps_from_the_cookie[number_for_this_step] = step;
            var myJSON = JSON.stringify(the_json_with_steps_from_the_cookie);

            chrome.storage.local.set({
              'endtest_extension_recorded_steps': myJSON
            }, function() {
              // Notify that we saved.
              //message('Settings saved');
            });
          }
        }
      });
    }

    function doThePressUpArrowKey() {
      chrome.storage.local.get(['endtest_extension_recorded_steps'], function(the_cookie_with_steps) {
        if (the_cookie_with_steps) {

          the_steps_from_the_cookie = the_cookie_with_steps.endtest_extension_recorded_steps;
          if (the_steps_from_the_cookie) {
            the_json_with_steps_from_the_cookie = JSON.parse(the_steps_from_the_cookie);
            keys = Object.keys(the_json_with_steps_from_the_cookie)
            current_number_of_recorded_steps = keys.length;
            number_for_this_step = current_number_of_recorded_steps + 1;
            var step = {
              Action: "Press Key",
              param1: request.locate_by,
              param2: request.locator,
              param3: "ARROW_UP",
              label: request.label
            };
            var theStepJson = JSON.stringify(step);
            the_json_with_steps_from_the_cookie[number_for_this_step] = step;
            var myJSON = JSON.stringify(the_json_with_steps_from_the_cookie);

            chrome.storage.local.set({
              'endtest_extension_recorded_steps': myJSON
            }, function() {
              // Notify that we saved.
              //message('Settings saved');
            });
          }
        }
      });
    }

    function doThePressLeftArrowKey() {
      chrome.storage.local.get(['endtest_extension_recorded_steps'], function(the_cookie_with_steps) {
        if (the_cookie_with_steps) {

          the_steps_from_the_cookie = the_cookie_with_steps.endtest_extension_recorded_steps;
          if (the_steps_from_the_cookie) {
            the_json_with_steps_from_the_cookie = JSON.parse(the_steps_from_the_cookie);
            keys = Object.keys(the_json_with_steps_from_the_cookie)
            current_number_of_recorded_steps = keys.length;
            number_for_this_step = current_number_of_recorded_steps + 1;
            var step = {
              Action: "Press Key",
              param1: request.locate_by,
              param2: request.locator,
              param3: "ARROW_LEFT",
              label: request.label
            };
            var theStepJson = JSON.stringify(step);
            the_json_with_steps_from_the_cookie[number_for_this_step] = step;
            var myJSON = JSON.stringify(the_json_with_steps_from_the_cookie);

            chrome.storage.local.set({
              'endtest_extension_recorded_steps': myJSON
            }, function() {
              // Notify that we saved.
              //message('Settings saved');
            });
          }
        }
      });
    }

    function doThePressRightArrowKey() {
      chrome.storage.local.get(['endtest_extension_recorded_steps'], function(the_cookie_with_steps) {
        if (the_cookie_with_steps) {

          the_steps_from_the_cookie = the_cookie_with_steps.endtest_extension_recorded_steps;
          if (the_steps_from_the_cookie) {
            the_json_with_steps_from_the_cookie = JSON.parse(the_steps_from_the_cookie);
            keys = Object.keys(the_json_with_steps_from_the_cookie)
            current_number_of_recorded_steps = keys.length;
            number_for_this_step = current_number_of_recorded_steps + 1;
            var step = {
              Action: "Press Key",
              param1: request.locate_by,
              param2: request.locator,
              param3: "ARROW_RIGHT",
              label: request.label
            };
            var theStepJson = JSON.stringify(step);
            the_json_with_steps_from_the_cookie[number_for_this_step] = step;
            var myJSON = JSON.stringify(the_json_with_steps_from_the_cookie);

            chrome.storage.local.set({
              'endtest_extension_recorded_steps': myJSON
            }, function() {
              // Notify that we saved.
              //message('Settings saved');
            });
          }
        }
      });
    }



    function doThePressEscKey() {
      chrome.storage.local.get(['endtest_extension_recorded_steps'], function(the_cookie_with_steps) {
        if (the_cookie_with_steps) {

          the_steps_from_the_cookie = the_cookie_with_steps.endtest_extension_recorded_steps;
          if (the_steps_from_the_cookie) {
            the_json_with_steps_from_the_cookie = JSON.parse(the_steps_from_the_cookie);
            keys = Object.keys(the_json_with_steps_from_the_cookie)
            current_number_of_recorded_steps = keys.length;
            number_for_this_step = current_number_of_recorded_steps + 1;
            var step = {
              Action: "Press Key",
              param1: request.locate_by,
              param2: request.locator,
              param3: "ESCAPE",
              label: request.label
            };
            var theStepJson = JSON.stringify(step);
            the_json_with_steps_from_the_cookie[number_for_this_step] = step;
            var myJSON = JSON.stringify(the_json_with_steps_from_the_cookie);

            chrome.storage.local.set({
              'endtest_extension_recorded_steps': myJSON
            }, function() {
              // Notify that we saved.
              //message('Settings saved');
            });
          }
        }
      });
    }





    if (request.message === "scroll_event") {
      try {
        chrome.storage.local.get(['endtest_record_scroll_events'], function(the_data) {
          if (the_data.endtest_record_scroll_events) {
            to_record_scroll = the_data.endtest_record_scroll_events;
            if (to_record_scroll == "1") {

              chrome.storage.local.get(['endtest_extension_currently_recording'], function(the_cookie) {
                if (the_cookie.endtest_extension_currently_recording) {
                  the_recording_cookie = the_cookie.endtest_extension_currently_recording;
                  if (the_recording_cookie == "1") {

                    chrome.storage.local.get(['endtest_extension_recorded_steps'], function(the_cookie_with_steps) {
                      if (the_cookie_with_steps) {
                        the_steps_from_the_cookie = the_cookie_with_steps.endtest_extension_recorded_steps;
                        if (the_steps_from_the_cookie) {
                          the_json_with_steps_from_the_cookie = JSON.parse(the_steps_from_the_cookie);
                          keys = Object.keys(the_json_with_steps_from_the_cookie)
                          current_number_of_recorded_steps = keys.length;
                          number_for_this_step = current_number_of_recorded_steps + 1;
                          var step = {
                            Action: "Scroll",
                            param1: request.scrollType,
                            param2: request.scrollDistance,
                            param3: "none"
                          };
                          var theStepJson = JSON.stringify(step);
                          the_json_with_steps_from_the_cookie[number_for_this_step] = step;
                          var myJSON = JSON.stringify(the_json_with_steps_from_the_cookie);
                          chrome.storage.local.set({
                            'endtest_extension_recorded_steps': myJSON
                          }, function() {
                            //message('Settings saved');
                          });
                        }
                      }
                    });


                  }
                }
              });

            }
            if (to_record_scroll == "0") {
              // do nothing;
            }
          } else {
            // do nothing
          }
        });
      } catch (err) {
        // do nothing;
      }
    }









    if (request.message === "write_text_event") {
      chrome.storage.local.get(['endtest_extension_currently_recording'], function(the_cookie) {
        if (the_cookie.endtest_extension_currently_recording) {
          the_recording_cookie = the_cookie.endtest_extension_currently_recording;
          if (the_recording_cookie == "1") {
            setTimeout(doTheWrite, 1000);
          }
        }
      });
    }

    function doTheWrite() {
      chrome.storage.local.get(['endtest_extension_recorded_steps'], function(the_cookie_with_steps) {
        if (the_cookie_with_steps) {
          the_steps_from_the_cookie = the_cookie_with_steps.endtest_extension_recorded_steps;
          if (the_steps_from_the_cookie) {

            if (request.text.length > 0) {

              the_json_with_steps_from_the_cookie = JSON.parse(the_steps_from_the_cookie);
              keys = Object.keys(the_json_with_steps_from_the_cookie)
              current_number_of_recorded_steps = keys.length;
              number_for_this_step = current_number_of_recorded_steps + 1;
              var step = {
                Action: "Write Text",
                param1: request.locate_by,
                param2: request.locator,
                param3: request.text,
                label: request.label
              };
              var theStepJson = JSON.stringify(step);
              the_json_with_steps_from_the_cookie[number_for_this_step] = step;
              var myJSON = JSON.stringify(the_json_with_steps_from_the_cookie);
              chrome.storage.local.set({
                'endtest_extension_recorded_steps': myJSON
              }, function() {
                //message('Settings saved');
              });

            }

          }
        }
      });
    }


    if (request.message === "write_and_press_enter_key") {
      chrome.storage.local.get(['endtest_extension_currently_recording'], function(the_cookie) {
        if (the_cookie.endtest_extension_currently_recording) {
          the_recording_cookie = the_cookie.endtest_extension_currently_recording;
          if (the_recording_cookie == "1") {
            setTimeout(doTheWriteAndEnter, 1000);
          }
        }
      });
    }

    function doTheWriteAndEnter() {
      chrome.storage.local.get(['endtest_extension_recorded_steps'], function(the_cookie_with_steps) {
        if (the_cookie_with_steps) {
          the_steps_from_the_cookie = the_cookie_with_steps.endtest_extension_recorded_steps;
          if (the_steps_from_the_cookie) {
            the_json_with_steps_from_the_cookie = JSON.parse(the_steps_from_the_cookie);
            keys = Object.keys(the_json_with_steps_from_the_cookie)
            current_number_of_recorded_steps = keys.length;
            number_for_this_step = current_number_of_recorded_steps + 1;

            if (request.text.length > 0) {

              var step = {
                Action: "Write Text",
                param1: request.locate_by,
                param2: request.locator,
                param3: request.text,
                label: request.label
              };
              var theStepJson = JSON.stringify(step);
              the_json_with_steps_from_the_cookie[number_for_this_step] = step;
              var next_step = {
                Action: "Press Key",
                param1: request.locate_by,
                param2: request.locator,
                param3: 'ENTER'
              };
              number_for_this_next_step = current_number_of_recorded_steps + 2;
              the_json_with_steps_from_the_cookie[number_for_this_next_step] = next_step;

            }

            if (request.text.length == 0) {
              var step = {
                Action: "Press Key",
                param1: request.locate_by,
                param2: request.locator,
                param3: 'ENTER'
              };
              var theStepJson = JSON.stringify(step);
              the_json_with_steps_from_the_cookie[number_for_this_step] = step;
            }




            var myJSON = JSON.stringify(the_json_with_steps_from_the_cookie);
            chrome.storage.local.set({
              'endtest_extension_recorded_steps': myJSON
            }, function() {
              //message('Settings saved');
            });
          }
        }
      });
    }

    if (request.message === "press_esc_key") {
      chrome.storage.local.get(['endtest_extension_currently_recording'], function(the_cookie) {
        if (the_cookie.endtest_extension_currently_recording) {
          the_recording_cookie = the_cookie.endtest_extension_currently_recording;
          if (the_recording_cookie == "1") {
            setTimeout(doThePressEscKey, 1000);
          }
        }
      });
    }

    if (request.message === "press_down_arrow_key") {
      chrome.storage.local.get(['endtest_extension_currently_recording'], function(the_cookie) {
        if (the_cookie.endtest_extension_currently_recording) {
          the_recording_cookie = the_cookie.endtest_extension_currently_recording;
          if (the_recording_cookie == "1") {
            setTimeout(doThePressDownArrowKey, 1000);
          }
        }
      });
    }

    if (request.message === "press_up_arrow_key") {
      chrome.storage.local.get(['endtest_extension_currently_recording'], function(the_cookie) {
        if (the_cookie.endtest_extension_currently_recording) {
          the_recording_cookie = the_cookie.endtest_extension_currently_recording;
          if (the_recording_cookie == "1") {
            setTimeout(doThePressUpArrowKey, 1000);
          }
        }
      });
    }

    if (request.message === "press_left_arrow_key") {
      chrome.storage.local.get(['endtest_extension_currently_recording'], function(the_cookie) {
        if (the_cookie.endtest_extension_currently_recording) {
          the_recording_cookie = the_cookie.endtest_extension_currently_recording;
          if (the_recording_cookie == "1") {
            setTimeout(doThePressLeftArrowKey, 1000);
          }
        }
      });
    }

    if (request.message === "press_right_arrow_key") {
      chrome.storage.local.get(['endtest_extension_currently_recording'], function(the_cookie) {
        if (the_cookie.endtest_extension_currently_recording) {
          the_recording_cookie = the_cookie.endtest_extension_currently_recording;
          if (the_recording_cookie == "1") {
            setTimeout(doThePressRightArrowKey, 1000);
          }
        }
      });
    }

    if (request.message === "press_enter_key") {
      chrome.storage.local.get(['endtest_extension_currently_recording'], function(the_cookie) {
        if (the_cookie.endtest_extension_currently_recording) {
          the_recording_cookie = the_cookie.endtest_extension_currently_recording;
          if (the_recording_cookie == "1") {
            setTimeout(doThePressEnterKey, 1000);
          }
        }
      });
    }

    if (request.message === "take_screenshot") {
      setTimeout(doTheTakeScreenshot, 50);
    }


    if (request.message === "write_and_press_tab_key") {
      chrome.storage.local.get(['endtest_extension_currently_recording'], function(the_cookie) {
        if (the_cookie.endtest_extension_currently_recording) {
          the_recording_cookie = the_cookie.endtest_extension_currently_recording;
          if (the_recording_cookie == "1") {
            setTimeout(doTheWriteAndTab, 1000);
          }
        }
      });
    }

    function doTheWriteAndTab() {
      chrome.storage.local.get(['endtest_extension_recorded_steps'], function(the_cookie_with_steps) {
        if (the_cookie_with_steps) {
          the_steps_from_the_cookie = the_cookie_with_steps.endtest_extension_recorded_steps;
          if (the_steps_from_the_cookie) {
            the_json_with_steps_from_the_cookie = JSON.parse(the_steps_from_the_cookie);
            keys = Object.keys(the_json_with_steps_from_the_cookie)
            current_number_of_recorded_steps = keys.length;
            number_for_this_step = current_number_of_recorded_steps + 1;

            if (request.text.length > 0) {


              var step = {
                Action: "Write Text",
                param1: request.locate_by,
                param2: request.locator,
                param3: request.text,
                label: request.label
              };
              var theStepJson = JSON.stringify(step);
              the_json_with_steps_from_the_cookie[number_for_this_step] = step;

              /*
              var next_step = {Action: "Press Key", param1: request.locate_by , param2:request.locator, param3:'Tab'};
              number_for_this_next_step=current_number_of_recorded_steps+2;
              the_json_with_steps_from_the_cookie[number_for_this_next_step]=next_step;
              */

            }

            if (request.text.length == 0) {

              /*

              var step = {Action: "Press Key", param1: request.locate_by , param2:request.locator, param3:'Tab'};
              var theStepJson = JSON.stringify(step);
              the_json_with_steps_from_the_cookie[number_for_this_step]=step;

              */
            }

            var myJSON = JSON.stringify(the_json_with_steps_from_the_cookie);
            chrome.storage.local.set({
              'endtest_extension_recorded_steps': myJSON
            }, function() {
              //message('Settings saved');
            });
          }
        }
      });
    }

    if (request.message === "upload_file_event") {
      chrome.storage.local.get(['endtest_extension_currently_recording'], function(the_cookie) {
        if (the_cookie.endtest_extension_currently_recording) {
          the_recording_cookie = the_cookie.endtest_extension_currently_recording;
          if (the_recording_cookie == "1") {
            setTimeout(doTheUploadFile, 1000);
          }
        }
      });
    }

    function doTheUploadFile() {
      chrome.storage.local.get(['endtest_extension_recorded_steps'], function(the_cookie_with_steps) {
        if (the_cookie_with_steps) {
          the_steps_from_the_cookie = the_cookie_with_steps.endtest_extension_recorded_steps;
          if (the_steps_from_the_cookie) {
            the_json_with_steps_from_the_cookie = JSON.parse(the_steps_from_the_cookie);
            keys = Object.keys(the_json_with_steps_from_the_cookie)
            current_number_of_recorded_steps = keys.length;
            number_for_this_step = current_number_of_recorded_steps + 1;
            var step = {
              Action: "Upload File",
              param1: request.locate_by,
              param2: request.locator,
              param3: request.file_to_pick,
              label: request.label
            };
            var theStepJson = JSON.stringify(step);
            the_json_with_steps_from_the_cookie[number_for_this_step] = step;
            var myJSON = JSON.stringify(the_json_with_steps_from_the_cookie);
            chrome.storage.local.set({
              'endtest_extension_recorded_steps': myJSON
            }, function() {
              //message('Settings saved');
            });
          }
        }
      });
    }



    if (request.message === "select_option_event") {
      chrome.storage.local.get(['endtest_extension_currently_recording'], function(the_cookie) {
        if (the_cookie.endtest_extension_currently_recording) {
          the_recording_cookie = the_cookie.endtest_extension_currently_recording;
          if (the_recording_cookie == "1") {
            setTimeout(doTheSelectOption, 1000);
          }
        }
      });
    }

    function doTheSelectOption() {
      chrome.storage.local.get(['endtest_extension_recorded_steps'], function(the_cookie_with_steps) {
        if (the_cookie_with_steps) {
          the_steps_from_the_cookie = the_cookie_with_steps.endtest_extension_recorded_steps;
          if (the_steps_from_the_cookie) {
            the_json_with_steps_from_the_cookie = JSON.parse(the_steps_from_the_cookie);
            keys = Object.keys(the_json_with_steps_from_the_cookie)
            current_number_of_recorded_steps = keys.length;
            number_for_this_step = current_number_of_recorded_steps + 1;
            var step = {
              Action: "Select Option",
              param1: request.locate_by,
              param2: request.locator,
              param3: request.option_to_pick,
              label: request.label
            };
            var theStepJson = JSON.stringify(step);
            the_json_with_steps_from_the_cookie[number_for_this_step] = step;
            var myJSON = JSON.stringify(the_json_with_steps_from_the_cookie);
            chrome.storage.local.set({
              'endtest_extension_recorded_steps': myJSON
            }, function() {
              //message('Settings saved');
            });
          }
        }
      });
    }


  }
);
