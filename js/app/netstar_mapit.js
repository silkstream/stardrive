var PATH = "41.0.34.35:25000/uat/";
var USER = new Object();
var MAP;
var alertPinOverlay;
var tripRouteOverlay;
var startendPinsOverlay;
var speedingOverlay;
var alertpin;
var infowindow = 0;
var returnedtripdata;
var startloadercount = 0;




function callProxyPHP(proxy_url_ext, req_type, user_data, callback, async_val) {

    //var root_path = "http://10.0.0.24/";
    var root_path = "http://stardrive.cloudapp.net/";
    var url = root_path + "Stardriveusers/proxyConnect.json?data=" + proxy_url_ext;
    //var url = "http://jsonp.jit.su/?url="+proxy_url_ext;
    $.ajax({
        type: req_type,
        url: url + "&calback=cb",
        data: user_data,
        async: async_val,
        dataType: 'json',
        success: function (data) {
            callback(data);
        },
        error: function (xhr, errorString, exception) {
            console.log("xhr.status=" + xhr.status + " error=" + errorString + " exception=(" + exception + ")");
        },
        beforeSend: function () {
            startloadercount = startloadercount +1;
            $('#preloader').show();
        },
        complete: function(){
            startloadercount = startloadercount -1;
            if(startloadercount < 1){
                $('#preloader').hide();
            }
        
        }
    });
}

/* login */
function netstar_login(username, password) {
    var url = PATH + "login/" + username + "/" + password;
    //callAjax(url, req_type, user_data, callback, async_val);

    data = { username: username, password: password };

    //ballAjax(url,'GET',data,loginCallback,false);
    callProxyPHP(url, 'GET', ' ', loginCallback, false);
}
/* set user login */
function loginCallback(callbackData) {
    console.log("netstar logged in  " + callbackData.Token);
    console.log("login data ---------------------->",callbackData);
    Application.masterVM.vmProfile.netstarkey(callbackData.Token);
}


function gettrips(vehicle) {
    returnedtripdata = [];
    netstar_login('colossusadmin', 'c0l0ssus');
    to = new Date();
    to.setDate(to.getDate());
    to = to.getFullYear() + ('0' + (to.getMonth() + 1)).slice(-2) + ('0' + to.getDate()).slice(-2) + "235930";

    from = new Date();
    from.setDate(from.getDate() - 3);
    from = from.getFullYear() + ('0' + (from.getMonth() + 1)).slice(-2) + ('0' + from.getDate()).slice(-2) + "000000";

    var url = PATH + Application.masterVM.vmProfile.netstarkey() + '/trips/' + vehicle + "/" + from + "/" + to;
    console.log("trips:::::::::", url);
    callProxyPHP(url, 'GET', " ", tripsCallback, true);

}

function gettripdetail(tripid) {
    $("#trips").empty();
    var url = PATH + Application.masterVM.vmProfile.netstarkey() + '/trip-coordinates/' + tripid;
    console.log("trips:::::::::", url);
    callProxyPHP(url, 'GET', " ", function (tripdetail) {

        console.log(tripdetail)
        copytemplate = template.clone();
        //copytemplate.empty();
        //copytemplate.html(thistrip.MaxSpeed);

        fromaddress = tripdetail[0].GeoAddress.split(", ");
        toaddress = tripdetail[tripdetail.length - 1].GeoAddress.split(", ");
        datetime = tripdetail[0].CreateDate;
        copytemplate.find('.atripdetail .tripaddress').html(fromaddress[0] + " to " + toaddress[0]);
        copytemplate.find('.atripdetail .tripdatetime').html(formatdate(datetime));


        var alerttemplate = copytemplate.find('.atripalerts').clone();
        var alertcount = 0;



        copytemplate.find('.atripalerts').empty();

        var tripobj = [];
        for (var i = 0; i < tripdetail.length; i++) {
            /*tripobj[i]['lat'] = tripdetail[i].Latitude;
            tripobj[i]['lon'] = tripdetail[i].Longitude;
            tripobj[i]['geoaddress'] = tripdetail[i].GeoAddress;*/
            var speeding = 0;

            if (tripdetail[i].OverSpeed == "true")
                speeding = { "speed": tripdetail[i].Speed, "roadspeed": tripdetail[i].RoadSpeed};
           tripobj[i] = { "lat": tripdetail[i].Latitude, "lon": tripdetail[i].Longitude, "geoaddress": tripdetail[i].GeoAddress, "datetime": tripdetail[i].PositionDate, "speeding": speeding };

            if (tripdetail[i].OverSpeed == "true") {
                alertcount = alertcount + 1;
                alerttemplate.find('.alerttime').html(tripdetail[i].PositionDate);
                copytemplate.find('.atripalerts').append(alerttemplate);
            }
        }


        copytemplate.find('.atripdetail .alertcount').html(alertcount);
        copytemplate.find('.atripdetail .triplink').attr("rel", JSON.stringify(tripobj));

        // console.log(copytemplate.html());

        // $('#trips').append(template);    
        //$("#trips").append(copytemplate);
        $("#trips").append(copytemplate);


    }, true);


}

