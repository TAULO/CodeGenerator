import React , {Fragment} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Image,
  TextInput,
  Text,
  StatusBar,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  Dimensions
} from 'react-native';
import color from '../common/colors';
import ImagePicker from 'react-native-image-picker';
import CustomButton from '../widgets/CustomButton';
import {getConfiguration, setConfiguration} from '../../utils/configuration';
import images from '../common/images';
import {create} from 'apisauce';
import Activity from '../common/ActivityIndicator';
import { RNCamera } from "react-native-camera";
import { check, PERMISSIONS, RESULTS } from "react-native-permissions";

const { height, width } = Dimensions.get("window");
import SmoothPicker from "react-native-smooth-picker";
import Timer from "./Timer"
// import commonData from '../../src/common/data';
// import data from '../../src/common/data';
// import {Colors} from 'react-native/Libraries/NewAppScreen';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import Video from 'react-native-video';
const CameraOptions = ["Video","Image"]
export default class CreatePost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      To: false,
      comment: '',
      scrollPadding: 0,
      postingAs: false,
      userProfile: '',
      count: 0,
      data: [],
      communityId: '',
      communityIndex: '',
      userProfilename: {
        first_name: '',
        last_name: '',
        id: '',
        img: '',
      },
      communityName: {
        name: '',
        id: '',
      },
      filepath: {
        data: '',
        uri: '',
      },
      fileData: '',
      fileUri: '',
   
      fileType: "image/jpeg",
      fileName: 'image.jpg',
      openCamera: false,
      cameraType: RNCamera.Constants.Type.back,
      videoRecording : false,
      selected: 0,
      feedName:'Feeder',
      isBusy:false,
      videoData: false ,
      go: this.props.route.params.go,
      height:0,
      tick:true
    };
    this.t = setInterval(() => {
      this.setState({count: this.state.count + 1});
    }, 1000);
  }

  componentDidMount() {
    this.checkPermission(
      Platform.OS == "ios"
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA,
      "Camera"
    );
    this.getProfile();
    console.log('communityId>>>>>', this.state.communityid);
 if(this.state.go == 'Video'){
   this.launchCamera();
 }
 else if(this.state.go == 'Pic'){
   this.launchImageLibrary();
 }
 else if(this.state.go){
   null
 }

    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow.bind(this),
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide.bind(this),
    );
  }

  checkPermission(type, typeName) {
    console.log(
      "calleddddd"
    );
    check(type)
      .then(result => {
        console.log("resultresult",result)
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log(
              "This feature is not available (on this device / in this context)"
            );
            break;
          case RESULTS.DENIED:
            console.log("denied");
            break;
          case RESULTS.GRANTED:
            // alert("hey");
            this.setState({ permissionGranted: true });
            break;
          case RESULTS.BLOCKED:
            console.log("blocked");
            break;
        }
      })
      .catch(error => {
        console.log("errorerrorerrorerror",error)
      });
  }

  _keyboardDidShow() {
    this.setState({
      scrollPadding: 0,
    });
  }

  _keyboardDidHide() {
    this.setState({
      scrollPadding: 0,
    });
  }
  componentWillUnmount() {
    // Remove the event listener before removing the screen
    clearTimeout(this.t);

    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  setCapture = async () => {

    console.log("suncnccncncnc")
    let context = this , options = {
      // skipProcessing: true,
      fixOrientation: true,
      base64: false,
      forceUpOrientation: true,
      quality: 0.8,
      exif: true
    };
    const response = await this.camera.takePictureAsync(options);
       console.log("datadatadatadata",response)

   
       let extension = response.uri.split('.').pop(),
        obj = {
          filePath: response,
          fileData: response.data,
          fileUri: response.uri,
          openCamera: false,
          videoData : false
        }
        if((extension == "jpg") || (extension ==  "jpeg")){
         obj = {...obj,fileType: "image/jpeg", fileName: 'image.jpg' }  
        }else {
          obj = {...obj,fileType: "image/"+extension, fileName: 'image.'+ extension }  
        }
         

        console.log("extensionextension",extension)
       context.setState(obj);
  };

  recordVideo = async () => {
     this.setState({videoRecording:true})
  
    let context = this , options = {
      // skipProcessing: true,
      quality : "RNCamera.Constants.VideoQuality.480p",
      // videoBitrate: 2*1024*1024, 
    
    };
    try{
      const response = await this.camera.recordAsync(options);
      console.log("datadatadatadata",response)
      let extension = response.uri.split('.').pop(),obj = {
       filePath: response,
       fileData: response.data,
       fileUri: response.uri,
       openCamera: false, 
       videoRecording:false,
       videoData : true
     }
      obj = {...obj,fileType: "video/"+extension, fileName: 'video.'+ extension }  

      // console.log('videoPath',obj)
      context.setState(obj);
    }catch(errr){ 
      console.log("errorrorororor",errr)
      // context.camera.stopRecording();
      // context.recordVideo()
    }

  };

  stopVideo= async () =>{
   let context = this;
   context.camera.stopRecording();
   this.setState({videoRecording:false, openCamera: false},()=>{
   })

    
      
  }

  launchCamera = () => {
    Keyboard.dismiss();
    this.setState({openCamera: true});
    return;
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchCamera(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        const source = {uri: response.uri};
        console.log('response', JSON.stringify(response));
        this.setState({
          filePath: response,
          fileData: response.data,
          fileUri: response.uri,
        });
      }
    });
  };

  // launchImageLibrary = () => {
  //   Keyboard.dismiss();
  //   let options = {
  //     mediaType: "mixed",
  //     storageOptions: {
  //       skipBackup: true,
  //       path: 'images',
  //     },
  //   };
  //   ImagePicker.launchImageLibrary(options, (response) => {
  //     console.log('Response = ', response);

  //     if (response.didCancel) {
  //       console.log('User cancelled image picker');
  //     } else if (response.error) {
  //       console.log('ImagePicker Error: ', response.error);
  //     } else if (response.customButton) {
  //       console.log('User tapped custom button: ', response.customButton);
  //       alert(response.customButton);
  //     } else {
  //       const source = {uri: response.uri};

  //       console.log('response', JSON.stringify(response));

      
  //         if(!(response &&response.type)){

  //           let extension = response.uri.split('.').pop();
  //              console.log("videoDatavideoDatavideoData",extension)
            
  //           let fileType = "image/jpeg", fileName ="image.jpg" , videoData = false; 
  //           if(extension == "MOV" || extension == "mp4" || extension == "webm"){
  //            fileType = "video/"+extension, fileName ='video.'+ extension , videoData = true;
  //           } else if((extension == "jpg") || (extension ==  "jpeg")){
  //             fileType = "image/jpeg", fileName = "image.jpg", videoData = false ;
  //            }else {
  //              fileType = "image/"+extension,  fileName = 'image.'+ extension  , videoData = false;
  //            }


  //           this.setState({
  //             fileUri: response.uri,
  //             fileType: fileType, 
  //             fileName: fileName,
  //             videoData : videoData
  //           });

  //         }else{
  //           this.setState({
  //             filePath: response,
  //             fileData: response.data,
  //             fileUri: response.uri,
  //             fileType: response.type, 
  //             fileName: response.fileName,
  //             videoData : false
  //           });
  //         }
      
  //     }
  //   });
  // };
  
  // Home Api
 

  launchImageLibrary = () => {
    Keyboard.dismiss();
    let options = {
      
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        const source = {uri: response.uri};

        console.log('response', response);

      
   

        
    

            let videoData  , extension = response.uri.split('.').pop();
               console.log("videoDatavideoDatavideoData",extension)
            
            let fileType = "image/jpeg", fileName ="image.jpg" ; 
            if((extension == "jpg") || (extension ==  "jpeg")){
              fileType = "image/jpeg", fileName = "image.jpg", videoData = false ;
             }else {
               fileType = "image/"+extension,  fileName = 'image.'+ extension  , videoData = false;
             }


            this.setState({
              fileUri: response.uri,
              fileType: fileType, 
              fileName: fileName,
            });

          
          
  
      
      }
    });
  };

 
  homeAPI() {
    // setConfiguration('Token', '');
    this.props
      .getHomeAPI()
      .then(
        () => this.afterCallingHomeAPI(),
        // {setRefreshing(false)
        // setDataSource(this.afterCallingHomeAPI());}
      )
      .catch((e) => this.showAlert(e.message, 300));
  }

  afterCallingHomeAPI() {
    console.log('isBusy value --- ', this.props.isBusy);
    console.log('response value home --- ', this.props.response);
    {this.state.communityId != '' ? 
    this.postingAsAPI()
    :
    null
  }
   
  }

  ////////////  createPost api /////////////////////////////////
  createPost() {
    Keyboard.dismiss();
    this.setState({isBusy: true,tick:false})
    let apiRoot = getConfiguration('API_ROOT'), acces_token = getConfiguration('Token'),{fileType, fileName} = this.state;
    // var customerid = getConfiguration('user_id');
    // create api.

    console.log("apiRootapiRootapiRoot",apiRoot, acces_token)
    const api = create({
      baseURL: apiRoot,
      // headers: { 'Content-Type': 'multipart/form-data', },
      headers: {
        Authorization: 'Bearer ' + acces_token,
        // 'Content-Type': 'multipart/form-data',
      },
    });

    console.log('api>>>>>>>', api);

    console.log('postContent', this.state.comment);
    console.log('images>>>>>>>>', this.state.fileUri);
    var photo = this.state.fileUri;
    const data = new FormData();
    data.append('post[content]', this.state.comment);
    data.append('post[allow_comments]', true);
    data.append('post[allow_share]', true);
     data.append('post[tags_attributes]');
     data.append('post[location_attributes]');

     if(this.state.fileUri != ''){
      let params = {
        uri: this.state.fileUri,
        // type: "image/jpeg",
        // name: 'image.jpg'
        type: fileType,
        name: fileName,
      }
       data.append("post[media]", params);
     }else{
      null
     }
      

    console.log('data>>>>', data, this.state.communityIndex == 0);
    {
      this.state.communityIndex == 0
        ? // post your data.
          api.post('/posts', data, {}).then((res) => this.afterPost(res).catch((err)=>{
            this.setState({isBusy: false})
            console.log("e  d " , err)}))
        : // post your data.
          api
            .post('/posts?community_id=' + this.state.communityId + '', data, {})
            .then((res) => this.afterPostCommunity(res));
    }
  }

  afterPost(res) {
    this.setState({isBusy: false})
    console.log('upload post succes======', res);
    console.log('response value createpost --- ', res.data);
    this.props.navigation.navigate('HomeTab');
    {
      res.data != null
        ? // alert('hhhhhhh')
          this.homeAPI()
        : null;
    }

    {
      res.data.message == undefined ? null : alert(res.data.message);
    }
  }

  afterPostCommunity(res) {
    this.setState({isBusy: false})
    console.log('upload post succes======', res);
    console.log('response value createpost --- ', res.data);
    this.props.navigation.navigate('CommunityScreen');
    {
      res.data != null
        ? // alert('hhhhhhh')
          this.homeAPI()
        : null;
    }
      
    {
      res.data.message == undefined ? null : alert(res.data.message);
    }
  }
  /////////////////////////////User Profile/////////////////////////
  getProfile() {
    this.props
      .getProfileAPI()
      .then(() => this.afterGetProfile())
      .catch((e) => console.log(e.message));
  }

  afterGetProfile() {
    console.log('isBusy value --- ', this.props.isBusyGetProfile);
    console.log(
      'response value getProfile --- ',
      this.props.responseGetProfile,
    );

    var userProfile = this.props.responseGetProfile.response;

    console.log('userprofile>>>>>>>>', userProfile);
    console.log('userfirst>>>>>>>>', userProfile.first_name);
    console.log('userlast>>>>>>>>', userProfile.last_name);
    console.log('userid>>>>>>>>', userProfile.id);
    console.log('usercover>>>>>>>>', userProfile.cover);

    this.setState({
      userProfilename: {
        first_name: userProfile.first_name,
        last_name: userProfile.last_name,
        id: userProfile.id,
        img: userProfile.cover,
      },
    });

    // this.setState({data:this.state.userProfilename})
    console.log('username>>>>>>>>>>', this.state.userProfilename);
    // console.log('datataa>>>>>>>>>>',this.state.data)
  }

  goToLocation() {
    this.props.navigation.navigate('Location');
  }

  postingAsAPI() {
    // setConfiguration('Token', '');
    this.props
      .PostingAsAPI()
      .then(() => this.afterCallingPostingAsAPI())
      .catch((e) => this.showAlert(e.message, 300));
  }

  afterCallingPostingAsAPI() {
    console.log('isBusy value --- ', this.props.isBusy);
    console.log('response value PostingAs --- ', this.props.responsePostingAs);
    var postingData = this.props.responsePostingAs.responsePostingAs;
    var datapo = [this.state.userProfilename];
    for (var i = 0; i < postingData.length; i++) {
      console.log('name>>>>>>>>>>', postingData[i].name);
      console.log('id>>>>>>>>>>', postingData[i].id);
      console.log('img>>>>>>>>>>', postingData[i].cover);
      datapo.push({
        name: postingData[i].name,
        id: postingData[i].id,
        img: postingData[i].cover,
      });
    }
    this.setState({data: datapo});
    console.log('datapost>>>>', datapo);
    console.log('data>>>>', this.state.data);
   
  }
  showAlert(message, duration) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      alert(message);
    }, duration);
  }

  createScreen(item, index) {
    console.log('index>>>>>', index);
    console.log('itemidd>>>>>', item.id);

    this.setState({
      postingAs: false,
      communityId: item.id,
      communityIndex: index,
      feedName: item.name
    });
  }
  UserList(item, index) {
    // console.log("item>>>>>>",item)
    return (
      <TouchableOpacity>
        <View style={{flex: 1, marginBottom: 10}}>
          {index == 0 ? (
            <View
              // onPress={() => this.createScreen(item, index)}
              style={{flexDirection: 'row'}}>
              <View
                style={{
                  flex: 0.2,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginVertical: 10,
                }}>
                {item.img == null ? (
                  <Image
                    source={images.dummyPerson}
                    style={{height: 50, width: 50}}
                  />
                ) : (
                  <Image
                    source={{uri: item.img}}
                    style={{height: 50, width: 50}}
                  />
                )}
              </View>

              <View style={{flex: 0.6, justifyContent: 'center'}}>
                <Text>
                  {item.first_name} {item.last_name}
                </Text>
              </View>
              <View
                style={{
                  flex: 0.2,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginVertical: 10,
                }}>
                <Image
                  source={images.EllipseRed}
                  style={{height: 25, width: 25}}
                />
              </View>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => this.createScreen(item, index)}
              style={{flexDirection: 'row'}}>
              <View
                style={{
                  flex: 0.2,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginVertical: 10,
                }}>
                {item.img == null ? (
                  <Image
                    source={images.dummyPerson}
                    style={{height: 50, width: 50}}
                  />
                ) : (
                  <Image
                    source={{uri: item.img}}
                    style={{height: 50, width: 50}}
                  />
                )}
              </View>

              <View style={{flex: 0.6, justifyContent: 'center'}}>
                <Text>{item.name}</Text>
              </View>
              <View
                style={{
                  flex: 0.2,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginVertical: 10,
                }}>
                <Image
                  source={images.EllipseGray}
                  style={{height: 25, width: 25}}
                />
              </View>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  backpostingAS() {
    this.setState({postingAs: false});
  }

  back() {
    this.props.navigation.goBack();
  }
  goToPostAs() {
    this.postingAsAPI();
    this.setState({postingAs: true});
  }


  handleChange = index => {
    console.log("indexindexindex",index)
    this.setState({
      selected: index
    });
  };
  render() {
    let {openCamera, cameraType, videoRecording, selected,isBusy, fileUri, videoData} = this.state;
    // console.log("openCameraopenCameraopenCamera",openCamera)
    return (
      <SafeAreaView style={{flex:1,backgroundColor: color.RED}}>
      <View style={[styles.flex1,{backgroundColor: color.WHITE}]}>
          <StatusBar
            hidden={false}
            backgroundColor={'#BD2026'}
            barStyle="light-content"
            
        />
      {!openCamera ?
       <View style={styles.flex1} >
        {this.state.postingAs == true ? (
          <View style={styles.flex1}>
            <View
              style={{height: '8%', width: '100%', backgroundColor: '#BD2026'}}>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <TouchableOpacity
                  onPress={() => this.backpostingAS()}
                  style={{
                    flex: 0.15,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    style={styles.notificationStyle}
                    source={images.back}
                  />
                </TouchableOpacity>

                <View
                  style={{
                    flex: 0.85,
                    justifyContent: 'center',
                  }}>
                  <Text style={{color: 'white', fontSize: 18}}>Posting As</Text>
                </View>
              </View>
            </View>

            <View
              style={{
                height: '92%',
                width: '100%',
                backgroundColor: color.WHITE,
              }}>
              <View
                style={{
                  height: '100%',
                  width: '100%',
                  position: 'absolute',
                  backgroundColor: color.WHITE,
                }}>
                <FlatList
                  data={this.state.data}
                  // ItemSeparatorComponent={this.FlatListItemSeparator}
                  renderItem={({item, index}) => this.UserList(item, index)}
                />
              </View>
            </View>
          </View>
        ) : (
          <View style={{flex: 1}}>
            <View
              style={{height: 50, width: '100%', backgroundColor: '#BD2026'}}>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <TouchableOpacity
                  onPress={() => this.back()}
                  style={{
                    flex: 0.15,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    resizeMode="contain"
                    style={styles.notificationStyle}
                    source={images.delete_icon}
                  />
                </TouchableOpacity>

                <View
                  style={{
                    flex: 0.7,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={{color: 'white', fontSize: 18}}>
                    Create Post
                  </Text>
                </View>
{
  this.state.comment != '' || this.state.fileUri != '' ?
  <TouchableOpacity
                  onPress={() => this.createPost()}
                  disabled={this.state.tick == true ? false : true}
                  style={{
                    flex: 0.15,
                    height: '100%',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    alignItems: 'center'
                  }}>
                  <Image
                    style={styles.notificationStyle}
                    source={images.tick}
                  />
                </TouchableOpacity>
                :
                null
}
                
              </View>
            </View>

            <View
              style={{
                height: '92%',
                width: '100%',
                backgroundColor: color.WHITE,
              }}>
              <View style={{height: '85%', width: '100%'}}>
                <View
                  style={{
                    height: 50,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Image
                    resizeMode="contain"
                    style={{
                      height: 40,
                      width: 40,
                      alignSelf: 'center',
                      marginHorizontal: 10,
                    }}
                    source={images.user_profileimage}
                  />
                  <TouchableOpacity
                    onPress={() => this.goToPostAs()}
                    style={{
                      paddingHorizontal:5,
                      height: 30,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderColor: 'gray',
                      borderWidth: 1,
                      flexDirection: 'row',
                    }}>
                    <Image
                      resizeMode="contain"
                      style={{
                        height: 20,
                        width: 20,
                        alignSelf: 'center',
                        tintColor: 'gray',
                      }}
                      source={images.Community}
                    />
                    <Text style={{marginHorizontal: 12}}>{this.state.feedName}</Text>
                    <Image
                      resizeMode="contain"
                      style={{height: 10, width: 15, alignSelf: 'center'}}
                      source={images.Group}
                    />
                  </TouchableOpacity>
                </View>
               

                
                <View style={{height: '100%', width: '100%'}}>
                  {/* <KeyboardAwareScrollView style={{height:'auto',width:'90%',paddingTop: this.state.scrollPadding}}> */}
                  <ScrollView style={{flex: 1}}>
                  <TextInput
                    placeholder="What's on your mind."
                    style={[styles.textinputStyle, styles.feedTextInput,{height: Math.max(height*.10, this.state.height)}]}
                    numberOfLines={5}
                    textAlignVertical={'top'}
                    textBreakStrategy={'highQuality'}
                    underlineColorAndroid={'transparent'}
                    autoCorrect
                    multiline={true}
                    onContentSizeChange={(event) => {
                      this.setState({ height: event.nativeEvent.contentSize.height })
                  }}
                  
                    onChangeText={(comment) =>
                      this.setState({comment: comment})
                    }
                    value={this.state.comment}
                  />
                  {/* </KeyboardAwareScrollView> */}
                  <View style={{height: '100%', width: '100%'}}>
                  
                  {(fileUri != "") && <Fragment>
                 
                  {videoData ? <Video source={{uri: fileUri}}   // Can be a URL or a local file.
                    ref={(ref) => {
                      this.player = ref
                    }}     
                    resizeMode="cover"                                 // Store reference
                    onBuffer={this.onBuffer}                // Callback when remote video is buffering
                    onError={this.videoError}               // Callback when video cannot be loaded
                    style={{height: height*.60, width: width}} />
                  :
                    <Image
                      resizeMode="cover"
                      source={{uri: this.state.fileUri}}
                      style={{height: height*.60, width: width}}
           
                      />
                   }
                    <TouchableOpacity onPress={()=> this.setState({fileUri:""})} style={{alignSelf:'flex-end',position:'absolute',top:-10}}>
                    <Image source={images.cross} style={{height:25,width:25}} />
                    </TouchableOpacity>
                </Fragment>}
               
                  </View>
                  </ScrollView>
              
                </View>
               
              </View>

              <View
                style={{
                  height: '18%',
                  width: '100%',
                  alignItems: 'center',
                  flexDirection: 'row',
                  backgroundColor: 'lightgray',
                }}>
                <TouchableOpacity
                  onPress={()=>this.launchCamera()}
                  style={{
                    height: 50,
                    width: 50,
                    borderRadius: 25,
                    backgroundColor: '#BD2026',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginHorizontal: 10,
                  }}>
                  <Image
                    resizeMode="contain"
                    source={images.video_icon}
                    style={{height: 25, width: 25}}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={(this, this.launchImageLibrary)}
                  style={{
                    height: 50,
                    width: 50,
                    borderRadius: 25,
                    backgroundColor: '#BD2026',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginHorizontal: 5,
                  }}>
                  <Image
                    resizeMode="contain"
                    source={images.post_photo}
                    style={{height: 25, width: 25}}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.goToLocation()}
                  style={{
                    height: 50,
                    width: 50,
                    borderRadius: 25,
                    backgroundColor: '#BD2026',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginHorizontal: 5,
                  }}>
                  <Image
                    resizeMode="contain"
                    source={images.location}
                    style={{height: 25, width: 25}}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

     </View> : 
     <RNCamera
              // captureAudio={audio}
              ref={ref => (this.camera = ref)}
              style={{flex: 1}}
              onStatusChange={res => {
                this.setState({ permissionGranted: true });
              }}
              mirrorMode
              type={cameraType}
              //   flashMode={flash}
              androidCameraPermissionOptions={{
                title: "Opu Health would like to access the camera",
                message:"This will let you take photos for the app to analyze.",
                buttonPositive: "Allow",
                buttonNegative: "Don't Allow"
              }}
            >
              <View
                style={[
                  styles.cameraFooter,
               
                ]}
              >
             
                <View style={styles.rowContentApart}>
               
                {videoRecording ? <Timer stopVideo = {()=>{ this.stopVideo() }} />: <TouchableOpacity
                    style={[styles.flex1,styles.firsthaderstyle]}
                    onPress={() =>
                      this.setState({
                        openCamera : false,
                      },()=>{
                        this.launchImageLibrary()
                      })
                    }
                  >
                   <Image
                    resizeMode="contain"
                    source={images.video_icon}
                    style={{height: 25, width: 25}}
                  />
                  </TouchableOpacity>}
                   <View style={styles.flex2}>
                   <SmoothPicker
                      initialScrollToIndex={0}
                      offsetSelection={0}
                      magnet
                      scrollAnimation
                      horizontal={true}
                      data={CameraOptions}
                      onSelected={({ item, index }) => this.handleChange(index)}
                      renderItem={({ item, index }) => {
                        // console.log("index == selected ",index, selected )
                        return( 
                        <Text style={[styles.sliderCamersOption,{color: index == selected ? "white" : "grey"}]} selected={index === selected}>{item}</Text>
                      )}}/>
                   </View>
                   
                  <TouchableOpacity
                   style={[styles.flex1,styles.firsthaderstyle]}
                   disabled={videoRecording ? true:false}
                  onPress={() =>
                    this.setState({
                      cameraType: cameraType == RNCamera.Constants.Type.back ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back
                    })
                  }
                >
                 <Image
                  resizeMode="contain"
                  source={images.camerachange2}
                  style={{height: 25, width: 25}}
                />
                </TouchableOpacity>
                 
            
                </View>
              
              </View>
              <TouchableOpacity 
                    style={styles.cameraIconContainer}
                  onPress={() => {
                    if(selected == 0){
                      if(videoRecording){
                        this.stopVideo() 
                      }else{
                        this.recordVideo()
                      } 
                    }else{
                      this.setCapture()
                    }
                  
                    }}>
                  <Image
                    resizeMode="contain"
                    source={videoRecording ? images.shotButtonRed : images.shotButton}
                    style={styles.cameraIcon}
                  />
                  </TouchableOpacity>
                  
           
            </RNCamera>}
         


            {isBusy ? <Activity /> : null}

      </View>
    </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  rowContentApart: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  cameraFooter: {
    bottom: 0,
    position: "absolute",
     width: width,
     height:142,
// paddingTop:109,
    // alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    backgroundColor: "rgba(4,0,0,0.5)"
  },
  firsthaderstyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
  },
  notificationStyle: {
    height: 18,
    width: 18,
    tintColor: 'white',
  },
  userProfileStyle: {
    height: 40,
    width: 40,
    borderWidth: 1,
    borderColor: 'white',
    alignSelf: 'center',
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  textinputStyle: {
    left: 10,
  },
  moreStyle: {
    height: 20,
    width: 20,
    marginBottom: 12,
  },
  firsthaderstyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
  },
  notificationStyle: {
    height: 18,
    width: 18,
    tintColor: 'white',
  },
  userProfileStyle: {
    height: 40,
    width: 40,
    borderWidth: 1,
    borderColor: 'white',
    alignSelf: 'center',
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  textinputStyle: {
    left: 10,
  },
  moreStyle: {
    height: 20,
    width: 20,
    marginBottom: 12,
  },
  cameraIconContainer: {
    position: "absolute",
    left : width*.42,
    bottom: height*.15
  },
  cameraIcon:{height: 50, width: 50},
  flex1 : {flex: 1},
  flex2 : {flex: 2},
  feedTextInput: {
    height:height*.10,
    width:width*.95,

   },
   videoIconContainer: {
    position: "absolute",
    left : width*.70,
    bottom: height*.15
   },
   sliderCamersOption: {color: "white",
     padding : 5
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  VideoStyle: {
    height: height, width: width
  }
});
