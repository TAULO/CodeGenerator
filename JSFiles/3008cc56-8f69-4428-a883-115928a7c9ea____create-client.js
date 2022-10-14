#!/usr/bin/env node
process.env.TERM = process.env.TERM || ''; // workaround for chalk module to avoid crash
const fs = require('fs-extra');
const path = require('path');
const program = require('commander');
const chalk = require('chalk');
const inquirer = require('inquirer');
const Bundler = require('../application-bundler/bundler').Bundler;
const toolUtils = require('../tool-utils');
const fail = toolUtils.fail;
const isDirectory = toolUtils.isDirectory;
const isFile = toolUtils.isFile;
const exec = toolUtils.exec;
const CreateClientBase = require('./create-client-base').CreateClientBase;
const updateJsonFile = require('update-json-file');
const shelljs = require('shelljs');

class CreateClient extends CreateClientBase {
  constructor() {
    super();

    this.REF_DEF_FILENAME = 'references.d.ts';
    this.ANDROID_DEF_REGEXP = 'android.*?\\.d\\.ts';

    this.sMdkProject = program.mdkproject;
    this.sOutDir = program.outdir;
    toolUtils.execVerbose = !!program.verbose;
    this.sConfiguration = program.debug ? 'Debug' : 'Release';
    this.sSdkPath = path.resolve(__dirname, '..', '..');
    this.aPluginsToSkip = [];
    this.sTemplateProjectPath = 'template.mdkproject';
    this.bCopyAndroidFioriLibs = true;
    this.bundler = null;
  }

  getMDKProjectPath() {
    const that = this;
    function testMDKProjectPath(sValue) {
      sValue = sValue
               .trim()
               .replace(/\/$/, '')
               .replace('~', process.env.HOME);
      if (!isDirectory(sValue)) {
        return `Could not find mdkproject directory: ${sValue}`;
      }
      if (!sValue.endsWith('.mdkproject')) {
        return 'The mdkproject directory must end with .mdkproject';
      }
      // Use the transformed value going forward
      that.sMdkProject = sValue;
      return true;
    }
    if (this.sMdkProject) {
      const r = testMDKProjectPath(this.sMdkProject);
      if (r === true) {
        console.log(`Using ${this.sMdkProject}`);
        return Promise.resolve();
      } else {
        return Promise.reject(r);
      }
    } else {
      const that = this;
      const oMDKProjectQuestion = {
        type: 'input',
        name: 'mdkproject',
        message: 'Enter the path of the .mdkproject directory.',
        default: path.resolve(that.sSdkPath, this.sTemplateProjectPath),
        validate: testMDKProjectPath,
      };
      return inquirer.prompt([oMDKProjectQuestion])
      .then(function(answers) {
        console.log(`Using ${that.sMdkProject}`);
      });
    }
  }

  getOutDir() {
    const that = this;
    function testOutPath(sValue) {
      sValue = sValue
               .trim()
               .replace(/\/$/, '')
               .replace('~', process.env.HOME);
      if (!isDirectory(sValue)) {
        return `Could not find the out directory: ${sValue}`;
      }
      // Use the transformed value going forward
      that.sOutDir = sValue;
      return true;
    }

    if (this.sOutDir) {
      const r = testOutPath(this.sOutDir);
      if (r === true) {
        console.log(`Using ${this.sOutDir} for out directory`);
        return Promise.resolve();
      } else {
        return Promise.reject(r);
      }
    } else {
      this.sOutDir = process.cwd();
      console.log(`Using ${this.sOutDir} for out directory`);
      return Promise.resolve();
    }
  }

  getPlatforms() {
    if (!this.isMac) {
      this.ios = false;
      this.android = true;
      console.log(`Building client for Android`);

      return;
    }

    if (program.ios) {
      if (program.android) {
        this.android = true;
      }
      this.ios = true;
      console.log(`Building client for iOS`);
    } else if (program.android) {
      this.android = true;
      console.log(`Building client for Android`);
    } else if (program.all) {
      this.ios = true;
      this.android = true;
      console.log(`Building client for all (iOS and Android)`);
    } else {
      const oPlatformQuestion = {
        type: 'list',
        name: 'platforms',
        message: 'Would you like to build for iOS or Android or All?',
        choices: ['ios', 'android', 'all'],
      };

      return inquirer.prompt([oPlatformQuestion])
      .then((answers) => {
        if (answers.platforms === 'all') {
          this.ios = true;
          this.android = true;
        } else if (answers.platforms == 'ios') {
          this.ios = true;
        } else if (answers.platforms == 'android') {
          this.android = true;
        }

        console.log(`Building client for ${answers.platforms}`);
      });
    }
  }

  getConfirmRemoveAppFolder() {
    const oQuestion = {
      type: 'list',
      name: 'forceremove',
      message: `Do you want to remove the existing directory: "${this.sAppPath}"?`,
      choices: ['no', 'yes'],
    };
    return inquirer.prompt([oQuestion])
    .then(function(answers) {
      if (answers.forceremove === 'no') {
        process.exit();
      }
    });
  }

  getConfirmRemoveUpdateFolders() {
    const oQuestion = {
      type: 'list',
      name: 'forceremove',
      message: `Please manually backup folder: '${this.sAppPath}' before update!\nDo you want to re-install all NativeScript plugins and update / remove some files and folders in '${this.sAppPath}'?`,
      choices: ['no', 'yes'],
    };
    return inquirer.prompt([oQuestion])
    .then(function(answers) {
      if (answers.forceremove === 'no') {
        process.exit();
      }
    });
  }

  getInstalledPlatforms() {
    var cwd = process.cwd();
    shelljs.cd(this.sAppPath);
    var output = shelljs.exec('tns platform list', { silent:true });
    var stdout = output.stdout.toLowerCase();
    if (output.error) {
      console.log("Application update error: " + output.error);
    } else {
      if (!stdout.match(/no installed platforms/g)) {
        if (stdout.match(/ios/g)){
          this.ios = true;
          console.log("Installed platforms: ios");
        }
        if (stdout.match(/android/g)){
          this.android = true;
          console.log("Installed platforms: android");
        }
      }
    }
    shelljs.cd(cwd);
  }

  getSimOrDevice() {
    if (program.device) {
      if (program.simulator) {
        fail(`--device and --simulator options can't both be selected.`);
      }
      this.sSdk = 'iphoneos';
      this.sNewSdk = 'ios-arm64';
      console.log(`Building client for device of iOS`);
    } else if (program.simulator) {
      this.sSdk = 'iphonesimulator';
      this.sNewSdk = 'ios-x86_64-simulator';
      console.log(`Building client for simulator of iOS`);
    } else {
      const oSimOrDeviceQuestion = {
        type: 'list',
        name: 'simOrDevice',
        message: 'Would you like to build for device or simulator of iOS?',
        choices: ['device', 'simulator'],
      };

      return inquirer.prompt([oSimOrDeviceQuestion])
      .then((answers) => {
        this.sSdk = {
          device: 'iphoneos',
          simulator: 'iphonesimulator',
        }[answers.simOrDevice];
        this.sNewSdk = {
          device: 'ios-arm64',
          simulator: 'ios-x86_64-simulator',
        }[answers.simOrDevice];
        if (answers.simOrDevice == 'simulator') {
           program.simulator = true;
        }
        console.log(`Building client for ${answers.simOrDevice} of iOS`);
      });
    }
  }