function tripsCallback(callbackData, container){


   
    returnedtripdata = callbackData;
           // console.log("trip callback");
           // console.log(returnedtripdata);


}


function getlastposition(vehicle, container) {
   // netstar_login('colossusadmin', 'c0l0ssus');
    var url = PATH + Application.masterVM.vmProfile.netstarkey() + "/VehicleLastPosition/" + vehicle;

    callProxyPHP(url, 'GET', " ",
    function (calbackdata) {

        console.log("status");
        console.log(calbackdata);
        //console.log($(container).find('div:nth-child(3)').html());
        var status = calbackdata.Ignition == "true" ? "moving" : "stationary";
        var vehiclelocation = calbackdata.GeoAddress;

        var vehiclelocationdate = calbackdata.PositionDate;
        var coordinates = JSON.stringify({ "lat": calbackdata.Latitude, "lon": calbackdata.Longitude, "address": calbackdata.GeoAddress, "date": formatdate(calbackdata.PositionDate) });
        /*if (calbackdata[0].Status == "") {
        status = "unavailable";
        }*/
        //return calbackdata.status;
        $(container).find('div .location').html(vehiclelocation);
        $(container).find('div .locationdate').html(formatdate(vehiclelocationdate));
        $(container).find('div .status').html(status);
        $(container).find('.positionjson').val(coordinates);


        //$('#preloader').hide();


    },
    true);


}


function getstatus(vehicle, container) {
   // netstar_login('colossusadmin', 'c0l0ssus');

    //var url = PATH + Application.masterVM.vmProfile.netstarkey() + "/vehicles?$filter=" + (encodeURIComponent("AssetId eq guid'" + vehicle + "'").replace(/'/g, "%27"));
    //var url = PATH + Application.masterVM.vmProfile.netstarkey() + "/VehicleLastPosition/" + vehicle;

    //console.log("status:::::::::", url);

    setTimeout(function () {
        var speeds = [];
        var Sum = 0;
        for (var i = 0; i < returnedtripdata.length; i++) {

            speeds.push(returnedtripdata[i].MaxSpeed);
            Sum = Sum + returnedtripdata[i].MaxSpeed;



        }
        console.log("max speeed");
        console.log(Math.max.apply(Math, speeds));
        $(container).find('div .maxspeed').html((Math.max.apply(Math, speeds)).toFixed(2));
        $(container).find('div .avgspeed').html((Sum / returnedtripdata.length).toFixed(2));
    }, 5000);
    getlastposition(vehicle, container);
  /*  callProxyPHP(url, 'GET', " ",
        function (calbackdata) {

            console.log("status");
            //console.log(calbackdata[0].Status);
            //console.log($(container).find('div:nth-child(3)').html());
            var status = calbackdata[0].Status;
            if (calbackdata[0].Status == "") {
                status = "unavailable";
            }

            $(container).find('div .status').html(status);

            //$('#preloader').hide();


        },
     true);*/

}

