import prisma from '@/prisma';
import type { Category, Entity } from '@prisma/client';
import { EntityType } from '@prisma/client';
import { getUser } from '@/auth';
import { URL_SIGN_IN } from '@/lib/constants';
import { ActionResponse } from '@/lib/types/actionResponse';

export default async function generateSampleData(): Promise<ActionResponse> {
    'use server';

    const user = await getUser();

    if (!user) {
        return {
            type: 'error',
            message: 'You must be logged in to create/update an category.',
            redirect: URL_SIGN_IN,
        };
    }

    // Categories: create sample data
    const categories: Category[] = await prisma.category.findMany({where: {userId: user.id}});
    if (await prisma.category.count({where: {userId: user.id}}) == 0) {

        console.log('Creating sample categories...');

        categories.push(await prisma.category.create({
            data: {
                userId: user.id,
                name: 'Groceries',
                color: '#FFBEAC',
            },
        }));

        categories.push(await prisma.category.create({
            data: {
                userId: user.id,
                name: 'Drugstore items',
                color: '#9CBCFF',
            },
        }));

        categories.push(await prisma.category.create({
            data: {
                userId: user.id,
                name: 'Going out',
                color: '#F1ADFF',
            },
        }));

        categories.push(await prisma.category.create({
            data: {
                userId: user.id,
                name: 'Random stuff',
                color: '#C1FFA9',
            },
        }));

        categories.push(await prisma.category.create({
            data: {
                userId: user.id,
                name: 'Salary',
                color: '#FFF787',
            },
        }));

        console.log('Sample categories created.');
    }
    console.log(categories);

    // Entities: create sample data
    const entities: Entity[] = await prisma.entity.findMany({where: {userId: user.id}});
    if (await prisma.entity.count({where: {userId: user.id}}) == 0) {

        console.log('Creating sample entities...');

        entities.push(await prisma.entity.create({
            data: {
                userId: user.id,
                name: 'Main Account',
                type: EntityType.Account,
            },
        }));

        entities.push(await prisma.entity.create({
            data: {
                userId: user.id,
                name: 'Company',
                type: EntityType.Entity,
            },
        }));

        entities.push(await prisma.entity.create({
            data: {
                userId: user.id,
                name: 'Supermarket 1',
                type: EntityType.Entity,
            },
        }));

        entities.push(await prisma.entity.create({
            data: {
                userId: user.id,
                name: 'Supermarket 2',
                type: EntityType.Entity,
            },
        }));

        entities.push(await prisma.entity.create({
            data: {
                userId: user.id,
                name: 'Supermarket 3',
                type: EntityType.Entity,
            },
        }));

        entities.push(await prisma.entity.create({
            data: {
                userId: user.id,
                name: 'Supermarket 4',
                type: EntityType.Entity,
            },
        }));

        console.log('Sample entities created.');
    }
    console.log(entities);

    // Payments: create sample data
    console.log('Creating sample payments...');

    if (await prisma.payment.count({where: {userId: user.id}}) == 0) {
        for (let i = 0; i < 4; i++) {

            const date = new Date();
            date.setDate(1);
            date.setMonth(date.getMonth() - i);

            await prisma.payment.create({
                data: {
                    userId: user.id,
                    amount: 200000,
                    date: date,
                    payorId: entities[1].id,
                    payeeId: entities[0].id,
                    categoryId: 5,
                    createdAt: date,
                    updatedAt: date,
                },
            });
        }
    }

    let minAmount = 200; // 2€
    let maxAmount = 3000; // 30€
    let minPayee = entities[2].id;
    let maxPayee = entities[entities.length - 1].id;
    let minCategory = categories[0].id;
    let maxCategory = categories[categories.length - 1].id;
    let payments = 196;

    for (let i = 0; i < payments; i++) {

        const date = new Date(
            new Date().getTime() - Math.floor(Math.random() * 10000000000));

        await prisma.payment.create({
            data: {
                userId: user.id,
                amount: Math.floor(
                    Math.random() * (maxAmount - minAmount) + minAmount),
                date: date,
                payorId: entities[0].id,
                payeeId: Math.floor(
                    Math.random() * (maxPayee - minPayee) + minPayee),
                categoryId: Math.floor(
                    Math.random() * (maxCategory - minCategory) + minCategory),
                createdAt: date,
                updatedAt: date,
            },
        });
    }

    console.log('Sample payments created.');

    return {
        type: 'success',
        message: 'Sample data created',
    };
}
