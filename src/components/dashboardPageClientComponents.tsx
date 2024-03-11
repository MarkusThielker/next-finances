'use client';

import { useRouter } from 'next/navigation';
import { Category, Entity } from '@prisma/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function DashboardPageClientContent(
    {
        scope,
        scopes,
        income,
        expenses,
        balanceDevelopment,
        categoryExpenses,
        categoryPercentages,
        entityExpenses,
        entityPercentages,
    }: {
        scope: string,
        scopes: string[],
        income: string,
        expenses: string,
        balanceDevelopment: string,
        categoryExpenses: {
            category: Category,
            value: string,
        }[],
        categoryPercentages: {
            category: Category,
            value: string,
        }[],
        entityExpenses: {
            entity: Entity,
            value: string,
        }[],
        entityPercentages: {
            entity: Entity,
            value: string,
        }[],

    },
) {

    const router = useRouter();

    return (
        <div className="flex flex-col space-y-4 p-8">

            <div className="flex flex-row items-center justify-between">

                <h1 className="text-2xl font-semibold leading-6 text-gray-900 dark:text-white">Dashboard</h1>

                <Select
                    onValueChange={(value) => {
                        router.push(`?scope=${value}`);
                        router.refresh();
                    }}
                    value={scope}
                >
                    <SelectTrigger className="w-[250px]">
                        <SelectValue placeholder="Select a scope"/>
                    </SelectTrigger>
                    <SelectContent>
                        {
                            scopes.map((scope) => (
                                <SelectItem value={scope} key={scope}>{scope}</SelectItem>
                            ))
                        }
                    </SelectContent>
                </Select>

            </div>

            <Card>
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x overflow-hidden">

                    <div>
                        <CardHeader>
                            <CardTitle>Income</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-baseline text-2xl font-semibold text-orange-600">
                                {income}
                            </div>
                        </CardContent>
                    </div>

                    <div>
                        <CardHeader>
                            <CardTitle>Expanses</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-baseline text-2xl font-semibold text-orange-600">
                                {expenses}
                            </div>
                        </CardContent>
                    </div>

                    <div>
                        <CardHeader>
                            <CardTitle>Development</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-baseline text-2xl font-semibold text-orange-600">
                                {balanceDevelopment}
                            </div>
                        </CardContent>
                    </div>

                </div>
            </Card>

            <Card>
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x overflow-hidden">

                    <div>
                        <CardHeader>
                            <CardTitle>Expenses</CardTitle>
                            <CardDescription>by category (%)</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {
                                categoryPercentages.map(item => (
                                    <div className="flex items-center justify-between mt-4" key={item.category.id}>
                                        <div className="flex items-center">
                                            <div className="w-2 h-2 rounded-full mr-2"
                                                 style={{backgroundColor: item.category.color}}/>
                                            <span
                                                className="text-sm text-gray-900 dark:text-white">{item.category.name}</span>
                                        </div>
                                        <span className="text-sm text-gray-900 dark:text-white">{item.value}%</span>
                                    </div>
                                ))
                            }
                        </CardContent>
                    </div>

                    <div>
                        <CardHeader>
                            <CardTitle>Expenses</CardTitle>
                            <CardDescription>by category (€)</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {
                                categoryExpenses.map((item) => (
                                    <div className="flex items-center justify-between mt-4" key={item.category.id}>
                                        <div className="flex items-center">
                                            <div className="w-2 h-2 rounded-full mr-2"
                                                 style={{backgroundColor: item.category.color}}/>
                                            <span
                                                className="text-sm text-gray-900 dark:text-white">{item.category.name}</span>
                                        </div>
                                        <span className="text-sm text-gray-900 dark:text-white">{item.value}</span>
                                    </div>
                                ))
                            }
                        </CardContent>
                    </div>

                </div>
            </Card>

            <Card>
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x overflow-hidden">

                    <div>
                        <CardHeader>
                            <CardTitle>Expenses</CardTitle>
                            <CardDescription>by entity (%)</CardDescription>
                        </CardHeader>
                        <CardContent>

                            {
                                entityPercentages.map(item => (
                                    <div className="flex items-center justify-between mt-4" key={item.entity.id}>
                                        <div className="flex items-center">
                                            <span
                                                className="text-sm text-gray-900 dark:text-white">{item.entity.name}</span>
                                        </div>
                                        <span className="text-sm text-gray-900 dark:text-white">{item.value}%</span>
                                    </div>
                                ))
                            }
                        </CardContent>
                    </div>

                    <div>
                        <CardHeader>
                            <CardTitle>Expenses</CardTitle>
                            <CardDescription>by entity (€)</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {
                                entityExpenses.map(item => (
                                    <div className="flex items-center justify-between mt-4" key={item.entity.id}>
                                        <div className="flex items-center">
                                            <span
                                                className="text-sm text-gray-900 dark:text-white">{item.entity.name}</span>
                                        </div>
                                        <span className="text-sm text-gray-900 dark:text-white">{item.value}</span>
                                    </div>
                                ))
                            }
                        </CardContent>
                    </div>
                </div>
            </Card>
        </div>
    );
}