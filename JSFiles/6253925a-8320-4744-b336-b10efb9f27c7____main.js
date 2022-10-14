//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                              //
//                                                     Supercat 2 Présente                                                      //
//                                                         " CatCreep "                                                         //
//                                                                                                                              //
//  Bonjour je suis " Cat " ,votre conseiller personnel pour vous guide dans se nouveaus Monde.                                 //
//  Aah quelles est beaux cette nouvelle Terre , de la pierre, de la boue , de la merde et auqu'une personne au alentour.       //
//  Quelles beauté !.?!.!!. Eee...h ? QUOIII ! vous aime pas ! oui, je trouve qu'on poureait faire quelque chose en plus.       //
//  Vous grand ro..EeeEeh...EeeEeh!!! Désole une boule de poils dans la gorge. vous chef de sette terre vous n'avait par tout   //
//  les pouvoir mais assee pour change quelque chose et moi je peux fair le reste si vous le voulez . ( 1% toi et 99% moi )     //
//  Pendant que je fait de la Pub Mensongèer pour mon Royaume Eeee..h ? non, notre Royaume pour attirer de la bleusaille qui a  //
//  moin de 16 ans, ce plus partique pour le mine d'énergie ....?  Quoi , oui c'est pas trop légal mais quel assistant social   //
//  viendrai dans ce trou paumé ? .!.!.!! Quoi, votre soeur ? me dit pas que vous avais un soeur qui est un assistant social ?  //
//  Ah!!! bon, il faudra que je modifie leur papier d'identité [-_-]. Revenons aux choses sériause !                            //
//                                                                                                                              //
//                                           V Attension a lire Absolument V                                                    //
//                                                                                                                              //
//  if faudra que vous faites deux trois petites choses pour moi, au moins on pourra dire que le chef a mis pate a la tâche.    //
//  Vous voyez le gros bouton qui est ecrit " Memory " en bas a gauche ? oui ! appuyer dessus ... BBBBOOOOOOOMMMMMMMM!!!!       //
//  Vous avez eu peur ?? Non !! j ai pris du temps pour fair cette blague [T_T].                                                //      
//  Puis dans la barre " add new memory " tout en bas, vous alles tape " cmd " puis faite " entre " et refait sa en ramplacen   //
//  " cmd " par " " rcl " .                                                                                                     //
//  Comme j'avais la flamme et que se ce des outil pour vous, j'ai pas envie de les fair!. Quoi !! vous voulez savoir se que sa //      
//  fait ? .!.?!.. Ah je vois que vous etes cultivé et que vous adore apprendre !! ( et merde T_T )                             //
//                                                                                                                              //
//  " CMD " ou " Commend " est l'outil pour obtenir des informations general sur le systeme (fait " Memory.cmd = 0 " dans       //
//    la console pour avoir le help)                                                                                            //
//                                                                                                                              //
//  " RCl " ou " Room Controleur level " est l'outil de construction rapide de base (fait " Memory.cmd = 10 " dans la console   //
//    pour plus d'informations)                                                                                                 //      
//                                                                                                                              //
//                                                                                                                              //
//                                                                                                                              //      
//                                                                                                                              //
//                                                                                                                              //
//                                                                                                                              //      
//                                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    
var roleOuvrier = require('role.ouvrier');
var roleOuvrier = require('role.specialiste');


