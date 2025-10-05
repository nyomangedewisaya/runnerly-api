import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { isLogin } from '../middleware/index.js';

const router = Router();
const prisma = new PrismaClient();

// GET /api/challenges/active
router.get('/active', isLogin, async (req, res) => {
  try {
    const activeChallenges = await prisma.challenge.findMany({
      where: { endDate: { gte: new Date() } },
      include: {
        creator: { select: { username: true } },
        challengeType: { select: { name: true } },
        _count: { select: { participants: true } },
      },
    });

    const response = activeChallenges.map(ch => {
        const endDate = new Date(ch.endDate);
        const now = new Date();
        const daysRemaining = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));

        return {
            id: ch.id,
            title: ch.title,
            description: ch.description,
            challengeType: ch.challengeType.name,
            difficulty: ch.difficulty,
            targetValue: ch.targetValue,
            unit: ch.unit,
            startDate: ch.startDate.toISOString(),
            endDate: ch.endDate.toISOString(),
            maxParticipants: ch.maxParticipants,
            currentParticipants: ch._count.participants,
            rewardPoints: ch.rewardPoints,
            badgeUrl: ch.badgeUrl,
            isParticipating: false, 
            userProgress: null,
            userProgressPercentage: null,
            userRank: null,
            daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
            createdByUsername: ch.creator.username,
            isPublic: ch.isPublic,
            isActive: now < endDate,
            createdByUserId: ch.createdByUserId,
            createdAt: ch.createdAt.toISOString()
        };
    });

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error server connection' });
  }
});

// GET /api/challenges/:id/leaderboard
router.get('/:id/leaderboard', isLogin, async (req, res) => {
    const { id } = req.params;

    try {
        const challenge = await prisma.challenge.findUnique({
            where: { id: parseInt(id) },
            include: {
                challengeType: true,
                participants: {
                    include: { user: { select: { username: true, profilePictureUrl: true } } },
                    orderBy: { progress: 'desc' }
                }
            }
        });

        if (!challenge) {
            return res.status(404).json({ message: 'Challenges not found' });
        }

        const leaderboard = {
            challengeId: challenge.id,
            challengeTitle: challenge.title,
            description: challenge.description,
            challengeType: challenge.challengeType.name,
            targetValue: challenge.targetValue,
            unit: challenge.unit,
            startDate: challenge.startDate.toISOString(),
            endDate: challenge.endDate.toISOString(),
            totalParticipants: challenge.participants.length,
            participants: challenge.participants.map((p, index) => ({
                rank: index + 1,
                username: p.user.username,
                profilePictureUrl: p.user.profilePictureUrl,
                progress: p.progress
            }))
        }

        res.status(200).json(leaderboard);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error server connection' });
    }
});

export default router;