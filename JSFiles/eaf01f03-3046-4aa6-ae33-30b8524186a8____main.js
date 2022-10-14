(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 3150:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ escapeStringRegexp)
/* harmony export */ });
function escapeStringRegexp(string) {
	if (typeof string !== 'string') {
		throw new TypeError('Expected a string');
	}

	// Escape characters with special meaning either inside or outside character sets.
	// Use a simple backslash escape when it’s always valid, and a `\xnn` escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.
	return string
		.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
		.replace(/-/g, '\\x2d');
}


/***/ }),

/***/ 1700:
/***/ ((module) => {

module.exports = function (glob, opts) {
  if (typeof glob !== 'string') {
    throw new TypeError('Expected a string');
  }

  var str = String(glob);

  // The regexp we are building, as a string.
  var reStr = "";

  // Whether we are matching so called "extended" globs (like bash) and should
  // support single character matching, matching ranges of characters, group
  // matching, etc.
  var extended = opts ? !!opts.extended : false;

  // When globstar is _false_ (default), '/foo/*' is translated a regexp like
  // '^\/foo\/.*$' which will match any string beginning with '/foo/'
  // When globstar is _true_, '/foo/*' is translated to regexp like
  // '^\/foo\/[^/]*$' which will match any string beginning with '/foo/' BUT
  // which does not have a '/' to the right of it.
  // E.g. with '/foo/*' these will match: '/foo/bar', '/foo/bar.txt' but
  // these will not '/foo/bar/baz', '/foo/bar/baz.txt'
  // Lastely, when globstar is _true_, '/foo/**' is equivelant to '/foo/*' when
  // globstar is _false_
  var globstar = opts ? !!opts.globstar : false;

  // If we are doing extended matching, this boolean is true when we are inside
  // a group (eg {*.html,*.js}), and false otherwise.
  var inGroup = false;

  // RegExp flags (eg "i" ) to pass in to RegExp constructor.
  var flags = opts && typeof( opts.flags ) === "string" ? opts.flags : "";

  var c;
  for (var i = 0, len = str.length; i < len; i++) {
    c = str[i];

    switch (c) {
    case "/":
    case "$":
    case "^":
    case "+":
    case ".":
    case "(":
    case ")":
    case "=":
    case "!":
    case "|":
      reStr += "\\" + c;
      break;

    case "?":
      if (extended) {
        reStr += ".";
	    break;
      }

    case "[":
    case "]":
      if (extended) {
        reStr += c;
	    break;
      }

    case "{":
      if (extended) {
        inGroup = true;
	    reStr += "(";
	    break;
      }

    case "}":
      if (extended) {
        inGroup = false;
	    reStr += ")";
	    break;
      }

    case ",":
      if (inGroup) {
        reStr += "|";
	    break;
      }
      reStr += "\\" + c;
      break;

    case "*":
      // Move over all consecutive "*"'s.
      // Also store the previous and next characters
      var prevChar = str[i - 1];
      var starCount = 1;
      while(str[i + 1] === "*") {
        starCount++;
        i++;
      }
      var nextChar = str[i + 1];

      if (!globstar) {
        // globstar is disabled, so treat any number of "*" as one
        reStr += ".*";
      } else {
        // globstar is enabled, so determine if this is a globstar segment
        var isGlobstar = starCount > 1                      // multiple "*"'s
          && (prevChar === "/" || prevChar === undefined)   // from the start of the segment
          && (nextChar === "/" || nextChar === undefined)   // to the end of the segment

        if (isGlobstar) {
          // it's a globstar, so match zero or more path segments
          reStr += "((?:[^/]*(?:\/|$))*)";
          i++; // move over the "/"
        } else {
          // it's not a globstar, so only match one path segment
          reStr += "([^/]*)";
        }
      }
      break;

    default:
      reStr += c;
    }
  }

  // When regexp 'g' flag is specified don't
  // constrain the regular expression with ^ & $
  if (!flags || !~flags.indexOf('g')) {
    reStr = "^" + reStr + "$";
  }

  return new RegExp(reStr, flags);
};


/***/ }),

/***/ 2190:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "getEncoding": () => (/* binding */ getEncoding),
  "isBinary": () => (/* binding */ isBinary),
  "isText": () => (/* binding */ isText)
});

