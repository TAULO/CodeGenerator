
//@include lib_Class.js
//@include lib_sol.common.JsonUtils.js

/**
 * File utilities
 *
 * @author MW, ELO Digital Office GmbH
 * @version 1.0
 *
 * @elojc
 * @eloas
 * @eloix
 */
sol.define("sol.common.FileUtils", {

  singleton: true,

  bom: "\uFEFF", // ByteOrderMark (BOM);


  /**
   * Clean path parts in a given array
   * @param {Array} pathPartsArr Array of path parts
   * @param {String} replacement Replacement string
   * @return {Array} Clean path parts array
   */
  cleanPathParts: function (pathPartsArr, replacement) {
    var me = this,
        cleanPathPartsArr = [],
        i, cleanPathPart;

    pathPartsArr = pathPartsArr || [];

    for (i = 0; i < pathPartsArr.length; i++) {
      cleanPathPart = me.sanitizeFilename(pathPartsArr[i], replacement);
      cleanPathPartsArr.push(cleanPathPart);
    }

    return cleanPathPartsArr;
  },

  /**
   * Cleans the given file name so that the name contains only valid file name chars.
   * @param {String} fileName File name to clean
   * @param {String} replacement Replacement string
   * @return {String} Sanitized filename
   */
  sanitizeFilename: function (fileName, replacement) {
    var me = this,
        cleanFileName;

    me.logger.enter("sanitizeFilename", arguments);

    replacement = replacement || " ";
    cleanFileName = String(fileName).replace(/[\/\?<>\\:\*\|":]/g, replacement);
    me.logger.exit("sanitizeFilename", cleanFileName);

    return cleanFileName;
  },

  /**
   * Extracts the file name from a file object (without the file extension)
   * @param {java.io.File} file File
   * @return {String} The name of the file
   */
  getName: function (file) {
    var me = this,
        nameWithoutExtension;

    if (!file) {
      return "";
    }

    me.logger.enter("getName", arguments);

    nameWithoutExtension = Packages.org.apache.commons.io.FilenameUtils.removeExtension(file.name) + "";

    me.logger.exit("getName", nameWithoutExtension);

    return nameWithoutExtension;
  },

  /**
   * Extracts the file extension from a file object
   * @param {java.io.File} file File
   * @return {String} The file extension
   */
  getExtension: function (file) {
    var me = this,
        extension;

    if (!file) {
      return "";
    }

    me.logger.enter("getExtension", file.canonicalPath + "");

    extension = Packages.org.apache.commons.io.FilenameUtils.getExtension(file.name) + "";

    me.logger.exit("getExtension", extension + "");

    return extension;
  },

  /**
   * Extracts the file extension from a path
   * @param {String} filePath File path
   * @return {String} File extension
   */
  getExtensionFromPath: function (filePath) {
    var me = this,
        extension;

    if (!filePath) {
      return "";
    }

    me.logger.enter("getExtensionFromPath", filePath);

    extension = Packages.org.apache.commons.io.FilenameUtils.getExtension(filePath) + "";

    me.logger.exit("getExtensionFromPath", extension);

    return extension;
  },

  /**
   * Change the extension of a file.
   * @param {java.io.File} file Source file
   * @param {String} extension New file extension
   * @return {File}
   */
  changeExtension: function (file, extension) {
    var me = this,
        _result;
    me.logger.enter("changeExtension", arguments);
    _result = new File(me.removeExtension(file.absolutePath) + extension);
    me.logger.exit("changeExtension", _result + "");
    return _result;
  },

  /**
   * Removes the extension of a file or file path
   * @param {java.io.File|String} file File or file path
   * @return {String} File path without extension
   */
  removeExtension: function (file) {
    var filePath, pathWithoutExtension;

    filePath = (file instanceof java.io.File) ? file.canonicalPath : file;

    pathWithoutExtension = Packages.org.apache.commons.io.FilenameUtils.removeExtension(filePath);
    return pathWithoutExtension;
  },

  /**
   * Returns a timestamp of the current time as string.
   * @param {String} pattern Timestamp pattern
   * @return {String} Timestamp as string
   */
  getTimeStampString: function (pattern) {
    var me = this,
        _result;
    me.logger.enter("getTimeStampString", arguments);
    pattern = pattern || "yyyyMMddHHmmss";
    try {
      _result = String(Packages.org.apache.commons.lang3.time.DateFormatUtils.format(new java.util.Date(), pattern));
    } catch (ex) {
      _result = String(Packages.org.apache.commons.lang.time.DateFormatUtils.format(new java.util.Date(), pattern));
    }
    me.logger.exit("getTimeStampString", _result);
    return _result;
  },

  /**
   * Returns true if the path exists
   * @param {String} path Path
   * @return {Boolean}
   */
  exists: function (path) {
    var me = this,
        _result;
    me.logger.enter("exists", arguments);
    _result = new File(path).exists();
    me.logger.exit("exists", _result);
    return _result;
  },

  /**
   * Returns the path of the parent
   * @param {java.io.File} path Path
   * @return {String}
   */
  getParentPath: function (path) {
    return String(new File(path).parent);
  },

  /**
   * Writes a string into a file
   * @param {String} filePath File path
   * @param {String} content Text content
   * @param {Object} params Parameters
   * @param {Boolean} params.bom Add byte order mark
   * @param {Boolean} [params.encoding=UTF-8] Encoding
   */
  writeStringToFile: function (filePath, content, params) {
    var me = this;

    if (!filePath) {
      throw "File path is empty";
    }
    content = content || "";
    params = params || {};
    params.encoding = params.encoding || "UTF-8";

    content = (params.bom) ? me.bom + content : content;

    Packages.org.apache.commons.io.FileUtils.writeStringToFile(new File(filePath), content, params.encoding);
  },

  /**
   * Writes a string into a file
   * @param {String} path Path
   * @param {String} stringArray String array
   */
  writeStringArrayToFile: function (path, stringArray) {
    var me = this;
    me.logger.enter("writeStringArrayToFile", arguments);
    Packages.org.apache.commons.io.FileUtils.writeStringToFile(new File(path), stringArray.join("\r\n"), "UTF-8");
    me.logger.exit("writeStringArrayToFile");
  },

  /**
   * Writes a configuation into a file
   * @param {String} path Path
   * @param {String} config Configuration object
   */
  writeConfigToFile: function (path, config) {
    var me = this,
        content;
    me.logger.enter("writeConfigToFile", arguments);
    content = sol.common.JsonUtils.stringifyAll(config, { tabStop: 2 });
    me.writeStringToFile(path, content);
    me.logger.exit("writeConfigToFile");
  },

  /**
   * Rename a file
   * @param {String} path Path
   * @param {String} newName New file name
   * @return {java.io.File}
   */
  rename: function (path, newName) {
    var me = this,
        srcFile, dstFile;
    me.logger.enter("rename", arguments);
    srcFile = new File(path);
    dstFile = new File(srcFile.parentFile.absolutePath + File.separator + newName);
    if (dstFile.exists()) {
      dstFile.delete();
    }
    Packages.org.apache.commons.io.FileUtils.moveFile(srcFile, dstFile);
    me.logger.exit("rename", dstFile + "");
    return dstFile;
  },

  /**
   * Deletes a file
   * @param {java.io.File|String} file File or file path
   * @param {Object} params Parameters
   * @param {Boolean} params.quietly Delete quietly
   */
  delete: function (file, params) {
    var me = this;

    params = params || {};
    if (!file) {
      return;
    }

    me.logger.enter("delete", arguments);

    if (!(file instanceof java.io.File)) {
      file = new java.io.File(new java.lang.String(file));
    }

    if (params.quietly) {
      Packages.org.apache.commons.io.FileUtils.deleteQuietly(file);
    } else {
      file["delete"]();
    }
    me.logger.exit("delete");
  },

  /**
   * Deletes files
   * @param {Object} config Config
   * @param {String} config.dirPath Directory path
   * @param {String} config.prefix Prefix
   * @param {String} config.suffix Suffix
   */
  deleteFiles: function (config) {
    var me = this,
        filesIterator;
    me.logger.enter("deleteFiles", arguments);

    if (config.dirPath && config.prefix) {
      filesIterator = Packages.org.apache.commons.io.FileUtils.iterateFiles(new File(config.dirPath),
        new Packages.org.apache.commons.io.filefilter.PrefixFileFilter(config.prefix, Packages.org.apache.commons.io.IOCase.INSENSITIVE), null);
    }
    if (config.dirPath && config.suffix) {
      filesIterator = Packages.org.apache.commons.io.FileUtils.iterateFiles(new File(config.dirPath),
        new Packages.org.apache.commons.io.filefilter.SuffixFileFilter(config.suffix, Packages.org.apache.commons.io.IOCase.INSENSITIVE), null);
    }
    if (!filesIterator) {
      me.logger.exit("deleteFiles");
      return;
    }
    while (filesIterator.hasNext()) {
      Packages.org.apache.commons.io.FileUtils.deleteQuietly(filesIterator.next());
    }
    me.logger.exit("deleteFiles");
  },

  contentTypeExtensions: {
    bmp: "image/bmp",
    ico: "image/x-ico",
    jpg: "image/jpeg",
    png: "image/png"
  },

  /**
   * Loads a file to a FileData structure
   * @param {String} filePath File path
   * @param {String} contentType Content type
   * @return {de.elo.ix.client.FileData}
   */
  loadToFileData: function (filePath, contentType) {
    var me = this,
        fileData;
    me.logger.enter("loadToFileData", arguments);
    fileData = new FileData();
    if (!contentType) {
      contentType = me.contentTypeExtensions[me.getExtensionFromPath(filePath).toLowerCase()];
    }
    fileData.contentType = contentType;
    fileData.data = Packages.org.apache.commons.io.FileUtils.readFileToByteArray(new File(filePath));
    me.logger.exit("loadToFileData", fileData);
    return fileData;
  },

  /**
   * Save file data to file
   * @param {de.elo.ix.client.FileData} fileData
   * @param {String} filePath
   */
  saveFileData: function (fileData, filePath) {
    if (!fileData) {
      throw "fileData is empty";
    }
    if (!filePath) {
      throw "filePath is empty";
    }
    Packages.org.apache.commons.io.FileUtils.writeByteArrayToFile(new File(filePath), fileData.data);
  },

  /**
   * Reads a file into a string
   * @param {String} filePath FilePath
   * @param {Object} params Parameters
   * @param {String} params.encoding Encoding
   * @return {String}
   */
  readFileToString: function (filePath, params) {
    var me = this,
        str;
    me.logger.enter("readFileToString", arguments);
    params = params || {};
    params.encoding = params.encoding || "UTF-8";
    str = String(Packages.org.apache.commons.io.FileUtils.readFileToString(new File(filePath), params.encoding));

    me.logger.exit("readFileToString");
    return str;
  },

  /**
   * Reads a file into an object
   * @param {String} filePath FilePath
   * @param {Object} params Parameters
   * @param {String} params.encoding Encoding
   * @return {String}
   */
  readFileToObject: function (filePath, params) {
    var me = this,
        str, obj;

    str = me.readFileToString(filePath, params);

    obj = JSON.parse(str);

    return obj;
  },

  /**
   * Writes an object into a file
   * @param {Object} obj Object
   * @param {String} filePath File path
   */
  writeObjectToFile: function (obj, filePath) {
    var me = this,
        json;

    json = sol.common.JsonUtils.stringifyAll(obj, { tabStop: 2 });
    me.writeStringToFile(filePath, json);
  },

  /**
   * Reads a file into a string
   * @param {String} filePath FilePath
   * @return {String}
   */
  readConfig: function (filePath) {
    var me = this,
        content, _result;
    me.logger.enter("readConfig", arguments);
    content = me.readFileToString(filePath);
    _result = JSON.parse(content);
    me.logger.exit("readConfig", _result);
    return _result;
  },

  /**
   * Returns the URL of a file
   * @param {String} filePath File path
   * @return {String} URL
   */
  getUrlFromFilePath: function (filePath) {
    var url;

    if (!filePath) {
      throw "File path is empty";
    }
    url = String(new File(filePath).toURI().toURL().toString());
    return url;
  },

  /**
   * Returns the temp directory path
   * @return {String} Temp directory path
   */
  getTempDirPath: function () {
    var tempDirPath;
    tempDirPath = String(java.lang.System.getProperty("java.io.tmpdir"));
    return tempDirPath;
  },

  /**
   * Creates a temporary directory
   * @param {Object} params Parameters
   * @param {String} params.prefix Prefix
   * @return {java.io.File} Temporary directory
   */
  createTempDir: function (params) {
    var me = this,
        tempDirBasePath, timestamp, tempDirPath, tempDir;

    params = params || {};
    params.prefix = params.prefix || "temp";
    tempDirBasePath = me.getTempDirPath();
    timestamp = me.getTimeStampString();
    tempDirPath = tempDirBasePath + File.separator + params.prefix + "_" + timestamp;
    tempDir = new File(tempDirPath);
    Packages.org.apache.commons.io.FileUtils.forceMkdir(tempDir);
    return tempDir;
  },

  /**
   * Makes directories
   * @param {java.io.File} dir Directory
   */
  makeDirectories: function (dir) {
    Packages.org.apache.commons.io.FileUtils.forceMkdir(dir);
  },

  /**
   * Copies a file
   * @param {java.io.File} srcFile
   * @param {java.io.File} dstFile
   */
  copyFile: function (srcFile, dstFile) {
    if (!srcFile) {
      throw "Source file is empty";
    }
    if (!dstFile) {
      throw "Destination file is empty";
    }
    Packages.org.apache.commons.io.FileUtils.copyFile(srcFile, dstFile);
  },

  /**
   * Download documents
   *
   * @param {String} objId Folder or object ID
   * @param {String} dstDirPath Destination directory path
   * @param {Object} params Parameters
   * @param {Boolean} [params.makeDstDirs=true] Make directories
   * @param {Boolean} params.cleanDstDir Clean destination directory
   * @param {Boolean} params.includeReferences Include references
   */
  downloadDocuments: function (objId, dstDirPath, params) {
    var me = this,
        sord, children, dstDir, findConfig;

    if (!objId) {
      throw "Folder ID is empty";
    }

    if (!dstDirPath) {
      throw "Destination directory path is empty";
    }

    dstDir = new java.io.File(dstDirPath);

    params = params || {};
    params.makeDstDirs = (params.makeDstDirs == false) ? false : true;

    if (params.makeDstDirs) {
      sol.common.FileUtils.makeDirectories(dstDir);
    }

    if (params.cleanDstDir) {
      sol.common.FileUtils.deleteFiles({ dirPath: dstDirPath });
    }

    try {
      sord = ixConnect.ix().checkoutSord(objId, SordC.mbLean, LockC.NO);

      if (sol.common.SordUtils.isFolder(sord)) {
        findConfig = { includeFolders: false, includeDocuments: true };
        if (params.includeReferences) {
          findConfig.includeReferences = true;
        }
        children = sol.common.RepoUtils.findChildren(sord.id, findConfig);
        if (children) {
          children.forEach(function (child) {
            me.downloadDocument(child.id, dstDirPath);
          });
        }
      } else {
        me.downloadDocument(sord.id, dstDirPath);
      }
    } catch (ex) {
    }
  },

  /**
   * Download file
   * @param {String} objId Object ID
   * @param {String} dstDirPath Destination directory path
   * @return {File} Downloaded document;
   */
  downloadDocument: function (objId, dstDirPath) {
    var me = this,
        editInfo, docVersion, sordName, dstFile;

    editInfo = ixConnect.ix().checkoutDoc(objId, null, new EditInfoZ(EditInfoC.mbDocumentMembers, SordC.mbLean), LockC.NO);
    docVersion = editInfo.document.docs[0];
    sordName = me.sanitizeFilename(editInfo.sord.name);
    dstFile = new java.io.File(dstDirPath + java.io.File.separator + sordName + "." + docVersion.ext);
    ixConnect.download(docVersion.url, dstFile);

    return dstFile;
  },

  /**
   * Reads a manifest file
   * @param {String} filePath Manifest file path
   * @return {java.util.Map<Object,Object>} Attributes
   */
  readManifestFile: function (filePath) {
    var manifestFile, attributes;

    manifestFile = new java.util.jar.Manifest(new java.io.FileInputStream(new java.io.File(filePath)));
    attributes = manifestFile.mainAttributes;

    return attributes;
  }
});

/**
 * Represents an Ini file
 * @elojc
 * @eloas
 * @eloix
 */
sol.define("sol.common.IniFile", {

  initialize: function (config) {
    var me = this;
    me.$super("sol.Base", "initialize", [config]);
  },

  /**
   * Parses an INI file
   * @param {String} content Content
   */
  parse: function (content) {
    var me = this,
        lines, i, line, sectionName, sectionArr, equalSignPos, fields;

    if (!content) {
      throw "Content is empty";
    }

    me.sections = [];

    content += "";
    lines = content.split(/\r?\n/);
    for (i = 0; i < lines.length; i++) {
      line = lines[i];
      sectionName = me.getSectionName(line);
      if (sectionName) {
        sectionArr = [sectionName, []];
        me.sections.push(sectionArr);
        continue;
      }
      equalSignPos = line.indexOf("=");
      if (equalSignPos > -1) {
        fields = [line.substring(0, equalSignPos), line.substring(equalSignPos + 1)];
        if (!sectionArr) {
          throw "Section is missing: " + line;
        }
        sectionArr[1].push(fields);
      }
    }
  },

  getSectionName: function (line) {
    var endBracketPos, sectionName;

    if (!line) {
      return;
    }
    if (line.indexOf("[") != 0) {
      return;
    }
    endBracketPos = line.indexOf("]");
    if (endBracketPos > 0) {
      sectionName = line.substring(1, endBracketPos);
      return sectionName;
    }
    return "";
  },

  getValue: function (sectionName, key) {
    var me = this,
        entry, section, i;

    if (typeof key == "undefined") {
      throw "Key name is empty";
    }

    key += "";

    section = me.getSection(sectionName);
    if (!section) {
      return;
    }

    for (i = 0; i < section.length; i++) {
      entry = section[i];
      if (entry[0] == key) {
        return entry[1];
      }
    }

    return "";
  },

  setValue: function (sectionName, key, value) {
    var me = this,
        entry, section, i;

    if (typeof key == "undefined") {
      throw "Key name is empty";
    }

    key += "";

    section = me.getSection(sectionName);
    if (!section) {
      return;
    }

    for (i = 0; i < section.length; i++) {
      entry = section[i];
      if (entry[0] == key) {
        entry[1] = value;
      }
    }
  },

  getSection: function (sectionName) {
    var me = this,
        section, i;

    if (!sectionName) {
      throw "Section name is empty";
    }

    for (i = 0; i < me.sections.length; i++) {
      section = me.sections[i];
      if (section[0] == sectionName) {
        return section[1];
      }
    }
  },

  bom: "\uFEFF", // ByteOrderMark (BOM)

  stringify: function () {
    var me = this,
        lines = [],
        content, sectionArr, sectionName, sectionEntries, entry, i, j;


    for (i = 0; i < me.sections.length; i++) {
      sectionArr = me.sections[i];
      sectionName = sectionArr[0];
      sectionEntries = sectionArr[1];
      lines.push("[" + sectionName + "]");
      for (j = 0; j < sectionEntries.length; j++) {
        entry = sectionEntries[j];
        lines.push(entry[0] + "=" + entry[1]);
      }
    }

    content = me.bom + lines.join("\r\n") + "\r\n";

    return content;
  }
});
