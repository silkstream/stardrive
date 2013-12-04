function LoginViewModel() {

    this.LoginName = ko.observable("Email Address");

    this.UserPassword = ko.observable("$quirrel060");

    this.LoginFail = ko.observable(false);

    this.ErrorMessage = ko.computed(function () {
        return "You entered " + this.UserPassword() + " as a password";
    }, this);

    this.doLogin = function () {
        //Do a login
        if (this.UserPassword() == "$quirrel060")
        {
            Application.masterVM.vmProfile.FirstName(this.LoginName());
            Application.gotoPage('page-profile')
        }
        else
        {
            this.LoginFail(true);
        }
    }
}

function ProfileViewModel() {
    self = this;
    self.FirstName = ko.observable();
    self.Surname = ko.observable();
    self.FullName = ko.computed(function () {
        return self.FirstName() + " " + self.Surname();
    }, self);
}

function MessagesViewModel() {
    this.from = ko.observable();
    this.subject = ko.observable();
    this.message = ko.observable();
}