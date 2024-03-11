'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import React, { useState } from 'react';
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
import { CalendarIcon, Check, ChevronsUpDown } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';

export default function PaymentForm({value, entities, categories, onSubmit, className}: {
    value: Payment | undefined,
    entities: Entity[],
    categories: Category[],
    onSubmit: (data: z.infer<typeof paymentFormSchema>) => Promise<ActionResponse>
    className?: string
}) {

    const router = useRouter();

    const [filter, setFilter] = useState<string>('');

    const [payorOpen, setPayorOpen] = useState(false);
    const [payeeOpen, setPayeeOpen] = useState(false);
    const [categoryOpen, setCategoryOpen] = useState(false);

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
                                <Popover open={payorOpen} onOpenChange={(open) => {
                                    setPayorOpen(open);
                                    setFilter('');
                                }}>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                    'w-full justify-between',
                                                    !field.value && 'text-muted-foreground',
                                                )}
                                            >
                                                {field.value
                                                    ? entitiesMapped.find(
                                                        (item) => item.value === field.value,
                                                    )?.label
                                                    : 'Select entity'}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[225px] p-0">
                                        <input
                                            value={filter}
                                            onChange={(e) => setFilter(e.target.value)}
                                            className="flex h-10 w-full rounded-md border-b border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                            placeholder="Search..."/>
                                        <ScrollArea className="h-64">
                                            {entitiesMapped
                                                .filter((entity) => entity.label.toLowerCase().includes(filter.toLowerCase()))
                                                .map((item) => (
                                                    <div
                                                        className="relative flex cursor-pointer hover:bg-white/10 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                                        key={item.value}
                                                        onClick={() => {
                                                            field.onChange(item.value);
                                                            setPayorOpen(false);
                                                        }}>
                                                        <Check
                                                            className={cn(
                                                                'mr-2 h-4 w-4',
                                                                item.value === field.value
                                                                    ? 'opacity-100'
                                                                    : 'opacity-0',
                                                            )}
                                                        />
                                                        {item.label}
                                                    </div>
                                                ))}
                                            <ScrollBar orientation="vertical"/>
                                        </ScrollArea>
                                    </PopoverContent>
                                </Popover>
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
                                <Popover open={payeeOpen} onOpenChange={(open) => {
                                    setPayeeOpen(open);
                                    setFilter('');
                                }}>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                    'w-full justify-between',
                                                    !field.value && 'text-muted-foreground',
                                                )}
                                            >
                                                {field.value
                                                    ? entitiesMapped.find(
                                                        (item) => item.value === field.value,
                                                    )?.label
                                                    : 'Select entity'}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[225px] p-0">
                                        <input
                                            value={filter}
                                            onChange={(e) => setFilter(e.target.value)}
                                            className="flex h-10 w-full rounded-md border-b border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                            placeholder="Search..."/>
                                        <ScrollArea className="h-40">
                                            {entitiesMapped
                                                .filter((entity) => entity.label.toLowerCase().includes(filter.toLowerCase()))
                                                .map((item) => (
                                                    <div
                                                        className="relative flex cursor-pointer hover:bg-white/10 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                                        key={item.value}
                                                        onClick={() => {
                                                            field.onChange(item.value);
                                                            setPayeeOpen(false);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                'mr-2 h-4 w-4',
                                                                item.value === field.value
                                                                    ? 'opacity-100'
                                                                    : 'opacity-0',
                                                            )}
                                                        />
                                                        {item.label}
                                                    </div>
                                                ))}
                                            <ScrollBar orientation="vertical"/>
                                        </ScrollArea>
                                    </PopoverContent>
                                </Popover>
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
                                <Popover open={categoryOpen} onOpenChange={(open) => {
                                    setCategoryOpen(open);
                                    setFilter('');
                                }}>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                    'w-full justify-between',
                                                    !field.value && 'text-muted-foreground',
                                                )}
                                            >
                                                {field.value
                                                    ? categoriesMapped.find(
                                                        (item) => item.value === field.value,
                                                    )?.label
                                                    : 'Select entity'}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[225px] p-0">
                                        <input
                                            value={filter}
                                            onChange={(e) => setFilter(e.target.value)}
                                            className="flex h-10 w-full rounded-md border-b border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                            placeholder="Search..."/>
                                        <ScrollArea className="h-40">
                                            {categoriesMapped
                                                .filter((entity) => entity.label.toLowerCase().includes(filter.toLowerCase()))
                                                .map((item) => (
                                                    <div
                                                        className="relative flex cursor-pointer hover:bg-white/10 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                                        key={item.value}
                                                        onClick={() => {
                                                            field.onChange(item.value);
                                                            setCategoryOpen(false);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                'mr-2 h-4 w-4',
                                                                item.value === field.value
                                                                    ? 'opacity-100'
                                                                    : 'opacity-0',
                                                            )}
                                                        />
                                                        {item.label}
                                                    </div>
                                                ))}
                                            <ScrollBar orientation="vertical"/>
                                        </ScrollArea>
                                    </PopoverContent>
                                </Popover>
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

                <Button type="submit" className="w-full">{value?.id ? 'Update Payment' : 'Create Payment'}</Button>
            </form>
        </Form>
    );
}