// EXTERNAL MODULE: ./node_modules/path-browserify/index.js
var path_browserify = __webpack_require__(6470);
;// CONCATENATED MODULE: ./node_modules/textextensions/edition-browsers/index.js
/** List of text file extensions */
const list = [
	'Makefile',
	'Rakefile',
	'ada',
	'adb',
	'ads',
	'applescript',
	'as',
	'ascx',
	'asm',
	'asmx',
	'asp',
	'aspx',
	'atom',
	'bas',
	'bash',
	'bashrc',
	'bat',
	'bbcolors',
	'bdsgroup',
	'bdsproj',
	'bib',
	'bowerrc',
	'c',
	'cbl',
	'cc',
	'cfc',
	'cfg',
	'cfm',
	'cfml',
	'cgi',
	'clj',
	'cls',
	'cmake',
	'cmd',
	'cnf',
	'cob',
	'coffee',
	'coffeekup',
	'conf',
	'cpp',
	'cpt',
	'cpy',
	'crt',
	'cs',
	'csh',
	'cson',
	'csr',
	'css',
	'csslintrc',
	'csv',
	'ctl',
	'curlrc',
	'cxx',
	'dart',
	'dfm',
	'diff',
	'dof',
	'dpk',
	'dproj',
	'dtd',
	'eco',
	'editorconfig',
	'ejs',
	'el',
	'emacs',
	'eml',
	'ent',
	'erb',
	'erl',
	'eslintignore',
	'eslintrc',
	'ex',
	'exs',
	'f',
	'f03',
	'f77',
	'f90',
	'f95',
	'fish',
	'for',
	'fpp',
	'frm',
	'ftn',
	'gemrc',
	'gitattributes',
	'gitconfig',
	'gitignore',
	'gitkeep',
	'gitmodules',
	'go',
	'gpp',
	'gradle',
	'groovy',
	'groupproj',
	'grunit',
	'gtmpl',
	'gvimrc',
	'h',
	'haml',
	'hbs',
	'hgignore',
	'hh',
	'hpp',
	'hrl',
	'hs',
	'hta',
	'htaccess',
	'htc',
	'htm',
	'html',
	'htpasswd',
	'hxx',
	'iced',
	'inc',
	'ini',
	'ino',
	'int',
	'irbrc',
	'itcl',
	'itermcolors',
	'itk',
	'jade',
	'java',
	'jhtm',
	'jhtml',
	'js',
	'jscsrc',
	'jshintignore',
	'jshintrc',
	'json',
	'json5',
	'jsonld',
	'jsp',
	'jspx',
	'jsx',
	'ksh',
	'less',
	'lhs',
	'lisp',
	'log',
	'ls',
	'lsp',
	'lua',
	'm',
	'mak',
	'map',
	'markdown',
	'master',
	'md',
	'mdown',
	'mdwn',
	'mdx',
	'metadata',
	'mht',
	'mhtml',
	'mjs',
	'mk',
	'mkd',
	'mkdn',
	'mkdown',
	'ml',
	'mli',
	'mm',
	'mxml',
	'nfm',
	'nfo',
	'njk',
	'noon',
	'npmignore',
	'npmrc',
	'nvmrc',
	'ops',
	'pas',
	'pasm',
	'patch',
	'pbxproj',
	'pch',
	'pem',
	'pg',
	'php',
	'php3',
	'php4',
	'php5',
	'phpt',
	'phtml',
	'pir',
	'pl',
	'pm',
	'pmc',
	'pod',
	'pot',
	'properties',
	'props',
	'pt',
	'pug',
	'py',
	'r',
	'rake',
	'rb',
	'rdoc',
	'rdoc_options',
	'resx',
	'rhtml',
	'rjs',
	'rlib',
	'rmd',
	'ron',
	'rs',
	'rss',
	'rst',
	'rtf',
	'rvmrc',
	'rxml',
	's',
	'sass',
	'scala',
	'scm',
	'scss',
	'seestyle',
	'sh',
	'shtml',
	'sls',
	'spec',
	'sql',
	'sqlite',
	'ss',
	'sss',
	'st',
	'strings',
	'sty',
	'styl',
	'stylus',
	'sub',
	'sublime-build',
	'sublime-commands',
	'sublime-completions',
	'sublime-keymap',
	'sublime-macro',
	'sublime-menu',
	'sublime-project',
	'sublime-settings',
	'sublime-workspace',
	'sv',
	'svc',
	'svg',
	't',
	'tcl',
	'tcsh',
	'terminal',
	'tex',
	'text',
	'textile',
	'tg',
	'tmLanguage',
	'tmTheme',
	'tmpl',
	'tpl',
	'ts',
	'tsv',
	'tsx',
	'tt',
	'tt2',
	'ttml',
	'txt',
	'v',
	'vb',
	'vbs',
	'vh',
	'vhd',
	'vhdl',
	'vim',
	'viminfo',
	'vimrc',
	'vue',
	'webapp',
	'wxml',
	'wxss',
	'x-php',
	'xht',
	'xhtml',
	'xml',
	'xs',
	'xsd',
	'xsl',
	'xslt',
	'yaml',
	'yml',
	'zsh',
	'zshrc',
]
/* harmony default export */ const edition_browsers = (list);

;// CONCATENATED MODULE: ./node_modules/binaryextensions/edition-browsers/index.js
/** List of binary file extensions */
const edition_browsers_list = [
	'dds',
	'eot',
	'gif',
	'ico',
	'jar',
	'jpeg',
	'jpg',
	'pdf',
	'png',
	'swf',
	'tga',
	'ttf',
	'zip',
]
/* harmony default export */ const binaryextensions_edition_browsers = (edition_browsers_list);

