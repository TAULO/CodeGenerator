Pop.Opengl = {};

//	counters for debugging
Pop.Opengl.Stats = {};
Pop.Opengl.Stats.TrianglesDrawn = 0;
Pop.Opengl.Stats.BatchesDrawn = 0;
Pop.Opengl.Stats.GeometryBindSkip = 0;
Pop.Opengl.Stats.ShaderBindSkip = 0;
Pop.Opengl.Stats.GeometryBinds = 0;
Pop.Opengl.Stats.ShaderBinds = 0;
Pop.Opengl.Stats.Renders = 0;

//	webgl only supports glsl 100!
Pop.GlslVersion = 100;

//	mobile typically can not render to a float texture. Emulate this on desktop
//	gr: we now test for this on context creation.
//		MAYBE this needs to be per-context, but it's typically by device
//		(and we typically want to know it without a render context)
//		set to false to force it off (eg. for testing on desktop against
//		ios which doesn't support it [as of 13]
Pop.Opengl.CanRenderToFloat = undefined;

//	allow turning off float support
Pop.Opengl.AllowFloatTextures = !Pop.GetExeArguments().DisableFloatTextures;


Pop.Opengl.GetString = function(Context,Enum)
{
	const gl = Context;
	const Enums =
	[
	 'FRAMEBUFFER_COMPLETE',
	 'FRAMEBUFFER_INCOMPLETE_ATTACHMENT',
	 'FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT',
	 'FRAMEBUFFER_INCOMPLETE_DIMENSIONS',
	 'FRAMEBUFFER_UNSUPPORTED'
	];
	const EnumValues = {};
	//	number -> string
	function PushEnum(EnumString)
	{
		const Key = gl[EnumString];
		if ( Key === undefined )
			return;
		EnumValues[Key] = EnumString;
	}
	Enums.forEach(PushEnum);
	if ( EnumValues.hasOwnProperty(Enum) )
		return EnumValues[Enum];
	
	return "<" + Enum + ">";
}


//	gl.isFrameBuffer is expensive! probably flushing
const TestFrameBuffer = false;
const TestAttribLocation = false;
const DisableOldVertexAttribArrays = false;
const AllowVao = !Pop.GetExeArguments().DisableVao;

//	if we fail to get a context (eg. lost context) wait this long before restarting the render loop (where it tries again)
//	this stops thrashing cpu/system whilst waiting
const RetryGetContextMs = 1000;

//	need to sort this!, should be in gui
//	currently named to match c++
Pop.SoyMouseButton = Pop.SoyMouseButton || {};
//	matching SoyMouseButton
Pop.SoyMouseButton.None = -1;	//	todo: in api, change this to undefined
Pop.SoyMouseButton.Left = 0;
Pop.SoyMouseButton.Middle = 2;
Pop.SoyMouseButton.Right = 1;
Pop.SoyMouseButton.Back = 3;
Pop.SoyMouseButton.Forward = 4;



//	need a generic memory heap system in Pop for js side so
//	we can do generic heap GUIs
Pop.HeapMeta = function(Name)
{
	this.AllocCount = 0;
	this.AllocSize = 0;
	
	this.OnAllocated = function(Size)
	{
		if ( isNaN(Size) )
			throw "Bad size " + Size;
		this.AllocCount++;
		this.AllocSize += Size;
	}
	
	this.OnDeallocated = function(Size)
	{
		if ( isNaN(Size) )
			throw "Bad size " + Size;
		this.AllocCount--;
		this.AllocSize -= Size;
	}
}







//	this is currenly in c++ in the engine. need to swap to javascript
Pop.Opengl.RefactorGlslShader = function(Source)
{
	if ( !Source.startsWith('#version ') )
	{
		Source = '#version ' + Pop.GlslVersion + '\n' + Source;
	}
	
	//Source = 'precision mediump float;\n' + Source;
	
	Source = Source.replace(/float2/gi,'vec2');
	Source = Source.replace(/float3/gi,'vec3');
	Source = Source.replace(/float4/gi,'vec4');

	return Source;
}

Pop.Opengl.RefactorVertShader = function(Source)
{
	Source = Pop.Opengl.RefactorGlslShader(Source);
	
	if ( Pop.GlslVersion == 100 )
	{
		Source = Source.replace(/\nin /gi,'\nattribute ');
		Source = Source.replace(/\nout /gi,'\nvarying ');
		
		//	webgl doesn't have texture2DLod, it just overloads texture2D
		//	in webgl1 with the extension, we need the extension func
		//	in webgl2 with #version 300 es, we can use texture2D
		//	gr: then it wouldn't accept texture2DLodEXT (webgl1)
		//		... then texture2DLod worked
		//Source = Source.replace(/texture2DLod/gi,'texture2DLodEXT');
		//Source = Source.replace(/texture2DLod/gi,'texture2D');
		Source = Source.replace(/textureLod/gi,'texture2DLod');
		
	}
	else if ( Pop.GlslVersion >= 300 )
	{
		Source = Source.replace(/attribute /gi,'in ');
		Source = Source.replace(/varying /gi,'out ');
		//Source = Source.replace(/gl_FragColor/gi,'FragColor');
	}
	
	return Source;
}

Pop.Opengl.RefactorFragShader = function(Source)
{
	Source = Pop.Opengl.RefactorGlslShader(Source);

	//	gr: this messes up xcode's auto formatting :/
	//let Match = /texture2D\(/gi;
	let Match = 'texture(';
	Source = Source.replace(Match,'texture2D(');

	if ( Pop.GlslVersion == 100 )
	{
		//	in but only at the start of line (well, after the end of prev line)
		Source = Source.replace(/\nin /gi,'\nvarying ');
	}
	else if ( Pop.GlslVersion >= 300 )
	{
		Source = Source.replace(/varying /gi,'in ');
		//Source = Source.replace(/gl_FragColor/gi,'FragColor');
	}
	return Source;
}

//	temp copy of SetGuiControlStyle, reduce dependcy, but we also want the openglwindow to become a basecontrol dervied "view"
function Pop_Opengl_SetGuiControlStyle(Element,Rect)
{
	if ( !Rect )
		return;
	
	//	to allow vw/% etc, we're using w/h now
	//	also, if you have bottom, but no height,
	//	you need block display to make that style work
	
	function NumberToPx(Number)
	{
		if ( typeof Number != 'number' )
			return Number;
		return Number + 'px';
	}
	const RectCss = Rect.map(NumberToPx);
	Element.style.position = 'absolute';
	Element.style.left = RectCss[0];
	Element.style.top = RectCss[1];
	Element.style.width = RectCss[2];
	Element.style.height = RectCss[3];
	//Element.style.border = '1px solid #0f0';
}

//	temp copy of SetGuiControlStyle, reduce dependcy, but we also want the openglwindow to become a basecontrol dervied "view"
function Pop_Opengl_SetGuiControl_SubElementStyle(Element,LeftPercent=0,RightPercent=100)
{
	Element.style.display = 'block';
	//	this makes it overflow, shouldn't be needed?
	//Element.style.width = (RightPercent-LeftPercent) + '%';
	Element.style.position = 'absolute';
	Element.style.left = LeftPercent + '%';
	Element.style.right = (100-RightPercent) + '%';
	Element.style.top = '0px';
	Element.style.bottom = '0px';
}


