function printDiv(divID) {
            //Get the HTML of div
            var divElements = document.getElementById(divID).innerHTML;
            //Get the HTML of whole page
            var oldPage = document.body.innerHTML;

            //Reset the page's HTML with div's HTML only
            document.body.innerHTML = 
              "<html><head><title></title></head><body>" + 
              divElements + "</body>";

            //Print Page
            window.print();

            //Restore orignal HTML
            document.body.innerHTML = oldPage;

          
 }

function remove_tags(html)
  {
       var tmp = document.createElement("DIV");
       tmp.innerHTML = html; 
       return tmp.textContent||tmp.innerText; 
  }

function ClearBox(TextBox) {
		document.getElementById(TextBox).value = '';
}
function SetInnerWidthSuper(){
	document.getElementById("inner_mid").style.width="98%";
}

function SetInnerWidth(){
	document.getElementById("inner_mid").style.width="84%";
}
function SetFullPage(){
	document.getElementById("inner_mid").style.width="98%";
	$(".main-container .main .left-main-nav").hide();

}


function SelectCheckBoxes(MainID,ToSelect,Num)
{	
	var flag,i;
	if(document.getElementById(MainID).checked){
		flag = true;
	}else{
		flag = false;
	}
	
	for(i=1; i<=Num; i++){
		document.getElementById(ToSelect+i).checked=flag;
	}

}


function ValidateMultipleAction(moduleName,actionToPerform,TotalRecords,ToSelect,PageUrl){
		var checkedFlag = 0;
		var ids = '';
		
		if(TotalRecords > 0){
				for(var i=1;i<=TotalRecords;i++){
					if(document.getElementById(ToSelect+i).checked==true){
						if(checkedFlag == 0){
							checkedFlag = 1;
						}
						ids += document.getElementById(ToSelect+i).value+',';
					}
				}

				if(checkedFlag == 0){
					alert("You must select atleast one "+moduleName+" to "+actionToPerform+".");
				}else{

					if(confirm("Are you sure you want to "+actionToPerform+" selected "+moduleName+"(s)?")){
						PageUrl = PageUrl+'&multipleAction='+actionToPerform+'&multiple_action_id='+ids;
						//alert(PageUrl);
						location.href = PageUrl;
					}

				}

		}
		
			
}





function ValidateMultiple(moduleName,actionToPerform,NumFieldName,ToSelect){
		var checkedFlag = 0;
		var ids = '';
		TotalRecords = document.getElementById(NumFieldName).value;
		if(TotalRecords > 0){
				for(var i=1;i<=TotalRecords;i++){
					if(document.getElementById(ToSelect+i).checked==true){
						if(checkedFlag == 0){
							checkedFlag = 1;
						}
						ids += document.getElementById(ToSelect+i).value+',';
					}
				}

				if(checkedFlag == 0){
					alert("You must select atleast one "+moduleName+" to "+actionToPerform+".");
				}else{
					if(actionToPerform=="delete"){
							if(confirm("Are you sure you want to delete the selected "+moduleName+"?")){
								ShowHideLoader(1,'P');
								return true;
							}else{
								return false;
							}
					}else{
						ShowHideLoader(1,'P');
						return true;
					}

				}
		}
		return false;
			
}

/*********************************************/

function OpenNewPopUp(PageName, Width, Height, ResizableOption ){ 
	window.open(PageName,"win1","toolbar=no,directories=no,resizable="+ResizableOption+",menubar=no,location=no,scrollbars=yes,width="+Width+",height="+Height+",maximize=null,top=70,left=80");

}


function exportCSV(MainTable,AjaxPage){

	AjaxPage += "&field="+document.getElementById("sorting_name").value+"&order="+document.getElementById("sorting_order").value;

	var Url = AjaxPage+"&export=1&r="+Math.random();  

	if(document.getElementById("dateFeild") != null && document.getElementById("dateFrom") != null && document.getElementById("dateTo") != null){
		if(document.getElementById("dateFeild").value != '' && document.getElementById("dateFrom").value != '' && document.getElementById("dateTo").value != ''){
			Url = AjaxPage+"&export=1&dateFeild="+document.getElementById("dateFeild").value+"&dateFrom="+document.getElementById("dateFrom").value+"&dateTo="+document.getElementById("dateTo").value+"&r="+Math.random();  
		}
	}

	if(document.getElementById("search_key") != null){
		Url += "&search_key="+document.getElementById("search_key").value;
	}

	if(document.getElementById("fields") != null){
		Url += "&search_field="+document.getElementById("fields").value;
	}

	if(document.getElementById("group") != null){
		Url += "&groupID="+document.getElementById("group").value;
	}
	if(document.getElementById("shortcutID") != null){
		Url += "&shortcutID="+document.getElementById("shortcutID").value;
	}



	httpObj.open("GET", Url, true);
	httpObj.onreadystatechange = function RecieveExport(){
		if (httpObj.readyState == 4) {
			location.href="csvBackup.php?MainTable="+MainTable+"&sql="+escape(httpObj.responseText)+"&r="+Math.random();  
		}
	};
	httpObj.send(null);
}



/*********************************************/

