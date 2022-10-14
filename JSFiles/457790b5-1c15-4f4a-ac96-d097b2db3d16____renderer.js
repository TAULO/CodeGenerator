const {remote} = require('electron');
const app = remote.app;
const dialog = remote.dialog;
const path = require('path')
const fs = require("fs");
//const sharp = require('sharp');
const sqlite3 = require('sqlite3').verbose();
const exec = require('child_process').exec;
const WIN = remote.getCurrentWindow();

const Cache = require('./Cache.js');
const FileElement = require('./FileElement.js');

var db = null
var dbName = ''
var dbParentPath = ''
var isTransactionOngoing = false;
/*
var miniatureCache = {}
miniatureCache.count = 0
*/
const cache = new Cache();

var lastOpenFileDialogFolder = null

var folderStack = [];

window.onbeforeunload = (e) => {
    // Возврат любого значения незаметно отменит закрытие.
    // Рекомендуется использовать dialog API, чтобы дать пользователям
    // возможность подтвердить закрытие приложения.
    if (isTransactionOngoing) {
        console.log('Preventing close: sql transaction is ongoing / db not closed')
        e.returnValue = false // идентично `return false`, но в использовании не рекомендуется
    } else {
        clearMiniatureCache()
    }
}

function getCommandLine() {
   switch (process.platform) { 
      case 'darwin': return 'open';
      case 'win32': return 'start ""';
      default: return 'xdg-open';
   }
}

function createSpacer() {
    var div = document.createElement('div')
    div.style.display = 'inline-block'
    div.style.verticalAlign = 'middle'
    div.style.height = '100%'
    return div
}

function unixTimestamp() {
    return Math.round((new Date()).getTime() / 1000)
}

function openOrCreateDatabase(dbPath, callback) {
    let isNew = !fs.existsSync(dbPath)
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error(err.message);
      }
      console.log('Connected to the database.');
    });
    db.on("error", function(error) {
        console.log("Getting an error: ", error);
    });

    if (isNew) {
        db.run('CREATE TABLE tree (dir_id TEXT PRIMARY KEY, dir_name TEXT, parent_id TEXT, is_file INTEGER, real_file_path TEXT,'
            +' children_id_list TEXT, created_timestamp INTEGER, updated_timestamp INTEGER, folder_icon_child_index INTEGER, short_description TEXT)', function(err) {
            if (err) console.log(err)
            db.run(`INSERT INTO tree (dir_id, dir_name, parent_id, is_file, real_file_path,
                 children_id_list, created_timestamp, updated_timestamp, folder_icon_child_index, short_description)
                 VALUES ('0', '', '', 0, '', '', ${unixTimestamp()}, ${unixTimestamp()}, -1, '')`
            , function(err) {
                if (err) console.log(err)
                callback()
            })
        });
    }

    let lastSep = dbPath.lastIndexOf(path.sep);
    let lastDot = dbPath.lastIndexOf('.');
    if (lastSep < lastDot) dbName = dbPath.substring(lastSep+1, lastDot);
    else dbName = dbPath.substring(lastSep+1);
    dbParentPath = dbPath.substring(0, dbPath.lastIndexOf(path.sep));
    console.log(dbName, dbParentPath)
    isTransactionOngoing = true;//заменить позже на блокировку только во время транзакций
    folderStack = [];
    if (!isNew) callback();
}
/*
function clearMiniatureCache() {
    try {
        fs.rmdirSync(path.join(app.getPath('home'), '.filesysemu_miniature_cache'), { recursive: true });
        console.log('Miniature cache folder is deleted!');
    } catch (err) {
        console.log(err)
    }
    miniatureCache = {}
    miniatureCache.count = 0
}*/
/*
function getExtension(row) {
    if (row.is_file) {
        let index = row.dir_name.lastIndexOf('.')
        return (index > 0) ? row.dir_name.substring(index + 1).toLowerCase() : ''
    } else return '';
}
*/
/*function createAndCacheMiniature(filePath, itemTag, row) {
    if (miniatureCache.count > 1000) clearMiniatureCache();
    const extension = getExtension(row)

    let tempImg = document.createElement('img')
    tempImg.onerror = function(e) {
        console.log(e)
        itemTag.style.backgroundImage = "url('icon/file"+extension+".png')"
    }
    if (miniatureCache[filePath]) {
        //console.log('уже есть миниатюра: '+miniatureCache[filePath])
        tempImg.onload = function() {
            //console.log('tempImg onload. src:', miniatureCache[filePath])
            itemTag.style.backgroundImage = "url('" + miniatureCache[filePath].replace(/\\/g, '/') + "')";
        }
        tempImg.src = miniatureCache[filePath];
    } else {
        //console.log('нет миниатюры')
        let miniatureFolder = path.join(app.getPath('home'), '.filesysemu_miniature_cache')
        if (!fs.existsSync(miniatureFolder)) fs.mkdirSync(miniatureFolder, { recursive: true })
        let outPath = path.join(miniatureFolder, row.dir_id + '.png')

        sharp(filePath)
            .resize(200, 200, {fit: 'inside'})
            .toFile(outPath, (err, info) => {
                if (err) console.log(err);
                miniatureCache[filePath] = outPath;
                miniatureCache.count++;
                tempImg.onload = function() {
                    //console.log('tempImg onload. src:', outPath)
                    itemTag.style.backgroundImage = "url('" + outPath.replace(/\\/g, '/') + "')";
                }
                tempImg.src = outPath;
            });
    }
}*/

