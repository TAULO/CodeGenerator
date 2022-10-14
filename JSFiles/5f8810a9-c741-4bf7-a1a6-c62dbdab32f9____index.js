'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var vscode = _interopDefault(require('vscode'));
var vscodeNls = _interopDefault(require('vscode-nls'));
var vscodeLanguageclient = _interopDefault(require('vscode-languageclient'));
var open = _interopDefault(require('open'));
var fs = _interopDefault(require('fs'));
var path = _interopDefault(require('path'));
var execa = _interopDefault(require('execa'));
var which = _interopDefault(require('which'));
var stream = _interopDefault(require('stream'));

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var commands = createCommonjsModule(function (module, exports) {
// Copyright 2019-2020 the Deno authors. All rights reserved. MIT license.
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCommands = void 0;
const vscode$1 = __importStar(vscode);
/**
 * Restart the language server by killing the process then spanwing a new one.
 * @param client LSP language client
 */
function restartDenoServer(client) {
    return {
        id: "deno.restartDenoServer",
        async execute() {
            await client.stop();
            return client.start();
        },
    };
}
/**
 * Register all supported vscode commands for the Deno extension.
 * @param client LSP language client
 */
function registerCommands(client) {
    const commands = [
        restartDenoServer(client),
    ];
    const disposables = commands.map((command) => {
        return vscode$1.commands.registerCommand(command.id, command.execute);
    });
    return disposables;
}
exports.registerCommands = registerCommands;

});

unwrapExports(commands);
var commands_1 = commands.registerCommands;

var protocol = createCommonjsModule(function (module, exports) {
// Copyright 2019-2020 the Deno authors. All rights reserved. MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectLoadingNotification = void 0;

exports.projectLoadingNotification = {
    start: new vscodeLanguageclient.NotificationType0("deno-language-service/projectLoadingStart"),
    finish: new vscodeLanguageclient.NotificationType0("deno-language-service/projectLoadingFinish"),
};

});

unwrapExports(protocol);
var protocol_1 = protocol.projectLoadingNotification;

var output = createCommonjsModule(function (module, exports) {
// Copyright 2019-2020 the Deno authors. All rights reserved. MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.outputChannel = void 0;

const outputChannel = vscode.window.createOutputChannel("Deno");
exports.outputChannel = outputChannel;

});

unwrapExports(output);
var output_1 = output.outputChannel;

