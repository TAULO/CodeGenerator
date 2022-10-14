// Copyright 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

(function() {
  var mojomId = 'media/mojo/interfaces/interface_factory.mojom';
  if (mojo.internal.isMojomLoaded(mojomId)) {
    console.warn('The following mojom is loaded multiple times: ' + mojomId);
    return;
  }
  mojo.internal.markMojomLoaded(mojomId);
  var bindings = mojo;
  var associatedBindings = mojo;
  var codec = mojo.internal;
  var validator = mojo.internal;

  var exports = mojo.internal.exposeNamespace('media.mojom');
  var audio_decoder$ =
      mojo.internal.exposeNamespace('media.mojom');
  if (mojo.config.autoLoadMojomDeps) {
    mojo.internal.loadMojomIfNecessary(
        'media/mojo/interfaces/audio_decoder.mojom', 'audio_decoder.mojom.js');
  }
  var cdm_proxy$ =
      mojo.internal.exposeNamespace('media.mojom');
  if (mojo.config.autoLoadMojomDeps) {
    mojo.internal.loadMojomIfNecessary(
        'media/mojo/interfaces/cdm_proxy.mojom', 'cdm_proxy.mojom.js');
  }
  var decryptor$ =
      mojo.internal.exposeNamespace('media.mojom');
  if (mojo.config.autoLoadMojomDeps) {
    mojo.internal.loadMojomIfNecessary(
        'media/mojo/interfaces/decryptor.mojom', 'decryptor.mojom.js');
  }
  var content_decryption_module$ =
      mojo.internal.exposeNamespace('media.mojom');
  if (mojo.config.autoLoadMojomDeps) {
    mojo.internal.loadMojomIfNecessary(
        'media/mojo/interfaces/content_decryption_module.mojom', 'content_decryption_module.mojom.js');
  }
  var renderer$ =
      mojo.internal.exposeNamespace('media.mojom');
  if (mojo.config.autoLoadMojomDeps) {
    mojo.internal.loadMojomIfNecessary(
        'media/mojo/interfaces/renderer.mojom', 'renderer.mojom.js');
  }
  var renderer_extensions$ =
      mojo.internal.exposeNamespace('media.mojom');
  if (mojo.config.autoLoadMojomDeps) {
    mojo.internal.loadMojomIfNecessary(
        'media/mojo/interfaces/renderer_extensions.mojom', 'renderer_extensions.mojom.js');
  }
  var video_decoder$ =
      mojo.internal.exposeNamespace('media.mojom');
  if (mojo.config.autoLoadMojomDeps) {
    mojo.internal.loadMojomIfNecessary(
        'media/mojo/interfaces/video_decoder.mojom', 'video_decoder.mojom.js');
  }
  var token$ =
      mojo.internal.exposeNamespace('mojoBase.mojom');
  if (mojo.config.autoLoadMojomDeps) {
    mojo.internal.loadMojomIfNecessary(
        'mojo/public/mojom/base/token.mojom', '../../../mojo/public/mojom/base/token.mojom.js');
  }
  var unguessable_token$ =
      mojo.internal.exposeNamespace('mojoBase.mojom');
  if (mojo.config.autoLoadMojomDeps) {
    mojo.internal.loadMojomIfNecessary(
        'mojo/public/mojom/base/unguessable_token.mojom', '../../../mojo/public/mojom/base/unguessable_token.mojom.js');
  }



  function InterfaceFactory_CreateAudioDecoder_Params(values) {
    this.initDefaults_();
    this.initFields_(values);
  }


  InterfaceFactory_CreateAudioDecoder_Params.prototype.initDefaults_ = function() {
    this.audioDecoder = new bindings.InterfaceRequest();
  };
  InterfaceFactory_CreateAudioDecoder_Params.prototype.initFields_ = function(fields) {
    for(var field in fields) {
        if (this.hasOwnProperty(field))
          this[field] = fields[field];
    }
  };

  InterfaceFactory_CreateAudioDecoder_Params.validate = function(messageValidator, offset) {
    var err;
    err = messageValidator.validateStructHeader(offset, codec.kStructHeaderSize);
    if (err !== validator.validationError.NONE)
        return err;

    var kVersionSizes = [
      {version: 0, numBytes: 16}
    ];
    err = messageValidator.validateStructVersion(offset, kVersionSizes);
    if (err !== validator.validationError.NONE)
        return err;


    // validate InterfaceFactory_CreateAudioDecoder_Params.audioDecoder
    err = messageValidator.validateInterfaceRequest(offset + codec.kStructHeaderSize + 0, false)
    if (err !== validator.validationError.NONE)
        return err;

    return validator.validationError.NONE;
  };

  InterfaceFactory_CreateAudioDecoder_Params.encodedSize = codec.kStructHeaderSize + 8;

  InterfaceFactory_CreateAudioDecoder_Params.decode = function(decoder) {
    var packed;
    var val = new InterfaceFactory_CreateAudioDecoder_Params();
    var numberOfBytes = decoder.readUint32();
    var version = decoder.readUint32();
    val.audioDecoder = decoder.decodeStruct(codec.InterfaceRequest);
    decoder.skip(1);
    decoder.skip(1);
    decoder.skip(1);
    decoder.skip(1);
    return val;
  };

  InterfaceFactory_CreateAudioDecoder_Params.encode = function(encoder, val) {
    var packed;
    encoder.writeUint32(InterfaceFactory_CreateAudioDecoder_Params.encodedSize);
    encoder.writeUint32(0);
    encoder.encodeStruct(codec.InterfaceRequest, val.audioDecoder);
    encoder.skip(1);
    encoder.skip(1);
    encoder.skip(1);
    encoder.skip(1);
  };
  function InterfaceFactory_CreateVideoDecoder_Params(values) {
    this.initDefaults_();
    this.initFields_(values);
  }


  InterfaceFactory_CreateVideoDecoder_Params.prototype.initDefaults_ = function() {
    this.videoDecoder = new bindings.InterfaceRequest();
  };
  InterfaceFactory_CreateVideoDecoder_Params.prototype.initFields_ = function(fields) {
    for(var field in fields) {
        if (this.hasOwnProperty(field))
          this[field] = fields[field];
    }
  };

  InterfaceFactory_CreateVideoDecoder_Params.validate = function(messageValidator, offset) {
    var err;
    err = messageValidator.validateStructHeader(offset, codec.kStructHeaderSize);
    if (err !== validator.validationError.NONE)
        return err;

    var kVersionSizes = [
      {version: 0, numBytes: 16}
    ];
    err = messageValidator.validateStructVersion(offset, kVersionSizes);
    if (err !== validator.validationError.NONE)
        return err;


    // validate InterfaceFactory_CreateVideoDecoder_Params.videoDecoder
    err = messageValidator.validateInterfaceRequest(offset + codec.kStructHeaderSize + 0, false)
    if (err !== validator.validationError.NONE)
        return err;

    return validator.validationError.NONE;
  };

  InterfaceFactory_CreateVideoDecoder_Params.encodedSize = codec.kStructHeaderSize + 8;

  InterfaceFactory_CreateVideoDecoder_Params.decode = function(decoder) {
    var packed;
    var val = new InterfaceFactory_CreateVideoDecoder_Params();
    var numberOfBytes = decoder.readUint32();
    var version = decoder.readUint32();
    val.videoDecoder = decoder.decodeStruct(codec.InterfaceRequest);
    decoder.skip(1);
    decoder.skip(1);
    decoder.skip(1);
    decoder.skip(1);
    return val;
  };

  InterfaceFactory_CreateVideoDecoder_Params.encode = function(encoder, val) {
    var packed;
    encoder.writeUint32(InterfaceFactory_CreateVideoDecoder_Params.encodedSize);
    encoder.writeUint32(0);
    encoder.encodeStruct(codec.InterfaceRequest, val.videoDecoder);
    encoder.skip(1);
    encoder.skip(1);
    encoder.skip(1);
    encoder.skip(1);
  };
  function InterfaceFactory_CreateDefaultRenderer_Params(values) {
    this.initDefaults_();
    this.initFields_(values);
  }


  InterfaceFactory_CreateDefaultRenderer_Params.prototype.initDefaults_ = function() {
    this.audioDeviceId = null;
    this.renderer = new bindings.InterfaceRequest();
  };
  InterfaceFactory_CreateDefaultRenderer_Params.prototype.initFields_ = function(fields) {
    for(var field in fields) {
        if (this.hasOwnProperty(field))
          this[field] = fields[field];
    }
  };

  InterfaceFactory_CreateDefaultRenderer_Params.validate = function(messageValidator, offset) {
    var err;
    err = messageValidator.validateStructHeader(offset, codec.kStructHeaderSize);
    if (err !== validator.validationError.NONE)
        return err;

    var kVersionSizes = [
      {version: 0, numBytes: 24}
    ];
    err = messageValidator.validateStructVersion(offset, kVersionSizes);
    if (err !== validator.validationError.NONE)
        return err;


    // validate InterfaceFactory_CreateDefaultRenderer_Params.audioDeviceId
    err = messageValidator.validateStringPointer(offset + codec.kStructHeaderSize + 0, false)
    if (err !== validator.validationError.NONE)
        return err;


    // validate InterfaceFactory_CreateDefaultRenderer_Params.renderer
    err = messageValidator.validateInterfaceRequest(offset + codec.kStructHeaderSize + 8, false)
    if (err !== validator.validationError.NONE)
        return err;

    return validator.validationError.NONE;
  };

  InterfaceFactory_CreateDefaultRenderer_Params.encodedSize = codec.kStructHeaderSize + 16;

  InterfaceFactory_CreateDefaultRenderer_Params.decode = function(decoder) {
    var packed;
    var val = new InterfaceFactory_CreateDefaultRenderer_Params();
    var numberOfBytes = decoder.readUint32();
    var version = decoder.readUint32();
    val.audioDeviceId = decoder.decodeStruct(codec.String);
    val.renderer = decoder.decodeStruct(codec.InterfaceRequest);
    decoder.skip(1);
    decoder.skip(1);
    decoder.skip(1);
    decoder.skip(1);
    return val;
  };

  InterfaceFactory_CreateDefaultRenderer_Params.encode = function(encoder, val) {
    var packed;
    encoder.writeUint32(InterfaceFactory_CreateDefaultRenderer_Params.encodedSize);
    encoder.writeUint32(0);
    encoder.encodeStruct(codec.String, val.audioDeviceId);
    encoder.encodeStruct(codec.InterfaceRequest, val.renderer);
    encoder.skip(1);
    encoder.skip(1);
    encoder.skip(1);
    encoder.skip(1);
  };
  function InterfaceFactory_CreateMediaPlayerRenderer_Params(values) {
    this.initDefaults_();
    this.initFields_(values);
  }


  InterfaceFactory_CreateMediaPlayerRenderer_Params.prototype.initDefaults_ = function() {
    this.clientExtension = new renderer_extensions$.MediaPlayerRendererClientExtensionPtr();
    this.renderer = new bindings.InterfaceRequest();
    this.rendererExtension = new bindings.InterfaceRequest();
  };
  InterfaceFactory_CreateMediaPlayerRenderer_Params.prototype.initFields_ = function(fields) {
    for(var field in fields) {
        if (this.hasOwnProperty(field))
          this[field] = fields[field];
    }
  };

  InterfaceFactory_CreateMediaPlayerRenderer_Params.validate = function(messageValidator, offset) {
    var err;
    err = messageValidator.validateStructHeader(offset, codec.kStructHeaderSize);
    if (err !== validator.validationError.NONE)
        return err;

    var kVersionSizes = [
      {version: 0, numBytes: 24}
    ];
    err = messageValidator.validateStructVersion(offset, kVersionSizes);
    if (err !== validator.validationError.NONE)
        return err;


    // validate InterfaceFactory_CreateMediaPlayerRenderer_Params.clientExtension
    err = messageValidator.validateInterface(offset + codec.kStructHeaderSize + 0, false);
    if (err !== validator.validationError.NONE)
        return err;


    // validate InterfaceFactory_CreateMediaPlayerRenderer_Params.renderer
    err = messageValidator.validateInterfaceRequest(offset + codec.kStructHeaderSize + 8, false)
    if (err !== validator.validationError.NONE)
        return err;


    // validate InterfaceFactory_CreateMediaPlayerRenderer_Params.rendererExtension
    err = messageValidator.validateInterfaceRequest(offset + codec.kStructHeaderSize + 12, false)
    if (err !== validator.validationError.NONE)
        return err;

    return validator.validationError.NONE;
  };

  InterfaceFactory_CreateMediaPlayerRenderer_Params.encodedSize = codec.kStructHeaderSize + 16;

  InterfaceFactory_CreateMediaPlayerRenderer_Params.decode = function(decoder) {
    var packed;
    var val = new InterfaceFactory_CreateMediaPlayerRenderer_Params();
    var numberOfBytes = decoder.readUint32();
    var version = decoder.readUint32();
    val.clientExtension = decoder.decodeStruct(new codec.Interface(renderer_extensions$.MediaPlayerRendererClientExtensionPtr));
    val.renderer = decoder.decodeStruct(codec.InterfaceRequest);
    val.rendererExtension = decoder.decodeStruct(codec.InterfaceRequest);
    return val;
  };

  InterfaceFactory_CreateMediaPlayerRenderer_Params.encode = function(encoder, val) {
    var packed;
    encoder.writeUint32(InterfaceFactory_CreateMediaPlayerRenderer_Params.encodedSize);
    encoder.writeUint32(0);
    encoder.encodeStruct(new codec.Interface(renderer_extensions$.MediaPlayerRendererClientExtensionPtr), val.clientExtension);
    encoder.encodeStruct(codec.InterfaceRequest, val.renderer);
    encoder.encodeStruct(codec.InterfaceRequest, val.rendererExtension);
  };
  function InterfaceFactory_CreateFlingingRenderer_Params(values) {
    this.initDefaults_();
    this.initFields_(values);
  }


  InterfaceFactory_CreateFlingingRenderer_Params.prototype.initDefaults_ = function() {
    this.presentationId = null;
    this.clientExtension = new renderer_extensions$.FlingingRendererClientExtensionPtr();
    this.renderer = new bindings.InterfaceRequest();
  };
  InterfaceFactory_CreateFlingingRenderer_Params.prototype.initFields_ = function(fields) {
    for(var field in fields) {
        if (this.hasOwnProperty(field))
          this[field] = fields[field];
    }
  };

  InterfaceFactory_CreateFlingingRenderer_Params.validate = function(messageValidator, offset) {
    var err;
    err = messageValidator.validateStructHeader(offset, codec.kStructHeaderSize);
    if (err !== validator.validationError.NONE)
        return err;

    var kVersionSizes = [
      {version: 0, numBytes: 32}
    ];
    err = messageValidator.validateStructVersion(offset, kVersionSizes);
    if (err !== validator.validationError.NONE)
        return err;


    // validate InterfaceFactory_CreateFlingingRenderer_Params.presentationId
    err = messageValidator.validateStringPointer(offset + codec.kStructHeaderSize + 0, false)
    if (err !== validator.validationError.NONE)
        return err;


    // validate InterfaceFactory_CreateFlingingRenderer_Params.clientExtension
    err = messageValidator.validateInterface(offset + codec.kStructHeaderSize + 8, false);
    if (err !== validator.validationError.NONE)
        return err;


    // validate InterfaceFactory_CreateFlingingRenderer_Params.renderer
    err = messageValidator.validateInterfaceRequest(offset + codec.kStructHeaderSize + 16, false)
    if (err !== validator.validationError.NONE)
        return err;

    return validator.validationError.NONE;
  };

  InterfaceFactory_CreateFlingingRenderer_Params.encodedSize = codec.kStructHeaderSize + 24;

  InterfaceFactory_CreateFlingingRenderer_Params.decode = function(decoder) {
    var packed;
    var val = new InterfaceFactory_CreateFlingingRenderer_Params();
    var numberOfBytes = decoder.readUint32();
    var version = decoder.readUint32();
    val.presentationId = decoder.decodeStruct(codec.String);
    val.clientExtension = decoder.decodeStruct(new codec.Interface(renderer_extensions$.FlingingRendererClientExtensionPtr));
    val.renderer = decoder.decodeStruct(codec.InterfaceRequest);
    decoder.skip(1);
    decoder.skip(1);
    decoder.skip(1);
    decoder.skip(1);
    return val;
  };

  InterfaceFactory_CreateFlingingRenderer_Params.encode = function(encoder, val) {
    var packed;
    encoder.writeUint32(InterfaceFactory_CreateFlingingRenderer_Params.encodedSize);
    encoder.writeUint32(0);
    encoder.encodeStruct(codec.String, val.presentationId);
    encoder.encodeStruct(new codec.Interface(renderer_extensions$.FlingingRendererClientExtensionPtr), val.clientExtension);
    encoder.encodeStruct(codec.InterfaceRequest, val.renderer);
    encoder.skip(1);
    encoder.skip(1);
    encoder.skip(1);
    encoder.skip(1);
  };
  function InterfaceFactory_CreateCdm_Params(values) {
    this.initDefaults_();
    this.initFields_(values);
  }


  InterfaceFactory_CreateCdm_Params.prototype.initDefaults_ = function() {
    this.keySystem = null;
    this.cdm = new bindings.InterfaceRequest();
  };
  InterfaceFactory_CreateCdm_Params.prototype.initFields_ = function(fields) {
    for(var field in fields) {
        if (this.hasOwnProperty(field))
          this[field] = fields[field];
    }
  };

  InterfaceFactory_CreateCdm_Params.validate = function(messageValidator, offset) {
    var err;
    err = messageValidator.validateStructHeader(offset, codec.kStructHeaderSize);
    if (err !== validator.validationError.NONE)
        return err;

    var kVersionSizes = [
      {version: 0, numBytes: 24}
    ];
    err = messageValidator.validateStructVersion(offset, kVersionSizes);
    if (err !== validator.validationError.NONE)
        return err;


    // validate InterfaceFactory_CreateCdm_Params.keySystem
    err = messageValidator.validateStringPointer(offset + codec.kStructHeaderSize + 0, false)
    if (err !== validator.validationError.NONE)
        return err;


    // validate InterfaceFactory_CreateCdm_Params.cdm
    err = messageValidator.validateInterfaceRequest(offset + codec.kStructHeaderSize + 8, false)
    if (err !== validator.validationError.NONE)
        return err;

    return validator.validationError.NONE;
  };

  InterfaceFactory_CreateCdm_Params.encodedSize = codec.kStructHeaderSize + 16;

  InterfaceFactory_CreateCdm_Params.decode = function(decoder) {
    var packed;
    var val = new InterfaceFactory_CreateCdm_Params();
    var numberOfBytes = decoder.readUint32();
    var version = decoder.readUint32();
    val.keySystem = decoder.decodeStruct(codec.String);
    val.cdm = decoder.decodeStruct(codec.InterfaceRequest);
    decoder.skip(1);
    decoder.skip(1);
    decoder.skip(1);
    decoder.skip(1);
    return val;
  };

  InterfaceFactory_CreateCdm_Params.encode = function(encoder, val) {
    var packed;
    encoder.writeUint32(InterfaceFactory_CreateCdm_Params.encodedSize);
    encoder.writeUint32(0);
    encoder.encodeStruct(codec.String, val.keySystem);
    encoder.encodeStruct(codec.InterfaceRequest, val.cdm);
    encoder.skip(1);
    encoder.skip(1);
    encoder.skip(1);
    encoder.skip(1);
  };
  function InterfaceFactory_CreateDecryptor_Params(values) {
    this.initDefaults_();
    this.initFields_(values);
  }


  InterfaceFactory_CreateDecryptor_Params.prototype.initDefaults_ = function() {
    this.cdmId = 0;
    this.decryptor = new bindings.InterfaceRequest();
  };
  InterfaceFactory_CreateDecryptor_Params.prototype.initFields_ = function(fields) {
    for(var field in fields) {
        if (this.hasOwnProperty(field))
          this[field] = fields[field];
    }
  };

  InterfaceFactory_CreateDecryptor_Params.validate = function(messageValidator, offset) {
    var err;
    err = messageValidator.validateStructHeader(offset, codec.kStructHeaderSize);
    if (err !== validator.validationError.NONE)
        return err;

    var kVersionSizes = [
      {version: 0, numBytes: 16}
    ];
    err = messageValidator.validateStructVersion(offset, kVersionSizes);
    if (err !== validator.validationError.NONE)
        return err;



    // validate InterfaceFactory_CreateDecryptor_Params.decryptor
    err = messageValidator.validateInterfaceRequest(offset + codec.kStructHeaderSize + 4, false)
    if (err !== validator.validationError.NONE)
        return err;

    return validator.validationError.NONE;
  };

  InterfaceFactory_CreateDecryptor_Params.encodedSize = codec.kStructHeaderSize + 8;

  InterfaceFactory_CreateDecryptor_Params.decode = function(decoder) {
    var packed;
    var val = new InterfaceFactory_CreateDecryptor_Params();
    var numberOfBytes = decoder.readUint32();
    var version = decoder.readUint32();
    val.cdmId = decoder.decodeStruct(codec.Int32);
    val.decryptor = decoder.decodeStruct(codec.InterfaceRequest);
    return val;
  };

  InterfaceFactory_CreateDecryptor_Params.encode = function(encoder, val) {
    var packed;
    encoder.writeUint32(InterfaceFactory_CreateDecryptor_Params.encodedSize);
    encoder.writeUint32(0);
    encoder.encodeStruct(codec.Int32, val.cdmId);
    encoder.encodeStruct(codec.InterfaceRequest, val.decryptor);
  };
  function InterfaceFactory_CreateCdmProxy_Params(values) {
    this.initDefaults_();
    this.initFields_(values);
  }


  InterfaceFactory_CreateCdmProxy_Params.prototype.initDefaults_ = function() {
    this.cdmGuid = null;
    this.cdmProxy = new bindings.InterfaceRequest();
  };
  InterfaceFactory_CreateCdmProxy_Params.prototype.initFields_ = function(fields) {
    for(var field in fields) {
        if (this.hasOwnProperty(field))
          this[field] = fields[field];
    }
  };

  InterfaceFactory_CreateCdmProxy_Params.validate = function(messageValidator, offset) {
    var err;
    err = messageValidator.validateStructHeader(offset, codec.kStructHeaderSize);
    if (err !== validator.validationError.NONE)
        return err;

    var kVersionSizes = [
      {version: 0, numBytes: 24}
    ];
    err = messageValidator.validateStructVersion(offset, kVersionSizes);
    if (err !== validator.validationError.NONE)
        return err;


    // validate InterfaceFactory_CreateCdmProxy_Params.cdmGuid
    err = messageValidator.validateStructPointer(offset + codec.kStructHeaderSize + 0, token$.Token, false);
    if (err !== validator.validationError.NONE)
        return err;


    // validate InterfaceFactory_CreateCdmProxy_Params.cdmProxy
    err = messageValidator.validateInterfaceRequest(offset + codec.kStructHeaderSize + 8, false)
    if (err !== validator.validationError.NONE)
        return err;

    return validator.validationError.NONE;
  };

  InterfaceFactory_CreateCdmProxy_Params.encodedSize = codec.kStructHeaderSize + 16;

  InterfaceFactory_CreateCdmProxy_Params.decode = function(decoder) {
    var packed;
    var val = new InterfaceFactory_CreateCdmProxy_Params();
    var numberOfBytes = decoder.readUint32();
    var version = decoder.readUint32();
    val.cdmGuid = decoder.decodeStructPointer(token$.Token);
    val.cdmProxy = decoder.decodeStruct(codec.InterfaceRequest);
    decoder.skip(1);
    decoder.skip(1);
    decoder.skip(1);
    decoder.skip(1);
    return val;
  };

  InterfaceFactory_CreateCdmProxy_Params.encode = function(encoder, val) {
    var packed;
    encoder.writeUint32(InterfaceFactory_CreateCdmProxy_Params.encodedSize);
    encoder.writeUint32(0);
    encoder.encodeStructPointer(token$.Token, val.cdmGuid);
    encoder.encodeStruct(codec.InterfaceRequest, val.cdmProxy);
    encoder.skip(1);
    encoder.skip(1);
    encoder.skip(1);
    encoder.skip(1);
  };
  var kInterfaceFactory_CreateAudioDecoder_Name = 0;
  var kInterfaceFactory_CreateVideoDecoder_Name = 1;
  var kInterfaceFactory_CreateDefaultRenderer_Name = 2;
  var kInterfaceFactory_CreateMediaPlayerRenderer_Name = 3;
  var kInterfaceFactory_CreateFlingingRenderer_Name = 4;
  var kInterfaceFactory_CreateCdm_Name = 5;
  var kInterfaceFactory_CreateDecryptor_Name = 6;
  var kInterfaceFactory_CreateCdmProxy_Name = 7;

  function InterfaceFactoryPtr(handleOrPtrInfo) {
    this.ptr = new bindings.InterfacePtrController(InterfaceFactory,
                                                   handleOrPtrInfo);
  }

  function InterfaceFactoryAssociatedPtr(associatedInterfacePtrInfo) {
    this.ptr = new associatedBindings.AssociatedInterfacePtrController(
        InterfaceFactory, associatedInterfacePtrInfo);
  }

  InterfaceFactoryAssociatedPtr.prototype =
      Object.create(InterfaceFactoryPtr.prototype);
  InterfaceFactoryAssociatedPtr.prototype.constructor =
      InterfaceFactoryAssociatedPtr;

  function InterfaceFactoryProxy(receiver) {
    this.receiver_ = receiver;
  }
  InterfaceFactoryPtr.prototype.createAudioDecoder = function() {
    return InterfaceFactoryProxy.prototype.createAudioDecoder
        .apply(this.ptr.getProxy(), arguments);
  };

  InterfaceFactoryProxy.prototype.createAudioDecoder = function(audioDecoder) {
    var params_ = new InterfaceFactory_CreateAudioDecoder_Params();
    params_.audioDecoder = audioDecoder;
    var builder = new codec.MessageV0Builder(
        kInterfaceFactory_CreateAudioDecoder_Name,
        codec.align(InterfaceFactory_CreateAudioDecoder_Params.encodedSize));
    builder.encodeStruct(InterfaceFactory_CreateAudioDecoder_Params, params_);
    var message = builder.finish();
    this.receiver_.accept(message);
  };
  InterfaceFactoryPtr.prototype.createVideoDecoder = function() {
    return InterfaceFactoryProxy.prototype.createVideoDecoder
        .apply(this.ptr.getProxy(), arguments);
  };

  InterfaceFactoryProxy.prototype.createVideoDecoder = function(videoDecoder) {
    var params_ = new InterfaceFactory_CreateVideoDecoder_Params();
    params_.videoDecoder = videoDecoder;
    var builder = new codec.MessageV0Builder(
        kInterfaceFactory_CreateVideoDecoder_Name,
        codec.align(InterfaceFactory_CreateVideoDecoder_Params.encodedSize));
    builder.encodeStruct(InterfaceFactory_CreateVideoDecoder_Params, params_);
    var message = builder.finish();
    this.receiver_.accept(message);
  };
  InterfaceFactoryPtr.prototype.createDefaultRenderer = function() {
    return InterfaceFactoryProxy.prototype.createDefaultRenderer
        .apply(this.ptr.getProxy(), arguments);
  };

  InterfaceFactoryProxy.prototype.createDefaultRenderer = function(audioDeviceId, renderer) {
    var params_ = new InterfaceFactory_CreateDefaultRenderer_Params();
    params_.audioDeviceId = audioDeviceId;
    params_.renderer = renderer;
    var builder = new codec.MessageV0Builder(
        kInterfaceFactory_CreateDefaultRenderer_Name,
        codec.align(InterfaceFactory_CreateDefaultRenderer_Params.encodedSize));
    builder.encodeStruct(InterfaceFactory_CreateDefaultRenderer_Params, params_);
    var message = builder.finish();
    this.receiver_.accept(message);
  };
  InterfaceFactoryPtr.prototype.createMediaPlayerRenderer = function() {
    return InterfaceFactoryProxy.prototype.createMediaPlayerRenderer
        .apply(this.ptr.getProxy(), arguments);
  };

  InterfaceFactoryProxy.prototype.createMediaPlayerRenderer = function(clientExtension, renderer, rendererExtension) {
    var params_ = new InterfaceFactory_CreateMediaPlayerRenderer_Params();
    params_.clientExtension = clientExtension;
    params_.renderer = renderer;
    params_.rendererExtension = rendererExtension;
    var builder = new codec.MessageV0Builder(
        kInterfaceFactory_CreateMediaPlayerRenderer_Name,
        codec.align(InterfaceFactory_CreateMediaPlayerRenderer_Params.encodedSize));
    builder.encodeStruct(InterfaceFactory_CreateMediaPlayerRenderer_Params, params_);
    var message = builder.finish();
    this.receiver_.accept(message);
  };
  InterfaceFactoryPtr.prototype.createFlingingRenderer = function() {
    return InterfaceFactoryProxy.prototype.createFlingingRenderer
        .apply(this.ptr.getProxy(), arguments);
  };

  InterfaceFactoryProxy.prototype.createFlingingRenderer = function(presentationId, clientExtension, renderer) {
    var params_ = new InterfaceFactory_CreateFlingingRenderer_Params();
    params_.presentationId = presentationId;
    params_.clientExtension = clientExtension;
    params_.renderer = renderer;
    var builder = new codec.MessageV0Builder(
        kInterfaceFactory_CreateFlingingRenderer_Name,
        codec.align(InterfaceFactory_CreateFlingingRenderer_Params.encodedSize));
    builder.encodeStruct(InterfaceFactory_CreateFlingingRenderer_Params, params_);
    var message = builder.finish();
    this.receiver_.accept(message);
  };
  InterfaceFactoryPtr.prototype.createCdm = function() {
    return InterfaceFactoryProxy.prototype.createCdm
        .apply(this.ptr.getProxy(), arguments);
  };

  InterfaceFactoryProxy.prototype.createCdm = function(keySystem, cdm) {
    var params_ = new InterfaceFactory_CreateCdm_Params();
    params_.keySystem = keySystem;
    params_.cdm = cdm;
    var builder = new codec.MessageV0Builder(
        kInterfaceFactory_CreateCdm_Name,
        codec.align(InterfaceFactory_CreateCdm_Params.encodedSize));
    builder.encodeStruct(InterfaceFactory_CreateCdm_Params, params_);
    var message = builder.finish();
    this.receiver_.accept(message);
  };
  InterfaceFactoryPtr.prototype.createDecryptor = function() {
    return InterfaceFactoryProxy.prototype.createDecryptor
        .apply(this.ptr.getProxy(), arguments);
  };

  InterfaceFactoryProxy.prototype.createDecryptor = function(cdmId, decryptor) {
    var params_ = new InterfaceFactory_CreateDecryptor_Params();
    params_.cdmId = cdmId;
    params_.decryptor = decryptor;
    var builder = new codec.MessageV0Builder(
        kInterfaceFactory_CreateDecryptor_Name,
        codec.align(InterfaceFactory_CreateDecryptor_Params.encodedSize));
    builder.encodeStruct(InterfaceFactory_CreateDecryptor_Params, params_);
    var message = builder.finish();
    this.receiver_.accept(message);
  };
  InterfaceFactoryPtr.prototype.createCdmProxy = function() {
    return InterfaceFactoryProxy.prototype.createCdmProxy
        .apply(this.ptr.getProxy(), arguments);
  };

  InterfaceFactoryProxy.prototype.createCdmProxy = function(cdmGuid, cdmProxy) {
    var params_ = new InterfaceFactory_CreateCdmProxy_Params();
    params_.cdmGuid = cdmGuid;
    params_.cdmProxy = cdmProxy;
    var builder = new codec.MessageV0Builder(
        kInterfaceFactory_CreateCdmProxy_Name,
        codec.align(InterfaceFactory_CreateCdmProxy_Params.encodedSize));
    builder.encodeStruct(InterfaceFactory_CreateCdmProxy_Params, params_);
    var message = builder.finish();
    this.receiver_.accept(message);
  };

  function InterfaceFactoryStub(delegate) {
    this.delegate_ = delegate;
  }
  InterfaceFactoryStub.prototype.createAudioDecoder = function(audioDecoder) {
    return this.delegate_ && this.delegate_.createAudioDecoder && this.delegate_.createAudioDecoder(audioDecoder);
  }
  InterfaceFactoryStub.prototype.createVideoDecoder = function(videoDecoder) {
    return this.delegate_ && this.delegate_.createVideoDecoder && this.delegate_.createVideoDecoder(videoDecoder);
  }
  InterfaceFactoryStub.prototype.createDefaultRenderer = function(audioDeviceId, renderer) {
    return this.delegate_ && this.delegate_.createDefaultRenderer && this.delegate_.createDefaultRenderer(audioDeviceId, renderer);
  }
  InterfaceFactoryStub.prototype.createMediaPlayerRenderer = function(clientExtension, renderer, rendererExtension) {
    return this.delegate_ && this.delegate_.createMediaPlayerRenderer && this.delegate_.createMediaPlayerRenderer(clientExtension, renderer, rendererExtension);
  }
  InterfaceFactoryStub.prototype.createFlingingRenderer = function(presentationId, clientExtension, renderer) {
    return this.delegate_ && this.delegate_.createFlingingRenderer && this.delegate_.createFlingingRenderer(presentationId, clientExtension, renderer);
  }
  InterfaceFactoryStub.prototype.createCdm = function(keySystem, cdm) {
    return this.delegate_ && this.delegate_.createCdm && this.delegate_.createCdm(keySystem, cdm);
  }
  InterfaceFactoryStub.prototype.createDecryptor = function(cdmId, decryptor) {
    return this.delegate_ && this.delegate_.createDecryptor && this.delegate_.createDecryptor(cdmId, decryptor);
  }
  InterfaceFactoryStub.prototype.createCdmProxy = function(cdmGuid, cdmProxy) {
    return this.delegate_ && this.delegate_.createCdmProxy && this.delegate_.createCdmProxy(cdmGuid, cdmProxy);
  }

  InterfaceFactoryStub.prototype.accept = function(message) {
    var reader = new codec.MessageReader(message);
    switch (reader.messageName) {
    case kInterfaceFactory_CreateAudioDecoder_Name:
      var params = reader.decodeStruct(InterfaceFactory_CreateAudioDecoder_Params);
      this.createAudioDecoder(params.audioDecoder);
      return true;
    case kInterfaceFactory_CreateVideoDecoder_Name:
      var params = reader.decodeStruct(InterfaceFactory_CreateVideoDecoder_Params);
      this.createVideoDecoder(params.videoDecoder);
      return true;
    case kInterfaceFactory_CreateDefaultRenderer_Name:
      var params = reader.decodeStruct(InterfaceFactory_CreateDefaultRenderer_Params);
      this.createDefaultRenderer(params.audioDeviceId, params.renderer);
      return true;
    case kInterfaceFactory_CreateMediaPlayerRenderer_Name:
      var params = reader.decodeStruct(InterfaceFactory_CreateMediaPlayerRenderer_Params);
      this.createMediaPlayerRenderer(params.clientExtension, params.renderer, params.rendererExtension);
      return true;
    case kInterfaceFactory_CreateFlingingRenderer_Name:
      var params = reader.decodeStruct(InterfaceFactory_CreateFlingingRenderer_Params);
      this.createFlingingRenderer(params.presentationId, params.clientExtension, params.renderer);
      return true;
    case kInterfaceFactory_CreateCdm_Name:
      var params = reader.decodeStruct(InterfaceFactory_CreateCdm_Params);
      this.createCdm(params.keySystem, params.cdm);
      return true;
    case kInterfaceFactory_CreateDecryptor_Name:
      var params = reader.decodeStruct(InterfaceFactory_CreateDecryptor_Params);
      this.createDecryptor(params.cdmId, params.decryptor);
      return true;
    case kInterfaceFactory_CreateCdmProxy_Name:
      var params = reader.decodeStruct(InterfaceFactory_CreateCdmProxy_Params);
      this.createCdmProxy(params.cdmGuid, params.cdmProxy);
      return true;
    default:
      return false;
    }
  };

  InterfaceFactoryStub.prototype.acceptWithResponder =
      function(message, responder) {
    var reader = new codec.MessageReader(message);
    switch (reader.messageName) {
    default:
      return false;
    }
  };

  function validateInterfaceFactoryRequest(messageValidator) {
    var message = messageValidator.message;
    var paramsClass = null;
    switch (message.getName()) {
      case kInterfaceFactory_CreateAudioDecoder_Name:
        if (!message.expectsResponse() && !message.isResponse())
          paramsClass = InterfaceFactory_CreateAudioDecoder_Params;
      break;
      case kInterfaceFactory_CreateVideoDecoder_Name:
        if (!message.expectsResponse() && !message.isResponse())
          paramsClass = InterfaceFactory_CreateVideoDecoder_Params;
      break;
      case kInterfaceFactory_CreateDefaultRenderer_Name:
        if (!message.expectsResponse() && !message.isResponse())
          paramsClass = InterfaceFactory_CreateDefaultRenderer_Params;
      break;
      case kInterfaceFactory_CreateMediaPlayerRenderer_Name:
        if (!message.expectsResponse() && !message.isResponse())
          paramsClass = InterfaceFactory_CreateMediaPlayerRenderer_Params;
      break;
      case kInterfaceFactory_CreateFlingingRenderer_Name:
        if (!message.expectsResponse() && !message.isResponse())
          paramsClass = InterfaceFactory_CreateFlingingRenderer_Params;
      break;
      case kInterfaceFactory_CreateCdm_Name:
        if (!message.expectsResponse() && !message.isResponse())
          paramsClass = InterfaceFactory_CreateCdm_Params;
      break;
      case kInterfaceFactory_CreateDecryptor_Name:
        if (!message.expectsResponse() && !message.isResponse())
          paramsClass = InterfaceFactory_CreateDecryptor_Params;
      break;
      case kInterfaceFactory_CreateCdmProxy_Name:
        if (!message.expectsResponse() && !message.isResponse())
          paramsClass = InterfaceFactory_CreateCdmProxy_Params;
      break;
    }
    if (paramsClass === null)
      return validator.validationError.NONE;
    return paramsClass.validate(messageValidator, messageValidator.message.getHeaderNumBytes());
  }

  function validateInterfaceFactoryResponse(messageValidator) {
    return validator.validationError.NONE;
  }

  var InterfaceFactory = {
    name: 'media.mojom.InterfaceFactory',
    kVersion: 0,
    ptrClass: InterfaceFactoryPtr,
    proxyClass: InterfaceFactoryProxy,
    stubClass: InterfaceFactoryStub,
    validateRequest: validateInterfaceFactoryRequest,
    validateResponse: null,
  };
  InterfaceFactoryStub.prototype.validator = validateInterfaceFactoryRequest;
  InterfaceFactoryProxy.prototype.validator = null;
  exports.InterfaceFactory = InterfaceFactory;
  exports.InterfaceFactoryPtr = InterfaceFactoryPtr;
  exports.InterfaceFactoryAssociatedPtr = InterfaceFactoryAssociatedPtr;
})();