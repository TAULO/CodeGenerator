(function() {
	class Scenes extends window.Extension {
	    constructor() {
	      	super('scenes');
      		
            this.debug = false; // if enabled, show more output in the console
            
            this.all_things = [];
            this.scenes = {};
            
            
			//console.log("Adding scenes addon to main menu");
			this.addMenuEntry('Scenes');
            
            
            // Send the token to the backout. Timeout gives the backend some time to get started.
            setTimeout(() => {
                const jwt = localStorage.getItem('jwt');

                window.API.postJson(
                  `/extensions/${this.id}/api/ajax`,
        			{'action':'save_token','jwt':jwt}

                ).then((body) => {

                }).catch((e) => {
          			console.log("Error saving token: ", e);
                });
            }, 5000);
            
            
            
            
            
            // Load the html
            this.content = ''; // The html from the view will be loaded into this variable
			fetch(`/extensions/${this.id}/views/content.html`)
	        .then((res) => res.text())
	        .then((text) => {
	         	this.content = text;
                
                // This is needed because the user might already be on the addon page and click on the menu item again. This helps to reload it.
	  		 	if( document.location.href.endsWith("extensions/scenes") ){
	  		  		this.show();
	  		  	}
	        })
	        .catch((e) => console.error('Failed to fetch content:', e));
            
            
            // This is not needed, but might be interesting to see. It will show you the API that the controller has available. For example, you can get a list of all the things this way.
            //console.log("window API: ", window.API);
            
	    }






		//
        //  SHOW
        //
        // This is called then the user clicks on the addon in the main menu, or when the page loads and is already on this addon's location.
	    show() {
			//console.log("scenes show called");
			//console.log("this.content:");
			//console.log(this.content);
            
            
			const main_view = document.getElementById('extension-scenes-view');
			
			if(this.content == ''){
                //console.log("content has not loaded yet");
				return;
			}
			else{
				main_view.innerHTML = this.content;
			}
			
            
            
            
            
            
            
            // SAVE button press
            document.getElementById('extension-scenes-edit-save-button').addEventListener('click', (event) => {
            	//console.log("scenes: edit save button clicked. Event: ", event);
                this.save_scene();
            });
            
            
            // TEST button press
            document.getElementById('extension-scenes-edit-test-button').addEventListener('click', (event) => {
            	//console.log("scenes: edit test button clicked. Event: ", event);
                this.save_scene(true);
            });
            
            
            
            
            
            // Easter egg when clicking on the title
			document.getElementById('extension-scenes-title').addEventListener('click', (event) => {
				//alert("You found an easter egg!");
                this.edit_scene();
			});
            
            
            
            
            // Button to show the second page
            document.getElementById('extension-scenes-show-second-page-button').addEventListener('click', (event) => {
                //console.log("scenes: clicked on + button");
                document.getElementById('extension-scenes-content-container').classList.add('extension-scenes-showing-second-page');
                
                // iPhones need this fix to make the back button lay on top of the main menu button
                document.getElementById('extension-scenes-view').style.zIndex = '3';
                this.edit_scene();
                
			});
            
            // Back button, shows main page
            document.getElementById('extension-scenes-back-button-container').addEventListener('click', (event) => {
                //console.log("scenes: clicked on back button");
                document.getElementById('extension-scenes-content-container').classList.remove('extension-scenes-showing-second-page');
                
                // Undo the iphone fix, so that the main menu button is clickable again
                document.getElementById('extension-scenes-view').style.zIndex = 'auto';
                
                this.get_init_data(); // repopulate the main page
                
			});
            
            
            // Scroll the content container to the top
            document.getElementById('extension-scenes-view').scrollTop = 0;
            
            // Finally, request the first data from the addon's API
            this.get_init_data();
            
            
		}
		
	
		// This is called then the user navigates away from the addon. It's an opportunity to do some cleanup. To remove the HTML, for example, or stop running intervals.
		hide() {
			//console.log("scenes hide called");
		}
        
    
    
    
        //
        //  INIT
        //
        // This gets the first data from the addon API
        
        get_init_data(){
            
			try{
                
                const jwt = localStorage.getItem('jwt');
                
		  		// Init
		        window.API.postJson(
		          `/extensions/${this.id}/api/ajax`,
                    {'action':'init','jwt':jwt}

		        ).then((body) => {
                    //console.log("init response: ", body);
                    
                    // We have now received initial data from the addon, so we can hide the loading spinner by adding the 'hidden' class to it.
                    document.getElementById('extension-scenes-loading').classList.add('extension-scenes-hidden');
                    
                    // If debug is available in the init data, set the debug value and output the init data to the console
                    if(typeof body.debug != 'undefined'){
                        this.debug = body.debug;
                        if(body.debug == true){
                            console.log("scenes: debugging enabled. Init API result: ", body);
                            
                            // If debugging is enabled, please show a big warning that this is the case. 
                            // Debugging can be a privacy risk, since lots of data will be stored in the internal logs. Showing this warning helps avoid abuse.
                            // Here we just manipulate the element style directly, instead of using the 'hidden' class.
                            if(document.getElementById('extension-scenes-debug-warning') != null){
                                document.getElementById('extension-scenes-debug-warning').style.display = 'block';
                            }
                        }
                    }
                    // Generate the list of scenes
                    if(typeof body.scenes != 'undefined'){
                        this.scenes = body['scenes'];
                        this.regenerate_items(body['scenes']);
                    }
                    else{
                        if(this.debug){
                            console.log("no scenes saved yet");
                        }
                    }
                    
				
		        }).catch((e) => {
		  			console.log("Error getting Scenes init data: ", e);
		        });	

			}
			catch(e){
				console.log("Error in API call to init: ", e);
			}
        }
    

        
        
    
	
		//
		//  REGENERATE ITEMS LIST ON MAIN PAGE
		//
	
		regenerate_items(items){
            // This funcion takes a list of items and generates HTML from that, and places it in the list container on the main page
			
            document.getElementById('extension-scenes-view').scrollTop = 0;
            
            try {
				
		        if(this.debug){
                    console.log("scenes: debugging: regenerating. items: ", items);
		        }
                
                let list_el = document.getElementById('extension-scenes-main-items-list'); // list element
                if(list_el == null){
                    console.log("Scenes: Error, the main list container did not exist yet");
                    return;
                }
                
                const scene_names = Object.keys(items);
                
                // If the items list does not contain actual items, then stop
                if(scene_names.length == 0){
                    list_el.innerHTML = '<p style="text-align:center">Click on the (+) button to create a new scene</p>';
                    return
                }
                else{
                    list_el.innerHTML = "";
                }
                
                // The original item which we'll clone  for each item that is needed in the list.  This makes it easier to design each item.
				const original = document.getElementById('extension-scenes-original-item');
			    //console.log("original: ", original);
                
			    // Since each item has a name, here we're sorting the list based on that name first
				//items.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1)
				
                scene_names.sort();
                
                //console.log("scene_names: ", scene_names);
                
				// Loop over all items in the list to create HTML for each item. 
                // This is done by cloning an existing hidden HTML element, updating some of its values, and then appending it to the list element
				for( var index in scene_names ){
					
                    const item = scene_names[index];
                    //console.log("item: ", item);
					var clone = original.cloneNode(true); // Clone the original item
					clone.removeAttribute('id'); // Remove the ID from the clone
                    
                    // Place the name in the clone
                    clone.querySelector(".extension-scenes-item-name").innerText = item; // The original and its clones use classnames to avoid having the same ID twice
                    //clone.getElementsByClassName("extension-scenes-item-value")[0].innerText = items[item].value; // another way to do the exact same thing - select the element by its class name
                     
                    // Create a short description of what the scene does
                    
                    var summary = "";
                    
                    console.log("scene in regen length: ", Object.keys(items[item]).length);
                    
                    clone.querySelector(".extension-scenes-item-description").innerText = Object.keys(items[item]).length + " things";
                    
                    
                    
                    // You could add a specific CSS class to an element depending, for example depending on some value
                    //clone.classList.add('extension-scenes-item-highlighted');   
                    
                    
                    // ADD EDIT BUTTON
                    const edit_button = clone.querySelectorAll('.extension-scenes-item-setter')[0];
                    edit_button.addEventListener('click', (event) => {
                        //console.log("edit button click. event: ", event);
                        
                        document.getElementById('extension-scenes-content-container').classList.add('extension-scenes-showing-second-page');
                        document.getElementById('extension-scenes-view').style.zIndex = '3';
                        this.edit_scene(event.target.innerText);
                    
                    });
                    
                    
                    // ADD PLAY BUTTON
                    
                    const play_button = clone.querySelectorAll('.extension-scenes-item-play-button')[0];
                    play_button.setAttribute('data-name', item);
                    
					play_button.addEventListener('click', (event) => {
                        //console.log("play button click. event: ", event);
                        
						// Inform backend
						window.API.postJson(
							`/extensions/${this.id}/api/ajax`,
							{'action':'play','scene_name': event.target.dataset.name}
						).then((body) => { 
							if(this.debug){
                                console.log("play scene response: ", body);
                            }
                            if(body.state == true){
                                //console.log('the scene was started');
                                
                                event.target.closest(".extension-scenes-item").classList.add('extension-scenes-last-selected'); // find the parent item
                                // Remove the item form the list, or regenerate the entire list instead
                                // parent4.removeChild(parent3);
                            }

						}).catch((e) => {
							console.log("scenes: error in play handler: ", e);
						});
                    
                    });
                    
                    
					// ADD DELETE BUTTON
					const delete_button = clone.querySelectorAll('.extension-scenes-item-delete-button')[0];
                    delete_button.setAttribute('data-name', item);
                    
					delete_button.addEventListener('click', (event) => {
                        //console.log("delete button click. event: ", event);
                        if(confirm("Are you sure you want to delete this scene?")){
    						
    						// Inform backend
    						window.API.postJson(
    							`/extensions/${this.id}/api/ajax`,
    							{'action':'delete','scene_name': event.target.dataset.name}
    						).then((body) => { 
    							if(this.debug){
                                    console.log("delete item response: ", body);
                                }
                                if(body.state == true){
                                    //console.log('the item was deleted on the backend');
                                    
                                    event.target.closest(".extension-scenes-item").style.display = 'none'; // find the parent item
                                    // Remove the item form the list, or regenerate the entire list instead
                                    // parent4.removeChild(parent3);
                                }

    						}).catch((e) => {
    							console.log("scenes: error in delete items handler: ", e);
    						});
                        }
				  	});

                    // Add the clone to the list container
					list_el.append(clone);
                    
                    
                    
				} // end of for loop
                
            
            
			}
			catch (e) {
				console.log("Error in regenerate_items: ", e);
			}
		}
	
    
    
    
    
        edit_scene(scene_name){
            
            document.getElementById('extension-scenes-view').scrollTop = 0;
            
            var scene_settings = {};
            if(typeof scene_name == 'undefined' || scene_name == null || scene_name == ""){
                //console.log("creating new scene");
                document.getElementById('extension-scenes-edit-name').value = "";
            }
            else{
                //console.log("editing existing scene: " + scene_name);
                document.getElementById('extension-scenes-edit-name').value = scene_name;
            }
            
            if(typeof this.scenes[scene_name] == 'undefined'){
                //console.log('non-existant scene');
                document.getElementById('extension-scenes-edit-name').value = "";
            }
            
            document.getElementById('extension-scenes-edit-thing-settings').innerHTML = "";
            
    		// Pre populating the original item that will be clones to create new ones
    	    API.getThings().then((things) => {
			
    			this.all_things = things;
    			if(this.debug){
                    console.log("scenes: debug: all things: ", things);
                }
			    
    			// pre-populate the hidden 'new' item with all the thing names
    			var thing_ids = [];
    			var thing_titles = [];
			
    			for (let key in things){

                    if( things[key].hasOwnProperty('properties') ){ // things without properties should be skipped (edge case)
                        
        				var thing_title = 'unknown';
        				if( things[key].hasOwnProperty('title') ){
        					thing_title = things[key]['title'];
        				}
        				else if( things[key].hasOwnProperty('label') ){ // very old addons sometimes used label instead of title
        					thing_title = things[key]['label'];
        				}
				
        				
        				
			
        				var thing_id = things[key]['href'].substr(things[key]['href'].lastIndexOf('/') + 1);
                        //console.log("thing_id: ", thing_id);
                        
                        if(thing_id == 'scenes-thing'){
                            //console.log("FOUND IT scenes-thing");
                            continue;
                        }
                        
                        if (thing_id.startsWith('highlights-') ){
    						//console.log(thing_id + " starts with highlight-, so skipping.");
    						continue;
                        }
                        
                        //console.log("thing_title and ID: ", thing_title, thing_id);
                        
                        
        				//thing_ids.push( things[key]['href'].substr(things[key]['href'].lastIndexOf('/') + 1) );
                        

                        var thing_container = document.createElement('div');
                        thing_container.classList.add('extension-scenes-edit-item')
                        thing_container.dataset.thing_id = thing_id;
                    
                        var thing_checkbox = document.createElement('input');
                        thing_checkbox.type = "checkbox";
                        thing_checkbox.name = 'extension-scenes-' + thing_id;
                        thing_checkbox.id = 'extension-scenes-' + thing_id;
                        thing_checkbox.classList.add('extension-scenes-edit-item-thing-checkbox');
                    
                        // Set the checkbox of the thing to checked if it was already in the scene
                        if (typeof this.scenes[scene_name] != 'undefined'){
                            if (typeof this.scenes[scene_name][thing_id] != 'undefined'){
                                //console.log("checking thing checkbox");
                                thing_checkbox.checked = true;
                            }
                        }
                    
                        /*
                        if(typeof body.persistent_data.allowed_things != 'undefined'){
                            if( body.persistent_data.allowed_things.indexOf(item.name) > -1){
                                checkbox.checked = true;
                            }
                        }
                        */
                        var thing_label = document.createElement('label');
                        thing_label.htmlFor = 'extension-scenes-' + thing_id;
                        //label.appendChild(checkbox);
                        thing_label.appendChild(document.createTextNode(thing_title));
                
                        
                    
                    
                        // ADD PROPERTIES CONTAINER TO THE THING CONTAINER
                    
                        var properties_container = document.createElement('div');
                        properties_container.classList.add('extension-scenes-edit-item-properties');
                        
                        var found_write_property = false;
                        let properties = things[key]['properties'];
                		for (let prop in properties){
                			//console.log(properties[prop]);
                			var property_title = 'unknown';
                			if( properties[prop].hasOwnProperty('title') ){
                				property_title = properties[prop]['title'];
                			}
                			else if( properties[prop].hasOwnProperty('label') ){
                				property_title = properties[prop]['label'];
                			}
			
                			var property_id = properties[prop]['forms'][0]['href'].substr(properties[prop]['forms'][0]['href'].lastIndexOf('/') + 1);
                            //console.log("property_id: ", property_id);
                            
                            var read_only = false;
                            if( typeof properties[prop]['readOnly'] != 'undefined'){
                                if(properties[prop]['readOnly'] == true){
                                    read_only = true;
                                }
                            }
                            
                            if(read_only == false){
                                
                                // Create container for property
                                var property_container = document.createElement('div');
                                property_container.classList.add('extension-scenes-edit-item-property');
                                property_container.dataset.property_id = property_id
                                
                                // Property is part of scene checkbox
                                var property_checkbox = document.createElement('input');
                                property_checkbox.type = "checkbox";
                                property_checkbox.name = 'extension-scenes-' + thing_id + '---' + property_id;
                                property_checkbox.id = 'extension-scenes-' + thing_id + '---' + property_id;
                                property_checkbox.classList.add('extension-scenes-edit-item-property-checkbox');
                                
                                // Set the checkbox of the property to checked if it was already enabled in the scene
                                if (typeof this.scenes[scene_name] != 'undefined'){
                                    if (typeof this.scenes[scene_name][thing_id] != 'undefined'){
                                        if (typeof this.scenes[scene_name][thing_id][property_id] != 'undefined'){
                                            //console.log("checking property checkbox");
                                            property_checkbox.checked = true;
                                        }
                                    }
                                }
                                
                                // Create label for property
                                var property_label_el = document.createElement('label');
                                property_label_el.htmlFor = 'extension-scenes-' + thing_id + '---' + property_id;
                                property_label_el.appendChild(document.createTextNode(property_title));
                                
                                
                                
                                
                                // Create input element for the property value
                                var input_el = document.createElement('input');
                                input_el.name = 'extension-scenes-' + thing_id + '-----' + property_id;
                                input_el.id = 'extension-scenes-' + thing_id + '-----' + property_id;
                                input_el.classList.add('extension-scenes-edit-item-property-value');
                                
                    			
                                // Number property
                    			if( properties[prop]['type'] == 'integer' || properties[prop]['type'] == 'float' || properties[prop]['type'] == 'number'){
                                    // If a property is a number
    			                    //console.log("number property spotted");
                                    input_el.type = "number";
                    			}
                                
                                // Boolean property
                                else if( properties[prop]['type'] == 'boolean'){
                                    //console.log("boolean property spotted");
                                    input_el = document.createElement('select');
                                    input_el.name = 'extension-scenes-' + thing_id + '-----' + property_id;
                                    input_el.id = 'extension-scenes-' + thing_id + '-----' + property_id;
                                    input_el.classList.add('extension-scenes-edit-item-property-value');
                                    
                                    var unknown_option = document.createElement("option");
                                    unknown_option.value = 'unknown';
                                    unknown_option.text = 'unknown';
                                    input_el.appendChild(unknown_option);
                                    
                                    var true_option = document.createElement("option");
                                    true_option.value = 'true';
                                    true_option.text = 'true';
                                    input_el.appendChild(true_option);
                                    
                                    var false_option = document.createElement("option");
                                    false_option.value = 'false';
                                    false_option.text = 'false';
                                    input_el.appendChild(false_option);
                                    
                                }
                                
                                // Color property
                                else if( properties[prop]['type'] == 'color'){
                                    //console.log("color property spotted");
                                    input_el.type = "color";
                                }
                                
                                // String property
                                else if( properties[prop]['type'] == 'string'){
                                    //console.log("string property spotted");
                                    input_el.type = "text";
                                    
                                    if(property_id == "color"){
                                        input_el.type = "color";
                                    }
                                    
                                    if (typeof properties[prop]['enum'] != 'undefined'){
                                        //console.log('enum spotted');
                                        
                                        input_el = document.createElement('select');
                                        input_el.name = 'extension-scenes-' + thing_id + '-----' + property_id;
                                        input_el.id = 'extension-scenes-' + thing_id + '-----' + property_id;
                                        input_el.classList.add('extension-scenes-edit-item-property-value');
                                        
                                        for (var i = 0; i < properties[prop]['enum'].length; i++) {
                                            var option = document.createElement("option");
                                            option.value = properties[prop]['enum'][i];
                                            option.text = properties[prop]['enum'][i];
                                            input_el.appendChild(option);
                                        }
                                        
                                        
                                        
                                    }
                                }
                                
                                // unsupported property
                                else{
                                    if(this.debug){
                                        console.log("Scenes: Warning, unsupported property type. Skipping");
                                    }
                                    continue;
                                }
                                
                                found_write_property = true;
                                
                                if (typeof this.scenes[scene_name] != 'undefined'){
                                    if (typeof this.scenes[scene_name][thing_id] != 'undefined'){
                                        if (typeof this.scenes[scene_name][thing_id][property_id] != 'undefined'){
                                            if (this.scenes[scene_name][thing_id][property_id] != 'undefined'){
                                                //console.log("adding input value: ", this.scenes[scene_name][thing_id][property_id]);
                                                input_el.value = this.scenes[scene_name][thing_id][property_id];
                                            }
                                        }
                                    }
                                }
                                
                                // Automatically check the checkbox if the property is changed
                                input_el.addEventListener('change', (event) => {
        	                        //console.log("Value changed. Event: ", event);
                                    //console.log("event.currentTarget.parentNode: ", event.currentTarget.parentNode);
                                    const parent_el = event.currentTarget.closest('.extension-scenes-edit-item-property');
                                    //console.log("parent_el: ", parent_el);
                                    const checkbox_sibling = parent_el.getElementsByClassName('extension-scenes-edit-item-property-checkbox')[0];
                                    //console.log("checkbox_sibling: ", checkbox_sibling);
                                    checkbox_sibling.checked = true;
                                });
                                
                                
                                
                                // Add property element to the property container
                                property_container.appendChild(property_checkbox);
                                property_container.appendChild(property_label_el);
                                property_container.appendChild(input_el);
                                
                                // Add the property container to the thing container
                                properties_container.appendChild(property_container);
                            }
                			
                		}
                    
                    
                        // Add thing container to the edit overview
                        if(found_write_property){
                            thing_container.appendChild(thing_checkbox);
                            thing_container.appendChild(thing_label);
                            thing_container.appendChild(properties_container);
                            
                            // Append edit view to the dom
                            document.getElementById('extension-scenes-edit-thing-settings').appendChild(thing_container);
                        }
                        else{
                            if(this.debug){
                                console.log('scenes:debug: thing has no writeable properties: ', thing_id);
                            }
                        }
                        
                    
                        

                    }
    			}
    	    });
            
        } // end of edit_scene
    
    
    
        save_scene(test){
            
            if(typeof test == 'undefined'){
                test = false;
            }
            
            const scene_name = document.getElementById('extension-scenes-edit-name').value;
            if(scene_name == ""){
                alert("Please provide a name");
                return;
            }
            
            var scene_settings = {}
            //document.getElementById('extension-scenes-edit-thing-settings').
            
            document.querySelectorAll('#extension-scenes-edit-thing-settings .extension-scenes-edit-item').forEach(function(thing_item) {
                //console.log('thing_item: ', thing_item);
                let thing_checkbox = thing_item.getElementsByClassName("extension-scenes-edit-item-thing-checkbox")[0]; //item.querySelector['.extension-scenes-edit-item-thing-checkbox'];
                //console.log('thing_checkbox: ', thing_checkbox);
                if(thing_checkbox != null){
                    if( thing_checkbox.checked ){
                        //console.log("'\n\nCHECKED");
                        const thing_id = thing_item.dataset.thing_id;
                        //console.log("scanning thing: " + thing_id);
                        
                        const property_elements = thing_item.querySelectorAll('.extension-scenes-edit-item-property');
                        for (var i = 0; i < property_elements.length; i++) {
                            const property_item = property_elements[i];
                            const property_id = property_item.dataset.property_id;
                            //console.log("scanning property: ", property_id, property_item);
                            
                            let property_checkbox = property_item.getElementsByClassName('extension-scenes-edit-item-property-checkbox')[0];
                            if( property_checkbox.checked ){
                                //console.log("'\n\nPROPERTY CHECKED. thing_id: ", thing_id);
                                
                                if(typeof scene_settings[thing_id] == 'undefined'){
                                    scene_settings[thing_id] = {};
                                }
                                
                                let property_value_item = property_item.getElementsByClassName('extension-scenes-edit-item-property-value')[0];
                                
                                //console.log('- value: ', property_value_item.value);
                                
                                var prop_value = property_value_item.value;
                                if(prop_value == "" || prop_value == "unknown"){
                                    prop_value = null;
                                }
                                
                                scene_settings[thing_id][property_id] = prop_value;
                                
                                //const property_value_elements = property_item.querySelectorAll('.extension-scenes-edit-item-property-value').forEach(function(property_value_item) {
                                //    console.log('- value: ', property_value_item.value);
                                //});
                                
                            }
                            
                        }
                    
                    }
                    else{
                        //console.log("unchecked");
                    }
                }
                else{
                    console.log("error, could not find thing checkbox inside edit item"); 
                }
                
            });
            
            if ( Object.keys(scene_settings).length == 0){
                alert("Please create some settings for your things");
                return;
            }
            else{
                if(this.debug){
                    console.log("\n\nscene_settings: ", scene_settings);
                }
            }
            
            
            var action = 'save_scene';
            if(test){
                action = 'test_scene';
            }
            
            
            // If we end up here, then a name and number were present in the input fields. We can now ask the backend to save the new item.
			window.API.postJson(
				`/extensions/${this.id}/api/ajax`,
				{'action':action, 'scene_name':scene_name, 'scene_settings':scene_settings}
                
			).then((body) => {
                if(this.debug){
                    console.log("save scene response: ", body);
                }
                if(body.state == true){
                    //console.log("saving scene went ok");
                    if(action == 'save_scene'){
                        document.getElementById('extension-scenes-content-container').classList.remove('extension-scenes-showing-second-page');
                        document.getElementById('extension-scenes-view').style.zIndex = 'auto';
                        this.scenes = body['scenes'];
                        this.regenerate_items(body['scenes']);
                    }
                }
                else{
                    //console.log("saving new item failed!");
                    alert("sorry, saving the scene failed.");
                }
                
			}).catch((e) => {
				console.log("scenes: connnection error after save item button press: ", e);
                alert("failed to save scene: connection error");
			});
            
            
            
        }
    
    
    }

	new Scenes();
	
})();


