//Mogii
var appId = "61373c6ae14a6f36024f5ffb";
var appKey = "bTsTEvqQDUFOOD8UEgPepc1Sgx0x55Bq";

//To toggle show and hide the resource type for video or document
function toggleResourceType(resourceTypeSelect) {
  const value = resourceTypeSelect.value;
  // console.log("toggleResourceType " + value);
  if (value == "VIDEO") {
    $("#video-data-div").show();
    $("#doc-data-div").hide();
    $("#tests-dropdown-div").hide();
    //$("#video-data-div input").prop('required', true);
    $("#doc-data-div input").prop("required", false);
    $("#tests-dropdown-div select").prop("required", false);
  } else if (value == "DOC") {
    $("#video-data-div").hide();
    $("#doc-data-div").show();
    $("#tests-dropdown-div").hide();
    $("#video-data-div input").prop("required", false);
    $("#doc-data-div input").prop("required", true);
    $("#tests-dropdown-div select").prop("required", false);
  } else if (value == "TEST") {
    fetchCourseTests($("#add_classroom_id").val());
    $("#tests-dropdown-div").show();
    $("#tests-dropdown-div select").prop("required", true);
    $("#video-data-div").hide();
    $("#doc-data-div").hide();
    //$("#video-data-div input").prop('required', false);
    $("#doc-data-div input").prop("required", false);
  } else {
    $("#video-data-div").hide();
    $("#doc-data-div").hide();
    $("#tests-dropdown-div").hide();
    $("#video-data-div input").prop("required", false);
    $("#doc-data-div input").prop("required", false);
    $("#tests-dropdown-div select").prop("required", false);
  }
}

//To toggle submit button
function toggleSubmitButton(value) {
  // console.log("toggleSubmitButton " + value);
  if (value.length > 0) {
    $("#submit-button").show();
  } else {
    $("#submit-button").hide();
  }
}

//To change the subject and chapter list on click of classroom via ajax

function fetchTotalSubjectChaptersList(classroom_id) {
  // call using a async promise
  return new Promise(function (resolve, reject) {
    // console.log(dataString);
    var xhr = $.ajax({
      type: "GET",
      // data: dataString,
      url: base_url + "/dlp/load_dlp_subject_chapters/" + classroom_id,
      contentType: "application/json",
    })
      .done(function (response) {
        // success logic here
        resolve(JSON.stringify(response));
        // console.log(response);
      })
      .fail(function (jqXHR) {
        // Our error logic here
        reject(jqXHR.responseText);
      });
  });
}

/*************************************************************************** */
//Manage DLP content functions

function load_chapter_content(chapter_id, classroom_id) {
  // call using a async promise
  return new Promise(function (resolve, reject) {
    // console.log(dataString);
    var xhr = $.ajax({
      type: "GET",
      // data: dataString,
      url:
        base_url +
        "/dlp/load_dlp_chapter_content/" +
        chapter_id +
        "/" +
        classroom_id,
      contentType: "application/json",
    })
      .done(function (response) {
        // success logic here
        resolve(JSON.stringify(response));
        // console.log(response);
      })
      .fail(function (jqXHR) {
        // Our error logic here
        reject(jqXHR.responseText);
      });
  });
}

var progressCard =
  '<div id="{{progressId}}" class="alert alert-success alert-dismissible fade show mt-2" role="alert"><strong>{{uploadTitle}}</strong><div class="progress"><div class="progress-bar" role="progressbar" id="{{uploadProgress}}" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div></div><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';

