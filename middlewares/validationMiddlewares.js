// Middleware untuk melakukan validasi data sebelum proses
function validateData(req, res, next) {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    return res
      .status(400)
      .json({ error: "Name, email, and phone are required" });
  }
  next();
}

module.exports = validateData;
