$(document).ready(function() {

	// Set variables
	var contactsToShareWith = new Array();

	// "uploadForm" is the camelized version of the HTML element's ID
	Dropzone.options.uploadForm = {
		paramName: "asset", // The name that will be used to transfer the file
		maxFilesize: maxUploadFileSize, // MB
		maxFiles: 1,
		uploadMultiple: false,
		clickable: true,
		// acceptedFiles: "video/*,.mp4,.mov,.avi,.mkv",
		autoProcessQueue: false,
		autoQueue: true,
		headers: {
	        'X-CSRF-Token': $('#upload-form input#form__token').val()
	    },
		init: function() {
			this.on("addedfile", function(file) {

				// Reset the progress bar
				$("#addAssetProgressModal .progress .progress-bar").css("width", 0).empty().text("0%");

                // Extract the extension from the filename
				var extensionRegex = /(?:\.([^.]+))?$/;
				filenameExtension = extensionRegex.exec(file.name);

				// Get an array with the extensions allowed
				var acceptedExtensionsArray = acceptedExtensions.split(",");

                // If the extension of the file is not authorized
                if((filenameExtension[1] === undefined) || ((filenameExtension.length > 0) && (acceptedExtensionsArray.indexOf(filenameExtension[1].toLowerCase()) == -1))) {

					// Set the variable to FALSE to prevent the upload of the file
					fileReadyToUpload = false;

                    // Set the error message
                    var resultMessage = dashboardJsTextThisExtensionIsNotAuthorized;
                    $('#addAssetResultModal #add-asset-result').removeClass("alert-danger").removeClass("alert-succes").addClass("alert-danger").empty().text(resultMessage).show();

                    // Launch the asset result modal
    	            $('#addAssetResultModal').modal({
    	            	'backdrop': true,
                        'keyboard': true
    	            });

					// Remove the file
					this.removeAllFiles(true);

                    return false;
                }

                // If the file doesn't have an extension
                else if((filenameExtension.length == 0) || (filenameExtension[1] === undefined)) {

					// Set the variable to FALSE to prevent the upload of the file
					fileReadyToUpload = false;

                    // Set the error message
                    var resultMessage = dashboardJsTextFileMustHaveExtension;
                    $('#addAssetResultModal #add-asset-result').removeClass("alert-danger").removeClass("alert-succes").addClass("alert-danger").empty().text(resultMessage).show();

                    // Launch the asset result modal
    	            $('#addAssetResultModal').modal({
    	            	'backdrop': true,
                        'keyboard': true
    	            });

					// Remove the file
					this.removeAllFiles(true);

                    return false;
                }

				// If the file size exceeds the available storage of the user
				else if(file.size > maxUploadFileSize * storageMultiplier) {

					// Set the variable to FALSE to prevent the upload of the file
					fileReadyToUpload = false;

                    // Set the error message
                    var resultMessage = dashboardJsTextThisExtensionIsNotAuthorized;
                    $('#addAssetResultModal #add-asset-result').removeClass("alert-danger").removeClass("alert-succes").addClass("alert-danger").empty().html(backJsTextUploadNotEnoughSpace).show();

                    // Launch the asset result modal
    	            $('#addAssetResultModal').modal({
    	            	'backdrop': true,
                        'keyboard': true
    	            });

					// Remove the file
					this.removeAllFiles(true);

					return false;
				}

				else {

					// Calculate the length of the extension, including the point
					var filenameExtensionLength = filenameExtension[0].length;

					// Set the filename without extension.
					var filenameWithoutExtension = file.name.slice(0, -filenameExtensionLength);

					// Check what is the type of the file
					if(imageExtensionsArray.indexOf(filenameExtension[1].toLowerCase()) != -1) {

						// Save the file type in a variable
						fileType = "image";

						// Add this parameter to the upload form
						$('#addAssetModal form input#form_asset_type').val(fileType);

						// Change the title of the modal box
						$("#addAssetModal h4").empty().text(dashboardJsTextAddImage);

						// Change the content of modal
						$("#addAssetModal p.share-emails-description").empty().html(dashboardJsTextDefineMailPeopleToShareImageWith);
					}

					// Check what is the type of the file
					else if(audioExtensionsArray.indexOf(filenameExtension[1].toLowerCase()) != -1) {

						// Save the file type in a variable
						fileType = "audio";

						// Add this parameter to the upload form
						$('#addAssetModal form input#form_asset_type').val(fileType);

						// Change the title of the modal box
						$("#addAssetModal h4").empty().text(dashboardJsTextAddAudio);

						// Change the content of modal
						$("#addAssetModal p.share-emails-description").empty().html(dashboardJsTextDefineMailPeopleToShareAudioWith + "<br /><span class='encoding-message'>" + dashboardJsTextWillBeNotifiedAfterEncoding + '</span>');
					}

					// If we're working with a video
					else {

						// Save the file type in a variable
						fileType = "video";

						// Add this parameter to the upload form
						$('#addAssetModal form input#form_asset_type').val(fileType);

						// Change the title of the modal box
						$("#addAssetModal h4").empty().text(dashboardJsTextAddVideo);

						// Change the content of modal
						$("#addAssetModal p.share-emails-description").empty().html(dashboardJsTextDefineMailPeopleToShareVideoWith + "<br /><span class='encoding-message'>" + dashboardJsTextWillBeNotifiedAfterEncoding + '</span>');

					}

					// Prepopulate the form with the name of the uploaded file.
					var uploadedAssetName = $('#addAssetModal form input#form_upload_id').val() + filenameExtension[0];
					$('#addAssetModal form input#form_asset').val(uploadedAssetName);

					// Prepopulate the form with the filename
					$('#addAssetModal form input#form_name').val(filenameWithoutExtension);

		            // Launch the add asset modal
		            $('#addAssetModal').modal({
		            	'backdrop': true,
	                    'keyboard': false
		            });
				}
			});

			this.on("maxfilesreached", function(file){

				// Prevent the user to click again
				this.options.clickable = false;
				$('form.dropzone').removeClass("dz-clickable");
		    });

			this.on("uploadprogress", function(file, progress, bytesSent) {

                var progressPercentage = Math.round( progress ) + "%";
				$("#addAssetProgressModal .progress .progress-bar").css("width", progressPercentage).empty().text(progressPercentage);
			});

			this.on("queuecomplete", function(file){

				// Allow the user to click again
				this.options.clickable = true;
				$('form.dropzone').addClass("dz-clickable");
			});
		},
		accept: function(file, done) {
			done();
		}
	};


	// If the user changes the dropdown menu in the form to add an asset, hide or display the new project name field.
	$("form#add-asset-form select").on("change", function() {

		// Get the new value selected
		var project = $(this).val();

		if(project == 0) {
			$("form#add-asset-form input#form_new_project_name").slideUp();
		}
		if(project == 1) {
			$("form#add-asset-form input#form_new_project_name").slideDown();
		}
	});


	// Process the add asset form through ajax
	$("form#add-asset-form").on("submit", function(e) {

		// Prevent the form to be submitted
		e.preventDefault();

        // Hide the modal to add an asset
        $('#addAssetModal').modal('hide');

		// If we're uploading an image, hide the text about the encoding.
		if(fileType == "image") {
			$("#addAssetProgressModal span.encoding-message").hide();
		}
		// If we're uploading an other type of file, show the text about the encoding
		else {
			$("#addAssetProgressModal span.encoding-message").show();
		}

        // Show the progress modal
		$('#addAssetProgressModal').modal({
            'backdrop': 'static',
            'keyboard': false
        });

        // Add the upload in the DB
        $.ajax({
            type: 'POST',
            url: ajaxAddUploadURL,
            success: function(data, textStatus, jqXHR){

                // Get the response
                var obj = $.parseJSON(data);
                // console.log(obj);
            },
            error: function(data, textStatus, jqXHR){
                // console.log(data);
            }
        });

        // Process the upload
        var dropzoneUpload = Dropzone.forElement(".dropzone");
        dropzoneUpload.processQueue();

		// Set the variable to TRUE to be able to upload the file
		fileReadyToUpload = true;

		// When the upload has been processed
		dropzoneUpload.on("complete", function(file) {

			if(fileReadyToUpload == true) {

				// Remove the tmp file
				this.removeFile(file);

				// Delete the upload from the DB
				$.ajax({
					type: 'POST',
					url: ajaxDeleteUploadURL,
					success: function(data, textStatus, jqXHR){

						// Get the response
						var obj = $.parseJSON(data);
						// console.log(obj);
					},
					error: function(data, textStatus, jqXHR){
						// console.log(data);
					}
				});

				// If the file has been processed, prepare the form
				if(file.size <= maxUploadFileSize * storageMultiplier) {

					// Add the extension to the filename in the input field
					var fileName = file.name.split(".");
					var assetName = $("form#add-asset-form input#form_upload_id").val();

					if(filenameExtension[0].length > 0){
						assetName += filenameExtension[0];
					}

					$("form#add-asset-form input#form_asset").val( assetName );
				}

				// Add the file to the API
				// Set the variables
				var formdata = $('form#add-asset-form').serialize();
				var ajaxAddAssetURL = $('form#add-asset-form').attr("action");

				$.ajax({
					type: 'POST',
					url: ajaxAddAssetURL,
					data: formdata,
					success: function(data, textStatus, jqXHR){

						// Get the response
						var obj = $.parseJSON(data);
						// console.log(obj);

						// Check the status
						// If the user has not been created
						if(obj.response_code != 201) {

							// Check the reason of the error
							if(obj.error_source == "no_user_found")
								var message = backJsTextUploadNoUserFoundForThisRequest;

							else if(obj.error_source == "project_name_already_used")
								var message = backJsTextUploadProjectWithThisNameAlreadyExists;

							else if(obj.error_source == "missing_data")
								var message = backJsTextUploadAllFieldsNotProvided;

							else if(obj.error_source == "max_number_of_videos")
								var message = backJsTextUploadReachedMaxNumberOfFiles;

							else if(obj.error_source == "no_more_space_for_user")
								var message = backJsTextUploadReachedMaxSpaceAvailable;

							else if((obj.error_source == "file_error") || (obj.error_source == "upload_failed"))
								var message = backJsTextUploadErrorOccuredWhileSendingFile;

							else {
								if(fileType == "video") {
									var message = backJsTextUploadErrorOccuredWhileEncodingVideo;
								}
								else if(fileType == "image") {
									var message = backJsTextUploadErrorOccuredWhileUploadingImage;
								}
								else if(fileType == "audio") {
									var message = backJsTextUploadErrorOccuredWhileUploadingAudio;
								}
								else {
									var message = backJsTextUploadErrorOccuredWhileUploadingAsset;
								}
							}

							// Display the message
							$('#addAssetProgressModal').modal('hide');

							$('#addAssetResultModal #add-asset-result').removeClass("alert-danger").removeClass("alert-succes").addClass("alert-danger").empty().text(message).show();

							$('#addAssetResultModal').modal({
								'backdrop': 'static',
								'keyboard': true
							});
						}

						// If the asset has been created
						else {
							if((fileType == "video") || (fileType == "audio"))
								var message = backJsTextUploadEncodingScheduledWillBeNotified;
							else if(fileType == "image")
								var message = backJsTextUploadImageSuccess;
							else
								var message = backJsTextUploadAssetSuccess;

							// Display the message
							$('#addAssetProgressModal').modal('hide');
							$("#addAssetProgressModal .progress-encoding-specific-message").show();

							$('#addAssetResultModal #add-asset-result').removeClass("alert-danger").removeClass("alert-succes").addClass("alert-success").empty().html(message).show();

							$('#addAssetResultModal').modal({
								'backdrop': 'static',
								'keyboard': true
							});

							// Set the variable which will contain the HTML
							var encodingJobThumbnail = '';

							// Set the asset variables
							var assetBackgroundImage = obj.asset_thumbnail;
							var assetSecretID = obj.asset_id;
							var assetName = obj.asset_name;
							var assetCreationDate = obj.asset_created_at;
							var assetNameSanitized = assetName.replace(/"/gi,'&quot;').replace(/'/gi,'&apos;');

							// Add the thumbnail of the encoding job to the list
							if((obj.project != null) && (obj.project.project_id != null)) {

								// If this project doesn't exist in the DOM yet, we create the Div
								if( !jQuery.contains(document, $(".project#project-" + obj.project.project_id)[0]) ) {

									// Get the URL of the project
									var projectURL = projectTemplateURL.replace('CHANGETHISPARAMETER', obj.project.project_id);

									// If we are in the dashboard, we display a folder
									if(isProjectPage == false) {

										// Set the text for the number of assets
										if(userRights != "") {
											var typeOfAssetsInFolder = dashboardJsTextFile;
										}
										else {
											var typeOfAssetsInFolder = dashboardJsTextVideo;
										}

										encodingJobThumbnail += '<div id="project-'+obj.project.project_id+'" class="asset '+fileType+' project" style="background: url('+assetBackgroundImage+') no-repeat; background-size: cover; background-position: center center;">';
										encodingJobThumbnail += '<a href="'+projectURL+'">';
										encodingJobThumbnail += '<div class="see-asset">';
										encodingJobThumbnail += '<div class="see-asset-inner">';
										encodingJobThumbnail += '<button>';
										encodingJobThumbnail += dashboardJsTextSeeTheProject;
										encodingJobThumbnail += '</button>';
										encodingJobThumbnail += '</div>';
										encodingJobThumbnail += '</div>';
										encodingJobThumbnail += '<div class="asset-details">';
										encodingJobThumbnail += '<div class="asset-folder"></div>';
										encodingJobThumbnail += '<div class="asset-details-inner">';
										encodingJobThumbnail += '<div class="asset-name" data-elt-id="'+obj.project.project_id+'">';
										encodingJobThumbnail += obj.project.project_name;
										encodingJobThumbnail += '</div>';
										encodingJobThumbnail += '<div class="project-nb-assets">';
										encodingJobThumbnail += '1 '+typeOfAssetsInFolder;
										encodingJobThumbnail += '</div>';
										encodingJobThumbnail += '</div><!-- ./Asset details inner -->';
										encodingJobThumbnail += '</div><!-- ./Asset details -->';
										encodingJobThumbnail += '</a>';
										encodingJobThumbnail += '</div>';
									}

									// If we are in the project page, we display a regular encoding
									else {

										if(assetBackgroundImage != null)
											encodingJobThumbnail += '<div id="asset-'+assetSecretID+'" class="asset '+fileType+'" style="background: url('+assetBackgroundImage+') no-repeat; background-size: cover; background-position: center center;" data-elt-id="'+assetSecretID+'" data-asset-type="'+fileType+'">';
										else
											encodingJobThumbnail += '<div id="asset-'+assetSecretID+'" class="asset '+fileType+'" data-elt-id="'+assetSecretID+'" data-asset-type="'+fileType+'">';

										if(fileType == "video") {
											encodingJobThumbnail += '<div class="encoding-overlay" id="encoding-job-'+obj.encoding_job_id+'" data-encoding-job-id="'+obj.encoding_job_id+'" data-asset-id="'+assetSecretID+'" data-asset-name="'+assetNameSanitized+'" data-asset-url="'+baseUrl+'app/'+fileType+'/'+assetSecretID+'" data-asset-delete-url="'+baseUrl+'app/dashboard/delete/'+fileType+'/'+assetSecretID+'" data-asset-share-url="'+baseUrl+fileType+'/'+assetSecretID+'" data-asset-type="'+fileType+'">';
											encodingJobThumbnail += '<div class="encoding-overlay-inner">';
											encodingJobThumbnail += backJsTextUploadVideoEncodingInProgress + '<span class="encoding-dot">.</span><span class="encoding-dot">.</span><span class="encoding-dot">.</span>';
											encodingJobThumbnail += '<br /><span class="encoding-progress">0</span>%';
											encodingJobThumbnail += '<div class="encoding-job-progress-bar">';
											encodingJobThumbnail += '<div class="encoding-job-progress-bar-inner"></div>';
											encodingJobThumbnail += '</div>';
											encodingJobThumbnail += '</div>';
											encodingJobThumbnail += '</div>';
										}
										else if(fileType == "image") {
											encodingJobThumbnail += '<a href="'+baseUrl+'app/'+fileType+'/'+assetSecretID+'" ondragstart="dragAsset(event)" draggable="true" ondragend="dragEndAsset(event)">';
        									encodingJobThumbnail += '<div class="asset-actions">';
                            				encodingJobThumbnail += '<div class="asset-delete" data-target="'+baseUrl+'app/dashboard/delete/'+fileType+'/'+assetSecretID+'" data-asset-name="'+assetNameSanitized+'">';
                							encodingJobThumbnail += '</div>';
                							encodingJobThumbnail += '<div class="asset-share" data-asset-id="'+assetSecretID+'" data-asset-url="'+baseUrl+'app/'+fileType+'/'+assetSecretID+'" data-content-type="'+fileType+'" data-content-id="'+assetSecretID+'" data-content-name="'+assetNameSanitized+'">';
                							encodingJobThumbnail += '</div>';
                							encodingJobThumbnail += '<div class="clear"></div>';
                    						encodingJobThumbnail += '</div>';
        									encodingJobThumbnail += '<div class="see-asset">';
            								encodingJobThumbnail += '<div class="see-asset-inner">';
                							encodingJobThumbnail += '<button>';
                                            encodingJobThumbnail += dashboardJsTextSeeTheImage;
                                    		encodingJobThumbnail += '</button>';
            								encodingJobThumbnail += '</div>';
        									encodingJobThumbnail += '</div>';
										}
										else if(fileType == "audio") {
											encodingJobThumbnail += '<div class="encoding-overlay" id="encoding-job-audio-'+obj.encoding_job_id+'" data-encoding-job-id="'+obj.encoding_job_id+'" data-asset-id="'+assetSecretID+'" data-asset-name="'+assetNameSanitized+'" data-asset-url="'+baseUrl+'app/'+fileType+'/'+assetSecretID+'" data-asset-delete-url="'+baseUrl+'app/dashboard/delete/'+fileType+'/'+assetSecretID+'" data-asset-share-url="'+baseUrl+fileType+'/'+assetSecretID+'" data-asset-type="'+fileType+'">';
											encodingJobThumbnail += '<div class="encoding-overlay-inner">';
											encodingJobThumbnail += backJsTextUploadAudioEncodingInProgress + '<span class="encoding-dot">.</span><span class="encoding-dot">.</span><span class="encoding-dot">.</span>';
											encodingJobThumbnail += '<br /><span class="encoding-progress">0</span>%';
											encodingJobThumbnail += '<div class="encoding-job-progress-bar">';
											encodingJobThumbnail += '<div class="encoding-job-progress-bar-inner"></div>';
											encodingJobThumbnail += '</div>';
											encodingJobThumbnail += '</div>';
											encodingJobThumbnail += '</div>';
										}
										encodingJobThumbnail += '<div class="asset-details">';
										encodingJobThumbnail += '<div class="asset-details-inner">';
										encodingJobThumbnail += '<div class="asset-name" data-elt-id="'+assetSecretID+'">';
										encodingJobThumbnail += assetName;
										encodingJobThumbnail += '</div>';
										encodingJobThumbnail += '<div class="row">';
										encodingJobThumbnail += '<div class="col-xs-6">';
										encodingJobThumbnail += '<div class="asset-date">';
										encodingJobThumbnail += assetCreationDate;
										encodingJobThumbnail += '</div>';
										encodingJobThumbnail += '</div>';
										encodingJobThumbnail += '<div class="col-xs-6"></div>';
										encodingJobThumbnail += '</div>';
										encodingJobThumbnail += '</div><!-- ./Asset details inner -->';
										encodingJobThumbnail += '</div><!-- ./Asset details -->';
										if(fileType == "image") {
											encodingJobThumbnail += '</a>';
										}
										encodingJobThumbnail += '</div>';
									}
								}

								// If the project is already in the DOM, we just update the picture
								else {

									// Change the picture
									$("#assets .project#project-"+obj.project.project_id).css("background", assetBackgroundImage).css("backgroundSize", "cover").css("backgroundPosition", "center center");

									// Update the number of assets in the project
									var nbAssetsInProject = parseInt( $("#assets .project#project-"+obj.project.project_id).attr("data-nb-assets") );
									nbAssetsInProject += 1;

									// Set the text for the number of assets
									if((userRights != "") && (nbAssetsInProject > 1)) {
										var typeOfAssetsInFolder = dashboardJsTextFiles;
									}
									else if((userRights != "") && (nbAssetsInProject <= 1)) {
										var typeOfAssetsInFolder = dashboardJsTextFile;
									}
									else if((userRights == "") && (nbAssetsInProject > 1)) {
										var typeOfAssetsInFolder = dashboardJsTextVideos;
									}
									else {
										var typeOfAssetsInFolder = dashboardJsTextVideo;
									}

									nbAssetsInProjectText = nbAssetsInProject+" "+typeOfAssetsInFolder;

									$("#assets .project#project-"+obj.project.project_id+" .project-nb-assets").empty().html(nbAssetsInProjectText);

									// Update the attribute
									$("#assets .project#project-"+obj.project.project_id).attr("data-nb-assets", nbAssetsInProject);
								}
							}
							else {

								nbAssetsPerLine = nbAssetsPerLine + 1;

								if(assetBackgroundImage != null)
									encodingJobThumbnail += '<div id="asset-'+assetSecretID+'" class="asset '+fileType+'" style="background: url('+assetBackgroundImage+') no-repeat; background-size: cover; background-position: center center;" data-elt-id="'+assetSecretID+'" data-asset-type="'+fileType+'">';
								else
									encodingJobThumbnail += '<div id="asset-'+assetSecretID+'" class="asset '+fileType+'" data-elt-id="'+assetSecretID+'" data-asset-type="'+fileType+'">';

								if(fileType == "video") {
									encodingJobThumbnail += '<div class="encoding-overlay" id="encoding-job-'+obj.encoding_job_id+'" data-encoding-job-id="'+obj.encoding_job_id+'" data-asset-id="'+assetSecretID+'" data-asset-name="'+assetNameSanitized+'" data-asset-url="'+baseUrl+'app/'+fileType+'/'+assetSecretID+'" data-asset-delete-url="'+baseUrl+'app/dashboard/delete/'+fileType+'/'+assetSecretID+'" data-asset-share-url="'+baseUrl+'app/'+fileType+'/'+assetSecretID+'" data-asset-type="'+fileType+'">';
									encodingJobThumbnail += '<div class="encoding-overlay-inner">';
									encodingJobThumbnail += backJsTextUploadVideoEncodingInProgress + '<span class="encoding-dot">.</span><span class="encoding-dot">.</span><span class="encoding-dot">.</span>';
									encodingJobThumbnail += '<br /><span class="encoding-progress">0</span>%';
									encodingJobThumbnail += '<div class="encoding-job-progress-bar">';
									encodingJobThumbnail += '<div class="encoding-job-progress-bar-inner"></div>';
									encodingJobThumbnail += '</div>';
									encodingJobThumbnail += '</div>';
									encodingJobThumbnail += '</div>';
								}
								else if(fileType == "image") {
									encodingJobThumbnail += '<a href="'+baseUrl+'app/'+fileType+'/'+assetSecretID+'" ondragstart="dragAsset(event)" draggable="true" ondragend="dragEndAsset(event)">';
									encodingJobThumbnail += '<div class="asset-actions">';
									encodingJobThumbnail += '<div class="asset-delete" data-target="'+baseUrl+'app/dashboard/delete/'+fileType+'/'+assetSecretID+'" data-asset-name="'+assetNameSanitized+'">';
									encodingJobThumbnail += '</div>';
									encodingJobThumbnail += '<div class="asset-share" data-asset-id="'+assetSecretID+'" data-asset-url="'+baseUrl+'app/'+fileType+'/'+assetSecretID+'" data-content-type="'+fileType+'" data-content-id="'+assetSecretID+'" data-content-name="'+assetNameSanitized+'">';
									encodingJobThumbnail += '</div>';
									encodingJobThumbnail += '<div class="clear"></div>';
									encodingJobThumbnail += '</div>';
									encodingJobThumbnail += '<div class="see-asset">';
									encodingJobThumbnail += '<div class="see-asset-inner">';
									encodingJobThumbnail += '<button>';
									encodingJobThumbnail += dashboardJsTextSeeTheImage;
									encodingJobThumbnail += '</button>';
									encodingJobThumbnail += '</div>';
									encodingJobThumbnail += '</div>';
								}
								else if(fileType == "audio") {
									encodingJobThumbnail += '<div class="encoding-overlay" id="encoding-job-audio-'+obj.encoding_job_id+'" data-encoding-job-id="'+obj.encoding_job_id+'" data-asset-id="'+assetSecretID+'" data-asset-name="'+assetNameSanitized+'" data-asset-url="'+baseUrl+'app/'+fileType+'/'+assetSecretID+'" data-asset-delete-url="'+baseUrl+'app/dashboard/delete/'+fileType+'/'+assetSecretID+'" data-asset-share-url="'+baseUrl+'app/'+fileType+'/'+assetSecretID+'" data-asset-type="'+fileType+'">';
									encodingJobThumbnail += '<div class="encoding-overlay-inner">';
									encodingJobThumbnail += backJsTextUploadAudioEncodingInProgress + '<span class="encoding-dot">.</span><span class="encoding-dot">.</span><span class="encoding-dot">.</span>';
									encodingJobThumbnail += '<br /><span class="encoding-progress">0</span>%';
									encodingJobThumbnail += '<div class="encoding-job-progress-bar">';
									encodingJobThumbnail += '<div class="encoding-job-progress-bar-inner"></div>';
									encodingJobThumbnail += '</div>';
									encodingJobThumbnail += '</div>';
									encodingJobThumbnail += '</div>';
								}
								encodingJobThumbnail += '<div class="asset-details">';
								encodingJobThumbnail += '<div class="asset-details-inner">';
								encodingJobThumbnail += '<div class="asset-name" data-elt-id="'+assetSecretID+'">';
								encodingJobThumbnail += assetName;
								encodingJobThumbnail += '</div>';
								encodingJobThumbnail += '<div class="row">';
								encodingJobThumbnail += '<div class="col-xs-6">';
								encodingJobThumbnail += '<div class="asset-date">';
								encodingJobThumbnail += assetCreationDate;
								encodingJobThumbnail += '</div>';
								encodingJobThumbnail += '</div>';
								encodingJobThumbnail += '<div class="col-xs-6"></div>';
								encodingJobThumbnail += '</div>';
								encodingJobThumbnail += '</div><!-- ./Asset details inner -->';
								encodingJobThumbnail += '</div><!-- ./Asset details -->';
								if(fileType == "image") {
									encodingJobThumbnail += '</a>';
								}
								encodingJobThumbnail += '</div>';
							}

							// Redefine the positionning of the elements on the right
							$(".asset.last-elt").removeClass("last-elt");

							// Insert the new element
							$(encodingJobThumbnail).insertAfter("#assets > .wrapper #upload");

							// Redefine the positionning of the elements on the right
							var countAssets = 0;
							$(".asset").each(function() {
								countAssets += 1;

								if((countAssets == 3) || ((countAssets - 3) % 4 == 0)) {
									$(this).addClass("last-elt");
								}
							});
						}

						// Wait 4 seconds then get the screenshot
						setTimeout(function() {

							// Get the thumbnail of the asset
							$.ajax({
								type: 'POST',
								url: ajaxGetAssetDetailsAction,
								data: {
									asset_id: assetSecretID,
									asset_type: fileType
								},
								success: function(data, textStatus, jqXHR){

									// Get the response
									var obj_asset = $.parseJSON(data);
									// console.log(obj_asset);

									// Check the status
									// If the message has not been sent
									if(obj_asset.response_code != 200) {

										// Error case
										// There's not much we can do
									}

									// If the details of the asset have been properly gathered
									else {
										if(obj_asset.asset.thumbnail != undefined) {
											if((obj.project != null) && (obj.project.project_id != null) && (isProjectPage == false)) {
												$(".project#project-"+obj.project.project_id).css("background", "url("+obj_asset.asset.thumbnail+")").css("background-position", "center center").css("background-size", "cover");
											}

											// If the asset added is a video, update the encoding item
											else if(fileType == "video") {
												$(".encoding-overlay#encoding-job-"+obj.encoding_job_id).closest(".asset").css("background", "url("+obj_asset.asset.thumbnail+")").css("background-position", "center center").css("background-size", "cover");
											}

											// If the asset added is a video, update the encoding item
											else if(fileType == "audio") {
												$(".encoding-overlay#encoding-job-audio-"+obj.encoding_job_id).closest(".asset").css("background", "url("+obj_asset.asset.thumbnail+")").css("background-position", "center center").css("background-size", "cover");
											}
										}
									}
								},
								error: function(data, textStatus, jqXHR){
									var obj = $.parseJSON(data);
									// console.log(obj);
								}
							});

							// Hide the modal
							$("#addAssetResultModal").modal('hide');

						}, 4000);
					},
					error: function(data, textStatus, jqXHR){
						// console.log(data);
					}
				});

				// Allow the user to upload new files
				$("#upload #prevent-upload").hide();

				// Reset the variable
				fileReadyToUpload = false;
			}
		});
	});


	// Prevent the form to be submitted when the user presses enter
	$(document).on("keypress", 'form#add-asset-form input#form_email', function (e) {
		if(e.which == 13) {
			e.preventDefault();
		}
	});


	// When the user presses coma, semicolon or enter, add the email to the list
	$(document).on("keyup", 'form#add-asset-form input#form_email', function (e) {

		if (e.which == 188 || e.which == 186 || e.which == 13) {

	        // Get the email
	        var emailToAddToTheList = $('form#add-asset-form input#form_email').val();

	        // If the key pressed is a comma or a semicolon, remove it
	        if (e.which == 188 || e.which == 186)
	        	emailToAddToTheList = emailToAddToTheList.slice(0, -1);

	        // Add the email to the list Array
	        contactsToShareWith.push( emailToAddToTheList );


	        // Display the list
	        $('.modal #add-asset-form .share-emails-list').show();

	        // Display it in the list
	        var listElt = '<div class="share-email-elt">'+emailToAddToTheList+'<div class="share-email-delete-elt" data-email="'+emailToAddToTheList+'">x</div></div>';
	        $('.modal #add-asset-form .share-emails-list').prepend( listElt );

	        // Add it to the hidden list
	        var hiddenList = contactsToShareWith.join();
	        $('form#add-asset-form input#form_emails_list').val( hiddenList );

	        // Empty the field
	        $('form#add-asset-form .typeahead').typeahead('val', '');
	    }
	});


	// Delete an email from the sharing list
	$(document).on("click", 'form#add-asset-form .share-emails-list .share-email-elt .share-email-delete-elt', function () {

		// Remove the email from the list
		var emailToRemoveFromTheList = $(this).attr("data-email");
		var eltIndexInList = contactsToShareWith.indexOf( emailToRemoveFromTheList );
		if (eltIndexInList > -1) {
		    contactsToShareWith.splice(eltIndexInList, 1);
		}
		var hiddenList = contactsToShareWith.join();
		$('form#add-asset-form input#form_emails_list').val( hiddenList );


		// Remove the visual element
		$(this).parent(".share-email-elt").remove();
	});



	// Activate Typeahead
	var substringMatcher = function(strs) {
		return function findMatches(q, cb) {
			var matches, substringRegex;

			// an array that will be populated with substring matches
			matches = [];

			// regex used to determine if a string contains the substring `q`
			substrRegex = new RegExp(q, 'i');

			// iterate through the pool of strings and for any string that
			// contains the substring `q`, add it to the `matches` array
			$.each(strs, function(i, str) {
				if (substrRegex.test(str)) {
					matches.push(str);
				}
			});

			cb(matches);
		};
	};

	$('form#add-asset-form .typeahead').typeahead({
			hint: true,
			highlight: true,
			minLength: 1
	},
	{
		name: 'contactsList',
		source: substringMatcher(contactsList)
	});

});