function updateVideoProgress(
  randomVariable,
  max,
  value,
  status,
  valuePercent,
  videoTitle
) {
  var element = document.getElementById("progress" + randomVariable.toString());
  //Check if progress card already present
  if (element == null) {
    //Add element and set values
    var currentCard = new String(progressCard);
    currentCard = currentCard.replace(
      "{{progressId}}",
      "progress" + randomVariable.toString()
    );
    currentCard = currentCard.replace("{{uploadTitle}}", videoTitle);
    currentCard = currentCard.replace(
      "{{uploadValue}}",
      "pvalue" + randomVariable.toString()
    );
    currentCard = currentCard.replace(
      "{{uploadProgress}}",
      "perprogress" + randomVariable.toString()
    );
    currentCard = currentCard.replace(
      "{{closeButton}}",
      "progress" + randomVariable.toString()
    );
    currentCard = currentCard.replace(
      "{{closeButtonId}}",
      "close" + randomVariable.toString()
    );

    $("#progressList").append(currentCard);
  }

  //Set values
  var uploadValue = (value / 1048576).toFixed(2) / (max / 1048576).toFixed(2);
  $("#pvalue" + randomVariable).text(status);
  $("#perprogress" + randomVariable).text(valuePercent + "%");
  $("#perprogress" + randomVariable).attr(
    "style",
    "min-width: 2em; width: " + valuePercent + "%"
  );
  $("#perprogress" + randomVariable).attr("aria-valuenow", valuePercent);
  $("#perprogress" + randomVariable).attr("aria-valuemax", max);
}

var modalsReset = false;

function hideUploadModals() {
  if (modalsReset) {
    return;
  }
  try {
    //Resetting the modal
    $("#video-data-div #video_name").val("");
    $("#video-data-div #video_url").val("");
    $("#video-data-div #activation_date").val("");
    $("#video-data-div #video_file").val("");
    $("#vprogress").text("");
    $("#error").text("");
  } catch (e) {}
  try {
    $("#addNewCourseResource").modal("hide");
  } catch (e) {}

  try {
    $("#addNewDlpData").modal("hide");
  } catch (e) {}

  modalsReset = true;
}

function uploadToMogi(title, des, tags, file, randomVariable) {
  return new Promise((resolve, reject) => {
    let startTime = Date.now();
    // Initialize the Amazon Cognito credentials provider
    AWS.config.region = "ap-south-1"; // Region
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: "ap-south-1:e742ba97-3720-47cb-ba37-2e387c917d65",
    });

    var upload = new AWS.S3.ManagedUpload({
      partSize: 5 * 1024 * 1024,
      queueSize: 6,
      params: {
        Bucket: "mogi-mdt-test",
        Key: appId + "/" + Date.now() + "_" + file.name,
        Body: file,
        ACL: "public-read",
      },
    });
    var mbps = Date.now();
    var change = 0;
    var promise = upload.promise();
    console.log("Starting upload ..");
    upload.on("httpUploadProgress", (evt) => {
      mbps = Date.now();
      var value = evt.loaded;
      var max = evt.total;
      var valuePercent = ((value * 100) / max).toFixed(1);
      // defer.notify(((evt.loaded / evt.total) * 100).toFixed(2));
      var status = "UPLOADING";
      if (evt.loaded == evt.total) {
        status = "COMPLETED";
      } else {
        status = "UPLOADING";
      }
      updateVideoProgress(
        randomVariable,
        max,
        value,
        status,
        valuePercent,
        title
      );
      hideUploadModals();
    });

    promise.then((data) => {
      console.log(
        data,
        "\ntime taken",
        (Date.now() - startTime) / 1000,
        "secs"
      );

      const url = "https://tc.mogiapp.com/transcode";
      const dataToSend = {
        sourceUrl: data.Location,
        formats: [360, 480, 720],
        type: "hls",
        title: title,
        description: des,
        tags: tags,
        thumbnailTimestamps: [2000, 5000],
        enhance: false,
        webhook: {
            url: root + "mogiiWebHook", //Your webhook path
            method: "POST"
        }
      };

      const other_params = {
        headers: {
          "Content-Type": "application/json",
          "app-id": appId,
          "app-key": appKey,
        },
        body: JSON.stringify(dataToSend),
        method: "POST",
        // mode : "cors"
      };

      fetch(url, other_params)
        .then(function (response) {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Could not reach the API: " + response.statusText);
          }
        })
        .then(function (data) {
          let response = data;
          if (response.status.code == 200) {
            response.data.embedUrl =
              "https://speed.mogiio.com/embed/" + response.data._id;
            response.data.embedCode =
              '<iframe style="width: 100%;height:60vh;object-fit: fill;" src="' +
              response.embedUrl +
              '"></iframe>';
            resolve(response);
          } else {
            reject(response);
          }
        })
        .catch(function (error) {
          reject(error);
        });
    });
  });
}

