//+ Nikolaus Gebhardt
// This file is part of the CopperLicht library, copyright by Nikolaus Gebhardt

// ------------------------------------------------------------------------------------------------
// ScriptingInterface
// public API implementation for CopperCube script extensions and generic JavaScript API
// ------------------------------------------------------------------------------------------------


// ------------------------------------------------------------------------------------------------
// simple vector class
// ------------------------------------------------------------------------------------------------

/**
 * @private
 */
var vector3d = function(_x, _y, _z)			
{											
	if(!(_x === null))					
	{									
		this.x = _x;					
		this.y = _y;					
		this.z = _z;					
	}									
	else								
	{									
		this.x = 0;						
		this.y = 0;						
		this.z = 0;						
	}									
}											
	
/**
 * @private
 */	
vector3d.prototype.add = function(other)	
{											
	return new vector3d( this.x+other.x, this.y+other.y, this.z+other.z);	
}													
				
/**
 * @private
 */				
vector3d.prototype.substract = function(other)	
{													
	return new vector3d( this.x-other.x, this.y-other.y, this.z-other.z);	
}															
			
/**
 * @private
 */			
vector3d.prototype.getLength = function()					
{															
	return Math.sqrt( this.x*this.x + this.y*this.y + this.z*this.z );					
}															
		
/**
 * @private
 */		
vector3d.prototype.normalize = function()					
{															
	var l = this.getLength();								
	if ( l != 0)											
	{													
		l = 1 / l;										
		this.x *= l;									
		this.y *= l;									
		this.z *= l;									
	}													
}														
	
/**
 * @private
 */ 
vector3d.prototype.toString = function()			
{													
	return "(" + this.x + ", " + this.y + ", " + this.z + ")";	
}		

/**
 * X coordinate of the vector
 * @private
 * @type Number
 */
vector3d.prototype.x = 0;

/**
 * Y coordinate of the vector
 * @private
 * @type Number 
 */
vector3d.prototype.y = 0;

/**
 * Z coordinate of the vector
 * @private
 * @type Number
 */
vector3d.prototype.z = 0;							

// ------------------------------------------------------------------------------------------------
// ScriptingInterface class
// ------------------------------------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
CL3D.ScriptingInterface = function()
{
	this.nUniqueCounterID = -1;
	this.StoredExtensionScriptActionHandlers = new Array();
	this.IsInDrawCallback = false;
	this.CurrentlyActiveScene = null;
	this.CurrentlyRunningExtensionScriptAnimator = null;
	this.TheTextureManager = null;
	this.TheRenderer = null;
	this.Engine = null;
	this.ccbRegisteredFunctionArray = new Array();
	this.ccbRegisteredHTTPCallbackArray = new Array();
	this.LastHTTPRequestId = 0;
	
	// shader callback stuff
	this.ShaderCallBackSet = false;
	this.OriginalShaderCallBack = null;
	this.ShaderCallbacks = new Object();
	this.CurrentShaderMaterialType = 0;
			
	//this.registerScriptingFunctions();
}

CL3D.gScriptingInterface = null;

/**
 * @private
 */
CL3D.ScriptingInterface.getScriptingInterface = function()
{
	if (CL3D.gScriptingInterface == null)
		CL3D.gScriptingInterface = new CL3D.ScriptingInterface();
		
	return CL3D.gScriptingInterface;
}

/**
 * @private
 */
CL3D.ScriptingInterface.getScriptingInterfaceReadOnly = function()
{
	return CL3D.gScriptingInterface;
}

/**
 * @private
 */
CL3D.ScriptingInterface.prototype.setTextureManager = function(t)
{
	this.TheTextureManager = t;
}


/**
 * @private
 */
CL3D.ScriptingInterface.prototype.setEngine = function(t)
{
	this.Engine = t;
}

/**
 * @private
 */
CL3D.ScriptingInterface.prototype.needsRedraw = function()
{
	return this.ccbRegisteredFunctionArray.length != 0;
}

/**
 * @private
 */
CL3D.ScriptingInterface.prototype.setCurrentlyRunningExtensionScriptAnimator = function(s)
{
	this.CurrentlyRunningExtensionScriptAnimator = s;
}

/**
 * @private
 */
CL3D.ScriptingInterface.prototype.setActiveScene = function(s)
{
	this.CurrentlyActiveScene = s;
}

/**
 * @private
 */
CL3D.ScriptingInterface.prototype.executeCode = function(code)
{
	try
	{
		eval(code);
	}
	catch(err)
	{
		CL3D.gCCDebugOutput.jsConsolePrint(err);
	}
}

/**
 * @private
 */
CL3D.ScriptingInterface.prototype.getUniqueCounterID = function()
{
	++this.nUniqueCounterID;
	return this.nUniqueCounterID;
}

/**
 * @private
 */
CL3D.ScriptingInterface.prototype.registerExtensionScriptActionHandler = function(handler)
{
	for (var i=0; i<this.StoredExtensionScriptActionHandlers.length; ++i)
	{
		var a = this.StoredExtensionScriptActionHandlers[i];
		if (a === handler)
			return i;
	}
	
	this.StoredExtensionScriptActionHandlers.push(handler);
	
	return this.StoredExtensionScriptActionHandlers.length -1;
}


/**
 * @private
 */
CL3D.ScriptingInterface.prototype.runDrawCallbacks = function(theRenderer)
{
	this.IsInDrawCallback = true;
			
	if (this.ccbRegisteredFunctionArray.length != null)
	{
		this.TheRenderer = theRenderer;
		
		for (var i=0; i<this.ccbRegisteredFunctionArray.length; ++i)
			this.ccbRegisteredFunctionArray[i](); 
		
		this.TheRenderer = null;
	}

	this.IsInDrawCallback = false;
}


/**
 * @private
 */
CL3D.ScriptingInterface.prototype.setSceneNodePropertyFromOverlay = function(overlaynode, propName, arg0, argsAsColor)
{
	switch(propName)
	{
	case 'Position Mode': //    <- relative (percent) | absolute (pixels)
		overlaynode.SizeModeIsAbsolute = (arg0 == 'absolute (pixels)');
		break;
	case 'Pos X (percent)':
		overlaynode.PosRelativeX = arg0 / 100.0; break;
	case 'Pos Y (percent)':
		overlaynode.PosRelativeY = arg0 / 100.0; break;
	case 'Width (percent)':
		overlaynode.SizeAbsoluteWidth = arg0; break;
	case 'Height (percent)':
		overlaynode.SizeAbsoluteHeight = arg0; break;
	case 'Pos X (pixels)':
		overlaynode.PosAbsoluteX = arg0; break;
	case 'Pos Y (pixels)':
		overlaynode.PosAbsoluteY = arg0; break;
	case 'Width (pixels)':
		overlaynode.SizeRelativeWidth = arg0 / 100.0; break;
	case 'Height (pixels)':
		overlaynode.SizeRelativeHeight = arg0 / 100.0; break;
	case 'Alpha':
		overlaynode.BackGroundColor = ((arg0 & 0xff)<<24) | (overlaynode.BackGroundColor & 0x00ffffff);
		break;
	case 'Image':
		{
			var tex = this.TheTextureManager.getTextureFromName(arg0);
			overlaynode.Texture = tex;
		}
		break;
	case 'Background Color':
		overlaynode.BackGroundColor = argsAsColor;
		break;
	case 'Draw Text': // (true/false)
		overlaynode.DrawText = arg0 ? true : false;
		break;
	case 'TextColor':
		overlaynode.TextColor = argsAsColor; 
		break;
	case 'Text':
		overlaynode.Text = arg0;
		break;
	}
}

