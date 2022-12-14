var noteGuid, type, hour = 8,
        minute = 0,
            reminderOrder, title, baseUrl, china, userId, tokens, shardId, url, premium, userType, siteNotesRequested = !1,
                success = !1,
                    successResponse, relatedNotesResponse, receivedRelatedNotes = siteNotesRequested = !1,
                        main, header, reminderSetter, relatedNotesButton, sameSiteNotesButton, tipsButton, closeButton, smart, smartPanel, errorTitle, errorDetails, errorButton, numEmailed, tipsContainer, rateNowButton, sendFeedbackButton, closeRatingsPromptButton, nearQuotaButton, referralButton, skitchButton, startTime;

function addHandlers() {
      smart.addEventListener("webkitTransitionEnd", function() {
                setHeight()
            });
          for (var a = document.getElementsByTagName("h2"), b = 0; b < a.length; b++) a.item(b).addEventListener("click", function() {
                    Browser.sendToExtension({
                                  name: "main_recordActivity"
                              });
                            selectSmartSection.call(this)
                });
              closeButton.addEventListener("click", dismiss);
                  errorButton.addEventListener("click", handleErrorClick);
                      rateNowButton.addEventListener("click", function() {
                                Browser.sendToExtension({
                                              name: "main_recordActivity"
                                          });
                                        Browser.sendToExtension({
                                                      name: "setPersistentValue",
                                                      key: userId + "_sawRatingsPrompt",
                                                      value: !0
                                                  });
                                                Browser.sendToExtension({
                                                              name: "trackEvent",
                                                              category: "Ratings",
                                                              action: "ratings_prompt_click",
                                                              label: "rate_now"
                                                          })
                                                    });
                          sendFeedbackButton.addEventListener("click", openFeedbackForm);
                              closeRatingsPromptButton.addEventListener("click", closeRatingsPrompt);
                                  nearQuotaButton.addEventListener("click", handleErrorClick);
                                      referralButton.addEventListener("click", function() {
                                                Browser.sendToExtension({
                                                              name: "main_recordActivity"
                                                          });
                                                        Browser.sendToExtension({
                                                                      name: "main_openWindow",
                                                                      width: 800,
                                                                      height: 600,
                                                                      url: baseUrl + "/SetAuthToken.action?auth=" + encodeURIComponent(tokens.authenticationToken) + "&targetUrl=" + encodeURIComponent("/referfriend?utm_source=web_clipper&utm_medium=in_app")
                                                                  });
                                                                Browser.sendToExtension({
                                                                              name: "setPersistentValue",
                                                                              key: userId + "_sawReferralCount",
                                                                              value: 5
                                                                          });
                                                                        Browser.sendToExtension({
                                                                                      name: "trackEvent",
                                                                                      category: "Promotion",
                                                                                      action: "refer_friend_promo",
                                                                                      label: "promo_clicked"
                                                                                  })
                                                                            });
                                          skitchButton.addEventListener("click", function() {
                                                    Browser.sendToExtension({
                                                                  name: "main_recordActivity"
                                                              });
                                                            Browser.sendToExtension({
                                                                          name: "trackEvent",
                                                                          category: "Promotion",
                                                                          action: "skitch_promo",
                                                                          label: "promo_clicked"
                                                                      })
                                                                })
}

function buildSiteQuery() {
      for (var a = url.replace(/^.*?:\/\/(.*?)\/.*$/, "$1").replace(/^(www\.)?(.*)/i, "$2"), b = "any:", c = ["http://", "https://", "http://www.", "https://www."], d = 0; d < c.length; d++) b += " sourceUrl:" + c[d] + a + "*";
          return b
}

function closeRatingsPrompt() {
      Browser.sendToExtension({
                name: "main_recordActivity"
            });
          Browser.sendToExtension({
                    name: "setPersistentValue",
                    key: userId + "_sawRatingsPrompt",
                    value: !0
                });
              selectSmartSection.call(tipsButton);
                  Browser.sendToExtension({
                            name: "trackEvent",
                            category: "Ratings",
                            action: "ratings_prompt_click",
                            label: "close"
                        })
}