  parseMDKProjectJSON() {
    // Parse MDKProject.json
    this.sMdkProjectFile = `${this.sMdkProject}/MDKProject.json`;
    if (!isFile(this.sMdkProjectFile)) {
      fail(`Could not find ${this.sMdkProjectFile}`);
    }
    try {
      this.oMdkProjectJson = fs.readJsonSync(this.sMdkProjectFile);
    } catch (e) {
      console.log(e);
    }
    if (!this.oMdkProjectJson) {
      fail(`Could not parse ${this.sMdkProjectFile}`)
    }
  }

  validateMDKProjectJSON() {
    // Values that are required in MDKProject.json
    const oRequiredMdkProjectProperties = {
    };
    for (const key in oRequiredMdkProjectProperties) {
      if (!this.oMdkProjectJson[key]) {
        fail(`Missing required property ${key} in ${this.sMdkProjectFile}`);
      }
      const sExpectedType = typeof oRequiredMdkProjectProperties[key];
      const sFoundType = typeof this.oMdkProjectJson[key];
      if (sExpectedType !== sFoundType) {
        fail(`Value for ${key} in ${this.sMdkProjectFile} must be of type ${sExpectedType}. Instead, found ${sFoundType}`)
      }
    }
    // Values that are optional in MDKProject.json
    const oOptionalMdkProjectProperties = {
      AppName: 'Example App',
      AppVersion: '1.2.0',
      BaseProject: '',
      BundleID: 'com.sample.mdk',
      Externals: [],
      NSPlugins: [],
      UrlScheme: 'mdkclient',
    };
    for (const key in oOptionalMdkProjectProperties) {
      if (!this.oMdkProjectJson[key]) {
        // If the optional property is missing, use the default.
        this.oMdkProjectJson[key] = oOptionalMdkProjectProperties[key];
        continue;
      }
      const sExpectedType = typeof oOptionalMdkProjectProperties[key];
      const sFoundType = typeof this.oMdkProjectJson[key];
      if (sExpectedType !== sFoundType) {
        fail(`Value for ${key} in ${this.sMdkProjectFile} must be of type ${sExpectedType}. Instead, found ${sFoundType}`)
      }
    }

    this.sAppName = this.oMdkProjectJson.AppName;
    this.sAppPath = path.resolve(this.sOutDir, this.sAppName);
    this.sAppDisplayName = this.oMdkProjectJson.AppName;
    this.sAppVersion = this.oMdkProjectJson.AppVersion;
    this.sBaseProject = this.oMdkProjectJson.BaseProject;
    this.sBundleID = this.oMdkProjectJson.BundleID;
    this.aExternals = this.oMdkProjectJson.Externals;
    this.nsPlugins = this.oMdkProjectJson.NSPlugins;
    this.sUrlScheme = this.oMdkProjectJson.UrlScheme;
    this.oExecInProject = {
      cwd: this.sAppPath,
    };
  }

  isAppPathExists() {
    return isDirectory(this.sAppPath);
  }

  parseBrandedSettingsJSON() {
    // Parse BrandedSettings.json just to make sure it's valid
    this.sBrandedSettingsFile = `${this.sMdkProject}/BrandedSettings.json`;
    if (!isFile(this.sBrandedSettingsFile)) {
      fail(`Could not find ${this.sBrandedSettingsFile}`);
    }
    let bParsedBrandedSettingsFile = true;
    try {
      this.oBrandedSettingsJson = fs.readJsonSync(this.sBrandedSettingsFile);
    } catch (e) {
      console.log(e);
      bParsedBrandedSettingsFile = false;
    }
    if (!bParsedBrandedSettingsFile) {
      fail(`Could not parse ${this.sBrandedSettingsFile}`)
    }
  }

