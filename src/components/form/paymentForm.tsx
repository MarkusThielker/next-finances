'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ActionResponse } from '@/lib/types/actionResponse';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { sonnerContent } from '@/components/ui/sonner';
import { Category, Entity, Payment } from '@prisma/client';
import { paymentFormSchema } from '@/lib/form-schemas/paymentFormSchema';
import CurrencyInput from '@/components/ui/currency-input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { AutoCompleteInput } from '@/components/ui/auto-complete-input';

export default function PaymentForm({value, entities, categories, onSubmit, className}: {
    value: Payment | undefined,
    entities: Entity[],
    categories: Category[],
    onSubmit: (data: z.infer<typeof paymentFormSchema>) => Promise<ActionResponse>
    className?: string
}) {

    const router = useRouter();

    const form = useForm<z.infer<typeof paymentFormSchema>>({
        resolver: zodResolver(paymentFormSchema),
        defaultValues: {
            id: value?.id ?? undefined,
            amount: value?.amount ?? 0,
            date: value?.date ?? new Date(),
            payorId: value?.payorId ?? undefined,
            payeeId: value?.payeeId ?? undefined,
            categoryId: value?.categoryId ?? undefined,
            note: value?.note ?? '',
        },
    });

    const handleSubmit = async (data: z.infer<typeof paymentFormSchema>) => {
        const response = await onSubmit(data);
        toast(sonnerContent(response));
        if (response.redirect) {
            router.push(response.redirect);
        }
    };

    const entitiesMapped = entities?.map((entity) => {
        return {
            label: entity.name,
            value: entity.id,
        };
    }) ?? [];

    const categoriesMapped = categories?.map((category) => {
        return {
            label: category.name,
            value: category.id,
        };
    }) ?? [];

    const payeeRef = useRef<HTMLInputElement>({} as HTMLInputElement);
    const categoryRef = useRef<HTMLInputElement>({} as HTMLInputElement);
    const submitRef = useRef<HTMLButtonElement>({} as HTMLButtonElement);

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

                    <CurrencyInput
                        form={form}
                        name="amount"
                        label="Amount"
                        placeholder="Enter amount"/>

                    <FormField
                        control={form.control}
                        name="date"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={'outline'}
                                                className={cn(
                                                    'w-full pl-3 text-left font-normal',
                                                    !field.value && 'text-muted-foreground',
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, 'PPP')
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={(e) => {
                                                field.onChange(e);
                                            }}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="payorId"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Payor</FormLabel>
                                <FormControl>
                                    <AutoCompleteInput
                                        placeholder="Select payor"
                                        items={entitiesMapped}
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            if (e && e.target.value) {
                                                payeeRef && payeeRef.current.focus();
                                            }
                                        }}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="payeeId"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Payee</FormLabel>
                                <FormControl ref={payeeRef}>
                                    <AutoCompleteInput
                                        placeholder="Select payee"
                                        items={entitiesMapped}
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            if (e && e.target.value) {
                                                const entity = entities.find((entity) => entity.id === Number(e.target.value));

                                                // only focus category input if payee has no default category
                                                if (entity?.defaultCategoryId !== null) {
                                                    form.setValue('categoryId', entity?.defaultCategoryId);
                                                    submitRef && submitRef.current.focus();
                                                } else {
                                                    categoryRef && categoryRef.current.focus();
                                                }
                                            }
                                        }}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="categoryId"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <FormControl ref={categoryRef}>
                                    <AutoCompleteInput
                                        placeholder="Select category"
                                        items={categoriesMapped}
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            if (e && e.target.value) {
                                                submitRef && submitRef.current.focus();
                                            }
                                        }}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="note"
                    render={({field}) => (
                        <FormItem className="mb-4">
                            <FormLabel>Note</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Note" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <Button type="submit" ref={submitRef}
                        className="w-full">{value?.id ? 'Update Payment' : 'Create Payment'}</Button>
            </form>
        </Form>
    );
}
