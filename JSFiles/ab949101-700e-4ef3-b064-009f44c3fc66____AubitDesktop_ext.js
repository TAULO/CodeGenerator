
"use strict";


Ext.define('AubitDesktop.Convert', {
    statics: {
	tryParseInt: function(value,obj) {
		var val=parseInt(value);
		if (!isNaN(val)) {
			obj.v=val;
			return true;
		}
		return false;
	},
	tryParseFloat: function(value,obj) {
		var val=parseFloat(value);
		if (!isNaN(val)) {
			obj.v=val;
			return true;
		}
		return false;
	},
        toDecimal: function (value) {
            return parseFloat(value);
        },
        toInt32: function (d) {
            return parseInt(d.toString(),10);
        },
        toInt32$1: function (l) {
            return parseInt(l.toString());
        },
        toDouble: function (l) {
		return parseFloat(l);
        },
        toDateTime: function (l, fmt) {
            return Ext.Date.parse(l, fmt,true);

        }
    }
});

Ext.define('AubitDesktop.extensionString', {
    statics: {
        contains: function (n, y) {
            if (n.indexOf( y) !== -1)
                return true;
            return false;
        },
        padLeft: function (n, num, ch) {
            if (ch === void 0) { ch = " "; }
            while (n.length < num) {
                n = ch + n;
            }
            return n;
        },
        trimStart: function (n) {
            while (n.length > 0) {
                if (n.charCodeAt(0) === 32) {
                    n = n.substr(1);
                    continue;
                }
                break;
            }
            return n;
        },
        roundIt: function (value, decimals, mode) {
    		return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
        }
    }
});

