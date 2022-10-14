/******************************************************************************
 *            Copyright (c) 2006 Michel Gutierrez. All Rights Reserved.
 ******************************************************************************/

/**
 * Constants.
 */

const NS_CONVERT_MGR_CID = Components.ID("{5f4589e7-114b-4a4b-a63e-06ca7f22439d}");
const NS_CONVERT_MGR_PROG_ID = "@downloadhelper.net/convert-manager-component";
const DHNS = "http://downloadhelper.net/1.0#";

const CONV_METHOD_NONE=Components.interfaces.dhIConvertMgr.CONV_METHOD_NONE;
const CONV_METHOD_UNIX=Components.interfaces.dhIConvertMgr.CONV_METHOD_UNIX;
const CONV_METHOD_WIN_DH=Components.interfaces.dhIConvertMgr.CONV_METHOD_WIN_DH;

var Util=null;

/**
* Object constructor
*/
function ConvertMgr() {
	try {

		this.convRulesFile = Components.classes["@mozilla.org/file/directory_service;1"]
    		.getService(Components.interfaces.nsIProperties)
        	.get("ProfD", Components.interfaces.nsIFile);
        this.convRulesFile.append("dh-conv-rules.rdf");
		if(this.convRulesFile.exists()) {
			this.datasource=Util.getDatasourceFromRDFFile(this.convRulesFile,true);
		} else {
			var datasource=Components.classes
	      		['@mozilla.org/rdf/datasource;1?name=in-memory-datasource'].
	          		createInstance(Components.interfaces.nsIRDFDataSource);
			this.makeDefaultDataSource(datasource);
			this.setDataSource(datasource);
		}

		var prefService=Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefService);
		this.pref=prefService.getBranch("dwhelper.");
		
		this.promptService=Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
			.getService(Components.interfaces.nsIPromptService);
		
		this.delayQueue=[];
		
		this.queueDatasource=Components.classes
      		['@mozilla.org/rdf/datasource;1?name=in-memory-datasource'].
          		createInstance(Components.interfaces.nsIRDFDataSource);

		this.updateUnregistered();
		
	} catch(e) {
		dump("[ConvertMgr] !!! constructor: "+e+"\n");
	}
}

ConvertMgr.prototype = {}

ConvertMgr.prototype.convert=function(sourceFile,targetFile,format,autoClear) {
	//dump("[ConvertMgr] convert("+sourceFile.path+","+targetFile+","+format+")\n");
	
	try {

	var m=/^(.*?)\/(.*)$/.exec(format);
	var extension=m[1];
	var params=m[2];
	
	if(targetFile==null) {
		targetFile=sourceFile.parent;
		targetFile.append(/^(.*\.)(.*?)$/i.exec(sourceFile.leafName)[1]+extension);
	}
	
	var convRes=Util.createNodeSR(this.queueDatasource,"urn:root",null);
	Util.setPropertyValueRS(this.queueDatasource,convRes,DHNS+"Status","2");
	Util.setPropertyValueRS(this.queueDatasource,convRes,DHNS+"InputFilePath",sourceFile.path);
	Util.setPropertyValueRS(this.queueDatasource,convRes,DHNS+"OutputFilePath",targetFile.path);
	Util.setPropertyValueRS(this.queueDatasource,convRes,DHNS+"InputFilePathShort",sourceFile.leafName);
	Util.setPropertyValueRS(this.queueDatasource,convRes,DHNS+"OutputFilePathShort",targetFile.leafName);
	Util.setPropertyValueRS(this.queueDatasource,convRes,DHNS+"CreationDate",""+new Date());

	var convMethod=this.getConvMethod();
	
	switch(convMethod) {
		case CONV_METHOD_UNIX:
			this.convertUnix(sourceFile,targetFile,params,extension,convRes,autoClear);
			break;
		case CONV_METHOD_WIN_DH:
			try {
			if(this.checkConverterVersion()==false)
				return;
			} catch(e) {
				dump("!!! checkConverterVersion: "+e+"\n");
				return;
			}
			this.convertDH(sourceFile,targetFile,params,extension,convRes,autoClear);
			break;
	}
	
	} catch(e) {
		dump("!!! [ConvertMgr] convert: "+e+"\n");
	}                
}

