import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

async function test() {
  console.log('--- Database Login Simulation Test ---');
  const email = `test-${Date.now()}@example.com`;
  const password = 'Password123!';
  const fullName = 'Test User';

  try {
    // 1. Create user
    console.log('Simulating register: creating user...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        profile: {
          create: {
            fullName,
            dateOfBirth: new Date(),
            gender: 'Not Specified',
            category: 'General',
            phone: '',
            address: '',
            highSchoolMarks: 0,
            higherSecondaryMarks: 0,
            board: ''
          }
        }
      },
      include: {
        profile: true
      }
    });
    console.log('✓ User created successfully with ID:', newUser.id);

    // 2. Simulate login queries
    console.log('Simulating login: querying user...');
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true }
    });

    if (!user) {
      throw new Error('User not found in database');
    }
    console.log('✓ User queried successfully.');

    console.log('Simulating bcrypt password matching...');
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('✓ Password match result:', isMatch);

    console.log('Simulating JWT generation...');
    const accessToken = jwt.sign({ userId: user.id }, 'secret', { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId: user.id }, 'refresh_secret', { expiresIn: '7d' });
    console.log('✓ JWT tokens generated successfully.');
    console.log('--- Test Completed Successfully! ---');
  } catch (error) {
    console.error('✗ Error during simulation:', error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