Ext.define('AubitDesktop.FGLConstruct', {
    statics: {
	contains: function(str, find) {
		return str.indexOf(find)>=0;
	},
	decode_datatype: function(sqlType) {
		if (sqlType.indexOf("VARCHAR")>-1) {
        		return AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_VCHAR;
		}
		if (sqlType.indexOf("NCHAR")>-1) {
        		return AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_NCHAR;
		}
		if (sqlType.indexOf("CHAR")>-1) {
        		return AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_CHAR;
		}
		if (sqlType.indexOf("SMALLINT")>-1) {
        		return AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_SMINT;
		}
		if (sqlType.indexOf("INTEGER")>-1) {
        		return AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_INT;
		}
		if (sqlType.indexOf("FLOAT")>-1) {
        		return AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_FLOAT;
		}
		if (sqlType.indexOf("SMALLFLOAT")>-1) {
        		return AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_SMFLOAT;
		}
		if (sqlType.indexOf("DECIMAL")>-1) {
        		return AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_DECIMAL;
		}
		if (sqlType.indexOf("SERIAL")>-1) {
        		return AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_SERIAL;
		}
		if (sqlType.indexOf("DATETIME")>-1) {
        		return AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_DTIME;
		}
		if (sqlType.indexOf("DATE")>-1) {
        		return AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_DATE;
		}
		if (sqlType.indexOf("MONEY")>-1) {
        		return AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_MONEY;
		}
		if (sqlType.indexOf("BYTE")>-1) {
        		return AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_BYTE;
		}
		if (sqlType.indexOf("TEXT")>-1) {
        		return AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_TEXT;
		}
		if (sqlType.indexOf("INTERVAL")>-1) {
        		return AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_INTERVAL;
		}
		if (sqlType.indexOf("INT8")>-1) {
        		return AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_INT8;
		}
		if (sqlType.indexOf("SERIAL8")>-1) {
        		return AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_INT8;
		}
		throw "Unknown SqlType "+sqlType;
	}, 
	decode_datatype_length: function(sqlType) {
		var brckt;
		var dec;
		brckt=sqlType.indexOf("(");
		if (brckt!=-1) {
			brckt=sqlType.substr(brckt+1).replace(")","");
			dec=brckt.split(",");
		}
		
		switch (AubitDesktop.FGLConstruct.decode_datatype(sqlType)) {
        		case  AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_SMINT: 
        		case  AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_INT: 
        		case  AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_FLOAT:
        		case  AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_SMFLOAT: 
        		case  AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_SERIAL: 
        		case  AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_INT8: 
        		case  AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_SERIAL8: 
        		case  AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_DATE: 
        		case  AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_BYTE: 
        		case  AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_TEXT: 
				return 0;

        		case  AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_CHAR: 
        		case  AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_VCHAR: 
        		case  AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_NCHAR: 
				return parseInt(brckt,10);

        		case  AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_DTIME: 
				if (AubitDesktop.FGLConstruct.contains(sqlType,"DAY TO DAY")) { return 0x33;}
				if (AubitDesktop.FGLConstruct.contains(sqlType,"DAY TO FRACTION")) { return 0x38;}
				if (AubitDesktop.FGLConstruct.contains(sqlType,"DAY TO HOUR")) { return 0x34;}
				if (AubitDesktop.FGLConstruct.contains(sqlType,"DAY TO MINUTE")) { return 0x35;}
				if (AubitDesktop.FGLConstruct.contains(sqlType,"DAY TO SECOND")) { return 0x36;}
				if (AubitDesktop.FGLConstruct.contains(sqlType,"HOUR TO FRACTION")) { return 0x48;}
				if (AubitDesktop.FGLConstruct.contains(sqlType,"HOUR TO HOUR")) { return 0x44;}
				if (AubitDesktop.FGLConstruct.contains(sqlType,"HOUR TO MINUTE")) { return 0x45;}
				if (AubitDesktop.FGLConstruct.contains(sqlType,"HOUR TO SECOND")) { return 0x46;}
				if (AubitDesktop.FGLConstruct.contains(sqlType,"MINUTE TO FRACTION")) { return 0x58;}
				if (AubitDesktop.FGLConstruct.contains(sqlType,"MINUTE TO MINUTE")) { return 0x55;}
				if (AubitDesktop.FGLConstruct.contains(sqlType,"MINUTE TO SECOND")) { return 0x56;}
				if (AubitDesktop.FGLConstruct.contains(sqlType,"MONTH TO DAY")) { return 0x23;}
				if (AubitDesktop.FGLConstruct.contains(sqlType,"MONTH TO FRACTION")) { return 0x28;}
				if (AubitDesktop.FGLConstruct.contains(sqlType,"MONTH TO HOUR")) { return 0x24;}
				if (AubitDesktop.FGLConstruct.contains(sqlType,"MONTH TO MINUTE")) { return 0x25;}
				if (AubitDesktop.FGLConstruct.contains(sqlType,"MONTH TO MONTH")) { return 0x22;}
				if (AubitDesktop.FGLConstruct.contains(sqlType,"MONTH TO SECOND")) { return 0x26;}
				if (AubitDesktop.FGLConstruct.contains(sqlType,"SECOND TO FRACTION")) { return 0x68;}
				if (AubitDesktop.FGLConstruct.contains(sqlType,"SECOND TO SECOND")) { return 0x66;}
				if (AubitDesktop.FGLConstruct.contains(sqlType,"YEAR TO DAY")) { return 0x13;}
				if (AubitDesktop.FGLConstruct.contains(sqlType,"YEAR TO FRACTION")) { return 0x18;}
				if (AubitDesktop.FGLConstruct.contains(sqlType,"YEAR TO HOUR")) { return 0x14;}
				if (AubitDesktop.FGLConstruct.contains(sqlType,"YEAR TO MINUTE")) { return 0x15;}
				if (AubitDesktop.FGLConstruct.contains(sqlType,"YEAR TO MONTH")) { return 0x12;}
				if (AubitDesktop.FGLConstruct.contains(sqlType,"YEAR TO SECOND")) { return 0x16;}
				if (AubitDesktop.FGLConstruct.contains(sqlType,"YEAR TO YEAR")) { return 0x11;}
				return 0;

        		case  AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_INTERVAL: 
				return 0;

        		case  AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_DECIMAL:
				return dec[0]*16+dec[1];
        		case  AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_MONEY:
				return dec[0]*16+dec[1];
		}
	}, 
        getConstructString: function (colName, val, dtype, dtype_size) {
            //int a;
            var quote = "";
            var allow_range_character = true;
            var colname;
            allow_range_character = true;
            var inc_quotes = 0;

            if (val === null || val.trim() === "") {
                return ""; // Ignore it !
            }

            if (dtype === AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_CHAR || dtype === AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_NCHAR || dtype === AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_VCHAR)
                inc_quotes = 1;
            if (dtype === AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_DATE)
                inc_quotes = 2;
            if (dtype === AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_DTIME)
                inc_quotes = 3;
            if (dtype === AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_INTERVAL)
                inc_quotes = 4;

            if (inc_quotes > 0) {
                quote = "'";
            }

            colname = colName;
            if (Ext.String.startsWith(colname, ".")) {
                colname = colname.substring(1);
            }


            if (inc_quotes === 3 || inc_quotes === 4) {
                if (dtype === AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_DTIME) {
                    var p;
                    var a;
                    // DATETIME RANGE KLUDGE
                    // one problem we have is if we have a datetime - and a range
                    //
                    // Lets figure out how long out datetime should be
                    // Quick and dirty way is to measure the length of
                    // a 'CURRENT' with the same dimensions...

                    p = Ext.String.format(AubitDesktop.FGLUtils.formatForDatetime(dtype_size >> 4, dtype_size & 15), null);

                    if (AubitDesktop.extensionString.contains(p,":")) {
                        // Darn - it contains a ':' - so we cant use this as a range character
                        allow_range_character = false;
                    }
                    else  {
                        allow_range_character = true;
                    }
                    a = p.length;


                    if (allow_range_character === false) {
                        // Special case - imagine HH:MM  to HH:MM
                        // We can use the specific size to check for HH:MM:HH:MM

                        if (val.length > a) {
                            // its a candidate..
                            if (val.substring(a) === ":") {
                                val = val.substring(0, a - 1) + ".." + val.substring(a + 1);
                            }
                        }
                    }
                }

            }




            var entries = val.split("|");

            var srch;

            srch = [];

            for (var a1 = 0; a1 < entries.length; a1++) {
                var v_e = entries[a1];

                var v;
                v = v_e.trim();


                if (v === "=" || v === "=''") {
                    srch.push("is null");
                    continue;
                }

                if (v === "!=" || v === "<>" || v === "<>''" || v === "!=''") {
                    srch.push(colname + " is not null");
                    continue;
                }

                if (Ext.String.startsWith(v, "..")) { // We allow ..X and X.. to be <=X and >=X
                    v = "<=" + val.substring(2);
                }

                if (Ext.String.startsWith(v, ":")) {
                    // We allow ..X and X.. to be <=X and >=X      
                    v = "<=" + val.substring(2);
                }

                if (Ext.String.endsWith(v, "..")) { // We allow ..X and X.. to be <=X and >=X
                    v = ">=" + val.substring(2);
                }

                if (Ext.String.endsWith(v, ":")) {
                    // We allow ..X and X.. to be <=X and >=X      
                    v = ">=" + val.substring(2);
                }



                if (AubitDesktop.extensionString.contains(v,"..")) {

                    var range = v.split("..");
                    if (range.length !== 2) {
                        return null;
                    }
                    else  {
                        if (!AubitDesktop.FGLConstruct.isConstructValueValid(dtype, dtype_size, range[0]))
                            return null;
                        if (!AubitDesktop.FGLConstruct.isConstructValueValid(dtype, dtype_size, range[1]))
                            return null;
                        srch.push(colname + " between " + AubitDesktop.FGLConstruct.quoteEscape(range[0], quote) + " and " + AubitDesktop.FGLConstruct.quoteEscape(range[1], quote));
			continue;
                    }
                }

                if (allow_range_character && AubitDesktop.extensionString.contains(v,":")) {

                    var range1 = v.split(":");
                    if (range1.length !== 2) {
                        return null;
                    }
                    else  {
                        if (!AubitDesktop.FGLConstruct.isConstructValueValid(dtype, dtype_size, range1[0]))
                            return null;
                        if (!AubitDesktop.FGLConstruct.isConstructValueValid(dtype, dtype_size, range1[1]))
                            return null;
                        srch.push(colname + " between " + AubitDesktop.FGLConstruct.quoteEscape(range1[0], quote) + " and " + AubitDesktop.FGLConstruct.quoteEscape(range1[1], quote));
			continue;
                    }

                }


                if (Ext.String.startsWith(v, ">=")) {
                    if (!AubitDesktop.FGLConstruct.isConstructValueValid(dtype, dtype_size, v.substring(2))) {
                        return null;
                    }
                    srch.push(colname + ">=" + AubitDesktop.FGLConstruct.quoteEscape(v.substring(2), quote));
			continue;
                }

                if (Ext.String.startsWith(v, "<=")) {
                    if (!AubitDesktop.FGLConstruct.isConstructValueValid(dtype, dtype_size, v.substring(2))) {
                        return null;
                    }
                    srch.push(colname + "<=" + AubitDesktop.FGLConstruct.quoteEscape(v.substring(2), quote));
			continue;
                }

                if (Ext.String.startsWith(v, "<>") || Ext.String.startsWith(v, "!=")) {
                    if (!AubitDesktop.FGLConstruct.isConstructValueValid(dtype, dtype_size, v.substring(2))) {
                        return null;
                    }

                    srch.push(colname + "!=" + AubitDesktop.FGLConstruct.quoteEscape(v.substring(2), quote));
			continue;
                }

                if (Ext.String.startsWith(v, "==")) {
                    if (!AubitDesktop.FGLConstruct.isConstructValueValid(dtype, dtype_size, v.substring(2))) {
                        return null;
                    }

                    srch.push(colname + "=" + AubitDesktop.FGLConstruct.quoteEscape(v.substring(2), quote));
			continue;
                }

                if (Ext.String.startsWith(v, "=")) {
                    if (!AubitDesktop.FGLConstruct.isConstructValueValid(dtype, dtype_size, v.substring(1))) {
                        return null;
                    }
                    srch.push(colname + "=" + AubitDesktop.FGLConstruct.quoteEscape(v.substring(1), quote));
			continue;
                }

                if (Ext.String.startsWith(v, ">")) {
                    if (!AubitDesktop.FGLConstruct.isConstructValueValid(dtype, dtype_size, v.substring(1))) {
                        return null;
                    }
                    else  {
                        srch.push(colname + ">" + AubitDesktop.FGLConstruct.quoteEscape(v.substring(1), quote));
			continue;

                    }
                }
                if (Ext.String.startsWith(v, "<")) {
                    if (!AubitDesktop.FGLConstruct.isConstructValueValid(dtype, dtype_size, v.substring(1))) {
                        return null;
                    }
                    else  {
                        srch.push(colname + "<" + AubitDesktop.FGLConstruct.quoteEscape(v.substring(1), quote));
			continue;
                    }
                }


                // Drop through to an "=" ...
                if (!AubitDesktop.FGLConstruct.isConstructValueValid(dtype, dtype_size, v)) {
                    return null;
                }
                else  {
                    srch.push(colname + "=" + AubitDesktop.FGLConstruct.quoteEscape(v, quote));
			continue;
                }
            }

            if (srch.length === 0)
                return "";
            if (srch.length === 1)
                return srch[0];
            var rval = "";

            for (var a11 = 0; a11 < srch.length; a11++) {
                var s = srch[a11];
                if (rval === "")
                    rval = "(" + s + ")";
                else 
                    rval += " OR (" + s + ")";
            }
            return rval;

        },
        quoteEscape: function (p, quote) {
            if (quote === null || quote === "") {
                return p;
            }

            if (quote === "'") {
                return quote + p.replace( "'", "\\'") + quote;
            }
            else  {
                throw "Invalid quote character";
            }

        },
        isConstructValueValid: function (dtype, dtype_size, p) {
            return AubitDesktop.FGLUtils.isValidForType(dtype, p, null, dtype_size);
        }
    }
});

