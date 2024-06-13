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
        

        const {name, value} = body;
        
        if(!userId){
            return new NextResponse("Unauthanticated", {status : 401})
        }
        if(!name){
            return new NextResponse("Name is required", {status : 400})
        }

        if(!value){
            return new NextResponse("Image URL is required", {status : 400})
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

        
        const size = await prismadb.size.create({
            data : {
                name,
                value,
                storeId : params.storeId
            }
        })

        return new NextResponse(JSON.stringify(size), {status : 200}) 

    } catch (error) {
        console.log('[SIZE_POST]', error);
        return new NextResponse("Internal error", {status : 500})
    }
}

export async function GET(
    request: Request,
    {params} : {params : {storeId : string}}
) {
    try {
       
        if(!params.storeId){
            return new NextResponse("Store id is required", {status : 400})
        }


        
        const sizes = await prismadb.size.findMany({
            where: {
             storeId : params.storeId
            }
        })

        return new NextResponse(JSON.stringify(sizes), {status : 200}) 

    } catch (error) {
        console.log('[SIZES_GET]', error);
        return new NextResponse("Internal error", {status : 500})
    }
}