/*global L*/
/*global $*/

function createMap() {
    //create the map
    "use strict";
    var map = L.map('map',{
        center: [39.87, -82.57],
        zoom: 7
    });

    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(map);
    getData(map);
}

function processData(data){
    var attributes = [];
    var properties = data.features[0].properties;
    for (var attribute in properties){
        if (attribute.indexOf("murder") > -1){
            attributes.push(attribute);
        };
    };
    console.log(attributes);
    return attributes;
}

function createSequenceControls(map, attributes){
    $('#panel').append('<input class="range-slider" type="range">');
    $('.range-slider').attr({
        max: 6,
        min: 0,
        value: 0,
        step: 1
    })
    $('#panel').append('<button class="skip" id="reverse">Reverse</button>');
    $('#panel').append('<button class="skip" id="forward">Skip</button>');
    $('#reverse').html('<img src="img/back.png">');
    $('#forward').html('<img src="img/forward.png">');
    $('.skip').click(function(){
    });
    $('.range-slider').on('input', function(){
        updatePropSymbols(map, attributes[index]);
    });
    $('.skip').click(function(){
        var index = $('.range-slider').val();
        if ($(this).attr('id') == 'forward'){
            index++;
            index = index > 6 ? 0 : index;
        } else if ($(this).attr('id') == 'reverse'){
            index--;
            index = index < 0 ? 6 : index;
        };
        $('.range-slider').val(index);
        updatePropSymbols(map, attributes[index]);
    });
}

    function updatePropSymbols(map, attribute){
    map.eachLayer(function(layer){
        if (layer.feature && layer.feature.properties[attribute]){
            if (layer.feature && layer.feature.properties[attribute]){
            var props = layer.feature.properties;
            var radius = calcPropRadius(props[attribute]);
            layer.setRadius(radius);
            var popupContent = "<p><b>City:</b> " + props.city + "</p>";
            var year = attribute.split("_")[1];
            popupContent += "<p><b>Murders in " + year + ":</b> " + props[attribute] + " per 100,000 people</p>";
            layer.bindPopup(popupContent, {
                offset: new L.Point(0,-radius)
            });
        };
        };
    });
}
function calcPropRadius(attValue) {
    var scaleFactor = 50;
    var area = attValue * scaleFactor;
    var radius = Math.sqrt(area/Math.PI);
    return radius;
}

function getData(map) {
    "use strict";
    $.ajax("data/OhioCrime.geojson", {
        dataType: "json",
        success: function (response) {
            var attributes = processData(response);
            createPropSymbols(response, map, attributes);
            createSequenceControls(map, attributes);
    }
    })

    function createLegend(map, attributes){
    var LegendControl = L.Control.extend({
        options: {
            position: 'bottomleft'
        },
        onAdd: function (map) {
            var container = L.DomUtil.create('div', 'legend-control-container');
            $(container).append('<input class="Legend" type=>');
            return container;
        }
    });
    map.addControl(new LegendControl());
};
    
function createPropSymbols(data, map, attributes){
    L.geoJson(data, {
        pointToLayer: function(feature, latlng){
            return pointToLayer(feature, latlng, attributes);
        }
    }).addTo(map);
};
    
function pointToLayer(feature, latlng, attributes){
    var attribute = attributes[0];
    console.log(attribute);
    var options = {
        fillColor: "red",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.7
    };
    var attValue = Number(feature.properties[attribute]);
    options.radius = calcPropRadius(attValue);
    var layer = L.circleMarker(latlng, options);
    var year = attribute.split("_")[1];
    var popupContent = "<p><b>City:</b> " + feature.properties.city + "</p><p><b>" + "Murders in " + year + ":</b> " + feature.properties[attribute] + " per 100,000 people" + "</p>";
    layer.bindPopup(popupContent);
    return layer;
}
}
$(document).ready(createMap);