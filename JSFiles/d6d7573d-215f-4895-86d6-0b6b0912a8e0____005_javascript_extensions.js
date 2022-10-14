<javascript:code xmlns:repository="http://general_server.org/xmlnamespaces/repository/2006" name="javascript-extensions">
  <javascript:global-function name="clone" parameters="oObject" requires="jQuery" parameter-checks="off"><![CDATA[
    return jQuery.extend({}, oObject);
  ]]></javascript:global-function>

  <javascript:global-function name="updateClassDataObject" parameters="fClass, [uData, oDataObject, bSingularOnly = false]" parameter-checks="off"><![CDATA[
    //used for fClass context on Event and by trigger results
    //e.g. object.DatabaseElement = jQuery
    var uStoreItem, sStoreName = fClass.functionName();
    if ((uData !== undefined) && (oDataObject !== undefined)) {
      uStoreItem = oDataObject[sStoreName];
      if (bSingularOnly) {
        //------------------------------------------------ singular
        //overwrite is ok here
        oDataObject[sStoreName] = uData;
      } else {
        //------------------------------------------------ multiple add()
        //note that Array has been extended so that Array::add() => Array::concat()
        //jQuery::add()
        if (uStoreItem instanceof Object && uStoreItem.add instanceof Function) {
          oDataObject[sStoreName] = uStoreItem.add(uData);
        } else {
          if ((uStoreItem !== undefined) && window.console) {
            window.console.warn("forced overwrite [" + sStoreName + "] results in oDataObject. set bSingularOnly = true to supress warning");
            window.console.log(uStoreItem);
            window.console.log(uData);
          }
          oDataObject[sStoreName] = uData;
        }
      }
    }
  ]]></javascript:global-function>

  <!-- ############################################# Boolean ############################################# -->
  <javascript:javascript-extension object-name="Boolean" name="eq" parameters="bBoolean"><![CDATA[
    return (this == bBoolean);
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="Boolean" name="toURLEncoded" parameters="[s1ContextName, fSubConversion, oContextObject]"><![CDATA[
    return this.toString() + "()";
  ]]></javascript:javascript-extension>

  <javascript:javascript-static-extension object-name="Boolean" name="istype" parameters="uValue" parameter-checks="off"><![CDATA[
    return (typeof uValue === "boolean" || uValue instanceof Boolean);
  ]]></javascript:javascript-static-extension>

  <javascript:javascript-static-extension object-name="Boolean" name="isTypeHungarianNotation" parameters="s1Name" parameter-checks="off"><![CDATA[
    return (s1Name[0] == "b");
  ]]></javascript:javascript-static-extension>

  <javascript:javascript-static-extension object-name="Boolean" name="isTypeNaturalNotation" parameters="s1NameCamel" parameter-checks="off"><![CDATA[
    return (s1NameCamel.match(/^is[A-Z]|^boolean[A-Z]|^optional$|^single|^can[A-Z]|^has[A-Z]|^no[A-Z].*/) instanceof Array);
  ]]></javascript:javascript-static-extension>

  <!-- ############################################# Number ############################################# -->
  <javascript:javascript-static-extension object-name="Number" name="istype" parameters="uValue" parameter-checks="off"><![CDATA[
    return (typeof uValue === "number" || uValue instanceof Number);
  ]]></javascript:javascript-static-extension>

  <javascript:javascript-extension object-name="Number" name="eq" parameters="iNumber"><![CDATA[
    return (this == iNumber);
  ]]></javascript:javascript-extension>

  <javascript:javascript-static-extension object-name="Number" name="isTypeHungarianNotation" parameters="s1Name" parameter-checks="off"><![CDATA[
    return (s1Name[0] == "i");
  ]]></javascript:javascript-static-extension>

  <javascript:javascript-static-extension object-name="Number" name="isTypeNaturalNotation" parameters="s1NameCamel" parameter-checks="off"><![CDATA[
    return s1NameCamel.isSingular() && (s1NameCamel.match(/^position|[Cc]ount$|^number/) instanceof Array);
  ]]></javascript:javascript-static-extension>

  <javascript:javascript-extension object-name="Number" name="noIteration"><![CDATA[
    //useful for this.example = 4.noIteration();
    this.noIteration=true;
    return this;
  ]]></javascript:javascript-extension>

  <!-- ############################################# String ############################################# -->
  <javascript:javascript-extension object-name="String" name="isAllUpperCase"><![CDATA[
    return (this.length && this.toUpperCase() == this);
  ]]></javascript:javascript-extension>

  <javascript:javascript-static-extension object-name="String" name="istype" parameters="uValue" parameter-checks="off"><![CDATA[
    return (typeof uValue === "string" || uValue instanceof String);
  ]]></javascript:javascript-static-extension>

  <javascript:javascript-static-extension object-name="String" name="isTypeHungarianNotation" parameters="s1Name" parameter-checks="off"><![CDATA[
    return (s1Name[0] == "s");
  ]]></javascript:javascript-static-extension>

  <javascript:javascript-static-extension object-name="String" name="isTypeNaturalNotation" parameters="s1NameCamel" parameter-checks="off"><![CDATA[
    return s1NameCamel.isSingular() && (s1NameCamel.match(/Name$/) || s1NameCamel.match(/String$/) || s1NameCamel.match(/ID$/) instanceof Array);
  ]]></javascript:javascript-static-extension>

  <javascript:javascript-static-extension object-name="String" name="hasLength"><![CDATA[
    return (this.length > 0);
  ]]></javascript:javascript-static-extension>

  <javascript:javascript-extension object-name="String" name="noIteration"><![CDATA[
    //useful for this.example = "example".noIteration();
    this.noIteration=true;
    return this;
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="String" name="nextIndexOf" parameter-checks="off" parameters="sSearch, iFrom"><![CDATA[
    //"111e11e11".nextIndexOf("e", 4) == 6
    var iResult, iNextIndexOf;
    if (iFrom === 0) iResult = this.indexOf(sSearch);
    else {
      iNextIndexOf = this.substr(iFrom).indexOf(sSearch);
      iResult      = (iNextIndexOf === -1 ? -1 : iFrom + iNextIndexOf);
    }
    return iResult;
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="String" name="inside" parameters="aArray"><![CDATA[
    //"in" is a reserved word in Javascript
    //we use toString() otherwise the Class gets sent through and will not compare properly
    return aArray.contains(this.toString());
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="String" name="last"><![CDATA[
    //no trimming done here. do that before
    return (this.length ? this[this.length-1] : "");
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="String" name="first"><![CDATA[
    //no trimming done here. do that before
    return this[0];
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="String" name="isPlural"><![CDATA[
    return this.match(/[^s]s$/);
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="String" name="isSingular"><![CDATA[
    return !this.isPlural();
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="String" name="singular"><![CDATA[
    return (this.endsWith("s") ? this.substr(0, this.length-1) : this);
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="String" name="endsWith" parameters="sChar"><![CDATA[
    return (this.last() == sChar);
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="String" name="eq" parameters="uObject"><![CDATA[
    //we use a toString() to force a primitives conversion
    //because new String("test") != new String("test")
    return (this.toString() == uObject); 
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="String" name="startsWith" parameters="sChar"><![CDATA[
    return (this.first() == sChar);
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="String" name="trim"><![CDATA[
    //trim is quite recent (Javascript 1.8)
    //http://www.w3schools.com/jsref/jsref_trim_string.asp
    return this.replace(/^\s+|\s+$/g, '');
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="String" name="substringBefore" parameters="sString, [sDefault = this]"><![CDATA[
    var iIndex = this.indexOf(sString);
    return (iIndex == -1 ? sDefault : this.substr(0, iIndex));
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="String" name="substringAfter" parameters="sString, [sDefault = '']"><![CDATA[
    var iIndex = this.indexOf(sString);
    return (iIndex == -1 ? sDefault : this.substr(iIndex + 1));
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="String" name="contains" parameters="sString"><![CDATA[
    return this.indexOf(sString) != -1;
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="String" name="setUrlParameter" parameters="s1Name, sValue, [fValueAppend]"><![CDATA[
    //fValueAppend controls the concatenation of existing and new values
    //e.g. String.prototype.commaAdd
    //by default the new value overwrites the old
    //case sensitive as with XML
    var rSearch, sExistingValue, sNewValue, sNewQuery;
    var sUrl             = this.substringBefore("?"); //returns whole string if ? not found
    var sQuery           = this.substringAfter("?");  //returns empty string if ? not found
    var sNormalisedQuery = "&" + sQuery;              //maybe only an &

    //search for existing
    rSearch  = new RegExp("&" + s1Name + "=([^&]*)", "g");
    aMatches = rSearch.exec(sNormalisedQuery);
    if (aMatches instanceof Array && aMatches.length == 2) {
      //create or set new value
      if ((fValueAppend !== undefined)) { //e.g. String.prototype.commaAdd
        sExistingValue = aMatches[1];
        sNewValue      = fValueAppend.call(sExistingValue, sValue);
      } else {
        sNewValue = sValue; //overwrite
      }

      //set and un-normalise query
      sNewNormalisedQuery = sNormalisedQuery.replace(rSearch, "&" + s1Name + "=" + sNewValue);
      sNewQuery           = sNewNormalisedQuery.substr(1);
      sRet                = sUrl + "?" + sNewQuery;
    } else {
      //regexp search reveals no key so far
      //set the value
      sRet                = sUrl + "?" + sQuery.ampersandAdd(s1Name, sValue);
    }

    return sRet;
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="String" name="slashPrepend" parameters="[sPrefix]"><![CDATA[
    var sNewString = this.trim();
    return (sPrefix ? sPrefix : "") + (sNewString.length == 0 || sNewString.startsWith("/") ? "" : "/") + sNewString;
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="String" name="nameValueDelimitAdd" parameters="sDelimiter, s1Name, [sValue]"><![CDATA[
    var sNewString = this.trim();
    if (s1Name)  {
      sNewString += (sNewString.length == 0 || this.endsWith(sDelimiter) ? "" : sDelimiter) + s1Name;
      if (sValue) sNewString += "=" + sValue;
    }
    return sNewString;
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="String" name="slashAdd" parameters="(String) s1Name, [sValue]"><![CDATA[
    return this.nameValueDelimitAdd("/", s1Name, sValue);
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="String" name="ampersandAdd" parameters="(String) s1Name, [sValue]"><![CDATA[
    return this.nameValueDelimitAdd("&", s1Name, sValue);
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="String" name="commaAdd" parameters="(String) s1Name, [sValue]"><![CDATA[
    return this.nameValueDelimitAdd(",", s1Name, sValue);
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="String" name="pipeAdd" parameters="(String) s1Name, [sValue]"><![CDATA[
    return this.nameValueDelimitAdd("|", s1Name, sValue);
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="String" name="camelToDash"><![CDATA[
    //thingOrThing => thing-or-thing
    //meta_thingOrThing => meta:thing-or-thing
    //we do not replace the first Capital with a -: ObjectThing => object-thing
    return this.replace(/^([a-z][a-z0-9_-]*)_/g, "$1:").replace(/([^A-Z])([A-Z]+)/g, "$1-$2").toLowerCase();
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="String" name="removeNamespace"><![CDATA[
    return this.replace(/^[^:]+:/, "");
  ]]></javascript:javascript-extension>
  
  <javascript:javascript-extension object-name="String" name="underscoreToDash"><![CDATA[
    return this.replace(/_/g, "-");
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="String" name="underscoreToCamel"><![CDATA[
    return this.underscoreToDash().dashToCamel();
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="String" name="toJQueryNativeValue"><![CDATA[
    // to-type="JQueryNativeValue"
    //jQuery functions get confused when passed the String object sometimes
    //e.g. the .on(sEventName)
    return this.toString();
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="String" name="toXPathString" parameters="[s1ContextName, fSubConversion, oContextObject]"><![CDATA[
    // to-type="XPathString"
    return new XPathString(this);
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="String" name="toURLEncoded" parameters="[s1ContextName, fSubConversion, oContextObject]"><![CDATA[
    //WE use / slash for esacping in-string characters now because:
    //https://bugs.chromium.org/p/chromium/issues/detail?id=25916
    //replace any escaped chars with the URL escape
    //  http://www.ietf.org/rfc/rfc2396.txt 
    //  backslash are not valid in URLs
    return this; //this.replace(/\\/g, '%5C');
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="String" name="toCSSPathString" parameters="[s1ContextName, fSubConversion, oContextObject]"><![CDATA[
    // to-type="CSSPathString"
    return new CSSPathString(this);
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="String" name="toMACRO" parameters="[s1ContextName, fSubConversion, oContextObject]"><![CDATA[
    // to-type="MACRO"
    return this;
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="String" name="toFunction" parameters="[s1ContextName, fSubConversion, oContextObject]"><![CDATA[
    // to-type="Function"
    //static usually like JOO
    //could be HTMLWebpage.singleton.subObject.otherThing.function
    var fValue = Function.fromFunctionPath(this);
    if (!fValue) Debug.warn(this, "sAttributeValue Function [" + this + "] not found");
    return fValue;
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="String" name="toDocument" parameters="[s1ContextName, fSubConversion, oContextObject]"><![CDATA[
    return new JOO(this).get(0);
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="String" name="toNumber" parameters="[s1ContextName, fSubConversion, oContextObject]"><![CDATA[
    var iValue = parseInt(this);
    if (iValue === NaN) Debug.warn(this, "NaN number conversion for [" + this + "]");
    return iValue;
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="String" name="toBoolean" parameters="[s1ContextName, fSubConversion, oContextObject]"><![CDATA[
    //taken from XmlLibrary::textEqualsTrue(const char *sText) const
    return (this == "yes" || this == "true" || this == "on" || this == "1");
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="String" name="toJOO" parameters="[s1ContextName, fSubConversion, oContextObject]"><![CDATA[
    //parameter checks are ON for this one
    var jqContextObject;
    if (oContextObject !== undefined) {
      if      (oContextObject instanceof jQuery) jqContextObject = oContextObject;
      else if (oContextObject.toJQuery)          jqContextObject = oContextObject.toJQuery();
    }
    return new JOO(jqContextObject ? jqContextObject.find(this) : this);
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="String" name="toAnyVariableType" parameters="[s1ContextName, fSubConversion, oContextObject]"><![CDATA[
    Debug.warn(this, "[" + s1ContextName + "] conversion to AnyVariableType really?");
    return undefined;
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="String" name="toArray" parameters="[s1ContextName, fSubConversion, oContextObject]"><![CDATA[
    //Function.convertVariable(s1ContextName, fConversion, uVariable, fSubConversion, ...)
    return this.split(",").eachResults(Function.convertVariable, this, s1ContextName, fSubConversion, undefined, undefined);
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="String" name="toClass" parameters="[s1ContextName, fSubConversion, oContextObject]"><![CDATA[
    //e.g. HTTP, User, Repository
    var sClassName = this.replace(/^~|^Class__/, '');
    var fClass     = window[sClassName];
    if (!(fClass instanceof Function)) 
      Debug.warn(this, "Class Function not found when converting [" + this + "] to object");
    return fClass;
  ]]></javascript:javascript-extension>

  <javascript:override name="document.write" parameters="sString"><![CDATA[
    alert("document.write will not always work and is not allowed");
  ]]></javascript:override>

  <javascript:javascript-extension object-name="String" name="quote"><![CDATA[
    return "'" + this.replace(/'/g, "\\'") + "'";
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="String" name="capitalise"><![CDATA[
    return (this.length ? this[0].toUpperCase() + this.substr(1) : this);
  ]]></javascript:javascript-extension>

  <javascript:javascript-static-extension-property object-name="String" name="registeredAcronyms">new Array("id", "html", "xml", "db", "cpp");</javascript:javascript-static-extension-property>

  <javascript:javascript-extension object-name="String" name="limit" parameters="[iLength = 20, sElipse = '...']"><![CDATA[
    var sTrimmed = this.trim();
    return (sTrimmed.length > iLength ? sTrimmed.substr(0, iLength - sElipse.length) + sElipse : sTrimmed);
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="String" name="dashToCamel"><![CDATA[
    var sNewString       = "";
    var sLowerCaseString = this.toLowerCase();
    var iNextDash = 0, iPos = 0;

    //namespace handling: xml:id => xml-id => xmlID
    //reverse conversion is only possible with prior namespace knowledge
    //e.g. camelToDash(sName, "xml")
    sLowerCaseString = sLowerCaseString.replace(/:/, '-');

    while (iNextDash !== -1) {
      iNextDash = sLowerCaseString.nextIndexOf("-", iPos);
      if (iNextDash === -1) sNextPiece = (iPos === 0 ? sLowerCaseString : sLowerCaseString.substr(iPos));
      else                  {
        if (iNextDash === iPos) {
          if (iPos === 0) {
            sNextPiece = undefined; //ignore leading dash
            if (window.console) console.warn("leading dash ignored in [" + this + "]");
          } else {
            sNextPiece = undefined; //ignore double dash
            if (window.console) console.warn("double dash ignored in [" + this + "]");
          }
        } else sNextPiece = sLowerCaseString.substr(iPos, iNextDash-iPos);
      }

      if (sNextPiece) {
        //do not uppercase the first chunk even if an acronym
        if (iPos == 0) sNewString += sNextPiece;
        else {
          if (String.registeredAcronyms.contains(sNextPiece)) sNewString += sNextPiece.toUpperCase();
          else sNewString += sNextPiece.capitalise();
        }
      }

      iPos = iNextDash + 1;
    }

    return sNewString;
  ]]></javascript:javascript-extension>

  <!-- ############################################# Function (Object) ############################################# -->
  <javascript:javascript-static-extension object-name="Function" name="istype" parameters="uValue" parameter-checks="off"><![CDATA[
    return (uValue instanceof Function);
  ]]></javascript:javascript-static-extension>

  <javascript:javascript-static-extension object-name="Function" name="isTypeHungarianNotation" parameters="s1Name" parameter-checks="off"><![CDATA[
    return (s1Name[0] == "f");
  ]]></javascript:javascript-static-extension>

  <javascript:javascript-static-extension object-name="Function" name="isTypeNaturalNotation" parameters="s1NameCamel" parameter-checks="off"><![CDATA[
    return s1NameCamel.isSingular() && s1NameCamel.startsWith("func");
  ]]></javascript:javascript-static-extension>

  <javascript:javascript-static-extension object-name="Function" name="fromFunctionPath" parameters="s1FunctionPath"><![CDATA[
    //HTMLWebpage.singleton.subObject.otherThing.function => Function pointer
    var aFuncSteps = s1FunctionPath.split(".");
    var oObject    = window;
    for (var i = 0; oObject instanceof Object && i < aFuncSteps.length; i++)
      oObject = oObject[aFuncSteps[i]];
    return oObject;
  ]]></javascript:javascript-static-extension>
  
  <javascript:javascript-extension object-name="Function" name="toURLEncoded" parameters="[s1ContextName, fSubConversion, oContextObject]"><![CDATA[
    return this.functionName();
  ]]></javascript:javascript-extension>
  
  <javascript:javascript-extension object-name="Function" name="toJQueryNativeValue" parameters="[s1ContextName, fSubConversion, oContextObject]"><![CDATA[
    // to-type="JQueryNativeValue"
    //Functions can be callbacks or Class definitions
    //JOO(document).children(IDE) => JOO(document).children(".Class__IDE")
    //NOTE: this works also with Object => .Object
    var oRet = this;
    
    if      (this.definedClass) oRet = CSSPathString.fromGSClass(this).toString();
    else if (this === Object)   oRet = ".Object";
      
    return oRet;
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="Function" name="toXPathString" parameters="[s1ContextName, fSubConversion, oContextObject]"><![CDATA[
    return XPathString.databaseClass(this);
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="Function" name="eq" parameters="fFunction"><![CDATA[
    return (fFunction !== undefined && this.toString() == fFunction.toString());
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="Function" name="directOn" parameters="oObject"><![CDATA[
    if ((this.classDerivedConstructor === undefined))    Debug.error(this, "not a method");
    if ((oObject.classDerivedConstructor === undefined)) Debug.error(this, "not a Class object");
    return (this.classDerivedConstructor === oObject.classDerivedConstructor);
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="Function" name="builtIn"><![CDATA[
    //all GS methods must have a classDerivedConstructor;
    return (this.classDerivedConstructor === undefined);
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="Function" name="clone"><![CDATA[
    var fClone, aMatches, sBody, sArguments, aArgs, i;

    if (aMatches = this.toString().match(/^[^(]+\(([^(]*)\)[^{]*{((.|[\n\r])*)}$/)) {
      if (aMatches.length > 2) {
        sArguments = aMatches[1];
        aArgs      = sArguments.split(/\s*,\s*/);
        sBody      = aMatches[2]
        
        if (sBody.match(/__u\d+/g) && window.console) {
          console.warn("function contains __uX variables during cloning");
          console.log(this);
        }
        
        if (aArgs.length < 10) {
          //rationalise the args
          if (aArgs[0] == "") aArgs[0] = "__u0"; //will always be one
          for (i = 1; i < 10; i++) {
            if (i >= aArgs.length) aArgs[i] = "__u" + i.toString();
          }
      
          //clone
          //could use Function.prototype.constructor here
          //unfortunately Funtion.name is read-only
          fClone = new Function(aArgs[0], aArgs[1], aArgs[2], aArgs[3], aArgs[4], aArgs[5], aArgs[6], aArgs[7], aArgs[8], aArgs[9], aMatches[2]);
          fClone.functionNameHint        = this.functionName();
          fClone.functionType            = this.functionType;
          fClone.noIteration             = this.noIteration;
          fClone.classDerivedConstructor = this.classDerivedConstructor;
          fClone.isClone                 = true;
        } else if (window.console) {
          console.error("clone function has more than 10 arguments");
          console.log(this);
        }
      } else if (window.console) {
        console.error("failed to clone function");
        console.log(this);
      }
    } else {
      console.error("failed to clone function. did not match the regexp");
      console.log(this);
    }
    
    return fClone;
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="Function" name="functionName"><![CDATA[
    var aMatches;
    if (undefined === this.functionNameHint) {
      aMatches = this.toString().match(/^function\s+([^(]+)/);
      if (aMatches && aMatches.length >= 1) this.functionNameHint = aMatches[1];
      else                                  this.functionNameHint = "anonymous";
    }
    return this.functionNameHint;
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="Function" name="functionStem"><![CDATA[
    return this.functionName().replace(/[A-Z][a-z]+$/, '');
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="Function" name="camelToDash"><![CDATA[
    return this.functionName().camelToDash();
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="Function" name="isDerivedFrom" parameters="fBaseClass" parameter-checks="off"><![CDATA[
    //e.g. is this Manager() Function derived from fBaseClass User() Function
    //we are entertaining MULTI-inheritance here 
    //so, non-prototype inheritance will NOT appear in the prototype chain
    //remember this.baseClasses is only ONE level, not the entire tree
    //returns false if this === fBaseClass
    var bRet = this.prototype instanceof fBaseClass;
    
    if (!bRet && this.baseClasses instanceof Array) {
      bRet = this.baseClasses.contains(fBaseClass);
      if (!bRet) bRet = this.baseClasses.untilEx(Function.prototype.isDerivedFrom, DEFAULT, fBaseClass);
    }
    
    return bRet;
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="Function" name="cpfs" parameters="fCalledMethod, bProtected" parameter-checks="off"><![CDATA[
    //Function.checkProtectedFunctionScope()
    //DEBUG mode: using depreciated arguments properties callee
    //private methods MUST be called from another method within the same Class
    //OR a derived class
    //e.g. Manager can call protected methods on User
    var bOk   = false;
    var iLoop = 10;
    var oArguments, fCalledClass, fCallingMethod, fCallingClass;
    var sFunctionName = "unknown", 
        sClass        = "Global";
    
    if (bProtected) {
      if (arguments.callee && arguments.callee.caller) {
        oArguments    = arguments.callee.caller.arguments;
        if (oArguments.callee) {
          fCalledClass  = oArguments.callee.classDerivedConstructor;
          sFunctionName = oArguments.callee.functionName();
          if (fCalledClass) {
            sClass         = fCalledClass.functionName();
            fCallingMethod = oArguments.callee.caller;
            //Array.each can be used by the same chain to call its own method
            //so we need to walk the tree to the first calling class if any
            //IMPORTANT (iLoop):
            //arguments.callee.caller points to the function reference, 
            //of which it only exists one of per function in each call stack.
            //so this does not work in cyclic situations
            while (fCallingMethod 
              && --iLoop
              && (
                !fCallingMethod.classDerivedConstructor                     //Array.each
              || fCallingMethod.classDerivedConstructor === window.OO       //OO.chainMethod
              )
            ) fCallingMethod = fCallingMethod.caller;
            
            if (iLoop) {
              if (fCallingMethod) {
                fCallingClass = fCallingMethod.classDerivedConstructor;
                if (fCallingClass) bOk = (
                    fCalledClass === fCallingClass 
                  || fCallingClass.isDerivedFrom(fCalledClass) //derived calling base protected
                  || fCalledClass.isDerivedFrom(fCallingClass) //base calling overridden on derived
                  || fCallingClass.isFriendOf(fCalledClass)
                );
              }
            } else {
              //unfortunate but no way around this currently
              bOk = true;
            }
          }
        }
      }
    } else {
      //not protected
      bOk = true;
    }

    //reporting
    if (!bOk && window.console) 
      console.warn(sClass + "::" + sFunctionName + "() protected function called");

    return bOk;
  ]]></javascript:javascript-extension>
  
  <javascript:javascript-extension object-name="Function" name="isFriendOf" parameters="fCalledClass" parameter-checks="off"><![CDATA[
    return (fCalledClass && fCalledClass.aFriends instanceof Array && fCalledClass.aFriends.contains(this));
  ]]></javascript:javascript-extension>

  <!-- ############################################# Function type checking ############################################# -->
  <javascript:javascript-extension object-name="Function" name="types" parameter-checks="off" parameters="s1Name"><![CDATA[
    //JavascriptObjectType is the VariableType for Object because we do not want to extend Object
    //Object not included: JavascriptObjectType required for object checking
    //VariableType.aVariableTypes:
    //  Array, String, Boolean, Number, Function, XPathString, JOO, ClassFunction, ...
    var aVariableTypes;
    
    if (window.VariableType && window.VariableType.aVariableTypes instanceof Array) {
      //pluggable system
      aVariableTypes = VariableType.aVariableTypes;
    } else {
      //early framework request
      aVariableTypes = JS_BASE_CHECK_TYPES;
    }
    
    return aVariableTypes;
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="Function" name="typeFromValue" parameter-checks="off" parameters="uValue"><![CDATA[
    //VariableType.aVariableTypes:
    //  Array, String, Boolean, Number, Function, XPathString, JOO, ClassFunction, ...
    var fType;

    fType = Function.types().untilEx(function(uValue){
      if (!this.notDefinedClass) { //in case the type is not fully defined yet
        if   (uValue instanceof this
          || (this.istype instanceof Function && this.istype(uValue))
        ) return this;
      }
    }, undefined, uValue);

    return fType;
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="Function" name="typeHungarian" parameter-checks="off" parameters="s1NameCamel"><![CDATA[
    //VariableType.aVariableTypes:
    //  Array, String, Boolean, Number, Function, XPathString, JOO, ClassFunction, ...
    var fType;

    fType = Function.types().untilEx(function(s1NameCamel){
      if (!this.notDefinedClass) { //in case the type is not fully defined yet
        if (this.isTypeHungarianNotation instanceof Function) {
          if (this.isTypeHungarianNotation(s1NameCamel)) return this;
        } else if (window.console) window.console.error("[" + this.functionName() + "] does not have a isTypeHungarianNotation() capability");
      }
    }, undefined, s1NameCamel);

    if ((fType === undefined)) {
      if (window.console) {
        window.console.error("type not registered for [" + s1NameCamel + "]");
        window.console.log(Function.types());
        debugger;
      }
    }

    //window.UnspecifiedTypeOK indicates that there is NO type specified and that is ok
    //undefined indicates not ok! illegal unspecified notation = window.BadType
    return fType;
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="Function" name="lengthRequiredHungarian" parameter-checks="off" parameters="s1Name"><![CDATA[
    return (s1Name.length > 1 && s1Name[0] == "1");
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="Function" name="typeNatural" parameter-checks="off" parameters="s1NameDash"><![CDATA[
    //Array, String, Boolean, Number, Function
    //XPathString, JOO, ClassFunction
    var fType, bFrameworkType = false;
    var s1NameCamel = s1NameDash.dashToCamel();

    fType = Function.types().untilEx(function(s1NameCamel){
      if (!this.notDefinedClass) { //in case the type is not fully defined yet
        if (this.isTypeNaturalNotation instanceof Function) {
          if (this.isTypeNaturalNotation(s1NameCamel)) return this;
        } else if (window.console) window.console.error("[" + this.functionName() + "] does not have a isTypeNaturalNotation() capability");
      }
    }, undefined, s1NameCamel);

    //everything ok: type unspecified: no conversion, leave as string
    if ((fType === undefined)) fType = window.UnspecifiedTypeOK;

    return fType;
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="Function" name="checkType" parameter-checks="off" parameters="s1ContextName, uValue, fType, [bLengthRequired = false, bOptional = false]"><![CDATA[
    var bCorrectType = true, sReason;

    //----------------------------------------------------- undefined fType
    //note that AnyVariableType != undefined. AnyVariableType is the valid u* type which can hold any type
    if ((fType === undefined) || !Function.istype(fType)) {
      bCorrectType = false; //unregistered type spec
      sReason = "failure to identify type required";
    }

    if ((uValue === undefined) && bOptional) {
      //no value, but it is optional so skip type and length check
    } else {
      //----------------------------------------------------- type
      //instanceof and istype
      //"test" !instanceof String BUT String.typeof("test") === true:
      //therefore primitives will NOT be converted to objects
      //however, Objects will NOT be converted to primitives
      if (bCorrectType) {
        if (uValue instanceof fType) {
          bCorrectType = true;
        } else if (fType.istype instanceof Function) {
          bCorrectType = fType.istype(uValue);
          if (!bCorrectType) 
            sReason = "incorrect type";
        } else {
          bCorrectType = false;
          sReason = "cannot verify type [" + fType.functionName() + "] of [" + uValue + "] because no istype() Function";
        }
      }

      //----------------------------------------------------- length / content
      //hasLength
      if (bCorrectType && bLengthRequired) {
        if (fType.hasLength instanceof Function) {
          bCorrectType = fType.hasLength(uValue);
          if (!bCorrectType) sReason = "incorrect length";
        } else {
          bCorrectType = false;
          sReason = "cannot verify type length [" + fType.functionName() + "] of [" + uValue + "] because no hasLength Function";
        }
      }
    }

    //----------------------------------------------------- reporting
    if (!bCorrectType) {
      if (window.console) window.console.error("[" + s1ContextName + "] type wrong (" + typeof uValue + ") " + (sReason ? sReason : ""));
      debugger;
    }

    return bCorrectType;
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="Function" name="optionalDefaultVariable" parameter-checks="off" parameters="s1ContextName, uVariable, [bOptional = false, uDefault]"><![CDATA[
    var oNewValue;

    if ((uVariable !== undefined)) {
      oNewValue = uVariable;
    } else {
      //no argument to match the parameter spec
      //optional or not, use a default value
      if ((uDefault !== undefined)) {
        oNewValue = uDefault;
      } else {
        if (bOptional !== true) {
          //reporting
          if (window.console) window.console.error("[" + s1ContextName + "] required");
          debugger;
        }
      }
    }

    return oNewValue;
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="Function" name="convertVariable" parameter-checks="off" parameters="s1ContextName, fConversion, uVariable, [fSubConversion, oContextObject, ...]"><![CDATA[
    //we have an argument for the parameter
    //conversions e.g. (JOO) jThing
    //the variable name MUST already have the destination type notation
    //String.toArray(s1ContextName, fSubConversion) uses the fSubConversion to return the parts
    var aArguments, sTypeConversionFunctionName;
    var oNewValue;

    if ((uVariable !== undefined)) {
      if ((fConversion !== undefined)) {
        if (fConversion instanceof Function) {
          if (uVariable instanceof fConversion) {
            //variable is already correct type
            oNewValue = uVariable;
          } else if (fConversion == window.UnspecifiedTypeOK || fConversion == window.AnyVariableType) {
            //no conversion necessary
            //acceptable UnspecifiedTypeOK or can be AnyVariableType, e.g. @elements, uVar
            oNewValue = uVariable;
          } else {
            sTypeConversionFunctionName = "to" + fConversion.functionName().capitalise();
            if (uVariable[sTypeConversionFunctionName] instanceof Function) {
              aArguments = [s1ContextName, fSubConversion];
              aArguments = aArguments.concat(Array.prototype.slice.call(arguments, 4));
              //e.g. "parent".toJQuery("Options.set", JOO, jFrom)
              //where oContextObject = jFrom
              oNewValue = uVariable[sTypeConversionFunctionName].apply(uVariable, aArguments);
            } else if (window.console) 
              window.console.error("argument for [" + s1ContextName + "] has no type conversion [" + sTypeConversionFunctionName + "()]");
          }
        } else if (window.console) window.console.error("non-Function Object type conversion for [" + s1ContextName + "] [" + fConversion + "]")
      } else {
        //no conversion requested (@no-parameter-checks). maybe Array of AnyVariableType or UnspecifiedTypeOK
        oNewValue = uVariable;
      }
    }

    return oNewValue;
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="Function" name="convertClassAttributeValueNatural" parameter-checks="off" parameters="s1ClassName, s1AttributeName, sAttributeValue, [oContextObject, ...]"><![CDATA[
    //value input is always the string value of an attribute
    //conversion to correct type is based on the name
    //e.g. @is-chain-event => (boolean) isChainEvent
    //".*s" names are Arrays. Some types inherit from Array also
    var fType, fSubType, s1ContextName;
    var aArguments;
    
    s1ContextName = s1ClassName + "/@" + s1AttributeName;
    fType         = Function.typeNatural(s1AttributeName); //maybe Array
    if (s1AttributeName.isPlural()) fSubType = Function.typeNatural(s1AttributeName.singular());
    
    aArguments = [s1ContextName, fType, sAttributeValue, fSubType];
    aArguments = aArguments.concat(Array.prototype.slice.call(arguments, 3)); //can include oContextObject
    return Function.convertVariable.apply(Function, aArguments); //optional
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="Function" name="cfah" parameter-checks="off" parameters="s1FunctionName, s1ArgumentName, uArgument, [bOptional, uDefault, fConversion]"><![CDATA[
    return this.convertFunctionArgumentHungarian.apply(this, arguments);
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="Function" name="convertFunctionArgumentHungarian" parameter-checks="off" parameters="s1FunctionName, s1ArgumentName, uArgument, [bOptional, uDefault, fConversion]"><![CDATA[
    var fType, bLengthRequired;
    var oNewValue        = uArgument;
    var s1ContextNameExt = s1FunctionName + "(" + s1ArgumentName + ")";               //login(bAdmin)

    //------------------------------------------------ default and optional
    oNewValue = Function.optionalDefaultVariable(s1ContextNameExt, oNewValue, bOptional, uDefault);

    //------------------------------------------------ conversion
    if (arguments.length > 5 && (fConversion === undefined)) Debug.error(this, s1ContextNameExt + ": conversion class not found");
    if ((oNewValue !== undefined) && (fConversion !== undefined)) oNewValue = Function.convertVariable(s1ContextNameExt, fConversion, oNewValue);

    //------------------------------------------------ check
    if ((oNewValue !== undefined)) {
      fType            = Function.typeHungarian(s1ArgumentName);           //sName = String
      bLengthRequired  = Function.lengthRequiredHungarian(s1ArgumentName); //s1Name = needs length
      Function.checkType(s1ContextNameExt, oNewValue, fType, bLengthRequired, bOptional);
    }

    return oNewValue;
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="Function" name="cp" parameter-checks="off" parameters="s1ContentName, oArguments, aParameters, bFlexibleArgs"><![CDATA[
    return this.checkParameters.apply(this, arguments);
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="Function" name="checkParameters" parameter-checks="off" parameters="s1ContentName, oArguments, aParameters, bFlexibleArgs"><![CDATA[
    var aArguments, iArguments = oArguments.length;
    if (!bFlexibleArgs && iArguments > aParameters.length) {
      aArguments = Array.prototype.slice.call(oArguments);
      Debug.log(this, aArguments[iArguments-1]);
      Debug.error(this, "[" + s1ContentName + "] spurious extra argument after stated parameters");
    }
  ]]></javascript:javascript-extension>

  <!-- ############################################# Array (Object) ############################################# -->
  <javascript:javascript-extension object-name="Array" name="toCSSPathString" parameters="[s1ContextName, fSubConversion, oContextObject, bClasses = true, bChildren = true, bDirectChildren = true, bPaths = false]"><![CDATA[
    //default:          > .example > .another > .end
    //bChildren(false): .example.another.end
    var sCSSPath = "";
    for (var i = 0; i < this.length; i++) {
      if (bPaths && i)     sCSSPath += ", ";
      if (bChildren && bDirectChildren) sCSSPath += " > ";
      if (bChildren)       sCSSPath += " ";
      if (bClasses)        sCSSPath += ".";
      sCSSPath += this[i];
    }
    return new CSSPathString(sCSSPath);
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="Array" name="toURLEncoded" parameters="[s1ContextName, fSubConversion, oContextObject]"><![CDATA[
    var aConvertedValue = this.eachResults(function() {
      return (this.toURLEncoded instanceof Function ? this.toURLEncoded() : this.toString());
    });
    return aConvertedValue.toString();
  ]]></javascript:javascript-extension>

  <javascript:javascript-static-extension object-name="Array" name="isTypeHungarianNotation" parameters="s1Name" parameter-checks="off"><![CDATA[
    return (s1Name[0] == "a");
  ]]></javascript:javascript-static-extension>

  <javascript:javascript-static-extension object-name="Array" name="isTypeNaturalNotation" parameters="s1NameCamel" parameter-checks="off"><![CDATA[
    return s1NameCamel.isPlural();
  ]]></javascript:javascript-static-extension>

  <javascript:javascript-extension object-name="Array" name="pushUniqueDefined" parameters="uValue" parameter-checks="off"><![CDATA[
    if ((uValue !== undefined) && !this.contains(uValue)) this.push(uValue);
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="Array" name="concatSelf" parameters="aArray" parameter-checks="off"><![CDATA[
    for (var i = 0; i < aArray.length; i++) this.push(aArray[i]);
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="Array" name="eq" parameters="aArray" parameter-checks="off"><![CDATA[
    if (aArray === undefined || aArray === null || !(aArray instanceof Array)) return false;
    if (aArray.length != this.length) return false;

    for (var i = 0; i < this.length; i++) {
      if (!this[i].eq(aArray[i])) return false;
    }
    return true;
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="Array" name="copy"><![CDATA[
    return this.slice();
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="Array" name="add" parameters="aMoreArray" parameter-checks="off"><![CDATA[
    //Array.add(an Array) => concat
    //do not alter the existing Array
    var aNewArray = this.copy();
    aNewArray.concat(aMoreArray);
    return aNewArray;
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="Array" name="indexOf" parameters="uObject"><![CDATA[
    //this is a built in function so will not be included
    for (var i = 0; i < this.length; i++) if (this[i] === uObject) return i;
    return -1;
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="Array" name="last"><![CDATA[
    return (this.length ? this[this.length-1] : undefined);
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="Array" name="first"><![CDATA[
    return (this.length ? this[0] : undefined);
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="Array" name="contains" parameter-checks="off" parameters="uObject"><![CDATA[
    return (this.indexOf(uObject) !== -1);
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="Array" name="remove" parameters="uObject, [i]" parameter-checks="off"><![CDATA[
    //note that jQuery also supports merge and unique
    var bFound = false;
    if (i === undefined) {
      //----------------------------- remove every instance of uObject
      while ((i = this.indexOf(uObject)) != -1) {
        this.splice(i,1);
        bFound = true;
      }
    } else {
      //----------------------------- i entry only, if == uObject
      if (uObject === this[i]) {
        this.splice(i,1);
        bFound = true;
      } else if (window.console) window.console.error("array index remove item did not match");
    }
    return bFound;
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="Array" name="match" parameters="rxMatch, [iMatch = 0]" parameter-checks="off"><![CDATA[
    //dont add blank results
    return this.eachEx(function(rxMatch, iMatchDefined){
      var aMatches, sMatch;
      if (aMatches = rxMatch.exec(this)) {
        if (aMatches.length > iMatchDefined) sMatch = aMatches[iMatchDefined];
      }
      return sMatch;
    }, DEFAULT, rxMatch, (iMatch || 0));
  ]]></javascript:javascript-extension>

  <!-- ############################################# loop operations ############################################# -->
  <javascript:javascript-extension object-name="Array" name="eachResults" parameters="..." parameter-checks="off"><![CDATA[
    //alias for eachEx
    return Array.prototype.eachEx.apply(this, arguments);
  ]]></javascript:javascript-extension>
  
  <javascript:javascript-extension object-name="Array" name="eachEx" parameters="fFunc, [oThis, ...]" parameter-checks="off"><![CDATA[
    //like jQuery each but accepts this and arguments
    //like each stops if false is returned from fFunc 
    //BUT returns a new Array of the defined results
    //aArray.eachEx(fFunc(p1, p2, oObjectInArray, i, the-array) {
    //  ...
    //}, DEFAULT, p1, p2)
    //include NULLs, exclude undefined from results to allow cleansing
    //
    //jQuery each accepts an [args] Array INTERNALLY but not oThis or multiple flexible arguments
    var oObjectInArray, oNewItem, aNewArray = new Array();
    var aPreArguments = Array.prototype.slice.call(arguments, 2);
    var iPreArguments = aPreArguments.length;
    var oThisInCall   = oThis;
    var i;

    for (i = 0; i < this.length; i++) {
      oObjectInArray = this[i];
      
      //extended operation
      //note: jQuery.fn.each uses this Array.each so it needs exact replica
      if (iPreArguments || oThis !== undefined) {
        aPreArguments[iPreArguments]   = oObjectInArray; //place this on as the last argument [oP1, oP2,] oValue
        aPreArguments[iPreArguments+1] = i;              //current location in array
        aPreArguments[iPreArguments+2] = this;           //this array itself
      }
      
      if (oThis === undefined) oThisInCall = oObjectInArray;
      
      oNewItem = fFunc.apply(oThisInCall, aPreArguments);
      if (oNewItem === false) break;
      if (oNewItem !== undefined && oNewItem !== null) aNewArray = aNewArray.concat(oNewItem);
    }

    return aNewArray;
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="Array" name="eachBackwards" parameters="fFunc, [oThis, ...]" parameter-checks="off"><![CDATA[
    //go backwards in case the item is removed
    //include NULLs, exclude undefined from results to allow cleansing
    //oObjectInArray.fFunc(..., oObjectInArray, i, the-array)
    //exit loop on false
    var oObjectInArray, oNewItem, aNewArray = new Array();
    var aPreArguments = Array.prototype.slice.call(arguments, 2);
    var iPreArguments = aPreArguments.length;
    var oThisInCall   = oThis;

    var i = this.length;
    while (i) {
      oObjectInArray = this[--i];
      
      //extended operation
      //note: jQuery.fn.each uses this Array.each so it needs exact replica
      if (iPreArguments || oThis !== undefined) {
        aPreArguments[iPreArguments]   = oObjectInArray; //place this on as the last argument [oP1, oP2,] oValue
        aPreArguments[iPreArguments+1] = i;              //current location in array
        aPreArguments[iPreArguments+2] = this;           //this array itself
      }
      
      if (oThis === undefined) oThisInCall = oObjectInArray;
      
      oNewItem = fFunc.apply(oThisInCall, aPreArguments);
      if (oNewItem === false) break;
      if (oNewItem !== undefined && oNewItem !== null) aNewArray = aNewArray.concat(oNewItem);
    }

    return aNewArray;
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="Array" name="execute" parameters="[oSentThis, aArguments]" parameter-checks="off"><![CDATA[
    //an Array is pushed in order to avoid the inefficiency of multiple execution contexts
    //[fFunc, aArguments, oThis]
    var aResults;
    
    if ((oSentThis === undefined)) oSentThis = window;
                                 
    aResults = this.eachEx(function(oSentThis, aArguments){
      var fFunc, oThis, uRet;
      
      if (this instanceof Function) {
        //-------------------------------- function(){}
        fFunc = this;
      } else if (this instanceof Array) {
        //-------------------------------- [func, [args], oThis]
        switch (this.length) {
          case 3: oThis      = this[2];
          case 2: aArguments = this[1];
          case 1: fFunc      = this[0];
        }
      } else if (this instanceof Object) {
        //-------------------------------- {func:fFunc, args:[], obj:oThis }
        oThis      = this.obj;
        aArguments = this.args;
        fFunc      = this.func;
      }

      if (fFunc instanceof Function) uRet = fFunc.apply(oThis || oSentThis, aArguments);
      else if (window.console) window.console.error("Array.execute function call item not understood [" + this + "]");
      
      return uRet;
    }, DEFAULT, oSentThis, aArguments);
    
    return aResults;
  ]]></javascript:javascript-extension>
  
  <javascript:javascript-extension object-name="Array" name="untilEx" parameters="fFunc, [oThis, ...]" parameter-checks="off"><![CDATA[
    //until stops when a value is returned including true
    //and returns THAT value, or undefined if none returned
    //WHEREAS, each stops if false is returned but returns this
    var fCondition = function(oNewItem, i){
      return (oNewItem !== undefined && oNewItem !== null);
    };
    var aArguments = new Array(fCondition).concat(Array.prototype.slice.apply(arguments));
    return this.untilCondition.apply(this, aArguments);
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="Array" name="untilCondition" parameters="fCondition, fFunc, [oThis, ...]" parameter-checks="off"><![CDATA[
    //forward moving: not used for removal
    //include NULLs, exclude undefined from results to allow cleansing
    //oObjectInArray.fFunc(..., oObjectInArray, i, the-array)
    var oObjectInArray, oNewItem;
    var aPreArguments = Array.prototype.slice.call(arguments, 3);
    var iPreArguments = aPreArguments.length;
    var oThisInCall   = oThis;
    var i = 0;

    if (this.length) {
      do {
        oObjectInArray = this[i];

        //extended operation
        //note: jQuery.fn.each uses this Array.each so it needs exact replica
        if (iPreArguments || oThis !== undefined) {
          aPreArguments[iPreArguments]   = oObjectInArray; //place this on as the last argument [oP1, oP2,] oValue
          aPreArguments[iPreArguments+1] = i;              //current location in array
          aPreArguments[iPreArguments+2] = this;           //this array itself
        }
        
        if (oThis === undefined) oThisInCall = oObjectInArray;

        oNewItem = fFunc.apply(oThisInCall, aPreArguments);
        i++;
      } while (fCondition(oNewItem, i, this) !== true && i < this.length);
    }

    return oNewItem;
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="Array" name="isDefined"><![CDATA[
    var aNewArray = new Array();
    for (var i = 0; i < this.length; i++) if ((this[i] !== undefined)) aNewArray.push(this[i]);
    return aNewArray;
  ]]></javascript:javascript-extension>

  <!-- ############################################# Date ############################################# -->
  <javascript:javascript-static-extension object-name="Date" name="isTypeHungarianNotation" parameters="s1Name" parameter-checks="off"><![CDATA[
    return (s1Name[0] == "d");
  ]]></javascript:javascript-static-extension>

  <javascript:javascript-static-extension object-name="Date" name="isTypeNaturalNotation" parameters="s1NameCamel" parameter-checks="off"><![CDATA[
    return s1NameCamel.isSingular() && s1NameCamel.startsWith("date");
  ]]></javascript:javascript-static-extension>

  <!-- ############################################# RegExp ############################################# -->
  <javascript:javascript-static-extension object-name="RegExp" name="isTypeHungarianNotation" parameters="s1Name" parameter-checks="off"><![CDATA[
    return (s1Name[0] == "r");
  ]]></javascript:javascript-static-extension>

  <javascript:javascript-static-extension object-name="RegExp" name="isTypeNaturalNotation" parameters="s1NameCamel" parameter-checks="off"><![CDATA[
    return s1NameCamel.isSingular() && s1NameCamel.startsWith("regex");
  ]]></javascript:javascript-static-extension>

  <javascript:javascript-extension object-name="RegExp" name="toCSSPathString" parameters="s1ContextName, fSubConversion, sAttributeName]" parameter-checks="off"><![CDATA[
    //take advantage of the jQuery extension 
    //e.g. ":regex(class,f_.*)" searches the @class attribute for f_.*
    return ":regex(" + (sAttributeName ? sAttributeName : "class") + "," + this.source + ")";
  ]]></javascript:javascript-extension>
  
  <!-- ############################################# Node and Document (Object) ############################################# -->
  <javascript:javascript-extension object-name="Node" name="toJOO" parameters="[s1ContextName, fSubConversion, oContextObject]"><![CDATA[
    return new JOO(this);
  ]]></javascript:javascript-extension>

  <javascript:javascript-static-extension object-name="Node" name="isTypeHungarianNotation" parameters="s1Name" parameter-checks="off"><![CDATA[
    return (s1Name[0] == "h");
  ]]></javascript:javascript-static-extension>

  <javascript:javascript-static-extension object-name="Node" name="isTypeNaturalNotation" parameters="s1NameCamel" parameter-checks="off"><![CDATA[
    return false;
  ]]></javascript:javascript-static-extension>

  <javascript:javascript-static-extension object-name="Node" name="istype" parameters="uValue"><![CDATA[
    return (uValue instanceof window.Node || uValue instanceof window.Document);
  ]]></javascript:javascript-static-extension>

  <javascript:javascript-static-extension object-name="Node" name="hasLength"><![CDATA[
    return (uValue.firstChild !== null);
  ]]></javascript:javascript-static-extension>

  <javascript:javascript-extension object-name="Document" name="toJOO" parameters="[s1ContextName, fSubConversion, oContextObject]"><![CDATA[
    return new JOO(this);
  ]]></javascript:javascript-extension>

  <javascript:javascript-static-extension object-name="Document" name="isTypeHungarianNotation" parameters="s1Name" parameter-checks="off"><![CDATA[
    return false;
  ]]></javascript:javascript-static-extension>

  <javascript:javascript-static-extension object-name="Document" name="isTypeNaturalNotation" parameters="s1NameCamel" parameter-checks="off"><![CDATA[
    return false;
  ]]></javascript:javascript-static-extension>

  <javascript:javascript-static-extension object-name="Document" name="istype" parameters="uValue"><![CDATA[
    return (uValue instanceof window.Document);
  ]]></javascript:javascript-static-extension>

  <javascript:javascript-static-extension object-name="Document" name="hasLength"><![CDATA[
    return (uValue.firstChild !== null);
  ]]></javascript:javascript-static-extension>
</javascript:code>
