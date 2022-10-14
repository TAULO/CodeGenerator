// extension Code

AmConfigurableData = Class.create();
AmConfigurableData.prototype = 
{
    textNotAvailable : "",
    
    mediaUrlMain : "",
    
    currentIsMain : "",
    
    optionProducts : null,
    
    optionDefault : new Array(),
    
    oneAttributeReload : false,

    isResetButton : false,
    
    amlboxInstalled : false,
    
    initialize : function(optionProducts)
    {
        this.optionProducts = optionProducts;
    },
    //special for simple price
    reloadOptions : function()
    {
        if ('undefined' != typeof(spConfig) && spConfig.settings)
        {
            spConfig.settings.each(function(select){
                if (select.enable) {
                    spConfig.reloadOptionLabels(select);
                }    
            });    
        }
    },
     
    hasKey : function(key)
    {
        return ('undefined' != typeof(this.optionProducts[key]));
    },
    
    getData : function(key, param)
    {
        if (this.hasKey(key) && 'undefined' != typeof(this.optionProducts[key][param]))
        {
            return this.optionProducts[key][param];
        }
        return false;
    },
    
    saveDefault : function(param, data)
    {
        this.optionDefault['set'] = true;
        this.optionDefault[param] = data;
    },
    
    getDefault : function(param)
    {
        if ('undefined' != typeof(this.optionDefault[param]))
        {
            return this.optionDefault[param];
        }
        return false;
    }
}
// extension Code End

Product.Config.prototype.resetChildren = function(element){
    if(element.childSettings) {
        for(var i=0;i<element.childSettings.length;i++){
            element.childSettings[i].selectedIndex = 0;
            element.childSettings[i].disabled = true;
            if(element.config){
                this.state[element.config.id] = false;
            }
        }
    }
    // extension Code Begin
    this.processEmpty();
    // extension Code End
}

Product.Config.prototype.fillSelect = function(element){
    var attributeId = element.id.replace(/[a-z]*/, '');
    var options = this.getAttributeOptions(attributeId);
	this.clearSelect(element);
    element.options[0] = new Option(this.config.chooseText, '');

    var prevConfig = false;
    if(element.prevSetting){
        prevConfig = element.prevSetting.options[element.prevSetting.selectedIndex];
    }

    if(options) {
        if ($('amconf-images-' + attributeId))
            {
                $('amconf-images-' + attributeId).parentNode.removeChild($('amconf-images-' + attributeId));
            }
            
       if (this.config.attributes[attributeId].use_image)
        {
            holder = element.parentNode;
            holderDiv = document.createElement('div');
            holderDiv = $(holderDiv); // fix for IE
            holderDiv.addClassName('amconf-images-container');
            holderDiv.id = 'amconf-images-' + attributeId;
            holder.insertBefore(holderDiv, element);
        }
        // extension Code End
        
        var index = 1;		
        for(var i=0;i<options.length;i++){
            var allowedProducts = [];
            if(prevConfig) {
                for(var j=0;j<options[i].products.length;j++){
                    if(prevConfig.config.allowedProducts
                        && prevConfig.config.allowedProducts.indexOf(options[i].products[j])>-1){
                        allowedProducts.push(options[i].products[j]);
                    }
                }
            } else {
                allowedProducts = options[i].products.clone();
            }

            if(allowedProducts.size()>0)
            {
                // extension Code
                if (this.config.attributes[attributeId].use_image)
                {
                    var imgContainer = document.createElement('div');
                    imgContainer = $(imgContainer); // fix for IE
                    imgContainer.addClassName('amconf-image-container');
                    imgContainer.id = 'amconf-images-container-' + attributeId;
                    imgContainer.style.float = 'left';
                    holderDiv.appendChild(imgContainer);
            
                    var image = document.createElement('img');
                    image = $(image); // fix for IE
                    image.id = 'amconf-image-' + options[i].id;
			        image.src = options[i].image;
			        image.addClassName('amconf-image');
			        image.alt = options[i].label;
			        // Commented by Devaraj, as per the client request (Jira ticket DS-125)
					//image.title = options[i].label;
					
			        if(showAttributeTitle != 0) image.style.marginBottom = '0px';
			        else image.style.marginBottom = '7px';
					
                    image.observe('click', this.configureImage.bind(this));
					
		            if('undefined' != typeof(buble)){
                         image.observe('mouseover', buble.showToolTip);
                         image.observe('mouseout', buble.hideToolTip); 				 
                    }
					
					imgContainer.appendChild(image);
                    
                    if(showAttributeTitle && showAttributeTitle != 0){ 
                        var amImgTitle = document.createElement('div');
                        amImgTitle = $(amImgTitle); // fix for IE
                        amImgTitle.addClassName('amconf-image-title');
                        amImgTitle.id = 'amconf-images-title-' + options[i].id;
                        amImgTitle.setStyle({
                            fontWeight : 600,
                            textAlign : 'center'
                        });
                        amImgTitle.innerHTML = options[i].label;  
                        imgContainer.appendChild(amImgTitle);     
                    }
                    image.onload = function(){
                        var optId = this.id.replace(/[a-z-]*/, '');
                        var maxW = this.getWidth();
                        if(optId) {
                            var title = $('amconf-images-title-' + optId);
                            if(title && title.getWidth() && title.getWidth() > maxW) {
                                maxW = title.getWidth();
                            }
                                
                        }
                        if(this.parentNode){
                            this.parentNode.style.width =   maxW + 'px'; 
                        }
                        if(this.parentNode.childElements()[1]){
                            this.parentNode.childElements()[1].style.width =   maxW + 'px'; 
                        }
                    };  
                }
                // extension Code End
                
                options[i].allowedProducts = allowedProducts;
    			parentAttributeProducts = this.getParentAttributeProducts();
				isOOS = this.productIsOOS(options[i].id, parentAttributeProducts, attributeId,index-1);
				element.options[index] = new Option(this.getOptionLabel(options[i], options[i].price), options[i].id);    
	            element.options[index].config = options[i];

                index++;
            }
        }
        if(this.config.attributes[attributeId].use_image) {
            var lastContainer = document.createElement('div');
            lastContainer = $(lastContainer); // fix for IE
            lastContainer.setStyle({clear : 'both'});
            holderDiv.appendChild(lastContainer);    
        }        
    }
}

