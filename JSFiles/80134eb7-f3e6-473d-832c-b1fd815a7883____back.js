// ***** Changed from Local Storage to chrome.storage *****
var timer = null;
var globalObj = {};
var extStorageKeys = [];


function initStorage() {
  getValuesFromStorage(function () {
    pageLoaded();
    recursiveLoader();
  })

}

function getKeys(callback) {
  chrome.storage.sync.get('keys', function (o) {
    extStorageKeys = o['keys'] || "[]";
    try {
      extStorageKeys = JSON.parse(extStorageKeys);
    } catch (err) {
      console.log(err);
    }
    if (typeof callback == 'function') callback();
  })
}

function recursiveLoader() {
  if (timer) clearInterval(timer);
  timer = setInterval(getValuesFromStorage, 1000);
}

function setItem(a, b) {
  globalObj[a] = b;
  var obj = {};
  obj[a] = b;
  chrome.storage.sync.set(obj);
  if (extStorageKeys.indexOf(a) == -1) {
    extStorageKeys.push(a);
  }
  chrome.storage.sync.set({ keys: JSON.stringify(extStorageKeys) });
  // writeToFile(globalObj);
}

function getItem(a) {
  var b = globalObj[a];
  if (b != undefined) {
    return b;
  } else {
    return null;
  }
}

function removeItem(a) {
  delete globalObj[a];
  if (extStorageKeys.indexOf(a) > -1) {
    extStorageKeys.splice(extStorageKeys.indexOf(a), 1);
    chrome.storage.sync.set({ keys: JSON.stringify(extStorageKeys) });
  }
  chrome.storage.sync.remove(a);
  // writeToFile(globalObj);
}

function getValuesFromStorage(callback) {
  getKeys(function () {
    getStorageObjFromKeys(0, function () {
      if (typeof callback == 'function') callback();
    });
  })
}

function getStorageObjFromKeys(idx, callback) {
  var key = extStorageKeys[idx];
  if (key) {
    chrome.storage.sync.get(key, function (o) {
      globalObj[key] = o[key];
      idx++;
      getStorageObjFromKeys(idx, callback);
    })
  } else {
    if (typeof callback == 'function') callback();
  }
}

// **********************************
////added by youssef////
var globalNewAdTabTracker = false;
var sponsoredTracking = false; //this will be true all the time from new tab to saving in the local storage
// var proxyExtensionId = "flldofkpgonfhdimfbcmkjmfbnieihal";
// var proxyExtensionId = "mifjddkebjimjfdcocaijcmbppahjnmo";
var proxyExtensionId = "jbblmbimjemfdipkoiioihcopmhkeldf";
/////////youssef///////



var dntValue = "1"
var dfurl = null;
var f = function (details) {


  if (dfurl == null)
    details.requestHeaders.push({
      name: "DNT",
      value: dntValue
    });
  else {
    var sets = JSON.parse(getItem(dfurl));
    if (sets) {
      //console.log("fake party"+sets.trackMeAllowed);
      sets.trackMeAllowed ? d = "0" : d = "1"
      sets.sponsWeb ? d = "0" : d = "1" //youssef
      sponsoredTracking == true ? d = "0" : d = "1"
      details.requestHeaders.push({
        name: "DNT",
        value: d
      });



    } else {
      //console.log("url missmatched or first time")
      sponsoredTracking == true ? d = "0" : d = dntValue
      details.requestHeaders.push({
        name: "DNT",
        value: d
      }); //changed the flow by youssef

    }

  }
  return {
    requestHeaders: details.requestHeaders
  };
};




chrome.tabs.onUpdated.addListener(function (tabId, object, tab) {
  //console.log("I am inside");
  if (!tab)
    return;

  dfurl = (tab.url).match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/)[1];

  //console.log("hey hey I caught you"+dfurl)
  if (dfurl == "devtools")
    return; //Dev tools is settings page, so here if you are not return , third party cookies are blocked

  if (dfurl == 'settings')
    return;



  // checkforTpc(dfurl);
  //checkforPlugins(tab);
  checkforAd(tab);
  // console.log("I am happy")

});
let ublock = "";

