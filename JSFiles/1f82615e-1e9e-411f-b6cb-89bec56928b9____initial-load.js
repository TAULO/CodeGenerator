let notebookcx = undefined;
let notebookcxWrap = undefined;
let nbDrag = undefined;
let webapp = undefined;

//removeIf(!chrome)
var extension = chrome.extension;
var runtime = chrome.runtime;
var i18n = chrome.i18n; //Used in focused-ele.js
//endRemoveIf(!chrome)

let eventMethod = window.addEventListener
			? "addEventListener" //NO I18N
			: "attachEvent";//NO I18N
let eventer = window[eventMethod];
let messageEvent = eventMethod === "attachEvent"//NO I18N
    ? "onmessage"//NO I18N
    : "message";//NO I18N

let smartPositionCache = {
    left : "",
    right : ""
};
let extensionUrl = extension.getURL("");
if(extensionUrl[extensionUrl.length - 1] === "/") {
    extensionUrl = extensionUrl.substring(0, extensionUrl.length-1);
}

(function() {
    initMeetingEventer();
    initRecipeEventer();
})();

runtime.onMessage.addListener((request, sender, sendResponse) => {
    let action = request.action;
    let data = request.data;

    switch(action) {
        case 1004: {
            if(data) {
                initWindow(data.arguments);
                sendResponse(200);
            }
        }
        break;

        case 1032 : {
            partialAnnotator(data.arguments);
            sendResponse(200);
        }
        break;

        case 1008 : {
            sendResponse("hi");
        }
        break;

        case 1017 : {
            showSmartPopup();
            webapp = data.webapp;
        }
        break;

        case 1019 : {
            showRecipePopup();
        }
        break;

        case 1021 : {
            showPdfPopup();
        }
        break;

        case 1039 : {
            openAnnotator(data.arguments);
        }
        break;

        case 1040 : {
            showLoadingIframe();
        }
        break;

        case 1041 : {
            hideLoadingIframe();
        }
        break;
    }
});

function initWindow(_arguments) {
    if(!_arguments) {
        _arguments = {};
    }
    notebookcx = document.getElementById("notebookcx");
    if(!notebookcx) {  
        injectIframe(_arguments);
    }
    else if(_arguments.contextMenu) {
        contextMenuOperation(_arguments);
    }
    else if(notebookcx.style.display === "block") {
        hideIframe();
        runtime.sendMessage({
            action: 1037
        });
    }
    else {
        showIframe();
    }
}

function injectIframe(_arguments) {
    if(!_arguments) {
        _arguments = {};
    }

    notebookcxWrap = document.createElement("div"); //NO I18N
    notebookcxWrap.setAttribute("id", "notebookcx-wrap"); //NO I18N
    notebookcxWrap.setAttribute("style", `
        position: fixed;
        right: 0;
        top: 0;
        height: 525px;
        width: 320px;
        min-height: 525px;
        min-width: 320px;
        border: 0px;
        display: block;
        z-index: 99999999;
        box-sizing: border-box;
    `);

    notebookcx = document.createElement("iframe"); //NO I18N
    notebookcx.setAttribute("id", "notebookcx"); //NO I18N
    notebookcx.setAttribute("style", `
        position: fixed;
        right: 0;
        top: 0;
        height: 525px;
        width: 320px;
        min-height: 525px;
        min-width: 320px;
        background-color: #FFFFFF;
        border: 0px;
        display: block;
        box-shadow: 0px 8px 16px rgba(0,0,0,0.25);
        pointer-events: initial;
        z-index: 999999999;
    `);
    notebookcx.setAttribute("src", extension.getURL("html/window.html"));//NO I18N)

    nbDrag = document.createElement("div");
    nbDrag.id = "nb-drag";
    nbDrag.setAttribute("style", `
        position: fixed;
        top: 0;
        right: 120px;
        width: 200px;
        height: 52px;
        background-color: transparent;
        z-index: 9999999999;
        cursor: all-scroll;
    `);

    setClipperPosition(_arguments.clipper_position);

    // let resizerFragment = getResizerFragment();
    // notebookcxWrap.appendChild(resizerFragment);
    
    document.body.appendChild(nbDrag);
    document.body.appendChild(notebookcxWrap);
    document.body.appendChild(notebookcx);
    notebookcxWrap = document.getElementById("notebookcx-wrap");
    notebookcxWrap.addEventListener('dragenter', handleDrag, false);
    notebookcxWrap.addEventListener('dragexit', handleDrag, false);
    document.addEventListener('dragover', handleDrag, false);
    notebookcxWrap.addEventListener('drop', handleDrop, false);
    
    notebookcx.onload = () => {
        
        contextMenuOperation(_arguments);

        if(nbDrag) {
            // nbDrag.onclick = function() {
            //     notebookcx.contentWindow.postMessage({
            //         action : "focusNoteTitle",
            //     }, extension.getURL("html/window.html")); 
            // }
            // nbDrag.ondblclick = function() {
            //     notebookcx.contentWindow.postMessage({
            //         action : "focusNoteTitleDoubleClick",
            //     }, extension.getURL("html/window.html")); 
            // }
            dragElementNbDrag(nbDrag);
        }
        //makeResizableDiv("#notebookcx-wrap");

        document.addEventListener('dragstart', reduceNotebookcxIndex);
        document.addEventListener('dragend', resetZindex);
        document.addEventListener('drop', resetZindex);
    };

    runtime.sendMessage({
        action: 1000,
        data : {
            category : "CLIPPER", //NO I18N
            action : "OPEN" //NO I18N
        } 
    });
}

