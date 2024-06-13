"use client"

import React, { useEffect } from "react";
import { useState } from "react";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface AlertModelProps  {
    isOpen : boolean,
    onClose: () => void;
    onConfirm: () => void;
    loading : boolean
}
export const AlertModel : React.FC<AlertModelProps> = ({
    isOpen,
    onClose,
    onConfirm,
    loading 
}) => {

    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);

    }, [])

    if(!isMounted) {
        return null;
    }

    return (
        <Modal
            title="Are you sure?"
            description="This action cannot be undone"
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className="flex justify-end space-x-2">
                <Button
                    variant="outline"
                    onClick={onClose}
                    disabled={loading}
                >
                    Cancel
                </Button>
                
                <Button
                    variant="destructive"
                    onClick={onConfirm}
                    disabled={loading}
                >
                    Continue
                </Button>
            </div>
        </Modal>
    )
}