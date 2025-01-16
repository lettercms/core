import { PrismaClient } from '@prisma/client';

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
			password: '1234',
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
			title: "David's Devel",
			userId: account.id,
		},
	});

	const post = await prisma.post.create({
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

	const view = await prisma.view.create({
		data: {
			browser: 'Chrome',
			country: 'Venezuela',
			device: 'Desktop',
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
