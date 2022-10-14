/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/
 */

/* eslint max-nested-callbacks: ["warn", 12] */

/**
 * Tests that history navigation works for the add-ons manager.
 */

// Request a longer timeout, because this tests run twice
// (once on XUL views and once on the HTML views).
requestLongerTimeout(4);

const { AddonTestUtils } = ChromeUtils.import(
  "resource://testing-common/AddonTestUtils.jsm"
);

AddonTestUtils.initMochitest(this);

const MAIN_URL = `https://example.com/${RELATIVE_DIR}discovery.html`;
const SECOND_URL = `https://example.com/${RELATIVE_DIR}releaseNotes.xhtml`;
const DISCOAPI_URL = `http://example.com/${RELATIVE_DIR}/discovery/api_response_empty.json`;

// Clearing this pref is currently done from a cleanup function registered
// by the head.js file.
Services.prefs.setCharPref(PREF_DISCOVERURL, MAIN_URL);

var gProvider = new MockProvider();
gProvider.createAddons([
  {
    id: "test1@tests.mozilla.org",
    name: "Test add-on 1",
    description: "foo",
  },
  {
    id: "test2@tests.mozilla.org",
    name: "Test add-on 2",
    description: "bar",
  },
  {
    id: "test3@tests.mozilla.org",
    name: "Test add-on 3",
    type: "theme",
    description: "bar",
  },
]);

var gLoadCompleteCallback = null;

var gProgressListener = {
  onStateChange(aWebProgress, aRequest, aStateFlags, aStatus) {
    // Only care about the network stop status events
    if (
      !(aStateFlags & Ci.nsIWebProgressListener.STATE_IS_NETWORK) ||
      !(aStateFlags & Ci.nsIWebProgressListener.STATE_STOP)
    ) {
      return;
    }

    if (gLoadCompleteCallback) {
      executeSoon(gLoadCompleteCallback);
    }
    gLoadCompleteCallback = null;
  },

  onLocationChange() {},
  onSecurityChange() {},
  onProgressChange() {},
  onStatusChange() {},
  onContentBlockingEvent() {},

  QueryInterface: ChromeUtils.generateQI([
    Ci.nsIWebProgressListener,
    Ci.nsISupportsWeakReference,
  ]),
};

function waitForLoad(aManager, aCallback) {
  let promise = new Promise(resolve => {
    var browser = aManager.document.getElementById("discover-browser");
    browser.addProgressListener(gProgressListener);

    gLoadCompleteCallback = function() {
      browser.removeProgressListener(gProgressListener);
      resolve();
    };
  });
  if (aCallback) {
    promise.then(aCallback);
  }
  return promise;
}

function clickLink(aManager, aId, aCallback) {
  let promise = new Promise(async resolve => {
    waitForLoad(aManager, resolve);

    var browser = aManager.document.getElementById("discover-browser");

    var link = browser.contentDocument.getElementById(aId);
    EventUtils.sendMouseEvent({ type: "click" }, link);
  });
  if (aCallback) {
    promise.then(aCallback);
  }
  return promise;
}

function go_back() {
  gBrowser.goBack();
}

function go_back_backspace() {
  EventUtils.synthesizeKey("KEY_Backspace");
}

function go_forward_backspace() {
  EventUtils.synthesizeKey("KEY_Backspace", { shiftKey: true });
}

function go_forward() {
  gBrowser.goForward();
}

function check_state(canGoBack, canGoForward) {
  is(gBrowser.canGoBack, canGoBack, "canGoBack should be correct");
  is(gBrowser.canGoForward, canGoForward, "canGoForward should be correct");
}

function is_in_list(aManager, view, canGoBack, canGoForward) {
  var doc = aManager.document;

  is(
    doc.getElementById("categories").selectedItem.value,
    view,
    "Should be on the right category"
  );

  if (aManager.useHtmlViews) {
    is(
      get_current_view(aManager).id,
      "html-view",
      "the current view should be set to the HTML about:addons browser"
    );
    const doc = aManager.getHtmlBrowser().contentDocument;
    ok(
      doc.querySelector("addon-list"),
      "Got a list-view in the HTML about:addons browser"
    );
  } else {
    is(
      get_current_view(aManager).id,
      "list-view",
      "Should be on the right view"
    );
  }

  check_state(canGoBack, canGoForward);
}