function complete() {
      tokens = successResponse.tokens;
          noteGuid = successResponse.noteGuid;
              shardId = successResponse.shardId;
                  document.body.classList.add("done");
                      successResponse.noShareNotes && document.body.classList.add("noShare");
                          header.innerHTML = '<span id="status" title="' + successResponse.notebookName + '">' + Browser.i18n.getMessage("desktopNotification_clipUploaded", GlobalUtils.escapeXML(successResponse.notebookName)) + '</span><a id="title" title="' + title + '" target="_blank" href="' + GlobalUtils.getNoteURI(baseUrl, {
                                    shardId: shardId,
                                    noteGuid: noteGuid
                                          }, userId, tokens.authenticationToken) + '">' + GlobalUtils.escapeXML(title) + '</a><div id="reminders"></div>';
    document.getElementById("title").addEventListener("click", doNoteSuccessAction);
        reminderSetter = new ReminderSetter(document.getElementById("reminders"), tokens.submit, shardId, noteGuid, title, url, function() {
                  setHeight("100%")
              }, function() {
                        setHeight()
              }, function(a) {
                        a === ReminderSetter.REMINDER_TYPES.NO_DATE ? Browser.sendToExtension({
                                      name: "trackEvent",
                                      category: "Post-Clip",
                                      action: "added_reminder",
                                      label: "no_date"
                                  }) : a === ReminderSetter.REMINDER_TYPES.TOMORROW ? Browser.sendToExtension({
                                                name: "trackEvent",
                                              category: "Post-Clip",
                                              action: "added_reminder",
                                              label: "tomorrow"
                                            }) : a === ReminderSetter.REMINDER_TYPES.NEXT_WEEK ? Browser.sendToExtension({
                                                          name: "trackEvent",
                                                        category: "Post-Clip",
                                                        action: "added_reminder",
                                                        label: "next_week"
                                                      }) : a === ReminderSetter.REMINDER_TYPES.CUSTOM_DATE && Browser.sendToExtension({
                                                                    name: "trackEvent",
                                                                  category: "Post-Clip",
                                                                  action: "added_reminder",
                                                                  label: "custom_date"
                                                                })
                            });
            if (document.body.classList.contains("partial")) document.body.classList.contains("brief") && setTimeout(function() {
                      dismiss()
                  }, 3E3), setHeight();
                else {
                          setHeight("100%");
                                  successResponse.showRatings ? (tipsContainer.classList.add("ratings"), selectSmartSection.call(tipsButton), Browser.sendToExtension({
                                                    name: "setPersistentValue",
                                                    key: userId + "_successfulClipsCount",
                                                    value: 0
                                                }), Browser.sendToExtension({
                                                                  name: "trackEvent",
                                                                category: "Ratings",
                                                                action: "ratings_prompt_shown"
                                                              })) : successResponse.nearQuota ? (tipsContainer.classList.add("nearQuota"),
                                                                              premium ? (document.querySelector("#nearQuotaTip .tipDetails").innerText = Browser.i18n.getMessage("nearQuotaPremium"), nearQuotaButton.innerText = Browser.i18n.getMessage("getMoreSpacePremium")) : (document.querySelector("#nearQuotaTip .tipDetails").innerText = Browser.i18n.getMessage("nearQuotaFree"), nearQuotaButton.innerText = Browser.i18n.getMessage("upgradeToPremium")), selectSmartSection.call(tipsButton), Browser.sendToExtension({
                                                                                                    name: "setPersistentValueForUser",
                                                                                                  key: "shownNearQuotaUpsell",
                                                                                                  value: !0,
                                                                                                  userId: userId
                                                                                                }),
                                                                                              Browser.sendToExtension({
                                                                                                                    name: "trackEvent",
                                                                                                                  category: "Promotion",
                                                                                                                  action: "near_quota_promo",
                                                                                                                  label: "promo_shown"
                                                                                                                })) : successResponse.showReferral ? (tipsContainer.classList.add("referral"), selectSmartSection.call(tipsButton), Browser.sendToExtension({
                                                                                                                                  name: "addToPersistentValue",
                                                                                                                                key: userId + "_sawReferralCount",
                                                                                                                                delta: 1
                                                                                                                              }), Browser.sendToExtension({
                                                                                                                                                name: "setPersistentValue",
                                                                                                                                              key: userId + "_clipsCount_referral",
                                                                                                                                              value: 0
                                                                                                                                            }), Browser.sendToExtension({
                                                                                                                                                              name: "trackEvent",
                                                                                                                                                            category: "Promotion",
                                                                                                                                                            action: "refer_friend_promo",
                                                                                                                                                            label: "promo_shown"
                                                                                                                                                          })) :
                                                                                                                              successResponse.skitch ? (tipsContainer.classList.add("skitch"), selectSmartSection.call(tipsButton), Browser.sendToExtension({
                                                                                                                                                name: "addToPersistentValue",
                                                                                                                                              key: userId + "_skitchPromoShownCount",
                                                                                                                                              delta: 1
                                                                                                                                            }), Browser.sendToExtension({
                                                                                                                                                              name: "trackEvent",
                                                                                                                                                            category: "Promotion",
                                                                                                                                                            action: "skitch_promo",
                                                                                                                                                            label: "promo_shown"
                                                                                                                                                          })) : (tipsButton.style.display = "none", selectSmartSection.call(relatedNotesButton));
                                                                                                                                      for (var a in relatedNotesResponse.relatedNotes)
                                                                                                                                                    if (relatedNotesResponse.relatedNotes[a].guid === noteGuid) {
                                                                                                                                                                      relatedNotesResponse.relatedNotes[a].splice(a,
                                                                                                                                                                                              1);
                                                                                                                                                                                      break
                                                                                                                                                                                                    }(new HeroNoteSnippets(document.getElementById("relatedNotesContainer"), baseUrl, userId, tokens.authenticationToken, function(a) {
                                                                                                                                                                                                                      Browser.sendToExtension({
                                                                                                                                                                                                                                            name: "trackEvent",
                                                                                                                                                                                                                                            category: "Post-Clip",
                                                                                                                                                                                                                                            action: "view_related_notes",
                                                                                                                                                                                                                                            label: a + "_related_note",
                                                                                                                                                                                                                                            value: relatedNotesResponse.relatedNotes.length
                                                                                                                                                                                                                                        })
                                                                                                                                                                                                                                  })).setNotes(relatedNotesResponse.relatedNotes)
                                                                                                                                          }
}

