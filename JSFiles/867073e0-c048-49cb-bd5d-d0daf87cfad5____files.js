// grid with files


import Preview from './preview.js';

export default class Files {

    constructor(breadcrumbsObject, searchObject, navigationObject) {
        this.breadcrumbs = breadcrumbsObject;
        this.search = searchObject;
        this.navigation = navigationObject;
        this.wrapper = $('.home__content');
        this.files = $('.files');
        this.filesNameClass = 'files__name';
        this.filesPictureClass = 'files__picture';
        this.filesIconTextClass = 'files__icon--text';
        this.filesIconAudioClass = 'files__icon--audio';
        this.filesIconVideoClass = 'files__icon--video';
        this.filesIconFolderClass = 'files__icon--folder';
        this.filesLinkClass = 'files__link';
        this.filesLinkSelectedClass = 'files__link--selected';
        this.navigationLinkSelectedClass = 'navigation__link--selected';
        this.navigationLinkActiveClass = 'navigation__link--active';

        this.filesLargeClass = 'files--large';
        this.filesMediumClass = 'files--medium';
        this.filesSmallClass = 'files--small';

        this.dataLocationAttr = 'data-location';
        this.dataFullnameAttr = 'data-fullname';

        // by default, current view is medium for files
        // but it can be changed to large or small
        this.currentFilesView = this.filesMediumClass;

        this.types = {
            folder: {
                name: 'folder',
                type: 'File folder'
            },
            file: {
                name: 'file',
                type: 'Text Document (.txt)'
            },
            image: {
                name: 'image',
                types: {
                    jpg: 'JPEG image (.jpg)',
                    jpeg: 'JPEG image (.jpeg)',
                    png: 'PNG image (.png)'
                }
            },
            audio: {
                name: 'audio',
                type: 'MP3 Format Sound (.mp3)'
            },
            video: {
                name: 'video',
                type: 'MP4 Video (.mp4)'
            }
        }

        this.maxFileNameCharacters = 30;

        this.urlFormat = {
            whitespace: '%20',
            percentage: '%25'
        }

        // text fetched from server for clicked text file and set in HTML element
        this.textFromServer = 0;

        this.filePreview = new Preview();
        this.filePreview.files = this;

        this.properties = 0;
    }

    // add folders and files on page from cached folder object
    addToPage(folderCache) {
        this.removeFilesFromPage();

        // add class for current grid view for files
        this.files = $('<div>').addClass(`files ${this.currentFilesView}`);

        // add folders / files from cache
        this.addFoldersFiles(folderCache.folders);
        this.addFoldersFiles(folderCache.files);

        this.wrapper.append(this.files);
    }

    removeFilesFromPage() {
        this.files = $('.files');
        this.files.remove();
    }

    // add folders or files to the page
    addFoldersFiles(cachedFoldersFiles) {

        cachedFoldersFiles.forEach(function setFolders(value, index, array) {
            let box = this.createFolderFileHTML(this.getFolderFileCachedType(value), value);

            // add folder to the page
            this.files.append(box);
        }, this);

    }

    // create HTML for folder or file
    createFolderFileHTML(type, cachedElement) {
        var box = $('<div>').addClass('files__box');
        var link = $('<a>').addClass(this.filesLinkClass).attr('href', this.formatURL(cachedElement.info.path));
        var name = $('<div>').addClass(this.filesNameClass).text(this.formatName(cachedElement.name))
            .attr(this.dataFullnameAttr, cachedElement.name);
        var icon = this.createIconHTML(type, cachedElement);
        var isFolder = $(icon).hasClass('fa-folder');

        // if image is created, then add element when image is cut to overlay image with transparent background
        var imageCut;

        if (type === 'image') imageCut = $('<div>').addClass('files__image-cut');

        // add event listener for folders to emulate click on navigation links
        // send link for folder via function binding as additional argument
        if (isFolder) $(link).on('click', this.folderIsClicked.bind(this, link.attr('href'), name.text()));

        // or add event listener for files to open them
        else $(link).on('click', this.fileIsClicked.bind(this));

        box.append(link);

        if (imageCut) link.append(icon).append(imageCut).append(name);
        else link.append(icon).append(name);

        return box;
    }

    // format folder / file name
    // if it's too long, then set tree dots at the end of name, otherwise return given name
    formatName(name) {
        var numberOfCharacters = name.length;

        return (numberOfCharacters > this.maxFileNameCharacters) ?
            name.slice(0, this.maxFileNameCharacters) + '...' : name;
    }

    // format url
    // replace whitespaces with url whitespace sign (%20) and replace 
    // percentages % with url percentage sign (%25)
    formatURL(url) {
        var formatPercentages = url.replaceAll('%', this.urlFormat.percentage);
        var withoutSpaces = formatPercentages.replaceAll(' ', this.urlFormat.whitespace);

        return withoutSpaces;
    }

    // reverse url format, replace url percentages and url whitespaces with real percentages and whitespaces
    reverseURL(url) {
        var withSpaces = url.replaceAll(this.urlFormat.whitespace, ' ');
        var withPercentages = withSpaces.replaceAll(this.urlFormat.percentage, '%');

        return withPercentages;
    }

    // get pathname of URL without origin and protocol
    static getURLPathname(url) {
        var urlObject = new URL(url);

        return urlObject.pathname;
    }

    // remove file / folder extension and return them along with new name
    static removeFileFolderExtension(fileFolderName) {
        var newFileFolderName;
        var normalExtension = fileFolderName.slice(fileFolderName.length - 4, fileFolderName.length);
        var normalName = fileFolderName.slice(0, fileFolderName.length - 4);
        var normalExtensionArray = ['.txt', '.jpg', '.png', '.mp3', '.mp4'];
        var extendedExtension = fileFolderName.slice(fileFolderName.length - 5, fileFolderName.length);
        var extendedName = fileFolderName.slice(0, fileFolderName.length - 5);
        var extendedExtensionArray = ['.jpeg'];
        var foundExtension = '';

        for (let i = 0; i < normalExtensionArray.length; i++)
            if (normalExtensionArray[i] === normalExtension) {
                newFileFolderName = normalName;
                foundExtension = normalExtensionArray[i];
                break;
            }

        for (let i = 0; i < extendedExtensionArray.length; i++)
            if (extendedExtensionArray[i] === extendedExtension) {
                newFileFolderName = extendedName;
                foundExtension = extendedExtensionArray[i];
                break;
            }

        // if extension is not removed, return the same name
        if (!newFileFolderName) newFileFolderName = fileFolderName;

        return {
            name: newFileFolderName,
            extension: foundExtension
        }
    }

