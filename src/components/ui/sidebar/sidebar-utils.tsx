
"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { useSidebar } from "./sidebar-provider"

const sidebarGroup = cva("", {
  variants: {
    layout: {
      default: "mb-4 last:mb-0",
      separated: "mb-4 rounded-lg bg-sidebar-accent px-3 py-2 last:mb-0",
    },
  },
  defaultVariants: {
    layout: "default",
  },
})

export const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { layout?: "default" | "separated" }
>(({ className, children, layout = "default", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(sidebarGroup({ layout }), className)}
    {...props}
  >
    {children}
  </div>
))
SidebarGroup.displayName = "SidebarGroup"

export const SidebarGroupLabel = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { expanded } = useSidebar()
  if (!expanded) {
    return null
  }
  return (
    <p
      ref={ref}
      className={cn(
        "mb-4 px-1 text-xs font-semibold uppercase tracking-wider",
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
})
SidebarGroupLabel.displayName = "SidebarGroupLabel"

export const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props}>
    {children}
  </div>
))
SidebarGroupContent.displayName = "SidebarGroupContent"

export const SidebarDivider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mb-4 border-b border-sidebar-border", className)}
    {...props}
  />
))
SidebarDivider.displayName = "SidebarDivider"
