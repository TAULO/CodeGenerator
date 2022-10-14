$(document).ready(function() {
	var url = $(location).attr('href');
	var result = url.split('/'); 
        //alert(result); 
	var iamCurrentPageName=	result['5'];    
	//alert(iamCurrentPageName);                   
		$("#frm_prj_reg").validate({               
            rules: {           
				transaction_id:{get_PaymentTransactionIDComplaintExist1:true},
				project_declaration:  {required: true},
				project_declaration_documents:  {required: true},
				promoter_name: {required: true},
                                promoter_pan: {required: true},   
                                promoter_email: {required: true,email: true},
                                promoter_mobile: {required: true,digits:true,minlength: 10,maxlength: 10},
				promoter_aadhaar: {digits:true,minlength: 12,maxlength: 12},
				          
				promoter_photo:{extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',filesize:52428800},
				promoter_aadhaar_copy:{extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',filesize:52428800},
				promoter_company_registration_copy:{extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',filesize:52428800},
				promoter_pan_copy:{extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',filesize:52428800},
				promoter_balance_sheet:{extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',filesize:78643200},
				promoter_itax_return:{extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',filesize:52428800},
				promoter_parent_annual_returns:{extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',filesize:52428800},
				project_ownership_document:{extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',filesize:52428800},
				//fee_calculation_sheet:{extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',filesize:52428800},
				pass_book_front_page:{extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',filesize:52428800},
				pexist_modified_sanctioned_plan:{extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',filesize:52428800},
				pexist_modified_layout_plan:{extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',filesize:52428800},
				pexist_modified_project_specifications:{extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',filesize:52428800},
				pexist_project_balance_sheet:{extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',filesize:52428800},
				pexist_project_status:{extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',filesize:52428800},
				pexist_project_apt_cpt_area:{extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',filesize:52428800},
				pexist_plotted_development:{extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',filesize:52428800},
				affidavit_cum_declaration:{extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',filesize:52428800},
				engr_certificate:{extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',filesize:52428800}, 
				authorized_letter:{extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',filesize:52428800}, 
				ca_certificate:{extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',filesize:52428800},
				estimated_cost_of_construction:{number:true},   
				estimated_cost_of_land:{number:true}, 
				estimated_balance_cost_for_completion:{number:true}, 
				pexist_construction_period:{number:true}, 
				registration_fee:{number:true}, 
				'pp_total_constructed_area[]':{number:true},
				'pp_total_constructed_unit[]':{number:true},    
				'partner_photo[]':{extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',filesize:52428800},
				'partner_aadhaar_copy[]':{extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',filesize:52428800},
				'partner_pan_copy[]':{extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',filesize:52428800},
				'particulars_of_registration[]':{extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',filesize:52428800},
				'encumbrances_on_land[]':{extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',filesize:52428800},
				'consent_land_owner[]':{extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',filesize:52428800},
				'approval_town_country_planning[]':{extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',filesize:52428800},
				'building_permission_authority[]':{extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',filesize:52428800},
				'nazul_clearance_case[]':{extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',filesize:52428800},
				'environmental_clearance[]':{extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',filesize:52428800},
				'sanctioned_plan[]':{extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',filesize:52428800},
				'sanction_layout_plan[]':{extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',filesize:52428800},
				'sanction_building_plan[]':{extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',filesize:52428800},
				'project_specifications[]':{extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',filesize:52428800},
				'development_work_plan[]':{extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',filesize:52428800},
				'proforma_proposed[]':{extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',filesize:52428800},
				'apartment_details[]':{extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',filesize:52428800},
				'garage_details[]':{extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',filesize:52428800},
				'parking_details[]':{extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',filesize:52428800},
				'stilt_base_parking[]':{extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',filesize:52428800},
				'open_parking[]':{extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',filesize:52428800},
				'common_area_facilities[]':{extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',filesize:52428800},
				'agent_details[]':{extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',filesize:52428800},
				'development_team_details[]':{extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',filesize:52428800},
				captcha_code: "required"                    
            },
            messages: {
				transaction_id:{get_PaymentTransactionIDComplaintExist1:"Invalid transaction id"},    
				project_declaration:{required: "Please check Declaration"},
				project_declaration_documents:{required: "Please check Declaration"},
				promoter_type: {required:"Please select Applicant Type"},
                                promoter_name: {required:"Please enter Name"},
                                promoter_pan: {required:"Please enter PAN Number"},   
                promoter_email: {required: "Please enter Email",email: "Please enter valid email"},
                promoter_mobile: {required: "Please enter Mobile Number",digits:"Please enter Number Only",minlength: "Minimum Length Of Mobile Number Is 10",maxlength:"Maximum Length Of Mobile Number Is 10"},
				promoter_aadhaar: {digits:"Please enter Number Only",minlength: "Minimum Length Of Aadhaar Number Is 12",maxlength:"Maximum  Length Of Aadhaar Number Is 12"},
				promoter_photo:{extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"},
				promoter_aadhaar_copy:{extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"},
				promoter_company_registration_copy:{extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"},
				promoter_pan_copy:{extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"},
				promoter_balance_sheet:{extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"},
				promoter_itax_return:{extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"},
				promoter_parent_annual_returns:{extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"},
				project_ownership_document:{extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"},
				//fee_calculation_sheet:{extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"},
				pass_book_front_page:{extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"},
				pexist_modified_sanctioned_plan:{extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"},
				pexist_modified_layout_plan:{extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"},
				pexist_modified_project_specifications:{extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"},
				pexist_project_balance_sheet:{extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"},
				pexist_project_status:{extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"},
				pexist_project_apt_cpt_area:{extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"},
				pexist_plotted_development:{extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"},
				affidavit_cum_declaration:{extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"},
				engr_certificate:{extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}, 
				authorized_letter:{extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"},                 
				ca_certificate:{extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"},
				estimated_cost_of_construction:{number:"Please enter number only"},
				estimated_cost_of_construction:{number:"Please enter number only"},   
				estimated_cost_of_land:{number:"Please enter number only"}, 
				estimated_balance_cost_for_completion:{number:"Please enter number only"},      
				pexist_construction_period:{number:"Please enter number only"}, 
				registration_fee:{number:"Please enter number only"},  
				'pp_total_constructed_area[]':{number:"Please enter number only"},   
				'pp_total_constructed_unit[]':{number:"Please enter number only"},    
				'partner_photo[]':{extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"},
				'partner_aadhaar_copy[]':{extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"},
				'partner_pan_copy[]':{extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"},
				'particulars_of_registration[]':{extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"},
				'encumbrances_on_land[]':{extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"},
				'consent_land_owner[]':{extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"},
				'approval_town_country_planning[]':{extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"},
				'building_permission_authority[]':{extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"},
				'nazul_clearance_case[]':{extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"},
				'environmental_clearance[]':{extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"},
				'sanctioned_plan[]':{extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"},
				'sanction_layout_plan[]':{extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"},
				'sanction_building_plan[]':{extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"},
				'project_specifications[]':{extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"},
				'development_work_plan[]':{extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"},
				'proforma_proposed[]':{extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"},
				'apartment_details[]':{extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"},
				'garage_details[]':{extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"},       
				'parking_details[]':{extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"},
				'stilt_base_parking[]':{extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"},
				'open_parking[]':{extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"},
				'common_area_facilities[]':{extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"},
				'agent_details[]':{extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"},
				'development_team_details[]':{extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"},  
               captcha_code: "Please enter security code"
            },
            submitHandler: function() {
                // Show full page LoadingOverlay
                $.LoadingOverlay("show");
                $("#project_submit").prop('disabled', true);
				$("#saveMyDetailes").prop('disabled', true);
				$("#project_cancel").prop('disabled', true);
                form.submit();
            }    
        });    
		$('#saveMyDetailes').click(function () {
			
			if(iamCurrentPageName=="project-registration")
			{ 
				$('[name="iamAlreadyRegisteredPanNumber"],[name="iamAlreadyRegisteredMobileNumber"]').each(function () {
					$(this).rules('remove');
					$(this).removeClass('error');
				});     
			}   
			
			$('[name="promoter_type"], [name="promoter_father"], [name="proprietorship_name"], [name="promoter_photo"], [name="promoter_address"], [name="promoter_aadhaar"], [name="promoter_aadhaar_copy"], [name="promoter_pan_copy"], [name="promoter_balance_sheet"], [name="promoter_itax_return"], [name=" promoter_company_registration_copy"], [name="partner_name[]"], [name="partner_photo[]"], [name="partner_address[]"], [name="partner_aadhaar[]"], [name="partner_aadhaar_copy[]"], [name="partner_pan[]"], [name="partner_pan_copy[]"], [name="partner_email[]"], [name="partner_mobile[]"], [name="previous_project_name[]"], [name="previous_project_address[]"], [name="pp_total_constructed_area[]"], [name="pp_total_constructed_unit[]"], [name="previous_project_start_date[]"], [name="previous_project_end_date[]"], [name="pp_completion_certificate_date[]"], [name="previous_project_status[]"], [name="project_type"],[name="project_district_code"], [name="project_tehsil_id"], [name="project_planning_area"], [name="project_address"], [name="project_ownership_details"], [name="project_ownership_document"], [name="external_dev_agency"], [name="registration_fee"], [name="payment_date"], [name="proposed_period_month"], [name="estimated_cost_of_construction"], [name="estimated_cost_of_land"], [name="estimated_balance_cost_for_completion"], [name="proposed_start_date"], [name="pexist_actual_start_date"], [name="pexist_construction_period"], [name="pexist_on_schedule"], [name="pexist_delay_reason"], [name="pexist_construction_status"], [name="pexist_stalled_reason"], [name="proposed_end_date"], [name="transaction_id"], [name="bank_acct_no"], [name="bank_acct_name"], [name="bank_name"], [name="bank_ifsc_code"], [name="bank_branch_name"], [name="bank_branch_address"], [name="pass_book_front_page"], [name="particulars_of_registration[]"], [name="encumbrances_on_land[]"], [name="consent_land_owner[]"], [name="approval_town_country_planning[]"], [name="building_permission_authority[]"], [name="nazul_clearance_case[]"], [name="sanctioned_plan[]"], [name="sanction_layout_plan[]"], [name="sanction_building_plan[]"], [name="development_work_plan[]"], [name="proforma_proposed[]"], [name="apartment_details[]"], [name="agent_details[]"], [name="parking_details[]"], [name="stilt_base_parking[]"], [name="open_parking[]"], [name="common_area_facilities[]"], [name="garage_details[]"], [name="project_specifications[]"], [name="development_team_details[]"], [name="pexist_project_balance_sheet"], [name="pexist_project_status"], [name="pexist_project_apt_cpt_area"], [name="affidavit_cum_declaration"], [name="engr_certificate"], [name="authorized_letter"], [name="ca_certificate"]').each(function () {
				$(this).rules('remove');
				$(this).removeClass('error');
			});    
			
			
			if(iamCurrentPageName=='project-registration')                    
			{     
				$("#iamAlreadyRegisteredPanNumber").rules("add", {
					required:function(element) {return $('#pmtr_exist2').is(':checked')},
					messages: {required: "Please enter PAN Number."}
				});
				$("#iamAlreadyRegisteredMobileNumber").rules("add", {
					 required:function(element) {return $('#pmtr_exist2').is(':checked')},
					 digits:true,
					 minlength: 10,   
					 maxlength: 10,
					 messages: {
						required: "Please enter Mobile Number",
						digits:"Please enter Number Only",
						minlength: "Minimum Length Of Mobile Number Is 10",
						maxlength:"Maximum  Length Of Mobile Number Is 10"
					 }
				});  
			} 
			$("#transaction_id").rules("add", {          
				required:true,             
				get_PaymentTransactionIDComplaintExist1:true,      
				messages: {required: "Please enter Transaction Id",get_PaymentTransactionIDComplaintExist1:"Invalid transaction id"}
			});   
			$("#estimated_cost_of_construction").rules("add", {
                 number:true, 
				 messages: {number:"Please enter number only"}
			});	
			$("#estimated_cost_of_land").rules("add", {
                 number:true, 
				 messages: {number:"Please enter number only"}
			});	 
			$("#estimated_balance_cost_for_completion").rules("add", {
                 number:true, 
				 messages: {number:"Please enter number only"}
			});
			$("#pexist_construction_period").rules("add", {
                 number:true, 
				 messages: {number:"Please enter number only"}
			});
			$("#registration_fee").rules("add", {
                 number:true, 
				 messages: {number:"Please enter number only"}
			}); 
			$("#proposed_period_month").rules("add", {
                 number:true, 
				 messages: {number:"Please enter number only"}
			}); 
			
			$("#project_name").rules("add", {
				 required:true,                 
				 messages: {required:"Please enter Project Name"}
			});
			$("#engr_certificate").rules("add", {
				
                 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
                 filesize:52428800,
				 messages: {extension:"Please upload file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
			});
			$("#authorized_letter").rules("add", {
				
                 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
                 filesize:52428800,
				 messages: {extension:"Please upload file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
			});
			$("#ca_certificate").rules("add", {
				
                 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
                 filesize:52428800,
				 messages: {extension:"Please upload file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
			});
			$("#promoter_photo").rules("add", {
				
                 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
                 filesize:52428800,
				 messages: {extension:"Please upload file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
			});
			$("#promoter_aadhaar_copy").rules("add", {
				
                 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
                 filesize:52428800,
				 messages: {extension:"Please upload file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
			});
			$("#promoter_company_registration_copy").rules("add", {
				
                 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
                 filesize:52428800,
				 messages: {extension:"Please upload file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
			});
			$("#promoter_pan_copy").rules("add", {
				
                 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
                 filesize:52428800,
				 messages: {extension:"Please upload file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
			});
			$("#promoter_balance_sheet").rules("add", {
				
                 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
                 filesize:78643200,
				 messages: {extension:"Please upload file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
			});
			$("#promoter_itax_return").rules("add", {
				
                 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
                 filesize:52428800,
				 messages: {extension:"Please upload file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
			});
			$("#promoter_parent_annual_returns").rules("add", {
				
                 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
                 filesize:52428800,
				 messages: {extension:"Please upload file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
			});
			$("#project_ownership_document").rules("add", {
				
                 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
                 filesize:52428800,
				 messages: {extension:"Please upload file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
			});
			/*$("#fee_calculation_sheet").rules("add", {
				
                 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
                 filesize:52428800,
				 messages: {extension:"Please upload file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
			});*/
			$("#pass_book_front_page").rules("add", {
				
                 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
                 filesize:52428800,
				 messages: {extension:"Please upload file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
			});
			$("#pexist_modified_sanctioned_plan").rules("add", {
				
                 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
                 filesize:52428800,
				 messages: {extension:"Please upload file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
			});
			$("#pexist_modified_layout_plan").rules("add", {
				
                 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
                 filesize:52428800,
				 messages: {extension:"Please upload file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
			});
			$("#pexist_modified_project_specifications").rules("add", {
				
                 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
                 filesize:52428800,
				 messages: {extension:"Please upload file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
			});
			$("#pexist_project_balance_sheet").rules("add", {
				
                 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
                 filesize:52428800,
				 messages: {extension:"Please upload file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
			});
			$("#pexist_project_status").rules("add", {
				
                 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
                 filesize:52428800,
				 messages: {extension:"Please upload file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
			});
			$("#pexist_project_apt_cpt_area").rules("add", {
				
                 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
                 filesize:52428800,
				 messages: {extension:"Please upload file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
			});
			$("#pexist_plotted_development").rules("add", {
				
                 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
                 filesize:52428800,
				 messages: {extension:"Please upload file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
			});
			$("#affidavit_cum_declaration").rules("add", {
				
                 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
                 filesize:52428800,
				 messages: {extension:"Please upload file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
			});  
			$("[name='pp_total_constructed_area[]']").each(function() {
                $(this).rules("add", 
				{
				 number:true,
                 messages: {number:"Please enter number only"}
				})
            });  
			$("[name='pp_total_constructed_unit[]']").each(function() {
                $(this).rules("add", 
				{
				 number:true,
                 messages: {number:"Please enter number only"}
				})
            });  
			$("[name='partner_photo[]']").each(function() {
                $(this).rules("add", 
				{
				
                 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
                 filesize:52428800,
				 messages: {extension:"Please upload file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
				})
            });
			$("[name='partner_aadhaar_copy[]']").each(function() {
                $(this).rules("add", 
				{
				
                 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
                 filesize:52428800,
				 messages: {extension:"Please upload file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
				})
            });
			$("[name='partner_pan_copy[]']").each(function() {
                $(this).rules("add", 
				{
				
                 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
                 filesize:52428800,
				 messages: {extension:"Please upload file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
				})
            });
			$("[name='particulars_of_registration[]']").each(function() {
                $(this).rules("add", 
				{
				
                 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
                 filesize:52428800,
				 messages: {extension:"Please upload file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
				})
            });
			$("[name='encumbrances_on_land[]']").each(function() {
                $(this).rules("add", 
				{
				
                 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
                 filesize:52428800,
				 messages: {extension:"Please upload file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
				})
            });
			$("[name='consent_land_owner[]']").each(function() {
                $(this).rules("add", 
				{
				
                 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
                 filesize:52428800,
				 messages: {extension:"Please upload file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
				})
            });
			$("[name='approval_town_country_planning[]']").each(function() {
                $(this).rules("add", 
				{
				
                 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
                 filesize:52428800,
				 messages: {extension:"Please upload file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
				})
            });
			$("[name='building_permission_authority[]']").each(function() {
                $(this).rules("add", 
				{
				
                 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
                 filesize:52428800,
				 messages: {extension:"Please upload file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
				})
            });
			$("[name='nazul_clearance_case[]']").each(function() {
                $(this).rules("add", 
				{
				
                 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
                 filesize:52428800,
				 messages: {extension:"Please upload file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
				})
            });
			$("[name='environmental_clearance[]']").each(function() {
                $(this).rules("add", 
				{
				
                 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
                 filesize:52428800,
				 messages: {extension:"Please upload file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
				})
            });
			$("[name='sanctioned_plan[]']").each(function() {
                $(this).rules("add", 
				{
				
                 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
                 filesize:52428800,
				 messages: {extension:"Please upload file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
				})
            });
			$("[name='sanction_layout_plan[]']").each(function() {
                $(this).rules("add", 
				{
				
                 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
                 filesize:52428800,
				 messages: {extension:"Please upload file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
				})
            });
			$("[name='sanction_building_plan[]']").each(function() {
                $(this).rules("add", 
				{
				
                 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
                 filesize:52428800,
				 messages: {extension:"Please upload file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
				})
            });
			$("[name='project_specifications[]']").each(function() {
                $(this).rules("add", 
				{
				
                 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
                 filesize:52428800,
				 messages: {extension:"Please upload file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
				})
            });
			$("[name='development_work_plan[]']").each(function() {
                $(this).rules("add", 
				{
				
                 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
                 filesize:52428800,
				 messages: {extension:"Please upload file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
				})
            });
			$("[name='proforma_proposed[]']").each(function() {
                $(this).rules("add", 
				{
				
                 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
                 filesize:52428800,
				 messages: {extension:"Please upload file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
				})
            });
			$("[name='apartment_details[]']").each(function() {
                $(this).rules("add", 
				{
				
                 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
                 filesize:52428800,
				 messages: {extension:"Please upload file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
				})
            });
			$("[name='garage_details[]']").each(function() {
                $(this).rules("add", 
				{
				
                 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
                 filesize:52428800,
				 messages: {extension:"Please upload file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
				})
            });
			$("[name='parking_details[]']").each(function() {
                $(this).rules("add", 
				{
				
                 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
                 filesize:52428800,
				 messages: {extension:"Please upload file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
				})
            });
			$("[name='stilt_base_parking[]']").each(function() {
                $(this).rules("add", 
				{
				
                 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
                 filesize:52428800,
				 messages: {extension:"Please upload file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
				})
            });
			$("[name='open_parking[]']").each(function() {
                $(this).rules("add", 
				{
				
                 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
                 filesize:52428800,
				 messages: {extension:"Please upload file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
				})
            });
			$("[name='common_area_facilities[]']").each(function() {
                $(this).rules("add", 
				{
				
                 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
                 filesize:52428800,
				 messages: {extension:"Please upload file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
				})
            });
			$("[name='agent_details[]']").each(function() {
                $(this).rules("add", 
				{
				
                 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
                 filesize:52428800,
				 messages: {extension:"Please upload file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
				})
            });
			$("[name='development_team_details[]']").each(function() {
                $(this).rules("add", 
				{
				
                 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
                 filesize:52428800,
				 messages: {extension:"Please upload file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
				});
            });           
			$("#promoter_aadhaar").rules("add", {
				 digits:true,
				 minlength: 12,
				 maxlength: 12,
				 messages: {digits:"Please enter Number Only",
					minlength: "Minimum Length Of Aadhaar Number Is 12",
					maxlength:"Maximum  Length Of Aadhaar Number Is 12"}
			});
			        
        	$("#frm_prj_reg").valid();  // validation test only     
    	});
		$('#project_submit').click(function () {          
			if(iamCurrentPageName=='project-registration')  
			{           
				$("#iamAlreadyRegisteredPanNumber").rules("add", {
					required:function(element) {return $('#pmtr_exist2').is(':checked')},
					messages: {required: "Please enter PAN Number."}
				});
				$("#iamAlreadyRegisteredMobileNumber").rules("add", {
					 required:function(element) {return $('#pmtr_exist2').is(':checked')},
					 digits:true,
					 minlength: 10,              
					 maxlength: 10,
					 messages: {
						required: "Please enter Mobile Number",
						digits:"Please enter Number Only",
						minlength: "Minimum Length Of Mobile Number Is 10",
						maxlength:"Maximum  Length Of Mobile Number Is 10"
					 }
				});
			}      
			$("#promoter_type").rules("add", {
				 required:true,
				 messages: {required: "Please select Applicant Type"}
			});
			$("#project_declaration").rules("add", {
				 required:true,
				 messages: {required: "Please check Declaration"}  
			});
			$("#project_declaration_documents").rules("add", {
				 required:true,
				 messages: {required: "Please check Declaration"}    
			});
			$("#proprietorship_name").rules("add", {
				 required:function(element) {return ($('#promoter_type').val() == '3')},
				 messages: {required: "Please enter Proprietorship name"}
			});
			$("#promoter_father").rules("add", {
				 required: function(element) {

                        return ($('#promoter_type').val() == '1' || $('#promoter_type').val() == '3')
                    },
                messages: {required:"Please enter Father's name"}
			});
			$("#promoter_address").rules("add", {
				 required:true,
				 messages: {required:"Please enter Promoter Address"}
			});
			$("#promoter_aadhaar").rules("add", {
				 required:function(element) {return ($('#promoter_type').val() == '1' || $('#promoter_type').val() == '3')},
				 digits:true,
				 minlength: 12,
				 maxlength: 12,
				 messages: {required:"Please enter Aadhaar Number",digits:"Please enter Number Only",
					minlength: "Minimum Length Of Aadhaar Number Is 12",
					maxlength:"Maximum  Length Of Aadhaar Number Is 12"}
			});
			                          
			if(iamCurrentPageName=='edit-project-registration')
			{    
				$("#promoter_company_registration_copy").rules("add", {
				extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
                                filesize:52428800,
                                messages: {required:"Please upload Registration Copy",extension:"Please upload Registration Copy in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
                               });
                                var promoter_pan_copy1=$("#promoter_pan_copy1").val();//alert(promoter_pan_copy1);
				if(promoter_pan_copy1==1)      
				{                                      
					$("#promoter_pan_copy").rules("add", {
						 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
						 filesize:52428800,
						 messages: {required:"Please upload Pan Copy",extension:"Please upload Pan Copy in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
					});
				}
				else
				{
					$("#promoter_pan_copy").rules("add", {
						 required:true,
						 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
						 filesize:52428800,
						 messages: {required:"Please upload Pan Copy",extension:"Please upload Pan Copy in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
					});	
				}
				
				var promoter_photo1=$("#promoter_photo1").val();//alert(promoter_pan_copy1);
				if(promoter_photo1==1)      
				{
					$("#promoter_photo").rules("add", {
					 extension:'JPEG|jpeg|JPG|jpg|PNG|png',
					 filesize:52428800,
					 messages: {required:"Please upload photo of promoter",extension:"Please upload Photo in JPEG,JPG,PNG Format",filesize:"File size must be less than 50 MB"}
					});
				}
				else
				{
					$("#promoter_photo").rules("add", {
					 required:function(element) {return ($('#promoter_type').val() == '1' || $('#promoter_type').val() == '3')},
					 extension:'JPEG|jpeg|JPG|jpg|PNG|png',
					 filesize:52428800,
					 messages: {required:"Please upload photo of promoter",extension:"Please upload Photo in JPEG,JPG,PNG Format",filesize:"File size must be less than 50 MB"}
					});
				}
				var promoter_balance_sheet1=$("#promoter_balance_sheet1").val();//alert(promoter_pan_copy1);
				if(promoter_balance_sheet1==1)      
				{
					$("#promoter_balance_sheet").rules("add", {
						 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
						 filesize:78643200,
						 messages: {required:"Please upload Balance Sheet",extension:"Please upload Balance Sheet Copy in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
					});
				}
				else
				{
					$("#promoter_balance_sheet").rules("add", {
						 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
						 filesize:78643200,
						 messages: {required:"Please upload Balance Sheet",extension:"Please upload Balance Sheet Copy in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
					});
				}
				var promoter_itax_return1=$("#promoter_itax_return1").val();//alert(promoter_pan_copy1);
				if(promoter_itax_return1==1)      
				{
					$("#promoter_itax_return").rules("add", {
						 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
						 filesize:52428800,
						 messages: {required:"Please upload IT Return Copy",extension:"Please upload IT Return Copy in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
					});
				}
				else
				{
					$("#promoter_itax_return").rules("add", {
						 required:function(element) {return $('#new_entity1').is(':checked')},
						 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
						 filesize:52428800,
						 messages: {required:"Please upload IT Return Copy",extension:"Please upload IT Return Copy in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
					});
				}
				var promoter_aadhaar_copy1=$("#promoter_aadhaar_copy1").val();//alert(promoter_pan_copy1);
				if(promoter_aadhaar_copy1==1)      
				{	
					$("#promoter_aadhaar_copy").rules("add", {
						 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
						 filesize:52428800,
						 messages: {required:"Please upload Aadhaar Copy",extension:"Please upload Aadhaar Copy in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
					}); 
				}
				else
				{
					$("#promoter_aadhaar_copy").rules("add", {
						 required:function(element) {return ($('#promoter_type').val() == '1' || $('#promoter_type').val() == '3')},
						 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
						 filesize:52428800,
						 messages: {required:"Please upload Aadhaar Copy",extension:"Please upload Aadhaar Copy in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
					});    
				}
				/*var fee_calculation_sheet1=$("#fee_calculation_sheet1").val();//alert(promoter_pan_copy1);
				if(fee_calculation_sheet1==1)      
				{
					$("#fee_calculation_sheet").rules("add", {
						 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
						 filesize:52428800,
						 messages: {required:"Please upload Fee calculation sheet",extension:"Please upload calculation sheet Copy in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
					});
				}
				else
				{
					$("#fee_calculation_sheet").rules("add", {
						 required:true,
						 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
						 filesize:52428800,
						 messages: {required:"Please upload Fee calculation sheet",extension:"Please upload calculation sheet Copy in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
					});
				}*/
				var project_ownership_document1=$("#project_ownership_document1").val();
				if(project_ownership_document1==1)      
				{
					$("#project_ownership_document").rules("add", {
						 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
						 filesize:52428800,
						 messages: {required:"Please upload Ownership Document",extension:"Please upload Ownership Document Copy in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
					});
				}
				else
				{
					$("#project_ownership_document").rules("add", {
						 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
						 filesize:52428800,
						 messages: {required:"Please upload Ownership Document",extension:"Please upload Ownership Document Copy in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
					});
				}
				var engr_certificate1=$("#engr_certificate1").val();
				if(engr_certificate1==1)      
				{
					$("#engr_certificate").rules("add", {
						 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
						 filesize:52428800,
						 messages: {required:"Please upload Engineer Certificate",extension:"Please upload Engineer Certificate Copy in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
					});
				}
				else
				{
					$("#engr_certificate").rules("add", {
						 required:function(element) {return $('#project_type2').is(':checked')},
						 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
						 filesize:52428800,
						 messages: {required:"Please upload Engineer Certificate",extension:"Please upload Engineer Certificate Copy in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
					});
				}
				var ca_certificate1=$("#ca_certificate1").val();
				if(ca_certificate1==1)      
				{
					$("#ca_certificate").rules("add", {
						 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
						 filesize:52428800,
						 messages: {required:"Please upload CA Certificate",extension:"Please upload CA Certificate Copy in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
					});
				}
				else
				{
					$("#ca_certificate").rules("add", {
						 required:function(element) {return $('#project_type2').is(':checked')},
						 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
						 filesize:52428800,
						 messages: {required:"Please upload CA Certificate",extension:"Please upload CA Certificate Copy in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
					});
				}
				var authorized_letter1=$("#authorized_letter1").val();
				if(authorized_letter1==1)      
				{
					$("#authorized_letter").rules("add", {
						 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
						 filesize:52428800,
						 messages: {required:"Please upload Authorized letter",extension:"Please upload  Authorized letter Copy in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
					});
				}
				else
				{
					$("#authorized_letter").rules("add", {
						 required:function(element) {return ($('#promoter_type').val() == '6')},
						 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',    
						 filesize:52428800,
						 messages: {required:"Please upload  Authorized letter",extension:"Please upload  Authorized letter Copy in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
					});
				}
				var pass_book_front_page1=$("#pass_book_front_page1").val();
				if(pass_book_front_page1==1)        
				{      
					$("#pass_book_front_page").rules("add", {
						 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
						 filesize:52428800,
						 messages: {required:"Please upload a file",extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
					});
				}
				else
				{
					$("#pass_book_front_page").rules("add", {
						 required:true,
						 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
						 filesize:52428800,
						 messages: {required:"Please upload a file",extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
					});
				}
				$("[name='encumbrances_on_land[]']").each(function() {
					$(this).rules("add", 
					{    
						extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
						filesize:52428800,
						messages: {required:"Please upload a file",extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
					})
				});
				$("[name='consent_land_owner[]']").each(function() {
					$(this).rules("add", 
					{
						extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
						filesize:52428800,
						messages: {required:"Please upload a file",extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
					})
				}); 
				$("[name='approval_town_country_planning[]']").each(function() {
					$(this).rules("add", 
					{
						extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
						filesize:52428800,
						messages: {required:"Please upload a file",extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
					})
				});
				$("[name='building_permission_authority[]']").each(function() {
					$(this).rules("add", 
					{
						extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
						filesize:52428800,
						messages: {extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
					})
				}); 
				$("[name='nazul_clearance_case[]']").each(function() {
					$(this).rules("add", 
					{
						extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
						filesize:52428800,
						messages: {extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
					})
				}); 
				$("[name='sanctioned_plan[]']").each(function() {
					$(this).rules("add", 
					{        
						extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
						filesize:52428800,
						messages: {required:"Please upload a file",extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
					})    
				});
				$("[name='sanction_layout_plan[]']").each(function() {
					$(this).rules("add", 
					{
						extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
						filesize:52428800,   
						messages: {required:"Please upload a file",extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
					})
				});   
				$("[name='development_work_plan[]']").each(function() {
					$(this).rules("add", 
					{
						extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
						filesize:52428800,
						messages: {required:"Please upload a file",extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
					})
				});  
				$("[name='proforma_proposed[]']").each(function() {
					$(this).rules("add", 
					{
						extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
						filesize:52428800,
						messages: {required:"Please upload a file",extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
					})
				});   
				$("[name='apartment_details[]']").each(function() {
					$(this).rules("add", 
					{
						extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
						filesize:52428800,
						messages: {required:"Please upload a file",extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
					})
				});   
				$("[name='development_team_details[]']").each(function() {
					$(this).rules("add", 
					{
						extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
						filesize:52428800,
						messages: {required:"Please upload a file",extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
					})
				});  
				$("[name='sanction_building_plan[]']").each(function() {
					$(this).rules("add", 
					{
						extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
						filesize:52428800,
						messages: {extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
					})
				});
				$("[name='agent_details[]']").each(function() {
					$(this).rules("add", 
					{
						extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
						filesize:52428800,
						messages: {extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
					})
				});
				$("[name='parking_details[]']").each(function() {
					$(this).rules("add", 
					{
						extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
						filesize:52428800,
						messages: {extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
					})
				}); 
				$("[name='stilt_base_parking[]']").each(function() {
					$(this).rules("add", 
					{
						extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
						filesize:52428800,
						messages: {extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
					})
				});   
				$("[name='open_parking[]']").each(function() {
					$(this).rules("add", 
					{
						extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
						filesize:52428800,
						messages: {extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
					})
				});  
				$("[name='common_area_facilities[]']").each(function() {
					$(this).rules("add", 
					{
	
						extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
						filesize:52428800,
						messages: {extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
					})
				});
				$("[name='garage_details[]']").each(function() {
					$(this).rules("add", 
					{
						extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
						filesize:52428800,
						messages: {extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
					})
				}); 
				$("[name='project_specifications[]']").each(function() {
					$(this).rules("add", 
					{
						extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
						filesize:52428800,
						messages: {extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
					});
				}); 
				$("#pexist_project_balance_sheet").rules("add", {   
					 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
					 filesize:52428800,
					 messages: {required:"Please upload a file",extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}        
				});
				$("#pexist_project_status").rules("add", {    
					 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
					 filesize:52428800,
					 messages: {required:"Please upload a file",extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
				});   
				$("#pexist_project_apt_cpt_area").rules("add", {
					 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
					 filesize:52428800,
					 messages: {required:"Please upload a file",extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
				});
				$("#affidavit_cum_declaration").rules("add", {
					 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
					 filesize:52428800,
					 messages: {required:"Please upload a file",extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
				});
			}
			if(iamCurrentPageName=='project-registration')
			{
                            $("#promoter_company_registration_copy").rules("add", {
				 required:function(element) {return ($('#promoter_type').val() != '1' && $('#promoter_type').val() != '3')},
                                extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
                                filesize:52428800,     
                                                messages: {required:"Please upload Registration Copy",extension:"Please upload Registration Copy in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
                                       });
				$("#pass_book_front_page").rules("add", {
					 required:true,
					 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
					 filesize:52428800,
					 messages: {required:"Please upload a file",extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
				});
				$("#authorized_letter").rules("add", {
						required:function(element) {return ($('#promoter_type').val() == '6')},
						extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',    
						filesize:52428800,
						messages: {required:"Please upload  Authorized letter",extension:"Please upload Authorized letter Copy in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
			   });
				$("#ca_certificate").rules("add", {
					 required:true,
					 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
					 filesize:52428800,
					 messages: {required:"Please upload CA Certificate",extension:"Please upload CA Certificate Copy in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
				});    
				$("#engr_certificate").rules("add", {
					 required:true,
					 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
					 filesize:52428800,
					 messages: {required:"Please upload Engineer Certificate",extension:"Please upload Engineer Certificate in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
				});
				$("#project_ownership_document").rules("add", {   
					 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
					 filesize:52428800,
					 messages: {required:"Please upload Ownership Document",extension:"Please upload Ownership Document Copy in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
				});
				/*$("#fee_calculation_sheet").rules("add", {
					 required:true,
					 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
					 filesize:52428800,
					 messages: {required:"Please upload Fee calculation sheet",extension:"Please upload Fee calculation sheet Copy in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
				});*/
				$("#promoter_aadhaar_copy").rules("add", {
					 required:function(element) {return ($('#promoter_type').val() == '1' || $('#promoter_type').val() == '3')},
					 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
					 filesize:52428800,
					 messages: {required:"Please upload Aadhaar Copy",extension:"Please upload Aadhaar Copy in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
				});
				$("#promoter_pan_copy").rules("add", {
					 required:true,
					 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
					 filesize:52428800,
					 messages: {required:"Please upload Pan Copy",extension:"Please upload Pan Copy in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
				});	
				$("#promoter_photo").rules("add", {
					 required:function(element) {return ($('#promoter_type').val() == '1' || $('#promoter_type').val() == '3')},
					 extension:'JPEG|jpeg|JPG|jpg|PNG|png',
					 filesize:52428800,
					 messages: {required:"Please upload photo of promoter",extension:"Please upload Photo in JPEG,JPG,PNG Format",filesize:"File size must be less than 50 MB"}
				});
				$("#promoter_balance_sheet").rules("add", {
					 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
					 filesize:78643200,
					 messages: {required:"Please upload Balance Sheet",extension:"Please upload Balance Sheet Copy in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
				});
				$("#promoter_itax_return").rules("add", {
					 required:function(element) {return $('#new_entity1').is(':checked')},
					 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
					 filesize:52428800,
					 messages: {required:"Please upload IT Return Copy",extension:"Please upload IT Return Copy in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
				});
				$("[name='encumbrances_on_land[]']").each(function() {
					$(this).rules("add",    
					{
						required:function(element) {return $('#project_type1').is(':checked')},
						extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
						filesize:52428800,
						messages: {required:"Please upload a file",extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
					})
				});
				$("[name='consent_land_owner[]']").each(function() {
					$(this).rules("add", 
					{
						required: true,
						extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
						filesize:52428800,
						messages: {required:"Please upload a file",extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
					})
				}); 
				$("[name='approval_town_country_planning[]']").each(function() {
					$(this).rules("add", 
					{
						required: true,
						extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
						filesize:52428800,
						messages: {required:"Please upload a file",extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
					})
				});
				$("[name='building_permission_authority[]']").each(function() {
					$(this).rules("add",     
					{
						
						extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
						filesize:52428800,
						messages: {extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
					})
				}); 
				$("[name='nazul_clearance_case[]']").each(function() {
					$(this).rules("add", 
					{
						extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
						filesize:52428800,
						messages: {extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
					})
				}); 
				$("[name='sanctioned_plan[]']").each(function() {
					$(this).rules("add", 
					{
						required:function(element) {return $('#project_type1').is(':checked')},
						extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
						filesize:52428800,
						messages: {required:"Please upload a file",extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
					})
				});
				$("[name='sanction_layout_plan[]']").each(function() {
					$(this).rules("add", 
					{
						required:function(element) {return $('#project_type1').is(':checked')},
						extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
						filesize:52428800,   
						messages: {required:"Please upload a file",extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
					})
				});   
				$("[name='development_work_plan[]']").each(function() {
					$(this).rules("add", 
					{   
						required:function(element) {return $('#project_type1').is(':checked')},
						extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
						filesize:52428800,
						messages: {required:"Please upload a file",extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
					})
				});  
				$("[name='proforma_proposed[]']").each(function() {
					$(this).rules("add", 
					{
						required: true,
						extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
						filesize:52428800,
						messages: {required:"Please upload a file",extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
					})
				});   
				$("[name='apartment_details[]']").each(function() {
					$(this).rules("add", 
					{   
						required:function(element) {return $('#project_type1').is(':checked')},
						extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
						filesize:52428800,
						messages: {required:"Please upload a file",extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
					})
				});   
				$("[name='development_team_details[]']").each(function() {
					$(this).rules("add", 
					{
						required:function(element) {return $('#project_type1').is(':checked')},  
						extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
						filesize:52428800,
						messages: {required:"Please upload a file",extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
					})
				});  
				$("[name='sanction_building_plan[]']").each(function() {
					$(this).rules("add", 
					{
						extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
						filesize:52428800,
						messages: {extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
					})
				});
				$("[name='agent_details[]']").each(function() {
					$(this).rules("add", 
					{
						extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
						filesize:52428800,
						messages: {extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
					})
				});
				$("[name='parking_details[]']").each(function() {
					$(this).rules("add", 
					{
						extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
						filesize:52428800,
						messages: {extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
					})
				}); 
				$("[name='stilt_base_parking[]']").each(function() {
					$(this).rules("add", 
					{
						extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
						filesize:52428800,
						messages: {extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
					})
				});   
				$("[name='open_parking[]']").each(function() {
					$(this).rules("add", 
					{
						extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
						filesize:52428800,
						messages: {extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
					})
				});  
				$("[name='common_area_facilities[]']").each(function() {
					$(this).rules("add", 
					{
	
						extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
						filesize:52428800,
						messages: {extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
					})
				});
				$("[name='garage_details[]']").each(function() {
					$(this).rules("add", 
					{
						extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
						filesize:52428800,
						messages: {extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
					})
				}); 
				$("[name='project_specifications[]']").each(function() {
					$(this).rules("add", 
					{
						extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
						filesize:52428800,
						messages: {extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
					});
				}); 
				$("#pexist_project_balance_sheet").rules("add", {
					 
					 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
					 filesize:52428800,
					 messages: {required:"Please upload a file",extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}        
				});
				$("#pexist_project_status").rules("add", {    
					 required: function(element) {return $('#project_type2').is(':checked')},
					 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
					 filesize:52428800,
					 messages: {required:"Please upload a file",extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
				});   
				$("#pexist_project_apt_cpt_area").rules("add", {
					 
					 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
					 filesize:52428800,
					 messages: {required:"Please upload a file",extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
				});
				$("#affidavit_cum_declaration").rules("add", {
					 required: true,
					 extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
					 filesize:52428800,
					 messages: {required:"Please upload a file",extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
				});
			}
			
			
			$("[name='partner_name[]']").each(function() {
                $(this).rules("add", 
				{
					required: function(element) { return ($('#promoter_type').val() != '1' && $('#promoter_type').val() != '3')},
					messages: {required:"Please Enter Name"}
				})  
            });  
			$("[name='partner_photo[]']").each(function() {
                $(this).rules("add", 
				{ 
					required: function(element) {
						return ($('#promoter_type').val() != '1' && $('#promoter_type').val() != '3')
					},
					extension:'JPEG|jpeg|JPG|jpg|PNG|png',
					filesize:52428800,
					messages: {required:"Please upload Photo",extension:"Please upload Photo in JPEG,JPG,PNG Format",filesize:"File size must be less than 50 MB"}
				})
            });
			$("[name='partner_address[]']").each(function() {
                $(this).rules("add", 
				{
					required: function(element) {  
						return ($('#promoter_type').val() != '1' && $('#promoter_type').val() != '3')
					},              
					messages: {required:"Please Enter Address"}
				})
		     });  
			 $("[name='partner_aadhaar[]']").each(function() {
                $(this).rules("add", 
				{
					required: function(element) {
						return ($('#promoter_type').val() != '1' && $('#promoter_type').val() != '3')
					},
					messages: {required:"Please Enter Aadhaar Number"}
				})
		     });     
			 $("[name='partner_aadhaar_copy[]']").each(function() {
                $(this).rules("add", 
				{
					required: function(element) {
						return ($('#promoter_type').val() != '1' && $('#promoter_type').val() != '3')
					},
					extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
					filesize:52428800,
					messages: {required:"Please upload Partner Aadhaar Copy",extension:"Please upload Partner Aadhaar Copy in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
				})
		     });  
			 $("[name='partner_pan[]']").each(function() {
                $(this).rules("add", 
				{
					required: function(element) {
						return ($('#promoter_type').val() != '1' && $('#promoter_type').val() != '3')
					},
					messages: {required:"Please enter Partner PAN Number"}
				})  
		     }); 
		     $("[name='partner_pan_copy[]']").each(function() {
			   $(this).rules("add", 
				{
					required: function(element) {
						return ($('#promoter_type').val() != '1' && $('#promoter_type').val() != '3')
					},extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',filesize:52428800,
					messages: {required:"Please upload Partner PAN Copy",extension:"Please upload Partner PAN Copy in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
				})
		     });   
			 $("[name='partner_email[]']").each(function() {
				$(this).rules("add", 
				{
					required: function(element) {
						return ($('#promoter_type').val() != '1' && $('#promoter_type').val() != '3')
					},email: true,
					messages: {required: "Please enter Partner Email",email: "Please enter valid email"}
				})
		     }); 
			 $("[name='partner_mobile[]']").each(function() {
                $(this).rules("add", 
				{
					required: function(element) {
						return ($('#promoter_type').val() != '1' && $('#promoter_type').val() != '3')
					},digits:true,minlength: 10,maxlength: 10,
					messages: {required: "Please enter Partner Mobile Number",
				digits:"Please enter Number Only",
				minlength: "Minimum Length Of Mobile Number Is 10",
				maxlength:"Maximum  Length Of Mobile Number Is 10"}
				})
		     }); 
			 $("[name='previous_project_name[]']").each(function() {
                $(this).rules("add", 
				{
					required: true,
					messages: {required: "Please enter Previous Project Name"}
				})
             });
			 $("[name='previous_project_address[]']").each(function() {
                $(this).rules("add", 
				{
					required: true,
					messages: {required: "Please enter Previous Project Address"}
				})
             });
			 $("[name='pp_total_constructed_area[]']").each(function() {
                $(this).rules("add", 
                {
                    required: true,
					number: true,   
                    messages: {required: "Please enter Total Constructed Area"}
                })
             }); 
			 $("[name='pp_total_constructed_unit[]']").each(function() {
                $(this).rules("add", 
                {
                    required: true,
					number: true,   
                    messages: {required: "Please enter Total Constructed Units"}
                })
             });
			 $("[name='previous_project_start_date[]']").each(function() {
                $(this).rules("add", 
                {
                    required: true,
                    messages: {required: "Please enter Start Date"}
                })
             });  
			 $("[name='previous_project_end_date[]']").each(function() {
                $(this).rules("add", 
                {
                    required: function(element){return ($('#previous_project_status').val() != '3')},
                    messages: {required: "Please enter End Date"}
                })
             });			
			 $("[name='pp_completion_certificate_date[]']").each(function() {
                $(this).rules("add", 
                {
                    required: true,
                    messages: {required: "Please enter Completion Date"}
                })
             }); 
			 $("[name='previous_project_status[]']").each(function() {
                $(this).rules("add", 
                {
                    required: true,
                    messages: {required: "Please select Project Status"}
                })
             });  
			 $("#project_name").rules("add", {
				 required:true,
				 messages: {required:"Please enter Project Name"}
			 });
			 $("#project_district_code").rules("add", {
				 required:true,
                 messages: {required:"Please select Project District"}
			 }); 
			 $("#project_tehsil_id").rules("add", {        
				 required:true,
                 messages: {required:"Please select Project Tehsil"}
			 });
			 $("#project_planning_area").rules("add", {
				 required:true,
                 messages: {required:"Please select Project Planning Area"}
			 });
			 $("#project_address").rules("add", {
				 required:true,
                 messages: {required:"Please enter Project Address"}
			 });
			 $("#project_ownership_details").rules("add", {
				 required:true,
                 messages: {required:"Please enter Ownership Details"}
			 });
			 
			$("#external_dev_agency").rules("add", {
				 required:true,
                 messages: {required:"Please select Agency"}
			});
			$("#registration_fee").rules("add", {
				 required:true,
				 number:true,
                 messages: {required:"Please enter registration fee"}
			});
			
			$("#proposed_period_month").rules("add", {
				 required:function(element){return $('#project_type1').is(':checked')},
				 number:true,
                 messages: {required:"Please enter Proposed period(In month)"}
			});
			$("#estimated_cost_of_construction").rules("add", {
				 required:true,
				 number:true,
                 messages: {required:"Please enter  Estimated Cost of Construction(INR)"}
			});
			$("#estimated_cost_of_land").rules("add", {
				 required:true,
				 number:true,
                 messages: {required:"Please enter Estimated Cost of Land(INR)"}
			});
			$("#estimated_balance_cost_for_completion").rules("add", {
				 required:function(element) {return $('#project_type2').is(':checked')},
				 number:true,
                 messages: {required:"Please enter Estimated Balance Cost for Completion(INR)"}
			});
			$("#proposed_start_date").rules("add", {
				 required:function(element) { return $('#project_type1').is(':checked')},
                 messages: {required:"Please enter Start Date"}
			});
			$("#pexist_actual_start_date").rules("add", {
				 required:function(element) { return $('#project_type2').is(':checked')},
                 messages: {required:"Please enter Actual Start Date"}
			});
			$("#pexist_construction_period").rules("add", {
				 required:function(element) { return $('#project_type2').is(':checked')},
				 number:true,
                 messages: {required:"Please enter Construction Period"}
			});
			$("[name='pexist_on_schedule']").rules("add", {          
				 required:function(element) { return $('#project_type2').is(':checked') },
                 messages: {required:"Please select Schedule Status"}
			});
			$("#pexist_delay_reason").rules("add", {                   
				 required:function(element) {
					 return ($('#project_type2').is(':checked') && $('#pexist_on_schedule2').is(':checked'))
					  },
                 messages: {required:"Please enter Reason for Delay"}   
			});
			$("#pexist_construction_status").rules("add", {
				 required:function(element) {return $('#project_type2').is(':checked')},
                 messages: {required:"Please select Construction Status"}
			});
			$("#pexist_stalled_reason").rules("add", {
				 required:function(element) {return ($('#pexist_construction_status').val() == '3')},
                 messages: {required:"Please enter Reason for Stalled Construction"}
			});
			$("#proposed_end_date").rules("add", {   
				 required:true,
                 messages: {required:"Please enter End Date"}
			});
			$("#payment_date").rules("add", {  
				 required:true,
                 messages: {required:"Please enter Payment date"}
			});
			$("#transaction_id").rules("add", {
				required:true, 
				get_PaymentTransactionIDComplaintExist1:true, 
				messages: {required: "Please enter Transaction Id",get_PaymentTransactionIDComplaintExist1:"Please enter Transaction Id"}
			});     
			$("#bank_acct_no").rules("add", {
				 required:true,  
                 messages: {required:"Please enter Account Number"}
			});
			$("#bank_acct_name").rules("add", {
				 required:true,
                 messages: {required:"Please enter Account Name"}
			});
			$("#bank_name").rules("add", {
				 required:true,
                 messages: {required:"Please enter Bank Name"}
			});
			$("#bank_ifsc_code").rules("add", {
				 required:true,
                 messages: {required:"Please enter IFSC Code"}
			});
			$("#bank_branch_name").rules("add", {
				 required:true,
                 messages: {required:"Please enter Branch Name"}
			});
			$("#bank_branch_address").rules("add", {
				 required:true,
                 messages: {required:"Please enter Branch Address"}
			});
			$("[name='particulars_of_registration[]']").each(function() {
				$(this).rules("add", 
				{
					required: function(element) {return ($('#promoter_type').val() == '1' && $('#promoter_type').val() == '6')},
					extension:'PDF|pdf|JPEG|jpeg|JPG|jpg',
					filesize:52428800,
					messages: {required:"Please upload a file",extension:"Please upload a file in JPEG,JPG,PDF Format",filesize:"File size must be less than 50 MB"}
				})
			}); 
			
			$("#captcha_code").rules("add", {
				 required: true,
                 messages: {required:"Please enter security code"}
			});
			$("#myform").submit();  // validate and submit
		});
});      