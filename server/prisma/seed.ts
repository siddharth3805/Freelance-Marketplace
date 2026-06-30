import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  const hashedPassword = await bcrypt.hash('password123', 10)

  const client = await prisma.user.upsert({
    where: { email: 'client@example.com' },
    update: {},
    create: {
      email: 'client@example.com',
      password: hashedPassword,
      role: Role.CLIENT,
      isVerified: true,
      profile: {
        create: {
          firstName: 'John',
          lastName: 'Doe',
          bio: 'I am a client looking for talented freelancers.',
          location: 'New York, USA',
        },
      },
    },
  })

  const freelancer = await prisma.user.upsert({
    where: { email: 'freelancer@example.com' },
    update: {},
    create: {
      email: 'freelancer@example.com',
      password: hashedPassword,
      role: Role.FREELANCER,
      isVerified: true,
      profile: {
        create: {
          firstName: 'Jane',
          lastName: 'Smith',
          bio: 'Full stack developer with 5 years of experience.',
          location: 'Pune, India',
          hourlyRate: 25,
        },
      },
    },
  })

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      role: Role.ADMIN,
      isVerified: true,
      profile: {
        create: {
          firstName: 'Admin',
          lastName: 'User',
          bio: 'Platform administrator.',
          location: 'San Francisco, USA',
        },
      },
    },
  })

  const reactSkill = await prisma.skill.upsert({
    where: { name: 'React' },
    update: {},
    create: { name: 'React' },
  })

  const nodeSkill = await prisma.skill.upsert({
    where: { name: 'Node.js' },
    update: {},
    create: { name: 'Node.js' },
  })

  const postgresSkill = await prisma.skill.upsert({
    where: { name: 'PostgreSQL' },
    update: {},
    create: { name: 'PostgreSQL' },
  })

  const project = await prisma.project.create({
    data: {
      clientId: client.id,
      title: 'Build a React Dashboard',
      description: 'I need a freelancer to build a modern React dashboard with charts and data tables.',
      budget: 1200,
      deadline: new Date('2026-08-30'),
      skills: {
        create: [
          { skillId: reactSkill.id },
          { skillId: nodeSkill.id },
        ],
      },
    },
  })

  await prisma.bid.create({
    data: {
      projectId: project.id,
      freelancerId: freelancer.id,
      amount: 1100,
      deliveryDays: 14,
      coverLetter: 'I have built many React dashboards and can deliver high quality work.',
    },
  })

  console.log('Seeding complete.')
  console.log({ client: client.email, freelancer: freelancer.email, admin: admin.email })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
