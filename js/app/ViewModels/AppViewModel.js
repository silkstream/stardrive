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
                url: '/json/successlogin.js',
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
                    Application.masterVM.vmProfile.WorkAddress(data[0].Stardriveuser.workaddrresscords);
                    Application.gotoPage('page-profile');
                },
                dataType: 'json'
            });


            Application.masterVM.vmWeather.pullWeather();
            Application.masterVM.vmMessages.pullMessages();
            Application.masterVM.vmAlerts.pullAlerts();

           

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

function Message(msgid, fromid, fromname, toid, toname, subject, message, msgdate, reminder) {
    var self = this;
    self.msgid = ko.observable(msgid);
    self.fromid = ko.observable(fromid);
    self.fromname = ko.observable(fromname);
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

    self.pullMessages = function () {

        $.ajax({
            url: '/json/getmessages.js',
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
                    msgdate = msgdate.split("-");
                    msgdate = new Date(msgdate[0], msgdate[1], msgdate[2]);

                    var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

                    msgdate = monthNames[msgdate.getMonth()] + " " + msgdate.getDate() + ', ' + msgdate.getUTCFullYear();

                    var reminder = data[i].Message.reminder_id;
                    if (data[i].Message.reminder_id != "0") {
                        fromname = "Reminder";
                    }

                    Application.masterVM.vmMessages.allmessages.push(new Message(msgid, fromid, fromname, toid, toname, subject, message, msgdate, reminder));



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

}


function AlertsViewModel() {
    var self = this;
    self.allalerts = ko.observableArray();


    self.pullAlerts = function () {

        $.ajax({
            url: '/json/getalerts.js',
            data: {},
            success: function (data) {
                console.log(data);
                for (var i = 0; i < data.length; i++) {

                    var alert_id = data[i].Useralert.id;
                    var alert_type = data[i].Useralert.alert_type;

                    var alert_location = data[i].Alertcords[0] + " - " + data[i].Alertcords[1];
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