function storeFile(sourcePath, destinationName) {
    //позже оптимизировать - проверять наличие папки только в начале, а на время работы блокировать ее
    //и вести внутренний счетчик подпапок и количества файлов в последней, а не читать каждый раз
    let folder = path.join(dbParentPath, 'database_file_storage_'+dbName);
    if (!fs.existsSync(folder)) fs.mkdirSync(folder, {recursive: true});

    let lastSubIndex = fs.readdirSync(folder).length;

    function newSub() {
        folder = path.join(folder, (++lastSubIndex) + '');
        fs.mkdirSync(folder, {recursive: true});
    }

    if (lastSubIndex == 0) newSub();
    else {
        let subPath = path.join(folder, lastSubIndex + '');
        let files = fs.readdirSync(subPath);
        const upperFileCountLimit = 10000;
        if (files.length < upperFileCountLimit) folder = subPath;
        else newSub();
    }

    let destPath = path.join(folder, destinationName);
    fs.copyFile(sourcePath, destPath, (err) => {
        // destination will be created or overwritten by default.
        if (err) throw err;
    });
    return destPath;
}

function displayFolderContent(dirId) {
    let instrumentPanel = document.createElement('div')
    let itemContainer = document.createElement('div')
    itemContainer.className = 'item_container'

    var openedDirectory = {};
    var children = [];

    var rowComparators = {
        nameAlphabeticalAscending: function(o1, o2) {
            if (o1.is_file == o2.is_file) {
                var collator = new Intl.Collator(undefined, {
                    sensitivity: 'variant',
                    numeric: true,
                    caseFirst: 'upper'
                })
                return collator.compare(o1.dir_name, o2.dir_name)
            } else if (o1.is_file) return 1;
            else return -1;
        }
    }

    /* ------------------------------------- Выделение, действия над файлами и родительской папкой ---------------------------- */

    var selectedElements = [];
    var lastClickedElement = null;
    var flagFreeSelectionModeOn = false;
    var contextMenuOpened = false;
    var itemByChildId = {};

    var selectItem = function(row, addToSelection) {
        let itemToSelect = itemByChildId[row.dir_id];
        let itemSelectedIndex = selectedElements.indexOf(row)
        if (itemSelectedIndex >= 0 && addToSelection) {
            selectedElements.splice(itemSelectedIndex, 1)
            itemToSelect.className = 'item_tile_view'
        } else {
            if (!addToSelection) {
                let selectedItems = selectedElements.map((row2) => itemByChildId[row2.dir_id])
                selectedItems.forEach((it) => {
                    it.className = 'item_tile_view'
                })
                selectedElements = [];
            }
            selectedElements.push(row)
            itemToSelect.className = 'item_tile_view_selected'
        }
    }

    var createContextMenu = function(event, liArray, delimitersAt, menuTitle) {
        //учесть menuTitle, disabled, добавить title на пункты и крестик
        let x = event.pageX;
        let y = event.pageY;
        let width = 300;
        let liHeight = 30;
        let delimHeight = 5;
        let pageHeight = Math.max(
          document.body.scrollHeight, document.documentElement.scrollHeight,
          document.body.offsetHeight, document.documentElement.offsetHeight,
          document.body.clientHeight, document.documentElement.clientHeight
        );
        let pageWidth = Math.max(
          document.body.scrollWidth, document.documentElement.scrollWidth,
          document.body.offsetWidth, document.documentElement.offsetWidth,
          document.body.clientWidth, document.documentElement.clientWidth
        );
        //console.log(`x: ${x}, y: ${y}, pageWidth: ${pageWidth}, pageHeight: ${pageHeight}`)
        let itemMenu = document.createElement('div')
        itemMenu.className = 'context_menu'
        itemMenu.style.width = `calc(${width}px - 2px)`;
        if (x + width + 1 < pageWidth) {
            itemMenu.style.left = Math.round(x + 1) + 'px'
        } else {
            itemMenu.style.right = '0px'
        }
        if (y + delimHeight*delimitersAt.length + liHeight*liArray.length < pageHeight) {
            itemMenu.style.top = Math.round(y) + 'px'
        } else {
            itemMenu.style.bottom = '0px'
        }
        for (let i = 0; i<liArray.length; i++) {
            if (delimitersAt.includes(i)) {
                let delimiter = document.createElement('div')
                delimiter.className = 'context_menu_delimiter'
                itemMenu.appendChild(delimiter)
            }
            let li = document.createElement('div')
            li.className = 'context_menu_li'
            li.style.height = liHeight + 'px'
            li.onclick = function() {
                itemMenu.remove()
                contextMenuOpened = false
                liArray[i].action()
            }
            liText = document.createElement('div')
            liText.textContent = liArray[i].text
            li.appendChild(createSpacer())
            li.appendChild(liText)
            itemMenu.appendChild(li)
        }
        let clickListener;
        clickListener = function() {
            itemMenu.remove()
            contextMenuOpened = false
            document.body.removeEventListener('click', clickListener)
        }
        document.body.addEventListener('click', clickListener)
        let eventStop = function(e) {
            e.stopPropagation()
        };
        itemMenu.addEventListener('click', eventStop)
        itemMenu.addEventListener('mousedown', eventStop)
        itemMenu.addEventListener('mouseup', eventStop)
        itemMenu.addEventListener('contextmenu', eventStop)
        itemContainer.appendChild(itemMenu)
    }

    itemContainer.onmousedown = function(e) {
        //применить переименование. Почему-то пока применяется только по щелчку по элементу
        if (!flagFreeSelectionModeOn && (e.button == 0 || e.button == 2)) {
            e.stopPropagation();
            e.preventDefault();
            if (!e.ctrlKey && !e.shiftKey) {
                for (let i = selectedElements.length - 1; i >= 0; i--) selectItem(selectedElements[i], true);
                selectedElements = [];
            }
            lastClickedElement = null;
            flagFreeSelectionModeOn = true;
            document.body.addEventListener('mouseup', bodyMouseUpListener)
            document.body.addEventListener('mouseleave', bodyMouseUpListener)
            console.log('selection mode on');
        }
    }
    var bodyMouseUpListener;
    bodyMouseUpListener = function(e) {
        flagFreeSelectionModeOn = false;
        console.log('selection mode off');
        document.body.removeEventListener('mouseup', bodyMouseUpListener)
        document.body.removeEventListener('mouseleave', bodyMouseUpListener)
    }
/*
    var openItem = function(row) {
        if (row.is_file) {
            const extension = getExtension(row)
            if (extension == 'sqlite3db') {
                db.close((err) => {
                    if (err) console.log(err);
                    db = null;
                    isTransactionOngoing = false
                    openOrCreateDatabase(row.real_file_path)
                });
            } else {
                if (fs.existsSync(row.real_file_path)) exec(getCommandLine() + ' "' + row.real_file_path + '"');
                else {
                    dialog.showMessageBox(WIN, {
                        title: "Ошибка",
                        message: "Файл по пути " + row.real_file_path + ", на который ссылается элемент " + row.dir_name
                         + ", перемещен, переименован или удален. Удалите этот элемент или отредактируйте путь к файлу.",
                        buttons: ["OK"],
                        defaultId: 0
                    })
                }
            }
        } else {
            instrumentPanel.remove();
            itemContainer.remove();
            flagFreeSelectionModeOn = false;
            document.body.removeEventListener('mouseup', bodyMouseUpListener)
            document.body.removeEventListener('mouseleave', bodyMouseUpListener)
            displayFolderContent(row.dir_id)
        }
    }
*/
    /*
    function setBgImage(itemIconBlock, row) {
        if (row.is_file) {
            let extension = getExtension(row)
            if (extension) {
                if (extension == 'jpeg' || extension == 'jfif') extension = 'jpg';
                else if (extension == 'htm') extension = 'html'

                if (['jpg', 'svg', 'png', 'gif', 'webp'].includes(extension)) {
                    //console.log(extension)
                    createAndCacheMiniature(row.real_file_path, itemIconBlock, row)
                } else if (extension == 'bmp') {
                    let tempImg = document.createElement('img')
                    tempImg.onerror = function(e) {
                        console.log(e)
                        itemIconBlock.style.backgroundImage = "url('icon/filebmp.png')"
                    }
                    tempImg.onload = function() {
                        itemIconBlock.style.backgroundImage = row.real_file_path;
                    }
                    tempImg.src = row.real_file_path;
                } else {
                    let exists = fs.existsSync(path.join(__dirname, 'icon/file'+extension+'.png'))
                    if (exists) itemIconBlock.style.backgroundImage = "url('icon/file"+extension+".png')";
                    else itemIconBlock.style.backgroundImage = "url('icon/file.png')"
                }
            } else {
                itemIconBlock.style.backgroundImage = "url('icon/file.png')"
            }
        } else {
            itemIconBlock.style.backgroundImage = "url('icon/folder.png')"
        }
    }*/
/*
    function renameItem(row) {
        let oldDirName = row.dir_name;
        let itemNameBlock = document.getElementById(row.dir_id + '_nameblock');
        let itemIconBlock = document.getElementById(row.dir_id + '_iconblock');
        itemNameBlock.textContent = row.dir_name;
        itemNameBlock.contentEditable = true;
        itemNameBlock.focus()
        //console.log('renameItem call on '+row.dir_id+', ', itemNameBlock)
        var onApply;
        var listenerEnter = function(event) {
            if (event.code == 'Enter') {
                //console.log('event keyup Enter')
                itemNameBlock.blur()
                //onApply is called automatically since blur event occurs
            }
        }
        var listenerRightClick = function(e) {
            e.stopPropagation()
        }
        let extension = getExtension(row)
        onApply = function(event) {
            itemNameBlock.contentEditable = false;
            itemNameBlock.textContent = itemNameBlock.textContent.replace(/[\n\r\0\t]/g, '');
            //console.log('event.target:', event.target, ', event.currentTarget:', event.currentTarget)
            //console.log(`textContent: '${itemNameBlock.textContent}', row.dir_name: '${row.dir_name}';
            //     ==: ${row.dir_name == itemNameBlock.textContent}`)
            if (row.dir_name == itemNameBlock.textContent || itemNameBlock.textContent == '' ) {
                document.removeEventListener('keyup', listenerEnter);
                itemNameBlock.removeEventListener('blur', onApply)
                itemNameBlock.removeEventListener('contextmenu', listenerRightClick)
                itemNameBlock.textContent = oldDirName.substring(0, 40) + (oldDirName.length > 40 ? '...' : '')
                return;
            }
            row.dir_name = itemNameBlock.textContent;
            db.run(`UPDATE tree SET dir_name='${row.dir_name.replace(/[']/g, "''")}' WHERE dir_id='${row.dir_id}'`, [], function(err) {
                if (err) {
                    console.log(err);
                    row.dir_name = oldDirName;
                    itemNameBlock.textContent = oldDirName.substring(0, 40) + (oldDirName.length > 40 ? '...' : '')
                    dialog.showMessageBox(WIN, {
                        title: "Ошибка",
                        message: "При переименовании элемента " + oldDirName
                         + " произошла ошибка. Переоткройте базу данных и попробуйте еще раз.",
                        buttons: ["OK"],
                        defaultId: 0
                    })
                } else {
                    //console.log('Renamed to '+row.dir_name)
                    itemNameBlock.textContent = row.dir_name.substring(0, 40) + (row.dir_name.length > 40 ? '...' : '')
                    itemNameBlock.title = row.dir_name
                    let extension2 = getExtension(row)
                    //console.log(extension2)
                    if (row.is_file && extension != extension2) setBgImage(itemIconBlock, row)
                }
                itemNameBlock.removeEventListener('blur', onApply)
                itemNameBlock.removeEventListener('contextmenu', listenerRightClick)
                document.removeEventListener('keyup', listenerEnter);
            })
        }
        itemNameBlock.addEventListener('blur', onApply)
        itemNameBlock.addEventListener('contextmenu', listenerRightClick)
        document.addEventListener('keyup', listenerEnter)
    };
*/
    /*
    var createSubfolder = function() {
        let row = {};
        row.dir_name = '[введите имя]';
        row.parent_id = openedDirectory.dir_id;
        row.children_id_list = '';
        row.is_file = 0;
        row.real_file_path = '';
        row.folder_icon_child_index = -1
        row.short_description = ""

        row.created_timestamp = unixTimestamp();
        row.updated_timestamp = unixTimestamp();
        row.dir_id = 'folder-' + openedDirectory.dir_name.length + '-' + unixTimestamp() + '-' + Math.floor(Math.random()*1000000000);

        db.run(`INSERT INTO tree (dir_id, dir_name, parent_id, is_file, real_file_path,
             children_id_list, created_timestamp, updated_timestamp, folder_icon_child_index, short_description)
             VALUES ('${row.dir_id}', '${row.dir_name}', '${row.parent_id}', ${row.is_file},
             '${row.real_file_path}', '${row.children_id_list}', ${row.created_timestamp},
             ${row.updated_timestamp}, ${row.folder_icon_child_index}, '${row.short_description}');`
        , function(err) {
            try{
            if (err) {
                console.log(err);
                dialog.showMessageBox(WIN, {
                    title: "Ошибка",
                    message: "При добавлении папки " + row.dir_name + " произошла ошибка. Повторите попытку.",
                    buttons: ["OK"],
                    defaultId: 0
                })
            } else {
                openedDirectory.children_id_list = (openedDirectory.children_id_list == '' ? '' : openedDirectory.children_id_list+'\n') + row.dir_id;
                openedDirectory.updated_timestamp = unixTimestamp();

                db.run(`UPDATE tree SET children_id_list='${openedDirectory.children_id_list}', updated_timestamp=
                    ${openedDirectory.updated_timestamp} WHERE dir_id='${openedDirectory.dir_id}'`, function(err2) {try {
                    if (err2) {
                        console.log(err2);
                        dialog.showMessageBox(WIN, {
                            title: "Ошибка",
                            message: "При добавлении подпапки в папку " + openedDirectory.dir_name
                             + " произошла ошибка. Запустите проверку ошибок на текущей открытой папке.",
                            buttons: ["OK"],
                            defaultId: 0
                        })
                    } else {
                        itemContainer.textContent = '';
                        itemByChildId = {};
                        selectedElements = [];
                        lastClickedElement = null;
                        contextMenuOpened = false;
                        flagFreeSelectionModeOn = false;
                        children.push(row);
                        children.sort(rowComparators.nameAlphabeticalAscending);
                        //console.log(children);
                        for (let i = 0; i<children.length; i++) {
                            let itemNodes = createItemTileView(children[i]);
                            let nameToEdit = itemNodes.itemNameBlock, itemIcon = itemNodes.itemIconBlock;
                            if (children[i].dir_id == row.dir_id) {
                                renameItem(row, nameToEdit, itemIcon)
                            }
                        }
                    }
                } catch (e) {console.log(e)}})
            }} catch (e) {console.log(e)}
        })
    }*/
/*
    var addFiles = function() {
        let options = {
            title: "Добавить ссылки на файлы",
            defaultPath: lastOpenFileDialogFolder || app.getPath('documents') || app.getPath('home') || ".",
            buttonLabel: "Добавить",
            filters:[
                {name: 'Картинки', extensions: ['jpg', 'jpeg', 'jfif', 'svg', 'png', 'gif', 'webp', 'bmp']},
                {name: 'Документы', extensions: ['txt', 'doc', 'docx', 'odt', 'ppt', 'pptx', 'rtf', 'pdf',
                    'djvu', 'epub', 'fb2', 'htm', 'html', 'xls', 'xlsx', 'csv', 'xml', 'mhtml', 'sqlite3db']},
                {name: 'Видео', extensions: ['mkv', 'avi', 'mp4']},
                {name: 'Аудио', extensions: ['mp3', 'wav', 'ogg', 'flac']},
                {name: 'Все файлы', extensions: ['*']}
            ],
            properties: ['openFile', "multiSelections"]
        }
        dialog.showOpenDialog(WIN, options).then(result => {
            let filenames = result.filePaths;
            if (filenames.length < 1 || filenames.length == 1 && filenames[0] == '') {
                console.log('No filename. No files were added.');
                return;
            }
            lastOpenFileDialogFolder = filenames[0].substring(0, filenames[0].lastIndexOf(path.sep))
            let completeCounter = 0;
            let preparedRows = [];

            function callbackOnEveryInserted() {
                if (completeCounter < filenames.length) return;
                console.log('Every INSERT complete.')// Added rows:preparedRows

                openedDirectory.children_id_list = (openedDirectory.children_id_list == '' ? '' : openedDirectory.children_id_list+'\n')
                     + preparedRows.map(obj => obj.dir_id).join('\n');
                openedDirectory.updated_timestamp = unixTimestamp();
                //console.log('openedDirectory: ', openedDirectory)

                db.run(`UPDATE tree SET children_id_list='${openedDirectory.children_id_list}', updated_timestamp=
                    ${openedDirectory.updated_timestamp} WHERE dir_id='${openedDirectory.dir_id}'`, function(err) {try {
                    if (err) {
                        console.log(err);
                        dialog.showMessageBox(WIN, {
                            title: "Ошибка",
                            message: "При добавлении элементов в папку " + openedDirectory.dir_name
                             + " произошла ошибка. Запустите проверку ошибок на текущей открытой папке.",
                            buttons: ["OK"],
                            defaultId: 0
                        })
                    } else {
                        itemContainer.textContent = ''
                        itemByChildId = {};
                        selectedElements = [];
                        lastClickedElement = null;
                        contextMenuOpened = false;
                        flagFreeSelectionModeOn = false;
                        children = children.concat(preparedRows)
                        children.sort(rowComparators.nameAlphabeticalAscending)
                        for (let i = 0; i<children.length; i++) {
                            createItemTileView(children[i])
                        }
                    }
                } catch (e) {console.log(e)}})
            }

            filenames.forEach(function(el) {
                let row = {};
                row.dir_name = el.substring(el.lastIndexOf(path.sep) + 1).replace(/[\r\n\0\t]/g, "");
                row.parent_id = openedDirectory.dir_id;
                row.children_id_list = '';
                row.is_file = 1;
                row.folder_icon_child_index = -1
                row.short_description = ""

                row.created_timestamp = unixTimestamp();
                row.updated_timestamp = unixTimestamp();
                row.dir_id = row.dir_name.substring(0, 15) + '-' + row.parent_id + '-' + fs.statSync(el)['size']
                 + '-' + unixTimestamp() + '-' + Math.floor(Math.random()*1000000);
                
                try {
                    row.real_file_path = storeFile(el, row.dir_id + '.' + getExtension(row))
                } catch (error) {//all kinds of IO errors
                    console.log(error);
                    dialog.showMessageBox(WIN, {
                        title: "Ошибка",
                        message: "При копировании файла "+el+" в служебную папку базы данных " + path.join(dbParentPath, 'database_file_storage_'+dbName)
                         + " произошла ошибка. Файл будет пропущен. Проверьте наличие прав у вашего пользователя на чтение и запись указанной папки.",
                        buttons: ["OK"],
                        defaultId: 0
                    })
                    return;//skips in foreach
                }
                
                db.run(`INSERT INTO tree (dir_id, dir_name, parent_id, is_file, real_file_path,
                     children_id_list, created_timestamp, updated_timestamp, folder_icon_child_index, short_description)
                     VALUES ('${row.dir_id.replace(/[']/g, "''")}', '${row.dir_name.replace(/[']/g, "''")}',
                     '${row.parent_id}', ${row.is_file}, '${row.real_file_path}', '${row.children_id_list}', ${row.created_timestamp},
                     ${row.updated_timestamp}, ${row.folder_icon_child_index}, '${row.short_description}');`
                , function(err) {
                    completeCounter++;
                    if (err) {
                        console.log(err);
                        dialog.showMessageBox(WIN, {
                            title: "Ошибка",
                            message: "При добавлении элемента " + row.dir_name + " произошла ошибка. Повторите попытку.",
                            buttons: ["OK"],
                            defaultId: 0
                        })
                    } else {
                        preparedRows.push(row);
                    }
                    callbackOnEveryInserted();
                    //console.log('completeCounter: ' + completeCounter + '; ' + preparedRows)
                })
            })
            console.log(preparedRows)
        }).catch(err => {
            console.log(err)
        })
    }*/

    itemContainer.oncontextmenu = function(event) {
        if (contextMenuOpened) return;
        contextMenuOpened = true;
        let liArray, delimitersAt;
        let amount = selectedElements.length;
        if (event.shiftKey) {
            liArray = [
                //полностью переделать эту хуйню

                //копировать загружаемые файлы в скрытую подпапку и ссылаться на них
                //дать пользователю возможность Открыть расположение этой служебной папки
                //удаление бд по прежнему не удаляет связанной служебной папки
                //копирование бд копирует служебную папку
                //оставить возможность заменить оригинальный файл для всех ссылок на него, на случай ошибкии
                //оставить возможность удалить оригинальный файл и все ссылки на него
                //при копировании ссылки файл в служебной папке не копируется
                {text: 'Сослаться на другой файл', action: function() {}},
                {text: 'Удалить файл и все ссылки на него', action: function() {}},
                {text: 'Расположение файла', action: function() {}},
            ];
            delimitersAt = [];
        } else {
            if (amount == 0) {
                liArray = [
                    {text: 'Создать подпапку', action: createSubfolder},
                    {text: 'Добавить ссылки', action: addFiles},
                    //{text: 'Свойства', action: function() {}},
                ];
                delimitersAt = [2];
            } else {
                liArray = [
                    {text: amount == 1 ? 'Открыть' : 'Открыть все', disabled: amount > 20, action: function() {
                        selectedElements.forEach((el) => openItem(el))
                    }},
                    //{text: amount == 1 ? 'Вырезать ссылку' : 'Вырезать ссылки', action: function() {}},
                    //{text: amount == 1 ? 'Копировать ссылку' : 'Копировать ссылки', action: function() {}},
                    //{text: amount == 1 ? 'Удалить ссылку' : 'Удалить ссылки', action: function() {}},
                    {text: amount == 1 ? 'Переименовать ссылку' : 'Переименовать ссылки', action: function() {
                        if (amount == 1) {
                            renameItem(selectedElements[0])
                        } else {
                            //advanced multirenaming dialog
                        }
                    }},
                    //{text: amount == 1 ? 'Свойства' : 'Свойства всех', action: function() {}}
                ];
                delimitersAt = [1, 5];
            }
        }
        createContextMenu(event, liArray, delimitersAt);
    }

    /*----------------------------------------------- Заполнение контейнера элементов ---------------------------------------*/
/*
    function createItemTileView(child) {
        let item = document.createElement('div')
        item.className = 'item_tile_view'
        itemByChildId[child.dir_id] = item
        let itemIconBlock = document.createElement('div')
        itemIconBlock.id = child.dir_id + '_iconblock'
        itemIconBlock.className = 'item_tile_view_icon_block project_brick_icon_block'
        item.appendChild(itemIconBlock)

        setBgImage(itemIconBlock, child)

        let itemName = document.createElement('div')
        let itemNameBlock = document.createElement('div')
        itemNameBlock.id = child.dir_id + '_nameblock'
        itemNameBlock.textContent = child.dir_name.substring(0, 40) + (child.dir_name.length > 40 ? '...' : '')
        itemNameBlock.title = child.dir_name
        itemNameBlock.className = 'item_tile_view_name_block'
        let spacer = document.createElement('div')
        spacer.className = 'item_tile_view_name_block'
        spacer.style.height = '100%'
        itemName.appendChild(spacer)
        itemName.appendChild(itemNameBlock)
        item.appendChild(itemName)

        itemIconBlock.ondblclick = function() {
            openItem(child);
        }
        itemName.ondblclick = function() {
            selectItem(child, false)
            renameItem(child, itemNameBlock, itemIconBlock)
        }
        item.onclick = function(event) {
            if (event.ctrlKey || event.shiftKey && !lastClickedElement) selectItem(child, true);
            else if (event.shiftKey) {
                let indexChildFrom = children.indexOf(lastClickedElement);
                let indexChildTo = children.indexOf(child);
                if (indexChildFrom == indexChildTo) {
                    selectItem(child, true);
                    return;
                }
                if (indexChildFrom > indexChildTo) {
                    let temp = indexChildTo;
                    indexChildTo = indexChildFrom - 1;
                    indexChildFrom = temp;
                } else indexChildFrom += 1;//+-1 здесь исключает сам последний выбранный элемент
                let isCurrentClickedInSelection = selectedElements.includes(child)
                let isLastClickedInSelection = selectedElements.includes(lastClickedElement)
                //console.log(`In selection ${lastClickedElement.dir_id}: current ${isCurrentClickedInSelection}, 
                //    last ${isLastClickedInSelection}`)
                if (isCurrentClickedInSelection === isLastClickedInSelection) {
                    //наше намерение - убрать выделение с child, а значит последний элемент тоже надо убрать
                    //ИЛИ наше намерение - добавить child в выделение, а значит последний надо оставить
                    selectItem(lastClickedElement, true)
                }
                //console.log(`from ${indexChildFrom} to ${indexChildTo}`)
                for (let i = indexChildFrom; i<=indexChildTo; i++) {
                    let childBetween = children[i];
                    selectItem(childBetween, true)
                }
            } else selectItem(child, false);

            lastClickedElement = child;
        }
        item.oncontextmenu = function(event) {
            if (event.shiftKey) selectItem(child, false);
            else if (selectedElements.length == 0 || event.ctrlKey) selectItem(child, event.ctrlKey);
            //if nothing selected OR ctrl pressed, select current (add if ctrl) and open menu for selected links
        }
        item.onmouseenter = function(e) {
            if (flagFreeSelectionModeOn) {
                selectItem(child, true)
            }
        }
        item.onmousedown = function(e) {
            //drag files and folders around
            if (e.button == 0 || e.button == 2) {//right or left mousedown, not middle button
                e.stopPropagation();
            }
        }
        itemContainer.appendChild(item)
        return {itemNameBlock: itemNameBlock, itemIconBlock: itemIconBlock};
    }*/

    db.get(`SELECT * FROM tree WHERE dir_id = '${dirId}'`, [], (err, row) => {try{
        if (err) console.log(err)
        if (row && !row.is_file) {
            openedDirectory = row;
            folderStack.push(openedDirectory);
            let pathStackBlock = document.createElement('div');
            for (let i = 0; i<folderStack.length; i++) {
                let stackItem = folderStack[i]
                let pathFolder = document.createElement('div')
                let name = stackItem.dir_name
                pathFolder.className = 'path_stack_item' + (name ? '' : ' root_path_stack_item')
                pathFolder.textContent = ((name.length <= 23) ? name :
                    name.substring(0, 10) + '...' + name.substring(name.length-10, name.length)) || '\u2302';
                pathFolder.title = name;
                pathFolder.onclick = function(e) {
                    if (stackItem != openedDirectory) {
                        let index = folderStack.indexOf(stackItem)
                        folderStack.splice(index)
                        instrumentPanel.remove();
                        itemContainer.remove();
                        flagFreeSelectionModeOn = false;
                        document.body.removeEventListener('mouseup', bodyMouseUpListener)
                        document.body.removeEventListener('mouseleave', bodyMouseUpListener)
                        displayFolderContent(stackItem.dir_id)
                    }
                }
                pathStackBlock.appendChild(pathFolder)
                let slash = document.createElement('span')
                slash.textContent = '/'
                pathStackBlock.appendChild(slash)
            }
            instrumentPanel.appendChild(pathStackBlock)
            document.title = (row.dir_name ? row.dir_name : '/') + ' - ' + dbName + ' - FileSysEmu'

            if (row.children_id_list.length > 0) {
                let childrenIds = row.children_id_list.split('\n')
                db.all(`SELECT * FROM tree WHERE dir_id
                 IN (${ childrenIds.map(id => `'${id}'`).join(',') })`, [], (e,childrenRows) => {try{
                    if (e) console.log(e);
                    children = childrenRows;
                    children.sort(rowComparators.nameAlphabeticalAscending);
                    //console.log(children);
                    for (let i = 0; i<children.length; i++) createItemTileView(children[i]);
                } catch(e) {console.log(e)}})
            } else {
                let empty = document.createElement('div')
                empty.className = 'empty'

                empty.appendChild(createSpacer())
                let emptyText = document.createElement('div')
                emptyText.textContent = 'Пусто.'
                empty.appendChild(emptyText)
                itemContainer.appendChild(empty)
            }
        } else {
            console.log('No directory with dir_id = ' + dirId)
        }
    } catch(e) {
        console.log(e)
    }});

    /*------------------------------------- Заполнение панели инструментов папки --------------------------------*/
    
    instrumentPanel.className = 'instrument_panel'
    instrumentPanel.onmousedown = function(e) {
        e.stopPropagation();
        e.preventDefault();
    }

    let addSubfolderButton = document.createElement('input')
    addSubfolderButton.type = 'button'
    addSubfolderButton.value = 'Создать папку'
    addSubfolderButton.onclick = createSubfolder
    instrumentPanel.appendChild(addSubfolderButton)

    let closeDatabaseButton = document.createElement('input')
    closeDatabaseButton.type = 'button'
    closeDatabaseButton.value = 'Закрыть базу данных'
    closeDatabaseButton.onclick = function() {
        instrumentPanel.remove();
        itemContainer.remove();
        if (db) {
            db.close((err) => {
                if (err) console.log(err);
                db = null;
                isTransactionOngoing = false
                createDatabaseSelectionMenu();
            });
        }
    }
    instrumentPanel.appendChild(closeDatabaseButton)

    let addItemButton = document.createElement('input')
    addItemButton.type = 'button'
    addItemButton.value = 'Добавить ссылки'
    addItemButton.onclick = addFiles
    instrumentPanel.appendChild(addItemButton)

    document.body.appendChild(instrumentPanel);
    document.body.appendChild(itemContainer)
}

