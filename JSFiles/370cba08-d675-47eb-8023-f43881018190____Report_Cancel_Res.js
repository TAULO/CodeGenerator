import React, { useState } from "react";
import { Dimensions, StyleSheet, FlatList, Image, TouchableOpacity, Button, PermissionsAndroid,Alert, BackHandler, Pressable, Modal } from 'react-native';
import { Container, Content, View, Left, Right, Icon, Card, CardItem, Badge, Text, Body, Thumbnail, Item, Input, Label, Header, SwipeRow, Tab, Tabs,ScrollableTab} from 'native-base';
var {height, width } = Dimensions.get('window');
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT= Dimensions.get('window').height;
import AntDesign from 'react-native-vector-icons/AntDesign';
import moment from 'moment'
import styles from './styles/Home.Style';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Foundation from 'react-native-vector-icons/Foundation'
import DateTimePicker from "react-native-modal-datetime-picker";
import DropDownPicker from 'react-native-dropdown-picker';
import styless from './styles/styles_component';
import { useTasks} from "../providers/TasksProvider";
import Colors from '../Colors';
import RNPrint from 'react-native-print';
import XLSX from 'xlsx';
import { writeFile, DownloadDirectoryPath } from 'react-native-fs';
import { ScrollView } from "react-native-gesture-handler";
import Toast from "react-native-simple-toast";

export function Report_Cancel_Res({navigation}) {
  
    const { tasks, getResult, getResultGoods, Res_Ref, res_out,Res_In,FD_Ref, FD_out, FD_in, ewallet, Debit,Credit,Cash,Cancel_Res,All_Ref, reserve  } = useTasks();
    const [customers, setCustomer] = useState(reserve)
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [check_out_value, setcheck_out_value] = useState("");
  const [check_in_value, setcheck_in_value] = useState("");
  const [check_in, setcheck_in] = useState("");
  const [check_out, setcheck_out] = useState("");
  const [category, setcategory] = useState("");
  const [overlayVisibleCheckin, setOverlayVisibleCheckin] = useState(false);
  
  const reports_info = reserve.map( ({check_in, check_out, room_no,room_type, customer,company,contact,control_num,discount,discount_code,discount_less, email, extension_total_amount, extension_person,extension_price,extension_rate,  nationality,extra_person, checkin_stat , hour_duration, no_person, no_person_discount, number_of_days, number_of_hours, note, tax, payment, payment_method, penalty, penalty_description, res_code, stay_total, total_addtional,temp_id}) => ({ check_in,check_out, room_no,room_type, customer,company,contact,control_num,discount,discount_code,discount_less, email, extension_total_amount, extension_person,extension_price,extension_rate,  nationality,extra_person, checkin_stat , hour_duration, no_person, no_person_discount, number_of_days, number_of_hours, note, tax, payment, payment_method, penalty, penalty_description, res_code, stay_total, total_addtional,temp_id }) )
 const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDatePickerVisible_checkout, setDatePickerVisibility_checkout] = useState(false);
  const DDP = DownloadDirectoryPath + '/';

  const input = res => res;
  const output =str => str;
  const key ="room_type_id"
  const room_types = [...new Map(reserve.map(item => [item[key], item])).values()]
  const key_nat ="nationality"
const natl = [...new Map(reserve.map(item => [item[key_nat], item])).values()]
const requestRunTimePermission=()=>{
   
  async function externalStoragePermission(){
    try{
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'External Storage Write Permission',
          message: 'App needs access to storage data',
        }
      );
      if(granted === PermissionsAndroid.RESULTS.GRANTED){
        console.log('customers: ', customers)
  const date_now = moment().format('MMM-D-YYYY=h-mm-a')
  const name = 'Cancelled Reservation ('+ date_now +' )'+'.xlsx'
  
  const ws= XLSX.utils.json_to_sheet(reports_info);
  console.log('ws: ', ws)
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, date_now+" report");
  const wbout =XLSX.write(wb, {type: 'binary', bookType: "xlsx"});
  const file = DDP + name;


  writeFile(file, output(wbout), 'ascii').then((res)=> {
    Alert.alert("Exportfile Success", "Exported to "+ file);
  }).catch((err) => {Alert.alert('exporting file error ', 'Export is not Available');});


      }else{
        alert('WRITE_EXTERNAL_STORAGE Permission Denied');
      }
    } catch(err){
      Alert.alert('Write Permission err: ', err);
      console.warn(err);
    }
  }

  if (Platform.OS === 'android'){
    externalStoragePermission();
  }else{console.log('not android')

  }
}



