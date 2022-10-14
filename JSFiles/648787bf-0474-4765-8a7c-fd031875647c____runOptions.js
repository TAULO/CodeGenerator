/* eslint-disable no-console */

'use strict';

const { CLI_MODE } = require('./commons/constants');
const { EDGE_CHROMIUM_MIN_VERSION } = require('./player/constants');
const program = require('commander');
const fs = require('fs');
const ms = require('ms');
const Promise = require('bluebird');
const NoArgsError = require('./errors.js').NoArgsError;
const ArgError = require('./errors.js').ArgError;
const url = require('url');
const _ = require('lodash');
const path = require('path');
const utils = require('./utils');
const runOptionsAgentFlow = require('./runOptionsAgentFlow');
const runOptionsUtils = require('./runOptionsUtils');
const localRunnerCache = require('./commons/runnerFileCache');
const chalk = require('chalk');

const camelizeHyphenValues = (prop) => prop.replace(/-([a-z])/g, (m, w) => w.toUpperCase());

const collect = (val, col) => {
    col.push(val);
    return col;
};

const list = (val) => val.split(',');

const mergeValues = (first, second) => ((!first || first.length === 0) ? second : first);

const setHostAndPortForSauceLab = () => {
    if (program.grid || program.gridId) {
        return;
    }
    if (!program.host) {
        program.host = 'ondemand.saucelabs.com';
    }
    if (!program.port) {
        program.port = 80;
    }
};

const setHostAndPortForBrowserStack = () => {
    if (program.grid || program.gridId) {
        return;
    }
    if (!program.host) {
        program.host = 'hub-cloud.browserstack.com';
    }
    if (!program.port) {
        program.port = 80;
    }
};

const allowedChromeFlags = ['enable-heavy-ad-intervention', 'heavy-ad-privacy-mitigations', 'use-fake-device-for-media-stream', 'use-fake-ui-for-media-stream', 'proxy-server'];

const printUsage = () => {
    function isDefaultHelpLine(line) {
        return line.includes('-h, --help');
    }

    function isParamsJsonOption(line) {
        return line.includes('--params [params-json-string]');
    }

    function isExtOnlyOption(line) {
        return line.includes('--ext') || line.includes('--extension-path');
    }

    function isPlayerOption(line) {
        return line.includes('--player-path') || line.includes('--player-require-path');
    }

    function isScheduler(line) {
        return (
            line.includes('--executionId') ||
            line.includes('--source') ||
            line.includes('--resultId') ||
            line.includes('--remoteRunId') ||
            line.includes('--schedulerId')
        );
    }

    function isWebdriverTimeout(line) {
        return (
            line.includes('--get-browser-timeout') ||
            line.includes('--get-browser-retries') ||
            line.includes('--get-session-timeout') ||
            line.includes('--get-session-retries') ||
            line.includes('--driver-request-timeout') ||
            line.includes('--driver-request-retries')
        );
    }

    function isUserId(line) {
        return line.includes('--user');
    }

    function isMonitorPerformance(line) {
        return line.includes('shouldMonitorPerformance');
    }

    function isSaveRCALocally(line) {
        return line.includes('--save-rca-locally');
    }

    function isExitCodeIgnoreFailingTests(line) {
        return line.includes('--exit-code-ignore-failing-tests');
    }

    function isDeprecatedHighSpeed(line) {
        return line.includes('--high-speed'); // high speed mode was renamed to turbo mode
    }

    program.help((txt) => {
        const lines = txt.split('\n');
        return lines
            .filter(
                (ln) =>
                    !isExtOnlyOption(ln) &&
                    !isParamsJsonOption(ln) &&
                    !isDefaultHelpLine(ln) &&
                    !isPlayerOption(ln) &&
                    !isScheduler(ln) &&
                    !isMonitorPerformance(ln) &&
                    !isUserId(ln) &&
                    !isWebdriverTimeout(ln) &&
                    !isSaveRCALocally(ln) &&
                    !isExitCodeIgnoreFailingTests(ln) &&
                    !isDeprecatedHighSpeed(ln)
            )
            .join('\n');
    });
};

const printDeprecationWarning = (deprecatedUsage, newUsage) => {
    const newUsageString = newUsage ? `Please use ${newUsage} instead.` : '';
    console.log(chalk.yellow(`\nWARNING: ${deprecatedUsage} is deprecated. ${newUsageString}\n`));
};

