/**----------------------------------------------------------------------------+
| Product:  Ajile [com.iskitz.ajile]
| @version  1.2.1
|+-----------------------------------------------------------------------------+
| @author   Michael A. I. Lee [ http://ajile.iskitz.com/ ]
|
| Created:  Tuesday,   November   4, 2003    [2003.11.04]
| Modified: Sunday,    December  30, 2007    [2007.12.30 - 03:43:30 AM EDT]
|+-----------------------------------------------------------------------------+
|
| [Ajile] - Advanced JavaScript Importing & Loading Extension is a JavaScript
|           module that adds namespacing and importing capabilities to the
|           JavaScript Language.
|
|           Visit http://ajile.iskitz.com/ to start creating
|
|                  "Smart scripts that play nice!"
|
|           Copyright (c) 2003-2008 Michael A. I. Lee, iSkitz.com
|
|+-----------------------------------------------------------------------------+
|
| ***** BEGIN LICENSE BLOCK *****
| Version: MPL 1.1/GPL 2.0/LGPL 2.1
|
| The contents of this file are subject to the Mozilla Public License Version
| 1.1 (the "License"); you may not use this file except in compliance with
| the License. You may obtain a copy of the License at
| http://www.mozilla.org/MPL/
|
| Software distributed under the License is distributed on an "AS IS" basis,
| WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
| for the specific language governing rights and limitations under the
| License.
|
| The Original Code is Ajile.
|
| The Initial Developer of the Original Code is Michael A. I. Lee
|
| Portions created by the Initial Developer are Copyright (C) 2003-2008
| the Initial Developer. All Rights Reserved.
|
| Contributor(s): Michael A. I. Lee [ http://ajile.iskitz.com/ ]
|
| Alternatively, the contents of this file may be used under the terms of
| either the GNU General Public License Version 2 or later (the "GPL"), or
| the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
| in which case the provisions of the GPL or the LGPL are applicable instead
| of those above. If you wish to allow use of your version of this file only
| under the terms of either the GPL or the LGPL, and not to allow others to
| use your version of this file under the terms of the MPL, indicate your
| decision by deleting the provisions above and replace them with the notice
| and other provisions required by the GPL or the LGPL. If you do not delete
| the provisions above, a recipient may use your version of this file under
| the terms of any one of the MPL, the GPL or the LGPL.
|
| ***** END LICENSE BLOCK *****
*-----------------------------------------------------------------------------*/