//	wrapper for a generic element which converts input (touch, mouse etc) into
//	our mouse functions
function TElementMouseHandler(Element,OnMouseDown,OnMouseMove,OnMouseUp,OnMouseScroll)
{
	//	annoying distinctions
	let GetButtonFromMouseEventButton = function(MouseButton,AlternativeButton)
	{
		//	html/browser definitions
		const BrowserMouseLeft = 0;
		const BrowserMouseMiddle = 1;
		const BrowserMouseRight = 2;

		//	handle event & button arg
		if ( typeof MouseButton == "object" )
		{
			let MouseEvent = MouseButton;
			
			//	this needs a fix for touches
			if ( MouseEvent.touches )
			{
				//	have to assume there's always one?
				const Touches = Array.from( MouseEvent.touches );
				if ( Touches.length == 0 )
					throw "Empty touch array, from event?";
				MouseButton = BrowserMouseLeft;
				AlternativeButton = false;
			}
			else
			{
				MouseButton = MouseEvent.button;
				AlternativeButton = (MouseEvent.ctrlKey == true);
			}
		}
		
		if ( AlternativeButton )
		{
			switch ( MouseButton )
			{
				case BrowserMouseLeft:	return Pop.SoyMouseButton.Back;
				case BrowserMouseRight:	return Pop.SoyMouseButton.Forward;
			}
		}
		
		switch ( MouseButton )
		{
			case BrowserMouseLeft:		return Pop.SoyMouseButton.Left;
			case BrowserMouseMiddle:	return Pop.SoyMouseButton.Middle;
			case BrowserMouseRight:		return Pop.SoyMouseButton.Right;
		}
		throw "Unhandled MouseEvent.button (" + MouseButton + ")";
	}
	
	let GetButtonsFromMouseEventButtons = function(MouseEvent)
	{
		//	note: button bits don't match mousebutton!
		//	https://www.w3schools.com/jsref/event_buttons.asp
		//	https://www.w3schools.com/jsref/event_button.asp
		//	index = 0 left, 1 middle, 2 right (DO NOT MATCH the bits!)
		//	gr: ignore back and forward as they're not triggered from mouse down, just use the alt mode
		//let ButtonMasks = [ 1<<0, 1<<2, 1<<1, 1<<3, 1<<4 ];
		const ButtonMasks = [ 1<<0, 1<<2, 1<<1 ];
		const ButtonMask = MouseEvent.buttons || 0;	//	undefined if touches
		const AltButton = (MouseEvent.ctrlKey==true);
		const Buttons = [];
		
		for ( let i=0;	i<ButtonMasks.length;	i++ )
		{
			if ( ( ButtonMask & ButtonMasks[i] ) == 0 )
				continue;
			let ButtonIndex = i;
			let ButtonName = GetButtonFromMouseEventButton( ButtonIndex, AltButton );
			if ( ButtonName === null )
				continue;
			Buttons.push( ButtonName );
		}
		
		//	mobile
		if ( MouseEvent.touches )
		{
			function GetButtonNameFromTouch(Touch,Index)
			{
				switch ( Index )
				{
					case 0:	return Pop.SoyMouseButton.Left;
					case 1:	return Pop.SoyMouseButton.Middle;
					case 2:	return Pop.SoyMouseButton.Right;
					case 3:	return Pop.SoyMouseButton.Back;
					case 4:	return Pop.SoyMouseButton.Forward;
					default:	return null;
				}
			}
			function PushTouch(Touch,Index)
			{
				const ButtonName = GetButtonNameFromTouch( Touch, Index );
				if ( ButtonName === null )
					return;
				Buttons.push( ButtonName );
			}
			Array.from(MouseEvent.touches).forEach( PushTouch );
		}
		
		return Buttons;
	}
	
	//	gr: should api revert to uv?
	let GetMousePos = function(MouseEvent)
	{
		const Rect = Element.getBoundingClientRect();
		
		//	touch event, need to handle multiple touch states
		if ( MouseEvent.touches )
			MouseEvent = MouseEvent.touches[0];
		
		const ClientX = MouseEvent.pageX || MouseEvent.clientX;
		const ClientY = MouseEvent.pageY || MouseEvent.clientY;
		const x = ClientX - Rect.left;
		const y = ClientY - Rect.top;
		return [x,y];
	}
	
	let MouseMove = function(MouseEvent)
	{
		const Pos = GetMousePos(MouseEvent);
		const Buttons = GetButtonsFromMouseEventButtons( MouseEvent );
		if ( Buttons.length == 0 )
		{
			MouseEvent.preventDefault();
			OnMouseMove( Pos[0], Pos[1], Pop.SoyMouseButton.None );
			return;
		}
		
		//	for now, do a callback on the first button we find
		//	later, we might want one for each button, but to avoid
		//	slow performance stuff now lets just do one
		//	gr: maybe API should change to an array
		OnMouseMove( Pos[0], Pos[1], Buttons[0] );
		MouseEvent.preventDefault();
	}
	
	let MouseDown = function(MouseEvent)
	{
		const Pos = GetMousePos(MouseEvent);
		const Button = GetButtonFromMouseEventButton(MouseEvent);
		OnMouseDown( Pos[0], Pos[1], Button );
		MouseEvent.preventDefault();
	}
	
	let MouseUp = function(MouseEvent)
	{
		const Pos = GetMousePos(MouseEvent);
		const Button = GetButtonFromMouseEventButton(MouseEvent);
		OnMouseUp( Pos[0], Pos[1], Button );
		MouseEvent.preventDefault();
	}
	
	let MouseWheel = function(MouseEvent)
	{
		const Pos = GetMousePos(MouseEvent);
		const Button = GetButtonFromMouseEventButton(MouseEvent);
		
		//	gr: maybe change scale based on
		//WheelEvent.deltaMode = DOM_DELTA_PIXEL, DOM_DELTA_LINE, DOM_DELTA_PAGE
		const DeltaScale = 0.01;
		const WheelDelta = [ MouseEvent.deltaX * DeltaScale, MouseEvent.deltaY * DeltaScale, MouseEvent.deltaZ * DeltaScale ];
		OnMouseScroll( Pos[0], Pos[1], Button, WheelDelta );
		MouseEvent.preventDefault();
	}
	
	let ContextMenu = function(MouseEvent)
	{
		//	allow use of right mouse down events
		//MouseEvent.stopImmediatePropagation();
		MouseEvent.preventDefault();
		return false;
	}
	
	//	use add listener to allow pre-existing canvas elements to retain any existing callbacks
	Element.addEventListener('mousemove', MouseMove );
	Element.addEventListener('wheel', MouseWheel, false );
	Element.addEventListener('contextmenu', ContextMenu, false );
	Element.addEventListener('mousedown', MouseDown, false );
	Element.addEventListener('mouseup', MouseUp, false );
	
	Element.addEventListener('touchmove', MouseMove );
	Element.addEventListener('touchstart', MouseDown, false );	//	touchend
	//	not currently handling up
	//this.Element.addEventListener('mouseup', MouseUp, false );
	//this.Element.addEventListener('mouseleave', OnDisableDraw, false );
	//this.Element.addEventListener('mouseenter', OnEnableDraw, false );
	

}


//	wrapper for a generic element which converts input (touch, mouse etc) into
//	our mouse functions
function TElementKeyHandler(Element,OnKeyDown,OnKeyUp)
{
	function GetKeyFromKeyEventButton(KeyEvent)
	{
		// Pop.Debug("KeyEvent",KeyEvent);
		return KeyEvent.key;
	}
	
	const KeyDown = function(KeyEvent)
	{
		//	if an input element has focus, ignore event
		if ( KeyEvent.srcElement instanceof HTMLInputElement )
		{
			Pop.Debug("Ignoring OnKeyDown as input has focus",KeyEvent);
			return false;
		}
		//Pop.Debug("OnKey down",KeyEvent);
		
		const Key = GetKeyFromKeyEventButton(KeyEvent);
		const Handled = OnKeyDown( Key );
		if ( Handled === true )
			KeyEvent.preventDefault();
	}
	
	const KeyUp = function(KeyEvent)
	{
		const Key = GetKeyFromKeyEventButton(KeyEvent);
		const Handled = OnKeyUp( Key );
		if ( Handled === true )
			KeyEvent.preventDefault();
	}
	

	Element = document;
	
	//	use add listener to allow pre-existing canvas elements to retain any existing callbacks
	Element.addEventListener('keydown', KeyDown );
	Element.addEventListener('keyup', KeyUp );
}


