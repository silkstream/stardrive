﻿ko.async = {
    callbackParam: function (options) {
        this.delegate = function () { };
        this.completedSynchronously = false;
        this.valueAccessor = function () { };
        this.isLoaded = function () { };
        $.extend(this, options);
    }
};
ko.asyncComputed = function (evaluatorFunction, target) {

    var loaded = ko.observable(false);
    // will store the data from the callback
    var _value = ko.observable();
    _value.evaluatorFunction = evaluatorFunction;

    var getFreshCallbackParam = function () {
        return new ko.async.callbackParam({ valueAccessor: _value, isLoaded: loaded.peek() });
    };

    // make sure callbackParam is always set when evaulator is called (it won't be set when accessed by KO)
    var _evaluatorFunction = function (_callbackParam) {
        if (!_callbackParam) {
            _callbackParam = getFreshCallbackParam();
        }
        return _value.evaluatorFunction.call(this, _callbackParam);
    };
    var _valueComp = ko.computed(_evaluatorFunction);

    var write = function (newValue) {
        //indicate that the value is now loaded and set it
        result.loaded(true);
        _value(newValue);
    };
    var read = function () {
        //if it has not been loaded, execute the supplied function
        //console.log('read');
        if (!result.loaded()) {
            // setup callback from inside evaluator and execute it
            var callbackParam = getFreshCallbackParam();
            var val = _evaluatorFunction.call(this, callbackParam);

            if (typeof (val) !== "undefined") {
                _value(val);
                if (callbackParam.completedSynchronously) {
                    result.loaded(true);
                }
            }
            if (!callbackParam.completedSynchronously) {
                callbackParam.delegate.call(target, write);
            }
        }
        //always return the current value
        return _value();
    };

    var result = ko.computed({
        read: read,
        write: write,
        deferEvaluation: true  //do not evaluate immediately when created
    });


    //expose the current state, which can be bound against
    result.loaded = loaded;
    //load it again
    result.refresh = function () {
        result.loaded(false);
    };
    // respond to changes in dependencies
    _valueComp.subscribe(function (newVal) {
        result.refresh();
    });

    return result;
};

///*********************************

function LoginViewModel() {

    this.LoginName = ko.observable("robinfourie@gmail.com");
    this.UserPassword = ko.observable("123456");
    this.LoginFail = ko.observable(false);
    this.LoginData = ko.observable();
    this.RememberMe = ko.observable(0);
    this.ErrorMessage = ko.computed(function () {
        return "You entered " + this.UserPassword() + " as a password";
    }, this);

    this.doLogout = function () {
        window.localStorage.clear();
        Application.masterVM.vmProfile.FirstName('');
        Application.masterVM.vmProfile.Surname('');
        Application.masterVM.vmProfile.UserId('');
        Application.masterVM.vmProfile.Image('');
        Application.masterVM.vmProfile.Email('');
        Application.masterVM.vmProfile.HomeAddress('');
        Application.masterVM.vmProfile.WorkAddress('');
        Application.masterVM.vmProfile.HomeAddresstext('');
        Application.masterVM.vmProfile.WorkAddresstext('');
        Application.gotoPage('page-intro');
    }

    this.doLogin = function () {
        //Do a login
        console.log("login url :", login_url);
        var login_url = 'http://stardrive.cloudapp.net/stardriveusers/loginMobile.json?username=' + this.LoginName() + '&password=' + this.UserPassword();
        console.log("logging in :", login_url);
        var self = this;
        $.ajax({
            url: login_url,
            data: { username: this.LoginName(), password: this.UserPassword() },
            success: function (data) {
                console.log(data);
                Application.masterVM.vmProfile.FirstName(data.Stardriveuser.username);
                Application.masterVM.vmProfile.Surname(data.Stardriveuser.surname);
                Application.masterVM.vmProfile.UserId(data.Stardriveuser.id);
                Application.masterVM.vmProfile.Image("http://stardrive.cloudapp.net/" + data.Stardriveuser.userimage);
                //Application.masterVM.vmProfile.Password(data[0].Stardriveuser.username);
                Application.masterVM.vmProfile.Email(data.Stardriveuser.emailaddress);
                Application.masterVM.vmProfile.HomeAddress(data.Stardriveuser.homeaddresscords);
                Application.masterVM.vmProfile.WorkAddress(data.Stardriveuser.workaddresscords);

                Application.masterVM.vmProfile.HomeAddresstext(data.Stardriveuser.homeaddress1);
                Application.masterVM.vmProfile.WorkAddresstext(data.Stardriveuser.workaddress1);
                Application.masterVM.vmProfile.stardrivekey(data.key);

                for (var i = 0; i < data.Vehicle.length; i++) {
                    vehicleid = data.Vehicle[i].id;
                    description = data.Vehicle[i].description;
                    status = data.Vehicle[i].status;
                    avatar = "http://stardrive.cloudapp.net/img/" + data.Vehicle[i].photo;
                    registration = data.Vehicle[i].registration;
                    Application.masterVM.vmProfile.Vehicles.push(new Vehicle(vehicleid, description, status, avatar, registration));
                }


                if ($('#rememberme').val() == 1) {

                    self.RememberMe(1);
                    window.localStorage.setItem("remembereduser", ko.toJSON(Application.masterVM.vmProfile));

                }
                console.log("remembereduser");
                console.log(window.localStorage.getItem("remembereduser"));

                Application.masterVM.vmWeather.pullWeather();
                Application.masterVM.vmMessages.pullMessages();
                Application.masterVM.vmAlerts.pullAlerts();
                Application.masterVM.vmFriends.pullFriends();
                Application.masterVM.vmStarRating.pullRatings(7);
                Application.gotoPage('page-profile');

            },
            dataType: 'json',
            crossDomain: true
        });



        /* if (this.UserPassword() == "123456") {

        $.ajax({
        url: window.location.pathname + '/../json/successlogin.js',
        data: { username: this.LoginName(), password: this.UserPassword() },
        success: function (data) {
        // console.log(data[0].Stardriveuser);
                    
        },
        dataType: 'json'
        });


        }
        else {
        this.LoginFail(true);
        }*/
    }
}