const  printHTML = async () => {
  let html_content = 
  `<style>
 
 
    #title{
      text-align:center;
      font-family: arial, sans-serif;
    }
    #students{
      text-align: center;
      font-family: arial,sans-serif;
      border-collapse: colapse;
      border: 3px solid #ddd;
      width:100%;
    }
    #students td, #students th {
      border: 1px solid #ddd;
      padding:8px;
    }
    #students tr:nth-child(even){background-color:#f2f2f2}

    #students th{
      padding-top: 12px;
      padding-bottom: 12px;
      text-align :center;
      background-color: #4caf50;
      color:white
    }
    </style>
    
    

  <table id="students">
<tbody>
<tr><th>Name </th>
<th>Check-in </th>
<th>Check-out </th>
<th>Room Type </th>

<th>Contact </th>
<th>Email </th>
<th>Nationality </th>
<th>No. of Person </th>
<th>Discount </th>
<th>Reason </th></tr>
<th>Refunded </th></tr>
${renderTableData()}
</tbody>
</table>`
  await RNPrint.print({
    html : html_content,
    fileName: 'Report',
    base64: true,
  })

};




const renderTableData = () => {
return customers.map((arrNote, index) => {
   return (
    `<tr>
      <td style=" word-break: break-all;">${arrNote.customer}</td>
      <td style=" word-break: break-all;">${moment(arrNote.check_in * 1000).format('MMM D YYYY h:mm a')}</td>
      <td style=" word-break: break-all;">${moment(arrNote.check_out * 1000).format('MMM D YYYY h:mm a')}</td>
      <td>${arrNote.room_type}-(${arrNote.room_no})</td>
      
      <td style=" word-break: break-all;">${arrNote.contact}</td>
      <td style=" word-break: break-all;">${arrNote.email}</td>
      <td style=" word-break: break-all;">${arrNote.nationality}</td>
      <td style=" word-break: break-all;">${arrNote.no_person}</td>
      <td style=" word-break: break-all;">${arrNote.discount}% (${arrNote.discount_code})</td>
        <td style=" word-break: break-all;">${arrNote.RefReason}</td>
      <td style=" word-break: break-all;">${arrNote.refund}</td>
    </tr>`
  )
})
}

