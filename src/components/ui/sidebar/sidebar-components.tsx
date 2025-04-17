
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useSidebar } from "./sidebar-provider"

export const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <aside
    ref={ref}
    className={cn(
      "group fixed inset-y-0 left-0 z-20 flex h-full shrink-0 flex-col border-r bg-background text-foreground transition-[width] ease-in-out focus:outline-none data-[expanded=false]:w-[70px] data-[expanded=true]:w-64 md:relative xl:data-[expanded=false]:w-[288px]",
      className
    )}
    data-expanded="true"
    {...props}
  >
    {children}
  </aside>
))
Sidebar.displayName = "Sidebar"

export const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-1 overflow-y-auto p-3 pt-12 md:pt-3", className)}
    {...props}
  >
    {children}
  </div>
))
SidebarContent.displayName = "SidebarContent"

export const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mt-auto border-t p-3", className)}
    {...props}
  >
    {children}
  </div>
))
SidebarFooter.displayName = "SidebarFooter"

export const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("sticky top-0 z-10 border-b p-3", className)}
    {...props}
  >
    {children}
  </div>
))
SidebarHeader.displayName = "SidebarHeader"

export const SidebarTrigger = ({ className }: { className?: string }) => {
  const { expanded, toggle, isMobile } = useSidebar()

  if (!isMobile) {
    return null
  }

  return (
    <button
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-primary/10 active:bg-primary/50",
        className
      )}
      onClick={toggle}
    >
      {expanded ? (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20.25 7.5L16 12L20.25 16.5M3.75 7.5L8 12L3.75 16.5M12 3.75V20.25"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  )
}

export const SidebarCollapse = () => {
  const { expanded, toggle } = useSidebar()
  return (
    <div className="relative hidden h-6 pr-4 text-right md:block">
      <div className="absolute -right-3 top-0 z-10 h-6 w-6 cursor-pointer rounded-full border bg-background">
        <div
          role="button"
          onClick={toggle}
          className="flex h-full w-full items-center justify-center"
        >
          {expanded ? (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      </div>
    </div>
  )
}