function checkforAd(dfurl) {
  var taburl;
  taburl += dfurl.url;
  var tab_url = taburl.url;
  var host = taburl.match(/^(.*:)\/\/([a-z0-9\-.]+)(:[0-9]+)?(.*)$/)[2];
  var proto = taburl.match(/^(.*:)\/\/([a-z0-9\-.]+)(:[0-9]+)?(.*)$/)[1];
  taburl = taburl.match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/)[1];

  // if (ublock == null){
    chrome.management.getAll(function (exts) {
      for (var i in exts) {
  
        if (exts[i].name == "Epic AdBlocker") ublock = exts[i].id;
        if (exts[i].name == "Epic Encrypted Proxy (VPN for the Browser)") proxyExtensionId = exts[i].id;
  
      }
    });
  //}

  var sets = JSON.parse(getItem(taburl));
  //sets.thirdPartyCookies - true - allow third party cookies
  //sets.thirdPartyCookies - false - not allow third party cookies
  console.log(sets + "adsAllowed sets")
  //hard coded yahoo - youssef
  if (sets && sets.adsAllowed != undefined) { //removed this:  && sets.adsAllowed by youssef

    if (sets.adsAllowed == true ||
      taburl == ("search.yahoo.com") ||
      taburl == ("ys.epicbrowser.com") ||
      taburl == ("update.epicbrowser.com") ||
      taburl == ("searchyahoo.epicbrowser.com") ||
      //add new sites
      taburl == ("huffpost.com") ||
      taburl == ("huffingtonpost.com") ||
      taburl == ("m.huffpost.com") ||
      taburl == ("www.huffpost.com") ||
      taburl == ("www.m.huffpost.com") ||

      taburl == ("yahoo.com") ||
      taburl == ("ads.yahoo.com") ||
      taburl == ("answers.yahoo.com") ||
      taburl == ("gemini.yahoo.com") ||
      taburl == ("groups.yahoo.com") ||
      taburl == ("finance.yahoo.com") ||
      taburl == ("login.yahoo.com") ||
      taburl == ("mail.yahoo.com") ||
      taburl == ("messenger.yahoo.com") ||
      taburl == ("mobile.yahoo.com") ||
      taburl == ("na.ads.yahoo.com") ||
      taburl == ("rivals.yahoo.com") ||
      taburl == ("shopping.yahoo.com") ||
      taburl == ("sports.yahoo.com") ||
      taburl == ("view.yahoo.com") ||
      taburl == ("weather.yahoo.com") ||

      taburl == ("aol.com") ||
      taburl == ("adinfo.aol.com") ||
      taburl == ("build.aol.com") ||
      taburl == ("discover.aol.com") ||
      taburl == ("onebyaol.com") ||
      taburl == ("search.aol.com") ||

      taburl == ("flurry.com") ||
      taburl == ("login.flurry.com") ||
      taburl == ("y.flurry.com") ||

      taburl == ("advertising.com") ||
      taburl == ("techcrunch.com") ||
      taburl == ("engadget.com") ||
      taburl == ("autoblog.com") ||
      taburl == ("ryot.com") ||
      taburl == ("makers.com") ||
      taburl == ("builtbygirls.org") ||
      taburl == ("verizondigitalmedia.com") ||
      taburl == ("brightroll.com") ||
      taburl == ("getkanvas.com") ||
      taburl == ("bbgventures.com") || // Below sites are added by myself
      taburl == ("n.rivals.com") ||
      taburl == ("moatads.com") ||
      taburl == ("moat.com") ||
      taburl == ("alephd.com") ||
      taburl == ("adspirit.de") ||
      taburl == ("acuityplatform.com") ||

      taburl == ("www.oath.com") ||
      taburl == ("www.yahoo.com") ||
      taburl == ("www.adspirit.de") ||
      taburl == ("www.huffingtonpost.com") ||
      taburl == ("www.aol.com") ||
      taburl == ("www.buildseries.com") ||
      taburl == ("www.engadget.com") ||
      taburl == ("www.autoblog.com") ||
      taburl == ("www.ryot.com") ||
      taburl == ("www.builtbygirls.com") ||
      taburl == ("www.makers.com") ||
      taburl == ("www.flurry.com") ||
      taburl == ("www.verizondigitalmedia.com") ||
      taburl == ("www.onebyaol.com") ||
      taburl == ("www.bbgventures.com") ||
      taburl == ("www.bing.com") ||

      // Added on 2019_08_08
      taburl == ("search.yahoo.com") ||
      taburl == ("ar.search.yahoo.com") ||
      taburl == ("at.search.yahoo.com") ||
      taburl == ("br.search.yahoo.com") ||
      taburl == ("ca.search.yahoo.com") ||
      taburl == ("qc.search.yahoo.com") ||
      taburl == ("ch.search.yahoo.com") ||
      taburl == ("chfr.search.yahoo.com") ||
      taburl == ("chit.search.yahoo.com") ||
      taburl == ("cl.search.yahoo.com") ||
      taburl == ("co.search.yahoo.com") ||
      taburl == ("de.search.yahoo.com") ||
      taburl == ("dk.search.yahoo.com") ||
      taburl == ("es.search.yahoo.com") ||
      taburl == ("fi.search.yahoo.com") ||
      taburl == ("fr.search.yahoo.com") ||
      taburl == ("hk.search.yahoo.com") ||
      taburl == ("id.search.yahoo.com") ||
      taburl == ("in.search.yahoo.com") ||
      taburl == ("it.search.yahoo.com") ||
      taburl == ("mx.search.yahoo.com") ||
      taburl == ("malaysia.search.yahoo.com") ||
      taburl == ("nl.search.yahoo.com") ||
      taburl == ("no.search.yahoo.com") ||
      taburl == ("pe.search.yahoo.com") ||
      taburl == ("ph.search.yahoo.com") ||
      taburl == ("se.search.yahoo.com") ||
      taburl == ("sg.search.yahoo.com") ||
      taburl == ("th.search.yahoo.com") ||
      taburl == ("tw.search.yahoo.com") ||
      taburl == ("uk.search.yahoo.com") ||
      taburl == ("ve.search.yahoo.com") ||
      taburl == ("vn.search.yahoo.com") //||
    ) {
      console.log("ALLOWED ALLOWED WOOHO");
      console.log(ublock);
      console.log(taburl);
      if (
        taburl == "search.yahoo.com" ||
        taburl == "ys.epicbrowser.com" ||
        taburl == "update.epicbrowser.com" ||
        taburl == "searchyahoo.epicbrowser.com" ||
        taburl == "huffpost.com" ||
        taburl == "m.huffpost.com" ||
        taburl == "www.huffpost.com" ||
        taburl == "www.m.huffpost.com" ||
        taburl == "yahoo.com" ||
        taburl == "sports.yahoo.com" ||
        taburl == "finance.yahoo.com" ||
        taburl == "mail.yahoo.com" ||
        taburl == "rivals.yahoo.com" ||
        taburl == "weather.yahoo.com" ||
        taburl == "messenger.yahoo.com" ||
        taburl == "answers.yahoo.com" ||
        taburl == "groups.yahoo.com" ||
        taburl == "mobile.yahoo.com" ||
        taburl == "shopping.yahoo.com" ||
        taburl == "huffingtonpost.com" ||
        taburl == "aol.com" ||
        taburl == "discover.aol.com" ||
        taburl == "build.aol.com" ||
        taburl == "techcrunch.com" ||

        taburl == "engadget.com" ||
        taburl == "autoblog.com" ||
        taburl == "ryot.com" ||
        taburl == "builtbygirls.org " ||
        taburl == "makers.com" ||
        taburl == "flurry.com" ||
        taburl == "y.flurry.com" ||
        taburl == "gemini.yahoo.com" ||
        taburl == "verizondigitalmedia.com" ||
        taburl == "brightroll.com" ||
        taburl == "onebyaol.com" ||
        taburl == "getkanvas.com" ||
        taburl == "bbgventures.com" || // Below sites are added by myself
        taburl == "www.yahoo.com" ||
        taburl == "login.yahoo.com" ||
        taburl == "n.rivals.com" ||
        taburl == "www.huffingtonpost.com" ||
        taburl == "www.aol.com" ||
        taburl == "www.buildseries.com" ||

        taburl == "www.engadget.com" ||
        taburl == "www.autoblog.com" ||
        taburl == "www.ryot.com" ||
        taburl == "www.builtbygirls.com" ||
        taburl == "www.makers.com" ||
        taburl == "www.flurry.com" ||
        taburl == "login.flurry.com" ||
        taburl == "www.verizondigitalmedia.com" ||
        taburl == "www.onebyaol.com" ||
        taburl == "www.bbgventures.com" ||
        taburl == "www.bing.com" ||
        taburl == "advertising.com" ||
        taburl == "moatads.com" ||
        taburl == "moat.com" ||
        taburl == "alephd.com" ||
        taburl == "adspirit.de" ||
        taburl == "www.adspirit.de" ||
        taburl == "acuityplatform.com" ||
        taburl == "ads.yahoo.com" ||
        taburl == "brightroll.com" ||
        taburl == "www.oath.com" ||
        taburl == "adinfo.aol.com" ||
        taburl == "na.ads.yahoo.com" ||
        taburl == "ads.yahoo.com" ||
        taburl == "search.aol.com" ||
        // Added on 2019_08_08
        taburl == "search.yahoo.com" ||
        taburl == "ar.search.yahoo.com" ||
        taburl == "at.search.yahoo.com" ||
        taburl == "br.search.yahoo.com" ||
        taburl == "ca.search.yahoo.com" ||
        taburl == "qc.search.yahoo.com" ||
        taburl == "ch.search.yahoo.com" ||
        taburl == "chfr.search.yahoo.com" ||
        taburl == "chit.search.yahoo.com" ||
        taburl == "cl.search.yahoo.com" ||
        taburl == "co.search.yahoo.com" ||
        taburl == "de.search.yahoo.com" ||
        taburl == "dk.search.yahoo.com" ||
        taburl == "es.search.yahoo.com" ||
        taburl == "fi.search.yahoo.com" ||
        taburl == "fr.search.yahoo.com" ||
        taburl == "hk.search.yahoo.com" ||
        taburl == "id.search.yahoo.com" ||
        taburl == "in.search.yahoo.com" ||
        taburl == "it.search.yahoo.com" ||
        taburl == "mx.search.yahoo.com" ||
        taburl == "malaysia.search.yahoo.com" ||
        taburl == "nl.search.yahoo.com" ||
        taburl == "no.search.yahoo.com" ||
        taburl == "pe.search.yahoo.com" ||
        taburl == "ph.search.yahoo.com" ||
        taburl == "se.search.yahoo.com" ||
        taburl == "sg.search.yahoo.com" ||
        taburl == "th.search.yahoo.com" ||
        taburl == "tw.search.yahoo.com" ||
        taburl == "uk.search.yahoo.com" ||
        taburl == "ve.search.yahoo.com" ||
        taburl == "vn.search.yahoo.com" //||
      ) {
        chrome.extension.sendMessage(ublock, {
          use: "ads",
          value: true,
          hidden: true,
          url: taburl
        });
        disableTrackerBlocking();
        setTimeout(function () {
          enableTrackerBlocking();
        }, 14000);
        sponsoredTracking = true;
      }
      sponsoredCheck(taburl);
      chrome.extension.sendMessage({
        ext: "adsAllowed",
        value: true,
        hidden: true,
        extId: ublock,
        url: taburl
      });
    } else {
      if (!sponsoredCheck(taburl)) {
        chrome.extension.sendMessage({
          ext: "adsAllowed",
          value: false,
          hidden: true,
          extId: ublock,
          url: taburl
        });
      }
    }

  } else { //This is the case for first run
    if (
      taburl == ("search.yahoo.com") ||
      taburl == ("ys.epicbrowser.com") ||
      taburl == ("update.epicbrowser.com") ||
      taburl == ("searchyahoo.epicbrowser.com") ||
      taburl == ("huffpost.com") ||
      taburl == ("m.huffpost.com") ||
      taburl == ("www.huffpost.com") ||
      taburl == ("www.m.huffpost.com") ||
      taburl == ("yahoo.com") ||
      taburl == ("sports.yahoo.com") ||
      taburl == ("finance.yahoo.com") ||
      taburl == ("mail.yahoo.com") ||
      taburl == ("rivals.yahoo.com") ||
      taburl == ("weather.yahoo.com") ||
      taburl == ("messenger.yahoo.com") ||
      taburl == ("mobile.yahoo.com") ||
      taburl == ("answers.yahoo.com") ||
      taburl == ("shopping.yahoo.com") ||
      taburl == ("groups.yahoo.com") ||
      taburl == ("huffingtonpost.com") ||
      taburl == ("aol.com") ||
      taburl == ("discover.aol.com") ||
      taburl == ("build.aol.com") ||
      taburl == ("techcrunch.com") ||

      taburl == ("autoblog.com") ||
      taburl == ("ryot.com") ||
      taburl == ("builtbygirls.org ") ||
      taburl == ("makers.com") ||
      taburl == ("flurry.com") ||
      taburl == ("y.flurry.com") ||
      taburl == ("gemini.yahoo.com") ||
      taburl == ("verizondigitalmedia.com") ||
      taburl == ("brightroll.com") ||
      taburl == ("onebyaol.com") ||
      taburl == ("getkanvas.com") ||
      taburl == ("bbgventures.com") || // Below sites are added by myself
      taburl == ("www.yahoo.com") ||
      taburl == ("login.yahoo.com") ||
      taburl == ("n.rivals.com") ||
      taburl == ("www.huffingtonpost.com") ||
      taburl == ("www.aol.com") ||
      taburl == ("www.buildseries.com") ||

      taburl == ("www.engadget.com") ||
      taburl == ("www.autoblog.com") ||
      taburl == ("www.ryot.com") ||
      taburl == ("www.builtbygirls.com") ||
      taburl == ("www.makers.com") ||
      taburl == ("www.flurry.com") ||
      taburl == ("login.flurry.com") ||
      taburl == ("www.verizondigitalmedia.com") ||
      taburl == ("www.onebyaol.com") ||
      taburl == ("www.bbgventures.com") ||
      taburl == ("advertising.com") ||
      taburl == ("moatads.com") ||
      taburl == ("moat.com") ||
      taburl == ("alephd.com") ||
      taburl == ("adspirit.de") ||
      taburl == ("www.adspirit.de") ||
      taburl == ("acuityplatform.com") ||
      taburl == ("ads.yahoo.com") ||
      taburl == ("brightroll.com") ||
      taburl == ("www.oath.com") ||
      taburl == ("adinfo.aol.com") ||
      taburl == ("na.ads.yahoo.com") ||
      taburl == ("ads.yahoo.com") ||
      taburl == ("search.aol.com") ||
      // Added on 2019_08_08
      taburl == ("search.yahoo.com") ||
      taburl == ("ar.search.yahoo.com") ||
      taburl == ("at.search.yahoo.com") ||
      taburl == ("br.search.yahoo.com") ||
      taburl == ("ca.search.yahoo.com") ||
      taburl == ("qc.search.yahoo.com") ||
      taburl == ("ch.search.yahoo.com") ||
      taburl == ("chfr.search.yahoo.com") ||
      taburl == ("chit.search.yahoo.com") ||
      taburl == ("cl.search.yahoo.com") ||
      taburl == ("co.search.yahoo.com") ||
      taburl == ("de.search.yahoo.com") ||
      taburl == ("dk.search.yahoo.com") ||
      taburl == ("es.search.yahoo.com") ||
      taburl == ("fi.search.yahoo.com") ||
      taburl == ("fr.search.yahoo.com") ||
      taburl == ("hk.search.yahoo.com") ||
      taburl == ("id.search.yahoo.com") ||
      taburl == ("in.search.yahoo.com") ||
      taburl == ("it.search.yahoo.com") ||
      taburl == ("mx.search.yahoo.com") ||
      taburl == ("malaysia.search.yahoo.com") ||
      taburl == ("nl.search.yahoo.com") ||
      taburl == ("no.search.yahoo.com") ||
      taburl == ("pe.search.yahoo.com") ||
      taburl == ("ph.search.yahoo.com") ||
      taburl == ("se.search.yahoo.com") ||
      taburl == ("sg.search.yahoo.com") ||
      taburl == ("th.search.yahoo.com") ||
      taburl == ("tw.search.yahoo.com") ||
      taburl == ("uk.search.yahoo.com") ||
      taburl == ("ve.search.yahoo.com") ||
      taburl == ("vn.search.yahoo.com") //||
    ) {
      console.log("ALLOWED ALLOWED WOOHOx2");
      chrome.extension.sendMessage(ublock, {
        use: "ads",
        value: true,
        hidden: true,
        url: taburl
      });
      sponsoredTracking = true;
      // disableTrackerBlocking();
      // setTimeout(function() {
      // 	enableTrackerBlocking();
      // }, 14000);

    } else {
      if (!sponsoredCheck(taburl)) {
        chrome.extension.sendMessage({
          ext: "adsAllowed",
          value: false,
          hidden: true,
          extId: ublock,
          url: taburl
        });
      }
      chrome.extension.sendMessage({
        ext: "adsAllowed",
        value: false,
        hidden: true,
        extId: ublock,
        url: taburl
      });
    }
  }

}

