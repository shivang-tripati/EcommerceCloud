"use client"

import * as z from "zod"
import {useForm} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import axios from 'axios';
import toast from "react-hot-toast"

import { useStoreModal } from "@/hooks/use-store-modal"
import { Modal } from "@/components/ui/modal"
import { Form, 
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage 
} from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"



const formSchema = z.object({
    name: z.string().min(1, {message: "Name is required"})
})

export const StoreModal = () => {

    const [loading, setLaoding] = useState(false)

    const storeModal = useStoreModal();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues :{
            name:"",
        }
    })

    const onSubmit = async (values : z.infer<typeof formSchema>) => {
        
        try {
            setLaoding(true);
            const response = await axios.post("/api/stores", values);
            console.log(response.data);
            window.location.assign(`/${response.data.id}`)
            // we are using window.location.assign instead of route from next/navigation casue 
            // here window.location.assign(`/${response.data.id}`) is going to do a complete refresh on our page 
            // meaning that the store that is created at this time after refresh will be 100% loaded into database

            // but if you use route from next/navigation there might be cases where database is not ready the data in not in sync with database 
            // so there might be bad user experience(modal will remain open)
            
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        } finally{
            setLaoding(false);
        }
    }

    return (
        <Modal 
        title="Create store" 
        description="Add a new store to manage products and categories"
        isOpen={storeModal.isOpen} 
        onClose={storeModal.onClose}
        
        >
            <div>
                <div className="space-y-4 py-2 pb-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField 
                                control={form.control}
                                name="name"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                 disabled={loading}
                                                 placeholder="E-Commerce" 
                                                 {...field} 
                                                 />
                                            </FormControl>
                                            <FormMessage/>
                                        
                                    </FormItem>
                                )}
                            />


                            <div className="pt-6 space-x-2 flex item-center">
                                <Button 
                                disabled={loading}
                                variant="outline"
                                onClick={storeModal.onClose}
                                >cancel</Button>
                                <Button 
                                disabled={loading}
                                type="submit"
                                >continue</Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </Modal>
    )
}
