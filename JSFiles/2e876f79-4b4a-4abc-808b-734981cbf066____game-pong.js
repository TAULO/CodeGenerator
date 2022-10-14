/*
    Alex Extreme Pong
    Copyright (C) 2013  Alejandro García-Gasco Pérez
*/


var spritesPong = {
    pala1A:   { sx: 0, sy: 32, w: 24, h: 68, frames: 1 },
    pala2A:   { sx: 29, sy: 100, w: 24, h: 32, frames: 1 },
    pala3A:   { sx: 29, sy: 0, w: 24, h: 32, frames: 1 },
    pala1B:   { sx: 29, sy: 32, w: 24, h: 68, frames: 1 },
    pala2B:   { sx: 0, sy: 100, w: 24, h: 32, frames: 1 },
    pala3B:   { sx: 0, sy: 0, w: 24, h: 32, frames: 1 },
    pelota:   { sx: 56, sy: 0, w: 26, h: 26, frames: 1 },
    pNegra:   { sx: 90, sy: 0, w: 50, h: 45, frames: 1 },
    pAzul:    { sx: 55, sy: 53, w: 29, h: 29, frames: 1 },
    pDB:      { sx: 56, sy: 25, w: 28, h: 28, frames: 1 },
	  pPokeball:{ sx: 58, sy: 84, w: 27, h: 26, frames: 1 },
	  pflor:    { sx: 100, sy: 46, w: 30, h: 30, frames: 1 },
    Goku1:    { sx: 14, sy: 157, w: 57, h: 80, frames: 1 },
    Goku2:    { sx: 67, sy: 157, w: 57, h: 80, frames: 1 },
    corazon:  { sx: 142, sy:0, w: 30, h: 28, frames: 1 },
    snorlax:  { sx: 6, sy:277, w: 101, h: 82, frames: 1 },
    cetas:    { sx: 0, sy:133, w: 30, h: 8, frames:4},
    explosionp: { sx: 0, sy: 372, w: 48, h: 48, frames: 1 },
    cajaMagica: { sx: 175, sy:0, w: 60, h: 60, frames: 1 },
    cajaMagica2: { sx: 175, sy:0, w: 120, h: 120, frames: 1 }
};

var playMenu =function(){
 
    if(!Music.niveles.background.paused && Music.extension){
         Music.niveles.background.pause();
         Music.niveles.background.currentTime = 0;
    };
    if(Music.menu.background.paused && Music.extension){Music.menu.background.Miplay()};
    
    
    GamePong.points1=undefined;
    GamePong.points2=undefined;
    GamePong.boards=[];
    if(GamePong.mobile) {
	    GamePong.setBoard(6,new TouchControlsMenu());
	  }
   
    GamePong.dificultad=1;
    GamePong.setBoard(5,new MuteScreen());
    GamePong.setBoard(0,new capaClear());
    GamePong.setBoard(2, new MenuScreen(startGame));   
}

var startGame = function() {

    if(Music.extension){Music.menu.chmod.Miplay()};
           
    if (GamePong.jugadores==2){
      GamePong.segundos=60;    
      GamePong.duracion= GamePong.segundos*1000;
      GamePong.setBoard(2,new TitleScreenPong("Alex extreme pong", 
                                      "Aprieta espacio para jugar!",
                                      playGame));
    }else{
      GamePong.vidas=3;
      GamePong.duracion=0;
      GamePong.setBoard(2,new TitleScreenPong("Alex Extreme Pong", 
                                      "Aprieta espacio para jugar!",
                                      playGame1));
    }
}


OBJETO_PALA1        =   1;
OBJETO_PALA2        =   2;
OBJETO_PELOTA       =   4;
OBJETO_PELOTA_NEGRA =   8;
OBJETO_PELOTA_AZUL  =  16;
OBJETO_PELOTA_DB    =  32;
OBJETO_PALAUX       =  64;
OBJETO_SNORLAX      = 128;
OBJETO_PELOTA_POKE  = 256;
OBJETO_PELOTA_FLOR  = 512;
OBJETO_GOKU         =1024;
OBJETO_CAJAMAGICA   =2048;



var endGame = function(){

    if(GamePong.mobile) {
	    GamePong.setBoard(6,new TouchControlsMenu());
	  }

    if(Music.extension){Music.niveles.aplauso.Miplay()}
    GamePong.setBoard(2,new TitleScreenPong("Fin del juego!!!!", 
                                    "Aprieta espacio para jugar otra vez!",
                                    playGame));
}

var playGame = function() {

    if(GamePong.mobile) {
	    GamePong.setBoard(6,new TouchControlsGame());
	  }

    if(!Music.menu.background.paused && Music.extension){
              Music.menu.background.pause();
              Music.menu.background.currentTime = 0};
    if(Music.niveles.background.paused && Music.extension){Music.niveles.background.Miplay()};


	  GamePong.setBoard(4,new GamePointsPong(0));
	  GamePong.setBoard(3,new RelojPong(true));
    var board = new GamePongBoard();


    // PALAS DE JUGADORES             Si se modifica el orden de las palas se modifican las referencias.
    board.add(new Pala1PlayerA());
    board.add(new Pala2PlayerA());
    board.add(new Pala3PlayerA());
    board.add(new Pala1Maquina(40));
    board.add(new Pala2Maquina());
    board.add(new Pala3Maquina());

    if(Music.extension){Music.niveles.pitido.Miplay()};    //SONIDO: PITIDO INICIAL
    
    
    // PELOTAS

    switch(GamePong.dificultad){

        case 3:

          	rand= Math.floor((Math.random()*(GamePong.duracion)));
            setTimeout(function(){(board.add(new Pelota_Poke()))},rand);
            rand= Math.floor((Math.random()*GamePong.duracion));
            setTimeout(function(){(board.add(new Pelota_Poke()))},rand);
            setTimeout(function(){(board.add(new Pelota()))},GamePong.duracion/20*3);
            rand= Math.floor((Math.random()*(GamePong.duracion)));
            setTimeout(function(){(board.add(new Pelota_Flor()))},rand);

             
        case 2:             
            for (var i=1;i<2;i++){
                setTimeout(function(){(board.add(new Pelota()))},GamePong.duracion/20*i);
	          };
            setInterval(function(){(board.add(new Pelota_Negra()))},GamePong.duracion/6);
            setInterval(function(){(board.add(new Pelota_Azul()))},GamePong.duracion/5);
            setInterval(function(){(board.add(new Pelota_DB()))},GamePong.duracion/4);
        
        case 1:
            board.add(new cajaMagica(GamePong.width/2,GamePong.height/2));
            board.add(new cajaMagica(GamePong.width/3,GamePong.height));
            board.add(new cajaMagica(2*GamePong.width/3,0));
            board.add(new Pelota());
            board.add(new PalauxA());
            board.add(new PalauxB());
            

    }
    GamePong.setBoard(2,board);
    setTimeout(function(){endGame()},GamePong.duracion);
}



