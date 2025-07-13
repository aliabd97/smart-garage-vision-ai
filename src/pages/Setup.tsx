import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SmartGarageSidebar } from "@/components/smart-garage/SmartGarageSidebar";
import { ROISetup } from "@/components/smart-garage/ROISetup";
import { LocalPythonAPI } from "@/components/smart-garage/LocalPythonAPI";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Settings, Target, Server } from "lucide-react";

interface ROIPoint {
  x: number;
  y: number;
}

interface CountingLine {
  name: string;
  direction: "incoming" | "outgoing";
  points: ROIPoint[];
}

const Setup = () => {
  const [roiConfig, setROIConfig] = useState<{
    roi: ROIPoint[];
    lines: CountingLine[];
  } | null>(null);

  const handleROIComplete = (roi: ROIPoint[], lines: CountingLine[]) => {
    setROIConfig({ roi, lines });
    console.log("ROI Configuration saved:", { roi, lines });
  };

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen flex w-full bg-background">
        <SmartGarageSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Top Header */}
          <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
            <div className="flex items-center justify-between px-4 h-full">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="lg:hidden" />
                
                <div className="hidden lg:block">
                  <SidebarTrigger />
                </div>
                
                <div className="flex items-center space-x-3">
                  <Settings className="h-6 w-6 text-primary" />
                  <h1 className="text-xl font-bold">إعدادات النظام</h1>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {roiConfig && (
                  <Badge variant="secondary" className="bg-success/10 text-success">
                    تم حفظ إعدادات ROI
                  </Badge>
                )}
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <div className="p-6 space-y-6 bg-gradient-subtle min-h-screen">
              {/* Header */}
              <Card>
                <CardHeader>
                  <CardTitle>إعداد نظام الكراجات الذكية</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    قم بإعداد منطقة الكشف والاتصال مع نظام Python المحلي لبدء مراقبة المركبات في الوقت الفعلي.
                  </p>
                </CardContent>
              </Card>

              {/* Setup Tabs */}
              <Tabs defaultValue="roi" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="roi" className="flex items-center space-x-2">
                    <Target className="h-4 w-4" />
                    <span>إعداد ROI والخطوط</span>
                  </TabsTrigger>
                  <TabsTrigger value="python" className="flex items-center space-x-2">
                    <Server className="h-4 w-4" />
                    <span>اتصال Python</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="roi" className="space-y-6">
                  <ROISetup 
                    onROIComplete={handleROIComplete}
                    videoSrc="/path/to/video" // سيتم تحديثه لاحقاً
                  />
                </TabsContent>

                <TabsContent value="python" className="space-y-6">
                  <LocalPythonAPI />
                </TabsContent>
              </Tabs>

              {/* Configuration Summary */}
              {roiConfig && (
                <Card>
                  <CardHeader>
                    <CardTitle>ملخص الإعدادات</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                        <h4 className="font-semibold text-blue-700 dark:text-blue-300">منطقة الاهتمام (ROI)</h4>
                        <p className="text-sm text-blue-600 dark:text-blue-400">
                          تم تحديد {roiConfig.roi.length} نقاط
                        </p>
                      </div>
                      
                      <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                        <h4 className="font-semibold text-green-700 dark:text-green-300">خطوط العد</h4>
                        <p className="text-sm text-green-600 dark:text-green-400">
                          تم تحديد {roiConfig.lines.length} خطوط
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Setup;