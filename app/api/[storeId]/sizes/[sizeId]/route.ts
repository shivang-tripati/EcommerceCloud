import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";


export async function GET(
    _req: Request,
    {params} : {params : {sizeId : string}}
) {

    try {

        if(!params.sizeId){
            return new NextResponse("Size id is required", {status : 400})
        }

        const size = await prismadb.size.findUnique({
            where : {
                id : params.sizeId
            }
        })

        return new NextResponse(JSON.stringify(size), {status : 200})
        
    } catch (error) {
        console.log('[SIZE_GET]', error);
        return new NextResponse("Internal error", {status : 500})
    }
}

export async function PATCH (
    req: Request,
    {params} : {params : {storeId : string, sizeId : string}}
) {

    try {
        const {userId} = auth();
        const body = await req.json();
        const {name, value} = body;

        if(!userId) {
            return new NextResponse("Unauthanticated", {status : 401})
        }

        if(!name){
            return new NextResponse("Name is required", {status : 400})
        }

        if(!value){
            return new NextResponse("Value is required", {status : 400})
        }

        if(!params.sizeId){
            return new NextResponse("Size id is required", {status : 400})
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
        
        const size = await prismadb.size.updateMany({
            where : {
                id : params.sizeId
            },
            data : {
                name,
                value
            }
        })

        return new NextResponse(JSON.stringify(size), {status : 200})
    } catch (error) {
        console.log('[SIZE_PATCH]', error);
        return new NextResponse("Internal error", {status : 500})
    }
}

// params is only avliable in the 2nd argument of delete function not first One 
// even though you don't use req you have to add it here

// _req -> putting a underscore before a variable name is convention that the particluar varible won't be is
//  it's a naming convention

export async function DELETE(
    _req: Request,
    {params} : {params : {storeId : string, sizeId : string}}
) {

    try {
        const {userId} = auth();
        
        if(!userId) {
            return new NextResponse("Unauthanticated", {status : 401})
        }

        if(!params.sizeId){
            return new NextResponse("Size id is required", {status : 400})
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

        const size = await prismadb.size.deleteMany({
            where : {
                id : params.sizeId
            }
        })

        return new NextResponse(JSON.stringify(size), {status : 200})
        
    } catch (error) {
        console.log('[SIZE_DELETE]', error);
        return new NextResponse("Internal error", {status : 500})
    }
}