ConvertMgr.prototype.setFFMPEGArgs=function(dEntry,params,sourceFile,targetFile,doTrace,doVhook) {
	var pArgs=["args"];
	var pParams=[params];
	var passes=1;
	if(/.*\/.*/.test(params)) {
		pArgs.push("args2");
		var m=/(.*)\/(.*)/.exec(params);
		passes=2;
		pParams=[m[1],m[2]];
	}
	for(var i=0;i<passes;i++) {
		dEntry[pArgs[i]] = [ "-i", sourceFile.path,"-y","-v","0"];
		dEntry[pArgs[i]]=dEntry[pArgs[i]].concat(pParams[i].split(" "));
		if(doTrace) {
			dEntry[pArgs[i]].push("-Xhello");
			var convertTrace=false;
			try {
				convertTrace=this.pref.getBoolPref("convert-helper.trace");
			} catch(e) {}
			if(convertTrace) {
				dEntry[pArgs[i]].push("-Xloglevel");
				var convertShowArgs=false;
				try {
					convertShowArgs=this.pref.getBoolPref("convert-helper.show-args");
				} catch(e) {}
				if(convertShowArgs)
					dEntry[pArgs[i]].push("2");
				else
					dEntry[pArgs[i]].push("1");
				var logFile=Util.getProfileDir();
				logFile.append("cvhelper.log");
				dEntry[pArgs[i]].push("-Xlogfile");
				dEntry[pArgs[i]].push(logFile.path);
			}
		}
		if(doVhook) {
			var wmFile=Util.getExtensionDir("{b9db16a4-6edc-47ec-a1f4-b86292ed211d}");
			wmFile.append("local");
			wmFile.append("wm.png");

			dEntry[pArgs[i]].push("-Xfn83");
			dEntry[pArgs[i]].push(wmFile.path);
			dEntry[pArgs[i]].push("-vhook");
			dEntry[pArgs[i]].push("vhook/imlib2.dll -x 0 -y 0 -i *");
		}
		dEntry[pArgs[i]].push(targetFile.path);
	}

	/*
	dump("ffmpeg params="+dEntry.args.join(" ")+"\n");
	if(dEntry.args2)
		dump("ffmpeg params (pass#2)="+dEntry.args2.join(" ")+"\n");
	*/
}

ConvertMgr.prototype.convertUnix=function(sourceFile,targetFile,params,extension,convRes,autoClear) {
	var ffmpegFile = Components.classes["@mozilla.org/file/local;1"]
    	.createInstance(Components.interfaces.nsILocalFile);

	var ffmpegPath="/usr/bin/ffmpeg";
	try {
		ffmpegPath=this.pref.getCharPref("ffmpeg-path");
	} catch(e) {
	}
	ffmpegFile.initWithPath(ffmpegPath);
	if(!ffmpegFile.exists()) {
		dump("!!![ConvertMgr] convert(): no ffmpeg found\n");
		ffmpegFile=null;
	} 
	var mencoderFile = Components.classes["@mozilla.org/file/local;1"]
    	.createInstance(Components.interfaces.nsILocalFile);
	var mencoderPath="/usr/bin/mencoder";
	try {
		mencoderPath=this.pref.getCharPref("mencoder-path");
	} catch(e) {
	}
	mencoderFile.initWithPath(mencoderPath);
	if(!mencoderFile.exists()) {
		dump("!!![ConvertMgr] convert(): no mencoder found\n");
		mencoderFile=null;
	}
	
	if(mencoderFile==null && ffmpegFile==null) {
		dump("!!![ConvertMgr] convert(): no converter found\n");
	}

	var converterFile=null;
	if(mencoderFile==null && ffmpegFile!=null) {
		converterFile=ffmpegFile;
	} else if(mencoderFile!=null && ffmpegFile==null) {
		converterFile=mencoderFile;
	} else {
		var preferred="ffmpeg";
		try {
			preferred=this.pref.getCharPref("preferred-converter");
		} catch(e) {
		}
		
		if(preferred=="ffmpeg")
			converterFile=ffmpegFile;
		else
			converterFile=mencoderFile;
	}
	
	var dEntry={
		file: converterFile,
		qRes: convRes,
		autoClear: autoClear,
		sourceFile: sourceFile,
		targetFile: targetFile
	}
	
	if(converterFile==ffmpegFile) {
		this.setFFMPEGArgs(dEntry,params,sourceFile,targetFile,false,false);
	}
	if(converterFile==mencoderFile) {
		dEntry.args = [ sourceFile.path ];
		// adjust depending on bitrate
		dEntry.args=dEntry.args.concat(["-oac", "copy", "-ovc", "copy"]);			
		dEntry.args=dEntry.args.concat(["-o", targetFile.path]);
	}
	
	this.delayQueue.push(dEntry);
	this.checkConvert();
}

ConvertMgr.prototype.escapePath=function(path) {
	path=path.replace(/\\/g,"\\\\");
	path=path.replace(/ /g,"\\ ");
	path=path.replace(/"/g,"\\\"");
	return path;
}

ConvertMgr.prototype.convertDH=function(sourceFile,targetFile,params,extension,convRes,autoClear) {

	try {

	var file=this.getInstallDir();
	file.append("cvhelper.exe");

	var unreg=this.updateUnregistered();
	
	var dEntry={
		file: file,
		qRes: convRes,
		autoClear: autoClear,
		sourceFile: sourceFile,
		targetFile: targetFile
	}

	this.setFFMPEGArgs(dEntry,params,sourceFile,targetFile,true,unreg);

	this.delayQueue.push(dEntry);
	this.checkConvert();
	
	} catch(e) {
		dump("!!! [ConvertMgr] convertDH: "+e+"\n");
	}
}

