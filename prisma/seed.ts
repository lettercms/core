import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt'

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
	// create two dummy articles
	const account = await prisma.user.upsert({
		where: {
			email: 'davidsdevel@gmail.com',
		},
		update: {},
		create: {
			email: 'davidsdevel@gmail.com',
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

	await prisma.user.upsert({
		where: {
			email: 'lettercms@gmail.com',
		},
		update: {},
		create: {
			email: 'lettercms@gmail.com',
			name: 'Juan',
			lastname: 'Smith',
			password: await bcrypt.hash('1234', 10),
			profilePicture: 'https://avatar.tobi.sh/Juan+Smith.svg',
			externalBlogs: {
				create: [
					{
						blog: {
							connect: {
								id: blog.id,
							},
						}
					}
				]
			}
		},
	});

	await prisma.post.create({
		data: {
			userId: account.id,
			blogId: blog.id,
			views: 1,
			title: 'Demo Post',
			content: '<h1>This is a demo post</h1>',
			status: 'PUBLISHED',
			slug: 'demo-post',
			tags: ['example'],
		},
	});

	await prisma.invitation.create({
		data: {
			email: 'djgm1206@gmail.com',
			blogId: blog.id,
			senderId: account.id,
			expiresIn: new Date(Date.now() + (1000 * 60 * 60 * 24 * 365)),
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
