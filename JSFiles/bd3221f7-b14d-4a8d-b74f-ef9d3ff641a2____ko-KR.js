var version = "8.0.4";
/*
 *****************************************************************************
 * 							en-US.js (United States - English)
 * ---------------------------------------------------------------------------
 * 	This sample file is built for United States English.
 * 
 * 	Other locales may need adjustments or further enhancements. 
 * 	The function names must be unique across all JS files.
 * 	(See the corresponding locale JS file. e.g. fr-FR.js/es-MX/etc.)
 * 
 * 	IMPORTANT:
 *  1) The main function name must be of the format:  xxXXPlayBuiltinType
 *  Where 'xxXX' is the locale ID without the hyphen. 
 *  i.e. en-US -> enUSPlayBuiltinType()
 * 
 * 	2) This locale file must be located under its locale folder with the same 
 * 	locale ID name.
 * 	i.e. '../en-US/en-US.js'
 * 
 * 	Note: Do not put any comments as the starting line.
 *****************************************************************************
 */

/**
 * The base URL that is prepended to the URLs for all audio files.
 */
var promptBaseUrl = "../Resources/Prompts/ko-KR/";


/**
 * Default audio file extension
 */
var audioFileExtension = ".pcm";

/**
 * Dummy class to hold constants
 */
function Format() {}
new Format();
/*
 * These flags may be bitwise OR'd together to specify the date output format
 */
/**
 * Flag to speak the month
 */ 
Format.prototype.SPEAK_MONTH = 1;
/**
 * Flag to speak the day
 */
Format.prototype.SPEAK_DAY = 2;
/**
 * Flag to speak both month and day.  This is a shortcut for
 * f.SPEAK_MONTH | f.speak_DAY
 */
Format.prototype.SPEAK_MONTH_AND_DAY = 3;
/**
 * Flag to speak the year
 */
Format.prototype.SPEAK_YEAR = 4;
/**
 * Flag to speak the day of the week
 */
Format.prototype.SPEAK_DAY_OF_WEEK = 8;

/**
 * Translates the value of the specified type into an array of
 * vox file URLs.  The array is a list of vox files that when
 * played in succession will represent the value of the specified
 * type in a locale-specific manner.  The following types are
 * supported:
 *
 * <table>
 * <tr><td>"boolean"</td><td>"true" or "false"</td></tr>
 * <tr><td>"date"</td><td>YYYYMMDD<br>Unspecified fields may
 *                                   be replaced by "??" or "????"</td></tr>
 * <tr><td>"digits"</td><td>A string of 0 or more characters [0-9]</td></tr>
 * <tr><td>"currency"</td><td>UUUMM.NN<br>Where UUU is the ISO4217 currency
 *                            code.  The currency code may be omitted, in
 *                            which case, the default currency for the
 *                            current locale will be used.</td></tr>
 * <tr><td>"number"</td><td>Positive or negative, integer or decimal
 *                          number</td></tr>
 * <tr><td>"phone"</td><td>Sequence of digits [0-9], optionally followed
 *                         by an "x" and extension digits [0-9]</td></tr>
 * <tr><td>"time"</td><td>hhmm[aph?]<br>"a" means AM, "p" means PM,
 *                        h means 24 hour, and ? means ambiguous</td></tr>
 * <tr><td>"ordinal"</td><td>A positive integer</td></tr>
 * <tr><td>"alphanumeric"</td><td>A string of digits [0-9] and US-ASCII
 *                                characters [A-Za-z]</td></tr>
 * <tr><td>"dtmf"</td><td>A string of zero or more DTMF characters
 *                        [0-9A-D*#]</td></tr>
 *
 * @param value The value to translate.
 * @param type The type of the value.
 * @param promptUrl The base URL that is prepended to the URLs for all audio files [optional].
 * @param format The output format [optional].
 * @return An array of URL strings.
 */