function contextMenuOperation(_arguments) {
    let contextAction = undefined;
    let contextOptions = _arguments.contextMenu || {};

    if(contextOptions.contextLinkCard) {
        contextAction = "contextLinkCard"; //NO I18N
    }
    else if(contextOptions.contextReaderView) {
        contextAction = "contextReaderView"; //NO I18N
    }
    else if(contextOptions.contextScreenshot) {
        contextAction = "contextScreenshot"; //NO I18N
    }
    else if(contextOptions.contextTextSelection) {
        contextAction = "contextTextSelection"; //NO I18N
    }
    else {
        let selection = window.getSelection();
        if(selection) {
            var selectedText = selection.toString();
            if(selectedText) {
                contextOptions = {
                    selectionText : selectedText
                }
                contextAction = "contextTextSelection";
            }
        }
    }

    if(contextAction) {
        var html = "";
        if (typeof window.getSelection != "undefined") {
            var sel = window.getSelection();
            if (sel.rangeCount) {
                var container = document.createElement("div");
                for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                    container.appendChild(sel.getRangeAt(i).cloneContents());
                }
                html = container.innerHTML;
            }
        } else if (typeof document.selection != "undefined") {
            if (document.selection.type == "Text") {
                html = document.selection.createRange().htmlText;
            }
        }
        
        notebookcx.contentWindow.postMessage({
            action: contextAction,
            detail : {
                selectionText : html
            }
        }, extension.getURL("html/window.html"));//NO I18N
    }
}
function handleDrag(event) {
    event.stopPropagation();
    event.preventDefault();
}

function handleDrop(event) {
    resetZindex();
    event.stopPropagation();
    event.preventDefault();

    let filesLength = 0;
    if(event.dataTransfer && event.dataTransfer.files) {
        filesLength = event.dataTransfer.files.length;
    }
    if(!filesLength) {
        let data1 = event.dataTransfer.getData("text/html");//NO I18N
        if(data1.trim() !== '') {//NO I18N
            /* ---
                Drag and drop images
            --- */
            let parser1 = new DOMParser();
            let xmlDoc1 = parser1.parseFromString(data1, "text/html");//NO I18N
            let imgs = xmlDoc1.getElementsByTagName("img");//NO I18N
            if(imgs.length) {
                
                let dontLoadAnnotator = false;

                if(imgs.length > 1) {
                    dontLoadAnnotator = true;
                }

                for(let i=0; i < imgs.length; i++) {
                    let imageUrl = undefined;
                    if(imgs[i].src) {
                        imageUrl = imgs[i].src;
                    }
                    else if(imgs[i].srcset) {
                        imageUrl = imgs[i].srcset;
                    }
                    else {
                        return;
                    }
                    let xhr = new XMLHttpRequest();
                    xhr.open('GET', imageUrl, true);
                    xhr.responseType = "blob"; //NO I18N
                    xhr.onload = imageLoaded;
                    xhr.send();
                }

                function imageLoaded() {
                    notebookcx.contentWindow.postMessage({
                        action : "webImageDrop", //NO I18N
                        blob : this.response,
                        dontLoadAnnotator : dontLoadAnnotator
                    }, extension.getURL("html/window.html")); //NO I18N
                };
            }
            else {
                let data = event.dataTransfer.getData("text"); //NO I18N
                notebookcx.contentWindow.postMessage({
                    action : "webTextDrop", //NO I18N
                    text : data
                }, extension.getURL("html/window.html")); //NO I18N
            }
        }
        else {

            /* ---
                Drag and drop link
            --- */
            let data = e.dataTransfer.getData("text"); //NO I18N
            nbLocalStorage.get("saveNCType", function(item) {
                let page = item.saveNCType;
                if(page === "stext") {
                    if(data !== '') {
                        if(data.indexOf("http") === 0 || data.indexOf("https") === 0) {
                            let htmlData = e.dataTransfer.getData("text/html"); //No I18N
                            let parser2 = new DOMParser();
                            let xmlDoc2 = parser2.parseFromString(htmlData,"text/html"); //No I18N
                            let imgs = xmlDoc2.getElementsByTagName("img");
                            if(imgs.length < 1){
                                runtime.sendMessage({action: "savePageLink",title:document.getElementById("notebookcx").contentWindow.document.getElementById("title").value,url:data}); //NO I18N
                            }
                        }
                    }
                }
            });
        }
    }
}