function ProfileViewModel() {
    self = this;
    self.FirstName = ko.observable().extend({ reset: true }) ;
    self.Surname = ko.observable().extend({ reset: true });
    self.UserId = ko.observable().extend({ reset: true });
    self.Image = ko.observable().extend({ reset: true });
    self.Password = ko.observable().extend({ reset: true });
    self.Email = ko.observable().extend({ reset: true });
    self.HomeAddress = ko.observable().extend({ reset: true });
    self.WorkAddress = ko.observable().extend({ reset: true });
    self.HomeAddresstext = ko.observable().extend({ reset: true });
    self.WorkAddresstext = ko.observable().extend({ reset: true });
    self.Vehicles = ko.observableArray();
    self.netstarkey = ko.observableArray('');
    self.stardrivekey = ko.observableArray('');
    
    self.FullName = ko.computed(function () {
        return self.FirstName() + " " + self.Surname();
    }, self).extend({ reset: true });

    self.chosenVehicleTripData = ko.observable();

    self.showHomeAddress = function () {
        //Set the home address;
        console.log("entering home address screen");
        Application.gotoPage('page-homeaddress');
    }

    self.setHomeAddress = function () {
        
        $.ajax({

            url: 'http://stardrive.cloudapp.net/stardriveusers/setWorkAddress.json?home_address=' + this.HomeAddresstext() + '&key=' + this.stardrivekey(),
                data: {},
                success: function (data) {
                    Application.gotoPage('page-account');
                },
                dataType: 'json'
            });
    };    

    self.showWorkAddress = function () {
        //Set the home address;
        console.log("entering work address screen");
        Application.gotoPage('page-workaddress');
    }

    self.setWorkAddress = function () {
        //build up the json value and submit it to the API

        $.ajax({

            url: 'http://stardrive.cloudapp.net/stardriveusers/setWorkAddress.json?work_address=' + this.WorkAddresstext() + '&key=' + this.stardrivekey(),
            data: {},
            success: function (data) {
                Application.gotoPage('page-account');
            },
            dataType: 'json'
        });
    }

   

}

function Message(msgid, fromid, fromname, toid, toname, subject, message, msgdate, reminder, fromimg) {
    var self = this;
    self.msgid = ko.observable(msgid);
    self.fromid = ko.observable(fromid);
    self.fromname = ko.observable(fromname);
    self.fromimg = ko.observable(fromimg);
    self.toid = ko.observable(toid);
    self.toname = ko.observable(toname);
    self.subject = ko.observable(subject);
    self.message = ko.observable(message);
    self.msgdate = ko.observable(msgdate);
    self.reminder = ko.observable(reminder);
}

function MessagesViewModel() {
    var self = this;
    self.allmessages = ko.observableArray();
    self.outbox = ko.observableArray();
    self.chosenmsg = ko.observable();

    self.setchosenmsg = function (msgobj) {
    
        Application.masterVM.vmMessages.chosenmsg(msgobj);
        Application.gotoPage('page-messages');
    }
    self.setchosenmsgfrnd = function (friend) {
        //var theid = $("#friend_id").val();
        //console.log("test");
        //console.log(friend.friend_id());


        var theid = friend.friend_id();

        //var thename = $("#friend_name").val();
        var thename = friend.friend_name();

        var myname = Application.masterVM.vmProfile.FirstName + " " + Application.masterVM.vmProfile.SurName;
        var myid = Application.masterVM.vmProfile.UserId

        msgobj = new Message('zz', theid, thename, myname, myid, "", "", "2014-02-02", "0", "")
        Application.masterVM.vmMessages.chosenmsg(msgobj);
        //Application.masterVM.vmMessages.chosenmsg();
        //$('.friendModal').dialog('close');
        Application.gotoPage('page-messages');
    }
    self.delmessage = function () {
        var msg_id = this.msgid();
        var key = Application.masterVM.vmProfile.stardrivekey();
        var del_msg_url = "http://stardrive.cloudapp.net/stardriveusers/deleteMobileMessage.json?message_id=" + msg_id + "&key=" + key;
        console.log("del", del_msg_url);
        var self = this;
        $.ajax({
            url: del_msg_url,
            data: {},
            success: function (data) {
                console.log("message deleted", data);
                if (data.code == 200) {
                    //alert("message deleted");
                    Application.masterVM.vmMessages.allmessages.remove(self);
                }
            },
            dataType: 'json'
        });
        //Application.masterVM.vmMessages.allmessages.remove(this);
    }
    self.sendmessage = function (mydata) {
        /* send message to server */
        //alert($("#newmessage").val());
        var key = Application.masterVM.vmProfile.stardrivekey();
        var to = mydata.fromid();
        var message = $("#newmessage").val();
        var header = this.subject();
        var msg_url = "http://stardrive.cloudapp.net/stardriveusers/sendMobileMessage.json?key=" + key + "&to=" + to + "&heading=" + header + "&message=" + message;
        //console.log("message url :", msg_url);
        $.ajax({
            url: msg_url,
            data: {},
            success: function (data) {
                console.log("message sent", data);
                if (data.code == 200) {
                    return Application.gotoPage('page-starsocial');
                }
            },
            dataType: 'json'
        });
        //Application.masterVM.vmMessages.outbox.push(new Message('zz', mydata.toid(), mydata.toname(), mydata.fromid(), mydata.fromname(), mydata.subject(), $("#newmessage").val(), "2014-02-02", "0", ""));
        //Application.gotoPage('page-starsocial');
    }
    self.pullMessages = function () {
        var key = Application.masterVM.vmProfile.stardrivekey();
        var msg_url = "http://stardrive.cloudapp.net/stardriveusers/getMobileMessages.json?key=" + key;
        console.log("get messages :", msg_url);
        $.ajax({
            url: msg_url,
            data: {},
            success: function (data) {
                console.log("message server data :", data);
                $("div .message-sub-header #inbox").text(data.length);
                $("#allmessages").empty();
                for (var i = 0; i < data.length; i++) {

                    var msgid = data[i].Message.id;
                    var fromid = data[i].Message.from;

                    var fromname = data[i].From.username + " " + data[i].From.surname;
                    var toid = data[i].Message.to;
                    var toname = data[i].To.username + " " + data[i].To.surname;
                    var subject = data[i].Message.heading;
                    var message = data[i].Message.message;
                    var msgdate = data[i].Message.time_sent;
                    var fromimg = "http://stardrive.cloudapp.net/" + data[i].From.userimage
                    msgdate = msgdate.split("-");
                    msgdate = new Date(msgdate[0], msgdate[1], msgdate[2]);

                    var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

                    msgdate = monthNames[msgdate.getMonth()] + " " + msgdate.getDate() + ', ' + msgdate.getUTCFullYear();

                    var reminder = data[i].Message.reminder_id;
                    if (data[i].Message.reminder_id != "0") {
                        fromname = "Reminder";
                    }

                    Application.masterVM.vmMessages.allmessages.push(new Message(msgid, fromid, fromname, toid, toname, subject, message, msgdate, reminder, fromimg));

                }
                console.log("all messages ", Application.masterVM.vmMessages.allmessages());

            },
            dataType: 'json'
        });

    };

}

