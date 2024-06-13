import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";


export async function GET(
    _req: Request,
    {params} : {params : {billboardId : string}}
) {

    try {

        if(!params.billboardId){
            return new NextResponse("Billboard id is required", {status : 400})
        }

        const billboard = await prismadb.billboard.findUnique({
            where : {
                id : params.billboardId
            }
        })

        return new NextResponse(JSON.stringify(billboard), {status : 200})
        
    } catch (error) {
        console.log('[BILLBOARD_GET]', error);
        return new NextResponse("Internal error", {status : 500})
    }
}

export async function PATCH (
    req: Request,
    {params} : {params : {storeId : string, billboardId : string}}
) {

    try {
        const {userId} = auth();
        const body = await req.json();
        const {label , imageUrl } = body;

        if(!userId) {
            return new NextResponse("Unauthorized", {status : 401})
        }

        if(!label){
            return new NextResponse("Label is required", {status : 400})
        }

        if(!imageUrl){
            return new NextResponse("Image URL is required", {status : 400})
        }

        if(!params.billboardId){
            return new NextResponse("Billboard id is required", {status : 400})
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
        
        const billboard = await prismadb.billboard.updateMany({
            where : {
                id : params.billboardId
            },
            data : {
                label,
                imageUrl
            }
        })

        return new NextResponse(JSON.stringify(billboard), {status : 200})
    } catch (error) {
        console.log('[BILLBOARD_PATCH]', error);
        return new NextResponse("Internal error", {status : 500})
    }
}

// params is only avliable in the 2nd argument of delete function not first One 
// even though you don't use req you have to add it here

// _req -> putting a underscore before a variable name is convention that the particluar varible won't be is
//  it's a naming convention

export async function DELETE(
    _req: Request,
    {params} : {params : {storeId : string, billboardId : string}}
) {

    try {
        const {userId} = auth();
        
        if(!userId) {
            return new NextResponse("Unauthanticated", {status : 401})
        }

        if(!params.billboardId){
            return new NextResponse("Billboard id is required", {status : 400})
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

        const billboard = await prismadb.billboard.deleteMany({
            where : {
                id : params.billboardId
            }
        })

        return new NextResponse(JSON.stringify(billboard), {status : 200})
        
    } catch (error) {
        console.log('[BILLBOARD_DELETE]', error);
        return new NextResponse("Internal error", {status : 500})
    }
}