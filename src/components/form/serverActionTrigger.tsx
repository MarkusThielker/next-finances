'use client';

import { buttonVariants } from '@/components/ui/button';
import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { sonnerContent } from '@/components/ui/sonner';
import type { VariantProps } from 'class-variance-authority';
import { ActionResponse } from '@/lib/types/actionResponse';

export interface ButtonWithActionProps<T = any>
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
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

        // TODO: add optional confirmation dialog

        return (
            <Comp
                className={cn(buttonVariants({variant, size, className}))}
                ref={ref}
                {...{...props, action: undefined, callback: undefined}}
                onClick={handleSubmit}
            />
        );
    },
);
ServerActionTrigger.displayName = 'ServerActionTrigger';

export { ServerActionTrigger };
