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

    Application.closePages();
    //console.log(Application.masterVM);
    //console.log($("#weather"));

    //bindings for profile home
    ko.applyBindings(Application.masterVM.vmProfile, document.getElementById('profileblock'));
    ko.applyBindings(Application.masterVM.vmWeather, document.getElementById('weather'));
    ko.applyBindings(Application.masterVM.vmMessages, document.getElementById('latestmsg'));
    ko.applyBindings(Application.masterVM.vmAlerts, document.getElementById('latestalert'));
    ko.applyBindings(Application.masterVM.vmAlerts, document.getElementById('alerttotal'));
    ko.applyBindings(Application.masterVM.vmMessages, document.getElementById('msgtotal'));


    ko.applyBindings(Application.masterVM.vmLogin, $(Application.pages[0])[0]);
    //ko.applyBindings(Application.masterVM.vmProfile, $(Application.pages[1])[0]);
    
    ko.applyBindings(Application.masterVM.vmMessages, $(Application.pages[3])[0]);



    $("#menu").hide();
    Application.showpage("page-intro");


    $("#top-nav .logo").click(function () {
        //console.log(Application.pagetrail);
        Application.pagetrail.pop();
        Application.gotoPage(Application.pagetrail[Application.pagetrail.length - 1]);
        //console.log(Application.pagetrail);
    });



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
        vmAlerts: new AlertsViewModel()
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
        return false;
    }
    APPMANAGER.prototype.showpage = function (pageName) {
        //SHOW THE SELECTED WINDOW        
        $("#title").html($("#" + pageName).attr('title'));

        //$("#" + pageName).show('slide', {direction: 'right'}, 300);

        $("#" + pageName).show();


        if($("#" + pageName).attr('title') == "Login" || $("#" + pageName).attr('title') == "Forgot Password"){
            $("#top-nav .drawer").hide();
        }else{
             $("#top-nav .drawer").show();
             $("#top-nav .logo").attr('src', "images/home-button.png");
             var self = this;

             $("#top-nav .logo").click(function(){             
                    self.gotoPage("page-profile");             
             });
        }



        if($("#" + pageName).data('page-type') == "main"){
           if($("#" + pageName).attr('title') == "Login")
                $("#top-nav .logo").hide();           
            this.pagetrail = [];
            this.pagetrail.push(pageName);
           
        }else{
            if(pageName != this.pagetrail[this.pagetrail.length-1])
            this.pagetrail.push(pageName);
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