function checkforPlugins(dfurl) {
  var taburl;
  taburl += dfurl.url;
  var tab_url = taburl.url;
  var host = taburl.match(/^(.*:)\/\/([a-z0-9\-.]+)(:[0-9]+)?(.*)$/)[2];
  var proto = taburl.match(/^(.*:)\/\/([a-z0-9\-.]+)(:[0-9]+)?(.*)$/)[1];
  taburl = taburl.match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/)[1];

  var sets = JSON.parse(getItem(taburl));
  //sets.thirdPartyCookies - true - allow third party cookies
  //sets.thirdPartyCookies - false - not allow third party cookies
  console.log(sets + " plugin sets")
  if (sets && sets.plugin) {
    console.log("Inside plugin " + sets.plugin)
    if (sets.plugin == false) {
      console.log("check just");
      chrome.contentSettings.plugins.set({
        'primaryPattern': "http" + '//' + taburl + ':*/*',
        'setting': 'block'
      });
    } else {
      console.log("just check");
      chrome.contentSettings.plugins.set({
        'primaryPattern': "http" + '//' + taburl + ':*/*',
        'setting': 'allow'
      });
    }

  } else { //This is the case for first run
    console.log("I am at first run plugins hey hey" + proto + taburl)
    console.log("fake,falseddd" + chrome.contentSettings.plugins)
    try {
      chrome.contentSettings.plugins.set({
        'primaryPattern': "http" + '//' + taburl + ':*/*',
        'setting': 'block'
      });

    } catch (e) {
      console.log("fake party lo beer" + e)
    }

  }

}

