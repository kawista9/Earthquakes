// API endpoint inside Url1
var url1 = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

var url2 = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson"

// GET request to the query URL
d3.json(url1, function(data) {
  // send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(dataEarthquake) {


  // create a popup showing information about the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
      "</h3><hr><p>Magnitude: " + feature.properties.mag + "</p>");
  }

function getColor(x) {
    return x > 5 ? "#f40202" :
           x > 4 ? "#f45f02" :
           x > 3 ? "#f49702" :
           x > 2 ? "#F4bc02" :
           x > 1 ? "#d8f402" :
           x > 0 ? "#93f402" :
                "#FFEDA0";
}
  

  // make a GeoJSON layer holding the features array on the earthquakeData object
  // do an "onEachFeature" one time for each object in the array
  var earthquakes = L.geoJSON(dataEarthquake, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
    //   var colors;
    //   var r = 100;
    //   var g = Math.floor(255-0*feature.properties.mag);
    //   var b = Math.floor(255-113*feature.properties.mag);
    //  colors= "rgb("+r+" ,"+g+","+b+")";
      
      var geojsonMarkerOptions = {
        radius: 4*feature.properties.mag,
        fillColor: getColor(feature.properties.mag),
        color: "black",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      };
      return L.circleMarker(latlng, geojsonMarkerOptions);
    }
  });


  // Send earthquakes layer to the createMap function
  createMap(earthquakes);
  
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var map = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1Ijoia2F3aXN0YTkiLCJhIjoiY2p3aWZlemdmMDZhNjRhbngycWZxeXd4ZSJ9.03cLbqU4CA0H2wKIPcRO3Q");

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": map
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map!
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [map, earthquakes]
  });


  
  }

  // Create a legend to display information about our map
  var scale = L.control({position: 'bottomright'});

  scale.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info scale'),
      grades = [0, 1, 2, 3, 4, 5, 6, 7, 8],
      labels = [];

      
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
          labels.push(
          '<i style="background:' + getColor(grades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+'));
  }
  //div.innerHTML = labels.join("<br>");
  div.innerHTML+='Magnitude<br><hr>';
  return div;
  };
  scale.addTo(map);