  createProject() {
    // Create the project
    if (isDirectory(this.sAppPath)) {
      console.log(`Removing existing directory ${this.sAppPath}`);
      shelljs.rm('-rf', this.sAppPath);
    }
    console.log(chalk.green(`Creating application ${this.sAppName}`));
    let templatePath = path.resolve(this.sSdkPath, 'App_SDK', 'template');
    exec(`tns create "${this.sAppName}" --appid "${this.sBundleID}" --template "${templatePath}"`,
         'Failed to create application', { cwd: this.sOutDir, });

    if (this.ios) {
      exec('tns platform add ios@6.5.2',
      'Failed to add iOS platform to project', this.oExecInProject);
    }

    if (this.android) {
      exec('tns platform add android@6.5.3',
      'Failed to add Android platform to project', this.oExecInProject);
    }
    console.log("Copying modules to application directory");
    shelljs.cp('-r', `${this.sSdkPath}/App_SDK/modules`, this.sAppPath);
    console.log("Copying plugins to application directory");
    shelljs.cp('-r', `${this.sSdkPath}/App_SDK/plugins`, this.sAppPath);
    console.log("Copying hooks to application directory");
    shelljs.cp('-r', `${this.sSdkPath}/App_SDK/hooks`, this.sAppPath);
    console.log("Copying sapmdc-declarations to application directory");
    shelljs.cp('-r', `${this.sSdkPath}/App_SDK/sapmdc-declarations`, this.sAppPath);

    if (this.ios) {
      console.log('Copying frameworks to iOS platform directory');
      shelljs.mkdir('-p', `${this.sAppPath}/plugins/SAP/platforms/ios`);

      let iosLibPath = this.sSdkPath + '/libs/ios/';
      shelljs.cp('-r', `${iosLibPath}/MDCFramework/SAPMDC/${this.sConfiguration}-${this.sSdk}/SAPMDC.framework`, `${this.sAppPath}/plugins/SAP/platforms/ios`);
      if (shelljs.error()) {
        console.error("Failed to copy MDCFramework to iOS platform directory");

        if (this.sConfiguration !== 'Release') {
          console.log('Try to copying release MDCFramework for iOS');

          shelljs.cp('-r', `${iosLibPath}/MDCFramework/SAPMDC/Release-${this.sSdk}/SAPMDC.framework`, `${this.sAppPath}/plugins/SAP/platforms/ios`);
          if (shelljs.error()) {
            console.error("Failed to copy release MDCFramework to iOS platform directory");
          }
        }
      }

      let destPath = path.resolve(this.sAppPath, 'plugins', 'SAP', 'platforms', 'ios');
      let frameworkPath = path.resolve(iosLibPath, 'Frameworks', `${this.sConfiguration}-xcframework`);

      let frameworkPathExist = isDirectory(frameworkPath);
      if (!frameworkPathExist) {
        if (this.sConfiguration !== 'Release') {
          console.log('Try to copying release frameworks for iOS');

          frameworkPath = path.resolve(iosLibPath, 'Frameworks', `Release-xcframework`);
          frameworkPathExist = isDirectory(frameworkPath);
        }
      }

      if (frameworkPathExist) {
        shelljs.ls('-d', path.join(frameworkPath, '*.xcframework')).forEach((xcframeworkPath) => {
          shelljs.cp('-r', path.join(xcframeworkPath, this.sNewSdk, "*"), destPath);
          if (shelljs.error()) {
            console.error(`Failed to copy framework: '${xcframeworkPath}' to iOS platform directory`);
          }
        });
      } else {
        console.error(`Failed to copy frameworks: '${frameworkPath}' to iOS platform directory`);
      }
    }

    if (this.android) {
      console.log('Copying frameworks to Android platform directory');
      shelljs.mkdir('-p', `${this.sAppPath}/plugins/SAP/platforms/android`);

      let androidLibPath = this.sSdkPath + '/libs/android/';
      shelljs.cp('-r', `${androidLibPath}/MDKClient/MDKClient/*`, `${this.sAppPath}/plugins/SAP/platforms/android`);
      if (shelljs.error()) {
        console.error("Failed to copy MDKClient to Android platform directory");
      }

      if (this.bCopyAndroidFioriLibs) {
        shelljs.mkdir('-p', `${this.sAppPath}/libs/android/FioriLibs`);
        shelljs.cp('-r', `${androidLibPath}/FioriLibs/*`, `${this.sAppPath}/libs/android/FioriLibs`);
        if (shelljs.error()) {
          console.error("Failed to copy FioriLibs to App directory");
        }
      }
    }

    console.log('Copying branded settings');
    this.copyBrandedSettings();
    this.copyDemoFiles();

    console.log('Copying TypeScript configuration files');
    shelljs.mkdir('-p', `${this.sAppPath}/typings`);
    shelljs.cp(`${this.sSdkPath}/App_SDK/typings/Worker.d.ts`, `${this.sAppPath}/typings`);

    shelljs.cp(`${this.sSdkPath}/App_SDK/.babelrc`, this.sAppPath);
    shelljs.cp(`${this.sSdkPath}/App_SDK/tsconfig.json`, this.sAppPath);
    shelljs.cp(`${this.sSdkPath}/App_SDK/tsconfig-plugins.json`, this.sAppPath);
    shelljs.cp(`${this.sSdkPath}/App_SDK/typings.d.ts`, this.sAppPath);
    shelljs.cp(`${this.sSdkPath}/App_SDK/typings.json`, this.sAppPath);
    shelljs.cp(`${this.sSdkPath}/App_SDK/webpack.config.js`, this.sAppPath);

    console.log('Copying tns-platform-declarations configuration file');
    shelljs.cp(`${this.sSdkPath}/App_SDK/references.d.ts`, this.sAppPath);

    this.populateTemplateFiles();
    this.updateSDKFiles();

    console.log('Installing application dependencies');
    // Dev dependencies - tools for building the app
    exec('npm i',
         'Failed to install application dependencies', this.oExecInProject);
  }

  copyBrandedSettings () {
    shelljs.mkdir('-p', `${this.sAppPath}/app/branding`);
    shelljs.cp(this.sBrandedSettingsFile, `${this.sAppPath}/app/branding/BrandedSettings.json`);
    if (shelljs.error()) {
      console.error("Failed to copy branded settings");
    }
  }

  copyDemoFiles() {
    const sDemoPath = `${this.sMdkProject}/demo`;
    if (!isDirectory(sDemoPath)) {
      console.log(`${sDemoPath} does not exist. No demo databases will be used.`);
      return;
    }
    const aDemoFiles = shelljs.find(sDemoPath).filter(function(file) { return file.match(/\.udb$/); });
    if (aDemoFiles.length) {
      console.log(`Copying demo database files in ${sDemoPath}`);
      aDemoFiles.forEach(sDemoFile => {
        shelljs.cp(sDemoFile, `${this.sAppPath}/app/branding`);
        if (shelljs.error()) {
          console.error(`Failed to copy demo file ${sDemoFile}`);
        }
      });
    } else {
      console.log(`No demo database files were found in ${sDemoPath}`);
    }
  }

  copyAppResources() {
    this.copyAppIOSResources();
    this.copyAppAndroidResources();
  }

  copyAppIOSResources() {
    if (this.ios) {
      const sAppResourcesiOSSourceDir = `${this.sMdkProject}/App_Resources/iOS`;
      const sAppResourcesiOSTargetDir = `${this.sAppPath}/app/App_Resources/iOS`;

      if (!isDirectory(sAppResourcesiOSSourceDir)) {
        console.log(`Directory ${sAppResourcesiOSSourceDir} not found`);
        console.log('The project will use the default App_Resources content');
        return;
      }

      const aAppResourcesFiles = shelljs.ls(sAppResourcesiOSSourceDir);
      if (!aAppResourcesFiles.length) {
        console.log(`Directory ${sAppResourcesiOSSourceDir} is empty`);
        console.log('The project will use the default App_Resources content');
        return;
      }
      console.log(`Copying contents of ${sAppResourcesiOSSourceDir} into ${sAppResourcesiOSTargetDir}`);
      aAppResourcesFiles.forEach(sAppResourcesFile => {
        let filePath = path.join(sAppResourcesiOSSourceDir, sAppResourcesFile);
        shelljs.cp('-r', filePath, sAppResourcesiOSTargetDir);
      });
    }
  }

  copyAppAndroidResources() {
    if (this.android) {
      const sAppResourcesAndroidSourceDir = `${this.sMdkProject}/App_Resources/Android`;
      const sAppResourcesAndroidTargetDir = `${this.sAppPath}/app/App_Resources/Android`;

      if (!isDirectory(sAppResourcesAndroidSourceDir)) {
        console.log(`Directory ${sAppResourcesAndroidSourceDir} not found`);
        console.log('The project will use the default App_Resources content');
        return;
      }

      const aAppResourcesFiles = shelljs.ls(sAppResourcesAndroidSourceDir);
      if (!aAppResourcesFiles.length) {
        console.log(`Directory ${sAppResourcesAndroidSourceDir} is empty`);
        console.log('The project will use the default App_Resources content');
        return;
      }
      console.log(`Copying contents of ${sAppResourcesAndroidSourceDir} into ${sAppResourcesAndroidTargetDir}`);
      aAppResourcesFiles.forEach(sAppResourcesFile => {
        let filePath = path.join(sAppResourcesAndroidSourceDir, sAppResourcesFile);
        shelljs.cp('-r', filePath, sAppResourcesAndroidTargetDir);
      });
    }
  }