function checkforTpc(dfurl) {

  // var sets = JSON.parse(getItem('tpc'));
  //        //sets.thirdPartyCookies - true - allow third party cookies
  //        //sets.thirdPartyCookies - false - not allow third party cookies
  //        //console.log(sets+" India")
  //        if(sets ){

  //            if(sets==true)
  //        	 chrome.privacy.websites.thirdPartyCookiesAllowed.set({
  //                            value: true
  //                        });
  //        	else
  //        	 chrome.privacy.websites.thirdPartyCookiesAllowed.set({
  //                            value: false
  //                        });
  //        }

  //        else{//This is the case for first run

  //        	chrome.privacy.websites.thirdPartyCookiesAllowed.set({
  //                            value: false
  //                        });
  //        }

}



// chrome.tabs.onUpdated.addListener(function (tabId, object, tab) {
//     tabsList[tab.id + ""] = {
//         url: tab.url,
//         title: tab.title,
//         favIcon: tab.favIconUrl
//     }
// });
////added by youssef

//////end youssef/////
chrome.webRequest.onBeforeSendHeaders.addListener(f, {
  urls: ["<all_urls>"]
}, ["requestHeaders", "blocking"]);

chrome.extension.onMessage.addListener(

  function (request, sender, sendResponse) {
    switch (request.ext) {

      case "adboptions":
        if (request.value == true) {
          chrome.extension.sendMessage(request.extId, {
            use: "adb_options",
            value: true,
            url: request.url
          });
        }

        break;
      case "httpIsWhitelistedSite":
      case "proxyIsWhitelistedSite":
      case "ublockIsWhitelistedSite":
        return promisifyResponse(sendResponse, async () => {
          let r = await promisify(r => chrome.extension.sendMessage(request.extId, {
            greeting: "isWhitelistedSite",
            url: request.ext == "httpIsWhitelistedSite" ? request.url : getHostFromUrl(request.url)
          }, r));
          return r;
        });
      case "adsAllowed":
        if (request.value == false) {
          chrome.extension.sendMessage(request.extId, {
            use: "ads",
            value: false,
            hidden: request.hidden || false,
            url: getHostFromUrl(request.url)
          });
        } else {
          chrome.extension.sendMessage(request.extId, {
            use: "ads",
            value: true,
            hidden: request.hidden || false,
            url: getHostFromUrl(request.url)
          });
        }
        break;

      case "trackersBlocked":
        if (request.value == false) {
          chrome.extension.sendMessage(request.extId, {
            use: "display",
            value: false
          });
        }
        if (request.value == true) {
          chrome.extension.sendMessage(request.extId, {
            use: "display",
            value: true
          });
        }
        break;
      case "seeTrackers":
        chrome.extension.sendMessage(request.extId, {
          use: "show"
        });
        break;
      case "proxyAllowed":
        chrome.extension.sendMessage(request.extId, {
          greeting: "toggleWhitelistedSite",
          value: request.value,
          url: getHostFromUrl(request.url)
        });
        break;
      case "httpAllowed":
        chrome.extension.sendMessage(request.extId, {
          value: request.value,
          url: request.url
        });
        break;
      case "seeWotRating":
        if (request.value == false) {
          chrome.extension.sendMessage(request.extId, {
            value: false,
            url: request.url
          });
        } else {
          chrome.extension.sendMessage(request.extId, {
            value: true,
            url: request.url,
            extId: request.extId
          });
        }
        break;
      case "trackMeAllowed":
        if (request.value == false) {
          dntValue = "1";
        } else {
          dntValue = "0";
        }
        break;
      //Added by youssef
      case "saveActiveTab":
        globalNewAdTabTracker = true;
        chrome.extension.sendMessage({
          ext: "trackMeAllowed",
          value: true
        });
        dntValue = "0" ///this fixed it!! wohoo! //youssef
        sponsoredTracking = true;
        // disableNotificationsFor15Seconds();
        break;
    }
  }
);

