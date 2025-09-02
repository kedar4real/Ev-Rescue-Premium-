"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"
import { Button } from "./button"
import { ScrollArea } from "./scroll-area"
import Link from "next/link"
import { useSidebar } from "../providers/SidebarProvider"
import { 
  Home, 
  MapPin, 
  AlertTriangle, 
  Truck, 
  MessageSquare, 
  Settings, 
  User, 
  BarChart3, 
  History, 
  Car, 
  Shield,
  Menu,
  X
} from "lucide-react"

const sidebarVariants = cva(
  "group relative flex h-full flex-col gap-4 border-r bg-background p-4 transition-all duration-500 ease-in-out z-10",
  {
    variants: {
      variant: {
        default: "border-border",
        secondary: "border-secondary",
      },
      size: {
        default: "w-64",
        sm: "w-16",
        lg: "w-80",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface SidebarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarVariants> {}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, variant, size, ...props }, ref) => {
    const { isCollapsed, toggleSidebar } = useSidebar()
    
    return (
      <div
        ref={ref}
        className={cn(
          sidebarVariants({ variant, size }),
          isCollapsed ? "w-16" : "w-64",
          "hidden md:flex", // Hide on mobile, show on desktop
          "overflow-hidden", // Prevent content overflow during animation
          "bg-gray-900 border-gray-700", // Ensure proper background and border
          className
        )}
        {...props}
      >
        <div className="flex h-14 items-center justify-between px-2 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600 flex-shrink-0">
              <Car className="h-4 w-4 text-white" />
            </div>
            {!isCollapsed && (
              <span className="font-bold text-lg tracking-tight text-white">
                EV Rescue
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8 flex-shrink-0 hover:bg-gray-700 transition-colors duration-200 text-white"
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="space-y-2">
            <SidebarNav />
          </div>
        </ScrollArea>
        
        <div className="mt-auto">
          <SidebarFooter />
        </div>
      </div>
    )
  }
)
Sidebar.displayName = "Sidebar"

const SidebarNav = () => {
  const navItems = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/",
      description: "Overview and quick actions"
    },
    {
      title: "Find Charging",
      icon: MapPin,
      href: "/charging-finder",
      description: "Locate nearby charging stations"
    },
    {
      title: "Emergency Assistance",
      icon: AlertTriangle,
      href: "/emergency-assistance",
      description: "24/7 roadside assistance"
    },
    {
      title: "Live Tracking",
      icon: Truck,
      href: "/tracking",
      description: "Track service progress"
    },
    {
      title: "Service History",
      icon: History,
      href: "/history",
      description: "View past service requests"
    },
    {
      title: "Fleet Management",
      icon: Truck,
      href: "/fleet",
      description: "Live fleet tracking and management"
    },
    {
      title: "Van Management",
      icon: BarChart3,
      href: "/van-management",
      description: "Manage service vehicles"
    },
    {
      title: "Live Chat",
      icon: MessageSquare,
      href: "/chat",
      description: "Chat with support team"
    },
    {
      title: "Analytics",
      icon: Shield,
      href: "/analytics",
      description: "Service performance metrics"
    }
  ]

  return (
    <nav className="space-y-1">
      {navItems.map((item) => (
        <SidebarNavItem key={item.title} item={item} />
      ))}
    </nav>
  )
}

interface SidebarNavItemProps {
  item: {
    title: string
    icon: React.ComponentType<{ className?: string }>
    href: string
    description: string
  }
}

const SidebarNavItem = ({ item }: SidebarNavItemProps) => {
  const { isCollapsed } = useSidebar()
  const Icon = item.icon
  
  return (
    <Button
      variant="ghost"
      className="w-full justify-start h-auto p-3 group relative overflow-hidden"
      asChild
    >
      <Link href={item.href} className="flex items-center min-w-0">
        <Icon className="h-4 w-4 flex-shrink-0" />
        <div 
          className={cn(
            "flex-1 text-left transition-all duration-500 ease-in-out",
            isCollapsed 
              ? "opacity-0 w-0 ml-0 overflow-hidden" 
              : "opacity-100 w-auto ml-3"
          )}
        >
          <div className="font-medium truncate">{item.title}</div>
          <div className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200 truncate">
            {item.description}
          </div>
        </div>
      </Link>
    </Button>
  )
}

const SidebarFooter = () => {
  const { isCollapsed } = useSidebar()
  const footerItems = [
    {
      title: "Settings",
      icon: Settings,
      href: "/settings"
    },
    {
      title: "Profile",
      icon: User,
      href: "/profile"
    }
  ]

  return (
    <div className="space-y-2">
      {footerItems.map((item) => (
        <Button
          key={item.title}
          variant="ghost"
          size="sm"
          className="w-full justify-start overflow-hidden"
          asChild
        >
          <Link href={item.href} className="flex items-center min-w-0">
            <item.icon className="h-4 w-4 flex-shrink-0" />
            <span 
              className={cn(
                "transition-all duration-500 ease-in-out",
                isCollapsed 
                  ? "opacity-0 w-0 ml-0 overflow-hidden" 
                  : "opacity-100 w-auto ml-2"
              )}
            >
              {item.title}
            </span>
          </Link>
        </Button>
      ))}
    </div>
  )
}

export { Sidebar, SidebarNav, SidebarNavItem, SidebarFooter }
