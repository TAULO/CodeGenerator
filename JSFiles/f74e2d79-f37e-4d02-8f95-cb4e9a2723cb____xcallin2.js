
/*
20210727 Milo
软件名：微信小程序携程：周周乐
[rewrite_remote]
https://m.ctrip.com/restapi  script-request-body  https://raw.githubusercontent.com/milomoon/MyScripts/main/zzlin1.js
[HITM]
m.ctrip.com
cron 30 0 * * *

一、完成周周乐看视频任务获得任务ck
二、进入周周乐获得抽卡数据ck
三、完成一次抽卡获得抽卡ck
四、完成一次签到获得签到ck
五、完成一次会员签到获得ck
*/






const $ = new Env('携程周周乐');
let xccksp1url = $.getdata('xccksp1url')
let xccksp1hd = $.getdata('xccksp1hd')
let xccksp1body = $.getdata('xccksp1body')
let xcfp1url = $.getdata('xcfp1url')
let xcfp1hd = $.getdata('xcfp1hd')
let xcfp1body = $.getdata('xcfp1body')
let xcsj1url = $.getdata('xcsj1url')
let xcsj1hd = $.getdata('xcsj1hd')
let xcsj1body = $.getdata('xcsj1body')
let xcqd1url = $.getdata('xcqd1url')
let xcqd1hd = $.getdata('xcqd1hd')
let xcqd1body = $.getdata('xcqd1body')
/*
let xchyqd1url = $.getdata('xchyqd1url')
let xchyqd1hd = $.getdata('xchyqd1hd')
let xchyqd1body = $.getdata('xchyqd1body')
*/
let xclq1url = $.getdata('xclq1url')
let xclq1hd = $.getdata('xclq1hd')
let xclq1body = $.getdata('xclq1body')
let user_id = ''
let Y = ''
!(async () => {
  if (typeof $request !== "undefined") {
    await xcqdck()     
    await xcckspck() 
    await xcfpck()     
    await xcsjck()     
    await xchyqdck()
    await xclqck()   
  } else {
     //激活   
     await jhxcckspqd();
     await $.wait(1000);
     await jhxc10s1();
     await $.wait(1000);
     await jhxc10s2();
     await $.wait(1000);
     await jhxc10s3();
     await $.wait(1000);
     await jhxc10s4();
     await $.wait(1000);
     await jhxc10s5();
     await $.wait(1000);
     await jhxc10s6();
     await $.wait(1000);
     await jhxc10s7();
     await $.wait(1000);
     await jhxc10s8();
     await $.wait(1000);
  //签到
/*
    await xchyqd();
    await $.wait(1000);
*/
    await xcqdqd();
    await $.wait(1000);
    for (let c = 0; c < 5; c++) {
        $.index = c + 1
       console.log(`\n第${c+1}次看视频！`)

               await xcckspqd()
               await $.wait(1000);}
    for (let c = 0; c < 3; c++) {
        $.index = c + 1
       console.log(`\n第${c+1}次看视频！`)

               await xc10s6()
               await $.wait(1000);}
    for (let c = 0; c < 3; c++) {
         $.index = c + 1
         console.log(`\n第${c+1}次看视频！`)
        
             await xc10s8()
             await $.wait(1000);}
   await xc10s1(); 
   await $.wait(1000);
   await xc10s2();
   await $.wait(1000);
   await xc10s3();
   await $.wait(1000);
   await xc10s4();
   await $.wait(1000);
   await xc10s5();
   await $.wait(1000);
   await xc10s7();
   await $.wait(1000);
   await xclq1();
   await $.wait(1000);
   await xclq2();
   await $.wait(1000);
   await xclq3();
   await $.wait(1000);
   await xclq4();
   await $.wait(1000);
   await xclq5();
   await $.wait(1000);
   await xclq6();
   await $.wait(1000);
   await xclq7();
   await $.wait(1000);
   await xclq8();
   await $.wait(1000);
   await xclq9();
   await $.wait(1000);
   await xcsj()
   await $.wait(1000)
}
})()
  .catch((e) => $.logErr(e))
  .finally(() => $.done())
//获取ck
function xcckspck() {
   if ($request.url.indexOf("todoTask") > -1) {
    $.setdata($request.url,'xccksp1url')
    $.log(xccksp1url)
$.setdata(JSON.stringify($request.headers),'xccksp1hd')
$.log(xccksp1hd)
    $.setdata($request.body,'xccksp1body')
$.log(xccksp1body)
   $.msg($.name,"","携程五次视频body成功！")
    } 
  }

  function xcfpck() {
    if ($request.url.indexOf("sendZzlCardToUser") > -1) {
     $.setdata($request.url,'xcfp1url')
     $.log(xcfp1url)
 $.setdata(JSON.stringify($request.headers),'xcfp1hd')
 $.log(xcfp1hd)
     $.setdata($request.body,'xcfp1body')
 $.log(xcfp1body)
    $.msg($.name,"","获取携程发牌body成功！")
     } 
   }
 
   function xcsjck() {
     if ($request.url.indexOf("getZzlUserCard") > -1) {
      $.setdata($request.url,'xcsj1url')
      $.log(xcsj1url)
  $.setdata(JSON.stringify($request.headers),'xcsj1hd')
  $.log(xcsj1hd)
      $.setdata($request.body,'xcsj1body')
  $.log(xcsj1body)
     $.msg($.name,"","获取携程发牌数据body成功！")
      } 
    }


    function xcqdck() {
        if ($request.url.indexOf("signin") > -1) {
         $.setdata($request.url,'xcqd1url')
         $.log(xcqd1url)
     $.setdata(JSON.stringify($request.headers),'xcqd1hd')
     $.log(xcqd1hd)
         $.setdata($request.body,'xcqd1body')
     $.log(xcqd1body)
        $.msg($.name,"","携程签到获取body成功！")
         }     
       }

/*
       function xchyqdck() {
        if ($request.url.indexOf("saveDailyBonus") > -1) {
         $.setdata($request.url,'xchyqd1url')
         $.log(xchyqd1url)
     $.setdata(JSON.stringify($request.headers),'xchyqd1hd')
     $.log(xchyqd1hd)
         $.setdata($request.body,'xchyqd1body')
     $.log(xchyqd1body)
        $.msg($.name,"","获取携程会员签到body成功！")
         } 
       }
*/