    // create different icon depending on type of file / folder
    createIconHTML(type, cachedElement) {
        var icon;

        switch (type) {
            case this.types.folder.name:
                icon = $('<i>').addClass(`fas fa-folder files__icon ${this.filesIconFolderClass}`);
                break;

            case this.types.file.name:
                icon = $('<i>').addClass(`fas fa-file-alt files__icon ${this.filesIconTextClass}`);
                break;

            // for image, create image element with picture and other info
            case this.types.image.name:
                let imageInfo = cachedElement.name.toLowerCase() + ' image';
                let imageInfoWithoutExtension = imageInfo.replaceAll('.jpg', '')
                    .replaceAll('.jpeg', '').replaceAll('.png', '');

                icon = $('<img>').addClass(this.filesPictureClass).attr('alt', imageInfoWithoutExtension)
                    .attr('src', this.formatURL(cachedElement.info.path));
                break;

            case this.types.audio.name:
                icon = $('<i>').addClass(`fas fa-file-audio files__icon ${this.filesIconAudioClass}`);
                break;

            case this.types.video.name:
                icon = $('<i>').addClass(`fas fa-file-video files__icon ${this.filesIconVideoClass}`);
                break;

            default: break;
        }

        // add location to the icon via custom data- attribute
        icon.attr(this.dataLocationAttr, cachedElement.info.location);

        return icon;
    }

    // get type of cached folder / file
    getFolderFileCachedType(cachedElement) {
        var type;

        switch (cachedElement.info.type) {
            case this.types.folder.type:
                type = this.types.folder.name;
                break;

            case this.types.file.type:
                type = this.types.file.name;
                break;

            case this.types.image.types.jpg:
            case this.types.image.types.jpeg:
            case this.types.image.types.png:
                type = this.types.image.name;
                break;

            case this.types.audio.type:
                type = this.types.audio.name;
                break;

            case this.types.video.type:
                type = this.types.video.name;
                break;

            default: break;
        }

        return type;
    }

    // when folder is clicked, search all navigation links to find folder link
    // it must be done because search results can search nested folders
    folderIsClicked(linkURL, linkName, event) {
        event.preventDefault();

        // get all navigation items from entire tree
        var listItems = $('.navigation__item');

        for (let i = 0; i < listItems.length; i++) {
            let folderLink = listItems[i].firstChild;
            let linkIsFound = folderLink.pathname === linkURL;
            let navigationText = $(listItems[i]).find('.navigation__text')[0].textContent;
            let nameIsFound = navigationText === linkName;

            // when link with clicked folder is found in navigation list, then fire click event
            // on navigation folder link to change folder structures, files, breadcrumbs
            // emulate click on navigation link
            if (linkIsFound && nameIsFound) {
                $(folderLink).click();
                break;
            }
        }
    }

    // function must be asynchronous because of ajax call for text element
    async fileIsClicked(event) {
        event.preventDefault();

        var link = event.currentTarget;
        var media = link.firstChild;
        var imageType = media.tagName === 'IMG';
        var textType = $(media).hasClass(this.filesIconTextClass);
        var audioType = $(media).hasClass(this.filesIconAudioClass);
        var videoType = $(media).hasClass(this.filesIconVideoClass);
        var mediaElement;

        // look what kind of media is clicked (image, text, audio, video)
        if (imageType) mediaElement = this.createFilePreviewImage(media);
        else if (audioType) mediaElement = this.createFilePreviewAudio(link);
        else if (videoType) mediaElement = this.createFilePreviewVideo(link);

        // for text, wait for ajax request to finish before continue
        else if (textType) {
            await this.createFilePreviewText(link);
            mediaElement = this.textFromServer;
        }

        // now media element is ready, preview them on the screen
        this.filePreview.show(mediaElement);
    }

    createFilePreviewImage(media) {
        var imageSource = Files.getURLPathname(media.src);
        var imageInfo = media.alt;
        var image = $('<img>').addClass('preview__picture').attr('src', imageSource).attr('alt', imageInfo);
        var mediaObj = $(media);
        var imageLocation = mediaObj.attr(this.dataLocationAttr);
        var imageName = mediaObj.parent().find(`.${this.filesNameClass}`).attr(this.dataFullnameAttr);

        // add location / name to the image via custom data- attribute
        image.attr(this.dataLocationAttr, imageLocation);
        image.attr(this.dataFullnameAttr, imageName);

        return image;
    }

    createFilePreviewText(link) {
        // do ajax request to get text from server and return promise, 
        // because await is used for waiting for promise to resolve
        return $.ajax({
            url: link.href,
            method: 'GET'
        })
            .done(this.textIsFetched.bind(this, link));
    }

    textIsFetched(link, serverText) {
        var text = $('<div>').addClass('preview__text');
        text.text(serverText);

        // set html data- attribute for text file name because that's how it's 
        // identified in current folder
        var filesName = $(link).find(`.${this.filesNameClass}`);
        text.attr('data-name', filesName.text());

        // save fullname of file in dom
        var filesFullName = filesName.attr(this.dataFullnameAttr);
        text.attr(this.dataFullnameAttr, filesFullName);

        var filesIcon = $(link).find(`.${this.filesIconTextClass}`);
        var filesIconLocation = filesIcon.attr(this.dataLocationAttr);

        // add location to the text via custom data- attribute
        text.attr(this.dataLocationAttr, filesIconLocation);

        // save text element
        this.textFromServer = text;
    }

    createFilePreviewAudio(link) {
        var audioSource = Files.getURLPathname(link.href);
        var audio = $('<audio>').addClass('preview__audio').attr('controls', true).attr('autoplay', true);
        var source = $('<source>').attr('src', audioSource).attr('type', 'audio/mpeg');
        var audioIcon = link.firstChild;
        var sourceLocation = $(audioIcon).attr(this.dataLocationAttr);
        var sourceName = $(link).find(`.${this.filesNameClass}`).attr(this.dataFullnameAttr);

        // add location / name to the audio via custom data- attribute
        source.attr(this.dataLocationAttr, sourceLocation);
        source.attr(this.dataFullnameAttr, sourceName);

        audio.append(source);

        return audio;
    }

