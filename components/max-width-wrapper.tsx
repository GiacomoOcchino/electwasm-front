import React, { ReactNode } from 'react'
import { cn } from "@/lib/utils";
const MaxWidthWrapper = ({
    className,
    children
}: {
    className?: string,
    children: ReactNode
}) => {
    return (
        <section className={cn("h-full mx-auto w-full max-w-screen-xl px-2.5 md:px-20", className)}>
            {children}
        </section>
    )
}

export default MaxWidthWrapper