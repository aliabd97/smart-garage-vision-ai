import { useState } from "react";
import { Home, Building2, Car, BarChart3, MapPin, Settings, Plus, Menu } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface GarageItem {
  id: string;
  name: string;
  status: "active" | "inactive" | "maintenance";
  vehicleCount: number;
  availableSeats: number;
}

const garageItems: GarageItem[] = [
  {
    id: "downtown",
    name: "كراج وسط المدينة",
    status: "active",
    vehicleCount: 23,
    availableSeats: 134
  },
  {
    id: "mall",
    name: "كراج المركز التجاري",
    status: "active", 
    vehicleCount: 45,
    availableSeats: 67
  },
  {
    id: "airport",
    name: "كراج المطار",
    status: "maintenance",
    vehicleCount: 12,
    availableSeats: 88
  },
  {
    id: "hospital",
    name: "كراج المستشفى",
    status: "inactive",
    vehicleCount: 8,
    availableSeats: 156
  }
];

const navigationItems = [
  { title: "الرئيسية", icon: Home, url: "/", isActive: true },
  { title: "الكراجات", icon: Building2, url: "/garages" },
  { title: "المركبات", icon: Car, url: "/vehicles" },
  { title: "التقارير", icon: BarChart3, url: "/reports" },
  { title: "الخرائط", icon: MapPin, url: "/maps" },
  { title: "الإعدادات", icon: Settings, url: "/settings" },
];

export function SmartGarageSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const [selectedGarage, setSelectedGarage] = useState("downtown");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success text-success-foreground";
      case "inactive":
        return "bg-muted text-muted-foreground";
      case "maintenance":
        return "bg-warning text-warning-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "نشط";
      case "inactive":
        return "متوقف";
      case "maintenance":
        return "صيانة";
      default:
        return "غير معروف";
    }
  };

  return (
    <Sidebar className={`${collapsed ? "w-16" : "w-80"} border-r border-sidebar-border bg-sidebar`}>
      <SidebarContent className="bg-sidebar">
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center space-x-3">
            {!collapsed && (
              <>
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-sidebar-foreground">نظام الكراجات الذكي</h2>
                  <p className="text-sm text-sidebar-foreground/70">إدارة شاملة</p>
                </div>
              </>
            )}
            {collapsed && (
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto">
                <Building2 className="h-6 w-6 text-primary-foreground" />
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="text-sidebar-foreground/70">التنقل الرئيسي</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    className={`
                      ${item.isActive 
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground border-r-2 border-sidebar-primary' 
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                      }
                      ${collapsed ? 'justify-center' : ''}
                    `}
                  >
                    <item.icon className="h-5 w-5" />
                    {!collapsed && <span className="mr-3">{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Garages Section */}
        <SidebarGroup>
          <div className="flex items-center justify-between px-3 py-2">
            {!collapsed && (
              <>
                <SidebarGroupLabel className="text-sidebar-foreground/70">الكراجات المتاحة</SidebarGroupLabel>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-sidebar-foreground/70 hover:text-sidebar-foreground">
                  <Plus className="h-4 w-4" />
                </Button>
              </>
            )}
            {collapsed && (
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-sidebar-foreground/70 hover:text-sidebar-foreground mx-auto">
                <Plus className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <SidebarGroupContent>
            <SidebarMenu>
              {garageItems.map((garage) => (
                <SidebarMenuItem key={garage.id}>
                  <SidebarMenuButton
                    onClick={() => setSelectedGarage(garage.id)}
                    className={`
                      ${selectedGarage === garage.id 
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground' 
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                      }
                      ${collapsed ? 'justify-center p-2' : 'p-3'}
                      transition-all duration-200
                    `}
                  >
                    <>
                      <div className="relative flex-shrink-0">
                        <Building2 className="h-5 w-5" />
                        <div 
                          className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getStatusColor(garage.status)}`}
                          title={getStatusText(garage.status)}
                        />
                      </div>
                      
                      {!collapsed && (
                        <div className="mr-3 flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium truncate">{garage.name}</p>
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${getStatusColor(garage.status)}`}
                            >
                              {getStatusText(garage.status)}
                            </Badge>
                          </div>
                          <div className="flex justify-between text-xs opacity-75 mt-1">
                            <span>{garage.vehicleCount} مركبة</span>
                            <span>{garage.availableSeats} مقعد</span>
                          </div>
                        </div>
                      )}
                    </>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Stats */}
        {!collapsed && (
          <div className="mt-auto p-4 border-t border-sidebar-border">
            <div className="bg-sidebar-accent rounded-lg p-3">
              <h4 className="text-sm font-medium text-sidebar-accent-foreground mb-2">إحصائيات سريعة</h4>
              <div className="space-y-2 text-xs text-sidebar-accent-foreground/80">
                <div className="flex justify-between">
                  <span>إجمالي الكراجات:</span>
                  <span className="font-medium">4</span>
                </div>
                <div className="flex justify-between">
                  <span>الكراجات النشطة:</span>
                  <span className="font-medium text-success">2</span>
                </div>
                <div className="flex justify-between">
                  <span>إجمالي المقاعد:</span>
                  <span className="font-medium">445</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}