    createFilePreviewVideo(link) {
        var videoSource = Files.getURLPathname(link.href);
        var video = $('<video>').addClass('preview__video').attr('controls', true).attr('autoplay', true);
        var source = $('<source>').attr('src', videoSource).attr('type', 'video/mp4');
        var videoIcon = link.firstChild;
        var sourceLocation = $(videoIcon).attr(this.dataLocationAttr);
        var sourceName = $(link).find(`.${this.filesNameClass}`).attr(this.dataFullnameAttr);

        // add location to the video via custom data- attribute
        source.attr(this.dataLocationAttr, sourceLocation);
        source.attr(this.dataFullnameAttr, sourceName);

        video.append(source);

        return video;
    }

    // get previous or next file link from DOM
    getPreviousNextFileLink(fileType, fileInfo, fileLocation, fileFullname, previousNext) {
        var isImage = fileType === this.types.image;
        var isText = fileType === this.types.file;
        var isAudio = fileType === this.types.audio;
        var isVideo = fileType === this.types.video;
        var filesBoxes = this.getFilesFromDOM();
        var previousFileLink = previousNext === 0;
        var nextFileLink = previousNext === 1;
        var fileLink;

        if (isImage)
            fileLink = this.getPreviousNextFileLinkMedia(fileInfo, fileLocation, fileFullname, 
                filesBoxes, previousFileLink, nextFileLink, this.filesPictureClass);
        else if (isText)
            fileLink = this.getPreviousNextFileLinkMedia(fileInfo, fileLocation, fileFullname,
                filesBoxes, previousFileLink, nextFileLink, this.filesIconTextClass);
        else if (isAudio)
            fileLink = this.getPreviousNextFileLinkMedia(fileInfo, fileLocation, fileFullname,
                filesBoxes, previousFileLink, nextFileLink, this.filesIconAudioClass);
        else if (isVideo)
            fileLink = this.getPreviousNextFileLinkMedia(fileInfo, fileLocation, fileFullname,
                filesBoxes, previousFileLink, nextFileLink, this.filesIconVideoClass);

        return fileLink;
    }

    // just get files from DOM, ignore folders
    getFilesFromDOM() {
        this.files = $('.files');

        var filesFolders = this.files[0].children;
        var files = [];

        for (let i = 0; i < filesFolders.length; i++) {
            let folder = $(filesFolders[i]).find(`.${this.filesIconFolderClass}`);
            let isFolder = folder.length;

            // push just files into files array, if it's folder don't do anything
            if (!isFolder) files.push(filesFolders[i]);
        }

        return files;
    }

    getPreviousNextFileLinkMedia(fileInfo, fileLocation, fileFullname, filesBoxes, previousFileLink, nextFileLink, mediaClass) {

        for (var i = 0; i < filesBoxes.length; i++) {
            let boxes = $(filesBoxes[i]);
            let media = boxes.find(`.${mediaClass}`);
            let mediaFullname = boxes.find(`.${this.filesNameClass}`).attr('data-fullname');

            if (media) {
                let mediaPath;
                let mediaLocation = media.attr(this.dataLocationAttr);
                let isText = mediaClass === this.filesIconTextClass;
                let isImage = mediaClass === this.filesPictureClass;

                // set media path for different type of media
                if (isText) mediaPath = media.next().text();
                else if (isImage) mediaPath = media.attr('src');
                else mediaPath = media.parent().attr('href');

                let sameFilePath = mediaPath === fileInfo;
                let sameFileLocation = mediaLocation === fileLocation;
                let sameFullname = mediaFullname === fileFullname;

                // media is found in DOM only if location, path and fullname are the same
                if (sameFilePath && sameFileLocation && sameFullname) break;
            }
        }

        // return file link
        return this.getFileLink(previousFileLink, nextFileLink, i, filesBoxes);
    }

    getFileLink(previousFileLink, nextFileLink, i, filesBoxes) {

        // get file index of previous or next file
        // for previous file, if it's first file, then return last file, otherwise just decrement index
        // for next file, if it's last file, then return first file, otherwise just increment index
        var fileIndex;

        if (previousFileLink)
            fileIndex = i === 0 ? filesBoxes.length - 1 : i - 1;
        else if (nextFileLink)
            fileIndex = i === filesBoxes.length - 1 ? 0 : i + 1;

        var file = filesBoxes[fileIndex];

        // return file link
        return file.firstChild;
    }

    // change view for files in round
    changeFilesGridView() {
        this.files.removeClass(this.currentFilesView);

        switch (this.currentFilesView) {
            case this.filesLargeClass:
                this.files.addClass(this.filesMediumClass);
                this.currentFilesView = this.filesMediumClass;
                break;

            case this.filesMediumClass:
                this.files.addClass(this.filesSmallClass);
                this.currentFilesView = this.filesSmallClass;
                break;

            case this.filesSmallClass:
                this.files.addClass(this.filesLargeClass);
                this.currentFilesView = this.filesLargeClass;
                break;

            default: break;
        }
    }

    sortFolder(ascendingDescending) {
        var filesAndFolders = this.getFoldersFiles();
        var allFolders = filesAndFolders.folders;
        var allFiles = filesAndFolders.files;

        this.sortFilesFolders(allFolders, ascendingDescending);
        this.sortFilesFolders(allFiles, ascendingDescending);

        // remove files / folders from page
        this.files.empty();

        // add event listeners after sorting, because they are lost
        this.addEventListenersFilesFolders(allFolders, true);
        this.addEventListenersFilesFolders(allFiles);

        this.addSortedFilesFoldersToPage(allFolders, allFiles);
    }

    getFoldersFiles() {
        this.files = $('.files');

        var foldersArray = [];
        var filesArray = [];
        var filesFolders = this.files[0].children;

        // separate folders and files in two arrays
        for (let i = 0; i < filesFolders.length; i++) {
            let isFolder = $(filesFolders[i]).find(`.${this.filesIconFolderClass}`);

            if (isFolder.length) foldersArray.push(filesFolders[i]);
            else filesArray.push(filesFolders[i]);
        }

        return {
            folders: foldersArray,
            files: filesArray
        }
    }

