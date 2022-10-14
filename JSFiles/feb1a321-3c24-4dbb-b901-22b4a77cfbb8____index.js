"use strict";

const util = require("util");
const chalk = require("chalk");
const os = require("os");
const fs = require("fs");
const { pathToFileURL, fileURLToPath } = require("url");
const vm = require("vm");
const crypto = require("crypto");
const Module = require("module");
const {
  basename: pathBasename,
  dirname: pathDirname,
  resolve: pathResolve,
  join: pathJoin,
  extname: pathExtname,
  isAbsolute: pathIsAbsolute,
  sep: pathSep,
  posix: pathPosix,
} = require("path");

const { isBuffer } = Buffer;
const { defineProperty, setPrototypeOf } = Reflect;
const { isArray, from: arrayFrom } = Array;
const _Error = Error;
const { captureStackTrace } = _Error;

const { stringify: JSONstringify } = JSON;
const { existsSync: fsExistsSync } = fs;

const _posixNodeModulesPath = "/node_modules/";
const _mainFields = ["source", "module", "main"];
const _resolveCache = new Map();
const _loaders = new Map();
const _extensionlessLoaders = [];
const _emptyContents = { contents: "" };
const _allFilesFilter = { filter: /.*/ };
const _nodeTargetVersion = `node${process.version.slice(1)}`;

let _registered_esrun;
let _registered_exit = false;
let _registered_errors = false;
let _builtinModules;
let _sourceMaps;

defineProperty(exports, "__esModule", { value: true });
defineProperty(exports, "default", { value: exports });

defineProperty(exports, "chalk", { value: chalk, configurable: true, enumerable: false, writable: true });

let _fastglob;

exports.pathNameToUrl = pathNameToUrl;

exports.pathNameFromUrl = pathNameFromUrl;

function pathNameToUrl(file) {
  if (!file) {
    return undefined;
  }
  if (typeof file === "object") {
    file = `${file}`;
  }
  if (file.indexOf("://") < 0) {
    try {
      return pathToFileURL(file).href;
    } catch {}
  }
  return file;
}

function pathNameFromUrl(url) {
  if (!url || url.startsWith("node:")) {
    return undefined;
  }
  if (url.indexOf("://") < 0) {
    const indexOfQuestionMark = url.indexOf("?");
    return indexOfQuestionMark > 0 ? url.slice(0, indexOfQuestionMark - 1) : url;
  }
  if (url.startsWith("file://")) {
    try {
      return fileURLToPath(url);
    } catch {}
  }
  return undefined;
}

const _devInspectForLogging = (args) =>
  args.map((what) => (typeof what === "string" ? what : exports.devInspect(what))).join(" ");

exports.devInspect = function devInspect(what) {
  if (what instanceof _Error) {
    if (what.showStack === false) {
      return `${what}`;
    }
    what = exports.devGetError(what, devInspect);
  }
  return util.inspect(what, exports.devInspect.options);
};

exports.devInspect.options = {
  colors: !!chalk.supportsColor && chalk.supportsColor.hasBasic,
  depth: Math.max(8, util.inspect.defaultOptions.depth || 0),
};

exports.devLog = function devLog(...args) {
  console.log(_devInspectForLogging(args));
};

exports.devLogError = function devLogError(...args) {
  console.error(chalk.redBright(`❌ ${chalk.underline("ERROR")}: ${_devInspectForLogging(args)}`));
};

exports.devLogWarning = function devLogWarning(...args) {
  console.warn(
    chalk.rgb(
      200,
      200,
      50,
    )(`${chalk.yellowBright(`⚠️  ${chalk.underline("WARNING")}:`)} ${_devInspectForLogging(args)}`),
  );
};

exports.devLogInfo = function devLogInfo(...args) {
  console.info(chalk.cyan(`${chalk.cyanBright(`ℹ️  ${chalk.underline("INFO")}:`)} ${_devInspectForLogging(args)}`));
};

exports.devGetError = function devGetError(error, caller) {
  if (!(error instanceof _Error)) {
    error = new Error(error);
    Error.captureStackTrace(error, typeof caller === "function" ? caller : devGetError);
  }
  // Hide some unuseful properties
  if (error.watchFiles) {
    defineProperty(error, "watchFiles", {
      value: error.watchFiles,
      configurable: true,
      enumerable: false,
      writable: true,
    });
  }
  if ("codeFrame" in error) {
    defineProperty(error, "codeFrame", {
      value: error.codeFrame,
      configurable: true,
      enumerable: false,
      writable: true,
    });
  }
  return error;
};