ConvertMgr.prototype.execConvert=function(dEntry) {
	this.conversionInProgress=true;
	Util.setPropertyValueRS(this.queueDatasource,dEntry.qRes,DHNS+"Status","3");
	Util.setPropertyValueRS(this.queueDatasource,dEntry.qRes,DHNS+"ProgressMode","undetermined");
	var Processor=function(convMgr,dEntry) {
		this.convMgr=convMgr;
		this.dEntry=dEntry;
	}
	Processor.prototype={
		run: function() {
			//dump("[ConvertMgr/Processor] execConvert [run]\n");
			try {
				if(this.dEntry.args2) {
					var file = Components.classes["@mozilla.org/file/directory_service;1"]
					                     .getService(Components.interfaces.nsIProperties)
					                     .get("TmpD", Components.interfaces.nsIFile);
					file.append("passlogfile.tmp");
					file.createUnique(Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 0666);
					var r=this.convertPass(["-pass","1","-passlogfile",file.path].concat(this.dEntry.args));
					if(r) {
						this.convertPass(["-pass","2","-passlogfile",file.path].concat(this.dEntry.args2));
					}
					if(file.exists())
						file.remove(false);
				} else {
					this.convertPass(this.dEntry.args);
				}
				this.convMgr.conversionInProgress=false;
				this.convMgr.checkConvert();
			} catch(e) {
				dump("!!! [ConvertMgr/Processor] execConvert [run]: "+e+"\n");
			}
		},
		convertPass: function(args) {
			var process = Components.classes["@mozilla.org/process/util;1"]
		                        .createInstance(Components.interfaces.nsIProcess);
			process.init(this.dEntry.file);

			process.run(true, args, args.length,{});
			
			var success;
			if(process.exitValue==0) {
				Util.setPropertyValueRS(this.convMgr.queueDatasource,this.dEntry.qRes,DHNS+"Status","4");
				Util.setPropertyValueRS(this.convMgr.queueDatasource,this.dEntry.qRes,DHNS+"EndDate",""+new Date());
				success=true;
				if(this.dEntry.autoClear) {
					var keepOriginal=false;
					try {
						keepOriginal=this.pref.getBoolPref("convert.keep-original");
					} catch(e) {}
					if(!keepOriginal)
						this.dEntry.sourceFile.remove(false);
				}
			} else {
				Util.setPropertyValueRS(this.convMgr.queueDatasource,this.dEntry.qRes,DHNS+"Status","5");
				Util.setPropertyValueRS(this.convMgr.queueDatasource,this.dEntry.qRes,DHNS+"EndDate",""+new Date());
				Util.setPropertyValueRS(this.convMgr.queueDatasource,this.dEntry.qRes,DHNS+"ErrorMessage",
					"Converter error "+process.exitValue);
				success=false;
				if(this.dEntry.autoClear) {
					this.dEntry.targetFile.remove(false);
					var keepOriginalOnFailure=true;
					try {
						keepOriginalOnFailure=this.pref.getBoolPref("convert.keep-original-on-failure");
					} catch(e) {}
					if(keepOriginalOnFailure) {
						var filename=this.dEntry.sourceFile.leafName;
						var recoveryLeafName=null;
						if(/^.+\..*$/.test(filename)) {
							var m=/^(.+)\.(.*)$/.exec(filename);
							recoveryLeafName=m[1]+".failed-conv."+m[2];
						} else {
							recoveryLeafName=filename+".failed-conv";
						}
						var recoveryFile=this.dEntry.targetFile.parent;
						recoveryFile.append(recoveryLeafName);
						recoveryFile.createUnique(Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 0644);
						this.dEntry.sourceFile.moveTo(this.dEntry.targetFile.parent,recoveryFile.leafName);
					}
				}
			}
			return success;
		},
		QueryInterface: function(iid) {
			if (iid.equals(Components.interfaces.nsIRunnable) ||
				iid.equals(Components.interfaces.nsISupports)) {
				return this;
			}
			throw Components.results.NS_ERROR_NO_INTERFACE;
		}
		
	}
	try {
		var thread = Components.classes["@mozilla.org/thread;1"].createInstance(Components.interfaces.nsIThread);
		thread.init(
		        new Processor(this,dEntry),
		        0,
		        Components.interfaces.nsIThread.PRIORITY_LOW,
		        Components.interfaces.nsIThread.SCOPE_LOCAL,
		        Components.interfaces.nsIThread.STATE_UNJOINABLE
		        );
	} catch(e) {
		try {
			dump("!!! [ConvertMgr/Processor] execConvert [creating thread]: "+e+"\n");
			var threadMgr = Components.classes["@mozilla.org/thread-manager;1"].getService();
			var thread=threadMgr.newThread(0);
			thread.dispatch(new Processor(this,dEntry),thread.DISPATCH_NORMAL);
			//dump("[ConvertMgr/Processor] execConvert [dispatched]\n");
		} catch(e) {
			dump("!!! [ConvertMgr/Processor] execConvert [dispatching]: "+e+"\n");
		}
	}
}

ConvertMgr.prototype.checkConvert=function() {
	try {
		if(this.delayQueue.length>0 && this.conversionInProgress!=true) {
			var dEntry=this.delayQueue.shift();
			this.execConvert(dEntry);
		}
	} catch(e) {
		dump("!!! [ConvertMgr] checkDelayConvert(): "+e+"\n");
	}
}

ConvertMgr.prototype.addConvert=function(sourceFile,targetFile,format,autoClear) {

	//dump("[ConvertMgr] addConvert("+sourceFile.path+","+targetFile.path+","+format+")\n");

	if(!this.isEnabled())
		return;
	this.convert(sourceFile,targetFile,format,autoClear);
}

ConvertMgr.prototype.getFormat=function(filename,mediaUrl,pageUrl) {

	//dump("[ConvertMgr] getFormat("+filename+","+mediaUrl+","+pageUrl+")\n");

	if(!this.isEnabled()) {
		//dump("[ConvertMgr] getFormat(): convert not enabled\n");
		return null;
	}
	var extension=null;
	try {
		extension=/.*\.(.*?)$/.exec(filename)[1];
	} catch(e) {
		dump("!!! [ConvertMgr] getFormat(): no extension from "+filename+"\n");
		return null;
	}
	try {
	var rules=Util.getChildResourcesS(this.datasource,"urn:root",{});
	for(var i=0;i<rules.length;i++) {
		var infile=Util.getPropertyValueRS(this.datasource,rules[i],DHNS+"infile");
		if(infile=="" || infile.toLowerCase()==extension.toLowerCase()) {
			var insite=Util.getPropertyValueRS(this.datasource,rules[i],DHNS+"insite");
			var re=new RegExp("https?://(?:[^/]*\\.)?"+insite+"/.*","i");
			if(insite=="" || re.test(mediaUrl) || (pageUrl!=null && re.test(pageUrl))) {
				var action=Util.getPropertyValueRS(this.datasource,rules[i],DHNS+"action");
				if(action=="0") {
					//dump("[ConvertMgr] getFormat(): explicit no conversion\n");
					return null;
				} else {
					var format=Util.getPropertyValueRS(this.datasource,rules[i],DHNS+"outformat");
					//dump("[ConvertMgr] getFormat(): format="+format+"\n");
					return format;
				}
			}
		}
	}
	} catch(e) {
		dump("!!! [ConvertMgr] checkConvert(): "+e+"\n");
		return null;
	}
}

ConvertMgr.prototype.getDataSource=function() {
	//dump("[ConvertMgr] getDataSource()\n");
	return this.datasource;
}

ConvertMgr.prototype.setDataSource=function(datasource) {
	//dump("[ConvertMgr] setDataSource()\n");
	try {
		var serializer="@mozilla.org/rdf/xml-serializer;1";
		var s=Components.classes[serializer].createInstance(Components.interfaces.nsIRDFXMLSerializer);
		s.init(datasource);
		var stream = Components.classes['@mozilla.org/network/file-output-stream;1']
		    .createInstance(Components.interfaces.nsIFileOutputStream);
		stream.init(this.convRulesFile, 42, 0644, 0); 
	
		s.QueryInterface(Components.interfaces.nsIRDFXMLSource).Serialize(stream);
		stream.close();
	} catch(e) {
		dump("!!! [ConvertMgr] setDataSource: "+e+"\n");
	}
	this.datasource=datasource;
}

ConvertMgr.prototype.getDataSourceCopy=function() {
	//dump("[ConvertMgr] getDataSourceCopy()\n");
	var datasource=Util.getDatasourceFromRDFFile(this.convRulesFile,true);
	return datasource;
}

ConvertMgr.prototype.makeDefaultRule=function(datasource) {
	//dump("[ConvertMgr] makeDefaultRule()\n");
	var defRule=Util.createAnonymousNodeS(datasource,"urn:root");
	Util.setPropertyValueRS(datasource,defRule,DHNS+"label",Util.getText("conversion.default-rule-label"));
	Util.setPropertyValueRS(datasource,defRule,DHNS+"action","1");
	Util.setPropertyValueRS(datasource,defRule,DHNS+"infile","flv");
	Util.setPropertyValueRS(datasource,defRule,DHNS+"insite","");
	Util.setPropertyValueRS(datasource,defRule,DHNS+"outformat","avi/-f avi -sameq");
	Util.setPropertyValueRS(datasource,defRule,DHNS+"outdir","");
	Util.setPropertyValueRS(datasource,defRule,DHNS+"label",this.makeLabel(datasource,defRule.Value));
	return defRule.Value;
}