function xclqck() {
        if ($request.url.indexOf("awardTask") > -1) {
         $.setdata($request.url,'xclq1url')
         $.log(xclq1url)
     $.setdata(JSON.stringify($request.headers),'xclq1hd')
     $.log(xclq1hd)
         $.setdata($request.body,'xclq1body')
     $.log(xclq1body)
        $.msg($.name,"","获取领奖body成功！")
         } 
       }




//console.log(`${xcfp1url}`)
//console.log(`${xcfp1hd}`)
//console.log(`${xcfp1body}`)
//console.log(`${xclq1url}`)
//console.log(`${xclq1hd}`)
//console.log(`${xclq1body}`)
//console.log(`${xcqd1url}`)
//console.log(`${xcqd1hd}`)
//console.log(`${xcqd1body}`)

//激活任务
function jhxcckspqd(timeout = 0) {
    return new Promise((resolve) => {
  //user_id=xccksp1url.match(/user_id=(\d+)/)[1]
  cookie = xccksp1hd.match(/"Cookie":"([\w=&;]+)"/)[1]
  
  auth = xccksp1body.match(/"auth":"(\w+)"/)[1]
  appId1 = xccksp1body.match(/"appId","value":"(\w+)"/)[1]
  let url = {url : `https://m.ctrip.com/restapi/soa2/22598/todoTask`,
    //let url = {url : xccksp1url,
             headers : {
            "Content-Type": "application/json",
            "Cookie": "${cookie}"
    },
             body : `{"channelCode":"6733N074D4","taskId":36,"done":0,"status":0,"head":{"ctok":"","cver":"1.1.91","lang":"01","sid":"","syscode":"30","auth":"${auth}","sauth":"","extension":[{"name":"appId","value":"${appId1}"},{"name":"scene","value":"1089"}]}}`
      };
        $.post(url, async (err, resp, data) => {
          try {
             
      const result = JSON.parse(data)
          if(result.code == 200){
          console.log('\n激活1成功：'+result.message)
  }else{
          console.log('\n激活1失败：'+result.message)
  }
          } catch (e) {
          } finally {
            resolve()
          }
      },timeout)
    })
  }

  
//激活2
  function jhxc10s1(timeout = 0) {
    return new Promise((resolve) => {
  //user_id=xccksp1url.match(/user_id=(\d+)/)[1]
  cookie = xccksp1hd.match(/"Cookie":"([\w=&;]+)"/)[1]
  
  auth = xccksp1body.match(/"auth":"(\w+)"/)[1]
  appId1 = xccksp1body.match(/"appId","value":"(\w+)"/)[1]
  let url = {url : `https://m.ctrip.com/restapi/soa2/22598/todoTask`,
    //let url = {url : xccksp1url,
             headers : {
            "Content-Type": "application/json",
            "Cookie": "${cookie}"
    },
          body : `{"channelCode":"6733N074D4","taskId":44,"done":0,"status":0,"head":{"ctok":"","cver":"1.1.91","lang":"01","sid":"","syscode":"30","auth":"${auth}","sauth":"","extension":[{"name":"appId","value":"${appId1}"},{"name":"scene","value":"1089"}]}}`
  }
        $.post(url, async (err, resp, data) => {
          try {
             
      const result = JSON.parse(data)
          if(result.code == 200){
          console.log('\n激活拼团浏览成功：'+result.message)
  }else{
          console.log('\n激活拼团浏览失败：'+result.message)
  }
          } catch (e) {
          } finally {
            resolve()
          }
      },timeout)
    })
  }




//激活3
function jhxc10s2(timeout = 0) {
    return new Promise((resolve) => {
  //user_id=xccksp1url.match(/user_id=(\d+)/)[1]
  cookie = xccksp1hd.match(/"Cookie":"([\w=&;]+)"/)[1]
  
  auth = xccksp1body.match(/"auth":"(\w+)"/)[1]
  appId1 = xccksp1body.match(/"appId","value":"(\w+)"/)[1]
  let url = {url : `https://m.ctrip.com/restapi/soa2/22598/todoTask`,
    //let url = {url : xccksp1url,
             headers : {
            "Content-Type": "application/json",
            "Cookie": "${cookie}"
    },
          body : `{"channelCode":"6733N074D4","taskId":42,"done":0,"status":0,"head":{"ctok":"","cver":"1.1.91","lang":"01","sid":"","syscode":"30","auth":"${auth}","sauth":"","extension":[{"name":"appId","value":"${appId1}"},{"name":"scene","value":"1089"}]}}`
  }
        $.post(url, async (err, resp, data) => {
          try {
             
      const result = JSON.parse(data)
          if(result.code == 200){
          console.log('\n激活积分浏览成功：'+result.message)
  }else{
          console.log('\n激活积分浏览失败：'+result.message)
  }
          } catch (e) {
          } finally {
            resolve()
          }
      },timeout)
    })
  }