function refreshVideoContent(classrooms, chapterId) {
  if (classrooms.indexOf(",") >= 0) {
    var classroomArray = classrooms.split(",");
    if (classroomArray.length > 0) {
      console.log("Fetching content again ..");
      //Only fetch content in case of DLP content screen where only one classroom is selected as content is not shown on DLP dashboard
      fetchTotalContentList(chapterId, classroomArray[0]);
    }
  }
}

function uploadWithProgress(fd, videoId, videoTitle, classrooms, chapterId) {
  var randomVariable = videoId;
  console.log("Video ID", randomVariable);

  hideUploadModals();

  $.ajax({
    url: "https://stream.junior-shahucollegelatur.org.in:9091/uploadFile",
    type: "POST",
    // Form data
    data: fd,
    // Tell jQuery not to process data or worry about content-type
    // You *must* include these options!
    cache: false,
    contentType: false,
    processData: false,

    // Custom XMLHttpRequest
    xhr: function () {
      var myXhr = $.ajaxSettings.xhr();
      if (myXhr.upload) {
        // For handling the progress of the upload
        myXhr.upload.addEventListener(
          "progress",
          function (e) {
            if (e.lengthComputable) {
              //console.log("Progress now:", e.loaded, e.total);
              var value = e.loaded;
              var max = e.total;
              var valuePercent = ((value * 100) / max).toFixed(1);
              var status = "";
              if (e.loaded == e.total) {
                status = "COMPLETED";
              } else {
                status = "UPLOADING";
              }
              //{{(upload.value / 1048576).toFixed(2)}}/{{(upload.max/ 1048576).toFixed(2)}}MB {{upload.status}}

              updateVideoProgress(
                randomVariable,
                max,
                value,
                status,
                valuePercent,
                videoTitle
              );
            }
          },
          false
        );
      }
      return myXhr;
    },
    success: function (response) {
      if (response == "SUCCESS") {
        console.log("Done!");
        $("#pvalue" + randomVariable).text("COMPLETED");

        //Update database for upload completed
        //Authenticate for token
        get_admin_token().then(function (result) {
          var resp = JSON.parse(result);
          if (
            resp != null &&
            resp.status == 200 &&
            resp.data != null &&
            resp.data.admin_token != null
          ) {
            var request = {
              lecture: {
                id: randomVariable,
                progress: 0,
                status: "Transcoding",
              },
            };
            console.log("Updating lecture progress", request);

            $.ajax({
              url: root + "updateVideoLecture",
              type: "post",
              dataType: "json",
              contentType: "application/json",
              success: function (response) {
                console.log("Update response", response);
                refreshVideoContent(classrooms, chapterId);
              },
              data: JSON.stringify(request),
            });
          } else {
            $scope.responseText =
              "Error authenticating the request .. Logout and try again";
          }
        });
      } else {
        console.log("Failed!");
        $("#pvalue" + randomVariable).text("FAILED");
      }
      //$scope.$apply();
    },
  });
}

function isCustomVideoSetup() {
  //Institutes which don't use mogii for video upload
  return instituteId == 4 || instituteId == 1037;
}

