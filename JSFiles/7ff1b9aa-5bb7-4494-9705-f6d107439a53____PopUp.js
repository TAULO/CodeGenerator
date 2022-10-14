const cursorContainerWelcomePopUp = document.getElementById('cursor-container-welcome');
const topCursorContainerUserPopUp = document.getElementById('top-cursor-container');
const togBtn = document.getElementById('togBtn');
const extensionOff = document.getElementById('extension-off');
const extensionNotWorking = document.getElementById('extension-not-working');
const extensionNotWorkingWelcome = document.getElementById('extension-not-working-welcome');
const userCollectionPopUp = document.getElementById('user-collection-pop-up');
const welcomePopUp = document.getElementById('welcome-pop-up');
const buttonsUserCollectionPopUp = document.getElementById('buttons-user-collection-popup');
const sizeDotContainerOff = document.getElementById('size-dot-container-off');
const sizeDotContainer = document.getElementById('size-dot-container');
let indexNumber = 28;
let userCollection = [];
chrome.storage.local.set({"tryingUrl" : "off"})

chrome.storage.local.get(['cursor_size', 'topCollection', 'user_collection', 'extension_play', 'isExtensionWorking', 'obj_cursor_url'], function(result) {
    userCollection = result.user_collection;
    if (result.user_collection !== undefined && Array.isArray(result.user_collection) && result.user_collection.length > 0) {
        userCollectionPopUp.style.display = 'flex';
        welcomePopUp.style.display = 'none';
    }
    else {
        userCollectionPopUp.style.display = 'none';
        welcomePopUp.style.display = 'flex';

    }
    document.getElementById(result.cursor_size).classList.add('active');
    document.getElementById(result.cursor_size + '-o').classList.add('active-off');

    if (result.extension_play === 'on') {
        togBtn.checked = true;
    }
    else if (result.extension_play === 'off') {
        togBtn.checked = false;
        extensionOff.style.display = 'flex';
    }

    if (result.user_collection !== undefined && Array.isArray(result.user_collection) && result.user_collection.length > 0) {
        if (result.isExtensionWorking === false) {
            extensionNotWorking.style.display = 'flex';
        }
    }
    else {
        if (result.isExtensionWorking === false) {
            extensionNotWorkingWelcome.style.display = 'flex';
        }
    }

    if (result.user_collection){
        result.topCollection.forEach((item, index) => {
            if (index <= 27) {
                const isInUserCollection = result.user_collection.find(cursor => cursor.id === item.id);
                if (!isInUserCollection) {
                    if (result.user_collection !== undefined && Array.isArray(result.user_collection) && result.user_collection.length > 0) {
                        drawTopCursorsInWelcomePopUp(item, index, topCursorContainerUserPopUp, 'user', userCollection);
                    }
                }
                drawTopCursorsInWelcomePopUp(item, index, cursorContainerWelcomePopUp, 'welcome');
            }
        });
    } else {
        result.topCollection.forEach((item, index) => {
            if (index <= 27){
                if (result.user_collection !== undefined && Array.isArray(result.user_collection) && result.user_collection.length > 0) {
                    drawTopCursorsInWelcomePopUp(item, index, topCursorContainerUserPopUp, 'user', userCollection);
                }
                drawTopCursorsInWelcomePopUp(item, index, cursorContainerWelcomePopUp, 'welcome');
            }
        });
    }




    if (topCursorContainerUserPopUp.childElementCount === 0) {
        document.getElementById('collection-top-cursor-header').style.display = 'none';
        topCursorContainerUserPopUp.style.display = 'none';
    }

    if (result.user_collection) {
        result.user_collection.forEach((item, index) => {
            drawUserCursors(item);
        });
    }

    if (result.obj_cursor_url && result.extension_play === 'on') {
        changeCursor(result.obj_cursor_url.urlCursor, result.obj_cursor_url.urlPointer);
    }

});

