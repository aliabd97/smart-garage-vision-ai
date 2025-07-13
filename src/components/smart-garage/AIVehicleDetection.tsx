import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Camera, Download, Settings, AlertTriangle } from "lucide-react";

interface DetectedVehicle {
  id: string;
  type: "small-car" | "suv" | "minivan" | "fullbus";
  confidence: number;
  bbox: [number, number, number, number]; // x, y, width, height
  seats: number;
  timestamp: number;
}

interface AIVehicleDetectionProps {
  onVehicleDetected?: (vehicle: DetectedVehicle) => void;
  onTrafficCount?: (incoming: number, outgoing: number) => void;
}

export function AIVehicleDetection({ 
  onVehicleDetected, 
  onTrafficCount 
}: AIVehicleDetectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedVehicles, setDetectedVehicles] = useState<DetectedVehicle[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fps, setFps] = useState(0);

  // Initialize camera stream
  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setError(null);
    } catch (err) {
      setError("لا يمكن الوصول للكاميرا. تأكد من إعطاء الإذن.");
      console.error("Camera access error:", err);
    }
  };

  // Process video frame (placeholder for AI model integration)
  const processFrame = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    // Draw current frame to canvas
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    // TODO: Integrate with AI model (TensorFlow.js, ONNX.js, or WebAssembly)
    // This is where you would:
    // 1. Convert canvas to tensor
    // 2. Run YOLO/detection model
    // 3. Parse results and update detections
    
    // Simulate detection for demo
    simulateDetection();
  };

  // Simulate vehicle detection (replace with real AI inference)
  const simulateDetection = () => {
    const mockDetections: DetectedVehicle[] = [
      {
        id: `vehicle_${Date.now()}_1`,
        type: "small-car",
        confidence: 0.95,
        bbox: [100, 150, 80, 120],
        seats: 4,
        timestamp: Date.now()
      },
      {
        id: `vehicle_${Date.now()}_2`,
        type: "suv",
        confidence: 0.88,
        bbox: [300, 200, 100, 140],
        seats: 7,
        timestamp: Date.now()
      }
    ];

    setDetectedVehicles(mockDetections);
    
    // Notify parent component
    mockDetections.forEach(vehicle => {
      onVehicleDetected?.(vehicle);
    });

    // Simulate traffic counting
    onTrafficCount?.(Math.floor(Math.random() * 5), Math.floor(Math.random() * 3));
  };

  // Start/stop processing
  const toggleProcessing = () => {
    setIsProcessing(!isProcessing);
  };

  // Processing loop
  useEffect(() => {
    let animationId: number;
    let lastTime = 0;
    let frameCount = 0;

    const loop = (currentTime: number) => {
      if (currentTime - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = currentTime;
      }
      
      if (isProcessing) {
        processFrame();
        frameCount++;
      }
      
      animationId = requestAnimationFrame(loop);
    };

    if (isProcessing) {
      animationId = requestAnimationFrame(loop);
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isProcessing]);

  // Initialize on mount
  useEffect(() => {
    initializeCamera();
    
    return () => {
      // Cleanup camera stream
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const getVehicleTypeLabel = (type: string) => {
    const labels = {
      "small-car": "سيارة صغيرة",
      "suv": "SUV",
      "minivan": "ميني فان",
      "fullbus": "باص"
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <Card className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">كشف المركبات بالذكاء الاصطناعي</h3>
          <p className="text-sm text-muted-foreground">
            {isProcessing ? `معالجة مباشرة - ${fps} FPS` : "متوقف"}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {error && (
            <Badge variant="destructive" className="mr-2">
              <AlertTriangle className="h-3 w-3 mr-1" />
              خطأ
            </Badge>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={toggleProcessing}
            disabled={!!error}
          >
            {isProcessing ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                إيقاف
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                تشغيل
              </>
            )}
          </Button>
          
          <Button variant="outline" size="sm">
            <Camera className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
          <div className="flex items-center space-x-2 text-destructive">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">{error}</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2"
            onClick={initializeCamera}
          >
            إعادة المحاولة
          </Button>
        </div>
      )}

      {/* Video Display */}
      <div className="relative bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-64 object-cover"
        />
        
        {/* Hidden canvas for processing */}
        <canvas
          ref={canvasRef}
          className="hidden"
        />
        
        {/* Overlay for detections */}
        <div className="absolute inset-0 pointer-events-none">
          {detectedVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="absolute border-2 border-primary bg-primary/10"
              style={{
                left: `${(vehicle.bbox[0] / (canvasRef.current?.width || 1280)) * 100}%`,
                top: `${(vehicle.bbox[1] / (canvasRef.current?.height || 720)) * 100}%`,
                width: `${(vehicle.bbox[2] / (canvasRef.current?.width || 1280)) * 100}%`,
                height: `${(vehicle.bbox[3] / (canvasRef.current?.height || 720)) * 100}%`,
              }}
            >
              <Badge 
                className="absolute -top-6 left-0 bg-primary text-primary-foreground text-xs"
              >
                {getVehicleTypeLabel(vehicle.type)} ({Math.round(vehicle.confidence * 100)}%)
              </Badge>
            </div>
          ))}
        </div>

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-danger text-danger-foreground animate-pulse">
              🔴 مباشر
            </Badge>
          </div>
        )}
      </div>

      {/* AI Integration Instructions */}
      <div className="bg-muted/50 rounded-lg p-4 text-sm">
        <h4 className="font-medium mb-2">🤖 دمج الذكاء الاصطناعي</h4>
        <p className="text-muted-foreground mb-2">
          لتفعيل الكشف الحقيقي للمركبات، يمكنك دمج:
        </p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
          <li><strong>TensorFlow.js:</strong> لتشغيل نماذج YOLO في المتصفح</li>
          <li><strong>ONNX.js:</strong> لتشغيل نماذج PyTorch/ONNX</li>
          <li><strong>WebAssembly:</strong> لأداء أفضل مع OpenCV.js</li>
          <li><strong>MediaPipe:</strong> لكشف الكائنات من Google</li>
        </ul>
      </div>
    </Card>
  );
}