Product.Config.prototype.getParentAttributeProducts = function() {
	s = $$('.super-attribute-select')[0];
	v = s.options[s.selectedIndex].value;
	if (v == '') return false;
	first_attribute_id = this.getFirstAttributeId();
	for (var a in this.config.attributes) {
		for (o=0;o<this.config.attributes[first_attribute_id].options.length;o++) {
			if (this.config.attributes[first_attribute_id].options[o].id == v)  {
				return this.config.attributes[first_attribute_id].options[o].products;
			}
		}
	}
}

Product.Config.prototype.getFirstAttributeId = function() {
	s = $$('.super-attribute-select')[0];
	return parseInt(s.id.substring(9));
}

Product.Config.prototype.hasMultipleSelects = function() {
	return ($$('.super-attribute-select')[1]) ? true:false;
}

Product.Config.prototype.updateStockStatus = function(element){
	attribute_id = element.id.substring(9);
	if (this.hasMultipleSelects() &&  attribute_id == this.getFirstAttributeId()) return true;
	
	selected_product_id = this.getProductIdByAttributes(element);
	stock_status_text = default_stock_status;
	if (selected_product_id) {
		for(e=0;e<this.config.elt.length;e++) {
			if ( this.config.elt[e].split(':')[0] == selected_product_id && this.config.elt[e].split(':')[1] != 'None' ) 
					stock_status_text = this.config.elt[e].split(':')[1];
		}
	}
	$('stock_status').update(stock_status_text);
}

