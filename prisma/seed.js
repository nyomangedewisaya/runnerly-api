import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}
function randomDuration(minMinutes, maxMinutes) {
  const totalMinutes = random(minMinutes, maxMinutes);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const seconds = random(0, 59);
  return new Date(`1970-01-01T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}Z`);
}

async function main() {
  console.log('🌱 Starting the seeding process...');
  console.log('🧹 Cleaning up the database...');
  await prisma.userPersonalBests.deleteMany();
  await prisma.challengeParticipant.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.challenge.deleteMany();
  await prisma.user.deleteMany();
  await prisma.activityType.deleteMany();
  await prisma.challengeType.deleteMany();
  console.log('✅ Database cleaned.');
  console.log('➕ Seeding master data (types)...');

  await prisma.activityType.createMany({
    data: [{ name: 'Running' }, { name: 'Cycling' }, { name: 'Walking' }, { name: 'Hiking' }],
    skipDuplicates: true,
  });
  const activityTypes = await prisma.activityType.findMany(); 

  await prisma.challengeType.createMany({
    data: [
      { name: 'Distance' },
      { name: 'Frequency' },
      { name: 'Elevation' },
      { name: 'Special' },
      { name: 'Calories' },
    ],
    skipDuplicates: true,
  });
  const challengeTypes = await prisma.challengeType.findMany(); 
  
  console.log('✅ Master data seeded.');

  console.log('➕ Seeding 15 users...'); 
  const usersData = [
    { username: 'alex_runs', fullName: 'Alex Johnson', email: 'alex.j@gmail.com' },
    { username: 'beta_stride', fullName: 'Bethany Smith', email: 'bethany.s@gmail.com' },
    { username: 'charlie_dash', fullName: 'Charlie Brown', email: 'charlie.b@gmail.com' },
    { username: 'diana_sprint', fullName: 'Diana Prince', email: 'diana.p@gmail.com' },
    { username: 'ethan_hike', fullName: 'Ethan Hunt', email: 'ethan.h@gmail.com' },
    { username: 'fiona_fast', fullName: 'Fiona Glenanne', email: 'fiona.g@gmail.com' },
    { username: 'george_trail', fullName: 'George Costanza', email: 'george.c@gmail.com' },
    { username: 'hannah_hill', fullName: 'Hannah Montana', email: 'hannah.m@gmail.com' },
    { username: 'ian_go', fullName: 'Ian Malcolm', email: 'ian.m@gmail.com' },
    { username: 'jenna_jog', fullName: 'Jenna Maroney', email: 'jenna.m@gmail.com' },
    { username: 'kyle_cycle', fullName: 'Kyle Broflovski', email: 'kyle.b@gmail.com' },
    { username: 'laura_loop', fullName: 'Laura Palmer', email: 'laura.p@gmail.com' },
    { username: 'mike_mile', fullName: 'Mike Wheeler', email: 'mike.w@gmail.com' },
    { username: 'nancy_pace', fullName: 'Nancy Drew', email: 'nancy.d@gmail.com' },
    { username: 'oscar_run', fullName: 'Oscar Martinez', email: 'oscar.m@gmail.com' },
  ];
  const createdUsers = [];
  const hashedPassword = await bcrypt.hash('password123', 10);
  for (const u of usersData) {
    const user = await prisma.user.create({
      data: { ...u, passwordHash: hashedPassword, age: random(18, 55) },
    });
    createdUsers.push(user);
  }
  console.log(`✅ ${createdUsers.length} users seeded.`);
  
  console.log('➕ Seeding 9 challenges...');
  const createdChallenges = [];
  const challengesData = [
    { title: 'October 100K Haul', type: 'Distance', difficulty: 'Medium', target: 100, unit: 'km', points: 200, badge: 'badge_100k.png', maxP: 50 },
    { title: 'Sunrise Chaser', type: 'Frequency', difficulty: 'Easy', target: 15, unit: 'runs', description: 'Complete 15 runs before 8 AM this month.', points: 100 },
    { title: 'Urban Explorer', type: 'Distance', difficulty: 'Easy', target: 50, unit: 'km', points: 80, maxP: 100 },
    { title: 'Hill Conqueror', type: 'Elevation', difficulty: 'Hard', target: 1000, unit: 'meters', description: 'Accumulate 1000 meters of elevation gain.', points: 300, badge: 'badge_elevation.png' },
    { title: 'Calorie Crusher', type: 'Calories', difficulty: 'Medium', target: 15000, unit: 'calories', points: 150 },
    { title: 'September Sprint', type: 'Distance', difficulty: 'Easy', target: 50, unit: 'km', points: 50, isFinished: true },
    { title: 'Consistency is Key', type: 'Frequency', difficulty: 'Medium', target: 20, unit: 'runs', isFinished: true },
    { title: 'November Marathon Prep', type: 'Distance', difficulty: 'Hard', target: 150, unit: 'km', points: 400, badge: 'badge_marathon.png', isUpcoming: true },
    { title: 'Turkey Trot Tune-Up', type: 'Frequency', difficulty: 'Easy', target: 10, unit: 'runs', isUpcoming: true },
  ];

  for (const c of challengesData) {
    const creator = createdUsers[random(0, createdUsers.length - 1)];
    const type = challengeTypes.find(t => t.name === c.type);
    
    let startDate, endDate;
    const currentYear = 2025;
    if (c.isFinished) { 
      startDate = new Date(currentYear, 8, 1);
      endDate = new Date(currentYear, 8, 30, 23, 59, 59);
    } else if (c.isUpcoming) { 
      startDate = new Date(currentYear, 10, 1);
      endDate = new Date(currentYear, 10, 30, 23, 59, 59);
    } else { 
      startDate = new Date(currentYear, 9, 1);
      endDate = new Date(currentYear, 9, 31, 23, 59, 59);
    }

    const challenge = await prisma.challenge.create({
      data: {
        title: c.title,
        description: c.description || null, 
        difficulty: c.difficulty,
        targetValue: c.target,
        unit: c.unit,
        startDate,
        endDate,
        rewardPoints: c.points || null,
        badgeUrl: c.badge ? `/badges/${c.badge}` : null,
        maxParticipants: c.maxP || null,
        createdByUserId: creator.id,
        challengeTypeId: type.id,
      },
    });
    createdChallenges.push(challenge);
  }
  console.log(`✅ ${createdChallenges.length} challenges seeded.`);

  console.log('➕ Seeding ~150 activities...');
  let totalActivities = 0;
  for (const user of createdUsers) {
    const numActivities = random(8, 12);
    for (let i = 0; i < numActivities; i++) {
      const distance = parseFloat((Math.random() * (21 - 2) + 2).toFixed(2));
      const duration = randomDuration(10, 150);
      const durationInHours = (duration.getTime() - new Date('1970-01-01T00:00:00Z')) / (1000 * 60 * 60);
      
      await prisma.activity.create({
        data: {
          title: ['Morning Run', 'Lunch Break Jog', 'Evening Stride', 'City Park Loop', 'Trail Exploration', 'Hill Sprints'][random(0, 5)],
          distance,
          duration,
          caloriesBurned: Math.floor(distance * 65),
          averagePace: parseFloat((distance / durationInHours).toFixed(2)),
          activityTimestamp: randomDate(new Date('2025-09-01'), new Date('2025-10-05')),
          userId: user.id,
          activityTypeId: activityTypes.find(at => at.name === 'Running').id,
        },
      });
      totalActivities++;
    }
  }
  console.log(`✅ ${totalActivities} activities seeded.`);
  console.log('➕ Seeding challenge participants...');
  for (const challenge of createdChallenges) {
    const numParticipants = random(5, createdUsers.length - 1);
    const participants = createdUsers.sort(() => 0.5 - Math.random()).slice(0, numParticipants);
    for (const user of participants) {
      await prisma.challengeParticipant.create({
        data: {
          userId: user.id,
          challengeId: challenge.id,
          progress: parseFloat((Math.random() * challenge.targetValue).toFixed(2)),
        },
      }).catch(() => {});
    }
  }
  console.log('✅ Challenge participants seeded.');
  console.log('📈 Calculating and seeding personal bests...');
  for (const user of createdUsers) {
    const activities = await prisma.activity.findMany({ where: { userId: user.id } });
    if (activities.length > 0) {
      const bests = activities.reduce((acc, act) => ({
        longestDistance: Math.max(acc.longestDistance, parseFloat(act.distance)),
        longestDuration: new Date(Math.max(acc.longestDuration.getTime(), act.duration.getTime())),
        fastestSpeed: Math.max(acc.fastestSpeed, parseFloat(act.averagePace)),
        mostCaloriesBurned: Math.max(acc.mostCaloriesBurned, act.caloriesBurned),
      }), { longestDistance: 0, longestDuration: new Date(0), fastestSpeed: 0, mostCaloriesBurned: 0 });

      await prisma.userPersonalBests.create({
        data: {
          userId: user.id,
          ...bests,
        },
      });
    }
  }
  console.log('✅ Personal bests seeded.');
  console.log('🎉 Seeding finished successfully!');
}


main()
  .catch(async (e) => {
    console.error('❌ An error occurred during seeding:', e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });