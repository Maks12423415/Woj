document.addEventListener("DOMContentLoaded", function () {
  var map = L.map("map", { dragging: false }).setView(
    [52.23215660706373, 19.27979868502003],
    7
  );

  var punkty = 0;
  var zycia = 5;

  const div_punkty = document.getElementById("punkty");
  const div_zycia = document.getElementById("zycia");
  const div_wojewodz = document.getElementById("wojewodz");

  div_punkty.innerHTML = "Punkty: " + punkty;

  // Aktualizuje wyświetlane serca zgodnie z wartością zmiennej "zycia"
  function aktualizujSerca() {
    if (div_zycia) {
      div_zycia.innerHTML = "Życia: ";
      for (var i = 0; i < zycia; i++) {
        var serce = document.createElement("span");
        serce.innerHTML = "&hearts;";
        div_zycia.appendChild(serce);
      }
    }
  }

  aktualizujSerca();

  // Dodaje podkład mapowy z OpenStreetMap
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 10,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  // Wyświetla warstwę z województwami
  var wojewodztwaLayer = L.geoJSON(wojewodztwa.features).addTo(map);

  // Losuje województwo do odgadnięcia
  function losujWojewodztwo() {
    var wojewodztwa = wojewodztwaLayer.getLayers();
    var wylosowaneWojewodztwo =
      wojewodztwa[Math.floor(Math.random() * wojewodztwa.length)];
    return wylosowaneWojewodztwo.feature.properties.nazwa;
  }

  var wylosowane = losujWojewodztwo();

  div_wojewodz.innerHTML = "Kliknij Województwo: " + wylosowane;

  // Obsługa kliknięcia na województwo
  wojewodztwaLayer.on("click", function (e) {
    var kliknieteWojewodztwo = e.layer.feature.properties.nazwa;

    if (kliknieteWojewodztwo === wylosowane) {
      // Jeśli kliknięto poprawne województwo, zwiększ punkty, wylosuj nowe województwo
      punkty++;
      div_punkty.innerHTML = "Punkty: " + punkty;
      alert("Brawo! Masz teraz: " + punkty + " punktów.");
      wylosowane = losujWojewodztwo();
      console.log(wylosowane);
    } else {
      // Jeśli kliknięto błędne województwo, dodaj marker na poprawnym i klikniętym obszarze, wyznacz odległość między nimi, odejmij jedno życie, aktualizuj wyświetlane serca
      var poprawneWojewodztwo = wylosowane;
      var poprawnyLayer = wojewodztwaLayer
        .getLayers()
        .find(
          (layer) => layer.feature.properties.nazwa === poprawneWojewodztwo
        );
      var kliknietyLayer = e.layer;

      var latlngs = [
        poprawnyLayer.getBounds().getCenter(),
        kliknietyLayer.getBounds().getCenter(),
      ];
      var startMarker = L.marker(latlngs[0]).addTo(map);
      var endMarker = L.marker(latlngs[latlngs.length - 1]).addTo(map);
      var odle = startMarker.getLatLng().distanceTo(endMarker.getLatLng());
      var polyline = L.polyline(latlngs, { color: "red" }).addTo(map);
      polyline.bindTooltip((odle / 1000).toFixed(2) + " km", {
        permanent: true,
      });

      zycia -= 1;
      aktualizujSerca();
      alert(
        "Zła odpowiedź, spróbuj jeszcze raz. Pozostały ci: " + zycia + " życia."
      );
      wylosowane = losujWojewodztwo();
      console.log(wylosowane);

      // Sprawdzenie warunku zakończenia gry
      sprawdzKoniecGry();
    }

    div_wojewodz.innerHTML = "Kliknij Województwo: " + wylosowane;
  });

  // Sprawdzenie warunku zakończenia gry
  function sprawdzKoniecGry() {
    if (zycia === 0) {
      document.body.innerHTML = "";
      document.body.style.backgroundColor = "black";
      document.body.style.display = "flex";
      document.body.style.alignItems = "center";
      document.body.style.justifyContent = "center";

      var game = document.createElement("h1");
      game.style.color = "white";
      game.style.alignItems = "center";
      game.style.justifyContent = "center";
      game.innerHTML = "GAME OVER";
      document.body.appendChild(game);
    }
  }
});