Product.Config.prototype.reloadSpecialPrice = function(element) {
	if (!jQuery('.dwell-special-price-wrapper').length > 0) return;
	
	basePrice 	= this.config.basePrice;
	product		= this.getProductByAttributes(element);
	special_price = (parseFloat(basePrice)+parseFloat(product.price)).toFixed(2);
	target 		= jQuery('.dwell-special-price .price .price');
	target.html('$' + special_price);
}
/* 
 Find selected product id by attributes selected
*/
Product.Config.prototype.getProductIdByAttributes = function(element) {
	attribute_id = element.id.substring(9);
	if (this.hasMultipleSelects()) {
		if (attribute_id == this.getFirstAttributeId()) return false;
		z = element.options[element.selectedIndex].value;
		
		var parentProducts = this.getParentAttributeProducts();
		for (p=0;p<parentProducts.length;p++) {
			for(q=0;q<this.config.attributes[attribute_id].options.length;q++) {
				if (this.config.attributes[attribute_id].options[q].id == z) {
					for (t=0;t<this.config.attributes[attribute_id].options[q].products.length;t++) {
						if (parentProducts[p] == this.config.attributes[attribute_id].options[q].products[t]) {
							return parentProducts[p];
						}
					}
				}
			}
		}
		
	} else {
		/* if you have only one attribute to select, should be guaranteed to only have one product associated */
		for (o=0;o<this.config.attributes[attribute_id].options.length;o++) {
			if (this.config.attributes[attribute_id].options[o].id == element.options[element.selectedIndex].value) {
				return this.config.attributes[attribute_id].options[o].products[0];
			}
		}
	} 
}

Product.Config.prototype.getProductByAttributes = function(element) {
	attribute_id = element.id.substring(9);
	if (this.hasMultipleSelects()) {
		if (attribute_id == this.getFirstAttributeId()) return false;
		z = element.options[element.selectedIndex].value;
		
		var parentProducts = this.getParentAttributeProducts();
		for (p=0;p<parentProducts.length;p++) {
			for(q=0;q<this.config.attributes[attribute_id].options.length;q++) {
				if (this.config.attributes[attribute_id].options[q].id == z) {
					for (t=0;t<this.config.attributes[attribute_id].options[q].products.length;t++) {
						if (parentProducts[p] == this.config.attributes[attribute_id].options[q].products[t]) {
							return parentProducts[p];
						}
					}
				}
			}
		}
		
	} else {
		/* if you have only one attribute to select, should be guaranteed to only have one product associated */
		for (o=0;o<this.config.attributes[attribute_id].options.length;o++) {
			if (this.config.attributes[attribute_id].options[o].id == element.options[element.selectedIndex].value) {
				return this.config.attributes[attribute_id].options[o];
			}
		}
	} 
}

Product.Config.prototype.productIsOOS = function(option_id, products, attribute_id, pos) {

	/* If this is our parent attribute ID, return empty */
	if (this.hasMultipleSelects() && attribute_id == this.getFirstAttributeId()) return '';

	this.config.attributes[attribute_id].options

	oos = this.config.oos;
	is_oos=false;	

	// for each product associated with selected first attribute
	for(p=0;p<products.length;p++) {
	
		// look through all of the oos list
		for(o=0;o<oos.length;o++) {
			var p_i = oos[o].split(':');
			if (p_i[0]==products[p]) {
				if (p_i[1]=="0") {
				
					// if product is oos, look through the secondary attribute products to see 
					// if that product exists in the secondary attribute product list
					attr_opts = this.config.attributes[attribute_id].options;
					for(pp=0;pp<attr_opts[pos].products.length;pp++) {
						if (attr_opts[pos].products[pp] == products[p]) {
							is_oos = true;
						}
					}
				} else {
					is_oos = false;
				}
			}
		}
	}
	return (is_oos) ? ' - out of stock':'';
}

Product.Config.prototype.configureElement = function(element) 
{
    // extension Code
    optionId = element.value;
    if ($('amconf-image-' + optionId))
    {
        this.selectImage($('amconf-image-' + optionId));
    } else 
    {
        attributeId = element.id.replace(/[a-z-]*/, '');
        if ($('amconf-images-' + attributeId))
        {
        $('amconf-images-' + attributeId).childElements().each(function(child){
             if(child.childElements()[0])
                child.childElements()[0].removeClassName('amconf-image-selected');
        });
        }
    }
    // extension Code End
    
    this.reloadOptionLabels(element);
    if(element.value){
        this.state[element.config.id] = element.value;
        if(element.nextSetting){
            element.nextSetting.disabled = false;
            this.fillSelect(element.nextSetting);
            this.resetChildren(element.nextSetting);
        }
    }
    else {
        // extension Code
        if(element.childSettings) {
            for(var i=0;i<element.childSettings.length;i++){
                attributeId = element.childSettings[i].id.replace(/[a-z-]*/, '');
                if ($('amconf-images-' + attributeId))
                {
                    $('amconf-images-' + attributeId).parentNode.removeChild($('amconf-images-' + attributeId));
                }
            }
        }
        // extension Code End
        
        this.resetChildren(element);
        
        // extension Code
        if (this.settings[0].hasClassName('no-display'))
        {
            this.processEmpty();
        }
        // extension Code End
    }
    
    // extension Code
    var key = '';
    this.settings.each(function(select, ch){
        // will check if we need to reload product information when the first attribute selected
        if (!parseInt(select.value) && ch && 'undefined' != typeof(confData) && confData.oneAttributeReload && "undefined" != select.options[1] && !confData.isResetButton)
	{
            // if option is not selected, and setting is set to "Yes", will consider it as if the first attribute was selected (0 - is "Choose ...")
	    if(select.options[1])
	            key += select.options[1].value + ',';
        } else 
        {
            
             if(select.value) {
                 key += select.value + ',';   
             }
        }
    });
    if (typeof confData != 'undefined') {
        confData.isResetButton = false;    
    }
    key = key.substr(0, key.length - 1);
    this.updateData(key);
    
    if (typeof confData != 'undefined' && confData.useSimplePrice == "1")
    {
        // replace price values with the selected simple product price
        this.reloadSimplePrice(key);
    }
    else
    {
        // default behaviour
        this.reloadPrice();
    }
    l = element.options[element.selectedIndex].label;
	if (l.substring(l.length-5,l.length) == 'stock') {
		this.hideATC();
	} else {
		this.showATC();
	}
	
	this.updateStockStatus(element);

	this.reloadSpecialPrice(element);
	
    // for compatibility with custom stock status extension:
    if ('undefined' != typeof(stStatus) && 'function' == typeof(stStatus.onConfigure))
    {
        stStatus.onConfigure(key, this.settings);
    }
	//Amasty code for Automatically select attributes that have one single value
    if(('undefined' != typeof(amConfAutoSelectAttribute) && amConfAutoSelectAttribute) ||('undefined' != typeof(amStAutoSelectAttribute) && amStAutoSelectAttribute)){
        var nextSet = element.nextSetting;
        if(nextSet && nextSet.options.length == 2 && !nextSet.options[1].selected && element && !element.options[0].selected){
            nextSet.options[1].selected = true;
            this.configureElement(nextSet);
        } 
    }
    if('undefined' != typeof(preorderState))
	preorderState.update()


	var label = "";
	element.config.options.each(function(option){
		if(option.id == element.value) label = option.label;
	});
	if(label) label = " - " + label;
	var parent = element.parentNode.parentNode.previousElementSibling;
	if( typeof(parent) != 'undefined' && parent.nodeName == "DT" && (conteiner = parent.select("label")[0])) {
		if( tmp = conteiner.select('span.amconf-label')[0]){
			tmp.innerHTML = label;
		}
		else{
			var tmp = document.createElement('span');
			tmp.addClassName('amconf-label');
			conteiner.appendChild(tmp);
			tmp.innerHTML = label;
		}			
	}
    // extension Code End
}

Product.Config.prototype.configureForValues =  function () {
        if (this.values) {
            this.settings.each(function(element){
                var attributeId = element.attributeId;
                element.value = (typeof(this.values[attributeId]) == 'undefined')? '' : this.values[attributeId];
                this.configureElement(element);
            }.bind(this));
        }
        //Amasty code for Automatically select attributes that have one single value
        if(('undefined' != typeof(amConfAutoSelectAttribute) && amConfAutoSelectAttribute) ||('undefined' != typeof(amStAutoSelectAttribute) && amStAutoSelectAttribute)){
            var select  = this.settings[0];
            if(select && select.options.length == 2 && !select.options[1].selected){
                select.options[1].selected = true;
                this.configureElement(select);
            }
        }
}
    
// these are new methods introduced by the extension
// extension Code
Product.Config.prototype.configureImage = function(event){
    var element = Event.element(event);
    attributeId = element.parentNode.id.replace(/[a-z-]*/, '');
    optionId = element.id.replace(/[a-z-]*/, '');
    
    this.selectImage(element);
    
    $('attribute' + attributeId).value = optionId;
    this.configureElement($('attribute' + attributeId));
}