function setOnClickListener() {
    document.getElementById('button-get-more-welcome').addEventListener('click', () => {
        window.open('https://mycustomcursors.online/cursor-collection', '_blank').focus();
    });

    document.getElementById('more-cursors-btn-welcome').addEventListener('click', () => {
        window.open('https://mycustomcursors.online/cursor-collection', '_blank').focus();
    });

    document.getElementById('button-go-to-collection').addEventListener('click', () => {
        chrome.storage.local.get(['user_collection', 'topCollection', 'isExtensionWorking'], function(result) {

            const containerCursor = document.getElementById('top-cursor-container');

            while (containerCursor.firstChild) {
                containerCursor.removeChild(containerCursor.lastChild);
            }

            result.topCollection.forEach((item, index) => {
                if (index <= 27) {
                    const isInUserCollection = result.user_collection.find(cursor => cursor.id === item.id);
                    if (!isInUserCollection) {
                        if (result.user_collection !== undefined && Array.isArray(result.user_collection) && result.user_collection.length > 0) {
                            drawTopCursorsInWelcomePopUp(item, index, topCursorContainerUserPopUp, 'user', userCollection);
                        }
                    }
                }
            });


            if (topCursorContainerUserPopUp.childElementCount === 0) {
                document.getElementById('collection-top-cursor-header').style.display = 'none';
                topCursorContainerUserPopUp.style.display = 'none';
            }

            if (topCursorContainerUserPopUp.childElementCount > 0 && topCursorContainerUserPopUp.style.display === "none") {
                document.getElementById('collection-top-cursor-header').style.display = 'flex';
                topCursorContainerUserPopUp.style.display = 'flex';
            }
            if (result.user_collection) {
                result.user_collection.forEach((item) => {
                    drawUserCursors(item);
                });
                if (result.isExtensionWorking === false) {
                    extensionNotWorking.style.display = 'flex';
                    extensionNotWorkingWelcome.style.display = 'none';
                }
                userCollectionPopUp.style.display = 'flex';
                welcomePopUp.style.display = 'none';
            }
        });
    });

    document.getElementById('resize-button').addEventListener('click', () => {
        chrome.storage.local.get(['obj_cursor_url', "tryingUrl"], function(result) {
            console.log(result.tryingUrl)
            if (!result.obj_cursor_url || result.obj_cursor_url === '' || result.obj_cursor_url.urlCursor === "" ||  result.obj_cursor_url.urlPointer === "" ) {
                if (result.tryingUrl === "off") {
                    buttonsUserCollectionPopUp.style.display = 'none';
                    sizeDotContainerOff.style.display = 'flex';
                } else {
                    buttonsUserCollectionPopUp.style.display = 'none';
                    sizeDotContainer.style.display = 'flex';
                }
            }
            else {
                buttonsUserCollectionPopUp.style.display = 'none';
                sizeDotContainer.style.display = 'flex';
            }
        });

    });

    document.getElementById('x-for-resize').addEventListener('click', () => {
        sizeDotContainer.style.display = 'none';
        buttonsUserCollectionPopUp.style.display = 'flex';
    });

    document.getElementById('x-for-resize-off').addEventListener('click', () => {
        sizeDotContainerOff.style.display = 'none';
        buttonsUserCollectionPopUp.style.display = 'flex';
    });

    document.getElementById('welcome-logo').addEventListener('click', () => {
        window.open('https://mycustomcursors.online/cursor-collection', '_blank').focus();
    });

    document.getElementById('welcome-how-to-use-container').addEventListener('click', () => {
        window.open('https://mycustomcursors.online/how-to-use', '_blank').focus();
    });

    document.getElementById('button-get-more').addEventListener('click', () => {
        window.open('https://mycustomcursors.online/cursor-collection', '_blank').focus();
    });

    document.getElementById('welcome-logo-user').addEventListener('click', () => {
        window.open('https://mycustomcursors.online/cursor-collection', '_blank').focus();
    });

    document.getElementById('how-to-use-button').addEventListener('click', () => {
        window.open('https://mycustomcursors.online/how-to-use', '_blank').focus();
    });

    document.getElementById('togBtn').addEventListener('change', () => {
        chrome.storage.local.get(['extension_play', 'obj_cursor_url', 'default_url'], async function(result) {
            if (result.extension_play === 'on') {
                chrome.storage.local.set({'extension_play': 'off'});
                extensionOff.style.display = 'flex';
                disableCursor();
                chrome.storage.local.set({'turn_off': 'off'});
                chrome.storage.local.set({"tryingUrl" : "off"})
                chrome.tabs.query({}, function(tabs) {
                    tabs.forEach(tab => {
                        if (tab.active){
                            chrome.tabs.sendMessage(tab.id, {type : "sendUpdate"}, (response) => {

                            })
                        }
                    })
                })
            }
            else if (result.extension_play === 'off') {
                chrome.storage.local.set({
                    'extension_play': 'on',
                    'obj_cursor_url': '',
                });
                chrome.storage.local.set({'obj_cursor_url': result.obj_cursor_url});
                changeCursor(result.obj_cursor_url.urlCursor, result.obj_cursor_url.urlPointer);
                extensionOff.style.display = 'none';
                chrome.storage.local.set({'turn_off': 'on'});
                chrome.tabs.query({}, function(tabs) {
                    tabs.forEach(tab => {
                        if (tab.active){
                            chrome.tabs.sendMessage(tab.id, {type : "sendUpdate"}, (response) => {

                            })
                        }
                    })
                })
            }
        });

    });

    document.getElementById('extension-off').addEventListener('click', () => {
        chrome.storage.local.get(['extension_play', 'obj_cursor_url', 'default_url'], async function(result) {
            if (result.extension_play === 'on') {
                chrome.storage.local.set({'extension_play': 'off'});
                extensionOff.style.display = 'flex';
                disableCursor();
                chrome.storage.local.set({'turn_off': 'off'});
                chrome.storage.local.set({"tryingUrl" : "off"})
            }
            else if (result.extension_play === 'off') {
                chrome.storage.local.set({
                    'extension_play': 'on',
                    'obj_cursor_url': '',
                });
                chrome.storage.local.set({'obj_cursor_url': result.obj_cursor_url});
                changeCursor(result.obj_cursor_url.urlCursor, result.obj_cursor_url.urlPointer);
                extensionOff.style.display = 'none';
                chrome.storage.local.set({'turn_off': 'on'});
                togBtn.checked = true;
            }
        });

    });
}