function hideIframe() {
    notebookcx && document.body.removeChild(notebookcx);
    notebookcxWrap && document.body.removeChild(notebookcxWrap);
    nbDrag && document.body.removeChild(nbDrag);

    runtime.sendMessage({
        action: 1022
    });

    runtime.sendMessage({
        action: 1000,
        data : {
            category : "CLIPPER", //NO I18N
            action : "CLOSE" //NO I18N
        }
    });

    document.removeEventListener('dragstart', reduceNotebookcxIndex);
    document.removeEventListener('dragend', resetZindex);
    document.removeEventListener('drop', resetZindex);
}

function showIframe() {
    notebookcx && (notebookcx.style.display = "block"); //NO I18N
    notebookcxWrap && (notebookcxWrap.style.display = "block");
    nbDrag && (nbDrag.style.display = "block");
}


// removeIf(firefox)
eventer(messageEvent, function (event) {
// endRemoveIf(firefox)

let data = event.data;

    switch(data.action) {

        case "openAnnotator" : { //NO I18N
            initAnnotator(data.base64).then((newBase64) => {
                if(!newBase64) {
                    return;
                }
                event.source.postMessage({
                    action : "openAnnotatorResponse", //NO I18N
                    detail : {
                        base64 : newBase64,
                        id : data.id
                    },
                    componentName : data.componentName
                }, extension.getURL("html/window.html")); //NO I18N
            });
        }
        break;

        case "getDocumentUrl" : //NO I18N
            event.source.postMessage({
                action : "getDocumentUrlResponse", //NO I18N
                detail : {
                    url : location.href,
                    title : document.title
                }
            }, extension.getURL("html/window.html")); //NO I18N
        break;

        case "closeApp" : //NO I18N
            hideIframe();
        break;

        case "hideClipper" : { //NO I18N
            notebookcx && (notebookcx.style.display = "none");
            notebookcxWrap && (notebookcxWrap.style.display = "none");
            nbDrag && (nbDrag.style.display = "none");
            event.source.postMessage({
                action : "hideClipperResponse", //NO I18N
                isTakeScreenshot : data.isTakeScreenshot
            }, extension.getURL("html/window.html")); //NO I18N
        }
        break;

        case "showClipper" : {
            notebookcx && (notebookcx.style.display = "block");
            notebookcxWrap && (notebookcxWrap.style.display = "block");
            nbDrag && (nbDrag.style.display = "block");
            event.source.postMessage({
                action : "showClipperResponse" //NO I18N
            }, extension.getURL("html/window.html")); //NO I18N
        }
        break;

        case "openReaderView" : {
            let location = document.location;
            let documentClone = document.cloneNode(true);
            let uri = {
                spec: location.href,
                host: location.host,
                prePath: location.protocol + "//" + location.host,
                scheme: location.protocol.substr(0, location.protocol.indexOf(":")),
                pathBase: location.protocol + "//" + location.host + location.pathname.substr(0, location.pathname.lastIndexOf("/") + 1)
            };
            if(documentClone.getElementById("notebookcx")) {
                documentClone.body.removeChild(documentClone.getElementById("notebookcx"));
            }
            article = new Readability(uri, documentClone,this).parse();
            if(!article) {
                event.source.postMessage({
                    action : "Fail" //NO I18N
                }, extension.getURL("html/window.html")); //NO I18N
            }
            injectReaderContent(data.mode);
        }
        break;

        case "closeReaderView" : { //NO I18N
            let nbReaderView = document.getElementById("nb-reader-view"); //NO I18N
            if(!nbReaderView) {
                return;
            }
            document.body.removeChild(nbReaderView);
            
            runtime.sendMessage({
                action: 1000,
                data : {
                    category : "READER_VIEW",
                    action : "CLOSE"
                }
            });
        
        }
        break;

        case "getReaderViewData" : { //NO I18N
            event.source.postMessage({
                action : "getReaderViewDataResponse", //NO I18N
                readerViewData : article
            }, extension.getURL("html/reader-view.html")); //NO I18N
        }
        break;

        case "openClipper" : { //NO I18N
            initWindow();
        }
        break;

        case "hideNbDrag" : {
            nbDrag && (nbDrag.style.display = "none");
        }
        break;

        case "showNbDrag" : {
            nbDrag && (nbDrag.style.display = "block");
        }
        break;

        case "minimizeNbDrag" : {
            if(nbDrag) {
                nbDrag.style.width = "319px";
                nbDrag.style.height = "20px";
                nbDrag.style.right = "0px";
            }
        }
        break;

        case "maximizeNbDrag" : {
            if(nbDrag) {
                nbDrag.style.width = "200px";
                nbDrag.style.height = "52px";
                nbDrag.style.right = "120px";
            }
        }
        break;
    }
});

function injectReaderContent(mode) {
    let readerIframe = document.createElement("iframe"); //NO I18N
    readerIframe.setAttribute("id", "nb-reader-view"); //NO I18N
    readerIframe.setAttribute("src", extension.getURL("html/reader-view.html")); //NO I18N
    readerIframe.setAttribute("style", `
        position: fixed;
        top: 0;
        left: 0;
        height : 100%;
        width: 100%;
        border: none;
        outline: none;
        z-index: 99999999999;
    `);
    document.body.appendChild(readerIframe);
    
    runtime.sendMessage({
        action: 1000,
        data : {
            category : "READER_VIEW",
            action : "OPEN",
            label : mode
        }
    });

    return;
}