    // sort files or folders in ascending or descending order
    sortFilesFolders(filesFolders, ascendingDescending) {

        for (let i = 0; i < filesFolders.length - 1; i++)
            for (let j = i + 1; j < filesFolders.length; j++) {
                // compare uppercase case letters, because if uppercase and lowercase letters
                // are mixed, then results are not correct
                let firstName = $(filesFolders[i]).find(`.${this.filesNameClass}`).text().toUpperCase();
                let secondName = $(filesFolders[j]).find(`.${this.filesNameClass}`).text().toUpperCase();

                let sortAscending = (firstName > secondName) && ascendingDescending;
                let sortDescending = (firstName < secondName) && !ascendingDescending;

                // if it's ascending or descending order, then swap elements
                if (sortAscending || sortDescending) this.swrapArrayElements(filesFolders, i, j);
            }
    }

    swrapArrayElements(array, i, j) {
        var temp = array[i];

        array[i] = array[j];
        array[j] = temp;
    }

    addEventListenersFilesFolders(filesFolders, isFolder = false) {

        filesFolders.forEach(function addFolders(value, index, array) {
            let valueObj = $(value);
            let link = valueObj.find(`.${this.filesLinkClass}`);
            let name = valueObj.find(`.${this.filesNameClass}`)[0].textContent;

            // add folder event listener
            if (isFolder)
                $(link).on('click', this.folderIsClicked.bind(this, link.attr('href'), name));

            // add file event listener
            else
                $(link).on('click', this.fileIsClicked.bind(this));
        }, this);
    }

    addSortedFilesFoldersToPage(allFolders, allFiles) {
        // add sorted folders to the page
        allFolders.forEach(function addFolders(value, index, array) {
            this.files.append(value);
        }, this);

        // add sorted files to the page
        allFiles.forEach(function addFolders(value, index, array) {
            this.files.append(value);
        }, this);
    }

    // when file or folder is renamed, update them on page
    updateFilesName(oldFileFolderName, newFileFolderName) {
        var filesNames = this.files.find(`.${this.filesNameClass}`);

        // search for files names on page and update correct one
        // also update data custom attribute
        for (let i = 0; i < filesNames.length; i++)
            if ($(filesNames[i]).attr(this.dataFullnameAttr) === oldFileFolderName) {
                let formattedName = this.formatName(newFileFolderName);

                // add for too long names formatted name with three dots, 
                // but keep full name on custom data attribute
                $(filesNames[i]).text(formattedName);
                $(filesNames[i]).attr(this.dataFullnameAttr, newFileFolderName);
                break;
            }
    }

    // when folder is renamed, update locations for current opened folder on page
    // because some folder name can be changed from navigation while child folder is still opened
    // and in that situation files / folders locations for current opened folder on page 
    // will not be changed
    updateOpenedFolderLocations(fileFolderCached, oldFileFolderName, newFileFolderName) {
        var searchResultsOnPage = $('.matches__text').length;
        var filesLinks = this.files.find(`.${this.filesLinkClass}`);

        if (searchResultsOnPage)
            this.updateSearchResultsLocations(fileFolderCached, oldFileFolderName, newFileFolderName, filesLinks);
        else {
            // update locations on page in current folder for files / folders
            for (let i = 0; i < filesLinks.length; i++) {
                let filesMedia = filesLinks[i].firstChild;
                let openedFolderPath = this.breadcrumbs.getCurrentPath();

                $(filesMedia).attr(this.dataLocationAttr, openedFolderPath);
            }
        }
    }

    // when some folder is renamed in search results, then every file or folder on page
    // that's child of renamed folder must change their location
    updateSearchResultsLocations(fileFolderCached, oldFileFolderName, newFileFolderName, filesLinks) {
        var isFolder = fileFolderCached.filesFolders.info.type === 'File folder';

        if (!isFolder) return;

        var newFolderLocation = fileFolderCached.filesFolders.info.location + newFileFolderName + '/';
        var oldFolderLocation = fileFolderCached.filesFolders.info.location + oldFileFolderName + '/';
        var filesIcon, currentLocation, replaceLocation, newLocation;

        for (let i = 0; i < filesLinks.length; i++) {
            filesIcon = filesLinks[i].firstChild;
            currentLocation = $(filesIcon).attr(this.dataLocationAttr);
            replaceLocation = currentLocation.includes(oldFolderLocation);

            // if location on page for search results is found, then that file or folder is 
            // inside folder which name is changed and that location path should be changed
            // with new location path
            // form new location path by appending on old location remaining parts of current location
            // if it's not the same as new location
            if (replaceLocation) {
                newLocation = newFolderLocation + currentLocation.slice(oldFolderLocation.length);
                $(filesIcon).attr(this.dataLocationAttr, newLocation);
            }
        }
    }

    // remove file or folder from current opened folder, or from search results
    removeFileFolderFromPage(fileFolderCached) {
        var fileFolderName = fileFolderCached.filesFolders.name;
        var names = this.files.find(`.${this.filesNameClass}`);
        var fullname, box, namesPage;
        var isFolder = fileFolderCached.filesFolders.info.type === 'File folder';
        var folderLocation = fileFolderCached.filesFolders.info.location + fileFolderCached.filesFolders.name + '/';
        var searchResultsOnPage = $('.matches__text').length;

        // update search results after deletion, results can change if file / folder was on search list
        // even if removed folder is not on search results list, after deletion search results can change
        // because there are maybe some of their children on page
        // also remove deleted file or folder from saved results before searching
        if (searchResultsOnPage) this.search.updateSearchResults(fileFolderCached.filesFolders);

        for (let i = 0; i < names.length; i++) {
            namesPage = $(names[i]);
            fullname = namesPage.attr(this.dataFullnameAttr);

            // file / folder found on page, get box and remove them from page
            if (fileFolderName === fullname) {
                box = namesPage.parent().parent();
                box.remove();

                // remove files / folders from search results if they are descendant of removed folder
                if (isFolder && searchResultsOnPage) 
                    this.removeFilesFoldersFromSearch(folderLocation);

                return;
            }
        }

        // file / folder is not found on page, try to remove current folder content if
        // removed folder is parent of current folder
        this.tryRemoveCurrentFolderContent(fileFolderCached);
    }