/**
 * @private
 */
CL3D.ScriptingInterface.prototype.getSceneNodePropertyFromOverlay = function(overlaynode, propName)
{
	switch(propName)
	{
	case 'Position Mode': //    <- relative (percent) | absolute (pixels)
		return overlaynode.SizeModeIsAbsolute;
	case 'Pos X (percent)':
		return overlaynode.PosRelativeX * 100.0;
	case 'Pos Y (percent)':
		return overlaynode.PosRelativeY * 100.0;
	case 'Width (percent)':
		return overlaynode.SizeAbsoluteWidth ;
	case 'Height (percent)':
		return overlaynode.SizeAbsoluteHeight;
	case 'Pos X (pixels)':
		return overlaynode.PosAbsoluteX;
	case 'Pos Y (pixels)':
		return overlaynode.PosAbsoluteY;
	case 'Width (pixels)':
		return overlaynode.SizeRelativeWidth * 100.0;
	case 'Height (pixels)':
		return overlaynode.SizeRelativeHeight * 100.0;
	case 'Alpha':
		return CL3D.getAlpha(overlaynode.BackGroundColor);
	case 'Image':
		return overlaynode.Texture ? overlaynode.Texture.Name : null;
	case 'Background Color':
		return overlaynode.BackGroundColor;
	case 'Draw Text': // (true/false)
		return overlaynode.DrawText;
	case 'TextColor':
		return overlaynode.TextColor;
	case 'Text':
		return overlaynode.Text;
	}
	
	return null;
}

// --------------------------------------------------------------
// AnimatorExtensionScript
// --------------------------------------------------------------

/**
 * @private
 */
CL3D.AnimatorExtensionScript = function(scenemanager)
{
	this.JsClassName = null;
	this.Properties = new Array();
	this.bAcceptsMouseEvents = false;
	this.bAcceptsKeyboardEvents = false;
	this.ScriptIndex = -1;
	this.bIsAttachedToCamera = false;
	this.SMGr = scenemanager;
}		
CL3D.AnimatorExtensionScript.prototype = new CL3D.Animator();

/** 
 * @private
 */
CL3D.AnimatorExtensionScript.prototype.setAcceptsEvents = function(bForMouse, bForKeyboard)
{
	this.bAcceptsMouseEvents = bForMouse;
	this.bAcceptsKeyboardEvents = bForKeyboard;
				
	if (!this.bIsAttachedToCamera && this.SMGr)
	{
		var engine = CL3D.ScriptingInterface.getScriptingInterface().Engine;	
		if (bForKeyboard)
		{
			engine.registerAnimatorForKeyUp(this);
			engine.registerAnimatorForKeyDown(this);
		}
		
		this.SMGr.registerSceneNodeAnimatorForEvents(this);
	}
}

/** 
 * @private
 */
CL3D.AnimatorExtensionScript.prototype.getType = function()
{
	return 'extensionscript';
}

/** 
 * @private
 */
CL3D.AnimatorExtensionScript.prototype.createClone = function(node, newManager, oldNodeId, newNodeId)
{
	var a = new CL3D.AnimatorExtensionScript(newManager);
	
	a.JsClassName = this.JsClassName;
			
	for (var i=0; i<this.Properties.length; ++i)
	{
		var prop = this.Properties[i];
		
		if (prop != null)
			a.Properties.push(prop.createClone(oldNodeId, newNodeId));
		else
			a.Properties.push(null);
	}			
				
	return a;
}

/** 
 * @private
 */
CL3D.AnimatorExtensionScript.prototype.animateNode = function(n, timeMs)
{
	if (n == null)
		return false;
		
	if (this.JsClassName == null || this.JsClassName.length == 0)
		return false;
		
	var engine = CL3D.ScriptingInterface.getScriptingInterface();
		
	engine.setCurrentlyRunningExtensionScriptAnimator(this);
	
	if (this.ScriptIndex == -1)
		this.initScript(n, engine);		
	
	if (this.ScriptIndex != -1)
	{
		// run script like this:
		// _ccbScriptCache[0].onAnimate(ccbGetSceneNodeFromId(thescenenodeid), timeMs);

		try 
		{  
			// _ccbScriptCache[this.ScriptIndex].onAnimate( n, timeMs );
			_ccbScriptCache[this.ScriptIndex]['onAnimate']( n, timeMs ); // <-- closure working function call (won't get obfuscated)
		}
		catch ( e )
		{
			CL3D.gCCDebugOutput.jsConsolePrint(this.JsClassName + ": " + e);
		}
	}
	
	engine.setCurrentlyRunningExtensionScriptAnimator(null);

	return true;
}

/** 
 * @private
 */
CL3D.AnimatorExtensionScript.prototype.initScript = function(n, engine)
{
	var executeCode = "";
	
	// need to initialize script

	// call something to register in global scriptCache:
	// if (typeof _ccbScriptCache == 'undefined') _ccbScriptCache = new Array();
	// _ccbScriptCache[0] = new behavior_MoveForward();
	
	this.ScriptIndex = engine.getUniqueCounterID();				
	
	executeCode += "if (typeof _ccbScriptCache == 'undefined') _ccbScriptCache = new Array(); ";
	executeCode += "_ccbScriptCache[";
	executeCode += this.ScriptIndex;					
	executeCode += "] = new ";
	executeCode += this.JsClassName;
	executeCode += "();";
	
	engine.executeCode(executeCode);
	
	// also, we need to init the instance with the properties the user set for this extension
	// like here:
	// _ccbScriptCache[0].PropName = 23;

	var objPrefix = "_ccbScriptCache[";
	objPrefix += this.ScriptIndex;					
	objPrefix += "].";

	executeCode = "try {";
	executeCode += CL3D.ExtensionScriptProperty.generateInitJavaScriptCode(objPrefix, this.Properties);
	executeCode += "} catch(e) { }";

	engine.executeCode(executeCode);	

	// and lastly, we need to register for getting events if the script has this feature

	var bNodeIsCamera = false;
	
	var fcam = null;
	if (n.getType() == 'camera')
	{
		fcam = n;
		bNodeIsCamera = true;
	}

	this.bIsAttachedToCamera = bNodeIsCamera;	

	// call something like
	// try { 
	//   ccbRegisterBehaviorEventReceiver(typeof _ccbScriptCache[0].onMouseEvent != 'undefined',
	//          typeof _ccbScriptCache[0].onKeyEvent != 'undefined'); 
	// } catch(e) {}
	
	executeCode = "try { ccbRegisterBehaviorEventReceiver(typeof ";
	executeCode += objPrefix;
	executeCode += "onMouseEvent != 'undefined', typeof ";
	executeCode += objPrefix;
	executeCode += "onKeyEvent != 'undefined'); } catch(e) { }";

	engine.executeCode(executeCode);		
}

