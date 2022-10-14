/*
    Subnodal Cloud

    Copyright (C) Subnodal Technologies. All Rights Reserved.

    https://cloud.subnodal.com
    Licenced by the Subnodal Open-Source Licence, which can be found at LICENCE.md.
*/

namespace("com.subnodal.cloud.index", function(exports) {
    var subElements = require("com.subnodal.subelements");
    var elements = require("com.subnodal.subelements.elements");
    var l10n = require("com.subnodal.subelements.l10n");
    var shortcuts = require("com.subnodal.subui.shortcuts");
    var menus = require("com.subnodal.subui.menus");
    var views = require("com.subnodal.subui.views");
    var dialogs = require("com.subnodal.subui.dialogs");

    var cloud = require("com.subnodal.cloud");
    var resources = require("com.subnodal.cloud.resources");
    var profiles = require("com.subnodal.cloud.profiles");
    var config = require("com.subnodal.cloud.config");
    var fs = require("com.subnodal.cloud.fs");
    var urls = require("com.subnodal.cloud.urls");
    var associations = require("com.subnodal.cloud.associations");
    var thumbnails = require("com.subnodal.cloud.thumbnails");
    var search = require("com.subnodal.cloud.search");
    var folderViews = require("com.subnodal.cloud.folderviews");

    const LIVE_REFRESH_INTERVAL = 5 * 1_000; // 5 seconds
    const OPERATIONS_PROGRESS_INFO_UPDATE = 100; // 100 milliseconds
    const POST_UPLOAD_CLEANUP_DELAY = 5 * 1_000; // 5 seconds

    var firstLoad = true;
    var accounts = {};
    var rootObjectKey = null;
    var sharedObjectKeys = [];
    var rootFolderKey = null;
    var currentFolderKey = null;
    var currentPath = [];
    var forwardPath = [];
    var preSearchPath = [];
    var currentListing = [];
    var listingIsLoading = true;
    var listingIsSearchResults = false;
    var listingHasWritePermission = true;
    var dataUnavailableWhileOffline = false;
    var dataNotFound = false;
    var renameDuplicateIsFolder = false;
    var cleanUpDelayStarted = false;
    var moveCopyFolderView = null;
    var moveCopyIsCopy = false;

    window.index = exports;
    window.l10n = l10n;
    window.profiles = profiles;
    window.config = config;
    window.fs = fs;
    window.associations = associations;
    window.thumbnails = thumbnails;

    exports.getAccounts = function() {
        return accounts;
    };

    exports.getRootObjectKey = function() { // Our personal root object
        return rootObjectKey;
    };

    exports.getRootFolderKey = function() { // The current personal/shared root object
        return rootFolderKey;
    };

    exports.getCurrentPath = function() {
        return currentPath;
    };

    exports.getCurrentListing = function() {
        return currentListing;
    };

    exports.getListingIsLoading = function() {
        return listingIsLoading;
    };

    exports.getListingIsSearchResults = function() {
        return listingIsSearchResults;
    };

    exports.getListingHasWritePermission = function() {
        return listingHasWritePermission;
    };

    exports.getDataUnavailableWhileOffline = function() {
        return dataUnavailableWhileOffline;
    };

    exports.getDataNotFound = function() {
        return dataNotFound;
    };

    exports.getListingIsUnavailable = function() {
        return !exports.getListingIsLoading() && (exports.getDataUnavailableWhileOffline() || exports.getDataNotFound());
    };

    exports.getListingIsAvailable = function() {
        return !exports.getListingIsLoading() && !exports.getDataUnavailableWhileOffline() && !exports.getDataNotFound();
    };

    exports.getListingIsSharedLink = function() {
        return urls.getActionFromUrl() == "open" && urls.getItemsFromUrl().items[0] == rootObjectKey;
    };

    exports.getRenameDuplicateIsFolder = function() {
        return renameDuplicateIsFolder;
    };

    exports.getSearchQuery = function() {
        return document.querySelector("#mobileSearchInput").value.trim() || document.querySelector("#searchInput").value.trim();
    };

    exports.getMoveCopyFolderView = function() {
        return moveCopyFolderView;
    };

    exports.getMoveCopyIsCopy = function() {
        return moveCopyIsCopy;
    };

    exports.populateAccounts = function() {
        var tokens = profiles.listProfiles();

        Promise.all(tokens.map(function(token) {
            return resources.getProfileInfo(token);
        })).then(function(profilesData) {
            for (var i = 0; i < tokens.length; i++) {
                if (profilesData[i] == null) {
                    continue;
                }

                accounts[tokens[i]] = profilesData[i];
            }

            subElements.render();
        });
    };

    exports.renderPermissionEffects = function() {
        document.querySelectorAll(".writePermissionRequired").forEach((element) => element.disabled = !listingHasWritePermission);
        document.querySelectorAll(".parentalActionsRequired").forEach((element) => element.disabled ||= listingIsSearchResults);

        if (profiles.isGuestMode()) {
            document.querySelectorAll(".accountRequired, .writePermissionRequired").forEach((element) => element.hidden = true);
            document.querySelectorAll(".guestMode").forEach((element) => element.hidden = false);
        }
    };

    exports.attachListItemEvents = function(list) {
        var isFolderOpening = false;

        list.querySelectorAll("li").forEach(function(element) {
            views.attachListItemOpenEvent(element, function() {
                var item = exports.getItemFromCurrentListing(element.getAttribute("data-key"));
    
                if (item == null || isFolderOpening) {
                    return;
                }

                forwardPath = [];
    
                if (item.type == "folder") {
                    isFolderOpening = true;

                    exports.navigate(item.key).then(function() {
                        list.querySelector("li")?.focus();
                    });
    
                    return;
                }

                if (item.type == "file") {
                    var association = associations.findAssociationForFilename(item.name);

                    if (association == null) {
                        return;
                    }

                    window.open(association.getOpenUrlForItem(item));

                    return;
                }
            });
        });
    };

    exports.applyImageThumbnails = function(list, hardRefresh) {
        currentListing.forEach(function(item) {
            if (thumbnails.findImageThumbnailMimeType(item.name) != null) {
                if (item.size > thumbnails.IMAGE_THUMBNAIL_SIZE_LIMIT) {
                    return;
                }

                thumbnails.getImageThumbnail(item.key, !hardRefresh).then(function(url) {
                    if (url == null) {
                        return;
                    }

                    var element = [...list.querySelectorAll("li")].find((foundElement) => foundElement.getAttribute("data-key") == item.key);

                    if (!element) {
                        return;
                    }

                    var thumbnail = element.querySelector("img");

                    thumbnail.addEventListener("error", function() {
                        thumbnail.setAttribute("src", thumbnails.THUMBNAIL_GENERIC_IMAGE);

                        thumbnails.markImageThumbnailAsInvalid(item.key);
                    });

                    thumbnail.setAttribute("src", url);
                });
            }
        });
    };

    exports.renderFolderArea = function() {
        var folderArea = document.querySelector("#folderArea");
        var folderAreaScrollPosition = {top: folderArea.scrollTop, left: folderArea.scrollLeft};
        var folderAreaParent = folderArea.parentElement;
        var folderAreaIndex = Array.prototype.indexOf.call(folderAreaParent.children, folderArea);

        folderArea.remove();

        subElements.render(folderArea);

        folderAreaParent.insertBefore(folderArea, folderAreaParent.children[folderAreaIndex]);

        folderArea.scrollTop = folderAreaScrollPosition.top;
        folderArea.scrollLeft = folderAreaScrollPosition.left;

        subElements.render(document.querySelector("#folderBreadcrumbs"));

        document.querySelectorAll("#currentFolderView li").forEach(function(element) {
            var ignoreTouchDrag = false;

            element.addEventListener("touchstart", function() {
                ignoreTouchDrag = true;
            });

            element.addEventListener("touchend", function() {
                ignoreTouchDrag = false;
            });

            element.addEventListener("dragstart", function(event) {
                if (ignoreTouchDrag) {
                    event.preventDefault();

                    return;
                }

                event.dataTransfer.setData("text", urls.encodeItems([...new Set([
                    element.getAttribute("data-key"),
                    ...exports.getItemKeysFromCurrentSelection()
                ])]));
            })
        });
    };

    exports.populateCurrentFolder = function(key = currentFolderKey, hardRefresh = false, refreshInBackground = false) {
        if (key == null || key.startsWith(".")) {
            currentFolderKey = key;
            key = rootFolderKey;
        }

        views.deselectList(document.querySelector("#currentFolderView"));

        listingIsLoading = !refreshInBackground;
        listingIsSearchResults = false;

        if (currentPath[0]?.key != ".searchResults") {
            preSearchPath = currentPath;
        }

        exports.renderFolderArea();

        if (!navigator.onLine && !resources.getObjectCache().hasOwnProperty(key)) {
            listingIsLoading = false;
            dataUnavailableWhileOffline = true;

            exports.renderFolderArea();

            return Promise.reject("Data unavailable while offline");
        } else {
            dataUnavailableWhileOffline = false;
        }

        var folderObject;

        return fs.listFolder(
            key,
            config.getSetting("cloud_sortBy", "number", fs.sortByAttributes.NAME),
            config.getSetting("cloud_sortReverse", "boolean", false),
            config.getSetting("cloud_separateFolders", "boolean", true),
            hardRefresh
        ).then(function(listing) {
            listingIsLoading = false;

            if (listing == null) {
                dataNotFound = true;

                subElements.render();

                return Promise.reject("Data not found");
            }

            currentListing = listing;
            dataNotFound = false;

            return resources.getObject(key, true);
        }).then(function(object) {
            folderObject = object;

            if (!profiles.isGuestMode()) {
                return profiles.getUidFromToken();
            } else {
                return Promise.resolve(null);
            }
        }).then(function(uid) {
            listingHasWritePermission = false;

            if (uid != null) {
                listingHasWritePermission ||= folderObject.owner == uid;
                listingHasWritePermission ||= folderObject.permissions[uid] == "write";
            }

            exports.renderFolderArea();

            exports.attachListItemEvents(document.querySelector("#currentFolderView"));
            exports.applyImageThumbnails(document.querySelector("#currentFolderView"), hardRefresh);

            exports.renderPermissionEffects();

            return Promise.resolve(currentListing);
        });
    };

    exports.populateSearchResults = function(phrase) {
        views.deselectList(document.querySelector("#currentFolderView"));

        if (currentPath[0]?.key != ".searchResults") {
            preSearchPath = currentPath;
        }

        listingIsLoading = true;
        listingIsSearchResults = true;
        dataUnavailableWhileOffline = false;
        forwardPath = [];

        exports.renderFolderArea();

        var results;

        return search.searchForPhrase(phrase).then(function(resultsData) {
            results = resultsData;

            return Promise.all(results.map(function(result) {
                return resources.getObject(result.key);
            }));
        }).then(function(objects) {
            for (var i = 0; i < objects.length; i++) {
                objects[i] = {
                    ...objects[i],
                    key: results[i].key,
                    score: results[i].score
                };
            }

            objects = objects.filter((object) => !object.deleted);

            currentListing = objects;
            currentPath = [{
                key: ".searchResults",
                name: _("searchResults")
            }];
            listingIsLoading = false;
            dataNotFound = false;

            exports.renderFolderArea();

            exports.attachListItemEvents(document.querySelector("#currentFolderView"));
            exports.applyImageThumbnails(document.querySelector("#currentFolderView"));

            exports.renderPermissionEffects();

            return Promise.resolve(objects);
        });
    };

    exports.populateFolderView = function(hardRefresh = false) {
        if (listingIsSearchResults) {
            return exports.populateSearchResults(exports.getSearchQuery());
        }

        return exports.populateCurrentFolder(currentFolderKey, hardRefresh);
    };

    exports.renderTreeViewSubnodes = function(key, nodeElement, path, pathPosition, hardRefresh = false) {
        return fs.listFolder(
            key,
            config.getSetting("cloud_sortBy", "number", fs.sortByAttributes.NAME),
            config.getSetting("cloud_sortReverse", "boolean", false),
            config.getSetting("cloud_separateFolders", "boolean", true),
            hardRefresh
        ).then(function(listing) {
            nodeElement.innerHTML = "";

            (listing || []).forEach(function(item) {
                if (item.type != "folder") {
                    return;
                }

                var listItemElement = document.createElement("li");
                var expandableElement = document.createElement("details");
                var nameElement = document.createElement("summary");
                var childNodeElement = document.createElement("ul");

                nameElement.textContent = fs.getItemDisplayName(item);

                expandableElement.addEventListener("click", function(event) {
                    currentPath = [...path.slice(0, pathPosition + 1), item];
                    currentFolderKey = item.key;
                    rootFolderKey = currentPath[0].key;
                    forwardPath = [];

                    document.querySelector("#searchInput").value = "";
                    document.querySelector("#mobileSearchInput").value = "";

                    document.querySelectorAll("#folderTreeView li").forEach((element) => element.setAttribute("aria-selected", false));
                    listItemElement.setAttribute("aria-selected", true);

                    event.stopPropagation();

                    exports.populateCurrentFolder(item.key);

                    return exports.renderTreeViewSubnodes(item.key, childNodeElement, currentPath, pathPosition + 1, hardRefresh);
                });

                expandableElement.append(nameElement);
                expandableElement.append(childNodeElement);
                listItemElement.append(expandableElement);
                nodeElement.append(listItemElement);

                if (path[pathPosition + 1]?.key == item.key) {
                    document.querySelectorAll("#folderTreeView li").forEach((element) => element.setAttribute("aria-selected", false));
                    listItemElement.setAttribute("aria-selected", true);
                    expandableElement.setAttribute("open", "");

                    return exports.renderTreeViewSubnodes(item.key, childNodeElement, [...path, item], pathPosition + 1, hardRefresh);
                }
            });
        });
    }

    exports.populateFolderTreeView = function(path = currentPath, hardRefresh = false) {
        if (listingIsSearchResults) {
            return;
        }

        var rootElement = document.querySelector("#folderTreeView");

        var keys = [rootObjectKey, ...sharedObjectKeys];

        Promise.all(keys.map((key) => resources.getObject(key))).then(function(objects) {
            rootElement.innerHTML = "";
            
            document.querySelector("#rootFolderSwitcherMenu").innerHTML = "";

            objects.forEach(function(object, i) {
                var listItemElement = document.createElement("li");
                var expandableElement = document.createElement("details");
                var nameElement = document.createElement("summary");
                var childNodeElement = document.createElement("ul");

                function visitLocation() {
                    exports.navigate(keys[i], true, false);
                    exports.renderTreeViewSubnodes(keys[i], childNodeElement, path, 0, hardRefresh);
                }

                var name = (keys[i] == rootObjectKey && !index.getListingIsSharedLink() ? _("rootFolderName") : object.name) || _("unknownName");

                nameElement.textContent = name;

                expandableElement.append(nameElement);
                expandableElement.append(childNodeElement);
                listItemElement.append(expandableElement);
                rootElement.append(listItemElement);

                expandableElement.addEventListener("click", visitLocation);

                if (currentFolderKey == keys[i]) {
                    document.querySelector("#searchInput").value = "";
                    document.querySelector("#mobileSearchInput").value = "";

                    rootElement.querySelectorAll("li").forEach((element) => element.setAttribute("aria-selected", false));
                    listItemElement.setAttribute("aria-selected", true);
                }

                if (path[0].key == keys[i]) {
                    expandableElement.setAttribute("open", "");
                    exports.renderTreeViewSubnodes(path[0].key, childNodeElement, path, 0, hardRefresh);
                }

                var rootSwitcherMenuButton = document.createElement("button");
                var rootSwitcherMenuButtonIcon = document.createElement("sui-icon");
                var rootSwitcherMenuButtonText = document.createElement("span");

                rootSwitcherMenuButtonIcon.textContent = rootFolderKey == keys[i] ? "done" : "";
                rootSwitcherMenuButtonText.textContent = name;

                rootSwitcherMenuButtonIcon.setAttribute("aria-hidden", true);

                rootSwitcherMenuButton.append(rootSwitcherMenuButtonIcon);
                rootSwitcherMenuButton.append(document.createTextNode(" "));
                rootSwitcherMenuButton.append(rootSwitcherMenuButtonText);

                rootSwitcherMenuButton.addEventListener("click", visitLocation);

                document.querySelector("#rootFolderSwitcherMenu").append(rootSwitcherMenuButton);
            });

            mobileRootFolderSwitcherMenuButton.hidden = objects.length == 1;
        });
    };

    exports.exitSearch = function() {
        document.querySelector("#searchInput").value = "";
        document.querySelector("#mobileSearchInput").value = "";
        document.querySelector("#mobileSearch").hidden = true;
        document.querySelector("#mainNavigation").hidden = false;

        currentPath = preSearchPath;
        currentFolderKey = currentPath[currentPath.length - 1]?.key || rootFolderKey;
        preSearchPath = [];

        exports.populateFolderTreeView();

        return exports.populateCurrentFolder();
    };

    exports.navigate = function(key, replaceRoot = false) {
        if (replaceRoot) {
            currentPath = [];
        }

        if (key == ".searchResults") {
            return exports.populateSearchResults(exports.getSearchQuery());
        } else if (replaceRoot) {
            rootFolderKey = key;
        }

        currentFolderKey = key;

        return resources.getObject(key).then(function(data) {
            currentPath.push({...data, key});

            if (!listingIsSearchResults) {
                exports.populateFolderTreeView();
            }

            return exports.populateCurrentFolder(key);
        }).then(function() {
            return Promise.resolve();
        });
    };

    exports.goBack = function(toKey = currentPath[currentPath.length - 2]?.key) {
        if (exports.getListingIsSearchResults()) {
            return exports.exitSearch();
        }

        if (typeof(toKey) != "string") {
            return; // Tries to find ancestor of root
        }

        while (currentPath[currentPath.length - 1]?.key != toKey) {
            forwardPath.push(currentPath.pop());

            if (currentPath.length <= 1) {
                break;
            }
        }

        if (toKey == ".searchResults") {
            return exports.populateSearchResults(exports.getSearchQuery());
        }

        currentFolderKey = toKey;

        if (!listingIsSearchResults) {
            exports.populateFolderTreeView();
        }

        return exports.populateCurrentFolder(toKey);
    };

    exports.goForward = function() {
        if (forwardPath.length == 0) {
            return; // Cannot go forward any further
        }

        if (!listingIsSearchResults) {
            exports.populateFolderTreeView();
        }

        return exports.navigate(forwardPath.pop().key);
    };

    exports.getItemFromCurrentListing = function(key) {
        for (var i = 0; i < currentListing.length; i++) {
            if (currentListing[i].key == key) {
                return currentListing[i];
            }
        }

        return null;
    };

    exports.getCurrentSelection = function() {
        return views.getSelectedListItems(document.querySelector("#currentFolderView")).filter(function(item) {
            return item.getAttribute("data-rendered") == "true";
        });
    };

    exports.getItemKeysFromCurrentSelection = function() {
        return exports.getCurrentSelection().map(function(element) {
            return element.getAttribute("data-key");
        });
    };

    exports.getItemsFromCurrentSelection = function() {
        return exports.getItemKeysFromCurrentSelection().map(function(key) {
            return exports.getItemFromCurrentListing(key);
        });
    };

    exports.getInfoAboutCurrentSelection = function() {
        var selection = exports.getItemsFromCurrentSelection();
        var info = {
            count: selection.length,
            combination: null,
            names: [],
            displayName: null
        };

        selection.forEach(function(item) {
            info.containsFiles ||= item.type == "file";
            info.containsFolders ||= item.type == "folder";

            info.names.push(item.name);
        });

        info.displayName = info.count > 0 ? fs.getItemDisplayName(selection[0]) : null;

        if (info.containsFiles && info.count == 1) {
            info.combination = "file";
        } else if (info.containsFolders && info.count == 1) {
            info.combination = "folder";
        } else if (info.count == 1) {
            info.combination = "item";
        } else if (info.containsFiles && !info.containsFolders) {
            info.combination = "files";
        } else if (info.containsFolders && !info.containsFiles) {
            info.combination = "folders";
        } else {
            info.combination = "multiple";
        }

        return info;
    };

    exports.selectAll = function() {
        document.querySelectorAll("#currentFolderView li").forEach((element) => element.setAttribute("aria-selected", true));
    };

    exports.invertSelection = function() {
        document.querySelectorAll("#currentFolderView li").forEach(function(element) {
            if (element.hasAttribute("aria-selected")) {
                element.removeAttribute("aria-selected");
            } else {
                element.setAttribute("aria-selected", true);
            }
        });
    };

    exports.nameTaken = function(name, skipKey = null, extraNames = [], listing = currentListing) {
        if (extraNames.includes(name)) {
            return true;
        }

        for (var i = 0; i < listing.length; i++) {
            if (listing[i].key == skipKey) {
                continue;
            }

            if (listing[i].name == name) {
                return true;
            }
        }

        return false;
    };

    exports.findNextAvailableName = function(originalName, append = "", skipKey = null, extraNames = [], listing = currentListing) {
        var copyNumber = 1;
        var newName = originalName;

        if (!exports.nameTaken(originalName + append, skipKey, extraNames, listing)) {
            return originalName + append;
        }

        do {
            copyNumber++;
            newName = _("duplicateDocumentCopyMark", {name: originalName, number: copyNumber}) + append;
        } while (exports.nameTaken(newName, skipKey, extraNames, listing))

        return newName;
    };

    exports.checkItemHasWritePermission = function(key) {
        if (key == currentFolderKey) {
            return Promise.resolve(listingHasWritePermission);
        }

        return fs.getItemPermissions(key).then(function(permissions) {
            return Promise.resolve(permissions.write);
        });
    };

    exports.openPermissionDeniedDialog = function() {
        dialogs.open(document.querySelector(profiles.isGuestMode() ? "#guestSignInDialog" : "#permissionDeniedDialog"));
    };

    exports.renameItemByInput = function(input) {
        var key = input.closest("li").getAttribute("data-key");
        var appendExtension = "";

        if (input.value.trim() == "") {
            exports.populateFolderView(); // Revert the rename input

            return;
        }

        return resources.getObject(key).then(function(data) {
            if (data == null) {
                exports.populateFolderView(); // Item might have been deleted

                return;
            }

            var extensionMatch = (data?.name || "").match(fs.RE_FILE_EXTENSION_MATCH);

            if (extensionMatch && data?.type == "file") {
                appendExtension = extensionMatch[1]; // Add original extension back on if it was hidden
            }

            if (exports.nameTaken(input.value.trim() + appendExtension, key)) {
                renameDuplicateIsFolder = data?.type == "folder";

                dialogs.open(document.querySelector("#renameDuplicateDialog"));

                exports.populateFolderView(); // Revert the rename input

                return Promise.resolve();
            }

            return fs.renameItem(key, input.value.trim() + appendExtension, currentFolderKey).then(function() {
                if (data?.type == "folder") {
                    exports.populateFolderTreeView(currentPath, true);
                }

                currentListing.find((item) => item.key == key).name = input.value.trim() + appendExtension;

                return Promise.resolve();
            });
        });
    };

    exports.selectItemForRenaming = function(key) {
        document.querySelectorAll("#currentFolderView li").forEach(function(element) {
            if (element.getAttribute("data-key") != key) {
                return;
            }

            views.selectListItem(element, views.selectionModes.SINGLE);

            setTimeout(function() {
                element.querySelector("input").focus();
                element.querySelector("input").select();
            });
        });
    };

    exports.selectFirstItemForRenaming = function() {
        var selectedItem = exports.getCurrentSelection()[0];

        if (!(selectedItem instanceof Node)) {
            return;
        }

        exports.selectItemForRenaming(selectedItem.getAttribute("data-key"));
    };

    exports.createFileFromNewMenu = function(element) {
        var extension = element.getAttribute("data-extension");
        var association = associations.findAssociationForExtension(extension);
        var newFileKey;

        return fs.createFile(exports.findNextAvailableName(association.documentTypeName, "." + extension), currentFolderKey).then(function(key) {
            newFileKey = key;

            return exports.populateCurrentFolder(currentFolderKey, true);
        }).then(function() {
            exports.selectItemForRenaming(newFileKey);

            return Promise.resolve();
        });
    };

    exports.requestFileToUpload = function() {
        document.querySelector("#fileUpload").click();
    };

    exports.uploadChosenFiles = function(filesList = document.querySelector("#fileUpload").files, listing = currentListing) {
        var otherNames = [];
        var operations = [];
        var promiseChain = Promise.resolve();

        [...filesList].forEach(function(file) {
            var operation = fs.FileUploadOperation.createSpecificOperation(exports.findNextAvailableName(
                file.name.replace(fs.RE_FILE_EXTENSION_MATCH, ""),
                (file.name.match(fs.RE_FILE_EXTENSION_MATCH) || [])[1] || "",
                null,
                otherNames,
                listing
            ), currentFolderKey);

            fs.addToFileOperationsQueue(operation);
            operations.push(operation);

            operation.setFile(file, false).then(function() {
                promiseChain = promiseChain.then(function() {
                    subElements.render();

                    return operation.start();
                });
            });

            otherNames.push(operation.name);
        });

        promiseChain.then(function() {
            exports.populateCurrentFolder(currentFolderKey, true, true);
        });

        return operations;
    };

    exports.getItemToDownload = function(key, type) {
        var operation = null;

        if (type == "file") {
            operation = fs.FileDownloadOperation.createSpecificOperation(key);
        }

        if (type == "folder") {
            operation = new fs.FolderDownloadOperation(key);
        }

        if (operation == null) {
            return Promise.reject("Item has an unknown type");
        }

        fs.addToFileOperationsQueue(operation);

        return operation.start().then(function() {
            return Promise.resolve(operation);
        });
    };

    exports.downloadSelectedItems = function() {
        var selectedItems = exports.getCurrentSelection();

        if (selectedItems.length == 0) {
            return Promise.resolve();
        }

        if (selectedItems.length == 1) {
            return exports.getItemToDownload(
                selectedItems[0].getAttribute("data-key"),
                selectedItems[0].getAttribute("data-type")
            ).then(function(operation) {
                return operation.download();
            });
        }

        var promises = [];

        selectedItems.forEach(function(selectedItem) {
            promises.push(exports.getItemToDownload(
                selectedItem.getAttribute("data-key"),
                selectedItem.getAttribute("data-type")
            ));
        });

        var zip = new JSZip();

        Promise.all(promises).then(function(operations) {
            operations.forEach(function(operation) {
                operation.zip(zip);
            });

            return zip.generateAsync({type: "blob"}).then(function(blob) {
                var link = document.createElement("a");

                link.href = URL.createObjectURL(blob);
                link.download = operations[0].name.replace(fs.RE_FILE_EXTENSION_MATCH, "") + ".zip";

                link.click();
            });
        });
    };

    exports.openMoveCopyDialog = function(isCopy = false) {
        if (listingIsSearchResults) {
            return Promise.reject("Cannot perform parental actions on items in search results");
        }

        moveCopyIsCopy = isCopy;

        if (!listingIsSearchResults) {
            moveCopyFolderView.navigate(currentFolderKey, true);

            moveCopyFolderView.path = [...currentPath];
        } else {
            moveCopyFolderView.navigate(rootFolderKey, true);
        }

        moveCopyFolderView.render();
        dialogs.open(document.querySelector("#moveCopyDialog"));
    };

    exports.bulkMoveCopyItems = function(items, oldParentFolder, newParentFolder, copy = false) {
        if (oldParentFolder == newParentFolder && !copy) {
            return Promise.resolve();
        }

        if (newParentFolder == null) {
            return Promise.reject("No parent folder was chosen");
        }

        return exports.checkItemHasWritePermission(newParentFolder).then(function(result) {
            if (!result) {
                exports.openPermissionDeniedDialog();

                return;
            }

            return fs.listFolder(newParentFolder).then(function(parentFolderListing) {
                var otherNames = [];
                var promiseChain = Promise.resolve();

                items.forEach(function(item) {
                    var newName = exports.findNextAvailableName(
                        item.name.replace(fs.RE_FILE_EXTENSION_MATCH, ""),
                        (item.name.match(fs.RE_FILE_EXTENSION_MATCH) || [])[1] || "",
                        null,
                        otherNames,
                        parentFolderListing
                    );

                    if (copy) {
                        var operation = new fs.CopyOperation(item.key, newParentFolder, newName, profiles.getSelectedProfileToken());

                        operation.getObject(); // Find the size of the item to copy so we can display its progress
                        fs.addToFileOperationsQueue(operation);

                        promiseChain = promiseChain.then(function() {
                            return operation.start();
                        });
                    } else {
                        promiseChain = promiseChain.then(function() {
                            return fs.moveItem(item.key, oldParentFolder, newParentFolder, newName);
                        });
                    }
                });

                return promiseChain;
            });
        });
    }

    exports.performMoveCopy = function() {
        if (exports.getMoveCopyFolderView().currentFolderKey == null) {
            return Promise.resolve(); // Is root folder listing, so cannot move/copy there
        }

        dialogs.close(document.querySelector("#moveCopyDialog"));

        return exports.bulkMoveCopyItems(
            exports.getItemsFromCurrentSelection(),
            currentFolderKey,
            exports.getMoveCopyFolderView().currentFolderKey,
            moveCopyIsCopy
        ).then(function() {
            return exports.populateFolderView(true);
        });
    };

    exports.copySelectionToClipboard = function(cut = false) {
        if (listingIsSearchResults) {
            return Promise.reject("Cannot perform parental actions on items in search results");
        }

        return navigator.clipboard.writeText(urls.encodeItems(exports.getItemKeysFromCurrentSelection(), cut, currentFolderKey));
    };

    exports.pasteItemsFromClipboard = function() {
        var pasteData;

        if (listingIsSearchResults) {
            return Promise.reject("Cannot perform parental actions on items in search results");
        }

        return navigator.clipboard.readText().then(function(text) {
            if (!urls.isCloudUrl(text)) {
                return;
            }

            pasteData = urls.getItemsFromUrl(text);

            return Promise.all(pasteData.items.map((key) => resources.getObject(key)));
        }).then(function(items) {
            items.forEach(function(item, i) {
                item.key = pasteData.items[i];
            });

            if (pasteData.cut) {
                navigator.clipboard.writeText(urls.encodeItems(items.map((item) => item.key))); // Copy instead for subsequent pastes
            }

            return exports.bulkMoveCopyItems(items, pasteData.cutFrom, currentFolderKey, !pasteData.cut);
        }).then(function() {
            return exports.populateFolderView(true);
        });
    };

    exports.deleteSelection = function() {
        var promiseChain = Promise.resolve();

        dialogs.close(document.querySelector("#deleteConfirmationDialog"));

        if (listingIsSearchResults) {
            return Promise.reject("Cannot perform parental actions on items in search results");
        }

        exports.getItemKeysFromCurrentSelection().forEach(function(key) {
            promiseChain = promiseChain.then(function() {
                var operation = new fs.DeleteOperation(key, currentFolderKey);

                fs.addToFileOperationsQueue(operation);

                return operation.start();
            });
        });

        exports.getCurrentSelection().forEach(function(element) {
            element.remove(); // Remove this element so the user doesn't think it still persists after asking for deletion
        });

        return promiseChain.then(function() {
            exports.populateFolderTreeView(currentPath, true);
            // No need to re-render folder area since selection has already been removed from the view

            return Promise.resolve();
        });
    };

    exports.confirmDeletion = function() {
        subElements.render(document.querySelector("#deleteConfirmationDialog"));

        dialogs.open(document.querySelector("#deleteConfirmationDialog"));
    };

    exports.performLiveRefresh = function() {
        if (listingIsSearchResults) {
            return Promise.resolve(false); // Don't live refresh search results
        }

        if (!document.hasFocus()) {
            return Promise.resolve(false); // Minimise bandwidth used for other applications
        }

        if (exports.getListingIsLoading() || exports.getListingIsUnavailable()) {
            return Promise.resolve(false); // Don't interfere with any current loading events
        }

        if (dialogs.isOpen(document.querySelector("#moveCopyDialog"))) {
            return Promise.resolve(false); // Don't interfere with dialogs that contain file views
        }

        var inputFocused = false;

        document.querySelectorAll("#currentFolderView li input").forEach(function(input) {
            if (document.activeElement.isSameNode(input)) {
                inputFocused = true;
            }
        });

        if (inputFocused || document.activeElement.matches("#currentFolderView li")) {
            return Promise.resolve(false); // Don't interfere with focus
        }

        if (exports.getCurrentSelection().length > 0) {
            return Promise.resolve(false); // Don't interfere with user's selection
        }

        return exports.populateCurrentFolder(currentFolderKey, true, true).then(function() {
            return Promise.resolve(true);
        });
    };

    exports.reload = function() {
        rootObjectKey = null;
        sharedObjectKeys = [];

        config.init().then(function() {
            var folderTreeViewHandlePosition = config.getSetting("cloud_folderTreeViewHandlePosition", "number", null);

            if (folderTreeViewHandlePosition != null) {
                document.querySelector("#folderTreeViewPanel").style.width = `${folderTreeViewHandlePosition}px`;
            }
        });

        shortcuts.assignDefaultShortcut("item_cut", {code: "KeyX", primaryModifierKey: true});
        shortcuts.assignDefaultShortcut("item_copy", {code: "KeyC", primaryModifierKey: true});
        shortcuts.assignDefaultShortcut("item_paste", {code: "KeyV", primaryModifierKey: true});
        shortcuts.assignDefaultShortcut("item_delete", {code: "Delete"});
        shortcuts.assignDefaultShortcut("navigation_back", {code: "ArrowLeft", secondaryModifierKey: true});
        shortcuts.assignDefaultShortcut("navigation_forward", {code: "ArrowRight", secondaryModifierKey: true});
        shortcuts.assignDefaultShortcut("interface_focusSearch", {code: "Slash"});
        shortcuts.assignDefaultShortcut("interface_focusCurrentFolderView", {code: "F10"});

        shortcuts.setDisplayNameForAction("subUI_selectAll", _("shortcutDisplayName_subUI_selectAll"));
        shortcuts.setDisplayNameForAction("subUI_rename", _("shortcutDisplayName_subUI_rename"));
        shortcuts.setDisplayNameForAction("item_cut", _("shortcutDisplayName_item_cut"));
        shortcuts.setDisplayNameForAction("item_copy", _("shortcutDisplayName_item_copy"));
        shortcuts.setDisplayNameForAction("item_paste", _("shortcutDisplayName_item_paste"));
        shortcuts.setDisplayNameForAction("item_delete", _("shortcutDisplayName_item_delete"));
        shortcuts.setDisplayNameForAction("navigation_back", _("shortcutDisplayName_navigation_back"));
        shortcuts.setDisplayNameForAction("navigation_forward", _("shortcutDisplayName_navigation_forward"));
        shortcuts.setDisplayNameForAction("interface_focusSearch", _("shortcutDisplayName_interface_focusSearch"));
        shortcuts.setDisplayNameForAction("interface_focusCurrentFolderView", _("shortcutDisplayName_interface_focusCurrentFolderView"));

        if (!profiles.isGuestMode()) {
            exports.populateAccounts();
        }

        exports.renderPermissionEffects();

        fs.cancelAndClearFileOperationsQueue();

        associations.init().then(function() {
            subElements.render();

            if (urls.getActionFromUrl() == "open") {
                var itemKeys = urls.getItemsFromUrl().items;
    
                Promise.all(itemKeys.map((key) => resources.getObject(key))).then(function(items) {
                    items.forEach(function(item, i) {
                        item.key = itemKeys[i];
    
                        if (i == 0 && (item == null || item.type == "folder")) {
                            rootObjectKey = itemKeys[0];
                            currentFolderKey = itemKeys[0];
    
                            exports.navigate(currentFolderKey, true);
        
                            return;
                        }
    
                        if (item.type == "folder") {
                            window.open(urls.encodeItems([itemKeys[i]]));
        
                            return;
                        }
        
                        var association = associations.findAssociationForFilename(item.name);
    
                        if (association == null) {
                            return;
                        }
    
                        var openUrl = association.getOpenUrlForItem(item);
    
                        if (i == 0) {
                            window.location.replace(openUrl);
                        } else {
                            window.open(openUrl);
                        }
    
                        return;
                    });
                });
            } else {
                resources.syncOfflineUpdatedObjects().then(function() {
                    return fs.getRootObjectKeyFromProfile();
                }).then(function(key) {
                    if (key == null) {
                        return;
                    }
    
                    rootObjectKey = key;
                    currentFolderKey = key;
        
                    exports.navigate(currentFolderKey, true);
        
                    exports.populateCurrentFolder(); // Syncing may have caused a few files to change
    
                    return fs.getSharedObjectKeysFromProfile();
                }).then(function(keys) {
                    sharedObjectKeys = keys;
    
                    exports.populateFolderTreeView();
                });
            }
        });

        listingIsLoading = true;
        listingIsSearchResults = false;

        if (!firstLoad) {
            subElements.render();
        }

        firstLoad = false;
    };

    exports.setSettingAndRepopulate = function(setting, data) {
        config.setSetting(setting, data);

        exports.populateFolderView();
    };

    cloud.ready(function() {
        exports.reload();

        thumbnails.startThemeDetection(function() {
            exports.populateFolderView();
        });

        window.addEventListener("online", function() {
            resources.syncOfflineUpdatedObjects();
        });

        setInterval(function() {
            exports.performLiveRefresh().then(function(refreshed) {
                if (refreshed) {
                    console.log("Live refresh performed");
                } else {
                    console.log("Live refresh cancelled");
                }
            });
        }, LIVE_REFRESH_INTERVAL);

        setInterval(function() {
            subElements.render(document.querySelector("#progressInfo"));

            if (
                fs.getFileOperationsQueueProgress().bytesTotal > 0 &&
                fs.getFileOperationsQueueProgress().filesProgress == fs.getFileOperationsQueueProgress().filesTotal &&
                !cleanUpDelayStarted
            ) {
                cleanUpDelayStarted = true;

                setTimeout(function() {
                    fs.cleanUpFileOperationsQueue();

                    cleanUpDelayStarted = false;
                }, POST_UPLOAD_CLEANUP_DELAY);
            }
        }, OPERATIONS_PROGRESS_INFO_UPDATE);

        document.querySelector("#mobileMenuButton").addEventListener("click", function(event) {
            menus.toggleMenu(document.querySelector("#mobileMenu"), elements.findAncestor(event.target, "button"));
        });

        document.querySelector("#mobileRootFolderSwitcherMenuButton").addEventListener("click", function(event) {
            menus.toggleMenu(document.querySelector("#rootFolderSwitcherMenu"), elements.findAncestor(event.target, "button"));
        });

        document.querySelectorAll("#accountButton, #mobileAccountButton").forEach(function(element) {
            element.addEventListener("click", function(event) {
                menus.toggleMenu(document.querySelector("#accountsMenu"), event.target);
            });
        });

        document.querySelector("#addAccountButton").addEventListener("click", function() {
            window.location.href = profiles.ADD_PROFILE_REDIRECT_URL;
        });

        document.querySelectorAll(".signInButton").forEach(function(element) {
            element.addEventListener("click", function() {
                window.location.href = profiles.NO_PROFILES_REDIRECT_URL;
            });
        });

        document.querySelector("#backButton").addEventListener("click", function() {
            exports.goBack();
        });

        document.querySelector("#forwardButton").addEventListener("click", function() {
            exports.goForward();
        });

        document.querySelectorAll("#newButton, #mobileNewButton").forEach(function(element) {
            element.addEventListener("click", function(event) {
                menus.toggleMenu(document.querySelector("#newMenu"), elements.findAncestor(event.target, "button"), true);
            });
        });

        document.querySelector("#createFolderButton").addEventListener("click", function() {
            var newFolderKey;

            fs.createFolder(exports.findNextAvailableName(_("newFolderName")), currentFolderKey).then(function(key) {
                newFolderKey = key;
    
                return exports.populateCurrentFolder(currentFolderKey, true);
            }).then(function() {
                exports.selectItemForRenaming(newFolderKey);
                exports.populateFolderTreeView(currentPath, true);
            });
        });

        document.querySelector("#mobileSearchButton").addEventListener("click", function() {
            document.querySelector("#mainNavigation").hidden = true;
            document.querySelector("#mobileSearch").hidden = false;

            exports.populateSearchResults(""); // Produce blank area

            document.querySelector("#mobileSearchInput").focus();
        });

        document.querySelector("#mobileSearchBackButton").addEventListener("click", function() {
            if (listingIsSearchResults) {
                exports.exitSearch();
            } else {
                exports.goBack();
            }
        });

        document.querySelector("#searchInput").addEventListener("onsearch" in window ? "search" : "change", function() { // Firefox doesn't yet support `"search"` event
            if (exports.getSearchQuery() != "") {
                exports.populateSearchResults(exports.getSearchQuery());
            } else {
                exports.exitSearch();
            }
        });

        document.querySelector("#mobileSearchInput").addEventListener("onsearch" in window ? "search" : "change", function() { // Firefox doesn't yet support `"search"` event
            exports.populateSearchResults(exports.getSearchQuery());
        });

        document.querySelectorAll("#uploadButton, #mobileUploadButton").forEach(function(element) {
            element.addEventListener("click", function() {
                document.querySelector("#fileUpload").value = ""; // Clear first to allow for repeatedly uploading same file

                document.querySelector("#fileUpload").click();
            });
        });

        document.querySelector("#downloadButton").addEventListener("click", function() {
            exports.downloadSelectedItems();
        });

        document.querySelectorAll("#viewMenuButton, #mobileViewMenuButton").forEach(function(element) {
            element.addEventListener("click", function(event) {
                subElements.render(document.querySelector("#viewMenu"));

                menus.toggleMenu(document.querySelector("#viewMenu"), elements.findAncestor(event.target, "button"), true);
            });
        });

        document.querySelector("#viewOfflineRetryButton").addEventListener("click", function() {
            exports.populateFolderView(true);
        });

        elements.attachSelectorEvent("click", "#accountsMenuList button", function(element) {
            var token = element.getAttribute("data-token");

            if (!profiles.listProfiles().includes(token)) {
                return;
            }

            profiles.setSelectedProfileToken(token);

            setTimeout(function() {
                exports.reload();
            }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 500);
        });

        var handleWasDragged = false;

        ["mousedown", "touchstart"].forEach(function(eventType) {
            document.querySelector("#folderTreeViewHandle").addEventListener(eventType, function() {
                handleWasDragged = true;
            });
        });

        ["mouseup", "touchend"].forEach(function(eventType) {
            window.addEventListener(eventType, function() {
                if (!handleWasDragged) {
                    return;
                }

                config.setSetting("cloud_folderTreeViewHandlePosition", document.querySelector("#folderTreeViewPanel").clientWidth);

                handleWasDragged = false;
            });
        });

        elements.attachSelectorEvent("contextmenu", "#folderArea, #currentFolderView", function(element, event) {
            if (event.target != element && currentListing.length > 0 && !exports.getListingIsLoading() && !exports.getListingIsUnavailable()) {
                return;
            }
    
            menus.toggleContextMenu(document.querySelector("#viewContextMenu"), element);
        });

        elements.attachSelectorEvent("contextmenu", "#currentFolderView li", function(element) {
            if (element.getAttribute("aria-selected") != "true") {
                views.selectListItem(element, views.selectionModes.SINGLE);
            }

            menus.toggleContextMenu(document.querySelector("#itemContextMenu"), element);
        });

        elements.attachSelectorEvent("dragover", "#folderArea, #currentFolderView", function(element, event) {
            event.preventDefault();
        });

        elements.attachSelectorEvent("drop", "#currentFolderView li, #folderArea, #currentFolderView", function(element, event) {
            event.preventDefault();

            if (listingIsSearchResults) {
                return;
            }

            var dropTargetFolderKey = currentFolderKey;
            var dropInFolder = false;

            // Allow dropping items into folders without having to open those folders
            if (element.matches("#currentFolderView li") && exports.getItemFromCurrentListing(element.getAttribute("data-key"))?.type == "folder") {
                dropTargetFolderKey = element.getAttribute("data-key");
                dropInFolder = true;
            }

            if (event.dataTransfer.files.length > 0) {
                return exports.checkItemHasWritePermission(dropTargetFolderKey).then(function(result) {
                    if (!result) {
                        exports.openPermissionDeniedDialog();
    
                        return;
                    }

                    if (dropTargetFolderKey == currentFolderKey) {
                        return exports.uploadChosenFiles(event.dataTransfer.files);
                    } else {
                        return fs.listFolder(dropTargetFolderKey).then(function(listing) {
                            return exports.uploadChosenFiles(event.dataTransfer.files, listing);
                        });
                    }
                });
            }

            var dropText = event.dataTransfer.getData("text");

            if (!urls.isCloudUrl(dropText)) {
                return;
            }

            var dropData = urls.getItemsFromUrl(dropText);
            var items = [];

            return exports.checkItemHasWritePermission(dropTargetFolderKey).then(function(result) {
                if (!result) {
                    exports.openPermissionDeniedDialog();

                    return;
                }

                return Promise.all(dropData.items
                    .filter((key) => dropInFolder || currentListing.find((item) => item.key == key) == null) // Don't drop items into their source location
                    .map((key) => resources.getObject(key))
                );
            }).then(function(filteredItems) {
                items = filteredItems;

                if (dropTargetFolderKey == currentFolderKey) {
                    return Promise.resolve(currentListing);
                } else {
                    return fs.listFolder(dropTargetFolderKey);
                }
            }).then(function(listing) {
                var otherNames = [];

                items.forEach(function(item, i) {
                    item.key = dropData.items[i];

                    item.name = exports.findNextAvailableName(
                        item.name.replace(fs.RE_FILE_EXTENSION_MATCH, ""),
                        (item.name.match(fs.RE_FILE_EXTENSION_MATCH) || [])[1] || "",
                        null,
                        otherNames,
                        listing
                    );

                    otherNames.push(item.name);
                });

                return exports.bulkMoveCopyItems(items, null, dropTargetFolderKey, true);
            }).then(function() {
                // Don't render when items count is 0 — for example, when items are dropped into their source location and are therefore filtered out
                if (items.length == 0) {
                    return;
                }

                return exports.populateFolderView(true);
            });
        });

        window.addEventListener("keydown", function(event) {
            if (event.target.matches("input")) {
                return;
            }

            if (event.code == "Escape") {
                views.deselectList(document.querySelector("#currentFolderView"));

                return;
            }

            switch (shortcuts.getActionFromEvent(event)) {
                case "subUI_selectAll":
                    exports.selectAll();
                    break;

                case "navigation_back":
                    exports.goBack();
                    event.preventDefault();
                    break;

                case "navigation_forward":
                    exports.goForward();
                    event.preventDefault();
                    break;

                case "interface_focusSearch":
                    document.querySelector("#searchInput").focus();
                    event.preventDefault();
                    break;

                case "interface_focusCurrentFolderView":
                    if (document.querySelector("#currentFolderView li:first-child") instanceof Node) {
                        views.selectListItem(document.querySelector("#currentFolderView li:first-child"));
                    }

                    event.preventDefault();
                    break;
            }

            if (exports.getItemsFromCurrentSelection().length == 0) {
                return;
            }

            switch (shortcuts.getActionFromEvent(event)) {
                case "item_cut":
                    if (!listingHasWritePermission && !listingIsSearchResults) {
                        return;
                    }

                    exports.copySelectionToClipboard(true);
                    break;
    
                case "item_copy":
                    exports.copySelectionToClipboard();
                    break;
    
                case "item_paste":
                    if (!listingHasWritePermission && !listingIsSearchResults) {
                        return;
                    }

                    exports.pasteItemsFromClipboard();
                    break;
    
                case "item_delete":
                    if (!listingHasWritePermission && !listingIsSearchResults) {
                        return;
                    }

                    index.confirmDeletion();
                    break;
            }
        });

        document.querySelector("#fileUpload").addEventListener("change", function() {
            exports.uploadChosenFiles();
        });

        moveCopyFolderView = new folderViews.FolderView(
            document.querySelector("#moveCopyFolderView"),
            document.querySelector("#moveCopyDialog")
        );
    });
});