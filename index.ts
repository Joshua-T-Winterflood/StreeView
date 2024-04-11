interface Location {
  lat: number;
  lng: number;
}

interface City {
  city: string;
}

interface LocationWithCity {
  0: Location;
  1: City;
}

const locations: LocationWithCity[][] = [
  [{lat: 54.58326905049073, lng: -1.2311147863824672}, {city: 'middlesbrough'}],
  [{lat: 47.37801071704822, lng: 8.51096130994212}, {city: 'Zuerich'}],
];

const currentLocation: LocationWithCity = locations[Math.floor(Math.random()*locations.length)];
const currentCoords: Location = currentLocation[0];
const currentCity: City = currentLocation[1];
function initPano() {
  const panorama = new google.maps.StreetViewPanorama(
      document.getElementById("pano") as HTMLElement,
      {
        position: currentCoords,
        pov: {
          heading: 270,
          pitch: 0,
        },
        linksControl: false,
        panControl: false,
        enableCloseButton: false,
        addressControl: false,
        //zoomControl: false,
        showRoadLabels: false,
        visible: true,
      }
  );

  panorama.addListener("pano_changed", () => {
    const panoCell = document.getElementById("pano-cell") as HTMLElement;

    panoCell.innerHTML = panorama.getPano();
  });

  panorama.addListener("links_changed", () => {
    const linksTable = document.getElementById("links_table") as HTMLElement;

    while (linksTable.hasChildNodes()) {
      linksTable.removeChild(linksTable.lastChild as ChildNode);
    }

    const links = panorama.getLinks();

    for (const i in links) {
      const row = document.createElement("tr");

      linksTable.appendChild(row);

      const labelCell = document.createElement("td");

      labelCell.innerHTML = "<b>Link: " + i + "</b>";

      const valueCell = document.createElement("td");

      valueCell.innerHTML = links[i].description as string;
      linksTable.appendChild(labelCell);
      linksTable.appendChild(valueCell);
    }
  });

  panorama.addListener("position_changed", () => {
    const positionCell = document.getElementById(
        "position-cell"
    ) as HTMLElement;

    (positionCell.firstChild as HTMLElement).nodeValue =
        panorama.getPosition() + "";
  });

  panorama.addListener("pov_changed", () => {
    const headingCell = document.getElementById("heading-cell") as HTMLElement;
    const pitchCell = document.getElementById("pitch-cell") as HTMLElement;

    (headingCell.firstChild as HTMLElement).nodeValue =
        panorama.getPov().heading + "";
    (pitchCell.firstChild as HTMLElement).nodeValue =
        panorama.getPov().pitch + "";
  });
}

declare global {
  interface Window {
    initPano: () => void;
  }
}
window.initPano = initPano;
export {};
window.addEventListener('load', initPano);