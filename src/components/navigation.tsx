'use client';

import {
    NavigationMenu,
    navigationMenuIconTriggerStyle,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import React, { useState } from 'react';
import Link from 'next/link';
import { Banknote, Home, Menu, Tag, User, UserSearch } from 'lucide-react';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';

export default function Navigation() {

    const [open, setOpen] = useState(false);

    return (
        <div className="flex sticky items-center border-b border-border bg-background">
            <div className="md:hidden">
                <Drawer open={open} onOpenChange={open => setOpen(open)}>
                    <DrawerTrigger asChild>
                        <Button size="icon" variant="ghost" className="m-2">
                            <Menu/>
                        </Button>
                    </DrawerTrigger>
                    <DrawerContent>
                        <div className="flex flex-col space-y-2 w-full rounded-none p-4">
                            <Link
                                href="/"
                                className={navigationMenuIconTriggerStyle()}
                                onClick={() => setOpen(false)}
                                passHref>
                                <Home/>
                                <span>Dashboard</span>
                            </Link>
                            <Link
                                href="/payments"
                                className={navigationMenuIconTriggerStyle()}
                                onClick={() => setOpen(false)}
                                passHref>
                                <Banknote/>
                                <span>Payments</span>
                            </Link>
                            <Link
                                href="/entities"
                                className={navigationMenuIconTriggerStyle()}
                                onClick={() => setOpen(false)}
                                passHref>
                                <UserSearch/>
                                <span>Entities</span>
                            </Link>
                            <Link
                                href="/categories"
                                className={navigationMenuIconTriggerStyle()}
                                onClick={() => setOpen(false)}
                                passHref>
                                <Tag/>
                                <span>Categories</span>
                            </Link>
                            <Link
                                href="/account"
                                className={navigationMenuIconTriggerStyle()}
                                onClick={() => setOpen(false)}
                                passHref>
                                <User/>
                                <span>Account</span>
                            </Link>
                        </div>
                    </DrawerContent>
                </Drawer>
            </div>
            <div className="hidden md:flex">
                <NavigationMenu>
                    <NavigationMenuList className="flex w-screen items-center justify-between sm:px-4 py-2">
                        <div className="inline-flex space-x-2">

                            <img src={'/logo_t_hq_w.svg'} alt="Finances" className="h-10 w-10 mx-3"/>

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
                                    <span className="sr-only">Account</span>
                                    <User/>
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
        </div>
    );
}
