import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


import prismadb from "@/lib/prismadb";

export async function POST(
    request: Request
) {
    try {
        const {userId} = auth();
        const body = await request.json();
        

        const {name} = body;
        
        if(!userId){
            return new NextResponse("Unauthanticated", {status : 401})
        }
        if(!name){
            return new NextResponse("Name is required", {status : 400})
        }

        const store = await prismadb.store.create({
            data : {
                name,
                userId
            }
        })

        return new NextResponse(JSON.stringify(store), {status : 200}) 

    } catch (error) {
        console.log('[STORES_POST]', error);
        return new NextResponse("Internal error", {status : 500})
    }
}