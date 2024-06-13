import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";


export async function GET(
    _req: Request,
    {params} : {params : {categoryId : string}}
) {

    try {

        if(!params.categoryId){
            return new NextResponse("Billboard id is required", {status : 400})
        }

        const category = await prismadb.category.findUnique({
            where : {
                id : params.categoryId
            },
            include : {
                billboard : true
            }
        })

        return new NextResponse(JSON.stringify(category), {status : 200})
        
    } catch (error) {
        console.log('[CATEGORY_GET]', error);
        return new NextResponse("Internal error", {status : 500})
    }
}

export async function PATCH (
    req: Request,
    {params} : {params : {storeId : string, categoryId : string}}
) {

    try {
        const {userId} = auth();
        const body = await req.json();
        const {name, billboardId} = body;

        if(!userId) {
            return new NextResponse("Unauthorized", {status : 401})
        }

        if(!name){
            return new NextResponse("Name is required", {status : 400})
        }

        if(!billboardId){
            return new NextResponse("Billboard id is required", {status : 400})
        }

        if(!params.categoryId){ 
            return new NextResponse("Category id is required", {status : 400})
        }

        const storeByUserId = await prismadb.store.findFirst({
            where : {
                id: params.storeId,
                userId
            }
        })

        if(!storeByUserId) {
            return new NextResponse("Unauthanticated", {status : 403})
        }
        

        const category = await prismadb.category.update({
            where : {
                id : params.categoryId  
            },
            data : {
                name,
                billboardId
            }
        })

        return new NextResponse(JSON.stringify(category), {status : 200})
    } catch (error) {
        console.log('[CATEGORY_PATCH]', error);
        return new NextResponse("Internal error", {status : 500})
    }
}

// params is only avliable in the 2nd argument of delete function not first One 
// even though you don't use req you have to add it here

// _req -> putting a underscore before a variable name is convention that the particluar varible won't be is
//  it's a naming convention

export async function DELETE(
    _req: Request,
    {params} : {params : {storeId : string, categoryId : string}}
) {

    try {
        const {userId} = auth();
        
        if(!userId) {
            return new NextResponse("Unauthanticated", {status : 401})
        }

        if(!params.categoryId){
            return new NextResponse("Category id is required", {status : 400})
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

        const category = await prismadb.category.deleteMany({
            where : {
                id : params.categoryId
            }
        })

        return new NextResponse(JSON.stringify(category), {status : 200})
        
    } catch (error) {
        console.log('[CATEGORY_DELETE]', error);
        return new NextResponse("Internal error", { status : 500})
    }
}