function mapINIT() {

    /*start pam*/
    deCarta.Core.Configuration.clientName = 'Swisttech';
    deCarta.Core.Configuration.defaultConfig = 'tomtom';
    deCarta.Core.Configuration.defaultHiResConfig = 'tomtom';
    deCarta.Core.Configuration.url = 'http://ws.mapit.co.za/openls/JSON';
    deCarta.Core.Configuration.clientPassword = 'e35613cbc0f797747787ba1d936617a0';

    center = new deCarta.Core.Position("-29.925278, 21.423889");

    var satelliteLayer = new deCarta.Core.MapLayer({
        tileStore: new deCarta.Core.SatelliteTileStore()
    });


    var controls = [];


        controls.push(new deCarta.UI.SelectControl({ position: 'bottomLeft' }));
        controls.push(new deCarta.UI.LocateControl({ position: 'leftTop' }));
        controls.push(new deCarta.UI.LayerControl({ position: 'bottomRight' }));
        //controls.push(new deCarta.UI.TrafficControl({position: 'rightTop'}));
	 	



    MAP = new deCarta.Core.Map({
        id: "mapContainerzzz",
        center: center,
        controls: controls,
        onReady: function (map) {
        }

    });



  //  myinfowindow = new deCarta.Core.InfoWindow({

    //cssClass: 'custominfowindow'

   //});



    MAP.setMapStyle("generic");

    alertPinOverlay = new deCarta.Core.MapOverlay({
        name: "AlertPins"
    });

    startendPinsOverlay = new deCarta.Core.MapOverlay({
        name: "StartEndPins"
    });

    tripRouteOverlay = new deCarta.Core.MapOverlay({
        name: 'route'
    });
   // MAP.setSatelliteView();

}

function ReverseGeocode(pinobj) {

    /*start pam*/
    deCarta.Core.Configuration.clientName = 'Swisttech';
    deCarta.Core.Configuration.defaultConfig = 'tomtom';
    deCarta.Core.Configuration.defaultHiResConfig = 'tomtom';
    deCarta.Core.Configuration.url = 'http://ws.mapit.co.za/openls/JSON';
    deCarta.Core.Configuration.clientPassword = 'e35613cbc0f797747787ba1d936617a0';

    console.log("before geocode");
    console.log(pinobj);
    deCarta.Core.Geocoder.reverseGeocode(
			new deCarta.Core.Position(pinobj),
			 function (addressResults) {
			     start_loc = addressResults;
			     //$("#" + element).html(start_loc.Address.countrySubdivision + " - " + start_loc.Address.municipality + ' ' + start_loc.Address.municipalitySubdivision);
			     //alert(start_loc.Address.countrySubdivision + " - " + start_loc.Address.municipality + ' ' + start_loc.Address.municipalitySubdivision);
			     if (start_loc.Address.countrySubdivision) {
			         alert(start_loc.Address.countrySubdivision + " - " + start_loc.Address.municipality + ' ' + start_loc.Address.municipalitySubdivision);
			         console.log(start_loc);
			         return start_loc.Address.countrySubdivision + " - " + start_loc.Address.municipality + ' ' + start_loc.Address.municipalitySubdivision;
			     } else {
			         return "boendoes";
			     }
			 }
		);



}

function placealertpin(pinobj) {



    MAP.addOverlay(alertPinOverlay);

    console.log(pinobj.alert_location());


    alertpin = new deCarta.Core.Pin({
        position: new deCarta.Core.Position(pinobj.alert_location()),
        // text: pinobj.alert_description(),
        imageSrc: "images/startpoint_icon_1.png"



    });
    console.log("alertpin");
    console.log(alertpin);
    alertpin.onclick(function () { showinfowindow() });
    $(".custominfowindow").html(pinobj.alert_description());
    alertPinOverlay.addObject(alertpin);
    MAP.zoomTo(8);
    MAP.centerOn(new deCarta.Core.Position(pinobj.alert_location()));
    //$(alertpin.domElement).click(function () { alert("haha"); });

}


function placepositionpin(pinobj) {



    MAP.addOverlay(alertPinOverlay);

    //console.log(pinobj.alert_location());


    positionpin = new deCarta.Core.Pin({
        position: new deCarta.Core.Position(pinobj.lat + "," + pinobj.lon),
        // text: pinobj.alert_description(),
        imageSrc: "images/startpoint_icon_1.png"



    });
    console.log("alertpin");
    console.log(positionpin);
    positionpin.onclick(function () { showinfowindow() });
    $(".custominfowindow").html(pinobj.vehicle + "<br/>" + pinobj.address);
    alertPinOverlay.addObject(positionpin);
    MAP.zoomTo(8);
    MAP.centerOn(new deCarta.Core.Position(pinobj.lat + "," + pinobj.lon));
    //$(alertpin.domElement).click(function () { alert("haha"); });

}




function clearmap() {

    //MAP.removeOverlay(alertPinOverlay);
    //MAP.removeOverlay(tripRouteOverlay);
    //MAP.removeOverlay(startendPinsOverlay);

    alertPinOverlay.clear();
    $(alertPinOverlay.domElement).hide();
    tripRouteOverlay.clear();
    $(tripRouteOverlay.domElement).hide();
    startendPinsOverlay.clear();
    $(startendPinsOverlay.domElement).hide();
    //speedingOverlay.clear();

    MAP.render();

}

function showtrip(tripobj) {



     MAP.addOverlay(startendPinsOverlay);


    
    MAP.addOverlay(tripRouteOverlay);
    console.log("tripbobj");
    console.log(tripobj);

    var routeCriteria = new deCarta.Core.RouteCriteria();
    console.log("routeCriteria");
    routeCriteria.waypoints = [];
    if (typeof tripobj === "undefined") {
        alert(Application.masterVM.vmProfile.WorkAddress());
        homeaddress = Application.masterVM.vmProfile.HomeAddress().split(',');
        workaddress = Application.masterVM.vmProfile.WorkAddress().split(',');


        tripbobj = [];
        //tripbobj[0] = { lat: homeaddress[0], lon: homeaddress[1] };
        //tripbobj[0] = ;
        //alert(tripobj[0].lat);
        routeCriteria.waypoints.push(new deCarta.Core.Position(homeaddress[0] + "," + homeaddress[1]));

        var startpin = new deCarta.Core.Pin({
            position: new deCarta.Core.Position(new deCarta.Core.Position(homeaddress[0] + "," + homeaddress[1])),
            text: "Home",
            yOffset: 32,
            xOffset: 15,
            imageSrc: "images/startpoint_icon_1.png"

        });
        startendPinsOverlay.addObject(startpin);
       
        //tripobj[1].lon = workaddress[1];
        routeCriteria.waypoints.push(new deCarta.Core.Position(workaddress[0] + "," + workaddress[1]));

        var endpin = new deCarta.Core.Pin({
            position: new deCarta.Core.Position(new deCarta.Core.Position(workaddress[0] + "," + workaddress[1])),
            text: "Work",
            yOffset: 32,
            xOffset: 15,
            imageSrc: "images/startpoint_icon_1.png"

        });
        startendPinsOverlay.addObject(endpin);        
    } else {

        MAP.addOverlay(alertPinOverlay);
        for (var i = 0; i < tripobj.length; i++) {
            console.log("tripobj[i]" + tripobj[i]['geoaddress']);
            console.log(tripobj[i]);

            if (tripobj[i].speeding != "0") {

                alertpin = new deCarta.Core.Pin({
                    position: new deCarta.Core.Position(tripobj[i]['lat'] + "," + tripobj[i]['lon']),
                    // text: pinobj.alert_description(),
                    yOffset: 32,
                    xOffset: 15,
                    imageSrc: "images/alert_pin.png"
                });
                alertPinOverlay.addObject(alertpin);     
           
           }

            routeCriteria.waypoints.push(new deCarta.Core.Position( 
                                            tripobj[i]['lat'] + "," + tripobj[i]['lon']
                                                                   )
                                         );

        }

        var startpin = new deCarta.Core.Pin({
            position: new deCarta.Core.Position( tripobj[0]['lat'] + "," + tripobj[0]['lon']),
            text: tripobj[0].geoaddress,
            yOffset: 32,
            xOffset: 22,
            imageSrc: "images/green_start_icon.png"

        });
        startendPinsOverlay.addObject(startpin);

        var endpin = new deCarta.Core.Pin({
            position: new deCarta.Core.Position( tripobj[tripobj.length-1]['lat'] + "," + tripobj[tripobj.length-1]['lon']),
            text: tripobj[tripobj.length - 1].geoaddress,
            yOffset: 32,
            xOffset: 22,
            imageSrc: "images/red_end_icon.png"

        });
        startendPinsOverlay.addObject(endpin);




    }

    deCarta.Core.Routing.execute(routeCriteria, function(route, error){

            var line = new deCarta.Core.Polyline({
                lineGeometry: route.routeGeometry
            })

            var centerAndZoom = line.getIdealCenterAndZoom(MAP);

            tripRouteOverlay.addObject(line);
            MAP.zoomTo(centerAndZoom.zoom);
            MAP.centerOn(centerAndZoom.center);
    });
    MAP.render();
  
}


function showinfowindow() {



    if (infowindow == 0) {
        infowindow = 1;
        $(".custominfowindow").show('slide', { direction: 'left' }, 300);
    } else {
        infowindow = 0
        $(".custominfowindow").hide('slide', { direction: 'left' }, 300);        
    }    // alertpin.showText();


}