///////////////////////////////////////////////////////////////////////////////////////////////////////// PALAS!!


/////// PLAYER A
var Pala1PlayerA = function() { //Parte central de la pala izquierda
    this.setup('pala1A', { vx: 0, frame: 0, reloadTime: 0.25, maxVel: 200 });

    this.reload = this.reloadTime;
    this.x =  10;
    this.y = GamePong.height/2 - this.h/2;
    this.step = function(dt) {
    
  /*    if(GamePong.keys['down1']) { this.vy = this.maxVel; }
      else if(GamePong.keys['up1']) { this.vy = -this.maxVel; }
      
      else if(GamePong.keys['down2'] && GamePong.jugadores==1) { this.vy = this.maxVel; }
      else if(GamePong.keys['up2'] && GamePong.jugadores==1) { this.vy = -this.maxVel; }
      else { this.vy = 0; }*/
      
      if(GamePong.keys['down2']) { this.vy = this.maxVel; }
      else if(GamePong.keys['up2']) { this.vy = -this.maxVel; }
        else { this.vy = 0; }

	    this.y += this.vy * dt;

	    if(this.y < 32) { this.y = 32; }
	    else if(this.y > GamePong.height - 32 - this.h) { 
	        this.y = GamePong.height -32 - this.h
	    }

	    this.reload-=dt;

    }
}
// Heredamos del prototipo new SpritePong()
Pala1PlayerA.prototype = new SpritePong();
Pala1PlayerA.prototype.type = OBJETO_PALA1;

var Pala2PlayerA = function() { //Parte de abajo de la pala izquierda
    this.setup('pala2A', { vx: 0, frame: 0, reloadTime: 0.25, maxVel: 200 });

    this.reload = this.reloadTime;
    this.x =  10;
    this.y = GamePong.height/2 + 100/2 - this.h/2;

    this.step = function(dt) {
        this.y= this.board.objects[0].y + this.board.objects[0].h;
	    this.reload-=dt;
    }
}

Pala2PlayerA.prototype = new SpritePong();
Pala2PlayerA.prototype.type = OBJETO_PALA2;


var Pala3PlayerA = function() { // Parte de arriba de la pala izquierda
    this.setup('pala3A', { vx: 0, frame: 0, reloadTime: 0.25, maxVel: 200 });

    this.reload = this.reloadTime;
    this.x =  10;
    this.y = GamePong.height/2 - 100/2 - this.h/2;

    this.step = function(dt) {
        this.y= this.board.objects[0].y - this.h;
	      this.reload-=dt;
  }
}

Pala3PlayerA.prototype = new SpritePong();
Pala3PlayerA.prototype.type = OBJETO_PALA2;


var PalauxA =function(){ // Pala auxiliar de la pala izquierda (en la derecha)
    this.setup('pala1A', { vx: 0, frame: 0, reloadTime: 0.25, maxVel: 200 });
    
    this.reload = this.reloadTime;
    this.x= GamePong.width - GamePong.width/3;
    this.step = function(dt) {
      this.y= this.board.objects[0].y;
	    this.reload-=dt;
  }
    
}
PalauxA.prototype = new SpritePong();
PalauxA.prototype.type = OBJETO_PALAUX;




////////// PLAYER MAQUINA
var Pala1Maquina = function(factor) { //Parte central de la pala derecha
    this.setup('pala1B', { vx: 0, frame: 0, reloadTime: 0.25, maxVel: 200 });

    this.reload = this.reloadTime;
    this.x = GamePong.canvas.width - 10 - this.w;
    this.y = GamePong.height/2 - this.h/2;
    
    this.factor =factor;
    this.step = function(dt) {

    var percent = false;
    var rand = Math.floor(Math.random() * (100));
  

    if(rand > this.factor) {  percent = true }


    pelota = ( _.find(this.board.objects,function(obj){return obj.sprite=="pelota"}));
    if(pelota.vx > 0 && pelota.x>GamePong.width/4 && pelota.y>this.y+this.h/2 && percent) { 
      this.vy = this.maxVel;
    }
    else if(pelota.vx > 0 && pelota.x>GamePong.width/4 && pelota.y<this.y+this.h/2 && percent) { 
      this.vy = -this.maxVel;
    }
    else if(pelota.vx < 0 && pelota.x>GamePong.width/2 && pelota.y>this.y+this.h/2 && percent) { 
      this.vy = this.maxVel;
    }
    else if(pelota.vx < 0 && pelota.x>GamePong.width/2 && pelota.y<this.y+this.h/2 && percent) { 
      this.vy = -this.maxVel;
    }
    else { this.vy = 0; }

   
    this.y += this.vy * dt;


    if(this.y < 32) { this.y = 32; }
    else if(this.y > GamePong.height - 32 - this.h) { 
        this.y = GamePong.height -32 - this.h
    }
    
    
    if (GamePong.points2 ==3 && GamePong.jugadores==1){nextLvl()};
    if (GamePong.points1 ==3 && GamePong.jugadores==1){endGame1()};
    

    this.reload-=dt;

  }
}
// Heredamos del prototipo new SpritePong()
Pala1Maquina.prototype = new SpritePong();
Pala1Maquina.prototype.type = OBJETO_PALA1;