function is_in_detail(aManager, view, canGoBack, canGoForward) {
  var doc = aManager.document;

  is(
    doc.getElementById("categories").selectedItem.value,
    view,
    "Should be on the right category"
  );

  if (aManager.useHtmlViews) {
    is(
      get_current_view(aManager).id,
      "html-view",
      "the current view should be set to the HTML about:addons browser"
    );
    const doc = aManager.getHtmlBrowser().contentDocument;
    is(
      doc.querySelectorAll("addon-card").length,
      1,
      "Got a detail-view in the HTML about:addons browser"
    );
  } else {
    is(
      get_current_view(aManager).id,
      "detail-view",
      "Should be on the right view"
    );
  }

  check_state(canGoBack, canGoForward);
}

function is_in_discovery(aManager, url, canGoBack, canGoForward) {
  if (
    Services.prefs.getBoolPref("extensions.htmlaboutaddons.discover.enabled")
  ) {
    is(
      get_current_view(aManager).id,
      "html-view",
      "the current view should be set to the HTML about:addons browser"
    );
    const doc = aManager.getHtmlBrowser().contentDocument;
    ok(
      doc.querySelector("discovery-pane"),
      "Got a discovery panel in the HTML about:addons browser"
    );
  } else {
    var browser = aManager.document.getElementById("discover-browser");

    is(
      aManager.document.getElementById("discover-view").selectedPanel,
      browser,
      "Browser should be visible"
    );

    var spec = browser.currentURI.spec;
    var pos = spec.indexOf("#");
    if (pos != -1) {
      spec = spec.substring(0, pos);
    }

    is(spec, url, "Should have loaded the right url");
  }

  check_state(canGoBack, canGoForward);
}

async function expand_addon_element(aManager, aId) {
  var addon = get_addon_element(aManager, aId);
  if (aManager.useHtmlViews) {
    addon.click();
  } else {
    addon.parentNode.ensureElementIsVisible(addon);
    EventUtils.synthesizeMouseAtCenter(addon, { clickCount: 1 }, aManager);
    EventUtils.synthesizeMouseAtCenter(addon, { clickCount: 2 }, aManager);
  }
}

function wait_for_page_show(browser) {
  let promise = new Promise(resolve => {
    let removeFunc;
    let listener = () => {
      removeFunc();
      resolve();
    };
    removeFunc = BrowserTestUtils.addContentEventListener(
      browser,
      "pageshow",
      listener,
      false,
      event => event.target.location == "http://example.com/",
      false,
      false
    );
  });
  return promise;
}

async function runTestOnPrefEnvs(prefEnvs, testFn) {
  for (const [message, prefEnv] of prefEnvs) {
    info(`${message}: ${JSON.stringify(prefEnv)}`);
    await SpecialPowers.pushPrefEnv(prefEnv);
    await testFn();
    await SpecialPowers.popPrefEnv();
  }
}

// Tests simple forward and back navigation and that the right heading and
// category is selected
add_task(async function test_navigate_history() {
  await runTestOnPrefEnvs(
    [
      [
        "Test on XUL about:addons",
        {
          set: [["extensions.htmlaboutaddons.enabled", false]],
        },
      ],
      [
        "Test on HTML about:addons",
        {
          set: [["extensions.htmlaboutaddons.enabled", true]],
        },
      ],
    ],
    async () => {
      let aManager = await open_manager("addons://list/extension");
      info("Part 1");
      is_in_list(aManager, "addons://list/extension", false, false);

      EventUtils.synthesizeMouseAtCenter(
        aManager.document.getElementById("category-plugin"),
        {},
        aManager
      );

      aManager = await wait_for_view_load(aManager);
      info("Part 2");
      is_in_list(aManager, "addons://list/plugin", true, false);

      go_back();

      aManager = await wait_for_view_load(aManager);
      info("Part 3");
      is_in_list(aManager, "addons://list/extension", false, true);

      go_forward();

      aManager = await wait_for_view_load(aManager);
      info("Part 4");
      is_in_list(aManager, "addons://list/plugin", true, false);

      go_back();

      aManager = await wait_for_view_load(aManager);
      info("Part 5");
      is_in_list(aManager, "addons://list/extension", false, true);

      await expand_addon_element(aManager, "test1@tests.mozilla.org");

      aManager = await wait_for_view_load(aManager);
      info("Part 6");
      is_in_detail(aManager, "addons://list/extension", true, false);

      go_back();

      aManager = await wait_for_view_load(aManager);
      info("Part 7");
      is_in_list(aManager, "addons://list/extension", false, true);

      await close_manager(aManager);
    }
  );
});

