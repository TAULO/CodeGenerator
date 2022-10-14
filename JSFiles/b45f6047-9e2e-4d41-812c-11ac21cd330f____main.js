import pathParse from "path-parse";
// var mime = require('mime-types');
import mime from "mime-types"
// console.log(mime);

class RatFolder {
    constructor(rootElm = undefined, autoInit = true, path = undefined, type = "paths") {
        this.rootElm = rootElm;
        this.pathType = type;
        this.path = path;
        this.reservedNames = ["#", "<", ">", "$", "+", "%", "!", "`", "&", "*", "'", "|", "{", "?", "\"", "=", "}", "/", ":", "\\", "@"];
        if (this.rootElm == undefined) throw new Error("No root element specified");

        if (autoInit) {
            this.define();
        } else if (!autoInit) {
            if (path != undefined && path instanceof Object && Object.keys(path).length != 0) {
                this.elm = this._parsePaths(this.path, document.createElement("div"));
                this.initialize(this.elm);
                // this.alert("D:\\rat-folder2\\yarn.lock", "file");
                // console.log(elm);
                /*this.message("yarn.lock", "file").sendAlert();
                this.message("minify.js", "file").sendWarn();
                this.message("rollup.config.js", "file").sendSuccess();
                this.message("package.json", "file").sendInfo();*/


            }
        }
    }

    define() {
        
    }

    initialize(elm = this.elm) {
        this.rootPath = this.path.path.replaceAll("\\", "/");
        this._resolvePathElement(elm, this.path);
        this._addComputeElements(elm);
        this._appendChild(elm);
        this._setInitialStyle(elm);
        this._setComputedStyles(elm);
        this._addEvents(elm);
        this._setGutters(elm);
        this._addDialog(this.rootElm);
        this._addToolbar(this.rootElm, elm.dataset.name);
        this._addRatNotify(this.rootElm);
    }

    reset() {
        if (type == "user-defined") {
            console.warn("User defined trees cannot be reseted. (this feature will be available soon, Happy using this library!!!!)");
            return;
        }
        this.rootElm.innerHTML = "";
        
        setTimeout(() => {
            this.elm = this._parsePaths(this.path, document.createElement("div"));
            this.initialize(this.elm);
            this.notify("Tree reset succesfully.", 2000, "success")
        }, 1500)
    }

    _addToolbar(elm, name = "root folder") {
        const toolbarElm = document.createElement("div");
        toolbarElm.classList.add("rat-tree-toolbar");

        const spanRatTreeRootLabelElm = document.createElement("span");
        spanRatTreeRootLabelElm.classList.add("rat-tree-root-label");
        spanRatTreeRootLabelElm.innerText = name;

        const divRatTreeFolderControlsElm = document.createElement("div");
        divRatTreeFolderControlsElm.classList.add("rat-tree-folder-controls");

        const folderButton = document.createElement("span");
        folderButton.classList.add("folder-control-icon");

        const I_element = document.createElement("i");
        I_element.classList.add("bi");

        const createFolderButton = folderButton.cloneNode(true);
        const createFolderButton_I_element = I_element.cloneNode(true);
        createFolderButton_I_element.classList.add("bi-folder-plus");
        createFolderButton.appendChild(createFolderButton_I_element);

        const createFileButton = folderButton.cloneNode(true);
        const createFileButton_I_element = I_element.cloneNode(true);
        createFileButton_I_element.classList.add("bi-file-earmark-plus-fill");
        createFileButton.appendChild(createFileButton_I_element);

        const refreshButton = folderButton.cloneNode(true);
        const refreshButton_I_element = I_element.cloneNode(true);
        refreshButton_I_element.classList.add("bi-arrow-clockwise");
        refreshButton.appendChild(refreshButton_I_element);

        divRatTreeFolderControlsElm.appendChild(createFolderButton);
        divRatTreeFolderControlsElm.appendChild(createFileButton);
        divRatTreeFolderControlsElm.appendChild(refreshButton);

        toolbarElm.appendChild(spanRatTreeRootLabelElm);
        toolbarElm.appendChild(divRatTreeFolderControlsElm);

        elm.insertAdjacentElement("afterbegin", toolbarElm);
    }

    _addDialog(elm) {
        const div_ratTreeDialogDivElement = document.createElement("div");
        div_ratTreeDialogDivElement.classList.add("rat-tree-dialog-div");

        const div_ratTreeDialogElement = document.createElement("div");
        div_ratTreeDialogElement.classList.add("rat-tree-dialog");
        div_ratTreeDialogElement.dataset.message = "to proceed your action ?";

        div_ratTreeDialogDivElement.appendChild(div_ratTreeDialogElement);

        const span_ratTreeDialogLabelElement = document.createElement("span");
        span_ratTreeDialogLabelElement.classList.add("rat-tree-dialog-label");
        span_ratTreeDialogLabelElement.innerHTML = `Are you sure you want <span>${div_ratTreeDialogElement.dataset.message}</span>`;

        const div_ratTreeDialogButtonsElement = document.createElement("div");
        div_ratTreeDialogButtonsElement.classList.add("rat-tree-dialog-buttons");

        div_ratTreeDialogElement.appendChild(span_ratTreeDialogLabelElement);
        div_ratTreeDialogElement.appendChild(div_ratTreeDialogButtonsElement);

        const button_ratTreeYesElement = document.createElement("button");
        button_ratTreeYesElement.classList.add("rat-tree-button-yes");
        button_ratTreeYesElement.innerText = "Yes";

        const button_ratTreeNoElement = document.createElement("button");
        button_ratTreeNoElement.classList.add("rat-tree-button-no");
        button_ratTreeNoElement.innerText = "No";

        div_ratTreeDialogButtonsElement.appendChild(button_ratTreeYesElement);
        div_ratTreeDialogButtonsElement.appendChild(button_ratTreeNoElement);

        this.dialogElement = div_ratTreeDialogDivElement;
        elm.appendChild(this.dialogElement);

        const observer = new MutationObserver((mutationList) => {
            mutationList.forEach(mutation => {
                if (mutation.type == "attributes") {
                    if (mutation.attributeName == "data-message") {
                        this.dialogElement.querySelector("span.rat-tree-dialog-label span").innerText = 
                            this.dialogElement.querySelector("div.rat-tree-dialog").dataset.message;
                    }
                }
            })
        })

        observer.observe(this.dialogElement, {attributes: true, childList: true, subtree: true});
    }