//激活4
  function jhxc10s3(timeout = 0) {
    return new Promise((resolve) => {
  //user_id=xccksp1url.match(/user_id=(\d+)/)[1]
  cookie = xccksp1hd.match(/"Cookie":"([\w=&;]+)"/)[1]
  
  auth = xccksp1body.match(/"auth":"(\w+)"/)[1]
  appId1 = xccksp1body.match(/"appId","value":"(\w+)"/)[1]
  let url = {url : `https://m.ctrip.com/restapi/soa2/22598/todoTask`,
    //let url = {url : xccksp1url,
             headers : {
            "Content-Type": "application/json",
            "Cookie": "${cookie}"
    },
          body : `{"channelCode":"6733N074D4","taskId":40,"done":0,"status":0,"head":{"ctok":"","cver":"1.1.91","lang":"01","sid":"","syscode":"30","auth":"${auth}","sauth":"","extension":[{"name":"appId","value":"${appId1}"},{"name":"scene","value":"1089"}]}}`
  }
        $.post(url, async (err, resp, data) => {
          try {
             
      const result = JSON.parse(data)
          if(result.code == 200){
          console.log('\n激活周乐历险记成功：'+result.message)
  }else{
          console.log('\n激活周乐历险记失败：'+result.message)
  }
          } catch (e) {
          } finally {
            resolve()
          }
      },timeout)
    })
  }
  
  
  //激活5
  function jhxc10s4(timeout = 0) {
      return new Promise((resolve) => {
    //user_id=xccksp1url.match(/user_id=(\d+)/)[1]
    cookie = xccksp1hd.match(/"Cookie":"([\w=&;]+)"/)[1]
    
    auth = xccksp1body.match(/"auth":"(\w+)"/)[1]
    appId1 = xccksp1body.match(/"appId","value":"(\w+)"/)[1]
    let url = {url : `https://m.ctrip.com/restapi/soa2/22598/todoTask`,
      //let url = {url : xccksp1url,
               headers : {
              "Content-Type": "application/json",
              "Cookie": "${cookie}"
      },
          body : `{"channelCode":"69G8EV4BX3","taskId":79,"done":0,"status":0,"head":{"ctok":"","cver":"1.1.91","lang":"01","sid":"","syscode":"30","auth":"${auth}","sauth":"","extension":[{"name":"appId","value":"${appId1}"},{"name":"scene","value":"1089"}]}}`
    }
          $.post(url, async (err, resp, data) => {
            try {
               
        const result = JSON.parse(data)
            if(result.code == 200){
            console.log('\n激活骰子大浪淘沙任务成功：'+result.message)
    }else{
            console.log('\n激活骰子大浪淘沙任务失败：'+result.message)
    }
            } catch (e) {
            } finally {
              resolve()
            }
        },timeout)
      })
    }
  
  
  
 //激活6 
    function jhxc10s5(timeout = 0) {
      return new Promise((resolve) => {
    //user_id=xccksp1url.match(/user_id=(\d+)/)[1]
    cookie = xccksp1hd.match(/"Cookie":"([\w=&;]+)"/)[1]
    
    auth = xccksp1body.match(/"auth":"(\w+)"/)[1]
    appId1 = xccksp1body.match(/"appId","value":"(\w+)"/)[1]
    let url = {url : `https://m.ctrip.com/restapi/soa2/22598/todoTask`,
      //let url = {url : xccksp1url,
               headers : {
              "Content-Type": "application/json",
              "Cookie": "${cookie}"
      },
          body : `{"channelCode":"69G8EV4BX3","taskId":40,"done":0,"status":0,"head":{"ctok":"","cver":"1.1.91","lang":"01","sid":"","syscode":"30","auth":"${auth}","sauth":"","extension":[{"name":"appId","value":"${appId1}"},{"name":"scene","value":"1089"}]}}`
    }
          $.post(url, async (err, resp, data) => {
            try {
               
        const result = JSON.parse(data)
            if(result.code == 200){
            console.log('\n激活骰子周周乐任务成功：'+result.message)
    }else{
            console.log('\n激活骰子周周乐任务失败：'+result.message)
    }
            } catch (e) {
            } finally {
              resolve()
            }
        },timeout)
      })
    }
  
  
 //激活7 
  function jhxc10s6(timeout = 0) {
      return new Promise((resolve) => {
    //user_id=xccksp1url.match(/user_id=(\d+)/)[1]
    cookie = xccksp1hd.match(/"Cookie":"([\w=&;]+)"/)[1]
    
    auth = xccksp1body.match(/"auth":"(\w+)"/)[1]
    appId1 = xccksp1body.match(/"appId","value":"(\w+)"/)[1]
    let url = {url : `https://m.ctrip.com/restapi/soa2/22598/todoTask`,
      //let url = {url : xccksp1url,
               headers : {
              "Content-Type": "application/json",
              "Cookie": "${cookie}"
      },
          body : `{"channelCode":"69G8EV4BX3","taskId":59,"done":0,"status":0,"head":{"ctok":"","cver":"1.1.91","lang":"01","sid":"","syscode":"30","auth":"${auth}","sauth":"","extension":[{"name":"appId","value":"${appId1}"},{"name":"scene","value":"1089"}]}}`
    }
          $.post(url, async (err, resp, data) => {
            try {
               
        const result = JSON.parse(data)
            if(result.code == 200){
            console.log('\n激活骰子看视频任务成功：'+result.message)
    }else{
            console.log('\n激活骰子看视频任务失败：'+result.message)
    }
            } catch (e) {
            } finally {
              resolve()
            }
        },timeout)
      })
    }
  
//激活8  
    function jhxc10s7(timeout = 0) {
      return new Promise((resolve) => {
    //user_id=xccksp1url.match(/user_id=(\d+)/)[1]
    cookie = xccksp1hd.match(/"Cookie":"([\w=&;]+)"/)[1]
    
    auth = xccksp1body.match(/"auth":"(\w+)"/)[1]
    appId1 = xccksp1body.match(/"appId","value":"(\w+)"/)[1]
    let url = {url : `https://m.ctrip.com/restapi/soa2/22598/todoTask`,
      //let url = {url : xccksp1url,
               headers : {
              "Content-Type": "application/json",
              "Cookie": "${cookie}"
      },
          body : `{"channelCode":"6733N074D4","taskId":79,"done":0,"status":0,"head":{"ctok":"","cver":"1.1.91","lang":"01","sid":"","syscode":"30","auth":"${auth}","sauth":"","extension":[{"name":"appId","value":"${appId1}"},{"name":"scene","value":"1089"}]}}`
    }
          $.post(url, async (err, resp, data) => {
            try {
               
        const result = JSON.parse(data)
            if(result.code == 200){
            console.log('\n周乐大浪淘沙任务成功：'+result.message)
    }else{
            console.log('\n周乐大浪淘沙任务失败：'+result.message)
    }
            } catch (e) {
            } finally {
              resolve()
            }
        },timeout)
      })
    }
  
  
  
