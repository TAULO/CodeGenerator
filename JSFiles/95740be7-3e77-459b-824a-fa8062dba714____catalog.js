$(function(){
	window.addEventListener('load', function() {
	    let forms = document.getElementsByClassName('needs-validation');
	    
	    let validation = Array.prototype.filter.call(forms, function(form) {
	      form.addEventListener('submit', function(event) {
	    	if (form.checkValidity() === false) {
	          event.preventDefault();
	          event.stopPropagation();
	        }
	        form.classList.add('was-validated');
	        return true;
	      }, false);
	    });
	  }, false);
	
	if(window.location.href.includes('/catalogs')) {
		$('.tree li:has(ul)').addClass('parent_li').find(' > span').attr('title', 'Collapse this branch');
	    $('.tree li.parent_li > span').on('click', function (e) {
	        var children = $(this).parent('li.parent_li').find(' > ul > li');
	        if (children.is(":visible")) {
	            children.hide('fast');
	            $(this).attr('title', 'Expand this branch').find(' > i').addClass('far fa-plus-square').removeClass('fa-minus-square');
	        } else {
	            children.show('fast');
	            $(this).attr('title', 'Collapse this branch').find(' > i').addClass('far fa-minus-square').removeClass('fa-plus-square');
	        }
	        e.stopPropagation();
	    });

	$("input[name=search-catalog]").keydown(function() {
        setTimeout(function() {
            $("td:eq(1)", "#catalogBody>tr").each(function() {
                let lookfor = $("input[name=search-catalog]").val();
                if (new RegExp(lookfor, "i").test($(this).text()))
                    $(this).parent().show();
                else
                    $(this).parent().fadeOut();
            }, 0);

        });
});

	$("input[name=search-entity]").keydown(function() {
        setTimeout(function() {
            $("td:eq(2)", "#entityBody>tr").each(function() {
                let lookfor = $("input[name=search-entity]").val();
                if (new RegExp(lookfor, "i").test($(this).text()))
                    $(this).parent().show();
                else
                    $(this).parent().fadeOut();
            }, 0);

        });
});
	
	$("input[name=search-attribute]").keydown(function() {
        setTimeout(function() {
            $("td:eq(1)", "#attributeBody>tr").each(function() {
                let lookfor = $("input[name=search-attribute]").val();
                if (new RegExp(lookfor, "i").test($(this).text()))
                    $(this).parent().show();
                else
                    $(this).parent().fadeOut();
            }, 0);

        });

    });
	}
	
    
    function updateDBList(dbListArray){
    	let dbDiv = '';
    	const dbObj = JSON.parse(dbListArray);
    	try{
			  for(let i = 0, len = dbObj.length; i < len; i++){
				  let options = ''
				  for(let j = 0; j < dbObj[i].dbList.length; j++){
					  options += 
						  `<option value="${dbObj[i].dbList[j].value}">${dbObj[i].dbList[j].name}</option>`;
				  }
				  dbDiv += 
					  `<optgroup label="${dbObj[i].name}">${options}</optgroup>`;
			  }
    	}catch(e){
    		console.log('Error parsing db list - '+e);
    	}
    	return dbDiv;
    }

	$('.custom-table').find('tr').click(function(){
		$(this).addClass('clicked').siblings().removeClass('clicked');
		if($(this).find('td:eq(0) input').length > 0){
			if($(this).find('td:eq(0) input').is(':checked'))
				$(this).find('td:eq(0) input').prop('checked', false);
			else
				$(this).find('td:eq(0) input').prop('checked', true);
		}
	});
	
	if($('body').hasClass('catalog-view')){
		
		(function() {
			  'use strict';
			  const dbListArray = $('#dbListArray').val();
			  let dbDiv = updateDBList(dbListArray);
			  $('#dbType').append(dbDiv);
			  document.querySelector('#dbType').addEventListener('change', function(){
				  let e = document.getElementById("dbType");
				  let dbVal = e.options[e.selectedIndex].textContent;
				  getFormForDb(dbVal);
			  });
			  
			  
			  let viz;
			  
			  $('#searchCatalog').on( 'keyup', function () {
				  catalogDataTable.search( this.value ).draw();
			    	let val = this.value;
			    	console.log("Search Value: ",val)
			    	$("#catalogBody tr").filter(function() {
			            $(this).toggle($(this).text().toLowerCase().indexOf(val.toLowerCase()) > -1);
			        });
			    });
			  $('#AddEdit').show();
			  $('#SchemaDesignAddEdit').show(); //Added Data Switch changes - For schema design page
			  $('#Optiontabs').find('li').click(function(e){
				    e.preventDefault();
				    e.stopPropagation();
					$('.nav-link.active').removeClass('active');
					$(this).find('a').addClass('active');
					let id = $(this).find('a').attr('href');
					$('.option').hide();
					$(id).show();
					if(id === '#importOptions'){
						$('#catalogTableDiv').parent().show();
					}
					if(id === '#AddEdit' || id === '#SchemaDesignAddEdit'){ //Added Data Switch changes
						$('#catalogTableDiv').parent().show();
					}
					if(id === '#Sync'){
						$('#catalogTableDiv').parent().hide();
					}
			  });
			 
				 
			  $('#catalogTableDiv').on('click', '.clickable-row', function(event) {
				  let syncIcon = $(this).find('td:nth-child(5) i');
				  let graphIcon = $(this).find('td:nth-child(6) i');
				  if($(this).hasClass('active')){
					  $(this).removeClass('active');
					  syncIcon.removeClass('text-light').addClass('text-info');
					  graphIcon.removeClass('text-light').addClass('text-info');
				  }else{
					  $(this).addClass('active').siblings().removeClass('active');
				      $('.sync, .graph').addClass('text-info').removeClass('text-light');
				      if(syncIcon.hasClass('text-info')){
				    	  syncIcon.removeClass('text-info').addClass('text-light');
				      }
				      if(graphIcon.hasClass('text-info')){
				    	 graphIcon.removeClass('text-info').addClass('text-light');
				      }
				  }
			  });
			  
			  //adding event listeners for knowledge graph
			  let syncList = document.querySelectorAll('.sync');
			  for(let i = 0; i < syncList.length; i++){
				  syncList[i].addEventListener('click', function(){
					  SynchronizeWithDB(this); 
				  });
			  }
			  
				$('.toggle').find('div.del').each(function(){
					$(this).find('input').click(function(){
						if($(this).val() == 'other-del'){
							$('#other-del-val').removeClass('none');
						}else{
							$('#other-del-val').addClass('none');
						}
						updateDataPreview(this);
					});
				});
				
				document.querySelector('.add-catalog').addEventListener('click', AddCatalog);
				
				//event listener for modal next and previous buttons
				document.querySelector('#catalog-section-1').addEventListener('click', function(){
					$('a[href="#section-linemove-1"]').click();
				});
				document.querySelector('#catalog-section-2').addEventListener('click', function(){
					$('a[href="#section-linemove-2"]').click();
				});
				
				let editIcons = document.querySelectorAll('.edit-catalog');
				editIcons.forEach(function(el){
					el.addEventListener('click', function(e){
						editCatalog(e);
					})
				});
				
				let deleteIcons = document.querySelectorAll('.delete-catalog');
				deleteIcons.forEach(function(el){
					el.addEventListener('click', function(e){
						deleteConfirmation(e);
					})
				});
				
				document.querySelector('.import-btn').addEventListener('click', function(){
					$('#catalog-import-ddl-modal').modal('show');
					let catalogList = '<option value="--Select Catalog--">--Select Catalog--</option>', name='';
					$('#catalogBody tr').each(function(){
						name = $(this).find('td:eq(1)').text();
						if($(this).hasClass('clicked')){
							catalogList += `<option value="${name}" selected>${name}</option>`
						}else{
							catalogList += `<option value="${name}">${name}</option>`
						}
					})
					$('#import-catalog-list').empty().append(catalogList);
					
				});
				
				document.querySelector('#ddlFile').addEventListener('change', function(e){
					extractDDL(e);
				});
				document.querySelector('#ddl-create').addEventListener('click', function(e){
					importTableDataToCatalog(e);
				});
				
				document.querySelector('#flatfile').addEventListener('change', function(e){
					extractFlatfile(e);
				});
				
				document.querySelector('#metadataFile').addEventListener('change', function(){
					extractMetadataFile(e);
				});
				
				let secondSection = document.querySelectorAll('.flatfile-1');
				secondSection.forEach(function(el){
					el.addEventListener('click', function(e){
						//check if file is uploaded
						e.preventDefault();
						e.stopPropagation();
						if($('#flatfile').val()!='')
							$('a[href="#section-flatfile-2"]').click();
						else{
							alert('Please upload a file to continue.');
							$('a[href="#section-flatfile-1"]').click();
						}
							
					});
				});
				
				let thirdSection = document.querySelectorAll('.flatfile-2');
				thirdSection.forEach(function(el){
					el.addEventListener('click', function(e){
						e.preventDefault();
						e.stopPropagation();
						let delimiterList = [];
						$('.del-section').find('div.del').each(function(){
							if($(this).find('input').is(":checked")){
								if($(this).find('input').val() == 'other-del'){
									delimiterList.push($('#other-del-val').val());
								}else{
									delimiterList.push($(this).find('input').val());
								}
							}
						});
						
						if($('#flatfile-preview').find('tr').length > 0 && delimiterList.length > 0){
							$('a[href="#section-flatfile-3"]').click();
							getFlatFileDataTypes();
						}
							
						else{
							alert('Please select a delimiter to proceed');
							$('a[href="#section-flatfile-2"]').click();
						}
							
					});
				});
				
				document.getElementById("import-ff").addEventListener("click", function(){
					importFlatFileDataToCatalog();
				  });
				
				$('.del-section').find('div.del').each(function(){
					$(this).find('input').click(function(){
						if($(this).val() == 'other-del'){
							$('#other-del-val').removeClass('none');
						}else{
							$('#other-del-val').addClass('none');
						}
						updateTable(this);
						
					});
				});
				
				const fixmeTop = $('#AddEdit').offset().top;
					$('.overflow-sec').on( 'scroll', function(){
						var currentScroll = $('.overflow-sec').scrollTop(); // get current position
						console.log(fixmeTop,currentScroll);
					    if (currentScroll >= fixmeTop - 72) {           // apply position: fixed if you
					        $('#AddEdit').addClass('fixed-h');
					    } else {                                   // apply position: static
					        $('#AddEdit').removeClass('fixed-h');
					    }
					});
					
					$('#import-ddl-tab nav ul').find('li a').click(function(){
						updateTabs(this);
					});
					$('#import-flatfile-tab nav ul').find('li a').click(function(){
						updateTabs(this);
					});
					$('#catalog-add-tab nav ul').find('li a').click(function(){
						updateTabs(this);
					});
					
					function updateTabs(self){
						let id = $(self).attr('href');
						$(self).parent().parent().find('li.tab-current').removeClass('tab-current');
						$(self).parent().addClass('tab-current');
						$(self).parents().eq(3).find('div.content-wrap').find('section.content-current').removeClass('content-current');
						$(id).addClass('content-current');
					}
				
		})();
	}
	
	if($('body').hasClass('entity-view')){
		(function(){
			/*$('#exisitingEntity').on('click', '.clickable-row', function(event) {
			   $(this).addClass('active').siblings().removeClass('active');
			});*/
			
			$('#physicalName').keypress(function( e ) {
			    if(e.which === 32) 
			        return false;
			});
			let entityRadios = document.querySelectorAll('input[name="entityRadio"]');
			for(let i = 0 ; i < entityRadios.length; i++){
				entityRadios[i].addEventListener('click', function(e){
					$('#entityType').val(e.target.value);
					if(e.target.value == 'Query'){
						$('#query-string-div').removeClass('none');
						$('#view-string-div').addClass('none');
						$('.table-props').hide();
					}else if(e.target.value == 'View'){
						$('#query-string-div').addClass('none');
						$('#view-string-div').removeClass('none');
						$('.table-props').hide();
					}else{
						$('#query-string-div').addClass('none');
						$('#view-string-div').addClass('none');
						$('.table-props').show();
					}
				});
			}
			let dbType = $('#catalogdbType').val();
			if(dbType == 'JSON' || dbType == 'Delimited' || dbType == 'Fixed Width' || dbType == 'XML' || dbType == 'Parquet' || dbType == 'Avro'){
				$('.filesDiv').find('div.d-form').each(function(){
					$(this).find('input,select').attr('required', true);
					$(this).find('input[name="rowDelimiter"]').attr('required', false);
				});
			}
			
			const dbListArray = $('#dbListArray').val();
			let dbDiv = updateDBList(dbListArray);
			$('#entityDbType').append(dbDiv);
			document.querySelector('#entityDbType').addEventListener('change', function(){
			  let e = document.getElementById("entityDbType");
			  let dbVal = e.options[e.selectedIndex].textContent;
			  getFormForDb(dbVal);
		  });

			document.querySelector('.add-entity').addEventListener('click', function(){
				AddEntity();
			});
			
			//event listener for modal next and previous buttons
			document.querySelector('#entity-section-1').addEventListener('click', function(){
				$('a[href="#section-entity-1"]').click();
			});
			document.querySelector('#entity-section-2').addEventListener('click', function(){
				$('a[href="#section-entity-2"]').click();
			});

			let editIcons = document.querySelectorAll('.edit-entity');
			editIcons.forEach(function(el){
				el.addEventListener('click', function(e){
					editEntity(e);
				})
			});
			
			let deleteIcons = document.querySelectorAll('.delete-entity');
			deleteIcons.forEach(function(el){
				el.addEventListener('click', function(e){
					deleteEntityConfirmation(e);
				})
			});
			
			document.querySelector('#exportMetadata').addEventListener('click', function(){
				exportMetadataFile();
			});
			
			$("input[name=select-all-entities]").click(function(e){
				if($(e.target).is(':checked')){
					$('.en-sel').prop('checked', true);
				}else{
					$('.en-sel').prop('checked', false);
				}
			});
			
			var fixmeTop = $('#AddEditEntity').offset().top;
			$('.overflow-sec').on( 'scroll', function(){
				var currentScroll = $('.overflow-sec').scrollTop(); // get current position
				console.log(fixmeTop,currentScroll);
			    if (currentScroll >= fixmeTop - 72) {           // apply position: fixed if you
			        $('#AddEditEntity').addClass('fixed-h');
			    } else {                                   // apply position: static
			        $('#AddEditEntity').removeClass('fixed-h');
			    }
			});
			
			$('.tabs nav ul').find('li a').click(function(){
				let id = $(this).attr('href');
				$('.tab-current').removeClass('tab-current');
				$(this).parent().addClass('tab-current');
				$('.content-current').removeClass('content-current');
				$(id).addClass('content-current');
			});
			
			
		})();
	}
	
	
	if($('body').hasClass('attribute-view')){
		(function(){
			$('#exisitingAttribute').on('click', '.clickable-row', function(event) {
			   $(this).addClass('active').siblings().removeClass('active');
			});
			
			$('#physicalName').keypress(function( e ) {
			    if(e.which === 32) 
			        return false;
			});
			document.querySelector('#keyType').addEventListener('change', function(){
				if(this.value == 'Foreign'){
					$('#prTable, #prColumn').removeClass('none');
					try{
						let entityAttrArray = JSON.parse($('#entityAttrArray').val());
						console.log(entityAttrArray);
						let tableOptionDiv = '', columnOptionDiv = '';
						for(let obj in entityAttrArray){
							tableOptionDiv += `<option value="${entityAttrArray[obj].entityName}">${entityAttrArray[obj].entityName}</option>`;
							for(let attr of JSON.parse(entityAttrArray[obj].attrList)){
								if(obj == 0){
									columnOptionDiv += `<option value="${attr.physicalName}">${attr.physicalName}</option>`;
								}
							}
						}
						$('#prTable').find('select').empty().append(tableOptionDiv);
						$('#prColumn').find('select').empty().append(columnOptionDiv);
						$("#prTable").on("change", function(event) { 
							updateColumns(this);
						});
					}catch(e){
						console.log("Error parsing entityAttribute array - "+e);
					}
				}else{
					$('#prTable, #prColumn').addClass('none');
					$('#prTable').find('select').prop('required', false);
					$('#prColumn').find('select').prop('required', false);
				}
			});
			$('#exisitingAttribute').on('click', '.clickable-row', function(event) {
				  $(this).addClass('active').siblings().removeClass('active');
			});
			
			let editIcons = document.querySelectorAll('.edit-attribute');
			editIcons.forEach(function(el){
				el.addEventListener('click', function(e){
					editAttribute(e);
				})
			});
			
			let deleteIcons = document.querySelectorAll('.delete-attribute');
			deleteIcons.forEach(function(el){
				el.addEventListener('click', function(e){
					deleteAttributeConfirmation(e);
				})
			});
			
			//event listener for modal next and previous buttons
			document.querySelector('#attribute-section-1').addEventListener('click', function(){
				$('a[href="#details"]').click();
			});
			document.querySelector('#attribute-section-2').addEventListener('click', function(){
				$('a[href="#configuration"]').click();
			});
			
			document.querySelector('.add-attribute').addEventListener('click', function(){
				addAttribute();
			});
			
			const fixmeTop = $('#AddEdit').offset().top;
			$('.overflow-sec').on( 'scroll', function(){
				var currentScroll = $('.overflow-sec').scrollTop(); // get current position
				console.log(fixmeTop,currentScroll);
			    if (currentScroll >= fixmeTop - 72) {           // apply position: fixed if you
			        $('#AddEdit').addClass('fixed-h');
			    } else {                                   // apply position: static
			        $('#AddEdit').removeClass('fixed-h');
			    }
			});
			
			$('#attribute-add-tab nav ul').find('li a').click(function(){
				updateTabs(this);
			});
			
			function updateTabs(self){
				let id = $(self).attr('href');
				$(self).parent().parent().find('li.tab-current').removeClass('tab-current');
				$(self).parent().addClass('tab-current');
				$(self).parents().eq(3).find('div.content-wrap').find('section.content-current').removeClass('content-current');
				$(id).addClass('content-current');
			}
		})();
	}
});

