/*
Evolution of jsgui's fs2
Also want a similar system that deals with video / multimedia files' metadata
Length of video files, codecs.
Could also keep the sha256 of the originally encoded video as a key for any re-encodes.
ffprobe on each of the videos to get the metadata

Alternatively load metadata mime type handlers.
Expose these handlers and allow them to be modified.
Injected metadata handler for video files.

Injected different File objects for different extensions

mmfs could be run as a multimedia file system
  would cover getting hash from original video or stream, and using that to identify all derived versions
  orig_sha256
    then its faster to look up / find the original version.
    we would have a map of the hash values referring to file locations
      being able to get derived / reencoded videos too

want to be able to define locations for reencoded videos
                                        selected videos
                                        selected and reencoded

Then if we have a video file that is made out of original videos that were stitched together, we can store hashes of
the original files, and the original file names in the metadata.

Want specific low resolution paths too. Low res would be faster for looking through with motion detection.
// Could have a file in the path saying what it's to be used for.


// Want to make this more observable in operation
//  Including logs
//  Should return the data simply if used with await.
//   There will be other functions / ways to process the data as well as have functions to process logs.


Need features that make using streams easier...
  Though this originally was made to avoid streams.



*/


const lang = require('lang-mini');
const fnl = require('fnl');
const prom_or_cb = fnl.prom_or_cb;
const obs_or_cb = fnl.obs_or_cb;
const cb_to_prom_or_cb = fnl.cb_to_prom_or_cb;
const observable = fnl.observable;
const def = lang.is_defined;
const date_and_time = require('date-and-time');


const file_type = import('file-type');


const crypto = require('crypto');
const get_a_sig = lang.get_a_sig;

var child_process = require('child_process');
var ncp_module = require('ncp');
//var checksum = require('./file-checksum');
var rimraf = require('rimraf');
//var child_process = require('child_process');
//define(['jsgui-lang-essentials', 'node-rasters', 'node-spritesheet', 'xpath', 'jsgui-html', 'phantom', 'xmldom', 'ncp'], function (jsgui, node_rasters, node_spritesheet, xpath, jsgui_html, phantom, xmldom, ncp) {

var ncp = ncp_module.ncp;
var log = console.log;

// removing libxmljs?

var each = lang.each,
    stringify = lang.stringify,
    is_array = lang.is_array;
var tof = lang.tof,
    arrayify = lang.arrayify,
    mapify = lang.mapify;

//var dir_separator = '/';
//if (process.platform === 'win32') dir_separator = '\\';

var fs = require('fs');
var libpath = require('path');
//var im = require('imagemagick');
//var libxmljs = require("libxmljs");

var exec = child_process.exec;
var fp = lang.fp;
var call_multi = lang.call_multi;

const {
    promisify
} = require('util');




// Probably will be better to move to streaming reads of files, and making the stream an optional return type.
//  Moving more towards towards handling streams.





const move = promisify(require('mv'));

const p_readdir = promisify(fs.readdir);
const p_stat = promisify(fs.stat);
const p_writeFile = promisify(fs.writeFile);
const p_readFile = promisify(fs.readFile);
const p_unlink = promisify(fs.unlink);

// delete?

const mkdirp = require('mkdirp');
const p_mkdirp = (promisify(mkdirp));

//const p_mv = promisify(mv);
var Fns = lang.Fns;
const map_metadata_handlers_by_extension = {};
const map_metadata_keys_by_extension = {

}

const map_file_ignore = {
    '__md.json': true
}

const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/** @function file_checksum 
 * @param  {String} file_path
 * @param  {Function} callback
 */
const file_checksum = (file_path, callback) => {
    return prom_or_cb((resolve, reject) => {
        var algo = 'sha256';
        var shasum = crypto.createHash(algo);

        var file = file_path;
        var s = fs.ReadStream(file);
        s.on('data', d => {
            shasum.update(d);
        });
        s.on('end', () => {
            //var d = shasum.digest('hex');
            var digest = shasum.digest('base64');
            //console.log(d);
            // base64

            //callback(null, digest);
            resolve(digest);
        });
        s.on('error', err => {
            /*handle error*/
            reject(err);
        });
    }, callback);
}

/** @constant map_mime_types
    @type {Object}
*/

const map_mime_types = {
    'html': 'text/html',
    'htm': 'text/html',
    'ico': 'image/x-icon',
    'txt': 'text/plain',
    'xml': 'application/xml',
    'png': 'image/png',
    'gif': 'image/gif',
    'jpeg': 'image/jpeg',
    'jpg': 'image/jpeg',
    'bmp': 'image/bmp',
    'svg': 'image/svg+xml',
    'mp3': 'audio/mpeg3',
    'ogg': 'audio/ogg',
};

// create File objects...
//  May be worth doing.

class File {
    constructor(spec) {
        spec = spec || {};
        this.name = spec.name || spec.filename;
        this.path = spec.path;

        if (this.path && !this.name) {
            this.name = libpath.basename(this.path);
        }

        this.size = spec.size;

        if (spec.stat) {
            this.size = spec.stat.size;
            this._stat = spec.stat;
        }

        if (spec.md) {
            this._md = spec.md;
        }

        // extension

        // extname
    }
    get checksum() {
        //console.log('this.path', this.path);
        if (this._md && this._md.sha256) {
            return this._md.sha256;
        } else {
            return file_checksum(this.path);
        }
    }