// Tests that browsing to the add-ons manager from a website and going back works
add_task(async function test_navigate_between_webpage_and_aboutaddons() {
  await runTestOnPrefEnvs(
    [
      [
        "Test on XUL about:addons",
        {
          set: [["extensions.htmlaboutaddons.enabled", false]],
        },
      ],
      [
        "Test on HTML about:addons",
        {
          set: [["extensions.htmlaboutaddons.enabled", true]],
        },
      ],
    ],
    async () => {
      info("Part 1");
      await BrowserTestUtils.openNewForegroundTab(
        gBrowser,
        "http://example.com/",
        true,
        true
      );

      info("Part 2");
      ok(!gBrowser.canGoBack, "Should not be able to go back");
      ok(!gBrowser.canGoForward, "Should not be able to go forward");

      await BrowserTestUtils.loadURI(gBrowser.selectedBrowser, "about:addons");
      await BrowserTestUtils.browserLoaded(gBrowser.selectedBrowser);

      let manager = await wait_for_manager_load(gBrowser.contentWindow);

      info("Part 3");
      is_in_list(manager, "addons://list/extension", true, false);

      // XXX: This is less than ideal, as it's currently difficult to deal with
      // the browser frame switching between remote/non-remote in e10s mode.
      let promiseLoaded;
      if (gMultiProcessBrowser) {
        promiseLoaded = BrowserTestUtils.browserLoaded(
          gBrowser.selectedBrowser
        );
      } else {
        promiseLoaded = BrowserTestUtils.waitForEvent(
          gBrowser.selectedBrowser,
          "pageshow"
        );
      }

      go_back(manager);
      await promiseLoaded;

      info("Part 4");
      is(
        gBrowser.currentURI.spec,
        "http://example.com/",
        "Should be showing the webpage"
      );
      ok(!gBrowser.canGoBack, "Should not be able to go back");
      ok(gBrowser.canGoForward, "Should be able to go forward");

      promiseLoaded = BrowserTestUtils.browserLoaded(gBrowser.selectedBrowser);
      go_forward(manager);
      await promiseLoaded;

      manager = gBrowser.selectedBrowser.contentWindow;
      info("Part 5");
      is_in_list(manager, "addons://list/extension", true, false);

      await close_manager(manager);
    }
  );
});

