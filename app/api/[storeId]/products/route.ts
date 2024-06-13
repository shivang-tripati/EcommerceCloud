import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


import prismadb from "@/lib/prismadb";


export async function POST(
    request: Request,
    {params} : {params : {storeId : string}}
) {
    try {
        const {userId} = auth();
        const body = await request.json();
        

        const {
            name, 
            price,
            sizeId,
            categoryId,
            colorId,
            isFeatured,
            isArchived,
            images
        } = body;
        
        if(!userId){
            return new NextResponse("Unauthanticated", {status : 401})
        }
        if(!name){
            return new NextResponse("Name is required", {status : 400})
        }

        if(!images || images.length === 0) {
            return new NextResponse("Images are required", {status : 400})
        }

        if(!price){
            return new NextResponse("Price is required", {status : 400})
        }
        if(!categoryId){
            return new NextResponse("CategoryId is required", {status : 400})
        }
        if(!sizeId){
            return new NextResponse("Size id is required", {status : 400})
        }
        if(!colorId){
            return new NextResponse("Color id is required", {status : 400})
        }

        if(!params.storeId){
            return new NextResponse("Store id is required", {status : 400})
        }

        const storeByUserId = await prismadb.store.findFirst({
            where : {
                id: params.storeId,
                userId
            }
        })

        if(!storeByUserId) {
            return new NextResponse("Unauthorized", {status : 403})
        }

        
        const product = await prismadb.product.create({
            data : {
                name,
                price,
                sizeId,
                categoryId,
                colorId,
                isFeatured,
                isArchived,
                storeId : params.storeId,
                // images are seprate module so we cannot just past it as array  
                images : {
                    createMany : {
                        data : [
                            ...images.map((image : {url : string}) => image)
                        ]
                    }
                }
            }
        })

        return new NextResponse(JSON.stringify(product), {status : 200}) 

    } catch (error) {
        console.log('[PRODUCT_POST]', error);
        return new NextResponse("Internal error", {status : 500})
    }
}

export async function GET(
    request: Request,
    {params} : {params : {storeId : string}}
) {
    try {
       
        const {searchParams} = new URL(request.url);
        const categoryId = searchParams.get("categoryId") || undefined;
        const colorId = searchParams.get("colorId") || undefined;
        const sizeId = searchParams.get("sizeId") || undefined;
        const isFeatured = searchParams.get("isFeatured") || undefined

        if(!params.storeId){
            return new NextResponse("Store id is required", {status : 400})
        }


        
        const products = await prismadb.product.findMany({
            where: {
                storeId : params.storeId,
                categoryId : categoryId ? {
                    equals : categoryId
                } : undefined,
                colorId : colorId ? {
                    equals : colorId
                } : undefined,
                sizeId : sizeId ? { 
                    equals : sizeId
                } : undefined,
                isFeatured : isFeatured ? true : undefined,
                isArchived : false
        },
        include : {
            images : true,
            category: true,
            size: true,
            color: true
        },

        orderBy : {
            createdAt: 'desc'
        }

        })

        return new NextResponse(JSON.stringify(products), {status : 200}) 

    } catch (error) {
        console.log('[PRODUCTS_GET]', error);
        return new NextResponse("Internal error", {status : 500})
    }
}