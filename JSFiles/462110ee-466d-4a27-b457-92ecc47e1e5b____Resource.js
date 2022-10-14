const React = require('react');
var ReactNative = require('react-native');
import SearchBar from 'react-native-searchbar';
import Modal from 'react-native-modal'
var { NetInfo, StyleSheet, Text, View,ScrollView,Alert,
    WEBVIEW_REF, Platform,AsyncStorage, Dimensions,Image,WebView,TouchableOpacity,TouchableHighlight,PixelRatio,ActivityIndicator } = ReactNative;
import ThemeStyles from '../Styles/ThemeStyles';
import { List, ListItem,Card,Button,Grid,Row,Col } from 'react-native-elements'
import ActionButton from 'react-native-circular-action-menu';
import Icon from 'react-native-vector-icons/FontAwesome';
var ImagePicker = require('react-native-image-picker');
import Video from 'react-native-video';
import { TextField } from 'react-native-material-textfield';
import PTRView from 'react-native-pull-to-refresh'
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
const FilePickerManager = require('NativeModules').FilePickerManager;
var { Component } = React;
const retryImg = require('../images/retry.png');
const deleteImage = require('../images/delete.png');
import OpenFile from 'react-native-doc-viewer';


module.exports = class Resource extends Component {
 constructor(props) {
    super(props);
    this.state = {
   screenType: '',categoryDetails:[],
    isVisible:true,types:'Circle', color: "#7EFF71", size: 50,isModalVisible: false,retry:false,resultData:false,programid:'',results : [],paused:false,animating:true,imagestatus:false,videostatus:false,filestatus:false,url:[],modalstatus:false,icons:'play-arrow',footer:false
    };
     this._refresh = this._refresh.bind(this);

  }
async componentDidMount(){
    NetInfo.addEventListener('connectionChange',
                             (isConnected)=> {
                             this.setState({isConnected : isConnected});
                             }
                             )
		var empid = await AsyncStorage.getItem('empid');
		var companyid = await AsyncStorage.getItem("companyid");
		var customerid = await AsyncStorage.getItem("customerid");
		var  programid=await AsyncStorage.getItem("programid");
		var  comid=await AsyncStorage.getItem("comid");
		var themebgcolor = await AsyncStorage.getItem("themebgcolor");     
		var initroute = await AsyncStorage.getItem("themerouting");
		var applogo = await AsyncStorage.getItem("applogo");
		var url =  await AsyncStorage.getItem("url");
        var colorArray = JSON.parse(await AsyncStorage.getItem("colorArray"));

    this.setState({empid:empid,programid:programid,url:url,companyid:companyid,customerid:customerid,
                  themebgcolor:themebgcolor,applogo:applogo,menuLable:this.props.menuLable,comid:comid,initroute:initroute,colorArray:colorArray });
	
		this.resourseload(empid,companyid,programid,comid);
   	
}



resourseload(empid,companyid,programid,comid){
	NetInfo.isConnected.fetch().then(isConnected => {
	if(isConnected){
	var _this = this;
	var url =_this.state.url;
                                     _this.setState({isVisible:true,retry:false,animating:true});
                             // alert(url+'manageappajax?type=MyLearningandresouresDetails&empid='+empid+'&customerid='+companyid+'&programid='+programid+'&comid='+comid);                              
		fetch(url+'manageappajax?type=MyLearningandresouresDetails&empid='+empid+'&customerid='+companyid+'&programid='+programid+'&comid='+comid, {
		method: 'POST',
		headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json'
		}
		})
		.then((response) => response.json())
		.then((responseData) => {
		    console.log(
			"POST Response",
			"Response Body -> " + JSON.stringify(responseData)
		    )
//alert( JSON.stringify(responseData));
			if(responseData!=null){
									
				_this.setState({
                               categoryDetails:responseData,isVisible:false,retry:false,animating:false
				});

			}
			else{
			_this.setState({
					isVisible:false,resultData:true,animating:false
				});

			}
					
		
		})
		 .catch((error) => {
			this.setState({retry:true,isVisible:false,animating:false});
		})
		.done();
		}else{
		this.setState({retry:true,isVisible:false,animating:false});
		}
		})
}
    _refresh () {
        this.componentDidMount();
	this.setState({resultData:false})
    }
    

	
navigate(route){

if(this.state.isModalVisible==true){
		this.setState({isModalVisible: false});		
	}

	 var routeNma='Resources';
	this.props.navigator.push({
                              name: route,
                              themebgcolor:this.state.themebgcolor,
                              applogo:this.state.applogo,
		passProps: {
		routName:routeNma
      		}
	  })
	}	

async handleLayoutChange(event:Event){

		var width = Dimensions.get('window').width;
		var height = Dimensions.get('window').height;
		if(width>height){

			await this.setState({screenType: 'Landscape', height : height,width : width,imagewidth:width/1.7 ,imageheight:height/1.4 ,modalBody:0});
			

		} else {

			await this.setState({screenType: 'Portrait', height : height,width : width,imagewidth:width/1.1 ,imageheight:height/3,headerimagewidth:width/3 ,headerimageheight:height/18,paddingBody:width/7,modalBody:width/2});
		}

	};