Ext.define('AubitDesktop.FGLContextType', {
    statics: {
        contextNone: 0,
        contextInputNone: 1,
        contextInput: 2,
        contextConstruct: 3,
        contextConstructArray: 4,
        contextConstructArrayInactive: 5,
        contextDisplayArray: 6,
        contextDisplayArrayInactive: 7,
        contextInputArray: 8,
        contextInputArrayInactive: 9,
        contextMenu: 10,
        contextPrompt: 11
    }
});

Ext.define('AubitDesktop.FGLKeyEvent', {
    keyId: null,
    iD: 0,
    constructor: function (Key, ID) {
        this.keyId = Key;
        this.iD = ID;
    },
    isKey: function (key) {
        // @todo  Add tests for numeric Key IDs..
        if (this.keyId === key)
            return true;
        return false;
    }
});

Ext.define('AubitDesktop.FGLUsing', {
    statics: {
        a4GL_func_using: function (fmt, value, dt) {
            var longStr = "                                                                                    ";

            if (value === null) {
                fmt = longStr.substring(0, fmt.length);
                return fmt;
            }
	    if (!Ext.isString(value)) {
		value=""+value;
	    }
            	if (value.trim().length === 0) {
                	fmt = longStr.substring(0, fmt.length);
                	return fmt;
            	}
	    

            switch (dt) {
                case AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_DECIMAL: 
                case AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_MONEY: 
                    var isneg1 = false;
                    var p1;
                    p1 = AubitDesktop.FGLUtils.toCharArray(value); 
                    for (var a = 0; a < p1.length; a++) {
                        if (p1[a] >= 48 && p1[a] <= 57)
                            continue;
                        if (p1[a] === 46) {
                            p1[a] = 46;
                            continue;
                        }
                        if (p1[a] === 45) {
                            p1[a] = 32;
                            isneg1 = true;
                            continue;
                        }
                        p1[a] = 32;
                    }
                    return AubitDesktop.FGLUsing.a4gl_using_from_string(fmt, value, isneg1);
                case AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_BYTE: 
                case AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_SMINT: 
                case AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_INT: 
                case AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_SERIAL: 
                case AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_SMFLOAT: 
                case AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_FLOAT: 
                    return AubitDesktop.FGLUsing.a4gl_using(fmt, value);
                case AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_DATE: 
                    return AubitDesktop.FGLUsing.a4gl_using_date(fmt, value);
                case AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_CHAR: 
                case AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_NULL: 
                case AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_DTIME: 
                case AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_TEXT: 
                case AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_VCHAR: 
                case AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_INTERVAL: 
                case AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_NCHAR: 
                default: 
                    if (AubitDesktop.extensionString.contains(fmt,"dd") || AubitDesktop.extensionString.contains(fmt,"mm") || AubitDesktop.extensionString.contains(fmt,"yy") || AubitDesktop.extensionString.contains(fmt,"DD") || AubitDesktop.extensionString.contains(fmt,"MM") || AubitDesktop.extensionString.contains(fmt,"YY")) {
                        return AubitDesktop.FGLUsing.a4gl_using_date(fmt, value);
                    }
                    else  {
                        return AubitDesktop.FGLUsing.a4gl_using(fmt, value);
                    }
            }
        },
        a4gl_using_from_string: function (fmt, value, isneg) {


            var overflow;
            var fm1 = "";
            var fm2 = "";

            var str_as_string;
            var has_money = false;
            var p = 0;
            var num_places = 64;
            var canfloat_head = [42, 45, 43, 40, 36];
            var rep_digit = [42, 38, 35, 60, 45, 43, 40, 41, 36];
            var buff;
            var a = 0, variable_called_b = 0;
            var isprnt = false;
            var buff_decimal;
            var buff_integer;
            var s;
            //string ptr_decimal;
            var str;

            var M_main;


            var lb = 0;
            var cb = 0;



            s = fmt.length;




            overflow = "";
            overflow = AubitDesktop.extensionString.padLeft(overflow, fmt.length, "*");

            for (a = 0; a < fmt.length; a++) {
                if (fmt.substring(a, 1) === "(")
                    lb++;
                if (fmt.substring(a, 1) === ")")
                    cb++;
            }




            if (lb > 1 && cb > 1) {
                throw "Cant have more than one '(' and more than one ')' in a format string";

            }


            if (lb > 0 && cb > 0) { // we've got some brackets..


                var buff2;


                var eob;
                buff = fmt.substring(fmt.indexOf( "(") + 1);
                eob = String.indexOf(buff, ")");
                if (eob === -1) { // its all gone pete tong..
                    return "";
                }
                buff = buff.substring(0, eob - 1);
                buff2 =  AubitDesktop.FGLUtils.toCharArray(buff); 

                for (a = 0; a < buff2.length; a++) {
                    if (lb === 1 && cb === 1) {
                        if (buff2[a] === 40)
                            buff2[a] = 35;
                        if (buff2[a] === 41)
                            buff2[a] = 35;
                    }

                    if (lb > 1 && cb === 1) {
                        if (buff2[a] === 40)
                            buff2[a] = 35;
                    }
                    if (lb === 1 && cb > 1) {
                        if (buff2[a] === 41)
                            buff2[a] = 35;
                    }

                }

                var res = AubitDesktop.FGLUsing.a4gl_using_from_string(String.fromCharCode.apply(null, buff2), value, false);
                var fmtorig = fmt;
                fmt = fmt.substring(0, fmt.indexOf("(") + 1);
                fmt += res;
                fmt += fmtorig.substring(eob + 1);

                if (!isneg) {
                    if (fmt.indexOf("(") >= 0 && fmt.indexOf( ")") >= 0) {

                        fmt = fmt.replace("(", " ");
                        fmt = fmt.replace( ")", " ");
                    }
                    else  {
                        if (lb > 1) {
                            var cfmt;
                            cfmt =  AubitDesktop.FGLUtils.toCharArray(fmt);
                            for (a = 0; a < cfmt.length; a++) {
                                if (cfmt[a] === 40 && cfmt[a + 1] === 32) {
                                    cfmt[a] = 32;
                                    cfmt[a + 1] = 40;
                                }
                            }
                            fmt = String.fromCharCode.apply(null, cfmt);
                        }


                        if (cb > 1) {
                            var cfmt1;
                            cfmt1 =  AubitDesktop.FGLUtils.toCharArray(fmt);
                            for (a = 0; a < cfmt1.length; a++) {
                                if (cfmt1[a] === 32 && cfmt1[a + 1] === 41) {
                                    cfmt1[a] = 41;
                                    cfmt1[a + 1] = 32;
                                }
                            }
                            fmt = String.fromCharCode.apply(null, cfmt1);
                        }
                    }
                }


                return fmt;

            }


            try {
                M_main  = AubitDesktop.Convert.toDecimal(value);
            }
            catch (err) {
                return "";
            }


            if (fmt.indexOf( String.fromCharCode(46)) >= 0) {
                var lbuff;
                var pos_dot;
                pos_dot = fmt.indexOf( String.fromCharCode(46));
                lbuff = fmt.substring(pos_dot + 1);
                fm1 = fmt.substring(0, pos_dot);
                AubitDesktop.extensionString.trimStart(lbuff);
                num_places = lbuff.length;
                fm2 = lbuff;
            }
            else  {
                fm1 = fmt;
                fm2 = "";
                num_places = 0;
            }


            var n =parseFloat(value);

            AubitDesktop.extensionString.roundIt(n, num_places, 4);
            var intPart = n.toFixed(0);
            var justDecPart = n-intPart;

            buff_decimal = justDecPart.toString();
            buff_integer = intPart.toString();
            // should always start "0."
            if (buff_decimal === "0") {
                buff_decimal = "0.0";
            }

            buff_decimal = buff_decimal.substring(2);
            buff_integer = AubitDesktop.extensionString.padLeft(buff_integer, 31);


            if (num_places > 64 || buff_decimal.length >= 64) {

                // Its too big...

                return overflow;
            }
            buff_decimal = buff_decimal + "000000000000000000000000000000000";

            buff_decimal = buff_decimal.substring(0, 32);

            str =  AubitDesktop.FGLUtils.toCharArray(fmt);
            variable_called_b = 30;
            isprnt = true;

            // first, ensure the format string is wide enough to hold the number
            // if not, try drop trailing decimals, otherwise flag overflow with *'s
            {
                var f_cnt = 0; // number of digits to left of dec. point in format
                var d_cnt = 0; // number of digits to right of dec. point
                var n_cnt;
                if (isneg) {
                    n_cnt = 1; // number of left-digits needed for number supplied
                }
                else  {
                    n_cnt = 0;
                }

                if (isneg) {
                    if (AubitDesktop.extensionString.contains(fmt,"(") || AubitDesktop.extensionString.contains(fmt,")") || AubitDesktop.extensionString.contains(fmt,"+") || AubitDesktop.extensionString.contains(fmt,"-")) {

                    }
                    else  {
                        // No negative bit to display :-)
                        // so - we dont need to allow extra space for it...
                        n_cnt = 0;
                    }
                }
                else  {
                    if (AubitDesktop.extensionString.contains(fmt,"(") || AubitDesktop.extensionString.contains(fmt,")") || AubitDesktop.extensionString.contains(fmt,"+") || AubitDesktop.extensionString.contains(fmt,"-")) {
                        var compatfmt = true;
                        if (compatfmt) {
                            n_cnt = 1;
                        }
                    }
                }


                // count format string number place holders, up to decimal point
                for (a = 0; a < fmt.length; a++) {
                    if (fmt.charCodeAt(a) === 46)
                        break;
                    if (AubitDesktop.FGLUsing.cHAR_INDEX(rep_digit, fmt.charCodeAt(a)) !== -1)
                        f_cnt++;
                }
                // count format string number place holders, after the decimal point
                while (a < fmt.length) {
                    if (AubitDesktop.FGLUsing.cHAR_INDEX(rep_digit, fmt.charCodeAt(a)) !== -1)
                        d_cnt++;
                    a++;
                }
                // count the digits in the integer part of the number
                for (a = variable_called_b; (a > 0 && buff_integer.charCodeAt(a) !== 32); a--)
                    n_cnt++;


                if (AubitDesktop.FGLUsing.cHAR_INDEX$1(fmt, 36) !== -1)
                    has_money = true;
                else 
                    has_money = false;

                if (f_cnt < n_cnt + (has_money ? 1 : 0)) {
                    a = fmt.length;
                    if (a > s)
                        a = s;


                    if (n_cnt > a) {
                        // no way this number can fit, fill with stars ...

                        return overflow;
                    }


                    // default is to use the strict I4GL behaviour, stars

                    return overflow;
                }
            }

            for (a = (fm1.length) - 1; a >= 0; a--) {
                if (AubitDesktop.FGLUsing.cHAR_INDEX(rep_digit, fm1.charCodeAt(a)) !== -1) {
                    if (variable_called_b >= 0) {
                        if (((buff_integer.charCodeAt(variable_called_b) === 48 && buff_integer.charCodeAt(variable_called_b - 1) === 32) || buff_integer.charCodeAt(variable_called_b) === 32) && isprnt)
                            isprnt = false;
                    }
                    str[a] = buff_integer.charCodeAt(variable_called_b--);
                    if (!isprnt) {
                        if (fm1.charCodeAt(a) === 35) {
                            str[a] = 32;
                            continue;
                        }
                        if (fm1.charCodeAt(a) === 42) {
                            str[a] = 42;
                            continue;
                        }
                        if (fm1.charCodeAt(a) === 38) {
                            str[a] = 48;
                            continue;
                        }
                        if (fm1.charCodeAt(a) === 60) {
                            str[a] = 60;
                            continue;
                        }

                        p = AubitDesktop.FGLUsing.cHAR_INDEX(canfloat_head, fm1.charCodeAt(a));

                        if (p >= 0) {
                            canfloat_head[p] = 1;

                            if (fm1.charCodeAt(a) === 43 && isneg) {
                                str[a] = 45;
                                continue;
                            }
                            if (fm1.charCodeAt(a) === 43 && !isneg) {
                                str[a] = 43;
                                continue;
                            }
                            if (fm1.charCodeAt(a) === 45 && isneg) {
                                str[a] = 45;
                                continue;
                            }
                            if (fm1.charCodeAt(a) === 45 && !isneg) {
                                str[a] = 32;
                                continue;
                            }
                            if (fm1.charCodeAt(a) === 40) {
                                if (isneg) {
                                    str[a] = 40;
                                    continue;
                                }
                                else  {
                                    str[a] = 32;
                                    continue;
                                }
                            }
                            if (fm1.charCodeAt(a) === 41 && isneg) {
                                str[a] = 41;
                                continue;
                            }
                            str[a] = fm1.charCodeAt(a);
                            continue;
                        }
                        else  {
                            str[a] = 32;
                            continue;
                        }
                        //str[a] = fm1[a];
                    }
                }
                else  {
                    if (buff_integer.charCodeAt(variable_called_b) === 32 && str[a] === 44) {
                        if (fm1.charCodeAt(a + 1) === 60) {
                            str[a] = 60;
                        }
                        else  {
                            str[a] = 1;
                        }
                    }
                }
            }
            variable_called_b = 0;


            for (a = 0; a < (fm2.length); a++) {
                if (AubitDesktop.FGLUsing.cHAR_INDEX(rep_digit, fm2.charCodeAt(a)) !== -1) {
                    if (fm2.charCodeAt(a) === 41) {
                        if (isneg) {
                            str[a + (fm1.length) + 1] = 41;
                            continue;
                        }
                        else  {
                            str[a + (fm1.length) + 1] = 32;
                            continue;
                        }
                    }
                    str[a + (fm1.length) + 1] = buff_decimal.charCodeAt(variable_called_b++);
                }
                else  {
                    str[a + (fm1.length) + 1] = fm2.charCodeAt(a);
                }
            }

            //ptr = (string ) strrchr (str, '<');

            // for any unused leading "<" or "-<" format chars,
            // shift the output to the left
            str_as_string = String.fromCharCode.apply(null, str);
            if (AubitDesktop.extensionString.contains(str_as_string,"<")) {
                var buffx = "";
                variable_called_b = 0;
                for (a = 0; a < (str.length); a++) {
                    if (str[a] === 60) {
                        if (str[a + 1] === 44)
                            str[a + 1] = 60;
                        continue;
                    }
                    if (!isneg && str[a] === 45 && str[a + 1] === 60)
                        continue;
                    buffx += str[a];
                }

                str =  AubitDesktop.FGLUtils.toCharArray(buffx);
            }

            for (a = 0; a < (str.length); a++) {
                if (str[a] === 1) {

                    if (a === 0)
                        str[a] = 32;
                    else 
                        str[a] = str[a - 1];


                    if (a === 1) {
                        if (str[a - 1] === 36) {
                            str[a - 1] = 32;
                        }
                        if (str[a - 1] === 45) {
                            str[a - 1] = 32;
                        }
                        if (str[a - 1] === 40) {
                            str[a - 1] = 32;
                        }
                    }

                    if (a >= 2) {
                        if (str[a - 1] === 36 && str[a - 2] !== 36) {
                            str[a - 1] = 32;
                        }
                        if (str[a - 1] === 45 && str[a - 2] !== 45) {
                            str[a - 1] = 32;
                        }
                        if (str[a - 1] === 40 && str[a - 2] !== 40) {
                            str[a - 1] = 32;
                        }
                    }
                }
            }


            for (a = (str.length) - 1; a >= 0; --a) {
                if (str[a] === 46) {
                    str[a] = AubitDesktop.FGLUtils.geta4gl_convfmts_ui_decfmt_decsep();
                }
                else  {
                    if (str[a] === AubitDesktop.FGLUtils.geta4gl_convfmts_ui_decfmt_decsep()) {
                        str[a] = AubitDesktop.FGLUtils.geta4gl_convfmts_ui_decfmt_thsep();
                    }
                }
            }

            str_as_string = String.fromCharCode.apply(null, str);
            if (has_money && !(AubitDesktop.extensionString.contains(str_as_string,"$"))) {
                var first_non_space = -1;
                // Lacking money!
                for (a = 0; a < (str.length); a++) {
                    if (str[a] !== 32) {
                        first_non_space = a;
                        break;
                    }
                }
                if (first_non_space > 0) {
                    if (str[first_non_space] === 45 || str[first_non_space] === 40 || str[first_non_space] === 43) {
                        str[first_non_space - 1] = str[first_non_space];
                        str[first_non_space] = 36;
                    }
                    else  {
                        str[first_non_space - 1] = 36;
                    }
                }
            }


            return String.fromCharCode.apply(null, str);
        },
        cHAR_INDEX$1: function (fmt, p) {
            return AubitDesktop.FGLUsing.cHAR_INDEX( AubitDesktop.FGLUtils.toCharArray(fmt), p);
        },
        cHAR_INDEX: function (rep_digit, p) {
            for (var a = 0; a < rep_digit.length; a++) {
                if (rep_digit[a] === p)
                    return a;
            }
            return -1;
        },
        a4gl_using_date: function (fmt, value) {
            var d;
            var longStr = "                                               ";

            if (value === null) {
                fmt = longStr.substring(0, fmt.length);
                return fmt;
            }
	    if (!Ext.isString(value)) {
		value=""+value;
	    }
            	if (value.trim().length === 0) {
                	fmt = longStr.substring(0, fmt.length);
                	return fmt;
            	}
            

            // Value should always be in DBDATE format..
            d = AubitDesktop.FGLUtils.getDate(value);
            fmt = fmt.replace( "mmm", "M");
            fmt = fmt.replace( "mm", "m");
            fmt = fmt.replace( "ddd", "D");
            fmt = fmt.replace( "dd", "d");
            fmt = fmt.replace( "yyyy", "Y");
            fmt = fmt.replace( "yy", "y");

            return Ext.Date.format(d, fmt);
            /* 
            fmt = fmt.Replace("dddd", d.ToString("dddd"));
            fmt = fmt.Replace("ddd", d.ToString("ddd"));
            fmt = fmt.Replace("dd", d.ToString("dd"));
            fmt = fmt.Replace("mmmm", d.ToString("MMMM"));
            fmt = fmt.Replace("mmm", d.ToString("MMM"));
            fmt = fmt.Replace("mm", d.ToString("MM"));
            fmt = fmt.Replace("yyyy", d.ToString("yyyy"));
            fmt = fmt.Replace("yy", d.ToString("yy"));

            fmt = fmt.Replace("DDDD", d.ToString("dddd"));
            fmt = fmt.Replace("DDD", d.ToString("ddd"));
            fmt = fmt.Replace("DD", d.ToString("dd"));
            fmt = fmt.Replace("MMMM", d.ToString("MMMM"));
            fmt = fmt.Replace("MMM", d.ToString("MMM"));
            fmt = fmt.Replace("MM", d.ToString("MM"));
            fmt = fmt.Replace("YYYY", d.ToString("yyyy"));
            fmt = fmt.Replace("YY", d.ToString("yy"));

            return d.ToString(fmt);
             * */
        },
        a4gl_using: function (fmt, value) {
            var d;
            var isneg = false;
            if (value === "") {
                return "";
            }
            d  = AubitDesktop.Convert.toDecimal(value);
            if (d<0) {
                d  = 0-d;
                isneg = true;
            }
            return AubitDesktop.FGLUsing.a4gl_using_from_string(fmt, d.toString(), isneg);
        }
    }
});

