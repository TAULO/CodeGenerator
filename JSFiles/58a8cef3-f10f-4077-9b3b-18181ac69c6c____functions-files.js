'use strict';

// Import Node Modules.
// ----------------------
require('dotenv').config(); // Load the dotenv dependency and call the config method on the imported object.

const gSystemConfig = require('../config-application.js'); // System configuration.
// const dbSystemCon = require("../config-application-db.js").dbSystemCon; // DB System - simple connection.
// const dbSystemConPool = require("../config-application-db.js").dbSystemConPool; // DB System - pool connection.

const FunctionsGeneric = require('./functions-generic.js');
// const FunctionsDB = require("./functions-db.js");

// require("dotenv").config(); // Load the dotenv dependency and call the config method on the imported object.
// const mysql = require("mysql"); // MySQL package.
const _ = require('lodash');
const fs = require('fs'); // File System
const fsExtra = require('fs-extra'); // File System
const path = require('path'); // Necessary to serve static files.

const http = require('http');

const AWS = require('aws-sdk');
/**/
let s3 = new AWS.S3({ // eslint-disable-line
  accessKeyId: process.env.CONFIG_API_AWS_S3_ID,
  secretAccessKey: process.env.CONFIG_API_AWS_S3_KEY,
  // apiVersion: '2006-03-01'
});
// var s3Stream = require('s3-upload-stream')(s3);
// ----------------------

