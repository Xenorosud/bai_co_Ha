const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function resetAdminPassword() {
  const prisma = new PrismaClient();
  try {
    const newPassword = '123456';
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    console.log('Creating new password hash for admin...');
    console.log('New hash:', hashedPassword);

    const result = await prisma.user.update({
      where: { email: 'admin@restora.com' },
      data: { passwordHash: hashedPassword }
    });

    console.log('✅ Updated admin password successfully');

    // Verify the new password works
    const updatedAdmin = await prisma.user.findUnique({
      where: { email: 'admin@restora.com' }
    });

    const isValid = await bcrypt.compare(newPassword, updatedAdmin.passwordHash);
    console.log('✅ Password verification test:', isValid);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

resetAdminPassword();