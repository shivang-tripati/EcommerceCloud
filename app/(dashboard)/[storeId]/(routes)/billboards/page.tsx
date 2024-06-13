

import prismadb from '@/lib/prismadb'
import {BillboardClient } from './components/client'
import { BillboardColumn } from './components/columns';

const BillboardsPage = async({
    params
} : {
    params : {storeId : string}
}) => {

    const billboards = await prismadb.billboard.findMany({
        where : {
            storeId : params.storeId
        },
        orderBy : {
            createdAt: 'desc'
        }
    });

    const formattedBillboards : BillboardColumn[] = billboards.map((billboard) => ({
        ...billboard,
        createdAt : billboard.createdAt.toDateString()
    }));

    return (

        
        
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BillboardClient data={formattedBillboards}/>
            </div>
        </div>
    )
}

export default BillboardsPage   