    get stat() {
        return new Promise(async (resolve, reject) => {
            if (this._stat) {
                resolve(this._stat);
            } else {
                this._stat = await p_stat(this.path);
                resolve(this._stat);
            }
        });
    }

    // metadata

    // extended metadata
    //  does not compute checksum, specific to the type of file / data


    get timings() {
        // could refer to stat.

        return new Promise(async (resolve, reject) => {
            let stat = await this.stat;
            //console.log('timings stat', stat);
            // birth create modify access

            let timings = {
                birth: stat.birthtime,
                create: stat.ctime,
                modify: stat.mtime,
                access: stat.atime
            }
            resolve(timings);
        });
    }

    // name without path, without extension.


    get extension() {
        // slice it without the '.'?
        return libpath.extname(this.name);
    }
    // read...
    //  will return an observable with events as it reads chunks

    // just want it as a buffer for the moment

    async read() {
        return p_readFile(this.path);
    }

    async save_md() {
        return await save_file_metadata(this.path);
    }
    // stream

    get stream() {
        return fs.createReadStream(this.path);
    }

}
class Dir {
    constructor(spec) {
        if (typeof spec === 'string') {
            this.path = libpath.resolve(spec);
            console.log('this.path', this.path);

        } else {
            this.name = spec.name || spec.filename;
            this.path = spec.path;
        }
    }
    // stream as well.

    // stream_each_file...
    // stream_files
    //  observable when a new stream is opened.
    //  

    // be able to filter the files.

    stream_files(filter) {
        return observable((next, complete, error) => {
            //let obs_files = dir_contents(this.path);
            /*
            obs_files.on('next', data => {
                if (data instanceof File) {

                } else {

                }
            })
            */

            (async () => {
                let files = await dir_contents(this.path, {
                    filter: filter
                });

                //console.log('files', files);
                for (let file of files) {
                    // output stream...

                    if (file instanceof File) {
                        //console.log('pre pr');
                        let pr = new Promise((solve, jettison) => {
                            //console.log('file.path', file.path);
                            var readStream = fs.createReadStream(file.path);
                            next({
                                stream: readStream,
                                file: file
                            });
                            readStream.on('data', function (chunk) {
                                //data += chunk;
                            }).on('end', function () {
                                //console.log(data);

                                solve();
                            });
                        });
                        await pr;
                    }
                }
                complete();
            })();

            return [];
        })
    }


}

const map_ignore = {
    '__md.json': true
}

//const dir_contents = (path, options = {}, callback) => {
const dir_contents = (path, ...a2) => {

    // filter option
    //  it's a function, not a callback
    // if it individually gets metadata, it's an observable.

    // would be nice to have it load metadata from the metadata
    //  at least checksums.
    // ...arguments

    // no arguments object with arrow fn

    //let a = arguments;
    //console.log('a2.length', a2.length);
    //console.log('a2', a2);
    //if (a.length === 2) {
    //    callback = a[1];
    //    options = {};
    //}
    let options = {},
        callback;

    let sig = get_a_sig(a2);
    //console.log('sig', sig);

    if (sig === '[f]') {
        callback = a2[0];
    }
    if (sig === '[o]') {
        options = a2[0];
    }
    if (sig === '[o,f]') {
        options = a2[0];
        callback = a2[1];
    }
    const filter = options.filter;

    return obs_or_cb((next, complete, error) => {
        (async () => {
            let load_metadata = options.load_metadata || false;
            let md;
            let map_md = {};

            if (load_metadata) {
                let md_path = libpath.join(path, '__md.json');
                if (await exists(md_path)) {
                    md = await load(md_path);
                    //console.log('md', md);
                    md.forEach(md_item => {
                        //console.log('md_item', md_item);
                        map_md[md_item.name] = md_item;
                    })
                }
                //console.log('md', md);
            }
            // get list of files
            // examine files
            let content = await p_readdir(path);
            //console.log('content', content);
            // say its complete with all of the files....
            //let files = [];
            //let dirs = [];

            let all = [];

            let new_dir, new_file;
            for (let item of content) {
                let passes_filter = true;
                if (filter) {


                }
                if (passes_filter && !map_ignore[item]) {
                    let fpath = libpath.join(path, item);
                    let item_stat = await p_stat(fpath);
                    //console.log('item_stat', item_stat);
                    // ignore list...?
                    if (item_stat.isDirectory()) {
                        //dirs.push();
                        new_dir = new Dir({
                            name: item,
                            path: fpath
                        });

                        //next({
                        //    'dir': new_dir
                        //});
                        passes_filter = filter(new_dir);
                        if (passes_filter) {
                            next(new_dir);
                            all.push(new_dir);
                        }
                    }
                    if (item_stat.isFile()) {
                        //files.push();
                        new_file = new File({
                            name: item,
                            stat: item_stat,
                            path: fpath
                        })
                        if (map_md[new_file.name]) {
                            new_file._md = map_md[new_file.name];
                        }
                        //next({
                        //    'file': new_file
                        //});
                        if (filter) {
                            passes_filter = filter(new_file);
                        }

                        if (passes_filter) {
                            next(new_file);
                            all.push(new_file);
                        }
                    }
                }
            }
            complete(all);
            /*
            let res = {
                files: files,
                dirs: dirs
            }*/

        })();
        return [];
    }, callback);
}

