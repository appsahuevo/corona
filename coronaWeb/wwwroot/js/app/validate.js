var Model = function () {
    var self = this;
   
    var clientJSON = {
        document: "", name: "", phoneNumber: "", email: "", code: ""
       
    };
    
    self.client = ko.mapping.fromJS(clientJSON);
    
    self.init = function () {
              
    };
           
    self.validate = function () {
        if (Utils.validateForm(".validateForm")) {
                        
            var client = ko.toJS(self.client);

            Utils.loading();
            $.ajax({
                url: "api/ValidateCode/",
                type: "POST",
                data: JSON.stringify(client),
                contentType: "application/json;charset=utf-8",
                success: function (data) {
                   
                },
                error: function (msg) {
                    Utils.showErrorMessage();
                    Utils.loaded();
                }
            });
        }
    };
};

var vm = new Model;
ko.applyBindings(vm);

function preinit() {
    vm.init();
}