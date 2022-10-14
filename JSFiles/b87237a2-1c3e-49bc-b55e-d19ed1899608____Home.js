import React, { useContext, useEffect, useState } from 'react'
import './Home.css'
import DomainIcon from '@material-ui/icons/Domain'
import FileDownload from 'js-file-download'
import Grid from '@material-ui/core/Grid'
import styled from 'styled-components'
import Layout from '../Layout'
import { Carousel, Menu, notification } from 'antd'
import _ from 'lodash'
import axios from 'axios'
import * as qs from 'querystring'
import 'react-calendar/dist/Calendar.css'
import * as firebase from 'firebase'
import { ButtonToggle, Input, InputGroupAddon } from 'reactstrap'
import Button from '@material-ui/core/Button'
import Modal from '@material-ui/core/Modal'
import { Modal as AModal } from 'antd'

import { makeStyles } from '@material-ui/styles'
import {
  ForgetTitle,
  FullWidthButton,
  InputField,
  InputGrid,
  InputGroupIcon,
  InputGroupIconNoRound,
  NoIconInputField,
  WhiteBox,
} from '../Landing'
import MenuBar from '../components/MenuBar'
import Navbar from '../components/Navbar'
import { Calendar } from 'react-calendar'
import moment from 'moment'
import ActivityList from '../components/ActivityList'
import RepairTable from '../components/RepairTable'
import { LoadingContext } from '../components/LoadingProvider'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'
import { BitlyClient } from 'bitly'
import PriceComponent from '../components/PriceComponent'
import CustomProperty from '../components/CustomProperty'
import AccessHistory from '../components/AccessHistory'
import Chat from '../components/Chat'
import Test1 from '../components/Test1'
import { render } from 'react-dom'

// import SideNav, {
//   Toggle,
//   Nav,
//   NavItem,
//   NavIcon,
//   NavText
// } from "@trendmicro/react-sidenav";
// import "@trendmicro/react-sidenav/dist/react-sidenav.css";


const RedDot = styled(FiberManualRecordIcon)`
  color: red;
  font-size: 10px !important;
`
const Forge = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
`
const ModeGrid = styled(Grid)`
  background-color: white;
  padding: 25px;
  margin: 10px;
  .react-calendar {
    width: 600px;
  }
  height: 100%;
  ${({ marginleft = 0 }) => `margin-left:${marginleft}px !important;`}
`
const ViewerGrid = styled(Grid)`
  position: relative;
  margin-top: 25px;
  margin-right: 5px;
  height: 70vh;
  width: 100%;
`
const MenuGrid = styled(Grid)`
  margin-bottom: 50px;
