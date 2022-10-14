
var rowsCount = '2'; 

var editState = 0;
var editAccessNo = '';
var editHash = '';

//used for addThisAccessNumber()
var gcountry=null;
var gstate = null;
var gAccessNumber = null;
var gexistingAcceNo = null;


var dedicatedAN = [];
 var intervalObjFrom;
 var intervalObjTo;
 var intervalToStatus = 0;
 
 var intervalFromStatus = 0;
 //it will contain accessNumber with hash values
 var hashObj = [];


function addcontact() {
    var allcontact = $('#contact_detail').serialize();
 //p91Loader('start');
    $.ajax({
        url: "action_layer.php?action=addContact",
        type: "POST", dataType: "json",
        data: allcontact,
        success: function(text) {
            var randomNumber = Math.floor(Math.random() * 6) + 1;
            show_message(text.msg, text.status);
//            $('.name').each(function(){
//                $(this).val("");
//            })
//            $('.contact').each(function(){
//                $(this).val("");
//            })
            if (text.status == "success") {
                console.log(randomNumber);
               

                dedicatedAN = [];
                hashObj = [];
                
                $("#add-contact-dialog").dialog('destroy');
                window.location.href = "#!contact.php?id="+randomNumber;


            }
           
           
          //  removeThis('.close');

        }
    })
}

 function renderSelect()
	    {
		$('select').selectric({
			    onchange:function(){
			    }
		    })
	    }

function displayAccess(ths)
{
    console.log(ths);
     
     //flagid = $('#signupCountry :selected').attr('flagid');
    var accessNoType = $('#accessNoId :selected').attr('pType');;
    
    console.log($('#accessNoId :selected').val() +' ****  ');
    
    if(accessNoType == "hideAll")
    {
        $('.allAcc').hide();
    }
    else
    {
         $('.allAcc').show();
    }
}


function displayHashNumbers(ths)
{
  var accessNoType=   $(ths).val();
  
  if(accessNoType != "100")
    $('#hashSelect').show();
    else
    $('#hashSelect').hide();
}

function addcontactForCTC() {
    var allcontact = $('#contact_detail').serialize();
 //p91Loader('start');
    $.ajax({
        url: "action_layer.php?action=addContact",
        type: "POST", dataType: "json",
        data: allcontact,
        success: function(text) {
            var randomNumber = Math.floor(Math.random() * 6) + 1;
            show_message(text.msg, text.status);
            $('.name').each(function(){
                $(this).val("");
            })
            $('.contact').each(function(){
                $(this).val("");
            })

            if (text.status == "success") {
                console.log(randomNumber);
               


                
                $("#add-contact-dialog").dialog('destroy');
               // window.location.href = "#!contact.php?id="+randomNumber;


            }
           
            //removeThis('.close');

        }
    })
}


   /**
	    * @author Ankit Patidar <ankitpatidar@hostnsoft.com>
	    * @since 6/8/2014
	    * @param int counter
	    * @uses function to get access number by state name
	    * @returns {undefined}	     */
	    function getAccessNumberByState(counter)
	    {
		console.log('entered!');
		 var state = $('#accessState_'+counter).val();
	       
             $.ajax({
                    url:"controller/phonebookController.php?action=getAccessNumberBystate",
                    type:"POST",
                    dataType:"JSON",
                    data:{state:state},
                    success:function(msg)
                    {
                        if(msg.status == 'error')
                        {
                            show_message(msg.msg,msg.status);
			    	
                        }
                        else
                        {
                            var numberArr = msg.data;
			    console.log(numberArr);
                        assignAccessNoHashObj(numberArr);
                        if(counter == 'edit'){
                             popCurrentAccessNo();
                        }
                        var str = "<option value='0'>Select Access Number</option>";
			var accStr = '';
                        var findAccess='<p class="pd1 f15">Available access numbers</p>';
                        var findAccessNo = 0;
                        
                        if(counter == 'edit'){
                            if(editHash == 100){
                                str+='<option value="'+editAccessNo+'" selected = selected>'+editAccessNo+'</option>';
                                     }
                        }
                       
                        if(numberArr.hashValue != undefined){
                        $.each(numberArr.hashValue,function(key,value){
			    //hashObj.accessNumber = key;
//                            
//                           
//			    var norArr = [];
//			    for(var i = 11 ; i < 100 ; i++)
//			    {
//				
//				if($.inArray(i,value) != -1)
//				{
//				    norArr.push(i);
//				}
//			    }
                            
			    //check this number if already assigned then do not include this
			    if($.inArray(key,dedicatedAN) == -1){
                                if(counter == 'edit' || gAccessNumber != null){
                                    var selectAcc='';
                                        if(editAccessNo == key || gAccessNumber == key){
                                            selectAcc = 'selected = selected';

                                        }
                                        str+='<option value="'+key+'" '+selectAcc+'>'+key+'</option>';
                                }else
                                    str+='<option value="'+key+'">'+key+'</option>';
                                
                                if(counter == '')
                                 findAccess+='<div class="accRes clear">\
                                         <p class="fl f15">'+key+'</p>\
                                        <a class="assTo btn btn-medium btn-inverse fl mrR2" onclick="showAss(this)" href="javascript:void(0);">Assign To</a>\
                                        <span class="assClick dn">\
                                       <a class="btn btn-medium fl mrR1" onclick="addThisAccessNumber('+key+');" href="javascript:;">New Contact</a>\
                                       <a class="btn btn-medium fl" onclick="getexestingcontact(this,'+key+',1);" href="javascript:void(0);">Existing Contacts</a>\
                                       <!---Existing contacts dropdown-->\
                                        <div class="conList dn bgW bdr" id="conList'+key+'"> \
                                       <input class="mr1" type="text" id="searchContact'+key+'" onkeyup="getexestingcontact(this,'+key+',0);" placeholder="Search Contact">\
                                       <div id="existingContList'+key+'" class="contacts"></div>\
                                        </div>\
                                        </span>\
                                </div>';
                                findAccessNo = findAccessNo+1;
                            }
                           //accStr+=key+',';
                           

                        });
                        }
			
			  		
			$('#accessNumber_'+counter).html(str);
			
			
			if(counter == '')
			{
                            if(findAccessNo > 0){
                                $('#accessNumber').html(findAccess);
                            }else
                            {
                                findAccess = '<div class="clear pdB2 callErr">\
                                              <div style="opacity:.6" class="sketch fl"></div>\
                                              <div class="mr2 fl">\
                                              <h3 class="red font28 mrB">Whoops!</h3>\
                                              <span class="ddLit">There are no access numbers available in your Country. <br>We will make them available soon!</span>\
                                              </div>\
                                              </div>';
                                $('#accessNumber').html(findAccess);
                            }    
			}
			
                        if(counter == 'edit' || gAccessNumber != null){
                            gAccessNumber = null;
                            renderExtension(counter);
                        }
                        
			showExtension(counter);
			
			
			
                        
                        
			
			    
			    
			    //hide drop downs
		   
//                        getAndSetAccessNumber(counter);
//                        if(stateList.length == 1)
//                           $('#accessState_'+counter).prop("disabled", true); 
//                       else
//                           $('#accessState_'+counter).prop("disabled", false); 
                        }
			
			renderSelect();
			hideShowSelect(counter);
		
                
                $('#hideAccNo'+counter).remove();
                $('#hideExtNo'+counter).remove();
                    }
                }) 
		
	    }