setOnClickListener();

function getStyle(element, property) {
    return (getComputedStyle(element, null).getPropertyValue(property));
}

function changeCursor(urlCursor, urlPointer) {
    let styleSheet = document.createElement('style');

    styleSheet.type = 'text/css';
    styleSheet.rel = 'stylesheet';

    styleSheet.innerHTML = `.cursor-hover {\n  cursor: url('${urlCursor}') 0 0, default !important;\n        }\n 
     a,  button, .pointer-hover {\n  cursor: url('${urlPointer}') 0 0, pointer !important;\n        }\n`;

    document.head.appendChild(styleSheet);
}

function disableCursor() {
    let styleSheet = document.createElement('style');

    styleSheet.type = 'text/css';
    styleSheet.rel = 'stylesheet';

    styleSheet.innerHTML = `a, button, .cursor-hover {\n  cursor: default !important;\n        }\n 
    a, button, .pointer-hover {\n  cursor: pointer !important;\n        }\n `;
    document.head.appendChild(styleSheet);
}

document.body.addEventListener('mouseover', event => {
    let pointer = getStyle(event.target, 'cursor');
    if (pointer === 'pointer') {
        event.target.classList.add('pointer-hover');
    }
    else if (pointer === 'default' || pointer === 'auto') {
        event.target.classList.add('cursor-hover');
    }
});

function resizeDataURL(data, wantedWidth, wantedHeight, type) {
    return new Promise(function(resolve, reject) {
        let img = document.createElement('img');
        img.onload = function() {
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');
            canvas.width = wantedWidth;
            canvas.height = wantedHeight;
            ctx.drawImage(img, 0, 0, wantedWidth, wantedHeight);
            resolve({type: type, data: canvas.toDataURL('image/png', 1)});
            img = null;
            canvas = null;
        };

        img.crossOrigin = 'anonymous';
        img.src = data;
    });
}

function resizeCurrentCursor() {
    chrome.storage.local.get(['default_url', 'tryingUrl'], async function(result) {
        if (result.tryingUrl !== "off") {
            if (result.default_url.urlCursor) {
                const urlsDefault = await getResizedUrl(result.default_url.urlCursor, result.default_url.urlPointer);
                chrome.storage.local.set({'obj_cursor_url': urlsDefault});
            }
            const urls = await getResizedUrl(result.tryingUrl.urlCursor, result.tryingUrl.urlPointer);
            changeCursor(urls.urlCursor, urls.urlPointer);
        } else {
            if (result.default_url) {
                const urls = await getResizedUrl(result.default_url.urlCursor, result.default_url.urlPointer);
                changeCursor(urls.urlCursor, urls.urlPointer);
                chrome.storage.local.set({'obj_cursor_url': urls});
            }
        }
    });
}