function SynchronizeWithDB(el){
	let validationDiv = '';
	$(el).addClass('fa-spin');
	let catalogname = $(el).parents().eq(1).find('td:first').text();
	deletenodes(catalogname);
	$.ajax({
		url : ctx +'/synchronizeWithNeoDB',
		data : {'catalogname' : catalogname},
		type : 'post',
		success:function(){
			$(el).removeClass('fa-spin');
		     validationDiv = 
					`
					<div class="alert alert-success alert-dismissible fade show" role="alert">
					  <strong>Successfully synchronized with DB</strong>
					  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
					    <span aria-hidden="true">&times;</span>
					  </button>
					</div>
					`
				$('.validation-message').empty().append(validationDiv);
		}, error:function(data){
			validationDiv = 
				`
				<div class="alert alert-danger alert-dismissible fade show" role="alert">
				  <strong>Failed to synchronize with DB - ${data}</strong>
				  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
				    <span aria-hidden="true">&times;</span>
				  </button>
				</div>
				`
			$('.validation-message').empty().append(validationDiv);
		}
	});
	/*$.post('synchronizeWithNeoDB',{catalogname:catalogname},
     	 function(data){ 
	     console.log(data);
	     
	    },"json");*/
}

function deletenodes(catalogname){
	let config = {
			container_id: "viz",
			server_url: document.getElementById("neo4jURI").value,
			server_user: document.getElementById("neo4jUser").value,
			server_password: document.getElementById("neo4jPwd").value, 
			arrows: true,
			//hierarchical: true,
			//hierarchical_sort_method: "directed",
			labels: {
				"Entity": {
				"caption":"name"},
				"Attribute":{
				"caption":"name"}
			},
			relationships:{
			"Max35Text":{
				"caption": false},
				"TrueFalseIndicator":{
				"caption": false},
				"Max10000Binary":{
				"caption": false},
				"Number":{
				"caption": false},
				"TerminalManagementSystem":{
				"caption": false},
				"BatchTransactionTypeCode":{
				"caption": false},
				"ExchangePolicyCode":{
				"caption": false},
				"ImpliedCurrencyAndAmount":{
				"caption": false},
				"FinancialCaptureCode":{
				"caption": false}
			},
			//initial_cypher: "MATCH (n:Entity { name: 'Acceptor Configuration' })-[r]-(b) RETURN *"
			//initial_cypher: "MATCH (n) \n     WITH (n), RAND() AS random \n       ORDER BY random LIMIT 20 \n    OPTIONAL MATCH (n)-[r]-(m) \n   RETURN n, r, m;"
			//initial_cypher: "MATCH (n) DETACH DELETE n;"
			initial_cypher : "MATCH ()<-[r1*0..1]-(a)<-[rels*]-(t)-[r2*0..1]-() WHERE a.CatalogName='"+catalogname+"' FOREACH (x IN r1 | DELETE x) FOREACH (x IN r2 | DELETE x) FOREACH (x IN rels | DELETE x) DELETE a, t;"
		};
	viz = new NeoVis.default(config);
	viz.render();
}

