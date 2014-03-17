var Application;



$(document).ready(function () {//CREATE APPLICATION PAGES
    Application = new APPMANAGER();
    Application.pages[0] = "#page-login";
    Application.pages[1] = "#page-profile";
    Application.pages[2] = "#page-alerts";
    Application.pages[3] = "#page-messages";
    Application.pages[4] = "#page-starrate";
    Application.pages[5] = "#page-intro";
    Application.pages[6] = "#page-forgotpw";
    Application.pages[7] = "#page-starsocial";
    Application.pages[8] = "#page-friends";
    Application.pages[9] = "#page-location";
    Application.pages[10] = "#page-starratecomposition";
    Application.pages[11] = "#page-starratesliders";
    Application.pages[12] = "#page-starsafe";
    Application.pages[13] = "#page-starsight";

    Application.closePages();
    //console.log(Application.masterVM);
    //console.log($("#weather"));

    //top nav binding
    ko.applyBindings(Application.masterVM.vmProfile, document.getElementById('top-nav'));


//drawer
    ko.applyBindings(Application.masterVM.vmAlerts, document.getElementById('navalert'));
    ko.applyBindings(Application.masterVM.vmMessages, document.getElementById('navmsg'));

    ko.applyBindings(Application.masterVM.vmProfile, document.getElementById('menutitle'));

    //bindings for profile home
    //ko.applyBindings(Application.masterVM.vmProfile, document.getElementById('profileblock'));
    ko.applyBindings(Application.masterVM.vmWeather, document.getElementById('weather'));
    ko.applyBindings(Application.masterVM.vmMessages, document.getElementById('latestmsg'));
    ko.applyBindings(Application.masterVM.vmAlerts, document.getElementById('latestalert'));
    ko.applyBindings(Application.masterVM.vmAlerts, document.getElementById('alerttotal'));
    ko.applyBindings(Application.masterVM.vmMessages, document.getElementById('msgtotal')); 

    //bindings for starsocial messages
    ko.applyBindings(Application.masterVM.vmMessages, document.getElementById('allmessages'));
    ko.applyBindings(Application.masterVM.vmMessages, document.getElementById('chosenmsgn'));

    //bindings for starsocial friends
    ko.applyBindings(Application.masterVM.vmFriends, document.getElementById('allfriends'));
    ko.applyBindings(Application.masterVM.vmMessages, document.getElementById('chosenfriend'));


    //bindings for alerts page
    ko.applyBindings(Application.masterVM.vmAlerts, document.getElementById('allalerts'));

    //bindings for alert location page
    ko.applyBindings(Application.masterVM.vmMaps, document.getElementById('alertlocation'));
    ko.applyBindings(Application.masterVM.vmProfile, document.getElementById('daylyroute'));


    ko.applyBindings(Application.masterVM.vmLogin, $(Application.pages[0])[0]);
    //ko.applyBindings(Application.masterVM.vmProfile, $(Application.pages[1])[0]);

    //ko.applyBindings(Application.masterVM.vmMessages, $(Application.pages[3])[0]);
    //bindings for ratings
        ko.applyBindings(Application.masterVM.vmStarRating, document.getElementById('plotGraphContainer'));
        ko.applyBindings(Application.masterVM.vmStarRating, document.getElementById('sliderbox'));

    //bindings for starsafe page
    ko.applyBindings(Application.masterVM.vmProfile, document.getElementById('starsafevehicles'));


        //bindings for starsight page
    ko.applyBindings(Application.masterVM.vmProfile, document.getElementById('starsightvehicles'));

    //var myScroll = new IScroll('', { scrollX: true, scrollY: false, mouseWheel: true });

    $("#menu").hide();
    Application.showpage("page-intro");

   if(window.localStorage.getItem("remembereduser")){

           parsed = JSON.parse(window.localStorage.getItem("remembereduser"));
            
                    Application.masterVM.vmProfile.FirstName(parsed.FirstName);
                    Application.masterVM.vmProfile.Surname(parsed.Surname);
                    Application.masterVM.vmProfile.UserId(parsed.UserId);
                    Application.masterVM.vmProfile.Image(parsed.Image);
                    //Application.masterVM.vmProfile.Password(data[0].Stardriveuser.username);
                    Application.masterVM.vmProfile.Email(parsed.Email);
                    Application.masterVM.vmProfile.HomeAddress(parsed.HomeAddress);
                    Application.masterVM.vmProfile.WorkAddress(parsed.WorkAddress);

                    Application.masterVM.vmProfile.HomeAddresstext(parsed.HomeAddresstext);
                    Application.masterVM.vmProfile.WorkAddresstext(parsed.WorkAddresstext);    
            
            
            
            Application.masterVM.vmWeather.pullWeather();
            Application.masterVM.vmMessages.pullMessages();
            Application.masterVM.vmAlerts.pullAlerts();
            Application.masterVM.vmFriends.pullFriends();
            Application.masterVM.vmStarRating.pullRatings(7);
            Application.gotoPage('page-profile');
    
    }




    var remembernot =1;
    $('.rememberme').click(function(){if(remembernot == 1){remembernot = 0; $(this).find('.remembercheck div').addClass('darkgrey');$("#rememberme").val('1');}else{remembernot = 1; $(this).find('.remembercheck div').removeClass('darkgrey');$("#rememberme").val('0');}});



    $("#top-nav .logo").click(function () {
        //console.log(Application.pagetrail);
        Application.pagetrail.pop();
        Application.gotoPage(Application.pagetrail[Application.pagetrail.length - 1]);
        //console.log(Application.pagetrail);
    });


    $('#allfriends').on('click', '*', function () {

        // alert($(this).attr('rel'));
        $("#friend_id").val($(this).attr('data-fid'));
        $("#friend_name").val($(this).attr('data-fname'));
        $("#friend_name_title").html($(this).attr('data-fname'));


        $(".friendModal").dialog({
            dialogClass: "no-close",
            draggable: false,
            resizable: false,
            width: '60%',
            modal: true,
            show: { effect: "slideDown", duration: 300 },
            close: function (event, ui) {
                $(".friendModal").hide();
            }
        });




    });

var chart = new Highcharts.Chart({
    chart: {
        renderTo: 'plotGraphContainer',
        type: 'column'
    },
    series: [{
        data: {}
    }],
                title: { text: "" },
                legend: { enabled: false },
                credits: { enabled: false },
                tooltip: { enabled: false },
                exporting: { enabled: false },
                xAxis: {labels: {
                enabled: false
            }//,
               //     categories: cata
                },
                yAxis: {
                    title: {
                        enabled: false
                    },		    
                    gridLineColor: '#E6E6E6'
                },
				plotOptions: {
		

								series: {
                marker: {
                    states: {
                        hover: {
                            enabled: false
                        }
                    }
                }
            }
				},

})

$("#resetrates").click(function(){
    Application.masterVM.vmStarRating.sliderValues(["5"]);
    Application.masterVM.vmStarRating.pullRatings(7);
    Application.masterVM.vmStarRating.setsliders();    
});


$(".rotated").rotate(180);



});