Ext.define('AubitDesktop.FGLUtils', {
    statics: {
        _dbdate: "MDY4/",
	toCharArray: function(s) {
		var rval=[];
		var a;
		for (a=0;a<s.length;a++) {
			rval.push(s.charCodeAt(a));
		}
		return rval;
	},
        getDBDATE: function () {
            return AubitDesktop.FGLUtils._dbdate;
        },
        setDBDATE: function (value) {
            AubitDesktop.FGLUtils._dbdate = value;
        },
        geta4gl_convfmts_ui_decfmt_decsep: function () {
            return 46;
        },
        geta4gl_convfmts_ui_decfmt_thsep: function () {
            return 44;
        },
        getDBDATEFormat_dotnet: function () {


            switch (AubitDesktop.FGLUtils._dbdate.toUpperCase()) {
                case "DMY4/": 
                    return "d/m/Y";
                case "DMY": 
                    return "d/m/Y";
                case "DMY2": 
                    return "d/m/y";
                case "DMY2/": 
                    return "d/m/y";
                case "MDY4/": 
                    return "m/d/Y";
                case "MDY4": 
                    return "m/d/Y";
                case "MDY2": 
                    return "m/d/y";
                case "MDY2/": 
                    return "m/d/y";
                default: 
                    throw "Unhandled 4GL DBDATE format";
            }
        },
        getDBDATEFormat_fgl: function () {

            switch (AubitDesktop.FGLUtils._dbdate) {
                case "DMY4/": 
                    return "dd/mm/yyyy";
                case "DMY": 
                    return "dd/mm/yyyy";
                case "DMY2": 
                    return "dd/mm/yy";
                case "DMY2/": 
                    return "dd/mm/yy";
                case "MDY4/": 
                    return "mm/dd/yyyy";
                case "MDY4": 
                    return "mm/dd/yyyy";
                case "MDY2": 
                    return "mm/dd/yy";
                case "MDY2/": 
                    return "mm/dd/yy";
                default: 
                    throw "Unhandled 4GL DBDATE format";
            }
        },
        splitConfig: function (s) {
            var inbrace = false;
            var last_a = 0;
            var d = [];
            s += " ";
            for (var a = 0; a < s.length; a++) {

                if ((s.charCodeAt(a) === 32 || a === s.length - 1) && inbrace === false) {
                    var n;
                    n = s.substring(last_a, a - last_a);
                    if (n.trim() !== "") {
                        var n2;
                        n2 = n.trim();
                        if (Ext.String.startsWith(n2, "{") && Ext.String.endsWith(n2, "}")) {
                            n2 = n2.substring(1, n2.length - 2);
                        }
                        d.push(n2);
                    }
                    last_a = a;
                }

                if (s.charCodeAt(a) === 123 && !inbrace) {
                    inbrace = true;
                }
                if (s.charCodeAt(a) === 125 && inbrace) {
                    inbrace = false;
                }

            }

            return d;
        },
        getKeyCodeFromKeyName: function (keyname) {

            if (keyname === null) {
                return -1;
            }

            var txt = keyname;

            switch (keyname.toUpperCase()) {
                case "F1": 
                    txt = "3000";
                    break;
                case "F2": 
                    txt = "3001";
                    break;
                case "F3": 
                    txt = "3002";
                    break;
                case "F4": 
                    txt = "3003";
                    break;
                case "F5": 
                    txt = "3004";
                    break;
                case "F6": 
                    txt = "3005";
                    break;
                case "F7": 
                    txt = "3006";
                    break;
                case "F8": 
                    txt = "3007";
                    break;
                case "F9": 
                    txt = "3008";
                    break;
                case "F10": 
                    txt = "3009";
                    break;
                case "F11": 
                    txt = "3010";
                    break;
                case "F12": 
                    txt = "3011";
                    break;
                case "F13": 
                    txt = "3012";
                    break;
                case "F14": 
                    txt = "3013";
                    break;
                case "F15": 
                    txt = "3014";
                    break;
                case "F16": 
                    txt = "3015";
                    break;
                case "F17": 
                    txt = "3016";
                    break;
                case "F18": 
                    txt = "3017";
                    break;
                case "F19": 
                    txt = "3018";
                    break;
                case "F20": 
                    txt = "3019";
                    break;
                case "F21": 
                    txt = "3020";
                    break;
                case "F22": 
                    txt = "3021";
                    break;
                case "F23": 
                    txt = "3022";
                    break;
                case "F24": 
                    txt = "3023";
                    break;
                case "F25": 
                    txt = "3024";
                    break;
                case "F26": 
                    txt = "3025";
                    break;
                case "F27": 
                    txt = "3026";
                    break;
                case "F28": 
                    txt = "3027";
                    break;
                case "F29": 
                    txt = "3028";
                    break;
                case "F30": 
                    txt = "3029";
                    break;
                case "F31": 
                    txt = "3030";
                    break;
                case "F32": 
                    txt = "3031";
                    break;
                case "UP": 
                    txt = "2000";
                    break;
                case "DOWN": 
                    txt = "2001";
                    break;
                case "LEFT": 
                    txt = "2002";
                    break;
                case "RIGHT": 
                    txt = "2003";
                    break;
                case "HELP": 
                    txt = "2008";
                    break;
                case "PREVPAGE": 
                    txt = "2006";
                    break;
                case "ACCEPT": 
                    txt = "2016";
                    break;
                case "INTERRUPT": 
                    txt = "2011";
                    break;
                case "ESC": 
                    txt = "27";
                    break;
                case "ESCAPE": 
                    txt = "27";
                    break;
                case "CONTROL-A": 
                    txt = "1";
                    break;
                case "CONTROL-B": 
                    txt = "2";
                    break;
                case "CONTROL-C": 
                    txt = "3";
                    break;
                case "CONTROL-D": 
                    txt = "4";
                    break;
                case "CONTROL-E": 
                    txt = "5";
                    break;
                case "CONTROL-F": 
                    txt = "6";
                    break;
                case "CONTROL-G": 
                    txt = "7";
                    break;
                case "CONTROL-H": 
                    txt = "8";
                    break;
                case "CONTROL-I": 
                    txt = "9";
                    break;
                case "CONTROL-J": 
                    txt = "10";
                    break;
                case "CONTROL-K": 
                    txt = "11";
                    break;
                case "CONTROL-L": 
                    txt = "12";
                    break;
                case "CONTROL-M": 
                    txt = "13";
                    break;
                case "CONTROL-N": 
                    txt = "14";
                    break;
                case "CONTROL-O": 
                    txt = "15";
                    break;
                case "CONTROL-P": 
                    txt = "16";
                    break;
                case "CONTROL-Q": 
                    txt = "17";
                    break;
                case "CONTROL-R": 
                    txt = "18";
                    break;
                case "CONTROL-S": 
                    txt = "19";
                    break;
                case "CONTROL-T": 
                    txt = "20";
                    break;
                case "CONTROL-U": 
                    txt = "21";
                    break;
                case "CONTROL-V": 
                    txt = "22";
                    break;
                case "CONTROL-W": 
                    txt = "23";
                    break;
                case "CONTROL-X": 
                    txt = "24";
                    break;
                case "CONTROL-Y": 
                    txt = "25";
                    break;
                case "CONTROL-Z": 
                    txt = "26";
                    break;
            }


	    var val= parseInt(txt,10);
	    if (val!=NaN) {
		return val;
	    }
	    return -1;
        },
        fglFormatToDotNetFormat: function (s) {
            switch (s) {
                case "dd/mm/yy": 
                    return "d/M/y";
                case "dd/mm/yyyy": 
                    return "d/M/Y";
                case "mm/dd/yyyy": 
                    return "m/d/Y";
                case "mm/dd/yy": 
                    return "m/d/y";
                default: 
                    throw "Unhandled 4GL date format";
            }

        },
        formatForDatetime: function (from, to) {
            switch (from) {
                case 1: 
                    return AubitDesktop.FGLUtils.formatForDatetimeFromYear(to);
                case 2: 
                    return AubitDesktop.FGLUtils.formatForDatetimeFromMonth(to);
                case 3: 
                    return AubitDesktop.FGLUtils.formatForDatetimeFromDay(to);
                case 4: 
                    return AubitDesktop.FGLUtils.formatForDatetimeFromHour(to);
                case 5: 
                    return AubitDesktop.FGLUtils.formatForDatetimeFromMinute(to);
                case 6: 
                    return AubitDesktop.FGLUtils.formatForDatetimeFromSecond(to);
            }
            return "";

        },
        formatForDatetimeFromSecond: function (to) {
            return "s.f";
        },
        formatForDatetimeFromMinute: function (to) {
            switch (to) {
                case 5: 
                    return "m";
                case 6: 
                    return "m s.f";
            }

            throw "Invalid Datetime qualifier";
        },
        formatForDatetimeFromHour: function (to) {
            switch (to) {
                case 4: 
                    return "hh";
                case 5: 
                    return "hh:mm";
                case 6: 
                    return "hh:mm:ss.f";
            }

            throw "Invalid Datetime qualifier";

        },
        formatForDatetimeFromDay: function (to) {
            switch (to) {
                case 3: 
                    return "dd";
                case 4: 
                    return "dd hh";
                case 5: 
                    return "dd hh:mm";
                case 6: 
                    return "dd hh:mm:ss.f";
            }

            throw "Invalid Datetime qualifier";

        },
        formatForDatetimeFromMonth: function (to) {
            switch (to) {
                case 2: 
                    return "MM";
                case 3: 
                    return "MM-dd";
                case 4: 
                    return "MM-dd hh";
                case 5: 
                    return "MM-dd hh:mm";
                case 6: 
                    return "MM-dd hh:mm:ss.f";
            }

            throw "Invalid Datetime qualifier";

        },
        formatForDatetimeFromYear: function (to) {
            switch (to) {
                case 1: 
                    return "yyyy";
                case 2: 
                    return "yyyy-MM";
                case 3: 
                    return "yyyy-MM-dd";
                case 4: 
                    return "yyyy-MM-dd hh";
                case 5: 
                    return "yyyy-MM-dd hh:mm";
                case 6: 
                    return "yyyy-MM-dd hh:mm:ss.f";
            }

            throw "Invalid Datetime qualifier";
        },
        isValidForType: function (datatype, value, format, dtypeLength) {

            //NumberStyles style = NumberStyles.Any;

            if (value === null)
                return true;
            if (value.trim() === "")
                return true;

            switch (datatype) {
                case AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_TEXT: 
                case AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_NULL: 
                case AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_BYTE: 
                case AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_VCHAR: 
                case AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_NCHAR: 
                case AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_CHAR: 
                    return true;

                case AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_INTERVAL: 
                    return true;

                case AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_DTIME: 
                    {
                        var dt=Ext.Date.parse(value, AubitDesktop.FGLUtils.formatForDatetime(dtypeLength >> 4, dtypeLength & 15));
                        return dt!=null;
                    }

                case AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_DECIMAL: 
                case AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_MONEY: 
                    {
                        var digits;
                        var decimals;
                        var int_part;
                        var d = { };


                        if (AubitDesktop.Convert.tryParseFloat(value,  d)) {
                            if (format !== null && format.length > 0) {
                                var s = AubitDesktop.FGLUsing.a4GL_func_using(format, value, datatype);
                                if (s.substring(1, 1) === "*")
                                    return false;
                                if (s === null)
                                    return false;
                                if (s.trim().length === 0)
                                    return false;
                            }
                            if (dtypeLength > 0) {
                                decimals = dtypeLength & 65535;
                                digits = dtypeLength >> 16;
                                int_part = digits - decimals;
                                var n = { v : AubitDesktop.Convert.toInt32(d.v) };
                                if (n.v.toString().length > int_part) {
                                    return false;
                                }
                            }

                            return true;
                        }
                        else  {
                            return false;
                        }
                    }
                case AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_FLOAT: 
                case AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_SMFLOAT: 
                    {
                        var d1 = { };
                        if (AubitDesktop.Convert.tryParseFloat(value, d1)) {
                            if (format !== null && format.length > 0) {
                                var s1 = AubitDesktop.FGLUsing.a4GL_func_using(format, value, datatype);
                                if (s1.substring(1, 1) === "*")
                                    return false;
                                if (s1 === null)
                                    return false;
                                if (s1.trim().length === 0)
                                    return false;
                            }

                            return true;
                        }
                        else  {
                            return false;
                        }
                    }
                case AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_DATE: 
                    {
                        var dt1 = { };
                        var ok = false;
                        try {
                            if (format !== null) {
                                dt1.v = AubitDesktop.FGLUtils.getDate$1(value, AubitDesktop.FGLUtils.fglFormatToDotNetFormat(format));
                                ok = true;
                            }
                            else  {
                                dt1.v = AubitDesktop.FGLUtils.getDate(value);
                                ok = true;
                            }
                        }
                        catch (err) {
				ok=false;
                        }

			if (value && !dt1.v) {
				ok=false;
			}
                        if (ok) {
                            return true;
                        }
                        else  {
                            return false;
                        }
                    }
                case AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_SERIAL: 
                case AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_INT: 
                    {
                        var n1 = { };
                        if (AubitDesktop.Convert.tryParseInt(value, n1)) {
                            if (format !== null && format.length > 0) {
                                var s11 = AubitDesktop.FGLUsing.a4GL_func_using(format, value, datatype);
                                if (s11.substring(1, 1) === "*")
                                    return false;
                                if (s11 === null)
                                    return false;
                                if (s11.trim().length === 0)
                                    return false;
                            }
                            return true;
                        }
                        else  {
                            return false;
                        }
                    }
                case AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_SERIAL8: 
                case AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_INT8: 
                    {
                        var n11 = { };
                        if (AubitDesktop.Convert.tryParseInt(value, n11)) {

                            if (format !== null && format.length > 0) {
                                var s1 = AubitDesktop.FGLUsing.a4GL_func_using(format, value, datatype);
                                if (s1.substring(1, 1) === "*")
                                    return false;
                                if (s1 === null)
                                    return false;
                                if (s1.trim().length === 0)
                                    return false;
                            }
                            return true;
                        }
                        else  {
                            return false;
                        }

                    }
                case AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_SMINT: 
                    {
                        var n1 = { };
                        if (AubitDesktop.Convert.tryParseInt(value, n1)) {
                            if (format !== null && format.length > 0) {
                                var s11 = AubitDesktop.FGLUsing.a4GL_func_using(format, value, datatype);
                                if (s11.substring(1, 1) === "*")
                                    return false;
                                if (s11 === null)
                                    return false;
                                if (s11.trim().length === 0)
                                    return false;
                            }
                            return true;
                        }
                        else  {
                            return false;
                        }
                    }
                default: 
                    throw "Datatype field checking not handled for " ;
            }

        },
        getDate: function (s) {
            var t;
	var orig_s=s;
            var arr_mdy;
            var sep = "";
            arr_mdy = null;


            //   minhaData.ToString("dd/MM/yyyy");

            if (AubitDesktop.extensionString.contains(s,"/")) {
                arr_mdy = s.split("/");
                sep = "/";
            }
            if (AubitDesktop.extensionString.contains(s,"-")) {
                arr_mdy = s.split("-");
                sep = "-";
            }

            if (sep === "") {
                if (s.length === 6) {
                    s = s.substring(0, 2) + "/" + s.substring(2, 2) + "/" + s.substring(4, 2);
                }
                else  {
                    s = s.substring(0, 2) + "/" + s.substring(2, 2) + "/" + s.substring(4, 4);
                }
                arr_mdy = s.split("/");
                sep = "/";

            }
            try {
                if (arr_mdy[0].length === 1)
                    arr_mdy[0] = "0" + arr_mdy[0];
                if (arr_mdy[1].length === 1)
                    arr_mdy[1] = "0" + arr_mdy[1];
                if (AubitDesktop.extensionString.contains(AubitDesktop.FGLUtils.getDBDATEFormat_dotnet(),"yyyy")) {
                    if (arr_mdy[2].length === 2) {
                        if (AubitDesktop.Convert.toInt32$1(arr_mdy[2]) > 50) {
                            arr_mdy[2] = "19" + arr_mdy[2];
                        }
                        else  {
                            arr_mdy[2] = "20" + arr_mdy[2];
                        }
                    }
                }
            }
            catch (err) {
                // s = "01/01/1900";
                t = Ext.Date.parse(s, AubitDesktop.FGLUtils.getDBDATEFormat_dotnet(), true);
                ;
                return t;

            }
            if (arr_mdy !== null) {
                s = arr_mdy[0] + sep + arr_mdy[1] + sep + arr_mdy[2];
            }

            t = Ext.Date.parse(s, AubitDesktop.FGLUtils.getDBDATEFormat_dotnet(), true);
	    if (t==undefined) {
	    	var ts=Date.parse(orig_s)
	    	if (isNaN(ts)==false)
	    	{
    	        	t=new Date(t);
			if (Ext.isDate(t) && !isNaN(t.getTime())) {
				return t;
			}
			return null;
	    	} else {
			t=null;
	    	}
            }
            return t;
        },
        getDate$1: function (s, dotnetformat) {
            var t;
            t = Ext.Date.parse(s, dotnetformat,true);
            return t;
        },
        compare_range: function (p, l, r, datatype, datatype_length, fieldsFormat) {
            switch (datatype) {
                case AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_CHAR: 
                case AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_VCHAR: 
                case AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_TEXT: 
                    return (p>=l && p<=r) ;
                case AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_INT: 
                case AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_SMINT: 
                case AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_SERIAL: 
                    return (AubitDesktop.Convert.toInt32$1(p) >= AubitDesktop.Convert.toInt32$1(l) && AubitDesktop.Convert.toInt32$1(p) <= AubitDesktop.Convert.toInt32$1(r));
                case AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_SMFLOAT: 
                case AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_FLOAT: 
                    return (AubitDesktop.Convert.toDouble(p) >= AubitDesktop.Convert.toDouble(l) && AubitDesktop.Convert.toDouble(p) <= AubitDesktop.Convert.toDouble(r));
                case AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_DTIME: 
                    return (AubitDesktop.Convert.toDateTime(p, fieldsFormat) >= AubitDesktop.Convert.toDateTime(l, fieldsFormat) && AubitDesktop.Convert.toDateTime(p, fieldsFormat) <= AubitDesktop.Convert.toDateTime(r, fieldsFormat));
                case AubitDesktop.FGLUtils.FGLDataTypes.dTYPE_DATE: 
                    var ld, rd, pd;
                    if (fieldsFormat === null)
                        fieldsFormat = AubitDesktop.FGLUtils.getDBDATEFormat_fgl();
                    ld = AubitDesktop.FGLUtils.getDate$1(l, AubitDesktop.FGLUtils.fglFormatToDotNetFormat(fieldsFormat));
                    rd = AubitDesktop.FGLUtils.getDate$1(r, AubitDesktop.FGLUtils.fglFormatToDotNetFormat(fieldsFormat));
                    pd = AubitDesktop.FGLUtils.getDate$1(p, AubitDesktop.FGLUtils.fglFormatToDotNetFormat(fieldsFormat));
                    return (pd >= ld && pd <= rd);
                default: 
                    throw "Invalid Datatype: " + datatype;
            }
        }
    }
});