function koKRPlayBuiltinType(value, type, promptUrl, format)
{
    type = type.toLowerCase();
    // Sets the new base URL that is prepended to the URLs for all audio files.
    if (!(typeof promptUrl == 'undefined'))
    	promptBaseUrl = promptUrl;
    
    var format;
    
    switch (type) {
        case 'boolean':
            return booleanPrompts(value);
        case 'date':
            return datePrompts(value, format);
        case 'digits':
            return alphanumericPrompts(value);
        case 'currency':
            return currencyPrompts(value);
        case 'number':
            return cardinalPrompts(value);
        case 'phone':
            return phonePrompts(value);
        case 'time':
            return timePrompts(value);
        case 'ordinal':
            return ordinalPrompts(value);
        case 'alphanumeric':
            return alphanumericPrompts(value);
        case 'dtmf':
            return dtmfPrompts(value);
        default:
            return void 0;
    }
}

function enUSPlayBuiltinType(value, type, promptUrl, format)
{
    type = type.toLowerCase();
    // Sets the new base URL that is prepended to the URLs for all audio files.
    if (!(typeof promptUrl == 'undefined'))
    	promptBaseUrl = promptUrl;
    
    var format;
    
    switch (type) {
        case 'boolean':
            return booleanPrompts(value);
        case 'date':
            return datePrompts(value, format);
        case 'digits':
            return alphanumericPrompts(value);
        case 'currency':
            return currencyPrompts(value);
        case 'number':
            return cardinalPrompts(value);
        case 'phone':
            return phonePrompts(value);
        case 'time':
            return timePrompts(value);
        case 'ordinal':
            return ordinalPrompts(value);
        case 'alphanumeric':
            return alphanumericPrompts(value);
        case 'dtmf':
            return dtmfPrompts(value);
        default:
            return void 0;
    }
}

function thTHPlayBuiltinType(value, type, promptUrl, format)
{
    type = type.toLowerCase();
    // Sets the new base URL that is prepended to the URLs for all audio files.
    if (!(typeof promptUrl == 'undefined'))
    	promptBaseUrl = promptUrl;
    
    var format;
    
    switch (type) {
        case 'boolean':
            return booleanPrompts(value);
        case 'date':
            return datePrompts(value, format);
        case 'digits':
            return alphanumericPrompts(value);
        case 'currency':
            return currencyPrompts(value);
        case 'number':
            return cardinalPrompts(value);
        case 'phone':
            return phonePrompts(value);
        case 'time':
            return timePrompts(value);
        case 'ordinal':
            return ordinalPrompts(value);
        case 'alphanumeric':
            return alphanumericPrompts(value);
        case 'dtmf':
            return dtmfPrompts(value);
        default:
            return void 0;
    }
}

function zhHKPlayBuiltinType(value, type, promptUrl, format)
{
    type = type.toLowerCase();
    // Sets the new base URL that is prepended to the URLs for all audio files.
    if (!(typeof promptUrl == 'undefined'))
    	promptBaseUrl = promptUrl;
    
    var format;
    
    switch (type) {
        case 'boolean':
            return booleanPrompts(value);
        case 'date':
            return datePrompts(value, format);
        case 'digits':
            return alphanumericPrompts(value);
        case 'currency':
            return currencyPrompts(value);
        case 'number':
            return cardinalPrompts(value);
        case 'phone':
            return phonePrompts(value);
        case 'time':
            return timePrompts(value);
        case 'ordinal':
            return ordinalPrompts(value);
        case 'alphanumeric':
            return alphanumericPrompts(value);
        case 'dtmf':
            return dtmfPrompts(value);
        default:
            return void 0;
    }
}

function zhCNPlayBuiltinType(value, type, promptUrl, format)
{
    type = type.toLowerCase();
    // Sets the new base URL that is prepended to the URLs for all audio files.
    if (!(typeof promptUrl == 'undefined'))
    	promptBaseUrl = promptUrl;
    
    var format;
    
    switch (type) {
        case 'boolean':
            return booleanPrompts(value);
        case 'date':
            return datePrompts(value, format);
        case 'digits':
            return alphanumericPrompts(value);
        case 'currency':
            return currencyPrompts(value);
        case 'number':
            return cardinalPrompts(value);
        case 'phone':
            return phonePrompts(value);
        case 'time':
            return timePrompts(value);
        case 'ordinal':
            return ordinalPrompts(value);
        case 'alphanumeric':
            return alphanumericPrompts(value);
        case 'dtmf':
            return dtmfPrompts(value);
        default:
            return void 0;
    }
}