const CODE_COVERAGE_REPORTER_OPTIONS = [
    'clover',
    'html',
    'json-summary',
    'json',
    'lcov',
    'lcovonly',
    'teamcity',
    'text-lcov',
    'text-summary',
    'text',
];
program
    .description('Testim.io CLI')
    .option('-h --help', 'output usage information', printUsage)
    .option('-o --options-file [options-file.json]', '')
    .option('-c --config-file [config-file.js]', '')
    .option('--test-config [test-config]', 'test config name to override for all tests in current execution', collect, [])
    .option('--test-config-id [test-config-id]', 'test config ID to override for all tests in current execution', collect, [])
    .option('--params-file [params-file.json]', '')
    .option('--params [params-json-string]', '')
    .option('-t, --testId [test-id]', 'test ID to run', collect, [])
    .option('run [file-glob-pattern]', 'codeful test files to run', collect, [])
    .option('-w, --webpackConfig [webpack-configuration]', 'webpack configuration used to build the code based project')
    .option('--test-id [test-id]', 'test ID to run', collect, [])
    .option('-l, --label [label]', 'labels to search test by', collect, [])
    .option('-n, --name [test-name]', 'test name to run', collect, [])
    .option('--project [project-id]', 'project ID')
    .option('-r, --report-file [report junit xml path]', 'where to save junit xml results file')
    .option('--override-report-file-classname [override-report-file-classname]', 'custom junit class name for the junit reporter')
    .option('--reporters [names]', 'report types', list)
    .option('-h, --host [host-name]', 'host name or ip containing the selenium grid')
    .option('-p, --port [host-port]', 'host port')
    .option('-g, --grid [grid-name]', 'grid name')
    .option('--path [grid-path]', 'grid path')
    .option('--protocol [grid-protocol]', 'grid protocol http or https')
    .option('--grid-username [grid-username]', 'grid http basic auth username')
    .option('--grid-password [grid-password]', 'grid http basic auth password')
    .option('-gi --grid-id [grid-id]', 'grid ID')
    .option('-b, --browser [browser-type]', 'browser type (chrome/firefox)')
    .option('-h, --headless [headless]', 'run in headless mode')
    .option('-m, --mode [runner-mode]', 'use extension or selenium mode (extension/selenium/appium)')
    .option('--branch [branch]', 'branch name', null)
    .option('--base-url [base-url]', 'change al test base-url to a specified url')
    .option('--token [token]', 'identification token to testim')
    .option('--is-regression-baseline-run', 'save doms and run results as regression baseline data')
    .option('--parallel [number-of-tests]', 'number of tests to run on parallel')
    .option('--before-parallel [number-of-tests]', 'number of tests to run on parallel in the before phase of a test plan')
    .option('--after-parallel [number-of-tests]', 'number of tests to run on parallel in the after phase of a test plan')
    .option('--canary [canary-mode]', 'enable canary mode', false)
    .option('--test-plan [test-plan-name]', 'test plan to run', collect, [])
    .option('--test-plan-id [test-plan-id]', 'test plan to run', collect, [])
    .option('--suite [suite-name]', 'suite to run', collect, [])
    .option('--suite-id [suite-id]', 'suite ID to run', collect, [])
    .option('--rerun-failed-by-run-id [run-id]', 'allows re-running failed tests from a specific run ID')
    .option('--disable-grid-check [boolean]', 'disable checking if selenium grid is available', false)
    .option('--disable-native-events [boolean]', 'pass nativeEvents=false capability to the selenium browser (in selenium mode)', false)
    .option('--disable-timeout-retry [boolean]', 'disable retry after test pass test timeout', false)
    .option('--ca-file [ca-file-location]', 'ca certificate file location')
    .option('--proxy [proxy-url]', 'proxy url to all requests')
    .option('--proxy-for-grid [proxy-for-grid]', 'used together with --proxy to also router grid traffic through a proxy')
    .option('--result-label [result-label]', 'result label', collect, [])
    .option('-oen --override-execution-name [execution-name]', 'override the default execution name', '')
    .option('--retries [max_num_of_retries]', 'number of retires failure test defaults to not retrying', 0)
    .option('--set-retention [retention-in-days]', 'set the number of days for results retention')
    .option('--user [user-id]', 'user ID for local Testim-CLI')
    .option('--pass-zero-tests', 'don\'t fail the run if no tests were found')

    .option('-str --suppress-tms-reporting [suppress-tms-reporting]', 'disable test management reporting', false)
    .option('-tsr --tms-suppress-reporting [tms-suppress-reporting]', 'disable test management reporting', false)
    .option('-tid --tms-run-id [tms-run-id]', 'update existing result in test management', '')
    .option('-tff --tms-field-file [tms-field-file.json]', 'pass field file location to add custom result field to the tms result report', '')

    .option('--disable-file-cache', 'disable internal CLI file caching')
    .option('--file-cache-location [directory]', ' internal CLI file caching location')

    // Timeout
    .option('--timeout [test-timeout]', 'test run timeout in milliseconds')
    .option('--browser-timeout [open-browser-timeout]', 'get browser from grid timeout in milliseconds')
    .option('--new-browser-wait-timeout [max-wait-to-browser]', 'maximum get browser wait in minutes')

    // New Timeouts
    .option('--get-browser-timeout [get-browser-timeout]', 'Timeout for a single attempt to get browser from the grid configured in the project\'s plan') // getBrowserTimeout
    .option('--get-browser-retries [get-browser-retries]', 'Number of attempts to get browser from the grid configured in the project\'s plan') // getBrowserRetries
    .option('--get-session-timeout [get-session-timeout]', 'Timeout for "/session" request to the selenium server', ms('90s')) // getSessionTimeout
    .option('--get-session-retries [get-session-retries]', 'Retries for "/session" request to the selenium server', 3) // getSessionRetries
    .option('--driver-request-timeout [driver-request-timeout]', 'Timeout for any WebDriver request to the grid server', ms('90s')) // driverRequestTimeout
    .option('--driver-request-retries [driver-request-retries]', 'Retries for any WebDriver request to the grid server', 3) // driverRequestRetries

    // Run chrome ext mode locally
    .option('--use-local-chrome-driver [use-local-chrome-driver]', 'use a local ChromeDriver instance instead of a selenium grid')
    .option('--chrome-binary-location [chrome-binary-location]', 'Chrome binary location')

    // Run chrome ext mode locally using chrome launcher
    .option('--use-chrome-launcher', 'use a local Chrome installation without selenium')

    // Mock network
    .option('-mnh --mock-network-har', 'use the HAR file configured in the Testim editor to mock network traffic')
    .option('-mnp --mock-network-pattern [local file location path]', 'use a JSON rule file to mock network traffic (Rule file schema: https://help.testim.io/page/mocking-network-traffic)')
    .option(
        '-omf --override-mapping-file [local file location path]',
        'pass map file location to override mock network (see schema: https://help.testim.io/page/mocking-network-traffic)',
    )
    .option('-dmn --disable-mock-network', 'Disable mock mode for the entire CLI run')
    .option('--run-quarantined-tests', 'Run quarantine tests')

    // Code coverage
    .option('--collect-code-coverage', 'collect code coverage for all js files under base url')
    .option('--code-coverage-url-filter [url pattern]', 'collect code coverage for all js files matching url filter (url including asterisk)')
    .option('--code-coverage-report-path [path]', 'where to save coverage report (default ./coverage)')
    .option('--code-coverage-source-map-path [path]', 'path of source code')
    .option('--code-coverage-reporter [reporter]', `set code coverage reporter (default html and text), options: ${CODE_COVERAGE_REPORTER_OPTIONS.join('/')}`, collect, [])
    .option('--code-coverage-include [pattern]', 'set selecting files for coverage (default src/**)', collect, [])

    // SauceLab
    .option('--sauce-user [sauce-lab-user]', 'user to connect to sauce labs')
    .option('--sauce-key [sauce-lab-key]', 'key to use when connecting to sauce labs')
    .option('--sauce-options [sauce-options]', 'json file of browser and os options for sauce')

    // Browserstack
    .option('--browserstack-user [browserstack-user]', 'user to connect to browserStack')
    .option('--browserstack-key [browserstack-key]', 'key to use when connecting to browserStack')
    .option('--browserstack-options [browserstack-options]', 'json file of browser and os options for browserStack')

    // Perfecto
    .option('--perfecto-token [perfecto-token]', 'security token to use when connecting to perfecto')
    .option('--perfecto-options [perfecto-options]', 'json file of browser and os options for perfecto')

    // Experitest
    .option('--experitest-token [experitest-token]', 'security token to use when connecting to experitest')

    // TestObject
    .option('--testobject-key [testobject-key]', 'api key to use when connecting to testobject')
    .option('--testobject-options [testobject-options]', 'json file of options for testobject')

    // Extension
    .option('--ext [extension src path]', 'use extension from path (default it \'/..\')')
    .option('--extension-path [path to extension archived file]', 'override the used extension')

    //Customer Extension
    .option('--install-custom-extension [chrome extension zipped file url or local path]', 'chrome extension to be installed in the browser')

    // Player
    .option('--player-path [path to player file]')
    .option('--player-require-path [path to unminified player - development only]')

    // Codim Init
    .option('init [init]', 'Path for an initial test app')

    // Node Inspect as a flag
    .option('--inspect [port]', 'Opens node inspector at given port', Number)

    // Logging in - saving token and projectId
    .option('--login', 'Log in to Testim')
    .option('--require-credentials', 'Log in to Testim if not already logged in')

    // Tunnel
    .option('tunneld', 'run a tunnel daemon only')
    .option('--tunnel [tunnel]', 'enable tunnel')
    .option('--tunnel-routes [routes]', 'tunnel routes for cloudflare tunnels')
    .option('--tunnel-port [tunnel-port]', 'tunnel port address')
    .option('--tunnel-host-header [tunnel-host-header]', 'tunnel host header')
    .option('--tunnel-region [tunnel-region]', 'ngrok tunnel region')
    .option('--tunnel-diagnostics', 'collect ngrok tunnel diagnostics')
    .option('--tunnel-use-http-address [tunnel-use-http-address]', 'use http:// address instead of https://', false)
    .option('--external-lambdatest-tunnel-id [tunnel-id]', 'use existing lambdatest tunnel ID')
    .option('--external-lambdatest-use-wss', 'use wss instead of ssh for LT', false)
    .option('--external-lambdatest-disable-automation-tunneling', 'don\'t tunnel Testim calls in LT tunnel', true)
    .option('--external-lambdatest-mitm', 'Turn on LT Man in the middle', false)

    .option('--w3c-capabilities [enable-w3c-caps-mode]', 'enable/disable w3c capabilities format (default enable)', JSON.parse, true)
    .option('--old-capabilities [enable-old-caps-mode]', 'enable/disable old capabilities format (default enable)', JSON.parse, true)
    .option('--disable-sockets', 'Disable CLI sockets', false)

    // Remote run options
    .option('--executionId [execution-id]', '', '')
    .option('--remoteRunId [remote-run-id]', '', '')
    .option('--schedulerId [scheduler-id]', '', '')
    .option('--source [source]', '', 'cli')
    .option('--resultId [result-id]', '', '')

    // Agent mode
    .option('connect, --agent [enable-agent-mode]', 'enable Testim CLI agent mode', false)
    .option('start [enable-start]', 'Connect to testim and open the editor in a standalone browser', false)
    .option('--download-browser', 'when used with the start option, downloads a fixed version to run Testim editor in', false)
    .option('--agent-port [agent-port]', 'set agent port', Number, 42543)
    .option('--agent-bind [agent-host-bind]', 'set agent host bind', '127.0.0.1')

    .option('--chrome-extra-prefs [chrome-extra-prefs]', 'add extra chrome preferences', '')
    .option('--chrome-extra-args [chrome-extra-args]', 'add extra chrome arguments separated by \',\'', '')
    .option('--chrome-block-location [chrome-block-location]', 'block chrome geolocation', false)
    .option('--chrome-user-data-dir [chrome-user-data-dir]', 'use custom chrome user date dir', false)

    .option('--disable-cookies-same-site-none-requires-secure [disable-same-site-none-requires-secure]', 'Disable cookies without SameSite must be secure', false)

    .option('--selenium-caps-file [selenium-caps-file.json]', 'json file to merge into Testim selenium desired capabilities')

    .option('--version [version]', 'print the current version of the Testim CLI and exit', false)
    .option('--monitor-performance', 'collect test playback performance data')

    .option('--high-speed', 'DEPRECATED: use --turbo-mode instead') // When removing, remove from the program.help output filter
    .option('--turbo-mode', 'run in turbo mode')
    .option('--lightweight-mode [settings]', 'run lightweight mode')
    .option('--create-prefeched-data [location]', 'prefetch data into local cache file')
    .option('--use-prefeched-data [location]', 'use prefetched data from local cache file, and force using only cached data')
    .option('--save-rca-locally [path]', 'save root cause analysis assets locally')

    .option('--exit-code-ignore-failing-tests', 'dont return non zero exit code when tests fail. non zero exit code will mean a real error occurred')

    .option('--intersect-with-label [label]', 'Out of the execution\'s test list, run only those tests that have the specified label', collect, [])
    .option('--intersect-with-suite [suiteName]', 'Out of the execution\'s test list, run only those tests that are included in the specified suite (by suite name)', collect, [])
    .option('--intersect-with-suite-id [suiteId]', 'Out of the execution\'s test list, run only those tests that are included in the specified suite (by suite ID)', collect, [])
    .parse(process.argv);