var Pala2Maquina = function() { //Parte de abajo de la pala derecha
    this.setup('pala2B', { vx: 0, frame: 0, reloadTime: 0.25, maxVel: 200 });

    this.reload = this.reloadTime;
    this.x = GamePong.canvas.width - 10 - this.w;
    this.y = GamePong.height/2 + 100/2 - this.h/2;

    this.step = function(dt) {
      this.y= this.board.objects[3].y + this.board.objects[3].h;
        this.reload-=dt;
    }
}
Pala2Maquina.prototype = new SpritePong();
Pala2Maquina.prototype.type = OBJETO_PALA2;


var Pala3Maquina = function() {  //Parte de arriba de la pala derecha
    this.setup('pala3B', { vx: 0, frame: 0, reloadTime: 0.25, maxVel: 200 });

    this.reload = this.reloadTime;
    this.x = GamePong.width - 10 - this.w;
    this.y = GamePong.height/2 - 100/2 - this.h/2;

    this.step = function(dt) {
      this.y= this.board.objects[3].y - this.h;
        this.reload-=dt;
    }
}
Pala3Maquina.prototype = new SpritePong();
Pala3Maquina.prototype.type = OBJETO_PALA2;


var PalauxB =function(){ // Pala auxiliar de la pala derecha (en la izquierda)
    this.setup('pala1B', { vx: 0, frame: 0, reloadTime: 0.25, maxVel: 200 });
    
    this.reload = this.reloadTime;
    this.x= GamePong.width/3 - this.w;
    this.step = function(dt) {
      this.y= this.board.objects[3].y;
        this.reload-=dt;
  }
    
}
PalauxB.prototype = new SpritePong();
PalauxB.prototype.type = OBJETO_PALAUX;





////////////////////////////////////////////////////////////////////////////////////////////////////////////// PELOTAS


//////////////// PELOTA NORMAL
var Pelota = function(){
    this.setup('pelota', {vx:110, vy:100,frame: 0, reloadTime: 0.25, maxVel: 400 });
    
    randx= Math.floor((Math.random()*this.vx)+(this.vx-10));
    randy= Math.floor((Math.random()*this.vy)+(this.vy-20));
    var rand = Math.random() < 0.5 ? -1 : 1;
    this.vx=randx *rand;
    rand = Math.random() < 0.5 ? -1 : 1;
    this.vy=randy* rand;
    this.reload = this.reloadTime;
    this.x = GamePong.width/2 - this.w/2;
    this.y = GamePong.height/2 - this.h/2;
    this.change = false;
}
Pelota.prototype = new SpritePong();
Pelota.prototype.type = OBJETO_PELOTA; 
Pelota.prototype.step = function(dt) {    
    this.x += this.vx * dt;
    this.y += this.vy * dt;


    if(this.y < 0) { this.y = 0, this.vy = -this.vy; if(Music.extension){Music.pelota.pop4.Miplay()};}
    else if(this.y > GamePong.height - this.h) { 
        this.y = GamePong.height - this.h;
        this.vy = -this.vy;
        if(Music.extension){Music.pelota.pop4.Miplay()};
        } 

    var collision = this.board.collide(this,OBJETO_PALA1);
    if(collision) {
        if (this.vx<0){this.x = collision.x+collision.w}
        else{this.x=collision.x-this.w};
        this.vx = -this.vx;
        if (this.vx<= this.maxVel){this.vx=this.vx*1.05};
        if(Music.extension){Music.pelota.pop5.Miplay()};
    }
    
    collision = this.board.collide(this,OBJETO_PALA2);
    if(collision) {
        if (this.vx<0){this.x = collision.x+collision.w}
        else{this.x=collision.x-this.w};
        this.vy = -this.vy;
        this.vx = -this.vx;
        if (this.vx<= this.maxVel){this.vx=this.vx*1.05};
        if(Music.extension){Music.pelota.pop5.Miplay()}
    }
    
    collision = this.board.collide(this,OBJETO_PALAUX);
    if(collision) {
        if (this.vx<0){this.x = collision.x+collision.w}
        else{this.x=collision.x-this.w};
        this.vy = this.vy;
        this.vx = -this.vx;
        if (this.vx<= this.maxVel){this.vx=this.vx*1.05};
        if(Music.extension){Music.pelota.pop5.Miplay()}
    }
    
    collision = this.board.collide(this,OBJETO_GOKU);
    if(collision) {
        if (this.vx<0){this.x = collision.x+collision.w}
        else{this.x=collision.x-this.w};
        this.vy = -this.vy;
        this.vx = -this.vx;
        if (this.vx<= this.maxVel){this.vx=this.vx*1.05};
        if(Music.extension){Music.goku.desvio.Miplay()}
    }
    
    collision = this.board.collide(this,OBJETO_CAJAMAGICA);
    if(collision) {
       this.change = true;
    }
    if (!collision && this.change){ 
        this.vy = -this.vy;
        this.vx = this.vx;
        this.change = false;
        if(Music.extension){Music.cajaMagica.Miplay()}
    }
    
    if(this.x < 0 - this.w) {
       this.board.remove(this);
       GamePong.points1++;
       if(Music.extension){Music.pelota.pop1.Miplay()}
       this.board.add(new Pelota());
       
    }
	  else if(this.x > GamePong.width) {  
	     this.board.remove(this);
	     GamePong.points2++;
	     if(Music.extension){Music.pelota.pop1.Miplay()}
	     this.board.add(new Pelota());   
	  }

}
 