    // if folder is removed from page via navigation and it's not found on page,
    // then it can be another folder or it can be parent folder
    // if it's parent folder, then current folder content on page must be 
    // removed from page because his content doesn't exist anymore
    tryRemoveCurrentFolderContent(fileFolderCached) {
        var currentFolderLocation = this.breadcrumbs.getCurrentPath();
        var removedFolderLocation = fileFolderCached.filesFolders.info.location + fileFolderCached.filesFolders.name + '/';
        var removeFolderIsParent = Files.stringBeginsWith(currentFolderLocation, removedFolderLocation);

        // restore homepage if deleted folder is parent of current folder on page
        if (removeFolderIsParent) $('.breadcrumbs__main').click();
    }

    // does original string begins with search string
    // original string contains search string, but from the begining of original string
    static stringBeginsWith(originalString, searchString) {
        var searchStringLen = searchString.length;
        var originalStringLen = originalString.length;

        if (originalStringLen < searchStringLen) return false;

        var originalStringSub = originalString.slice(0, searchStringLen);

        // if search string is contained within original string from the beginning of 
        // original string then return true, otherwise return false
        return originalStringSub === searchString ? true : false;
    }

    // when some folder is deleted in search results, then remove all other files or folders
    // which are children (direct or not) from deleted folder
    removeFilesFoldersFromSearch(folderLocation) {
        var names = this.files.find(`.${this.filesNameClass}`);
        var icon, location, fileFolderIsChildren, box;

        for (let i = 0; i < names.length; i++) {
            icon = $(names[i]).parent()[0].firstChild;
            location = $(icon).attr(this.dataLocationAttr);
            fileFolderIsChildren = Files.stringBeginsWith(location, folderLocation);

            // descendant is found, remove them from search results
            if (fileFolderIsChildren) {
                box = $(names[i]).parent().parent();
                box.remove();
            }
        }
    }

    copyFileFolder(clipboard, newFileFolder) {
        var pathSource, pathDestination, name;
        var isHomepage = false;

        // set path and name from navigation if navigation folder is copied / cut
        if (!clipboard.selectedFileFolder.location)
            pathSource = this.reverseURL(clipboard.selectedFileFolder.selected.attr('href'));

        // set path and name from navigation folder for paste folder destination
        if (!clipboard.pasteFolder.location) {
            if (clipboard.pasteFolder.selected) 
                pathDestination = this.reverseURL(clipboard.pasteFolder.selected.attr('href'));

            // then it's paste inside current opened folder
            else {
                let currentPath = this.breadcrumbs.getCurrentPath();
                pathDestination = this.breadcrumbs.currentCachedFolder.info.path;

                if (currentPath === '/home/') isHomepage = true;
            }
        }

        var infoSource = newFileFolder ? newFileFolder :
                         this.navigation.getFileFolderInfoRecursive(this.breadcrumbs.serverData.home, 
                                                                    clipboard.selectedFileFolder.location, pathSource, 
                                                                    clipboard.selectedFileFolder.name);

        var infoDestination = isHomepage ? 
                              this.navigation.getHomepageFolderInfo(pathDestination, clipboard.pasteFolder.name) :
                              this.navigation.getFileFolderInfoRecursive(this.breadcrumbs.serverData.home, 
                                                                         clipboard.pasteFolder.location, pathDestination, 
                                                                         clipboard.pasteFolder.name);

        // if destination folder is subfolder of source folder, then it cannot be copied
        // some folder cannot be copied inside yourself or inside own subfolder
        if (this.destinationSubfolderSource(infoDestination.filesFolders, infoSource.filesFolders) && !newFileFolder) {
            this.properties.printDestinationError();
            return;
        }

        // if it's cut, then delete file / folder before paste another one
        if (clipboard.cut) this.cutFileFolder(infoSource);

        var fileFolderCopy = this.copyFileFolderToDestination(clipboard, infoSource, infoDestination);

        // increment number of files / folders for parent folders after copying
        // also update parent folders size in bytes
        this.incrementSizeNumberOfFilesFoldersAfterCopy(infoSource, infoDestination);

        // if copy location is the current opened folder, then refresh current page with files and folders
        // also refresh search results if they exists on page
        this.refreshCurrentPageAfterCopy();
        this.refreshSearchResultsAfterCopy();

        // if folder is copied or cut, then add them to navigation
        this.navigation.createFolder(infoSource, infoDestination, fileFolderCopy);
    }

    incrementSizeNumberOfFilesFoldersAfterCopy(infoSource, infoDestination) {
        this.properties.fileFolderCached = infoSource;
        this.properties.updateSizeParentFolders(false, infoDestination);
        this.properties.fileFolderCached = 0;
    }

    // when file or folder is copied / cut inside current folder, then refresh current folder
    // with files and folders by clicking twice on navigation link for current folder
    // if it's not the current folder, then do nothing
    refreshCurrentPageAfterCopy() {
        var currentFolderPath = `/home/${(this.breadcrumbs.currentCachedFolder.info.path).slice(30)}`;
        var activeNavigationLink = $(`.${this.navigationLinkActiveClass}`);
        var activeSelectedLinkPath = '';
        var filesLinkSelected = $(`.${this.filesLinkSelectedClass}`);
        var navigationLinkSelected = $(`.${this.navigationLinkSelectedClass}`);

        // it's selected file or folder from home content
        if (filesLinkSelected.length)
            activeSelectedLinkPath = this.getActiveSelectedLinkPath(filesLinkSelected);

        // it's selected folder from navigation
        else if (navigationLinkSelected.length)
            activeSelectedLinkPath = this.getActiveSelectedLinkPath(navigationLinkSelected);

        // it's active folder from navigation
        else if (activeNavigationLink.length)
            activeSelectedLinkPath = this.getActiveSelectedLinkPath(activeNavigationLink);
        
        // insert home folder string at the beginning of navigation link path
        activeSelectedLinkPath = `/home/${activeSelectedLinkPath}`;

        // if it's current folder, then refresh page by clickin twice on navigation link
        // create event object with current target for navigation link and call event handler
        if (currentFolderPath === activeSelectedLinkPath) {
            let eventObject = {
                currentTarget: activeNavigationLink[0],
                preventDefault: function preventDefault() {}
            }

            // empty breadcrumbs and restore homepage if home is current folder for copy / cut
            if (currentFolderPath === '/home/') this.breadcrumbs.emptyBreadcrumbs(eventObject);
            else {
                this.navigation.folderIsClicked(eventObject, true);
                this.navigation.folderIsClicked(eventObject, true);
            }
        }
    }

