"use client"

import {useForm } from "react-hook-form";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios"
import toast from "react-hot-toast";

import { Color} from "@prisma/client";
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
    value : z.string().min(4, { message: "String must be a valid hexcode e.g. #ffffff" }).regex(/^#([0-9a-f]{3}){1,2}$/i, { message: "Invalid color value" }),
})

interface ColorFormProps {
    initialData : Color | null;
}

type ColorFormValues = z.infer<typeof formSchema>


export const ColorForm : React.FC<ColorFormProps> = ({
    initialData
}) => {


    // custom hook 
    const origin = useOrigin();

    const params = useParams();
    const router = useRouter();
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initialData ? "Edit color" : "Create color";
    const description = initialData ? "Update your color." : "Add a new color.";
    const toastMessage  = initialData? "Color updated successfully." : "Color created successfully."
    const action = initialData ? "Save changes" : "Create";


    const form = useForm<ColorFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues:  initialData || {
            name: "",
            value : "",
        },
    });

    const onSubmit = async (data: ColorFormValues) => {
        try {
            
            setLoading(true);
            if(initialData) {
                await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`, data);
                console.log("patched", params.colorId );
            } else {
                await axios.post(`/api/${params.storeId}/colors`, data);
            }
            router.refresh();
            router.push(`/${params.storeId}/colors`);
            router.refresh();
            toast.success("Color updated successfully");
            
        } catch (error) {
            toast.error("Something went wrong.")
        } finally {
            setLoading(false);
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/colors/${params.sizeId}`);
            router.refresh();
            router.push(`/${params.storeId}/colors`);
            toast.success("Color deleted");
            router.refresh();
            
        } catch (error) {
            toast.error("Make sure you removed all products using this Color first, then try again.")
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
                                placeholder="Color name"/>
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
                                <div className="flex items-center gap-x-4">
                                    <Input {...field} 
                                    disabled={loading}
                                    placeholder="Color value"/>
                                    <div className="border p-4 rounded-full" 
                                    style={{backgroundColor: field.value}}/>
                                </div>
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
