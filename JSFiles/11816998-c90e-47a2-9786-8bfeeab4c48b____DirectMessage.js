import {
  Visibility,
  Replay,
  Send,
  AddCircle,
  Cancel,
  Headset,
  Videocam,
  Image,
  Description,
  Attachment,
} from '@material-ui/icons';
import {
  Box,
  Button,
  Checkbox,
  DialogContent,
  FormControlLabel,
  Grid,
  MenuItem,
  Paper,
  Switch,
  TextField,
  Typography,
  Radio,
  RadioGroup,
  Divider,
  FormControl,
  FormLabel,
  IconButton,
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CancelIcon from '@material-ui/icons/Cancel';
import { Link, useHistory, match, location, useParams } from 'react-router-dom';
import { DatePicker, MuiPickersUtilsProvider, TimePicker } from '@material-ui/pickers';
import React, { useEffect, useMemo, useState } from 'react';
import {
  // createRymindr,
  getBusinessUsers,
  // getCategories,
  getGroups,
  // getSubCategories,
  inviteAndAddMobile,
} from '../../../store/actions/rymidr';
import {
  createMessageCenter,
  updateMessageCenter,
  getCategories,
  getRymindrList,
  searchRymindrList,
  getMessageDetailsById,
} from '../../../store/actions/messageCenterAction';
import { makeStyles, styled } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularSpinner from '../../../component/CircularSpinner/index';
// import ConfirmationDialogRaw from './Modal'
import DialogRaw from './Modal/Rymindrindex';
import MomentUtils from '@date-io/moment';
import PropTypes from 'prop-types';
// import Tabmenu from './Modal/Memberlist'
import { connect } from 'react-redux';
import moment from 'moment';
import { withSnackbar } from 'notistack';
import FileBase64 from 'react-file-base64';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import ckEditorConfig from '../../../helper/ckEditorConfig';

import ConfirmationDialogRaw from '../../Bookings/EventBooking/Modal';
import Tabmenu from '../../Bookings/EventBooking/Modal/Memberlist';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    position: 'relative',
  },
  iconAttach: {
    color: theme.palette.primary.dark,
    background: theme.palette.primary.light,
    height: 32,
    width: 32,
    borderRadius: 60,
    padding: 5,
    float: 'left',
    marginTop: -5,
    marginRight: '10px',
  },
  categoryIon: {
    height: 32,
    margin: -10,
    marginLeft: 0,
    marginRight: 5,
  },
  fileName: {
    maxWidth: 140,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  verticalClass: {
    marginLeft: 10,
    verticalAlign: 'middle',
  },
}));
const TypoHeadStyled = styled(Typography)(({ theme }) => ({
  fontSize: 24,
  color: theme.palette.primary.main,
  textTransform: 'uppercase',
  fontWeight: 'bold',
}));

const TypoHeadInnerStyled = styled(TypoHeadStyled)(({ theme }) => ({
  color: theme.palette.text.primary,
}));

const PaperStyled = styled(Paper)({
  padding: '10px 15px',
});
const SlideBoxStyled = styled(Box)(() => ({
  textAlign: 'center',
  display: 'inline-block',

  padding: '10px 15px',
  borderRadius: 10,
  '& img': {
    display: 'inline-block',
    height: 75,
    width: 75,
  },
}));

const SlideType = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: 16,
}));

const GridStyled = styled(Grid)(({ theme }) => ({
  paddingLeft: '10rem',
  paddingRight: '10rem',
  [theme.breakpoints.down('md')]: {
    paddingLeft: '8rem',
    paddingRight: '8rem',
  },

  [theme.breakpoints.down('sm')]: {
    paddingLeft: '2rem',
  },
}));

const Recurring = ['Daily', 'Weekly', 'Monthly', 'Yearly'];

const FormFields = {
  subject: '',
  message: '',
  message_group: '',
  category: '',
  to_group: '',
  to_member: '',
};

const ButtonColor = styled(Button)(({ theme }) => ({
  background: theme.palette.props.main,
  color: theme.palette.props.contrastText,
}));

const TypoStyled = styled(Typography)(({ theme }) => ({
  fontSize: 16,
  color: theme.palette.text.primary,
  marginTop: 10,
  marginBottom: 20,
  cursor: 'pointer',
  marginRight: 30,
}));

