import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';
import { getUser } from '@/auth';
import { redirect } from 'next/navigation';
import signOut from '@/lib/actions/signOut';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { URL_SIGN_IN } from '@/lib/constants';
import generateSampleData from '@/lib/actions/generateSampleData';
import { prismaClient } from '@/prisma';
import { ServerActionTrigger } from '@/components/form/serverActionTrigger';

export default async function AccountPage() {

    const user = await getUser();

    if (!user) {
        redirect(URL_SIGN_IN);
    }

    let paymentCount = 0;
    paymentCount = await prismaClient.payment.count({
        where: {
            userId: user.id,
        },
    });

    let entityCount = 0;
    entityCount = await prismaClient.entity.count({
        where: {
            userId: user.id,
        },
    });

    let categoryCount = 0;
    categoryCount = await prismaClient.category.count({
        where: {
            userId: user.id,
        },
    });

    return (
        <div className="flex flex-col items-center">
            <Card className="w-full max-w-md md:mt-12">
                <CardHeader>
                    <CardTitle>Hey, {user?.username}!</CardTitle>
                    <CardDescription>This is your account overview.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div>
                        <Label>ID</Label>
                        <Input
                            disabled
                            value={user?.id}/>
                    </div>
                    <div>
                        <Label>Username</Label>
                        <Input
                            disabled
                            value={user?.username}/>
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
                        className="col-span-2"
                        action={signOut}>
                        Sign Out
                    </ServerActionTrigger>
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