    _addRatNotify(elm) {
        const ratTreeNotifyDivElement = document.createElement("div");
        ratTreeNotifyDivElement.classList.add("rat-tree-notify-div", "rat-tree-notify-div-hide");

        const ratTreeNotifyElement = document.createElement("div");
        ratTreeNotifyElement.classList.add("rat-tree-notify");

        const ratTreeNotifyLabelElement = document.createElement("span");
        ratTreeNotifyLabelElement.classList.add("rat-tree-notify-label");
        ratTreeNotifyLabelElement.innerText = "Notification";

        const ratTreeCloseButton = document.createElement("button");
        ratTreeCloseButton.classList.add("rat-tree-close-button");
        ratTreeCloseButton.innerHTML = "<i class=\"bi bi-x\"></i>";

        ratTreeNotifyDivElement.appendChild(ratTreeNotifyElement);
        ratTreeNotifyElement.appendChild(ratTreeNotifyLabelElement);
        ratTreeNotifyElement.appendChild(ratTreeCloseButton);

        this.notifyElement = ratTreeNotifyDivElement;

        elm.appendChild(ratTreeNotifyDivElement);

        ratTreeCloseButton.addEventListener("click", () => {
            if (!this.notifyElement.classList.contains("rat-tree-notify-div-hide")) {
                this.notifyElement.classList.add("rat-tree-notify-div-hide")
            }

            if (this.notifyElement.querySelector("div.rat-tree-notify").classList.contains("rat-notify-show")) {
                this.notifyElement.querySelector("div.rat-tree-notify").classList.remove("rat-notify-show");
            }
        })
    }

    _toggleDialog() {
        this.dialogElement.classList.toggle("rat-dialog-active");
        this.dialogElement.querySelector("div.rat-tree-dialog").classList.toggle("rat-dialog-active");
    }

    dialog(type = "default") {
        if (type == "default") {
            if (this.dialogElement.querySelector("div.rat-tree-dialog").classList.contains("rat-dialog-danger")) {
                this.dialogElement.querySelector("div.rat-tree-dialog").classList.remove("rat-dialog-danger");
            }

            if (this.dialogElement.querySelector("div.rat-tree-dialog").classList.contains("rat-dialog-success")) {
                this.dialogElement.querySelector("div.rat-tree-dialog").classList.remove("rat-dialog-success");
            }
        } else if (type == "success") {
            if (this.dialogElement.querySelector("div.rat-tree-dialog").classList.contains("rat-dialog-danger")) {
                this.dialogElement.querySelector("div.rat-tree-dialog").classList.remove("rat-dialog-danger");
            }

            this.dialogElement.querySelector("div.rat-tree-dialog").classList.add("rat-dialog-success")
        } else if (type == "danger") {
            if (this.dialogElement.querySelector("div.rat-tree-dialog").classList.contains("rat-dialog-success")) {
                this.dialogElement.querySelector("div.rat-tree-dialog").classList.remove("rat-dialog-success");
            }

            this.dialogElement.querySelector("div.rat-tree-dialog").classList.add("rat-dialog-danger")
        }
        // this.dialogElement.querySelector("div.rat-tree-dialog").classList.add("rat-dialog-danger")
        if (this.dialogElement.classList.contains("rat-dialog-active")) {
            if (type == "success") {
                if (this.dialogElement.querySelector("div.rat-tree-dialog").classList.contains("rat-dialog-danger")) {
                    this.dialogElement.querySelector("div.rat-tree-dialog").classList.remove("rat-dialog-danger");
                }

                this.dialogElement.querySelector("div.rat-tree-dialog").classList.add("rat-dialog-success");
            } else if (type == "danger") {
                if (this.dialogElement.querySelector("div.rat-tree-dialog").classList.contains("rat-dialog-success")) {
                    this.dialogElement.querySelector("div.rat-tree-dialog").classList.remove("rat-dialog-success");
                }

                this.dialogElement.querySelector("div.rat-tree-dialog").classList.add("rat-dialog-danger");
            } else if (type == "default") {
                this._toggleDialog();
                return;
            }
        } else if (!this.dialogElement.classList.contains("rat-dialog-active")) {
            this._toggleDialog();
        }

        this.dialogPromise = new Promise((resolve, reject) => {
            this.dialogElement.querySelector("button.rat-tree-button-yes").addEventListener("click", () => {
                resolve((obj) => {
                    this._toggleDialog();
                });
            });

            this.dialogElement.querySelector("button.rat-tree-button-no").addEventListener("click", () => {
                reject((obj) => {
                    this._toggleDialog();
                });
            })
        });

        return this.dialogPromise;
    }

    notify(msg = "Notification", duration = 2000, type = "default") {

        if (type == "success") {
            this.notifyElement.querySelector("div.rat-tree-notify").classList.add("rat-tree-notify-success");
        } else if (type == "danger") {
            this.notifyElement.querySelector("div.rat-tree-notify").classList.add("rat-tree-notify-danger");
        }

        // console.log(this.notifyElement.querySelector("rat-tree-notify"));
        this.notifyElement.style= "--duration:" + duration + "ms !important";
        this.notifyElement.querySelector("span.rat-tree-notify-label").innerText = msg;

        if (this.notifyElement.classList.contains("rat-tree-notify-div-hide")) {
            this.notifyElement.classList.remove("rat-tree-notify-div-hide");
        }

        if (!this.notifyElement.querySelector("div.rat-tree-notify").classList.contains("rat-notify-show")) {
            this.notifyElement.querySelector("div.rat-tree-notify").classList.add("rat-notify-show");
        }

        setTimeout(() => {
            if (!this.notifyElement.classList.contains("rat-tree-notify-div-hide")) {
                this.notifyElement.classList.add("rat-tree-notify-div-hide")
            }

            if (this.notifyElement.querySelector("div.rat-tree-notify").classList.contains("rat-notify-show")) {
                this.notifyElement.querySelector("div.rat-tree-notify").classList.remove("rat-notify-show");
            }
            
        }, duration);

    }