/**
 * 
 * @param {type} ths
 * @param {type} key
 * @param {int} type 1 for exiting contact 0 for search box 
 * @returns {Boolean}
 */
   function getexestingcontact(ths,key,type,state){
      
     if(type == 1 && !$('#conList'+key).hasClass('dn'))
     {
	 $('#conList'+key).addClass('dn');
	 return false;
     }
     
     if(state != undefined && state != null)
     {
	 gstate = state;
     }
      
     var searchStr = $('#searchContact'+key).val(); 
     $.ajax({
        url: "action_layer.php?action=getPhonbookContact",
        type: "POST", dataType: "json",
        data: {type: 2,searchStr: searchStr},
        success: function(text) {
          gexistingAcceNo = key;
          var str = exestingContactDesgn(text,key);
         // alert(str);
          $('#existingContList'+key).html(''); // parent().find('.conList')
          $('#existingContList'+key).html(str);
          if(searchStr == ''){
          //uiDrop(ths,'#conList'+key,true);
          //$('#conList'+key).removeClass('dn');
        }
	
	if(type == 1)
	 $('#conList'+key).removeClass('dn');
        }

    }) 
    
      
   }
   
   function exestingContactDesgn(text,key){
        var str = ''; 
	
     $.each(text.allcontact,function(key,value){
	 
	 if(value.contact_id.$id != undefined && value.contact_id.$id != null)
	 
	 
         str += ' <div class="bdrT clear">\
                        <h3 class="f15 ellp">'+value.name+'</h3>\
                        <div class="fpinfo f12"> <i class="ic-16 call"></i>\
                        <label>'+value.contactNo+'</label>\
                        </div>\
                        <div class="fpinfo f12" onclick="showContactEdit(this,1);" contactId="'+value.contact_id.$id+'">\
                        <label class="green tdu cp"><i class="ic-16 callA"></i>Assign</label>\
                        </div>\
                    </div>';
     })
     
     return str;
   }
   
   
   function addThisAccessNumber(accNumber,state)
   {
       var country = $('#accessCountry_').val();
       if(state == undefined || state == null)
	    state = $('#accessState_').val();
       var originaldata =''; 
            $("#add-contact-dialog").dialog({modal: true, resizable: false, width: 800, height: 600, 'title':'Add New Contact',
                open : function(event,ui){
                    originaldata = $("#add-contact-dialog").html();
                },close : function(event, ui) {
                     dedicatedAN = [];
                     hashObj = [];
                     $("#add-contact-dialog").html(originaldata);
                }});
			
			var str = addContactDD(1);
			//$('.accParent').html('');
			$('#accParent_1').append(str);
                        
                        gcountry = country;
                        gstate = state;
                        gAccessNumber = accNumber;
			getCountries('1');
                        
                        //$('#accessCountry_1').val(country);
                        
			$('select').selectric();
       
   }
   
           function assignAccessNoHashObj(numberArr){
            
             var numberExistsFlag = false; 
             
             if(numberArr.hashValue != undefined){
             $.each(numberArr.hashValue,function(key,value){
               // dedicated condition 
               if($.inArray(key,dedicatedAN) == -1){
                     if(value.length == 1 && value[0]== '100'){
                         dedicatedAN.push(key);
                     }
                 }
                 
                // hash condition 
                $.each(hashObj,function(hashkey,hashvalue){

                    if(hashvalue.accessNumber == key)
                    {
                        numberExistsFlag = true;
                        for(var i=0;i<value.length;i++){
                            if($.inArray(parseInt(value[i]),hashvalue.hashArr) == -1){
                               
                               hashObj[hashkey].hashArr.push(parseInt(value[i]));
                               
                            }
                        }
                    }
                })
            
                if(numberExistsFlag == false){
                   console.log(value);
                  var norArr = [];
                  for(var i=0;i<value.length;i++){
                      if(value[i] != 100){
                       norArr[i]= parseInt(value[i]);
                      }
                    }
                    hashObj.push({accessNumber:key,hashArr:norArr});
                    
                }
                  
                
                 })
             }
                
                 console.log(hashObj);
                 console.log(dedicatedAN);
            }


  	    /**
	     *@author Ankit patidar <ankitpatidar@hostnsoft.com> 
	     *@since 6/8/2014
	     *@param int counter
	     *@uses function to show extentions on select of extension type
	     *@returns {undefined}	     */
	    function showExtension(counter)
	    {
		//get access number
		var accessNumber= $('#accessNumber_'+counter).val();
		var str = '';
		var numberExistsFlag = false;
		if($('#displayHashDiv_'+counter).val() == 1)    
		{
		    //str += '<option value="0">Select extension number</option>'
		    if(hashObj.length != 0)
		    {
			$.each(hashObj,function(key,value){

			    if(value.accessNumber == accessNumber)
			    {
				numberExistsFlag = true;
				
				for(var j = 11 ; j < 100 ; j++)
				{
//				    console.log($.inArray(j,value.hashArr));
//				    console.log(j);
//				    console.log(value.hashArr);
				    
				    if($.inArray(j,value.hashArr) == -1)
				    {
					 str+='<option value="'+j+'">'+j+'</option>';
				    }
				}
			    }

			});
			
			//if number not found in array
			if(numberExistsFlag == false)
			{
			    for(var j = 11 ; j < 100 ; j++)
			{
				 str+='<option value="'+j+'">'+j+'</option>';
			}
			}
		    }
		    else //if array empty
		    {
			for(var j = 11 ; j < 100 ; j++)
			{
				 str+='<option value="'+j+'">'+j+'</option>';
			}
		    }
		   
		}
		else //if dedicated selected
		{
		    
		    $.each(hashObj,function(key,value){

			    if(value.accessNumber == accessNumber)
			    {
				numberExistsFlag = true;
				
				if(value.hashArr.length)
				{
				   // show_message('This Access number is already assigned to another contact with extension number!','error');
				    //$('#displayHashDiv_'+counter).val('1');
				    renderSelect();
				    return false;
				}
				
				    
				    
				
			    }

			});
			
		    str+='<option value="100">100</option>'
		   
		}
		
		
		$('#hashExt_'+counter).html(str);
		if(counter == 'edit'){
                $('#hashExt_'+counter).val(editHash);    
                }
		renderSelect();
		if($('#displayHashDiv_'+counter).val() == 1)    
		{
                    $('.selectric-hashExt_dn_'+counter).removeClass('dn');
                }else
                {
                    $('.selectric-hashExt_dn_'+counter).addClass('dn');
                }
		  
	    }


    function renderExtension(counter)
	    {
		//get access number
		var accessNumber= $('#accessNumber_'+counter).val();
		var numberExistsFlag = false;
                 $.each(hashObj,function(key,value){
                     console.log(value);
                    if(value.accessNumber == accessNumber)
                    {
                        console.log(accessNumber)
                         if( hashObj[key].hashArr.length == 0){
                            hashObj.splice(key, 1);
                    }
                    }
                })
                
                
		$.each(hashObj,function(key,value){


			    if(value.accessNumber == accessNumber)
			    {
				numberExistsFlag = true;
				
				if(value.hashArr.length)
				{
				   // show_message('This Access number is already assigned to another contact with extension number!','error');
				    //$('#displayHashDiv_'+counter).val('1');
				    $("#displayHashDiv_"+counter+" option[value='0']").remove();
				    showExtension(counter);

				    renderSelect();
				    return false;
				}
				
				    
				    
				
			    }

			});
                       if(numberExistsFlag == false){
                           if($.inArray(accessNumber, dedicatedAN) == -1)
                               {
                                   if($("#displayHashDiv_"+counter+" option[value='0']").html() == undefined)
                                       {
                                           var str = '<option value="0">Dedicated</option>';
                                           $("#displayHashDiv_"+counter).append(str);
                                           renderSelect();
                                       }
                                   
                               }
                       }
                       
                       if(counter == 'edit'){
                           if(editHash == 100){
                               $("#displayHashDiv_"+counter).val(0);
                           }else
                               $("#displayHashDiv_"+counter).val(1);
                           renderSelect();
                       }
                        
	    }
	     /**
	    *@author Ankit Patidar <ankitpatidar@hostnsoft.com> 
	    *@since 6/8/2014
	    *@uses function to set js object 
	    * @param int counter
	    * @abstract called from contact js onclick event
	    * @returns {undefined}	     */
	    function setAccessNumberJSObject(counter)
	    {
		//get access number
		var accNo = $('#accessNumber_'+counter).val();
		var extensionType = $('#displayHashDiv_'+counter).val();//0 for dedicated and 1 for extension number
		var extensionNumber = $('#hashExt_'+counter).val();
		
		if(accNo == 0 || accNo == null)
		    return false;
		
		
		var oldExtNo = $('#oldExtensionNo_'+counter).val();
		extensionNumber = parseInt(extensionNumber);
		var numberExistsFlag = false;
		//if dedicated selected
		if(extensionType == 0)
		{
		    if($.inArray(accNo,dedicatedAN) == -1)
		    {
			dedicatedAN.push(accNo);
		    }
		    
		}
		else //if extension number selected
		{
		    if(extensionNumber == 0)
		    {
			show_message('Select extension number first!','error');
			return false;
		    }
		    
		    //if hashObj arr have elements then
		    if(hashObj.length != 0)
		    {
			//code to remove old hash
			
			$.each(hashObj,function(key,value){

			    if(value.accessNumber == accNo)
			    {
				numberExistsFlag = true;
				
				
				if($.inArray(oldExtNo,value.hashArr))
				{
				   
				    var i = value.hashArr.indexOf(parseInt(oldExtNo));
				    
				    if(i != -1)
				    {
					hashObj[key].hashArr.splice(i, 1);
				    }
				}
				
				if($.inArray(extensionNumber,value.hashArr) == -1)
				{
				    hashObj[key].hashArr.push(extensionNumber);
				}
			    }
			});
			
			if(numberExistsFlag == false)
			{
			    
			    hashObj.push({accessNumber:accNo,
				     hashArr:[extensionNumber]});
			}
		    }
		    else //if empty
		    {
			hashObj.push({accessNumber:accNo,
				     hashArr:[extensionNumber]});
		    }
		}
		
		console.log(dedicatedAN);
		console.log(hashObj);
		$('#currentAccessNumber_'+counter).text(accNo);
		
		$('#currentAccessNumber_'+counter).removeClass('active');
		//renderAccessNumberHtml(counter);
		
	    }

 
	function getAllAccessNumberOfPrefix()
	{
	    var prefix = $('#accessCountry_').val();
	     $.ajax({
                    url:"controller/phonebookController.php?action=getStatesByPrefix",
                    type:"POST",
                    dataType:"JSON",
                    data:{prefix:prefix},
                    success:function(msg)
                    {
                        if(msg.status == 'error')
                        {
                            show_message(msg.msg,msg.status);
                        }
                        else
                        {
                            var i = 0;
                            var stateList = msg.stateDetail;
			    findAccess = '';
			    console.log(stateList);
//			    var str = "<option value='0'>Select State</option>";
			    $.each(stateList,function(key,value){
			       
			       $.each(value.hashValue,function(accNo,accessArray){
				   i=i+1;
				   if(parseInt(accessArray[0]) != 100 )
				   findAccess+='<div class="accRes clear">\
                                         <p class="fl f15">'+accNo+'</p>\
                                        <a class="assTo btn btn-medium btn-inverse fl mrR2" onclick="showAss(this)" href="javascript:void(0);">Assign To</a>\
                                        <span class="assClick dn">\
                                       <a class="btn btn-medium fl mrR1" onclick="addThisAccessNumber('+accNo+',\''+value.state+'\');" href="javascript:;">New Contact</a>\
                                       <a class="btn btn-medium fl" onclick="getexestingcontact(this,'+accNo+',1,\''+value.state+'\');" href="javascript:void(0);">Existing Contacts</a>\
                                       <!---Existing contacts dropdown-->\
                                        <div class="conList dn bgW bdr" id="conList'+accNo+'"> \
                                       <input class="mr1" type="text" id="searchContact'+accNo+'" onkeyup="getexestingcontact(this,'+accNo+',0,\''+value.state+'\');" placeholder="Search Contact">\
                                       <div id="existingContList'+accNo+'" class="contacts"></div>\
                                        </div>\
                                        </span>\
                                </div>';
				   
			       })
			       
			       
			       
			       
			    });
                            
                            if(i > 0){    
			    $('#accessNumber').html(findAccess);
                             }else
                             {
                                 findAccess+='<div class="clear pdB2 callErr">\
                                              <div style="opacity:.6" class="sketch fl"></div>\
                                              <div class="mr2 fl">\
                                              <h3 class="red font28 mrB">Whoops!</h3>\
                                              <span class="ddLit">There are no access numbers available in your Country. <br>We will make them available soon!</span>\
                                              </div>\
                                              </div>';
                                 $('#accessNumber').html(findAccess);
                             }
//			    $('#accessState_'+counter).html(str);
                   
                        }
                        
                      
			
			
			
			renderSelect();
			     
			
			   
			
			//hideShowSelect(counter);
                    }
		    
		    
                })  
	}
 
 
        function getStatesByPrefix(counter)
        {
               
	       
            var prefix = $('#accessCountry_'+counter).val();
	       
             $.ajax({
                    url:"controller/phonebookController.php?action=getStates",
                    type:"POST",
                    dataType:"JSON",
                    data:{prefix:prefix},
                    success:function(msg)
                    {
                        if(msg.status == 'error')
                        {
                            show_message(msg.msg,msg.status);
                        }
                        else
                        {
                            var stateList = msg.data;
                       
			    var str = "<option value='0'>Select State</option>";
			    $.each(stateList,function(key,value){
			       if(counter == 'edit' || gstate != null){
			       var selected = '';
			       if(editState == value || gstate == value){
				   selected = 'selected = selected';
				   editState = 0;
				   gstate = null;
			       }
				str+='<option value="'+value+'" '+selected+'>'+value+'</option>'
			       }else
			       str+='<option value="'+value+'" >'+value+'</option>'
			    });


			    $('#accessState_'+counter).html(str);
                   
                        }
                        
                        if(counter == 'edit' || gAccessNumber != null)
			{
                            getAccessNumberByState(counter);
                        }
			
			
			if(counter == '')
			    getAllAccessNumberOfPrefix();
			
			renderSelect();
			     
			
			   
			
			hideShowSelect(counter);
                        if($('#tabs').hasClass('dn')){
                            $('#tabs').show();
                        }
                    }
		    
		    
                })   

        }