function APPMANAGER() {
    //DECLARE LOCAL PROPERTIES AS NULL
    this.pages = new Array();
    this.pagetrail = [];
    this.masterVM = {
        vmLogin: new LoginViewModel(),
        vmProfile: new ProfileViewModel(),
        vmMessages: new MessagesViewModel(),
        vmWeather: new WeatherViewModel(),
        vmAlerts: new AlertsViewModel(),
        vmFriends: new FriendsViewModel(),
        vmMaps: new MapsViewModel(),
        vmStarRating: new StarRatingViewModel()
    }
    APPMANAGER.prototype.toggleMenu = function () {
        $("#menu").toggle('slide', {
            direction: 'right'
        });
    }
    APPMANAGER.prototype.gotoPage = function (pageName) {
        //CLOSE ALL WINDOWS
        this.closePages();
        $("#menu").hide('slide', {direction: 'right'}, 300);
        //SHOW THE SELECTED WINDOW        

        this.showpage(pageName);
       //var mySwiper = new Swiper('.vehicleslide');
    //var mySwiper = $('.vehicleslide').swiper({
    //Your options here:
   // mode:'horizontal',
   // loop: true,
   // grabCursor: true
    //etc..
  //});
       //reinitSwiper(mySwiper);

 

   if($("#" + pageName).attr('title') == "StarSight")
       $("#demo").dragend({
            afterInitialize: function() {
              this.container.style.visibility = "visible";

              if(this.page < this.pages.length - 1)
              $("#swipenext").attr("rel", this.page+2);
              if(this.page > 0)
              $("#swipeprev").attr("rel", this.page);

            },
            onSwipeEnd: function(cont){ 
              if(this.page < this.pages.length - 1)
              $("#swipenext").attr("rel", this.page+2);
              if(this.page > 0)
              $("#swipeprev").attr("rel", this.page);
               //console.log("thispage");
               //console.log(this.activeElement);
               //alert($(this.activeElement).attr("rel"));            
 
            }
          });

      $("#swipeprev").click(function() {
       var prevpage = $(this).attr("rel");
        $("#demo").dragend({
          scrollToPage: prevpage
        });
      });    

      $("#swipenext").click(function() {
      var nextpage = $(this).attr("rel");
     // alert(nextpage);
        $("#demo").dragend({
          scrollToPage: nextpage
        });
      });


        $('html, body').animate({ scrollTop: 0 }, 0);
        if ($("#" + pageName).attr('title') == "StarRate")
            Application.masterVM.vmStarRating.pullRatings(7);
        return false;
    }
    APPMANAGER.prototype.showpage = function (pageName) {
        var self = this;
        //SHOW THE SELECTED WINDOW        
        $("#title").html($("#" + pageName).attr('title'));

        //$("#" + pageName).show('slide', {direction: 'right'}, 300);
        //$(".vehicleslide").jScroll({vScroll : true});


        $("#" + pageName).show();
        $('#pageheader').css('text-align', 'left');
        if ($("#" + pageName).attr('title') == "Login" || $("#" + pageName).attr('title') == "Forgot Password") {
            $("#top-nav .drawer").hide();
            $("#headerratings").hide();
            $('#pageheader').css('text-align', 'center');
        } else {
            $("#top-nav .drawer").show();
            $("#headerratings").show();


        }

        $("#top-nav .logo").unbind("click");

        if ($("#" + pageName).data('page-type') == "main") {
            $("#top-nav .logo").attr('src', $("#nav-left").data('mypic')).css({ 'height': '100%', 'margin': '0' });
            if ($("#" + pageName).attr('title') == "Login"){
                $("#top-nav .logo").hide();
                $('#pageheader').css('text-align', 'center');
                }
            if ($("#" + pageName).attr('title') == "Profile"){
                $("#title").html(Application.masterVM.vmProfile.FirstName());
                $("#headerratings").hide();
                $('#pageheader').css('text-align', 'left');
            }

            this.pagetrail = [];
            this.pagetrail.push(pageName);
            $("#top-nav .logo").click(function () {
                self.gotoPage("page-profile");

            });

        } else {
            $("#top-nav .logo").attr('src', "images/arrow_back.png").css({ 'width': 'auto', 'height': 'auto', 'margin-top': '15px' });
            if (pageName != this.pagetrail[this.pagetrail.length - 1]) {
                self.pagetrail.push(pageName);
                $("#top-nav .logo").click(function () {

                    self.gotoPage(self.pagetrail[self.pagetrail.length - 2]);
                });

            }
            $("#top-nav .logo").show();
        }


        return false;
    }
    APPMANAGER.prototype.closePages = function () {
        //HIDE ALL PAGES
        for (i = 0; i < this.pages.length; i++) {
            $(Application.pages[i]).hide();
        }
    }

}