function createDatabaseSelectionMenu() {
    document.title = 'Выбор базы данных - FileSysEmu'
    let instrumentPanel = document.createElement('div')
    let dbContainer = document.createElement('div')

    var askNewProjectPath = function() {
        let options = {
            title: "Сохранить новую базу данных",
            defaultPath: lastOpenFileDialogFolder || app.getPath('documents') || app.getPath('home') || ".",
            buttonLabel: "Сохранить базу данных",
            filters:[
                {name: 'Все файлы', extensions: ['*']}
            ]
        }
        dialog.showSaveDialog(WIN, options).then(result => {
            let filename = result.filePath;
            if (!filename) {
                console.log('No filename. Database not created');
                return;
            }
            lastOpenFileDialogFolder = filename.substring(0, filename.lastIndexOf(path.sep))
            if (filename.endsWith(".sqlite3db")) filename = filename.substring(0, filename.length - 10)
            openOrCreateDatabase(filename+'.sqlite3db', function() {
                fs.appendFile("projects.txt", filename+".sqlite3db\n", function(error) {
                    if (error) throw error; // если возникла ошибка
                    console.log("Добавление проекта в файл projects.txt завершено.");
                });
                instrumentPanel.remove();
                dbContainer.remove();
                displayFolderContent('0');
            })
        }).catch(err => {
            console.log(err)
        })
    }

    var openProjectPath = function() {
        let options = {
            title: "Открыть базу данных",
            defaultPath: lastOpenFileDialogFolder || app.getPath('documents') || app.getPath('home') || ".",
            buttonLabel: "Открыть базу данных",
            filters:[
                {name: 'Все файлы', extensions: ['*']}
            ],
            properties: ['openFile']
        }
        dialog.showOpenDialog(WIN, options).then(result => {
            let filename = result.filePaths[0];
            if (!filename) {
                console.log('No filename. Database not created');
                return;
            }
            lastOpenFileDialogFolder = filename.substring(0, filename.lastIndexOf(path.sep))
            openOrCreateDatabase(filename, function() {
                fs.appendFile("projects.txt", filename+"\n", function(error) {
                    if (error) throw error; // если возникла ошибка
                    console.log("Добавление проекта в файл projects.txt завершено.");
                });
                instrumentPanel.remove();
                dbContainer.remove();
                displayFolderContent('0');
            })
        }).catch(err => {
            console.log(err)
        })
    }
    let addProjectButton = document.createElement('input')
    addProjectButton.type = 'button'
    addProjectButton.value = 'Создать базу данных'
    addProjectButton.onclick = function() {
        askNewProjectPath();
    }
    instrumentPanel.appendChild(addProjectButton)
    let openProjectButton = document.createElement('input')
    openProjectButton.type = 'button'
    openProjectButton.value = 'Открыть существующую базу данных'
    openProjectButton.onclick = function() {
        openProjectPath();
    }
    instrumentPanel.appendChild(openProjectButton)
    document.body.appendChild(instrumentPanel)

    let fileContent = ''
    let listOfExistingDatabases = []
    try {
        fileContent = fs.readFileSync("projects.txt", "utf8");
    } catch (err) {
        console.log(err)
        fs.writeFile("projects.txt", "", function(error) {
            if (error) throw error; // если возникла ошибка
            console.log("Асинхронная запись пустого файла projects.txt завершена.");
        });
    }
    if (fileContent) {
        let listOfProjects = fileContent.split('\n')
        for (let i = 0; i<listOfProjects.length; i++) {
            let projectPath = listOfProjects[i]
            if (projectPath) {
                if (!fs.existsSync(projectPath)) {
                    console.log(projectPath + ' does not exist. Removing from list')
                    continue
                }
                let index = listOfExistingDatabases.indexOf(projectPath)
                if (index >= 0) listOfExistingDatabases.splice(index, 1)
                listOfExistingDatabases.push(projectPath)
            }
        }
    }
    fs.writeFile("projects.txt", listOfExistingDatabases.join('\n') + '\n', function(error) {
        if (error) throw error; // если возникла ошибка
        console.log("Асинхронная запись файла projects.txt завершена.");
    });
    if (!fileContent || listOfExistingDatabases.length == 0) {
        let noProjects = document.createElement('div')
        noProjects.className = 'no_projects'

        noProjects.appendChild(createSpacer())
        let noProjectsText = document.createElement('div')
        noProjectsText.textContent = 'Нет баз данных.'
        noProjects.appendChild(noProjectsText)
        dbContainer.appendChild(noProjects)
    } else {
        for (let i = listOfExistingDatabases.length - 1; i >= 0; i--) {
            let projectPath = listOfExistingDatabases[i]
            let projectBrick = document.createElement('div')
            projectBrick.className = 'project_brick'

            let projectIconBlock = document.createElement('div')
            projectIconBlock.className = 'item_tile_view_icon_block project_brick_icon_block'
            projectBrick.appendChild(projectIconBlock)

            let projectName = document.createElement('div')
            let projectNameBlock = document.createElement('div')
            let projectWoExt = projectPath.substring(0, projectPath.lastIndexOf('.'))
            projectNameBlock.textContent = (projectWoExt.length > 40 ? '...' : '')
                 + projectWoExt.substring(projectWoExt.length - 40)
            projectNameBlock.className = 'item_tile_view_name_block'
            let spacer = document.createElement('div')
            spacer.className = 'item_tile_view_name_block'
            spacer.style.height = '100%'
            projectName.appendChild(spacer)
            projectName.appendChild(projectNameBlock)
            projectBrick.appendChild(projectName)

            projectBrick.onclick = function() {
                openOrCreateDatabase(projectPath, function() {
                    instrumentPanel.remove();
                    dbContainer.remove();
                    displayFolderContent('0');
                })
            }
            dbContainer.appendChild(projectBrick)
        }
    }
    let appDescription = document.createElement('div')
    appDescription.innerHTML = `<p><b>FileSysEmu</b> - это эмулятор файловой системы, не накладывающий ограничения на длину пути 
        и допустимые символы в имени файла, основанный на SQLite. Вы можете создать базу данных и создавать в ней неограниченное
        число папок, подпапок и добавлять ссылки на настоящие файлы, расположенные в вашей файловой системе, или ссылки на 
        интернет-сайты.</p>

        <h2>Создать, открыть или удалить базу данных</h2>
        <p><b>Список баз данных</b>: любая база данных, созданная или открытая хотя бы раз на этом компьютере, помещается
        в список. Если вы перемещаете, переименовываете или удаляете файл базы не через FileSysEmu, программа
        не сможет найти ее и удалит из этого списка. Вы можете вернуть перемещенную или переименованную базу в список, открыв ее
        с помощью кнопки "Открыть базу данных".</p>
        <p><b>Создать</b>: с помощью кнопки "Создать базу данных" на панели инструментов. Новая база автоматически 
        откроется и добавится в список.</p>
        <p><b>Открыть</b>: если база данных есть в списке, вы можете открыть ее щелчком по ней. Если нет, то
        используйте кнопку "Открыть базу данных" на панели инструментов и найдите файл базы. Она откроется и добавится
        в список.</p>
        <p><b>Удалить</b>: если база данных есть в списке, наведите курсор на нее, щелкните на крестик и подтвердите удаление во 
        всплывающем окне. Также вы можете удалить файл базы данных с помощью любого файлового менеджера. <i>Удаление никак не затронет
        файлы, ссылки на которые вы добавили в базу. Оно только удалит эмулированную структуру папок и внутренние имена ссылок.
        Отменить это действие невозможно.</i></p>`
    dbContainer.appendChild(appDescription)
    document.body.appendChild(dbContainer)
}

clearMiniatureCache()
createDatabaseSelectionMenu()