const dir_files = (path, options = {}, callback) => {
    // if it individually gets metadata, it's an observable.

    

    return obs_or_cb((next, complete, error) => {
        (async () => {
            // get list of files
            // examine files
            let content = await p_readdir(path);
            //console.log('content', content);
            // say its complete with all of the files....
            //let files = [];
            //let dirs = [];

            let all = [];

            let new_dir, new_file;
            for (let item of content) {
                if (!map_ignore[item]) {
                    let fpath = libpath.join(path, item);
                    let item_stat = await p_stat(fpath);
                    if (item_stat.isFile()) {
                        new_file = new File({
                            name: item,
                            stat: item_stat,
                            path: fpath
                        })
                        next(new_file);
                        all.push(new_file);
                    }
                }
            }
            complete(all);
            /*
            let res = {
                files: files,
                dirs: dirs
            }*/

        })();
        return [];
    }, callback);
}

// delete / unlink files with a name matching

// start at the path, then a filter...

const delete_files_from_dir = async (dir_path, fn_match) => {
    let files = await dir_files(dir_path);
    for (file of files) {
        if (fn_match(file)) {
            //console.log('matched file', file.name);
            await p_unlink(file.path);
        }
    }
}



let get_map_sha256_walk = (start_path, callback) => {

    return prom_or_cb(async (solve, jettison) => {
        //let o_walk = file_walk(start_path);
        let files = await file_walk(start_path);
        // then for these files, map them by sha256
        //console.log('files', files);
        //console.log('files[0]', files[0]);

        let res = {};
        for (let file of files) {
            let sha256 = await file.checksum;
            //console.log('sha256', sha256);
            res[sha256] = file;
        }
        solve(res);
    }, callback);

}

const file_walk = (start_path, callback) => {

    if (callback) {
        return walk(start_path, {
            include_dirs: false
        }, callback);
    } else {
        return walk(start_path, {
            include_dirs: false
        });
    }



}
const walk = (start_path, options = {}, callback) => {
    // observable or callback
    // returned observable will have 'next' events with different properties depending on what it's doing.

    const spl = start_path.length;
    //return 

    // pausable too?
    //  if it's in paused state, does delay rather than continue.

    // When doing the walk, may as well load up the file metadata, if it's available.
    //  Would already have checksum and ffmpeg probe data
    // callback when it's complete, if using callback
    let load_metadata = true;
    if (def(options.load_metadata)) load_metadata = options.load_metadata;
    let include_dirs = true;
    if (def(options.include_dirs)) include_dirs = options.include_dirs;

    // include dirs
    //let include_dirs = options.include_dirs || true;


    return obs_or_cb((next, complete, error) => {
        (async () => {
            let paused = false;
            var rec = async (path) => {

                let path_stat = await p_stat(path);
                if (!path_stat.isDirectory()) {
                    error(new Error('Expected directory'));

                } else {


                    let dir = new Dir({
                        'name': libpath.basename(path),
                        'path': path
                    });
                    /*
                    next({
                        'dir': dir
                    });
                    */

                    // await next?

                    let res_next;

                    if (include_dirs) res_next = next(dir);
                    //console.log('res_next', res_next);
                    if (res_next && res_next.then) await res_next;
                    let md;
                    let map_md = {};

                    if (load_metadata) {
                        let md_path = libpath.join(path, '__md.json');
                        let md_file_exists = await exists(md_path);
                        if (md_file_exists) {
                            md = await load(md_path);
                        }
                    }
                    if (md) {
                        //console.log('md', md);
                        md.forEach(md_item => {
                            if (Object.entries(md_item).length > 1) {
                                map_md[md_item.name] = md_item;
                            }
                        });
                        //throw 'stop';
                        //console.log('map_md', map_md);
                    }
                    // then the contents
                    let contents = await p_readdir(path);
                    //console.log('contents', contents);
                    let dirs = [];
                    for (let item of contents) {
                        //console.log('path, item', path, item);
                        //console.log('item', item);

                        if (!map_ignore[item]) {
                            let fpath = libpath.join(path, item)
                            //console.log('fpath', fpath);
                            let item_stat = await p_stat(fpath);

                            if (item_stat.isDirectory()) {
                                //dirs.push();
                                dirs.push(item);
                            }
                            if (item_stat.isFile()) {
                                //files.push();
                                // then the metadata
                                let file_spec = {
                                    name: item,
                                    stat: item_stat,
                                    path: fpath
                                }
                                if (map_md[item]) {
                                    file_spec.md = map_md[item];
                                }
                                new_file = new File(file_spec);

                                new_file.root_path = start_path;
                                new_file.relative_path = fpath.substr(spl);

                                //next({
                                //    'file': new_file
                                //});


                                // And the event 

                                res_next = next(new_file);
                                //console.log('res_next', res_next);
                                if (res_next && res_next.then) await res_next;
                                //next(new_file);
                            }
                        }


                    }
                    //console.log('dirs', dirs);
                    for (let dir of dirs) {
                        let dpath = libpath.join(path, dir);
                        await rec(dpath);
                    }
                }
                //(async () => {

                //})();

            };
            await rec(start_path);
            complete();
        })();
        return [];
    }, callback);

    // May also need to know how many to do asymcronously at once.
    // may be recursive inside... that could be easier.
    // think this does need a callback for call_multi to work right.
    //console.log('walk start_path', start_path);
}

