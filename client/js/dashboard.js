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


// --- SOS BUTTON LOGIC (with Geolocation) ---
const sosButton = document.getElementById('sosButton');
if (sosButton) {
  sosButton.addEventListener('click', () => {
    // 1. Confirm with the user first
    const isConfirmed = confirm('Are you sure you want to send an emergency SOS alert with your current location?');
    
    if (isConfirmed) {
      // 2. Check if geolocation is available
      if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.');
      }

      // 3. Get the user's current position
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          // Success: We have the coordinates
          const { latitude, longitude } = position.coords;
          sendSosAlert(latitude, longitude);
        },
        () => {
          // Error: Failed to get location
          alert('Could not get your location. Please ensure location services are enabled.');
        }
      );
    }
  });
}

// Helper function to send the actual alert to the server
async function sendSosAlert(latitude, longitude) {
  const token = localStorage.getItem('authToken');
  if (!token) {
    return alert('You must be logged in to send an SOS.');
  }

  try {
    const response = await fetch('http://localhost:3000/api/sos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ latitude, longitude }) // Send the coordinates
    });

    const result = await response.json();

    if (response.ok) {
      alert('Emergency SOS message with your location has been sent!');
    } else {
      alert(`Error: ${result.message}`);
    }
  } catch (error) {
    console.error('SOS fetch error:', error);
    alert('A network error occurred. Could not send SOS.');
  }
}