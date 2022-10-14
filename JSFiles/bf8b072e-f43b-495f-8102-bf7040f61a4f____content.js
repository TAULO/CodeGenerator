// GLOBALS PARAM
if(!count){
    var count=0;
}
if(!holes){
    var holes=[];
}
if(!intervals){
    var intervals=[];
}

$('html').unbind();
$('html').css({
    "overflow":"hidden"
});

var weapon;
var weapon_fire;
var sound;
var fireTime;
var shootRate;
var x;
var y;
var imgCount=1;
var image;
var overlay
var shootInterval;
var xShift;
var yShift;
var holeX;
var holeY;
var holeWidth;
var holeHeight;
var cursorURL;
var actualStamp;
var actualSpray;
var soundOff;
var countShoot = 0; 

// INIT

clear();
chooseWeapon();
initWeapon();
closeButton();
resetButton();
soundButton();
facebookButton();


function initWeapon(){
    $('html').css({
        'cursor':'none' 
    });
    overlay = document.createElement('div');
    overlay.setAttribute('id', 'overlay');
    $('body').append(overlay);
    $('#overlay').css({
        'position':'fixed',
        'width':'100%',
        'height':'100%',
        'top':'0px',
        'z-index':'99997'
    })
    image=document.createElement('img');
    image.setAttribute("id","weapon");
    image.setAttribute('src', weapon);
    $('html').append(image);
    $('#weapon').css({
        'position': 'absolute'
    });
    $('#weapon').css({
        'z-index': '99999'
    });
    var crosshair=document.createElement('div');
    crosshair.setAttribute('id', 'cursor');
    $('html').append(crosshair);
    $('#cursor').css({
        'position': 'absolute',
        'z-index':'9999999',
        'width':'50px',
        'height':'50px',
        'background':'url('+cursorURL+') no-repeat 0 0'
    });
}

// WEAPONS