function WeatherViewModel() {
    var self = this;
    self.pic = ko.observable();
    self.town = ko.observable();
    self.degree = ko.observable();
    self.description = ko.observable();

    self.degreedesc = ko.computed(function () {
        return self.degree() + "," + self.description();
    }, self);


    self.pullWeather = function () {

        $.ajax({
            url: 'http://api.openweathermap.org/data/2.5/weather?q="Cape Town"&units=metric',
            data: {},
            success: function (data) {
                //console.log(data.main.temp);
                Application.masterVM.vmWeather.pic("http://openweathermap.org/img/w/" + data.weather[0].icon);
                Application.masterVM.vmWeather.town("Cape Town");
                Application.masterVM.vmWeather.degree(Math.round(data.main.temp * 10) / 10 + " &deg;C ");
                Application.masterVM.vmWeather.description(data.weather[0].description);
            },
            dataType: 'json'
        });        
    
    
    }

}

function Alert(alert_id, alert_type, alert_location, alert_description, alert_date) {

    var self = this;
    self.alert_type = ko.observable(alert_type);
    self.alert_location = ko.observable(alert_location);
    self.alert_id = ko.observable(alert_id);
    self.alert_description = ko.observable(alert_description);
    self.alert_date = ko.observable(alert_date);
    self.alert_address = ko.asyncComputed(function () {
        //var shouldDisplay = ReverseGeocode(self.alert_location());
        //alert(shouldDisplay + "#");
        //return shouldDisplay;
        ////return ReverseGeocode(self.alert_location());

        /*start pam*/
        deCarta.Core.Configuration.clientName = 'Swisttech';
        deCarta.Core.Configuration.defaultConfig = 'tomtom';
        deCarta.Core.Configuration.defaultHiResConfig = 'tomtom';
        deCarta.Core.Configuration.url = 'http://ws.mapit.co.za/openls/JSON';
        deCarta.Core.Configuration.clientPassword = 'e35613cbc0f797747787ba1d936617a0';
      
        //console.log("before geocode");
        //console.log(pinobj);
        var start_loc;
        deCarta.Core.Geocoder.reverseGeocode(
			new deCarta.Core.Position(self.alert_location()),
			 function (addressResults) {
			     start_loc = addressResults;
			    
			     //$("#" + element).html(start_loc.Address.countrySubdivision + " - " + start_loc.Address.municipality + ' ' + start_loc.Address.municipalitySubdivision);
			     //alert(start_loc.Address.countrySubdivision + " - " + start_loc.Address.municipality + ' ' + start_loc.Address.municipalitySubdivision);
			     if (start_loc.Address.countrySubdivision) {
			         start_loc = start_loc.Address.countrySubdivision;
			         alert(start_loc.Address.countrySubdivision + " - " + start_loc.Address.municipality + ' ' + start_loc.Address.municipalitySubdivision);
			         console.log(start_loc);
			         // return start_loc.Address.countrySubdivision;
			        
			     } else {
			         start_loc = "boendoes";
			         //return "boendoes";
			     }
			 }
		);

        return start_loc;



    }, self).extend({ async: true });



}

