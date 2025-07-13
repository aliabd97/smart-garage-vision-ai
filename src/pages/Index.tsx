import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SmartGarageSidebar } from "@/components/smart-garage/SmartGarageSidebar";
import { SmartGarageDashboard } from "@/components/smart-garage/SmartGarageDashboard";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const Index = () => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <SmartGarageSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Top Header */}
          <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
            <div className="flex items-center justify-between px-4 h-full">
              <div className="flex items-center space-x-4">
                <SidebarTrigger asChild>
                  <Button variant="ghost" size="sm" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SidebarTrigger>
                
                <div className="hidden lg:block">
                  <SidebarTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SidebarTrigger>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="text-sm text-muted-foreground">
                  نظام إدارة الكراجات الذكي
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <SmartGarageDashboard />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
