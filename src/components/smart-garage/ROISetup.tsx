import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MousePointer, 
  Save, 
  RotateCcw, 
  Video, 
  Settings,
  Target,
  Play,
  Pause
} from "lucide-react";

interface ROIPoint {
  x: number;
  y: number;
}

interface CountingLine {
  name: string;
  direction: "incoming" | "outgoing";
  points: ROIPoint[];
}

interface ROISetupProps {
  onROIComplete?: (roi: ROIPoint[], lines: CountingLine[]) => void;
  videoSrc?: string;
}

export function ROISetup({ onROIComplete, videoSrc }: ROISetupProps) {
  const [roiPoints, setROIPoints] = useState<ROIPoint[]>([]);
  const [countingLines, setCountingLines] = useState<CountingLine[]>([]);
  const [currentSetupMode, setCurrentSetupMode] = useState<"ROI" | "LINE1" | "LINE2" | "DONE">("ROI");
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const setupSteps = [
    { mode: "ROI", title: "تحديد منطقة الاهتمام", description: "انقر على 4 نقاط لتحديد ROI", color: "blue" },
    { mode: "LINE1", title: "خط العد - الداخل", description: "انقر على نقطتين لخط الدخول", color: "orange" },
    { mode: "LINE2", title: "خط العد - الخارج", description: "انقر على نقطتين لخط الخروج", color: "yellow" },
    { mode: "DONE", title: "اكتمل الإعداد", description: "جميع الإعدادات جاهزة", color: "green" }
  ];

  const getCurrentStep = () => {
    return setupSteps.find(step => step.mode === currentSetupMode) || setupSteps[0];
  };

  const handleVideoClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // تحويل إحداثيات النقر إلى نسب مئوية
    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;
    
    const newPoint: ROIPoint = { x: percentX, y: percentY };

    if (currentSetupMode === "ROI") {
      if (roiPoints.length < 4) {
        setROIPoints([...roiPoints, newPoint]);
        if (roiPoints.length === 3) {
          setCurrentSetupMode("LINE1");
          setCountingLines([{ name: "incoming", direction: "incoming", points: [] }]);
        }
      }
    } else if (currentSetupMode === "LINE1") {
      const updatedLines = [...countingLines];
      if (updatedLines[0].points.length < 2) {
        updatedLines[0].points.push(newPoint);
        setCountingLines(updatedLines);
        if (updatedLines[0].points.length === 2) {
          setCurrentSetupMode("LINE2");
          setCountingLines([...updatedLines, { name: "outgoing", direction: "outgoing", points: [] }]);
        }
      }
    } else if (currentSetupMode === "LINE2") {
      const updatedLines = [...countingLines];
      if (updatedLines[1].points.length < 2) {
        updatedLines[1].points.push(newPoint);
        setCountingLines(updatedLines);
        if (updatedLines[1].points.length === 2) {
          setCurrentSetupMode("DONE");
        }
      }
    }
  };

  const resetSetup = () => {
    setROIPoints([]);
    setCountingLines([]);
    setCurrentSetupMode("ROI");
  };

  const saveSetup = () => {
    if (onROIComplete && roiPoints.length === 4 && countingLines.length === 2) {
      onROIComplete(roiPoints, countingLines);
    }
  };

  const getProgressPercent = () => {
    const totalSteps = setupSteps.length;
    const currentIndex = setupSteps.findIndex(step => step.mode === currentSetupMode);
    return ((currentIndex + 1) / totalSteps) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Header with Progress */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-3">
              <Target className="h-6 w-6 text-primary" />
              <span>إعداد منطقة الكشف والعد</span>
            </CardTitle>
            
            <div className="flex items-center space-x-3">
              <Badge variant="secondary">
                الخطوة {setupSteps.findIndex(s => s.mode === currentSetupMode) + 1} من {setupSteps.length}
              </Badge>
              
              <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${getProgressPercent()}%` }}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {setupSteps.map((step, index) => (
              <div 
                key={step.mode}
                className={`p-3 rounded-lg border-2 transition-all ${
                  step.mode === currentSetupMode 
                    ? 'border-primary bg-primary/10' 
                    : 'border-muted bg-muted/30'
                }`}
              >
                <div className="text-sm font-medium">{step.title}</div>
                <div className="text-xs text-muted-foreground mt-1">{step.description}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Video Setup Area */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-3">
              <Video className="h-5 w-5" />
              <span>إعداد الفيديو</span>
            </CardTitle>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsVideoPlaying(!isVideoPlaying)}
              >
                {isVideoPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isVideoPlaying ? "إيقاف" : "تشغيل"}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={resetSetup}
                disabled={roiPoints.length === 0 && countingLines.length === 0}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                إعادة تعيين
              </Button>
              
              <Button
                onClick={saveSetup}
                disabled={currentSetupMode !== "DONE"}
                className="bg-success hover:bg-success/90"
              >
                <Save className="h-4 w-4 mr-2" />
                حفظ الإعداد
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {/* Current Step Instructions */}
            <div className={`p-4 rounded-lg border-2 border-dashed ${
              currentSetupMode === "DONE" ? 'border-success bg-success/10' : 'border-primary bg-primary/10'
            }`}>
              <div className="flex items-center space-x-3">
                <MousePointer className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">{getCurrentStep().title}</div>
                  <div className="text-sm text-muted-foreground">{getCurrentStep().description}</div>
                </div>
              </div>
            </div>

            {/* Video Container */}
            <div className="relative bg-black rounded-lg overflow-hidden">
              <div 
                className="relative w-full aspect-video bg-gradient-to-br from-slate-800 to-slate-900 cursor-crosshair"
                onClick={handleVideoClick}
              >
                {/* Placeholder for video - in real implementation, this would be actual video */}
                <div className="absolute inset-0 flex items-center justify-center text-white/60">
                  <div className="text-center">
                    <Video className="h-16 w-16 mx-auto mb-4" />
                    <div className="text-lg font-medium">منطقة الفيديو</div>
                    <div className="text-sm">انقر لتحديد النقاط</div>
                  </div>
                </div>

                {/* Draw ROI Points */}
                {roiPoints.map((point, index) => (
                  <div
                    key={index}
                    className="absolute w-3 h-3 bg-blue-500 rounded-full border-2 border-white transform -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${point.x}%`, top: `${point.y}%` }}
                    title={`ROI نقطة ${index + 1}`}
                  />
                ))}

                {/* Draw ROI Lines */}
                {roiPoints.length > 1 && (
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {roiPoints.map((point, index) => {
                      const nextIndex = (index + 1) % roiPoints.length;
                      if (index === roiPoints.length - 1 && roiPoints.length < 4) return null;
                      return (
                        <line
                          key={index}
                          x1={`${point.x}%`}
                          y1={`${point.y}%`}
                          x2={`${roiPoints[nextIndex].x}%`}
                          y2={`${roiPoints[nextIndex].y}%`}
                          stroke="#3b82f6"
                          strokeWidth="2"
                          strokeDasharray="5,5"
                        />
                      );
                    })}
                  </svg>
                )}

                {/* Draw Counting Lines */}
                {countingLines.map((line, lineIndex) => (
                  <g key={lineIndex}>
                    {line.points.map((point, pointIndex) => (
                      <div
                        key={pointIndex}
                        className={`absolute w-3 h-3 rounded-full border-2 border-white transform -translate-x-1/2 -translate-y-1/2 ${
                          line.direction === "incoming" ? "bg-orange-500" : "bg-yellow-500"
                        }`}
                        style={{ left: `${point.x}%`, top: `${point.y}%` }}
                        title={`${line.direction} خط ${pointIndex + 1}`}
                      />
                    ))}
                    
                    {line.points.length === 2 && (
                      <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        <line
                          x1={`${line.points[0].x}%`}
                          y1={`${line.points[0].y}%`}
                          x2={`${line.points[1].x}%`}
                          y2={`${line.points[1].y}%`}
                          stroke={line.direction === "incoming" ? "#f97316" : "#eab308"}
                          strokeWidth="3"
                        />
                        <text
                          x={`${(line.points[0].x + line.points[1].x) / 2}%`}
                          y={`${(line.points[0].y + line.points[1].y) / 2}%`}
                          fill={line.direction === "incoming" ? "#f97316" : "#eab308"}
                          fontSize="14"
                          textAnchor="middle"
                          className="font-bold"
                        >
                          {line.direction === "incoming" ? "دخول" : "خروج"}
                        </text>
                      </svg>
                    )}
                  </g>
                ))}
              </div>
            </div>

            {/* Status Summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">منطقة الاهتمام</div>
                <div className="text-lg font-bold text-blue-700 dark:text-blue-300">{roiPoints.length}/4 نقاط</div>
              </div>
              
              <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                <div className="text-sm text-orange-600 dark:text-orange-400 font-medium">خط الدخول</div>
                <div className="text-lg font-bold text-orange-700 dark:text-orange-300">
                  {countingLines[0]?.points.length || 0}/2 نقاط
                </div>
              </div>
              
              <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                <div className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">خط الخروج</div>
                <div className="text-lg font-bold text-yellow-700 dark:text-yellow-300">
                  {countingLines[1]?.points.length || 0}/2 نقاط
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}