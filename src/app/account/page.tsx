import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';
import { getUser } from '@/auth';
import { redirect } from 'next/navigation';
import signOut from '@/lib/actions/signOut';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import SignOutForm from '@/components/form/signOutForm';
import { URL_SIGN_IN } from '@/lib/constants';
import GenerateSampleDataForm from '@/components/form/generateSampleDataForm';
import generateSampleData from '@/lib/actions/generateSampleData';

export default async function AccountPage() {

    const user = await getUser();

    if (!user) {
        redirect(URL_SIGN_IN);
    }

    return (
        <div className="flex flex-col items-center">
            <Card className="w-full max-w-md mt-12">
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
                </CardContent>
                <CardFooter className="space-x-4">
                    {
                        process.env.NODE_ENV === 'development' && (
                            <GenerateSampleDataForm onSubmit={generateSampleData}/>
                        )
                    }
                    <SignOutForm onSubmit={signOut}/>
                </CardFooter>
            </Card>
        </div>
    );
}