    changeDialogMessage(msg = this.dialogElement.querySelector("div.rat-tree-dialog").dataset.message, type = "default") {
        this.dialogElement.querySelector("div.rat-tree-dialog").dataset.message = msg;
    }

    _parsePaths(path, elm) {
        // console.log(path);
        if (path.children) {
            // const folder = document.createElement("div");
            elm.classList.add("folder", "view-element");
            elm.dataset.name = path.name;
            elm.dataset.event = false;

            path.children.forEach(e => {
                if (e.type == "directory") {
                    const subFolder = document.createElement("div");
                    subFolder.classList.add("folder", "view-element");
                    subFolder.dataset.name = e.name;
                    subFolder.dataset.path = e.path.replaceAll("\\", "/");
                    subFolder.dataset["pathWindows"] = e.path;
                    subFolder.dataset.size = e.size;
                    subFolder.tabIndex = -1;
                    subFolder.dataset.event = false;
                    // subFolder.dataset.height = subFolder.offsetHeight;
                    // subFolder.dataset.width = subFolder.offsetWidth;
                    elm.appendChild(subFolder)

                    if (e.children) {
                        this._parsePaths(e, subFolder);
                    }
                }
            })

            path.children.forEach(e => {
                if (e.type == "file") {
                    const file = document.createElement("div");
                    file.classList.add("file", "view-element");
                    file.dataset.name = e.name;
                    file.dataset.extension = pathParse(e.path).ext;
                    if (file.dataset.title == file.dataset.extension) file.dataset.name = null;
                    file.dataset.path = e.path.replaceAll("\\", "/");
                    file.dataset["pathWindows"] = e.path;
                    file.dataset.size = e.size;
                    file.tabIndex = -1;
                    file.dataset.event = false;
                    elm.appendChild(file);
                }
            });

            // elm.appendChild(folder);
        }

        return elm;
    }

    _resolvePathElement(elm, path) {
        if (elm.classList.contains("folder")) {
            elm.classList.remove("folder");
            elm.classList.add("rat-tree");
            // elm.classList.add("rat-tree-root");
        }

        if (elm.classList.contains("view-element")) {
            elm.classList.remove("view-element");
        }

        elm.dataset.path = path.path;
        elm.dataset.size = path.size;

        let folders = elm.querySelectorAll("div.folder.view-element");
        let files = elm.querySelectorAll("div.file.view-element");

        folders.forEach(folder => {
            let folderName = folder.dataset.name;

            let spanTextElement = document.createElement("span");
            spanTextElement.classList.add("textElement");

            let spanLabelElement = document.createElement("span");
            spanLabelElement.classList.add("label");
            spanLabelElement.innerText = folderName;

            spanTextElement.appendChild(spanLabelElement);
            folder.insertAdjacentElement("afterbegin", spanTextElement);

        })

        files.forEach(file => {
            let fileName = file.dataset.name;
            let fileExtension = file.dataset.extension;

            let spanTextElement = document.createElement("span");
            spanTextElement.classList.add("textElement");

            let spanLabelElement = document.createElement("span");
            spanLabelElement.classList.add("label");
            spanLabelElement.innerText = fileName;

            spanTextElement.appendChild(spanLabelElement);
            file.insertAdjacentElement("afterbegin", spanTextElement);

        })
    }

    _addComputeElements(elm) {
        let folders = elm.querySelectorAll("div.folder.view-element");
        let files = elm.querySelectorAll("div.file.view-element");

        folders.forEach(folder => {
            const span = document.createElement("span");
            span.classList.add("caret");

            const i_Element = document.createElement("i");
            // i_Element.classList.add("bi", "bi-chevron-right");
            i_Element.classList.add("bi", "bi-caret-right-fill");

            const folderSpan = document.createElement("span");
            folderSpan.classList.add("folderIcon")
            const folderIElement = document.createElement("i");
            folderIElement.classList.add("bi", "bi-folder-fill");

            span.appendChild(i_Element);
            folderSpan.appendChild(folderIElement);

            if (!folder.querySelector('span.textElement > span.folderIcon')) {
                folder.querySelector("span.textElement").insertAdjacentElement("afterbegin", folderSpan);
            }

            if (!folder.querySelector("span.textElement > span.caret")) {
                folder.querySelector("span.textElement").insertAdjacentElement("afterbegin", span);
            }
        })

        files.forEach(file => {
            const span = document.createElement("span");
            span.classList.add("fileIcon");

            const i_Element = document.createElement("i");
            i_Element.classList.add("bi", "bi-file-earmark-fill");

            span.appendChild(i_Element);

            const input = document.createElement("input");
            input.type = "text";
            input.value = file.dataset.name;
            input.classList.add("rat-element-input");

            if (!file.querySelector("span.textElement > span.fileIcon")) {
                file.querySelector("span.textElement").insertAdjacentElement("afterbegin", span);
            }

            if (!file.querySelector("span.textElement > input.rat-element-input")) {
                file.querySelector("span.textElement").appendChild(input);
            }
        })
    }

    _appendChild(elm) {
        this.rootElm.appendChild(elm);
    }

