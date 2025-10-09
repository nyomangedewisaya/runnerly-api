import express from 'express';
import authRoutes from './routes/auth.js';
import activityRoutes from './routes/activities.js';
import challengeRoutes from './routes/challenges.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/challenges', challengeRoutes);

app.listen(port, () => {
  console.log(`🚀 Server berjalan di http://localhost:${port}`);
});