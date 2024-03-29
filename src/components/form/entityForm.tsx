'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import React from 'react';
import { Button } from '@/components/ui/button';
import { ActionResponse } from '@/lib/types/actionResponse';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { sonnerContent } from '@/components/ui/sonner';
import { entityFormSchema } from '@/lib/form-schemas/entityFormSchema';
import { Category, Entity, EntityType } from '@prisma/client';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AutoCompleteInput } from '@/components/ui/auto-complete-input';

export default function EntityForm({value, categories, onSubmit, className}: {
    value: Entity | undefined,
    categories: Category[],
    onSubmit: (data: z.infer<typeof entityFormSchema>) => Promise<ActionResponse>
    className?: string
}) {

    const router = useRouter();

    const form = useForm<z.infer<typeof entityFormSchema>>({
        resolver: zodResolver(entityFormSchema),
        defaultValues: {
            id: value?.id ?? undefined,
            name: value?.name ?? '',
            type: value?.type ?? EntityType.Entity,
            defaultCategoryId: value?.defaultCategoryId ?? undefined,
        },
    });

    const handleSubmit = async (data: z.infer<typeof entityFormSchema>) => {
        const response = await onSubmit(data);
        toast(sonnerContent(response));
        if (response.redirect) {
            router.push(response.redirect);
        }
    };

    const categoriesMapped = categories?.map((category) => {
        return {
            label: category.name,
            value: category.id,
        };
    }) ?? [];

    return (
        <Form {...form}>
            <form autoComplete="off" onSubmit={form.handleSubmit(handleSubmit)}>

                <FormField
                    control={form.control}
                    name="id"
                    render={({field}) => (
                        <FormItem>
                            <FormControl>
                                <Input autoComplete="false" type="hidden" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <div className={className}>
                    <FormField
                        control={form.control}
                        name="name"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Name" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="type"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a type"/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value={EntityType.Entity}>Entity</SelectItem>
                                            <SelectItem value={EntityType.Account}>Account</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="defaultCategoryId"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <FormControl>
                                    <AutoCompleteInput
                                        placeholder="Select category"
                                        items={categoriesMapped}
                                        {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>
                <Button type="submit" className="w-full">{value?.id ? 'Update Entity' : 'Create Entity'}</Button>
            </form>
        </Form>
    );
}
