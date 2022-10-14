;window.Modernizr=function(a,b,c){function t(a){i.cssText=a}function u(a,b){return t(prefixes.join(a+";")+(b||""))}function v(a,b){return typeof a===b}function w(a,b){return!!~(""+a).indexOf(b)}function x(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:v(f,"function")?f.bind(d||b):f}return!1}var d="2.8.3",e={},f=b.documentElement,g="modernizr",h=b.createElement(g),i=h.style,j,k={}.toString,l={},m={},n={},o=[],p=o.slice,q,r={}.hasOwnProperty,s;!v(r,"undefined")&&!v(r.call,"undefined")?s=function(a,b){return r.call(a,b)}:s=function(a,b){return b in a&&v(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=p.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(p.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(p.call(arguments)))};return e});for(var y in l)s(l,y)&&(q=y.toLowerCase(),e[q]=l[y](),o.push((e[q]?"":"no-")+q));return e.addTest=function(a,b){if(typeof a=="object")for(var d in a)s(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof enableClasses!="undefined"&&enableClasses&&(f.className+=" "+(b?"":"no-")+a),e[a]=b}return e},t(""),h=j=null,e._version=d,e}(this,this.document),Modernizr.addTest("adownload","download"in document.createElement("a")),Modernizr.addTest("filereader",function(){return!!(window.File&&window.FileList&&window.FileReader)});
(function() {
    'use strict';

    window.JSFile = window.JSFile || {};

})();

window.JSFile = window.JSFile || {};

(function(module) {
    'use strict';

    // supported file types

    module.supported_file_types = {
        txt: 'text/plain',
        csv: 'text/csv',
        xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        xls: 'application/vnd.ms-excel',
        ods: 'application/vnd.oasis.opendocument.spreadsheet'
    };

})(window.JSFile);

window.JSFile = window.JSFile || {};

