import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";


export async function GET(
    _req: Request,
    {params} : {params : {productId : string}}
) {

    try {

        if(!params.productId){
            return new NextResponse("Product id is required", {status : 400})
        }

        const product = await prismadb.product.findUnique({
            where : {
                id : params.productId
            },
            include : {
                images : true,
                category: true,
                size: true,
                color: true
            }
        })

        return new NextResponse(JSON.stringify(product), {status : 200})
        
    } catch (error) {
        console.log('[PRODUCT_GET]', error);
        return new NextResponse("Internal error", {status : 500})
    }
}

export async function PATCH (
    req: Request,
    {params} : {params : {storeId : string, productId : string}}
) {

    try {
        const {userId} = auth();
        const body = await req.json();
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

        if(!userId) {
            return new NextResponse("Unauthorized", {status : 401})
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

        if(!params.productId){
            return new NextResponse("Product id is required", {status : 400})
        }

        const storeByUserId = await prismadb.store.findFirst({
            where : {
                id: params.storeId,
                userId
            }
        })

        if(!storeByUserId) {
            return new NextResponse("Unautharized", {status : 403})
        }
        
        // update and delete images first
        await prismadb.product.update({
            where : {
                id : params.productId
            },
            data : {
                name,
                price,
                sizeId,
                categoryId,
                colorId,
                images : {
                    deleteMany : {},
                },
                isFeatured,
                isArchived,
                
            }
        })

        // now update and create new images first

        const product = await prismadb.product.update({
            where : {
                id : params.productId   
            },
            data : {
                images : {
                    createMany :{
                        data : [
                            ...images.map((image : {url : string}) => image)
                        ]
                    }
                }
            }   
        })

        return new NextResponse(JSON.stringify(product), {status : 200})
    } catch (error) {
        console.log('[PRODUCT_PATCH]', error);
        return new NextResponse("Internal error", {status : 500})
    }
}

// params is only avliable in the 2nd argument of delete function not first One 
// even though you don't use req you have to add it here

// _req -> putting a underscore before a variable name is convention that the particluar varible won't be is
//  it's a naming convention

export async function DELETE(
    _req: Request,
    {params} : {params : {storeId : string, productId : string}}
) {

    try {
        const {userId} = auth();
        
        if(!userId) {
            return new NextResponse("Unauthanticated", {status : 401})
        }

        if(!params.productId){
            return new NextResponse("Product id is required", {status : 400})
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

        const product = await prismadb.product.deleteMany({
            where : {
                id : params.productId
            }
        })

        return new NextResponse(JSON.stringify(product), {status : 200})
        
    } catch (error) {
        console.log('[PRODUCT_DELETE]', error);
        return new NextResponse("Internal error", {status : 500})
    }
}