function jaJPPlayBuiltinType(value, type, promptUrl, format)
{
    type = type.toLowerCase();
    // Sets the new base URL that is prepended to the URLs for all audio files.
    if (!(typeof promptUrl == 'undefined'))
    	promptBaseUrl = promptUrl;
    
    var format;
    
    switch (type) {
        case 'boolean':
            return booleanPrompts(value);
        case 'date':
            return datePrompts(value, format);
        case 'digits':
            return alphanumericPrompts(value);
        case 'currency':
            return currencyPrompts(value);
        case 'number':
            return cardinalPrompts(value);
        case 'phone':
            return phonePrompts(value);
        case 'time':
            return timePrompts(value);
        case 'ordinal':
            return ordinalPrompts(value);
        case 'alphanumeric':
            return alphanumericPrompts(value);
        case 'dtmf':
            return dtmfPrompts(value);
        default:
            return void 0;
    }
}

function booleanPrompts(value)
{
    var promptsArray = new Array(1);
    if (value) {
        promptsArray[0] = promptBaseUrl + "miscellaneous/true" + audioFileExtension;
    } else {
        promptsArray[0] = promptBaseUrl + "miscellaneous/false" + audioFileExtension;
    }
    return promptsArray;
}
/**
 * Translates the date value into an array of vox file URLs
 * for playing the date.  The date must be in the ISO-8601
 * condensed format of YYYYMMDD.  One or more fields may be
 * left unspecified by substituting question mark characters
 * ("?") for a numeric value.  Output format will be in a
 * locale-specific ordering.   The format specification can
 * modify which fields are spoken.  If no format specification
 * parameter is given, the month and day are spoken.  Otherwise,
 * the date fields specified in the format specification will be
 * spoken.  Each output field is represented by a constant in the
 * Format class.  Multiple output fields are specified by 
 * bitwise OR'ing the appropriate constants.
 *
 * <pre>
 * Format f = new Format();
 * PlayBuiltinType("20020823", "date", f.SPEAK_MONTH |
 *                                     f.SPEAK_DAY |
 *                                     f.SPEAK_YEAR |
 *                                     f.SPEAK_DAY_OF_WEEK);
 * </pre>
 *
 * @param value The date in YYYYMMDD format.
 * @param format An optional format specification
 * @return An array of URL strings.
 */