const showDatePicker = () => {
    setDatePickerVisibility(true);
 
  };

  const hideDateTimePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDatePicked = (date) => {
    console.log("A date has been picked: ", date);
    setcheck_in_value(date)
    hideDateTimePicker();
  };
  const showDateTimePicker_check_out = () => {
    setDatePickerVisibility_checkout(true);
  };

  const hideDateTimePicker_check_out = () => {
    setDatePickerVisibility_checkout(false);
  };
  const handleDatePicked_check_out = (date) => {
    console.log("A date has been picked: ", date);
    setcheck_out_value(date)
    hideDateTimePicker_check_out();
  };
  const currencyFormat = (num) => {
    return '₱' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
 }

 const searchData = (text) => {
  
  const newData = reserve.filter(item => {
    const itemData = item.name.toUpperCase();
    const textData = text.toUpperCase();
   
    return itemData.indexOf(textData) > -1
  });

  setCustomer(newData)  
  
 

  }

  const room = (item) => {
   
    const filterRes= tasks.find(x => x.temp_id ===  item) ;
    console.log('filterRes: ', filterRes)

    return filterRes.customer
  }
  return (

   <View style={styles.mainContainer}>


                      <View style={styles.toolbar}>
               
                <View style={{width: '100%'}}>
                <Header searchBar rounded  style={{backgroundColor: Colors.BackColor}} androidStatusBarColor={Colors.BackColor}>
          <Item>
            <Ionicons name="search" size={20} color={Colors.BackColor}/>
            <Input placeholder="cancelled Reservation Search Customer Name" style={{borderColor: 'red', fontSize: 13}}    onChangeText={(text) => searchData(text)}/>
        
            <TouchableOpacity style={{paddingRight: 10}} onPress={requestRunTimePermission}>
            <MaterialCommunityIcons name="microsoft-excel" size={28} color={Colors.BackColor} />
            </TouchableOpacity>
            <TouchableOpacity  style={{paddingRight: 10}} onPress={printHTML}>
            <Ionicons name={"ios-print"} size={28} color={Colors.BackColor}/>
            </TouchableOpacity>
             </Item>
        
        </Header>
                </View>
               
                
            </View>
       
     
      
                                                      <Container>
        <Tabs renderTabBar={()=> <ScrollableTab tabsContainerStyle={{backgroundColor: Colors.BackColor }}/>}>
          <Tab heading="Detailed" tabStyle={{backgroundColor: Colors.BackColor, color: 'white' }} activeTabStyle={{backgroundColor: Colors.BackColor, color: 'white'  }}>
           
{customers && customers.length > 0 ?
                <FlatList
           
                    style={styles.viewList}
                    data={customers}
                    showsVerticalScrollIndicator={false}
                   
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item})  =>  
                    <Card style={{flex: 0, marginTop: 10}} >
            <CardItem bordered style={{backgroundColor:'gray'}}>
                                  <TouchableOpacity    onPress={()=>navigation.navigate('Customer_Details', {checkinInfo: item})} style={{width: '100%'}}>
                                    <Left  style={{marginTop: -5, marginBottom: -5}}>
                            
                                        <Text style={{maxWidth: SCREEN_WIDTH/2, color:'white'}}>{item.customer}</Text>
                                        <View style={{flexDirection: 'row', paddingLeft:10}}>
                                        <Ionicons name="people-outline" size={16} color={'white'}/>
                                        <Text note style={{color:'white'}}> {item.no_person}</Text>
                                        </View>
                                      <Body style={{flexDirection:'row'}}>
                                      <Text style={{color:'white'}}>{item.room_no}</Text>
                                        <Text style={{width: SCREEN_WIDTH/2-10,color:'white', paddingLeft:10}}>{item.room_type}</Text>
                                        
                                      </Body>
                                    </Left>
                                   
                                    </TouchableOpacity>
                                  </CardItem>
                                  <CardItem>
<TouchableOpacity onPress={()=>{navigation.navigate('Customer_Details', {checkinInfo: item})}}>
<Body>

<Text style={{  fontSize: 13,fontWeight: 'bold', color: '#898989',marginTop:-10}}>
Check In
</Text> 
<View style={{ paddingLeft: 5, flexDirection: 'row'}}>
    <Text style={{fontSize: 20, color: Colors.BackColor}}>{moment(item.check_in * 1000).format('D')}</Text>
    <Text style={{fontSize: 15}}> {moment(item.check_in * 1000).format('MMM')}</Text>
    <Text style={{fontSize: 15}}> {moment(item.check_in * 1000).format('YYYY')}</Text>
    <Text  style={{fontSize: 12, color: '#8d8d8d', marginLeft: -50}}>{"\n"} {moment(item.check_in * 1000).format('h:mm a')}</Text>                                 

        </View>                                              

</Body>

</TouchableOpacity>

<TouchableOpacity onPress={()=>{navigation.navigate('Customer_Details', {checkinInfo: item})}} style={{marginLeft: 50}}>
<Body>

