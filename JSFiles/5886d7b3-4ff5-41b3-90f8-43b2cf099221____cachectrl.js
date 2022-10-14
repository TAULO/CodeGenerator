var cacheCtrl = {
    _cacheList: null,
    _cacheTree: null,
    _cacheTreeBox: null,
    _cacheTreeView: null,
    _prefBranch: null,
    _updateTimer: null,
    _isActive: false,
    _downloadDirectory: null,
    _tempDirectory: null,

    onLoad: function() {
        this._cacheList = [];
        this._cacheTreeView = new CacheTreeView( this._cacheList );
        this._cacheTree = document.getElementById( "cachelist-tree" );
        this._cacheTree.view = this._cacheTreeView;
        this._cacheTreeBox = this._cacheTreeView._treeBoxObject;

        this._prefBranch = this._prefService.getBranch( "extensions.cachelist." );

        try {
            this._downloadDirectory = this._prefBranch.getComplexValue( "downloadDir", Ci.nsILocalFile );
        } catch ( ex ) {
            this._downloadDirectory = Cc["@mozilla.org/download-manager;1"].getService( Ci.nsIDownloadManager).userDownloadsDirectory;
        }

        try {
            this._tempDirectory = this._prefBranch.getComplexValue( "tempDir", Ci.nsILocalFile );
        } catch ( ex ) {
            this._tempDirectory = Cc["@mozilla.org/file/directory_service;1"].getService( Ci.nsIProperties ).get( "TmpD", Ci.nsIFile );
        }

        document.getElementById( "cachelist-url-filter" ).value = this._prefBranch.getCharPref( "urlFilter" );
        document.getElementById( "cachelist-content-type-filter" ).value = this._prefBranch.getCharPref( "contentTypeFilter" );
        document.getElementById( "cachelist-id-filter" ).value = this._prefBranch.getCharPref( "idFilter" );
        document.getElementById( "cachelist-index-filter" ).value = this._prefBranch.getCharPref( "indexFilter" );
        document.getElementById( "cachelist-range-filter" ).value = this._prefBranch.getCharPref( "rangeFilter" );

        this._prefBranch.QueryInterface( Ci.nsIPrefBranch2 );
        this._prefBranch.addObserver( "", this, false );

        this._updateTimer = Cc["@mozilla.org/timer;1"].createInstance( Ci.nsITimer );
    },

    onUnload: function() {
        // TODO: remove exception
        for ( var i = 0; i < this._cacheList.length; i ++ ) {
            this._cacheList[i].remove( true );
        }

        this._cacheList.length = 0;

        this._prefBranch.removeObserver( "", this );

        this.stop();
    },

    start: function() {
        if ( ! this._isActive ) {
            this._observerService.addObserver( this, "http-on-examine-response", false );
            this._observerService.addObserver( this, "http-on-examine-cached-response", false );
            this._updateTimer.init( this, 1000, Ci.nsITimer.TYPE_REPEATING_SLACK );
            this._isActive = true;
        }
    },

    stop: function() {
        if ( this._isActive ) {
            this._observerService.removeObserver( this, "http-on-examine-response" );
            this._observerService.removeObserver( this, "http-on-examine-cached-response" );
            this._updateTimer.cancel();
            this._isActive = false;
        }
    },

    observe: function( aSubject, aTopic, aData ) {
        switch ( aTopic ) {
        case "http-on-examine-response":
        case "http-on-examine-cached-response":
            if ( ! this._isActive )
                return;

            var channel = aSubject.QueryInterface( Ci.nsIChannel );

            var url = channel.URI.prePath + channel.URI.path;
            var urlFilter = document.getElementById( "cachelist-url-filter" ).value;

            if ( url.indexOf( urlFilter, 0 ) == -1 )
                return;

            var contentType = channel.contentType;
            var contentTypeRegexp = new RegExp( document.getElementById( "cachelist-content-type-filter" ).value );

            if ( ! contentTypeRegexp.test( contentType ) )
                return;

            // 従来のフィルター
            /*
            var contentTypeFilter = document.getElementById( "cachelist-content-type-filter" ).value;

            if ( contentType.indexOf( contentTypeFilter, 0 ) == -1 )
                return;
            */

            var cacheData = new CacheData();

            cacheData.init( aSubject, this._tempDirectory );

            var idRegexp = new RegExp( document.getElementById( "cachelist-id-filter" ).value );
            var indexRegexp = new RegExp( document.getElementById( "cachelist-index-filter" ).value );
            var rangeRegexp = new RegExp( document.getElementById( "cachelist-range-filter" ).value );

            var idResult = idRegexp.exec( url );
            var indexResult = indexRegexp.exec( url );
            var rangeResult = rangeRegexp.exec( url );

            // 正規表現にマッチした文字列を取得する
            // キャプチャが存在する場合は、キャプチャのみ結合する
            if ( idResult != null && idResult[0] != '' ) {
                if ( idResult.length > 1 )
                    idResult.shift();

                cacheData._id = idResult.join('');
            }
            if ( indexResult != null && indexResult[0] != '' ) {
                if ( indexResult.length > 1 )
                    indexResult.shift();

                cacheData._index = indexResult.join('');
            }
            if ( rangeResult != null && rangeResult[0] != '' ) {
                if ( rangeResult.length > 1 )
                    rangeResult.shift();

                cacheData._range = rangeResult.join( '-' );
            }

            // 従来のフィルター
            /*
            var idFilter = document.getElementById( "cachelist-id-filter" ).value + "="; // "id" + "=";
            var indexFilter = document.getElementById( "cachelist-index-filter" ).value + "="; // "segment" + "=";
            var rangeFilter = document.getElementById( "cachelist-range-filter" ).value + "="; // "range" + "=";

            // URLからパラメータを抽出する
            var parameters = channel.URI.QueryInterface( Ci.nsIURL ).query.split( "&" );

            for ( var i = 0; i < parameters.length; i ++ ) {
                if ( cacheData._id == null && parameters[i].lastIndexOf( idFilter, 0 ) == 0 ) {
                    cacheData._id = parameters[i].substr( idFilter.length );
                }
                if ( cacheData._index == null && parameters[i].lastIndexOf( indexFilter, 0 ) == 0 ) {
                    cacheData._index = parameters[i].substr( indexFilter.length );
                }
                if ( cacheData._range == null && parameters[i].lastIndexOf( rangeFilter, 0 ) == 0 ) {
                    cacheData._range = parameters[i].substr( rangeFilter.length );
                }
            }
            */

            this._cacheList.unshift( cacheData );
            this._cacheTreeBox.rowCountChanged( 0, 1 );

            break;
        case "nsPref:changed":
            var prefBranch = aSubject.QueryInterface( Ci.nsIPrefBranch );

            switch ( aData ) {
                case "downloadDir":
                    this._downloadDirectory = prefBranch.getComplexValue( "downloadDir", Ci.nsILocalFile );
                    break;
                case "tempDir":
                    this._tempDirectory = prefBranch.getComplexValue( "tempDir", Ci.nsILocalFile );
                    break;
            }

            break;
        case "timer-callback":
            if ( this._cacheList.length != 0 && this._isActive )
                this._cacheTreeBox.invalidate();

            break;
        }
    },

    QueryInterface: function( aIID ) {
        if ( aIID.equals( Ci.nsISupports ) ||
             aIID.equals( Ci.nsIObserver ) ) return this;

        throw Cr.NS_NOINTERFACE;
    },

    getCurrentCacheData: function () {
        var index = this._cacheTree.currentIndex;

        if ( index == -1 )
            return null;

        return this._cacheList[index];
    },

    onSelect: function() {
        /*
        debug.log( "onSelect" );

        if ( this._cacheList.length == 0 )
            document.getElementById( "cachelist-clear-command" ).setAttribute( "disabled", true );
        else
            document.getElementById( "cachelist-clear-command" ).removeAttribute( "disabled" );

        var index = this._cacheTree.currentIndex;

        if ( index == -1 ) {
            document.getElementById( "cachelist-save-command" ).setAttribute( "disabled", true );
            document.getElementById( "cachelist-remove-command" ).setAttribute( "disabled", true );

            return;
        }

        var cacheData = this._cacheList[index];

        if ( cacheData._progress != 100 ) {
            document.getElementById( "cachelist-save-command" ).setAttribute( "disabled", true );
            document.getElementById( "cachelist-remove-command" ).setAttribute( "disabled", true );
        } else {
            document.getElementById( "cachelist-save-command" ).removeAttribute( "disabled" );
            document.getElementById( "cachelist-remove-command" ).removeAttribute( "disabled" );
        }
        */
    },

    onSaveCommand: function( isSaveAs ) {
        var cacheData = this.getCurrentCacheData();

        if ( ! cacheData )
            return;

        var url = this._ioService.newURI( cacheData._url, null, null ).QueryInterface( Ci.nsIURL );
        var mimeInfo = this._mimeService.getFromTypeAndExtension( cacheData._contentType, "" );
        var fileExtension;
        var fileName;
        var file;

        // URLの拡張子なし MIMEの拡張子あり → MIMEの拡張子
        // URLの拡張子あり MIMEの拡張子あり → URLとMIMEの拡張子が一致したもの or 一致しなければMIMEの拡張子
        // URLの拡張子なし MIMEの拡張子なし → 
        // URLの拡張子あり MIMEの拡張子なし → URLの拡張子

        if ( mimeInfo.extensionExists( url.fileExtension ) )
            fileExtension = url.fileExtension;
        else {
            // 未登録のMIME-Typeの場合は例外が発生する。例外をキャッチしてURLの拡張子を設定する。
            try {
                fileExtension = mimeInfo.primaryExtension;
            } catch ( ex ) {
                fileExtension = url.fileExtension;
            }
        }

         if ( cacheData._id == null )
             fileName = url.fileBaseName + "." + fileExtension;
         else
             fileName = url.fileBaseName + "-" + cacheData._id + "." + fileExtension;

         if ( isSaveAs ) {
             var fp = Cc["@mozilla.org/filepicker;1"].createInstance( Ci.nsIFilePicker );

             // TODO: propertiesからタイトルを設定
             fp.init( window, "Select a File", Ci.nsIFilePicker.modeSave );

             fp.defaultString = fileName;

             // 拡張子フィルタを設定
             var extensions = mimeInfo.getFileExtensions();
             var extensionFilters = "";

             while ( extensions.hasMore() ) {
                 if ( extensionFilters == "" )
                     extensionFilters = "*." + extensions.getNext();
                 else
                     extensionFilters = extensionFilters + "; *." + extensions.getNext();
             }

             if ( extensionFilters != "" )
                 fp.appendFilter( extensionFilters, extensionFilters );

             if ( fileExtension != "" && ! mimeInfo.extensionExists( fileExtension ) ) {
                 extensionFilters = "*." + fileExtension;
                 fp.appendFilter( extensionFilters, extensionFilters );
             }

             fp.appendFilters( Ci.nsIFilePicker.filterAll );

             if ( fp.show() == Ci.nsIFilePicker.returnCancel )
                 return;

             file = fp.file;
         }
         else {
             file = Cc["@mozilla.org/file/local;1"].createInstance( Ci.nsILocalFile );
             file.initWithFile( this._downloadDirectory );
             file.append( fileName );
             file.createUnique( Ci.nsIFile.NORMAL_FILE_TYPE, 0664 );
         }

         if ( cacheData._id == null ) {
             try {
                 cacheData.save( file, true );
             } catch ( ex ) {
                 alert( ex.message ); // TODO
             }
         }
         else {
             var joinCacheList = [];

             for ( var i = 0; i < this._cacheList.length; i ++ ) {
                 if ( this._cacheList[i]._id == cacheData._id ) {
                     joinCacheList.unshift( this._cacheList[i] );
                 }
             }

             if ( cacheData._index != null ) {
                 joinCacheList.sort( function( a, b ) {
                     if ( parseInt( a._index, 10 ) > parseInt( b._index, 10 ) ) return 1;
                     if ( parseInt( a._index, 10 ) < parseInt( b._index, 10 ) ) return -1;
                     return 0;
                 } );
             }
             else if ( cacheData._range != null ) {
                 joinCacheList.sort( function( a, b ) {
                     if ( parseInt( a._range, 10 ) > parseInt( b._range, 10 ) ) return 1;
                     if ( parseInt( a._range, 10 ) < parseInt( b._range, 10 ) ) return -1;
                     return 0;
                 } );
             }

             var fileOutputStream = Cc["@mozilla.org/network/file-output-stream;1"].createInstance( Ci.nsIFileOutputStream );
             var fileInputStream = Cc["@mozilla.org/network/file-input-stream;1"].createInstance( Ci.nsIFileInputStream );
             var binaryInputStream = Cc["@mozilla.org/binaryinputstream;1"].createInstance( Ci.nsIBinaryInputStream );
             var binaryData;
             var binaryDataSize;

             try {
                 fileOutputStream.init( file, 0x0a, -1, 0 ); // PR_WRONLY | PR_CREATE_FILE

                 for ( var i = 0; i < joinCacheList.length; i ++ ) {
                         joinCacheList[i].close();

                         fileInputStream.init( joinCacheList[i]._file, 0x01, -1, 0 ); // PR_RDONLY
                         binaryInputStream.setInputStream( fileInputStream );

                         if ( i == joinCacheList.length - 1 ) {
                             binaryDataSize = binaryInputStream.available();
                         }
                         else if ( joinCacheList[i]._range == null || joinCacheList[i + 1]._range == null ) {
                             binaryDataSize = binaryInputStream.available();
                         }
                         else {
                             binaryDataSize = joinCacheList[i + 1]._range.split( "-" )[0] - joinCacheList[i]._range.split( "-" )[0];

                             if ( binaryDataSize < 0 || binaryDataSize > binaryInputStream.available() )
                                 throw NS_ERROR_FILE_COPY_OR_MOVE_FAILED;
                         }

                         binaryData = binaryInputStream.readBytes( binaryDataSize );
                         fileOutputStream.write( binaryData, binaryData.length );

                         binaryInputStream.close();
                         fileInputStream.close();

                         joinCacheList[i]._savedFile = file;
                         joinCacheList[i]._isSaved = true;

                         joinCacheList[i].resume();
                 }

                 fileOutputStream.close();
             } catch ( ex ) {
                 alert( ex.message );
             }
         }
    },

    onClearCommand: function( isForced ) {
        if ( this._cacheList.length == 0 )
            return;

        var exception;

        this._cacheTreeBox.beginUpdateBatch();

        for ( var i = 0; i < this._cacheList.length; i ++ ) {
            var cacheData = this._cacheList[i];

            if ( cacheData._isCached || isForced ) {
                try {
                    cacheData.remove( true );
                } catch ( ex ) {
                    errorOccurred = true;
                }

                this._cacheList.splice( i, 1 );
                this._cacheTreeBox.rowCountChanged( i, -1 );

                i --;
            }
        }

        this._cacheTreeBox.endUpdateBatch();

        if ( exception )
            alert( exception.message );
    },

    onRemoveCommand: function() {
        var index = this._cacheTree.currentIndex;

        if ( index == -1 )
            return;

        var cacheData = this._cacheList[index];

        try {
            cacheData.remove( true );
        } catch ( ex ) {
            alert( ex.message ); // TODO
        }

        this._cacheList.splice( index, 1 );
        this._cacheTreeBox.rowCountChanged( index, -1 ); // Use negative values for removed rows.

        // Reselect item
        if ( index >= this._cacheList.length )
            this._cacheTreeView.selection.select( index - 1 );
        else
            this._cacheTreeView.selection.select( index );
    },

    onCopyUrlCommand: function () {
        var rangeCount = this._cacheTreeView.selection.getRangeCount();

        if ( rangeCount <= 0 )
            return;

        var startIndex = new Object();
        var endIndex = new Object();
        var url = "";

        for ( var rangeIndex = 0; rangeIndex < rangeCount; rangeIndex ++ ) {
            this._cacheTreeView.selection.getRangeAt( rangeIndex, startIndex, endIndex );

            for ( var i = startIndex.value; i <= endIndex.value; i ++ ) {
                url = url + this._cacheList[i]._url + "\n";
            }
        }

        this._clipboardHelper.copyString( url );
        // var cacheData = this.getCurrentCacheData();
        //
        // if ( cacheData )
        //     this._clipboardHelper.copyString( cacheData._url );
    },

    onOpenFolderCommand: function () {
        var cacheData = this.getCurrentCacheData();
         var file;

        if ( ! cacheData )
            return;

         if ( cacheData._savedFile )
             file = cacheData._savedFile;
         else
             file = cacheData._file;

        try {
            file.QueryInterface( Ci.nsILocalFile ).reveal();
        } catch ( ex ) {
            var parent = file.parent.QueryInterface( Ci.nsILocalFile );

            if ( ! parent )
                return;

            try {
                parent.launch();
            } catch ( ex ) {
                this._externalProtocolService.loadUrl( this._ioService.newFileURI( parent ) );
            }
        }
    },

    onToggleCommand: function() {
        if ( this._isActive )
            this.onCloseCommand();
        else
            this.onOpenCommand();
    },

    onOpenCommand: function() {
        if ( ! this._isActive ) {
            document.getElementById( "cachelist-checked-state" ).setAttribute( "checked", true );
            document.getElementById( "cachelist-display-state" ).removeAttribute( "collapsed" );
            this.start();
        }
    },

    onCloseCommand: function() {
        if ( this._isActive ) {
            document.getElementById( "cachelist-checked-state" ).removeAttribute( "checked" );
            document.getElementById( "cachelist-display-state" ).setAttribute( "collapsed", true );
            this.stop();
        }
    },

    // popupshowingで有効/無効切り替え
    // onOpenCommand: function( event ) {
        // TODO: Open containing folder
    // },

    onMenuItemCommand: function( event ) {
        var strings = document.getElementById("cachelist-strings");
        alert( strings.getString( "helloMessage" ) );
    },

    onToolbarButtonCommand: function( event ) {
        this.onMenuItemCommand( event );
    }
};