///////////// PELOTA NEGRA
var Pelota_Negra = function(){
    this.setup('pNegra', {vx:80, vy:80,frame: 0, reloadTime: 0.25, maxVel: 500 });
    
    randx= Math.floor((Math.random()*this.vx)+(this.vx-10));
    randy= Math.floor((Math.random()*this.vy)+(this.vy-20));
    var rand = Math.random() < 0.5 ? -1 : 1;
    this.vx=randx *rand;
    rand = Math.random() < 0.5 ? -1 : 1;
    this.vy=randy* rand;
    this.reload = this.reloadTime;
    this.x = GamePong.width/2 - this.w/2;
    this.y = GamePong.height/2 - this.h/2;
}
Pelota_Negra.prototype = new SpritePong();
Pelota_Negra.prototype.type = OBJETO_PELOTA_NEGRA; 
Pelota_Negra.prototype.step = function(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;


    if(this.y < 0) { this.y = 0, this.vy = -this.vy; if(Music.extension){Music.pelota.pop4.Miplay()};}
    else if(this.y > GamePong.height - this.h) { 
        this.y = GamePong.height - this.h
        this.vy = -this.vy;
        if(Music.extension){Music.pelota.pop4.Miplay()};
        } 

    var collision = this.board.collide(this,OBJETO_PALA1);
    if(collision) {
        if (this.vx<0){this.x = collision.x+collision.w}
        else{this.x=collision.x-this.w};
        this.vx = -this.vx;
        if(Music.extension){Music.pelota.pop5.Miplay()};
        if (this.vx<= this.maxVel){this.vx=this.vx*1.05};
    }
    
    collision = this.board.collide(this,OBJETO_PALA2);
    if(collision) {
        if (this.vx<0){this.x = collision.x+collision.w}
        else{this.x=collision.x-this.w};
        this.vy = -this.vy;
        this.vx = -this.vx;
        if(Music.extension){Music.pelota.pop5.Miplay()};
        if (this.vx<= this.maxVel){this.vx=this.vx*1.05};
    }
    
    collision = this.board.collide(this,OBJETO_PALAUX);
    if(collision) {
        if (this.vx<0){this.x = collision.x+collision.w}
        else{this.x=collision.x-this.w};
        this.vy = this.vy;
        this.vx = -this.vx;
        if(Music.extension){Music.pelota.pop5.Miplay()};
        if (this.vx<= this.maxVel){this.vx=this.vx*1.05};
    }
    
    collision = this.board.collide(this,OBJETO_GOKU);
    if(collision) {
        if (this.vx<0){this.x = collision.x+collision.w}
        else{this.x=collision.x-this.w};
        this.vy = -this.vy;
        this.vx = -this.vx;
        if (this.vx<= this.maxVel){this.vx=this.vx*1.05};
        if(Music.extension){Music.goku.desvio.Miplay()};
    }
    
    if(this.x < 0 - this.w) {
       this.board.remove(this);
       GamePong.points1= GamePong.points1 + 10;  
       if(Music.extension){Music.pelota.pop1.Miplay()}     
    }
	  else if(this.x > GamePong.width) {  
	     this.board.remove(this);
	     GamePong.points2= GamePong.points2 + 10; 
	     if(Music.extension){Music.pelota.pop2.Miplay()}
	      
	  }
}


//////////////// PELOTA AZUL
var Pelota_Azul = function(){
    this.setup('pAzul', {vx:100, vy:100,frame: 0, reloadTime: 0.25, maxVel: 500 });
    
    randx= Math.floor((Math.random()*this.vx)+(this.vx-10));
    randy= Math.floor((Math.random()*this.vy)+(this.vy-20));
    var rand = Math.random() < 0.5 ? -1 : 1;
    this.vx=randx *rand;
    rand = Math.random() < 0.5 ? -1 : 1;
    this.vy=randy* rand;
    this.reload = this.reloadTime;
    this.x = GamePong.width/2 - this.w/2;
    this.y = GamePong.height/2 - this.h/2;
}
Pelota_Azul.prototype = new SpritePong();
Pelota_Azul.prototype.type = OBJETO_PELOTA_AZUL;  
Pelota_Azul.prototype.step = function(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    if(this.y < 0) { this.y = 0, this.vy = -this.vy; if(Music.extension){Music.pelota.pop4.Miplay()};}
    else if(this.y > GamePong.height - this.h) { 
        this.y = GamePong.height - this.h
        this.vy = -this.vy;
        if(Music.extension){Music.pelota.pop4.Miplay()};
        } 

    var collision = this.board.collide(this,OBJETO_PALA1);
    if(collision) {
       if (this.x < GamePong.width/2){
			GamePong.points1= GamePong.points1 - 10;
			this.board.add(new Corazon(this.x, this.y));
        }else {GamePong.points2= GamePong.points2 - 10;};
			this.board.add(new Corazon(this.x, this.y));
        this.board.remove(this);
      if(Music.extension){Music.vida.Miplay()}
    }
    
    collision = this.board.collide(this,OBJETO_PALA2);
    if(collision) {
       if (this.x < GamePong.width/2){
			GamePong.points1= GamePong.points1 - 10;
			this.board.add(new Corazon(this.x, this.y));
        }else {GamePong.points2= GamePong.points2 - 10;};
			this.board.add(new Corazon(this.x, this.y));
        this.board.remove(this);
        if(Music.extension){Music.vida.Miplay()}
    }
    
    collision = this.board.collide(this,OBJETO_PALAUX);
    if(collision) {
        if (this.vx<0){this.x = collision.x+collision.w}
        else{this.x=collision.x-this.w};
        this.vy = this.vy;
        this.vx = -this.vx;
        if(Music.extension){Music.pelota.pop5.Miplay()};
        if (this.vx<= this.maxVel){this.vx=this.vx*1.05};
    }
    
    collision = this.board.collide(this,OBJETO_GOKU);
    if(collision) {
        if (this.vx<0){this.x = collision.x+collision.w}
        else{this.x=collision.x-this.w};
        this.vy = -this.vy;
        this.vx = -this.vx;
        if(Music.extension){Music.goku.desvio.Miplay()};
        if (this.vx<= this.maxVel){this.vx=this.vx*1.05};
    }
    
    if(this.x < 0 - this.w) {
       this.board.remove(this);      
    }
	  else if(this.x > GamePong.width) {  
	     this.board.remove(this);     
	  }
}     
 