(function(module) {
    'use strict';

    /**
     * FileUtil Class
     *
     * @constructor
     */
    var FileUtil = function() {

        var self = this;
        var message_prefix = "FileUtil: ";

        this.MESSAGE_UNSUPPORTED_FILE_MIMETYPE      = message_prefix + "file mimetype is not supported";
        this.MESSAGE_UNSUPPORTED_FILE_EXTENSION     = message_prefix + "file extension is not supported";
        this.MESSAGE_FILE_NAME_IS_REQUIRED          = message_prefix + "file_name is required";
        this.MESSAGE_FILE_EXTENSION_MISMATCH        = message_prefix + "the extension contained in the file_name argument does not match the file_extension argument";
        this.MESSAGE_FILE_EXTENSION_IS_REQUIRED     = message_prefix + "an file extension must be provided, either as part of the filename or as the file_extension argument";

        // data alternatives (these will be used as replacements for missing data)

        var data_alternatives = {
            sheet: {
                columns:    [],
                data:       [],
                headers:    [],
                name:       []
            },
            headers: {
                colspan:    ['cols'],
                rowspan:    ['rows'],
                value:      ['display_name', 'name', 'label']
            },
            columns: {
                type:       []
            }
        };

        ///////////////////////////////////////////////////////////
        //
        // public methods
        //
        ///////////////////////////////////////////////////////////

        /**
         * transformData
         *
         * @param data
         */
        this.transformData = function(data) {

            // convert root to indexed array
            if (!_.isArray(data)) {
                data = [data];
            }

            // loop sheets
            _.forEach(data, function (item, index) {

                // transform sheet
                data[index] = transformSheet(item, index);

                // headers should contain array of rows
                if (!_.isArray(item.headers[0])) {
                    data[index].headers = [item.headers];
                }

                // headers
                _.forEach(data[index].headers, function (item_header_rows, header_row_index) {

                    // columns
                    _.forEach(item_header_rows, function(item_header_column, header_column_index) {

                        // transform
                        data[index].headers[header_row_index][header_column_index] = transformHeader(item_header_column);

                    });
                });
            });

            return data;
        };

        /**
         * transformFilenameAndExtension
         *
         * @param filename
         * @param file_extension
         * @returns {*}
         */
        this.transformFilenameAndExtension = function(filename, file_extension) {

            if (_.isUndefined(filename) || _.isNull(filename) || filename === "") {
                throw new Error(this.MESSAGE_FILE_NAME_IS_REQUIRED);
            }

            if (!_.isUndefined(file_extension) && !_.includes(_.keys(module.supported_file_types), file_extension)) {
                throw new Error(this.MESSAGE_UNSUPPORTED_FILE_EXTENSION);
            }

            // search filename for extension
            var file_name_extension = /[^.]+$/.exec(filename);

            // if possible filename extension matches supported extensions, then extract
            if (_.includes(_.keys(module.supported_file_types), file_name_extension[0])) {

                // extension found in file_name does not match file_extension
                if (!_.isUndefined(file_extension) && file_name_extension[0] !== file_extension) {
                    throw new Error(this.MESSAGE_FILE_EXTENSION_MISMATCH);
                }

                // remove extension from filename
                filename  = /(.*)\.[^.]+$/.exec(filename)[1];

                // set file_extension
                file_extension = file_name_extension[0];
            }

            // if filename extension does not match supported extensions and no file_extension was provided
            else if (_.isUndefined(file_extension)) {
                throw new Error(this.MESSAGE_FILE_EXTENSION_IS_REQUIRED);
            }

            // add extension to filename
            filename += '.' + file_extension;

            return {
                filename: filename,
                file_extension: file_extension
            };
        };

        /**
         * nextLetter
         *
         * @param letter
         * @param increment
         * @returns {*}
         */
        this.nextLetter = function(letter, increment) {

            if (_.isUndefined(increment)) {
                increment = 1;
            }

            return letter.replace(/([a-zA-Z])[^a-zA-Z]*$/, function(arr) {
                var char = arr.charCodeAt(0);
                switch(char){
                    case 90: return 'A';
                    case 122: return 'a';
                    default: return String.fromCharCode((char + increment));
                }
            });
        };

        /**
         * letterToNumber
         *
         * @param letter
         * @returns {number}
         */
        this.letterToNumber = function(letter) {
            if (letter === letter.toLowerCase()) {
                return letter.charCodeAt(0) - 96;
            }
            return letter.charCodeAt(0) - 64;
        };

        /**
         * numberToLetter
         *
         * @param number
         * @param uppercase
         * @returns {letter}
         */
        this.numberToLetter = function(number, uppercase) {
            if (uppercase) {
                return String.fromCharCode(number + 64);
            }
            return String.fromCharCode(number + 96);
        };

        /**
         * transformWorksheetHeadersArray
         * inserts blank items based on rowspans & colspans
         *
         * @param headers
         * @returns {Array}
         */
        this.transformWorksheetHeadersArray = function(headers) {
            var temp = _.cloneDeep(headers);

            _.forEach(headers, function (row, row_index) {
                var column_index_offset = 0;

                _.forEach(row, function (column, column_index) {

                    // add rows
                    if (column.rowspan > 1) {

                        for (var row_count = 1; row_count < column.rowspan; row_count++) {

                            var next_row = row_index + row_count;

                            // create next row if does not exist
                            if (!_.has(temp, next_row)) {
                                temp[next_row] = [];

                                // create next row columns
                                for (var i = 0; i < column_index + column_index_offset; i++) {
                                    temp[next_row].push({});
                                }
                            }

                            // splice into next row
                            temp[next_row].splice(column_index + column_index_offset, 0, {});
                        }
                    }

                    // add columns
                    if (column.colspan > 1) {

                        for (var column_count = 1; column_count < column.colspan; column_count++) {

                            var next_column = column_index + column_index_offset + column_count;
                            // splice into next column
                            temp[row_index].splice(next_column, 0, {});
                        }

                        column_index_offset += column.colspan - 1;
                    }
                });
            });

            return temp;
        };

        /**
         * convertWorksheetHeadersArrayToObject
         *
         * @param headers
         * @returns {{}}
         */
        this.convertWorksheetHeadersArrayToObject = function(headers) {

            var result = {};

            _.forEach(headers, function (row, row_index) {

                var letter = "A";

                _.forEach(row, function(column) {

                    // add value (if exists)
                    if (_.has(column, 'value')) {
                        result[letter + (row_index + 1)] = column.value;
                    }

                    // increment letter
                    letter = self.nextColumn(letter);
                });

            });

            return result;
        };

        /**
         * calculateWorksheetHeadersMerges
         *
         * @param headers
         * @returns {Array}
         */
        this.calculateWorksheetHeadersMerges = function(headers) {

            var result = [];

            _.forEach(headers, function (row, row_index) {
                _.forEach(row, function (column, column_index) {

                    // if has rowspan or colspan greater than 1
                    if ((_.has(column, 'rowspan') && column.rowspan > 1) || (_.has(column, 'colspan') && column.colspan > 1)) {

                        result.push({
                            s: {c: column_index, r: row_index}, // start
                            e: {c: column_index + (column.colspan - 1), r: row_index + (column.rowspan - 1)}  // end
                        });
                    }
                });
            });

            return result;
        };

        /**
         * getFileExtension
         *
         * @param mimetype
         * @returns {*}
         */
        this.getFileExtension = function(file_extension, file_mimetype) {
            if (!_.includes(_.values(module.supported_file_types), file_mimetype)) {
                throw new Error(this.MESSAGE_UNSUPPORTED_FILE_MIMETYPE);
            }

            var type = _.findKey(module.supported_file_types, function(n) {
                return n === file_mimetype;
            });

            // windows always sends csv as the same mime type of xls
            if (navigator.platform.indexOf('Win') !== -1 && file_extension === 'csv' && type === 'xls') {
                return file_extension;
            }

            return type;
        };

        /**
         * getFileMimeType
         *
         * @param file_extension
         * @returns {*}
         */
        this.getFileMimeType = function(file_extension) {

            if (!_.includes(_.keys(module.supported_file_types), file_extension)) {
                throw new Error(this.MESSAGE_UNSUPPORTED_FILE_EXTENSION);
            }

            return module.supported_file_types[file_extension];
        };

        ///////////////////////////////////////////////////////////
        //
        // private methods
        //
        ///////////////////////////////////////////////////////////

        /**
         * transformSheet
         *
         * @param data
         * @param index
         */
        var transformSheet = function(data, index) {

            // get keys
            var keys = _.keys(data);

            // name
            if (!_.has(data, 'columns') || _.isUndefined(data.columns)) {
                data.columns = findAlternativeData(data, keys, data_alternatives.sheet.columns, []);
            }
            // data
            if (!_.has(data, 'data') || _.isUndefined(data.data)) {
                data.data = findAlternativeData(data, keys, data_alternatives.sheet.data, []);
            }
            // headers
            if (!_.has(data, 'headers') || _.isUndefined(data.headers)) {
                data.headers = findAlternativeData(data, keys, data_alternatives.sheet.headers, []);
            }
            // name
            if (!_.has(data, 'name') || _.isUndefined(data.name)) {
                data.name = findAlternativeData(data, keys, data_alternatives.sheet.name, "sheet" + (index + 1));
            }

            return {
                columns:    data.columns,
                data:       data.data,
                headers:    data.headers,
                name:       data.name
            };
        };

        /**
         * transformHeader
         *
         * @param data
         */
        var transformHeader = function(data) {

            var _data = {};
            var keys = [];

            // loop fields

            _.forEach(data, function (item, key) {

                // convert item keys & values to snake case
                if (!_.isObject(item)) {
                    var k     = _.snakeCase(key);
                    _data[k]  = item;
                    keys.push(k);
                }
            });

            // value
            if (!_.has(_data, 'value')) {
                _data.value = findAlternativeData(_data, keys, data_alternatives.headers.value);
            }
            // rowspan
            if (!_.has(_data, 'rowspan')) {
                _data.rowspan = parseInt(findAlternativeData(_data, keys, data_alternatives.headers.rowspan, 1));
            }
            // colspan
            if (!_.has(_data, 'colspan')) {
                _data.colspan = parseInt(findAlternativeData(_data, keys, data_alternatives.headers.colspan, 1));
            }

            return {
                value:      _data.value,
                rowspan:    _data.rowspan,
                colspan:    _data.colspan
            };
        };

        /**
         * findAlternativeData
         *
         * @param data
         * @param keys
         * @param alternatives
         * @param default_value
         * @returns {*}
         */
        var findAlternativeData = function(data, keys, alternatives, default_value) {

            var result = !_.isUndefined(default_value) ? default_value : "";

            _.forEach(alternatives, function (alternative) {

                if (_.includes(keys, alternative)) {
                    result = data[alternative];
                    return false; // break
                }
            });

            return result;
        };

        this.nextColumn = function(currentColumn) {
            //Logic only works upto two series column - A ... ZZ
            //As it supports around 702 columns, in which practically we wouldn't hit

            var charCode;

            // convert letter to upper case
            currentColumn = currentColumn.toUpperCase();
            var nxtColumn = "";

            if(currentColumn.length > 2) {
                console.warn("Only 702 columns are supported");
            }

            if(currentColumn[currentColumn.length -1] === "Z" ) {
                // Generate unicode value for given character
                charCode = currentColumn.charCodeAt(0);
                var suffix = "A";
                if(charCode < 90) {
                    // Convert integer to character
                    nxtColumn = String.fromCharCode(charCode + 1)  + suffix;
                } else {
                    suffix += "A";
                    nxtColumn = suffix;
                }

            } else {
                // Generate unicode value for given character
                charCode = currentColumn[currentColumn.length -1].charCodeAt(0);
                var prefix = currentColumn.slice(0, -1);
                // Convert integer to character
                nxtColumn = prefix + String.fromCharCode(charCode + 1);
            }

            return nxtColumn;
        };
    };

    // create singleton
    module.FileUtil = new FileUtil();

})(window.JSFile);