function showContactEdit(ths,status) {
    var contactId = $(ths).attr('contactId');
    $('#conList'+gexistingAcceNo).addClass('dn');
    $.ajax({
        url: "action_layer.php?action=showEditContact",
        type: "POST",
        dataType: "json",
        data: {contactId: contactId}
    }).done(function(data) {
        if(status == 1){
        var msg = editContactDesign(data,1);
	
	
         //uiDrop(ths,'.conList',false);
         $('#searchContact'+gexistingAcceNo).val(''); 
        }else
        var msg = editContactDesign(data);
        $('#edit-contact-wrap-dialog').html(msg).fadeIn(2000);
        $("#edit-contact-wrap-dialog").dialog({modal: true, resizable: false, width: 720, height: 400,title:"Edit Contact",
	    open:function(event,ui){},
	    close: function( event, ui ){
		     dedicatedAN = [];
                     hashObj = [];
		     	    
	    
		}});

//    var str=addContactDD();
//	$('.accParent').html(str);
//	$('select').selectric();
//	$('.accessBox ').css({'top':'51px'});
//	
	renderSelect();
	
	
	
	
	 })
	
}


function editContactDesign(data,status){

var editCntFlage = 'IN';
if(data.code == null)
    data.code = '';
 $.each(data.country,function(key,value){
         var ccode = value.ISO.split('/');
            if(value.CountryCode.replace(/ /g, '') == data.code.replace(/ /g, '')){
                editCntFlage = ccode[0];
            }
   })

var str = '';
str += '<div id="dialog-confirm" title="Confirm" style="display:none;">Are You Sure You Want to Delete This Entry</div><div id="edit-contact-dialog" title="Edit Contact">\
<form id="contact_edit_form">\
<div id="add-cnt-inner">\
<div class="pd2 editContact">\
<div class="clear">\
<div class="child">\
<p class="mrB">Name</p>\
<div class="">\
<input type="hidden" name="contactId" value="'+data.contactId+'">\
<input type="text" name="name" value="'+ data.name+'"/>\
    </div>\
    </div>\
    <div class="child">\
    <p class="mrB">Contact</p>\
    <div class="">\
    <div class="countryWrap">\
    <div class="selwrpa">\
    <div class="currencySelectDropdownEditCont cntry" onclick="uiDrop(this,\'#flaglistEditCont\', true)">\
    <span class="pickDown setCountry"></span>\
    <span id="setFlagEditCont" flagId="'+editCntFlage+'" class="flag-24 '+editCntFlage+' setFlag"></span>\
    </div>\
    <ul id="flaglistEditCont" class="bgW" style="display: none;">';  
    
    $.each(data.country,function(key,value){
                             
            var ccode = value.ISO.split('/');
           
            str +='<li  countryCode="'+value.CountryCode+'" countryName="'+value.Country+'" countryFlags="'+ccode[0]+'" onClick="SetValueAddCnt(this)">\
                            <a class="clear" href="javascript:void(0)">\
            <span class="flag-24 '+ccode[0]+'"></span><span code="'+value.CountryCode+'" class="fltxt">'+value.Country+'</span>\
            </a>\
            </li>'; 
                             
     })
     
     if(data.email == null){
         data.email = '';
     }
     
   
     str +='</ul>\
     </div>\
     <div class="codeInput">\
     <input name="code" type="text" id="codeEditCont"  class="min code" value="'+data.code.replace(/ /g, '')+'" readonly/>\
     <input type="text" placeholder="Contact No" id="mobileNumber" name="contact" class="pr contact" value="'+data.contactNo+'">\
    </div>\
    </div>\
    </div>\
    </div>\
    <div class="child">\
    <p class="mrB">Email</p>\
    <div class="">\
    <input type="text" name="email" value="'+data.email+'"/>\
    </div>\
    </div>\
    </div>\
    <div class="mrT2 clear">\
    <h3 class="mrB1 ligt">Access Number:</h3>';
    
    str += '<div class="child">';
    str +='<select id="accessCountry_edit" onChange="getStatesByPrefix(\'edit\');" name="accessCountry" class="edit_country">\
           <option>Select Country</option>\
		</select></div>\
           <div class="child"><select id="accessState_edit" onChange="getAccessNumberByState(\'edit\')" name="accessState">\
           <option>Select State</option>\
           </select></div>\
           <div class="child"><select id="accessNumber_edit" class="accessNumber_dn_edit" onChange="renderExtension(\'edit\')" name="conAccessNumber">\
            <option>Access Number</option></select></div>\
		<div class="child"><select class="displayHashDiv_dn_edit" name="accessType" id="displayHashDiv_edit" onchange="showExtension(\'edit\')">\
		    <option value="0" >Dedicated</option>\
		    <option value="1">Extension no.</option>\
		</select></div>\
		<div class="child"><select id="hashExt_edit" name="extensionNumber" class="hashExt_dn_edit">\
                 <option>11</option>\
		    </select></div>\
		<input type="hidden" value="0" id="oldExtensionNo_edit">';
        
        
        
   
   str +='<div class="actionS">\
   <a class="btn btn-medium btn-blue" onclick="editcontact(this);" contactId="'+data.contactId+'"  href="javascript:void(0);" title="Edit">Update</a>\
   <a class="btn btn-medium btn-danger mrL" onclick="confirmDelete(this);" contactId="'+data.contactId+'"  href="javascript:void(0);" title="Delete">Delete Contact</a></div>\
    </div>\
    </div>\
    </form></div>';
    
  //status 1 for edit in existing contact (find nearest access number).
  if(status == 1){
   editState = $('#accessState_').val();
   editAccessNo = gexistingAcceNo;
   var accCountry = $('#accessCountry_').val();
   getCountries('edit',accCountry);
  }else{  
    
  editState = data.accState;
  if(data.accessNo != undefined){
    editAccessNo = data.accessNo;
  }
 
  if(data.assignHash != undefined){
  editHash = data.assignHash;
  }
  
  getCountries('edit',data.accessCountry);
  
  }
  
 // $('#accessCountry_edit').val(data.code);
  //removeObjOfEditContact();
  
 return str;
}

  function renderCurrentRow(counter)
	    {
		var accessNumber= $('#accessNumber_'+counter).val();
		var numberExistsFlag = false;
		var str ='';
		var currentHash;
		if(accessNumber != 0)
		{
		    
		     $.each(hashObj,function(key,value){

			    if(value.accessNumber == accessNumber)
			    {
				numberExistsFlag = true;
				
				if(value.hashArr.length)
				{
				   // show_message('This Access number is already assigned to another contact with extension number!','error');
				    $("#displayHashDiv_"+counter+" option[value='0']").remove();
				    currentHash = $('#hashExt_'+counter).val();
				    for(var j = 11 ; j < 100 ; j++)
				    {
    //				    console.log($.inArray(j,value.hashArr));
    //				    console.log(j);
    //				    console.log(value.hashArr);

					if($.inArray(j,value.hashArr) == -1)
					{
					     str+='<option value="'+j+'">'+j+'</option>';
					}
				
				    }
				    str+='<option value="'+currentHash+'">'+currentHash+'</option>';
				    
				    
				   
				}    
				
			    }

			});
			if(numberExistsFlag == false){
                            
                            if($.inArray(parseInt(accessNumber),dedicatedAN))
                            {
                               str+='<option value="100">100</option>';
                            }
                            $('#hashExt_'+counter).html(str);
                        }
                        else
                        {
                             console.log(currentHash);
                            $('#hashExt_'+counter).html(str);
                            $('#hashExt_'+counter).val(currentHash);
                            $('#oldExtensionNo_'+counter).val(currentHash);   
                        }
			
			
			renderSelect();
			

		   
		}
		hideShowSelect(counter);
		
	    }
	

