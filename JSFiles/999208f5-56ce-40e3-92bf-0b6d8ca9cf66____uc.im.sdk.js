console.log('sdk init.')


//枚举
var MemberType_UNKNOWN = -1000//未知
var MemberType_GUEST = -2//游客
var MemberType_LIMITED = -1//受限
var MemberType_NORMAL = 0//
var MemberType_CREATOR = 1
var MemberType_ADMIN = 2

var MsgTypeEnum_undef = -1//Unknown
var MsgTypeEnum_text = 0//""
var MsgTypeEnum_image = 1//图片
var MsgTypeEnum_audio = 2//语音
var MsgTypeEnum_video = 3//视频
var MsgTypeEnum_location = 4//位置
var MsgTypeEnum_file = 6//文件
var MsgTypeEnum_avchat = 7//音视频通话
var MsgTypeEnum_notification = 5//通知消息
var MsgTypeEnum_tip = 10//提醒消息
var MsgTypeEnum_broadcast = 11//""
var MsgTypeEnum_control = 12//""
var MsgTypeEnum_custom = 100//自定义消息

var MsgStatusEnum_draft = -1//草案
var MsgStatusEnum_sending = 0//发送中
var MsgStatusEnum_success = 1//成功
var MsgStatusEnum_fail = 2//失败
var MsgStatusEnum_read = 2//阅读
var MsgStatusEnum_unread = 2//未阅读

var SessionTypeEnum_None = -1//没有
var SessionTypeEnum_P2P = 0//P2P
var SessionTypeEnum_Team = 1//小组
var SessionTypeEnum_Broadcast = 2//广播
var SessionTypeEnum_System = 10001//系统
var SessionTypeEnum_ChatRoom = 10002//房间

var NotificationType_ChatRoomMemberIn = 301
var NotificationType_ChatRoomMemberExit = 302
var NotificationType_ChatRoomMemberBlackAdd = 303
var NotificationType_ChatRoomMemberBlackRemove = 304
var NotificationType_ChatRoomMemberMuteAdd = 305
var NotificationType_ChatRoomMemberMuteRemove = 306
var NotificationType_ChatRoomManagerAdd = 307
var NotificationType_ChatRoomManagerRemove = 308
var NotificationType_ChatRoomCommonAdd = 309
var NotificationType_ChatRoomCommonRemove = 310
var NotificationType_ChatRoomClose = 311
var NotificationType_ChatRoomInfoUpdated = 312
var NotificationType_ChatRoomMemberKicked = 313
var NotificationType_ChatRoomMemberTempMuteAdd = 314
var NotificationType_ChatRoomMemberTempMuteRemove = 315
var NotificationType_ChatRoomMyRoomRoleUpdated = 316
var NotificationType_ChatRoomQueueChange = 317
var NotificationType_ChatRoomRoomMuted = 318
var NotificationType_ChatRoomRoomDeMuted = 319
var NotificationType_ChatRoomMemberGlobalMuted = 320
var NotificationType_ChatRoomMemberGlobalDeMuted = 321

var roomType
var subchannels = {}
var psubchannels = {}
var userLoginState = false
var isManuClose = false
var retryConn = false
var ws
var userInfo = {}
var retryConnTimer
var isSSL = false

function myAjax(method, url, data, callback, type, async, headers) {
  //创建兼容 XMLHttpRequest 对象
  var xhr
  if (window.XMLHttpRequest) {//IE7+, Firefox, Chrome, Opera, Safari
    xhr = new XMLHttpRequest()
  } else {// code for IE6, IE5
    xhr = new ActiveXObject('Microsoft.XMLHTTP')
  }

  //给请求添加状态变化事件处理函数
  xhr.onreadystatechange = function () {
    //判断状态码
    if (xhr.status == 200 && xhr.readyState == 4) {
      //根据type参数，判断返回的内容需要进行怎样的处理
      if (type == 'json') {
        //获得 json 形式的响应数据，并使用parse方法解析
        var res = JSON.parse(xhr.responseText)
      } else if (type == 'xml') {
        //获得 XML 形式的响应数据
        var res = responseXML
      } else {
        //获得字符串形式的响应数据
        var res = xhr.responseText
      }
      //调用回调函数,并将响应数据传入回调函数
      callback(res)
    }
  }

  //判断data是否有数据
  var param = ''

  //判断method是否为get
  if (method == 'get') {
    if (JSON.stringify(data) != '{}') {
      url += '?'
      for (var i in data) {
        param += i + '=' + data[i] + '&'   //将js对象重组，拼接成url参数存入param变量中
      }
      //使用slice函数提取一部分字符串，这里主要是为了去除拼接的最后一个&字符
      //slice函数：返回一个新的字符串。包括字符串从 start 开始（包括 start）到 end 结束（不包括 end）为止的所有字符。
      param = param.slice(0, param.length - 1)
    }
    //这里使用stringify方法将js对象格式化为json字符串
    //是则将数据拼接在url后面
    url = url + param
  }

  async === undefined ? async = true : async
  //初始化请求
  xhr.open(method, url, async)

  //如果method == post
  if (method == 'post') {
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    if (headers) {
      for (var i = 0; i < headers.length; i++) {
        xhr.setRequestHeader(item, headers[i])
      }
    }
    //发送请求
    xhr.send(data)
  } else {
    //发送请求
    xhr.send(null)
  }

}