window.JSFile = window.JSFile || {};

(function(module) {
    'use strict';

    /**
     * Workbook Model
     *
     * @param data
     * @constructor
     */
    module.Workbook = function(data) {

        var MESSAGE_DATA_IS_REQUIRED = "data param is required for Workbook model";

        if (_.isUndefined(data) || _.isNull(data)) {
            throw new Error(MESSAGE_DATA_IS_REQUIRED);
        }

        var self = this;

        this.SheetNames = [];
        this.Sheets = {};

        // transform data
        data = module.FileUtil.transformData(data);

        // sheets
        _.forEach(data, function(sheet) {

            self.SheetNames.push(sheet.name);
            self.Sheets[sheet.name] = new module.Worksheet(sheet);
        });
    };

})(window.JSFile);

window.JSFile = window.JSFile || {};

(function(module) {
    'use strict';

    /**
     * Worksheet Model
     *
     * @param data
     * @constructor
     */
    module.Worksheet = function(data) {

        var MESSAGE_DATA_IS_REQUIRED = "data param is required for Worksheet model";

        if (_.isUndefined(data) || _.isNull(data)) {
            throw new Error(MESSAGE_DATA_IS_REQUIRED);
        }

        var self = this;

        this['!merges'] = [];
        this['!ref'] = [];

        // transform headers array
        var headers = module.FileUtil.transformWorksheetHeadersArray(data.headers);

        // count letters
        var letter_count = [];
        _.forEach(headers, function (item) {
            letter_count.push(item.length);
        });

        // calculate worksheet merges
        this['!merges'] = module.FileUtil.calculateWorksheetHeadersMerges(headers);

        // set body row starting point
        var cell_number = headers.length + 1;

        // convert header array to object
        headers = module.FileUtil.convertWorksheetHeadersArrayToObject(headers);

        // set worksheet header data
        _.forEach(headers, function (value, key) {

            // TODO: add column type support (new module.WorksheetCell({type: "s"})
            self[key] = new module.WorksheetCell({type: 's', value: value});
        });

        // set worksheet body data

        _.forEach(data.data, function(row) {

            var cell_letter = 'A';
            var _letter_count = 0;

            _.forEach(row, function(item) {

                // add data
                self[cell_letter + cell_number] = new module.WorksheetCell({type: 's', value: item.value});

                // increment letter
                //cell_letter = module.FileUtil.nextLetter(cell_letter);
                cell_letter = module.FileUtil.nextColumn(cell_letter);

                // count letters
                _letter_count++;
            });

            letter_count.push(_letter_count);

            // increment cell number
            cell_number++;
        });

        // get highest letter
        var highest_letter = _.max(letter_count);

        // set worksheet range
        this['!ref'] = XLSX.utils.encode_range({
            s: {c: 0, r: 0}, // start
            e: {c: (highest_letter - 1), r: (cell_number - 2)} // end
        });

    };

})(window.JSFile);

