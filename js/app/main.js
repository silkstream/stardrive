var Application;

$(document).ready(function () {//CREATE APPLICATION PAGES
    Application = new APPMANAGER();
    Application.pages[0] = "#page-login";
    Application.pages[1] = "#page-profile";
    Application.pages[2] = "#page-alerts";
    Application.pages[3] = "#page-messages";
    Application.pages[4] = "#page-starrate";    
    Application.closePages();

    ko.applyBindings(Application.masterVM.vmLogin, $(Application.pages[0])[0]);
    ko.applyBindings(Application.masterVM.vmProfile, $(Application.pages[1])[0]);
    ko.applyBindings(Application.masterVM.vmMessages, $(Application.pages[3])[0]);

    $("#page-login").show();
});

function APPMANAGER() {
    //DECLARE LOCAL PROPERTIES AS NULL
    this.pages = new Array();
    this.masterVM = {
        vmLogin: new LoginViewModel(),
        vmProfile: new ProfileViewModel(),
        vmMessages: new MessagesViewModel(),
    }
    
    APPMANAGER.prototype.gotoPage = function (pageName) {
        //CLOSE ALL WINDOWS
        this.closePages();        
        //SHOW THE SELECTED WINDOW        
        $("#" + pageName).show();
        return false;
    }
    APPMANAGER.prototype.closePages = function () {
        //HIDE ALL PAGES
        for (i = 0; i < this.pages.length; i++) {
            $(Application.pages[i]).hide();
        }
    }

  

}