//激活9  
    function jhxc10s8(timeout = 0) {
      return new Promise((resolve) => {
    //user_id=xccksp1url.match(/user_id=(\d+)/)[1]
    cookie = xccksp1hd.match(/"Cookie":"([\w=&;]+)"/)[1]
    
    auth = xccksp1body.match(/"auth":"(\w+)"/)[1]
    appId1 = xccksp1body.match(/"appId","value":"(\w+)"/)[1]
    let url = {url : `https://m.ctrip.com/restapi/soa2/22598/todoTask`,
      //let url = {url : xccksp1url,
               headers : {
              "Content-Type": "application/json",
              "Cookie": "${cookie}"
      },
          body : `{"channelCode":"FK023GVTDY","taskId":60,"done":0,"status":0,"head":{"ctok":"","cver":"1.1.91","lang":"01","sid":"","syscode":"30","auth":"${auth}","sauth":"","extension":[{"name":"appId","value":"${appId1}"},{"name":"scene","value":"1089"}]}}`
    }
          $.post(url, async (err, resp, data) => {
            try {
               
        const result = JSON.parse(data)
            if(result.code == 200){
            console.log('\n激活看视频得积分任务成功：'+result.message)
    }else{
            console.log('\n激活看视频得积分任务失败：'+result.message)
    }
            } catch (e) {
            } finally {
              resolve()
            }
        },timeout)
      })
    }











//签到 
function xcqdqd(timeout = 0) {
    return new Promise((resolve) => {
  //user_id=xcqd1url.match(/user_id=(\d+)/)[1]
cookie = xccksp1hd.match(/"Cookie":"([\w=&;]+)"/)[1]
cid = xcqd1body.match(/"cid":"(\d+)"/)[1]
auth = xcqd1body.match(/"auth":"(\w+)"/)[1]
appId1 = xcqd1body.match(/"appId","value":"(\w+)"/)[1]
openid = xcqd1body.match(/"openId":"(\S+)"/)[1]
  let url = {url : `https://m.ctrip.com/restapi/soa2/16575/signin`,
    //let url = {url : xcqd1url,
          headers : 
          {"Content-Type": "application/json",
          "Cookie": "${cookie}"},
          body : `{"openId":"${openid}","activityId":"wechat_signin_activity","aid":"","sid":"","clickId":"","head":{"ctok":"","cver":"1.1.91","lang":"01","sid":"","syscode":"30","auth":"${auth}","sauth":"","extension":[{"name":"appId","value":"${appId1}"},{"name":"scene","value":"1089"}]}}`
  }
        $.post(url, async (err, resp, data) => {
          try {
             
      const result = JSON.parse(data)
          if(result.errcode == 0){
          console.log('\n普通签到成功：'+result.errmsg)
  }else{
          console.log('\n普通签到失败或已签到'+result.errmsg)
  }
          } catch (e) {
          } finally {
            resolve()
          }
      },timeout)
    })
  }

/*
  function xchyqd(timeout = 0) {
    return new Promise((resolve) => {
  //user_id=xchyqd1url.match(/user_id=(\d+)/)[1]
  //let url = {url : `https://m.ctrip.com/restapi/mkt/taskdistribute/userTodoTask`,
    let url = {url : xchyqd1url,
          headers : 
  JSON.parse(xchyqd1hd),
          body : xchyqd1body
  }
        $.post(url, async (err, resp, data) => {
          try {
             
      const result = JSON.parse(data)
          if(result.resultcode == 0){
          console.log('\n会员签到成功：'+result.resultmessage)
  }else{
          console.log('\n会员签到失败：'+result.resultmessage)
  }
          } catch (e) {
          } finally {
            resolve()
          }
      },timeout)
    })
  }
  */


function xcckspqd(timeout = 0) {
  return new Promise((resolve) => {
//user_id=xccksp1url.match(/user_id=(\d+)/)[1]
cookie = xccksp1hd.match(/"Cookie":"([\w=&;]+)"/)[1]
  
  auth = xccksp1body.match(/"auth":"(\w+)"/)[1]
  appId1 = xccksp1body.match(/"appId","value":"(\w+)"/)[1]
  let url = {url : `https://m.ctrip.com/restapi/soa2/22598/todoTask`,
    //let url = {url : xccksp1url,
             headers : {
            "Content-Type": "application/json",
            "Cookie": "${cookie}"
    },
        body : `{"channelCode":"6733N074D4","taskId":36,"done":1,"status":1,"head":{"ctok":"","cver":"1.1.91","lang":"01","sid":"","syscode":"30","auth":"${auth}","sauth":"","extension":[{"name":"appId","value":"${appId1}"},{"name":"scene","value":"1089"}]}}`
    }
      $.post(url, async (err, resp, data) => {
        try {
           
    const result = JSON.parse(data)
        if(result.code == 200){
        console.log('\n观看成功：'+result.message)
}else{
        console.log('\n观看失败：'+result.message)
}
        } catch (e) {
        } finally {
          resolve()
        }
    },timeout)
  })
}



function xc10s1(timeout = 0) {
  return new Promise((resolve) => {
//user_id=xccksp1url.match(/user_id=(\d+)/)[1]
cookie = xccksp1hd.match(/"Cookie":"([\w=&;]+)"/)[1]
  
  auth = xccksp1body.match(/"auth":"(\w+)"/)[1]
  appId1 = xccksp1body.match(/"appId","value":"(\w+)"/)[1]
  let url = {url : `https://m.ctrip.com/restapi/soa2/22598/todoTask`,
    //let url = {url : xccksp1url,
             headers : {
            "Content-Type": "application/json",
            "Cookie": "${cookie}"
    },
        body : `{"channelCode":"6733N074D4","taskId":44,"done":1,"status":1,"head":{"ctok":"","cver":"1.1.91","lang":"01","sid":"","syscode":"30","auth":"${auth}","sauth":"","extension":[{"name":"appId","value":"${appId1}"},{"name":"scene","value":"1089"}]}}`
}
      $.post(url, async (err, resp, data) => {
        try {
           
    const result = JSON.parse(data)
        if(result.code == 200){
        console.log('\n拼团浏览成功：'+result.message)
}else{
        console.log('\n拼团浏览失败：'+result.message)
}
        } catch (e) {
        } finally {
          resolve()
        }
    },timeout)
  })
}