function initAnnotator(base64) {
    return new Promise( (resolve, reject) => {
        
        notebookcx.style.display = "none";
        notebookcxWrap.style.display = "none";
        nbDrag.style.display = "none";

        injectAnnotatorCss();

        ZAnnotator.init({
            imageURL: base64,
            finishButton : "Done",//NO I18N
            captureType : "fullpage",
            onFinish: function() {
                notebookcx.style.display = "block";
                notebookcxWrap.style.display = "block";
                nbDrag.style.display = "block";

                $('body').removeClass('noScroll');

                removeAnnotatorCss();
            },

            onSuccess: function (orgEvent) {
                $('body').removeClass('noScroll');
                let newBase64 = base64;
                if(orgEvent.change) {
                    newBase64 = orgEvent.imageSource;
                }

                notebookcx.style.display = "block";
                notebookcxWrap.style.display = "block";
                nbDrag.style.display = "block";
                
                removeAnnotatorCss();

                resolve(newBase64);
            },

            onCancel: function () {
                $('body').removeClass('noScroll');
                try {
                    ZAnnotator.close();
                } catch(e) { }

                notebookcx.style.display = "block";
                notebookcxWrap.style.display = "block";
                nbDrag.style.display = "block";

                removeAnnotatorCss();
                
                resolve(undefined);
            },

            onError:function() {
                $('body').removeClass('noScroll');
                try {
                    ZAnnotator.close();
                } catch(e) { }
                
                notebookcx.style.display = "block";
                notebookcxWrap.style.display = "block";
                nbDrag.style.display = "block";
                
                removeAnnotatorCss();

                resolve(undefined);
            }
        });
    });
}

function showPdfPopup() {
    let taburl = location.href;
    let pdfEmbed = document.getElementsByTagName("embed"); //NO I18N
    if((!taburl.endsWith(".pdf") && (!pdfEmbed  || !pdfEmbed.length || pdfEmbed[0].type != "application/pdf"))) { //NO I18N
        return;
    }

    let pdfPopupDiv = document.createElement("iframe"); //NO I18N
    pdfPopupDiv.setAttribute("id", "nb-pdf-popup");//NO I18N
    pdfPopupDiv.setAttribute("style", `
        position: fixed;
        top: 60px;
        right: 0px;
        border: none;
        height: 50px;
        width: 350px;
        height: 472px;
        width: 300px;
        overflow: hidden;
        z-index: 999999999;
    `);
    pdfPopupDiv.setAttribute("src", extension.getURL("html/pdf-popup.html"));//NO I18N)
    document.body.appendChild(pdfPopupDiv);
}

function showSmartPopup() {
    let smartPopup = document.getElementById("smart-popup");
    if(!smartPopup) {
        smartPopup = document.createElement("iframe");
        smartPopup.setAttribute("id", "smart-popup");
        smartPopup.setAttribute("src", extension.getURL("./html/smart-popup.html"));
        smartPopup.setAttribute("style", "\
            position: relative;\
            width: 100%;\
            height: 100%;\
            margin: auto;\
            border-radius: 10px;\
            box-shadow: none;\
            border: none;"
        );

        let smartPopupWrap = document.createElement("div");
        smartPopupWrap.setAttribute("id", "smart-popup-wrap");
        smartPopupWrap.setAttribute("style", "\
            position: fixed;\
            width: 160px;\
            height: 56px;\
            padding: 22px;\
            z-index: 99999999;\
            cursor: all-scroll;\
            box-sizing: initial;\
            font-size: initial;\
            font-family: initial;\
            color: #4a4a4a;\
            top: 0;\
            bottom: 0;\
            background-color: initial;\
        "
        );
        
        let initialLeft = window.innerWidth - 160 - 52 + "px"; //NO I18N
        let initialTop = window.innerHeight - 56 - 52 + "px"; //NO I18N
        smartPopupWrap.style.left = initialLeft;
        smartPopupWrap.style.top = initialTop;

        smartPopupWrap.appendChild(smartPopup);
        document.body.appendChild(smartPopupWrap);

        setTimeout(function() {
            dragElement(smartPopupWrap);

            window.onresize = function() {
                smartPositionCache.left = initialLeft;
                smartPositionCache.top = initialTop;
                smartPopupWrap.style.left = window.innerWidth - document.getElementById("smart-popup-wrap").offsetWidth - 52 + "px";
                smartPopupWrap.style.top = window.innerHeight - document.getElementById("smart-popup-wrap").offsetHeight - 52 + "px"; 
            };

        }, 2000);
        runtime.sendMessage({
            action : 1000, //NO I18N
            data : {
                category : "POPUP_NOTE", //NO I18N
                action : "SHOW_POPUP", //NO I18N
                label : webapp
            }
        });
    }
}

