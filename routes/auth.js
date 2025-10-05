import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { email, password, fullName, age, username } = req.body;

  if (!email ||!age || !password || !fullName || !username) {
    return res.status(400).json({ message: 'All data must be filled' });
  }

  if (age && parseInt(age) <= 13) {
    return res.status(400).json({ message: 'Your age must be more than 13 years old to register.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash: hashedPassword,
        fullName,
        age
      },
    });

    const { passwordHash, ...userWithoutPassword } = newUser;
    res.status(201).json({
      message: 'Registrasi berhasil',
      user: userWithoutPassword,
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ message: `Error: ${error.meta.target.join(', ')} already used.` });
    }
    console.error(error);
    res.status(500).json({ message: 'Error server connection' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email dan password must be filled' });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'Email not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Wrong password!' });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        const { passwordHash, ...userWithoutPassword } = user;
        
        res.status(200).json({
            message: 'Login success',
            token: token,
            user: userWithoutPassword,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error server connection' });
    }
});

export default router; 