function xc10s2(timeout = 0) {
  return new Promise((resolve) => {
//user_id=xccksp1url.match(/user_id=(\d+)/)[1]
cookie = xccksp1hd.match(/"Cookie":"([\w=&;]+)"/)[1]
  
  auth = xccksp1body.match(/"auth":"(\w+)"/)[1]
  appId1 = xccksp1body.match(/"appId","value":"(\w+)"/)[1]
  let url = {url : `https://m.ctrip.com/restapi/soa2/22598/todoTask`,
    //let url = {url : xccksp1url,
             headers : {
            "Content-Type": "application/json",
            "Cookie": "${cookie}"
    },
        body : `{"channelCode":"6733N074D4","taskId":42,"done":1,"status":1,"head":{"ctok":"","cver":"1.1.91","lang":"01","sid":"","syscode":"30","auth":"${auth}","sauth":"","extension":[{"name":"appId","value":"${appId1}"},{"name":"scene","value":"1089"}]}}`
}
      $.post(url, async (err, resp, data) => {
        try {
           
    const result = JSON.parse(data)
        if(result.code == 200){
        console.log('\n积分浏览成功：'+result.message)
}else{
        console.log('\n积分浏览失败：'+result.message)
}
        } catch (e) {
        } finally {
          resolve()
        }
    },timeout)
  })
}


function xc10s3(timeout = 0) {
  return new Promise((resolve) => {
//user_id=xccksp1url.match(/user_id=(\d+)/)[1]
cookie = xccksp1hd.match(/"Cookie":"([\w=&;]+)"/)[1]
  
  auth = xccksp1body.match(/"auth":"(\w+)"/)[1]
  appId1 = xccksp1body.match(/"appId","value":"(\w+)"/)[1]
  let url = {url : `https://m.ctrip.com/restapi/soa2/22598/todoTask`,
    //let url = {url : xccksp1url,
             headers : {
            "Content-Type": "application/json",
            "Cookie": "${cookie}"
    },
        body : `{"channelCode":"6733N074D4","taskId":40,"done":1,"status":1,"head":{"ctok":"","cver":"1.1.91","lang":"01","sid":"","syscode":"30","auth":"${auth}","sauth":"","extension":[{"name":"appId","value":"${appId1}"},{"name":"scene","value":"1089"}]}}`
}
      $.post(url, async (err, resp, data) => {
        try {
           
    const result = JSON.parse(data)
        if(result.code == 200){
        console.log('\n周乐历险记任务成功：'+result.message)
}else{
        console.log('\n周乐历险记任务失败：'+result.message)
}
        } catch (e) {
        } finally {
          resolve()
        }
    },timeout)
  })
}



function xc10s4(timeout = 0) {
    return new Promise((resolve) => {
  //user_id=xccksp1url.match(/user_id=(\d+)/)[1]
  cookie = xccksp1hd.match(/"Cookie":"([\w=&;]+)"/)[1]
  
  auth = xccksp1body.match(/"auth":"(\w+)"/)[1]
  appId1 = xccksp1body.match(/"appId","value":"(\w+)"/)[1]
  let url = {url : `https://m.ctrip.com/restapi/soa2/22598/todoTask`,
    //let url = {url : xccksp1url,
             headers : {
            "Content-Type": "application/json",
            "Cookie": "${cookie}"
    },
          body : `{"channelCode":"69G8EV4BX3","taskId":79,"done":1,"status":1,"head":{"ctok":"","cver":"1.1.91","lang":"01","sid":"","syscode":"30","auth":"${auth}","sauth":"","extension":[{"name":"appId","value":"${appId1}"},{"name":"scene","value":"1089"}]}}`
  }
        $.post(url, async (err, resp, data) => {
          try {
             
      const result = JSON.parse(data)
          if(result.code == 200){
          console.log('\n骰子大浪淘沙任务成功：'+result.message)
  }else{
          console.log('\n骰子大浪淘沙任务失败：'+result.message)
  }
          } catch (e) {
          } finally {
            resolve()
          }
      },timeout)
    })
  }




  function xc10s5(timeout = 0) {
    return new Promise((resolve) => {
  //user_id=xccksp1url.match(/user_id=(\d+)/)[1]
  cookie = xccksp1hd.match(/"Cookie":"([\w=&;]+)"/)[1]
  
  auth = xccksp1body.match(/"auth":"(\w+)"/)[1]
  appId1 = xccksp1body.match(/"appId","value":"(\w+)"/)[1]
  let url = {url : `https://m.ctrip.com/restapi/soa2/22598/todoTask`,
    //let url = {url : xccksp1url,
             headers : {
            "Content-Type": "application/json",
            "Cookie": "${cookie}"
    },
        body : `{"channelCode":"69G8EV4BX3","taskId":40,"done":1,"status":1,"head":{"ctok":"","cver":"1.1.91","lang":"01","sid":"","syscode":"30","auth":"${auth}","sauth":"","extension":[{"name":"appId","value":"${appId1}"},{"name":"scene","value":"1089"}]}}`
  }
        $.post(url, async (err, resp, data) => {
          try {
             
      const result = JSON.parse(data)
          if(result.code == 200){
          console.log('\n骰子周周乐任务成功：'+result.message)
  }else{
          console.log('\n骰子周周乐任务失败：'+result.message)
  }
          } catch (e) {
          } finally {
            resolve()
          }
      },timeout)
    })
  }