function datePrompts(value, format)
{
    var year = value.substring(0, 4);
    var month = value.substring(4, 6);
    var day = value.substring(6, 8);
    var speakMonth;
    var speakDay;
    var speakYear;
    var speakDayOfWeek;
    var f = new Format();
    if (format != undefined) {
        speakMonth = format & f.SPEAK_MONTH;
        speakDay = format & f.SPEAK_DAY;
        speakYear = format & f.SPEAK_YEAR;
        speakDayOfWeek = format & f.SPEAK_DAY_OF_WEEK;
    } else {
        speakYear = true;
        speakDayOfWeek = false;
        speakDay = true;
        speakMonth = true;
    }
    if (day.substring(0, 1) == "0") {
        day = day.substring(1, 2);
    }
    var yearKnown = !(year == "????");
    var monthKnown = !(month == "??");
    var dayKnown = !(day == "??");
    if ((!yearKnown && !monthKnown && !dayKnown) ||
        (yearKnown && !monthKnown && dayKnown)) {
        return void 0;
    }
    var promptsArray;
    if (!yearKnown && !monthKnown && dayKnown) {
        promptsArray = new Array();
        /* In US English, a date phrase containing only the
         * day of the month begins with a definite article.
         */
        /* In US English, if the word following a definite article
         * begins with a vowel, the definite article is pronounced
         * "THEE".  If the word following the definite article 
         * begins with a consonant, the definite article is
         * pronounced "THUH".
         */
        if (speakDay) {
            if (day == 8 || day == 11 || day == 18) {
                promptsArray.push(promptBaseUrl + "miscellaneous/the1" + audioFileExtension);
            } else {
                promptsArray.push(promptBaseUrl + "miscellaneous/the2" + audioFileExtension);
            }
            promptsArray = promptsArray.concat(ordinalPrompts(day));
            return promptsArray;
        } else {
            return void 0;
        }
    }
    if (yearKnown && !monthKnown && !dayKnown) {
        if (speakYear) {
            return yearPrompts(year);
        } else {
            return void 0;
        }
    }
    
    if (!yearKnown && monthKnown && !dayKnown) {
        if (speakMonth) {
            return monthPrompts(month);
        } else {
            return void 0;
        }
    }
    if (yearKnown && monthKnown && !dayKnown) {
        promptsArray = new Array();
        if (speakMonth) {
            promptsArray = promptsArray.concat(monthPrompts(month));
        }
        if (speakYear) {
            promptsArray = promptsArray.concat(yearPrompts(year));
        }
        if (promptsArray.length > 0) {
            return promptsArray;
        } else {
            return void 0;
        }
    }
    if (!yearKnown && monthKnown && dayKnown) {
        promptsArray = new Array();
        if (speakMonth) {
            promptsArray = promptsArray.concat(monthPrompts(month));
        }
        if (speakDay) {
            promptsArray = promptsArray.concat(ordinalPrompts(day));
        }
        if (promptsArray.length > 0) {
            return promptsArray;
        } else {
            return void 0;
        }
    }
    if (yearKnown && monthKnown && dayKnown) {
        promptsArray = new Array();
        if (speakDayOfWeek) {
            // JavaScript months are 0-indexed.
            var date = new Date(year, month - 1, day);
            var dayOfWeek = date.getDay();
            promptsArray = promptsArray.concat(dayOfWeekPrompts(dayOfWeek));
        }
        if (speakMonth) {
            promptsArray = promptsArray.concat(monthPrompts(month));
        }
        if (speakDay) {
            promptsArray = promptsArray.concat(ordinalPrompts(day));
        }
        if (speakYear) {
            promptsArray = promptsArray.concat(yearPrompts(year));
        }
        if (promptsArray.length > 0) {
            return promptsArray;
        } else {
            return void 0;
        }
    }
}
/**
 * Translates the currency value into an array of vox file URLs
 * for playing the currency.  The currency amount must be a number
 * which may contain either a whole number part, or a decimal part, or
 * both, and is optionally preceeded by a currency specifier.  The
 * currency specifier may either be an ISO-4217 currency code, e.g.
 * USD, EUR, JPY, CHF, CAD, GBP, or MXN, or it may be one of the
 * following currency symbols: $ = USD, &#163; = GBP, &#8364; = EUR,
 * &#165; = JPY.  If no currency is specified, the currency of the
 * current locale will be used, e.g. USD for en-US, and EUR for fr-FR.
 *
 * @param value The currency amount.
 * @return An array of URL strings.
 */
