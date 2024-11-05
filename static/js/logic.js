// Set the URL for the GeoJSON data (replace with your actual data source)
const geojsonUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'; // Example URL

// Initialize the map
const map = L.map('map').setView([0, 0], 2); // Center the map

// Add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Fetch and visualize the earthquake data
d3.json(geojsonUrl).then(data => {
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            const magnitude = feature.properties.mag;
            const depth = feature.geometry.coordinates[2];

            // Define marker size based on magnitude
            const markerSize = magnitude * 5; // Adjust multiplier as needed

            // Define marker color based on depth
            let color;
            if (depth > 50) {
                color = 'red';
            } else if (depth > 20) {
                color = 'orange';
            } else {
                color = 'yellow';
            }

            // Create circle marker
            return L.circleMarker(latlng, {
                radius: markerSize,
                fillColor: color,
                color: color,
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            }).bindPopup(`Magnitude: ${magnitude}<br>Depth: ${depth} km`);
        }
    }).addTo(map);
}).catch(error => {
    console.error("Error fetching the earthquake data: ", error);
});

// Add a legend
const legend = L.control({ position: 'bottomright' });

legend.onAdd = function () {
    const div = L.DomUtil.create('div', 'info legend');
    const depths = [0, 20, 50]; // Depth intervals
    const colors = ['yellow', 'orange', 'red']; // Corresponding colors

    // Loop through depth intervals and generate a label with a colored square
    for (let i = 0; i < depths.length; i++) {
        div.innerHTML +=
            '<div>' + // Add a div to wrap each legend item
            '<i style="background:' + colors[i] + '"></i> ' +
            depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km' : '+ km') +
            '</div>'; // Close the div
    }

    return div;
};

legend.addTo(map);