`
const Autodesk = window.Autodesk
let viewer
let viewer2d
let PushPinExtensionHandle = null
let issueRef = null
function Home(props) {
  notification.config({
    bottom: 50,
    duration: 3,
    rtl: true,
  })

  const [selectedmodel, setModel] = useState('0')
  const { showloading, hideloading } = useContext(LoadingContext)
  const [user, setUser] = useState({})

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (userResult) {
      if (userResult) {
        firebase
          .database()
          .ref(`/user/${userResult.uid}`)
          .once('value', (data) => {
            //console.log('Current User', user)

            if (_.isEmpty(user)) {
              //console.log('Result User', userResult)

              setUser({ ...data.val(), uid: userResult.uid })
            }
          })
      } else {
        window.location.href = '/'
        // No user is signed in.
      }
    })
  }, [])
  const [mode, setMode] = useState('3d')

  const [plans, setPlans] = useState([])

  const [modelList, setModelList] = useState([])
  const [repairList, setRepairList] = useState({})
  const [editForm, setOpenEditForm] = useState({ isOpen: false, data: {} })
  const [isInsert, toggleInsert] = useState(false)
  const [allList, setAllList] = useState([])
  //console.log('editForm', editForm)
  const [seletedIssue, setIssue] = useState({})
  useEffect(() => {
    //console.log('Let find issue')
    if (props.sceneKey === 'issue') {
      //console.log('param', props.match.params)
      setIssue(_.find(allList, (item) => item.keyid === props.match.params.id))
      const issue = _.find(allList, (item) => item.keyid === props.match.params.id)
      if (PushPinExtensionHandle && issue) {
        PushPinExtensionHandle.pushPinManager.createItem({
          ...issue,
          id: issue.keyid,
          label: issue.label,
          status: issue.status,
          position: issue.position,
          type: issue.type,
          objectId: issue.objectId,
          viewerState: issue.viewerState,
          custom: { date: issue.date, index: issue.keyid },
        })
      }
    }
  }, [allList, props.sceneKey, PushPinExtensionHandle, selectedmodel, props.match.params])
  const [isCreating, SetCreating] = useState(false)

  const [isMarking, toggleRepareForm] = useState(false)
  const [repairForm, setRepairForm] = useState({
    title: '',
    description: '',
    priority: 1,
    files: [],
  })
  const [option, setOption] = useState({
    mode: '3d',
    model1: 0,
    model2: 1,
  })
  // if (user.status == 0){ 
  //   alert('กรุณาติดต่อผู้ดูแลระบบเพื่อยืนยันการเข้าใช้งานระบบ')
  //   window.location='/'
  // }
  // else if(user.status >= 4){window.location='404.html'}
  useEffect(() => {
    firebase
      .database()
      .ref('/models')
      .once('value', (snap) => {
        let output = []
        _.forEach(snap.val(), (item) => {
          _.forEach(item.users, (member) => {
            if (member.uid === user.uid) {
              output.push(item)
            }
          })
        })

        setModelList(output)

        if (output.length > 0) {
          if (props.match.params.model) {
            setModel(props.match.params.model)
          }

          if (_.size(selectedmodel) < 4) {
            //console.log('Selected default model')
            setModel(output[0].value)
          }
        }
      })
    document.getElementsByTagName('body')[0].className = 'defaultLayout'
  }, [user.uid])
  
  // if (user.status == 0){ 
  //   alert('กรุณาติดต่อผู้ดูแลระบบเพื่อยืนยันการเข้าใช้งานระบบ')
  //   window.location='/'
  // }
  if(user.status >= 4){window.location='404.html'}
  /**
   * Autodesk.Viewing.Document.load() failuire callback.
   */
  /**
   * viewer.loadModel() success callback.
   * Invoked after the model's SVF has been initially loaded.
   * It may trigger before any geometry has been downloaded and displayed on-screen.
   */
  const [isError, setError] = useState({
    model1: false,
    model2: false,
  })
  const onDocumentLoadFailure = (viewerErrorCode) => {
    console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode)
    if (viewerErrorCode === 9) {
      setError({ model2: true, model1: true })
    }
  }

  const onLoadModelSuccess = (model, selectView, id, isModel1 = false) => {
    if (isModel1) {
      setError({ ...isError, model1: false })
    } else {
      setError({ ...isError, model2: false })
    }

    // selectView.loadExtension('Autodesk.ModelStructure')
    // selectView.loadExtension('Autodesk.PropertiesManager')
    selectView.loadExtension('Autodesk.DocumentBrowser')
    selectView.loadExtension('Autodesk.DefaultTools.NavTools')
    selectView.loadExtension("NestedViewerExtension", { filter: ["2d"], crossSelection: true })
    var extensionOptions = {
      hideIssuesButton: true,
      hideRfisButton: true,
      hideFieldIssuesButton: true,
    }
    if (isModel1) {
      viewer.setDefaultNavigationTool('orbit')
      selectView
        .loadExtension('Autodesk.BIM360.Extension.PushPin', extensionOptions)
        .then(function (extension) {
          PushPinExtensionHandle = extension
          PushPinExtensionHandle.pushPinManager.addEventListener('pushpin.selected', function (
            e
          ) {})
          PushPinExtensionHandle.pushPinManager.addEventListener('pushpin.created', function (e) {
            const date = moment().format('YYYY-MM-DD')
            const guild = id

            const datamodel = _.find(modelList, (item) => item.value === selectedmodel)

            if (guild && e.value.itemData.isAction) {
              const storage = firebase.storage()

              firebase
                .database()
                .ref(`/model/${selectedmodel}/${guild}/${date}`)
                .push({
                  ...e.value.itemData,
                  isAction: false,
                  status: 'created',
                  user: user,
                })
                .then((snap) => {
                  const key = snap.key
                  setRepairForm({ title: '', description: '' })
                  let imagesUrl = []
                  if (_.size(_.get(e.value, 'itemData.files', [])) === 0) {
                    //console.log(`Notify to ${_.size(datamodel.users)} of user `)

                    _.forEach(datamodel.users, (user) => {
                      //console.log('Notify', user)
                      const notifyUser = firebase
                        .database()
                        .ref(`/user/${user.uid}`)
                        .once('value', (data) => {
                          //console.log('notifyUser', data.val())
                          const lineUser = data.val()
                          if (_.get(lineUser, 'lineToken', false)) {
                            axios.post(
                              'https://us-central1-bim-database.cloudfunctions.net/line-lineNotify',
                              {
                                issue: e.value.itemData,
                                token: _.get(lineUser, 'lineToken', false),
                                datamodel,
                                imagesUrl,
                              }
                            )
                          }
                        })
                    })
                  }

                  _.forEach(e.value.itemData.files, (item) => {
                    const uploadTask = firebase
                      .storage()
                      .ref(`/images/${key}/${item.name}`)
                      .put(item)

                    uploadTask.on(
                      'state_changed',
                      (snapshot) => {
                        // progress function ...
                        const progress = Math.round(
                          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                        )
                      },
                      (error) => {
                        // Error function ...
                        //console.log(error)
                      },
                      () => {
                        // complete function ...
                        storage
                          .ref(`/images/${key}`)
                          .child(item.name)
                          .getDownloadURL()
                          .then((url) => {
                            imagesUrl.push(url)
                            if (
                              _.size(imagesUrl) === _.size(_.get(e.value, 'itemData.files', []))
                            ) {
                              _.forEach(datamodel.users, (user) => {
                                const notifyUser = firebase
                                  .database()
                                  .ref(`/user/${user.uid}`)
                                  .once('value', (data) => {
                                    //console.log('notifyUser', data.val())
                                    const lineUser = data.val()
                                    if (_.get(lineUser, 'lineToken', false)) {
                                      axios.post(
                                        'https://us-central1-bim-database.cloudfunctions.net/line-lineNotify',
                                        {
                                          issue: e.value.itemData,
                                          token: _.get(lineUser, 'lineToken', false),
                                          datamodel,
                                          imagesUrl,
                                        }
                                      )
                                    }
                                  })
                              })
                            }
                            firebase
                              .database()
                              .ref(`/model/${selectedmodel}/${guild}/${date}/${key}/images`)
                              .push(url)
                          })
                      }
                    )
                  })
                })
            }
            SetCreating(false)
            PushPinExtensionHandle.endCreateItem()
          })

          let result = {}
          issueRef = firebase
            .database()
            .ref(`/model/${selectedmodel}/${id}/`)
            .on('value', (snap) => {
              _.forEach(snap.val(), (item, date) => {
                _.forEach(item, (repairItem, index) => {
                  _.set(result, `${date}.${index}`, {
                    selectedmodel,
                    modelNumber: id,
                    ...repairItem,
                    date,
                  })
                })
              })
              //console.log('Set Repair List', result)
              setRepairList(result)
              let output = []
              _.forEach(result, (item) => {
                _.forEach(item, (repair, index) => {
                  output.push({
                    ...repair,
                    keyid: index,
                  })
                })
              })
              //console.log('Set Repair List', output)

              setAllList(output)

              //console.log('props.sceneKey', props.sceneKey)
              if (props.sceneKey === 'issue') {
              } else {
                extension.pushPinManager.removeAllItems()

                _.forEach(snap.val(), (item, date) => {
                  _.forEach(item, (item, index) => {
                    // console.log('Generate Issue', {
                    //   ...item,
                    //   id: index,
                    //   label: item.label,
                    //   status: item.status,
                    //   position: item.position,
                    //   type: item.type,
                    //   objectId: item.objectId,
                    //   viewerState: item.viewerState,
                    //   custom: { date, index },
                    // })
                    try {
                      viewer.viewerState.restoreState(item.viewerState, true)
                      extension.pushPinManager.createItem({
                        ...item,
                        id: index,
                        label: item.label,
                        status: item.status,
                        position: item.position,
                        type: item.type,
                        objectId: item.objectId,
                        viewerState: item.viewerState,
                        custom: { date, index },
                      })
                    } catch (e) {
                      //console.log('Cant Create issue', e)
                    }
                  })
                })
              }
            })
        })
    }

    try {
      document.getElementById('toolbar-modelStructureTool').click()
      document.getElementById('toolbar-propertiesTool').click()
    } catch (e) {
      //console.log(e)
    }
  }

  /**
   * Autodesk.Viewing.Document.load() success callback.
   * Proceeds with model initialization.
   */
  const onDocumentLoadSuccess = (doc) => {
    var defaultModel = doc.getRoot().getDefaultGeometry()
    // viewer.loadDocumentNode(doc, defaultModel)

    // A document contains references to 3D and 2D viewables.
    let type = { type: 'geometry' }
    var viewables = _.map(doc.getRoot().search({ type: 'geometry' }), (item) => {
      return {
        ...item.data,
      }
    })
    setPlans(viewables)
    var modelOptions = {}
    var initialViewable = viewables[option.model1]
    var svfUrl = doc.getViewablePath(initialViewable)
    var initialViewable2 = viewables[option.model2]

    var svfUrl2 = doc.getViewablePath(initialViewable2)

    var _blockEventMain = false
    var _blockEventSecondary = false
    if (props.sceneKey === 'repair') {
      viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, function (event) {
        if (_blockEventSecondary) {
          return
        }
        _blockEventMain = true
        viewer2d.select(viewer.getSelection())
        _blockEventMain = false
      })
      viewer2d.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, function (event) {
        if (_blockEventMain) {
          return
        }
        _blockEventSecondary = true
        viewer.select(viewer2d.getSelection(0))
        viewer.fitToView(viewer2d.getSelection())
        _blockEventSecondary = false
      })
    } else {
      viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, function (event) {
        viewer.getProperties(event.dbIdArray[0], function (data) {
          var ext = viewer.getExtension('Autodesk.PropertiesManager')
          if (data.externalId !== '') {
            setOpenEditForm({
              isOpen: true,
              data: {
                id: viewer.getSelection()[0],
                properties: data.properties,
              },
            })
          } else {
            setOpenEditForm({
              isOpen: false,
              data: {},
            })
          }
        })
      })
    }

    viewer.start(
      svfUrl,
      modelOptions,
      (model) => {
        onLoadModelSuccess(model, viewer, `model${option.model1}`, true)
      },
      (error) => {
        onLoadModelError(error, true)
      }
    )
    viewer2d.start(
      svfUrl2,
      modelOptions,
      (model) => {
        onLoadModelSuccess(model, viewer, `model${option.model2}`)
      },
      (error) => {
        onLoadModelError(error, false)
      }
    )
  }
  /**
   * viewer.loadModel() failure callback.
   * Invoked when there's an error fetching the SVF file.
   */
  const onLoadModelError = (viewerErrorCode, isModel1 = false) => {
    if (isModel1) {
      setError({ ...isError, model1: true })
    } else {
      setError({ ...isError, model2: true })
    }
    console.error('onLoadModelError() - errorCode:' + viewerErrorCode)
  }
  const [token, setToken] = useState(null)
  const [date, setDate] = useState(new Date())
  const [sCurveFile, setScurve] = useState(null)

  let options = {
    env: 'AutodeskProduction',
    accessToken: '',
  }
  //console.log('selectedmodel', selectedmodel)
  let documentId = `urn:${selectedmodel}`


  useEffect(() => {
    if (token) {
      options = {
        env: 'AutodeskProduction',
        accessToken: token.access_token,
      }
      if (selectedmodel != 0 && typeof selectedmodel !== 'undefined') {
        setError({
          model2: false,
          model1: false,
        })
        if (user) {
          firebase
            .database()
            .ref(`/history/${selectedmodel}/${moment().format('YYYY-MM-DD')}/${user.uid}`)
            .update({
              ...user,
              loginDate: moment().format('HH:mm'),
              
            })
        }

        Autodesk.Viewing.Initializer(options, function () {
          var viewerDiv = document.getElementById('MyViewerDiv')
          var viewerDiv2 = document.getElementById('my2dView')
          viewer = new Autodesk.Viewing.GuiViewer3D(viewerDiv, {
            extensions: [
              'Autodesk.DocumentBrowser',
              'Autodesk.Viewing.MarkupsCore',
              'Autodesk.Viewing.MarkupsGui',
              'Autodesk.PropertiesManager',
              'Autodesk.Viewing.Collaboration',   
              // 'Autodesk.VisualClusters',
              'Autodesk.AEC.SheetSyncExtension'
            ]
          })
          viewer2d = new Autodesk.Viewing.GuiViewer3D(viewerDiv2, {
            extensions: [
              'Autodesk.DocumentBrowser',
              'Autodesk.Viewing.MarkupsCore',
              'Autodesk.Viewing.MarkupsGui',
              'Autodesk.AEC.LevelsExtension',
              'Autodesk.Viewing.Collaboration',
            ]
          })
          if (selectedmodel !== 0) {
            Autodesk.Viewing.Document.load(documentId, onDocumentLoadSuccess, onDocumentLoadFailure)
          }
        })

        Autodesk.Viewing.Initializer(options, function onInitialized() {
          Autodesk.Viewing.Document.load(documentId, onDocumentLoadSuccess, onDocumentLoadFailure)
        })

      } else {
        setError({
          model2: true,
          model1: true,
        })
      }
    }
    const modelItem = _.find(modelList, (item) => item.value === selectedmodel)
  }, [token, selectedmodel, option, props.sceneKey, mode])
  const [imageAsFile, setImageAsFile] = useState([])
  //console.log('imageAsFile', imageAsFile)
  useEffect(() => {
    const result = axios.post(
      'https://developer.api.autodesk.com/authentication/v1/authenticate',
      qs.stringify({
        client_id: 'e9nb6uR1AOoFFY2vRoZspZA7RKRrwqxU',
        client_secret: '5jt07IIPgNjrshWN',
        grant_type: 'client_credentials',
        scope: 'data:read data:write data:create bucket:read bucket:create',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )
    result.then((res) => {
      setToken(res.data)
    })
  }, [mode])

{/* ------------------------------------------------------------------------------- เปิดส่วนของการ สร้างตัวแปรTabs เมนูย่อยต่างๆในหน้าแรก */}
  const useStyles = makeStyles((theme) => ({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  }))
  const Tabs = [
    {
      title: 'Model Bim',
      id: '3d',
    },
    // {
    //   title: 'Shop Drawing',
    //   id: '2d',
    // },
    {
      title: 'S Curve',
      id: 'scurve',
    },
    {
      title: 'เอกสาร',
      id: 'msword',
    },
    {
      title: 'แผนที่',
      id: 'map',
    },
    {
      title: 'ข้อมูลโมเดล',
      id: 'property',
    },
    {
      title: 'ประวัติการเข้าใช้งาน',
      id: 'history',
    },
    {
      title: 'แชท',
      id: 'chat',
    },
  ]
{/* ---------------------------------------------------------------------------------- ปิดส่วนของการ สร้างตัวแปรTabs เมนูย่อยต่างๆในหน้าแรก */}

  const select = _.find(modelList, (item) => item.value === selectedmodel)
  const Text = styled.p`
    font-size: ${(props) => props.size}px;
  `
  const classes = useStyles()
  const modelItem = _.find(modelList, (item) => item.value === selectedmodel)
  //console.log('modelItem', modelItem)

  // var myJSON = '{"name": "Kate", "pet": {"dog": "Corgi", "cat": "Persian"}}';
  // var myObj = JSON.parse(myJSON);
  // var customerName = myObj.pet.dog;
  // console.log("customerName",customerName);

  var axios = require('axios');

  var config = {
    method: 'get',
    url: 'https://api.knowledgecentric.com/api/v1/MJUSA/865234031814675',
    headers: { 
      'Authorization': 'cee6627c4e4dcb170676f1c985035d7a73dea704d2cbd6ad55d6a980e3cb9fe3'
    }
  };
  
  axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
    const customData = JSON.stringify(response.data);
    var myJSON = customData;
    var myObj = JSON.parse(myJSON);
    var customerName = myObj.Data.[0].TMP;
    console.log("customerName",customerName);

    document.getElementById("TMP").innerHTML = customerName;
    // console.log("customData",customData[2]+customData[3]+customData[4]+customData[5]);
  })

  
  .catch(function (error) {
    console.log(error);
  });


  return (

    <div 
      style={{
        padding: 0,
        margin: 0,
      }}
    >
    {/* div กำหนดรูปแบบของหน้าจอ */}

        {/* เปิดเมนู Navbar ชิดซ้ายที่จะทำขึ้นใหม่*/}
        <Navbar
          {...props}
          setMode={(mode) => {
            setMode(mode)
          }}
        />
        {/* ปิดเมนู Navbar ชิดซ้ายที่จะทำขึ้นใหม่*/}

      {/* container คลุมกรอบใหญ่ของหน้าจอ */}
      <Grid container>

        {/* เปิด Header*/}
        <Grid item xs={8} style={{ paddingLeft: "14em" , paddingTop: "1em"}}>
          {/* เปิดส่วนของ SELECT BOX เลือก Model 3D*/}
          {props.sceneKey !== 'issue' ? (
            <Grid container spacing={1}>
              <Grid item xs={5}>
                <InputGrid>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupIconNoRound>
                      <DomainIcon />
                    </InputGroupIconNoRound>
                  </InputGroupAddon>
                  <InputField
                    type="select"
                    onChange={(e) => {
                    //console.log('Model', modelList)
                    //console.log(modelList[e.target.value])
                    try {
                      viewer.finish()
                      viewer2d.finish()
                    } catch (e) {}
                      setModel(modelList[e.target.value].value)
                    }}
                  >
                      {modelList.map((item, index) => (
                        <option key={`model1${index}`} value={index}>
                          {item.name || item.projectName}
                        </option>
                      ))}
                  </InputField>
                </InputGrid>
              </Grid>
              <Grid>{' '}
                <Grid
                  onClick={() => {
                    if (modelItem) {
                      const { file } = modelItem
                      axios
                      .get(file.location, {
                      headers: {
                        Authorization: `Bearer ${token.access_token}`,
                      },
                      })
                      .then((res) => {
                        showloading()
                        FileDownload(res.data, 'model.ifc')
                      })
                    }
                  }}
                >
                {/* Download  Grid ก่อน(ButtonToggle) ปกติจะมีปุ่มชื่อ Download*/}
                </Grid>
              </Grid>
            </Grid>
          ) : (
            ''  )
          }
          {/* ปิดส่วนของ SELECT BOX เลือก Model 3D*/}
        </Grid>

        <Grid item xs={4} style={{paddingTop: "1em"}}>

          {/* เปิดlogo link And Menu rightbar */}
          <Layout id={selectedmodel} />
          {/* ปิดlogo link And Menu rightbar */}

        </Grid>
        {/* ปิด Header*/}

        {/* เปิดlayoutของหน้าจอ เปรียบเป็นpageหลัก*/}
        <Grid item xs={12} style={{ paddingLeft: "13em" }}>
          {/* <Navbar
            {...props}
            setMode={(mode) => {
              setMode(mode)
            }}
          /> */}

          <br/>

            {/* เปิดเมนูย่อย ตัวแปรTabs จัดเรียงค่าเมนูใหม่*/}
              {props.sceneKey === 'repair' || props.sceneKey === 'tools'? (
               ''
              ) : (
                <MenuBar
                  tabs={Tabs}
                  sceneKey={mode}
                  setMode={(mode) => {
                    setMode(mode)
                  }}
                />
              )} 
            {/* ปิดเมนูย่อย ตัวแปรTabs จัดเรียงค่าเมนูใหม่*/}

          

        </Grid>
        {/* ปิดlayoutของหน้าจอ เปรียบเป็นpageหลัก */}

        {/* เปิดหน้าแรกของ Dashboard Model Bim */}
        <Grid container style={{ paddingLeft: "14em" }}>
          {/*  mode === 'scurve' คือการส่ง id scurve ไปเช็คถ้าจริงให้ =12 ไม่จริง =7*/}

          <ModeGrid item marginLeft={5} xs={mode === 'scurve' || mode === 'msword' || mode === 'map' ? 12 : 7} >
            
            {/* ------------------------------------------------------------------------------------------------- ส่วนของ issue (รายงานการแจ้งซ่อม) */}
            {props.sceneKey === 'issue' ? (
              <div>

                {/* -------------------------------------------------------------------------------------------- เกิดขึ้นหลังกดปุ่มแก้ไข ในรายการแจ้งซ่อม*/}
                {/* ------------------------------------------------------------------------------------------- รายงานแจ้งซ่อม ชื่อโครงการ ผู้แจ้ง สถานะ*/}

                <Grid container justify={'space-between'}>
                  <Grid item>
                    <Text size={16}>
                      การแจ้งซ่อมโครงการ {_.get(select, 'name', _.get(select, 'projectName', ''))}
                    </Text>
                  </Grid>
                </Grid>


                <Grid container spacing={1}>
                  <Grid item>
                    <Text size={16}>การแจ้งซ่อมตัวอาคาร</Text>
                  </Grid>

                  <Grid item>
                    <Text size={16}>
                      ผู้แจ้งซ่อม {_.get(seletedIssue, 'user.firstName', '')}{' '}
                      {_.get(seletedIssue, 'user.lastname', '')}
                    </Text>
                  </Grid>

                  <Grid item>
                    <Text size={16}>สถานะ {_.get(seletedIssue, 'status', '')}</Text>
                  </Grid>
                </Grid>
              
              </div>
            ) : (

              // ถ้าไม่มีการกด issue ให้ทำส่วนนี้ ชื่อโครงการ กับจำนวนโครงการทั้งหมด
              <Grid container justify={'space-between'}>
                <Grid item paddingTop={10} >
                  <h3>{' '}</h3>
                  {/* <h3>โครงการ {_.get(select, 'name', _.get(select, 'projectName', ''))}</h3> */}
                  {/* ชื่อโครงการ */}
                </Grid>
                <Grid item>
                  {/* <h3>{_.size(modelList)} โครงการ</h3> */} 
                  {/* จำนวนโครงการ */}
                </Grid>
              </Grid>
            
            )}


            {/* ---------------------------------------------------------------------------------------------- เปิด{3D}ช่องแรกบน Model แปลนรายละเอียด ในแจ้งซ่อม*/}
            <Grid container spacing={2}>
              {props.sceneKey === 'repair' ? (
                <>
                  <Grid item xs={3}>
                    {/* <Input
                      defaultValue={option.model1}
                      type="select"
                      name="select"
                      onChange={(e) => {
                        document.getElementById('MyViewerDiv').innerHTML = ''
                        viewer.finish()
                        viewer = null

                        PushPinExtensionHandle = null
                        viewer2d.finish()
                        viewer2d = null
                        Autodesk.Viewing.shutdown()
                        setOption({ ...option, model1: e.target.value })
                      }}
                    >
                      {plans.map((item, index) => (
                        <option key={`model1${index}`} value={index}>
                          {item.name}
                        </option>
                      ))}
                    </Input>
                  </Grid>
                  <Grid item xs={3}> */}
                    {/* <Input
                      defaultValue={option.model2}
                      type="select"
                      name="select"
                      onChange={(e) => {
                        document.getElementById('my2dView').innerHTML = ''
                        viewer.finish()
                        viewer = null

                        PushPinExtensionHandle = null
                        viewer2d.finish()
                        viewer2d = null
                        Autodesk.Viewing.shutdown()
                        setOption({ ...option, model2: e.target.value })
                      }}
                    >
                      {plans.map((item, index) => (
                        <option key={`model2${index}`} value={index}>
                          {item.name}
                        </option>
                      ))}
                    </Input> */}
                  </Grid>
                </>
              ) : (
                ''
              )}
            </Grid>
            {/* --------------------------------------------------------------------------------------- ปิด{3D}ช่องแรกบน Model แปลนรายละเอียดในแจ้งซ่อม*/}
            

            {/* ---------------------------------------------------------------------------------------------- เปิดส่วนของการ Link เมนูย่อยไปยังแต่ละหน้า */}
            <Grid container>
              {props.sceneKey === 'repair' ? (
                <>
                  {' '}
                  <ViewerGrid item xs={12}>
                    {/* {isError['model1'] ? <Text size={28}>โมเดลยังไม่พร้อมใช้งาน</Text> : ''} */}
                    <div id="loader"></div>
                    <Forge id={'MyViewerDiv'} />
                  </ViewerGrid>
                  <ViewerGrid
                    style={{
                      display: 'none',
                    }}
                    item
                    xs={4}
                  >
                    {/* {isError['model2'] ? <Text size={28}>โมเดลยังไม่พร้อมใช้งาน</Text> : ''} */}
                    <div id="loader"></div>
                    <Forge id={'my2dView'} />
                  </ViewerGrid>
                </>
              ) : mode === '3d' || mode === 'property' ? (
                <ViewerGrid item xs={12}>
                  {/* {isError['model1'] ? <Text size={28}>โมเดลยังไม่พร้อมใช้งาน</Text> : ''} */}
                  <div id="loader"></div>
                  <Forge id={'MyViewerDiv'} />
                </ViewerGrid>
              ) : mode === '2d' ? (
                <ViewerGrid item xs={12}>
                  {/* {isError['model2'] ? <Text size={28}>โมเดลยังไม่พร้อมใช้งาน</Text> : ''} */}
                  <div id="loader"></div>
                  <Forge id={'my2dView'} />
                </ViewerGrid>
              ) : mode === 'scurve' ? (
                <ViewerGrid item xs={12} style={{paddingBottom:"1000px"}}>
                  <h1
                    style={{
                      color: 'red',
                    }}
                  >
                    {/* {modelItem.scx ? '' : 'กรุณาอัพโหลดที่จัดการ โครงการ'} */}
                  </h1>
                  {console.log('modelItem', modelItem)}
                  {console.log('modelscurve',modelItem.sc)}
                  {modelItem.sc ? 
                  <iframe
                    height="1000px"
                    width="100%"
                    src={
                      modelItem.sc
                      // `https://view.officeapps.live.com/op/embed.aspx?src=${_.get(
                      //   modelItem,
                      //   'scurve',
                      //   false
                      // )}` || ''
                    }
                    
                  /> : <h1 style={{color: 'red', marginTop:"5%", marginLeft:"35%"}}>ยังไม่ได้อัพโหลดไฟล์ S Curve</h1> 
                  }
                </ViewerGrid>
              ) : mode === 'msword' ? (
                <ViewerGrid item xs={12} style={{paddingBottom:"1320px"}}>
                  <h1
                    style={{
                      color: 'red',
                    }}
                  >
                    {/* {modelItem?.scurve ? '' : 'กรุณาอัพโหลดที่จัดการ โครงการ'} */}
                  </h1>
                  {console.log('modelItem', modelItem)}
                  {console.log('modelscurve',modelItem.sc)}
                  <iframe
                    height="1300px"
                    width="100%"
                    src={
                      // `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1750.854673565161!2d98.95885657553713!3d18.80595823111733!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30da3a8ee9bb6e57%3A0xc8023eb74708fb5c!2sTrident%20Intelligence%20Service%20co.%2Cltd.!5e1!3m2!1sth!2sth!4v1615280519653!5m2!1sth!2sth"`
                      `https://docs.google.com/document/d/1Jc8ang51NQgTMlcO0IBupRYIX13Bcax0AG37lazNeQw/edit?usp=sharing`
                      // `https://docs.google.com/presentation/d/1zoM-RPy-5PS85cxNW5JJyddMMyCa24VVPEeMXvFiVZc/edit#slide=id.gc6f80d1ff_0_0`
                      // modelItem.sc
                      // `https://view.officeapps.live.com/op/embed.aspx?src=${_.get(
                      //   modelItem,
                      //   'scurve',
                      //   false
                      // )}` || ''
                    }
                  />
                </ViewerGrid>
              ) : mode === 'map' ? (
                <ViewerGrid item xs={12} style={{paddingBottom:"700px"}}>
                  <h1
                    style={{
                      color: 'red',
                    }}
                  >
                    {/* {modelItem?.scurve ? '' : 'กรุณาอัพโหลดที่จัดการ โครงการ'} */}
                  </h1>
                  {console.log('modelItem', modelItem)}
                  {console.log('modelscurve',modelItem.sc)}
                  <iframe
                    height="700px"
                    width="100%"
                    src={
                      `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1750.854673565161!2d98.95885657553713!3d18.80595823111733!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30da3a8ee9bb6e57%3A0xc8023eb74708fb5c!2sTrident%20Intelligence%20Service%20co.%2Cltd.!5e1!3m2!1sth!2sth!4v1615280519653!5m2!1sth!2sth"`
                      // `https://docs.google.com/document/d/1Jc8ang51NQgTMlcO0IBupRYIX13Bcax0AG37lazNeQw/edit?usp=sharing`
                      // `https://docs.google.com/presentation/d/1zoM-RPy-5PS85cxNW5JJyddMMyCa24VVPEeMXvFiVZc/edit#slide=id.gc6f80d1ff_0_0`
                      // modelItem.sc
                      // `https://view.officeapps.live.com/op/embed.aspx?src=${_.get(
                      //   modelItem,
                      //   'scurve',
                      //   false
                      // )}` || ''
                    }
                  />
                </ViewerGrid>
              ) : mode === 'history' ? (
                <AccessHistory id={selectedmodel} />
              ) : mode === 'tools' ? (
                'Test tools'
              ) : (
                <Chat id={selectedmodel} user={user} />
                // กรณีไม่มี mode ไหนเลยจะมาเปิดส่วนนี้
              )}
            </Grid>
            {/* -------------------------------------------------------------------------------- ปิดส่วนของการ Link เมนูย่อยไปยังแต่ละหน้า */}

          </ModeGrid>

          {/* -------------------------------------------------------------------------------- ส่วนของการเรียก Tabs เมนูย่อยต่างๆ ขึ้นมาแสดง*/}