function hideShowSelect(counter)
{
    if($('#accessState_'+counter).val() == 0)
		{
		    $('.selectric-accessNumber_dn_'+counter).addClass('dn');
		    $('.selectric-displayHashDiv_dn_'+counter).addClass('dn');
		    $('.selectric-hashExt_dn_'+counter).addClass('dn');
		}
		else
		{
		    $('.selectric-accessNumber_dn_'+counter).removeClass('dn');
		    $('.selectric-displayHashDiv_dn_'+counter).removeClass('dn');
		    $('.selectric-hashExt_dn_'+counter).removeClass('dn');
		}
    
    if($('#displayHashDiv_'+counter).val() == 1)    
                {
                    $('.selectric-hashExt_dn_'+counter).removeClass('dn');
                }else
                {
                    $('.selectric-hashExt_dn_'+counter).addClass('dn');
                }
}

	    




	    
function setDefaultFlageByIp(count){
    console.log(countryByIp);
    if(countryByIp.countryIso != undefined && countryByIp.countryIso != null  && countryByIp.countryIso != '' ){
	
    $('.defaultFlag_'+count).removeClass($('.defaultFlag_'+count).attr('flagId'));
    $('.defaultFlag_'+count).addClass(countryByIp.countryIso);
    $('.defaultFlag_'+count).attr('flagId' , countryByIp.countryIso);
    $('.defaultCode_'+count).val(countryByIp.countryCode.replace(/ /g, ''));
    }
}