Product.Config.prototype.selectImage = function(element)
{
    attributeId = element.parentNode.id.replace(/[a-z-]*/, '');
    $('amconf-images-' + attributeId).childElements().each(function(child){
        if(child.childElements()[0])
            child.childElements()[0].removeClassName('amconf-image-selected');
    });
    element.addClassName('amconf-image-selected');
}

Product.Config.prototype.processEmpty = function()
{
    $$('.super-attribute-select').each(function(select) {
        var attributeId = select.id.replace(/[a-z]*/, '');
        if (select.disabled)
        {
            if ($('amconf-images-' + attributeId))
            {
                $('amconf-images-' + attributeId).parentNode.removeChild($('amconf-images-' + attributeId));
            }
            holder = select.parentNode;
            holderDiv = document.createElement('div');
            holderDiv.addClassName('amconf-images-container');
            holderDiv.id = 'amconf-images-' + attributeId;
            if ('undefined' != typeof(confData))
            {
            	holderDiv.innerHTML = confData.textNotAvailable;
            } else 
            {
            	holderDiv.innerHTML = "";
            }
            holder.insertBefore(holderDiv, select);
        } else if (!select.disabled && !$(select).hasClassName("no-display")) {
            var element = $(select.parentNode).select('#amconf-images-' + attributeId)[0];
            if (typeof confData != 'undefined' && typeof element != 'undefined' && element.innerHTML == confData.textNotAvailable){
                element.parentNode.removeChild(element);
            }
        }
    }.bind(this));
}

Product.Config.prototype.clearConfig = function()
{
    this.settings[0].value = "";
    if (typeof confData != 'undefined')
    	confData.isResetButton = true;
    this.configureElement(this.settings[0]);
    $$('span.amconf-label').each(function (el){
	el.remove();
    })
    return false;
}

Product.Config.prototype.updateData = function(key)
{
    var imageClassName = '.product-img-box';
    if(!$$(imageClassName)[0]) var imageClassName = '.img-box';
    if(!$$(imageClassName)[0]) var imageClassName = '.product-img-column';
    if ('undefined' == typeof(confData))
    {
        return false;
    }
    if (confData.hasKey(key))
    {
        // getting values of selected configuration
        if (confData.getData(key, 'name'))
        {
            $$('.product-name h1').each(function(container){
                if (!confData.getDefault('name'))
                {
                    confData.saveDefault('name', container.innerHTML);
                }
                container.innerHTML = confData.getData(key, 'name');
            }.bind(this));
        }
        if (confData.getData(key, 'short_description'))
        {
            $$('.short-description div').each(function(container){
                if (!confData.getDefault('short_description'))
                {
                    confData.saveDefault('short_description', container.innerHTML);
                }
                container.innerHTML = confData.getData(key, 'short_description');
            }.bind(this));
        }
        if (confData.getData(key, 'description'))
        {
            $$('.box-description div').each(function(container){
                if (!confData.getDefault('description'))
                {
                    confData.saveDefault('description', container.innerHTML);
                }
                container.innerHTML = confData.getData(key, 'description');
            }.bind(this));
        }
        if (confData.getData(key, 'media_url'))
        {
            // should reload images
            $$(imageClassName).each(function(container){
                tmpContainer = container;
            }.bind(this));
            new Ajax.Updater(tmpContainer, confData.getData(key, 'media_url'), {
                evalScripts: true,
                onSuccess: function(transport)
                {
                     
                },
                onCreate: function()
                {
                    confData.saveDefault('media', tmpContainer.innerHTML);
                    confData.currentIsMain = false;  
                },
                onComplete: function()
                {
                    if('undefined' != typeof(AmZoomerObj)) {
				    $$('.zoomContainer')[0].remove();
			            AmZoomerObj.loadZoom();
			        }
                    jQuery('.cloud-zoom, .cloud-zoom-gallery').CloudZoom();
                }
            });
        } else if (confData.getData(key, 'noimg_url'))
        {
            noImgInserted = false;
            $$(imageClassName + ' img').each(function(img){
                if (!noImgInserted)
                {
                    img.src = confData.getData(key, 'noimg_url');
                    $(img).stopObserving('click');
                    $(img).stopObserving('mouseover');
                    $(img).stopObserving('mousemove');
                    $(img).stopObserving('mouseout');
                    noImgInserted = true;
                }
            });
        }
        else if (confData.getDefault('media') && !confData.currentIsMain)
        {
            $$(imageClassName).each(function(container){
                tmpContainer = container;
            }.bind(this));
            new Ajax.Updater(tmpContainer, confData.mediaUrlMain, {
                evalScripts: true,
                onSuccess: function(transport) {
                    confData.saveDefault('media', tmpContainer.innerHTML);
                    confData.currentIsMain = true;
                },
				onComplete: function()
				{
					if('undefined' != typeof(AmZoomerObj)) {
					    $$('.zoomContainer')[0].remove();
					     AmZoomerObj.loadZoom();
					}
                    jQuery('.cloud-zoom, .cloud-zoom-gallery').CloudZoom();
				}
            });
        }
    } else 
    {
        // setting values of default product
        if (true == confData.getDefault('set'))
        {
            if (confData.getDefault('name'))
            {
                $$('.product-name h1').each(function(container){
                    container.innerHTML = confData.getDefault('name');
                }.bind(this));
            }
            if (confData.getDefault('short_description'))
            {
                $$('.short-description div').each(function(container){
                    container.innerHTML = confData.getDefault('short_description');
                }.bind(this));
            }
            if (confData.getDefault('description'))
            {
                $$('.box-description div').each(function(container){
                    container.innerHTML = confData.getDefault('description');
                }.bind(this));
            }
            if (confData.getDefault('media') && !confData.currentIsMain)
            {
                $$(imageClassName).each(function(container){
                    tmpContainer = container;
                }.bind(this));
                new Ajax.Updater(tmpContainer, confData.mediaUrlMain, {
                    evalScripts: true,
                    onSuccess: function(transport) {
                        confData.saveDefault('media', tmpContainer.innerHTML);
                        confData.currentIsMain = true;
                    },
					onComplete: function()
					{
						if('undefined' != typeof(AmZoomerObj)) {
						    $$('.zoomContainer')[0].remove();
						    AmZoomerObj.loadZoom();
						}
                        jQuery('.cloud-zoom, .cloud-zoom-gallery').CloudZoom();
					}
				});
            }
        }
    }
}