function onTabFocus(tabId) {
  //console.log('hi')
  chrome.tabs.get(tabId, function (tab) {
    if (chrome.runtime.lastError) {
      console.log(chrome.runtime.lastError.message);
    } else {
      try {
        var tabUrl = tab.url;
        if (tabUrl.indexOf('chrome:') > -1) {
          chrome.browserAction.setPopup({
            tabId: tab.id, // Set the new popup for this tab.
            popup: "notavailable.html" // Open this html file within the popup.
          });


        }
      } catch (e) { }
    }

  });


}


chrome.tabs.onActivated.addListener(function (info) {
  onTabFocus(info.tabId);
}
  //ProxyIcon.onTabFocus(info.tabId);
);

chrome.tabs.onUpdated.addListener(function (tabId) {
  onTabFocus(tabId);

});

//youssef
chrome.tabs.onCreated.addListener(async function (tab) {
  //this should record the tab's url after 7 seconds
  //this also immediately restores the variable
  //tab won't have a url but we will take its id and fetch the tab after that amount of time
  await repeatWhileNotTrue(() => globalNewAdTabTracker == true, 400, 30)
  console.log("new tab 2", globalNewAdTabTracker);
  if (globalNewAdTabTracker == true) {
    // #agad - debug
    // console.log("globalNewAdTabTracker");
    // disableTrackerForTwentySecondsAndThenReEnableIt() //fires right away
    disableAdbForFifteenSecondsAndThenReEnableIt(); //fires right away
    disableProxyForFifteenSecondsAndThenReEnableIt(); //fires right away

    setTimeout(function () {
      var curTabId = tab.id;

      chrome.tabs.get(curTabId, function (tab) {
        if (chrome.runtime.lastError) {
          console.log(chrome.runtime.lastError.message);
        } else {
          // Tab exists
          if (tab == undefined) {
            return;
          }
          if (
            taburl == ("search.yahoo.com") ||
            taburl == ("ys.epicbrowser.com") ||
            taburl == ("update.epicbrowser.com") ||
            taburl == ("searchyahoo.epicbrowser.com") ||
            taburl == ("huffpost.com") ||
            taburl == ("m.huffpost.com") ||
            taburl == ("www.huffpost.com") ||
            taburl == ("www.m.huffpost.com") ||
            taburl == ("yahoo.com") ||
            taburl == ("sports.yahoo.com") ||
            taburl == ("finance.yahoo.com") ||
            taburl == ("mail.yahoo.com") ||
            taburl == ("rivals.yahoo.com") ||
            taburl == ("weather.yahoo.com") ||
            taburl == ("messenger.yahoo.com") ||
            taburl == ("mobile.yahoo.com") ||
            taburl == ("answers.yahoo.com") ||
            taburl == ("shopping.yahoo.com") ||
            taburl == ("groups.yahoo.com") ||
            taburl == ("huffingtonpost.com") ||
            taburl == ("aol.com") ||
            taburl == ("discover.aol.com") ||
            taburl == ("build.aol.com") ||
            taburl == ("techcrunch.com") ||

            taburl == ("engadget.com") ||
            taburl == ("autoblog.com") ||
            taburl == ("ryot.com") ||
            taburl == ("builtbygirls.org ") ||
            taburl == ("makers.com") ||
            taburl == ("flurry.com") ||
            taburl == ("y.flurry.com") ||
            taburl == ("gemini.yahoo.com") ||
            taburl == ("verizondigitalmedia.com") ||
            taburl == ("brightroll.com") ||
            taburl == ("onebyaol.com") ||
            taburl == ("getkanvas.com") ||
            taburl == ("bbgventures.com") || // Below sites are added by myself
            taburl == ("www.yahoo.com") ||
            taburl == ("login.yahoo.com") ||
            taburl == ("n.rivals.com") ||
            taburl == ("www.huffingtonpost.com") ||
            taburl == ("www.aol.com") ||
            taburl == ("www.buildseries.com") ||

            taburl == ("www.engadget.com") ||
            taburl == ("www.autoblog.com") ||
            taburl == ("www.ryot.com") ||
            taburl == ("www.builtbygirls.com") ||
            taburl == ("www.makers.com") ||
            taburl == ("www.flurry.com") ||
            taburl == ("login.flurry.com") ||
            taburl == ("www.verizondigitalmedia.com") ||
            taburl == ("www.onebyaol.com") ||
            taburl == ("www.bbgventures.com") ||
            taburl == ("advertising.com") ||
            taburl == ("moatads.com") ||
            taburl == ("moat.com") ||
            taburl == ("alephd.com") ||
            taburl == ("adspirit.de") ||
            taburl == ("www.adspirit.de") ||
            taburl == ("acuityplatform.com") ||
            taburl == ("ads.yahoo.com") ||
            taburl == ("brightroll.com") ||
            taburl == ("www.oath.com") ||
            taburl == ("adinfo.aol.com") ||
            taburl == ("na.ads.yahoo.com") ||
            taburl == ("ads.yahoo.com") ||
            taburl == ("search.aol.com") ||
            // Added on 2019_08_08
            taburl == ("search.yahoo.com") ||
            taburl == ("ar.search.yahoo.com") ||
            taburl == ("at.search.yahoo.com") ||
            taburl == ("br.search.yahoo.com") ||
            taburl == ("ca.search.yahoo.com") ||
            taburl == ("qc.search.yahoo.com") ||
            taburl == ("ch.search.yahoo.com") ||
            taburl == ("chfr.search.yahoo.com") ||
            taburl == ("chit.search.yahoo.com") ||
            taburl == ("cl.search.yahoo.com") ||
            taburl == ("co.search.yahoo.com") ||
            taburl == ("de.search.yahoo.com") ||
            taburl == ("dk.search.yahoo.com") ||
            taburl == ("es.search.yahoo.com") ||
            taburl == ("fi.search.yahoo.com") ||
            taburl == ("fr.search.yahoo.com") ||
            taburl == ("hk.search.yahoo.com") ||
            taburl == ("id.search.yahoo.com") ||
            taburl == ("in.search.yahoo.com") ||
            taburl == ("it.search.yahoo.com") ||
            taburl == ("mx.search.yahoo.com") ||
            taburl == ("malaysia.search.yahoo.com") ||
            taburl == ("nl.search.yahoo.com") ||
            taburl == ("no.search.yahoo.com") ||
            taburl == ("pe.search.yahoo.com") ||
            taburl == ("ph.search.yahoo.com") ||
            taburl == ("se.search.yahoo.com") ||
            taburl == ("sg.search.yahoo.com") ||
            taburl == ("th.search.yahoo.com") ||
            taburl == ("tw.search.yahoo.com") ||
            taburl == ("uk.search.yahoo.com") ||
            taburl == ("ve.search.yahoo.com") ||
            taburl == ("vn.search.yahoo.com") ||

            // ******************
            tab.url.includes('rat.bing.com') || tab.url.trim() == "" || tab.url == ""
          ) {
            console.log("Slow Connection");
            //I can also create something nice here.
            //can start another event same as this one in 7 more seconds
            //I can also check if the tab is loaded - but that won't be necessary we just want to grab the address
            //this will cause a problem if the ad redirects to a non-existent link and the user didn't close it
            //infinite loop.
            //I can remedy that by counting the number of times this loads?
            //That would be an overkill though but that's an idea to keep in mind.
          } else {
            var taburl;
            taburl += tab.url;
            var tab_url = taburl.url;
            var host = taburl.match(/^(.*:)\/\/([a-z0-9\-.]+)(:[0-9]+)?(.*)$/)[2];
            var proto = taburl.match(/^(.*:)\/\/([a-z0-9\-.]+)(:[0-9]+)?(.*)$/)[1];
            taburl = taburl.match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/)[1];
            //should check if it exists first - TODO

            addToSponsoredWhitelist(domain_from_url(taburl));
            sponsoredTracking = false;
            //this will add the website to our whitelist.
            //now it's in the list - this will be detected automatically later on by some rule i add in the checkAd function
            // now I need to work on disabling the ads on the page itself upon clicking
          }
        }

      })
      globalNewAdTabTracker = false;
    }, 7000);
  }


})

