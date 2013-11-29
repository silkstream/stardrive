var currentPage;
var pages;

function CONTROLLER() {
    this.currentPage = "";
    
    if (typeof CONTROLLER.INIT == "undefined") {
        CONTROLLER.prototype.loadPages = function (win, container) {
            pages = new Array();
            
        }
    }
}