function createVideoLecture(
  videoTitle,
  subjectId,
  chapterId,
  classrooms,
  instituteId,
  file,
  activation_date
) {
  //Upload video first. Then get file name to upload to the streaming server
  var request = {
    lecture: {
      videoName: videoTitle,
      subjectId: subjectId,
      topicId: chapterId,
      instituteId: instituteId,
      size: file.size,
      type: "DLPVIDEO",
      activationDate: new Date(activation_date),
    },
    classrooms: classrooms,
  };

  modalsReset = false;
  //In case of mogii..upload first and then save lecture
  if (!isCustomVideoSetup()) {
    //Authenticate for token
    get_admin_token().then(function (result) {
      var resp = JSON.parse(result);
      if (
        resp != null &&
        resp.status == 200 &&
        resp.data != null &&
        resp.data.admin_token != null
      ) {
        var randomVariable = new Date().getTime();

        $("#vprogress").text("Preparing upload ..");

        uploadToMogi(videoTitle, "", "", file, randomVariable).then(
          (response) => {
            console.log("mogii success :) ", response);
            request.lecture.mogiiId = response.data._id;
            request.lecture.status = "Transcoding";
            $.ajax({
              url: root + "createVideoLecture",
              type: "post",
              dataType: "json",
              contentType: "application/json",
              success: function (response) {
                console.log("Create response", response, classrooms);

                refreshVideoContent(classrooms, chapterId);
              },
              data: JSON.stringify(request),
            });
          },
          (error) => {
            console.log("failed :(", error);
          },
          (progress) => {
            console.log("uploading: " + progress + "%");
            var uploadingPercentage = progress;
          }
        );
      } else {
        $scope.responseText =
          "Error authenticating the request .. Logout and try again";
      }
    });
  } else {
    $("#error").text("Saving info ...");
    console.log("Creating lecture", request);

    //Authenticate for token
    get_admin_token().then(function (result) {
      var resp = JSON.parse(result);
      if (
        resp != null &&
        resp.status == 200 &&
        resp.data != null &&
        resp.data.admin_token != null
      ) {
        $.ajax({
          url: root + "createVideoLecture",
          type: "post",
          dataType: "json",
          contentType: "application/json",
          success: function (response) {
            console.log("Create response", response);

            if (response.status.statusCode != 200) {
              //$scope.error = response.status.responseText;
              $("#error").text("Error in creating resource ...");
            } else {
              //$scope.success = "Starting upload ..";
              var fileName = response.lectures[0].lecture.id + ".mp4";
              var fd = new FormData();
              fd.append("file", file);
              fd.append("fileName", fileName);
              uploadWithProgress(
                fd,
                response.lectures[0].lecture.id,
                videoTitle,
                classrooms,
                chapterId
              );
            }
          },
          data: JSON.stringify(request),
        });
      } else {
        $scope.responseText =
          "Error authenticating the request .. Logout and try again";
      }
    });
  }
}

var documentUploadCounter = 0;

function uploadDoc(fd, count) {
  //Authenticate for token
  get_admin_token().then(function (result) {
    var resp = JSON.parse(result);
    if (
      resp != null &&
      resp.status == 200 &&
      resp.data != null &&
      resp.data.admin_token != null
    ) {
      token = resp.data.admin_token;
      $.ajax({
        url: root + "uploadContent",
        beforeSend: function (request) {
          request.setRequestHeader("AuthToken", token);
        },
        type: "POST",
        data: fd,
        success: function (msg) {
          // console.log("Response", msg);
          if (
            msg != null &&
            msg.status != null &&
            msg.status.statusCode == 200
          ) {
            documentUploadCounter++;
            if (count == documentUploadCounter) {
              console.log("All files done!");
              window.location.reload();
            }
          } else {
            $("#error").text(
              "Error in uploading some document. Please try again later."
            );
          }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          $("#error").text(
            "Error in uploading some document.. Please try again "
          );
        },
        cache: false,
        contentType: false,
        processData: false,
      });
    } else {
      $scope.responseText =
        "Error authenticating the request .. Logout and try again";
    }
  });
}

function uploadDocuments(subject_id, chapter_id, classrooms, instituteId) {
  var docs = document.getElementsByName("upload_doc_names[]");
  var files = document.getElementsByName("upload_documents[]");
  var activation_date = $("#activation_date").val();

  documentUploadCounter = 0;

  console.log("Inside upload docs ..");

  if (
    docs != null &&
    docs.length > 0 &&
    files != null &&
    files.length == docs.length
  ) {
    var i = 0;

    $("#error").text("Uploading " + docs.length + " files ... Please wait .. ");

    docs.forEach(function (doc) {
      if (!doc.disabled) {
        var file = files[i].files[0];

        var docObj = {
          lecture: {
            videoName: doc.value,
            subjectId: subject_id,
            topicId: chapter_id,
            instituteId: instituteId,
            size: file.size,
            type: "DOC",
            activationDate: new Date(activation_date),
          },
          classrooms: classrooms,
        };
        console.log("Uploading", docObj, file);
        i++;
        var fd = new FormData();
        fd.append("file", file);
        fd.append("request", JSON.stringify(docObj));
        uploadDoc(fd, docs.length);
      }
    });
  } else {
    alert(
      "No documents added! Please add at least one document to upload and provide a valid document title"
    );
  }
}

