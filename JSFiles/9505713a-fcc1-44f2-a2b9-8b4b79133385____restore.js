#!/usr/bin/env node

var fs = require('fs'),
    path = require('path'),
    exec = require('child_process').exec,
    xcode = require('xcode'),
    plist = require('plist'),
    _ = require('underscore'),
    util = require('util'),
    xcconfig,
    codeSignJSON,
    xcBuildConfiguration,
    nativeTarget,
    projects,
    projectName,
    projectTargetId,
    extensionName,
    extensionTargetId,
    targetId,
    projectId,
    pbxPath,
    xcodeproj
f = util.format;
const swiftVersion = "3.0",
    swiftPattern = /([\s\S]*)(SWIFT_VERSION)[\s|\t]*=[\s|\t]*([0-9|\.]*)([\s\S]*)/,
    swiftOldPattern = /([\s\S]*)(SWIFT_OLD_VERSION)[\s|\t]*=[\s|\t]*([0-9|\.]*)([\s\S]*)/,
    teamPattern = /([\s\S]*)(DEVELOPMENT_TEAM)[\s|\t]*=[\s|\t]*([A-Z|0-9]*)([\s\S]*)/,
    encoding = 'utf-8',
    filepath = 'platforms/ios/cordova/build.xcconfig',
    nonCli = '__NON-CLI__',
    patchProjectFile = './custom_plugins/com.kcchen.sharingfrom/hooks/patches/projectFile.js.patch',
    patchPbxProject = './custom_plugins/com.kcchen.sharingfrom/hooks/patches/pbxProject.js.patch',
    COMMENT_KEY = /_comment$/,
    FILETYPE_BY_EXTENSION = {
        a: 'archive.ar',
        app: 'wrapper.application',
        appex: 'wrapper.app-extension',
        bundle: 'wrapper.plug-in',
        dylib: 'compiled.mach-o.dylib',
        framework: 'wrapper.framework',
        h: 'sourcecode.c.h',
        m: 'sourcecode.c.objc',
        markdown: 'text',
        mdimporter: 'wrapper.cfbundle',
        octest: 'wrapper.cfbundle',
        pch: 'sourcecode.c.h',
        plist: 'text.plist.xml',
        sh: 'text.script.sh',
        swift: 'sourcecode.swift',
        tbd: 'sourcecode.text-based-dylib-definition',
        xcassets: 'folder.assetcatalog',
        xcconfig: 'text.xcconfig',
        xcdatamodel: 'wrapper.xcdatamodel',
        xcodeproj: 'wrapper.pb-project',
        xctest: 'wrapper.cfbundle',
        xib: 'file.xib'
    };

