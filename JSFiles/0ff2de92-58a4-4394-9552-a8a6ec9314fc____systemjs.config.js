(function(global) {
    var map = {
        'app': 'js',
        '@angular': 'node_modules/@angular',
        'angular2-in-memory-web-api': 'node_modules/angular2-in-memory-web-api',
        "angular2-oauth2": "node_modules/angular2-oauth2",
        "base64-js": "node_modules/base64-js",
        "buffer": "node_modules/buffer",
        "js-base64": "node_modules/js-base64",
        "convert-hex": "node_modules/convert-hex",
        "convert-string": "node_modules/convert-string",
        'ieee754': 'node_modules/ieee754',
        'isarray': 'node_modules/isarray',
        'rxjs': 'node_modules/rxjs',
        'ng2-bs3-modal': 'node_modules/ng2-bs3-modal',
        "lodash": "node_modules/lodash/lodash.js",
        "ng2-bootstrap": "node_modules/ng2-bootstrap",
        "angular2-notifications": "node_modules/angular2-notifications",
        "moment": "node_modules/moment",
        "ng2-uploader": "node_modules/ng2-uploader",
        "ng2-dropdown": "node_modules/ng2-dropdown",
        "sha256": "node_modules/sha256"
    };

    var packages = {
        "angular2-in-memory-web-api": {main: 'index.js', defaultExtension: 'js'},
        "angular2-notifications": {main: "components.js", defaultExtension: "js"},
        "angular2-oauth2": {main: "oauth-service.js", defaultExtension: "js"},
        "app": {defaultExtension: 'js'},
        "base64-js": {main: "lib/b64.js", defaultExtension: "js"},
        "buffer": {main: "index.js", defaultExtension: "js"},
        "convert-hex": {main: "convert-hex.js", defaultExtension: "js"},
        "convert-string": {main: "convert-string.js", defaultExtension: "js"},
        "ieee754": {main: "index.js", defaultExtension: 'js'},
        "isarray": {main: "index.js", defaultExtension: 'js'},
        "js-base64": {main: "base64.js", defaultExtension: "js"},
        "moment": {main: "moment.js", defaultExtension: "js"},
        "ng2-bs3-modal": {defaultExtension: "js"},
        "ng2-bootstrap": {defaultExtension: "js"},
        "ng2-dropdown": { main: "index.js", defaultExtension: "js" },
        "ng2-uploader": {main: "ng2-uploader.js", defaultExtension: "js"},
        "rxjs": {defaultExtension: 'js'},
        "sha256": {main: "lib/sha256.js", defaultExtension: "js"}
    };

    var ngPackageNames = [
        'common',
        'compiler',
        'core',
        'forms',
        'http',
        'platform-browser',
        'platform-browser-dynamic',
        'router',
        'router-deprecated',
        'angular2-notifications',
        'upgrade',
    ];

    function packIndex(pkgName) {
        packages['@angular/' + pkgName] = {main: 'index.js', defaultExtension: 'js'};
    }

    function packUmd(pkgName) {
        packages['@angular/' + pkgName] = {main: '/bundles/' + pkgName + '.umd.js', defaultExtension: 'js'};
    }

    var setPackageConfig = System.packageWithIndex ? packIndex : packUmd;

    ngPackageNames.forEach(setPackageConfig);

    var config = {
        map: map,
        packages: packages
    };

    System.config(config);
})(this);