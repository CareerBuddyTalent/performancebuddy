
"use client"

import * as React from "react"
import * as Slot from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { useSidebar } from "./sidebar-provider"

export const SidebarIconProps = {
  size: 20,
  className: "shrink-0",
}

const sidebarMenuButton = cva(
  "relative flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 hover:bg-primary/10 hover:text-sidebar-foreground active:bg-primary/20 data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
  {
    variants: {
      active: {
        true: "bg-sidebar-accent text-sidebar-accent-foreground",
        false: "",
      },
    },
    defaultVariants: {
      active: false,
    },
  }
)

export interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  "data-active"?: boolean;
  className?: string;
}

export const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuButtonProps
>(({ className, children, asChild = false, "data-active": active, ...props }, ref) => {
  const { expanded } = useSidebar()

  const Comp = asChild ? Slot.Slot : "button"

  if (!expanded) {
    return (
      <Comp
        ref={ref}
        className={cn(
          "group relative flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg p-3 text-center hover:bg-primary/10 hover:text-sidebar-foreground focus:outline-none active:bg-primary/20 data-[active=true]:text-sidebar-primary",
          className
        )}
        data-active={active}
        {...props}
      >
        {React.Children.map(children, child => {
          if (
            React.isValidElement(child) &&
            (child.type === "svg" ||
              (typeof child.type === "function" &&
                child.type.name &&
                child.type.name !== "span"))
          ) {
            return React.cloneElement(child as React.ReactElement, {
              ...SidebarIconProps,
            })
          }
          return null
        })}
      </Comp>
    )
  }

  return (
    <Comp
      ref={ref}
      className={cn(
        sidebarMenuButton({ active: !!active }),
        className
      )}
      data-active={active}
      {...props}
    >
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          if (
            child.type === "svg" ||
            (typeof child.type === "function" &&
              child.type.name &&
              child.type.name !== "span")
          ) {
            return React.cloneElement(child as React.ReactElement, {
              ...SidebarIconProps,
            })
          }
        }
        return child
      })}
    </Comp>
  )
})
SidebarMenuButton.displayName = "SidebarMenuButton"

export interface SidebarMenuProps extends React.HTMLAttributes<HTMLUListElement> {
  className?: string;
}

export const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  SidebarMenuProps
>(({ className, children, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn(
      "flex flex-col gap-px data-[expanded=false]:items-center data-[expanded=false]:justify-center",
      className
    )}
    data-expanded={useSidebar().expanded}
    {...props}
  >
    {children}
  </ul>
))
SidebarMenu.displayName = "SidebarMenu"

export interface SidebarMenuItemProps extends React.HTMLAttributes<HTMLLIElement> {
  className?: string;
}

export const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  SidebarMenuItemProps
>(({ className, children, ...props }, ref) => (
  <li ref={ref} className={cn("w-full", className)} {...props}>
    {children}
  </li>
))
SidebarMenuItem.displayName = "SidebarMenuItem"
