var BRAINYMO = BRAINYMO || {};
var reset = true;
var client = { clientId: "", clientName: "", clientEmail: "", score: 0 };
var end = false;
var gamePrize;
var wr;

BRAINYMO.Game = (function () {

    var activeCards = [];
    var numOfCards;
    var cardHitCounter;
    var card;
    var timer;
    var storage;
    var incrementScore;

    /**
     * Method that will be invoked on card click
     */
    function handleCardClick() {


        var connection = $(this).data('connection');
        var hit;

        // Set card in active state
        // 'this' needs to be attached to context of card which is clicked
        if (!$(this).hasClass('active')) {
            $(this).addClass('active');
            activeCards.push($(this));
            //reset cardHitCounter
            if (reset) {
                cardHitCounter = 0;
                reset = false;
            }


            // If user click on two cards then check
            if (activeCards.length == 2) {
                hit = checkActiveCards(activeCards);
            }

            if (hit === true) {
                cardHitCounter++;
                activeCards[0].add(activeCards[1]).unbind().addClass('wobble cursor-default');
                activeCards = [];

                //score
                $('#score').text(parseInt($('#score').text()) + incrementScore);

                // Game End
                if (cardHitCounter === (numOfCards)) {
                    // Reset active cards
                    activeCards = [];
                    // Reset counter
                    cardHitCounter = 0;
                    // End game
                    setTimeout(function () {
                        endGame();
                    }, 500);


                }
            }
            // In case when user open more then 2 cards then automatically close first two
            else if (activeCards.length === 3) {
                for (var i = 0; i < activeCards.length - 1; i++) {
                    activeCards[i].removeClass('active');
                }
                activeCards.splice(0, 2);
            }
        }
    }

    function endGame() {
        //timer.stopTimer();
        timer.youWin();

        // Retrieve current time
        var time = timer.retrieveTime();

        // Retrieve time from storage
        var timeFromStorage = storage.retrieveBestTime();

        // if there's already time saved in storage check if it's better than current one
        if (timeFromStorage != undefined && timeFromStorage != '') {
            // if current game time is better than one saved in store then save new one
            if (time.minutes < timeFromStorage.minutes || (time.minutes == timeFromStorage.minutes && time.seconds < timeFromStorage.seconds)) {
                storage.setBestTime(time);
            }
        }
        // else if time is not saved in storage save it
        else {
            storage.setBestTime(time);
        }
    }

    function checkActiveCards(connections) {
        return connections[0].data('connection') === connections[1].data('connection');
    }

    return function (config) {

        /**
         * Main method for game initialization
         */
        this.startGame = function () {
            card = new BRAINYMO.Card();
            timer = new BRAINYMO.Timer();
            storage = new BRAINYMO.Storage();
            numOfCards = config.cards.length;
            cardHitCounter = 0;
            incrementScore = config.event.Score;
            card.attachCardEvent(handleCardClick, config);
        };


        /**
         * After game initialization call this method in order to generate cards
         */
        this.generateCardSet = function () {
            // Generate new card set
            card.generateCards(config.cards);
            // Reset active cards array
            activeCards = [];

            // Reset timer
            timer.stopTimer();
            // Set timer
            timer.startTimer(config.event.Time);
        };

        this.startGame();
    }

})();