function AlertsViewModel() {
    var self = this;
    self.allalerts = ko.observableArray();



    /*
    ko.bindingHandlers.reversegeocode = {
        update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            // On update, fade in/out
            console.log("accessor");
            console.log(bindingContext.$data.alert_location());

            var shouldDisplay = setTimeout( ReverseGeocode(bindingContext.$data.alert_location()), 500);
            alert(shouldDisplay);
            $(element).html(shouldDisplay);
        }
    };

    */



    self.setchosenalert = function (msgobj) {

        Application.masterVM.vmAlerts.chosenalert(msgobj);
        Application.gotoPage('page-location');
        mapINIT();
        placealertpin(msgobj);
    }

    self.pullAlerts = function () {

        $.ajax({
            url: window.location.pathname + '/../json/getalerts.js',
            data: {},
            success: function (data) {
                console.log(data);
                for (var i = 0; i < data.length; i++) {

                    var alert_id = data[i].Useralert.id;
                    var alert_type = data[i].Useralert.alert_type;

                    var alert_location = data[i].Alertcords[0] + " , " + data[i].Alertcords[1];
                    Date.prototype.addHours = function (h) {
                        this.setHours(this.getHours() + h);
                        return this;
                    }

                    var alert_date = new Date().addHours(-3);

                    var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

                    alert_date = monthNames[alert_date.getMonth()] + " " + alert_date.getMonth() + ', ' + alert_date.getUTCFullYear() + " " + data[i].Alerttime+":00 AM";

                    var alert_description = "";
                    switch (alert_type) {
                        case "Speeding":
                            alert_description = "Vehicle registration: <span class='colorblue'>" + data[i].Vehicle.registration + "</span><br/> Overspeeding: <span class='colorred'>" + data[i].Useralert.speedlimit + "km/h";
                            break;
                        case "Cornering":
                            alert_description = "Vehicle with registration " + data[i].Vehicle.registration + " harsh cornering";
                            break;
                        case "Braking":
                            alert_description = "Vehicle with registration " + data[i].Vehicle.registration + " harsh breaking";
                            break;
                        case "Time Rule":
                            alert_description = "Vehicle registration: " + data[i].Vehicle.registration + " exceeding time rule";
                            break;
                        case "Geo-fencing":
                            alert_description = "Vehicle registration: <span class='colorblue'>" + data[i].Vehicle.registration + "</span><br/>" + data[i].Useralert.zone_type + ": <span class='colorblue'>" + data[i].Zone.zonename+"</span>";
                            break;
                        case "Impact":
                            alert_description = "Vehicle with registration " + data[i].Vehicle.registration + " had an Impact";
                            break;

                    }


                    Application.masterVM.vmAlerts.allalerts.push(new Alert(alert_id, alert_type, alert_location, alert_description, alert_date));



                }
                console.log(Application.masterVM.vmMessages.allmessages);

            },
            dataType: 'json'
        });

    };


}

function Friend(friendid, friend_name, friend_img) {
    var self = this;
    self.friend_id = ko.observable(friendid);
    self.friend_name = ko.observable(friend_name);
    self.friend_img = ko.observable(friend_img);

}

function FriendsViewModel() {
    var self = this;
    self.allfriends = ko.observableArray();

    self.delfriend = function () {


        Application.masterVM.vmFriends.allfriends.remove(this);
    
    
    };

    self.pullFriends = function () {
        var key = Application.masterVM.vmProfile.stardrivekey();
        var friend_url = "http://stardrive.cloudapp.net/stardriveusers/getMobileFriends.json?key=" + key;
        //var demo_url = window.location.pathname + '/../json/getfriends.js';
        $.ajax({
            url: friend_url,
            data: {},
            success: function (data) {

                for (var i = 0; i < data.length; i++) {
                    console.log("friends", data);
                    var friend_id = "";
                    var friend_name = "";
                    var friend_img = "";

                    /*
                    if (Application.masterVM.vmProfile.UserId == data[i].UserFrom.id) {
                    friend_id = data[i].UserTo.id;
                    friend_name = data[i].UserTo.username + " " + data[i].UserTo.surname;
                    friend_img = data[i].UserTo.userimage;
                    } else {
                    friend_id = data[i].UserFrom.id;
                    friend_name = data[i].UserFrom.username + " " + data[i].UserFrom.surname;
                    friend_img = data[i].UserFrom.userimage;
                    }*/
                    friend_id   = data[i].Friend.id;
                    friend_name = data[i].Friend.username + " " + data[i].Friend.surname;
                    friend_img  = data[i].Friend.userimage;

                    Application.masterVM.vmFriends.allfriends.push(new Friend(friend_id, friend_name, friend_img));
                }
            },
            dataType: 'json'
        });
    };
}

function Routes(from, fromtext, to, totext, datetime) {
    var self = this;
    self.from = ko.observable(from);
    self.to = ko.observable(to);
    self.fromtext = ko.observable(fromtext);
    self.totext = ko.observable(totext);
    self.datetime = ko.observable(datetime);

}