//dot-o class is the class of the dots' ui for change size when no cursor chosen
// dot class is the class of the dots' ui for change size when cursor chosen
function onClickForResize() {
    const dotArray = document.getElementsByClassName('dot');
    const dotOArray = document.getElementsByClassName('dot-o');
    Array.from(dotArray).forEach(dot => {
        dot.addEventListener('click', (event) => {
            if (!dot.classList.contains('active')) {
                Array.from(dotOArray).forEach(dotOffUiSize => {
                    if (dot.id + '-o' !== dotOffUiSize.id) {
                        if (dotOffUiSize.classList.contains('active-off')) {
                            dotOffUiSize.classList.remove('active-off');
                        }
                    }
                    else {
                        dotOffUiSize.classList.add('active-off');
                    }
                });

                Array.from(dotArray).forEach(dotIn => {
                    if (dot.id !== dotIn.id) {
                        if (dotIn.classList.contains('active')) {
                            dotIn.classList.remove('active');
                        }
                    }
                });
                chrome.storage.local.set({'cursor_size': dot.id});
                dot.classList.add('active');
                resizeCurrentCursor();
            }
        });
    });
}

onClickForResize();

function checkCursorSize() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['cursor_size'], function(result) {
            let width = '';
            let height = '';
            switch (result.cursor_size) {
            case 'one' :
                width = 16;
                height = 16;
                break;
            case 'two' :
                width = 22;
                height = 22;
                break;
            case 'three':
                width = 32;
                height = 32;
                break;
            case 'four':
                width = 38;
                height = 38;
                break;
            case 'five':
                width = 42;
                height = 42;
                break;
            case 'six' :
                width = 50;
                height = 50;
                break;
            }
            resolve({
                'width': width,
                'height': height,
            });
        });

    });
}

function getResizedUrl(cursorUrl, pointerUrl) {
    return new Promise(async(resolve, reject) => {
        const sizeObj = await checkCursorSize();
        const dataResizedCursor = await resizeDataURL(cursorUrl, sizeObj.width, sizeObj.height, 'cursor');
        const dataResizedPointer = await resizeDataURL(pointerUrl, sizeObj.width, sizeObj.height, 'cursor');
        const newObj = {
            urlCursor: dataResizedCursor.data,
            urlPointer: dataResizedPointer.data,
        };
        resolve(newObj);
    });
}

function changeTxtColorAndTextTryingButton(type, element) {
    if (type === 'trying') {
        const buttonTxt = element.querySelector('.try-txt-welcome');
        buttonTxt.style.color = '#197DE1';
        buttonTxt.innerHTML = 'STOP TRYING';
    }
    else {
        const buttonTxt = element.querySelector('.try-txt-welcome');
        buttonTxt.style.color = '#FFFFFF';
        buttonTxt.innerHTML = 'TRY';
    }
}

function disableTrying() {
    document.querySelectorAll('.try-button-welcome').forEach(button => {
        if (button.getAttribute('trying') === 'true') {
            button.setAttribute('trying', 'false');
            button.style.backgroundColor = '#9F25FF';
            const anotherButtonTxt = button.querySelector('.try-txt-welcome');
            anotherButtonTxt.innerHTML = 'TRY';
            anotherButtonTxt.style.color = '#ffffff';
        }
    });
}

function checkIfAnotherButtonTrying(index) {
    document.querySelectorAll('.try-button-welcome').forEach(button => {
        if (button.id !== index.toString()) {
            if (button.getAttribute('trying') === 'true') {
                button.setAttribute('trying', 'false');
                button.style.backgroundColor = '#9F25FF';
                const anotherButtonTxt = button.querySelector('.try-txt-welcome');
                anotherButtonTxt.innerHTML = 'TRY';
                anotherButtonTxt.style.color = '#ffffff';
            }
        }
    });
}