BRAINYMO.Card = (function () {

    // Private variables
    var $cardsContainer = $('.cards-container');
    var $cardTemplate = $('#card-template');
    var count = 0;

    /**
     * Private method
     * Take card template from DOM and update it with card data
     * @param {Object} card - card object
     * @return {Object} template - jquery object
     */
    function prepareCardTemplate(card) {
        var template = $cardTemplate
            .clone()
            .removeAttr('id')
            .removeClass('hide')
            .attr('data-connection', card.RowKey);

        // If card has background image
        if (card.ImgUrl != '' && card.ImgUrl != undefined) {
            template.find('.back').css({
                'background': 'url(' + card.ImgUrl + ') no-repeat center center',
                'background-size': 'cover'
            });
        }
        // Else if card has no background image but has text
        //else if (card.backTxt != '' && card.backTxt != undefined) {
        //    template.find('.back > label').html(card.backTxt);
        //}

        return template;
    }

    /**
     * Private method
     * Method for random shuffling array
     * @param {Object} cardsArray - array of card objects
     * @return {Object} returns random shuffled array
     */
    function shuffleCards(cardsArray) {
        var currentIndex = cardsArray.length, temporaryValue, randomIndex;

        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = cardsArray[currentIndex];
            cardsArray[currentIndex] = cardsArray[randomIndex];
            cardsArray[randomIndex] = temporaryValue;
        }

        return cardsArray;
    }

    return function () {

        /**
         * Public method
         * Prepare all cards and insert them into DOM
         * Before inserting new set of cards method will erase all previous cards
         * @param {Object} cards - array of card objects
         */
        this.generateCards = function (cards) {
            var templates = [];
            var preparedTemplate;
            var numOfCards = cards.length * 2;

            console.log(cut);

            // se utiliza para armar el rentangulo con 5, 4, 3, o 2 columnas
            var cut = (numOfCards % 4 == 0 ? 4 : (numOfCards % 3 == 0 ? 3 : 2));
            //casa puntual 
            var cut = numOfCards == 4 ? 2 : cut;
            var count = 0;

            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                // true for mobile device
                cut = 3;
            } 
            console.log(cut);

            // Prepare every card and push it to array
            cards.forEach(function (card) {
                preparedTemplate = prepareCardTemplate(card);
                templates.push(preparedTemplate);
                preparedTemplate = prepareCardTemplate(card);

                //duplicate
                templates.push(preparedTemplate);
            });

            // Shuffle card array
            templates = shuffleCards(templates);

            // Hide and empty card container
            $cardsContainer.hide().empty();

            // Append all cards to cards container

            $.each(templates, function (i, card) {
                $cardsContainer.append(card);
                // para definir cuando se termina una fila
                count++;

                if (count == cut) {
                    count = 0;
                    $cardsContainer.append($('</br>'));
                }
            });


            // Show card container
            $cardsContainer.fadeIn('slow');
        };

        /**
         * Public method
         * Attach click event on every card
         * Before inserting new set of cards method will erase all previous cards
         * @param {Function} func - function that will be invoked on card click
         */
        this.attachCardEvent = function (func) {
            $cardsContainer.unbind().on('click', '.flip-container', function () {
                func.call(this);
            });
        }
    }

})();

BRAINYMO.Timer = (function () {

    var $timer = $('.timer');
    var $seconds = $timer.find('#seconds');
    var $minutes = $timer.find('#minutes');
    var $bestTimeContainer = $timer.find('.time');


    var minutes, seconds;

    function decorateNumber(value) {
        return value > 9 ? value : '0' + value;
    }

    return function () {
        var interval;
        var storage = new BRAINYMO.Storage();

        this.startTimer = function (time) {
            var sec = time;
            var bestTime;

            // Set timer interval
            interval = setInterval(function () {
                seconds = --sec % 60;
                minutes = parseInt(sec / 60, 10);
                $seconds.html(decorateNumber(seconds));
                $minutes.html(decorateNumber(minutes));

                if (seconds == 0 && minutes == 0) {

                    if (!end) {
                        end = true;

                        clearInterval(interval);
                        setTimeout(function () {
                            $('body').css('background-image', "url('" + Utils.getParameter("background1") + "')");
                            $("#go").hide();
                            $("#start").show();
                            $(".btn-start").hide();
                            $("#endScoreView").show();
                            $("#endScore").text($("#score").text());
                            $(".timer").hide();
                            $("#gameOverText").html(Utils.getParameter("youwin-text"));
                        }, 600);

                        //window.location.href = "Result?gameId=" + gamePrize.rowKey;
                        //setResult(false);
                    }
                }
            }, 1000);

            // Show timer
            $timer.delay(1000).fadeIn();
        };

        this.stopTimer = function () {
            clearInterval(interval);
        };

        this.youWin = function () {
            if (!end) {
                if (gamePrize.level == 1) {
                    window.location.href = "Result?gameId=" + gamePrize.rowKey;
                }
                else {
                    $.ajax({
                        url: ("api/Game/GetPrizeLevel1/" + gamePrize.rowKey),
                        type: "GET",
                        contentType: 'application/json;charset=utf-8',
                        success: function (game) {
                            console.log(game);

                            if (game) {
                                gamePrize = game;
                                window.location.href = "Result?gameId=" + gamePrize.rowKey;
                            }
                            else {
                                window.location.href = "Result?gameId=" + gamePrize.rowKey;
                            }
                        },
                        error: function (msg) {
                            window.location.href = "Result?gameId=" + gamePrize.rowKey;
                        }
                    });
                }
                setResult(false);
            }
        };

        this.retrieveTime = function () {
            return {
                minutes: decorateNumber(minutes),
                seconds: decorateNumber(seconds)
            }
        };
    }
})();

BRAINYMO.Storage = (function () {

    return function () {

        /**
         * Save best time to localStorage
         * key = 'bestTime'
         * @param {Object} time - object with keys: 'minutes', 'seconds'
         */
        this.setBestTime = function (time) {
            localStorage.setItem('bestTime', JSON.stringify(time));
        };

        /**
         * Retrieve best time from localStorage
         */
        this.retrieveBestTime = function () {
            return JSON.parse(localStorage.getItem('bestTime'));
        };

    }
})();

