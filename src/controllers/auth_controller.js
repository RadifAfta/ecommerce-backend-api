const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../prisma');

const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  const { name, email, password } = req.body; //ambil data dari body request

  const existing = await prisma.user.findUnique({ where: { email } });//fungsi prisma find unik email
  if (existing) return res.status(400).json({ message: 'Email sudah dipakai' }); // cek apakah email ada, jika iya mengeluarkan status 400

  const hashed = await bcrypt.hash(password, 10); //enkripsi password dengan 10 kali acak password

  const user = await prisma.user.create({
    data: { name, email, password: hashed },
  }); //simpan user ke database

  res.status(201).json({ message: 'User created', user: { id: user.id, name: user.name, email: user.email } });
}; // status berhasil dan respon data

exports.login = async (req, res) => {
  const { email, password } = req.body; //request body

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

  const isValid = await bcrypt.compare(password, user.password); // decode password
  if (!isValid) return res.status(401).json({ message: 'Password salah' });

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1d' }); // pembuatan jwt token dengan expired 1 hari

  res.json({ message: 'Login berhasil', token });
};