;// CONCATENATED MODULE: ./node_modules/istextorbinary/edition-browsers/index.js
/* eslint no-use-before-define:0 */



/**
 * Determine if the filename and/or buffer is text.
 * Determined by extension checks first (if filename is available), otherwise if unknown extension or no filename, will perform a slower buffer encoding detection.
 * This order is done, as extension checks are quicker, and also because encoding checks cannot guarantee accuracy for chars between utf8 and utf16.
 * The extension checks are performed using the resources https://github.com/bevry/textextensions and https://github.com/bevry/binaryextensions
 * @param filename The filename for the file/buffer if available
 * @param buffer The buffer for the file if available
 * @returns Will be `null` if neither `filename` nor `buffer` were provided. Otherwise will be a boolean value with the detection result.
 */
function isText(filename, buffer) {
	// Test extensions
	if (filename) {
		// Extract filename
		const parts = path_browserify.basename(filename).split('.').reverse()
		// Cycle extensions
		for (const extension of parts) {
			if (edition_browsers.indexOf(extension) !== -1) {
				return true
			}
			if (binaryextensions_edition_browsers.indexOf(extension) !== -1) {
				return false
			}
		}
	}
	// Fallback to encoding if extension check was not enough
	if (buffer) {
		return getEncoding(buffer) === 'utf8'
	}
	// No buffer was provided
	return null
}
/**
 * Determine if the filename and/or buffer is binary.
 * Determined by extension checks first (if filename is available), otherwise if unknown extension or no filename, will perform a slower buffer encoding detection.
 * This order is done, as extension checks are quicker, and also because encoding checks cannot guarantee accuracy for chars between utf8 and utf16.
 * The extension checks are performed using the resources https://github.com/bevry/textextensions and https://github.com/bevry/binaryextensions
 * @param filename The filename for the file/buffer if available
 * @param buffer The buffer for the file if available
 * @returns Will be `null` if neither `filename` nor `buffer` were provided. Otherwise will be a boolean value with the detection result.
 */
function isBinary(filename, buffer) {
	const text = isText(filename, buffer)
	if (text == null) return null
	return !text
}
/**
 * Get the encoding of a buffer.
 * Checks the start, middle, and end of the buffer for characters that are unrecognized within UTF8 encoding.
 * History has shown that inspection at all three locations is necessary.
 * @returns Will be `null` if `buffer` was not provided. Otherwise will be either `'utf8'` or `'binary'`
 */
function getEncoding(buffer, opts) {
	var _a, _b
	// Check
	if (!buffer) return null
	// Prepare
	const textEncoding = 'utf8'
	const binaryEncoding = 'binary'
	const chunkLength =
		(_a = opts === null || opts === void 0 ? void 0 : opts.chunkLength) !==
			null && _a !== void 0
			? _a
			: 24
	let chunkBegin =
		(_b = opts === null || opts === void 0 ? void 0 : opts.chunkBegin) !==
			null && _b !== void 0
			? _b
			: 0
	// Discover
	if ((opts === null || opts === void 0 ? void 0 : opts.chunkBegin) == null) {
		// Start
		let encoding = getEncoding(buffer, { chunkLength, chunkBegin })
		if (encoding === textEncoding) {
			// Middle
			chunkBegin = Math.max(0, Math.floor(buffer.length / 2) - chunkLength)
			encoding = getEncoding(buffer, {
				chunkLength,
				chunkBegin,
			})
			if (encoding === textEncoding) {
				// End
				chunkBegin = Math.max(0, buffer.length - chunkLength)
				encoding = getEncoding(buffer, {
					chunkLength,
					chunkBegin,
				})
			}
		}
		// Return
		return encoding
	} else {
		// Extract
		const chunkEnd = Math.min(buffer.length, chunkBegin + chunkLength)
		const contentChunkUTF8 = buffer.toString(textEncoding, chunkBegin, chunkEnd)
		// Detect encoding
		for (let i = 0; i < contentChunkUTF8.length; ++i) {
			const charCode = contentChunkUTF8.charCodeAt(i)
			if (charCode === 65533 || charCode <= 8) {
				// 8 and below are control characters (e.g. backspace, null, eof, etc.)
				// 65533 is the unknown character
				// console.log(charCode, contentChunkUTF8[i])
				return binaryEncoding
			}
		}
		// Return
		return textEncoding
	}
}


/***/ }),