function currencyPrompts(value)
{
    var currency;
    var valueStart;
    var decimalPoint;
    var fraction;
    var amount;
    if (value.charAt(0) == "$") {
        currency = "USD";
        valueStart = 1;
    } else if (value.charAt(0) == "\u00A3") {
        currency = "GBP";
        valueStart = 1;
    } else if (value.charAt(0) == "\u00A5") {
        currency = "JPY";
        valueStart = 1;
    } else if (value.charAt(0) == "\u20AC" || value.charAt(0) === "\u0080") {
        currency = "EUR";
        valueStart = 1;
    } else if (value.substring(0, 3).match(/^[A-Za-z][A-Za-z][A-Za-z]$/)) {
       currency = value.substring(0, 3);
       valueStart = 3;
    } else {
       currency = "USD";
       valueStart = 0;
    }
    decimalPoint = value.indexOf(".");
    if (decimalPoint == -1) {
        amount = value.substring(valueStart);
        fraction = 0;
    } else if (decimalPoint == 3) {
        if (valueStart < decimalPoint) {
            amount = value.substring(valueStart, decimalPoint);
        } else {
            amount = 0;
        }
        fraction = value.substring(decimalPoint + 1);
    } else {
        amount = value.substring(valueStart, decimalPoint);
        fraction = value.substring(decimalPoint + 1);
    }
    var promptsArray = new Array();
    if (amount > 0) {
        promptsArray = promptsArray.concat(cardinalPrompts(amount));
        promptsArray = promptsArray.concat(currencyNamePrompts(currency, amount != 1));
        if (fraction > 0) {
            promptsArray.push(promptBaseUrl + "miscellaneous/and" + audioFileExtension);
        }
    }
    if (fraction > 0) {
    	if (fraction.length == 1)
        	fraction += '0';
        promptsArray = promptsArray.concat(cardinalPrompts(fraction));
        promptsArray = promptsArray.concat(subcurrencyNamePrompts(currency, fraction != 1));
    }
    if (amount == 0 && fraction == 0) {
        promptsArray = promptsArray.concat(cardinalPrompts(0));
        promptsArray = promptsArray.concat(currencyNamePrompts(currency, true));
    }
    return promptsArray;
}
function currencyNamePrompts(value, isPlural)
{
    value = value.toUpperCase();
    switch(value) {
        case "AUD":
        case "BRL":
        case "CAD":
        case "CHF":
        case "CNY":
        case "DEM":
        case "EUR":
        case "GBP":
        case "HKD":
        case "INR":
        case "JPY":
        case "MXN":
        case "PKR":
        case "RUB":
        case "SGD":
        case "USD":
        	if (isPlural) {
                return new Array(promptBaseUrl + "currency/" + value + "_pl" + audioFileExtension);
        	} else {
                return new Array(promptBaseUrl + "currency/" + value + audioFileExtension);
        	}
        default:
            return void 0;
    }
}
function subcurrencyNamePrompts(value, isPlural)
{
    value = value.toUpperCase();
    switch(value) {
		case "AUD":
		case "BRL":
		case "CAD":
		case "CHF":
		case "CNY":
		case "DEM":
		case "EUR":
		case "GBP":
		case "HKD":
		case "INR":
		case "MXN":
		case "PKR":
		case "RUB":
		case "SGD":
		case "USD":  
            if (isPlural) {
                return new Array(promptBaseUrl + "currency/" + value + "_sub_pl" + audioFileExtension);
            } else {
                return new Array(promptBaseUrl + "currency/" + value + "_sub" + audioFileExtension);
            }
        default:
            return void 0;
    }
}
// FIXME - 800 as eight hundred
// FIXME - 408 as four oh eight
function phonePrompts(value)
{
    var phoneNumber;
    var extension;
    var xIndex;
    xIndex = value.indexOf("x");
    if (xIndex != -1) {
        phoneNumber = value.substring(0, xIndex);
        extension = value.substring(xIndex + 1);
    } else {
        phoneNumber = value;
        extension = "";
    }
    
    var promptsArray = new Array();
    if (phoneNumber.length == 10) {
        promptsArray = promptsArray.concat(
            phoneThreeDigitGroupPrompts(phoneNumber.substring(0, 3)),
            promptBaseUrl + "miscellaneous/350ms" + audioFileExtension,
            phoneThreeDigitGroupPrompts(phoneNumber.substring(3, 6)),
            promptBaseUrl + "miscellaneous/350ms" + audioFileExtension,
            phoneThreeDigitGroupPrompts(phoneNumber.substring(6)));
    } else if (phoneNumber.length == 7) {
        promptsArray = promptsArray.concat(
            phoneThreeDigitGroupPrompts(phoneNumber.substring(0, 3)),
            promptBaseUrl + "miscellaneous/350ms" + audioFileExtension,
            
            alphanumericPrompts(phoneNumber.substring(3)));
    } else {
        promptsArray = alphanumericPrompts(phoneNumber);
    }
    if (extension.length > 0) {
        promptsArray.push(promptBaseUrl + "miscellaneous/extension" + audioFileExtension);
        promptsArray = promptsArray.concat(alphanumericPrompts(extension));
    }
    return promptsArray;        
}
function phoneThreeDigitGroupPrompts(value)
{
    if (value.charAt(1) == "0" && value.charAt(2) == "0") {
        return cardinalPrompts(value);
    } else {
        return alphanumericPrompts(value);
    }
}
function timePrompts(value)
{
    var hours;
    var minutes;
    var seconds;
    var format;
    if (value.match(/^[0-9]+$/)) {
        if (value.length == 4) {
            hours = value.substring(0, 2);
            minutes = value.substring(2, 4);
        } else if (value.length == 6) {
            hours = value.substring(0, 2);
            minutes = value.substring(2, 4);
            seconds = value.substring(4, 6);
        } else {
            return void 0;
        }
        if (hours >= 1 && hours <= 12) {
            format = "?";
        } else if (hours == 0 || (hours >= 13 && hours <= 24)) {
            format = "h";
        } else {
            return void 0;
        }
    } else if (value.match(/^[0-9]+[?hap]$/)) {
        if (value.length == 5) {
            hours = value.substring(0, 2);
            minutes = value.substring(2, 4);
            format = value.substring(4, 5);
        } else if (value.length == 7) {
            hours = value.substring(0, 2);
            minutes = value.substring(2, 4);
            seconds = value.substring(4, 6);
            format = value.substring(6, 7);
        } else {
            return void 0;
        }
    } else {
        return void 0;
    }
    var promptsArray = new Array();
    promptsArray = promptsArray.concat(cardinalPrompts(hours));
    if (minutes == "00") {
        if (format == "a" || format == "p" || format == "?") {
            promptsArray.push(promptBaseUrl + "miscellaneous/oclock" + audioFileExtension);
        } else if (format == "h") {
            promptsArray.push(promptBaseUrl + "cardinals/hundred" + audioFileExtension);
            promptsArray.push(promptBaseUrl + "miscellaneous/hours" + audioFileExtension);
        }
    } else if (minutes > 0 && minutes < 10) {
        promptsArray = promptsArray.concat(alphanumericPrompts("O"));
        promptsArray = promptsArray.concat(cardinalPrompts(minutes));
    } else {
        promptsArray = promptsArray.concat(cardinalPrompts(minutes));
    }
    if (format == "a") {
        promptsArray.push(promptBaseUrl + "miscellaneous/am" + audioFileExtension);
    } else if (format == "p") {
        promptsArray.push(promptBaseUrl + "miscellaneous/pm" + audioFileExtension);
    }
    if (seconds != undefined)  {
        promptsArray.push(promptBaseUrl + "miscellaneous/and" + audioFileExtension);
        promptsArray.push(cardinalPrompts(seconds));
        if (seconds == 1) {
            promptsArray.push(promptBaseUrl + "miscellaneous/second" + audioFileExtension);
        } else {
            promptsArray.push(promptBaseUrl + "miscellaneous/seconds" + audioFileExtension);
        }
    }
    return promptsArray;
}
function yearPrompts(year)
{
    var century = year.substring(0,2);
    var rest = year.substring(2,4);
    var promptsArray = new Array();
    if (century == "20") {
        promptsArray = promptsArray.concat(cardinalPrompts(2000));
    } else {
        promptsArray = promptsArray.concat(cardinalPrompts(century));
    }
    if (century != "20") {
        if (rest == "00") {
            promptsArray.push(promptBaseUrl + "cardinals/hundred" + audioFileExtension);
        } else if (rest > 0 && rest < 10) {
            promptsArray = promptsArray.concat(alphanumericPrompts("O"));
            promptsArray =
                promptsArray.concat(cardinalPrompts(rest.substring(1,2)));
        } else {
            promptsArray = promptsArray.concat(cardinalPrompts(rest));
        }
    } else {
        if (rest != "00") {
            promptsArray = promptsArray.concat(cardinalPrompts(rest))
        }
    }
    return promptsArray;
}
function monthPrompts(month)
{
    if (month >= 1 && month <= 12) {
        return new Array(promptBaseUrl + "months/" + month + "" + audioFileExtension);
    } else {
        return void 0;
    }
}
function dayOfWeekPrompts(dayOfWeek)
{
    if (dayOfWeek >= 0 && dayOfWeek <= 6) {
        return new Array(promptBaseUrl + "days/" + dayOfWeek + "" + audioFileExtension);
    } else {
        return void 0;
    }
}
function cardinalPrompts(number)
{
    if (number === undefined || !isFinite(number)) {
        return void 0;
    }
    if (number > 999999999999999) {
        return void 0;
    }
    var isNegative;
    if (number < 0) {
        isNegative = true;
        number = Math.abs(number);
    }
    
    if (number == 0) {
        return new Array(promptBaseUrl + "cardinals/000" + audioFileExtension);
    }
    var str = new String(number);
    var arr = str.split(".");
    number  = new Number(arr[0]);
    if (arr[1] != undefined)
    {
    	var fractionalPart = arr[1];
    }
    
    /*var fractionalPart = number - Math.floor(number);
    number = number - fractionalPart;*/
    var promptsArray = new Array();
    var magnitude = 0;
    while (number > 0) {
        var endDigits = number % 1000;
        if (endDigits != 0) {
            promptsArray = threeDigitsPrompts(endDigits).concat(magnitudePrompts(magnitude), promptsArray);
        }
        number = number - endDigits;
        number = number / 1000;
        magnitude++;
    }
    if (isNegative) {
        promptsArray.unshift(promptBaseUrl + "miscellaneous/minus" + audioFileExtension);
    }
    if ( (fractionalPart != undefined) && (fractionalPart != 0) ) {
        fractionalPart = fractionalPart.toString();//.substring(2);
        promptsArray.push(promptBaseUrl + "miscellaneous/point" + audioFileExtension); 
        promptsArray = promptsArray.concat(alphanumericPrompts(fractionalPart));
    }
    return promptsArray;
} 
function threeDigitsPrompts(number)
{
    // assert number >=0 && number <= 999
    if (number < 0 || number > 999) {
        return void 0;
    }
    var hundreds = Math.floor(number / 100);
    var tensAndOnes = number % 100;
    var promptsArray = new Array();
    if (hundreds > 0) {
        promptsArray.push(promptBaseUrl + "cardinals/" + hundreds + "00" + audioFileExtension);
    }
    if (tensAndOnes > 0) {
        if (tensAndOnes < 10) {
            promptsArray.push(promptBaseUrl + "cardinals/00" + tensAndOnes + "" + audioFileExtension);
        } else {
            promptsArray.push(promptBaseUrl + "cardinals/0" + tensAndOnes + "" + audioFileExtension);
        }
    }
    return promptsArray;
}
function ordinalThreeDigitsPrompts(number)
{
    // assert number >=0 && number <= 999
    if (number < 0 || number > 999) {
        return void 0;
    }
    var hundreds = Math.floor(number / 100);
    var tensAndOnes = number % 100;
    var promptsArray = new Array();
    if (hundreds > 0) {
        if (tensAndOnes > 0) {
            promptsArray.push(promptBaseUrl + "cardinals/" + hundreds + "00" + audioFileExtension);
        } else {
            promptsArray.push(promptBaseUrl + "cardinals/00" + hundreds + "" + audioFileExtension);
            promptsArray.push(promptBaseUrl + "ordinals/hundredth" + audioFileExtension);
        }
    }
    if (tensAndOnes > 0) {
        if (tensAndOnes < 10) {
            promptsArray.push(promptBaseUrl + "ordinals/00" + tensAndOnes + "" + audioFileExtension);
        } else {
            promptsArray.push(promptBaseUrl + "ordinals/0" + tensAndOnes + "" + audioFileExtension);
        }
    }
    return promptsArray;
}
/**
 * Returns an array of vox file URLs corresponding to the
 * number 10^(3*number).
 *
 * Note the differences between the American and European systems:
 * <pre>
 *       Order of
 *       Magnitude      American    European
 *         10^0            -           -
 *         10^3         thousand    thousand
 *         10^6          million     million
 *         10^9          billion    thousand million or milliard
 *         10^12        trillion     billion
 * </pre>
 *
 * @param number The order of magnitude.
 * @return An array of URL strings.
 */