function isValidLinkOpt(formInput,p_FieldName){

	if(Trim(formInput).value == "" ) {
		return 1;
	}else{
	   var reg = /^(http:\/\/|https:\/\/){1}[-a-zA-Z0-9@:%_\+.~#?&//=]*\.[-a-zA-Z0-9@:%_\+.~#?&//=]*$/;

	   var address = formInput.value;
	   if(reg.test(address) == false) {
			alert("Please Enter Valid "+p_FieldName+".");            
		  formInput.select();
		  return 0;
	   }
		return 1;

	}

}


function isValidLink(formInput,p_FieldName){

	if(Trim(formInput).value == "" ) {
		alert("Please Enter "+p_FieldName+".");            
		formInput.focus();
		return 0;
	}else{
	   var reg = /^(http:\/\/|https:\/\/){1}[-a-zA-Z0-9@:%_\+.~#?&//=]*\.[-a-zA-Z0-9@:%_\+.~#?&//=]*$/;

	   var address = formInput.value;
	   if(reg.test(address) == false) {
			alert("Please Enter Valid "+p_FieldName+". ");            
		  formInput.select();
		  return 0;
	   }
		return 1;

	}

}

function isValidLink2(formInput,p_FieldName){
	var aPosition, dotPosition, lastPosition;

	if(Trim(formInput).value == "" ) {
		alert("Please Enter "+p_FieldName);            
		formInput.focus();
		return 0;
	}else{
		with (formInput)
		{
			aPosition = value.indexOf("http://");
			
			//aPosition = value.indexOf("//");
			dotPosition = value.lastIndexOf(".");
			//alert(dotPosition);return(false);
			//lastPosition = value.length-1;

			if(CheckSpecialCharactersForLink(formInput)){
				return 0;
			}else if (aPosition == -1)
			{
				alert("Please Enter Valid Url. ");            
				formInput.select();
				return 0;
			}else if (dotPosition < 4)
			{
				alert("Please Enter Valid Url. ");            
				formInput.select();
				return 0;
			}
			return 1;
		}

	}

}


function isLink(formInput) {
	if(Trim(formInput).value == "" ) {
		return 1;
	}else{
	   //var reg = /^(http:\/\/|https:\/\/){1}[0-9A-Za-z\.\-]*\.[0-9A-Za-z\.\-]*$/;
	   var reg = /^(http:\/\/|https:\/\/){1}[0-9A-Za-z\.\-]*\.[0-9A-Za-z\.\-]*$/;

	   var address = formInput.value;
	   if(reg.test(address) == false) {
		  alert("Please Enter Valid Url.");            
		  formInput.select();
		  return 0;
	   }
		return 1;

	}

}

function isLink2(formInput){
	var aPosition, dotPosition, lastPosition;


	if(Trim(formInput).value == "" ) {
		return 1;
	}else{
		with (formInput)
		{
			aPosition = value.indexOf("http://");
			
			//aPosition = value.indexOf("//");
			dotPosition = value.lastIndexOf(".");
			//alert(dotPosition);return(false);
			//lastPosition = value.length-1;

			if(CheckSpecialCharactersForLink(formInput)){
				return 0;
			}else if (aPosition == -1)
			{
				alert("Please Enter Valid Url.");            
				formInput.select();
				return 0;
			}else if (dotPosition < 4)
			{
				alert("Please Enter Valid Url.");            
				formInput.select();
				return 0;
			}
			return 1;
		}

	}

}

/*********************************************/

function isEmail(formInput){
	var aPosition, dotPosition, lastPosition;
	with (formInput)
	{
		aPosition = value.indexOf("@");
		dotPosition = value.lastIndexOf(".");
		lastPosition = value.length-1;
		if(ValidateRegEmail(formInput)){
			return 0;
		}else
		if(CheckSpecialCharactersForEmail(formInput)){
			return 0;
		}else
		if (aPosition < 1 || dotPosition - aPosition < 2 || lastPosition - dotPosition > 6 || lastPosition - dotPosition < 2)
		{
			alert("Please Enter Valid Email Address.");            
			formInput.select();
			return 0;
		}
		return 1;
	}
}


function isEmail2(formInput){
	var aPosition, dotPosition, lastPosition;
	with (formInput)
	{
		aPosition = value.indexOf("@");
		dotPosition = value.lastIndexOf(".");
		lastPosition = value.length-1;
		if(CheckSpecialCharactersForEmail(formInput)){
			return 0;
		}else
		if (aPosition < 1 || dotPosition - aPosition < 2 || lastPosition - dotPosition > 6 || lastPosition - dotPosition < 2)
		{
			alert("Please Enter Valid Email Address.");            
			formInput.select();
			return 0;
		}
		return 1;
	}
}

function isEmailOpt(formInput){

	if(Trim(formInput).value != ''){

		var aPosition, dotPosition, lastPosition;
		with (formInput)
		{
			aPosition = value.indexOf("@");
			dotPosition = value.lastIndexOf(".");
			lastPosition = value.length-1;
			
			if(ValidateRegEmail(formInput)){
				return 0;
			}else
			if(CheckSpecialCharactersForEmail(formInput)){
				return 0;
			}else
			if (aPosition < 1 || dotPosition - aPosition < 2 || lastPosition - dotPosition > 6 || lastPosition - dotPosition < 2)
			{
				alert("Please Enter Valid Email Address.");            
				formInput.select();
				return 0;
			}
			return 1;
		}

	}else{
			return 1;
	}

}

function ValidateRegEmail(formInput) {
   var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
   var address = formInput.value;
   if(reg.test(address) == false) {
	  alert("Please Enter Valid Email Address.");  
	  formInput.select();
      return 1;
   }
	return 0;
}
	
/*********************************************/

function isZipCode(formInput) {
   var reg = /^[A-Za-z0-9_\-\.]+$/;

   var address = formInput.value;

	if(Trim(formInput).value == "" ) {
	  alert("Please Enter Zip Code.");  
	  formInput.focus();
      return 0;
	}else{

	   if(reg.test(address) == false) {
		  alert("Please Enter Valid Zip Code.");  
		  formInput.select();
		  return 0;
	   }

	}


	return 1;
}

function isPassword(formInput) {
   var reg = /^[A-Za-z0-9_\-\.]+$/;

   var address = formInput.value;
   if(reg.test(address) == false) {
	  alert("Please Enter only alphanumeric characters for Password.");  
	  formInput.select();
      return 0;
   }
	return 1;
}

function isUserName(formInput) {
   var reg = /^[A-Za-z0-9_\-\.]+$/;

   var address = formInput.value;
   if(reg.test(address) == false) {
	  alert("Please Enter only alphanumeric characters for  User Name.");  
	  formInput.select();
      return 0;
   }
	return 1;
}

function isDisplayName(formInput) {
   var reg = /^[A-Za-z0-9_\-\.]+$/;

   var address = formInput.value;
   if(reg.test(address) == false) {
	  alert("Please Enter only alphanumeric characters for  Display Name.");  
	  formInput.select();
      return 0;
   }
	return 1;
}

function isSkypeAddress(formInput) {
	var p_Min=4;
	var p_Max=40;

	if(Trim(formInput).value == "" ) {
		return 1;
	}else{
	   var reg = /^[A-Za-z0-9_\-\.]+$/;

	   var address = formInput.value;
	   if(reg.test(address) == false) {
		  alert('Please Enter only Alphanumeric characters for Skype Address!');  
		  formInput.select();
		  return 0;
	   }else if(formInput.value.length < p_Min || formInput.value.length > p_Max){
			alert("Skype Address should be from "+p_Min+" to "+p_Max+" characters long.");
			formInput.focus();
			return 0;
		}

		return 1;

	}

}


function isValidCC(formInput){
	var aPosition, dotPosition, lastPosition;
	if(formInput.value != ''){
		with (formInput)
		{
			aPosition = value.indexOf("@");
			dotPosition = value.lastIndexOf(".");
			lastPosition = value.length-1;
			if(CheckSpecialCharactersForCC(formInput)){
				return 0;
			}else
			if (aPosition < 1 || dotPosition - aPosition < 2 || lastPosition - dotPosition > 6 || lastPosition - dotPosition < 2)
			{
				alert("Please Enter Valid Email Address.");            
				formInput.select();
				return 0;
			}
			return 1;
		}
	}else {
		return 1;
	}
}

/*********************************************/

function CheckImageSize(divHidden,WidthMin,HeightMin,WidthMax,HeightMax){
	var imgHidden = 'ImageHidden';
	document.getElementById(divHidden).innerHTML = '<img src="'+document.getElementById("Image").value+'" id="'+imgHidden+'">';	 
	
	   if(document.getElementById(imgHidden).width > WidthMax){    
			alert("Please check image size....\n\nImage width should be smaller than "+WidthMax+" pixels."); 
			return 0;
	   } else if(document.getElementById(imgHidden).height > HeightMax){
			alert("Please check image size....\n\nImage height should be smaller than "+HeightMax+" pixels."); 
			return 0;
	   }  if(document.getElementById(imgHidden).width < WidthMin){    
			alert("Please check image size....\n\nImage width should be bigger than "+WidthMin+" pixels."); 
			return 0;
	   } else if(document.getElementById(imgHidden).height < HeightMin){
			alert("Please check image size....\n\nImage height should be bigger than "+HeightMin+" pixels."); 
			return 0;
	   }  else{
			//alert("Image size is ok, you can upload it now.");
			return 1;
	  	}	
		
}



/*********************************************/
 function CloseWindow(ReloadOption){
	 if(ReloadOption > 0){
		opener.window.location.reload(); 
	 }
	window.close()
}


/*********************************************/

function ValidateOptionalUploadVideo(p_Field,p_FieldName){
	if(p_Field.value !=''){
		var FileExtension = p_Field.value.substr(p_Field.value.length-3,p_Field.value.length);
		switch(FileExtension.toLowerCase()){
			case 'swf':
				return 1;
			case 'flv':
				return 1;
			default:
				alert('Only following filetypes are supported for video :\n1) swf\n2) flv.');
				p_Field.select();
				return 0;
		}
	}else{
		return 1;
	}
}

/*********************************************/

function ValidateMandDoc(p_Field,p_FieldName){
	if(p_Field.value !=''){
		var FileExtension = p_Field.value.substr(p_Field.value.length-3,p_Field.value.length);
		switch(FileExtension.toLowerCase()){
			case 'pdf':
				return 1;
			case 'doc':
				return 1;
			case 'ppt':
				return 1;
			case 'rtf':
				return 1;
			case 'txt':
				return 1;
			case 'xls':
				return 1;
		}

		var FileExtension2 = p_Field.value.substr(p_Field.value.length-4,p_Field.value.length);
		switch(FileExtension2.toLowerCase()){
			case 'docx':
				return 1;
			case 'pptx':
				return 1;
			case 'xlsx':
				return 1;
		}

		
		alert('Only following filetypes are supported:\n1) pdf\n2) doc\n3) docx\n4) ppt\n5) pptx\n6) xls\n7) xlsx\n8) rtf\n9) txt');
		p_Field.select();
		return 0;
	}else{
		alert("Please Upload "+p_FieldName+".");
		p_Field.select();
		return 0;
	}
}

function ValidateOptionalDoc(p_Field){

	if(p_Field.value !=''){
		var ErrorBlog = 0;
		var FileExtension = p_Field.value.substr(p_Field.value.length-3,p_Field.value.length);
		switch(FileExtension.toLowerCase()){
			case 'pdf':
				return 1;
			case 'doc':
				return 1;
			case 'ppt':
				return 1;
			case 'rtf':
				return 1;
			case 'txt':
				return 1;
			case 'xls':
				return 1;
		}


		var FileExtension2 = p_Field.value.substr(p_Field.value.length-4,p_Field.value.length);
		switch(FileExtension2.toLowerCase()){
			case 'docx':
				return 1;
			case 'pptx':
				return 1;
			case 'xlsx':
				return 1;
		}

		
		alert('Only following filetypes are supported:\n1) pdf\n2) doc\n3) docx\n4) ppt\n5) pptx\n6) xls\n7) xlsx\n8) rtf\n9) txt');
		p_Field.select();
		return 0;


	}else{
		return 1;

	}


}

/*********************************************/
function ValidateMandResume(p_Field,p_FieldName){
	if(p_Field.value !=''){
		var FileExtension = p_Field.value.substr(p_Field.value.length-3,p_Field.value.length);
		switch(FileExtension.toLowerCase()){
			case 'pdf':
				return 1;
			case 'doc':
				return 1;
			case 'rtf':
				return 1;
			case 'txt':
				return 1;
		}

		var FileExtension2 = p_Field.value.substr(p_Field.value.length-4,p_Field.value.length);
		switch(FileExtension2.toLowerCase()){
			case 'docx':
				return 1;
		}

		
		alert('Only following filetypes are supported:\n1) pdf\n2) doc\n3) docx\n4) rtf\n5) txt');
		p_Field.select();
		return 0;
	}else{
		alert("Please Upload "+p_FieldName+".");
		p_Field.select();
		return 0;
	}
}

function ValidateOptionalResume(p_Field){

	if(p_Field.value !=''){
		var ErrorBlog = 0;
		var FileExtension = p_Field.value.substr(p_Field.value.length-3,p_Field.value.length);
		switch(FileExtension.toLowerCase()){
			case 'pdf':
				return 1;
			case 'doc':
				return 1;
			case 'rtf':
				return 1;
			case 'txt':
				return 1;
		}


		var FileExtension2 = p_Field.value.substr(p_Field.value.length-4,p_Field.value.length);
		switch(FileExtension2.toLowerCase()){
			case 'docx':
				return 1;
		}

		
		alert('Only following filetypes are supported:\n1) pdf\n2) doc\n3) docx\n4) rtf\n5) txt');
		p_Field.select();
		return 0;


	}else{
		return 1;

	}


}
/*********************************************/

function ValidateMandExcel(p_Field,p_Message){
	if(p_Field.value !=''){
		var FileExtension = p_Field.value.substr(p_Field.value.length-3,p_Field.value.length);
		switch(FileExtension.toLowerCase()){
			case 'xls':
				return 1;
			default:
				alert('Please upload excel file only.');
				p_Field.select();
				return 0;
		}
	}else{
		alert(p_Message);
		p_Field.select();
		return 0;
	}
}

/*********************************************/

function ValidateOptionalUploadPdf(p_Field){
	if(p_Field.value !=''){
		var FileExtension = p_Field.value.substr(p_Field.value.length-3,p_Field.value.length);
		switch(FileExtension.toLowerCase()){
			case 'pdf':
				return 1;
			default:
				alert('Please upload pdf file only.');
				p_Field.select();
				return 0;
		}
	}else{
		return 1;
	}
}

/*********************************************/

 function ValidateMandUpload(p_Field,p_FieldName){
	if(p_Field.value !=''){
		var FileExtension = p_Field.value.substr(p_Field.value.length-3,p_Field.value.length);
		switch(FileExtension.toLowerCase()){
			case 'jpg':
				return 1;
			case 'gif':
				return 1;
			case 'png':
				return 1;
			default:
				alert('Only following filetypes are supported:\n1) jpg\n2) gif\n3) png');
				p_Field.value='';
				return 0;
		}
	}else{
		alert("Please Upload "+p_FieldName+".");
		p_Field.select();
		return 0;
	}
}



function ValidateOptionalScan(p_Field,p_FieldName){
	if(p_Field.value !=''){
		var FileExtension = p_Field.value.substr(p_Field.value.length-3,p_Field.value.length);
		switch(FileExtension.toLowerCase()){
			case 'pdf':
				return 1;
			case 'jpg':
				return 1;
			case 'gif':
				return 1;
			case 'png':
				return 1;
			default:
				alert('Only following filetypes are supported for '+p_FieldName+':\n1) pdf\n2) jpg\n3) gif\n4) png');
				p_Field.select();
				return 0;
		}
	}else{
		return 1;
	}
}


function ValidateMandScan(p_Field,p_FieldName){
	if(p_Field.value !=''){
		var FileExtension = p_Field.value.substr(p_Field.value.length-3,p_Field.value.length);
		switch(FileExtension.toLowerCase()){
			case 'pdf':
				return 1;
			case 'jpg':
				return 1;
			case 'gif':
				return 1;
			case 'png':
				return 1;
			default:
				alert('Only following filetypes are supported for '+p_FieldName+':\n1) pdf\n2) jpg\n3) gif\n4) png');
				p_Field.value='';
				return 0;
		}
	}else{
		alert("Please Upload "+p_FieldName+".");
		p_Field.select();
		return 0;
	}
}


function ValidateOptionalUpload(p_Field,p_FieldName){
	if(p_Field.value !=''){
		var FileExtension = p_Field.value.substr(p_Field.value.length-3,p_Field.value.length);
		switch(FileExtension.toLowerCase()){
			case 'jpg':
				return 1;
			case 'gif':
				return 1;
			case 'png':
				return 1;
			default:
				alert('Only following filetypes are supported:\n1) jpg\n2) gif\n3) png');
				p_Field.select();
				return 0;
		}
	}else{
		return 1;
	}
}

 function ValidateMandImage(p_Field,p_FieldName){
	if(p_Field.value !=''){
		var FileExtension = p_Field.value.substr(p_Field.value.length-3,p_Field.value.length);
		switch(FileExtension.toLowerCase()){
			case 'jpg':
				return 1;
			case 'gif':
				return 1;
			case 'png':
				return 1;
			default:
				alert('Only following filetypes are supported:\n1) jpg\n2) gif\n3) png');
				p_Field.value='';
				return 0;
		}
	}else{
		alert("Please Upload "+p_FieldName+".");
		p_Field.select();
		return 0;
	}
}


 function ValidateMandBanner(p_Field,p_FieldName){
	if(p_Field.value !=''){
		var FileExtension = p_Field.value.substr(p_Field.value.length-3,p_Field.value.length);
		switch(FileExtension.toLowerCase()){
			case 'jpg':
				return 1;
			case 'gif':
				return 1;
			case 'png':
				return 1;
			case 'swf':
				return 1;
			default:
				alert('Only following filetypes are supported:\n1) jpg\n2) gif \n3) png\n4) swf');
				p_Field.value='';
				return 0;
		}
	}else{
		alert("Please Upload "+p_FieldName+".");
		p_Field.select();
		return 0;
	}
}

 function ValidateMandUploadTemplate(p_Field,p_FieldName){
	if(p_Field.value !=''){
		var FileExtension = p_Field.value.substr(p_Field.value.length-4,p_Field.value.length);
		switch(FileExtension.toLowerCase()){
			case 'html':
				return 1;
			case '.htm':
				return 1;
			default:
				alert('Only following filetypes are supported for '+p_FieldName+' :\n1) html\n2) htm.');
				p_Field.value='';
				return 0;
		}
	}else{
		alert("Please Upload "+p_FieldName+".");
		p_Field.select();
		return 0;
	}
}


function ValidateMandImageUrl(p_Field,p_FieldName){
	if(p_Field.value !=''){
		
		if(isLink(p_Field) == 0){
			return 0;
		}
		var FileExtension = p_Field.value.substr(p_Field.value.length-3,p_Field.value.length);
		switch(FileExtension.toLowerCase()){
			case 'jpg':
				return 1;
			case 'gif':
				return 1;
			case 'png':
				return 1;
			default:
				alert('Only following filetypes are supported:\n1) jpg\n2) gif\n3) png');
				p_Field.select();
				return 0;
		}
	}else{
		alert("Please Enter "+p_FieldName+ ".");
		p_Field.focus();
		return 0;
	}
}


function ValidateMandZipFile(p_Field,p_FieldName){
	if(p_Field.value !=''){
		var FileName = p_Field.value.substr(p_Field.value.length-10,p_Field.value.length);
		
		if(FileName.toLowerCase()!='images.zip'){
				alert('Please upload images.zip file only for template!');
				return 0;
		 }
		var FileExtension = p_Field.value.substr(p_Field.value.length-3,p_Field.value.length);
		switch(FileExtension.toLowerCase()){
			case 'zip':
				return 1;
			case 'ZIP':
				return 1;
			default:
				alert('Only zip fles are allowed to upload.');
				p_Field.value='';
				return 0;
		 }
	}else{
		alert("Please Upload "+p_FieldName+".");
		p_Field.select();
		return 0;
	}
}



 function ValidateMandUploadForAny(p_Field,p_FieldName){
	if(p_Field.value !=''){
		var FileExtension = p_Field.value.substr(p_Field.value.length-3,p_Field.value.length);
		return 1;
	}else{
		alert("Please Upload "+p_FieldName+".");
		p_Field.select();
		return 0;
	}
}


/*********************************************/
 
 function ValidateMandFlash(p_Field,p_FieldName){
	if(p_Field.value !=''){
		var FileExtension = p_Field.value.substr(p_Field.value.length-3,p_Field.value.length);
		switch(FileExtension.toLowerCase()){
			case 'swf':
				return 1;
			case 'flv':
				return 1;
			default:
				alert('Only following filetypes are supported for flash :\n1) swf\n2) flv.');
				p_Field.value='';
				return 0;
		}
	}else{
		alert("Please Upload "+p_FieldName+".");
		p_Field.select();
		return 0;
	}
}

 function ValidateOptFlash(p_Field,p_FieldName){
	if(p_Field.value !=''){
		var FileExtension = p_Field.value.substr(p_Field.value.length-3,p_Field.value.length);
		switch(FileExtension.toLowerCase()){
			case 'swf':
				return 1;
			default:
				alert('Please upload swf file only.');
				/*p_Field.value='';*/
				return 0;
		}
	}else{
		return 1;
	}
}

/*********************************************/


function alertUpload()
{
	 alert("Sorry, you can't enter path manually,Please upload using browse button.");
	 return(false);

}

function confDel(p_Name){
	if(confirm("Are you sure you want to delete this "+p_Name+"?")){
		return true;
	}else{
		return false;
	}
	return false;
}

function confAction(p_Name,p_Action){
	if(confirm("Are you sure you want to "+p_Action+" this "+p_Name+"?")){
		return true;
	}else{
		return false;
	}
	return false;
}

function confMessage(p_Message){
	if(confirm(p_Message)){
		return true;
	}else{
		return false;
	}
	return false;
}

function confirmDelete(p_Message){
	if(confirm(p_Message)){
		return true;
	}else{
		return false;
	}
	return false;
}

function ConfirmDelRedirect(p_Name,p_Url){
	if(confirm("Are you sure you want to delete this "+p_Name+"?")){
		location.href = p_Url;
		return true;
	}else{
		return false;
	}
	return false;
}

/*********************************************/



function ValidateForLink(p_field,p_FieldName){
	if(Trim(p_field).value == "" ) {
		alert("Please Enter "+ p_FieldName +".");            
		p_field.focus();
		return 0;
	}else{
		return 1;
	}
}

function ValidateForSimpleBlank(p_field,p_FieldName){
	if(Trim(p_field).value == "" ) {
		alert("Please Enter "+ p_FieldName +".");            
		p_field.focus();
		return 0;
	}else{
		return 1;
	}
}



function ValidateForBlank(p_field,p_FieldName){
	if(Trim(p_field).value == "" ) {
		alert("Please Enter "+ p_FieldName +".");            
		p_field.focus();
		return 0;
	}else if(p_FieldName == 'keyword' || p_FieldName == 'Keyword'){
		if(CheckSpecialCharactersForSearch(p_field,p_FieldName)){
			return 0;
		}else{
			return 1;
		}
	}else if(CheckSpecialCharacters(p_field,p_FieldName)){
		return 0;
	}else{
		return 1;
	}
}


function ValidateForBlankOpt(p_field,p_FieldName){
	if(Trim(p_field).value == "" ) {
		return 1;
	}else if(p_FieldName == 'keyword'){
		if(CheckSpecialCharactersForSearch(p_field,p_FieldName)){
			return 0;
		}else{
			return 1;
		}
	}else if(CheckSpecialCharacters(p_field,p_FieldName)){
		return 0;
	}else{
		return 1;
	}
}



function ValidateForLanguages(p_field,p_FieldName,p_Min,p_Max){
	 p_Min=1;
	if(document.getElementById("NumLanguages").value > 1)
		for(var i=2;i<=document.getElementById("NumLanguages").value;i++){
			if(Trim(document.getElementById(p_field+i)).value != "" ) {
				if(!ValidateForBlank(document.getElementById(p_field+i), p_FieldName+LanguageName[i])){
					return 0;
				}
				if(!ValidateMandRange(document.getElementById(p_field+i), p_FieldName+LanguageName[i],p_Min,p_Max)){
					return 0;
				}
				
		}
	}

	return 1;

}


function ValidateForLanguagesTextarea(p_field,p_FieldName,p_Min,p_Max){
	if(document.getElementById("NumLanguages").value > 1)
		for(var i=2;i<=document.getElementById("NumLanguages").value;i++){
			if(Trim(document.getElementById(p_field+i)).value != "" ) {
				if(!ValidateForTextareaOpt(document.getElementById(p_field+i), p_FieldName+LanguageName[i],p_Min,p_Max)){
					return 0;
				}
				
		}
	}

	return 1;

}


function ValidateForDate(p_field,p_FieldName){
	if(Trim(p_field).value == "" ) {
		alert("Please Enter "+ p_FieldName +".");            
		p_field.focus();
		return 0;
	}else{
		return 1;
	}
}


function ValidateForDateOfBirth(day_field,month_field,year_field){
	if( ValidateForSelect(day_field, "Day of Birth") 
		&& ValidateForSelect(month_field, "Month of Birth")
		&& ValidateForSelect(year_field, "Year of Birth")){

		if(month_field.value == '02' && day_field.value > 29){
			alert('Please select valid day for selected month.');
			day_field.focus();
			return 0;
		}


		if(month_field.value != '02'){
				
			var rem = (month_field.value)%2;
		
			if(month_field.value < 8 ){
				if(rem == 0 && day_field.value > 30){
					alert('Please select valid day for selected month.');
					day_field.focus();
					return 0;
				}
			}else{
				if(rem == 1 && day_field.value > 30){
					alert('Please select valid day for selected month.');
					day_field.focus();
					return 0;
				}
			}

		}

		return 1;
	}else{
		return 0;
	}

}

function ValidateForSearchFeild(p_field,p_FieldName){
	if(Trim(p_field).value == "" ) {
		alert("Please Enter "+ p_FieldName +".");            
		p_field.focus();
		return 0;
	}else if(CheckSpecialCharactersForSearch(p_field,p_FieldName)){
		return 0;
	}else{
		return 1;
	}
}

function ValidateForTextarea(p_field,p_FieldName){
	if(Trim(p_field).value == "" ) {
		alert("Please Enter "+ p_FieldName +".");            
		p_field.focus();
		return 0;
	}else if(CheckSpecialCharactersForTextarea(p_field,p_FieldName)){
		return 0;
	}else{
		return 1;
	}
}

function ValidateForTextareaFlash(p_field,p_FieldName){
	if(Trim(p_field).value == "" ) {
		alert("Please Enter "+ p_FieldName +".");            
		p_field.focus();
		return 0;
	}else if(CheckSpecialCharactersForFlashCode(p_field,p_FieldName)){
		return 0;
	}else{
		return 1;
	}
}


function ValidateForTextareaOpt(p_field,p_FieldName,p_Min,p_Max){
	if(Trim(p_field).value != "" ) {
		if(p_field.value.length < p_Min || p_field.value.length > p_Max){
			alert(p_FieldName+" should be from "+p_Min+" to "+p_Max+" characters long.");
			p_field.focus();
			return 0;
		}else if(CheckSpecialCharactersForTextarea(p_field,p_FieldName)){
			return 0;
		}else{
			return 1;
		}
	}else{
		return 1;
	}

}


function ValidateForTextareaMand(p_field,p_FieldName,p_Min,p_Max){
	if(Trim(p_field).value != "" ) {
		if(p_field.value.length < p_Min || p_field.value.length > p_Max){
			alert(p_FieldName+" should be from "+p_Min+" to "+p_Max+" characters long.");
			p_field.focus();
			return 0;
		}else if(CheckSpecialCharactersForTextarea(p_field,p_FieldName)){
			return 0;
		}else{
			return 1;
		}
	}else{
		alert("Please Enter "+p_FieldName+".");            
		p_field.focus();
		return 0;
	}

}



function ValidateForEmail(p_field,p_FieldName){
	if(Trim(p_field).value == "" ) {
		alert("Please Enter Email Address.");            
		p_field.focus();
		return 0;
	}else{
		return 1;
	}
}


function ValidateForEditor(p_field,p_FieldName){
	if(Trim(p_field).value == "" ) {
		alert("Please Enter "+ p_FieldName +".");            
		//p_field.focus();
		return 0;
	}else{
		return 1;
	}
}


function ValidateForPassword(p_field,p_FieldName){
	if(Trim(p_field).value == "" ) {
		alert("Please Enter "+ p_FieldName +".");            
		p_field.focus();
		return 0;
	}else if(CheckSpecialCharactersPassword(p_field)){
		return 0;
	}else{
		return 1;
	}

}

function ValidateMandRange(p_field,p_FieldName,p_Min,p_Max){
	if(Trim(p_field).value == "" ) {
		alert("Please Enter "+ p_FieldName +".");            
		p_field.focus();
		return 0;
	}else if(p_field.value.length < p_Min || p_field.value.length > p_Max){
				alert(p_FieldName+" should be from "+p_Min+" to "+p_Max+" characters long.");
				p_field.focus();
				return 0;
	}else{
		return 1;
	}
}

function CheckSpecialCharacters(p_field,p_FieldName){
	 var Character, blankCount=0;
	 for(var i=0; i < p_field.value.length; i++){
		 Character = p_field.value.substring(i,i+1);
		 if(Character=='#' || Character=='^' || Character=='~' || Character=='%' || Character=='"'  || Character=='$' || Character=='`' || Character=='|' || Character=='!' || Character=='+' || Character=='@'  || Character=='<'  || Character=='>'  || Character=='{' || Character=='}'  || Character=='[' || Character==']' ){
			alert("Please do not enter ' "+Character+" ' in "+p_FieldName+".");
			p_field.focus();
			return 1;	
			break;
		 }
		 if(Character==' '){
			blankCount++;
		 }else{
			 blankCount = 0;
		 }

		 if(blankCount >= 2){
			alert("Please do not enter more than two spaces in "+p_FieldName+".");
			p_field.focus();
			return 1;	
			break;
		 }
	 }
	  return 0;
}

function CheckSpecialCharactersForSearch(p_field,p_FieldName){
	 var Character;
	 for(var i=0; i < p_field.value.length; i++){
		 Character = p_field.value.substring(i,i+1);
		 if(Character=='#' || Character=='^' || Character=='~' || Character=='%' || Character=='"' || Character=='$' || Character=='(' || Character==')' || Character=='*' || Character=='`' || Character=='|' || Character=='+' || Character=='_'  || Character=='<' || Character=='>' || Character=='{' || Character=='}'  || Character=='['  || Character==']' || Character=='_'){
			alert("Please do not enter ' "+Character+" ' in "+p_FieldName+".");
			p_field.focus();
			return 1;	
			break;
		 }
		
	 }
	  return 0;
}




function CheckSpecialCharactersForFlashCode(p_field,p_FieldName){
	 var Character;
	 for(var i=0; i < p_field.value.length; i++){
		 Character = p_field.value.substring(i,i+1);
		 if(Character=='^' || Character=='~' || Character=='`'){
			alert("Please do not enter ' "+Character+" ' for  "+p_FieldName+".");
			p_field.focus();
			return 1;	
			break;
		 }
	 }
	  return 0;
}

function CheckSpecialCharactersForTextarea(p_field,p_FieldName){
	 var Character;
	 for(var i=0; i < p_field.value.length; i++){
		 Character = p_field.value.substring(i,i+1);
		 if(Character=='#' || Character=='^' || Character=='~' || Character=='`' || Character=='|'){
			alert("Please do not enter ' "+Character+" ' for  "+p_FieldName+".");
			p_field.focus();
			return 1;	
			break;
		 }
	 }
	  return 0;
}


function SearchProduct(frm){
	if(CheckSpecialCharacters(frm.keyword,'Search Feild')){
			return false;
	}else{
		location.href = 'searchResult.php?catid='+frm.CategorySearch.value+'&key='+frm.keyword.value;
		return false;
	}
}

function ChangePageLink(frm,TotalPage,queryString,PageUrl){
	if(ValidateMandNumField2(frm.Page,"Page number",1,TotalPage)){
		location.href = PageUrl+'?curP='+frm.Page.value+'&'+queryString;
	}
	return false;
}

function CheckSpecialCharactersPassword(p_field){
	 var Character;
	 for(var i=0; i < p_field.value.length; i++){
		 Character = p_field.value.substring(i,i+1);
		 if(Character=='#' || Character=='~' || Character=='`' || Character=='"' || Character=='<' || Character=='>'){
			alert("Please do not enter special characters in Password field.");
			p_field.focus();
			return 1;	
			break;
		 }

		 if(Character=="'"){
			alert("Please do not enter special characters in Password field.");
			p_field.focus();
			return 1;	
			break;
		 }

		 if(Character==' '){
			alert("Please do not enter 'space' between characters for Password.");
			p_field.focus();
			return 1;	
			break;
		 }
	 }
	  return 0;
}



function CheckSpecialCharactersForEmail(p_field){
	 var Character;
	 var countAmp = 0; 
	 for(var i=0; i < p_field.value.length; i++){
		 Character = p_field.value.substring(i,i+1);
		 if(Character=='#' || Character=='^' || Character=='~' || Character=='%' || Character=='$' || Character=='(' || Character==')' || Character=='*' || Character=='`' || Character=='|' || Character=='/' || Character=='!' || Character=='+' || Character==':' || Character==';' || Character==',' || Character=='<'  || Character=='>' || Character=='?'  || Character=='&'  || Character=='{' || Character=='}' || Character=='[' || Character==']' || Character=='=' || Character=='"'){
			alert("Please do not enter ' "+Character+" ' for Email Address.");
			p_field.focus();
			return 1;	
			break;
		 }

		 if(Character=="'"){
			alert("Please do not enter   "+Character+"   for Email Address.");
			p_field.focus();
			return 1;	
			break;
		 }

		 if(Character==' '){
			alert("Please do not enter 'space' between characters for Email Address.");
			p_field.focus();
			return 1;	
			break;
		 }
		 if(Character=='@'){
			 countAmp++;
		 }
	 }

	 if(countAmp==2){
		alert("Please do not enter '@' more than once for Email Address.");
		p_field.focus();
		return 1;	
	 }

	  return 0;
}


function CheckSpecialCharactersForCC(p_field){
	 var Character;
	 var countAmp = 0; 
	 for(var i=0; i < p_field.value.length; i++){
		 Character = p_field.value.substring(i,i+1);
		 if(Character=='#' || Character=='^' || Character=='~' || Character=='%' || Character=='$' || Character=='(' || Character==')' || Character=='*' || Character=='`' || Character=='|' || Character=='/' || Character=='!' || Character=='+' || Character==':' || Character==';' || Character=='<'  || Character=='>' || Character=='?'  || Character=='&'  || Character=='{' || Character=='}' || Character=='[' || Character==']' || Character=='=' || Character=='"'){
			alert("Please do not enter ' "+Character+" ' for Email Address.");
			p_field.focus();
			return 1;	
			break;
		 }

		 if(Character=="'"){
			alert("Please do not enter   "+Character+"   for Email Address.");
			p_field.focus();
			return 1;	
			break;
		 }

		/*
		 if(Character==' '){
			alert("Please do not enter 'space' between characters for Email.");
			p_field.focus();
			return 1;	
			break;
		 }
		 if(Character=='@'){
			 countAmp++;
		 }*/
	 }

	/*
	 if(countAmp==2){
		alert("Please do not enter '@' more than once for Email.");
		p_field.focus();
		return 1;	
	 }*/

	  return 0;
}


///////////////////////


function CheckSpecialCharactersForLink(p_field){
	 var Character;

	 for(var i=0; i < p_field.value.length; i++){
		 Character = p_field.value.substring(i,i+1);
		 if(Character=='#' || Character=='^' || Character=='~' || Character=='%' || Character=='(' || Character==')' || Character=='*' || Character=='`' || Character=='|' || Character=='!' || Character=='+' || Character==';' || Character==',' || Character=='<'  || Character=='>' || Character=='?' || Character=='{' || Character=='}' || Character=='[' || Character==']' || Character=='='){
			alert("Please do not enter ' "+Character+" ' for Url.");
			p_field.focus();
			return 1;	
			break;
		 }

		 if(Character=="'"){
			alert("Please do not enter   "+Character+"   for Url.");
			p_field.focus();
			return 1;	
			break;
		 }

		 if(Character==' '){
			alert("Please do not enter 'space' between characters for Url.");
			p_field.focus();
			return 1;	
			break;
		 }
	 }

	  return 0;
}

//////////////////////////////
function ValidateForPasswordConfirm(p_Password,p_ConfirmPassword){
	if(Trim(p_ConfirmPassword).value == "" ) {
		alert("Please Enter Confirm Password.");            
		p_ConfirmPassword.focus();
		return 0;
	}else if(p_ConfirmPassword.value != p_Password.value ) {
		alert("Passwords do not match, Please Confirm Password again.");            
		p_ConfirmPassword.select();
		return 0;
	}else{
		return 1;
	}
}

function ValidateForVerification(p_verifyText,p_verifyHidden){
	if(Trim(p_verifyText).value == "" ) {
		alert("Please Enter Verification Word.");            
		p_verifyText.focus();
		return 0;
	}else if(p_verifyText.value != p_verifyHidden.value ) {
		alert("Verification Word does not match, Please Re-Enter Word again.");            
		p_verifyText.select();
		return 0;
	}else{
		return 1;
	}
}
function ValidateCheckBox(p_Field,p_Message){
	if(p_Field.checked == false ) {
		alert(p_Message);    
		p_Field.focus();
		return 0;
	}else{
		return 1;
	}
}


function ValidateForOldPassword(p_OldPassword,p_OldPasswordHidden){
	if(Trim(p_OldPassword).value == "" ) {
		alert("Please Enter Old Password.");            
		p_OldPassword.focus();
		return 0;
	}else if(p_OldPassword.value != p_OldPasswordHidden.value ) {
		alert("Wrong Old Password, Please Enter Old Password again.");            
		p_OldPassword.select();
		return 0;
	}else{
		return 1;
	}
}

function ValidateForOldPasswordEnc(p_OldPassword,p_OldPasswordHidden){
	if(Trim(p_OldPassword).value == "" ) {
		alert("Please Enter Old Password.");            
		p_OldPassword.focus();
		return 0;
	}else if(hex_md5(p_OldPassword.value) != p_OldPasswordHidden.value ) {
		alert("Wrong Old Password, Please Enter Old Password again.");            
		p_OldPassword.select();
		return 0;
	}else{
		return 1;
	}
}

function ValidateForSelect(p_field,p_FieldName){
	if(p_field.value == "" ) {
		alert("Please Select "+ p_FieldName +".");            
		p_field.focus();
		return 0;
	}else{
		return 1;
	}
}

function search_records(){
	document.getElementById("MsgDiv").innerHTML = "";
	if(  ValidateForSearchFeild(document.frm1.search_key, "Keyword to Search")
		
	){
		SortSearchListing('','');
		return false;	
	}else{
		return false;	
	}
}

function search_keyword(){
	document.getElementById("MsgDiv").innerHTML = "";
	if(  ValidateForBlank(document.frm1.search_key, "Keyword to Search")
	){
		SortSearchListing('','');
		return false;	
	}else{
		return false;	
	}
}

function Trim(p_field){
	fi=0;la=p_field.value.length-1;
	while(fi<p_field.value.length&&p_field.value.charAt(fi)==" "){
		fi++
	};
	if(fi<p_field.value.length){
		while(la>0&&p_field.value.charAt(la)==" "){
			la--;
		};
		p_field.value=p_field.value.substr(fi,((la-fi)+1));
	} else 
		p_field.value="";
	return p_field;
}

function ValidateMandNumField2(p_field,p_FieldName,p_min,p_max){
	Trim(p_field);
	if (!p_field.value){
		alert("Please Enter " + p_FieldName + ".");
		p_field.focus();
		return 0;
	}
	else
		if(isNaN(parseInt(p_field.value))){
			alert( p_FieldName + " must be a number.");
			p_field.focus();
			return 0;
		}
		else
			if(parseInt(p_field.value)<parseInt(p_min)){
				alert("Sorry " + p_FieldName + " must be greater than or equal to " + p_min + ".");
				p_field.focus();
				return 0;
			}
			else
				if (parseInt(p_field.value)>parseInt(p_max)){
					alert( p_FieldName + " must be less than or equal to " + p_max + ".");
					p_field.focus();
					return 0;
				}
	if(p_field.value.length!=parseInt(p_field.value).toString().length){
		alert( p_FieldName + " must be a number.");
		p_field.focus();
		return 0;
	}
	return p_field;
}


function ValidateOptNumField2(p_field,p_FieldName,p_min,p_max){
	Trim(p_field);
	if (!p_field.value || p_field.value == 0){
		return 1;
	}
	else
		if(isNaN(parseInt(p_field.value))){
			alert( p_FieldName + " must be a number.");
			p_field.focus();
			return 0;
		}
		else
			if(parseInt(p_field.value)<parseInt(p_min)){
				alert("Sorry " + p_FieldName + " must be greater than or equal to " + p_min + ".");
				p_field.focus();
				return 0;
			}
			else
				if (parseInt(p_field.value)>parseInt(p_max)){
					alert( p_FieldName + " must be less than or equal to " + p_max + ".");
					p_field.focus();
					return 0;
				}
	if(p_field.value.length!=parseInt(p_field.value).toString().length){
		alert( p_FieldName + " must be a number.");
		p_field.focus();
		return 0;
	}
	return p_field;
}

function ValidateOptNumField(p_field, p_FieldName){
	if(!p_field.value)
		p_field.value = "";
	else if(isNaN(parseInt(p_field.value))||p_field.value.length!=parseInt(p_field.value).toString().length){
		alert( p_FieldName + " must be a number.");
		p_field.focus();
		return 0;
	}
	return 1;
}

function ValidateOptPhoneNumber(p_field, p_FieldName){
	var num;
	Trim(p_field);
	if(!p_field.value){
		p_field.value = "";
	}else if(p_field.value.length < 10 || p_field.value.length >20){
				alert(p_FieldName+" should be 10 to 20 digits long.");
				p_field.focus();
				return 0;
	}else {	
		 for(var i=0; i < p_field.value.length; i++){
			 num = p_field.value.substring(i,i+1);
			 if(parseInt(num) || num=='-' || num=='+' || num=='0'){
				flag  = true;
			 }else{
				alert("Please Enter a Valid "+p_FieldName+".");
				p_field.focus();
				return 0;
				break;
			 }
		 }

	}
	return 1;
}

function ValidateProductNumber(formInput, p_FieldName) {
   var reg = /^[A-Za-z0-9_\-\.]+$/;

   var address = formInput.value;

	if(Trim(formInput).value == "" ) {
      return 1;
	}else{

	   if(reg.test(address) == false) {
		  alert("Please Enter Valid "+p_FieldName+".");  
		  formInput.select();
		  return 0;
	   }

	}


	return 1;
}


function ValidateIDNumber(p_field, p_FieldName){
	var num;
	Trim(p_field);
	if(!p_field.value){
			alert("Please Enter "+p_FieldName+".");
			p_field.focus();
			return 0;
	}else if(p_field.value.length < 5 || p_field.value.length >20){
				alert(p_FieldName+" should be 5 to 20 digits long.");
				p_field.focus();
				return 0;
	}else {	
		 for(var i=0; i < p_field.value.length; i++){
			 num = p_field.value.substring(i,i+1);
			 if(parseInt(num) || num=='-' || num=='+' || num=='0'){
				flag  = true;
			 }else{
				alert("Please Enter a Valid "+p_FieldName+".");
				p_field.focus();
				return 0;
				break;
			 }
		 }

	}
	return 1;
}


function ValidatePhoneNumber(p_field, p_FieldName,p_Min,p_Max){
	var num;
	Trim(p_field);
	if(!p_field.value){
			alert("Please Enter "+p_FieldName+".");
			p_field.focus();
			return 0;
	}else if(p_field.value.length < p_Min || p_field.value.length >p_Max){
				alert(p_FieldName+" should be "+p_Min+" to "+p_Max+" digits long.");
				p_field.focus();
				return 0;
	}else {	
		 for(var i=0; i < p_field.value.length; i++){
			 num = p_field.value.substring(i,i+1);
			 if(parseInt(num) || num=='-' || num=='+' || num=='0'){
				flag  = true;
			 }else{
				alert("Please Enter a Valid "+p_FieldName+".");
				p_field.focus();
				return 0;
				break;
			 }
		 }

	}
	return 1;
}


function ValidateAccountNumber(p_field, p_FieldName,p_Min,p_Max){
	var num;
	Trim(p_field);
	if(!p_field.value){
			alert("Please Enter "+p_FieldName+".");
			p_field.focus();
			return 0;
	}else if(p_field.value.length < p_Min || p_field.value.length >p_Max){
				alert(p_FieldName+" should be "+p_Min+" to "+p_Max+" digits long.");
				p_field.focus();
				return 0;
	}else {	
		 for(var i=0; i < p_field.value.length; i++){
			 num = p_field.value.substring(i,i+1);
			 if(parseInt(num) || num=='-' || num=='+' || num=='0'){
				flag  = true;
			 }else{
				alert("Please Enter a Valid "+p_FieldName+".");
				p_field.focus();
				return 0;
				break;
			 }
		 }

	}
	return 1;
}

function isValidPhoneNumber(p_field, p_FieldName){
	var num;
	if(!p_field.value){
		p_field.value = "";
	}else {	
		 for(var i=0; i < p_field.value.length; i++){
			 num = p_field.value.substring(i,i+1);
			 if(parseInt(num) || num=='-' || num==' ' || num=='+' || num=='0' || num==','){
				flag  = true;
			 }else{
				alert("Please Enter Valid "+p_FieldName+".");
				p_field.focus();
				return 0;
				break;
			 }
		 }

	}
	return 1;
}


function ValidateOptFax(p_field, p_FieldName){
	var num;
	if(!p_field.value){
		p_field.value = "";
	}else if(p_field.value.length < 10 || p_field.value.length >20){
				alert("Fax Number should be 10 to 20 digits long.");
				p_field.focus();
				return 0;
	}else {	
		 for(var i=0; i < p_field.value.length; i++){
			 num = p_field.value.substring(i,i+1);
			 if(parseInt(num) || num=='-' || num=='+' || num=='0'){
				flag  = true;
			 }else{
				alert("Please Enter a Valid Fax Number.");
				p_field.focus();
				return 0;
				break;
			 }
		 }

	}
	return 1;
}


function ValidateExistance(p_Field, p_Url){
	var objDoc;
	var httpObj = new ActiveXObject("Microsoft.XMLHTTP");
	httpObj.Open("POST",p_Url, false);
	httpObj.send();

	 if(httpObj.responseText==1) {	 
		alert(p_Field.name +" already exists in database.Please enter another.");
		p_Field.select();  					
		return false;
	} else if(httpObj.responseText==0) {	 
		 return true;
	}else {
		alert("Error occur : " + httpObj.responseText);
		return false;
	}
}

function ValidateMandNumField(p_field, p_FieldName){
	Trim(p_field);
	if (!p_field.value  || p_field.value<1){
		alert("Please Enter " + p_FieldName + ".");
		p_field.focus();
		return 0;
	//}else if(isNaN(parseInt(p_field.value))||p_field.value.length!=parseInt(p_field.value).toString().length){
	}else if(isNaN(p_field.value)){
		alert( p_FieldName + " must be a number.");
		p_field.focus();
		return 0;
	}
	return 1;
}


function ValidateMandDecimalField(p_field, p_FieldName){
	var dotcount=0;

	Trim(p_field);

	if (p_field.value == ''){
		alert("Please Enter " + p_FieldName+ ".");
		p_field.focus();
		return 0;
	}else if(p_field.value == '.'){
		alert("Please Enter a Valid " + p_FieldName + ".");
		p_field.focus();
		return 0;
	}else {
		 for(var i=0; i < p_field.value.length; i++){
			 num = p_field.value.substring(i,i+1);
			 if(dotcount == 1 && num=='.'){
				alert("Please Enter a Valid " + p_FieldName + ".");
				p_field.focus();
				return 0;
				break;
			 } else if(parseInt(num) || num=='.' || num=='0'){
				 if(num=='.')
				 { dotcount++;} 
			 }else{
				alert("Please Enter a Valid " + p_FieldName + ".");
				p_field.focus();
				return 0;
				break;
			 }
		 }
	}
	return 1;
}


function ValidateOptDecimalField(p_field, p_FieldName){
	var dotcount=0;
	if (p_field.value < 0.1){
		return 1;
	}else if(p_field.value == '.'){
		alert("Please Enter a Valid " + p_FieldName + ".");
		p_field.focus();
		return 0;
	}else {
		/*
		if(parseFloat(p_field.value)>100){
			alert(p_FieldName + " must be less than or equal to 100.");
			p_field.focus();
			return 0;
		}*/

		 for(var i=0; i < p_field.value.length; i++){
			 num = p_field.value.substring(i,i+1);
			 if(dotcount == 1 && num=='.'){
				alert("Please Enter a Valid " + p_FieldName + ".");
				p_field.focus();
				return 0;
				break;
			 } else if(parseInt(num) || num=='.' || num=='0'){
				 if(num=='.')
				 { dotcount++;} 
			 }else{
				alert("Please Enter a Valid " + p_FieldName + ".");
				p_field.focus();
				return 0;
				break;
			 }
		 }
	}
	return 1;
}




function ValidateRadioButtons(p_field, p_FieldName){
	var len = p_field.length;
	var CheckedFlag = 0;
	if(len > 0){
		for(var i=0; i < len; i++){
			if(p_field[i].checked == true){
				CheckedFlag = 1;
				break;
			}
		}
	}else{
		if(p_field.checked == true){
			CheckedFlag = 1;
		}
	}

	if(CheckedFlag == 0){
		alert("Please Select "+p_FieldName+".");
		p_field[0].focus();
		return 0;
	}
	return 1;
}

//---------Functions for getting mouseLeft postion----------//
function getPositionX()
	{
		return event.screenX;
	}

//---------Functions for getting mouseTop postion----------//
function getPositionY(e)
{

		var IE = document.all?true:false
		var tempX = 0
		var tempY = 0
		var e = new Object();

		if (IE) { // grab x-y pos.s if browser is IE
		tempX = event.clientX + document.body.scrollLeft
		tempY = event.clientY + document.body.scrollTop
			var y_postion=tempY;

		return(y_postion);
		} else { // grab x-y pos.s if browser is NS
		tempX = e.pageX
		tempY = e.pageY
		}
		// catch possible negative values in NS4
		if (tempX < 0){tempX = 0}
		if (tempY < 0){tempY = 0}

		var y_postion=tempY ;
		return(y_postion);

}
function FindXPosition(obj)
  {
    var curleft = 0;
    if(obj.offsetParent)
        while(1) {
          curleft += obj.offsetLeft;
          if(!obj.offsetParent)
            break;
          obj = obj.offsetParent;
        }
    else if(obj.x)
        curleft += obj.x;
    return curleft;
  }
function FindYPosition(obj) {
    var curtop = 0;
    if(obj.offsetParent)
        while(1) {
          curtop += obj.offsetTop;
          if(!obj.offsetParent)
            break;
          obj = obj.offsetParent;
        }
    else if(obj.y){
        curtop += obj.y;
	}
    return curtop;
  }

///////////////////********////////////////

function ShowAfterLoading(EditorDiv){
	document.getElementById("LoadingDiv").style.display = 'none';
	document.getElementById(EditorDiv).style.display = 'inline';
}




function getPageBodyScroll(){

	var yScroll;

	if (self.pageYOffset) {
		yScroll = self.pageYOffset;
	} else if (document.documentElement && document.documentElement.scrollTop){	 // Explorer 6 Strict
		yScroll = document.documentElement.scrollTop;
	} else if (document.body) {// all other Explorers
		yScroll = document.body.scrollTop;
	}

	arrayPageScroll = new Array('',yScroll) 
	return arrayPageScroll;
}


function getPageBodySize(){
	
	var xScroll, yScroll;
	
	if (window.innerHeight && window.scrollMaxY) {	
		xScroll = document.body.scrollWidth;
		yScroll = window.innerHeight + window.scrollMaxY;
	} else if (document.body.scrollHeight > document.body.offsetHeight){ // all but Explorer Mac
		xScroll = document.body.scrollWidth;
		yScroll = document.body.scrollHeight;
	} else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
		xScroll = document.body.offsetWidth;
		yScroll = document.body.offsetHeight;
	}
	
	var windowWidth, windowHeight;
	if (self.innerHeight) {	// all except Explorer
		windowWidth = self.innerWidth;
		windowHeight = self.innerHeight;
	} else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
		windowWidth = document.documentElement.clientWidth;
		windowHeight = document.documentElement.clientHeight;
	} else if (document.body) { // other Explorers
		windowWidth = document.body.clientWidth;
		windowHeight = document.body.clientHeight;
	}	
	
	// for small pages with total height less then height of the viewport
	if(yScroll < windowHeight){
		pageHeight = windowHeight;
	} else { 
		pageHeight = yScroll;
	}

	// for small pages with total width less then width of the viewport
	if(xScroll < windowWidth){	
		pageWidth = windowWidth;
	} else {
		pageWidth = xScroll;
	}


	arrayPageSize = new Array(pageWidth,pageHeight,windowWidth,windowHeight) 
	return arrayPageSize;
}

