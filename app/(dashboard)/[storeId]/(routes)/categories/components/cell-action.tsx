"use client"


import toast from "react-hot-toast";
import { BillboardColumn } from "@/app/(dashboard)/[storeId]/(routes)/billboards/components/columns"
import { Button } from "../../../../../../components/ui/button"
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react"
import { 
    DropdownMenuContent, 
    DropdownMenuLabel,
    DropdownMenu, 
    DropdownMenuItem, 
    DropdownMenuTrigger } from "../../../../../../components/ui/dropdown-menu"

import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { AlertModel } from "../../../../../../components/modals/alert-model";
import { CategoryColumn } from "@/app/(dashboard)/[storeId]/(routes)/categories/components/columns";

interface CellActionProps {
    data: CategoryColumn
};

export const CellAction : React.FC<CellActionProps> = ({
    data
}) => {


    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const router = useRouter();
    const params = useParams();

    const onCopy = (id : string) => {
        navigator.clipboard.writeText(id);
        toast.success("Category id copied to the clipboard");
    }

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/categories/${data.id}`);
            router.refresh();
            toast.success("Category deleted");
            
        } catch (error) {
            toast.error("Make sure you removed all the products using this category, then try again.")
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    return (
        <>
            <AlertModel 
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open Menu</span>
                    <MoreHorizontal className="h-4 w-4"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                    Actions
                </DropdownMenuLabel>
                <DropdownMenuItem
                     onClick={() => onCopy(data.id)} >
                    <Copy className="h-4 w-4 mr-2"/>
                    CopyId
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(`/${params.storeId}/categories/${data.id}/`)}>
                    <Edit className="h-4 w-4 mr-2"/>
                    Update
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setOpen(true)}>
                    <Trash className="h-4 w-4 mr-2"/>
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        </>
    )
}