//In case of video file..use service..otherwise keep using existing flow
$("#addNewDlpData").submit(function (evt) {
  var resourceType = $("#resource_type").val();
  var video_url = $("#video_url").val();
  // console.log("Type " + resourceType + " URL " + video_url);
  if ((video_url == null || video_url == "") && resourceType != "TEST") {
    evt.preventDefault();
    // console.log("Form submit blocked ..");

    var maps = $("#add_classroom_id").val();
    var subject_id = $("#subject_id").val();
    var chapter_id = $("#chapter_id").val();
    var video_name = $("#video_name").val();

    if (resourceType == "VIDEO") {
      // console.log("Selected divisions", maps.toString());
      if (maps == null || maps.length == 0) {
        $("#error").text("Please select at least one course/division");
        return;
      }

      var f = document.getElementById("video_file").files[0];
      if (f == null || f == undefined) {
        $("#error").text("Please provide a file attachment or file URL");
        return;
      }

      if (f != null && f.name != null) {
        var extension = f.name.split(".").pop();
        // console.log("File:", f, "Extension", extension, "Type", $("#type").val());
        if (
          extension != "mp4" &&
          extension != "avi" &&
          extension != "m4v" &&
          extension != "3gp" &&
          extension != "wmv" &&
          extension != "mov" &&
          extension != "flv"
        ) {
          $("#error").text(
            "Please upload a valid video file. Only MP4 or AVI files supported."
          );
          return;
        }
        // else if ($("#type").val() == 'Image' && (extension != 'jpg' && extension != 'png' && extension != 'jpeg' && extension != 'bmp' && extension != 'gif')) {
        //     $("#fileError").text("Please upload a valid image file.");
        //     return;
        // } else if ($("#type").val() == 'Document') {
        //     if (extension == 'mp4' || extension == 'avi' || extension == 'dat' || extension == 'jpg' || extension == 'png' || extension == 'jpeg') {
        //         $("#fileError").text("Please upload a valid document. Choose type as Video/Image for media document.");
        //         return;
        //     }
        // }
      }

      var fd = new FormData();
      fd.append("data", f);
      fd.append("title", video_name);
      fd.append("subjectId", subject_id);
      fd.append("instituteId", instituteId);
      fd.append("topicId", chapter_id);
      fd.append("classrooms", maps.toString());
      fd.append("type", "DLPVIDEO");

      //Old changes works with Vimeo
      //uploadWithProgress(fd, video_name);

      //For custom server changes
      var activation_date = $("#activation_date").val();

      createVideoLecture(
        video_name,
        subject_id,
        chapter_id,
        maps.toString(),
        instituteId,
        f,
        activation_date
      );
    } else if (resourceType == "DOC") {
      console.log("Calling upload docs addNewDlpData ..");
      uploadDocuments(subject_id, chapter_id, maps.toString(), instituteId);
    }
  }
});