window.JSFile = window.JSFile || {};

(function(module) {
    'use strict';

    /**
     * WorksheetCell Model
     *
     * @param data
     * @constructor
     */
    module.WorksheetCell = function(data) {

        var MESSAGE_DATA_IS_REQUIRED = "data param is required for WorksheetCell model";
        var MESSAGE_VALUE_IS_REQUIRED = "data.value param is required for WorksheetCell model";

        if (_.isUndefined(data) || _.isNull(data)) {
            throw new Error(MESSAGE_DATA_IS_REQUIRED);
        }
        if (!_.has(data, 'value')) {
            throw new Error(MESSAGE_VALUE_IS_REQUIRED);
        }

        this.t = _.has(data, 'type') ? data.type : 's';
        this.v = '';

        if (data.value !== null) {
            this.v = data.value;
        }
    };

})(window.JSFile);

(function() {
    'use strict';

    // dependency checks
    if (typeof window._ === 'undefined') {
        throw new Error("Please include Lodash (https://github.com/lodash/lodash)");
    }
    if (typeof window.XLSX === 'undefined') {
        throw new Error("Please include js-xlsx (https://github.com/SheetJS/js-xlsx)");
    }
    if (typeof window.Blob === 'undefined') {
        throw new Error("Please include blob (https://github.com/eligrey/Blob.js/)");
    }
})();