/**
 * @private
 */
CL3D.AnimatorExtensionScript.prototype.sendMouseEvent = function(mouseEvtId, wheelDelta) 
{		
	if (this.bAcceptsMouseEvents)
		// the following line would work, but not with the closure compiler
		//_ccbScriptCache[this.ScriptIndex].onMouseEvent(mouseEvtId);	
		//CL3D.ScriptingInterface.getScriptingInterface().executeCode('_ccbScriptCache[' + this.ScriptIndex + '].onMouseEvent(' + mouseEvtId + ');');
		_ccbScriptCache[this.ScriptIndex]['onMouseEvent'](mouseEvtId, wheelDelta); // <-- closure working function call (won't get obfuscated)
}

/**
 * @private
 */
CL3D.AnimatorExtensionScript.prototype.sendKeyEvent = function(keycode, pressed) 
{		
	if (this.bAcceptsKeyboardEvents)
		// the following line would work, but not with the closure compiler
		//_ccbScriptCache[this.ScriptIndex].onKeyEvent(keycode, pressed);
		//CL3D.ScriptingInterface.getScriptingInterface().executeCode('_ccbScriptCache[' + this.ScriptIndex + '].onKeyEvent(' + keycode + ',' + pressed + ');');
		_ccbScriptCache[this.ScriptIndex]['onKeyEvent'](keycode, pressed); // <-- closure working function call (won't get obfuscated)		
}

/**
 * @private
 */
CL3D.AnimatorExtensionScript.prototype.onMouseUp = function(event) 
{		
	var wasRightButton = false; 
	if (event && event.button == 2) //2: Secondary button pressed, usually the right button
		wasRightButton = true;
		
	this.sendMouseEvent(wasRightButton ? 4 : 2, 0);
}


/**
 * @private
 */
CL3D.AnimatorExtensionScript.prototype.onMouseWheel = function(delta) 
{		
	this.sendMouseEvent(1, delta);
}


/**
 * @private
 */
CL3D.AnimatorExtensionScript.prototype.onMouseDown = function(event) 
{		
	var wasRightButton = false; 
	if (event && event.button == 2) //2: Secondary button pressed, usually the right button
		wasRightButton = true;
		
	this.sendMouseEvent(wasRightButton ? 5 : 3, 0);
}


/**
 * @private
 */
CL3D.AnimatorExtensionScript.prototype.onMouseMove = function(event) 
{		
	this.sendMouseEvent(0, 0);
}

/**
 * @private
 */
CL3D.AnimatorExtensionScript.prototype.onKeyDown = function(evt) 
{		
	this.sendKeyEvent(evt.keyCode, true);
}

/**
 * @private
 */
CL3D.AnimatorExtensionScript.prototype.onKeyUp = function(evt) 
{		
	this.sendKeyEvent(evt.keyCode, false);
}

// --------------------------------------------------------------
// ExtensionScriptProperty
// --------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
CL3D.ExtensionScriptProperty = function()
{
	this.Type = -1;
	this.Name = null;
		
	this.StringValue = null;
	this.VectorValue = null;
	this.FloatValue = 0.0;
	this.IntValue = 0;
	this.ActionHandlerValue = null;
	this.TextureValue = null;
}

/**
 * @private
 */
CL3D.ExtensionScriptProperty.prototype.createClone = function(oldNodeId, newNodeId)
{
	var c = new CL3D.ExtensionScriptProperty();
			
	c.Type = this.Type;
	c.Name = this.Name;
	
	c.StringValue = this.StringValue;
	c.VectorValue = this.VectorValue ? this.VectorValue.clone() : null;
	c.FloatValue = this.FloatValue;
	c.IntValue = this.IntValue;
	
	if (this.ActionHandlerValue)
		c.ActionHandlerValue = this.ActionHandlerValue.createClone(oldNodeId, newNodeId);
		
	c.TextureValue = this.TextureValue;
	
	return c;
}

/**
 * @private
 */
CL3D.ExtensionScriptProperty.stringReplace = function( source, find, replacement ) 
{
	return source.split(find).join(replacement);
}

/**
 * @private
 */
CL3D.ExtensionScriptProperty.generateInitJavaScriptCode = function(objPrefix, properties)
{
	var executeCode = "";

	for (var i=0; i<properties.length; ++i)
	{
		var prop = properties[i];
		if (prop == null)
			continue;

		executeCode += objPrefix;
		executeCode += prop.Name;
		executeCode += " = ";

		switch(prop.Type)
		{
		case 1: //irr::scene::EESAT_FLOAT:
			executeCode += prop.FloatValue;
			executeCode += "; ";
			break;
		case 2: //irr::scene::EESAT_STRING:
			{
				executeCode += "\"";
				var escapedString = CL3D.ExtensionScriptProperty.stringReplace(prop.StringValue, "\"", "\\\""); 
				executeCode += escapedString;
				executeCode += "\"; ";
			}
			break;
		case 3: //irr::scene::EESAT_BOOL:
			executeCode += prop.IntValue ? "true" : "false";
			executeCode += "; ";
			break;
		case 6: //irr::scene::EESAT_VECTOR3D:
			executeCode += "new vector3d(";
			executeCode += prop.VectorValue.X;
			executeCode += ", ";
			executeCode += prop.VectorValue.Y;
			executeCode += ", ";
			executeCode += prop.VectorValue.Z;
			executeCode += "); ";
			break;
		case 7: //irr::scene::EESAT_TEXTURE:
			executeCode += "\"";
			executeCode += prop.TextureValue ? prop.TextureValue.Name : "";
			executeCode += "\"; ";
			break;
		case 8: //irr::scene::EESAT_SCENE_NODE_ID:
			executeCode += "ccbGetSceneNodeFromId(";
			executeCode += prop.IntValue;
			executeCode += "); ";
			break;
		case 9: //irr::scene::EESAT_ACTION_REFERENCE:
			{
				var id = CL3D.ScriptingInterface.getScriptingInterface().registerExtensionScriptActionHandler(prop.ActionHandlerValue);
				
				executeCode += id;
				executeCode += "; ";
			}
			break;
		case 0: //irr::scene::EESAT_INT:
		case 5: //irr::scene::EESAT_COLOR:
		case 4: //irr::scene::EESAT_ENUM:
		default:
			executeCode += prop.IntValue;
			executeCode += "; ";
			break;
		}
	}

	return executeCode;
}

