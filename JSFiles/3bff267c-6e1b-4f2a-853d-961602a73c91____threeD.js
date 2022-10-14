const markCirle={
    template:`<div style="position: absolute;z-index:2;cursor:pointer;border-radius: 50%;width: 24px;height: 24px" :style="markstyle">
                <!-- <div class="modelTooltip" :style='{"border":"2px solid " + markstyle.color,"background-color":markstyle.color+"4d"}'></div> -->
                <img :src="item|color2img" />
              </div>`,
    props:['markstyle','item'],
    filters:{
        color2img(value){
            if(value.eventType=='1'){
                return "/static/img/zi.gif" //维保蓝色
            }else if(value.eventType=='2'){
                return "/static/img/huang.gif" //维保黄色
            }else{
                return "/static/img/hong.gif"  //维保红色
            }
            
        }

    },
}
var util={}
util.ajax = axios.create({
    // baseURL: ajaxUrl,
    timeout: 30000,
    headers: { 'X-CSRFToken': Cookies.get('csrftoken') }
});
util.CancelToken =axios.CancelToken;

const threeD = { 
    components:{
        markCirle,
        // cameraMark,
        // alarmMark,
        // modelopt,
        // addPlan,
        // dialogs,
        // xungengDdMark,
        // elevatorDialog,
        // liquid,
        // peopleTrace,
        // elevatorlengend,
        // temLegend,
        // xungengdialogs,
        // elevatorMark
    },
    template:`<div ref="viewer" @mouseout='mouseout' style="width:80vw;height:80vh">

            <markCirle  v-for='item in marklist' :markstyle='item.style' :item='item' @click.native="showMark(item)" :title='item.showinfo'></markCirle>
            <div ref='ttip' style="margin: auto;padding: 12px;height:auto;width:auto;pointer-events:none;position: absolute;z-index: 10;;color: white;background:url(/static/image/bg.png);background-repeat: round;background-size: cover" :style="ttipStyle" v-html="ttipTxt"></div>
        </div>`,
    data () {
        return {
            viewer:'',
            timer:null,
            ExtensionList:['CameraTween','CustomEvent'],
            urltype1:null,
            urlid:null,
            modelurlid:'',
            elevatorobj:{},
            plist:[],
            ttipStyle:{
                display:'block',
                left:0,
                top:0,
            },
            ttipTxt:'',
            marklist:[],

            source:false,
            selectObj:{id:''},//当前选中的无物体
            firstmodel:null,
            showAdd:false,
            showDialogs:false,
            showDialogs1:false,
            // repair:'repair',
            qiu:null,
            juli:60,//设置探头距离内的摄像机显示
            // peopleTrace:[],
            wenduDinshi:null,//温度定时器
            CameraSrc:'',
            showcameras:[],
            lunbo:9999,
            bodySrc:'',
            elevatorFloor:[],
        };
    },
    props:{
            // 'marklist':Array,
            'select':{
                type:Function,
                default(){
                    return function(){};
                }
            },
            // 'addEvent':{
            //     //发起报修
            //     type:Function,
            //     default(){
            //         return function(){};
            //     }
            // },
            // 'addEventTask':{
            //     //发起维保计划
            //     type:Function,
            //     default(){
            //         return function(){};
            //     }
            // }
        },
        methods: {
            getScreenShot() {
                let vm = this;
                var pro = new Promise((resolve)=>{

                    vm.viewer.getScreenShot(document.body.offsetWidth, document.body.offsetHeight, function (newBlobURL) {
                        resolve(newBlobURL)
                        // var xhr = new XMLHttpRequest();
                        // xhr.responseType = 'blob';
                        // xhr.onload = function () {
                        //     if (this.status === 200) {
                        //         var myBlob = this.response;
                        //         var data = new FormData();
                        //         myBlob.filename = "blob.png";
                        //         data.append('file', myBlob);
                        //         $.ajax({
                        //             url: "/file/upload/",
                        //             type: 'POST',
                        //             async: false,
                        //             data: data,
                        //             contentType: false,peopleTrace
                        //             processData: false,
                        //         }).done((t, n) => {
                        //             console.log(t, n);
                        //             vm.screenShotAndCloud.push({
                        //                 name: t.data.docname,
                        //                 url: t.data.fileurl,
                        //                 response: {
                        //                     data: {
                        //                         image: 1,
                        //                         docpath: t.data.fileurl,
                        //                         docId: t.data.docId
                        //                     }
                        //                 }
                        //             })
                        //         })
                        //     }
                        // };
                        // xhr.open('GET', newBlobURL, true);
                        // xhr.send();
                    })
                })
                return pro

            },
            showMark(item){
                this.bestShow(item.modeldbid);
                this.showDialogs = true;
                if(item.dbinfo.level!=undefined){
                    this.splitModelByFoolLevel(item.dbinfo.level);
                }
                if(this.urltype1=='camera'){

                }
                else{
                    // util.eventBus.$emit('markClick',item);
                }
            },
            cameraMarkClick(item, type){
                if(type=="camera"){
                    this.viewer.select(Number(item.modeldbid));
                    this.showDialogs=false;
                }else{
                    util.ajax({
                        url:item.camera
                    }).then(({data})=>{
                        this.bestShow(Number(item.modeldbid));
                        this.showDialogs=true;
                        this.CameraSrc = '/mag'+data.addr.split('mag')[1];
                        this.bodySrc = item.snap;
                    });
                }
            },
            alarmMarkClick(item){
                this.viewer.select(Number(item.modeldbid));
                this.addqiutoview(Number(item.modeldbid),'#ff00ff');
            },
            posMarkClick(item){
                const self =  this;
                this.showDialogs1 = true;
                this.viewer.isolate(-1);//修改
                this.addqiutoview(Number(item.modeldbid),'#ff00ff');
                this.showcameras = [];
                for (var i in self.cameras) {
                    self.distance(item.modeldbid, self.cameras[i].modeldbid,(b)=>{
                        if(b){
                            self.showcameras.push(self.cameras[i]);
                        }
                    })
                }
                // util.eventBus.$emit("xungengCameras", self.showcameras);
            },
            worldToClient(obj){
                var self=this;
                if(!self.firstmodel||!self.firstmodel.getData()||!self.firstmodel.getData().instanceTree){
                    setTimeout(()=>{
                        self.worldToClient(obj);
                    },1000);
                } else {
                    var it = self.firstmodel.getData().instanceTree;
                    it.enumNodeFragments(obj.modeldbid,(fragId,dbid)=>{
                        var nodebBox = new THREE.Box3();
                        var fragbBox = new THREE.Box3();
                        var fragList = self.firstmodel.getFragmentList();
                        fragList.getWorldBounds(fragId, fragbBox);
                        nodebBox.union(fragbBox);
                        var center = nodebBox.center();
                        var cp = self.viewer.getCutPlanes()
                        if(cp.length>0&&center.z>cp[0].w*-1){
                            obj.style.display='none';
                        }else{
                            var c = self.viewer.impl.worldToClient(center);
                            obj.style.left =c.x+'px';
                            obj.style.top=c.y+'px';
                            obj.style.display='block';
                        }


                    },true);
                }
            },
            mouseout() {
                this.ttipStyle.display='none';
            },
            markByModelurlid(){
                this.marklist = [];
                this.source&&this.source.cancel('取消上个请求')
                this.source = util.CancelToken.source()

                var markajlist = [
                    util.ajax.get(`/device/sensor/?pagesize=50&laststation=1&modelurlid=${this.modelurlid}`,{cancelToken: this.source.token}),
                    util.ajax.get(`/repair/rest/projecteventelement/?event__eventtype=1&event__status__in=1,2,3&pagesize=50&modelurlid=${this.modelurlid}`,{cancelToken: this.source.token}),
                    util.ajax.get(`/repair/rest/projecteventelement/?event__eventtype=2&event__status__in=1,2,3&pagesize=50&modelurlid=${this.modelurlid}`,{cancelToken: this.source.token})
                ]
                Promise.all(markajlist).then(res=>{
                    // this.repair='repair';
                    res[0].data.results.forEach(t=>{
                        t.showinfo = t.deviceobj.spacestrf+' '+t.description;
                    });
                    for(var i in res){
                        var data = res[i].data;
                        for(var i in data.results){
                            data.results[i].style=data.results[i].color?{left:'0px',top:'0px',display:'none',color:data.results[i].color}:{left:'0px',top:'0px',display:'none',color:"#f10c0c"}
                            try{
                                data.results[i].modeldbid = Number(data.results[i].dbinfo.dbid)
                                this.marklist.push(data.results[i]);
                            }
                            catch (e){
                            }

                        }
                    }
                    this.updateMarkData()
                })

            },


            modelChange(urltype1,urlid){
                var self=this;
                if(self.urltype1=='space'){
                    if(self.$route.path=='/indoorenvironment/'){
                        self.changeColorByWendu()
                    }else{
                        
                        self.changeColor('department')
                    }
                    
                }
                if(this.urltype1==urltype1 && this.urlid==urlid){
                    //debugger
                    return false
                }
                this.urltype1 = urltype1;
                this.urlid = urlid;
                if(urltype1!="camera"){
                    this.markByModelurlid()
                }
                

                this.cameras=[];
                this.alarms=[];
                return true

            },
            tweenCameraTo(state, immediate,viewer) {
                //内部方法
                targetTweenDuration = 2500;
                posTweenDuration = 2500;
                upTweenDuration = 2500;

                targetTweenEasing = {
                    id: TWEEN.Easing.Linear.None,
                    name: 'Linear'
                };
                posTweenEasing = {
                    id: TWEEN.Easing.Linear.None,
                    name: 'Linear'
                };
                upTweenEasing = {
                    id: TWEEN.Easing.Linear.None,
                    name: 'Linear'
                };

                const targetEnd = new THREE.Vector3(
                    state.viewport.target[0],
                    state.viewport.target[1],
                    state.viewport.target[2])

                const posEnd = new THREE.Vector3(
                    state.viewport.eye[0],
                    state.viewport.eye[1],
                    state.viewport.eye[2])

                const upEnd = new THREE.Vector3(
                    state.viewport.up[0],
                    state.viewport.up[1],
                    state.viewport.up[2])

                const nav = viewer.navigation

                const target = new THREE.Vector3().copy(
                    nav.getTarget())

                const pos = new THREE.Vector3().copy(
                    nav.getPosition())

                const up = new THREE.Vector3().copy(
                    nav.getCameraUpVector())


                const targetTween = createTween({
                    easing: targetTweenEasing.id,
                    onUpdate: (v) => {
                        nav.setTarget(v)
                    },
                    duration: immediate ? 0 : targetTweenDuration,
                    object: target,
                    to: targetEnd
                })

                const posTween = createTween({
                    easing: posTweenEasing.id,
                    onUpdate: (v) => {
                        nav.setPosition(v)
                    },
                    duration: immediate ? 0 : posTweenDuration,
                    object: pos,
                    to: posEnd
                })

                const upTween = createTween({
                    easing: upTweenEasing.id,
                    onUpdate: (v) => {
                        nav.setCameraUpVector(v)
                    },
                    duration: immediate ? 0 : upTweenDuration,
                    object: up,
                    to: upEnd
                })

                Promise.all([
                    targetTween,
                    posTween,
                    upTween
                ]).then(() => {

                    animate = false
                    // _viewer.restoreState(state)
                })

                runAnimation(true)
            },
            CustomTool(){
                var self=this;
                AutodeskNamespace("Autodesk.ADN.Viewing.Extension");

                Autodesk.ADN.Viewing.Extension.CustomEvent =

                    function(viewer, options) {

                        Autodesk.Viewing.Extension.call(this, viewer, options);

                        var _self = this;
                        var _btnDownEvent = null;
                        var _btnMoveEventLast = null;
                        var oldDbId;
                        // var ttip;
                        _self.tool = null;

                        function AdnTool(viewer, toolName) {

                            this.getNames = function() {

                                return [toolName];
                            };

                            this.getName = function() {

                                return toolName;
                            };

                            this.activate = function(name) {

                                console.log('-------------------');
                                console.log('Tool:activate(name)');
                                console.log(name);
                            };

                            this.deactivate = function(name) {

                                console.log('-------------------');
                                console.log('Tool:deactivate(name)');
                                console.log(name);
                            };

                            this.update = function(t) {

                                //console.log('-------------------');
                                //console.log('Tool:update(t)');
                                //console.log(t);

                                return false;
                            };

                            this.handleSingleClick = function(event, button) {

                                console.log('-------------------');
                                console.log('Tool:handleSingleClick(event, button)');
                                // onSelectedCallback(event)
                                // //debugger
                                // _app.show=
                                return false;
                            };

                            this.handleDoubleClick = function(event, button) {

                                console.log('-------------------');
                                console.log('Tool:handleDoubleClick(event, button)');
                                console.log(event);
                                console.log(button);

                                return false;
                            };


                            this.handleSingleTap = function(event) {

                                console.log('-------------------');
                                console.log('Tool:handleSingleTap(event)');
                                console.log(event);

                                return false;
                            };


                            this.handleDoubleTap = function(event) {

                                console.log('-------------------');
                                console.log('Tool:handleDoubleTap(event)');
                                console.log(event);

                                return false;
                            };


                            this.handleKeyDown = function(event, keyCode) {

                                console.log('-------------------');
                                console.log('Tool:handleKeyDown(event, keyCode)');
                                console.log(event);
                                console.log(keyCode);

                                return false;
                            };

                            this.handleKeyUp = function(event, keyCode) {

                                console.log('-------------------');
                                console.log('Tool:handleKeyUp(event, keyCode)');
                                console.log(event);
                                console.log(keyCode);

                                return false;
                            };


                            this.handleWheelInput = function(delta) {

                                console.log('-------------------');
                                console.log('Tool:handleWheelInput(delta)');
                                console.log(delta);

                                return false;
                            };

                            this.handleButtonDown = function(event, button) {

                                //          console.log('-------------------');
                                //          console.log('Tool:handleButtonDown(event, button)');
                                //          console.log(event);
                                //          console.log(button);


                                return false;
                            };

                            this.handleButtonUp = function(event, button) {

                                //          console.log('-------------------');
                                //          console.log('Tool:handleButtonUp(event, button)');
                                //          console.log(event);
                                //          console.log(button);
                                _btnDownEvent = null;
                                //          var cam  = viewer.getCamera();
                                //          console.log(cam.matrix.elements[10]);
                                //          if(cam.matrix.elements[10]<=0||cam.matrix.elements[10]>=0.707){
                                //              return true;
                                //          }

                                return false;
                            };
                            _self.obj='';
                            _self.obj1='';
                            this.mouseover = function(event) {

                                console.log('-------------------');
                                console.log('Tool:mouseover(event)');
                                console.log(event);

                                return false;
                            };
                            this.handleMouseMove = function(event, button) {
                                const result = viewer.impl.hitTest(event.canvasX, event.canvasY, false);
                                if (result) {


                                    const dbId = result.dbId;
                                    self.ttipStyle.left =  event.clientX + 8 + 'px';
                                    self.ttipStyle.top = event.clientY + 8 + 'px';

                                    if (oldDbId == dbId) {
                                        return false
                                    } else {
                                        oldDbId = dbId;
                                        var url;
                                        var title = '';

                                        if (self.urltype1 == 'yuanqu') {
                                            _self.obj&&_self.obj.source.cancel('取消上个请求')
                                            _self.obj = self.getFloor(dbId)
                                            // _self.obj.then( r => {
                                            //     var res = r.data;
                                            //     if (res.length > 0) {
                                            //         var txt = `${title}${res[0].deviceorspace}`;
                                            //         self.ttipStyle.display = 'block';
                                            //         self.ttipTxt = txt;
                                            //     } else {
                                            //         self.ttipStyle.display = 'none';
                                            //     }
                                            // })

                                            _self.obj.then(res=>{
                                                if(res.data.length>0){
                                                    var flooraj = util.ajax.get(`${res.data[0].floor}today/`)
                                                    flooraj.then(r=>{
                                                        var today  = r.data
                                                        self.ttipStyle.display = 'block';
                                                        self.ttipTxt = `当日未关闭报修${today.wx}条<br />
                                                                当日未关闭维保${today.wx}条<br />
                                                                当日报警${today.yj}条<br />
                                                                当日用电${today.dian}度<br />
                                                                当日用水${today.shui}吨`;
                                                    })
                                                }

                                            })
                                        } else if (self.urltype1 == 'space') {

                                            _self.obj&&_self.obj.source.cancel('取消上个请求')
                                            _self.obj = self.getRoom(dbId)
                                            _self.obj.then(r => {
                                                var res = r.data;
                                                if (res.results.length > 0) {
                                                    self.ttipStyle.display = 'block';
                                                    self.ttipTxt = res.results[0].number + '-' + res.results[0].Name;
                                                } else {
                                                    self.ttipStyle.display = 'none';
                                                }

                                            })
                                            _self.obj1&&_self.obj1.source.cancel('取消上个请求')
                                            _self.obj1 = self.getFloor(dbId)
                                            _self.obj1.then(res=>{
                                                if(res.data.length>0){
                                                    var flooraj = util.ajax.get(`${res.data[0].floor}today/`)
                                                    flooraj.then(r=>{
                                                        var today  = r.data
                                                        self.ttipStyle.display = 'block';
                                                        self.ttipTxt = `当日未关闭报修${today.wx}条<br />
                                                                当日未关闭维保${today.wx}条<br />
                                                                当日报警${today.yj}条<br />
                                                                当日用电${today.dian}度<br />
                                                                当日用水${today.shui}吨`;
                                                    })
                                                }

                                            })
                                        } else if (self.urltype1 == 'camera') {
                                            _self.obj&&_self.obj.source.cancel('取消上个请求')
                                            _self.obj = self.getCamera(dbId)
                                            _self.obj.then(r => {
                                                var res =r.data.results;
                                                if (res.length > 0) {
                                                    let a = res[0];
                                                    var txt = `${title}${a.name}`;
                                                    self.ttipStyle.display = 'block';
                                                    self.ttipTxt =txt;
                                                } else {
                                                    self.ttipStyle.display = 'none';
                                                }
                                            })

                                        }else if(self.urltype1 == 'mepsystemtype' && self.urlid==14) {
                                            _self.obj&&_self.obj.source.cancel('取消上个请求')
                                            _self.obj = self.getDianti(dbId)
                                            _self.obj.then(r => {
                                                var res =r.data.results;
                                                if (res.length > 0) {
                                                    let a = res[0];
                                                    var txt = `${title}${a.devicetypen + a.code}`;
                                                    self.ttipStyle.display = 'block';
                                                    self.ttipTxt =txt;
                                                } else {
                                                    self.ttipStyle.display = 'none';
                                                }
                                            })

                                        }else {
                                            _self.obj&&_self.obj.source.cancel('取消上个请求')
                                            _self.obj = self.getDevice(dbId)
                                            _self.obj.then(r => {
                                                var res =r.data.results;
                                                if (res.length > 0) {
                                                    let a = res[0];
                                                    var txt = `${title}${a.devicetypen + a.code}`;
                                                    self.ttipStyle.display = 'block';
                                                    self.ttipTxt =txt;
                                                } else {
                                                    self.ttipStyle.display = 'none';
                                                }
                                            })

                                        }

                                    }
                                } else {
                                    oldDbId = null
                                    self.ttipStyle.display = 'none';
                                }
                                return false;
                            };


                            this.handleGesture = function(event) {

                                console.log('-------------------');
                                console.log('Tool:handleGesture(event)');
                                console.log(event);

                                return false;
                            };

                            this.handleBlur = function(event) {

                                console.log('-------------------');
                                console.log('Tool:handleBlur(event)');
                                console.log(event);

                                return false;
                            };

                            this.handleResize = function() {

                                console.log('-------------------');
                                console.log('Tool:handleResize()');
                            };
                        }

                        var toolName = "Autodesk.ADN.Viewing.Tool.CustomEvent";

                        _self.load = function() {

                            _self.tool = new AdnTool(viewer, toolName);

                            viewer.toolController.registerTool(_self.tool);

                            viewer.toolController.activateTool(toolName);
                            // AddMarkerPingMian('red',ttip)
                            // ttip = $("#toolTip-span")
                            console.log('Autodesk.ADN.Viewing.Extension.CustomEvent loaded');
                            return true;
                        };

                        _self.unload = function() {
                            self.ttipStyle.display = 'none';
                            viewer.toolController.deactivateTool(toolName);

                            console.log('Autodesk.ADN.Viewing.Extension.CustomEvent unloaded');
                            return true;
                        };
                    };

                Autodesk.ADN.Viewing.Extension.CustomEvent.prototype =
                    Object.create(Autodesk.Viewing.Extension.prototype);

                Autodesk.ADN.Viewing.Extension.CustomEvent.prototype.constructor =
                    Autodesk.ADN.Viewing.Extension.CustomEvent;

                Autodesk.Viewing.theExtensionManager.registerExtension(
                    'Autodesk.ADN.Viewing.Extension.CustomEvent',
                    Autodesk.ADN.Viewing.Extension.CustomEvent);

            },

            loadInitialModel (url,callback) {
                        var options = {};
                        options.env = "Local";
                        options.document = url;
                        Autodesk.Viewing.Initializer(options, ()=>{
                            this.loadDocument(options.document,callback); // load first entry by default
                        });

            },
            loadDocument(urnStr, callback, nexturl=''){

                const  modelOpts = {
                    placementTransform: new THREE.Matrix4(),
                    globalOffset: { x: 0, y: 0, z: 0 }
                };
                if(this.wenduDinshi){
                    window.clearInterval(this.wenduDinshi);
                }
                var self=this;
                if(!this.viewer){
                    this.viewer = new Autodesk.Viewing.Private.GuiViewer3D(this.$refs.viewer, {});
                    window._viewer = this.viewer;
                    this.viewer.initialize();
                    this.viewer.loadModel(urnStr,modelOpts,()=>{
                        if(nexturl){
                            this.viewer.loadModel(nexturl,modelOpts,()=>{
                                if(this.urltype1==='mepsystemtype' && this.urlid===16){
                                    // var s = this.viewer.impl.modelQueue().getModels()[1]
                                    // s.setVisibility(1, !1)
                                    // this.hideSenconModel(1,true)
                                    //debugger
                                }
                            });
                        }
                        if(self.urltype1==='space'){
                            if(self.$route.path==='/indoorenvironment/'){
                                self.changeColorByWendu();
                            }else{
                                self.changeColor('department');
                            }
                        }
                        this.addSelectCallback(this.selectcallback);
                    });
                }else{
                    this.remove3DTxt();
                    this.viewer.tearDown();
                    this.viewer.setUp(this.viewer.config);
                    this.viewer.loadModel(urnStr,modelOpts,()=>{
                        if(nexturl){
                            this.viewer.loadModel(nexturl,modelOpts,()=>{
                                if(this.urltype1==='mepsystemtype' && this.urlid===16){
                                }
                            });
                        }
                        if(self.urltype1==='space'){
                            if(self.$route.path==='/indoorenvironment/'){
                                self.changeColorByWendu();
                            }else{
                                self.changeColor('department');
                            }
                        }
                    });
                }
                this.viewer.setGhosting(true);
                self.CustomTool();
                for(var i in this.ExtensionList){
                    // this.viewer.unloadExtension(`Autodesk.ADN.Viewing.Extension.${ExtensionList[i]}`);
                    this.viewer.loadExtension(`Autodesk.ADN.Viewing.Extension.${this.ExtensionList[i]}`);
                }
                this.viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, function cb() {
                    try{
                        callback();
                    }catch (e){

                    }
                    self.firstmodel = self.viewer.impl.modelQueue().getModels()[0];
                    self.bestYuanQuShow();
                    self.viewer.removeEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT,cb);
                    self.updateMarkData();
                });
                this.bestYuanQuShow();
                this.setContextMenu();
                //红圈标记
                this.viewer.addEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, this.updateMarkData);
            },

            selectcallback(event){
                //模型加载完成回调
                if (event.selections.length>0 && event.selections[0].dbIdArray.length == 1) {
                    this._selectedId = event.selections[0].dbIdArray[0];
                    this.getObject(this.select, this._selectedId);
                } else{
                    this._selectedId=null;
                }
                if(this.selectObj.id===''){
                    this.showDialogs=false;
                }

            },
            distance(dbid1,dbid2,callback){
                var it = this.firstmodel.getData().instanceTree;
                var center1;
                var center2;
                it.enumNodeFragments(dbid1,fragId=>{
                    var nodeBoundingBox = this.getModifiedWorldBoundingBox([fragId]);
                    // nodeBoundingBoxObj[dbid1]=nodeBoundingBox;
                    center1 = nodeBoundingBox.center();
                },true)
                it.enumNodeFragments(dbid2,fragId=>{
                    var nodeBoundingBox = this.getModifiedWorldBoundingBox([fragId]);
                    // nodeBoundingBoxObj[dbid2]=nodeBoundingBox;
                    center2 = nodeBoundingBox.center();
                },true)

                if(center1.distanceTo(center2)>this.juli/2){
                    // if(center1.distanceTo(center2)>10000){
                    callback(false)
                }else{
                    callback(true)
                }

            },
            addqiutoview(selectdbid,color){
                //debugger
                var self=this;
                var it = this.firstmodel.getData().instanceTree;
                it.enumNodeFragments(selectdbid,fragId=>{
                    var nodeBoundingBox = this.getModifiedWorldBoundingBox([fragId]);
                    // nodeBoundingBoxObj[selectdbid]=nodeBoundingBox;
                    var center = nodeBoundingBox.center();
                    var material= new THREE.MeshBasicMaterial ( {color: color,wireframe:true,vertexColors:"red"} );
                    var geometry_sphere = new THREE.CubeGeometry(self.juli,self.juli,20);
                    geometry_sphere.applyMatrix( new THREE.Matrix4().makeTranslation( center.x, center.y, center.z ) );
                    if(self.qiu){
                        self.viewer.impl.scene.remove(self.qiu);
                    }
                    var _currentShape = new THREE.Mesh( geometry_sphere, material );
                    self.qiu = _currentShape;
                    self.viewer.impl.scene.add(_currentShape);
                    self.viewer.impl.invalidate(true) ;
                },true)
            },
            removeqiu(){
                var self = this;
                if(self.qiu){
                    self.viewer.impl.scene.remove(self.qiu);
                }
            },
            getObject(callback,dbid=''){
                var self = this;
                if(dbid){
                    self._selectedId = dbid;
                }
                // 根据模型不同那个判断选择的是什么东西
                
            },
            _getColorByStr(strColor) {
                var color = null;
                if(strColor != undefined && strColor.length == 7) {
                    var r = (parseFloat(parseInt(strColor.substr(1, 2), 16) / 255).toFixed(2));
                    var g = (parseFloat(parseInt(strColor.substr(3, 2), 16) / 255).toFixed(2));
                    var b = (parseFloat(parseInt(strColor.substr(5, 2), 16) / 255).toFixed(2));

                    color = new THREE.Vector4(r, g, b, 0.5); // r, g, b, intensity
                }
                return color;
            },
            setContextMenu() {
                var self=this;
                Autodesk.ADN.Viewing.Extension.AdnContextMenu = function(viewer) {
                    Autodesk.Viewing.Extensions.ViewerObjectContextMenu.call(this, viewer);
                };

                Autodesk.ADN.Viewing.Extension.AdnContextMenu.prototype =
                    Object.create(Autodesk.Viewing.Extensions.ViewerObjectContextMenu.prototype);

                Autodesk.ADN.Viewing.Extension.AdnContextMenu.prototype.constructor =
                    Autodesk.ADN.Viewing.Extension.AdnContextMenu;

                Autodesk.ADN.Viewing.Extension.AdnContextMenu.prototype.buildMenu =
                    function(event, status) {
                        var menu = Autodesk.Viewing.Extensions.ViewerObjectContextMenu.prototype.buildMenu.call(
                            this, event, status);
                        if(self._selectedId) {
                            // menu.push({
                            //     title: "关联本地文件",
                            //     target: function() {
                            //         self.addLocalFile()
                            //     }
                            // });

                        }
                        return menu;
                    };

                self.viewer.setContextMenu(new Autodesk.ADN.Viewing.Extension.AdnContextMenu(self.viewer));

            },
            tikuai(){
                var self = this;
                if(this.urltype1=='space'){
                    util.ajax.get('/prj/facility/1/').then(r=>{
                        var res =r.data;
                        self.viewer.hide(1);
                        self.viewer.show(res.roomdbid)
                    })
                }else{
                    this.$Message.info('请先切换到空间模型');
                }

            },
            changeColor(v){
                //v = 'department'  'category'
                // 按照部门 或者用途渲染 房间体块
                var self  = this;
                // this.tikuai()
                util.ajax.get(`/space/color/${v}/`).then((res)=>{
                    var data = res.data
                    self.viewer.clearThemingColors();
                    for(var i in data.data){
                        var cv = data.data[i].color;
                        var c = self._getColorByStr(cv);
                        for(var j in data.data[i].roomdbid){
                            self.viewer.setThemingColor(data.data[i].roomdbid[j], c);
                        }

                    }

                })
            },

            getModifiedWorldBoundingBox(fragIds) {
                var fragbBox = new THREE.Box3();
                var nodebBox = new THREE.Box3();
                // var firstmodel = this.viewer.impl.modelQueue().getModels()[0]
                var fragList = this.firstmodel.getFragmentList();
                fragIds.forEach(function(fragId) {
                    fragList.getWorldBounds(fragId, fragbBox);
                    nodebBox.union(fragbBox);
                });
                return nodebBox;
            },
            add3DTxtByRoom(rooms,mark){
                this.remove3DTxt();
                util.ajax.get("/space/fontcolor/").then(({data})=>{
                    if (data.length != 0) {
                        var color = data[0].color_code;
                        rooms.forEach(room => {
                            var tmp = [];
                            for (var item in mark) {
                                tmp.push(room[mark[item]]);
                            }
                            this.add3DTxt(tmp.join("/"),parseInt(room.modeldbid),color)
                        })
                    } else {
                        rooms.forEach(room => {
                            var tmp = [];
                            for (var item in mark) {
                                tmp.push(room[mark[item]]);
                            }
                            this.add3DTxt(tmp.join("/"),parseInt(room.modeldbid),0xff0000)
                        })
                    }
                })
            },
            add3DTxt(txt,selectdbid,color){
                // 在物体dbid 上面加3d文字
                // var firstmodel = this.viewer.impl.modelQueue().getModels()[0];
                var it = this.firstmodel.getData().instanceTree;
                var fragIdlist = []
                it.enumNodeFragments(selectdbid,fragId=>{
                    fragIdlist.push(fragId)
                })
                var nodeBoundingBox = this.getModifiedWorldBoundingBox(fragIdlist);
                // nodeBoundingBoxObj[selectdbid]=nodeBoundingBox;
                var center = nodeBoundingBox.center();
                var material= new THREE.MeshBasicMaterial( {color: color} );
                var options = {
                    size: 1.5,
                    height: 0.2,
                    weight: "normal",
                    font: "helvetiker",
                    bevelThickness: 1,
                    bevelSize: 0.1,
                    bevelSegments: 1,
                    bevelEnabled: false,
                };
                var geometry_sphere = new THREE.TextGeometry(txt,options);
                // geometry_sphere.applyMatrix( new THREE.Matrix4().makeTranslation( center.x-4, center.y-2, nodeBoundingBox.max.z ) );
                var _currentShape = new THREE.Mesh( geometry_sphere, material );
                _currentShape.position.x = center.x-4;
                _currentShape.position.y = center.y+5;
                _currentShape.position.z = nodeBoundingBox.max.z;
                _currentShape.rotation.z=-0.5 * Math.PI;
                this.currentShapeList.push(_currentShape);
                this.viewer.impl.scene.add(_currentShape);
                this.viewer.impl.invalidate(true) ;

            },
            remove3DTxt(){
                // 删除3d文字
                for(var i in this.currentShapeList){//移除房间标示
                    this.viewer.impl.scene.remove(this.currentShapeList[i]);
                }
                this.currentShapeList = []
                this.viewer.impl.invalidate(true) ;
            },
            bestShow(v){
                this.showDialogs = false;
                if((v instanceof Array)){
                    if(v.length>0){
                        this.removeSelectCallback(this.selectcallback);
                        // this.viewer.hide(1)
                        // this.viewer.show(v)
                        this.viewer.listeners[Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT] = [];
                        this.viewer.select(v);
                        this.viewer.fitToView(v);
                        this.addSelectCallback(this.selectcallback);
                    }

                }else if(!isNaN(v)&&v){
                    this.removeSelectCallback(this.selectcallback);
                    // this.viewer.hide(1)
                    // this.viewer.show(v)
                    this.viewer.listeners[Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT] = [];
                    this.viewer.select(v);
                    this.viewer.fitToView([v]);
                    this.addSelectCallback(this.selectcallback);
                }
                else{
                    this.$Message.error('关联数据缺失');
                }

            },
            bestYuanQuShow(){
                // var  camera;
                // if(this.urltype1=='yuanqu'){
                //     this.viewer.setLightPreset(1);
                //     this.viewer.setLightPreset(15);
                //     camera = {"seedURN":"http://modelbucket.oss-cn-shanghai.aliyuncs.com/east_hospital/DFYYsvf/DFYY_All.SVF","objectSet":[{"id":[],"isolated":[],"hidden":[],"explodeScale":0,"idType":"lmv"}],"viewport":{"name":"","eye":[12727.919825844589,-19909.67939368276,20732.27419985982],"target":[8016.476015132948,-2411.850327302858,8858.999900224522],"up":[-0.14249345263326207,0.5292063701548242,0.8364426063659166],"worldUpVector":[0,0,1],"pivotPoint":[22205.1171875,-23552.203125,24295.009643554688],"distanceToOrbit":-6955.5978088781285,"aspectRatio":2.036055143160127,"projection":"perspective","isOrthographic":false,"fieldOfView":44.99999100695533},"renderOptions":{"environment":"Plaza","ambientOcclusion":{"enabled":true,"radius":10,"intensity":0.4},"toneMap":{"method":1,"exposure":-14,"lightMultiplier":-1e-20},"appearance":{"ghostHidden":true,"ambientShadow":true,"antiAliasing":true,"progressiveDisplay":true,"swapBlackAndWhite":false,"displayLines":true,"displayPoints":true}},"cutplanes":[],"modelurlid":7,"cameraTween":{"viewport":{"name":"","eye":[12727.919825844589,-19909.67939368276,20732.27419985982],"target":[8016.476015132948,-2411.850327302858,8858.999900224522],"up":[-0.14249345263326207,0.5292063701548242,0.8364426063659166],"worldUpVector":[0,0,1],"pivotPoint":[22205.1171875,-23552.203125,24295.009643554688],"distanceToOrbit":-6955.5978088781285,"aspectRatio":2.036055143160127,"projection":"perspective","isOrthographic":false,"fieldOfView":44.99999100695533}}};
                //     this.viewer.CameraRestoreState(camera);
                //     this.viewer.setBackgroundColor(0x08, 0x1d,0x2b, 0x08, 0x1d,0x2b);
                // }else{
                //     this.viewer.setLightPreset(1);
                //     this.viewer.setBackgroundColor(0x08, 0x1d,0x2b, 0x08, 0x1d,0x2b);
                // }

            },
            addSelectCallback(f){
                this.viewer.addEventListener(Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT, f?f:this.selectcallback);
            },
            removeSelectCallback(f){
                this.viewer.removeEventListener(Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT, f?f:this.selectcallback);
            },
            updateMarkData(){
                var self=this;
                this.marklist.forEach(function(obj){
                    if(obj.modeldbid!=null){
                        self.worldToClient(obj)
                    }

                })

            },
            splitModelByFoolLevel(level) {
                var dif = ((level - 15.95)) * (1000 / 304.8);
                var x = -111.483 + dif;
                // var y = 92 - dif;
                var y = -62.5 - dif;
                // viewer.setCutPlanes([new THREE.Vector4(0, 0, -1, x), new THREE.Vector4(0, 0, 1, y)]);
                this.viewer.setCutPlanes([new THREE.Vector4(0, 0, 1, y)]);
                this.updateMarkData()
                if(this.qiu){
                    this.viewer.impl.scene.remove(this.qiu);
                }
            },
            getParentList(dbid){
                if(dbid==1){
                    return
                }
                if(this.plist.length>10){
                    return;
                }
                try{
                    this.plist.push(dbid);
                    var m = this.viewer.impl.modelQueue().getModels()
                    var pa = m[0].getData().instanceTree.getNodeParentId(dbid)
                    if(pa!=1){
                        this.getParentList(pa)
                    }
                } catch (e) {
                    console.log(e);
                }
            },
            getDevice1(dbid){
                // 获取设备
                this.plist = [];
                this.getParentList(dbid);
                var source = util.CancelToken.source()
                var aj = util.ajax.get(`/device/device1/?model__ModelUrl2Model__dbid__in=${this.plist}&model__ModelUrl__urlid=${this.urlid}&model__ModelUrl__urltype1=${this.urltype1}`,{cancelToken: source.token});
                // aj.then(r=>{
                //     var res = r.data;
                //     if(callback){
                //         callback(res.results)
                //     }

                // })
                aj.source = source
                return aj
            },

            loadGarden(){
                this.loadInitialModel('yuanqu',0,this.bestYuanQuShow);
            },
            addLocalFile(){
                if(this.$route.path=="/model/main/"){
                    // util.eventBus.$emit('addLocalFile',this.selectObj);
                }else{
                    this.$router.push({path: "/model/main/",query: {fun: "addLocalFile"}});
                }



            },
            addCloudFile(){
                if(this.$route.path=="/model/main/"){
                    // util.eventBus.$emit('addCloudFile',this.selectObj);
                }else{
                    this.$router.push({path: "/model/main/",query: {fun: "addCloudFile"}});
                }



            },
            setColor(dbid,c){
                this.viewer.setThemingColor(dbid,c)
                this.getAllLeafComponents(this.viewer,(components)=>{
                    for(var i in components){
                        this.viewer.setThemingColor(components[i],c)
                    }
                },dbid)
            },
            getAllLeafComponents(viewer, callback, dbid) { 
                var cbCount = 0; // count pending callbacks 
                var components = []; // store the results 
                var tree; // the instance tree 
                function getLeafComponentsRec(parent) { 
                    cbCount++; 
                    if (tree.getChildCount(parent) != 0) { 
                        tree.enumNodeChildren(parent, function (children) { 
                            getLeafComponentsRec(children); 
                        }, false); 
                    } else { 
                        components.push(parent); 
                    } 
                    if (--cbCount == 0) callback(components);
                } 
                viewer.getObjectTree(function (objectTree) {
                        tree = objectTree; 
                        var allLeafComponents = getLeafComponentsRec(dbid); 
                }); 
            },
            addEvent(){
                if(this.$router.path=="/repair/addevent/"){
                    // util.eventBus.$emit('selected',this.selectObj);
                }else{
                    this.$router.push({path: "/repair/addevent/",query: {fun: "addEvent"}});
                }
            },
            addEventTask(){
                if(this.$router.path=="/device/plan/"){
                    // util.eventBus.$emit('addEventTask',this.selectObj);
                }else{
                    this.$router.push({path: "/device/plan/",query: {fun: "addEventTask"}});
                }
            },
            close(){
                this.showAdd=false;
                this.showDialogs1 = false;
            },

        },
        mounted () {
            let vm = this;
            // setTimeout(()=>{
            //     const modeltype = vm.$route.meta.loadmodel.type;
            //     const modelid = vm.$route.meta.loadmodel.id;
            //     ////debugger
            //     vm.loadInitialModel(modeltype,modelid,vm.bestYuanQuShow);
            // },500);
            this.loadInitialModel('http://modelbucket.oss-cn-shanghai.aliyuncs.com/east_hospital/space/0/0.svf')

        },
        beforeDestroy(){

        },

}