////////////// DRAGON BALL
var Pelota_DB = function(){
    this.setup('pDB', {vx:90, vy:90,frame: 0, reloadTime: 0.25, maxVel: 500 });
    
    randx= Math.floor((Math.random()*this.vx)+(this.vx-10));
    randy= Math.floor((Math.random()*this.vy)+(this.vy-20));
    var rand = Math.random() < 0.5 ? -1 : 1;
    this.vx=randx *rand;
    rand = Math.random() < 0.5 ? -1 : 1;
    this.vy=randy* rand;
    this.reload = this.reloadTime;
    this.x = GamePong.width/2 - this.w/2;
    this.y = GamePong.height/2 - this.h/2;
}
Pelota_DB.prototype = new SpritePong();
Pelota_DB.prototype.type = OBJETO_PELOTA_DB;   
Pelota_DB.prototype.step = function(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    if(this.y < 0) { this.y = 0, this.vy = -this.vy; if(Music.extension){Music.pelota.pop4.Miplay()};}
    else if(this.y > GamePong.height - this.h) { 
        this.y = GamePong.height - this.h
        this.vy = -this.vy;
        if(Music.extension){Music.pelota.pop4.Miplay()};
        } 

    var collision = this.board.collide(this,OBJETO_PALA1);
    if(collision) {
       if (this.x < GamePong.width/2){
          this.board.add(new Goku(1));
        }else {this.board.add(new Goku(2))};
        this.board.remove(this);
        if(Music.extension){Music.goku.salir.Miplay()}
    }
    
    collision = this.board.collide(this,OBJETO_PALA2);
    if(collision) {
       if (this.x < GamePong.width/2){
          this.board.add(new Goku(1));
        }else {this.board.add(new Goku(2))};
        this.board.remove(this);
    }
    
    collision = this.board.collide(this,OBJETO_PALAUX);
    if(collision) {
        if (this.vx<0){this.x = collision.x+collision.w}
        else{this.x=collision.x-this.w};
        this.vy = this.vy;
        this.vx = -this.vx;
        if(Music.extension){Music.pelota.pop5.Miplay()};
        if (this.vx<= this.maxVel){this.vx=this.vx*1.05};
    }
    
    collision = this.board.collide(this,OBJETO_GOKU);
    if(collision) {
        if (this.vx<0){this.x = collision.x+collision.w}
        else{this.x=collision.x-this.w};
        this.vy = -this.vy;
        this.vx = -this.vx;
        if(Music.extension){Music.goku.desvio.Miplay()};
        if (this.vx<= this.maxVel){this.vx=this.vx*1.05};
    }
    
    if(this.x < 0 - this.w) {
       this.board.remove(this);      
    }
	  else if(this.x > GamePong.width) {  
	     this.board.remove(this);
	      
	  }
}


///////////////////// PELOTA POKEMON
var Pelota_Poke = function(){
    this.setup('pPokeball', {vx:80, vy:80,frame: 0, reloadTime: 0.25, maxVel: 500 });
    randx= Math.floor((Math.random()*this.vx)+(this.vx-10));
    randy= Math.floor((Math.random()*this.vy)+(this.vy-20));
    var rand = Math.random() < 0.5 ? -1 : 1;
    this.vx=randx *rand;
    rand = Math.random() < 0.5 ? -1 : 1;
    this.vy=randy* rand;
    this.reload = this.reloadTime;
    this.x = GamePong.width/2 - this.w/2;
    this.y = GamePong.height/2 - this.h/2;
    this.borrar=0;
}
Pelota_Poke.prototype = new SpritePong();
Pelota_Poke.prototype.type = OBJETO_PELOTA_POKE;
Pelota_Poke.prototype.step = function(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    this.borrar++;
    if(this.borrar >= 600) {
      this.board.add(new Explosionp(this.x, this.y));
      this.board.remove(this);
    }


    if(this.y < 0) { this.y = 0, this.vy = -this.vy; if(Music.extension){Music.pelota.pop4.Miplay()};}
    else if(this.y > GamePong.height - this.h) { 
        this.y = GamePong.height - this.h
        this.vy = -this.vy;
        if(Music.extension){Music.pelota.pop4.Miplay()};
        } 
    if(this.x < (0)) {
      this.x=0;
      this.vx=-this.vx;
      if(Music.extension){Music.pelota.pop4.Miplay()};
      if (this.vx<= this.maxVel){this.vx=this.vx*1.05};       
    }
	  else if(this.x > GamePong.width - this.w) { 
	    if(Music.extension){Music.pelota.pop4.Miplay()}; 
      this.vx=-this.vx;
      this.x= GamePong.width - this.w
	    if (this.vx<= this.maxVel){this.vx=this.vx*1.05};  
	  }

    var coll = this.board.collide(this,OBJETO_PALA1);
    var coll2 = this.board.collide(this,OBJETO_PALA2);
    if(coll || coll2) {

        var oy= Math.floor((Math.random()*(GamePong.height - 82 ))+(10));
        

        if (coll.sprite == "pala1A" || coll2.sprite =="pala2A" || coll2.sprite=="pala3A"){

          this.board.add(new Snorlax(0,oy));
          if(Music.extension){Music.snorlax.Miplay()}
          this.board.add(new Cetas(37,oy - 20));
        }
        else if(coll.sprite == "pala1B" || coll2.sprite =="pala2B"|| coll2.sprite=="pala3B"){
           this.board.add(new Snorlax(GamePong.width - 101,oy));
           if(Music.extension){Music.snorlax.Miplay()}
           this.board.add(new Cetas(GamePong.width - 101+37,oy - 20));
        }
        this.board.remove(this);  
    }
    
    collision = this.board.collide(this,OBJETO_PALAUX);
    if(collision) {
        if (this.vx<0){this.x = collision.x+collision.w}
        else{this.x=collision.x-this.w};
        this.vy = this.vy;
        this.vx = -this.vx;
        if(Music.extension){Music.pelota.pop5.Miplay()};
        if (this.vx<= this.maxVel){this.vx=this.vx*1.05};
    }
    
    collision = this.board.collide(this,OBJETO_GOKU);
    if(collision) {
        if (this.vx<0){this.x = collision.x+collision.w}
        else{this.x=collision.x-this.w};
        this.vy = -this.vy;
        this.vx = -this.vx;
        if(Music.extension){Music.goku.desvio.Miplay()};
        if (this.vx<= this.maxVel){this.vx=this.vx*1.05};
    }
}