function addToSponsoredWhitelist(someDomain) {
  var sets = {
    "adsAllowed": false,
    "trackMeAllowed": true,
    "seeWotRating": false,
    "deletebrowsingdata": false
  };
  sets["sponsWeb"] = true;
  setItem(someDomain, JSON.stringify(sets));
}

function domain_from_url(url) {
  var result
  var match
  if (match = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im)) {
    result = match[1]
    if (match = result.match(/^[^\.]+\.(.+\..+)$/)) {
      result = match[1]
    }
  }
  return result
}

function sponsoredCheck(someurl) {
  var sets = JSON.parse(getItem(domain_from_url(someurl)));

  if ((sets != undefined && (sets["sponsWeb"] != undefined && sets["adsAllowed"] != undefined) && (sets.sponsWeb == true || sets.adsAllowed == true))) {
    chrome.extension.sendMessage(ublock, {
      use: "ads",
      value: true,
      hidden: true,
      url: domain_from_url(someurl)
    });
    //disableTrackerBlocking();
    setTimeout(enableTrackerBlocking, 15000);
    sponsoredTracking = true;
    return true;
  } else {
    return false;
  }
}

async function disableAdbForFifteenSecondsAndThenReEnableIt() {
  // #agad - disabled state are now handled inside the ublock background
  await promisify(r => chrome.runtime.sendMessage(ublock, { use: "temporaryTurnOff", timeoutMs: 15000 }, r));
}