(function (root, factory) {
  var ucim = factory(root)
  if (typeof define === 'function' && define.amd) {
    define([], factory)
  } else if (typeof module !== 'undefined' && module.exports) {
    console.log('using module exports!')
    module.exports = factory()
  } else {
    root.ucim = factory()
  }
}(this, function (root, undefined) {

  var ucim = {}
  /**
   * 连接管理
   */
  ucim.UcimConnectionManager = function () {
    ucim.currentConnection = this

    this.getServerInfo = function (url, grantType, username, password) {
      var data = {
        grant_type: grantType,
        username: username,
        'clienttype': '3'
      }
      var param = ''
      if (JSON.stringify(data) != '{}') {
        url += '?'
        for (var i in data) {
          param += i + '=' + data[i] + '&'   //将js对象重组，拼接成url参数存入param变量中
        }
        //使用slice函数提取一部分字符串，这里主要是为了去除拼接的最后一个&字符
        //slice函数：返回一个新的字符串。包括字符串从 start 开始（包括 start）到 end 结束（不包括 end）为止的所有字符。
        param = param.slice(0, param.length - 1)
      }

      myAjax(
        'post',
        url,
        param,
        function (data) {
          json = data
        },
        'json',
        false,
        {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }

      )
      return json
    }

    this.getVerifyInfo = function (url, token) {
      var param = {
        'type': 'verify',
        'clienttype': '3',
        'token': token
      }
      myAjax(
        'post',
        url,
        JSON.stringify(param),
        function (data) {
          json = data
        },
        'json',
        false,
        {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
      )
      return json
    }

    this.startConnect = function (connObj) {

      isManuClose = false
      connParam = connObj
      console.log('连接:', connObj)
      if (connObj.url.indexOf('wss') == 0) {
        isSSL = true
      }
      this.ws = new ucimws(connObj.url)
      ws = this.ws
      this.ws.onconnecting = function (event) {
        console.log('socket:onconnecting:', event)
        // sendMsg("wcj");
        if (connObj.onconnecting && typeof connObj.onconnecting === 'function') {
          connObj.onconnecting(event)
        }
      }
      this.ws.onopen = function (event) {
        if (!isManuClose && retryConnTimer) {
          clearInterval(retryConnTimer)
        }
        console.log('socket:onopen:', event)
        if (connObj.onopen && typeof connObj.onopen === 'function') {
          connObj.onopen(event)
        }
      }
      this.ws.onclose = function (event) {
        console.log('socket.onclose:', event)
        console.log('WebSocket 被你关闭了！')
        if (typeof ucim.keepAliveTimer != 'undefined') {
          window.clearInterval(ucim.keepAliveTimer)
        }
        if (connObj.onclose && typeof connObj.onclose === 'function') {
          connObj.onclose(event)
        }
        if (!isManuClose && userLoginState) {
          retryConnTimer = setTimeout(function () {
            console.log('ws重连....')
            ws.open()
            retryConn = true
          }, 3000)
        }
      }
      this.ws.onmessage = function (event) {
        console.log('socket:onmessage:', event)
        console.log('收到消息！"' + event.data + '"')
        // socket.close()
        if (connObj.onmessage && typeof connObj.onmessage === 'function') {
          connObj.onmessage(event)
        }
      }
    }
    this.sendMsg = function (packageMsg) {
      console.log('socket:sendMsg:', packageMsg)
      this.ws.send(packageMsg)
    }
    this.close = function () {
      isManuClose = true
      console.log('ws:close')
      this.ws.close()
    }
    this.openEx = function (hostUrl) {
      this.ws.openEx(hostUrl)
    }
  }

  ucim._UcimConnectionManager = new ucim.UcimConnectionManager()
  ucim.TAG_Compressed = 1 << 0
  ucim.TAG_Response = 1 << 1
  ucim.TAG_Encryped = 1 << 2
  ucim.TAG_WithField = 1 << 3
  ucim.TAG_Proto = 1 << 4

  ucim.PacketHelper = function () {
    this.encodeLength = function (number) {
      var buf = new Array(4)
      var len = 0

      do {
        var digit = (number % 128)
        number = Math.floor(number / 128)
        if (number > 0) {
          digit = (digit | 0x80)
        }

        buf[len++] = digit
      } while (number > 0)

      // var value = new Array(len);
      var dataBuffer = dcodeIO.ByteBuffer.allocate(len, true, false)
      for (var i = 0; i < len; i++) {
        dataBuffer.writeByte(buf[i])
      }
      dataBuffer.flip()
      return dataBuffer
    }
  }

  ucim._PacketHelper = new ucim.PacketHelper()

  ucim.SendPacket = function () {
    var buf = new ByteBuffer(1024)

    this.position = function () {
      return 0
    }
  }

  ucim.RecvPacket = function (data) {
    var buf = new ByteBuffer(1024)

  }

  /**
   * 消息体
   */
  ucim.UcimMessageVO = function () {

    this.id = 0
    this.from = ''
    this.to = ''
    this.type = ''
    this.body = ''
    this.data = {}

    this.buildId = function (id) {
      this.id = id
      return this
    }
    this.buildFrom = function (from) {
      this.from = from
      return this
    }

  }


  /**
   * 聊天室管理
   */
  ucim.UcimServiceRoom = function () {

  }

  /**
   * 工具类
   */
  ucim.UcimUtils = function () {
    this.strToUTF8Bytes = function (text) {
      // var bytes = new Array();
      // var len, c;
      // len = text.length;
      // for (var i = 0; i < len; i++) {
      // c = text.charCodeAt(i);
      // if (c >= 0x010000 && c <= 0x10FFFF) {
      // bytes.push(((c >> 18) & 0x07) | 0xF0);
      // bytes.push(((c >> 12) & 0x3F) | 0x80);
      // bytes.push(((c >> 6) & 0x3F) | 0x80);
      // bytes.push((c & 0x3F) | 0x80);
      // } else if (c >= 0x000800 && c <= 0x00FFFF) {
      // bytes.push(((c >> 12) & 0x0F) | 0xE0);
      // bytes.push(((c >> 6) & 0x3F) | 0x80);
      // bytes.push((c & 0x3F) | 0x80);
      // } else if (c >= 0x000080 && c <= 0x0007FF) {
      // bytes.push(((c >> 6) & 0x1F) | 0xC0);
      // bytes.push((c & 0x3F) | 0x80);
      // } else {
      // bytes.push(c & 0xFF);
      // }
      // }
      // return bytes;
      var result = [], i = 0
      text = encodeURI(text)
      while (i < text.length) {
        var c = text.charCodeAt(i++)

        // if it is a % sign, encode the following 2 bytes as a hex value
        if (c === 37) {
          result.push(parseInt(text.substr(i, 2), 16))
          i += 2

          // otherwise, just the actual byte
        } else {
          result.push(c)
        }
      }

      return this.coerceArray(result)
    }

    this.coerceArray = function (arg, copy) {

      // ArrayBuffer view
      if (arg.buffer && arg.name === 'Uint8Array') {

        if (copy) {
          if (arg.slice) {
            arg = arg.slice()
          } else {
            arg = Array.prototype.slice.call(arg)
          }
        }

        return arg
      }

      // It's an array; check it is a valid representation of a byte
      if (Array.isArray(arg)) {
        if (!this.checkInts(arg)) {
          throw new Error('Array contains invalid value: ' + arg)
        }

        return new Uint8Array(arg)
      }

      // Something else, but behaves like an array (maybe a Buffer? Arguments?)
      if (this.checkInt(arg.length) && checkInts(arg)) {
        return new Uint8Array(arg)
      }

      throw new Error('unsupported array-like object')
    }

    this.checkInt = function (value) {
      return (parseInt(value) === value)
    }
    this.checkInts = function (arrayish) {
      if (!this.checkInt(arrayish.length)) { return false }
      for (var i = 0; i < arrayish.length; i++) {
        if (!this.checkInt(arrayish[i]) || arrayish[i] < 0 || arrayish[i] > 255) {
          return false
        }
      }
      return true
    }

    this.strToBytes = function (str) {
      var ch, st, re = []
      for (var i = 0; i < str.length; i++) {
        ch = str.charCodeAt(i)  // get char
        st = []                 // set up "stack"
        do {
          st.push(ch & 0xFF)  // push byte to stack
          ch = ch >> 8          // shift value down by 1 byte
        }
        while (ch)
        // add stack contents to result
        // done because chars have "wrong" endianness
        re = re.concat(st.reverse())
      }
      // return an array of bytes
      return re
    }

    this.bytesToHex = function (arr) {
      var str = ''
      for (var i = 0; i < arr.length; i++) {
        var tmp = arr[i].toString(16)
        if (tmp.length == 1) {
          tmp = '0' + tmp
        }
        str += tmp
      }
      return str
    }

    this._arrayBufferToBase64 = function (buffer) {

      var binary = ''

      var bytes = new Uint8Array(buffer)

      var len = bytes.byteLength

      for (var i = 0; i < len; i++) {

        binary += String.fromCharCode(bytes[i])
      }

      return window.btoa(binary)

    }

    this._arrayBufferToHexString = function (buffer) {

      var binary = ''

      var bytes = new Uint8Array(buffer)

      var hexBytes = []

      for (var i = 0; i < bytes.length; ++i) {

        var byteString = bytes[i].toString(16)

        if (byteString.length < 2)

          byteString = '0' + byteString

        hexBytes.push(byteString)

      }

      return hexBytes.join('')

    }

    this.hexStringToUint8Array = function (hexString) {

      if (hexString.length % 2 != 0)

        throw 'Invalid hexString'

      var arrayBuffer = new Uint8Array(hexString.length / 2)

      for (var i = 0; i < hexString.length; i += 2) {

        var byteValue = parseInt(hexString.substr(i, 2), 16)

        if (byteValue == NaN)

          throw 'Invalid hexString'

        arrayBuffer[i / 2] = byteValue

      }

      return arrayBuffer

    }

    this.bytesToHexString = function (bytes) {

      if (!bytes)

        return null

      bytes = new Uint8Array(bytes)

      var hexBytes = []

      for (var i = 0; i < bytes.length; ++i) {

        var byteString = bytes[i].toString(16)

        if (byteString.length < 2)

          byteString = '0' + byteString

        hexBytes.push(byteString)

      }

      return hexBytes.join('')

    }

    this.getLength = function (byteBuffer) { // max length is 0x7FFFFFD
      var place = 1
      var len = 0

      var digit
      do {
        digit = byteBuffer.readByte()
        len += (digit & 0x7F) * place
        place <<= 7 // left shift a byte palce
      } while ((digit & 0x80) != 0)

      return len
    }
  }

  return ucim
}))

ucim._UcimUtils = new ucim.UcimUtils()


this.SAProperty = function () {
  var propertyArray = new Array()

  this.decodeFrom = function (byteBuffer) {
    var len = ucim._UcimUtils.getLength(byteBuffer)

    for (var i = 0; i < len; ++i) {
      var valueAt = ucim._UcimUtils.getLength(byteBuffer)
      //var valueLen = ucim._UcimUtils.getLength(byteBuffer);
      //this.putString(valueAt, byteBuffer.readUTF8String(valueLen));
      var propsValue = byteBuffer.readVString()//byteBuffer.readUTF8String(valueLen);
      //console.log("decodeFrom ", valueAt, " ", propsValue);
      propertyArray[valueAt] = propsValue
    }
  }

  this.getArray = function () {
    return propertyArray
  }

  this.putString = function (index, val) {
    if (typeof val != 'string') return
    propertyArray[index] = val
  }

  this.getString = function (index) {
    return propertyArray[index]
  }

  this.putInt = function (index, val) {
    if (parseFloat(val).toString() == 'NaN') return
    propertyArray[index] = val.toString()
  }

  this.getInt = function (index) {
    var val = parseInt(propertyArray[index])
    if (val.toString() == 'NaN') {
      return false
    }
    return val
  }

  this.putLong = function (index, val) {
    if (typeof val != 'long') return
    propertyArray[index] = val.toString()
  }

  this.getLong = function (index) {
    var val = propertyArray[index]
    if (typeof val == 'undefined' || val == '') {
      return 0
    }
    return Number(val.replace(/\-/g, ''))
  }

  this.length = function () {
    var n = 0

    for (var i in propertyArray) {
      n++
    }

    return n
  }
}

this.ChatRoomMessage = function () {
  var uuid
  var msgType
  var attachJson
  var content
  var remoteext
  var nIMAntiSpamOption
  var time
  var fromAccount
  var sessionId

  //新增
  var sessiontype = -1
  var msgtype
  var status
  var direct = 1
  var status2
  var serverid
  var attachmentJson
  var configJson
  var localext
  var payload
  var pushContent
  var pushoption
  var fromClientType = 1
  var antispamoption
  var channel

  this.setAntispamoption = function (v) {
    antispamoption = v
  }

  this.setAntispamoption = function () {
    return antispamoption
  }

  this.setFromClientType = function (v) {
    fromClientType = v
  }

  this.getFromClientType = function () {
    return fromClientType
  }

  this.setPushoption = function (v) {
    pushoption = v
  }

  this.getPushoption = function () {
    return pushoption
  }

  this.setPushContent = function (v) {
    pushContent = v
  }

  this.getPushContent = function () {
    return pushContent
  }

  this.setPayload = function (v) {
    payload = v
  }

  this.getPayload = function () {
    return payload
  }

  this.setLocalext = function (v) {
    localext = v
  }

  this.getLocalext = function () {
    return localext
  }

  this.setConfigJson = function (v) {
    configJson = v
  }

  this.getConfigJson = function () {
    return configJson
  }

  this.setAttachmentJson = function (v) {
    attachmentJson = v
  }

  this.getAttachmentJson = function () {
    return attachmentJson
  }

  this.setServerid = function (v) {
    serverid = v
  }

  this.getServerid = function () {
    return serverid
  }

  this.setStatus2 = function (v) {
    status2 = v
  }

  this.getStatus2 = function () {
    return status2
  }

  this.setDirect = function (v) {
    direct = v
  }

  this.getDirect = function () {
    return direct
  }

  this.setStatus = function (v) {
    status = v
  }

  this.getStatus = function () {
    return status
  }

  this.setMsgtype = function (v) {
    this.msgtype = v
  }

  this.getMsgtype = function () {
    return this.msgtype
  }

  this.setSessiontype = function (v) {
    sessiontype = v
  }

  this.getSessiontype = function () {
    return sessiontype
  }

  this.setUuid = function (v) {
    uuid = v
  }

  this.getUuid = function () {
    return uuid
  }

  this.setMsgType = function (v) {
    msgType = v
  }

  this.getMsgType = function () {
    return msgType
  }

  this.setAttachJson = function (v) {
    attachJson = v
  }

  this.getAttachJson = function (v) {
    if (v);
    return attachJson
  }

  this.setContent = function (v) {
    content = v
  }

  this.getContent = function () {
    return content
  }

  this.setRemoteext = function (v) {
    remoteext = v
  }

  this.getRemoteext = function () {
    return remoteext
  }

  this.setNIMAntiSpamOption = function (v) {
    nIMAntiSpamOption = v
  }

  this.getNIMAntiSpamOption = function () {
    return nIMAntiSpamOption
  }

  this.setTime = function (v) {
    time = v
  }

  this.getTime = function () {
    return time
  }

  this.setFromAccount = function (v) {
    fromAccount = v
  }

  this.getFromAccount = function () {
    return fromAccount
  }

  this.setSessionId = function (v) {
    sessionId = v
    this.setChannel(v)
  }

  this.getSessionId = function () {
    return sessionId
  }

  // 原ChatRoomMessageExtension
  var roleInfoTimeTag
  var senderNick
  var senderAvatar
  var senderExtension

  this.setRoleInfoTimeTag = function (v) {
    roleInfoTimeTag = v
  }

  this.getRoleInfoTimeTag = function () {
    return roleInfoTimeTag
  }

  this.setSenderNick = function (v) {
    senderNick = v
  }

  this.getSenderNick = function () {
    return senderNick
  }

  this.setSenderAvatar = function (v) {
    senderAvatar = v
  }

  this.getSenderAvatar = function () {
    return senderAvatar
  }

  this.setSenderExtension = function (v) {
    senderExtension = v
  }

  this.getSenderExtension = function () {
    return senderExtension
  }

  this.setChannel = function (v) {
    channel = v
  }

  this.getChannel = function () {
    return channel
  }
}

this.ChatRoomInfo = function () {
  var announcement
  var broadcastUrl
  var creator
  var extension//json字符串
  var mute
  var name
  var onlineUserCount
  var roomId
  var validFlag

  this.setAnnouncement = function (v) {
    announcement = v
  }

  this.getAnnouncement = function () {
    return announcement
  }

  this.setBroadcastUrl = function (v) {
    broadcastUrl = v
  }

  this.getBroadcastUrl = function () {
    return broadcastUrl
  }

  this.setCreator = function (v) {
    creator = v
  }

  this.getCreator = function () {
    return creator
  }

  this.setExtension = function (v) {
    extension = v
  }

  this.getExtension = function () {
    return extension
  }

  this.setMute = function (v) {
    mute = v
  }

  this.getMute = function () {
    return mute
  }

  this.setName = function (v) {
    name = v
  }

  this.getName = function () {
    return name
  }

  this.setOnlineUserCount = function (v) {
    onlineUserCount = v
  }

  this.getOnlineUserCount = function () {
    return onlineUserCount
  }

  this.setRoomId = function (v) {
    roomId = v
  }

  this.getRoomId = function () {
    return roomId
  }

  this.setValidFlag = function (v) {
    validFlag = v
  }

  this.getValidFlag = function () {
    return validFlag
  }

}

this.ChatRoomMember = function () {
  var account
  var avatar
  var enterTime
  var extension//json字符串
  var inBlackList
  var isMuted
  var isOnline
  var isTempMuted
  var isValid
  var memberLevel
  var nick
  var roomId
  var tempMuteDuration
  var type
  var updateTime
  var mutedTime

  this.setMutedTime = function (v) {
    mutedTime = v
  }

  this.getMutedTime = function () {
    return mutedTime
  }

  this.setAccount = function (v) {
    account = v
  }

  this.getAccount = function () {
    return account
  }

  this.setAvatar = function (v) {
    avatar = v
  }

  this.getAvatar = function () {
    return avatar
  }

  this.setEnterTime = function (v) {
    enterTime = v
  }

  this.getEnterTime = function () {
    return enterTime
  }

  this.setExtension = function (v) {
    extension = v
  }

  this.getExtension = function () {
    return extension
  }

  this.setInBlackList = function (v) {
    inBlackList = v
  }

  this.getInBlackList = function () {
    return inBlackList
  }

  this.setIsMuted = function (v) {
    isMuted = v
  }

  this.getIsMuted = function () {
    return isMuted
  }

  this.setIsOnline = function (v) {
    isOnline = v
  }

  this.getIsOnline = function () {
    return isOnline
  }

  this.setIsTempMuted = function (v) {
    isTempMuted = v
  }

  this.getIsTempMuted = function () {
    return isTempMuted
  }

  this.setIsValid = function (v) {
    isValid = v
  }

  this.getIsValid = function () {
    return isValid
  }

  this.setMemberLevel = function (v) {
    memberLevel = v
  }

  this.getMemberLevel = function () {
    return memberLevel
  }

  this.setNick = function (v) {
    nick = v
  }

  this.getNick = function () {
    return nick
  }

  this.setRoomId = function (v) {
    roomId = v
  }

  this.getRoomId = function () {
    return roomId
  }

  this.setTempMuteDuration = function (v) {
    tempMuteDuration = v
  }

  this.getTempMuteDuration = function () {
    return tempMuteDuration
  }

  this.setType = function (v) {
    type = v
  }

  this.getType = function () {
    return type
  }

  this.setUpdateTime = function (v) {
    updateTime = v
  }

  this.getUpdateTime = function () {
    return updateTime
  }
}

this.TextUtils = function () { }

this.TextUtils.prototype.isEmpty = function (str) {
  if (typeof str != 'string' || str.replace(/(^s*)|(s*$)/g, '').length == 0) {
    return true
  }
  return false
}
///////////////////////////////////////////////////////////////
//sensitiveWord

function getSensitiveWord(url, param) {
  myAjax(
    'post',
    url,
    param,
    function (data) {
      json = data
    },
    'text',
    false,
    {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
    }

  )
  return json
}

/**
 * @description
 * 构造敏感词map
 * @private
 * @returns
 */
function makeSensitiveMap(sensitiveWordList) {
  // 构造根节点
  var result = new Map()
  for (var j = 0; j < sensitiveWordList.length; j++) {
    var word = sensitiveWordList[j]
    var map = result
    for (var i = 0; i < word.length; i++) {
      // 依次获取字
      var char = word.charAt(i)
      // 判断是否存在
      if (map.get(char)) {
        // 获取下一层节点
        map = map.get(char)
      } else {
        // 将当前节点设置为非结尾节点
        if (map.get('laster') === true) {
          map.set('laster', false)
        }
        var item = new Map()
        // 新增节点默认为结尾节点
        item.set('laster', true)
        map.set(char, item)
        map = map.get(char)
      }
    }

  }
  return result
}

/**
 * @description
 * 检查敏感词是否存在
 * @private
 * @param {any} txt
 * @param {any} index
 * @returns
 */
function checkSensitiveWord(sensitiveMap, txt, index) {
  if (typeof sensitiveMap != 'undefined') {
    var currentMap = sensitiveMap
    var flag = false
    var wordNum = 0//记录过滤
    var sensitiveWord = '' //记录过滤出来的敏感词
    for (var i = index; i < txt.length; i++) {
      var word = txt.charAt(i)
      currentMap = currentMap.get(word)
      if (currentMap) {
        wordNum++
        sensitiveWord += word

        if (currentMap.get('laster') === true) {
          // 表示已到词的结尾 或者txt匹配完成
          flag = true
          break
        }
      } else {
        break
      }
    }
    // 两字成词
    if (wordNum < 2) {
      flag = false
    }
    return { flag: flag, sensitiveWord: sensitiveWord }
  } else {
    return { flag: false, sensitiveWord: '敏感词下载失败 跳过检测' }
  }
}
/**
 * @description
 * 判断文本中是否存在敏感词
 * @param {any} txt
 * @returns
 */
function filterSensitiveWord(txt, sensitiveMap) {
  var matchResult = { flag: false, sensitiveWord: '' }
  // 过滤掉除了中文、英文、数字之外的
  var txtTrim = txt.replace(/[^\u4e00-\u9fa5\u0030-\u0039\u0061-\u007a\u0041-\u005a]+/g, '')
  for (var i = 0; i < txtTrim.length; i++) {
    matchResult = checkSensitiveWord(sensitiveMap, txtTrim, i)
    if (matchResult.flag) {
      console.log('sensitiveWord:' + matchResult.sensitiveWord)
      break
    }
  }
  return matchResult
}

///////////////////////////////////////////////////////////////
//rsa
var b64map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
var b64pad = '='
function hex2b64(h) {
  var i
  var c
  var ret = ''
  for (i = 0; i + 3 <= h.length; i += 3) {
    c = parseInt(h.substring(i, i + 3), 16)
    ret += b64map.charAt(c >> 6) + b64map.charAt(c & 63)
  }
  if (i + 1 === h.length) {
    c = parseInt(h.substring(i, i + 1), 16)
    ret += b64map.charAt(c << 2)
  }
  else if (i + 2 === h.length) {
    c = parseInt(h.substring(i, i + 2), 16)
    ret += b64map.charAt(c >> 2) + b64map.charAt((c & 3) << 4)
  }
  while ((ret.length & 3) > 0) {
    ret += b64pad
  }
  return ret
}
var BI_RM = '0123456789abcdefghijklmnopqrstuvwxyz'
function int2char(n) {
  return BI_RM.charAt(n)
}
function b64tohex(s) {
  var ret = ''
  var i
  var k = 0 // b64 state, 0-3
  var slop = 0
  for (i = 0; i < s.length; ++i) {
    if (s.charAt(i) === b64pad) {
      break
    }
    var v = b64map.indexOf(s.charAt(i))
    if (v < 0) {
      continue
    }
    if (k === 0) {
      ret += int2char(v >> 2)
      slop = v & 3
      k = 1
    }
    else if (k === 1) {
      ret += int2char((slop << 2) | (v >> 4))
      slop = v & 0xf
      k = 2
    }
    else if (k === 2) {
      ret += int2char(slop)
      ret += int2char(v >> 2)
      slop = v & 3
      k = 3
    }
    else {
      ret += int2char((slop << 2) | (v >> 4))
      ret += int2char(v & 0xf)
      k = 0
    }
  }
  if (k === 1) {
    ret += int2char(slop << 2)
  }
  return ret
}
/**
 * rsa公钥加密长字符串
 * @param str
 * @param publicKey
 * @returns {any}
 */
function encryptPublicLong(text, publicKey) {
  var rsa = new JSEncrypt()
  rsa.setPublicKey(publicKey)
  var key = rsa.getKey()
  var ct = ''
  // RSA每次加密117bytes，需要辅助方法判断字符串截取位置
  // 1.获取字符串截取点
  var bytes = new Array()
  bytes.push(0)
  var byteNo = 0
  var len = text.length
  var c
  var temp = 0
  for (var i = 0; i < len; i++) {
    c = text.charCodeAt(i)
    if (c >= 0x010000 && c <= 0x10FFFF) { // 特殊字符，如Ř，Ţ
      byteNo += 4
    }
    else if (c >= 0x000800 && c <= 0x00FFFF) { // 中文以及标点符号
      byteNo += 3
    }
    else if (c >= 0x000080 && c <= 0x0007FF) { // 特殊字符，如È，Ò
      byteNo += 2
    }
    else { // 英文以及标点符号
      byteNo += 1
    }
    if ((byteNo % 117) >= 114 || (byteNo % 117) === 0) {
      if (byteNo - temp >= 114) {
        bytes.push(i)
        temp = byteNo
      }
    }
  }
  // 2.截取字符串并分段加密
  if (bytes.length > 1) {
    for (var i = 0; i < bytes.length - 1; i++) {
      var str = void 0
      if (i === 0) {
        str = text.substring(0, bytes[i + 1] + 1)
      }
      else {
        str = text.substring(bytes[i] + 1, bytes[i + 1] + 1)
      }
      var t1 = key.encrypt(str)
      ct += t1
    }
    if (bytes[bytes.length - 1] !== text.length - 1) {
      var lastStr = text.substring(bytes[bytes.length - 1] + 1)
      ct += key.encrypt(lastStr)
    }
    return (hex2b64(ct))
  }
  var t = key.encrypt(text)
  return hex2b64(t)
}

/**
 * rsa私钥解密长字符串
 * @param str
 * @param privateKey
 * @returns {any}
 */
function decryptPrivateLong(text, privateKey) {
  var rsa = new JSEncrypt()
  rsa.setPrivateKey(privateKey)
  var key = rsa.getKey()
  text = b64tohex(text)
  var maxLength = ((key.n.bitLength() + 7) >> 3)
  try {
    if (text.length > maxLength) {
      var ct1_1 = ''
      var lt = text.match(/.{1,256}/g)
      if (lt) {
        lt.forEach(function (entry) {
          var t1 = key.decrypt(entry)
          ct1_1 += t1
        })
      }
      return ct1_1
    }
    var y = key.decrypt(text)
    return y
  }
  catch (ex) {
    return false
  }
}

////////////////////////////////////////////////////////////
//rc4
var RC4KeyByte = new JSEncrypt().nextBytes(16)
/**
 * RC4加密/解密算法
 */
var RC4 = function (key) {
  if (!(this instanceof RC4)) return new RC4(key)

  // [] is faster than Uint8Array in Chrome
  var s = [], i, j = 0, x
  for (i = 0; i < 256; i++) {
    s[i] = i
  }
  for (i = 0; i < 256; i++) {
    j = (j + s[i] + key[i % key.length]) % 256
    x = s[i]
    s[i] = s[j]
    s[j] = x
  }
  this._s = s
  this._i = 0
  this._j = 0
}

RC4.prototype.update = function (arryBuffer) {
  // var plainText = new Uint8Array(arryBuffer);
  // var cipherText = new Uint8Array(plainText.length);
  // var x, y, p, i = this._i, j = this._j, s = this._s;
  // for (p = 0; p < plainText.length; p++) {
  //     i = (i + 1) % 256;
  //     x = s[i];
  //     j = (j + x) % 256;
  //     y = s[j];
  //     s[i] = y;
  //     s[j] = x;
  //     cipherText[p] = plainText[p] ^ s[(x + y) % 256];
  // }
  // this._i = i;
  // this._j = j;
  return arryBuffer
}

ucim.RC4Encript = new RC4(RC4KeyByte)
ucim.RC4Decript = new RC4(RC4KeyByte)

ucim.LoginPacket = function (account, isGuest, token) {

  var headBuffer = dcodeIO.ByteBuffer.allocate(1024, true, false)
  headBuffer.writeByte(2)//sid
  headBuffer.writeByte(2)//cid
  headBuffer.writeInt16(0)//ser
  headBuffer.writeByte(0)//tag
  headBuffer.flip()

  //console.log("headBuffer" + headBuffer.toArrayBuffer)

  var dataBuffer = dcodeIO.ByteBuffer.allocate(1024, true, false)
  var loginInfo = new Array()
  loginInfo[19] = account
  loginInfo[1000] = token
  loginInfo[999] = '123456789'
  if (isGuest) {
    loginInfo[998] = '5'
  } else {
    loginInfo[998] = '0'
  }
  loginInfo[3] = getRoomType() + ''
  loginInfo[28] = uuid()

  dataBuffer.append(ucim._PacketHelper.encodeLength(6))
  loginInfo.forEach(function (x, i) {
    dataBuffer.append(ucim._PacketHelper.encodeLength(i))

    var dataBytes = ucim._UcimUtils.strToUTF8Bytes(x)
    dataBuffer.append(ucim._PacketHelper.encodeLength(dataBytes.length))
    dataBuffer.append(dataBytes)
  })
  dataBuffer.flip()

  var packetLen = headBuffer.limit + dataBuffer.limit

  var packetBuffer = dcodeIO.ByteBuffer.allocate(1024, true, false)
  packetBuffer.append(ucim._PacketHelper.encodeLength(packetLen))
  packetBuffer.append(headBuffer)
  packetBuffer.append(dataBuffer)
  packetBuffer.flip()

  return packetBuffer.toArrayBuffer()
  //console.log("packetBuffer" + packetBuffer.toArray())

  // var loginPacketBuffer = dcodeIO.ByteBuffer.allocate(1024, true, false);
  // loginPacketBuffer.append(ucim._PacketHelper.encodeLength(16));
  // loginPacketBuffer.append(RC4KeyByte);
  // loginPacketBuffer.append(packetBuffer);
  // loginPacketBuffer.flip();

  // //var loginBuffer = loginPacketBuffer.toBinaryArray();

  // var loginString = loginPacketBuffer.toString("base64");
  // loginString = encryptPublicLong(loginString, "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCzaQ/EdzJAVGpRaYSYkCfwc4oepLZPmN4jy5EY4/8TK48VC53+UZ00ZBWab5YGnck6zxrrLc5Fvs8niMDEZ9MNF2YQsJRogfOhqyyuOaSBvj/zqP6vNC7scjX6RX7t7pGNbnsLAhKYvuBJbm/YUV6JV9WsWWNkZUW8IoSCCXzZZwIDAQAB");
  // var loginDataBytes = ucim._UcimUtils.strToUTF8Bytes(loginString);

  // var firstHeadBuffer = dcodeIO.ByteBuffer.allocate(1024, true, false);
  // firstHeadBuffer.writeByte(1);//sid
  // firstHeadBuffer.writeByte(1);//cid
  // firstHeadBuffer.writeInt16(0);//ser
  // firstHeadBuffer.writeByte(0);//tag
  // firstHeadBuffer.flip();

  // var loginPacketLen = firstHeadBuffer.limit + 4 + loginDataBytes.length;

  // var firstPacketBuffer = dcodeIO.ByteBuffer.allocate(1024, true, false);
  // firstPacketBuffer.append(ucim._PacketHelper.encodeLength(loginPacketLen));
  // firstPacketBuffer.append(firstHeadBuffer);
  // firstPacketBuffer.writeInt32(0);
  // firstPacketBuffer.append(loginDataBytes);
  // firstPacketBuffer.flip();

  // return firstPacketBuffer.toArrayBuffer();
}

/**
 * 消息发送管理
 */
ucim.UcimChatRoomMessagePacket = function (fromAccount, nickName, roomId, msg) {
  var msgProps = new SAProperty()
  msgProps.putString(1, uuid())
  msgProps.putInt(2, MsgTypeEnum_text)
  var content = msg
  if (!new TextUtils().isEmpty(content)) {
    msgProps.putString(3, content)
  } else {
    msgProps.putString(3, '')
  }

  msgProps.putString(7, nickName)
  msgProps.putLong(20, new Date().getTime())
  msgProps.putString(21, fromAccount)
  msgProps.putString(22, roomId)
  msgProps.putInt(23, 0)

  return new PacketUtil(13, 6, 0, roomId, msgProps)
}

ucim.UcimChatSensitiveMessagePacket = function (fromAccount) {
  var msgProps = new SAProperty()
  msgProps.putString(0, fromAccount)
  if (isSSL) {
    msgProps.putString(2, 'ssl')
  }

  return new PacketUtil(15, 1, 0, '', msgProps)
}

ucim.UcEnterRoomPacket = function (fromAccount, nick, roomId) {
  var chatRoomHelper = new ucim.ChatRoomHelper()
  var member = new ChatRoomMember()
  var roomInfo = new ChatRoomInfo()
  member.setAccount(fromAccount)
  member.setNick(nick)
  member.setType(MemberType_GUEST)
  member.setRoomId(roomId)
  roomInfo.setRoomId(roomId)
  var saProps1 = chatRoomHelper.propertyRoomInfo(roomInfo)
  var saProps2 = chatRoomHelper.propertyRommMember(member)
  return new PacketUtilEx(13, 2, 0, roomId, saProps1, saProps2)
}

ucim.UcBackstageEnterRoomPacket = function (fromAccount, nick, memberType, roomId) {
  var chatRoomHelper = new ucim.ChatRoomHelper()
  var member = new ChatRoomMember()
  var roomInfo = new ChatRoomInfo()
  member.setAccount(fromAccount)
  member.setNick(nick)
  member.setType(memberType)
  member.setRoomId(roomId)
  roomInfo.setRoomId(roomId)
  var saProps1 = chatRoomHelper.propertyRoomInfo(roomInfo)
  var saProps2 = chatRoomHelper.propertyRommMember(member)
  return new PacketUtilEx(13, 2, 0, roomId, saProps1, saProps2)
}


ucim.UcExitRoomPacket = function (roomId) {
  var headBuffer = dcodeIO.ByteBuffer.allocate(1024, true, false)
  headBuffer.writeByte(13)//sid
  headBuffer.writeByte(4)//cid
  headBuffer.writeInt16(0)//ser
  if (typeof roomId == 'string' && roomId.length > 0) {
    headBuffer.writeByte(ucim.TAG_WithField)//tag
    var dataBytes = ucim._UcimUtils.strToUTF8Bytes(roomId)
    headBuffer.append(ucim._PacketHelper.encodeLength(dataBytes.length))
    headBuffer.append(dataBytes)
  } else {
    headBuffer.writeByte(0)//tag
  }
  headBuffer.flip()

  var packetLen = headBuffer.limit
  var packetBuffer = dcodeIO.ByteBuffer.allocate(1024, true, false)
  packetBuffer.append(ucim._PacketHelper.encodeLength(packetLen))
  packetBuffer.append(headBuffer)
  packetBuffer.flip()
  //console.log("packetBuffer" + packetBuffer.toArray())
  return ucim.RC4Encript.update(packetBuffer.toArrayBuffer())
}

//-1: markChatRoomBlackList(), 1: markChatRoomManager(), -2: markChatRoomMutedList(), 2: markNormalMember()
//true:添加, false:移出
ucim.MarkChatRoomOptionPacket = function (roomId, target, operator, isAdd) {
  var headBuffer = dcodeIO.ByteBuffer.allocate(1024, true, false)
  headBuffer.writeByte(13)//sid
  headBuffer.writeByte(11)//cid
  headBuffer.writeInt16(0)//ser
  if (typeof roomId == 'string' && roomId.length > 0) {
    headBuffer.writeByte(ucim.TAG_WithField)//tag
    var dataBytes = ucim._UcimUtils.strToUTF8Bytes(roomId)
    headBuffer.append(ucim._PacketHelper.encodeLength(dataBytes.length))
    headBuffer.append(dataBytes)
  } else {
    headBuffer.writeByte(0)//tag
  }
  headBuffer.flip()

  var dataBuffer = dcodeIO.ByteBuffer.allocate(1024, true, false)

  var dataBytes = ucim._UcimUtils.strToUTF8Bytes(target)
  dataBuffer.append(ucim._PacketHelper.encodeLength(dataBytes.length))
  dataBuffer.append(dataBytes)
  dataBuffer.writeInt32(operator)
  dataBuffer.writeByte(isAdd ? 1 : 0)
  dataBuffer.writeInt32(0)
  dataBuffer.flip()

  var packetLen = headBuffer.limit + dataBuffer.limit

  var packetBuffer = dcodeIO.ByteBuffer.allocate(1024, true, false)
  packetBuffer.append(ucim._PacketHelper.encodeLength(packetLen))
  packetBuffer.append(headBuffer)
  packetBuffer.append(dataBuffer)
  packetBuffer.flip()
  //console.log("packetBuffer" + packetBuffer.toArray())
  return ucim.RC4Encript.update(packetBuffer.toArrayBuffer())
}

ucim.MarkChatRoomTempMutePacket = function (roomId, target, duration, isNotify) {
  var headBuffer = dcodeIO.ByteBuffer.allocate(1024, true, false)
  headBuffer.writeByte(13)//sid
  headBuffer.writeByte(19)//cid
  headBuffer.writeInt16(0)//ser
  if (typeof roomId == 'string' && roomId.length > 0) {
    headBuffer.writeByte(ucim.TAG_WithField)//tag
    var dataBytes = ucim._UcimUtils.strToUTF8Bytes(roomId)
    headBuffer.append(ucim._PacketHelper.encodeLength(dataBytes.length))
    headBuffer.append(dataBytes)
  } else {
    headBuffer.writeByte(0)//tag
  }
  headBuffer.flip()

  var dataBuffer = dcodeIO.ByteBuffer.allocate(1024, true, false)

  var dataBytes = ucim._UcimUtils.strToUTF8Bytes(target)
  dataBuffer.append(ucim._PacketHelper.encodeLength(dataBytes.length))
  dataBuffer.append(dataBytes)
  dataBuffer.writeLong(duration)
  dataBuffer.writeByte(isNotify ? 1 : 0)
  dataBytes = ucim._UcimUtils.strToUTF8Bytes(roomId)
  dataBuffer.append(ucim._PacketHelper.encodeLength(dataBytes.length))
  dataBuffer.append(dataBytes)
  dataBuffer.flip()

  var packetLen = headBuffer.limit + dataBuffer.limit

  var packetBuffer = dcodeIO.ByteBuffer.allocate(1024, true, false)
  packetBuffer.append(ucim._PacketHelper.encodeLength(packetLen))
  packetBuffer.append(headBuffer)
  packetBuffer.append(dataBuffer)
  packetBuffer.flip()
  //console.log("packetBuffer" + packetBuffer.toArray())
  return ucim.RC4Encript.update(packetBuffer.toArrayBuffer())
}

ucim.UcimChatRoomMessagePacketEx = function (msg) {
  var msgProps = new SAProperty()
  msgProps.putString(1, msg.getUuid())
  msgProps.putInt(2, msg.getMsgType())
  var content = msg.getContent()
  if (!TextUtils.isEmpty(content)) {
    msgProps.putString(3, content)
  } else {
    msgProps.putString(3, '')
  }

  if (!TextUtils.isEmpty(msg.getRemoteext())) {
    msgProps.putString(4, msg.getRemoteext())
  }

  if (msg.getRoleInfoTimeTag() >= 0) {
    msgProps.putLong(6, msg.getRoleInfoTimeTag())
  }

  if (!TextUtils.isEmpty(msg.getSenderNick())) {
    msgProps.putString(7, msg.getSenderNick())
  }

  if (!TextUtils.isEmpty(msg.getSenderAvatar())) {
    msgProps.putString(8, msg.getSenderAvatar())
  }

  if (msg.getSenderExtension() != null) {
    msgProps.putString(9, msg.getSenderExtension())
  }

  msgProps.putLong(20, msg.getTime())
  msgProps.putString(21, msg.getFromAccount())
  msgProps.putString(22, msg.getSessionId())
  msgProps.putInt(23, 0)

  if (typeof msg.getNIMAntiSpamOption() != 'undefined' && msg.getNIMAntiSpamOption() != null) {
    msgProps.putInt(10, 1)
    msgProps.putString(11, msg.getNIMAntiSpamOption())
  }

  return new PacketUtil(13, 6, 0, msgProps)
}

ucim.UcRoomPullBlackListPacket = function (roomId) {
  var headBuffer = dcodeIO.ByteBuffer.allocate(1024, true, false)
  headBuffer.writeByte(13)//sid
  headBuffer.writeByte(32)//cid
  headBuffer.writeInt16(0)//ser
  if (typeof roomId == 'string' && roomId.length > 0) {
    headBuffer.writeByte(ucim.TAG_WithField)//tag
    var dataBytes = ucim._UcimUtils.strToUTF8Bytes(roomId)
    headBuffer.append(ucim._PacketHelper.encodeLength(dataBytes.length))
    headBuffer.append(dataBytes)
  } else {
    headBuffer.writeByte(0)//tag
  }
  headBuffer.flip()

  var packetLen = headBuffer.limit
  var packetBuffer = dcodeIO.ByteBuffer.allocate(1024, true, false)
  packetBuffer.append(ucim._PacketHelper.encodeLength(packetLen))
  packetBuffer.append(headBuffer)
  packetBuffer.flip()
  //console.log("packetBuffer" + packetBuffer.toArray())
  return ucim.RC4Encript.update(packetBuffer.toArrayBuffer())
}

ucim.UcRoomPullManagerPacket = function (roomId) {
  var headBuffer = dcodeIO.ByteBuffer.allocate(1024, true, false)
  headBuffer.writeByte(13)//sid
  headBuffer.writeByte(33)//cid
  headBuffer.writeInt16(0)//ser
  if (typeof roomId == 'string' && roomId.length > 0) {
    headBuffer.writeByte(ucim.TAG_WithField)//tag
    var dataBytes = ucim._UcimUtils.strToUTF8Bytes(roomId)
    headBuffer.append(ucim._PacketHelper.encodeLength(dataBytes.length))
    headBuffer.append(dataBytes)
  } else {
    headBuffer.writeByte(0)//tag
  }
  headBuffer.flip()

  var packetLen = headBuffer.limit
  var packetBuffer = dcodeIO.ByteBuffer.allocate(1024, true, false)
  packetBuffer.append(ucim._PacketHelper.encodeLength(packetLen))
  packetBuffer.append(headBuffer)
  packetBuffer.flip()
  //console.log("packetBuffer" + packetBuffer.toArray())
  return ucim.RC4Encript.update(packetBuffer.toArrayBuffer())
}

ucim.UcRoomPullMsgHistoryPacket = function (roomId, count) {
  var headBuffer = dcodeIO.ByteBuffer.allocate(1024, true, false)
  headBuffer.writeByte(13)//sid
  headBuffer.writeByte(9)//cid
  headBuffer.writeInt16(0)//ser
  if (typeof roomId == 'string' && roomId.length > 0) {
    headBuffer.writeByte(ucim.TAG_WithField)//tag
    var dataBytes = ucim._UcimUtils.strToUTF8Bytes(roomId)
    headBuffer.append(ucim._PacketHelper.encodeLength(dataBytes.length))
    headBuffer.append(dataBytes)
  } else {
    headBuffer.writeByte(0)//tag
  }
  headBuffer.flip()

  var packetLen = headBuffer.limit
  var packetBuffer = dcodeIO.ByteBuffer.allocate(1024, true, false)
  packetBuffer.append(ucim._PacketHelper.encodeLength(packetLen))
  packetBuffer.append(headBuffer)
  packetBuffer.writeLong(new Date().getTime())
  packetBuffer.writeInt32(count)
  packetBuffer.flip()
  //console.log("packetBuffer" + packetBuffer.toArray())
  return ucim.RC4Encript.update(packetBuffer.toArrayBuffer())
}

ucim.UcRoomPullMuteListPacket = function (roomId) {
  var headBuffer = dcodeIO.ByteBuffer.allocate(1024, true, false)
  headBuffer.writeByte(13)//sid
  headBuffer.writeByte(31)//cid
  headBuffer.writeInt16(0)//ser
  if (typeof roomId == 'string' && roomId.length > 0) {
    headBuffer.writeByte(ucim.TAG_WithField)//tag
    var dataBytes = ucim._UcimUtils.strToUTF8Bytes(roomId)
    headBuffer.append(ucim._PacketHelper.encodeLength(dataBytes.length))
    headBuffer.append(dataBytes)
  } else {
    headBuffer.writeByte(0)//tag
  }
  headBuffer.flip()

  var packetLen = headBuffer.limit
  var packetBuffer = dcodeIO.ByteBuffer.allocate(1024, true, false)
  packetBuffer.append(ucim._PacketHelper.encodeLength(packetLen))
  packetBuffer.append(headBuffer)
  packetBuffer.flip()
  //console.log("packetBuffer" + packetBuffer.toArray())
  return ucim.RC4Encript.update(packetBuffer.toArrayBuffer())
}

ucim.UcRoomKickPacket = function (target, reason, roomId) {
  var headBuffer = dcodeIO.ByteBuffer.allocate(1024, true, false)
  headBuffer.writeByte(13)//sid
  headBuffer.writeByte(17)//cid
  headBuffer.writeInt16(0)//ser
  if (typeof roomId == 'string' && roomId.length > 0) {
    headBuffer.writeByte(ucim.TAG_WithField)//tag
    var dataBytes = ucim._UcimUtils.strToUTF8Bytes(roomId)
    headBuffer.append(ucim._PacketHelper.encodeLength(dataBytes.length))
    headBuffer.append(dataBytes)
  } else {
    headBuffer.writeByte(0)//tag
  }
  headBuffer.flip()

  var dataBuffer = dcodeIO.ByteBuffer.allocate(1024, true, false)
  var dataBytes = ucim._UcimUtils.strToUTF8Bytes(target)
  dataBuffer.append(ucim._PacketHelper.encodeLength(dataBytes.length))
  dataBuffer.append(dataBytes)

  if (typeof reason == 'string' && reason.length > 0) {
    dataBytes = ucim._UcimUtils.strToUTF8Bytes(reason)
    dataBuffer.append(ucim._PacketHelper.encodeLength(dataBytes.length))
    dataBuffer.append(dataBytes)
    dataBuffer.flip()
  }

  var packetLen = headBuffer.limit + dataBuffer.limit
  var packetBuffer = dcodeIO.ByteBuffer.allocate(1024, true, false)
  packetBuffer.append(ucim._PacketHelper.encodeLength(packetLen))
  packetBuffer.append(headBuffer)
  packetBuffer.append(dataBuffer)
  packetBuffer.flip()
  //console.log("packetBuffer" + packetBuffer.toArray())
  return ucim.RC4Encript.update(packetBuffer.toArrayBuffer())
}

ucim.ChatRoomHelper = function () {
  this.createRommMember = function (saProps) {
    var member = new ChatRoomMember()
    member.setRoomId(saProps.getString(1))
    member.setAccount(saProps.getString(2))
    if (saProps.getInt(9) == 1) {
      member.setType(MemberType_GUEST)
    } else {
      member.setType(saProps.getInt(3))
    }

    member.setMemberLevel(saProps.getInt(4))
    member.setNick(saProps.getString(5))
    member.setAvatar(saProps.getString(6))
    member.setExtension(saProps.getString(7))
    member.setEnterTime(saProps.getLong(10))
    member.setIsOnline(saProps.getInt(8) == 1)
    member.setInBlackList(saProps.getInt(12) == 1)
    member.setIsMuted(saProps.getInt(13) == 1)
    member.setIsValid(saProps.getInt(14) == 1)
    member.setUpdateTime(saProps.getLong(15))
    member.setIsTempMuted(saProps.getInt(16) == 1)
    member.setTempMuteDuration(saProps.getLong(17))
    member.setMutedTime(saProps.getLong(18))
    return member
  }

  this.createRoomInfo = function (saProps) {
    var roomInfo = new ChatRoomInfo()
    roomInfo.setRoomId(saProps.getString(1))
    roomInfo.setName(saProps.getString(3))
    roomInfo.setAnnouncement(saProps.getString(4))
    roomInfo.setBroadcastUrl(saProps.getString(5))
    roomInfo.setCreator(saProps.getString(100))
    roomInfo.setValidFlag(saProps.getInt(9))
    roomInfo.setExtension(saProps.getString(12))
    roomInfo.setOnlineUserCount(saProps.getInt(101))
    roomInfo.setMute(saProps.getInt(102))
    return roomInfo
  }

  this.newMessageFromProps = function (props) {

    var fromAccount = props.getString(2)
    var seesionType = props.getInt(0)
    var fromId = props.getString(1)
    var msgType = props.getInt(8)
    var imMsg = new ChatRoomMessage()
    imMsg.setUuid(props.getString(11))
    imMsg.setServerid(props.getLong(12))
    imMsg.setFromAccount(fromAccount)
    imMsg.setSessionId(fromId)
    imMsg.setTime(props.getLong(7))
    imMsg.setSessiontype(seesionType)
    imMsg.setMsgtype(msgType)
    imMsg.setContent(props.getString(9))
    imMsg.setAttachmentJson(props.getString(10))
    imMsg.setRemoteext(props.getString(15))
    imMsg.setPushContent(props.getString(17))
    imMsg.setPayload(props.getString(16))
    imMsg.setFromClientType(props.getInt(4))

    return imMsg
  }

  this.newRoomMsgFromSAProp = function (saProp) {

    var msg = new ChatRoomMessage()
    msg.setUuid(saProp.getString(1))
    msg.setMsgtype(saProp.getInt(2))
    msg.setAttachmentJson(saProp.getString(3))
    msg.setRemoteext(saProp.getString(4))
    msg.setRoleInfoTimeTag(saProp.getLong(6))
    msg.setSenderNick(saProp.getString(7))
    msg.setSenderAvatar(saProp.getString(8))
    msg.setSenderExtension(saProp.getString(9))
    msg.setTime(saProp.getLong(20))
    msg.setFromAccount(saProp.getString(21))
    msg.setFromClientType(saProp.getInt(23))
    msg.setSessionId(saProp.getString(22))
    msg.setSessiontype(SessionTypeEnum_ChatRoom)
    msg.setStatus(MsgStatusEnum_success)
    msg.setStatus2(0)
    msg.setContent(saProp.getString(3))

    return msg
  }

  this.propertyRommMember = function (member) {
    var saProps = new SAProperty()
    saProps.putString(1, member.getRoomId())
    saProps.putString(2, member.getAccount())

    if (member.getType() == MemberType_GUEST) {
      saProps.putInt(9, 1)
    } else {
      saProps.putInt(3, member.getType())
    }
    saProps.putInt(4, member.getMemberLevel())
    saProps.putString(5, member.getNick())
    saProps.putString(6, member.getAvatar())
    saProps.putString(7, member.getExtension())
    saProps.putInt(8, member.getIsOnline() ? 1 : 0)
    saProps.putLong(10, member.getEnterTime())
    saProps.putInt(12, member.getInBlackList() ? 1 : 0)
    saProps.putInt(13, member.getIsMuted() ? 1 : 0)
    saProps.putInt(14, member.getIsValid() ? 1 : 0)
    saProps.putLong(15, member.getUpdateTime())
    saProps.putInt(16, member.getIsTempMuted() ? 1 : 0)
    saProps.putLong(17, member.getTempMuteDuration())
    saProps.putLong(18, member.getMutedTime())

    return saProps
  }

  this.propertyRoomInfo = function (roomInfo) {
    var saProps = new SAProperty()
    saProps.putString(1, roomInfo.getRoomId())
    saProps.putString(3, roomInfo.getName())
    saProps.putString(4, roomInfo.getAnnouncement())
    saProps.putString(5, roomInfo.getBroadcastUrl())
    saProps.putString(100, roomInfo.getCreator())
    saProps.putInt(9, roomInfo.getValidFlag() ? 1 : 0)
    saProps.putString(12, roomInfo.getExtension())
    saProps.putInt(101, roomInfo.getOnlineUserCount())
    saProps.putInt(102, roomInfo.getMute() ? 1 : 0)

    return saProps
  }

}

this.PacketUtil = function (sid, cid, tag, field, saProps) {
  var headBuffer = dcodeIO.ByteBuffer.allocate(1024, true, false)
  headBuffer.writeByte(sid)//sid
  headBuffer.writeByte(cid)//cid
  headBuffer.writeInt16(0)//ser
  if (typeof field == 'string' && field.length > 0) {
    headBuffer.writeByte(ucim.TAG_WithField)//tag
    var dataBytes = ucim._UcimUtils.strToUTF8Bytes(field)
    headBuffer.append(ucim._PacketHelper.encodeLength(dataBytes.length))
    headBuffer.append(dataBytes)
  } else {
    headBuffer.writeByte(0)//tag
  }
  headBuffer.flip()

  var dataBuffer = dcodeIO.ByteBuffer.allocate(1024, true, false)
  var dataInfo = saProps.getArray()

  dataBuffer.append(ucim._PacketHelper.encodeLength(saProps.length()))
  dataInfo.forEach(function (x, i) {
    dataBuffer.append(ucim._PacketHelper.encodeLength(i))

    var dataBytes = ucim._UcimUtils.strToUTF8Bytes(x)
    dataBuffer.append(ucim._PacketHelper.encodeLength(dataBytes.length))
    dataBuffer.append(dataBytes)
  })
  dataBuffer.flip()

  var packetLen = headBuffer.limit + dataBuffer.limit

  var packetBuffer = dcodeIO.ByteBuffer.allocate(1024, true, false)
  packetBuffer.append(ucim._PacketHelper.encodeLength(packetLen))
  packetBuffer.append(headBuffer)
  packetBuffer.append(dataBuffer)
  packetBuffer.flip()

  return ucim.RC4Encript.update(packetBuffer.toArrayBuffer())
}

this.PacketUtilEx = function (sid, cid, tag, field, saProps, saProps2) {
  var headBuffer = dcodeIO.ByteBuffer.allocate(1024, true, false)
  headBuffer.writeByte(sid)//sid
  headBuffer.writeByte(cid)//cid
  headBuffer.writeInt16(0)//ser
  if (typeof field == 'string' && field.length > 0) {
    headBuffer.writeByte(ucim.TAG_WithField)//tag
    var dataBytes = ucim._UcimUtils.strToUTF8Bytes(field)
    headBuffer.append(ucim._PacketHelper.encodeLength(dataBytes.length))
    headBuffer.append(dataBytes)
  } else {
    headBuffer.writeByte(0)//tag
  }
  headBuffer.flip()

  var dataBuffer = dcodeIO.ByteBuffer.allocate(1024, true, false)
  var dataInfo = saProps.getArray()

  dataBuffer.append(ucim._PacketHelper.encodeLength(saProps.length()))
  dataInfo.forEach(function (x, i) {
    dataBuffer.append(ucim._PacketHelper.encodeLength(i))

    var dataBytes = ucim._UcimUtils.strToUTF8Bytes(x)
    dataBuffer.append(ucim._PacketHelper.encodeLength(dataBytes.length))
    dataBuffer.append(dataBytes)
  })
  dataBuffer.flip()

  var dataBuffer2 = dcodeIO.ByteBuffer.allocate(1024, true, false)
  var dataInfo2 = saProps2.getArray()

  dataBuffer2.append(ucim._PacketHelper.encodeLength(saProps2.length()))
  dataInfo2.forEach(function (x, i) {
    dataBuffer2.append(ucim._PacketHelper.encodeLength(i))

    var dataBytes = ucim._UcimUtils.strToUTF8Bytes(x)
    dataBuffer2.append(ucim._PacketHelper.encodeLength(dataBytes.length))
    dataBuffer2.append(dataBytes)
  })
  dataBuffer2.flip()

  var packetLen = headBuffer.limit + dataBuffer.limit + dataBuffer2.limit

  var packetBuffer = dcodeIO.ByteBuffer.allocate(1024, true, false)
  packetBuffer.append(ucim._PacketHelper.encodeLength(packetLen))
  packetBuffer.append(headBuffer)
  packetBuffer.append(dataBuffer)
  packetBuffer.append(dataBuffer2)
  packetBuffer.flip()

  return ucim.RC4Encript.update(packetBuffer.toArrayBuffer())
}

//js得到uuid
this.uuid = function () {
  var s = []
  var hexDigits = '0123456789abcdef'
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = ''

  var uuid = s.join('')
  return uuid
}

this.getRoomType = function () {
  if (typeof roomType == 'undefined') roomType = Date.parse(new Date())
  return roomType
}
//js 取token
this.GetQueryString = function (url) {
  if (typeof url == 'undefined' || url.length == 0) return null
  var index = url.lastIndex('token?')
  if (index == -1) return null

}


ucim.KeepAlivePacket = function () {
  var headBuffer = dcodeIO.ByteBuffer.allocate(1024, true, false)
  headBuffer.writeByte(1)//sid
  headBuffer.writeByte(2)//cid
  headBuffer.writeInt16(0)//ser
  headBuffer.writeByte(0)//tag
  headBuffer.flip()

  var packetBuffer = dcodeIO.ByteBuffer.allocate(1024, true, false)
  packetBuffer.append(ucim._PacketHelper.encodeLength(headBuffer.limit))
  packetBuffer.append(headBuffer)
  packetBuffer.flip()
  return ucim.RC4Encript.update(packetBuffer.toArrayBuffer())
}

ucim.SubMsgPacket = function (ispattern, channelArray) {
  if (typeof channelArray === 'undefined') {
    return
  }

  var headBuffer = dcodeIO.ByteBuffer.allocate(1024, true, false)
  headBuffer.writeByte(5)//sid
  headBuffer.writeByte(1)//cid
  headBuffer.writeInt16(0)//ser
  if (ispattern) {
    headBuffer.writeByte(ucim.TAG_WithField)//tag
    var dataBytes = ucim._UcimUtils.strToUTF8Bytes('pattern')
    headBuffer.append(ucim._PacketHelper.encodeLength(dataBytes.length))
    headBuffer.append(dataBytes)
  } else {
    headBuffer.writeByte(0)//tag
  }
  headBuffer.flip()

  var dataBuffer = dcodeIO.ByteBuffer.allocate(1024, true, false)
  dataBuffer.append(ucim._PacketHelper.encodeLength(channelArray.length))
  channelArray.forEach(function (x, i) {
    var dataBytes = ucim._UcimUtils.strToUTF8Bytes(x)
    dataBuffer.append(ucim._PacketHelper.encodeLength(dataBytes.length))
    dataBuffer.append(dataBytes)
  })
  dataBuffer.flip()

  var packetLen = headBuffer.limit + dataBuffer.limit

  var packetBuffer = dcodeIO.ByteBuffer.allocate(1024, true, false)
  packetBuffer.append(ucim._PacketHelper.encodeLength(packetLen))
  packetBuffer.append(headBuffer)
  packetBuffer.append(dataBuffer)
  packetBuffer.flip()
  return ucim.RC4Encript.update(packetBuffer.toArrayBuffer())
}

ucim.UnSubMsgPacket = function (ispattern, channelArray) {
  if (typeof channelArray === 'undefined') {
    return
  }

  var headBuffer = dcodeIO.ByteBuffer.allocate(1024, true, false)
  headBuffer.writeByte(5)//sid
  headBuffer.writeByte(2)//cid
  headBuffer.writeInt16(0)//ser
  if (ispattern) {
    headBuffer.writeByte(ucim.TAG_WithField)//tag
    var dataBytes = ucim._UcimUtils.strToUTF8Bytes('pattern')
    headBuffer.append(ucim._PacketHelper.encodeLength(dataBytes.length))
    headBuffer.append(dataBytes)
  } else {
    headBuffer.writeByte(0)//tag
  }
  headBuffer.flip()

  var dataBuffer = dcodeIO.ByteBuffer.allocate(1024, true, false)
  dataBuffer.append(ucim._PacketHelper.encodeLength(channelArray.length))
  channelArray.forEach(function (x, i) {
    var dataBytes = ucim._UcimUtils.strToUTF8Bytes(x)
    dataBuffer.append(ucim._PacketHelper.encodeLength(dataBytes.length))
    dataBuffer.append(dataBytes)
  })
  dataBuffer.flip()

  var packetLen = headBuffer.limit + dataBuffer.limit

  var packetBuffer = dcodeIO.ByteBuffer.allocate(1024, true, false)
  packetBuffer.append(ucim._PacketHelper.encodeLength(packetLen))
  packetBuffer.append(headBuffer)
  packetBuffer.append(dataBuffer)
  packetBuffer.flip()
  return ucim.RC4Encript.update(packetBuffer.toArrayBuffer())
}

ucim.MessageAdapter = function () {


  this.onProcess = function (arrayBuffer, handlerObj) {
    // var byteDatas = ucim.RC4Decript.update(arrayBuffer);
    // if (byteDatas.length == 0) {
    //     console.log("解密失败了，请刷新网页试试");
    //     return;
    // }
    var byteBuffer = dcodeIO.ByteBuffer.wrap(arrayBuffer, 'binary', true, false)
    var packetLen = ucim._UcimUtils.getLength(byteBuffer)
    var sid = byteBuffer.readByte()
    var cid = byteBuffer.readByte()
    var ser = byteBuffer.readUInt16()
    var tag = byteBuffer.readByte()
    var field
    if ((tag & ucim.TAG_WithField) != 0) {
      var fieldLen = ucim._UcimUtils.getLength(byteBuffer)
      field = byteBuffer.readUTF8String(fieldLen)
    }
    var resCode = 0

    if ((tag & ucim.TAG_Response) != 0) {
      resCode = byteBuffer.readInt16()
    }
    console.log('开始(内容长度):', packetLen)
    console.log('SID:', sid)
    console.log('CID:', cid)
    console.log('ser:', ser)
    console.log('tag:', tag)
    console.log('结果:', resCode)

    if (sid == 2 && cid == 2 && handlerObj.onLogin && typeof handlerObj.onLogin === 'function') {
      var saProps = new SAProperty()
      saProps.decodeFrom(byteBuffer)
      console.log('数据1:', saProps.getString(0))
      console.log('数据2:', saProps.getString(2))
      handlerObj.onLogin(resCode)
      if (resCode == 200) {
        userLoginState = true
        if (typeof ucim.keepAliveTimer != 'undefined') {
          window.clearInterval(ucim.keepAliveTimer)
        }
        ucim.keepAliveTimer = setInterval(function () {
          ucim.currentConnection.sendMsg(new ucim.KeepAlivePacket())
        }, 10000);

        (new ucim.ExternalMessageService()).subscribeMsg(Object.keys(subchannels));
        (new ucim.ExternalMessageService()).psubscribeMsg(Object.keys(psubchannels))

        if (!userInfo['isGuest']) {
          ucim.currentConnection.sendMsg(new ucim.UcimChatSensitiveMessagePacket(ucim.currentUserId))
        }
      } else {
        ucim.currentUserId = undefined
        userLoginState = false
      }
    } else if (sid == 1 && cid == 1) {

    } else if (sid == 7 && cid == 2 && handlerObj.onChatMsg && typeof handlerObj.onChatMsg === 'function') {
      var saProps = new SAProperty()
      saProps.decodeFrom(byteBuffer)
      var chatRoomHelper = new ucim.ChatRoomHelper()
      var msg = chatRoomHelper.newMessageFromProps(saProps)
      handlerObj.onChatMsg(msg)
    } else if (sid == 13 && cid == 7 && handlerObj.onChatRoomMsg && typeof handlerObj.onChatRoomMsg === 'function') {
      var saProps = new SAProperty()
      saProps.decodeFrom(byteBuffer)
      var chatRoomHelper = new ucim.ChatRoomHelper()
      var msg = chatRoomHelper.newRoomMsgFromSAProp(saProps)
      handlerObj.onChatRoomMsg(msg)
    } else if (sid == 15 && cid == 7 && handlerObj.onSubMsg && typeof handlerObj.onSubMsg === 'function') {
      var saProps = new SAProperty()
      saProps.decodeFrom(byteBuffer)
      var chatRoomHelper = new ucim.ChatRoomHelper()
      var msg = chatRoomHelper.newMessageFromProps(saProps)
      if (typeof field != 'undefined') {
        msg.setChannel(field)
        console.log('field is ' + field)
      }
      handlerObj.onSubMsg(msg)
    } else if (sid == 13 && cid == 2 && handlerObj.onEnterRoom && typeof handlerObj.onEnterRoom === 'function') {
      var chatRoomHelper = new ucim.ChatRoomHelper()
      var roomProps = new SAProperty()
      roomProps.decodeFrom(byteBuffer)
      var room = chatRoomHelper.createRoomInfo(roomProps)

      var memberProps = new SAProperty()
      memberProps.decodeFrom(byteBuffer)
      var rommMember = chatRoomHelper.createRommMember(memberProps)
      handlerObj.onEnterRoom(room, rommMember)
    } else if (sid == 13 && cid == 4 && handlerObj.onExitRoom && typeof handlerObj.onExitRoom === 'function') {
      handlerObj.onExitRoom(field)
    } else if (sid == 13 && cid == 9 && handlerObj.onHistory && typeof handlerObj.onHistory === 'function') {
      var msgLen = ucim._UcimUtils.getLength(byteBuffer)
      var msgArray = new Array(msgLen)
      if (msgLen > 0) {
        var chatRoomHelper = new ucim.ChatRoomHelper()
        for (var i = 0; i < msgLen; i++) {
          var roomMsgProps = new SAProperty()
          roomMsgProps.decodeFrom(byteBuffer)
          var msg = chatRoomHelper.newRoomMsgFromSAProp(roomMsgProps)
          msgArray[i] = msg
        }
      }
      handlerObj.onHistory(msgArray)
    } else if (sid == 13 && cid == 31 && handlerObj.onMuteList && typeof handlerObj.onMuteList === 'function') {
      var memberLen = ucim._UcimUtils.getLength(byteBuffer)
      var memberArray = new Array(memberLen)
      if (memberLen > 0) {
        var chatRoomHelper = new ucim.ChatRoomHelper()
        for (var i = 0; i < memberLen; i++) {
          var roomMemberProps = new SAProperty()
          roomMemberProps.decodeFrom(byteBuffer)

          var roomMember = chatRoomHelper.createRommMember(roomMemberProps)
          memberArray[i] = roomMember
        }
      }
      handlerObj.onMuteList(memberArray)
    } else if (sid == 13 && cid == 32 && handlerObj.onBlackList && typeof handlerObj.onBlackList === 'function') {
      var memberLen = ucim._UcimUtils.getLength(byteBuffer)
      var memberArray = new Array(memberLen)
      if (memberLen > 0) {
        var chatRoomHelper = new ucim.ChatRoomHelper()
        for (var i = 0; i < memberLen; i++) {
          var roomMemberProps = new SAProperty()
          roomMemberProps.decodeFrom(byteBuffer)

          var roomMember = chatRoomHelper.createRommMember(roomMemberProps)
          memberArray[i] = roomMember
        }
      }
      handlerObj.onBlackList(memberArray)
    } else if (sid == 13 && cid == 33 && handlerObj.onManagerList && typeof handlerObj.onManagerList === 'function') {
      var memberLen = ucim._UcimUtils.getLength(byteBuffer)
      var memberArray = new Array(memberLen)
      if (memberLen > 0) {
        var chatRoomHelper = new ucim.ChatRoomHelper()
        for (var i = 0; i < memberLen; i++) {
          var roomMemberProps = new SAProperty()
          roomMemberProps.decodeFrom(byteBuffer)

          var roomMember = chatRoomHelper.createRommMember(roomMemberProps)
          memberArray[i] = roomMember
        }
      }
      handlerObj.onManagerList(memberArray)
    } else if (sid == 15 && cid == 1) {
      var saProps = new SAProperty()
      saProps.decodeFrom(byteBuffer)
      if (saProps.length == 0 || typeof saProps.getString(2) == 'undefined') {
        return
      }
      //handlerObj.onSensitiveWords(saProps.getString(2));
      var sensitiveWordMapName = window.localStorage.getItem('sensitiveWordMapName')
      var sensitiveWordString = window.localStorage.getItem('sensitiveWordString')
      var urlsArray = saProps.getString(2).split('/')
      if (urlsArray[urlsArray.length - 1] == sensitiveWordMapName && typeof sensitiveWordString == 'string' && sensitiveWordString.length > 0) {
        var words = sensitiveWordString.split('\r\n')
        if (words.length > 0) {
          ucim.sensitiveWordMap = makeSensitiveMap(words)
          return
        }
      }
      //var param = "type=sensitiveword&filename=" + "1526956709432" + "&token=" + userInfo['token'];
      //var sensitiveWord = getSensitiveWord("localIp/file?" + param, "");
      var sensitiveWord = getSensitiveWord(saProps.getString(2), '')
      var words = sensitiveWord.split('\r\n')
      console.log('sensitiveWord is ' + words)
      if (words.length == 0) {
        window.localStorage.setItem('sensitiveWordMapName', '')
        window.localStorage.setItem('sensitiveWordString', '')
        return
      }

      ucim.sensitiveWordMap = makeSensitiveMap(words)
      window.localStorage.setItem('sensitiveWordMapName', urlsArray[urlsArray.length - 1])
      window.localStorage.setItem('sensitiveWordString', sensitiveWord)

      //console.log("sensitiveWord filter " + filterSensitiveWord("法轮功", ucim.sensitiveWordMap));

    }
  }
}

//////////////////////////////////////////////////////////////
//service
ucim.AuthService = function () {
  this.login = function (userId, isGuest, token) {
    userInfo['userId'] = userId
    userInfo['isGuest'] = isGuest
    userInfo['token'] = token
    if (typeof ucim.currentConnection === 'undefined') {
      return
    }
    ucim.currentUserId = userId
    ucim.currentConnection.sendMsg(new ucim.LoginPacket(userId, isGuest, token))
  }

  this.logout = function () {
    ucim.currentConnection.close()
  }

  this.reOpen = function (hostUrl) {
    ucim.currentConnection.openEx(hostUrl)
  }
}

ucim.ExternalMessageService = function () {
  this.subscribeMsg = function (channels) {
    if (typeof ucim.currentConnection === 'undefined' || channels.length == 0) {
      return
    }
    if (typeof channels == 'string') {
      channels = channels.split(',')
    }
    ucim.currentConnection.sendMsg(new ucim.SubMsgPacket(false, channels))
    channels.forEach(function (item) {
      subchannels[item] = item
    })

  }

  this.psubscribeMsg = function (channels) {
    if (typeof ucim.currentConnection === 'undefined' || channels.length == 0) {
      return
    }
    if (typeof channels == 'string') {
      channels = channels.split(',')
    }
    ucim.currentConnection.sendMsg(new ucim.SubMsgPacket(true, channels))
    channels.forEach(function (item) {
      subchannels[item] = item
    })
  }

  this.unsubscribeMsg = function (channels) {
    if (typeof ucim.currentConnection === 'undefined' || channels.length == 0) {
      return
    }
    if (typeof channels == 'string') {
      channels = channels.split(',')
    }
    ucim.currentConnection.sendMsg(new ucim.UnSubMsgPacket(false, channels))
    channels.forEach(function (item) {
      delete subchannels.item
    })
  }

  this.unpsubscribeMsg = function (channels) {
    if (typeof ucim.currentConnection === 'undefined' || channels.length == 0) {
      return
    }
    if (typeof channels == 'string') {
      channels = channels.split(',')
    }
    ucim.currentConnection.sendMsg(new ucim.UnSubMsgPacket(true, channels))
    channels.forEach(function (item) {
      delete subchannels.item
    })
  }

}

ucim.ChatRoomService = function () {
  this.enterRoom = function (userId, userNick, roomId) {
    userInfo['roomId'] = roomId
    userInfo['userNick'] = userNick
    if (typeof ucim.currentConnection === 'undefined') {
      return -1
    }
    ucim.currentConnection.sendMsg(new ucim.UcEnterRoomPacket(userId, userNick, roomId))
    return 200
  }

  this.backstageEnterRoom = function (userId, userNick, memberType, roomId) {
    if (typeof ucim.currentConnection === 'undefined') {
      return -1
    }
    ucim.currentConnection.sendMsg(new ucim.UcBackstageEnterRoomPacket(userId, userNick, memberType, roomId))
    return 200
  }

  this.exitRoom = function (userId, userNick, roomId) {
    if (typeof ucim.currentConnection === 'undefined') {
      return -1
    }
    ucim.currentConnection.sendMsg(new ucim.UcExitRoomPacket(userId, userNick, roomId))
    return 200
  }

  this.sendMessage = function (roomId, nickname, content) {
    if (typeof ucim.currentConnection === 'undefined') {
      return -1
    }
    if (typeof ucim.currentUserId === 'undefined') {
      return -2
    }
    ucim.currentConnection.sendMsg(new ucim.UcimChatRoomMessagePacket(ucim.currentUserId, nickname, roomId, JSON.stringify(content)))
    return 200
  }

  this.markChatRoomBlackList = function (roomId, target, isAdd) {
    if (typeof ucim.currentConnection === 'undefined') {
      return -1
    }
    if (typeof ucim.currentUserId === 'undefined' || typeof roomId === 'undefined' || typeof target === 'undefined') {
      return -2
    }
    ucim.currentConnection.sendMsg(new ucim.MarkChatRoomOptionPacket(roomId, target, -1, isAdd))
  }

  this.markChatRoomManager = function (roomId, target, isAdd) {
    if (typeof ucim.currentConnection === 'undefined') {
      return -1
    }
    if (typeof ucim.currentUserId === 'undefined' || typeof roomId === 'undefined' || typeof target === 'undefined') {
      return -2
    }
    ucim.currentConnection.sendMsg(new ucim.MarkChatRoomOptionPacket(roomId, target, 1, isAdd))
  }

  this.markChatRoomMutedList = function (roomId, target, isAdd) {
    if (typeof ucim.currentConnection === 'undefined') {
      return -1
    }
    if (typeof ucim.currentUserId === 'undefined' || typeof roomId === 'undefined' || typeof target === 'undefined') {
      return -2
    }
    ucim.currentConnection.sendMsg(new ucim.MarkChatRoomOptionPacket(roomId, target, -2, isAdd))
  }

  this.markChatRoomTempMute = function (roomId, target, duration, isNotify) {
    if (typeof ucim.currentConnection === 'undefined') {
      return -1
    }
    if (typeof ucim.currentUserId === 'undefined' || typeof roomId === 'undefined' || typeof target === 'undefined') {
      return -2
    }
    ucim.currentConnection.sendMsg(new ucim.MarkChatRoomTempMutePacket(roomId, target, duration, isNotify))
  }

  this.markNormalMember = function (roomId, target, isAdd) {
    if (typeof ucim.currentConnection === 'undefined') {
      return -1
    }
    if (typeof ucim.currentUserId === 'undefined' || typeof roomId === 'undefined' || typeof target === 'undefined') {
      return -2
    }
    ucim.currentConnection.sendMsg(new ucim.MarkChatRoomOptionPacket(roomId, target, 2, isAdd))
  }

  this.markNormalMember = function (roomId, target, isAdd) {
    if (typeof ucim.currentConnection === 'undefined') {
      return -1
    }
    if (typeof ucim.currentUserId === 'undefined' || typeof roomId === 'undefined' || typeof target === 'undefined') {
      return -2
    }
    ucim.currentConnection.sendMsg(new ucim.MarkChatRoomOptionPacket(roomId, target, 2, isAdd))
  }

  this.roomPullBlackList = function (roomId) {
    if (typeof ucim.currentConnection === 'undefined') {
      return -1
    }
    if (typeof ucim.currentUserId === 'undefined' || typeof roomId === 'undefined') {
      return -2
    }
    ucim.currentConnection.sendMsg(new ucim.UcRoomPullBlackListPacket(roomId))
  }

  this.roomPullManager = function (roomId) {
    if (typeof ucim.currentConnection === 'undefined') {
      return -1
    }
    if (typeof ucim.currentUserId === 'undefined' || typeof roomId === 'undefined') {
      return -2
    }
    ucim.currentConnection.sendMsg(new ucim.UcRoomPullManagerPacket(roomId))
  }

  this.roomPullMsgHistory = function (roomId, count) {
    if (typeof ucim.currentConnection === 'undefined') {
      return -1
    }
    if (typeof ucim.currentUserId === 'undefined' || typeof roomId === 'undefined' || count < 0) {
      return -2
    }
    ucim.currentConnection.sendMsg(new ucim.UcRoomPullMsgHistoryPacket(roomId, count))
  }

  this.roomPullMuteList = function (roomId) {
    if (typeof ucim.currentConnection === 'undefined') {
      return -1
    }
    if (typeof ucim.currentUserId === 'undefined' || typeof roomId === 'undefined') {
      return -2
    }
    ucim.currentConnection.sendMsg(new ucim.UcRoomPullMuteListPacket(roomId))
  }

  this.roomKickMember = function (target, reason, roomId) {
    if (typeof ucim.currentConnection === 'undefined') {
      return -1
    }
    if (typeof ucim.currentUserId === 'undefined' || typeof roomId === 'undefined') {
      return -2
    }
    ucim.currentConnection.sendMsg(new ucim.UcRoomKickPacket(target, reason, roomId))
  }

  this.filterSensitiveWord = function (text) {
    return filterSensitiveWord(text, ucim.sensitiveWordMap)
  }
}
/**
 * 导出所有类
 */
// module.exports.UcimServiceSystemMessage = UcimServiceSystemMessage;
// module.exports.UcimConnectionManager = UcimConnectionManager;
// module.exports.UcimWebsocket = UcimWebsocket;