function addMoreRow() 
{
     addMoreRowCounter++;
     addMoreRowCountArr.push(addMoreRowCounter);//push counter to js array
     
     
     var str = addContactDD(addMoreRowCounter);
     $.ajax({
        url: "action_layer.php?action=addMoreRowDetail",
        type: "POST",
        dataType: "json",
        success: function(text) {   
               
       
    
   var templateAddmore = '<div class="addCntrow clear bdrB addrows"><div class="child">\
                         <input placeholder="Name" type="text" class="name" name="name[]" />\
                         </div>\
                         <div class="child">\
                         <!--country flags with code-->\
                         <div class="countryWrap">\
                         <div class="selwrpa">\
                         <div class="currencySelectDropdownAddcnt cntry" onclick="showCountryForAdd(this);">\
                         <span class="pickDown setCountry"></span>\
                         <span id="setFlagWebCall" flagId="IN" class="flag-24 IN setFlag defaultFlag_'+addMoreRowCounter+'"></span>\
                         </div>\
                         <ul  class="bgW" style="display: none;">';
                        
                        
                         $.each(text,function(key,value){
                             
                             var ccode = value.ISO.split('/');
                             templateAddmore +='<li  countryCode="'+value.CountryCode+'" countryName="'+value.Country+'" countryFlags="'+ccode[0]+'" onClick="SetValueAddCnt(this)">\
                                                <a class="clear" href="javascript:void(0)">\
                                <span class="flag-24 '+ccode[0]+'"></span><span code="'+value.CountryCode+'" class="fltxt">'+value.Country+'</span>\
                                </a>\
                                </li>'; 
                             
                         })

                        

   templateAddmore +='</ul>\
                      </div>\
                      <div class="codeInput">\
                      <input name="code[]" type="text" id="code" class="min code defaultCode_'+addMoreRowCounter+'" value="91" readonly/>\
                      <input class="pr contact" name="contact[]" id="mobileNumber" type="text" placeholder="Contact No" />\
                      </div>\
                      </div>\
                      </div>\
                      <div class="child accCont">\
                      <a onclick="uiDrop(this,\'#accessBox_'+addMoreRowCounter+'\', \'true\');renderCurrentRow('+addMoreRowCounter+')" id="currentAccessNumber_'+addMoreRowCounter+'" class="accLink themeLink tdu" href="javascript:;">Assign access Number</a>\
                      <div id="accParent_'+addMoreRowCounter+'" class="accParent">'+str+'<!--dialog content will load here--></div>\
                      </div>\
                      <div class="child">\
                      <i class="ic-24 close cp" onclick="closeResetObj(this,'+addMoreRowCounter+')";></i>\
                      </div></div>';

        $('.addMoreRow').before(templateAddmore);
	
	setDefaultFlageByIp(addMoreRowCounter);
	
	
	//$('.accCont:last').find('.accParent').html(str);
	
    
        getCountries(rowsCount);
        rowsCount++;
        }
     })
     
    

}