ConvertMgr.prototype.isEnabled=function() {
	//dump("[ConvertMgr] isEnabled()\n");
	var enabled=false;
	try {
		enabled=this.pref.getBoolPref("conversion-enabled");
	} catch(e) {}
	return enabled;
}

ConvertMgr.prototype.getInstallDir=function() {
	//dump("[ConvertMgr] getInstallDir()\n");
	try {
		var wrk = Components.classes["@mozilla.org/windows-registry-key;1"]
		                    .createInstance(Components.interfaces.nsIWindowsRegKey);
		if(wrk==null) {
			dump("!!![ConvertMgr] getInstallDir(): no registry service\n");
			return null;
		}
		
		var method=this.getConvMethod();
		var regPath;
		if(method==CONV_METHOD_WIN_DH)
			regPath="SOFTWARE\\DownloadHelper\\ConvertHelper";
		else {
			dump("!!![ConvertMgr] getInstallDir(): no path available\n");
			return null;
		}
		var r=wrk.open(wrk.ROOT_KEY_LOCAL_MACHINE,
		         regPath,
		         wrk.ACCESS_READ);
		//dump("[ConvertMgr] getExePath(): open returns "+r+"\n");
		var folderPath = wrk.readStringValue("InstallFolder");
		wrk.close();
		//dump("*** "+folderPath+"\n");
		if(folderPath==null)
			return null;
		var file = Components.classes["@mozilla.org/file/local;1"]
		                     .createInstance(Components.interfaces.nsILocalFile);
		file.initWithPath(folderPath);
		if(!file.exists()) {
			dump("!!![ConvertMgr] getInstallDir(): "+folderPath+" does not exist\n");
			return;
		}
		if(!file.isDirectory()) {
			dump("!!![ConvertMgr] getInstallDir(): "+folderPath+" is not a directory\n");
			return;
		}
		if(!file.isReadable()) {
			dump("!!![ConvertMgr] getInstallDir(): "+folderPath+" is not readable\n");
			return;
		}
		return file;
		
	} catch(e) {
		dump("!!![ConvertMgr] getInstallDir():"+e+"\n");
		return null;
	}
}

ConvertMgr.prototype.makeDefaultDataSource=function(datasource) {

	var i = datasource.GetAllResources();
	datasource.beginUpdateBatch();
	while(i.hasMoreElements()) {
		var source = i.getNext();
		var j = datasource.ArcLabelsOut(source);
		while(j.hasMoreElements()) {
			var predicate = j.getNext();
			var k = datasource.GetTargets(source,predicate,true);
			while(k.hasMoreElements()) {
				var target = k.getNext();
				datasource.Unassert(source,predicate,target);
			}
		}
	}
	datasource.endUpdateBatch();
    this.makeDefaultRule(datasource);
}

ConvertMgr.prototype.makeLabel=function(datasource,ref) {
	try {
	var action=Util.getPropertyValueSS(datasource,ref,
		"http://downloadhelper.net/1.0#action");
	var insite=Util.getPropertyValueSS(datasource,ref,
		"http://downloadhelper.net/1.0#insite");
	var infile=Util.getPropertyValueSS(datasource,ref,
		"http://downloadhelper.net/1.0#infile");
	var outformat=Util.getPropertyValueSS(datasource,ref,
		"http://downloadhelper.net/1.0#outformat");
	var outdir=Util.getPropertyValueSS(datasource,ref,
		"http://downloadhelper.net/1.0#outdir");
	
	if(insite=="")
		insite=Util.getText("label.conv-rule.all-sites");
	if(infile=="")
		infile=Util.getText("label.conv-rule.all-files");
	if(outdir=="")
		outdir=Util.getText("label.conv-rule.default-directory");
	
	var label;
	if(action=="0") {
		label=Util.getFText("label.conv-rule.label.do-not-convert",[
			infile, insite
		],2);
	} else {
		var format=/^(.*?)\/.*$/.exec(outformat)[1];
		label=Util.getFText("label.conv-rule.label.convert",[
			infile, insite,
			format.toUpperCase(),
			outdir
		],4);
	}
			
	return label;
		
	} catch(e) {
		return null;
	}
}

