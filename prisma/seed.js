const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

function getRandomDateInOctober2025() {
  const day = Math.floor(Math.random() * 31) + 1; // Hari antara 1 dan 31
  const hour = Math.floor(Math.random() * 24);
  const minute = Math.floor(Math.random() * 60);
  return new Date(2025, 9, day, hour, minute);
}

function getRandomDuration() {
  const totalMinutes = Math.floor(Math.random() * (120 - 15 + 1)) + 15;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const seconds = Math.floor(Math.random() * 60);
  return new Date(`1970-01-01T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}Z`);
}

async function main() {
  console.log('🌱 Memulai proses seeding...');
  console.log('🧹 Menghapus data lama...');
  await prisma.userPersonalBests.deleteMany();
  await prisma.challengeParticipant.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.challenge.deleteMany();
  await prisma.user.deleteMany();
  await prisma.activityType.deleteMany();
  await prisma.challengeType.deleteMany();
  console.log('✅ Data lama berhasil dihapus.');

  console.log('➕ Menambahkan data master...');
  await prisma.activityType.createMany({
    data: [{ name: 'Running' }, { name: 'Cycling' }, { name: 'Swimming' }, { name: 'Walking' }],
    skipDuplicates: true,
  });

  await prisma.challengeType.createMany({
    data: [
      { name: 'Distance' },
      { name: 'Time' },
      { name: 'Frequency' },
      { name: 'Speed' },
      { name: 'Calories' },
      { name: 'Special' },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Data master berhasil ditambahkan.');
  const runningType = await prisma.activityType.findUnique({ where: { name: 'Running' } });

  console.log('➕ Menambahkan 15 pengguna...');
  const usersData = [
    { username: 'budi_perkasa', fullName: 'Budi Perkasa', email: 'budi.perkasa@gmail.com' },
    { username: 'citra_lestari', fullName: 'Citra Lestari', email: 'citra.lestari@gmail.com' },
    { username: 'dewi_anggun', fullName: 'Dewi Anggun', email: 'dewi.anggun@gmail.com' },
    { username: 'eko_santoso', fullName: 'Eko Santoso', email: 'eko.santoso@gmail.com' },
    { username: 'fitri_indah', fullName: 'Fitri Indah', email: 'fitri.indah@gmail.com' },
    { username: 'ganjar_wijaya', fullName: 'Ganjar Wijaya', email: 'ganjar.wijaya@gmail.com' },
    { username: 'hana_yulita', fullName: 'Hana Yulita', email: 'hana.yulita@gmail.com' },
    { username: 'indra_jaya', fullName: 'Indra Jaya', email: 'indra.jaya@gmail.com' },
    { username: 'jana_sari', fullName: 'Jana Sari', email: 'jana.sari@gmail.com' },
    { username: 'kurnia_wibowo', fullName: 'Kurnia Wibowo', email: 'kurnia.wibowo@gmail.com' },
    { username: 'lina_marina', fullName: 'Lina Marina', email: 'lina.marina@gmail.com' },
    { username: 'maya_putri', fullName: 'Maya Putri', email: 'maya.putri@gmail.com' },
    { username: 'nugroho_adi', fullName: 'Nugroho Adi', email: 'nugroho.adi@gmail.com' },
    { username: 'olivia_rahma', fullName: 'Olivia Rahma', email: 'olivia.rahma@gmail.com' },
    { username: 'putra_utama', fullName: 'Putra Utama', email: 'putra.utama@gmail.com' },
  ];

  const createdUsers = [];
  const hashedPassword = await bcrypt.hash('password123', 10);

  for (const userData of usersData) {
    const user = await prisma.user.create({
      data: {
        ...userData,
        passwordHash: hashedPassword,
        age: Math.floor(Math.random() * (40 - 20 + 1)) + 20,
      },
    });
    createdUsers.push(user);
  }
  console.log(`✅ ${createdUsers.length} pengguna berhasil ditambahkan.`);

  console.log('➕ Menambahkan 10 tantangan...');
  const createdChallenges = [];
  const challengeTypes = await prisma.challengeType.findMany();

  const challengesData = [
    { title: 'October Rush 100K', difficulty: 'Medium', targetValue: 100, unit: 'km', typeName: 'Distance' },
    { title: 'Weekly Warrior', difficulty: 'Easy', targetValue: 5, unit: 'runs', typeName: 'Frequency' },
    { title: 'Calorie Burner 10000', difficulty: 'Hard', targetValue: 10000, unit: 'calories', typeName: 'Calories' },
    { title: 'Sub-30 5K Challenge', difficulty: 'Medium', targetValue: 30, unit: 'minutes', typeName: 'Time' },
    { title: 'Night Owl Runner', difficulty: 'Easy', targetValue: 10, unit: 'runs', typeName: 'Special' },
  ];

  for (const challengeData of challengesData) {
    const randomCreator = createdUsers[Math.floor(Math.random() * createdUsers.length)];
    const challengeType = challengeTypes.find(t => t.name === challengeData.typeName);
    const challenge = await prisma.challenge.create({
      data: {
        title: challengeData.title,
        description: `Tantangan ${challengeData.title} untuk bulan Oktober 2025.`,
        difficulty: challengeData.difficulty,
        targetValue: challengeData.targetValue,
        unit: challengeData.unit,
        startDate: new Date('2025-10-01T00:00:00Z'),
        endDate: new Date('2025-10-31T23:59:59Z'),
        rewardPoints: (Math.floor(Math.random() * 20) + 10) * 10,
        createdByUserId: randomCreator.id,
        challengeTypeId: challengeType.id,
      },
    });
    createdChallenges.push(challenge);
  }
  console.log(`✅ ${createdChallenges.length} tantangan berhasil ditambahkan.`);

  console.log('➕ Menambahkan banyak aktivitas untuk setiap pengguna...');
  let totalActivities = 0;
  for (const user of createdUsers) {
    const numberOfActivities = Math.floor(Math.random() * 10) + 5;
    for (let i = 0; i < numberOfActivities; i++) {
      const distance = parseFloat((Math.random() * (15 - 2) + 2).toFixed(2));
      const duration = getRandomDuration();
      const durationInHours = duration.getUTCHours() + duration.getUTCMinutes() / 60 + duration.getUTCSeconds() / 3600;

      await prisma.activity.create({
        data: {
          title: `Lari ${['Pagi', 'Siang', 'Sore', 'Malam'][Math.floor(Math.random() * 4)]}`,
          distance: distance,
          duration: duration,
          caloriesBurned: Math.floor(distance * 65),
          averagePace: parseFloat((distance / durationInHours).toFixed(2)),
          activityTimestamp: getRandomDateInOctober2025(),
          userId: user.id,
          activityTypeId: runningType.id,
        },
      });
      totalActivities++;
    }
  }
  console.log(`✅ ${totalActivities} total aktivitas berhasil ditambahkan.`);
  
  console.log('➕ Menambahkan partisipan ke tantangan...');
  let totalParticipants = 0;
  for (const challenge of createdChallenges) {
    const participantCount = Math.floor(Math.random() * (createdUsers.length / 2)) + 3;
    const shuffledUsers = [...createdUsers].sort(() => 0.5 - Math.random());
    const participants = shuffledUsers.slice(0, participantCount);

    for (const user of participants) {
      if (user.id !== challenge.createdByUserId) {
        await prisma.challengeParticipant.create({
          data: {
            userId: user.id,
            challengeId: challenge.id,
            progress: parseFloat((Math.random() * challenge.targetValue * 0.5).toFixed(2)),
          },
        });
        totalParticipants++;
      }
    }
  }
  console.log(`✅ ${totalParticipants} total partisipan berhasil ditambahkan.`);

  console.log('📈 Menghitung dan menyimpan rekor pribadi (personal bests)...');
  for (const user of createdUsers) {
    const userActivities = await prisma.activity.findMany({
      where: { userId: user.id },
    });

    if (userActivities.length > 0) {
      const personalBests = userActivities.reduce((bests, activity) => {
        if (activity.distance > bests.longestDistance) {
          bests.longestDistance = activity.distance;
        }
        if (activity.duration > bests.longestDuration) {
          bests.longestDuration = activity.duration;
        }
        if (activity.averagePace > bests.fastestSpeed) {
          bests.fastestSpeed = activity.averagePace;
        }
        if (activity.caloriesBurned > bests.mostCaloriesBurned) {
          bests.mostCaloriesBurned = activity.caloriesBurned;
        }
        return bests;
      }, {
        longestDistance: 0,
        longestDuration: new Date('1970-01-01T00:00:00Z'),
        fastestSpeed: 0,
        mostCaloriesBurned: 0,
      });

      await prisma.userPersonalBests.create({
        data: {
          userId: user.id,
          longestDistance: personalBests.longestDistance,
          longestDuration: personalBests.longestDuration,
          fastestSpeed: personalBests.fastestSpeed,
          mostCaloriesBurned: personalBests.mostCaloriesBurned,
        },
      });
    }
  }
  console.log('✅ Rekor pribadi semua pengguna berhasil disimpan.');


  console.log('🎉 Seeding selesai!');
}

main()
  .catch((e) => {
    console.error('❌ Terjadi kesalahan saat seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });