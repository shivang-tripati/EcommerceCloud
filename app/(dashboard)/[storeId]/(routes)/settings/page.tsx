
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react'

import prismadb from '@/lib/prismadb';
import { SettingsForm } from './components/settings-form';

interface SettingPageprops {
    params : {
        storeId:  string;
    }
}
 const SettingPage : React.FC<SettingPageprops> = async ({
    params
 }) => {

    const {userId} = auth();
    if(!userId) {
        redirect('/sign-in');
    }

    const store = await prismadb.store.findFirst({
        where : {
            id: params.storeId,
            userId,
        }
    })

    if(!store) {
        redirect('/');
        // when user type wrong url ot will make sure that user get back to the dashboard of th user
    }

    return (
    <div className='flex-col'>
        <div className='flex-1 space-y-4 p-8 pt-6'>
            <SettingsForm initialData={store}/>
        </div>
    </div>
  )
}

export default SettingPage;