function dismiss() {
      Browser.sendToExtension({
                name: "bounce",
              message: {
                            name: "hideClipResult"
                }
          })
}

function doNoteSuccessAction() {
      Browser.sendToExtension({
                name: "main_recordActivity"
            });
          Browser.sendToExtension({
                    name: "trackEvent",
                    category: "Post-Clip",
                    action: "open_in_evernote",
                    data: [{
                                  slot: Analytics.CD.EXPORT_TO_DB,
                        value: 1
                    }]
              })
}

function handleErrorClick() {
      if (this.classList.contains("upgradable")) {
                var a = "clipper-chrome";
                        SAFARI ? a = "clipper-safari" : OPERA ? a = "clipper-opera" : YANDEX && (a = "clipper-yandex");
                                var b;
                                        this.classList.contains("overQuota") ? (b = premium ? baseUrl + "/SetAuthToken.action?auth=" + encodeURIComponent(tokens.authenticationToken) + "&targetUrl=" + encodeURIComponent("/QuotaCheckout.action?origin=" + a + "&offer=overQuota") : baseUrl + "/SetAuthToken.action?auth=" + encodeURIComponent(tokens.authenticationToken) + "&targetUrl=" + encodeURIComponent("/Checkout.action?origin=" +
                                                              a + "&offer=overQuota"), Browser.sendToExtension({
                                                                                name: "trackEvent",
                                                                                category: "Promotion",
                                                                                action: "over_quota_promo",
                                                                                label: "promo_clicked"
                                                                            })) : this.classList.contains("noteSizeExceeded") ? (b = baseUrl + "/SetAuthToken.action?auth=" + encodeURIComponent(tokens.authenticationToken) + "&targetUrl=" + encodeURIComponent("/Checkout.action?origin=" + a + "&offer=maxNoteSize"), Browser.sendToExtension({
                                                                                              name: "trackEvent",
                                                                                            category: "Promotion",
                                                                                            action: "note_size_exceeded_promo",
                                                                                            label: "promo_clicked"
                                                                                          })) : this.classList.contains("nearQuota") &&
                                                                                                            (b = premium ? baseUrl + "/SetAuthToken.action?auth=" + encodeURIComponent(tokens.authenticationToken) + "&targetUrl=" + encodeURIComponent("/QuotaCheckout.action?origin=" + a + "&offer=nearQuota") : baseUrl + "/SetAuthToken.action?auth=" + encodeURIComponent(tokens.authenticationToken) + "&targetUrl=" + encodeURIComponent("/Checkout.action?origin=" + a + "&offer=nearQuota"), Browser.sendToExtension({
                                                                                                                              name: "trackEvent",
                                                                                                                              category: "Promotion",
                                                                                                                              action: "near_quota_promo",
                                                                                                                              label: "promo_clicked"
                                                                                                                          }));
                                                                                                                    Browser.sendToExtension({
                                                                                                                                  name: "main_openWindow",
                                                                                                                                  width: 800,
                                                                                                                                  height: 600,
                                                                                                                                  url: b
                                                                                                                              })
                                                                                                                        } else dismiss()
}

