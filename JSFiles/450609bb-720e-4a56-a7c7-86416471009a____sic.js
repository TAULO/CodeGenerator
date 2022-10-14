(function(){
// sic bootstrap: sic.js
let moduleDB = {};
// sic bootstrap: path.js
var path = function () {
  // file from node js src
  // modified to work in browser env
  // - remove `require('internal/errors')`
  // - replace `errors.TypeError` with `TypeError`
  // - replace `module.exports` with `return`
  // - added iife
  // - assigned to path

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

  'use strict';

  function assertPath(path) {
    if (typeof path !== 'string') {
      throw new TypeError('ERR_INVALID_ARG_TYPE', 'path', 'string');
    }
  }

  // Resolves . and .. elements in a path with directory names
  function normalizeStringWin32(path, allowAboveRoot) {
    var res = '';
    var lastSlash = -1;
    var dots = 0;
    var code;
    for (var i = 0; i <= path.length; ++i) {
      if (i < path.length) code = path.charCodeAt(i);else if (code === 47 /*/*/ || code === 92 /*\*/) break;else code = 47 /*/*/;
      if (code === 47 /*/*/ || code === 92 /*\*/) {
          if (lastSlash === i - 1 || dots === 1) {
            // NOOP
          } else if (lastSlash !== i - 1 && dots === 2) {
            if (res.length < 2 || res.charCodeAt(res.length - 1) !== 46 /*.*/ || res.charCodeAt(res.length - 2) !== 46 /*.*/) {
                if (res.length > 2) {
                  const start = res.length - 1;
                  var j = start;
                  for (; j >= 0; --j) {
                    if (res.charCodeAt(j) === 92 /*\*/) break;
                  }
                  if (j !== start) {
                    if (j === -1) res = '';else res = res.slice(0, j);
                    lastSlash = i;
                    dots = 0;
                    continue;
                  }
                } else if (res.length === 2 || res.length === 1) {
                  res = '';
                  lastSlash = i;
                  dots = 0;
                  continue;
                }
              }
            if (allowAboveRoot) {
              if (res.length > 0) res += '\\..';else res = '..';
            }
          } else {
            if (res.length > 0) res += '\\' + path.slice(lastSlash + 1, i);else res = path.slice(lastSlash + 1, i);
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

  // Resolves . and .. elements in a path with directory names
  function normalizeStringPosix(path, allowAboveRoot) {
    var res = '';
    var lastSlash = -1;
    var dots = 0;
    var code;
    for (var i = 0; i <= path.length; ++i) {
      if (i < path.length) code = path.charCodeAt(i);else if (code === 47 /*/*/) break;else code = 47 /*/*/;
      if (code === 47 /*/*/) {
          if (lastSlash === i - 1 || dots === 1) {
            // NOOP
          } else if (lastSlash !== i - 1 && dots === 2) {
            if (res.length < 2 || res.charCodeAt(res.length - 1) !== 46 /*.*/ || res.charCodeAt(res.length - 2) !== 46 /*.*/) {
                if (res.length > 2) {
                  const start = res.length - 1;
                  var j = start;
                  for (; j >= 0; --j) {
                    if (res.charCodeAt(j) === 47 /*/*/) break;
                  }
                  if (j !== start) {
                    if (j === -1) res = '';else res = res.slice(0, j);
                    lastSlash = i;
                    dots = 0;
                    continue;
                  }
                } else if (res.length === 2 || res.length === 1) {
                  res = '';
                  lastSlash = i;
                  dots = 0;
                  continue;
                }
              }
            if (allowAboveRoot) {
              if (res.length > 0) res += '/..';else res = '..';
            }
          } else {
            if (res.length > 0) res += '/' + path.slice(lastSlash + 1, i);else res = path.slice(lastSlash + 1, i);
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
    const dir = pathObject.dir || pathObject.root;
    const base = pathObject.base || (pathObject.name || '') + (pathObject.ext || '');
    if (!dir) {
      return base;
    }
    if (dir === pathObject.root) {
      return dir + base;
    }
    return dir + sep + base;
  }

  const win32 = {
    // path.resolve([from ...], to)
    resolve: function resolve() {
      var resolvedDevice = '';
      var resolvedTail = '';
      var resolvedAbsolute = false;

      for (var i = arguments.length - 1; i >= -1; i--) {
        var path;
        if (i >= 0) {
          path = arguments[i];
        } else if (!resolvedDevice) {
          path = process.cwd();
        } else {
          // Windows has the concept of drive-specific current working
          // directories. If we've resolved a drive letter but not yet an
          // absolute path, get cwd for that drive, or the process cwd if
          // the drive cwd is not available. We're sure the device is not
          // a UNC path at this points, because UNC paths are always absolute.
          path = process.env['=' + resolvedDevice] || process.cwd();

          // Verify that a cwd was found and that it actually points
          // to our drive. If not, default to the drive's root.
          if (path === undefined || path.slice(0, 3).toLowerCase() !== resolvedDevice.toLowerCase() + '\\') {
            path = resolvedDevice + '\\';
          }
        }

        assertPath(path);

        // Skip empty entries
        if (path.length === 0) {
          continue;
        }

        var len = path.length;
        var rootEnd = 0;
        var code = path.charCodeAt(0);
        var device = '';
        var isAbsolute = false;

        // Try to match a root
        if (len > 1) {
          if (code === 47 /*/*/ || code === 92 /*\*/) {
              // Possible UNC root

              // If we started with a separator, we know we at least have an
              // absolute path of some kind (UNC or otherwise)
              isAbsolute = true;

              code = path.charCodeAt(1);
              if (code === 47 /*/*/ || code === 92 /*\*/) {
                  // Matched double path separator at beginning
                  var j = 2;
                  var last = j;
                  // Match 1 or more non-path separators
                  for (; j < len; ++j) {
                    code = path.charCodeAt(j);
                    if (code === 47 /*/*/ || code === 92 /*\*/) break;
                  }
                  if (j < len && j !== last) {
                    const firstPart = path.slice(last, j);
                    // Matched!
                    last = j;
                    // Match 1 or more path separators
                    for (; j < len; ++j) {
                      code = path.charCodeAt(j);
                      if (code !== 47 /*/*/ && code !== 92 /*\*/) break;
                    }
                    if (j < len && j !== last) {
                      // Matched!
                      last = j;
                      // Match 1 or more non-path separators
                      for (; j < len; ++j) {
                        code = path.charCodeAt(j);
                        if (code === 47 /*/*/ || code === 92 /*\*/) break;
                      }
                      if (j === len) {
                        // We matched a UNC root only

                        device = '\\\\' + firstPart + '\\' + path.slice(last);
                        rootEnd = j;
                      } else if (j !== last) {
                        // We matched a UNC root with leftovers

                        device = '\\\\' + firstPart + '\\' + path.slice(last, j);
                        rootEnd = j;
                      }
                    }
                  }
                } else {
                rootEnd = 1;
              }
            } else if (code >= 65 /*A*/ && code <= 90 /*Z*/ || code >= 97 /*a*/ && code <= 122 /*z*/) {
            // Possible device root

            code = path.charCodeAt(1);
            if (path.charCodeAt(1) === 58 /*:*/) {
                device = path.slice(0, 2);
                rootEnd = 2;
                if (len > 2) {
                  code = path.charCodeAt(2);
                  if (code === 47 /*/*/ || code === 92 /*\*/) {
                      // Treat separator following drive name as an absolute path
                      // indicator
                      isAbsolute = true;
                      rootEnd = 3;
                    }
                }
              }
          }
        } else if (code === 47 /*/*/ || code === 92 /*\*/) {
            // `path` contains just a path separator
            rootEnd = 1;
            isAbsolute = true;
          }

        if (device.length > 0 && resolvedDevice.length > 0 && device.toLowerCase() !== resolvedDevice.toLowerCase()) {
          // This path points to another device so it is not applicable
          continue;
        }

        if (resolvedDevice.length === 0 && device.length > 0) {
          resolvedDevice = device;
        }
        if (!resolvedAbsolute) {
          resolvedTail = path.slice(rootEnd) + '\\' + resolvedTail;
          resolvedAbsolute = isAbsolute;
        }

        if (resolvedDevice.length > 0 && resolvedAbsolute) {
          break;
        }
      }

      // At this point the path should be resolved to a full absolute path,
      // but handle relative paths to be safe (might happen when process.cwd()
      // fails)

      // Normalize the tail path
      resolvedTail = normalizeStringWin32(resolvedTail, !resolvedAbsolute);

      return resolvedDevice + (resolvedAbsolute ? '\\' : '') + resolvedTail || '.';
    },

    normalize: function normalize(path) {
      assertPath(path);
      const len = path.length;
      if (len === 0) return '.';
      var rootEnd = 0;
      var code = path.charCodeAt(0);
      var device;
      var isAbsolute = false;

      // Try to match a root
      if (len > 1) {
        if (code === 47 /*/*/ || code === 92 /*\*/) {
            // Possible UNC root

            // If we started with a separator, we know we at least have an absolute
            // path of some kind (UNC or otherwise)
            isAbsolute = true;

            code = path.charCodeAt(1);
            if (code === 47 /*/*/ || code === 92 /*\*/) {
                // Matched double path separator at beginning
                var j = 2;
                var last = j;
                // Match 1 or more non-path separators
                for (; j < len; ++j) {
                  code = path.charCodeAt(j);
                  if (code === 47 /*/*/ || code === 92 /*\*/) break;
                }
                if (j < len && j !== last) {
                  const firstPart = path.slice(last, j);
                  // Matched!
                  last = j;
                  // Match 1 or more path separators
                  for (; j < len; ++j) {
                    code = path.charCodeAt(j);
                    if (code !== 47 /*/*/ && code !== 92 /*\*/) break;
                  }
                  if (j < len && j !== last) {
                    // Matched!
                    last = j;
                    // Match 1 or more non-path separators
                    for (; j < len; ++j) {
                      code = path.charCodeAt(j);
                      if (code === 47 /*/*/ || code === 92 /*\*/) break;
                    }
                    if (j === len) {
                      // We matched a UNC root only
                      // Return the normalized version of the UNC root since there
                      // is nothing left to process

                      return '\\\\' + firstPart + '\\' + path.slice(last) + '\\';
                    } else if (j !== last) {
                      // We matched a UNC root with leftovers

                      device = '\\\\' + firstPart + '\\' + path.slice(last, j);
                      rootEnd = j;
                    }
                  }
                }
              } else {
              rootEnd = 1;
            }
          } else if (code >= 65 /*A*/ && code <= 90 /*Z*/ || code >= 97 /*a*/ && code <= 122 /*z*/) {
          // Possible device root

          code = path.charCodeAt(1);
          if (path.charCodeAt(1) === 58 /*:*/) {
              device = path.slice(0, 2);
              rootEnd = 2;
              if (len > 2) {
                code = path.charCodeAt(2);
                if (code === 47 /*/*/ || code === 92 /*\*/) {
                    // Treat separator following drive name as an absolute path
                    // indicator
                    isAbsolute = true;
                    rootEnd = 3;
                  }
              }
            }
        }
      } else if (code === 47 /*/*/ || code === 92 /*\*/) {
          // `path` contains just a path separator, exit early to avoid unnecessary
          // work
          return '\\';
        }

      code = path.charCodeAt(len - 1);
      var trailingSeparator = code === 47 /*/*/ || code === 92 /*\*/;
      var tail;
      if (rootEnd < len) tail = normalizeStringWin32(path.slice(rootEnd), !isAbsolute);else tail = '';
      if (tail.length === 0 && !isAbsolute) tail = '.';
      if (tail.length > 0 && trailingSeparator) tail += '\\';
      if (device === undefined) {
        if (isAbsolute) {
          if (tail.length > 0) return '\\' + tail;else return '\\';
        } else if (tail.length > 0) {
          return tail;
        } else {
          return '';
        }
      } else {
        if (isAbsolute) {
          if (tail.length > 0) return device + '\\' + tail;else return device + '\\';
        } else if (tail.length > 0) {
          return device + tail;
        } else {
          return device;
        }
      }
    },

    isAbsolute: function isAbsolute(path) {
      assertPath(path);
      const len = path.length;
      if (len === 0) return false;
      var code = path.charCodeAt(0);
      if (code === 47 /*/*/ || code === 92 /*\*/) {
          return true;
        } else if (code >= 65 /*A*/ && code <= 90 /*Z*/ || code >= 97 /*a*/ && code <= 122 /*z*/) {
        // Possible device root

        if (len > 2 && path.charCodeAt(1) === 58 /*:*/) {
            code = path.charCodeAt(2);
            if (code === 47 /*/*/ || code === 92 /*\*/) return true;
          }
      }
      return false;
    },

    join: function join() {
      if (arguments.length === 0) return '.';

      var joined;
      var firstPart;
      for (var i = 0; i < arguments.length; ++i) {
        var arg = arguments[i];
        assertPath(arg);
        if (arg.length > 0) {
          if (joined === undefined) joined = firstPart = arg;else joined += '\\' + arg;
        }
      }

      if (joined === undefined) return '.';

      // Make sure that the joined path doesn't start with two slashes, because
      // normalize() will mistake it for an UNC path then.
      //
      // This step is skipped when it is very clear that the user actually
      // intended to point at an UNC path. This is assumed when the first
      // non-empty string arguments starts with exactly two slashes followed by
      // at least one more non-slash character.
      //
      // Note that for normalize() to treat a path as an UNC path it needs to
      // have at least 2 components, so we don't filter for that here.
      // This means that the user can use join to construct UNC paths from
      // a server name and a share name; for example:
      //   path.join('//server', 'share') -> '\\\\server\\share\\')
      //var firstPart = paths[0];
      var needsReplace = true;
      var slashCount = 0;
      var code = firstPart.charCodeAt(0);
      if (code === 47 /*/*/ || code === 92 /*\*/) {
          ++slashCount;
          const firstLen = firstPart.length;
          if (firstLen > 1) {
            code = firstPart.charCodeAt(1);
            if (code === 47 /*/*/ || code === 92 /*\*/) {
                ++slashCount;
                if (firstLen > 2) {
                  code = firstPart.charCodeAt(2);
                  if (code === 47 /*/*/ || code === 92 /*\*/) ++slashCount;else {
                    // We matched a UNC path in the first part
                    needsReplace = false;
                  }
                }
              }
          }
        }
      if (needsReplace) {
        // Find any more consecutive slashes we need to replace
        for (; slashCount < joined.length; ++slashCount) {
          code = joined.charCodeAt(slashCount);
          if (code !== 47 /*/*/ && code !== 92 /*\*/) break;
        }

        // Replace the slashes if needed
        if (slashCount >= 2) joined = '\\' + joined.slice(slashCount);
      }

      return win32.normalize(joined);
    },

    // It will solve the relative path from `from` to `to`, for instance:
    //  from = 'C:\\orandea\\test\\aaa'
    //  to = 'C:\\orandea\\impl\\bbb'
    // The output of the function should be: '..\\..\\impl\\bbb'
    relative: function relative(from, to) {
      assertPath(from);
      assertPath(to);

      if (from === to) return '';

      var fromOrig = win32.resolve(from);
      var toOrig = win32.resolve(to);

      if (fromOrig === toOrig) return '';

      from = fromOrig.toLowerCase();
      to = toOrig.toLowerCase();

      if (from === to) return '';

      // Trim any leading backslashes
      var fromStart = 0;
      for (; fromStart < from.length; ++fromStart) {
        if (from.charCodeAt(fromStart) !== 92 /*\*/) break;
      }
      // Trim trailing backslashes (applicable to UNC paths only)
      var fromEnd = from.length;
      for (; fromEnd - 1 > fromStart; --fromEnd) {
        if (from.charCodeAt(fromEnd - 1) !== 92 /*\*/) break;
      }
      var fromLen = fromEnd - fromStart;

      // Trim any leading backslashes
      var toStart = 0;
      for (; toStart < to.length; ++toStart) {
        if (to.charCodeAt(toStart) !== 92 /*\*/) break;
      }
      // Trim trailing backslashes (applicable to UNC paths only)
      var toEnd = to.length;
      for (; toEnd - 1 > toStart; --toEnd) {
        if (to.charCodeAt(toEnd - 1) !== 92 /*\*/) break;
      }
      var toLen = toEnd - toStart;

      // Compare paths to find the longest common path from root
      var length = fromLen < toLen ? fromLen : toLen;
      var lastCommonSep = -1;
      var i = 0;
      for (; i <= length; ++i) {
        if (i === length) {
          if (toLen > length) {
            if (to.charCodeAt(toStart + i) === 92 /*\*/) {
                // We get here if `from` is the exact base path for `to`.
                // For example: from='C:\\foo\\bar'; to='C:\\foo\\bar\\baz'
                return toOrig.slice(toStart + i + 1);
              } else if (i === 2) {
              // We get here if `from` is the device root.
              // For example: from='C:\\'; to='C:\\foo'
              return toOrig.slice(toStart + i);
            }
          }
          if (fromLen > length) {
            if (from.charCodeAt(fromStart + i) === 92 /*\*/) {
                // We get here if `to` is the exact base path for `from`.
                // For example: from='C:\\foo\\bar'; to='C:\\foo'
                lastCommonSep = i;
              } else if (i === 2) {
              // We get here if `to` is the device root.
              // For example: from='C:\\foo\\bar'; to='C:\\'
              lastCommonSep = 3;
            }
          }
          break;
        }
        var fromCode = from.charCodeAt(fromStart + i);
        var toCode = to.charCodeAt(toStart + i);
        if (fromCode !== toCode) break;else if (fromCode === 92 /*\*/) lastCommonSep = i;
      }

      // We found a mismatch before the first common path separator was seen, so
      // return the original `to`.
      if (i !== length && lastCommonSep === -1) {
        return toOrig;
      }

      var out = '';
      if (lastCommonSep === -1) lastCommonSep = 0;
      // Generate the relative path based on the path difference between `to` and
      // `from`
      for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
        if (i === fromEnd || from.charCodeAt(i) === 92 /*\*/) {
            if (out.length === 0) out += '..';else out += '\\..';
          }
      }

      // Lastly, append the rest of the destination (`to`) path that comes after
      // the common path parts
      if (out.length > 0) return out + toOrig.slice(toStart + lastCommonSep, toEnd);else {
        toStart += lastCommonSep;
        if (toOrig.charCodeAt(toStart) === 92 /*\*/) ++toStart;
        return toOrig.slice(toStart, toEnd);
      }
    },

    _makeLong: function _makeLong(path) {
      // Note: this will *probably* throw somewhere.
      if (typeof path !== 'string') return path;

      if (path.length === 0) {
        return '';
      }

      const resolvedPath = win32.resolve(path);

      if (resolvedPath.length >= 3) {
        var code = resolvedPath.charCodeAt(0);
        if (code === 92 /*\*/) {
            // Possible UNC root

            if (resolvedPath.charCodeAt(1) === 92 /*\*/) {
                code = resolvedPath.charCodeAt(2);
                if (code !== 63 /*?*/ && code !== 46 /*.*/) {
                    // Matched non-long UNC root, convert the path to a long UNC path
                    return '\\\\?\\UNC\\' + resolvedPath.slice(2);
                  }
              }
          } else if (code >= 65 /*A*/ && code <= 90 /*Z*/ || code >= 97 /*a*/ && code <= 122 /*z*/) {
          // Possible device root

          if (resolvedPath.charCodeAt(1) === 58 /*:*/ && resolvedPath.charCodeAt(2) === 92 /*\*/) {
              // Matched device root, convert the path to a long UNC path
              return '\\\\?\\' + resolvedPath;
            }
        }
      }

      return path;
    },

    dirname: function dirname(path) {
      assertPath(path);
      const len = path.length;
      if (len === 0) return '.';
      var rootEnd = -1;
      var end = -1;
      var matchedSlash = true;
      var offset = 0;
      var code = path.charCodeAt(0);

      // Try to match a root
      if (len > 1) {
        if (code === 47 /*/*/ || code === 92 /*\*/) {
            // Possible UNC root

            rootEnd = offset = 1;

            code = path.charCodeAt(1);
            if (code === 47 /*/*/ || code === 92 /*\*/) {
                // Matched double path separator at beginning
                var j = 2;
                var last = j;
                // Match 1 or more non-path separators
                for (; j < len; ++j) {
                  code = path.charCodeAt(j);
                  if (code === 47 /*/*/ || code === 92 /*\*/) break;
                }
                if (j < len && j !== last) {
                  // Matched!
                  last = j;
                  // Match 1 or more path separators
                  for (; j < len; ++j) {
                    code = path.charCodeAt(j);
                    if (code !== 47 /*/*/ && code !== 92 /*\*/) break;
                  }
                  if (j < len && j !== last) {
                    // Matched!
                    last = j;
                    // Match 1 or more non-path separators
                    for (; j < len; ++j) {
                      code = path.charCodeAt(j);
                      if (code === 47 /*/*/ || code === 92 /*\*/) break;
                    }
                    if (j === len) {
                      // We matched a UNC root only
                      return path;
                    }
                    if (j !== last) {
                      // We matched a UNC root with leftovers

                      // Offset by 1 to include the separator after the UNC root to
                      // treat it as a "normal root" on top of a (UNC) root
                      rootEnd = offset = j + 1;
                    }
                  }
                }
              }
          } else if (code >= 65 /*A*/ && code <= 90 /*Z*/ || code >= 97 /*a*/ && code <= 122 /*z*/) {
          // Possible device root

          code = path.charCodeAt(1);
          if (path.charCodeAt(1) === 58 /*:*/) {
              rootEnd = offset = 2;
              if (len > 2) {
                code = path.charCodeAt(2);
                if (code === 47 /*/*/ || code === 92 /*\*/) rootEnd = offset = 3;
              }
            }
        }
      } else if (code === 47 /*/*/ || code === 92 /*\*/) {
          // `path` contains just a path separator, exit early to avoid
          // unnecessary work
          return path;
        }

      for (var i = len - 1; i >= offset; --i) {
        code = path.charCodeAt(i);
        if (code === 47 /*/*/ || code === 92 /*\*/) {
            if (!matchedSlash) {
              end = i;
              break;
            }
          } else {
          // We saw the first non-path separator
          matchedSlash = false;
        }
      }

      if (end === -1) {
        if (rootEnd === -1) return '.';else end = rootEnd;
      }
      return path.slice(0, end);
    },

    basename: function basename(path, ext) {
      if (ext !== undefined && typeof ext !== 'string') throw new TypeError('ERR_INVALID_ARG_TYPE', 'ext', 'string');
      assertPath(path);
      var start = 0;
      var end = -1;
      var matchedSlash = true;
      var i;

      // Check for a drive letter prefix so as not to mistake the following
      // path separator as an extra separator at the end of the path that can be
      // disregarded
      if (path.length >= 2) {
        const drive = path.charCodeAt(0);
        if (drive >= 65 /*A*/ && drive <= 90 /*Z*/ || drive >= 97 /*a*/ && drive <= 122 /*z*/) {
          if (path.charCodeAt(1) === 58 /*:*/) start = 2;
        }
      }

      if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
        if (ext.length === path.length && ext === path) return '';
        var extIdx = ext.length - 1;
        var firstNonSlashEnd = -1;
        for (i = path.length - 1; i >= start; --i) {
          const code = path.charCodeAt(i);
          if (code === 47 /*/*/ || code === 92 /*\*/) {
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
        for (i = path.length - 1; i >= start; --i) {
          const code = path.charCodeAt(i);
          if (code === 47 /*/*/ || code === 92 /*\*/) {
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
        const code = path.charCodeAt(i);
        if (code === 47 /*/*/ || code === 92 /*\*/) {
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
        return '';
      }
      return path.slice(startDot, end);
    },

    format: function format(pathObject) {
      if (pathObject === null || typeof pathObject !== 'object') {
        throw new TypeError('ERR_INVALID_ARG_TYPE', 'pathObject', 'Object', pathObject);
      }
      return _format('\\', pathObject);
    },

    parse: function parse(path) {
      assertPath(path);

      var ret = { root: '', dir: '', base: '', ext: '', name: '' };
      if (path.length === 0) return ret;

      var len = path.length;
      var rootEnd = 0;
      var code = path.charCodeAt(0);
      var isAbsolute = false;

      // Try to match a root
      if (len > 1) {
        if (code === 47 /*/*/ || code === 92 /*\*/) {
            // Possible UNC root

            isAbsolute = true;

            code = path.charCodeAt(1);
            rootEnd = 1;
            if (code === 47 /*/*/ || code === 92 /*\*/) {
                // Matched double path separator at beginning
                var j = 2;
                var last = j;
                // Match 1 or more non-path separators
                for (; j < len; ++j) {
                  code = path.charCodeAt(j);
                  if (code === 47 /*/*/ || code === 92 /*\*/) break;
                }
                if (j < len && j !== last) {
                  // Matched!
                  last = j;
                  // Match 1 or more path separators
                  for (; j < len; ++j) {
                    code = path.charCodeAt(j);
                    if (code !== 47 /*/*/ && code !== 92 /*\*/) break;
                  }
                  if (j < len && j !== last) {
                    // Matched!
                    last = j;
                    // Match 1 or more non-path separators
                    for (; j < len; ++j) {
                      code = path.charCodeAt(j);
                      if (code === 47 /*/*/ || code === 92 /*\*/) break;
                    }
                    if (j === len) {
                      // We matched a UNC root only

                      rootEnd = j;
                    } else if (j !== last) {
                      // We matched a UNC root with leftovers

                      rootEnd = j + 1;
                    }
                  }
                }
              }
          } else if (code >= 65 /*A*/ && code <= 90 /*Z*/ || code >= 97 /*a*/ && code <= 122 /*z*/) {
          // Possible device root

          code = path.charCodeAt(1);
          if (path.charCodeAt(1) === 58 /*:*/) {
              rootEnd = 2;
              if (len > 2) {
                code = path.charCodeAt(2);
                if (code === 47 /*/*/ || code === 92 /*\*/) {
                    if (len === 3) {
                      // `path` contains just a drive root, exit early to avoid
                      // unnecessary work
                      ret.root = ret.dir = path;
                      return ret;
                    }
                    isAbsolute = true;
                    rootEnd = 3;
                  }
              } else {
                // `path` contains just a drive root, exit early to avoid
                // unnecessary work
                ret.root = ret.dir = path;
                return ret;
              }
            }
        }
      } else if (code === 47 /*/*/ || code === 92 /*\*/) {
          // `path` contains just a path separator, exit early to avoid
          // unnecessary work
          ret.root = ret.dir = path;
          return ret;
        }

      if (rootEnd > 0) ret.root = path.slice(0, rootEnd);

      var startDot = -1;
      var startPart = 0;
      var end = -1;
      var matchedSlash = true;
      var i = path.length - 1;

      // Track the state of characters (if any) we see before our first dot and
      // after any path separator we find
      var preDotState = 0;

      // Get non-dir info
      for (; i >= rootEnd; --i) {
        code = path.charCodeAt(i);
        if (code === 47 /*/*/ || code === 92 /*\*/) {
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
          if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(rootEnd, end);else ret.base = ret.name = path.slice(startPart, end);
        }
      } else {
        if (startPart === 0 && isAbsolute) {
          ret.name = path.slice(rootEnd, startDot);
          ret.base = path.slice(rootEnd, end);
        } else {
          ret.name = path.slice(startPart, startDot);
          ret.base = path.slice(startPart, end);
        }
        ret.ext = path.slice(startDot, end);
      }

      if (startPart > 0) ret.dir = path.slice(0, startPart - 1);else if (isAbsolute) ret.dir = path.slice(0, rootEnd);

      return ret;
    },

    sep: '\\',
    delimiter: ';',
    win32: null,
    posix: null
  };

  const posix = {
    // path.resolve([from ...], to)
    resolve: function resolve() {
      var resolvedPath = '';
      var resolvedAbsolute = false;
      var cwd;

      for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
        var path;
        if (i >= 0) path = arguments[i];else {
          if (cwd === undefined) cwd = process.cwd();
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
        if (resolvedPath.length > 0) return '/' + resolvedPath;else return '/';
      } else if (resolvedPath.length > 0) {
        return resolvedPath;
      } else {
        return '.';
      }
    },

    normalize: function normalize(path) {
      assertPath(path);

      if (path.length === 0) return '.';

      const isAbsolute = path.charCodeAt(0) === 47 /*/*/;
      const trailingSeparator = path.charCodeAt(path.length - 1) === 47 /*/*/;

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
      if (arguments.length === 0) return '.';
      var joined;
      for (var i = 0; i < arguments.length; ++i) {
        var arg = arguments[i];
        assertPath(arg);
        if (arg.length > 0) {
          if (joined === undefined) joined = arg;else joined += '/' + arg;
        }
      }
      if (joined === undefined) return '.';
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
        if (from.charCodeAt(fromStart) !== 47 /*/*/) break;
      }
      var fromEnd = from.length;
      var fromLen = fromEnd - fromStart;

      // Trim any leading backslashes
      var toStart = 1;
      for (; toStart < to.length; ++toStart) {
        if (to.charCodeAt(toStart) !== 47 /*/*/) break;
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
        if (fromCode !== toCode) break;else if (fromCode === 47 /*/*/) lastCommonSep = i;
      }

      var out = '';
      // Generate the relative path based on the path difference between `to`
      // and `from`
      for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
        if (i === fromEnd || from.charCodeAt(i) === 47 /*/*/) {
            if (out.length === 0) out += '..';else out += '/..';
          }
      }

      // Lastly, append the rest of the destination (`to`) path that comes after
      // the common path parts
      if (out.length > 0) return out + to.slice(toStart + lastCommonSep);else {
        toStart += lastCommonSep;
        if (to.charCodeAt(toStart) === 47 /*/*/) ++toStart;
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
      if (ext !== undefined && typeof ext !== 'string') throw new TypeError('ERR_INVALID_ARG_TYPE', 'ext', 'string');
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
          const code = path.charCodeAt(i);
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
        const code = path.charCodeAt(i);
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
        return '';
      }
      return path.slice(startDot, end);
    },

    format: function format(pathObject) {
      if (pathObject === null || typeof pathObject !== 'object') {
        throw new TypeError('ERR_INVALID_ARG_TYPE', 'pathObject', 'Object', pathObject);
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

  posix.win32 = win32.win32 = win32;
  posix.posix = win32.posix = posix;

  // if (process.platform === 'win32')
  //   module.exports = win32;
  // else
  //   module.exports = posix;
  return posix;
}();
// sic bootstrap: Module.js
/* globals moduleDB, path, window */

const nodejsCore = ['assert', 'async_hooks', 'buffer', 'child_process', 'cluster', 'crypto', 'dgram', 'dns', 'domain', 'events', 'fs', 'http', 'https', 'net', 'os', 'path', 'punycode', 'querystring', 'readline', 'repl', 'stream', 'string_decoder', 'tls', 'tty', 'url', 'util', 'v8', 'vm', 'zlib'];

let moduleExec = null; // forward declaration
class Module {
  constructor(dirname, filename, parent) {
    this.id = this.filename;
    this.loaded = false;

    this.dirname = dirname;
    this.filename = filename;

    this.exports = {};
    this.module = this;

    this.parent = parent;
    this.children = [];
  }

  exec(fn) {
    fn(this.exports, this.require.bind(this), this.module, this.filename, this.dirname, window);
  }

  requireFile(file) {
    if (moduleDB.hasOwnProperty(file)) return moduleExec(file, this);
    if (moduleDB.hasOwnProperty(file + '.js')) return moduleExec(file + '.js', this);
    if (moduleDB.hasOwnProperty(file + '.json')) throw new Error('wrong env. no require json'); // todo
    if (moduleDB.hasOwnProperty(file + '.node')) throw new Error('wrong env. no binary addons');
    return null;
  }
  requireDir(file) {
    if (moduleDB.hasOwnProperty(path.join(file, 'package.json'))) throw new Error('wrong env. no require dir via package.json'); // todo
    return null;
  }
  requireIndex(file) {
    if (moduleDB.hasOwnProperty(path.join(file, 'index.js'))) throw moduleExec(path.join(file, 'index.js'), this);
    if (moduleDB.hasOwnProperty(path.join(file, 'index.json'))) throw new Error('wrong env. no require index.json from dir'); // todo
    if (moduleDB.hasOwnProperty(path.join(file, 'index.node'))) throw new Error('wrong env. no require index binary addon from dir');
    return null;
  }

  requireNodeModules(file, base) {
    const dirs = [];
    do {
      if (path.basename(base) !== 'node_modules') dirs.push(path.join(base, 'node_modules'));
      base = path.dirname(base);
    } while (base !== '/');

    let res = null;
    for (const d of dirs) {
      if (res == null) res = this.requireFile(path.join(d, file));
      if (res == null) res = this.requireDir(path.join(d, file));

      if (res != null) break;
    }
    return res;
  }

  require(query) {
    if (query == null) throw new Error('missing path');
    if (typeof query !== 'string') throw new Error('path must be a string');

    if (nodejsCore.indexOf(query) !== -1) throw new Error('wrong env. no node');

    let base = this.dirname;
    if (query[0] === '/') base = '/';
    const file = path.resolve(path.join(base, query));

    let child = null;
    if (query[0] === '/' || query.startsWith('./') || query.startsWith('../')) {
      if (child == null) child = this.requireFile(file);
      if (child == null) child = this.requireDir(file);
      if (child == null) child = this.requireIndex(file);
      if (child == null) child = this.requireNodeModules(file, base);
    }

    if (child == null) throw new Error('Cannot find module \'' + query + '\'');

    this.children.push(child);
    return child.exports;
  }
}

moduleExec = function (file, parent) {
  const module = new Module(path.dirname(file), file, parent);
  module.exec(moduleDB[file]);
  return module;
};
moduleDB['/Users/maximsmol/projects/js/sic/test/main.js'] = (function(exports, require, module, __filename, __dirname, global) {
var test = require('./hi.js');
var react = require('./node_modules/react/dist/react.min.js');

console.log(test.abc);

global.react = react;

})
moduleDB['/Users/maximsmol/projects/js/sic/test/hi.js'] = (function(exports, require, module, __filename, __dirname, global) {
exports.abc = 10;

})
moduleDB['/Users/maximsmol/projects/js/sic/test/node_modules/react/dist/react.min.js'] = (function(exports, require, module, __filename, __dirname, global) {
/**
 * React v15.6.1
 *
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */
!function(t){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var e;e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,e.React=t()}}(function(){return function t(e,n,r){function o(a,u){if(!n[a]){if(!e[a]){var s="function"==typeof require&&require;if(!u&&s)return s(a,!0);if(i)return i(a,!0);var c=new Error("Cannot find module '"+a+"'");throw c.code="MODULE_NOT_FOUND",c}var l=n[a]={exports:{}};e[a][0].call(l.exports,function(t){var n=e[a][1][t];return o(n||t)},l,l.exports,t,e,n,r)}return n[a].exports}for(var i="function"==typeof require&&require,a=0;a<r.length;a++)o(r[a]);return o}({1:[function(t,e,n){"use strict";function r(t){var e={"=":"=0",":":"=2"};return"$"+(""+t).replace(/[=:]/g,function(t){return e[t]})}function o(t){var e=/(=0|=2)/g,n={"=0":"=","=2":":"};return(""+("."===t[0]&&"$"===t[1]?t.substring(2):t.substring(1))).replace(e,function(t){return n[t]})}var i={escape:r,unescape:o};e.exports=i},{}],2:[function(t,e,n){"use strict";var r=t(19),o=(t(24),function(t){var e=this;if(e.instancePool.length){var n=e.instancePool.pop();return e.call(n,t),n}return new e(t)}),i=function(t,e){var n=this;if(n.instancePool.length){var r=n.instancePool.pop();return n.call(r,t,e),r}return new n(t,e)},a=function(t,e,n){var r=this;if(r.instancePool.length){var o=r.instancePool.pop();return r.call(o,t,e,n),o}return new r(t,e,n)},u=function(t,e,n,r){var o=this;if(o.instancePool.length){var i=o.instancePool.pop();return o.call(i,t,e,n,r),i}return new o(t,e,n,r)},s=function(t){var e=this;t instanceof e||r("25"),t.destructor(),e.instancePool.length<e.poolSize&&e.instancePool.push(t)},c=o,l=function(t,e){var n=t;return n.instancePool=[],n.getPooled=e||c,n.poolSize||(n.poolSize=10),n.release=s,n},f={addPoolingTo:l,oneArgumentPooler:o,twoArgumentPooler:i,threeArgumentPooler:a,fourArgumentPooler:u};e.exports=f},{19:19,24:24}],3:[function(t,e,n){"use strict";var r=t(26),o=t(4),i=t(5),a=t(7),u=t(8),s=t(11),c=t(13),l=t(15),f=t(18),p=u.createElement,d=u.createFactory,y=u.cloneElement,h=r,m=function(t){return t},v={Children:{map:i.map,forEach:i.forEach,count:i.count,toArray:i.toArray,only:f},Component:o.Component,PureComponent:o.PureComponent,createElement:p,cloneElement:y,isValidElement:u.isValidElement,PropTypes:s,createClass:l,createFactory:d,createMixin:m,DOM:a,version:c,__spread:h};e.exports=v},{11:11,13:13,15:15,18:18,26:26,4:4,5:5,7:7,8:8}],4:[function(t,e,n){"use strict";function r(t,e,n){this.props=t,this.context=e,this.refs=c,this.updater=n||s}function o(t,e,n){this.props=t,this.context=e,this.refs=c,this.updater=n||s}function i(){}var a=t(19),u=t(26),s=t(10),c=(t(14),t(23));t(24),t(17);r.prototype.isReactComponent={},r.prototype.setState=function(t,e){"object"!=typeof t&&"function"!=typeof t&&null!=t&&a("85"),this.updater.enqueueSetState(this,t),e&&this.updater.enqueueCallback(this,e,"setState")},r.prototype.forceUpdate=function(t){this.updater.enqueueForceUpdate(this),t&&this.updater.enqueueCallback(this,t,"forceUpdate")};i.prototype=r.prototype,o.prototype=new i,o.prototype.constructor=o,u(o.prototype,r.prototype),o.prototype.isPureReactComponent=!0,e.exports={Component:r,PureComponent:o}},{10:10,14:14,17:17,19:19,23:23,24:24,26:26}],5:[function(t,e,n){"use strict";function r(t){return(""+t).replace(E,"$&/")}function o(t,e){this.func=t,this.context=e,this.count=0}function i(t,e,n){var r=t.func,o=t.context;r.call(o,e,t.count++)}function a(t,e,n){if(null==t)return t;var r=o.getPooled(e,n);v(t,i,r),o.release(r)}function u(t,e,n,r){this.result=t,this.keyPrefix=e,this.func=n,this.context=r,this.count=0}function s(t,e,n){var o=t.result,i=t.keyPrefix,a=t.func,u=t.context,s=a.call(u,e,t.count++);Array.isArray(s)?c(s,o,n,m.thatReturnsArgument):null!=s&&(h.isValidElement(s)&&(s=h.cloneAndReplaceKey(s,i+(!s.key||e&&e.key===s.key?"":r(s.key)+"/")+n)),o.push(s))}function c(t,e,n,o,i){var a="";null!=n&&(a=r(n)+"/");var c=u.getPooled(e,a,o,i);v(t,s,c),u.release(c)}function l(t,e,n){if(null==t)return t;var r=[];return c(t,r,null,e,n),r}function f(t,e,n){return null}function p(t,e){return v(t,f,null)}function d(t){var e=[];return c(t,e,null,m.thatReturnsArgument),e}var y=t(2),h=t(8),m=t(22),v=t(20),b=y.twoArgumentPooler,g=y.fourArgumentPooler,E=/\/+/g;o.prototype.destructor=function(){this.func=null,this.context=null,this.count=0},y.addPoolingTo(o,b),u.prototype.destructor=function(){this.result=null,this.keyPrefix=null,this.func=null,this.context=null,this.count=0},y.addPoolingTo(u,g);var x={forEach:a,map:l,mapIntoWithKeyPrefixInternal:c,count:p,toArray:d};e.exports=x},{2:2,20:20,22:22,8:8}],6:[function(t,e,n){"use strict";var r={current:null};e.exports=r},{}],7:[function(t,e,n){"use strict";var r=t(8),o=r.createFactory,i={a:o("a"),abbr:o("abbr"),address:o("address"),area:o("area"),article:o("article"),aside:o("aside"),audio:o("audio"),b:o("b"),base:o("base"),bdi:o("bdi"),bdo:o("bdo"),big:o("big"),blockquote:o("blockquote"),body:o("body"),br:o("br"),button:o("button"),canvas:o("canvas"),caption:o("caption"),cite:o("cite"),code:o("code"),col:o("col"),colgroup:o("colgroup"),data:o("data"),datalist:o("datalist"),dd:o("dd"),del:o("del"),details:o("details"),dfn:o("dfn"),dialog:o("dialog"),div:o("div"),dl:o("dl"),dt:o("dt"),em:o("em"),embed:o("embed"),fieldset:o("fieldset"),figcaption:o("figcaption"),figure:o("figure"),footer:o("footer"),form:o("form"),h1:o("h1"),h2:o("h2"),h3:o("h3"),h4:o("h4"),h5:o("h5"),h6:o("h6"),head:o("head"),header:o("header"),hgroup:o("hgroup"),hr:o("hr"),html:o("html"),i:o("i"),iframe:o("iframe"),img:o("img"),input:o("input"),ins:o("ins"),kbd:o("kbd"),keygen:o("keygen"),label:o("label"),legend:o("legend"),li:o("li"),link:o("link"),main:o("main"),map:o("map"),mark:o("mark"),menu:o("menu"),menuitem:o("menuitem"),meta:o("meta"),meter:o("meter"),nav:o("nav"),noscript:o("noscript"),object:o("object"),ol:o("ol"),optgroup:o("optgroup"),option:o("option"),output:o("output"),p:o("p"),param:o("param"),picture:o("picture"),pre:o("pre"),progress:o("progress"),q:o("q"),rp:o("rp"),rt:o("rt"),ruby:o("ruby"),s:o("s"),samp:o("samp"),script:o("script"),section:o("section"),select:o("select"),small:o("small"),source:o("source"),span:o("span"),strong:o("strong"),style:o("style"),sub:o("sub"),summary:o("summary"),sup:o("sup"),table:o("table"),tbody:o("tbody"),td:o("td"),textarea:o("textarea"),tfoot:o("tfoot"),th:o("th"),thead:o("thead"),time:o("time"),title:o("title"),tr:o("tr"),track:o("track"),u:o("u"),ul:o("ul"),var:o("var"),video:o("video"),wbr:o("wbr"),circle:o("circle"),clipPath:o("clipPath"),defs:o("defs"),ellipse:o("ellipse"),g:o("g"),image:o("image"),line:o("line"),linearGradient:o("linearGradient"),mask:o("mask"),path:o("path"),pattern:o("pattern"),polygon:o("polygon"),polyline:o("polyline"),radialGradient:o("radialGradient"),rect:o("rect"),stop:o("stop"),svg:o("svg"),text:o("text"),tspan:o("tspan")};e.exports=i},{8:8}],8:[function(t,e,n){"use strict";function r(t){return void 0!==t.ref}function o(t){return void 0!==t.key}var i=t(26),a=t(6),u=(t(25),t(14),Object.prototype.hasOwnProperty),s=t(9),c={key:!0,ref:!0,__self:!0,__source:!0},l=function(t,e,n,r,o,i,a){return{$$typeof:s,type:t,key:e,ref:n,props:a,_owner:i}};l.createElement=function(t,e,n){var i,s={},f=null,p=null;if(null!=e){r(e)&&(p=e.ref),o(e)&&(f=""+e.key),void 0===e.__self?null:e.__self,void 0===e.__source?null:e.__source;for(i in e)u.call(e,i)&&!c.hasOwnProperty(i)&&(s[i]=e[i])}var d=arguments.length-2;if(1===d)s.children=n;else if(d>1){for(var y=Array(d),h=0;h<d;h++)y[h]=arguments[h+2];s.children=y}if(t&&t.defaultProps){var m=t.defaultProps;for(i in m)void 0===s[i]&&(s[i]=m[i])}return l(t,f,p,0,0,a.current,s)},l.createFactory=function(t){var e=l.createElement.bind(null,t);return e.type=t,e},l.cloneAndReplaceKey=function(t,e){return l(t.type,e,t.ref,t._self,t._source,t._owner,t.props)},l.cloneElement=function(t,e,n){var s,f=i({},t.props),p=t.key,d=t.ref,y=(t._self,t._source,t._owner);if(null!=e){r(e)&&(d=e.ref,y=a.current),o(e)&&(p=""+e.key);var h;t.type&&t.type.defaultProps&&(h=t.type.defaultProps);for(s in e)u.call(e,s)&&!c.hasOwnProperty(s)&&(void 0===e[s]&&void 0!==h?f[s]=h[s]:f[s]=e[s])}var m=arguments.length-2;if(1===m)f.children=n;else if(m>1){for(var v=Array(m),b=0;b<m;b++)v[b]=arguments[b+2];f.children=v}return l(t.type,p,d,0,0,y,f)},l.isValidElement=function(t){return"object"==typeof t&&null!==t&&t.$$typeof===s},e.exports=l},{14:14,25:25,26:26,6:6,9:9}],9:[function(t,e,n){"use strict";var r="function"==typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103;e.exports=r},{}],10:[function(t,e,n){"use strict";var r=(t(25),{isMounted:function(t){return!1},enqueueCallback:function(t,e){},enqueueForceUpdate:function(t){},enqueueReplaceState:function(t,e){},enqueueSetState:function(t,e){}});e.exports=r},{25:25}],11:[function(t,e,n){"use strict";var r=t(8),o=r.isValidElement,i=t(28);e.exports=i(o)},{28:28,8:8}],12:[function(t,e,n){"use strict";var r=t(26),o=t(3),i=r(o,{__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:{ReactCurrentOwner:t(6)}});e.exports=i},{26:26,3:3,6:6}],13:[function(t,e,n){"use strict";e.exports="15.6.1"},{}],14:[function(t,e,n){"use strict";e.exports=!1},{}],15:[function(t,e,n){"use strict";var r=t(4),o=r.Component,i=t(8),a=i.isValidElement,u=t(10),s=t(21);e.exports=s(o,a,u)},{10:10,21:21,4:4,8:8}],16:[function(t,e,n){"use strict";function r(t){var e=t&&(o&&t[o]||t[i]);if("function"==typeof e)return e}var o="function"==typeof Symbol&&Symbol.iterator,i="@@iterator";e.exports=r},{}],17:[function(t,e,n){"use strict";var r=function(){};e.exports=r},{}],18:[function(t,e,n){"use strict";function r(t){return i.isValidElement(t)||o("143"),t}var o=t(19),i=t(8);t(24);e.exports=r},{19:19,24:24,8:8}],19:[function(t,e,n){"use strict";function r(t){for(var e=arguments.length-1,n="Minified React error #"+t+"; visit http://facebook.github.io/react/docs/error-decoder.html?invariant="+t,r=0;r<e;r++)n+="&args[]="+encodeURIComponent(arguments[r+1]);n+=" for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";var o=new Error(n);throw o.name="Invariant Violation",o.framesToPop=1,o}e.exports=r},{}],20:[function(t,e,n){"use strict";function r(t,e){return t&&"object"==typeof t&&null!=t.key?c.escape(t.key):e.toString(36)}function o(t,e,n,i){var p=typeof t;if("undefined"!==p&&"boolean"!==p||(t=null),null===t||"string"===p||"number"===p||"object"===p&&t.$$typeof===u)return n(i,t,""===e?l+r(t,0):e),1;var d,y,h=0,m=""===e?l:e+f;if(Array.isArray(t))for(var v=0;v<t.length;v++)d=t[v],y=m+r(d,v),h+=o(d,y,n,i);else{var b=s(t);if(b){var g,E=b.call(t);if(b!==t.entries)for(var x=0;!(g=E.next()).done;)d=g.value,y=m+r(d,x++),h+=o(d,y,n,i);else for(;!(g=E.next()).done;){var _=g.value;_&&(d=_[1],y=m+c.escape(_[0])+f+r(d,0),h+=o(d,y,n,i))}}else if("object"===p){var P=String(t);a("31","[object Object]"===P?"object with keys {"+Object.keys(t).join(", ")+"}":P,"")}}return h}function i(t,e,n){return null==t?0:o(t,"",e,n)}var a=t(19),u=(t(6),t(9)),s=t(16),c=(t(24),t(1)),l=(t(25),"."),f=":";e.exports=i},{1:1,16:16,19:19,24:24,25:25,6:6,9:9}],21:[function(t,e,n){"use strict";function r(t){return t}function o(t,e,n){function o(t,e){var n=b.hasOwnProperty(e)?b[e]:null;_.hasOwnProperty(e)&&u("OVERRIDE_BASE"===n,"ReactClassInterface: You are attempting to override `%s` from your class specification. Ensure that your method names do not overlap with React methods.",e),t&&u("DEFINE_MANY"===n||"DEFINE_MANY_MERGED"===n,"ReactClassInterface: You are attempting to define `%s` on your component more than once. This conflict may be due to a mixin.",e)}function c(t,n){if(n){u("function"!=typeof n,"ReactClass: You're attempting to use a component class or function as a mixin. Instead, just use a regular object."),u(!e(n),"ReactClass: You're attempting to use a component as a mixin. Instead, just use a regular object.");var r=t.prototype,i=r.__reactAutoBindPairs;n.hasOwnProperty(s)&&g.mixins(t,n.mixins);for(var a in n)if(n.hasOwnProperty(a)&&a!==s){var c=n[a],l=r.hasOwnProperty(a);if(o(l,a),g.hasOwnProperty(a))g[a](t,c);else{var f=b.hasOwnProperty(a),y="function"==typeof c,h=y&&!f&&!l&&!1!==n.autobind;if(h)i.push(a,c),r[a]=c;else if(l){var m=b[a];u(f&&("DEFINE_MANY_MERGED"===m||"DEFINE_MANY"===m),"ReactClass: Unexpected spec policy %s for key %s when mixing in component specs.",m,a),"DEFINE_MANY_MERGED"===m?r[a]=p(r[a],c):"DEFINE_MANY"===m&&(r[a]=d(r[a],c))}else r[a]=c}}}else;}function l(t,e){if(e)for(var n in e){var r=e[n];if(e.hasOwnProperty(n)){var o=n in g;u(!o,'ReactClass: You are attempting to define a reserved property, `%s`, that shouldn\'t be on the "statics" key. Define it as an instance property instead; it will still be accessible on the constructor.',n);var i=n in t;u(!i,"ReactClass: You are attempting to define `%s` on your component more than once. This conflict may be due to a mixin.",n),t[n]=r}}}function f(t,e){u(t&&e&&"object"==typeof t&&"object"==typeof e,"mergeIntoWithNoDuplicateKeys(): Cannot merge non-objects.");for(var n in e)e.hasOwnProperty(n)&&(u(void 0===t[n],"mergeIntoWithNoDuplicateKeys(): Tried to merge two objects with the same key: `%s`. This conflict may be due to a mixin; in particular, this may be caused by two getInitialState() or getDefaultProps() methods returning objects with clashing keys.",n),t[n]=e[n]);return t}function p(t,e){return function(){var n=t.apply(this,arguments),r=e.apply(this,arguments);if(null==n)return r;if(null==r)return n;var o={};return f(o,n),f(o,r),o}}function d(t,e){return function(){t.apply(this,arguments),e.apply(this,arguments)}}function y(t,e){var n=e.bind(t);return n}function h(t){for(var e=t.__reactAutoBindPairs,n=0;n<e.length;n+=2){var r=e[n],o=e[n+1];t[r]=y(t,o)}}function m(t){var e=r(function(t,r,o){this.__reactAutoBindPairs.length&&h(this),this.props=t,this.context=r,this.refs=a,this.updater=o||n,this.state=null;var i=this.getInitialState?this.getInitialState():null;u("object"==typeof i&&!Array.isArray(i),"%s.getInitialState(): must return an object or null",e.displayName||"ReactCompositeComponent"),this.state=i});e.prototype=new P,e.prototype.constructor=e,e.prototype.__reactAutoBindPairs=[],v.forEach(c.bind(null,e)),c(e,E),c(e,t),c(e,x),e.getDefaultProps&&(e.defaultProps=e.getDefaultProps()),u(e.prototype.render,"createClass(...): Class specification must implement a `render` method.");for(var o in b)e.prototype[o]||(e.prototype[o]=null);return e}var v=[],b={mixins:"DEFINE_MANY",statics:"DEFINE_MANY",propTypes:"DEFINE_MANY",contextTypes:"DEFINE_MANY",childContextTypes:"DEFINE_MANY",getDefaultProps:"DEFINE_MANY_MERGED",getInitialState:"DEFINE_MANY_MERGED",getChildContext:"DEFINE_MANY_MERGED",render:"DEFINE_ONCE",componentWillMount:"DEFINE_MANY",componentDidMount:"DEFINE_MANY",componentWillReceiveProps:"DEFINE_MANY",shouldComponentUpdate:"DEFINE_ONCE",componentWillUpdate:"DEFINE_MANY",componentDidUpdate:"DEFINE_MANY",componentWillUnmount:"DEFINE_MANY",updateComponent:"OVERRIDE_BASE"},g={displayName:function(t,e){t.displayName=e},mixins:function(t,e){if(e)for(var n=0;n<e.length;n++)c(t,e[n])},childContextTypes:function(t,e){t.childContextTypes=i({},t.childContextTypes,e)},contextTypes:function(t,e){t.contextTypes=i({},t.contextTypes,e)},getDefaultProps:function(t,e){t.getDefaultProps?t.getDefaultProps=p(t.getDefaultProps,e):t.getDefaultProps=e},propTypes:function(t,e){t.propTypes=i({},t.propTypes,e)},statics:function(t,e){l(t,e)},autobind:function(){}},E={componentDidMount:function(){this.__isMounted=!0}},x={componentWillUnmount:function(){this.__isMounted=!1}},_={replaceState:function(t,e){this.updater.enqueueReplaceState(this,t,e)},isMounted:function(){return!!this.__isMounted}},P=function(){};return i(P.prototype,t.prototype,_),m}var i=t(26),a=t(23),u=t(24),s="mixins";e.exports=o},{23:23,24:24,25:25,26:26}],22:[function(t,e,n){"use strict";function r(t){return function(){return t}}var o=function(){};o.thatReturns=r,o.thatReturnsFalse=r(!1),o.thatReturnsTrue=r(!0),o.thatReturnsNull=r(null),o.thatReturnsThis=function(){return this},o.thatReturnsArgument=function(t){return t},e.exports=o},{}],23:[function(t,e,n){"use strict";var r={};e.exports=r},{}],24:[function(t,e,n){"use strict";function r(t,e,n,r,i,a,u,s){if(o(e),!t){var c;if(void 0===e)c=new Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");else{var l=[n,r,i,a,u,s],f=0;c=new Error(e.replace(/%s/g,function(){return l[f++]})),c.name="Invariant Violation"}throw c.framesToPop=1,c}}var o=function(t){};e.exports=r},{}],25:[function(t,e,n){"use strict";var r=t(22),o=r;e.exports=o},{22:22}],26:[function(t,e,n){"use strict";function r(t){if(null===t||void 0===t)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(t)}var o=Object.getOwnPropertySymbols,i=Object.prototype.hasOwnProperty,a=Object.prototype.propertyIsEnumerable;e.exports=function(){try{if(!Object.assign)return!1;var t=new String("abc");if(t[5]="de","5"===Object.getOwnPropertyNames(t)[0])return!1;for(var e={},n=0;n<10;n++)e["_"+String.fromCharCode(n)]=n;if("0123456789"!==Object.getOwnPropertyNames(e).map(function(t){return e[t]}).join(""))return!1;var r={};return"abcdefghijklmnopqrst".split("").forEach(function(t){r[t]=t}),"abcdefghijklmnopqrst"===Object.keys(Object.assign({},r)).join("")}catch(t){return!1}}()?Object.assign:function(t,e){for(var n,u,s=r(t),c=1;c<arguments.length;c++){n=Object(arguments[c]);for(var l in n)i.call(n,l)&&(s[l]=n[l]);if(o){u=o(n);for(var f=0;f<u.length;f++)a.call(n,u[f])&&(s[u[f]]=n[u[f]])}}return s}},{}],27:[function(t,e,n){"use strict";function r(t,e,n,r,o){}e.exports=r},{24:24,25:25,30:30}],28:[function(t,e,n){"use strict";var r=t(29);e.exports=function(t){return r(t,!1)}},{29:29}],29:[function(t,e,n){"use strict";var r=t(22),o=t(24),i=t(25),a=t(30),u=t(27);e.exports=function(t,e){function n(t){var e=t&&(w&&t[w]||t[N]);if("function"==typeof e)return e}function s(t,e){return t===e?0!==t||1/t==1/e:t!==t&&e!==e}function c(t){this.message=t,this.stack=""}function l(t){function n(n,r,i,u,s,l,f){if(u=u||A,l=l||i,f!==a)if(e)o(!1,"Calling PropTypes validators directly is not supported by the `prop-types` package. Use `PropTypes.checkPropTypes()` to call them. Read more at http://fb.me/use-check-prop-types");else;return null==r[i]?n?new c(null===r[i]?"The "+s+" `"+l+"` is marked as required in `"+u+"`, but its value is `null`.":"The "+s+" `"+l+"` is marked as required in `"+u+"`, but its value is `undefined`."):null:t(r,i,u,s,l)}var r=n.bind(null,!1);return r.isRequired=n.bind(null,!0),r}function f(t){function e(e,n,r,o,i,a){var u=e[n];if(E(u)!==t)return new c("Invalid "+o+" `"+i+"` of type `"+x(u)+"` supplied to `"+r+"`, expected `"+t+"`.");return null}return l(e)}function p(t){function e(e,n,r,o,i){if("function"!=typeof t)return new c("Property `"+i+"` of component `"+r+"` has invalid PropType notation inside arrayOf.");var u=e[n];if(!Array.isArray(u)){return new c("Invalid "+o+" `"+i+"` of type `"+E(u)+"` supplied to `"+r+"`, expected an array.")}for(var s=0;s<u.length;s++){var l=t(u,s,r,o,i+"["+s+"]",a);if(l instanceof Error)return l}return null}return l(e)}function d(t){function e(e,n,r,o,i){if(!(e[n]instanceof t)){var a=t.name||A;return new c("Invalid "+o+" `"+i+"` of type `"+P(e[n])+"` supplied to `"+r+"`, expected instance of `"+a+"`.")}return null}return l(e)}function y(t){function e(e,n,r,o,i){for(var a=e[n],u=0;u<t.length;u++)if(s(a,t[u]))return null;return new c("Invalid "+o+" `"+i+"` of value `"+a+"` supplied to `"+r+"`, expected one of "+JSON.stringify(t)+".")}return Array.isArray(t)?l(e):r.thatReturnsNull}function h(t){function e(e,n,r,o,i){if("function"!=typeof t)return new c("Property `"+i+"` of component `"+r+"` has invalid PropType notation inside objectOf.");var u=e[n],s=E(u);if("object"!==s)return new c("Invalid "+o+" `"+i+"` of type `"+s+"` supplied to `"+r+"`, expected an object.");for(var l in u)if(u.hasOwnProperty(l)){var f=t(u,l,r,o,i+"."+l,a);if(f instanceof Error)return f}return null}return l(e)}function m(t){function e(e,n,r,o,i){for(var u=0;u<t.length;u++){if(null==(0,t[u])(e,n,r,o,i,a))return null}return new c("Invalid "+o+" `"+i+"` supplied to `"+r+"`.")}if(!Array.isArray(t))return r.thatReturnsNull;for(var n=0;n<t.length;n++){var o=t[n];if("function"!=typeof o)return i(!1,"Invalid argument supplid to oneOfType. Expected an array of check functions, but received %s at index %s.",_(o),n),r.thatReturnsNull}return l(e)}function v(t){function e(e,n,r,o,i){var u=e[n],s=E(u);if("object"!==s)return new c("Invalid "+o+" `"+i+"` of type `"+s+"` supplied to `"+r+"`, expected `object`.");for(var l in t){var f=t[l];if(f){var p=f(u,l,r,o,i+"."+l,a);if(p)return p}}return null}return l(e)}function b(e){switch(typeof e){case"number":case"string":case"undefined":return!0;case"boolean":return!e;case"object":if(Array.isArray(e))return e.every(b);if(null===e||t(e))return!0;var r=n(e);if(!r)return!1;var o,i=r.call(e);if(r!==e.entries){for(;!(o=i.next()).done;)if(!b(o.value))return!1}else for(;!(o=i.next()).done;){var a=o.value;if(a&&!b(a[1]))return!1}return!0;default:return!1}}function g(t,e){return"symbol"===t||("Symbol"===e["@@toStringTag"]||"function"==typeof Symbol&&e instanceof Symbol)}function E(t){var e=typeof t;return Array.isArray(t)?"array":t instanceof RegExp?"object":g(e,t)?"symbol":e}function x(t){if(void 0===t||null===t)return""+t;var e=E(t);if("object"===e){if(t instanceof Date)return"date";if(t instanceof RegExp)return"regexp"}return e}function _(t){var e=x(t);switch(e){case"array":case"object":return"an "+e;case"boolean":case"date":case"regexp":return"a "+e;default:return e}}function P(t){return t.constructor&&t.constructor.name?t.constructor.name:A}var w="function"==typeof Symbol&&Symbol.iterator,N="@@iterator",A="<<anonymous>>",O={array:f("array"),bool:f("boolean"),func:f("function"),number:f("number"),object:f("object"),string:f("string"),symbol:f("symbol"),any:function(){return l(r.thatReturnsNull)}(),arrayOf:p,element:function(){function e(e,n,r,o,i){var a=e[n];if(!t(a)){return new c("Invalid "+o+" `"+i+"` of type `"+E(a)+"` supplied to `"+r+"`, expected a single ReactElement.")}return null}return l(e)}(),instanceOf:d,node:function(){function t(t,e,n,r,o){return b(t[e])?null:new c("Invalid "+r+" `"+o+"` supplied to `"+n+"`, expected a ReactNode.")}return l(t)}(),objectOf:h,oneOf:y,oneOfType:m,shape:v};return c.prototype=Error.prototype,O.checkPropTypes=u,O.PropTypes=O,O}},{22:22,24:24,25:25,27:27,30:30}],30:[function(t,e,n){"use strict";e.exports="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"},{}]},{},[12])(12)});
})
/* globals window, moduleExec, Module, path, moduleDB */
const global = window;

global.moduleExec = moduleExec;
global.Module = Module;
global.path = path;
global.moduleDB = moduleDB;
moduleExec('/Users/maximsmol/projects/js/sic/test/main.js');
})();
