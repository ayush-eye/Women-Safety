import DangerPlace from "../models/dangerplace.model.js";

export const addDangerPlace = async (req, res) => {
  try {
    const { name, lat, lng, description, severity } = req.body;

    if (!name || lat === undefined || lng === undefined) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const newDangerPlace = new DangerPlace({
      name,
      location: { lat, lng },
      description,
      severity,
    });

    await newDangerPlace.save();

    res.status(201).json({
      success: true,
      message: "Danger zone registered successfully",
      dangerPlace: newDangerPlace,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error storing danger place",
    });
  }
};

export const getNearbyDangerPlaces = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: "Location required",
      });
    }

    const dangerPlaces = await DangerPlace.find();
    
    // Simple filter within 5km for now
    const nearby = dangerPlaces.filter(p => {
        const dist = Math.sqrt(
            Math.pow(p.location.lat - lat, 2) + 
            Math.pow(p.location.lng - lng, 2)
        ) * 111; // Approx km
        return dist <= 5;
    });

    res.json({
      success: true,
      dangerPlaces: nearby,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching nearby danger places",
    });
  }
};