var debug = {
    // https://developer.mozilla.org/en/NsIConsoleService
    _consoleservice: Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService),
    _Cc_scripterror: Components.classes["@mozilla.org/scripterror;1"],
    _Ci_scripterror: Components.interfaces.nsIScriptError,
    enabled: false, // set true to output
    noFirebug: false, // don't show object in Firebug
    prefix: "",  // prefix string
    createScripterror: function() this._Cc_scripterror.createInstance(this._Ci_scripterror),
    // log for Firebug with existence check
    logFirebug: function(x) this.enabled && !this.noFirebug && Firebug && Firebug.Console && Firebug.Console.log(x),
    logFirebugOnlyObject: function(x) typeof x == "object" && x != null && this.logFirebug(x),
    // log/warn/error in console
    log: function(message) {
        if (this.enabled) {
            this._consoleservice.logStringMessage(this.prefix+message);
            this.logFirebugOnlyObject(message);
        }
    },
    warn: function(message) {
        if (this.enabled) {
            var stack = Components.stack.caller;
            var error = this._Cc_scripterror.createInstance(this._Ci_scripterror);
            error.init(this.prefix+message, stack.filename, null, stack.lineNumber, null, this._Ci_scripterror.warningFlag, null);
            this._consoleservice.logMessage(error);
            this.logFirebugOnlyObject(message);
        }
    },
    error: function(message) {
        if (this.enabled) {
            var stack = Components.stack.caller;
            var error = this._Cc_scripterror.createInstance(this._Ci_scripterror);
            error.init(this.prefix+message, stack.filename, null, stack.lineNumber, null, this._Ci_scripterror.errorFlag, null);
            this._consoleservice.logMessage(error);
            this.logFirebugOnlyObject(message);
        }
    },
    // debug with exception (error objects)
    exception: function(error) {
        if (this.enabled) {
            Components.utils.reportError(error);
            this.logFirebugOnlyObject(error);
        }
    },
    stack: function(error) {
        if (this.enabled) {
            if (error instanceof Error) {
                this._consoleservice.logStringMessage(this.prefix+error.stack);
            }
            else {
                error = new Error();
                var callerstack = error.stack.replace(/^.*\n.*\n/, "");
                this._consoleservice.logStringMessage(this.prefix+callerstack);
            }
            this.logFirebugOnlyObject(error);
        }
    },
    // alert and assert
    alert: function(message) {
        if (this.enabled) {
            window.alert(this.prefix + message);
            this.logFirebugOnlyObject(message);
        }
    },
    assert: function(cond, message) {
        var failed = this.enabled && !cond;
        if (failed) {
            var message = this.prefix+message;
            var stack = Components.stack.caller;
            var error = this._Cc_scripterror.createInstance(this._Ci_scripterror);
            error.init(message, stack.filename, null, stack.lineNumber, null, this._Ci_scripterror.errorFlag, null);
            this._consoleservice.logMessage(error);
            window.alert(message);
            this.logFirebugOnlyObject(message);
        }
        return !failed;
    }
};

