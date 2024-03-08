'use client';

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import React from 'react';
import Link from 'next/link';
import { User } from 'lucide-react';

export default function Navigation() {

    return (
        <div className="flex sticky items-center border-b border-border bg-background">
            <NavigationMenu>
                <NavigationMenuList className="flex w-screen items-center justify-between px-4 py-2">
                    <div className="inline-flex space-x-2">

                        <img src={'/logo_white.png'} alt="Finances" className="h-10 w-10 mx-3"/>

                        <NavigationMenuItem>
                            <Link href="/" legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    Dashboard
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link href="/payments" legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    Payments
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link href="/entities" legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    Entities
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link href="/categories" legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    Categories
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    </div>

                    <NavigationMenuItem>
                        <Link href="/account" legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                <User/>
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    );
}
