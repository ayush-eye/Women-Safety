import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let cachedData = null;

function parseCSV(content) {
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
    if (values.length < headers.length) continue;
    const row = {};
    headers.forEach((h, idx) => { row[h] = values[idx]; });
    rows.push(row);
  }
  return rows;
}

function loadCSVData() {
  if (cachedData) return cachedData;
  const csvPath = path.join(__dirname, '../../data/safety_severity.csv');
  if (!fs.existsSync(csvPath)) {
    console.warn('⚠️  CSV not found at:', csvPath);
    return [];
  }
  const content = fs.readFileSync(csvPath, 'utf-8');
  cachedData = parseCSV(content);
  console.log(`✅ Loaded ${cachedData.length} records from safety_severity.csv`);
  return cachedData;
}

const haversineMeters = (lat1, lon1, lat2, lon2) => {
  const R = 6371000;
  const toRad = x => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const labelToScore = label => {
  const map = {
    safe: 15, low: 20, moderate: 50, medium: 50,
    high: 75, danger: 80, unsafe: 85, critical: 95,
  };
  return map[(label || '').toLowerCase().trim()] ?? 50;
};

export const getSeverityNearby = async (req, res) => {
  try {
    const { lat, lng, radius = 5000 } = req.body;
    if (!lat || !lng) {
      return res.status(400).json({ success: false, message: 'Location (lat, lng) required' });
    }

    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    const searchRadius = parseFloat(radius);
    const data = loadCSVData();

    if (data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No CSV data loaded. Place safety_severity.csv in backend/data/',
      });
    }

    // ── Detect current time of day (server local clock) ───────────────────
    const nowHour = new Date().getHours();
    const currentTimeOfDay = (nowHour >= 18 || nowHour < 6) ? 'night' : 'day';
    const isNightTime = currentTimeOfDay === 'night';

    // ── Filter rows within search radius ──────────────────────────────────
    let nearbyRows = [];
    for (const row of data) {
      const rLat = parseFloat(row.latitude);
      const rLng = parseFloat(row.longitude);
      if (isNaN(rLat) || isNaN(rLng)) continue;
      const dist = haversineMeters(userLat, userLng, rLat, rLng);
      if (dist <= searchRadius) {
        nearbyRows.push({ ...row, _distance: Math.round(dist) });
      }
    }

    // ── Fallback: closest point if nothing in radius ───────────────────────
    let usedFallback = false;
    if (nearbyRows.length === 0) {
      let minDist = Infinity;
      let closest = null;
      for (const row of data) {
        const rLat = parseFloat(row.latitude);
        const rLng = parseFloat(row.longitude);
        if (isNaN(rLat) || isNaN(rLng)) continue;
        const dist = haversineMeters(userLat, userLng, rLat, rLng);
        if (dist < minDist) { minDist = dist; closest = { ...row, _distance: Math.round(dist) }; }
      }
      if (closest) { nearbyRows = [closest]; usedFallback = true; }
    }

    // ── Time-weighted severity score ───────────────────────────────────────
    let severityScore = 0;
    let nightMultiplierApplied = false;

    if (nearbyRows.length > 0) {
      // Rows matching current time of day count 3× more in the weighted pool
      const matching = nearbyRows.filter(r => (r.time_of_day || '').toLowerCase() === currentTimeOfDay);
      const other    = nearbyRows.filter(r => (r.time_of_day || '').toLowerCase() !== currentTimeOfDay);
      const pool = matching.length > 0
        ? [...matching, ...matching, ...matching, ...other]
        : nearbyRows;

      const avgCrimeRate  = pool.reduce((s, r) => s + (parseFloat(r.crime_rate)  || 0), 0) / pool.length;
      const avgLabelScore = pool.reduce((s, r) => s + labelToScore(r.region_severity), 0) / pool.length;

      // Base: crime_rate (70%) + label (30%)
      let baseScore = avgCrimeRate * 70 + (avgLabelScore / 100) * 30;

      // Night penalty: ×1.4 multiplier + low-lighting bonus (up to +15 pts)
      if (isNightTime) {
        const avgLighting = pool.reduce((s, r) => s + (parseFloat(r.lighting) || 0.5), 0) / pool.length;
        baseScore = baseScore * 1.4 + (1 - avgLighting) * 15;
        nightMultiplierApplied = true;
      }

      severityScore = Math.min(100, Math.max(0, Math.round(baseScore)));
    }

    // ── Label & verdict ────────────────────────────────────────────────────
    let severityLabel, severityColor, severityEmoji;
    if (severityScore < 25) {
      severityLabel = 'Low';      severityColor = '#22c55e'; severityEmoji = '🟢';
    } else if (severityScore < 50) {
      severityLabel = 'Moderate'; severityColor = '#eab308'; severityEmoji = '🟡';
    } else if (severityScore < 75) {
      severityLabel = 'High';     severityColor = '#f97316'; severityEmoji = '🟠';
    } else {
      severityLabel = 'Critical'; severityColor = '#ef4444'; severityEmoji = '🔴';
    }

    const isSafe = severityScore < 40; // SAFE if Low/low-Moderate

    // ── Heatmap points & incident list ─────────────────────────────────────
    const heatmapPoints = nearbyRows.map(r => [
      parseFloat(r.latitude),
      parseFloat(r.longitude),
      Math.max(0.1, parseFloat(r.crime_rate) || 0.3),
    ]);

    const incidents = nearbyRows.map(r => ({
      lat: parseFloat(r.latitude),
      lng: parseFloat(r.longitude),
      crime_rate: parseFloat(r.crime_rate) || 0,
      traffic_density: parseFloat(r.traffic_density) || 0,
      lighting: parseFloat(r.lighting) || 0,
      time_of_day: r.time_of_day || 'unknown',
      cluster: parseInt(r.cluster) || 0,
      region_severity: r.region_severity || 'safe',
      distance: r._distance,
    }));

    res.json({
      success: true,
      count: nearbyRows.length,
      usedFallback,
      searchRadius,
      currentTimeOfDay,
      isNightTime,
      nightMultiplierApplied,
      isSafe,
      severityScore,
      severityLabel,
      severityColor,
      severityEmoji,
      heatmapPoints,
      incidents,
    });
  } catch (error) {
    console.error('Severity API error:', error);
    res.status(500).json({ success: false, message: 'Error computing severity' });
  }
};