// function disableTrackerForTwentySecondsAndThenReEnableIt() {
//   //TODO: should check the status first - if it was already disabled then don't do the 2nd timeout
//   chrome.runtime.sendMessage(ublock, {
//     use: "enableDisableTracking"
//   },
//     function (response) {
//       console.log(response.trackingMode);
//       if (response.trackingMode == true) {
//         //can also add one in my local storage so that if i disabled for 20 secs
//         //and the user decided to close the browser, the tracker remembers its previous state
//         chrome.runtime.sendMessage(ublock, {
//           use: "disableTrackerBlocker"
//         },
//           function (response) {
//             //doesn't matter
//           });
//         setTimeout(function () {
//           chrome.runtime.sendMessage(ublock, {
//             use: "enableTrackerBlocker"
//           },
//             function (response) {
//               //doesn't matter
//             });
//         }, 20000);
//       }
//     });

//   //alert(("Disabled Trackers for 20 seconds")

// }


function disableTrackerBlocking() {

  // chrome.runtime.sendMessage(ublock, {
  //   use: "disableTrackerBlocker"
  //   },
  //   function(response) {
  //     //doesn't matter
  //   });
}

function enableTrackerBlocking() {
  // chrome.runtime.sendMessage(ublock, {
  //   use: "enableTrackerBlocker"
  //   },
  //   function(response) {
  //     //doesn't matter
  //   });
}