// Tests simple forward and back navigation and that the right heading and
// category is selected -- Keyboard navigation [Bug 565359]
// Only add the test if the backspace key navigates back and addon-manager
// loaded in a tab
add_task(async function test_keyboard_history_navigation() {
  if (Services.prefs.getIntPref("browser.backspace_action") != 0) {
    info("Test skipped on browser.backspace_action != 0");
    return;
  }

  await runTestOnPrefEnvs(
    [
      [
        "Test on XUL about:addons",
        {
          set: [["extensions.htmlaboutaddons.enabled", false]],
        },
      ],
      [
        "Test on HTML about:addons",
        {
          set: [["extensions.htmlaboutaddons.enabled", true]],
        },
      ],
    ],
    async () => {
      let aManager = await open_manager("addons://list/extension");
      info("Part 1");
      is_in_list(aManager, "addons://list/extension", false, false);

      EventUtils.synthesizeMouseAtCenter(
        aManager.document.getElementById("category-plugin"),
        {},
        aManager
      );

      aManager = await wait_for_view_load(aManager);
      info("Part 2");
      is_in_list(aManager, "addons://list/plugin", true, false);

      go_back_backspace();

      aManager = await wait_for_view_load(aManager);
      info("Part 3");
      is_in_list(aManager, "addons://list/extension", false, true);

      go_forward_backspace();

      aManager = await wait_for_view_load(aManager);
      info("Part 4");
      is_in_list(aManager, "addons://list/plugin", true, false);

      go_back_backspace();

      aManager = await wait_for_view_load(aManager);
      info("Part 5");
      is_in_list(aManager, "addons://list/extension", false, true);

      await expand_addon_element(aManager, "test1@tests.mozilla.org");

      aManager = await wait_for_view_load(aManager);
      info("Part 6");
      is_in_detail(aManager, "addons://list/extension", true, false);

      go_back_backspace();

      aManager = await wait_for_view_load(aManager);
      info("Part 7");
      is_in_list(aManager, "addons://list/extension", false, true);

      await close_manager(aManager);
    }
  );
});

// Tests that opening a custom first view only stores a single history entry
add_task(async function test_single_history_entry() {
  await runTestOnPrefEnvs(
    [
      [
        "Test on XUL about:addons",
        {
          set: [["extensions.htmlaboutaddons.enabled", false]],
        },
      ],
      [
        "Test on HTML about:addons",
        {
          set: [["extensions.htmlaboutaddons.enabled", true]],
        },
      ],
    ],
    async () => {
      let aManager = await open_manager("addons://list/plugin");
      info("Part 1");
      is_in_list(aManager, "addons://list/plugin", false, false);

      EventUtils.synthesizeMouseAtCenter(
        aManager.document.getElementById("category-extension"),
        {},
        aManager
      );

      aManager = await wait_for_view_load(aManager);
      info("Part 2");
      is_in_list(aManager, "addons://list/extension", true, false);

      go_back();

      aManager = await wait_for_view_load(aManager);
      info("Part 3");
      is_in_list(aManager, "addons://list/plugin", false, true);

      await close_manager(aManager);
    }
  );
});

// Tests that opening a view while the manager is already open adds a new
// history entry
add_task(async function test_new_history_entry_while_opened() {
  await runTestOnPrefEnvs(
    [
      [
        "Test on XUL about:addons",
        {
          set: [["extensions.htmlaboutaddons.enabled", false]],
        },
      ],
      [
        "Test on HTML about:addons",
        {
          set: [["extensions.htmlaboutaddons.enabled", true]],
        },
      ],
    ],
    async () => {
      let aManager = await open_manager("addons://list/extension");
      info("Part 1");
      is_in_list(aManager, "addons://list/extension", false, false);

      aManager.loadView("addons://list/plugin");

      aManager = await wait_for_view_load(aManager);
      info("Part 2");
      is_in_list(aManager, "addons://list/plugin", true, false);

      go_back();

      aManager = await wait_for_view_load(aManager);
      info("Part 3");
      is_in_list(aManager, "addons://list/extension", false, true);

      go_forward();

      aManager = await wait_for_view_load(aManager);
      info("Part 4");
      is_in_list(aManager, "addons://list/plugin", true, false);

      await close_manager(aManager);
    }
  );
});