async function onClickTry(event, item, element, index) {
    const mainElement = element.querySelector('.try-button-welcome');
    const sizeOn = document.getElementById('size-dot-container');
    const sizeOff = document.getElementById('size-dot-container-off');
    if (mainElement.getAttribute('trying') === 'false') {
        const urlCursor = item.cursor_path ? item.cursor_path : item.cursor.newPath;
        const urlPointer = item.pointer_path ? item.pointer_path : item.pointer.newPath;
        const url = await getResizedUrl(urlCursor, urlPointer);

        mainElement.style.backgroundColor = '#F6FBFF';

        changeTxtColorAndTextTryingButton('trying', element);
        changeCursor(url.urlCursor, url.urlPointer);
        checkIfAnotherButtonTrying(index);

        chrome.storage.local.set({"tryingUrl" : {urlCursor, urlPointer}})

        if (sizeOff.style.display === "flex") {
            sizeOff.style.display = "none";
            sizeOn.style.display = "flex";
        }

        mainElement.setAttribute('trying', 'true');
    }
    else if (mainElement.getAttribute('trying') === 'true') {
        disableCursor();
        mainElement.style.backgroundColor = '#9F25FF';
        changeTxtColorAndTextTryingButton('stop', element);
        mainElement.setAttribute('trying', 'false');
        chrome.storage.local.get('obj_cursor_url', function(result) {
            if (result.obj_cursor_url !== null) {
                changeCursor(result.obj_cursor_url.urlCursor, result.obj_cursor_url.urlPointer);
            }
        });

        if (sizeOn.style.display === "flex") {
            sizeOn.style.display = "none";
            sizeOff.style.display = "flex";
        }

        chrome.storage.local.set({"tryingUrl" : "off"})

    }
}

function addCursor(cursorId, element) {
    chrome.runtime.sendMessage({type: 'ADD', cursorId: cursorId}, function(response) {
        if (response === 'ok') {
            const backgroundElement = element.querySelector('.add-button-welcome');
            backgroundElement.style.background = '#00D108';
            backgroundElement.querySelector('.image-add-welcome').src = '../asset/v-small.svg';
            element.querySelector('.v').style.display = 'flex';
            chrome.storage.local.get(['user_collection'], function(result) {
                userCollection = result.user_collection;
            });
            if (document.getElementById('user-collection-pop-up').style.display === 'flex'){
                topCursorContainerUserPopUp.removeChild(element)
                if (topCursorContainerUserPopUp.childElementCount === 0) {
                    document.getElementById('collection-top-cursor-header').style.display = 'none';
                    topCursorContainerUserPopUp.style.display = 'none';
                }

            }
        }
    });
}

function setInnerHtml(display, src, backgroundColor, index, item) {
    const cursorUrl = item.cursor?.newPath ? item.cursor.newPath : item.cursor_path;
    const pointerUrl = item.pointer?.newPath ? item.pointer.newPath : item.pointer_path;
    return `<div class="cube-welcome">
                           <img class="img-cube-welcome" src="${cursorUrl}" alt="pony"/>
                           <div class="v" style="display:${display}">
                              <img class="v-img" src="../asset/v.svg" alt="v" />
                           </div>
                       </div>
                       
                       <div class="cube-hover-welcome">
                           <div class="inner-cube-welcome">
                               <div class="img-cube-hover-welcome">
                                   <img class="img-cube-welcome" src="${pointerUrl}" alt="pony"/>
                               </div>
                               <div class="buttons-inner-cube-welcome">
                                   <div id="${index}" trying="false" class="try-button-welcome">
                                       <div class="try-txt-welcome">
                                           TRY
                                       </div>
                                   </div>
                                   <div class="add-button-welcome" style="background:${backgroundColor}">
                                       <img class="image-add-welcome" src="${src}" alt="add"/>
                                   </div>
                               </div>
                           </div>
                       </div>`;
}