module.exports = function (context) {



    // console.log('> check ios... ' + (context.opts.cordova.platforms.indexOf('ios') != -1))
    if (context.opts.cordova.platforms.indexOf('ios') === -1) return;


    console.log('#################### BEFORE PLUGIN SHARINGFROM REMOVE ####################')


    if (openXcConfig()) {
        // removeSwiftVersion()
        // removeDevelopmentTeam()
        fs.writeFileSync(filepath, xcconfig, encoding)
    }
    if (prepare()) {
        removeManualSigining()
        removeTargetDependency(extensionTargetId, 'CordovaLib')
        removeExtensionBuildFlag()
        removeAllBuildPhase()
        removeExtensionTarget(extensionName, 'app_extension')
        // removeNoncli()
        fs.writeFileSync(pbxPath, xcodeproj.writeSync());
    }
    applyPatchBack([patchProjectFile]) // applyPatchBack([patchPbxProject, patchProjectFile])


    console.log('-------------------- BEFORE PLUGIN SHARINGFROM REMOVE FINISHED --------------------')

    return




    function prepare() {


        if (!openXcodeProj()) return false;
        if (!openCodeSignJSON()) return false;

        try {

            xcBuildConfiguration = xcodeproj.pbxXCBuildConfigurationSection()
            nativeTarget = xcodeproj.pbxNativeTargetSection()
            projects = xcodeproj.pbxProjectSection()

        } catch (e) {
            console.log('> check filepath... ' + pbxPath + " not existed.")
            console.error(e)
            return false
        }

        var
            nativeTargets = xcodeproj.pbxNativeTargetSection()

        if (_.size(projects) / 2 === 1) {
            projectName = xcodeproj.getFirstTarget().firstTarget.name.replace(/\"/g, '')
            targetId = xcodeproj.getFirstTarget().firstTarget.buildConfigurationList
            projectId = _.keys(projects)[0]
            console.log("> get Project Name... " + projectName)
            console.log("> get Project ID... " + projectId)
            console.log("> get Target ID... " + targetId)
        } else {
            throw new Error('The project and target not only ONE, currently no support for multiple projects.');
        }

        for (var key in nativeTargets) {
            if (!nativeTargets[key].name) continue
            if (nativeTargets[key].name.indexOf(extensionName) !== -1) {
                extensionTargetId = key
                console.log("> get " + extensionName + " uuid... " + key)
            }
            if (nativeTargets[key].name.indexOf(projectName) !== -1) {
                projectTargetId = key
                console.log("> get " + projectName + " uuid... " + key)
            }
        }

        return true
    }

    function openXcodeProj() {
        pbxPath = getXcodeProjectPath(context)
        if (!pbxPath) return false
        console.log('> get Project Path... ' + pbxPath);
        xcodeproj = xcode.project(pbxPath);
        xcodeproj.parseSync();
        return true
    }

    function openXcConfig() {
        try {
            xcconfig = fs.readFileSync(filepath, encoding);
            console.log("> check filepath [" + filepath + "]... " + !(!xcconfig))
        } catch (e) {
            console.error("> check filepath [" + filepath + "]... NOT EXISTED.")
            console.error(e)
            return
        }
        return !(!xcconfig);
    }

    function removeSwiftVersion() {
        xcconfig = xcconfig.replace(/^\s*[\r\n]/gm, '\n')
        var matchesOld = xcconfig.match(swiftOldPattern)
        if (matchesOld) {
            printRegEx(matchesOld)
            var matches = xcconfig.match(swiftPattern)
            if (matches) {
                if (matchesOld[3] == matches[3]) {
                    xcconfig =
                        matches[1] +
                        matches[4]
                } else {
                    xcconfig =
                        matches[1] +
                        matches[2] +
                        " = " +
                        matchesOld[3] +
                        matches[4]
                }

                matchesOld = xcconfig.match(swiftOldPattern)
                console.log('> replace SWIFT_VERSION... ' + matches[2] + " = " + matchesOld[3])
                printRegEx(matchesOld)
                xcconfig =
                    matchesOld[1] +
                    matchesOld[4]
                console.log('@ REMOVE  SWIFT_OLD_VERSION... ' + matchesOld[2] + " = " + matches[3])
            } else {
                // should not happen
            }
        } else {
            // not set SWIFT_OLD_VERSION, remove SWIFT_VERSION
            // var matches = xcconfig.match(swiftPattern)
            // xcconfig += '\n' + versionString + ' = ' + version;
            // console.log('> save SWIFT_VERSION... ' + swiftVersion)
        }
    }


    function removeDevelopmentTeam() {
        matches = xcconfig.match(teamPattern)
        if (matches) {
            xcconfig =
                matches[1] +
                matches[4]
        }
    }

    function openCodeSignJSON() {
        try {
            codeSignJSON = require('./codeSign.json');
            console.log("> check codeSign.json ... " + !(!codeSignJSON))
            extensionName = codeSignJSON.extension.name
        } catch (e) {
            console.error("> check codeSign.json ... NOT EXISTED.")
            console.error(e)
            return false
        }
        return !(!codeSignJSON);
    }

    function removeManualSigining() {
        _.filter(
            xcodeproj.hash.project.objects['XCBuildConfiguration'],
            function (entry, id, context) {
                if (!entry.buildSettings || !entry.buildSettings.PRODUCT_NAME) return
                for (target in codeSignJSON) {
                    if (!codeSignJSON[target].name && codeSignJSON[target].name != 'extension') continue
                    for (build in codeSignJSON[target]) {
                        if (entry.buildSettings.PRODUCT_NAME.indexOf(codeSignJSON[target].name) != -1 && entry.name.indexOf(build) != -1) {
                            for (item in codeSignJSON[target][build]) {
                                delete xcodeproj.hash.project.objects['XCBuildConfiguration'][id].buildSettings[item]
                                console.log("> remove " + item + " : " + codeSignJSON[target][build][item] + " from " + target + " / " + build)
                            }
                            delete xcodeproj.hash.project.objects['XCBuildConfiguration'][id].buildSettings['DEVELOPMENT_TEAM']
                        }
                    }
                }
            }
        )

        for (project in projects) {
            if (!projects[project].targets) continue
            for (target of projects[project].targets) {
                if (!projects[project].attributes)
                    projects[project]['attributes'] = {}
                if (!projects[project].attributes['TargetAttributes'])
                    projects[project].attributes['TargetAttributes'] = {}
                if (!projects[project].attributes['TargetAttributes'][target.value])
                    projects[project].attributes['TargetAttributes'][target.value] = {}
                if (target.comment.indexOf(codeSignJSON['extension'].name) != -1) {
                    delete projects[project].attributes['TargetAttributes'][target.value]
                    console.log("> remove Manual Signing to " + target.value)
                }
            }
        }
        console.log("> END removeManualSigining...")

    }

    function removeTargetDependency(targetId, dependencyName) {

        var pbxTargetDependency = 'PBXTargetDependency',
            pbxContainerItemProxy = 'PBXContainerItemProxy',
            projectXcodeproj = dependencyName + '.xcodeproj',
            pbxTargetDependencySection = xcodeproj.hash.project.objects[pbxTargetDependency],
            pbxContainerItemProxySection = xcodeproj.hash.project.objects[pbxContainerItemProxy],
            pbxFileReferenceSection = xcodeproj.pbxFileReferenceSection(),
            nativeTargets = xcodeproj.pbxNativeTargetSection(),
            removeProxyKey,
            removeDependencyKey,
            isMultipleDependency = false,
            count = 0;


        for (key in pbxTargetDependencySection) {
            // console.log(pbxTargetDependencySection[key])
            if (pbxTargetDependencySection[key].name) {
                if (pbxTargetDependencySection[key].name.indexOf(dependencyName) != -1) {
                    count++
                }
            } else if (pbxTargetDependencySection[key].target_comment) {
                if (pbxTargetDependencySection[key].target_comment.indexOf(dependencyName) != -1) {
                    count++
                }
            }
        }

        if (count == 1) {
            isMultipleDependency = false
        } else if (count > 1) {
            isMultipleDependency = true
        } else {
            console.error("> " + dependencyName + " can not be found in TargetDependency Section.")
            return
        }

        console.log("> " + dependencyName + " is multiple entry? " + isMultipleDependency)

        for (key in pbxTargetDependencySection) {
            if (pbxTargetDependencySection[key].name) {
                if (pbxTargetDependencySection[key].name.indexOf(dependencyName) != -1) {
                    if (isMultipleDependency) {
                        var hasComment = false;
                        for (k in pbxTargetDependencySection) {
                            if (k.indexOf(key + '_comment') != -1) {
                                hasComment = true
                            }
                        }
                        if (hasComment) {
                            continue
                        } else {
                            removeDependencyKey = key
                            removeProxyKey = pbxTargetDependencySection[key].targetProxy
                            console.log("> remove " + pbxTargetDependency + " key:" + key + " from... " + hasComment)
                            // console.log(pbxTargetDependencySection)
                            delete pbxTargetDependencySection[key]
                        }
                    } else {
                        removeDependencyKey = key
                        removeProxyKey = pbxTargetDependencySection[key].targetProxy
                        console.log("> remove " + pbxTargetDependency + " key:" + key + " from... ")
                        console.log(pbxTargetDependencySection)
                        delete pbxTargetDependencySection[key]
                        break
                    }
                }
            } else if (pbxTargetDependencySection[key].target_comment) {
                if (pbxTargetDependencySection[key].target_comment.indexOf(dependencyName) != -1) {
                    if (isMultipleDependency) {
                        var hasComment = false;
                        for (k in pbxTargetDependencySection) {
                            if (k.indexOf(key + '_comment') != -1) {
                                hasComment = true
                            }
                        }
                        if (hasComment) {
                            continue
                        } else {
                            removeDependencyKey = key
                            removeProxyKey = pbxTargetDependencySection[key].targetProxy
                            console.log("> remove " + pbxTargetDependency + " key:" + key + " from... " + hasComment)
                            // console.log(pbxTargetDependencySection)
                            delete pbxTargetDependencySection[key]
                        }
                    } else {
                        removeDependencyKey = key
                        removeProxyKey = pbxTargetDependencySection[key].targetProxy
                        console.log("> remove " + pbxTargetDependency + " key:" + key + " from... ")
                        console.log(pbxTargetDependencySection)
                        delete pbxTargetDependencySection[key]
                        break
                    }
                }
            }
        }

        for (key in pbxContainerItemProxySection) {
            if (!pbxContainerItemProxySection[key].containerPortal) continue
            if (key === removeProxyKey) {
                console.log("> remove " + pbxContainerItemProxy + " key:" + key + " from... ")
                // console.log(pbxContainerItemProxySection)
                delete pbxContainerItemProxySection[key]
            }
        }


        if (nativeTargets[targetId] && nativeTargets[targetId].dependencies) {
            for (index in nativeTargets[targetId].dependencies) {
                console.log("> index:" + index + ' targetId:' + targetId)
                // console.log(nativeTargets[targetId].dependencies[index])
                if (!nativeTargets[targetId].dependencies || !nativeTargets[targetId].dependencies[index]) {
                    continue
                } else {
                    if (nativeTargets[targetId].dependencies[index] && nativeTargets[targetId].dependencies[index]['value'] === removeDependencyKey) {
                        console.log("> remove nativeTargets dependencies key:" + removeDependencyKey + " from... " + index)
                        console.log(nativeTargets[targetId].dependencies)
                        nativeTargets[targetId].dependencies.splice(index, 1)
                        // console.log(nativeTargets[targetId].dependencies)
                    }
                }
            }
        }
        console.log("> END removeTargetDependency...")
    }

    function removeExtensionBuildFlag() {
        _.filter(
            xcodeproj.hash.project.objects['XCBuildConfiguration'],
            function (entry, id, context) {
                if (!entry.buildSettings || !entry.buildSettings.PRODUCT_NAME) return
                if (entry.buildSettings.PRODUCT_NAME.indexOf(extensionName) != -1) {
                    console.log("> remove ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES from " + id +
                        " | " + entry.buildSettings.PRODUCT_NAME +
                        "  " + projectName +
                        " / " + extensionName
                    )
                    console.log("> remove ALWAYS_SEARCH_USER_PATHS from " + id +
                        " | " + entry.buildSettings.PRODUCT_NAME +
                        "  " + projectName +
                        " / " + extensionName
                    )
                    delete entry.buildSettings.ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES
                    delete entry.buildSettings.ALWAYS_SEARCH_USER_PATHS
                }
            }
        )
        console.log("> END removeExtensionBuildFlag...")
    }

    function removeAllBuildPhase() {

        removeBuildPhase(
            ['com.kcchen.sharingfrom/ShareViewController.swift'],
            'PBXSourcesBuildPhase',
            extensionTargetId
        )

        removeBuildPhase(
            ['MainInterface.storyboard'],
            'PBXResourcesBuildPhase',
            extensionTargetId
        )

    }

    function producttypeForTargettype(targetType) {

        PRODUCTTYPE_BY_TARGETTYPE = {
            application: 'com.apple.product-type.application',
            app_extension: 'com.apple.product-type.app-extension',
            bundle: 'com.apple.product-type.bundle',
            command_line_tool: 'com.apple.product-type.tool',
            dynamic_library: 'com.apple.product-type.library.dynamic',
            framework: 'com.apple.product-type.framework',
            static_library: 'com.apple.product-type.library.static',
            unit_test_bundle: 'com.apple.product-type.bundle.unit-test',
            watch_app: 'com.apple.product-type.application.watchapp',
            watch_extension: 'com.apple.product-type.watchkit-extension'
        };

        return PRODUCTTYPE_BY_TARGETTYPE[targetType]
    }

    function filetypeForProducttype(productType) {

        FILETYPE_BY_PRODUCTTYPE = {
            'com.apple.product-type.application': '"wrapper.application"',
            'com.apple.product-type.app-extension': '"wrapper.app-extension"',
            'com.apple.product-type.bundle': '"wrapper.plug-in"',
            'com.apple.product-type.tool': '"compiled.mach-o.dylib"',
            'com.apple.product-type.library.dynamic': '"compiled.mach-o.dylib"',
            'com.apple.product-type.framework': '"wrapper.framework"',
            'com.apple.product-type.library.static': '"archive.ar"',
            'com.apple.product-type.bundle.unit-test': '"wrapper.cfbundle"',
            'com.apple.product-type.application.watchapp': '"wrapper.application"',
            'com.apple.product-type.watchkit-extension': '"wrapper.app-extension"'
        };

        return FILETYPE_BY_PRODUCTTYPE[productType]
    }

    function unquoted(text) {
        return text.replace(/(^")|("$)/g, '')
    }

    function defaultExtension(filetype) {
        for (var extension in FILETYPE_BY_EXTENSION) {
            if (FILETYPE_BY_EXTENSION.hasOwnProperty(unquoted(extension))) {
                if (FILETYPE_BY_EXTENSION[unquoted(extension)] === filetype)
                    return extension;
            }
        }
    }

    function removeExtensionTarget(name, targetType) {
        var pbxProjectSection = xcodeproj.pbxProjectSection(),
            productsGroup = xcodeproj.pbxGroupByName('Products');

        if (!producttypeForTargettype(targetType)) {
            throw new Error("Target type invalid: " + targetType);
        }

        removeTargetDependency(projectTargetId, name)
        removeFromPbxProjectSection(extensionTargetId)


        console.log("> get productFile...")
        console.log(productsGroup)
        console.log("> get productName..." + name)

        var productType = producttypeForTargettype(targetType)
        console.log("> get productType..." + productType)

        var productFileType = filetypeForProducttype(productType).replace(/[\"|\']/g, '')
        console.log("> get productFileType..." + productFileType)

        var productFileName = name + '.' + defaultExtension(productFileType);
        console.log("> get productFileName..." + productFileName)

        removeFromProduct(productsGroup, productFileName)
        removeFromBuildConfiguration(extensionName)
        removeNativeTarget(extensionName)
        removeNoncli()
    }

    function removeNativeTarget(name) {
        var pbxNativeTargetSection = xcodeproj.pbxNativeTargetSection()
        for (key in pbxNativeTargetSection) {
            if (!pbxNativeTargetSection[key].name) {
                continue
            } else {
                if (pbxNativeTargetSection[key].name.indexOf(name) != -1) {
                    console.log("> remove native target ..." + key)
                    delete pbxNativeTargetSection[key]
                    var commentKey = f("%s_comment", key);
                    if (pbxNativeTargetSection[commentKey] != undefined) {
                        console.log("> remove native target comment ..." + commentKey)
                        delete pbxNativeTargetSection[commentKey];
                    }
                }
            }
        }
    }

    function removeFromBuildConfiguration(name) {
        var pbxXCBuildConfigurationSection = xcodeproj.pbxXCBuildConfigurationSection(),
            pbxXCConfigurationList = xcodeproj.pbxXCConfigurationList()

        for (key in pbxXCBuildConfigurationSection) {
            if (!pbxXCBuildConfigurationSection[key].buildSettings || !pbxXCBuildConfigurationSection[key].buildSettings.PRODUCT_NAME) {
                continue
            } else {
                if (pbxXCBuildConfigurationSection[key].buildSettings.PRODUCT_NAME.indexOf(name) != -1) {
                    console.log("> remove build configuration ..." + key)
                    delete pbxXCBuildConfigurationSection[key]
                    var commentKey = f("%s_comment", key);
                    if (pbxXCBuildConfigurationSection[commentKey] != undefined) {
                        console.log("> remove build configuration comment ..." + commentKey)
                        delete pbxXCBuildConfigurationSection[commentKey];
                    }
                }
            }
        }

        for (commentKey in pbxXCConfigurationList) {
            if (!COMMENT_KEY.test(commentKey)) continue
            if (pbxXCConfigurationList[commentKey].indexOf(name) != -1) {
                console.log("> remove build configuration list comment..." + commentKey)
                delete pbxXCConfigurationList[commentKey]
                var key = commentKey.split(COMMENT_KEY)[0]
                if (pbxXCConfigurationList[key] != undefined) {
                    console.log("> remove build configuration comment ..." + key)
                    delete pbxXCConfigurationList[key];
                }
            }
        }
    }

    function removeFromProduct(productsGroup, productFileName) {
        var productKey, removeIndex
        if (productsGroup.children) {
            for (key in productsGroup.children) {
                if (productsGroup.children[key].comment.indexOf(productFileName) != -1) {
                    productKey = productsGroup.children[key]['value']
                    removeIndex = key
                }
            }
            console.log("> remove " + productFileName + " reference from PRODUCT Group ..." + productKey)
            if (productKey) productsGroup.children.splice(removeIndex, 1)
        }
        removeFromFileReference(productKey)
        removeFromBuildFile(productKey)
        removeBuildPhase([], 'PBXCopyFilesBuildPhase', projectTargetId)

    }

    function removeFromBuildFile(fileKey) {
        console.log("> remove build file ..." + fileKey)
        for (key in xcodeproj.pbxBuildFileSection()) {
            if (!xcodeproj.pbxBuildFileSection()[key].fileRef) {
                continue
            } else {
                if (xcodeproj.pbxBuildFileSection()[key].fileRef === fileKey) {
                    delete xcodeproj.pbxBuildFileSection()[key];
                    var commentKey = f("%s_comment", key);
                    if (xcodeproj.pbxBuildFileSection()[commentKey] != undefined) {
                        console.log("> remove build file comment ..." + commentKey)
                        delete xcodeproj.pbxBuildFileSection()[commentKey];
                    }
                }
            }
        }
    }

    function removeFromFileReference(fileKey) {
        console.log("> remove file reference ..." + fileKey)
        delete xcodeproj.pbxFileReferenceSection()[fileKey];
        var commentKey = f("%s_comment", fileKey);
        if (xcodeproj.pbxFileReferenceSection()[commentKey] != undefined) {
            console.log("> remove file reference comment ..." + commentKey)
            delete xcodeproj.pbxFileReferenceSection()[commentKey];
        }
    }

    function addToPbxFileReferenceSection(file) {
        var commentKey = f("%s_comment", file.fileRef);

        this.pbxFileReferenceSection()[file.fileRef] = pbxFileReferenceObj(file);
        this.pbxFileReferenceSection()[commentKey] = pbxFileReferenceComment(file);
    }

    function removeFromPbxCopyfilesBuildPhase(file) {
        var sources = xcodeproj.buildPhaseObject('PBXCopyFilesBuildPhase', 'Copy Files', file.target);
        sources.files.push(pbxBuildPhaseObj(file));
    }

    function removeFromPbxProjectSection(targetId) {
        // console.log("> removeFromPbxProjectSection: " + targetId)
        // console.log(xcodeproj.pbxProjectSection()[xcodeproj.getFirstProject()['uuid']]['targets'])
        var buildPhaseObject
        for (key in xcodeproj.pbxProjectSection()[xcodeproj.getFirstProject()['uuid']]['targets']) {
            console.log("> remove from PbxProjectSection: " + targetId + " | " + xcodeproj.pbxProjectSection()[xcodeproj.getFirstProject()['uuid']]['targets'][key]['value'])
            if (xcodeproj.pbxProjectSection()[xcodeproj.getFirstProject()['uuid']]['targets'][key]['value'] == targetId) {

                xcodeproj.pbxProjectSection()[xcodeproj.getFirstProject()['uuid']]['targets'].splice(key, 1)
            }
        }
    }

    function removeNoncli() {
        var
            pbxXCConfigurationList = xcodeproj.pbxXCConfigurationList()
        try {
            projects[projectId].buildConfigurationList_comment = projects[projectId].buildConfigurationList_comment.replace(projectName, "__NON-CLI__")
            console.log("> update __NON-CLI__..." + projects[projectId].buildConfigurationList_comment);

            var commentKey = f("%s_comment", projects[projectId].buildConfigurationList);
            pbxXCConfigurationList[commentKey] = pbxXCConfigurationList[commentKey].replace(projectName, "__NON-CLI__")
            console.log("> update __NON-CLI__..." + pbxXCConfigurationList[commentKey]);
        } catch (e) {
            throw new Error('Replace __NON-CLI__ failed');
        }
    }

    function compareFiles(fileArray, jsonArray) {
        console.log()
        var isEqual = true
        for (file of fileArray) {
            var isContain = false
            var i = file.indexOf('/')
            var filename
            if (i != -1) {
                filename = file.substring(i + 1)
            } else {
                filename = file
            }
            // console.log("> filename = " + filename)

            for (entry of jsonArray) {
                if (!entry.comment) {
                    continue
                } else {
                    if (entry.comment.indexOf(filename) != -1) {
                        isContain = true
                    }
                }
            }
            if (!isContain) {
                isEqual = false
            }
        }
        for (entry of jsonArray) {
            var isContain = false
            if (!entry.comment) {
                continue
            } else {
                for (file of fileArray) {
                    var i = file.indexOf('/')
                    var filename
                    if (i != -1) {
                        filename = file.substring(i + 1)
                    } else {
                        filename = file
                    }
                    console.log("> filename = " + filename)
                    if (entry.comment.indexOf(filename) != -1) {
                        isContain = true
                    }
                }
                if (!isContain) {
                    isEqual = false
                }
            }
        }
        console.log("> compareFiles..." + isEqual)
        console.log(fileArray)
        console.log(jsonArray)
        return isEqual
    }

    function checkPair(entry) {
        var isPair = true
        var pairKey, pairCommentKey
        if (_.size(entry) == 2) {
            for (var key in entry) {
                if (COMMENT_KEY.test(key)) {
                    pairCommentKey = key.split(COMMENT_KEY)[0]
                } else {
                    pairKey = key
                }
            }
        } else {
            return null
        }
        if (pairKey === pairCommentKey) {
            return pairKey
        } else {
            return null
        }
    }

    function removeBuildPhase(filePathsArray, buildPhaseType, nativeTargetId) {
        var
            buildPhaseSection = xcodeproj.hash.project.objects[buildPhaseType],
            nativeTargets = xcodeproj.pbxNativeTargetSection(),
            buildFileSection = xcodeproj.pbxBuildFileSection(),
            removeBuildPhaseKey,
            removeBuildPhaseCommentKey


        if (!buildPhaseSection) return

        console.log("> buildPhaseType = " + buildPhaseType)
        if (buildPhaseType === 'PBXCopyFilesBuildPhase') {
            console.log(buildPhaseSection)
            console.log("> buildPhaseType = " + _.size(buildPhaseSection))

            var pairKey = checkPair(buildPhaseSection)
            if (pairKey != null) {
                removeBuildPhaseKey = pairKey
                removeBuildPhaseCommentKey = f("%s_comment", removeBuildPhaseKey)
                // console.log("> remove BuildPhase " + removeBuildPhaseKey + " from... ")
                // console.log(buildPhaseSection)
                delete buildPhaseSection[removeBuildPhaseKey]
                delete buildPhaseSection[removeBuildPhaseCommentKey]
                // console.log(buildPhaseSection)
            }
        } else {
            for (key in buildPhaseSection) {
                // console.log(key)
                // console.log(buildPhaseSection[key])
                if (!buildPhaseSection[key].files) {
                    continue
                } else {
                    if (_.size(filePathsArray) === _.size(buildPhaseSection[key].files) && compareFiles(filePathsArray, buildPhaseSection[key].files)) {
                        removeBuildPhaseKey = key
                        removeBuildPhaseCommentKey = f("%s_comment", removeBuildPhaseKey)
                        console.log("> find same files from " + key + " | " + _.size(filePathsArray))
                        console.log("> remove BuildPhase " + removeBuildPhaseKey + " from... ")
                        // console.log(buildPhaseSection)
                        delete buildPhaseSection[removeBuildPhaseKey]
                        delete buildPhaseSection[removeBuildPhaseCommentKey]
                        console.log(buildPhaseSection)
                    }
                }
            }
        }

        // if (removeBuildPhaseKey) delete buildPhaseSection[removeBuildPhaseKey]
        // if (removeBuildPhaseCommentKey) delete buildPhaseSection[removeBuildPhaseCommentKey]
        // console.log("> nativeTargets")
        // console.log(nativeTargets)
        for (targetKey in nativeTargets) {
            if (!nativeTargets[targetKey].buildPhases) {
                continue
            } else {
                if (targetKey === nativeTargetId) {
                    for (entryKey in nativeTargets[targetKey].buildPhases) {
                        console.log("> nativeTargets... " + nativeTargets[targetKey].buildPhases[entryKey].value + " | " + removeBuildPhaseKey)
                        if (nativeTargets[targetKey].buildPhases[entryKey].value === removeBuildPhaseKey) {
                            console.log("> remove BuildPhase Reference " + removeBuildPhaseKey + " from nativeTargets... ")
                            // console.log(nativeTargets[targetKey].buildPhases)
                            nativeTargets[targetKey].buildPhases.splice(entryKey, 1)
                            // console.log(nativeTargets[targetKey].buildPhases)
                        }
                    }
                }
            }
        }
        return removeBuildPhaseKey
    }

    function addTarget(xcodeproj, name, type, subfolder) {

        // Setup uuid and name of new target
        var targetUuid = xcodeproj.generateUuid(),
            targetType = type,
            targetSubfolder = subfolder || name,
            targetName = name.trim();

        // Check type against list of allowed target types
        if (!targetName) {
            throw new Error("Target name missing.");
        }

        // Check type against list of allowed target types
        if (!targetType) {
            throw new Error("Target type missing.");
        }

        // Check type against list of allowed target types
        if (!producttypeForTargettype(targetType)) {
            throw new Error("Target type invalid: " + targetType);
        }

        // Build Configuration: Create
        var buildConfigurationsList = [{
                name: 'Debug',
                isa: 'XCBuildConfiguration',
                buildSettings: {
                    GCC_PREPROCESSOR_DEFINITIONS: ['"DEBUG=1"', '"$(inherited)"'],
                    INFOPLIST_FILE: '"' + path.join(targetSubfolder, targetSubfolder + '-Info.plist' + '"'),
                    LD_RUNPATH_SEARCH_PATHS: '"$(inherited) @executable_path/Frameworks @executable_path/../../Frameworks"',
                    PRODUCT_NAME: '"' + targetName + '"',
                    SKIP_INSTALL: 'YES'
                }
            },
            {
                name: 'Release',
                isa: 'XCBuildConfiguration',
                buildSettings: {
                    INFOPLIST_FILE: '"' + path.join(targetSubfolder, targetSubfolder + '-Info.plist' + '"'),
                    LD_RUNPATH_SEARCH_PATHS: '"$(inherited) @executable_path/Frameworks @executable_path/../../Frameworks"',
                    PRODUCT_NAME: '"' + targetName + '"',
                    SKIP_INSTALL: 'YES'
                }
            }
        ];

        // Build Configuration: Add
        var buildConfigurations = xcodeproj.addXCConfigurationList(buildConfigurationsList, 'Release', 'Build configuration list for PBXNativeTarget "' + targetName + '"');

        // Product: Create
        console.log("> get productFile...")

        var productName = targetName
        console.log("> get productName..." + productName)
        var productType = producttypeForTargettype(targetType)
        console.log("> get productType..." + productType)
        var productFileType = filetypeForProducttype(productType).replace(/[\"|\']/g, '')
        console.log("> get productFileType..." + productFileType)
        var productFile = addProductFile(
                productName, {
                    group: 'Copy Files',
                    'target': targetUuid,
                    'explicitFileType': productFileType
                }
            ),
            productFileName = productFile.basename;
        console.log("> get productFileName..." + productFileName)

        // console.log(productFile)
        console.log(sep)
        // Product: Add to build file list
        xcodeproj.addToPbxBuildFileSection(productFile);

        // Target: Create
        var target = {
            uuid: targetUuid,
            pbxNativeTarget: {
                isa: 'PBXNativeTarget',
                name: '"' + targetName + '"',
                productName: '"' + targetName + '"',
                productReference: productFile.fileRef,
                productType: '"' + producttypeForTargettype(targetType) + '"',
                buildConfigurationList: buildConfigurations.uuid,
                buildPhases: [],
                buildRules: [],
                dependencies: []
            }
        };

        // Target: Add to PBXNativeTarget section
        xcodeproj.addToPbxNativeTargetSection(target)

        // Product: Embed (only for "extension"-type targets)
        if (targetType === 'app_extension') {

            // Create CopyFiles phase in first target
            addBuildPhase([], 'PBXCopyFilesBuildPhase', 'Copy Files', xcodeproj.getFirstTarget().uuid, targetType)

            // Add product to CopyFiles phase
            xcodeproj.addToPbxCopyfilesBuildPhase(productFile)

            // this.addBuildPhaseToTarget(newPhase.buildPhase, this.getFirstTarget().uuid)

        };

        // Target: Add uuid to root project
        xcodeproj.addToPbxProjectSection(target);

        // Target: Add dependency for this target to first (main) target
        xcodeproj.addTargetDependency(xcodeproj.getFirstTarget().uuid, [target.uuid]);


        // Return target on success
        return target;

    };

    function applyPatchBack(patches) {
        try {
            var command = "";
            for (patch of patches) {
                command += validatePatch(patch)
            }
            console.log("> exec command... " + command)
            if (command != '') {
                exec(
                    command,
                    function (error, stdout) {
                        console.log("> patch back... ");
                        console.log(stdout);
                    }.bind(this)
                );
            }
        } catch (e) {
            console.error('> check patches... ' + patches + " not existed.")
        }
    }

    function validatePatch(patch) {
        var tester = fs.readFileSync(patch, encoding);
        console.log('> check patch file ' + patch + '... ' + !(!tester))
        if (!(!tester)) {
            return 'patch -R -p2 -d platforms/ < ' + patch + ";"
        }
        return ""
    }

    function getXcodeProjectPath(context) {
        var root = path.join(context.opts.projectRoot, "platforms", 'ios')

        var xcodeProjDir;
        var xcodeCordovaProj;

        try {
            xcodeProjDir = fs.readdirSync(root).filter(function (e) {
                return e.match(/\.xcodeproj$/i);
            })[0];
            if (!xcodeProjDir) {
                throw new Error('The provided path "' + root + '" is not a Cordova iOS project.');
            }

            var cordovaProjName = xcodeProjDir.substring(xcodeProjDir.lastIndexOf(path.sep) + 1, xcodeProjDir.indexOf('.xcodeproj'));
            xcodeCordovaProj = path.join(root, cordovaProjName);
        } catch (e) {
            throw new Error('The provided path "' + root + '" is not a Cordova iOS project.');
        }

        return path.join(root, xcodeProjDir, 'project.pbxproj')
    }

    function printRegEx(matches) {
        console.log('  -> matches: ' + matches.length)
        matches.forEach(function (element) {
            if (element) {
                if (element.length < 30) {
                    console.log('  -> matches element... ' + element)
                } else {
                    var short = element.substring(0, 30)
                    console.log('  -> matches element... ' + short.replace('/[\n\r]+/g', '                        \n'))
                }
            } else {
                console.log('  -> matches element... null')
            }
        }, this);
    }
};
