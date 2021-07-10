var Utils = function () {
    var truncateLen = 8;
    var urlBase = "https://oneoff-api-qa.azurewebsites.net";
    //var urlBase = "https://localhost:44313";
    var ePaycoPublicKey = "4fdc29ec907e9cd122512436bda72629";
    var apiKeyIpStack = "6d0aa3b8871508bf09a7702d9efb1fe8";

    return {
        loading: function () {
            //document.getElementById("loading").style.display = "block";
            $('.loader-container').addClass('show-loader');
        },
        loaded: function () {
            //document.getElementById("loading").style.display = "none";

            $('.loader-container').removeClass('show-loader');
        },
        refresh: function () {
            location.reload();
        },
        ajaxSync: function (url, action, obj) {
            return $.ajax({
                url: url,
                type: action,
                data: obj,
                contentType: "application/json;charset=utf-8",
                async: false
            });
        },
        selectMenu: function (menuid) {
            console.log($('#' + menuid));
            $('#' + menuid).addClass("active2");
            //$('#' + menuid).parents("li").addClass("active");
        },
        selectSubmenu: function (menuid) {
            console.log($('#' + menuid));
            $('#' + menuid).addClass("active");
            //$('#' + menuid).parents("li").addClass("active");
        },
        adjustIcons: function () {
            $(".glyphicon-chevron-up").addClass("fa fa-angle-up");
            $(".glyphicon-chevron-down").addClass("fa fa-angle-down");
        },
        getApiUrl: function (path) {
            return urlBase + "/" + path;
        },
        getQueryParams: function () {
            qs = document.location.search;
            qs = qs.split('+').join(' ');

            var params = {},
                tokens,
                re = /[?&]?([^=]+)=([^&]*)/g;

            while (tokens = re.exec(qs)) {
                params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
            }

            return params;
        },
        getLocation: function (ip) {
            var ajax = $.ajax({
                url: "api/Location/GetLocation/" + ip,
                method: 'GET',
                success: function (data) {
                    window.sessionStorage.setItem(ip, data);
                },
                error: function (msg) {
                    console.log(msg);
                }
            });

            return ajax;
        },
        addParamToUrl: function (url, param, value) {
            var hash = {};
            var parser = document.createElement('a');

            parser.href = url;

            var parameters = parser.search.split(/\?|&/);

            for (var i = 0; i < parameters.length; i++) {
                if (!parameters[i])
                    continue;

                var ary = parameters[i].split('=');
                hash[ary[0]] = ary[1];
            }

            hash[param] = value;

            var list = [];
            Object.keys(hash).forEach(function (key) {
                list.push(key + '=' + hash[key]);
            });

            parser.search = '?' + list.join('&');
            return parser.href;
        },
        redirect: function (url) {
            window.location.href = url;
        },
        getEPaycoPublicKey: function () {
            return ePaycoPublicKey;
        },
        getCurrentTenant: function () {
            //return "1234";
            return $("#tid").val();
        },
        getCountryCode: function () {
            return $("#countryCode").val();
        },
        getCurrentUserJSON: function () {
            return JSON.parse($("#uJSON").val());
        },
        getCurrentUsername: function () {
            return $("#uname").val();
        },
        getCurrentUserFullname: function () {
            return $("#fullname").val();
        },
        getCurrentUser: function () {
            return $("#uid").val();
        },
        getCurrentStore: function () {
            var storeId = localStorage.getItem("storeId");
            return storeId;
        },
        getCurrentStoreName: function () {
            return localStorage.getItem("storeName");
        },
        getStatusName: function (status, pre) {
            var result = "";
            pre = pre == null ? "" : pre + " ";
            switch (status) {
                case "pending":
                    result = pre + "Pendiente";
                    break;
                case "paid":
                    result = "Pagado";
                    break;
                case "partially_paid":
                    result = "Pago parcial";
                    break;
                case "fulfilled":
                    result = "Entregado";
                    break;
                case "voided":
                    result = "Cancelado";
                    break;
                case "unfulfilled":
                    result = "No entregado";
                    break;
                case "partial":
                    result = "Entregado parcial";
                    break;
                case "refunded":
                    result = "Reintegrado";
                    break;
                case "Process":
                    result = "Procesando...";
                    break;
                default:
                    result = pre + "Pendiente";
            }

            return result;
        },
        getStatusColor: function (status) {
            var result = "";

            switch (status) {
                case "pending":
                    result = "danger";
                    break;
                case "paid":
                    result = "success";
                    break;
                case "partially_paid":
                    result = "warning";
                    break;
                case "fulfilled":
                    result = "success";
                    break;
                case "voided":
                    result = "danger";
                    break;
                case "partial":
                    result = "warning";
                    break;
                case "refunded":
                    result = "danger";
                    break;
                case "Process":
                    result = "warning";
                    break;
                default:
                    result = "danger";
                    break;
            }

            return result;
        },

        setStore: function (storeId, storeName) {
            localStorage.setItem("storeId", storeId);
            localStorage.setItem("storeName", storeName);
        },
        setStoresPerUser: function (stores) {
            localStorage.setItem("storesPerUser", JSON.stringify(stores));
        },
        getStoresPerUser: function () {
            if (localStorage.storesPerUser) {
                return JSON.parse(localStorage.storesPerUser);
            } else {
                return [];
            }
        },
        showSuccessMessage: function (title, msg) {
            toastr.options = {
                "closeButton": false,
                "debug": false,
                "newestOnTop": false,
                "progressBar": false,
                "positionClass": "toast-bottom-center",
                "preventDuplicates": false,
                "onclick": null,
                "showDuration": "300",
                "hideDuration": "1000",
                "timeOut": "5000",
                "extendedTimeOut": "1000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
            };

            toastr.success(msg, title);
        },
        showErrorMessage: function (title, msg) {
            toastr.options = {
                "closeButton": false,
                "debug": false,
                "newestOnTop": false,
                "progressBar": false,
                "positionClass": "toast-bottom-center",
                "preventDuplicates": false,
                "onclick": null,
                "showDuration": "300",
                "hideDuration": "1000",
                "timeOut": "5000",
                "extendedTimeOut": "1000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
            };

            if (!msg && !title) {
                toastr.error("", "Se presentó un error inesperado. Por favor intenta de nuevo");
            }
            else {
                toastr.error(msg, title);
            }
        },
        loadData: function (url, successCallback, errorCallback) {
            $.ajax({
                url: url,
                dataType: "json",
                method: "GET",
                //data: ajaxData,
                cache: false,
                success: function (results) {
                    //for (var i = 0; i < newMarkers.length; i++) {
                    //    newMarkers[i].setMap(null);
                    //}
                    //allMarkers = results;
                    //placeMarkers(results);
                    if (successCallback) {
                        successCallback(results);
                    }
                },
                error: function (e) {
                    console.log(e);

                    if (errorCallback) {
                        errorCallback();
                    }
                }
            });
        },
        validateForm: function (selector) {
            var isValid = true;
            var errorClass = "parsley-error";
            $(".required").removeClass(errorClass);

            $(selector + " input.required").each(function (index, element) {
                var val = $(this).val();
                var inputType = $(this).attr("type");

                if (val.trim().length == 0) {
                    $(this).addClass(errorClass);
                    isValid = false;
                }

                if (inputType == "email") {
                    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

                    if (re.test(val) == false) {
                        $(this).addClass(errorClass);
                        isValid = false;
                    }
                }
            });

            $(selector + " textarea.required").each(function (index, element) {
                var val = $(this).val();
                var inputType = $(this).attr("type");

                if (val.trim().length == 0) {
                    $(this).addClass(errorClass);
                    isValid = false;
                }
            });

            $(selector + " select.required").each(function (index, element) {
                var val = $(this).val();

                if (val == null) {
                    $(this).addClass(errorClass);
                    isValid = false;
                }
                else if (val.trim().length == 0) {
                    $(this).addClass(errorClass);
                    isValid = false;
                }

            });

            $(selector + " input.validate-required").each(function (index, element) {
                var val = $(this).val();
                var inputType = $(this).attr("type");

                if (inputType == "email" && val.trim().length > 0) {
                    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

                    if (re.test(val) == false) {
                        $(this).addClass(errorClass);

                        isValid = false;
                    }
                }
            });

            if (!isValid) {
                Utils.showErrorMessage("Campos sin diligenciar o con errores");
            }

            return isValid;
        },
        randomString: function (length,) {

            var result = '';
            var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

            for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
            return result;
        },
        truncate: function (text, length, id) {
            try {
                var textTruncated = "";
                length = (length != null && length != "") ? length : truncateLen;

                if (text.length > length) {
                    textTruncated = text.substr(0, length) + "...";
                }
                else {
                    textTruncated = text;
                }

                if (id) {
                    setTimeout(function () {
                        $("#" + id).attr({ title: text });
                    }, 500);
                }

                return textTruncated;

            } catch (e) {
                return text;
            }
        },
        printCashCount: function (cashCountId) {

            $.ajax({
                url: this.getApiUrl("api/PrintCashCount/GetCashCountDocument/" + this.getCurrentTenant() + "/" + this.getCurrentStore() + "/" + cashCountId),
                type: "GET",
                success: function (data) {
                    console.log(data);
                    window.open(data);

                    //return data;
                },
                error: function (msg) {
                    console.log(msg);
                    // Utils.loaded();
                }
            });

        },
        sendNotification: function (orderId, title, body, createByUserId, tenantId, url) {
            var wr = {
                OrderId: orderId,
                Title: title,
                Body: body,
                EmailParameters: "",
                UserId: createByUserId,
                TenantId: tenantId,
                PageInfo: url
            };

            $.ajax({
                url: Utils.getApiUrl("api/Notification/SendNotification"),
                type: "POST",
                data: JSON.stringify(wr),
                contentType: "application/json;charset=utf-8",
                success: function () {

                },
                error: function (msg) {
                    console.log(msg);
                }
            });
        },
        renderNotifications: function () {
            var notification = JSON.parse(window.localStorage.getItem("Notification"));

            if (notification != null && notification.length > 0) {
                var html = "";

                $.each(notification, function (i, item) {
                    html += '<div class="dropdown-link" style="background-color: none !important">';
                    html += '<div class="media mg-l-15 mg-r-15 mg-b-10">';
                    html += ' <div class="media-body">';
                    html += '    <p><a href="OrderDetail?orderId=' + item.orderId + '&back=Orders" style="color:black;">' + item.orderName + '</a> Nuevo pedido</p>';
                    html += '      <span>' + moment(item.date).format("YYYY/MM/DD hh:mm a") + '</span>';
                    html += '  </div>';
                    html += '        &nbsp; <a href="javascript: Utils.removeNotification(\'' + item.orderId + '\');" class=" tx-center mg-t-10" title="Eliminar"><i class="far fa-trash-alt"></i></a>';
                    html += ' </div><!-- media -->';
                    html += '</div>';
                });

                $("#notificationList").html(html);
                $("#notificationSize").show();
                $("#notificationSize").html(notification.length > 9 ? "--" : notification.length);

                setTimeout(function () {
                    $("body").click(function () {
                        document.getElementById('notificationSound').play();
                    });

                    document.getElementById('notificationSound').play();
                    document.getElementById('notificationSound').onplay = function () {
                        $("body").unbind();
                    };
                }, 500);
            }
            else {
                $("#notificationList").html("<div style='text-aling:center;margin: 20px;'>Sin notificaciones</>");
                $("#notificationSize").hide();
                $("#notificationSize").html(0)
                setTimeout(function () {
                    document.getElementById('notificationSound').pause();
                }, 500);
            }
        },
        removeNotification: function (orderId) {
            var notification = JSON.parse(window.localStorage.getItem("Notification"));
            var newNotification = [];

            if (notification != null && notification.length > 0) {
                $.each(notification, function (i, item) {
                    if (item.orderId != orderId) {
                        newNotification.push(item);
                    }
                });

                window.localStorage.setItem("Notification", JSON.stringify(newNotification));
                Utils.renderNotifications();
            }
        },
        guid: function () {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        }
    };
}();