module.exports.loop = function () {
    
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                            //                                                                               //
    for(var name in Memory.creeps) {        //      ce bout de code est tres important !                                     //
        if(!Game.creeps[name]) {            //      il nettoie la mémoire du programme d'un creep mort                       //
            delete Memory.creeps[name];     //                                                                               //
        }                                   //      Quand un creep meurt sa memoire n'est pas effacé !                       //
    }                                       //      avec un auto-spawn sa peux vite devenir bordélique.                      // 
                                            //                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                              //                             //
    var specialiste = _.filter(Game.creeps, (creep) => creep.memory.role == 'specialiste')
    var queens = _.filter(Game.creeps, (creep) => creep.memory.role == 'queen');
    
    var ouvriers = _.filter(Game.creeps, (creep) => creep.memory.role == 'ouvrier');          // se code premet de recuperer //
    var recolteurs = _.filter(Game.creeps, (creep) => creep.memory.sousrole == 'recolteur');  // des information dans la     //
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.sousrole == 'upgrader');    // mémore des creeps           //
    var construters = _.filter(Game.creeps, (creep) => creep.memory.sousrole == 'construter');//                             //
    var reparaters = _.filter(Game.creeps, (creep) => creep.memory.sousrole == 'reparater');  // Commet leur nombre en total //
                                                                                              //                             //    
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                           //
//                                      Création Automatique des creeps [ 2 Parties ]                                        //
//                                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                           //
//                                              [ Partie 1 ] Nombres et Module                                               //
//                                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    
    var SecuriteOuvriers = 10
    var SecuriteSpecialiste = 5
    var containereLuP = creep.room.find(FIND_STRUCTURES, {
                filter:(structure) => { 
                    return (structure.structureType == STRUCTURE_CONTAINER) }})
    
    var extension creep.room.find(FIND_STRUCTURES, {
                filter:(structure) => { 
                    return (structure.structureType == STRUCTURE_EXTENSION) }})
    
    
    if(ouvriers.length < SecuriteOuvriers || specialiste.length < SecuriteSpecialiste ) {                                            
        
        

                                                    
        var Nrecolteurs    = 4 ;                                           
        var Nupgraders     = 2 ;                                           
        var Nconstruters   = 3 ;                                           
        var Nreparaters    = 1 ;                                           
                                                                           
        var moduleRecolteurs   = [WORK,WORK,CARRY,MOVE] ;           // 300 //
        var moduleUpgraders    = [WORK,CARRY,CARRY,CARRY,MOVE] ;    // 300 //
        var moduleConstruters  = [WORK,WORK,CARRY,MOVE] ;           // 300 //
        var moduleReparaters   = [WORK,CARRY,MOVE] ;                // 200 //
        
        if (extension.length >= 5 ) {                                   // +250 // 550
            
            var moduleRecolteurs   = [WORK,WORK,CARRY,CARRY,MOVE,MOVE] ;            // 400 //
            var moduleUpgraders    = [WORK,CARRY,CARRY,CARRY,MOVE,MOVE] ;           // 350 //
            var moduleConstruters  = [WORK,WORK,CARRY,MOVE] ;                       // 300 //
            var moduleReparaters   = [WORK,CARRY,CARRY,CARRY,MOVE,MOVE] ;                            // 350 //
        
            
            
        }
        
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
        var Nqueen    = 1 ;
        
        var moduleQueen        = [CARRY,CARRY,MOVE] ;               // 200 //
        
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    }
        /////////////////////////////////////
        //                                 //
        //         Module | Energie        //
        //                                 //
        //           MOVE = 50             //
        //           WORK = 100            //
        //          CARRY = 50             //
        //         ATTACK = 80             //
        //  RANGED_ATTACK = 150            //
        //           HEAL = 250            //
        //          CLAIM = 600            //
        //          TOUGH = 10             //
        //                                 //
        /////////////////////////////////////
    
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                           //
//                                              [ Partie 2 ] l'Auto-Spawn                                                    //
//                                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
       
    if(ouvriers.length < SecuriteOuvriers ) {
    
        if (recolteurs.length < Nrecolteurs) {                  ///////////////////////////////////////////////////////////////
            var newName = 'recolteur' + Game.time;              //                                                           //
            var sousrole = 'recolteur';                         //  Premet de détecter le creeps manquant et obtenir les     //
            var workmodule = moduleRecolteurs                   //  dernières information pour le recrée                     //
        }                                                       //                                                           //
        else{                                                   ///////////////////////////////////////////////////////////////
            
            if (upgraders.length < Nupgraders) {
                var newName = 'upgrader' + Game.time;
                var sousrole = 'upgrader';
                var workmodule = moduleUpgraders
            }
            else {
                if (construters.length < Nconstruters) {
                    var newName = 'construter' + Game.time;
                    var sousrole = 'construter';
                    var workmodule = moduleConstruters
                }
                else {
                    if (reparaters.length < Nreparaters) {
                        var newName = 'reparater' + Game.time;
                        var sousrole = 'reparater';
                        var workmodule = moduleReparaters
                    }
                }
            }
        }
                
        Game.spawns['Spawn1'].spawnCreep( workmodule , newName, {memory: {role: 'ouvrier' ,sousrole: sousrole }  });
        
    }
    
    if (containereLuP == 1) {
        if(specialiste.length < SecuriteSpecialiste ) { 

            if (queens.length < Nqueen) {                  
                var newName = 'queen' + Game.time;              
                var sousrole = 'queen';                         
                var workmodule = moduleQueen                   
            } 


            Game.spawns['Spawn1'].spawnCreep( workmodule , newName, {memory: {role: 'specialiste' ,sousrole: sousrole }  });
        }
    }
        
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                                      //
//                                                         Le code de CMD                                                               //
//                                                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    
    if (Memory.cmd == 0) {
                                                                                                /////////////////////////////////////////
        for ( i = 0 ; i > 10 ; i++) {                                                           //                                     //
                                                                                                //  Premet de " nettoyer " la console  //
            console.log ()                                                                      //                                     //
                                                                                                /////////////////////////////////////////
        }
        
    console.log ('/////////////////////////////////////////////////////////////////////');      /////////////////////////////////////////
    console.log ('//                            CMD Help                             //');      //                                     //
    console.log ('//                                                                 //');      // L'aspect Graphique da la commande   //
    console.log ('//        1 = info sur les creep ouvrier                           //');      //                                     //
    console.log ('//                                                                 //');      /////////////////////////////////////////
    console.log ('//                                                                 //');
    console.log ('//                                                                 //');
    console.log ('//                                                                 //');
    console.log ('//                                                                 //');
    console.log ('//                                                                 //');
    console.log ('/////////////////////////////////////////////////////////////////////');
    Memory.cmd = 100 ;
        
        
    }
    
    if (Memory.cmd == 1 ) {
        
        for ( i = 0 ; i > 10 ; i++) {
            
            console.log ()
            
        }
        
        console.log ('///////////////////////');
        console.log ('// Ouvriers   = '+ ouvriers.length +'   //');       
        console.log ('///////////////////////');
        console.log ('// Recolteurs = '+ recolteurs.length +'    //');
        console.log ('// Upgrader   = '+ upgraders.length +'    //');
        console.log ('// Construter = '+ construters.length +'    //');
        console.log ('// Reparater  = '+ reparaters.length +'    //');
        console.log ('///////////////////////');
        Memory.cmd = 100 ;
    }
    if (Memory.cmd == 10) {
        
        for ( i = 0 ; i > 10 ; i++) {
            
            console.log ()
            
        }
        
        console.log ('')
        console.log ('')
        console.log ('')
        console.log ('')
        console.log ('')
        console.log ('')
        console.log ('')
        console.log ('')
        console.log ('')
        
    }
    
    
    
    if (Memory.cmd == 10) {
        
        for ( i = 0 ; i > 10 ; i++) {
            
            console.log ()
            
        }
        
        console.log ('///////////////////////////////////////////////////////////////////');
        console.log ('//   construstions Base Info     //         Description          //');         
        console.log ('//  0                       x    //                              //');
        console.log ('//   |R|E|E|T|R|S|R|T|E|E|R|     //   S = Spawn                  //');  
        console.log ('//   |E|R|E|E| |R| |E|E|R|E|     //   R = Route                  //');
        console.log ('//   |E|E|R|E|E|R|E|E|R|E|E|     //   E = Extension              //');
        console.log ('//   |T|E|E|R|E|R|E|R|E|E| |     //   T = Tower                  //');
        console.log ('//   |R| |E|E|R|E|R|E|E| |R|     //   O = Storage                //');
        console.log ('//   |O|R|R|R|E|S|E|R|R|R|M|     //   M = Marche                 //');
        console.log ('//   |R| |E|E|R|E|R|E|E| |R|     //                              //');
        console.log ('//   | |E|E|R|E|R|E|R|E|E|T|     //   X = site de construstion   //');
        console.log ('//   |E|E|R|E|E|R|E|E|R|E|E|     //            { INFO }          //');
        console.log ('//   |E|R|E|E| |R| |E|E|R|E|     //                              //');
        console.log ('//   |R|E|E|T|R|S|R|T|E|E|R|     //   Base de 11x11              //');
        console.log ('//  y                            //                              //');
        console.log ('///////////////////////////////////////////////////////////////////');
        console.log ('//                                                               //');
        console.log ('//      Fait 11 pour voir la premier étape de construction       //');
        console.log ('//                                                               //');
        console.log ('///////////////////////////////////////////////////////////////////');
        Memory.cmd = 100;
        
        
    }
    
    
    if (Memory.cmd == 11) {
        
        for ( i = 0 ; i > 10 ; i++) {
            
            console.log ()
            
        }
        
        console.log ('///////////////////////////////////////////////////////////////////'); 
        console.log ('//     construstions RCL 1       //         Description          //'); 
        console.log ('//                               //                              //');
        console.log ('//   |X| | | |X| |X| | | |X|     //   S = Spanw                  //');  
        console.log ('//   | |X| | | |X| | | |X| |     //                              //');
        console.log ('//   | | |X| | |X| | |X| | |     //                              //');
        console.log ('//   | | | |X| |X| |X| | | |     //                              //');
        console.log ('//   |X| | | |X| |X| | | |X|     //                              //');
        console.log ('//   | |X|X|X| |S| |X|X|X| |     //                              //');
        console.log ('//   |X| | | |X| |X| | | |X|     //                              //');
        console.log ('//   | | | |X| |X| |X| | | |     //   X = site de construstion   //');
        console.log ('//   | | |X| | |X| | |X| | |     //       { STRUCTURE_ROAD }     //');
        console.log ('//   | |X| | | |X| | | |X| |     //                              //');
        console.log ('//   |X| | | |X| | X | | |X|     //   Base de 11x11              //');
        console.log ('//                               //                              //');
        console.log ('///////////////////////////////////////////////////////////////////');
        console.log ('//                                                               //');
        console.log ('//      Pour confirmer et construire faite Memory.rcl = 1        //');
        console.log ('//                                                               //');
        console.log ('//      Fait 12 pour voir la Deuxième étape de construction      //');
        console.log ('//                                                               //');
        console.log ('///////////////////////////////////////////////////////////////////');
        Memory.cmd = 100;
        
        
    }
    if (Memory.cmd == 12) {
        
         for ( i = 0 ; i > 10 ; i++) {
            
            console.log ()
            
        }
        
        console.log ('///////////////////////////////////////////////////////////////////');
        console.log ('//     construstions RCL 2       //         Description          //');         
        console.log ('//  0                       x    //                              //');
        console.log ('//   |R| | | |R| |R| | | |R|     //   S = Spawn                  //');  
        console.log ('//   | |R| | | |R| | | |R| |     //   R = Route                  //');
        console.log ('//   | | |R| |X|R| | |R| | |     //                              //');
        console.log ('//   | | |X|R|X|R| |R| | | |     //                              //');
        console.log ('//   |R| |X|X|R| |R| | | |R|     //                              //');
        console.log ('//   | |R|R|R| |S| |R|R|R| |     //                              //');
        console.log ('//   |R| | | |R| |R| | | |R|     //                              //');
        console.log ('//   | | | |R| |R| |R| | | |     //   X = site de construstion   //');
        console.log ('//   | | |R| | |R| | |R| | |     //     { STRUCTURE_EXTENSION }  //');
        console.log ('//   | |R| | | |R| | | |R| |     //                              //');
        console.log ('//   |R| | | |R| |R| | | |R|     //   Base de 11x11              //');
        console.log ('//  y                            //                              //');
        console.log ('///////////////////////////////////////////////////////////////////');
        console.log ('//                                                               //');
        console.log ('//      Pour confirmer et construire faite Memory.rcl = 2        //');
        console.log ('//                                                               //');
        console.log ('//      Fait 13 pour voir la troisième étape de construction     //');
        console.log ('//                                                               //');
        console.log ('///////////////////////////////////////////////////////////////////');
        Memory.cmd = 100;
        
        
        
        
    }
    
    if (Memory.cmd == 13) {
        
         for ( i = 0 ; i > 10 ; i++) {
            
            console.log ()
            
        }
        
        console.log ('///////////////////////////////////////////////////////////////////');
        console.log ('//     construstions RCL 3       //         Description          //');         
        console.log ('//  0                       x    //                              //');
        console.log ('//   |R| | | |R| |R| | | |R|     //   S = Spawn                  //');  
        console.log ('//   | |R|X|X| |R| | | |R| |     //   R = Route                  //');
        console.log ('//   | |X|R|X|E|R| | |R| | |     //   E = Extension              //');
        console.log ('//   |X|X|E|R|E|R| |R| | | |     //                              //');
        console.log ('//   |R| |E|E|R| |R| | | |R|     //                              //');
        console.log ('//   | |R|R|R| |S| |R|R|R| |     //                              //');
        console.log ('//   |R| | | |R| |R| | | |R|     //   X = site de construstion   //');
        console.log ('//   | | | |R| |R| |R| | | |     //     { STRUCTURE_EXTENSION }  //');
        console.log ('//   | | |R| | |R| | |R| | |     //       { STRUCTURE_TOWER }    //');
        console.log ('//   | |R| | | |R| | | |R| |     //                              //');
        console.log ('//   |R| | | |R| |R| | | |R|     //   Base de 11x11              //');
        console.log ('//  y                            //                              //');
        console.log ('///////////////////////////////////////////////////////////////////');
        Memory.cmd = 100;
        
        
        
        
    }
    
    if (Memory.cmd == 13) {
        
         for ( i = 0 ; i > 10 ; i++) {
            
            console.log ()
            
        }
        
        console.log ('///////////////////////////////////////////////////////////////////');
        console.log ('//     construstions RCL 4       //         Description          //');         
        console.log ('//  0                       x    //                              //');
        console.log ('//   |R| | | |R| |R| | | |R|     //   S = Spawn                  //');  
        console.log ('//   | |R|E|E| |R| | | |R| |     //   R = Route                  //');
        console.log ('//   | |E|R|E|E|R| | |R| | |     //   E = Extension              //');
        console.log ('//   |T|E|E|R|E|R| |R| | | |     //   T = Tower                  //');
        console.log ('//   |R| |E|E|R| |R| | | |R|     //                              //');
        console.log ('//   | |R|R|R| |S| |R|R|R| |     //                              //');
        console.log ('//   |R| | | |R| |R| | | |R|     //   X = site de construstion   //');
        console.log ('//   | | | |R| |R| |R| | | |     //     { STRUCTURE_EXTENSION }  //');
        console.log ('//   | | |R| | |R| | |R| | |     //       { STRUCTURE_TOWER }    //');
        console.log ('//   | |R| | | |R| | | |R| |     //                              //');
        console.log ('//   |R| | | |R| |R| | | |R|     //   Base de 11x11              //');
        console.log ('//  y                            //                              //');
        console.log ('///////////////////////////////////////////////////////////////////');
        Memory.cmd = 100;
        
        
        
        
    }
        
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    var spawn = Game.spawns['Spawn1'].pos;
    var RoomsBuildBase = (spawn.roomName);
    var controlle = Game.rooms[RoomsBuildBase].controller.level;
    
    
    
    var Yspawn = (spawn.y);
    var Xspawn = (spawn.x);
    
   
  
    if(Memory.rcl == 1) {
        if(controlle >= 1) {
            
            
        var XspawnSave = Xspawn
        var YspawnSave = Yspawn
        
        
        for(var i = 0 ; i < 5 ; i++) {
            var Xspawn = Xspawn - 1 ;
            var Yspawn = Yspawn - 1 ;
            Game.rooms[RoomsBuildBase].createConstructionSite( Xspawn  , Yspawn , STRUCTURE_ROAD);
            
        }
    
        var Xspawn = XspawnSave
        var Yspawn = YspawnSave
        
        
        for(var i = 0 ; i < 5 ; i++) {
            var Xspawn = Xspawn + 1 ;
            var Yspawn = Yspawn + 1 ;
            Game.rooms[RoomsBuildBase].createConstructionSite( Xspawn  , Yspawn , STRUCTURE_ROAD);
            
        }
        
        var Xspawn = XspawnSave
        var Yspawn = YspawnSave
        
        for(var i = 0 ; i < 5 ; i++) {
            var Xspawn = Xspawn + 1 ;
            var Yspawn = Yspawn - 1 ;
            Game.rooms[RoomsBuildBase].createConstructionSite( Xspawn  , Yspawn , STRUCTURE_ROAD);
            
        }
        
        var Xspawn = XspawnSave
        var Yspawn = YspawnSave
        
        for(var i = 0 ; i < 5 ; i++) {
            var Xspawn = Xspawn - 1 ;
            var Yspawn = Yspawn + 1 ;
            Game.rooms[RoomsBuildBase].createConstructionSite( Xspawn  , Yspawn , STRUCTURE_ROAD);
            
        }
        
        var Xspawn = XspawnSave
        var Yspawn = YspawnSave
        
        var Xspawn = ( Xspawn + 1 )
        for(var i = 0 ; i < 3 ; i++) {
            var Xspawn = Xspawn + 1 ;
            Game.rooms[RoomsBuildBase].createConstructionSite( Xspawn  , Yspawn , STRUCTURE_ROAD);
            
        }
        
        var Xspawn = XspawnSave
        
        var Xspawn = ( Xspawn - 1 )
        for(var i = 0 ; i < 3 ; i++) {
            var Xspawn = Xspawn - 1 ;
            Game.rooms[RoomsBuildBase].createConstructionSite( Xspawn  , Yspawn , STRUCTURE_ROAD);
            
        }
        
        var Xspawn = XspawnSave
        
        var Yspawn = (Yspawn + 1)
        for(var i = 0 ; i < 3 ; i++) {
            var Yspawn = Yspawn + 1 ;
            Game.rooms[RoomsBuildBase].createConstructionSite( Xspawn  , Yspawn , STRUCTURE_ROAD);
            
        }
        
        var Yspawn = YspawnSave
        
        var Yspawn = (Yspawn - 1)
        for(var i = 0 ; i < 3 ; i++) {
            var Yspawn = Yspawn - 1 ;
            Game.rooms[RoomsBuildBase].createConstructionSite( Xspawn  , Yspawn , STRUCTURE_ROAD);
            
        }
        var Yspawn = YspawnSave
        var Xspawn = XspawnSave
        
        Game.rooms[RoomsBuildBase].createConstructionSite( (Xspawn - 5)  , (Yspawn + 1) , STRUCTURE_ROAD);
        Game.rooms[RoomsBuildBase].createConstructionSite( (Xspawn - 5)  , (Yspawn - 1) , STRUCTURE_ROAD);
        
        Game.rooms[RoomsBuildBase].createConstructionSite( (Xspawn + 5)  , (Yspawn + 1) , STRUCTURE_ROAD);
        Game.rooms[RoomsBuildBase].createConstructionSite( (Xspawn + 5)  , (Yspawn - 1) , STRUCTURE_ROAD);
        
        Game.rooms[RoomsBuildBase].createConstructionSite( (Xspawn + 1)  , (Yspawn + 5) , STRUCTURE_ROAD);
        Game.rooms[RoomsBuildBase].createConstructionSite( (Xspawn - 1)  , (Yspawn + 5) , STRUCTURE_ROAD);
        
        Game.rooms[RoomsBuildBase].createConstructionSite( (Xspawn + 1)  , (Yspawn - 5) , STRUCTURE_ROAD);
        Game.rooms[RoomsBuildBase].createConstructionSite( (Xspawn - 1)  , (Yspawn - 5) , STRUCTURE_ROAD);
        
        console.log ('//////////////////////////////')
        console.log ('//                          //')   
        console.log ('//    Placement Terminée    //')  
        console.log ('//                          //')
        console.log ('//////////////////////////////')
        Memory.rcl = 100
        }
        else {
            console.log ('controller level trop bas')
            Memory.rcl = 100
        }
    } 
    if(Memory.rcl == 2) { 
        if(controlle >= 2) {
            
            Game.rooms[RoomsBuildBase].createConstructionSite( (Xspawn - 2) , (Yspawn - 1) , STRUCTURE_EXTENSION);
            Game.rooms[RoomsBuildBase].createConstructionSite( (Xspawn - 1) , (Yspawn - 2) , STRUCTURE_EXTENSION);
            
            Game.rooms[RoomsBuildBase].createConstructionSite( (Xspawn - 3) , (Yspawn - 1) , STRUCTURE_EXTENSION);
            Game.rooms[RoomsBuildBase].createConstructionSite( (Xspawn - 1) , (Yspawn - 3) , STRUCTURE_EXTENSION);
            
            Game.rooms[RoomsBuildBase].createConstructionSite( (Xspawn - 3) , (Yspawn - 2) , STRUCTURE_EXTENSION);
            
            console.log ('//////////////////////////////')
            console.log ('//                          //')   
            console.log ('//    Placement Terminée    //')  
            console.log ('//                          //')
            console.log ('//////////////////////////////')
            Memory.rcl = 100
            
        }
        else {
            console.log ('controller level trop bas')
            Memory.rcl = 100
        }
        
    }
    if(Memory.rcl == 3) { 
        if(controlle >= 3) {
            
            Game.rooms[RoomsBuildBase].createConstructionSite( (Xspawn - 2) , (Yspawn - 3) , STRUCTURE_EXTENSION);
            Game.rooms[RoomsBuildBase].createConstructionSite( (Xspawn - 4) , (Yspawn - 2) , STRUCTURE_EXTENSION);
            
            Game.rooms[RoomsBuildBase].createConstructionSite( (Xspawn - 2) , (Yspawn - 4) , STRUCTURE_EXTENSION);
            Game.rooms[RoomsBuildBase].createConstructionSite( (Xspawn - 4) , (Yspawn - 3) , STRUCTURE_EXTENSION);
            
            Game.rooms[RoomsBuildBase].createConstructionSite( (Xspawn - 3) , (Yspawn - 4) , STRUCTURE_EXTENSION);
            Game.rooms[RoomsBuildBase].createConstructionSite( (Xspawn - 5) , (Yspawn - 3) , STRUCTURE_TOWER);
            
            console.log ('//////////////////////////////')
            console.log ('//                          //')   
            console.log ('//    Placement Terminée    //')  
            console.log ('//                          //')
            console.log ('//////////////////////////////')
            Memory.rcl = 100
            
        }
        else {
            console.log ('controller level trop bas')
            Memory.rcl = 100
        }
        
    }
    
    


   // var entrepro = Game.room.find(FIND_STRUCTURES, {filter:(structure) => { return (structure.structureType == STRUCTURE_SPAWN)}})








////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
    
        if(creep.memory.role == 'ouvrier') {
            roleOuvrier.run(creep);
        }
        if(creep.memory.role == 'specialiste') {
            roleSpecialiste.run(creep);
        }
       
    }




}