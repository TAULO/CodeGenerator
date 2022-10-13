var vaaController = ( function() {

    var themesURL = "http://192.168.2.9:7070/webcontent/fair/img/themes/"
    var imgDisplay;
    var videoDisplay;
    var audioSource;
    // OL,OR, CL, CR, CV
    var projectionSurfaceShortname;

    var themes = {
        default: {
            themeName: "default",
            fullscreen: "false",
            fileExtension: ".jpg",
        },
        Abstract: {
            themeName: "Abstract",
            fullscreen: "false",

            CV: {
                fileExtension: ".jpg"
            },
            CR: {
                fileExtension: ".jpg"
            },
            CL: {
                fileExtension: ".jpg"
            },
            OR: {
                fileExtension: ".jpg"
            },
            OL: {
                fileExtension: ".jpg"
            },
            music: {
                fileExtension: ".jpg"
            }
        },
        Asia: {
            themeName: "Asia",
            fullscreen: "false",

            CV: {
                fileExtension: ".jpg"
            },
            CR: {
                fileExtension: ".jpg"
            },
            CL: {
                fileExtension: ".jpg"
            },
            OR: {
                fileExtension: ".jpg"
            },
            OL: {
                fileExtension: ".jpg"
            },
            music: {
                fileExtension: ".jpg"
            }
        },
        Backstein:  {
            themeName:"Backstein",
            fullscreen: "false",

            CV: {
                fileExtension: ".jpg"
            },
            CR: {
                fileExtension: ".jpg"
            },
            CL: {
                fileExtension: ".jpg"
            },
            OR: {
                fileExtension: ".jpg"
            },
            OL: {
                fileExtension: ".jpg"
            },
            music: {
                fileExtension: ".mp3"
            }
        },
        Berge:  {
            themeName:"Berge",
            fullscreen: "true",

            CV: {
                fileExtension: ".mp4"
            },
            CR: {
                fileExtension: ".jpg"
            },
            CL: {
                fileExtension: ".jpg"
            },
            OR: {
                fileExtension: ".jpg"
            },
            OL: {
                fileExtension: ".jpg"
            },
            music: {
                fileExtension: ".mp3"
            }
        },
        Farbe:  {
            themeName:"Farbe",
            fullscreen: "false",
            CV: {
                fileExtension: ".jpg"
            },
            CR: {
                fileExtension: ".jpg"
            },
            CL: {
                fileExtension: ".jpg"
            },
            OR: {
                fileExtension: ".jpg"
            },
            OL: {
                fileExtension: ".jpg"
            },
            music: {
                fileExtension: ".mp3"
            }
        },
        Farbrauch:  {
            themeName:"Farbrauch",
            fullscreen: "false",

            CV: {
                fileExtension: ".jpg"
            },
            CR: {
                fileExtension: ".jpg"
            },
            CL: {
                fileExtension: ".jpg"
            },
            OR: {
                fileExtension: ".jpg"
            },
            OL: {
                fileExtension: ".jpg"
            },
            music: {
                fileExtension: ".mp3"
            }
        },
        Holz:  {
            themeName:"Holz",
            fullscreen: "false",
            CV: {
                fileExtension: ".jpg"
            },
            CR: {
                fileExtension: ".jpg"
            },
            CL: {
                fileExtension: ".jpg"
            },
            OR: {
                fileExtension: ".jpg"
            },
            OL: {
                fileExtension: ".jpg"
            },
            music: {
                fileExtension: ".mp3"
            }
        }
        ,Holzwand:  {
            themeName:"Holzwand",
            fullscreen: "false",

            CV: {
                fileExtension: ".jpg"
            },
            CR: {
                fileExtension: ".jpg"
            },
            CL: {
                fileExtension: ".jpg"
            },
            OR: {
                fileExtension: ".jpg"
            },
            OL: {
                fileExtension: ".jpg"
            },
            music: {
                fileExtension: ".mp3"
            }
        },
        Kaffee:  {
            themeName:"Kaffee",
            fullscreen: "false",
            CV: {
                fileExtension: ".jpg"
            },
            CR: {
                fileExtension: ".jpg"
            },
            CL: {
                fileExtension: ".jpg"
            },
            OR: {
                fileExtension: ".jpg"
            },
            OL: {
                fileExtension: ".jpg"
            },
            music: {
                fileExtension: ".mp3"
            }
        },
        Kaffeeingang:  {
            themeName:"Kaffeeingang",
            fullscreen: "false",

            CV: {
                fileExtension: ".jpg"
            },
            CR: {
                fileExtension: ".jpg"
            },
            CL: {
                fileExtension: ".jpg"
            },
            OR: {
                fileExtension: ".jpg"
            },
            OL: {
                fileExtension: ".jpg"
            },
            music: {
                fileExtension: ".mp3"
            }
        },
        Kamin:  {
            
            themeName:"Kamin",
            fullscreen: "false",
            CV: {
                fileExtension: ".jpg"
            },
            CR: {
                fileExtension: ".jpg"
            },
            CL: {
                fileExtension: ".jpg"
            },
            OR: {
                fileExtension: ".jpg"
            },
            OL: {
                fileExtension: ".jpg"
            },
            music: {
                fileExtension: ".mp3"
            }

        },
        Marmor:  {
            
            themeName:"Marmor",
            fullscreen: "false",
            CV: {
                fileExtension: ".jpg"
            },
            CR: {
                fileExtension: ".jpg"
            },
            CL: {
                fileExtension: ".jpg"
            },
            OR: {
                fileExtension: ".jpg"
            },
            OL: {
                fileExtension: ".jpg"
            },
            music: {
                fileExtension: ".mp3"
            }

        },
        Muster:  {
            
            themeName:"Muster",
            fullscreen: "false",
            CV: {
                fileExtension: ".jpg"
            },
            CR: {
                fileExtension: ".jpg"
            },
            CL: {
                fileExtension: ".jpg"
            },
            OR: {
                fileExtension: ".jpg"
            },
            OL: {
                fileExtension: ".jpg"
            },
            music: {
                fileExtension: ".mp3"
            }

        },
        Ornament:  {
            
            themeName:"Ornament",
            fullscreen: "false",
            CV: {
                fileExtension: ".jpg"
            },
            CR: {
                fileExtension: ".jpg"
            },
            CL: {
                fileExtension: ".jpg"
            },
            OR: {
                fileExtension: ".jpg"
            },
            OL: {
                fileExtension: ".jpg"
            },
            music: {
                fileExtension: ".mp3"
            }

        },
        Pflanze:  {
            
            themeName:"Pflanze",
            fullscreen: "false",
            CV: {
                fileExtension: ".jpg"
            },
            CR: {
                fileExtension: ".jpg"
            },
            CL: {
                fileExtension: ".jpg"
            },
            OR: {
                fileExtension: ".jpg"
            },
            OL: {
                fileExtension: ".jpg"
            },
            music: {
                fileExtension: ".mp3"
            }

        },
        Stein:  {
            
            themeName:"Stein",
            fullscreen: "false",
            CV: {
                fileExtension: ".jpg"
            },
            CR: {
                fileExtension: ".jpg"
            },
            CL: {
                fileExtension: ".jpg"
            },
            OR: {
                fileExtension: ".jpg"
            },
            OL: {
                fileExtension: ".jpg"
            },
            music: {
                fileExtension: ".mp3"
            }

        },
        Strand:  {
            
            themeName:"Strand",
            fullscreen: "true",
            CV: {
                fileExtension: ".mp4"
            },
            CR: {
                fileExtension: ".jpg"
            },
            CL: {
                fileExtension: ".jpg"
            },
            OR: {
                fileExtension: ".jpg"
            },
            OL: {
                fileExtension: ".jpg"
            },
            music: {
                fileExtension: ".mp3"
            }

        },
        Surfer:  {
            
            themeName:"Surfer",
            fullscreen: "false",
            CV: {
                fileExtension: ".jpg"
            },
            CR: {
                fileExtension: ".jpg"
            },
            CL: {
                fileExtension: ".jpg"
            },
            OR: {
                fileExtension: ".jpg"
            },
            OL: {
                fileExtension: ".jpg"
            },
            music: {
                fileExtension: ".mp3"
            }

        },
        Tinte:  {
            
            themeName:"Tinte",
            fullscreen: "false",
            CV: {
                fileExtension: ".jpg"
            },
            CR: {
                fileExtension: ".jpg"
            },
            CL: {
                fileExtension: ".jpg"
            },
            OR: {
                fileExtension: ".jpg"
            },
            OL: {
                fileExtension: ".jpg"
            },
            music: {
                fileExtension: ".mp3"
            }

        },
        Unterwasser:  {
            
            themeName:"Unterwasser",
            fullscreen: "false",
            CV: {
                fileExtension: ".jpg"
            },
            CR: {
                fileExtension: ".jpg"
            },
            CL: {
                fileExtension: ".jpg"
            },
            OR: {
                fileExtension: ".jpg"
            },
            OL: {
                fileExtension: ".jpg"
            },
            music: {
                fileExtension: ".mp3"
            }

        },
        Wald:  {
            
            themeName:"Wald",
            fullscreen: "false",
            CV: {
                fileExtension: ".jpg"
            },
            CR: {
                fileExtension: ".jpg"
            },
            CL: {
                fileExtension: ".jpg"
            },
            OR: {
                fileExtension: ".jpg"
            },
            OL: {
                fileExtension: ".jpg"
            },
            music: {
                fileExtension: ".mp3"
            }

        },
        blumen:  {
            themeName:"blumen",
            fullscreen: "true",
            CV: {
                fileExtension: ".mp4"
            },
            CR: {
                fileExtension: ".jpg"
            },
            CL: {
                fileExtension: ".jpg"
            },
            OR: {
                fileExtension: ".jpg"
            },
            OL: {
                fileExtension: ".jpg"
            },
            music: {
                fileExtension: ".mp3"
            }
        },
        Duene:  {
            
            themeName:"Duene",
            fullscreen: "false",
            CV: {
                fileExtension: ".jpg"
            },
            CR: {
                fileExtension: ".jpg"
            },
            CL: {
                fileExtension: ".jpg"
            },
            OR: {
                fileExtension: ".jpg"
            },
            OL: {
                fileExtension: ".jpg"
            },
            music: {
                fileExtension: ".mp3"
            }

        },
        Farn:  {
            
            themeName:"Farn",
            fullscreen: "false",
            CV: {
                fileExtension: ".jpg"
            },
            CR: {
                fileExtension: ".jpg"
            },
            CL: {
                fileExtension: ".jpg"
            },
            OR: {
                fileExtension: ".jpg"
            },
            OL: {
                fileExtension: ".jpg"
            },
            music: {
                fileExtension: ".mp3"
            }

        },
        Meer:  {
            
            themeName:"Meer",
            fullscreen: "false",
            CV: {
                fileExtension: ".jpg"
            },
            CR: {
                fileExtension: ".jpg"
            },
            CL: {
                fileExtension: ".jpg"
            },
            OR: {
                fileExtension: ".jpg"
            },
            OL: {
                fileExtension: ".jpg"
            },
            music: {
                fileExtension: ".mp3"
            }

        },
        Palme:  {
            
            themeName:"Palme",
            fullscreen: "false",
            CV: {
                fileExtension: ".jpg"
            },
            CR: {
                fileExtension: ".jpg"
            },
            CL: {
                fileExtension: ".jpg"
            },
            OR: {
                fileExtension: ".jpg"
            },
            OL: {
                fileExtension: ".jpg"
            },
            music: {
                fileExtension: ".mp3"
            }

        },
        Picasso:  {
            
            themeName:"Picasso",
            fullscreen: "false",
            CV: {
                fileExtension: ".jpg"
            },
            CR: {
                fileExtension: ".jpg"
            },
            CL: {
                fileExtension: ".jpg"
            },
            OR: {
                fileExtension: ".jpg"
            },
            OL: {
                fileExtension: ".jpg"
            },
            music: {
                fileExtension: ".mp3"
            }

        },
        Polygon:  {
            
            themeName:"Polygon",
            fullscreen: "false",
            CV: {
                fileExtension: ".jpg"
            },
            CR: {
                fileExtension: ".jpg"
            },
            CL: {
                fileExtension: ".jpg"
            },
            OR: {
                fileExtension: ".jpg"
            },
            OL: {
                fileExtension: ".jpg"
            },
            music: {
                fileExtension: ".mp3"
            }

        },
        Beton:  {
            
            themeName:"Beton",
            fullscreen: "false",
            CV: {
                fileExtension: ".jpg"
            },
            CR: {
                fileExtension: ".jpg"
            },
            CL: {
                fileExtension: ".jpg"
            },
            OR: {
                fileExtension: ".jpg"
            },
            OL: {
                fileExtension: ".jpg"
            },
            music: {
                fileExtension: ".mp3"
            }

        },
        Grünwald:  {
            
            themeName:"Grünwald",
            fullscreen: "false",
            CV: {
                fileExtension: ".jpg"
            },
            CR: {
                fileExtension: ".jpg"
            },
            CL: {
                fileExtension: ".jpg"
            },
            OR: {
                fileExtension: ".jpg"
            },
            OL: {
                fileExtension: ".jpg"
            },
            music: {
                fileExtension: ".mp3"
            }
        },
        Kamin:  {
            
            themeName:"Kamin",
            fullscreen: "false",
            CV: {
                fileExtension: ".jpg"
            },
            CR: {
                fileExtension: ".jpg"
            },
            CL: {
                fileExtension: ".jpg"
            },
            OR: {
                fileExtension: ".jpg"
            },
            OL: {
                fileExtension: ".jpg"
            },
            music: {
                fileExtension: ".mp3"
            }

        },
        
        
        Aquarium:  {
            
            themeName:"Aquarium",
            fullscreen: "true",
            CV: {
                fileExtension: ".mp4"
            },
            CR: {
                fileExtension: ".jpg"
            },
            CL: {
                fileExtension: ".jpg"
            },
            OR: {
                fileExtension: ".jpg"
            },
            OL: {
                fileExtension: ".jpg"
            },
            music: {
                fileExtension: ".mp3"
            }

        },
        Kaminfeuer:  {
            
            themeName:"Kaminfeuer",
            fullscreen: "true",
            CV: {
                fileExtension: ".mp4"
            },
            CR: {
                fileExtension: ".jpg"
            },
            CL: {
                fileExtension: ".jpg"
            },
            OR: {
                fileExtension: ".jpg"
            },
            OL: {
                fileExtension: ".jpg"
            },
            music: {
                fileExtension: ".mp3"
            }

        },
        Kuechenspezialisten:  {
            
            themeName:"Kuechenspezialisten",
            fullscreen: "true",
            CV: {
                fileExtension: ".mp4"
            },
            CR: {
                fileExtension: ".jpg"
            },
            CL: {
                fileExtension: ".jpg"
            },
            OR: {
                fileExtension: ".jpg"
            },
            OL: {
                fileExtension: ".jpg"
            },
            music: {
                fileExtension: ".mp3"
            }

        },
        Caminandes:  {
            
            themeName:"Caminandes",
            fullscreen: "true",
            CV: {
                fileExtension: ".mp4"
            },
            CR: {
                fileExtension: ".jpg"
            },
            CL: {
                fileExtension: ".jpg"
            },
            OR: {
                fileExtension: ".jpg"
            },
            OL: {
                fileExtension: ".jpg"
            },
            music: {
                fileExtension: ".mp3"
            }

        },
        Laundromat:  {
            
            themeName:"Laundromat",
            fullscreen: "true",
            CV: {
                fileExtension: ".mp4"
            },
            CR: {
                fileExtension: ".jpg"
            },
            CL: {
                fileExtension: ".jpg"
            },
            OR: {
                fileExtension: ".jpg"
            },
            OL: {
                fileExtension: ".jpg"
            },
            music: {
                fileExtension: ".mp3"
            }

        },
        
        
        

    }

    //Get the container for the theme image
    function setDisplay() {
        // console.log(window.location);
        
        imgDisplay = document.getElementById("sk_theme-img");
        videoDisplay = document.getElementById("sk_theme-video");
        
       
    }

    function getFileName(themeName) {
        // console.log(themes["halloween"].fileExtension);
        if (themes[themeName] !== undefined) {
            return themes[themeName].themeName + "_" + projectionSurfaceShortname + themes[themeName][projectionSurfaceShortname].fileExtension;
        } else {
            return themes["default"].themeName + "_" + projectionSurfaceShortname + themes["default"].fileExtension;

        }
    }

    function getFileExtension(themeName) {
        if (themes[themeName] !== undefined) {
            
            return themes[themeName][projectionSurfaceShortname].fileExtension;

        }
    }

    function isFullScreenTheme(themeName) {
        
        
        if (themes[themeName] != undefined) {
            if(themes[themeName].fullscreen != undefined) {

                if(themes[themeName].fullscreen == "false") {
                    return false;
                } else if (themes[themeName].fullscreen == "true") {
                    return true;
                }

            }
        }
    }

    function getThemeURL() {
        var urlstr = window.location.href;
        var r = /[^\/]*$/;
        //urlstr.replace(r, ''); // '/this/is/a/folder/'
        themesURL = urlstr.replace(r, '');
    }

    getThemeURL();
    setDisplay();

    return {
        publicVariable: 1,
        
        /**
         * @param {String} themeName 
         */
        setTheme: function(themeName) {

            $('#sk_theme-img').fadeOut();
            $('#sk_theme-video').fadeOut();
            
            var sources = videoDisplay.getElementsByTagName('source');
            sources[0].src = "";
            videoDisplay.load();

                if(themeName == "default") {
                    // $('#sk_theme-img').fadeIn();
                    imgDisplay.src= themesURL + "img/themes/" + themeName + "/" + "default.jpg";
                   
                } else{

                    // console.log("Surface Shortname: " +projectionSurfaceShortname);
                    if(isFullScreenTheme(themeName)) {
                        
                        if (projectionSurfaceShortname == "CV"){

                            
                            var fileExtension = getFileExtension(themeName);
                            
                            if (fileExtension == ".jpg" || fileExtension == ".png" || fileExtension == ".gif") {
        
                                imgDisplay.src= themesURL + "img/themes/" + themeName + "/" + getFileName(themeName);
                                this.showVideoBackground(false);
                                
                            } else if (fileExtension == ".mp4") {
        
                                var sources = videoDisplay.getElementsByTagName('source');
                                sources[0].src = themesURL + "img/themes/" + themeName + "/" + getFileName(themeName);
                                videoDisplay.load();
                                // videoDisplay.src = themesURL + "img/themes/" + themeName + "/" + getFileName(themeName);
                                this.showVideoBackground(true);
    
                            }

                        } else {
                           
                            // console.log("use default: "+ themesURL + "img/themes/" + "default" + "/" + "default.jpg");
                            
                            imgDisplay.src = themesURL + "img/themes/" + "default" + "/" + "default.jpg";
                        }

                    } else {
                        var fileExtension = getFileExtension(themeName);
                        
                        if (fileExtension == ".jpg" || fileExtension == ".png" || fileExtension == ".gif") {
    
                            imgDisplay.src= themesURL + "img/themes/" + themeName + "/" + getFileName(themeName);
                            this.showVideoBackground(false);
                            
                        } else if (fileExtension == ".mp4") {
    
                            var sources = videoDisplay.getElementsByTagName('source');
                            sources[0].src = themesURL + "img/themes/" + themeName + "/" + getFileName(themeName);
                            videoDisplay.load();
                            // videoDisplay.src = themesURL + "img/themes/" + themeName + "/" + getFileName(themeName);
                            this.showVideoBackground(true);

                        }
                    }
                    
                    
                }
         
            // $('#sk_theme-img').fadeIn();
            this.setAudio(themeName);

        },

        setAudio: function(themeName) {

            if (projectionSurfaceShortname == "OR") {
                console.log("Audio Player found");
                
                audioSource = document.getElementById("sk_theme-audio");
                
                if(themeName == "default") {
                    audioSource.src= "";
                } else{
                    if (themes[themeName].themeName + "_" + themes[themeName]['music'] !== undefined) {
                        
                        var fileExtension = themes[themeName]['music'].fileExtension;
                        
                        if (fileExtension == ".mp3" ) {
                            
                            audioSource.src= themesURL + "img/themes/" + themeName + "/" + themes[themeName].themeName + themes[themeName]['music'].fileExtension;
                            console.log("Set Audio");
                            
                            // audioSource.play();
                        } 
                    }
                }
            }
        },
            
            /**
         * For initialization the projector shortname is needed
         * @param {projectorShortname} string OR,OL, CL, CR, CV
         */
        init: function(projectorShortname) {
            projectionSurfaceShortname = projectorShortname;
        },

        /**
         * Show a surpise
         */
        showSurprise: function(number) {
            console.log("#### Surprise ####");
            if(document.getElementById('sk_surprise-img') != undefined) {
                document.getElementById('sk_surprise-img').src = "http://192.168.1.109:8080/patrick/cooking/img/surprises/" + number + ".png" ;

            }
            $('#surprisescreen-body').fadeIn();
           
        },

        hideSurprise: function() {
            $('#surprisescreen-body').fadeOut();
        },

        showVideoBackground: function(show) {
            if (show) {
                $('#sk_theme-img').fadeOut();
                setTimeout(function() {
                    $('#sk_theme-video').fadeIn();
                }, 1000);
                

            } else {
                $('#sk_theme-video').fadeOut();
                setTimeout(function() {
                    $('#sk_theme-img').fadeIn();
                }, 1000);
                //ToDo: end video
            }

        }


    };
})();