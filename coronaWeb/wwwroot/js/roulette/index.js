var wheeldata = {
    "colorArray": ["#F2F2F2", "#FFFFFF"],

    "segmentValuesArray": [
        { "probability": 0, "type": "image", "value": "images/logos/falabella2.png", "win": true, "resultText": "GANASTE HOMECENTER!", "userData": { "score": 1 } },
        { "probability": 0, "type": "image", "value": "images/logos/Tiendas_D1_logo2.png", "win": true, "resultText": "GANASTE D1!", "userData": { "score": 2 } },
        { "probability": 0, "type": "image", "value": "images/logos/netflix2.png", "win": true, "resultText": "GANASTE NETFLIX!", "userData": { "score": 3 } },
        { "probability": 0, "type": "image", "value": "images/logos/kokoriko2.png", "win": true, "resultText": "GANASTE KOKORIKO!", "userData": { "score": 4 } },
        { "probability": 0, "type": "image", "value": "images/logos/falabella2.png", "win": true, "resultText": "GANASTE HOMECENTER!", "userData": { "score": 1 } },
        { "probability": 0, "type": "image", "value": "images/logos/Tiendas_D1_logo2.png", "win": true, "resultText": "GANASTE D1!", "userData": { "score": 2 } },
        { "probability": 0, "type": "image", "value": "images/logos/netflix2.png", "win": true, "resultText": "GANASTE NETFLIX!", "userData": { "score": 3 } },
        { "probability": 0, "type": "image", "value": "images/logos/kokoriko2.png", "win": true, "resultText": "GANASTE KOKORIKO!", "userData": { "score": 4 } } 
        ],

  "svgWidth": 800,
  "svgHeight": 800,
  "wheelStrokeColor": "#9b196e",
  "wheelStrokeWidth": 25,
  "wheelSize": 650,
  "wheelTextOffsetY": 80,
  "wheelTextColor": "#EDEDED",  
  "wheelTextSize": "2.3em",
  "wheelImageOffsetY": 50,
  "wheelImageSize": 100,
  "centerCircleSize": 30,
  "centerCircleStrokeColor": "#FFFFFF",
  "centerCircleStrokeWidth": 12,
  "centerCircleFillColor": "#EDEDED",
  "centerCircleImageUrl":"",
  "centerCircleImageWidth":400,
  "centerCircleImageHeight":400,  
  "segmentStrokeColor": "#F2F2F2",
  "segmentStrokeWidth": 4,
  "centerX": 400,
  "centerY": 350,  
  "hasShadows": false,
  "numSpins": 1,
  "spinDestinationArray":[2],
  "minSpinDuration":3,
  "gameOverText":"GRACIAS POR PARTICIPAR<br>DISFRÚTALO",
  "invalidSpinText":"INVALID SPIN. PLEASE SPIN AGAIN.",
  "introText":"TIENES<br><span style='color:#F282A9;'>1</span> INTENTO!",
  "hasSound":true,
  "gameId":"9a0232ec06bc431114e2a7f3aea03bbe2164f1aa",
  "clickToSpin":true,
  "spinDirection": "ccw",
  "disabledText":"You have no more spins today" 
};

//load your JSON (you could jQuery if you prefer)
function loadJSON(callback) {
  wr = JSON.parse(window.localStorage.getItem("client"));

  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', "api/Game/GetPrizeRoulette/" + wr.client.rowKey + "/" + wr.code, true); 
  xobj.onreadystatechange = function() {
    if (xobj.readyState == 4 && xobj.status == "200") {
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
}

//your own function to capture the spin results
function myResult(e) {
  //e is the result object
    console.log('Spin Count: ' + e.spinCount + ' - ' + 'Win: ' + e.win + ' - ' + 'Message: ' +  e.msg);

    // if you have defined a userData object...
    if(e.userData){
      
        console.log('User defined score: ' + e.userData.score)
        window.location.href = "Result?gameId=" + e.userData.score;

    }

/*  if(e.spinCount == 3){
    show the game progress when the spinCount is 3
    console.log(e.target.getGameProgress());
    restart it if you like
    e.target.restart();
  }*/  

}

//your own function to capture any errors
function myError(e) {
  //e is error object
  console.log('Spin Count: ' + e.spinCount + ' - ' + 'Message: ' +  e.msg);

}

function myGameEnd(e) {
  
  //e is gameResultsArray
  console.log(e);
  //reset the wheel at the end of the game after 5 seconds
  /* TweenMax.delayedCall(5, function(){
    
    Spin2WinWheel.reset();

  })*/


}


function init() {

    loadJSON(function (response) {

        console.log("response");
        console.log(response);

        var jsonData = JSON.parse(response);

        var prizeId = jsonData.prizeId.split("-")[0];

        console.log(prizeId)

        wheeldata.segmentValuesArray[prizeId - 1].probability = 100;
        wheeldata.segmentValuesArray[prizeId - 1].userData.score = jsonData.rowKey;

        //console.log(wheeldata);

        // Parse JSON string to an object
        //var jsonData = JSON.parse(response);
        //if you want to spin it using your own button, then create a reference and pass it in as spinTrigger
        var mySpinBtn = document.querySelector('.spinBtn');
        //create a new instance of Spin2Win Wheel and pass in the vars object
        var myWheel = new Spin2WinWheel();
    
        //WITH your own button
        myWheel.init({ data: wheeldata, onResult:myResult, onGameEnd:myGameEnd, onError:myError, spinTrigger: mySpinBtn});
    
        //WITHOUT your own button
        //myWheel.init({data:jsonData, onResult:myResult, onGameEnd:myGameEnd, onError:myError});
  });
}



//And finally call it
init();
