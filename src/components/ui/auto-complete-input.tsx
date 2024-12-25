'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface AutoCompleteInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    items: { label: string, value: any }[];
}

const AutoCompleteInput = React.forwardRef<HTMLInputElement, AutoCompleteInputProps>(
    ({className, type, ...props}, ref) => {

        const [value, setValue] = useState(getNameOfPropValue());
        const [open, setOpen] = useState(false);
        const [lastKey, setLastKey] = useState('');
        const [filteredItems, setFilteredItems] = useState(props.items);

        function getNameOfPropValue() {

            if (!props.items) {
                return '';
            }

            const item = props.items?.find(item => item.value === props.value);
            return item?.label || '';
        }

        function handleChange(e: React.ChangeEvent<HTMLInputElement>) {

            const value = e.target.value;

            setFilteredItems(props?.items?.filter((item) => {
                return item.label.toLowerCase().includes(value.toLowerCase());
            }));

            setValue(value);
            setOpen(value.length > 0);

            // on typing only the internal state is changed while the form state is
            // set to undefined. This way only the predefined items are actual values
            // for the form validation
            props.onChange?.(undefined as any);
        }

        // since typing changes the internal values and therefor the selected value, this effect
        // handles every filteredItems change to check if only one item is left
        useEffect(() => {
            // only one item is left and the last character was a letter or digit.
            // the last condition has to be checked to make it possible to use the backspace
            if (filteredItems.length === 1 && /^[a-zA-Z0-9]$/.test(lastKey)) {
                setValue(filteredItems[0].label);
                setOpen(false);
                props.onChange?.({target: {value: filteredItems[0].value}} as any);
            }
        }, [filteredItems]);

        useEffect(() => {
            if (props.value) {
                setValue(getNameOfPropValue());
            } else {
                setValue('');
            }
        }, [props.value]);

        return (
            <div className="relative">
                <input
                    type={type}
                    className={cn(
                        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                        className,
                    )}
                    ref={ref}
                    value={value}
                    placeholder={props.placeholder || 'Search...'}
                    onChange={handleChange}
                    onKeyDown={(e) => {
                        if (e.metaKey || e.ctrlKey || e.altKey) {
                            props.onKeyDown?.(e);
                            return;
                        }
                        setLastKey(e.key);
                        props.onKeyDown?.(e);
                    }}
                />
                {
                    value.length > 0 && (
                        <Button
                            className="absolute end-0 top-0 z-10"
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                                handleChange({target: {value: ''}} as any);
                            }}
                        >
                            <X className="h-4 w-4"/>
                        </Button>
                    )
                }
                {
                    open && (
                        <div
                            className="z-50 bg-background rounded-md border border-border absolute inset-x-0 top-12 max-h-44 overflow-scroll">
                            {filteredItems?.map((item) =>
                                <div
                                    className="px-3 py-3 hover:bg-accent hover:text-accent-foreground cursor-pointer text-sm font-medium"
                                    onClick={() => {
                                        props.onChange?.({target: {value: item.value}} as any);
                                        setValue(item.label);
                                        setOpen(false);
                                    }}
                                    key={item.value}>
                                    {item.label}
                                </div>,
                            )}
                        </div>
                    )
                }
            </div>
        );
    },
);
AutoCompleteInput.displayName = 'Input';

export { AutoCompleteInput };