Pop.Opengl.Window = function(Name,Rect,CanvasOptions)
{
	//	things to overload
	//this.OnRender = function(RenderTarget){};
	this.OnMouseDown = function(x,y,Button)					{	/*Pop.Debug('OnMouseDown',...arguments);*/		};
	this.OnMouseMove = function(x,y,Button)					{	/*Pop.Debug("OnMouseMove",...arguments);*/		};
	this.OnMouseUp = function(x,y,Button)					{	/*Pop.Debug('OnMouseUp',...arguments);*/		};
	this.OnMouseScroll = function(x,y,Button,WheelDelta)	{	/*Pop.Debug('OnMouseScroll',...arguments);*/	};
	this.OnKeyDown = function(Key)							{	/*Pop.Debug('OnKeyDown',...arguments);*/		};
	this.OnKeyUp = function(Key)							{	/*Pop.Debug('OnKeyUp',...arguments);*/			};

	//	treat minimised and foreground as the same on web;
	//	todo: foreground state for multiple windows on one page
	this.IsForeground = function () { return Pop.WebApi.IsForeground(); }
	this.IsMinimised = function () { return Pop.WebApi.IsForeground(); }

	this.IsOpen = true;	//	renderloop stops if false
	this.NewCanvasElement = null;	//	canvas we created
	this.CanvasElement = null;		//	cached element pointer
	this.CanvasOptions = CanvasOptions || {};

	this.Context = null;
	this.ContextVersion = 0;	//	used to tell if resources are out of date
	this.RenderTarget = null;
	this.CanvasMouseHandler = null;
	this.CanvasKeyHandler = null;
	this.ScreenRectCache = null;
	this.TextureHeap = new Pop.HeapMeta("Opengl Textures");
	this.GeometryHeap = new Pop.HeapMeta("Opengl Geometry");

	this.FloatTextureSupported = false;
	this.Int32TextureSupported = false;	//	depth texture 24,8
	
	this.ActiveTexureIndex = 0;
	this.TextureRenderTargets = [];	//	this is a context asset, so maybe it shouldn't be kept here

	this.Close = function ()
	{
		Pop.Debug(`Opengl.Window.Close`);

		//	stop render loop
		this.IsOpen = false;

		//	destroy render context
		//	free opengl resources

		//	destroy element if we created it
		if (this.NewCanvasElement)
		{
			this.NewCanvasElement.parent.removeChild(this.NewCanvasElement);
			this.NewCanvasElement = null;
		}
	}

	this.OnResize = function(ResizeEvent)
	{
		// Pop.Debug("OnResize",JSON.stringify(ResizeEvent));
		
		//	invalidate cache
		this.ScreenRectCache = null;
	
		//	resize to original rect
		const Canvas = this.GetCanvasElement();
		// Pop.Debug("Re-setting canvas size to original rect",JSON.stringify(Rect))
		this.SetCanvasSize();
		
		this.RefreshCanvasResolution();
	}
	
	this.AllocTexureIndex = function()
	{
		//	gr: make a pool or something
		//		we fixed this on desktop, so take same model
		const Index = (this.ActiveTexureIndex % 8);
		this.ActiveTexureIndex++;
		return Index;
	}
	
	this.GetCanvasElement = function()
	{
		return this.CanvasElement;
	}
	
	this.CreateCanvasElement = function(Name,Parent,Rect)
	{
		//	if element already exists, we need it to be a canvas
		//	if we're fitting inside a div, then Parent should be the name of a div
		//	we could want a situation where we want a rect inside a parent? but then
		//	that should be configured by css?
		let Element = document.getElementById(Name);
		if ( Element )
		{
			//	https://stackoverflow.com/questions/254302/how-can-i-determine-the-type-of-an-html-element-in-javascript
			//	apprently nodeName is the best case
			if ( Element.nodeName != 'CANVAS' )
				throw `Pop.Opengl.Window ${Name} needs to be a canvas, is ${Element.nodeName}`;
			return Element;
		}
		
		//	create new canvas
		this.NewCanvasElement = document.createElement('canvas');
		Element = this.NewCanvasElement;
		Element.id = Name;
		Parent.appendChild( Element );
		
		//	double check
		{
			let MatchElement = document.getElementById(Name);
			if ( !MatchElement )
				throw "Created, but failed to refind new element";
		}

		return Element;
	}
	
	this.InitCanvasElement = function(Name,Parent,Rect)
	{
		const Element = this.CreateCanvasElement(Name,Parent,Rect);
		
		if ( Rect == Parent.id )
			Pop_Opengl_SetGuiControl_SubElementStyle(Element);
		else
			Pop_Opengl_SetGuiControlStyle( Element, Rect );
		
		//	setup event bindings
		//	gr: can't bind here as they may change later, so relay (and error if not setup)
		let OnMouseDown = function()	{	return this.OnMouseDown.apply( this, arguments );	}.bind(this);
		let OnMouseMove = function()	{	return this.OnMouseMove.apply( this, arguments );	}.bind(this);
		let OnMouseUp = function()		{	return this.OnMouseUp.apply( this, arguments );	}.bind(this);
		let OnMouseScroll = function()	{	return this.OnMouseScroll.apply( this, arguments );	}.bind(this);
		let OnKeyDown = function()		{	return this.OnKeyDown.apply( this, arguments );	}.bind(this);
		let OnKeyUp = function()		{	return this.OnKeyUp.apply( this, arguments );	}.bind(this);
		
		this.CanvasMouseHandler = new TElementMouseHandler( Element, OnMouseDown, OnMouseMove, OnMouseUp, OnMouseScroll );
		this.CanvasKeyHandler = new TElementKeyHandler( Element, OnKeyDown, OnKeyUp );

		//	catch window resize
		window.addEventListener('resize',this.OnResize.bind(this));
		
		//	https://medium.com/@susiekim9/how-to-compensate-for-the-ios-viewport-unit-bug-46e78d54af0d
		/*	this doesn't help
		window.onresize = function ()
		{
			document.body.height = window.innerHeight;
		}
		window.onresize(); // called to initially set the height.
		*/

		//	catch fullscreen state change
		Element.addEventListener('fullscreenchange', this.OnFullscreenChanged.bind(this) );
		return Element;
	}
	
	this.GetScreenRect = function()
	{
		if ( !this.ScreenRectCache )
		{
			let Canvas = this.GetCanvasElement();
			let ElementRect = Canvas.getBoundingClientRect();
			this.ScreenRectCache = [ ElementRect.x, ElementRect.y, ElementRect.width, ElementRect.height ];
			
			//	gr: the bounding rect is correct, BUT for rendering,
			//		we should match the canvas pixel size
			this.ScreenRectCache[2] = Canvas.width;
			this.ScreenRectCache[3] = Canvas.height;
		}
		return this.ScreenRectCache.slice();
	}
	
	this.RefreshCanvasResolution = function()
	{
		const Canvas = this.GetCanvasElement();
		
		//	get element size
		const BoundingElement = Canvas.parentElement;
		const Rect = BoundingElement.getBoundingClientRect();
		const w = Rect.width;
		const h = Rect.height;
		
		//	re-set resolution to match
		Canvas.width = w;
		Canvas.height = h;
	}
	
	this.SetCanvasSize = function()
	{
		const ParentElement = this.CanvasElement.parentElement;
		
		//	if null, then fullscreen
		//	go as fullscreen as possible
		if ( !Rect )
		{
			//	try and go as big as parent
			//	values may be zero, so then go for window (erk!)
			const ParentSize = [ParentElement.clientWidth,ParentElement.clientHeight];
			const ParentInnerSize = [ParentElement.innerWidth,ParentElement.innerHeight];
			const WindowInnerSize = [window.innerWidth,window.innerHeight];

			let Width = ParentSize[0];
			let Height = ParentSize[1];
			if (!Width)
				Width = WindowInnerSize[0];
			if (!Height)
				Height = WindowInnerSize[1];
			Rect = [0,0,Width,Height];
			Pop.Debug("SetCanvasSize defaulting to ",Rect,"ParentSize=" + ParentSize,"ParentInnerSize=" + ParentInnerSize,"WindowInnerSize=" + WindowInnerSize);
		}
		
		let Left = Rect[0];
		let Top = Rect[1];
		let Width = Rect[2];
		let Height = Rect[3];
			/*
		CanvasElement.style.display = 'block';
		CanvasElement.style.position = 'absolute';
		//Element.style.border = '1px solid #f00';
			
		CanvasElement.style.left = Left+'px';
		CanvasElement.style.top = Top+'px';
		//Element.style.right = Right+'px';
		//Element.style.bottom = Bottom+'px';
		CanvasElement.style.width = Width+'px';
		CanvasElement.style.height = Height+'px';
		//Element.style.width = '100%';
		//Element.style.height = '500px';
		*/
		//CanvasElement.width = Rect[2];
		//CanvasElement.height = Rect[3];
	}
	
	
	
	this.OnLostContext = function(Error)
	{
		Pop.Debug("Lost webgl context",Error);
		this.Context = null;
		this.CurrentBoundGeometryHash = null;
		this.CurrentBoundShaderHash = null;
		this.ResetContextAssets();
	}
	
	this.ResetContextAssets = function()
	{
		//	dont need to reset this? but we will anyway
		this.ActiveTexureIndex = 0;
		
		//	todo: proper cleanup
		this.TextureRenderTargets = [];
	}

	this.TestLoseContext = function()
	{
		Pop.Debug("TestLoseContext");
		const Context = this.GetGlContext();
		const Extension = Context.getExtension('WEBGL_lose_context');
		if ( !Extension )
			throw "WEBGL_lose_context not supported";
		
		Extension.loseContext();
		
		//	restore after 3 secs
		function RestoreContext()
		{
			Extension.restoreContext();
		}
		setTimeout( RestoreContext, 3*1000 );
	}
	

	this.CreateContext = function()
	{
		const ContextMode = "webgl";
		const Canvas = this.GetCanvasElement();
		//this.RefreshCanvasResolution();
		this.OnResize();
		const Options = Object.assign({}, this.CanvasOptions);
		if (Options.antialias == undefined) Options.antialias = true;
		if (Options.xrCompatible == undefined) Options.xrCompatible = true;
		//	default is true. when true, this is causing an rgb blend with white,
		//	instead of what's behind the canvas, causing a white halo
		//	https://webglfundamentals.org/webgl/lessons/webgl-and-alpha.html
		if (Options.premultipliedAlpha == undefined) Options.premultipliedAlpha = false;
		if (Options.alpha == undefined) Options.alpha = true;	//	have alpha buffer
		const Context = Canvas.getContext( ContextMode, Options );
		
		if ( !Context )
			throw "Failed to initialise " + ContextMode;
		
		if ( Context.isContextLost() )
		{
			//	gr: this is a little hacky
			throw "Created " + ContextMode + " context but is lost";
		}
		
		const gl = Context;
		
		//	debug capabilities
		const CapabilityNames =
		[
			'MAX_VERTEX_UNIFORM_VECTORS',
			'MAX_RENDERBUFFER_SIZE',
			'MAX_TEXTURE_SIZE',
			'MAX_VIEWPORT_DIMS',
			'MAX_VERTEX_TEXTURE_IMAGE_UNITS',
			'MAX_TEXTURE_IMAGE_UNITS',
			'MAX_COMBINED_TEXTURE_IMAGE_UNITS',
			'MAX_VERTEX_ATTRIBS',
			'MAX_VARYING_VECTORS',
			'MAX_VERTEX_UNIFORM_VECTORS',
			'MAX_FRAGMENT_UNIFORM_VECTORS',
		];
		const Capabilities = {};
		function GetCapability(CapName)
		{
			const Key = gl[CapName];	//	parameter key is a number
			const Value = gl.getParameter(Key);
			Capabilities[CapName] = Value;
		}
		CapabilityNames.forEach(GetCapability);
		Pop.Debug(`Created new ${ContextMode} context. Capabilities; ${JSON.stringify(Capabilities)}`);
		
		
		//	handle losing context
		function OnLostWebglContext(Event)
		{
			Pop.Debug("OnLostWebglContext",Event);
			Event.preventDefault();
			this.OnLostContext("Canvas event");
		}
		Canvas.addEventListener('webglcontextlost', OnLostWebglContext.bind(this), false);
		
		
		//	enable float textures on GLES1
		//	https://developer.mozilla.org/en-US/docs/Web/API/OES_texture_float
		
		// Pop.Debug("Supported Extensions", gl.getSupportedExtensions() );

		const InitFloatTexture = function(Context)
		{
			//	gl.Float already exists, but this now allows it for texImage
			this.FloatTextureSupported = true;
			Context.FloatTextureSupported = true;
			
		}.bind(this);

		const InitDepthTexture = function(Context,Extension)
		{
			Context.UNSIGNED_INT_24_8 = Extension.UNSIGNED_INT_24_8_WEBGL;
			this.Int32TextureSupported = true;
		}.bind(this);

		
		const EnableExtension = function(ExtensionName,Init)
		{
			try
			{
				const Extension = gl.getExtension(ExtensionName);
				gl[ExtensionName] = Extension;
				if ( Extension == null )
					throw ExtensionName + " not supported (null)";
				Pop.Debug("Loaded extension",ExtensionName,Extension);
				if ( Init )
					Init( gl, Extension );
			}
			catch(e)
			{
				Pop.Debug("Error enabling ",ExtensionName,e);
			}
		};
		
		if ( Pop.Opengl.AllowFloatTextures )
			EnableExtension('OES_texture_float',InitFloatTexture);
		EnableExtension('WEBGL_depth_texture',InitDepthTexture);
		EnableExtension('EXT_blend_minmax');
		EnableExtension('OES_vertex_array_object', this.InitVao.bind(this) );
		EnableExtension('WEBGL_draw_buffers', this.InitMultipleRenderTargets.bind(this) );
		
		//	texture load needs extension in webgl1
		//	in webgl2 it's built in, but requires #version 300 es
		//	gr: doesnt NEED to be enabled??
		//EnableExtension('EXT_shader_texture_lod');
		//EnableExtension('OES_standard_derivatives');

		return Context;
	}
	
	this.IsFloatRenderTargetSupported = function()
	{
		//	gr: because of some internal workarounds/auto conversion in images
		//		trying to create & bind a float4 will inadvertently work! if we
		//		dont support float textures
		if ( !this.FloatTextureSupported )
			return false;
		
		try
		{
			const FloatTexture = new Pop.Image([1,1],'Float4');
			const RenderTarget = new Pop.Opengl.TextureRenderTarget( [FloatTexture] );
			const RenderContext = this;
			RenderTarget.BindRenderTarget( RenderContext );
			//	cleanup!
			//	todo: restore binding, viewports etc
			return true;
		}
		catch(e)
		{
			Pop.Debug("IsFloatRenderTargetSupported failed: "+e);
			return false;
		}
	}

	
	this.InitVao = function(Context,Extension)
	{
		//	already enabled with webgl2
		if ( Context.createVertexArray )
			return;
		
		Context.createVertexArray = Extension.createVertexArrayOES.bind(Extension);
		Context.deleteVertexArray = Extension.deleteVertexArrayOES.bind(Extension);
		Context.isVertexArray = Extension.isVertexArrayOES.bind(Extension);
		Context.bindVertexArray = Extension.bindVertexArrayOES.bind(Extension);
	}
	
	this.InitMultipleRenderTargets = function(Context,Extension)
	{
		Pop.Debug("MRT has MAX_COLOR_ATTACHMENTS_WEBGL=" + Extension.MAX_COLOR_ATTACHMENTS_WEBGL + " MAX_DRAW_BUFFERS_WEBGL=" + Extension.MAX_DRAW_BUFFERS_WEBGL );
		Extension.AttachmentPoints =
		[
		 Extension.COLOR_ATTACHMENT0_WEBGL,	Extension.COLOR_ATTACHMENT1_WEBGL,	Extension.COLOR_ATTACHMENT2_WEBGL,	Extension.COLOR_ATTACHMENT3_WEBGL,	Extension.COLOR_ATTACHMENT4_WEBGL,
		 Extension.COLOR_ATTACHMENT5_WEBGL,	Extension.COLOR_ATTACHMENT6_WEBGL,	Extension.COLOR_ATTACHMENT7_WEBGL,	Extension.COLOR_ATTACHMENT8_WEBGL,	Extension.COLOR_ATTACHMENT9_WEBGL,
		 Extension.COLOR_ATTACHMENT10_WEBGL,	Extension.COLOR_ATTACHMENT11_WEBGL,	Extension.COLOR_ATTACHMENT12_WEBGL,	Extension.COLOR_ATTACHMENT13_WEBGL,	Extension.COLOR_ATTACHMENT14_WEBGL,	Extension.COLOR_ATTACHMENT15_WEBGL,
		];
		
		//	already in webgl2
		if ( !Context.drawBuffers )
		{
			Context.drawBuffers = Extension.drawBuffersWEBGL.bind(Extension);
		}
	}
	
	
	
	this.InitialiseContext = function()
	{
		this.Context = this.CreateContext();
		this.ContextVersion++;
		
		//	gr: I want this in CreateContext, but the calls require this.Context to be setup
		//		so doing it here for now
		//	test support for float render targets
		//	test for undefined, as it may have been forced off by client
		if ( Pop.Opengl.CanRenderToFloat === undefined )
		{
			Pop.Opengl.CanRenderToFloat = this.IsFloatRenderTargetSupported();
		}
	}
	
	//	we could make this async for some more control...
	this.RenderLoop = function()
	{
		let Render = function(Timestamp)
		{
			if (!this.IsOpen)
				return;

			//	try and get the context, if this fails, it may be temporary
			try
			{
				this.GetGlContext();
			}
			catch(e)
			{
				//	Renderloop error, failed to get context... waiting to try again
				console.error("OnRender error: ",e);
				setTimeout( Render.bind(this), RetryGetContextMs );
				return;
			}
			
			//	now render and let it throw (user error presumably)
			const RenderContext = this;
			if ( !this.RenderTarget )
				this.RenderTarget = new WindowRenderTarget(this);
			this.RenderTarget.BindRenderTarget( RenderContext );

			//	request next frame, before any render fails, so we will get exceptions thrown for debugging, but recover
			window.requestAnimationFrame( Render.bind(this) );

			this.OnRender( this.RenderTarget );
			Pop.Opengl.Stats.Renders++;
		}
		window.requestAnimationFrame( Render.bind(this) );
	}

	this.GetGlContext = function()
	{
		//	catch if we have a context but its lost
		if ( this.Context )
		{
			//	gr: does this cause a sync?
			if ( this.Context.isContextLost() )
			{
				this.OnLostContext("Found context.isContextLost()");
			}
		}
		
		//	reinit
		if ( !this.Context )
		{
			this.InitialiseContext();
		}
		return this.Context;
	}
	
	this.OnAllocatedTexture = function(Image)
	{
		this.TextureHeap.OnAllocated( Image.OpenglByteSize );
	}
	
	this.OnDeletedTexture = function(Image)
	{
		//	todo: delete render targets that use this image
		this.TextureHeap.OnDeallocated( Image.OpenglByteSize );
	}
	
	this.OnAllocatedGeometry = function(Geometry)
	{
		this.GeometryHeap.OnAllocated( Geometry.OpenglByteSize );
	}
	
	this.OnDeletedGeometry = function(Geometry)
	{
		this.GeometryHeap.OnDeallocated( Geometry.OpenglByteSize );
	}
	
	this.GetTextureRenderTarget = function(Textures)
	{
		if ( !Array.isArray(Textures) )
			Textures = [Textures];
		function MatchRenderTarget(RenderTarget)
		{
			const RTTextures = RenderTarget.Images;
			if ( RTTextures.length != Textures.length )
				return false;
			//	check hash of each one
			for ( let i=0;	i<RTTextures.length;	i++ )
			{
				const a = GetUniqueHash( RTTextures[i] );
				const b = GetUniqueHash( Textures[i] );
				if ( a != b )
					return false;
			}
			return true;
		}
		
		let RenderTarget = this.TextureRenderTargets.find(MatchRenderTarget);
		if ( RenderTarget )
			return RenderTarget;
		
		//	make a new one
		RenderTarget = new Pop.Opengl.TextureRenderTarget( Textures );
		this.TextureRenderTargets.push( RenderTarget );
		if ( !this.TextureRenderTargets.find(MatchRenderTarget) )
			throw "New render target didn't re-find";
		return RenderTarget;
	}

	this.IsFullscreenSupported = function()
	{
		return document.fullscreenEnabled;
	}
	
	this.OnFullscreenChanged = function(Event)
	{
		Pop.Debug("OnFullscreenChanged", Event);
		//this.OnResize();
	}
	
	this.IsFullscreen = function()
	{
		const Canvas = this.GetCanvasElement();
		//if ( document.fullscreenElement == Canvas )
		if ( document.fullscreenElement )
			return true;
		return false;
	}
	
	this.SetFullscreen = function(Enable=true)
	{
		if ( !Enable )
		{
			//	undo after promise if there is a pending one
			document.exitFullscreen();
			return;
		}
		const Element = this.GetCanvasElement();
		
		const OnFullscreenSuccess = function()
		{
			//	maybe should be following fullscreenchange event
		}.bind(this);
		
		const OnFullscreenError = function(Error)
		{
			Pop.Debug("OnFullscreenError", Error);
		}.bind(this);
		
		//	gr: normally we want Element to go full screen
		//		but for acidic ocean, we're using other HTML elements
		//		and making the canvas fullscreen hides everything else
		//		so.... may need some user-option
		document.body.requestFullscreen().then( OnFullscreenSuccess ).catch( OnFullscreenError );
		//Element.requestFullscreen().then( OnFullscreenSuccess ).catch( OnFullscreenError );
	}
	

	//	gr: this class needs to re-organise into a "opengl view" to go inside a gui window
	//		native API also needs to do this
	//	like Pop.Gui controls;
	//		if Name==Canvas.id, then it should initialise there
	//		else if rect is a string (or direct element) we should create a new canvas inside
	//			that element
	//		else if rect is a number, we should create a canvas in the body at the specified size
	//		if name is canvas.id and rect==parent, then we have to ignore the rect
	let Parent = document.body;
	if ( typeof Rect == 'string' )
	{
		Parent = document.getElementById(Rect);
	}
	else if ( Rect instanceof HTMLElement )
	{
		Parent = Rect;
		Rect = Parent.id;
	}
	
	//	gr: this was context before canvas??
	this.CanvasElement = this.InitCanvasElement( Name, Parent, Rect );
	
	this.SetCanvasSize();
	this.RefreshCanvasResolution();
	this.InitialiseContext();

	this.RenderLoop();
}