// Tests than navigating to a website and then going back returns to the
// previous view
add_task(async function test_navigate_back_from_website() {
  await runTestOnPrefEnvs(
    [
      [
        "Test on XUL about:addons",
        {
          set: [
            ["extensions.htmlaboutaddons.enabled", false],
            ["security.allow_eval_with_system_principal", true],
          ],
        },
      ],
      [
        "Test on HTML about:addons",
        {
          set: [
            ["extensions.htmlaboutaddons.enabled", true],
            ["security.allow_eval_with_system_principal", true],
          ],
        },
      ],
    ],
    async () => {
      let aManager = await open_manager("addons://list/plugin");
      info("Part 1");
      is_in_list(aManager, "addons://list/plugin", false, false);

      BrowserTestUtils.loadURI(gBrowser, "http://example.com/");
      await wait_for_page_show(gBrowser.selectedBrowser);

      info("Part 2");

      await new Promise(resolve =>
        executeSoon(function() {
          ok(gBrowser.canGoBack, "Should be able to go back");
          ok(!gBrowser.canGoForward, "Should not be able to go forward");

          go_back();

          gBrowser.addEventListener("pageshow", async function listener(event) {
            if (event.target.location != "about:addons") {
              return;
            }
            gBrowser.removeEventListener("pageshow", listener);

            aManager = await wait_for_view_load(
              gBrowser.contentWindow.wrappedJSObject
            );
            info("Part 3");
            is_in_list(aManager, "addons://list/plugin", false, true);

            executeSoon(() => go_forward());
            wait_for_page_show(gBrowser.selectedBrowser).then(() => {
              info("Part 4");

              executeSoon(function() {
                ok(gBrowser.canGoBack, "Should be able to go back");
                ok(!gBrowser.canGoForward, "Should not be able to go forward");

                go_back();

                gBrowser.addEventListener("pageshow", async function listener(
                  event
                ) {
                  if (event.target.location != "about:addons") {
                    return;
                  }
                  gBrowser.removeEventListener("pageshow", listener);
                  aManager = await wait_for_view_load(
                    gBrowser.contentWindow.wrappedJSObject
                  );
                  info("Part 5");
                  is_in_list(aManager, "addons://list/plugin", false, true);

                  resolve();
                });
              });
            });
          });
        })
      );

      await close_manager(aManager);
    }
  );
});

// Tests that refreshing a list view does not affect the history
add_task(async function test_refresh_listview_donot_add_history_entries() {
  await runTestOnPrefEnvs(
    [
      [
        "Test on XUL about:addons",
        {
          set: [["extensions.htmlaboutaddons.enabled", false]],
        },
      ],
      [
        "Test on HTML about:addons",
        {
          set: [["extensions.htmlaboutaddons.enabled", true]],
        },
      ],
    ],
    async () => {
      let aManager = await open_manager("addons://list/extension");
      info("Part 1");
      is_in_list(aManager, "addons://list/extension", false, false);

      EventUtils.synthesizeMouseAtCenter(
        aManager.document.getElementById("category-plugin"),
        {},
        aManager
      );

      aManager = await wait_for_view_load(aManager);
      info("Part 2");
      is_in_list(aManager, "addons://list/plugin", true, false);

      await new Promise(resolve => {
        gBrowser.reload();
        gBrowser.addEventListener("pageshow", async function listener(event) {
          if (event.target.location != "about:addons") {
            return;
          }
          gBrowser.removeEventListener("pageshow", listener);

          aManager = await wait_for_view_load(
            gBrowser.contentWindow.wrappedJSObject
          );
          info("Part 3");
          is_in_list(aManager, "addons://list/plugin", true, false);

          go_back();
          aManager = await wait_for_view_load(aManager);
          info("Part 4");
          is_in_list(aManager, "addons://list/extension", false, true);
          resolve();
        });
      });

      await close_manager(aManager);
    }
  );
});

// Tests that refreshing a detail view does not affect the history
add_task(async function test_refresh_detailview_donot_add_history_entries() {
  await runTestOnPrefEnvs(
    [
      [
        "Test on XUL about:addons",
        {
          set: [["extensions.htmlaboutaddons.enabled", false]],
        },
      ],
      [
        "Test on HTML about:addons",
        {
          set: [["extensions.htmlaboutaddons.enabled", true]],
        },
      ],
    ],
    async () => {
      let aManager = await open_manager(null);
      info("Part 1");
      is_in_list(aManager, "addons://list/extension", false, false);

      await expand_addon_element(aManager, "test1@tests.mozilla.org");

      aManager = await wait_for_view_load(aManager);
      info("Part 2");
      is_in_detail(aManager, "addons://list/extension", true, false);

      await new Promise(resolve => {
        gBrowser.reload();
        gBrowser.addEventListener("pageshow", async function listener(event) {
          if (event.target.location != "about:addons") {
            return;
          }
          gBrowser.removeEventListener("pageshow", listener);

          aManager = await wait_for_view_load(
            gBrowser.contentWindow.wrappedJSObject
          );
          info("Part 3");
          is_in_detail(aManager, "addons://list/extension", true, false);

          go_back();
          aManager = await wait_for_view_load(aManager);
          info("Part 4");
          is_in_list(aManager, "addons://list/extension", false, true);
          resolve();
        });
      });

      await close_manager(aManager);
    }
  );
});

