//Global Variales
var puid=""; //Current project GUID
var projectName=""; //Current project Name
var userid=""; //Current Login User userGUID
var rmospocID="";
var VPID="";
var RMOID="";
var VpName="";
var RejectionComments="";
var ViewVal="";
var CurProjectCode="";
var functionalStatus="";
var BusinessDaysCount="";
var VPTatDays="";
var RMOTatDays="";
var ProjectManagerName="";
var datevalidationflag=0;

//array variable to get month value from index value
var GetMonth ={"Jan": "January",'Feb':"February",'Mar': "March",'Apr':"April",'May':"May",'Jun':"June",'Jul':"July",'Aug': "August",'Sep': "September",'Oct': "October",'Nov': "November",'Dec':"December"};

//Document Ready function
	$(document).ready(function () {
		
//Initialise the field to datepicker field		
	$('#txtReleaseDate').datepicker({dateFormat: 'dd-M-yy',minDate: new Date()});

	//function to get the current login user id,Refer config.js file for code
	GetCurrentUserGUID("1");

	//Current login user GUID
	userid = sessionStorage.CurrentUserGUID;

		//To close the pop up on click of X button in popup
	$('.p-close').on('click',function(){
					
			  $('.Toppopup-bg,.popup-bg').hide();  
			 });
			 
	//to get current project GUID
	puid = getUrlVars()["ProjUid"];
	if(puid==undefined||puid=="")
	{
	 puid = getUrlVars()["projuid"];  
	}
	
	//For TATdays
	functionalStatus=getRRFTATdaysbyStatus("Resource Early Release");
	
	if(functionalStatus.length>0)
	{
		
		for(var j=0;j<functionalStatus.length;j++)
		{
			//flag = 2 VP
			if(functionalStatus[j].Flag==2)
			{
				VPTatDays=functionalStatus[j].TATDays;
			}
			if(functionalStatus[j].Flag==3)
			{
				//flag = 3 RMO
				RMOTatDays=functionalStatus[j].TATDays;
			}
		}
	}
	
	//Bind the data by current project GUID and current Login user GUID
	$('.loader').show();
						setTimeout(function () {
	GetProjectCode(userid,puid);
	}, 100);
	
	
//Validation function when the date is selected in the datepicker field	
$('#txtReleaseDate').on('change',function(){
	   
	
	  $.each($("input[name='Resources']:checked"), function(){            
				var SelectedId=$(this)[0].parentNode.parentNode.id;
				var CurRow=$(this)[0].parentNode.parentNode;
	        
			 
  var ReleaseDate = document.getElementById('txtReleaseDate').value;
  var st = ReleaseDate; //date range fromatit is used for IE 9 above format
  var split=st.split("-");
  var dd = split[0];              
  var y = split[2];
  
  var mm = GetMonth[split[1]];
  var ReleaseDate_ = "";
  ReleaseDate_= mm + " " + dd + "," + y;

  var release_Date = new Date(ReleaseDate_);

  var EndDate =new Date(CurRow.cells[5].innerText);
  var StartDate=new Date(CurRow.cells[4].innerText)
		
	//validation if New selected date is greater than old allocated end date		
	  if(release_Date>=EndDate)
	  {
		  $('#txtReleaseDate').empty();
		  $('#ErrorMsg').text("Early release date should be less than allocation end date");
		  datevalidationflag=1;
		  
		  return false;
	  } 
	  
	  //validation if New selected date is greater than old start date
	  else if(StartDate>=release_Date)
	  {
		  $('#txtReleaseDate').empty();
		  $('#ErrorMsg').text("Early release date should not be less than allocation start date");
		  datevalidationflag=2;
		  
		  return false;
		  
	  }
	  else
	  {
		  datevalidationflag=0;
		  $('#ErrorMsg').text("");
	  }
	  });	  
	});

 //Onclick Function when the data is submtted by the user
 $('.loader').show();
						setTimeout(function () {
	  $("#btnSubmit").click(function(){
	   
		   var Status="";
		   var ReleaseMasterID=0;
		   var ReasonForRelease="";
		   var ProjectFeedBack="";
		   var CurDate=new Date();
			var ReleaseDate =  document.getElementById('txtReleaseDate').value;
			
			//validations
		   if(ReleaseDate=="Invalid Date" || ReleaseDate == ""){
			
			 $('#ErrorMsg').text('Please select the Early Release date');

			datevalidationflag=1;
			return false;
		   }
		   else
		   {
			 $('#ErrorMsg').text('');
		   }
		   var split=ReleaseDate.split("-");
		   var dd = split[0];              
		   var y = split[2];
		   
		   var mm = GetMonth[split[1]];
		   var ReleaseDate_ = "";
		   ReleaseDate_= mm + " " + dd + "," + y;
				
				
			if(datevalidationflag==1)
			{
				$('#txtExtensionDate').empty();
				$('#ErrorMsg').text("Early release date should be lesser than Allocation End Date");
				datevalidationflag=1;
				return false;
			}
			else if(datevalidationflag==2)
			{
				 $('#txtReleaseDate').empty();
		         $('#ErrorMsg').text("Early release date should not be less than allocation start date");
		         datevalidationflag=2;

				return false;	
			}
			
			
			ProjectFeedBack=$('#Feedback').val();
			 if(ProjectFeedBack=='')
			 {
			   $('#FeedBackBoxErrorMsg').text('Please enter Project End Feedback');
				$('#Feedback').focus();
				return false;
			 }
			 
			  var match =/[*|\":<>[\]{}`\\()';@&$]/; 

        if (match.test(ProjectFeedBack)) {
			$('#FeedBackBoxErrorMsg').text("Please avoid/remove special charaters in Feedback box");
			return false;
			}
			else
			{
				 $('#FeedBackBoxErrorMsg').text('');
			}
				
			
			if($('#ddlReleaseReason').val()=="0")
			{
				$('#DDlCommentBoxErrorMsg').text('Please select reason for early release');
				return false;
			}
			else
			{
					$('#DDlCommentBoxErrorMsg').text('');
			}
			
			if(RejectionComments=="Additional Comments")
			{
			   ReasonForRelease=$('#comment').val();
			  if(ReasonForRelease=='')
			  {
				$('#CommentBoxErrorMsg').text('Please provide reason for early release');
				$('#comment').focus();
				return false;
			 }
			 
			else
			{
				$('#CommentBoxErrorMsg').text('');
			} 
			var match = (new RegExp('[~#%\&{}+\|]|\\.\\.|^\\.|\\.$')).test(ReasonForRelease);
			if (match) {
			$('#CommentBoxErrorMsg').text("Please avoid/remove special charaters(~#%&{}|+) in comment box");
			return false;
			}
			else
			{
				 $('#CommentBoxErrorMsg').text('');
			} 
			ReasonForRelease=RejectionComments+"-"+ReasonForRelease;
			}
			else
			{
				ReasonForRelease=RejectionComments;
			}
			 
			
			var SpID="";
			
			if(confirm("Are you sure to submit resources for early release?"))
			{
				 
				$.each($("input[name='Resources']:checked"), function()
				{            
					var SelectedId=$(this)[0].parentNode.parentNode.id;
					var CurRow=$(this)[0].parentNode.parentNode;

					var EmployeeId=CurRow.cells[1].innerText;
					var Name=CurRow.cells[2].innerText;
					var ResourceName=Name.indexOf("\r");
					if(ResourceName>0)
					{
						ResourceName=Name.split('\r')[0];
					}
					else
					{
						ResourceName=Name;
					}
				
					var AllocationPerCentage=CurRow.cells[3].innerText;
					var StartDate=CurRow.cells[4].innerText;
					var EndDate=CurRow.cells[5].innerText;
					var DiffDays=CurRow.cells[6].innerText;
				
					var ProjectLocation=CurRow.cells[7].innerText.split('+')[0];
					var InernalID=CurRow.cells[7].innerText.split('+')[2];
				
					

					$("input[name='Resources']:checked").closest("tr").css("opacity",0.5);
					$("input[name='Resources']:checked").prop("disabled",true);

					var ProjectlistName = "ResourceReleaseExtensionApprovalMaster";
					var ProjectitemType = GetItemTypeForListName(ProjectlistName);

					if(DiffDays>=15)
					{
						//Spid of RMO user ID
					SpID=GetUserIDbyGuid(RMOID);

					
					var Projectitem = {
					__metadata: { "type": ProjectitemType },
				  ProjectName:projectName,
				  ProjectCode:puid,
				  ApprovalFlag:2,
				  Status:"InProgress",
				  ReasonForEarlyRelease:ReasonForRelease,
				  ResourceType:"Resource Early Release",
				  PendingWith:RMOID,
				  PendingWithUserIDId:SpID,
				  TATDate:CurDate,
				  PendingWithDesig:"RMO",
				  AllocatedProjectCode:CurProjectCode,
				 ProjectLocation:ProjectLocation,
				 ProjectManagerName:ProjectManagerName,
				 ResourceAllocationID:InernalID
				   };
				 }
				 else
					 if(DiffDays<15)
					 {
						 //Spid of VP user ID
						 SpID=GetUserIDbyGuid(VPID);
						
				 var Projectitem = {
				 __metadata: { "type": ProjectitemType },
				  ProjectName:projectName,
				  ProjectCode:puid,
				  ApprovalFlag:1,
				  Status:"InProgress",
				  ReasonForEarlyRelease:ReasonForRelease,
				  ResourceType:"Resource Early Release",
				  PendingWith:VPID,
				  PendingWithUserIDId:SpID,
				  TATDate:CurDate,
				  PendingWithDesig:"VP",
				  AllocatedProjectCode:CurProjectCode,
				  ProjectLocation:ProjectLocation,
				  ProjectManagerName:ProjectManagerName,
				  ResourceAllocationID:InernalID
				   };
				 } 
						 
				//Refer ReleaseExtensionConfig.js file	
              var ConfigURl=GetListName(ProjectlistName);				
			  $.ajax({
				url:ConfigURl,
				async: false,
				type: "POST",
				contentType: "application/json;odata=verbose",
				data: JSON.stringify(Projectitem),
				headers: {
					"Accept": "application/json;odata=verbose",
					"X-RequestDigest": $("#__REQUESTDIGEST").val()
					},
				success: function (data) {	
						ReleaseMasterID=data.d.ID;
				
					},
				error: function (error) {
			   
					}
				});
				
				
				 var listName = "ResourceAllocationDetails";
				 var itemType = GetItemTypeForListName(listName);
				 
				  if(DiffDays>=15)
				 {
				 var item = {
				 __metadata: { "type": itemType },
				  ResourceName:ResourceName,
				  EmployeeID:EmployeeId,
				  AllocationPercentage:AllocationPerCentage, 
				  StartDate:StartDate,
				  EndDate:EndDate,
				  ReleaseDate:ReleaseDate,
				  ResourceType:"Resource Early Release",
				  RmoSpocGUID:RMOID,
				  ProjectManagerGUID:userid,
				  RMOApprover:RMOID,
				  VPApprover:"",
				  ReleaseExtensionMasterIDId:ReleaseMasterID,
				  flag:2,
				  ApprovalStatus:"Pending",
				  PendingWith:RMOID,
				  PendingWithUserIDId:SpID,
				  SubmittedDate:CurDate,
				  ReasonForRelease:ReasonForRelease,
				  ProjectName:projectName,
				  PendingWithDesig:"RMO",
				  TATDate:CurDate,
				  AllocatedProjectCode:CurProjectCode,
				  ProjectLocation:ProjectLocation,
				  ProjectManagerName:ProjectManagerName,
				  ResourceAllocationID:InernalID,
				  ProjectGUID:puid,
				  ProjectEndFeedBack:ProjectFeedBack
				   };
				 }
				 else
					 if(DiffDays<15)
					 {
						var item = {
				 __metadata: { "type": itemType },
				  ResourceName:ResourceName,
				  EmployeeID:EmployeeId,
				  AllocationPercentage:AllocationPerCentage, 
				  StartDate:StartDate,
				  EndDate:EndDate,
				  ReleaseDate:ReleaseDate,
				  ResourceType:"Resource Early Release",
				  RmoSpocGUID:RMOID,
				  ProjectManagerGUID:userid,
				  RMOApprover:(rmospocID==undefined?"":rmospocID.split('|')[1].trim()),
				  VPApprover:VPID,
				  ReleaseExtensionMasterIDId:ReleaseMasterID,
				  flag:1,
				  ApprovalStatus:"Pending",
				  PendingWith:VPID,
				  PendingWithUserIDId:SpID,
				  SubmittedDate:CurDate,
				  ReasonForRelease:ReasonForRelease,
				  ProjectName:projectName,
				  PendingWithDesig:"VP",
				  TATDate:CurDate,
				  AllocatedProjectCode:CurProjectCode,
				  ProjectLocation:ProjectLocation,
				  ProjectManagerName:ProjectManagerName,
				  ResourceAllocationID:InernalID,
				  ProjectGUID:puid,
				  ProjectEndFeedBack:ProjectFeedBack
				   }; 
						 
					 }
				 
				 //Refer ReleaseExtensionConfig.js file
                  var URl=GetListName(listName);
				  
				   
			$.ajax({
			
			url:URl,
			async: false,
			type: "POST",
			contentType: "application/json;odata=verbose",
			data: JSON.stringify(item),
			headers: {
				"Accept": "application/json;odata=verbose",
				"X-RequestDigest": $("#__REQUESTDIGEST").val()
			},
			success: function (data) {
			  Status="Sucess";
			 },
				error: function (error) {
			
			}
		});
				 
			});
			if(Status=="Sucess")
			{
				
				$('.popup-bg').show();
				$('#AuthenticateDiv').css('display','none');
				$('#CmntReasonForRejection').css('display', 'none');
				$('#OnButtonCancel').css('display','none');
				$('#spnCancelMessage').css('display','none');
				
				$('#InvaildUser').css('display','none');
				$('#Approve').css('display','');
				$('#Rejection').css('display','none');
				$('#Cancel').css('display','none');
				
				$('#AlertmsgDiv').css('display','');
				
				//to clear all the fields
						ClearData();   
			}
			else
			{
				$('.popup-bg').hide();
			}
		   }
		   $('.loader').hide();
	  });
	
	}, 100);  
//Onclick function when the user click on cancel button	  
$("#btnCancel").click(function()
{
	$('.popup-bg').show();
		        $('#AuthenticateDiv').css('display', 'none');
                $('#spnApproval').css('display', 'none');
                $('#spnInvalidUser').css('display', 'none');
				$('#CmntReasonForRejection').css('display', 'none');
                $('#AlertmsgDiv').css('display', 'none');
                $('#AlertMsg').css('display', 'none');
				
				$('#InvaildUser').css('display','none');
				$('#Approve').css('display','none');
				$('#Rejection').css('display','none');
				$('#Cancel').css('display','');
				
		$('#OnButtonCancel').css('display','');
		$('#spnCancelMessage').css('display','');
		
	// if(confirm("Are you sure to cancel?"))
	// {
	// ClearData();
	// }
});
	});

	//Onclick function when the user click on cancel button
function BtnOKCancel()
{
	ClearData();
	 $('.Toppopup-bg,.popup-bg').hide();
}

//function to clear all the fileds	
function ClearData()
{
	
				$.each($("input[name='Resources']:checked"), function(){
			
				
				
				$("input[name='Resources']:checked")[0].checked=false;	
               				  
			   });
			   
				$('#txtReleaseDate').val('');
				$('#comment').val('');
				$("#panel").slideUp("slow").hide();
				
				
				$('#ErrorMsg').text("");
				$('#CommentBoxErrorMsg').text("");
				$('#Feedback').text("");
	
	
}
	
//function to extract the project GUID query string parameter from url	
	  function getUrlVars() {
		  
			var vars = [], hash;
			var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
			for (var i = 0; i < hashes.length; i++) {
				hash = hashes[i].split('=');
				vars.push(hash[0]);
				vars[hash[0]] = hash[1];
			}
			return vars;
		}
		
	//function to get the allocated project code and check for the authenticate login user	
		function GetProjectCode(UserGUID,PUID)
		{
			
		//Refer ReleaseExtensionConfig.js file
			var AllvalRow="";
			var url=GetProjectDataByPUID(PUID);
			
			$.ajax({
				url: url,
				async: false,
				method: "GET",
				headers: {
					"Accept": "application/json; odata=verbose",
					"Content-Type": "application/json; odata=verbose"
				},
				success: function (data) 
				{
					var data=data.d.results;
					projectName=data[0].ProjectName;
					var projectCode=data[0].ProjectCode==undefined?'':data[0].ProjectCode;
					CurProjectCode=projectCode;
					rmospocID=data[0].RMOSPOC;
					var rmospocEid=(rmospocID==undefined?"":rmospocID.split('|')[0].trim());
					var projectOwnerId=data[0].ProjectOwnerId; 
					var resGBU=data[0].GBU;
					ProjectManagerName=data[0].ProjectOwnerName==undefined?'':data[0].ProjectOwnerName;
					if(projectOwnerId!=undefined)
					{
					  projectOwnerId=projectOwnerId;
					}
					//if invalid user
					// if(UserGUID!=projectOwnerId ||projectOwnerId==undefined)
					// {
						// $('#tblResourceRelease').css('display','none');
						// $('.popup-bg').show();
						// $('#AuthenticateDiv').css('display','');
						// $('#AlertmsgDiv').css('display','none');
						// $('#spnApproval').css('display','none');
						// $('#CmntReasonForRejection').css('display', 'none');
						// $('#OnButtonCancel').css('display','none');
						// $('#spnCancelMessage').css('display','none');
						// $('#InvaildUser').css('display','');
						// $('#Approve').css('display','none');
						// $('#Rejection').css('display','none');
						// $('#Cancel').css('display','none');
						// $('#spnInvalidUser').css('display','');
					// }
					//if valid user
					//else
					//{
						if(ViewVal!=1)
						{
							$('#tblResourceRelease').css('display','');
						}
						$('.popup-bg').hide();
						//to bind the resources
						GetPojectData(projectCode);
						//to get rmo id by rmo emp id
						GetRMoIDByRmoEid(rmospocEid);
						//to get vp id by resource gbu
						GetResVPByResGBU(resGBU);
					//}
					
				},
				error: function (error) {
					result = 'error';
				}
			});
			
		}
		

//function to bind the data to the tblResourceRelease table		
		function GetPojectData(ProjectCode)
		{
			var CountVal=1;
			var AllvalRow="";
			var pendingrow="";
			var rjval=0;
			
			//Refer ReleaseExtensionConfig.js file
			var url=GetResourceDataFromMspByPCode(ProjectCode,'Early Release');
					
		   
		 $.ajax({
		  url: url,
		  async: false,
		
		  type:"GET",
		  dataType: "json",
		  headers:
		  {
			"content-Type": "application/json"
		 },
		 success: function (data) {
			 var AllocationData=data.value;
			 var diffDays=0;
			 var Enddate="";
			 var CurDate="";
			 
			 
			 
			  var months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
			 
			 for(var i=0;i<AllocationData.length;i++)
			 {
				 var AllocationPerCent=(AllocationData[i].Allocation);
				 var ResourceName=AllocationData[i].ResourceFullName;//ResourceName;
				 
				 var Empid=AllocationData[i].EmployeeID;
				 var StartDate=AllocationData[i].Startdatetime;
				 StartDate=StartDate.split('T')[0];
				StartDate=StartDate.split('-');
				StartDate=StartDate[2]+" "+months[StartDate[1]-1]+" "+StartDate[0];
				
				 var FinishDate=AllocationData[i].Finishdatetime;
				 FinishDate=FinishDate.split('T')[0];
				FinishDate=FinishDate.split('-');
				FinishDate=FinishDate[2]+" "+months[FinishDate[1]-1]+" "+FinishDate[0];
				
				Enddate=new Date((AllocationData[i].Finishdatetime).split('T')[0]);
				CurDate=new Date();
					var timeDiff = Math.abs(Enddate.getTime() - CurDate.getTime());
					diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
					
					var ResFlag=AllocationData[i].Flag==undefined?'':AllocationData[i].Flag;
					var ProjectLocation=AllocationData[i].ProjectLocation==undefined?'':AllocationData[i].ProjectLocation;
					var InternalID=AllocationData[i].InternalID==undefined?'':AllocationData[i].InternalID;
					
				 if(ResourceName=='')
				 {
			
				var eid=AllocationData[i].EmployeeID;
				
				 //Refer ReleaseExtensionConfig.js file
				var url=GetResourceDataByEmpCode(eid,1);
			
				$.ajax({
				url: url,
				async: false,
				method: "GET",
				headers: {
					"Accept": "application/json; odata=verbose",
					"Content-Type": "application/json; odata=verbose"
				},
				success: function (data) {
					var data=data.d.results;
					ResourceName=data[0].ResourceName==undefined?'':data[0].ResourceName;
					
				},
				error: function (error) {
					result = 'error';
				}
			});
				 }
				 
				 var Usrval = "";
    var TatDate = "";
    var EmpDesig = "";

    //Refer ReleaseExtensionConfig.js file
    var url = GetRequestedDataByEmpIdandResType(InternalID);
	
	//check if user is request is pending in the list	
    $.ajax(
    {
        url: url,
        async: false,
        method: "GET",
        headers:
        {
            "Accept": "application/json; odata=verbose",
            "Content-Type": "application/json; odata=verbose"
        },
        success: function(data)
        {
            var data = data.d.results;
            if (data.length != 0)
            {
                for (var i = 0; i < data.length; i++)
                {
                    var ApprovalStatus = data[i].ApprovalStatus;
                    var Type = data[i].ResourceType;
                    TatDate = data[i].TATDate;
                    EmpDesig = data[i].PendingWithDesig;
					var ReasonForRejection="";
					
				if(TatDate!=null)
					{
						var TatDateDAta = new Date(TatDate);
						if (functionalStatus.length > 0) 
						{
							var totalweekdays = 0;
							var TodayDate = new Date();
							TatDateDAta.setHours(0,0,0,0); 
							TodayDate.setHours(0,0,0,0);
							var timeDiff_ = new Date(TodayDate - TatDateDAta);
							var diffDays_ = timeDiff_/1000/60/60/24;
							
							for (var i = TatDateDAta; i <= TodayDate;) 
							{
								if (i.getDay() == 0) {
									totalweekdays++;
								}
								if (i.getDay() == 6) {
									totalweekdays++;
								}
								i.setTime(i.getTime() + 1000 * 60 * 60 * 24);
							}
							var Total_Week_days = parseInt(totalweekdays);
							var T_days = 0;
							if(EmpDesig == "VP")
							{
								T_days = parseInt(VPTatDays);
							}
							else if(EmpDesig == "RMO")
							{
								T_days = parseInt(RMOTatDays);
							}
							diffDays_ =  diffDays_ - Total_Week_days;
							
							if (diffDays_ > T_days) {
								BusinessDaysCount = "<div class='bgred'>" + diffDays_ + " - D</div>";
							}
							else if (diffDays_ != 0) {
								BusinessDaysCount = "<div class='bggreen'>" + diffDays_ + " - D</div>";
							}
						}
					}
						//if user request is pending in the list	
                        Usrval = "true";
                        
                
				EmpiDVal=Usrval;
				
					var AllRowData="";
					//If all option is selected in the view resource dropdown
                 if (ViewVal == 3)
                    {
						if ((EmpiDVal == "true"))
                     {

						 AllRowData = "<tr id=" + CountVal + " style='opacity:0.5'><td class='ToHideOnView' style='text-align:center'><input type='checkbox' name='Resources' class='chckResourceRelease' onchange='valueChanged()' disabled='disabled' style='text-align:center'></input></td><td style='text-align:center'>" + Empid + "</td><td><span href='#' id='show-popup' class='action-b'>" + ResourceName + "<div class='action-b-view'><a href='../SitePages/ResourceProjectInformation.aspx?employeeID=" + Empid + "&employeename=" + ResourceName + "' target='_blank' style='color:#337ab7'>Project Detail</a><a href='../SitePages/ViewProfile.aspx?employeeID=" + Empid + "&employeename=" + ResourceName + "' target='_blank' style='color:#337ab7'>View Profile</a></div></span>" + BusinessDaysCount + "</td><td style='text-align:center'>" + AllocationPerCent + "</td><td style='text-align:center'>" + StartDate + "</td><td style='text-align:center'>" + FinishDate + "</td><td style='display:none'>" + diffDays + "</td><td style='display:none'>"+ProjectLocation+"+"+ReasonForRejection+"+"+InternalID+"</td></tr>"; 

					 }
                        AllvalRow += AllRowData+';';
						
                    }
					//if pending for release option is selected in the view resource drop down
					else if (ViewVal == 1)
                        {
							if(ApprovalStatus=="Pending")
							{
								//row = "<tr id=" + CountVal + " style='opacity:0.5'><td class='ToHideOnView' style='text-align:center'><input type='checkbox' name='Resources' class='chckResourceRelease' onchange='valueChanged()' disabled='disabled' style='text-align:center'></input></td><td style='text-align:center'>" + Empid + "</td><td><span href='#' id='show-popup' class='action-b'>" + ResourceName + "<div class='action-b-view'><a href='../SitePages/ResourceProjectInformation.aspx?employeeID=" + Empid + "&employeename=" + ResourceName + "' target='_blank' style='color:#337ab7'>Project Detail</a><a href='../SitePages/ViewProfile.aspx?employeeID=" + Empid + "&employeename=" + ResourceName + "' target='_blank' style='color:#337ab7'>View Profile</a></div></span>" + BusinessDaysCount + "</td><td style='text-align:center'>" + AllocationPerCent + "</td><td style='text-align:center'>" + StartDate + "</td><td style='text-align:center'>" + FinishDate + "</td><td style='display:none'>" + diffDays + "</td><td style='display:none'>"+ProjectLocation+"+"+ReasonForRejection+"+"+InternalID+"</td></tr>";
								row = "<tr id=" + CountVal + " style='opacity:0.5'><td style='text-align:center'>" + Empid + "</td><td><span href='#' id='show-popup' class='action-b'>" + ResourceName + "<div class='action-b-view'><a href='../SitePages/ResourceProjectInformation.aspx?employeeID=" + Empid + "&employeename=" + ResourceName + "' target='_blank' style='color:#337ab7'>Project Detail</a><a href='../SitePages/ViewProfile.aspx?employeeID=" + Empid + "&employeename=" + ResourceName + "' target='_blank' style='color:#337ab7'>View Profile</a></div></span>" + BusinessDaysCount + "</td><td style='text-align:center'>" + AllocationPerCent + "</td><td style='text-align:center'>" + StartDate + "</td><td style='text-align:center'>" + FinishDate + "</td><td style='display:none'>" + diffDays + "</td><td style='display:none'>"+ProjectLocation+"+"+ReasonForRejection+"+"+InternalID+"</td></tr>";
								$('#tblResourcePedingRelease > tbody').append(row);
								//to hide the action column 
								//$("#tblResourcePedingRelease th:nth-child(1),#tblResourcePedingRelease td:nth-child(1)").css("display", "none");
                            }
						}
					//if default view i.e., on page load and Allocation Ending in Next 15 Days option is selected in view resource drop down	
                  else
				  {
				  if (diffDays <= 15 && Enddate > CurDate)
                   {
                    var row = "";
                    if (EmpiDVal == "true")
                    {
						
                            row = "<tr id=" + CountVal + " style='opacity:0.5'><td class='ToHideOnView' style='text-align:center'><input type='checkbox' name='Resources' class='chckResourceRelease' onchange='valueChanged()' disabled='disabled' style='text-align:center'></input></td><td style='text-align:center'>" + Empid + "</td><td><span href='#' id='show-popup' class='action-b'>" + ResourceName + "<div class='action-b-view'><a href='../SitePages/ResourceProjectInformation.aspx?employeeID=" + Empid + "&employeename=" + ResourceName + "' target='_blank' style='color:#337ab7'>Project Detail</a><a href='../SitePages/ViewProfile.aspx?employeeID=" + Empid + "&employeename=" + ResourceName + "' target='_blank' style='color:#337ab7'>View Profile</a></div></span>" + BusinessDaysCount + "</td><td style='text-align:center'>" + AllocationPerCent + "</td><td style='text-align:center'>" + StartDate + "</td><td style='text-align:center'>" + FinishDate + "</td><td style='display:none'>" + diffDays + "</td><td style='display:none'>"+ProjectLocation+"+"+ReasonForRejection+"+"+InternalID+"</td></tr>"; 

						 $('#tblResourceRelease > tbody').append(row);

                    }
                    
                    CountVal++;
             
					}
				  }
				}
			}
			
			//if user request is not there in the list
           else
		  {
                Usrval = "false";
				EmpiDVal=Usrval;
				
				//If all option is selected in the view resource dropdown
				if (ViewVal == 3)
                    {
				  if ((EmpiDVal == "false"))
                    {
						 AllRowData = "<tr id=" + CountVal + "><td class='ToHideOnView' style='text-align:center'><input type='checkbox' name='Resources' class='chckResourceRelease' onchange='valueChanged()' style='text-align:center'></input></td><td style='text-align:center'>" + Empid + "</td><td><span href='#' id='show-popup' class='action-b'>" + ResourceName + "<div class='action-b-view'><a href='../SitePages/ResourceProjectInformation.aspx?employeeID=" + Empid + "&employeename=" + ResourceName + "' target='_blank' style='color:#337ab7'>Project Detail</a><a href='../SitePages/ViewProfile.aspx?employeeID=" + Empid + "&employeename=" + ResourceName + "' target='_blank' style='color:#337ab7'>View Profile</a></div></span></td><td style='text-align:center'>" + AllocationPerCent + "</td><td style='text-align:center'>" + StartDate + "</td><td style='text-align:center'>" + FinishDate + "</td><td style='display:none'>" + diffDays + "</td><td style='display:none'>"+ProjectLocation+"+"+ReasonForRejection+"+"+InternalID+"</td></tr>"; 
					}
					  AllvalRow += AllRowData+';';
					 
					}

					//if default view i.e., on page load and Allocation Ending in Next 15 Days option is selected in view resource drop down
					else
					{

		         if (diffDays <= 15 && Enddate > CurDate)
                {
   
                    if (EmpiDVal == "false")
                    {
                        if (ViewVal != 1)
                        {
  
                            row = "<tr id=" + CountVal + "><td class='ToHideOnView' style='text-align:center'><input type='checkbox' name='Resources' class='chckResourceRelease' onchange='valueChanged()' style='text-align:center'></input></td><td style='text-align:center'>" + Empid + "</td><td><span href='#' id='show-popup' class='action-b'>" + ResourceName + "<div class='action-b-view'><a href='../SitePages/ResourceProjectInformation.aspx?employeeID=" + Empid + "&employeename=" + ResourceName + "' target='_blank' style='color:#337ab7'>Project Detail</a><a href='../SitePages/ViewProfile.aspx?employeeID=" + Empid + "&employeename=" + ResourceName + "' target='_blank' style='color:#337ab7'>View Profile</a></div></span></td><td style='text-align:center'>" + AllocationPerCent + "</td><td style='text-align:center'>" + StartDate + "</td><td style='text-align:center'>" + FinishDate + "</td><td style='display:none'>" + diffDays + "</td><td style='display:none'>"+ProjectLocation+"+"+ReasonForRejection+"+"+InternalID+"</td></tr>"; 
						}
                    }

                        $('#tblResourceRelease > tbody').append(row);

						//to show the action column if hidden 
					if(ViewVal!=3 && ViewVal!=1)
					{
					  $("#tblResourceRelease th:nth-child(1),#tblResourceRelease td:nth-child(1)").css("display", "");
					}
                    CountVal++;
                }
					}
		  }
             
			
		},
        error: function(error)
        {
            result = 'error';
        }
    });
				  
            }
        },
        error: function(error)
        {
            result = 'error';
        }
    });
	
	//to intialize the table
			if(ViewVal != 3&&ViewVal != 1)
			{
				 $('#tblResourceRelease').DataTable(
                {
                    "aLengthMenu": [5, 10, 15, 20, 25, 30],
                    "pageLength": 5,
					"autoWidth":true,  
					 "paging":true,  
					 
					"columns": [ { "width": "50px" }, 
					{ "width": "100px" }, 
					{ "width": "350px" }, 
					{ "width": "76px" },
					{ "width": "120px" },
					{ "width": "120px" },
					{ "width": "120px" },					
					{ "width": "120px" } ]
                });
                $('#tblResourceRelease tfoot th').each(function()
                {
                    var title = $(this).text();
                    if (title != "")
                    {
                        $(this).html('<input type="text"/>'); 
                    }
                });
                var table = $('#tblResourceRelease').DataTable();
       
                table.columns().every(function()
                {
                    var that = this;
                    $('input', this.footer()).on('keyup change', function()
                    {
                        if (that.search() !== this.value)
                        {
                            that.search(this.value).draw();
                        }
                    });
                });				
			}
			if(ViewVal == 1)
			{
			
				 $('#tblResourcePedingRelease').DataTable(
                {
                    "aLengthMenu": [5, 10, 15, 20, 25, 30],
                    "pageLength": 5,
					"autoWidth": false,
					"columns": [ { "width": "100px" }, 
					{ "width": "350px" }, 
					{ "width": "90px" }, 
					{ "width": "120px" },
					{ "width": "120px" },
					{ "width": "120px" },	
					{ "width": "120px" } ]
                });
                $('#tblResourcePedingRelease tfoot th').each(function()
                {
                    var title = $(this).text();
                    if (title != "")
                    {
                        $(this).html('<input type="text"/>'); 
                    }
                });
                var table = $('#tblResourcePedingRelease').DataTable();
       
                table.columns().every(function()
                {
                    var that = this;
                    $('input', this.footer()).on('keyup change', function()
                    {
                        if (that.search() !== this.value)
                        {
                            that.search(this.value).draw();
                        }
                    });
                });				
			}
	 
			if(ViewVal==3)
				{
					return AllvalRow;
				}
				
				 $('.loader').hide();
		}
		
		
	function GetItemTypeForListName(name) {
	return "SP.Data." + name.charAt(0).toUpperCase() + name.split(" ").join("").slice(1) + "ListItem";
	}

	
//function to get reource email id by its resource GUID
function GetUserIDbyGuid(ResGUID)
{
	var Id="";
	
	//Refer ReleaseExtensionConfig.js file
	var url=GetResourceDataByEmpCode(ResGUID,3);
	
	
	  $.ajax({
				url: url,
				async: false,
				method: "GET",
				headers: {
					"Accept": "application/json; odata=verbose",
					"Content-Type": "application/json; odata=verbose"
				},
				success: function (data) {
					var data=data.d;
					var ResourceEmailID=data.ResourceEmailAddress;
					Id=GetSpIDByEmailID(ResourceEmailID);
					
				},
				error: function (error) {
					result = 'error';
				}
			});
        return Id;
}

//function to get reource SP id by its Email id
function GetSpIDByEmailID(ResEmailID)
{
	var SPid="";
	
	//Refer ReleaseExtensionConfig.js file
	var url=GetSpidByResEmailID(ResEmailID);
	
	
	  $.ajax({
				url: url,
				async: false,
				method: "GET",
				headers: {
					"Accept": "application/json; odata=verbose",
					"Content-Type": "application/json; odata=verbose"
				},
				success: function (data) {
					var data=data.d.results;
					Spid=data[0].Id;
					
				},
				error: function (error) {
					result = 'error';
				}
			});
	     return Spid;
}

//function to get Resource VP by its GBU
function GetResVPByResGBU(ResGBU)
{
	//Refer ReleaseExtensionConfig.js file
	var url=GetResourseVpByGBU(ResGBU);
	
	$.ajax({
				url: url,
				async: false,
				method: "GET",
				headers: {
					"Accept": "application/json; odata=verbose",
					"Content-Type": "application/json; odata=verbose"
				},
				success: function (data) {
					var data=data.d.results;
					var EmpEmailId=data[0].VpEmailID;
	
			//Refer ReleaseExtensionConfig.js file		
		  var url=GetResourceIDByEmailIDorEmpID(EmpEmailId,1)
	
			
			    $.ajax({
				url: url,
				async: false,
				method: "GET",
				headers: {
					"Accept": "application/json; odata=verbose",
					"Content-Type": "application/json; odata=verbose"
				},
				success: function (data) {
					var data=data.d.results;
					
					VPID=data[0].ResourceId;
					
				},
				error: function (error) {
					result = 'error';
				}
			});
			
				},
				error: function (error) {
					result = 'error';
				}
			});	
}

//function to get RMO id by its Emp id
function GetRMoIDByRmoEid(RMOEid)
{
	//Refer ReleaseExtensionConfig.js file		
      var url=GetResourceIDByEmailIDorEmpID(RMOEid,2)
	
			
			    $.ajax({
				url: url,
				async: false,
				method: "GET",
				headers: {
					"Accept": "application/json; odata=verbose",
					"Content-Type": "application/json; odata=verbose"
				},
				success: function (data) {
					var data=data.d.results;
					
					RMOID=data[0].ResourceId;
				},
				error: function (error) {
					result = 'error';
				}
			});	
}

//Function for Release comment box Validation on 'onkeyup' 
function CommentBoxValiddtion(commentID)
{
	
	commentID=commentID.id;
	 var comment = document.getElementById(commentID).value;
	 
	  if(comment=='')
				  {
					$('#CommentBoxErrorMsg').text('Please provide reason for early release');
					$('#comment').focus();
					return false;
				 }
	 
        var match = (new RegExp('[~#%\&{}+\|]|\\.\\.|^\\.|\\.$')).test(comment);
        if (match) {
    
            document.getElementById("CommentBoxErrorMsg").innerHTML = "Comment contains invalid character";
    
            document.getElementById(commentID).focus();
            return false;
        } else {
    
            document.getElementById("CommentBoxErrorMsg").innerHTML = "";

		}
}

//function to bind the reason for reason for release drop down
function BindReason(){

//Refer ReleaseExtensionConfig.js file	
  var url = GetReasonForRelease();
  
        $.ajax({
            url: url,
            method: "GET",
            async: false,
            headers: { "Accept": "application/json; odata=verbose" },
            success: function (data) {
                $('#ddlReleaseReason').empty();
                var parentReason = [];
                var parentFlag = [];
                var childReason = [];
                var childFlag = [];
                $('#ddlReleaseReason').append(new Option("Select Reason of Release", 0));
                $.each(data.d.results, function (index, value) {

                    if (value.Flag.indexOf('Item') >= 0) {
                        childReason.push(value.ReasonHead);
                        childFlag.push(value.Flag);
                    } else {
                        parentReason.push(value.ReasonHead);
                        parentFlag.push(value.Flag);
                    }
                });
                for (var i = 0; i < parentReason.length; i++) {
                    $('#ddlReleaseReason').append("<optgroup label = '" + parentReason[i] + "'>" + parentFlag[i] + "</optgroup>");
                    for (var j = 0; j < childReason.length; j++) {
                        if (childFlag[j].indexOf(parentFlag[i]) >= 0) {
                            $('#ddlReleaseReason').append("<option data-value = '" + childFlag[j] + "'>" + childReason[j] + "</option>");
                        }
                    }
                }
            }

        });
}

//function to get the selected value from the reason for release dropdown
function GetSelectedValue()
{
	var SelectedValue=$('#ddlReleaseReason').val();
	
	if($('#ddlReleaseReason').val()=="0")
	{
		$('#DDlCommentBoxErrorMsg').text('Please select reason for early release');
		return false;
	}
	else
	{
		$('#DDlCommentBoxErrorMsg').text('');
	}
	if(SelectedValue=="Additional Comments")
	{		
		$('#comment').attr('disabled',false);
	}
	else
	{
		$('#comment').attr('disabled',true);
	}
	RejectionComments=SelectedValue;
}

//function on onchange of view resource drodown
function BindData()
{
	Clear();
	var ViewSelectedValue=$('#ddlView').val();
	
	if(ViewSelectedValue=="Pending for Release")
	{
		$('.loader').show();
						setTimeout(function () {
		ViewVal=1;	
		$('#tblResourceRelease').dataTable().fnClearTable();
		$('#tblResourceRelease').DataTable().destroy();
		
		$('#tblResourcePedingRelease').dataTable().fnClearTable();
        $('#tblResourcePedingRelease').DataTable().destroy();
		
		$('#tblResourceRelease').css('display','none');
		$('#tblResourcePedingRelease').css('display','');
		
		GetProjectCode(userid,puid);
		}, 100);
	}
	else if(ViewSelectedValue=="Approved")
	{
			$('.loader').show();
						setTimeout(function () {
		$('#tblResourceRelease').dataTable().fnClearTable();
        $('#tblResourceRelease').DataTable().destroy();	
		
		$('#tblResourcePedingRelease').dataTable().fnClearTable();
        $('#tblResourcePedingRelease').DataTable().destroy();
		
		$('#tblResourceRelease').css('display','');
		$('#tblResourcePedingRelease').css('display','none');
		ViewVal=2;
        GetApprovedData(puid);
		}, 100);
	}
	else if(ViewSelectedValue=="All")
	{
			$('.loader').show();
						setTimeout(function () {	
		 $('#tblResourceRelease').dataTable().fnClearTable();
        $('#tblResourceRelease').DataTable().destroy();
		
		$('#tblResourcePedingRelease').dataTable().fnClearTable();
        $('#tblResourcePedingRelease').DataTable().destroy();
		
		$('#tblResourceRelease').css('display','');
		$('#tblResourcePedingRelease').css('display','none');
		ViewVal=3;
		var GetRows=GetPojectData(CurProjectCode);
		GetApprovedData(puid,GetRows);
		}, 100);
	}
	else if(ViewSelectedValue=="Default")
	{
	$('.loader').show();
						setTimeout(function () {
		$('#tblResourceRelease').dataTable().fnClearTable();
		$('#tblResourceRelease').DataTable().destroy();
		
		$('#tblResourcePedingRelease').dataTable().fnClearTable();
        $('#tblResourcePedingRelease').DataTable().destroy();
		
		$('#tblResourceRelease').css('display','');
		$('#tblResourcePedingRelease').css('display','none');
		
		ViewVal = 0;
		GetPojectData(CurProjectCode);
		}, 100);
	}
}

//function when the approved/rejected option is selected in the view resource dropdown
function GetApprovedData(puid,RequestdataRows)
{
	var CountVal=1;
	var Apprvdrow="";

	if(ViewVal==2)
	{	
//Refer ReleaseExtensionConfig.js file
		var url=GetApprovedDataFromSPList(puid,1);
	
	var months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	
	 $.ajax({
				url: url,
				async: false,
				method: "GET",
				headers: {
					"Accept": "application/json; odata=verbose",
					"Content-Type": "application/json; odata=verbose"
				},
				success: function (data) {
					var aprvddata=data.d.results;
					for(var i=0;i<aprvddata.length;i++)
					{
						var ID=aprvddata[i].ID;
						
						//Refer ReleaseExtensionConfig.js file
						var DataURL=GetApprovedDataFromSPList(ID,3);
						
						 $.ajax({
						url: DataURL,
						async: false,
						method: "GET",
						headers: {
							"Accept": "application/json; odata=verbose",
							"Content-Type": "application/json; odata=verbose"
						},
						success: function (data) {
						var Apprvdata=data.d.results;
						for(var i=0;i<Apprvdata.length;i++)
						{
							
							var StartDate=(Apprvdata[i].NewStartDate==undefined?"":Apprvdata[i].NewStartDate.split('T')[0]);
							if(StartDate!="")
							{
							StartDate=StartDate.split('-')[2]+" "+months[StartDate.split('-')[1]-1]+" "+StartDate.split('-')[0];
							}
							var ApprovedEndDate="";
							var EndDate="";
							var ItemID=Apprvdata[i].ID;
							var Type=Apprvdata[i].ResourceType==undefined?'':Apprvdata[i].ResourceType;
                            var ApprvStatus = Apprvdata[i].ApprovalStatus;
							
							var CurDate=new Date();
							var ApprvRequest_EndDate="";
							
							if(Type=="Resource Early Release")
							{
								if(ApprvStatus=="Approved")
								{
								ApprovedEndDate=(Apprvdata[i].NewReleaseDate==undefined?"":Apprvdata[i].NewReleaseDate.split('T')[0]);
								if(ApprovedEndDate!="")
								{
								ApprovedEndDate=ApprovedEndDate.split('-')[2]+" "+months[ApprovedEndDate.split('-')[1]-1]+" "+ApprovedEndDate.split('-')[0];
								}
								}
								else
									if(ApprvStatus=="Rejected")
									{
									
										EndDate=(Apprvdata[i].NewEndDate==undefined?"":Apprvdata[i].NewEndDate.split('T')[0]);
										if(EndDate!="")
									{
										EndDate=EndDate.split('-')[2]+" "+months[EndDate.split('-')[1]-1]+" "+EndDate.split('-')[0];
								    }
								}
							}
							else
							if(Type=="Resource Extension")
							{
								if (ApprvStatus == "Approved")
								{
									ApprovedEndDate = (Apprvdata[i].NewExtensionDate == undefined ? "" : Apprvdata[i].NewExtensionDate.split('T')[0]);
									if(ApprovedEndDate!="")
									{
									ApprovedEndDate = ApprovedEndDate.split('-')[2] + " " +months[ApprovedEndDate.split('-')[1]-1] + " " + ApprovedEndDate.split('-')[0];
									ApprvRequest_EndDate=new Date(ApprovedEndDate);
									}
								}
							}
						
							var EmpID=(Apprvdata[i].EmployeeID==undefined?"":Apprvdata[i].EmployeeID);
							
						
							var EmpName=(Apprvdata[i].ResourceName==undefined?"":Apprvdata[i].ResourceName);
							var AllocationPercent=(Apprvdata[i].AllocationPercentage==undefined?"":Apprvdata[i].AllocationPercentage);
							
							if(ApprvStatus=="Approved")
							{
								if(CurDate>ApprvRequest_EndDate)
								{
									Apprvdrow = "<tr id=" + CountVal + "  style='opacity:0.5'><td class='ToHideOnView' style='text-align:center'><input type='checkbox' name='Resources' class='chckResourceRelease' onchange='valueChanged()' disabled='disabled' style='text-align:center'></input></td><td style='text-align:center'>" + EmpID + "</td><td><span href='#' id='show-popup' class='action-b'>" + EmpName + "<div class='action-b-view'><a href='../SitePages/ResourceProjectInformation.aspx?employeeID=" + EmpID + "&employeename=" + EmpName + "' target='_blank' style='color:#337ab7'>Project Detail</a><a href='../SitePages/ViewProfile.aspx?employeeID=" + EmpID + "&employeename=" + EmpName + "' target='_blank' style='color:#337ab7'>View Profile</a></div></span></td><td style='text-align:center'>" + AllocationPercent + "</td><td style='text-align:center'>" + StartDate + "</td><td style='text-align:center'>" + ApprovedEndDate + "</td><td style='display:none'></td><td style='display:none'></td></tr>";
								}
								else
								{
									Apprvdrow = "<tr id=" +CountVal+ "><td class='ToHideOnView' style='text-align:center'><input type='checkbox' name='Resources' class='chckResourceRelease' onchange='valueChanged()' style='text-align:center'></input></td><td style='text-align:center'>" + EmpID + "</td><td><span href='#' id='show-popup' class='action-b'>" + EmpName + "<div class='action-b-view'><a href='../SitePages/ResourceProjectInformation.aspx?employeeID=" + EmpID + "&employeename=" + EmpName + "' target='_blank' style='color:#337ab7'>Project Detail</a><a href='../SitePages/ViewProfile.aspx?employeeID=" + EmpID + "&employeename=" + EmpName + "' target='_blank' style='color:#337ab7'>View Profile</a></div></span></td><td style='text-align:center'>" + AllocationPercent + "</td><td style='text-align:center'>" +StartDate+ "</td><td style='text-align:center'>" + ApprovedEndDate + "</td><td style='display:none'></td><td style='display:none'></td></tr>";
								}
							}
							if(Type=="Resource Early Release")
							{							
							if(ApprvStatus=="Rejected")
							{
								var ReasonForRejection=Apprvdata[i].ReasonForReject==""?'':Apprvdata[0].ReasonForReject.split('>')[1].split('<')[0];
							
								Apprvdrow = "<tr id=" + CountVal + "><td class='ToHideOnView' style='text-align:center'><div><div class='tooltip-1' onclick='GetRequestRejectedReason(this,"+ItemID+")'><span class='glyphicon glyphicon-remove-sign' aria-hidden='true' style='text-align:center'></span><div class='tooltiptext-1' style='width:120px'>Reason for Rejection</div></div></div></td><td style='text-align:center'>" + EmpID + "</td><td><span href='#' id='show-popup' class='action-b'>" + EmpName + "<div class='action-b-view'><a href='../SitePages/ResourceProjectInformation.aspx?employeeID=" + EmpID + "&employeename=" + EmpName + "' target='_blank' style='color:#337ab7'>Project Detail</a><a href='../SitePages/ViewProfile.aspx?employeeID=" + EmpID + "&employeename=" + EmpName + "' target='_blank' style='color:#337ab7'>View Profile</a></div></span></td><td style='text-align:center'>" + AllocationPercent + "</td><td style='text-align:center'>" + StartDate + "</td><td style='text-align:center'>" + EndDate + "</td><td style='display:none'></td><td style='display:none'>"+ReasonForRejection+"</td></tr>"; 
							}
							}

						$('#tblResourceRelease > tbody').append(Apprvdrow);
						$("#tblResourceRelease th:nth-child(1),#tblResourceRelease td:nth-child(1)").css("display", "");
					    CountVal++;
					}
					
				},
				error: function (error) {
					result = 'error';
				}
			});
		}
		var RowData="";
		
		//table intialization for approved/rejected option
		if(ViewVal==2)
		{
			$("#tblResourceRelease th:nth-child(1),#tblResourceRelease td:nth-child(1)").css("display", "");
			$('#tblResourceRelease').DataTable({
			"aLengthMenu": [5,10, 15, 20, 25, 30 ],
			"pageLength": 5,
			"columns": [ { "width": "50px" }, 
					{ "width": "100px" }, 
					{ "width": "300px" }, 
					{ "width": "76px" },
					{ "width": "127px" },
					{ "width": "127px" },
					{ "width": "127px" },	
					{ "width": "120px" } ]
			});

			$('#tblResourceRelease tfoot th').each(function () 
			{
				var title = $(this).text();
				if (title != "") 
				{
					$(this).html('<input type="text"/>');
				}
			});
			var table = $('#tblResourceRelease').DataTable();

			
			table.columns().every(function ()
			{
				var that = this;
				$('input', this.footer()).on('keyup change', function ()
				{
					if (that.search() !== this.value) {
					that
					.search(this.value)
					.draw();
					}
				});
			});
		}
			
	},
	error: function (error) {
	result = 'error';
	}
	});
	}
	var RowData="";
	//table intialization for all option
		if(ViewVal==3)
		{
			var RowData=RequestdataRows.split(';');

			for(var j=0;j<RowData.length-1;j++)
			{
				$('#tblResourceRelease > tbody').append(RowData[j]);
				$("#tblResourceRelease th:nth-child(1),#tblResourceRelease td:nth-child(1)").css("display","");
			}
			$("#tblResourceRelease th:nth-child(1),#tblResourceRelease td:nth-child(1)").css("display", "");
			$('#tblResourceRelease').DataTable({
			"aLengthMenu": [5,10, 15, 20, 25, 30 ],
			"pageLength": 5,
			 "columns": [ { "width": "50px" }, 
					{ "width": "100px" }, 
					{ "width": "300px" }, 
					{ "width": "76px" },
					{ "width": "127px" },
					{ "width": "127px" },
					{ "width": "127px" },	
					{ "width": "120px" } ]
				
			});

			$('#tblResourceRelease tfoot th').each(function () 
			{
				var title = $(this).text();
				if (title != "") 
				{
					$(this).html('<input type="text"/>'); 
				}
			});
			var table = $('#tblResourceRelease').DataTable();

			
			table.columns().every(function ()
			{
				var that = this;
				$('input', this.footer()).on('keyup change', function ()
				{
					if (that.search() !== this.value) {
					that
					.search(this.value)
					.draw();
					}
				});
			});
			}
			$('.loader').hide();
}

//Function to refer RRFMAPPING list for the TAT Days by its status
function getRRFTATdaysbyStatus(status)
{
	var status_TATMappingDays = "";
	
	//Refer ReleaseExtensionConfig.js file
	var restResoruceAllocation=TaTDates(status);

	$.ajax
		({
		url: restResoruceAllocation,
		method: "GET",
		async: false,
		headers: { "Accept": "application/json; odata=verbose" },
		success: function (data)
		{
			status_TATMappingDays = data.d.results;
		}
	});
    return status_TATMappingDays;
}

//funtion to get the reason for reject by on hove on the X in table rows
function GetRequestRejectedReason(val,ID)
{
var CurRow=val.parentNode.parentNode.parentNode;
var Reason=CurRow.cells[7].innerText;
	$('.popup-bg').show();
	$('#AlertmsgDiv').css('display', 'none');
	$('#AuthenticateDiv').css('display', 'none');
	$('#OnButtonCancel').css('display','none');
	$('#spnCancelMessage').css('display','none');
	
			$('#InvaildUser').css('display','none');
				$('#Approve').css('display','none');
				$('#Rejection').css('display','');
				$('#Cancel').css('display','none');
				
	$('#CmntReasonForRejection').css('display', '');
	$('#spnReasonForRejection').css('display', '');
	$('#spnReasonForRejection').text(Reason);
}

//function for feedback validation
 function FeedBackBoxValiddtion(feedbackID)
{
	
	feedbackID=feedbackID.id;
	 var feedback = document.getElementById(feedbackID).value;
	 
	  if(feedback=='')
				  {
					$('#FeedBackBoxErrorMsg').text('Please enter Project End Feedback');
					$('#Feedback').focus();
					return false;
				 }
	 
        var match =/[*|\":<>[\]{}`\\()';@&$]/; 
		
        if (match.test(feedback)) {
        
            document.getElementById("FeedBackBoxErrorMsg").innerHTML = "Project End Feedback contains invalid character";
        
            document.getElementById(feedbackID).focus();
            return false;
        } else {
        
            document.getElementById("FeedBackBoxErrorMsg").innerHTML = "";

		}
}

function Clear()
{
					$('#txtReleaseDate')[0].value="";
					$('#ErrorMsg')[0].innerText="";
					$('#comment')[0].value="";
					$('#CommentBoxErrorMsg')[0].innerText="";
					$("#panel").slideUp("slow").hide();
				

}