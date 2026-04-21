import axios from "axios";
import SafePlace from "../models/safeplace.model.js";

const SERP_API_KEY = process.env.SERP_API_KEY;

async function getPhoneFromSerp(name) {
  try {
    const query = `${name} Maharashtra police station phone`;

    const res = await axios.get("https://serpapi.com/search", {
      params: {
        engine: "google",
        q: query,
        api_key: SERP_API_KEY,
      },
    });

    const data = res.data;

    if (data.answer_box?.phone) return data.answer_box.phone;
    if (data.knowledge_graph?.phone) return data.knowledge_graph.phone;

    const text = JSON.stringify(data);
    const match = text.match(/\+91[\d\s-]{10,}/g);

    return match ? match[0] : null;
  } catch (error) {
    console.error("SerpAPI Error:", error.message);
    return null;
  }
}

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;

  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 15) *
      Math.sin(dLon / 15);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

export const addSafePlace = async (req, res) => {
  try {
    const { name, type, address, phone, lat, lng, description } = req.body;

    if (!name || !type || !address || lat === undefined || lng === undefined) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    const newSafePlace = new SafePlace({
      name,
      type,
      address,
      phone,
      location: {
        lat: latitude,
        lng: longitude,
      },
      description,
    });

    await newSafePlace.save();

    res.status(201).json({
      success: true,
      message: "Safe place registered successfully",
      safePlace: newSafePlace,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error storing safe place",
    });
  }
};

export const getNearbySafePlaces = async (req, res) => {
  try {
    const { lat, lng } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: "Location required",
      });
    }

    // 🔥 1. Fetch from OSM
    const overpassQuery = `
    [out:json][timeout:25];
    (
      nwr["amenity"="police"](around:5000,${lat},${lng});
      nwr["amenity"="hospital"](around:5000,${lat},${lng});
      nwr["amenity"="clinic"](around:3000,${lat},${lng});
    );
    out center 15;
    `;

    // Try multiple Overpass instances for reliability
    const overpassInstances = [
      "https://overpass-api.de/api/interpreter",
      "https://lz4.overpass-api.de/api/interpreter",
      "https://overpass.kumi.systems/api/interpreter",
      "https://overpass.osm.ch/api/interpreter"
    ];

    let osmRes;
    for (const url of overpassInstances) {
      try {
        console.log(`Attempting OSM fetch from: ${url}`);
        osmRes = await axios.get(url, { 
          params: { data: overpassQuery },
          timeout: 10000,
          headers: {
            'User-Agent': 'SafeHerWomenSafetyApp/1.0'
          }
        });
        if (osmRes.data?.elements && osmRes.data.elements.length > 0) break;
      } catch (err) {
        console.warn(`Overpass instance ${url} failed: ${err.message}`);
      }
    }

    // Standardize coordinates for ways/relations (use 'center' property if present)
    const rawPlaces = osmRes?.data?.elements || [];
    const places = rawPlaces.map(p => {
      if (p.type === 'way' || p.type === 'relation') {
        return { ...p, lat: p.center.lat, lon: p.center.lon };
      }
      return p;
    });

    console.log(`OSM found ${places.length} places.`);


    // 🔥 2. Enrich with phone - Optimized Parallel Processing
    const enrichmentPromises = places.slice(0, 10).map(async (place) => {
      let type = place.tags?.amenity || "safe_zone";
      const name = place.tags?.name || `${type.charAt(0).toUpperCase() + type.slice(1)}`;

      let phone = place.tags?.phone || place.tags?.["contact:phone"];
      
      // Only call SerpAPI for the first 4 places to avoid long waits and rate limits
      if (!phone && places.indexOf(place) < 4 && SERP_API_KEY) {
        try {
          phone = await getPhoneFromSerp(`${name} ${place.tags?.["addr:city"] || ""}`);
        } catch (e) {
          console.error("Serp fetch failed for", name);
        }
      }

      return {
        name,
        address: place.tags?.["addr:street"] || place.tags?.["addr:full"] || "Nearby Area",
        type: type,
        location: {
          lat: place.lat,
          lng: place.lon,
        },
        phone: phone || "112",
        distance: calculateDistance(lat, lng, place.lat, place.lon).toFixed(2),
      };
    });

    const apiResults = await Promise.all(enrichmentPromises);

    // 3. Combine with database places
    const dbSafePlaces = await SafePlace.find().limit(50);
    const nearbyDbPlaces = dbSafePlaces
      .filter((place) => {
        const distance = calculateDistance(
          lat,
          lng,
          place.location.lat,
          place.location.lng,
        );
        return distance <= 10; // 10km radius for DB places
      })
      .map((p) => ({
        ...p._doc,
        distance: calculateDistance(
          lat,
          lng,
          p.location.lat,
          p.location.lng,
        ).toFixed(2),
      }));

    const combinedPlaces = [...apiResults, ...nearbyDbPlaces]
      .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

    res.json({
      success: true,
      count: combinedPlaces.length,
      safePlaces: combinedPlaces.slice(0, 20), // Limit total results for UI performance
    });
  } catch (error) {
    console.error("Error in getNearbySafePlaces:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching nearby safe places",
      error: error.message
    });
  }
};