function xc10s6(timeout = 0) {
    return new Promise((resolve) => {
  //user_id=xccksp1url.match(/user_id=(\d+)/)[1]
  cookie = xccksp1hd.match(/"Cookie":"([\w=&;]+)"/)[1]
  
  auth = xccksp1body.match(/"auth":"(\w+)"/)[1]
  appId1 = xccksp1body.match(/"appId","value":"(\w+)"/)[1]
  let url = {url : `https://m.ctrip.com/restapi/soa2/22598/todoTask`,
    //let url = {url : xccksp1url,
             headers : {
            "Content-Type": "application/json",
            "Cookie": "${cookie}"
    },
        body : `{"channelCode":"69G8EV4BX3","taskId":59,"done":1,"status":1,"head":{"ctok":"","cver":"1.1.91","lang":"01","sid":"","syscode":"30","auth":"${auth}","sauth":"","extension":[{"name":"appId","value":"${appId1}"},{"name":"scene","value":"1089"}]}}`
  }
        $.post(url, async (err, resp, data) => {
          try {
             
      const result = JSON.parse(data)
          if(result.code == 200){
          console.log('\n骰子看视频任务成功：'+result.message)
  }else{
          console.log('\n骰子看视频任务失败：'+result.message)
  }
          } catch (e) {
          } finally {
            resolve()
          }
      },timeout)
    })
  }


  function xc10s7(timeout = 0) {
    return new Promise((resolve) => {
  //user_id=xccksp1url.match(/user_id=(\d+)/)[1]
  cookie = xccksp1hd.match(/"Cookie":"([\w=&;]+)"/)[1]
  
  auth = xccksp1body.match(/"auth":"(\w+)"/)[1]
  appId1 = xccksp1body.match(/"appId","value":"(\w+)"/)[1]
  let url = {url : `https://m.ctrip.com/restapi/soa2/22598/todoTask`,
    //let url = {url : xccksp1url,
             headers : {
            "Content-Type": "application/json",
            "Cookie": "${cookie}"
    },
          body : `{"channelCode":"6733N074D4","taskId":79,"done":1,"status":1,"head":{"ctok":"","cver":"1.1.91","lang":"01","sid":"","syscode":"30","auth":"${auth}","sauth":"","extension":[{"name":"appId","value":"${appId1}"},{"name":"scene","value":"1089"}]}}`
  }
        $.post(url, async (err, resp, data) => {
          try {
             
      const result = JSON.parse(data)
          if(result.code == 200){
          console.log('\n周乐大浪淘沙任务成功：'+result.message)
  }else{
          console.log('\n周乐大浪淘沙任务失败：'+result.message)
  }
          } catch (e) {
          } finally {
            resolve()
          }
      },timeout)
    })
  }




  function xc10s8(timeout = 0) {
    return new Promise((resolve) => {
  //user_id=xccksp1url.match(/user_id=(\d+)/)[1]
  cookie = xccksp1hd.match(/"Cookie":"([\w=&;]+)"/)[1]
  
  auth = xccksp1body.match(/"auth":"(\w+)"/)[1]
  appId1 = xccksp1body.match(/"appId","value":"(\w+)"/)[1]
  let url = {url : `https://m.ctrip.com/restapi/soa2/22598/todoTask`,
    //let url = {url : xccksp1url,
             headers : {
            "Content-Type": "application/json",
            "Cookie": "${cookie}"
    },
          body : `{"channelCode":"FK023GVTDY","taskId":60,"done":1,"status":1,"head":{"ctok":"","cver":"1.1.91","lang":"01","sid":"","syscode":"30","auth":"${auth}","sauth":"","extension":[{"name":"appId","value":"${appId1}"},{"name":"scene","value":"1089"}]}}`
  }
        $.post(url, async (err, resp, data) => {
          try {
             
      const result = JSON.parse(data)
          if(result.code == 200){
          console.log('\n看视频得积分任务成功：'+result.message)
  }else{
          console.log('\n看视频得积分任务失败：'+result.message)
  }
          } catch (e) {
          } finally {
            resolve()
          }
      },timeout)
    })
  }









//领取抽奖机会
function xclq1(timeout = 0) {
  return new Promise((resolve) => {
//user_id=xccksp1url.match(/user_id=(\d+)/)[1]
cookie = xccksp1hd.match(/"Cookie":"([\w=&;]+)"/)[1]
 
 auth = xccksp1body.match(/"auth":"(\w+)"/)[1]
 appId1 = xccksp1body.match(/"appId","value":"(\w+)"/)[1]
 let url = {url : `https://m.ctrip.com/restapi/soa2/22598/awardTask`,
   //let url = {url : xclq1url,
         headers : 
         {"Content-Type": "application/json",
         "Cookie": "${cookie}"},
        body : `{"channelCode":"6733N074D4","taskId":36,"head":{"ctok":"","cver":"1.1.91","lang":"01","sid":"","syscode":"30","auth":"${auth}","sauth":"","extension":[{"name":"appId","value":"${appId1}"},{"name":"scene","value":"1089"}]}} `}
      $.post(url, async (err, resp, data) => {
        try {
           
    const result = JSON.parse(data)
        if(result.code == 200){
        console.log('\n5次机会领取成功：'+result.message)
}else{
        console.log('\n5次机会领取失败：'+result.message)
}
        } catch (e) {
        } finally {
          resolve()
        }
    },timeout)
  })
}



function xclq2(timeout = 0) {
   return new Promise((resolve) => {
//user_id=xccksp1url.match(/user_id=(\d+)/)[1]
cookie = xccksp1hd.match(/"Cookie":"([\w=&;]+)"/)[1]
 
 auth = xccksp1body.match(/"auth":"(\w+)"/)[1]
 appId1 = xccksp1body.match(/"appId","value":"(\w+)"/)[1]
 let url = {url : `https://m.ctrip.com/restapi/soa2/22598/awardTask`,
   //let url = {url : xclq1url,
         headers : 
         {"Content-Type": "application/json",
         "Cookie": "${cookie}"},
        body : `{"channelCode":"6733N074D4","taskId":44,"head":{"ctok":"","cver":"1.1.91","lang":"01","sid":"","syscode":"30","auth":"${auth}","sauth":"","extension":[{"name":"appId","value":"${appId1}"},{"name":"scene","value":"1089"}]}} `}
      $.post(url, async (err, resp, data) => {
        try {
           
    const result = JSON.parse(data)
        if(result.code == 200){
        console.log('\n拼团浏览抽奖领取成功：'+result.message)
}else{
        console.log('\n拼团浏览抽奖领取失败：'+result.message)
}
        } catch (e) {
        } finally {
          resolve()
        }
    },timeout)
  })
}