function checkTheStyleForTopCursorCube(type, collection, item) {
    let display = 'none';
    let src = '../asset/ADD.svg';
    let backgroundColor = 'linear-gradient(269.42deg, #006EDD 0%, #004585 100%)';
    if (type === 'user') {
        if (collection) {
            collection.forEach(cursor => {
                if (cursor.id === item.id) {
                    display = 'flex';
                    src = '../asset/v-small.svg';
                    backgroundColor = '#00D108';
                }
            });
        }
    }
    else {
        chrome.storage.local.get('user_collection', function(result) {
            if (result.user_collection) {
                userCollection.forEach(cursor => {
                    if (cursor.id === item.id) {
                        display = 'flex';
                        src = '../asset/v-small.svg';
                        backgroundColor = '#00D108';
                    }
                });
            }
        });

    }
    return {'display': display, 'src': src, 'backgroundColor': backgroundColor};
}

function drawTopCursorsInWelcomePopUp(item, index, mainElement, type, collection) {

    let styles = checkTheStyleForTopCursorCube(type, collection, item);
    const cubeContainerInner = document.createElement('div');

    cubeContainerInner.className = 'cube-container-inner-welcome';
    cubeContainerInner.id = item.id;

    cubeContainerInner.innerHTML = setInnerHtml(styles.display, styles.src, styles.backgroundColor, index, item);

    cubeContainerInner.querySelector('.try-button-welcome').addEventListener('click', async(event) => {
        await onClickTry(event, item, cubeContainerInner, index);
    });

    if (type === 'welcome' && styles.display === 'none') {
        cubeContainerInner.querySelector('.add-button-welcome').addEventListener('click', async(event) => {
            addCursor(item.id, cubeContainerInner);
            document.getElementById('button-get-more-welcome').style.display = 'none';
            document.getElementById('go-to-collection-button').style.display = 'flex';
        }, {once: true});
    }
    else if (type === 'user' && styles.display === 'none') {
        cubeContainerInner.querySelector('.add-button-welcome').addEventListener('click', bindingDataToClickListener.bind(null, item, cubeContainerInner), {once: true});
    }

    mainElement.insertAdjacentElement('afterbegin', cubeContainerInner);
}

function bindingDataToClickListener(item, element) {
    addCursor(item.id, element);
    drawUserCursors(item);
}

function checkIfThereCursorInUserCollection() {
    chrome.storage.local.get('user_collection', function(result) {
        const containerCursor = document.getElementById('cursor-container-welcome');
        if (result.user_collection !== undefined && Array.isArray(result.user_collection) && result.user_collection.length > 1) {
            userCollectionPopUp.style.display = 'flex';
            welcomePopUp.style.display = 'none';
        }
        else {
            userCollectionPopUp.style.display = 'none';
            welcomePopUp.style.display = 'flex';

            chrome.storage.local.set({"tryingUrl" : "off"})

            while (containerCursor.firstChild) {
                containerCursor.removeChild(containerCursor.lastChild);
            }

            chrome.storage.local.get(['topCollection'], function(result) {
                result.topCollection.forEach((item, index) => {
                    if (index <= 27) {
                        drawTopCursorsInWelcomePopUp(item, index, cursorContainerWelcomePopUp, 'welcome');
                    }
                });
            });

            disableCursor();
            document.getElementById('go-to-collection-button').style.display = 'none';
            document.getElementById('button-get-more-welcome').style.display = 'flex';
        }
    });

}

