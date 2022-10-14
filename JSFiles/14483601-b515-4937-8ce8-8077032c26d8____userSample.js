
Ext.Ajax.request({
    url: 'checksavedsession',
    method: "GET",
    timeout: 60000,
    data: {},
    headers: {Accept : "application/json;charset=utf-8"},
    success: function(response) {
        var obj = Ext.decode(response.responseText);
        if (!obj['success']) {               //if there are session saved redirect to index.html
            location.assign('login.html');
        }
    }
});

var usersampleStore = Ext.create('Ext.data.Store', {
    autoLoad: true,
    autoSync: true,
    proxy: {
        type: 'rest',
        url: 'uploadGrid',
        reader: {
            type: 'json',
            root: 'data'
        },
        writer: {
            type: 'json'
        }
    }
});
var usersampleGrid = Ext.create('Ext.grid.Panel',{
    width: '100%',
    height:'100%',
    id: 'usersampleGrid',
    frame: true,
    title: 'Welcome Sample Users',
    store: usersampleStore,
    selModel: {
        mode: 'SINGLE',
        allowDeselect: true
    },
    style: {
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    columns:[

        {
            text: 'Firstname',
            width: 80,
            flex: 1,
            sortable: true,
            dataIndex: 'fname',
            field: {
                xtype:'textfield'
            },
            cell: {
                xtype: "widgetcell",
                widget: {
                    xtype: 'panel',
                    header: false,
                    items: [{
                        xtype: 'button',
                        text: 'CLICK ME'
                    }]
                }
            }
        },
        {
            text: 'Lastname',
            width: 80,
            flex: 1,
            sortable: true,
            dataIndex: 'lname',
            field: {
                xtype: 'textfield'
            }
        },
        {
            text: 'Middle Initial',
            width: 80,
            flex: 1,
            sortable: true,
            dataIndex: 'mi',
            field: {
                xtype: 'textfield'
            }

        },
        {
            text: 'Birthdate',
            width: 80,
            flex: 1,
            sortable: true,
            dataIndex: 'birthdate',
            field:{
                xtype: 'textfield'
            }
        },
        {
          text: 'Username',
          width: 80,
          flex: 1,
          sortable: true,
          dataIndex: 'username',
          field:{
              xtype: 'textfield'
          }
        }
        /*{
            renderer: function(val,meta,rec) {
                // generate unique id for an element
                var id = Ext.id();
                Ext.defer(function() {
                    Ext.widget('button', {
                        renderTo: Ext.query("#"+id)[0],
                        text: 'View',
                        scale: 'small',
                        handler: function() {
                            Ext.Msg.alert("Hello World")
                        }
                    });
                }, 50);
                return Ext.String.format('<div id="{0}"></div>', id);
            }
        }*/

    ],
    dockedItems:[
        {
            xtype: 'toolbar',
            dock: 'top',
            items:[
                {
                    text: 'Create',
                    iconCls: 'icon-add',
                    listeners: {
                        click: function () {
                            var createsampleUSer = Ext.create('Ext.form.Panel',{
                                bodyPadding: 10,
                                fileUpload:true,
                                items:[
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: 'Firstname',
                                        name: 'fname',
                                        anchor: '80%',
                                        allowBlank: false,
                                        blankText: 'This field is required'

                                    },
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: 'Lastname',
                                        name: 'lname',
                                        anchor:'80%',
                                        allowBlank: false,
                                        blankText: 'This field is required'

                                    },
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: 'Middle Initial',
                                        name: 'mi',
                                        anchor:'80%',
                                        allowBlank: false,
                                        blankText: 'This field is required',
                                        maxLength: 1,
                                        listeners:{
                                            change: function(field, newValue, oldValue){
                                                field.setValue(newValue.toUpperCase());
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'datefield',
                                        fieldLabel: 'Birthdate',
                                        name: 'birthdate',
                                        anchor:'80%',
                                        format: 'Y-m-d',
                                        //value: '1978-02-04'
                                        value: new Date() // defaults to today

                                    },

                                    {
                                        xtype:'textfield',
                                        fieldLabel: 'Username',
                                        name: 'username',
                                        anchor:'80%',
                                        allowBlank: false,
                                        blankText: 'This field is required',
                                        maskRe: /[A-Za-z0-9]/,
                                        minLength: 6,
                                        minLengthText: 'Please input atleast 6 character'

                                    },
                                    {
                                        xtype: 'textfield',
                                        itemId: 'mypassword',
                                        inputType: 'password',
                                        fieldLabel: 'Password',
                                        vtype: 'passwordCheck',
                                        name: 'password',
                                        anchor:'80%',
                                        allowBlank: false,
                                        blankText: 'This field is required',
                                        minLength: 8,
                                        minLengthText: 'Please input aleast 8 Character'

                                    },
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: 'Confirmed (password)',
                                        validation: false,
                                        inputType: 'password',
                                        anchor:'80%',
                                        allowBlank: false,
                                        vtype: 'passwordMatch'
                                    },
                                    {
                                        xtype: 'filefield',
                                        name: 'photo',
                                        id: 'photo',
                                        fieldLabel: 'Photo',
                                        labelWidth: 100,
                                        msgTarget: 'side',
                                        allowBlank: false,
                                        anchor: '80%',
                                        buttonText: 'Select Photo...',
                                        accept: 'image/jpeg',
                                        listeners:{
                                            change: function (me) {
                                                var fileExt = me.getValue().lastIndexOf("."),
                                                    uploadedExtension = me.getValue().substr(fileExt + 1, me.getValue().length - fileExt);

                                                var fullPath = me.getValue();
                                                var lastIndex = fullPath.lastIndexOf('\\');
                                                var fileName = fullPath.substr(lastIndex + 1);
                                                var allowedExtension = ['jpg', 'jpeg'];

                                                //maximum fileSize
                                                var maxFileSize = 512000;


                                                //See if the extension is in the array of acceptable extension
                                                if(!Ext.Array.contains(allowedExtension, uploadedExtension)){
                                                    me.setActiveError('Please upload files with an extension of ' + allowedExtension.join() +  ' only!');

                                                    Ext.MessageBox.show({
                                                        title: 'Invalid File Type',
                                                        msg: 'Please upload files with an extension of ' + allowedExtension.join() + ' only!',
                                                        buttons: Ext.Msg.OK,
                                                        icon: Ext.Msg.ERROR
                                                    });

                                                    //Set value to null so that form submit isValid() method will stop the submission
                                                    me.setRawValue(null);
                                                    return;
                                                }
                                                me.setRawValue(fileName);


                                                //checking file size. File Size Limit 512kb
                                                if (me.fileInputEl.dom.files[0].size > maxFileSize){
                                                    Ext.MessageBox.show({
                                                        title: 'Invalid File Size',
                                                        msg: 'File size exceeds 512kb! Please select another file.',
                                                        buttons: Ext.Msg.OK,
                                                        icon: Ext.Msg.ERROR
                                                    });
                                                    //Set value to null so that form submit isValid() method will stop the submission
                                                    me.setRawValue(null);
                                                }
                                            }

                                        }
                                    }


                                ],
                                buttons:[
                                    {
                                        text: 'Add',
                                        handler: function () {
                                            var form = this.up('form').getForm();
                                            if(form.isValid()){
                                                form.submit({
                                                    url: 'uploadServlet',
                                                    method: 'POST',
                                                    success : function(form,action) {
                                                                var assoc = Ext.decode(action.response.responseText);
                                                        Ext.MessageBox.show({
                                                            msg: 'Saving changes, please wait...',
                                                            progressText: 'Adding...',
                                                            width: 300,
                                                            wait: true,
                                                            waitConfig:
                                                                {
                                                                    duration: 5000,
                                                                    increment: 15,
                                                                    text: 'Adding...',
                                                                    scope: this,
                                                                    fn : function () {
                                                                        Ext.MessageBox.hide();
                                                                        Ext.Msg.alert('Status','Successfully Saved');
                                                                        usersampleStore.load(); //reload grid
                                                                    }
                                                                }
                                                        });
                                                        //close form after successful submission & enable grid
                                                        winSample.close();
                                                        usersampleGrid.enable()
                                                    }

                                                })
                                            }else{
                                                Ext.MessageBox.show({
                                                   title: 'Failed',
                                                    msg: 'Please fill the required field correctly',
                                                    buttons: Ext.MessageBox.OK,
                                                    icon: Ext.MessageBox.WARNING
                                                });
                                            }
                                        }

                                    },
                                    {
                                        text: 'Close',
                                        handler: function () {
                                            winSample.destroy();
                                            usersampleGrid.enable();// enable grid if form is close
                                            Ext.getCmp('usersampleGrid').store.reload();
                                        }
                                    }
                                ]
                            }); // end of create
                                //create a window
                            usersampleGrid.disable(); // disable grid if button is selected
                            var winSample = Ext.create('Ext.window.Window',{
                                renderTo: Ext.getBody(),
                                title: 'Create Sample Users',
                                layout: 'fit',
                                width: 500,
                                closable: false,
                                closeAction: 'hide',
                                plain: true,
                                items:[createsampleUSer]
                            }).show();


                        }
                    }
                },
                {
                    text: 'Update',
                    iconCls: 'icon-update',
                    handler: function () {
                        var recordData = usersampleGrid.getSelectionModel().getSelection();
                        console.log(recordData);
                        //check if data is null
                        if(recordData === null){
                            Ext.Msg.alert('Warning', 'Must Select');
                            return;
                        }
                        if(recordData.length < 1){
                            Ext.Msg.alert('Warning', 'Must Select');
                            return;
                        }
                        console.log(recordData[0].data.photo);

                        var updateDataForm = Ext.create('Ext.form.Panel',{
                            bodyPadding: 10,
                            id: 'update_btn',
                            border: false,
                            items: [
                                {
                                    xtype: 'textfield',
                                    fieldLabel: 'User id',
                                    id: 'user_id',
                                    name: 'user_id',
                                    value: recordData[0].data.user_id,
                                    hidden: true
                                },
                                {
                                    xtype: 'textfield',
                                    fieldLabel: 'Created_by',
                                    id: 'created_by',
                                    name: 'created_by',
                                    value: recordData[0].data.created_by,
                                    hidden: true

                                },
                                {
                                    xtype: 'textfield',
                                    fieldLabel: 'Firstname',
                                    id: 'fname',
                                    name: 'fname',
                                    value: recordData[0].data.fname,
                                    allowBlank: false,
                                    blankText: 'This field is required'
                                },
                                {
                                    xtype: 'textfield',
                                    fieldLabel: 'Lastname',
                                    id: 'lname',
                                    name: 'lname',
                                    value: recordData[0].data.lname,
                                    allowBlank: false,
                                    blankText: 'This field is required'
                                },
                                {
                                    xtype: 'textfield',
                                    fieldLabel: 'Middle Initial',
                                    id: 'mi',
                                    name: 'mi',
                                    value: recordData[0].data.mi,
                                    allowBlank: false,
                                    blankText: 'This field is required'
                                },
                                {
                                    xtype: 'datefield',
                                    fieldLabel: 'Birthdate',
                                    id: 'birthdate',
                                    name: 'birthdate',
                                    value: recordData[0].data.birthdate,
                                    format: 'Y-m-d',
                                    allowBlank: false,
                                    blankText: 'This field is required'
                                },
                                {
                                    xtype:'textfield',
                                    fieldLabel: 'Username',
                                    name: 'username',
                                    value: recordData[0].data.username,
                                    anchor:'80%',
                                    allowBlank: false,
                                    blankText: 'This field is required',
                                    maskRe: /[A-Za-z0-9]/,
                                    minLength: 6,
                                    minLengthText: 'Please input atleast 6 character'

                                },
                                {
                                    xtype: 'textfield',
                                    itemId: 'mypassword',
                                    inputType: 'password',
                                    value: recordData[0].data.password,
                                    fieldLabel: 'Password',
                                    vtype: 'passwordCheck',
                                    name: 'password',
                                    anchor:'80%',
                                    allowBlank: false,
                                    blankText: 'This field is required',
                                    minLength: 8,
                                    minLengthText: 'Please input aleast 8 Character'

                                },
                               {
                                    xtype: 'filefield',
                                    name: 'photo',
                                    id: 'photo',
                                    fieldLabel: 'Photo',
                                    labelWidth: 100,
                                    msgTarget: 'side',
                                    anchor: '80%',
                                    buttonText: 'Select Photo...',
                                    accept: 'image/jpeg',
                                    listeners:{
                                        change: function (me) {
                                            var fileExt = me.getValue().lastIndexOf("."),
                                                uploadedExtension = me.getValue().substr(fileExt + 1, me.getValue().length - fileExt);

                                            var fullPath = me.getValue();
                                            var lastIndex = fullPath.lastIndexOf('\\');
                                            var fileName = fullPath.substr(lastIndex + 1);
                                            var allowedExtension = ['jpg', 'jpeg'];

                                            //maximum fileSize
                                            var maxFileSize = 512000;


                                            //See if the extension is in the array of acceptable extension
                                            if(!Ext.Array.contains(allowedExtension, uploadedExtension)){
                                                me.setActiveError('Please upload files with an extension of ' + allowedExtension.join() +  ' only!');

                                                Ext.MessageBox.show({
                                                    title: 'Invalid File Type',
                                                    msg: 'Please upload files with an extension of ' + allowedExtension.join() + ' only!',
                                                    buttons: Ext.Msg.OK,
                                                    icon: Ext.Msg.ERROR
                                                });

                                                //Set value to null so that form submit isValid() method will stop the submission
                                                me.setRawValue(null);
                                                return;
                                            }
                                            me.setRawValue(fileName);


                                            //checking file size. File Size Limit 512kb
                                            if (me.fileInputEl.dom.files[0].size > maxFileSize){
                                                Ext.MessageBox.show({
                                                    title: 'Invalid File Size',
                                                    msg: 'File size exceeds 512kb! Please select another file.',
                                                    buttons: Ext.Msg.OK,
                                                    icon: Ext.Msg.ERROR
                                                });
                                                //Set value to null so that form submit isValid() method will stop the submission
                                                me.setRawValue(null);
                                            }
                                        }

                                    }
                                }
                                ],

                                buttons:[
                                    {

                                        text: 'Update',
                                        id: 'submit',
                                        handler: function(){
                                            var form = this.up('form').getForm();
                                            if (form.isValid()) {
                                                form.submit({
                                                    url: 'updateServlet',
                                                    method: 'POST',

                                                    success: function(form, action) {
                                                        var assoc = Ext.decode(action.response.responseText);

                                                        Ext.MessageBox.show({
                                                            msg : 'Saving changes, please wait...',
                                                            progressText : 'Updating...',
                                                            width : 300,
                                                            wait : true,
                                                            waitConfig :
                                                                {
                                                                    duration : 5000,
                                                                    increment : 15,
                                                                    text : 'Updating...',
                                                                    scope : this,
                                                                    fn : function(){
                                                                        Ext.MessageBox.hide();
                                                                        Ext.Msg.alert('Status', 'Successfully Updated!');
                                                                        usersampleStore.load(); //reload grid
                                                                    }
                                                                }
                                                        });
                                                        winUpdate.destroy();
                                                        usersampleGrid.enable();
                                                    }
                                                });
                                            }else {
                                                Ext.MessageBox.show({
                                                    title: "Failed",
                                                    msg: "Please fill the required fields correctly.",
                                                    buttons: Ext.MessageBox.OK,
                                                    icon: Ext.MessageBox.WARNING
                                                });
                                            }
                                        }
                                    },
                                    {
                                        text: 'Cancel',
                                        handler: function () {
                                            winUpdate.destroy();
                                            usersampleGrid.enable();// enable grid if form is close
                                            Ext.getCmp('usersampleGrid').store.reload();
                                        }
                                    }
                                ]

                        });// end of update form
                        usersampleGrid.disable(); // disable grid if button is selected
                        var winUpdate = Ext.create('Ext.window.Window',{
                            renderTo: Ext.getBody(),
                            title: 'Upadate Sample Users',
                            layout: 'fit',
                            width: 500,
                            closable: false,
                            closeAction: 'hide',
                            plain: true,
                            items:[updateDataForm]
                        }).show();




                    }
                },
                {
                    text: 'Delete',
                    iconCls: 'icon-delete',
                    handler: function () {
                        var recordData = usersampleGrid.getSelectionModel().getSelection();
                        //console.log(recordData);

                        //check if recordData is null
                        if(recordData === null){
                            Ext.Msg.alert('Warning', 'Must Select');
                            return
                        }
                        if(recordData.length < 1){
                            Ext.Msg.alert('Warning', 'Must Select');
                            return
                        }

                        Ext.Msg.confirm('Delete?', 'Are you sure you want to Delete (' + recordData[0].data.username + ')?', function(answer) {
                            if (answer === "yes") {
                                var user_id = recordData[0].data.user_id;
                                Ext.Ajax.request({
                                    url:'deleteUser',
                                    method: 'post',
                                    params: {
                                        user_id:user_id
                                    },
                                    success: function (response) {
                                        var assoc = Ext.decode(response.responseText);
                                        Ext.MessageBox.show({
                                            msg : 'Saving changes, please wait...',
                                            progressText : 'Deleting...',
                                            width : 300,
                                            wait : true,
                                            waitConfig :
                                                {
                                                    duration : 5000,
                                                    increment : 15,
                                                    text : 'Deleting...',
                                                    scope : this,
                                                    fn : function(){
                                                        Ext.MessageBox.hide();
                                                        Ext.Msg.alert('Status', 'Deleted successfully!');
                                                        usersampleStore.load(); //reload grid
                                                    }
                                                }
                                        });

                                    }
                                });
                            }

                        }); //end of if

                    }
                },
                {
                    text: 'View Photo',
                    handler: function () {
                        var recordData = usersampleGrid.getSelectionModel().getSelection();
                        console.log(recordData);

                        //check if data is null
                        if(recordData === null){
                            Ext.Msg.alert('Warning', 'Must Select');
                            return;
                        }
                        if(recordData.length < 1){
                            Ext.Msg.alert('Warning', 'Must Select');
                            return;
                        }
                        //console.log(recordData[0].data.photo);

                        var myImage = Ext.create('Ext.container.Container', {

                            layout: 'fit',
                            items: [{
                                xtype: 'image',
                                src: "http://localhost:8080/ext/getimage?user_id="+recordData[0].data.user_id+" "
                            }]
                        });

                        picWin = Ext.create('Ext.window.Window', {
                            title: recordData[0].data.username,
                            width: 400,
                            height: 400,
                            layout: "fit",
                            tabIndex: 0,
                            focusable: true,

                            modal: true,
                            items: [myImage]
                        });
                        picWin.show();
                    }

                },
                {
                    text: 'Refresh',
                    iconCls: 'icon-refresh',
                    handler: function () {
                        Ext.getCmp('usersampleGrid').store.reload();
                    }
                },
                {

                    text: 'Logout',
                    iconCls: 'icon-logout',
                    handler: function () {
                        Ext.Msg.confirm('Logout?', 'Are you sure you want to logout?', function(answer) {
                            if (answer === "yes") {
                                Ext.Ajax.request({
                                    url:'logout',
                                    method: 'post',
                                    success: function (response) {
                                        var assoc = Ext.decode(response.responseText);
                                        location.assign("login.html")
                                    }
                                });
                            } //end of if
                        });
                    }//handler end


                }

            ]
        }
    ]

});

Ext.onReady(function () {

   Ext.QuickTips.init();
   Ext.create('Ext.container.Viewport',{
       renderTo: Ext.getBody(),
       layout:{
           type:'vbox',
           align: 'center',
           pack: 'center'
       },
       items: [usersampleGrid]
   });

   Ext.apply(Ext.form.field.VTypes,{
       passwordCheck: function (val) {
           var reg = /^.*(?=.{8,16})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).*$/;
           return reg.test(val);
           
       },
       passwordCheckText:'Please input password with special characters <br> "passExample@12"',
       //matching first password
       passwordMatch: function (value, field) {
           var password = field.up('form').down('#' + 'mypassword');
           return (value === password.getValue());
       },

       passwordMatchText: 'Password do not match'

   });

});