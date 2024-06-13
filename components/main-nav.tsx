"use client"

import React from 'react'
import { cn } from '@/lib/utils'
import { useParams, usePathname, useRouter } from 'next/navigation'
import Link from 'next/link';


export default function MainNav({
    className,
    ...props
} : React.HTMLAttributes<HTMLDivElement>) {



    const path = usePathname();
    const params = useParams();
    const routes = [
        {
            href : `/${params.storeId}`,
            label: "Overview",
            active: path === `/${params.storeId}`
        },
        {
            href : `/${params.storeId}/billboards`,
            label: "Billboards",
            active: path === `/${params.storeId}/billboards`
        },
        
        {
            href : `/${params.storeId}/categories`,
            label: "Categories",
            active: path === `/${params.storeId}/categories`
        },
        
        {
            href : `/${params.storeId}/sizes`,
            label: "Sizes",
            active: path === `/${params.storeId}/sizes`
        },
        {
            href : `/${params.storeId}/colors`,
            label: "Colors",
            active: path === `/${params.storeId}/colors`
        },
        {
            href : `/${params.storeId}/products`,
            label: "Products",
            active: path === `/${params.storeId}/products`
        },
        {
            href : `/${params.storeId}/orders`,
            label: "Orders",
            active: path === `/${params.storeId}/orders`
        },
        {
            href : `/${params.storeId}/settings`,
            label: "Settings",
            active: path === `/${params.storeId}/settings`
        },
        
    ]

  return (
    <nav 
    
    className={cn("flex items-center space-x-4 lg:space-x-6", className)}
    >
        {routes.map((route) => (
            <Link 
            key={route.href}
            href={route.href}
    
            
            className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                route.active ? "text-black dark:text-white" : "text-muted-foreground")}
            >
                {route.label}
            </Link>
        ))}
    </nav>
  )
}