function updateGraph(catalogname){
		var catalog = "";
		var cataloglist = "";
		var query = "";
		query ="MATCH ()<-[r1*0..1]-(a)<-";
		if(document.getElementById("attributecheck").checked == true){
			query +="[rels*]";
		}else{
			query +="[rels:NODE_OF]";
		}
		query +="-(t)-[r2*0..1]-() WHERE ";
		
		/* alert(document.getElementById("attributecheck").checked);
		alert(document.getElementById("entitycheck").checked);
		if(document.getElementById("attributecheck").checked == false && document.getElementById("entitycheck").checked == false){
			
			query ="MATCH (a) WHERE ";
			
		} */
		var indexNum=0;
		$('.dropdown-menu').find('li').each(function(index){
			
			if($(this).find('input').is(':checked')){ 
				catalog = $(this).find('label').text();
				cataloglist += catalog +"~";
				if(indexNum>0){
					query += "or a.CatalogName='"+catalog+"' ";
				}else{
					query += "a.CatalogName='"+catalog+"' ";	
				}
				indexNum++;
			}
	});
		
		query += "return ";
	if(document.getElementById("catalogcheck").checked == true){
		query += "a, ";
	} 
	
		query += " t, r1, r2, rels;";
		
		//alert(query);
		
		$("#loadertext").show();
	$("#loader").show();
	var data = "Test";
		draw(query,data,cataloglist);
		 $("#loadertext").hide();
		 	$("#loader").hide();
	   $('#catalogSelectModal').modal('hide');
		document.getElementById('KnowledgeGraphViewConsole').style.width = '100%';
		$('.dropdown-menu').find('li').each(function(){
			if($(this).find('div.custom-checkbox label').text() == catalogname){
				$(this).find('div.custom-checkbox input').attr('checked',true);
			}
		});
		document.querySelector('#overlay').classList.remove('none');
	}
	
	
function viewGraph(catalogname){
		var catalog = "";
		var query ="MATCH ()<-[r1*0..1]-(a)<-[rels*]-(t)-[r2*0..1]-() WHERE ";
		var indexNum=0;
		$('#selectCtlgs').find('div.custom-control').each(function(index){
			if($(this).find('input').is(':checked')){ 
				
				catalog = $(this).find('label').text();
				if(indexNum>0){
					query += "or a.CatalogName='"+catalog+"' ";
				}else{
					query += "a.CatalogName='"+catalog+"' ";	
				}
				indexNum++;
			}
	});
		
		if(indexNum==0 && catalogname != ""){
			query += "a.CatalogName='"+catalogname+"' ";	
		}
		
		query += "return a, t, r1, r2, rels;";
		
    $("#loadertext").show();
	$("#loader").show();
	var data = "Test";
		draw(query,data,catalogname);
		 $("#loadertext").hide();
		 	$("#loader").hide();
	   $('#catalogSelectModal').modal('hide');
		document.getElementById('KnowledgeGraphViewConsole').style.width = '100%';
		$('.dropdown-menu').find('li').each(function(){
			if($(this).find('div.custom-checkbox label').text() == catalogname){
				$(this).find('input').prop('checked',true);
			}else{
				$(this).find('div.custom-checkbox input').attr('checked',false);
			}
		});
		document.querySelector('#overlay').classList.remove('none');
		
}
	
function addGraphView(catalogname){
		//alert('addGraphView');
		/* $.post('/loadknowledgegraphview/'+catalogname,function(res){
	      alert("Data: " + res);
    }); */
    $("#loadertext").show();
	$("#loader").show();
    deletenodes(catalogname);
		$.post('loadknowledgegraphview',{catalogname:catalogname},
         	 function(data){ 
  		     console.log(data);
  		     //alert('Success');
  		     $("#loadertext").hide();
		 	$("#loader").hide();
  		   draw(catalogname,data);
  		   $('#catalogSelectModal').modal('hide');
  			document.getElementById('KnowledgeGraphViewConsole').style.width = '100%';
  			document.querySelector('#overlay').classList.remove('none');
  		    },"json");
		
		
}

function closeConsole(){
	clearCatalogCheckBoxes();
	document.getElementById('KnowledgeGraphViewConsole').style.width = '0px';
	document.querySelector('#overlay').classList.add('none');
	
}

function searchIncatalog(){
	var serText=document.getElementById("searchtext").value;  
	var query="";
	var cataloglist="";
	var indexNum=0;
	 if($('#entity').is(':checked')){
		 query = "MATCH ()<-[r1*0..1]-(a)<-[rels*]-(t)-[r2*0..1]-() WHERE "
	}else if($('#attribute').is(':checked')){
		query = "MATCH ()<-[r1*0..1]-(a)<-[rels*]-(t)-[r2*0..1]-() WHERE a.AttributeName='"+serText+"' return a, t, r1, r2, rels;"
	} 
	 query += "MATCH ()<-[r1*0..1]-(a)<-[rels*]-(t)-[r2*0..1]-() WHERE a.EntityName='"+serText+"' return a, t, r1, r2, rels;"
	 
	 /* $('.dropdown-menu').find('li').each(function(index){
 			
 			if($(this).find('input').is(':checked')){ 
 				catalog = $(this).find('label').text();
 				cataloglist += catalog +"~";
 				if(indexNum>0){
 					query += "or a.CatalogName='"+catalog+"' ";
 				}else{
 					query += "a.CatalogName='"+catalog+"' ";	
 				}
 				indexNum++;
 			}
		});
	 query += "a.EntityName='"+serText+"' return a, t, r1, r2, rels;" */
	
	 //alert(query);
	 drawentityattrib(serText,query);
	
}

function draw(query,data,catalogname) {
	var label = "";
	$.ajax({
		url : ctx+'/graph-view/getNeo4jConfigs?catalogname='+catalogname,
		type: 'get',
		success:function(data){
			console.log(data);
			label = JSON.parse(data);
			var serverconfig = data.split('~');
			var config = {
				container_id: "viz",
				/* server_url: serverconfig[0],
				server_user: serverconfig[1],
				server_password: serverconfig[2], */
				server_url: document.getElementById("neo4jURI").value,
				server_user: document.getElementById("neo4jUser").value,
				server_password: document.getElementById("neo4jPwd").value, 
				/* server_url: "bolt://ec2-3-86-191-219.compute-1.amazonaws.com:7687",
				server_user: "neo4j",
				server_password: "i-02487138c726ac993", */
				//arrows: true,
				//hierarchical: true,
				//hierarchical_sort_method: "directed",
				/* labels: {
					"Entity": {
					"caption":"name"},
					"Attribute":{
					"caption":"name"}
				}, */
				 labels: label,
				
				relationships:{
					"ATTRIBUTE_OF":{
						"thickness": "weight",
		                "caption": false,
		                "community": "Blue",
		                'color':'Blue'
						},
					"NODE_OF":{
						"thickness": "weight",
		                "caption": false,
		                "community": "Blue",
		                'color':'Blue'
						},
						
					},
					
				//initial_cypher: "MATCH (n:Entity { name: 'Acceptor Configuration' })-[r]-(b) RETURN *"
				//initial_cypher: "MATCH (n) \n     WITH (n), RAND() AS random \n       ORDER BY random LIMIT 2000 \n    OPTIONAL MATCH (n)-[r]-(m) \n   RETURN n, r, m;"
				//initial_cypher: "MATCH (n) \n     WITH (n) \n  LIMIT "+serverconfig[3]+" \n    OPTIONAL MATCH (n)-[r]-(m) \n   RETURN n, r, m;"
				//initial_cypher: "MATCH(n) return n;"
				//initial_cypher: "MATCH ()<-[r1*0..1]-(a)<-[rels*]-(t)-[r2*0..1]-() WHERE a.CatalogName='"+catalogname+"' return a, t, r1, r2, rels;"
					initial_cypher: query,
			};
			viz = new NeoVis.default(config);
			viz.render();
			console.log(viz);
		}
	});
	
	

}

