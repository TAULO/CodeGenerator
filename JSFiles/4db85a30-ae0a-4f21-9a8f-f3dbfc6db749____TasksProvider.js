import React, { useContext, useState, useEffect, useRef } from "react";
import {Alert} from 'react-native';
import Realm from "realm";
import { Task, Good, Checkin,Carts, Orders,Checkout, Booking_Reservation, Logs,Room_checklist } from "../schemas";
import { useAuth } from "./AuthProvider";
import moment from "moment";
import Toast from "react-native-simple-toast";
import addNotif from '../views/push/addNotif';


const TasksContext = React.createContext(null);

const TasksProvider = ({ children, projectPartition, expiration }) => {
  const [tasks, setTasks] = useState([]);
  const { user, userData } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [Goods, setGoods] = useState([]);
  const [Cart, setCart] = useState([]);
  const [checkin, setCheckin] = useState([]);
  const [Order, setOrders] = useState([]);
  const [Booking, setBooking] = useState([]);
  const [category, setCategory] = useState([]);

  const realmRef = useRef(null);
console.log('userData au: ', userData.name)
  useEffect(() => {

  
    const config = {
      sync: {
        user: user,
        partitionValue: projectPartition,
      },
    };
    // open a realm for this particular project

    Realm.open(config).then((projectRealm) => {
      realmRef.current = projectRealm;
      projectRealm.write(() => {

        projectRealm.create(
          "logs",
          new Logs({
            staff: userData.name,
            description:  'User Login',
           date: moment().unix(),
            partition: projectPartition,
          })
        );
      })



      const syncTasks = projectRealm.objects("Task");
      let sortedTasks = syncTasks.sorted("name");
      
      setTasks([...sortedTasks]);
      sortedTasks.addListener(() => {
        setTasks([...sortedTasks]);
      });

      const syncBooking = projectRealm.objects("Booking_Reservation");
      let sortedBooking = syncBooking.sorted("updatedAt");
     
      setBooking([...sortedBooking]);
      sortedBooking.addListener(() => {
        setBooking([...sortedBooking]);
      });


      const syncRoom = projectRealm.objects("Rooms");
      let sortedRoom = syncRoom.sorted("name");
      setRooms([...sortedRoom]);
      sortedRoom.addListener(() => {
        setRooms([...sortedRoom]);
      });


      const syncCheckin = projectRealm.objects("Checkin").filtered('status == "Available"');
      let sortedCheckin= syncCheckin.sorted("check_out");
      setCheckin([...sortedCheckin]);
      sortedCheckin.addListener(() => {
        setCheckin([...sortedCheckin]);
      });

      const syncGoods = projectRealm.objects("Goods").filtered('status == "Available"');
      let sortedGoods = syncGoods.sorted("name");
   
      setGoods([...sortedGoods]);
      sortedGoods.addListener(() => {
        setGoods([...sortedGoods]);
      });

      const syncCart = projectRealm.objects("Carts").filtered('status == "Available"');
      let sortedCart= syncCart.sorted("item");
      setCart([...sortedCart]);
      sortedCart.addListener(() => {
        setCart([...sortedCart]);
      });


      const syncCategory= projectRealm.objects("Category").filtered('status!="Deleted"');
      let sortedCategory = syncCategory.sorted("name");
      setCategory([...sortedCategory]);
      sortedRoom.addListener(() => {
        setCategory([...sortedCategory]);
      });







let dates = moment().add(-30, 'days').unix()
      const syncOrders = projectRealm.objects("Orders").filtered('updated_at >= '+ dates);
      let sortedOrders= syncOrders.sorted("updated_at");
  
      setOrders([...sortedOrders]);
      sortedOrders.addListener(() => {
        setOrders([...sortedOrders]);
      });



      
    });

    return () => {
      // cleanup function
      const projectRealm = realmRef.current;
      if (projectRealm) {
        projectRealm.close();
        realmRef.current = null;
        setTasks([]);
        setRooms([]);
        setGoods([]);
        setCart([]);
        setCheckin([]);
        setOrders([]);
        setBooking([]);
        setCategory([]);
      }
    };
  }, [user, projectPartition]);


  const notif = () =>{
    return () => (
    <addNotif out={moment(check_out).unix()} room={RoomName} temp_id={projectPartition.slice(-6)+'-'+Math.floor(Math.random() * 999999)}/>
    )
  }
  const Statusroom = (filterObj)=>{
    filterObj.map((task_inf) =>(

  task_inf.status = "Occupied"
    )
  )
  }
  const createCheckin = (newRoomType,newRoomPrice,newMaxPerson,id,RoomID,RoomFloor,RoomName,check_in,check_out,Company,Customer,Address,Contact,Nationality,Email,NoPerson,ExtraPerson,PersonWDiscount,Discount,DiscountID,Note, newExtraPerson, control_num,roomTypeInfo, RoomTypeIds, RoomIDTemp,res_code_info,checkin_stat_info,voucher_code,
    voucher_exp,
    voucher_mode,
    voucher_value,) => {
    notif()
    const projectRealm = realmRef.current;

    projectRealm.write(() => {

      var filterObj = rooms.filter(function(e) {
        return e.name == RoomName;
    })

    Statusroom(filterObj)
    const temp = projectPartition.slice(-6)+'-'+Math.floor(Math.random() * 999999)
      // Create a new task in the same partition -- that is, in the same project.
      projectRealm.create(
        "Checkin",
        new Checkin({
          control_num:control_num,
          check_in:moment(check_in).unix(),
          check_out:moment(check_out).unix(),
          first_checkout:moment(check_out).unix().toString(),
          temp_id: temp,
          address: Address,
      chatroom:null,
      check_out_w_ext: moment(check_out).unix().toString(),
      company: Company,
      contact: Contact,
      customer: Customer,
      discount: Discount,
      discount_code: DiscountID,
      discount_value: "",
      email: Email,
      extra_amount:roomTypeInfo.extra_person_charge,
      extra_person: ExtraPerson,
      extension: "",
      extension_amount: roomTypeInfo.extension,
      extension_mode: "",
      extension_person: "",
      extension_price:"",
      extension_rate:"",
      extension_value:"",
      floor:RoomFloor,
      hour_duration:"",
      hour_key:"",
      hour_price:"",
      hour_rate:"",
      max: newMaxPerson,
      nationality: Nationality,
      no_person: parseFloat(NoPerson),
      no_person_discount: PersonWDiscount,
      note: Note,
      number_of_days: "",
      number_of_hours:"",
      price: newRoomPrice,
      payment_method: "",
      penalty: "",
      penalty_description: "",
      penalty_val: null,
      room_no: RoomName,
      room_no_id_temp: RoomIDTemp,
      room_no_id: RoomID.toString(),
      room_type: newRoomType,
      room_type_id: roomTypeInfo.temp_id.toString(),
      updated_at:moment().unix().toString(),
      total_addtional:0,
      payment: 0,
      tax: "",
      partition: projectPartition,
      res_code: res_code_info,
      checkin_stat: checkin_stat_info,
      Change_room: RoomIDTemp,
      refund: "",
      RefReason: "",
      voucher_code,
voucher_exp,
voucher_mode,
voucher_value:voucher_value.toString(),
        })
      );





      projectRealm.create(
        "logs",
        new Logs({
          staff: userData.name,
          description:  'Checkin Room '+ RoomName + ' I.D of ' + temp,
         date: moment().unix(),
          partition: projectPartition,
        })
      );


    });
    Alert.alert('Successfully Checked-In!')
  };



  const HourCheckin = (newRoomType,newRoomPrice,newMaxPerson,id,RoomID,RoomFloor,RoomName,check_in,check_out,Company,Customer,Address,Contact,Nationality,Email,NoPerson,ExtraPerson,PersonWDiscount,Discount,DiscountID,Note, newExtraPerson, control_num,roomTypeInfo, RoomTypeIds, RoomIDTemp,res_code_info,checkin_stat_info,voucher_code,
    voucher_exp,
    voucher_mode,
    voucher_value,) => {
    const projectRealm = realmRef.current;
    <addNotif out={moment(check_out).unix()} room={RoomName} temp_id={projectPartition.slice(-6)+'-'+Math.floor(Math.random() * 999999)}/>
    projectRealm.write(() => {
    

      var filterObj = rooms.filter(function(e) {
        return e.name == RoomName;
    })

   Statusroom(filterObj)

   const temp = projectPartition.slice(-6)+'-'+Math.floor(Math.random() * 999999)
      // Create a new task in the same partition -- that is, in the same project.
      projectRealm.create(
        "Checkin",
        new Checkin({
          control_num:control_num,
          check_in:moment(check_in).unix(),
          check_out:moment(check_out).unix(),
          first_checkout:moment(check_out).unix().toString(),
          temp_id: temp,
          address: Address,
      chatroom: null,
      check_out_w_ext: moment(check_out).unix().toString(),
      company: Company,
      contact: Contact,
      customer: Customer,
      discount: Discount,
      discount_code: DiscountID,
      discount_value: "",
      email: Email,
      extra_amount:roomTypeInfo.extra_person_charge,
      extra_person: ExtraPerson,
      extension: "",
      extension_amount: roomTypeInfo.extension,
      extension_mode: "",
      extension_person: "",
      extension_price:"",
      extension_rate:"",
      extension_value:"",
      floor:RoomFloor,
      hour_duration:roomTypeInfo.hour_duration,
      hour_key:"1",
      hour_price:newRoomPrice,
      hour_rate:newRoomPrice,
      max: newMaxPerson,
      nationality: Nationality,
      no_person: parseFloat(NoPerson),
      no_person_discount: PersonWDiscount,
      note: Note,
      price: newRoomPrice,
      payment_method: "",
      penalty: "",
      penalty_description: "",
      penalty_val:null,
      room_no: RoomName,
      room_no_id_temp: RoomIDTemp,
      room_no_id: RoomID.toString(),
      room_type: newRoomType,
      room_type_id: roomTypeInfo.temp_id.toString(),
      updated_at:moment().unix().toString(),
      total_addtional:0,
      payment: 0,
      tax: "",
      partition: projectPartition,
      res_code: res_code_info,
      checkin_stat: checkin_stat_info,
      Change_room: RoomIDTemp,
      refund: "",
      RefReason: "",
      voucher_code,
voucher_exp,
voucher_mode,
voucher_value:voucher_value.toString(),
        })
      );

      projectRealm.create(
        "logs",
        new Logs({
          staff: userData.name,
          description:  'Checkin Room '+ RoomName + ' I.D of ' + temp,
         date: moment().unix(),
          partition: projectPartition,
        })
      );

    });
    Alert.alert('Successfully Checked-In!')
  };





  const PromoCheckin = (newRoomType,newRoomPrice,newMaxPerson,id,RoomID,RoomFloor,RoomName,check_in,check_out,Company,Customer,Address,Contact,Nationality,Email,NoPerson,ExtraPerson,PersonWDiscount,Discount,DiscountID,Note, newExtraPerson, control_num,roomTypeInfo, RoomTypeIds, RoomIDTemp,res_code_info,checkin_stat_info,voucher_code,
    voucher_exp,
    voucher_mode,
    voucher_value,) => {
    const projectRealm = realmRef.current;

    <addNotif out={moment(check_out).unix()} room={RoomName} temp_id={projectPartition.slice(-6)+'-'+Math.floor(Math.random() * 999999)}/>
    console.log('voucher_value: ',voucher_value)
    projectRealm.write(() => {
     
      var filterObj = rooms.filter(function(e) {
        return e.name == RoomName;
    })

    Statusroom(filterObj)
    const temp = projectPartition.slice(-6)+'-'+Math.floor(Math.random() * 999999)
      projectRealm.create(
        "Checkin",
        new Checkin({
          control_num:control_num,
          check_in:moment(check_in).unix(),
          check_out:moment(check_out).unix(),
          first_checkout:moment(check_out).unix().toString(),
          temp_id: temp,
          address: Address,
      chatroom: null,
      check_out_w_ext: moment(check_out).unix().toString(),
      company: Company,
      contact: Contact,
      customer: Customer,
      discount: Discount,
      discount_code: DiscountID,
      discount_value: "",
      email: Email,
      extra_amount:roomTypeInfo.extra_person_charge,
      extra_person: ExtraPerson,
      extension: "",
      extension_amount: roomTypeInfo.extension,
      extension_mode: "",
      extension_person: "",
      extension_price:"",
      extension_rate:"",
      extension_value:"",
      floor:RoomFloor,
      hour_duration:roomTypeInfo.promo_duration,
      hour_key:roomTypeInfo.duration_mode,
      hour_price:newRoomPrice,
      hour_rate:newRoomPrice,
      max: newMaxPerson,
      nationality: Nationality,
      no_person: parseFloat(NoPerson),
      no_person_discount: PersonWDiscount,
      note: Note,
      number_of_days: "",
      number_of_hours:"",
      price: newRoomPrice,
      payment_method: "",
      penalty: "",
      penalty_description: "",
      penalty_val: null,
      room_no: RoomName,
      room_no_id_temp: RoomIDTemp,
      room_no_id: RoomID.toString(),
      room_type: newRoomType,
      room_type_id: roomTypeInfo.temp_id.toString(),
      updated_at:moment().unix().toString(),
      total_addtional:0,
      payment: 0,
      tax: "",
      partition: projectPartition,
      res_code: res_code_info,
      checkin_stat: checkin_stat_info,
      Change_room: RoomIDTemp,
      refund: "",
      RefReason: "",
      voucher_code,
voucher_exp,
voucher_mode,
voucher_value:voucher_value=== undefined? "":voucher_value.toString(),
        })
      );
      projectRealm.create(
        "logs",
        new Logs({
          staff: userData.name,
          description:  'Checkin Room '+ RoomName + ' I.D of ' + temp,
         date: moment().unix(),
          partition: projectPartition,
        })
      );
    });
    Alert.alert('Successfully Checked-In!')
  };

 

const editpenalty = (penalty_amount, penalty_description, checkinInfo) => {
  const projectRealm = realmRef.current;

  projectRealm.write(() => {
    checkinInfo.penalty = penalty_amount;
    checkinInfo.penalty_description = penalty_description;



    projectRealm.create(
      "logs",
      new Logs({
        staff: userData.name,
        description:  'Edit Penalty Amounting'+ penalty_amount + ' Description ' + penalty_description+ ' Room No '+ checkinInfo.room_no
+  'I.D of '+ checkinInfo.temp_id,
       date: moment().unix(),
        partition: projectPartition,
      })
    );

  });
};


const editCheckin = (check_in,check_out,Company,Customer,Address,Contact,Nationality,Email,NoPerson,ExtraPerson,PersonWDiscount,Discount,DiscountID,Note, checkinInfo) => {

  const projectRealm = realmRef.current;

  projectRealm.write(() => {
    checkinInfo.address = Address,
    checkinInfo.company = Company,
    checkinInfo.contact = Contact,
    checkinInfo.customer = Customer,
    checkinInfo.discount =  Discount,
    checkinInfo.discount_code = DiscountID,
    checkinInfo.email= Email,
    checkinInfo.extra_person= ExtraPerson,
    checkinInfo.nationality= Nationality,
    checkinInfo.no_person= parseFloat(NoPerson),
    checkinInfo.no_person_discount= PersonWDiscount,
    checkinInfo.note= Note,

    projectRealm.create(
      "logs",
      new Logs({
        staff: userData.name,
        description:  'Edit Guest Info Room No '+ checkinInfo.room_no +  ' I.D of '+ checkinInfo.temp_id,
       date: moment().unix(),
        partition: projectPartition,
      })
    );
  });

  

  Alert.alert('Edited Successfully!')
};
const editChatroom = (item) => {


  const projectRealm = realmRef.current;

  projectRealm.write(() => {
    item.penalty_val = 'Active'
    projectRealm.create(
      "logs",
      new Logs({
        staff: userData.name,
        description:  'Add Chat Room. Room No '+ item.room_no +  ' I.D of '+ item.temp_id,
       date: moment().unix(),
        partition: projectPartition,
      })
    );
  });
 
};
const editCheckout = (date, checkinInfo) => {
  const projectRealm = realmRef.current;

const new_check= moment(date).unix()

  projectRealm.write(() => {
    checkinInfo.check_out = moment(date).unix();
    checkinInfo.check_out_w_ext = moment(date).unix().toString();
    projectRealm.create(
      "logs",
      new Logs({
        staff: userData.name,
        description:  'Edit Check-out Room No '+ checkinInfo.room_no +  ' I.D of '+ checkinInfo.temp_id + ' From ' + moment(checkinInfo.check_out * 1000).format('MMM D, YYYY h:mm a') + ' to ' + moment(new_check * 1000).format('MMM D, YYYY h:mm a'), 
       date: moment().unix(),
        partition: projectPartition,
      })
    );
  });
 
};
const editCheck_in = (date, checkinInfo) => {

  const projectRealm = realmRef.current;
  const new_check= moment(date).unix()
  projectRealm.write(() => {
    checkinInfo.check_in = moment(date).unix();
    projectRealm.create(
      "logs",
      new Logs({
        staff: userData.name,
        description:  'Edit Check-in Room No '+ checkinInfo.room_no +  ' I.D of '+ checkinInfo.temp_id + ' From ' + moment(checkinInfo.check_in * 1000).format('MMM D, YYYY h:mm a') + ' to ' + moment(new_check * 1000).format('MMM D, YYYY h:mm a'), 
       date: moment().unix(),
        partition: projectPartition,
      })
    );
  });
  
};

const editCheckinExtension = (ExtAmount,ExtDate, checkinInfo) => {

  const new_check= moment(ExtDate).unix()
  const projectRealm = realmRef.current;
  projectRealm.write(() => {
    checkinInfo.extension = new_check.toString();
    checkinInfo.extension_rate = ExtAmount;
    checkinInfo.check_out_w_ext = checkinInfo.check_out.toString();
    projectRealm.create(
      "logs",
      new Logs({
        staff: userData.name,
        description:  'Edit Check-in Extenstion Room No '+ checkinInfo.room_no +  ' I.D of '+ checkinInfo.temp_id + ' From ' + moment(checkinInfo.extension * 1000).format('MMM D, YYYY h:mm a') + ' to ' + moment(new_check * 1000).format('MMM D, YYYY h:mm a')+ ' Amounting ' + ExtAmount , 
       date: moment().unix(),
        partition: projectPartition,
      })
    );
  });

  


  Alert.alert('Edited Successfully!')
};


const HoureditCheck_in = (date,returned_endate, checkinInfo) => {

  const projectRealm = realmRef.current;

  const new_check= moment(date).unix()
  projectRealm.write(() => {
    checkinInfo.check_in = moment(date).unix();
    checkinInfo.check_out = moment(returned_endate).unix();
    projectRealm.create(
      "logs",
      new Logs({
        staff: userData.name,
        description:  'Edit Check-in Room No '+ checkinInfo.room_no +  ' I.D of '+ checkinInfo.temp_id + ' From ' + moment(checkinInfo.check_in * 1000).format('MMM D, YYYY h:mm a') + ' to ' + moment(new_check * 1000).format('MMM D, YYYY h:mm a'), 
       date: moment().unix(),
        partition: projectPartition,
      })
    );
  });

  

};


const balance = (payment, payment_method, checkinInfo) => {

  const projectRealm = realmRef.current;
  projectRealm.write(() => {
    checkinInfo.payment = parseFloat(checkinInfo.payment)+parseFloat(payment);
    checkinInfo.payment_method = payment_method;


    projectRealm.create(
      "logs",
      new Logs({
        staff: userData.name,
        description:  'Payed Balance. Room No '+ checkinInfo.room_no +  ' I.D of '+ checkinInfo.temp_id + ' Amounting '+ parseFloat(payment) +' with total of '+parseFloat(payment),
       date: moment().unix(),
        partition: projectPartition,
      })
    );

  });
  Toast.show('Saved!')
};
const roomdata_rooms = (filterObj_rooms)=>{
  filterObj_rooms.map((task_inf_rooms) =>(

task_inf_rooms.status = "Cleaning"
  )
)
}

const roomdata_rooms_occ = (filterObj_rooms)=>{
  filterObj_rooms.map((task_inf_rooms) =>(

task_inf_rooms.status = "Occupied"
  )
)
}


const checkout = (stay_total,discount,extension_calcu,extra,DaysValue,checkinInfo,voucher,) => {
  Toast.show('Please wait a moment!')
console.log('stay_total: ', stay_total)
console.log('discount: ', discount)
console.log('extension_calcu: ', extension_calcu)
console.log('extra: ', extra)
console.log('DaysValue: ', DaysValue)
console.log('checkinInfo: ', checkinInfo)
console.log('voucher: ', voucher)
  const projectRealm = realmRef.current;

projectRealm.write(() => {
  var filterObj_rooms = rooms.filter(function(e) {
    return e.room_id == checkinInfo.room_no_id_temp;
  })
  roomdata_rooms(filterObj_rooms)
    projectRealm.create(
      "Checkout",
      new Checkout({
        first_checkout:checkinInfo.first_checkout,
        discount_less: discount.toString(),//
        extension_total_amount: extension_calcu.toString(),//
        overall_total: parseFloat(checkinInfo.total_addtional)+parseFloat(extension_calcu)+parseFloat(checkinInfo.penalty== '' ||  checkinInfo.penalty == null||  checkinInfo.penalty == undefined? 0: checkinInfo.penalty)+parseFloat(extra)+parseFloat(stay_total)-parseFloat(discount),//
        stay_total: stay_total.toString(),//
        subtotal: parseFloat(checkinInfo.total_addtional)+parseFloat(stay_total)+parseFloat(extension_calcu)+parseFloat(extra)+parseFloat(checkinInfo.penalty== '' ||  checkinInfo.penalty == null||  checkinInfo.penalty == undefined? 0: checkinInfo.penalty).toString(),//
        tax_val: "0",//q
        temp_id: checkinInfo.temp_id,
        control_num:checkinInfo.control_num,
        check_in_date:checkinInfo._id.toString(),
        check_in: parseFloat(checkinInfo.check_in),
        check_out:checkinInfo.extension===""?parseFloat(checkinInfo.check_out):parseFloat(checkinInfo.check_out) > parseFloat(checkinInfo.extension)? parseFloat(checkinInfo.check_out):parseFloat(checkinInfo.extension) ,
        address: checkinInfo.address,
    check_out_w_ext: checkinInfo.check_out_w_ext,
    company: checkinInfo.company,
    contact: checkinInfo.contact,
    customer: checkinInfo.customer,
    discount: checkinInfo.discount,
    discount_code: checkinInfo.discount_code,
    discount_value: checkinInfo.discount_value,
    email: checkinInfo.email,
    extra_amount:checkinInfo.extra_amount,
    extra_person: checkinInfo.extra_person,
    extension: checkinInfo.extension === ""? 0:parseFloat(checkinInfo.extension),
    extension_amount: checkinInfo.extension_amount,
    extension_mode: checkinInfo.extension_mode,
    extension_person: checkinInfo.extension_person,
    extension_price:checkinInfo.extension_price,
    extension_rate:checkinInfo.extension_rate,
    extension_value:checkinInfo.extension_value,
    floor:checkinInfo.floor,
    hour_duration:checkinInfo.hour_duration,
    hour_key:checkinInfo.hour_key,
    hour_price:checkinInfo.hour_price,
    hour_rate:checkinInfo.hour_rate,
    nationality: checkinInfo.nationality,
    no_person: checkinInfo.no_person.toString(),
    no_person_discount: checkinInfo.no_person_discount,
    note: checkinInfo.note,
    number_of_days: DaysValue.toString(),
    number_of_hours:checkinInfo.hour_duration,
    price: checkinInfo.price,
    payment_method: checkinInfo.payment_method,
    penalty: checkinInfo.penalty,
    penalty_description:checkinInfo.penalty_description,
    penalty_val:checkinInfo.penalty_val,
    room_no: checkinInfo.room_no,
    room_type: checkinInfo.room_type,
    updated_at:moment().unix().toString(),
    total_addtional:checkinInfo.total_addtional,
    payment:checkinInfo.payment,
    tax:checkinInfo.tax,
    partition: projectPartition,

    res_code: checkinInfo.res_code,
    checkin_stat: checkinInfo.checkin_stat,
    Change_room: checkinInfo.Change_room,
    room_no_id: checkinInfo.room_no_id_temp,
    voucher_code: checkinInfo.voucher_code,
voucher_exp: checkinInfo.voucher_exp,
voucher_mode: checkinInfo.RefReason,
voucher_value:voucher.toString(),
room_change: checkinInfo.room_no_id_temp === checkinInfo.Change_room? '': 'Changed'
      })

      
    );
 
  });
  projectRealm.write(() => {
    checkinInfo.status = "Checkout";
    setCheckin([...projectRealm.objects("Checkin").sorted("check_out")]);
    projectRealm.create(
      "logs",
      new Logs({
        staff: userData.name,
        description:  'Check-out. Room No '+ checkinInfo.room_no +  ' I.D of '+ checkinInfo.temp_id ,
       date: moment().unix(),
        partition: projectPartition,
      })
    )
  });
  Alert.alert('Successfully Checked-out!')
};


const createCart = (goods_info) => {
  const projectRealm = realmRef.current;
  if(goods_info.quantity === 0){
    return;
  }
  projectRealm.write(() => {
    const products = projectRealm.objects("Carts");
    const filteredProducts = products.filtered("itemid == $0", goods_info.itemid);

    if(filteredProducts.length == 0){
      projectRealm.create(
        "Carts",
        new Carts({
          item: goods_info.name,
          itemid: goods_info.itemid,
          staff: 0,
          price: parseFloat(goods_info.price),
          quantity: 1,
          customer: null,
          customer_id: null,
         room:  null,
          updated_at: moment().unix(),
          partition: projectPartition,
        }),
        "modified"
      );
      goods_info.quantity -=1;
    }else{
      goods_info.quantity -=1;
      filteredProducts[0].quantity += 1;
    }


     
  });
  
};


const saveOrders = (customer_id, customer_room, customer_name, Payments, AmountPaid) => {
  const projectRealm = realmRef.current;
console.log(customer_id, customer_room, customer_name, Payments, AmountPaid)
  projectRealm.write(() => {
    for (let value of Object.values(Cart)) {
      projectRealm.create(
        "Orders",
        new Orders({
          item: value.item,
          itemid: value.itemid,
          staff: 0,
          price: parseFloat(value.price),
          quantity: value.quantity,
          customer: customer_name,
          customer_id: customer_id,
         room:  customer_room,
          updated_at: moment().unix(),
          partition: projectPartition,
          method: AmountPaid,
          pay: AmountPaid == ""? 0: parseFloat(Payments)
        })
      );
      projectRealm.delete(value);
      setCart([...projectRealm.objects("Carts").sorted("item")]);
    }
 
   // editcarts(Cart, customer_id, customer_room, customer_name)


   projectRealm.create(
    "logs",
    new Logs({
      staff: userData.name,
      description:  'Add Goods. Room No '+ customer_room +  ' Guest '+ customer_name+ ' Amounting ' +  parseFloat(Payments) ,
     date: moment().unix(),
      partition: projectPartition,
    })
  )
  });
};

const DeleteCarts= () => {
  const projectRealm = realmRef.current;
 
  projectRealm.write(() => {
    const del = projectRealm.objects("Carts");
    for (let value of Object.values(del)) {
      const products = projectRealm.objects("Orders");
    const filteredProducts = products.filtered("itemid == $0", value.itemid);
    filteredProducts[0].quantity += value.quantity;
    }
    projectRealm.delete(del);

    }

    
  
  );

};

const editcarts = (Carts_val, customer_id, customer_room, customer_name)=>{

  for (let value of Object.values(Carts_val)) {

    value.customer = customer_name;
    value.customer_id = customer_id.toString();
    value.room = customer_room;
    value.updated_at = moment().unix();
    value.status = "Checkout";
  }
}

const del =(Cart_in)=> {
  const projectRealm = realmRef.current;
  
    projectRealm.delete(Cart_in);
    setCart([...projectRealm.objects("Carts").sorted("item")]);
   

}

const BacktoGoods =(Cart_in)=> {
          var filterObj = Goods.filter(function(e) {
            return e.itemid == Cart_in.itemid;
        })
  
      const projectRealm = realmRef.current;
      projectRealm.write(() => {
        
      filterObj.map((good_inf) =>
      good_inf.quantity +=Cart_in.quantity
      )
      projectRealm.delete(Cart_in);
      setCart([...projectRealm.objects("Carts").sorted("item")]);
      });
 }
 const BacktoGoodsone =(Cart_in)=> {
  var filterObj = Goods.filter(function(e) {
    return e.itemid == Cart_in.itemid;
})

const projectRealm = realmRef.current;
projectRealm.write(() => {

filterObj.map((good_inf) =>
good_inf.quantity +=1
)
Cart_in.quantity -=1
});
}




 const cleaned =(item)=> {

  const projectRealm = realmRef.current;
  projectRealm.write(() => {

    item.status = 'Available';

    projectRealm.create(
      "logs",
      new Logs({
        staff: userData.name,
        description:  'Set Room to Available. Room No '+ item.name ,
       date: moment().unix(),
        partition: projectPartition,
      })
    )
  });
  Alert.alert('Success!')
}

const maintain =(item)=> {

  const projectRealm = realmRef.current;
  projectRealm.write(() => {
    item.status = 'Under Maintenance';
    projectRealm.create(
      "logs",
      new Logs({
        staff: userData.name,
        description:  'Set Room to Under Maintenance. Room No '+ item.name ,
       date: moment().unix(),
        partition: projectPartition,
      })
    )
  });
  Alert.alert('Success!')
}



const CancelRes= (info, res) => {
  const projectRealm = realmRef.current;

  projectRealm.write(() => {
    info.status = 'Cancelled';
    info.reason = res;

    projectRealm.create(
      "logs",
      new Logs({
        staff: userData.name,
        description:  'Cancelled Reservation. Res. Code '+ info.reservation_code + ' Reason: '+res,
       date: moment().unix(),
        partition: projectPartition,
      })
    )
  });
};



const ConfirmRes= (info) => {
  const projectRealm = realmRef.current;

  projectRealm.write(() => {
    info.status = 'Confirmed';
    projectRealm.create(
      "logs",
      new Logs({
        staff: userData.name,
        description:  'Confirmed Reservation. Res. Code '+ info.reservation_code ,
       date: moment().unix(),
        partition: projectPartition,
      })
    )
  });

};
const Checked = (info) => {
  const projectRealm = realmRef.current;

  projectRealm.write(() => {
    info.status = 'Checked-in';
  });
};
const changeRoom = (extra_amount, extension_amount, floor, hour_duration, hour_key, hour_price, hour_rate, max, price, room_no, room_no_id, room_no_id_temp, room_type, room_type_id, checkinInfo, time_checkin) => {
  const projectRealm = realmRef.current;
  projectRealm.write(() => {

    var filterObj_rooms = rooms.filter(function(e) {
      return e.room_id == checkinInfo.room_no_id_temp;
    })
    roomdata_rooms(filterObj_rooms)

     checkinInfo.extra_amount = extra_amount;
    checkinInfo.extension_amount = extension_amount;
    checkinInfo.floor = floor;
    checkinInfo.hour_duration = hour_duration;
    checkinInfo.hour_key = hour_key;
    checkinInfo.hour_price = hour_price;
    checkinInfo.hour_rate = hour_rate;
    checkinInfo.max = max;
    checkinInfo.price = price;
    checkinInfo.room_no = room_no;
    checkinInfo.room_no_id = room_no_id.toString();
    checkinInfo.room_no_id_temp = room_no_id_temp;
    checkinInfo.room_type = room_type;
    checkinInfo.room_type_id = room_type_id.toString();


    var filterObj_rooms_occ = rooms.filter(function(e) {
      return e.room_id == room_no_id_temp;
    })
    roomdata_rooms_occ(filterObj_rooms_occ)
    if(hour_key == "1"){


      var returned_endate = moment(time_checkin).add(parseInt(hour_duration), 'hours');

    checkinInfo.check_in =  moment(time_checkin).unix();
      checkinInfo.check_out =  moment(returned_endate).unix();
    }
    if(hour_key == "Daily"){
 
    
      var returned_endate = moment(time_checkin).add(parseInt(hour_duration), 'days');
      
          checkinInfo.check_in =  moment(time_checkin).unix();
            checkinInfo.check_out =  moment(returned_endate).unix();
    }
    if(hour_key == "Hour"){
    
      var returned_endate = moment(time_checkin).add(parseInt(hour_duration), 'hours');
      

          checkinInfo.check_in =  moment(time_checkin).unix();
            checkinInfo.check_out =  moment(returned_endate).unix();
    }
    if(hour_key == ""){
    
    
    }
    projectRealm.create(
      "logs",
      new Logs({
        staff: userData.name,
        description:  'Change Room. from '+ checkinInfo.room_no + ' to ' + room_no,
       date: moment().unix(),
        partition: projectPartition,
      })
    )
  });
  Alert.alert('Success!')
}




const GoRefund = (info, ref, RefReason) => {
  const projectRealm = realmRef.current;

  projectRealm.write(() => {
    info.status = 'Refunded';
    info.refund = ref;
    info.RefReason= RefReason;

    projectRealm.create(
      "logs",
      new Logs({
        staff: userData.name,
        description:  'Refund Room. I.D '+ info.temp_id + ' Amounting  ' + ref + RefReason,
       date: moment().unix(),
        partition: projectPartition,
      })
    )

  });

};

const Room_checklist_add = (roomInfo, newRoomNumber,selectedItems) => {
  const projectRealm = realmRef.current;


  projectRealm.write(() => {
    roomInfo.status = 'Available';
    roomInfo.note = newRoomNumber;
    projectRealm.create(
      "room_checklist",
      new Room_checklist({
        staff: userData.name,
        room_id: roomInfo.room_id,
        note: newRoomNumber,
        status: "Available",
        checkListPros:selectedItems,
        checkList: roomInfo.checkList,  
        date: moment().unix(),
        partition: projectPartition,
      })
    );

    projectRealm.create(
      "logs",
      new Logs({
        staff: userData.name,
        description:  'Cleaned Room No '+ roomInfo.name, 
       date: moment().unix(),
        partition: projectPartition,
      })
    );
  });

};
const Room_checklist_maintain = (roomInfo, newRoomNumber,selectedItems) => {
  const projectRealm = realmRef.current;


  projectRealm.write(() => {
    roomInfo.status = 'Under Maintenance';
    roomInfo.note = newRoomNumber;
    projectRealm.create(
      "room_checklist",
      new Room_checklist({
        staff: userData.name,
        room_id: roomInfo.room_id,
        note: newRoomNumber,
        status: "Available",
        checkListPros:selectedItems,
        checkList: roomInfo.checkList,  
        date: moment().unix(),
        partition: projectPartition,
      })
    );

    projectRealm.create(
      "logs",
      new Logs({
        staff: userData.name,
        description:  'Under Maintenance Room No '+ roomInfo.name, 
       date: moment().unix(),
        partition: projectPartition,
      })
    );
  });

};

  return (
    <TasksContext.Provider
      value={{
        checkout,
        createCheckin,
        createCart,
        editpenalty,
        editCheckin,
        editCheckout,
        editCheck_in,
        HourCheckin,
        HoureditCheck_in,
        PromoCheckin,
        saveOrders,
        balance,
          BacktoGoods,
          editCheckinExtension,
          cleaned,
          maintain,
          editChatroom,
          CancelRes,
          ConfirmRes,
          Checked,
          changeRoom,
          GoRefund,
          DeleteCarts,
          BacktoGoodsone,
          Room_checklist_add,
          Room_checklist_maintain,
          Goods,
        tasks,
        rooms,
        Order,
        Cart,
        checkin,
        expiration,
        Booking,
        category,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};

// The useTasks hook can be used by any descendant of the TasksProvider. It
// provides the tasks of the TasksProvider's project and various functions to
// create, update, and delete the tasks in that project.
const useTasks = () => {
  const task = useContext(TasksContext);
  if (task == null) {
    throw new Error("useTasks() called outside of a TasksProvider?"); // an alert is not placed because this is an error for the developer not the user
  }
  return task;
};

export { TasksProvider, useTasks };