ConvertMgr.prototype.updateUnregistered = function() {
	var cf=true;
	
	var method=this.getConvMethod();
	if(method==CONV_METHOD_WIN_DH) {
		try {
			var reg=Components.classes["@mozilla.org/windows-registry-key;1"]
				.createInstance(Components.interfaces.nsIWindowsRegKey);
			try {
				reg.open(reg.ROOT_KEY_CURRENT_USER,
					         "SOFTWARE\\DownloadHelper\\ConvertHelper",
					         reg.ACCESS_READ);
			    var name=reg.readStringValue("CustomerName");
			    var email=reg.readStringValue("CustomerEmail");
			    var key=reg.readStringValue("LicenseKey");
			    var licenseCheck=this.md5("converthelper"+key+name+email);
			    var licenseCheck0=reg.readStringValue("LicenseCheck");
			    reg.close();
			    if(licenseCheck==licenseCheck0) { 
			    	var profile=Util.getProfileDir().leafName;
			    	var profileCheck=this.md5("converthelper"+profile);
					var profileCheck0="";
					try {
						profileCheck0=this.pref.getCharPref("converthelper-key");
					} catch(e) {}
					if(profileCheck!=profileCheck0) {
						this.checkLicense(key);
					} else {
						cf=false;
					}
				}    
			} catch(e) { 
				//dump("!!![ConvertMgr] updateUnregistered: "+e+"\n"); 
			}
			try {
				reg.close();
			} catch(e) {}
		} catch(e) { 
			cf=false; 
		}
	} else if(method==CONV_METHOD_UNIX) {
		cf=false;
	}

	this.pref.setBoolPref("convert-free",cf);
	
	return cf;
}

ConvertMgr.prototype.register = function(code) {

	//dump("register: "+code+"\n");


	var method=this.getConvMethod();
	if(method==CONV_METHOD_WIN_DH) {
		try {
			this.checkLicense(code);
		} catch(e) {
			//dump("register exception: "+e+"\n");
		}
	}
}

ConvertMgr.prototype.getConvMethod = function() {
	var method=CONV_METHOD_NONE;
	try {
		var reg = Components.classes["@mozilla.org/windows-registry-key;1"]
		                    .createInstance(Components.interfaces.nsIWindowsRegKey);
		method=CONV_METHOD_WIN_DH;
	} catch(e) {
		return CONV_METHOD_UNIX;
	}
	return method;
}

ConvertMgr.prototype.checkLicense = function(key) {

	//dump("checkLicense\n");

	function TimerCallBack(self) {
		this.self=self;
	}
	
	TimerCallBack.prototype={
	
		notify: function(timer) { 

			var body="<check-license>\n"+
				"  <license-key>"+key+"</license-key>\n"+
				"  <product>converthelper</product>\n"+
				"</check-license>";
			
			var xmlhttp = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"].
					createInstance(Components.interfaces.nsIXMLHttpRequest);
			this.xmlhttp=xmlhttp;
			xmlhttp.service=this.self;
			xmlhttp.onload=function(ev) {
				if(xmlhttp.status==200) {
					try {
						//xmlhttp.service.promptService.alert(null,"Debug",xmlhttp.responseText);
						//dump("checkLicenseResponse: "+xmlhttp.responseText+"\n");
						var xml=xmlhttp.responseXML.documentElement;
						var status=Util.xpGetString(xml,"/check-license-response/status/text()");
					    var name=Util.xpGetString(xml,"/check-license-response/name/text()");
					    var email=Util.xpGetString(xml,"/check-license-response/email/text()");
						//xmlhttp.service.promptService.alert(null,"Debug",status);
						if(status=="accepted") {
							var reg = Components.classes["@mozilla.org/windows-registry-key;1"]
		            	        .createInstance(Components.interfaces.nsIWindowsRegKey);
							reg.open(reg.ROOT_KEY_CURRENT_USER,
						         "SOFTWARE",
						         reg.ACCESS_ALL);
					    	reg=reg.createChild("DownloadHelper\\ConvertHelper",
						         reg.ACCESS_ALL);
						    var existingKey=null;
						    try {
								existingKey=reg.readStringValue("LicenseKey");
						    } catch(e) {}
						    reg.writeStringValue("CustomerName",name);
						    reg.writeStringValue("CustomerEmail",email);
						    reg.writeStringValue("LicenseKey",key);
						    var licenseCheck=xmlhttp.service.md5("converthelper"+key+name+email);
						    reg.writeStringValue("LicenseCheck",licenseCheck);
						    reg.close();
						    var profile=Util.getProfileDir().leafName;
						    var profileCheck=xmlhttp.service.md5("converthelper"+profile);
						    xmlhttp.service.pref.setCharPref("converthelper-key",profileCheck);
						    xmlhttp.service.updateUnregistered();
						    if(existingKey==null) {
								xmlhttp.service.promptService.alert(null,Util.getText("title.converter-registration"),
									Util.getText("message.converter-registration-succeeded"));
						    }
						} else if(status=="need-validation") {
							xmlhttp.service.promptService.alert(null,Util.getText("title.converthelper.revalidate"),
								Util.getFText("message.converthelper.revalidate",
									[name,email],2));
						} else {
							xmlhttp.service.promptService.alert(null,Util.getText("title.converthelper.invalid-license"),
								Util.getText("message.converthelper.invalid-license"));
						}
					} catch(e) {
						dump("!!! [ConvertMgr] checkLicense: "+e+"\n"); 
					}
				} else {
				}
			}
			xmlhttp.open("POST", "http://www.downloadhelper.net/license-check.php",true);
		   	xmlhttp.send(body);
		}
	}
	var timer = Components.classes["@mozilla.org/timer;1"].
			createInstance(Components.interfaces.nsITimer);
	timer.initWithCallback(new TimerCallBack(this),0,Components.interfaces.nsITimer.TYPE_ONE_SHOT);
}

