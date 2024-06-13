"use client"

import {useForm } from "react-hook-form";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios"
import toast from "react-hot-toast";

import { Size} from "@prisma/client";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";

import { 
    Form,
    FormField, 
    FormControl, 
    FormLabel, 
    FormMessage, 
    FormItem } from "@/components/ui/form";
import { AlertModel } from "@/components/modals/alert-model";
import { useOrigin } from "@/hooks/use-origin";


const formSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    value : z.string().min(1, { message: "Value is required" }),
})

interface SizeFormProps {
    initialData : Size | null;
}

type SizeFormValues = z.infer<typeof formSchema>


export const SizeForm : React.FC<SizeFormProps> = ({
    initialData
}) => {


    // custom hook 
    const origin = useOrigin();

    const params = useParams();
    const router = useRouter();
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initialData ? "Edit size" : "Create size";
    const description = initialData ? "Update your size." : "Add a new size.";
    const toastMessage  = initialData? "Size updated successfully." : "Size created successfully."
    const action = initialData ? "Save changes" : "Create";


    const form = useForm<SizeFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues:  initialData || {
            name: "",
            value : "",
        },
    });

    const onSubmit = async (data: SizeFormValues) => {
        try {
            
            setLoading(true);
            if(initialData) {
                await axios.patch(`/api/${params.storeId}/sizes/${params.sizeId}`, data);
                console.log("patched", params.sizeId );
            } else {
                await axios.post(`/api/${params.storeId}/sizes`, data);
            }
            router.refresh();
            router.push(`/${params.storeId}/sizes`);
            toast.success("Size updated successfully");
            
        } catch (error) {
            toast.error("Something went wrong.")
        } finally {
            setLoading(false);
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`);
            router.refresh();
            router.push(`/${params.storeId}/sizes`);
            toast.success("Size deleted");
            
        } catch (error) {
            toast.error("Make sure you removed all products using this Size first, then try again.")
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
       onConfirm={() => {onDelete()}}
       loading={loading}
   />

     <div className='flex items-center justify-between' >
        <Heading 
            title={title}
            description={description}    
        />
        { initialData && 
            <Button 
              disabled={loading}
              variant="destructive"
              size="icon"
              onClick={() => {
              setOpen(true)
              }}
            >
              <Trash className="h-4 w-4"/>
            </Button>}
      </div>

    <Separator/>
    <Form {...form}>
        <form 
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full"
            >
            <div className="grid grid-cols-3 gap-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input
                                 {...field} 
                                disabled={loading}
                                placeholder="Size name"/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Value</FormLabel>
                            <FormControl>
                                <Input
                                 {...field} 
                                disabled={loading}
                                placeholder="Size value"/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <Button 
                disabled={loading}
                className="ml-auto"
                type="submit"
            >
                {action}
            </Button>
        </form>
    </Form>
    <Separator/>

   </>
  )
};
