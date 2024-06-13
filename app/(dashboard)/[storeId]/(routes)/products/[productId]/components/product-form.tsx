"use client"

import {useForm } from "react-hook-form";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios"
import toast from "react-hot-toast";

import { Product, Image, Category, Size, Color} from "@prisma/client";
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
    FormDescription, 
    FormItem 
} from "@/components/ui/form";
import { 
    Select,
    SelectContent, 
    SelectTrigger, 
    SelectValue,
    SelectItem
} from "@/components/ui/select";

import { AlertModel } from "@/components/modals/alert-model";
import { useOrigin } from "@/hooks/use-origin";
import ImageUpload from "@/components/ui/image-upload";
import { Checkbox } from "@/components/ui/checkbox";


const formSchema = z.object({

  name : z.string().min(1, {message: "Name is required"}),
  price: z.coerce.number().min(1, {message: "Price is required"}),
  images : z.object({url : z.string({message : "Image is required"})}).array(), 
  sizeId: z.string().min(1, {message: "Size is required"}),
  categoryId : z.string().min(1, {message: "Category is required"}),
  colorId : z.string().min(1, {message: "Color is required"}),
  isFeatured : z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional()

}) 

interface ProductFormProps {
    initialData : Product & {
        images : Image[]
    } | null;
    categories : Category[]
    sizes : Size[]
    colors : Color[]
}

type ProductFormValues = z.infer<typeof formSchema>


export const ProductForm : React.FC<ProductFormProps> = ({
    initialData,
    categories,
    sizes,
    colors
}) => {


    // custom hook 
    const origin = useOrigin();

    const params = useParams();
    const router = useRouter();
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initialData ? "Edit product" : "Create product";
    const description = initialData ? "Update your product." : "Add a new product.";
    const toastMessage  = initialData? "product updated successfully." : "product created successfully."
    const action = initialData ? "Save changes" : "Create";


    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues:  initialData ? {
            ...initialData,
            price : parseFloat(String(initialData?.price))
        } : {
            name : "",
            price: 0,
            images : [],
            sizeId: "",
            categoryId : "",
            colorId : "",
            isFeatured : false,
            isArchived: false,

        }
    });

    const onSubmit = async (data: ProductFormValues) => {
        try {
            
            setLoading(true);
            if(initialData) {
                await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data);
                console.log("patched", params.productId );
            } else {
                await axios.post(`/api/${params.storeId}/products`, data);
            }
            router.refresh();
            router.push(`/${params.storeId}/products`);
            router.refresh();
            toast.success(toastMessage);
            
        } catch (error) {
            toast.error("Something went wrong.")
        } finally {
            setLoading(false);
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
            router.refresh();
            router.push(`/${params.storeId}/products`);
            toast.success("Product deleted");
            
        } catch (error) {
            toast.error("Something went wrong.")
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
            <FormField
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Images</FormLabel>
                            <FormControl>
                                <ImageUpload 
                                    value={field.value.map((image) => image.url)}
                                    disabled={loading} 
                                    onChange={(url) => field.onChange([...field.value, {url}])}
                                    onRemove={(url) => field.onChange([...field.value.filter((current) => current.url !== url)])}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
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
                                placeholder="Product name"/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField control={form.control} name="price" 
                 render={({ field }) => (
                    <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                            <Input
                             {...field} 
                            disabled={loading}
                            placeholder="9.99"/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                 )
                    }
                />
                <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select disabled={loading} 
                            onValueChange={field.onChange } 
                            value={field.value} defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue 
                                        defaultValue={field.value}
                                        placeholder="Select a category" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem
                                        key={category.id}
                                        value={category.id}
                                        >
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>

                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

            <FormField
                    control={form.control}
                    name="sizeId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Size</FormLabel>
                            <Select disabled={loading} 
                            onValueChange={field.onChange } 
                            value={field.value} defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue 
                                        defaultValue={field.value}
                                        placeholder="Select a size" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {sizes.map((size) => (
                                        <SelectItem
                                        key={size.id}
                                        value={size.id}
                                        >
                                            {size.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>

                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="colorId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Color</FormLabel>
                            <Select disabled={loading} 
                            onValueChange={field.onChange } 
                            value={field.value} defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue 
                                        defaultValue={field.value}
                                        placeholder="Select a color" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {colors.map((color) => (
                                        <SelectItem
                                        key={color.id}
                                        value={color.id}
                                        >
                                            {color.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>

                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
            />

            <FormField control={form.control} name="isFeatured" 
                 render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                            <Checkbox
                                // @ts-ignore
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={loading}
                            />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel>Featured</FormLabel>
                            <FormDescription>
                                This product will be featured on the store(home page).
                            </FormDescription>
                        </div>
                    </FormItem>
                 )
                    }
            />

            <FormField control={form.control} name="isArchived" 
                 render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                            <Checkbox
                                // @ts-ignore
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={loading}
                            />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel>Archived</FormLabel>
                            <FormDescription>
                                This product will  not be featured or appear on the store (home page).
                            </FormDescription>
                        </div>
                    </FormItem>
                 )
                    }
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
