var map = L.map("map", { dragging: false }).setView(
  [52.23215660706373, 19.27979868502003],
  7
);

var punkty = 0;
var zycia = 3;

const div_punkty = document.getElementById("punkty");
const div_zycia = document.getElementById("zycia");

div_punkty.innerHTML = "Punkty: " + punkty;

function aktualizujSerca() {
  if (div_zycia) {
    div_zycia.innerHTML = "Zycia: ";
    for (var i = 0; i < zycia; i++) {
      var serce = document.createElement("span");
      serce.innerHTML = "&hearts;";
      div_zycia.appendChild(serce);
    }
  }
}

aktualizujSerca();

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

map.dragging.disable();
map.scrollWheelZoom.disable();

console.log(wojewodztwa);

var wojewodztwaLayer = L.geoJSON(wojewodztwa.features).addTo(map);

function losujWojewodztwo() {
  var wojewodztwa = wojewodztwaLayer.getLayers();
  var wylosowaneWojewodztwo =
    wojewodztwa[Math.floor(Math.random() * wojewodztwa.length)];
  return wylosowaneWojewodztwo.feature.properties.nazwa;
}
// I po co tu zaglądasz?
var wylosowane = losujWojewodztwo();

document.getElementById("wojewodz").innerHTML =
  "Kliknij Województwo: " + wylosowane;

wojewodztwaLayer.on("click", function (e) {
  var kliknieteWojewodztwo = e.layer.feature.properties.nazwa;

  if (kliknieteWojewodztwo === wylosowane) {
    punkty++;
    div_punkty.innerHTML = "Punkty: " + punkty;
    alert("Gratulacje! Zdobywasz punkt. Masz " + punkty + " punktów.");
    wylosowane = losujWojewodztwo();
    console.log(wylosowane);
  } else {
    var poprawneWojewodztwo = wylosowane;
    var poprawnyLayer = wojewodztwaLayer
      .getLayers()
      .find((layer) => layer.feature.properties.nazwa === poprawneWojewodztwo);
    var kliknietyLayer = e.layer;

    var latlngs = [
      poprawnyLayer.getBounds().getCenter(),
      kliknietyLayer.getBounds().getCenter(),
    ];
    var startMarker = L.marker(latlngs[0]).addTo(map);
    var endMarker = L.marker(latlngs[latlngs.length - 1]).addTo(map);
    var odle = startMarker.getLatLng().distanceTo(endMarker.getLatLng());
    var polyline = L.polyline(latlngs, { color: "red" }).addTo(map);
    polyline.bindTooltip((odle / 1000).toFixed(2) + " km", { permanent: true });

    zycia -= 1;
    aktualizujSerca();
    alert("Niestety, spróbuj jeszcze raz. Zostały ci " + zycia + " życia.");
    wylosowane = losujWojewodztwo();
    console.log(wylosowane);
    if (zycia === 0) {
      document.getElementById("body").innerHTML = "";
      document.getElementById("body").style.backgroundColor = "black";
      document.getElementById("body").style.marginLeft = "500px";
      var game = document.createElement("h1");
      game.setAttribute("id", "koniec");
      game.innerHTML = "Game Over";

      var p = document.createElement("p");
      p.setAttribute("id", "pk");
      p.innerHTML = "Twoja liczba punktów to: " + punkty;

      document.getElementById("body").appendChild(game);
      document.getElementById("body").appendChild(p);
    }
  }
  document.getElementById("wojewodz").innerHTML =
    "Kliknij Województwo: " + wylosowane;
});