function hideSmartPopup() {
    let smartPopup = document.getElementById("smart-popup-wrap");
    if(!smartPopup) {
        return;
    }
    document.body.removeChild(smartPopup);
}

function dragElement(elmnt) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    elmnt.onmousedown = dragMouseDown;
    
    function dragMouseDown(e) {
        elmnt.style.transition = "initial"; //NO I18N
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }
  
    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";

        let smartPopup = document.getElementById("smart-popup-wrap");
        smartPopup.style.top = elmnt.style.top;
        smartPopup.style.left = elmnt.style.left;
    }
  
    function closeDragElement() {
      /* stop moving when mouse button is released:*/
      document.onmouseup = null;
      document.onmousemove = null;
    }
}

function initMeetingEventer() {
    //removeIf(firefox)
    eventer(messageEvent, function (event) {
    //endRemoveIf(firefox)

    if(event.data) {

            if(event.origin === extensionUrl) {
                document.activeElement.blur(); //Remove focus from all active element
            }

            switch(event.data) {

                case "saveAsText" : 
                    runtime.sendMessage({
                        action : 1000, //NO I18N
                        data : {
                            category : "POPUP_NOTE", //NO I18N
                            action : "SAVE_AS_TEXT",//NO I18N
                            label : webapp
                        }
                    });
                break;

                case "closeForThisSession" : 
                    let smartPopup = document.getElementById("smart-popup-wrap"); //NO I18N
                    if(!smartPopup) {
                        return;
                    }
                    smartPopup.style.width = "300px"; //NO I18N
                    smartPopup.style.height = "68px"; //NO I18N

                    if(smartPopup.style.left !== "" || smartPopup.style.left !== "initial") {
                        smartPopup.style.left = (parseInt(smartPopup.style.left) - 140) + "px"; //NO I18N
                    }

                    if(parseInt(smartPopup.style.left) <= 0) {
                        smartPopup.style.left = "10px"; //NO I18N
                    }

                    setTimeout(function() {
                        hideSmartPopup();
                        runtime.sendMessage({
                            action : 1000, //NO I18N
                            data : {
                                category : "POPUP_NOTE", //NO I18N
                                action : "CLOSE_ONCE",//NO I18N
                                label : webapp
                            }
                        });
                    }, 4000);
                break;

                case "increaseSmartPopup" : {
                    let smartPopup = document.getElementById("smart-popup-wrap");
                    if(!smartPopup) {
                        return;
                    }
                    
                    smartPopup.style.width = "300px";
                    smartPopup.style.height = "400px";
                    
                    let left = "initial", top = "initial", bottom = "initial"; //NO I18N

                    smartPositionCache.left = smartPopup.style.left;
                    smartPositionCache.top = smartPopup.style.top;

                    /* ---
                        #smart-popup-wrap width -> 160 (minimized)
                        #smart-popup width -> 52
                        #smart-popup-wrap height -> 400 (full)
                        #smart-popup-wrap width -> 300 (full)
                    --- */

                    let offsetLeft = document.getElementById("smart-popup-wrap").offsetLeft;
                    let offsetTop = document.getElementById("smart-popup-wrap").offsetTop;
            
                    /* --- OPEN THE POP-UP IN THE LEFT TO RIGHT SIDE --- */
                    left =  (offsetLeft + 160 - 52) + "px"; //default //NO I18N

                    if(window.innerWidth < parseInt(left) + 300) {
                        /* --- OPEN THE POP-UP IN THE RIGHT TO LEFT SIDE --- */
                        left = (offsetLeft - 300 + 160) + "px"; //NO I18N
                    }

                    if(window.innerHeight < offsetTop + 400) {
                        /* --- OPEN THE POP-UP IN THE BOTTOM TO TOP SIDE --- */
                        bottom = (window.innerHeight - (offsetTop + 100)) + "px"; //NO I18N                    
                        top = "initial"; //NO I18N
                    }
                    else {
                        /* --- OPEN THE POP-UP IN THE TOP TO BOTTOM SIDE --- */
                        top = offsetTop + "px"; //default //NO I18N
                        bottom = "initial"; //NO I18N
                    }

                    smartPopup.style.left = left;
                    smartPopup.style.top = top;
                    smartPopup.style.bottom = bottom;

                    event.source.postMessage("showEditor", extension.getURL("html/smart-popup.html")); //NO I18N

                    event.source.postMessage({
                        action : "meetingSite",//NO I18N
                        webapp : webapp
                    }, extension.getURL("html/smart-popup.html")); //NO I18N

                    runtime.sendMessage({
                        action : 1000, //NO I18N
                        data : {
                            category : "POPUP_NOTE", //NO I18N
                            action : "OPEN",//NO I18N
                            label : webapp
                        }
                    });

                    setTimeout(function() {
                        let smartPopupIframe = document.getElementById("smart-popup"); //NO I18N
                        if(smartPopupIframe) {
                            smartPopupIframe.style.boxShadow = "0px 8px 16px rgba(0,0,0,0.25)"; //NO I18N
                        }
                    }, 300);
                }    
                break;

                case "reduceSmartPopup" : {
                    let smartPopup = document.getElementById("smart-popup-wrap");
                    if(!smartPopup) {
                        return;
                    }
                    //smartPopup.style.transition = "initial"; //NO I18N
                    smartPopup.style.width = "160px";
                    smartPopup.style.height = "56px";
                    smartPopup.style.left = smartPositionCache.left;
                    smartPopup.style.top = smartPositionCache.top;
                    
                    runtime.sendMessage({
                        action : 1000, //NO I18N
                        data : {
                            category : "POPUP_NOTE", //NO I18N
                            action : "CLOSE",//NO I18N
                            label : webapp
                        }
                    });
                }
                break;

                case "minimize" : {
                    let smartPopup = document.getElementById("smart-popup-wrap");
                    if(!smartPopup) {
                        return;
                    }

                    smartPopup.style.transition = "height 0.3s ease-in-out"; //NO I18N

                    smartPopup.style.height = "48px";

                    setTimeout(function() {
                        smartPopup.style.transition = "initial"; //NO I18N
                    }, 300);

                    runtime.sendMessage({
                        action : 1000, //NO I18N
                        data : {
                            category : "POPUP_NOTE", //NO I18N
                            action : "MINIMIZE",//NO I18N
                            label : webapp
                        }
                    });
                }
                break;

                case "maximize" : {
                    let smartPopup = document.getElementById("smart-popup-wrap");
                    if(!smartPopup) {
                        return;
                    }

                    smartPopup.style.transition = "height 0.3s ease-in-out"; //NO I18N
                    smartPopup.style.height = "400px";

                    setTimeout(function() {
                        smartPopup.style.transition = "initial"; //NO I18N
                    }, 300);

                    runtime.sendMessage({
                        action : 1000, //NO I18N
                        data : {
                            category : "POPUP_NOTE", //NO I18N
                            action : "MAXIMIZE",//NO I18N
                            label : webapp
                        }
                    });
                }
                break;

                case "hideBoxShadow" : 
                    let smartPopupIframe = document.getElementById("smart-popup"); //NO I18N
                    if(smartPopupIframe) {
                        smartPopupIframe.style.boxShadow = "none"; //NO I18N
                    }
                break;
            }
        }
    //removeIf(firefox)
    });
    //endRemoveIf(firefox)

    }