const save_string = (path, thing_to_save, callback) => {
    return prom_or_cb(async (resolve, reject) => {

        //(async() => {

        //})();

        let res = await p_writeFile(path, thing_to_save);
        resolve(res);
        // if it's a string, binary

        /*

        fs.writeFile(file_path, file_content, function (err) {
				if (err) {
					//console.log(err);
					callback(err);
				} else {
					//console.log("The file was saved!");
					callback(null, true);
					// could return the file path?
					//  returning timing info would be cool as well.
					//  could maybe make a function that keeps track of it as a function is executed.
				}
            });
            
            */

    }, callback);
}
const save_buffer = (path, thing_to_save, callback) => {
    return prom_or_cb(async (resolve, reject) => {

        // if it's a string, binary

        let res = await p_writeFile(path, thing_to_save);
        resolve(res);

    }, callback);
}
const save_object = (path, thing_to_save, callback) => {
    return prom_or_cb(async (resolve, reject) => {
        let res = await p_writeFile(path, JSON.stringify(thing_to_save));
        resolve(res);
        // if it's a string, binary

    }, callback);
}


const save = (path, thing_to_save, callback) => {

    let t = tof(thing_to_save);
    if (t === 'string') {
        return save_string(path, thing_to_save, callback);
    }
    if (t === 'buffer') {
        return save_buffer(path, thing_to_save, callback);
    }
    if (t === 'object' || t === 'array') {
        return save_object(path, thing_to_save, callback);
    }


    /*
    return prom_or_cb((resolve, reject) => {

        // if it's a string, binary

        let t = tof(thing_to_save);
        if (t === 'string') {
            return save_string(path, thing_to_save, callback);
        }
        if (t === 'buffer') {
            return save_buffer(path, thing_to_save, callback);
        }
        if (t === 'object' || t === 'array') {
            return save_object(path, thing_to_save, callback);
        }


    }, callback);
    */
}

// Loading multiple files in a list...?
const load = (path, options = {}, callback) => {
    // Possibility of options.
    //  If the file does not exist, could load a default

    // options being 'stream'?
    //  this should fit into the 'vhl' system.

    if (options.stream === true) {
        const res = fs.createReadStream(path);

        // Possible monitoring as an option, using the callback?

        /*
        next({
            stream: readStream,
            file: file
        });
        readStream.on('data', function (chunk) {
            //data += chunk;
        }).on('end', function () {
            //console.log(data);

            solve();
        });
        */
        return res;
        // return the stream object.

        //console.trace();
        //throw 'NYI';

    } else {
        return prom_or_cb((resolve, reject) => {

            (async () => {
                let buf;
    
                try {
                    buf = await p_readFile(path);
    
                    let ext = libpath.extname(path);
                    //console.log('ext', ext);
                    let res;
    
                    if (ext === '.json') {
                        res = JSON.parse(buf.toString());
                    } else {
    
                        if (ext === '.txt') {
                            res = (buf.toString());
                        } else {
                            res = buf;
                        }
                        resolve(res);
                    }
                    resolve(res);
                } catch (err) {
                    if (options.error_default_value) {
                        resolve(options.error_default_value);
                    }
                    //console.log('err', err);
                    //throw 'stop';
                    reject(err);
                }
            })();
        }, callback);
    }


    
}

const exists = (path, callback) => {
    return prom_or_cb((resolve, reject) => {

        fs.stat(path, (err, stats) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    //return cb(null, false);
                    resolve(false);
                } else {
                    //return cb(err);
                    reject(err);
                }
            } else {
                resolve(true);
            }
            //return cb(null, stats.isFile());
        });
    }, callback);
}

const ensure_deleted = (path, callback) => {
    return prom_or_cb(async (resolve, reject) => {
        throw 'NYI';
        let e = await exists(path);
        if (e) {
            //await delete(e);
        }
        resolve(true);
        /*
        fs.stat(path, (err, stats) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    //return cb(null, false);
                    resolve(false);
                } else {
                    //return cb(err);
                    reject(err);
                }
            } else {
                resolve(true);
            }
            //return cb(null, stats.isFile());
        });
        */
    }, callback);
}

const existing = (arr_paths, callback) => {
    return prom_or_cb(async (resolve, reject) => {

        let res;
        for (path of arr_paths) {
            console.log('path', path);
            let e = await exists(path);
            console.log('e', e);
            if (e) {
                res = path;
                break;
            }
        }
        resolve(res);
    }, callback);
}

const fsize = (path, callback) => {
    return prom_or_cb((resolve, reject) => {
        fs.stat(path, (err, stats) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    //return cb(null, false);
                    resolve(false);
                } else {
                    //return cb(err);
                    reject(err);
                }
            } else {
                resolve(stats.size);
            }
            //return cb(null, stats.isFile());
        });
    }, callback);
}

const is_directory = (path, callback) => {
    return prom_or_cb((resolve, reject) => {
        fs.stat(path, (err, stats) => {
            if (err) {
                reject(err);
            } else {
                let res = stats.isDirectory();
                resolve(res);
            }
            //return cb(null, stats.isFile());
        });
    }, callback);
}

// copy file seems simpler