    _setInitialStyle(elm, gap = 5) {
        this.sizes = {
            caret: 12,
            folderIcon: 12,
            fileIcon: 12,
            gap,
            totalFolderPadding: gap + 12 + gap + 12 + gap,
            totalFilePadding: gap + 12 + gap

        };

        if (elm.querySelector("div.folder.view-element")) {
            this.sizes.caret = parseInt(
                getComputedStyle(elm.querySelector("div.folder.view-element > span.textElement > span.caret"))
                    .getPropertyValue("font-size")
            ) || 12;
            this.sizes.folderIcon = parseInt(
                getComputedStyle(elm.querySelector("div.folder.view-element > span.textElement > span.folderIcon"))
                    .getPropertyValue("font-size")
            ) || 12;
        }

        if (elm.querySelector("div.file.view-element")) {
            this.sizes.fileIcon = parseInt(
                getComputedStyle(elm.querySelector("div.file.view-element > span.textElement > span.fileIcon"))
                    .getPropertyValue("font-size")
            ) || 12;
        }

        this.sizes.totalFolderPadding = (this.sizes.gap * 3) + (this.sizes.caret + this.sizes.folderIcon);
        this.sizes.totalFilePadding = (this.sizes.gap * 2) + (this.sizes.fileIcon);
        this.sizes.iconOffset = (this.sizes.totalFolderPadding - this.sizes.folderIcon) - this.sizes.gap;

        const styleElement = document.createElement("style");
        styleElement.id = "rat-tree-view-styling";

        const styleText = `
            div.tree-view-container div.folder.view-element > span.textElement {
                padding-left: ${this.sizes.totalFolderPadding}px;
                padding-right: ${this.sizes.totalFolderPadding}px;
            }
            
            div.tree-view-container div.folder.view-element > span.textElement > span.caret {
                left: ${this.sizes.gap}px;
            }

            div.tree-view-container div.folder.view-element > span.textElement > span.folderIcon {
                left: ${this.sizes.iconOffset}px;
            }

            div.tree-view-container div.file.view-element > span.textElement > span.fileIcon {
                left: ${this.sizes.iconOffset}px;
            }

            div.tree-view-container div.file.view-element > span.textElement {
                padding-left: ${this.sizes.totalFolderPadding}px;
                padding-right: ${this.sizes.totalFolderPadding}px;
            }
        `;

        styleElement.innerText = styleText;

        if (document.head.querySelector("style#rat-tree-view-styling")) {
            document.head.querySelector("style#rat-tree-view-styling").innerText = styleText;
        } else {
            document.head.insertAdjacentElement("beforeend", styleElement);
        }

        // console.log(this.sizes);

    }

    _setComputedStyles(elm) {
        const folders = elm.querySelectorAll("div.folder.view-element");
        const files = elm.querySelectorAll("div.file.view-element");
        const folderIcons = elm.querySelectorAll("span.folderIcon");
        const fileIcons = elm.querySelectorAll("span.fileIcon");
        const carets = elm.querySelectorAll("span.caret");

        folders.forEach(folder => {
            if (folder.parentElement.classList.contains("rat-tree")) {
                folder.querySelector("span.textElement").style.paddingLeft = this.sizes.totalFolderPadding + "px";
            } else if (folder.parentElement.classList.contains("folder")) {
                const padding = (folder.parentElement.querySelector("span.textElement").style.paddingLeft || this.sizes.totalFolderPadding);
                const computePadding = parseInt(padding) + this.sizes.folderIcon;
                folder.querySelector("span.textElement").style.paddingLeft = computePadding + "px";
            }
        })

        files.forEach(file => {
            if (file.parentElement.classList.contains("folder")) {
                const computePaddingFile = parseInt(file.parentElement.querySelector("span.textElement").style.paddingLeft) + this.sizes.folderIcon;
                const spanElement = file.querySelector("span.textElement");
                spanElement.style.paddingLeft = computePaddingFile + "px";
            }
        })

        // folderIcons.forEach(icon => {
        //     // if (icon.parentElement.parentElement.parentElement.classList.contains("rat-tree-root")) return;
        //     const padding = parseInt(icon.parentElement.style.paddingLeft)
        //     const computeOffset = (padding - this.sizes.folderIcon) - (this.sizes.gap);
        //     icon.style.left = computeOffset + "px";
        // })

        folderIcons.forEach(icon => {
            if (icon.parentElement.parentElement.parentElement.classList.contains("rat-tree-root")) return;
            const padding = parseInt(icon.parentElement.style.paddingLeft)
            const computeOffset = (padding - this.sizes.totalFolderPadding) + (this.sizes.gap * 2) + this.sizes.folderIcon;
            icon.style.left = computeOffset + "px";
        })

        /*fileIcons.forEach(icon => {
            // if (icon.parentElement.parentElement.parentElement.classList.contains("rat-tree-root")) return;
            const padding = parseInt(icon.parentElement.style.paddingLeft)
            const computeOffset = (padding - this.sizes.folderIcon) - (this.sizes.gap);
            icon.style.left = computeOffset + "px";
        })*/

        fileIcons.forEach(icon => {
            if (icon.parentElement.parentElement.parentElement.classList.contains("rat-tree-root")) return;
            const padding = parseInt(icon.parentElement.style.paddingLeft)
            const computeOffset = (padding - this.sizes.totalFolderPadding) + (this.sizes.gap * 2) + this.sizes.folderIcon;
            icon.style.left = computeOffset + "px";
        })

        /*carets.forEach(caret => {
            if (caret.parentElement.parentElement.parentElement.classList.contains("rat-tree-root")) return;
            const padding = parseInt(caret.parentElement.style.paddingLeft)
            const computeOffset = (padding - (this.sizes.caret * 2)) - (this.sizes.gap * 3);
            caret.style.left = computeOffset + "px";
        })*/

        carets.forEach(caret => {
            if (caret.parentElement.parentElement.parentElement.classList.contains("rat-tree-root")) return;
            const padding = parseInt(caret.parentElement.style.paddingLeft)
            const computeOffset = (padding - this.sizes.totalFolderPadding) + this.sizes.gap;
            caret.style.left = computeOffset + "px";
        })
    }

    _setGutters(elm) {
        const folders = elm.querySelectorAll("div.folder.view-element");

        folders.forEach(folder => {
            folder.classList.toggle("active");
            // const folderTopOffset = folder.getBoundingClientRect();
            const folderTopOffset = getComputedStyle(folder).getPropertyValue("height");
            // const caretOffset = folder.querySelector("span.textElement > span.caret");
            const caretOffset = folder.querySelector("span.textElement > span.caret");
            folder.style = `
            --top: ${folderTopOffset};
            // --left: calc(${caretOffset.style.left} + ${caretOffset.getBoundingClientRect().width / 2}px);
            --left: calc(${parseInt(getComputedStyle(caretOffset).getPropertyValue("left"))}px + ${caretOffset.getBoundingClientRect().width / 2}px);
            `;
            // console.log(folderTopOffset);
            // folder.classList.toggle("active");
        })

        folders.forEach(folder => {
            folder.classList.toggle("active");
        })
    }