function chooseWeapon(){
    //base
    if(param=='hammer'){
        weapon=chrome.extension.getURL('img/hammer.png');
        weapon_fire=chrome.extension.getURL('img/hammer_fire.png');
        sound=chrome.extension.getURL('audio/glass.mp3');
        fireTime=100;
        shootRate=300;
        xShift=2;
        yShift=2;
        holeX=-60;
        holeY=-60;
        holeWidth=241;
        holeHeight=207;
        cursorURL=chrome.extension.getURL('img/hammer_cursor.png');
        return;
    }else if(param=='gun'){
        weapon=chrome.extension.getURL('img/smg.png');    
        weapon_fire=chrome.extension.getURL('img/smg_fire.png');
        sound=chrome.extension.getURL('audio/smg.mp3');
        fireTime=50;
        shootRate=150;
        xShift=100;
        yShift=100;
        holeX=0;
        holeY=-2;
        holeWidth=35;
        holeHeight=38;
        cursorURL=chrome.extension.getURL('img/gun_cursor.png');
        return;
    //free
    }else if(param=='shotgun'){
        weapon=chrome.extension.getURL('img/shotgun.png');    
        weapon_fire=chrome.extension.getURL('img/shotgun_fire.png');
        sound=chrome.extension.getURL('audio/shotgun.mp3');
        fireTime=200;
        shootRate=500;
        xShift=2;
        yShift=2;
        holeX=-35;
        holeY=-35;
        holeWidth=241;
        holeHeight=207;
        cursorURL=chrome.extension.getURL('img/gun_cursor.png');
        return;
    }else if(param=='stamp'){
        weapon=chrome.extension.getURL('img/stamp.png');    
        weapon_fire=chrome.extension.getURL('img/stamp_fire.png');
        sound=chrome.extension.getURL('audio/stamp.mp3');
        fireTime=200;
        shootRate=500;
        xShift=-100;
        yShift=-200;
        holeX=-150;
        holeY=-20;
        holeWidth=200;
        holeHeight=160;
        cursorURL=chrome.extension.getURL('img/hammer_cursor.png');
        actualStamp=0;
        $('html').mousewheel(function(e,delta){            
            if(delta>0) {
                if(actualStamp>5){
                    actualStamp=0;
                }else{
                    actualStamp++;
                }
            }
            else{
                if(actualStamp<1){
                    actualStamp=6
                }else{
                    actualStamp--;
                }
            }
            $('#stamp').attr('src',chrome.extension.getURL('img/stamp_hole'+actualStamp+'.png'));
            
        });
        $('html').keyup(function(e){            
            if(e.keyCode==38) {
                if(actualStamp>5){
                    actualStamp=0;
                }else{
                    actualStamp++;
                }
            }
            if(e.keyCode==40){
                if(actualStamp<1){
                    actualStamp=6
                }else{
                    actualStamp--;
                }
            }
            $('#stamp').attr('src',chrome.extension.getURL('img/stamp_hole'+actualStamp+'.png'));
            
        });
        //show stamp
        var stamp=document.createElement('img');
        stamp.setAttribute('id', 'stamp');
        stamp.style.position='absolute';
        stamp.style.top=(y+holeY)+'px';
        stamp.style.left=(x+holeX)+'px';
        stamp.style.zIndex='99998';
        $('html').append(stamp);
        $('#stamp').css({            
            opacity:"0.25"
        }).attr('src',chrome.extension.getURL('img/stamp_hole'+actualStamp+'.png'));
        ////info how to use stamp
        $('body').append($('<div id=infoHowTo></div>').css({
            'text-align':'center',
            display:'none',
            position:'fixed',
            top:'100px',
            left:'200px',
            width:'230px',
            padding:'20px',
            'background-color':'#3AC2F1',
            color:'white',
            'text-shadow':'black 1px 1px 7px',
            'font-weight':'bold',
            border:'sblack 2px solid',
            'z-index':'9999999',
            'font-size':'14px',
            'font-family':'arial'
        }).html(translate['text1']));
        setTimeout(function(){
            $('#infoHowTo').show('fast');
            setTimeout(function(){
                $('#infoHowTo').hide('slow');
            },5000)
        },500);
        return;
    }else if(param=='flame'){
        weapon=chrome.extension.getURL('img/flame.png');    
        weapon_fire=chrome.extension.getURL('img/flame_fire.png');
        sound=chrome.extension.getURL('audio/flame.mp3');
        fireTime=100;
        shootRate=150;
        xShift=-150;
        yShift=-150;
        holeX=-30;
        holeY=-70;
        holeWidth=50;
        holeHeight=80;
        cursorURL=chrome.extension.getURL('img/flame_cursor.png');
        return;
    }else if(param=='rpg'){
        weapon=chrome.extension.getURL('img/rpg.png');    
        weapon_fire=chrome.extension.getURL('img/rpg_a.png');
        sound=chrome.extension.getURL('audio/flame.mp3');
        fireTime=2000;
        shootRate=2000;
        xShift=150;
        yShift=150;
        holeX=150;
        holeY=150;
        holeWidth=300;
        holeHeight=300;
        cursorURL=chrome.extension.getURL('img/flame_cursor.png');
        return;
    }else if(param=='gran'){
        weapon=chrome.extension.getURL('img/gran.png');    
        weapon_fire=chrome.extension.getURL('img/gran_a.png');
        sound=chrome.extension.getURL('audio/stamp.mp3');
        fireTime=2000;
        shootRate=2000;
        xShift=180;
        yShift=70;
        holeX=180;
        holeY=70;
        holeWidth=200;
        holeHeight=200;
        cursorURL=chrome.extension.getURL('img/flame_cursor.png');
        return;
    }else if(param=='atom'){
        weapon=chrome.extension.getURL('img/atom.png');    
        weapon_fire=chrome.extension.getURL('img/atom_a.png');
        sound=chrome.extension.getURL('audio/flame.mp3');
        fireTime=2000;
        shootRate=2000;
        xShift=300;
        yShift=300;
        holeX=250;
        holeY=250;
        holeWidth=500;
        holeHeight=500;
        cursorURL=chrome.extension.getURL('img/atom_cursor.png');
        return;
    //street
    }else if(param=='knife'){
        weapon=chrome.extension.getURL('img/knife.png');    
        weapon_fire=chrome.extension.getURL('img/gran_a.png');
        sound=chrome.extension.getURL('audio/knife.mp3');
        fireTime=2000;
        shootRate=2000;
        xShift=400;
        yShift=200;
        holeX=400;
        holeY=200;
        holeWidth=200;
        holeHeight=200;
        cursorURL=chrome.extension.getURL('img/flame_cursor.png');
        return;
    }else if(param=='ninja'){
        weapon=chrome.extension.getURL('img/ninja.png');    
        weapon_fire=chrome.extension.getURL('img/gran_a.png');
        sound=chrome.extension.getURL('audio/knife.mp3');
        fireTime=2000;
        shootRate=2000;
        xShift=380;
        yShift=280;
        holeX=380;
        holeY=280;
        holeWidth=200;
        holeHeight=200;
        cursorURL=chrome.extension.getURL('img/flame_cursor.png');
        return;
    }else if(param=='spray'){
        weapon=chrome.extension.getURL('img/spray.png');    
        weapon_fire=chrome.extension.getURL('img/spray.png');
        sound=chrome.extension.getURL('audio/spray.mp3');
        fireTime=20;
        shootRate=20;
        xShift=0;
        yShift=0;
        holeX=-18;
        holeY=-13;
        holeWidth=50;
        holeHeight=50;
        cursorURL=chrome.extension.getURL('img/hammer_cursor.png');
        actualSpray=0;
        $('html').mousewheel(function(e,delta){            
            if(delta>0) {
                if(actualSpray>6){
                    actualSpray=0;
                }else{
                    actualSpray++;
                }
            }
            else{
                if(actualSpray<1){
                    actualSpray=7
                }else{
                    actualSpray--;
                }
            }
            $('#spray').attr('src',chrome.extension.getURL('img/spray_hole'+actualSpray+'.png'));
            
        });
        $('html').keyup(function(e){            
            if(e.keyCode==38) {
                if(actualSpray>6){
                    actualSpray=0;
                }else{
                    actualSpray++;
                }
            }
            if(e.keyCode==40){
                if(actualSpray<1){
                    actualSpray=7
                }else{
                    actualSpray--;
                }
            }
            $('#spray').attr('src',chrome.extension.getURL('img/spray_hole'+actualSpray+'.png'));
            
        });
        //show spray
        var spray=document.createElement('img');
        spray.setAttribute('id', 'spray');
        spray.style.position='absolute';
        spray.style.top=(y+holeY)+'px';
        spray.style.left=(x+holeX)+'px';
        spray.style.zIndex='99999';
        $('html').append(spray);
        $('#spray').css({            
            opacity:"0.8"
        }).attr('src',chrome.extension.getURL('img/spray_hole'+actualSpray+'.png'));
        ////info how to use spray
        $('body').append($('<div id=infoHowTo></div>').css({
            'text-align':'center',
            display:'none',
            position:'fixed',
            top:'100px',
            left:'200px',
            width:'230px',
            padding:'20px',
            'background-color':'#3AC2F1',
            color:'white',
            'text-shadow':'black 1px 1px 7px',
            'font-weight':'bold',
            border:'sblack 2px solid',
            'z-index':'9999999',
            'font-size':'14px',
            'font-family':'arial'
        }).html(translate['text2']));
        setTimeout(function(){
            $('#infoHowTo').show('fast');
            setTimeout(function(){
                $('#infoHowTo').hide('slow');
            },5000)
        },500);
        return;
    }else if(param=='saw'){
        weapon=chrome.extension.getURL('img/saw.png');    
        weapon_fire=chrome.extension.getURL('img/saw_fire.png');
        sound=chrome.extension.getURL('audio/saw.mp3');
        fireTime=20;
        shootRate=40;
        xShift=-16;
        yShift=-40;
        holeX=-16;
        holeY=-16;
        holeWidth=10;
        holeHeight=20;
        cursorURL=chrome.extension.getURL('img/empty.png');
        return;        
    //scifi
    }else if(param=='laser'){
        weapon=chrome.extension.getURL('img/laser.png');    
        weapon_fire=chrome.extension.getURL('img/laser_fire.png');
        sound=chrome.extension.getURL('audio/flame.mp3');
        fireTime=20;
        shootRate=50;
        xShift=-36;
        yShift=-124;
        holeX=-16;
        holeY=-16;
        holeWidth=20;
        holeHeight=20;
        cursorURL=chrome.extension.getURL('img/flame_cursor.png');
        return;
    }else if(param=='flash'){
        weapon=chrome.extension.getURL('img/flash.png');
        weapon_fire=chrome.extension.getURL('img/flash_fire.png');
        sound=chrome.extension.getURL('audio/flame.mp3');
        fireTime=50;
        shootRate=100;
        xShift=-110;
        yShift=-80;
        holeX=-80;
        holeY=-80;
        holeWidth=150;
        holeHeight=150;
        cursorURL=chrome.extension.getURL('img/flame_cursor.png');
        return;
    }else if(param=='plasma'){
        weapon=chrome.extension.getURL('img/plasma.png');
        weapon_fire=chrome.extension.getURL('img/plasma_fire.png');
        sound=chrome.extension.getURL('audio/smg.mp3');
        fireTime=40;
        shootRate=130;
        xShift=50;
        yShift=120;
        holeX=-8;
        holeY=-8;
        holeWidth=50;
        holeHeight=50;
        cursorURL=chrome.extension.getURL('img/gun_cursor.png');
        return;
    //history
    }else if(param=='sword'){
        weapon=chrome.extension.getURL('img/sword.png');
        weapon_fire=chrome.extension.getURL('img/sword_fire.png');
        sound=chrome.extension.getURL('audio/glass.mp3');
        fireTime=100;
        shootRate=300;
        xShift=2;
        yShift=2;
        holeX=0;
        holeY=0;
        holeWidth=70;
        holeHeight=240;
        cursorURL=chrome.extension.getURL('img/hammer_cursor.png');
        return;
    }else if(param=='ax'){
        weapon=chrome.extension.getURL('img/ax.png');
        weapon_fire=chrome.extension.getURL('img/ax_fire.png');
        sound=chrome.extension.getURL('audio/glass.mp3');
        fireTime=100;
        shootRate=300;
        xShift=2;
        yShift=2;
        holeX=-30;
        holeY=0;
        holeWidth=70;
        holeHeight=220;
        cursorURL=chrome.extension.getURL('img/hammer_cursor.png');
        return;
    }else if(param=='bow'){
        weapon=chrome.extension.getURL('img/bow.png');    
        weapon_fire=chrome.extension.getURL('img/bow_a.png');
        sound=chrome.extension.getURL('audio/knife.mp3');
        fireTime=2000;
        shootRate=2000;
        xShift=150;
        yShift=150;
        holeX=150;
        holeY=150;
        holeWidth=300;
        holeHeight=300;
        cursorURL=chrome.extension.getURL('img/flame_cursor.png');
        return;
    }else if(param=='spear'){
        weapon=chrome.extension.getURL('img/spear.png');    
        weapon_fire=chrome.extension.getURL('img/spear_a.png');
        sound=chrome.extension.getURL('audio/knife.mp3');
        fireTime=2000;
        shootRate=2000;
        xShift=300;
        yShift=300;
        holeX=294;
        holeY=294;
        holeWidth=300;
        holeHeight=311;
        cursorURL=chrome.extension.getURL('img/flame_cursor.png');
        return;
    }else if(param=='cannon'){
        weapon=chrome.extension.getURL('img/cannon.png');    
        weapon_fire=chrome.extension.getURL('img/cannon_a.png');
        sound=chrome.extension.getURL('audio/smg.mp3');
        fireTime=2000;
        shootRate=2000;
        xShift=170;
        yShift=150;
        holeX=260;
        holeY=240;
        holeWidth=300;
        holeHeight=300;
        cursorURL=chrome.extension.getURL('img/flame_cursor.png');
        return;
    }
}

