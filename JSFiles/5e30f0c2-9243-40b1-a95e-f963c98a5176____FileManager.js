/*
  @Author: Juraj Ciljak
  @email:juraj.ciljak@accenture.com
  @LastModified: 16.4.2015
  					 Martin Opaterny - Creating folder for storing files. Opening files by clicking on their name
  					 Juraj Ciljak	 - Merge Martin's code
  				 20.03.2015
  @Description: Object for saving blob file on the local device
*/

var FileManager = new jsFileManager();

function jsFileManager() {
	this.baseWindows = null;
	this.fileName = "test.txt";
	this.fSystem = null;
	this.isInitialized = false;
	this.Folder = "Wartsila"; //name of the folder to be created

	this.createFileBlob = function(FileName,Data){
		try{
			FileManager.fileName = FileName;
			FileManager.gotjFSBlob(this.fSystem,FileName,Data);
		}
		catch(err){
			storeExternalError(err, {"Where":"FileManager - createFileBlob","FileName":FileName,"Data":Data});	
		}
	};

	this.gotjFSBlob = function(fileSystem,FileName,Data){
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotInFS, function(error){
			storeExternalError(error, {"Where":"FileManager - gotjFSBlob - requestFileSystem","FileName":FileName,"Data":Data});
		}); //creating folder, writing files
		function gotInFS(fileSystem){ //functions need to be nested{
			try{
				fileSystem.root.getDirectory(FileManager.Folder, {create: true}, gotInDir); //creating 'Wartsila' folder in root directory
			}catch(err) {
				storeExternalError(err, {"Where":"FileManager - gotjFSBlob - gotInFS","FileName":FileName,"Data":Data});
			}
		}
		function gotInDir(dirEntry){
			dirEntry.getFile( FileName, {create: true, exclusive: false}, //writes files into /Wartsila folder
				function(fileEntry){
					gotjFileEntryBlob(fileEntry,Data);
				},
				function(err){
					storeExternalError(err, {"Where":"FileManager - gotjFSBlob - gotInDir","FileName":FileName,"Data":Data,"dirEntry":dirEntry});
				}
			);
		}
	};

	function gotjFileEntryBlob(fileEntry,Data){
		try{
			fileEntry.createWriter(
				function(fileWriter){
					gotjFileWriterBlob(fileWriter,Data);
				}, 
				function(error) { 
					storeExternalError(error, {"Where":"FileManager - gotjFileEntryBlob - createWriter","fileEntry":fileEntry,"Data":Data});
				}
			);
		}catch(err){
			storeExternalError(err, {"Where":"FileManager - gotjFileEntryBlob","fileEntry":fileEntry,"Data":Data});
		}
	}

	function gotjFileWriterBlob(writer,Data){
		try{
			writer.write(Data);
		}
		catch(err){
			storeExternalError(err, {"Where":"FileManager - gotjFileWriterBlob","writer":writer,"Data":Data});
		}
	}

	//Called when file name is clicked on the page but should be outside of the object
	this.OpenLocalFile = function(name){
		try{	
			name = name.replace(/[`!@#$%*|+=?;:'"<>\{\}\\\/]/gi, '');
			var abPath = DEFAULT_FILE_PATH + name;
			var fileTypeVector = name.split(".");
			var lastIndex = fileTypeVector.length -1;
			if(lastIndex === 0){
				//File without extension
				throw name + " has no file extension";
			}
			var extension = fileTypeVector[lastIndex].toLowerCase();
			if(extension == "html" || extension == "txt" || extension == "jpg" || extension == "png" || extension == "gif"){
				window.open(abPath, '_blank');
			}
			else if(extension == "pdf" || extension.indexOf("doc") > -1 || extension.indexOf("xls") > -1 || extension.indexOf("ppt") > -1 ){
				window.plugins.fileOpener.open(abPath);
			}
			else{
				alert("FS Mobility application can't read a file with extension:\n\t*." + extension);
			}
		}
		catch(err){
			storeExternalError(err,{"Where":"FileManager - OpenLocalFile","name":name,});
			alert("Opening of this file threw an error: " + err);
		}
	};

	this.DownloadSelectedSWR = function(input){
		this.DownloadSelectedFile(input,"SWR");
	};

	this.DownloadSelectedTKIC = function(input){
		this.DownloadSelectedFile(input,"TKIC");
	};

	this.DownloadSelectedFile = function(input,FileType){
		try{
			//check for Internet connection
			var connected = 'onLine' in navigator && navigator.onLine;
			// Change slider picture
			if(connected){
				//Connected to the Internet!
				var element = ''+document.getElementById(input).src;
				if(element.indexOf('slider-37.png') >= 0){
					document.getElementById(input).src = 'images/icons/download slider2-38.png';
					return;
				}
				document.getElementById(input).src = 'images/icons/download slider2-37.png';
				// Show loading gif
				setTimeout(function(){
					$.mobile.loading('show');
				}, 1); 
				// Start downloading
				var fileInfo = input.split(API_VALUE_SEPARATOR);
				var fileId = fileInfo[0];
				var fileName = fileInfo[1];
				var SOQL = "";
				var SFDC_Table = "";
				var body_Field = "";
				var Tab2Refresh = "";
				switch(FileType){
					case "SWR":
						SOQL = " SELECT Id, Title  FROM ContentVersion WHERE Id='"+fileId+"' LIMIT 1 ";
						SFDC_Table = SFDC_CONTENT_VERSION;
						body_Field = "VersionData";
						Tab2Refresh = "swr.html";
						break;
					case "TKIC":
						SOQL = " SELECT Id, Bulletin_Document__Name__s, HTML_File__Name__s, PDF_File__Name__s FROM TI_Article__kav "+
							   " WHERE Article_Version_Id__c = '"+fileId+"' AND Language='en_GB' AND PublishStatus = 'Online' ";
						SFDC_Table = SFDC_TI_ARTICLE_KAV;
						Tab2Refresh = TKICController.PageTab;
						break;
					default:
						SOQL = " SELECT Id, Name FROM Attachment WHERE ParentId='"+fileId+"' ORDER BY LastModifiedDate DESC LIMIT 1 ";
						SFDC_Table = SFDC_ATTACHEMENT;
						body_Field = "Body";
						Tab2Refresh = "swr.html";
						break;
				}
				forcetkClient.query(SOQL, function(response) {
					var resSize = response.totalSize;
					var id;
					if(resSize > 0){
						id  = response.records[0].Id;
						var ext = response.records[0]; // I will extract File Extension from response to this variable
						switch(FileType){
							case "SWR":
								ext = ext.Title;
								break;
							case "TKIC":
								var Bullext = ext.Bulletin_Document__Name__s;
								if(Bullext!== undefined && Bullext!== null && Bullext !==""){
									ext = Bullext;
									body_Field = "Bulletin_Document__Body__s";
								}else{
									var PDFtext = ext.PDF_File__Name__s;
									if(PDFtext !== undefined && PDFtext !== null && PDFtext !==""){
										ext = PDFtext;
										body_Field = "PDF_File__Body__s";
									}else{
										ext = ext.HTML_File__Name__s;
										body_Field = "HTML_File__Body__s";
									}
								}
								break;
							default:
								ext = ext.Name;
								break;
						}
						if(ext!== undefined && ext!== null && ext !==""){
							ext = ext.split('.');
							if(ext.length > 1){
								ext = "."+ext[ext.length-1];
							}
							else{
								ext = "";//this is file without extension
							}
						}else{
							alert("This knowledge article has no Name of file.\n Please give this Id to developer:\n"+id);
							ext = "";//this is not a file extension
						}
						forcetkClient.retrieveBlobField(SFDC_Table, id, body_Field,
							function(result){
								// TODO add Regex to remove special characters from fileName
								fileName = fileName.replace(/[`!@#$%*|+=?;:'"<>\{\}\\\/]/gi, '');
								//MC 23.10.2015
								if (FileType == "SWR"){
									MainObject.fsManager.createFileBlob("["+fileId+"]" + fileName, result);
								}
								else{
									MainObject.fsManager.createFileBlob("["+fileId+"]" + fileName + ext, result);
								}
								//TODO - Save Extension to SmartStore
								FileManager.SaveFileExtension(fileId, FileType, ext, Tab2Refresh);
								// this will call FileManager.RefreshAfterDownload("success", Tab2Refresh);
								// because save to SmartStore is also asynchronous task
							}, 
							function(error){
								storeExternalError(errorThrown, {"Where":"FileManager - DownloadSelectedFile - forcetkClient - retrieveBlobField","SFDC_Table":SFDC_Table,"id":id,"body_Field":body_Field});
								FileManager.RefreshAfterDownload("no_file", Tab2Refresh);
							}, false);
					}
					else{
						FileManager.RefreshAfterDownload("no_file", Tab2Refresh);
					}
				},
				function(jqXHR, textStatus, errorThrown){
					//There are other reasons for this to fail. eg. a malformed query.
					storeExternalError(errorThrown, {"Where":"FileManager - DownloadSelectedFile - forcetkClient","SOQL":SOQL,"textStatus":textStatus,"jqXHR":jqXHR});
					FileManager.RefreshAfterDownload("SOQL_query_error", Tab2Refresh);
				});
			}
			else{
				//Not connected to the Internet! Notify the user of this!
				if(FileType==="TKIC"){
					FileManager.RefreshAfterDownload("no_internet",TKICController.PageTab);
				}else{
					FileManager.RefreshAfterDownload("no_internet","swr.html");
				}
			}
		}
		catch(err){
			storeExternalError(err,{"Where":"FileManager - DownloadSelectedFile","input":input,"FileType":FileType});	
		}
	};

	this.SaveFileExtension = function(recordId, FileType, extension, Tab2Refresh){
		// save extension to this record
		// but to do so, we need to get our SWR/Article Record from SmartStore
		// and then update it
		try{
			var soupName;
			var whereField = "Id";
			switch(FileType){
				case "SWR":
					soupName = SOUP_SWR_CONTENT_VERSION;
					break;
				case "TKIC":
					soupName = SOUP_TI_ARTICLE_KAV;
					whereField = "Article_Version_Id__c";
					break;
				default:
					soupName = SOUP_DOC_TABLE;//this shall not happen, but still
					break;
			}
			var SQL = " SELECT {" + soupName + ":_soup} FROM {" + soupName + "} ";
			var WHERE = " WHERE {" + soupName + ":" + whereField + "}='" + recordId + "' ";
			var querySpec = sfSmartstore().buildSmartQuerySpec(SQL + WHERE, 100);
			FileManager.FindFileToUpdate(querySpec, FileType, extension, Tab2Refresh, soupName);
		}
		catch(err){
			storeExternalError(err,{"Where":"FileManager - SaveFileExtension","recordId":recordId,"FileType":FileType,"extension":extension,"Tab2Refresh":Tab2Refresh});
		}
	};

	this.FindFileToUpdate = function(querySpec,FileType,extension,Tab2Refresh,soupName){
		try{
			sfSmartstore().runSmartQuery(querySpec, function(cursor){
				var receivedEntries = cursor.currentPageOrderedEntries;
				if(receivedEntries !== undefined && receivedEntries !== null && receivedEntries.length > 0){
					var newRecords = [];
					for(var i=0,j=receivedEntries.length;i<j;i++){
						var receivedRecord = receivedEntries[i];
						var newRecord;
						switch(FileType){
							case "SWR":
								//Maria Ciskova 23.10.2015
								newRecord = FileManager.fillSWRrecord(receivedRecord[0]);
								//FileManager.RefreshAfterDownload("success", Tab2Refresh);
								break;
							case "TKIC":
								newRecord = FileManager.fillTKICrecord(receivedRecord[0]);
								break;
							default:
								FileManager.RefreshAfterDownload("unknown_file_type", Tab2Refresh);//this shall not happen, but still
								return;
						}
						newRecord.Extension = extension;
						newRecords.push(newRecord);
					}
					FileManager.UpsertFileExtension(soupName,newRecords);
					FileManager.RefreshAfterDownload("success", Tab2Refresh);
				}
				else{
					FileManager.RefreshAfterDownload("no_ext", Tab2Refresh);
					alert("FileManager.FindFileToUpdate found 0 records to upsert");
					return;
				}
			},function(error){
				storeExternalError(err,{"Where":"FileManager - FindFileToUpdate - sfSmartstore().runSmartQuery","querySpec":querySpec,"FileType":FileType,"extension":extension,"Tab2Refresh":Tab2Refresh});
				FileManager.RefreshAfterDownload("no_ext", Tab2Refresh);
			}); 
		}
		catch(err){
			storeExternalError(err,{"Where":"FileManager - FindFileToUpdate","querySpec":querySpec,"FileType":FileType,"extension":extension,"Tab2Refresh":Tab2Refresh});
			FileManager.RefreshAfterDownload("no_ext", Tab2Refresh);
		}
	};

	//is not used any more because there is no need to update SWR record - the file extension os stored right in ContentVersion record 
	this.fillSWRrecord = function(parent){
		try{
			var cloned = jQuery.extend(true, {}, SWR_FILE);
			cloned.Id = parent.Id;
			cloned.attributes.type = parent.attributes.type;
			cloned.attributes.url = parent.attributes.url;
			cloned.Title = parent.Title;
			cloned.ContentDocumentId = parent.ContentDocumentId;
			cloned.FileExtension = parent.FileExtension;
			cloned.LastModifiedDate = parent.LastModifiedDate;
			return cloned;
		}
		catch(err){
			storeExternalError(err, {"Where":"FileManager - fillSWRrecord","parent":parent});
		}

	};

	this.fillTKICrecord = function(parent){
		try{
			var cloned = jQuery.extend(true, {}, TKIC_FILE);
			cloned.Id = parent.Id;
			cloned.Name = parent.Name;
			cloned.attributes.type = parent.attributes.type;
			cloned.attributes.url = parent.attributes.url;
			cloned.Article_Version_Id__c = parent.Article_Version_Id__c;
			cloned.Title = parent.Title.replace(/[`!@#$%*|+=?;:'"<>\{\}\\\/]/gi, '');
			cloned.Date__c = parent.Date__c;
			cloned.SubType__c = parent.SubType__c;
			cloned.Main_Type__c = parent.Main_Type__c;
			//cloned._soupEntryId = parent._soupEntryId;
			return cloned;
		}
		catch(err){
			storeExternalError(err, {"Where":"FileManager - fillTKICrecord","parent":parent});
		}
	};

	this.UpsertFileExtension = function(soupName, entry){
		try{
			sfSmartstore().upsertSoupEntriesWithExternalId(soupName, entry,"Id",
				function(items){
					FileManager.RefreshAfterDownload("success", Tab2Refresh);
				},
				function(error){
					storeExternalError(error, {"Where":"FileManager - UpsertFileExtension - upsertSoupEntriesWithExternalId","Entry":entry,"soupName":soupName});
					FileManager.RefreshAfterDownload("no_ext", Tab2Refresh);
				}
			);
		}
		catch(err){
			storeExternalError(err, {"Where":"FileManager - UpsertFileExtension","Entry":entry,"soupName":soupName});
			FileManager.RefreshAfterDownload("no_ext", Tab2Refresh);
		}
	};

	// Denis Ivancik - UI handling
	this.RefreshAfterDownload = function(downloadStatus,Tab2Refresh){
		try{
			// Hide loading gif
			setTimeout(function(){
				$.mobile.loading('hide');
			}, 1);
			var Params,recordId = getValueFromUrlParameters($.mobile.activePage.attr('data-url'), 'id');
			switch(downloadStatus){
				case "success":
					switch(Tab2Refresh.toLowerCase()){
						case "bulletins.html":
							Params = {RecordId : "",ParentId:recordId, SQL : "SQLITE_TKIC", FileType:"ASI"};
							TKICController.Constructor(Params);
							break;
						case "manuals.html":
							Params = {RecordId : "",ParentId:recordId, SQL : "SQLITE_TKIC",FileType:"MAN"};
							TKICController.Constructor(Params);
							break;
						case "spc.html":
							Params = {RecordId : "",ParentId:recordId, SQL : "SQLITE_TKIC",FileType:"SPC"};
							TKICController.Constructor(Params);
							break;
						default:
							changeNavigationTab(Tab2Refresh);
							break;
					}
					break;
				case "no_file":
					alert('Sorry, but this File is not uploaded on Salesforce server. Please, contact your administrator.');
					break;
				case "no_internet":
					alert('Sorry, but you need Internet connection to download this file');
					break;
				default:
					changeNavigationTab(Tab2Refresh);
					break;
			}
		}catch(Pokemon){
			storeExternalError(Pokemon, {"Where":"FileManager - RefreshAfterDownload","downloadStatus":downloadStatus,"Tab2Refresh":Tab2Refresh});
		}
	};

	this.downloadDocsOfThisEquip = function(equipmentId){
		try{
			//check Internet connection
			if('onLine' in navigator && navigator.onLine){
				//check download flow for equip - ti article - kav
				var SOQL = "SELECT Id, Name, Title__c, Article_Version_Id__c, Installation__c, Equipment__c, Document_Type__c, Binder__c";
				SOQL += " FROM " + SFDC_TI_ARTICLE_ASSIGNMENT + " TI WHERE TI.Equipment__c='"+equipmentId+"'";
				logToConsole()(SOQL);
				forcetkClient.query(SOQL,function(response){
					handleArticleAssignmentsOfEquip(response,equipmentId);
				},function(err){
					storeExternalError(err,{"Where":"FileManager - downloadDocsOfThisEquip - forcetkClient","equipmentId":equipmentId,"SOQL":SOQL});
					hideLoadingGif();
				});
			}else{
				alert('Sorry, but you need Internet connection in order to download documents for this Equipment');
				hideLoadingGif();
			}
		}catch(Pokemon){
			storeExternalError(Pokemon, {"Where":"FileManager - downloadDocsOfThisEquip","equipmentId":equipmentId});
			hideLoadingGif();
		}
	};

	function handleArticleAssignmentsOfEquip(response,equipmentId){
		try{
			if(response.totalSize > 0){
				sfSmartstore().upsertSoupEntriesWithExternalId(SOUP_TI_ARTICLE_ASSIGNMENT_TABLE, response.records,"Id",function(success){
					getTheirKAVs(success,equipmentId);
				},function(error){
					storeExternalError(error,{"Where":"FileManager - handleArticleAssignmentsOfEquip - upsertSoupEntriesWithExternalId","equipmentId":equipmentId,"response.records":response.records});
					hideLoadingGif();
				});
			}else{
				alert("Sorry, but this Equipment has no Documents");
				TKICController.PushEquipmentId(equipmentId);
				TKICController.Constructor(TKICController.GetParameters());
			}			
		}catch(Pokemon){
			storeExternalError(Pokemon,{"Where":"FileManager - handleArticleAssignmentsOfEquip","equipmentId":equipmentId,"response.records":response.records});
			hideLoadingGif();
		}
	}

	function getTheirKAVs(records,equipmentId){
		try{
			var KAV_Id_Map = {},KAV_Id_List = [];
			var i=0, ASIcount = 0, MANcount = 0, SPCcount = 0;
			for(var j=records.length;i<j;i++){
				KAV_Id_Map[records[i].Article_Version_Id__c] = records[i].Binder__c;//using Map as unique Set instead of List
			}
			for(var Id in KAV_Id_Map){
				if(KAV_Id_Map.hasOwnProperty(Id)){
					switch(KAV_Id_Map[Id]){
						case "ASI":
							ASIcount++;
							break;
						case "MAN":
							MANcount++;
							break;
						case "SPC":
							SPCcount++;
							break;
						default:
							break;
					}
				}
				KAV_Id_List.push("'"+Id+"'");
			}
			logToConsole()("Stored new documents to device:\nBulletins: "+ASIcount+"\nManuals: "+MANcount+"\nSpare Part Catalogs: "+SPCcount);
			if(KAV_Id_List.length > 0){
				downloadKAVs(KAV_Id_List,equipmentId);
			}
			else{
				hideLoadingGif();
			}
		}catch(Pokemon){
			storeExternalError(Pokemon,{"Where":"FileManager - getTheirKAVs","records.length":records.length,"equipmentId":equipmentId});
			hideLoadingGif();
		}
	}

	function downloadKAVs(Ids,equipmentId){
		try{
			var SOQL = "SELECT Id, Date__c, SubType__c, Title, Bulletin_Document__Name__s, PDF_File__Name__s,";
			SOQL += " HTML_File__Name__s, Article_Version_Id__c, Main_Type__c FROM " + SFDC_TI_ARTICLE_KAV;
			SOQL += " WHERE Language='en_GB' AND PublishStatus = 'Online' AND Article_Version_Id__c IN ("+Ids+")";
			SOQL += " LIMIT 2000";
			logToConsole()(SOQL);
			forcetkClient.query(SOQL,function(response){
				handleKAVsOfEquip(response,equipmentId);
			},function(err){
				storeExternalError(err,{"Where":"FileManager - downloadKAVs - forcetkClient","Ids":Ids,"equipmentId":equipmentId,"SOQL":SOQL});
				hideLoadingGif();
			});
		}catch(Pokemon){
			storeExternalError(Pokemon,{"Where":"FileManager - downloadKAVs","Ids":Ids,"equipmentId":equipmentId});
			hideLoadingGif();
		}
	}

	function handleKAVsOfEquip(response,equipmentId){
		try{
			if(response.totalSize > 0){
				//alert("Going to store "+response.totalSize+" documents");
				sfSmartstore().upsertSoupEntriesWithExternalId(SOUP_TI_ARTICLE_KAV, response.records,"Id",function(success){
					//alert("Download and storage of new documents is completed");
					TKICController.PushEquipmentId(equipmentId);
					TKICController.Constructor(TKICController.GetParameters());
				},function(error){
					storeExternalError(err,{"Where":"FileManager - handleKAVsOfEquip - upsertSoupEntriesWithExternalId","Records":response.records,"equipmentId":equipmentId});
					hideLoadingGif();
				});
			}else{
				alert("Sorry, but this Equipment has no Documents");
				TKICController.PushEquipmentId(equipmentId);				
				TKICController.Constructor(TKICController.GetParameters());
			}
		}catch(Pokemon){
			storeExternalError(Pokemon,{"Where":"FileManager - handleKAVsOfEquip","Records":response.records,"equipmentId":equipmentId});
			hideLoadingGif();
		}
	}
	
	// Hide loading gif
	function hideLoadingGif(){
		setTimeout(function(){
				$.mobile.loading('hide');
			}, 1);
	}
}