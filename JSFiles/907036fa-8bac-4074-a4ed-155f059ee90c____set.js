/******************************************************************************
 * Set      : JavaScript Set Library for Event-B
 * @author  : Faqing YANG
 * @date    : 2013/11/29
 * @version : 0.6.5
 *
 * Copyright (c) 2013 Faqing Yang
 * Licensed under the MIT license.
 *
 * Uses biginteger.js
 * Copyright (c) 2009 Matthew Crumley <email@matthewcrumley.com>
 * Copyright (c) 2010,2011 by John Tobey <John.Tobey@gmail.com>
 * Released under the MIT license.
 *
 ******************************************************************************/

(function() {

var prefix = "$B";

Boolean.prototype.toLiteral = function() {
    return this.toString();
};

Boolean.prototype.equal = function( obj ) {
    return this.valueOf() === obj;
};

String.prototype.toLiteral = function() {
    return "String('" + this.replace( /\'/g, '"' ) + "')";
//    return "'" + this.toString() + "'";
};

String.prototype.equal = function( obj ) {
    return "" + this === obj;
};

//BigInteger.prototype.toLiteral = function() {
//    return this.toString();
//};

/* TRUE
 * a constant with primitive true value
 */
var TRUE = true;

/* FALSE
 * a constant with primitive false value
 */
var FALSE = false;

/******************************************************************************
 * Event-B Arithmetic
 ******************************************************************************/

var regInteger = /^[-]?[0-9]+$/;

/* Integer
 * Parameters:
 *   literal: an Integer, a BigInteger or a decimal string
 * Return:
 *   an instance of Integer or undefined
 */

var Integer = function( literal ) {
    var obj = {};
    if ( literal instanceof Integer ) {
        return literal;
    } else if ( literal instanceof BigInteger ) {
        obj.literal = literal;
    } else if ( typeof literal === "string" ) {
        if ( regInteger.test( literal ) ) {
            obj.literal = BigInteger.parse( literal );
        }
    }
    if ( obj.literal ) {
        obj.__proto__ = Integer.prototype;
        return obj;
    }
};

Integer.prototype = {
    toLiteral : function() {
        return ( prefix + "('" + this.literal + "')" );
//        return "'" + this.literal + "'";
    },

    toString : function() {
        return "" + this.literal;
    },

    equal : function( obj ) {
        obj = Integer( obj );
        if ( obj ) {
            return "" + this.literal === "" + obj.literal;
        } else {
            return false;
        }
    }
};

var ZERO = Integer( '0' );
var ONE  = Integer( '1' );
var TWO  = Integer( '2' );
var MAX_ENUMERATED_VALUE = Integer( '2' );
var MIN_ENUMERATED_VALUE = Integer( '-2' );

var isInteger = function( literal ) {
    if ( literal instanceof Integer ) {
        return true;
    } else if ( literal instanceof BigInteger ) {
        return true;
    } else if ( typeof literal === "string" ) {
        if ( regInteger.test( literal ) ) {
            return true;
        }
    }
    return false;
};

/* Pair
 * Parameters:
 *   left, right : two math objects
 * Return:
 *   a new Pair object
 */
var Pair = function( left, right ) {
    var pair = {};
    pair.left = left;
    pair.right = right;
    pair.__proto__ = Pair.prototype;
    return pair;
};

Pair.prototype = {
    toArguments : function( argArray ) {
        if ( this.left instanceof Pair ) {
            this.left.toArguments( argArray );
        }  else {
            argArray.push( this.left );
        }
        if ( this.right instanceof Pair ) {
            this.right.toArguments( argArray );
        } else {
            argArray.push( this.right );
        }
    },

    toLiteral : function() {
        return ( prefix + ".Pair(" + this.left.toLiteral() + "," + 
            this.right.toLiteral() + ")" );
    },

    toString : function() {
        var leftString = this.left instanceof Pair ? 
            "(" + this.left + ")" : this.left,
            rightString = this.right instanceof Pair ? 
            "(" + this.right + ")" : this.right;
        return ( leftString + '\u21a6' + rightString );
    },

    equal : function( obj ) {
        obj = Integer( obj );
        if ( obj instanceof Pair ) {
            return this.toLiteral() === obj.toLiteral();
        } else {
            return false;
        }
    }
};

/* minus
 * Parameters:
 *   m, n : two Integer objects
 * Return:
 *   a new Integer object or undefined
 */
var minus = function( m, n ) {
    m = Integer( m );
    n = Integer( n );
    if ( m instanceof Integer && n instanceof Integer ) {
        return Integer( m.literal.subtract( n.literal ) );
    }
};

/* divide
 * Parameters:
 *   m, n : two Integer objects
 * Return:
 *   a new Integer object or undefined
 */
var divide = function( m, n ) {
    m = Integer( m );
    n = Integer( n );
    if ( m instanceof Integer && n instanceof Integer && 
         n.literal.compare( ZERO ) !== 0 ) {
        return Integer( m.literal.quotient( n.literal ) );
    }
};

/* mod
 * Parameters:
 *   m, n : two Integer objects
 * Return:
 *   a new Integer object or undefined
 */
var mod = function( m, n ) {
    m = Integer( m );
    n = Integer( n );
    if ( m instanceof Integer && n instanceof Integer && 
         n.literal.compare( ZERO ) !== 0 ) {
        return Integer( m.literal.remainder( n.literal ) );
    }
};

/* pow
 * Parameters:
 *   m, n : two Integer objects
 * Return:
 *   a new Integer object or undefined
 */
var pow = function( m, n ) {
    m = Integer( m );
    n = Integer( n );
    if ( m instanceof Integer && n instanceof Integer ) {
        return Integer( m.literal.pow( n.literal ) );
    }
};

/* plus
 * Parameters:
 *   a list of Integer objects, list.length >= 2
 * Return:
 *   a new Integer object or undefined
 */
var plus = function( /* integerList */ ) {
    var argArray = [].slice.call( arguments, 0 ),
        m, n;
    argArray = argArray.map( function(e){return Integer(e);} );
    m = argArray.shift();
    do {
        n = argArray.shift();
        if ( m instanceof Integer && n instanceof Integer ) {
            m = Integer( m.literal.add( n.literal ) );
        } else {
            return undefined;  
        }
    } while ( argArray.length > 0 );
    return m;
};

/* multiply
 * Parameters:
 *   a list of Integer objects, list.length >= 2
 * Return:
 *   a new Integer object or undefined
 */
var multiply = function( /* integerList */ ) {
    var argArray = [].slice.call( arguments, 0 ),
        m, n;
    argArray = argArray.map( function(e){return Integer(e);} );
    m = argArray.shift();
    do {
        n = argArray.shift();
        if ( m instanceof Integer && n instanceof Integer ) {
            m = Integer( m.literal.multiply( n.literal ) );
        } else {
            return undefined;  
        }
    } while ( argArray.length > 0 );
    return m;
};

/* pred
 * Parameters:
 *   n : a Integer object
 * Return:
 *   a new Integer object or undefined
 */
var pred = function( n ) {
    n = Integer( n );
    if ( n instanceof Integer ) {
        return Integer( n.literal.prev() );
    }
};

/* succ
 * Parameters:
 *   n : a Integer object
 * Return:
 *   a new Integer object or undefined
 */
var succ = function( n ) {
    n = Integer( n );
    if ( n instanceof Integer ) {
        return Integer( n.literal.next() );
    }
};

/* unminus
 * Parameters:
 *   n : a Integer object
 * Return:
 *   a new Integer object or undefined
 */
var unminus = function( n ) {
    n = Integer( n );
    if ( n instanceof Integer ) {
        return Integer( n.literal.negate() );
    }
};

/* lessThan
 * Parameters:
 *   m, n : two Integer objects
 * Return:
 *   a boolean value
 */
var lessThan = function( m, n ) {
    m = Integer( m );
    n = Integer( n );
    if ( m instanceof Integer && n instanceof Integer ) {
        return m.literal.compare( n.literal ) === -1 ? true : false;
    } else {
        return false;
    }
};

/* lessEqual
 * Parameters:
 *   m, n : two Integer objects
 * Return:
 *   a boolean value
 */
var lessEqual = function( m, n ) {
    m = Integer( m );
    n = Integer( n );
    if ( m instanceof Integer && n instanceof Integer ) {
        return m.literal.compare( n.literal ) <= 0 ? true : false;
    } else {
        return false;
    }
};

/* greaterThan
 * Parameters:
 *   m, n : two Integer objects
 * Return:
 *   a boolean value
 */
var greaterThan = function( m, n ) {
    m = Integer( m );
    n = Integer( n );
    if ( m instanceof Integer && n instanceof Integer ) {
        return m.literal.compare( n.literal ) === 1 ? true : false;
    } else {
        return false;
    }
};

/* greaterEqual
 * Parameters:
 *   m, n : two Integer objects
 * Return:
 *   a boolean value
 */
var greaterEqual = function( m, n ) {
    m = Integer( m );
    n = Integer( n );
    if ( m instanceof Integer && n instanceof Integer ) {
        return m.literal.compare( n.literal ) >= 0 ? true : false;
    } else {
        return false;
    }
};

/* SetExtension
 * SetExtension use Array to store elements, the maximum elements must
 * less than 2^32 (4294967296) by the limitation of Array length
 * Parameters:
 *   a list of meme type math objects
 * Return:
 *   a new SetExtension object
 */
var SetExtension = function( /* objectList */ ) {
    var elements = [];
    elements.push.apply( elements, arguments );
    elements.concrete = true;
    elements.finite = true;
    elements.__proto__ = SetExtension.prototype;
    elements.sort();
    return elements;
};

SetExtension.prototype = new Array;

jeb.util.extend( SetExtension.prototype, {
    card : function() {
        return Integer( "" + this.length );
    },

    contains : function( element ) {
        return this.some( function( e ) {
                return equal( e, element );
            });
    },

    anyMember : function() {
        var any = UpTo( ZERO, Integer( "" + (this.length - 1) ) ).anyMember();
        return this[any.toString()];
    },

    indexOf : function( element ) {
        var i, len;
        for ( i = 0, len = this.length; i < len; i++ ) {
            if ( equal( this[i], element ) ) {
                return i;
            }
        }
        return -1;
    },

    indexOfKey : function( key ) {
        var i, len;
        for ( i = 0, len = this.length; i < len; i++ ) {
            if ( equal( this[i].left, key ) ) {
                return i;
            }
        }
        return -1;
    },

    getImage : function( left ) {
        var i, len;
        for ( i = 0, len = this.length; i < len; i++ ) {
            if ( equal( this[i].left, left ) ) {
                return this[i].right;
            }
        }
    },

    setImage : function( left, right ) {
        var i, len;
        for ( i = 0, len = this.length; i < len; i++ ) {
            if ( equal( this[i].left, left ) ) {
                this[i].right = right;
                break;
            }
        }
    },

    toLiteral : function() {
        var literalArray = this.map( function( e ) {
                return e.toLiteral();
            });
        return prefix + ".SetExtension(" + literalArray.join( "," ) + ")";
    },

    toString : function() {
        var toStringArray = this.map( function( e ) {
                return ( typeof e === "undefined" ? e : e.toString() );
            });
        if ( toStringArray.length === 0 ) {
            return "\u2205";
        } else {
            return ( '{' + toStringArray.join( ', ' ) + '}' );
        }
    }
});

/* QuantifiedExpression
 * Parameters:
 *   predicateFunction : a function
 *   expressionFunction : a function
 *   domainArray : an array contains all quantifiers domain
 *   stringForm : optional, the string form of QuantifiedExpression
 * Return:
 *   an abstract form of QuantifiedExpression
 */
var QuantifiedExpression = function( predicateFunction, expressionFunction, 
    domainArray, stringForm ) {
    var result = SetExtension();
    result.concrete = false;
    result.predicateFunction = predicateFunction;
    result.expressionFunction = expressionFunction;
    result.domainArray = domainArray;
    result.stringForm = stringForm;
    result.type = prefix + ".QuantifiedExpression";
    result.__proto__ = QuantifiedExpression.prototype;
    return result;
};

QuantifiedExpression.prototype = new SetExtension();

jeb.util.extend( QuantifiedExpression.prototype, {
    __toSetExtension : function() {
        var self = this,
            argArray = [],
            lastLevel = self.domainArray.length - 1,
            tempSetExtension = SetExtension();
        var __getSetExtension = function( nestLevel ) {
            if ( nestLevel === lastLevel ) { // the last quantifier domain
                return self.domainArray[nestLevel].forEach( function( x ) {
                    argArray[ nestLevel ] = x; 
                    if ( self.predicateFunction.apply( null, argArray ) ) {
                        tempSetExtension.push( self.expressionFunction.apply( 
                            null, argArray ) );
                    }
                });
            } else {
                return self.domainArray[nestLevel].forEach( function( x ) {
                    argArray[ nestLevel ] = x; 
                    return __getSetExtension( (nestLevel + 1) );
                });
            }
        };
        __getSetExtension( 0 );
        return tempSetExtension.sort();
    },

    toLiteral : function() {
        if ( this.concrete ) {
            return SetExtension.prototype.toLiteral.call( this );
        } else {
            var stringForm = this.stringForm ? this.stringForm : '';
            return ( this.type + "(" + this.predicateFunction + "," +
                this.expressionFunction + ",[" +
                this.domainArray.map( function(v){return v.toLiteral();} ).join(",") + "],'" +
                stringForm + "')" );
        }
    },

    toString : function() {
        if ( this.concrete ) {
            return SetExtension.prototype.toString.call( this );
        } else if ( this.stringForm ) {
            return this.stringForm;
        } else {
            return this.type + "(...)";
        }
    }
});

/* SetComprehension
 * Parameters:
 *   predicateFunction : a function
 *   expressionFunction : a function
 *   domainArray : an array contains all quantifiers domain
 *   stringForm : optional, the string form of set comprehension
 * Return:
 *   an abstract form of set comprehension
 */
var SetComprehension = function( predicateFunction, expressionFunction, 
    domainArray, stringForm ) {
    var result = QuantifiedExpression( predicateFunction, 
        expressionFunction, domainArray, stringForm );
    result.type = prefix + ".SetComprehension";
    result.__proto__ = SetComprehension.prototype;
    return result;
};

SetComprehension.prototype = new QuantifiedExpression();

jeb.util.extend( SetComprehension.prototype, {
    toSetExtension : function() {
        var tempSetExtension = this.__toSetExtension();
        jeb.util.extend( this, tempSetExtension );
        return this;
    },

    functionImage : function( /* arguments */ ) {
        var pair;
        if ( this.predicateFunction.apply( null, arguments ) ) {
            pair = this.expressionFunction.apply( null, arguments );
        }
        if ( pair instanceof Pair ) {
            return pair.right;
        }
    },
});

/* PowerSet
 * Parameters:
 *   S : a set
 * Return:
 *   a new PowerSet object
 */
var PowerSet = function( S ) {
    var obj = {};
    obj.S = S;
    obj.__proto__ = PowerSet.prototype;
    return obj;
};

PowerSet.prototype = {
    contains : function( S ) {
        return subset( S, this.S );
    },

    card : function() {
        return pow( TWO, this.S.card() );
    },

    toSetExtension : function() {
        var result = SetExtension( SetExtension() ),
            self = this;
        result.type = this.toLiteral();
        result.S = this.S;
        return this.reduce( function( accumulator, element ) {
            return accumulator.concat( accumulator.map( function( S ) {
                return S.concat( element );
            }));
        }, result );
        result.concrete = true;
        return result;
    },

    toLiteral : function() {
        return prefix + ".PowerSet(" + this.S.toLiteral() + ")";
    },

    toString : function() {
        return ( "\u2119(" + this.S.toString() + ")" );
    }
};

/* PowerSet1
 * Parameters:
 *   S : a set
 * Return:
 *   a new PowerSet1 object
 */
var PowerSet1 = function( S ) {
    var obj = {};
    obj.S = S;
    obj.__proto__ = PowerSet1.prototype;
    return obj;
};

PowerSet1.prototype = {
    contains : function( S ) {
        return subset( S, this.S );
    },

    card : function() {
        return pred( pow( TWO, this.S.card() ) );
    },

    toLiteral : function() {
        return prefix + ".PowerSet1(" + this.S.toLiteral() + ")";
    },

    toString : function() {
        return ( "\u2119\u0031(" + this.S.toString() + ")" );
    }
};

/* CartesianProduct
 * Parameters:
 *   S : a set
 * Return:
 *   a new CartesianProduct object
 */
var CartesianProduct = function( S, T ) {
    var obj = {};
    obj.S = S;
    obj.T = T;
    obj.dom = S;
    obj.ran = T;
    obj.__proto__ = CartesianProduct.prototype;
    return obj;
};

CartesianProduct.prototype = {
    card : function() {
        return multiply( this.S.card(), this.T.card() );
    },

    contains : function( pair ) {
        return ( this.S.contains( pair.left ) 
                && this.T.contains( pair.right ) );
    },

    forEach : function( func ) {
        var self = this;
        self.S.forEach( function( left ) {
            self.T.forEach( function( right ) {
                func.call( self, Pair( left, right ) );
            });
        });
    },

    every : function( func ) {
        var self = this;
        return self.S.every( function( left ) {
            return self.T.every( function( right ) {
                return func.call( self, Pair( left, right ) );
            });
        });
    },

    anyMember : function() {
        return Pair( this.S.anyMember(), this.T.anyMember() );
    },

    toSetExtension : function() {
        var result = SetExtension(),
            self = this,
            domain;
        result.type = this.toLiteral();
        result.dom = this.dom;
        result.ran = this.ran;
        domain = self.dom.concrete ? self.dom : self.dom.toSetExtension();
        domain.forEach( function( left ) {
            var range = self.ran.concrete ? self.ran : self.ran.toSetExtension();
            return range.forEach( function( right ) {
                result.push( Pair( left, right ) );
            });
        });
        result.concrete = true;
        return result.sort();
    },

    toLiteral : function() {
        return prefix + ".CartesianProduct(" + this.S.toLiteral() + "," + 
            this.T.toLiteral() + ")";
    },

    toString : function() {
        return ( this.S.toString() + " \u00D7 " + this.T.toString() );
    }
};

/* UpTo
 * Parameters:
 *   low  : the low bound Integer object
 *   high : the high bound Integer object
 * Return:
 *   an abstract set representation of Integer objects 
 *   with bound [low, high]
 */
var UpTo = function( low, high ) {
    var upto = {};
    upto.low = Integer( low );
    upto.high = Integer( high );
    upto.__proto__ = UpTo.prototype;
    return upto;
};

UpTo.prototype = {
    finite : true,

    card : function() {
        return succ( minus( this.high, this.low ) );
    },

    contains : function( e ) {
        e = Integer( e );
        return ( e != undefined &&
            greaterEqual( e, this.low ) &&
            lessEqual( e, this.high ) ? true : false );
    },

    includes : function( S ) {
        return (  S.toLiteral() === this.toLiteral() ? true : false );
    },

    forEach : function( func ) {
        var iterator = this.low;
        while ( lessEqual( iterator, this.high ) ) {
            func( iterator );
            iterator = succ( iterator );
        }
    },

    every : function( func ) {
        var iterator = this.low,
            result = true;
        while ( result && lessEqual( iterator, this.high ) ) {
            result = func( iterator );
            iterator = succ( iterator );
        }
        return result;
    },

    some : function( func ) {
        var iterator = this.low,
            result = false;
        while ( !result && lessEqual( iterator, this.high ) ) {
            result = func( iterator );
            iterator = succ( iterator );
        }
        return result;
    },

    anyMember : function() {
        var range = plus( minus( this.high, this.low ), ONE ),
            mod = 10000000000000000; // 10^16
        return plus( BigInteger( mod * Math.random() ).
                multiply( range ).divide( mod ), this.low );
    },

    toSetExtension : function() {
        var result = SetExtension(),
            iterator = this.low;
        result.type = this.toLiteral();
        result.concrete = true;
        while ( lessEqual( iterator, this.high ) ) {
            result.push( iterator );
            iterator = succ( iterator );
        }
        return result;
    },

    toLiteral : function() {
        return ( prefix + ".UpTo(" + this.low.toLiteral() + "," + 
            this.high.toLiteral() + ")" );
    },

    toString : function() {
        return ( this.low + " \u2025 " + this.high );
    }
};

/* EmptySet
 * a constant set contains no elements
 */
var EmptySet = SetExtension();


/* BOOL
 * a constant set contains exact two elements true and false
 */
var BOOL = SetExtension( true, false );

jeb.util.extend( BOOL, {
    toLiteral : function() {
        return prefix + ".BOOL";
    },

    toString : function() {
        return "BOOL";
    }
});

/* INTEGER
 * a constant set contains all Integer objects
 */
var INTEGER = {
    finite : false,

    card : function() {
    },

    contains : function( e ) {
        return ( isInteger( e ) ? true : false );
    },

    includes : function( S ) {
        return ( S.toLiteral() === this.toLiteral.toLiteral() ? true : false );
    },

    anyMember : function() {
        return UpTo( MIN_ENUMERATED_VALUE, MAX_ENUMERATED_VALUE ).anyMember();
    },

    forEach : function( func ) {
        return UpTo( MIN_ENUMERATED_VALUE, MAX_ENUMERATED_VALUE  ).forEach( func );
    },

    every : function( func ) {
        return UpTo( MIN_ENUMERATED_VALUE, MAX_ENUMERATED_VALUE  ).every( func );
    },

    some : function( func ) {
        return UpTo( MIN_ENUMERATED_VALUE, MAX_ENUMERATED_VALUE  ).some( func );
    },

    toLiteral : function() {
        return prefix + ".INTEGER";
    },

    toString : function() {
        return "\u2124";
    }
};

/* NATURAL
 * a constant set contains all natural Integer objects
 */
var NATURAL = {
    finite : false,

    card : function() {
    },

    contains : function( e ) {
        e = Integer( e );
        return ( e != undefined &&
            greaterEqual( e, ZERO ) ? 
            true : false );
    },

    includes : function( S ) {
        return ( S.toLiteral() === this.toLiteral.toLiteral() ? true : false );
    },

    anyMember : function() {
        return UpTo( ZERO, MAX_ENUMERATED_VALUE ).anyMember();
    },

    forEach : function( func ) {
        return UpTo( ZERO, MAX_ENUMERATED_VALUE  ).forEach( func );
    },

    every : function( func ) {
        return UpTo( ZERO, MAX_ENUMERATED_VALUE  ).every( func );
    },

    some : function( func ) {
        return UpTo( ZERO, MAX_ENUMERATED_VALUE  ).some( func );
    },

    toLiteral : function() {
        return prefix + ".NATURAL";
    },

    toString : function() {
        return "\u2115";
    }
};

/* NATURAL1
 * a constant set contains all positives Integer objects
 */
var NATURAL1 = {
    finite : false,

    card : function() {
    },

    contains : function( e ) {
        e = Integer( e );
        return ( e != undefined &&
            greaterEqual( e, ONE ) ? 
            true : false );
    },

    includes : function( S ) {
        return ( S.toLiteral() === this.toLiteral.toLiteral() ? true : false );
    },

    anyMember : function() {
        return UpTo( ONE, MAX_ENUMERATED_VALUE ).anyMember();
    },

    forEach : function( func ) {
        return UpTo( ONE, MAX_ENUMERATED_VALUE ).forEach( func );
    },

    every : function( func ) {
        return UpTo( ONE, MAX_ENUMERATED_VALUE ).every( func );
    },

    some : function( func ) {
        return UpTo( ONE, MAX_ENUMERATED_VALUE ).some( func );
    },

    toLiteral : function() {
        return prefix + ".NATURAL1";
    },

    toString : function() {
        return "\u2115\u0031";
    }
};

/* setMinus
 * Parameters:
 *   S, T : two sets
 * Return:
 *   a new SetExtension
 */
var setMinus = function( S, T ) {
    var setA = jeb.util.clone( S ),
        setB = jeb.util.clone( T ),
        index = 0,
        elementOfSetB;
    setA = ( setA.concrete ? setA : setA.toSetExtension() );
    setB = ( setB.concrete ? setB : setB.toSetExtension() );

    while ( setB.length > 0 ) {
        elementOfSetB = setB.pop();
        index = setA.indexOf( elementOfSetB );
        if ( index !== -1 ) { // setA contains elementOfSetB, remove it
            setA.splice( index, 1 ); 
        }
    }
    return setA;
};

/* setUnion
 * Parameters:
 *   a list of sets
 * Return:
 *   a new SetExtension
 */
var setUnion = function( /* setList */ ) {
    var setListArray = [].slice.call( arguments, 0 ),
        setA, setB, elementOfSetB;
    setListArray = setListArray.map( function( s ) {
        return s.concrete ? s : s.toSetExtension();
    });
    // smaller set first
    setListArray.sort( function( a, b ) {
        return a.length - b.length;
    });
    setA = jeb.util.clone( setListArray.shift() );
    while ( setListArray.length > 0 ) {
        setB = jeb.util.clone( setListArray.shift() );
        while ( setB.length > 0 ) {
            elementOfSetB = setB.pop();
            if ( !setA.contains( elementOfSetB ) ) {
                setA.push( elementOfSetB ); 
            }
        }
    }
    return setA.sort();
};

/* setInter
 * Parameters:
 *   a list of sets
 * Return:
 *   a new SetExtension
 */
var setInter = function( /* setList */ ) {
    var setListArray = [].slice.call( arguments, 0 ),
        setA, elementOfSetA, isMemberOfAllSets, i, len,
        result = SetExtension();
    setListArray = setListArray.map( function( s ) {
        return s.concrete ? s : s.toSetExtension();
    });
    // smaller set first
    setListArray.sort( function( a, b ) {
        return a.length - b.length;
    });
    setA = jeb.util.clone( setListArray.shift() );
    while ( setA.length > 0 ) {
        elementOfSetA = setA.pop();
        isMemberOfAllSets = true;
        for ( i = 0, len = setListArray.length; i < len && isMemberOfAllSets; 
              i++ ) {
            if ( !setListArray[i].contains( elementOfSetA ) ) {
                isMemberOfAllSets = false;
            }
        }
        if ( isMemberOfAllSets ) {
            result.push( elementOfSetA );
        }
    }
    return result.sort();
};

/* union
 * Parameters:
 *   U : a set of list of sets, U.length > 0
 * Return:
 *   a new SetExtension
 */
var union = function( U ) {
    return setUnion.apply(null, U);
};

/* inter
 * Parameters:
 *   U : a set of list of sets, U.length > 0
 * Return:
 *   a new set
 */
var inter = function( U ) {
    return setInter.apply(null, U);
};

/* quantifiedUnion
 * Parameters:
 *   predicateFunction : a function
 *   expressionFunction : a function
 *   domainArray : an array contains all quantifiers domain
 *   stringForm : optional, the string form of quantifiedUnion
 * Return:
 *   an abstract form of quantifiedUnion
 */
var quantifiedUnion = function( predicateFunction, expressionFunction, 
    domainArray, stringForm ) {
    var result = QuantifiedExpression( predicateFunction, 
        expressionFunction, domainArray, stringForm );
    result.type = prefix + ".quantifiedUnion";
    result.__proto__ = quantifiedUnion.prototype;
    return result;
};

quantifiedUnion.prototype = new QuantifiedExpression();

jeb.util.extend( quantifiedUnion.prototype, {
    toSetExtension : function() {
        var tempSetExtension = this.__toSetExtension();
        tempSetExtension = setUnion.apply( null, tempSetExtension );
        jeb.util.extend( this, tempSetExtension );
        return this.sort();
    }
});

/* quantifiedInter
 * Parameters:
 *   predicateFunction : a function
 *   expressionFunction : a function
 *   domainArray : an array contains all quantifiers domain
 *   stringForm : optional, the string form of quantifiedInter
 * Return:
 *   an abstract form of quantifiedInter
 */
var quantifiedInter = function( predicateFunction, expressionFunction, 
    domainArray, stringForm ) {
    var result = QuantifiedExpression( predicateFunction, 
        expressionFunction, domainArray, stringForm );
    result.type = prefix + ".quantifiedInter";
    result.__proto__ = quantifiedInter.prototype;
    return result;
};

quantifiedInter.prototype = new QuantifiedExpression();

jeb.util.extend( quantifiedInter.prototype, {
    toSetExtension : function() {
        var tempSetExtension = this.__toSetExtension();
        tempSetExtension = setInter.apply( null, tempSetExtension );
        jeb.util.extend( this, tempSetExtension );
        return this.sort();
    }
});

/* card
 * Parameters:
 *   S : a finite set
 * Return:
 *   the cardinality of S
 */
var card = function( S ) {
    if ( typeof S === "object" || typeof S === "function" && S.card ) {
       S = S.concrete ? S : S.toSetExtension();
       return S.card();
    }
};

/* min
 * Parameters:
 *   S : a set extension of Integer objects
 * Return:
 *   the minimum Integer object of S or undefined
 */
var min = function( S ) {
    var result, i, len;
    if ( S instanceof SetExtension && S.length > 0  ) {
        S = S.map( function(e){return Integer(e);} );
        if ( S.every( function(e){return e instanceof Integer;} ) ) {
            result = S[0];
            for ( i = 1, len = S.length; i < len; i++) {
                if ( lessThan( S[i], result ) ) {
                    result = S[i];
                }
            }
        }
    }
    return result;
};

/* max
 * Parameters:
 *   S : a set extension of Integer objects
 * Return:
 *   the maximum Integer object of S or undefined
 */
var max = function( S ) {
    var result, i, len;
    if ( S instanceof SetExtension && S.length > 0  ) {
        S = S.map( function(e){return Integer(e);} );
        if ( S.every( function(e){return e instanceof Integer;} ) ) {
            result = S[0];
            for ( i = 1, len = S.length; i < len; i++) {
                if ( greaterThan( S[i], result ) ) {
                    result = S[i];
                }
            }
        }
    }
    return result;
};

/* belong
 * Parameters:
 *   E : an element
 *   S : a set
 * Return:
 *   a boolean value
 */
var belong = function( E, S ) {
    return S.contains( E );
};

/* notBelong
 * Parameters:
 *   E : an element
 *   S : a set
 * Return:
 *   a boolean value
 */
var notBelong = function( E, S ) {
    return !S.contains( E );
};

/* properSubset
 * Parameters:
 *   S, T : two sets
 * Return:
 *   a boolean value
 */
var properSubset = function( S, T ) {
    return subset( S, T ) && !equal( S, T );
};

/* notProperSubset
 * Parameters:
 *   S, T : two sets
 * Return:
 *   a boolean value
 */
var notProperSubset = function( S, T ) {
    return !properSubset( S, T );
};

/* subset
 * Parameters:
 *   S, T : two sets
 * Return:
 *   a boolean value
 */
var subset = function( S, T ) {
    return S.every( function( e ) {
            return T.contains( e );
        });
};

/* notSubset
 * Parameters:
 *   S, T : two sets
 * Return:
 *   a boolean value
 */
var notSubset = function( S, T ) {
    return !subset( S, T );
};

/* finite
 * Parameters:
 *   S : a set
 * Return:
 *   a boolean value
 */
var finite = function( S ) {
    return S.finite;
};

/* partition
 * Parameters:
 *   a list of sets
 * Return:
 *   a boolean value
 */
var partition = function( S /* setList */ ) {
    var setListArray = [].slice.call( arguments, 1 ),
        result, i, j, len1, len2;
    if ( setListArray.length === 0 ) {
        return equal( S, EmptySet );
    } else if ( setListArray.length === 1 ) {
        return equal( S, setListArray[0] );
    } else {
        result = equal( S, setUnion.apply(null, 
            setListArray ) );
        for ( i = 0, len1 = setListArray.length; i < len1; i++ ) {
            for ( j = i + 1, len2 = setListArray.length; j < len2; j++ ) {
                result = result && equal( EmptySet, 
                    setInter( setListArray[i], setListArray[j] ) );
                if ( !result ) {
                    break;
                }
            }
        }
    }
    return result;
};

/* Relations
 * Parameters:
 *   S, T : two sets
 * Return:
 *   a new Relations object
 */
var Relations = function( S, T ) {
    var obj = SetExtension();
    obj.S = S;
    obj.T = T;
    obj.__proto__ = Relations.prototype;
    return obj;
};

Relations.prototype = new SetExtension();

jeb.util.extend( Relations.prototype, {
    contains : function( relation ) {
        var self = this;
        if ( equal( relation, EmptySet ) ) {
            return true;
        } else {
            if ( !relation.concrete ) {
                relation.toSetExtension();
            }
            return relation.some( function( pair ) {
                    return self.S.contains( pair.left ) && 
                        self.T.contains( pair.right );
                });
        }
    },

    toLiteral : function() {
        return prefix + ".Relations(" + this.S.toLiteral() + "," + 
            this.T.toLiteral() + ")";
    },

    toString : function() {
        return ( this.S.toString() + " \u2194 " + this.T.toString() );
    }
});

/* TotalRelations
 * Parameters:
 *   S, T : two sets
 * Return:
 *   a new TotalRelations object
 */
var TotalRelations = function( S, T ) {
    var obj = Relations( S, T );
    obj.dom = S;
    obj.__proto__ = TotalRelations.prototype;
    return obj;
};

TotalRelations.prototype = new Relations();

jeb.util.extend( TotalRelations.prototype, {
    toLiteral : function() {
        return prefix + ".TotalRelations(" + this.S.toLiteral() + "," + 
            this.T.toLiteral() + ")";
    },

    toString : function() {
        return ( this.S.toString() + " \ue100 " + this.T.toString() );
    }
});

/* SurjectiveRelations
 * Parameters:
 *   S, T : two sets
 * Return:
 *   a new SurjectiveRelations object
 */
var SurjectiveRelations = function( S, T ) {
    var obj = Relations( S, T );
    obj.ran = T;
    obj.__proto__ = SurjectiveRelations.prototype;
    return obj;
};

SurjectiveRelations.prototype = new Relations();

jeb.util.extend( SurjectiveRelations.prototype, {
    toLiteral : function() {
        return prefix + ".SurjectiveRelations(" + this.S.toLiteral() + "," + 
            this.T.toLiteral() + ")";
    },

    toString : function() {
        return ( this.S.toString() + " \ue101 " + this.T.toString() );
    }
});

/* TotalSurjectiveRelations
 * Parameters:
 *   S, T : two sets
 * Return:
 *   a new TotalSurjectiveRelations object
 */
var TotalSurjectiveRelations = function( S, T ) {
    var obj = Relations( S, T );
    obj.dom = S;
    obj.ran = T;
    obj.__proto__ = TotalSurjectiveRelations.prototype;
    return obj;
};

TotalSurjectiveRelations.prototype = new Relations();

jeb.util.extend( TotalSurjectiveRelations.prototype, {
    toLiteral : function() {
        return prefix + ".TotalSurjectiveRelations(" + this.S.toLiteral() + "," + 
            this.T.toLiteral() + ")";
    },

    toString : function() {
        return ( this.S.toString() + " \ue102 " + this.T.toString() );
    }
});

/* dom
 * Parameters:
 *   r : a relation
 * Return:
 *   a new SetExtension
 */
var dom = function( r ) {
    var result = SetExtension();
    if ( r.dom ) {
        return r.dom;
    } else if ( equal( r, EmptySet ) ) {
        return EmptySet;
    } else {
        r.forEach( function( pair ) {
            if ( notBelong( pair.left, result ) ) {
                result.push( pair.left );
            }
        });
        return result.sort();
    }
};

/* ran
 * Parameters:
 *   r : a relation
 * Return:
 *   a new SetExtension
 */
var ran = function( r ) {
    var result = SetExtension();
    if ( r.ran ) {
        return r.ran;
    } else if ( equal( r, EmptySet ) ) {
        return EmptySet;
    } else {
        r.forEach( function( pair ) {
            if ( notBelong( pair.right, result ) ) {
                result.push( pair.right );
            }
        });
        return result.sort();
    }
};

/* relationImage
 * Parameters:
 *   r : a relation object
 *   S : a set
 * Return:
 *   the image of E defined by f
 */
var relationImage = function( r, S ) {
    S = S.concrete ? S : S.toSetExtension();
    var result = SetExtension();
    r.forEach( function( pair ) {
        if ( belong( pair.left, S ) && 
             notBelong( pair.right, result ) ) {
            result.push( pair.right );
        }
    });
    return result;
};

/* domainRestriction
 * Parameters:
 *   S : a set
 *   r : a relation
 * Return:
 *   a new relation
 */
var domainRestriction = function( S, r ) {
    S = S.concrete ? S : S.toSetExtension();
    var resultArray = r.filter( function( pair ) {
        return S.contains( pair.left );
    });
    return SetExtension.apply( null, resultArray );
};

/* domainSubtraction
 * Parameters:
 *   S : a set
 *   r : a relation
 * Return:
 *   a new relation
 */
var domainSubtraction = function( S, r ) {
    S = S.concrete ? S : S.toSetExtension();
    var resultArray = r.filter( function( pair ) {
        return !S.contains( pair.left );
    });
    return SetExtension.apply( null, resultArray );
};

/* rangeRestriction
 * Parameters:
 *   r : a relation
 *   T : a set
 * Return:
 *   a new relation
 */
var rangeRestriction = function( r, T ) {
    T = T.concrete ? T : T.toSetExtension();
    var resultArray = r.filter( function( pair ) {
        return T.contains( pair.right );
    });
    return SetExtension.apply( null, resultArray );
};

/* rangeSubtraction
 * Parameters:
 *   r : a relation
 *   T : a set
 * Return:
 *   a new relation
 */
var rangeSubtraction = function( r, T ) {
    T = T.concrete ? T : T.toSetExtension();
    var resultArray = r.filter( function( pair ) {
        return !T.contains( pair.right );
    });
    return SetExtension.apply( null, resultArray );
};

/* backwardComposition
 * Parameters:
 *   a list of relations
 * Return:
 *   a new relation
 */
var backwardComposition = function( /* relationList */ ) {
    var relationListArray = [].slice.call( arguments, 0 );
        relationListArray.reverse();
    return forwardComposition.apply( null, relationListArray );
};

/* forwardComposition
 * Parameters:
 *   a list of relations
 * Return:
 *   a new relation
 */
var forwardComposition = function( /* relationList */ ) {
    var relationListArray = [].slice.call( arguments, 0 ),
        relationA, relationB, elementA, i, len,
        result = SetExtension();
    while ( relationListArray.length > 1 ) {
        relationA = jeb.util.clone( relationListArray.shift() );
        relationB = jeb.util.clone( relationListArray.shift() );
        result.length = 0;
        while ( relationA.length > 0 ) {
            elementA = relationA.shift();
            for ( i = 0, len = relationB.length; i < len; i++ ) {
                if ( equal( elementA.right, relationB[i].left ) ) {
                    pair = Pair( elementA.left, relationB[i].right );
                    if ( !result.contains( pair) ) {
                        result.push( pair );
                    }
                }
            }
        }
        relationListArray.unshift( result );
    }
    return result.sort();
};

/* override
 * Parameters:
 *   a list of relations
 * Return:
 *   a new relation
 */
var override = function( /* relationList */ ) {
    var relationListArray = [].slice.call( arguments, 0 ),
        relationA, relationB,
        result = SetExtension();
    relationListArray = relationListArray.map( function( s ) {
        return s.concrete ? s : s.toSetExtension();
    });
    while ( relationListArray.length > 1 ) {
        relationA = jeb.util.clone( relationListArray.shift() );
        relationB = relationListArray.shift();
        result.length = 0;
        result = setUnion( relationB, domainSubtraction( 
                dom(relationB), relationA ) );
        relationListArray.unshift( result );
    }
    return result.sort();
};

/* directProduct
 * Parameters:
 *   r1, r2 : two relations
 * Return:
 *   a new relation
 */
var directProduct = function( r1, r2 ) {
    var setA, elementOfSetA, i, len, pair,
        result = SetExtension();
    setA = jeb.util.clone( r1 );
    while ( setA.length > 0 ) {
        elementOfSetA = setA.shift();
        for ( i = 0, len = r2.length; i < len; i++ ) {
            if ( equal( elementOfSetA.left, r2[i].left ) ) {
                pair = Pair( elementOfSetA.left, 
                    Pair( elementOfSetA.right, r2[i].right ) );
                if ( !result.contains( pair) ) {
                    result.push( pair );
                }
            }
        }
    }
    return result.sort();
};

/* parallelProduct
 * Parameters:
 *   r1, r2 : two relations
 * Return:
 *   a new relation
 */
var parallelProduct = function( r1, r2 ) {
    var setA, elementOfSetA, i, len1, len2, pair,
        result = SetExtension();
    for ( i = 0, len1 = r1.length; i < len1; i++ ) {
        for ( j = 0, len2 = r2.length; j < len2; j++ ) {
            pair = Pair( Pair( r1[i].left, r2[j].left ), 
                    Pair( r1[i].right, r2[j].right ) );
            result.push( pair );
        }
    }
    return result.sort();
};

/* converse
 * Parameters:
 *   r : a relation
 * Return:
 *   a new relation
 */
var converse = function( r ) {
    var result = SetExtension();
    r.forEach( function( pair ) {
        result.push( Pair( pair.right, pair.left ) );
    });
    return result.sort();
};

/* PartialFunctions
 * Parameters:
 *   S, T : two sets
 * Return:
 *   a new PartialFunctions object
 */
var PartialFunctions = function( S, T ) {
    var obj = Relations( S, T );
    obj.__proto__ = PartialFunctions.prototype;
    return obj;
};

PartialFunctions.prototype = new Relations();

jeb.util.extend( PartialFunctions.prototype, {
    toLiteral : function() {
        return prefix + ".PartialFunctions(" + this.S.toLiteral() + "," + 
            this.T.toLiteral() + ")";
    },

    toString : function() {
        return ( this.S.toString() + " \u21f8 " + this.T.toString() );
    }
});

/* TotalFunctions
 * Parameters:
 *   S, T : two sets
 * Return:
 *   a new TotalFunctions object
 */
var TotalFunctions = function( S, T ) {
    var obj = PartialFunctions( S, T );
    obj.dom = S;
    obj.__proto__ = TotalFunctions.prototype;
    return obj;
};

TotalFunctions.prototype = new PartialFunctions();

jeb.util.extend( TotalFunctions.prototype, {
    makeSetExtension : function( functionImage ) {
        var result = SetExtension();
        result.type = this.toLiteral();
        result.dom = this.dom;
        result.T = this.T;
        if ( typeof functionImage === "function" ) {
            this.S.forEach( function( e ) {
                result.push( Pair( e, functionImage(e) ) );
            });
        }
        return result.sort();
    },

    contains : function( func ) {
        if ( func.concrete ) {
            return Relations.prototype.contains.call( this, func );
        } else if ( func.dom ) {
            return equal( this.dom, func.dom ) && 
                subset( func.T, this.T );
        } else if ( func.toSetExtension ) {
            return Relations.prototype.contains.call( this, 
                func.toSetExtension() );
        }
    },

    anyMember : function() {
        var self = this,
            func = function( e ) { return self.T.anyMember() };
        return this.makeSetExtension( func );
    },

    toLiteral : function() {
        return prefix + ".TotalFunctions(" + this.S.toLiteral() + "," + 
            this.T.toLiteral() + ")";
    },

    toString : function() {
        return ( this.S.toString() + " \u2192 " + this.T.toString() );
    }
});

/* PartialInjections
 * Parameters:
 *   S, T : two sets
 * Return:
 *   a new PartialInjections object
 */
var PartialInjections = function( S, T ) {
    var obj = PartialFunctions( S, T );
    obj.__proto__ = PartialInjections.prototype;
    return obj;
};

PartialInjections.prototype = new PartialFunctions();

jeb.util.extend( PartialInjections.prototype, {
    toLiteral : function() {
        return prefix + ".PartialInjections(" + this.S.toLiteral() + "," + 
            this.T.toLiteral() + ")";
    },

    toString : function() {
        return ( this.S.toString() + " \u2914 " + this.T.toString() );
    }
});

/* TotalInjections
 * Parameters:
 *   S, T : two sets
 * Return:
 *   a new TotalInjections object
 */
var TotalInjections = function( S, T ) {
    var obj = TotalFunctions( S, T );
    obj.__proto__ = TotalInjections.prototype;
    return obj;
};

TotalInjections.prototype = new TotalFunctions();

jeb.util.extend( TotalInjections.prototype, {
    toLiteral : function() {
        return prefix + ".TotalInjections(" + this.S.toLiteral() + "," + this.T.toLiteral() + ")";
    },

    toString : function() {
        return ( this.S.toString() + " \u21a3 " + this.T.toString() );
    }
});

/* PartialSurjections
 * Parameters:
 *   S, T : two sets
 * Return:
 *   a new PartialSurjections object
 */
var PartialSurjections = function( S, T ) {
    var obj = PartialFunctions( S, T );
    obj.ran = T;
    obj.__proto__ = PartialSurjections.prototype;
    return obj;
};

PartialSurjections.prototype = new PartialFunctions();

jeb.util.extend( PartialSurjections.prototype, {
    toLiteral : function() {
        return prefix + ".PartialSurjections(" + this.S.toLiteral() + "," + 
            this.T.toLiteral() + ")";
    },

    toString : function() {
        return ( this.S.toString() + " \u2900 " + this.T.toString() );
    }
});

/* TotalSurjections
 * Parameters:
 *   S, T : two sets
 * Return:
 *   a new TotalSurjections object
 */
var TotalSurjections = function( S, T ) {
    var obj = TotalFunctions( S, T );
    obj.ran = T;
    obj.__proto__ = TotalSurjections.prototype;
    return obj;
};

TotalSurjections.prototype = new TotalFunctions();

jeb.util.extend( TotalSurjections.prototype, {
    toLiteral : function() {
        return prefix + ".TotalSurjections(" + this.S.toLiteral() + "," + 
            this.T.toLiteral() + ")";
    },

    toString : function() {
        return ( this.S.toString() + " \u21a0 " + this.T.toString() );
    }
});

/* TotalBijections
 * Parameters:
 *   S, T : two sets
 * Return:
 *   a new TotalBijections object
 */
var TotalBijections = function( S, T ) {
    var obj = TotalFunctions( S, T );
    obj.ran = T;
    obj.__proto__ = TotalBijections.prototype;
    return obj;
};

TotalBijections.prototype = new TotalFunctions();

jeb.util.extend( TotalBijections.prototype, {
    toLiteral : function() {
        return prefix + ".TotalBijections(" + this.S.toLiteral() + "," + this.T.toLiteral() + ")";
    },

    toString : function() {
        return ( this.S.toString() + " \u2916 " + this.T.toString() );
    }
});

/* Lambda
 * Parameters:
 *   predicateFunction : a function
 *   expressionFunction : a function
 *   domainArray : an array contains all quantifiers domain
 *   stringForm : optional, the string form of lambda
 * Return:
 *   an abstract form of lambda
 */
var Lambda = function( predicateFunction, expressionFunction, 
    domainArray, stringForm ) {
    var result = SetComprehension( predicateFunction, 
        expressionFunction, domainArray, stringForm );
    result.type = prefix + ".Lambda";
    return result;
};

/* id
 * Parameters:
 *   object : a math object
 * Return:
 *   the same object
 */
var id = function( object ) {
    return object;
};

/* prj1
 * Parameters:
 *   pair : a Pair
 * Return:
 *   the left part of pair
 */
var prj1 = function( pair ) {
    return pair.left;
};

/* prj2
 * Parameters:
 *   pair : a Pair
 * Return:
 *   the right part of pair
 */
var prj2 = function( pair ) {
    return pair.right;
};

/* functionImage
 * Parameters:
 *   f : a function object
 *   E : a expression
 * Return:
 *   the image of E defined by f
 */
var functionImage = function( f, E ) {
    
    if ( !( typeof f === "object" ) ) {
        return;
    }
    if ( f.concrete ) { // case set extension
        return f.getImage( E );
    } else if ( f.functionImage ) { // case defined fImage
        if( E instanceof Pair ) {
            var argArray = [];
                E.toArguments( argArray );
            return f.functionImage.apply( null, argArray );
        } else {
            return f.functionImage( E );
        }
    }
};


/******************************************************************************
 * Event-B predicate
 ******************************************************************************/

/* bTrue
 * Parameters:
 *   none
 * Return:
 *   true
 */
var bTrue = function() {
    return true;
};

/* bFalse
 * Parameters:
 *   none
 * Return:
 *   false
 */
var bFalse = function() {
    return false;
};


/* implication
 * Parameters:
 *   P, Q : two predicates
 * Return:
 *   a boolean value
 */
var implication = function( P, Q ) {
    return !Boolean( P ) || Boolean( Q );
};

/* equivalence
 * Parameters:
 *   P, Q : two predicates
 * Return:
 *   a boolean value
 */
var equivalence = function( P, Q ) {
    return Boolean( P ) === Boolean( Q );
};

/* and
 * Parameters:
 *   a list of predicates
 * Return:
 *   a boolean value
 */
var and = function( /* predicateList */ ) {
    var argArray = [].slice.call( arguments, 0 ),
        i, len, 
        result = Boolean( argArray[0] ) && Boolean( argArray[1] );
    for ( i = 2, len = argArray.length; result && i < len; i++ ) {
        result = Boolean( argArray[i] );
    }
    return result;
};

/* or
 * Parameters:
 *   a list of predicates
 * Return:
 *   a boolean value
 */
var or = function( /* predicateList */ ) {
    var argArray = [].slice.call( arguments, 0 ),
        i, len, 
        result = Boolean( argArray[0] ) || Boolean( argArray[1] );
    for ( i = 2, len = argArray.length; !result && i < len; i++ ) {
        result = Boolean( argArray[i] );
    }
    return result;
};

/* not
 * Parameters:
 *   P : a predicate
 * Return:
 *   a boolean value
 */
var not = function( P ) {
    return !Boolean( P );
};

/* forAll
 * Parameters:
 *   predicateFunction : a function
 *   domainArray : an array contains all quantifiers domain
 * Return:
 *   a boolean value
 */
var forAll = function( predicateFunction, domainArray ) {
    // argArray  : an array used to construct predicateFunction arguments
    var argArray = [],
        lastLevel = domainArray.length - 1;
    // nestLevel : the level of recursive call
    var check = function( nestLevel ) {
        if ( nestLevel === lastLevel ) { // the last quantifier domain
            return domainArray[ nestLevel ].every( function( x ) {
                argArray[ nestLevel ] = x; 
                return predicateFunction.apply( null, argArray );
            });
        } else {
            return domainArray[ nestLevel ].every( function( x ) {
                argArray[ nestLevel ] = x; 
                return check( nestLevel + 1 );
            });
        }
    };
    return check( 0 );
};

/* exists
 * Parameters:
 *   predicateFunction : a function
 *   domainArray : an array contains all quantifiers domain
 * Return:
 *   a boolean value
 */
var exists = function( predicateFunction, domainArray ) {
    // argArray  : an array used to construct predicateFunction arguments
    var argArray = [],
        lastLevel = domainArray.length - 1;
    // nestLevel : the level of recursive call
    var check = function( nestLevel ) {
        if ( nestLevel === lastLevel ) { // the last quantifier domain
            return domainArray[ nestLevel ].some( function( x ) {
                argArray[ nestLevel ] = x; 
                return predicateFunction.apply( null, argArray );
            });
        } else {
            return domainArray[ nestLevel ].some( function( x ) {
                argArray[ nestLevel ] = x; 
                return check( nestLevel + 1 );
            });
        }
    };
    return check( 0 );
};

/* equal
 * Parameters:
 *   E, F : two same type math objects
 * Return:
 *   a boolean value
 */
var equal = function( E, F ) {
    var left = ( typeof E === "object" ? E.toLiteral() : E ),
        right = ( typeof F === "object" ? F.toLiteral() : F );
    return left === right;


//    if ( E != undefined && E.equal ) {
//        return E.equal( F );
//    } else {
//        return false;
//    }
    
//    if ( E instanceof Integer ) {
//        return ( E.__value.compare( F.__value ) === 0 ? true : false );
//    } else if ( E instanceof Pair ) {
//        return ( equal( E.left, F.left ) 
//            && equal( E.right, F.right ) );
//    } else if ( E instanceof SetExtension ) {
//        if ( E.length > 0 ) { // set extension
//            var setA = jeb.util.clone( E ),
//                setB = jeb.util.clone( F ),
//                index = 0,
//                elementOfSetA;
//            while ( setA.length > 0 && index !== -1 ) {
//                elementOfSetA = setA.pop();
//                index = setB.indexOf( elementOfSetA );
//                if ( index !== -1 ) { // setB contains elementOfSetA
//                    setB.splice( index, 1 );
//                }
//            }
//            // setB contains the last element of setA, and eventually setA, setB
//            // become an empty set.
//            return ( index !== -1 && setA.length === 0 && setB.length === 0 );
//        } else if ( E.fImage ) {
//            return E.fImage === F.fImage;
//        } else { // EmptySet
//            return ( F.length === 0 ? true : false );
//        }
//    } else if ( E instanceof CartesianProduct ) {
//        return equal( E.S, F.S ) && equal( E.T, F.T );
//    } else if ( E instanceof UpTo ) {
//        return equal( E.low, F.low ) && equal( E.high, F.high );
//    } else if ( E instanceof INTEGER ) {
//        return F instanceof INTEGER;
//    } else if ( typeof E === "boolean" ) {
//        return E === F;
//    }
};

/* notEqual
 * Parameters:
 *   E, F : two same type math objects
 * Return:
 *   a boolean value
 */
var notEqual = function( E, F ) {
    return !equal( E, F );
};

/* bool
 * Parameters:
 *   P : a predicate
 * Return:
 *   the value of predicate
 */
var bool = function( P ) {
    return Boolean(P);
};

/******************************************************************************
 * Event-B assignment
 ******************************************************************************/

/* becomesEqualTo
 * Parameters:
 *   identifierArray : an array contains assigned identifiers
 *   expressionArray : an array contains expressions
 * Return:
 *   undefined
 */
var becomesEqualTo = function( identifierArray, expressionArray ) {
    var i, len;
    for ( i = 0, len = identifierArray.length; i < len; i++ ) {
        identifierArray[i]._value = expressionArray[i];
    }
};

/* becomesMemberOf
 * Parameters:
 *   x : an assigned identifier
 *   E : a set expression
 * Return:
 *   undefined
 */
var becomesMemberOf = function( x, E ) {
    x._value = E.anyMember();
};

/* becomesSuchThat
 * Parameters:
 *   identifierArray : an array contains assigned variables
 *   predicateFunction : a function
 *   domainArray : an array contains all identifiers domain
 * Return:
 *   undefined
 */
var becomesSuchThat = function( identifierArray, 
    predicateFunction, domainArray ) {
    var lastLevel = domainArray.length - 1;
    // nestLevel : the level of recursive call
    var check = function( nestLevel ) {
        if ( nestLevel === lastLevel ) { // the last quantifier domain
            return domainArray[nestLevel].some( function( x ) {
                identifierArray[ nestLevel ]._value = x ; 
                return predicateFunction();
            });
        } else {
            return domainArray[nestLevel].some( function( x ) {
                identifierArray[ nestLevel ]._value = x ; 
                return check( nestLevel + 1 );
            });
        }
    };
    if ( !check( 0 ) ) {
        throw new Error("No primed values satisfied the before-after-predicate!");
    }
};

var $B = Integer;

jeb.util.extend( $B, {
    TRUE                       : TRUE,
    FALSE                      : FALSE,
    Pair                       : Pair,
 
    minus                      : minus,
    divide                     : divide,
    mod                        : mod,
    pow                        : pow,
    plus                       : plus,
    multiply                   : multiply,
    pred                       : pred,
    succ                       : succ,
    unminus                    : unminus,

    lessThan                   : lessThan,
    lessEqual                  : lessEqual,
    greaterThan                : greaterThan,
    greaterEqual               : greaterEqual,

    SetExtension               : SetExtension,
    SetComprehension           : SetComprehension,
    PowerSet                   : PowerSet,
    PowerSet1                  : PowerSet1,
    CartesianProduct           : CartesianProduct,
    UpTo                       : UpTo,

    EmptySet                   : EmptySet,
    BOOL                       : BOOL,
    INTEGER                    : INTEGER,
    NATURAL                    : NATURAL,
    NATURAL1                   : NATURAL1,

    setMinus                   : setMinus,
    setUnion                   : setUnion,
    setInter                   : setInter,
    union                      : union,
    inter                      : inter,
    quantifiedUnion            : quantifiedUnion,
    quantifiedInter            : quantifiedInter,
    card                       : card,
    min                        : min,
    max                        : max,

    belong                     : belong,
    notBelong                  : notBelong,
    properSubset               : properSubset,
    notProperSubset            : notProperSubset,
    subset                     : subset,
    notSubset                  : notSubset,
    finite                     : finite,
    partition                  : partition,
   
    Relations                  : Relations,
    TotalRelations             : TotalRelations,
    SurjectiveRelations        : SurjectiveRelations,
    TotalSurjectiveRelations   : TotalSurjectiveRelations,

    dom                        : dom,
    ran                        : ran,
    relationImage              : relationImage,
    domainRestriction          : domainRestriction,
    domainSubtraction          : domainSubtraction,
    rangeRestriction           : rangeRestriction,
    rangeSubtraction           : rangeSubtraction,
    backwardComposition        : backwardComposition,
    forwardComposition         : forwardComposition,
    override                   : override,
    directProduct              : directProduct,
    parallelProduct            : parallelProduct,
    converse                   : converse,

    PartialFunctions           : PartialFunctions,
    TotalFunctions             : TotalFunctions,
    PartialInjections          : PartialInjections,
    TotalInjections            : TotalInjections,
    PartialSurjections         : PartialSurjections,
    TotalSurjections           : TotalSurjections,
    TotalBijections            : TotalBijections,

    Lambda                     : Lambda,
    id                         : id,
    prj1                       : prj1,
    prj2                       : prj2,
    functionImage              : functionImage,

    bTrue                      : bTrue,
    bFalse                     : bFalse,
    implication                : implication,
    equivalence                : equivalence,
    and                        : and,
    or                         : or,
    not                        : not,
    forAll                     : forAll,
    exists                     : exists,
    equal                      : equal,
    notEqual                   : notEqual,
    bool                       : bool,

    becomesEqualTo             : becomesEqualTo,
    becomesMemberOf            : becomesMemberOf,
    becomesSuchThat            : becomesSuchThat,
});

window.$B = $B;

})();

