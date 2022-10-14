var getGoals;
var selectTab;
var risk;

function closeNav(){
		//alert("dismiss");
        	$("button.navbar-toggle").click();
     
		
	}

$(document).ready(function(){
    
    $('.faqsNav a').click(function(e) { 
        $('.faqsNav a').removeClass('active');
        $(e.target).addClass('active');
    });

  resizeContent();

    $(window).resize(function() {
        resizeContent();
    });


var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
    acc[i].onclick = function(){
        this.classList.toggle("active");
        this.nextElementSibling.classList.toggle("show");
  }
}    
  
    $(".goalReportData").hover(function(){
        
        $(".goalReportData #invest_withdraw").hide();
        $("#invest_withdraw",this).show();
        
    });
    
  /*
	$("#pay").click(function(){
		
		window.location.href = "Pricing";
	});*/
	
$(".logo a.tooltips span").click(function(){
	
	
	 window.location.href = "KnowUs";
});	

	$(".logo a.tooltips img").click(function(){
	
	
	 window.location.href = "/";
});	
	
	
$(".abc a").click(function(){

  var aid = $(this).attr("href");
    if(aid == "#settings"){
 $("#ii").css("left","-9%");
    }else{
        
         $("#ii").css("left","42%");
    }
   

    
});    
    

		$("#angle").click(function(){
		
	
		 $(".main").moveDown();
		
	});
	
    
//$(".wxt .storyBtn").click(function()
//{
//    
//    $(".wxt .storyBtn").removeClass("act");
//    $(this).addClass("act");
//    
//});
//  
//    
//$("#account .storyBtn").click(function()
//{
//    
//    $("#account .storyBtn").removeClass("act");
//    $(this).addClass("act");
//    
//});
//        
    
	
	

$(".FAQs").click(function (){
    
     window.location.href = "FAQs";
});


   
/*$("#login").click(function (){
    
     window.location.href = "YourStory";
 
});*/
       
    
/*$(".pricing").click(function (){
    
     window.location.href = "Pricing";
});*/
    
/*$(".getStarted").click(function (){
    
     window.location.href = "GoalSelection";
});
     */   
    
     
$(".yourMood").css("display","block");
$(".frogImage").css("display","none");      
  
    
$(function(){
  $('.slider .left').click(function(){
     
   var leftScroll = Math.abs(parseInt($('.photosInner').css('left')));
      
      
      
      if(leftScroll <= 0){
          $(".photosInner").animate({'left':'0'}, 'fast');
}else{
    
    $(".photosInner").animate({'left':'+=80'}, 'slow');
}
    
      
  

  });
    
      $('.slider .right').click(function(){
     

        
   var leftScroll = Math.abs(parseInt($('.photosInner').css('left')));
      
        
      
      if(leftScroll < 170){
           $(".photosInner").animate({'left':'-=80'}, 'slow');
}else{
    
    $(".photosInner").animate({'left':'0'}, 'fast');
}
  
 
          
  });
    
});    
    
	var pr;
     $(".selectMode a.tooltips button").hover(function(){
     
		pr = $(this).attr("profile");
     
    $(".selectMode a.tooltips span#"+pr).addClass("logoTip");
     
      $(".selectMode a.tooltips span#"+pr).show();
   
     
 }, function(){
         
$(".selectMode a.tooltips span#"+pr).hide();                      
                                 
     });
    
	
	
    /*Login Read More*/
    
	
	$(".navbar-brand #investory").hover(function(){
        $(".readMore.toolTip").addClass("show");
    });
    
    $(document).click(function() {
        $(".readMore.toolTip").removeClass("show");
         $(".goalReportData #invest_withdraw").hide(); 
    });
	
     $(".logo-icon,.logo").hover(function(){
     

     
    $(".logo a.tooltips span").addClass("logoTip");
     
      $(".logo a.tooltips span").show();
   
     
 }, function(){
         
         
         
           /*$(".logo a.tooltips span").hide();  */                    
                                 
                                 });

    $(document).click(function() {
        
        $(".logo a.tooltips span").hide(); 
         $(".goalReportData #invest_withdraw").hide(); 

    });
    var socialname,socianameHover;
	
	$(".socialIcons a > img").hover(function(){
		
		imgName = $(this).attr("id");
	
		switch(imgName){
				
			case 'fb': socianameHover = "fbHover";
				socialname= "fb";
				break;
				case 'twitter': socianameHover = "twitterHover";
				socialname= "twitter";
				break;
				case 'linkdin': socianameHover = "linkdinHover";
				socialname= "linkdin";
				break;
				case 'gp': socianameHover = "gpHover";
				socialname= "gp";
				break;
		}
		
		$(this).attr("src","images/social/"+socianameHover+".png");
		
	}, function(){
		
		$(this).attr("src","images/social/"+socialname+".png");
	});
	
/*Better Plan*/

 $(".how-it-works #Bp li").hover(function(){
     
  tipId  = $(this).attr("id");
     var tipData;
     
   
     switch(tipId){
             
        case 'bp1': return;
             break;
        
        case 'bp2': tipData ="Personalized call every month";   
             break;
             
        case 'bp3': tipData ="Online meeting twice a year";
             break;
             
     }
     
    $(".how-it-works a.tooltips #BpData").addClass("tipTop");
     
      $(".how-it-works a.tooltips #BpData").show();
    $(".how-it-works a.tooltips #BpData").html(tipData);
     
 }, function(){
           $(".how-it-works a.tooltips #BpData").hide();                      
                                 
                                 });
    
    
    /*Best Plan*/
    
     $(".how-it-works #Bstp li").hover(function(){
     
  tipId  = $(this).attr("id");
     var tipData;
     
   
     switch(tipId){
             
        case 'Bstp1': return;
             break;
        
        case 'Bstp2': tipData ="Helps track your every transaction and status";   
             break;
             
        case 'Bstp3': tipData ="Tells you how much investment you have in each industry";
             break;
             
              case 'Bstp4': tipData ="Monitors your balance of debt and equity";
             break;
        
        case 'Bstp5': tipData ="Tells you how much investment you have in each fund";   
             break;
             
        case 'Bstp6': tipData ="Market analytics and insights from our team of experts";
             break;
                case 'Bstp7': tipData ="New and old product research to stay up to date";   
             break;
             
        case 'Bstp8': tipData ="Quick reports on world events like Brexit, Union budget, Elections etc";
             break;
             
     }
     
    $(".how-it-works a.tooltips #BstpData").addClass("tipTop");
     
      $(".how-it-works a.tooltips #BstpData").show();
    $(".how-it-works a.tooltips #BstpData").html(tipData);
     
 }, function(){
           $(".how-it-works a.tooltips #BstpData").hide();                      
                                 
                                 });
    
        
    /*Good Plan*/
    
     $(".how-it-works #Gp li").hover(function(){
     
  tipId  = $(this).attr("id");
     var tipData;
     
   
     switch(tipId){
             
        case 'Gp1': tipData ="Helps track your target goals and achievement";
             break;
        
        case 'Gp2': tipData ="Tells you where your money stands";   
             break;
             
        case 'Gp3': tipData ="Tells you if you have to pay tax on gains";
             break;
             
              case 'Gp4': tipData ="Our take on market news";
             break;
        
             
     }
     
    $(".how-it-works a.tooltips #GpData").addClass("tipTop");
     
      $(".how-it-works a.tooltips #GpData").show();
    $(".how-it-works a.tooltips #GpData").html(tipData);
     
 }, function(){
           $(".how-it-works a.tooltips #GpData").hide();                      
                                 
                                 });
    
    
    
var $imgLink = "images/";
var $imgExtension = ".png";
var $onHover = "Hover";
var $Feeling = "Feeling";
var $moodImageDisplay = true;
 var moodId;  
var frogMood="";
var $loggedIn;
    
var moodFile;
   

//Goals
var $GoalimgLink = "images/goals/"; 
    
var Rich = ["Crorepati", "Fancy Car", "Double the money"];

var Broke = ["Emergency", "Medical Corpus", "Splurging"];
    
var Responsible = ["Childs Education", "Retirement", "Home"];

var Nerdy = ["Education", "Gadget", "Build a book collection"];
    
var Social = ["Holiday", "World Cup", "Concert", "Course"];
    //, "Fitness"
    
var Loved = ["Marriage", "Honeymoon", "Anniversary Gifts"];

    
    

    

	function moodColorChange(moods){
		
		    var cirColor;

    
     switch(moods){
                
            case "Broke": 
                
                 cirColor = "#fc7a54";
                break;
                
             case "Nerdy": 
               
                cirColor = "#5a96d8";
                break;
                
             case "Rich": 
              
               cirColor = "#71b5ec";
                break;
                
             case "Responsible": 
               
                 cirColor = "#bc4b62";
                break;
                
            case "Loved": 
               
                cirColor = "#764a84";
                break;
                
            case "Social": 
               
                 cirColor = "#3a785e";
                break;
                
        }
    
		return cirColor;
	}
	
//Home Page Moods Selection    
$(".feelingCircularMenu ul li").mouseenter(function(){
  
     moodId = $(this).attr("id");
    
    var moodImgName = moodId;
    
circleColor = 	moodColorChange(moodId);

   $.ColorFill(circleColor);  


    
    if($moodImageDisplay){
          $moodImageDisplay = false;
        $(".yourMood").css("display","none");
        $(".frogImage").css("display","block");
        
    }
    
          $(".feelingCircularMenu ul li").css("border-bottom","2px solid rgba(53, 191, 211, 0)");
             $(".feelingCircularMenu ul li a").css("color","#333");
    
      $(this).css("border-bottom","2px solid #35BFD3");
             $("a", this).css("color","#35BFD3");
    
   
    $("#homeCircleImg img").attr("src", $imgLink+moodImgName+$imgExtension);
    
    $("#homeCircleImg h1").html($Feeling+" "+moodId);
    
});    
    
    
    $(".feelingCircularMenu ul li, .photosInner .change").click(function(){
  

    
    moodId = $(this).attr("id");
    
    var moodImgName = moodId;
    
    $("#homeCircleImg img").attr("src", $imgLink+moodImgName+$imgExtension);
    
    $("#homeCircleImg h1").html($Feeling+" "+moodId);
    
});    
   
    
$(".moods .pagination li:nth-child(1) a").css({"background-color":"#FFDE15","color":"#35BFD3","border-color":"#FFDE15"});
//
//    $(".frogImageMoods img").attr("src", $imgLink+frogMood+$imgExtension);

    $("#homeCircleImg img, #homeCircleImg h1,#homeCircleImg p, .feelingCircularMenu ul li").click(function(){
        
        frogMood=moodId;
         window.location.href = "GoalSelection?mood="+frogMood;
            
    $(".moods .pagination li:nth-child(1) a").css({"background-color":"#FFDE15","color":"#35BFD3","border-color":"#FFDE15"});
        //setFrogMood(frogMood);
    });
    
    
    getGoals = function (moods){
        var local=[]; 
        switch(moods){
            case "Broke": 
                
                local=Broke.slice(0);
                break;
                
             case "Nerdy": 
               
                local=Nerdy.slice(0);
                break;
                
             case "Rich": 
               
                local=Rich.slice(0);
                break;
                
             case "Responsible": 
               
                 local=Responsible.slice(0);
                break;
                
            case "Loved": 
               
                local=Loved.slice(0);
                break;
                
            case "Social": 
               
                local=Social.slice(0);
                break;       
        }
		return local;	
	};
   

    
    $(".selectGoal ul li > a").click(function(){
        
       
            moodId = $(this).attr("id");
	
      var   goalId = $(this).attr("goal");
 	 window.location.href = "/GoalSelection?mood="+moodId+"&goal="+goalId;
		
    var moodImgName = moodId;
    
    $(".frogImageMoods img").attr("src", $imgLink+moodImgName+$imgExtension);
    
    $(".frogImageMoods h1").html($Feeling+" "+moodId);
        
         
        
       
    
          var local;
		local = getGoals(moodId);
		
         $(".below").empty();
        
        for(i=local.length-1; i>= 0; i--){
            if(i==goalId){
           
                $(".below").prepend("<div class='goal' id='activ'><img src='"+$GoalimgLink+moodId+"/"+local[i]+$onHover+$imgExtension+"' mood="+moodId+" alt='Home view'><p id='mood'><span style='background-color: #FFDE15'></span>"+local[i]+"</p></div>");
                
               moodFile =  local[i]; 
               
            }else{
                
    $(".below").prepend("<div class='goal' id=''><img src='"+$GoalimgLink+moodId+"/"+local[i]+$imgExtension+"' mood="+moodId+" alt='Home view'><p id='mood'><span></span>"+local[i]+"</p></div>");
}
            
        }
        
        
        
    });
   
      
    $(".selectMood ul li > a").click(function(){
        
     
            moodId = $(this).attr("id");
   window.location.href = "/GoalSelection?mood="+moodId;
    var moodImgName = moodId;
    
    $(".frogImageMoods img").attr("src", $imgLink+moodImgName+$imgExtension);
    
    $(".frogImageMoods h1").html($Feeling+" "+moodId);
        
        
        
          var local;
		local = getGoals(moodId);
		
         $(".below").empty();
        
        for(i=local.length-1; i>= 0; i--){
            
    $(".below").prepend("<div class='goal' id=''><img src='"+$GoalimgLink+moodId+"/"+local[i]+$imgExtension+"' mood="+moodId+" alt='Home view'><p id='mood'><span></span>"+local[i]+"</p></div>");
        }
        
        
    });
    

        // Parse the URL
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var source = getParameterByName('mood');
var sourceGoal = getParameterByName('goal');
if ( source != "" && sourceGoal != "" ) {
    $('.page1 .next').removeAttr('disabled');
}


	
	/*if(source && sourceGoal){
		
		          var local;
		local = getGoals(source);
		
         $(".below").empty();
        
        for(i=local.length-1; i>= 0; i--){
            if(i==sourceGoal){
        
                $(".below").prepend("<div class='goal' id='activ'><img src='"+$GoalimgLink+source+"/"+local[i]+$onHover+$imgExtension+"' mood="+source+" alt='Home view'><p id='mood'><span style='background-color: #FFDE15'></span>"+local[i]+"</p></div>");
                
             
                
            }else{
                
    $(".below").prepend("<div class='goal' id=''><img src='"+$GoalimgLink+source+"/"+local[i]+$imgExtension+"' mood="+source+" alt='Home view'><p id='mood'><span></span>"+local[i]+"</p></div>");
}
            
        }
	}
   */
	
	var moodsss="";
        if(source){
          
             $("#setMood").attr("src", $imgLink+source+$imgExtension);
          $("#setMoodText").html($Feeling+" "+source);
	moodsss=source;
            
      
          var local;
		local = getGoals(source);
        
         $(".below").empty();
        
        for(i=local.length-1; i>= 0; i--){
            
			
			if(sourceGoal && i==sourceGoal){
           	
                $(".below").prepend("<div class='goal' id='activ'><img src='"+$GoalimgLink+source+"/"+local[i]+$onHover+$imgExtension+"' mood="+source+" alt='Home view'><p id='mood'><span style='background-color: #FFDE15'></span>"+local[i]+"</p></div>");
                
             
                
            }else{
                
  
               $(".below").prepend("<div class='goal' id=''><img src='"+$GoalimgLink+source+"/"+local[i]+$imgExtension+"' mood="+source+" alt='Home view'><p id='mood'><span></span>"+local[i]+"</p></div>");
}
			
        }
        
            
        }else{
            
            $("#setMood").attr("src", $imgLink+"Rich"+$imgExtension);
          $("#setMoodText").html($Feeling+" "+"Rich"); 
			 moodsss="Rich";
			
        }
        

    
function setFrogMood(mood){
    
    var frogMoodImgName = mood.toUpperCase();
    $("#setMood").attr("src", $imgLink+frogMoodImgName+$imgExtension);
          $("#setMoodText").html($Feeling+" "+frogMoodImgName);
	moodsss=frogMoodImgName;
}
    
//Moods 
  
$(".moods .slider .change").click(function () {

    once = true;
    var moodId = $(this).attr("id");
    // window.location.href = "/GoalSelection?mood=" + moodId;
    var moodImgName = moodId.toUpperCase();

    var local;
    local = getGoals(moodId);

    $(".frogImageMoods img").attr("src", $imgLink + moodImgName + $imgExtension);

    $(".frogImageMoods h1").html($Feeling + " " + moodId);

    $(".below").empty();

    for (i = 0; i < local.length; i++) {

        $(".below").append("<div class='goal' id=''><img src='" + $GoalimgLink + moodId + "/" + local[i] + $imgExtension + "' mood=" + moodId + " alt='Home view'><p id='mood'><span></span>" + local[i] + "</p></div>");
    }
    $('#amount').val('');
    $('#time').val('');
    selectTab(1);
    sessionStorage.clear();
});    
  
    
    
//What We offer    
    
var $emergencyFunds = "emergencyFunds"; 
var $taxSavings = "taxSavings";
var $buildWealth = "buildWealth";
var $smartGoals = "smartGoals";
    
     var smartSource = getParameterByName('smartGoal');
    var smartMood = getParameterByName('smood');
        if(smartSource){
              
             $("#setMood").attr("src", $imgLink+smartSource+"Mood"+$imgExtension);
			moodsss= smartSource+"Mood";
         $("#setMoodText").html(" ");
			
            $(".moods .slider").hide();
            
             var local; 
    
        switch(smartSource){
                
            case "emergencyFunds": 
               
                local="Emergency";
                break;
                
             case "taxSavings": 
               
                local="Tax Saving";
                break;
                
             case "buildWealth": 
               
                local="Crorepati";
                break;
                
             case "smartGoals": 
               
                local="Retirement";
                break;
                
                
        }
        

        
         $(".below").empty();
        
       
               $(".below").prepend("<div class='goal' id=''><img src='"+$GoalimgLink+smartMood+"/"+local+$imgExtension+"' mood="+smartMood+" alt='Home view'><p id='mood'><span></span>"+local+"</p></div>");
        
        
            
        }
    

        $(".emergency-funds").click(function () {
            var sipMood = $(this).children('p').attr("id");
            window.location.href = "GoalSelection?smartGoal=" + $emergencyFunds + "&smood=" + sipMood;

        });


        $(".tax-savings").click(function () {

            var sipMood = $(this).children('p').attr("id");
            window.location.href = "GoalSelection?smartGoal=" + $taxSavings + "&smood=" + sipMood;

        });


        $(".build-wealth").click(function () {

            var sipMood = $(this).children('p').attr("id");
            window.location.href = "GoalSelection?smartGoal=" + $buildWealth + "&smood=" + sipMood;

        });


        $(".smart-goals").click(function () {
            var sipMood = $(this).children('p').attr("id");
            window.location.href = "GoalSelection?smartGoal=" + $smartGoals + "&smood=" + sipMood;
        });
    
    // $(".emergency-funds > img")
    //     .on
    // ({
        
    //     mouseenter: function() 
    //     {
    //         $(this).attr("src", $imgLink+$emergencyFunds+$onHover+$imgExtension);
    //     }, 
        
    //     mouseleave: function()
    //     {
    //         $(this).attr("src", $imgLink+$emergencyFunds+$imgExtension);
    //     }, 
        
    //     click: function()
    //     {
    //          var sipMood = $(this).attr("id");
    //          window.location.href = "GoalSelection?smartGoal="+$emergencyFunds+"&smood="+sipMood;
         
    //     }
          
          
    // });
    
    // $(".tax-savings > img")
    //     .on
    // ({
    //     mouseenter: function() 
    //     {
    //         debugger;
    //         $(this).attr("src", $imgLink+$taxSavings+$onHover+$imgExtension);
    //     },         
    //     mouseleave: function()
    //     {
    //         $(this).attr("src", $imgLink+$taxSavings+$imgExtension);
    //     }, 
        
    //     click: function()
    //     {
    //          var sipMood = $(this).attr("id");
    //          window.location.href = "GoalSelection?smartGoal="+$taxSavings+"&smood="+sipMood;
         
    //     }
          
    // });
    
        
    // $(".build-wealth > img")
    //     .on
    // ({
        
    //     mouseenter: function() 
    //     {
    //         $(this).attr("src", $imgLink+$buildWealth+$onHover+$imgExtension);
    //     },         
    //     mouseleave: function()
    //     {
    //         $(this).attr("src", $imgLink+$buildWealth+$imgExtension);
    //     }, 
        
    //     click: function()
    //     {
    //          var sipMood = $(this).attr("id");
    //          window.location.href = "GoalSelection?smartGoal="+$buildWealth+"&smood="+sipMood;
         
    //     }
          
    // });
    
    // $(".smart-goals > img")
    //     .on
    // ({
        
    //     mouseenter: function() 
    //     {
    //         $(this).attr("src", $imgLink+$smartGoals+$onHover+$imgExtension);
    //     },         
    //     mouseleave: function()
    //     {
    //         $(this).attr("src", $imgLink+$smartGoals+$imgExtension);
    //     }, 
        
    //     click: function()
    //     {
    //          var sipMood = $(this).attr("id");
    //          window.location.href = "GoalSelection?smartGoal="+$smartGoals+"&smood="+sipMood;
         
    //     }
          
    // });

    
   $(".how-it-works .panel").click(function(){ 
   
        
        $(".panel-heading").css("background-color","#35BFD3");
        $(".panel-heading h2").css("color","#FFFFFF");
       $(".panel-heading .pDot").css("border","2px #FFFFFF solid");
       $(".panel-body ul, .panel-body h2").css("color","#333333");
       
       
         $(".panel-body ul, .panel-body h2",this).css("color","#35BFD3");
        $(".panel-heading",this).css("background-color","#FFDE15");
       $(".panel-heading h2",this).css("color","#35BFD3");
       $(".panel-heading .pDot",this).css("border","2px #35BFD3 solid");
     
   });
    
       $(".how-it-works .panel").mouseenter(function(){ 
   
        
        $(".panel-heading").css("background-color","#35BFD3");
        $(".panel-heading h2").css("color","#FFFFFF");
       $(".panel-heading .pDot").css("border","2px #FFFFFF solid");
       $(".panel-body ul, .panel-body h2").css("color","#333333");
       
       
         $(".panel-body ul, .panel-body h2",this).css("color","#35BFD3");
        $(".panel-heading",this).css("background-color","#FFDE15");
       $(".panel-heading h2",this).css("color","#35BFD3");
       $(".panel-heading .pDot",this).css("border","2px #35BFD3 solid");
     
   });
    
    String.prototype.filename=function(extension){
    var s= this.replace(/\\/g, '/');
    s= s.substring(s.lastIndexOf('/')+ 1);
    return extension? s.replace(/[?#].+$/, ''): s.split('.')[0];
}
    

    $(document).on("click", '.below .goal', function () {
        $(this).attr("id", "activ");
        $("#mood span").css("background-color", "#FFFFFF");
        $("#mood span", this).css("background-color", "#FFDE15");
        moodFile = $("#mood", this).text();
        goalName(moodFile);
        $('.page1 .next').removeAttr('disabled');
        if(!loggedIn) {
            var goal = moodFile;
            goal.substr(goal);
            goal = goal.substr(goal);
            var mood = $('.frogImageMoods #setMood').attr('src');
            var moodText = $('.frogImageMoods #setMoodText').html();
            moodText = moodText.substring(moodText.indexOf(" ") + 1);
            sessionStorage.setItem('tempGoals', JSON.stringify({"goal": goal, "mood": mood, "moodText": moodText}));
            console.log(sessionStorage.getItem("tempGoals"));
        }
    });

    var currentMood;

    $(document).on("mouseenter", '.below .goal', function () {

        //          $("#mood span").css("background-color","#FFFFFF");
        //        
        //        $("#mood span",this).css("background-color","#FFDE15");

        var clickActive = $(this).attr("id");
         
         
         
         if(clickActive == "activ"){
             
}else{

         var goalImg = $("#mood",this).text(); 
      currentMood = $("img", this).attr("mood");
        var currentImg =  $("img", this).attr("src");
        $("img", this).attr("src",   $GoalimgLink+currentMood+"/"+goalImg+$onHover+$imgExtension);     
}
        
     });
    
    var currentPage=1;
var movingTo= 0;

         $(document).on("mouseleave", '.below .goal',function(){
        
//              $("#mood span",this).css("background-color","#FFFFFF");
        
      var clickActive = $(this).attr("id");
         
         if(clickActive == "activ"){
}else{

         var goalImg = $("#mood",this).text(); 
     currentMood = $("img", this).attr("mood");
        var currentImg =  $("img", this).attr("src");
          
        $("img", this).attr("src",   $GoalimgLink+currentMood+"/"+goalImg+$imgExtension);
}

        
          
     });
    


 $(".contentMood .page2, #Indicator,#rpText, #riskSelected, #yp, .contentMood .page3, .page3Sub, .contentMood .page4, .contentMood .page5, .contentMood .page6, #IndicatorNew").hide();
    

    

    
    $(".page1 .next, .page1 .skip").click(function(){ 
        
        selectTab(2);

    });
    $(".page2 .next").click(function() { 
        if( $('#invest').html() >= 1000 ) {
            selectTab(4);
        }
            
    });
    $(".page2 .go").click(function(){ 
        if(  $('#time').val() <= 50 && $('#time').val() >= 1 ) {
            setProfile(0,1,0);
            selectTab(3);
            $(".page2VldMsg2").slideUp();
        } else {
            $(".page2VldMsg2").slideDown();
        }
    });

    $(".page4 .selectMode button, .sub-page4 .done").not('#dontKnow').click( function() { selectTab(5, this) });
    $(".contentMood #sip").css({"color": "black","font-size":"1.2em"});
    var once = true;
    selectTab = function(tabNo, e) {
        currentPage = tabNo;
        var tempGoals = JSON.parse(sessionStorage.getItem('tempGoals'));
        if(tempGoals) {
            tempGoals.currentPage = currentPage;
        }
        sessionStorage.setItem('tempGoals', JSON.stringify(tempGoals));
        $('.pagination li a').removeClass('active');
        $('.pagination li a').removeClass('done');
        $('#Indicator span').removeClass('active');
        $('#Indicator').show();
        switch (tabNo) {
            case 1:
                $('.pagination li:nth-child(1) a').addClass('active');
                $('.contentMood > div').not('.page1').hide();
                $('.contentMood .page1').show();
                break;

            case 2:
                $('#Indicator span:nth-child(1)').addClass('active');
                $('.pagination li:nth-child(1) a').addClass('done');
                $('.pagination li:nth-child(2) a').addClass('active');

                $('.contentMood > div').not('.page2').hide();
                $('.contentMood .page2').show();
                $(".contentMood .page1, #btm").hide();
                $(".moods .pagination li:nth-child(1) a").css({"background-color":"#FFFFFF","color":"#FFDE15","border-color":"#FFDE15"});
                $(".pagination li:nth-child(2) a").css({"background-color":"#FFDE15","color":"#35BFD3","border-color":"#FFDE15"});
                $("#goalSelected").text(moodFile);
                $(".contentMood .page2, #Indicator").show();
                $(".contentMood .page2 .login-btn").css("top","65%"); 
                break;

            case 3:
                currentPage = 3;
                $('#Indicator span:nth-child(1), #Indicator span:nth-child(2)').addClass('active');
                $('.pagination li:nth-child(1) a').addClass('done');
                $('.pagination li:nth-child(2) a').addClass('active');
                $('.contentMood > div').not('.page3, .page2').hide();
                $('.contentMood .page2, .contentMood .page3').show();        
                $(".contentMood .page2 .login-btn").css("top", "15%");
                $(".contentMood .page3, .page3Sub, #rpText").show();

                if (once) {
                    $('.contentMood > div').not('.page2, .page3').hide();
                    $("#displayModal").modal("show");
                    $(".contentMood .page3, .page3Sub, #rpText").show();
                    $(".pagination li:nth-child(2) a").css({ "background-color": "#FFFFFF", "color": "#FFDE15", "border-color": "#FFDE15" });
                    $(".pagination li:nth-child(3) a").css({ "background-color": "#FFDE15", "color": "#35BFD3", "border-color": "#FFDE15" });    
                    $(".page2 .dotHr").hide();
                    $(".contentMood .page3> p").css("color", "#35BFD3");
                    $('.contentMood .page2, .contentMood .page2 .page3').show();
                    once = false;
                }
                break;

            case 4:
                $('#Indicator span:nth-child(1), #Indicator span:nth-child(2), #Indicator span:nth-child(3)').addClass('active');            
                $('.pagination li:nth-child(1) a, .pagination li:nth-child(2) a').addClass('done');
                $('.pagination li:nth-child(3) a').addClass('active'); 
                $('.contentMood > div').not('.page4').hide();
                $('.contentMood .page4').show();
                $(".contentMood .page2,.contentMood .page3, .page3Sub,.contentMood .page4 .sub-page4").hide();
                $(".pagination li:nth-child(3) a").css({ "background-color": "#FFFFFF", "color": "#FFDE15", "border-color": "#FFDE15" });
                $(".pagination li:nth-child(4) a").css({ "background-color": "#FFDE15", "color": "#35BFD3", "border-color": "#FFDE15" });
                $(".contentMood .page4 #invest").css("color", "#35BFD3");
                $(".contentMood .page4,.contentMood .page4 .selectMode").show();
                break;    
            
            case 5:
            // debugger;
                // var page4Risk;
                risk = $(e).attr("id");
                page4Risk = risk;
                //     if(risk == "dontKnow" ){
                //         currentPage=4;
                //         $(".contentMood .page4 .selectMode").hide();
                //         $(".contentMood .page4 .sub-page4").show();
                // }else{
                currentPage=5;
                $('#Indicator span:nth-child(1), #Indicator span:nth-child(2), #Indicator span:nth-child(3), #Indicator span:nth-child(4)').addClass('active'); 
                $('.pagination li:nth-child(1) a, .pagination li:nth-child(2) a, .pagination li:nth-child(3) a').addClass('done');
                $('.pagination li:nth-child(4) a').addClass('active'); 
                $('.contentMood > div').not('.page5').hide();
                $('.contentMood .page5').show();
                $("#riskSelected").text(rp);
                localStorage.clear();
                $(".contentMood .page4 #sip").css({"color": "black","font-size":"1.2em"});
                // $("#displayModal").modal("show");
                // $("#displayModal h3").html("You are a "+rp+" risk taker and we have recommended you the best.");
                // $(".contentMood .page4").hide();
                $(".contentMood .page5, #yp, #riskSelected").show();  
                // }
                break;

            case 6:
                $('#Indicator span:nth-child(1), #Indicator span:nth-child(2), #Indicator span:nth-child(3), #Indicator span:nth-child(4)').addClass('active'); 
                $('.pagination li:nth-child(1) a, .pagination li:nth-child(2) a, .pagination li:nth-child(3) a, .pagination li:nth-child(3) a, .pagination li:nth-child(4) a').addClass('done');
                $('.pagination li:nth-child(5) a').addClass('active'); 
                $('.contentMood > div').not('.page6').hide();
                $('.contentMood .page6').show();
                break;
            
            case 7:
                $('#Indicator span:nth-child(1), #Indicator span:nth-child(2), #Indicator span:nth-child(3), #Indicator span:nth-child(4)').addClass('active'); 
                $('.pagination li:nth-child(1) a, .pagination li:nth-child(2) a, .pagination li:nth-child(3) a, .pagination li:nth-child(3) a, .pagination li:nth-child(4) a').addClass('done');
                $('.pagination li:nth-child(5) a').addClass('active'); 
                $('.contentMood > div').not('.page7').hide();
                $('.contentMood .page7').show();
                break;
            }
        }
 
    
// $(".page4 .selectMode button").click(function () { selectTab5 });
    
    
    $(".page4 .sub-page4 .done").click(function(){ 
        // debugger;
        currentPage=5;
		localStorage.clear();
			 $("#riskSelected").text(rp);
    $("#displayModal").modal("show");
	$("#displayModal h3").html("You are a "+rp+" risk taker and we have recommended you the best.");
     $(".contentMood .page4").hide();
        
        $(".pagination li:nth-child(4) a").css({"background-color":"#FFFFFF","color":"#FFDE15","border-color":"#FFDE15"});
        
        $(".pagination li:nth-child(5) a").css({"background-color":"#FFDE15","color":"#35BFD3","border-color":"#FFDE15"});
          
           
     $(".contentMood .page5, #yp, #riskSelected").show();
          }); 
	
	
	
	$("#schemeNext").click(function(){
        selectTab(6);
        $(" .moodGoals > img").css("visibility","hidden");
        $(".contentMood .page5").hide();
        $(".contentMood .page6, #IndicatorNew").show();
	});
	
	
	$(".moodGoals > img").click(function(){
	movingTo = currentPage-1;	
    selectTab(movingTo);
// 		switch(movingTo){
				
// 			case 0: break;
// 			case 1: 
// 				$(".contentMood .page1").show();
		 
// 		$(".contentMood .page2, #goalIndicator").hide();
// 				currentPage=1;
// 			break;
				
// 			case 2: 
// 				$(".contentMood .page3, .page3Sub").hide();
// 				$(".contentMood .page2 .login-btn").css("top","65%");
// 				$(".contentMood .page2, #goalIndicator").show();
// 				 $(".page2 .dotHr").show();
// 				currentPage=2;
// 				once = true;
// 				break;
				
// 			case 3:
// 				$(".contentMood .page2, .contentMood .page3, .page3Sub").show();
// 				 $(".contentMood .page4").hide();
// 				currentPage=3;
// 				once = true;
// 				break;
				
// 			case 4:
// 				if(page4Risk == "dontKnow" ){
//              currentPage=4;
//             $(".contentMood .page4 .selectMode").hide();
            
//             $(".contentMood .page4 .sub-page4").show();
            
// }
// 				$(".contentMood .page5").hide();
// 				$(".contentMood .page4").show();
// 				currentPage=4;
// 				break;
// 		}

// 		nextPage = currentPage+1;
// 		 $(".moods .pagination li:nth-child("+nextPage+") a").css({"background-color":"#FFFFFF","color":"#FFDE15","border-color":"#FFDE15"});
        
//         $(".pagination li:nth-child("+movingTo+") a").css({"background-color":"#FFDE15","color":"#35BFD3","border-color":"#FFDE15"});
		
});
		if (localStorage.sipInvestment) {
    showSIP();
			
}
	/*<!--lumpsum sohan -- call for showing the riskprofile in goal selection-->*/
		if (localStorage.lumpsumInvestment) {
    showLumpsum();
			
}
	
});
var pathname = window.location.pathname;
if(pathname != '/GoalSelection'){
	//alert(pathname);
	localStorage.clear();
}
	//localStorage.clear()

var height = $( window ).height(); 
function resizeContent() {
    
   
   
 $("#section1,#section2,#section3,#section4").css("height",height);
   
}

/*sohan - navbar cancel button */

/* Set the width of the side navigation to 250px */