//	base class with generic opengl stuff
Pop.Opengl.RenderTarget = function()
{
	this.GetRenderContext = function()
	{
		throw "Override this on your render target";
	}
	
	this.RenderToRenderTarget = function(TargetTexture,RenderFunction,ReadBackFormat,ReadTargetTexture)
	{
		const RenderContext = this.GetRenderContext();
		
		//	setup render target
		let RenderTarget = RenderContext.GetTextureRenderTarget( TargetTexture );
		RenderTarget.BindRenderTarget( RenderContext );
		
		RenderFunction( RenderTarget );
		
		if (ReadBackFormat === true)
		{
			const gl = RenderContext.GetGlContext();
			const Width = RenderTarget.GetRenderTargetRect()[2];
			const Height = RenderTarget.GetRenderTargetRect()[3];
			const Pixels = new Uint8Array(Width * Height * 4);
			gl.readPixels(0,0,Width,Height,gl.RGBA,gl.UNSIGNED_BYTE,Pixels);
			const target = ReadTargetTexture !== undefined ? ReadTargetTexture : TargetTexture
			target.WritePixels(Width,Height,Pixels,'RGBA');
		}
		
		//	todo: restore previously bound, not this.
		//	restore rendertarget
		this.BindRenderTarget( RenderContext );
	}
	
	this.GetGlContext = function()
	{
		const RenderContext = this.GetRenderContext();
		const Context = RenderContext.GetGlContext();
		return Context;
	}
	
	this.ClearColour = function(r,g,b,a=1)
	{
		const gl = this.GetGlContext();
		gl.clearColor( r, g, b, a );
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	}

	this.ClearDepth = function()
	{
		const gl = this.GetGlContext();
		gl.clear(gl.DEPTH_BUFFER_BIT);
	}

	this.ResetState = function()
	{
		const gl = this.GetGlContext();
		gl.disable(gl.CULL_FACE);
		gl.disable(gl.BLEND);
		gl.enable(gl.DEPTH_TEST);
		gl.enable(gl.SCISSOR_TEST);
		//	to make blending work well, don't reject things on same plane
		gl.depthFunc(gl.LEQUAL);
	}
	
	this.SetBlendModeBlit = function()
	{
		const gl = this.GetGlContext();
		
		gl.enable( gl.BLEND );
		gl.blendFunc( gl.ONE, gl.ZERO );
		gl.blendEquation( gl.FUNC_ADD );
	}
	
	this.SetBlendModeAlpha = function()
	{
		const gl = this.GetGlContext();
		
		//	set mode
		//	enable blend
		gl.enable( gl.BLEND );
		gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );
		gl.blendEquation( gl.FUNC_ADD );
	}
	
	this.SetBlendModeMax = function()
	{
		const gl = this.GetGlContext();
		if ( gl.EXT_blend_minmax === undefined )
			throw "EXT_blend_minmax hasn't been setup on this context";
		
		//	set mode
		//	enable blend
		gl.enable( gl.BLEND );
		gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );
		//gl.blendEquation( gl.FUNC_ADD );
		gl.blendEquation( gl.EXT_blend_minmax.MAX_EXT );
		//GL_FUNC_ADD
	}
	
	this.DrawGeometry = function(Geometry,Shader,SetUniforms,TriangleCount)
	{
		const RenderContext = this.GetRenderContext();
		
		//	0 gives a webgl error/warning so skip it
		if ( TriangleCount === 0 )
		{
			//Pop.Debug("Triangle count",TriangleCount);
			return;
		}
		
		const gl = this.GetGlContext();
		
		//	this doesn't make any difference
		if ( gl.CurrentBoundShaderHash != GetUniqueHash(Shader) )
		{
			const Program = Shader.GetProgram(RenderContext);
			gl.useProgram( Program );
			gl.CurrentBoundShaderHash = GetUniqueHash(Shader);
			Pop.Opengl.Stats.ShaderBinds++;
		}
		else
		{
			Pop.Opengl.Stats.ShaderBindSkip++;
		}
		
		//	this doesn't make any difference
		if ( gl.CurrentBoundGeometryHash != GetUniqueHash(Geometry) )
		{
			Geometry.Bind( RenderContext );
			gl.CurrentBoundGeometryHash = GetUniqueHash(Geometry);
			Pop.Opengl.Stats.GeometryBinds++;
		}
		else
		{
			Pop.Opengl.Stats.GeometryBindSkip++;
		}
		SetUniforms( Shader, Geometry );

		const GeoTriangleCount = Geometry.IndexCount/3;
		if ( TriangleCount === undefined )
			TriangleCount = GeoTriangleCount;

		//	if we try and render more triangles than geometry has, webgl sometimes will render nothing and give no warning
		TriangleCount = Math.min( TriangleCount, GeoTriangleCount );

		Pop.Opengl.Stats.TrianglesDrawn += TriangleCount;
		Pop.Opengl.Stats.BatchesDrawn += 1;
		gl.drawArrays( Geometry.PrimitiveType, 0, TriangleCount * 3 );
	}
	
}