exports.makePathRelative = function makePathRelative(filePath, cwd) {
  if (!filePath) {
    return "./";
  }
  if (filePath.indexOf("\\") >= 0) {
    return filePath; // avoid doing this on windows
  }
  try {
    const relativePath = pathPosix.normalize(pathPosix.relative(cwd || process.cwd(), filePath));
    return relativePath && relativePath.length < filePath.length ? relativePath : filePath;
  } catch (_) {
    return filePath;
  }
};

exports.handleUncaughtError = (error) => {
  if (!process.exitCode) {
    process.exitCode = 1;
  }
  exports.devLogError("Uncaught", error);
};

exports.emitUncaughtException = (error) => {
  try {
    if (process.listenerCount("uncaughtException") === 0) {
      process.once("uncaughtException", exports.handleUncaughtError);
    }
    process.emit("uncaughtException", error);
  } catch (emitError) {
    console.error(emitError);
    try {
      exports.handleUncaughtError(error);
    } catch {}
  }
};

let _devRunMainRunning = 0;

function devRunMain(main) {
  if (main !== null && typeof main === "object") {
    if (typeof main.exports === "function") {
      main = main.exports;
    } else {
      main = () => main;
    }
  }

  let handledError;
  let completed = false;

  const complete = (arg) => {
    if (!completed) {
      completed = true;
      --_devRunMainRunning;
    }
    return arg;
  };

  const devRunMainError = (error) => {
    if (handledError !== error) {
      handledError = error;
      error = exports.devGetError(error, devRunMain);
      exports.handleUncaughtError(error);
      console.error();
    }
    return complete(error);
  };

  let result;
  ++_devRunMainRunning;
  try {
    exports.esrunRegister({ errors: true, exit: true });
    console.info();
    result = main();
    if (typeof result === "object" && result !== null) {
      if (typeof result.catch === "function") {
        ++_devRunMainRunning;
        return result.catch(devRunMainError);
      } else if (typeof result.then === "function") {
        return result.then(complete, devRunMainError);
      }
    }
  } catch (error) {
    return Promise.resolve(devRunMainError(error));
  }
  return complete(Promise.resolve(result));
}

defineProperty(devRunMain, "running", {
  get: () => _devRunMainRunning > 0,
  configurable: false,
  enumerable: true,
});

exports.devRunMain = devRunMain;

/**
 * Gets the file url of the caller
 * @param {Function} [caller] The caller function.
 * @returns
 */
exports.getCallerFileUrl = function getCallerFileUrl(caller) {
  const oldStackTraceLimit = _Error.stackTraceLimit;
  const oldPrepare = _Error.prepareStackTrace;
  try {
    const e = {};
    _Error.stackTraceLimit = 3;
    _Error.prepareStackTrace = (_, clallSites) => clallSites;
    captureStackTrace(e, typeof caller === "function" ? caller : exports.getCallerFileUrl);
    const stack = e.stack;
    return (stack && _convertStackToFileUrl(stack)) || undefined;
  } catch (_) {
    // Ignore error
  } finally {
    _Error.prepareStackTrace = oldPrepare;
    _Error.stackTraceLimit = oldStackTraceLimit;
  }
  return undefined;
};

exports.getCallerFilePath = function getCallerFilePath(caller) {
  return pathNameFromUrl(exports.getCallerFileUrl(typeof caller === "function" ? caller : exports.getCallerFilePath));
};

let _wrapCallSite = (item) => item;

const _parseStackTraceRegex =
  /^\s*at (?:((?:\[object object\])?[^\\/]+(?: \[as \S+\])?) )?\(?(.*?):(\d+)(?::(\d+))?\)?\s*$/i;

function _convertStackToFileUrl(stack) {
  if (isArray(stack)) {
    const state = { nextPosition: null, curPosition: null };
    for (let i = 0; i < stack.length; ++i) {
      const entry = _wrapCallSite(stack[i], state);
      if (entry) {
        const file = pathNameToUrl(
          entry.getFileName() || entry.getScriptNameOrSourceURL() || (entry.isEval() && entry.getEvalOrigin()),
        );
        if (file) {
          return file;
        }
      }
    }
  } else if (typeof stack === "string") {
    stack = stack.split("\n");
    for (let i = 0; i < stack.length; ++i) {
      const parts = _parseStackTraceRegex.exec(stack[i]);
      const file = parts && pathNameToUrl(parts[2]);
      if (file) {
        return file;
      }
    }
  }
  return undefined;
}

