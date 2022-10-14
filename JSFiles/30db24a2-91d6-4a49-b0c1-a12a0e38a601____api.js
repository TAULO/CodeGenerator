/* API functionality */

const SearchData = require('./actions/act-search.js');

const loadedExtensions = new Set();

/**
 * Add extension to set of enabled extensions
 * @param {AbstractExtension} extension
 */
function enableExtension(extension) {
    loadedExtensions.add(extension);
}

/**
 * Remove extension from set of enabled extensions
 * @param {AbstractExtension} extension
 */
function disableExtension(extension) {
    loadedExtensions.delete(extension);
}

// Search

/**
 * Enqueue a search
 * @param {SearchData} searchData search data
 */
function search(searchData) {
    // TODO: have map of extension : results then return

    // TOOD: don't actually perform search here
    // just add search action to each extension's queue
    for (let extension of loadedExtensions)
        extension.queue.add(searchData);
}

// Download

// View metadata

// Refresh?

// Process loop (process all actions)

/**
 * Process all extension queues
 */
function tick() {
    for (let extension of loadedExtensions)
        extension.tick();
}

// TODO: iterate all extensions then process queue
// extension queue -> converts action into subactions which go into an extension queue map isolated from extension
// then that is processed in processAllQueues


module.exports = {
    enableExtension,
    disableExtension,
    search
};