// WEAPON ACTIONS

function shoot(){
    //console.log('shoot');
    if(!soundOff){
        var audio = new Audio(sound);
        audio.play();
    }    
    $('#weapon').attr('src',weapon_fire);
    var hole=document.createElement('div');
    hole.setAttribute('id', 'hole'+count);
    
    var randX = 0;
    var randY = 0;
    if(param == 'flame'){
        var randX = Math.floor((Math.random()*21)+1) - 11;
        var randY = Math.floor((Math.random()*21)+1) - 11;
    }
    hole.style.position='absolute';
    hole.style.top=(y+holeY+randY)+'px';
    hole.style.left=(x+holeX+randX)+'px';
    hole.style.zIndex='99998';
    $('html').append(hole);
    
    var imageSrc;
    if(param == 'stamp'){
        imageSrc=chrome.extension.getURL('img/stamp_hole'+actualStamp+'.png');
    }else if(param == 'spray'){
        imageSrc=chrome.extension.getURL('img/spray_hole'+actualSpray+'.png');
    }else if(param == 'flame'){
        imageSrc=chrome.extension.getURL('img/'+param+'_hole'+ (imgCount++) +'.gif');
        setTimeout(function(){
            moveFlame(hole);
        },1);
    }else if(param == 'rpg'){
        imageSrc=chrome.extension.getURL('img/rpg_fire.png');
        setTimeout(function(){
            moveRpgFire(hole);
        },1);
    }else if(param == 'gran'){
        imageSrc=chrome.extension.getURL('img/gran.png');
        setTimeout(function(){
            moveGranFire(hole);
        },1);
    }else if(param == 'atom'){
        imageSrc=chrome.extension.getURL('img/atom_fire.png');
        setTimeout(function(){
            moveAtomFire(hole);
        },1);
    }else if(param == 'knife'){
        imageSrc=chrome.extension.getURL('img/knife.png');
        setTimeout(function(){
            moveKnifeFire(hole);
        },1);
    }else if(param == 'ninja'){
        imageSrc=chrome.extension.getURL('img/ninja.png');
        setTimeout(function(){
            moveNinjaFire(hole);
        },1);
    }else if(param == 'bow'){
        imageSrc=chrome.extension.getURL('img/bow_fire.png');
        setTimeout(function(){
            moveBowFire(hole);
        },1);
    }else if(param == 'spear'){
        imageSrc=chrome.extension.getURL('img/spear_fire.png');
        setTimeout(function(){
            moveSpearFire(hole);
        },1);
    }else if(param == 'cannon'){
        imageSrc=chrome.extension.getURL('img/cannon_fire.png');
        setTimeout(function(){
            moveCannonFire(hole);
        },1);
    }else{
        imageSrc=chrome.extension.getURL('img/'+param+'_hole'+ (imgCount++) +'.png');
    }
    $('#hole'+count++).css({
        'width':holeWidth,
        'height':holeHeight,
        'background-image':'url('+imageSrc+')',
        'background-repeat':'no-repeat'
    });
    setTimeout(function(){
        $('#weapon').attr('src',weapon);
    },fireTime);
    if(imgCount>4) imgCount=1;
    //small count
    if((param=='plasma' || param=='flash' || param=='flame' || param=='saw') && imgCount>2){
        imgCount = 1;
    }
    if((param=='sword' || param=='ax') && imgCount>3){
        imgCount = 1;
    }
    //rotation
    if(param=='laser' || param=='flash' || param=='hammer' || param=='gun' || param=='spray' || param=='plasma'){
        var rotHole = Math.floor(Math.random()*360);
        $(hole).css('-webkit-transform','rotate('+rotHole+'deg)');
    }
    if(param=='sword' || param=='ax'){
        var rotHole = Math.floor(Math.random()*25) - 10;
        $(hole).css('-webkit-transform','rotate('+rotHole+'deg)');
    }
    holes.push(hole);
    countShoot++;
}

