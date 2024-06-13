"use client"


import { useState, useEffect } from "react";
import { ImagePlus, ImagePlusIcon, Trash } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from 'next-cloudinary';

import { Button } from "./button";
 

interface ImageUploadProps {
    disabled? : boolean;
    onChange: (value : string) => void;
    onRemove: (value: string) => void;
    value: string[];
}
const ImageUpload : React.FC<ImageUploadProps> = ({
    disabled,
    onChange,
    onRemove,
    value
}) => {


    const [isMounted, setIsMounted] = useState(false);

    //  so this way ensure  that untill the life below cycle has run, which is only something that can happen in the client component, I will return null
    useEffect(()=> {
        setIsMounted(true);
    }, [])

    const OnUpload = (result : any) => {
        onChange(result.info.secure_url)
    }

    //  so if it is not mounted (i.e. i am in server side rendering) then return null
    if(!isMounted) {
        return null
    }

    


    return (
        <div>
            <div className="mb-4 flex items-center gap-4">
                {value.map((url) => (
                  <div key={url} className="relative w-[200px] h-[200px] 
                  rounded-md overflow-hidden ">
                    <div className="z-10 absolute top-2 right-2">
                        <Button 
                            type="button" variant="destructive"
                            onClick={() => onRemove(url)}  size="icon"  
                        >
                            <Trash className="h-4 w-4 "/>
                        </Button>
                    </div>
                    <Image
                        src={url}
                        alt="image"
                        width={200}
                        height={200}
                        className="w-full h-full object-cover"
                    />
                  </div>  
                ))}
            </div>
            <CldUploadWidget onUpload={OnUpload} uploadPreset="gfimadsh" >
                {({ open }) => {
                    const onClick = () => {
                        open?.();
                    }
                    return (
                        <Button
                        className="gap-2"
                        variant="secondary" type="button"
                        onClick={onClick}
                        disabled={disabled}
                    >
                        <ImagePlus/>
                        Upload an image
                    </Button> )
        
                }}
            </CldUploadWidget>
        </div>
    )
}

export default ImageUpload