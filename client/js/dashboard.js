// dashboard.js (FINAL TESTING VERSION)

document.addEventListener('DOMContentLoaded', () => {
    // --- CHANGE 1: Center the map on Bengaluru and zoom in ---
    const map = L.map('map').setView([13.11, 77.63], 10); // Zoom level 10

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    console.log("Map initialized and zoomed in.");

    const testHeatData = [
        // --- CHANGE 2: Increased the intensity from 1 to 50 ---
        [13.114514, 77.6351941, 50],
        [13.12, 77.64, 50],
        [13.11, 77.63, 50]
    ];

    console.log("Using high-intensity test data:", testHeatData);

    try {
        const heat = L.heatLayer(testHeatData, {
            // --- CHANGE 3: Increased the radius for better visibility ---
            radius: 50,
            blur: 25
        }).addTo(map);

        console.log("High-intensity heat layer created.");

    } catch (error) {
        console.error("Error creating the heat layer:", error);
    }

    const newReportBtn = document.getElementById('newReportBtn');
    if (newReportBtn) {
        newReportBtn.addEventListener('click', () => {
            window.location.href = 'new-report.html';
        });
    }
});