//start code for reload simple price

Product.Config.prototype.reloadSimplePrice = function(key)
{
     if ('undefined' == typeof(confData))
    {
        return false;
    }
    
    var container;
    var result = false;
    if (confData.hasKey(key))
    {
        // convert div.price-box into price info container
        // top price box
        if (confData.getData(key, 'price_html'))
        {
	        $$('.product-shop .price-box').each(function(container)
            {
                if (!confData.getDefault('price_html'))
                {
                    confData.saveDefault('price_html', container.innerHTML);
                }
                container.addClassName('amconf_price_container');
            }.bind(this));


             $$('.product-shop .tax-details').each(function(container)
                {
                    container.remove();
        }.bind(this));
   
            $$('.amconf_price_container').each(function(container)
            {
		        container.outerHTML = confData.getData(key, 'price_html');	
	        }.bind(this));        
        }
        
        // bottom price box
        if (confData.getData(key, 'price_clone_html'))
        {
            $$('.product-options-bottom .price-box').each(function(container)
            {
                if (!confData.getDefault('price_clone_html'))
                {
                    confData.saveDefault('price_clone_html', container.innerHTML);
                }
                container.addClassName('amconf_price_clone_container');
            }.bind(this));
            
            $$('.amconf_price_clone_container').each(function(container)
            {
		container.outerHTML = confData.getData(key, 'price_clone_html');	
	    }.bind(this));

        }
        
        // function return value
        if (confData.getData(key, 'price'))
        {
            result = confData.getData(key, 'price');
        }
    } 
    else 
    {
        // setting values of default product
        if (true == confData.getDefault('set'))
        {
            // restore price info containers into default price-boxes
            if (confData.getDefault('price_html'))
            {
		        $$('.product-shop .price-box').each(function(container)
                {
                    container.addClassName('amconf_price_container');
                }.bind(this));
                          
                $$('.amconf_price_container').each(function(container)
            	{
			        container.innerHTML  = confData.getDefault('price_html');
                	container.removeClassName('amconf_price_container');	
	    	    }.bind(this));
            }
            
            if (confData.getDefault('price_clone_html'))
            {
		        $$('.product-options-bottom .price-box').each(function(container)
                {
                    container.addClassName('amconf_price_clone_container');
                }.bind(this));

                $$('.amconf_price_clone_container').each(function(container){
			        container.innerHTML = confData.getDefault('price_clone_html');
                	container.removeClassName('amconf_price_clone_container');	
	    	    }.bind(this));
                
            }
            
            // function return value
            if (confData.getDefault('price'))
            {
                result = confData.getDefault('price');
            }
        }
    }
    
    return result; // actually the return value is never used
}