  mergeAppResources() {
    const sAppResourcesMergeSourceDir = path.join(this.sMdkProject, 'App_Resources_Merge');

    let walkRootDir = sAppResourcesMergeSourceDir;
    if (this.ios && !this.android) {
      walkRootDir = path.join(sAppResourcesMergeSourceDir, 'iOS');
    } else if (!this.ios && this.android) {
      walkRootDir = path.join(sAppResourcesMergeSourceDir, 'Android');
    }

    if (!isDirectory(walkRootDir)) {
      return;
    }

    this.walkSync(walkRootDir, (filePath, fileName) => {
      if (fileName === '.DS_Store') {
        return;
      }

      const targetDir = path.join(this.sAppPath, 'app', 'App_Resources', path.relative(sAppResourcesMergeSourceDir, path.dirname(filePath)));
      const targetPath = path.join(targetDir, fileName);
      const iOSTargetPath = path.join(this.sAppPath, 'app', 'App_Resources', 'iOS');
      const androidTargetPath = path.join(this.sAppPath, 'app', 'App_Resources', 'Android', 'src', 'main');
      const targetMergePath = path.join(this.sAppPath, 'app', 'App_Resources_Merge', path.relative(sAppResourcesMergeSourceDir, path.dirname(filePath)));

      if (fs.existsSync(targetPath)) {
        const fileExt = path.extname(fileName);
        if (fileExt === '.plist') {
          this.mergePlist(sAppResourcesMergeSourceDir, filePath, targetPath, fileName);
        } else if (fileExt === '.strings') {
          this.mergeStrings(this.checkStringsComment, filePath, targetPath);
        } else if (fileExt === '.xcconfig' && targetPath.startsWith(iOSTargetPath)) {
          this.mergeStrings(this.checkXcconfigComment, filePath, targetPath);
        } else if (fileExt === '.gradle') {
          this.mergeGradle(sAppResourcesMergeSourceDir, filePath, targetPath, fileName);
        } else if (fileExt === '.xml' && targetPath.startsWith(androidTargetPath)) {
          if (!fs.existsSync(targetMergePath)) {
            shelljs.mkdir('-p', targetMergePath);
          }

          this.mergeAndroidXml(sAppResourcesMergeSourceDir, filePath, path.resolve(targetMergePath, fileName), fileName);
        } else {
          if (!fs.existsSync(targetDir)) {
            shelljs.mkdir('-p', targetDir);
          }
          shelljs.cp(filePath, targetPath);
        }
      } else {
        if (!fs.existsSync(targetDir)) {
          shelljs.mkdir('-p', targetDir);
        }
        shelljs.cp(filePath, targetPath);
      }
    });

    console.log(`Merge App_Resources done`);
  }

  checkStringsComment(line) {
    return line && (line.startsWith('/*') && line.endsWith('*/'));
  }

  checkXcconfigComment(line) {
    return line && (line.startsWith('//') || line.startsWith('#'));
  }

  mergePlist(sAppResourcesMergeSourceDir, filePath, targetPath) {
    const targetOrginalPath = path.join(path.dirname(targetPath), '__temp__.plist');
    shelljs.mv(targetPath, targetOrginalPath);
    shelljs.cp(filePath, targetPath);
    exec(`/usr/libexec/PlistBuddy -x -c "Merge '${targetOrginalPath}'" "${targetPath}"`,
        `Failed to merge "${targetPath}".`, sAppResourcesMergeSourceDir);
    shelljs.rm('-f', targetOrginalPath);
    console.log(`Merged ${filePath}`);
  }

  mergeStrings(checkCommentFunc, filePath, targetPath, outPath, displayPath) {
    let items = this.readStringResourceFile(filePath, checkCommentFunc);
    let targetItems = this.readStringResourceFile(targetPath, checkCommentFunc);

    let changed = false;
    for (let item of items) {
      changed = true;
      let found = false;

      for (let targetItem of targetItems) {
        if (item.key === targetItem.key) {
          targetItem.value = item.value;
          for (let comment of item.comments) {
            if (!targetItem.comments.includes(comment)) {
              targetItem.comments.push(comment);
            }
          }
          found = true;
          break;
        }
      }

      if (!found) {
        targetItems.push(item);
      }
    }

    if (changed) {
      const savePath = outPath ? outPath : targetPath;
      this.saveStringResourceFile(savePath, targetItems);
      const logPath = displayPath ? displayPath : filePath;
      console.log(`Merged ${logPath}`);
    }
  }

  readStringResourceFile(filePath, checkCommentFunc) {
    let fileData = fs.readFileSync(filePath, 'utf-8');
    let lines = fileData.split(/\r?\n/);
    let result = [];
    let comments = [];

    for (let line of lines) {
      if (checkCommentFunc(line.trim())) {
        comments.push(line);
      } else {
        let lineItems = line.trim().split(/(?<!\\)=/);
        if (lineItems.length > 1) {
          let key = lineItems[0];
          if (lineItems.length > 2) {
            key = lineItems.slice(0, lineItems.length - 1).join('=');
          }

          result.push({
            key: key.trim(),
            value: lineItems[lineItems.length - 1].trim(),
            comments: comments
          });

          comments = [];
        }
      }
    }

    return result;
  }

  saveStringResourceFile(filePath, items) {
    let lines = [];
    for (let item of items) {
      if (item.comments && item.comments.length > 0) {
        for (let comment of item.comments) {
          lines.push(comment);
        }
      }

      lines.push(item.key + '=' + item.value);
    }
    fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
  }

  mergeGradle(sAppResourcesMergeSourceDir, filePath, targetPath) {
    let srcFileData = fs.readFileSync(filePath, 'utf-8');
    let fileData = fs.readFileSync(targetPath, 'utf-8');
    if (!fileData.endsWith(srcFileData)) {
      fileData = `${fileData}\n${srcFileData}`;
      fs.writeFileSync(targetPath, fileData, 'utf-8');
    }

    console.log(`Merged ${filePath}`);
  }

  mergeAndroidXml(sAppResourcesMergeSourceDir, filePath, targetPath) {
    shelljs.cp(filePath, targetPath);

    console.log(`Merged ${filePath}`);
  }

  updateSettingFiles() {
    this.updateAppGradle();
    this.updateAndroidManifestXmls();
    this.updateStringsXmls();
    this.updateFilePathsXmls();
  }

  updateAppGradle() {
    const sAppResourcesAndroidTargetDir = `${this.sAppPath}/app/App_Resources/Android`;
    const filePath = `${sAppResourcesAndroidTargetDir}/app.gradle`;
    this.updateFileUsingRegExp(filePath, [{
      regexp: '(applicationId\\s*?=\\s*?")(.*?)(")',
      replaceValue: `$1${this.sBundleID}$3`
    }]);
  }