Ext.define('AubitDesktop.FGLUtils.FGLDataTypes', {
    statics: {
        dTYPE_CHAR: 0,
        dTYPE_SMINT: 1,
        dTYPE_INT: 2,
        dTYPE_FLOAT: 3,
        dTYPE_SMFLOAT: 4,
        dTYPE_DECIMAL: 5,
        dTYPE_SERIAL: 6,
        dTYPE_DATE: 7,
        dTYPE_MONEY: 8,
        dTYPE_NULL: 9,
        dTYPE_DTIME: 10,
        dTYPE_BYTE: 11,
        dTYPE_TEXT: 12,
        dTYPE_VCHAR: 13,
        dTYPE_INTERVAL: 14,
        dTYPE_NCHAR: 15,
        dTYPE_INT8: 17,
        dTYPE_SERIAL8: 18
    }
});


/** @namespace AubitDesktop */

/**
 * @public
 * @class AubitDesktop.ROW
 */
Ext.define('AubitDesktop.ROW', {
    /**
     * @instance
     * @public
     * @memberof AubitDesktop.ROW
     * @type string
     */
    sUBSCRIPT: null,
    /**
     * @instance
     * @public
     * @memberof AubitDesktop.ROW
     * @type Array.<AubitDesktop.V>
     */
    vS: null
});

Ext.define('AubitDesktop.showMode', {
    statics: {
        showAlways: 0,
        showNever: 1,
        showAuto: 2
    }
});

/**
 * @public
 * @class AubitDesktop.V
 */
Ext.define('AubitDesktop.V', {
    /**
     * @instance
     * @public
     * @memberof AubitDesktop.V
     * @type string
     */
    cHANGED: null,
    /**
     * @instance
     * @public
     * @memberof AubitDesktop.V
     * @type string
     */
    text: null
});

