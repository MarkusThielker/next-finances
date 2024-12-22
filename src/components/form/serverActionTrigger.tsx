'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { sonnerContent } from '@/components/ui/sonner';
import type { VariantProps } from 'class-variance-authority';
import { ActionResponse } from '@/lib/types/actionResponse';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export interface ConfirmationDialogProps {
    title: string;
    description?: string;
    actionText?: string;
    actionVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

export interface ButtonWithActionProps<T = any>
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    dialog?: ConfirmationDialogProps;
    action: () => Promise<ActionResponse<T>>;
    callback?: (data: T) => void;
}

const ServerActionTrigger = React.forwardRef<HTMLButtonElement, ButtonWithActionProps>(
    ({className, variant, size, asChild = false, ...props}, ref) => {

        const router = useRouter();

        const Comp = asChild ? Slot : 'button';

        const handleSubmit = async () => {
            const response = await props.action();
            toast(sonnerContent(response));
            if (props.callback) {
                props.callback(response);
            }
            if (response.redirect) {
                router.push(response.redirect);
            }
        };

        return props.dialog ? (
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Comp
                        className={cn(buttonVariants({variant, size, className}))}
                        {...{...props, dialog: undefined, action: undefined, callback: undefined}}
                        ref={ref}
                    />
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{props.dialog.title}</AlertDialogTitle>
                        {props.dialog?.description && (
                            <AlertDialogDescription>
                                {props.dialog.description}
                            </AlertDialogDescription>
                        )}
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            Cancel
                        </AlertDialogCancel>
                        <Button variant={props.dialog.actionVariant || 'default'} asChild>
                            <AlertDialogAction onClick={handleSubmit}>
                                {props.dialog.actionText || 'Confirm'}
                            </AlertDialogAction>
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        ) : (
            <Comp
                className={cn(buttonVariants({variant, size, className}))}
                ref={ref}
                onClick={handleSubmit}
                {...{...props, dialog: undefined, action: undefined, callback: undefined}}
            />
        );
    },
);
ServerActionTrigger.displayName = 'ServerActionTrigger';

export { ServerActionTrigger };