// FLAME

function moveFlame(hole){
    var hole = $(hole);
    var randX = Math.floor((Math.random()*5)+1) - 3;
    var randY = Math.floor((Math.random()*5)+1) - 3;
    var randI = Math.floor((Math.random()*100)+1);
    var i = 1;
    if(!(randX==0 && randY==0) && randI>10){
        var interval = setInterval(function(){
            i++;
            if(i > randI){
                hole.remove();
                clearInterval(interval);
            }
            var left = parseInt(hole.css('left').replace('px',''));
            left += randX;
            hole.css('left',left.toString()+'px');
            var top = parseInt(hole.css('top').replace('px',''));
            top += randY;
            hole.css('top',top.toString()+'px');
            var randStopa = Math.floor((Math.random()*40)+1);
            if(randStopa < 6){
                var stopa_img = chrome.extension.getURL('img/flame_special'+randStopa+'.png')
                var stopa = $('<div style="width:50px;height:50px;position:absolute;z-index:99998;left:'+(left-10)+'px;top:'+(top+50)+'px;background:url('+stopa_img+') no-repeat 0 0;"></div>');
                $('html').append(stopa);
                holes.push(stopa);
            }
        },100);
    }
}

// RPG

function moveRpgFire(hole){
    var hole = $(hole);
    var i = 0;
    var interval = setInterval(function(){
        i++;
        var left = parseInt(hole.css('left').replace('px',''));
        var top = parseInt(hole.css('top').replace('px',''));
        if(i > 31){
            hole.remove();
            clearInterval(interval);
            rpgBoom(left,top);
        }
        left -= 5;
        hole.css('left',left.toString()+'px');
        top -= 5;
        hole.css('top',top.toString()+'px');
    },20);
}