function handleFailure(a, b, c) {
      document.body.className = "error";
          errorTitle.innerText = Browser.i18n.getMessage("cannotSaveClip");
              tokens = a.tokens;
                  switch (a.error) {
                            case "overQuota":
                                          premium ? (errorDetails.innerText = Browser.i18n.getMessage("notification_quotaExceededPremium"), errorButton.innerText = Browser.i18n.getMessage("getMoreSpacePremium")) : (errorDetails.innerText = Browser.i18n.getMessage("notification_quotaExceededFree"), errorButton.innerText = Browser.i18n.getMessage("upgradeToPremium"));
                                                      errorButton.className +=
                                                                        " upgradable overQuota";
                                                                  Browser.sendToExtension({
                                                                                    name: "trackEvent",
                                                                                    category: "Promotion",
                                                                                    action: "over_quota_promo",
                                                                                    label: "promo_shown"
                                                                                });
                                                                              break;
                                                                                      case "noteSizeExceeded":
                                                                                          premium ? (errorDetails.innerText = Browser.i18n.getMessage("noteSizeExceededPremium"), errorButton.className = errorButton.className.replace(/\s*upgradable/g, ""), errorButton.innerText = Browser.i18n.getMessage("ok")) : (errorDetails.innerText = Browser.i18n.getMessage("noteSizeExceededFree"), errorButton.className += " upgradable noteSizeExceeded",
                                                                                                              errorButton.innerText = Browser.i18n.getMessage("upgradeToPremium"), Browser.sendToExtension({
                                                                                                                                    name: "trackEvent",
                                                                                                                                  category: "Promotion",
                                                                                                                                  action: "note_size_exceeded_promo",
                                                                                                                                  label: "promo_shown"
                                                                                                                                }));
                                                                                                      break;
                                                                                                              default:
                                                                                                                  SAFARI || (errorDetails.innerHTML = "<a id='logLink' target='_blank' href='" + Browser.extension.getURL("logs.html") + "'>" + Browser.i18n.getMessage("viewCrashReport") + "</a>")
                                                                                                                        }
                      setHeight()
}

function handleRelatedNotesClick() {
      Browser.sendToExtension({
                name: "main_recordActivity"
            });
          document.querySelector("#slider").className = document.querySelector("#slider").className.replace(/show\w+/g, "") + " showLeft";
              var a = document.querySelector("#siteSearchButton").className;
                  document.querySelector("#siteSearchButton").className = a.replace(/(^|\s+)selected($|\s+)/, "");
                      document.querySelector("#relatedNotesButton").className = "selected"
}

function handleSuccess(a, b, c) {
      success = !0;
          successResponse = a;
              Browser.sendToExtension({
                        name: "trackTiming",
                        category: "Clip",
                        variableName: "syncing",
                        time: new Date - startTime
                    });
                  receivedRelatedNotes && complete()
}