/***/ 6470:
/***/ ((module) => {

"use strict";
// 'path' module extracted from Node.js v8.11.1 (only the posix part)
// transplited with Babel

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



function assertPath(path) {
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string. Received ' + JSON.stringify(path));
  }
}

// Resolves . and .. elements in a path with directory names
function normalizeStringPosix(path, allowAboveRoot) {
  var res = '';
  var lastSegmentLength = 0;
  var lastSlash = -1;
  var dots = 0;
  var code;
  for (var i = 0; i <= path.length; ++i) {
    if (i < path.length)
      code = path.charCodeAt(i);
    else if (code === 47 /*/*/)
      break;
    else
      code = 47 /*/*/;
    if (code === 47 /*/*/) {
      if (lastSlash === i - 1 || dots === 1) {
        // NOOP
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 /*.*/ || res.charCodeAt(res.length - 2) !== 46 /*.*/) {
          if (res.length > 2) {
            var lastSlashIndex = res.lastIndexOf('/');
            if (lastSlashIndex !== res.length - 1) {
              if (lastSlashIndex === -1) {
                res = '';
                lastSegmentLength = 0;
              } else {
                res = res.slice(0, lastSlashIndex);
                lastSegmentLength = res.length - 1 - res.lastIndexOf('/');
              }
              lastSlash = i;
              dots = 0;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = '';
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0)
            res += '/..';
          else
            res = '..';
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0)
          res += '/' + path.slice(lastSlash + 1, i);
        else
          res = path.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === 46 /*.*/ && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}

function _format(sep, pathObject) {
  var dir = pathObject.dir || pathObject.root;
  var base = pathObject.base || (pathObject.name || '') + (pathObject.ext || '');
  if (!dir) {
    return base;
  }
  if (dir === pathObject.root) {
    return dir + base;
  }
  return dir + sep + base;
}

var posix = {
  // path.resolve([from ...], to)
  resolve: function resolve() {
    var resolvedPath = '';
    var resolvedAbsolute = false;
    var cwd;

    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path;
      if (i >= 0)
        path = arguments[i];
      else {
        if (cwd === undefined)
          cwd = process.cwd();
        path = cwd;
      }

      assertPath(path);

      // Skip empty entries
      if (path.length === 0) {
        continue;
      }

      resolvedPath = path + '/' + resolvedPath;
      resolvedAbsolute = path.charCodeAt(0) === 47 /*/*/;
    }

    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)

    // Normalize the path
    resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);

    if (resolvedAbsolute) {
      if (resolvedPath.length > 0)
        return '/' + resolvedPath;
      else
        return '/';
    } else if (resolvedPath.length > 0) {
      return resolvedPath;
    } else {
      return '.';
    }
  },

  normalize: function normalize(path) {
    assertPath(path);

    if (path.length === 0) return '.';

    var isAbsolute = path.charCodeAt(0) === 47 /*/*/;
    var trailingSeparator = path.charCodeAt(path.length - 1) === 47 /*/*/;

    // Normalize the path
    path = normalizeStringPosix(path, !isAbsolute);

    if (path.length === 0 && !isAbsolute) path = '.';
    if (path.length > 0 && trailingSeparator) path += '/';

    if (isAbsolute) return '/' + path;
    return path;
  },

  isAbsolute: function isAbsolute(path) {
    assertPath(path);
    return path.length > 0 && path.charCodeAt(0) === 47 /*/*/;
  },

  join: function join() {
    if (arguments.length === 0)
      return '.';
    var joined;
    for (var i = 0; i < arguments.length; ++i) {
      var arg = arguments[i];
      assertPath(arg);
      if (arg.length > 0) {
        if (joined === undefined)
          joined = arg;
        else
          joined += '/' + arg;
      }
    }
    if (joined === undefined)
      return '.';
    return posix.normalize(joined);
  },

  relative: function relative(from, to) {
    assertPath(from);
    assertPath(to);

    if (from === to) return '';

    from = posix.resolve(from);
    to = posix.resolve(to);

    if (from === to) return '';

    // Trim any leading backslashes
    var fromStart = 1;
    for (; fromStart < from.length; ++fromStart) {
      if (from.charCodeAt(fromStart) !== 47 /*/*/)
        break;
    }
    var fromEnd = from.length;
    var fromLen = fromEnd - fromStart;

    // Trim any leading backslashes
    var toStart = 1;
    for (; toStart < to.length; ++toStart) {
      if (to.charCodeAt(toStart) !== 47 /*/*/)
        break;
    }
    var toEnd = to.length;
    var toLen = toEnd - toStart;

    // Compare paths to find the longest common path from root
    var length = fromLen < toLen ? fromLen : toLen;
    var lastCommonSep = -1;
    var i = 0;
    for (; i <= length; ++i) {
      if (i === length) {
        if (toLen > length) {
          if (to.charCodeAt(toStart + i) === 47 /*/*/) {
            // We get here if `from` is the exact base path for `to`.
            // For example: from='/foo/bar'; to='/foo/bar/baz'
            return to.slice(toStart + i + 1);
          } else if (i === 0) {
            // We get here if `from` is the root
            // For example: from='/'; to='/foo'
            return to.slice(toStart + i);
          }
        } else if (fromLen > length) {
          if (from.charCodeAt(fromStart + i) === 47 /*/*/) {
            // We get here if `to` is the exact base path for `from`.
            // For example: from='/foo/bar/baz'; to='/foo/bar'
            lastCommonSep = i;
          } else if (i === 0) {
            // We get here if `to` is the root.
            // For example: from='/foo'; to='/'
            lastCommonSep = 0;
          }
        }
        break;
      }
      var fromCode = from.charCodeAt(fromStart + i);
      var toCode = to.charCodeAt(toStart + i);
      if (fromCode !== toCode)
        break;
      else if (fromCode === 47 /*/*/)
        lastCommonSep = i;
    }

    var out = '';
    // Generate the relative path based on the path difference between `to`
    // and `from`
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
      if (i === fromEnd || from.charCodeAt(i) === 47 /*/*/) {
        if (out.length === 0)
          out += '..';
        else
          out += '/..';
      }
    }

    // Lastly, append the rest of the destination (`to`) path that comes after
    // the common path parts
    if (out.length > 0)
      return out + to.slice(toStart + lastCommonSep);
    else {
      toStart += lastCommonSep;
      if (to.charCodeAt(toStart) === 47 /*/*/)
        ++toStart;
      return to.slice(toStart);
    }
  },

  _makeLong: function _makeLong(path) {
    return path;
  },

  dirname: function dirname(path) {
    assertPath(path);
    if (path.length === 0) return '.';
    var code = path.charCodeAt(0);
    var hasRoot = code === 47 /*/*/;
    var end = -1;
    var matchedSlash = true;
    for (var i = path.length - 1; i >= 1; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
        // We saw the first non-path separator
        matchedSlash = false;
      }
    }

    if (end === -1) return hasRoot ? '/' : '.';
    if (hasRoot && end === 1) return '//';
    return path.slice(0, end);
  },

  basename: function basename(path, ext) {
    if (ext !== undefined && typeof ext !== 'string') throw new TypeError('"ext" argument must be a string');
    assertPath(path);

    var start = 0;
    var end = -1;
    var matchedSlash = true;
    var i;

    if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
      if (ext.length === path.length && ext === path) return '';
      var extIdx = ext.length - 1;
      var firstNonSlashEnd = -1;
      for (i = path.length - 1; i >= 0; --i) {
        var code = path.charCodeAt(i);
        if (code === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
          if (firstNonSlashEnd === -1) {
            // We saw the first non-path separator, remember this index in case
            // we need it if the extension ends up not matching
            matchedSlash = false;
            firstNonSlashEnd = i + 1;
          }
          if (extIdx >= 0) {
            // Try to match the explicit extension
            if (code === ext.charCodeAt(extIdx)) {
              if (--extIdx === -1) {
                // We matched the extension, so mark this as the end of our path
                // component
                end = i;
              }
            } else {
              // Extension does not match, so our result is the entire path
              // component
              extIdx = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }

      if (start === end) end = firstNonSlashEnd;else if (end === -1) end = path.length;
      return path.slice(start, end);
    } else {
      for (i = path.length - 1; i >= 0; --i) {
        if (path.charCodeAt(i) === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // path component
          matchedSlash = false;
          end = i + 1;
        }
      }

      if (end === -1) return '';
      return path.slice(start, end);
    }
  },

  extname: function extname(path) {
    assertPath(path);
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;
    for (var i = path.length - 1; i >= 0; --i) {
      var code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1)
            startDot = i;
          else if (preDotState !== 1)
            preDotState = 1;
      } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      return '';
    }
    return path.slice(startDot, end);
  },

  format: function format(pathObject) {
    if (pathObject === null || typeof pathObject !== 'object') {
      throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
    }
    return _format('/', pathObject);
  },

  parse: function parse(path) {
    assertPath(path);

    var ret = { root: '', dir: '', base: '', ext: '', name: '' };
    if (path.length === 0) return ret;
    var code = path.charCodeAt(0);
    var isAbsolute = code === 47 /*/*/;
    var start;
    if (isAbsolute) {
      ret.root = '/';
      start = 1;
    } else {
      start = 0;
    }
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    var i = path.length - 1;

    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;

    // Get non-dir info
    for (; i >= start; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) startDot = i;else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
    // We saw a non-dot character immediately before the dot
    preDotState === 0 ||
    // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      if (end !== -1) {
        if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);else ret.base = ret.name = path.slice(startPart, end);
      }
    } else {
      if (startPart === 0 && isAbsolute) {
        ret.name = path.slice(1, startDot);
        ret.base = path.slice(1, end);
      } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
      }
      ret.ext = path.slice(startDot, end);
    }

    if (startPart > 0) ret.dir = path.slice(0, startPart - 1);else if (isAbsolute) ret.dir = '/';

    return ret;
  },

  sep: '/',
  delimiter: ':',
  win32: null,
  posix: null
};