let _mainEntries;
let _ignoredWarnings;

/**
 * Check wether if the given module is the main module
 * @param url String url, Module or import.meta
 * @returns True if the given url, Module or import.meta is the main running module
 */
exports.isMainModule = function isMainModule(url) {
  if (url === require.main) {
    return true;
  }
  if (typeof url === "object") {
    url = url.filename || url.id || url.href || url.url;
  }
  if (require.main && require.main.id === url) {
    return true;
  }
  url = pathNameFromUrl(url) || url;
  if (!url || typeof url !== "string") {
    return false;
  }
  if (url.startsWith(pathSep)) {
    try {
      url = fileURLToPath(url);
    } catch {}
  }
  const indexOfQuestionMark = url.indexOf("?");
  if (indexOfQuestionMark >= 0) {
    url = url.slice(0, indexOfQuestionMark - 1);
  }
  if (_mainEntries && _mainEntries.has(url)) {
    return true;
  }
  if (require.main && require.main.id) {
    return (pathNameToUrl(require.main.id) || require.main.id) === url;
  }
  return false;
};

exports.addMainModule = (pathName) => {
  if (pathName) {
    if (!_mainEntries) {
      _mainEntries = new Set();
    }
    _mainEntries.add(pathNameFromUrl(pathName) || pathName);
  }
};

exports.ignoreProcessWarning = function ignoreProcessWarning(name, value = true) {
  if (value) {
    if (!_ignoredWarnings) {
      _ignoredWarnings = new Set();
      const _emitWarning = process.emitWarning;
      const emitWarning = (warning, warningName, ctor = emitWarning) =>
        exports.ignoreProcessWarning.isIgnored(warningName)
          ? undefined
          : _emitWarning(warning, warningName, ctor || emitWarning);
      process.emitWarning = emitWarning;
    }
    _ignoredWarnings.add(name);
  } else if (_ignoredWarnings) {
    _ignoredWarnings.delete(name);
  }
};

exports.ignoreProcessWarning.isIgnored = function isIgnored(name) {
  return _ignoredWarnings ? _ignoredWarnings.has(name) : false;
};