//////////////////////////PELOTA FLOR
var Pelota_Flor = function(){
    this.setup('pflor', {vx:80, vy:80,frame: 0, reloadTime: 0.25, maxVel: 500 }); 
    randx= Math.floor((Math.random()*this.vx)+(this.vx-10));
    randy= Math.floor((Math.random()*this.vy)+(this.vy-20));
    var rand = Math.random() < 0.5 ? -1 : 1;
    this.vx=randx *rand;
    rand = Math.random() < 0.5 ? -1 : 1;
    this.vy=randy* rand;
    this.reload = this.reloadTime;
    this.x = GamePong.width/2 - this.w/2;
    this.y = GamePong.height/2 - this.h/2;
    this.borrar=0;
}
Pelota_Flor.prototype = new SpritePong();
Pelota_Flor.prototype.type = OBJETO_PELOTA_FLOR;   
Pelota_Flor.prototype.step = function(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    this.borrar++;
    if(this.borrar >= 700) {
      this.board.add(new Explosionp(this.x, this.y));
      this.board.remove(this);
    }

    if(this.y < 0) { this.y = 0, this.vy = -this.vy; if(Music.extension){Music.pelota.pop4.Miplay()};}
    else if(this.y > GamePong.height - this.h) { 
        this.y = GamePong.height - this.h
        this.vy = -this.vy;
        if(Music.extension){Music.pelota.pop4.Miplay()};
        } 
    if(this.x < (0)) {
      this.x=0;
      this.vx=-this.vx;
      if(Music.extension){Music.pelota.pop4.Miplay()};
      if (this.vx<= this.maxVel){this.vx=this.vx*1.08};       
    }
	  else if(this.x > GamePong.width - this.w) {  
      this.vx=-this.vx;
      this.x= GamePong.width - this.w;
      if(Music.extension){Music.pelota.pop4.Miplay()};
	    if (this.vx<= this.maxVel){this.vx=this.vx*1.08};  
	  }

    var coll = this.board.collide(this,OBJETO_PALA1);
    var coll2 = this.board.collide(this,OBJETO_PALA2);
    if(coll || coll2) {
        var tablero = this.board;
        if (coll.sprite == "pala1A" || coll2.sprite =="pala2A" || coll2.sprite=="pala3A"){
          this.board.objects[0].maxVel=-this.board.objects[0].maxVel;
          if(Music.extension){Music.grito.Miplay()}
          setTimeout(function(){tablero.objects[0].maxVel=-tablero.objects[0].maxVel;},7000);
        }
        else if(coll.sprite == "pala1B" || coll2.sprite =="pala2B"|| coll2.sprite=="pala3B"){
          this.board.objects[3].maxVel=-this.board.objects[3].maxVel;
          if(Music.extension){Music.grito.Miplay()}
          setTimeout(function(){tablero.objects[3].maxVel=-tablero.objects[3].maxVel;},7000);
        };
        this.board.remove(this);
        
    }   
    
    collision = this.board.collide(this,OBJETO_PALAUX);
    if(collision) {
        if (this.vx<0){this.x = collision.x+collision.w}
        else{this.x=collision.x-this.w};
        this.vy = this.vy;
        this.vx = -this.vx;
        if(Music.extension){Music.pelota.pop5.Miplay()};
        if (this.vx<= this.maxVel){this.vx=this.vx*1.05};
    }
    
    collision = this.board.collide(this,OBJETO_GOKU);
    if(collision) {
        if (this.vx<0){this.x = collision.x+collision.w}
        else{this.x=collision.x-this.w};
        this.vy = -this.vy;
        this.vx = -this.vx;
        if(Music.extension){Music.goku.desvio.Miplay()};
        if (this.vx<= this.maxVel){this.vx=this.vx*1.08};
    }
}


////////////////////////////////////////////////////////////////////////////////////////// COMPLEMENTOS
var Goku = function(player,ox,oy){
    var cont=0;
    if(player==2){
      this.setup('Goku2', {vy:100,frame: 0, reloadTime: 0.25, maxVel: 300 });
      this.y = GamePong.height/2 - this.h/2;
      this.x = GamePong.width - 54 - this.w ;
    }else if (player==1){
      this.setup('Goku1', {vy:100,frame: 0, reloadTime: 0.25, maxVel: 300 });
      this.y = GamePong.height/2 - this.h/2;
      this.x = this.w;
    }
    else{
      this.setup('Goku2', {vy:100,frame: 0, reloadTime: 0.25, maxVel: 300 });
      this.x=ox - this.w/2;
      this.y=oy - this.h/2
      }
    this.reload = this.reloadTime;

    this.step = function(dt) {
	this.y += this.vy * dt;

	if(this.y < 0) { 
	  this.y = 0; 
	  cont++;
	  this.vy= -this.vy
	}
	else if(this.y > GamePong.height - this.h) { 
	    this.y = GamePong.height - this.h;
	    this.vy= -this.vy;
	}
  if (cont>5 && player!=0){
    this.board.remove(this);
  }
	this.reload-=dt;
  
    }

}
// Heredamos del prototipo new SpritePong()
Goku.prototype = new SpritePong();
Goku.prototype.type = OBJETO_GOKU;