function onClickDelete(item, cursorUrl, cube, container, resizedUrl) {
    document.getElementById('delete-img').src = cursorUrl;
    document.getElementById('button-no').addEventListener('click', event => {
        document.getElementById('delete-cursor').style.display = 'none';
    });
    const buttonYes = document.getElementById('button-yes');
    const clone = buttonYes.cloneNode(true);

    clone.addEventListener('click', () => {
        chrome.runtime.sendMessage({type: 'DELETE', cursorId: item.id}, async function(response) {
            if (response === 'ok') {
                const topCubeArray = document.getElementsByClassName('cube-container-inner-welcome');
                Array.from(topCubeArray).forEach((cube, index) => {
                    if (cube.id === item.id.toString()) {
                        cube.querySelector('.v').style.display = 'none';
                        cube.querySelector('.add-button-welcome').style.background = 'linear-gradient(269.42deg, #006EDD 0%, #004585 100%)';
                        cube.querySelector('.image-add-welcome').src = '../asset/ADD.svg';
                        const clone = cube.cloneNode(true);
                        clone.querySelector('.add-button-welcome').addEventListener('click', bindingDataToClickListener.bind(null, item, clone), {once: true});
                        clone.querySelector('.try-button-welcome').addEventListener('click', async(event) => {
                            await onClickTry(event, item, clone, index);
                        });
                        clone.id = cube.id;
                        cube.parentNode.replaceChild(clone, cube);
                    }
                });


                chrome.storage.local.get(["default_url", 'obj_cursor_url'], function(result) {
                    const resizeView = document.getElementById('size-dot-container');
                    if (result.default_url.urlCursor === "" && result.default_url.urlPointer === "" ) {
                        if (resizeView.style.display === 'flex' ) {
                            resizeView.style.display = 'none';
                            document.getElementById('size-dot-container-off').style.display = 'flex';
                        }
                    }

                    if (result.default_url) {
                        if (resizedUrl) {
                            if (result.default_url.urlCursor === resizedUrl) {
                                chrome.storage.local.set({'obj_cursor_url': {'urlCursor': "", 'urlPointer': ""}});
                                chrome.storage.local.set({'default_url': {'urlCursor': "", 'urlPointer': ""}});
                                if (resizeView.style.display === 'flex' ) {
                                    resizeView.style.display = 'none';
                                    document.getElementById('size-dot-container-off').style.display = 'flex';
                                }
                                disableCursor();
                            }
                        }
                    }

                });
                container.removeChild(cube);
                checkIfThereCursorInUserCollection();

            }
        });
        chrome.storage.local.get(['user_collection', 'topCollection'], function(result) {
            let isInTop = false;
            result.topCollection.forEach(cursor => {
                if (cursor.id === item.id) {
                    isInTop = true;
                }
            })
            if (isInTop){
                indexNumber++;
                drawTopCursorsInWelcomePopUp(item, indexNumber, topCursorContainerUserPopUp, "user", result.user_collection)
                if (topCursorContainerUserPopUp.childElementCount > 0 && topCursorContainerUserPopUp.style.display === "none") {
                    document.getElementById('collection-top-cursor-header').style.display = 'flex';
                    topCursorContainerUserPopUp.style.display = 'flex';
                }
            }

        });
        document.getElementById('delete-cursor').style.display = 'none';
    });
    buttonYes.parentNode.replaceChild(clone, buttonYes);
    document.getElementById('delete-cursor').style.display = 'flex';
}

function drawUserCursors(item) {
    const container = document.getElementById('cursor-container');
    const cube = document.createElement('div');

    let cursorUrl = item.cursor_path ? item.cursor_path : item.cursor.newPath;
    let pointerUrl = item.pointer_path ? item.pointer_path : item.pointer.newPath;
    cube.className = 'cube';


    cube.innerHTML = `<img id="x-image" class="x-image" src="../asset/x-icon.svg" alt="x"/>
                            <img id="cursor-image" class="cursor-view" src="${cursorUrl}" alt="cursor"/>`;

    cube.addEventListener('mouseover', (event) => {
        cube.querySelector('#cursor-image').src = pointerUrl;
    });

    cube.addEventListener('mouseout', (event) => {
        cube.querySelector('#cursor-image').src = cursorUrl;
    });

    cube.addEventListener('click', async(event) => {
        if (!event.target.closest(".x-image")){
            let resizedUrl = await getResizedUrl(cursorUrl, pointerUrl);
            const resizeView = sizeDotContainerOff;
            chrome.storage.local.set({'obj_cursor_url': resizedUrl});
            chrome.storage.local.set({'default_url': {'urlCursor': cursorUrl, 'urlPointer': pointerUrl}});
            if (resizeView.style.display === 'flex') {
                resizeView.style.display = 'none';
                sizeDotContainer.style.display = 'flex';
            }

            chrome.tabs.query({}, function(tabs) {
                tabs.forEach(tab => {
                    if (tab.active){
                        chrome.tabs.sendMessage(tab.id, {type : "sendUpdate"}, (response) => {

                        })
                    }
                })
            })

            disableTrying();
            chrome.storage.local.set({"tryingUrl" : "off"})
            changeCursor(resizedUrl.urlCursor, resizedUrl.urlPointer);
        }

    });

    cube.querySelector('#x-image').addEventListener('click', () => {
        onClickDelete(item, cursorUrl, cube, container, cursorUrl);
    });

    container.insertAdjacentElement('afterbegin', cube);
}