function xclq3(timeout = 0) {
   return new Promise((resolve) => {
//user_id=xccksp1url.match(/user_id=(\d+)/)[1]
cookie = xccksp1hd.match(/"Cookie":"([\w=&;]+)"/)[1]
 
 auth = xccksp1body.match(/"auth":"(\w+)"/)[1]
 appId1 = xccksp1body.match(/"appId","value":"(\w+)"/)[1]
 let url = {url : `https://m.ctrip.com/restapi/soa2/22598/awardTask`,
   //let url = {url : xclq1url,
         headers : 
         {"Content-Type": "application/json",
         "Cookie": "${cookie}"},
        body : `{"channelCode":"6733N074D4","taskId":42,"head":{"ctok":"","cver":"1.1.91","lang":"01","sid":"","syscode":"30","auth":"${auth}","sauth":"","extension":[{"name":"appId","value":"${appId1}"},{"name":"scene","value":"1089"}]}} `}
      $.post(url, async (err, resp, data) => {
        try {
           
    const result = JSON.parse(data)
        if(result.code == 200){
        console.log('\n积分浏览抽奖领取成功：'+result.message)
}else{
        console.log('\n积分浏览抽奖领取失败：'+result.message)
}
        } catch (e) {
        } finally {
          resolve()
        }
    },timeout)
  })
}


function xclq4(timeout = 0) {
   return new Promise((resolve) => {
//user_id=xccksp1url.match(/user_id=(\d+)/)[1]
cookie = xccksp1hd.match(/"Cookie":"([\w=&;]+)"/)[1]
 
 auth = xccksp1body.match(/"auth":"(\w+)"/)[1]
 appId1 = xccksp1body.match(/"appId","value":"(\w+)"/)[1]
 let url = {url : `https://m.ctrip.com/restapi/soa2/22598/awardTask`,
   //let url = {url : xclq1url,
         headers : 
         {"Content-Type": "application/json",
         "Cookie": "${cookie}"},
        body : `{"channelCode":"6733N074D4","taskId":40,"head":{"ctok":"","cver":"1.1.91","lang":"01","sid":"","syscode":"30","auth":"${auth}","sauth":"","extension":[{"name":"appId","value":"${appId1}"},{"name":"scene","value":"1089"}]}} `}
      $.post(url, async (err, resp, data) => {
        try {
           
    const result = JSON.parse(data)
        if(result.code == 200){
        console.log('\n周乐历险记奖励领取成功：'+result.message)
}else{
        console.log('\n周乐历险记奖励领取失败：'+result.message)
}
        } catch (e) {
        } finally {
          resolve()
        }
    },timeout)
  })
}




