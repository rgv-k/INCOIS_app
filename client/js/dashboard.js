// dashboard.js - Enhanced with Full Screen Map and Pathfinding

document.addEventListener('DOMContentLoaded', () => {
    console.log('Dashboard script loaded');
    
    // Initialize main dashboard map
    const map = L.map('map').setView([13.11, 77.63], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    console.log("Dashboard map initialized.");

    // Heat layer for dashboard
    const testHeatData = [
        [13.114514, 77.6351941, 50],
        [13.12, 77.64, 50],
        [13.11, 77.63, 50]
    ];

    try {
        const heat = L.heatLayer(testHeatData, {
            radius: 50,
            blur: 25
        }).addTo(map);
        console.log("Heat layer created for dashboard.");
    } catch (error) {
        console.error("Error creating the heat layer:", error);
    }

    // Relief centers data (mock data - replace with real API later)
    const reliefCenters = [
        {
            id: 1,
            name: "Central Relief Center",
            lat: 13.12,
            lng: 77.65,
            capacity: "500 people",
            contact: "080-2234-5678",
            facilities: "Medical, Food, Shelter"
        },
        {
            id: 2,
            name: "Coastal Emergency Hub",
            lat: 13.08,
            lng: 77.60,
            capacity: "300 people",
            contact: "080-2345-6789",
            facilities: "Medical, Rescue Teams"
        },
        {
            id: 3,
            name: "North Zone Relief Station",
            lat: 13.15,
            lng: 77.62,
            capacity: "400 people",
            contact: "080-2456-7890",
            facilities: "Food, Shelter, Transportation"
        },
        {
            id: 4,
            name: "South District Center",
            lat: 13.05,
            lng: 77.58,
            capacity: "600 people",
            contact: "080-2567-8901",
            facilities: "Medical, Food, Shelter, Communications"
        }
    ];

    // Full screen map variables
    let fullScreenMap = null;
    let userMarker = null;
    let routeControl = null;
    let reliefMarkers = [];

    // Modal elements
    const mapModal = document.getElementById('mapModal');
    const closeModal = document.getElementById('closeModal');
    const findReliefBtn = document.getElementById('findReliefCenters');

    // Find "View Map" button with more robust detection
    let viewMapButton = null;
    const buttons = document.querySelectorAll('button');
    
    buttons.forEach((btn, index) => {
        console.log(`Button ${index}: "${btn.textContent.trim()}"`);
        if (btn.textContent.trim() === 'View Map') {
            viewMapButton = btn;
            console.log('Found View Map button!', btn);
        }
    });

    // Alternative method: try to find by class if text search fails
    if (!viewMapButton) {
        viewMapButton = document.querySelector('.btn-outline');
        console.log('Trying alternative selector:', viewMapButton);
    }

    // Also try finding by specific selector
    if (!viewMapButton) {
        const sidebarButtons = document.querySelectorAll('.sidebar button');
        sidebarButtons.forEach(btn => {
            if (btn.textContent.includes('View Map')) {
                viewMapButton = btn;
                console.log('Found View Map button via sidebar search:', btn);
            }
        });
    }

    // Open modal when "View Map" is clicked
    if (viewMapButton) {
        console.log('Adding click listener to View Map button');
        viewMapButton.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('View Map button clicked!');
            openMapModal();
        });
    } else {
        console.error('View Map button not found! Available buttons:');
        buttons.forEach((btn, i) => {
            console.log(`  Button ${i}: "${btn.textContent.trim()}" - classes: ${btn.className}`);
        });
    }

    // Close modal events
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            closeMapModal();
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === mapModal) {
            closeMapModal();
        }
    });

    // Find relief centers button
    if (findReliefBtn) {
        findReliefBtn.addEventListener('click', () => {
            findNearestReliefCenters();
        });
    }

    function openMapModal() {
        console.log('openMapModal called');
        if (mapModal) {
            mapModal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent background scroll
            
            // Initialize full screen map after modal is visible
            setTimeout(() => {
                initializeFullScreenMap();
            }, 100);
        } else {
            console.error('Modal not found! Check if mapModal element exists');
        }
    }

    function closeMapModal() {
        console.log('closeMapModal called');
        if (mapModal) {
            mapModal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Restore scroll
        }
        
        // Clean up the map
        if (fullScreenMap) {
            fullScreenMap.remove();
            fullScreenMap = null;
        }
        userMarker = null;
        routeControl = null;
        reliefMarkers = [];
    }

    function initializeFullScreenMap() {
        console.log('initializeFullScreenMap called');
        if (fullScreenMap) {
            fullScreenMap.remove();
        }

        // Create full screen map
        fullScreenMap = L.map('fullScreenMap').setView([13.11, 77.63], 11);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '© OpenStreetMap'
        }).addTo(fullScreenMap);

        // Add heat layer to full screen map
        const fullScreenHeat = L.heatLayer(testHeatData, {
            radius: 50,
            blur: 25
        }).addTo(fullScreenMap);

        // Add relief centers as markers
        addReliefCenterMarkers();

        console.log("Full screen map initialized.");
    }

    function addReliefCenterMarkers() {
        console.log('Adding relief center markers...');
        reliefMarkers = [];
        
        reliefCenters.forEach(center => {
            console.log(`Adding marker for ${center.name} at [${center.lat}, ${center.lng}]`);
            
            // Create a more visible icon for relief centers
            const marker = L.marker([center.lat, center.lng], {
                icon: L.divIcon({
                    className: 'relief-center-icon',
                    html: '<div style="background: red; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 16px; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">🏥</div>',
                    iconSize: [30, 30],
                    iconAnchor: [15, 15]
                })
            }).addTo(fullScreenMap);

            const popupContent = `
                <div class="relief-popup">
                    <h4>${center.name}</h4>
                    <p><strong>Capacity:</strong> <span class="capacity">${center.capacity}</span></p>
                    <p><strong>Contact:</strong> ${center.contact}</p>
                    <p><strong>Facilities:</strong> ${center.facilities}</p>
                </div>
            `;

            marker.bindPopup(popupContent);
            reliefMarkers.push({ marker, data: center });
        });
        
        console.log(`Added ${reliefMarkers.length} relief center markers`);
    }

    function findNearestReliefCenters() {
        if (!fullScreenMap) {
            alert('Please open the map first');
            return;
        }

        // Get user's current location
        if (navigator.geolocation) {
            findReliefBtn.textContent = '🔄 Getting your location...';
            findReliefBtn.disabled = true;

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLat = position.coords.latitude;
                    const userLng = position.coords.longitude;
                    
                    showUserLocationAndRoutes(userLat, userLng);
                    
                    findReliefBtn.textContent = '📍 Find Nearest Relief Centers';
                    findReliefBtn.disabled = false;
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    // Fallback to Bengaluru center
                    showUserLocationAndRoutes(13.11, 77.63);
                    
                    findReliefBtn.textContent = '📍 Find Nearest Relief Centers';
                    findReliefBtn.disabled = false;
                    
                    alert('Could not get your location. Using default location.');
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000
                }
            );
        } else {
            alert('Geolocation is not supported by this browser.');
            // Fallback to default location
            showUserLocationAndRoutes(13.11, 77.63);
        }
    }

    function showUserLocationAndRoutes(userLat, userLng) {
        // Remove existing user marker and routes
        if (userMarker) {
            fullScreenMap.removeLayer(userMarker);
        }
        if (routeControl) {
            fullScreenMap.removeControl(routeControl);
        }

        // Add user location marker
        userMarker = L.marker([userLat, userLng], {
            icon: L.divIcon({
                className: 'user-location-icon',
                html: '<div style="background: blue; color: white; border-radius: 50%; width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; font-size: 14px; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">📍</div>',
                iconSize: [25, 25],
                iconAnchor: [12, 12]
            })
        }).addTo(fullScreenMap);

        userMarker.bindPopup('Your Current Location').openPopup();
        console.log(`User marker added at [${userLat}, ${userLng}]`);

        // Calculate distances and find nearest relief centers
        const centersWithDistance = reliefCenters.map(center => {
            const distance = calculateDistance(userLat, userLng, center.lat, center.lng);
            return { ...center, distance };
        }).sort((a, b) => a.distance - b.distance);

        // Show routes to the nearest center
        const nearestCenters = centersWithDistance.slice(0, 3);
        
        // Create route to the nearest center
        if (nearestCenters.length > 0) {
            const nearest = nearestCenters[0];
            console.log(`Creating route to nearest center: ${nearest.name} at distance ${nearest.distance.toFixed(2)}km`);
            
            try {
                // Check if L.Routing is available
                if (typeof L.Routing === 'undefined') {
                    console.error('Leaflet Routing Machine not loaded!');
                    alert('Routing functionality not available. Please refresh the page.');
                    return;
                }
                
                routeControl = L.Routing.control({
                    waypoints: [
                        L.latLng(userLat, userLng),
                        L.latLng(nearest.lat, nearest.lng)
                    ],
                    routeWhileDragging: false,
                    createMarker: function() { return null; }, // Don't create default markers
                    lineOptions: {
                        styles: [
                            { color: '#ff4757', opacity: 0.8, weight: 6 },
                            { color: '#ff3838', opacity: 1, weight: 4 }
                        ]
                    },
                    show: false, // Hide the instruction panel
                    addWaypoints: false,
                    draggableWaypoints: false
                }).addTo(fullScreenMap);
                
                console.log('Route control added successfully');
            } catch (error) {
                console.error('Error creating route:', error);
                alert('Error creating route. Route functionality may not be available.');
            }

            // Update popup for nearest center
            const nearestMarker = reliefMarkers.find(rm => rm.data.id === nearest.id);
            if (nearestMarker) {
                const popupContent = `
                    <div class="relief-popup">
                        <h4>🎯 ${nearest.name}</h4>
                        <p class="distance"><strong>Distance: ${nearest.distance.toFixed(2)} km</strong></p>
                        <p><strong>Capacity:</strong> <span class="capacity">${nearest.capacity}</span></p>
                        <p><strong>Contact:</strong> ${nearest.contact}</p>
                        <p><strong>Facilities:</strong> ${nearest.facilities}</p>
                    </div>
                `;
                nearestMarker.marker.setPopupContent(popupContent);
                nearestMarker.marker.openPopup();
                
                // Fit map to show user and nearest center
                try {
                    const group = new L.featureGroup([userMarker, nearestMarker.marker]);
                    fullScreenMap.fitBounds(group.getBounds().pad(0.1));
                } catch (error) {
                    console.error('Error fitting bounds:', error);
                }
            }
        }

        console.log('Nearest relief centers:', nearestCenters);
    }

    function calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // Radius of the Earth in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;
        return distance;
    }

    // New Report button functionality
    const newReportBtn = document.getElementById('newReportBtn');
    if (newReportBtn) {
        newReportBtn.addEventListener('click', () => {
            window.location.href = 'new-report.html';
        });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && mapModal && mapModal.style.display === 'block') {
            closeMapModal();
        }
    });

    console.log("Dashboard with full screen map functionality initialized.");
});