// --------------------------------------------------------------
// ActionExtensionScript
// --------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
CL3D.Action.ActionExtensionScript = function()
{
	this.Type = 'ExtensionScript';	
	this.Properties = new Array();
	this.JsClassName = null;
}

/**
 * @private
 */
CL3D.Action.ActionExtensionScript.prototype.createClone = function(oldNodeId, newNodeId)
{
	var a = new CL3D.Action.ActionExtensionScript();
	
	a.JsClassName = this.JsClassName;
			
	for (var i=0; i<this.Properties.length; ++i)
	{
		var prop = this.Properties[i];
		
		if (prop != null)
			a.Properties.push(prop.createClone(oldNodeId, newNodeId));
		else
			a.Properties.push(null);
	}		
	
	return a;
}

/**
 * @private
 */
CL3D.Action.ActionExtensionScript.prototype.execute = function(currentNode, sceneManager)
{
	if (this.JsClassName == null || this.JsClassName.length == 0 || currentNode == null)
		return;
		
	var engine = CL3D.ScriptingInterface.getScriptingInterface();
	var executeCode = "";
	
	// need to initialize script

	// call something to register in global scriptCache:
	// call something to register in global scriptCache:
	// _ccbScriptTmp = new action_MakeInvisible();
				
	executeCode = "_ccbScriptTmp = new ";
	executeCode += this.JsClassName;
	executeCode += "();";
		
	engine.executeCode(executeCode);
		
	// also, we need to init the instance with the properties the user set for this extension
	// like here:
	// _ccbScriptTmp.PropName = 23;

	var objPrefix = "_ccbScriptTmp.";

	executeCode = "try { ";
	executeCode += CL3D.ExtensionScriptProperty.generateInitJavaScriptCode(objPrefix, this.Properties);
	executeCode += "} catch(e) { }";

	engine.executeCode(executeCode);	

	// run script like this:
	// _ccbScriptTmp.execute(ccbGetSceneNodeFromId(currentNodeId));
	
	executeCode = "try { _ccbScriptTmp.execute(ccbGetSceneNodeFromId(";
	executeCode += currentNode.Id;
	executeCode += ")); } catch(e) { }";

	engine.executeCode(executeCode);			
}


// ============================================================================================================================
// ----------------------------------------------------------------------------------------------------------------------------
// Implementation of all the scripting functions
// ----------------------------------------------------------------------------------------------------------------------------
// ============================================================================================================================

/**
 * @ignore
 */
function ccbGetSceneNodeFromId(id)
{
	var scene = CL3D.gScriptingInterface.CurrentlyActiveScene;
	if (scene == null)
		return null;
		
	return scene.getSceneNodeFromId(id);
}

/**
 * @ignore
 */
function ccbCloneSceneNode(node)
{
	var scene = CL3D.gScriptingInterface.CurrentlyActiveScene;
	if (node == null)
		return null;
		
	var oldId = node.Id;
	var newId = scene.getUnusedSceneNodeId();						
	
	var cloned = node.createClone(node.Parent, oldId, newId);
		
	if (cloned != null)
	{
		cloned.Id = newId;
		scene.replaceAllReferencedNodes(node, cloned);
	}
		
	// also clone collision detection of the node in the world
			
	var selector = node.Selector;
	if (selector && scene)
	{
		var newSelector = selector.createClone(cloned);
		if (newSelector)
		{
			// set to node

			cloned.Selector = newSelector;

			// also, copy into world

			if (scene.getCollisionGeometry()) 
				scene.getCollisionGeometry().addSelector(newSelector);
		}
	}
		
	return cloned;
}

/**
 * @ignore
 */
function ccbGetActiveCamera()
{
	var scene = CL3D.gScriptingInterface.CurrentlyActiveScene;
	if (scene == null)
		return null;
		
	return scene.getActiveCamera();
}		

/**
 * @ignore
 */
function ccbSetActiveCamera(node)
{
	var scene = CL3D.gScriptingInterface.CurrentlyActiveScene;
	if (scene == null)
		return;
		
	if (node != null && node.getType() == 'camera')
		scene.setActiveCamera(node);
}

/**
 * @ignore
 */
function ccbGetChildSceneNode(node, childidx)
{
	if (node == null)
		return -1;
		
	if (childidx < 0 || childidx >= node.Children.length)
		return null;

	return node.Children[childidx];
}		

/**
 * @ignore
 */
function ccbGetRootSceneNode()
{
	var scene = CL3D.gScriptingInterface.CurrentlyActiveScene;
	if (scene == null)
		return null;
		
	return scene.getRootSceneNode();
}

/**
 * @ignore
 */
function ccbGetSceneNodeChildCount(node)
{
	if (node == null)
		return 0;
		
	return node.Children.length;
}

/**
 * @ignore
 */
function ccbGetSceneNodeFromName(n)
{
	var scene = CL3D.gScriptingInterface.CurrentlyActiveScene;
	if (scene == null)
		return null;
		
	return scene.getSceneNodeFromName(n);
}

/**
 * @ignore
 */
function ccbRemoveSceneNode(node)
{
	var scene = CL3D.gScriptingInterface.CurrentlyActiveScene;
	if (scene == null)
		return;
		
	scene.addToDeletionQueue(node, 0);
}

/**
 * @ignore
 */
function ccbSetSceneNodeParent(node, parent)
{
	if (node && parent)
		parent.addChild(node);
}

/**
 * @ignore
 */
function ccbGetSceneNodeMaterialCount(node)
{
	if (node == null)
		return 0;
		
	return node.getMaterialCount();
}

/**
 * @ignore
 */
function ccbGetSceneNodeMaterialProperty(node, matidx, propName)
{
	if (node == null)
		return null;
		
	if (matidx < 0 || matidx >= node.getMaterialCount())
		return null;
						
	var mat = node.getMaterial(matidx);
	if (mat == null)
		return null;
		
	if (propName == "Type")
	{
		switch(mat.Type)
		{
		case 0: return 'solid';
		case 2: return 'lightmap';
		case 3: return 'lightmap_add';
		case 4: return 'lightmap_m2';
		case 5: return 'lightmap_m4';
		case 11: return 'reflection_2layer';
		case 12: return 'trans_add';
		case 13: return 'trans_alphach';
		case 16: return 'trans_reflection_2layer';
		}		
	}
	else
	if (propName == "Texture1")
		return (mat.Tex1 == null) ? "" : mat.Tex1.Name;
	else
	if (propName == "Texture2")
		return (mat.Tex2 == null) ? "" : mat.Tex2.Name;
	else
	if (propName == "Lighting")
		return mat.Lighting;
	else
	if (propName == "Backfaceculling")
		return mat.Backfaceculling;
		
	return null;
}