function rpgBoom(left,top){
    if(!soundOff){
        var audio = new Audio(chrome.extension.getURL('audio/rpg_boom.mp3'));
        audio.play();
    }
    left -= 150;
    top -= 150;
    var exp = $('<div style="width:300px;height:300px;position:absolute;left:'+left.toString()+'px;top:'+top.toString()+'px;z-index:99998;background:url('+chrome.extension.getURL('img/rpg_exp.png')+') no-repeat center center;"></div>');
    exp.css('background-size','20px 20px');
    $('html').append(exp);
    holes.push(exp);
    var i = 1;
    var interval = setInterval(function(){
        i++;
        if(i > 10){
            clearInterval(interval);
            var rand = Math.floor((Math.random()*2)+1);
            exp.attr('style','width:300px;height:300px;position:absolute;left:'+left.toString()+'px;top:'+top.toString()+'px;z-index:99998;background:url('+chrome.extension.getURL('img/rpg_hole'+rand+'.png')+') no-repeat center center;');
        }
        var w = i * 30;
        exp.css('background-size',w+'px '+w+'px');
    },20);
}

// GRAN

function moveGranFire(hole){
    var hole = $(hole);
    var i = 0;
    var size = 110;
    var left = parseInt(hole.css('left').replace('px',''));
    var top = parseInt(hole.css('top').replace('px',''));
    var interval = setInterval(function(){
        i++;
        if(i > 30){
            hole.remove();
            clearInterval(interval);
            granBoom(left,top);
        }
        if(i<6){
            left -= 3;
            top -= 10;
        }else if(i<15){
            left -= 7;
            top -= 7;
        }else if(i<22){
            left -= 10;
            top -= 3;
        }else{
            left -= 7;
            top += 3;
        }
        size -= 2;
        hole.css('background-size',size+'px '+size+'px');
        hole.css('left',left.toString()+'px');
        hole.css('top',top.toString()+'px');
    },15);
}

function granBoom(left,top){
    if(!soundOff){
        var audio = new Audio(chrome.extension.getURL('audio/gran_boom.mp3'));
        audio.play();
    }
    left -= 75;
    top -= 65;
    var exp = $('<div style="width:200px;height:200px;position:absolute;left:'+left.toString()+'px;top:'+top.toString()+'px;z-index:99998;background:url('+chrome.extension.getURL('img/gran_exp.png')+') no-repeat center center;"></div>');
    exp.css('background-size','20px 20px');
    $('html').append(exp);
    holes.push(exp);
    var i = 1;
    var interval = setInterval(function(){
        i++;
        if(i > 10){
            clearInterval(interval);
            var rand = Math.floor((Math.random()*2)+1);
            exp.attr('style','width:200px;height:200px;position:absolute;left:'+left.toString()+'px;top:'+top.toString()+'px;z-index:99998;background:url('+chrome.extension.getURL('img/gran_hole'+rand+'.png')+') no-repeat center center;');
        }
        var w = i * 20;
        exp.css('background-size',w+'px '+w+'px');
    },20);
}

// ATOM