  updateAndroidManifestXmls() {
    const sAppResourcesAndroidTargetDir = path.join(this.sAppPath, 'app', 'App_Resources', 'Android');
    const filePath = path.join(sAppResourcesAndroidTargetDir, 'src', 'main', 'AndroidManifest.xml');

    this.updateAndroidManifestXml(filePath);

    const mergeFilePath = path.join(this.sAppPath, 'app', 'App_Resources_Merge', 'Android', 'src', 'main', 'AndroidManifest.xml');
    if (fs.existsSync(mergeFilePath)) {
      this.updateAndroidManifestXml(mergeFilePath);
      this.updateFileUsingRegExp(mergeFilePath, [{
        regexp: '__PACKAGE__',
        replaceValue: this.sBundleID
      }]);
    }
  }

  updateAndroidManifestXml(filePath) {
    this.updateFileUsingRegExp(filePath, [{
      regexp: '(android:authorities=")(.*?)(\\.fileprovider")',
      replaceValue: `$1${this.sBundleID}$3`
    }, {
      regexp: '(")(mdkclient)(://”\\s*?-->)',
      replaceValue: `$1${this.sUrlScheme}$3`
    }, {
      regexp: '(android:scheme=")(.*?)(")',
      replaceValue: `$1${this.sUrlScheme}$3`
    }, {
      regexp: '(android:versionName=")(.*?)(")',
      replaceValue: `$1${this.sAppVersion}$3`
    }]);
  }

  updateStringsXmls() {
    const sAppResourcesAndroidTargetDir = `${this.sAppPath}/app/App_Resources/Android`;
    const filePath = `${sAppResourcesAndroidTargetDir}/src/main/res/values/strings.xml`;
    this.updateStringsXml(filePath);

    const mergeFilePath = path.join(this.sAppPath, 'app', 'App_Resources_Merge', 'Android', 'src', 'main', 'res', 'values', 'strings.xml');
    if (fs.existsSync(mergeFilePath)) {
      this.updateStringsXml(mergeFilePath);
    }
  }

  updateStringsXml(filePath) {
    this.updateFileUsingRegExp(filePath, [{
      regexp: '("mdk_app_name">)(.*?)(<)',
      replaceValue: `$1${this.sAppDisplayName}$3`
    }, {
      regexp: '("file_provider">)(.*?)(\\.fileprovider<)',
      replaceValue: `$1${this.sBundleID}$3`
    }]);
  }

  updateFilePathsXmls() {
    const sAppResourcesAndroidTargetDir = `${this.sAppPath}/app/App_Resources/Android`;
    const filePath = `${sAppResourcesAndroidTargetDir}/src/main/res/xml/filepaths.xml`;
    this.updateFilePathsXml(filePath);

    const mergeFilePath = path.join(this.sAppPath, 'app', 'App_Resources_Merge', 'Android', 'src', 'main', 'res', 'xml', 'filepaths.xml');
    if (fs.existsSync(mergeFilePath)) {
      this.updateFilePathsXml(mergeFilePath);
    }
  }

  updateFilePathsXml(filePath) {
    this.updateFileUsingRegExp(filePath, [{
      regexp: '("Android/data/)(.*?)(/files)',
      replaceValue: `$1${this.sBundleID}$3`
    }]);
  }

  updateFileUsingRegExp(filePath, regexps, logMessage) {
    if (fs.existsSync(filePath)) {
      console.log(logMessage || `Updating ${filePath}`);

      let fileChanged = false;
      let fileData = fs.readFileSync(filePath, 'utf-8');

      for (const item of regexps) {
        let doIt = true;
        if (typeof item.checkFunc === 'function') {
          doIt = item.checkFunc();
        }

        if (doIt) {
          const re = new RegExp(item.regexp, "g");
          if (re.test(fileData)) {
            fileData = fileData.replace(re, item.replaceValue);
            fileChanged = true;
          }
        }
      }

      if (fileChanged) {
        fs.writeFileSync(filePath, fileData, 'utf-8');
      }
    }
  }

  addMetadata() {
    if (isFile(`${this.sMdkProject}/metadata/${this.sBaseProject}/Application.app`)) {
      console.log('Generating application bundle from metadata');
      // Externals can include a version, but only the name should be passed to the bundler.
      const aBundlerExternals = this.aExternals.map(sModule => sModule.split('@')[0]);
      // Each property has to be a due to the way we
      // implemented the bundler args. This could be refactored.
      const oBundlerArgs = {
        editorExport: () => { return ''; },
        applicationName: () => { return ''; },
        bundleName: () => { return 'bundle.js'; },
        libraryTarget: () => { return 'umd' },
        nativeScriptProjectPath: () => { return `${path.resolve(this.sAppPath, 'app')}`; },
        projectIndexFile: () => { return 'application-index.js'; },
        mdkBaseApplicationPath: () => { return `${path.resolve(this.sMdkProject, 'metadata', this.sBaseProject)}`; },
        externals: () => { return aBundlerExternals; },
        shouldCreateBundle: () => { return false },
        devtool: () => { return false; },
        shouldWatch: () => { return false; },
        shouldCleanTempFiles: () => { return false; },
        bundleTargetPath: () => {}
      };
      this.bundler = new Bundler(oBundlerArgs);
      return this.bundler.buildClientDefinitions();
    } else if (isFile(`${this.sMdkProject}/metadata/bundle.js`)) {
      console.log('Copying bundle.js into client project.');
      shelljs.cp(`${this.sMdkProject}/metadata/bundle.js`, `${this.sAppPath}/app`);
    } else {
      console.log(`WARNING: Did not find definitions in directory ${this.sMdkProject}/metadata!`);
      console.log('The project will use the default application metadata');
    }
    return Promise.resolve();
  }

  addDemoMetadata() {
    const sBrandedDemoBundle = `${this.sMdkProject}/demo/demo.js`;
    const sBrandedBundle = `${this.sAppPath}/app/bundle.js`;
    if (fs.existsSync(sBrandedDemoBundle)) {
      console.log(`Copying ${sBrandedDemoBundle} to app/demo.js`);
      shelljs.cp(`${sBrandedDemoBundle}`, `${this.sAppPath}/app/demo.js`);
    } else if (fs.existsSync(sBrandedBundle) && this.oBrandedSettingsJson.Demo) {
      console.log(`Copying ${sBrandedBundle} to app/demo.js`);
      shelljs.cp(`${sBrandedBundle}`, `${this.sAppPath}/app/demo.js`);
    } else {
      console.log('No demo metadata was found');
    }
    return Promise.resolve();
  }

  getAndroidDefination(filePath) {
    if (fs.existsSync(filePath)) {
      let fileData = fs.readFileSync(filePath, 'utf-8');
      const re = new RegExp(this.ANDROID_DEF_REGEXP, "g");
      if (re.test(fileData)) {
        return fileData.match(re)[0];
      }
    }

    return null;
  }