function MapsViewModel() {
    var self = this;
    self.chosenalert = ko.observable();
    self.chosenposition = ko.observable();
    self.chosenroute = ko.observable();
    self.whattoshow = ko.observable();
    self.initmap = '0';

    self.abouttoshow = function (type) {
        alert("checking");
        return type === this.whattoshow();
    };




    self.setchosenposition = function (posobj, element) {

        self.whattoshow("position");

        posobj = JSON.parse($(element.currentTarget).find("input.positionjson").val());
        posobj.vehicle = $(element.currentTarget).find("div .vehiclename").html();

        console.log(posobj);
        self.whattoshow("position");
        Application.masterVM.vmMaps.chosenposition(posobj);
        Application.gotoPage('page-location');
        if (self.initmap == '0') {
        mapINIT();
        self.initmap = "1";
        }
        clearmap();
        placepositionpin(posobj);

    }


    self.setchosenalert = function (alertobj) {
        self.whattoshow("alert");
        Application.masterVM.vmMaps.chosenalert(alertobj);
        Application.gotoPage('page-location');
        if (self.initmap == '0') {
            mapINIT();
            self.initmap = "1";
        }
        clearmap();
        placealertpin(alertobj);
    }


    self.setchosenroute = function (way) {


        self.whattoshow("route");

        // Application.masterVM.vmMaps.chosenroute(tripobj);


        if (self.initmap == '0') {
            mapINIT();
            self.initmap = "1";
        }

        clearmap();
        Application.gotoPage('page-location');

        homeaddress = Application.masterVM.vmProfile.HomeAddress().split(',');
        workaddress = Application.masterVM.vmProfile.WorkAddress().split(',');

        var tripbobj = [{ lat: homeaddress[0], lon: homeaddress[1] }, { lat: workaddress[0], lon: workaddress[1]}];



        if (way != 'homework' && way != 'workhome') {
            self.whattoshow("trip");
            tripbobj = $(way).attr("rel");
            tripbobj = JSON.parse(tripbobj);

            console.log("for trip");
            console.log(tripbobj);

        }

        //  alert(homeaddrezz);
        // alert(workaddrezz);
        var homeaddrezz = (Application.masterVM.vmProfile.HomeAddress());
        var workaddrezz = (Application.masterVM.vmProfile.WorkAddress());


        var homeaddrezztxt = (Application.masterVM.vmProfile.HomeAddresstext());
        var workaddrezztxt = (Application.masterVM.vmProfile.WorkAddresstext());
        showtrip(tripbobj);
        var routeobj;
        switch (way) {
            case 'homework': routeobj = new Routes(homeaddrezz, homeaddrezztxt, workaddrezz, workaddrezztxt, "0"); break;
            case 'workhome': routeobj = new Routes(workaddrezz, workaddrezztxt, homeaddrezz, homeaddrezztxt, "0"); break;
            default:

                var fromaddress = tripbobj[0].geoaddress.split(',');
                fromaddress = fromaddress[fromaddress.length - 1];
                fromcords = tripbobj[0].lat + ", " + tripbobj[0].lon;

                var toaddress = tripbobj[tripbobj.length - 1].geoaddress.split(',');
                toaddress = toaddress[toaddress.length - 1];
                tocords = tripbobj[tripbobj.length - 1].lat + ", " + tripbobj[tripbobj.length - 1].lon;

               /* datetime = datetime.split("T");
                time = datetime[1];
                time = time.split(":");


                datetime = datetime[0].split("-");
                year = datetime[0];
                month = datetime[1];
                day = datetime[2];

                datetime = new Date(year, month, day, time[0], time[1]);
                var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                tripdatetime = datetime.getDate() + " " + monthNames[datetime.getMonth()] + " " + datetime.getUTCFullYear() + " " + formatAMPM(datetime);
                */

                tripdatetime = formatdate(datetime);
                routeobj = new Routes(fromcords, fromaddress, tocords, toaddress, tripdatetime);
                break;


        }

        /*   if (way == 'homework')
        var routeobj = new Routes(homeaddrezz, homeaddrezztxt, workaddrezz, workaddrezztxt);
        else if (way == 'workhome')
        var routeobj = new Routes(workaddrezz, workaddrezztxt, homeaddrezz, homeaddrezztxt);
        else {
        var routeobj = new Routes(tripbobj[0].lat + "," + tripbobj[0].lon, tripbobj[0].geoaddress, tripbobj[tripbobj.length - 1].lat + "," + tripbobj[tripbobj.length - 1].lon, tripbobj[tripbobj.length - 1].geoaddress);
        } */

        Application.masterVM.vmMaps.chosenroute(routeobj);


    }


}

function StarRating(rating, speeding10, speeding15, speeding20, braking, lanechanges, accidents, acceleration, cornering, frequency, time, age, make, color, ratingchangecount, ratingchange){

var self = this;
self.rating = ko.observable(rating);
self.speeding10 = ko.observable(speeding10);
self.speeding15 = ko.observable(speeding15);
self.speeding20 = ko.observable(speeding20); 
self.braking = ko.observable(braking);
self.lanechanges = ko.observable(lanechanges);
self.accidents = ko.observable(accidents);
self.acceleration = ko.observable(acceleration);
self.cornering = ko.observable(cornering);
self.frequency = ko.observable(frequency);
self.time = ko.observable(time);
self.age = ko.observable(age);
self.make = ko.observable(make);
self.color = ko.observable(color);
self.ratingchangecount = ko.observable(ratingchangecount);
self.ratingchange = ko.observable(ratingchange);

}

