import { Card } from "@/components/ui/card";
import { MapPin, Navigation } from "lucide-react";

export function LocationMap() {
  return (
    <Card className="p-4 bg-gradient-card border-border/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">الموقع</h3>
        <Navigation className="h-5 w-5 text-primary" />
      </div>
      
      <div className="relative w-full h-48 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg overflow-hidden border border-border/30">
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
            {Array.from({ length: 48 }).map((_, i) => (
              <div key={i} className="border border-primary/20" />
            ))}
          </div>
        </div>
        
        {/* Roads */}
        <div className="absolute inset-0">
          {/* Main Road Horizontal */}
          <div className="absolute top-1/2 left-0 right-0 h-8 bg-muted/40 transform -translate-y-1/2" />
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-warning transform -translate-y-1/2" />
          
          {/* Main Road Vertical */}
          <div className="absolute left-1/2 top-0 bottom-0 w-8 bg-muted/40 transform -translate-x-1/2" />
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-warning transform -translate-x-1/2" />
        </div>

        {/* Garage Location */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            {/* Pulse Animation */}
            <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-30" />
            <div className="relative bg-primary p-3 rounded-full shadow-glow">
              <MapPin className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
        </div>

        {/* Location Label */}
        <div className="absolute bottom-4 left-4">
          <div className="bg-card/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md border border-border/50">
            <p className="text-sm font-medium text-foreground">كراج وسط المدينة</p>
            <p className="text-xs text-muted-foreground">شارع الملك فهد, الرياض</p>
          </div>
        </div>

        {/* Distance Indicator */}
        <div className="absolute top-4 right-4">
          <div className="bg-primary/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md">
            <p className="text-xs text-primary-foreground font-medium">2.5 كم من موقعك</p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
        <span>آخر تحديث: قبل دقيقتين</span>
        <span>دقة GPS: 5 متر</span>
      </div>
    </Card>
  );
}