const copy_file = (source_path, dest_path, callback) => {
    return prom_or_cb(async (solve, jettison) => {
        // Should copy file metadata too.
        let r = fs.createReadStream(source_path).pipe(fs.createWriteStream(dest_path));
        r.on('close', async () => {
            //if (err) throw err;
            //throw 'stop';
            let md = await load_file_metadata(source_path);
            await save_file_metadata(dest_path, md);
            solve(true);
        });
        r.on('error', function (err) {
            //if (err) throw err;
            //throw 'stop';
            jettison(err);
        });
    }, callback);
}

const copy = (source_path, dest_path, callback) => {
    return copy_file(source_path, dest_path, callback);
}

const multi_copy = (copy_operations, callback) => {
    return obs_or_cb((next, complete, error) => {
        (async () => {
            for (let op of copy_operations) {
                let [source_path, dest_path] = op;
                await copy(source_path, dest_path);
            }
        })();
        return [];
    }, callback);
}

const gen_file_md = async (file) => {
    let c_file;

    if (typeof file === 'string') {
        c_file = new File({
            'path': file
        });
        c_file.size = await fsize(file);
        // load size

    } else {
        c_file = file;
    }

    //console.log('c_file', c_file);

    let checksum = await c_file.checksum;

    // load values up...

    //console.log('checksum', checksum);

    // extension.
    //let ext = 

    // file access times.
    // file times

    let item_md = {
        name: c_file.name,
        size: c_file.size,
        sha256: checksum,
        timings: await c_file.timings
    };

    //console.log('file.extension', c_file.extension);
    //console.log('map_metadata_handlers_by_extension[file.extension]', map_metadata_handlers_by_extension[c_file.extension]);

    if (map_metadata_handlers_by_extension[c_file.extension]) {
        let extended_md = await map_metadata_handlers_by_extension[c_file.extension](c_file);
        Object.assign(item_md, extended_md);
    } else {

    }
    //console.log('item_md', item_md);
    return item_md;
}

const gen_file_ext_md = async (file) => {

    //let checksum = await file.checksum;
    //console.log('checksum', checksum);
    // extension.

    //let ext = 

    // file access times.
    // file times

    /*
    let item_md = {
        name: file.name,
        size: file.size,
        sha256: checksum,
        timings: await file.timings
    };
    */

    if (map_metadata_handlers_by_extension[file.extension]) {
        let extended_md = await map_metadata_handlers_by_extension[file.extension](file);
        //Object.assign(item_md, extended_md);
        return extended_md;
    } else {
        return {};
    }
    //return item_md;
}

const save_dir_metadata = (path, callback) => {
    return prom_or_cb((resolve, reject) => {
        (async () => {
            //console.log('save_dir_metadata', path);
            let contents = await dir_contents(path);
            let list_md = [];
            //console.log('contents', contents);
            //console.log('path', path);
            for (let item of contents) {
                //console.log('item', item);
                if (map_ignore[item.name]) {} else {
                    if (item instanceof File) {
                        let item_md = await gen_file_md(item);
                        list_md.push(item_md);
                    }
                }
            }
            list_md.sort((a, b) => {
                const textA = a.name,
                    textB = b.name;
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            });
            //console.log('list_md', list_md);
            const md_file_path = libpath.join(path, '__md.json');
            //console.log('md_file_path', md_file_path);
            await save(md_file_path, list_md);
            //console.log('save done');
            resolve(list_md);
            //return true;
        })();
    }, callback);
}

// recursive ensure dir metadata
//  // loads up all of the files with the stats
//  compares it to existing metadata. same size, copies over the file sha256

const walk_sha256_map = (path, callback) => {

    return prom_or_cb((resolve, reject) => {
        (async () => {
            // get the file walk.


        })();
    }, callback);

    /*
    return obs_or_cb((next, complete, error) => {
        (async () => {
            
            // 

        })();
        return [];
    }, callback);
    */
}



const file_dir_md_path = (file_path) => {
    let metadata_file_path = libpath.join(libpath.dirname(file_path), '__md.json');
    return metadata_file_path;
}

const save_file_metadata = async (file_path, md) => {

    // simple save operation, takes all the metadata


    let old = async () => {
        // get together the normal md, including plugins
        console.log('file_path', file_path);

        //let file_md = await gen_file_md(file_path);
        //Object.assign(file_md, additional_md);

        //console.log('file_md', file_md);

        let file_md_path = file_dir_md_path(file_path);

        let dir_md = [];

        // load up the metadata file...
        if (await exists(file_md_path)) dir_md = await load(file_md_path);

        console.log('dir_md', dir_md);

        let pushed_file_md = false;
        let new_md = [];

        each(dir_md, item => {
            //console.log('item', item);

            if (item.name === md.name) {
                new_md.push(md);
                pushed_file_md = true;
            } else {
                new_md.push(item);
            }
            // depending on this item...
        });
        if (!pushed_file_md) {
            new_md.push(md);
        }

        /*
        
        if (dir_md.length === 0) {
            //dir_md.push(file_md)
            new_md.push(file_md)
        } else {
            let pushed_file_md = false;

            each(dir_md, item => {
                //console.log('item', item);

                if (item.name === file_md.name) {
                    new_md.push(file_md);
                    pushed_file_md = true;
                } else {
                    new_md.push(item);
                }
                // depending on this item...
            });
            if (!pushed_file_md) {
                new_md.push(file_md);
            }
            //throw 'stop';
        }
        */
        //console.log('new_md.length', new_md.length);
        await save(file_md_path, new_md);

        return md;
    }
    return old();

    //console.log('dir_md', dir_md);
}