    _addEvents(elm) {
        const folders = elm.querySelectorAll("div.folder.view-element");
        const files = elm.querySelectorAll("div.file.view-element");
        // console.log(folders)
        if (folders) {
            folders.forEach(folder => {
                if (folder.dataset.event == "false") {
                    folder.dataset.event = true;
                    const caret = folder.querySelector("span.textElement > span.caret");

                    // caret.removeEventListener("click", () => {});
                    caret.addEventListener("click", () => {
                        this.toggleCaret(folder);
                        caret.parentElement.parentElement.classList.toggle("viewGutter");
                        caret.parentElement.parentElement.classList.toggle("rat-opened");
                        if (!caret.parentElement.parentElement.classList.contains("rat-hovered")) {
                            caret.parentElement.parentElement.classList.add("rat-hovered");
                        } else if (caret.parentElement.parentElement.classList.contains("rat-hovered")) {
                            caret.parentElement.parentElement.classList.remove("rat-hovered");
                        }

                        if (folder.children) {
                            for (let subFolder of folder.children) {
                                if (subFolder.classList.contains("folder")) {
                                    subFolder.classList.toggle("active")
                                }
                            }

                            for (let file of folder.children) {
                                if (file.classList.contains("file")) {
                                    file.classList.toggle("active");
                                }
                            }
                        };
                    })

                    // folder.removeEventListener("mouseenter", () => {});
                    folder.addEventListener("mouseenter", () => {
                        if (!folder.classList.contains("viewGutter")) return;
                        if (!folder.classList.contains("rat-hovered")) {
                            folder.classList.add("rat-hovered")
                        }
                    })

                    // folder.removeEventListener("mouseleave", () => {});
                    folder.addEventListener("mouseleave", () => {
                        if (!folder.classList.contains("viewGutter")) return;
                        if (folder.classList.contains("rat-hovered")) {
                            folder.classList.remove("rat-hovered")
                        }
                    })
                }
                
            })
        }

        if (files) {
            files.forEach(file => {
                // console.log(file)
                if (file.dataset.event == "false") {
                    file.dataset.event = true;

                    file.addEventListener("click", () => {
                        this.focusedFileElement = file;
                        /*files.forEach(file2 => {
                            file2.blur();
                        })*/

                        file.focus();

                        // console.log(this.focusedFileElement);
                    })
                }
            })
        }
        this.rootElm.dataset.loaded = true;
    }

    toggleCaret(elm) {
        const i = elm.querySelector("span.textElement > span.caret > i.bi");
        if (i.classList.contains("bi-caret-right-fill")) {
            i.classList.toggle("bi-caret-right-fill");
            i.classList.toggle("bi-caret-down-fill");
        } else if (i.classList.contains("bi-caret-down-fill")) {
            i.classList.toggle("bi-caret-right-fill");
            i.classList.toggle("bi-caret-down-fill");
        }
        
    }

    message(path, type) {
        if (!this.rootElm.dataset.loaded) return;
        const elm = this.elm;
        var targetElement;
        var className;
        var blinkInterval;

        const newPath = this.rootPath + "/" + path;

        if (type == "file") {
            const files = elm.querySelectorAll("[data-path].file");

            files.forEach(file => {
                const dataPath = file.dataset.path;
                if (dataPath == newPath) {
                    targetElement = file;
                }
            })
        }

        if (type == "folder") {
            const folders = elm.querySelectorAll("[data-path].folder");

            folders.forEach(folder => {
                const dataPath = folder.dataset.path;
                if (dataPath == newPath) {
                    targetElement = folder;
                }
            })
        }

        function blink(ms = 200) {
            if (!className) {
                console.warn("Please use a message method first");
                return
            }
            if (blinkInterval) clearInterval(blinkInterval);
            blinkInterval = setInterval(() => {
                targetElement.classList.toggle(className);
            }, ms)
        }

        function disposeBlink(e = false) {
            if (blinkInterval) {
                clearInterval(blinkInterval)
                blinkInterval = false;
                if (e) {
                    if (!targetElement.classList.contains(className)) {
                        targetElement.classList.add(className);
                    }
                } else if (!e) {
                    if (targetElement.classList.contains(className)) {
                        targetElement.classList.remove(className);
                    }
                }
            }
        }

        function turnOff() {
            if (targetElement) {
                if (targetElement.classList.contains(className)) {
                    targetElement.classList.remove(className);
                }
            }
        }

        function sendAlert() {
            className = "rat-alert";            
            targetElement.classList.toggle(className);
        }

        function sendWarn() {
            className = "rat-warning";            
            targetElement.classList.toggle(className);
        }

        function sendSuccess() {
            className = "rat-success";            
            targetElement.classList.toggle(className);
        }

        function sendInfo() {
            className = "rat-info";            
            targetElement.classList.toggle(className);
        }

        function timeout(timeout = 1000) {
            setTimeout(() => {
                turnOff();
            }, timeout)
        }

        return {
            path,
            blink,
            disposeBlink,
            turnOff,
            sendAlert,
            sendWarn,
            sendSuccess,
            sendInfo,
        }
    }

    refresh(eventAdder = true, elm = this.elm) {
        this._addComputeElements(elm);
        this._setComputedStyles(elm);
        this._setGutters(elm);
        // if (eventAdder == true) {
            this._addEvents(elm);
        // }
    }

    _createFileElement(name, ext, path) {
        // console.log("element", name, ext, path);
        const fileElement = document.createElement("div");
        fileElement.classList.add("file", "view-element");
        fileElement.dataset.name = name;
        fileElement.dataset.extension = ext;
        fileElement.dataset.path = path;
        fileElement.dataset.pathWindows = path.replaceAll("/", "\\");
        fileElement.dataset.event = false;
        fileElement.tabIndex = -1;

        const spanTextElement = document.createElement("span");
        spanTextElement.classList.add("textElement");

        const spanLabelElement = document.createElement("span");
        spanLabelElement.classList.add("label");
        spanLabelElement.innerText = name;

        const input = document.createElement("input");
        input.type = "text";
        input.classList.add("rat-element-input");

        spanTextElement.appendChild(input);
        spanTextElement.appendChild(spanLabelElement);
        fileElement.appendChild(spanTextElement);


        return fileElement;
    }

