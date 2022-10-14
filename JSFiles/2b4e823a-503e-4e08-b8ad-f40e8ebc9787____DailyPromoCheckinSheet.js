import React, { useState, useEffect } from "react";
import { Container, Header, Title,Content, Card, CardItem, Thumbnail, Text, Icon, Left, Body, Right, List, ListItem, Accordion,Separator, Picker, Button as Header_Button  } from 'native-base';
import { Pressable,View,Dimensions, StyleSheet, ScrollView, Image, TouchableOpacity,BackHandler, Keyboard,Alert,ActivityIndicator,TextInput, Modal, Button, RefreshControl, DeviceEventEmitter, NativeEventEmitter,Switch, FlatList} from 'react-native';
import {Collapse, CollapseHeader, CollapseBody} from "accordion-collapse-react-native";
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT= Dimensions.get('window').height;
import {Overlay } from "react-native-elements";
import { useTasks} from "../providers/TasksProvider";
import Toast from "react-native-simple-toast";
import nationality from '../components/nationality.json'
import Fontisto from 'react-native-vector-icons/Fontisto'
import styles from '../components/styles/Home_style';
import moment from 'moment'
import Colors from '../components/styles/Color';
import styless from '../components/styles/styless';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {BluetoothManager,BluetoothEscposPrinter,BluetoothTscPrinter} from 'react-native-bluetooth-escpos-printer';
import { useAuth } from "../providers/AuthProvider";


