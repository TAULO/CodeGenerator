/*

╔═════════════════════════════════════════════════════════════════════════╗
║                     ADVANCE JAVASCRIPT                                  ║
║  *collection of prototype extension methods that make js coding handy*  ║
╟─────────────────────────────────────────────────────────────────────────╢
║                                                                         ║
║ CREATED BY : GOVIND PRASAD GUPTA                                        ║
║                                                                         ║
║ GIT LINK : https://github.com/developergovindgupta/AdvanceJavascript    ║
║                                                                         ║
║ NPM LINK : https://www.npmjs.com/settings/developergovindgupta/packages ║
║                                                                         ║
║           npm i advance-javascript                                      ║
║                                                                         ║
╟─────────────────────────────────────────────────────────────────────────╢
║  FILES : AdvanceJavascript.js                                           ║
║          AdvanceJavascript.min.js                                       ║
╟─────────────────────────────────────────────────────────────────────────╢
║  USASE :                                                                ║
║         NODE-JS :  require('advance-javascript');                       ║
║    WEB .JS FILE : import 'advance-javascript';                          ║
║       HTML FILE : <script src="./js/AdvanceJavascript.js"></script>     ║
║                                                                         ║
╚═════════════════════════════════════════════════════════════════════════╝

*/
var global = typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {};
(function (_window) {
	!String.prototype.trimAll &&
		Object.defineProperty(String.prototype, 'trimAll', {
			/**
			 * This is a string extension method remove all extra spaces, new line and tab characters from string sentence.
			 * @returns {string}  String having single space between words of string.
			 * ---
			 * @example
			 * " this         is     sample         string".trimAll()
			 * OUTPUT :  "this is sample string"
			 */
			value: function trimAll() {
				let str = this;
				str = str.trim().replace(/\t/g, ' ').replace(/\r/g, ' ').replace(/\n/g, ' ');
				while (str.indexOf('  ') >= 0) {
					str = str.replace(/  /g, ' ');
				}
				return str;
			},
		});

	!String.prototype.toCamelCase &&
		Object.defineProperty(String.prototype, 'toCamelCase', {
			/**
			 * This is a string extension method convert string to camel case. Input string may be space separated or pascal/kebab/snake case
			 * @returns {string} String converted to camel case
			 * ---
			 * @example
			 * > "this is sample string".toCamelCase()
			 * //OUTPUT : "thisIsSampleString"
			 * > "this-is-sample-string".toCamelCase()
			 * //OUTPUT : "thisIsSampleString"
			 * > "ThisIsSampleString".toCamelCase()
			 * //OUTPUT : "thisIsSampleString"
			 * > "this_is_sample_string".toCamelCase()
			 * //OUTPUT : "thisIsSampleString"
			 */
			value: function toCamelCase() {
				let str = this.trimAll();
				let str2 = '';
				let isSpace = false;
				if (str.indexOf(' ') > 0 || str.indexOf('-') > 0 || str.indexOf('_') > 0) {
					str = str.toLowerCase();
					for (let i = 0, j = str.length; i < j; i++) {
						if (str[i] === ' ' || str[i] === '-' || str[i] === '_') {
							isSpace = true;
						} else if (isSpace) {
							str2 += str[i].toUpperCase();
							isSpace = false;
						} else {
							str2 += str[i];
						}
					}
				} else {
					str2 = str[0].toLowerCase() + str.substring(1);
				}
				return str2;
			},
		});

	!String.prototype.toKebabCase &&
		Object.defineProperty(String.prototype, 'toKebabCase', {
			/**
			 * This is a string extension method convert string to kebab case. Input string may be space separated or pascal/camel/snake case
			 * @returns {string} String converted to kebab case
			 * ---
			 * @example
			 * > "this is sample string".toKebabCase()
			 * //OUTPUT : "this-is-sample-string"
			 * > "thisIsSampleString".toKebabCase()
			 * //OUTPUT : "this-is-sample-string"
			 * > "ThisIsSampleString".toKebabCase()
			 * //OUTPUT : "this-is-sample-string"
			 * > "this_is_sample_string".toKebabCase()
			 * //OUTPUT : "this-is-sample-string"
			 */
			value: function toKebabCase() {
				let str = this.trimAll();
				let str2 = '';
				let isSpace = false;
				if (str.indexOf(' ') > 0 || str.indexOf('-') > 0 || str.indexOf('_') > 0) {
					str = str.toLowerCase();
					for (let i = 0, j = str.length; i < j; i++) {
						if (str[i] === ' ' || str[i] === '-' || str[i] === '_') {
							isSpace = true;
						} else if (isSpace) {
							str2 += '-' + str[i];
							isSpace = false;
						} else {
							str2 += str[i];
						}
					}
				} else {
					for (let i = 0, j = str.length; i < j; i++) {
						if (str[i] === str[i].toUpperCase() && i > 0) {
							str2 += '-' + str[i].toLowerCase();
						} else {
							str2 += str[i].toLowerCase();
						}
					}
				}
				return str2;
			},
		});

	!String.prototype.toPascalCase &&
		Object.defineProperty(String.prototype, 'toPascalCase', {
			/**
			 * This is a string extension method convert string to pascal case. Input string may be space separated or camel/snake/kebab case
			 * @returns {string} String converted to pascal case
			 * ---
			 * @example
			 * > "this is sample string".toPascalCase()
			 * //OUTPUT : "ThisIsSampleString"
			 * > "thisIsSampleString".toPascalCase()
			 * //OUTPUT : "ThisIsSampleString"
			 * > "this-is-sample-string".toPascalCase()
			 * //OUTPUT : "ThisIsSampleString"
			 * > "this_is_sample_string".toPascalCase()
			 * //OUTPUT : "ThisIsSampleString"
			 */
			value: function toPascalCase() {
				let str = this.trimAll();
				let str2 = '';
				let isSpace = false;
				if (str.indexOf(' ') > 0 || str.indexOf('-') > 0 || str.indexOf('_') > 0) {
					str = str.toLowerCase();
					for (let i = 0, j = str.length; i < j; i++) {
						if (str[i] === ' ' || str[i] === '-' || str[i] === '_') {
							isSpace = true;
						} else if (isSpace || i === 0) {
							str2 += str[i].toUpperCase();
							isSpace = false;
						} else {
							str2 += str[i];
						}
					}
				} else {
					str2 = str[0].toUpperCase() + str.substring(1);
				}
				return str2;
			},
		});

	!String.prototype.toSnakeCase &&
		Object.defineProperty(String.prototype, 'toSnakeCase', {
			/**
			 * This is a string extension method convert string to snake case. Input string may be space separated or camel/pascal/kebab case
			 * @returns {string} String converted to snake case
			 * ---
			 * @example
			 * > "this is sample string".toSnakeCase()
			 * //OUTPUT : "this_is_sample_string"
			 * > "thisIsSampleString".toSnakeCase()
			 * //OUTPUT : "this_is_sample_string"
			 * > "this-is-sample-string".toSnakeCase()
			 * //OUTPUT : "this_is_sample_string"
			 * > "ThisIsSampleString".toSnakeCase()
			 * //OUTPUT : "this_is_sample_string"
			 */
			value: function toSnakeCase() {
				let str = this.trimAll();
				let str2 = '';
				let isSpace = false;
				if (str.indexOf(' ') > 0 || str.indexOf('-') > 0 || str.indexOf('_') > 0) {
					str = str.toLowerCase();
					for (let i = 0, j = str.length; i < j; i++) {
						if (str[i] === ' ' || str[i] === '-' || str[i] === '_') {
							isSpace = true;
						} else if (isSpace) {
							str2 += '_' + str[i];
							isSpace = false;
						} else {
							str2 += str[i];
						}
					}
				} else {
					for (let i = 0, j = str.length; i < j; i++) {
						if (str[i] === str[i].toUpperCase() && i > 0) {
							str2 += '_' + str[i].toLowerCase();
						} else {
							str2 += str[i].toLowerCase();
						}
					}
				}
				return str2;
			},
		});

	!String.prototype.left &&
		Object.defineProperty(String.prototype, 'left', {
			/**
			 * Extract given number of characters from left.
			 *
			 * @param {number} n Number of characters
			 * @returns {string} First n characters from string
			 * ---
			 * @example
			 * > "this is sample string".left(6)
			 * //OUTPUT : "this i"
			 */
			value: function left(n) {
				n = n || 1;
				return this.substr(0, n);
			},
		});

	!String.prototype.right &&
		Object.defineProperty(String.prototype, 'right', {
			/**
			 * Extract given number of characters from right.
			 *
			 * @param {number} n Number of characters
			 * @returns {string} Last n characters from string
			 * ---
			 * @example
			 * > "this is sample string".right(4)
			 * //OUTPUT : "ring"
			 */
			value: function right(n) {
				n = n || 1;
				return this.substring(this.length - n);
			},
		});

	!String.prototype.mid &&
		Object.defineProperty(String.prototype, 'mid', {
			/**
			 *Extract given number of characters (n) from given index value (m).
			 *
			 * if n is not passed then only one character extract
			 *
			 * if m is not passed then one character extract from mid of string.
			 *
			 * ---
			 *
			 * @param {number} m Start index from (n) number of characters extract
			 * @param {number} n Number of characters.
			 * @returns {string} returns n characters from given index point within the string
			 * ---
			 * @example
			 * > "this is sample string".mid(8,6)
			 * //OUTPUT : "sample"
			 * > "this is sample string".mid(8)
			 * //OUTPUT : "s"
			 * > "this is sample string".mid()
			 * //OUTPUT : "m"
			 */
			value: function mid(m, n) {
				m = m || Math.floor(this.length / 2);
				n = n || 1;
				return this.substr(m, n);
			},
		});

	!String.prototype.reverse &&
		Object.defineProperty(String.prototype, 'reverse', {
			/**
			 * This extension method reverse the string
			 *
			 * @returns {string} retern string in reverse order
			 * @example
			 * > "this is sample string".reverse()
			 * //OUTPUT : "gnirts elpmas si siht"
			 */
			value: function reverse() {
				return this.split('').reverse().join('');
			},
		});

	!String.prototype.sort &&
		Object.defineProperty(String.prototype, 'sort', {
			/**
			 * Sort string in ascending order or depends on compare function if passed
			 * @param {function} compareFn optional parameter a function that compare tow values and retrun positive or negative value
			 *
			 * @returns {string} Sorted string alphabatical order
			 * @example
			 * > "this is sample string".sort()
			 * //OUTPUT : "   aeghiiilmnprsssstt"
			 * > "this is sample string".sort((a, b) => (a < b ? 1 : -1))
			 * //OUTPUT : "ttssssrpnmliiihgea   "
			 */
			value: function sort(compareFn) {
				return this.split('')
					.sort(compareFn || ((a, b) => (a > b ? 1 : -1)))
					.join('');
			},
		});

	!String.prototype.sortAsc &&
		Object.defineProperty(String.prototype, 'sortAsc', {
			/**
			 * Sort string in ascending order
			 * @returns {string} Sorted string alphabatical order
			 * @example
			 * > "this is sample string".sortAsc()
			 * //OUTPUT : "   aeghiiilmnprsssstt"
			 */
			value: function sortAsc() {
				return this.split('')
					.sort((a, b) => (a > b ? 1 : -1))
					.join('');
			},
		});

	!String.prototype.sortDesc &&
		Object.defineProperty(String.prototype, 'sortDesc', {
			/**
			 * Sort string in descending order
			 * @returns {string} Sorted string alphabatical order
			 * @example
			 * > "this is sample string".sortDesc()
			 * //OUTPUT : "ttssssrpnmliiihgea   "
			 */
			value: function sortDesc() {
				return this.split('')
					.sort((a, b) => (a < b ? 1 : -1))
					.join('');
			},
		});

	!String.prototype.distinct &&
		Object.defineProperty(String.prototype, 'distinct', {
			/**
			 * Extract distinct/unique characters from string
			 * @returns {string} String having distinct unique characters.
			 * @example
			 * > "this is sample string".distinct()
			 * //OUTPUT : "this amplerng"
			 * // you can sort it by using .sort method
			 */
			value: function distinct() {
				return Array.from(new Set(this.split(''))).join('');
			},
		});

	!String.prototype.toNumber &&
		Object.defineProperty(String.prototype, 'toNumber', {
			/**
			 * Convert string to numeric value if fails it return NaN or value you passed as parameter
			 *
			 * an special parameter value *itself* that return string itself if NaN result
			 * @param {number|itself} [nanValue] Optional parameter if passed then in case of NaN return it
			 *
			 * @returns {number} Numeric/NaN  or passed nanValue
			 * @example
			 * > "123.45".toNumber()
			 * //OUTPUT : 123.45
			 * > "a123.45".toNumber()
			 * //OUTPUT : NaN
			 * > "a123.45".toNumber(0)
			 * //OUTPUT : 0
			 * > "a123.45".toNumber(itself)
			 * //OUTPUT : "a123.45"
			 */
			value: function toNumber(nanValue) {
				let num = parseFloat(this.replace(/,/g, '').trimAll());
				if (isNaN(num)) {
					if (nanValue === _window.itself) {
						return this;
					}
					return (num = nanValue === undefined || nanValue === null ? num : nanValue);
				}
				return num;
			},
		});

	!String.prototype.parseInt &&
		Object.defineProperty(String.prototype, 'parseInt', {
			/**
			 * Convert string to integer value if fails it return NaN or value you passed as parameter
			 *
			 * an special parameter value *itself* that return string itself if NaN result
			 * @param {number} [radix] Optional base value that defines the string value 2,8,10,16 [binary,octal,decima,hexa]
			 * @param {number|itself} [nanValue] Optional parameter if passed then in case of NaN return it
			 * @returns {integer} Numeric/NaN  or passed nanValue
			 * @example
			 * > "123.45".parseInt()
			 * //OUTPUT : 123
			 * > "a123.45".parseInt()
			 * //OUTPUT : NaN
			 * > "a123.45".parseInt(0)
			 * //OUTPUT : 0
			 * > "a123.45".parseInt(itself)
			 * //OUTPUT : "a123.45"
			 */
			value: function (radix, nanValue) {
				let num = parseInt(this.replace(/,/g, '').trimAll(), radix);
				if (isNaN(num)) {
					if (nanValue === _window.itself) {
						return this;
					}
					return (num = nanValue === undefined || nanValue === null ? num : nanValue);
				}
				return num;
			},
		});

	!String.prototype.parseFloat &&
		Object.defineProperty(String.prototype, 'parseFloat', {
			/**
			 * Convert string to numeric value if fails it return NaN or value you passed as parameter
			 *
			 * an special parameter value *itself* that return string itself if NaN result
			 * @param {number|itself} [nanValue] Optional parameter if passed then in case of NaN return it
			 *
			 * @returns {number} Numeric/NaN  or passed nanValue
			 * @example
			 * > "123.45".parseFloat()
			 * //OUTPUT : 123.45
			 * > "a123.45".parseFloat()
			 * //OUTPUT : NaN
			 * > "a123.45".parseFloat(0)
			 * //OUTPUT : 0
			 * > "a123.45".parseFloat(itself)
			 * //OUTPUT : "a123.45"
			 */
			value: function (nanValue) {
				return this.toNumber(nanValue);
			},
		});

	!String.prototype.toInt &&
		Object.defineProperty(String.prototype, 'toInt', {
			/**
			 * Convert string to integer value if fails it return NaN or value you passed as parameter
			 *
			 * an special parameter value *itself* that return string itself if NaN result
			 * @param {number} [radix] Optional base value that defines the string value 2,8,10,16 [binary,octal,decima,hexa]
			 * @param {number|itself} [nanValue] Optional parameter if passed then in case of NaN return it
			 * @returns {integer} Numeric/NaN  or passed nanValue
			 * @example
			 * > "123.45".toInt()
			 * //OUTPUT : 123
			 * > "a123.45".toInt()
			 * //OUTPUT : NaN
			 * > "a123.45".toInt(0)
			 * //OUTPUT : 0
			 * > "a123.45".toInt(itself)
			 * //OUTPUT : "a123.45"
			 */
			value: function toInt(radix, nanValue) {
				let num = parseInt(this.replace(/,/g, '').trimAll(), radix);
				if (isNaN(num)) {
					if (nanValue === _window.itself) {
						return this;
					}
					return (num = nanValue === undefined || nanValue === null ? num : nanValue);
				}
				return num;
			},
		});

	!String.prototype.toFloat &&
		Object.defineProperty(String.prototype, 'toFloat', {
			/**
			 * Convert string to numeric value if fails it return NaN or value you passed as parameter
			 *
			 * an special parameter value *itself* that return string itself if NaN result
			 * @param {number|itself} [nanValue] Optional parameter if passed then in case of NaN return it
			 *
			 * @returns {number} Numeric/NaN  or passed nanValue
			 * @example
			 * > "123.45".toFloat()
			 * //OUTPUT : 123.45
			 * > "a123.45".toFloat()
			 * //OUTPUT : NaN
			 * > "a123.45".toFloat(0)
			 * //OUTPUT : 0
			 * > "a123.45".toFloat(itself)
			 * //OUTPUT : "a123.45"
			 */
			value: function toFloat(nanValue) {
				return this.toNumber(nanValue);
			},
		});

	!String.prototype.isNaN &&
		Object.defineProperty(String.prototype, 'isNaN', {
			value: function (nanValue) {
				let num = this.toNumber();
				if (isNaN(num) || num === Infinity) {
					if (nanValue === _window.itself) {
						return this;
					}
					return nanValue === undefined || nanValue === null ? true : nanValue;
				} else {
					return nanValue === undefined || nanValue === null ? false : num;
				}
			},
		});

	!String.prototype.toArray &&
		Object.defineProperty(String.prototype, 'toArray', {
			/**
			 * Convert string to characters array
			 * @returns {array} characters array
			 * @example
			 * > "abcde".toArray()
			 * //OUTPUT : [a,b,c,d,e]
			 */
			value: function toArray() {
				return this.split('');
			},
		});

	!String.prototype.toCodeArray &&
		Object.defineProperty(String.prototype, 'toCodeArray', {
			/**
			 * Convert string to array of character ascii/unicode code
			 * @returns {[number]} ascii/unicode code array
			 * @example
			 * > "abcde".toCodeArray()
			 * //OUTPUT : [97, 98, 99, 100, 101]
			 */
			value: function toCodeArray() {
				let arr = [];
				for (let i = 0, j = this.length; i < j; i++) {
					arr.push(this.charCodeAt(i));
				}
				return arr;
			},
		});

	!String.prototype.toCharCodeArray &&
		Object.defineProperty(String.prototype, 'toCharCodeArray', {
			/**
			 * Convert string to array of object {char:'char',code:number}
			 * @returns {[{char,code}]} ascii/unicode code array
			 * @example
			 * > "abcde".toCharCodeArray()
			 * //OUTPUT : [{char: "a", code: 97},{char: "b", code: 98},{char: "c", code: 99},{char: "d", code: 100},{char: "e", code: 101}]
			 */
			value: function toCharCodeArray() {
				let arr = [];
				for (let i = 0, j = this.length; i < j; i++) {
					arr.push({ char: this[i], code: this.charCodeAt(i) });
				}
				return arr;
			},
		});

	!String.prototype.toCharCode &&
		Object.defineProperty(String.prototype, 'toCharCode', {
			/**
			 * Convert string to object {char:code,char:code}
			 * @return {Object} {char:code,char:code}
			 * @example
			 * > "abcd".toCharCode()
			 * //OUTPUT : {a: 97, b: 98, c: 99, d: 100}
			 */
			value: function toCharCode() {
				let obj = {};
				for (let i = 0, j = this.length; i < j; i++) {
					!obj[this[i]] && (obj[this[i]] = this.charCodeAt(i));
				}
				return obj;
			},
		});

	!String.prototype.frequency &&
		Object.defineProperty(String.prototype, 'frequency', {
			/**
			 * Calculate frequency of charactes in string and return object having character as key and frequency as value
			 * @param {string}[char] Optional if character is passed then return frequency of char in string
			 * @param {boolean}[isInSensitive] Optional if true then it matches without case check
			 * @returns {Object} {char:frequency} Object or Nemeric value if char passed
			 * @example
			 * > "this is a sample string".frequency()
			 * //OUTPUT : {" ": 4,a: 2,e: 1,g: 1,h: 1,i: 3,l: 1,m: 1,n: 1,p: 1,r: 1,s: 4,t: 2}
			 * > "thisIsASampleString".frequency()
			 * //OUTPUT : {A: 1,I: 1,S: 2,a: 1,e: 1,g: 1,h: 1,i: 2,l: 1,m: 1,n: 1,p: 1,r: 1,s: 2,t: 2}
			 * > "thisIsASampleString".frequency(true)
			 * //OUTPUT : {a: 2,e: 1,g: 1,h: 1,i: 3,l: 1,m: 1,n: 1,p: 1,r: 1,s: 4,t: 2}
			 * > "thisIsASampleString".frequency('i')
			 * //OUTPUT : 2
			 * > "thisIsASampleString".frequency('i',true)
			 * //OUTPUT : 3
			 */
			value: function frequency(char, isInSensitive) {
				if (typeof char === 'boolean') {
					isInSensitive = char;
					char = '';
				}
				let str = this;
				if (isInSensitive) {
					str = this.toLowerCase();
					char && (char = char[0].toLowerCase());
				}
				if (char) {
					let count = 0;
					for (let i = 0, j = str.length; i < j; i++) {
						if (str[i] === char) {
							count++;
						}
					}
					return count;
				} else {
					let obj = {};
					for (let i = 0, j = str.length; i < j; i++) {
						obj[str[i]] = (obj[str[i]] || 0) + 1;
					}
					return obj;
				}
			},
		});

	!String.prototype.toDateTime &&
		Object.defineProperty(String.prototype, 'toDateTime', {
			/**
			 * Convert string to Date value
			 *
			 * Input string must be a valid date format. if invalid date then it return "1/JAN/1900"
			 * @returns {Date} Date Object that can be processed as Date Computation and methods
			 * @example
			 * > "1-jan-2021".toDateTime()
			 * //OUTPUT : Fri Jan 01 2021 00:00:00 GMT+0530 (India Standard Time)
			 * > "1-Mar".toDateTime()
			 * //OUTPUT : Mon Mar 01 2021 00:00:00 GMT+0530 (India Standard Time)
			 * > "Mar,2022".toDateTime()
			 * //OUTPUT : Tue Mar 01 2022 00:00:00 GMT+0530 (India Standard Time)
			 * > "2021".toDateTime()
			 * //OUTPUT : Fri Jan 01 2021 05:30:00 GMT+0530 (India Standard Time)
			 * > "1/5/2021".toDateTime()
			 * //OUTPUT : Sat May 01 2021 00:00:00 GMT+0530 (India Standard Time)
			 * > "01/05/2021 5:55 AM".toDateTime()
			 * //OUTPUT : Sat May 01 2021 05:55:00 GMT+0530 (India Standard Time)
			 * > "01/08/2021 5:15:16 PM".toDateTime()
			 * //OUTPUT : Sun Aug 01 2021 17:15:16 GMT+0530 (India Standard Time)
			 * > "12:15:16 AM".toDateTime()
			 * //OUTPUT : Thu Aug 05 2021 00:15:16 GMT+0530 (India Standard Time)
			 * //current date with given time
			 * > "invalid date string".toDateTime()
			 * //OUTPUT : Mon Jan 01 1900 00:00:00 GMT+0521 (India Standard Time)
			 */
			value: function toDateTime() {
				let mmm = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };
				let d = new Date();
				let dt = { dd: 1, mm: 1, yy: 1900, h: 0, m: 0, s: 0, f: 0 };
				let strDate = this.replace(/[,-./ ]/g, ' ').trimAll();
				let _date = '';
				let _time = '';
				if (strDate.indexOf(':') > 0) {
					if (strDate.indexOf(':') > 3) {
						_date = strDate.substring(0, strDate.indexOf(':') - 2).trimAll();
						_time = strDate.substring(strDate.indexOf(':') - 2).trimAll();
					} else {
						dt.dd = d.getDate();
						dt.mm = d.getMonth();
						dt.yy = d.getFullYear();
						if (new Date(1900, 1, 1).getDay() != 0) {
							dt.mm++;
						}
						_time = strDate.trimAll();
					}
				} else {
					_date = strDate.trimAll();
				}

				if (/^[0-3][0-9][ ](jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|may|june|july|august|september|october|november|december)[ ][1-2][0-9][0-9][0-9]$/i.test(_date)) {
					//"01-Jan-2019"
					dt.dd = parseInt(_date.substr(0, 2));
					dt.mm = mmm[_date.substr(3, 3).toLowerCase()];
					dt.yy = parseInt(_date.right(4));
				} else if (/^[0-9][ ](jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|may|june|july|august|september|october|november|december)[ ][1-2][0-9][0-9][0-9]$/i.test(_date)) {
					//"1-Jan-2019"
					dt.dd = parseInt(_date.substr(0, 1));
					dt.mm = mmm[_date.substr(2, 3).toLowerCase()];
					dt.yy = parseInt(_date.right(4));
				} else if (/^[0-3][0-9](jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|may|june|july|august|september|october|november|december)[1-2][0-9][0-9][0-9]$/i.test(_date)) {
					//"01Jan2019"
					dt.dd = parseInt(_date.substr(0, 2));
					dt.mm = mmm[_date.substr(2, 3).toLowerCase()];
					dt.yy = parseInt(_date.right(4));
				} else if (/^[0-9](jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|may|june|july|august|september|october|november|december)[1-2][0-9][0-9][0-9]$/i.test(_date)) {
					//"1Jan2019"
					dt.dd = parseInt(_date.substr(0, 1));
					dt.mm = mmm[_date.substr(1, 3).toLowerCase()];
					dt.yy = parseInt(_date.right(4));
				} else if (/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|may|june|july|august|september|october|november|december)[ ][1-2][0-9][0-9][0-9]$/i.test(_date)) {
					//"Jan-2019"
					dt.dd = 1;
					dt.mm = mmm[_date.substr(0, 3).toLowerCase()];
					dt.yy = parseInt(_date.right(4));
				} else if (/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|may|june|july|august|september|october|november|december)[1-2][0-9][0-9][0-9]$/i.test(_date)) {
					//"Jan2019"
					dt.dd = 1;
					dt.mm = mmm[_date.substr(0, 3).toLowerCase()];
					dt.yy = parseInt(_date.right(4));
				} else if (/^[0-3][0-9][ ](jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|may|june|july|august|september|october|november|december)[ ][0-9][0-9]$/i.test(_date)) {
					//"01-Jan-19"
					dt.dd = parseInt(_date.substr(0, 2));
					dt.mm = mmm[_date.substr(3, 3).toLowerCase()];
					dt.yy = parseInt(_date.right(2));
				} else if (/^[0-9][ ](jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|may|june|july|august|september|october|november|december)[ ][0-9][0-9]$/i.test(_date)) {
					//"1-Jan-19"
					dt.dd = parseInt(_date.substr(0, 1));
					dt.mm = mmm[_date.substr(2, 3).toLowerCase()];
					dt.yy = parseInt(_date.right(2));
				} else if (/^[0-3][0-9](jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|may|june|july|august|september|october|november|december)[0-9][0-9]$/i.test(_date)) {
					//"01Jan19"
					dt.dd = parseInt(_date.substr(0, 2));
					dt.mm = mmm[_date.substr(2, 3).toLowerCase()];
					dt.yy = parseInt(_date.right(2));
				} else if (/^[0-9](jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|may|june|july|august|september|october|november|december)[0-9][0-9]$/i.test(_date)) {
					//"1Jan19"
					dt.dd = parseInt(_date.substr(0, 1));
					dt.mm = mmm[_date.substr(1, 3).toLowerCase()];
					dt.yy = parseInt(_date.right(2));
				} else if (/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|may|june|july|august|september|october|november|december)[ ][0-9][0-9]$/i.test(_date)) {
					//"Jan-19"
					dt.dd = 1;
					dt.mm = mmm[_date.substr(0, 3).toLowerCase()];
					dt.yy = parseInt(_date.right(2));
				} else if (/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|may|june|july|august|september|october|november|december)[0-9][0-9]$/i.test(_date)) {
					//"Jan19"
					dt.dd = 1;
					dt.mm = mmm[_date.substr(0, 3).toLowerCase()];
					dt.yy = parseInt(_date.right(2));
				} else if (/^[0-3][0-9][ ](jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|may|june|july|august|september|october|november|december)$/i.test(_date)) {
					//"05,jan"

					dt.dd = parseInt(_date.substr(0, 2));
					dt.mm = mmm[_date.substr(3, 3).toLowerCase()];
					dt.yy = d.getFullYear();
				} else if (/^[0-9][ ](jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|may|june|july|august|september|october|november|december)$/i.test(_date)) {
					//"5,jan"
					dt.dd = parseInt(_date.substr(0, 1));
					dt.mm = mmm[_date.substr(2, 3).toLowerCase()];
					dt.yy = d.getFullYear();
				} else if (/^[0-3][0-9](jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|may|june|july|august|september|october|november|december)$/i.test(_date)) {
					//"05jan"
					dt.dd = parseInt(_date.substr(0, 2));
					dt.mm = mmm[_date.substr(2, 3).toLowerCase()];
					dt.yy = d.getFullYear();
				} else if (/^[0-9](jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|may|june|july|august|september|october|november|december)$/i.test(_date)) {
					//"5jan"
					dt.dd = parseInt(_date.substr(0, 1));
					dt.mm = mmm[_date.substr(1, 3).toLowerCase()];
					dt.yy = d.getFullYear();
				} else if (/^[0-3][0-9][ ][0-1][0-9][ ][1-2][0-9][0-9][0-9]$/i.test(_date)) {
					//"05-08-2019"
					dt.dd = parseInt(_date.substr(0, 2));
					dt.mm = parseInt(_date.substr(3, 2));
					dt.yy = parseInt(_date.right(4));
				} else if (/^[0-9][ ][0-1][0-9][ ][1-2][0-9][0-9][0-9]$/i.test(_date)) {
					//"5-08-2019"
					dt.dd = parseInt(_date.substr(0, 1));
					dt.mm = parseInt(_date.substr(2, 2));
					dt.yy = parseInt(_date.right(4));
				} else if (/^[0-9][ ][0-9][ ][1-2][0-9][0-9][0-9]$/i.test(_date)) {
					//"5-8-2019"
					dt.dd = parseInt(_date.substr(0, 1));
					dt.mm = parseInt(_date.substr(2, 1));
					dt.yy = parseInt(_date.right(4));
				} else if (/^[0-3][0-9][ ][0-9][ ][1-2][0-9][0-9][0-9]$/i.test(_date)) {
					//"15-8-2019"
					dt.dd = parseInt(_date.substr(0, 2));
					dt.mm = parseInt(_date.substr(3, 1));
					dt.yy = parseInt(_date.right(4));
				} else if (/^[0-1][0-9][ ][1-2][0-9][0-9][0-9]$/i.test(_date)) {
					//"11-2019"
					dt.dd = 1;
					dt.mm = parseInt(_date.substr(0, 2));
					dt.yy = parseInt(_date.right(4));
				} else if (/^[0-9][ ][1-2][0-9][0-9][0-9]$/i.test(_date)) {
					//"8-2019"
					dt.dd = 1;
					dt.mm = parseInt(_date.substr(0, 1));
					dt.yy = parseInt(_date.right(4));
				} else if (/^[0-3][0-9][ ][0-1][0-9][ ][0-9][0-9]$/i.test(_date)) {
					//"05-08-19"
					dt.dd = parseInt(_date.substr(0, 2));
					dt.mm = parseInt(_date.substr(3, 2));
					dt.yy = parseInt(_date.right(2));
				} else if (/^[0-9][ ][0-1][0-9][ ][0-9][0-9]$/i.test(_date)) {
					//"5-08-19"
					dt.dd = parseInt(_date.substr(0, 1));
					dt.mm = parseInt(_date.substr(2, 2));
					dt.yy = parseInt(_date.right(2));
				} else if (/^[0-9][ ][0-9][ ][0-9][0-9]$/i.test(_date)) {
					//"5-8-19"
					dt.dd = parseInt(_date.substr(0, 1));
					dt.mm = parseInt(_date.substr(2, 1));
					dt.yy = parseInt(_date.right(2));
				} else if (/^[0-3][0-9][ ][0-9][ ][0-9][0-9]$/i.test(_date)) {
					//"15-8-19"
					dt.dd = parseInt(_date.substr(0, 2));
					dt.mm = parseInt(_date.substr(3, 1));
					dt.yy = parseInt(_date.right(2));
				} else if (/^[0-1][0-9][ ][0-9][0-9]$/i.test(_date)) {
					//"08-19"
					dt.dd = 1;
					dt.mm = parseInt(_date.substr(0, 2));
					dt.yy = parseInt(_date.right(2));
				} else if (/^[0-9][ ][0-9][0-9]$/i.test(_date)) {
					//"8-19"
					dt.dd = 1;
					dt.mm = parseInt(_date.substr(0, 1));
					dt.yy = parseInt(_date.right(2));
				} else {
					d = new Date(this);
					if (!isNaN(d)) {
						dt.dd = d.getDate();
						dt.mm = d.getMonth();
						dt.yy = d.getFullYear();
						if (new Date(1900, 1, 1).getDay() != 0) {
							dt.mm++;
						}
						dt.h = d.getHours();
						dt.m = d.getMinutes();
						dt.s = d.getSeconds();
					}
				}

				if (/^([0-2][0-9]|[0-9])(:([0-5][0-9]|[0-9])){1,2}(:[0-9]{1,3})?[ ]?(am|pm)?$/i.test(_time)) {
					let ttt = _time.match(/\d+/g);
					dt.h = parseInt(ttt[0] || 0);
					dt.m = parseInt(ttt[1] || 0);
					dt.s = parseInt(ttt[2] || 0);
					dt.f = parseInt(ttt[3] || 0);
					if (_time.right(2).toLowerCase() === 'pm') {
						if (dt.h < 12) {
							dt.h += 12;
						}
					} else {
						if (dt.h == 12) {
							dt.h = 0;
						}
					}
				}

				if (new Date(1900, 1, 1).getDay() != 0) {
					dt.mm--;
				}
				if (dt.yy < 50) {
					dt.yy += 2000;
				} else if (dt.yy < 100) {
					dt.yy += 1900;
				}
				d = new Date(dt.yy, dt.mm, dt.dd, dt.h, dt.m, dt.s, dt.f);

				if (isNaN(d)) {
					d = new Date('1jan1900');
				}

				return d;
			},
		});

	!String.prototype.toDate &&
		Object.defineProperty(String.prototype, 'toDate', {
			/**
			 * Convert String to only Date value exclude time value
			 * @returns {Date} Date Object that can be processed as Date Computation and methods
			 * @example
			 * > "05-Aug-2021 05:25:15 AM".toDate()
			 * //OUTPUT : Thu Aug 05 2021 00:00:00 GMT+0530 (India Standard Time)
			 */
			value: function toDate() {
				return this.toDateTime().format('dd/MMM/yyyy').toDateTime();
			},
		});

	!Number.prototype.isNaN &&
		Object.defineProperty(Number.prototype, 'isNaN', {
			value: function (nanValue) {
				if (isNaN(this) || this === Infinity) {
					if (nanValue === _window.itself) {
						return this;
					}
					return nanValue === undefined || nanValue === null ? true : nanValue;
				} else {
					return nanValue === undefined || nanValue === null ? false : this;
				}
			},
		});

	!Number.prototype.toChar &&
		Object.defineProperty(Number.prototype, 'toChar', {
			/**
			 * Convert Number to Character.
			 * @returns {string} ASCII/UNICODE to CHAR
			 */
			value: function toChar() {
				return String.fromCharCode(this);
			},
		});

	!Number.prototype.format &&
		Object.defineProperty(Number.prototype, 'format', {
			/**
			 * Conert Numeric Value to string with format string.
			 * @param {string} strFormat "#" or "0" for Numeric Value and "," for separator
			 * @returns {string} Formatted String Value
			 * @example
			 * > (1234567890).format("#,##,##0.00")
			 * //OUTPUT : "1,23,45,67,890.00"
			 * > (123).format("#,##,##0.00")
			 * //OUTPUT : "123.00"
			 * > (123).format("0000000")
			 * //OUTPUT : "0000123"
			 * > (123412341234).format("####,####,####").replaceAll(',','-')
			 * //OUTPUT : "1234-1234-1234"
			 */
			value: function format(strFormat) {
				if (strFormat && typeof strFormat === 'string' && /^([0#,])+([.]){0,1}([0])*$/.test(strFormat)) {
					let str = this.toString();
					if (str.indexOf('e') > 0) {
						return str;
					}
					let nSign = '';
					if (str[0] === '-') {
						nSign = '-';
						str = str.substring(1);
					}

					if (/,[#0][#0],/.test(strFormat)) {
						let prefix = '##,';
						if (strFormat.indexOf(',') === 0) {
							prefix = prefix + '##';
							strFormat = prefix + strFormat;
						} else if (strFormat.indexOf(',') === 1) {
							prefix = prefix + '#';
							strFormat = prefix + strFormat;
						} else if (strFormat.indexOf(',') === 2) {
							strFormat = prefix + strFormat;
						}
						for (let i = 0, j = str.length / 2; i < j; i++) {
							strFormat = '##,' + strFormat;
						}
					}

					let m = '';
					let n = '';
					if (str.indexOf('.') > 0) {
						m = str.substring(0, str.indexOf('.'));
						n = str.substring(str.indexOf('.') + 1);
					} else {
						m = str;
					}

					let mm = '';
					let nn = '';
					if (strFormat.indexOf('.') > 0) {
						mm = strFormat.substring(0, strFormat.indexOf('.'));
						nn = strFormat.substring(strFormat.indexOf('.') + 1);
					} else {
						mm = strFormat;
					}
					if (nn.indexOf('.') > 0) {
						nn = nn.substring(0, nn.indexOf('.'));
					}
					let mmm = '';
					let nnn = '';
					let x = m.length - 1;
					for (let i = mm.length - 1; i >= 0; i--) {
						if (m[x]) {
							if (mm[i] === ',') {
								mmm = mm[i] + mmm;
							} else {
								mmm = m[x] + mmm;
								x--;
							}
						} else if ((mm[i] === '0' && mm.substring(i).indexOf('#') < 0) || (mm[i] === ',' && mm.substring(i).indexOf('#') < 0)) {
							mmm = mm[i] + mmm;
						}
					}
					mmm = m.substring(0, x + 1) + mmm;

					for (let i = 0; i < nn.length; i++) {
						if (i < n.length) {
							nnn += n[i];
						} else {
							nnn += nn[i];
						}
					}
					if (n.length > nnn.length && parseInt(n[nn.length]) >= 5) {
						nnn = (parseInt(nnn) + 1).toString();
					}

					return nSign + mmm + (nnn ? '.' : '') + nnn;
				} else {
					return this.toLocaleString();
				}
			},
		});

	!Number.prototype.toNumber &&
		Object.defineProperty(Number.prototype, 'toNumber', {
			value: function () {
				return this;
			},
		});
	!Number.prototype.toDate &&
		Object.defineProperty(Number.prototype, 'toDate', {
			value: function () {
				return new Date(this);
			},
		});
	!Number.prototype.toDateTime &&
		Object.defineProperty(Number.prototype, 'toDateTime', {
			value: function () {
				return new Date(this);
			},
		});

	!Date.prototype.toDateTime &&
		Object.defineProperty(Date.prototype, 'toDateTime', {
			value: function () {
				return this;
			},
		});
	!Date.prototype.format &&
		Object.defineProperty(Date.prototype, 'format', {
			value: function (strFormat) {
				if (strFormat) {
					let MMM = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
					let MMMM = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
					let ddd = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
					let dddd = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
					let d = this.getDay();
					let dd = this.getDate();
					let MM = this.getMonth();
					let yyyy = this.getFullYear();
					let hh = this.getHours();
					let mm = this.getMinutes();
					let ss = this.getSeconds();
					let ff = this.getMilliseconds();
					let tt = hh >= 12 ? 'PM' : 'AM';
					let h = hh % 12;
					let yy = parseInt(yyyy.toString().right(2));
					if (hh == 12) {
						h = 12;
					}

					let _date = new Date('1Jan1900');
					if (_date.getMonth() != 0) {
						MM--;
					}
					if (_date.getDay() == 0) {
						if (d == 0) {
							d = 6;
						} else {
							d--;
						}
					}
					strFormat = strFormat.replace(/dddd/g, 'DDDD');
					strFormat = strFormat.replace(/ddd/g, 'DDD');
					strFormat = strFormat.replace(/dd/g, dd.format('00'));
					strFormat = strFormat.replace(/d/g, dd);
					strFormat = strFormat.replace(/MMMM/g, 'XXXX');
					strFormat = strFormat.replace(/MMM/g, 'XXX');
					strFormat = strFormat.replace(/MM/g, 'XX');
					strFormat = strFormat.replace(/M/g, 'X');
					strFormat = strFormat.replace(/yyyy/g, yyyy.format('0000'));
					strFormat = strFormat.replace(/yyy/g, yyyy.format('0000'));
					strFormat = strFormat.replace(/yy/g, yy.format('00'));
					strFormat = strFormat.replace(/y/g, yy);
					strFormat = strFormat.replace(/HH/g, hh.format('00'));
					strFormat = strFormat.replace(/H/g, hh);
					strFormat = strFormat.replace(/hh/g, h.format('00'));
					strFormat = strFormat.replace(/h/g, h);
					strFormat = strFormat.replace(/mm/g, mm.format('00'));
					strFormat = strFormat.replace(/m/g, mm);
					strFormat = strFormat.replace(/ss/g, ss.format('00'));
					strFormat = strFormat.replace(/s/g, ss);
					strFormat = strFormat.replace(/fff/g, ff.format('000'));
					strFormat = strFormat.replace(/ff/g, ff.format('000'));
					strFormat = strFormat.replace(/f/g, ff.format('000'));
					strFormat = strFormat.replace(/tt/g, tt);
					strFormat = strFormat.replace(/t/g, tt.toLowerCase());
					strFormat = strFormat.replace(/DDDD/g, dddd[d]);
					strFormat = strFormat.replace(/DDD/g, ddd[d]);
					strFormat = strFormat.replace(/XXXX/g, MMMM[MM]);
					strFormat = strFormat.replace(/XXX/g, MMM[MM]);
					strFormat = strFormat.replace(/XX/g, (MM + 1).format('00'));
					strFormat = strFormat.replace(/X/g, MM + 1);
					return strFormat;
				} else {
					return this.toString();
				}
			},
		});

	!Date.prototype.addDays &&
		Object.defineProperty(Date.prototype, 'addDays', {
			/**
			 * This is Date extension method that adds number of days in Date value
			 * @param {number} num Enter how many days you want to add/subtract
			 * @returns {date} new date value
			 * @example
			 * > '1 jan 2022'.toDateTime().addDays(10)
			 * //OUTPUT : Tue Jan 11 2022 00:00:00 GMT+0530 (India Standard Time)
			 * > '1 jan 2022'.toDateTime().addDays(-10)
			 * //OUTPUT : Wed Dec 22 2021 00:00:00 GMT+0530 (India Standard Time)
			 */
			value: function addDays(num) {
				let d = new Date(this);
				if (num) {
					d.setDate(this.getDate() + num);
				}
				return d;
			},
		});

	!Date.prototype.addMonths &&
		Object.defineProperty(Date.prototype, 'addMonths', {
			/**
			 * This is Date extension method that adds number of months in Date value
			 * @param {number} num Enter how many months you want to add/subtract
			 * @returns {date} new date value
			 * @example
			 * > '1 jan 2022'.toDateTime().addMonths(10)
			 * //OUTPUT : Tue Nov 01 2022 00:00:00 GMT+0530 (India Standard Time)
			 * > '1 jan 2022'.toDateTime().addMonths(-10)
			 * //OUTPUT : Mon Mar 01 2021 00:00:00 GMT+0530 (India Standard Time)
			 */
			value: function addMonths(num) {
				let d = new Date(this);
				if (num) {
					d.setMonth(this.getMonth() + num);
				}
				return d;
			},
		});

	!Date.prototype.addYears &&
		Object.defineProperty(Date.prototype, 'addYears', {
			/**
			 * This is Date extension method that adds number of years in Date value
			 * @param {number} num Enter how many years you want to add/subtract
			 * @returns {date} new date value
			 * @example
			 * > '1 jan 2022'.toDateTime().addYears(10)
			 * //OUTPUT : Thu Jan 01 2032 00:00:00 GMT+0530 (India Standard Time)
			 * > '1 jan 2022'.toDateTime().addYears(-10)
			 * //OUTPUT : Sun Jan 01 2012 00:00:00 GMT+0530 (India Standard Time)
			 */
			value: function addYears(num) {
				let d = new Date(this);
				if (num) {
					d.setFullYear(this.getFullYear() + num);
				}
				return d;
			},
		});

	!Date.prototype.addHours &&
		Object.defineProperty(Date.prototype, 'addHours', {
			/**
			 * This is Date extension method that adds number of hours in Date value
			 * @param {number} num Enter how many hours you want to add/subtract
			 * @returns {date} new date value
			 * @example
			 * > '1 jan 2022 08:12:18 AM'.toDateTime().addHours(10)
			 * //OUTPUT : Sat Jan 01 2022 18:12:18 GMT+0530 (India Standard Time)
			 * > '1 jan 2022 08:12:18 AM'.toDateTime().addHours(-10)
			 * //OUTPUT : Fri Dec 31 2021 22:12:18 GMT+0530 (India Standard Time)
			 */
			value: function addHours(num) {
				let d = new Date(this);
				if (num) {
					d.setHours(this.getHours() + num);
				}
				return d;
			},
		});

	!Date.prototype.addMinutes &&
		Object.defineProperty(Date.prototype, 'addMinutes', {
			/**
			 * This is Date extension method that adds number of minutes in Date value
			 * @param {number} num Enter how many minutes you want to add/subtract
			 * @returns {date} new date value
			 * @example
			 * > '1 jan 2022 08:12:18 AM'.toDateTime().addMinutes(10)
			 * //OUTPUT : Sat Jan 01 2022 08:22:18 GMT+0530 (India Standard Time)
			 * > '1 jan 2022 08:12:18 AM'.toDateTime().addMinutes(-10)
			 * //OUTPUT : Sat Jan 01 2022 08:02:18 GMT+0530 (India Standard Time)
			 */
			value: function addMinutes(num) {
				let d = new Date(this);
				if (num) {
					d.setMinutes(this.getMinutes() + num);
				}
				return d;
			},
		});

	!Date.prototype.addSeconds &&
		Object.defineProperty(Date.prototype, 'addSeconds', {
			/**
			 * This is Date extension method that adds number of seconds in Date value
			 * @param {number} num Enter how many seconds you want to add/subtract
			 * @returns {date} new date value
			 * @example
			 * > '1 jan 2022 08:12:18 AM'.toDateTime().addSeconds(10)
			 * //OUTPUT : Sat Jan 01 2022 08:12:28 GMT+0530 (India Standard Time)
			 * > '1 jan 2022 08:12:18 AM'.toDateTime().addSeconds(-10)
			 * //OUTPUT : Sat Jan 01 2022 08:12:08 GMT+0530 (India Standard Time)
			 */
			value: function addSeconds(num) {
				let d = new Date(this);
				if (num) {
					d.setSeconds(this.getSeconds() + num);
				}
				return d;
			},
		});

	!Date.prototype.dateDiff &&
		Object.defineProperty(Date.prototype, 'dateDiff', {
			/**
			 * This is Date extension method that subtract given date and return difference in days
			 * @param {date} date Enter Subtract Date
			 * @returns {number} Difference in Days
			 * @example
			 * > let a = '1 jan 2022'.toDateTime()
			 * > let b = '1 jan 2020'.toDateTime()
			 * > a.dateDiff(b)
			 * //OUTPUT : -731
			 * > let a = '1 jan 2022 10:20 AM'.toDateTime()
			 * > let b = '1 jan 2025 10:20 PM'.toDateTime()
			 * > a.dateDiff(b)
			 * //OUTPUT : 1096.5
			 */
			value: function dateDiff(date) {
				date = date || new Date();
				if (date.isDate) {
					let diff = date - this;
					return diff / 86400000;
				}
				return 0;
			},
		});

	!Date.prototype.toNumber &&
		Object.defineProperty(Date.prototype, 'toNumber', {
			value: function () {
				return this.getTime();
			},
		});

	!Array.prototype.toSet &&
		Object.defineProperty(Array.prototype, 'toSet', {
			/**
			 * This Array extension method convert array to set of unique values
			 * @returns {Set} new Set([]) value
			 * @example
			 * > [1,2,5,8,5,4,5,2,4,3].toSet()
			 * //OUTPUT : Set(6) {1, 2, 5, 8, 4, 3}
			 */
			value: function toSet() {
				return new Set(this);
			},
		});

	!Array.prototype.contains &&
		Object.defineProperty(Array.prototype, 'contains', {
			/**
			 * This Array extension method searches value in array and return boolean true/false
			 *
			 * @param {Object} val Any value that you want to search in array.
			 * @returns {boolean} if value found in array with exact matches. eg. object with same properties and value.
			 * @example
			 * > [1,'a','2.5',2.6,{a:false},{a:1,b:2}].contains('a')
			 * //OUTPUT : true
			 * > [1,'a','2.5',2.6,{a:false},{a:1,b:2}].contains('b')
			 * //OUTPUT : false
			 * > [1,'a','2.5',2.6,{a:false},{a:1,b:2}].contains(2.5)
			 * //OUTPUT : false
			 * > [1,'a','2.5',2.6,{a:false},{a:1,b:2}].contains('2.5')
			 * //OUTPUT : true
			 * > [1,'a','2.5',2.6,{a:false},{a:1,b:2}].contains({a:1})
			 * //OUTPUT : false
			 * > [1,'a','2.5',2.6,{a:false},{a:1,b:2}].contains({b:2,a:1})
			 * //OUTPUT : true
			 */
			value: function contains(val) {
				for (let i = 0, j = this.length; i < j; i++) {
					let x = this[i];
					if (x === val) {
						return true;
					} else if (x.isNumber || x.isString || x.isDate || !x.equals) {
						continue;
					} else if (x.equals(val)) {
						return true;
					}
				}
				return false;
			},
		});

	!Array.prototype.unique &&
		Object.defineProperty(Array.prototype, 'unique', {
			/**
			 * This array extension method return new array having distinct/unique values
			 *
			 * this compare array value deep search and check equality for finding unique value
			 *
			 * note : it not clone the array so both array reference is same object.
			 * @returns {array} return new array with unique values reference
			 * @example
			 * > [1,2,5,4,1,2,5,8,2,5].unique()
			 * //OUTPUT : [1, 2, 5, 4, 8]
			 * > [{a:true,b:false},{a:true,b:false},{a:false,b:false},{a:true,b:false}].unique()
			 * //OUTPUT : [{a:true,b:false},{a:false,b:false}]
			 */
			value: function unique() {
				let arr = [];
				for (let i = 0, j = this.length; i < j; i++) {
					if (!arr.contains(this[i])) {
						arr.push(this[i]);
					}
				}
				return arr;
			},
		});

	!Array.prototype.distinct &&
		Object.defineProperty(Array.prototype, 'distinct', {
			/**
			 * This array extension method return new array having distinct/unique values
			 *
			 * this compare array value deep search and check equality for finding unique value
			 *
			 * note : it not clone the array so both array reference is same object.
			 * @returns {array} return new array with unique values reference
			 * @example
			 * > [1,2,5,4,1,2,5,8,2,5].distinct()
			 * //OUTPUT : [1, 2, 5, 4, 8]
			 * > [{a:true,b:false},{a:true,b:false},{a:false,b:false},{a:true,b:false}].distinct()
			 * //OUTPUT : [{a:true,b:false},{a:false,b:false}]
			 */
			value: function distinct() {
				return this.unique();
			},
		});

	!Set.prototype.toArray &&
		Object.defineProperty(Set.prototype, 'toArray', {
			/**
			 * This Set extension method that convert set to Array.
			 * @returns {Array} Array.from(Set)
			 * @example
			 * > [1,2,3,1,5,4,2,3].toSet().toArray()
			 * //OUTPUT :[1, 2, 3, 5, 4]
			 */
			value: function toArray() {
				return Array.from(this);
			},
		});

	!Object.prototype.clone &&
		Object.defineProperty(Object.prototype, 'clone', {
			/**
			 * This extension method make clone of any object/array
			 * @returns {object} return new object/array
			 * @example
			 * > let obj = {a:true,b:44,c:[1,2,3]};
			 * > obj.clone();
			 * //OUTPUT :{a: true, b: 44, c:[1,2,3]}
			 */
			value: function clone() {
				if (this.isDate) {
					return new Date(this);
				}
				let a = JSON.stringify(this);
				return JSON.parse(a);
			},
		});

	!Object.prototype.equals &&
		Object.defineProperty(Object.prototype, 'equals', {
			/**
			 * This extension method checks for equality of object in deep.
			 * @param {object} obj2 second object to compare
			 * @returns {boolean} true/false
			 * @example
			 * > let obj1 = {a:true,b:44,c:[1,2,3]};
			 * > let obj2 = {a:true,b:44,c:[1,2,3]};
			 * > obj1.equals(obj2)
			 * //OUTPUT : true
			 * > let obj1 = {a:true,b:44,c:[1,2,3,4]};
			 * > let obj2 = {a:true,b:44,c:[1,2,3]};
			 * > obj1.equals(obj2)
			 * //OUTPUT : false
			 */
			value: function equals(obj2) {
				let obj1 = this;
				if (obj1 === obj2) {
					return true;
				} else if (obj1.isNumber || obj1.isString || obj1.isDate) {
					return false;
				} else {
					if (!obj2) {
						return false;
					}
					if (!obj2.equals) {
						return false;
					}
					try {
						obj1 = obj1.clone();
						obj2 = obj2.clone && obj2.clone();
					} catch {
						return false;
					}
					if (obj1.isArray && obj2.isArray) {
						if (obj1.length === obj2.length) {
							for (let i = 0, j = obj1.length; i < j; i++) {
								if (obj1[i] === obj2[i]) {
									continue;
								} else if (!obj1[i].equals) {
									return false;
								} else if (!obj1[i].equals(obj2[i])) {
									return false;
								}
							}
							return true;
						} else {
							return false;
						}
					} else if (!obj1.isArray && !obj2.isArray) {
						let keys1 = Object.keys(obj1);
						let keys2 = Object.keys(obj2);
						if (keys1.length && keys1.length === keys2.length) {
							for (let key of keys1) {
								if (obj1[key] !== undefined && obj2[key] === undefined) {
									return false;
								} else if (obj1[key] === obj2[key]) {
									continue;
								} else if (!obj1[key].equals) {
									return false;
								} else if (!obj1[key].equals(obj2[key])) {
									return false;
								}
							}
							return true;
						} else {
							return false;
						}
					} else {
						return false;
					}
				}
			},
		});

	!Object.prototype.typeof &&
		Object.defineProperty(Object.prototype, 'typeof', {
			value: function () {
				return typeof this;
			},
		});

	Object.defineProperty(Object.prototype, 'isObject', {
		get: function () {
			if (typeof this === 'object') {
				if (!this.isDate && !this.isArray) {
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
		},
	});
	Object.defineProperty(Object.prototype, 'isNumber', {
		get: function () {
			if (typeof this === 'number') {
				return true;
			} else if (typeof this === 'string') {
				let regExp = /(^[\d,]*\d[.]{0,1}\d*$|^[.]\d+$)/;
				return regExp.test(this);
			} else {
				return false;
			}
		},
	});
	Object.defineProperty(Object.prototype, 'isString', {
		get: function () {
			if (typeof this === 'string') {
				return true;
			} else {
				return false;
			}
		},
	});
	Object.defineProperty(Object.prototype, 'isDate', {
		get: function () {
			if (typeof this === 'object' && this.__proto__ === Date.prototype) {
				return true;
			} else {
				return false;
			}
		},
	});
	Object.defineProperty(Object.prototype, 'isArray', {
		get: function () {
			if (typeof this === 'object') {
				return Array.isArray(this);
			} else {
				return false;
			}
		},
	});

	/**
	 * @typedef itself an special keyword that return processed string if fail to convert string to number and NaN result generate
	 */
	_window.itself = { description: 'itself : keyword is reserved by AdvanceJavascript' };
	console.info('%cAdvanceJavascript is initiated %cNow your javascript is become advanced. %cUse advance javascript feature and write code very handy. %cReadeMe:https://github.com/developergovindgupta/AdvanceJavascript', 'font-size:18px;color:blue;', 'font-size:14px;font-weight:bold;', 'font-size:12px;color:green;', 'font-size:12px;color:blue;');
})(global);
