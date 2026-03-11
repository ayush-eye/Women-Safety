import Alert from "../models/alert.model.js";

export const createAlert = async (req, res) => {
  try {

    const { lat, lng, message } = req.body;

    const mapLink = `https://maps.google.com/?q=${lat},${lng}`;

    const alert = await Alert.create({
      userId: req.user.id,
      location: { lat, lng },
      message,
      mapLink
    });

    res.status(201).json({
      success: true,
      alert
    });

  } catch (error) {

    res.status(500).json({
      message: "Alert creation failed"
    });

  }
};


/**
 * - Get all alerts (Admin only)
 */
export const getAlerts = async (req, res) => {

  try {

    const alerts = await Alert.find()
      .populate("userId", "name email phone")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      alerts
    });

  } catch (error) {

    res.status(500).json({
      message: "Error fetching alerts"
    });

  }

};