posix.posix = posix;

module.exports = posix;


/***/ }),

/***/ 4314:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const path = __webpack_require__(6470);
const vscode = __webpack_require__(7549);
const nativeFSProvider_1 = __webpack_require__(6797);
const nativeFSUtil_1 = __webpack_require__(3963);
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        // Register providers
        // * NativeFS
        const nativeFS = new nativeFSProvider_1.NativeFS();
        context.subscriptions.push(vscode.workspace.registerFileSystemProvider(nativeFSProvider_1.NativeFS.scheme, nativeFS, {
            isCaseSensitive: true,
            isReadonly: false,
        }));
        context.subscriptions.push(vscode.workspace.registerFileSearchProvider(nativeFSProvider_1.NativeFS.scheme, nativeFS));
        context.subscriptions.push(vscode.workspace.registerTextSearchProvider(nativeFSProvider_1.NativeFS.scheme, nativeFS));
        //   // * MemFS
        //   const memFS = new MemFS();
        //   context.subscriptions.push(
        //     vscode.workspace.registerFileSystemProvider(MemFS.scheme, memFS, {
        //       isCaseSensitive: true,
        //       isReadonly: false,
        //     })
        //   );
        //   context.subscriptions.push(
        //     vscode.workspace.registerFileSearchProvider(MemFS.scheme, memFS)
        //   );
        //   context.subscriptions.push(
        //     vscode.workspace.registerTextSearchProvider(MemFS.scheme, memFS)
        //   );
        //   const encoder = new TextEncoder();
        //   // Always create memfs:/Welcome directory
        //   const welcomeDirectoryUri = vscode.Uri.parse(`${MemFS.scheme}:/Welcome/`);
        //   const welcomeREADMEUri = vscode.Uri.parse(
        //     `${MemFS.scheme}:/Welcome/README.md`
        //   );
        //   const workspaceFileUri = vscode.Uri.parse(
        //     `${MemFS.scheme}:/web-fs.code-workspace`
        //   );
        //   try {
        //     await memFS.createDirectory(welcomeDirectoryUri);
        //   } catch (_) {}
        //   // Add README.md to /Welcome
        //   if (!(await memFS.exists(welcomeREADMEUri))) {
        //     await memFS.writeFile(
        //       welcomeREADMEUri,
        //       encoder.encode(
        //         `# Welcome! (Experiment)
        // Please open **Command Palette** then run: 
        // * \`NativeFS: Open Folder\` command to open a local folder on your device.  
        // * \`MemFS: Open Folder\` command to create/open a temporary folder in memory. 
        // Enjoy!`
        //       ),
        //       {
        //         create: true,
        //         overwrite: true,
        //       }
        //     );
        //   }
        //   // Initialize the workspaceFile
        //   if (!(await memFS.exists(workspaceFileUri))) {
        //     await memFS.writeFile(
        //       workspaceFileUri,
        //       encoder.encode(
        //         `{
        //         "folders": ${JSON.stringify([welcomeDirectoryUri])}
        //       }`
        //       ),
        //       {
        //         create: true,
        //         overwrite: true,
        //       }
        //     );
        //   }
        // The command has been defined in the package.json file
        // Now provide the implementation of the command with registerCommand
        // The commandId parameter must match the command field in package.json
        context.subscriptions.push(vscode.commands.registerCommand("nativefs.openFolder", () => __awaiter(this, void 0, void 0, function* () {
            try {
                const directoryPath = yield vscode.commands.executeCommand("nativeFS.showDirectoryPicker");
                if (!directoryPath) {
                    return vscode.window.showErrorMessage(`Failed to open folder`);
                }
                vscode.workspace.updateWorkspaceFolders(vscode.workspace.workspaceFolders
                    ? vscode.workspace.workspaceFolders.length
                    : 0, null, {
                    uri: vscode.Uri.parse(`nativefs:${directoryPath}`),
                    name: path.basename(directoryPath),
                });
            }
            catch (error) {
                console.error(error);
                vscode.window.showErrorMessage("Your environment doesn't support the Native File System API");
            }
        })));
        // context.subscriptions.push(
        //   vscode.commands.registerCommand("memfs.openFolder", async (_) => {
        //     const name = await vscode.window.showInputBox({
        //       value: "Welcome",
        //       placeHolder: "Please enter the folder name",
        //     });
        //     if (!name) {
        //       vscode.window.showErrorMessage(`Empty folder name is not supported`);
        //     }
        //     try {
        //       await memFS.createDirectory(
        //         vscode.Uri.parse(`${MemFS.scheme}:/${name}`)
        //       );
        //     } catch (_) {}
        //     const state = vscode.workspace.updateWorkspaceFolders(0, 0, {
        //       uri: vscode.Uri.parse(`${MemFS.scheme}:/${name}`),
        //       name: name,
        //     });
        //   })
        // );
        return {
            nativeFSPrefix: nativeFSUtil_1.nativeFSPrefix,
        };
    });
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;