var utils = createCommonjsModule(function (module, exports) {
// Copyright 2019-2020 the Deno authors. All rights reserved. MIT license.
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadLibDenoDts = exports.restartTsServer = exports.delay = exports.getServerOptions = exports.getTypeScriptLanguageExtension = exports.getExtensionPath = exports.isJavaScriptDocument = exports.isTypeScriptDocument = exports.tsconfigExists = exports.packageJsonExists = void 0;
const fs$1 = __importStar(fs);
const path$1 = __importStar(path);
const vscode$1 = __importStar(vscode);
const lsp = __importStar(vscodeLanguageclient);
/** Check if the package.json file exists in the root directory. */
function packageJsonExists() {
    if (!vscode$1.workspace.rootPath) {
        return false;
    }
    try {
        const filename = path$1.join(vscode$1.workspace.rootPath, "package.json");
        const stat = fs$1.statSync(filename);
        return stat && stat.isFile();
    }
    catch (ignored) {
        return false;
    }
}
exports.packageJsonExists = packageJsonExists;
function tsconfigExists() {
    if (!vscode$1.workspace.rootPath) {
        return false;
    }
    try {
        const filename = path$1.join(vscode$1.workspace.rootPath, "tsconfig.json");
        const stat = fs$1.statSync(filename);
        return stat && stat.isFile();
    }
    catch (ignored) {
        return false;
    }
}
exports.tsconfigExists = tsconfigExists;
function isTypeScriptDocument(document) {
    return (document.languageId === "typescript" ||
        document.languageId === "typescriptreact");
}
exports.isTypeScriptDocument = isTypeScriptDocument;
function isJavaScriptDocument(document) {
    return (document.languageId === "javascript" ||
        document.languageId === "javascriptreact");
}
exports.isJavaScriptDocument = isJavaScriptDocument;
/**
 * The absolute file path of the directory containing this extension.
 * @param extensionId
 */
function getExtensionPath(extensionId) {
    var _a;
    return (_a = vscode$1.extensions.getExtension(extensionId)) === null || _a === void 0 ? void 0 : _a.extensionPath;
}
exports.getExtensionPath = getExtensionPath;
async function getTypeScriptLanguageExtension() {
    const typeScriptExtensionId = "vscode.typescript-language-features";
    const extension = vscode$1.extensions.getExtension(typeScriptExtensionId);
    if (!extension) {
        return;
    }
    await extension.activate();
    if (!extension.exports || !extension.exports.getAPI) {
        return;
    }
    const api = extension.exports.getAPI(0);
    if (!api) {
        return;
    }
    return api;
}
exports.getTypeScriptLanguageExtension = getTypeScriptLanguageExtension;
/**
 * Construct the arguments that's used to spawn the server process.
 * @param ctx vscode extension context
 * @param debug true if debug mode is on
 */
function constructArgs(ctx, debug) {
    const config = vscode$1.workspace.getConfiguration();
    const args = [];
    const denoLog = config.get("deno.log", "off");
    if (denoLog !== "off") {
        // Log file does not yet exist on disk. It is up to the server to create the file.
        const logFile = path$1.join(ctx.logPath, "denoserver.log");
        args.push("--logFile", logFile);
        args.push("--logVerbosity", debug ? "verbose" : denoLog);
    }
    // Load tsconfig.json configuration file
    const tsconfig = config.get("deno.tsconfig", null);
    if (tsconfig) {
        args.push("--config", ctx.asAbsolutePath(tsconfig));
    }
    // Load import map file
    const importmap = config.get("deno.importmap", null);
    if (importmap) {
        args.push("--importmap", ctx.asAbsolutePath(importmap));
    }
    // TODO: try to load a ts consistent with the built-in version of Deno.
    // use use the specified `bundled` as fallback if none is provided
    // const tsdk: string|null = config.get('typescript.tsdk', null);
    args.push("--tsdk", ctx.extensionPath);
    return args;
}
function getServerOptions(ctx, debug) {
    // Environment variables for server process
    const prodEnv = {
        // Force TypeScript to use the non-polling version of the file watchers.
        TSC_NONPOLLING_WATCHER: true,
    };
    const devEnv = Object.assign(Object.assign({}, prodEnv), { DENO_DEBUG: true });
    // Node module for the language server
    const prodBundle = ctx.asAbsolutePath("server");
    const devBundle = ctx.asAbsolutePath(path$1.join("server", "out", "server.js"));
    // Argv options for Node.js
    const prodExecArgv = [];
    const devExecArgv = [
        // do not lazily evaluate the code so all breakpoints are respected
        "--nolazy",
        // If debugging port is changed, update .vscode/launch.json as well
        "--inspect=6009",
    ];
    return {
        // VS Code Insider launches extensions in debug mode by default but users
        // install prod bundle so we have to check whether dev bundle exists.
        module: debug && fs$1.existsSync(devBundle) ? devBundle : prodBundle,
        transport: lsp.TransportKind.ipc,
        args: constructArgs(ctx, debug),
        options: {
            env: debug ? devEnv : prodEnv,
            execArgv: debug ? devExecArgv : prodExecArgv,
        },
    };
}
exports.getServerOptions = getServerOptions;
async function delay(ms) {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms);
    });
}
exports.delay = delay;
async function restartTsServer() {
    await delay(1000);
    vscode$1.commands.executeCommand("typescript.restartTsServer");
}
exports.restartTsServer = restartTsServer;
// TODO: download lib.deno.d.ts
function downloadLibDenoDts() { }
exports.downloadLibDenoDts = downloadLibDenoDts;

});