function showRecipePopup() {
    let recipePopupDiv = document.createElement("iframe"); //NO I18N
    recipePopupDiv.setAttribute("id", "nb-recipe-popup");//NO I18N
    recipePopupDiv.setAttribute("style", `
        position: fixed;
        height: 472px;
        width: 330px;
        border: 0px;
        z-index: 999999999999;
        display: block;
        top: 60px;
        right: 20px;
    `);
    recipePopupDiv.setAttribute("src", extension.getURL("html/recipe-popup.html"));//NO I18N)
    document.body.appendChild(recipePopupDiv);
}

function initRecipeEventer() {

    //removeIf(firefox)
    eventer(messageEvent, function (event) {
    //endRemoveIf(firefox)

    if(!event.data) {
            return;
        }
        switch(event.data) {

            case "closeRecipePopup" : 
                removeRecipePopup();
            break;
        }

    //removeIf(firefox)
    });
    //endRemoveIf(firefox)

    }

function removeRecipePopup() {
    let nbRecipePopup = document.getElementById("nb-recipe-popup"); //NO I18N
    if(nbRecipePopup) {
        nbRecipePopup.parentElement.removeChild(nbRecipePopup);
    }
}

function reduceNotebookcxIndex() {
    if(notebookcx) {
        notebookcx.style.zIndex = 999999999999;
        notebookcx.style.pointerEvents = "none"; //NO I18N
    }
    if(notebookcxWrap) {
        notebookcxWrap.style.zIndex = 9999999999999;
    }
}

function partialAnnotator(imgDetails) {

    if(!imgDetails) {
        notebookcx.style.display = "block"; //NO I18N
        notebookcxWrap.style.display = "block"; //NO I18N
        return;
    }

    let isFirefox = false;
    
    var img = new Image();
    var width,height;
    img.src = imgDetails.base64;
    img.onload = function() {
        var ratio = this.width / imgDetails.positionValues.width;
        if(isFirefox){
            ratio = Math.round(ratio * 100) / 100;
            ratio = parseInt(ratio);
        } else{
            ratio = imgDetails.pixRatio;
        }
        width = (imgDetails.positionValues.x2 - imgDetails.positionValues.x1)*ratio;
        height = (imgDetails.positionValues.y2 - imgDetails.positionValues.y1) *ratio;
        var canvas = $("<canvas/>", {
            id: "zannotator__canvas--partialScreen",//No i18n
            class: "zannotator__canvas--partialScreen"//No i18n
        }).attr({
            width: width,
            height: height
        }).css({
            width: width,
            height: height
        });
        $("body").append(canvas);
        canvas = document.getElementById("zannotator__canvas--partialScreen");
        var canvasCtx = canvas.getContext("2d");//No i18n
        canvasCtx.drawImage(this, imgDetails.positionValues.x1 * ratio, imgDetails.positionValues.y1 * ratio, width , height, 0, 0, width, height);
        $("#zannotator__canvas--partialScreen").remove();

        initAnnotator(canvas.toDataURL()).then((newBase64) => {
            notebookcx.contentWindow.postMessage({
                action : "webImageDrop",
                base64 : newBase64
            }, extension.getURL("html/window.html")); 
        });
    }
}