function drawentityattrib(searchname,query) {
	var config = {
		container_id: "viz",
		/* server_url: "bolt://ctsc01226215801:7687",
		server_user: "neo4j",
		server_password: "Test1234",   */
		server_url: document.getElementById("neo4jURI").value,
		server_user: document.getElementById("neo4jUser").value,
		server_password: document.getElementById("neo4jPwd").value, 
		 /* server_url: "bolt://ec2-3-86-191-219.compute-1.amazonaws.com:7687",
		server_user: "neo4j",
		server_password: "i-02487138c726ac993",  */
		 labels: {
			"Entity": {
				"caption": "name",
				"community": "community"
			},
			"Attribute": {
				"caption": "name",
				"community": "community"
			}
		}, 
		
		relationships:{
			"ATTRIBUTE_OF":{
				"caption": false,
				"thickness": "weight"},
			"NODE_OF":{
				"caption": false,
				"thickness": "count"}
			},
			
			/* if(flag == 'E'){
				initial_cypher: "MATCH ()<-[r1*0..1]-(a)<-[rels*]-(t)-[r2*0..1]-() WHERE a.EntityName='"+catalogname+"' return a, t, r1, r2, rels;"	
			}else if(lag == 'A'){
				initial_cypher: "MATCH ()<-[r1*0..1]-(a)<-[rels*]-(t)-[r2*0..1]-() WHERE a.AttributeName='"+catalogname+"' return a, t, r1, r2, rels;"
			} */
				
			initial_cypher: query
			 
	};
	viz = new NeoVis.default(config);
	viz.render();
	console.log(viz);

} 


function updateColumns(el){
	let columnOptionDiv = '';
	let selectedEntity = $(el).find('select').val();
	try{
		let entityAttrArray = JSON.parse($('#entityAttrArray').val());
		for(let obj in entityAttrArray){
			if(entityAttrArray[obj].entityName === selectedEntity){
				for(let attr of JSON.parse(entityAttrArray[obj].attrList)){
					columnOptionDiv += `<option value="${attr.physicalName}">${attr.physicalName}</option>`;
				}
			}
		}
		$('#prColumn').find('select').empty().append(columnOptionDiv);
	}catch(e){
		console.log('Unable to update attributes - '+e);
	}
}

function getFormForDb(dbType){
	$('#form-params').find('div.d-form').each(function(){
		$(this).find('input, select').attr('required', true);
		let data = JSON.parse($(this).attr('data-dbtype'));
		if(data.includes(dbType)){
			$(this).find('input,select').attr('required', true);
			$(this).find('input.not-req').attr('required', false);
			$(this).removeClass('none');
		}	
		else{
			$(this).find('input, select').attr('required', false);
			$(this).addClass('none');
		}	
	});
}



const deleteConfirmation = (e) =>{
	let catalogName = $(e.target).parent().parent().find('td:eq(1)').text();
	if(catalogName=="" || catalogName==undefined){
		validationDiv = 
			`
			<div class="alert alert-danger alert-dismissible fade show" role="alert">
			  <strong>Error!</strong> Please select a catalog to delete
			  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
			    <span aria-hidden="true">&times;</span>
			  </button>
			</div>
			`
		$('.validation-message').empty().append(validationDiv);
		

	}else{
		validationDiv = 
			`
			<div class="alert alert-warning alert-dismissible fade show" role="alert">
			  <strong>Are you sure you want to delete?</strong>
			  <button class="btn btn-outline-secondary btn-sm ml-2 delete-catalog-ys">Yes</button>
			  <button class="btn btn-outline-secondary btn-sm ml-2" data-dismiss="alert">No</button>
			  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
			    <span aria-hidden="true">&times;</span>
			  </button>
			</div>
			`
		$('.validation-message').empty().append(validationDiv);
		document.querySelector('.delete-catalog-ys').addEventListener('click', function(){
			deleteCatalog(catalogName);
		});
	}
}

const deleteCatalog = (catalogName) =>{
	let csrf_token = $('meta[name="_csrf"]').attr('content');
	let csrf_name = $('meta[name="_csrf_parameter_name"]').attr('content');
	let form = document.createElement('form');
	form.action = ctx+'/home/migrate/schema-migrator/catalogs/delete-catalog';
	form.method = 'POST';
	form.innerHTML = `<input type="text" name="catalogName" value="${catalogName}">`;
	form.innerHTML += `<input type="hidden" name="${csrf_name}"value="${csrf_token}" />`;
	document.body.append(form);
	form.submit();
}

const editCatalog = (e) => {
	let validationDiv = '';
	 
	let catalogName = $(e.target).parent().parent().find('td:eq(1)').text();
	let dbType = $(e.target).parent().parent().find('td:eq(2)').text();
	
	if(catalogName=="" || catalogName==undefined){
		validationDiv = 
			`
			<div class="alert alert-danger alert-dismissible fade show" role="alert">
			  <strong>Error!</strong> Please select a catalog to edit
			  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
			    <span aria-hidden="true">&times;</span>
			  </button>
			</div>
			`
		$('.validation-message').empty().append(validationDiv);
		

	}else{
		$("#dbType option").filter(function() {
		    return $(this).text() == dbType;
		}).attr("selected", "selected");
		
		$("#dbType").attr('disabled', true);
		$('#catalogName').val(catalogName).attr('readonly', true);
		getFormForDb(dbType);
		let csrf_token = $('meta[name="_csrf"]').attr('content');
		$.ajax({
			url:ctx+'/home/migrate/schema-migrator/catalog/getDetails?catalogName='+catalogName,
			type:'get',
			headers: {'X-CSRF-Token': csrf_token },
			success:function(data){
				try{
					const catalogObj = JSON.parse(data);
					console.log(catalogObj);
						 $('#editconnName').val(catalogObj.connName);
						 $('#catalogDescription').val(catalogObj.catalogDescription);
						 $('#userName').val(catalogObj.userName);
						 $('#password').val(catalogObj.password);
						 $('#hostName').val(catalogObj.hostName);
						 $('#connectionName').val(catalogObj.connectionName);
						 $('#schemaName').val(catalogObj.schemaName);
						 $('#domainname').val(catalogObj.DomainName);
						 $('#subjectarea').val(catalogObj.SubjectArea);
						 $('#port').val(catalogObj.port);
						 $('#accountName').val(catalogObj.snowFlakeAccountName);
						 $('#storageType').val(catalogObj.storageType);
						 $('#directoryPath').val(catalogObj.directoryPath);
						 $('#fileExtenstion').val(catalogObj.fileExtenstion);
						 $('#headerRows').val(catalogObj.headerRows);
						 $('#textQualifier').val(catalogObj.textQualifier);
						 $('#columnDelimiter').val(catalogObj.columnDelimiter);
						 $('#rowDelimiter').val(catalogObj.rowDelimiter);
						 $("#catalog-add-modal").modal('show');
						 $('#AddcatalogForm').attr('action',ctx+'/home/migrate/schema-migrator/catalogs/edit-catalog');
						$('#create-upd-btn').text('Update');
				}catch(e){
					console.log('Error in parsing catalog details - '+e);
					validationDiv = 
						`
						<div class="alert alert-danger alert-dismissible fade show" role="alert">
						  <strong>Error!</strong> Unable to get catalog details from db. Please try again after some time.
						  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
						    <span aria-hidden="true">&times;</span>
						  </button>
						</div>
						`
					$('.validation-message').empty().append(validationDiv);
					setTimeout(function(){ $('.validation-message').empty(); }, 4000);
				} 
			}
		});
		
	}
}

const AddCatalog = () => {
	$('#AddcatalogForm').attr('action',ctx+'/home/migrate/schema-migrator/catalogs/add-catalog');
	$('#AddcatalogForm').trigger("reset");
	$('#catalogName').attr('readonly', false);
	$('#dbType').attr('disabled', false);
	$('#catalog-add-modal').modal('show');
	$('#create-upd-btn').text('Create');
}

function extractDDL(e){
	$('.ddl-validation').empty();
	let csrf_token = $('meta[name="_csrf"]').attr('content');
	let extension = '';
	const catalogName = $('#import-catalog-list').val();
	let name = e.target.files[0].name;
	if(name.includes('.')){
		extension = name.split('.')[1];
		if(extension === 'sql' || extension === 'txt'){
			if(catalogName != '--Select Catalog--'){
				let oForm = new FormData();
				oForm.append("file", e.target.files[0]);
				$('#ddl-body').empty();
				$.ajax({								
					url: ctx+'/home/migrate/schema-migrator/catalogs/extract-ddl?catalogName='+catalogName,
					data: oForm,
					processData: false,
					contentType: false,
					headers: {'X-CSRF-Token': csrf_token },
					type: 'POST',
					success: function(data){
						if(hasJsonStructure(data)){
							updateTableSection(data);
						}else{
							$('.ddl-validation').append(data).addClass('text-danger');
						}
						
						document.querySelector('#ddlFile').value = null;
					},error:function(data){
						alert('Unable to import metadata file - '+data);
					}
				});	
			}else{
				alert('Please select a catalog');
			}
			
		}else{
			alert('Extension is not supported. Plesae upload a valid file');
		}
	}
	
}

function hasJsonStructure(str) {
    if (typeof str !== 'string') return false;
    try {
        const result = JSON.parse(str);
        const type = Object.prototype.toString.call(result);
        return type === '[object Object]' 
            || type === '[object Array]';
    } catch (err) {
        return false;
    }
}

function extractFlatfile(e){
	let csrf_token = $('meta[name="_csrf"]').attr('content');
	let extension = '';
	const catalogName = $('#import-catalog-list').val();
	let name = e.target.files[0].name;
	if(name.includes('.')){
		extension = name.split('.')[1];
		if(extension === 'csv' || extension === 'txt'){
			if(catalogName != '--Select Catalog--'){
				let oForm = new FormData();
				oForm.append("file", e.target.files[0]);
				$('#ddl-body').empty();
				$.ajax({								
					url: ctx+'/home/migrate/schema-migrator/catalogs/importFlatFileToCatalog?catalogName='+catalogName,
					data: oForm,
					processData: false,
					contentType: false,
					headers: {'X-CSRF-Token': csrf_token },
					type: 'POST',
					success: function(data){
						$('#flatfilePreview').text(data);
						parseFlatFileData(data);
					},error:function(){
						//throw error
					}
				});	
			}else{
				//catalog not selected
			}
			
		}else{
			//throw error
		}
	}
}