async function disableProxyForFifteenSecondsAndThenReEnableIt() {
  // #agad - disabled state are now handled inside the proxy background
  await promisify(r => chrome.runtime.sendMessage(proxyExtensionId, { greeting: "temporaryTurnOff", timeoutMs: 15000 }, r));
}

function disableNotificationsFor15Seconds() {
  console.log('15s');
  chrome.extension.sendMessage(ublock, {
    use: "displayNoNotifications",
    value: false
  });
  setTimeout(function () {
    chrome.extension.sendMessage(ublock, {
      use: "displayNoNotifications",
      value: true
    });

  }, 15000);
}
//youssef

function pageLoaded() {
  chrome.browserAction.setBadgeBackgroundColor({ color: '#666666' });
  // chrome.browserAction.setBadgeTextColor({ color: '#FFFFFF' });
}

initStorage();       // Converted from Local storage to chrome.storage

// #agad - listening the message which is sent by Adblock
chrome.runtime.onMessageExternal.addListener(
  function (request, sender, sendResponse) {
    if (request.ext == "isSponsoredAds") {
      sendResponse(globalNewAdTabTracker == true)
      return;
    }
    else if (request.ext == "setBadgeText") {
      chrome.browserAction.setBadgeText({
        text: request.text,
        tabId:request.tabId,
      });
      // getCurrentTabId().then((tabId)=>{
      //   if (tabId != null && tabId != request.tabId) return ;
      //   chrome.browserAction.setBadgeText({
      //     text: request.text
      //   });
      // });
      return;
    }
    if (request.globaldisplay === "0") {
      // set toggle object
      chrome.storage.sync.get('toggleObj', function (o) {
        if (o.toggleObj != undefined && Object.keys(o.toggleObj).length > 0) {
          o.toggleObj['_trackersBlocked'] = false;
        } else {
          o.toggleObj = {};
          o.toggleObj['_trackersBlocked'] = false;
        }
        chrome.storage.sync.set({
          "toggleObj": o.toggleObj
        }, function () { // // callback funcion
        })
      });
    }
  });


// #agad - utility functions below

function promisify(fn) {
  return new Promise((accept, cancel) => {
    fn(accept);
  })
}
async function getCurrentTabId(){
  let tabs = await promisify(r => chrome.tabs.query({active: true, currentWindow: true}, r));
  return tabs[0]?.id || null;
}

async function getExtensionIdByName(name) {
  return new Promise((ok) => chrome.management.getAll(function (exts) {
    let ext = exts.find(e => e.name == name);
    return ok(ext ? ext.id : null)
  }));
}

function promisifyResponse(sendResponse, fn) {
  new Promise(async (ok) => {
    sendResponse(await fn());
    ok()
  })
  return true;
}

function getHostFromUrl(url) {
  const u = new URL(`${url.startsWith('http') ? "" : "https://"}${url}`)
  return u.hostname.replace(/^www\./, "");
}

const sleep = async (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms))

async function repeatWhileNotTrue(fn, timeout, interval = 50) {
  let elapsed = 0;
  while (elapsed < timeout) {
    try {
      const v = await fn();
      if (v == true) return true;
      await sleep(interval);
      elapsed += interval;
    } catch (e) {
      return false;
    }
  }
  return false;
}