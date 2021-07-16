var Model = function () {
    var self = this;

    self.user = ko.observable("");
    self.pwd = ko.observable("");

    self.init = function () {

        Utils.loaded();

    };

    self.login = function () {
        if (Utils.validateForm(".validateForm")) {
            Utils.loading();
            $.ajax({
                url: "api/Report/Login/" + self.user() + "/" + self.pwd(),
                type: "GET",
                contentType: 'application/json;charset=utf-8',
                success: function (game) {

                    if (game) {
                        $("#loginpanel").hide();
                        $("#reportpanel").show();
                        self.getData();
                    }
                    else {
                        Utils.showErrorMessage("Usuario y contraseña no validos");
                        Utils.loaded();
                    }

                },
                error: function (msg) {
                    Utils.showErrorMessage("Ocurrio un error al intentar ingresar, valida nuevamente");
                    Utils.loaded();
                }
            });
        }
    };

    self.getData = function () {

        Utils.loading();
        $.ajax({
            url: "api/Report/GetReport",
            type: "GET",
            contentType: 'application/json;charset=utf-8',
            success: function (data) {

                $("#report").dxDataGrid({
                    dataSource: data,
                    allowFiltering: true,
                    allowExpandAll: true,
                    columnAutoWidth: true,                    
                    groupPanel: {
                        visible: true
                    },
                    grouping: {
                        autoExpandAll: true,
                    },
                    filterRow: { visible: true },
                    searchPanel: { visible: true, placeholder: "Buscar" },
                    sorting: {
                        mode: "multiple"
                    },
                    scrolling: {
                        mode: "virtual"
                    },
                    headerFilter: {
                        visible: true
                    },
                    "export": {
                        enabled: true,
                        fileName: "coronagame"
                    },
                    hoverStateEnabled: true,
                    columns: [
                        {
                            dataField: "clientId",
                            caption: "Documento"
                        },

                        {
                            dataField: "clientName",
                            caption: "Nombre"
                        },
                        {
                            dataField: "clientPhoneNumber",
                            caption: "Teléfono"
                        },
                        {
                            dataField: "clientEmail",
                            caption: "Email"
                        },
                        {
                            dataField: "creationDate",
                            caption: "Fecha",
                            dataType: "date",
                            format: "dd/MM/yyyy HH:mm"
                        },
                        {
                            dataField: "gameName",
                            caption: "Juego"
                        },
                        {
                            dataField: "rowKey",
                            caption: "Código"
                        },
                        {
                            dataField: "prizeName",
                            caption: "Premio"
                        },
                        {
                            dataField: "prizeValue",
                            caption: "Valor"
                        }
                    ],
                    summary: {
                        totalItems: [{
                            displayFormat: "Cantidad: {0}",
                            column: "DocumentId",
                            summaryType: "count"
                        }
                        ]
                    }

                });

                Utils.loaded();
            },
            error: function (msg) {
                Utils.showErrorMessage("Ocurrio un error al intentar consultar los datos, valida nuevamente");
                Utils.loaded();
            }
        });

    };
};

var vm = new Model;
ko.applyBindings(vm);

function preinit() {
    vm.init();
}