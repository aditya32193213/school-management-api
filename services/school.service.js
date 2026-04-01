import pool from "../config/db.js";
import { getDistance } from "../utils/helpers.js";

// ➕ Add School Service
export const addSchoolService = async (data) => {
  // Note: validation is already done in the controller.
  // Service-level check is a lightweight guard for direct service calls.
  const { name, address, latitude, longitude } = data;

  const lat = Number(latitude);
  const lon = Number(longitude);

  if (
    !name ||
    !address ||
    isNaN(lat) ||
    isNaN(lon) ||
    lat < -90  || lat > 90  ||
    lon < -180 || lon > 180
  ) {
    throw Object.assign(new Error("Invalid input data"), { status: 400 });
  }

  // ✅ pool.execute() checks out a connection automatically and returns it to the pool.
  const [result] = await pool.execute(
    `INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)`,
    [name, address, lat, lon]
  );

  return result;
};


// 📍 List Schools Service
export const listSchoolsService = async (userLat, userLon) => {
  const lat = Number(userLat);
  const lon = Number(userLon);

  if (
    isNaN(lat) ||
    isNaN(lon) ||
    lat < -90  || lat > 90  ||
    lon < -180 || lon > 180
  ) {
    throw Object.assign(new Error("Invalid latitude or longitude"), { status: 400 });
  }

  // ✅ No need to manually acquire/release; pool.execute handles it.
  const [schools] = await pool.execute("SELECT * FROM schools");

  const result = schools.map((school) => {
    const distance = getDistance(lat, lon, school.latitude, school.longitude);
    return {
      ...school,
      distance_km: parseFloat(distance.toFixed(2)), // ✅ rounded to 2 decimal places
    };
  });

  return result.sort((a, b) => a.distance_km - b.distance_km);
};