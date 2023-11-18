/* // Create a DOM element for your custom icon
const iconElement = document.createElement("div");
iconElement.className = "custom-icon"; // Add your custom CSS class for styling
iconElement.innerHTML =
  '<i class="fa-solid fa-house" style="color: #ff0000;"></i>'; // Use Font Awesome icon HTM

// Set the font size for the icon
iconElement.style.fontSize = "50px"; */

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
  style: "mapbox://styles/mapbox/streets-v12", // style URL
  center: listing.geometry.coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
});

const marker = new mapboxgl.Marker({ color: "red" })
  .setLngLat(listing.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h4>${listing.title}</h4 <p>Exact Location will be provided after booking</p>`
    )
  )
  .addTo(map);