function showmsgcontrol(element) {
        //alert();
   // $(".msgcontrol").slideUp();
    //$(element + " .msgcontrol").show();
    if ($(element).parent().find(".msgcontrol").is(":visible")){
        $(element).parent().find(".msgcontrol").slideUp();
        $(element).find('.arrow img').rotate({animateTo:0});
    }else{
        $(element).parent().find(".msgcontrol").slideDown();
        $(element).find('.arrow img').rotate({animateTo:180});
     }
    //alert("fd");
    //console.log();
}


function showalertcontrol(element) {
                
    $(".alertcontrol").slideUp();
    //$(element + " .msgcontrol").show();
    if ($(element).parent().find(".alertcontrol").is(":visible")){
        $(element).parent().find(".alertcontrol").slideUp();
       $(element).find('.arrow img').rotate({animateTo:0});
    }else{
        $(element).parent().find(".alertcontrol").slideDown();
             $(element).find('.arrow img').rotate({animateTo:180});
     }
    //alert("fd");
    //console.log();
}

function toggleratedays(){
var days = [7, 30 ,90];
$("#currentratedays").val();

for(var  i = 0; i < days.length; i++){


if($("#currentratedays").val() == days[i] && i !=  (days.length-1)){
    Application.masterVM.vmStarRating.pullRatings(days[i+1]);
    $("#currentratedays").val(days[i+1])
    $("#rateday"+ days[i]).hide("slide",{direction: 'up'});
    $("#rateday"+ days[i+1]).show("slide",{direction: 'down'});

    return false;
}

if($("#currentratedays").val() == days[i] && i ==  (days.length-1)){
    Application.masterVM.vmStarRating.pullRatings(7);
    $("#currentratedays").val(7)
    $("#rateday"+ days[i]).hide("slide",{direction: 'up'});
    $("#rateday"+ days[0]).show("slide",{direction: 'down'});
    return false;
}





}



}


function toggleroute(way){


    if(way == "fromhome"){
        $("#fromhome").show();
        $("#fromwork").hide();
    }

    if(way == "fromwork"){
        $("#fromhome").hide();
        $("#fromwork").show();
    }




}

function toggleratedays2(element){


        var days = [7, 30 ,90];
        $("#currentratedays").val();

        for(var  i = 0; i < days.length; i++){


            if($("#currentratedays").val() == days[i] && i !=  (days.length-1)){
                Application.masterVM.vmStarRating.pullRatings(days[i+1]);
                $("#currentratedays").val(days[i+1])
                $("#"+element+" .rateday"+ days[i]).hide();
                $("#"+element+" .rateday"+ days[i+1]).show("slide",{direction: 'down'}); 

                return false;
            }

            if($("#currentratedays").val() == days[i] && i ==  (days.length-1)){
                Application.masterVM.vmStarRating.pullRatings(7);
                $("#currentratedays").val(7)
                $("#"+element+" .rateday"+ days[i]).hide();
                $("#"+element+" .rateday"+ days[0]).show("slide",{direction: 'down'});
  
                return false;
            }

        }


}
function reinitSwiper(swiper) {
setTimeout(function () {
    swiper.resizeFix();
   // window.resize();
    alert("reinit?");
}, 1000);

}