function moveAtomFire(hole){
    var hole = $(hole);
    var i = 0;
    var interval = setInterval(function(){
        i++;
        var left = parseInt(hole.css('left').replace('px',''));
        var top = parseInt(hole.css('top').replace('px',''));
        if(i > 117){
            hole.remove();
            clearInterval(interval);
            atomBoom(left,top);
        }
        left -= 2;
        hole.css('left',left.toString()+'px');
        top -= 2;
        hole.css('top',top.toString()+'px');
    },5);
}

function atomBoom(left,top){
    var elm_white = $('<div style="display:none;opacity:0.95;position:fixed;left:0;top:0;background:#fff;width:100%;height:100%;z-index:9999999;"></div>');
    $('html').append(elm_white);
    elm_white.fadeIn(200,function(){
        setTimeout(function(){
            atomBoomWave(left,top);
        },200);
        setTimeout(function(){
            atomBoomFire(left,top);
        },200);
        elm_white.fadeOut(3000,function(){
            elm_white.remove();
        });
    });
    if(!soundOff){
        var audio = new Audio(chrome.extension.getURL('audio/atom_boom.mp3'));
        audio.play();
    }
}

function atomBoomWave(left,top){
    var wave = $('<div style="border:solid 10px #fff;border-radius:1000px;opacity:0.5;width:0;height:0;position:absolute;left:'+left.toString()+'px;top:'+top.toString()+'px;z-index:99998;background:url('+chrome.extension.getURL('img/atom_wave.png')+') no-repeat center center;"></div>');
    $('html').append(wave);
    holes.push(wave);
    var i = 1;
    var w = 0;
    left -= 10;
    top -= 10;
    var interval = setInterval(function(){
        i++;
        w += 12;
        left -= 6;
        top -= 6;
        if(i > 80){
            clearInterval(interval);
            wave.css('border','none');
        }
        wave.css('left',left+'px');
        wave.css('top',top+'px');
        wave.css('width',w+'px');
        wave.css('height',w+'px');
    },20);
}

function atomBoomFire(left,top){
    left -= 350;
    top -= 350;
    var exp = $('<div style="width:700px;height:700px;position:absolute;left:'+left.toString()+'px;top:'+top.toString()+'px;z-index:99998;background:url('+chrome.extension.getURL('img/atom_exp.png')+') no-repeat center center;"></div>');
    exp.css('background-size','20px 20px');
    var rand = Math.floor((Math.random()*2)+1);
    var hole = $('<div style="opacity:0.3;width:500px;height:500px;position:absolute;left:'+(left+100).toString()+'px;top:'+(top+100).toString()+'px;z-index:99998;background:url('+chrome.extension.getURL('img/atom_hole'+rand+'.png')+') no-repeat center center;background-size:500px 500px;"></div>');
    $('html').append(hole);
    holes.push(hole);
    $('html').append(exp);
    holes.push(exp);
    var i = 1;
    var opac = 100;
    var interval = setInterval(function(){
        i++;
        opac -= 1;
        var w = i * 10;
        exp.css('background-size',w+'px '+w+'px');
        exp.css('opacity',opac/100);
        hole.css('opacity',0.3+(i/100));
        if(i > 70){
            clearInterval(interval);
            exp.remove();
        }
    },20);
}

// KNIFE

function moveKnifeFire(hole){
    var hole = $(hole);
    var i = 0;
    var rotate = 0;
    var left = parseInt(hole.css('left').replace('px',''));
    var top = parseInt(hole.css('top').replace('px',''));
    var interval = setInterval(function(){
        i++;
        if(i > 50){
            hole.remove();
            clearInterval(interval);
            left -= 0;
            top -= 0;
            var rotHole = 150 + Math.floor(Math.random()*70);
            var exp = $('<div style="-webkit-transform:rotate('+rotHole+'deg);width:200px;height:200px;position:absolute;left:'+left.toString()+'px;top:'+top.toString()+'px;z-index:99998;background:url('+chrome.extension.getURL('img/knife_hole.png')+') no-repeat center center;"></div>');
            $('html').append(exp);
            holes.push(exp);
        }
        if(i<13){
            left -= 6;
            top -= 10;
        }else if(i<27){
            left -= 8;
            top -= 8;
        }else{
            left -= 10;
            top -= 6;
        }
        rotate -= 10;
        if(rotate < 0){
            rotate = 350;
        }
        hole.css('-webkit-transform','rotate('+rotate+'deg)');
        hole.css('left',left.toString()+'px');
        hole.css('top',top.toString()+'px');
    },15);
}

// NINJA

