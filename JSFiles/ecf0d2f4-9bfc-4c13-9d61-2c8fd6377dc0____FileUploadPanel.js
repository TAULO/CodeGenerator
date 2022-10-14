/*
 * Sonatype Nexus (TM) Open Source Version
 * Copyright (c) 2008-present Sonatype, Inc.
 * All rights reserved. Includes the third-party code listed at http://links.sonatype.com/products/nexus/oss/attributions.
 *
 * This program and the accompanying materials are made available under the terms of the Eclipse Public License Version 1.0,
 * which accompanies this distribution and is available at http://www.eclipse.org/legal/epl-v10.html.
 *
 * Sonatype Nexus (TM) Professional Version is available from Sonatype, Inc. "Sonatype" and "Sonatype Nexus" are trademarks
 * of Sonatype, Inc. Apache Maven is a trademark of the Apache Software Foundation. M2eclipse is a trademark of the
 * Eclipse Foundation. All other trademarks are the property of their respective owners.
 */
define(["Nexus/config"], function() {
	if(!Sonatype.config.repos.urls.fileUpload)
		Sonatype.config.repos.urls.fileUpload = Sonatype.config.servicePath + "/file/content";
})

NX.define('hosted.FileUploadPanel', {
  extend : 'Ext.FormPanel',
  requirejs : ['Sonatype/all'],
  mixins : ['Nexus.LogAwareMixin'],

  constructor : function(cfg) {
    Ext.apply(this, cfg || {});

    var ht = Sonatype.repoServer.resources.help.artifact;

    this.fileInput = null;

    this.uploadModeTitle = this.uploadModeTitle || 'Path';

    this.extraItems = this.extraItems || {};

    hosted.FileUploadPanel.superclass.constructor.call(this, {
      region : 'center',
      id : this.id || 'fileUploadFormId',
      trackResetOnLoad : true,
      autoScroll : true,
      bodyStyle : 'overflow:auto;',
      border : false,
      frame : true,
      collapsible : false,
      collapsed : false,
      width : '100%',
      fileUpload : true,
      layoutConfig : {
        labelSeparator : ''
      },
      items : [
        {
          xtype : 'hidden',
          name : 'r',
          value : this.payload.id
        },
        {
          xtype : 'fieldset',
          checkboxToggle : false,
          title : this.uploadModeTitle,
          collapsible : false,
          autoHeight : true,
          width : '95%',
          items : [
            {
              xtype : 'panel',
              id : 'file-gav-definition-card-panel',
              header : false,
              layout : 'card',
              region : 'center',
              activeItem : 0,
              deferredRender : false,
              autoScroll : false,
              frame : false,
              items : [
                {
                  xtype : 'fieldset',
                  border : false,
                  checkboxToggle : false,
                  collapsible : false,
                  style : 'margin-right:7px;',
                  autoHeight : true,
                  items : [
                    {
                      xtype : 'textfield',
                      fieldLabel : 'Group',
//                      itemCls : 'required-field',
                      helpText : ht.groupId,
                      anchor : Sonatype.view.FIELD_OFFSET,
                      name : 'g',
                      allowBlank : true,
                      validator : function(v) {
                        if (!/^[\w\.\-]*$/.test(v)) {
                          return 'Group ID is illegal, only letters, numbers, underscore(_), hyphon(-), and dot(.) are allowed.';
                        }
                        return true;
                      }
                    },
                    {
                      xtype : 'textfield',
                      fieldLabel : 'Artifact',
//                      itemCls : 'required-field',
                      helpText : ht.artifactId,
                      anchor : Sonatype.view.FIELD_OFFSET,
                      name : 'a',
                      allowBlank : true,
                      validator : function(v) {
                        if (!/^[\w\.\-]*$/.test(v)) {
                          return 'File ID is illegal, only letters, numbers, underscore(_), hyphon(-), and dot(.) are allowed.';
                        }
                        return true;
                      }
                    },
                    {
                      xtype : 'textfield',
                      fieldLabel : 'Version',
//                      itemCls : 'required-field',
                      helpText : ht.version,
                      anchor : Sonatype.view.FIELD_OFFSET,
                      name : 'v',
                      allowBlank : true,
                      uploadPanel : this,
                      validator : function(v) {
                        if (!/^[\w\.\-]*$/.test(v)) {
                          return 'Version is illegal, only letters, numbers, underscore(_), hyphon(-), and dot(.) are allowed.';
                        }
                        return true;
                      }
                    }
                  ]
                }
              ]
            }
          ]
        },

        {
          xtype : 'fieldset',
          id : 'files-upload-fieldset',
          checkboxToggle : false,
          title : 'Select File(s) for Upload',
          collapsible : false,
          autoHeight : true,
          style : 'margin-right:7px;width:95%;',
          items : [
            {
              hideLabel : true,
              xtype : 'browsebutton',
              text : 'Select File(s) to Upload...',
              style : 'margin-bottom: 5px;',
              uploadPanel : this,
              name : 'uploadFileButton',
              handler : function(b) {
                b.uploadPanel.fileInput = b.detachInputFile();
                var filename = b.uploadPanel.fileInput.getValue();
                b.uploadPanel.updateFilename(b.uploadPanel, filename);
              }
            },
            {
              xtype : 'textfield',
              fieldLabel : 'Filename',
              name : 'filenameField',
              readOnly : true,
              width : '95%',
              allowBlank : true
            },
            {
              xtype : 'textfield',
              fieldLabel : 'Classifier',
              helpText : ht.classifier,
              name : 'classifier',
              width : '95%',
              allowBlank : true
            },
            {
              xtype : 'textfield',
              fieldLabel : 'Extension',
              helpText : ht.extension,
              name : 'extension',
              width : '95%',
              allowBlank : true
            },
            {
              xtype : 'button',
              id : 'file-add-button',
              text : 'Add File',
              handler : this.addFile,
              scope : this,
              disabled : true
            },
            {
              xtype : 'panel',
              layout : 'column',
              autoHeight : true,
              style : 'padding-top: 5px; padding-bottom: 5px;',
              items : [
                {
                  xtype : 'treepanel',
                  name : 'file-list',
                  title : 'Files',
                  border : true,
                  bodyBorder : true,
                  bodyStyle : 'background-color:#FFFFFF; border: 1px solid #B5B8C8',
                  style : 'padding: 0px 10px 0px 105px',
                  width : 750,
                  height : 100,
                  animate : true,
                  lines : false,
                  autoScroll : true,
                  containerScroll : true,
                  rootVisible : false,
                  ddScroll : true,
                  enableDD : true,
                  root : new Ext.tree.TreeNode({
                    text : 'root',
                    draggable : false
                  }),
                  invalidText : 'Add one or more files',
                  validate : function() {
                    return this.find('name', 'file-list')[0].root.childNodes.length > 0;
                  },
                  invalid : false,
                  listeners : {
                    'append' : {
                      fn : function(tree, parentNode, insertedNode, i) {
                        if (tree.invalid) {
                          this.clearInvalid();
                        }
                      },
                      scope : this
                    },
                    'remove' : {
                      fn : function(tree, parentNode, removedNode) {
                        if (tree.root.childNodes.length < 1 && tree.required) {
                          this.markTreeInvalid(null);
                        }
                        else {
                          this.clearInvalid();
                        }
                      },
                      scope : this
                    }
                  }
                },
                {
                  xtype : 'panel',
                  width : 120,
                  items : [
                    {
                      xtype : 'button',
                      text : 'Remove',
                      minWidth : 100,
                      id : 'file-button-remove',
                      handler : this.removeFile,
                      scope : this
                    },
                    {
                      xtype : 'button',
                      text : 'Remove All',
                      style : 'margin-top: 5px',
                      minWidth : 100,
                      id : 'file-button-remove-all',
                      handler : this.removeAllFiles,
                      scope : this
                    }
                  ]
                }
              ]
            },
            this.extraItems,
            {
              xtype : 'panel',
              id : 'file-end-button-card-panel',
              header : false,
              deferredRender : false,
              autoScroll : false,
              layout : 'fit',
              buttonAlign : 'center',
              frame : false,
              items : [
                {}
              ],
              buttons : [
                {
                  xtype : 'button',
                  id : 'file-upload-button',
                  text : 'Upload File(s)',
                  handler : this.uploadFiles,
                  scope : this
                },
                {
                  xtype : 'button',
                  id : 'file-reset-all-button',
                  text : 'Reset',
                  handler : this.resetFields,
                  scope : this
                }
              ]
            }
          ]
        }
      ]
    });
  },

  clearInvalid : function() {
    var tree = this.find('name', 'file-list')[0];
    if (tree.invalid) {
      // remove error messaging
      tree.getEl().child('.x-panel-body').setStyle({
        'background-color' : '#FFFFFF',
        border : '1px solid #B5B8C8'
      });
      Ext.form.Field.msgFx.normal.hide(tree.errorEl, tree);
    }
  },
  markTreeInvalid : function(errortext) {
    var
          tree = this.find('name', 'file-list')[0],
          elp = tree.getEl();

    if (!tree.errorEl) {
      tree.errorEl = elp.createChild({
        cls : 'x-form-invalid-msg'
      });
      tree.errorEl.setWidth(elp.getWidth(true)); // note removed -20 like
      // on form fields
    }
    tree.invalid = true;
    var oldErrorText = tree.invalidText;
    if (errortext) {
      tree.invalidText = errortext;
    }
    tree.errorEl.update(tree.invalidText);
    tree.invalidText = oldErrorText;
    elp.child('.x-panel-body').setStyle({
      'background-color' : '#fee',
      border : '1px solid #dd7870'
    });
    Ext.form.Field.msgFx.normal.show(tree.errorEl, tree);
  },
  resetFields : function() {
    this.gavResponse = null;
    var
          filenameField = this.find('name', 'filenameField')[0],
          classifierField = this.find('name', 'classifier')[0],
          extensionField = this.find('name', 'extension')[0],
          addFileBtn = this.find('id', 'file-add-button')[0],
          g = this.find('name', 'g')[0],
          a = this.find('name', 'a')[0],
          v = this.find('name', 'v')[0];

    filenameField.reset();
    classifierField.reset();
    extensionField.reset();
    addFileBtn.setDisabled(true);

    // clear the files fields
    this.removeAllFiles();

    // reset the gav panel
    g.reset();
    a.reset();
    v.reset();
  },

  fileWithClassifierAndExtensionExists : function(classifier, extension) {
    var
          i, currClassifier, currExtension,
          treePanel = this.find('name', 'file-list')[0];
    for (i = 0; i < treePanel.root.childNodes.length; i++) {
      currClassifier = treePanel.root.childNodes[i].attributes.payload.classifier;
      currExtension = treePanel.root.childNodes[i].attributes.payload.extension;

      if (classifier === currClassifier && extension === currExtension) {
        return true;
      }
    }
    return false;
  },

  addFile : function() {
    var
          treePanel = this.find('name', 'file-list')[0],
          filenameField = this.find('name', 'filenameField')[0],
          classifierField = this.find('name', 'classifier')[0],
          extensionField = this.find('name', 'extension')[0],
          classifier = classifierField.getValue(),
          extension = extensionField.getValue(),
          nodeText = filenameField.getValue();

    if (this.fileWithClassifierAndExtensionExists(classifier, extension)) {
      Ext.Msg.show({
        title : 'Classifier and Extension Taken',
        msg : "Every file must have a unique classifier and extension. The specified classifier and extension is already taken.",
        buttons : Ext.Msg.OK,
        icon : Ext.MessageBox.WARNING
      });
      return;
    }
    if (!Ext.isEmpty(classifier)) {
      nodeText += ' c:' + classifier;
    }
    if (!Ext.isEmpty(extension)) {
      nodeText += ' e:' + extension;
    }

    if (this.fileInput) {
      treePanel.root.appendChild(new Ext.tree.TreeNode({
    	//filenameField = this.find('name', 'filenameField')[0],这个似乎也没什么关系不会重复先不管
        id : filenameField.getValue(),
        text : nodeText,
        payload : {
          id : filenameField.getValue(),
          filename : filenameField.getValue(),
          fileInput : this.fileInput,
          classifier : classifier,
          extension : extension
        },
        allowChildren : false,
        draggable : false,
        leaf : true,
        icon : Sonatype.config.extPath + '/resources/images/default/tree/leaf.gif'
      }));
    }
    filenameField.setValue('');
    classifierField.setValue('');
    extensionField.setValue('');
    this.fileInput = null;
    this.find('id', 'file-add-button')[0].setDisabled(true);
  },
  removeFile : function() {
    var treePanel = this.find('name', 'file-list')[0];

    var selectedNode = treePanel.getSelectionModel().getSelectedNode();
    if (selectedNode) {
      treePanel.root.removeChild(selectedNode);
    }
  },
  removeAllFiles : function() {
    var
          treePanel = this.find('name', 'file-list')[0],
          treeRoot = treePanel.root;

    while (treeRoot.lastChild) {
      treeRoot.removeChild(treeRoot.lastChild);
    }
  },
  updateFilename : function(uploadPanel, filename) {
    var
          filenameField = uploadPanel.find('name', 'filenameField')[0],
          g = '', a = '', v = '', c = '', e = '';

    if (filename) {
      filenameField.setValue(filename);
    }
    else {
      filename = filenameField.getValue();
      if (!filename) {
        return;
      }
    }

    var cardPanel = uploadPanel.find('id', 'file-gav-definition-card-panel')[0];

    // match extension to guess the packaging
    var extensionIndex = filename.lastIndexOf('.');
    if (extensionIndex > 0) {
      e = filename.substring(extensionIndex + 1);
      filename = filename.substring(0, extensionIndex);
    }
    //c留着先~说不定以后配置文件分debug之类的版本时候有用
    uploadPanel.find('name', 'classifier')[0].setRawValue(c);
    uploadPanel.find('name', 'extension')[0].setRawValue(e);
    if (!a) {
      uploadPanel.form.clearInvalid();
    }
    uploadPanel.find('id', 'file-add-button')[0].setDisabled(false);
  },

  uploadFiles : function() {
    var tree = this.find('name', 'file-list')[0];
    if (!tree.validate.call(this)) {
      this.markTreeInvalid(null);
    }
    else if (this.form.isValid()) {
      this.doUpload();
    }
  },
  doUpload : function() {
    var treePanel = this.find('name', 'file-list')[0];
    var hasFiles = treePanel.root.childNodes && treePanel.root.childNodes.length > 0;
    if (!hasFiles) {
      Sonatype.MessageBox.show({
        title : 'No Files Selected',
        msg : 'The Files list must contain at least one file to upload.',
        buttons : Sonatype.MessageBox.OK,
        icon : Sonatype.MessageBox.ERROR
      });
      return;
    }

    Sonatype.MessageBox.wait('Uploading ...');

    // FIXME this.currentChildNode is always 0 here? side effect?
    this.currentChildNode = 0;
    this.createUploadForm(treePanel,
          treePanel.root.childNodes[this.currentChildNode].attributes.payload.fileInput,
          treePanel.root.childNodes[this.currentChildNode].attributes.payload.classifier,
          treePanel.root.childNodes[this.currentChildNode].attributes.payload.extension,
          this.currentChildNode === (treePanel.root.childNodes.length - 1));
  },
  createUploadForm : function(treePanel, fileInput, classifier, extension, lastItem) {
    var repoId = this.payload.id;
    repoId = repoId.substring(repoId.lastIndexOf('/') + 1);

    if (this.gavResponse) {
      this.form.findField('g').setValue(this.gavResponse.groupId);
      this.form.findField('a').setValue(this.gavResponse.artifactId);
      this.form.findField('v').setValue(this.gavResponse.version);
    }

    var repoTag = {
      tag : 'input',
      type : 'hidden',
      name : 'r',
      value : repoId
    };

    var tmpForm = Ext.getBody().createChild({
      tag : 'form',
      cls : 'x-hidden',
      //这个是个类似自增长的id,不会重复先不管
      id : Ext.id(),
      children : [repoTag, {
        tag : 'input',
        type : 'hidden',
        name : 'g',
        value : this.form.findField('g').getValue()
      }, {
        tag : 'input',
        type : 'hidden',
        name : 'a',
        value : this.form.findField('a').getValue()
      }, {
        tag : 'input',
        type : 'hidden',
        name : 'v',
        value : this.form.findField('v').getValue()
      }, {
        tag : 'input',
        type : 'hidden',
        name : 'c',
        value : classifier
      }, {
        tag : 'input',
        type : 'hidden',
        name : 'e',
        value : extension
      }]
    });

    fileInput.appendTo(tmpForm);

    Ext.Ajax.request({
      url: Sonatype.config.repos.urls.fileUpload,
      form : tmpForm,
      isUpload : true,
      cbPassThru : {
        treePanel : treePanel
      },
      callback : function(options, success, response) {
        tmpForm.remove();

        // This is a hack to get around the fact that upload submit
        // always returns
        // success = true
        var
              indexOfErrorMsg = response.responseText.toLowerCase().indexOf('<error>'),
              endIndexOfErrorMsg = response.responseText.toLowerCase().indexOf('</error>'),
              msg = 'File upload failed.<br />',
              indexOfMsgContent = indexOfErrorMsg + 7,
              treePanel = options.cbPassThru.treePanel;

        if (indexOfErrorMsg === -1) {
          // get the json response and set the gavResponse
          this.gavResponse = Ext.decode(response.responseText);

          if (lastItem) {
            Sonatype.MessageBox.show({
              title : 'Upload Complete',
              msg : 'File upload finished successfully',
              buttons : Sonatype.MessageBox.OK,
              icon : Sonatype.MessageBox.INFO
            });
            this.resetFields();
          }
          else {
            this.currentChildNode += 1;
            if (this.currentChildNode < treePanel.root.childNodes.length) {
              this.createUploadForm(treePanel,
                    treePanel.root.childNodes[this.currentChildNode].attributes.payload.fileInput,
                    treePanel.root.childNodes[this.currentChildNode].attributes.payload.classifier,
                    treePanel.root.childNodes[this.currentChildNode].attributes.payload.extension,
                    this.currentChildNode === treePanel.root.childNodes.length - 1);
            }
          }
        } else {
          this.logDebug('Upload failed: ' + response.responseText);

          this.gavResponse = null;

          if (endIndexOfErrorMsg > indexOfMsgContent) {
            msg += response.responseText.substring(indexOfMsgContent, endIndexOfErrorMsg);
          }
          else {
            msg += 'Check Nexus logs for more information.';
          }
          Sonatype.MessageBox.show({
            title : 'Upload Failed',
            msg : msg,
            buttons : Sonatype.MessageBox.OK,
            icon : Sonatype.MessageBox.ERROR
          });
        }
      },
      scope : this
    });
  }
}, function() {

  Sonatype.Events.addListener('repositoryViewInit', function(cardPanel, rec) {
	var sp = Sonatype.lib.Permissions;

    if (rec.data.resourceURI && rec.data.userManaged && sp.checkPermission('nexus:file', sp.CREATE)
          && rec.data.repoType === 'hosted' && rec.data.format === "file") {

      Ext.Ajax.request({
        url : rec.data.resourceURI,
        scope : this,
        callback : function(options, success, response) {
          if (success) {
            var statusResp = Ext.decode(response.responseText);
            if (statusResp.data) {
              if (statusResp.data.writePolicy === 'ALLOW_WRITE' || statusResp.data.writePolicy
                    === 'ALLOW_WRITE_ONCE') {
                var uploadPanel = new hosted.FileUploadPanel({
                  payload : rec,
                  name : 'upload'
                });
                var card = cardPanel.add({
                  xtype : 'panel',
                  layout : 'fit',
                  tabTitle : 'File Upload',
                  name : 'uploadPanel',
                  items : [uploadPanel]
                });

                card.on('show', function(p) {
                  // This is a hack to fix the width of the edit box
                  // in IE
                  p.doLayout();
                  p.find('name', 'filenameField')[0].setValue('.');
                  p.find('name', 'filenameField')[0].setValue('');

                  // another hack to make the whole browse button
                  // clickable
                  if (!p.browseButtonsUpdated) {
                    var i, b = p.find('xtype', 'browsebutton');
                    for (i = 0; i < b.length; i++) {
                      b[i].setClipSize();
                    }
                    p.browseButtonsUpdated = true;
                  }
                });
              }
              else {
                cardPanel.add({
                  xtype : 'panel',
                  tabTitle : 'File Upload',
                  name : 'upload',
                  items : [
                    {
                      border : false,
                      html : '<div class="little-padding">' + 'File deployment is disabled for '
                            + rec.data.name
                            + '.<br /><br />' + 'You can enable it in the "Access Settings" section of the '
                            + 'repository configuration.</div>'
                    }
                  ]
                });
              }

              cardPanel.doLayout();

              return;
            }
          }
          Sonatype.utils.connectionError(response, 'There was a problem obtaining repository status.');
        }
      });
    }
  });
});

