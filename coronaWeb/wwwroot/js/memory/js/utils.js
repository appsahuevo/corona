﻿var Utils = function () {
    var _parameters = new Map();
    return {
        getParameter: function (paramId) {
            return _parameters.get(paramId);
        },
        loadParams: function (data) {
           
            for (var i = 0; i < data.length; i++) {
                var item = data[i];

                _parameters.set(item.RowKey, item.Value);
            }
        },
        setStyle: function (element, property, value) {
            var style = $(element).attr("style");

            if (!style) {
                style = "";
            }
            else if (style.length > 0) {
                style += ";";
            }

            style += property + ":" + value + " !important";

            $(element).attr("style", style);
        }
    }
}();