function moveNinjaFire(hole){
    var hole = $(hole);
    var i = 0;
    var rotate = 0;
    var left = parseInt(hole.css('left').replace('px',''));
    var top = parseInt(hole.css('top').replace('px',''));
    var interval = setInterval(function(){
        i++;
        if(i > 30){
            hole.remove();
            clearInterval(interval);
            left -= 0;
            top -= 0;
            var rotHole = -20 + Math.floor(Math.random()*120);
            var exp = $('<div style="-webkit-transform:rotate('+rotHole+'deg);width:200px;height:200px;position:absolute;left:'+left.toString()+'px;top:'+top.toString()+'px;z-index:99998;background:url('+chrome.extension.getURL('img/ninja_hole.png')+') no-repeat center center;"></div>');
            $('html').append(exp);
            holes.push(exp);
        }
        left -= 14;
        top -= 12;
        rotate += 13;
        if(rotate >= 360){
            rotate = 0;
        }
        hole.css('-webkit-transform','rotate('+rotate+'deg)');
        hole.css('left',left.toString()+'px');
        hole.css('top',top.toString()+'px');
    },15);
}

// BOW

function moveBowFire(hole){
    var hole = $(hole);
    var i = 0;
    var interval = setInterval(function(){
        i++;
        var left = parseInt(hole.css('left').replace('px',''));
        var top = parseInt(hole.css('top').replace('px',''));
        if(i > 16){
            hole.remove();
            clearInterval(interval);
            var rotHole = Math.floor(Math.random()*7) - 3;
            left -= 49;
            top -= 49;
            var exp = $('<div style="-webkit-transform:rotate('+rotHole+'deg);width:200px;height:200px;position:absolute;left:'+left.toString()+'px;top:'+top.toString()+'px;z-index:99998;background:url('+chrome.extension.getURL('img/bow_hole.png')+') no-repeat center center;"></div>');
            $('html').append(exp);
            holes.push(exp);                        
        }
        left -= 10;
        hole.css('left',left.toString()+'px');
        top -= 10;
        hole.css('top',top.toString()+'px');
    },20);
}

// SPEAR

function moveSpearFire(hole){
    var hole = $(hole);
    var i = 0;
    var interval = setInterval(function(){
        i++;
        var left = parseInt(hole.css('left').replace('px',''));
        var top = parseInt(hole.css('top').replace('px',''));
        if(i > 30){
            hole.remove();
            clearInterval(interval);
            var rotHole = Math.floor(Math.random()*3) - 1;
            left -= 20;
            top -= 20;
            var exp = $('<div style="-webkit-transform:rotate('+rotHole+'deg);width:300px;height:311px;position:absolute;left:'+left.toString()+'px;top:'+top.toString()+'px;z-index:99998;background:url('+chrome.extension.getURL('img/spear_hole.png')+') no-repeat center center;"></div>');
            $('html').append(exp);
            holes.push(exp);                        
        }
        left -= 10;
        hole.css('left',left.toString()+'px');
        top -= 10;
        hole.css('top',top.toString()+'px');
    },20);
}

// CANNON

function moveCannonFire(hole){
    var hole = $(hole);
    var i = 0;
    var interval = setInterval(function(){
        i++;
        var left = parseInt(hole.css('left').replace('px',''));
        var top = parseInt(hole.css('top').replace('px',''));
        if(i > 24){
            hole.remove();
            clearInterval(interval);
            cannonBoom(left,top);
        }
        left -= 11;
        hole.css('left',left.toString()+'px');
        top -= 10;
        hole.css('top',top.toString()+'px');
    },20);
}

function cannonBoom(left,top){
    if(!soundOff){
        var audio = new Audio(chrome.extension.getURL('audio/rpg_boom.mp3'));
        audio.play();
    }
    left -= 150;
    top -= 150;
    var exp = $('<div style="width:300px;height:300px;position:absolute;left:'+left.toString()+'px;top:'+top.toString()+'px;z-index:99998;background:url('+chrome.extension.getURL('img/rpg_exp.png')+') no-repeat center center;"></div>');
    exp.css('background-size','20px 20px');
    $('html').append(exp);
    holes.push(exp);
    var i = 1;
    var interval = setInterval(function(){
        i++;
        if(i > 10){
            clearInterval(interval);
            var rand = Math.floor((Math.random()*2)+1);
            exp.attr('style','width:300px;height:300px;position:absolute;left:'+left.toString()+'px;top:'+top.toString()+'px;z-index:99998;background:url('+chrome.extension.getURL('img/rpg_hole'+rand+'.png')+') no-repeat center center;');
        }
        var w = i * 30;
        exp.css('background-size',w+'px '+w+'px');
    },20);
}

// OTHER

function trackButton(param1,param2,param3,param4){
    chrome.extension.sendRequest({            
        trackButton:[param1,param2,param3,param4]
    },function(response) {});
}

var reset=function(){
    for(var i=0;i<holes.length;i++){
        holes[i].remove();
    }
    for(var i=0;i<intervals.length;i++){
        clearInterval(intervals[i]);
    }
    trackButton('Shooting','Controls','Reset');
}
var exit = function(e){
    event.preventDefault();
    if(e.keyCode==27){
        exit2();
        trackButton('Shooting','Controls','ESC');
    }
}

var exit2=function(){
    window.location.reload();
}