(function/*com.iskitz.ajile*/(VERSION)
{
   var isDOM, isDOM05, isDOM1, isDOM2;

   if(typeof $create != "undefined" && $create() > 1)
      return;

   var CLOAK     = true
     , DEBUG     = false
     , LEGACY    = false
     , MVC       = true
     , MVC_SHARE = true
     , OVERRIDE  = false
     , REFRESH   = false;

   var ALIAS      = "Ajile"
     , ATTRIB     = "Powered by "
     , CONTROLLER = "index"
     , EXTENSION  = ".js"
     , INTERNAL   = "<*>"
     , QNAME      = "com.iskitz.ajile"
     , SEPARATOR
     , TYPES      = [ ALIAS, "Import", "ImportAs", "Include", "Load"
                    , "Namespace"
                    ]
     , TYPES_OLD  = [ "JSBasePath", "JSImport", "JSPackage", "JSPackaging"
                    , "JSPacked", "JSPath", "NamespaceException", "Package"
                    , "PackageException"
                    ];

   var HEAD
     , INFO
     , LOADED = "__LOADED__"
     , LOADER
     , LOG    = ''
     , THIS;

   var NOTATIONS = [ '*',    '|', ':',    '"', '<', '>', '?',    '[', '{', '('
                   , ')',    '}', ']', '\x5c', '&', '@', '#', '\x24', '%', '!'
                   , ';',    "'", '=',    '+', '~', ',', '^',    '_', ' ', '`'
                   , '-', '\x2f', '.'
                   ];

   var RE_OPT_CLOAK        = (   /(cloakoff|cloak)/)
     , RE_OPT_DEBUG        = (   /(debugoff|debug)/)
     , RE_OPT_LEGACY       = (  /(legacyoff|legacy)/)
     , RE_OPT_MVC          = (     /(mvcoff|mvc)/)
     , RE_OPT_MVC_SHARE    = (/(mvcshareoff|mvcshare)/)
     , RE_OPT_OVERRIDE     = (/(overrideoff|override)/)
     , RE_OPT_REFRESH      = ( /(refreshoff|refresh)/)
     , RE_PARENT_DIR       = (/(.*\/)[^\/]+/)
     , RE_PARENT_NAMESPACE = (/(.*)\.[^\.]+/)
     , RE_RELATIVE_DIR     = (/(\/\.\/)|(\/[^\/]*\/\.\.\/)/)
     , RE_URL_PROTOCOL     = (/:\/\x2f/);


   function $create(exists)
   {
      undefined = void(0);

      if(typeof isIncompatible == "undefined" || typeof usage == "undefined")
         return 0;
      
      if((exists = exists || isIncompatible()))
         return 3;

      INFO = new NamespaceInfo(getNamespaceInfo(QNAME));

      if(!OVERRIDE && (exists = exists || (THIS = GetModule(QNAME))))
         return 2;
         
      INFO.version = (VERSION = VERSION || INFO.version);
      cloakObject((THIS = THIS || {}).constructor);
      cloakObject(notifyImportListeners);
      setAttribution();

      if(!isDOM)
      {  INFO.fullName  = QNAME;
         INFO.path      = "../lib/ajile/";
         INFO.shortName = ALIAS;
      }

      publishAPI();
      pendingImports.add(QNAME, ALIAS);
      processed.add     (QNAME, ALIAS);
      handleImported    (ALIAS, QNAME, THIS);
      loadController();
      cloakModule(QNAME);
      ensureFailSafe();
      
      return 1;
   }

   function $destroy(fullName)
   {
      if(fullName && fullName != QNAME)
      {
         destroyModules(fullName);
         return;
      }

      dependence.clear();
      importListeners.clear();
      modulePaths.clear();
      nsInfoMap.clear();
      pendingImports.clear();
      processed.clear();
      usage.clear();
      ensureFailSafe(false);
      cloakModule();

      LOADER = null;

      destroyAPI(TYPES.concat(TYPES_OLD));
      destroyEmptyNamespace(QNAME);
   }


   function addDependence(fullName, shortName)
   {
      if(fullName == currentModuleName) return;

      var supporters = dependence.get(currentModuleName);

      if(!supporters)
         dependence.add(currentModuleName, (supporters = new SimpleSet()));

      supporters.add(fullName, shortName);
   }


   function AddImportListener(moduleName, listener)
   {
      ensureFailSafe();

      if(!listener || !isFunction(listener))
         if(isFunction(moduleName))
         {
            listener   = moduleName;
            moduleName = undefined;
         }
         else return false;

      else if(moduleName && !isString(moduleName))
         return false;

      if(moduleName == INTERNAL && this == window[ALIAS])
         return false;

      if(!moduleName && this != window[ALIAS])
         moduleName = INTERNAL;

      var $listener = listener;

      if(moduleName && (processed.has(moduleName) || GetModule(moduleName)))
         return window.setTimeout(function(){ $listener(moduleName); }, 62.25);

      if(!moduleName)
         if(processed.getSize() > 0 || pendingImports.getSize() == 0)
            for(var importee in processed.getAll())
               window.setTimeout(function(){ $listener(importee); }, 62.25);

      var listeners = importListeners.get((moduleName = (moduleName || '')));

      if(!listeners)
         importListeners.add(moduleName, (listeners = new SimpleSet()));

      listeners.add(Math.random(), $listener);

      return true;
   }


   function addUsage(fullName)
   {
      if(fullName == currentModuleName) return;

      var usesOf = usage.get(fullName);

      if(!usesOf)
         usage.add(fullName, (usesOf = new SimpleSet()));

      usesOf.add(currentModuleName);
   }


   function cloakModule(moduleName, container)
   {
      if(moduleName && !isString(moduleName))
         return;

      moduleName = moduleName || '';
      var module = GetModule(moduleName);

      if (module)
         cloakObject((isFunction(module) ? module : module.constructor));

      if(!isDOM05) return;

      var namespaceInfo = GetNamespaceInfo(moduleName);
      var isCloaked     = (namespaceInfo && namespaceInfo.hasOption("cloak"));

      for(var id, src, sys, loaders=getLoaders(), i=loaders.length; --i >= 0;)
      {
         if(!loaders[i]) continue;
         if(((id = loaders[i].title) && moduleName && (id != moduleName)))
            continue;

         src =  loaders[i].src;
         sys =  (src && (src.indexOf(QNAME) >= 0))
             || ( id && ( id.indexOf(QNAME) == 0));

         if(sys || (!src && id) || isCloaked || CLOAK)
            cloakNode(loaders[i], container);
      }
   }


   function cloakNode(element, container)
   {
      if(isDOM1)
         cloakNode = function cloakDOM1(element, container)
         {
            if((container = container || element.parentNode))
               if(container.removeChild)
                  container.removeChild(element);
         };

      else if(isDOM05) cloakNode = new Function("element", "container",//)
    /*{*/
         'if(container)'
        +'{'
        +'  try { container.removeChild(element); }catch(e){}'
        +'  return;'
        +'}'

        +'try { document.getElementsByTagName("head")[0].removeChild(element); }catch(e){'
        +'try { document.body.removeChild(element);'+                         '}catch(e){}}'
    /*}*/);

      else cloakNode = function cloakNothing(){};
      
      if(element) cloakNode(element, container);
   }


   function cloakObject(obj)
   {
      if(!obj || typeof obj.toString == "undefined")
         return;

      var name     = (/(function\s*.*\s*\(.*\))/).exec(obj.toString()) || ['']
        , funcName = name.length > 1 ? name[1] : name[0];

      if(typeof obj.prototype == "undefined")
         return;

      obj.prototype.constructor.toString = function(e)
      {
         return (DEBUG && !CLOAK) ? funcName : obj.prototype.toString();
      };
   }


   function compareNumbers(num1, num2) { return num1 - num2; }


   function completeImports(fullName)
   {
      var module, modules;

      if(!(isString(fullName) && pendingImports.has(fullName)))
         modules = pendingImports.getAllArray();

      else if(GetModule(fullName))
         modules = [[fullName, pendingImports.get(fullName)]];

      if(!modules) return;

      for(var shortName, i=modules.length; --i >=0;)
      {
         fullName = modules[i][0];

         if(!(pendingImports.has(fullName) && (module = GetModule(fullName))))
            continue;

         logImportCheck((shortName = modules[i][1]), fullName, arguments);

         if(shortName == '*') shortName = undefined;

         handleImported(shortName, fullName, module);
         updateDependents(fullName);
      }
   }


   function DEPRECATED$GetPathFor(_namespace)
   {
      return ALIAS + ".GetPathFor("+ _namespace +") is not supported. "
           + "Namespace paths are protected.";
   }


   function DEPRECATED$NamespaceException(_namespace)
   {
      this.name     = "DEPRECATED: " + QNAME + ".NamespaceException";
      this.message  = "DEPRECATED: Invalid _namespace name [" + _namespace + "]";
      this.toString = toString;

      function toString()
      {
        return "[ "+ this.name + " ] :: "+ this.message;
      }
   }


   function DEPRECATED$SetBasePath(path)
   {
      if(isString(path)) INFO.path = path;
   }
   
   
   function destroyAPI(SYS)
   {
      if(!isDOM05)
         for(var i=SYS.length; --i >= 0; window[SYS[i]] = undefined);

      else (destroyAPI = new Function("SYS",
    /*{*/
      '  try     { for(var i=SYS.length; --i >= 0; delete window[SYS[i]]);      }'
     +'  catch(e){ for(var j=SYS.length; --j >= 0; window[SYS[j]] = undefined); }'
    /*}*/))(SYS);
   }


   function destroyEmptyNamespace(fullName)
   {
      if(!fullName) return;

      var isEmpty = {}
        , nsParts = fullName.split('\x2e')
        , ns      = window[nsParts[0]];

      for(var i=1; typeof nsParts[i] != "undefined"; i++)
      {
         if(typeof ns[nsParts[i]] == "undefined")
            break;

         isEmpty[nsParts[i-1]] = [i, true];
         ns = ns[nsParts[i]];

         for(var member in ns)
            if("undefined" == typeof Object.prototype[member])
               if(member != nsParts[i])
               {
                  isEmpty[nsParts[i-1]][1] = false;
                  break;
               }
      }

      for(ns in isEmpty)
         if("undefined" == typeof Object.prototype[ns])
            if(isEmpty[ns][1])
               destroyModules(nsParts.slice(0, isEmpty[ns][0]+1).join('.'));
   }


   function destroyModules(fullName)
   {
      var shortName;

      if(fullName)
      {
         if(!isString(fullName))
            if((fullName = GetNamespaceInfo(fullName)))
            {
               fullName  = fullName.fullName;
               shortName = fullName.shortName;
            }

         if(!shortName && fullName)
            shortName = fullName.substring(fullName.lastIndexOf('\x2e') + 1);

         fullName = RE_PARENT_NAMESPACE.exec(fullName);
         fullName = fullName ? fullName[1] : undefined;
      }

      var module = GetModule(fullName);

      if(module && shortName)
         if(shortName == '*' || typeof(module[shortName]) != "undefined")
         {
            if(shortName != "*")
            {
               if(module[shortName] == window[shortName])
                  window[shortName] = undefined;

               delete module[shortName];
            }
            else
            {
               for(var member in module)
                  if("undefined" == typeof Object.prototype[member])
                     delete module[member];

               destroyEmptyNamespace(fullName);
            }
         }

      cloakModule(fullName);
   }


   function detectCurrentModule(_namespace)
   {
      var parentNamespace = _namespace;
      var pending         = pendingImports.getAllArray();

      for(var moduleName, i=0, j=pending.length; i < j; ++i)
      {
         if(processed.has((moduleName = pending[i][0])))
            continue;

         if('*' != pending[i][1])
            parentNamespace = RE_PARENT_NAMESPACE.exec(moduleName);

         if(!(parentNamespace && (_namespace == parentNamespace[1])))
            continue;

         processed.add((currentModuleName = moduleName));
         return;
      }

      currentModuleName = CONTROLLER;
   }


   function ensureFailSafe(owner, isOn)
   {
            isOn =  isOn != undefined ? isOn : !(owner == false);
      var onLoad = (owner = owner || window || this).onload;

      if(isFunction(onLoad) && executeFailSafe === onLoad)
      {
         if(!isOn)
            owner.onload = onLoad(true);
         return;
      }

      if(onLoad != executeFailSafe.onLoad)
         executeFailSafe.onLoad = onLoad;

      cloakObject(owner.onload = executeFailSafe);
   }


   function executeFailSafe(isRestoring)
   {
      var onLoad = executeFailSafe.onLoad;

      if(!onLoad || isRestoring == true)
         return (onLoad || null);

      AddImportListener(cloakModule);
      completeImports();
      cloakModule();

      if(isFunction(onLoad))
         onLoad(isRestoring);

      ensureFailSafe = function(){};
      return onLoad;
   }


   function getContainer(element)
   {
      if(!element) return window.document;

      if(typeof element.write == "undefined")
         if(typeof element.document != "undefined")
            element = element.document;
         else if(typeof element.parentNode != "undefined")
            return getContainer(element.parentNode);
         else return window.document;

      return element;
   }


   function getImportInfo(shortName, fullName)
   {
      if(!fullName) return undefined;

      var parts = fullName.split('\x2e');
      var version;

      for(var isInclude=(shortName==fullName), i=0, j=parts.length; i < j; i++)
      {
         if(isNaN(parts[i])) continue;

         fullName  = parts.slice(0, i).join('\x2e');
         shortName = isInclude ? fullName : shortName || parts.slice(i-1, i)[0];
         version   = parts.slice(i).join('\x2e');
         break;
      }

      if(!version) return undefined;

      return [shortName, fullName, version];
   }


   function getLoaders(container)
   {
      if(!(container = getContainer(container)))
         return undefined;

      var loaders = (  typeof container.scripts        != "undefined"
                    && typeof container.scripts.length != "undefined"
                    &&        container.scripts.length  > 0)
                  ? container.scripts
                  : (typeof container.getElementsByTagName != "undefined")
                  ? (container.getElementsByTagName("script") || [])
                  : [];

      return loaders;
   }


   function getMainLoader(container)
   {
      if(container)
         if((!LOADER || isDOM1) && !isDOM05)
         {
            if(  (LOADER && isDOM2 && container != LOADER.ownerDocument)
              || !LOADER || !isDOM2 && isDOM1)
               if(container.lastChild && container.lastChild.firstChild)
                  LOADER = container.lastChild.firstChild;
         }
         else if(!LOADER && isDOM05) LOADER = HEAD;

      return LOADER;
   }


   function getMETAInfo(path)
   {
      loadOptions(path);

      if(!path || !isString(path)) return [];

      var iExt = EXTENSION
               ? path.lastIndexOf(EXTENSION)
               : path.lastIndexOf('\x2e');

      if(iExt < path.length && iExt >= 0)
      {
         var extension = path.slice(iExt, iExt + EXTENSION.length);
         var version   = path.substring(0, iExt);

         if(version && isNaN(version.charAt(0)))
            version = '';
      }

      return [version, extension];
   }


   function GetModule(fullName, owner)
   {
      if(!isString(fullName)) return undefined;

      var module = owner || window;
      fullName   = fullName.split('\x2e');

      for(var i=0, j=fullName.length; i < j; i++)
         if(typeof module[fullName[i]] != "undefined")
            module = module[fullName[i]];
         else
            return undefined;

      return module;
   }


   function GetNamespaceInfo(moduleOrName)
   {
      if(!moduleOrName)
         return new NamespaceInfo(INFO);

      var isModuleName = isString(moduleOrName);

      for(var moduleName in nsInfoMap)
         if("undefined" == typeof Object.prototype[moduleName])
            if(  ( isModuleName && moduleOrName == moduleName)
              || (!isModuleName && moduleOrName == GetModule(moduleName)))
              return nsInfoMap[moduleName];

      return undefined;
   }


   function getNamespaceInfo(_namespace, $notation)
   {
      _namespace = _namespace || QNAME;

      if(_namespace == QNAME && INFO && INFO.path)
         return INFO;

      var nsInfo = nsInfoMap[_namespace];

      if(nsInfo) return nsInfo;

      var lookups = getNamespaceLookups(_namespace, $notation);

      if((nsInfo = getNamespaceInfoCached(_namespace, lookups)))
         return (nsInfoMap[_namespace] = nsInfo);

      var loaders = getLoaders();

      if(!(loaders && lookups))
         return undefined;

      var $path;

      for(var found=false, path, paths, i=0, j=loaders.length; i < j; i++)
      {
         path = unescape(loaders[i].src);

         if(path && path.search(RE_URL_PROTOCOL) == -1)
         {
            path = unescape(window.location.href);

            if(path.charAt(path.length - 1) != SEPARATOR)
               if((paths = RE_PARENT_DIR.exec(path)) != null)
                  if(paths[1].length > path.search(RE_URL_PROTOCOL) + 3)
                     path = paths[1];

            path += unescape(loaders[i].src);
         }

         if(path == undefined || path == null)
            continue;

         while(RE_RELATIVE_DIR.test(path))
            path  = path.replace(RE_RELATIVE_DIR, '\x2f');

         if(modulePaths.has(path)) continue;

         modulePaths.add(path);

         if(found) continue;

         var lookupList;
         for(var notation in lookups)
         {
            if(typeof Object.prototype[notation] != "undefined")
               continue;

            lookupList = lookups[notation];

            var lookup, position, positions = [];
            for(var lc=lookupList.length; --lc >= 0;)
            {
               lookup   = lookupList[lc];
               position = path.lastIndexOf(lookup) + 1;

               if(position <= 0 || position == positions[0])
                  continue;

               positions[positions.length] = position;
               log("FOUND :: Path [ "+path+" ]", arguments);
            }

            if(positions.length == 0) continue;

            positions.sort(compareNumbers);
            position = positions[positions.length-1];

            $notation = (position == (path.lastIndexOf(lookup) + 1))
                      ? notation
                      : undefined;

            $path = path.substring(0, position);
            found = true;

            if(_namespace == QNAME && loaders[i].title != QNAME)
               loaders[i].title = QNAME;

            var iEnd      = position + lookup.length - 2;
            var metaInfo  = getMETAInfo(path.substring(iEnd + 1));
            var extension = metaInfo[1];
            var version   = metaInfo[0] || ((_namespace == QNAME) && VERSION);
            break;
         }//end for(lookups)
      }//end for(loaders)

      if(!$path) return undefined;

      nsInfo = new NamespaceInfo( $path,      $notation, _namespace
                                ,  undefined,  version,   extension);

      nsInfoMap[_namespace] = nsInfo;

      return nsInfo;
   }


   function getNamespaceInfoCached(_namespace, lookups)
   {
      var closest   = Number.MAX_VALUE;
      var diff;
      var iFinds    = [];
      var iFound;
      var iPick     = 0;
      lookups       = lookups || getNamespaceLookups(_namespace);
      var notations = [];
      var paths     = modulePaths.getAll();

paths:for(var path in paths)
      {
         if(typeof Object.prototype[path] != "undefined")
            continue;

         for(var notation in lookups)
         {
            if(typeof Object.prototype[notation] != "undefined")
               continue;

            notations[notations.length] = notation;

            for(var lookupList=lookups[notation], i=lookupList.length; --i >= 0;)
            {
               if(0 < (iFound = path.lastIndexOf(lookupList[i])))
               {
                  diff = path.length - (iFound + lookupList[i].length);

                  if(diff < closest)
                  {
                     closest = diff;
                     iPick = iFinds.length;
                  }

                  iFinds[iFinds.length] = iFound + 1;

                  var iEnd      = (iFound + 1) + lookupList[i].length - 2;
                  var metaInfo  = getMETAInfo(path.substring(iEnd + 1));
                  var extension = metaInfo[1];
                  var version   = metaInfo[0];

                  log("FOUND :: Cached Path [ "+path+" ]", arguments);
                  break paths;
               }

               if(i == 0) delete notations[--notations.length];
            }
         }
      }

      if(!iFinds || iFinds.length == 0) return undefined;

      path = path.substring(0, iFinds[iPick]);

      var nsInfo = new NamespaceInfo( path,     notations[iPick], _namespace
                                    , undefined,         version,  extension);

      if(nsInfo.path) nsInfoMap[_namespace] = nsInfo;

      return nsInfo;
   }


   function getNamespaceLookups(_namespace, notation)
   {
      var separator = (SEPARATOR || getSeparator());
      var notations = notation == undefined ? NOTATIONS : [notation];
      var lookups   = {};

      for(var i=notations.length; --i >= 0;)
      {
         notation             = notations[i];
         lookups[notation]    = [];
         lookups[notation][2] = separator + _namespace.replace(/\x2e/g, notation);
         lookups[notation][0] = lookups[notation][2] + notation;
         lookups[notation][1] = lookups[notation][2] + separator;
         lookups[notation][2] = lookups[notation][2] + '\x2e';
      }

      return lookups;
   }


   function getOptions()
   {
      return [ (CLOAK     ? "cloak"    : "cloakoff")
             , (DEBUG     ? "debug"    : "debugoff")
             , (LEGACY    ? "legacy"   : "legacyoff")
             , (MVC       ? "mvc"      : "mvcoff")
             , (MVC_SHARE ? "mvcshare" : "mvcshareoff")
             , (OVERRIDE  ? "override" : "overrideoff")
             , (REFRESH   ? "refresh"  : "refreshoff")
             ].join(',');
   }


   function getSeparator(mustRedefine)
   {
      if(!mustRedefine && SEPARATOR) return SEPARATOR;

      var path    = unescape(window.location.href);
      var iBSlash = path.lastIndexOf('\x5c') + 1;
      var iFSlash = path.lastIndexOf('\x2f') + 1;
      SEPARATOR   = (iBSlash > iFSlash ? '\x5c' : '\x2f');

      return SEPARATOR;
   }


   function handleImport(shortName, fullName, url, notation, version, module, owner)
   {
      if(!pendingImports.add(fullName, shortName))
         return module;

      addDependence(fullName, (shortName == '*' ? fullName : shortName));
      addUsage(fullName);

      if(shortName == '*')
         ((shortName = LOADED)
         , log('...\t:: Import ("'+ fullName +'.*")', arguments))

      else if(shortName == fullName)
         log('...\t:: Include ("'+shortName+'")', arguments);
      else
         log('...\t:: ImportAs ("'+shortName+'", "'+ fullName +'")', arguments);

      url = handleImport$formatURL(shortName, fullName, url, notation, version);
      
      var isLoading = Load( url
                          , getContainer((owner || window || this))
                          , 'ImportAs("'+ shortName +'", "'+ fullName +'");'
                          , false
                          , fullName);

      if(isLoading)
        (new ImportThread(fullName)).start();

      return module;
   }
   
   
   function handleImport$formatURL(shortName, fullName, url, notation, version)
   {
      var _parentNsID  = fullName + (shortName == '*' ? '.*' : '');
      var prevParentNs = _parentNsID;
      var nsInfo;

      do
      {
         if((_parentNsID = RE_PARENT_NAMESPACE.exec(_parentNsID)))
            _parentNsID = _parentNsID[1];
         else break;

         if(_parentNsID == prevParentNs) break;

         prevParentNs = _parentNsID;
         nsInfo       = getNamespaceInfo(_parentNsID);

      }while(!nsInfo);

      if(!isString(url))
         url = (         nsInfo      !=  undefined
               &&        nsInfo      !=  null
               && typeof nsInfo.path != "undefined")
             ? nsInfo.path
             : (INFO.path || '');

      if(url.lastIndexOf('\x2f') != (url.length - 1)) url += '\x2f';

      if(LEGACY) //Backwards compatibility for JSPackaging & Ajile 0.5.7-.
         if     (notation == false) notation = '\x2f';
         else if(notation == true)  notation = '\x2e';

      if(notation == null ||  undefined   ==               notation)
         notation = nsInfo ? "undefined"  == typeof nsInfo.notation
                           ? INFO.notation :        nsInfo.notation
                           : INFO.notation;

      url += escape(fullName.replace(/\x2e/g, notation));

      if(version) url += '\x2e' + version;

      url += EXTENSION;

      if(nsInfo && nsInfo.hasOption("refresh"))
         url = setRefresher(url);
         
      return url;
   }


   function handleImported(shortName, fullName, module, owner)
   {
      owner = owner || window || this;

      if(!module) return module;

      if((shortName != LOADED) && hasNamingConflict(shortName, fullName, owner))
      {
         pendingImports.remove(fullName);
         return module;
      }

      if(!isSupported(fullName, shortName))
         return undefined;

      var logMsg      = []
        , pendingName = pendingImports.get(fullName)
        , isInclude   = shortName == fullName || pendingName == fullName;

      if(shortName && shortName != LOADED && (!pendingName || (pendingName != '*' && pendingName != LOADED)))
      {
         if(isInclude)
            logMsg[0] = 'SUCCESS :: Include ("'+fullName+'")';
         else
            ((owner[shortName] = module)
            ,(logMsg[0] = 'SUCCESS :: ImportAs ("'+shortName+'", "'+fullName+'")'))

         pendingImports.remove(fullName);
         processed.add(fullName, shortName);
      }

      else if(pendingName == '*')
         handleImported$Wild(shortName, fullName, module, owner, isInclude, logMsg);

      else if(pendingName != '*' && (pendingName == LOADED || shortName == LOADED))
      {
         logMsg[0] = "SUCCESS :: "
                   + (isInclude ? "Include" : "Import")
                   + ' ("' + fullName + '.*")';

         pendingImports.remove(fullName);
         processed.add(fullName, '*');
      }

      if(logMsg.length > 0)
         log(logMsg.join("\r\n"), arguments);

      notifyImportListeners(fullName);
      return module;
   }

   
   function handleImported$Wild(shortName, fullName, module, owner, isInclude, logMsg)
   {
      logMsg[logMsg.length] = " ";

      if(!isInclude)
      {
         var $fullName;

         for(var member in module)
         {
            if(typeof Object.prototype[member] != "undefined")
               continue;

            $fullName = fullName + '.' + member;

            if(nsInfoMap[$fullName] || hasNamingConflict(member, $fullName, owner))
               continue;

            owner[member] = module[member];
            logMsg[logMsg.length] = 'SUCCESS :: ImportAs ("'+member+'", "'+$fullName+'")';
         }
      }

      pendingImports.remove(fullName);

      if(shortName != LOADED)
         pendingImports.add(fullName, LOADED);
   }


   function hasNamingConflict(shortName, fullName, owner)
   {
      owner = owner || window || this;

      if(  OVERRIDE
        || (fullName == shortName && !GetModule(shortName)) 
        || (typeof owner[shortName] == "undefined")
        || (GetModule(fullName) == owner[shortName]))
         return false;

      var msg = "\nWARNING: There is a naming conflict, " + shortName
              + " already exists.\nConsider using the override load-time option"
              + ", "+ALIAS+".EnableOverride(),\nor ImportAs with an alias; for "
              + 'example:\n\n\tImportAs ("'+ shortName +'1", "'+ fullName +'");';
              
      if(shortName == fullName)
         msg += "\n\nThe module is currently inaccessible.\n";
      else
         msg += "\n\nThe module can currently be accessed using its "
             +  "fully-qualified name:\n\n\t"+ fullName +".\n";
         
      log(msg, arguments, DEBUG);

      return true;
   }

   
   function $ieCC(cc)
   {
      return (new Function("return /*@cc_on @if(@_jscript)"+ cc +"@end @*/;"))();
   }


   function Import(fullName, url, notation, owner)
   {
      return ImportAs (undefined, fullName, url, notation, owner);
   }


   function ImportAs(shortName, fullName, url, notation, owner)
   {
      ensureFailSafe();

      if(!fullName || fullName == "*")
      {
         log('ERROR :: ImportAs ("'+ shortName +'", "'+ fullName +'")');
         return undefined;
      }

      var importInfo, version;

      if(!isString(shortName)) shortName = '';

      if((importInfo = getImportInfo(shortName, fullName)))
      {
         fullName  = importInfo[1];
         shortName = (shortName != LOADED) ? importInfo[0] : LOADED;
         version   = importInfo[2];
      }
      else if(!shortName)
         shortName = fullName.substring(fullName.lastIndexOf('\x2e') + 1);

      owner = owner || window || this;

      if(shortName == '*')
         fullName = RE_PARENT_NAMESPACE.exec(fullName)[1];

      else if(typeof owner[shortName] != "undefined" && shortName != fullName)
         for(var sys=(LEGACY ? TYPES.concat(TYPES_OLD) : TYPES), t=sys.length; --t >= 0;)
         {
            if(shortName != sys[t]) continue;

            log('ERROR :: ImportAs ("'+ shortName +'", "'+ fullName +'")! '
               + shortName +" is restricted.", arguments);

            return owner[shortName];
         }

      var module      = owner;
      var _parentNsID = '';

      for(var nsParts=fullName.split('\x2e'), i=0, j=nsParts.length; i < j; i++)
         if(typeof module[nsParts[i]] != "undefined")
         {
            module       = module[nsParts[i]];
            _parentNsID += nsParts[i] + '\x2e';
         }
         else break;

      if((i >= j && shortName != '*'))
      {
         if(pendingImports.has(fullName) || !processed.has(fullName))
         {
            module = handleImported(shortName, fullName, module, owner);
            updateDependents(fullName);
         }

         return module;
      }

      if(pendingImports.has(fullName))
      {
         if(shortName == '*' || shortName == LOADED)
            shortName = fullName;

         addDependence(fullName, shortName);
         addUsage(fullName);
         return undefined;
      }

      return handleImport(shortName, fullName, url, notation, version, module, owner);
   }


   function ImportThread(fullName, ttl, maxCheckCount)
   {
      var terminatorID
        , threadID
        , timesChecked = 0;

      function $ImportThread(THIS)
      {
         maxCheckCount = maxCheckCount || 500;
         THIS.start    = start;
         THIS.stop     = stop;
         terminatorID  = window.setInterval(stop, (ttl = (ttl || 60000)));

         return THIS;
      }

      function start()
      {
         if(timesChecked >= maxCheckCount)
         {
            stop();return;
         }

         if(GetModule(fullName))
            completeImports();
         else
            threadID = window.setTimeout(start, 0);
      }

      function stop()
      {
         if(undefined != threadID)
            window.clearTimeout(threadID);

         if(undefined != terminatorID)
            window.clearInterval(terminatorID);
      }

      if(this.constructor != ImportThread)
         if(!this.constructor || this.constructor.toString() != ImportThread.toString())
            return new ImportThread(fullName, ttl, maxCheckCount);

      return $ImportThread(this);
   }


   function Include(fullName, url, notation, owner)
   {
      if(fullName)
         fullName = fullName.split(".*").join("");

      return ImportAs (fullName, fullName, url, notation, owner);
   }


   function isFunction(funkshun)
   {
      return ((       funkshun !=  undefined  && funkshun != null)
          &&  (typeof funkshun == "function"  || Function == funkshun.constructor));
   }


   function isIncompatible()
   {
      if(typeof document == "undefined")
         return false;

      var isSimple =  "undefined" != typeof document.write
                   && "undefined" != typeof document.writeln;

      isDOM        =  isSimple
                   && "undefined" != typeof document.createElement;

      isDOM05      =  isDOM
                   && "undefined" != typeof document.createTextNode
                   && "undefined" != typeof document.getElementsByTagName
                   && "undefined" != typeof (HEAD = document.getElementsByTagName("head")[0]).appendChild
                   && "undefined" != typeof HEAD.removeChild;

      isDOM1       =  isDOM05
                   && "undefined" != typeof document.firstChild
                   && "undefined" != typeof document.lastChild
                   && "undefined" != typeof document.parentNode;

      isDOM2       =  isDOM1
                   && "undefined" != typeof document.ownerDocument;

//**/    alert("LOADER: "+getMainLoader(document)+"\n\nisSimple: "+isSimple+"\nisDOM: "+isDOM+"\nisDOM05: "+isDOM05+"\nisDOM1: "+isDOM1+"\nisDOM2: "+isDOM2);

      return !(isSimple || isDOM || isDOM05 || isDOM1 || isDOM2);
   }


   function isString(obj)
   {
      return    obj             !=  null
          &&    obj             !=  undefined
          && (  typeof obj      == "string"
             || obj.constructor ==  String);
   }


   function isSupported(fullName, shortName)
   {
      var isCurrentModule = (fullName == currentModuleName);
      var isPending       = pendingImports.has(fullName);
      var supporters      = dependence.get(fullName);

      function isInlineImportReady()
      {
         if(isCurrentModule || isSupported(currentModuleName) || isPending)
            return true;

         pendingImports.add(fullName, shortName);
         (new ImportThread(fullName)).start();
         return false;
      }

      if(!supporters || !(supporters = supporters.getAll()))
         return isInlineImportReady();

      for(var supporter in supporters)
         if("undefined" == typeof Object.prototype[supporter])
            if(!GetModule(supporters[supporter]))
               return false;

      return isInlineImportReady();
   }


   function Load(url, container, code, defer, title, type, language)
   {
      ensureFailSafe();

      if(!(container = getContainer(container)))
      {
         log("ERROR :: Container not found. Unable to load:\n\n[" + url + "]", arguments);
         return false;
      }

      if(url)
      {
         modulePaths.add(unescape(url));
         if(REFRESH) url = setRefresher(url);
      }

      if(!(type || language))
      {
         language = "JavaScript";
         type     = "text/javascript";
      }

      if(defer == undefined) defer = false;

      var script;
      
      if(isDOM && !isICab)
         script = container.createElement("script");

      if(!script)
      {
         if(code) code = "window.setTimeout('"+code+"',0);";
         LoadSimple(url, container, code, defer, title, type, language);
         return false;
      }

      if(defer)    script.defer    = defer;
      if(language) script.language = language;
      if(title)    script.title    = title;
      if(type)     script.type     = type;

      if(url)
      {
         log("...\t:: Load [ " + url + " ]", arguments);

         if(isWebKit || !(isIE || isOpera))
            script.src = url;

         getMainLoader(container).appendChild(script);

         if(!isWebKit || isIE || isOpera)
            script.src = url;

         log("DONE\t:: Load [ " + url + " ]", arguments);
      }

      if(!code) return true;

      if(url)
      {
         Load(undefined, container, code, defer, title, type, language);
         return true;
      }

      if(typeof(script.canHaveChildren) == "undefined" || script.canHaveChildren)
         script.appendChild(container.createTextNode(code));

      else if(!script.canHaveChildren)
         script.text = code;

      getMainLoader(container).appendChild(script);
      return false;
   }


   function loadController()
   {
      if(!(MVC || MVC_SHARE)) return;

      if(MVC_SHARE)
         Load(INFO.path + CONTROLLER + EXTENSION, null, null, null, CONTROLLER);

      if(!MVC) return;

      var name = unescape(window.location.pathname);
      var iEnd = name.lastIndexOf(SEPARATOR);
      name     = name.substring(++iEnd);
      iEnd     = name.lastIndexOf('\x2e');
      iEnd     = (iEnd == -1) ? 0 : iEnd;

      if("" != (name = name.substring(0, iEnd)))
         CONTROLLER = name;

      Load(CONTROLLER + EXTENSION, null, null, null, CONTROLLER);
   }


   function loadOptions(path)
   {
      if(!path || !isString(path)) return;

      var iQuery = path.lastIndexOf("?") + 1;
            path = path.substring(iQuery).toLowerCase();

      if(path.length == 0) return;

      var option;

      if((option = RE_OPT_CLOAK.exec(path)))
         CLOAK = option[1] == "cloak";

      if((option = RE_OPT_DEBUG.exec(path)))
         DEBUG = option[1] == "debug";

      if((option = RE_OPT_LEGACY.exec(path)))
         SetLegacy(option[1] == "legacy");

      if((option = RE_OPT_MVC.exec(path)))
         MVC = option[1] == "mvc";

      if((option = RE_OPT_MVC_SHARE.exec(path)))
         MVC_SHARE = option[1] == "mvcshare";

      if((option = RE_OPT_OVERRIDE.exec(path)))
         OVERRIDE = option[1] == "override";

      if((option = RE_OPT_REFRESH.exec(path)))
         REFRESH = option[1] == "refresh";
   }


   function LoadSimple(src, container, code, defer, title, type, language)
   {
      if(!(container = getContainer((container || window || this))))
         return;

      var savedCode;

      if(src)
      {
         log("...\t:: LoadSimple [ " + src + " ]", arguments);

         if(code) { savedCode = code; code = undefined; }
      }

      var scriptTag = '<'+"script"
                    + (defer   ?  ' defer="defer"'                  : '')
                    + (language? (' language="'  + language + '"')  : '')
                    + (title   ? (' title="'     + title    + '"')  : '')
                    + (type    ? (' type="'      + type     + '"')  : '')
                    + (src     ? (' src="'       + src      + '">') : '>')
                    + (code    ? (code                      + ';')  : '')
                    + "<\/script>\n";

      container.write(scriptTag);

      if(src)
         log("DONE\t:: LoadSimple [ " + src + " ]", arguments);

      if(!(code = code || savedCode)) return;

      if(src)
         LoadSimple(undefined, container, code, defer, title, type, language);
   }


   function log(message, _caller, showLog)
   {
      if(!DEBUG && !showLog) return;

      var name     = (/function\s*([^(]*)\s*\(/).exec(_caller.callee) || ['']
        , calledBy = name.length > 1 ? name[1] : name[0];

      if(message != undefined)
      {
         var _LOG = LOG;
         var now  = new Date();
         LOG      = [now.getFullYear(), now.getMonth()+1, now.getDate()].join('.') + ','
                  + [now.getHours(),    now.getMinutes(), now.getSeconds(), now.getMilliseconds()].join(':') + "\t:: "
                  + currentModuleName + " :: "
                  + calledBy          + "\r\n"
                  + message           + "\r\n\r\n"
                  ;

         var state = LOG.indexOf("ERROR") >= 0 ? "error"
                   : LOG.indexOf("WARN")  >= 0 ? "warn"
                   : "info";

         !log.is ? log.is = { Firebug : (typeof console  != "undefined" && isFunction(console.info))
                            , MochiKit: (typeof MochiKit != "undefined" && isFunction(MochiKit.log))
                            , YAHOO   : (typeof YAHOO    != "undefined" && isFunction(YAHOO.log))
                            }:0;

         log.is.Firebug  && console[state](LOG);
         log.is.YAHOO    && YAHOO.log(LOG, state);
         log.is.MochiKit && ( state == "info"  ? MochiKit.log       (LOG)
                            : state == "error" ? MochiKit.logError  (LOG)
                            : state == "warn"  ? MochiKit.logWarning(LOG)
                            : 0);

         LOG += _LOG;
      }

      if(showLog) ShowLog();
   }


   function logImportCheck(shortName, fullName, params)
   {
      var logMsg = (shortName == '*' || shortName == LOADED)
                 ? ('Import   ("'+ fullName  +'.*")')
                 : (shortName == fullName)
                 ? ('Include  ("'+ fullName  +'")')
                 : ('ImportAs ("'+ shortName +'", "'+ fullName +'")');

      log(("CHECKING :: "+ logMsg +"..."), params);
   }


   function Namespace(_namespace, path, notation, owner)
   {
      ensureFailSafe();

      _namespace = _namespace || "\x3cdefault\x3e";

      log('Namespace ("' + _namespace + '")', arguments);

      var script = owner || window || this;

      if(_namespace == "\x3cdefault\x3e")
      {
         INFO.update(path, notation);
         log(INFO, arguments);
         return script;
      }

      detectCurrentModule(_namespace);

      var nsParts = _namespace.split('\x2e');
      for(var i=0, j=nsParts.length; i < j; i++)
         script = typeof script[nsParts[i]] != "undefined"
                ?  script[nsParts[i]]
                : (script[nsParts[i]] = {});

      var nsInfo = nsInfoMap[_namespace];

      if(nsInfo)
      {
         nsInfo.update(path, notation);
         log(nsInfo, arguments);
         return script;
      }

      if(!path)
         nsInfo = getNamespaceInfo(_namespace, notation);

      if(path || !nsInfo)
         nsInfo = new NamespaceInfo(path, notation, _namespace);

      if(nsInfo && !nsInfoMap[_namespace])
         nsInfoMap[_namespace] = nsInfo;

      log(nsInfo, arguments);

      return script;
   }


   function NamespaceInfo(path, notation, fullName, shortName, version, extension, options)
   {
      function $NamespaceInfo(THIS)
      {
         handleArguments();

         THIS.hasOption = hasOption;
         THIS.toString  = toString;
         THIS.update    = update;

         THIS.update(path, notation, fullName, shortName, version, extension, options);

         return THIS;
      }

      function handleArguments()
      {
         if(!(path && path.constructor == NamespaceInfo))
            return;

         var ns    = path;
         extension = ns.extension;
         fullName  = ns.fullName;
         notation  = ns.notation;
         options   = ns.options;
         path      = ns.path;
         shortName = ns.shortName;
         version   = ns.version;
      }

      function hasOption(optionName)
      {
         options = options || this.options;

         if(!(options && optionName && (options.indexOf(optionName) >= 0)))
            return false;

         var option = (new RegExp(optionName, 'g')).exec(options);

         return option
             && (typeof option[1] != "undefined")
             && option[1] == optionName;
      }

      function toString()
      {
         return "NamespaceInfo"
            + "\r\n[ fullName: "  + this.fullName
            + "\r\n, shortName: " + this.shortName
            + "\r\n, version: "   + this.version
            + "\r\n, notation: "  + this.notation
            + "\r\n, options: "   + this.options
            + "\r\n, path: "      + this.path
            + "\r\n, uri: "       + this.uri
            + "\r\n]";
      }

      function update(path, notation, fullName, shortName, version, extension, options)
      {
         this.extension = extension || this.extension || EXTENSION;
         this.fullName  = fullName  || this.fullName  || '';
         this.shortName = shortName || this.shortName || '';

         this.notation = isString(notation)
                       ? notation
                       : (this.notation || ((INFO && isString(INFO.notation))
                                           ? INFO.notation
                                           : '\x2e'));

         this.options = isString(options)
                      ? options
                      : (this.options || getOptions());

         this.path = isString(path)
                   ? path
                   : (this.path || ((INFO && isString(INFO.path))
                                   ? INFO.path
                                   : ''));

         this.uri = this.path
                  + this.fullName.replace(/\x2e/g, this.notation);

         this.version = '' + (version || this.version || '');

         if(!this.uri) return;

         this.uri += (this.version ? ('\x2e'+ this.version) : '')
                  +   this.extension;
      }

      if(this.constructor != NamespaceInfo)
         if(!this.constructor || this.constructor.toString() != NamespaceInfo.toString())
            return new NamespaceInfo( path,     notation
                                    , fullName, shortName
                                    , version,  extension, options);

      return $NamespaceInfo(this);
   }


   function notifyImportListeners(fullName)
   {
      var listenerList = [ importListeners.get('')
                         , importListeners.get(fullName)
                         , importListeners.get(INTERNAL)
                         ];

      if(!listenerList[0] && !listenerList[1] && !listenerList[2])
         return;

      var hasListeners =  (listenerList[0] && (listenerList[0].getSize() > 0))
                       || (listenerList[1] && (listenerList[1].getSize() > 0));

      if(DEBUG && hasListeners)
         log(("NOTIFY :: Import Listeners for " + fullName + "..."), arguments);

      for(var listeners, i=listenerList.length; --i >= 0;)
      {
         if(!listenerList[i]) continue;

         listeners = listenerList[i].getAll();

         for(var id in listeners)
            if("undefined" == typeof Object.prototype[id])
               if(isFunction(listeners[id]))
                  listeners[id](fullName);
      }

      if(DEBUG && hasListeners)
         log(("NOTIFY :: Import Listeners for " + fullName + "...DONE!"), arguments);
   }


   function publishAPI()
   {
      Namespace(QNAME);

      cloakObject(window.Import    = Import);
      cloakObject(window.ImportAs  = ImportAs);
      cloakObject(window.Include   = Include);
      cloakObject(window.Load      = Load);
      cloakObject(window.Namespace = Namespace);

      cloakObject(THIS.AddImportListener    = AddImportListener);
      cloakObject(THIS.EnableLegacy         = SetLegacy);
      cloakObject(THIS.GetVersion           = function(){ return VERSION; });
      THIS.GetVersion.toString              =
      THIS.GetVersion.prototype.toString    = THIS.GetVersion;
      cloakObject(THIS.RemoveImportListener = RemoveImportListener);
      cloakObject(THIS.SetOption            = SetOption);
      cloakObject(THIS.ShowLog              = ShowLog);
      cloakObject(THIS.Unload               = $destroy);

      publishOption("Cloak");
      publishOption("Debug");
      publishOption("Override");
      publishOption("Refresh");

      SetLegacy(LEGACY || false);
   }


   function publishOption(optionName)
   {
      if(!optionName || !isString(optionName))
         return;

      cloakObject(THIS["Enable" + optionName] = function(isOnOrOff)
      {
         SetOption(optionName, isOnOrOff);
      });
   }


   function RemoveImportListener(moduleName, listener)
   {
      ensureFailSafe();

      if(!listener || !isFunction(listener))
         if(isFunction(moduleName))
         {
            listener   = moduleName;
            moduleName = undefined;
         }
         else return false;
      else
         if(moduleName && !isString(moduleName))
            return false;

      var listenerList = [ importListeners.get('')
                         , importListeners.get(moduleName)
                         , importListeners.get(INTERNAL)
                         ];

      if(!listenerList[0] && !listenerList[1] && !listenerList[2])
         return false;

      var wasRemoved = false;

      for(var listeners, i=listenerList.length; --i >= 0;)
      {
         if(!listenerList[i]) continue;

         listeners = listenerList[i].getAll();

         for(var id in listeners)
            if("undefined" == typeof Object.prototype[id])
               if(listeners[id] == listener)
               {
                  listenerList[i].remove(id);
                  wasRemoved = true;
                  break;
               }
      }

      return wasRemoved;
   }


   function setAttribution(meta)
   {
      if(!(isDOM05 && (meta = document.createElement("meta"))))
         return;

      meta.httpEquiv = ATTRIB + ALIAS + ' ' + VERSION;
      ATTRIB         = QNAME.split('\x2e').reverse().join('\x2e');
      meta.content   = ATTRIB + " :: Smart scripts that play nice ";
      getMainLoader(window.document).appendChild(meta);
   }


   function SetLegacy(turnOn)
   {
      if(turnOn == undefined)
         turnOn = true;

      LEGACY = turnOn;
      THIS   = THIS || GetModule(ALIAS) || {};

      if(turnOn)
      {
         THIS.DIR_NAMESPACE                     = THIS.USE_PATH = '\x2f';
         THIS.DOT_NAMESPACE                     = THIS.USE_NAME = '\x2e';

         cloakObject(THIS.CompleteImports       = completeImports);
         cloakObject(THIS.EnableDebugging       = THIS.EnableDebug);
         cloakObject(THIS.GetPathFor            = DEPRECATED$GetPathFor);
         cloakObject(window.JSBasePath          = window.JSPath
                                                = THIS.SetBasePath
                                                = DEPRECATED$SetBasePath);
         cloakObject(window.JSImport            = Import);
         cloakObject(window.JSLoad              = Load);
         cloakObject(window.JSPackaging         = THIS);
         cloakObject(window.JSPackage           = window.Package
                                                = Namespace);
         cloakObject(window.JSPacked            = function(n){INFO.notation = n;});
         cloakObject(window.NamespaceException  = window.PackageException
                                                = DEPRECATED$NamespaceException);
      }

      if(turnOn || typeof window["JSPackaging"] == "undefined")
         return;

      delete THIS.DIR_NAMESPACE;
      delete THIS.DOT_NAMESPACE;
      delete THIS.CompleteImports;
      delete THIS.EnableDebugging;
      delete THIS.GetPathFor;
      delete THIS.SetBasePath;
      delete THIS.USE_NAME;
      delete THIS.USE_PATH;

      destroyAPI(TYPES_OLD);
   }


   function SetOption(optionName, isOnOrOff)
   {
      ensureFailSafe();

      if(!optionName || !isString(optionName)) return;

      isOnOrOff  = isOnOrOff == undefined ? true : isOnOrOff;
      optionName = optionName.toLowerCase();

      switch(optionName)
      {
         case    "cloak": CLOAK    = isOnOrOff; break;
         case    "debug": DEBUG    = isOnOrOff; break;
         case   "legacy": SetLegacy (isOnOrOff);break;
         case "override": OVERRIDE = isOnOrOff; break;
         case  "refresh": REFRESH  = isOnOrOff; break;

         default: break;
      }
   }


   function setRefresher(url)
   {
      if((/ajile.refresh/g).test(url))
         return url;

      return url
           + ((/\?/g).test(url) ? '&' : '?')
           + "ajile.refresh="+Math.random();
   }


   function ShowLog()
   {
      ensureFailSafe();

      if(isIE && !isDOM05) return;

      if(!DEBUG)
         LOG = "\r\nTo enable debug logging, use <b>" + ALIAS + ".EnableDebug()"
             + "<\/b> from within any of your scripts or use " + ALIAS + "'s "
             + "debug load-time option as follows:<br><br>"
             + '<pre><code>&lt;script src="'+ INFO.uri +'?<b>debug<\/b>" '
             + 'type="text/javascript"&gt;&lt;\/script&gt;<\/code><\/pre>';

      var output = "<html><head><title>" + ALIAS + "'s Debug Log "
                 + (!DEBUG ? ":: DISABLED" : "") + "<\/title>\r\n"
                 + '<style type="text/css">*{background-color:#eee;color:#000;'
                 + 'font-family:"Tahoma";font-size:12px;}'
                 + "<\/style>\r\n<\/head>\r\n<body>"
                 + LOG.replace(/\r\n/g,"<br>")
                 + "<\/body><\/html>";

      var width  = screen.width  / 1.5;
      var height = screen.height / 1.5;
      var logWin = ShowLog.window
                 ? ShowLog.window
                 :(ShowLog.window
                 = window.open("","__AJILELOG__","width="+width+",height="+height
                              +",addressbar=0,directories=0,location=0,menubar=0"
                              +",scrollbars=1,statusbar=0,toolbar=0,resizable=1"));

      if(!(logWin && logWin.document)) return;
      logWin.document.open();
      logWin.document.writeln(output);
      logWin.document.close();
   }


   function SimpleSet()
   {
      var members = {}
        , size    = 0;

      function $SimpleSet(THIS)
      {
         THIS.add         = add;
         THIS.clear       = clear;
         THIS.get         = get;
         THIS.getAll      = getAll;
         THIS.getAllArray = getAllArray;
         THIS.getSize     = getSize;
         THIS.has         = has;
         THIS.remove      = remove;
         
         return THIS;
      }

      function add(key, value, mustOverride)
      {
         if(get(key) && !mustOverride) return false;

         members[key] = value;
         size++;

         return true;
      }

      function clear()
      {
         for(var key in members)
            if("undefined" == typeof Object.prototype[key])
               delete members[key];

         size = 0;
      }

      function get(key)
      {
         return (  typeof Object.prototype[key] != "undefined"
                || typeof members[key]          == "undefined")
                ?  undefined
                :  members[key];
      }

      function getAll() { return members; }

      function getAllArray()
      {
         var array = [];

         for(var item in members)
            if("undefined" == typeof Object.prototype[item])
               array[array.length] = [item, members[item]];

         return array;
      }

      function getSize() { return size; }

      function has(key)
      {
         return typeof Object.prototype[key] == "undefined"
             && typeof members[key] != "undefined";
      }

      function remove(key)
      {
         if(!has(key)) return false;

         delete members[key];
         size--;

         return true;
      }

      if(this.constructor != SimpleSet)
         if(!this.constructor || this.constructor.toString() != SimpleSet.toString())
            return new SimpleSet();

      return $SimpleSet(this);
   }


   function updateDependents(fullName)
   {
      var users = usage.get(fullName);

      if(!users) return;

      users = users.getAll();

      var module;
      for(var user in users)
         if("undefined" == typeof Object.prototype[user])
            if(pendingImports.has(user) && (module = GetModule(user)))
               if(handleImported(pendingImports.get(user), user, module))
                  updateDependents(user);
   }

   var currentModuleName =  QNAME
     , dependence        =  new SimpleSet()
     , importListeners   =  new SimpleSet()
     , isIE              =  $ieCC("@_jscript_version")
     , isICab            =  typeof ScriptEngine != "undefined"
                         && (/InScript/).test(ScriptEngine())
     , isOpera           =  (  /Opera/i).test(window.navigator.userAgent)
     , isWebKit          =  (/WebKit/i).test(window.navigator.userAgent)
     , modulePaths       =  new SimpleSet()
     , nsInfoMap         =  { clear: function()
                               {
                                  for(var moduleName in this)
                                     if("undefined" == typeof Object.prototype[moduleName])
                                        delete this[moduleName];
                               }
                            }
     , pendingImports    =  new SimpleSet()
     , processed         =  new SimpleSet()
     , usage             =  new SimpleSet();

   $create();
})("1.2.1");