  updateAndroidDefinationInPlugins(appAndroidDef) {
    const appPluginsPath = path.resolve(this.sAppPath, 'plugins');
    this.walkSync(appPluginsPath, (filePath, fileName) => {
      if (fileName === this.REF_DEF_FILENAME) {
        let androidDef = this.getAndroidDefination(filePath);
        if (androidDef && (androidDef !== appAndroidDef)) {
          this.updateFileUsingRegExp(filePath, [{
            regexp: this.ANDROID_DEF_REGEXP,
            replaceValue: appAndroidDef
          }], `WARNING: Change Android defination from "${androidDef}" to "${appAndroidDef}" in "${filePath}" to avoid build failed.`);
        }
      }
    });
  }

  walkSync(dir, cbFunc) {
    fs.readdirSync(dir).forEach(fileName => {
      const filePath = path.join(dir, fileName);

      if (fs.statSync(filePath).isDirectory()) {
        this.walkSync(filePath, cbFunc);
      } else {
        cbFunc(filePath, fileName);
      }
    });
  }

  addPlugins() {
    let aExtensions = [];
    const sExtensionDir = path.resolve(this.sMdkProject, 'extensions');
    if (isDirectory(sExtensionDir)) {
      aExtensions = shelljs.ls(sExtensionDir).filter(sPath => {
        return isDirectory(path.resolve(sExtensionDir, sPath));
      });;
    }

    const appExtPath = path.resolve(this.sAppPath, 'app', 'extensions');
    let aPathComponents = null;
    let sExtensionName = "";
    let extensionModulePath = "";
    let aExtensionPlugins = null;
    let sPluginName = "";
    let newExtensionPluginPath = "";

    // Remove any existing extensions if any
    if (isDirectory(appExtPath)) {
      shelljs.rm('-rf', appExtPath);
    }

    // Create app/extensions folder
    shelljs.mkdir('-p', appExtPath);

    // Copy extension modules to app/extensions folder
    let extensionExists = aExtensions ? aExtensions.length > 0 : false;
    if (extensionExists) {
      aExtensions.forEach(sExtensionName => {
        console.log(`Copying extension ${sExtensionName}`);
        // Create extension module folder
        extensionModulePath = path.resolve(appExtPath, sExtensionName);
        shelljs.mkdir('-p', extensionModulePath);

        let subPath = path.resolve(sExtensionDir, sExtensionName, 'controls');
        if (isDirectory(subPath)) {
          // Copy controls folder
          shelljs.cp('-r', subPath, extensionModulePath);
          if (shelljs.error()) {
            console.error(`Failed to copy controls to "${extensionModulePath}"`);
          }
        }

        subPath = path.resolve(sExtensionDir, sExtensionName, 'i18n');
        if (isDirectory(subPath)) {
          // Copy i18n folder
          shelljs.cp('-r', subPath, extensionModulePath);
          if (shelljs.error()) {
            console.error(`Failed to copy i18n to "${extensionModulePath}"`);
          }
        }

        subPath = path.resolve(sExtensionDir, sExtensionName, 'plugin');
        if (isDirectory(subPath)) {
          // Copy plugin folder to sAppPath/plugins
          aExtensionPlugins = shelljs.ls(subPath);

          aExtensionPlugins.forEach(sPluginName => {
            let sPluginPath = path.resolve(subPath, sPluginName);
            // Copy extension plugin to sAppPath/plugins
            // rename dir to "extensionmodulename_pluginfoldername" to prevent duplicates
            newExtensionPluginPath = path.resolve(this.sAppPath, 'plugins', `${sExtensionName}_${sPluginName}`);
            // remove new extension plugin path if exists
            shelljs.rm('-rf', newExtensionPluginPath);
            // copy plugin
            shelljs.cp('-r', sPluginPath, newExtensionPluginPath);
            if (shelljs.error()) {
              console.error(`Failed to copy ${sPluginName} to "${newExtensionPluginPath}"`);
            }
          });
        }
      });
    }

    let appAndroidDef = this.getAndroidDefination(path.resolve(this.sAppPath, this.REF_DEF_FILENAME));
    if (appAndroidDef) {
      this.updateAndroidDefinationInPlugins(appAndroidDef);
    }

    // Compile TypeScript before performing tns plugin add.
    console.log('Compiling plugin TypeScript code');
    let gulpFile = path.resolve(this.sAppPath, 'gulpfile.js');
    if (fs.existsSync(gulpFile)) {
      const sConfigArgument = `-- --${this.sConfiguration.toLowerCase()}`;
      exec(`npm run compile-plugins ${sConfigArgument}`,
           'Failed to compile plugin TypeScript code.', this.oExecInProject);
    } else {
      let tscPath = path.join('node_modules', 'typescript', 'lib', 'tsc.js');
      exec(`"${process.execPath}" "${tscPath}" -p tsconfig-plugins.json`,
      'Failed to compile plugin TypeScript code.', this.oExecInProject);
    }

    // App TypeScript code is compiled during the tns prepare step.
    // Now use tns plugin add to install the plugins.
    let pluginPath = path.resolve(this.sAppPath, 'plugins');
    const aPluginsInApp = shelljs.ls(pluginPath)
      .filter(sPath => {
        return isDirectory(path.resolve(pluginPath, sPath)) && !this.aPluginsToSkip.includes(sPath);
      });
    aPluginsInApp.forEach(sPluginName => {
      console.log(`Installing plugin ${sPluginName}`);
      exec(`tns plugin add "./plugins/${sPluginName}"`,
           `Failed to add ${sPluginName} plugin.`, this.oExecInProject);
    });
  }

  addFonts() {
    let aFonts = [];
    // Get path of fonts dir {mdkproject/fonts}
    const fontDir = path.resolve(this.sMdkProject, 'fonts');
    if (isDirectory(fontDir)) {
      shelljs.ls(fontDir).filter(file => {
        aFonts.push(file);
        return isDirectory(path.resolve(fontDir, file));
      });;
    }

    // Get path of fonts dir in app {app/fonts}
    const appFontPath = path.resolve(this.sAppPath, 'app', 'fonts');

    // Remove any existing fonts if any
    if (isDirectory(appFontPath)) {
      shelljs.rm('-rf', appFontPath);
    }

    let fontExists = aFonts ? aFonts.length > 0 : false;
    // Font files found in mdkproject/fonts
    if (fontExists) {
      // Copy fonts folder to app
      shelljs.cp('-r', fontDir, appFontPath);
      console.log(`Copying fonts folder to ${appFontPath}`);
      if (shelljs.error()) {
        console.error(`Failed to copy fonts folder to ${appFontPath}`);
      }
    }
    else if (!fontExists) {
      // Create app/font folder
      shelljs.mkdir('-p', appFontPath);
    }

    // Get path of default fonts
    const defaultFontPath = path.resolve(this.sAppPath, 'app', 'defaultFonts');

    try {
      if (isDirectory(defaultFontPath)) {
        // Copy default fonts to app/font
        fs.copySync(defaultFontPath, appFontPath);
      }
    }
    catch (error) {
      console.log(error);

    }
  }