//	maybe this should be an API type
Pop.Opengl.TextureRenderTarget = function(Images)
{
	Pop.Opengl.RenderTarget.call( this );
	if ( !Array.isArray(Images) )
		throw "Pop.Opengl.TextureRenderTarget now expects array of images for MRT support";
	
	this.FrameBuffer = null;
	this.FrameBufferContextVersion = null;
	this.FrameBufferRenderContext = null;
	this.Images = Images;
	
	this.IsImagesValid = function()
	{
		// Pop.Debug("IsImagesValid",this);
		
		//	if multiple images, size and format need to be the same
		const Image0 = this.Images[0];
		const IsSameAsImage0 = function(Image)
		{
			if ( Image.GetWidth() != Image0.GetWidth() )	return false;
			if ( Image.GetHeight() != Image0.GetHeight() )	return false;
			if ( Image.PixelsFormat != Image0.PixelsFormat )	return false;
			return true;
		}
		if ( !this.Images.every( IsSameAsImage0 ) )
			throw "Images for MRT are not all same size & format";
		
		//	reject some formats
		//	todo: need to pre-empt this some how on mobile, rather than at instantiation of the framebuffer
		//
		const IsImageRenderable = function(Image)
		{
			const IsFloat = Image.PixelsFormat.startsWith('Float');
			if ( IsFloat && Pop.Opengl.CanRenderToFloat===false )
				throw "This platform cannot render to " + Image.PixelsFormat + " texture";
		}
		IsImageRenderable(Image0);
	}
	
	this.GetRenderContext = function()
	{
		return this.FrameBufferRenderContext;
	}
	
	this.GetRenderTargetRect = function()
	{
		const FirstImage = this.Images[0];
		let Rect = [0,0,0,0];
		Rect[2] = FirstImage.GetWidth();
		Rect[3] = FirstImage.GetHeight();
		return Rect;
	}
	
	this.CreateFrameBuffer = function(RenderContext)
	{
		const gl = RenderContext.GetGlContext();
		this.FrameBuffer = gl.createFramebuffer();
		this.FrameBufferContextVersion = RenderContext.ContextVersion;
		this.FrameBufferRenderContext = RenderContext;
		
		
		//this.BindRenderTarget();
		gl.bindFramebuffer( gl.FRAMEBUFFER, this.FrameBuffer );
		
		//  attach this texture to colour output
		const Level = 0;
		
		//	one binding, use standard mode
		if ( this.Images.length == 1 )
		{
			const Image = this.Images[0];
			const AttachmentPoint = gl.COLOR_ATTACHMENT0;
			const Texture = Image.GetOpenglTexture( RenderContext );
			gl.bindTexture(gl.TEXTURE_2D, null);
			gl.framebufferTexture2D(gl.FRAMEBUFFER, AttachmentPoint, gl.TEXTURE_2D, Texture, Level );
		}
		else
		{
			//	MRT
			if ( !gl.WEBGL_draw_buffers )
				throw "Context doesn't support MultipleRenderTargets/WEBGL_draw_buffers";
			const AttachmentPoints = gl.WEBGL_draw_buffers.AttachmentPoints;
			const Attachments = [];
			function BindTextureColourAttachment(Image,Index)
			{
				const AttachmentPoint = AttachmentPoints[Index];
				const Texture = Image.GetOpenglTexture( RenderContext );
				Attachments.push( AttachmentPoint );
				gl.framebufferTexture2D(gl.FRAMEBUFFER, AttachmentPoint, gl.TEXTURE_2D, Texture, Level );
			}
			this.Images.forEach( BindTextureColourAttachment );
			
			//	set gl_FragData binds in the shader
			gl.drawBuffers( Attachments );
		}
		
		if ( !gl.isFramebuffer( this.FrameBuffer ) )
			Pop.Debug("Is not frame buffer!");
		const Status = gl.checkFramebufferStatus( gl.FRAMEBUFFER );
		if ( Status != gl.FRAMEBUFFER_COMPLETE )
			throw "New framebuffer attachment status not complete: " + Pop.Opengl.GetString(gl,Status);
		
		if ( TestFrameBuffer )
			if ( !gl.isFramebuffer( this.FrameBuffer ) )
				throw "Is not frame buffer!";
		//let Status = gl.checkFramebufferStatus( this.FrameBuffer );
		//Pop.Debug("Framebuffer status",Status);
	}
	
	this.GetFrameBuffer = function()
	{
		return this.FrameBuffer;
	}
	
	//  bind for rendering
	this.BindRenderTarget = function(RenderContext)
	{
		const gl = RenderContext.GetGlContext();
		
		if ( this.FrameBufferContextVersion !== RenderContext.ContextVersion )
		{
			this.FrameBuffer = null;
			this.FrameBufferContextVersion = null;
			this.FrameBufferRenderContext = null;
		}

		if ( !this.FrameBuffer )
		{
			this.CreateFrameBuffer( RenderContext );
		}
		
		if ( TestFrameBuffer )
			if ( !gl.isFramebuffer( this.FrameBuffer ) )
				throw "Is not frame buffer!";

		const FrameBuffer = this.GetFrameBuffer();
		
		//	todo: make this common code
		gl.bindFramebuffer( gl.FRAMEBUFFER, FrameBuffer );
		
		if ( gl.WEBGL_draw_buffers )
		{
			const Attachments = gl.WEBGL_draw_buffers.AttachmentPoints.slice( 0, this.Images.length );
			gl.drawBuffers( Attachments );
		}
		
		//	gr: this is givng errors...
		//let Status = gl.checkFramebufferStatus( this.FrameBuffer );
		//Pop.Debug("Framebuffer status",Status);
		const Viewport = this.GetRenderTargetRect();
		gl.viewport( ...Viewport );
		gl.scissor( ...Viewport );
		
		this.ResetState();
	}
	
	this.AllocTexureIndex = function()
	{
		return this.RenderContext.AllocTexureIndex();
	}
	
	//	verify each image is same dimensions (and format?)
	this.IsImagesValid();
}

function WindowRenderTarget(Window)
{
	const RenderContext = Window;
	this.ViewportMinMax = [0,0,1,1];

	Pop.Opengl.RenderTarget.call( this );

	this.GetFrameBuffer = function()
	{
		return null;
	}
	
	this.GetRenderContext = function()
	{
		return RenderContext;
	}
	
	this.AllocTexureIndex = function()
	{
		return Window.AllocTexureIndex();
	}

	this.GetScreenRect = function()
	{
		return Window.GetScreenRect();
	}

	this.GetRenderTargetRect = function()
	{
		let Rect = this.GetScreenRect();
		Rect[0] = 0;
		Rect[1] = 0;
		return Rect;
	}

	
	this.BindRenderTarget = function(RenderContext)
	{
		const gl = RenderContext.GetGlContext();
		const FrameBuffer = this.GetFrameBuffer();

		//	todo: make this common code
		gl.bindFramebuffer( gl.FRAMEBUFFER, FrameBuffer );
		const RenderRect = this.GetRenderTargetRect();
		let ViewportMinx = this.ViewportMinMax[0] * RenderRect[2];
		let ViewportMiny = this.ViewportMinMax[1] * RenderRect[3];
		let ViewportWidth = this.GetViewportWidth();
		let ViewportHeight = this.GetViewportHeight();

		//const Viewport = this.GetRenderTargetRect();
		//	viewport in pixels in webgl
		const Viewport = [ViewportMinx, ViewportMiny, ViewportWidth, ViewportHeight];
		gl.viewport( ...Viewport );
		gl.scissor( ...Viewport );
		
		this.ResetState();
	}
	
	this.GetViewportWidth = function()
	{
		const RenderRect = this.GetRenderTargetRect();
		return RenderRect[2] * (this.ViewportMinMax[2]-this.ViewportMinMax[0]);
	}
	
	this.GetViewportHeight = function()
	{
		const RenderRect = this.GetRenderTargetRect();
		return RenderRect[3] * (this.ViewportMinMax[3]-this.ViewportMinMax[1]);
	}
	
}