//function accLink(){
//	$('.accParent').hide();
//	console.log(this);
//	$(this).next().show();
//	
//	}


function addContactDD(counter)
{


	var str = '';

	str+='<div id="accessBox_'+counter+'" class="accessBox dn">\
		<select id="accessCountry_'+counter+'" onChange="getStatesByPrefix('+counter+');" name="accessCountry[]">\
		</select>\
		<select id="accessState_'+counter+'" onChange="getAccessNumberByState('+counter+')" name="accessState[]"></select>\
		<select id="accessNumber_'+counter+'" class="accessNumber_dn_'+counter+'" onChange="renderExtension('+counter+')" name="conAccessNumber[]"></select>\
		<select class="displayHashDiv_dn_'+counter+'" name="accessType[]" id="displayHashDiv_'+counter+'" onchange="showExtension('+counter+')">\
		    <option value="0" >Dedicated</option>\
		    <option value="1">Extension no.</option>\
		</select>\
		<select id="hashExt_'+counter+'" name="extensionNumber[]" class="hashExt_dn_'+counter+'">\
		    </select>\
		<input type="hidden" value="0" id="oldExtensionNo_'+counter+'">\
                <input type="hidden" value="0" name="conAccessNumber[]" id="hideAccNo'+counter+'">\
                <input type="hidden" value="0" name="extensionNumber[]" id="hideExtNo'+counter+'">\
                <a href="javascript:void(0);" onclick="uiDrop(this,\'#accessBox_'+counter+'\', false);setAccessNumberJSObject('+counter+')" class="btn btn-medium btn-blue">Done</a>\
	</div>';

	return str;					 

	//$('.accCont').append(str);

}


function closeResetObj(ths,counter){
    var accessNo = $('#accessNumber_'+counter).val();
    var Extype = $('#displayHashDiv_'+counter).val();
    
   
    
    if(accessNo != 0 && accessNo != null){
       console.log(Extype);
       console.log($.inArray(accessNo.toString(),dedicatedAN));
        if(Extype == 0 && ($.inArray(accessNo.toString(),dedicatedAN) != -1)){
            var i = dedicatedAN.indexOf(accessNo.toString());
	  	    
            if(i != -1)
            {
               dedicatedAN.splice(i, 1);
            }
                
            
        }else if(Extype == 1)
         {
             var hashEx = $('#hashExt_'+counter).val();
             $.each(hashObj,function(key,value){

                if(value.accessNumber == accessNo)
                {
                    if($.inArray(hashEx,value.hashArr))
                    {

                        var i = value.hashArr.indexOf(parseInt(hashEx));

                        if(i != -1)
                        {
                            hashObj[key].hashArr.splice(i, 1);
                        }
                    }

                    if( hashObj[key].hashArr.length == 0){
                        hashObj.splice(key, 1);
                    }
                    

                }
            });
         }   
    }
    removeThis(ths);
}


function popCurrentAccessNo(){
    
    
     var accessNo = editAccessNo;
    
     console.log(editHash);
      var Extype = '';
     if(editHash == 100){
        Extype = 0;
     }else
     Extype = 1;
    
  
    
    if(accessNo != 0 && accessNo != null){
       console.log(Extype);
       console.log($.inArray(accessNo.toString(),dedicatedAN));
        if(Extype == 0 && ($.inArray(accessNo.toString(),dedicatedAN) != -1)){
            var i = dedicatedAN.indexOf(accessNo.toString());
	  	    
            if(i != -1)
            {
               dedicatedAN.splice(i, 1);
            }
                
            
        }else if(Extype == 1)
         {
             var hashEx = editHash;
             $.each(hashObj,function(key,value){

                if(value.accessNumber == accessNo)
                {
                    if($.inArray(hashEx,value.hashArr))
                    {

                        var i = value.hashArr.indexOf(parseInt(hashEx));

                        if(i != -1)
                        {
                            hashObj[key].hashArr.splice(i, 1);
                        }
                    }

                    if( hashObj[key].hashArr.length == 0){
                        hashObj.splice(key, 1);
                    }
                    

                }
            });
         }   
    }
}

   function getCountries(counter,code)
            {
                
                $.ajax({
                    url:"controller/phonebookController.php?action=getCountriesWithPrefix",
                    type:"POST",
                    dataType:"JSON",
                    success:function(msg)
                    {
                        var countryList = msg.countryList;
                        
                        var str = '';
                        var i=0;
                        
                        $.each(countryList,function(key,value){
                            var selected = '';
                            if(counter == 'edit' || gcountry != null){
                                if(code == key || gcountry == key){
                                    selected = 'selected=selected';
                                    gcountry = null;
                                }
                                str+='<option value='+key+' '+selected+'>'+value+'</option>'
                            }else
                            str+='<option value='+key+'>'+value+'</option>'
                            i++;
                        });

                        $('#accessCountry_'+counter).html(str);
			
                        getStatesByPrefix(counter);
                       
                        
                        if(i == 1)
                            $('#accessCountry_'+counter).prop("disabled", true);
                        else
                            $('#accessCountry_'+counter).prop("disabled", false);    
                        //$("#source").val(msg);
			
			 
			
			
                    }
                })
            }


function removeThis(ths) {
   var thisrow = $(ths).parent().parent().remove();
}

function editcontact(ths) 
{
    var allcontact = $('#contact_edit_form').serialize();
    
    $.ajax({
        url: "action_layer.php?action=updateContact",
        type: "POST", dataType: "json",
        data: allcontact,
        success: function(text) {
            show_message(text.msg, text.status);

            if (text.status == "success") {
                $("#edit-contact-wrap-dialog").dialog('destroy');
                $('.cntList').html('');
               
                
                $('.cntList').html(text.str);
                dedicatedAN = [];
                hashObj = [];

            }
        }
    })

}
function confirmDelete(ths)
{
     $( "#dialog-confirm" ).dialog({
        resizable: false,
        height:140,
        modal: true,
        buttons: {
            "Sure":  {
                text:"Sure",
                "class":"btn btn-blue btn-medium",
				title:"Sure",
                click:function(){
                    $( this ).dialog( "close");
                    deletecontact(ths);
                }
            },
            Cancel:  {
                text:"Cancel",
                "class":"btn btn-danger btn-medium",
				title:"Cancel",
                click:function(){
                $( this ).dialog( "close");
                }
            }
            
    }
        });
}

function deletecontact(ths) {
    var contactId = $(ths).attr('contactId');
//    if (confirm("Are You Sure To Delete This Contact.")) {
        $.ajax({
            url: "action_layer.php?action=deleteContact",
            type: "POST", dataType: "json",
            data: {contactId: contactId},
            success: function(text) {
                show_message(text.msg, text.status);
                if (text.status == "success") {
                    $("#edit-contact-wrap-dialog").dialog('close');
                    $('.cntList').html('');
                    $('.cntList').html(text.str);
                    dedicatedAN = [];
                    hashObj = [];

                }
            }
        })


//    }
}