/**
 * @ignore
 */
function ccbCleanMemory()
{
	// not implemented for WebGL
}

/**
 * @ignore
 */
function ccbSetSceneNodeMaterialProperty(node, matidx, propName, arg0, arg2, arg3)
{
	if (node == null)
		return;
		
	if (matidx < 0 || matidx >= node.getMaterialCount())
		return;
		
	var mat = node.getMaterial(matidx);
	if (mat == null)
		return;
		
	var firstParam = arg0;			
	var paramAsString = (typeof arg0 == 'string') ? arg0 : null;
	var tex = null;
	var sc = CL3D.ScriptingInterface.getScriptingInterface();

	if (propName == "Type")
	{
		if (paramAsString)
		{
			switch(paramAsString)
			{
			case 'solid': 
				mat.Type = 0; break;
			case 'lightmap': 
			case 'lightmap_add':
			case 'lightmap_m2':
			case 'lightmap_m4':
				mat.Type = 2; break;
			case 'reflection_2layer':
				mat.Type = 11; break;
			case 'trans_add':
				mat.Type = 12; break;
			case 'trans_alphach':
				mat.Type = 13; break;
			case 'trans_reflection_2layer':
				mat.Type = 16; break;
			}	
		}
		else		
		{
			// together with ccbCreateMaterial, users are setting an interger parameter sometimes
			var i = parseInt(arg0);
			if (i != NaN)
				mat.Type = i;
		}
	}
	else
	if (propName == "Texture1")
	{
		if (paramAsString != null && sc.TheTextureManager != null)
		{
			tex = sc.TheTextureManager.getTextureFromName(paramAsString);
			if (tex != null)
				mat.Tex1 = tex; 
		}
	}
	else
	if (propName == "Texture2")
	{
		if (paramAsString != null && sc.TheTextureManager != null)
		{
			tex = sc.TheTextureManager.getTextureFromName(paramAsString);
			if (tex != null)
				mat.Tex2 = tex; 
		}
	}
	else
	if (propName == "Lighting")
		mat.Lighting = firstParam;
	else
	if (propName == "Backfaceculling")
		mat.Backfaceculling = firstParam;
}

/**
 * @ignore
 */
function ccbSetSceneNodeProperty( node, propName, arg0, arg1, arg2 )
{
	if (node == null)
		return;
						
	// get vector if possible
		
	var firstParam = arg0;			
	var x = 0.0; 
	var y = 0.0; 
	var z = 0.0;
	
	var argsAsColor = 0;
	if (arg0 != null)
		argsAsColor = arg0;
	
	if (arg1 == null && firstParam != null && typeof firstParam.x != 'undefined')
	{				
		x = firstParam.x;
		y = firstParam.y;
		z = firstParam.z;
	}
	
	if (arg1 != null && arg2 != null)
	{
		x = arg0;
		y = arg1;
		z = arg2;
		
		argsAsColor = CL3D.createColor(255, Math.floor(arg0), Math.floor(arg1), Math.floor(arg2));
	}
	
	// get type
	
	var cam = null;
	var animnode = null;
	var lightnode = null;
	var overlaynode = null;
	var type = node.getType();
	
	if (type == 'camera') 
		cam = node;
	else
	if (type == 'animatedmesh') 
		animnode = node;
	else
	if (type == 'light') 
		lightnode = node;
	else
	if (type == '2doverlay') 
		overlaynode = node;
	
	// set property
	
	if (propName == "Visible")
		node.Visible = firstParam;
	else
	if (propName == "Position")
	{				
		node.Pos.X = x;
		node.Pos.Y = y;
		node.Pos.Z = z;
	}
	else
	if (propName == "Rotation")
	{				
		node.Rot.X = x;
		node.Rot.Y = y;
		node.Rot.Z = z;
	}
	else
	if (propName == "Scale")
	{				
		node.Scale.X = x;
		node.Scale.Y = y;
		node.Scale.Z = z;
	}
	else
	if (propName == "Target")
	{				
		if (cam != null)
			cam.setTarget(new CL3D.Vect3d(x,y,z));
	}
	else
	if (propName == "UpVector")
	{				
		if (cam != null)
			cam.UpVector = new CL3D.Vect3d(x,y,z);
	}
	else
	if (propName == "FieldOfView_Degrees")
	{				
		if (cam != null)
			cam.setFov(CL3D.degToRad(firstParam));
	}
	else
	if (propName == "AspectRatio")
	{				
		if (cam != null)
			cam.setAspectRatio(firstParam);
	}
	else
	if (propName == "Animation")
	{				
		if (animnode != null)
			animnode.setAnimationByEditorName(firstParam, animnode.Looping); 
	}
	else
	if (propName == "Looping")
	{				
		if (animnode != null)
			animnode.setLoopMode(firstParam);
	}
	else
	if (propName == "FramesPerSecond")
	{				
		if (animnode != null)
			animnode.setAnimationSpeed(firstParam * 0.001);
	}
	else
	if (propName == "AnimationBlending")
	{				
		if (animnode != null)
			animnode.AnimationBlendingEnabled = firstParam;
	}
	else
	if (propName == "BlendTimeMs")
	{				
		if (animnode != null)
			animnode.BlendTimeMs = firstParam;
	}
	else
	if (propName == "Radius")
	{				
		if (lightnode != null)
			lightnode.LightData.Radius = firstParam;
	}
	else
	if (propName == "Color")
	{				
		if (lightnode != null)
			lightnode.LightData.Color = CL3D.createColorF(argsAsColor);
	}
	else
	if (propName == "Direction")
	{				
		if (lightnode != null)
		{
			lightnode.LightData.Direction = new CL3D.Vect3d(x,y,z);
			lightnode.LightData.Direction.normalize();
		}
	}
	else
	if (propName == "FogColor")
	{
		CL3D.gScriptingInterface.CurrentlyActiveScene.FogColor = argsAsColor;
	}
	else
	if (propName == "Realtime Shadows" && node === ccbGetRootSceneNode())
	{
		CL3D.gScriptingInterface.CurrentlyActiveScene.ShadowMappingEnabled = arg0 == true;
	}
	else
	if (propName == "BackgroundColor" && node === ccbGetRootSceneNode())
	{
		CL3D.gScriptingInterface.CurrentlyActiveScene.BackgroundColor = argsAsColor;
	}
	else
	if (propName == "AmbientLight")
	{
		CL3D.gScriptingInterface.CurrentlyActiveScene.AmbientLight =  CL3D.createColorF(argsAsColor);
	}
	else
	if (propName == "Bloom")
	{
		CL3D.gScriptingInterface.CurrentlyActiveScene.PostEffectData[CL3D.Scene.EPOSTEFFECT_BLOOM].Active = arg0 == true;
	}
	else
	if (propName == "Black and White")
	{
		CL3D.gScriptingInterface.CurrentlyActiveScene.PostEffectData[CL3D.Scene.EPOSTEFFECT_BLACK_AND_WHITE].Active = arg0 == true;
	}
	else
	if (propName == "Invert")
	{
		CL3D.gScriptingInterface.CurrentlyActiveScene.PostEffectData[CL3D.Scene.EPOSTEFFECT_INVERT].Active = arg0 == true;
	}
	else
	if (propName == "Blur")
	{
		CL3D.gScriptingInterface.CurrentlyActiveScene.PostEffectData[CL3D.Scene.EPOSTEFFECT_BLUR].Active = arg0 == true;
	}
	else
	if (propName == "Colorize")
	{
		CL3D.gScriptingInterface.CurrentlyActiveScene.PostEffectData[CL3D.Scene.EPOSTEFFECT_COLORIZE].Active = arg0 == true;
	}
	else
	if (propName == "Vignette")
	{
		CL3D.gScriptingInterface.CurrentlyActiveScene.PostEffectData[CL3D.Scene.EPOSTEFFECT_VIGNETTE].Active = arg0 == true;
	}
	else
	if (propName == "Bloom_BlurIterations")
	{
		CL3D.gScriptingInterface.CurrentlyActiveScene.PE_bloomBlurIterations = firstParam >> 0;
	}
	else
	if (propName == "Bloom_Treshold")
	{
		CL3D.gScriptingInterface.CurrentlyActiveScene.PE_bloomTreshold = firstParam;
	}
	else
	if (propName == "Blur_Iterations")
	{
		CL3D.gScriptingInterface.CurrentlyActiveScene.PE_blurIterations = firstParam >> 0;
	}
	else
	if (propName == "Colorize_Color")
	{
		CL3D.gScriptingInterface.CurrentlyActiveScene.PE_colorizeColor = firstParam;
	}
	else
	if (propName == "Vignette_Intensity")
	{
		CL3D.gScriptingInterface.CurrentlyActiveScene.PE_vignetteIntensity = firstParam >> 0;
	}
	else
	if (propName == "Vignette_RadiusA")
	{
		CL3D.gScriptingInterface.CurrentlyActiveScene.PE_vignetteRadiusA = firstParam >> 0;
	}
	else
	if (propName == "Vignette_RadiusB")
	{
		CL3D.gScriptingInterface.CurrentlyActiveScene.PE_vignetteRadiusB = firstParam >> 0;
	}
	else
	if (propName == "Name")
	{
		node.Name = firstParam;
	}
	else
	if (overlaynode != null)
	{
		CL3D.ScriptingInterface.getScriptingInterface().setSceneNodePropertyFromOverlay(overlaynode, propName, arg0, argsAsColor);
	}
}