// Action sheet contains a list of Each action should have a `title`
// string and `action` function property. A "Cancel" action is automatically
// added to the end of your list of actions. You must also provide the
// closeOverlay function that this component will call to request that the
// action sheet be closed.
export function DailyPromoCheckinSheet({ navigation, route }) {
  const { checkin, editCheckin, editpenalty, checkout, balance, editCheck_in, editCheckout, Order, editCheckinExtension, tasks, rooms, changeRoom, GoRefund } = useTasks();
 // const [newproduct, setproduct] = useState(GoodInfo.name);
  //const [newprice, setprice] = useState(GoodInfo.price);
  //const [newquantity, setquantity] = useState(GoodInfo.quantity);

 // const checkinInfo= checkin.find(x => x.temp_id === route.params.checkinInfo) ;
  const {  userData } = useAuth();
const checkinInfo= route.params.checkinInfo;

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
  const [visibleextension_personModal, setvisibleextension_personModal] = useState(false);
  const [newquantity, setquantity] = useState("");
  const [newquantity_ext, setquantity_ext] = useState("");
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
  const [ExtDate, setExtDate] = useState(checkinInfo.extension);
  const [ExtAmount, setExtAmount] = useState(checkinInfo.extension_rate);
  const [actionSheetVisible_edit, setActionSheetVisible_edit] = useState(false);
  const [extension_amount, setextension_amount] = useState("");
  const [extra_amount, setextra_amount] = useState("");
  const [floor, setfloor] = useState("");
  const [hour_duration, sethour_duration] = useState("");
  const [hour_key, sethour_key] = useState("");
  const [hour_price, sethour_price] = useState("");
  const [hour_rate, sethour_rate] = useState("");
  const [max, setmax] = useState("");
  const [price, setprice] = useState("");
  const [room_no, setroom_no] = useState("");
  const [room_no_id, setroom_no_id] = useState("");
  const [room_no_id_temp, setroom_no_id_temp] = useState("");
  const [room_type, setroom_type] = useState("");
  const [room_type_id, setroom_type_id] = useState("");
  const [visibleRoomType, setvisibleRoomType] = useState(false);
  const [visibleRoom, setvisibleRoom] = useState(false);
  const [visibleChangeRoom, setvisibleChangeRoom] = useState(false);
  const [Edit, setEdit] = useState("");
  const [RefReason, setRefReason] = useState("");
  const [visibleRefund, setvisibleRefund] = useState(false);
  const [Refunded, setRefunded] = useState("0");
  const [Voucher, setVoucher] = useState(0);

  const showDatePicker_edit = () => {
    setDatePickerVisibility_edit(true);
  };
  const hideDatePicker_edit = () => {
    setDatePickerVisibility_edit(false);
  };
  const handleConfirm_edit = (date) => {
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
      setExtDate(date)
      hideDatePicker_ext();
    }
    const showDatePicker_checkout = () => {
        setDatePickerVisibility_checkout(true);
      };
  const hideDatePicker_checkout = () => {
    setDatePickerVisibility_checkout(false);
  };
  const handleConfirm_checkout = (date) => {
   editCheckout(date, checkinInfo)
    hideDatePicker_checkout();
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const handleConfirm = (date) => {
    setEdit(date)
    editCheck_in(date, checkinInfo)
    hideDatePicker();
  };
  const currencyFormat = (num) => {
    return '₱' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
 }
 const BackPage = () => {
  setroom_type("")
  setroom_no("")
  setextra_amount("")
  navigation.goBack()
  }    
  const vacnt = (item) => {

    const filter = item.temp_id;
    const filterRes = rooms.filter((item) => {return(item.room_type_id.indexOf(filter) >= 0 && item.status =="Available")})
  
    return filterRes.length
  }   

  
const print = () => {
  Alert.alert(
    "Alert",
    "You want to print " + checkinInfo.customer + " info?",
    [
      {
        text: "Cancel",
        onPress: () => console.log('cancel pressed'),
        style: "cancel"
      },
      { text: "OK", onPress: async() =>   
      {
        try {
        
          await BluetoothEscposPrinter.printerInit();
          await BluetoothEscposPrinter.printerLeftSpace(0);
       
          await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
         // await BluetoothEscposPrinter.printPic(userData.hot_logo, {width: 200, left: 40});
          await BluetoothEscposPrinter.setBlob(0);
          await  BluetoothEscposPrinter.printText(userData.hot_name+"\r\n", {
              encoding: 'GBK',
              codepage: 0,
              widthtimes: 2,
              heigthtimes: 2,
              fonttype: 1
          });
          await BluetoothEscposPrinter.setBlob(0);
          await  BluetoothEscposPrinter.printText(userData.address+"\r\n\n", {
              encoding: 'GBK',
              codepage: 0,
              widthtimes: 0,
              heigthtimes: 0,
              fonttype: 1
          });
          await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
          await  BluetoothEscposPrinter.printText("F.O:  "+userData.full_name+"\r\n", {});
          await  BluetoothEscposPrinter.printText("Date & Time: " + moment(new Date).format('MMM D, YYYY hh:mm:ss A') + "\r\n",  {encoding: 'GBK',
          codepage: 0,
          widthtimes: 0,
          heigthtimes: 0,
          fonttype: 1});
          await  BluetoothEscposPrinter.printText("--------------------------------\r\n\n\n", {});
          await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
          await BluetoothEscposPrinter.setBlob(0);
          await  BluetoothEscposPrinter.printText("GUEST INFORMATION\r\n\n", {});
          await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
          await  BluetoothEscposPrinter.printText("ID: " +checkinInfo.control_num+"\r\n\n", {});
          await  BluetoothEscposPrinter.printText("Name: " +checkinInfo.customer+"\r\n\n", {encoding: 'GBK',
          codepage: 0,
          widthtimes: 0,
          heigthtimes: 0,
          fonttype: 1});
          await  BluetoothEscposPrinter.printText("Contact: " + checkinInfo.contact + "\r\n\n",  {encoding: 'GBK',
          codepage: 0,
          widthtimes: 0,
          heigthtimes: 0,
          fonttype: 1});
          await  BluetoothEscposPrinter.printText("Address: " + checkinInfo.address + "\r\n\n",  {encoding: 'GBK',
          codepage: 0,
          widthtimes: 0,
          heigthtimes: 0,
          fonttype: 1});
          await  BluetoothEscposPrinter.printText("Nationality: " + checkinInfo.nationality + "\r\n\n",  {encoding: 'GBK',
          codepage: 0,
          widthtimes: 0,
          heigthtimes: 0,
          fonttype: 1});
          await  BluetoothEscposPrinter.printText("Email: " + checkinInfo.email + "\r\n\n",  {encoding: 'GBK',
          codepage: 0,
          widthtimes: 0,
          heigthtimes: 0,
          fonttype: 1});
          await  BluetoothEscposPrinter.printText("Company: " + checkinInfo.company + "\r\n\n",  {encoding: 'GBK',
          codepage: 0,
          widthtimes: 0,
          heigthtimes: 0,
          fonttype: 1});
          await  BluetoothEscposPrinter.printText("Note: " + checkinInfo.note + "\r\n\n",  {encoding: 'GBK',
          codepage: 0,
          widthtimes: 0,
          heigthtimes: 0,
          fonttype: 1});


          await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
          await BluetoothEscposPrinter.setBlob(0);
          await  BluetoothEscposPrinter.printText("CHECK IN INFORMATION\r\n\n", {});
          await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
          await  BluetoothEscposPrinter.printText("Room: " + checkinInfo.room_type + "\r\n\n",  {encoding: 'GBK',
          codepage: 0,
          widthtimes: 0,
          heigthtimes: 0,
          fonttype: 1});
          await  BluetoothEscposPrinter.printText("Check in: " +moment(checkinInfo.check_in* 1000).format('MMM D, YYYY hh:mm A')+"\r\n\n", {encoding: 'GBK',
          codepage: 0,
          widthtimes: 0,
          heigthtimes: 0,
          fonttype: 1});
          await  BluetoothEscposPrinter.printText("Check out: " + moment(checkinInfo.check_out* 1000).format('MMM D, YYYY hh:mm A') + "\r\n\n",  {encoding: 'GBK',
          codepage: 0,
          widthtimes: 0,
          heigthtimes: 0,
          fonttype: 1});
          await  BluetoothEscposPrinter.printText("No. Person: " + checkinInfo.no_person + "\r\n\n",  {encoding: 'GBK',
          codepage: 0,
          widthtimes: 0,
          heigthtimes: 0,
          fonttype: 1});
          await  BluetoothEscposPrinter.printText("No. Person w/ Discount: " + checkinInfo.no_person_discount + "\r\n\n",  {encoding: 'GBK',
          codepage: 0,
          widthtimes: 0,
          heigthtimes: 0,
          fonttype: 1});
          await  BluetoothEscposPrinter.printText("Discount: " + checkinInfo.discount + "\r\n\n",  {encoding: 'GBK',
          codepage: 0,
          widthtimes: 0,
          heigthtimes: 0,
          fonttype: 1});
          await  BluetoothEscposPrinter.printText("Discount code/ID: " + checkinInfo.discount_code + "\r\n\n",  {encoding: 'GBK',
          codepage: 0,
          widthtimes: 0,
          heigthtimes: 0,
          fonttype: 1});
          await  BluetoothEscposPrinter.printText("  \r\n\n\n\n\n", {});
          await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.RIGHT);
          await  BluetoothEscposPrinter.printText("_________________________\r\n\n",  {
              encoding: 'GBK',
              codepage: 0,
              widthtimes: 0,
              heigthtimes: 0,
              fonttype: 1
          });
          await  BluetoothEscposPrinter.printText("GUEST SIGNATURE   \r\n\n\n\n\n\n\n\n\n",  {
              encoding: 'GBK',
              codepage: 0,
              widthtimes: 0,
              heigthtimes: 0,
              fonttype: 1
          });
        
          await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
         
      } catch (e) {
          alert(e.message || "ERROR");
      }

      } 
    }
    ],
    { cancelable: false }

    );

      

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
  let stay = parseFloat(checkinInfo.price)
  setstay_total(stay)
  setdiscount(checkinInfo.discount == ''||checkinInfo.discount == undefined ||checkinInfo.discount == 0 ||checkinInfo.discount == '0'?
  0  
  :  (parseFloat(checkinInfo.price)/ parseFloat(checkinInfo.no_person)*parseFloat(checkinInfo.no_person_discount))/100*parseFloat(checkinInfo.discount))
  setextension_calcu(checkinInfo.extension_value == 0 || checkinInfo.extension_value == '' || checkinInfo.extension_value == undefined? 0
  :
  checkinInfo.extension_mode =='Minute'? 
  parseFloat(checkinInfo.extension_person) == 0|| parseFloat(checkinInfo.extension_person) == ''?  minute_dur/parseFloat(checkinInfo.extension_value) * parseFloat(checkinInfo.extension_amount):  minute_dur/parseFloat(checkinInfo.extension_value) * parseFloat(checkinInfo.extension_amount) * parseFloat(checkinInfo.extension_person)
  :parseFloat(checkinInfo.extension_person) == 0|| parseFloat(checkinInfo.extension_person) == ''? hour_dur/parseFloat(checkinInfo.extension_value) * parseFloat(checkinInfo.extension_amount): hour_dur/parseFloat(checkinInfo.extension_value) * parseFloat(checkinInfo.extension_amount)* parseFloat(checkinInfo.extension_person))
setpenalty(checkinInfo.penalty== '' ||  checkinInfo.penalty == null||  checkinInfo.penalty == undefined? 0: parseFloat(checkinInfo.penalty))
setextra(checkinInfo.extra_person=="" || checkinInfo.extra_person == undefined? 0: parseFloat(checkinInfo.extra_person)* parseFloat(checkinInfo.extra_amount) )
setVoucher(checkinInfo.voucher_mode==""? 0: checkinInfo.voucher_mode=="Amount"?parseFloat(checkinInfo.voucher_value): stay-(stay/parseFloat(checkinInfo.voucher_value))  )
  
//settax_calcu((parseFloat(stay_total)+parseFloat(extra))*parseFloat(tax_val))
        }, []);
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
      <View style={{flex: 1, marginBottom: 50}}>
         <Overlay
            overlayStyle={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
            isVisible={actionSheetVisible_edit}
            onBackdropPress={() => setActionSheetVisible_edit(false)}
          >
 <ScrollView style={{height: "80%"}}>
      <View>
                    <Text style={styles.textTitle}>Company Name</Text>
                    <TextInput
                        style={[styles.textInputTitle, {borderColor: Colors.buttons,borderWidth: 1,borderRadius: 5,  }]}
                        onChangeText={(text) => setCompany(text)}
                        autoCorrect={true}
                        value={Company}
                    />
                    <Text style={styles.textTitle}>Customer Name*</Text>
                    <TextInput
                        style={[styles.textInputTitle, {borderColor: Colors.buttons,borderWidth: 1,borderRadius: 5,  }]}
                       onChangeText={(text) => setCustomer(text)}
                        autoCorrect={true}
                        value={Customer}
                    />
                    <Text style={styles.textTitle}>Address*</Text>
                    <TextInput
                        style={[styles.textInputTitle, {borderColor: Colors.buttons,borderWidth: 1,borderRadius: 5,  }]}
                        onChangeText={(text) => setAddress(text)}
                        autoCorrect={true}
                        value={Address}
                    />
                    <Text style={styles.textTitle}>Contact No.*</Text>
                    <TextInput
                        style={[styles.textInputTitle, {borderColor: Colors.buttons,borderWidth: 1,borderRadius: 5,  }]}
                        onChangeText={(text) => setContact(text)}
                        keyboardType={'phone-pad'}
                        returnKeyType={'done'}
                        autoCorrect={true}
                        value={Contact}
                    />
            <Text style={styles.textTitle}>Nationality*: {Nationality}</Text>
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
                        style={[styles.textInputTitle, {borderColor: Colors.buttons,borderWidth: 1,borderRadius: 5,  }]}
                        onChangeText={(text) => setEmail(text)}
                        keyboardType={'email-address'}
                        returnKeyType={'next'}
                        autoCorrect={true}
                        value={Email}
                    />
                    <Text style={styles.textTitle}>Number of person/s*</Text>
                    <TextInput
                        style={[styles.textInputTitle, {borderColor: Colors.buttons,borderWidth: 1,borderRadius: 5,  }]}
                        keyboardType='numeric'
                        autoCorrect={true}
                        onChangeText={(text) => {parseInt(text) > parseInt(newMaxPerson)? Toast.show('Maximum of '+ newMaxPerson+ ' Person'):setNoPerson(text)}}
                        value={NoPerson.toString()}
                    />
                     <Text style={styles.textTitle}>Number of Extra person/s : {ExtraPerson}</Text>
                    <TextInput
                        style={[styles.textInputTitle, {borderColor: Colors.buttons,borderWidth: 1,borderRadius: 5,  }]}
                        keyboardType='numeric' 
                        autoCorrect={true}
                        onChangeText={(text) => setExtraPerson(text)}
                        value={ExtraPerson}
                    />
                    <Text style={styles.textTitle}>Number of person/s with discount</Text>
                    <TextInput
                        style={[styles.textInputTitle, {borderColor: Colors.buttons,borderWidth: 1,borderRadius: 5,  }]}
                        onChangeText={(text) => setPersonWDiscount(text)}
                        keyboardType='numeric'
                        autoCorrect={true}
                        value={PersonWDiscount}
                    />
                    
                    <Text style={styles.textTitle}>Discount: </Text>
                 <TextInput
                        style={[styles.textInputTitle, {borderColor: Colors.buttons,borderWidth: 1,borderRadius: 5,  }]}
                        onChangeText={(text) => setDiscount(text)}
                        placeholder={"0%"}
                        keyboardType={"number-pad"}
                        value={Discount}
                    />
                    <Text style={styles.textTitle}>Discount Code/I.D</Text>
                    <TextInput
                        style={[styles.textInputTitle, {borderColor: Colors.buttons,borderWidth: 1,borderRadius: 5,  }]}
                        onChangeText={(text) => setDiscountID(text)}
                        autoCorrect={true}
                        value={DiscountID}
                    />

                     <Text style={styles.textTitle}>Note</Text>
                    <TextInput
                        style={[styles.textInputTitle, {borderColor: Colors.buttons,borderWidth: 1,borderRadius: 5,  }]}
                        onChangeText={(text) => setNote(text)}
                        autoCorrect={true}
                        value={Note}
                    />
             
          <Button
            title="Update Info"
            color={Colors.buttons} 
            onPress={() => {
              editCheckin(check_in,check_out,Company,Customer,Address,Contact,Nationality,Email,NoPerson,ExtraPerson,PersonWDiscount,Discount,DiscountID,Note, checkinInfo);
            }}
          />
        
      </View>
      </ScrollView>

     </Overlay>

     <Overlay
            overlayStyle={{ height: "30%", width: '80%' }}
            isVisible={visibleextension_personModal}
            onBackdropPress={() => setvisibleextension_personModal(false)}
          >
 <ScrollView style={{height: "80%"}}>
      <View>
                    <Text style={styles.textTitle}>Extension Amount</Text>
                    <TextInput
                        style={[styles.textInputTitle, {borderColor: Colors.buttons,borderWidth: 1,borderRadius: 5,  }]}
                        onChangeText={(text) => {isNaN(text)? null:setExtAmount(text)}}
                        keyboardType='numeric' 
                        autoCorrect={true}
                        
                        value={ExtAmount}
                    />
                    <Text style={styles.textTitle}>Extension Date</Text>
                    <Button title={ExtDate == ""?"Show Date Picker": moment(ExtDate).format('MMMM D, YYYY hh:mm a')} onPress={showDatePicker_ext}  color={Colors.buttons} />
     
                  
                  <DateTimePickerModal
        isVisible={isDatePickerVisible_ext}
        mode="datetime"
        onConfirm={handleConfirm_ext}
        onCancel={hideDatePicker_ext}
      />
      <View style={{marginTop: 30}}>
          <Button
            title="Update Info"
            color={Colors.buttons} 
            
            onPress={() => {
              editCheckinExtension(ExtAmount,ExtDate, checkinInfo);
            }}
          />
        </View>
      </View>
      </ScrollView>

     </Overlay>
   
      <View>
      <View style={{height: 60, paddingTop: 30, backgroundColor: Colors.BackColor, marginBottom: 10, flexDirection: 'row'}}>
      <Left>
<Text style={{fontSize: 18, fontWeight: 'bold', padding: 0.2, width: SCREEN_WIDTH, paddingLeft: 5}}>{checkinInfo.customer}</Text>
</Left>
<Right>
<MaterialCommunityIcons  name="printer-wireless" size={30} color={"black"} style={{paddingRight: 5}} onPress={print}/>
</Right>

</View>
<View style={{alignItems: 'center', borderRadius: 10, borderWidth: 1, width: '80%', marginLeft: '10%', backgroundColor: Colors.bottom_nav_background, borderColor: Colors.bottom_nav_background}}>
<Text style={{fontSize: 12, fontWeight: 'bold', padding: 0.2, color: Colors.BackColor}}> Remaining Time: {days < 0 ? days+1: days} Days {hours} Hours and {minutes} Minutes</Text>
</View>
<ScrollView style={{marginBottom: SCREEN_HEIGHT/15}}>

<Card>

<CardItem>
<TouchableOpacity onPress={showDatePicker}>
<Body>

<Text style={{  fontSize: 13,fontWeight: 'bold', color: '#898989'}}>
Check In
</Text> 
<View style={{ paddingLeft: 5, flexDirection: 'row'}}>
    <Text style={{fontSize: 20, color: Colors.BackColor}}>{moment(checkinInfo.check_in * 1000).format('D')}</Text>
    <Text style={{fontSize: 15}}> {moment(checkinInfo.check_in * 1000).format('MMM')}</Text>
    <Text style={{fontSize: 15}}> {moment(checkinInfo.check_in * 1000).format('YYYY')}</Text>
    <Text  style={{fontSize: 12, color: '#8d8d8d', marginLeft: -50}}>{"\n"} {moment(checkinInfo.check_in * 1000).format('h:mm a')}</Text>                                 

        </View>                                              

</Body>

</TouchableOpacity>
<DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
<TouchableOpacity style={{marginLeft: 50}}>
<Body>

<Text style={{  fontSize: 13,fontWeight: 'bold', color: '#898989'}}>
Check Out {ExtDate == ""? null: '+'}
</Text> 
<View style={{  fontSize: 12, paddingLeft: 10, flexDirection: 'row'}}>
    <Text style={{fontSize: 20, color: Colors.BackColor}}>{checkinInfo.extension ==""?moment(checkinInfo.check_out * 1000).format('D'): moment(ExtDate * 1000).format('D')}</Text>
    <Text style={{fontSize: 15}}> {checkinInfo.extension ==""?moment( checkinInfo.check_out * 1000).format('MMM'):moment(ExtDate * 1000).format('MMM')}</Text>
    <Text style={{fontSize: 15}}> {checkinInfo.extension ==""?moment( checkinInfo.check_out * 1000).format('YYYY'): moment(ExtDate * 1000).format('YYYY')}</Text>
    <Text  style={{fontSize: 12, color: '#8d8d8d', marginLeft: -50}}>{"\n"} {checkinInfo.extension ==""?moment( checkinInfo.check_out * 1000).format('h:mm a'):moment(ExtDate * 1000).format('h:mm a')}</Text>                                 

        </View>       
               
</Body>
</TouchableOpacity>
<DateTimePickerModal
        isVisible={isDatePickerVisible_checkout}
        mode="datetime"
        onConfirm={handleConfirm_checkout}
        onCancel={hideDatePicker_checkout}
      />
<Body>

<Text style={{ fontSize: 13,fontWeight: 'bold',  alignSelf: 'center', color: '#898989'}}>
Nights
</Text>
<Text style={{  fontSize: 20, paddingLeft: 10, alignSelf: 'center', color: Colors.BackColor, fontWeight: 'bold'}}>
{ExtDate == "" ? Math.floor(newquantity/(1000*60 * 60 * 24)): Math.floor(newquantity_ext/(1000*60 * 60 * 24))}
  </Text>                                              

</Body>
</CardItem>
</Card>


<View style={{alignItems: 'center'}}>
<TouchableOpacity style={{flexDirection: 'row'}} onPress={()=>setvisibleChangeRoom(true)}>
<Fontisto name={'room'} size={25} color={'#898989'} style={{paddingRight: 10}}/>
<Text style={{fontSize: 15, fontWeight: 'bold',color: 'grey', marginTop: 5}}>{checkinInfo.room_type} | Room {checkinInfo.room_no} </Text>
</TouchableOpacity>
<Modal  animationIn="slideInLeft"
          animationOut="slideOutRight"
          useNativeDriver={true} // try adding This line
        
                                                      visible={visibleChangeRoom}
                                                      onRequestClose ={() => setvisibleChangeRoom(false)} 
                                                  
                                                      onBackdropPress={() => setvisibleChangeRoom(false)} transparent={true}>
                                                  <View style={styless.centeredView}>
                                              <View style={styless.modalView}>
                                              <View style={{alignSelf: 'flex-end'}}>
                            <Pressable onPress={() =>setvisibleChangeRoom(false)}>
                              <AntDesign name="closecircleo" size={20} color={"black"} />
                            </Pressable>
                            
                          </View>
                                              <Text style={styles.textTitle}>Room Type</Text>
                                              <TouchableOpacity
                                                  style={{ ...styless.openButton, backgroundColor: Colors.BackColor }}
                                                  onPress={() => {setvisibleRoomType(true)}}
                                                >
                                                  <Text style={[styless.textStyle, {color: "white", fontWeight: 'normal'}]}>{room_type == ""? 'Select Room Type' : room_type}</Text>
                                                </TouchableOpacity>
                                                        <Text style={styles.textTitle}>Room Number</Text>
                                                        <TouchableOpacity
                                                  style={{ ...styless.openButton, backgroundColor: Colors.BackColor}}
                                                  onPress={() => {extra_amount == ""? Toast.show('Please Select Room Type'): setvisibleRoom(true)}}
                                                >
                                                  <Text style={[styless.textStyle, {color: "white", fontWeight: 'normal'}]}>{room_no == ""? 'Select Room Number': room_no}</Text>
                                                </TouchableOpacity>
                                             
                                                { hour_key == "1" || hour_key == "Daily" || hour_key == "Promo Daily" || hour_key == "Promo Hour"? 
                                             <View>
                                               <Text  style={styles.textTitle}>Check in: </Text>     
                                               <TouchableOpacity
                                                  style={{ ...styless.openButton, backgroundColor: Colors.BackColor}}
                                                  onPress={showDatePicker}
                                                >
                                                  <Text style={[styless.textStyle, {color: "white", fontWeight: 'normal'}]}>{Edit == ""? 'Check In':  moment(Edit).format('MMMM D, YYYY hh:mm a')}</Text>
                                                </TouchableOpacity></View> :null}
                                        {hour_key == ""? 
                                                <TouchableOpacity
                                                  style={{ ...styless.openButton, backgroundColor: Colors.bottom_nav_background, alignSelf: 'flex-end' }}
                                                  onPress={() => {
                                                    room_no == ""? Toast.show('Please Select Room'):                                                   
                                                    Alert.alert(
                                                      "WARNING!.",
                                                      "Are you sure you want to change the Room?",
                                                      [
                                                        {
                                                          text: "Cancel",
                                                          onPress: () => null,
                                                          style: "cancel"
                                                        },
                                                        { text: "OK", onPress: () =>  { Toast.show('PROCESSING...');BackPage();changeRoom(extra_amount, extension_amount, floor, hour_duration, hour_key, hour_price, hour_rate, max, price, room_no, room_no_id, room_no_id_temp, room_type, room_type_id, checkinInfo,Edit);setvisibleChangeRoom(false)
                                                      }         
                                                  }
                                                  ],
                                                  { cancelable: false }
                                                  
                                                  );
                                                  
                                                  }}
                                                >
                                                  <Text style={[styless.textStyle, {color: Colors.BackColor}]}>Save</Text>
                                                </TouchableOpacity>
                                                : Edit == ""? null:
<TouchableOpacity
                                                  style={{ ...styless.openButton, backgroundColor: Colors.bottom_nav_background, alignSelf: 'flex-end' }}
                                                  onPress={() => {
                                                    room_no == ""? Toast.show('Please Select Room'):                                                   
                                                    Alert.alert(
                                                      "WARNING!.",
                                                      "Are you sure you want to change the Room?",
                                                      [
                                                        {
                                                          text: "Cancel",
                                                          onPress: () => null,
                                                          style: "cancel"
                                                        },
                                                        { text: "OK", onPress: () =>  { Toast.show('PROCESSING...');BackPage();changeRoom(extra_amount, extension_amount, floor, hour_duration, hour_key, hour_price, hour_rate, max, price, room_no, room_no_id, room_no_id_temp, room_type, room_type_id, checkinInfo,Edit);setvisibleChangeRoom(false)
                                                      }         
                                                  }
                                                  ],
                                                  { cancelable: false }
                                                  
                                                  );
                                                  
                                                  }}
                                                >
                                                  <Text style={[styless.textStyle, {color: Colors.BackColor}]}>Save</Text>
                                                </TouchableOpacity>
}
                                              </View>
                                            </View>
                                                    </Modal>



                                                    <Modal
                                   animationType='fade'
                                
                                    visible={visibleRoomType}
                                    onRequestClose ={() => setvisibleRoomType(false)} 
                                
                                   onBackdropPress={() => setvisibleRoomType(false)} 
                                   transparent={true}>
                           
                           
                           
                                <View style={styless.centeredView}>
                            <View style={styless.modalView}>
                            <View style={{alignSelf: 'flex-end'}}>
        <TouchableOpacity  onPress={() => setvisibleRoomType(false)}>
        <AntDesign name="closecircleo" size={20} color={"black"} />
        </TouchableOpacity>
        
      </View>
<Text style={styles.textTitle}>  Room Type: {''} </Text>
                              {tasks && tasks.length > 0 ?
<FlatList

data={tasks}
showsVerticalScrollIndicator={false}
keyExtractor={item => item._id.toString()}
renderItem={({item}) =>  


<View style={{flexDirection: 'row', paddingLeft: 20}}>
  
<TouchableOpacity onPress={()=>{  setroom_type_id(item.temp_id), setroom_type(item.name),setprice(item.rate_mode == "Daily"? item.roomprice: item.rate_mode == "Hour"? item.roomprice_hour: item.roomprice),
setmax(item.max_person),sethour_rate(item.rate_mode == "Daily"? item.roomprice: item.rate_mode == "Hour"? item.roomprice_hour: item.roomprice), sethour_price(item.rate_mode == "Daily"? item.roomprice: item.rate_mode == "Hour"? item.roomprice_hour: item.roomprice),
sethour_key(item.rate_mode == "Daily"? "": item.rate_mode == "Hour"? "1": item.duration_mode), sethour_duration(item.rate_mode == "Hour"?item.hour_duration:item.rate_mode == "Promo"? item.promo_duration:item.hour_duration), setextension_amount(item.extension), setextra_amount(item.extra_person_charge),
setvisibleRoomType(false)}}>
<Left style={{flexDirection:'row'}}>
              <Text note style={{ paddingRight: 20, fontSize:12, color:'black', width: 120}} numberOfLines={1}>
                  {item.name} 
              </Text>
              <Text note style={[styles.textDescription],  { color:'black', }} numberOfLines={1}>
                  Vacant: {vacnt(item)}
              </Text>
          </Left>
          </TouchableOpacity>
          <Body />
          
        
</View> 
 }

/> 
:null}

                            
                          
                            </View>
                          </View>
                                  </Modal>

                                  <Modal
                                   animationType='fade'
                                
                                    visible={visibleRoom}
                                    onRequestClose ={() => setvisibleRoom(false)} 
                                
                                   onBackdropPress={() => setvisibleRoom(false)} 
                                   transparent={true}>
                           
                           
                           
                                <View style={styless.centeredView}>
                            <View style={styless.modalView}>
                            <View style={{alignSelf: 'flex-end'}}>
        <TouchableOpacity  onPress={() => setvisibleRoom(false)}>
        <AntDesign name="closecircleo" size={20} color={"black"} />
        </TouchableOpacity>
        
      </View>
<Text style={styles.textTitle}>  Room Number: {room_no} </Text>
                              {rooms && rooms.length > 0 ?
<FlatList

data={rooms}
showsVerticalScrollIndicator={false}
keyExtractor={item => item._id.toString()}
renderItem={({item}) =>  
item.status=="Available"&& item.room_type_id.indexOf(room_type_id) >= 0?


<View style={{flexDirection: 'row', paddingLeft: 20}}>
  
<TouchableOpacity onPress={()=>{  setfloor(item.floor), setroom_no(item.name),setroom_no_id(item._id),setroom_no_id_temp(item.room_id), setvisibleRoom(false) }}>
<Left style={{flexDirection:'row'}}>
              <Text note style={{ paddingRight: 20, fontSize:12, color:'black', width: 100}} numberOfLines={1}>
                 Room:  {item.name} 
              </Text>
              <Text note style={[styles.textDescription],  { color:'black', }} numberOfLines={1}>
                  {item.floor} Floor
              </Text>
          </Left>
          </TouchableOpacity>
          <Body />
          
        
</View> 
:null
 }

/> 
:null}

                            
                          
                            </View>
                          </View>
                                  </Modal>

 </View>

 <Card>
<CardItem button onPress={()=> setActionSheetVisible_edit(true)}>
<Body>
<Text style={{  fontSize: 14}}> Average Rate</Text>    
<Text style={{  fontSize: 14}}> Contact No.</Text>   
<Text style={{  fontSize: 14}}> Email</Text>   
<Text style={{  fontSize: 14}}> Control Number</Text>     
<Text style={{  fontSize: 14}}> NOTE</Text>             
                    
</Body>
<Body>
<Text style={{  fontSize: 16}}>             :</Text>  
<Text style={{  fontSize: 16}}>             :</Text>
<Text style={{  fontSize: 16}}>             :</Text>
<Text style={{  fontSize: 16}}>             :</Text>     
</Body>
<Body>
<Text style={{ fontSize: 13,fontWeight: 'bold'}}>₱{checkinInfo.hour_price  == '' || checkinInfo.hour_price  == undefined? checkinInfo.price +' / Night': checkinInfo.hour_price+' /'+ checkinInfo.hour_duration+ 'Hours'}</Text>
<Text style={{ fontSize: 13,fontWeight: 'bold'}}>{checkinInfo.contact}</Text>
<Text style={{ fontSize: 13,fontWeight: 'bold'}}>{checkinInfo.email}</Text>

<Text style={{ fontSize: 13,fontWeight: 'bold'}}>{checkinInfo.control_num}</Text>
{checkinInfo.note == ''?   <Text style={{ fontSize: 13,fontWeight: 'bold'}}>
N/A
  </Text>:   <Text style={{ fontSize: 13,fontWeight: 'bold'}}>
{checkinInfo.note}
  </Text>}     



</Body>
</CardItem>

</Card>
<Card style={{marginBottom: 1}} >
<Collapse>
      <CollapseHeader>
      <CardItem>
      <Body>
        <Text style={{  fontSize: 15,fontWeight: 'bold'}}>
         T O T A L:
        </Text>

            
          <Text style={{  fontSize: 16,fontWeight: 'bold',alignSelf: 'flex-end', marginTop: -30, padding: 5}}>
          {currencyFormat(parseFloat(Order&& Order.length ?Order.reduce((sum, i) => ( checkinInfo.temp_id == i.customer_id && i.method != "Paid"?
															sum += (i.quantity * i.price):
                              sum += 0
														), 0) : 0)+parseFloat(extension_calcu)+parseFloat(checkinInfo.penalty== '' ||  checkinInfo.penalty == null||  checkinInfo.penalty == undefined? 0: checkinInfo.penalty)+parseFloat(extra)+parseFloat(stay_total)-parseFloat(discount)-parseFloat(Voucher))}
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
          <Text style={{  fontSize: 11,fontWeight: '900' }}>{currencyFormat(parseFloat(Order&& Order.length ?Order.reduce((sum, i) => ( checkinInfo.temp_id == i.customer_id && i.method != "Paid"?
															sum += (i.quantity * i.price):
                              sum += 0
														), 0) : 0)+parseFloat(extra))
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
                                                            onChangeText={(text) => {isNaN(text)? null:setpenalty_amount(text)}}
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
          currencyFormat(parseFloat(Order&& Order.length ?Order.reduce((sum, i) => ( checkinInfo.temp_id == i.customer_id && i.method != "Paid"?
            sum += (i.quantity * i.price):
            sum += 0
          ), 0) : 0)+parseFloat(stay_total)+parseFloat(extension_calcu)+parseFloat(extra)+parseFloat(checkinInfo.penalty== '' ||  checkinInfo.penalty == null||  checkinInfo.penalty == undefined? 0: checkinInfo.penalty))
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
        {checkinInfo.voucher_mode ===""?null:   <ListItem>
        <Body>
        <Text style={{  fontSize: 11,fontWeight: '900'}}>{checkinInfo.voucher_mode == 'Amount'?
         checkinInfo.voucher_value: checkinInfo.voucher_value+'% off) '} Voucher ({checkinInfo.voucher_code})
                        
                       
                        : </Text>
        
            </Body>
            <Right>
          <Text style={{  fontSize: 11,fontWeight: '900' }}>  — { currencyFormat( parseFloat(Voucher))}
          </Text>
              </Right>
        </ListItem>}
        <ListItem last onPress={()=>setvisibleBalanceModal(true)}>
        <Body>
        <Text style={{  fontSize: 13,fontWeight: 'bold'}}>B A L A N C E: </Text>
            </Body>
            <Right>
          <Text style={{  fontSize: 11,fontWeight: 'bold' }}>{ 
          currencyFormat(parseFloat(Order&& Order.length ?Order.reduce((sum, i) => ( checkinInfo.temp_id == i.customer_id && i.method != "Paid"?
            sum += (i.quantity * i.price):
            sum += 0
          ), 0) : 0)+parseFloat(extension_calcu)+parseFloat(checkinInfo.penalty== '' ||  checkinInfo.penalty == null||  checkinInfo.penalty == undefined? 0: checkinInfo.penalty)+parseFloat(extra)+parseFloat(stay_total)-parseFloat(discount)-parseFloat(Voucher)-parseFloat(checkinInfo.payment))
        } </Text>
              </Right>
        </ListItem>
        <ListItem last onPress={()=>setvisibleRefund(true)}>
        <Body>
        <Text style={{  fontSize: 13,fontWeight: 'bold'}}>R E F U N D / C A N C E L</Text>
            </Body>
            
        </ListItem>
        <Modal visible={visibleRefund}
                                                      onRequestClose ={() => setvisibleRefund(false)} 
                                                  
                                                      onBackdropPress={() => setvisibleRefund(false)} transparent={true}>
                                                  <View style={styless.centeredView}>
                                              <View style={styless.modalView}>
                                              <View style={{alignSelf: 'flex-end'}}>
                            <Pressable onPress={() => setvisibleRefund(false)}>
                            <AntDesign name="closecircleo" size={20} color={"black"} />
                            </Pressable>
                            
                          </View>
                                                <Text style={styles.textTitle}>Amount Refunded:  {currencyFormat(Refunded === ""? 0: parseFloat(Refunded))}</Text>
                                                        <TextInput
                                                           style={{ height: 40, borderBottomColor: 'gray',borderWidth: 1,borderRadius: 5, paddingLeft: 20, width: 250, marginBottom: 10 }}
                                                           onChangeText={(text) => setRefunded(text)}
                                                            defaultValue={'0'}
                                                            keyboardType='numeric'
                                                            autoCorrect={true}
                                                        />
                                                        <Text style={styles.textTitle}>Reason</Text>
                                                         <TextInput
                                                                style={{     minHeight: 100, borderBottomColor: 'gray', borderWidth: 1,borderRadius: 5, paddingLeft: 20, width: 250, marginBottom: 10 }}
                                                            onChangeText={(text) => setRefReason(text)}
                                                            defaultValue={RefReason}
                                                            multiline={true}
                                                            autoCorrect={true}
                                                        />
                                
                                              
                                                        <TouchableOpacity
                                                  style={{ ...styless.openButton, backgroundColor: Colors.bottom_nav_background, alignSelf: 'flex-end', marginTop: 10 }}
                                                  onPress={() => {
                                                    Refunded == ""? Toast.show('Please Enter Amount to be Refund'):
                                                    RefReason ===""?Toast.show('Please Declare Reason')
                                                    :
                                                    Alert.alert(
                                                      "WARNING!.",
                                                      "Are you sure you want to Refund?",
                                                      [
                                                        {
                                                          text: "Cancel",
                                                          onPress: () => null,
                                                          style: "cancel"
                                                        },
                                                        { text: "OK", onPress: () =>  { Toast.show('PROCESSING...'); setvisibleRefund(false);BackPage();GoRefund(checkinInfo, Refunded, RefReason)
                                                      }         
                                                  }
                                                  ],
                                                  { cancelable: false }
                                                  
                                                  );
                                                  
                                                    
                                                 }}
                                                  >
                                                  <Text style={[styless.textStyle, {color: Colors.BackColor}]}>Save</Text>
                                                </TouchableOpacity>
                                              </View>
                                            </View>
                                                    </Modal>
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
                          <Text style={styles.textTitle}>  Amount To Pay: { 
          currencyFormat(parseFloat(Order&& Order.length ?Order.reduce((sum, i) => ( checkinInfo.temp_id == i.customer_id && i.method != "Paid"?
            sum += (i.quantity * i.price):
            sum += 0
          ), 0) : 0)+parseFloat(extension_calcu)+parseFloat(checkinInfo.penalty== '' ||  checkinInfo.penalty == null||  checkinInfo.penalty == undefined? 0: checkinInfo.penalty)+parseFloat(extra)+parseFloat(stay_total)-parseFloat(discount)-parseFloat(Voucher)-parseFloat(checkinInfo.payment))
        }</Text>
                                                <Text style={styles.textTitle}>  Amount Payed: {currencyFormat(parseFloat(checkinInfo.payment))}</Text>
                                                        <TextInput
                                                           style={{ height: 40, borderBottomColor: 'gray',borderWidth: 1,borderRadius: 5, paddingLeft: 20, width: 250, marginBottom: 10 }}
                                                           onChangeText={(text) => setpayment(text)}
                                                            defaultValue={'0'}
                                                            keyboardType='numeric'
                                                            autoCorrect={true}
                                                        />
                                                         <Text style={styles.textTitle}>  Payment Method: {payment_method}</Text>
                                               
                                                        
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
                                                                <Picker.Item label={'E-Wallet'} value={'E-Wallet'} />
                                                             
                                                              </Picker>
                                                
                                                <TouchableOpacity
                                                  style={{ ...styless.openButton, backgroundColor: Colors.bottom_nav_background }}
                                                  disabled={(parseFloat(Order&& Order.length ?Order.reduce((sum, i) => ( checkinInfo.temp_id == i.customer_id && i.method != "Paid"?
                                                    sum += (i.quantity * i.price):
                                                    sum += 0
                                                  ), 0) : 0)+parseFloat(0)+parseFloat(0)+parseFloat(0)+parseFloat(0)-parseFloat(0)-parseFloat(checkinInfo.payment)) <= 0 ?false:true}
                                                  onPress={() => {checkout(stay_total,discount,extension_calcu,extra,DaysValue,checkinInfo,Voucher); BackPage()}}
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


<Card>
<CardItem bordered button onPress={()=> setvisibleextension_personModal(true)}>
          <Body style={{alignItems: 'center'}}>
            <Text style={{color: Colors.BackColor, fontWeight: 'bold'}}> ADDITIONAL INFORMATION</Text>
                 </Body>
     
       
      </CardItem>
<CardItem  button onPress={()=> setvisibleextension_personModal(true)}>
<Body>
<Text style={{  fontSize: 14}}> Extension Rate</Text>    
<Text style={{  fontSize: 14}}> Extension Date</Text>   
<Text style={{  fontSize: 14}}> No. of person/s</Text>   
<Text style={{  fontSize: 14, width: 150}}> Extra person/s</Text>   
<Text style={{  fontSize: 14, width: 150}}> Discounted Person</Text>  
<Text style={{  fontSize: 14, width: 150}}> Discount code/id</Text>                                 
</Body>
<Body>
<Text style={{  fontSize: 16}}>             :</Text>  
<Text style={{  fontSize: 16}}>             :</Text>
<Text style={{  fontSize: 16}}>             :</Text>             
<Text style={{  fontSize: 16}}>             :</Text>
<Text style={{  fontSize: 16}}>             :</Text>
<Text style={{  fontSize: 16}}>             :</Text>
</Body>
<Body>
<Text style={{ fontSize: 12,fontWeight: 'bold'}}>{currencyFormat(parseFloat(ExtAmount))}</Text>
<Text style={{ fontSize: 10,fontWeight: 'bold', paddingTop: 5, paddingBottom: 5}}> {checkinInfo.extension == 0 || checkinInfo.extension == undefined ? 'N/A':moment(checkinInfo.extension * 1000).format('MMM D, YYYY hh:mm a')}</Text>
<Text style={{ fontSize: 13,fontWeight: 'bold', width: 250}}>{checkinInfo.no_person}</Text>
<Text style={{ fontSize: 13,fontWeight: 'bold'}}>{checkinInfo.extra_person} ({currencyFormat(parseFloat(checkinInfo.extra_amount))})</Text>
{checkinInfo.no_person_discount == ''?   <Text style={{ fontSize: 13,fontWeight: 'bold'}}>
N/A
  </Text>:   <Text style={{ fontSize: 13,fontWeight: 'bold'}}>
{checkinInfo.no_person_discount}
  </Text>}
{checkinInfo.discount_code == ''?   <Text style={{ fontSize: 13,fontWeight: 'bold'}}>
N/A
  </Text>:   <Text style={{ fontSize: 13,fontWeight: 'bold'}}>
{checkinInfo.discount_code}
  </Text>}              



</Body>
</CardItem>

</Card>

<Card>
    <CardItem>
      <Body>
      <View style={{flexDirection: 'row'}}>
        <Text style={{  fontSize: 13,fontWeight: 'bold'}}>
         Addtional: {Order&& Order.length ? '₱ ' + Order.reduce((sum, i) => ( checkinInfo.temp_id == i.customer_id && i.method != "Paid"?
															sum += (i.quantity * i.price):
                              sum += 0
														), 0).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : 0}
        </Text>
       
                                                  
        </View>
        <View style={{flexDirection: 'row'}}>
        <Text style={{  fontSize: 13,fontWeight: 'bold'}}>
         Paid: {Order&& Order.length ? '₱ ' + Order.reduce((sum, i) => ( checkinInfo.temp_id == i.customer_id && i.method == "Paid"?
															sum += (i.quantity * i.price):
                              sum += 0
														), 0).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : 0}
        </Text>
       
                                                  
        </View>
        <View >
        <View style={{flexDirection: 'row', paddingLeft: -5}}>

<Left style={{flexDirection:'row', width: 120, paddingRight: 10}}>
                   <Text note style={{ paddingRight: 30, fontSize:12, color:'black', fontWeight: 'bold'}}>QTY</Text>
                   <Text note style={[styles.textDescription],{ color:'black', fontSize:12, paddingRight: 25, fontWeight: 'bold'}} numberOfLines={1}>Item</Text>
                   <Text note style={[styles.textDescription],{ color:'black', fontSize:12, paddingLeft: 50, fontWeight: 'bold'}} numberOfLines={1}>Price</Text>
                   <Text note style={[styles.textDescription],{ color:'black', fontSize:12, paddingLeft: 20, fontWeight: 'bold'}} numberOfLines={1}>Subtotal</Text>
                   <Text note style={[styles.textDescription],{ color:'black', fontSize:12, paddingLeft: 30, fontWeight: 'bold'}} numberOfLines={1}>Name</Text>
               </Left>


                   
               <Body /> 
</View>    
  <FlatList
  style={{width: SCREEN_WIDTH}}
      data={Order}
     
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) =>  
      checkinInfo.temp_id === item.customer_id ?
   <View style={{flexDirection: 'row', paddingLeft: -5}}>
   <TouchableOpacity>
<Left style={{flexDirection:'row', width: 120, paddingRight: 30}}>
                   <Text note style={{ paddingRight: 5, color:'black', width: 30}}>{item.quantity}</Text>
                   {item.method =="Paid"?
                    <Text note style={[styles.textDescription],{ color: Colors.BackColor, width: 105}} numberOfLines={1}>{item.item}</Text>
                    :
                    <Text note style={[styles.textDescription],{ color:'black', width: 105}} numberOfLines={1}>{item.item}</Text>
                  
                  }
                  
                   <Text note style={[styles.textDescription],{ color:'black',  marginLeft: 10, width: 80}} numberOfLines={1}>{item.price}</Text>
                   <Text note style={[styles.textDescription],{ color:'black',  marginLeft: -30, width: 50}} numberOfLines={1}>{item.price * item.quantity}</Text>
                   <Text note style={[styles.textDescription],{ color:'black',  marginLeft: 10, width: 80}} numberOfLines={1}>{item.customer}</Text>
               </Left>

               </TouchableOpacity>
                   
               <Body /> 
</View> :null }
  />
  </View>   
      </Body>

    </CardItem>
  </Card>
  
  <Card>
    <CardItem></CardItem>
  </Card>
  
  </ScrollView>
  
 
       
      </View>

    </View>
  );
}
