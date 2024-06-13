"use client"

import {useForm } from "react-hook-form";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios"
import toast from "react-hot-toast";

import { Store } from "@prisma/client";
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
import { ApiAlert } from "@/components/ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";


interface SettingsFormProps {
    initialData : Store;
}
const formSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
})

type SettingsFormValues = z.infer<typeof formSchema>


export const SettingsForm : React.FC<SettingsFormProps> = ({
    initialData
}) => {


    // custom hook 
    const origin = useOrigin();

    const params = useParams();
    const router = useRouter();
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues:  initialData,
    });

    const onSubmit = async (data: SettingsFormValues) => {
        try {
            setLoading(true);
            await axios.patch(`/api/stores/${params.storeId}`, data);
            router.refresh();
            toast.success("Store updated successfully");
            
        } catch (error) {
            toast.error("Something went wrong.")
        } finally {
            setLoading(false);
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/stores/${params.storeId}`);
            router.refresh();
            router.push("/");
            toast.success("Store deleted successfully");
            
        } catch (error) {
            toast.error("Make sure you removed all products and categories first, then try again.")
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
            title="Settings"
            description="Manage your store prefrence."    
        />
        <Button 
            disabled={loading}
            variant="destructive"
            size="icon"
            onClick={() => {
                setOpen(true)
            }}
            
        >
            <Trash className="h-4 w-4"/>
        </Button>
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
                                placeholder="Store name"/>
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
                save changes
            </Button>
        </form>
    </Form>
    <Separator/>
    <ApiAlert title="NEXT_PUBLIC_API_KEY or URL"
     description={`${origin}/api/stores/${params.storeId}`}
     variant="public"/>
   </>
  )
};
