
"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import * as Slot from "@radix-ui/react-slot"

import { cn } from "@/lib/utils"

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <aside
    ref={ref}
    className={cn(
      "group fixed inset-y-0 left-0 z-20 flex h-full shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground transition-[width] ease-in-out focus:outline-none data-[expanded=false]:w-[70px] data-[expanded=true]:w-64 md:relative xl:data-[expanded=false]:w-[288px]",
      className
    )}
    data-expanded="true"
    {...props}
  >
    {children}
  </aside>
))
Sidebar.displayName = "Sidebar"

type SidebarContextType = {
  expanded: boolean;
  toggle: () => void;
  isMobile: boolean;
}

const SidebarContext = React.createContext<SidebarContextType>({
  expanded: true,
  toggle: () => null,
  isMobile: false,
});

const SidebarProvider = ({
  children,
  initialExpanded = true,
}: {
  children: React.ReactNode
  initialExpanded?: boolean
}) => {
  const [expanded, setExpanded] = React.useState(initialExpanded)
  const [isMobile, setIsMobile] = React.useState(false)
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const toggle = React.useCallback(() => {
    setExpanded(prev => !prev)
  }, [])

  return (
    <SidebarContext.Provider value={{ expanded, toggle, isMobile }}>
      {children}
    </SidebarContext.Provider>
  )
}

const useSidebar = () => {
  const context = React.useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

const SidebarTrigger = ({ className }: { className?: string }) => {
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

const SidebarContent = React.forwardRef<
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

const SidebarFooter = React.forwardRef<
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

const SidebarHeader = React.forwardRef<
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

const SidebarCollapse = () => {
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

const SidebarGroup = React.forwardRef<
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

const SidebarGroupLabel = React.forwardRef<
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

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props}>
    {children}
  </div>
))
SidebarGroupContent.displayName = "SidebarGroupContent"

const SidebarDivider = React.forwardRef<
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

const SidebarIconProps = {
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

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { 
    asChild?: boolean;
    "data-active"?: boolean;
  }
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
        "relative flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 hover:bg-primary/10 hover:text-sidebar-foreground active:bg-primary/20 data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
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

const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
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

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, children, ...props }, ref) => (
  <li ref={ref} className={cn("w-full", className)} {...props}>
    {children}
  </li>
))
SidebarMenuItem.displayName = "SidebarMenuItem"

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
  SidebarCollapse,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarDivider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
}