Product.Config.prototype.getOptionLabel = function(option, price){
    var price = parseFloat(price);
    if (this.taxConfig.includeTax) {
        var tax = price / (100 + this.taxConfig.defaultTax) * this.taxConfig.defaultTax;
        var excl = price - tax;
        var incl = excl*(1+(this.taxConfig.currentTax/100));
    } else {
        var tax = price * (this.taxConfig.currentTax / 100);
         var excl = price;
         var incl = excl + tax;
    }
    if (this.taxConfig.showIncludeTax || this.taxConfig.showBothPrices) {
        price = incl;
    } else {
        price = excl;
    }
    var str = option.label;
    
    /* DWELL: Returning here to avoid addition of price to pdp option label */
    return str;
    
    
    if(price){
        if('undefined' != typeof(confData) && confData.useSimplePrice == "1" && confData['optionProducts'] && confData['optionProducts'][option.id] && confData['optionProducts'][option.id]['price']) {
            str+= ' ' + this.formatPrice(confData['optionProducts'][option.id]['price'], true);
            pos = str.indexOf("+");
            str = str.substr(0, pos) + str.substr(pos + 1, str.length);
        }
        else {
            if (this.taxConfig.showBothPrices) {
                str+= ' ' + this.formatPrice(excl, true) + ' (' + this.formatPrice(price, true) + ' ' + this.taxConfig.inclTaxTitle + ')';
            } else {
                str+= ' ' + this.formatPrice(price, true);
            }
        }
    }
    else {
        if('undefined' != typeof(confData) && confData.useSimplePrice == "1" && confData['optionProducts'] && confData['optionProducts'][option.id] && confData['optionProducts'][option.id]['price']) {
            str+= ' ' + this.formatPrice(confData['optionProducts'][option.id]['price'], true);
            pos = str.indexOf("+");
            str = str.substr(0, pos) + str.substr(pos + 1, str.length);
        }    
    }
    return str;
}

Product.Config.prototype.hideATC = function() {
	Element.hide('add_to_cart');
	Element.addClassName('wish_list_button','wishlist-atc');
}

Product.Config.prototype.showATC = function() {
	Element.show('add_to_cart');
	Element.removeClassName('wish_list_button','wishlist-atc');
}

/*
 DWELL - Removing per email from Amasty to remove extra custom status after installation 
 of Product Alert extension.
 
Product.Config.prototype.reloadOptionLabels = function(element){
    var selectedPrice;
    if(element.options[element.selectedIndex].config && !this.config.stablePrices){
        selectedPrice = parseFloat(element.options[element.selectedIndex].config.price)
    }
    else{
        selectedPrice = 0;
    }
    for(var i=0;i<element.options.length;i++){
        if(element.options[i].config){
            //extension code start for compatibility with Custom Stock Sratus
            var text = element.options[i].text;
            var posFirst = text.indexOf('(');
            var posSecond = text.indexOf(')');
            if(posFirst && posSecond){
                text = text.substring(posFirst-1, posSecond+1);    
            }
            else {
                text = '';
            }
            //extension code end
            parentAttributeProducts = this.getParentAttributeProducts();
			isOOS = this.productIsOOS(element.options[i].id, parentAttributeProducts, attributeId,i-1);

            element.options[i].text = this.getOptionLabel(element.options[i].config, element.options[i].config.price-selectedPrice) + text;
        }
    }
} */

Event.observe(window, 'load', function(){
    if ('undefined' != typeof(confData) && confData.useSimplePrice == "1")
    {
        confData.reloadOptions();
    }
});
// extension Code End