  installMDKCore() {
    console.log('Installing mdk-core');

    let mdkCoreFolder = path.resolve(this.sAppPath, 'modules', 'mdk-core');

    exec(`npm install "${mdkCoreFolder}" --save`,
         'Failed to install mdk-core', this.oExecInProject);
  }

  installNSPlugins() {
    for (const nsPlugin of this.nsPlugins) {
      var command = 'tns plugin add ' + nsPlugin;
      // Remove the plugin if already exists, otherwise build process stops.
      console.log(`Removing NativeScript plugin ${nsPlugin}`);
      exec(`tns plugin remove ${nsPlugin}`,
        `Failed to remove ${nsPlugin} plugin.`, this.oExecInProject, true);
      var errorText = 'Failed to add plugin: ' + nsPlugin;
      console.log('Installing NativeScript plugin: ' + nsPlugin);
      exec(command, errorText, this.oExecInProject);
    }
  }

  prepare_i18n() {
    if (this.bundler) {
      const bundleBuildOutputPath = this.bundler.buildOutputPath;
      const applicationAppPath = path.join(bundleBuildOutputPath, 'Application.app');
      const sAppPath = this.sAppPath;
      const appResourcesDirectoryPath = `${sAppPath}/app/App_Resources`;
      const bIos = this.ios;
      const bAndroid = this.android;
      const that = this;

      return new Promise((resolve, reject) => {
        let found = false;
        if (fs.existsSync(applicationAppPath)) {
          const applicationStr = fs.readFileSync(applicationAppPath, 'utf8');
          let application_app = JSON.parse(applicationStr);

          // extract default i18n strings file name
          if (application_app && application_app.Localization) {
            found = true;

            let LocalizationPath = path.join(bundleBuildOutputPath, application_app.Localization);
            let i18nPath = path.dirname(LocalizationPath);
            let baseName = path.basename(LocalizationPath, '.properties');
            if (isDirectory(i18nPath)) {
              let filenames = fs.readdirSync(i18nPath);
              filenames.forEach(function (fileName) {
                let filePath = path.join(i18nPath, fileName);

                //skip hidden files, e.g. .DS_Store
                if (fs.statSync(filePath).isFile() && fileName.charAt(0) !== '.') {
                  let i18nStrings = fs.readFileSync(filePath, 'utf8');
                  let i18nUnfilteredArr = i18nStrings.split('\n');
                  let i18nArr = i18nUnfilteredArr.filter(str => !str.startsWith('#') && str.trim() != '');

                  let langFile = '';
                  if (bIos) {
                    // remove i18n folder, remove file name, remove extension, replace _ with -
                    let languageCode = fileName.replace(baseName + '_', '')
                                        .replace(baseName, '')
                                        .replace('.properties', '')
                                        .replace('_', '-');
                    languageCode = languageCode || 'en';
                    // hardcoded language (assuming its the same language code applied to default string file)
                    if (languageCode) {
                      // create Localizable.strings files
                      let langPath = path.join(appResourcesDirectoryPath, 'iOS', languageCode + '.lproj');
                      const langFileName = 'Localizable.strings';
                      langFile = path.join(langPath, langFileName);
                      console.log('Creating ' + languageCode + '.lproj/Localizable.strings');
                      if (!fs.existsSync(langPath)) {
                        fs.mkdirSync(langPath);
                      }

                      const targetOrginalPath = path.join(langPath, '__temp__.strings');
                      let needMerge = false;
                      if (fs.existsSync(langFile)) {
                        needMerge = true;
                        shelljs.mv(langFile, targetOrginalPath);
                      } else {
                        fs.writeFileSync(langFile, '/* ' + fileName + ' */\n\n');
                      }

                      for (const i18nString of i18nArr) {
                        let i18nStringSeparatorIdx = i18nString.indexOf('=');
                        let firstString = i18nString.substr(0, i18nStringSeparatorIdx).trim();
                        if (firstString) {
                          // use substr instead of split by '=' to ensure we could take all the value
                          // if the value consists of '=' sign(s) as well
                          let secondString = i18nString
                              .substr(i18nStringSeparatorIdx + 1, i18nString.length - i18nStringSeparatorIdx + 1)
                              .replace(/{\d*}/g, '%@')
                              .trim();

                          fs.appendFileSync(langFile, '"' + firstString + '" = "' + secondString + '";\n\n');
                        } else {
                          fs.appendFileSync(langFile, '/* ' + i18nString + ' */\n\n');
                        }
                      }

                      if (needMerge) {
                        that.mergeStrings(that.checkStringsComment, targetOrginalPath, langFile, undefined, langFile);
                        shelljs.rm('-f', targetOrginalPath);
                      }
                    }
                  }
                  if (bAndroid) {
                    // remove i18n folder, remove file name, remove extension, replace _ with +
                    let languageCode = fileName.replace(baseName + '_', '')
                                        .replace(baseName, '')
                                        .replace('.properties', '')
                                        .replace(new RegExp('_', 'g'), '+');
                    if (languageCode) {
                      languageCode = '-b+' + languageCode;
                    }
                    // create i18n.xml files
                    let langPath = path.join(appResourcesDirectoryPath, 'Android/src/main/res',
                        'values' + languageCode);
                    let langFile = path.join(langPath, 'i18n.xml');
                    console.log('Creating values' + languageCode + '/i18n.xml');
                    if (!fs.existsSync(langPath)) {
                      fs.mkdirSync(langPath);
                    }
                    fs.writeFileSync(langFile, '<resources>\n');
                    for (const i18nString of i18nArr) {
                      let i18nStringSeparatorIdx = i18nString.indexOf('=');
                      let firstString = i18nString.substr(0, i18nStringSeparatorIdx).trim();
                      if (firstString) {
                        let secondString = i18nString
                            .substr(i18nStringSeparatorIdx + 1, i18nString.length - i18nStringSeparatorIdx + 1)
                            .replace(/{\d*}/g, function (x) {
                              var idx = parseInt(x.replace('{','').replace('}','')) + 1;
                              return '%' + idx + '$s';
                            })
                            // aposthrope, @, and question mark are auto escaped with outer double quote added on string value
                            .replace(/&/g, '&amp;')
                            .replace(/</g, '&lt;')
                            .replace(/>/g, '&gt;')
                            .replace(/"/g, '\\"')
                            .trim();
                        fs.appendFileSync(langFile, '<string name="' + firstString + '">"' + secondString +
                            '"</string>\n');
                      } else {
                        fs.appendFileSync(langFile, '<!--' + i18nString + ' -->\n');
                      }
                    }
                    fs.appendFileSync(langFile, '</resources>\n');
                  }
                }
              });
            }
          }
        }

        if (!found) {
          console.log('Application definition not found!');
        }

        resolve();
      }).then(() => {
        this.bundler.cleanTempFiles();
        return this.prepare_secondary_i18n();
      });
    }
  }

  prepare_secondary_i18n() { //for i18n not included in metadata, e.g. InfoPlist.strings
    const sAppResourcesSourceDir = path.join(this.sMdkProject, 'App_Resources');
    const sAppResourcesMergeSourceDir = path.join(this.sMdkProject, 'App_Resources_Merge');
    const bIos = this.ios;
    const sAppPath = this.sAppPath;
    const appResourcesDirectoryPath = `${sAppPath}/app/App_Resources`;
    const sourcePath = appResourcesDirectoryPath + '/iOS/i18n/';
    const that = this;
    return new Promise(function (resolve, reject) {
      if (bIos) {
        //for every .lproj folder in 'i18n' directory, check if folder of same name exists in 'App_Resources'
        if (isDirectory(sourcePath)) {
          let filenames = fs.readdirSync(sourcePath);
          filenames.forEach(function (folder) {
            if (fs.statSync(sourcePath + folder).isDirectory()) {
              let sourceFile = path.join(sourcePath, folder, '/InfoPlist.strings');
              let langPath = path.join(appResourcesDirectoryPath, 'iOS', folder);
              let langFile = path.join(langPath, 'InfoPlist.strings');
              if (!fs.existsSync(langPath)) return;
              if (fs.existsSync(sourceFile)) {
                const replaceSrcPath = path.join(sAppResourcesSourceDir, path.relative(appResourcesDirectoryPath, langFile));
                const mergeSrcPath = path.join(sAppResourcesMergeSourceDir, path.relative(appResourcesDirectoryPath, langFile));

                if (!fs.existsSync(replaceSrcPath)) {
                  if (fs.existsSync(mergeSrcPath)) {
                    that.mergeStrings(that.checkStringsComment, mergeSrcPath, sourceFile, langFile, langFile);
                  } else {
                    fs.copySync(sourceFile, langFile);
                  }
                  console.log('Creating ' + folder + '/InfoPlist.strings');
                }
              }
            }
          });
        }
      }
      resolve();
    });
  }

  copyLoaders() {
    console.log('Copy loaders to project directory');
    const srcLoaderPath = path.resolve(this.sSdkPath, 'tools', 'application-bundler', 'loaders');
    shelljs.cp('-rf', srcLoaderPath, this.sAppPath);
    if (shelljs.error()) {
      console.error("Failed to copy loaders to project directory");
    }
  }

  prepare() {
    this.copyLoaders();

    if (this.ios) {
      this.updateInfoPlist();
    }

    if (this.android) {
      this.updateSettingFiles();
    }

    console.log('Running tns prepare step');
    const sConfigArgument = `--${this.sConfiguration.toLowerCase()}`;

    if (this.ios) {
      exec(`tns prepare ios ${sConfigArgument}`,
      'Failed to run tns prepare ios', this.oExecInProject);

      // This fix for SAPMDC arm64 (ITMS-90700) issue when uploading to iTunes Connect
      console.log('Running pod update step (run it quickly if update to the latest version of cocoapods)');
      exec('pod update', 'Failed to run pod update!', { cwd: path.join(this.sAppPath, 'platforms', 'ios'), }, true);
    }

    if (this.android) {
      exec(`tns prepare android ${sConfigArgument}`,
      'Failed to run tns prepare android', this.oExecInProject);
    }
  }

  populateTemplateFiles() {
    if (this.ios) {
      console.log('Customizing Root.plist file for iOS Settings app');
      const sSettingsFile = `${this.sAppPath}/app/App_Resources/iOS/Settings.bundle/Root.plist`;
      exec(`/usr/libexec/PlistBuddy -c "Set :PreferenceSpecifiers:0:Title ${this.sAppName}" "${sSettingsFile}"`,
          `Failed to add app name to ${sSettingsFile}`);
      exec(`/usr/libexec/PlistBuddy -c "Set :PreferenceSpecifiers:1:DefaultValue ${this.sAppVersion}" "${sSettingsFile}"`,
          `Failed to add app version to ${sSettingsFile}`);
      if (!program.update && this.sSdk === 'iphonesimulator') {
        console.log('Customizing app.entitlements to enable keychain sharing for simulator');
        const sEntitlementsFile = `${this.sAppPath}/app/App_Resources/iOS/app.entitlements`;
        exec(`sed -i.bak 's/\\([^/]*$(AppIdentifierPrefix)\\)\\([^/]*\\)\\(<[^/]*\\)/\\1${this.sBundleID}\\3/' "${sEntitlementsFile}"`);
        exec(`rm "${sEntitlementsFile}.bak"`)
      }
    }

    if (this.android) {
      console.log('Customizing VersionInfo.json file for Android Settings app');
        const sSettingsFile = `${this.sAppPath}/app/App_Resources/Android/src/main/assets/VersionInfo.json`;
        updateJsonFile(sSettingsFile, (data) => {
          data.Root.forEach(obj => {
            if (obj["Application Version"]) {
              obj["Application Version"] = this.sAppVersion;
            }
          });
          return data;
        });
    }
  }

  updateSDKFiles() {
    console.log("Updating SAPFiori.h");
    let filePath = `${this.sAppPath}/plugins/SAP/platforms/ios/SAPFiori.framework/Headers/SAPFiori.h`;
    if (fs.existsSync(filePath)) {
      let fileData = fs.readFileSync(filePath, 'utf-8');

      const re = new RegExp("import <MapKit/MapKit.h>", "g");
      if (!re.test(fileData)) {
        fileData += '\n#import <MapKit/MapKit.h>\n';
        fs.writeFileSync(filePath, fileData, 'utf-8');
      }
    }
  }

  printNextSteps() {
    console.log('See README_SDK_Installer.md for instructions on building and running the app.');
  }

  appNameCondensed() {
    return this.sAppName.split(' ').join('').split('.').join('');
  }

  updateInfoPlist() {
    console.log('Customizing Info.plist file');
    // Update the App_Resources/iOS/Info.plist, this is the file that is used to create the
    // in the platforms/ios/{AppName}/{AppName}-Info.plist file from the tns commands
    const sFilePath = `${this.sAppPath}/app/App_Resources/iOS/Info.plist`;

    if (!toolUtils.isFile(sFilePath)) {
      fail(`Failed to find Info.plist file at ${sFilePath}`);
    }

    console.log(`Updating ${sFilePath} to use URL Scheme: ${this.sUrlScheme}`);
    exec(`/usr/libexec/PlistBuddy -c "Set :CFBundleDisplayName ${this.sAppName}" "${sFilePath}"`);
    exec(`/usr/libexec/PlistBuddy -c "Set :CFBundleShortVersionString ${this.sAppVersion}" "${sFilePath}"`);
    exec(`/usr/libexec/PlistBuddy -c "Set :CFBundleURLTypes:0:CFBundleURLSchemes:0 ${this.sUrlScheme}" "${sFilePath}"`);
  }
}

exports.CreateClient = CreateClient;

if (require.main === module) {
  const c = new CreateClient();
  return c.create();
}