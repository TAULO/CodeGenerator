import BlockType from '../../extension-support/block-type';
import ArgumentType from '../../extension-support/argument-type';
import Cast from '../../util/cast';
import translations from './translations.json';
import blockIcon from './block-icon.png';

/**
 * Formatter which is used for translation.
 * This will be replaced which is used in the runtime.
 * @param {object} messageData - format-message object
 * @returns {string} - message for the locale
 */
let formatMessage = messageData => messageData.defaultMessage;

/**
 * Setup format-message for this extension.
 */
const setupTranslations = () => {
    const localeSetup = formatMessage.setup();
    if (localeSetup && localeSetup.translations[localeSetup.locale]) {
        Object.assign(
            localeSetup.translations[localeSetup.locale],
            translations[localeSetup.locale]
        );
    }
};

const EXTENSION_ID = 'tpLinkPlug';

/**
 * URL to get this extension as a module.
 * When it was loaded as a module, 'extensionURL' will be replaced a URL which is retrieved from.
 * @type {string}
 */
let extensionURL = 'https://yokobond.github.io/xcx-tplink-plug/dist/tpLinkPlug.mjs';

/**
 * Scratch 3.0 blocks for example of Xcratch.
 */
class ExtensionBlocks {

    /**
     * @return {string} - the name of this extension.
     */
    static get EXTENSION_NAME () {
        return formatMessage({
            id: 'tpLinkPlug.name',
            default: 'TP-Link Plug',
            description: 'name of the extension'
        });
    }

    /**
     * @return {string} - the ID of this extension.
     */
    static get EXTENSION_ID () {
        return EXTENSION_ID;
    }

    /**
     * URL to get this extension.
     * @type {string}
     */
    static get extensionURL () {
        return extensionURL;
    }

    /**
     * Set URL to get this extension.
     * The extensionURL will be changed to the URL of the loading server.
     * @param {string} url - URL
     */
    static set extensionURL (url) {
        extensionURL = url;
    }

    /**
     * Construct a set of blocks for TP-Link Plug.
     * @param {Runtime} runtime - the Scratch 3.0 runtime.
     */
    constructor (runtime) {
        /**
         * The Scratch 3.0 runtime.
         * @type {Runtime}
         */
        this.runtime = runtime;

        if (runtime.formatMessage) {
            // Replace 'formatMessage' to a formatter which is used in the runtime.
            formatMessage = runtime.formatMessage;
        }
    }

    setDevicePower (args) {
        const body = {host: Cast.toString(args.HOST), power: (args.STATE === 'ON')};
        const url = new URL('http://localhost:3030');
        url.pathname = 'state';
        const req = new Request(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body),
                mode: 'cors'
            }
        );
        return new Promise(
            resolve => {
                fetch(req)
                    .then(res => {
                        if (res.ok) {
                            res.json().then(data => {
                                resolve(JSON.stringify(data));
                            });
                        } else {
                            resolve(`${res.status}: ${res.statusText}, URL: ${req.url}`);
                        }
                    })
                    .catch(error => {
                        resolve(`${error}, URL: ${req.url}`);
                    });
            }
        );
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        setupTranslations();
        return {
            id: ExtensionBlocks.EXTENSION_ID,
            name: ExtensionBlocks.EXTENSION_NAME,
            extensionURL: ExtensionBlocks.extensionURL,
            blockIconURI: blockIcon,
            showStatusButton: false,
            blocks: [
                {
                    opcode: 'setDevicePower',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'tpLinkPlug.setDevicePower',
                        default: 'device [HOST] power [STATE]',
                        description: ''
                    }),
                    func: 'setDevicePower',
                    arguments: {
                        HOST: {
                            type: ArgumentType.STRING,
                            defaultValue: '192.168.0.0'
                        },
                        STATE: {
                            type: ArgumentType.STRING,
                            menu: 'powerStateMenu',
                            defaultValue: 'OFF'
                        }
                    }
                }
            ],
            menus: {
                powerStateMenu: {
                    acceptReporters: false,
                    items: ['ON', 'OFF']
                }
            }
        };
    }
}

export {
    ExtensionBlocks as default,
    ExtensionBlocks as blockClass
};