ConvertMgr.prototype.md5 = function(str) {
	var converter =
	  Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].
	    createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
	
	converter.charset = "UTF-8";
	var result = {};
	var data = converter.convertToByteArray(str, result);
	var ch = Components.classes["@mozilla.org/security/hash;1"]
	                   .createInstance(Components.interfaces.nsICryptoHash);
	ch.init(ch.MD5);
	ch.update(data, data.length);
	var hash = ch.finish(false);
	
	function toHexString(charCode)
	{
	  return ("0" + charCode.toString(16)).slice(-2);
	}
	
	var t=[];
	for(var i in hash) {
		t.push(toHexString(hash.charCodeAt(i)));
	}
	var s=t.join("");
	
	return s;
}

ConvertMgr.prototype.getInfo = function() {

	this.updateUnregistered();

	var props = Components.classes["@mozilla.org/properties;1"].createInstance(Components.interfaces.nsIProperties);

	var enabled=false;
	try {
		enabled=this.pref.getBoolPref("conversion-enabled");
	} catch(e) {}
	var sEnabled = Components.classes["@mozilla.org/supports-PRBool;1"].createInstance(Components.interfaces.nsISupportsPRBool);
	sEnabled.data=enabled;
	props.set("enabled",sEnabled);

	var method=this.getConvMethod();
	var sMethod = Components.classes["@mozilla.org/supports-PRInt32;1"].createInstance(Components.interfaces.nsISupportsPRInt32);
	sMethod.data=method;
	props.set("method",sMethod);

	var unregistered=true;
	try {
		unregistered=this.pref.getBoolPref("convert-free");
	} catch(e) {}
	var sUnregistered = Components.classes["@mozilla.org/supports-PRBool;1"].createInstance(Components.interfaces.nsISupportsPRBool);
	sUnregistered.data=unregistered;
	props.set("unregistered",sUnregistered);

	if(method==CONV_METHOD_WIN_DH) {

		var reg=Components.classes["@mozilla.org/windows-registry-key;1"]
			.createInstance(Components.interfaces.nsIWindowsRegKey);
		try {
			reg.open(reg.ROOT_KEY_LOCAL_MACHINE,
				         "SOFTWARE\\DownloadHelper\\ConvertHelper",
				         reg.ACCESS_READ);

			var exeFound=false;			
			try {
				var folderPath = reg.readStringValue("InstallFolder");
				var file = Components.classes["@mozilla.org/file/local;1"]
				                     .createInstance(Components.interfaces.nsILocalFile);
				file.initWithPath(folderPath);
				file.append("cvhelper.exe");
				if(file.exists()) {
					exeFound=true;
				}
			} catch(e) {}
			var sExeFound = Components.classes["@mozilla.org/supports-PRBool;1"].createInstance(Components.interfaces.nsISupportsPRBool);
			sExeFound.data=exeFound;
			props.set("exefound",sExeFound);
			
			try {
				var version = reg.readStringValue("Version");
				var sVersion = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
				sVersion.data=version;
				props.set("converterversion",sVersion);
			} catch(e) {}

			try {
				var sVersion = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
				sVersion.data="2.0";
				props.set("converterminversion",sVersion);
			} catch(e) {}

			reg.close();

			reg.open(reg.ROOT_KEY_CURRENT_USER,
				         "SOFTWARE\\DownloadHelper\\ConvertHelper",
				         reg.ACCESS_READ);
			
			if(unregistered==false) {

			    var name=reg.readStringValue("CustomerName");
			    var email=reg.readStringValue("CustomerEmail");
			    var key=reg.readStringValue("LicenseKey");
	
				var sName = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
				sName.data=name;
				props.set("customername",sName);
	
				var sEmail = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
				sEmail.data=email;
				props.set("customeremail",sEmail);
	
				var sLicense = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
				sLicense.data=key;
				props.set("license",sLicense);
			}
		} catch(e) {}
		try {
			reg.close();
		} catch(e) {}
	}

	var windows=false;
	try {
		var reg=Components.classes["@mozilla.org/windows-registry-key;1"]
			.createInstance(Components.interfaces.nsIWindowsRegKey);
		windows=true;
	} catch(e) {}
	var sWindows = Components.classes["@mozilla.org/supports-PRBool;1"].createInstance(Components.interfaces.nsISupportsPRBool);
	sWindows.data=windows;
	props.set("windows",sWindows);

	return props;
}

