import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt'

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
	// create two dummy articles
	const account = await prisma.user.upsert({
		where: {
			email: 'lettercms@gmail.com',
		},
		update: {},
		create: {
			email: 'lettercms@gmail.com',
			name: 'David',
			password: await bcrypt.hash('1234', 10),
			lastname: 'Gonzalez',
			profilePicture: 'https://avatar.tobi.sh/David+Gonzalez.svg',
		},
	});
	
	const blog = await prisma.blog.upsert({
		where: {
			subdomain: 'davidsdevel',
		},
		update: {},
		create: {
			subdomain: 'davidsdevel',
			thumbnail:
				'https://cdn.jsdelivr.net/gh/lettercms/lettercms/apps/cdn/images/og-template.png',
			title: "David's Devel - Blog",
			userId: account.id,
			visits: 1,
			users: 2
		},
	});

	await prisma.view.create({
		data: {
			browser: 'Chrome',
			country: 'VE',
			device: 'desktop',
			platform: 'Windows',
			source: 'direct',
			slug: 'demo-post',
			blogId: blog.id,
		}
	})

	console.log('Done...');
}

// execute the main function
main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		// close Prisma Client at the end
		await prisma.$disconnect();
	});
