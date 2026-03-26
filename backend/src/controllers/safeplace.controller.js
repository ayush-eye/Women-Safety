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
        api_key: SERP_API_KEY
      }
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
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

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
      node["amenity"="police"](around:2000,${lat},${lng});
      node["amenity"="hospital"](around:1000,${lat},${lng});
      node["amenity"="clinic"](around:1000,${lat},${lng});
    );
    out;
    `;

    const osmRes = await axios.get(
        "https://overpass.kumi.systems/api/interpreter",
        {
          params: { data: overpassQuery }
        }
      );
  
  
      const places = osmRes.data?.elements || [];
      console.log(`OSM found ${places.length} places.`);
  
      if (osmRes.data?.remark) {
        console.warn("OSM Warning:", osmRes.data.remark);
      }
  
      // 🔥 2. Enrich with phone
      const apiResults = [];
  
      for (const place of places) {
        let type = place.tags?.amenity || "safe_zone";
        const name = place.tags?.name || `${type.charAt(0).toUpperCase() + type.slice(1)}`;
        
        const phone =
          place.tags?.phone ||
          place.tags?.["contact:phone"] ||
          (await getPhoneFromSerp(`${name} ${place.tags?.["addr:city"] || ""}`)) ||
          "112";
  
        apiResults.push({
          name,
          address: place.tags?.["addr:street"] || "Nearby Area",
          type: type,
          location: {
            lat: place.lat,
            lng: place.lon,
          },
          phone,
          distance: calculateDistance(lat, lng, place.lat, place.lon).toFixed(2)
        });
  
        // prevent rate limit - reducing wait to 500ms since we have more places
        await new Promise(r => setTimeout(r, 500));
      }

    // 3. Combine with database places
    const dbSafePlaces = await SafePlace.find();
    const nearbyDbPlaces = dbSafePlaces.filter((place) => {
      const distance = calculateDistance(
        lat,
        lng,
        place.location.lat,
        place.location.lng,
      );
      return distance <= 5;
    }).map(p => ({
        ...p._doc,
        distance: calculateDistance(lat, lng, p.location.lat, p.location.lng).toFixed(2)
    }));

    const combinedPlaces = [...apiResults, ...nearbyDbPlaces];

    res.json({
      success: true,
      count: combinedPlaces.length,
      safePlaces: combinedPlaces,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching nearby safe places",
    });
  }
};
