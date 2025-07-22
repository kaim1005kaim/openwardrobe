import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 データベースのシードを開始...');

  // Demo user creation
  const hashedPassword = await bcrypt.hash('demo123', 12);

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@openwardrobe.com' },
    update: {},
    create: {
      email: 'demo@openwardrobe.com',
      name: 'Demo User',
      password: hashedPassword,
      role: 'user'
    }
  });

  console.log('✅ デモユーザーを作成:', demoUser);

  // Admin user creation
  const adminPassword = await bcrypt.hash('admin123', 12);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@openwardrobe.com' },
    update: {},
    create: {
      email: 'admin@openwardrobe.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'admin'
    }
  });

  console.log('✅ 管理者ユーザーを作成:', adminUser);

  // Sample analytics event
  await prisma.analyticsEvent.create({
    data: {
      userId: demoUser.id,
      sessionId: 'seed-session-1',
      event: 'app_startup',
      properties: { source: 'seed' },
      context: {
        userAnonId: 'seed-user',
        sessionId: 'seed-session-1',
        device: 'desktop',
        locale: 'ja'
      }
    }
  });

  console.log('🎉 シードデータの作成が完了しました！');
  console.log('');
  console.log('📝 テスト用アカウント:');
  console.log('   Demo User:');
  console.log('   Email: demo@openwardrobe.com');
  console.log('   Password: demo123');
  console.log('');
  console.log('   Admin User:');
  console.log('   Email: admin@openwardrobe.com');
  console.log('   Password: admin123');
}

main()
  .catch((e) => {
    console.error('❌ シードエラー:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });