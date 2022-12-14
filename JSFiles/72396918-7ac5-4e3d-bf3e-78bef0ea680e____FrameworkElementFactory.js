/**
 * FrameworkElementFactory
 */

define(["dojo/_base/declare", "system/Type", "utility/FrugalStructList", "windows/DependencyProperty", 
        "controls/ContentPresenter", "controls/GridViewRowPresenter", "windows/TemplateNameScope",
        "markup/MarkupExtension", "windows/DeferredReference"], 
		function(declare, Type, FrugalStructList, DependencyProperty, 
				ContentPresenter, GridViewRowPresenter, TemplateNameScope,
				MarkupExtension, DeferredReference){
	
//	var ContentPresenter = null;
//	function EnsureContentPresenter(){
//		if(ContentPresenter == null){
//			ContentPresenter = using("controls/ContentPresenter");
//		}
//		
//		return ContentPresenter;
//	}
	
    // Auto-generated ChildID uniqueness
    // Synchronized: Covered by Interlocked.Increment 
//    private static int 
    var AutoGenChildNamePostfix = 1;
//    private static string 
    var AutoGenChildNamePrefix = "~ChildID"; 
    
	var FrameworkElementFactory = declare("FrameworkElementFactory", null,{

		constructor:function(/*Type*/ type, /*string*/ name)
        { 
//			if(type === undefined){
//				type = null;
//			}
//			
//			if(name ===undefined){
//				name = null;
//			}
			
//	        private string 
	        this._childName = null; 
			
//	        private string 
	        this._text = null;
			if(arguments.length ==2) {
		        this.Type = type;
		        this.Name = name;
			}else if(arguments.length == 1){
				if(typeof type == "string"){
					this.Text = type;
				}else{
					this.Type = type;
				}
			}
			 
	        this._sealed = false;

	        // Synchronized (write locks, lock-free reads): Covered by FrameworkElementFactory instance lock
//	        /* property */ internal FrugalStructList<System.Windows.PropertyValue> 
	        this.PropertyValues = new FrugalStructList/*<System.Windows.PropertyValue>*/(); 

	        // Store all the event handlers for this FEF 
	        // NOTE: We cannot use UnCommonField<T> because that uses property engine 
	        // storage that can be set only on a DependencyObject
//	        private EventHandlersStore 
	        this._eventHandlersStore = null; 

//	        internal bool   
	        this._hasLoadedChangeHandler = false;



//	        private Func<object> 
	        this._knownTypeFactory = null; 

//	        internal int 
	        this._childIndex = -1; // Being used in Style.ProcessTemplateStyles
	 
//	        private FrameworkTemplate 
	        this._frameworkTemplate = null;

	 
//	        private FrameworkElementFactory 
	        this._parent = null;
//	        private FrameworkElementFactory 
	        this._firstChild = null; 
//	        private FrameworkElementFactory 
	        this._lastChild = null;
//	        private FrameworkElementFactory 
	        this._nextSibling = null;
		},
		

		 
        /// <summary>
        ///     Add a factory child to this factory
        /// </summary>
        /// <param name="child">Child to add</param> 
//        public void 
        AppendChild:function(/*FrameworkElementFactory*/ child)
        { 
            if (this._sealed) 
            {
                throw new InvalidOperationException(SR.Get(SRID.CannotChangeAfterSealed, "FrameworkElementFactory")); 
            }

            if (child == null)
            { 
                throw new ArgumentNullException("child");
            } 
 
            if (child._parent != null)
            { 
                throw new ArgumentException(SR.Get(SRID.FrameworkElementFactoryAlreadyParented));
            }

            if (this._text != null) 
            {
                throw new InvalidOperationException(SR.Get(SRID.FrameworkElementFactoryCannotAddText)); 
            } 

            // Build tree of factories 
            if (this._firstChild == null)
            {
            	this._firstChild = child;
            	this._lastChild = child; 
            }
            else 
            { 
            	this._lastChild._nextSibling = child;
            	this._lastChild = child; 
            }

            child._parent = this;
        }, 

        /// <summary> 
        ///     Simple value set on template child 
        /// </summary>
        /// <param name="dp">Dependent property</param> 
        /// <param name="value">Value to set</param>
//        public void 
        SetValue:function(/*DependencyProperty*/ dp, /*object*/ value)
        {
            if (this._sealed) 
            {
                throw new Error('InvalidOperationException(SR.Get(SRID.CannotChangeAfterSealed, "FrameworkElementFactory")'); 
            } 

            if (dp == null) 
            {
                throw new Error('ArgumentNullException("dp")');
            }
 
            // Value needs to be valid for the DP, or Binding/MultiBinding/PriorityBinding.
            //  (They all have MarkupExtension, which we don't actually support, see above check.) 
 
            if (!dp.IsValidValue(value) && !(value instanceof MarkupExtension) && !(value instanceof DeferredReference))
            { 
                throw new Error('ArgumentException(SR.Get(SRID.InvalidPropertyValue, value, dp.Name)');
            }

            // Styling the logical tree is not supported 
            if (StyleHelper.IsStylingLogicalTree(dp, value))
            { 
                throw new Error('NotSupportedException(SR.Get(SRID.ModifyingLogicalTreeViaStylesNotImplemented, value, "FrameworkElementFactory.SetValue")'); 
            }
 
//            #pragma warning suppress 6506 // dp.DefaultMetadata is never null
            if (dp.ReadOnly)
            {
                // Read-only properties will not be consulting FrameworkElementFactory for value. 
                //  Rather than silently do nothing, throw error.
                throw new Error('ArgumentException(SR.Get(SRID.ReadOnlyPropertyNotAllowed, dp.Name, GetType().Name)'); 
            } 

            /*ResourceReferenceExpression*/
            var resourceExpression = value instanceof ResourceReferenceExpression ? value : null; 
            
            /*DynamicResourceExtension*/
            var dynamicResourceExtension = value instanceof DynamicResourceExtension ? value : null;
            
            /*object*/var resourceKey = null;

            if( resourceExpression != null ) 
            {
                resourceKey = resourceExpression.ResourceKey; 
            } 
            else if( dynamicResourceExtension != null )
            { 
                resourceKey = dynamicResourceExtension.ResourceKey;
            }

            if (resourceKey == null) 
            {
                /*TemplateBindingExtension*/
            	var templateBinding = value instanceof TemplateBindingExtension ? value : null; 
                if (templateBinding == null) 
                {
                    this.UpdatePropertyValueList( dp, PropertyValueType.Set, value ); 
                }
                else
                {
                	this.UpdatePropertyValueList( dp, PropertyValueType.TemplateBinding, templateBinding ); 
                }
            } 
            else 
            {
            	this.UpdatePropertyValueList(dp, PropertyValueType.Resource, resourceKey); 
            }
        },

        /// <summary> 
        ///     Set up data binding on template child
        /// </summary> 
        /// <param name="dp">Dependent property</param> 
        /// <param name="binding">Description of binding</param>
//        public void 
        SetBinding:function(/*DependencyProperty*/ dp, /*BindingBase*/ binding) 
        {
            // store Binding in the style - this will get converted to Binding
            // on demand (see Style.ProcessApplyValuesHelper)
        	this.SetValue(dp, binding); 
        },
 
        /// <summary> 
        ///     Resource binding on template child
        /// </summary> 
        /// <param name="dp">Dependent property</param>
        /// <param name="name">Resource identifier</param>
//        public void 
        SetResourceReference:function(/*DependencyProperty*/ dp, /*object*/ name)
        { 
            if (this._sealed)
            { 
                throw new Error('InvalidOperationException(SR.Get(SRID.CannotChangeAfterSealed, "FrameworkElementFactory")'); 
            }
 
            if (dp == null)
            {
                throw new Error('ArgumentNullException("dp")');
            } 

            this.UpdatePropertyValueList( dp, PropertyValueType.Resource, name ); 
        },

        /// <summary> 
        ///     Add an event handler for the given routed event. This action applies to the instances created by this factory
        /// </summary>
//        public void 
        AddHandler:function(/*RoutedEvent*/ routedEvent, /*Delegate*/ handler)
        { 
            // HandledEventToo defaults to false
            // Call forwarded 
            this.AddHandler(routedEvent, handler, false); 
        },
 
        /// <summary>
        ///     Add an event handler for the given routed event. This action applies to the instances created by this factory
        /// </summary>
//        public void 
        AddHandler:function(/*RoutedEvent*/ routedEvent, /*Delegate*/ handler, /*bool*/ handledEventsToo) 
        {
            if (this._sealed) 
            { 
                throw new Error('InvalidOperationException(SR.Get(SRID.CannotChangeAfterSealed, "FrameworkElementFactory")');
            } 

            if (routedEvent == null)
            {
                throw new Error('ArgumentNullException("routedEvent")'); 
            }
 
            if (handler == null) 
            {
                throw new Error('ArgumentNullException("handler")'); 
            }

            if (handler.GetType() != routedEvent.HandlerType)
            { 
                throw new Error('ArgumentException(SR.Get(SRID.HandlerTypeIllegal)');
            } 
 
            if (this._eventHandlersStore == null)
            { 
            	this._eventHandlersStore = new EventHandlersStore();
            }

            this._eventHandlersStore.AddRoutedEventHandler(routedEvent, handler, handledEventsToo); 

            // Keep track of whether we're listening to the loaded or unloaded events; 
            // if so, we have to trigger a listener in the FE/FCE (as a performance 
            // optimization).
 
            if (  (routedEvent == FrameworkElement.LoadedEvent)
                ||(routedEvent == FrameworkElement.UnloadedEvent))
            {
            	this.HasLoadedChangeHandler = true; 
            }
        },
 
        /// <summary>
        ///     Remove an event handler for the given routed event. This action applies to the instances created by this factory 
        /// </summary>
//        public void 
        RemoveHandler:function(/*RoutedEvent*/ routedEvent, /*Delegate*/ handler)
        {
            if (this._sealed) 
            {
                throw new Error('InvalidOperationException(SR.Get(SRID.CannotChangeAfterSealed, "FrameworkElementFactory")'); 
            } 

            if (routedEvent == null) 
            {
                throw new Error('ArgumentNullException("routedEvent")');
            }
 
            if (handler == null)
            { 
                throw new Error('ArgumentNullException("handler")'); 
            }
 
            if (handler.GetType() != routedEvent.HandlerType)
            {
                throw new Error('ArgumentException(SR.Get(SRID.HandlerTypeIllegal)');
            } 

            if (this._eventHandlersStore != null) 
            { 
            	this._eventHandlersStore.RemoveRoutedEventHandler(routedEvent, handler);
 
                // Update the loaded/unloaded optimization flags if necessary

                if (  (routedEvent == FrameworkElement.LoadedEvent)
                    ||(routedEvent == FrameworkElement.UnloadedEvent)) 
                {
                    if (  !this._eventHandlersStore.Contains(FrameworkElement.LoadedEvent) 
                        &&!this._eventHandlersStore.Contains(FrameworkElement.UnloadedEvent)) 
                    {
                        this.HasLoadedChangeHandler = false; 
                    }
                }
            }
        },
        
        /// <summary>
        ///     Given a set of values for the PropertyValue struct, put that in 
        /// to the PropertyValueList, overwriting any existing entry.
        /// </summary>
//        private void 
        UpdatePropertyValueList:function(
            /*DependencyProperty*/ dp, 
            /*PropertyValueType*/ valueType,
            /*object*/ value) 
        { 
            // Check for existing value on dp
            var existingIndex = -1; 
            for( var i = 0; i < this.PropertyValues.Count; i++ )
            {
                if( this.PropertyValues.Get(i).Property == dp )
                { 
                    existingIndex = i;
                    break; 
                } 
            }
 
            if( existingIndex >= 0 )
            {
                // Overwrite existing value for dp
//                lock (_synchronized) 
//                {
                /*PropertyValue*/var propertyValue = this.PropertyValues.Get(existingIndex); 
                propertyValue.ValueType = valueType; 
                propertyValue.ValueInternal = value;
                // Put back modified struct 
                this.PropertyValues.Set(existingIndex, propertyValue);
//                }
            }
            else 
            {
                // Store original data 
                /*PropertyValue*/var propertyValue = new PropertyValue(); 
                propertyValue.ValueType = valueType;
                propertyValue.ChildName = null;  // Delayed 
                propertyValue.Property = dp;
                propertyValue.ValueInternal = value;

//                lock (_synchronized) 
//                {
                this.PropertyValues.Add(propertyValue); 
//                } 
            }
        }, 

        /// <summary>
        ///     Create a DependencyObject instance of the specified type
        /// </summary> 
        /// <remarks>
        ///     By default, reflection is used to create the instance. For 
        ///     best perf, override this and do specific construction 
        /// </remarks>
        /// <returns>New instance</returns> 
//        private DependencyObject 
        CreateDependencyObject:function()
        {
            // Not expecting InvalidCastException - Type.set should have
            //  verified that it is a FrameworkElement or FrameworkContentElement. 

            if (this._knownTypeFactory != null) 
            { 
            	var result = this._knownTypeFactory.Invoke();
                return  result instanceof DependencyObject ? result : null;
            } 

//            return /*(DependencyObject)*/Activator.CreateInstance(this._type);
            return new this._type.Constructor;
        },
        
        
        
//        internal object 
        GetValue:function(/*DependencyProperty*/ dp)
        { 
            // Retrieve a value previously set

            // Scan for record
            for (var i = 0; i < this.PropertyValues.Count; i++) 
            {
                if (this.PropertyValues.Get(i).ValueType == PropertyValueType.Set && 
                		this.PropertyValues.Get(i).Property == dp) 
                {
                    // Found a Set record, return the value 
                    return this.PropertyValues.Get(i).ValueInternal;
                }
            }
 
            return DependencyProperty.UnsetValue;
        },
 
        // Seal this FEF
//        internal void 
        Seal:function(/*FrameworkTemplate*/ ownerTemplate) 
        {
            if (this._sealed)
            {
                return; 
            }
        	if(ownerTemplate !== undefined){
                // Store owner Template 
                this._frameworkTemplate = ownerTemplate;
        	}

//        },
// 
////        private void 
//        Seal:function()
//        { 
            if (this._type == null && this._text == null) 
            {
                throw new Error('InvalidOperationException(SR.Get(SRID.NullTypeIllegal)'); 
            }

            if (this._firstChild != null)
            { 
                // This factory has children, it must implement IAddChild so that these
                // children can be added to the logical tree 
                if (!IAddChild.Type.IsAssignableFrom(this._type)) 
                {
                    throw new Error('InvalidOperationException(SR.Get(SRID.TypeMustImplementIAddChild, _type.Name)'); 
                }
            }

            this.ApplyAutoAliasRules(); 

            if ((this._childName != null) && (this._childName != String.Empty)) 
            { 
                // ChildName provided
                if (!this.IsChildNameValid(this._childName)) 
                {
                    throw new Error('InvalidOperationException(SR.Get(SRID.ChildNameNamePatternReserved, _childName)');
                }
 
//                this._childName = String.Intern(this._childName);
            } 
            else 
            {
                // ChildName not provided 

            	this._childName = this.GenerateChildName();
            }
 

            // Set delayed ChildID for all property triggers
            for (var i = 0; i < this.PropertyValues.Count; i++) 
            {
                /*PropertyValue*/
            	var propertyValue = this.PropertyValues.Get(i);
                propertyValue.ChildName = this._childName;
 
                // Freeze the FEF property value
                StyleHelper.SealIfSealable(propertyValue.ValueInternal); 
 
                //cym comment
//                // Put back modified struct
//                this.PropertyValues.Set(i, propertyValue); 
            }

 
            this._sealed = true;
 
            // Convert ChildName to Template-specific ChildIndex, if applicable 
            if ((this._childName != null) && (this._childName != String.Empty) &&
            		this._frameworkTemplate != null ) 
            {
            	this._childIndex = StyleHelper.CreateChildIndexFromChildName(this._childName, this._frameworkTemplate);
            }
 
            // Seal all children
            /*FrameworkElementFactory*/var child = this._firstChild; 
            while (child != null) 
            {
                if (this._frameworkTemplate != null) 
                {
                    child.Seal(this._frameworkTemplate);
                }
 
                child = child._nextSibling;
            } 
        }, 

        // Instantiate a tree.  This is a recursive routine that will build the 
        //  subtree via calls to itself.  The root node being instantiated will
        //  have identical references for the "container" and "parent" parameters.
        // The "affectedChildren" and "noChildIndexChildren" parameters refer to the children
        //  chain for the "container" object.  This chain will have all the 
        //  children - not just the immediate children.  The node being
        //  instantiated here will be added to this chain. 
        // The tree is instantiated in a depth-first traversal, so children nodes 
        //  are added to the chain in depth-first order as well.
        //[CodeAnalysis("AptcaMethodsShouldOnlyCallAptcaMethods")] //Tracking Bug: 29647 
//        internal DependencyObject 
        InstantiateTree:function(
                /*UncommonField<HybridDictionary[]>*/           dataField,
                /*DependencyObject*/                            container,
                /*DependencyObject*/                            parent, 
                /*List<DependencyObject>*/                      affectedChildren,
            /*ref List<DependencyObject>*/                      noChildIndexChildren, 
            /*ref FrugalStructList<ChildPropertyDependent>*/    resourceDependents) 
        {
//            EventTrace.EasyTraceEvent(EventTrace.Keyword.KeywordXamlBaml, EventTrace.Level.Verbose, EventTrace.Event.WClientParseFefCrInstBegin); 

            /*FrameworkElement*/
        	var containerAsFE = container instanceof FrameworkElement ? container : null;
            /*bool*/
        	var isContainerAnFE = containerAsFE != null;
 
            /*DependencyObject*/
        	var treeNode = null;
            // If we have text, just add it to the parent.  Otherwise create the child 
            // subtree 
            if (this._text != null)
            { 
                // of FrameworkContentElement parent.  This is the logical equivalent
                // to what happens when adding a child to a visual collection.
                /*IAddChild*/
            	var addChildParent = parent instanceof IAddChild ? parent : null;
 
                if (addChildParent == null)
                { 
                    throw new Error('InvalidOperationException(SR.Get(SRID.TypeMustImplementIAddChild, parent.GetType().Name)');
                } 
                else
                {
                    addChildParent.AddText(this._text);
                } 
            }
            else 
            { 
                // Factory create instance
                treeNode = this.CreateDependencyObject(); 

//                EventTrace.EasyTraceEvent(EventTrace.Keyword.KeywordXamlBaml, EventTrace.Level.Verbose, EventTrace.Event.WClientParseFefCrInstEnd);

                // The tree node is either a FrameworkElement or a FrameworkContentElement. 
                //  we'll deal with one or the other...
                /*FrameworkObject*/
                var treeNodeFO = new FrameworkObject(treeNode); 
 
                /*Visual3D*/
                var treeNodeVisual3D = null;
                /*bool*/
                var treeNodeIsVisual3D = false; 

//                Debug.Assert( treeNodeFO.IsValid || (treeNodeVisual3D != null),
//                    "We should not be trying to instantiate a node that is neither FrameworkElement nor FrameworkContentElement.  A type check should have been done when Type is set");
 
                // And here's the bool we'll use to make the decision.
                /*bool*/
                var treeNodeIsFE = treeNodeFO.IsFE; 
 
                // Handle FE/FCE-specific optimizations
 
                if (!treeNodeIsVisual3D)
                {
                    // Postpone "Initialized" event
                	FrameworkElementFactory.NewNodeBeginInit( treeNodeIsFE, treeNodeFO.FE, treeNodeFO.FCE ); 

                    // Set the resource reference flags 
                    if (StyleHelper.HasResourceDependentsForChild(this._childIndex, /*ref*/ resourceDependents)) 
                    {
                        treeNodeFO.HasResourceReference = true; 
                    }

                    // Update the two chains that tracks all the nodes created
                    //  from all the FrameworkElementFactory of this Style. 
                    UpdateChildChains( this._childName, this._childIndex,
                        treeNodeIsFE, treeNodeFO.FE, treeNodeFO.FCE, 
                        affectedChildren, /*ref*/ noChildIndexChildren ); 

                    // All FrameworkElementFactory-created elements point to the object 
                    //  whose Style.VisualTree definition caused all this to occur
                    NewNodeStyledParentProperty( container, isContainerAnFE, treeNodeIsFE, treeNodeFO.FE, treeNodeFO.FCE );

                    // Initialize the per-instance data for the new element.  This 
                    // needs to be done before any properties are invalidated.
                    if (this._childIndex != -1) 
                    { 
//                        Debug.Assert( _frameworkTemplate != null );
 
                        StyleHelper.CreateInstanceDataForChild(dataField, container, treeNode, this._childIndex,
                            this._frameworkTemplate.HasInstanceValues, /*ref*/ this._frameworkTemplate.ChildRecordFromChildIndex);
                    }
 
                    // If this element needs to know about the Loaded or Unloaded events, set the optimization
                    // bit in the element 
 
                    if (this.HasLoadedChangeHandler)
                    { 
                        BroadcastEventHelper.AddHasLoadedChangeHandlerFlagInAncestry(treeNode);
                    }
                }
                else 
                {
                    if (this._childName != null) 
                    { 
                        // Add this instance to the child index chain so that it may
                        // be tracked by the style 

                        affectedChildren.Add(treeNode);
                    }
                    else 
                    {
                        // Child nodes with no _childID (hence no _childIndex) are 
                        //  tracked on a separate chain that will be appended to the 
                        //  main chain for cleanup purposes.
                        if (noChildIndexChildren == null) 
                        {
                            noChildIndexChildren = new List/*<DependencyObject>*/(/*4*/);
                        }
 
                        noChildIndexChildren.Add(treeNode);
                    } 
                } 

 
                // New node is initialized, build tree top down
                // (Node added before children of node)
                if (container == parent)
                { 
                    // Set the NameScope on the root of the Template generated tree
                    /*TemplateNameScope*/
                	var templateNameScope = new TemplateNameScope(container); 
                    NameScope.SetNameScope(treeNode, templateNameScope); 

                    // This is the root of the tree 
                    if (isContainerAnFE)
                    {
                        // The root is added to the Visual tree (not logical) for the
                        // case of FrameworkElement parents 
                        containerAsFE.TemplateChild = treeNodeFO.FE;
                    } 
                    else 
                    {
                        // The root is added to the logical tree for the case 
                        // of FrameworkContentElement parent.  This is the logical equivalent
                        // to what happens when adding a child to a visual collection.
                    	FrameworkElementFactory.AddNodeToLogicalTree( /*(FrameworkContentElement)*/parent, _type,
                            treeNodeIsFE, treeNodeFO.FE, treeNodeFO.FCE ); 
                    }
                } 
                else 
                {
                    // Call parent IAddChild to add treeNodeFO 
                    this.AddNodeToParent( parent, treeNodeFO );
                }

                // Either set properties or invalidate them, depending on the type 

                if (!treeNodeIsVisual3D) 
                { 
                    // For non-3D content, we need to invalidate any properties that
                    // came from FrameworkElementFactory.SetValue or VisulaTrigger.SetValue 
                    // so that they can get picked up.

//                    Debug.Assert( _frameworkTemplate != null );
                    StyleHelper.InvalidatePropertiesOnTemplateNode( 
                                container,
                                treeNodeFO, 
                                this._childIndex, 
                                this._frameworkTemplate.ChildRecordFromChildIndex
                                /*ref _frameworkTemplate.ChildRecordFromChildIndex*/,
                                false /*isDetach*/, 
                                this);

                }
//                else 
//                {
//                    // For 3D, which doesn't understand templates, we set the properties directly 
//                    // onto the newly-instantiated element. 
//
//                    for (var i = 0; i < PropertyValues.Count; i++) 
//                    {
//                        if (this.PropertyValues.Get(i).ValueType == PropertyValueType.Set)
//                        {
//                            // Get the value out of the table. 
//                            /*object*/var o = PropertyValuesGet(i).ValueInternal;
// 
// 
//                            // If it's a freezable that can't be frozen, it's probably not sharable,
//                            // so we make a copy of it. 
//                            /*Freezable*/var freezableValue = o instanceof Freezable ? o : null;
//                            if (freezableValue != null && !freezableValue.CanFreeze)
//                            {
//                                o = freezableValue.Clone(); 
//                            }
// 
//                            // Or, if it's a markup extension, get the value 
//                            // to set on this property from the MarkupExtension itself.
//                            /*MarkupExtension*/var me = o instanceof MarkupExtension ? o : null; 
//                            if (me != null)
//                            {
//                                /*ProvideValueServiceProvider*/var serviceProvider = new ProvideValueServiceProvider();
//                                serviceProvider.SetData( treeNodeVisual3D, PropertyValues[i].Property ); 
//                                o = me.ProvideValue( serviceProvider );
//                            } 
// 
//                            // Finally, set the value onto the object.
//                            treeNodeVisual3D.SetValue(PropertyValues[i].Property, o); 
//
//                        }
//
//                        else 
//                        {
//                            // We don't support resource references, triggers, etc within the 3D content 
//                            throw new NotSupportedException(SR.Get(SRID.Template3DValueOnly, PropertyValues[i].Property) ); 
//
//                        } 
//
//                    }
//                }
 

                // Build child tree from factories 
                /*FrameworkElementFactory*/var childFactory = this._firstChild; 
                while (childFactory != null)
                { 
                    childFactory.InstantiateTree(
                        dataField,
                        container,
                        treeNode, 
                        affectedChildren,
                        /*ref*/ noChildIndexChildren, 
                        /*ref*/ resourceDependents); 

                    childFactory = childFactory._nextSibling; 
                }

                if (!treeNodeIsVisual3D)
                { 
                    // Fire "Initialized" event
                    NewNodeEndInit( treeNodeIsFE, treeNodeFO.FE, treeNodeFO.FCE ); 
                } 
            }
            return treeNode; 
        },


        // 
        //  Add a child to a parent, using IAddChild.  This has special support for Grid,
        //  to allow backward compatibility with FEF-based templates that have Column/RowDefinition 
        //  children directly  under the Grid. 
        //
 
//        private void 
        AddNodeToParent:function( /*DependencyObject*/ parent, /*FrameworkObject*/ childFrameworkObject )
        {
            /*Grid*/var parentGrid;
            /*ColumnDefinition*/var childNodeColumnDefinition; 
            /*RowDefinition*/var childNodeRowDefinition = null;
 
            if (    childFrameworkObject.IsFCE 
                &&  (parentGrid = (parent instanceof Grid ? parent : null)) != null
                &&  (   (childNodeColumnDefinition = (childFrameworkObject.FCE instanceof ColumnDefinition ? childFrameworkObject.FCE : null)) != null 
                    ||  (childNodeRowDefinition = (childFrameworkObject.FCE instanceof RowDefinition ? childFrameworkObject.FCE : null)) != null  )
                )
            {
                if (childNodeColumnDefinition != null) 
                {
                    parentGrid.ColumnDefinitions.Add(childNodeColumnDefinition); 
                } 
                else if (childNodeRowDefinition != null)
                { 
                    parentGrid.RowDefinitions.Add(childNodeRowDefinition);
                }
            }
            else 
            {
                // CALLBACK 
                // Inheritable property invalidations will occur due to 
                //   OnParentChanged resulting from AddChild
 
                if (!(parent.isInstanceOf(IAddChild)))
                {
                    throw new Error('InvalidOperationException(SR.Get(SRID.TypeMustImplementIAddChild, parent.GetType().Name)'); 
                }
 
                /*((IAddChild)parent)*/parent.AddChild(childFrameworkObject.DO); 
            }
        }, 


        // This tree is used to instantiate a tree, represented by this factory.
        // It is instantiated as a normal tree without any template optimizations. 
        // This is used by designers to inspect a template.
 
//        internal FrameworkObject 
        InstantiateUnoptimizedTree:function() 
        {
 
            if (!this._sealed)
            {
                throw new Error('InvalidOperationException(SR.Get(SRID.FrameworkElementFactoryMustBeSealed)');
            } 

            // Create the object. 
 
            /*FrameworkObject*/
            var frameworkObject = new FrameworkObject(CreateDependencyObject());
 
            // Mark the beginning of initialization

            frameworkObject.BeginInit();
 
            // Set values for this object, taking them from the shared values table.
 
            /*ProvideValueServiceProvider*/
            var provideValueServiceProvider = null; 
            FrameworkTemplate.SetTemplateParentValues( this.Name, frameworkObject.DO, this._frameworkTemplate, /*ref*/ provideValueServiceProvider );
 
            // Get the first child

            /*FrameworkElementFactory*/
            var childFactory = this._firstChild;
 
            // If we have children, get this object's IAddChild, because it's going to be a parent.
 
            /*IAddChild*/
            var iAddChild = null; 
            if( childFactory != null )
            { 
                iAddChild = frameworkObject.DO instanceof IAddChild ? frameworkObject.DO : null;
                if (iAddChild == null)
                {
                    throw new Error('InvalidOperationException(SR.Get(SRID.TypeMustImplementIAddChild, frameworkObject.DO.GetType().Name)');
                } 
            } 

            // Build the children. 

            while (childFactory != null)
            {
 
                if (childFactory._text != null)
                { 
                    iAddChild.AddText(childFactory._text); 

                } 
                else
                {
                    // Use frameworkObject's IAddChild to add this node.
                    /*FrameworkObject*/
                	var childFrameworkObject = childFactory.InstantiateUnoptimizedTree(); 
                    this.AddNodeToParent(frameworkObject.DO, childFrameworkObject );
                } 
 
                childFactory = childFactory._nextSibling;
            } 

            // Mark the end of the initialization phase

            frameworkObject.EndInit(); 

            return frameworkObject; 
 
        },

 
        // This method is also used by XamlStyleSerializer to decide whether
        // or not to emit the Name attribute for a VisualTree node. 
//        internal bool 
        IsChildNameValid:function(/*string*/ childName)
        {
//            return !childName.StartsWith(AutoGenChildNamePrefix, StringComparison.Ordinal);
            return !childName.StartsWith(AutoGenChildNamePrefix);
        }, 

//        private string 
        GenerateChildName:function() 
        { 
            /*string*/
        	var childName = AutoGenChildNamePrefix + AutoGenChildNamePostfix; //.ToString(CultureInfo.InvariantCulture);
 
//            Interlocked.Increment(ref AutoGenChildNamePostfix);
            AutoGenChildNamePostfix ++;

            return childName;
        }, 

 
//        private void 
        ApplyAutoAliasRules:function() 
        {
            // See also StyleHelper.ApplyAutoAliasRules, which performs this auto-aliasing 
            // for non-FEF (Baml) templates.

            if (ContentPresenter.Type.IsAssignableFrom(this._type))
            { 
                // ContentPresenter auto-aliases Content, ContentTemplate, and
                // ContentTemplateSelector to respective properties on the 
                // styled parent. 

                // The prefix is obtained from the ContentSource property. 
                // If this is null, user is explicitly asking for no auto-aliasing.
                /*object*/
            	var o = this.GetValue(ContentPresenter.ContentSourceProperty);
                /*string*/
            	var prefix = (o == DependencyProperty.UnsetValue) ? "Content" : o;
 
                // if Content is previously set, do nothing
                if (!String.IsNullOrEmpty(prefix) && !this.IsValueDefined(ContentPresenter.ContentProperty)) 
                { 
                    // find source properties, using prefix
//                    Debug.Assert(_frameworkTemplate != null, "ContentPresenter is an FE and can only have a FrameworkTemplate"); 
                    /*Type*/
                	var targetType = this._frameworkTemplate.TargetTypeInternal;

                    /*DependencyProperty*/
                	var dpContent = DependencyProperty.FromName(prefix, targetType);
                    /*DependencyProperty*/
                	var dpContentTemplate = DependencyProperty.FromName(prefix + "Template", targetType); 
                    /*DependencyProperty*/
                	var dpContentTemplateSelector = DependencyProperty.FromName(prefix + "TemplateSelector", targetType);
                    /*DependencyProperty*/
                	var dpContentStringFormat = DependencyProperty.FromName(prefix + "StringFormat", targetType); 
 
                    // if desired source for Content doesn't exist, report an error
                    if (dpContent == null && o != DependencyProperty.UnsetValue) 
                    {
                        throw new Error('InvalidOperationException(SR.Get(SRID.MissingContentSource, prefix, targetType)');
                    }
 
                    // auto-alias the Content property
                    if (dpContent != null) 
                    { 
                        this.SetValue(ContentPresenter.ContentProperty, new TemplateBindingExtension(dpContent));
                    } 

                    // auto-alias the remaining properties if none of them are previously set
                    if (!this.IsValueDefined(ContentPresenter.ContentTemplateProperty) &&
                        !this.IsValueDefined(ContentPresenter.ContentTemplateSelectorProperty) && 
                        !this.IsValueDefined(ContentPresenter.ContentStringFormatProperty))
                    { 
                        if (dpContentTemplate != null) 
                        	this.SetValue(ContentPresenter.ContentTemplateProperty, new TemplateBindingExtension(dpContentTemplate));
                        if (dpContentTemplateSelector != null) 
                        	this.SetValue(ContentPresenter.ContentTemplateSelectorProperty, new TemplateBindingExtension(dpContentTemplateSelector));
                        if (dpContentStringFormat != null)
                        	this.SetValue(ContentPresenter.ContentStringFormatProperty, new TemplateBindingExtension(dpContentStringFormat));
                    } 
                }
            } 
            else if (GridViewRowPresenter.Type.IsAssignableFrom(this._type)) 
            {
                // GridViewRowPresenter auto-aliases Content and Columns to Content 
                // property GridView.ColumnCollection property on the templated parent.

                // if Content is previously set, do nothing
                if (!this.IsValueDefined(GridViewRowPresenter.ContentProperty)) 
                {
                    // find source property 
//                    Debug.Assert(_frameworkTemplate != null, "GridViewRowPresenter is an FE and can only have a FrameworkTemplate"); 
                    /*Type*/
                	var targetType = this._frameworkTemplate.TargetTypeInternal;
 
                    /*DependencyProperty*/var dpContent = DependencyProperty.FromName("Content", targetType);

                    // auto-alias the Content property
                    if (dpContent != null) 
                    {
                    	this.SetValue(GridViewRowPresenter.ContentProperty, new TemplateBindingExtension(dpContent)); 
                    } 
                }
 
                // if Columns is previously set, do nothing
                if (!this.IsValueDefined(GridViewRowPresenter.ColumnsProperty))
                {
                    // auto-alias the Columns property 
                    this.SetValue(GridViewRowPresenter.ColumnsProperty, new TemplateBindingExtension(GridView.ColumnCollectionProperty));
                } 
            } 
        },
 

//        private bool 
        IsValueDefined:function(/*DependencyProperty*/ dp)
        {
            for (var i = 0; i < this.PropertyValues.Count; i++) 
            {
                if (this.PropertyValues.Get(i).Property == dp && 
                    (this.PropertyValues.Get(i).ValueType == PropertyValueType.Set || 
                    		this.PropertyValues.Get(i).ValueType == PropertyValueType.Resource ||
                    		this.PropertyValues.Get(i).ValueType == PropertyValueType.TemplateBinding)) 
                {
                    return true;
                }
            } 

            return false; 
        } 

	});
	


    

    /// <summary>
    ///     Update the chain of FrameworkElementFactory-created nodes.
    /// </summary> 
    /// <remarks>
    ///     We have two collections of child nodes created from all the 
    /// FrameworkElementFactory in a single Style.  Some we "care about" 
    /// because of property values, triggers, etc.  Others just needed
    /// to be created and put in a tree, and we can stop worrying about 
    /// them.  The former is 'affectedChildren', the latter is
    /// 'noChildIndexChildren' so called because the nodes we don't
    /// care about were not assigned a child index.
    /// </remarks> 
//    private static void 
    function UpdateChildChains( /*string*/ childID, /*int*/ childIndex,
        /*bool*/ treeNodeIsFE, /*FrameworkElement*/ treeNodeFE, /*FrameworkContentElement*/ treeNodeFCE, 
        /*List<DependencyObject>*/ affectedChildren, /*ref List<DependencyObject> noChildIndexChildren*/parObj ) 
    {
        if (childID != null) 
        {
            // If a child ID exists, then, a valid child index exists as well
            if( treeNodeIsFE )
            { 
                treeNodeFE.TemplateChildIndex = childIndex;
            } 
            else 
            {
                treeNodeFCE.TemplateChildIndex = childIndex; 
            }

            // Add this instance to the child index chain so that it may
            // be tracked by the style 

            affectedChildren.Add(treeNodeIsFE ? /*(DependencyObject)*/treeNodeFE : /*(DependencyObject)*/treeNodeFCE); 
        } 
        else
        { 
            // Child nodes with no _childID (hence no _childIndex) are
            //  tracked on a separate chain that will be appended to the
            //  main chain for cleanup purposes.
            if (parObj.noChildIndexChildren == null) 
            {
            	parObj.noChildIndexChildren = new List/*<DependencyObject>*/(/*4*/); 
            } 

            parObj.noChildIndexChildren.Add(treeNodeIsFE ? /*(DependencyObject)*/treeNodeFE : /*(DependencyObject)*/treeNodeFCE); 
        }
    }

    /// <summary> 
    ///     Call BeginInit on the newly-created node to postpone the
    /// "Initialized" event. 
    /// </summary> 
//    internal static void 
    FrameworkElementFactory.NewNodeBeginInit = function( /*bool*/ treeNodeIsFE,
        /*FrameworkElement*/ treeNodeFE, /*FrameworkContentElement*/ treeNodeFCE ) 
    {
        if( treeNodeIsFE )
        {
            // Mark the beginning of the initialization phase 
            treeNodeFE.BeginInit();
        } 
        else 
        {
            // Mark the beginning of the initialization phase 
            treeNodeFCE.BeginInit();
        }
    };

    /// <summary>
    ///     Call EndInit on the newly-created node to fire the 
    /// "Initialized" event. 
    /// </summary>
//    private static void 
    function NewNodeEndInit( /*bool*/ treeNodeIsFE, 
        /*FrameworkElement*/ treeNodeFE, /*FrameworkContentElement*/ treeNodeFCE )
    {
        if( treeNodeIsFE )
        { 
            // Mark the beginning of the initialization phase
            treeNodeFE.EndInit(); 
        } 
        else
        { 
            // Mark the beginning of the initialization phase
            treeNodeFCE.EndInit();
        }
    } 

    /// <summary> 
    ///     Setup the pointers on this FrameworkElementFactory-created 
    /// node so we can find our way back to the object whose Style
    /// included this FrameworkElementFactory. 
    /// </summary>
//    private static void 
    function NewNodeStyledParentProperty(
        /*DependencyObject*/ container, /*bool*/ isContainerAnFE,
        /*bool*/ treeNodeIsFE, /*FrameworkElement*/ treeNodeFE, /*FrameworkContentElement*/ treeNodeFCE) 
    {
        if( treeNodeIsFE ) 
        { 
            treeNodeFE._templatedParent = container ;
            treeNodeFE.IsTemplatedParentAnFE = isContainerAnFE; 
        }
        else
        {
            treeNodeFCE._templatedParent = container ; 
            treeNodeFCE.IsTemplatedParentAnFE = isContainerAnFE;
        } 
    } 

    /// <summary> 
    ///     When Style.VisualTree is applied to a FrameworkContentElement,
    /// it is actually added to the logical tree because FrameworkContentElement
    /// has no visual tree.
    /// </summary> 
    /// <remarks>
    ///     A prime example of trying to shove a square peg into a round hole. 
    /// </remarks> 
//    internal static void 
    FrameworkElementFactory.AddNodeToLogicalTree = function( /*DependencyObject*/ parent, /*Type*/ type,
        /*bool*/ treeNodeIsFE, /*FrameworkElement*/ treeNodeFE, /*FrameworkContentElement*/ treeNodeFCE) 
    {
        // If the logical parent already has children, then we can't add
        // a logical subtree from the style, since there would be a conflict.
        // Throw an exception in this case. 
        /*FrameworkContentElement*/
    	var logicalParent = parent instanceof FrameworkContentElement ? parent : null;
        if (logicalParent != null) 
        { 
            /*IEnumerator*/
        	var childEnumerator = logicalParent.LogicalChildren;
            if (childEnumerator != null && childEnumerator.MoveNext()) 
            {
                throw new Error('InvalidOperationException(SR.Get(SRID.AlreadyHasLogicalChildren, parent.GetType().Name)');
            } 
        }

        /*IAddChild*/
        var  addChildParent = parent instanceof IAddChild ? parent : null; 
        if (addChildParent == null)
        { 
            throw new Error('InvalidOperationException(SR.Get(SRID.CannotHookupFCERoot, type.Name)');
        }
        else 
        {
            if (treeNodeFE != null) 
            { 
                addChildParent.AddChild(treeNodeFE);
            } 
            else
            {
                addChildParent.AddChild(treeNodeFCE);
            } 
        }
    };

	
	Object.defineProperties(FrameworkElementFactory.prototype,{
        /// <summary> 
        ///     Type of object that the factory will produce 
        /// </summary>
//        public Type 
        Type: 
        {
            get:function() { return this._type; },
            set:function(value)
            { 
                if (this._sealed)
                { 
                    throw new InvalidOperationException(SR.Get(SRID.CannotChangeAfterSealed, "FrameworkElementFactory")); 
                }
 
                if (this._text != null)
                {
                    throw new InvalidOperationException(SR.Get(SRID.FrameworkElementFactoryCannotAddText));
                } 

                if ( value != null ) // We allow null up until Seal 
                { 
                    // If non-null, must be derived from one of the supported types
                    if (!FrameworkElement.Type.IsAssignableFrom(value) && 
                        !FrameworkContentElement.Type.IsAssignableFrom(value))
                    {
//                        #pragma warning suppress 6506 // value is obviously not null 
                        throw new Error('ArgumentException(SR.Get(SRID.MustBeFrameworkOr3DDerived, value.Name)');
                    } 
                } 

                // It is possible that _type is null when a FEF is created for text content within a tag 
                this._type = value;

//                // If this is a KnownType in the BamlSchemaContext, then there is a faster way to create
//                // an instance of that type than using Activator.CreateInstance.  So in that case 
//                // save the delegate for later creation.
//                /*WpfKnownType*/var knownType = null; 
//                if (this._type != null) 
//                {
//                    knownType = XamlReader.BamlSharedSchemaContext.GetKnownXamlType(this._type) as WpfKnownType; 
//                }
//                this._knownTypeFactory = (knownType != null) ? knownType.DefaultConstructor : null;
            }
        },

        /// <summary> 
        ///     Text string that the factory will produce 
        /// </summary>
//        public string 
        Text:
        {
            get:function() { return this._text; },
            set:function(value)
            { 
                if (this._sealed)
                { 
                    throw new InvalidOperationException(SR.Get(SRID.CannotChangeAfterSealed, "FrameworkElementFactory")); 
                }
 
                if (this._firstChild != null)
                {
                    throw new InvalidOperationException(SR.Get(SRID.FrameworkElementFactoryCannotAddText));
                } 

                if ( value == null ) 
                { 
                    throw new ArgumentNullException("value");
                } 

                this._text = value;
            }
        },

        /// <summary> 
        ///     Style identifier 
        /// </summary>
//        public string 
        Name: 
        {
            get:function() { return this._childName; },
            set:function(value)
            { 
                if (this._sealed)
                { 
                    throw new InvalidOperationException(SR.Get(SRID.CannotChangeAfterSealed, "FrameworkElementFactory")); 
                }
                if (value == String.Empty) 
                {
                    throw new ArgumentException(SR.Get(SRID.NameNotEmptyString));
                }
 
                this._childName = value;
            } 
        },
        

        /// <summary> 
        ///     Store all the event handlers for this FEF 
        /// </summary>
//        internal EventHandlersStore 
        EventHandlersStore: 
        {
            get:function()
            {
                return this._eventHandlersStore; 
            },
            set:function(value) 
            { 
            	this._eventHandlersStore = value;
            } 
        },


        // 
        // Says if we have anything listening for the Loaded or Unloaded
        // event (used for an optimization in FrameworkElement). 
        // 

//        internal bool 
        HasLoadedChangeHandler: 
        {
            get:function() { return this._hasLoadedChangeHandler; },
            set:function(value) { this._hasLoadedChangeHandler = value; }
        }, 

        
        /// <summary>
        ///     FrameworkElementFactory mutability state 
        /// </summary> 
//        public bool 
        IsSealed:
        { 
            get:function() { return this._sealed; }
        },

 
        /// <summary>
        ///     Parent factory 
        /// </summary> 
//        public FrameworkElementFactory 
        Parent:
        { 
            get:function() { return this._parent; }
        },

        /// <summary> 
        ///     First child factory
        /// </summary> 
//        public FrameworkElementFactory 
        FirstChild: 
        {
            get:function() { return this._firstChild; } 
        },

        /// <summary>
        ///     Next sibling factory 
        /// </summary>
//        public FrameworkElementFactory 
        NextSibling:
        { 
            get:function() { return this._nextSibling; }
        }, 

//        internal FrameworkTemplate 
        FrameworkTemplate:
        {
            get:function() { return this._frameworkTemplate; } 
        }
 
	});
	
	FrameworkElementFactory.Type = new Type("FrameworkElementFactory", FrameworkElementFactory, [Object.Type]);
	return FrameworkElementFactory;
});
