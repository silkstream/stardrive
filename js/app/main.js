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

    Application.closePages();
    //console.log(Application.masterVM);
    //console.log($("#weather"));

    //top nav binding
    ko.applyBindings(Application.masterVM.vmProfile, document.getElementById('top-nav'));


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
    ko.applyBindings(Application.masterVM.vmMaps, document.getElementById('daylyroute'));


    ko.applyBindings(Application.masterVM.vmLogin, $(Application.pages[0])[0]);
    //ko.applyBindings(Application.masterVM.vmProfile, $(Application.pages[1])[0]);

    //ko.applyBindings(Application.masterVM.vmMessages, $(Application.pages[3])[0]);
    //bindings for ratings
   ko.applyBindings(Application.masterVM.vmStarRating, document.getElementById('plotGraphContainer'));
    


    $("#menu").hide();
    Application.showpage("page-intro");


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
		
								//line: {
								//dataLabels: {
								//	color: "#ffffff",
								//	enabled: true,
								//	formatter: function() {
								//		thisprev = prev; 
								//		prev = this.y;																				
								//		//return '<b>'+(this.y > thisprev ? '+' : '') + Math.floor(this.y-thisprev) + '%</b>';
								//		//return '<b>'+(this.y > thisprev ? '+' : '')+(parseInt(this.y)-parseInt(thisprev)) +'</b>';
								//	},
								//	y: 12
								//	}
								//},
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
        $('html, body').animate({ scrollTop: 0 }, 0);
        return false;
    }
    APPMANAGER.prototype.showpage = function (pageName) {
        var self = this;
        //SHOW THE SELECTED WINDOW        
        $("#title").html($("#" + pageName).attr('title'));

        //$("#" + pageName).show('slide', {direction: 'right'}, 300);

        $("#" + pageName).show();

        if ($("#" + pageName).attr('title') == "Login" || $("#" + pageName).attr('title') == "Forgot Password") {
            $("#top-nav .drawer").hide();
        } else {
            $("#top-nav .drawer").show();




        }

        $("#top-nav .logo").unbind("click");

        if ($("#" + pageName).data('page-type') == "main") {
            $("#top-nav .logo").attr('src', $("#nav-left").data('mypic')).css({ 'width': '60px', 'margin': '0' });
            if ($("#" + pageName).attr('title') == "Login")
                $("#top-nav .logo").hide();

            if ($("#" + pageName).attr('title') == "Profile")
                $("#title").html(Application.masterVM.vmProfile.FirstName());
            this.pagetrail = [];
            this.pagetrail.push(pageName);
            $("#top-nav .logo").click(function () {
                self.gotoPage("page-profile");

            });

        } else {
            $("#top-nav .logo").attr('src', "images/arrow_back.png").css({ 'width': 'auto', 'margin-top': '15px' });
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
    console.log($(element));
    $(".msgcontrol").slideUp();
    //$(element + " .msgcontrol").show();
    if ($(element).parent().find(".msgcontrol").is(":visible"))
        $(element).parent().find(".msgcontrol").slideUp();
    else
        $(element).parent().find(".msgcontrol").slideDown();
    //alert("fd");
    //console.log();
}


function showalertcontrol(element) {
    console.log($(element));
    $(".alertcontrol").slideUp();
    //$(element + " .msgcontrol").show();
    if ($(element).parent().find(".alertcontrol").is(":visible"))
        $(element).parent().find(".alertcontrol").slideUp();
    else
        $(element).parent().find(".alertcontrol").slideDown();
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