Pop.Opengl.Shader = function(Name,VertShaderSource,FragShaderSource)
{
	if ( typeof Name != 'string' )
	{
		Pop.Warning(`Shader constructor first argument is no longer a context`);
		Name = 'A shader';
	}
	this.Name = Name;
	this.Program = null;
	this.ProgramContextVersion = null;
	this.Context = null;			//	 need to remove this, currently still here for SetUniformConvinience
	this.UniformMetaCache = null;	//	may need to invalidate this on new context
	

	this.VertShaderSource = Pop.Opengl.RefactorVertShader(VertShaderSource);
	this.FragShaderSource = Pop.Opengl.RefactorFragShader(FragShaderSource);

	this.GetGlContext = function()
	{
		return this.Context.GetGlContext();
	}
	
	this.GetProgram = function(RenderContext)
	{
		//	if out of date, recompile
		if ( this.ProgramContextVersion !== RenderContext.ContextVersion )
		{
			this.Program = this.CompileProgram( RenderContext );
			this.ProgramContextVersion = RenderContext.ContextVersion;
			this.UniformMetaCache = null;
			this.Context = RenderContext;
		}
		return this.Program;
	}
	
	function StringToAsciis(String)
	{
		const Asciis = [];
		for ( let i=0;	i<String.length;	i++ )
			Asciis.push( String.charCodeAt(i) );
		return Asciis;
	}
	
	function IsNonAsciiCharCode(CharCode)
	{
		if ( CharCode >= 128 )
			return true;
		if ( CharCode < 0 )
			return true;
		
		//	wierdly, glsl (on a 2011 imac, AMD Radeon HD 6970M 1024 MB, safari, high sierra)
		//	considers ' (ascii 39) a non-ascii char
		if ( CharCode == 39 )
			return true;
		return false;
	}
	
	function CleanNonAsciiString(TheString)
	{
		//	safari glsl (on a 2011 imac, AMD Radeon HD 6970M 1024 MB, safari, high sierra)
		//	rejects these chracters as "non-ascii"
		//const NonAsciiCharCodes = [39];
		//const NonAsciiChars = NonAsciiCharCodes.map( cc => {	return String.fromCharCode(cc);});
		const NonAsciiChars = "'@";
		const ReplacementAsciiChar = '_';
		const Match = `[${NonAsciiChars}]`;
		var NonAsciiRegex = new RegExp(Match, 'g');
		const CleanString = TheString.replace(NonAsciiRegex,ReplacementAsciiChar);
		return CleanString;
	}
	
	function CleanLineFeeds(TheString)
	{
		const Lines = TheString.split(/\r?\n/);
		const NewLines = Lines.join('\n');
		return NewLines;
	}
	
	this.CompileShader = function(RenderContext,Type,Source,TypeName)
	{
		Source = CleanNonAsciiString(Source);
		
		//	safari will fail in shaderSource with non-ascii strings, so detect them to make it easier
		const Asciis = StringToAsciis(Source);
		const FirstNonAscii = Asciis.findIndex(IsNonAsciiCharCode);
		if ( FirstNonAscii != -1 )
		{
			const SubSample = 8;
			let NonAsciiSubString = Source.substring( FirstNonAscii-SubSample, FirstNonAscii );
			NonAsciiSubString += `>>>>${Source[FirstNonAscii]}<<<<`;
			NonAsciiSubString += Source.substring( FirstNonAscii+1, FirstNonAscii+SubSample );
			throw `glsl source has non-ascii char around ${NonAsciiSubString}`;
		}
		
		Source = CleanLineFeeds(Source);
		
		const gl = RenderContext.GetGlContext();
		const Shader = gl.createShader(Type);
		gl.shaderSource( Shader, Source );
		gl.compileShader( Shader );
		
		const CompileStatus = gl.getShaderParameter( Shader, gl.COMPILE_STATUS);
		if ( !CompileStatus )
		{
			let Error = gl.getShaderInfoLog(Shader);
			throw `Failed to compile ${this.Name}(${TypeName}): ${Error}`;
		}
		return Shader;
	}
	
	this.CompileProgram = function(RenderContext)
	{
		let gl = RenderContext.GetGlContext();
		
		const FragShader = this.CompileShader( RenderContext, gl.FRAGMENT_SHADER, this.FragShaderSource, 'Frag' );
		const VertShader = this.CompileShader( RenderContext, gl.VERTEX_SHADER, this.VertShaderSource, 'Vert' );
		
		let Program = gl.createProgram();
		gl.attachShader( Program, VertShader );
		gl.attachShader( Program, FragShader );
		gl.linkProgram( Program );
		
		let LinkStatus = gl.getProgramParameter( Program, gl.LINK_STATUS );
		if ( !LinkStatus )
		{
			//	gr: list cases when no error "" occurs here;
			//	- too many varyings > MAX_VARYING_VECTORS
			const Error = gl.getProgramInfoLog(Program);
			throw "Failed to link " + this.Name + " shaders; " + Error;
		}
		return Program;
	}
	
	
	//	gr: can't tell the difference between int and float, so err that wont work
	this.SetUniform = function(Uniform,Value)
	{
		const UniformMeta = this.GetUniformMeta(Uniform);
		if ( !UniformMeta )
			return;
		if( Array.isArray(Value) )					this.SetUniformArray( Uniform, UniformMeta, Value );
		else if( Value instanceof Float32Array )	this.SetUniformArray( Uniform, UniformMeta, Value );
		else if ( Value instanceof Pop.Image )		this.SetUniformTexture( Uniform, UniformMeta, Value, this.Context.AllocTexureIndex() );
		else if ( typeof Value === 'number' )		this.SetUniformNumber( Uniform, UniformMeta, Value );
		else if ( typeof Value === 'boolean' )		this.SetUniformNumber( Uniform, UniformMeta, Value );
		else
		{
			console.log(typeof Value);
			console.log(Value);
			throw "Failed to set uniform " +Uniform + " to " + ( typeof Value );
		}
	}
	
	this.SetUniformArray = function(UniformName,UniformMeta,Values)
	{
		const ExpectedValueCount = UniformMeta.ElementSize * UniformMeta.ElementCount;
		
		//	all aligned
		if ( Values.length == ExpectedValueCount )
		{
			UniformMeta.SetValues( Values );
			return;
		}
		
		//Pop.Debug("SetUniformArray("+UniformName+") slow path");
		
		//	note: uniform iv may need to be Int32Array;
		//	https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/uniform
		//	enumerate the array
		let ValuesExpanded = [];
		let EnumValue = function(v)
		{
			if ( Array.isArray(v) )
				ValuesExpanded.push(...v);
			else if ( typeof v == "object" )
				v.Enum( function(v)	{	ValuesExpanded.push(v);	} );
			else
				ValuesExpanded.push(v);
		};
		Values.forEach( EnumValue );
		
		//	check array size (allow less, but throw on overflow)
		//	error if array is empty
		while ( ValuesExpanded.length < ExpectedValueCount )
			ValuesExpanded.push(0);
		/*
		 if ( ValuesExpanded.length > UniformMeta.size )
		 throw "Trying to put array of " + ValuesExpanded.length + " values into uniform " + UniformName + "[" + UniformMeta.size + "] ";
		 */
		UniformMeta.SetValues( ValuesExpanded );
	}
	
	this.SetUniformTexture = function(Uniform,UniformMeta,Image,TextureIndex)
	{
		const Texture = Image.GetOpenglTexture( this.Context );
		const gl = this.GetGlContext();
		//  https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Using_textures_in_WebGL
		//  WebGL provides a minimum of 8 texture units;
		const GlTextureNames = [ gl.TEXTURE0, gl.TEXTURE1, gl.TEXTURE2, gl.TEXTURE3, gl.TEXTURE4, gl.TEXTURE5, gl.TEXTURE6, gl.TEXTURE7 ];
		//	setup textures
		gl.activeTexture( GlTextureNames[TextureIndex] );
		try
		{
			gl.bindTexture(gl.TEXTURE_2D, Texture );
		}
		catch(e)
		{
			Pop.Debug("SetUniformTexture: " + e);
			//  todo: bind an "invalid" texture
		}
		UniformMeta.SetValues( [TextureIndex] );
	}
	
	this.SetUniformNumber = function(Uniform,UniformMeta,Value)
	{
		//	these are hard to track down and pretty rare anyone would want a nan
		if ( isNaN(Value) )
			throw "Setting NaN on Uniform " + Uniform.Name;

		const gl = this.GetGlContext();
		UniformMeta.SetValues( [Value] );
	}
	
	this.GetUniformMetas = function()
	{
		if ( this.UniformMetaCache )
			return this.UniformMetaCache;
	
		//	iterate and cache!
		this.UniformMetaCache = {};
		let gl = this.GetGlContext();
		let UniformCount = gl.getProgramParameter( this.Program, gl.ACTIVE_UNIFORMS );
		for ( let i=0;	i<UniformCount;	i++ )
		{
			let UniformMeta = gl.getActiveUniform( this.Program, i );
			UniformMeta.ElementCount = UniformMeta.size;
			UniformMeta.ElementSize = undefined;
			//	match name even if it's an array
			//	todo: struct support
			let UniformName = UniformMeta.name.split('[')[0];
			//	note: uniform consists of structs, Array[Length] etc
			
			UniformMeta.Location = gl.getUniformLocation( this.Program, UniformMeta.name );
			switch( UniformMeta.type )
			{
				case gl.SAMPLER_2D:	//	samplers' value is the texture index
				case gl.INT:
				case gl.UNSIGNED_INT:
				case gl.BOOL:
					UniformMeta.ElementSize = 1;
					UniformMeta.SetValues = function(v)	{	gl.uniform1iv( UniformMeta.Location, v );	};
					break;
				case gl.FLOAT:
					UniformMeta.ElementSize = 1;
					UniformMeta.SetValues = function(v)	{	gl.uniform1fv( UniformMeta.Location, v );	};
					break;
				case gl.FLOAT_VEC2:
					UniformMeta.ElementSize = 2;
					UniformMeta.SetValues = function(v)	{	gl.uniform2fv( UniformMeta.Location, v );	};
					break;
				case gl.FLOAT_VEC3:
					UniformMeta.ElementSize = 3;
					UniformMeta.SetValues = function(v)	{	gl.uniform3fv( UniformMeta.Location, v );	};
					break;
				case gl.FLOAT_VEC4:
					UniformMeta.ElementSize = 4;
					UniformMeta.SetValues = function(v)	{	gl.uniform4fv( UniformMeta.Location, v );	};
					break;
				case gl.FLOAT_MAT2:
					UniformMeta.ElementSize = 2*2;
					UniformMeta.SetValues = function(v)	{	const Transpose = false;	gl.uniformMatrix2fv( UniformMeta.Location, Transpose, v );	};
					break;
				case gl.FLOAT_MAT3:
					UniformMeta.ElementSize = 3*3;
					UniformMeta.SetValues = function(v)	{	const Transpose = false;	gl.uniformMatrix3fv( UniformMeta.Location, Transpose, v );	};
					break;
				case gl.FLOAT_MAT4:
					UniformMeta.ElementSize = 4*4;
					UniformMeta.SetValues = function(v)	{	const Transpose = false;	gl.uniformMatrix4fv( UniformMeta.Location, Transpose, v );	};
					break;

				default:
					UniformMeta.SetValues = function(v)	{	throw "Unhandled type " + UniformMeta.type + " on " + UniformName;	};
					break;
			}
			
			this.UniformMetaCache[UniformName] = UniformMeta;
		}
		return this.UniformMetaCache;
	}

	this.GetUniformMeta = function(MatchUniformName)
	{
		const Metas = this.GetUniformMetas();
		if ( !Metas.hasOwnProperty(MatchUniformName) )
		{
			//throw "No uniform named " + MatchUniformName;
			//Pop.Debug("No uniform named " + MatchUniformName);
		}
		return Metas[MatchUniformName];
	}
	
}


