'use client';

import { Button } from '@/components/ui/button';
import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { sonnerContent } from '@/components/ui/sonner';
import { ActionResponse } from '@/lib/types/actionResponse';

export default function GenerateSampleDataForm({onSubmit}: { onSubmit: () => Promise<ActionResponse> }) {

    const router = useRouter();

    const handleSubmit = async () => {
        const response = await onSubmit();
        toast(sonnerContent(response));
        router.refresh();
    };

    return (
        <Button className="w-full" variant="outline" onClick={handleSubmit}>Generate sample data</Button>
    );
}