    _createFolderElement(name, path) {
        // console.log("element", name, ext, path);
        const folderElement = document.createElement("div");
        folderElement.classList.add("folder", "view-element");
        folderElement.dataset.name = name;
        folderElement.dataset.path = path;
        folderElement.dataset.pathWindows = path.replaceAll("/", "\\");
        folderElement.dataset.event = false;
        folderElement.tabIndex = -1;

        const spanTextElement = document.createElement("span");
        spanTextElement.classList.add("textElement");

        const spanLabelElement = document.createElement("span");
        spanLabelElement.classList.add("label");
        spanLabelElement.innerText = name;

        const input = document.createElement("input");
        input.type = "text";
        input.value = name;
        input.classList.add("rat-element-input");

        spanTextElement.appendChild(input);
        spanTextElement.appendChild(spanLabelElement);
        folderElement.appendChild(spanTextElement);

        return folderElement;
    }

    addFile(referencePath, referencePathType, config, cb) {
        if (referencePath == "/" && referencePathType == "root") {
           try {
               var root = this.elm;

               if (root == null || undefined) {
                   console.warn(`Reference path(${referencePath}) cannot find the element.`);
                   return;
               };

               if (!config.name || !config.extension) {
                    console.warn("A file name or extension was not given. PLease specify it.");
                    return;
               }

               if (!config.name.includes(config.extension)) {
                    console.error("Given extension doesn't exists in the name. PLease specify it properly.");
                    return;
               }

               const configName = config.name;
               const configExtension = config.extension;

               const fileElement = this._createFileElement(configName, configExtension, root.dataset.path + "/" + configName);

               for (const children of root.children) {
                   if (children.classList.contains("file") && fileElement.dataset.name == children.dataset.name) {
                       console.error("A file with same name exists.");
                       return;
                   }
               }

               const fileElementNames = [];
               fileElementNames.push(fileElement.dataset.name);

               for (const children of root.children) {
                   if (children.classList.contains("file")) {
                       fileElementNames.push(children.dataset.name);
                       fileElementNames.sort();                        
                   }
               }

               const nextFileElementName = fileElementNames[fileElementNames.indexOf(fileElement.dataset.name) + 1];

               if (nextFileElementName != undefined) {
                   root.querySelector(`[data-name="${nextFileElementName}"].file`)
                   .insertAdjacentElement("beforebegin", fileElement);
                   this.refresh();
               } else if (nextFileElementName == undefined) {
                   root.appendChild(fileElement);
                   this.refresh();
               }

               if (cb != undefined && cb(
                   fileElement,
                   root, 
                   {
                       referencePath,
                       computedReferencePath: this.rootPath, 
                       path: fileElement.dataset.path, 
                       fileName: fileElement.dataset.name, 
                       fileExtension: fileElement.dataset.extension
                   }) == "remove-element") {
                   fileElement.remove();
               }

               // console.log(parentElement.querySelector(`[data-name="${nextFileElementName}"].file`))
               // console.log(fileElementNames, nextFileElementName);

           } catch (err) {
               // console.warn(`Reference path(${referencePath}) cannot find the element.`)
               console.log(err)
           } 
        } else if (referencePathType == "file") {
            const newPath = this.rootPath + "/" + referencePath.replaceAll("\\", "/");
            try {
                var file = this.elm.querySelector(`[data-path="${newPath}"].file`);

                this.elm.querySelectorAll(`[data-path].file`).forEach(elm => {
                    if (elm.dataset.path == newPath) {
                        file = elm;
                        // console.log(file)
                    }
                })

                if (file == null || undefined) {
                    console.warn(`Reference path<${referencePath}> cannot find the element.`);
                    return;
                };
                const { parentElement } = file;

                if (!config.name || !config.extension) {
                    console.warn("A file name or extension was not given. PLease specify it.");
                    return;
                }
                const configName = config.name;
                const configExtension = config.extension;

                const fileElement = this._createFileElement(configName, configExtension, parentElement.dataset.path + "/" + configName);

                if (parentElement.classList.contains("rat-opened")) {
                    fileElement.classList.add("active");
                }

                for (const children of parentElement.children) {
                    if (children.classList.contains("file") && fileElement.dataset.name == children.dataset.name) {
                        console.error("A file with same name exists.");
                        return;
                    }
                }

                const fileElementNames = [];
                fileElementNames.push(fileElement.dataset.name);

                for (const children of parentElement.children) {
                    if (children.classList.contains("file")) {
                        fileElementNames.push(children.dataset.name);
                        fileElementNames.sort();                        
                    }
                }

                const nextFileElementName = fileElementNames[fileElementNames.indexOf(fileElement.dataset.name) + 1];

                if (nextFileElementName != undefined) {
                    parentElement.querySelector(`[data-name="${nextFileElementName}"].file`)
                    .insertAdjacentElement("beforebegin", fileElement);
                    this.refresh();
                } else if (nextFileElementName == undefined) {
                    parentElement.appendChild(fileElement);
                    this.refresh();
                }

                if (cb != undefined && cb(
                    fileElement,
                    parentElement, 
                    {
                        referencePath,
                        computedReferencePath: this.rootPath + "/" + referencePath.replaceAll("\\", "/"), 
                        path: fileElement.dataset.path, 
                        fileName: fileElement.dataset.name, 
                        fileExtension: fileElement.dataset.extension
                    }) == "remove-element") {
                    fileElement.remove();
                }

                // console.log(parentElement.querySelector(`[data-name="${nextFileElementName}"].file`))
                // console.log(fileElementNames, nextFileElementName);

            } catch (err) {
                // console.warn(`Reference path(${referencePath}) cannot find the element.`)
                console.log(err)
            }
        } else if (referencePathType == "folder") {
            const newPath = this.rootPath + "/" + referencePath.replaceAll("\\", "/");
            try {
                var folder = this.elm.querySelector(`[data-path="${newPath}"].folder`);

                this.elm.querySelectorAll(`[data-path].folder`).forEach(elm => {
                    if (elm.dataset.path == newPath) {
                        folder = elm;
                        // console.log(file)
                    }
                })

                if (folder == null || undefined) {
                    console.warn(`Reference path(${referencePath}) cannot find the element.`);
                    return;
                };

                if (!config.name || !config.extension) {
                    console.warn("A file name or extension was not given. PLease specify it.");
                    return;
                }
                const configName = config.name;
                const configExtension = config.extension;

                const fileElement = this._createFileElement(configName, configExtension, folder.dataset.path + "/" + configName);

                if (folder.classList.contains("rat-opened")) {
                    fileElement.classList.add("active");
                }

                for (const children of folder.children) {
                    if (children.classList.contains("file") && fileElement.dataset.name == children.dataset.name) {
                        console.error("A file with same name exists.");
                        return;
                    }
                }

                const fileElementNames = [];
                fileElementNames.push(fileElement.dataset.name);

                for (const children of folder.children) {
                    if (children.classList.contains("file")) {
                        fileElementNames.push(children.dataset.name);
                        fileElementNames.sort();                        
                    }
                }

                const nextFileElementName = fileElementNames[fileElementNames.indexOf(fileElement.dataset.name) + 1];

                if (nextFileElementName != undefined) {
                    folder.querySelector(`[data-name="${nextFileElementName}"].file`)
                    .insertAdjacentElement("beforebegin", fileElement);
                    this.refresh();
                } else if (nextFileElementName == undefined) {
                    folder.appendChild(fileElement);
                    this.refresh();
                }

                if (cb != undefined && cb(
                    fileElement,
                    folder, 
                    {
                        referencePath,
                        computedReferencePath: this.rootPath + "/" + referencePath.replaceAll("\\", "/"), 
                        path: fileElement.dataset.path, 
                        fileName: fileElement.dataset.name, 
                        fileExtension: fileElement.dataset.extension
                    }) == "remove-element") {
                    fileElement.remove();
                }

                // console.log(parentElement.querySelector(`[data-name="${nextFileElementName}"].file`))
                // console.log(fileElementNames, nextFileElementName);

            } catch (err) {
                // console.warn(`Reference path(${referencePath}) cannot find the element.`)
                console.log(err)
            }
        }
    }