function initialize(a, b, c) {
      title = a.title;
          header.innerHTML = Browser.i18n.getMessage("contentclipper_clipping", [GlobalUtils.escapeXML(title)]);
              setTitleMaxWidth();
                  url = a.url;
                      baseUrl = a.baseUrl;
                          skitchButton.href = baseUrl + "/skitch";
                              /china/i.test(a.locale) && document.body.classList.add("china");
                                  userId = a.userId;
                                      premium = a.premium;
                                          sameSiteNotesButton.innerText = Browser.i18n.getMessage("clipsFromThisSite", url.replace(/^https?:\/\/(?:www\.)?(.*?)\/.*/, "$1"));
                                              "postClipShowFull" === a.afterClip ? Browser.sendToExtension({
                                                        name: "getRelatedNotes",
                                                        pendingNoteKey: a.pendingNoteKey,
                                                        recText: a.recText
                                                    }) : (document.body.classList.add("partial"), relatedNotesResponse = {
                                                              relatedNotes: []
                                                          }, receivedRelatedNotes = !0, "postClipShowNothing" === a.afterClip && document.body.classList.add("brief"));
                                                  setHeight()
}

function openFeedbackForm() {
      Browser.sendToExtension({
                name: "main_recordActivity"
            });
          Browser.sendToExtension({
                    name: "setPersistentValue",
                    key: userId + "_sawRatingsPrompt",
                    value: !0
                });
              Browser.sendToExtension({
                        name: "bounce",
                        message: {
                                      name: "showFeedbackForm"
                        }
                  });
                  Browser.sendToExtension({
                            name: "trackEvent",
                            category: "Ratings",
                            action: "ratings_prompt_click",
                            label: "send_feedback"
                        });
                      dismiss()
}

function receiveRelatedNotes(a, b, c) {
      receivedRelatedNotes = !0;
          relatedNotesResponse = a;
              success && complete()
}

function receiveSameSiteNotes(a, b, c) {
      a.notes.list.length && noteGuid === a.notes.list[0].guid && a.notes.list.shift();
          (new HeroNoteSnippets(document.getElementById("sameSiteNotesContainer"), baseUrl, userId, tokens.authenticationToken, function(b) {
                    Browser.sendToExtension({
                                  name: "trackEvent",
                                  category: "Post-Clip",
                                  action: "view_related_notes",
                                  label: b + "_same_site_note",
                                  value: a.notes.list.length
                              })
                        })).setNotes(a.notes.list, !0, !0);
              setHeight()
}

function selectSmartSection() {
      var a = this;
          "tips" !== a.id || smart.classList.toggle(a.id) || (a = relatedNotesButton, tipsContainer.classList.contains("ratings") && Browser.sendToExtension({
                    name: "trackEvent",
                    category: "Ratings",
                    action: "ratings_prompt_click",
                    label: "close"
                }));
              if ("tips" !== a.id) {
                        var b = document.querySelector("h2.pressed");
                                b && b.classList.remove("pressed");
                                        a.classList.add("pressed");
                                                smart.classList.remove("relatedNotes", "sameSiteNotes");
                                                        smart.classList.add(a.id)
                                                              }
                  "sameSiteNotes" !== a.id || siteNotesRequested ||
                            (Browser.sendToExtension({
                                          name: "getSameSiteNotes",
                                          resultSpec: {
                                                            includeAttributes: !0,
                                              includeTitle: !0,
                                              includeUpdated: !0
                                          },
                                          noteFilter: {
                                                            order: 2,
                                              words: buildSiteQuery()
                                          }
                                    }), siteNotesRequested = !0)
}

function setHeight(a) {
      if (a) Browser.sendToExtension({
                name: "bounce",
                 message: {
                               name: "setClipResultHeight",
                     height: a
                }
          });
          else {
                    a = main.offsetHeight;
                            var b = (main.offsetHeight - main.clientHeight) / 2;
                                    Browser.sendToExtension({
                                                  name: "bounce",
                                                  message: {
                                                                    name: "setClipResultHeight",
                                                      height: main.offsetHeight + Math.max(reminderSetter ? reminderSetter.height - (a - reminderSetter.top - b) : 0, 0)
                                                  }
                                            })
                                        }
}