function extractMetadataFile(e){
	let csrf_token = $('meta[name="_csrf"]').attr('content');
	let extension = '';
	const catalogName = $('#import-catalog-list').val();
	let name = e.target.files[0].name;
	if(name.includes('.')){
		extension = name.split('.')[1];
		if(extension === 'xlsx'){
			if(catalogName != '--Select Catalog--'){
				let oForm = new FormData();
				oForm.append("file", e.target.files[0]);
				$.ajax({								
					url: ctx+'/home/migrate/schema-migrator/catalogs/${catalogName}/import-metadata-file',
					data: oForm,
					processData: false,
					contentType: false,
					headers: {'X-CSRF-Token': csrf_token },
					type: 'POST',
					success: function(data){
						
					},error:function(){
						//throw error
					}
				});	
			}else{
				//catalog not selected
			}
			
		}else{
			//throw error
		}
	}
}

function parseFlatFileData(data){
	let obj = JSON.parse(data);
	let contentTable = '';
	let length = obj.content.length > 5 ? 5 : obj.content.length;
	
	for(let i = 0; i < length; i++){
		contentTable +=
			`<tr>
				<td>${obj.content[i].lineNo}</td>
				<td>${obj.content[i].content}</td>
			</tr>`
	}
	$('#flatfile-preview').empty().append(contentTable);
	$('#flatfile-datatype-preview').empty().append(contentTable);
	$('a[href="#section-flatfile-2"]').click();
}

function updateTable(el){
	let delimiterList = [], contentTable = '';
	$('.del-section').find('div.del').each(function(){
		if($(this).find('input').is(":checked")){
			if($(this).find('input').val() == 'other-del'){
				delimiterList.push($('#other-del-val').val());
			}else{
				delimiterList.push($(this).find('input').val());
			}
		}
	});
	const flatfilePreview = $('#flatfilePreview').text();
	let pattern = '';
	if($('#conseq-del').is(':checked')){
		pattern = new RegExp('['+delimiterList.join('')+']+');
	}else{
		pattern = new RegExp('['+delimiterList.join('')+']');
	}
	if(delimiterList.length != 0){
		
		let obj = JSON.parse(flatfilePreview);
		let length = obj.content.length > 4 ? 4 : obj.content.length; 
		let eachContent = '';
		for(let i = 0; i < length; i++){
			eachContent = obj.content[i].content;
			let tdDiv = '';
			console.log(eachContent.split(pattern));
			for(let j = 0; j < eachContent.split(pattern).length; j++){
				tdDiv += `<td>${eachContent.split(pattern)[j]}</td>`
			}
			contentTable += 
				`<tr>
					<td>${obj.content[i].lineNo}</td>
					${tdDiv}
				</tr>`
		}
		$('#flatfile-preview').empty().append(contentTable);
		$('#flatfile-datatype-preview').empty().append(contentTable);
	}else{
		console.log(flatfilePreview);
		parseFlatFileData(flatfilePreview);
	}
	
}

function getFlatFileDataTypes(){
	let csrf_token = $('meta[name="_csrf"]').attr('content');
	  let hasHeader = false;
	  if($('#hasHeader').is(':checked')){
		  hasHeader = true;
	  }
	  let catalogName = $('#import-catalog-list').val();
	  let arr = [];
	  let leng = $('#flatfile-datatype-preview').find('tr:eq(0) td').length;
	  
	  for(let i = 0 ; i < leng; i++){
		  if(i != 0){
			  let tdArr = [], tdCols = {};
			  if(hasHeader){
				  $('#flatfile-datatype-preview').find('tr').each(function(index){
					  if(index != 0)
						  tdArr.push($(this).find('td:eq('+i+')').text());
				  });
			  }else{
				  $('#flatfile-datatype-preview').find('tr').each(function(){
					  tdArr.push($(this).find('td:eq('+i+')').text());
				  });
			  }
			  tdCols.dataArray = tdArr;
			  arr.push(tdCols);
		  }
	  }
	$.ajax({
		 url : ctx+'/home/migrate/schema-migrator/catalogs/getFlatfileDatatypes',
		 data : {'catalogName' : catalogName, 'tableArr' : JSON.stringify(arr) },
		 type : 'post',
		headers: {'X-CSRF-Token': csrf_token },
		 success:function(data){
			 let options = '';
			 try{
				 let obj = JSON.parse(data);
				 console.log(obj);
				 for(let i = 0; i < obj.dtList.length; i++){
					 options += `<option value="${obj.dtList[i]}">${obj.dtList[i]}</option>`;
				 }
				 $('#dtype-select').empty().append(options);
				 let tdLength = $('#flatfile-datatype-preview').find('tr:eq(0) td').length;
				 let tdDivs = '<td></td>';
				 for(let k = 0; k < tdLength - 1; k++){
					tdDivs += `<td class="pl-0 pr-1"><select class="form-control form-control-sm">${options}</select></td>`;
				 }
				 $('#flatfile-datatype-preview').find('tr.dtype-row').remove();
				 $('#flatfile-datatype-preview').append(`<tr class="dtype-row">${tdDivs}</tr>`);
				 
				 for(let i = 0 ; i < obj.predDatatypes.length; i++){
					$('#flatfile-datatype-preview').find('tr:last td:eq('+(i+1)+') select').val(obj.predDatatypes[i].datatype.toLowerCase());
					$('#flatfile-datatype-preview').find('tr:last td:eq('+(i+1)+') select').attr('data-length',obj.predDatatypes[i].length); 
				 }
			 }catch(e){
				 console.log('JSON parsing error - '+e);
			 }
		 }
	  });
}

function importFlatFileDataToCatalog(){
	let csrf_token = $('meta[name="_csrf"]').attr('content');
	let hasHeader = true;
	let catalogName = $('#import-catalog-list').val();
	let colArray = [], cols = {}, extension = '', validationDiv;
	let length = $('#flatfile-datatype-preview').find('tr:eq(0) td').length;
	let file = $('#flatfile').val();
	if(file.includes('.')){
		extension = file.substring(file.lastIndexOf('.')+1, file.length);
	}
	let delimiterList = [];
	$('.del-section').find('div.del').each(function(){
		if($(this).find('input').is(":checked")){
			if($(this).find('input').val() == 'other-del'){
				delimiterList.push($('#other-del-val').val());
			}else{
				delimiterList.push($(this).find('input').val());
			}
		}
	});
	if(hasHeader){
		for(let i = 1; i < length; i++){
			cols = {};
			cols.colName = $('#flatfile-datatype-preview').find('tr:eq(0) td:eq('+i+')').text();
			cols.datatype = $('#flatfile-datatype-preview').find('tr:last td:eq('+i+') select').val();
			cols.length = $('#flatfile-datatype-preview').find('tr:last td:eq('+i+') select').data('length');
			colArray.push(cols);
		}
	}
	console.log(colArray);
	$.ajax({
		url : ctx+'/home/migrate/schema-migrator/catalogs/importRefinedData',
		type: 'post', 
		headers: {'X-CSRF-Token': csrf_token },
		data : {'colArray' : JSON.stringify(colArray), 'hasHeader' : hasHeader, 'delimiter' : delimiterList[0], 'catalogName' : catalogName, 'extension' : extension },
		success:function(data){
			let obj = JSON.parse(data);
			if(obj.type == 'Success'){
				window.location.href = ctx+'/home/migrate/schema-migrator/catalogs/'+catalogName;
			}
			else if(obj.type = 'Error'){
				$('#catalog-import-ddl-modal').modal('hide');
				validationDiv = 
					`
					<div class="alert alert-danger alert-dismissible fade show" role="alert">
					  <strong>Failed!</strong> ${obj.message}
					  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
					    <span aria-hidden="true">&times;</span>
					  </button>
					</div>
					`
				$('.validation-message').empty().append(validationDiv);
			}
		},
		error:function(){
			$('#catalog-import-ddl-modal').modal('hide');
			validationDiv = 
				`
				<div class="alert alert-danger alert-dismissible fade show" role="alert">
				  <strong>Failed!</strong> Failed to import. Please try again after some time.
				  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
				    <span aria-hidden="true">&times;</span>
				  </button>
				</div>
				`
			$('.validation-message').empty().append(validationDiv);
		}
	})
	
}

function updateTableSection(data){
	console.log(data);
	let obj = JSON.parse(data);
	let div = '';
	if(obj.error == ''){
		console.log(obj.output);
		for(let table of obj.output){
			let value = JSON.stringify(table);
			div += `<tr data-value='${value}' data-catalogname='${obj.catalogName}'>
						<td style="width:100px"><div class="custom-control custom-checkbox fnt-16 text-left">
							  <input type="checkbox" class="custom-control-input ddl-select" id="${table.tableName}" checked>
							  <label class="custom-control-label" for="${table.tableName}"></label>
							</div>
						</td>
						<td>${table.tableName}</td>
					</tr>`
		}
		$('#ddl-body').empty().append(div);
	}
	$("input[name=search-ddl-table]").keydown(function() {
        setTimeout(function() {
            $("td:eq(1)", "#ddl-body>tr").each(function() {
                let lookfor = $("input[name=search-ddl-table]").val();
                if (new RegExp(lookfor, "i").test($(this).text()))
                    $(this).parent().show();
                else
                    $(this).parent().fadeOut();
            }, 0);

        });
	});
	
	$("input[name=select-all-tables-ddl]").click(function(e){
		if($(e.target).is(':checked')){
			$('.ddl-select').prop('checked', true);
		}else{
			$('.ddl-select').prop('checked', false);
		}
	});
	$('a[href="#section-ddl-2"]').click();		
}

function importTableDataToCatalog(e){
	if($('#ddl-body tr').length <= 0){
		alert('Please upload a file');
	}else{
		let tableValues = [], catalogName = '';
		$('#ddl-body').find('tr').each(function(){
			if($(this).find('td:eq(0) input').is(':checked')){
				console.log($(this).data('value'));
				tableValues.push($(this).data('value'));
				catalogName = $(this).data('catalogname');
			}
		});
		
		let csrf_token = $('meta[name="_csrf"]').attr('content');
		let csrf_name = $('meta[name="_csrf_parameter_name"]').attr('content');
		let form = document.createElement('form');
		form.action = ctx+'/home/migrate/schema-migrator/catalogs/add-custom-catalog';
		form.method = 'POST';
		form.innerHTML = `<input type="text" name="tableValues" value='${JSON.stringify(tableValues)}'>`;
		form.innerHTML += `<input type="hidden" name="catalogName"value="${catalogName}" />`;
		form.innerHTML += `<input type="hidden" name="${csrf_name}"value="${csrf_token}" />`;
		document.body.append(form);
		form.submit();	
	}
}