<Text style={{  fontSize: 13,fontWeight: 'bold', color: '#898989',marginTop:-10}}>
Check Out {item.extension == ""? null: '+'}
</Text> 
<View style={{  fontSize: 12, paddingLeft: 10, flexDirection: 'row'}}>
    <Text style={{fontSize: 20, color: Colors.BackColor}}>{item.extension ==""?moment(item.check_out * 1000).format('D'): moment(item.extension * 1000).format('D')}</Text>
    <Text style={{fontSize: 15}}> {item.extension ==""?moment( item.check_out * 1000).format('MMM'):moment(item.extension * 1000).format('MMM')}</Text>
    <Text style={{fontSize: 15}}> {item.extension ==""?moment( item.check_out * 1000).format('YYYY'): moment(item.extension * 1000).format('YYYY')}</Text>
    <Text  style={{fontSize: 12, color: '#8d8d8d', marginLeft: -50}}>{"\n"} {item.extension ==""?moment( item.check_out * 1000).format('h:mm a'):moment(item.extension * 1000).format('h:mm a')}</Text>                                 

        </View>       
               
</Body>
</TouchableOpacity>

<Body>

<Text style={{ fontSize: 13,fontWeight: 'bold',  alignSelf: 'center', color: '#898989',marginTop:-10}}>
{item.hour_key == "1"? 'Hours':'Nights'}
</Text>
<Text style={{  fontSize: 20, paddingLeft: 10, alignSelf: 'center', color: Colors.BackColor, fontWeight: 'bold'}}>
{item.hour_key == "1"? item.number_of_hours: item.number_of_days}
</Text>                                              

</Body>
</CardItem>


<CardItem  style={{marginBottom: 5, paddingTop: -15, paddingBottom: -10,}}>
                                    
                                    <Left>
                                    <Foundation name={'clipboard-notes'} size={18} color={'black'} />
                                <Text style={{fontSize: 14,width: '100%',}}>{item.checkin_stat}</Text>
                                </Left>
                                <Body />
                                
                                  <Right>
                                  <Text note style={{width: '100%', alignContent:'flex-end',fontSize: 14,}}>{currencyFormat(parseFloat(item.tax))} </Text>
                                  </Right>
                              
                                  </CardItem>
              
                
              </Card>
                   
                  }
                /> :
                <FlatList
           
                style={styles.viewList}
                data={reserve}
                showsVerticalScrollIndicator={false}
               
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item})  =>  
                <Card style={{flex: 0, marginTop: 10}} >
 <CardItem bordered style={{backgroundColor:'gray'}}>
                                  <TouchableOpacity    onPress={()=>navigation.navigate('Customer_Details', {checkinInfo: item})} style={{width: '100%'}}>
                                    <Left  style={{marginTop: -5, marginBottom: -5}}>
                            
                                        <Text style={{maxWidth: SCREEN_WIDTH/2, color:'white'}}>{item.customer}</Text>
                                        <View style={{flexDirection: 'row', paddingLeft:10}}>
                                        <Ionicons name="people-outline" size={16} color={'white'}/>
                                        <Text note style={{color:'white'}}> {item.no_person}</Text>
                                        </View>
                                      <Body style={{flexDirection:'row'}}>
                                      <Text style={{color:'white'}}>{item.room_no}</Text>
                                        <Text style={{width: SCREEN_WIDTH/2-10,color:'white', paddingLeft:10}}>{item.room_type}</Text>
                                        
                                      </Body>
                                    </Left>
                                   
                                    </TouchableOpacity>
                                  </CardItem>
                                  <CardItem>
<TouchableOpacity onPress={()=>{navigation.navigate('Customer_Details', {checkinInfo: item})}}>
<Body>