onPress(path,id,extension,filename,filetype,sessionname){
	

    if(extension=="mp4" || extension=="mp3" ||extension=="mkv" || extension=="flv" )
    {
	var file=filename.split('.');
		
	 this.props.navigator.push({
                               name: 'VideoPage',
                               themebgcolor:this.state.themebgcolor,
                               applogo:this.state.applogo,
 // Matches route.name
		passProps: {
          	path: path,
		extension:extension,
		filename:file[0],
		filetype:filetype,
		sessionname:sessionname,
		programid:this.state.programid,contentId:id
      		}
	  });

    }
    else  if(extension=="ppt" || extension=="pptx" ||extension=="xls" || extension=="xlsx" || extension=="doc" || extension=="docx" )
    {
        // alert(path);
        OpenFile.openDoc([{
                          url:"http://www.yokupro.com/uploadfiles/"+path,
                          fileName:filename
                          }], (error, url) => {
                         if (error) {
                         Alert.alert('YokuPro','File Not Supported',  [
                                                                       {text: 'Ok', onPress: ()=>this.noPressed, style: 'cancel'},
                                                                       ]);
                         } else {
                         console.log(url)
                         }
                         })
        
    }
    else if(extension=="pdf" ){
        this.props.navigator.push({
                                  name: 'PDF',
                                  themebgcolor:this.state.themebgcolor,
                                  applogo:this.state.applogo,
                                  // Matches route.name
                                  passProps: {
                                  path: path,
                                  extension:extension,
                                  filename:filename,
                                  filetype:filetype,
                                  sessionname:sessionname,
                                  programid:this.state.programid
                                  }
                                  });

    }
else
{
this.props.navigator.push({
                                  name: 'Document',
                                    themebgcolor:this.state.themebgcolor,
                                    applogo:this.state.applogo,
 // Matches route.name
                                  passProps: {
                                  path: path,
                                  extension:extension,
                                  filename:filename,
                                  filetype:filetype,
                                  sessionname:sessionname,
                                  programid:this.state.programid
                                  }
                                  });

    }
    this.createHistory(id);

		
}
    createHistory(contentId){
        NetInfo.isConnected.fetch().then(isConnected => {
                                         if(isConnected){
                                         var _this = this;
                                         var empid = this.state.empid;
                                         var programid=_this.state.programid;
                                         var companyid = this.state.companyid;
                                         var url =_this.state.url;
                                         var Devicename=Platform.OS;
                                         
                                         fetch(url+'manageappajax?type=readingHistory&empid='+empid+'&companyid='+companyid+'&contentId='+contentId+'&programid='+programid+'&programtype=resource&Devicename='+Devicename, {
                                               method: 'POST',
                                               headers: {
                                               'Accept': 'application/json',
                                               'Content-Type': 'application/json'
                                               }
                                               })
                                         .then((response) => response.json())
                                         .then((responseData) => {
                                               console.log(
                                                           "POST Response",
                                                           "Response Body -> " + JSON.stringify(responseData)
                                                           )                                               
                                               
                                               })
                                         .catch((error) => {
                                                this.setState({retry:true,isVisible:false,});
                                                })
                                         .done();	
                                         }else{
                                         this.setState({retry:true,isVisible:false,});
                                         }
                                         })
    }