ConvertMgr.prototype.getQueueDataSource = function() {
	return this.queueDatasource;
}

ConvertMgr.prototype.checkConverterVersion = function() {
	var props=this.getInfo();
	var version="1.0";
	try {
		version=props.get("converterversion",Components.interfaces.nsISupportsString).data;
	} catch(e) {}
	var minVersion="1.0";
	try {
		minVersion=props.get("converterminversion",Components.interfaces.nsISupportsString).data;
	} catch(e) {}
	if(parseFloat(version)<parseFloat(minVersion)) {
		var r=this.promptService.confirm(null,Util.getText("error.convert-helper.version.title"),
			Util.getFText("error.convert-helper.version",[version,minVersion],2));
		if(r) {
			var wwatch = Components.classes["@mozilla.org/embedcomp/window-watcher;1"].getService().
				QueryInterface(Components.interfaces.nsIWindowWatcher);
			wwatch.openWindow(null, "http://www.downloadhelper.net/install-converter.php",null,null,null);
		}
		return false;
	}
	return true;
}

ConvertMgr.prototype.QueryInterface = function(iid) {
    if(
    	iid.equals(Components.interfaces.dhIConvertMgr)==false &&
    	iid.equals(Components.interfaces.nsISupports)==false
	) {
            throw Components.results.NS_ERROR_NO_INTERFACE;
        }
    return this;
}

var vConvertMgrModule = {
    firstTime: true,
    
    /*
     * RegisterSelf is called at registration time (component installation
     * or the only-until-release startup autoregistration) and is responsible
     * for notifying the component manager of all components implemented in
     * this module.  The fileSpec, location and type parameters are mostly
     * opaque, and should be passed on to the registerComponent call
     * unmolested.
     */
    registerSelf: function (compMgr, fileSpec, location, type) {

        if (this.firstTime) {
            this.firstTime = false;
            throw Components.results.NS_ERROR_FACTORY_REGISTER_AGAIN;
        }
        compMgr = compMgr.QueryInterface(Components.interfaces.nsIComponentRegistrar);
        compMgr.registerFactoryLocation(NS_CONVERT_MGR_CID,
                                        "ConvertMgr",
                                        NS_CONVERT_MGR_PROG_ID, 
                                        fileSpec,
                                        location,
                                        type);
    },

	unregisterSelf: function(compMgr, fileSpec, location) {
    	compMgr = compMgr.QueryInterface(Components.interfaces.nsIComponentRegistrar);
    	compMgr.unregisterFactoryLocation(NS_DH_CONVERT_MGR_CID, fileSpec);
	},

    /*
     * The GetClassObject method is responsible for producing Factory and
     * SingletonFactory objects (the latter are specialized for services).
     */
    getClassObject: function (compMgr, cid, iid) {
        if (!cid.equals(NS_CONVERT_MGR_CID)) {
	    	throw Components.results.NS_ERROR_NO_INTERFACE;
		}

        if (!iid.equals(Components.interfaces.nsIFactory)) {
	    	throw Components.results.NS_ERROR_NOT_IMPLEMENTED;
		}

        return this.vConvertMgrFactory;
    },

    /* factory object */
    vConvertMgrFactory: {
        /*
         * Construct an instance of the interface specified by iid, possibly
         * aggregating it with the provided outer.  (If you don't know what
         * aggregation is all about, you don't need to.  It reduces even the
         * mightiest of XPCOM warriors to snivelling cowards.)
         */
        createInstance: function (outer, iid) {
            if (outer != null) {
				throw Components.results.NS_ERROR_NO_AGGREGATION;
	    	}
	
	    	if(Util==null) 
	    		Util=Components.classes["@downloadhelper.net/util-service;1"]
					.getService(Components.interfaces.dhIUtilService);

			return new ConvertMgr().QueryInterface(iid);
        }
    },

    /*
     * The canUnload method signals that the component is about to be unloaded.
     * C++ components can return false to indicate that they don't wish to be
     * unloaded, but the return value from JS components' canUnload is ignored:
     * mark-and-sweep will keep everything around until it's no longer in use,
     * making unconditional ``unload'' safe.
     *
     * You still need to provide a (likely useless) canUnload method, though:
     * it's part of the nsIModule interface contract, and the JS loader _will_
     * call it.
     */
    canUnload: function(compMgr) {
		return true;
    }
};

function NSGetModule(compMgr, fileSpec) {
    return vConvertMgrModule;
}