<Text style={{  fontSize: 13,fontWeight: 'bold', color: '#898989',marginTop:-10}}>
Check In
</Text> 
<View style={{ paddingLeft: 5, flexDirection: 'row'}}>
    <Text style={{fontSize: 20, color: Colors.BackColor}}>{moment(item.check_in * 1000).format('D')}</Text>
    <Text style={{fontSize: 15}}> {moment(item.check_in * 1000).format('MMM')}</Text>
    <Text style={{fontSize: 15}}> {moment(item.check_in * 1000).format('YYYY')}</Text>
    <Text  style={{fontSize: 12, color: '#8d8d8d', marginLeft: -50}}>{"\n"} {moment(item.check_in * 1000).format('h:mm a')}</Text>                                 

        </View>                                              

</Body>

</TouchableOpacity>

<TouchableOpacity onPress={()=>{navigation.navigate('Customer_Details', {checkinInfo: item})}} style={{marginLeft: 50}}>
<Body>

<Text style={{  fontSize: 13,fontWeight: 'bold', color: '#898989',marginTop:-10}}>
Check Out {item.extension == ""? null: '+'}
</Text> 
<View style={{  fontSize: 12, paddingLeft: 10, flexDirection: 'row'}}>
    <Text style={{fontSize: 20, color: Colors.BackColor}}>{item.extension ==""?moment(item.check_out * 1000).format('D'): moment(item.extension * 1000).format('D')}</Text>
    <Text style={{fontSize: 15}}> {item.extension ==""?moment( item.check_out * 1000).format('MMM'):moment(item.extension * 1000).format('MMM')}</Text>
    <Text style={{fontSize: 15}}> {item.extension ==""?moment( item.check_out * 1000).format('YYYY'): moment(item.extension * 1000).format('YYYY')}</Text>
    <Text  style={{fontSize: 12, color: '#8d8d8d', marginLeft: -50}}>{"\n"} {item.extension ==""?moment( item.check_out * 1000).format('h:mm a'):moment(item.extension * 1000).format('h:mm a')}</Text>                                 

        </View>       
               
</Body>
</TouchableOpacity>

<Body>

<Text style={{ fontSize: 13,fontWeight: 'bold',  alignSelf: 'center', color: '#898989',marginTop:-10}}>
{item.hour_key == "1"? 'Hours':'Nights'}
</Text>
<Text style={{  fontSize: 20, paddingLeft: 10, alignSelf: 'center', color: Colors.BackColor, fontWeight: 'bold'}}>
{item.hour_key == "1"? item.number_of_hours: item.number_of_days}
</Text>                                              

</Body>
</CardItem>