const load_file_metadata = async (file_path) => {
    let filename = libpath.basename(file_path);
    let md_path = await file_dir_md_path(file_path);
    let dir_md = await load(md_path);
    // map it to a new one?

    let res;
    each(dir_md, (item, i, stop) => {
        if (item.name === filename) {
            // could check they are the same size.
            res = item;
        }
    });
    return res;
}

/*
const rec_ensure_dir_metadata = (path, callback) => {
    return obs_or_cb((next, complete, error) => {
        (async () => {
            // write / save directory metadata?

            // walk dirs.
                       

            // then for every file where we can find / infer its name


        })();
        return [];
    });
}
*/

const ensure_dir_metadata = (path, callback) => {
    return prom_or_cb((resolve, reject) => {
        (async () => {
            console.log('ensure_dir_metadata path:', path);

            // try to load the metadata file.
            //  if it exists:
            //   check number of files
            //   check each file size.
            let metadata_file_path = libpath.join(path, '__md.json');
            let md;
            let md_exists = await exists(metadata_file_path);
            //console.log('md_exists', md_exists);
            if (md_exists) {
                md = await load(metadata_file_path);
                let map_md = {};
                each(md, i => map_md[i.name] = i);
                // quick validate
                let contents = await dir_contents(path);
                let quick_validate = async (path, md) => {
                    // get the file info.
                    let valid = true;
                    //console.log('contents', contents);
                    each(contents, (i, c, stop) => {
                        if (map_md[i.name]) {
                            //console.log('has md item', i.name);
                            let md_size = map_md[i.name].size;
                            let same_size = md_size === i.size;
                            //console.log('same_size', same_size);
                            if (!same_size) {
                                valid = false;
                                stop();
                            }
                            // check they are the same size.
                        } else {
                            // directory item not found in metadata.
                            valid = false;
                            stop();
                        }
                    });
                    return valid;
                }
                let valid = await quick_validate(path, md);
                //console.log('contents', contents);
                //each(contents, item => {
                //})
                let modified_timings = false;
                for (let item of contents) {
                    if (item instanceof File) {
                        let file_timings = await item.timings;
                        //console.log('file_timings', file_timings);

                        //console.log('!!map_md[item.name]', !!map_md[item.name]);
                        //console.log('item.name', item.name);

                        if (map_md[item.name] && !map_md[item.name].timings) {
                            map_md[item.name].timings = file_timings;
                            modified_timings = true;
                        }
                    }
                }
                let has_all_extension_keys = true;
                let files_missing_extended_metadata = [];

                // then repair / get the exended metadata

                let obtain_extended_metadata = async () => {
                    for (let item of contents) {

                        if (item instanceof File) {
                            let ext = item.extension;
                            //console.log('ext', ext);
                            let md_item = map_md[item.name];

                            if (md_item) {
                                let keys = Object.keys(md_item);
                                //console.log('keys', keys);
                                // then the extension specific keys
                                let ext_keys = map_metadata_keys_by_extension[ext];
                                //console.log('ext_keys', ext_keys);

                                if (ext_keys) {
                                    let has_extension_keys = true;

                                    for (let c = 0, l = ext_keys.length; c < l; c++) {
                                        let k = ext_keys[c];
                                        if (!map_md[item.name][k]) {
                                            has_extension_keys = false;
                                            has_all_extension_keys = false;
                                            files_missing_extended_metadata.push(item);
                                            break;
                                        }
                                    }
                                    //console.log('has_extension_keys', has_extension_keys);
                                }
                            }


                            //console.log('md_item', md_item);

                            // does it have all the ext keys?
                            // does it have the keys from that extension?
                            // does it have the keys fot that extension?
                            // length key for .avi
                        }
                    }
                    //console.log('files_missing_extended_metadata', files_missing_extended_metadata);
                    for (let file of files_missing_extended_metadata) {
                        // then get the file metadata.
                        let file_ext_md = await gen_file_ext_md(file);
                        //console.log('file_ext_md', file_ext_md);
                        Object.assign(map_md[file.name], file_ext_md);
                        //console.log('map_md[file.name]', map_md[file.name]);
                    }
                }

                await obtain_extended_metadata();

                // has extra metadata items.
                //  we could be running the app / util with a plugin that provides further metadata about specific files.

                // check the keys in the md entry


                // for every file, if it misses its timing metadata, add that timing metadata, if available.

                let do_save = modified_timings || !has_all_extension_keys;



                // add file timings metadata properties
                // add expanded metadata properties
                //console.log('valid', valid);

                console.log('do_save', do_save);
                console.log('valid', valid);

                if (valid) {

                    if (do_save) {
                        await save(metadata_file_path, md);
                    } else {

                    }
                    resolve([path, md]); // Didnt have to write anything
                } else {
                    //await save_dir_metadata(path);
                    //resolve(true);
                    // Then this should add the timings data.
                    resolve([path, await save_dir_metadata(path)]);
                }
            } else {
                //await save_dir_metadata(path);
                //resolve(true);
                resolve([path, await save_dir_metadata(path)]);
            }
        })();
    }, callback);
}


