var Model = function () {
    var self = this;
    var clientJSON = {
        partitionKey: "", rowKey: "", name: "", phoneNumber: "", email: ""
    };

    self.code = ko.observable("");

    self.client = ko.mapping.fromJS(clientJSON);

    self.init = function () {
        window.localStorage.removeItem("client");

        $("#documentNumber").change(function () {
            var documentNumber = self.client.rowKey().trim();

            if (documentNumber.length > 0) {
                self.search(documentNumber);
            }
        });
    };

    self.search = function (documentNumber) {

        $.ajax({
            url: ("api/ValidateCode/GetClient/" + documentNumber),
            type: "GET",
            contentType: 'application/json;charset=utf-8',
            success: function (client) {
                console.log(client);

                if (client) {
                    ko.mapping.fromJS(client, self.client);
                }
            },
            error: function (msg) {
                console.log(msg);
            }
        });
    };

    self.validate = function () {
        if (Utils.validateForm(".validateForm")) {
            var wr = {
                client: ko.toJS(self.client),
                code: self.code()
            };

            Utils.loading();
            $.ajax({
                url: "api/ValidateCode/SaveClient",
                type: "POST",
                data: JSON.stringify(wr),
                contentType: "application/json;charset=utf-8",
                success: function (data) {
                    if (!data.isUsed) {
                        window.localStorage.setItem("client", JSON.stringify(data))
                        window.location.href = "Games";
                    }
                    else {
                        window.location.href = "Result?gameId=" + data.code;
                    }
                },
                error: function (msg) {
                    Utils.showErrorMessage(msg.responseText);
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