// Tests that removing an extension from the detail view goes back and doesn't
// allow you to go forward again.
add_task(async function test_history_on_detailview_extension_removed() {
  await runTestOnPrefEnvs(
    [
      [
        "Test on XUL about:addons",
        {
          set: [["extensions.htmlaboutaddons.enabled", false]],
        },
      ],
      [
        "Test on HTML about:addons",
        {
          set: [["extensions.htmlaboutaddons.enabled", true]],
        },
      ],
    ],
    async () => {
      let aManager = await open_manager("addons://list/extension");

      info("Part 1");
      is_in_list(aManager, "addons://list/extension", false, false);

      await expand_addon_element(aManager, "test1@tests.mozilla.org");

      aManager = await wait_for_view_load(aManager);
      info("Part 2");
      is_in_detail(aManager, "addons://list/extension", true, false);

      if (aManager.useHtmlViews) {
        const doc = aManager.getHtmlBrowser().contentDocument;
        const addonCard = doc.querySelector(
          'addon-card[addon-id="test1@tests.mozilla.org"]'
        );
        const promptService = mockPromptService();
        promptService._response = 0;
        addonCard.querySelector("[action=remove]").click();
      } else {
        EventUtils.synthesizeMouseAtCenter(
          aManager.document.getElementById("detail-uninstall-btn"),
          {},
          aManager
        );
      }

      await wait_for_view_load(aManager);
      is_in_list(aManager, "addons://list/extension", true, false);

      const addon = await AddonManager.getAddonByID("test1@tests.mozilla.org");
      addon.cancelUninstall();

      await close_manager(aManager);
    }
  );
});

// Tests that opening the manager opens the last view
add_task(async function test_open_last_view() {
  await runTestOnPrefEnvs(
    [
      [
        "Test on XUL about:addons",
        {
          set: [["extensions.htmlaboutaddons.enabled", false]],
        },
      ],
      [
        "Test on HTML about:addons",
        {
          set: [["extensions.htmlaboutaddons.enabled", true]],
        },
      ],
    ],
    async () => {
      let aManager = await open_manager("addons://list/plugin");
      info("Part 1");
      is_in_list(aManager, "addons://list/plugin", false, false);

      await close_manager(aManager);
      aManager = await open_manager(null);
      info("Part 2");
      is_in_list(aManager, "addons://list/plugin", false, false);

      await close_manager(aManager);
    }
  );
});

