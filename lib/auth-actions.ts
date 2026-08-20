'use server';

import { prisma } from './prisma';
import bcrypt from 'bcryptjs';
import { setSession } from './auth';
import { redirect } from 'next/navigation';

export async function loginUser(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Please provide both email and password.' };
  }

  // Admin seed logic
  if (email === 'admin@panelservice.com') {
    const existingAdmin = await prisma.userProfile.findUnique({ where: { email } });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('12341234', 10);
      await prisma.userProfile.create({
        data: {
          email: 'admin@panelservice.com',
          fullName: 'System Admin',
          role: 'Admin',
          password: hashedPassword
        }
      });
    }
  }

  const user = await prisma.userProfile.findUnique({ where: { email } });
  
  if (!user || !user.password) {
    return { error: 'Invalid email or password.' };
  }

  const passwordsMatch = await bcrypt.compare(password, user.password);
  
  if (!passwordsMatch) {
    return { error: 'Invalid email or password.' };
  }

  await setSession({ id: user.id, email: user.email, role: user.role, fullName: user.fullName });
  
  return { success: true };
}

export async function logoutUser() {
  const { clearSession } = await import('./auth');
  await clearSession();
  return { success: true };
}