//addNewCourseResource
//In case of video file..use service..otherwise keep using existing flow
$("#addNewCourseResource").submit(function (evt) {
  var resourceType = $("#resource_type").val();
  var video_url = $("#video_url").val();
  // console.log("Type " + resourceType + " URL " + video_url + " chapter " + $("#chapter_id_input").val());
  if ((video_url == null || video_url == "") && resourceType != "TEST") {
    evt.preventDefault();
    // console.log("Form submit blocked ..");

    var video_name = $("#video_name").val();

    if (resourceType == "VIDEO") {
      var f = document.getElementById("video_file").files[0];
      if (f == null || f == undefined) {
        $("#error").text("Please provide a file attachment or file URL");
        return;
      }

      if (f != null && f.name != null) {
        var extension = f.name.split(".").pop();
        // console.log("File:", f, "Extension", extension, "Type", $("#type").val());
        if (
          extension != "mp4" &&
          extension != "avi" &&
          extension != "m4v" &&
          extension != "3gp" &&
          extension != "wmv" &&
          extension != "mov" &&
          extension != "flv"
        ) {
          $("#error").text(
            "Please upload a valid video file. Only MP4 or AVI files supported."
          );
          return;
        }
        // else if ($("#type").val() == 'Image' && (extension != 'jpg' && extension != 'png' && extension != 'jpeg' && extension != 'bmp' && extension != 'gif')) {
        //     $("#fileError").text("Please upload a valid image file.");
        //     return;
        // } else if ($("#type").val() == 'Document') {
        //     if (extension == 'mp4' || extension == 'avi' || extension == 'dat' || extension == 'jpg' || extension == 'png' || extension == 'jpeg') {
        //         $("#fileError").text("Please upload a valid document. Choose type as Video/Image for media document.");
        //         return;
        //     }
        // }
      }

      var fd = new FormData();
      fd.append("data", f);
      fd.append("title", video_name);
      //Subject ID not needed as it's mapped to chapter
      //fd.append('subjectId', subjectId);
      fd.append("instituteId", instituteId);
      var chapterId = $("#chapter_id_input").val();
      if (chapterId == null) {
        chapterId = $("#chapter_id").val();
      }
      fd.append("topicId", chapterId);
      if (
        $("#add_classroom_id") != null &&
        $("#add_classroom_id").val() != null
      ) {
        classroomId = $("#add_classroom_id").val();
      }
      fd.append("classrooms", classroomId + ",");
      fd.append("type", "DLPVIDEO");

      //Old changes works with Vimeo
      //uploadWithProgress(fd, video_name);

      //For custom server changes
      var activation_date = $("#activation_date").val();
      createVideoLecture(
        video_name,
        null,
        chapterId,
        classroomId + ",",
        instituteId,
        f,
        activation_date
      );
    } else if (resourceType == "DOC") {
      var subject_id = $("#subject_id").val();
      if (subject_id == null || subject_id == 0) {
        subject_id = $("#add_subject_id").val();
      }
      var maps = $("#add_classroom_id").val();
      var chapterId = $("#chapter_id_input").val();
      if (chapterId == null) {
        chapterId = $("#chapter_id").val();
      }
      console.log("Calling upload docs addNewResourceCourse ..");
      uploadDocuments(subject_id, chapterId, maps.toString(), instituteId);
    }
  }
});

$(document).ready(function () {
  $('[data-bs-toggle="tooltip"]').tooltip();
  var service = $("#serviceTrigger").html();
  var service_arr = service ? service.split("-") : [];
  if (service_arr[0]) {
    postdata = {
      test: {
        id: service_arr[1],
      },
      requestType: "NewExam",
    };
    var request = {
      lecture: {
        id: service_arr[1],
      },
      requestType: "NewClasswork",
    };
    //Load tokens first
    get_admin_token()
      .then(function (result) {
        var resp = JSON.parse(result);
        if (
          resp != null &&
          resp.status == 200 &&
          resp.data != null &&
          resp.data.admin_token != null
        ) {
          var url = rootAdmin + "sendNotification";
          $.ajax({
            type: "POST",
            url: url,
            beforeSend: function (request) {
              request.setRequestHeader("AuthToken", resp.data.admin_token);
            },
            data: JSON.stringify(request),
            success: function (result) {
              console.log("success");
            },
            dataType: "json",
            contentType: "application/json",
          });
        } else {
          alert(
            "Some error authenticating your request. Please clear your browser cache and try again."
          );
        }
      })
      .catch(function (error) {
        // An error occurred
        // alert("Exception: " + error);
      });
  }
});

// Updating the CHAPTER order in the DLP
function updateChapterOrder(resourceMappingId, value) {
  value = parseInt(value);

  Snackbar.show({
    pos: "top-center",
    text: "Updating...",
  });
  if (value && typeof value === "number") {
    var dataString =
      "resourceMappingId=" + resourceMappingId + "&chapterOrder=" + value;
    $.ajax({
      type: "POST",
      data: dataString,
      url: base_url + "/dlp/manage_chapter_entities",
      success: function (data) {
        console.log(data);
        if (data.trim() == "SUCCESS") {
          Snackbar.show({
            pos: "top-center",
            text: "Chapter order changed successfully. Reload to reflect new changes.",
          });
        } else {
          console.log("Failed." + data);
          Snackbar.show({
            pos: "top-center",
            text: "Error: " + data,
          });
        }
      },
    });
  } else {
    Snackbar.show({
      pos: "top-center",
      text: "Enter a number",
    });
  }
}