/***/ }),

/***/ 6797:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/**
 * File System Provider for Native File System
 * Referred from https://github.com/microsoft/vscode-extension-samples/blob/main/fsprovider-sample/src/fileSystemProvider.ts
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NativeFS = void 0;
// import GlobToRegExp = require("glob-to-regexp");
const GlobToRegExp = __webpack_require__(1700);
const vscode = __webpack_require__(7549);
const util_1 = __webpack_require__(6534);
class NativeFS {
    constructor() {
        this._emitter = new vscode.EventEmitter();
        this._bufferedEvents = [];
        this.onDidChangeFile = this
            ._emitter.event;
    }
    // *-- FileSystemProvider
    // --- manage file metadata
    stat(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield vscode.commands.executeCommand("nativeFS.stat", uri);
                if (!result) {
                    throw vscode.FileSystemError.FileNotFound(uri);
                }
                else {
                    return result;
                }
            }
            catch (error) {
                throw vscode.FileSystemError.FileNotFound(uri);
            }
        });
    }
    readDirectory(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield vscode.commands.executeCommand("nativeFS.readDirectory", uri);
                if (!result) {
                    throw vscode.FileSystemError.FileNotFound(uri);
                }
                else {
                    return result;
                }
            }
            catch (error) {
                throw vscode.FileSystemError.FileNotFound(uri);
            }
        });
    }
    readRootDirectories() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield vscode.commands.executeCommand("nativeFS.readRootDirectories");
                if (!result) {
                    throw vscode.FileSystemError.Unavailable;
                }
                else {
                    return result;
                }
            }
            catch (error) {
                throw vscode.FileSystemError.Unavailable;
            }
        });
    }
    // --- manage file contents
    readFile(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield vscode.commands.executeCommand("nativeFS.readFile", uri);
                if (!result) {
                    throw vscode.FileSystemError.FileNotFound(uri);
                }
                else {
                    return Uint8Array.from(result);
                }
            }
            catch (error) {
                throw vscode.FileSystemError.FileNotFound(uri);
            }
        });
    }
    writeFile(uri, content, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { events } = (yield vscode.commands.executeCommand("nativeFS.writeFile", uri, Array.from(content), options)) || { events: [] };
            if (events) {
                (events || []).forEach((event) => {
                    this._fireSoon(event);
                });
            }
        });
    }
    // --- manage files/folders
    rename(oldUri, newUri, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { events } = (yield vscode.commands.executeCommand("nativeFS.rename", oldUri, newUri, options)) || { events: [] };
            if (events) {
                (events || []).forEach((event) => {
                    this._fireSoon(event);
                });
            }
        });
    }
    delete(uri, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { events } = (yield vscode.commands.executeCommand("nativeFS.delete", uri, options)) || { events: [] };
            if (events) {
                (events || []).forEach((event) => {
                    this._fireSoon(event);
                });
            }
        });
    }
    createDirectory(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            const { events } = (yield vscode.commands.executeCommand("nativeFS.createDirectory", uri)) || { events: [] };
            if (events) {
                (events || []).forEach((event) => {
                    this._fireSoon(event);
                });
            }
        });
    }
    watch(_resource) {
        // ignore, fires for all changes...
        return new vscode.Disposable(() => { });
    }
    _fireSoon(...events) {
        this._bufferedEvents.push(...events);
        if (this._fireSoonHandle) {
            clearTimeout(this._fireSoonHandle);
        }
        this._fireSoonHandle = setTimeout(() => {
            this._emitter.fire(this._bufferedEvents);
            this._bufferedEvents.length = 0;
        }, 5);
    }
    // *- FileSearchProvider
    provideFileSearchResults(query, options, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const files = yield util_1.getAllFiles(this, NativeFS.scheme, options.folder, options.excludes.map((e) => GlobToRegExp(e)));
            const result = [];
            const pattern = query.pattern
                ? new RegExp(util_1.convertSimple2RegExpPattern(query.pattern), "i")
                : null;
            for (const file of files) {
                if (!pattern || pattern.exec(file.path)) {
                    result.push(file);
                }
            }
            return result;
        });
    }
    //  *- TextSearchProvider
    provideTextSearchResults(query, options, progress, _token) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = { limitHit: false };
            const includes = options.includes.map((e) => GlobToRegExp(e));
            const excludes = options.excludes.map((e) => GlobToRegExp(e));
            yield util_1.searchText(this, NativeFS.scheme, options.folder, query, includes, excludes, progress, _token);
            return result;
        });
    }
}
exports.NativeFS = NativeFS;
NativeFS.scheme = "nativefs";


/***/ }),