function GetOpenglElementType(OpenglContext,Elements)
{
	if ( Elements instanceof Float32Array )	return OpenglContext.FLOAT;
	
	throw "GetOpenglElementType unhandled type; " + Elements.prototype.constructor;
}

Pop.Opengl.TriangleBuffer = function(RenderContext,VertexAttributeName,VertexData,VertexSize,TriangleIndexes)
{
	this.BufferContextVersion = null;
	this.Buffer = null;
	this.Vao = null;
	
	let Attribs = {};
	
	//	backwards compatibility
	if ( typeof VertexAttributeName == 'string' )
	{
		Pop.Warn("[deprecated] Old TriangleBuffer constructor, use a keyed object");
		const Attrib = {};
		Attrib.Size = VertexSize;
		Attrib.Data = VertexData;
		Attribs[VertexAttributeName] = Attrib;
	}
	else
	{
		Attribs = VertexAttributeName;
	}
	
	
	this.GetBuffer = function(RenderContext)
	{
		if ( this.BufferContextVersion !== RenderContext.ContextVersion )
		{
			Pop.Warn("Buffer context version changed",this.BufferContextVersion,RenderContext.ContextVersion);
			this.CreateBuffer(RenderContext);
		}
		return this.Buffer;
	}
	
	this.DeleteBuffer = function(RenderContext)
	{
		RenderContext.OnDeletedGeometry( this );
	}
	
	this.DeleteVao = function()
	{
		this.Vao = null;
	}
	
	this.GetVao = function(RenderContext,Shader)
	{
		if ( this.BufferContextVersion !== RenderContext.ContextVersion )
		{
			this.DeleteVao();
		}
		if ( this.Vao )
			return this.Vao;
		
		//	setup vao
		{
			const gl = RenderContext.GetGlContext();
			//this.Vao = gl.OES_vertex_array_object.createVertexArrayOES();
			this.Vao = gl.createVertexArray();
			//	setup buffer & bind stuff in the vao
			gl.bindVertexArray( this.Vao );
			let Buffer = this.GetBuffer( RenderContext );
			gl.bindBuffer( gl.ARRAY_BUFFER, Buffer );
			//	we'll need this if we start having multiple attributes
			if ( DisableOldVertexAttribArrays )
				for ( let i=0;	i<gl.getParameter(gl.MAX_VERTEX_ATTRIBS);	i++)
					gl.disableVertexAttribArray(i);
			this.BindVertexPointers( RenderContext, Shader );
		
			gl.bindVertexArray( null );
		}
		return this.Vao;
	}
			
	
	this.CreateBuffer = function(RenderContext)
	{
		const gl = RenderContext.GetGlContext();
		
		this.Buffer = gl.createBuffer();
		this.BufferContextVersion = RenderContext.ContextVersion;
		
		this.PrimitiveType = gl.TRIANGLES;
		if ( TriangleIndexes )
		{
			this.IndexCount = TriangleIndexes.length;
		}
		else
		{
			const FirstAttrib = Attribs[Object.keys(Attribs)[0]];
			this.IndexCount = (FirstAttrib.Data.length / FirstAttrib.Size);
		}
		
		if ( this.IndexCount % 3 != 0 )
		{
			throw "Triangle index count not divisible by 3";
		}
		
		function CleanupAttrib(Attrib)
		{
			//	fix attribs
			//	data as array doesn't work properly and gives us
			//	gldrawarrays attempt to access out of range vertices in attribute 0
			if ( Array.isArray(Attrib.Data) )
				Attrib.Data = new Float32Array( Attrib.Data );
		}		
		
		let TotalByteLength = 0;
		const GetOpenglAttribute = function(Name,Floats,Location,Size)
		{
			let Type = GetOpenglElementType( gl, Floats );
			
			let Attrib = {};
			Attrib.Name = Name;
			Attrib.Floats = Floats;
			Attrib.Size = Size;
			Attrib.Type = Type;
			Attrib.Location = Location;
			return Attrib;
		}
		function AttribNameToOpenglAttrib(Name,Index)
		{
			//	should get location from shader binding!
			const Location = Index;
			const Attrib = Attribs[Name];
			CleanupAttrib(Attrib);
			const OpenglAttrib = GetOpenglAttribute( Name, Attrib.Data, Location, Attrib.Size );
			TotalByteLength += Attrib.Data.byteLength;
			return OpenglAttrib;
		}
		
		this.Attributes = Object.keys( Attribs ).map( AttribNameToOpenglAttrib );
		
		//	concat data
		let TotalData = new Float32Array( TotalByteLength / 4 );//Float32Array.BYTES_PER_ELEMENT );
		
		let TotalDataOffset = 0;
		for ( let Attrib of this.Attributes )
		{
			TotalData.set( Attrib.Floats, TotalDataOffset );
			Attrib.ByteOffset = TotalDataOffset * Float32Array.BYTES_PER_ELEMENT;
			TotalDataOffset += Attrib.Floats.length;
			this.OpenglByteSize = TotalDataOffset;
		}
		
		//	set the total buffer data
		gl.bindBuffer( gl.ARRAY_BUFFER, this.Buffer );
		if ( TotalData )
		{
			gl.bufferData( gl.ARRAY_BUFFER, TotalData, gl.STATIC_DRAW );
		}
		else
		{
			//	init buffer size
			gl.bufferData(gl.ARRAY_BUFFER, TotalByteLength, gl.STREAM_DRAW);
			//gl.bufferData( gl.ARRAY_BUFFER, VertexData, gl.STATIC_DRAW );

			let AttribByteOffset = 0;
			function BufferAttribData(Attrib)
			{
				//gl.bufferData( gl.ARRAY_BUFFER, VertexData, gl.STATIC_DRAW );
				gl.bufferSubData( gl.ARRAY_BUFFER, AttribByteOffset, Attrib.Floats );
				Attrib.ByteOffset = AttribByteOffset;
				AttribByteOffset += Attrib.Floats.byteLength;
			}
			this.Attributes.forEach( BufferAttribData );
			this.OpenglByteSize = AttribByteOffset;
		}
		
		RenderContext.OnAllocatedGeometry( this );
		
		this.BindVertexPointers( RenderContext );
	}
	
	
	
	this.BindVertexPointers = function(RenderContext,Shader)
	{
		const gl = RenderContext.GetGlContext();
		
		//	setup offset in buffer
		let InitAttribute = function(Attrib)
		{
			let Location = Attrib.Location;
			
			if ( Shader && TestAttribLocation )
			{
				let ShaderLocation = gl.getAttribLocation( Shader.Program, Attrib.Name );
				if ( ShaderLocation != Location )
				{
					Pop.Debug("Warning, shader assigned location (" + ShaderLocation +") different from predefined location ("+ Location + ")");
					Location = ShaderLocation;
				}
			}
			
			let Normalised = false;
			let StrideBytes = 0;
			let OffsetBytes = Attrib.ByteOffset;
			gl.vertexAttribPointer( Attrib.Location, Attrib.Size, Attrib.Type, Normalised, StrideBytes, OffsetBytes );
			gl.enableVertexAttribArray( Attrib.Location );
		}
		this.Attributes.forEach( InitAttribute );
	}
	
	this.Bind = function(RenderContext,Shader)
	{
		const Vao = AllowVao ? this.GetVao( RenderContext, Shader ) : null;
		const gl = RenderContext.GetGlContext();

		if ( Vao )
		{
			gl.bindVertexArray( Vao );
		}
		else
		{
			const Buffer = this.GetBuffer(RenderContext);
			gl.bindBuffer( gl.ARRAY_BUFFER, Buffer );
			
			//	we'll need this if we start having multiple attributes
			if ( DisableOldVertexAttribArrays )
				for ( let i=0;	i<gl.getParameter(gl.MAX_VERTEX_ATTRIBS);	i++)
					gl.disableVertexAttribArray(i);
			//	gr: we get glDrawArrays: attempt to access out of range vertices in attribute 0, if we dont update every frame (this seems wrong)
			//		even if we call gl.enableVertexAttribArray
			this.BindVertexPointers( RenderContext, Shader );
		}
	}
}