    refreshSearchResultsAfterCopy() {
        var searchResultsOnPage = $('.matches__text').length;

        // if there are search results, then search again with the same string to
        // refresh search results after copy file / folder
        if (searchResultsOnPage) this.search.textBoxTyping();
    }

    getActiveSelectedLinkPath(activeSelectedLink) {
        var rootURLLength = '/js_repo/primeri/primer6/html/'.length;
        var activeSelectedLinkPath;
        var activeSelectedLinkURL = activeSelectedLink.attr('href');

        activeSelectedLinkURL = this.reverseURL(activeSelectedLinkURL);
        activeSelectedLinkPath = activeSelectedLinkURL.slice(rootURLLength);

        return activeSelectedLinkPath;
    }

    copyFileFolderToDestination(clipboard, infoSource, infoDestination) {
        var isFolder = infoSource.filesFolders.info.type === 'File folder';

        // copy source before moving to the destination because cached reference is used
        // and if it's modified then it will alter original source files or folders
        // convert javascript object to string and then parse string as 
        // javascript object and new fresh copy is made
        var fileFolderCopyString = JSON.stringify(infoSource.filesFolders);
        var fileFolderCopy = JSON.parse(fileFolderCopyString);

        // copy destination for first file / folder
        var destinationLocation = `${infoDestination.filesFolders.info.location}${infoDestination.filesFolders.name}/`;
        fileFolderCopy.info.location = destinationLocation;

        // if file or folder with the same name exists, then append next free number at the end of the new name
        this.copyFileFolderNameAlreadyExists(fileFolderCopy, infoDestination);

        // update folder link path if folder is copied / cut
        // update first root folder
        if (isFolder) this.updateDestinationFolderPath(fileFolderCopy);

        this.updateDestinationFilesFoldersLocation(fileFolderCopy, destinationLocation, isFolder, clipboard.cut);

        // copy as folder
        if (isFolder) infoDestination.filesFolders.folders.push(fileFolderCopy);

        // copy as file
        else infoDestination.filesFolders.files.push(fileFolderCopy);

        // return copied file / folder
        return fileFolderCopy;
    }

    // when some file or folder is copied or cut, then it must be done
    // but the name or new file or folder can already exist in current folder
    // if the name already exists, then append first free number at the end of the name
    copyFileFolderNameAlreadyExists(fileFolderCopy, infoDestination) {
        var destinationFiles = infoDestination.filesFolders.files;
        var destinationFolders = infoDestination.filesFolders.folders;

        // search in files and folders if the name exists, but only in direct destination folder
        var filesNamesExists = this.findFilesFoldersCopyDestination(destinationFiles, fileFolderCopy);
        var folderNamesExists = this.findFilesFoldersCopyDestination(destinationFolders, fileFolderCopy);

        // sort files / folders names by number to for easier search
        this.sortFilesFoldersNamesByNumber(filesNamesExists, folderNamesExists);

        var nextFreeNumber, fileFolderName, fileFolderNameExists;

        if (filesNamesExists.length) fileFolderNameExists = filesNamesExists;
        else if (folderNamesExists.length) fileFolderNameExists = folderNamesExists;

        // file or folder with same name is found, rename copied / cut file, append them right number
        if (filesNamesExists.length || folderNamesExists.length) {
            fileFolderName = Files.removeFileFolderExtension(fileFolderCopy.name);
            nextFreeNumber = this.getFilesFoldersNameNextFreeNumber(fileFolderNameExists);
            fileFolderCopy.name = !nextFreeNumber ? `${fileFolderName.name}${fileFolderName.extension}` : 
                `${fileFolderName.name} (${nextFreeNumber})${fileFolderName.extension}`;
        }

        // folders with same name are found, rename copied / cut folder, append them right number
        // also update names for all nested files / folders because name of copied / cut folder is changed
        if (folderNamesExists.length) 
            this.updateNestedFilesFoldersCopyNames(fileFolderCopy, fileFolderName.name);
    }

    // find files or folders in current directory with given name and push them into array
    // names should be the same and can be appended with numbers at the end of the name
    // if the several names are the same, then they are appended with numbers
    findFilesFoldersCopyDestination(destinationFilesFolders, fileFolderCopy) {
        var filesFoldersNamesExists = [];
        var nameStartsTheSame = false, isFolder = false;
        var fileFolderNameDestination, fileFolderNameDestinationName, fileFolderNameCopy;
        var fileExtensionsEqual = false;

        var fileFolderNameCopy = isFolder ? fileFolderCopy.name :
            Files.removeFileFolderExtension(fileFolderCopy.name);

        var foldersType = destinationFilesFolders[0] ?
                          (destinationFilesFolders[0].info.type === 'File folder') &&
                          (fileFolderCopy.info.type === 'File folder') : true;
        var filesType = destinationFilesFolders[0] ?
                        (destinationFilesFolders[0].info.type !== 'File folder') &&
                        (fileFolderCopy.info.type !== 'File folder') : true;              

        // compare the same types, files with files and folders with folders
        // if they are not the same types, then return empty array
        if (!foldersType && !filesType) return filesFoldersNamesExists;

        for (let i = 0; i < destinationFilesFolders.length; i++) {
            isFolder = destinationFilesFolders[i].info.type === 'File folder';
            fileFolderNameDestination = isFolder ? destinationFilesFolders[i].name :
                    Files.removeFileFolderExtension(destinationFilesFolders[i].name);

            fileExtensionsEqual = fileFolderNameDestination.extension === fileFolderNameCopy.extension;

            // if it's file, then get name from file name, otherwise it's folder and get name from folder name
            fileFolderNameDestinationName = fileFolderNameDestination.extension ? 
                fileFolderNameDestination.name : fileFolderNameDestination;

            // if it's folder of file extension are equal, then try to compare names
            // name must starts the same
            if (isFolder || fileExtensionsEqual) {
                nameStartsTheSame = fileFolderNameDestinationName.startsWith(fileFolderNameCopy.name);

                // destination name contains copy name, but it must be in correct form
                // if the name is the same or it has number appended on it, then it's correct
                if (nameStartsTheSame) {
                    let nameRemainder = fileFolderNameDestinationName.slice(fileFolderNameCopy.name.length);

                    // look if number is appended at the end of destination name (number)
                    // or if names are the same and then add to the array if it's true
                    if (nameRemainder.match(/^ \(\d+\)$/) || 
                       (fileFolderNameDestinationName === fileFolderNameCopy.name)) {
                        // extract number before push into array
                        // if names are the same, then put empty string for number
                        let number = nameRemainder.split('(');
                        number = number[1] ? number[1].slice(0, number[1].length - 1) : '';

                        filesFoldersNamesExists.push({
                            number: number,
                            name: destinationFilesFolders[i].name
                        });
                    }
                }
            }
        }

        return filesFoldersNamesExists;
    }

