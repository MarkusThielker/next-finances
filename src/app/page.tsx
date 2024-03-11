import React from 'react';
import { Category, Entity, EntityType } from '@prisma/client';
import { Scope, ScopeType } from '@/lib/types/scope';
import { prismaClient } from '@/prisma';
import { getUser } from '@/auth';
import DashboardPageClient from '@/components/dashboardPageClientComponents';

export type CategoryNumber = {
    category: Category,
    value: number,
}

export type EntityNumber = {
    entity: Entity,
    value: number,
}

export default async function DashboardPage(props: { searchParams?: { scope: ScopeType } }) {

    const user = await getUser();
    if (!user) {
        return;
    }

    const scope = Scope.of(props.searchParams?.scope || ScopeType.ThisMonth);

    // get all payments in the current scope
    const payments = await prismaClient.payment.findMany({
        where: {
            userId: user?.id,
            date: {
                gte: scope.start,
                lte: scope.end,
            },
        },
        include: {
            payor: true,
            payee: true,
            category: true,
        },
    });

    let income = 0;
    let expenses = 0;

    // sum up income
    payments.filter(payment =>
        payment.payor.type === EntityType.Entity &&
        payment.payee.type === EntityType.Account,
    ).forEach(payment => income += payment.amount);

    // sum up expenses
    payments.filter(payment =>
        payment.payor.type === EntityType.Account &&
        payment.payee.type === EntityType.Entity,
    ).forEach(payment => expenses += payment.amount);

    // ############################
    // Expenses by category
    // ############################

    // init helper variables (category)
    const categoryExpenses: CategoryNumber[] = [];
    const otherCategory: CategoryNumber = {
        category: {
            id: 0,
            userId: '',
            name: 'Other',
            color: '#888888',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        value: 0,
    };

    // sum up expenses per category
    payments.filter(payment =>
        payment.payor.type === EntityType.Account &&
        payment.payee.type === EntityType.Entity,
    ).forEach(payment => {

        if (!payment.category) {
            otherCategory.value += payment.amount;
            return;
        }

        const categoryNumber = categoryExpenses.find(categoryNumber => categoryNumber.category.id === payment.category?.id);
        if (categoryNumber) {
            categoryNumber.value += payment.amount;
        } else {
            categoryExpenses.push({category: payment.category, value: payment.amount});
        }
    });
    categoryExpenses.sort((a, b) => Number(b.value - a.value));
    if (otherCategory.value > 0) {
        categoryExpenses.push(otherCategory);
    }

    // ############################
    // Expenses by entity
    // ############################

    // init helper variables (entity)
    const entityExpenses: EntityNumber[] = [];
    const otherEntity: EntityNumber = {
        entity: {
            id: 0,
            userId: '',
            name: 'Other',
            type: EntityType.Entity,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        value: 0,
    };

    // sum up expenses per category
    payments.filter(payment =>
        payment.payor.type === EntityType.Account &&
        payment.payee.type === EntityType.Entity,
    ).forEach(payment => {

        // if (!payment.payee) {
        //     other.value += payment.amount
        //     return
        // }

        const entityNumber = entityExpenses.find(entityNumber => entityNumber.entity.id === payment.payee?.id);
        if (entityNumber) {
            entityNumber.value += payment.amount;
        } else {
            entityExpenses.push({entity: payment.payee, value: payment.amount});
        }
    });
    entityExpenses.sort((a, b) => Number(b.value - a.value));
    if (otherEntity.value > 0) {
        entityExpenses.push(otherEntity);
    }

    // ############################
    // Format data
    // ############################

    const balanceDevelopment = income - expenses;
    const scopes = Object.values(ScopeType).map(scopeType => scopeType.toString());

    const incomeFormat = new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
    }).format(Number(income) / 100);

    const expensesFormat = new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
    }).format(Number(expenses) / 100);

    const balanceDevelopmentFormat = new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
    }).format(Number(balanceDevelopment) / 100);

    const categoryExpensesFormat = categoryExpenses.map(categoryNumber => ({
        category: categoryNumber.category,
        value: new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR',
        }).format(Number(categoryNumber.value) / 100),
    }));

    const categoryPercentages = categoryExpenses.map(categoryNumber => ({
        category: categoryNumber.category,
        value: amountToPercent(categoryNumber.value, expenses),
    }));

    const entityExpensesFormat = entityExpenses.map(entityNumber => ({
        entity: entityNumber.entity,
        value: new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR',
        }).format(Number(entityNumber.value) / 100),
    }));

    const entityPercentages = entityExpenses.map(entityNumber => ({
        entity: entityNumber.entity,
        value: amountToPercent(entityNumber.value, expenses),
    }));

    function amountToPercent(amount: number, total: number): string {
        return (Number(amount) / Number(total) * 100).toFixed(2);
    }

    return (
        <DashboardPageClient
            scope={scope.type}
            scopes={scopes}
            income={incomeFormat}
            expenses={expensesFormat}
            balanceDevelopment={balanceDevelopmentFormat}
            categoryExpenses={categoryExpensesFormat}
            categoryPercentages={categoryPercentages}
            entityExpenses={entityExpensesFormat}
            entityPercentages={entityPercentages}
        />
    );
}