// Tests that navigating the discovery page works when that was the first view
add_task(async function test_discopane_first_history_entry() {
  await runTestOnPrefEnvs(
    [
      [
        "Test on XUL about:addons",
        {
          set: [
            ["extensions.htmlaboutaddons.enabled", false],
            ["extensions.htmlaboutaddons.discover.enabled", false],
          ],
        },
      ],
      [
        "Test on HTML about:addons",
        {
          set: [
            ["extensions.htmlaboutaddons.enabled", true],
            ["extensions.htmlaboutaddons.discover.enabled", true],
            ["extensions.getAddons.discovery.api_url", DISCOAPI_URL],
          ],
        },
      ],
    ],
    async () => {
      let aManager = await open_manager("addons://discover/");
      info("1");
      is_in_discovery(aManager, MAIN_URL, false, false);

      let waitLoaded;
      const isLegacyDiscoPane = !Services.prefs.getBoolPref(
        "extensions.htmlaboutaddons.discover.enabled"
      );

      if (isLegacyDiscoPane) {
        // This is a test for an old version of the discovery panel that was actually
        // navigating links, skip if using the HTML about:addons.
        await clickLink(aManager, "link-good");
        info("2");
        is_in_discovery(aManager, SECOND_URL, true, false);

        waitLoaded = waitForLoad(aManager);
        // Execute go_back only after waitForLoad() has had a chance to setup
        // its listeners.
        executeSoon(go_back);
        info("3");
        await waitLoaded;
        is_in_discovery(aManager, MAIN_URL, false, true);

        // Execute go_forward only after waitForLoad() has had a chance to setup
        // its listeners.
        waitLoaded = waitForLoad(aManager);
        executeSoon(go_forward);

        await waitLoaded;
        is_in_discovery(aManager, SECOND_URL, true, false);
      }

      EventUtils.synthesizeMouseAtCenter(
        aManager.document.getElementById("category-plugin"),
        {},
        aManager
      );

      aManager = await wait_for_view_load(aManager);
      is_in_list(aManager, "addons://list/plugin", true, false);

      if (isLegacyDiscoPane) {
        go_back();

        aManager = await wait_for_view_load(aManager);
        is_in_discovery(aManager, SECOND_URL, true, true);

        waitLoaded = waitForLoad(aManager);
      }

      go_back();
      await waitLoaded;
      aManager = await wait_for_view_load(aManager);

      is_in_discovery(aManager, MAIN_URL, false, true);

      await close_manager(aManager);
    }
  );
});

// Tests that navigating the discovery page works when that was the second view
add_task(async function test_discopane_second_history_entry() {
  await runTestOnPrefEnvs(
    [
      [
        "Test on XUL about:addons",
        {
          set: [
            ["extensions.htmlaboutaddons.enabled", false],
            ["extensions.htmlaboutaddons.discover.enabled", false],
          ],
        },
      ],
      [
        "Test on HTML about:addons",
        {
          set: [
            ["extensions.htmlaboutaddons.enabled", true],
            ["extensions.htmlaboutaddons.discover.enabled", true],
            ["extensions.getAddons.discovery.api_url", DISCOAPI_URL],
          ],
        },
      ],
    ],
    async () => {
      let aManager = await open_manager("addons://list/plugin");
      is_in_list(aManager, "addons://list/plugin", false, false);

      EventUtils.synthesizeMouseAtCenter(
        aManager.document.getElementById("category-discover"),
        {},
        aManager
      );

      aManager = await wait_for_view_load(aManager);
      is_in_discovery(aManager, MAIN_URL, true, false);

      const isLegacyDiscoPane = !Services.prefs.getBoolPref(
        "extensions.htmlaboutaddons.discover.enabled"
      );

      // This is a test for an old version of the discovery panel that was actually
      // navigating links.
      if (isLegacyDiscoPane) {
        await clickLink(aManager, "link-good");
        is_in_discovery(aManager, SECOND_URL, true, false);

        // Execute go_back only after waitForLoad() has had a chance to setup
        // its listeners.
        executeSoon(go_back);

        await waitForLoad(aManager);
        is_in_discovery(aManager, MAIN_URL, true, true);

        // Execute go_forward only after waitForLoad() has had a chance to setup
        // its listeners.
        executeSoon(go_forward);

        await waitForLoad(aManager);
        is_in_discovery(aManager, SECOND_URL, true, false);
      }

      EventUtils.synthesizeMouseAtCenter(
        aManager.document.getElementById("category-plugin"),
        {},
        aManager
      );

      aManager = await wait_for_view_load(aManager);
      is_in_list(aManager, "addons://list/plugin", true, false);

      if (isLegacyDiscoPane) {
        go_back();

        aManager = await wait_for_view_load(aManager);
        is_in_discovery(aManager, SECOND_URL, true, true);

        go_back();

        await waitForLoad(aManager);
        is_in_discovery(aManager, MAIN_URL, true, true);

        go_back();

        aManager = await wait_for_view_load(aManager);
        is_in_list(aManager, "addons://list/plugin", false, true);

        go_forward();

        aManager = await wait_for_view_load(aManager);
        is_in_discovery(aManager, MAIN_URL, true, true);

        // Execute go_forward only after waitForLoad() has had a chance to setup
        // its listeners.
        executeSoon(go_forward);

        await waitForLoad(aManager);
        is_in_discovery(aManager, SECOND_URL, true, true);
      } else {
        go_back();

        aManager = await wait_for_view_load(aManager);
        is_in_discovery(aManager, MAIN_URL, true, true);

        go_back();

        aManager = await wait_for_view_load(aManager);
        is_in_list(aManager, "addons://list/plugin", false, true);
      }

      await close_manager(aManager);
    }
  );
});