function setTitleMaxWidth() {
      if ("title" === header.firstElementChild.id) {
                var a = document.createElement("style");
                        a.innerText = "#title:first-child { max-width: " + (header.clientWidth - 70 - header.lastElementChild.clientWidth) + "px; }";
                                document.head.appendChild(a);
                                        header.firstElementChild.nextSibling.nodeType === HTMLElement.TEXT_NODE && header.removeChild(header.firstElementChild.nextSibling)
                                              }
}

function shareNote() {
    var a = {
        linkedin: {
            width: 520,
            height: 570
        },
        weibo: {
            width: 650,
            height: 650
        },
        facebook: {
            width: 626,
            height: 436
        },
        twitter: {
            width: 550,
            height: 420
        },
        gplus: {
            width: 600,
            height: 600
        },
        email: {
            width: 452,
            height: 308
        },
        url: {
            width: 452,
            height: 198
        }
    };
    Browser.sendToExtension({
        name: "main_openWindow",
        width: a[this.id].width,
        height: a[this.id].height,
        url: Browser.extension.getURL("content/clip_result/sharing.html") + "?title=" + encodeURIComponent(title) + "&guid=" + noteGuid + "&shareType=" + this.id + "&token=" + tokens.submit + "&shared=" +
        tokens.shared + "&width=" + a[this.id].width + "&height=" + a[this.id].height,
        type: "popup"
    });
    Browser.sendToExtension({
        name: "trackEvent",
        category: "Share",
        action: "share_menu",
        label: "email" === this.id ? "email_started" : this.id
    })
}

function showSyncing() {
      Browser.sendToExtension({
                name: "trackTiming",
              category: "Clip",
              variableName: "clipping",
              time: new Date - startTime
            });
          startTime = new Date;
              header.innerHTML = Browser.i18n.getMessage("contentclipper_syncing", [title]);
                  setTitleMaxWidth();
                      setHeight()
}
window.addEventListener("DOMContentLoaded", function() {
      SAFARI && document.body.classList.add("safari");
          main = document.getElementById("main");
              header = document.getElementById("header");
                  for (var a = document.getElementsByClassName("shareOpt"), b = 0; b < a.length; b++) a[b].addEventListener("click", shareNote);
                      closeButton = document.getElementById("close");
                          smart = document.getElementById("smart");
                              smartPanel = document.getElementById("smartPanel");
                                  relatedNotesButton = document.getElementById("relatedNotes");
                                      sameSiteNotesButton =
          document.getElementById("sameSiteNotes");
    tipsButton = document.getElementById("tips");
        errorTitle = document.querySelector("#errorTitle");
            errorDetails = document.querySelector("#errorDetails");
                errorButton = document.querySelector("#errorButton");
                    tipsContainer = document.querySelector("#tipsContainer");
                        rateNowButton = document.getElementById("rateNow");
                            sendFeedbackButton = document.getElementById("sendFeedback");
                                closeRatingsPromptButton = document.querySelector("#closeRatingsPrompt");
                                    nearQuotaButton = document.querySelector("#nearQuotaTip .button");
                                        referralButton = document.getElementById("referralCTA");
                                            skitchButton = document.querySelector("#skitchTip .button");
                                                GlobalUtils.localize(document.body);
                                                    OPERA && (rateNowButton.href = "https://addons.opera.com/en/extensions/details/evernote-web-clipper/");
                                                        addHandlers();
                                                            setHeight();
                                                                startTime = new Date
});
Browser.addMessageHandlers({
      cr_initialize: initialize,
      cr_receiveRelatedNotes: receiveRelatedNotes,
      cr_receiveSameSiteNotes: receiveSameSiteNotes,
      handleFailure: handleFailure,
      handleSuccess: handleSuccess,
      showSyncing: showSyncing
});
document.addEventListener("keyup", function(a) {
      a && a.keyCode && 27 == a.keyCode && dismiss()
});