function setupUI() {

    //Utils.setStyle("#btn-start", "background-color", Utils.getParameter("button-color"));
    //Utils.setStyle("#btn-start", "color", Utils.getParameter("start-button-second-color"));
    //$('body').css('background-image', "url('" + Utils.getParameter("background-color1") + "')");
    //Utils.setStyle("body", "color", Utils.getParameter("foreground-color"));
    $("#logo").attr("src", Utils.getParameter("logo2"));
    $("#logo1").attr("src", Utils.getParameter("logo1"));
    $("#backCard").attr("style", 'background: url(' + Utils.getParameter("back") + ')no-repeat center center ;background-size: cover');
    //$("#game-over-img").attr("src", Utils.getParameter("game-over-img"));
    $(".text").attr("style", 'color:' + Utils.getParameter("text-color"));
    $(".timer").attr("style", 'color:' + Utils.getParameter("timer-color"));
}

function setResult(finish) {

}

// Game init
$(function () {
    wr = JSON.parse(window.localStorage.getItem("client"));

    var cards = [];
    var imgUrls = [
        "../images/Ambientes/033425551.jpg", "../images/Ambientes/719515551.jpg",
        "../images/Ambientes/738020001B.png", "../images/Ambientes/9353855551.png",
        "../images/Ambientes/amb-palmares-2.png", "../images/Ambientes/amb-urban-gris.png",
        "../images/Ambientes/AMB-URBAN-PERLA.png", "../images/Ambientes/COR_ambientemenorcabrillante.png",
        "../images/Ambientes/COR_ambientemontreal.png", "../images/Ambientes/COR_-ambiente-pared-ferro-piso-chicago.png",
        "../images/Ambientes/COR_ambiente-piso-alamo-beige.png", "../images/Ambientes/COR_ambientepisoArtikv2BLANCO.png",
        "../images/Ambientes/COR_ambiente-piso-Atlanta-marfil.png", "../images/Ambientes/COR_Ambiente-Piso-Cemento-Beige-CD.png",
        "../images/Ambientes/COR_AmbientePisoEscociaMiel.png", "../images/Ambientes/COR_ambiente-piso-gres-Athena-gris-claro-v2.png",
        "../images/Ambientes/COR_ambientepisomichiganbrillante.png", "../images/Ambientes/COR_ambiente-piso-porcelanato-stellar-marfil.png",
        "../images/Ambientes/porcelanato-soho-3-flatten.png", "../images/Ambientes/valvula-gA.png",
    ];
    var cardsSize = imgUrls.length;
    var cardsIds = [];

    while (cards.length < 6) {
        let rnd = Math.floor(Math.random() * (cardsSize - 1));

        if (cardsIds["-" + rnd] == null) {
            cardsIds["-" + rnd] = true;
            cards.push({ RowKey: ((cards.length + 1) + ""), ImgUrl: imgUrls[rnd], Description: "" });
        }
    };

    var data = {
        Event: {
            Name: "Concentrese",
            Description: "",
            Time: 31,
            Score: 10
        },
        Cards: cards,
        Parameters: [
            { RowKey: "button-color", Value: "#0000FF", Type: "" },
            { RowKey: "background-color1", Value: "#0000FF" },
            { RowKey: "background1", Value: "../img/PANTALLA.png" },
            { RowKey: "background2", Value: "../img/PANTALLA2.jpg" },
            { RowKey: "foreground-color", Value: "#0000FF" },
            { RowKey: "logo2", Value: "../img/SELLO.png" },
            { RowKey: "logo1", Value: "../img/SELLO.png" },
            { RowKey: "back", Value: "../images/Ambientes/back2.png" },
            { RowKey: "text-color", Value: "#FFFFFF" },
            { RowKey: "timer-color", Value: "#FFFFFF" }
        ]
    };

    if (data != null) {
        var brainymo = new BRAINYMO.Game({
            cards: data.Cards,
            event: data.Event
        });

        Utils.loadParams(data.Parameters);
        setupUI();

        $("#game").show();
        swal.close();
    }

    function start() {
        brainymo.generateCardSet();
        $(this).html(' <h1>Jugar de nuevo</h1>');
        //$(this).hide();
        reset = true;
        $("#go").show();
        $("#start").hide();
        $("#cards-container").show();
        $("#endScoreView").hide();
        $("#endScore").text(0);
        $("#score").text(0);
        $('body').css('background-image', "url('" + Utils.getParameter("background2") + "')");
    }


    Utils.loading();
    $.ajax({
        url: ("api/Game/GetPrizeMemory/" + wr.client.rowKey + "/" + wr.code),
        type: "GET",
        contentType: 'application/json;charset=utf-8',
        success: function (game) {
            console.log(game);

            if (game) {
                gamePrize = game;
                start();
            }
            else {
                window.location.href = "Index";
            }

            Utils.loaded();
        },
        error: function (msg) {
            window.location.href = "Index";
            Utils.loaded();
            Utils.showErrorMessage(msg.responseText);
        }
    });
});