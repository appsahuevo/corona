var Model = function () {
    var self = this;
    var clientJSON = {
        partitionKey: "", rowKey: "", name: "", phoneNumber: "", email: ""
    };

    self.code = ko.observable("");
    self.check1 = ko.observable(false);
    self.check2 = ko.observable(false);

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
        Utils.loading();
        $.ajax({
            url: ("api/ValidateCode/GetClient/" + documentNumber),
            type: "GET",
            contentType: 'application/json;charset=utf-8',
            success: function (client) {
                console.log(client);

                if (client) {
                    ko.mapping.fromJS(client, self.client);
                }

                Utils.loaded();
            },
            error: function (msg) {
                console.log(msg);
                Utils.loaded();
            }
        });
    };

    self.validate = function () {
        if (Utils.validateForm(".validateForm")) {

            if (self.check1() == false) {
                Utils.showErrorMessage("Por favor, acepté los términos y condiciones");
                return;
            }
            if (self.check2() == false) {
                Utils.showErrorMessage("Por favor, acepté el manejo de datos personales");
                return;
            }

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
                        swal({
                            title: "El código ya fue utilizado",
                            text: "¿Deseas ver el premio?",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonClass: "btn-purple",
                            cancelButtonClass: "btn-purple",
                            confirmButtonText: "Si, ver!",
                            cancelButtonText: "No, cancelar!",
                            closeOnConfirm: true,
                            closeOnCancel: true
                        },
                            function (isConfirm) {
                                if (isConfirm) {
                                    window.location.href = "Result?gameId=" + data.code;
                                }
                            });
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