/**
 * @ignore
 */
function ccbGetSceneNodeProperty( node, propName )
{
	if (node == null)
		return null;
		
	// get type
	
	var cam = null;
	var animnode = null;
	var lightnode = null;
	var overlaynode = null;
	var type = node.getType();
	
	if (type == 'camera') 
		cam = node;
	else
	if (type == 'animatedmesh') 
		animnode = node;
	else
	if (type == 'light') 
		lightnode = node;
	else
	if (type == '2doverlay') 
		overlaynode = node;
		
	
	if (propName == "Visible")
		return node.Visible;
	else
	if (propName == "Position")
		return new vector3d(node.Pos.X, node.Pos.Y, node.Pos.Z);
	else
	if (propName == "PositionAbs")
	{
		var abspos = node.getAbsolutePosition();
		return new vector3d(abspos.X, abspos.Y, abspos.Z);
	}
	else
	if (propName == "Rotation")
		return new vector3d(node.Rot.X, node.Rot.Y, node.Rot.Z);
	else
	if (propName == "Scale")
		return new vector3d(node.Scale.X, node.Scale.Y, node.Scale.Z);
	else
	if (propName == "Target")
	{
		if (cam != null)
			return new vector3d(cam.Target.X, cam.Target.Y, cam.Target.Z);
	}
	else
	if (propName == "UpVector")
	{
		if (cam != null)
			return new vector3d(cam.UpVector.X, cam.UpVector.Y, cam.UpVector.Z);
	}
	else
	if (propName == "FieldOfView_Degrees")
	{
		if (cam != null)
			return CL3D.radToDeg(cam.Fovy);
	}
	else
	if (propName == "AspectRatio")
	{
		if (cam != null)
			return cam.Aspect;
	}
	else
	if (propName == "Animation")
		return ""; // not implemented yet
	else
	if (propName == "Looping")
	{
		if (animnode != null)
			return animnode.Looping; 
	}
	else
	if (propName == "FramesPerSecond")
	{
		if (animnode != null)
			return animnode.FramesPerSecond * 1000.0;
	}
	else
	if (propName == "AnimationBlending")
	{				
		if (animnode != null)
			return animnode.AnimationBlendingEnabled;
	}
	else
	if (propName == "BlendTimeMs")
	{				
		if (animnode != null)
			return animnode.BlendTimeMs;
	}
	else
	if (propName == "Radius")
	{
		if (lightnode != null)
			return lightnode.LightData.Radius;
	}
	else
	if (propName == "Color")
	{				
		if (lightnode != null)
			return CL3D.createColor(255, lightnode.LightData.Color.R * 255, lightnode.LightData.Color.G * 255, lightnode.LightData.Color.B * 255);
	}
	else
	if (propName == "Direction")
	{				
		if (lightnode != null)
			return lightnode.LightData.Direction;
	}
	else
	if (propName == "Name")
	{
		return node.Name;
	}
	else
	if (propName == "Type")
	{
		return node.getType();
	}
	else
	if (propName == "FogColor")
	{
		return CL3D.gScriptingInterface.CurrentlyActiveScene.FogColor;
	}
	else
	if (propName == "Realtime Shadows" && node === ccbGetRootSceneNode())
	{
		return CL3D.gScriptingInterface.CurrentlyActiveScene.ShadowMappingEnabled;
	}
	else
	if (propName == "BackgroundColor" && node === ccbGetRootSceneNode())
	{
		return CL3D.gScriptingInterface.CurrentlyActiveScene.BackgroundColor;
	}
	else
	if (overlaynode != null)
		return CL3D.ScriptingInterface.getScriptingInterface().getSceneNodePropertyFromOverlay(overlaynode, propName);
	
	return null;
}

/**
 * @ignore
 */
function ccbSetSceneNodePositionWithoutCollision(node, x, y, z)
{
	if (node == null)
		return;
		
	node.Pos.X = x;
	node.Pos.Y = y;
	node.Pos.Z = z;
		
	for (var ai=0; ai<node.Animators.length; ++ai)
	{
		var a = node.Animators[ai];
		if (a != null && a.getType() == 'collisionresponse')
			a.reset();				
	}
}

