module.exports = function (grunt) {
    'use strict';

    var cover = require('browserify-istanbul'),

        // files options
        taskName = grunt.cli.tasks[0] || 'default',

        browserify = {
            'iframeStorage-src.js' : 'JS/Iframe/Storage/startApp.js',
            'assist-src.js': 'JS/Iframe/Assist/startApp.js',
            'chat-src.js': 'JS/Iframe/Chat/startApp.js',
            'promote-src.js': 'JS/Iframe/Promote/startApp.js',
            'panel-src.js': 'JS/Iframe/Panel/StartApp.js',
            'browserifyUtils.js': 'JS/Shared/Utils/browserifyUtilsBundle.js',
            'mainPageIncludes.js': 'JS/Shared/Utils/captureAppsBrowserify.js',
            'startCaptureApps.js': 'JS/Main/startCaptureApps.js',
            'components/prompt-src.js': 'JS/Components/Prompt/StartComponent.js',
            'components/proactive-src.js': 'JS/Components/Proactive/StartComponent.js',
            'components/productFeed-src.js': 'JS/Components/ProductFeed/StartComponent.js'
        },


        // sass = {
        //     'CSS/CaptureApps/main.scss' : temp_version_files_path + 'capture-apps-' + src_extension + file_version + '.css'
        // },

        config = {
            browserify: {
                'js/script.js': 'js/main.js'
            },
    //         eslint: {
    //             options: {
    //                 ignorePath: 'JS/.eslintignore'
    //             },
    //             target: [
    //                 'JS/**',
    //                 'Test/**'
    //             ]
    //         },
    //         scsslint: {
    //           allFiles: [
    //             'CSS/**'
    //           ],
    //           options: {
    //             config: '.scss-lint.yml',
    //             colorizeOutput: true,
    //             compact: true,
    //             maxBuffer: 1024 * 1024,
    //             force: false,
    //             exclude: [
    //                 'CSS/**/_variables.scss'
    //             ]
    //           },
    //         },
    //         copy: {
    //             tag: {
    //                 src: 'Templates/capture-tag.js',
    //                 dest: temp_tag_files_path + folder_version + '/capture-tag-' + file_version + '.js'
    //             },
    //             preview: {
    //                 src: 'Templates/capture-tag-preview.js',
    //                 dest: temp_tag_files_path + folder_version + '/capture-tag-preview-' + file_version + '.js'
    //             },
    //             tagFiles: {
    //                 expand: true,
    //                 cwd: temp_tag_files_path,
    //                 src: '**',
    //                 dest: tag_files_path
    //             },
    //             fonts: {
    //                 expand: true,
    //                 cwd: 'Fonts/',
    //                 src: '**',
    //                 dest: temp_shared_files_path + 'fonts/'
    //             },
    //             panelHtml: {
    //                 expand: true,
    //                 cwd: 'HTML/Panel/',
    //                 src: '**',
    //                 dest: temp_panel_files_path + 'HTML/Panel/'
    //             },
    //             panelFiles: {
    //                 expand: true,
    //                 cwd: temp_panel_files_path,
    //                 src: '**',
    //                 dest: panel_files_path
    //             },
    //             captureAppsCss: {
    //                 src: 'CSS/CaptureApps/capture-apps.css',
    //                 dest: temp_version_files_path + 'capture-apps-' + src_extension + file_version + '.css'
    //             },
    //             storageHtml: {
    //                 src: 'HTML/Storage/Storage.html',
    //                 dest: temp_shared_files_path + 'iframeStorage.html'
    //             },
    //             storageJs: {
    //                 src: temp_other_files_path + 'iframeStorage-src.js',
    //                 dest: temp_shared_files_path + 'iframeStorage' + (src_extension ? '-' + src_extension : '.') + 'js'
    //             },
    //             assistJs: {
    //                 src: temp_other_files_path + 'assist-src.js',
    //                 dest: temp_version_files_path + 'assist-' + src_extension + file_version + '.js'
    //             },
    //             promoteJs: {
    //                 src: temp_other_files_path + 'promote-src.js',
    //                 dest: temp_version_files_path + 'promote-' + src_extension + file_version + '.js'
    //             },
    //             chatJs: {
    //                 src: temp_other_files_path + 'chat-src.js',
    //                 dest: temp_version_files_path + 'chat-' + src_extension + file_version + '.js'
    //             },
    //             panelJs: {
    //                 src: temp_other_files_path + 'panel-src.js',
    //                 dest: temp_version_files_path + 'panel-' + src_extension + file_version + '.js'
				// },
    //             promptComponentJs: {
    //                 src: temp_other_files_path + 'components/prompt-src.js',
    //                 dest: temp_shared_files_path + 'js/components/prompt' + (src_extension ? '-' + src_extension : '.') + 'js'
    //             },
    //             proactiveComponentJs: {
    //                 src: temp_other_files_path + 'components/proactive-src.js',
    //                 dest: temp_shared_files_path + 'js/components/proactive' + (src_extension ? '-' + src_extension : '.') + 'js'
    //             },
    //             productFeedComponentJs: {
    //                 src: temp_other_files_path + 'components/productFeed-src.js',
    //                 dest: temp_shared_files_path + 'js/components/productFeed' + (src_extension ? '-' + src_extension : '.') + 'js'
    //             },
    //             staticFiles: {
    //                 expand: true,
    //                 cwd: temp_static_files_path,
    //                 src: '*/**',
    //                 dest: static_files_path
    //             }
    //         },
    //         concat: {
    //             options: {
    //                 separator: '\n'
    //             },
    //             utils: {
    //                 src: [
    //                     'JS/Shared/Utils/UtilsHeader.js',
    //                     'JS/Shared/Utils/Ajax.js',
    //                     'JS/Shared/Utils/Modules.js'
    //                 ],
    //                 dest: temp_other_files_path + 'Utils.js'
    //             },
    //             version: {
    //                 src: ['JS/Main/version.json'],
    //                 dest: temp_other_files_path + 'version.js',
    //                 options: {
    //                     banner: 'var VeAPI = {\nversion: ',
    //                     footer: '\n};',
    //                     separator: ''
    //                 }
    //             },
    //             capture_apps: {
    //                 src: [
    //                     temp_other_files_path + 'version.js',
    //                     'JS/Main/SharedHeader.js',
    //                     // Globals
    //                     'JS/Main/Globals.js',

    //                     'JS/Main/CaptureAppsHeader.js',
    //                     'JS/Main/Capture/VEjQuery.js',
    //                     temp_other_files_path + 'Utils.js',
    //                     temp_other_files_path + 'mainPageIncludes.js',
    //                     'JS/Shared/Classes/ConsoleOverwrite.js',
    //                     'JS/Shared/Classes/QueueManager.js',
    //                     'JS/Shared/Utils/Promocode.js',
    //                     'JS/Shared/Utils/TimerManager.js',

    //                     // Apps Manager Block.
    //                     'JS/Main/AppState/AppsManager.js',
    //                     'JS/Main/AppState/AppsManagerControls.js',
    //                     'JS/Main/AppState/OnEvent.js',
    //                     'JS/Main/AppState/Status.js',
    //                     'JS/Main/AppState/RegisterApp.js',

    //                     // App Block.
    //                     'JS/Main/Apps/DragManager.js',
    //                     'JS/Main/Apps/AppPositioner.js',
    //                     'JS/Main/Apps/AppMarkupBuilder.js',

    //                     'JS/Main/VeAPI.js',
    //                     'JS/Main/Capture/CustomEvents.js',
    //                     'JS/Main/Capture/VeCompliance.js',
    //                     'JS/Main/Capture/CaptureData.js',
    //                     'JS/Main/Capture/CaptureApi.js',
    //                     'JS/Main/Capture/CapturedFormMapping.js',
    //                     'JS/Main/Capture/FormMappingBuilder.js',
    //                     'JS/Main/Capture/FormMapping.js',
    //                     'JS/Main/Capture/FormChangeStatus.js',
    //                     'JS/Main/Capture/FormIdentifier.js',
    //                     'JS/Main/Capture/FormManager.js',
    //                     'JS/Main/CaptureCore.js',
    //                     'JS/Main/AppsCore.js',
    //                     'JS/Main/Capture/KlarnaIntegration.js',
    //                     'JS/Main/Apps/Agents/CriteriaFilters.js',
    //                     'JS/Main/Apps/Agents/AgentManager.js',

    //                     // Events Manager Block.
    //                     'JS/Main/PopEvents/PopEvents.js',
    //                     'JS/Main/PopEvents/BackButton.js',
    //                     'JS/Main/PopEvents/IframeBackButton.js',
    //                     'JS/Main/PopEvents/PushStateBackButton.js',
    //                     'JS/Main/PopEvents/ExitIntent.js',
    //                     'JS/Main/PopEvents/Exit.js',
    //                     'JS/Main/PopEvents/Inactivity.js',
    //                     'JS/Main/PopEvents/Load.js',
    //                     // 'JS/Main/PopEvents/EventsManagerFooter.js',

    //                     // Settings Manager Block.
    //                     'JS/Main/AppState/Settings/SettingsManagerHeader.js',
    //                     'JS/Main/AppState/Settings/DelayingSettings.js',
    //                     'JS/Main/AppState/Settings/PausingSettings.js',
    //                     'JS/Main/AppState/Settings/StoppingSettings.js',
    //                     'JS/Main/AppState/Settings/SettingsManagerFooter.js',

    //                     // This file should do the entire kick off.
    //                     // We still have self-running files above here :(
    //                     temp_other_files_path + 'startCaptureApps.js',

    //                     'JS/Main/SharedFooter.js'
    //                 ],
    //                 dest: temp_version_files_path + 'capture-apps-' + src_extension + file_version + '.js'
    //             }
    //         },
    //         uglify: {
    //             dist: {
    //                 files: {
    //                     // Set in addUglifyConfig method.
    //                 }
    //             }
    //         },
    //         cssmin: {
    //             // Set in addUglifyConfig method.
    //         },
    //         clean: {
    //             js: [
    //                 'Temp'
    //             ]
    //         },
    //         watch: {
    //             scripts: {
    //                 files: [
    //                     'JS/**/*',
    //                     'CSS/**/*'
    //                 ],
    //                 tasks: ['dev-local']
    //             }
    //         },
    //         karma: {
    //             unit: {
    //                 configFile: 'karma.conf.js',
    //                 singleRun: true,
    //                 autoWatch: false,
    //                 reporters: ['progress', 'junit', 'coverage'],
    //                 junitReporter: {
    //                     outputFile: 'tests-result.xml'
    //                 },
    //                 browserify: {
    //                     debug: false,
    //                     plugin: ['proxyquire-universal'],
    //                     bundleDelay: 3000,
    //                     configure: function (bundle) {
    //                         bundle.on('prebundle', function () {
    //                             bundle.transform(cover({
    //                                 ignore: ['**/node_modules/**', 'Test/**', '**/Test/**']
    //                             }));
    //                         });
    //                     }
    //                 },
    //                 browsers: ['PhantomJS'],
    //                 logLevel: 'DEBUG'
    //             }
    //         },
    //         sass: {
    //           dev: {
    //             files: {
    //                 // Set in addSassConfig method.
    //             }
    //           }
    //         },
    //         postcss: {
    //             options: {
    //                 processors: [
    //                     require('autoprefixer-core')() // add vendor prefixes
    //                 ]
    //             },
    //             panelCss: {
    //                 expand: true,
    //                 cwd: 'CSS/Panel/',
    //                 src: '**/*.scss',
    //                 dest: temp_panel_files_path + 'CSS/Panel/'
    //             }
    //         }
        };

    /**
     * Dynamically adds the files to browserify from the given browserify object. It is used to be able to create a path from a variable.
     *
     * @param {Object} browserify - Object containing all the files to browserify
     * @param {Object} object - Object where to store the files to browserify
     * @param {Object} path - The path where the generated files should go
     */
    // function addBrowserifyConfig(browserify, object, path) {
    //     var key;

    //     for (key in browserify) {
    //         object[path + key] = browserify[key];
    //     }
    // }

    /**
     * Dynamically adds the files to browserify from the given browserify object. It is used to be able to create a path from a variable.
     *
     * @param {Object} browserify - Object containing all the files to browserify
     * @param {Object} object - Object where to store the files to browserify
     * @param {Object} path - The path where the generated files should go
     */
    // function addSassConfig(sass, object) {
    //     var key;

    //     for (key in sass) {
    //         object[sass[key]] = key;
    //     }
    // }

    /*
     * Gets all the files asynchronously and parse the result to give relative paths based on the given path
     * @Param {String} path - the folder path when to look for files
     */
    // function getAllFiles(path) {
    //     var newfiles = recursiveReaddirSync(path),
    //         max,
    //         i;

    //     for (i = 0, max = newfiles.length; i < max; i++) {
    //         newfiles[i] = newfiles[i].replace(/\\/gi, '/', 'gi');
    //         newfiles[i] = newfiles[i].replace(path, '');
    //     }

    //     return newfiles;
    // }

    /**
     * Creates dynamically the destination of minimized files from the files present in the given repositories.
     *
     * @param {Array} pathsArray - Array of folders to get files to minimize.
     * @param {Object} objectJS - Where to add the JS files to uglify.
     * @param {objectCSS} objectJS - Where to add the CSS files to uglify.
     */
    // function addUglifyConfig(pathsArray, objectJS, objectCSS) { //TODO: move to separate file, add unit tests and import via require.
    //     var i,
    //         j,
    //         files,
    //         currentPath,
    //         currentFile,
    //         newFileName,
    //         objectName;

    //     for (i = pathsArray.length - 1; i >= 0; i--) {
    //         currentPath = pathsArray[i];
    //         files = getAllFiles(currentPath);

    //         for (j = files.length - 1; j >= 0; j--) {
    //             currentFile = files[j];

    //             newFileName = currentFile.replace(new RegExp('\\-' + src_extension_regexp + '(.+)'), '-$1');
    //             newFileName = newFileName.replace(/\-(js|css)$/, '.$1');

    //             if (currentFile.indexOf('.js') !== -1) {
    //                 objectJS[currentPath + newFileName] = currentPath + currentFile;
    //             } else if (currentFile.indexOf('.css') !== -1) {
    //                 objectName = newFileName.split('-' + src_extension_regexp)[0];
    //                 objectCSS[objectName] = {
    //                     src: currentPath + currentFile,
    //                     dest: currentPath + newFileName
    //                 };
    //             }
    //         }
    //     }
    // }

    /**
     * Adds the nonulls = true flag to each bundle, to add warnings for missing files
     *
     * @param {Object} config - config is the configuration of concat and uglify task.
     */
    // function warnOnMissingFiles(config) {
    //     var bundleDefinition,
    //         bundle;

    //     for (bundleDefinition in config.concat) {
    //         bundle = config.concat[bundleDefinition];
    //         if (!!bundle.dest) {
    //             bundle.nonull = true;
    //         }
    //     }
    // }

    // addBrowserifyConfig(browserify, config.browserify, temp_other_files_path);
    // addSassConfig(sass, config.sass.dev.files);
    // warnOnMissingFiles(config);
    grunt.initConfig(config);

    // grunt.loadNpmTasks('grunt-contrib-cssmin');
    // grunt.loadNpmTasks('grunt-contrib-copy');
    // grunt.loadNpmTasks('grunt-contrib-uglify');
    // grunt.loadNpmTasks('grunt-contrib-concat');
    // grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-browserify');
    // grunt.loadNpmTasks('grunt-contrib-watch');
    // grunt.loadNpmTasks('grunt-eslint');
    // grunt.loadNpmTasks('grunt-karma');
    // grunt.loadNpmTasks('grunt-contrib-sass');
    // grunt.loadNpmTasks('grunt-scss-lint');
    // grunt.loadNpmTasks('grunt-postcss');

    // Need a task to run minification after the copy to the Temp folders have been done
    // grunt.task.registerTask('addMinfication', 'Task to add JS/CSS files to uglify/minify to the config object', function() {
    //     addUglifyConfig([temp_version_files_path, temp_shared_files_path], config.uglify.dist.files, config.cssmin);
    //     grunt.log.writeln(this.name + ", JS/CSS files to uglify.minify added.");
    // });

    // Group by type task
    // grunt.registerTask('linting',                   ['scsslint', 'eslint']);
    // grunt.registerTask('tests',                     ['karma']);
    // grunt.registerTask('check',                     ['linting', 'tests']);
    // grunt.registerTask('generate-files',            [
    //                                                     'browserify',
    //                                                     'concat',
    //                                                     'copy:tag',
    //                                                     'copy:preview',
    //                                                     'copy:fonts',
    //                                                     'postcss:panelCss',
    //                                                     'copy:panelHtml',
    //                                                     'sass',
    //                                                     'copy:storageHtml',
    //                                                     'copy:storageJs',
    //                                                     'copy:assistJs',
    //                                                     'copy:chatJs',
    //                                                     'copy:panelJs',
    //                                                     'copy:promoteJs',
    //                                                     'copy:promptComponentJs',
    //                                                     'copy:proactiveComponentJs',
    //                                                     'copy:productFeedComponentJs'
    //                                                 ]);

    // grunt.registerTask('minify-uglify-files',       ['addMinfication', 'cssmin', 'uglify']);
    // grunt.registerTask('copy-clean-files',          ['copy:tagFiles', 'copy:staticFiles', 'copy:panelFiles', 'clean']);

    // Group type of deployments
    // grunt.registerTask('generateMinifiedVersion',   ['check', 'generate-files', 'minify-uglify-files', 'copy-clean-files']);
    // grunt.registerTask('generateSourceVersion',     ['generate-files', 'copy-clean-files']);

    // Tasks to generate file depending on environment.
    grunt.registerTask('default',                   ['browserify']);
    // grunt.registerTask('dev',                       ['generateSourceVersion']);
};