/**
* @author Ankit Patidar 
* @since 5/9/2014

 * @param {type} ths element
 * @param {type} type 0 of source and 1 for destination
 * @returns {Boolean} */
function validateNumber(ths,type)
{
    console.log("called");
    var s = $('#codeSource').val()+$('#source').val();
     var d = $('#codeDest').val()+$('#dest').val();
    if(type == 0)
    {
	    
	    if (s.length < 8 || isNaN(s) || s.length > 18)
	    {
		if (isNaN(s))
		{
		    $("#source").addClass("error_red").attr('value', '');
		    $("#response").show().addClass("error_red").html('Source number is not valid. Please enter at least 8 digits');
		}
		else
		{
		    $("#source").addClass("error_red");
		    $("#response").show().addClass("error_red").html("Please enter a proper source number.");
		}
		$("#source").focus();
		return false; 
	    }
	    else
	    {
		$("#response").html('');
		$("#source").removeClass("error_red");
		$("#source").addClass("error_green");
	    }
	 
    }
    else if(type == 1)
    {
	
    
    
	if (d.length < 8 || isNaN(d) || d.length > 18)
	{
	    if (isNaN(d))
	    {
		$("#dest").addClass("error_red").attr('value', '');
		$("#response").show().addClass("error_red").html('Destination number is not valid. Please enter at least 8 digits.');
	    }
	    else
	    {
		$("#dest").addClass("error_red");
		$("#response").show().addClass("error_red").html("Please enter a  proper Destination number.");
	    }
	    $("#dest").focus();
	    return false;
	}
	else
	{
	    $("#response").html('');
	    $("#dest").removeClass("error_red");
	    $("#dest").addClass("error_green");
	}
    }
    
}


function clicktocall(type)
{
   
    $('#timeFrom').text('');
    $('#timeTo').text('');
     $('.twoCallFrom').text('Connecting');
    $('.twoCallTo').text('Connecting');
    //var domain=window.location;
    var interval;
    var result = null;
    if(type == 1){
    var s = $("#source").val();
    var d = $("#dest").val();
    }else
    {
    var s = $('#codeSource').val()+$("#source").val();
    var d = $('#codeDest').val()+$("#dest").val();
    }   
    
    if(s==d)
    {
        show_message("Error source  and destination number could not be same","error");
        return false;
    }
    if (d.length < 8 || isNaN(d) || d.length > 18)
    {
        if (isNaN(d))
        {
            $("#dest").addClass("error_red").attr('value', '');
            $("#response").show().addClass("error_red").html('Please Provide proper Destination number');
        }
        else
        {
            $("#dest").addClass("error_red");
            $("#response").show().addClass("error_red").html("please enter number (minimum length 11 , maximum length 18)");
        }
        $("#dest").focus();
        return false;
    }
    else
    {
        $("#response").html('');
        $("#dest").removeClass("error_red");
        $("#dest").addClass("error_green");
    }
    if (s.length < 11 || isNaN(s) || d.length > 18)
    {
        if (isNaN(s))
        {
            $("#source").addClass("error_red").attr('value', '');
            $("#response").show().addClass("error_red").html('Please Provide proper Source number');
        }
        else
        {
            $("#source").addClass("error_red");
            $("#response").show().addClass("error_red").html("Please enter number ( Minimum length 11, Maximum length 18)");
        }
        $("#source").focus();
        return false;
    }
    else
    {
        $("#source").addClass("error_green");
    }
    var url1 = "clicktocall.php";

    url1 = url1 + "?q=" + d + "&d=" + s;
     $("#response").show().html();
     
     
     if(type == 1){
     callStart(1);
     }else
     callStart();
     
     
    
    $.ajax({type: "GET", url: url1, dataType: "json", success: function(msg) {
            //$("#guid").attr('value',msg);
            
            if (msg.status == "success") {
              
                //show_message("Connect Successfully", msg.status);
                
                intervalObjFrom = setInterval("checkStatus('" + msg.msgid1 + "','" + msg.msgid2 + "')", 5000);
                //clearInterval ( wooYayIntervalId ); 

                $("#response").show().html();
            }
            else {
                show_message(msg.msg, msg.status);
                //js.notification(msg.status,msg.msg)
                $("#response").show().html(msg.msg);

            }

            $("#connectcall").css("visibility", "hidden")
        }});
    return false;

}




function checkStatus(id,id2)
{
    
    console.log(id);
    $('#response2').html(" Source number status :: ");
    
    var callType = 0;//for source
    var statusClass = '.twoCallFrom';
    var setTimeId = '#timeFrom';
    if(id == null)
    {
	setTimeId = '#timeTo';
	statusClass = '.twoCallTo';
        id=id2;
	callType = 1;//for destination
        $('#response2').html(" Destination number status :: ");
    }
    console.log(id);
    console.log(id2);
    var url1 = "checkRespnse.php";
    url1 = url1 + "?uniqueId=" + id;
    $.ajax({type: "GET", url: url1, dataType: "json", success: function(msg) {
            //$("#guid").attr('value',msg);

            if (msg.status == "success") 
	    {
		
		
		
		switch(msg.msg)
		{
		    case 'DIALING':

		       $(statusClass).text('Ringing');
			//clearInterval(wooYayIntervalId);
			if(callType == 1)
			{
			    $('.toDestination').show();
			}
			break;
		    case 'ANSWER':
			$(statusClass).text('Connected');
			
			if(callType == 0)
			{
			  if(intervalToStatus == 0){
			    intervalObjTo = setInterval("checkStatus(null,'" + id2 + "')", 5000);
			   
			    intervalToStatus = 1;
			  }
			}
                      else if(callType == 1)
                      {
                          $('#gameBox').show();
                      }
			$(setTimeId).text(msg.timeYet);  
			
        			
			break;
		    case 'ANSWERED':
			if(callType == 0)
			{
			    clearInterval(intervalObjFrom);
			}
			else if(callType ==1)
			{
			    
			    clearInterval(intervalObjTo);
			}   
			
              			
              			$(statusClass).text('Call Ended');
                     $('#gameBox').hide();
			break;
		    case 'EMPTY':
			if(callType == 0)
			{
			    clearInterval(intervalObjFrom);
			}
			else if(callType ==1)
			{
			    clearInterval(intervalObjTo);
			}   
              			$(statusClass).text('CALL FAILED');
			break;
		    case 'CONGESTION':
			    if(callType == 0)
			    {
				clearInterval(intervalObjFrom);
			    }
			    else if(callType ==1)
			    {
				clearInterval(intervalObjTo);
			    }   
                  $(statusClass).text('CONGESTION');
			break;
		    case 'CANCEL':
			   if(callType == 0)
			    {
				clearInterval(intervalObjFrom);
			    }
			    else if(callType ==1)
			    {

				clearInterval(intervalObjTo);
			    } 
			    
			    callEnd();
                     $(statusClass).text('CANCEL');
			break;
		     case 'NOANSWER':
			    if(callType == 0)
			    {
				clearInterval(intervalObjFrom);
			    }
			    else if(callType ==1)
			    {

				clearInterval(intervalObjTo);
			    }   
                     $(statusClass).text('NOANSWER'); 
			break;

		    default:
			if(intervalFromStatus == 1)
			{
			    clearInterval(intervalObjFrom);
			    intervalFromStatus = 0;
			}
			if(intervalToStatus == 1)
			{
			    clearInterval(intervalObjTo);
			    intervalToStatus = 0;
			}
			$(statusClass).text(msg.msg);
			break;
		} 
		   
            }
            else {
              		if(intervalObjFrom !=undefined || intervalObjFrom != null)
                  {
		clearInterval(intervalObjFrom);
                  }
      
                  if(intervalObjTo !=undefined || intervalObjTo != null)
                  {
		clearInterval(intervalObjTo);
                  }

                show_message(msg.msg, msg.status);
   
            }
        }
    })
}

