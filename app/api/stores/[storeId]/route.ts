import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";

export async function PATCH (
    req: Request,
    {params} : {params : {storeId : string}}
) {

    try {
        const {userId} = auth();
        const body = await req.json();
        const { name } = body;
        if(!userId) {
            return new NextResponse("Unauthorized", {status : 401})
        }

        if(!name){
            return new NextResponse("Name is required", {status : 400})
        }

        if(!params.storeId){
            return new NextResponse("Store id is required", {status : 400})
        }
        const store = await prismadb.store.update({
            where : {
                id : params.storeId
            },
            data : {
                name
            }
        })
        return new NextResponse(JSON.stringify(store), {status : 200})
    } catch (error) {
        console.log('[STORES_PATCH]', error);
        return new NextResponse("Internal error", {status : 500})
    }
}

// params is only avliable in the 2nd argument of delete function not first One 
// even though you don't use req you have to add it here

// _req -> putting a underscore before a variable name is convention that the particluar varible won't be is
//  it's a naming convention

export async function DELETE(
    _req: Request,
    {params} : {params : {storeId : string}}
) {

    try {
        const {userId} = auth();
        
        if(!userId) {
            return new NextResponse("Unauthorized", {status : 401})
        }

        if(!params.storeId){
            return new NextResponse("Store id is required", {status : 400})
        }
        const store = await prismadb.store.deleteMany({
            where : {
                id : params.storeId
            }
        })

        return new NextResponse(JSON.stringify(store), {status : 200})
        
    } catch (error) {
        console.log('[STORES_DELETE]', error);
        return new NextResponse("Internal error", {status : 500})
    }
}