const dir_metadata_remove_file = async (dir_path, filename) => {
    let metadata_file_path = libpath.join(dir_path, '__md.json');
    let md;
    let md_exists = await exists(metadata_file_path);
    //console.log('md_exists', md_exists);
    if (md_exists) {
        let md = await load(metadata_file_path);
        let md2 = md.filter(f => f.name !== filename);

        //console.log('md.length', md.length);
        //console.log('md2.length', md2.length);

        save(metadata_file_path, md2);
    }
}


const move_dir_files_to_daily_dirs = (dir_path, callback) => {
    return obs_or_cb((next, complete, error) => {
        (async () => {
            // write / save directory metadata?

            let contents = await dir_contents(dir_path);
            console.log('contents', contents);

            // then for every file where we can find / infer its name

        })();
        return [];
    });
}

// then we also want all metadata so it can be looked at.
//  want to find duplicate files.

const walk_ensure_dir_metadata = (path, callback) => {
    return obs_or_cb((next, complete, error) => {

        (async () => {

            let o_walk = walk(path);
            let dirs = [];
            o_walk.on('next', data => {
                if (data instanceof Dir) {
                    dirs.push(data);
                }
            });
            o_walk.on('complete', async () => {
                console.log('dirs', dirs);
                console.log('dirs.length', dirs.length);

                for (let dir of dirs) {
                    //console.log('\n***** dir', dir);
                    let res_meta = await ensure_dir_metadata(dir.path);
                    //console.log('res_meta', res_meta);
                    next(res_meta);
                }
                console.log('walk complete');
                complete();
            });
        })();
        return [];
    });
}


const s_dt_from_filename = (name) => {
    // if it starts with 'AM ' or 'PM '.
    //  somecameras use / choose that file name format, don't know how to chanege it.

    let am_tag = false;
    let pm_tag = false;

    if (name.substr(0, 3) === 'AM ') {
        name = name.substr(3);
        am_tag = true;
    }
    if (name.substr(0, 3) === 'PM ') {
        name = name.substr(3);
        pm_tag = true;
    }

    let dt;

    if (am_tag || pm_tag) {

        let n = name.substr(0, 19);
        //console.log('n', n);
        //dt = date_and_time.parse(n, 'MM-DD-YYYY HH mm ss', true);
        //dt = dat
        let [s_hour, s_min, s_sec, s_date] = n.split(' ');
        //let [s_d, s_m, s_y] = s_date.split('-');
        //let [s_d, s_m, s_y] = s_date.split('-');

        let [s_m, s_d, s_y] = s_date.split('-');

        //console.log('[s_hour, s_min, s_sec, s_date]', [s_hour, s_min, s_sec, s_date]);
        //console.log('[s_d, s_m, s_y]', [s_d, s_m, s_y]);

        let [hour, min, sec] = [parseInt(s_hour), parseInt(s_min), parseInt(s_sec)];
        let [m, d, y] = [parseInt(s_m) - 1, parseInt(s_d), parseInt(s_y)];

        //console.log('[hour, min, sec]', [hour, min, sec]);
        //console.log('[d, m, y]', [d, m, y]);
        // Date(year, month, day, hours, minutes, seconds, milliseconds);
        if (pm_tag) {
            hour = hour + 12;
            //date_and_time.parse(n, 'hh mm ss DD-MM-YYYY', true);
        }
        dt = new Date(y, m, d, hour, min, sec);
        //console.log('dt', dt);
        //throw 'stop';
    } else {
        let n = name.substr(0, 19);
        //console.log('n', n);
        dt = date_and_time.parse(n, 'YYYY-MM-DD HH mm ss', true);
        //console.log('dt', dt);        

        if (pm_tag) {
            dt = date_and_time.addHours(dt, 12);
        }
    }
    let s = date_and_time.format(dt, 'YYYY-MM-DD (ddd)');
    //let new_path = path.join(p, s, root_file.name);
    //console.log('new_path', new_path);
    return s;
}

// Some kinds of filtering?
//  Or could do that easily with functional programming?


const fnlfs = {
    'file_checksum': file_checksum,
    'file_type': file_type,
    'map_mime_types': map_mime_types,
    'walk': walk,
    'file_walk': file_walk,
    'dir_contents': dir_contents,
    'dir_files': dir_files,
    'save_dir_metadata': save_dir_metadata,
    'save_file_metadata': save_file_metadata,
    'load_file_metadata': load_file_metadata,
    'load': load,
    'save': save,
    'delete': p_unlink,
    'move': move,
    'exists': exists,
    'ensure_deleted': ensure_deleted,
    'existing': existing,
    'fsize': fsize,
    'is_directory': is_directory,
    'copy': copy,
    'copy_file': copy_file,
    'multi_copy': multi_copy,
    'map_metadata_handlers_by_extension': map_metadata_handlers_by_extension,
    'map_metadata_keys_by_extension': map_metadata_keys_by_extension,
    'walk_ensure_dir_metadata': walk_ensure_dir_metadata,
    'ensure_dir_metadata': ensure_dir_metadata,
    'ensure_directory': p_mkdirp,
    'ensure_directory_exists': p_mkdirp,
    'delete_files_from_dir': delete_files_from_dir,

    'get_map_sha256_walk': get_map_sha256_walk,

    'Dir': Dir,
    'File': File,


    's_dt_from_filename': s_dt_from_filename
};

