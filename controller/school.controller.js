import {
  addSchoolService,
  listSchoolsService,
} from "../services/school.service.js";

// ➕ Add School Controller
export const addSchool = async (req, res, next) => {
  try {
    const { name, address, latitude, longitude } = req.body;

    // Presence check
    if (!name?.trim() || !address?.trim() || latitude == null || longitude == null) {
      return res.status(400).json({
        success: false,
        message: "All fields are required: name, address, latitude, longitude",
      });
    }

    const lat = Number(latitude);
    const lon = Number(longitude);

    // Type check
    if (isNaN(lat) || isNaN(lon)) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude must be valid numbers",
      });
    }

    
    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      return res.status(400).json({
        success: false,
        message: "Latitude must be between -90 and 90; longitude between -180 and 180",
      });
    }

    const result = await addSchoolService({
      name: name.trim(),
      address: address.trim(),
      latitude: lat,
      longitude: lon,
    });

    return res.status(201).json({
      success: true,
      message: "School added successfully",
      data: {
        id: result.insertId,
      },
    });

  } catch (error) {
    next(error);
  }
};


// 📍 List Schools Controller
export const listSchools = async (req, res, next) => {
  try {
    const { latitude, longitude } = req.query;

    if (latitude == null || longitude == null) {
      return res.status(400).json({
        success: false,
        message: "Query params latitude and longitude are required",
      });
    }

    const lat = Number(latitude);
    const lon = Number(longitude);

    if (
      isNaN(lat)  || isNaN(lon)  ||
      lat < -90   || lat > 90    ||
      lon < -180  || lon > 180
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid latitude or longitude values",
      });
    }

    const schools = await listSchoolsService(lat, lon);

    return res.status(200).json({
      success: true,
      count: schools.length,
      data: schools,
    });

  } catch (error) {
    next(error);
  }
};