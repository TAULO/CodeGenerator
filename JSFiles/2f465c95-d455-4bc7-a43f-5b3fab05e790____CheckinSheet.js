
import React, { useState, useEffect } from "react";
import { Container, Header, Title,Content, Card, CardItem, Thumbnail, Text, Icon, Left, Body, Right, List, ListItem, Accordion,Separator, Picker, Button as Header_Button  } from 'native-base';
import { Pressable,View,Dimensions, StyleSheet, ScrollView, Image, TouchableOpacity,BackHandler, Keyboard,Alert,ActivityIndicator,TextInput, Modal, Button, RefreshControl, DeviceEventEmitter, NativeEventEmitter,Switch, FlatList} from 'react-native';
import {Collapse, CollapseHeader, CollapseBody} from "accordion-collapse-react-native";
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT= Dimensions.get('window').height;
import {Overlay } from "react-native-elements";
import { useRooms} from "../providers/RoomsProvider";
import Toast from "react-native-simple-toast";
import nationality from './nationality.json'
import Feather from 'react-native-vector-icons/Feather'
import styles from './styles/Home_style';
import moment from 'moment'
import Colors from './styles/Color';
import styless from './styles/styless';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { set } from "lodash";


// Action sheet contains a list of Each action should have a `title`
// string and `action` function property. A "Cancel" action is automatically
// added to the end of your list of actions. You must also provide the
// closeOverlay function that this component will call to request that the
// action sheet be closed.
export function CheckinSheet({visible, closeOverlay, checkinInfo }) {
  const { rooms } = useRooms();
 // const [newproduct, setproduct] = useState(GoodInfo.name);
  //const [newprice, setprice] = useState(GoodInfo.price);
  //const [newquantity, setquantity] = useState(GoodInfo.quantity);

  const [newMaxPerson, setNewMaxPerson] = useState(checkinInfo.max);
  const [check_in, setCheckin] = useState(checkinInfo.check_in);
  const [check_out, setCheckout] = useState(checkinInfo.check_out);
  const [Company, setCompany] = useState(checkinInfo.company);
  const [Customer, setCustomer] = useState(checkinInfo.customer);
  const [Address, setAddress] = useState(checkinInfo.address);
  const [Contact, setContact] = useState(checkinInfo.contact);
  const [Nationality, setNationality] = useState(checkinInfo.nationality);
  const [Email, setEmail] = useState(checkinInfo.email);
  const [NoPerson, setNoPerson] = useState(checkinInfo.no_person);
  const [ExtraPerson, setExtraPerson] = useState(checkinInfo.extra_person);
  const [PersonWDiscount, setPersonWDiscount] = useState(checkinInfo.no_person_discount);
  const [Discount, setDiscount] = useState(checkinInfo.discount);
  const [DiscountID, setDiscountID] = useState(checkinInfo.discount_code);
  const [Note, setNote] = useState(checkinInfo.note);

  const [isDatePickerVisible_checkout, setDatePickerVisibility_checkout] = useState(false);
  const [isDatePickerVisible_edit, setDatePickerVisibility_edit] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDatePickerVisible_out, setDatePickerVisibility_out] = useState(false);
  const [isDatePickerVisible_ext, setDatePickerVisibility_ext] = useState(false);
  const [visiblePenaltyModal, setvisiblePenaltyModal] = useState(false);
  const [visibleBalanceModal, setvisibleBalanceModal] = useState(false);
  const [newquantity, setquantity] = useState("");
  const [minute_dur, setminute_dur] = useState("");
  const [hour_dur, sethour_dur] = useState("");
  const [stay_total, setstay_total] = useState("");
  const [discount, setdiscount] = useState("");
  const [extension_calcu, setextension_calcu] = useState("");
  const [penalty, setpenalty] = useState("");
  const [extra, setextra] = useState("");
  const [DaysValue, setDays] = useState("");
  const [penalty_amount, setpenalty_amount] = useState(checkinInfo.penalty);
  const [payment, setpayment] = useState(checkinInfo.payment);
  const [payment_method, setpayment_method] = useState(checkinInfo.payment_method);
  const [penalty_description, setpenalty_description] = useState(checkinInfo.penalty_description);
  const [actionSheetVisible_edit, setActionSheetVisible_edit] = useState(false);

  const showDatePicker_edit = () => {
    setDatePickerVisibility_edit(true);
 
  };

  const hideDatePicker_edit = () => {
    setDatePickerVisibility_edit(false);
  };

  const handleConfirm_edit = (date) => {
    console.log("A date has been picked: ", date);
    setCheckin(date)
    hideDatePicker_edit();
  };





    const showDatePicker_ext= () => {
      setDatePickerVisibility_ext(true);
   
    };
  
    const hideDatePicker_ext = () => {
      setDatePickerVisibility_ext(false);
    };
  
    const handleConfirm_ext = (date) => {
      console.log("A date has been picked: ", date);
      //setCheckin(date)
      hideDatePicker_ext();
    }

    const showDatePicker_checkout = () => {
        setDatePickerVisibility_checkout(true);
     
      };



  const hideDatePicker_checkout = () => {
    setDatePickerVisibility_checkout(false);
  };

  const handleConfirm_checkout = (date) => {
    console.log("A date has been picked: ", date);
    setCheckout(date)
    hideDatePicker_checkout();
  };

  const showDatePicker_out = () => {
    setDatePickerVisibility_out(true);
  };

  const hideDatePicker_out = () => {
    setDatePickerVisibility_out(false);
  };

  const handleConfirm_out = (date) => {
    console.log("A date has been picked: ", date);
   editCheckout(date, checkinInfo)
    hideDatePicker_out();
  }

  const showDatePicker = () => {
    setDatePickerVisibility(true);
 
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    console.log("A date has been picked: ", date);
    editCheck_in(date, checkinInfo)
    hideDatePicker();
  };
  const currencyFormat = (num) => {
    return '₱' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
 }

 useEffect(() => {
            let in_check =  moment(checkinInfo.check_in* 1000).format('MMMM D, YYYY')
            let out_check = moment(checkinInfo.check_out* 1000).format('MMMM D, YYYY')
            let sub = new Date(out_check)- new Date(in_check);
            setquantity(sub)
            let startTimes_extension=moment(checkinInfo.check_out * 1000).format('HH:mm:ss a');
            let endTimes_extension=moment(checkinInfo.extension * 1000).format('HH:mm:ss a');
            var startTime_extension = moment(startTimes_extension, "HH:mm:ss a");
            var endTime_extension = moment(endTimes_extension, "HH:mm:ss a");
            let duration_extension = moment.duration(endTime_extension.diff(startTime_extension));
            let hours_extension = parseInt(duration_extension.asHours());
            let minutes_extension = parseInt(duration_extension.asMinutes())-hours_extension*60;     
                   let in_check_extension =  moment(checkinInfo.check_out * 1000).format('MMMM D, YYYY')
                   let out_check_extension = moment(checkinInfo.extension * 1000).format('MMMM D, YYYY')
                   let sub_extension = new Date(out_check_extension)- new Date(in_check_extension)
            let now_date_extension= new Date
            let new_date_value_extension = moment(now_date_extension).format('MMM D, YYYY hh:mm:ss A');
               let  hoursss_extension = sub_extension/(1000*60 * 60);
               let minute_dur= (hoursss_extension+hours_extension)*60+minutes_extension
               let hour_dur = hoursss_extension+hours_extension
               setDays(Math.floor(sub/(1000*60 * 60 * 24)))
            setminute_dur(minute_dur)
            sethour_dur(hour_dur)
            let stay = parseFloat(checkinInfo.price)*Math.floor(sub/(1000*60 * 60 * 24))
            setstay_total(stay)
            setdiscount(checkinInfo.discount == ''||checkinInfo.discount == undefined ||checkinInfo.discount == 0 ||checkinInfo.discount == '0'?
            0  
            :  (parseFloat(checkinInfo.price)*Math.floor(sub/(1000*60 * 60 * 24))*parseFloat(checkinInfo.no_person_discount))/100*parseFloat(checkinInfo.discount))
            setextension_calcu(checkinInfo.extension_value == 0 || checkinInfo.extension_value == '' || checkinInfo.extension_value == undefined? 0
            :
            checkinInfo.extension_mode =='Minute'? 
            parseFloat(checkinInfo.extension_person) == 0|| parseFloat(checkinInfo.extension_person) == ''?  minute_dur/parseFloat(checkinInfo.extension_value) * parseFloat(checkinInfo.extension_amount):  minute_dur/parseFloat(checkinInfo.extension_value) * parseFloat(checkinInfo.extension_amount) * parseFloat(checkinInfo.extension_person)
            :parseFloat(checkinInfo.extension_person) == 0|| parseFloat(checkinInfo.extension_person) == ''? hour_dur/parseFloat(checkinInfo.extension_value) * parseFloat(checkinInfo.extension_amount): hour_dur/parseFloat(checkinInfo.extension_value) * parseFloat(checkinInfo.extension_amount)* parseFloat(checkinInfo.extension_person))
    setpenalty(checkinInfo.penalty== '' ||  checkinInfo.penalty == null||  checkinInfo.penalty == undefined? 0: parseFloat(checkinInfo.penalty))
    setextra(checkinInfo.extra_person=="" || checkinInfo.extra_person == undefined? 0: parseFloat(checkinInfo.extra_person)* parseFloat(checkinInfo.extra_amount)*Math.floor(sub/(1000*60 * 60 * 24)) )

    //settax_calcu((parseFloat(stay_total)+parseFloat(extra))*parseFloat(tax_val))
  
  
  
  
        }, []);

