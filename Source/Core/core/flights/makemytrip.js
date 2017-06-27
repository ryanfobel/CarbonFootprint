var makeMyTripManager = function(){

};



makeMyTripManager.prototype.getList = function(){
  var rawList = document.getElementsByClassName("card-main");
  console.log("raw list");
  console.log(rawList);
    // var stops = rawList.getElementsByClassName("leg-stops-station");
    // console.log("---stops---");
    // console.log(stops);
    var processedList = [];
  //console.log(rawList);
    for(var x = 0, i = rawList.length; x < i; x++){
        stops = (rawList[x].getElementsByClassName('leg-stops-station')[0].innerText.length)? rawList[x].getElementsByClassName('leg-stops-station')[0].innerText.split(",").join("").split(" "): [];
    processedList.push({
      depart: rawList[x].childNodes[1].childNodes[0].childNodes[0].childNodes[1].innerHTML,
      arrive: rawList[x].childNodes[1].childNodes[2].childNodes[0].childNodes[1].innerHTML,
      stops:stops,
      aircraft: "A380" //hardcoded for now
    });
  }
  console.log("--- initial list ---");
  console.log(processedList);
  return processedList;
};



makeMyTripManager.prototype.getCoordinates = function(processedList){
  processedList = core.getCoordinates(processedList);
  console.log("--- got coordinates ---");
  console.log(processedList);
  return processedList;
};



makeMyTripManager.prototype.getDistances = function(processedList){
    for(var x = 0, i = processedList.length; x < i; x++){
        processedList[x].distance = 0;
    console.log(processedList[x]);
      if(processedList[x].stopCoordinatesNew){
          noOfStops = processedList[x].stopCoordinatesNew.length;
          console.log(noOfStops);
      processedList[x].distance += core.getDistance(processedList[x].departCoordinates.lat, processedList[x].departCoordinates.lon,
                                                   processedList[x].stopCoordinatesNew[0].lat, processedList[x].stopCoordinatesNew[0].lon) +
              core.getDistance(processedList[x].stopCoordinatesNew[noOfStops-1].lat, processedList[x].stopCoordinatesNew[noOfStops-1].lon,
                               processedList[x].arriveCoordinates.lat, processedList[x].arriveCoordinates.lon);
          for(var y = 0; y < noOfStops-1 ; y++){
              console.log("Totally working fine");
              processedList[x].distance += core.getDistance(processedList[x].stopCoordinatesNew[y].lat,processedList[x].stopCoordinatesNew[y].lon,processedList[x].stopCoordinatesNew[y+1].lat,processedList[x].stopCoordinatesNew[y+1].lon);
          }
    }
    else{
      processedList[x].distance += core.getDistance(processedList[x].departCoordinates.lat, processedList[x].departCoordinates.lon,
                                                   processedList[x].arriveCoordinates.lat, processedList[x].arriveCoordinates.lon);
    }
  }
  console.log("---got distances---");
  console.log(processedList);
  return processedList;
};



makeMyTripManager.prototype.getEmission = function(processedList){
  processedList = core.getEmission(processedList);
  console.log("---got fuel consumption---");
  console.log(processedList);
  return processedList;
};



makeMyTripManager.prototype.insertInDom = function(processedList){
  insertIn = document.getElementsByClassName("card-main");
  for(var x = 0, i = insertIn.length; x < i; x++){
    if(insertIn[x].childNodes[1].childNodes.length <= 4 ||
       insertIn[x].childNodes[1].childNodes[4].className == "leg-operator" &&
       insertIn[x].childNodes[1].childNodes.length <= 5){
         insertIn[x].childNodes[1].appendChild(core.createHTMLElement(processedList[x].co2Emission));
    }
    //console.log(insertIn[x].childNodes[1].childNodes[1]);
  }
};

var FlightManager = skyscannerManager;