function magnitudePrompts(number)
{
    switch (number) {
        case 0:
            return new Array();
        case 1:
            return new Array(promptBaseUrl + "cardinals/thousand" + audioFileExtension); 
        case 2:
            return new Array(promptBaseUrl + "cardinals/million" + audioFileExtension);
        case 3:
            return new Array(promptBaseUrl + "cardinals/billion" + audioFileExtension);
        case 4:
            return new Array(promptBaseUrl + "cardinals/trillion" + audioFileExtension);
        default:
            return void 0;
    }
}
function ordinalMagnitudePrompts(number)
{
    switch (number) {
        case 0:
            return new Array();
        case 1:
            return new Array(promptBaseUrl + "ordinals/thousandth" + audioFileExtension); 
        case 2:
            return new Array(promptBaseUrl + "ordinals/millionth" + audioFileExtension); 
        case 3:
            return new Array(promptBaseUrl + "ordinals/billionth" + audioFileExtension); 
        case 4:
            return new Array(promptBaseUrl + "ordinals/trillionth" + audioFileExtension); 
        default:
            return void 0;
    }
}
function ordinalPrompts(number)
{
    if (number === undefined || !isFinite(number) || number <= 0 ||
        ((number - Math.floor(number)) != 0) || number > 999999999999999 ) {
        return void 0;
    }
    var promptsArray = new Array();
    var magnitude = 0;
    var ordinal = true;
    while (number > 0) {
        var endDigits = number % 1000;
        if (endDigits != 0) {
            if (magnitude == 0 && ordinal) {
                promptsArray =
                    ordinalThreeDigitsPrompts(endDigits).concat(promptsArray);
                ordinal = false;
            } else {
                if (ordinal) {
                    promptsArray = threeDigitsPrompts(endDigits).concat(ordinalMagnitudePrompts(magnitude), promptsArray);
                    ordinal = false;
                } else {
                    promptsArray = threeDigitsPrompts(endDigits).concat(magnitudePrompts(magnitude), promptsArray);
                }
            }
        }
        number = number - endDigits;
        number = number / 1000;
        magnitude++;
    }
    return promptsArray;
}
function alphanumericPrompts(string)
{
    var i;
    var ch;
    var promptsArray = new Array();
    string = string.toLowerCase();
    for (i = 0; i < string.length; i++) {
        ch = string.charAt(i);
        ch = ch.toLowerCase();
        if (ch.match(/\d/)) {
            promptsArray.push(promptBaseUrl + "cardinals/00" + ch + audioFileExtension);
        } else if (ch.match(/[a-z]/)) {
            promptsArray.push(promptBaseUrl + "letters/" + ch + audioFileExtension);
        } else if (ch.match(/\+/)) {
            promptsArray.push(promptBaseUrl + "miscellaneous/plus" + audioFileExtension);
        } else if (ch.match(/\</)) {
            promptsArray.push(promptBaseUrl + "miscellaneous/lessthan" + audioFileExtension);
        } else if (ch.match(/\=/)) {
            promptsArray.push(promptBaseUrl + "miscellaneous/equals" + audioFileExtension);
        } else if (ch.match(/\%/)) {
            promptsArray.push(promptBaseUrl + "miscellaneous/percent" + audioFileExtension);
        } else if (ch.match(/\-/)) {
            promptsArray.push(promptBaseUrl + "miscellaneous/minus" + audioFileExtension);
        } else if (ch.match(/\>/)) {
            promptsArray.push(promptBaseUrl + "miscellaneous/greaterthan" + audioFileExtension);
        } else if (ch.match(/\&/)) {
            promptsArray.push(promptBaseUrl + "miscellaneous/and" + audioFileExtension);
        } else if (ch.match(/\./)) {
            promptsArray.push(promptBaseUrl + "miscellaneous/dot" + audioFileExtension);
        } else if (ch.match(/\#/)) {
            promptsArray.push(promptBaseUrl + "miscellaneous/pound" + audioFileExtension);
        } else if (ch.match(/\*/)) {
            promptsArray.push(promptBaseUrl + "miscellaneous/star" + audioFileExtension);
        } else if (ch.match(/\@/)) {
            promptsArray.push(promptBaseUrl + "miscellaneous/at" + audioFileExtension);
        } else  {
            promptsArray.push(promptBaseUrl + "miscellaneous/special_character" + audioFileExtension);        	
        }
    }
    return promptsArray;
}
function dtmfPrompts(string)
{
    var i;
    var ch;
    var promptsArray = new Array();
    string = string.toLowerCase();
    for (i = 0; i < string.length; i++) {
        ch = string.charAt(i);
        if (ch.match(/[0-9abcd]/)) {
            promptsArray.push("builtin:dtmf/dtmf_" + ch + audioFileExtension);
        } else if (ch == "#") {
            promptsArray.push("builtin:dtmf/dtmf_pound" + audioFileExtension);
        } else if (ch == "*") {
            promptsArray.push("builtin:dtmf/dtmf_star" + audioFileExtension);
        }
    }
    return promptsArray;
}