XPCOMUtils.defineLazyServiceGetter( cacheCtrl, "_observerService"              , "@mozilla.org/observer-service;1"                    , "nsIObserverService"         );
XPCOMUtils.defineLazyServiceGetter( cacheCtrl, "_prefService"                  , "@mozilla.org/preferences-service;1"                 , "nsIPrefService"             );
XPCOMUtils.defineLazyServiceGetter( cacheCtrl, "_mimeService"                  , "@mozilla.org/mime;1"                                , "nsIMIMEService"             );
XPCOMUtils.defineLazyServiceGetter( cacheCtrl, "_ioService"                    , "@mozilla.org/network/io-service;1"                  , "nsIIOService"               );
XPCOMUtils.defineLazyServiceGetter( cacheCtrl, "_externalProtocolService"      , "@mozilla.org/uriloader/external-protocol-service;1" , "nsIExternalProtocolService" );
XPCOMUtils.defineLazyServiceGetter( cacheCtrl, "_clipboardHelper"              , "@mozilla.org/widget/clipboardhelper;1"              , "nsIClipboardHelper"         );

debug.enabled = true;
debug.prefix = "cacheCtrl:\n\n";

window.addEventListener( "load"  , function() { cacheCtrl.onLoad();   }, false );
window.addEventListener( "unload", function() { cacheCtrl.onUnload(); }, false );
