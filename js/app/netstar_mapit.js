var PATH = "41.0.34.35:25000/uat/";
var USER = new Object();
var MAP;
var alertPinOverlay;
var tripRouteOverlay;
var startendPinsOverlay;
var speedingOverlay;
var alertpin;
var infowindow = 0;


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
    console.log(tripbobj);

    var routeCriteria = new deCarta.Core.RouteCriteria();
    console.log("routeCriteria");
    routeCriteria.waypoints = [];
    if (typeof tripbobj === "undefined") {
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

        for (var i = 0; i < tripobj.length; i++) {
            console.log("tripobj[i]");
            console.log(tripobj[i]);
           

            routeCriteria.waypoints.push(
                                            
                                                new deCarta.Core.Position( 
                                                                                tripobj[i]['lat'] + "," + tripobj[i]['lon']
                                                                          )
                                         );

        }

        var startpin = new deCarta.Core.Pin({
            position: new deCarta.Core.Position( tripobj[0]['lat'] + "," + tripobj[0]['lon']),
            text: "Home",
            yOffset: 32,
            xOffset: 15,
            imageSrc: "images/startpoint_icon_1.png"

        });
        startendPinsOverlay.addObject(startpin);

        var endpin = new deCarta.Core.Pin({
            position: new deCarta.Core.Position( tripobj[tripobj.length-1]['lat'] + "," + tripobj[tripobj.length-1]['lon']),
            text: "Work",
            yOffset: 32,
            xOffset: 15,
            imageSrc: "images/startpoint_icon_1.png"

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