var Corazon = function(ox, oy, ov){
    this.setup('corazon', {vy:60, frame: 0, reloadTime: 0.25});
    this.reload = this.reloadTime;
    this.y = oy;
  	this.x = ox;
  	if (ov==undefined) ov=1;

    this.step = function(dt) {

	  this.y -= this.vy * dt*ov;

	  if(this.y < 0) { 
	    this.board.remove(this);
	}
	this.reload-=dt;
    }
}
Corazon.prototype = new SpritePong();



var Snorlax = function(ox,oy){
    this.setup('snorlax', {frame: 0, reloadTime: 0.25});  
    this.reload = this.reloadTime;
    this.x=ox;
    this.y=oy; 	  	
  	this.borrar=0;
    this.step = function(dt) {  
    //Restricciones de movimiento de las palas al chocar con snorlax
    if (this.x==0 && this.board.objects[0].y > this.y-100 && this.board.objects[0].y < this.y+this.h/2){
        this.board.objects[0].y= this.y-100;
        this.board.objects[1].y= this.y-32;
        this.board.objects[2].y= this.y-132;
        if(Music.extension){Music.snorlax.Miplay()}
    }
    if (this.x==0 && this.board.objects[0].y < this.y +this.h +32 && this.board.objects[0].y > this.y+this.h/2){
        this.board.objects[0].y= this.y+this.h+32;
        this.board.objects[1].y= this.y+this.h+100;
        this.board.objects[2].y= this.y+this.h;
        if(Music.extension){Music.snorlax.Miplay()}
    }
    if (this.x==GamePong.width-this.w && this.board.objects[3].y > this.y-100 && this.board.objects[3].y < this.y+this.h/2){
        this.board.objects[3].y= this.y-100;
        this.board.objects[4].y= this.y-32;
        this.board.objects[5].y= this.y-132;
        if(Music.extension){Music.snorlax.Miplay()}
    }
    if (this.x==GamePong.width-this.w && this.board.objects[3].y < this.y +this.h +32 && this.board.objects[3].y > this.y+this.h/2){
        this.board.objects[3].y= this.y+this.h+32;
        this.board.objects[4].y= this.y+this.h+100;
        this.board.objects[5].y= this.y+this.h;
        if(Music.extension){Music.snorlax.Miplay()}
    }
    this.borrar++;
    if(this.borrar >= 300) {
      this.board.remove(this);
    }
	    this.reload-=dt;
    }
}
Snorlax.prototype = new SpritePong();
Snorlax.prototype.type = OBJETO_SNORLAX;



var Cetas = function(ox,oy){
    this.setup('cetas', {frame:0, reloadTime:0.25});
    this.y=oy;
    this.x=ox;
    this.subFrame = 0;
    this.step = function(dt) {
    this.frame = Math.floor(this.subFrame++ /75);
        if(this.subFrame >= 300) {
            this.board.remove(this);
        }
    }
}
Cetas.prototype = new SpritePong();



var Explosionp = function(centerX,centerY) {
    this.setup('explosion', { frame: 0 });      
    this.x = centerX - this.w/2;
    this.y = centerY - this.h/2;
    this.subFrame = 0;
}
Explosionp.prototype = new SpritePong();
Explosionp.prototype.step = function(dt) {
    this.frame = Math.floor(this.subFrame++ / 3);
    if(this.subFrame >= 36) {
	this.board.remove(this);
	if(Music.extension){Music.explosionp.Miplay()}
    }
}



var cajaMagica = function(ox,oy){
    this.setup('cajaMagica', {vy:50,frame: 0, reloadTime: 0.25});
    this.x=ox - this.w/2;
    this.y=oy - this.h/2
    this.reload = this.reloadTime;
    this.step = function(dt) {
      this.y += this.vy * dt;
      if(this.y < 0) { 
        this.y = 0; 
        this.vy= -this.vy
      }
      else if(this.y > GamePong.height - this.h) { 
          this.y = GamePong.height - this.h;
          this.vy= -this.vy;
      }
      this.reload-=dt;
    }
}
cajaMagica.prototype = new SpritePong();
cajaMagica.prototype.type = OBJETO_CAJAMAGICA;



var cajaMagica2 = function(ox,oy){
    this.setup('cajaMagica2', {vy:80,frame: 0, reloadTime: 0.25});
    this.x=ox - this.w/2;
    this.y=oy - this.h/2;  
    this.reload = this.reloadTime;
    this.step = function(dt) {
      this.y += this.vy * dt;
      if(this.y < 0) { 
        this.y = 0; 
        this.vy= -this.vy
      }
      else if(this.y > GamePong.height - this.h) { 
          this.y = GamePong.height - this.h;
          this.vy= -this.vy;
      }
      this.reload-=dt; 
    }
}
cajaMagica2.prototype = new SpritePong();
cajaMagica2.prototype.type = OBJETO_CAJAMAGICA;