document.onkeydown = function(event) {
    if(event.keyCode === 27) { 
        //ESC KEY
        if(!document.getElementById("zimageeditor")) {
            hideIframe();
        }
    }
}

function dragElementNbDrag(elmnt) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    elmnt.onmousedown = dragMouseDown;
    
    function dragMouseDown(e) {
        elmnt.style.transition = "initial"; //NO I18N
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }
  
    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";

        if(notebookcx) {
            notebookcx.style.top = elmnt.style.top;
            notebookcx.style.left = elmnt.style.left;
        }

        if(notebookcxWrap) {
            notebookcxWrap.style.top = elmnt.style.top;
            notebookcxWrap.style.left = elmnt.style.left;
        }
    }
  
    function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;

        resetZindex();

        saveClipperPosition();
    }
}

function resetZindex() {
    if(notebookcxWrap) {
        notebookcxWrap.style.zIndex = "99999999";
    }

    if(notebookcx) {
        notebookcx.style.zIndex = "999999999";
        notebookcx.style.pointerEvents = "initial"; //NO I18N
    }

    if(nbDrag) {
        nbDrag.style.zIndex = "9999999999";
    }
}

function saveClipperPosition() {
    if(notebookcx) {
        runtime.sendMessage({
            action: 1035,
            data : {
                top : notebookcx.style.top,
                left : notebookcx.style.left
            }
        });
    }
}

function setClipperPosition(clipper_position) {
    if(clipper_position && clipper_position.left && clipper_position.top) {
        notebookcx.style.left = clipper_position.left;
        notebookcxWrap.style.left = clipper_position.left;
        nbDrag.style.left = clipper_position.left;

        notebookcx.style.top = clipper_position.top;
        notebookcxWrap.style.top = clipper_position.top;
        nbDrag.style.top = clipper_position.top;
    }
}

function resetClipperPosition() {
    if(notebookcx && notebookcxWrap && nbDrag) {
        notebookcx.style.left = "initial";
        notebookcxWrap.style.left = "initial";
        nbDrag.style.left = "initial";
        
        notebookcx.style.right = "0px";
        notebookcxWrap.style.right = "0px";
        nbDrag.style.right = "120px";

        notebookcx.style.top = "0px";
        notebookcxWrap.style.top = "0px";
        nbDrag.style.top = "0px";

        notebookcx.style.width = "320px";
        notebookcx.style.height = "525px";

        notebookcxWrap.style.width = "320px";
        notebookcxWrap.style.height = "525px";

        nbDrag.style.width = "200px";
        nbDrag.style.height = "52px";
        
        saveClipperPosition();
    }
}

function getResizerFragment() {

    let resizerFragment = document.createDocumentFragment();

    let topLeft = document.createElement("div");
    topLeft.className = "nb-resizer nb-top-left";

    let topRight = document.createElement("div");
    topRight.className = "nb-resizer nb-top-right";
    
    let bottomLeft = document.createElement("div");
    bottomLeft.className = "nb-resizer nb-bottom-left";

    let bottomRight = document.createElement("div");
    bottomRight.className = "nb-resizer nb-bottom-right";

    resizerFragment.appendChild(topLeft);
    resizerFragment.appendChild(topRight);
    resizerFragment.appendChild(bottomLeft);
    resizerFragment.appendChild(bottomRight);

    let resizeStyle = document.createElement("style");
    resizeStyle.innerHTML = `

    .nb-resizer {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: white;
        border: 3px solid #4286f4;
        position: absolute;
        opacity: 0;
    }

    .nb-resizer.nb-top-left {
        left: -15px;
        top: -15px;
        height: 100%;
        width: 100%;
        cursor: nesw-resize;
    }

    .nb-resizer.nb-top-right {
        right: -15px;
        top: -15px;
        height: 100%;
        width: 100%;
        cursor: nesw-resize;
    }

    .nb-resizer.nb-bottom-left {
        left: -15px;
        bottom: -15px;
        height: 100%;
        width: 100%;
        cursor: nesw-resize;
    }

    .nb-resizer.nb-bottom-right {
        right: -15px;
        bottom: -15px;
        height: 100%;
        width: 100%;
        cursor: nesw-resize;
    }
    `;
    
    resizerFragment.appendChild(resizeStyle);

    return resizerFragment;
}