    addFolder(referencePath, referencePathType, config, cb) {
        if (referencePath == "/" && referencePathType == "root") {
            const newPath = this.rootPath + "/" + referencePath;
            
            try {
                if (!config.name) {
                    console.warn("A file name or extension was not given. PLease specify it.");
                    return;
                }

                const configName = config.name;

                const folderElement = this._createFolderElement(configName, this.elm.dataset.path + "/" + configName);

                for (const children of this.elm.children) {
                    if (children.classList.contains("folder") && folderElement.dataset.name == children.dataset.name) {
                        console.error("A folder with same name exists.");
                        return;
                    }
                }

                const folderElementNames = [];
                folderElementNames.push(folderElement.dataset.name);

                for (const children of this.elm.children) {
                    if (children.classList.contains("folder")) {
                        folderElementNames.push(children.dataset.name);
                        folderElementNames.sort();                        
                    }
                }

                const nextFolderElementName = folderElementNames[folderElementNames.indexOf(folderElement.dataset.name) + 1];

                if (nextFolderElementName != undefined) {
                    this.elm.querySelector(`[data-name="${nextFolderElementName}"].folder`)
                    .insertAdjacentElement("beforebegin", folderElement);
                    this.refresh();
                } else if (nextFolderElementName == undefined) {
                    const elms = [];
                    for (const children of this.elm.children) {
                        if (children.classList.contains("folder")) {
                            elms.push(children);
                        }
                    }
                    elms[elms.length - 1].insertAdjacentElement("afterend", folderElement);
                    this.refresh();
                }

                if (cb != undefined && cb(
                    folderElement,
                    this.elm, 
                    {
                        referencePath,
                        computedReferencePath: this.rootPath, 
                        path: folderElement.dataset.path, 
                        fileName: folderElement.dataset.name
                    }) == "remove-element") {
                    folderElement.remove();
                }

                // console.log(parentElement)
            } catch (err) {
                console.log(err)
            }
        } else if (referencePathType == "file") {
            const newPath = this.rootPath + "/" + referencePath;
            
            try {
                var file = this.elm.querySelector(`[data-path="${newPath}"].file`);

                if (file == null || undefined) {
                    console.warn(`Reference path <${referencePath}> cannot find the element.`);
                    return;
                };

                const parentElement = file.parentElement;

                if (!config.name) {
                    console.warn("A file name or extension was not given. PLease specify it.");
                    return;
                }

                const configName = config.name;
                const configExtension = config.extension;

                const folderElement = this._createFolderElement(configName, parentElement.dataset.path + "/" + configName);

                if (parentElement.classList.contains("rat-opened")) {
                    folderElement.classList.add("active");
                }

                for (const children of parentElement.children) {
                    if (children.classList.contains("folder") && folderElement.dataset.name == children.dataset.name) {
                        console.error("A folder with same name exists.");
                        return;
                    }
                }

                const folderElementNames = [];
                folderElementNames.push(folderElement.dataset.name);

                for (const children of parentElement.children) {
                    if (children.classList.contains("folder")) {
                        folderElementNames.push(children.dataset.name);
                        folderElementNames.sort();                        
                    }
                }

                const nextFolderElementName = folderElementNames[folderElementNames.indexOf(folderElement.dataset.name) + 1];

                if (nextFolderElementName != undefined) {
                    parentElement.querySelector(`[data-name="${nextFolderElementName}"].folder`)
                    .insertAdjacentElement("beforebegin", folderElement);
                    this.refresh();
                } else if (nextFolderElementName == undefined) {
                    const elms = [];
                    for (const children of parentElement.children) {
                        if (children.classList.contains("folder")) {
                            elms.push(children);
                        }
                    }

                    if (elms.length >= 1) {
                        elms[elms.length - 1].insertAdjacentElement("afterend", folderElement);
                    } else if (elms.length == 0) {
                        parentElement.querySelector("span.textElement").insertAdjacentElement("afterend", folderElement);
                    }
                    this.refresh();
                }

                if (cb != undefined && cb(
                    folderElement,
                    parentElement, 
                    {
                        referencePath,
                        computedReferencePath: this.rootPath + "/" + referencePath.replaceAll("\\", "/"), 
                        path: folderElement.dataset.path, 
                        fileName: folderElement.dataset.name
                    }) == "remove-element") {
                    folderElement.remove();
                }

                // console.log(parentElement)
            } catch (err) {
                console.log(err)
            }
        } else if (referencePathType == "folder") {
            const newPath = this.rootPath + "/" + referencePath;
            
            try {
                var folder = this.elm.querySelector(`[data-path="${newPath}"].folder`);

                if (folder == null || undefined) {
                    console.warn(`Reference path <${referencePath}> cannot find the element.`);
                    return;
                };

                if (!config.name) {
                    console.warn("A folder name or extension was not given. PLease specify it.");
                    return;
                }

                const configName = config.name;

                const folderElement = this._createFolderElement(configName, folder.dataset.path + "/" + configName);

                if (folder.classList.contains("rat-opened")) {
                    folderElement.classList.add("active");
                }

                for (const children of folder.children) {
                    if (children.classList.contains("folder") && folderElement.dataset.name == children.dataset.name) {
                        console.error("A folder with same name exists.");
                        return;
                    }
                }

                const folderElementNames = [];
                folderElementNames.push(folderElement.dataset.name);

                for (const children of folder.children) {
                    if (children.classList.contains("folder")) {
                        folderElementNames.push(children.dataset.name);
                        folderElementNames.sort();                        
                    }
                }

                const nextFolderElementName = folderElementNames[folderElementNames.indexOf(folderElement.dataset.name) + 1];

                if (nextFolderElementName != undefined) {
                    folder.querySelector(`[data-name="${nextFolderElementName}"].folder`)
                    .insertAdjacentElement("beforebegin", folderElement);
                    this.refresh();
                } else if (nextFolderElementName == undefined) {
                    const elms = [];
                    for (const children of folder.children) {
                        if (children.classList.contains("folder")) {
                            elms.push(children);
                        }
                    }

                    if (elms.length >= 1) {
                        elms[elms.length - 1].insertAdjacentElement("afterend", folderElement);
                    } else if (elms.length == 0) {
                        folder.querySelector("span.textElement").insertAdjacentElement("afterend", folderElement);
                    }
                    this.refresh();
                }

                if (cb != undefined && cb(
                    folderElement,
                    folder, 
                    {
                        referencePath,
                        computedReferencePath: this.rootPath + "/" + referencePath.replaceAll("\\", "/"), 
                        path: folderElement.dataset.path, 
                        folderName: folderElement.dataset.name
                    }) == "remove-element") {
                    folderElement.remove();
                }

                // console.log(parentElement)
            } catch (err) {
                console.log(err)
            }
        }
    }

