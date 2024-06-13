import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";


export async function GET(
    _req: Request,
    {params} : {params : {colorId : string}}
) {

    try {

        if(!params.colorId){
            return new NextResponse("Color id is required", {status : 400})
        }

        const color = await prismadb.color.findUnique({
            where : {
                id : params.colorId
            }
        })

        return new NextResponse(JSON.stringify(color), {status : 200})
        
    } catch (error) {
        console.log('[COLOR_GET]', error);
        return new NextResponse("Internal error", {status : 500})
    }
}

export async function PATCH (
    req: Request,
    {params} : {params : {storeId : string, colorId : string}}
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

        if(!params.colorId){
            return new NextResponse("color id is required", {status : 400})
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
        
        const color = await prismadb.color.updateMany({
            where : {
                id : params.colorId
            },
            data : {
                name,
                value
            }
        })

        return new NextResponse(JSON.stringify(color), {status : 200})
    } catch (error) {
        console.log('[COLOR_PATCH]', error);
        return new NextResponse("Internal error", {status : 500})
    }
}

// params is only avliable in the 2nd argument of delete function not first One 
// even though you don't use req you have to add it here

// _req -> putting a underscore before a variable name is convention that the particluar varible won't be is
//  it's a naming convention

export async function DELETE(
    _req: Request,
    {params} : {params : {storeId : string, colorId : string}}
) {

    try {
        const {userId} = auth();
        
        if(!userId) {
            return new NextResponse("Unauthanticated", {status : 401})
        }

        if(!params.colorId){
            return new NextResponse("color id is required", {status : 400})
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

        const color = await prismadb.color.deleteMany({
            where : {
                id : params.colorId
            }
        })

        return new NextResponse(JSON.stringify(color), {status : 200})
        
    } catch (error) {
        console.log('[COLOR_DELETE]', error);
        return new NextResponse("Internal error", {status : 500})
    }
}