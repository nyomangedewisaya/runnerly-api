import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { formatDuration, formatTotalDuration } from '../utils/formatters.js';
import { isLogin } from '../middleware/index.js';

const router = Router();
const prisma = new PrismaClient();

const transformActivity = (activity) => {
  if (!activity) return null;

  return {
    id: activity.id,
    userId: activity.userId,
    title: activity.title,
    activityType: activity.activityType.name, 
    distance: activity.distance,
    duration: formatDuration(activity.duration), 
    averagePace: activity.averagePace,
    calories: activity.caloriesBurned, 
    endTime: activity.activityTimestamp,
    createdAt: activity.createdAt,
    username: activity.user.username,
    userProfilePicture: activity.user.profilePictureUrl,
    profilePictureUrl: activity.user.profilePictureUrl, 
    isPublic: activity.isPublic,
  };
};

// GET /api/activities
router.get('/', isLogin, async (req, res) => {
  const { userId, page = 1, pageSize = 10 } = req.query;
  
  try {
    const activities = await prisma.activity.findMany({
      where: { userId: userId ? parseInt(userId) : undefined },
      skip: (parseInt(page) - 1) * parseInt(pageSize),
      take: parseInt(pageSize),
      orderBy: { activityTimestamp: 'desc' },
      include: {
        user: { select: { username: true, profilePictureUrl: true } },
        activityType: true,
      },
    });
    
    const response = activities.map(transformActivity);
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error server connection' });
  }
});


// GET /api/activities/stats
router.get('/stats', isLogin, async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'Query parameter userId must be filled' });
  }

  try {
    const userActivities = await prisma.activity.findMany({
      where: { userId: parseInt(userId) },
      orderBy: { activityTimestamp: 'desc' },
      include: { activityType: true, user: true },
    });

    if (userActivities.length === 0) {
      return res.status(200).json({ message: 'Not yet activities for this user.' });
    }
    
    const personalBestsRaw = await prisma.userPersonalBests.findUnique({
      where: { userId: parseInt(userId) },
    });

    let totalDistance = 0;
    let totalCalories = 0;
    let totalDurationMs = 0;
    userActivities.forEach(act => {
        totalDistance += parseFloat(act.distance);
        totalCalories += act.caloriesBurned || 0;
        totalDurationMs += act.duration.getTime() - new Date('1970-01-01T00:00:00Z').getTime();
    });
    
    const totalDurationInHours = totalDurationMs / (1000 * 60 * 60);
    const averagePace = totalDurationInHours > 0 ? (totalDistance / totalDurationInHours).toFixed(2) : 0;
    const personalBests = {
        longestDistance: personalBestsRaw.longestDistance,
        fastestSpeed: personalBestsRaw.fastestSpeed,
        longestDuration: formatDuration(personalBestsRaw.longestDuration),
        mostCalories: personalBestsRaw.mostCaloriesBurned,
    };
    const recentActivities = userActivities.slice(0, 5).map(transformActivity);
    const stats = {
      totalActivities: userActivities.length,
      totalDistance: parseFloat(totalDistance.toFixed(2)),
      totalDuration: formatTotalDuration(totalDurationMs),
      averagePace: parseFloat(averagePace),
      totalCalories: totalCalories,
      thisWeekDistance: 0, 
      thisMonthDistance: 0,
      personalBests,
      recentActivities,
    };
    
    res.status(200).json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error server connection' });
  }
});

// GET /api/activities/:id
router.get('/:id', isLogin, async (req, res) => {
  const { id } = req.params;

  try {
    const activity = await prisma.activity.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: { select: { username: true } },
        activityType: true,
      }
    });

    if (!activity) {
      return res.status(404).json({ message: 'Activities not found' });
    }

    const response = {
        id: activity.id,
        userId: activity.userId,
        title: activity.title,
        activityType: activity.activityType.name,
        distance: activity.distance,
        duration: formatDuration(activity.duration),
        averagePace: activity.averagePace,
        calories: activity.caloriesBurned,
        endTime: activity.activityTimestamp,
        isPublic: activity.isPublic,
        createdAt: activity.createdAt
    };
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error server connection' });
  }
});

// POST /api/activities
router.post('/', isLogin, async (req, res) => {
  const { userId, date, distance, duration } = req.body;

  if (!userId || !distance || !duration || !duration.time) {
    return res.status(400).json({ message: 'userId, distance, dan duration (with time) must be filled' });
  }

  try {
    const runningType = await prisma.activityType.findFirst({ where: { name: 'Running' } });

    if (!runningType) {
      return res.status(500).json({ message: 'ActivityType "Running" not found.' });
    }
    
    const durationInHours = (new Date(`1970-01-01T${duration.time}Z`).getTime() / (1000 * 60 * 60));
    const averagePace = parseFloat((distance / durationInHours).toFixed(2));
    const calories = Math.floor(distance * 65);
    const activityDate = date ? new Date(date) : new Date();
    const newActivity = await prisma.activity.create({
      data: {
        title: `Run on ${activityDate.toISOString().split('T')[0]}`,
        distance: parseFloat(distance),
        duration: new Date(`1970-01-01T${duration.time}Z`),
        activityTimestamp: activityDate,
        averagePace: averagePace,
        caloriesBurned: calories,
        userId: parseInt(userId),
        activityTypeId: runningType.id,
      },
    });
    res.status(201).json(newActivity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error server connection' });
  }
});

export default router;