// Delete/disable chapter from classroom
function disableChapterFromClassroom(mappingId) {
  var result = confirm(
    "WARNING! Do you want to delete this chapter? This will remove the chapter from this classroom. This cannot be undone."
  );

  if (result) {
    Snackbar.show({
      pos: "top-center",
      text: "Please wait...",
    });
    // Deleting via ajax
    var dataString = "disableClassroomId=" + mappingId;
    $.ajax({
      type: "POST",
      data: dataString,
      url: base_url + "/dlp/manage_chapter_entities",
      success: function (data) {
        console.log(data);
        if (data.trim() == "SUCCESS") {
          Snackbar.show({
            pos: "top-center",
            text: "Chapter deleted successfully from the classroom. Reload to reflect new changes.",
          });
        } else {
          // console.log("Failed." + data);
          Snackbar.show({
            pos: "top-center",
            text: "Error: " + data,
          });
        }
      },
    });
  }
}

// Enable chapter from classroom
function enableChapterFromClassroom(mappingId) {
  // console.log("enableChapterFromClassroom: " + mappingId);

  var result = confirm(
    "WARNING! Do you want to enable this chapter? This will show the chapter in this classroom."
  );

  if (result) {
    Snackbar.show({
      pos: "top-center",
      text: "Please wait...",
    });
    var dataString = "enableChapterClassroomMappingId=" + mappingId;
    $.ajax({
      type: "POST",
      data: dataString,
      url: base_url + "/dlp/manage_chapter_entities",
      success: function (data) {
        console.log(data);
        if (data.trim() == "SUCCESS") {
          Snackbar.show({
            pos: "top-center",
            text: "Chapter enabled successfully from the classroom. Reload to reflect new changes.",
          });
        } else {
          // console.log("Failed." + data);
          Snackbar.show({
            pos: "top-center",
            text: "Error: " + data,
          });
        }
      },
    });
  }
}

// Delete/disable Subjects in the classroom along with linked chapters
function disableSubjectWithChapters(mappingId, courseId) {
  var result = confirm(
    "WARNING! Do you want to delete this subject? This will remove all chapters with this subject. This cannot be undone."
  );

  if (result) {
    Snackbar.show({
      pos: "top-center",
      text: "Please wait...",
    });
    var dataString =
      "disableSubjectMapId=" + mappingId + "&disableCourseId=" + courseId;
    $.ajax({
      type: "POST",
      data: dataString,
      url: base_url + "/dlp/manage_subject_entities",
      success: function (data) {
        console.log(data);
        if (data.trim() == "SUCCESS") {
          Snackbar.show({
            pos: "top-center",
            text: "Subject deleted successfully. Reload to reflect new changes.",
          });
        } else {
          // console.log("Failed." + data);
          Snackbar.show({
            pos: "top-center",
            text: "Error: " + data,
          });
        }
      },
    });
  }
}

// Enable Subjects in the classroom along with linked chapters
function enableSubjectWithChapters(mappingId, courseId) {
  var result = confirm("WARNING! Do you want to enable this subject?");

  if (result) {
    Snackbar.show({
      pos: "top-center",
      text: "Please wait...",
    });
    var dataString =
      "enableSubjectMapId=" + mappingId + "&enableCourseId=" + courseId;
    $.ajax({
      type: "POST",
      data: dataString,
      url: base_url + "/dlp/manage_subject_entities",
      success: function (data) {
        console.log(data);
        if (data.trim() == "SUCCESS") {
          Snackbar.show({
            pos: "top-center",
            text: "Subject enabled successfully. Reload to reflect new changes.",
          });
        } else {
          // console.log("Failed." + data);
          Snackbar.show({
            pos: "top-center",
            text: "Error: " + data,
          });
        }
      },
    });
  }
}

// Fetch course related subjects
function fetchCourseSubjects() {
  var classrooms = $("#add_classroom_id").select2("val");
  $("#course-loading-div").show();
  $("#subject-dropdown-div").html("");
  $("#chapters-dropdown-div").html("");
  $("#video-data-div").hide();
  $("#resource-type-div").hide();
  $("#resource_type").val("");
  $("#video-data-div").hide();
  $("#doc-data-div").hide();
  $("#submit-button").hide();

  var dataString = "classrooms=" + classrooms;
  $.ajax({
    type: "POST",
    data: dataString,
    url: base_url + "/classrooms/fetch_course_subjects",
    success: function (data) {
      $("#subject-dropdown-div").html(data);
      $("#course-loading-div").hide();
    },
  });
}