function StarRatingViewModel() {

    var self = this;

    self.sevendayrating = ko.observable();
    self.pieOptions = ko.observable();
    self.sliderValues = ko.observable(['5']);


    self.pullRatings = function (numdays) {

        $.ajax({
            url: window.location.pathname + '/../json/' + numdays + 'dayrating.js',
            data: {},
            success: function (data) {
                var rating = data.rating;
                var speeding10 = data.speeding10;
                var speeding15 = data.speeding15;
                var speeding20 = data.speeding20;
                var braking = data.braking;
                var lanechanges = data.lanechanges;
                var accidents = data.accidents;
                var acceleration = data.acceleration;
                var cornering = data.cornering;
                var frequency = data.frequency;
                var time = data.time;
                var age = data.age;
                var make = data.make;
                var color = data.color;
                var ratingchangecount = data.ratingchangecount;
                var ratingchange = data.ratingchange;
                self.sevendayrating(new StarRating(rating, speeding10, speeding15, speeding20, braking, lanechanges, accidents, acceleration, cornering, frequency, time, age, make, color, ratingchangecount, ratingchange));


                console.log("slider data 1");
                console.log(self.sliderValues().length);
                if (self.sliderValues().length == 1) {
                    self.setsliders(data);
                    //alert("setting sliders");
                    console.log("slider data 2");
                    console.log(self.sliderValues());



                }
                $("#currentscore").html(rating);
                $("#headingrating").html(rating);
                $("#profilerating").html(rating);
                self.calculateRiskProfile(data);
                console.log("options");
                console.log(self.pieOptions);
                self.drawplotgraph(data);



            },
            dataType: 'json'
        });
    }


    self.setsliders = function (data) {

        self.sliderValues([data.speeding10, data.accidents, data.acceleration, data.braking, data.cornering, data.frequency, data.time]);

     

    }

    self.slideoneup = function (data, event) {

        var selectedslider = ($(event.target).prev().attr('id')).replace('slider', '');

        if (parseInt(self.sliderValues()[selectedslider]) < 21) {
            self.sliderValues()[selectedslider] += 1;

            $(event.target).prev().slider('value', $(event.target).prev().slider('value') + $(event.target).prev().slider("option", "step")); ;
            self.calculateRiskProfile();

            $("#slideBoxValue" + selectedslider).html((21 - self.sliderValues()[selectedslider]) + " Alerts");
            $(event.target).prev().find(".ui-slider-handle").html(Math.round(self.sliderValues()[selectedslider] / 21 * 100) + "%");

        }

        if (selectedslider == 5) {

            if (parseInt(self.sliderValues()[selectedslider]) < 31) {

                self.sliderValues()[selectedslider] += 1;

                $(event.target).prev().slider('value', $(event.target).prev().slider('value') + $(event.target).prev().slider("option", "step")); ;
                self.calculateRiskProfile();

                //alert(parseInt(self.sliderValues()[selectedslider]));    
                $(event.target).prev().find(".ui-slider-handle").html(Math.round(self.sliderValues()[selectedslider] / 31 * 100) + "%");
                // $("#slideBoxValue" + selectedslider).html(31 - self.sliderValues()[selectedslider] + " Alerts");


                switch (true) {
                    case self.sliderValues()[selectedslider] >= 16:
                        $("#slideBoxValue" + selectedslider).html("23-31 days");
                        break;
                    case self.sliderValues()[selectedslider] <= 15 && (self.sliderValues()[selectedslider] >= 10):
                        $("#slideBoxValue" + selectedslider).html("16-22 days");
                        break;
                    case self.sliderValues()[selectedslider] <= 10:
                        $("#slideBoxValue" + selectedslider).html("0-15 days");
                        break;
                }

            }

        }

        if (selectedslider == 6) {

            if (parseInt(self.sliderValues()[selectedslider]) < 24) {

                self.sliderValues()[selectedslider] += 1;

                $(event.target).prev().slider('value', $(event.target).prev().slider('value') + $(event.target).prev().slider("option", "step")); ;
                self.calculateRiskProfile();

                //alert(parseInt(self.sliderValues()[selectedslider]));    
                $(event.target).prev().find(".ui-slider-handle").html(Math.round(self.sliderValues()[selectedslider] / 24 * 100) + "%");


                switch (true) {
                    case self.sliderValues()[selectedslider] >= 16:
                        $("#slideBoxValue" + selectedslider).html("04AM-11PM");
                        break;
                    case self.sliderValues()[selectedslider] <= 15:
                        $("#slideBoxValue" + selectedslider).html("11PM-04AM");
                        break;
                }

            }
        }



    }

    self.slideonedown = function (data, event) {

        var selectedslider = ($(event.target).next().attr('id')).replace('slider', '');
        if (parseInt(self.sliderValues()[selectedslider]) > 0) {
            self.sliderValues()[selectedslider] -= 1;
            $(event.target).next().slider('value', $(event.target).next().slider('value') - $(event.target).next().slider("option", "step")); ;
            self.calculateRiskProfile();
            $("#slideBoxValue" + selectedslider).html((21 - self.sliderValues()[selectedslider]) + " Alerts");
            $(event.target).next().find(".ui-slider-handle").html(Math.round(self.sliderValues()[selectedslider] / 21 * 100) + "%");


            if (selectedslider == 5) {

                if (parseInt(self.sliderValues()[selectedslider]) > 0) {
                    self.sliderValues()[selectedslider] -= 1;
                    $(event.target).next().slider('value', $(event.target).next().slider('value') - $(event.target).next().slider("option", "step")); ;
                    self.calculateRiskProfile();

                    $(event.target).next().find(".ui-slider-handle").html(Math.round(self.sliderValues()[selectedslider] / 31 * 100) + "%");
                    $("#slideBoxValue" + selectedslider).html(31 - self.sliderValues()[selectedslider] + " Alerts");


                    switch (true) {
                        case self.sliderValues()[selectedslider] >= 16:
                            $("#slideBoxValue" + selectedslider).html("23-31 days");
                            break;
                        case self.sliderValues()[selectedslider] <= 15 && (self.sliderValues()[selectedslider] >= 10):
                            $("#slideBoxValue" + selectedslider).html("16-22 days");
                            break;
                        case self.sliderValues()[selectedslider] <= 10:
                            $("#slideBoxValue" + selectedslider).html("0-15 days");
                            break;
                    }

                }

            }



            if (selectedslider == 6) {

                if (parseInt(self.sliderValues()[selectedslider]) > 0) {

                    self.sliderValues()[selectedslider] -= 1;

                    $(event.target).next().slider('value', $(event.target).next().slider('value') - $(event.target).next().slider("option", "step")); ;
                    self.calculateRiskProfile();

                    //alert(parseInt(self.sliderValues()[selectedslider]));    
                    $(event.target).next().find(".ui-slider-handle").html(Math.round(self.sliderValues()[selectedslider] / 24 * 100) + "%");


                    switch (true) {
                        case self.sliderValues()[selectedslider] >= 16:
                            $("#slideBoxValue" + selectedslider).html("04AM-11PM");
                            break;
                        case self.sliderValues()[selectedslider] <= 15:
                            $("#slideBoxValue" + selectedslider).html("11PM-04AM");
                            break;
                    }

                }
            }






        }


    }


    self.calculateRiskProfile = function (data) {
        //alert(self.sliderValues()[0]);
        //static values. will be gotten from the profile.
        var _speeding10 = 0.75;
        var _speeding15 = 3.75;
        var _speeding20 = 15;
        var _acceleration = 0.35;
        var _braking = 0.4;
        var _cornering = 1;
        var _time = [1.25, 5, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15];
        var _frequency = [9, 12, 15, 18, 30, 35, 40, 50, 55, 57, 60, 62, 64, 68, 70, 72, 75, 80, 82, 85, 87, 86, 88, 90, 92, 95, 96, 97, 99, 100];
        var _accidents = 5;


        // alert((self.sevendayrating().age()) ? self.sevendayrating().age() : data.age + " !!!!!!!!!");
        var ageAndSex = (self.sevendayrating().age()) ? self.sevendayrating().age() : data.age;
        var vehicleMake = (self.sevendayrating().make()) ? self.sevendayrating().make() : data.make;
        var vehicleColour = (self.sevendayrating().color()) ? self.sevendayrating().color() : data.color;
        //variable values. changed on the sliders.
        var speeding10 = 15 - (self.sliderValues()[0] - 1) * _speeding10;
        //var speeding15 = 15-(sliderValues[1] -1) * _speeding15;
        //var speeding20 = 15-(sliderValues[2] -1) * _speeding20;
        //var speeding = 15-(speeding10+speeding15+speeding20);
        var speeding = 15 - (speeding10);
        if (speeding < 0) {
            speeding = 0;
        }
        var harshAcceleration = (self.sliderValues()[2] - 1) * _acceleration;
        var harshBraking = (self.sliderValues()[3] - 1) * _braking;
        var harshCornering = (self.sliderValues()[4] - 1) * _cornering;
        var frequency = _frequency[(self.sliderValues()[5] - 1)];
        var time = _time[(self.sliderValues()[6] - 1)];

        var laneChanges = (self.sliderValues()[2] - 1) * 25; //worthless
        var accidents = (self.sliderValues()[1] - 1); 	//worthless

        //risk calculations
        var lc = laneChanges * 0;
        var ac = accidents * 0;
        var age = ageAndSex * 10 / 100;
        var vm = vehicleMake * 15 / 100;
        var vc = vehicleColour * 5 / 100;

        riskTotal = (frequency + time + harshAcceleration + harshBraking + harshCornering + age + speeding + vm + vc);
        $("#projectedscore").html(Math.floor(riskTotal)).show();
        $("#projectedscore").prev().show();
        $("#headingscore").html('65');
        $("#profilescore").html('65'); 
        //riskTotal = (frequency );
        //alert(( harshAcceleration + harshBraking + harshCornering + age + speeding + vm + vc));
        //console.log("%%%");
        //console.log(sliderValues[7] + " - "+time);

        //alert(self.pieOptions()[0]);

        self.pieOptions([15 - speeding10, harshAcceleration, harshBraking, harshCornering, frequency, time, accidents]);

        //alert(self.pieOptions()[0]);
    }


    self.drawplotgraph = function (data) {
        var cata = [];
        var chartSeriesData = [{
            name: 'Star Rating',
            data: [],
            color: "#00C3FF"
        }];
        var sym;
        var pointcolor;
        console.log("sdf");
        console.log(data);
        for (var i = 0; i < data.ratingchangecount; i++) {
           // console.log("njkl");
            cata.push(data.ratingchange[i].rating);
            //if (i != 1 && i != 2) {
            
            if (i > 0) {
                if (data.ratingchange[i].rating > data.ratingchange[i - 1].rating) {
            sym = 'url(../img/1up.png)';
            pointcolor = "#00FF00";
            } else {
            sym = 'url(../img/1down.png)';
            pointcolor = "#FF0000";
            }
            } else {
            sym = 'url(../img/1up.png)';
            pointcolor = "#00FF00";
            }

            //chartSeriesData[0].data.push({y:starRate.ratingchange[i].rating,marker:{symbol:sym}});
            if (i != data.ratingchangecount - 1) {
                chartSeriesData[0].data.push({ y: data.ratingchange[i].rating });
            } else {
                //chartSeriesData[0].data.push({y:starRate.ratingchange[i].rating,marker:{fillColor:pointcolor, radius: 17, states: { hover :{enabled: false}}}});
                chartSeriesData[0].data.push({ y: data.ratingchange[i].rating, marker: { symbol: "url(/images/star_orange_icon.png)"} });
                //url(http://highcharts.com/demo/gfx/sun.png)
            }
            

            //}
        }



         $('#plotGraphContainer').highcharts({				
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
                        series: chartSeriesData,
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
				        }

            });



            $('#pieGraphContainer').highcharts({
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false
                },
                credits: { enabled: false },
                title: { text: "" },
                tooltip: { enabled: true, formatter: function () {
                    return '<b>' + this.point.name +
                    '</b> is <b>' + Math.floor(this.y) + '</b>';
                } 
                },
                exporting: { enabled: false },
                plotOptions: {
                    pie: {
                        allowPointSelect: false,
                        dataLabels: { enabled: false },
                        showInLegend: true
                    }
                },
                legend: {
                    verticalAlign: 'top'
                },
                series: [{
                    type: 'pie',
                    name: 'Star Rating Composition',
                    data: [
					['Speeding', self.pieOptions()[0]],
					['Acceleration', self.pieOptions()[1]],
					['Braking', self.pieOptions()[2]],
					['Cornering', self.pieOptions()[3]],
					['Driving', self.pieOptions()[4]],
					['Time', self.pieOptions()[5]],
					['Impacts', self.pieOptions()[6]]
				]
                }]
            });

        }


        ko.bindingHandlers.slider = {
            init: function (element, valueAccessor, allBindingsAccessor) {
                console.log(self.sliderValues());
                //alert(self.sliderValues()[$(element).attr("rel")]);
                var options = allBindingsAccessor().sliderOptions || {};
                $(element).slider(options);
                $(element).find(".ui-slider-handle").html(Math.round(self.sliderValues()[$(element).attr("rel")] / 21 * 100) + "%");
                ko.utils.registerEventHandler(element, "slidechange", function (event, ui) {

                    var observable = valueAccessor();
                    //observable(ui.value);
                    //Application.masterVM.vmStarRating.sliderValues()[event.data.c] = (ui.value);
                    // Application.masterVM.vmStarRating.calculateRiskProfile();
                });
                ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                    $(element).slider("destroy");
                });
                ko.utils.registerEventHandler(element, "slide", function (event, ui) {
                    //var observable = valueAccessor();
                    //observable(ui.value);
                    self.sliderValues()[$(element).attr("rel")] = (ui.value);
                    self.calculateRiskProfile();
                    if ($(element).attr("rel") != 5 && $(element).attr("rel") != 6) {
                        $("#slideBoxValue" + $(element).attr("rel")).html(21 - ui.value + " Alerts");
                        $(element).find(".ui-slider-handle").html(Math.round(self.sliderValues()[$(element).attr("rel")] / 21 * 100) + "%");
                    }

                    if ($(element).attr("rel") == 5) {
                        $(element).find(".ui-slider-handle").html(Math.round(self.sliderValues()[$(element).attr("rel")] / 31 * 100) + "%");
                        $("#slideBoxValue" + $(element).attr("rel")).html(31 - self.sliderValues()[$(element).attr("rel")] + " Alerts");


                        switch (true) {
                            case self.sliderValues()[$(element).attr("rel")] >= 16:
                                $("#slideBoxValue" + $(element).attr("rel")).html("23-31 days");
                                break;
                            case self.sliderValues()[$(element).attr("rel")] <= 15 && (self.sliderValues()[$(element).attr("rel")] >= 10):
                                $("#slideBoxValue" + $(element).attr("rel")).html("16-22 days");
                                break;
                            case self.sliderValues()[$(element).attr("rel")] <= 10:
                                $("#slideBoxValue" + $(element).attr("rel")).html("0-15 days");
                                break;
                        }
                    }

                    if ($(element).attr("rel") == 6) {
                        $(element).find(".ui-slider-handle").html(Math.round(self.sliderValues()[$(element).attr("rel")] / 24 * 100) + "%");


                        switch (true) {
                            case self.sliderValues()[$(element).attr("rel")] >= 16:
                                $("#slideBoxValue" + $(element).attr("rel")).html("04AM-11PM");
                                break;
                            case self.sliderValues()[$(element).attr("rel")] <= 15:
                                $("#slideBoxValue" + $(element).attr("rel")).html("11PM-04AM");
                                break;
                        }
                    }


                });
            },
            update: function (element, valueAccessor) {
                var value = ko.utils.unwrapObservable(valueAccessor());
                if (isNaN(value)) value = 0;
                $(element).slider("value", value);

                if ($(element).attr("rel") != 5 && $(element).attr("rel") != 6) {
                    $(element).find(".ui-slider-handle").html(Math.round(self.sliderValues()[$(element).attr("rel")] / 21 * 100) + "%");
                    $("#slideBoxValue" + $(element).attr("rel")).html(21 - self.sliderValues()[$(element).attr("rel")] + " Alerts");
                }


                if ($(element).attr("rel") == 5) {
                    $(element).find(".ui-slider-handle").html(Math.round(self.sliderValues()[$(element).attr("rel")] / 31 * 100) + "%");
                    $("#slideBoxValue" + $(element).attr("rel")).html(31 - self.sliderValues()[$(element).attr("rel")] + " Alerts");


                    switch (true) {
                        case self.sliderValues()[$(element).attr("rel")] >= 16:
                            $("#slideBoxValue" + $(element).attr("rel")).html("23-31 days");
                            break;
                        case self.sliderValues()[$(element).attr("rel")] <= 15 && (self.sliderValues()[$(element).attr("rel")] >= 10):
                            $("#slideBoxValue" + $(element).attr("rel")).html("16-22 days");
                            break;
                        case self.sliderValues()[$(element).attr("rel")] <= 10:
                            $("#slideBoxValue" + $(element).attr("rel")).html("0-15 days");
                            break;
                    }



                }

                if ($(element).attr("rel") == 6) {
                    $(element).find(".ui-slider-handle").html(Math.round(self.sliderValues()[$(element).attr("rel")] / 24 * 100) + "%");


                    switch (true) {
                        case self.sliderValues()[$(element).attr("rel")] >= 16:
                            $("#slideBoxValue" + $(element).attr("rel")).html("04AM-11PM");
                            break;
                        case self.sliderValues()[$(element).attr("rel")] <= 15:
                            $("#slideBoxValue" + $(element).attr("rel")).html("11PM-04AM");
                            break;
                    }
                }


                //Application.masterVM.vmStarRating.calculateRiskProfile();
            }
        };

    }

