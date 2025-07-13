import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Pause, Camera, Settings } from "lucide-react";
import { useState } from "react";

interface DetectedVehicle {
  id: string;
  type: string;
  seats: number;
  x: number;
  y: number;
  confidence: number;
}

interface GarageViewProps {
  garageName: string;
  isLive?: boolean;
  detectedVehicles?: DetectedVehicle[];
}

export function GarageView({ 
  garageName = "Downtown Lot", 
  isLive = true,
  detectedVehicles = []
}: GarageViewProps) {
  const [isPlaying, setIsPlaying] = useState(isLive);
  
  // محاكاة بيانات المركبات المكتشفة
  const mockVehicles: DetectedVehicle[] = [
    { id: "1", type: "Small Car", seats: 4, x: 25, y: 35, confidence: 0.95 },
    { id: "2", type: "SUV-17", seats: 7, x: 45, y: 40, confidence: 0.88 },
    { id: "3", type: "Mini-Van(15)", seats: 15, x: 65, y: 45, confidence: 0.92 },
  ];

  const vehicles = detectedVehicles.length > 0 ? detectedVehicles : mockVehicles;

  const getVehicleColor = (type: string) => {
    if (type.includes("Small Car")) return "bg-vehicle-small-car text-white";
    if (type.includes("SUV")) return "bg-vehicle-suv text-white";
    if (type.includes("Mini-Van")) return "bg-vehicle-minivan text-white";
    if (type.includes("Bus")) return "bg-vehicle-fullbus text-white";
    return "bg-primary text-primary-foreground";
  };

  return (
    <Card className="relative overflow-hidden bg-gradient-card border-border/50">
      {/* Header */}
      <div className="absolute top-4 left-4 z-10 flex items-center space-x-3">
        <Badge 
          variant="secondary" 
          className="bg-black/70 text-white border-0 backdrop-blur-sm"
        >
          {garageName}
        </Badge>
        {isLive && (
          <Badge 
            variant="secondary" 
            className="bg-danger/90 text-danger-foreground border-0 backdrop-blur-sm animate-pulse"
          >
            🔴 مباشر
          </Badge>
        )}
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex space-x-2">
        <Button
          variant="secondary"
          size="sm"
          className="bg-black/70 hover:bg-black/80 text-white border-0 backdrop-blur-sm"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Button
          variant="secondary"
          size="sm" 
          className="bg-black/70 hover:bg-black/80 text-white border-0 backdrop-blur-sm"
        >
          <Camera className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="bg-black/70 hover:bg-black/80 text-white border-0 backdrop-blur-sm"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      {/* Garage Area */}
      <div 
        className="relative w-full h-80 bg-gradient-to-br from-muted/30 to-muted/60 bg-cover bg-center"
        style={{
          backgroundImage: `url('/lovable-uploads/cd2e53e8-926d-476e-b0b6-51cc1dbbb031.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Overlay for better visibility */}
        <div className="absolute inset-0 bg-black/20" />
        
        {/* ROI Area Outline */}
        <div className="absolute inset-4 border-2 border-primary/60 border-dashed rounded-lg bg-primary/5">
          <Badge 
            variant="secondary" 
            className="absolute -top-3 left-4 bg-primary text-primary-foreground border-0"
          >
            منطقة المراقبة
          </Badge>
        </div>

        {/* Detected Vehicles */}
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${vehicle.x}%`,
              top: `${vehicle.y}%`,
            }}
          >
            {/* Vehicle Detection Box */}
            <div className="relative">
              <div className="absolute -inset-2 border-2 border-white/80 rounded-sm bg-black/20 backdrop-blur-sm" />
              <Badge 
                className={`${getVehicleColor(vehicle.type)} text-xs font-medium whitespace-nowrap shadow-lg`}
              >
                {vehicle.type}
              </Badge>
              {/* Confidence indicator */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                <div className="bg-black/70 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                  {Math.round(vehicle.confidence * 100)}%
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Counting Lines */}
        <div className="absolute bottom-16 left-8 right-8">
          {/* Incoming Line */}
          <div className="relative">
            <div className="h-1 bg-vehicle-suv rounded-full opacity-80" />
            <Badge 
              variant="secondary" 
              className="absolute -top-6 left-0 bg-vehicle-suv text-white border-0 text-xs"
            >
              خط الدخول
            </Badge>
          </div>
        </div>

        <div className="absolute bottom-8 left-8 right-8">
          {/* Outgoing Line */}
          <div className="relative">
            <div className="h-1 bg-warning rounded-full opacity-80" />
            <Badge 
              variant="secondary" 
              className="absolute -bottom-6 left-0 bg-warning text-warning-foreground border-0 text-xs"
            >
              خط الخروج
            </Badge>
          </div>
        </div>

        {/* Processing Status */}
        <div className="absolute bottom-4 right-4">
          <Badge 
            variant="secondary" 
            className="bg-success/90 text-success-foreground border-0 backdrop-blur-sm"
          >
            ✅ النظام يعمل
          </Badge>
        </div>
      </div>
    </Card>
  );
}