//Fetch course related chapters
function fetchCourseChapters(subjectSelect, courseId) {
  const value = subjectSelect.value;

  $("#subject-loading-div").show();
  $("#chapters-dropdown-div").html("");

  var dataString = "classrooms=" + courseId + "&subject_id=" + value;
  $.ajax({
    type: "POST",
    data: dataString,
    url: base_url + "/classrooms/fetch_course_chapters",
    success: function (data) {
      $("#chapters-dropdown-div").html(data);
      $("#subject-loading-div").hide();
      $("#resource-type-div").show();
    },
  });
}

// Updating the content order of the resource
function updateContentOrder(resourceMappingId, value) {
  value = parseInt(value);

  Snackbar.show({
    pos: "top-center",
    text: "Updating...",
  });

  if (value && typeof value === "number") {
    var dataString =
      "resourceMappingId=" + resourceMappingId + "&contentOrder=" + value;
    $.ajax({
      type: "POST",
      data: dataString,
      url: base_url + "/dlp/manage_chapter_entities",
      success: function (data) {
        console.log(data);
        if (data.trim() == "SUCCESS") {
          Snackbar.show({
            pos: "top-center",
            text: "Content order updated successfully. Reload to reflect new order.",
          });
        } else {
          // console.log("Failed." + data);
          Snackbar.show({
            pos: "top-center",
            text: "Error: " + data,
          });
        }
      },
    });
  } else {
    Snackbar.show({
      pos: "top-center",
      text: "Enter a number",
    });
  }
}

// To delete the resource
function deleteCourseResource(resourceMappingId, resourceType) {
  if (resourceType === "TEST") {
    var result = confirm(
      "WARNING! Do you want to delete this test from this chapter? This cannot be undone."
    );
  } else {
    var result = confirm(
      "WARNING! Do you want to delete this resource? This cannot be undone."
    );
  }

  if (result) {
    Snackbar.show({
      pos: "top-center",
      text: "Please wait...",
    });
    // Deleting via ajax
    var dataString =
      "resourceMappingId=" + resourceMappingId + "&resourceType=resourceType";
    $.ajax({
      type: "POST",
      data: dataString,
      url: base_url + "/dlp/manage_chapter_entities",
      success: function (data) {
        console.log(data);
        if (data.trim() == "SUCCESS") {
          Snackbar.show({
            pos: "top-center",
            text: "Course content disabled/deleted successfully.",
          });
        } else {
          Snackbar.show({
            pos: "top-center",
            text: "Error: " + data,
          });
        }
      },
    });
  }
}

// To enable the disabled resource
function enableCourseResource(resourceMappingId) {
  var result = confirm("WARNING! Do you want to enable this resource?");

  if (result) {
    Snackbar.show({
      pos: "top-center",
      text: "Please wait...",
    });
    // Deleting via ajax
    var dataString =
      "resourceMappingId=" + resourceMappingId + "&processType=enableResource";
    $.ajax({
      type: "POST",
      data: dataString,
      url: base_url + "/dlp/manage_chapter_entities",
      success: function (data) {
        console.log(data);
        if (data.trim() == "SUCCESS") {
          Snackbar.show({
            pos: "top-center",
            text: "Course content enabled successfully.",
          });
        } else {
          // console.log("Failed." + data);
          Snackbar.show({
            pos: "top-center",
            text: "Error: " + data,
          });
        }
      },
    });
  }
}

//Fetch course related tests/assignments
function fetchCourseTests(value) {
  // console.log("fetchCourseTests " + value);

  $("#course-loading-div").show();
  $("#tests-dropdown-div").html("");

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      // document.getElementById("chapters-list-content").innerHTML = this.responseText;
      $("#tests-dropdown-div").html(this.responseText);
      $("#course-loading-div").hide();

      $(".js-example-basic-single").select2();
    } else {
      // console.log(this.responseText);
    }
  };
  xmlhttp.open("GET", base_url + "/dlp/fetch_course_tests/" + value, true);
  xmlhttp.send();
}
