const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'rahasia';

module.exports = (req, res, next) => {
  const auth = req.headers.authorization; // request selalu dijalankan untuk auth
  if (!auth || !auth.startsWith('Bearer '))
    return res.status(401).json({ message: 'Token tidak ditemukan' }); // jika token tidak ada dan tidak dalam format bearer ditolak

  const token = auth.split(' ')[1]; // memisahkan token dari format bearer, diambil token saja

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // sekarang bisa akses req.user.userId
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token tidak valid' });
  } //verifikasi token apakah valid
};
