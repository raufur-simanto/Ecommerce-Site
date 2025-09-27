const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testAdminLogin() {
  try {
    // Get the admin user
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@store.com' }
    });

    if (!admin) {
      console.log('❌ Admin user not found');
      return;
    }

    console.log('📍 Admin user found:', admin.email);

    // Test password verification
    const testPassword = 'admin123';
    const isValid = await bcrypt.compare(testPassword, admin.password);

    if (isValid) {
      console.log('✅ Admin password verification successful!');
      console.log('🔑 You can now log in with:');
      console.log('   Email: admin@store.com');
      console.log('   Password: admin123');
    } else {
      console.log('❌ Admin password verification failed');
    }

  } catch (error) {
    console.error('❌ Error testing admin login:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testAdminLogin();