function Vehicle(vehicleid, description, status, avatar, registration, trips) {
        var self = this;
        self.VehicleId = ko.observable(vehicleid);
        self.description = ko.observable(description);
        self.status = ko.observable(status);
        self.avatar = ko.observable(avatar);
        self.registration = ko.observable(registration);
        self.trips = ko.observableArray(trips);


        /*self.lastposition = function (data, event) {
            console.log("starsafe container");
            console.log(event.srcElement);
            //getlastposition(vehicle, container);

            return "gfsdd " + data.VehicleId();
        }*/

        ko.bindingHandlers.lastposition = {
            update: function (element, valueAccessor, allBindings) {
                // First get the latest data that we're bound to
                console.log("starsafe container");
                console.log($(element).parent().parent());
                console.log("value accessor ");
                console.log(valueAccessor().VehicleId());
                netstar_login('colossusadmin', 'c0l0ssus');
                getlastposition(valueAccessor().VehicleId(), $(element).parent().parent());
                setTimeout(function () { $('#preloader').hide(); }, 500);
                //$("");

            }
        };

    }

function Trip(VehicleId, tripid, drivetime, endtime, idletime, maxspeed, startdate, startometer, totaldistance, triptime) {
        var self = this;
        self.VehicleId = ko.observable(VehicleId);
        self.tripid = ko.observable(tripid);
        self.drivetime = ko.observable(drivetime);
        self.endtime = ko.observable(endtime);
        self.idletime = ko.observable(idletime);
        self.maxspeed = ko.observable(maxspeed);
        self.startdate = ko.observable(startdate);
        self.startometer = ko.observable(startometer);
        self.totaldistance = ko.observable(totaldistance);
        self.triptime = ko.observable(triptime);
    }

function StarsightViewModel() { 
    
        var self = this;

        self.tripstoshow = ko.observableArray();

    
    
    
    }