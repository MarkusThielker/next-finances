import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import generateSampleData from '@/lib/actions/generateSampleData';
import prisma from '@/prisma';
import { ServerActionTrigger } from '@/components/form/serverActionTrigger';
import clearAccountData from '@/lib/actions/clearAccountData';
import { Button } from '@/components/ui/button';
import { URL_SIGN_OUT } from '@/lib/constants';
import { auth0 } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AccountPage() {

    const session = await auth0.getSession();
    if (!session) {
        return redirect('/auth/login');
    }
    const user = session.user;

    let paymentCount = 0;
    paymentCount = await prisma.payment.count({
        where: {
            userId: user.sub,
        },
    });

    let entityCount = 0;
    entityCount = await prisma.entity.count({
        where: {
            userId: user.sub,
        },
    });

    let categoryCount = 0;
    categoryCount = await prisma.category.count({
        where: {
            userId: user.sub,
        },
    });

    return (
        <div className="flex flex-col items-center">
            <Card className="w-full max-w-md md:mt-12">
                <CardHeader>
                    <CardTitle>Hey, {user.name}!</CardTitle>
                    <CardDescription>This is your account overview.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div>
                        <Label>ID</Label>
                        <Input
                            disabled
                            value={user.sub}/>
                    </div>
                    <div>
                        <Label>Username</Label>
                        <Input
                            disabled
                            value={user.name}/>
                    </div>
                    <div className="flex flex-row items-center space-x-4">
                        <div>
                            <Label>Payments</Label>
                            <Input
                                disabled
                                value={paymentCount}/>
                        </div>
                        <div>
                            <Label>Entities</Label>
                            <Input
                                disabled
                                value={entityCount}/>
                        </div>
                        <div>
                            <Label>Categories</Label>
                            <Input
                                disabled
                                value={categoryCount}/>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="w-full grid gap-4 grid-cols-1 md:grid-cols-2">
                    <ServerActionTrigger
                        action={clearAccountData}
                        dialog={{
                            title: 'Clear account data',
                            description: 'Are you sure you want to delete all payments, entities and categories from you account? This action is irreversible.',
                            actionText: 'Clear data',
                            actionVariant: 'destructive',
                        }}
                        variant="outline">
                        Clear data
                    </ServerActionTrigger>
                    <a href={URL_SIGN_OUT}>
                        <Button className="w-full">
                            Sign Out
                        </Button>
                    </a>
                    {
                        process.env.NODE_ENV === 'development' && (
                            <ServerActionTrigger
                                variant="outline"
                                className="col-span-2"
                                action={generateSampleData}>
                                Generate sample data
                            </ServerActionTrigger>
                        )
                    }
                </CardFooter>
            </Card>
            <div className="flex w-full items-center justify-between max-w-md mt-2 text-neutral-600">
                <p>Version {process.env.appVersion}</p>
                <div className="flex items-center justify-between space-x-4">
                    <a
                        target="_blank"
                        className="hover:text-neutral-500 duration-100"
                        href="https://github.com/MarkusThielker/next-finances">
                        Source Code
                    </a>
                    <a
                        target="_blank"
                        className="hover:text-neutral-500 duration-100"
                        href="https://github.com/MarkusThielker/next-finances/releases">
                        Changelog
                    </a>
                </div>
            </div>
        </div>
    );
}