window.JSFile = window.JSFile || {};

(function(module) {
    'use strict';

    /**
     * FileDownloader Class
     *
     * @constructor
     */
    var FileDownloader = function() {

        var self = this;
        var message_prefix = "FileDownloader: ";

        this.MESSAGE_WORKBOOK_IS_REQUIRED       = message_prefix + "workbook param is required for FileDownloader.downloadWorkbook";
        this.MESSAGE_WORKBOOK_MODEL_IS_INVALID  = message_prefix + "workbook param must be an instance of JSFile.Workbook";
        this.MESSAGE_FILE_NAME_IS_REQUIRED      = message_prefix + "file_name is required";
        this.CURRENTLY_UNSUPPORTED_FILE_TYPE    = message_prefix + "this file type is currently not supported.";
        this.UNSUPPORTED_BROWSER_FEATURE_AND_NO_FALLBACK = message_prefix + "browser does support the required feature and no fallback method was provided";

        ///////////////////////////////////////////////////////////
        //
        // public methods
        //
        ///////////////////////////////////////////////////////////

        /**
         * downloadWorkbook
         *
         * @param workbook
         * @param filename
         * @param file_extension
         */
        this.downloadWorkbook = function(workbook, filename, file_extension) {

            // validate args
            if (_.isUndefined(workbook) || _.isNull(workbook)) {
                throw new Error(this.MESSAGE_WORKBOOK_IS_REQUIRED);
            }
            if (!(workbook instanceof module.Workbook)) {
                throw new Error(this.MESSAGE_WORKBOOK_MODEL_IS_INVALID);
            }
            if (_.isUndefined(filename) || _.isNull(filename) || filename === "") {
                throw new Error(this.MESSAGE_FILE_NAME_IS_REQUIRED);
            }

            // transform file data (name & extension)
            var file_data = module.FileUtil.transformFilenameAndExtension(filename, file_extension);

            // create file array buffer
            var file_array_buffer_string = this.create_file_handlers[file_data.file_extension](workbook, file_data.file_extension);

            // get file mime_type
            var file_mimetype = module.FileUtil.getFileMimeType(file_data.file_extension);

            // initiate download
            initiateFileDownload(file_array_buffer_string, file_data.filename, file_mimetype);
        };

        ///////////////////////////////////////////////////////////
        //
        // private methods
        //
        ///////////////////////////////////////////////////////////

        /**
         * convertStringToArrayBuffer
         *
         * @param str
         * @returns {ArrayBuffer}
         */
        var convertStringToArrayBuffer = function(str) {
            var array_buffer = new ArrayBuffer(str.length);
            var view = new Uint8Array(array_buffer);
            for (var i = 0; i !== str.length; ++i) {
                view[i] = str.charCodeAt(i) & 0xFF;
            }
            return array_buffer;
        };

        /**
         * createXlsxFile
         *
         * @param workbook
         * @param file_extension
         */
        var createXlsxFile = function(workbook, file_extension) {
            return XLSX.write(workbook, {bookType: file_extension, bookSST: false, type: 'binary'});
        };

        /**
         * createOdsFile
         *
         * @param workbook
         * @param file_extension
         */
        var createOdsFile = function() {
            throw new Error(this.CURRENTLY_UNSUPPORTED_FILE_TYPE);
        };

        /**
         * createXlsFile
         *
         * @param workbook
         * @param file_extension
         */
        var createXlsFile = function() {
            throw new Error(this.CURRENTLY_UNSUPPORTED_FILE_TYPE);
        };

        /**
         * createTxtFile
         *
         * @param workbook
         * @param file_extension
         */
        var createTxtFile = function() {
            throw new Error(this.CURRENTLY_UNSUPPORTED_FILE_TYPE);
        };

        /**
         * createCsvFile
         *
         * @param workbook
         * @param file_extension
         */
        var createCsvFile = function() {
            throw new Error(this.CURRENTLY_UNSUPPORTED_FILE_TYPE);
        };

        /**
         * initiateFileDownload
         *
         * @param array_buffer
         * @param filename
         * @param file_mimetype
         */
        var initiateFileDownload = function(file_array_buffer_string, filename, file_mimetype) {
            var file_array_buffer = convertStringToArrayBuffer(file_array_buffer_string);

            // create Blob
            var blob = new Blob([file_array_buffer], {type: file_mimetype});

            // Blob is natively supported by all but ie8 & ie9
            // Blob.js creates a shim for ie8 & ie9
            // TODO: add seperate handling for text & csv

            // if browser is IE10+
            if (window.navigator.msSaveBlob) {

                // initiate ie10 download
                return window.navigator.msSaveBlob(blob, filename);
            }

            // adownload is not supported by browser (ie8, ie9, Safari)
            if (!Modernizr.adownload || !window.saveAs) {

                // no initiateFileDownloadFallback method is defined
                if (_.isUndefined(self.initiateFileDownloadFallback)) {
                    throw new Error(self.UNSUPPORTED_BROWSER_FEATURE_AND_NO_FALLBACK);
                }

                // call initiate download fallback
                return self.initiateFileDownloadFallback(blob, filename, file_array_buffer_string);
            }

            // initiate download
            return window.saveAs(blob, filename);
        };

        ///////////////////////////////////////////////////////////
        //
        // init
        //
        ///////////////////////////////////////////////////////////

        // handlers mapped by file type

        this.create_file_handlers = {
            xlsx:   createXlsxFile,
            ods:    createOdsFile,
            xls:    createXlsFile,
            txt:    createTxtFile,
            csv:    createCsvFile
        };
    };

    module.FileDownloader = new FileDownloader();

})(window.JSFile);

