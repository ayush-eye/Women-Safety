import SafePlace from "../models/safeplace.model.js";

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

    const safePlaces = await SafePlace.find();

    const nearbyPlaces = safePlaces.filter((place) => {
      const distance = calculateDistance(
        lat,
        lng,
        place.location.lat,
        place.location.lng,
      );

      return distance <= 3; // within 3km
    });

    res.json({
      success: true,
      count: nearbyPlaces.length,
      safePlaces: nearbyPlaces,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Error fetching nearby safe places",
    });
  }
};