const DirectMessage = (props) => {
  const classes = useStyles();
  const {
    enqueueSnackbar,
    error,
    success_message,
    categories,
    subcategories,
    // getSubCategories,
    getGroups,
    groups,
    businessusers,
    getBusinessUsers,
    userRymindrList,
    getRymindrList,
    // createRymindr,
    createMessageCenter,
    updateMessageCenter,
    inviteAndAddMobile,
    matched_contact,
    messageDetailsById,
    loading,
  } = props;
  const { user_id, business_code, first_name, last_name } = JSON.parse(localStorage.getItem('userData'));
  const [state, setState] = useState({
    checkedB: true,
    switch: false,
  });
  const history = useHistory();
  const date = new Date();
  const [selectedDate, sethandleDateChange] = useState(new Date());
  const [selectedTime, sethandleTimeChange] = useState(date.getTime() + 5 * 60000);
  const [subcategory, setSubCategory] = useState(0);
  const [checked, setChecked] = useState([]);
  const [memberchecked, setMemberchecked] = useState([]);
  const [group_members, setGroup_members] = useState([]);

  const [checkOnSelectAllMembers, setcheckOnSelectAllMembers] = useState(false);
  const [checkOnSelectAllGroup, setcheckOnSelectAllGroup] = useState(false);

  const [groupname_membersname, setGroupname_membersname] = useState([]);
  const [formvalue, setFormvalue] = useState(FormFields);
  const [formValidation, setFormValidation] = useState(FormFields);
  const [open, setOpen] = useState(false);
  const [timeErr, setTimeErr] = useState('');
  const [phoneNumber, setPhoneNumber] = useState([]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([]);
  const [openRymindr, setOpenRymindr] = useState(false);
  const [rymindrCount, setRymindrCount] = useState('');
  const [rymindrLink, setRymindrLink] = useState([]);
  const [rymindrId, setRymindrId] = useState([]);
  const [messageDetailById, setMessageDetailById] = useState(messageDetailsById);
  const [deleteFiles, setDeleteFiles] = useState([])
  const [ Contacts , setContacts] = useState([])


  let { ID, member_id, group_id, get_name } = useParams();

  const handleToopenRymindr = () => {
    setOpenRymindr(true);
  };

  const updateRymindrCount = (c) => {
    // alert(c);
    // setFormvalue({ ...formvalue, ['linkRymindr']: setRymindrCount })
    setRymindrCount(c);
  };

  const updateRymindrLink = (c_id) => {
    setFormvalue({ ...formvalue, linkRymindr: c_id });
    setRymindrLink(c_id);
  };

  const handleCloseRymindr = (newValue) => {
    // alert('main'+newValue);
    setOpenRymindr(newValue);
  };
  console.log('categories-',categories)
  const handleChange = (e) => {
    const formdata = { ...formvalue };
    const formvalidation = { ...formValidation };
    const value = e.target.value;
    const name = e.target.name;

    if (name === 'rymindr_type') {
      const found = subcategories.find((element) => element.id === value);
      formdata.rymindr_type = found.category_name;
      formdata.subcategory_id = value;
      formvalidation.subcategory_id = '';
      setFormValidation(formvalidation);
    } else {
      formdata[name] = value;
    }
    setFormvalue(formdata);
  };

  const handleDateChange = (e) => {
    const date = new Date(e);
    const selecteddate = moment(date).format('YYYY-MM-DD');
    sethandleDateChange(selecteddate);
    setFormvalue({ ...formvalue, rymindr_date: selecteddate });
  };

  const handleTimeChange = (e) => {
    const date = new Date(e);
    const selectedtime = moment(date).format('HH:mm');

    var now = moment(new Date().getTime() + 5 * 60000).format('HH:mm');
    if (now.toString() > selectedtime.toString()) {
      setTimeErr('You can not choose a time before the current time.');
    } else {
      setTimeErr('');
    }
    sethandleTimeChange(new Date(e));
    setFormvalue({ ...formvalue, rymindr_time: selectedtime });
  };

  const handleChangeCheck = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
    setFormvalue({ ...formvalue, [event.target.name]: event.target.checked });
  };

  const handleSwitchChange = (event) => {
    // alert('swicth',event.target.checked);
    setState({ ...state, [event.target.name]: event.target.checked });
    setFormvalue({ ...formvalue, switch: !state.switch });
    if (event.target.checked == true) {
      handleToopenRymindr();
    }
  };

  const handleGroupToggle = (value) => {
    setcheckOnSelectAllGroup(false);
    const groupMembers = value.group_member_list;
    console.log('checked=====', checked);
    const currentIndex = checked.indexOf(value.group_id);
    const newChecked = [...checked];
    const selectedmember = [...group_members];

    if (currentIndex === -1) {
      newChecked.push(value.group_id);
      groupMembers.forEach((element) => {
        selectedmember.push(element.user_id);
      });
    } else {
      newChecked.splice(currentIndex, 1);
      groupMembers.forEach((element) => {
        const remomeitem = selectedmember.indexOf(element.user_id);
        selectedmember.splice(remomeitem, 1);
      });
    }

    console.log('newChecked=====', newChecked);
    setChecked(newChecked);
    setGroup_members(selectedmember);
    setFormvalue({ ...formvalue, message_group: selectedmember });
  };

  const handleMemberToggle = (value) => {
    const currentIndex = memberchecked.indexOf(value.user_id);
    const newChecked = [...memberchecked];
    if (currentIndex === -1) {
      newChecked.push(value.user_id);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    // alert('newChecked'+newChecked);
    setMemberchecked(newChecked);
    setFormvalue({ ...formvalue, message_group: newChecked });

    // SELECT ALL
    const groupname = [];
    const membername = [];
    if (value == 0) {
      businessusers.forEach((element) => {
        membername.push(`${element.first_name} ${element.last_name}`);

        newChecked.push(element.user_id);
      });
      setcheckOnSelectAllMembers(true);
      setMemberchecked(newChecked);
    } else if (value == 1) {
      groups.forEach((element) => {
        groupname.push(element.group_name);
        newChecked.push(element.group_id);
      });
      setcheckOnSelectAllGroup(true);
      setChecked(newChecked);
    } else if (value == 3) {
      setcheckOnSelectAllMembers(false);
      setMemberchecked([]);
    } else if (value == 4) {
      setcheckOnSelectAllGroup(false);
      setChecked([]);
    } else {
      setcheckOnSelectAllMembers(false);
    }
    //SELECT ALL
  };

  const handleAllMembersToggle = (value) => {
    const newChecked = [...value];
    const formvalidation = { ...formValidation };

    setFormvalue({
      ...formvalue,
      message_group: newChecked,
      // to_member: '@'
    });
    formvalidation.to_member = '';
    setFormValidation(formvalidation);

    setMemberchecked(newChecked);
  };

  const handleAllGroupMembersToggle = (value) => {
    const newChecked = [...value];
    const selectedmember = [...newChecked];
    const formvalidation = { ...formValidation };
    formvalidation.eventForm_to = '';
    setFormValidation(formvalidation);
    setFormvalue({
      ...formvalue,
      message_group: selectedmember,
      // eventForm_to: '@'
    });
    setChecked(newChecked);
    setGroup_members(selectedmember);
  }

  let currentPathname = history.location.pathname;
  currentPathname = currentPathname.split('/');
  const message_center_id = currentPathname[2] ? currentPathname[2] : '';

  useEffect(()=>{
    setContacts(businessusers)
  },[businessusers])
  useEffect(() => {
    // if (message_center_id && group_id != 0 && member_id != 0) {
    if (message_center_id && group_id == undefined && member_id == undefined) {
      const data = props.getMessageDetailsById({ user_id, message_center_id });

      setMessageDetailById(messageDetailsById);
    }
    const dataToSend = {
      user_id,
      // category_id: ''
    };
    props.getcategories(dataToSend);
    getGroups({ user_id });
    const SendToBusiness = {
      user_id,
      business_code,
    };
    getBusinessUsers(SendToBusiness);
    getRymindrList({ user_id });
  }, []);

  useEffect(() => {
    // if (message_center_id && group_id == 0 && member_id == 0) {
    if (message_center_id && group_id == undefined && member_id == undefined) {
      setMessageDetailById(messageDetailsById);
      const formdata = { ...formvalue };
      const string_array = messageDetailsById.rymindr_array;
      if (string_array && userRymindrList) {
        const number_array = string_array.map((el) => parseInt(el));

        const rymindr_main_array = [];

        for (let i = 0; i < number_array.length; i++) {
          const isNumber = (element) => element.id == number_array[i];
          const get_rymindr_index = userRymindrList.findIndex(isNumber);
          rymindr_main_array.push({ key: get_rymindr_index, id: number_array[i] });
        }
        setRymindrId(rymindr_main_array);
        formdata.linkRymindr = rymindr_main_array;
        setFormvalue(formdata);
      }

      formdata.message_center_id = message_center_id;
      setFormvalue(formdata);

      console.warn('testing messageDetailsById', messageDetailsById);

      setState({ switch: messageDetailsById.linked_to_rymindr != 0 });
      formdata.switch = messageDetailsById.linked_to_rymindr != 0;
      // formdata.linkRymindr = rymindr_main_array ;
      setFormvalue(formdata);
      setMessage(messageDetailsById.message)
      formdata.message = messageDetailsById.message;
      setFormvalue(formdata);

      setSubject(messageDetailsById.subject);
      formdata.subject = messageDetailsById.subject;
      setFormvalue(formdata);

      setCurrency(messageDetailsById.category);

      formdata.category = messageDetailsById.category;
      setFormvalue(formdata);

      if (messageDetailsById.group_array || messageDetailsById.member_array) {
        if (messageDetailsById.group_array.length > 0) {
          let arr = messageDetailsById.group_array.map((item) => parseInt(item));
          setChecked(arr);
        } else {
          setChecked([]);
        } 

        setMemberchecked(messageDetailsById.member_array);
        formdata.message_group = messageDetailsById.to_member
          ? messageDetailsById.to_member
          : messageDetailsById.to_group;
        formdata.to_member = messageDetailsById.to_member;
        formdata.to_group = messageDetailsById.to_group;
        setFormvalue(formdata);
        handleClose(false);
      }

      if (messageDetailsById.rymindr) {
        const rymdrCount = messageDetailsById.rymindr.split(',').length;
        setRymindrCount(rymdrCount);
      } else {
        setRymindrCount(0);
      }
      setRymindrLink(messageDetailsById.linked_to_rymindr);

      const file_main_array = [];
      if (messageDetailsById.attachment) {
        // messageDetailsById.attachment.map((file_arr, file_index) => {
        //   file_main_array.push(JSON.parse(file_arr.attachment_object));
        // });
        // console.log('messageDetailsById.attachment123=',messageDetailsById.attachment);
        setFiles(messageDetailsById.attachment);
      }
    }
  }, [messageDetailsById, userRymindrList]);

  const handleClose = (newValue) => {
    setOpen(newValue);
    const membername = [];
    const groupname = [];
    groups.forEach((element) => {
      const checkvalue = checked.indexOf(element.group_id);
      if (checkvalue !== -1) {
        groupname.push(element.group_name);
      }
    });
    if (businessusers.length > 0) {
      businessusers.forEach((element) => {
        const checkvalue = memberchecked.indexOf(element.user_id);
        if (checkvalue !== -1) {
          membername.push(`${element.first_name} ${element.last_name}`);
        }
      });
    }

    setGroupname_membersname(groupname.concat(membername));
    const dataToSend = {
      mobile_no: phoneNumber.join(),
    };
    if (phoneNumber.length > 0) {
      inviteAndAddMobile(dataToSend);
    }

    if (newValue) {
      // setValue(newValue);
    }
  };

  const validate = () => {
    const formvalidation = { ...formValidation };
    // alert('subject'+formvalue.subject);
    let isError = false;
    if (!formvalue.subject) {
      isError = true;
      formvalidation.subject = 'Please input Subject!';
      setFormValidation(formvalidation);
    } else {
      formvalidation.subject = '';
      setFormValidation(formvalidation);
    }
    console.log('formvalue.category=========', formvalue.category);
    if (!formvalue.category) {
      isError = true;
      formvalidation.category = 'Please select a Category!';
      setFormValidation(formvalidation);
    } else {
      formvalidation.category = '';
      setFormValidation(formvalidation);
    }

    if (!formvalue.message) {
      isError = true;
      formvalidation.message = 'Please input Message!';
      setFormValidation(formvalidation);
    } else {
      formvalidation.message = '';
      setFormValidation(formvalidation);
    }

    const value=formvalue.message_group;
    if (value=='' || value==[] || value==undefined) {
      isError = true;
      formvalidation.message_group = 'Please select Contacts!';
      setFormValidation(formvalidation);
    } else {
      formvalidation.message_group = '';
      setFormValidation(formvalidation);
    }
    return isError;
  };

  const handleToTagvalue = (value) => {
    setPhoneNumber(value);
  };

  const handleToSubmit = () => {
    console.log('memberchecked22222', memberchecked);
    console.warn('matched_contact44444', group_members);
    console.warn('checked12121212', checked);

    // console.log('files====',files);
    // return false;
    if (validate()) return false;
    const FormFields11 = { ...formvalue };
    FormFields11.rymindr_to_group = checked.join();
    FormFields11.to_group = checked.join();
    FormFields11.rymindr_group_members_to = [...new Set(group_members)].join();

    FormFields11.user_id = user_id;
    FormFields11.user_name = first_name;
    FormFields11.category = currency;
    FormFields11.rymindr_to =
      matched_contact !== null ? memberchecked.join() + ',' + matched_contact.user_id : memberchecked.join();
    FormFields11.to_member =
      matched_contact !== null ? memberchecked.join() + ',' + matched_contact.user_id : memberchecked.join();

    const sendAttachment = files;
    const deleteAttachment = deleteFiles;
    const unmatch = matched_contact ? matched_contact.mobile_no : '';

    if (message_center_id  && group_id == undefined && member_id == undefined) {
      updateMessageCenter(FormFields11, unmatch, history, sendAttachment,deleteAttachment)
    } else {
      createMessageCenter(FormFields11, unmatch, history, sendAttachment)
    }
  };

  // useMemo(() => {
  //   success_message && enqueueSnackbar(success_message, { variant: 'success' })
  // }, [success_message])

  useMemo(() => {
    error && enqueueSnackbar(error, { variant: 'error' });
  }, [error]);

  const handleToopen = () => {
    setOpen(true);
  };

  const getBase64 = (file, cb) => {
    //, cb
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      cb(reader.result);
      // console.log('cccccc', reader.result);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  };

  const getFiles = (e) => {
    const fileObj = [];
    const fileArray = [];
    // alert('fileee-target'+ e.target.files);
    fileObj.push(e.target.files);

    for (let i = 0; i < fileObj[0].length; i++) {
      if (files.length > 0) {
        getBase64(fileObj[0][i], (result) => {
          const fileInfo = {
            name: fileObj[0][i].name,
            type: fileObj[0][i].type,
            size: Math.round(fileObj[0][i].size / 1000) + ' kB',
            base64: fileObj[0][i].type == 'video/mp4' ? result.replace('data:video/mp4;base64,', '') : result,
            file: fileObj[0][i],
          };
          files.push(fileInfo);
          // files.push({'base64': result, 'name': fileObj[0][i].name})
          setFiles([...files]);
        });
      } else {
        getBase64(fileObj[0][i], (result) => {
          // idCardBase64 = result;
          // Make a fileInfo Object
          const fileInfo = {
            name: fileObj[0][i].name,
            type: fileObj[0][i].type,
            size: Math.round(fileObj[0][i].size / 1000) + ' kB',
            base64: fileObj[0][i].type == 'video/mp4' ? result.replace('data:video/mp4;base64,', '') : result,
            file: fileObj[0][i],
          };
          fileArray.push(fileInfo);
          setFiles([...fileArray]);
        });
      }
    }
  };

  const getFiles11 = (files) => {
    // files.map((file, index) => {
    // var extn = file.name.split('.')
    var etn = ['docx', 'doc', 'pdf', 'jpg', 'jpeg', 'png', 'mp4', 'mp3'];
    // var low = extn[1].toLowerCase()
    // if (etn.includes(low)) {
    setFiles(files);
    // } else {
    // error
    // }
    // })
  };

  
  const deleteImage = (index, file) => {
    if(file && file.attachment_object){
      let deleteThat = files.filter(a=>a.attachment_object==file.attachment_object);
      setDeleteFiles([...deleteFiles, ...deleteThat])
      var removeIndex = files.map(function(item) { return item.attachment_object; }).indexOf(file.attachment_object);
      files.splice(removeIndex, 1);
    } else if(file && file.name){
      var removeIndex = files.map(function(item) { return item.name; }).indexOf(file.name);
      files.splice(removeIndex, 1);
    }
    if (files.length == 0) {
      setFiles([])
    } else {
      setFiles([...files])
    }
  }


  const deleteImage2 = (index, file) => {
    
    // if (file && file.attachment_object) {
    //   var removeIndex = files
    //     .map(function (item) {
    //       return item.attachment_object;
    //     })
    //     .indexOf(file.attachment_object);
    //   files.splice(removeIndex, 1);
    // } else if (file && file.name) {
    //   var removeIndex = files
    //     .map(function (item) {
    //       return item.name;
    //     })
    //     .indexOf(file.name);
    //   files.splice(removeIndex, 1);
    // }
    // if (files.length == 0) {
    //   setFiles([]);
    // } else {
    //   setFiles([...files]);
    //   console.log('files===', files);
    // }
  };

  const category = [
    {
      value: 'USD',
      label: '$',
    },
    {
      value: 'EUR',
      label: 'Parents Evening',
    },
  ];

  const [currency, setCurrency] = React.useState('');

  const handleCategoryChange = (event) => {
    setCurrency(event.target.value);

    setFormvalue({ ...formvalue, [event.target.name]: event.target.value });
  };

  const handleMessage = (event) => {
    setFormvalue({ ...formvalue, [event.target.name]: event.target.value });
    setMessage(event.target.value);
  };

  const handleSubject = (event) => {
    setSubject(event.target.value);
    setFormvalue({ ...formvalue, [event.target.name]:(event.target.value).trim()});
  };

  // If member or group is selected via parameter.
  useMemo(() => {
    if (!ID) {
      const newChecked = [...checked];

      if (member_id != 0 || group_id != 0) {
        const groupname = [];
        const membername = [];
        if (group_id != '0') {
          if (groups.length > 0) {
            groups.forEach((element) => {
              if (element.group_id == group_id) {
                groupname.push(element.group_name);
              }
            });
          } else {
            groupname.push(get_name);
          }
          // if(newChecked.indexOf(group_id) > -1 ){
          //   newChecked.push(group_id)
          // }

          if (group_id) {
            newChecked.push(group_id);
          }
          setChecked(newChecked);
          setFormvalue({ ...formvalue, message_group: group_id });
        } else if (member_id != '0') {
          if (businessusers.length > 0) {
            businessusers.forEach((element) => {
              if (element.user_id == member_id) {
                membername.push(`${element.first_name} ${element.last_name}`);
              }
            });
          } else {
            membername.push(get_name);
          }

          newChecked.push(member_id);
          setMemberchecked(newChecked);
          setFormvalue({ ...formvalue, message_group: member_id });
        }

        setGroupname_membersname(groupname.concat(membername));
      }
      if (member_id == undefined && group_id == undefined) {
        const membername = [];
        const members = [];
        setMemberchecked(members);
        setGroupname_membersname(membername);
      }
    }
  }, [groups, businessusers]);

  const resetForm = () => {
    setCurrency('');
    setGroupname_membersname('');
    setFormvalue(FormFields);
    setFormValidation(FormFields);
    setOpen(false);
    setTimeErr('');
    setPhoneNumber([]);
    setFiles([]);
    setSubject('');
    setMessage('');
    setRymindrCount('');
    setRymindrId([])
    setcheckOnSelectAllMembers(false);
    setcheckOnSelectAllGroup(false);
    setMemberchecked([]);
    setChecked([]);
  };
  const rymindr_text = 'Rymindr linked';
  console.log('rymindrId--',rymindrId)
  console.log('Contacts-',Contacts)
  return (
    <>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <DialogRaw
          getSelectedRymindr={rymindrId}
          open={openRymindr}
          onClose={handleCloseRymindr}
          getRymindrListData={userRymindrList}
          onRymindrUpdate={updateRymindrCount}
          onRymindrUpdateLink={updateRymindrLink}
        />
        {/* <ConfirmationDialogRaw open={open} onClose={handleClose} groupdata={groups} memberdata={businessusers}>
          <Tabmenu
            groupdata={groups}
            memberdata={businessusers}
            handleToggles={handleGroupToggle}
            checked={checked}
            handleMemberToggle={handleMemberToggle}
            memberchecked={memberchecked}
            handleToTagvalue={handleToTagvalue}
            checkOnSelectAllMembers={checkOnSelectAllMembers}
            checkOnSelectAllGroup={checkOnSelectAllGroup}
          />
        </ConfirmationDialogRaw>*/}

        <ConfirmationDialogRaw open={open} onClose={handleClose} groupdata={groups} memberdata={businessusers}>
          <Tabmenu
            groupdata={groups}
            memberdata={businessusers}
            handleToggles={handleGroupToggle}
            checked={checked}
            handleMemberToggle={handleMemberToggle}
            handleAllMembersToggle ={handleAllMembersToggle}
            handleAllGroupMembersToggle ={handleAllGroupMembersToggle}
            memberchecked={memberchecked}
            handleToTagvalue={handleToTagvalue}
          />
        </ConfirmationDialogRaw>
        <Grid className="main-wrap-head" container style={{ marginBottom: 20 }} alignItems="center">
          <Grid item xs={7}>
            <TypoHeadStyled variant="h4">
              <ArrowBackIcon onClick={() => history.goBack()} /> Direct{' '}
              <TypoHeadInnerStyled component="span">message</TypoHeadInnerStyled>
            </TypoHeadStyled>
          </Grid>
          <Grid item xs={5}>
            <Box display="flex" justifyContent="flex-end">
              <Button variant="contained" color="primary" size="large" startIcon={<Replay />} onClick={resetForm}>
                Reset
              </Button>
            </Box>
          </Grid>
        </Grid>
        <PaperStyled className="main-wrap-body create-msg-wrap">
        {Contacts.length > 0 ?
          <GridStyled container className="article-content" spacing={5}>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                limitTags={1}
                id="tags-filled"
                filterSelectedOptions={false}
                options={[]}
                freeSolo
                onChange={(event, newValue) => {
                  const newVal = newValue.toString();
                  const getArray = newVal.split(',');
                  const user_id_arr = [];
                  const group_id_arr = [];
                  for (let i = 0; i < getArray.length; i++) {
                    const getNewList = businessusers.find((ele) => ele.first_name + ' ' + ele.last_name == getArray[i]);
                    if (getNewList) {
                      user_id_arr.push(getNewList.user_id);
                    } else {
                      // FOR GROUPS
                      const getNewGroupList = groups.find((ele) => ele.group_name == getArray[i]);
                      if(getNewGroupList){
                        group_id_arr.push(getNewGroupList.group_id);
                      }
                    }
                  }

                  setGroup_members(group_id_arr);
                  setGroupname_membersname(newValue);

                  const formdata = { ...formvalue };
                  setChecked(group_id_arr);
                  setMemberchecked(user_id_arr);

                  formdata.message_group = user_id_arr.join() ? user_id_arr.join() : group_id_arr.join();
                  formdata.to_member = user_id_arr.join();
                  formdata.to_group = group_id_arr.join();
                  setFormvalue(formdata);
                }}
                value={groupname_membersname}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Type Number and Enter to Add"
                    variant="outlined"
                    margin="normal"
                    label="To"
                    onChange={handleToopen}
                    onClick={handleToopen}
                    error={!!formValidation.message_group}
                    helperText={formValidation.message_group}
                    name="message_group"
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Subject"
                fullWidth
                variant="outlined"
                value={subject}
                onClick={handleSubject}
                onChange={handleSubject}
                error={!!formValidation.subject}
                helperText={formValidation.subject}
                name="subject"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                label="Category"
                value={currency}
                fullWidth
                onChange={handleCategoryChange}
                error={!!formValidation.category}
                helperText={formValidation.category}
                variant="outlined"
                name="category"
              >
                {console.log('currency-',currency)}
                <MenuItem key="" value="">
                  Select
                </MenuItem>
                {categories.map((option) => (
                  <MenuItem key={option.id} value={option.category_name}>
                    <img src={option.category_image} className={classes.categoryIon} /> {option.category_name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <CKEditor
                config={ckEditorConfig}
                editor={Editor}
                data={ message}
                name="message"
                onReady={(editor) => {
                  console.log('Editor is ready to use!', editor);
                }}
                onChange={(event, editor) => {
                  const data = editor.getData()
                  setFormvalue({ ...formvalue, message: data });
                  setMessage(data);
                }}
                onBlur={(event, editor) => {
                  console.log('Blur.', editor);
                }}
                onFocus={(event, editor) => {
                  console.log('Focus.', editor);
                }}
              />
              <p style={{color:'red',marginLeft:'1rem',fontSize:'12px',marginTop:'4px'}}>{formValidation.message}</p>
              {/* <TextField
                rows={4}
                rowsMax={100}
                multiline
                label='Message' fullWidth variant='outlined' value={message}
                onClick={handleMessage} onChange={handleMessage}
                error={!!formValidation.message}
                helperText={formValidation.message}
                name='message'
              /> */}
            </Grid>

            <Grid item xs={12}>
              <Box display="flex">
                <FormControlLabel
                  style={{ marginTop: 8 }}
                  control={
                    <Switch checked={state.switch} onChange={handleSwitchChange} name="switch" color="primary" />
                  }
                  label="Link&nbsp;Rymindr"
                />

                {state.switch && (
                  <TextField
                    label="Rymindr"
                    fullWidth
                    variant="outlined"
                    onChange={handleToopenRymindr}
                    onClick={handleToopenRymindr}
                    value={rymindrCount ? `${rymindrCount} ${rymindr_text}` : ''}
                  />
                )}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" className="attach-files">
                {/* <FormControlLabel
                  className='attachement'
                  control={
                    <FileBase64
                      multiple={true}
                      onDone={getFiles11}
                      className='displayNone'
                      style={{ display: 'none' }}
                    />
                  }

                  label={<Typography variant='subtitle1' component='p'>
                    <Attachment style={{ marginBottom: -6, marginRight: 15 }} color='primary' /> Attachment
                    </Typography>}
                /> */}

                <FormControlLabel
                  className="attachement"
                  control={
                    <input
                      type="file"
                      multiple
                      onChange={getFiles}
                      onClick={(e) => (e.target.value = null)}
                      className="displayNone"
                      style={{ display: 'none' }}
                    />
                  }
                  label={
                    <Typography variant="subtitle1" component="p">
                      <Attachment style={{ marginBottom: -6, marginRight: 15 }} color="primary" /> Attachment
                    </Typography>
                  }
                />
              </Box>
              <Box alignItems="center" display="flex">
                {
                  // files && files.map((file, index) => {
                  //   const extension_arr = file && file.name ? file.name.split('.') : file.split('.')
                  //   const extension = extension_arr[1]
                  //   if (extension == 'jpeg' || extension == 'jpg' || extension == 'png' || extension == 'gif') {
                  //     return (
                  //       <TypoStyled variant='subtitle1' component='p' key={index}>
                  //         {/* <img src={file.base64} width='32' height='32' className={classes.iconAttach} /> <Box className={classes.fileName}>{file.name}</Box> <CancelIcon onClick={() => deleteImage(index, file)} /> */}
                  //         <img src={file.base64} className={classes.iconAttach} /> {file.name}<CancelIcon onClick={() => deleteImage(index, file)} className={classes.verticalClass} />
                  //       </TypoStyled>
                  //     )
                  //   } else if (extension == 'mp3') {
                  //     return (
                  //       <TypoStyled variant='subtitle1' component='p' key={index}>
                  //         <Headset className={classes.iconAttach} /> {file.name} <CancelIcon className={classes.verticalClass} onClick={() => deleteImage(index, file)} />
                  //       </TypoStyled>
                  //     )
                  //   } else if (extension == 'mp4') {
                  //     return (
                  //       <TypoStyled variant='subtitle1' component='p' key={index}>
                  //         <Videocam className={classes.iconAttach} /> {file.name} <CancelIcon className={classes.verticalClass} onClick={() => deleteImage(index, file)} />
                  //       </TypoStyled>
                  //     )
                  //   } else if (extension == 'doc' || extension == 'docx' || extension == 'pdf') {
                  //     return (
                  //       <TypoStyled variant='subtitle1' component='p' key={index}>
                  //         <Description className={classes.iconAttach} /> {file.name} <CancelIcon className={classes.verticalClass}  onClick={() => deleteImage(index, file)} />
                  //       </TypoStyled>
                  //     )
                  //   } else if (extension == 'mp4') {
                  //     return (
                  //       <TypoStyled variant='subtitle1' component='p' key={index}>
                  //         <Videocam className={classes.iconAttach} /> {file.name} <CancelIcon onClick={() => deleteImage(index, file)} />
                  //       </TypoStyled>
                  //     )
                  //   } else if (extension == 'doc' || extension == 'docx') {
                  //     return (
                  //       <TypoStyled variant='subtitle1' component='p' key={index}>
                  //         <Description className={classes.iconAttach} /> {file.name} <CancelIcon onClick={() => deleteImage(index, file)} />
                  //       </TypoStyled>
                  //     )
                  //   }  else {
                  //     return (
                  //       <TypoStyled variant='subtitle1' component='p' key={index}>
                  //         <Description className={classes.iconAttach} /> {file.name} <CancelIcon onClick={() => deleteImage(index, file)} />
                  //       </TypoStyled>
                  //     )
                  //   }
                  // })

                  files &&
                    files.map((file, index) => {
                      
                      if (file.attachment_object != undefined) {
                        const extension_arr = file.attachment_object.split('.');
                        const extension = extension_arr[1];

                        if (extension == 'jpeg' || extension == 'jpg' || extension == 'png' || extension == 'gif') {
                          return (
                            <TypoStyled variant="subtitle1" component="p" key={index}>
                              <img src={file.file_name} width="32" height="32" />{' '}
                              <Box className={classes.fileName}>{file.attachment_object}</Box>{' '}
                              <CancelIcon onClick={() => deleteImage(index, file)} />
                            </TypoStyled>
                          );
                        } else if (extension == 'mp3') {
                          return (
                            <TypoStyled variant="subtitle1" component="p" key={index}>
                              <Headset className={classes.iconAttach} /> {file.attachment_object}{' '}
                              <CancelIcon onClick={() => deleteImage(index, file)} />
                            </TypoStyled>
                          );
                        } else if (extension == 'mp4') {
                          return (
                            <TypoStyled variant="subtitle1" component="p" key={index}>
                              <Videocam className={classes.iconAttach} /> {file.attachment_object}{' '}
                              <CancelIcon onClick={() => deleteImage(index, file)} />
                            </TypoStyled>
                          );
                        } else if (extension == 'doc' || extension == 'docx' || extension == 'pdf') {
                          return (
                            <TypoStyled variant="subtitle1" component="p" key={index}>
                              <Description className={classes.iconAttach} /> {file.attachment_object}{' '}
                              <CancelIcon onClick={() => deleteImage(index, file)} />
                            </TypoStyled>
                          );
                        } else {
                          return (
                            <TypoStyled variant="subtitle1" component="p" key={index}>
                              <Description className={classes.iconAttach} /> {file.attachment_object}{' '}
                              <CancelIcon onClick={() => deleteImage(index, file)} />
                            </TypoStyled>
                          );
                        }
                      } else {
                        const extension_arr = file.name.split('.');
                        const extension = extension_arr[1];
                        if (extension == 'jpeg' || extension == 'jpg' || extension == 'png' || extension == 'gif') {
                          return (
                            // <TypoStyled variant='subtitle1' component='p' key={index}>
                            //   <img src={file.base64} width='32' height='32' className={classes.iconAttach} /> <Box className={classes.fileName}>{file.name}</Box> <CancelIcon onClick={() => deleteImage(index, file)} />
                            // </TypoStyled>

                            <TypoStyled variant="subtitle1" component="p" key={index}>
                              <img src={file.base64} className={classes.iconAttach} /> {file.name}
                              <CancelIcon onClick={() => deleteImage(index, file)} className={classes.verticalClass} />
                            </TypoStyled>
                          );
                        } else if (extension == 'mp3') {
                          return (
                            <TypoStyled variant="subtitle1" component="p" key={index}>
                              <Headset className={classes.iconAttach} /> {file.name}{' '}
                              <CancelIcon onClick={() => deleteImage(index, file)} />
                            </TypoStyled>
                          );
                        } else if (extension == 'mp4') {
                          return (
                            <TypoStyled variant="subtitle1" component="p" key={index}>
                              <Videocam className={classes.iconAttach} /> {file.name}{' '}
                              <CancelIcon onClick={() => deleteImage(index, file)} />
                            </TypoStyled>
                          );
                        } else if (extension == 'doc' || extension == 'docx' || extension == 'pdf') {
                          return (
                            <TypoStyled variant="subtitle1" component="p" key={index}>
                              <Description className={classes.iconAttach} /> {file.name}{' '}
                              <CancelIcon onClick={() => deleteImage(index, file)} />
                            </TypoStyled>
                          );
                        } else {
                          return (
                            <TypoStyled variant="subtitle1" component="p" key={index}>
                              <Description className={classes.iconAttach} /> {file.name}{' '}
                              <CancelIcon onClick={() => deleteImage(index, file)} />
                            </TypoStyled>
                          );
                        }
                      }
                    })
                }
              </Box>
              {/* <Box alignItems='center' display='flex'>
                <TypoStyled variant='subtitle1' component='p'>
                  <Headset className={classes.iconAttach} /> Audio Name.mp3
                </TypoStyled>

                <TypoStyled variant='subtitle1' component='p'>
                  <Image className={classes.iconAttach} /> Image Name.jpeg
                </TypoStyled>

                <TypoStyled variant='subtitle1' component='p'>
                  <Videocam className={classes.iconAttach} /> Video Name.mp4
                </TypoStyled>

                <TypoStyled variant='subtitle1' component='p'>
                  <Description className={classes.iconAttach} /> Document Name.doc
                </TypoStyled>
            </Box> */}
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end">
                {/* <ButtonColor variant='contained' color='primary' size='large' className='mr-30 width180' startIcon={<Visibility />}>
                  Preview
          </ButtonColor> */}
                <Button
                  variant="contained"
                  size="large"
                  className="width180"
                  startIcon={<Cancel />}
                  onClick={() => history.goBack()}
                  style={{ marginRight: 20 }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  className="width180"
                  startIcon={<Send />}
                  onClick={handleToSubmit}
                  disabled={loading}
                >
                  {loading && <CircularSpinner />}
                  Send Now
                </Button>
              </Box>
            </Grid>
          </GridStyled>
        :
        <div style={{marginTop:'16rem'}}>
        <DialogContent style={{ margin: '2rem 6rem 2rem 6rem', textAlign: 'center' }}>
            <h6 style={{ letterSpacing: '0.4px', paddingLeft: '1rem' }}>
              You'll need to have at least 1 contact to enable this feature.
            </h6>
          </DialogContent>
          <Box display="flex" justifyContent="center" style={{ marginBottom: '5rem' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => {
                history.push('/contacts');
              }}
            >
              Add Contacts
            </Button>
          </Box>
          </div>
        }
        </PaperStyled>
      </MuiPickersUtilsProvider>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    loading: state.rymidr.loading,
    error: state.rymidr.error,
    success_message: state.messageCenterReducer.success_message,
    categories: state.messageCenterReducer.categories,
    userRymindrList: state.messageCenterReducer.userRymindrList,
    // categories: state.rymidr.categories,
    // subcategories: state.rymidr.subcategories,
    groups: state.rymidr.groups,
    businessusers: state.rymidr.businessusers,
    matched_contact: state.rymidr.matched_contact,
    messageDetailsById: state.messageCenterReducer.messageDetailById,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getcategories: (data) => dispatch(getCategories(data)),
    // getSubCategories: (data) => dispatch(getSubCategories(data)),
    getGroups: (data) => dispatch(getGroups(data)),
    getBusinessUsers: (data) => dispatch(getBusinessUsers(data)),
    getRymindrList: (data) => dispatch(getRymindrList(data)),
    createMessageCenter: (data, unmatch, history, sendAttachment) =>
      dispatch(createMessageCenter(data, unmatch, history, sendAttachment)),
    updateMessageCenter: (data, unmatch, history, sendAttachment,deleteAttachment) =>
      dispatch(updateMessageCenter(data, unmatch, history, sendAttachment,deleteAttachment)),
    inviteAndAddMobile: (data) => dispatch(inviteAndAddMobile(data)),
    getMessageDetailsById: (data) => dispatch(getMessageDetailsById(data)),
  };
};

DirectMessage.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  getcategories: PropTypes.func.isRequired,
  getMessageDetailsById: PropTypes.func.isRequired,
  error: PropTypes.string.isRequired,
  success_message: PropTypes.any.isRequired,
  categories: PropTypes.array.isRequired,
  subcategories: PropTypes.array.isRequired,
  getSubCategories: PropTypes.func.isRequired,
  getGroups: PropTypes.func.isRequired,
  groups: PropTypes.array.isRequired,
  businessusers: PropTypes.array.isRequired,
  getBusinessUsers: PropTypes.func.isRequired,
  userRymindrList: PropTypes.array.isRequired,
  getRymindrList: PropTypes.func.isRequired,
  createMessageCenter: PropTypes.func.isRequired,
  updateMessageCenter: PropTypes.func.isRequired,
  inviteAndAddMobile: PropTypes.func.isRequired,
  matched_contact: PropTypes.any.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(withSnackbar(DirectMessage));