const _validIdentifierSpecialsRegex = /[\s!%^&*(){}[\]?~`\-+=:'|/<>,.;"']/;

exports.isValidIdentifier = function isValidIdentifier(name) {
  if (
    typeof name !== "string" ||
    name.length === 0 ||
    name.length > 100 ||
    _validIdentifierSpecialsRegex.test(name) ||
    name === "__proto__"
  ) {
    return false;
  }
  try {
    // eslint-disable-next-line no-new-func,no-new
    new Function(name, `var ${name}`);
    return true;
  } catch {}
  return false;
};

/** Gets the length of an UTF8 string */
exports.utf8ByteLength = function utf8ByteLength(b) {
  return b === null || b === undefined
    ? 0
    : typeof b === "number"
    ? b || 0
    : typeof b === "string"
    ? Buffer.byteLength(b, "utf8")
    : b.length;
};

/** Gets a size in bytes in an human readable form. */
exports.prettySize = function prettySize(bytes, options) {
  if (bytes === null || bytes === undefined) {
    bytes = 0;
  }
  const appendBytes = !options || options.appendBytes === undefined || options.appendBytes;
  if (typeof bytes === "object" || typeof bytes === "string") {
    bytes = exports.utf8ByteLength(bytes);
  }
  bytes = bytes < 0 ? Math.floor(bytes) : Math.ceil(bytes);
  let s;
  if (!isFinite(bytes) || bytes < 1024) {
    s = `${bytes} ${appendBytes ? "Bytes" : "B"}`;
  } else {
    const i = Math.min(Math.floor(Math.log(Math.abs(bytes)) / Math.log(1024)), 6);
    s = `${+(bytes / 1024 ** i).toFixed(2)} ${i ? " kMGTPE"[i] : ""}`;
    if (appendBytes) {
      s += `, ${bytes} Bytes`;
    }
  }
  if (options && options.fileType) {
    s = `${options.fileType} ${s}`;
  }
  return s;
};

/** Makes an utf8 string. Removes UTF8 BOM header if present. */
function toUTF8(text) {
  if (text === null || text === undefined) {
    return "";
  }
  if (typeof text === "string") {
    return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
  }
  if (typeof text === "boolean" || typeof text === "number") {
    return text.toString();
  }
  if (!isBuffer(text)) {
    text = Buffer.from(text);
  }
  return (text[0] === 0xfe && text[1] === 0xff) || (text[0] === 0xff && text[1] === 0xfe)
    ? text.toString("utf8", 2)
    : text.toString();
}

exports.toUTF8 = toUTF8;

/** @returns {import('esbuild')} */
let _getEsBuild = () => {
  const esbuild = require("esbuild");
  _getEsBuild = () => esbuild;
  return esbuild;
};

let _getLoaders = () => {
  _getLoaders = () => _loaders;

  const filenameUrl = pathToFileURL(__filename).href;
  _resolveCache.set(__dirname, filenameUrl);
  _resolveCache.set(__filename, filenameUrl);
  _resolveCache.set(filenameUrl, filenameUrl);
  _resolveCache.set("@balsamic/esrun/index.js", filenameUrl);
  _resolveCache.set("@balsamic/esrun/index/", filenameUrl);
  _resolveCache.set("@balsamic/esrun/index", filenameUrl);
  _resolveCache.set("@balsamic/esrun", filenameUrl);

  const resolvedEsrunCjs = pathJoin(__dirname, "esrun.js");
  _resolveCache.set(resolvedEsrunCjs, pathToFileURL(resolvedEsrunCjs).href);

  exports.registerLoader([
    { extension: ".ts", loader: "ts", extensionless: true },
    { extension: ".tsx", loader: "tsx", extensionless: true },
    { extension: ".jsx", loader: "jsx", extensionless: true },
    { extension: ".mjs", loader: "mjs", extensionless: true },
    { extension: ".es6", loader: "mjs" },
    { extension: ".js", loader: "default", extensionless: true },
    { extension: ".cjs", loader: "cjs", extensionless: true },
    { extension: ".json", loader: "json", extensionless: true },
    { extension: ".html", loader: "text" },
    { extension: ".htm", loader: "text" },
    { extension: ".txt", loader: "text" },
    { extension: ".css", loader: "text" },
    { extension: ".md", loader: "text" },
    { extension: ".bin", loader: "buffer" },
  ]);

  return _loaders;
};

exports.loaders = {
  default: null,
  mjs: {
    format: "module",
  },
  cjs: {
    format: "commonjs",
  },
  ts: {
    format: "module",
    transformModule: (input) => _esrunTranspileModuleAsync(input, "ts"),
    transformCommonJS: (input) => _esrunTranspileCjsSync(input, "ts"),
  },
  tsx: {
    format: "module",
    transformModule: (input) => _esrunTranspileModuleAsync(input, "tsx"),
    transformCommonJS: (input) => _esrunTranspileCjsSync(input, "tsx"),
  },
  jsx: {
    format: "module",
    transformModule: (input) => _esrunTranspileModuleAsync(input, "jsx"),
    transformCommonJS: (input) => _esrunTranspileCjsSync(input, "jsx"),
  },
  json: {
    format: "commonjs",
  },
  text: {
    format: "commonjs",
    loadCommonJS: (_mod, pathName) => toUTF8(fs.readFileSync(pathName, "utf8")),
  },
  buffer: {
    format: "commonjs",
    loadCommonJS: (_mod, pathName) => fs.readFileSync(pathName),
  },
};

let _evalModuleCounter = 0;

const _evalModuleTemp = new Map();

exports._evalModuleTemp = _evalModuleTemp;

exports.esrunEval = async function esrunEval(source, { bundle, extension, format, callerUrl, isMain, isStatic } = {}) {
  isMain = !!isMain;
  isStatic = isMain || !!isStatic;
  if (!callerUrl) {
    callerUrl = exports.getCallerFileUrl(exports.esrunEval) || pathToFileURL(pathResolve("index.js")).href;
  }
  bundle = !!bundle;
  if (!extension) {
    extension = ".tsx";
  }
  if (!format) {
    format = "module";
  }

  const resolveDir = pathDirname(pathNameFromUrl(callerUrl) || pathResolve("index.js"));

  let filename;
  if (isStatic) {
    filename = `$esrun-eval-${crypto.createHash("sha256").update(source).digest().toString("hex")}${extension}`;
  } else {
    filename = `$esrun-eval-${_evalModuleCounter++}${extension}`;
  }

  const pathName = pathResolve(resolveDir, filename);

  if (isStatic) {
    const found = _evalModuleTemp.get(pathName);
    if (found !== undefined) {
      return found.promise;
    }
  }

  const url = pathToFileURL(pathName).href;
  const evalModule = { source, format, bundle, extension, url, pathName, callerUrl, resolveDir, isMain, isStatic };
  _evalModuleTemp.set(pathName, evalModule);
  _evalModuleTemp.set(url, evalModule);

  if (isMain) {
    exports.addMainModule(pathName);
  }

  const promise = import(url);
  evalModule.promise = promise;

  if (isStatic) {
    return promise;
  }

  try {
    return await promise;
  } finally {
    _evalModuleTemp.delete(pathName);
    _evalModuleTemp.delete(url);
    if (_sourceMaps) {
      _sourceMaps.delete(pathName);
      _sourceMaps.delete(url);
    }
  }
};

exports.esrunRegister = function esrunRegister(options) {
  const registerEsrun = !options || options.esrun;

  if (options && options.errors) {
    if (!_registered_errors) {
      _registered_errors = true;

      if (Error.stackTraceLimit < 10) {
        Error.stackTraceLimit = 10;
      }

      const depth = exports.devInspect.options.depth || Math.max(8, util.inspect.defaultOptions.depth || 0);

      if (!util.inspect.defaultOptions.depth || util.inspect.defaultOptions.depth < depth) {
        util.inspect.defaultOptions.depth = depth;
      }

      process.on("unhandledRejection", (error) => {
        exports.devLogWarning(chalk.redBright("Unhandled rejection"), error);
      });

      process.on("uncaughtException", exports.handleUncaughtError);
    }
  }

  if (options && options.exit) {
    if (!_registered_exit) {
      _registered_exit = true;
      const handleExit = () => {
        const timeDiffMs = Math.round(process.uptime() * 1000);
        console.log();
        if (process.exitCode) {
          console.log(chalk.redBright(`😞 Failed in ${timeDiffMs.toFixed(0)} ms. exitCode: ${process.exitCode}\n`));
        } else {
          console.log(chalk.rgb(50, 200, 70)(`✔️  Done in ${timeDiffMs.toFixed(0)} ms\n`));
        }
      };
      process.once("exit", handleExit);
    }
  }

  if (options && options.sourceMapSupport !== undefined ? options.sourceMapSupport : registerEsrun) {
    if (!_sourceMaps) {
      _sourceMaps = new Map();
      const sourceMapSupport = require("source-map-support");
      _wrapCallSite = (entry, state) => sourceMapSupport.wrapCallSite(entry, state);
      sourceMapSupport.install({
        environment: "node",
        handleUncaughtExceptions: false,
        hookRequire: true,
        retrieveFile: (path) => {
          const found = _evalModuleTemp.get(path);
          return found ? found.source : null;
        },
        retrieveSourceMap: (source) => _sourceMaps.get(source) || null,
      });
    }
  }

  if (options && options.ignoreExperimentalWarning !== undefined ? options.ignoreExperimentalWarning : registerEsrun) {
    exports.ignoreProcessWarning("ExperimentalWarning");
  }

  const dotenv = options && options.dotenv !== undefined ? options.dotenv : registerEsrun;
  if (dotenv) {
    _loadDotEnv(typeof dotenv === "string" ? dotenv : process.env.DOTENV_CONFIG_PATH || pathResolve(".env"));
  }

  if (registerEsrun && !_registered_esrun) {
    _registered_esrun = true;
    _fixVm();
    for (const [k, v] of _getLoaders()) {
      _registerCommonjsLoader(k, v);
    }
  }
};

exports.setFileSourceMap = function setFileSourceMap(url, sourcePath, map) {
  if (!_sourceMaps) {
    exports.esrunRegister({ sourceMapSupport: true });
  }
  _sourceMaps.set(url, { url: sourcePath, map });
};

exports.getLoader = function getLoader(extension) {
  if (typeof extension !== "string") {
    return undefined;
  }
  if (extension.length === 0) {
    extension = ".cjs";
  } else if (!extension.startsWith(".")) {
    extension = `.${extension}`;
  }
  return _getLoaders().get(extension);
};

exports.registerLoader = function registerLoader(arg) {
  if (isArray(arg)) {
    for (const item of arg) {
      registerLoader(item);
    }
    return;
  }

  let extension = arg.extension;
  if (typeof extension !== "string" || extension.length === 0) {
    throw new Error("Invalid extension");
  }
  if (!extension.startsWith(".")) {
    extension = `.${extension}`;
  }
  let loader = arg.loader;
  if (typeof loader === "string") {
    loader = exports.loaders[loader];
    if (typeof loader !== "object") {
      throw new Error(`Unknown loader "${loader}"`);
    }
  }
  if (typeof loader !== "object") {
    throw new Error(`Loader must be an object but is ${typeof loader}`);
  }
  if (loader && !loader.format) {
    throw new Error("loader format property must be specified");
  }
  const loaders = _getLoaders();
  if (arg.extensionless && !loaders.has(extension)) {
    _extensionlessLoaders.push(extension);
  }
  loaders.set(extension, loader);

  if (_registered_esrun) {
    _registerCommonjsLoader(extension, loader);
  }
};

exports.resolveBuiltinModule = function resolveBuiltinModule(id) {
  if (!_builtinModules) {
    _builtinModules = new Map();
    for (const m of Module.builtinModules) {
      const solved = `node:${m}`;
      _builtinModules.set(m, solved);
      _builtinModules.set(solved, solved);
    }
  }
  return _builtinModules.get(id);
};

exports.resolveEsModule = function resolveEsModule(id, sourcefile) {
  id = pathNameFromUrl(id) || id;

  if (typeof id === "object" && id !== null) {
    id = `${id}`;
  }

  const builtin = exports.resolveBuiltinModule(id);
  if (builtin !== undefined) {
    return builtin;
  }

  const evalModule = _evalModuleTemp.get(id);
  if (evalModule !== undefined) {
    return evalModule.url || id;
  }

  const sourceEvalModule = _evalModuleTemp.get(sourcefile);
  if (sourceEvalModule) {
    sourcefile = sourceEvalModule.callerUrl;
  }

  sourcefile = pathNameFromUrl(sourcefile);

  if (!sourcefile) {
    sourcefile = pathResolve("index.js");
  }

  const resolveDir = pathDirname(sourcefile);
  const isAbsolute = id.startsWith("/") || pathIsAbsolute(id);

  _getLoaders();

  let result;
  let cacheKey;
  if (isAbsolute) {
    cacheKey = id;
    result = _resolveCache.get(id);
  } else {
    cacheKey = `${resolveDir};${id}`;
    result = _resolveCache.get(cacheKey) || _resolveCache.get(id);
  }

  if (result !== undefined) {
    return result;
  }

  if (isAbsolute) {
    const cachedModule = require.cache[id];
    if (cachedModule) {
      try {
        result = pathToFileURL(id).href || undefined;
      } catch (_) {
        // Ignore error
      }
    }
  }

  if (result === undefined) {
    result = _esbuildBuildResolve(cacheKey, id, resolveDir);
  }

  _resolveCache.set(cacheKey, result);
  return result;
};

exports.clearResolveEsModuleCache = () => {
  _resolveCache.clear();
};

function _registerCommonjsLoader(extension, loader) {
  if (loader) {
    if (loader.transformCommonJS) {
      Module._extensions[extension] = (mod, pathName) => {
        const compile = mod._compile;
        mod._compile = function _compile(source) {
          mod._compile = compile;
          const newCode = loader.transformCommonJS({ source, pathName });
          return mod._compile(newCode, pathName);
        };
        mod.loaded = true;
      };
    } else if (loader.loadCommonJS) {
      Module._extensions[extension] = (mod, filename) => {
        const modExports = loader.loadCommonJS(mod, filename);
        mod.loaded = true;
        if (modExports !== undefined && mod.exports !== modExports) {
          mod.exports = modExports;
        }
      };
    }
  }
}

function _esrunTranspileCjsSync({ source, pathName }, parser) {
  const output = _getEsBuild().transformSync(toUTF8(source), {
    charset: "utf8",
    sourcefile: pathName,
    format: "cjs",
    legalComments: "none",
    loader: parser,
    target: _nodeTargetVersion,
    sourcemap: "external",
    sourcesContent: false,
  });
  return { source: output.code, map: output.map };
}

async function _esrunTranspileModuleAsync({ source, pathName, bundle }, parser) {
  const code = toUTF8(source);
  if (bundle) {
    const bundled = await _getEsBuild().build({
      stdin: { contents: code, loader: parser, sourcefile: pathName, resolveDir: pathDirname(pathName) },
      write: false,
      bundle: true,
      charset: "utf8",
      format: "esm",
      legalComments: "none",
      platform: "node",
      target: _nodeTargetVersion,
      mainFields: _mainFields,
      resolveExtensions: _extensionlessLoaders,
      sourcemap: "external",
      outdir: pathDirname(pathName),
      sourcesContent: false,
      plugins: [
        {
          name: "esrun-bundle",
          setup(build) {
            build.onResolve(_allFilesFilter, async ({ path, resolveDir }) => {
              const resolved = await exports.resolveEsModule(path, pathJoin(resolveDir, "index.js"));
              const resolvedPath = pathNameFromUrl(resolved);
              if (!resolvedPath) {
                return undefined;
              }
              const external =
                resolvedPath === __filename ||
                resolvedPath.indexOf("@balsamic/esrun") > 0 ||
                (!resolvedPath.endsWith(".tsx") &&
                  !resolvedPath.endsWith(".ts") &&
                  !resolvedPath.endsWith(".jsx") &&
                  resolved.indexOf(_posixNodeModulesPath) >= 0);
              return { path: resolvedPath, external };
            });
          },
        },
      ],
      define: {
        __filename: JSONstringify(pathName),
        __dirname: JSONstringify(pathDirname(pathName)),
      },
    });
    return bundled.outputFiles.length === 1
      ? { source: bundled.outputFiles[0].text }
      : { source: bundled.outputFiles[1].text, map: bundled.outputFiles[0].text };
  }

  const output = await _getEsBuild().transform(code, {
    charset: "utf8",
    sourcefile: pathName,
    format: "esm",
    legalComments: "none",
    loader: parser,
    target: _nodeTargetVersion,
    sourcemap: "external",
    sourcesContent: false,
    define: {
      __filename: JSONstringify(pathName),
      __dirname: JSONstringify(pathDirname(pathName)),
    },
  });
  return { source: output.code, map: output.map };
}

async function _tryResolveFile(pathName) {
  let r;
  try {
    r = await fs.promises.stat(pathName);
  } catch {}

  if (r) {
    if (r.isFile()) {
      return pathName;
    }
    if (r.isDirectory()) {
      pathName = pathJoin(pathName, "index");
    }
  }

  const pext = pathExtname(pathName);
  if (pext && exports.getLoader(pext) !== undefined) {
    return undefined;
  }

  for (const ext of _extensionlessLoaders) {
    const resolved = await _tryResolveFile(pathName + ext);
    if (resolved) {
      return resolved;
    }
  }

  return undefined;
}

async function _esbuildBuildResolve(cacheKey, id, resolveDir) {
  let path;
  if (id.startsWith("./") || id.startsWith("/")) {
    path = await _tryResolveFile(pathResolve(resolveDir, id));
  }
  if (!path) {
    let loaded;
    await _getEsBuild().build({
      write: false,
      bundle: true,
      sourcemap: false,
      charset: "utf8",
      format: "esm",
      logLevel: "silent",
      platform: "node",
      target: _nodeTargetVersion,
      mainFields: _mainFields,
      resolveExtensions: _extensionlessLoaders,
      stdin: { contents: `import ${JSONstringify(id)}`, loader: "ts", resolveDir },
      plugins: [
        {
          name: "esrun-resolve",
          setup(build) {
            build.onLoad(_allFilesFilter, (x) => {
              loaded = x;
              return _emptyContents;
            });
          },
        },
      ],
    });
    path = loaded && loaded.path;
  }
  if (!path) {
    path = null;
  } else {
    const ext = pathExtname(path);
    if ((ext === ".js" || ext === ".mjs" || ext === ".cjs") && !id.endsWith(ext)) {
      const tsPath = `${path.slice(0, path.length - ext.length)}.ts`;
      if (fsExistsSync(tsPath)) {
        path = tsPath;
      } else {
        const tsxPath = `${path.slice(0, path.length - ext.length)}.tsx`;
        if (fsExistsSync(tsxPath)) {
          path = tsxPath;
        }
      }
    }
    if (path.indexOf("::") < 0) {
      path = pathToFileURL(path, pathToFileURL(resolveDir)).href;
    }
  }
  _resolveCache.set(cacheKey, path);
  return path;
}

function _loadDotEnv(dotenvPath) {
  try {
    dotenvPath = dotenvPath.startsWith("~")
      ? pathResolve(os.homedir(), dotenvPath.slice(dotenvPath.startsWith("/") || dotenvPath.startsWith("\\") ? 2 : 1))
      : dotenvPath;

    const REGEX_NEWLINE = "\n";
    const REGEX_NEWLINES = /\\n/g;
    const REGEX_NEWLINES_MATCH = /\r\n|\n|\r/;
    const REGEX_INI_KEY_VAL = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/;

    for (const line of fs.readFileSync(dotenvPath, "utf8").split(REGEX_NEWLINES_MATCH)) {
      // matching "KEY' and 'VAL' in 'KEY=VAL'
      const keyValueArr = REGEX_INI_KEY_VAL.exec(line);
      // matched?
      if (keyValueArr !== null) {
        const key = keyValueArr[1];
        let val = (keyValueArr[2] || "").trim();
        const singleQuoted = val.startsWith("'") && val.endsWith("'");
        const doubleQuoted = val.startsWith('"') && val.endsWith('"');
        if (singleQuoted || doubleQuoted) {
          val = val.substring(1, val.length - 1);
          if (doubleQuoted) {
            val = val.replace(REGEX_NEWLINES, REGEX_NEWLINE);
          }
        }
        if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
          process.env[key] = val;
        }
      }
    }
    return true;
  } catch (_e) {
    // Do nothing
  }
  return false;
}

/** Node does ot pass a default implementation of importModuleDynamically in vm script functions. Fix this behavior */
function _fixVm() {
  const { compileFunction, runInContext, runInNewContext, runInThisContext, Script: VmScript } = vm;
  if (VmScript.__esrun__) {
    return;
  }

  const _fixVmOptions = (options) => {
    if (typeof options === "string") {
      options = { filename: options };
    }
    if (typeof options === "object" && options !== null && !options.importModuleDynamically) {
      const filename = options.filename;
      if (filename) {
        options = {
          ...options,
          async importModuleDynamically(url) {
            return import(await exports.resolveEsModule(url, filename));
          },
        };
      }
    }
    return options;
  };

  function Script(code, options) {
    return new VmScript(code, _fixVmOptions(options));
  }

  defineProperty(Script, "__esrun__", { value: true, configurable: true, enumerable: false, writable: false });
  Script.prototype = VmScript.prototype;
  VmScript.prototype.constructor = Script;
  setPrototypeOf(Script, VmScript);
  vm.Script = Script;
  vm.runInContext = (code, contextifiedObject, options) =>
    runInContext(code, contextifiedObject, _fixVmOptions(options));
  vm.runInNewContext = (code, contextObject, options) => runInNewContext(code, contextObject, _fixVmOptions(options));
  vm.runInThisContext = (code, options) => runInThisContext(code, _fixVmOptions(options));
  vm.compileFunction = (code, params, options) => compileFunction(code, params, _fixVmOptions(options));
}

exports.loadNpmWorkspace = async function loadNpmWorkspace(rootDirectory) {
  rootDirectory = pathResolve(rootDirectory || process.cwd());
  if (rootDirectory.endsWith("package.json") && pathBasename(rootDirectory) === "package.json") {
    rootDirectory = pathDirname(rootDirectory);
  }

  const _loadManifest = async (directory) => {
    let manifest;
    try {
      directory = await fs.promises.realpath(directory);
      let content = await fs.promises.readFile(pathJoin(directory, "package.json"), "utf8");
      if (content.charCodeAt(0) === 0xfeff) {
        content = content.slice(1);
      }
      manifest = JSON.parse(content);
    } catch (_e) {
      // Do nothing
    }
    if (typeof manifest !== "object" || manifest === null || isArray(manifest)) {
      return null;
    }
    return {
      directory,
      manifest,
    };
  };

  const workspace = await _loadManifest(rootDirectory);
  if (!workspace) {
    return null;
  }

  const manifest = workspace.manifest;
  if (isArray(manifest.workspaces)) {
    const patterns = new Set();
    let hasSearchPatterns = false;
    for (let pattern of manifest.workspaces) {
      if (typeof pattern === "string" && pattern.length !== 0) {
        const negations = /^!+/.exec(pattern);
        if (negations) {
          pattern = pattern.substr(negations[0].length);
        }
        pattern = pattern.replace(/^\/+/, "");
        if (negations && negations[0].length % 2 === 1) {
          pattern = `!${pattern}`;
        } else {
          hasSearchPatterns = true;
        }
        patterns.add(pattern);
      }
    }
    if (hasSearchPatterns) {
      const folders = await (_fastglob || (_fastglob = require("fast-glob")))(arrayFrom(patterns), {
        ignore: ["**/node_modules/**", "**/.*/**", "**/*.d.ts"],
        cwd: rootDirectory,
        absolute: true,
        followSymbolicLinks: true,
        markDirectories: true,
        suppressErrors: true,
        onlyDirectories: true,
        unique: true,
      });
      workspace.workspaces = (await Promise.all(folders.map(_loadManifest))).filter((x) => !!x);
    }
  }
  if (!workspace.workspaces) {
    workspace.workspaces = [];
  }
  return workspace;
};