var playGame1 = function() { 
    if(GamePong.mobile) {
        GamePong.setBoard(6,new TouchControlsGame());
      }

    if(!Music.menu.background.paused && Music.extension){
                  Music.menu.background.pause();
                  Music.menu.background.currentTime = 0};
    if(Music.niveles.background.paused && Music.extension){Music.niveles.background.Miplay()};


    GamePong.setBoard(4,new GamePointsPong(0));
    GamePong.setBoard(3,new RelojPong(false,GamePong.duracion));
    
    var board = new GamePongBoard();

    // PALAS DE JUGADORES             Si se modifica el orden de las palas se modifican las referencias.
    board.add(new Pala1PlayerA());
    board.add(new Pala2PlayerA());
    board.add(new Pala3PlayerA());
    board.add(new Pala1Maquina(40));
    board.add(new Pala2Maquina());
    board.add(new Pala3Maquina());
    
    if(Music.extension){Music.niveles.pitido.Miplay()};    //SONIDO: PITIDO INICIAL
 
    switch(GamePong.dificultad){ 
        case 1:
          board.add(new Pelota());
          break;
        
        case 2:
          board.add(new cajaMagica2(GamePong.width/2,0));
          board.add(new Pelota());
          break;
        case 3:
          board.objects[3].factor=30;
          board.add(new PalauxA());
          board.add(new PalauxB());
          board.add(new Pelota());
          break; 
        case 4:
          board.objects[3].factor=30;
          board.add(new Goku(0,GamePong.width/2,GamePong.height/2));
          board.add(new Pelota());
          break;
        case 5:
          board.objects[3].factor=30;
          board.add(new cajaMagica(GamePong.width/2,GamePong.height/2));
          board.add(new cajaMagica(GamePong.width/3,GamePong.height));
          board.add(new cajaMagica(2*GamePong.width/3,0));
          board.add(new Pelota());
          break;
        case 6:
          board.objects[3].factor=25;
          board.add(new Goku(0,3*GamePong.width/9,0));
          board.add(new Goku(0,7*GamePong.width/9,GamePong.height));
          board.add(new Pelota());
          break;       
        case 7:
          board.objects[3].factor=0;
          board.add(new Pelota());
          break;  
        case 8:
          board.objects[3].factor=30;
          board.add(new Goku(0,2*GamePong.width/9,0));
          board.add(new Goku(0,7*GamePong.width/9,GamePong.height));
          board.add(new cajaMagica2(GamePong.width/2,GamePong.height/2));
          board.add(new Pelota());
          break;

   }
    for (var i =0;i<GamePong.vidas;i++){
      board.add(new Corazon(GamePong.canvas.width-35 -35*i, GamePong.canvas.height-32,0));
    }
    GamePong.setBoard(2,board);
    
}


var nextLvl = function(){
    if(GamePong.mobile) {
        GamePong.setBoard(6,new TouchControlsMenu());
      }
    if (GamePong.dificultad<8){
      GamePong.dificultad++;
      GamePong.vidas++;
      if(Music.extension){Music.niveles.subir.Miplay()};    //SONIDO: subir nivel
      GamePong.setBoard(2,new TitleScreenPong("\u00a1\u00a1\u00a1Ganaste el nivel!!!", 
                                      "Aprieta espacio para pasar al siguiente!",
                                      playGame1));
    }else{
      if(Music.extension){Music.niveles.winner.Miplay()};    //SONIDO: juego ganado
      GamePong.setBoard(2,new TitleScreenPong("\u00a1\u00a1\u00a1Campeon!!! \u00a1\u00a1\u00a1Ganaste!!!", 
                                      "\u00c9ste es tu tiempo: "+(GamePong.duracion-1),
                                      playMenu));
        Meteor.call("matchFinish", Session.get("match_id"), Session.get("game_id"), GamePong.duracion-1);
        share();
    }
}


var endGame1 = function(){
    if(GamePong.mobile) {
        GamePong.setBoard(6,new TouchControlsMenu());
      }
    if (GamePong.vidas>0){
      GamePong.vidas--;
      if(Music.extension){Music.niveles.rewind.Miplay()}
      GamePong.setBoard(2,new TitleScreenPong("\u00a1\u00a1\u00a1Perdiste!!! Prueba otra vez...", 
                                      "Te quedan "+ (GamePong.vidas+1) + " intentos",
                                      playGame1));
    }else{
      if (GamePong.dificultad>1){
        GamePong.dificultad-- ;
        GamePong.vidas++;
        if(Music.extension){Music.niveles.bajar.Miplay()};    //SONIDO: bajar nivel
        GamePong.setBoard(2,new TitleScreenPong("\u00a1\u00a1\u00a1Perdiste!!!", 
                                        "Has bajado un nivel",
                                        playGame1));
      }else{
        if(Music.extension){Music.niveles.over.Miplay()};    //SONIDO: Fin del juego
        if(Music.extension){Music.niveles.aplauso.Miplay()}
        GamePong.setBoard(2,new TitleScreenPong("... \u00a1No pasas del nivel 1!", 
                                        "hay que jugar mas",
                                        playMenu));
      }
    }
}


var share = function() {
    $(".tweetbtn").html("<iframe allowtransparency='true' frameborder='0' scrolling='no'"+
                        "src='https://platform.twitter.com/widgets/tweet_button.html?text=He jugado a Alien Invasion en lowerlayers.meteor.com y he obtenido "+GameAlien.points+" puntos"+"'"+
                         "style='width:130px; height:20px;'></iframe>");                   
    $(".fbsharebtn").html("<iframe src='//www.facebook.com/plugins/like.php?href=https%3A%2F%2Flowerlayers.meteor.com&amp;width&amp;ref=hola&amp;layout=standard&amp;action=like&amp;show_faces=true&amp;share=true&amp;height=80' scrolling='no' frameborder='0' style='border:none; overflow:hidden; height:80px;' allowTransparency='true'></iframe>");
    $(".gsharebtn").html("<a href='https://plus.google.com/share?url=http://lowerlayers.meteor.com/' onclick='javascript:window.open(this.href,"+
                          "'', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');return false;'><img src='https://www.gstatic.com/images/icons/gplus-32.png' alt='Share on Google+'/></a>");
}