// Tests that refreshing the discovery pane integrates properly with history
add_task(async function test_legacy_discopane_history_navigation() {
  await runTestOnPrefEnvs(
    [
      [
        "Test on XUL about:addons",
        {
          set: [
            ["extensions.htmlaboutaddons.enabled", false],
            ["extensions.htmlaboutaddons.discover.enabled", false],
          ],
        },
      ],
    ],
    async () => {
      let aManager = await open_manager("addons://list/plugin");

      is_in_list(aManager, "addons://list/plugin", false, false);

      EventUtils.synthesizeMouseAtCenter(
        aManager.document.getElementById("category-discover"),
        {},
        aManager
      );

      aManager = await wait_for_view_load(aManager);
      is_in_discovery(aManager, MAIN_URL, true, false);

      await clickLink(aManager, "link-good");
      is_in_discovery(aManager, SECOND_URL, true, false);

      EventUtils.synthesizeMouseAtCenter(
        aManager.document.getElementById("category-discover"),
        {},
        aManager
      );

      await waitForLoad(aManager);
      is_in_discovery(aManager, MAIN_URL, true, false);

      go_back();

      await waitForLoad(aManager);
      is_in_discovery(aManager, SECOND_URL, true, true);

      go_back();

      await waitForLoad(aManager);
      is_in_discovery(aManager, MAIN_URL, true, true);

      go_back();

      aManager = await wait_for_view_load(aManager);
      is_in_list(aManager, "addons://list/plugin", false, true);

      go_forward();

      aManager = await wait_for_view_load(aManager);
      is_in_discovery(aManager, MAIN_URL, true, true);

      // Execute go_forward only after waitForLoad() has had a chance to setup
      // its listeners.
      executeSoon(go_forward);

      await waitForLoad(aManager);
      is_in_discovery(aManager, SECOND_URL, true, true);

      // Execute go_forward only after waitForLoad() has had a chance to setup
      // its listeners.
      executeSoon(go_forward);

      await waitForLoad(aManager);
      is_in_discovery(aManager, MAIN_URL, true, false);

      await close_manager(aManager);
    }
  );
});

add_task(async function test_initialSelectedView_on_aboutaddons_reload() {
  await runTestOnPrefEnvs(
    [
      [
        "Test on HTML about:addons",
        {
          set: [
            ["extensions.htmlaboutaddons.enabled", true],
            ["extensions.htmlaboutaddons.discover.enabled", true],
            ["extensions.getAddons.discovery.api_url", DISCOAPI_URL],
          ],
        },
      ],
      [
        "Test on XUL about:addons",
        {
          set: [
            ["extensions.htmlaboutaddons.enabled", false],
            ["extensions.htmlaboutaddons.discover.enabled", false],
          ],
        },
      ],
    ],
    async () => {
      let managerWindow = await open_manager("addons://list/extension");
      ok(
        managerWindow.gViewController.initialViewSelected,
        "initialViewSelected is true as expected on first about:addons load"
      );

      managerWindow.location.reload();
      await wait_for_manager_load(managerWindow);
      await wait_for_view_load(managerWindow);

      ok(
        managerWindow.gViewController.initialViewSelected,
        "initialViewSelected is true as expected on first about:addons load"
      );
      is(
        managerWindow.gPendingInitializations,
        0,
        "No pending initializations"
      );

      await close_manager(managerWindow);
    }
  );
});