{/* เพิ่มปุ่มทดสอบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบ */}
          {props.sceneKey === 'tools' ? (
            <ModeGrid item xs={4}>
              <Grid item>
                <Grid container align={'center'} justify={'center'}>
                  <ForgetTitle>ทดสอบข้อมูลจาก IoT :  อุณหภูมิ <label id="TMP"></label> องศา</ForgetTitle>
                  {/* {"
                  Info":{"Page":1,"Pages":1},"Data":
                  [{"DID":"865234031814675","TIME":"2021-03-26 03:14:15","LTIME":"2021-03-26 10:14:15","CTIME":"2021-03-26 03:31:12","UTIME":"1017","TMP":"34.85","HUM":"39.37","PRE":"975.93","SENSOR1":"34.85","ACTUATOR1":"1.00","BATT":"3.30","SEQ":"7475",
                  "SC":"6520","FC":"0","STAT":null,"LAT":null,"LON":null,"LCN":null,"CONTROL1":"3.50","CONTROL2":"4.00"}]} */}
                  {/* {console.log('Infoxxx',Info)} */}
                  {/* <text>{Info.DID}</text> */}


                  <Grid
                    container
                    justify={'center'}
                    style={{
                      marginTop: 20,
                    }}
                  >
                    <InputGrid>
                      <NoIconInputField
                        placeholder="ตำแหน่งที่เพิ่ม"
                        type="text"
                        value={repairForm.title}
                        onChange={(e) => {
                          setRepairForm({
                            ...repairForm,
                            title: e.target.value,
                          })
                        }}
                      />
                    </InputGrid>
                  </Grid>
                  <Grid container justify={'center'}>
                    <InputGrid>
                      <NoIconInputField
                        placeholder="รายละเอียด"
                        value={repairForm.description}
                        type="text"
                        onChange={(e) => {
                          setRepairForm({
                            ...repairForm,
                            description: e.target.value,
                          })
                        }}
                      />
                    </InputGrid>
                  </Grid>
                  <h2 style={{paddingTop: '30px'}}>เพิ่มอุปกรณ์</h2>
                  <div style={{ width: '100%' }}>
                    {/* <PriceComponent repairForm={repairForm} setRepairForm={setRepairForm} /> */}
                  </div>

                  <Grid
                    container
                    justify={'center'}
                    style={{
                      marginTop: 20,
                    }}
                  >
                    <InputField
                      type="select"
                      onChange={(e) => {
                        //console.log('Repair Form', repairForm)
                        //console.log('Repair Form', e.target.value)
                        setRepairForm({
                          ...repairForm,
                          priority: e.target.value,
                        })
                      }}
                    >
                      <option value={1}>กล้อง</option>
                      <option value={2}>เซนเซอร์</option>
                      <option value={3}>ประตูอัตโนมัติ</option>
                      <option value={4}>เมนูย่อย1</option>
                      <option value={5}>เมนูย่อย2</option>
                    </InputField>
                  </Grid>
                  <Grid
                    container
                    justify={'center'}
                    style={{
                      marginTop: 20,
                    }}
                  >
                    <input
                      type="file"
                      multiple
                      onChange={(e) => {
                        setRepairForm({ ...repairForm, files: [...e.target.files] })
                      }}
                    />
                  </Grid>
                  <Grid
                    container
                    justify={'center'}
                    style={{
                      marginTop: 20,
                    }}
                  >
                    {_.map(repairForm.files, (image) => {
                      //console.log('image file', image)
                      return <img height={300} src={URL.createObjectURL(image)} />
                    })}
                  </Grid>
                  <Grid
                    container
                    justify={'center'}
                    style={{
                      marginTop: 30,
                    }}
                  >
                    <Grid xs={3}>
                      <FullWidthButton
                        color="warning"
                        type={'submit'}
                        onClick={() => {
                          SetCreating(true)
                          if (_.isEmpty(repairForm.title) && _.isEmpty(repairForm.description)) {
                            notification.error({
                              message: 'กรุณากรอกข้อมูล',
                              description: 'กรุณากรอกรายละเอียด',
                              onClick: () => {
                                //console.log('Notification Clicked!')
                              },
                            })
                          } else {
                            const {
                              title = '',
                              description = '',
                              files = [],
                              priority = 1,
                              price = '',
                            } = repairForm
                            PushPinExtensionHandle.startCreateItem({
                              ...repairForm,
                              label: title,
                              description: description,
                              files: files,
                              priority,
                              price,
                              status: 'open',
                              type: 'issues',
                              isAction: true,
                            })

                            notification.open({
                              message: 'กรุณามาร์คจุดติดอุปกรณ์',
                              description: 'กรุณาคลิกจุดที่ต้องการติดอุปกรณ์',
                              onClick: () => {
                                //console.log('Notification Clicked!')
                              },
                            })
                          }
                          toggleRepareForm(false)
                        }}
                      >
                        ตกลง
                      </FullWidthButton>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>{' '}
            </ModeGrid>


          // -------------------------------------------------------------------------------------------- ส่วนของ issue (รายงานการแจ้งซ่อม)
          ) :('')}
{/* เพิ่มปุ่มทดสอบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบบ */}
          
          {/* ---------------------------------------------------------------------------------------------------- ส่วนของหน้า แจ้งซ่อม */}

          {props.sceneKey === 'repair' ? (
            <ModeGrid item xs={4}>
              <Grid item>
                <Grid container align={'center'} justify={'center'}>
                  <ForgetTitle>มาร์คจุดแจ้งซ่อม​</ForgetTitle>
                  <Grid
                    container
                    justify={'center'}
                    style={{
                      marginTop: 20,
                    }}
                  >
                    <InputGrid>
                      <NoIconInputField
                        placeholder="ตำแหน่งแจ้งซ่อม"
                        type="text"
                        value={repairForm.title}
                        onChange={(e) => {
                          setRepairForm({
                            ...repairForm,
                            title: e.target.value,
                          })
                        }}
                      />
                    </InputGrid>
                  </Grid>
                  <Grid container justify={'center'}>
                    <InputGrid>
                      <NoIconInputField
                        placeholder="รายละเอียด"
                        value={repairForm.description}
                        type="text"
                        onChange={(e) => {
                          setRepairForm({
                            ...repairForm,
                            description: e.target.value,
                          })
                        }}
                      />
                    </InputGrid>
                  </Grid>
                  <h2>ราคาประเมินการซ่อม</h2>
                  <div style={{ width: '100%' }}>
                    <PriceComponent repairForm={repairForm} setRepairForm={setRepairForm} />
                  </div>

                  <Grid
                    container
                    justify={'center'}
                    style={{
                      marginTop: 20,
                    }}
                  >
                    <InputField
                      type="select"
                      onChange={(e) => {
                        //console.log('Repair Form', repairForm)
                        //console.log('Repair Form', e.target.value)
                        setRepairForm({
                          ...repairForm,
                          priority: e.target.value,
                        })
                      }}
                    >
                      <option value={1}>แจ้งซ่อม</option>
                      <option value={2}>ด่วนมาก</option>
                      <option value={3}>ด่วนที่สุด</option>
                    </InputField>
                  </Grid>
                  <Grid
                    container
                    justify={'center'}
                    style={{
                      marginTop: 20,
                    }}
                  >
                    <input
                      type="file"
                      multiple
                      onChange={(e) => {
                        setRepairForm({ ...repairForm, files: [...e.target.files] })
                      }}
                    />
                  </Grid>
                  <Grid
                    container
                    justify={'center'}
                    style={{
                      marginTop: 20,
                    }}
                  >
                    {_.map(repairForm.files, (image) => {
                      //console.log('image file', image)
                      return <img height={300} src={URL.createObjectURL(image)} />
                    })}
                  </Grid>
                  <Grid
                    container
                    justify={'center'}
                    style={{
                      marginTop: 30,
                    }}
                  >
                    <Grid xs={3}>
                      <FullWidthButton
                        color="warning"
                        type={'submit'}
                        onClick={() => {
                          SetCreating(true)
                          if (_.isEmpty(repairForm.title) && _.isEmpty(repairForm.description)) {
                            notification.error({
                              message: 'กรุณากรอกข้อมูล',
                              description: 'กรุณากรอกรายละเอียด',
                              onClick: () => {
                                //console.log('Notification Clicked!')
                              },
                            })
                          } else {
                            const {
                              title = '',
                              description = '',
                              files = [],
                              priority = 1,
                              price = '',
                            } = repairForm
                            PushPinExtensionHandle.startCreateItem({
                              ...repairForm,
                              label: title,
                              description: description,
                              files: files,
                              priority,
                              price,
                              status: 'open',
                              type: 'issues',
                              isAction: true,
                            })

                            notification.open({
                              message: 'กรุณามาร์คจุดแจ้งซ่อม',
                              description: 'กรุณาคลิกจุดที่ต้องการแจ้งซ่อม',
                              onClick: () => {
                                //console.log('Notification Clicked!')
                              },
                            })
                          }
                          toggleRepareForm(false)
                        }}
                      >
                        ตกลง
                      </FullWidthButton>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>{' '}
            </ModeGrid>


          // -------------------------------------------------------------------------------------------- ส่วนของ issue (รายงานการแจ้งซ่อม)
          ) : props.sceneKey === 'issue' ? (
            <ModeGrid marginleft={10} item xs={4}>
              <Grid container spacing={1}>
                <Grid item>
                  <Text size={16}>
                    โครงการ {_.get(select, 'name', _.get(select, 'projectName', ''))}
                  </Text>
                </Grid>
              </Grid>
              <Grid container spacing={1}>
                <Grid item>
                  <Text size={16}>
                    รายละเอียดการแจ้งซ่อม {_.get(seletedIssue, 'description', '')}
                  </Text>
                </Grid>
              </Grid>
              {_.get(seletedIssue, 'images', false) ? (
                <Carousel>
                  {_.map(seletedIssue.images, (image) => {
                    //console.log('Carousel image', image)
                    return (
                      <div align={'center'}>
                        <a href={image}>
                          <img height={300} src={image} />
                        </a>
                      </div>
                    )
                  })}
                </Carousel>
              ) : (
                ''
              )}
            </ModeGrid>


            // ------------------------------------------------------------------------------------------------------------ ส่วนของ ปฎิทิน 
            // ---------------------------------------------------------------------------------- ฟังก์ชั่นนี้ในหน้า scurve กับ property ไม่แสดง
          ) : mode !== 'scurve' && mode !== 'property' && props.sceneKey !== 'tools' && mode !== 'msword' && mode !== 'map'? (
            <>
              <Grid
                style={{
                  marginLeft: 20,
                  height: '100%',
                  marginTop: -10,
                }}
                item
                xs={4}
              >
                {/* ----------------------------------------------------------------------------------------------------------เปิดปฎิทิน*/}
                <ModeGrid container justify={'center'}>
                  
                  <Calendar
                    style={{
                      width: 600,
                    }}
                    tileContent={({ activeStartDate, date, view }) => {
                      const currentDate = moment(date).format('YYYY-MM-DD')
                      return repairList[currentDate] ? (
                        <div>
                          {_.map(repairList[currentDate], (item) => {
                            return (
                              <>
                                -{item.label} <br />
                              </>
                            )
                          })}
                        </div>
                      ) : (
                        <div></div>
                      )
                    }}
                    onChange={(date) => {
                      setDate(date)
                    }}
                    value={date}
                  />
                
                <br />
                <Grid container style={{ paddingTop: "2em" }} justify={'center'}>
                  <ActivityList
                    project={_.find(modelList, (item) => item.value === selectedmodel)}
                    repairList={_.slice(
                      _.filter(allList, (item) => item.date === moment(date).format('YYYY-MM-DD')),
                      0,
                      3
                    )}
                  />
                  </Grid>
                </ModeGrid>
                {/* เอาModeGrid รวมกัน */}
                {/* ----------------------------------------------------------------------------------------------------------ปิดปฎิทิน */}
              </Grid>
            </>
            

            // ------------------------------------------------------------------------------------------------- เปิดส่วนของ เพิ่มข้อมูลโมเดล
          ) : (
            <Grid
              style={{
                marginLeft: 20,
                // height: '100%',
              }}
              item
              xs={4}
            >
              {editForm.isOpen ? (
                <ModeGrid container justify={'center'}>
                  <InputGrid>
                    <FullWidthButton
                      color="primary"
                      type={'submit'}
                      onClick={() => {
                        toggleInsert(true)
                      }}
                    >
                      เพิ่มข้อมูล
                    </FullWidthButton>
                  </InputGrid>
                  <CustomProperty
                    selectedmodel={selectedmodel}
                    data={editForm}
                    edit={setOpenEditForm}
                    toggleInsert={toggleInsert}
                  />
                  <AModal
                    title={`เพิ่มข้อมูล โมเดล ${editForm.data.id}`}
                    visible={isInsert}
                    onOk={() => {
                      if (_.get(editForm, 'isEdit', false)) {
                        firebase
                          .database()
                          .ref(
                            `/modelProperty/${selectedmodel}/properties/${editForm.data.id}/${editForm.editID}`
                          )
                          .set({
                            ...editForm.input,
                            hidden: false,
                          })
                      } else {
                        firebase
                          .database()
                          .ref(
                            `/modelProperty/${selectedmodel}/properties/${editForm.data.id}/${editForm.input.displayName}`
                          )
                          .set({
                            ...editForm.input,
                            hidden: false,
                          })
                      }

                      notification.success({
                        message: 'สำเร็จ',
                        description: 'บันทึกข้อมูลแล้ว',
                        onClick: () => {
                          //console.log('Notification Clicked!')
                        },
                      })
                      //console.log('Edit From', editForm.input)
                      setOpenEditForm({
                        ...editForm,
                        input: {},
                        isEdit: false,
                      })
                      toggleInsert(false)
                    }}
                    onCancel={() => {
                      setOpenEditForm({
                        ...editForm,
                        input: {},
                        isEdit: false,
                      })
                      toggleInsert(false)
                    }}
                  >
                    <Grid
                      container
                      justify={'center'}
                      style={{
                        marginTop: 20,
                      }}
                    >
                      <InputGrid>
                        <Input
                          placeholder="หัวข้อ"
                          value={_.get(editForm, 'input.displayName', '')}
                          type="title"
                          onChange={(e) => {
                            setOpenEditForm({
                              ...editForm,
                              input: {
                                ...editForm.input,
                                displayName: e.target.value,
                              },
                            })
                          }}
                        />
                      </InputGrid>
                    </Grid>
                    <Grid container justify={'center'}>
                      <InputGrid>
                        <Input
                          placeholder="รายละเอียด"
                          value={_.get(editForm, 'input.displayValue', '')}
                          type="title"
                          onChange={(e) => {
                            setOpenEditForm({
                              ...editForm,
                              input: {
                                ...editForm.input,
                                displayValue: e.target.value,
                              },
                            })
                          }}
                        />
                      </InputGrid>
                      <InputGrid>
                        <Input
                          placeholder="หมวดหมู่"
                          value={_.get(editForm, 'input.displayCategory', '')}
                          type="title"
                          onChange={(e) => {
                            setOpenEditForm({
                              ...editForm,
                              input: {
                                ...editForm.input,
                                displayCategory: e.target.value,
                              },
                            })
                          }}
                        />
                      </InputGrid>
                      <InputGrid>
                        <Input
                          placeholder="หน่วย"
                          value={_.get(editForm, 'input.units', '')}
                          type="title"
                          onChange={(e) => {
                            setOpenEditForm({
                              ...editForm,
                              input: {
                                ...editForm.input,
                                units: e.target.value,
                              },
                            })
                          }}
                        />
                      </InputGrid>
                    </Grid>
                  </AModal>
                </ModeGrid>
              ) : (
                ''
              )}
            </Grid>
            // ------------------------------------------------------------------------------------------------- ปิดส่วนของ เพิ่มข้อมูลโมเดล
          
          )}


        </Grid>
        {/* ปิดหน้าแรกของ Dashboard Model Bim */}

        {/* ------------------------------------------------------------- เปิดฟังก์ชั่นแสดงรายการแจ้งซ่อมในหน้า Dashboard ไม่แสดงในหน้า chat กับหน้า property */}
        {mode === 'chat' || mode === 'property' || props.sceneKey === 'tools' || mode === 'msword' || mode === 'map' ? (
          ''
        ) : (
          <>
            <Grid container style={{ paddingLeft: "13em" }}>
              <Grid item xs={7} style={{ paddingTop: "5em" }}>
                <Grid container justify={'space-between'}>
                  <Grid item>
                  <h3>มีการแจ้งซ่อมทั้งหมด {_.size(allList)} รายการ</h3>
                  </Grid>
                  <Grid item>
                  
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            {/* ---------------------------------------------------------------------------------------------------- ส่วนของ issue (รายงานการแจ้งซ่อม) */}
            {/* --------------------------------------------------------------------------------- เปิดส่วนของ issue (รายงานการแจ้งซ่อมอาคาร ช่องtextbox) */}
            {props.sceneKey === 'issue' ? (
              <Grid container style={{ paddingLeft: "13em" , marginBottom: "1em"}}>
                <ModeGrid xs={7}>
                  <Grid item>
                    <Grid container align={'center'}>
                      <ForgetTitle>แจ้งซ่อมตัวอาคาร</ForgetTitle>
                      {_.get(seletedIssue, 'repairData', false) ? (
                        <Grid container justify={'space-between'}>
                          <Text size={16}>
                            รายละเอียดการแจ้งซ่อม {_.get(seletedIssue, 'repairData.description', false)}
                          </Text>
                          <div
                            item
                            style={{
                              height: '50%',
                              width: '50%',
                            }}
                          >
                            {_.get(seletedIssue, 'repairData.images', false) ? (
                              <Carousel>
                                {_.map(seletedIssue.repairData.images, (image) => {
                                  return (
                                    <div align={'center'}>
                                      <a href={image}>
                                        <img height={300} src={image} />
                                      </a>
                                    </div>
                                  )
                                })}
                              </Carousel>
                            ) : (
                              ''
                            )}
                          </div>
                        </Grid>
                      ) : (
                        ''
                      )}
                      <>
                        <Grid
                          container
                          justify={'center'}
                          style={{
                            marginTop: 20,
                          }}
                        >
                          <InputGrid>
                            <Input
                              placeholder="รายละเอียด"
                              value={repairForm.description}
                              type="textarea"
                              onChange={(e) => {
                                setRepairForm({
                                  ...repairForm,
                                  description: e.target.value,
                                })
                              }}
                            />
                          </InputGrid>
                        </Grid>
                        <Grid
                          container
                          justify={'center'}
                          style={{
                            marginTop: 20,
                          }}
                        >
                          <input
                            type="file"
                            multiple
                            onChange={(e) => {
                              setRepairForm({ ...repairForm, files: [...e.target.files] })
                            }}
                          />
                        </Grid>
                        
                        <Grid
                          container
                          justify={'center'}
                          style={{
                            marginTop: 30,
                          }}
                        >
                          <Grid xs={3}>
                            <FullWidthButton
                              color="warning"
                              type={'submit'}
                              onClick={() => {
                                showloading()
                                const issueRef = firebase
                                  .database()
                                  .ref(
                                    `/model/${seletedIssue.selectedmodel}/${seletedIssue.modelNumber}/${seletedIssue.date}/${seletedIssue.keyid}/repairData`
                                  )
                                issueRef
                                  .set({
                                    ...repairForm,
                                    updateBy: user,
                                    updated_at: moment().format('YYYY-MM-DD'),
                                  })
                                  .then((snap) => {
                                    firebase
                                      .database()
                                      .ref(
                                        `/model/${seletedIssue.selectedmodel}/${seletedIssue.modelNumber}/${seletedIssue.date}/${seletedIssue.keyid}/status`
                                      )
                                      .set('updated')
                                  })
                                let imageCount = 0
                                _.forEach(repairForm.files, (item) => {
                                  const uploadTask = firebase
                                    .storage()
                                    .ref(`/images/${seletedIssue.keyid}/${item.name}`)
                                    .put(item)
                                  uploadTask.on(
                                    'state_changed',
                                    (snapshot) => {
                                      // progress function ...
                                      const progress = Math.round(
                                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                                      )
                                      //console.log('Progress', progress)
                                    },
                                    (error) => {
                                      // Error function ...
                                      //console.log(error)
                                    },
                                    () => {
                                      imageCount++
                                      // complete function ...
                                      firebase
                                        .storage()
                                        .ref(`/images/${seletedIssue.keyid}`)
                                        .child(item.name)
                                        .getDownloadURL()
                                        .then((url) => {
                                          firebase
                                            .database()
                                            .ref(
                                              `/model/${seletedIssue.selectedmodel}/${seletedIssue.modelNumber}/${seletedIssue.date}/${seletedIssue.keyid}/repairData/images`
                                            )
                                            .push(url)
                                            .then(() => {
                                              if (imageCount === _.size(repairForm.files)) {
                                                hideloading()
                                              }
                                            })
                                        })
                                    }
                                  )
                                })
                              }}
                            >
                              ตกลง
                            </FullWidthButton>
                          </Grid>
                        </Grid>
                      </>
                    </Grid>
                  </Grid>{' '}
                </ModeGrid>
              </Grid>
              // --------------------------------------------------------------------- ปิดส่วนของ issue (รายงานการแจ้งซ่อมอาคาร ช่องtextbox) 
            ) : (
              ''
            )}
            {/* -------------------------------------------------------------------------------------- เปิดส่วนของการแสดงรายการแจ้งซ่อม */}
            <ModeGrid xs={12} style={{ paddingLeft: "14em" }}>
              <RepairTable
                setList={setAllList}
                select={select}
                repairList={allList}
                setIssue={(issue) => {
                  props.history.push(`/issue/${issue.keyid}/${issue.selectedmodel}/`)
                }}
              />
            </ModeGrid>
            {/* -------------------------------------------------------------------------------------- ปิดส่วนของการแสดงรายการแจ้งซ่อม */}
          </>
        )}
        {/* ปิดฟังก์ชั่นแสดงรายการแจ้งซ่อมในหน้า Dashboard */}

      </Grid>
      {/* ปิดcontainer คลุมกรอบใหญ่ของหน้าจอ */}

      {/* <MenuBar
        {...props}
        setMode={(mode) => {
          setMode(mode)
        }}
      />
      เมนูหลัก เปลี่ยนหน้า */}
      
    </div>
  )
}

export default Home;