var Model = function () {
    var self = this;
    var gameId;
    var gameJSON = {
        partitionKey: "", rowKey: "", clientId: "", clientName: "", clientPhoneNumber: "", clientEmail: "",
        gameName: "", prizeId: "", prizeName: "", prizeImageUrl: "", PrizeLevel: "",
        prizeValue: "", creationDate: "",
    };

    self.game = ko.mapping.fromJS(gameJSON);

    self.init = function () {
        Utils.loading();
        window.localStorage.removeItem("client");

        var parameters = Utils.getQueryParams();

        if ((gameId = parameters.gameId) != null) {
            $.ajax({
                url: ("api/Game/GetGame/" + gameId),
                type: "GET",
                contentType: 'application/json;charset=utf-8',
                success: function (game) {
                    console.log(game);

                    if (game) {
                        ko.mapping.fromJS(game, self.game);
                    }
                    else {
                        window.location.href = "Index";
                    }
                    Utils.loaded();
                },
                error: function (msg) {
                    window.location.href = "Index";
                    Utils.loaded();
                }
            });
        }
        else {
            window.location.href = "Index";
        }
    };
};

var vm = new Model;
ko.applyBindings(vm);

function preinit() {
    vm.init();
}