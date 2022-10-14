///////////////////////////////////////////////////////////////////////////////
// Autodesk.ADN.Viewing.Extension.ExtensionManager
// by Philippe Leefsma, May 2015
//
///////////////////////////////////////////////////////////////////////////////

AutodeskNamespace("Autodesk.ADN.Viewing.Extension");

Autodesk.ADN.Viewing.Extension.ExtensionManager = function (viewer, options) {

    Autodesk.Viewing.Extension.call(this, viewer, options);

    var _panelBaseId = guid();

    var _extensionsMap = {};

    var _panel = null;

    var _this = this;

    var _selectedExtensions = {};

    var _extensionsPages = {};

    var mapLen = 0;

    var _extensionsIndex;

    var cssScene, cssRenderer, camera, controls, glScene, glRenderer;
    /////////////////////////////////////////////////////////
    //
    //
    //////////////////////////////////////////////////////////
    _this.load = function () {
        console.log(options);
        console.log(viewer);

        var ctrlGroup = getControlGroup();

        _this.createControls(ctrlGroup);

        _panel = new Autodesk.ADN.Viewing.Extension.ExtensionManager.Panel(
          viewer.container,
          _panelBaseId);

        // $('#sceneTransfer').click(loadNewViewer());
        console.log(options.apiUrl);

        $.get(options.apiUrl , function(extensions) {

            initStorage(extensions);

            _extensionsMap = _this.initializeExtensions(
              extensions);

            for(var extensionId in _extensionsMap) {

                _panel.addExtension(_extensionsMap[extensionId]);
            }
        });

        console.log('Autodesk.ADN.Viewing.Extension.ExtensionManager loaded');

        return true;
    };

    /////////////////////////////////////////////////////////
    //
    //
    /////////////////////////////////////////////////////////
    _this.unload = function () {

        console.log('Autodesk.ADN.Viewing.Extension.ExtensionManager unloaded');

        return true;
    };

    /////////////////////////////////////////////////////////
    //
    //
    /////////////////////////////////////////////////////////
    _this.initializeExtensions = function(extensions) {

        var extensionsMap = {};

        extensions.forEach(function(extension){

            //hidden extensions start with '_'
            if(!extension.id.startsWith('_')) {

                extension.handler = function() {

                    extension.enabled = !extension.enabled;

                    storeExtensionState(extension);

                    if(extension.enabled) {

                        $('#' + extension.itemId).addClass('enabled');

                        _selectedExtensions[extension.id] = extension;

                        loadExtension(extension);
                    }
                    else {

                        $('#' + extension.itemId).removeClass('enabled');

                        delete _selectedExtensions[extension.id];

                        delete _extensionsPages[extension.id];

                        //viewer.unloadExtension(extension.id);
                    }
                };

                extension.itemId = guid();

                extension.enabled = getExtensionState(extension);

                /*if(extension.enabled) {
                    // loadExtension(extension);
                }*/

                extensionsMap[extension.id] = extension;
            }
        });

        return extensionsMap;
    };

    /////////////////////////////////////////////////////////
    //
    //
    /////////////////////////////////////////////////////////
    function getControlGroup() {

        var toolbar = viewer.getToolbar(true);

        var control = toolbar.getControl(
          options.controlGroup);

        if(!control) {

            control = new Autodesk.Viewing.UI.ControlGroup(
              options.controlGroup);

            toolbar.addControl(control);
        }

        return control;
    }

    /////////////////////////////////////////////////////////
    //
    //
    /////////////////////////////////////////////////////////
    _this.createControls = function(parentGroup) {

        var btn = createButton(
            'Autodesk.ADN.Gallery.ExtensionManager.Button.Manage',
            'glyphicon glyphicon-plus',
            'Manage Extensions',
            _this.onExtensionManagerClicked);

        var go = createButton(
            'SceneTransfer',
            'glyphicon glyphicon-plus',
            'Transfer to viewing mode',
            loadNewViewer
        );
        parentGroup.addControl(btn, {index: options.index});
        parentGroup.addControl(go, {index: options.index});
    };

    /////////////////////////////////////////////////////////
    //
    //
    /////////////////////////////////////////////////////////
    _this.onExtensionManagerClicked = function() {

        _panel.setVisible(true);
    };

    /////////////////////////////////////////////////////////
    //
    //
    /////////////////////////////////////////////////////////
    function createButton(id, className, tooltip, handler) {

        var button = new Autodesk.Viewing.UI.Button(id);

        //button.icon.style.backgroundImage = imgUrl;
        button.icon.className = className;

        button.icon.style.fontSize = "24px";

        button.setToolTip(tooltip);

        button.onClick = handler;

        return button;
    }

    /////////////////////////////////////////////////////////
    //
    //
    /////////////////////////////////////////////////////////
    function guid() {

        var d = new Date().getTime();

        var guid = 'xxxx-xxxx-xxxx-xxxx-xxxx'.replace(
          /[xy]/g,
          function (c) {
              var r = (d + Math.random() * 16) % 16 | 0;
              d = Math.floor(d / 16);
              return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
          });

        return guid;
    }

    /////////////////////////////////////////////////////////
    //
    //
    /////////////////////////////////////////////////////////
    function initStorage(extensions) {

        //window.localStorage.clear();

        if(!localStorage['gallery.extensions']) {

            localStorage['gallery.extensions'] = JSON.stringify({});
        }

        var storageObj = JSON.parse(localStorage['gallery.extensions']);

        extensions.forEach(function(extension) {

            if(!storageObj[extension.id]) {

                storageObj[extension.id] = false;
            }
        });

        localStorage['gallery.extensions'] = JSON.stringify(storageObj);
    }

    /////////////////////////////////////////////////////////
    //
    //
    /////////////////////////////////////////////////////////
    function getExtensionState(extension) {

        var storageObj = JSON.parse(
          localStorage['gallery.extensions']);

        return storageObj[extension.id];
    }

    /////////////////////////////////////////////////////////
    //
    //
    /////////////////////////////////////////////////////////
    function storeExtensionState(extension) {

        var storageObj = JSON.parse(localStorage['gallery.extensions']);

        storageObj[extension.id] = extension.enabled;

        localStorage['gallery.extensions'] = JSON.stringify(storageObj);
    }

    /////////////////////////////////////////////////////////
    //
    //
    /////////////////////////////////////////////////////////
    function loadExtension(extension) {

        /*$.getScript(options.extensionsUrl +'/' +
          extension.id + '/' + extension.file)
            
          .done(function () {
           /!* make changes within this part for just registering extensions to the next Three.js scene but not loading the extension directly
            move this part to a MeshTester.js, make a map in MeshTester for loading extensions*!/
              viewer.loadExtension(extension.id, {
                  connect: options.connect,
                  disconnect: options.disconnect
              });
          })
          .fail(function (jqxhr, settings, exception) {
              console.log("Load failed: " + extension.file);
          });*/
/*        var _html;
        $.get(options.pages + '/' + extension.name, function (html) {
            _html = html.html;
        });*/

        //hard coded this pard, i hate it...
        _extensionsPages[extension.id] = 'http://' + window.location.host + '/' + options.pagesUrl + '/' + extension.name + '/?urn=' + options.urn;
    }

    function loadNewViewer() {
        initializeIndex();
        initialize();
    }

    function initializeIndex(){
        _extensionsIndex = new Array();
        for(id in _selectedExtensions){
            _extensionsIndex.push(id);
        }
        console.log(_extensionsIndex);
    }

    function createGlRenderer() {
        var glRenderer = new THREE.WebGLRenderer({alpha:true});
        glRenderer.setClearColor(0xECF8FF);
        glRenderer.setPixelRatio(window.devicePixelRatio);
        glRenderer.setSize(window.innerWidth, window.innerHeight);
        glRenderer.domElement.style.position = 'absolute';
        glRenderer.domElement.style.zIndex = 1;
        glRenderer.domElement.style.top = 0;
        return glRenderer;
    }

    /*function createCssRenderer() {
        var cssRenderer = new THREE.CSS3DRenderer();
        cssRenderer.setSize(window.innerWidth, window.innerHeight);
        cssRenderer.domElement.style.position = 'absolute';
        glRenderer.domElement.style.zIndex = 0;
        cssRenderer.domElement.style.top = 0;
        return cssRenderer;
    }*/

    function createPlane(w, h, position, rotation) {
        var material = new THREE.MeshBasicMaterial({
            color: 0x000000,
            opacity: 0.0,
            side: THREE.DoubleSide
        });
        var geometry = new THREE.PlaneGeometry(w, h);
        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = position.x;
        mesh.position.y = position.y;
        mesh.position.z = position.z;
        mesh.rotation.x = rotation.x;
        mesh.rotation.y = rotation.y;
        mesh.rotation.z = rotation.z;
        return mesh;
    }

    function createCssRenderer() {
        var cssRenderer = new THREE.CSS3DRenderer();
        cssRenderer.setSize(window.innerWidth, window.innerHeight);
        cssRenderer.domElement.style.position = 'absolute';
        glRenderer.domElement.style.zIndex = 0;
        cssRenderer.domElement.style.top = 0;
        cssRenderer.domElement.style.zIndex = 2;
        return cssRenderer;
    };

    function createCssObject(w, h, position, rotation, url) {
        var html = [
            '<div style="width:' + w + 'px; height:' + h + 'px;">',
            '<iframe src="' + url + '" width="' + w + '" height="' + h + '">',
            '</iframe>',
            '</div>'
        ].join('\n');
        var div = document.createElement('div');
        $(div).html(html);
        var cssObject = new THREE.CSS3DObject(div);
        cssObject.position.x = position.x;
        cssObject.position.y = position.y;
        cssObject.position.z = position.z;
        cssObject.rotation.x = rotation.x;
        cssObject.rotation.y = rotation.y;
        cssObject.rotation.z = rotation.z;
        return cssObject;
    };

    function create3dPage(w, h, position, rotation, url){
        var plane = createPlane(
            w, h,
            position,
            rotation);
        glScene.add(plane);
        var cssObject = createCssObject(
            w, h,
            position,
            rotation,
            url);
        cssScene.add(cssObject);
    };

    function createPages() {
        var posXOffset = 0;
        var posZOffset = 0;
        var rotOffset = 0;

        console.log(_extensionsPages);


        if(mapLen % 2 === 1){
            create3dPage(
                1000,1000,
                new THREE.Vector3(0,0,-400),
                new THREE.Vector3(0,0,0),
                getUrl()
            );
            // console.log(_extensionsPages['Explorer']);
            console.log(mapLen);
            var halfLen = (mapLen-1)>>1;
            console.log(halfLen);
            var unitRot = 60 / halfLen;

            for(var i = 1; i <= halfLen; ++i){
                rotOffset += unitRot;
                posXOffset += 500 * Math.cos(rotOffset * Math.PI / 180);
                posZOffset += 500 * Math.sin(rotOffset * Math.PI / 180);
                createHalfSide(
                    1000,1000,
                    new THREE.Vector3(500 + posXOffset,0, -400 + posZOffset ),
                    new THREE.Vector3(0,-1 * rotOffset * Math.PI/180,0),
                    getUrl(),
                    getUrl()
                );
                posXOffset += 500 * Math.cos(rotOffset * Math.PI / 180);
                posZOffset += 500 * Math.sin(rotOffset * Math.PI / 180);
            }
        }else{
            var halfLen = mapLen >> 1;
            console.log(halfLen);
            var unitRot = 60 /halfLen;
            for(var i = 0; i < halfLen; ++i){
                rotOffset += unitRot;
                posXOffset += 500 * Math.cos(rotOffset * Math.PI / 180);
                posZOffset += 500 * Math.sin(rotOffset * Math.PI / 180);
                createHalfSide(
                    1000,1000,
                    new THREE.Vector3(posXOffset,0, -400 + posZOffset ),
                    new THREE.Vector3(0,-1 * rotOffset * Math.PI/180,0),
                    getUrl(),
                    getUrl()
                );

                posXOffset += 500 * Math.cos(rotOffset * Math.PI / 180);
                posZOffset += 500 * Math.sin(rotOffset * Math.PI / 180);
            }
        }
    }

    function createHalfSide(w,h,position,rotation,urlL,urlR) {
        create3dPage(w,h,position,rotation,urlL);
        create3dPage(
            w,h,
            new THREE.Vector3(-1 * position.x,0,position.z),
            new THREE.Vector3(0, -1 * rotation.y, 0),
            urlR
        );
    }

    function countLen() {
        for(var id in _selectedExtensions){
            if(_selectedExtensions[id].enabled){
                ++mapLen;
            }
        }
    }
    function getUrl() {
        var id = _extensionsIndex.pop();
        console.log(id);
        return _extensionsPages[id.toString()];
    }

    function string2Int(sIndex){
        return parseInt(sIndex);
    }

    function int2String(iIndex) {
        return iIndex.toString();
    }

    function initialize() {

        camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            1,
            10000);
        camera.position.set(0, 100, 3000);
        camera.getEffectiveFOV = function(){
            return 45;
        }

        glRenderer = createGlRenderer();
        cssRenderer = createCssRenderer();

        controls = new THREE.TrackballControls(camera);
        
        document.body.appendChild(cssRenderer.domElement);
        document.body.appendChild(glRenderer.domElement);
        glScene = new THREE.Scene();
        cssScene = new THREE.Scene();

        countLen();
        createPages();
        /*for(var id in _selectedExtensions){
            create3dPage(
                1000, 1000,
                new THREE.Vector3(-1050 * i, 0, -400),
                new THREE.Vector3(0, 0, 0),
                'http://adndevblog.typepad.com/cloud_and_mobile');
            i += 1;
        }*/
        console.log("1");
        update();
    };

    function update() {
        controls.update();
        glRenderer.render(glScene,camera);
        cssRenderer.render(cssScene, camera);
        requestAnimationFrame(update);
    };
    /////////////////////////////////////////////////////////
    //
    //
    /////////////////////////////////////////////////////////
    Autodesk.ADN.Viewing.Extension.ExtensionManager.Panel = function(
      parentContainer,
      baseId)
    {
        this.content = document.createElement('div');

        this.content.id = baseId + 'PanelContentId';
        this.content.className = 'extension-manager-panel-content';
        Autodesk.Viewing.UI.DockingPanel.call(
          this,
          parentContainer,
          baseId,
          "Extensions Manager",
          {shadow:true});

        var w = viewer.container.clientWidth;
        var h = viewer.container.clientHeight;

        this.container.style.top = "10px";
        this.container.style.left = "10px";

        this.container.style.width = Math.min(w * 75/100, 280) + 'px',
        this.container.style.height = Math.min(h * 75/100, 400) + 'px',

        this.container.style.resize = "auto";

        var html = [
            '<div class="extension-manager-panel-container" style="z-index: 1000">',
                '<input id="' + baseId +'-filter" type="text" class="form-control extension-manager-search row" placeholder="Search Extensions ...">',
                '<ul id="' + baseId + 'PanelContainerId" class="list-group extension-manager-panel-list-container">',
                '</ul>',
            '</div>'
        ].join('\n');

        $('#' + baseId + 'PanelContentId').html(html);
        /*$("#" + baseId + 'PanelContainerId').append(
            [
                '<div>',
                    '<button id = "sceneTransfer">',
                        'go',
                    '</button>',
                '</div>'
            ].join('\n')
        );*/
        $('#' + baseId + '-filter').on('input', function() {

            filterItems();
        });

        this.addExtension = function(extension) {

            var srcUrl = options.extensionsSourceUrl + '/' + extension.id + '/' + extension.file;

            var html = [

                '<li class="extension-manager-panel-row">',
                    '<a class="list-group-item extension-manager-panel-list-group-item col-md-6" id=' + extension.itemId + '>',
                        '<p class="list-group-item-text">',
                            extension.name,
                        '</p>',
                    '</a>',

                    '<a href="' + srcUrl + '" class="list-group-item extension-manager-panel-list-group-item-src col-md-2" target=_blank>',
                        '<p class="list-group-item-text">',
                            'Source',
                        '</p>',
                    '</a>',
                '</li>',

            ].join('\n');

            $('#' + baseId + 'PanelContainerId').append(html);

            $('#' + extension.itemId).click(extension.handler);

            if(extension.enabled) {
                $('#' + extension.itemId).addClass('enabled');
            }
        }

        /////////////////////////////////////////////
        //
        //
        /////////////////////////////////////////////
        this.clearExtensions = function () {

            $('#' + baseId + 'PanelContainerId > div').each(
              function (idx, child) {
                  $(child).remove();
              }
            );
        }

        /////////////////////////////////////////////
        // onTitleDoubleClick override
        //
        /////////////////////////////////////////////
        var _isMinimized = false;

        this.onTitleDoubleClick = function (event) {

            _isMinimized = !_isMinimized;

            if(_isMinimized) {

                $(this.container).css({
                    'height': '34px',
                    'min-height': '34px'
                });
            }
            else {
                $(this.container).css({
                    'height': '200px',
                    'min-height': Math.min(
                      viewer.container.clientHeight * 75/100, 400) + 'px'
                });
            }
        };

        /////////////////////////////////////////////
        //
        //
        /////////////////////////////////////////////
        function filterItems() {

            var filter = $('#' + baseId + '-filter').val();

            $("li.extension-manager-panel-row").each(function(index) {

                var $item = $(this);

                if(!filter.length || $item.text().toLowerCase().indexOf(filter.toLowerCase()) > 0) {

                    $item.css({
                        'display':'block'
                    });
                }
                else {

                    $item.css({
                        'display':'none'
                    });
                }
            });
        }
    };

    Autodesk.ADN.Viewing.Extension.ExtensionManager.Panel.prototype = Object.create(
      Autodesk.Viewing.UI.DockingPanel.prototype);

    Autodesk.ADN.Viewing.Extension.ExtensionManager.Panel.prototype.constructor =
      Autodesk.ADN.Viewing.Extension.ExtensionManager.Panel;

    Autodesk.ADN.Viewing.Extension.ExtensionManager.Panel.prototype.initialize = function()
    {
        // Override DockingPanel initialize() to:
        // - create a standard title bar
        // - click anywhere on the panel to move

        this.title = this.createTitleBar(
          this.titleLabel ||
          this.container.id);

        this.closer = this.createCloseButton();

        this.container.appendChild(this.title);
        this.title.appendChild(this.closer);
        this.container.appendChild(this.content);

        this.initializeMoveHandlers(this.title);
        this.initializeCloseHandler(this.closer);
    };

    var css = [

        'div.extension-manager-panel-content {',
            'height: calc(100% - 10px);',
        '}',

        'div.extension-manager-panel-container {',
            'height: calc(100% - 55px);',
            'margin: 10px;',
        '}',

        'div.extension-manager-panel-controls-container {',
            'margin-bottom: 10px;',
        '}',

        'ul.extension-manager-panel-list-container {',
            'height: calc(100% - 35px);',
            'overflow-y: auto;',
        '}',

        'a.extension-manager-panel-list-group-item {',
            'color: #FFFFFF;',
            'background-color: #3F4244;',
            'margin-bottom: 5px;',
            'border-radius: 4px;',
            'width: calc(100% - 115px);',
        '}',

        'a.extension-manager-panel-list-group-item-src {',
            'color: #FFFFFF;',
            'background-color: #3F4244;',
            'margin-bottom: 5px;',
            'margin-left: 5px;',
            'width: 45px;',
            'border-radius: 4px;',
        '}',

        'a.extension-manager-panel-list-group-item:hover {',
            'color: #FFFFFF;',
            'background-color: #5BC0DE;',
        '}',

        'a.extension-manager-panel-list-group-item.enabled {',
            'color: #000000;',
            'background-color: #00CC00;',
        '}',

        'li.extension-manager-panel-row {',
            'height: 45px;',
        '}',

        'input.extension-manager-search {',
            'height: 25px;',
            'margin-left: 1px;',
            'margin-bottom: 10px;',
            'width: calc(100% - 28px);',
            'background-color: #DEDEDE;',
        '}',

    ].join('\n');

    $('<style type="text/css">' + css + '</style>').appendTo('head');
};

Autodesk.ADN.Viewing.Extension.ExtensionManager.prototype =
  Object.create(Autodesk.Viewing.Extension.prototype);

Autodesk.ADN.Viewing.Extension.ExtensionManager.prototype.constructor =
  Autodesk.ADN.Viewing.Extension.ExtensionManager;

Autodesk.Viewing.theExtensionManager.registerExtension(
  'Autodesk.ADN.Viewing.Extension.ExtensionManager',
  Autodesk.ADN.Viewing.Extension.ExtensionManager);