function importDDLData(){
	let catalogName = "", dbType = "", validationDiv = '';
	$('#catalogBody').find('tr').each(function(){
		if($(this).hasClass('active')){
			catalogName = $(this).find('td:first').text();
			dbType = $(this).find('td:nth-child(2)').text();
			$('#catalogNa').val(catalogName);
		}
	});
	if(catalogName === "" || catalogName == undefined){
		validationDiv = 
			`
			<div class="alert alert-danger alert-dismissible fade show" role="alert">
			  <strong>Error!</strong> Please select a catalog to import into.
			  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
			    <span aria-hidden="true">&times;</span>
			  </button>
			</div>
			`
		$('.validation-message').empty().append(validationDiv);
			 
		
	}else if(dbType == 'JSON' || dbType == 'Delimited' || dbType == 'Fixed Width' || dbType == 'XML' || dbType == 'Parquet' || dbType == 'Avro'){
		validationDiv = 
			`
			<div class="alert alert-danger alert-dismissible fade show" role="alert">
			  <strong>Error!</strong> Please select a catalog with database type other than files.
			  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
			    <span aria-hidden="true">&times;</span>
			  </button>
			</div>
			`
		$('.validation-message').empty().append(validationDiv);
		
		
	}else{
		$('#importddl').modal('show');			 
	}
}

function importFlatFile(){
	let loader = document.querySelector('#loaderFlatFile');
	loader.style.display = 'none';
	document.querySelector("#uploadBtnFlatFile").disabled = false;
	let catalogName = "", dbType = "", validationDiv = '';
	 $('#catalogBody').find('tr').each(function(){
		if($(this).hasClass('active')){
			catalogName = $(this).find('td:first').text();
			dbType = $(this).find('td:nth-child(2)').text();
			$('#catalogNf').val(catalogName);
		}
	});
	 if(catalogName === "" || catalogName == undefined){
			validationDiv = 
				`
				<div class="alert alert-danger alert-dismissible fade show" role="alert">
				  <strong>Error!</strong> Please select a catalog to import into.
				  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
				    <span aria-hidden="true">&times;</span>
				  </button>
				</div>
				`
			$('.validation-message').empty().append(validationDiv);
				 
			
	}else if(dbType != 'JSON' && dbType != 'Delimited' && dbType != 'Fixed Width' && dbType != 'XML' && dbType != 'Parquet' && dbType != 'Avro'){
			validationDiv = 
				`
				<div class="alert alert-danger alert-dismissible fade show" role="alert">
				  <strong>Error!</strong> Please select a catalog with file as database type.
				  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
				    <span aria-hidden="true">&times;</span>
				  </button>
				</div>
				`
			$('.validation-message').empty().append(validationDiv);
			
			
	}else{
		$('#importFlatFile').modal('show');			 
	}
}

function importXMLData()
{
	let validationDiv = '';
	 let catalogName = $('#catalogBody').find('tr.active').find('td:first').text();
	 let dbType = $('#catalogBody').find('tr.active').find('td:nth-child(2)').text();
	 $('#catalogXSD').val(catalogName);
		
	 if(catalogName === "" || catalogName == undefined){
			validationDiv = 
				`
				<div class="alert alert-danger alert-dismissible fade show" role="alert">
				  <strong>Error!</strong> Please select a catalog to import into.
				  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
				    <span aria-hidden="true">&times;</span>
				  </button>
				</div>
				`
			$('.validation-message').empty().append(validationDiv);
				 
			
	}else if(dbType != 'JSON' && dbType != 'Delimited' && dbType != 'Fixed Width' && dbType != 'XML' && dbType != 'Parquet' && dbType != 'Avro'){
			validationDiv = 
				`
				<div class="alert alert-danger alert-dismissible fade show" role="alert">
				  <strong>Error!</strong> Please select a catalog with file as database type.
				  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
				    <span aria-hidden="true">&times;</span>
				  </button>
				</div>
				`
			$('.validation-message').empty().append(validationDiv);
			
			
	}else
	{
		$('#importxsd').modal('show');				 
	}
} 

function showErrorDiv(msg,el){
	let validationDiv = 
	`
	<div class="alert alert-danger alert-dismissible fade show" role="alert">
	  <strong>Error!</strong> ${msg}
	  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
	    <span aria-hidden="true">&times;</span>
	  </button>
	</div>
	`
	$('.'+el).empty().append(validationDiv);
}


//Entity JS Begins

function exportMetadata(){
	let selectedCatalog = document.querySelector('#selectedCatalog').value;
	let srcEntityList = "";
	$('#exisitingEntity').find('tr').each(function(){
		if($(this).find('td:eq(0)').find('input').prop('checked')==true){
			srcEntityList += $(this).find('td:eq(1)').text();
			srcEntityList += "/";
		}
	});
	if(srcEntityList == "" || srcEntityList == undefined)
		showErrorDiv('Please select an entity', 'validation-message');	
	else{
		  $.ajax({
			url:ctx+'/home/migrate/schema-migrator/catalogs/exportMetadata',
			data : {'selectedCatalog' : selectedCatalog, 'scrEntityList' : srcEntityList},
			type:'post',
			success:function(data){
				let form = document.createElement('form');
				form.action = ctx+'/home/migrate/schema-migrator/catalogs/downloadMetadata';
				form.method = 'POST';
				form.innerHTML = `<input name="selectedCatalogExport" value="${selectedCatalog}">`;
				document.body.append(form);
				form.submit();
			}
		}); 
	}
}

function generateDDL() {
    var selectedCatalog = document.querySelector('#selectedCatalog').value;
    var srcEntityList = "";
    $('#exisitingEntity').find('tr').each(function() {
        if ($(this).find('td:eq(0)').find('input').prop('checked') == true) {
        	srcEntityList += $(this).find('td:eq(1) a').text();
            srcEntityList += "/";
        }
    
    });
    if (srcEntityList == "" || srcEntityList == undefined)
    	showErrorDiv('Please select an entity', 'validation-message');	
    else {
        $.ajax({
            url: ctx + '/home/migrate/schema-migrator/catalogs/generateddl',
            data : {'selectedCatalog' : selectedCatalog, 'scrEntityList' : srcEntityList},
            type: 'post',
            success: function(data) {
            	let form = document.createElement('form');
				form.action = ctx+'/home/migrate/catalogs/downloadddl';
				form.method = 'POST';
				form.innerHTML = `<input name="selectedCatalogDdl" value="${selectedCatalog}">`;
				form.innerHTML = `<input name="entityNames" value="${srcEntityList}">`;
				form.innerHTML = `<input name="fileName" value="${data}">`;
				document.body.append(form);
				form.submit();
            }
        });
    }
}

//Entity
function AddEntity(){
	$("#entity-add-modal").modal('show');
	let catalogName = document.querySelector('#selectedCatalog').value;
	let dbType = document.querySelector('#catalogdbType').value;
	$('.filesDiv').find('div.d-form').each(function(){
		let data = JSON.parse($(this).attr('data-dbtype'));
		if(data.includes(dbType)){
			$(this).removeClass('none');
		}
	});
	if((dbType == 'JSON' || dbType == 'Delimited' || dbType == 'Fixed Width' || dbType == 'XML' || dbType == 'Parquet' || dbType == 'Avro')){
		$('.entityTypDiv').addClass('none');
		//get file details from catalog
		let csrf_token = $('meta[name="_csrf"]').attr('content');
		$.ajax({
			url : ctx+'/home/migrate/catalog/getDetails',
			data : {'catalogName' : catalogName},
			headers: {'X-CSRF-Token': csrf_token },
			success:function(data){
				let obj = JSON.parse(data);
				$('#entityDbType').val(obj.dbType);
				$('#storageType').val(obj.storageType);
				$('#directoryPath').val(obj.directoryPath);
				$('#headerRows').val(obj.headerRows);
				$('#fileExtenstion').find('option[text="'+obj.fileExtenstion+'"]').attr('selected','selected');
				$('#textQualifier').find('option[text="'+obj.textQualifier+'"]').attr('selected','selected');
				$('#columnDelimiter').val(obj.columnDelimiter);
				$('#rowDelimiter').val(obj.rowDelimiter);
			},
		});
	}else{
		$('.filesDiv').find('input,select').attr('required',false);
	}
	$('#newEntityForm').trigger('reset');
	$('#create-upd-btn').text('Create');
	$('#newEntityForm').attr('action', ctx+'/home/migrate/schema-migrator/catalogs/'+catalogName+'/saveEntity');
	$('#table').click() //resetting radio button
	$('a[href="#section-entity-1"]').click();
	
}

