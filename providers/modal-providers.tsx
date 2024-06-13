"use client"

import React, {useState, useEffect} from 'react'

import { StoreModal } from '@/components/modals/store-modal';


// the modal provider will be added inside the layout.tsx, 
// but layout.tsx is server component, meaning a client component cannot just added to it(layout.tsx)

//  it has to be ensure that there won't be any hydration error specially  with modals

// in this project there is lot of way you can trigger modal, i.e from diffrent pages
// that can cause there synchronisation issue, 
// for example the server will not have any model open  but the client will. that is going to throw a hydration  error

 
export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    //  so this way ensure  that untill the life below cycle has run, which is only something that can happen in the client component, I will return null
    useEffect(()=> {
        setIsMounted(true);
    }, [])

    //  so if it is not mounted (i.e. i am in server side rendering) then return null
    if(!isMounted) {
        return null
    }

    // so there is no hydration error will be happening in the client side
    // this is a small trick you can do when you have hydration error occuring 

    // if it is in client side return below component 
    return (
        <>
        <StoreModal/>
        </>
    )
}


// In this scenario, you are dealing with potential hydration errors related to modals in a React application
//  where the layout is a server component and modals need to be handled as client components. 
// To ensure there won't be any hydration errors, you can use the approach you've outlined. 
// This approach delays the rendering of the modal until the client-side has mounted, 
// preventing discrepancies between server-side and client-side rendering.