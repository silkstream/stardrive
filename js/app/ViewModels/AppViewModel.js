ko.async = {
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

    this.LoginName = ko.observable("Email Address");

    this.UserPassword = ko.observable("123456");

    this.LoginFail = ko.observable(false);

    this.LoginData = ko.observable();

    this.ErrorMessage = ko.computed(function () {
        return "You entered " + this.UserPassword() + " as a password";
    }, this);

    this.doLogin = function () {
        //Do a login

        if (this.UserPassword() == "123456") {


            $.ajax({
                url: window.location.pathname + '/../json/successlogin.js',
                data: { username: this.LoginName(), password: this.UserPassword() },
                success: function (data) {
                    // console.log(data[0].Stardriveuser);
                    Application.masterVM.vmProfile.FirstName(data[0].Stardriveuser.username);
                    Application.masterVM.vmProfile.Surname(data[0].Stardriveuser.surname);
                    Application.masterVM.vmProfile.UserId(data[0].Stardriveuser.id);
                    Application.masterVM.vmProfile.Image("http://stardrive.cloudapp.net/" + data[0].Stardriveuser.userimage);
                    //Application.masterVM.vmProfile.Password(data[0].Stardriveuser.username);
                    Application.masterVM.vmProfile.Email(data[0].Stardriveuser.emailaddress);
                    Application.masterVM.vmProfile.HomeAddress(data[0].Stardriveuser.homeaddresscords);
                    Application.masterVM.vmProfile.WorkAddress(data[0].Stardriveuser.workaddresscords);

                    Application.gotoPage('page-profile');
                },
                dataType: 'json'
            });


            Application.masterVM.vmWeather.pullWeather();
            Application.masterVM.vmMessages.pullMessages();
            Application.masterVM.vmAlerts.pullAlerts();
            Application.masterVM.vmFriends.pullFriends();



        }
        else {
            this.LoginFail(true);
        }
    }
}

function ProfileViewModel() {
    self = this;
    self.FirstName = ko.observable();
    self.Surname = ko.observable();
    self.UserId = ko.observable();
    self.Image = ko.observable();
    self.Password = ko.observable();
    self.Email = ko.observable();
    self.HomeAddress = ko.observable();
    self.WorkAddress = ko.observable();

    self.FullName = ko.computed(function () {
        return self.FirstName() + " " + self.Surname();
    }, self);
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


    self.setchosenmsgfrnd = function (friend_id) {
        var theid = $("#friend_id").val();
        var thename = $("#friend_name").val();
        var myname = Application.masterVM.vmProfile.FirstName + " " + Application.masterVM.vmProfile.SurName;
        var myid = Application.masterVM.vmProfile.UserId

        msgobj = new Message('zz', theid, thename, myname, myid, "", "", "2014-02-02", "0", "")
        Application.masterVM.vmMessages.chosenmsg(msgobj);
        //Application.masterVM.vmMessages.chosenmsg();
        $('.friendModal').dialog('close');
        Application.gotoPage('page-messages');
    }


    self.delmessage = function () {

        Application.masterVM.vmMessages.allmessages.remove(this);

    }


    self.sendmessage = function (mydata) {
        //alert($("#newmessage").val());
        Application.masterVM.vmMessages.outbox.push(new Message('zz', mydata.toid(), mydata.toname(), mydata.fromid(), mydata.fromname(), mydata.subject(), $("#newmessage").val(), "2014-02-02", "0", ""));

        Application.gotoPage('page-starsocial');

    }




    self.pullMessages = function () {

        $.ajax({
            url: window.location.pathname + '/../json/getmessages.js',
            data: {},
            success: function (data) {
                // console.log(data);
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
                console.log(Application.masterVM.vmMessages.allmessages);

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
                Application.masterVM.vmWeather.degree(data.main.temp + "");
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

                    alert_date = monthNames[alert_date.getMonth()] + " " + alert_date.getMonth() + ', ' + alert_date.getUTCFullYear();

                    var alert_description = "";
                    switch (alert_type) {
                        case "Speeding":
                            alert_description = "Vehicle with registration " + data[i].Vehicle.registration + " overspeeding " + data[i].Useralert.speedlimit + "km/h";
                            break;
                        case "Cornering":
                            alert_description = "Vehicle with registration " + data[i].Vehicle.registration + " harsh cornering";
                            break;
                        case "Braking":
                            alert_description = "Vehicle with registration " + data[i].Vehicle.registration + " harsh breaking";
                            break;
                        case "Time Rule":
                            alert_description = "Vehicle with registration " + data[i].Vehicle.registration + " exceeding time rule";
                            break;
                        case "Geo-fencing":
                            alert_description = "Vehicle with registration " + data[i].Vehicle.registration + " " + data[i].Useralert.zone_type + ": " + data[i].Zone.zonename;
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


    self.pullFriends = function () {

        $.ajax({
            url: window.location.pathname + '/../json/getfriends.js',
            data: {},
            success: function (data) {

                for (var i = 0; i < data.length; i++) {

                    var friend_id = "";
                    var friend_name = "";
                    var friend_img = "";

                    if (Application.masterVM.vmProfile.UserId == data[i].UserFrom.id) {

                        friend_id = data[i].UserTo.id;
                        friend_name = data[i].UserTo.username + " " + data[i].UserTo.surname;
                        friend_img = data[i].UserTo.userimage;
                    } else {


                        friend_id = data[i].UserFrom.id;
                        friend_name = data[i].UserFrom.username + " " + data[i].UserFrom.surname;
                        friend_img = data[i].UserFrom.userimage;

                    }

                    Application.masterVM.vmFriends.allfriends.push(new Friend(friend_id, friend_name, friend_img));
                }


            },
            dataType: 'json'


        });


    };
}

function Routes(from, to) {
    var self = this;
    self.from = ko.observable(from);
    self.to = ko.observable(to);
   

}

function MapsViewModel() {
    var self = this;
    self.chosenalert = ko.observable();
    self.chosenroute = ko.observable();
    self.whattoshow = ko.observable();
    self.initmap = '0';

    self.abouttoshow = function (type) {
        alert("checking");
        return type === this.whattoshow();
    };



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


    self.setchosenroute = function () {
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

        tripbobj = [{ lat: homeaddress[0], lon: homeaddress[1] }, { lat: workaddress[0], lon: workaddress[1]}];

        showtrip(tripbobj);
        
         var   homeaddrezz = (Application.masterVM.vmProfile.HomeAddress());
         var workaddrezz = (Application.masterVM.vmProfile.WorkAddress());

      //  alert(homeaddrezz);
       // alert(workaddrezz);

        var routeobj = new Routes(homeaddrezz, workaddrezz);

        Application.masterVM.vmMaps.chosenroute(routeobj);
        

    }



}