/**
 * @ignore
 */
function ccbRegisterOnFrameEvent(fobj) 
{	
	var engine = CL3D.ScriptingInterface.getScriptingInterface();
	engine.ccbRegisteredFunctionArray.push(fobj); 
}

/**
 * @ignore
 */
function ccbUnregisterOnFrameEvent(fobj) 
{	
	var engine = CL3D.ScriptingInterface.getScriptingInterface();
	var pos = engine.ccbRegisteredFunctionArray.indexOf(fobj); 
	
	if (pos == -1) 
		return; 
	
	engine.ccbRegisteredFunctionArray.splice(pos, 1); 
}

/**
 * @ignore
 */
function ccbDrawColoredRectangle(c, x, y, x2, y2)
{
	var engine = CL3D.ScriptingInterface.getScriptingInterface();
	if (!engine.IsInDrawCallback || engine.TheRenderer == null)
		return;
		
	engine.TheRenderer.draw2DRectangle(x, y, x2-x, y2-y, c, true);
}

/**
 * @ignore
 */
function ccbDrawTextureRectangle(f, x, y, x2, y2)
{
	var engine = CL3D.ScriptingInterface.getScriptingInterface();
	if (!engine.IsInDrawCallback || engine.TheRenderer == null)
		return;
		
	// TODO: implement
	engine.TheRenderer.draw2DRectangle(x, y, x2-x, y2-y, 0xff000000, true);
}

/**
 * @ignore
 */
function ccbDrawTextureRectangleWithAlpha(f, x, y, x2, y2)
{
	var engine = CL3D.ScriptingInterface.getScriptingInterface();
	if (!engine.IsInDrawCallback || engine.TheRenderer == null)
		return;
		
	// TODO: implement
	engine.TheRenderer.draw2DRectangle(x, y, x2-x, y2-y, 0xff000000, true);
}		

/**
 * @ignore
 */
function ccbGet3DPosFrom2DPos(x, y)
{
	var engine = CL3D.ScriptingInterface.getScriptingInterface().Engine;	
	var ret = engine.get3DPositionFrom2DPosition(x,y);
	
	if (ret != null )
		return new vector3d(ret.X, ret.Y, ret.Z);
		
	return null;
}

/**
 * @ignore
 */
function ccbGet2DPosFrom3DPos(x, y, z)
{
	var engine = CL3D.ScriptingInterface.getScriptingInterface().Engine;	
	var ret = engine.get2DPositionFrom3DPosition(new CL3D.Vect3d(x,y,z));
	return new vector3d(ret.X, ret.Y, 0);
	
}

/**
 * @ignore
 */
function ccbGetCollisionPointOfWorldWithLine(startX, startY, startZ,
										  endX, endY, endZ)
{
	var ray = new CL3D.Line3d();
	ray.Start = new CL3D.Vect3d(startX,startY,startZ);
	ray.End = new CL3D.Vect3d(endX,endY,endZ);			
	var scene = CL3D.gScriptingInterface.CurrentlyActiveScene;
	
	var len = CL3D.AnimatorOnClick.prototype.static_getDistanceToNearestCollisionPointWithWorld(
		scene, ray.Start, ray.End, scene.CollisionWorld, true);

	if (len < 999999999)
	{
		// shorten our ray because it collides with a world wall

		var vect2 = ray.getVector();
		vect2.setLength(len);
		var pos = ray.Start.add(vect2);
		return new vector3d(pos.X, pos.Y, pos.Z);
	}
	
	return null;
}

/**
 * @ignore
 */
function ccbDoesLineCollideWithBoundingBoxOfSceneNode(node, startX, startY, startZ,
												   endX, endY, endZ)
{
	if (node == null)
		return false;
		
	if (node.AbsoluteTransformation == null)
		return false;
		
	var lineStart = new CL3D.Vect3d(startX, startY, startZ);
	var lineEnd = new CL3D.Vect3d(endX, endY, endZ);
		
	return node.getTransformedBoundingBox().intersectsWithLine(lineStart, lineEnd);
}

/**
 * @ignore
 */
function ccbEndProgram()
{
	window.close();
}

/**
 * @ignore
 */
function ccbSetPhysicsVelocity(nodeid, x, y, z)
{
	// ignore
}


/**
 * @ignore
 */
function ccbUpdatePhysicsGeometry(nodeid, x, y, z)
{
	// ignore
}


/**
 * @ignore
 */
function ccbLoadTexture(texstring)
{
	var sc = CL3D.ScriptingInterface.getScriptingInterface();
	var tex = sc.TheTextureManager.getTexture(texstring, true); // start loading
	
	if (tex != null)
		return tex.Name;
		
	return null;
}

/**
 * @ignore
 */
function ccbGetMousePosX()
{
	var engine = CL3D.ScriptingInterface.getScriptingInterface().Engine;	
	if (engine)
		return engine.getMouseX();
		
	return 0;
}

/**
 * @ignore
 */
function ccbGetMousePosY()
{
	var engine = CL3D.ScriptingInterface.getScriptingInterface().Engine;	
	if (engine)
		return engine.getMouseY();
		
	return 0;
}

/**
 * @ignore
 */
function ccbGetScreenWidth()
{
	var engine = CL3D.ScriptingInterface.getScriptingInterface().Engine;	
	if (engine != null && engine.getRenderer())
		return engine.getRenderer().getWidth();
		
	return 0;
}

/**
 * @ignore
 */
function ccbGetScreenHeight()
{
	var engine = CL3D.ScriptingInterface.getScriptingInterface().Engine;	
	if (engine != null && engine.getRenderer())
		return engine.getRenderer().getHeight();
		
	return 0;
}

/**
 * @ignore
 */
function ccbSetCloseOnEscapePressed()
{
	// not used
}

/**
 * @ignore
 */
function ccbSetCursorVisible()
{
	// not used
}

/**
 * @ignore
 */
function ccbSwitchToScene(name)
{
	var engine = CL3D.ScriptingInterface.getScriptingInterface().Engine;	
	if (engine != null)
		return engine.gotoSceneByName(name, true);
		
	return false;
}

/**
 * @ignore
 */
function ccbPlaySound(name)
{	
	var sndmgr = CL3D.gSoundManager;
	var snd = sndmgr.getSoundFromName(name);
	if (snd != null)
		sndmgr.play2D(snd, false, 1.0);
}

/**
 * @ignore
 */
function ccbStopSound(name)
{	
	CL3D.gSoundManager.stopSpecificPlayingSound(name);
}

/**
 * @ignore
 */
