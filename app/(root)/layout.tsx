
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";

export default async function SetUpLayout({
    children,
} : {
    children : React.ReactNode
}
) {

    const {userId} = auth();
    if(!userId) {   
        redirect("/sign-in");
    }

    const store = await prismadb.store.findFirst({
        where : {
            userId
        }
    });
    
    // if(!store) {
    //     redirect("/");
    // }

    if(store) {
        redirect(`/${store.id}`)
    }

  return (
    <>
    {children}
    </>
  )  
}