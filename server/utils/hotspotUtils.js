function clusterReports(reports, threshold = 0.01) {
  const clusters = new Map(); // Using a Map to store cluster data

  reports.forEach(report => {
    // report.location.coordinates is in [longitude, latitude] format
    const lon = report.location.coordinates[0];
    const lat = report.location.coordinates[1];

    // Create a grid key to group nearby reports
    const latGrid = Math.round(lat / threshold);
    const lonGrid = Math.round(lon / threshold);
    const key = `${latGrid},${lonGrid}`;

    if (clusters.has(key)) {
      clusters.get(key).count++;
    } else {
      clusters.set(key, {
        lat: latGrid * threshold,
        lon: lonGrid * threshold,
        count: 1
      });
    }
  });

  // Convert the Map into the final array format
  const hotspotData = [];
  for (const cluster of clusters.values()) {
    hotspotData.push({
      lat: cluster.lat,
      lon: cluster.lon,
      intensity: cluster.count
    });
  }
  return hotspotData;
}

// Export the function so other files can use it
module.exports = { clusterReports };