module.exports = {
    async process() {
        if (program.inspect) {
            const inspector = require('inspector');
            inspector.open(program.inspect);
        }

        let userParamsData = {};
        let chromeExtraPrefs = {};
        const chromeExtraArgs = [];
        let seleniumCapsFileContent = {};

        if (!process.argv.slice(2).length) {
            printUsage();
            throw new NoArgsError();
        }

        if (program.requireCredentials) {
            const credentialsManager = require('./credentialsManager');
            const projectId = await credentialsManager.getProjectId();
            const token = await credentialsManager.getToken();

            if (!projectId || !token) {
                await credentialsManager.doLogin();
            }
        }

        if (program.login) {
            const credentialsManager = require('./credentialsManager');
            await credentialsManager.doLogin();

            return { loginMode: true };
        }

        if (program.init) {
            return {
                initCodimMode: true,
                initTestProject: program.init,
            };
        }

        if (program.version) {
            const message = 'Testim CLI Version: ';
            if (process.env.npm_package_version) {
                console.log(message, process.env.npm_package_version);
                process.exit(0);
            }
            try {
                // [NOTE] in production they are in the same folder
                // eslint-disable-next-line import/no-unresolved
                console.log(message, require('./package.json').version);
                process.exit(0);
            } catch (e) {
                //pass
            }
            try {
                // in dev, they are one level up
                console.log(message, require('../package.json').version);
                process.exit(0);
            } catch (e) {
                //pass
            }
            console.log('Could not find version, please check the package.json manually');
            process.exit(0);
        }

        if (program.disableFileCache) {
            localRunnerCache.disable();
        }

        const cacheLocationProvided = program.fileCacheLocation || program.usePrefechedData || program.createPrefechedData;

        if (cacheLocationProvided) {
            const location = path.resolve(cacheLocationProvided);
            localRunnerCache.setCacheLocation(location);
        }

        if (program.usePrefechedData) {
            localRunnerCache.disableCacheMiss();
        }

        if (program.playerRequirePath) {
            const fullPlayerPath = path.resolve(program.playerRequirePath);
            let projectFile;
            console.log('Using Local Clickim for Player Require Path =', fullPlayerPath);
            if (program.browser && ['ie11', 'ie', 'internet explorer'].includes(program.browser.toLowerCase())) {
                projectFile = path.join(fullPlayerPath, 'tsconfig.ie11.json');
            } else {
                projectFile = path.join(fullPlayerPath, 'tsconfig.node.json');
            }

            // [NOTE] playerRequirePath is a dev flag
            // eslint-disable-next-line import/no-extraneous-dependencies
            const tsnodeApi = require('ts-node');
            const tsNodeRegisterInstance = tsnodeApi.register({
                project: projectFile,
                ignore: [
                    // restore default value
                    /node_modules/,
                    // based on that code:
                    // https://github.com/TypeStrong/ts-node/blob/c1ae9a069a824368c9aaf89f4454b131af44a92f/src/index.ts#L368
                    // it will not touch this project files, but will work on clickim code
                    new RegExp(`^${_.escapeRegExp(path.relative(process.cwd(), __dirname))}`),
                ],
                transpileOnly: true,
            });

            // [NOTE] playerRequirePath is a dev flag
            // eslint-disable-next-line import/no-extraneous-dependencies
            const tsConfigPathsApi = require('tsconfig-paths');
            tsConfigPathsApi.register({
                paths: tsNodeRegisterInstance.config.options.paths,
                baseUrl: tsNodeRegisterInstance.config.options.baseUrl,
            });

            const Module = require('module');
            const originalRequire = Module.prototype.require;
            Module.prototype.require = function requireThatOverridesSessionPlayer(id) {
                if (id.endsWith('getSessionPlayerRequire')) {
                    const sessionPlayerPath = path.resolve(fullPlayerPath, 'src/background/sessionPlayerInit.ts');
                    return originalRequire.call(this, sessionPlayerPath);
                }
                if (id === 'rox-alias') {
                    return originalRequire.call(this, 'rox-node');
                }
                // eslint-disable-next-line prefer-rest-params
                return originalRequire.apply(this, arguments);
            };
        }

        if (program.caFile) {
            global.caFileContent = fs.readFileSync(program.caFile);
        }

        if (program.proxy) {
            global.proxyUri = program.proxy;
            // used by Clickim internally and by the runner, included here lazily to not make things slower for the
            // non-proxy case
            global.SuperagentProxy = require('superagent-proxy');
            global.ProxyAgent = require('proxy-agent');
        }

        if (program.proxyForGrid && !program.proxy) {
            throw new ArgError('missing --proxy option');
        }

        if (runOptionsAgentFlow.isAgentFlow(program)) {
            return runOptionsAgentFlow.runAgentFlow(program);
        }

        // merge options from file
        try {
            let options = {};
            if (program.configFile) {
                options = require(path.join(process.cwd(), program.configFile)).config;
            } else if (program.optionsFile) {
                options = require(path.join(process.cwd(), program.optionsFile));
            }

            // technically would work on anything, but no reason to add a tick for nothing.
            if (options && typeof options.then === 'function') {
                options = await options;
            }

            Object.keys(options).forEach((prop) => {
                const safePropName = camelizeHyphenValues(prop);
                program[safePropName] = mergeValues(program[safePropName], options[prop]);
            });
        } catch (err) {
            err.message = `Unable to read options file: ${err.message}`;
            throw err;
        }

        if (program.tunneld) {
            return {
                tunnel: true,
                tunnelPort: program.tunnelPort,
                tunnelRoutes: program.tunnelRoutes,
                tunnelRoutesOutput: program.tunnelRoutesOutput,
                tunnelHostHeader: program.tunnelHostHeader,
                tunnelRegion: program.tunnelRegion,
                tunnelDiagnostics: program.tunnelDiagnostics,
                tunnelUseHttpAddress: program.tunnelUseHttpAddress,
                tunnelOnlyMode: true,
                token: program.token,
                project: program.project,
            };
        }


        const isTestConfigSpecified = (program.testConfig && program.testConfig.length) || (program.testConfigId && program.testConfigId.length);
        const isTestPlanSpecified = (program.testPlan && program.testPlan.length) || (program.testPlanId && program.testPlanId.length);
        const isSuiteSpecified = (program.suite && program.suite.length) || (program.suiteId && program.suiteId.length);

        if (program.seleniumCapsFile) {
            try {
                seleniumCapsFileContent = require(path.join(process.cwd(), program.seleniumCapsFile));
            } catch (err) {
                return Promise.reject(new ArgError(`Failed to parse selenium caps file file error: ${err.message}`));
            }
        }

        if (program.reporters && program.reporters.includes('junit') && !program.reportFile) {
            console.log('Warning: please define --report-file option for JUnit reporter');
        }

        if (!program.tunnel && program.externalLambdatestTunnelId) {
            throw new ArgError('missing --tunnel parameter');
        }

        if (!program.tunnel && program.externalLambdatestUseWss) {
            throw new ArgError('missing --tunnel parameter');
        }

        if (!program.tunnel && [program.tunnelPort, program.tunnelHostHeader, program.tunnelRegion, program.tunnelDiagnostics].some(Boolean)) {
            throw new ArgError('missing --tunnel parameter');
        }
        if (program.chromeExtraPrefs) {
            try {
                chromeExtraPrefs = require(path.join(process.cwd(), program.chromeExtraPrefs));
            } catch (err) {
                return Promise.reject(new ArgError(`Failed to read/open chrome extra prefs file error: ${err.message}`));
            }
        }

        if (program.chromeExtraArgs) {
            const args = program.chromeExtraArgs.split(',');
            for (const arg of args) {
                const [argName] = arg.split('=');
                if (allowedChromeFlags.includes(argName) || program.useLocalChromeDriver || program.useChromeLauncher) {
                    chromeExtraArgs.push(arg);
                    if (argName === 'proxy-server') {
                        chromeExtraArgs.push('proxy-bypass-list=*.testim.io;*.coralogix.com;*.cloudinary.com;*.rollout.io');
                    }
                } else {
                    console.warn(`Ignoring an unsupported chrome arg (${argName}), allowed values: ${JSON.stringify(allowedChromeFlags)}`);
                }
            }
        }

        if (program.paramsFile) {
            try {
                userParamsData = Object.assign({}, userParamsData, require(path.join(process.cwd(), program.paramsFile)));
            } catch (err) {
                return Promise.reject(new ArgError(`Failed to read/open params file error: ${err.message}`));
            }
        }

        if (program.params) {
            try {
                userParamsData = Object.assign({}, userParamsData, JSON.parse(program.params));
            } catch (err) {
                return Promise.reject(new ArgError(`Failed to parse params string error: ${err.message}`));
            }
        }

        // SauceLabs Options
        if ((program.sauceUser && !program.sauceKey) || (!program.sauceUser && program.sauceKey)) {
            throw new ArgError('missing --sauce-user <sauce-user> or --sauce-key <sauce-key>');
        }

        if (program.sauceUser && program.sauceKey) {
            setHostAndPortForSauceLab();
            program.saucelabs = {};

            program.saucelabs.username = program.sauceUser;
            program.saucelabs.accessKey = program.sauceKey;
        }

        if (program.sauceOptions) {
            try {
                const sOptions = require(path.join(process.cwd(), program.sauceOptions));
                const isMobile = sOptions.platformName && ['ios', 'android'].includes(sOptions.platformName.toLowerCase());
                if (sOptions.browserName) {
                    const browserName = sOptions.browserName.toLowerCase();
                    switch (browserName) {
                        case 'microsoftedge':
                            program.browser = 'edge';
                            break;
                        case 'internet explorer':
                            program.browser = 'ie';
                            break;
                        default:
                            program.browser = browserName;
                    }
                }

                if (program.browser === 'edge' && parseFloat(sOptions.version) >= EDGE_CHROMIUM_MIN_VERSION) {
                    program.browser = 'edge-chromium';
                }

                const isBadVersion = parseFloat(sOptions.version) < 50 && !['dev', 'beta'].includes(sOptions.version);
                if (!isMobile && program.browser === 'chrome' && isBadVersion) {
                    return Promise.reject(new ArgError('The minimum chrome supported version is 50.0'));
                }

                program.saucelabs = Object.assign({}, program.saucelabs, sOptions);
            } catch (err) {
                return Promise.reject(new ArgError(`Failed to parse saucelabs options file error: ${err.message}`));
            }
        }

        // BrowserStack options
        if ((program.browserstackUser && !program.browserstackKey) || (!program.browserstackUser && program.browserstackKey)) {
            throw new ArgError('missing --browserstack-user <browserstack-user> or --browserstack-key <browserstack-key>');
        }
        if (program.browserstackUser && program.browserstackKey) {
            setHostAndPortForBrowserStack();
            program.browserstack = {};

            program.browserstack['browserstack.user'] = program.browserstackUser;
            program.browserstack['browserstack.key'] = program.browserstackKey;
        }

        if (program.browserstackOptions) {
            try {
                const bsOptions = require(path.join(process.cwd(), program.browserstackOptions));
                const isMobile = bsOptions.platform && ['mac', 'android'].includes(bsOptions.platform.toLowerCase());
                if (bsOptions.browserName) {
                    program.browser = bsOptions.browserName.toLowerCase();
                }

                if (program.browser === 'edge' && parseFloat(bsOptions.browser_version) >= EDGE_CHROMIUM_MIN_VERSION) {
                    program.browser = 'edge-chromium';
                }

                if (!isMobile && parseFloat(bsOptions.browser_version) < 50 && program.browser === 'chrome') {
                    return Promise.reject(new ArgError('The minimum chrome supported version is 50.0'));
                }

                program.browserstack = Object.assign({}, program.browserstack, bsOptions);
            } catch (err) {
                return Promise.reject(new ArgError(`Failed to parse browserstack options file error: ${err.message}`));
            }
        }

        program.perfecto = {};

        if (program.perfectoToken) {
            program.perfecto.securityToken = program.perfectoToken;
        }

        if (program.perfectoOptions) {
            try {
                const perfectoOptions = require(path.join(process.cwd(), program.perfectoOptions));
                const DEFAULTS = { location: 'US East', securityToken: program.perfectoToken };
                program.perfecto = Object.assign({}, DEFAULTS, perfectoOptions);
            } catch (err) {
                return Promise.reject(new ArgError(`Failed to parse perfecto options file error: ${err.message}`));
            }
        }

        program.testobjectSauce = {};

        if (program.testobjectKey) {
            program.testobjectSauce.testobjectApiKey = program.testobjectKey;
        }

        if (program.testobjectOptions) {
            try {
                const testobjectOptions = require(path.join(process.cwd(), program.testobjectOptions));
                const DEFAULTS = { testobjectApiKey: program.testobjectKey };
                program.testobjectSauce = Object.assign({}, DEFAULTS, testobjectOptions);
            } catch (err) {
                return Promise.reject(new ArgError(`Failed to parse test object options file error: ${err.message}`));
            }
        }

        if (!program.project) {
            const credentialsManager = require('./credentialsManager');
            const projectId = await credentialsManager.getProjectId();

            if (projectId) {
                program.project = projectId;
            } else {
                throw new ArgError('missing project-id info, either --login to provide new credentials or use --project <project-id>');
            }
        }

        if (!program.mode) {
            // we default to selenium mode in Codim for debuggability
            program.mode = program.run.length ? 'selenium' : 'extension';
        }

        if (program.testConfig) {
            // convert single test config inputs to array (e.g. from configFile)
            program.testConfig = [program.testConfig].flat();
        }

        if (program.testConfigId) {
            // convert single test config inputs to array (e.g. from configFile)
            program.testConfigId = [program.testConfigId].flat();
        }

        program.retries = !program.retries || typeof program.retries === 'boolean' ? 1 : Number(program.retries) + 1;
        program.browserTimeout = !program.browserTimeout || typeof program.browserTimeout === 'boolean' ? 60 * 1000 : Number(program.browserTimeout);
        program.newBrowserWaitTimeout = !program.newBrowserWaitTimeout || typeof program.newBrowserWaitTimeout === 'boolean' ? 10 * 60 * 1000 : Number(program.newBrowserWaitTimeout * 60 * 1000);

        if (!program.getBrowserTimeout) {
            program.getBrowserTimeout = program.browserTimeout;
        }
        if (!program.getBrowserRetries) {
            program.getBrowserRetries = Math.round(program.newBrowserWaitTimeout / program.browserTimeout);
        }
        program.getSessionTimeout = program.browserTimeout < program.getSessionTimeout ? program.getSessionTimeout : program.browserTimeout;
        program.driverRequestTimeout = program.browserTimeout < program.driverRequestTimeout ? program.driverRequestTimeout : program.browserTimeout;

        const timeoutWasGiven = Boolean(program.timeout);
        program.timeout = !program.timeout || typeof program.timeout === 'boolean' ? 10 * 60 * 1000 : Number(program.timeout);
        program.beforeParallel = !program.beforeParallel || typeof program.beforeParallel === 'boolean' ? 1 : Number(program.beforeParallel);
        program.parallel = !program.parallel || typeof program.parallel === 'boolean' ? 1 : Number(program.parallel);
        program.afterParallel = !program.afterParallel || typeof program.afterParallel === 'boolean' ? 1 : Number(program.afterParallel);


        if (program.parallel > 1 && program.run && !program.gridId && !program.grid &&
            ((!program.testPlan || program.testPlan.length === 0) && (!program.testPlanId || !program.testPlanId.length)) && process.stdout.isTTY && !program.headless && !process.env.TERM) {
            const prompts = require('prompts');
            const response = await prompts({
                type: 'toggle',
                name: 'isSure',
                message: 'Running in parallel without --headless flag will open several browsers on your computer. Are you sure?',
                initial: false,
                active: 'yes',
                inactive: 'no',
            });

            if (!response.isSure) {
                process.exit(0);
            }
        }

        program.tunnelPort = !program.tunnelPort || typeof program.tunnelPort === 'boolean' ? '80' : program.tunnelPort;

        program.port = program.port && Number(program.port);

        if (program.retries <= 0 || _.isNaN(program.retries)) {
            throw new ArgError('test failure retry count could not be a negative number or string, --retries <max_num_of_retries>');
        }

        if (program.retries > 21) {
            throw new ArgError('Max number of retries exceeded. Number cannot be greater than 20, --retries <max_num_of_retries>');
        }

        if (!program.token) {
            const credentialsManager = require('./credentialsManager');
            const credentialToken = await credentialsManager.getToken();

            if (credentialToken) {
                program.token = credentialToken;
            } else {
                throw new ArgError('missing Testim Access Token, either --login to provide new credentials or use --token <testim-access-token>, contact info@testim.io if you need a new one.');
            }
        }

        if (program.browserTimeout <= 0 || _.isNaN(program.browserTimeout)) {
            throw new ArgError('get browser timeout could not be a negative number, --browser-timeout <get-browser-timeout>');
        }

        if (program.newBrowserWaitTimeout <= 0 || _.isNaN(program.newBrowserWaitTimeout)) {
            throw new ArgError('max new browser wait timeout could not be a negative number, --new-browser-wait-timeout <max-wait-to-browser>');
        }

        if (program.timeout <= 0 || _.isNaN(program.timeout)) {
            throw new ArgError('test run timeout could not be a negative number, --timeout <run-timeout>');
        }

        if (program.beforeParallel <= 0 || _.isNaN(program.beforeParallel)) {
            throw new ArgError('before-parallel could not be a negative number or not number, --before-parallel <number-of-tests>');
        }

        if (program.parallel <= 0 || _.isNaN(program.parallel)) {
            throw new ArgError('parallel could not be a negative number or not number, --parallel <number-of-tests>');
        }

        if (program.afterParallel <= 0 || _.isNaN(program.afterParallel)) {
            throw new ArgError('after-parallel could not be a negative number or not number, --after-parallel <number-of-tests>');
        }

        if (![CLI_MODE.EXTENSION, CLI_MODE.SELENIUM].includes(program.mode)) {
            throw new ArgError(`runner mode <${program.mode}> is not supported`);
        }

        if ((program.mode !== CLI_MODE.SELENIUM) && program.disableNativeEvents) {
            throw new ArgError('disable-native-events is only applicable in selenium mode');
        }

        if (
            !program.browser &&
            !isTestConfigSpecified &&
            !isTestPlanSpecified
        ) {
            program.browser = 'chrome';
        }

        if (program.testPlan && program.testPlan.length === 0 && program.testPlanId && program.testPlanId.length === 0) {
            if (
                typeof program.host !== 'string' &&
                typeof program.grid !== 'string' &&
                typeof program.gridId !== 'string' &&
                program.run.length === 0 &&
                !program.useLocalChromeDriver &&
                !program.useChromeLauncher &&
                !program.createPrefechedData
            ) {
                throw new ArgError(
                    'missing remote grid address parameter, specify --host <host-name-or-ip> or --grid <grid-name> or --grid-id <grid-id>'
                );
            }
        } else if (
            program.testId.length ||
            program.label.length ||
            program.name.length ||
            isTestConfigSpecified ||
            program.browser ||
            isSuiteSpecified ||
            program.useLocalChromeDriver ||
            program.useChromeLauncher
        ) {
            throw new ArgError(
                'cannot set --testId, --label, --name, --browser, --test-config, --test-config-id, --use-local-chrome-driver --use-chrome-launcher or --suite with --test-plan option'
            );
        }

        if (!isTestPlanSpecified && (program.beforeParallel !== 1 || program.afterParallel !== 1)) {
            throw new ArgError('cannot set --before-parallel or --after-parallel without --test-plan option');
        }

        if (
            (program.testId.length ||
                isTestPlanSpecified ||
                program.label.length ||
                program.name.length ||
                isSuiteSpecified) &&
            program.file
        ) {
            throw new ArgError(
                'Cannot pass codeful automation tests with --testId --label --name or --suite'
            );
        }

        const numberOfDefinedHosts = [program.host, program.grid, program.gridId].filter(Boolean).length;
        if (numberOfDefinedHosts > 1) {
            throw new ArgError('please define exactly one of --grid or --grid-id or --host');
        }

        if (program.host && program.host.includes('/')) {
            if (!/^(f|ht)tps?:\/\//i.test(program.host)) {
                program.host = `http://${program.host}`;
            }
            program.host = url.parse(program.host).hostname;
        }

        if (program.resultLabel.length) {
            program.resultLabel = program.resultLabel.map(label => label.trim()).filter(Boolean);
            const invalidLabels = program.resultLabel.filter(label => label.length >= 250).filter(Boolean);
            if (invalidLabels.length) {
                throw new ArgError('A result label cannot exceed 250 characters');
            }
        }

        const extHeadlessUrl = runOptionsUtils.getResolvedExtensionUrl(program);
        const playerUrl = runOptionsUtils.getPlayerUrl(program);

        if (!program.w3cCapabilities && !program.oldCapabilities) {
            throw new ArgError('cannot set --w3c-capabilities and --old-capabilities options as false');
        }
        program.protocol = program.protocol || (program.port === 443 ? 'https' : 'http');
        if (!['http', 'https'].includes(program.protocol)) {
            throw new ArgError('invalid --protocol value, allow --protocol http or https');
        }

        if (program.rerunFailedByRunId && program.branch) {
            throw new ArgError('It is not possible to use --branch with --rerun-failed-by-run-id. Tests will automatically run on the same branch that was used in the original run');
        }

        if (program.rerunFailedByRunId &&
            (isSuiteSpecified || program.name.length ||
                program.testId.length || program.label.length || isTestPlanSpecified)) {
            throw new ArgError('Re-running failed tests is not possible when suite (--suite),' +
                ' label (--label), plan (--test-plan), or other test flags (--test) are provided. Please remove these flags and try again');
        }

        if (program.run.length) {
            const glob = require('glob');
            program.files = _.flatMap(program.run, files => glob.sync(files));
            if (program.files.length === 0) {
                throw new ArgError(`No files found at path '${program.run}'.`);
            }
        } else {
            program.files = [];
        }

        if (program.setRetention && !_.inRange(_.parseInt(program.setRetention), 1, 11)) {
            throw new ArgError('Please provide the number of days that the test results will be retained for (--set-retention must be a whole number between 1 to 10)');
        }
        program.setRetention = program.setRetention && Number(program.setRetention);

        const mockNetworkDeprecationMsg = 'is no longer supported, please use --override-mapping-file';
        if (program.mockNetworkHar) {
            throw new ArgError(`--mock-network-har ${mockNetworkDeprecationMsg}`);
        }
        if (program.mockNetworkPattern) {
            throw new ArgError(`--mock-network-pattern ${mockNetworkDeprecationMsg}`);
        }

        if (program.disableMockNetwork && program.overrideMappingFile) {
            throw new ArgError('You can either use --disable-mock-network or --override-mapping-file');
        }

        if (!program.collectCodeCoverage && program.codeCoverageSourceMapPath) {
            throw new ArgError('cannot set --code-coverage-source-map-path without passing --collect-code-coverage');
        }

        if (!program.collectCodeCoverage && program.codeCoverageReporter.length) {
            throw new ArgError('cannot set --code-coverage-reporter without passing --collect-code-coverage');
        }

        if (!program.collectCodeCoverage && program.codeCoverageInclude.length) {
            throw new ArgError('cannot set --code-coverage-include without passing --collect-code-coverage');
        }

        if (program.collectCodeCoverage && program.codeCoverageReporter && _.difference(program.codeCoverageReporter, CODE_COVERAGE_REPORTER_OPTIONS).length) {
            const diff = _.difference(program.codeCoverageReporter, CODE_COVERAGE_REPORTER_OPTIONS);
            throw new ArgError(`invalid --code-coverage-reporter parameters ${diff.join('/')}`);
        }

        program.codeCoverageReporter = program.codeCoverageReporter.length === 0 ? ['html', 'text'] : program.codeCoverageReporter;
        program.codeCoverageInclude = program.codeCoverageInclude.length === 0 ? ['src/**'] : program.codeCoverageInclude;

        const extensionOnlyOptions = {
            mockNetworkHar: '--mock-network-har',
            mockNetworkPattern: '--mock-network-pattern',
            overrideMappingFile: '--override-mapping-file',
            codeCoverageUrlFilter: '--code-coverage-url-filter',
            collectCodeCoverage: '--collect-code-coverage',
            disableMockNetwork: '--disable-mock-network',
            useChromeLauncher: '--use-chrome-launcher',
        };
        const usedExtensionOptions = Object.keys(extensionOnlyOptions).filter(key => Boolean(program[key]));

        if (program.mode !== CLI_MODE.EXTENSION && usedExtensionOptions.length) {
            const multi = usedExtensionOptions.length > 1 ? 'are' : 'is';
            throw new ArgError(`${usedExtensionOptions.map(key => extensionOnlyOptions[key]).join(' and ')} ${multi} only applicable in extension mode`);
        }

        if (program.tmsFieldFile) {
            try {
                const fileContent = fs.readFileSync(program.tmsFieldFile);
                program.tmsCustomFields = JSON.parse(fileContent);
            } catch (err) {
                return Promise.reject(new ArgError(`failed to parse field file error: ${err.message}`));
            }
        }

        /** Handling deprecation of High speed mode (renamed to Turbo mode) */
        if (program.highSpeed) {
            printDeprecationWarning('--high-speed', ' --turbo-mode');
            program.turboMode = true;
        }

        if (program.lightweightMode) {
            try {
                const DEFAULTS = {
                    general: true,
                    disableLabs: true,
                    disableFeatureFlags: true,
                    disableAssets: true,
                    disablePixelValidation: true,
                    disableResults: true,
                    disableStepDelay: true,
                    disableRemoteStep: true,
                    assumePreloadedSharedSteps: true,
                    disableVisibilityCheck: false,
                    disableLocators: false,
                    bypassSetup: false,
                    disableAutoImprove: true,
                    disableQuotaBlocking: true,
                    onlyTestIdsNoSuite: true,
                    uploadAssetsAndResultsOnFailure: true,
                    preloadTests: true,
                    disableProjectDefaults: true,
                    type: 'lightweight',
                };

                const lightweightModeOptions = typeof program.lightweightMode === 'string' ? JSON.parse(program.lightweightMode) : {};
                program.lightweightMode = Object.assign({}, DEFAULTS, lightweightModeOptions);
            } catch (err) {
                return Promise.reject(new ArgError(`failed to parse lightweightMode settings error: ${err.message}`));
            }
        } else if (program.turboMode && program.mode === CLI_MODE.EXTENSION) {
            program.lightweightMode = {
                general: true,
                disableLabs: false,
                disableFeatureFlags: false,
                disableAssets: true,
                disablePixelValidation: false,
                disableResults: true,
                disableStepDelay: true,
                disableRemoteStep: false,
                assumePreloadedSharedSteps: false,
                disableVisibilityCheck: false,
                disableLocators: false,
                bypassSetup: false,
                disableQuotaBlocking: false,
                disableAutoImprove: false,
                onlyTestIdsNoSuite: false,
                uploadAssetsAndResultsOnFailure: true,
                preloadTests: false,
                disableProjectDefaults: false,
                type: 'turboMode',
            };
        }

        if (typeof program.baseUrl === 'boolean') {
            throw new ArgError('base url cannot be used as a flag, and must contain a string value');
        }

        return ({
            testId: [program.testId].flat(),
            name: [program.name].flat(),
            label: [program.label].flat(),
            suites: [program.suite].flat(),
            suiteIds: [program.suiteId].flat(),
            testPlan: [program.testPlan].flat(),
            testPlanIds: [program.testPlanId].flat(),
            files: [program.files].flat(),
            webpackConfig: program.webpackConfig,
            reportFile: program.reportFile,
            reportFileClassname: program.overrideReportFileClassname,
            reporters: program.reporters,
            project: program.project,
            host: program.host,
            headless: program.headless,
            useLocalChromeDriver: program.useLocalChromeDriver,
            chromeBinaryLocation: program.chromeBinaryLocation,
            useChromeLauncher: program.useChromeLauncher,
            port: program.port,
            grid: program.grid,
            gridId: program.gridId,
            disableNativeEvents: program.disableNativeEvents,
            saucelabs: program.saucelabs,
            browserstack: program.browserstack,
            baseUrl: program.baseUrl,
            branch: (program.branch === 'auto-detect' ? utils.getEnvironmentGitBranch() : program.branch) || 'master',
            autoDetect: program.branch === 'auto-detect',
            token: program.token,
            userParamsData,
            mode: program.mode,
            isRegressionBaselineRun: program.isRegressionBaselineRun,
            browser: program.browser,
            beforeParallel: program.beforeParallel,
            parallel: program.parallel,
            afterParallel: program.afterParallel,
            canary: program.canary,
            rerunFailedByRunId: program.rerunFailedByRunId,
            disableGridCheck: program.disableGridCheck,
            disableTimeoutRetry: program.disableTimeoutRetry,
            resultLabels: program.resultLabel,
            path: program.path,
            protocol: program.protocol,
            perfecto: program.perfecto,
            experitestToken: program.experitestToken,
            testobjectSauce: program.testobjectSauce,
            gridUsername: program.gridUsername,
            gridPassword: program.gridPassword,
            overrideExecutionName: program.overrideExecutionName,

            tmsSuppressReporting: Boolean(program.suppressTmsReporting) || Boolean(program.tmsSuppressReporting),
            tmsRunId: program.tmsRunId,
            tmsCustomFields: program.tmsCustomFields,

            proxyForGrid: program.proxyForGrid,
            retentionDays: program.setRetention,
            passZeroTests: Boolean(program.passZeroTests),
            runQuarantinedTests: Boolean(program.runQuarantinedTests),

            // Extension
            ext: program.ext,
            extensionLocation: [program.extensionPath || extHeadlessUrl].flat(),
            extensionPath: program.extensionPath,

            // Player
            playerLocation: program.playerPath || playerUrl,
            playerPath: program.playerPath,
            playerRequirePath: program.playerRequirePath,

            // Tunnel
            tunnel: program.tunnel,
            tunnelPort: program.tunnelPort,
            tunnelRoutes: program.tunnelRoutes,
            tunnelRoutesOutput: program.tunnelRoutesOutput,
            tunnelHostHeader: program.tunnelHostHeader,
            tunnelRegion: program.tunnelRegion,
            tunnelDiagnostics: program.tunnelDiagnostics,
            tunnelUseHttpAddress: program.tunnelUseHttpAddress,
            externalLambdatestTunnelId: program.externalLambdatestTunnelId,
            externalLambdatestUseWss: program.externalLambdatestUseWss || false,
            externalLambdatestDisableAutomationTunneling: Boolean(program.externalLambdatestDisableAutomationTunneling),
            externalLambdatestMitm: Boolean(program.externalLambdatestMitm),

            // Hooks
            beforeTest: program.beforeTest,
            afterTest: program.afterTest,
            beforeSuite: program.beforeSuite,
            afterSuite: program.afterSuite,

            // Timeout
            timeout: program.timeout,
            timeoutWasGiven,
            browserTimeout: program.browserTimeout,
            newBrowserWaitTimeout: program.newBrowserWaitTimeout,

            // New Timeouts
            getBrowserTimeout: program.getBrowserTimeout,
            getBrowserRetries: program.getBrowserRetries,
            getSessionTimeout: program.getSessionTimeout,
            getSessionRetries: program.getSessionRetries,
            driverRequestTimeout: program.driverRequestTimeout,
            driverRequestRetries: program.driverRequestRetries,

            testConfigNames: program.testConfig,
            testConfigIds: program.testConfigId,

            // Mock network
            overrideMappingFile: program.overrideMappingFile,
            disableMockNetwork: program.disableMockNetwork,

            // Code coverage
            codeCoverageUrlFilter: program.codeCoverageUrlFilter,
            collectCodeCoverage: program.collectCodeCoverage,
            codeCoverageReportPath: program.codeCoverageReportPath,
            codeCoverageSourceMapPath: program.codeCoverageSourceMapPath,
            codeCoverageReporter: program.codeCoverageReporter,
            codeCoverageInclude: program.codeCoverageInclude,

            // Remote run options
            executionId: program.executionId,
            remoteRunId: program.remoteRunId,
            schedulerId: program.schedulerId,
            source: program.source,
            resultId: program.resultId,

            //Customer Extension
            installCustomExtension: program.installCustomExtension,

            w3cCapabilities: program.w3cCapabilities,
            oldCapabilities: program.oldCapabilities,

            chromeBlockLocation: program.chromeBlockLocation,
            chromeUserDataDir: program.chromeUserDataDir,
            retries: program.retries,
            chromeExtraPrefs,
            chromeExtraArgs,

            disableCookiesSameSiteNoneRequiresSecure: program.disableCookiesSameSiteNoneRequiresSecure,

            seleniumCapsFileContent,
            shouldMonitorPerformance: program.monitorPerformance,

            user: program.user,

            lightweightMode: program.lightweightMode,
            createPrefechedData: program.createPrefechedData,

            saveRCALocally: program.saveRcaLocally,
            exitCodeIgnoreFailingTests: program.exitCodeIgnoreFailingTests,

            disableSockets: program.disableSockets,

            // intersections
            intersections: {
                labels: program.intersectWithLabel.length ? [program.intersectWithLabel].flat() : undefined,
                suiteNames: program.intersectWithSuite.length ? [program.intersectWithSuite].flat() : undefined,
                suiteIds: program.intersectWithSuiteId.length ? [program.intersectWithSuiteId].flat() : undefined,
            },

            downloadBrowser: program.downloadBrowser,
        });
    },
};