var share_it = function(soc){//IN: fb,twt
    $("#weapon").remove();$("#stamp").remove();$("#spray").remove();$("#reset").remove();$("#cursor").remove();$("#close").remove(); $("#facebook_button").remove();$("#sound_button").remove();
    /*$('body').append(
        $('<strong id="wd_text_loader" style="border-radius:3px;display:inline-block;font-size:20px;line-height:20px;background:#fff;border:solid 1px #666;padding:5px 10px;position:fixed;left:40%;top:40%;z-index:99999999;">Sharing. Wait please...</strong>')
    );*/
    chrome.extension.sendRequest({            
        exit:'exit',
        soc: soc
    },function(response) {});
}

function closeButton(){
    $("#close").remove();
    var close = document.createElement('input');
    close.setAttribute('type', 'button');
    close.setAttribute('value', translate['exit']);
    close.setAttribute('id', 'close');
    close.setAttribute('class', 'exit_css');
    $('html').append(close);
    $('#close').css({
        'position':'fixed',
        'cursor':'pointer',
        'right':'20px',       
        'top':'20px',
        'z-index':'99999999'
    });
    $("#close").bind("click",function(){
        exit2();
        trackButton('Shooting','Controls','Exit');
    });                           
}
function facebookButton(){
    $("#facebook_button").remove();
    var elm = $('<input type="button" id="facebook_button" value="'+translate['share']+'" class="exit_css" />');
    $('html').append(elm);
    elm.css({
        'position':'fixed',
        'cursor':'pointer',
        'right':'80px',       
        'top':'20px',
        'z-index':'99999999'
    });
    elm.bind("click",function(){
        share_it('fb');
        trackButton('Shooting','Controls','Facebook Share');
    });                           
}
function resetButton(){
    $("#reset").remove();
    var close = document.createElement('input');
    close.setAttribute('type', 'button');
    close.setAttribute('id', 'reset');
    close.setAttribute('class', 'exit_css');
    close.setAttribute('value', translate['reset']);
    $('html').append(close);
    //$('#close').css({"cursor":"default","z-index":"999999","position:absolute","top":"0px","right":"0px"});
    $('#reset').css({
        'position':'fixed',
        'cursor':'pointer',
        'left':'20px',       
        'top':'20px',
        'z-index':'99999999'
    });
    $("#reset").bind("click",reset);                           
}   
function soundButton(){
    chrome.extension.sendRequest({            
        get_sound:true
    },function(response) {
        soundOff = response;
        var button = $('<img style="position:fixed;top:24px;left:100px;cursor:pointer;z-index:99999999;" alt="" />');
        $('html').append(button);
        button.attr('id','sound_button');
        if(soundOff){
            button.attr('src',chrome.extension.getURL('img/sound_off.png'));
        }else{
            button.attr('src',chrome.extension.getURL('img/sound_on.png'));
        }
        button.click(function(){
            if(soundOff){
                soundOff = false;
                $(this).attr('src',chrome.extension.getURL('img/sound_on.png'));
                chrome.extension.sendRequest({            
                    set_sound:'on'
                },function(response) {});
                trackButton('Shooting','Controls','Sound On');
            }else{
                soundOff = true;
                $(this).attr('src',chrome.extension.getURL('img/sound_off.png'));
                chrome.extension.sendRequest({            
                    set_sound:'off'
                },function(response) {});
                trackButton('Shooting','Controls','Sound Off');
            }
        });
    });
}

function clear(){
    //console.log(param);
    try{
        $('#overlay').remove();
        $('#weapon').remove();
        $('#stamp').remove();
        $('#spray').remove();
        $('html').unbind();
    }catch(e){}
}

// LISTENERS

$("html").mousemove(function(e){
    $('#weapon').css({
        'top': e.pageY+yShift, 
        'left': e.pageX + xShift
    });
    x=e.pageX;
    y=e.pageY;
    $('#cursor').css({
        'top': e.pageY-8, 
        'left': e.pageX-8
    });
    x=e.pageX;
    y=e.pageY;
    if(param=='stamp'){
        $('#stamp').css({
            top:y+holeY,
            left:x+holeX
        });
    }
    if(param=='spray'){
        $('#spray').css({
            top:y+holeY,
            left:x+holeX
        });
    }
});
$('html').bind('mousedown',function(e){
    event.preventDefault();
    if(e.button==0 && e.srcElement.id!='close' && e.srcElement.id!='reset' && e.srcElement.id!='sound_button' && e.srcElement.id!='facebook_button'){
        countShoot = 0;
        shoot();
        if(param=='gun' || param=='shotgun' || param=='flame' || param=='spray' || param=='laser' || param=='saw' || param=='flash' || param=='plasma'){
            shootInterval=setInterval(function(){
                shoot();
            },shootRate);
        }
    }
})
$('html').bind('mouseup',function(e){
    event.preventDefault();
    clearInterval(shootInterval);
    $('#weapon').attr('src',weapon);
    if(countShoot != 0){
        trackButton('Shooting','Shoot',param,countShoot);
    }
})

$(document).bind('keydown',exit);


// no remove !!! - fix error :-)
console.log('');///////////////
///////////////////////////////