    // sort files / folders names by number with array sort function
    sortFilesFoldersNamesByNumber(filesNamesExists, folderNamesExists) {

        // use inline array sorting via built-in js function
        // also bind this pointer to the js compare function to not lose this pointer
        filesNamesExists.sort((function compareFunctionFiles(a, b) {
            return this.sortFilesFoldersNamesCompare(a, b);
        }).bind(this));

        folderNamesExists.sort((function compareFunctionFiles(a, b) {
            return this.sortFilesFoldersNamesCompare(a, b);
        }).bind(this));
    }

    // when file or folder is copied or cut, then the name can already exists
    // in that situation, get next free number to append at the end of file or folder name
    getFilesFoldersNameNextFreeNumber(filesFoldersNames) {
        var number, oldNumber, nextFreeNumber = 1, missedNumberFound = false;
        var nameWithoutNumberFound = false;

        if (filesFoldersNames.length)
            oldNumber = this.parseFilesFoldersNamesNumber(filesFoldersNames[0].number);

        // loop through array and find first next free number
        for (var i = 0; i < filesFoldersNames.length; i++) {
            number = this.parseFilesFoldersNamesNumber(filesFoldersNames[i].number);

            if (!number) nameWithoutNumberFound = true;

            // then it's hole in sequence of numbers, return new number
            if (number > oldNumber + 1) {
                nextFreeNumber = oldNumber + 1;
                missedNumberFound = true;
                break;
            }

            oldNumber = number;
        }

        // if there are just names with numbers appended to it, then name can be created
        // without any number appended and if it's true then return 0
        if (!nameWithoutNumberFound) nextFreeNumber = 0;

        // increment last number if hole in number sequence doesn't exists
        else if (missedNumberFound && (oldNumber === number)) nextFreeNumber++;

        // othewise return missed number in number sequence
        else nextFreeNumber = oldNumber + 1;

        return nextFreeNumber;
    }

    // when some folder is renamed and appended with number because there is another folder
    // with the same name, then all locations for nested files / folders should be changed
    // for new folder name
    updateNestedFilesFoldersCopyNames(fileFolderCopy, oldFolderName) {
        var location;

        if (fileFolderCopy.files[0]) location = fileFolderCopy.files[0].info.location;
        else if (fileFolderCopy.folders[0]) location = fileFolderCopy.folders[0].info.location;
        else return;

        // replace new folder name with old one
        var locationSliced = location.slice(1, location.length - 1);
        var locationSplitted = locationSliced.split('/');
        locationSplitted[locationSplitted.length - 1] = fileFolderCopy.name;

        var newLocation = '/';

        // form new location with new folder name
        for (let i = 0; i < locationSplitted.length; i++) newLocation += `${locationSplitted[i]}/`;

        // replace old location with new location for all nested files and folders
        // in that way, new folder name with appended number will be updated for nested files and folders
        this.updateNestedFilesFoldersCopyNamesRecursively(fileFolderCopy, newLocation, location);
    }

    updateNestedFilesFoldersCopyNamesRecursively(fileFolderCopy, newLocation, oldLocation) {
        // update nested files locations names
        for (let i = 0; i < fileFolderCopy.files.length; i++)
            fileFolderCopy.files[i].info.location = 
                this.replaceFileFolderCopyLocation(fileFolderCopy.files[i].info.location, newLocation, oldLocation);

        // update nested folders locations names
        for (let i = 0; i < fileFolderCopy.folders.length; i++) {
            fileFolderCopy.folders[i].info.location = 
                this.replaceFileFolderCopyLocation(fileFolderCopy.folders[i].info.location, newLocation, oldLocation);
            this.updateNestedFilesFoldersCopyNamesRecursively(fileFolderCopy.folders[i], newLocation, oldLocation);
        }
    }

    // replace old location with new location in cached location
    replaceFileFolderCopyLocation(cachedLocation, newLocation, oldLocation) {
        var oldNumberOfTokens = oldLocation.slice(1, oldLocation.length - 1).split('/').length;
        var newTokens = newLocation.slice(1, newLocation.length - 1).split('/');
        var cachedTokens = cachedLocation.slice(1, cachedLocation.length - 1).split('/');
        var newCachedLocation = '/';

        // replace N old tokens with N new tokens inside cached tokens locations
        for (let i = 0; i < oldNumberOfTokens; i++) cachedTokens[i] = newTokens[i];

        // form new cached location with updated cached tokens
        for (let i = 0; i < cachedTokens.length; i++) newCachedLocation += `${cachedTokens[i]}/`;

        return newCachedLocation;
    }

    // compare function for sorting js arrays with files / folders names
    sortFilesFoldersNamesCompare(a, b) {
        var firstNumber = this.parseFilesFoldersNamesNumber(a.number);
        var secondNumber = this.parseFilesFoldersNamesNumber(b.number);

        return firstNumber - secondNumber;
    }

    parseFilesFoldersNamesNumber(fileFolderNumber) {
        // if it's number, then first digit must not be zero, 
        // and other digits can be any of them or not exists at all
        if (fileFolderNumber.match(/^[1-9]\d*$/)) 
            return parseInt(fileFolderNumber);

        // otherwise return 0
        else return 0;
    }

