/*global L*/

var mymap = L.map('mapid').setView([39.87, -82.57], 7);

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
}).addTo(mymap);

//var marker = L.marker([51.5, -0.09]).addTo(mymap);

//var circle = L.circle([51.508, -0.11], {
    //color: 'red',
    //fillColor: '#f03',
    //fillOpacity: 0.5,
    //radius: 500
//}).addTo(mymap);

//var polygon = L.polygon([
    //[51.509, -0.08],
    //[51.503, -0.06],
    //[51.51, -0.047]
//]).addTo(mymap);

//marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
//circle.bindPopup("I am a circle.");
//polygon.bindPopup("I am a polygon.");

var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(mymap);
}

mymap.on('click', onMapClick);