function ccbGetCopperCubeVariable(varname)
{
	var scene = CL3D.gScriptingInterface.CurrentlyActiveScene;
		
	var var1 = CL3D.CopperCubeVariable.getVariable(varname, true, scene);
			
	if (var1 == null)
		return null;
		
	if (var1.isString())
		return var1.getValueAsString();
		
	if (var1.isInt())
		return var1.getValueAsInt();
		
	if (var1.isFloat())
		return var1.getValueAsFloat();
		
	return null;
}

/**
 * @ignore
 */
function ccbSetCopperCubeVariable(varname, value)
{
	var scene = CL3D.gScriptingInterface.CurrentlyActiveScene;
				
	var var1 = CL3D.CopperCubeVariable.getVariable(varname, true, scene);
	if (var1 == null)
		return;
						
	if (typeof value == 'number')
		var1.setValueAsFloat(value);
	else
		var1.setValueAsString(value);
		
	// also, save if it was a temporary variable
	CL3D.CopperCubeVariable.saveContentOfPotentialTemporaryVariableIntoSource(var1, scene);
}

/**
 * @ignore
 */
function ccbSwitchToFullscreen(enablePointerLock, elementToSwitchToFullscreen)
{
	var engine = CL3D.ScriptingInterface.getScriptingInterface().Engine;	
	if (engine)
		engine.switchToFullscreen(enablePointerLock, elementToSwitchToFullscreen);
}

/**
 * @ignore
 */
function ccbReadFileContent(filename)
{
	// not possible
	return null;
}

/**
 * @ignore
 */
function ccbWriteFileContent(filename, content)
{
	// not possible
}

/**
 * @ignore
 */
function ccbGetPlatform()
{
	return "webgl";
}

/**
 * @ignore
 */
function ccbInvokeAction(actionid, node)
{
	var scene = CL3D.gScriptingInterface.CurrentlyActiveScene;
	if (scene == null)
		return;
		
	if (node == null)
		node = scene.getRootSceneNode();
		
	if (actionid >= 0 && actionid < CL3D.gScriptingInterface.StoredExtensionScriptActionHandlers.length)
	{
		var a = CL3D.gScriptingInterface.StoredExtensionScriptActionHandlers[actionid];
		if (a != null)
			a.execute(node);
	}
}

/**
 * @ignore
 */
function print(s)
{
	CL3D.gCCDebugOutput.jsConsolePrint(s);
}

/**
 * @ignore
 */
function system(s)
{
	// not used
}

/**
 * @ignore
 */
function ccbRegisterBehaviorEventReceiver(bForMouse, bForKeyboard)
{
	if (CL3D.gScriptingInterface.CurrentlyRunningExtensionScriptAnimator != null)
	{
		CL3D.gScriptingInterface.CurrentlyRunningExtensionScriptAnimator.setAcceptsEvents(bForMouse, bForKeyboard);
	}
}

/**
 * @ignore
 */
function ccbDoHTTPRequest(url, fobj)
{	
	++CL3D.gScriptingInterface.LastHTTPRequestId;
	var id = CL3D.gScriptingInterface.LastHTTPRequestId;
	
	var loader = new CL3D.CCFileLoader(url);
	
	var itemarray = CL3D.gScriptingInterface.ccbRegisteredHTTPCallbackArray;	
	var f = new Object(); 
	f.loader = loader;
	f.id = id; 		
	itemarray.push(f); 
	
	var myCallback = function(p)
	{
		if (fobj)
			fobj(p);
					
		for (var i=0; i<itemarray.length; ++i) 
			if (itemarray[i].id == id)
			{ 
				itemarray.splice(i, 1); 
				break; 
			}
	}
	
	loader.load(myCallback);	
	return id;	
}

/**
 * @ignore
 */
function ccbCancelHTTPRequest(id)
{
	var itemarray = CL3D.gScriptingInterface.ccbRegisteredHTTPCallbackArray;	
	
	for (var i=0; i<itemarray.length; ++i) 
		if (itemarray[i].id == id)
		{ 
			itemarray[i].loader.abort();
			itemarray.splice(i, 1); 
			break; 
		}
}

/**
 * @ignore
 */
function ccbCreateMaterial(vertexShader, fragmentShader, baseMaterialType, shaderCallback)
{
	var scripting = CL3D.ScriptingInterface.getScriptingInterface();
	var engine = scripting.Engine;
	var renderer = engine.getRenderer();
	if (renderer == null)
		return -1;

	var basemat = renderer.MaterialPrograms[baseMaterialType];
		
	var matid = renderer.createMaterialType(vertexShader, fragmentShader, basemat.blendenabled, basemat.blendsfactor, basemat.blenddfactor);
	if (matid != -1)
	{	
		if (shaderCallback != null)
			scripting.ShaderCallbacks["_" + matid] = shaderCallback;
		
		if (!scripting.ShaderCallBackSet)
		{
			scripting.ShaderCallBackSet = true;
			scripting.OriginalShaderCallBack = renderer.OnChangeMaterial;
			
			renderer.OnChangeMaterial = function(mattype)
			{
				if (scripting.OriginalShaderCallBack)
					scripting.OriginalShaderCallBack();
				
				var c = scripting.ShaderCallbacks["_" + mattype];
				if (c != null)
				{
					scripting.CurrentShaderMaterialType = mattype;
					c();
				}
			}
		}
	}
	
	return matid;
}

/**
 * @ignore
 */
function ccbSetShaderConstant(type, name, value1, value2, value3, value4)
{
	var scripting = CL3D.ScriptingInterface.getScriptingInterface();
	var engine = scripting.Engine;
	var renderer = engine.getRenderer();
	if (renderer == null)
		return;
		
	var gl = renderer.getWebGL();
	
	var program = renderer.getGLProgramFromMaterialType(scripting.CurrentShaderMaterialType);
	var variableLocation = gl.getUniformLocation(program, name);
    gl.uniform4f(variableLocation, value1, value2, value3, value4);
}


CL3D.gCurrentJScriptNode = null;

/**
 * @ignore
 */
function ccbGetCurrentNode()
{
	return CL3D.gCurrentJScriptNode;
}

/**
 * @ignore
 */
function ccbAICommand(node, command, param)
{
	if (!node)
		return;
		
	var gameai = node.getAnimatorOfType('gameai');
	if (!gameai)
		return;
		
	if (command == 'cancel')
		gameai.aiCommandCancel(node);
	else
	if (command == 'moveto')
	{
		var v = new CL3D.Vect3d(0,0,0);
		if (param != null && typeof param.x != 'undefined')
		{				
			v.X = param.x;
			v.Y = param.y;
			v.Z = param.z;
		}
		
		gameai.moveToTarget(node, v, node.getAbsolutePosition(), CL3D.CLTimer.getTime());
	}
	else
	if (command == 'attack')
	{
		gameai.attackTarget(node, param, param.getAbsolutePosition(), node.getAbsolutePosition(), CL3D.CLTimer.getTime());
	}
}