//created by sudhir pandey (sudhir@hostnsoft.com)
//creation date 05-08-2013
function showcosts() {

    var s = $('#codeSource').val()+$("#source").val();
    var d = $('#codeDest').val()+$("#dest").val();
    var Regx = /^[0-9]{8,15}$/;
    if (!Regx.test(s)) {
        show_message("Source number are not valid !", "error");
        return;
    }
    if (!Regx.test(d)) {
        show_message("Destination number are not valid !", "error");
        return;
    }


    $.ajax({
        url: "action_layer.php?action=seeCallRate",
        type: "POST", dataType: "json",
        data: {source: s, destination: d},
        success: function(text) {
            if (text.status == "error") {
                show_message(text.msg, text.status);
            } else {
                $('#callrateDtl').html("");
                $('#callrateDtl').html("<span class='font25'>" + text.rate + "</span>" + " USD/min");
            }


        }

    })

}
 
 function getPhonbookContact(type){
      
     
     
   $.ajax({
        url: "action_layer.php?action=getPhonbookContact",
        type: "POST", dataType: "json",
        data: {type: type},
        success: function(text) {
          var str = contactListDesign(text);
           $('.cntList').html('');
           $('.cntList').html(str);
           $('#searchContact').quicksearch('.cntList li');
        }

    })     
            
 }
	 
function contactListDesign(text){
    var str = ''; 
  
     $.each(text.allcontact,function(key,value){
        
        if(value.code =='' || value.code == undefined){
            var code = '';
        }else
            var code = value.code;
               
          str +='<li class="clear" contactId="'+value.contact_id.$id+'" >\
          <div class="cntAct fixed">\
          <div class="edtsiWrap">\
	  <a class="clear alC" onclick="showContactEdit(this);" contactId="'+value.contact_id.$id+'" href="javascript:void(0);" >\
         <span class="ic-24 edit"></span> \
         </a>\
         </div>\
         </div>\
         <div class="cntInfo slideAndBack" onclick="dest('+value.contactNo+',this)">\
         <div class="innerCol clear">\
	  <h3 class="h3 ellp">'+value.name+'</h3>\
         <div class="fpinfo"> <i class="ic-16 call"></i>\
	<label>'+code+value.contactNo+'</label>\
         </div>\
         <div class="fpinfo">';
          if(value.accessNo != '' && value.accessNo != undefined){
              str +='<label><i class="ic-16 callA"></i> '+value.accessNo+'</label>';
          }else{
              str +='<label onclick="showContactEdit(this);" contactId="'+value.contact_id.$id+'" class="green tdu cp"><i class="ic-16 callA mrR"></i>Assign</label>';
          }
          str +='</div></div></div></li>'                
                         
                             
      })
      return str;
}

/*============calling js============*/
function callStart(ts){
			
			$('.callStart').hide();
			$('.tourBg, .callEnd').show();
			$('.callCont').addClass('addZ')
			$('h4.f14').addClass('witClr')/*add white clr to heading*/
			$('#wHd').html('In Call - '+$('#codeWebCall').val()+$('#dialPadInput').val());/*add respective number to heading*/
			if(ts == 1){
                            $('#sHd').html('From - '+$('#source').val());
                            $('#dHd').html('To - '+$('#dest').val());/*both lines for two way calling*/
                        }else
                        {
                          $('#sHd').html('From - '+$('#codeSource').val()+$('#source').val());
			  $('#dHd').html('To - '+$('#codeDest').val()+$('#dest').val());/*both lines for two way calling*/
                        }    
                        
			$('#dialPadInput').val('');
			$('#source, #dest').val('');
			$.APP.startTimer('sw');
			$('.toDestination').hide();
			}
function callEnd(ts){
			
			if(intervalObjTo != undefined && intervalObjTo != null)
			{
			   clearInterval(intervalObjTo); 
			}
			 
			if(intervalObjFrom != undefined && intervalObjFrom != null)
			{
			   clearInterval(intervalObjFrom); 
			}
			$('.tourBg, .callEnd, #gameBox').hide();
			$('.callStart').show();
			$('.callCont').removeClass('addZ')/*remove white clr from heading*/
			$('h4.f14').removeClass('witClr')
			$('#wHd').html("Enter your destination number");/*reset heading*/
			
			$('#sHd').html('Your Number');
			$('#dHd').html('Destination Number');/*both lines for two way calling*/
			$.APP.stopTimer();
			}




function callcostKeyup() {
    var s = $('#codeSource').val()+$("#source").val();
    var d = $('#codeDest').val()+$("#dest").val();
    console.log('keyup');
    console.log(s);
    console.log(d);
    var Regx = /^[0-9]{8,15}$/;
    if (!Regx.test(s)) {
        show_message("Please enter a valid source number,should be min 8 digit and max 18 digit and number only !", "error");
        return;
    }
if(d.length >=5){ 
    $.ajax({
        url: "action_layer.php?action=seeCallRate",
        type: "POST", dataType: "json",
        data: {source: s, destination: d},
        success: function(text) {
            console.log(text);
            if (text.status == "error") {
                show_message(text.msg, text.status);
            } else {
                $('#callrateDtl').html("");
                $('#callrateDtl').html("<span class='font25'>" + text.rate + "</span>  " + text.currencyName +"/min");
            }


        }

    })
}
}

var countryByIp;
function setCountryByIp()
{
     $.ajax({
	url: "action_layer.php?action=getLocationByIp",
	type: "POST", dataType: "json",
	success: function(text) {

	countryByIp =text;
	console.log(countryByIp);
	
	}

    });
}
    setCountryByIp();
    

    
    
    

