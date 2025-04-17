
"use client"

import * as React from "react"

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

export const SidebarProvider = ({
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

export const useSidebar = () => {
  const context = React.useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}