<CardItem  style={{marginBottom: 5, paddingTop: -15, paddingBottom: -10,}}>
                                    
                                    <Left>
                                    <Foundation name={'clipboard-notes'} size={18} color={'black'} />
                                <Text style={{fontSize: 14,width: '100%',}}>{item.checkin_stat}</Text>
                                </Left>
                                <Body />
                                
                                  <Right>
                                  <Text note style={{width: '100%', alignContent:'flex-end',fontSize: 14,}}>{currencyFormat(parseFloat(item.tax))} </Text>
                                  </Right>
                              
                                  </CardItem>
              
                

            
              </Card>
               
              }
            />
            }
        
        <SwipeRow
 style={{height: 50}}
            leftOpenValue={75}
            rightOpenValue={-75}
            left={
              <TouchableOpacity
              style={{color: Colors.BackColor,marginTop: '5%', paddingLeft: 20}}
              onPress={requestRunTimePermission}
          >
            <MaterialCommunityIcons name={'microsoft-excel'} size={40} color={Colors.BackColor}/>
        
          </TouchableOpacity>   
            }
            body={
             
              <Body>
                <Text style={{fontFamily: 'monospace',fontSize: 15,fontWeight: 'bold', color: Colors.BackColor}}>
                 T O T A L:
                </Text>
                <Text style={{fontFamily: 'monospace',fontSize: 16,fontWeight: 'bold',alignSelf: 'flex-end', marginTop: -30, padding: 5,  color: Colors.BackColor}}>
        
        
        
                {customers && customers.length ? customers.reduce((sum, i) => (
              
                                      sum += parseFloat(i.tax)
                                    ), 0).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : reserve.reduce((sum, i) => (
              
                                      sum += parseFloat(i.tax)
                                    ), 0).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                </Text>
               
                
              </Body>
          
            }
            right={
             
              <TouchableOpacity
              style={{color: Colors.BackColor, marginTop: '5%', paddingLeft: 5}}
              onPress={printHTML}
          >
            
            <Ionicons name={"ios-print"} size={40} color={Colors.BackColor}/>
          
            
          </TouchableOpacity> 
           
            }
          />
 
          </Tab>
          <Tab heading="Summary" tabStyle={{backgroundColor: Colors.BackColor, color: 'white' }} activeTabStyle={{backgroundColor: Colors.BackColor, color: 'white'  }}>
             

<Card style={{flex: 0, marginTop: 10}} >
  <ScrollView>
<CardItem bordered>
                                                        <Left  style={{marginTop: -10, marginBottom: -10}}>
                                                
                                                          <Body>
                                                            <Text style={{fontSize: 14, fontWeight: 'bold'}}>Rooms</Text>
                                                            </Body>
                                                        </Left>
                                                     
                                                      </CardItem>
{room_types.map((item) => 
                                                      <CardItem key={item._id}>
                                                        <Left  style={{marginTop: -10, marginBottom: -10}}>
                                                
                                                          <Body>
                                                            <Text style={{fontSize: 13}}>{item.room_type}</Text>
                                                            </Body>
                                                        </Left>
                                                        <Right>
                                                    <Text style={{fontSize: 13}}>{  customers && customers.length ? customers.reduce((sum, i) => (
              
              sum += parseFloat(i.room == item.room ? 1: 0)
            ), 0) : reserve.reduce((sum, i) => (

              sum += parseFloat(i.room == item.room ? 1: 0)
            ), 0)}</Text>  
                                                     </Right>
                                                      </CardItem>
                                                 
                                                      
            
)}                                       

<CardItem bordered>
                                                        <Left  style={{marginTop: -10, marginBottom: -10}}>
                                                
                                                          <Body>
                                                            <Text style={{fontSize: 13, fontWeight: 'bold'}}>TOTAL</Text>
                                                            </Body>
                                                        </Left>
                                                        <Right>
                                                    <Text style={{fontSize: 13, fontWeight:'bold'}}>{customers && customers.length ? customers.reduce((sum, i) => (
              
              sum += parseFloat(1)
            ), 0) : reserve.reduce((sum, i) => (

              sum += parseFloat(1)
            ), 0)}</Text>  
                                                     </Right>
                                                      </CardItem>


                                                      <CardItem style={{marginTop: 20}}>
                                                        <Left  style={{marginTop: -10, marginBottom: -10}}>
                                                
                                                         
                                                            <Text style={{fontSize: 13,}}>Cash</Text>
                                                            
                                                        </Left>
                                                        <Body>
                                                    <Text style={{fontSize: 13}}>{customers && customers.length ? customers.reduce((sum, i) => (
              
              sum += parseFloat( i.payment_method == ""? 1: 0)
            ), 0) : reserve.reduce((sum, i) => (

              sum += parseFloat(i.payment_method == ""? 1: 0)
            ), 0)}</Text>  
                                                     </Body>
                                                      </CardItem>
                                                      <CardItem style={{marginTop: -10}}>
                                                        <Left  style={{marginTop: -10, marginBottom: -10}}>
                                                
                                                         
                                                            <Text style={{fontSize: 13,}}>Debit Card</Text>
                                                            
                                                        </Left>
                                                        <Body>
                                                    <Text style={{fontSize: 13}}>{customers && customers.length ? customers.reduce((sum, i) => (
              
              sum += parseFloat(i.payment_method=='Debit Card'? 1: 0)
            ), 0) : reserve.reduce((sum, i) => (

              sum += parseFloat(i.payment_method=='Debit Card'? 1: 0)
            ), 0)}</Text>  
                                                     </Body>
                                                      </CardItem>
                                                      <CardItem style={{marginTop: -10}}>
                                                        <Left  style={{marginTop: -10, marginBottom: -10}}>
                                                
                                                         
                                                            <Text style={{fontSize: 13,}}>Credit Card</Text>
                                                            
                                                        </Left>
                                                        <Body>
                                                    <Text style={{fontSize: 13}}>{customers && customers.length ? customers.reduce((sum, i) => (
              
              sum += parseFloat(i.payment_method=='Credit Card'? 1: 0)
            ), 0) : reserve.reduce((sum, i) => (

              sum += parseFloat(i.payment_method=='Credit Card'? 1: 0)
            ), 0)}</Text>  
                                                     </Body>
                                                      </CardItem>
                                                      <CardItem bordered style={{marginTop: -10}}>
                                                        <Left  style={{marginTop: -10, marginBottom: -10}}>
                                                
                                                         
                                                            <Text style={{fontSize: 13,}}>E-Wallet</Text>
                                                            
                                                        </Left>
                                                        <Body>
                                                    <Text style={{fontSize: 13}}>{customers && customers.length ? customers.reduce((sum, i) => (
              
              sum += parseFloat(i.payment_method=='E-Wallet'? 1: 0)
            ), 0): reserve.reduce((sum, i) => (

              sum += parseFloat(i.payment_method=='E-Wallet'? 1: 0)
            ), 0)}</Text>  
                                                     </Body>
                                                      </CardItem>
                                                  


                                                   
                                                      <CardItem style={{marginTop: 10}} >
                                                        <Left  style={{marginTop: -10, marginBottom: -10}}>
                                                
                                                          <Body>
                                                            <Text style={{fontSize: 14, fontWeight: 'bold'}}>Nationalities</Text>
                                                            </Body>
                                                        </Left>
                                                     
                                                      </CardItem>     
                                                      {natl.map((item) => 
                                                      <CardItem key={item._id} style={{height: 35}}>
                                                        <Left  style={{marginTop: -10, marginBottom: -10}}>
                                                
                                                          
                                                            <Text style={{fontSize: 13}}>{item.nationality}</Text>
                                                           
                                                        </Left>
                                                        <Body>
                                                    <Text style={{fontSize: 13}}>{  customers && customers.length ? customers.reduce((sum, i) => (
              
              sum += parseFloat(i.nationality == item.nationality ? 1: 0)
            ), 0) : reserve.reduce((sum, i) => (

              sum += parseFloat(i.nationality == item.nationality ? 1: 0)
            ), 0)}</Text>  
                                                     </Body>
                                                      </CardItem>
                                                 
                                                      
            
)}                                   

<CardItem bordered>
                                                        <Left  style={{marginTop: -10, marginBottom: -10}}>
                                                
                                                          
                                                            <Text style={{fontSize: 13, fontWeight: 'bold'}}>TOTAL GUEST</Text>
                                                        
                                                        </Left>
                                                        <Body>
                                                    <Text style={{fontSize: 13, fontWeight:'bold'}}>{customers && customers.length ? customers.reduce((sum, i) => (
              
              sum += 1
            ), 0) : reserve.reduce((sum, i) => (

              sum += 1
            ), 0)}</Text>  
                                                     </Body>
                                                      </CardItem>
                                                
                                                     
</ScrollView>

                                                    </Card>



         
         
          </Tab>
      
        </Tabs>
      </Container>      
      


</View>
    
   
  );
}

const stylesss = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10
  },
  modalView: {
    margin: 10,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
height: 400,
    alignItems: "flex-start",
    shadowColor: "#000",
  width: 300,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 10,
    padding: 5,
    elevation: 2
  },
  textStyle: {
    color: "#b6a6fc",
    fontWeight: "bold",
    textAlign: "left"
  },
  modalText: {
    marginBottom: 10,
    textAlign: "center"
  }
});