function editEntity(e){
	  let validationDiv = '';
	  let physicalName = $(e.target).parent().parent().find('td:eq(2)').text();
	  let catalogName = document.querySelector('#selectedCatalog').value;
	  
	   if(physicalName == ''){
		   validationDiv = 
				`
				<div class="alert alert-danger alert-dismissible fade show" role="alert">
				  <strong>Error!</strong> Please select an entity to edit.
				  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
				    <span aria-hidden="true">&times;</span>
				  </button>
				</div>
				`
			$('.validation-message').empty().append(validationDiv);
			
	   
	   }else{
		   let dbType = document.querySelector('#catalogdbType').value;
			$('.filesDiv').find('div.d-form').each(function(){
				let data = JSON.parse($(this).attr('data-dbtype'));
				if(data.includes(dbType)){
					$(this).removeClass('none');
				}
			});
			if((dbType == 'JSON' || dbType == 'Delimited' || dbType == 'Fixed Width' || dbType == 'XML' || dbType == 'Parquet' || dbType == 'Avro')){
				$('.entityTypDiv').addClass('none');
			}else{
				$('#form-params').find('div.d-form').each(function(){
					$(this).find('input, select').attr('required', false);
				})
			}
			
		   fetch(ctx+'/home/migrate/schema-migrator/catalogs/'+catalogName+'/'+physicalName+'/getDetails')
		   .then(response => response.json())
		   .then(result => updateEntityEditConsole(result, physicalName));

			$('#entity-add-modal').modal('show');
		   
		   $('#newEntityForm').attr('action', ctx+'/home/migrate/schema-migrator/catalogs/'+catalogName+'/'+physicalName+'/editEntity');
		   $('#create-upd-btn').text('Update');
		   
		   if(dbType == 'Files - XML'){
				var entityJson = $('#entityJson').text();
				var elementDiv = "";
				var recordIdentifierDiv = "";
				for(var i=0;i<entityJson.length;i++){
					if(entityJson[i].physicalName == physicalNameList[0]){
						var entity = entityJson[i];
						var attrList = entityJson[i].attrList;
						for(var j=0;j<attrList.length;j++){
							var attr = attrList[j];
							elementDiv = elementDiv + '<option title="'+attr.physicalName+'" value="'+attr.physicalName+'('+attr.xpath+')">'+attr.physicalName+'</option>';
						}
						console.log(entity);
						var recordIdentifier = entity.recordIdentifier;
						var recordIdentifierArr = recordIdentifier.split(';');
						for(var j=0;j<recordIdentifierArr.length;j++){
							var recordId = recordIdentifierArr[j];
							if(recordId==""){
								continue;
							}
							var recordName = recordId.split('(')[0];
							var recordXpath = recordId.split('(')[1].split(')')[0];
							recordIdentifierDiv = recordIdentifierDiv + '<option title="'+recordName+'" value="'+recordName+'('+recordXpath+')">'+recordName+'</option>';
						}
					}
				}
				$('#selectedElements').empty().append(recordIdentifierDiv);
				$('#elementList').empty().append(elementDiv);
			}else{
				$('#recordIdentifierDivLabel').addClass('none');
				$('#recordIdentifierDiv').addClass('none');
				$('#xsdRefDivLabel').addClass('none');
				$('#xsdRefDiv').addClass('none');
			}
	}
	$('a[href="#section-entity-1"]').click();
}

function updateEntityEditConsole(result, selectedEntity){
	console.log(result);
	const len = result.entityLst.length;
	for(let i = 0; i < len; i++){
		if(result.entityLst[i].physicalName === selectedEntity){
			
			$('#physicalName').val(result.entityLst[i].physicalName).attr('readonly', true);
			$('#logicalName').val(result.entityLst[i].logicalName);
			$('#description').val(result.entityLst[i].description);
			$('#entityDbType').val(result.entityLst[i].entityDbType != null ? result.entityLst[i].entityDbType : result.dbType);
			$('#directoryPath').val(result.entityLst[i].directoryPath != null ? result.entityLst[i].directoryPath : result.directoryPath);
			$('#fileExtenstion').val(result.entityLst[i].fileExtenstion != null ? result.entityLst[i].fileExtenstion : result.fileExtenstion);
			$('#storageType').val(result.entityLst[i].storageType != null ? result.entityLst[i].storageType : result.storageType);
			$('#textQualifier').val(result.entityLst[i].textQualifier != null ? result.entityLst[i].textQualifier : result.textQualifier);
			$('#columnDelimiter').val(result.entityLst[i].columnDelimiter != null ? result.entityLst[i].columnDelimiter : result.columnDelimiter);
			$('#rowDelimiter').val(result.entityLst[i].rowDelimiter != null ? result.entityLst[i].rowDelimiter : result.rowDelimiter);
			$('#headerRows').val(result.entityLst[i].headerRows != null ? result.entityLst[i].headerRows : result.headerRows);
			$('input[name="entityRadio"]').each(function(){
				if($(this).val() == result.entityLst[i].entityRadio)
					$(this).prop('checked', true);
			})
		}
	}
}

function deleteEntityConfirmation(e){
   let validationDiv = '';
   let physicalName = $(e.target).parent().parent().find('td:eq(2)').text();
   if(physicalName == ''){
	   validationDiv = 
			`
			<div class="alert alert-warning alert-dismissible fade show" role="alert">
			  <strong>Error!</strong> Please select atleast one entity.
			  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
			    <span aria-hidden="true">&times;</span>
			  </button>
			</div>
			`
		$('.validation-message').empty().append(validationDiv);
   }   
   else{
	   validationDiv = 
			`
			<div class="alert alert-warning alert-dismissible fade show" role="alert">
			  <strong>Are you sure you want to delete?</strong>
			  <button class="btn btn-outline-secondary btn-sm ml-2 entity-delete-ys">Yes</button>
			  <button class="btn btn-outline-secondary btn-sm ml-2" data-dismiss="alert">No</button>
			  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
			    <span aria-hidden="true">&times;</span>
			  </button>
			</div>
			`
		$('.validation-message').empty().append(validationDiv);
		document.querySelector('.entity-delete-ys').addEventListener('click', function(){
			deleteEntity(physicalName);
		})
   } 
}

function deleteEntity(physicalName){
	let selectedCatalog = document.querySelector('#selectedCatalog').value;
	let csrf_token = $('meta[name="_csrf"]').attr('content');
	let csrf_name = $('meta[name="_csrf_parameter_name"]').attr('content');
	let form = document.createElement('form');
	form.action = ctx+`/home/migrate/schema-migrator/catalogs/${selectedCatalog}/delete-entity`;
	form.method = 'POST';
	form.innerHTML = `<input type="hidden" name="physicalName" value="${physicalName}">`;
	form.innerHTML += `<input type="hidden" name="${csrf_name}"value="${csrf_token}" />`;
	document.body.append(form);
	form.submit();
}

function callAjaxForSQLQuery(){
	let sqlQuery = document.querySelector('#sqlQuery').value
	let selectedCatalog = document.querySelector('#selectedCatalog').value;
	let div='';
	console.log(sqlQuery);
	if(sqlQuery.trim().length <= 0 || sqlQuery.trim() == ""){
		div='<div class="alert alert-danger alert-dismissible fade show" role="alert">'+
		    '<strong>Error!</strong> Query or View cannot be blank for seleted option'+
		    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
		    '<span aria-hidden="true">&times;</span>'+
		    '</button>'+
		    '</div>'
       $('.validation-message').empty().append(div);
		}
	else {
		 $.ajax({
			url:ctx+'/home/migrate/schema-migrator/catalogs/'+selectedCatalog+'/QueryGenerator',
			type:'post',
			data:{"sqlQuery" : sqlQuery, "CatalogName" : selectedCatalog},
			success:function(data){
				if(data.includes("Table Successfully Imported")){
					div=`
						<div class="alert alert-success alert-dismissible fade show" role="alert">
						    <strong>Success!</strong>${data}
						    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
						    <span aria-hidden="true">&times;</span>
						    </button>
					    </div>`;
				    $('.validation-message').empty().append(div);
					 window.location.reload();					
					}
				else{
					div=`
						<div class="alert alert-danger alert-dismissible fade show" role="alert">
						    <strong>Error!</strong>${data}
						    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
						    <span aria-hidden="true">&times;</span>
						    </button>
					    </div>`;
				    $('.validation-message').empty().append(div);
					}
				},error:function(data){
					div=`
						<div class="alert alert-danger alert-dismissible fade show" role="alert">
						    <strong>Error!</strong>${data}
						    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
						    <span aria-hidden="true">&times;</span>
						    </button>
					    </div>`;
				    $('.validation-message').empty().append(div);
				}
		}); 	
	}
}

function exportMetadataFile(){
	let entityList = [], validationDiv = '';
	let selectedCatalog = document.querySelector('#selectedCatalog').value;
	let csrf_token = $('meta[name="_csrf"]').attr('content');
	let csrf_name = $('meta[name="_csrf_parameter_name"]').attr('content');
	
	$('#entityBody').find('tr').each(function(){
		if($(this).find('td:eq(0) input').is(':checked')){
			entityList.push($(this).find('td:eq(2) a').text());
		}
	});
	if(entityList.length == 0){
		validationDiv = 
			`
			<div class="alert alert-warning alert-dismissible fade show" role="alert">
			  <strong>Error!</strong> Please select atleast one entity to export.
			  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
			    <span aria-hidden="true">&times;</span>
			  </button>
			</div>
			`
		$('.validation-message').empty().append(validationDiv);
	}else{
		let form = document.createElement('form');
		form.action = ctx+`/home/migrate/schema-migrator/catalogs/${selectedCatalog}/exportMetadata`;
		form.method = 'POST';
		form.innerHTML = `<input type="hidden" name="entityList" value="${entityList}">`;
		form.innerHTML += `<input type="hidden" name="${csrf_name}"value="${csrf_token}" />`;
		document.body.append(form);
		form.submit();
	}
}

function closeEntityConsole(){
	document.getElementById("addEntityConsole").style.width = "0px";
}

function deleteAttributeConfirmation(e){
	   let attributeName = $(e.target).parent().parent().find('td:eq(1)').text();
	   let validationDiv = '';
	   if(attributeName == "" || attributeName == undefined){
		   validationDiv = 
				`
				<div class="alert alert-warning alert-dismissible fade show" role="alert">
				  <strong>Error!</strong> Please select atleast one attribute to delete.
				  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
				    <span aria-hidden="true">&times;</span>
				  </button>
				</div>
				`
			$('.validation-message').empty().append(validationDiv);
	 } else{
		 validationDiv = 
				`
				<div class="alert alert-warning alert-dismissible fade show" role="alert">
				  <strong>Are you sure you want to delete?</strong>
				  <button class="btn btn-outline-secondary btn-sm ml-2 delete-attr-ys">Yes</button>
				  <button class="btn btn-outline-secondary btn-sm ml-2" data-dismiss="alert">No</button>
				  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
				    <span aria-hidden="true">&times;</span>
				  </button>
				</div>
				`
			$('.validation-message').empty().append(validationDiv);
			document.querySelector('.delete-attr-ys').addEventListener('click', function(){
				deleteAttribute(attributeName);
			});
	 } 
}