    removeFile(path) {
        const newPath = this.rootPath + "/" + path;
        const fileElement = this.elm.querySelector(`[data-path="${newPath}"].file`);

        if (fileElement == null || undefined) {
            console.error(`Reference path <${newPath}> cannot find element.`);
            return;
        }

        const { parentElement } = fileElement;
        this.changeDialogMessage("to delete this file <" + fileElement.dataset.name + ">");
        this.removedFileElementStats = {};

        this.dialog().then(cb => {
            fileElement.remove();
            this.notify(`File removed <${fileElement.dataset.name}>`, 2000, "success");
            cb();
            this.changeDialogMessage();
            this.removedFileElementStats = {
                removedElement: fileElement,
                parentElement,
                path: fileElement.dataset.path
            };
        }).catch((cb) => {
            this.notify(`<${fileElement.dataset.name}> was not removed`, 2000);
            cb();
            this.removedFileElementStats = {};
        });

    }

    removeFolder(path) {
        const newPath = this.rootPath + "/" + path;
        const folderElement = this.elm.querySelector(`[data-path="${newPath}"].folder`);

        if (folderElement == null || undefined) {
            console.error(`Reference path <${newPath}> cannot find element.`);
            return;
        }

        const { parentElement } = folderElement;

        if (parentElement == null || undefined) {
            parentElement = "root";
        }

        this.changeDialogMessage("to delete this folder <" + folderElement.dataset.name + ">");
        this.removedFolderElementStats = {};

        this.dialog().then(cb => {
            folderElement.remove();
            cb();
            this.changeDialogMessage();
            this.removedFolderElementStats = {
                removedElement: folderElement,
                parentElement,
                path: folderElement.dataset.path
            };
        }).catch((cb) => {
            cb();
            this.removedFolderElementStats = {};
        });
    }

}

/*
const fileNames = [];
fileNames.push(name)
for (const children of file.parentElement.children) {
    if (children.classList.contains("file")) {
        fileNames.push(children.dataset.name);
        fileNames.sort();
    }
}

for (const children of file.parentElement.children) {
    if (children.classList.contains("file") && children.dataset.name == fileNames[fileNames.indexOf(name) - 1]) {
        children.insertAdjacentElement("afterend", fileElement);
        this.refresh();
        break;
    }
}
*/


/* if (path.children) {
            // container.classList.add("container");

            const folder = document.createElement("div");
            folder.dataset.name = path.name;
            folder.dataset.type = path.type;
            folder.classList.add("directory", "view-element");
            path.children.forEach(e => {
                if (e.type == "file") return;
                const child = document.createElement("div");
                child.dataset.name = e.name;
                child.dataset.type = e.type;
                child.classList.add("directory", "view-element")
                folder.appendChild(child)
                if (e.children) {
                    this.parsePaths(e, child);
                }
            })

            path.children.forEach(e => {
                if (e.type == "directory") return
                const [filename] = e.name.split(".");
                const extensionName = pathModule.extname(e.path);
                // console.log(extensionName, filename)

                const child = document.createElement("div");
                child.dataset.name = filename || null;
                child.dataset.type = e.type;
                child.dataset.extension = extensionName;
                child.classList.add("file", "view-element")
                elm.appendChild(child)
                // if (e.children) {
                    this.parsePaths(e, child);
                // }
            })

            elm.appendChild(folder)
        } */