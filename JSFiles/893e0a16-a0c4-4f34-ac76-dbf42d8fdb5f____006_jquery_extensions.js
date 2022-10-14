<javascript:code xmlns:repository="http://general_server.org/xmlnamespaces/repository/2006" name="jquery-extensions">
  <!-- ############################## properties ############################## -->
  <javascript:jquery-static-extension name="isTypeHungarianNotation" parameters="s1Name" parameter-checks="off"><![CDATA[
    //jqName = native jQuery library type, used in library extensions
    //jName  = JOO
    return (s1Name.length > 1 && s1Name[0] == "j" && s1Name[1] == "q");
  ]]></javascript:jquery-static-extension>

  <javascript:jquery-static-extension name="isTypeNaturalNotation" parameters="s1NameCamel" parameter-checks="off"><![CDATA[
    return false;
  ]]></javascript:jquery-static-extension>

  <javascript:jquery-extension name="objectXmlIDs"><![CDATA[
    //returns an array
    return this.eachResults(function(){
      var oOwner = this.object();
      return (oOwner ? oOwner.xmlID : undefined);
    });
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="objectNames"><![CDATA[
    //returns an array
    return this.eachResults(function(){
      var oOwner = this.object();
      return (oOwner ? oOwner.name : undefined);
    });
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="singleton"><![CDATA[
    var oOwner = this.first().object();
    return (oOwner ? oOwner.singleton : undefined);
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="isAncestorOf" parameters="jqDescendant"><![CDATA[
    return (jqDescendant.closest(this).length > 0);
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="isDescendantOf" parameters="jqAncestor"><![CDATA[
    return jqAncestor.isAncestorOf(this);
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="isSingular"><![CDATA[
    return (this.length == 1);
  ]]></javascript:jquery-extension>

  <javascript:jquery-static-extension name="hasLength"><![CDATA[
    return (this.length > 0);
  ]]></javascript:jquery-static-extension>

  <javascript:jquery-extension name="insideHead"><![CDATA[
    //does not return document.head elements
    //in means inside of, not including
    var aNew = new Array();
    this.each(function(){
      if (jQuery(this).parent().closest("head").length) aNew.push(this);
    });
    //jQuery add() carries out sorting in to document order (slow)
    //jQuery(array) ignores the sorting
    return jQuery(aNew);
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="insideBody"><![CDATA[
    //does not return document.body elements
    //in means inside of, not including
    var aNew = new Array();
    this.each(function(){
      if (jQuery(this).parent().closest("body").length) aNew.push(this);
    });
    //jQuery add() carries out sorting in to document order (slow)
    //jQuery(array) ignores the sorting
    return jQuery(aNew);
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="effectiveVal" parameters="[(String) sNewValue]"><![CDATA[
    //form input type independent value calcs
    //useful for required validation
    var sName, sValue;

    if (sNewValue !== undefined) {
      //set the value
      switch (this.inputType()) {
        case "radio": {
          NOT_COMPLETE("");
          break;
        }
        case "textarea": {
          this.html(sNewValue);
          break;
        }
        default: {
          this.val(sNewValue);
        }
      }
    }

    //get the value
    switch (this.inputType()) {
      case "radio": {
        sName  = this.attr("name");
        sValue = jQuery("input:radio[name=" + sName + "]:checked").val();
        break;
      }
      case "textarea": {
        sValue = this.html();
        break;
      }
      default: {
        sValue = this.val();
      }
    }

    return sValue;
  ]]></javascript:jquery-extension>

  <javascript:javascript-static-extension object-name="jQuery" name="functionName" override="yes"><![CDATA[
    //minimised jQuery has no function name
    //jQuery.functionName()
    return "jQuery";
  ]]></javascript:javascript-static-extension>

  <javascript:jquery-extension name="object" parameters="[oSetObject]"><![CDATA[
    var oObject, oData;
    
    if (this.length  > 1) {
      if (window.console) console.warn("object() has more than 1 element");
      if (window.console) console.log(this);
    } else if (this.length === 0) {
      if (window.console) console.warn("object() has 0 elements");
      if (window.console) console.log(this);
    } else {
      //will be blank for attribute nodes
      if (oData = this.data()) {
        if ((oSetObject !== undefined)) oData.Object = oSetObject;
        oObject = oData.Object;
      }
    }
    
    //returns THIS when not setting
    //returns the OBJECT when requesting
    return ((oSetObject !== undefined) ? this : oObject);
  ]]></javascript:jquery-extension>
  
  <javascript:jquery-extension name="objects"><![CDATA[
    var oObject, aObjects = new Array();

    this.each(function(){
      if (oObject = new jQuery(this).object()) aObjects.pushUniqueDefined(oObject);
    });

    return aObjects;
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="objectClasses"><![CDATA[
    var oObject, aClasses = new Array();

    this.each(function(){
      if (oObject = new jQuery(this).object()) aClasses.pushUniqueDefined(oObject.classDerivedConstructor);
    });

    return aClasses;
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="hasObjects" parameters="[s1FuncName]"><![CDATA[
    var oObject, bFound = false;
    this.each(function(){
      if (oObject = new jQuery(this).object()) {
        if ((s1FuncName === undefined) || oObject[s1FuncName] instanceof Function) bFound = true;
      }
      return !bFound;
    });

    return bFound;
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="firstClassGroup1" parameters="rxMatch"><![CDATA[
    return this.firstClass(rxMatch, 1);
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="firstClass" parameters="[rxMatch, iMatch]"><![CDATA[
    var aClasses = this.classes(rxMatch, iMatch);
    return (aClasses.length ? aClasses[0] : undefined);
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="second"><![CDATA[
    return this.eq(1);
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="third"><![CDATA[
    return this.eq(2);
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="id" parameters="[sValue]"><![CDATA[
    if ((sValue !== undefined)) this.attr("id", sValue);
    return this.attr("id");
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="cssClassName"><![CDATA[
    //with dash complex display modes there can be more than 1
    //gs-interface-mode-list gs-interface-mode-list-partial
    //we want the first one only
    var sClassName;

    if (this.isNonXHTMLNamespace()) {
      //isNonXHTMLNamespace() will have no @class, but might have a @interface-mode attribute
      //not necessarily there but would cause a property conflict if it was ;)
      sClassName = this.attr("class");
      if (!sClassName) sClassName = ""; //would be undefined if attribute is missing
    } else {
      //normal @html:class based xml:id
      sClassName = this.firstClassGroup1(/^Class__([^ "]+)/g);
      if (!sClassName) {
        if (window.console) console.warn("no .Class__* found on request object");
        if (window.console) console.log(this);
      }
    }

    return sClassName;
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="cssInterfaceMode"><![CDATA[
    //with dash complex display modes there can be more than 1
    //gs-interface-mode-list gs-interface-mode-list-partial
    //we want the first one only
    var sInterfaceMode;

    if (this.isNonXHTMLNamespace()) {
      //isNonXHTMLNamespace() will have no @class, but might have a @interface-mode attribute
      //not necessarily there but would cause a property conflict if it was ;)
      sInterfaceMode = this.attr("interface-mode");
      if (!sInterfaceMode) sInterfaceMode = ""; //would be undefined if attribute is missing
    } else {
      //normal @html:class based xml:id
      sInterfaceMode = this.firstClassGroup1(/^gs-interface-mode-([^ "]+)/g);
      if (!sInterfaceMode) {
        if (window.console) console.warn("no .gs-interface-mode-* found on request object");
        if (window.console) console.log(this);
      }
    }

    return sInterfaceMode;
  ]]></javascript:jquery-extension>
  
  <javascript:jquery-extension name="classes" parameters="[rxMatch, iMatch = 0]"><![CDATA[
    var aClasses = new Array();

    this.each(function(){
      var sClasses, aThisClasses;
      if (sClasses = new jQuery(this).attr("class")) {
        aThisClasses = sClasses.trim().split(/\s+/g);
        if ((rxMatch !== undefined)) aThisClasses = aThisClasses.match(rxMatch, iMatch);
        aClasses     = aClasses.concat(aThisClasses);
      }
    });

    return aClasses;
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="outerHTML"><![CDATA[
    //using native jQuery.clone()
    //clone will crash if run on the document
    var sHTML = "";
    this.each(function(){
      //http://www.w3schools.com/jsref/prop_node_nodetype.asp
      //window.document.DOCUMENT_NODE
      if (this.nodeType === 9) {
        if (window.console) console.error("should not calculate outerHTML of whole document");
      } else {
        sHTML += new jQuery("<div/>").append(new jQuery(this).clone()).html();
      }
    });
    return sHTML;
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="position" parameters="[oPositionObject]"><![CDATA[
    //can set as well as return
    //this is to normalise the function with offest(oPositionObject)
    //adding checks here to prevent confusion
    if (oPositionObject !== undefined) {
      if (window.console) {
        if      (!this.insideBody().length) console.warn("element is not in the document body");
        else if (this.someHidden())         console.warn("element not visible for offset calcs");
      }
      this.css(oPositionObject);
    }
    return jQuery.prototype.position.fOriginal.apply(this, arguments);
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="offset" parameters="[oPositionObject]"><![CDATA[
    //adding checks here to prevent confusion
    if (oPositionObject !== undefined) {
      if (window.console) {
        if      (!this.insideBody().length) console.warn("element is not in the document body");
        else if (this.someHidden())         console.warn("element not visible for offset calcs");
      }
    }
    //calling jQuery.offset() with one undefined argument will cause it to set, not retreieve
    return jQuery.prototype.offset.fOriginal.apply(this, arguments);
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="isExpanded"><![CDATA[
    //if anything is hidden then run the show()
    //NOTE: isCollapsed != (!isExpanded)
    //there are other states: partially expanded == some hidden, some visible
    return this.add(this.children()).allVisible();
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="isCollapsed"><![CDATA[
    //if anything is shown then run the hide()
    //NOTE: isCollapsed != (!isExpanded)
    //there are other states: partially expanded == some hidden, some visible
    return this.add(this.children()).allHidden();
  ]]></javascript:jquery-extension>
  
  <javascript:jquery-extension name="isSingularAbstractElement"><![CDATA[
    //singleton direct child of the html:head
    // <head>
    //   <script class="Class__Server ...">...</script>
    //   <style  class="Class__Database ...">...</style>
    // </head>
    //e.g. Server, Database
    //these objects have no display in the BODY
    //sometimes ELEMENTs appear under the <script>s, e.g. AJAXHTMLLoader
    //these are considered normal elements
    return this.isSingular() && this.insideHead().length;
  ]]></javascript:jquery-extension>

  <!-- ############################## container operations ############################## -->
  <javascript:jquery-extension name="untilEx" parameters="..." parameter-checks="off"><![CDATA[
    //like each but returns the first defined fFunc response
    return Array.prototype.untilEx.apply(this, arguments);
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="untilCondition" parameters="..." parameter-checks="off"><![CDATA[
    //like each but returns the first defined fFunc response
    return Array.prototype.untilCondition.apply(this, arguments);
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="eachResults" parameters="fFunc, [oThis, ...]"><![CDATA[
    //returns an array of the results from each fFunc
    //Array.prototype.eachEx does this anyway
    return Array.prototype.eachEx.apply(this, arguments);
  ]]></javascript:jquery-extension>
  
  <javascript:jquery-extension name="eachEx" parameters="fFunc, [oThis, ...]"><![CDATA[
    //Array.prototype.eachEx returns a new RESULTS Array, not the original Array
    //like each but accepts this and arguments
    //like each stops if false is returned from fFunc 
    //BUT returns this always
    //jQuery each accepts an [args] Array INTERNALLY but not oThis or multiple flexible arguments
    Array.prototype.eachEx.apply(this, arguments);
    return this;
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="reverse"><![CDATA[
    //in-place reverse!
    //e.g. jDIVs.reverse().each(...) will reverse jDIVs
    Array.prototype.reverse.apply(this, arguments); //in-place
    return this;
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="eachBackwards" parameters="fFunc, [oThis, ...]"><![CDATA[
    //Array.prototype.eachBackwards returns a new RESULTS Array, not the this Array
    //like eachEx but backwards
    //not a permanent reverse
    //like each stops if false is returned from fFunc 
    //BUT returns this always
    Array.prototype.eachBackwards.apply(this, arguments);
    return this;
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="eachEq" parameters="fFunc, [oThis, ...]"><![CDATA[
    //like each but accepts this and arguments
    //like each stops if false is returned from fFunc 
    //BUT: this will default to a jQuery single element
    //returns this always
    //jQuery each accepts an [args] Array INTERNALLY but not oThis or multiple flexible arguments
    //aArray.eachEx(fFunc(p1, p2, oObjectInArray, i, the-array) {
    //  ...
    //}, DEFAULT, p1, p2)
    //include NULLs, exclude undefined from results to allow cleansing
    var oObjectInArray, oNewItem, aNewArray = new Array();
    var aPreArguments = Array.prototype.slice.call(arguments, 2);
    var iPreArguments = aPreArguments.length;
    var oThisInCall   = oThis;
    var i;

    for (i = 0; i < this.length; i++) {
      oObjectInArray                 = this.eq(i); //return a JQueryClass
      if ((oThis === undefined)) oThisInCall = oObjectInArray;
      aPreArguments[iPreArguments]   = oObjectInArray; //place this on as the last argument [oP1, oP2,] oValue
      aPreArguments[iPreArguments+1] = i;              //current location in array
      aPreArguments[iPreArguments+2] = this;           //this array itself
      oNewItem                       = fFunc.apply(oThisInCall, aPreArguments);
      if (oNewItem === false) break;
      if (oNewItem !== undefined && oNewItem !== null) aNewArray = aNewArray.concat(oNewItem);
    }

    return this;
  ]]></javascript:jquery-extension>

  <!-- ############################## extended properties ############################## -->
  <javascript:jquery-extension name="cssXmlID" parameters="[sNewXmlID]"><![CDATA[
    //returns undefined if not found
    //handles also the <interface:dynamic ... @xml:id=... /> in the HTML etc. situations
    //XHTML always has a @class attribute which contains the @xml:id
    var sXmlID, sExistingXmlIDClass;
    if (this.isNonXHTMLNamespace()) {
      if (sNewXmlID !== undefined) this.xmlXmlID(sNewXmlID);
      sXmlID = this.xmlXmlID(); //returns undefined if not found
    } else {
      if (sNewXmlID !== undefined) {
        sExistingXmlIDClass = this.firstClassGroup1(JQueryClass.rxXmlID);
        this.removeClass(sExistingXmlIDClass);
        this.addClass("gs-xml-id-" + sNewXmlID);
      }
      sXmlID = this.firstClassGroup1(JQueryClass.rxXmlID);
    }
    return sXmlID;
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="cssXPathToNode" parameters="[sNewXPathToNode]"><![CDATA[
    //returns undefined if not found
    //handles also the <interface:dynamic ... @xml:id=... /> in the HTML etc. situations
    //XHTML always has a @class attribute which contains the @xml:id
    //direct > children because maybe this doesn!t have one and we don't want to inherit the child object's XPTN
    var sXPathToNode, jXPathToNode;
    
    if (this.isNonXHTMLNamespace()) {
      if (sNewXPathToNode !== undefined) this.xmlXPathToNode(sNewXPathToNode);
      sXPathToNode = this.xmlXPathToNode(); //returns undefined if not found
    } else {
      jXPathToNode = this.find(JQueryClass.cXPathToNodePath);
      if (sNewXPathToNode !== undefined) jXPathToNode.text(sNewXPathToNode);
      sXPathToNode = jXPathToNode.text();
    }
    return sXPathToNode;
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="firstIndexOfByXPathToNodeClass" parameters="jq1Needle"><![CDATA[
    var jq1Existing;
    var sXPathToNode, sFilter, sTagName, aClasses, aSearchClasses;
    var aIgnoreClasses = ["expanded", "collapsed", "selected"];
    
    if (sXPathToNode = jq1Needle.cssXPathToNode()) {
      jq1Existing = this.filter(function(i, oElement){
        var sHayStackEntry = jQuery(oElement).find(JQueryClass.cXPathToNodePath).text();
        //if (window.console) console.info('looking for [' + sXPathToNode + '] in [' + sHayStackEntry + ']')
        return (sHayStackEntry == sXPathToNode);
      });
    } else {
      //needle does not have a @meta:xpath-to-node
      //for example: <div class="details">
      //TODO: what if the meta-data has changed?
      sTagName       = jq1Needle.tagName();
      aClasses       = jq1Needle.classes();
      sFilter        = sTagName;
      //sanitise class list
      aSearchClasses = new Array();
      aClasses.eachEx(function(){
        if (!aIgnoreClasses.contains(this)) aSearchClasses.push(this);
      });
      if (aSearchClasses.length) sFilter += "." + aSearchClasses.join(".");
      jq1Existing = this.filter(sFilter);
    }
    
    ]]><javascript:stage-dev><![CDATA[
    if (jq1Existing.length > 1 && window.console) {
      console.warn("needle has multiple [" + sFilter + "] matches in the haystack");
      console.log(this);
      console.log(this, jq1Needle, true);
    }
    ]]></javascript:stage-dev><![CDATA[
    
    return jq1Existing;
  ]]></javascript:jquery-extension>
  
  <javascript:jquery-extension name="isDocument"><![CDATA[
    //http://www.w3schools.com/jsref/prop_node_nodetype.asp
    var bIsDocument = false;
    if (this.length == 1) {
      bIsDocument = (this[0].nodeType === 9); //window.document.DOCUMENT_NODE
    } else if (window.console) console.error("not 1 element for isDocument compare");
    return bIsDocument;
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="isInDocument"><![CDATA[
    return (this.inDocument().length !== 0);
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="inDocument"><![CDATA[
    //returns ANYTHING that is still in this document, including the document element
    //returns a new jQuery object
    var aNew = new Array();
    this.each(function(){
      if (jQuery(this).closest("body,head").length) aNew.push(this);
    });
    //jQuery add() carries out sorting in to document order (slow)
    //jQuery(array) ignores the sorting
    return jQuery(aNew);
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="tagName" parameters="[bCheckNamespace = true]"><![CDATA[
    var oNode, sTagName;

    if (this.length) {
      if (this.length == 1) {
        oNode = this.get(0);
        if      (oNode.tagName) sTagName = oNode.tagName; //nodes
        else if (oNode.name)    sTagName = oNode.name;    //attributes
        if (bCheckNamespace && this.isXHTMLNamespace()) {
          //we seem to have uppercase reporting from Chrome at least on HTML Nodes
          //however, the XML namespace seems to report the correct case
          sTagName = sTagName.toLowerCase();
        }
      } else if (window.console) console.error("too many elements in tagName request");
    } else if (window.console) console.error("no elements in tagName request");

    return sTagName;
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="xmlXmlID" parameters="[sXmlID]"><![CDATA[
    //XML only extension!!
    if (this.length > 1 && window.console) console.warn("xmlXmlID() of more than one element!");
    if ((sXmlID !== undefined)) this.first().attr("xml:id", sXmlID);
    return this.first().attr("xml:id"); //returns undefined if not found
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="xmlXPathToNode" parameters="[sXPathToNode]"><![CDATA[
    //XML only extension!!
    if (this.length > 1 && window.console) console.warn("xmlXPathToNode() of more than one element!");
    if ((sXPathToNode !== undefined)) this.first().attr("meta:xpath-to-node", sXPathToNode);
    return this.first().attr("meta:xpath-to-node"); //returns undefined if not found
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="isXHTMLNamespace"><![CDATA[
    return (this.namespaceURI() == HTML.NAMESPACE);
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="isNonXHTMLNamespace"><![CDATA[
    return !this.isXHTMLNamespace();
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="namespaceURI"><![CDATA[
    //Dodgy stuff!
    //namespaceURI is not really well supported
    //and doesnt give correct results
    //TODO: NODE_ATTRIBUTE namespace?
    var sName, sPrefix, sBrowserNamespaceURI;
    var sNamespaceURI;

    if (this.length) {
      sBrowserNamespaceURI = this.get(0).namespaceURI;
      if (sBrowserNamespaceURI && sBrowserNamespaceURI != HTML.NAMESPACE) {
        //declared non-HTML namespace reported by browser: use it!
        sNamespaceURI = sBrowserNamespaceURI;
      } else {
        //double check the namespace form the prefix
        sNamespaceURI = HTML.NAMESPACE;
        sName         = this.tagName(false);
        if (sName && sName.contains(":")) {
          sPrefix = sName.substringBefore(":").toLowerCase();
          if (sPrefix && !(sPrefix == "html" || sPrefix == "xhtml")) {
            //TODO: can we manually search the html xmlns list for this prefix?
            switch (sPrefix) {
              case "gs":  sNamespaceURI = "http://general_server.org/xmlnamespaces/general_server/2006"; break;
              case "xsd": sNamespaceURI = "http://www.w3.org/2001/XMLSchema"; break;
              case "xsl": sNamespaceURI = "http://www.w3.org/1999/XSL/Transform"; break;
              case "xxx": sNamespaceURI = "http://general_server.org/xmlnamespaces/dummyxsl/2006"; break;
              case "dyn": sNamespaceURI = "http://exslt.org/dynamic"; break;
              case "xml": sNamespaceURI = "http://www.w3.org/XML/1998/namespace"; break;
              default: sNamespaceURI = "http://general_server.org/xmlnamespaces/" + sPrefix + "/2006";
            }
          }
        }
      }
    } else if (window.console) console.error("no elements in the namespace request!");

    return sNamespaceURI;
  ]]></javascript:jquery-extension>

  <!-- ############################## navigation ############################## -->
  <javascript:jquery-extension name="find" parameters="[u1Selector, ...]"><![CDATA[
    //extra special words that allow searching UP the tree with CSS selectors
    //note failover to fOriginal. every jquery-extension override has one
    //in addition: undefined and blank string return this
    //filter extensions: the Tinternet says this is not possible
    //  jQuery filters return boolean for each current member
    var jqNew;

    //special singular words
    if (arguments.length == 1 && String.istype(u1Selector) || CSSPathString.istype(u1Selector)) {
      switch (u1Selector.toString()) {
        case "":
        case "this":      jqNew = this; break;
        case "parent":    jqNew = this.parent(); break;
        case "container": jqNew = this.ancestor(".Object:first"); break;
      }
    }
    
    return (jqNew !== undefined ? jqNew : jQuery.prototype.find.fOriginal.apply(this, arguments));
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="ancestorsOrSelf" parameters="[uSelector, ...]"><![CDATA[
    //self comes first
    //results are NOT in document order. they are in queried self -> ancestor order
    //.first() returns self
    //:first may return 2 elements!!
    if ((uSelector !== undefined) && String.istype(uSelector) && uSelector.endsWith(":first")) {
      if (window.console) window.console.warn(":first is problematic here");
    }
    return this.filter.apply(this, arguments).addNoSort(this.parents.apply(this, arguments));
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="findBefore" parameters="uSelector, uBefore"><![CDATA[
    //find() without traversing through any uBefore
    //e.g. find(Object, Object) find includes the Object that it should not traverse through
    //e.g. find(Field, Object)  finds all the fields without traversing through any .Object
    var aFilteredTargets = new Array();
    var jTargets         = this.find(uSelector);
    var jClosestBefore   = this.closest(uBefore); //maybe this, maybe none
    
    jTargets.each(function(){
      if (new jQuery(this).parent().closest(uBefore).is(jClosestBefore)) aFilteredTargets.push(this);
    });
    
    return new jQuery(aFilteredTargets);
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="findOrSelf" parameters="[uSelector, ...]"><![CDATA[
    //self comes first
    //results are in document order. they are in queried self -> descendants order
    //.first() returns self
    //:first may return 2 elements!!
    if ((uSelector !== undefined) && String.istype(uSelector) && uSelector.endsWith(":first")) {
      if (window.console) window.console.warn(":first is problematic here");
    }
    return this.filter.apply(this, arguments).addNoSort(this.find.apply(this, arguments));
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="ancestors" parameters="..."><![CDATA[
    return this.parents.apply(this, arguments);
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="firstChild" parameters="[sSelect]"><![CDATA[
    return this.children(sSelect).first();
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="attributes" parameters="[uParameter, bOverwrite = false]"><![CDATA[
    //attributes([NAMESPACE or jQuery, overwrite mode])
    var self = this;
    var jAttribute, jAllAttributes = jQuery();
    var sName, sNamespaceURI;

    //------------------------------------- set attributes from uParameter
    if (uParameter instanceof jQuery) {
      uParameter.each(function(){
        if (bOverwrite || !self.attr(this.name))
          self.attr(this.name, this.value);
      });
    } else if (typeof uParameter === "string") sNamespaceURI = uParameter;

    //------------------------------------- return attributes
    //TODO: are we suppressing expensive Document Order sorting in the jQuery.add() process here?
    this.each(function(){
      jQuery(this.attributes).each(function(){
        jAttribute = jQuery(this);
        sName      = jAttribute.tagName();
        if (sName != "xmlns" && !sName.startsWith("xmlns:")) {
          if (!sNamespaceURI || jAttribute.namespaceURI() == sNamespaceURI) jAllAttributes = jAllAttributes.add(this);
        }
      });
    });

    return jAllAttributes;
  ]]></javascript:jquery-extension>

  <!-- ############################## conversion ############################## -->
  <javascript:jquery-extension name="toString"><![CDATA[
    //normal jQuery toString() returns "[object Object]"
    //so we override it here
    return this.outerHTML();
  ]]></javascript:jquery-extension>
  
  <javascript:jquery-extension name="toXHTMLString"><![CDATA[
    //normal jQuery toString() returns "[object Object]"
    //so we override it here
    return this.outerHTML();
  ]]></javascript:jquery-extension>

  <!-- ############################## filters ############################## -->
  <javascript:jquery-expression-extension name="regex" parameters="hElem, iIndex, aMatch"><![CDATA[
    //thanks to james.padolsey
    //http://james.padolsey.com/javascript/regex-selector-for-jquery/
    //usage: JOO(":regex(class,f_.*)")
    var matchParams = aMatch[3].split(','),
        validLabels = /^(data|css):/,
        attr = {
            method: matchParams[0].match(validLabels) ? matchParams[0].split(':')[0] : 'attr',
            property: matchParams.shift().replace(validLabels,'')
        },
        regexFlags = 'ig',
        regex = new RegExp(matchParams.join('').replace(/^s+|s+$/g,''), regexFlags);
    return regex.test(jQuery(hElem)[attr.method](attr.property));
  ]]></javascript:jquery-expression-extension>

  <javascript:jquery-extension name="hasAttr" parameters="(String) sAttributeName"><![CDATA[
    return this.is("[" + sAttributeName + "]");
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="withObjectMethod" parameters="s1FunctionName"><![CDATA[
    var aDOM = this.eachResults(function(s1FunctionName){
      var oObject = new jQuery(this).object();
      if (oObject && oObject[s1FunctionName] instanceof Function) return this;
    }, DEFAULT, s1FunctionName);
    return new jQuery(aDOM);
  ]]></javascript:jquery-extension>

  <!-- ############################## effects ############################## -->
  <javascript:jquery-extension name="highlight"><![CDATA[
    var self = this;
    var sOldBorder = this.css("border");
    this.css({border:"1px dotted red"});
    setTimeout(function(){self.unHighlight(sOldBorder);}, 2000);
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="unHighlight" parameters="[sOldBorder = 'none']"><![CDATA[
    this.css({border:sOldBorder});
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="started" parameters="s1Something, [sWithMessage]"><![CDATA[
    var jWithMessage, sClass = "gs-ajax-" + s1Something;
    this.addClass(sClass);

    if ((sWithMessage !== undefined)) {
      jWithMessage  = new jQuery("<div/>", {class:sClass + "-message gs-central-screen"}).text(sWithMessage);
      this.append(jWithMessage);
    }
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="finished" parameters="s1Something, [s1AndNow, iTimeout = 2000]"><![CDATA[
    var self = this;
    var sClassAndNow, sClass = "gs-ajax-" + s1Something;

    this.removeClass(sClass);
    this.children("." + sClass + "-message").remove();
    if (s1AndNow) {
      sClassAndNow = "gs-ajax-" + s1AndNow;
      this.addClass(sClassAndNow);
      if (iTimeout) setTimeout(function() {self.removeClass(sClassAndNow);}, iTimeout);
    }
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="startedLoading" parameters="[sWithMessage]"><![CDATA[
    return this.started("loading", sWithMessage);
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="startedSaving" parameters="[sWithMessage]"><![CDATA[
    return this.started("saving", sWithMessage);
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="startedRunning" parameters="[sWithMessage]"><![CDATA[
    return this.started("running", sWithMessage);
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="finishedLoading" parameters="[sStatus]"><![CDATA[
    return this.finished("loading", sStatus ? sStatus : "loaded");
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="finishedSaving" parameters="[sStatus]"><![CDATA[
    return this.finished("saving", sStatus ? sStatus : "saved");
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="finishedRunning" parameters="[sStatus]"><![CDATA[
    return this.finished("running", sStatus ? sStatus : "ran");
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="temptext" parameters="sString, [iTimeout = 2000]"><![CDATA[
    var self = this;
    var sOriginalText = this.text();
    setTimeout(function tempback(){self.text(sOriginalText);}, iTimeout);
    return this.text(sString);
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="slideLeftShow" parameters="[(String) sDuration, fComplete]"><![CDATA[
    this.show({
      duration:  sDuration,
      effect:    "slide",
      direction: "left",
      complete:  fComplete
    });
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="slideRightShow" parameters="[(String) sDuration, fComplete]"><![CDATA[
    this.show({
      duration:  sDuration,
      effect:    "slide",
      direction: "right",
      complete:  fComplete
    });
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="slideLeftHide" parameters="[(String) sDuration, fComplete]"><![CDATA[
    this.hide({
      duration:  sDuration,
      effect:    "slide",
      direction: "left",
      complete:  fComplete
    });
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="slideRightHide" parameters="[(String) sDuration, fComplete]"><![CDATA[
    this.hide({
      duration:  sDuration,
      effect:    "slide",
      direction: "right",
      complete:  fComplete
    });
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="scrollIntoView"><![CDATA[
    var jq1Container        = this.elements.offsetParent();
    var currentScrollTop    = jq1Container.scrollTop();
    var containerTop        = jq1Container.offset().top;
    var containerHeight     = jq1Container.height();
    var targetScrollTop     = this.elements.offset().top - containerTop + currentScrollTop;
    var targetScrollBottom  = this.elements.offset().top + this.elements.height() - containerTop + currentScrollTop;

    if (!jq1Container.hasClass("scrolling")) {
      if (targetScrollTop < currentScrollTop || targetScrollBottom > containerHeight + currentScrollTop) {
        jq1Container.addClass("scrolling");
        jq1Container.animate({scrollTop: targetScrollTop}, 500, function(){
          this.elements.removeClass("scrolling");
        });
      }
    }

    return this;
  ]]></javascript:jquery-extension>

  <!-- ############################## visibility ############################## -->
  <javascript:jquery-extension name="visible"><![CDATA[
    return this.filter(":visible");
  ]]></javascript:jquery-extension>
  
  <javascript:jquery-extension name="someVisible"><![CDATA[
    return (this.visible().length != 0);
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="allVisible"><![CDATA[
    return (this.visible().length === this.length);
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="hidden"><![CDATA[
    return this.filter(":hidden");
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="someHidden"><![CDATA[
    return !this.allVisible();
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="allHidden"><![CDATA[
    return !this.someVisible();
  ]]></javascript:jquery-extension>

  <!-- ############################## comparison ############################## -->
  <javascript:jquery-extension name="inside" parameters="jqArray"><![CDATA[
    //"in" is a reserved word in Javascript
    return jqArray.is(this);
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="same" parameters="(jQuery) jqOther"><![CDATA[
    //jQuery(body) != jQuery(body)
    //jQuery(body).same(jQuery(body)) === true
    var bSame = false;

    if (jqOther instanceof window.Node || jqOther instanceof window.Document) jqOther = jQuery(jqOther);
    if (jqOther.length == this.length) {
      bSame = true;
      for (var i = 0; i < this.length && bSame; i++) {
        if (this.get(i) !== jqOther.get(i)) bSame = false;
      }
    }

    return bSame;
  ]]></javascript:jquery-extension>

  <!-- ############################## Event ############################## -->
  <javascript:javascript-extension object-name="jQuery.Event" name="toJOO"><![CDATA[
    //(JOO) eEvent => jQuery.Event.prototype.toJOO()
    return new JOO(this.target);
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="jQuery.Event" name="toEvent"><![CDATA[
    //we use the factory function to ensure proper sub-class 
    //and persistent oEvent are used
    return Event.factory(this);
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="jQuery.Event" name="clone" parameters="[bResetTarget = true]"><![CDATA[
    var jNewEvent = jQuery.Event(this);
    for (var i in this) if (jNewEvent[i] === undefined) jNewEvent[i] = this[i];
    if (bResetTarget) jNewEvent.resetTarget();
    return jNewEvent;
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="jQuery.Event" name="resetTarget"><![CDATA[
    this.currentTarget = this.target;
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="jQuery.Event" name="setDataContextObject" parameters="fClass, oData"><![CDATA[
    if ((this.data === undefined)) this.data = new Object();
    updateClassDataObject(fClass, oData, this.data, true); //true = singular overwrite
    return this;
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="jQuery.Event" name="addDataContextObject" parameters="fClass, oData"><![CDATA[
    //context on Class__Event is actually set on this jQuery.Event object
    //so it natively has the concepts on it
    if ((this.data === undefined)) this.data = new Object();
    updateClassDataObject(fClass, oData, this.data); //add
    return this;
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="jQuery.Event" name="retrigger"><![CDATA[
    var jeNewEvent, jTarget = jQuery(this.target);
    //check our target is still in the document
    if (jTarget.inDocument()) {
      //copy the event because we are changing it
      //the clone will automatically reset the currentTarget to the initial target
      jeNewEvent = this.clone();
      jTarget.trigger(jeNewEvent);

    } else if (window.console) console.warn("cannot retrigger() event because target has disappeared");
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="jQuery" name="toNode"><![CDATA[
    return this.get(0);
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="jQuery" name="toDocument"><![CDATA[
    return this.toNode().ownerDocument;
  ]]></javascript:javascript-extension>

  <javascript:javascript-extension object-name="jQuery" name="toJOO"><![CDATA[
    return new JOO(this);
  ]]></javascript:javascript-extension>

  <javascript:jquery-extension name="copy"><![CDATA[
    //only copies DOM entries
    var aNew = new Array();
    this.each(function(){aNew.push(this)});
    return new jQuery(aNew); //Array instantiation no sorting
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="addWithDocumentOrderSort" parameters="..."><![CDATA[
    //alias for add()
    return this.add.apply(this, arguments);
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="addNoSort" parameters="jqNew"><![CDATA[
    //normal add() sorts the results in Document order
    var aNew = new Array();
    this.each(function(){aNew.push(this)});
    jqNew.each(function(){aNew.push(this)});
    return new jQuery(aNew); //Array instantiation no sorting
  ]]></javascript:jquery-extension>

  <!-- ###################################### content replacement callbacks ####################################
    all static so that functions can be passed as simple callbacks
  -->
  <javascript:jquery-extension name="replaceNode" parameters="(JOO) j1Target, (jQuery) jqHTMLDoc"><![CDATA[
    //an fCallback to replace a node
    var jqDefrag, jqNewSource;

    //assemble replacement
    jqDefrag    = jQuery.createElement("div");
    jqDefrag.append(jqHTMLDoc.get(0));
    jqNewSource = jqDefrag.children();
    
    //change the DOM
    //http://api.jquery.com/replacewith/
    j1Target.replaceWith(jqNewSource);
    
    return jqNewSource;
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="mergeAttributeNodes" parameters="jq1Source, [bRemoveOldTargets = false]"><![CDATA[
    var self = this;
    this.attributes().each(function(){
      var sAttrName    = new jQuery(this).tagName();
      var sSourceValue = jq1Source.attr(sAttrName);
      var sTargetValue = self.attr(sAttrName);
      
      if (sAttrName === "class") {
        //ignore certain classes
      }
      
      if (sSourceValue !== sTargetValue) self.attr(sAttrName, sSourceValue);
    });
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="mergeTextNodes" parameters="jq1Source, [bRemoveOldTargets = false]"><![CDATA[
    //ATM only nodes with no element children can contain text
    //TODO: markup in text
    var sNewText;
    if (jq1Source.children().length === 0) {
      if (sNewText = jq1Source.text()) {
        if (this.text() !== sNewText) this.text(sNewText);
      }
    }
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="mergeNodes" parameters="jqSources, [fFirstIndexOf = jQuery.prototype.firstIndexOfByXPathToNodeClass, bRemoveOldTargets = false, uLimitSelector, jqStartTarget]"><![CDATA[
    //merge this node, and sub-tree
    //  this initial targets will be replaced / found amongst their *siblings* first
    //  and jqSources = the singular top node, e.g. div.Class__Collection
    //recursive: all level nodes are merged
    //merging HTML results, NOT XML source. so we need to match on .gs-xml-id-<xml:id>
    //  divs, .details, .meta-group are all also merged
    //  so only works with xml:id valid nodes
    var jqRemovals, jqExistingTarget;
    var self               = this;
    var jqSearchTargets    = this;
    var jqInsertionElement = this.last();
    var jqExistingTargets  = new jQuery();
    var bIsTop             = (jqStartTarget === undefined);
    var jqNewTopElements   = new jQuery();
    
    //on the top level we are only sent one node on the level
    //and we need search siblings for the source(s) also
    //on successive levels we are descending to the single existing target children() 
    //  and thus they are already there
    if (bIsTop)  {
      jqStartTarget   = this;
      jqSearchTargets = jqSearchTargets.add(jqSearchTargets.siblings());
    }
    
    jqSources.eachEq(function(){
      jqExistingTarget = fFirstIndexOf.call(jqSearchTargets, this); //haystack, needle
      
      if (jqExistingTarget.length) {
        //source present in target list
        //assume that attribute changes will not affect the object()
        if ((uLimitSelector === undefined) || !jqExistingTarget.is(uLimitSelector)) {
          jqExistingTarget.mergeAttributeNodes(this, bRemoveOldTargets);
          jqExistingTarget.mergeTextNodes(     this, bRemoveOldTargets);
          jqNewTopElements = jqNewTopElements.add(
            jqExistingTarget.children().mergeNodes(
              this.children(), 
              fFirstIndexOf, 
              bRemoveOldTargets, 
              uLimitSelector, 
              jqStartTarget
            )
          );
        }
        
        jqInsertionElement = jqExistingTarget;
        jqExistingTargets  = jqExistingTargets.add(jqExistingTarget);
      } else {
        //source not present in target list
        //maintain document order
        this.insertAfter(jqInsertionElement);
        jqNewTopElements = jqNewTopElements.add(this);
      }
    });
    
    //this will remove the whole level if there is nothing in the jqSources
    //use uLimitSelector to prevent descent on elements that should not be included
    if (bRemoveOldTargets) {
      jqRemovals = jqTargets.not(jqExistingTargets);
      jqRemovals.remove();
    }
    
    return jqNewTopElements;
  ]]></javascript:jquery-extension>
  
  <!-- ############################## misc ############################## -->
  <javascript:javascript-static-extension object-name="jQuery" name="createElement" parameters="sTagName, [oAttributes]"><![CDATA[
    //returns a new jQuery object
    //alternatively you can use jQuery("<div/>", {id:6,style:....})
    //return jQuery(document.createElement(sTagName), oAttributes);
    return jQuery("<" + sTagName + "/>", oAttributes);
  ]]></javascript:javascript-static-extension>

  <javascript:jquery-extension name="createElement" parameters="sTagName, [oAttributes]"><![CDATA[
    return jQuery.createElement(sTagName, oAttributes);
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="cloneTo" parameters="jq1NewParent, [s1NewClassName]"><![CDATA[
    var jqClone = this.clone(); //returns a JOO

    if (!jqClone || !jqClone.length) {
      if (window.console) console.error("cloneTo() could not clone the base jQuery element");
    } else {
      //can be used so that it identifies locally from now on
      if ((s1NewClassName !== undefined)) jqClone.addClass(s1NewClassName);
      jq1NewParent.append(jqClone);
    }
    
    return jqClone;
  ]]></javascript:jquery-extension>

  <javascript:jquery-static-extension name="elementWithFocus"><![CDATA[
    //jQuery(:focus) will search the whole tree
    //wide support for activeElement
    //http://www.w3schools.com/jsref/prop_document_activeelement.asp
    return jQuery(document.activeElement);
  ]]></javascript:jquery-static-extension>

  <javascript:jquery-extension name="serializeObject"><![CDATA[
    var o = {};
    var a = this.serializeArray();
    jQuery.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || "");
        } else {
            o[this.name] = this.value || "";
        }
    });
    return o;
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="serializeParameters"><![CDATA[
    var a  = new Array();
    var ao = this.serializeArray();
    jQuery.each(ao, function() {
        a.push(this.value || "");
    });
    return a;
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="inputType"><![CDATA[
    if      (this.tagName() == "textarea") sType = "textarea";
    else if (this.hasAttr("type"))         sType = this.attr("type");
    else                                   sType = "text";

    return sType;
  ]]></javascript:jquery-extension>

  <javascript:jquery-extension name="changeInputType" parameters="s1Newtype"><![CDATA[
    var jNewinput;

    //IE leaves a parentNode on the clone and so throws a manual exception in attr
    //which is good because IE cannot change the type attribute of inputs
    try {jNewinput = this.clone(true).attr("type", s1Newtype);} catch (ex) {}

    if (jNewinput) {
        this.after(jNewinput);

        //copy events (before swap in)
        //jQuery 1.3 uses jQuery.data(fromEl, 'events')
        var fromEl = this[0], events = fromEl && (jQuery.data && jQuery.data(fromEl, 'events') || fromEl.$events || fromEl.events) || {};
        for (var type in events) {
            // in jQuery 1.4.2+ event handlers are stored in an array, previous versions it is an object
            jQuery.each(events[type], function(index, handler) {
                // in jQuery 1.4.2+ handler is an object with a handle property
                // in previous versions it is the actual handler with the properties tacked on
                var namespaces = handler.namespace !== undefined && handler.namespace || handler.type || '';
                namespaces = namespaces.length ? (namespaces.indexOf('.') === 0 ? '' : '.')+namespaces : '';
                jQuery.event.add(jNewinput[0], type + namespaces, handler.handler || handler, handler.data);
            });
        }
        this.remove();
    }

    return jNewinput;
  ]]></javascript:jquery-extension>
</javascript:code>