function xclq5(timeout = 0) {
    return new Promise((resolve) => {
//user_id=xccksp1url.match(/user_id=(\d+)/)[1]
cookie = xccksp1hd.match(/"Cookie":"([\w=&;]+)"/)[1]
 
 auth = xccksp1body.match(/"auth":"(\w+)"/)[1]
 appId1 = xccksp1body.match(/"appId","value":"(\w+)"/)[1]
 let url = {url : `https://m.ctrip.com/restapi/soa2/22598/awardTask`,
   //let url = {url : xclq1url,
         headers : 
         {"Content-Type": "application/json",
         "Cookie": "${cookie}"},
        body : `{"channelCode":"69G8EV4BX3","taskId":40,"head":{"ctok":"","cver":"1.1.91","lang":"01","sid":"","syscode":"30","auth":"${auth}","sauth":"","extension":[{"name":"appId","value":"${appId1}"},{"name":"scene","value":"1089"}]}} `}
      $.post(url, async (err, resp, data) => {
        try {
             
      const result = JSON.parse(data)
          if(result.code == 200){
          console.log('\n骰子周周乐奖励领取成功：'+result.message)
  }else{
          console.log('\n骰子周周乐奖励领取失败：'+result.message)
  }
          } catch (e) {
          } finally {
            resolve()
          }
      },timeout)
    })
  }



  function xclq6(timeout = 0) {
     return new Promise((resolve) => {
//user_id=xccksp1url.match(/user_id=(\d+)/)[1]
cookie = xccksp1hd.match(/"Cookie":"([\w=&;]+)"/)[1]
 
 auth = xccksp1body.match(/"auth":"(\w+)"/)[1]
 appId1 = xccksp1body.match(/"appId","value":"(\w+)"/)[1]
 let url = {url : `https://m.ctrip.com/restapi/soa2/22598/awardTask`,
   //let url = {url : xclq1url,
         headers : 
         {"Content-Type": "application/json",
         "Cookie": "${cookie}"},
        body : `{"channelCode":"69G8EV4BX3","taskId":59,"head":{"ctok":"","cver":"1.1.91","lang":"01","sid":"","syscode":"30","auth":"${auth}","sauth":"","extension":[{"name":"appId","value":"${appId1}"},{"name":"scene","value":"1089"}]}} `}
      $.post(url, async (err, resp, data) => {
        try {
             
      const result = JSON.parse(data)
          if(result.code == 200){
          console.log('\n骰子看视频奖励领取成功：'+result.message)
  }else{
          console.log('\n骰子看视频奖励领取失败：'+result.message)
  }
          } catch (e) {
          } finally {
            resolve()
          }
      },timeout)
    })
  }




  function xclq7(timeout = 0) {
    return new Promise((resolve) => {
 //user_id=xccksp1url.match(/user_id=(\d+)/)[1]
 cookie = xccksp1hd.match(/"Cookie":"([\w=&;]+)"/)[1]
 
 auth = xccksp1body.match(/"auth":"(\w+)"/)[1]
 appId1 = xccksp1body.match(/"appId","value":"(\w+)"/)[1]
 let url = {url : `https://m.ctrip.com/restapi/soa2/22598/awardTask`,
   //let url = {url : xclq1url,
         headers : 
         {"Content-Type": "application/json",
         "Cookie": "${cookie}"},
         body : `{"channelCode":"6733N074D4","taskId":79,"head":{"ctok":"","cver":"1.1.91","lang":"01","sid":"","syscode":"30","auth":"${auth}","sauth":"","extension":[{"name":"appId","value":"${appId1}"},{"name":"scene","value":"1089"}]}} `}
       $.post(url, async (err, resp, data) => {
         try {
            
     const result = JSON.parse(data)
         if(result.code == 200){
         console.log('\n周乐大浪淘沙奖励领取成功：'+result.message)
 }else{
         console.log('\n周乐大浪淘沙奖励领取失败：'+result.message)
 }
         } catch (e) {
         } finally {
           resolve()
         }
     },timeout)
   })
 }



 function xclq8(timeout = 0) {
    return new Promise((resolve) => {
 //user_id=xccksp1url.match(/user_id=(\d+)/)[1]
 cookie = xccksp1hd.match(/"Cookie":"([\w=&;]+)"/)[1]
 
 auth = xccksp1body.match(/"auth":"(\w+)"/)[1]
 appId1 = xccksp1body.match(/"appId","value":"(\w+)"/)[1]
 let url = {url : `https://m.ctrip.com/restapi/soa2/22598/awardTask`,
   //let url = {url : xclq1url,
         headers : 
         {"Content-Type": "application/json",
         "Cookie": "${cookie}"},
         body : `{"channelCode":"FK023GVTDY","taskId":60,"head":{"ctok":"","cver":"1.1.91","lang":"01","sid":"","syscode":"30","auth":"${auth}","sauth":"","extension":[{"name":"appId","value":"${appId1}"},{"name":"scene","value":"1089"}]}} `}
       $.post(url, async (err, resp, data) => {
         try {
            
     const result = JSON.parse(data)
         if(result.code == 200){
         console.log('\n视频积分抽奖领取成功：'+result.message)
 }else{
         console.log('\n视频积分抽奖领取失败：'+result.message)
 }
         } catch (e) {
         } finally {
           resolve()
         }
     },timeout)
   })
 }


 function xclq9(timeout = 0) {
    return new Promise((resolve) => {
 //user_id=xccksp1url.match(/user_id=(\d+)/)[1]
 cookie = xccksp1hd.match(/"Cookie":"([\w=&;]+)"/)[1]
 
 auth = xccksp1body.match(/"auth":"(\w+)"/)[1]
 appId1 = xccksp1body.match(/"appId","value":"(\w+)"/)[1]
 let url = {url : `https://m.ctrip.com/restapi/soa2/22598/awardTask`,
   //let url = {url : xclq1url,
         headers : 
         {"Content-Type": "application/json",
         "Cookie": "${cookie}"},
         body : `{"channelCode":"69G8EV4BX3","taskId":79,"head":{"ctok":"","cver":"1.1.91","lang":"01","sid":"","syscode":"30","auth":"${auth}","sauth":"","extension":[{"name":"appId","value":"${appId1}"},{"name":"scene","value":"1089"}]}} `}
       $.post(url, async (err, resp, data) => {
         try {
            
     const result = JSON.parse(data)
         if(result.code == 200){
         console.log('\n骰子大浪淘沙领取成功：'+result.message)
 }else{
         console.log('\n骰子大浪淘沙领取失败：'+result.message)
 }
         } catch (e) {
         } finally {
           resolve()
         }
     },timeout)
   })
 }





  function xcsj(timeout = 0) {
    return new Promise((resolve) => {
  //user_id=xcfp1url.match(/user_id=(\d+)/)[1]
cookie = xccksp1hd.match(/"Cookie":"([\w=&;]+)"/)[1]

auth = xccksp1body.match(/"auth":"(\w+)"/)[1]
appId1 = xccksp1body.match(/"appId","value":"(\w+)"/)[1]
  let url = {url : `https://m.ctrip.com/restapi/soa2/16575/getZzlUserCard`,
    //let url = {url : xcsj1url,
          headers : 
          {"Content-Type": "application/json",
          "Cookie": "${cookie}"},
          body : `{"activityId":"MKT_LOTTERY_1616744889859","head":{"ctok":"","cver":"1.1.91","lang":"01","sid":"","syscode":"30","auth":"${auth}","sauth":"","extension":[{"name":"appId","value":"${appId1}"},{"name":"scene","value":"1089"}]}}`
  }
        $.post(url, async (err, resp, data) => {
          try {
             
      const result = JSON.parse(data)
          if(result.errCode == 0){
          console.log('\n获取次数成功：'+result.chanceNum)
    let Y = result.chanceNum
    for (let c = 0; c < Y; c++) {
      $.index = c + 1
     console.log(`\n第${c+1}次发牌！`)
  
             await xcfpqd()
             await $.wait(1000);}
              
  }else{
          console.log('\n获取次数失败：'+result.chanceNum)
  
  }
 
          } catch (e) {
          } finally {
            resolve()
          }
      },timeout)
    })
  }




function xcfpqd(timeout = 0) {
  return new Promise((resolve) => {
//user_id=xcfp1url.match(/user_id=(\d+)/)[1]
cookie = xccksp1hd.match(/"Cookie":"([\w=&;]+)"/)[1]

auth = xccksp1body.match(/"auth":"(\w+)"/)[1]
appId1 = xccksp1body.match(/"appId","value":"(\w+)"/)[1]
let url = {url : `https://m.ctrip.com/restapi/soa2/16575/sendZzlCardToUser`,
  //let url = {url : xcfp1url,
        headers :{"Content-Type": "application/json",
                 "Cookie": "${cookie}"},
        body : `{"activityId":"MKT_LOTTERY_1616744889859","head":{"ctok":"","cver":"1.1.91","lang":"01","sid":"","syscode":"30","auth":"${auth}","sauth":"","extension":[{"name":"appId","value":"${appId1}"},{"name":"scene","value":"1089"}]}}`
}
      $.post(url, async (err, resp, data) => {
        try {
           
    const result = JSON.parse(data)
        if(result.errCode == 0){
        console.log('\n发牌成功：'+result.id)
}else{
        console.log('\n任务失败：'+result.id)
}
        } catch (e) {
        } finally {
          resolve()
        }
    },timeout)
  })
}

function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r)));let h=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];h.push(e),s&&h.push(s),i&&h.push(i),console.log(h.join("\n")),this.logs=this.logs.concat(h)}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