function makeResizableDiv(div) {
    const element = document.querySelector(div);
    const resizers = document.querySelectorAll(div + " .nb-resizer");
    const minimum_size = 20;
    let original_width = 0;
    let original_height = 0;
    let original_x = 0;
    let original_y = 0;
    let original_mouse_x = 0;
    let original_mouse_y = 0;
    for(let i = 0;i < resizers.length; i++) {
        const currentResizer = resizers[i];
        currentResizer.addEventListener("mousedown", function(e) {
            e.preventDefault();
            original_width = parseFloat(getComputedStyle(element, null).getPropertyValue('width').replace('px', ''));
            original_height = parseFloat(getComputedStyle(element, null).getPropertyValue('height').replace('px', ''));
            original_x = element.getBoundingClientRect().left;
            original_y = element.getBoundingClientRect().top;
            original_mouse_x = e.pageX;
            original_mouse_y = e.pageY;
            window.addEventListener("mousemove", resize);
            window.addEventListener("mouseup", stopResize);
        });
      
        function resize(e) {
            if(currentResizer.classList.contains("nb-bottom-right")) {
                const width = original_width + (e.pageX - original_mouse_x);
                const height = original_height + (e.pageY - original_mouse_y)
                if(width > minimum_size) {
                    element.style.width = width + "px";
                    notebookcx.style.width = width + "px";
                }
                if (height > minimum_size) {
                    element.style.height = height + "px";
                    notebookcx.style.height = height + "px";
                }
            }
            else if(currentResizer.classList.contains('nb-bottom-left')) {
                const height = original_height + (e.pageY - original_mouse_y)
                const width = original_width - (e.pageX - original_mouse_x)
                if (height > minimum_size) {
                    element.style.height = height + "px";
                    notebookcx.style.height = height + "px";
                }
                if (width > minimum_size) {
                    element.style.width = width + "px";
                    notebookcx.style.width = width + "px";

                    element.style.left = original_x + (e.pageX - original_mouse_x) + "px";
                    notebookcx.style.left = original_x + (e.pageX - original_mouse_x) + "px";
                }
            }
            else if(currentResizer.classList.contains('nb-top-right')) {
                const width = original_width + (e.pageX - original_mouse_x)
                const height = original_height - (e.pageY - original_mouse_y)
                if (width > minimum_size) {
                    element.style.width = width + "px";
                    notebookcx.style.width = width + "px";
                }
                if (height > minimum_size) {
                    element.style.height = height + "px";
                    notebookcx.style.height = height + "px";

                    element.style.top = original_y + (e.pageY - original_mouse_y) + "px";
                    notebookcx.style.top = original_y + (e.pageY - original_mouse_y) + "px";
                }
            }
            else {
                const width = original_width - (e.pageX - original_mouse_x)
                const height = original_height - (e.pageY - original_mouse_y)
                if(width > minimum_size) {
                    element.style.width = width + "px";
                    notebookcx.style.width = width + "px";

                    element.style.left = original_x + (e.pageX - original_mouse_x) + "px";
                    notebookcx.style.left = original_x + (e.pageX - original_mouse_x) + "px";
                }
                if(height > minimum_size) {
                    element.style.height = height + "px";
                    notebookcx.style.height = height + "px";

                    element.style.top = original_y + (e.pageY - original_mouse_y) + "px";
                    notebookcx.style.top = original_y + (e.pageY - original_mouse_y) + "px";
                }
            }
            
            let offset = notebookcx.getBoundingClientRect();
            nbDrag.style.left = offset.left + "px";
            nbDrag.style.top = offset.top + "px";
        }
      
        function stopResize() {
            window.removeEventListener('mousemove', resize)
        }
    }
  }
  
document.ondblclick = function() {
    resetClipperPosition();
}

function openAnnotator(data) {
    initAnnotator(data.base64).then((newBase64) => {
        if(!newBase64) {
            return;
        }
        notebookcx.contentWindow.postMessage({
            action : "webImageDrop",
            base64 : newBase64
        }, extension.getURL("html/window.html")); 
    });
}

let loadingIframe = document.createElement("iframe");
loadingIframe.setAttribute("style", `
        position: fixed;
        top: 0;
        left: 0;
        height : 100%;
        width: 100%;
        border: none;
        outline: none;
        z-index: 99999999999;
    `);
loadingIframe.setAttribute("src", extension.getURL("html/loading.html"));

function showLoadingIframe() {
    document.body.appendChild(loadingIframe);
}

function hideLoadingIframe() {
    document.body.removeChild(loadingIframe);
}

function removeAnnotatorCss() {
    var annotatorCss = document.getElementById("nb-annotator-css"); //NO I18N
    if(annotatorCss) {
        document.body.removeChild(annotatorCss);
    }
}

function injectAnnotatorCss() {
    var css_path = extension.getURL("vendor/zoho/annotator/annotator.css");//NO I18N
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", css_path, false);
    rawFile.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && (rawFile.status === 200 || rawFile.status === 0)) {
            var data = rawFile.responseText;
            data = data.replace(/__MSG_@@extension_id__/gi, chrome.runtime.id);
            var style = document.createElement("style");
            style.innerHTML = data;
            style.id = "nb-annotator-css"; //NO I18N
            if(document.body !== null && document.body !== "undefined") {
                document.body.appendChild(style);
            }
        }
    };
    rawFile.send(null);
}