var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";

d3.json(queryUrl, function(data) {
  
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.title +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  };

  function getColor(mag) {
    return mag >= 7 ? 'red' : 
      mag >= 6 ? 'orange' : 
      mag >= 5 ? 'yellow' :
      'green' ;
  };

  function pointToLayer(feature, latlng) {
    return new L.CircleMarker(latlng, {
      radius: 7*(feature.properties.mag-4.5), 
      fillColor: getColor(feature.properties.mag),
      fillOpacity:.8,
      stroke:false
    });
  };

  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: pointToLayer 
  });

  var title = L.control({position: 'topleft'});
    title.onAdd=function(map){
    var div=L.DomUtil.create('div');
    div.innerHTML='<b>Earthquakes of magnitude 4.5+ within the past 30 days</b></div>';
    return div;
  } 

  var legend = L.control({position: 'bottomright'});
    legend.onAdd=function(map){
    var div=L.DomUtil.create('div','legend');
    var labels=["Magnitude 7+",
                "Magnitude 6-7",
                "Magnitude 5-6",
                "Magnitude 4.5-5"];
    var mags = [7,6,5,4];
    div.innerHTML='<div><b>Legend</b></div>';
    for(var i=0; i<mags.length; i++){
      div.innerHTML+='<i style="background:'+getColor(mags[i])+'">&nbsp;</i>&nbsp;&nbsp;'
      +labels[i]+'<br/>';
    }
    return div;
  } 

 var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

 var map = L.map("map", {
    center: [0,0],
    zoom: 1.5,
    layers: [streetmap, earthquakes]
  });

 title.addTo(map);
 legend.addTo(map);
}