module.exports = class FunctionsFiles {
  // Upload files function.
  // **************************************************************************************
  /**
     * Upload files function.
     * @static
     * @async
     * @param {string} idRecord 
     * @param {object} postedFile 
     * @param {string} directoryUpload c:\directory\subdirectory | gSystemConfig.configDirectoryFilesUpload
     * @param {string} fileNameFinal optional
     * @returns {object} {returnStatus: false, returnFileName: ""} 
     * @example SyncSystemNS.FunctionsFiles.filesUpload(tblCategoriesID, 
                                                    this.openedFiles, 
                                                    gSystemConfig.configDirectoryFilesUpload, 
                                                    "");
     * 
     */
  // static filesUpload(idRecord, postedFile, directoryUpload, fileNameFinal)
  static async filesUpload(idRecord, postedFile, directoryUpload, fileNameFinal = '') {
    // Variables.
    // ----------------------
    // let strReturn = false;
    // eslint-disable-next-line
    let strReturn = { returnStatus: false, returnFileName: '' }; // {returnStatus: false, returnFileName: ""}

    const fileTempPath = postedFile[0].path; // temporary file + path of our uploaded file
    const fileNameOriginal = postedFile[0].name; // the file name of the uploaded file

    // let arrFileExtension = '';
    // let fileExtension = path.extname(formParseResults.files.image_main.path).toLowerCase();
    let fileExtension = '';
    let fileName = '';

    /* Location where we want to copy the uploaded file */
    // let new_location = 'c:/localhost/nodejs/';
    // let new_location = gSystemConfig.configPhysicalPathRoot + "/" + gSystemConfig.configDirectoryFilesVisualization + "/";
    const directoryFilesUpload = directoryUpload + '\\';
    // ----------------------

    if (fileNameOriginal !== '') {
      // check if file was posted.
      // Define values.
      fileExtension = path.extname(fileNameOriginal).toLowerCase();
      fileName = idRecord + fileExtension;

      strReturn.returnFileName = fileName;

      // Check if it´s an image (for resizing and copying an original file size).
      // if(gSystemConfig.configImageQuality.indexOf(fileExtension) !== -1)
      if (gSystemConfig.configImageFormats.includes(fileExtension) == true) {
        // Include prefix for recording the original size image.
        fileName = 'o' + fileName;
      }
      // console.log("configImageFormats.includes(fileExtension)=", gSystemConfig.configImageFormats.includes(fileExtension)); // debug

      // Copy file.
      // ----------------------
      // fsExtra.copy(temp_path, new_location + file_name, function(err){
      // fsExtra.copy(fileTempPath, directoryFilesUpload + fileName, function(fileCopyError){
      // return await new Promise((resolve, reject)=>{
      let resultsFSExtraCopy = await new Promise((resolve, reject) => { // eslint-disable-line
        // let resultsFSExtraCopy = new Promise((resolve, reject)=>{
        fsExtra.copy(fileTempPath, directoryFilesUpload + fileName, (fileCopyError) => {
          if (fileCopyError) {
            // Error.
            if (gSystemConfig.configDebug === true) {
              // console.error("File copy error: " + fileCopyError);
              console.log(FunctionsGeneric.appLabelsGet(gSystemConfig.configLanguageBackend.appLabels, 'statusMessage17e'));
              console.error(fileCopyError);
            }
            reject(false);
          } else {
            if (gSystemConfig.configDebug === true) {
              // console.log("File copy success.");
              console.log(FunctionsGeneric.appLabelsGet(gSystemConfig.configLanguageBackend.appLabels, 'statusMessage17'));
            }
            resolve(true);

            /*
            fs.unlink(fileTempPath, (fileDeleError)=>{
                        // fs.unlinkSync(fileTempPath, (fileDeleError)=>{
                            if(fileDeleError)
                            {
                                // Error.
                                if(gSystemConfig.configDebug === true)
                                {
                                    console.log("File deleting error: ", fileDeleError);
                                }
                                // throw fileDeleError;
                                // reject(new Error(fileDeleError));
                                reject(false);
                            }else{
                                if(gSystemConfig.configDebug === true)
                                {
                                    console.log("File deleting sucess.");
                                }
                                // resolve(results);
                                resolve(true);

                                // Define file name.
                                // tblCategoriesImageMain = fileName;
                            }
                        });*/
          }
        });
      });
      // ----------------------

      // Define value.
      // strReturn = resultsFSExtraCopy;
      strReturn.returnStatus = resultsFSExtraCopy;
      // strReturn.returnFileName = fileName;
    } else {
      strReturn.returnStatus = true;
    }

    // Delete temporary file.
    // if(fileNameOriginal !== "") // check if file was posted.
    // {
    // if(strReturn.returnStatus == true)
    // {
    fs.unlink(fileTempPath, (fileDeleteError) => {
      // fs.unlinkSync(fileTempPath, (fileDeleteError)=>{
      if (fileDeleteError) {
        // Error.
        if (gSystemConfig.configDebug === true) {
          // console.log("File deleting error: ", fileDeleteError);
          console.log(FunctionsGeneric.appLabelsGet(gSystemConfig.configLanguageBackend.appLabels, 'statusMessage6e'), fileDeleteError);
        }
        // throw fileDeleteError;
        // reject(new Error(fileDeleteError));
        // reject(false);
      } else {
        if (gSystemConfig.configDebug === true) {
          // console.log("File deleting sucess.");
          console.log(FunctionsGeneric.appLabelsGet(gSystemConfig.configLanguageBackend.appLabels, 'statusMessage6'));
        }
        // resolve(results);
        // resolve(true);

        // Define file name.
        // tblCategoriesImageMain = fileName;
      }
    });
    // }
    // }

    // Debug.
    // console.log("fileNameOriginal=", fileNameOriginal);
    // console.log("fileTempPath=", fileTempPath);
    // console.log("fileNameOriginal=", fileNameOriginal);
    // console.log("postedFile=", postedFile);

    return strReturn;

    // Usage.
    /*
        var resultsFunctionsFiles = await new Promise((resolve, reject)=>{
            // resultsFunctionsFiles = await new Promise((resolve, reject)=>{
            SyncSystemNS.FunctionsFiles.filesUpload(tblCategoriesID, 
                                                    this.openedFiles, 
                                                    gSystemConfig.configDirectoryFilesUpload, 
                                                    "")
            .then(function(results){
                if(results === undefined)
                {
                    // Error.
                    if(gSystemConfig.configDebug === true)
                    {
                        console.log(SyncSystemNS.FunctionsGeneric.appLabelsGet(gSystemConfig.configLanguageBackend.appLabels, "statusMessage17e"));
                    }
                    // reject(new Error("nCounterUpdate is undefined."));
                    reject(false);
                }else{
                    // Success.
                    if(gSystemConfig.configDebug === true)
                    {
                        console.log(SyncSystemNS.FunctionsGeneric.appLabelsGet(gSystemConfig.configLanguageBackend.appLabels, "statusMessage17"));
                    }
                    resolve(results);
                } // working
            });
        });
        */
  }
  // **************************************************************************************

  // Upload multiple files function.
  // **************************************************************************************
  /**
     * Upload multiple files function.
     * @static
     * @async
     * @param {string} idRecord 
     * @param {object} postedFile 
     * @param {string} directoryUpload c:\directory\subdirectory | gSystemConfig.configDirectoryFilesUpload
     * @param {string} formFilePost optional
     * @param {string} fileNameFinal optional
     * @returns {object} {returnStatus: false, file_field_name1: "", file_field_name1: ""} 
     * @example SyncSystemNS.FunctionsFiles.filesUpload(tblCategoriesID, 
                                                    this.openedFiles, 
                                                    gSystemConfig.configDirectoryFilesUpload, 
                                                    "");
     * 
     */
  // static async filesUploadMultiple(idRecord, postedFile, directoryUpload, formFilePost, fileNameFinal = "")
  // static filesUpload(idRecord, postedFile, directoryUpload, fileNameFinal)
  static async filesUploadMultiple(idRecord, postedFile, directoryUpload, fileNameFinal = '', formfileFieldsReference = {}) {
    // formFilePost: (form parse object)
    // formfileFieldsReference: {fileFieldName: {originalFileName: "", fileSize: 0, temporaryFilePath: "", fileNamePrefix: "", fileNameSufix: "", fileDirectoryUpload: ""}}

    // Variables.
    // ----------------------
    // let strReturn = false;
    let strReturn = { returnStatus: false }; // {returnStatus: false, returnFileName: ""}
    // ----------------------

    if (!_.isEmpty(formfileFieldsReference)) {
      // Debug.
      // console.log('formfileFieldsReference=', formfileFieldsReference);
      // console.log('_.isEmpty(formfileFieldsReference)=', _.isEmpty(formfileFieldsReference));

      // Loop through postedFile.
      // console.log("Loop through postedFile (inside filesUploadMultiple).");
      for (let countArrayPostedFiles = 0; countArrayPostedFiles < postedFile.length; countArrayPostedFiles++) {
        // Variables.
        // ----------------------
        const fileTempPath = postedFile[countArrayPostedFiles].path; // temporary file + path of our uploaded file
        const fileNameOriginal = postedFile[countArrayPostedFiles].name; // the file name of the uploaded file

        // let arrFileExtension = '';
        // let fileExtension = path.extname(formParseResults.files.image_main.path).toLowerCase();
        let fileExtension = '';
        let fileName = '';

        const directoryFilesUpload = directoryUpload + '\\';
        // ----------------------

        // if(fileNameOriginal != "")
        if (fileNameOriginal !== '') {
          // if(fileNameOriginal)
          // Debug.
          // console.log("fileNameOriginal!=''=true");
          // console.log("fileNameOriginal=", fileNameOriginal);

          // Define values.
          fileExtension = path.extname(fileNameOriginal).toLowerCase();
          fileName = idRecord + fileExtension;

          // Loop through form file field references.
          for (const iObject in formfileFieldsReference) {
            // if(formfileFieldsReference.hasOwnProperty(formfileFieldsReferenceProperty))
            // {
            if (formfileFieldsReference[iObject].temporaryFilePath == postedFile[countArrayPostedFiles].path) {
              // Prefix.
              fileName = formfileFieldsReference[iObject].fileNamePrefix + fileName;

              // Sufix.
              // Break filename on extension, add sufix and concatinate back.

              // Add file name to return object.
              // strReturn[iObject] = "id" + countArrayPostedFiles; // debug / test
              strReturn[iObject] = fileName;

              // Debug.
              // console.log("iObject.temporaryFilePath=", formfileFieldsReferenceObject[iObject]);
              // console.log("iObject=", iObject);
              // console.log("formfileFieldsReference[iObject].temporaryFilePath=", formfileFieldsReference[iObject].temporaryFilePath);
            }
            // }
          }

          // Check if it´s an image (for resizing and copying an original file size).
          // if(gSystemConfig.configImageQuality.indexOf(fileExtension) !== -1)
          if (gSystemConfig.configImageFormats.includes(fileExtension) === true) {
            // Include prefix for recording the original size image.
            fileName = 'o' + fileName;
          }

          // Copy file.
          // ----------------------
          // fsExtra.copy(temp_path, new_location + file_name, function(err){
          // fsExtra.copy(fileTempPath, directoryFilesUpload + fileName, function(fileCopyError){
          // return await new Promise((resolve, reject)=>{
          const resultsFSExtraCopy = await new Promise((resolve, reject) => {
            // let resultsFSExtraCopy = new Promise((resolve, reject)=>{
            fsExtra.copy(fileTempPath, directoryFilesUpload + fileName, (fileCopyError) => {
              if (fileCopyError) {
                // Error.
                if (gSystemConfig.configDebug === true) {
                  // console.error("File copy error: " + fileCopyError);
                  console.log(FunctionsGeneric.appLabelsGet(gSystemConfig.configLanguageBackend.appLabels, 'statusMessage17e'));
                  console.error(fileCopyError);
                }
                reject(false);
              } else {
                if (gSystemConfig.configDebug === true) {
                  // console.log("File copy success.");
                  console.log(FunctionsGeneric.appLabelsGet(gSystemConfig.configLanguageBackend.appLabels, 'statusMessage17'));
                }
                resolve(true);

                /*
                fs.unlink(fileTempPath, (fileDeleError)=>{
                              // fs.unlinkSync(fileTempPath, (fileDeleError)=>{
                                  if(fileDeleError)
                                  {
                                      // Error.
                                      if(gSystemConfig.configDebug === true)
                                      {
                                          console.log("File deleting error: ", fileDeleError);
                                      }
                                      // throw fileDeleError;
                                      // reject(new Error(fileDeleError));
                                      reject(false);
                                  }else{
                                      if(gSystemConfig.configDebug === true)
                                      {
                                          console.log("File deleting sucess.");
                                      }
                                      // resolve(results);
                                      resolve(true);

                                      // Define file name.
                                      // tblCategoriesImageMain = fileName;
                                  }
                              });*/
              }
            });
          });
          // ----------------------

          // AWS S3.
          // ----------------------
          if (resultsFSExtraCopy === true) {
            if (gSystemConfig.configUploadType === 2) {
              // if(fileNameOriginal != "")
              // {
              const fileContent = fs.readFileSync(directoryFilesUpload + fileName);

              /*
                          const s3 = new AWS.S3({
                              accesssKeyId: process.env.CONFIG_API_AWS_S3_ID,
                              secretAccessKey: process.env.CONFIG_API_AWS_S3_KEY
                          })
                          */

              const uploadParameters = {
                Bucket: process.env.CONFIG_API_AWS_S3_BUCKET,
                Key: fileName,
                // Key: fileNameOriginal,
                // Body: postedFile[countArrayPostedFiles] // didn´t work
                // Body: postedFile
                Body: fileContent,
              };

              // Include content type if it´s an image.
              // Note: So it won´t donwloa the file with link to it.
              if (gSystemConfig.configImageFormats.includes(fileExtension) == true) {
                uploadParameters.ContentType = 'image/jpeg';
              }

              s3.upload(uploadParameters, (s3UploadError, s3DataReturn) => {
                if (s3UploadError) {
                  if (gSystemConfig.configDebug === true) {
                    console.log('s3UploadError=', s3UploadError);
                  }
                }

                // Debug.
                // console.log("s3DataReturn=", s3DataReturn)
              });

              /*
                          var start = new Date().getTime();
                          var upload = s3Stream.upload({
                              "Bucket": process.env.CONFIG_API_AWS_S3_BUCKET,
                              "Key": fileNameOriginal
                          });

                          upload.concurrentParts(5);

                          //  Handle errors.
                          upload.on('error', function (error) {
                              console.log('errr(inside filesUpload)=',error);
                          });
                          
                          postedFile[countArrayPostedFiles].pipe(upload);
                          */

              // Debug.
              // console.log("postedFile[countArrayPostedFiles](inside filesUpload)=", postedFile[countArrayPostedFiles]);
              // console.log("postedFile (inside filesUpload)=", postedFile);
              // console.log("fileContent (inside filesUpload)=", fileContent);
              // }
            }
          }
          // ----------------------

          // Define value.
          // strReturn = resultsFSExtraCopy;
          strReturn.returnStatus = resultsFSExtraCopy;
          // strReturn.returnFileName = fileName;
        } else {
          strReturn.returnStatus = true;
        }

        // Delete temporary file.
        // if(fileNameOriginal !== "") // check if file was posted.
        // if(fileNameOriginal) // check if file was posted.
        // {
        // if(strReturn.returnStatus == true)
        // {
        fs.unlink(fileTempPath, (fileDeleError) => {
          // fs.unlinkSync(fileTempPath, (fileDeleError)=>{
          if (fileDeleError) {
            // Error.
            if (gSystemConfig.configDebug === true) {
              console.log('File deleting error: ', fileDeleError);
            }
            // throw fileDeleError;
            // reject(new Error(fileDeleError));
            // reject(false);
          } else {
            if (gSystemConfig.configDebug === true) {
              console.log('File deleting sucess.');
            }
            // resolve(results);
            // resolve(true);

            // Define file name.
            // tblCategoriesImageMain = fileName;
          }
        });
        // }
        // }

        // Debug.
        // console.log("fileTempPath=", postedFile[countArrayPostedFiles].path);
        // console.log("fileNameOriginal=", postedFile[countArrayPostedFiles].name);
        // console.log("fileNameOriginal=", fileNameOriginal);
      }

      // Debug.
      // console.log("filesPost=", filesPost);
      // console.log("formfileFieldsReference=", formfileFieldsReference);
      // console.log("strReturn=", strReturn);
    } else {
      strReturn = { returnStatus: true };
    }

    return strReturn;

    // Usage.
    /*
    let resultsFunctionsFiles = await new Promise((resolve, reject)=>{
        // resultsFunctionsFiles = await new Promise((resolve, reject)=>{
        SyncSystemNS.FunctionsFiles.filesUploadMultiple(tblCategoriesID, 
                                                        this.openedFiles, 
                                                        gSystemConfig.configDirectoryFilesUpload, 
                                                        "", 
                                                        formfileFieldsReference)
        .then(function(results){
            if(results === undefined)
            {
                // Error.
                if(gSystemConfig.configDebug === true)
                {
                    console.log(SyncSystemNS.FunctionsGeneric.appLabelsGet(gSystemConfig.configLanguageBackend.appLabels, "statusMessage17e"));
                }
                // reject(new Error("nCounterUpdate is undefined."));
                reject(false);
            }else{
                // Success.
                if(gSystemConfig.configDebug === true)
                {
                    console.log(SyncSystemNS.FunctionsGeneric.appLabelsGet(gSystemConfig.configLanguageBackend.appLabels, "statusMessage17"));
                }
                resolve(results);
            } // working
        });
    });
    */
  }
  // **************************************************************************************

  // Delete files on server.
  // **************************************************************************************
  /**
   * Delete files on server.
   * @static
   * @param {string} fileName
   * @param {string} directoryName
   * @param {array} arrImageSize
   * @returns {object} {returnStatus: false, nRecords: 0}
   */
  static async fileDelete02(fileName, directoryName = '', arrImageSize = null) {
    // TODO: Review logic - nRecords not returning quantities - may need a promise.

    // Variables.
    // ----------------------
    let objReturn = { returnStatus: true, nRecords: 0 }; // eslint-disable-line
    let strDirectoryName = directoryName;
    // ----------------------

    // Default values.
    if (strDirectoryName == '') {
      strDirectoryName = gSystemConfig.configDirectoryFilesUpload;
    }

    // Logic.
    // ----------------------
    try {
      if (fileName) {
        // if(arrImageSize !== null)
        if (arrImageSize) {
          // Delete original file.
          const fileOriginalDeletePath = strDirectoryName + '\\' + 'o' + fileName;

          fs.access(fileOriginalDeletePath, (fileAccessError) => {
            // ref: https:// stackoverflow.com/questions/4482686/check-synchronously-if-file-directory-exists-in-node-js
            if (!fileAccessError) {
              // File exists.
              fs.unlink(fileOriginalDeletePath, (fileDeleteError) => {
                if (fileDeleteError) {
                  // Error.
                  if (gSystemConfig.configDebug === true) {
                    // console.log("File deleting error: ", fileDeleteError);
                    console.log(FunctionsGeneric.appLabelsGet(gSystemConfig.configLanguageBackend.appLabels, 'statusMessage6e'), fileDeleteError);
                  }
                  objReturn.returnStatus = false;
                } else {
                  if (gSystemConfig.configDebug === true) {
                    // console.log("File deleting sucess.");
                    console.log(FunctionsGeneric.appLabelsGet(gSystemConfig.configLanguageBackend.appLabels, 'statusMessage6'));
                  }

                  objReturn.nRecords = objReturn.nRecords + 1;
                  // objReturn.returnStatus = true;
                }
              });
            } else {
              if (gSystemConfig.configDebug === true) {
                // console.error(fileAccessError)
              }
            }

            // AWS S3.
            if (gSystemConfig.configUploadType === 2) {
              const deleteParameters = {
                Bucket: process.env.CONFIG_API_AWS_S3_BUCKET,
                Key: 'o' + fileName,
              };

              // s3.deleteObject(deleteParameters, function (s3DeleteError, s3DataReturn) {
              s3.deleteObject(deleteParameters, (s3DeleteError, s3DataReturn) => {
                if (s3DeleteError) {
                  if (gSystemConfig.configDebug === true) {
                    console.log(s3DeleteError, s3DeleteError.stack);
                  }
                } else {
                  // Debug.
                  console.log('s3DataReturn=', s3DataReturn);
                }
              });
            }
          });

          // Delete - multiple files.
          // Loop through array.
          for (let arrCountImageSize = 0; arrCountImageSize < arrImageSize.length; arrCountImageSize++) {
            const arrImageSizeParameters = arrImageSize[arrCountImageSize].split(';');
            let imagePrefix = arrImageSizeParameters[0];
            if (imagePrefix == 'NULL') {
              imagePrefix = '';
            }
            const fileDeletePath = strDirectoryName + '\\' + imagePrefix + fileName;
            // let imageW = arrImageSizeParameters[1];
            // let imageH = arrImageSizeParameters[2];

            fs.access(fileDeletePath, (fileAccessError) => {
              if (!fileAccessError) {
                // File exists.
                fs.unlink(fileDeletePath, (fileDeleteError) => {
                  if (fileDeleteError) {
                    // Error.
                    if (gSystemConfig.configDebug === true) {
                      // console.log("File deleting error: ", fileDeleteError);
                      console.log(FunctionsGeneric.appLabelsGet(gSystemConfig.configLanguageBackend.appLabels, 'statusMessage6e'), fileDeleteError);
                    }
                    objReturn.returnStatus = false;

                    // throw fileDeleError;
                    // reject(new Error(fileDeleError));
                    // reject(false);
                  } else {
                    if (gSystemConfig.configDebug === true) {
                      // console.log("File deleting sucess.");
                      console.log(FunctionsGeneric.appLabelsGet(gSystemConfig.configLanguageBackend.appLabels, 'statusMessage6'));
                    }

                    objReturn.nRecords = objReturn.nRecords + 1;
                    // objReturn.returnStatus = true;
                    // resolve(results);
                    // resolve(true);

                    // Define file name.
                    // tblCategoriesImageMain = fileName;
                  }

                  // AWS S3.
                  if (gSystemConfig.configUploadType === 2) {
                    const deleteParameters = {
                      Bucket: process.env.CONFIG_API_AWS_S3_BUCKET,
                      Key: imagePrefix + fileName,
                    };

                    // s3.deleteObject(deleteParameters, function (s3DeleteError, s3DataReturn) {
                    s3.deleteObject(deleteParameters, (s3DeleteError, s3DataReturn) => {
                      if (s3DeleteError) {
                        if (gSystemConfig.configDebug === true) {
                          console.log(s3DeleteError, s3DeleteError.stack);
                        }
                      } else {
                        // Debug.
                        console.log('s3DataReturn=', s3DataReturn);
                      }
                    });
                  }
                });
              } else {
                if (gSystemConfig.configDebug === true) {
                  // console.error(fileAccessError)
                }
              }
            });

            // Debug.
            /*
                        console.log("arrImageSize = " + arrImageSize[arrCountImageSize]);
                        console.log("imagePrefix = " + imagePrefix);
                        console.log("fileDeletePath = " + fileDeletePath);
                        console.log("\n");
                        */
          }
        } else {
          // Delete - single file.
          const fileDeletePath = strDirectoryName + '\\' + fileName;

          fs.access(fileDeletePath, (fileAccessError) => {
            if (!fileAccessError) {
              // File exists.
              fs.unlink(fileDeletePath, (fileDeleteError) => {
                if (fileDeleteError) {
                  // Error.
                  if (gSystemConfig.configDebug === true) {
                    // console.log("File deleting error: ", fileDeleteError);
                    console.log(FunctionsGeneric.appLabelsGet(gSystemConfig.configLanguageBackend.appLabels, 'statusMessage6e'), fileDeleteError);
                  }
                  objReturn.returnStatus = false;
                } else {
                  if (gSystemConfig.configDebug === true) {
                    // console.log("File deleting sucess.");
                    console.log(FunctionsGeneric.appLabelsGet(gSystemConfig.configLanguageBackend.appLabels, 'statusMessage6'));
                  }

                  objReturn.nRecords = objReturn.nRecords + 1;
                  // objReturn.nRecords = 1;
                  // objReturn.nRecords++;
                  // objReturn.returnStatus = true;
                }
                // objReturn.nRecords = 1;

                // AWS S3.
                if (gSystemConfig.configUploadType === 2) {
                  const deleteParameters = {
                    Bucket: process.env.CONFIG_API_AWS_S3_BUCKET,
                    Key: fileName,
                  };

                  // s3.deleteObject(deleteParameters, function (s3DeleteError, s3DataReturn) {
                  s3.deleteObject(deleteParameters, (s3DeleteError, s3DataReturn) => {
                    if (s3DeleteError) {
                      if (gSystemConfig.configDebug === true) {
                        console.log(s3DeleteError, s3DeleteError.stack);
                      }
                    } else {
                      // Debug.
                      if (gSystemConfig.configDebug === true) {
                        console.log('s3DataReturn=', s3DataReturn);
                      }
                    }
                  });
                }
              });
            } else {
              if (gSystemConfig.configDebug === true) {
                // console.error(fileAccessError)
              }
            }
          });

          // Debug.
          if (gSystemConfig.configDebug === true) {
            console.log('fileDeletePath = ' + fileDeletePath);
          }
        }
      }
    } catch (error) {
      // TODO:
    } finally {
      // Debug.
      if (gSystemConfig.configDebug === true) {
        console.log('strDirectoryName = ' + strDirectoryName);
        console.log('objReturn=', objReturn);
      }
    }

    return objReturn;
    // ----------------------
  }
  // **************************************************************************************

  // Function do download files.
  // Note: Not yet tested.
  // **************************************************************************************
  /**
     * Function do download files.
     * @static
     * @async
     * @param {string} fileName 
     * @param {string} directoryDownload c:\directory\subdirectory | gSystemConfig.configDirectoryFilesUpload
     * @returns {object} {returnStatus: false, file_field_name1: "", file_field_name1: ""} 
     * @example SyncSystemNS.FunctionsFiles.filesUpload(tblCategoriesID, 
                                                    this.openedFiles, 
                                                    gSystemConfig.configDirectoryFilesUpload, 
                                                    "");
     * 
     */
  static async fileDownload(fileName, directoryDownload = gSystemConfig.configDirectoryFilesUpload) {
    const fileDownload = fs.createWriteStream(fileName);
    // let request = http.get(directoryDownload + '/' + fileName, function (response) {
    const request = http.get(directoryDownload + '/' + fileName, (response) => {
      response.pipe(fileDownload);
    });
  }
  // **************************************************************************************
};
