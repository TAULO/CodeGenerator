const input = require('input');
const translate = require('translate-google');
const fs = require('fs');

// Get extensions from config json
var {
    extensionName,
    extensionType,
    extensionsPath,
    extConfFile,
    langs,
    motherLanguage
} = require('../config.json');
var extConfFilepath = `${extensionType}/${extensionName}`;
const extensions = require('../extensions-config.json');
//const extensions = require(`${extensionsPath}/${extConfFilepath}/${extConfFile}`);
const extPath = (extensions.hasOwnProperty('packages') && extensions.package !== '') ? `${extensionsPath}/packages/${extensions.packages}` : extensionsPath;

motherLanguage =  (motherLanguage && motherLanguage) != '' ? motherLanguage : 'es-ES';
const motherIso = motherLanguage.split('-')[0];
const groupsExtensions = ['plugins', 'modules'];
const ext = ['components', 'plugins', 'modules', 'packages'];

if (!langs || langs.length === 0){
    langs = ['en-GB'];
}

/**
 * @returns {Array} The config file languages
 */
const targetLangs = () => {
    results = [];
    langs.forEach(lang => {
        if (lang != motherLanguage){
            results.push({target: lang.split('-')[0], language: lang});
        }
    })
    return results;
}

// Get extensions in use
/**
 * Method to know if an extension Type exists
 * @param {string} extensionName The extension types Name (components, modules, plugins, ....)
 * @returns {boolean}
 */
const hasExtensions = (extensionName) => {
    if (extensions.hasOwnProperty(extensionName)) {
        if (extensionName === 'components') {
            if (extensions[extensionName].length > 0) {
                return true;
            } else {
                return false;
            }
        } else if (extensionName === 'package') {
            if (extensions[extensionName] !== '') {
                return true;
            } else {
                return false;
            }
        }

        var groups = Object.keys(extensions[extensionName]);
        var grps = 0;
        groups.forEach(element => {
            var group = extensions[extensionName][element];
            grps += group.length;
        });

        if (grps > 0) {
            return true;
        }
        return false;
    }
}

/**
 * Method to get all the extensions type in the config file
 * @returns {array} The extensionstype name
 */
const getExtensionTypes = () => {
    var results = [];
    ext.forEach(e => {
        if (hasExtensions(e)) {
            results.push(e);
        }
    })

    return results;
}

/**
 * Method to get a extension type
 * @returns {string} The extension type
 */
const getExtensionType = async () => {
    var extensionTypes = getExtensionTypes();

    if (extensionTypes.length === 1) {
        var extensionType = extensionTypes[0];
    } else {
        var selExtType = await trans('Select an extension type', motherIso, 'en');
        var extensionType = await input.select(selExtType, extensionTypes);
    }

    return extensionType;
}

/**
 * Method to get the groups/clients of plugins or modules
 * @param {string} extensionType The extension type
 * @returns {array} The groups/clients
 */
const getGroups = (extensionType) => {
    var results = [];
    var groups = Object.keys(extensions[extensionType]);

    groups.forEach(group => {
        if (extensions[extensionType][group].length > 0){
            results.push(group)
        }
    })
    return results;
}

/**
 * Method to get all extension names of an extension
 * @param {string} extensionType The extension type
 * @param {string} group The group or client if modules or plugins
 * @returns {array} The extensions names
 */
const getExtensions = (extensionType, group=null) => {
    if (group === null){
        return extensions[extensionType];
    } else {
        return extensions[extensionType][group]
    }
}

/**
 * Method to get a simple extension from a prompt request
 * @param {string} extensionType The extension types
 * @returns {string} The extension name
 */
const getExtension = async (extensionType) => {
    var result = [];
    result['type'] = extensionType;
    var group = null;
    switch (extensionType) {
        case 'modules':
            var selGroup = await trans('Select a client', motherIso, 'en');
            break;

        default:
            var selGroup = await trans('Select the plugin group', motherIso, 'en');
            break;
    }
    if (groupsExtensions.includes(extensionType)){
        const groups = getGroups(extensionType);

        if (groups.length === 1) {
            group = groups[0];
        } else {
            group = await input.select(selGroup, groups);
        }
    }

    result['group'] = group;

    const extensions = getExtensions(extensionType, group);
    const selExt = await trans('Select the extension', motherIso, 'en');

    if ((Array.isArray(extensions) && extensions.length === 1)) {
        var extension = extensions[0];
    } else if (Array.isArray(extensions)){
        extension = await input.select(selExt, extensions);
    } else if (typeof(extensions) === 'string' && extensions !== '') {
        extension = extensions;
    }

    result['extension'] = extension;
    return result;

}

/**
 * Method to request a text from a console input
 * @param {string} label The input label
 * @param {string} def A default value if it's needed
 * @returns {string} The input value
 */
const getText = async (label, def=null) => {

    return await input.text(label, {default: def});
}

/**
 * Method to translate a string
 * @param {string} text The string to be translated
 * @param {string} target The target language
 * @param {string} from The source language
 * @returns {string} The translated string
 */
const trans = async (text, target, from = motherLanguage.split('-')[0]) => {
    return await translate(text, {from: from, to: target})
}

const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

/**
 * Method to get from the user the constant sufix
 * @returns {string} The selected sufix
 */
const getConstanteSufix = async () => {
    const constType = await trans("The constant's type", motherIso, 'en');
    return await input.select(constType, ['Label', 'Description', 'Message', 'Placeholder', 'Field_Label', 'Field_Description', 'Other'])
}

/**
 * Method to fix the language constant
 * @param {string} text The constant text from the user
 * @param {string} extension The extension type
 * @param {string} prefix The constant prefix
 * @param {string} group The extension group
 * @param {string} constantType The constant sufix
 * @returns {string} The constant
 */
const fixLanguageConstant = (text, extension, prefix, group, constantType=null) => {
    if (constantType){
        constantType = constantType.toLowerCase();

        switch (constantType) {
            case 'label':
                    constantType = 'lbl'
                break;
            case 'description':
                constantType = 'desc'
                break;
            case 'message':
                constantType = 'msg'
                break;
            case 'placeholder':
                constantType = 'hint'
                break;
            case 'field_label':
                constantType = 'field_lbl'
                break;
            case 'field_description':
                constantType = 'field_desc'
                break;

            default:
                    constantType = ''
                break;
        }
    }
    var regex = / /g;
    text = `${text} ${constantType}`
    text = text.trim();
    text = text.replace(regex, '_');
    if (prefix === 'plg'){
        text = `${prefix}_${group}_${extension}_${text}`;
    } else if (prefix === 'pkg' || prefix === 'com'){
        text = `${prefix}_${extension}_${text}`;
    } else {
        text = `${prefix}_${extension}_${group}_${text}`;
    }
    text = text.toUpperCase();

    return text;
}

const appendToFile = (data) => {
    languageString = `${data.constant}="${data.text}"\n`;
    file = data.file;
    const langFile = fs.createWriteStream(file, { flags: 'a' })

    langFile.write(languageString);
    langFile.end();
}

module.exports = {
    getExtensionTypes,
    getExtensionType,
    getGroups,
    getExtensions,
    getExtension,
    getText,
    trans,
    targetLangs,
    asyncForEach,
    getConstanteSufix,
    fixLanguageConstant,
    appendToFile,
    motherLanguage,
    extPath,
    langs
}