_handleResults(results) {
  this.setState({ results });
}
    
    selectDocumentTapped() {
        DocumentPicker.show({
                            filetype: [DocumentPickerUtil.allFiles()],
                            
                            },(error,url) => {
                            
                            this.setState({
                                          file: url,ImageUpload:"files",modalstatus:true
                                          });
                            
                            });
       
        
        
    }
    
    selectVideoTapped() {
        const options = {
        title: 'Video Picker',
        takePhotoButtonTitle: 'Take Video...',
        mediaType: 'video',
        videoQuality: 'medium'
        };
        
        ImagePicker.showImagePicker(options, (response) => {
                                    console.log('Response = ', response);
                                    
                                    if (response.didCancel) {
                                    console.log('User cancelled video picker');
                                    }
                                    else if (response.error) {
                                    console.log('ImagePicker Error: ', response.error);
                                    }
                                    else if (response.customButton) {
                                    console.log('User tapped custom button: ', response.customButton);
                                    }
                                    else {
                                    this.setState({
                                                  videoSource: response.uri,ImageUpload:"video",modalstatus:true
                                                  });
                                    }
                                    });
    }
    selectPhotoTapped() {
        const options = {
        quality: 1.0,
        maxWidth: 500,
        maxHeight: 500,
        storageOptions: {
        skipBackup: true
        }
        };
        
        ImagePicker.showImagePicker(options, (response) => {
                                    console.log('Response = ', response);
                                    
                                    if (response.didCancel) {
                                    console.log('User cancelled photo picker');
                                    }
                                    else if (response.error) {
                                    console.log('ImagePicker Error: ', response.error);
                                    }
                                    else if (response.customButton) {
                                    console.log('User tapped custom button: ', response.customButton);
                                    }
                                    else {
                                    let source = { uri: response.uri };
                                    
                                    // You can also display the image using data:
                                    // let source = { uri: 'data:image/jpeg;base64,' + response.data };
                                    
                                    this.setState({
                                                  avatarSource: source,ImageUpload:"image",modalstatus:true
                                                  });
                                    }
                                    });
    }
    playVideo(){
        if(this.state.paused==true){
            this.setState({paused:false,icons:'pause'});
        }else{
            this.setState({paused:true,icons:'play-arrow'});
            
        }
    }
    hideModal(){
        this.setState({UploadUrl:false,UploadQuery:false,modalstatus:false});
    }
    uploadResources(type,filename){
        this.setState({imagestatus:true,videostatus:true})
	let file='';
        let data = new FormData()
        if(type=='image'){
            this.setState({imagestatus:true})
        file= { uri: this.state.avatarSource.uri, name: 'image.jpg', type: 'multipart/form-data'};
        }else if(type=='video'){
            this.setState({videostatus:true})
         file= { uri: this.state.videoSource, name: 'Video.mov', type: 'multipart/form-data'};
        }
        else if(type=='files'){
            this.setState({filestatus:true})

         file= { uri: this.state.file.uri, name: this.state.file.fileName, type: this.state.file.type};
        }
        else if(type=='Url'){
            data.append('uploadUrl',this.state.uploadUrl);
        }
        else if(type=='Query'){
            data.append('Query',this.state.Query);

        }
	var companyid=this.state.companyid;
	var customerid=this.state.customerid;
	var programid=this.state.programid;
	var empid=this.state.empid;
	var url=this.state.url;
        data.append('file',file);
        data.append('companyid',companyid);
        data.append('customerid',customerid);
        data.append('programid',programid);
        data.append('empid',empid);
        data.append('requestType',type);
		this.setState({isVisible:true});
        fetch(url+'manageappajax?type=uploadResource', {
              method: 'POST',
              body:data
              })
        .then((response) => response.json())
        .then((responseData) => {
              console.log(
                          "POST Response",
                          "Response Body -> " + JSON.stringify(responseData)
                          )
			if(responseData!=""){
              if(responseData.msg!='Query'){
              this.setState({isVisible:false,avatarSource:'',ImageUpload:'',videoSource:'',retry:false,imagestatus:false,videostatus:false,filestatus:false});
                    this.hideModal();
              }
              else{
              this.setState({isVisible:false,retry:false,QueryMsg:"Query submitted successfully	",Query:''});

              }
			}
		
              })
            .catch((error) => {
                this.setState({retry:true,isVisible:false,});
               })
            .done();
        
    
    }
 render() {
		var details=null;
		var _this=this;

if(_this.state.categoryDetails!=null){

	if(_this.state.initroute=='MainMenu'){
			var microAppList = _this.state.categoryDetails.map((categoryDetails, index) => {

			var extension=categoryDetails.extension;
				if(categoryDetails.filetype=='story'){
					extension="story"
				}else if(categoryDetails.filetype=='url'){
					extension="url"
				}else{
					extension=categoryDetails.extension;
				}
				

			return (
			<TouchableHighlight onPress={() => _this.onPress(categoryDetails.filepath,categoryDetails.id,categoryDetails.extension,categoryDetails.filename,categoryDetails.filetype,categoryDetails.sessionname)} >
			<View style={ThemeStyles.listView}>

			<View style={ThemeStyles.resourceimageView} >
			<Image style={ThemeStyles.iconImage} source={require('./../images/reading.png')} />
			</View>
			<View style={ThemeStyles.centerText}>
			<Text style={ThemeStyles.sessionname}>{categoryDetails.sessionname}
			<Text style={ThemeStyles.filename}  >{"\n"}

			{ ((categoryDetails.filename).length > 30) ?
			(((categoryDetails.filename).substring(0,30-3)) + '...') :
			categoryDetails.filename }


			</Text>
			</Text>

			</View>
			<View style={ThemeStyles.countView}>
			<Text style={ThemeStyles.resourceViewText} >View <Text style={ThemeStyles.extension}>.{extension}</Text></Text>
			</View>

			</View>
			</TouchableHighlight>
			)
			});

		}
		else if(_this.state.initroute=='Theme1'){

			microAppList = _this.state.categoryDetails.map((categoryDetails, index) => {

			var extension=categoryDetails.extension;
				if(categoryDetails.filetype=='story'){
					extension="story"
				}else if(categoryDetails.filetype=='url'){
					extension="url"
				}else{
					extension=categoryDetails.extension;
				}
							

            return (
                    <TouchableHighlight onPress={() => _this.onPress(categoryDetails.filepath,categoryDetails.id,categoryDetails.extension,categoryDetails.filename,categoryDetails.filetype,categoryDetails.sessionname)} >
                    <View style={ThemeStyles.listViewTheme1}>
                    
                    <View style={ThemeStyles.resourceimageView} >
                    <Image style={ThemeStyles.iconImage} source={require('./../images/reading.png')} />
                    </View>
                    <View style={ThemeStyles.centerText}>
                    <Text style={ThemeStyles.sessionnameTheme1}>{categoryDetails.sessionname}
                    <Text style={ThemeStyles.filenameTheme1}  >{"\n"}
                    
                    { ((categoryDetails.filename).length > 30) ?
                    (((categoryDetails.filename).substring(0,30-3)) + '...') :
                    categoryDetails.filename }
                    
                  
                    </Text>
                    </Text>
                    
                    </View>
                    <View style={ThemeStyles.countView}>
                    <Text style={ThemeStyles.resourceViewTextTheme1} >View <Text style={ThemeStyles.extensionTheme1}>.{extension}</Text></Text>
                    </View>
                    
                    </View>
                    </TouchableHighlight>
            )
	});
		}
        else if(_this.state.initroute=='Theme2'){
            var colorArray=this.state.colorArray;

            microAppList = _this.state.categoryDetails.map((categoryDetails, index) => {
                                                           var ImageColor=colorArray[index%9];
                                                           var extension=categoryDetails.extension;
                                                           if(categoryDetails.filetype=='story'){
                                                           extension="story"
                                                           }else if(categoryDetails.filetype=='url'){
                                                           extension="url"
                                                           }else{
                                                           extension=categoryDetails.extension;
                                                           }
                                                           if(extension=='mp4'||extension=='3gp'||extension=='avi'||extension=='mpg'||extension=='mpeg'||extension=='flv'||extension=='mkv'){
                                                           var icon='file-video-o';
                                                            }else if(extension=='mp3')
                                                           {
                                                               icon='file-audio-o';
                                                           }
                                                           else if(extension=='pdf'){
                                                           icon='file-pdf-o';

                                                           }else if(extension=='png'||extension=='jpg'||extension=='jpeg'){
                                                           icon='file-photo-o';

                                                           }else if(categoryDetails.filetype=='story'){
                                                            icon='file-zip-o';
                                                           }else if(categoryDetails.filetype=='url'){
                                                            icon='file-code-o';
                                                            }
                                                            else{
                                                            icon='file-o';
                                                           }
                                                           
                                                           
                                                           return (
                                                                   <TouchableHighlight onPress={() => _this.onPress(categoryDetails.filepath,categoryDetails.id,categoryDetails.extension,categoryDetails.filename,categoryDetails.filetype,categoryDetails.sessionname)} >
                                                                   <View style={{ borderWidth: 5,
                                                                   borderColor: '#ffffff',
                                                                   shadowColor: '#000',
                                                                   shadowOffset: { width: 0, height: 0 },
                                                                   shadowOpacity: 1,
                                                                   shadowRadius: 2,
                                                                   elevation: 3,
                                                                   marginLeft: 5,
                                                                   marginRight: 10,
                                                                   marginTop: 8,backgroundColor: ImageColor,flexDirection:'row'
}}>
                                                                   <View style={{backgroundColor: 'transparent',
                                                                   borderBottomWidth: 15,
                                                                   borderLeftWidth: 15,
                                                                   borderTopColor: 'transparent',
                                                                   borderBottomColor: 'transparent',
                                                                   borderRightColor: 'transparent',
                                                                   borderLeftColor:'#fff'}} />
                                                                   <View style={ThemeStyles.resourceimageView2} >
                                                                   <Icon name={icon} size={22} color={'#000000'} style={{marginTop:18,marginLeft:5}}/>
                                                                   </View>
                                                                   <View style={ThemeStyles.centerText}>
                                                                   <Text style={ThemeStyles.sessionnameTheme1}>{categoryDetails.sessionname}
                                                                   <Text style={ThemeStyles.filenameTheme1}  >{"\n"}
                                                                   
                                                                   { ((categoryDetails.filename).length > 30) ?
                                                                   (((categoryDetails.filename).substring(0,30-3)) + '...') :
                                                                   categoryDetails.filename }
                                                                   
                                                                   
                                                                   </Text>
                                                                   </Text>
                                                                   
                                                                   </View>
                                                                   <View style={ThemeStyles.countView}>
                                                                   <Text style={ThemeStyles.resourceViewTextTheme1} >View <Text style={ThemeStyles.extensionTheme1}>.{extension}</Text></Text>
                                                                   </View>
                                                                   
                                                                   </View>
                                                                   </TouchableHighlight>
                                                                   )
                                                           });
        }
    

		else if(_this.state.initroute=='Theme3'){
			var colorArray=this.state.colorArray;
			microAppList = _this.state.categoryDetails.map((categoryDetails, index) => {

			var extension=categoryDetails.extension;
				if(categoryDetails.filetype=='story'){
					extension="story"
				}else if(categoryDetails.filetype=='url'){
					extension="url"
				}else{
					extension=categoryDetails.extension;
				}
				var ImageColor=colorArray[index%9];			
                var text=categoryDetails.sessionname.charAt(0)+""+categoryDetails.filename.charAt(0);

            return (
                    <TouchableHighlight onPress={() => _this.onPress(categoryDetails.filepath,categoryDetails.id,categoryDetails.extension,categoryDetails.filename,categoryDetails.filetype,categoryDetails.sessionname)} >
                    <View style={ThemeStyles.listViewTheme3}>
                    
                    <View style={{marginTop:5,
		                        marginRight:2,
					backgroundColor: ImageColor,
					borderWidth: 0.2,
					borderColor: '#fff',
					width: 50,
                                  	height: 50}} >
                    <Text style={ThemeStyles.roundTextTheme3 }>{text}</Text>
                    </View>
			<View style={{marginLeft:5}}>	
                    <View style={ThemeStyles.centerText}>
                    <Text style={ThemeStyles.batchnameTheme3}>{categoryDetails.sessionname}
                    <Text style={ThemeStyles.programdateTheme3}  >{"\n"}
                    
                    { ((categoryDetails.filename).length > 30) ?
                    (((categoryDetails.filename).substring(0,30-3)) + '...') :
                    categoryDetails.filename }
                    
                  
                    </Text>
                    </Text>
                    
                    </View> 
			</View>
                    <View style={ThemeStyles.countView}>
                    <Text style={ThemeStyles.batchnameTheme3} ><Text style={ThemeStyles.programdateTheme3}>.{extension}</Text></Text>
                    </View>
                    
                    </View>
                    </TouchableHighlight>
            )
	});
		}
	}

	if(_this.state.results!=""){
	
 	if(_this.state.initroute=='MainMenu'){
			var microAppList = _this.state.results.map((categoryDetails, index) => {

			var extension=categoryDetails.extension;
				if(categoryDetails.filetype=='story'){
					extension="story"
				}else if(categoryDetails.filetype=='url'){
					extension="url"
				}else{
					extension=categoryDetails.extension;
				}
				

			return (
			<TouchableHighlight onPress={() => _this.onPress(categoryDetails.filepath,categoryDetails.id,categoryDetails.extension,categoryDetails.filename,categoryDetails.filetype,categoryDetails.sessionname)} >
			<View style={ThemeStyles.listView}>

			<View style={ThemeStyles.resourceimageView} >
			<Image style={ThemeStyles.iconImage} source={require('./../images/reading.png')} />
			</View>
			<View style={ThemeStyles.centerText}>
			<Text style={ThemeStyles.sessionname}>{categoryDetails.sessionname}
			<Text style={ThemeStyles.filename}  >{"\n"}

			{ ((categoryDetails.filename).length > 30) ?
			(((categoryDetails.filename).substring(0,30-3)) + '...') :
			categoryDetails.filename }


			</Text>
			</Text>

			</View>
			<View style={ThemeStyles.countView}>
			<Text style={ThemeStyles.resourceViewText} >View <Text style={ThemeStyles.extension}>.{extension}</Text></Text>
			</View>

			</View>
			</TouchableHighlight>
			)
			});

		}
    else if(_this.state.initroute=='Theme1'){
        
        microAppList = _this.state.results.map((categoryDetails, index) => {
                                               
                                               var extension=categoryDetails.extension;
                                               if(categoryDetails.filetype=='story'){
                                               extension="story"
                                               }else if(categoryDetails.filetype=='url'){
                                               extension="url"
                                               }else{
                                               extension=categoryDetails.extension;
                                               }
                                               
                                               
                                               return (
                                                       <TouchableHighlight onPress={() => _this.onPress(categoryDetails.filepath,categoryDetails.id,categoryDetails.extension,categoryDetails.filename,categoryDetails.filetype,categoryDetails.sessionname)} >
                                                       <View style={ThemeStyles.listViewTheme1}>
                                                       
                                                       <View style={ThemeStyles.resourceimageView} >
                                                       <Image style={ThemeStyles.iconImage} source={require('./../images/reading.png')} />
                                                       </View>
                                                       <View style={ThemeStyles.centerText}>
                                                       <Text style={ThemeStyles.sessionnameTheme1}>{categoryDetails.sessionname}
                                                       <Text style={ThemeStyles.filenameTheme1}  >{"\n"}
                                                       
                                                       { ((categoryDetails.filename).length > 30) ?
                                                       (((categoryDetails.filename).substring(0,30-3)) + '...') :
                                                       categoryDetails.filename }
                                                       
                                                       
                                                       </Text>
                                                       </Text>
                                                       
                                                       </View>
                                                       <View style={ThemeStyles.countView}>
                                                       <Text style={ThemeStyles.resourceViewTextTheme1} >View <Text style={ThemeStyles.extensionTheme1}>.{extension}</Text></Text>
                                                       </View>
                                                       
                                                       </View>
                                                       </TouchableHighlight>
                                                       )
                                               });
    }
		else if(_this.state.initroute=='Theme2'){

            var colorArray=this.state.colorArray;
            
            microAppList = _this.state.categoryDetails.map((categoryDetails, index) => {
                                                           var ImageColor=colorArray[index%9];
                                                           var extension=categoryDetails.extension;
                                                           if(categoryDetails.filetype=='story'){
                                                           extension="story"
                                                           }else if(categoryDetails.filetype=='url'){
                                                           extension="url"
                                                           }else{
                                                           extension=categoryDetails.extension;
                                                           }
                                                           if(extension=='mp4'||extension=='3gp'||extension=='avi'||extension=='mpg'||extension=='mpeg'||extension=='flv'||extension=='mkv'){
                                                           var icon='file-video-o';
                                                           }else if(extension=='mp3')
                                                           {
                                                           icon='file-audio-o';
                                                           }
                                                           else if(extension=='pdf'){
                                                           icon='file-pdf-o';
                                                           
                                                           }else if(extension=='png'||extension=='jpg'||extension=='jpeg'){
                                                           icon='file-photo-o';
                                                           
                                                           }else if(categoryDetails.filetype=='story'){
                                                           icon='file-zip-o';
                                                           }else if(categoryDetails.filetype=='url'){
                                                           icon='file-code-o';
                                                           }
                                                           else{
                                                           icon='file-o';
                                                           }
                                                           
                                                           
                                                           return (
                                                                   <TouchableHighlight onPress={() => _this.onPress(categoryDetails.filepath,categoryDetails.id,categoryDetails.extension,categoryDetails.filename,categoryDetails.filetype,categoryDetails.sessionname)} >
                                                                   <View style={{ borderWidth: 5,
                                                                   borderColor: '#ffffff',
                                                                   shadowColor: '#000',
                                                                   shadowOffset: { width: 0, height: 0 },
                                                                   shadowOpacity: 1,
                                                                   shadowRadius: 2,
                                                                   elevation: 3,
                                                                   marginLeft: 5,
                                                                   marginRight: 10,
                                                                   marginTop: 8,backgroundColor: ImageColor,flexDirection:'row'
                                                                   }}>
                                                                   <View style={{backgroundColor: 'transparent',
                                                                   borderBottomWidth: 15,
                                                                   borderLeftWidth: 15,
                                                                   borderTopColor: 'transparent',
                                                                   borderBottomColor: 'transparent',
                                                                   borderRightColor: 'transparent',
                                                                   borderLeftColor:'#fff'}} />
                                                                   <View style={ThemeStyles.resourceimageView2} >
                                                                   <Icon name={icon} size={22} color={'#000000'} style={{marginTop:18,marginLeft:5}}/>
                                                                   </View>
                                                                   <View style={ThemeStyles.centerText}>
                                                                   <Text style={ThemeStyles.sessionnameTheme1}>{categoryDetails.sessionname}
                                                                   <Text style={ThemeStyles.filenameTheme1}  >{"\n"}
                                                                   
                                                                   { ((categoryDetails.filename).length > 30) ?
                                                                   (((categoryDetails.filename).substring(0,30-3)) + '...') :
                                                                   categoryDetails.filename }
                                                                   
                                                                   
                                                                   </Text>
                                                                   </Text>
                                                                   
                                                                   </View>
                                                                   <View style={ThemeStyles.countView}>
                                                                   <Text style={ThemeStyles.resourceViewTextTheme1} >View <Text style={ThemeStyles.extensionTheme1}>.{extension}</Text></Text>
                                                                   </View>
                                                                   
                                                                   </View>
                                                                   </TouchableHighlight>
                                                                   )
                                                           });

		}
		else if(_this.state.initroute=='Theme3'){
			var colorArray=['#67B0D6','#ECB22B','#53C7C2','#996AE3','#646665','#ED6349','#F26750','#1274B7','#B2CE20'];
			microAppList = _this.state.results.map((categoryDetails, index) => {

			var extension=categoryDetails.extension;
				if(categoryDetails.filetype=='story'){
					extension="story"
				}else if(categoryDetails.filetype=='url'){
					extension="url"
				}else{
					extension=categoryDetails.extension;
				}
				var ImageColor=colorArray[index%9];			

            return (
                    <TouchableHighlight onPress={() => _this.onPress(categoryDetails.filepath,categoryDetails.id,categoryDetails.extension,categoryDetails.filename,categoryDetails.filetype,categoryDetails.sessionname)} >
                    <View style={ThemeStyles.listViewTheme3}>
                    
                    <View style={{marginTop:5,
		                        marginRight:2,
					backgroundColor: ImageColor,
					borderWidth: 0.2,
					borderColor: '#fff',
					width: 50,
                                  	height: 50}} >
                    <Image style={ThemeStyles.iconImage} source={require('./../images/read1.png')} />
                    </View>
			<View style={{marginLeft:5}}>	
                    <View style={ThemeStyles.centerText}>
                    <Text style={ThemeStyles.batchnameTheme3}>{categoryDetails.sessionname}
                    <Text style={ThemeStyles.programdateTheme3}  >{"\n"}
                    
                    { ((categoryDetails.filename).length > 30) ?
                    (((categoryDetails.filename).substring(0,30-3)) + '...') :
                    categoryDetails.filename }
                    
                  
                    </Text>
                    </Text>
                    
                    </View> 
			</View>
                    <View style={ThemeStyles.countView}>
                    <Text style={ThemeStyles.batchnameTheme3} ><Text style={ThemeStyles.programdateTheme3}>.{extension}</Text></Text>
                    </View>
                    
                    </View>
                    </TouchableHighlight>
            )
	});
		}

	}

	
	if(_this.state.resultData==true){
	
			var resultData=<View style={{alignSelf:"center",padding:15,marginTop:60}}>
				<Text style={{color: '#4B87C8' , fontWeight:'bold'}}>No {this.props.menuLable} available</Text>
			</View>;			
		}
if(_this.state.retry==true){
    var retry=<View style={{alignSelf:"center",flex:1,paddingTop:10,marginTop:60}}>
    <Text style={{color:"#000000"}}>You seem to be offline</Text>
    <Button
    raised
    style={{backgroundColor:'#EC9B64',height:35,alignSelf:"center"}}
    backgroundColor="#EC9B64"
    onPress={()=>this.navigate('Resources')}
    title="Go Online"/>
    </View>;

		}


if(this.state.isVisible!=true){
		var search= <SearchBar
		  ref={(ref) => this.searchBar = ref}
		  data={this.state.categoryDetails}
		  handleResults={(results)=>this._handleResults(results)}
		  showOnLoad
    style={{paddingBottom:100}}
		/>;
	
}
     if(this.state.ImageUpload=="image"){
         if(this.state.videostatus==true){
             var Submit=<ActivityIndicator
             animating = {this.state.videostatus}
             color = '#23A9FF'
             size = "large"
             style = {{alignItems: 'center',height: 80}}

             />;
         }else{
             Submit=<Button
             style={{backgroundColor:'#EC9B64',alignSelf:"center"}}
             raised
             onPress={()=>this.uploadResources('image')}
             backgroundColor="#EC9B64"
             icon={{name: 'upload', type: 'font-awesome'}}
             title='Upload' />;
         }
         
         var ImageUpload=<Modal isVisible={this.state.modalstatus}>
         <View style={{marginBottom:30}}>
         <View style={ThemeStyles.cardStyle}>
         <TouchableOpacity onPress={()=>{this.hideModal()}}>
         <Image style={styles.delete} source={deleteImage} />
         </TouchableOpacity>
         <View style={{alignSelf:'center'}}>
            <View style={[styles.avatar, styles.avatarContainer]}>
            {
             <Image style={styles.avatar} source={this.state.avatarSource} />
            }
            </View>
         </View>

            <View style={{marginTop:20}}>
            {Submit}
            </View>
         </View>
         </View>
         </Modal>;
     
     }else if(this.state.ImageUpload=="video") {
         if(this.state.imagestatus==true){
             var Submit=<ActivityIndicator
             animating = {this.state.imagestatus}
             color = '#23A9FF'
             size = "large"
             style = {{alignItems: 'flex-start',height: 80}}
             
             />;
         }else{
             Submit=<Button
             style={{backgroundColor:'#EC9B64',alignSelf:"center"}}
             raised
             backgroundColor="#EC9B64"
             onPress={()=>this.uploadResources('video')}
             icon={{name: 'upload', type: 'font-awesome'}}
             title='Upload' />;
         }

         ImageUpload=<Modal isVisible={this.state.modalstatus}>
         <View style={{marginBottom:30}}>
         <View style={ThemeStyles.cardStyle}>
         <TouchableOpacity onPress={()=>{this.hideModal()}}>
         <Image style={styles.delete} source={deleteImage} />
         </TouchableOpacity>
         <View style={{alignSelf:'center',width:150,height:150}}>
            { this.state.videoSource &&
             <Video
             source={{uri:this.state.videoSource}}
             style={styles.backgroundVideo}
             paused={this.state.paused}
             muted={this.state.muted}
             repeat={false}
             />
             
         }
           <View style={{paddingTop:50}}>
         <Button
         style={{marginTop:100}}
         backgroundColor="transparent"
         onPress={()=>this.playVideo()}
         icon={{name: this.state.icons, size: 35}}
         />
         </View>
         </View>
        

         <View style={{marginTop:10}}>
         {Submit}
         </View>
          </View>
         </View>
         </Modal>;
     }
     else if(this.state.ImageUpload=="files"){
         if(this.state.file!=null){
         if(this.state.filestatus==true){
             var Submit=<View style={{alignSelf:"center"}}><ActivityIndicator
             animating = {this.state.imagestatus}
             color = '#23A9FF'
             size = "large"
             style = {{alignItems: 'flex-start',height: 80}}
             
             /></View>;
         }else{
             Submit=<View style={{alignSelf:"flex-end"}}><Button
             style={{backgroundColor:'#EC9B64',}}
             raised
             backgroundColor="#EC9B64"
             onPress={()=>this.uploadResources('files',filename)}
             icon={{name: 'upload', type: 'font-awesome'}}
             title='Upload' /></View>;
         }
         
         var filename=this.state.file.fileName;
             ImageUpload=<Modal isVisible={this.state.modalstatus}>
             <View style={{marginBottom:30}}>
         <View style={ThemeStyles.cardStyle}>
             <TouchableOpacity onPress={()=>{this.hideModal()}}>
             <Image style={styles.delete} source={deleteImage} />
             </TouchableOpacity>
             <View style={{flexDirection:'row',margin:10}}>
             <Image style={ThemeStyles.iconImage} source={require('./../images/Docs-icon.png')} />
             <Text style={{fontSize:15,color:"#3498db",marginTop:20}}>{filename}</Text>
             </View>
             <View style={{marginTop:10, }}>
             {Submit}
             </View>
         </View>
             
             </View>
             </Modal>;
         }
         
        }
         else if(this.state.ImageUpload==""){
        
        ImageUpload=<View style={{marginTop:10}} >
        <View style={{alignSelf:"center"}}>
        <Text style={{fontSize:15,color:'#3498db'}}>Upload Successful. Awaiting Moderation.</Text>
        </View>
        <View style={{marginTop:40,alignSelf:'flex-end',marginBottom:30}}>
        <Button
        style={{backgroundColor:'#EC9B64',alignSelf:"center",height:35}}
        raised
       backgroundColor="#EC9B64"
        onPress={()=>this.navigate('Resources')}
           title='Close' />
            </View>
                </View> ;
        
	}
     var restult="";
     if(this.state.animating==true){
         restult= <ActivityIndicator
         animating = {this.state.animating}
         color = '#23A9FF'
         size = "large"
         style = {ThemeStyles.activityIndicator}
         />;
     }
     else{
         restult=microAppList;
     }
    if(this.state.comid==null){
		if(this.state.initroute=='MainMenu'){
		var action=<ActionButton buttonColor="rgba(231,76,60,1)">
            <ActionButton.Item buttonColor='#9b59b6' title="New Task" onPress={this.selectPhotoTapped.bind(this)}>
            <Icon name="picture-o" size={23} style={styles.actionButtonIcon} />
            </ActionButton.Item>
            <ActionButton.Item buttonColor='#3498db' title="All Tasks" onPress={this.selectVideoTapped.bind(this)}>
            <Icon name="file-video-o" size={23} style={styles.actionButtonIcon} />
            </ActionButton.Item>
            <ActionButton.Item buttonColor='#3498db' title="All Tasks" onPress={this.selectDocumentTapped.bind(this)}>
            <Icon name="paperclip" size={23} style={styles.actionButtonIcon} />
            </ActionButton.Item>
            <ActionButton.Item buttonColor='#3498db' title="Notifications" onPress={() => {this.setState({UploadUrl:true })}}>
            <Icon name="external-link" size={23} style={styles.actionButtonIcon} />
            </ActionButton.Item>
            <ActionButton.Item buttonColor='#1abc9c' title="All Tasks" onPress={() => {this.setState({UploadQuery:true })}}>
            <Icon name="question-circle" size={25} style={styles.actionButtonIcon} />
            </ActionButton.Item>
            </ActionButton>;
             }else if(this.state.initroute=='Theme1'){
		  action=<ActionButton buttonColor={this.state.themebgcolor}>
            <ActionButton.Item buttonColor='#1b6577' title="New Task" onPress={this.selectPhotoTapped.bind(this)}>
            <Icon name="picture-o" size={20} style={{color:'#ffffff'}} />
            </ActionButton.Item>
            <ActionButton.Item buttonColor='#082026' title="All Tasks" onPress={this.selectVideoTapped.bind(this)}>
            <Icon name="file-video-o" size={20} style={{color:'#ffffff'}} />
            </ActionButton.Item>
            <ActionButton.Item buttonColor='#1b6577' title="All Tasks" onPress={this.selectDocumentTapped.bind(this)}>
            <Icon name="paperclip" size={20} style={{color:'#ffffff'}} />
            </ActionButton.Item>
            <ActionButton.Item buttonColor='#082026' title="Notifications" onPress={() => {this.setState({UploadUrl:true })}}>
            <Icon name="external-link" size={20} style={{color:'#ffffff'}} />
            </ActionButton.Item>
            <ActionButton.Item buttonColor='#1b6577' title="All Tasks" onPress={() => {this.setState({UploadQuery:true })}}>
            <Icon name="question-circle" size={20} style={{color:'#ffffff'}} />
            </ActionButton.Item>
            </ActionButton>;
		
		}
             else if(this.state.initroute=='Theme2'){
                  action=<ActionButton buttonColor={this.state.themebgcolor}>
                 <ActionButton.Item buttonColor='#646665' title="New Task" onPress={this.selectPhotoTapped.bind(this)}>
                 <Icon name="picture-o" size={20} style={{color:'#ffffff'}} />
                 </ActionButton.Item>
                 <ActionButton.Item buttonColor='#646665' title="All Tasks" onPress={this.selectVideoTapped.bind(this)}>
                 <Icon name="file-video-o" size={20} style={{color:'#ffffff'}} />
                 </ActionButton.Item>
                 <ActionButton.Item buttonColor='#646665' title="All Tasks" onPress={this.selectDocumentTapped.bind(this)}>
                 <Icon name="paperclip" size={20} style={{color:'#ffffff'}} />
                 </ActionButton.Item>
                 <ActionButton.Item buttonColor='#646665' title="Notifications" onPress={() => {this.setState({UploadUrl:true })}}>
                 <Icon name="external-link" size={20} style={{color:'#ffffff'}} />
                 </ActionButton.Item>
                 <ActionButton.Item buttonColor='#646665' title="All Tasks" onPress={() => {this.setState({UploadQuery:true })}}>
                 <Icon name="question-circle" size={20} style={{color:'#ffffff'}} />
                 </ActionButton.Item>
                 </ActionButton>;
                 
             }
		else if(this.state.initroute=='Theme3'){
            action=<ActionButton buttonColor={this.state.themebgcolor}>
            <ActionButton.Item buttonColor='#996AE3' title="New Task" onPress={this.selectPhotoTapped.bind(this)}>
            <Icon name="picture-o" size={20} style={{color:'#ffffff'}} />
            </ActionButton.Item>
            <ActionButton.Item buttonColor='#53C7C2' title="All Tasks" onPress={this.selectVideoTapped.bind(this)}>
            <Icon name="file-video-o" size={20} style={{color:'#ffffff'}} />
            </ActionButton.Item>
            <ActionButton.Item buttonColor='#646665' title="All Tasks" onPress={this.selectDocumentTapped.bind(this)}>
            <Icon name="paperclip" size={20} style={{color:'#ffffff'}} />
            </ActionButton.Item>
            <ActionButton.Item buttonColor='#ED6349' title="Notifications" onPress={() => {this.setState({UploadUrl:true })}}>
            <Icon name="external-link" size={20} style={{color:'#ffffff'}} />
            </ActionButton.Item>
            <ActionButton.Item buttonColor='#1274B7' title="All Tasks" onPress={() => {this.setState({UploadQuery:true })}}>
            <Icon name="question-circle" size={20} style={{color:'#ffffff'}} />
            </ActionButton.Item>
            </ActionButton>;
		
		}
				
	}	
		var headerTab=null;
	if(this.state.initroute=='MainMenu'){

			headerTab= <View style={ThemeStyles.hederBG}>
				<Text style={ThemeStyles.titleText}>{this.state.menuLable}</Text>
			</View>;
		}
		else if(this.state.initroute=='Theme1'){
			headerTab= <View style={ThemeStyles.hederBGTheme1}>
				<Text style={ThemeStyles.titleTextTheme1}>{this.state.menuLable}</Text>
			</View>;
		}
        else if(this.state.initroute=='Theme2'){
            headerTab= <View style={{backgroundColor:this.state.themebgcolor,
            shadowColor: '#000',
            shadowRadius: 20,
            elevation: 8,
                padding:5}}>
            <Text style={ThemeStyles.titleTextTheme2}>{this.state.menuLable}</Text>
            </View>;
        }
		else if(this.state.initroute=='Theme3'){
            headerTab= <View style={{backgroundColor:this.state.themebgcolor,
            borderColor: '#ddd',
            shadowColor: '#000',
            shadowRadius: 20,
            elevation: 15,
            padding:5
            }}>
				<Text style={ThemeStyles.titleTextTheme3}>{this.state.menuLable}</Text>
			</View>;
		}
		if(this.state.footer==true){
		var footer = <View style={{position: 'absolute', left: 0, right: 0, bottom: 0,marginTop:10}}><Text style={{ color: '#000000',
                                   alignSelf:"flex-end",
                                   fontSize:12,paddingRight:5}}>Powered by YokuPro</Text></View>; 
	}
    return (
            <View onLayout={(event) => this.handleLayoutChange(event)} style={ThemeStyles.container}>
           
           {headerTab}
            <View>
            {search}
               </View>

            {resultData}
 		{retry}
            <PTRView  onRefresh={this._refresh} onScroll={() =>this.setState({footer:true})} scrollEventThrottle={16}>
            <View style={{paddingBottom:100,paddingTop:75}}>
            {restult}
            </View>
            </PTRView>
           
            {ImageUpload}
            {action}          
        	{footer}	
            
            <Modal isVisible={this.state.UploadUrl} onBackButtonPress={()=>this.hideModal()} style={{paddingTop:50}}>
            <View style={ThemeStyles.cardStyle}>
            <TouchableOpacity onPress={()=>{this.hideModal()}}>
            <Image style={styles.delete} source={deleteImage} />
            </TouchableOpacity>
            <View style={{alignSelf:"center"}}>
            <Text style={{fontSize:15,color:'#3498db'}}>Share url </Text>
            </View>
            <View style={{marginLeft:10,marginRight:10}}>
            <TextField
            label='Enter a url'
            value={this.state.uploadUrl}
            onChangeText={(uploadUrl) => this.setState({uploadUrl,errorMsgUrl:''})}
            error={this.state.errorMsgUrl}
            />
            </View>
            <View style={{marginTop:20,alignSelf:'flex-end',marginBottom:20}}>
            
            <Button
            style={{backgroundColor:'#EC9B64',alignSelf:"center"}}
            raised
            backgroundColor="#EC9B64"
            onPress={()=>this.uploadResources('Url')}
            icon={{name: 'upload', type: 'font-awesome'}}
            title='Share' />
            </View>
            </View>
            
            </Modal>
            <Modal isVisible={this.state.UploadQuery} onBackButtonPress={()=>this.hideModal()} style={{paddingTop:50}}>
            <View style={ThemeStyles.cardStyle}>
            <TouchableOpacity onPress={()=>{this.hideModal()}}>
            <Image style={styles.delete} source={deleteImage} />
            </TouchableOpacity>
            <Text style={{fontSize:12,color:'green',alignSelf:'center'}}>{this.state.QueryMsg}</Text>
            <View style={{alignSelf:"center"}}>
            <Text style={{fontSize:15,color:'#3498db'}}>Ask Trainer</Text>
            </View>
            <View style={{marginLeft:10,marginRight:10}}>
            <TextField
            label='Enter a Query'
            value={this.state.Query}
            onChangeText={(Query) => this.setState({Query,errorMsgQuery:''})}
            error={this.state.errorMsgQuery}
            />
            </View>
            <View style={{marginTop:10,alignSelf:'flex-end',marginBottom:10}}>
            <Button
            style={{backgroundColor:'#EC9B64',alignSelf:"center"}}
            raised
            backgroundColor="#EC9B64"
            onPress={()=>this.uploadResources('Query')}
            title='Submit' />
            </View>
            </View>
            
            </Modal>
           
          	</View>

    );
  }
}
var styles = StyleSheet.create({
 
   container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#f9f9f9',
  },
                               button: {
                               borderColor: '#9B9B9B',
                               borderWidth: 1 / PixelRatio.get(),
                               margin: 5,
                               padding: 5
                               },
  welcome: {
    fontSize: 15,
    color: '#4c1cea',
  },
                               controls: {
                               backgroundColor: "transparent",
                               borderRadius: 5,
                               position: 'absolute',
                               bottom: 44,
                               left: 4,
                               right: 4,
                               },
  welcomeNew: {
	paddingLeft: 30,
    fontSize: 15,
    textAlign: 'left',
    margin: 10,

                               }, backgroundVideo: {
                               position: 'absolute',
                               top: 0,
                               left: 0,
                               bottom: 0,
                               right: 0,
                               borderRadius: 10,
                               },
                               avatarContainer: {
                               borderColor: '#9B9B9B',
                               borderWidth: 1 / PixelRatio.get(),
                               justifyContent: 'center',
                               alignItems: 'center',
                               marginTop:20
                               },
                               avatar: {
                               borderRadius: 75,
                               width: 150,
                               height: 150
                               },
                               activityIndicator: {
                               flex: 1,
                               justifyContent: 'center',
                               alignItems: 'center',
                               height: 250
                               },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
 hasEventCircle: {
      backgroundColor: '#30dbdb',
		
    },
                               titleViewText: {
                               color: '#3b5998',
                               fontSize: 23,
                               alignSelf: 'center',
                               
                               
                               },
spinner: {
alignSelf: 'center',
    marginBottom: 50,
    marginTop: 150
  },	
 hasEventDaySelectedCircle: {
      backgroundColor: '#30dbdb',
    },


 titleContainer: {
    flex: 1,
    alignItems: "center"
  },
  Text: {
    fontWeight: "bold",
    textAlign: "center",
    color: "white"
  },
                               delete:{
                               width:20,
                               height:20,
                               alignSelf:"flex-end",
                               marginRight:10},
  titleValue: {
    flex: 1,
    color: "white"
  },
  buttonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    margin: 3,
	borderColor: "white"	
  }
});