    updateDestinationFilesFoldersLocation(fileFolderCopy, destinationLocation, isFolder, isCut) {
        
        // update created time only if it's copy file / folder, don't do for cut
        if (!isCut) this.updateDestinationFilesFoldersCreatedTime(fileFolderCopy);

        // update files / folders locations if folder is copied / cut
        if (isFolder) {
            let concatenatedLocation = 0;

            // update files location first
            fileFolderCopy.files.forEach(function iterate(value, index, array) {
                // concatenate location only once
                if (!concatenatedLocation) 
                    concatenatedLocation = this.concatenateSourceToDestinationLocation(value.info.location, destinationLocation)
                value.info.location = concatenatedLocation;
    
                if (!isCut) this.updateDestinationFilesFoldersCreatedTime(value);
            }, this);
    
            concatenatedLocation = 0;

            // update folders location recursively if it's not single file
            // also update folder link path just for folders, because it's used when folder is clicked to 
            // find which folder link is clicked and that link path must be unique for each folder
            fileFolderCopy.folders.forEach(function iterate(value, index, array) {
                if (!concatenatedLocation) 
                    concatenatedLocation = this.concatenateSourceToDestinationLocation(value.info.location, destinationLocation);
                value.info.location = concatenatedLocation;

                // update folder link path for destination folder
                this.updateDestinationFolderPath(value);
    
                if (!isCut) this.updateDestinationFilesFoldersCreatedTime(value);
                this.updateDestinationFilesFoldersLocation(value, destinationLocation, isFolder, isCut);
            }, this);
        }
    }

    // returns merged location from destination and source location
    // append source location different parts to destination location
    concatenateSourceToDestinationLocation(sourceLocation, destinationLocation) {
        // split location into individual tokens and remove first and last backslash before that
        var sourceArray = (sourceLocation.slice(1, sourceLocation.length - 1)).split('/');
        var destinationArray = (destinationLocation.slice(1, destinationLocation.length - 1)).split('/');
        var arrayMinLength = sourceArray.length >= destinationArray.length ? 
            sourceArray.length : destinationArray.length;

        // find first part of tokens which are the same
        for (var i = 0; i < arrayMinLength; i++)
            if (sourceArray[i] !== destinationArray[i]) break;

        // append source location parts which are different to the destination
        for (; i < sourceArray.length; i++) destinationArray.push(sourceArray[i]);

        var mergedLocation = '/';

        // merge all locations from new destination into single string
        for (i = 0; i < destinationArray.length; i++) 
            mergedLocation += `${destinationArray[i]}/`;

        return mergedLocation;
    }

    // each folder must have unique folder link path url and that path must be 
    // updated when location is changed
    updateDestinationFolderPath(value) {
        var location = value.info.location;
        var pathHome = "/js_repo/primeri/primer6/html";
        var name = value.name + '/';

        // slice location to remove home folder
        var locationWithoutHome = location.slice(5);
        
        // set new folder link path which is unique (because location is unique)
        value.info.path = pathHome + locationWithoutHome + name;
    }

    // set current time for new created time when some file or folder is copied
    updateDestinationFilesFoldersCreatedTime(fileFolderCopy) {
        var currentDate = new Date();
        var year = currentDate.getFullYear();
        var day = this.getCurrentDay(currentDate);
        var date = currentDate.getDate();
        var time = this.getCurrentTime(currentDate);
        var month = this.getCurrentMonth(currentDate);
        var createdTime = `${day}, ${month} ${date}, ${year}, ${time}`;

        fileFolderCopy.info.created = createdTime;
    }

    getCurrentDay(currentDate) {
        var dayNumber = currentDate.getDay();

        switch (dayNumber) {
            case 0: return 'Sunday';
            case 1: return 'Monday';
            case 2: return 'Tuesday';
            case 3: return 'Wednesday';
            case 4: return 'Thursday';
            case 5: return 'Friday';
            case 6: return 'Saturday';
        }
    }

    getCurrentMonth(currentDate) {
        var monthNumber = currentDate.getMonth();

        switch (monthNumber) {
            case 0: return 'January';
            case 1: return 'February';
            case 2: return 'March';
            case 3: return 'April';
            case 4: return 'May';
            case 5: return 'June';
            case 6: return 'July';
            case 7: return 'August';
            case 8: return 'September';
            case 9: return 'October';
            case 10: return 'November';
            case 11: return 'December';
        }
    }

    getCurrentTime(currentDate) {
        var currentHours = currentDate.getHours(), 
            currentMinutes = currentDate.getMinutes(), 
            currentSeconds = currentDate.getSeconds();

        // format hours, minutes and seconds to two digit numbers
        // if it's one digit number add leading zero, otherwise add nothing
        if (this.isNumberSingleDigit(currentHours) === true) currentHours = `0${currentHours}`;
        if (this.isNumberSingleDigit(currentMinutes) === true) currentMinutes = `0${currentMinutes}`;
        if (this.isNumberSingleDigit(currentSeconds) === true) currentSeconds = `0${currentSeconds}`;

        var currentTime = `${currentHours}:${currentMinutes}:${currentSeconds}`;

        return currentTime;
    }

    isNumberSingleDigit(number) {
        if ((number >= 0) && (number <= 9)) return true;
        else if (number > 9) return false;
        else return -1;
    }

    // if destination folder is subfolder of source folder, then it cannot be copied
    destinationSubfolderSource(destinationFolder, sourceFolder) {
        var folderFound = false;
        var isFolder = sourceFolder.info.type === 'File folder';

        // if it's file, then do nothing
        if (!isFolder) return false;

        // destination and source folder cannot be the same
        if (destinationFolder === sourceFolder) return true;

        for (let i = 0; i < sourceFolder.folders.length; i++) {
            // if folder is found by some previous recursion, then it's subfolder
            if (folderFound) return true;

            // destination folder is subfolder of source folder
            if (destinationFolder === sourceFolder.folders[i]) {
                folderFound = true;
                break;
            }
            // search in subfolders by recursion
            else folderFound = this.destinationSubfolderSource(destinationFolder, sourceFolder.folders[i]);
        }

        return folderFound;
    }
    
    // cut file or folder from cached folder structure by removing them
    cutFileFolder(infoSource) {
        this.properties.fileFolderCached = infoSource;

        // remove file or folder with delete feature
        this.properties.removeFileFolder({
            key: '',
            type: ''
        });

        this.properties.fileFolderCached = 0;
    }
}