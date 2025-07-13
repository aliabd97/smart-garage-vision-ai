import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Server, 
  Play, 
  Square, 
  Wifi, 
  WifiOff, 
  Settings, 
  AlertCircle,
  CheckCircle,
  Code,
  Database
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PythonAPIConfig {
  serverUrl: string;
  websocketUrl: string;
  apiKey?: string;
  isConnected: boolean;
  isProcessing: boolean;
}

interface LiveStats {
  totalVehicles: number;
  totalSeats: number;
  incomingVehicles: number;
  outgoingVehicles: number;
  currentSeatsInside: number;
  detectionAccuracy: number;
  processingTime: number;
  lastUpdate: string;
}

export function LocalPythonAPI() {
  const { toast } = useToast();
  const [config, setConfig] = useState<PythonAPIConfig>({
    serverUrl: "http://localhost:8000",
    websocketUrl: "ws://localhost:8001",
    isConnected: false,
    isProcessing: false
  });
  
  const [liveStats, setLiveStats] = useState<LiveStats>({
    totalVehicles: 0,
    totalSeats: 0,
    incomingVehicles: 0,
    outgoingVehicles: 0,
    currentSeatsInside: 0,
    detectionAccuracy: 0,
    processingTime: 0,
    lastUpdate: "غير متصل"
  });

  const [websocket, setWebsocket] = useState<WebSocket | null>(null);

  // محاولة الاتصال بالـ WebSocket
  const connectWebSocket = () => {
    try {
      const ws = new WebSocket(config.websocketUrl);
      
      ws.onopen = () => {
        setConfig(prev => ({ ...prev, isConnected: true }));
        toast({
          title: "✅ تم الاتصال",
          description: "تم الاتصال بسيرفر Python بنجاح",
        });
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLiveStats(data);
        } catch (error) {
          console.error("Error parsing WebSocket data:", error);
        }
      };
      
      ws.onclose = () => {
        setConfig(prev => ({ ...prev, isConnected: false }));
        setWebsocket(null);
        toast({
          title: "❌ انقطع الاتصال",
          description: "انقطع الاتصال مع سيرفر Python",
          variant: "destructive"
        });
      };
      
      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        toast({
          title: "خطأ في الاتصال",
          description: "فشل في الاتصال بسيرفر Python",
          variant: "destructive"
        });
      };
      
      setWebsocket(ws);
    } catch (error) {
      toast({
        title: "خطأ في الاتصال",
        description: "تأكد من تشغيل سيرفر Python",
        variant: "destructive"
      });
    }
  };

  // قطع الاتصال
  const disconnect = () => {
    if (websocket) {
      websocket.close();
      setWebsocket(null);
    }
    setConfig(prev => ({ ...prev, isConnected: false, isProcessing: false }));
  };

  // بدء المعالجة
  const startProcessing = async () => {
    try {
      const response = await fetch(`${config.serverUrl}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          roi_points: [], // سيتم تمريرها من ROI Setup
          counting_lines: []
        })
      });
      
      if (response.ok) {
        setConfig(prev => ({ ...prev, isProcessing: true }));
        toast({
          title: "🚀 بدأت المعالجة",
          description: "تم بدء نظام كشف المركبات",
        });
      }
    } catch (error) {
      toast({
        title: "فشل في بدء المعالجة",
        description: "تأكد من تشغيل سيرفر Python",
        variant: "destructive"
      });
    }
  };

  // إيقاف المعالجة
  const stopProcessing = async () => {
    try {
      const response = await fetch(`${config.serverUrl}/stop`, {
        method: 'POST'
      });
      
      if (response.ok) {
        setConfig(prev => ({ ...prev, isProcessing: false }));
        toast({
          title: "⏹️ تم إيقاف المعالجة",
          description: "تم إيقاف نظام كشف المركبات",
        });
      }
    } catch (error) {
      toast({
        title: "فشل في إيقاف المعالجة",
        description: "حدث خطأ أثناء إيقاف النظام",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Connection Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <Server className="h-6 w-6 text-primary" />
            <span>إعدادات الاتصال مع Python</span>
            <Badge variant={config.isConnected ? "default" : "secondary"} className={
              config.isConnected ? "bg-success text-success-foreground" : ""
            }>
              {config.isConnected ? <CheckCircle className="h-4 w-4 mr-1" /> : <AlertCircle className="h-4 w-4 mr-1" />}
              {config.isConnected ? "متصل" : "غير متصل"}
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="serverUrl">رابط السيرفر</Label>
              <Input
                id="serverUrl"
                value={config.serverUrl}
                onChange={(e) => setConfig(prev => ({ ...prev, serverUrl: e.target.value }))}
                placeholder="http://localhost:8000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="websocketUrl">رابط WebSocket</Label>
              <Input
                id="websocketUrl"
                value={config.websocketUrl}
                onChange={(e) => setConfig(prev => ({ ...prev, websocketUrl: e.target.value }))}
                placeholder="ws://localhost:8001"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3 mt-4">
            <Button
              onClick={config.isConnected ? disconnect : connectWebSocket}
              variant={config.isConnected ? "destructive" : "default"}
            >
              {config.isConnected ? <WifiOff className="h-4 w-4 mr-2" /> : <Wifi className="h-4 w-4 mr-2" />}
              {config.isConnected ? "قطع الاتصال" : "اتصال"}
            </Button>
            
            {config.isConnected && (
              <Button
                onClick={config.isProcessing ? stopProcessing : startProcessing}
                variant={config.isProcessing ? "destructive" : "default"}
                className={config.isProcessing ? "" : "bg-success hover:bg-success/90"}
              >
                {config.isProcessing ? <Square className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {config.isProcessing ? "إيقاف المعالجة" : "بدء المعالجة"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Live Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <Database className="h-6 w-6 text-primary" />
            <span>الإحصائيات المباشرة</span>
            <Badge variant="secondary" className={
              config.isConnected ? "bg-success/10 text-success animate-pulse" : ""
            }>
              {config.isConnected ? "مباشر" : "متوقف"}
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {liveStats.totalVehicles}
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400">إجمالي المركبات</div>
            </div>
            
            <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                {liveStats.currentSeatsInside}
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">المقاعد الحالية</div>
            </div>
            
            <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
              <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                {liveStats.incomingVehicles}
              </div>
              <div className="text-sm text-orange-600 dark:text-orange-400">داخل</div>
            </div>
            
            <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg">
              <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                {liveStats.outgoingVehicles}
              </div>
              <div className="text-sm text-red-600 dark:text-red-400">خارج</div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">دقة الكشف</div>
              <div className="text-lg font-bold">{liveStats.detectionAccuracy.toFixed(1)}%</div>
            </div>
            
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">زمن المعالجة</div>
              <div className="text-lg font-bold">{liveStats.processingTime}ms</div>
            </div>
            
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">آخر تحديث</div>
              <div className="text-lg font-bold text-xs">{liveStats.lastUpdate}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Python Integration Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <Code className="h-6 w-6 text-primary" />
            <span>دليل التكامل مع Python</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-2">خطوات تشغيل السيرفر المحلي:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>تأكد من تثبيت Python و FastAPI</li>
              <li>انسخ كود Python الموجود لديك</li>
              <li>أضف FastAPI endpoints للتحكم</li>
              <li>أضف WebSocket للبيانات المباشرة</li>
              <li>شغل السيرفر: <code className="bg-black text-green-400 px-2 py-1 rounded">python server.py</code></li>
            </ol>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 text-blue-700 dark:text-blue-300">المطلوب من كود Python:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-blue-600 dark:text-blue-400">
              <li>FastAPI server على المنفذ 8000</li>
              <li>WebSocket server على المنفذ 8001</li>
              <li>Endpoints: /start, /stop, /config</li>
              <li>إرسال البيانات المباشرة عبر WebSocket</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}