unwrapExports(utils);
var utils_1 = utils.downloadLibDenoDts;
var utils_2 = utils.restartTsServer;
var utils_3 = utils.delay;
var utils_4 = utils.getServerOptions;
var utils_5 = utils.getTypeScriptLanguageExtension;
var utils_6 = utils.getExtensionPath;
var utils_7 = utils.isJavaScriptDocument;
var utils_8 = utils.isTypeScriptDocument;
var utils_9 = utils.tsconfigExists;
var utils_10 = utils.packageJsonExists;

var deno_1 = createCommonjsModule(function (module, exports) {
// Copyright 2019-2020 the Deno authors. All rights reserved. MIT license.
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deno = exports.DenoError = void 0;
const path$1 = __importStar(path);
const fs$1 = __importStar(fs);
const execa_1 = __importDefault(execa);
const which_1 = __importDefault(which);

class DenoError {
    constructor(data) {
        if (data.error) {
            this.error = data.error;
            this.message = data.error.message;
        }
        else {
            this.error = undefined;
            this.message = "";
        }
        this.message = this.message || data.message || "Deno error";
        this.stdout = data.stdout;
        this.stderr = data.stderr;
        this.exitCode = data.exitCode;
        this.DenoErrorCode = data.DenoErrorCode;
        this.DenoCommand = data.DenoCommand;
    }
    toString() {
        let result = this.message +
            " " +
            JSON.stringify({
                exitCode: this.exitCode,
                DenoErrorCode: this.DenoErrorCode,
                DenoCommand: this.DenoCommand,
                stdout: this.stdout,
                stderr: this.stderr,
            }, null, 2);
        if (this.error) {
            result += this.error.stack;
        }
        return result;
    }
}
exports.DenoError = DenoError;
class Deno {
    async init() {
        this.path = await this.getExePath();
        if (!this.path) {
            throw new Error("Could not find `deno` in your $PATH. Please install `deno`, then restart the extension.");
        }
        this.versions = await this.getVersions();
        if (!this.versions) {
            return;
        }
    }
    getDenoDir() {
        // ref https://deno.land/manual.html
        // On Linux/Redox: $XDG_CACHE_HOME/deno or $HOME/.cache/deno
        // On Windows: %LOCALAPPDATA%/deno (%LOCALAPPDATA% = FOLDERID_LocalAppData)
        // On macOS: $HOME/Library/Caches/deno
        // If something fails, it falls back to $HOME/.deno
        let denoDir = process.env.DENO_DIR;
        if (denoDir === undefined) {
            switch (process.platform) {
                case "win32":
                    denoDir = `${process.env.LOCALAPPDATA}\\deno`;
                    break;
                case "darwin":
                    denoDir = `${process.env.HOME}/Library/Caches/deno`;
                    break;
                case "linux":
                    denoDir = process.env.XDG_CACHE_HOME
                        ? `${process.env.XDG_CACHE_HOME}/deno`
                        : `${process.env.HOME}/.cache/deno`;
                    break;
                default:
                    denoDir = `${process.env.HOME}/.deno`;
            }
        }
        return denoDir;
    }
    isInDenoDir(filepath) {
        filepath = this.normalizeFilepath(filepath);
        const denoDir = this.getDenoDir();
        return filepath.startsWith(denoDir);
    }
    normalizeFilepath(filepath) {
        return path$1.normalize(filepath
            // in Windows, filepath maybe `c:\foo\bar` tut the legal path should be `C:\foo\bar`
            .replace(/^([a-z]):\\/, (_, $1) => $1.toUpperCase() + ":\\")
            // There are some paths which are unix style, this style does not work on win32 systems
            .replace(/\//gm, path$1.sep));
    }
    bundledDtsPath(extensionPath) {
        return path$1.resolve(extensionPath, "node_modules", "typescript-deno-plugin", "lib");
    }
    // Generate Deno's .d.ts file
    async generateDtsForDeno(extensionPath, unstable) {
        const denoDir = this.getDenoDir();
        const bundledPath = this.bundledDtsPath(extensionPath);
        if (!fs$1.existsSync(denoDir)) {
            fs$1.mkdirSync(denoDir, { recursive: true });
        }
        // copy bundled lib.webworker.d.ts to `denoDir`
        // fix https://github.com/microsoft/TypeScript/issues/5676
        fs$1.copyFileSync(path$1.resolve(bundledPath, "lib.webworker.d.ts"), path$1.resolve(denoDir, "lib.webworker.d.ts"));
        try {
            const args = ["types"];
            if (unstable)
                args.push("--unstable");
            const { stdout, stderr } = await execa_1.default(this.path, args);
            if (stderr) {
                throw stderr;
            }
            fs$1.writeFileSync(path$1.resolve(denoDir, "lib.deno.d.ts"), stdout);
        }
        catch (_a) {
            // if `deno types` fails, just copy bundled lib.deno.d.ts to `denoDir`
            fs$1.copyFileSync(path$1.resolve(bundledPath, "lib.deno.d.ts"), path$1.resolve(denoDir, "lib.deno.d.ts"));
        }
    }
    format(code) {
        const reader = stream.Readable.from([code]);
        const subprocess = execa_1.default(this.path, ["fmt", "-"], {
            stdout: "pipe",
            stderr: "pipe",
            stdin: "pipe",
        });
        return new Promise((resolve, reject) => {
            let stdout = "";
            let stderr = "";
            subprocess.on("exit", (exitCode) => {
                if (exitCode !== 0) {
                    reject(new Error(stderr));
                }
                else {
                    resolve(stdout);
                }
            });
            subprocess.on("error", (err) => {
                reject(err);
            });
            subprocess.stdout.on("data", (data) => {
                stdout += data;
            });
            subprocess.stderr.on("data", (data) => {
                stderr += data;
            });
            subprocess.stdin && reader.pipe(subprocess.stdin);
        });
    }
    async getExePath() {
        const denoPath = await which_1.default("deno").catch(() => Promise.resolve(undefined));
        return denoPath;
    }
    async getVersions() {
        try {
            const { stdout, stderr } = await execa_1.default(this.path, [
                "eval",
                "console.log(JSON.stringify(Deno.version))",
            ]);
            if (stderr) {
                return;
            }
            const { deno, v8, typescript } = JSON.parse(stdout);
            return {
                deno,
                v8,
                typescript,
                raw: `deno: ${deno}\nv8: ${v8}\ntypescript: ${typescript}`,
            };
        }
        catch (_a) {
            return;
        }
    }
}
const deno = new Deno();
exports.deno = deno;

});

unwrapExports(deno_1);
var deno_2 = deno_1.deno;
var deno_3 = deno_1.DenoError;

var extension = createCommonjsModule(function (module, exports) {
// Copyright 2019-2020 the Deno authors. All rights reserved. MIT license.
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode$1 = __importStar(vscode);
const nls = __importStar(vscodeNls);
const lsp = __importStar(vscodeLanguageclient);
const open_1 = __importDefault(open);





const denoExtensionId = "justjavac.vscode-deno";
const pluginId = "typescript-deno-plugin";
const configurationSection = "deno";
const localize = nls.loadMessageBundle();
var Status;
(function (Status) {
    Status[Status["ok"] = 1] = "ok";
    Status[Status["warn"] = 2] = "warn";
    Status[Status["error"] = 3] = "error";
})(Status || (Status = {}));
async function pickFolder(folders, placeHolder) {
    if (folders.length === 1) {
        return Promise.resolve(folders[0]);
    }
    const selected = await vscode$1.window.showQuickPick(folders.map((folder) => {
        return {
            label: folder.name,
            description: folder.uri.fsPath,
            folder: folder,
        };
    }), { placeHolder: placeHolder });
    if (!selected) {
        return undefined;
    }
    return selected.folder;
}
function enable() {
    let folders = vscode$1.workspace.workspaceFolders;
    if (!folders) {
        vscode$1.window.showWarningMessage("Deno can only be enabled if VS Code is opened on a workspace folder.");
        return;
    }
    let disabledFolders = folders.filter((folder) => !vscode$1.workspace
        .getConfiguration(configurationSection, folder.uri)
        .get("enable", true));
    if (disabledFolders.length === 0) {
        if (folders.length === 1) {
            vscode$1.window.showInformationMessage("Deno is already enabled in the workspace.");
        }
        else {
            vscode$1.window.showInformationMessage("Deno is already enabled on all workspace folders.");
        }
        return;
    }
    pickFolder(disabledFolders, "Select a workspace folder to enable Deno for").then((folder) => {
        if (!folder) {
            return;
        }
        vscode$1.workspace
            .getConfiguration(configurationSection, folder.uri)
            .update("enable", true)
            .then(utils.restartTsServer);
    });
}
function disable() {
    let folders = vscode$1.workspace.workspaceFolders;
    if (!folders) {
        vscode$1.window.showErrorMessage("Deno can only be disabled if VS Code is opened on a workspace folder.");
        return;
    }
    let enabledFolders = folders.filter((folder) => vscode$1.workspace
        .getConfiguration(configurationSection, folder.uri)
        .get("enable", true));
    if (enabledFolders.length === 0) {
        if (folders.length === 1) {
            vscode$1.window.showInformationMessage("Deno is already disabled in the workspace.");
        }
        else {
            vscode$1.window.showInformationMessage("Deno is already disabled on all workspace folders.");
        }
        return;
    }
    pickFolder(enabledFolders, "Select a workspace folder to disable Deno for").then((folder) => {
        if (!folder) {
            return;
        }
        vscode$1.workspace.getConfiguration("deno", folder.uri).update("enable", false).then(utils.restartTsServer);
    });
}
async function activate(context) {
    const extensionUpgradeMessage = "This prototype is deprecated. Get official 'deno' extension from the VS Code Marketplace.";
    vscode$1.window.showInformationMessage(extensionUpgradeMessage, "Go to VS Code Marketplace").then((selected) => {
        if (selected === "Go to VS Code Marketplace") {
            open_1.default("https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno");
        }
    });
    const api = await utils.getTypeScriptLanguageExtension();
    if (!api) {
        return;
    }
    await promptForNodeJsProject();
    const configurationListener = vscode$1.workspace.onDidChangeConfiguration((e) => {
        if (e.affectsConfiguration(configurationSection)) {
            synchronizeConfiguration(api);
            updateStatusBarVisibility(vscode$1.window.activeTextEditor);
        }
    }, undefined, context.subscriptions);
    synchronizeConfiguration(api);
    const disposables = [
        configurationListener,
        // formatter,
        vscode$1.commands.registerCommand("deno.enable", enable),
        vscode$1.commands.registerCommand("deno.disable", disable),
        vscode$1.commands.registerCommand("deno.showOutputChannel", async () => {
            if (denoStatus === Status.ok) {
                output.outputChannel.show();
                return;
            }
            const show = localize("showOutputChannel", "Show Output");
            const help = localize("getHelp", "Get Help");
            const choice = await vscode$1.window.showWarningMessage(localize("notfound", "Deno not found. Install it by using deno_install or click {0} button for more help.", help), show, help);
            if (choice === show) {
                output.outputChannel.show();
            }
            else if (choice === help) {
                vscode$1.commands.executeCommand("vscode.open", vscode$1.Uri.parse("https://github.com/denoland/deno_install"));
            }
        }),
    ];
    context.subscriptions.push(...disposables, output.outputChannel);
    const statusBarItem = vscode$1.window.createStatusBarItem(vscode$1.StatusBarAlignment.Right, 0);
    let denoStatus = Status.ok;
    statusBarItem.text = "Deno";
    statusBarItem.command = "deno.showOutputChannel";
    await deno_1.deno.init();
    if (deno_1.deno.versions === undefined) {
        denoStatus = Status.warn;
        statusBarItem.tooltip = "Deno is not installed";
        output.outputChannel.appendLine("Failed to detect Deno.");
        output.outputChannel.appendLine("You can use one-line commands to install Deno.");
        if (process.platform === "win32") {
            output.outputChannel.appendLine("> iwr https://deno.land/x/install/install.ps1 | iex");
        }
        else {
            output.outputChannel.appendLine("> curl -fsSL https://deno.land/x/install/install.sh | sh");
        }
        output.outputChannel.appendLine("See https://github.com/denoland/deno_install for more installation options.\n");
    }
    else {
        statusBarItem.tooltip = deno_1.deno.versions.raw;
        output.outputChannel.appendLine("Found deno, version:");
        output.outputChannel.appendLine(deno_1.deno.versions.raw);
        const config = vscode$1.workspace.getConfiguration();
        deno_1.deno.generateDtsForDeno(utils.getExtensionPath(denoExtensionId), config.get("deno.unstable"));
    }
    function showStatusBarItem(show) {
        if (show) {
            statusBarItem.show();
        }
        else {
            statusBarItem.hide();
        }
    }
    function updateStatusBarVisibility(editor) {
        switch (denoStatus) {
            case Status.ok:
                statusBarItem.text = `Deno ${deno_1.deno.versions.deno}`;
                break;
            case Status.warn:
                statusBarItem.text = "$(alert) Deno";
                break;
            case Status.error:
                statusBarItem.text = "$(issue-opened) Deno";
                break;
            default:
                statusBarItem.text = `Deno ${deno_1.deno.versions.deno}`;
        }
        let uri = editor ? editor.document.uri : undefined;
        let enabled = vscode$1.workspace.getConfiguration("deno", uri)["enable"];
        let alwaysShowStatus = vscode$1.workspace.getConfiguration("deno", uri)["alwaysShowStatus"];
        if (!editor ||
            !enabled ||
            (denoStatus === Status.ok && !alwaysShowStatus)) {
            showStatusBarItem(false);
            return;
        }
        showStatusBarItem(utils.isTypeScriptDocument(editor.document) ||
            utils.isJavaScriptDocument(editor.document));
    }
    vscode$1.window.onDidChangeActiveTextEditor(updateStatusBarVisibility);
    updateStatusBarVisibility(vscode$1.window.activeTextEditor);
    // If the extension is launched in debug mode then the debug server options are used.
    // Otherwise the run options are used.
    const serverOptions = {
        run: utils.getServerOptions(context, false /* debug */),
        debug: utils.getServerOptions(context, true /* debug */),
    };
    const config = vscode$1.workspace.getConfiguration();
    const fileEvents = [];
    // Notify the server about file changes to import maps contained in the workspace
    const importmap = config.get("deno.importmap");
    if (importmap) {
        fileEvents.push(vscode$1.workspace.createFileSystemWatcher(importmap));
    }
    // Notify the server about file changes to tsconfig.json contained in the workspace
    const tsconfig = config.get("deno.tsconfig");
    if (tsconfig) {
        fileEvents.push(vscode$1.workspace.createFileSystemWatcher(tsconfig));
    }
    // Options to control the language client
    const clientOptions = {
        // Register the server for JavaScript and TypeScript documents
        documentSelector: [
            // scheme: 'file' means listen to changes to files on disk only
            // other option is 'untitled', for buffer in the editor (like a new doc)
            // **NOTE**: REMOVE .wasm https://github.com/denoland/deno/pull/5135
            { scheme: "file", language: "javascript" },
            { scheme: "file", language: "javascriptreact" },
            { scheme: "file", language: "typescript" },
            { scheme: "file", language: "typescriptreact" },
        ],
        // Notify the server about file changes or config change
        synchronize: {
            fileEvents,
            configurationSection: configurationSection,
        },
        progressOnInitialization: true,
        diagnosticCollectionName: configurationSection,
        middleware: {
            provideCodeActions(document, range, context, token, next) {
                if (!config.get("deno.enable") || !context.diagnostics) {
                    return [];
                }
                // diagnostics from Deno Language Server
                const diagnostics = context.diagnostics.filter((x) => x.source === "Deno Language Server");
                Object.assign(context, { diagnostics });
                return next(document, range, context, token);
            },
        },
        // Don't let our output console pop open
        revealOutputChannelOn: lsp.RevealOutputChannelOn.Never,
    };
    // Create the language client and start the client.
    const forceDebug = process.env["DENO_DEBUG"] === "true";
    const client = new lsp.LanguageClient("Deno Language Service", serverOptions, clientOptions, forceDebug);
    // Push the disposable to the context's subscriptions so that the
    // client can be deactivated on extension deactivation
    context.subscriptions.push(...commands.registerCommands(client), client.start());
    context.subscriptions.push(vscode$1.window.onDidChangeActiveTextEditor(async (editor) => {
        await setDocumentLanguage(editor === null || editor === void 0 ? void 0 : editor.document);
    }));
    client.onDidChangeState((e) => {
        let task;
        if (e.newState == lsp.State.Running) {
            client.onNotification(protocol.projectLoadingNotification.start, () => {
                if (task) {
                    task.resolve();
                    task = undefined;
                }
                vscode$1.window.withProgress({
                    location: vscode$1.ProgressLocation.Window,
                    title: "Initializing Deno language service",
                }, () => new Promise((resolve) => {
                    task = { resolve };
                }));
            });
            client.onNotification(protocol.projectLoadingNotification.finish, () => {
                if (task) {
                    task.resolve();
                    task = undefined;
                }
            });
        }
    });
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
/** synchronize configuration with typescript-deno-plugin */
function synchronizeConfiguration(api) {
    const { enable, tsconfig, importmap } = getConfiguration();
    api.configurePlugin(pluginId, { enable, tsconfig, importmap });
}
function getConfiguration() {
    const config = vscode$1.workspace.getConfiguration(configurationSection);
    const outConfig = {};
    withConfigValue(config, outConfig, "enable");
    withConfigValue(config, outConfig, "alwaysShowStatus");
    withConfigValue(config, outConfig, "autoFmtOnSave");
    withConfigValue(config, outConfig, "tsconfig");
    withConfigValue(config, outConfig, "importmap");
    withConfigValue(config, outConfig, "unstable");
    return outConfig;
}
function withConfigValue(config, outConfig, key) {
    const configSetting = config.inspect(key);
    if (!configSetting) {
        return;
    }
    // Make sure the user has actually set the value.
    // VS Code will return the default values instead of `undefined`, even if user has not don't set anything.
    if (typeof configSetting.globalValue === "undefined" &&
        typeof configSetting.workspaceFolderValue === "undefined" &&
        typeof configSetting.workspaceValue === "undefined") {
        return;
    }
    const value = config.get(key, undefined);
    if (typeof value !== "undefined") {
        outConfig[key] = value;
    }
}
/** when package.json is detected in the root directory, display a prompt */
async function promptForNodeJsProject() {
    let enabled = vscode$1.workspace.getConfiguration("deno").get("enable", true);
    if (enabled && utils.packageJsonExists()) {
        const disable = localize("button.disable", "Disable");
        const cancel = localize("button.cancel", "Cancel");
        const choice = await vscode$1.window.showInformationMessage(localize("message.maybe_nodejs_project", "A package.json file is detected in the project. " +
            "This project may be a Node.js project. " +
            "Do you want to disable this extension?"), disable, cancel);
        if (choice === disable) {
            vscode$1.commands.executeCommand("deno.disable");
        }
    }
}
async function setDocumentLanguage(document) {
    if (!document) {
        return;
    }
    if (document.isUntitled ||
        document.languageId.toLowerCase() !== "plaintext") {
        return;
    }
    const filepath = document.uri.fsPath;
    if (deno_1.deno.isInDenoDir(filepath)) {
        // TODO(justjavac): detect from .metadata.json
        await vscode$1.languages.setTextDocumentLanguage(document, "typescriptreact");
    }
}

});

var extension$1 = unwrapExports(extension);
var extension_1 = extension.deactivate;
var extension_2 = extension.activate;

exports.activate = extension_2;
exports.deactivate = extension_1;
exports.default = extension$1;
