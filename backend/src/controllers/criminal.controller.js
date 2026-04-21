import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execFile } from "child_process";
import Criminal from "../models/criminal.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pythonPath = process.env.PYTHON_PATH || "python";
const tempLabelsFile = path.resolve(__dirname, "../../python/temp_labels.json");
const scriptPath = path.resolve(__dirname, "../../python/recognize_criminal.py");

const writeLabelsFile = async (criminals) => {
  const data = criminals.map((criminal) => ({
    id: criminal._id,
    name: criminal.name,
    description: criminal.description,
    photo: path.resolve(process.cwd(), criminal.photo),
  }));
  await fs.promises.writeFile(tempLabelsFile, JSON.stringify(data, null, 2));
};

export const addCriminal = async (req, res) => {
  try {
    const { name, description } = req.body;
    const photo = req.file ? req.file.path : null;
    if (!photo) {
      return res.status(400).json({ message: "Photo is required." });
    }

    const criminal = new Criminal({
      name,
      description,
      photo,
      addedBy: req.user.id,
    });

    await criminal.save();
    res.status(201).json({ message: "Criminal added successfully.", criminal });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getCriminals = async (req, res) => {
  try {
    const criminals = await Criminal.find().populate("addedBy", "name");
    res.json(criminals);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const identifyCriminal = async (req, res) => {
  try {
    const probePhoto = req.file ? req.file.path : null;
    if (!probePhoto) {
      return res.status(400).json({ message: "Photo is required for identification." });
    }

    const criminals = await Criminal.find();
    if (!criminals.length) {
      return res.status(404).json({ message: "No criminal records found." });
    }

    await writeLabelsFile(criminals);

    const absoluteProbePath = path.resolve(process.cwd(), probePhoto);
    const args = [scriptPath, "--probe", absoluteProbePath, "--labels", tempLabelsFile];

    execFile(pythonPath, args, { timeout: 30000 }, (error, stdout, stderr) => {
      if (error) {
        return res.status(500).json({
          message: "Recognition process failed.",
          error: stderr || error.message,
        });
      }
      try {
        const result = JSON.parse(stdout);
        return res.json(result);
      } catch (parseError) {
        return res.status(500).json({
          message: "Could not parse recognizer output.",
          error: parseError.message,
          raw: stdout,
        });
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
