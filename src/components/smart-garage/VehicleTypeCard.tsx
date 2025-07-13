import { Card } from "@/components/ui/card";
import { Car, Bus, Truck, Bike } from "lucide-react";

interface VehicleTypeCardProps {
  type: "small-car" | "suv" | "minivan" | "fullbus";
  label: string;
  count: number;
  totalSeats: number;
  isActive?: boolean;
  onClick?: () => void;
}

const vehicleIcons = {
  "small-car": Car,
  "suv": Car,
  "minivan": Bus,
  "fullbus": Truck
};

const vehicleColors = {
  "small-car": "text-vehicle-small-car",
  "suv": "text-vehicle-suv", 
  "minivan": "text-vehicle-minivan",
  "fullbus": "text-vehicle-fullbus"
};

const vehicleBgColors = {
  "small-car": "bg-vehicle-small-car/10 hover:bg-vehicle-small-car/20",
  "suv": "bg-vehicle-suv/10 hover:bg-vehicle-suv/20",
  "minivan": "bg-vehicle-minivan/10 hover:bg-vehicle-minivan/20", 
  "fullbus": "bg-vehicle-fullbus/10 hover:bg-vehicle-fullbus/20"
};

export function VehicleTypeCard({ 
  type, 
  label, 
  count, 
  totalSeats, 
  isActive = false,
  onClick 
}: VehicleTypeCardProps) {
  const Icon = vehicleIcons[type];
  
  return (
    <Card 
      className={`
        p-4 cursor-pointer transition-all duration-300 border-2
        ${vehicleBgColors[type]}
        ${isActive 
          ? `border-${type === 'small-car' ? 'yellow-500' : type === 'suv' ? 'blue-500' : type === 'minivan' ? 'green-500' : 'purple-500'} shadow-glow` 
          : 'border-border hover:border-primary/30'
        }
        hover:shadow-md hover:-translate-y-1
      `}
      onClick={onClick}
    >
      <div className="flex flex-col items-center space-y-3">
        <div className={`p-3 rounded-full ${vehicleBgColors[type]}`}>
          <Icon className={`h-8 w-8 ${vehicleColors[type]}`} />
        </div>
        
        <div className="text-center space-y-1">
          <h3 className="font-semibold text-sm text-foreground">{label}</h3>
          <div className="space-y-1">
            <p className="text-lg font-bold text-foreground">{count}</p>
            <p className="text-xs text-muted-foreground">{totalSeats} مقعد</p>
          </div>
        </div>
      </div>
    </Card>
  );
}