if (require.main === module) {
    // this module was run directly from the command line as in node xxx.js
    (async () => {
        //let dstore = await dir_contents('D:\\store');
        //console.log('dstore', dstore);

        let test_walk = async () => {
            let o_walk = walk('D:\\store');
            let files = [],
                dirs = [];
            o_walk.on('next', async item => {
                //console.log('item', item);
                if (item instanceof File) {
                    //console.log('file', file);
                    files.push(item);
                } else {
                    console.log('dir', item);
                    dirs.push(item);
                }
            });
            o_walk.on('complete', async () => {
                console.log('files.length', files.length);
                console.log('dirs.length', dirs.length);
            })
        }
        //await test_walk();

        let test_dir_meta = async () => {
            let dir_path = 'D:\\store\\Corner\\2018-07-27 (Fri)';
            //await save_dir_metadata(dir_path);
            await ensure_dir_metadata(dir_path)
        }
        //await test_dir_meta();


        let walk_ensure_metatata = async () => {
            let dir_path = 'D:\\store';
            // walk_ensure_dir_metadata
            let map_items_with_sha256 = {};
            let o = walk_ensure_dir_metadata(dir_path);
            o.on('next', data => {
                //console.log('data', data);
                // Want to know the path too.
                let [path, files] = data;
                each(files, file => {
                    //console.log('file.sha256', file.sha256);

                    let file_path = libpath.join(path, file.name);
                    //console.log('file_path', file_path);

                    map_items_with_sha256[file.sha256] = map_items_with_sha256[file.sha256] || [];
                    file.path = file_path;
                    map_items_with_sha256[file.sha256].push(file);
                    if (map_items_with_sha256[file.sha256].length > 1) {
                        //console.log('duplicate files with hash: ' + file.sha256 + '... ', map_items_with_sha256[file.sha256]);
                    }
                });
            })
            o.on('complete', async () => {
                console.log('md walk complete');
                // count the bytes wasted in duplicates.
                //  loading more metadata / file stats would be useful for some of these.
                // keep_oldest shouldnt be too hard to do.

                let total_bytes_duplicated = 0;
                // for of using the entries
                let entries = Object.entries(map_items_with_sha256);
                console.log('entries', entries);
                //throw 'stop';

                for (let entry of entries) {
                    let [checksum, checksum_listing] = entry;
                    if (checksum_listing.length > 1) {
                        //console.log('checksum_listing.length', checksum_listing.length);
                        //console.log('checksum_listing', checksum_listing);
                        //console.log('checksum_listing[0].size', checksum_listing[0].size);

                        if (!isNaN(checksum_listing[0].size)) {
                            total_bytes_duplicated = total_bytes_duplicated + checksum_listing[0].size;

                            checksum_listing.sort((a, b) => {
                                console.log('a, b', a, b);
                                const textA = a.timings.birth,
                                    textB = b.timings.birth;
                                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                            });

                            console.log('checksum_listing', checksum_listing);
                            //console.log('checksum_listing[0].path', checksum_listing[0].path);

                            let oldest_file_path = checksum_listing[0].path;
                            console.log('oldest_file_path', oldest_file_path);

                            // if they are in the same directory, keep the one with the longest file name
                            // otherwise, keep the oldest one.
                            // cameras get renamed so need to work around that.
                            // then when there are three.

                            let files_to_delete = [];

                            if (checksum_listing.length === 2) {
                                let dir_a = libpath.dirname(checksum_listing[0].path);
                                let dir_b = libpath.dirname(checksum_listing[1].path);

                                if (dir_a === dir_b) {

                                    let fname_a = libpath.basename(checksum_listing[0].path);
                                    let fname_b = libpath.basename(checksum_listing[1].path);

                                    //console.log('fname_a', fname_a);
                                    //console.log('fname_b', fname_b);

                                    if (fname_a.length > fname_b.length) {
                                        // keep a
                                        files_to_delete.push(checksum_listing[1].path);
                                    } else {
                                        // keep b
                                        files_to_delete.push(checksum_listing[0].path);
                                    }
                                } else {
                                    // Delete the oldest file.
                                    let birth_a = checksum_listing[0].timings.birth;
                                    let birth_b = checksum_listing[1].timings.birth;
                                    if (birth_a < birth_b) {
                                        // keep a
                                        files_to_delete.push(checksum_listing[1].path);
                                    } else {
                                        // keep b
                                        files_to_delete.push(checksum_listing[0].path);
                                    }
                                }
                            }
                            console.log('files_to_delete', files_to_delete);
                            //
                            if (files_to_delete.length > 0) {
                                //throw 'stop';
                            }

                            for (let file_path of files_to_delete) {
                                await p_unlink(file_path);
                                await dir_metadata_remove_file(libpath.dirname(file_path), libpath.basename(file_path));
                                // remove that file from its metadata in the directory.
                            }
                        }
                        // sort these by their age.
                        // metadata files shouldn't list directories?
                    }
                }
            })
        }
        //await walk_ensure_metatata();
        // but need to check if these are directories or watnot.
        let daily_dirs = () => {
            move_dir_files_to_daily_dirs()
        }

    })();
} else {
    // this module was not run directly from the command line and probably loaded by something else
}
module.exports = fnlfs;