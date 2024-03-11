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
import { Category } from '@prisma/client';
import { categoryFormSchema } from '@/lib/form-schemas/categoryFormSchema';

export default function CategoryForm({value, onSubmit, className}: {
    value: Category | undefined,
    onSubmit: (data: z.infer<typeof categoryFormSchema>) => Promise<ActionResponse>
    className?: string
}) {

    const router = useRouter();
    const colorInput = React.createRef<HTMLInputElement>();

    const form = useForm<z.infer<typeof categoryFormSchema>>({
        resolver: zodResolver(categoryFormSchema),
        defaultValues: {
            id: value?.id ?? undefined,
            name: value?.name ?? '',
            color: value?.color ?? '#' + Math.floor(Math.random() * 16777215).toString(16),
        },
    });

    const handleSubmit = async (data: z.infer<typeof categoryFormSchema>) => {
        const response = await onSubmit(data);
        toast(sonnerContent(response));
        if (response.redirect) {
            router.push(response.redirect);
        }
    };

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
                        name="color"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Color</FormLabel>
                                <div onClick={() => colorInput.current?.click()}
                                     className="rounded-md aspect-square w-10 cursor-pointer border border-black items-bottom"
                                     style={{backgroundColor: field.value}}>

                                    <input id="color"
                                           name="color"
                                           type="color"
                                           className="opacity-0 w-10 h-8"
                                           value={field.value}
                                           onChange={field.onChange}
                                           ref={colorInput}
                                           required/>
                                </div>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="name"
                        render={({field}) => (
                            <FormItem className="w-full">
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Name" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>
                <Button type="submit" className="w-full">{value?.id ? 'Update Category' : 'Create Category'}</Button>
            </form>
        </Form>
    );
}