(function() {
    'use strict';

    // dependency checks
    if (typeof window._ === 'undefined') {
        throw new Error("Please include Lodash (https://github.com/lodash/lodash)");
    }
    if (typeof window.XLSX === 'undefined') {
        throw new Error("Please include js-xlsx (https://github.com/SheetJS/js-xlsx)");
    }
})();

window.JSFile = window.JSFile || {};

(function(module) {
    'use strict';

    /**
     * FileReader Class
     *
     * @constructor
     */
    var FileReader = function() {
        var message_prefix = "FileReader: ";

        this.MESSAGE_FILE_DATA_IS_REQUIRED  = message_prefix + "file_data param is required";
        this.MESSAGE_FILE_TYPE_IS_REQUIRED  = message_prefix + "file_type param is required";
        this.MESSAGE_UNSUPPORTED_FILE_TYPE  = message_prefix + "file type is not supported";
        this.MESSAGE_FILE_READ_ERROR        = message_prefix + "could not read file. Either file data is invalid, or file_type does not match file_data.";

        ///////////////////////////////////////////////////////////
        //
        // public methods
        //
        ///////////////////////////////////////////////////////////

        /**
         * getWorksheetNames
         *
         * @param file_data
         * @param file_type
         * @returns {*}
         */
        this.getWorksheetNames = function (file_data, file_type) {

            // validate args
            if (_.isUndefined(file_data) || _.isNull(file_data)) {
                throw new Error(this.MESSAGE_FILE_DATA_IS_REQUIRED);
            }
            if (_.isUndefined(file_type) || _.isNull(file_type)) {
                throw new Error(this.MESSAGE_FILE_TYPE_IS_REQUIRED);
            }

            file_type = file_type.toLowerCase();

            if (!_.includes(_.keys(this.get_worksheet_names_handlers), file_type)) {
                throw new Error(this.MESSAGE_UNSUPPORTED_FILE_TYPE);
            }

            return this.get_worksheet_names_handlers[file_type](file_data);
        };

        /**
         * fileToArray
         *
         * @param file_data
         * @param file_type
         * @param array|boolean worksheet_has_headings
         * @param group_by TODO: add support for this (group by row: [0: {A:a1, B:b1}] or group by column: {A: [0:a1, 1:a2]}
         * @returns {*}
         */
        this.fileToArray = function (file_data, file_type, worksheet_has_headings, group_by) {

            // validate args
            if (_.isUndefined(file_data) || _.isNull(file_data)) {
                throw new Error(this.MESSAGE_FILE_DATA_IS_REQUIRED);
            }
            if (_.isUndefined(file_type) || _.isNull(file_type)) {
                throw new Error(this.MESSAGE_FILE_TYPE_IS_REQUIRED);
            }

            // arg defaults
            group_by = !_.isUndefined(group_by) ? group_by.toLowerCase() : "row";

            file_type = file_type.toLowerCase();

            if (!_.includes(_.keys(this.file_to_array_handlers), file_type)) {
                throw new Error(this.MESSAGE_UNSUPPORTED_FILE_TYPE);
            }

            return this.file_to_array_handlers[file_type](file_data, worksheet_has_headings, group_by);
        };

        ///////////////////////////////////////////////////////////
        //
        // private methods
        //
        ///////////////////////////////////////////////////////////

        /**
         * txtToArray
         *
         * @param data
         * @param array|boolean worksheet_has_headings
         * @param group_by
         * @returns {*|Array}
         */
        var txtToArray = function(text, worksheet_has_headings) {

            var data = text.split(/\n/);
            _.forEach(data, function (item, index, data) {
                data[index] = item.split(/,/);
            });

            // has got a heading row?
            var has_heading_row;
            if (_.isArray(worksheet_has_headings)) {
                has_heading_row = !_.isUndefined(worksheet_has_headings[0]) && worksheet_has_headings[0] === true ? true : false;
            } else {
                has_heading_row = worksheet_has_headings === true ? true : false;
            }

            if (has_heading_row) {
                var result = [];
                var headings = data[0];
                _.forEach(data, function (row) {
                    var _row = {};
                    _.forEach(row, function (column, column_index) {
                        _row[headings[column_index]] = column;
                    });
                    result.push(_row);
                });
                return [{
                    name:       "Sheet1",
                    headings:   result.shift(),
                    data:       result
                }];
            }

            return [{
                name:       "Sheet1",
                headings:   [],
                data:       data
            }];
        };

        /**
         * xlsxToArray
         *
         * @param data
         * @param worksheet_has_headings
         * @param group_by
         * @returns {Array}
         */
        var xlsxToArray = function(data, worksheet_has_headings, group_by) {
            var result = [];

            try {
                var workbook_data = XLSX.read(data, {type: 'binary'});
                result = workbookDataToArray(workbook_data, worksheet_has_headings, group_by);
            } catch (error) {
                throw new Error(this.MESSAGE_FILE_READ_ERROR);
            }

            return result;
        };

        /**
         * xlsToArray
         *
         * @param data
         * @param worksheet_has_headings
         * @param group_by
         * @returns {Array}
         */
        var xlsToArray = function(data, worksheet_has_headings, group_by) {

            // dependency check
            if (typeof window.XLS === 'undefined') {
                throw new Error("Please include js-xls (https://github.com/SheetJS/js-xls)");
            }

            var result = [];

            try {
                var workbook_data = window.XLS.read(data, {type: 'binary'});
                result = workbookDataToArray(workbook_data, worksheet_has_headings, group_by);
            } catch (error) {
                throw new Error(this.MESSAGE_FILE_READ_ERROR);
            }

            return result;
        };

        /**
         * workbookDataToArray
         *
         * @param data
         * @param array|boolean worksheet_has_headings
         * @param group_by
         * @returns {Array}
         */
        var workbookDataToArray = function(data, worksheet_has_headings) {

            var result = [];
            var index = 0;

            // loop worksheets
            _.forEach(data.Sheets, function (worksheet, worksheet_name) {

                // has worksheet got headings?
                var has_heading_row;
                if (_.isArray(worksheet_has_headings)) {
                    has_heading_row = !_.isUndefined(worksheet_has_headings[index]) && worksheet_has_headings[index] === true ? true : false;
                } else {
                    has_heading_row = worksheet_has_headings === true ? true : false;
                }

                var sheet = [];
                var headings = {};
                var row = has_heading_row ? {} : [];
                var previous_row_number = 0;

                // loop worksheet properties
                _.forEach(worksheet, function (item, key) {

                    // skip items that do not have a value property
                    if (_.isUndefined(item.v)) {
                        return;
                    }

                    // get column name & row number
                    var parts = key.match(/([A-Za-z]+)([0-9]+)/);
                    var column_letter = parts[1];
                    var row_number = parseInt(parts[2]);

                    // get headings
                    if (has_heading_row && row_number === 1) {
                        headings[column_letter] = item.v;
                    }

                    // get rows
                    if (!has_heading_row || row_number > 1) {

                        // if new row
                        if (row_number > previous_row_number) {
                            row = has_heading_row ? {} : [];
                            sheet.push(row);
                        }

                        // add to row
                        if (has_heading_row) {
                            row[headings[column_letter]] = item.v;
                        } else {
                            row.push(item.v);
                        }
                    }

                    previous_row_number = row_number;
                });

                result.push({
                    name:       worksheet_name,
                    headings:   headings,
                    data:       sheet
                });

                index++;
            });

            return result;
        };

        /**
         * getXlsxWorksheetNames
         *
         * @param data
         * @returns {Array}
         */
        var getXlsxWorksheetNames = function(data) {
            var result = [];

            try {
                var workbook_data = XLSX.read(data, {type: 'binary'});

                // loop worksheets
                _.forEach(workbook_data.Sheets, function (worksheet, worksheet_name) {
                    result.push(worksheet_name);
                });
            } catch (error) {
                throw new Error(this.MESSAGE_FILE_READ_ERROR);
            }

            return result;
        };

        /**
         * getXlsWorksheetNames
         *
         * @param data
         * @returns {Array}
         */
        var getXlsWorksheetNames = function(data) {
            var result = [];

            try {
                var workbook_data = XLS.read(data, {type: 'binary'});

                // loop worksheets
                _.forEach(workbook_data.Sheets, function (worksheet, worksheet_name) {
                    result.push(worksheet_name);
                });
            } catch (error) {
                throw new Error(this.MESSAGE_FILE_READ_ERROR);
            }

            return result;
        };

        ///////////////////////////////////////////////////////////
        //
        // init
        //
        ///////////////////////////////////////////////////////////

        // handlers mapped by file type

        this.file_to_array_handlers = {
            xlsx:   xlsxToArray,
            ods:    xlsxToArray,
            xls:    xlsToArray,
            txt:    txtToArray,
            csv:    txtToArray
        };
        this.get_worksheet_names_handlers = {
            xlsx:   getXlsxWorksheetNames,
            ods:    getXlsxWorksheetNames,
            xls:    getXlsWorksheetNames
        };
    };

    module.FileReader = new FileReader();

})(window.JSFile);