const getDays =()=>{
          
}
 //console.log('GoodInfo: ',GoodInfo)

 var countDownDate = checkinInfo.extension == 0? new Date(checkinInfo.check_out*1000).getTime(): new Date(checkinInfo.extension*1000).getTime();
  // Get today's date and time
  var now = new Date().getTime();
    
  // Find the distance between now and the count down date
  var distance = countDownDate - now;
    
  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  let now_date= new Date
  let new_date_value = moment(now_date).format('MMM D, YYYY hh:mm:ss A');
  return (
      <>
         <Overlay
            overlayStyle={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
            isVisible={actionSheetVisible_edit}
            onBackdropPress={() => setActionSheetVisible_edit(false)}
          >
 <ScrollView style={{height: "80%"}}>
      <View>
                    <Text style={styles.textTitle}>Company Name</Text>
                    <TextInput
                        style={styles.textInputTitle}
                        onChangeText={(text) => setCompany(text)}
                        autoCorrect={true}
                        value={Company}
                    />
                    <Text style={styles.textTitle}>Customer Name*</Text>
                    <TextInput
                        style={styles.textInputTitle}
                       onChangeText={(text) => setCustomer(text)}
                        autoCorrect={true}
                        value={Customer}
                    />
                    <Text style={styles.textTitle}>Address*</Text>
                    <TextInput
                        style={styles.textInputTitle}
                        onChangeText={(text) => setAddress(text)}
                        autoCorrect={true}
                        value={Address}
                    />
                    <Text style={styles.textTitle}>Contact No.*</Text>
                    <TextInput
                        style={styles.textInputTitle}
                        onChangeText={(text) => setContact(text)}
                        keyboardType={'phone-pad'}
                        returnKeyType={'done'}
                        autoCorrect={true}
                        value={Contact}
                    />
            <Text style={styles.textTitle}>Nationality*: </Text>
            <Picker
              mode='dialog'
              placeholder="Select your Nationality"
              onValueChange={(itemValue, itemIndex) => setNationality(itemValue)}
              style={[styles.textInputTitle, { width: '100%' }]}
              //selectedValue={this.state.selected}
             // onValueChange={this.onValueChange.bind(this)}
            >
              {
                   nationality.map(person => ( <Picker.Item label={person.en_short_name} value={person.en_short_name} key={person.en_short_name} /> ))
              }
            </Picker>
           
<Text style={styles.textTitle}>E-mail</Text>
                    <TextInput
                        style={styles.textInputTitle}
                        onChangeText={(text) => setEmail(text)}
                        keyboardType={'email-address'}
                        returnKeyType={'next'}
                        autoCorrect={true}
                        value={Email}
                    />
                    <Text style={styles.textTitle}>Number of person/s*</Text>
                    <TextInput
                        style={styles.textInputTitle}
                        keyboardType='numeric'
                        autoCorrect={true}
                        onChangeText={(text) => {parseInt(text) > parseInt(newMaxPerson)? Toast.show('Maximum of '+ newMaxPerson+ ' Person'):setNoPerson(text)}}
                        value={NoPerson.toString()}
                    />
                     <Text style={styles.textTitle}>Number of Extra person/s : {ExtraPerson}</Text>
                    <TextInput
                        style={styles.textInputTitle}
                        keyboardType='numeric' 
                        autoCorrect={true}
                        onChangeText={(text) => setExtraPerson(text)}
                        value={ExtraPerson}
                    />
                    <Text style={styles.textTitle}>Number of person/s with discount</Text>
                    <TextInput
                        style={styles.textInputTitle}
                        onChangeText={(text) => setPersonWDiscount(text)}
                        keyboardType='numeric'
                        autoCorrect={true}
                        value={PersonWDiscount}
                    />
                    
                    <Text style={styles.textTitle}>Discount: </Text>
                 <TextInput
                        style={styles.textInputTitle}
                        onChangeText={(text) => setDiscount(text)}
                        placeholder={"0%"}
                        keyboardType={"number-pad"}
                        value={Discount}
                    />
                    <Text style={styles.textTitle}>Discount Code/I.D</Text>
                    <TextInput
                        style={styles.textInputTitle}
                        onChangeText={(text) => setDiscountID(text)}
                        autoCorrect={true}
                        value={DiscountID}
                    />

                     <Text style={styles.textTitle}>Note</Text>
                    <TextInput
                        style={styles.textInputTitle}
                        onChangeText={(text) => setNote(text)}
                        autoCorrect={true}
                        value={Note}
                    />
             
          <Button
            title="Update Info"
            onPress={() => {
              editCheckin(check_in,check_out,Company,Customer,Address,Contact,Nationality,Email,NoPerson,ExtraPerson,PersonWDiscount,Discount,DiscountID,Note, checkinInfo);
            }}
          />
        
      </View>
      </ScrollView>

     </Overlay>
    <Overlay
      overlayStyle={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
      isVisible={visible}
      onBackdropPress={closeOverlay}
    >
      <View>
      <View style={{alignItems: 'center'}}>

                <Text style={{fontSize: 15, fontWeight: 'bold', padding: 0.2}}>{checkinInfo.customer}</Text>
                <Text style={{fontSize: 12, fontWeight: 'bold', padding: 0.2}}> Remaining Time: {days < 0 ? days+1: days} Days {hours} Hours and {minutes} Minutes</Text>
              <Text style={{fontSize: 10, fontWeight: 'bold',color: 'grey'}}>{checkinInfo.room_no}- {checkinInfo.room_type} (Rate: ₱{checkinInfo.hour_price  == '' || checkinInfo.hour_price  == undefined? checkinInfo.price +'/Day': checkinInfo.hour_price+' /'+ checkinInfo.hour_duration+ 'Hours'})</Text>
    </View>



      <ScrollView style={{marginBottom: SCREEN_HEIGHT/14}}>
    <Card>
    <CardItem button onPress={()=> setActionSheetVisible_edit(true)}>
      <Body>
      <View style={{flexDirection: 'row'}}>
        <Text style={{  fontSize: 13,fontWeight: 'bold'}}>
          Contact No.:
        </Text> 
              <Text style={{  fontSize: 13, paddingLeft: 10}}>
              {checkinInfo.contact}
                      </Text>                                        
        </View>
        <View style={{flexDirection: 'row'}}>
        <Text style={{  fontSize: 13,fontWeight: 'bold'}}>
         Address: 
        </Text>
        <Text style={{  fontSize: 13, paddingLeft: 10}}>
        {checkinInfo.address}
                </Text>                                              
        </View>
        <View style={{flexDirection: 'row'}}>
      <Text style={{  fontSize: 13,fontWeight: 'bold'}}>
       Nationality: 
      </Text>
      <Text style={{  fontSize: 13, paddingLeft: 10}}>
      {checkinInfo.nationality}
              </Text>
      </View>
        <View style={{flexDirection: 'row'}}>
        <Text style={{  fontSize: 13,fontWeight: 'bold'}}>
         Email:
        </Text>
          {checkinInfo.email == '' ?<Text style={{  fontSize: 13, paddingLeft: 10}}>
        N/A
                </Text>  :<Text style={{  fontSize: 13, paddingLeft: 10}}>
        {checkinInfo.email}
                </Text>}                                     
        </View>
        <View style={{flexDirection: 'row'}}>
        <Text style={{  fontSize: 13,fontWeight: 'bold'}}>
          Company Name:
        </Text>
        {checkinInfo.company == ''?   <Text style={{  fontSize: 13, paddingLeft: 10}}>
        N/A
                </Text>:   <Text style={{  fontSize: 13, paddingLeft: 10}}>
        {checkinInfo.company}
                </Text>}                                             
        </View>
        <View style={{flexDirection: 'row'}}>
        <Text style={{  fontSize: 13,fontWeight: 'bold'}}>
          NOTE:
        </Text>
        {checkinInfo.note == ''?   <Text style={{  fontSize: 13, paddingLeft: 10}}>
        N/A
                </Text>:   <Text style={{  fontSize: 13, paddingLeft: 10}}>
        {checkinInfo.note}
                </Text>}                         
        </View>
      </Body>
    </CardItem>
  </Card>








  <Card>
    <CardItem>
      <Body>
      <View style={{flexDirection: 'row'}}>
        <Text style={{  fontSize: 13,fontWeight: 'bold'}}>
         Check-in:
        </Text>
        <TouchableOpacity onPress={showDatePicker}>
        <Text style={{  fontSize: 13, paddingLeft: 10}}>
        {moment(checkinInfo.check_in * 1000).format('MMM D, YYYY hh:mm a')}
                </Text>
                </TouchableOpacity>
                <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
        </View>
        <View style={{flexDirection: 'row'}}>
        <Text style={{  fontSize: 13,fontWeight: 'bold'}}>
        Check-out:
        </Text>
        <TouchableOpacity onPress={showDatePicker_out}>
        <Text style={{  fontSize: 13, paddingLeft: 10}}>
        {moment(checkinInfo.check_out * 1000).format('MMM D, YYYY hh:mm a')}
                </Text>
                </TouchableOpacity>

                <DateTimePickerModal
        isVisible={isDatePickerVisible_out}
        mode="datetime"
        onConfirm={handleConfirm_out}
        onCancel={hideDatePicker_out}
      />
        </View>
        <View style={{flexDirection: 'row'}}>
 <Text style={{  fontSize: 13, fontWeight: 'bold'}}>
 Extension Rate:
 </Text>
 <TouchableOpacity onPress={()=> {
        this.extension_list(checkinInfo.room_type_id)
   
   this.setState({visibleExt_RateModal: true})}}>
 <Text style={{  fontSize: 13, paddingLeft: 10}}>
 {checkinInfo.extension_amount ==''? 'Click HERE to choose Extension Rate':0}
 </Text>
 </TouchableOpacity>
                                     <Modal
                                       //visible={this.state.visibleExt_RateModal}
                                  //     onRequestClose ={() => this.setState({visibleExt_RateModal: false})} 
                                   
                                       //onBackdropPress={() => this.setState({visibleExt_RateModal: false})} 
                                       transparent={true}>
                                   <View style={styless.centeredView}>
                               <View style={styless.modalView}>
                               <View style={{alignSelf: 'flex-end'}}>
                            <Pressable onPress={() => this.setState({visibleExt_RateModal: false})}>
                            <AntDesign name="closecircleo" size={20} color={"black"} />
                            </Pressable>
                            
                          </View>
 <Text style={styles.textTitle}>  Extension Rate:0</Text>
                                                                                       {/*this.state.ext_list && this.state.ext_list.length > 0 ?
                                                     <FlatList
                                                         data={this.state.ext_list}
                                                         showsVerticalScrollIndicator={false}
                                                         ItemSeparatorComponent={this.renderItemSeparator}
                                                         keyExtractor={item => item._id}
                                                         renderItem={({item}) =>  
                                                         <View style={{flexDirection: 'row', paddingLeft: 20}}>
                                                         <TouchableOpacity onPress={()=>{
                                                             this.setState({   
                                                               extension_value: item.extension_value,
                                                               extension_mode: item.extension_mode,
                                                               extension_amount: item.extension_amount,
                                                             })
                                                         }}>
                                                     <Left style={{flexDirection:'row'}}>
                                                                         <Text note style={{ paddingRight: 20, fontSize:12, color:'black', width: 150}} >
                                                                        {item.extension_value} {item.extension_mode} 
                                                                         </Text>
                                                                         <Text note style={[styles.textDescription],  { color:'black', }} numberOfLines={1}>
                                                                             Amount: {item.extension_amount} 
                                                                         </Text>
                                                                     </Left>
                                                                     </TouchableOpacity>
                                                                     <Body />
                                                     </View>  }
                                                     /> 
                                                     :
                                                      null
                                                        */}
                                
                                 <TouchableOpacity
                                   style={{ ...styless.openButton, backgroundColor: Colors.bottom_nav_background, alignSelf: 'flex-end', marginTop: -30 }}
                                //   onPress={() => this.extension_list_Edit()}
                                 >
                                   <Text style={{ ...styless.textStyle, color: Colors.BackColor } }>Save</Text>
                                 </TouchableOpacity>
                               </View>
                             </View>
                                     </Modal>
</View>
{checkinInfo.extension_amount ==''?
null
/// if extension amount has a value
:
<View>
        <View style={{flexDirection: 'row'}}>
                <Text style={{  fontSize: 13, fontWeight: 'bold'}}>
                No. of person to extend:
                </Text>
                <TouchableOpacity onPress={()=> this.setState({visibleextension_personModal: true})}>
                <Text style={{  fontSize: 13, paddingLeft: 10}}>
                {checkinInfo.extension_person}
                </Text>
                </TouchableOpacity>            
                <Modal
                // visible={this.state.visibleextension_personModal}
                                                     // onRequestClose ={() => this.setState({visibleextension_personModal: false})} 
                                                  
                                                     // onBackdropPress={() => this.setState({visibleextension_personModal: false})} 
                                                      transparent={true}>
                                                  <View style={styless.centeredView}>
                                              <View style={styless.modalView}>
                                              <View style={{alignSelf: 'flex-end'}}>
                            <Pressable onPress={() => this.setState({visibleextension_personModal: false})}>
                            <AntDesign name="closecircleo" size={20} color={"black"} />
                            </Pressable>
                            
                          </View>
                                                <Text style={styles.textTitle}>  No. of Person to Extend: {parseFloat(checkinInfo.extension_person)}</Text>
                                                        <TextInput
                                                           style={{ height: 40, borderBottomColor: 'gray',borderWidth: 1,borderRadius: 5, paddingLeft: 20, width: 250, marginBottom: 10 }}
                                                           onChangeText={(text) => this.setState({extension_person: text})}
                                                            defaultValue={checkinInfo.extension_person}
                                                            keyboardType='numeric'
                                                            autoCorrect={true}
                                                        />
                                                        
                                                
                                                <TouchableOpacity
                                                  style={{ ...styless.openButton, backgroundColor: Colors.bottom_nav_background, alignSelf: 'flex-end', marginTop: 10 }}
                                                  onPress={() => console.log('okey') }
                                                >
                                                  <Text style={[styless.textStyle, {color: Colors.BackColor}]}>Save</Text>
                                                </TouchableOpacity>
                                              </View>
                                            </View>
                                                    </Modal>               
        </View>
{checkinInfo.extension_amount == ''? null: 
  <View style={{flexDirection: 'row'}}>
      <Text style={{  fontSize: 13, fontWeight: 'bold'}}>
 Extension Date:
 </Text>
<TouchableOpacity >
        <Text style={{  fontSize: 13, paddingLeft: 10}}>
        {checkinInfo.extension == 0 || checkinInfo.extension == undefined ? 'Click HERE for Extension':moment(checkinInfo.extension * 1000).format('MMM D, YYYY hh:mm a')}
                </Text>
                </TouchableOpacity>
                <DateTimePickerModal
        isVisible={isDatePickerVisible_ext}
        mode="datetime"
        onConfirm={handleConfirm_ext}
        onCancel={hideDatePicker_ext}
      />
 
  </View>
}
</View>
}
      </Body>
      <Right style={{marginTop: -25}}>
              <TouchableOpacity>
              <AntDesign name="calendar" size={25} color='grey' />
              </TouchableOpacity>
              </Right>
    </CardItem>
  </Card>







  <Card>
    <CardItem button onPress={()=>console.log('pressed')}>
      <Body>
          <View style={{flexDirection: 'row'}}>
                <Text style={{  fontSize: 13, fontWeight: 'bold'}}>
                No. of person/s:
                </Text>
                <Text style={{  fontSize: 13, paddingLeft: 10}}>
                {checkinInfo.no_person}
                </Text>  
        </View>
        <View style={{flexDirection: 'row'}}>
                <Text style={{  fontSize: 13, fontWeight: 'bold'}}>
                No. of Extra person/s:
                </Text>
                <Text style={{  fontSize: 13, paddingLeft: 10}}>
                {checkinInfo.extra_person} ({currencyFormat(parseFloat(checkinInfo.extra_amount))})
                </Text>
        </View>
        <View style={{flexDirection: 'row'}}>
                <Text style={{  fontSize: 13,fontWeight: 'bold'}}>
                Discount:
                </Text>
                {checkinInfo.discount_value == ''?   <Text style={{  fontSize: 13, paddingLeft: 10}}>
        N/A
                </Text>:   <Text style={{  fontSize: 13, paddingLeft: 10}}>
            {Math.round(checkinInfo.discount_value* 100 /10)*10 +'%'}
                </Text>}      
        </View>
        <View style={{flexDirection: 'row'}}>
        <Text style={{  fontSize: 13,fontWeight: 'bold'}}>
        No. of person with discount:
        </Text>
        {checkinInfo.no_person_discount == ''?   <Text style={{  fontSize: 13, paddingLeft: 10}}>
        N/A
                </Text>:   <Text style={{  fontSize: 13, paddingLeft: 10}}>
        {checkinInfo.no_person_discount}
                </Text>}
        </View>
        <View style={{flexDirection: 'row'}}>
        <Text style={{  fontSize: 13,fontWeight: 'bold'}}>
          Discount code/id:
        </Text>
        {checkinInfo.discount_code == ''?   <Text style={{  fontSize: 13, paddingLeft: 10}}>
        N/A
                </Text>:   <Text style={{  fontSize: 13, paddingLeft: 10}}>
        {checkinInfo.discount_code}
                </Text>}               
        </View>
        
      </Body>
      
      <Right style={{marginTop: -70}}>
              <TouchableOpacity>
              <AntDesign name="save" size={25} color='grey' />
              </TouchableOpacity>
              </Right>
    </CardItem>
  </Card>
 
  <Card>
    <CardItem>
      <Body>
      <View style={{flexDirection: 'row'}}>
        <Text style={{  fontSize: 13,fontWeight: 'bold'}}>
         Addtional:
        </Text>
       
                                                  
        </View>
        <View >
       
        {/*this.state.arrOrder && this.state.arrOrder.length > 0 ?
    
    <FlatList
 style={{width: SCREEN_WIDTH}}
    
    refreshControl={
      <RefreshControl
      refreshing = {this.state.refreshing}
      onRefresh={this._onRefresh.bind(this)}
      />}
        data={this.state.arrOrder}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item._id}
        renderItem={({item}) =>  
       
     <View style={{flexDirection: 'row', paddingLeft: 20}}>
     <TouchableOpacity>
<Left style={{flexDirection:'row', width: 120, paddingRight: 30}}>
                     <Text note style={{ paddingRight: 10, fontSize:12, color:'black'}}>
                         {item.total}
                     </Text>
                     <Text note style={[styles.textDescription],  { color:'black', }} numberOfLines={1}>
                         {item.customer_id}
                     </Text>
                 </Left>

                 </TouchableOpacity>
                                  {item.products && item.products.length > 0 ?
                      
                      <FlatList
                  
                      
                      refreshControl={
                        <RefreshControl
                        refreshing = {this.state.refreshing}
                        onRefresh={this._onRefresh.bind(this)}
                        />}
                          data={item.products}
                          showsVerticalScrollIndicator={false}
                          keyExtractor={item => item._id}
                          renderItem={({item}) =>  
                        
                      <View style={{flexDirection: 'row', paddingLeft: 20}}>
                      <TouchableOpacity>
                  <Left style={{flexDirection:'row'}}>
                                      <Text note style={{ paddingRight: 20, fontSize:12, color:'black', width: 100}} numberOfLines={1}>
                                          {item.item}
                                      </Text>
                                      <Text note style={[styles.textDescription],  { color:'black', }} numberOfLines={1}>
                                          {item.price * item.quantity} 
                                      </Text>
                                  </Left>
                                  </TouchableOpacity>
                                  <Body />  
                  </View>  }
                      />:
                      <NoDataView onRetryPress={this.getListNoteFromDb}/>               
                  }
                 <Body /> 
</View>  }
    />:
    <NoDataView onRetryPress={this.getListNoteFromDb}/>
    */
}
  </View>   
      </Body>

    </CardItem>
  </Card>









  <Card >
<Collapse>
      <CollapseHeader>
      <CardItem>
      <Body>
        <Text style={{  fontSize: 15,fontWeight: 'bold'}}>
         T O T A L:
        </Text>

            
          <Text style={{  fontSize: 16,fontWeight: 'bold',alignSelf: 'flex-end', marginTop: -30, padding: 5}}>
          {currencyFormat(parseFloat(checkinInfo.total_addtional)+parseFloat(extension_calcu)+parseFloat(checkinInfo.penalty== '' ||  checkinInfo.penalty == null||  checkinInfo.penalty == undefined? 0: checkinInfo.penalty)+parseFloat(extra)+parseFloat(stay_total)-parseFloat(discount))}
    </Text>     
      </Body>   
    </CardItem>
      </CollapseHeader>
      <CollapseBody>
        <ListItem>
        <Body>
        <Text style={{  fontSize: 11,fontWeight: '900'}}>{Math.floor(newquantity/(1000*60 * 60 * 24))} Days Stay: </Text>
            </Body>
            <Right>
          <Text style={{  fontSize: 11,fontWeight: '900' }}>
          { currencyFormat( parseFloat(stay_total))}
             </Text>
              </Right>
         
        </ListItem>
        <ListItem>
        <Body>
        <Text style={{  fontSize: 11,fontWeight: '900'}}>Other Charges: </Text>
        
            </Body>
            <Right>
          <Text style={{  fontSize: 11,fontWeight: '900' }}>{currencyFormat(parseFloat(checkinInfo.total_addtional)+parseFloat(extra))
          } </Text>
              </Right>
         
        </ListItem>
        <ListItem last>
        <Body>
        <Text style={{  fontSize: 11,fontWeight: '900'}}>EXTENSION {checkinInfo.extension ==0 || checkinInfo.extension == undefined? null
                                                                        :
                                                                        checkinInfo.extension_mode =='Minute'? '('+ minute_dur + ' Minutes)':
                                                                        '('+ hour_dur + ' Hours)'
                                                                        
                                                                        }: </Text>
        
            </Body>
            <Right>
          <Text style={{  fontSize: 11,fontWeight: '900' }}>{currencyFormat(parseFloat(extension_calcu))}
          </Text>
              </Right>
         
        </ListItem>
        <ListItem   onPress={()=>setvisiblePenaltyModal(true)}>
        <Body>
        <Text style={{  fontSize: 11,fontWeight: '900'}}>Penalty <Text style={{fontSize: 9}}>({checkinInfo.penalty_description})</Text>: </Text>
        
            </Body>
            <Right>
          <Text style={{  fontSize: 11,fontWeight: '900' }}>{
          currencyFormat(parseFloat(checkinInfo.penalty== '' ||  checkinInfo.penalty == null||  checkinInfo.penalty == undefined? 0: checkinInfo.penalty))
        } </Text>
              </Right>
         
        </ListItem>
        <Modal  animationIn="slideInLeft"
          animationOut="slideOutRight"
          useNativeDriver={true} // try adding This line
        
                                                      visible={visiblePenaltyModal}
                                                      onRequestClose ={() => setvisiblePenaltyModal(false)} 
                                                  
                                                      onBackdropPress={() => setvisiblePenaltyModal(false)} transparent={true}>
                                                  <View style={styless.centeredView}>
                                              <View style={styless.modalView}>
                                              <View style={{alignSelf: 'flex-end'}}>
                            <Pressable onPress={() =>setvisiblePenaltyModal(false)}>
                              <AntDesign name="closecircleo" size={20} color={"black"} />
                            </Pressable>
                            
                          </View>
                                              <Text style={styles.textTitle}>Penalty Amount</Text>
                                                        <TextInput
                                                            style={{ height: 40, borderBottomColor: 'gray',borderWidth: 1,borderRadius: 5, paddingLeft: 20, width: 250, marginBottom: 10 }}
                                                            onChangeText={(text) => setpenalty_amount(text)}
                                                            defaultValue= {checkinInfo.penalty== '' ||  checkinInfo.penalty == null||  checkinInfo.penalty == undefined?'0':checkinInfo.penalty.toString()}
                                                            keyboardType='numeric'
                                                            autoCorrect={true}
                                                        />
                                                        <Text style={styles.textTitle}>Penalty Description</Text>
                                                         <TextInput
                                                                style={{     minHeight: 100, borderBottomColor: 'gray', borderWidth: 1,borderRadius: 5, paddingLeft: 20, width: 250, marginBottom: 10 }}
                                                            onChangeText={(text) => setpenalty_description(text)}
                                                            defaultValue={checkinInfo.penalty_description}
                                                            multiline={true}
                                                            autoCorrect={true}
                                                        />
                                             
                                                <TouchableOpacity
                                                  style={{ ...styless.openButton, backgroundColor: Colors.bottom_nav_background, alignSelf: 'flex-end' }}
                                                  onPress={() => {editpenalty(penalty_amount, penalty_description, checkinInfo);setvisiblePenaltyModal(false)}}
                                                >
                                                  <Text style={[styless.textStyle, {color: Colors.BackColor}]}>Save</Text>
                                                </TouchableOpacity>
                                              </View>
                                            </View>
                                                    </Modal>

        <ListItem last>
        <Body>
        <Text style={{  fontSize: 11,fontWeight: 'bold'}}>SUBTOTAL: </Text>
        
            </Body>
            <Right>
          <Text style={{  fontSize: 11,fontWeight: 'bold' }}>
          {
          currencyFormat(parseFloat(checkinInfo.total_addtional)+parseFloat(stay_total)+parseFloat(extension_calcu)+parseFloat(extra)+parseFloat(checkinInfo.penalty== '' ||  checkinInfo.penalty == null||  checkinInfo.penalty == undefined? 0: checkinInfo.penalty))
        }
             </Text>
              </Right>
         
        </ListItem>
        <ListItem>
        <Body>
        <Text style={{  fontSize: 11,fontWeight: '900'}}>DISCOUNT {checkinInfo.discount == ''?
         null:' ('+ checkinInfo.discount
         +'% off) '}
                        
                       
                        : </Text>
        
            </Body>
            <Right>
          <Text style={{  fontSize: 11,fontWeight: '900' }}>  — { currencyFormat( parseFloat(discount))}
          </Text>
              </Right>
        </ListItem>
        <ListItem last onPress={()=>setvisibleBalanceModal(true)}>
        <Body>
        <Text style={{  fontSize: 13,fontWeight: 'bold'}}>B A L A N C E: </Text>
            </Body>
            <Right>
          <Text style={{  fontSize: 11,fontWeight: 'bold' }}>{ 
          currencyFormat(parseFloat(checkinInfo.total_addtional)+parseFloat(extension_calcu)+parseFloat(checkinInfo.penalty== '' ||  checkinInfo.penalty == null||  checkinInfo.penalty == undefined? 0: checkinInfo.penalty)+parseFloat(extra)+parseFloat(stay_total)-parseFloat(discount)-parseFloat(checkinInfo.payment))
        } </Text>
              </Right>
        </ListItem>
<Modal visible={visibleBalanceModal}
                                                      onRequestClose ={() => setvisibleBalanceModal(false)} 
                                                  
                                                      onBackdropPress={() => setvisibleBalanceModal(false)} transparent={true}>
                                                  <View style={styless.centeredView}>
                                              <View style={styless.modalView}>
                                              <View style={{alignSelf: 'flex-end'}}>
                            <Pressable onPress={() => setvisibleBalanceModal(false)}>
                            <AntDesign name="closecircleo" size={20} color={"black"} />
                            </Pressable>
                            
                          </View>
                                                <Text style={styles.textTitle}>  Amount Payed: {currencyFormat(parseFloat(checkinInfo.payment))}</Text>
                                                        <TextInput
                                                           style={{ height: 40, borderBottomColor: 'gray',borderWidth: 1,borderRadius: 5, paddingLeft: 20, width: 250, marginBottom: 10 }}
                                                           onChangeText={(text) => setpayment(text)}
                                                            defaultValue={'0'}
                                                            keyboardType='numeric'
                                                            autoCorrect={true}
                                                        />
                                                         <Text style={styles.textTitle}>  Payment Method: </Text>
                                               
                                                        
                                                          <Picker
                                                                mode='dropdown'
                                                                placeholder="Select your Payment Method"
                                                                //onValueChange={this.onValueChangePaymentMethod.bind(this)}
                                                                onValueChange={(itemValue, itemIndex) => setpayment_method(itemValue)}
                                                                style={{ height: 40, borderBottomColor: 'gray',borderWidth: 1,borderRadius: 5, paddingLeft: 20, width: 250, marginBottom: 10 }}
                                                                prompt='Payment Method'
                                                              >
                                                                <Picker.Item label={'Cash'} value={'Cash'} />
                                                                <Picker.Item label={'Debit Card'} value={'Debit Card'} />
                                                                <Picker.Item label={'Credit Card'} value={'Credit Card'} />
                                                                <Picker.Item label={'Check'} value={'Check'} />
                                                             
                                                              </Picker>
                                                
                                                <TouchableOpacity
                                                  style={{ ...styless.openButton, backgroundColor: Colors.bottom_nav_background }}
                                                  disabled={(parseFloat(checkinInfo.total_addtional)+parseFloat(0)+parseFloat(0)+parseFloat(0)+parseFloat(0)-parseFloat(0)-parseFloat(checkinInfo.payment)) <= 0 ?false:true}
                                                  onPress={() => checkout(stay_total,discount,extension_calcu,extra,DaysValue,checkinInfo)}
                                                  >
                                                  <Text style={[styless.textStyle, {color: Colors.BackColor}]}>Checkout</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                  style={{ ...styless.openButton, backgroundColor: Colors.bottom_nav_background, alignSelf: 'flex-end', marginTop: -30 }}
                                                  onPress={() => {setvisibleBalanceModal(false);balance(payment, payment_method, checkinInfo)}}
                                                  >
                                                  <Text style={[styless.textStyle, {color: Colors.BackColor}]}>Save</Text>
                                                </TouchableOpacity>
                                              </View>
                                            </View>
                                                    </Modal>
      </CollapseBody>
    </Collapse>
  
  </Card>




  
  </ScrollView>
       
      </View>
    </Overlay>
    </>
  );
}