function deleteAttribute(attributeName){
	let csrf_token = $('meta[name="_csrf"]').attr('content');
	let csrf_name = $('meta[name="_csrf_parameter_name"]').attr('content');
	let selectedCatalog = $('#selectedCatalog').val();
	let selectedEntity = $('#selectedEntity').val();
	let form = document.createElement('form');
	form.action = ctx+`/home/migrate/schema-migrator/catalogs/${selectedCatalog}/${selectedEntity}/delete-attribute`;
	form.method = 'POST';
	form.innerHTML = `<input type="hidden" name="attributeName" value="${attributeName}">`;
	form.innerHTML += `<input type="hidden" name="${csrf_name}"value="${csrf_token}" />`;
	document.body.append(form);
	form.submit();
}

function addAttribute(){
	$('#attribute-add-modal').modal('show');
}

function editAttribute(e){
	$('a[href="#details"]').click();
	let validationDiv = '';
	let attributeName = $(e.target).parent().parent().find('td:eq(1)').text();
	const catalogName = $('#selectedCatalog').val();
	const entityName = $('#selectedEntity').val();
	$('#attribute-add-modal').modal('show');
	let physicalName = $(e.target).parent().parent().find('td:eq(1)').text();
	let logicalName = $(e.target).parent().parent().find('td:eq(2)').text();
	let description = $(e.target).parent().parent().find('td:eq(3)').html();
	let datatype = $(e.target).parent().parent().find('td:eq(4)').html();
	let length_precision = $(e.target).parent().parent().find('td:eq(5)').html();
	let scale = $(e.target).parent().parent().find('td:eq(6)').html();
	let nullable = $(e.target).parent().parent().find('td:eq(7)').html();
	let dataFormat = $(e.target).parent().parent().find('td:eq(9)').html();
	let defaultValue = $(e.target).parent().parent().find('td:eq(10)').html();
	let checkConstraint = $(e.target).parent().parent().find('td:eq(11)').html();
	let keyType = $(e.target).parent().parent().find('td:eq(12)').html();
	let primaryTable = $(e.target).parent().parent().find('td:eq(13)').html();
	let primaryColumn = $(e.target).parent().parent().find('td:eq(14)').html();
	$('#physicalName').val(physicalName).attr('readonly', true);
	$('#logicalName').val(logicalName);
	$('#description').val(description);
	$('#datatype').find('option[value="'+datatype+'"]').attr('selected','selected');
	$('#length_precision').val(length_precision);
	$('#scale').val(scale);
	$('#nullable').find('option[text="'+nullable+'"]').attr('selected','selected');
	$('#dataFormat').val(dataFormat);
	$('#defaultValue').val(defaultValue);
	$('#checkConstraint').val(checkConstraint);
	$('#keyType').find('option[value="'+keyType+'"]').attr('selected','selected');
	$('#primaryTableName').val(primaryTable);
	$('#primaryColumnName').val(primaryColumn);
	if(attributeName == "" || attributeName == undefined){
		validationDiv = 
			`
			<div class="alert alert-danger alert-dismissible fade show" role="alert">
			  <strong>Error!</strong> Please select atleast one attribute to edit.
			  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
			    <span aria-hidden="true">&times;</span>
			  </button>
			</div>
			`
		$('.validation-message').empty().append(validationDiv);

	}else{
		$('#attributeForm').attr('action',ctx+`/home/migrate/schema-migrator/catalogs/${catalogName}/${entityName}/editAttributes`);
	}
}


function updateDataPreview(el){
	let delimiterList = [], contentTable = '';
	$('.toggle').find('div.del').each(function(){
		if($(this).find('input').is(":checked")){
			if($(this).find('input').val() == 'other-del'){
				delimiterList.push($('#other-del-val').val());
			}else{
				delimiterList.push($(this).find('input').val());
			}
		}
	});
	let pattern = '';
	if($('#conseq-del').is(':checked')){
		pattern = new RegExp('['+delimiterList.join('')+']+');
	}else{
		pattern = new RegExp('['+delimiterList.join('')+']');
	}
	if(delimiterList.length != 0){
		
		const dataPreview = $('#dataPreview').text();
		let obj = JSON.parse(dataPreview);
		let length = obj.content.length > 5 ? 5 : obj.content.length; 
		let eachContent = '';
		for(let i = 0; i < length; i++){
			eachContent = obj.content[i].content;
			let tdDiv = '';
			console.log(eachContent.split(pattern));
			for(let j = 0; j < eachContent.split(pattern).length; j++){
				tdDiv += `<td>${eachContent.split(pattern)[j]}</td>`
			}
			contentTable += 
				`<tr>
					<td>${obj.content[i].lineNo}</td>
					${tdDiv}
				</tr>`
		}
		$('.preview-content-delimited, .preview-content-delimited-datatype').empty().append(contentTable);
		$('.preview-content-delimited, .preview-content-delimited-datatype').parent().addClass('table-bordered');
		$('.preview-content-delimited-datatype').find('tr td').click(function(){
			let index = $(this).index();
			if(index != 0){
				
			}
		});
	}else{
		$('.preview-content-delimited, .preview-content-delimited-datatype').empty().append($('.preview-content').html());
		$('.preview-content-delimited, .preview-content-delimited-datatype').parent().removeClass('table-bordered');
	}
	
}

/*const SessionInterval = setInterval("checkSession()",60000);
let timeoutHandle;
function continueSession(){
	
	$.ajax({
		url:ctx+'/home/continue-session',
		type:'GET',
		beforeSend:function(request){
            request.setRequestHeader("IS_CONTINUE","Y");
        },
        success:function(data,testStatus,request){
        	window.location.reload();
        }
	});
}*/

function importData(hasHeader){
	let colArray = [], cols = {}, delimiter = '', extension = '', catalogName = '', validationDiv;
	let length = $('.preview-content-delimited-datatype').find('tr:eq(0) td').length;
	delimiter = $('#delimiter-val').val();
	extension = $('#extension-val').val();
	if(hasHeader){
		for(let i = 1; i < length; i++){
			cols = {};
			cols.colName = $('.preview-content-delimited-datatype').find('tr:eq(0) td:eq('+i+')').text();
			cols.datatype = $('.preview-content-delimited-datatype').find('tr:last td:eq('+i+') select').val();
			cols.length = $('.preview-content-delimited-datatype').find('tr:last td:eq('+i+') select').data('length');
			colArray.push(cols);
		}
	}
	$('.slide-title').html('Text Import Wizard <i class="fa fa-spinner fa-spin"></i>');
	$('#slides').empty().addClass('text-center');
	$('.slide-footer').empty();
	$('#slides').append('<h6>Importing the data to catalog</h6><small>You will be automatically redirected once the import is completed</small>');
	
	$('#catalogBody').find('tr').each(function(){
		if($(this).hasClass('active')){
			catalogName = $(this).find('td:first').text();
		}
	});
	console.log(colArray);
	$.ajax({
		url : ctx+'/home/migrate/schema-migrator/catalogs/importRefinedData',
		type: 'post',
		data : {'colArray' : JSON.stringify(colArray), 'hasHeader' : hasHeader, 'delimiter' : delimiter, 'catalogName' : catalogName, 'extension' : extension },
		success:function(data){
			let obj = JSON.parse(data);
			if(obj.type == 'Success'){
				window.location.href = ctx+'/home/migrate/schema-migrator/catalogs/'+catalogName;
			}
			else if(obj.type = 'Error'){
				$('#textImportFlatFile').modal('hide');
				validationDiv = 
					`
					<div class="alert alert-danger alert-dismissible fade show" role="alert">
					  <strong>Failed!</strong> ${obj.message}
					  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
					    <span aria-hidden="true">&times;</span>
					  </button>
					</div>
					`
				$('.validation-message').empty().append(validationDiv);
			}
		},
		error:function(){
			$('#textImportFlatFile').modal('hide');
			validationDiv = 
				`
				<div class="alert alert-danger alert-dismissible fade show" role="alert">
				  <strong>Failed!</strong> Failed to import. Please try again after some time.
				  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
				    <span aria-hidden="true">&times;</span>
				  </button>
				</div>
				`
			$('.validation-message').empty().append(validationDiv);
		}
	})
	
	console.log(colArray);
}



function countdownTimer(minutes){
	var seconds = 60;
	var mins = minutes;
	function tick(){
		var counter = document.getElementById('counter');
		var current_minutes = mins - 1;
		seconds--;
		counter.innerHTML = current_minutes.toString() + ":" + (seconds < 10 ? "0" : "") + String(seconds);
		if(seconds > 0){
			timeoutHandle = setTimeout(tick,1000);
		}else{
			if(mins>1){
				setTimeout(function(){
					countdownTimer(mins - 1);
				},1000);
			}else{
				window.location.href=ctx+"/logout";
			}
		}
	}
	tick();
}



jQuery.fn.reverse = function() {
    return this.pushStack(this.get().reverse());
};




//footer date
if ( $("#footerr").length ) {
	let dt = new Date();
	dt.setMinutes(00);
	dt.setSeconds(10);
	let month = new Array();
	month[0] = "Jan";
	month[1] = "Feb";
	month[2] = "Mar";
	month[3] = "Apr";
	month[4] = "May";
	month[5] = "Jun";
	month[6] = "Jul";
	month[7] = "Aug";
	month[8] = "Sep";
	month[9] = "Oct";
	month[10] = "Nov";
	month[11] = "Dec";
	document.getElementById("footerr").innerHTML = "Last Login:  "+(("0"+dt.getDate()).slice(-2)) +"-"+ ( month[dt.getMonth()]) +"-"+ (dt.getFullYear()) +" "+ (("0"+dt.getHours()).slice(-2)) +":"+ (("0"+dt.getMinutes()).slice(-2))+":"+ (("0"+dt.getSeconds()).slice(-2))+" IST";
}



