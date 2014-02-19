var PATH = "41.0.34.35:25000/uat/";
var USER = new Object();
var MAP;
var alertPinOverlay;
var tripRouteOverlay;
var startendPinsOverlay;
var speedingOverlay;


function netstar_login(username, password) {
    var url = PATH + "login/" + username + "/" + password;
    //callAjax(url, req_type, user_data, callback, async_val);

    data = { username: username, password: password };


    $.ajax({
        url: PATH+"login/"+username+"/"+password,
        data: {},
        success: function (data) {
            USER = data;
        },
        dataType: 'json'
    });

    //ballAjax(url,'GET',data,loginCallback,false);
   

    


}




function mapINIT() {
    /*start pam*/
    deCarta.Core.Configuration.clientName = 'Swisttech';
    deCarta.Core.Configuration.defaultConfig = 'tomtom';
    deCarta.Core.Configuration.defaultHiResConfig = 'tomtom';
    deCarta.Core.Configuration.url = 'http://ws.mapit.co.za/openls/JSON';
    deCarta.Core.Configuration.clientPassword = 'e35613cbc0f797747787ba1d936617a0';

    center = new deCarta.Core.Position("-29.925278, 21.423889");


    MAP = new deCarta.Core.Map({
        id: "mapContainerzzz",
        center: center

    });


}



function placealertpin(pinobj) {

    alertPinOverlay = new deCarta.Core.MapOverlay({
        name: "AlertPins"
    });

    MAP.addOverlay(alertPinOverlay);

    console.log(pinobj.alert_location());


    var alertpin = new deCarta.Core.Pin({
        position: new deCarta.Core.Position(pinobj.alert_location()),
        text: pinobj.alert_description(),
    imageSrc: "images/startpoint_icon_1.png"

});

alertPinOverlay.addObject(alertpin);
MAP.zoomTo(8);
MAP.centerOn(new deCarta.Core.Position(pinobj.alert_location()));

    
}