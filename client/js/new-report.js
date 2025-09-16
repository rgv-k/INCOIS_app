document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('reportForm');
  
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const reportData = {
              title: document.getElementById('reportTitle').value,
              hazardType: document.getElementById('hazardType').value,
              description: document.getElementById('reportDescription').value,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };

            // **NEW: Send data to the backend API**
            try {
              const response = await fetch('http://localhost:3000/api/reports', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  // If you implement token-based auth, you'd add the token here:
                  // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify(reportData)
              });

              if (response.ok) {
                alert("Report submitted successfully!");
                window.location.href = "dashboard.html";
              } else {
                const errorResult = await response.json();
                alert(`Error: ${errorResult.message}`);
              }
            } catch (error) {
              console.error("Error submitting report:", error);
              alert("An error occurred while submitting the report.");
            }
          },
          (error) => {
            console.error("Geolocation error:", error);
            alert("Could not get your location. Please enable location services to submit a report.");
          }
        );
      } else {
        alert("Geolocation is not supported by your browser.");
      }
    });
  }
});