/***/ 3963:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.nativeFSPrefix = void 0;
exports.nativeFSPrefix = "/nativefs-";


/***/ }),

/***/ 6534:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.searchText = exports.getAllFiles = exports.convertSimple2RegExpPattern = void 0;
const escape_string_regexp_1 = __webpack_require__(3150);
const path = __webpack_require__(6470);
const vscode = __webpack_require__(7549);
const { isBinary, } = __webpack_require__(2190);
const textDecoder = new TextDecoder();
function convertSimple2RegExpPattern(pattern) {
    return (pattern
        .split("")
        .map((x) => x) // escape each character
        .join(".*")
        .replace(/\.\*\*+/g, ".*") + ".*").replace(/([\-\\\{\}\+\?\|\^\$\.\,\[\]\(\)\#\s])\.\*/g, "\\$1.*");
}
exports.convertSimple2RegExpPattern = convertSimple2RegExpPattern;
function getAllFiles(fs, scheme, directoryPath, excludes) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = [];
        let entries = yield fs.readDirectory(directoryPath);
        const promises = [];
        for (let i = 0; i < entries.length; i++) {
            const [fileName, fileType] = entries[i];
            const filePath = path.join(directoryPath.path, fileName);
            if (excludes.some((e) => e.exec(filePath))) {
                continue;
            }
            if (fileType === vscode.FileType.File) {
                result.push(vscode.Uri.parse(filePath));
            }
            else if (fileType === vscode.FileType.Directory) {
                promises.push(getAllFiles(fs, scheme, vscode.Uri.parse(`${scheme}:${filePath}`), excludes));
            }
        }
        if (promises.length) {
            const resultList = yield Promise.all(promises);
            result = result.concat(resultList.reduce((acc, val) => acc.concat(val), []));
        }
        return result;
    });
}
exports.getAllFiles = getAllFiles;
//  * References
//  ** https://github.com/microsoft/vscode/blob/e1f0f8f51390dea5df9096718fb6b647ed5a9534/src/vs/workbench/services/search/node/ripgrepTextSearchEngine.ts
//  ** https://github.com/microsoft/vscode/blob/94c9ea46838a9a619aeafb7e8afd1170c967bb55/src/vs/workbench/services/search/node/ripgrepSearchProvider.ts
//  ** https://github.com/microsoft/vscode-web-playground/blob/main/src/memfs.ts
function searchText(fs, scheme, directoryPath, query, includes, excludes, progress, _token) {
    return __awaiter(this, void 0, void 0, function* () {
        if (_token.isCancellationRequested) {
            return;
        }
        const entries = yield fs.readDirectory(directoryPath);
        const promises = [];
        for (let i = 0; i < entries.length; i++) {
            const [fileName, fileType] = entries[i];
            const filePath = path.join(directoryPath.path, fileName);
            if (excludes.some((e) => e.exec(filePath))) {
                continue;
            }
            if (includes.length && !includes.some((e) => e.exec(filePath))) {
                continue;
            }
            if (fileType === vscode.FileType.File) {
                promises.push(search(fs, query, vscode.Uri.parse(`${scheme}:${filePath}`), progress, _token));
            }
            else if (fileType === vscode.FileType.Directory) {
                promises.push(searchText(fs, scheme, vscode.Uri.parse(`${scheme}:${filePath}`), query, includes, excludes, progress, _token));
            }
        }
        if (promises.length) {
            yield Promise.all(promises);
        }
    });
}
exports.searchText = searchText;
function search(fs, query, filePath, progress, _token) {
    return __awaiter(this, void 0, void 0, function* () {
        if (_token.isCancellationRequested) {
            return;
        }
        const { binary, content } = yield isFileBinary(fs, filePath);
        if (binary) {
            return;
        }
        const stringContent = textDecoder.decode(content);
        let lines;
        let flags = "g";
        let regexpStr = query.isRegExp
            ? query.pattern
            : escape_string_regexp_1.default(query.pattern);
        if (!query.isCaseSensitive) {
            flags += "i";
        }
        if (query.isWordMatch) {
            regexpStr = "\\b" + regexpStr + "\\b";
        }
        const queryRegexp = new RegExp(regexpStr, flags);
        let result;
        while ((result = queryRegexp.exec(stringContent))) {
            if (!lines) {
                let index = 0;
                lines = stringContent.split("\n").map((text) => {
                    const result = { text, index };
                    index = index + text.length + 1;
                    return result;
                });
            }
            const matchedString = result[0];
            const ahead = stringContent.slice(0, result.index);
            const lineNumber = (ahead.match(/\n/gm) || []).length;
            const report = {
                uri: filePath,
                ranges: new vscode.Range(new vscode.Position(lineNumber, result.index - lines[lineNumber].index), new vscode.Position(lineNumber, result.index - lines[lineNumber].index + matchedString.length)),
                preview: {
                    text: lines[lineNumber].text,
                    matches: new vscode.Range(new vscode.Position(0, result.index - lines[lineNumber].index), new vscode.Position(0, result.index - lines[lineNumber].index + matchedString.length)),
                },
            };
            progress.report(report);
        }
    });
}
function isFileBinary(fs, filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (isBinary(filePath.path) || filePath.path.match(/\.(asar)$/)) {
            return { binary: true, content: yield fs.readFile(filePath) };
        }
        else {
            // Check content
            const content = yield fs.readFile(filePath);
            return { binary: !!isBinary(null, content.buffer), content };
        }
    });
}


/***/ }),

/***/ 7549:
/***/ ((module) => {

"use strict";
module.exports = require("vscode");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(4314);
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});