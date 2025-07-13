import { useState, useEffect } from "react";
import { VehicleTypeCard } from "./VehicleTypeCard";
import { StatCard } from "./StatCard";
import { GarageView } from "./GarageView";
import { LocationMap } from "./LocationMap";
import { LiveChart } from "./LiveChart";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  ArrowUp, 
  ArrowDown, 
  Activity, 
  Clock,
  BarChart3,
  Zap,
  Bell,
  Download
} from "lucide-react";

interface VehicleStats {
  smallCar: { count: number; totalSeats: number };
  suv: { count: number; totalSeats: number };
  minivan: { count: number; totalSeats: number };
  fullbus: { count: number; totalSeats: number };
}

interface TrafficData {
  entered: number;
  exited: number;
  currentInside: number;
  totalSeats: number;
}

export function SmartGarageDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedVehicleType, setSelectedVehicleType] = useState<string | null>(null);

  // Simulate real-time updates
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Mock data - in real app this would come from AI detection system
  const vehicleStats: VehicleStats = {
    smallCar: { count: 18, totalSeats: 72 },
    suv: { count: 8, totalSeats: 56 },
    minivan: { count: 3, totalSeats: 45 },
    fullbus: { count: 1, totalSeats: 45 }
  };

  const trafficData: TrafficData = {
    entered: 76,
    exited: 51,
    currentInside: 25,
    totalSeats: 134
  };

  // Chart data
  const seatAvailabilityData = [
    { name: '6', value: 80 },
    { name: '8', value: 95 },
    { name: '10', value: 120 },
    { name: '12', value: 110 },
    { name: '14', value: 134 },
    { name: '16', value: 145 }
  ];

  const vehicleTypesData = [
    { name: 'سيارات صغيرة', value: vehicleStats.smallCar.count },
    { name: 'SUV', value: vehicleStats.suv.count },
    { name: 'ميني فان', value: vehicleStats.minivan.count },
    { name: 'باصات', value: vehicleStats.fullbus.count }
  ];

  const entriesExitsData = [
    { name: '6', value: 5 },
    { name: '8', value: 12 },
    { name: '10', value: 8 },
    { name: '12', value: 15 },
    { name: '14', value: 20 },
    { name: '16', value: 18 },
    { name: '18', value: 25 },
    { name: '20', value: 22 },
    { name: '22', value: 28 },
    { name: '24', value: 15 }
  ];

  return (
    <div className="flex-1 space-y-6 p-6 bg-gradient-subtle min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">لوحة تحكم الكراجات الذكية</h1>
          <p className="text-muted-foreground mt-1">
            آخر تحديث: {currentTime.toLocaleTimeString('ar-SA')}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
            <Activity className="h-4 w-4 mr-2" />
            النظام يعمل بشكل طبيعي
          </Badge>
          
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            تصدير التقرير
          </Button>
          
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Vehicle Types Row */}
      <div className="grid grid-cols-4 gap-4">
        <VehicleTypeCard
          type="small-car"
          label="سيارات صغيرة"
          count={vehicleStats.smallCar.count}
          totalSeats={vehicleStats.smallCar.totalSeats}
          isActive={selectedVehicleType === "small-car"}
          onClick={() => setSelectedVehicleType(
            selectedVehicleType === "small-car" ? null : "small-car"
          )}
        />
        <VehicleTypeCard
          type="suv"
          label="SUV"
          count={vehicleStats.suv.count}
          totalSeats={vehicleStats.suv.totalSeats}
          isActive={selectedVehicleType === "suv"}
          onClick={() => setSelectedVehicleType(
            selectedVehicleType === "suv" ? null : "suv"
          )}
        />
        <VehicleTypeCard
          type="minivan"
          label="ميني فان"
          count={vehicleStats.minivan.count}
          totalSeats={vehicleStats.minivan.totalSeats}
          isActive={selectedVehicleType === "minivan"}
          onClick={() => setSelectedVehicleType(
            selectedVehicleType === "minivan" ? null : "minivan"
          )}
        />
        <VehicleTypeCard
          type="fullbus"
          label="باصات كاملة"
          count={vehicleStats.fullbus.count}
          totalSeats={vehicleStats.fullbus.totalSeats}
          isActive={selectedVehicleType === "fullbus"}
          onClick={() => setSelectedVehicleType(
            selectedVehicleType === "fullbus" ? null : "fullbus"
          )}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Garage View */}
        <div className="col-span-8">
          <GarageView garageName="كراج وسط المدينة" isLive={true} />
        </div>

        {/* Right Column - Stats and Info */}
        <div className="col-span-4 space-y-6">
          {/* Seat Availability - Large Display */}
          <Card className="p-6 bg-gradient-primary text-primary-foreground text-center">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold opacity-90">المقاعد المتاحة</h3>
              <div className="text-5xl font-bold">{trafficData.totalSeats}</div>
              <p className="text-sm opacity-75">إجمالي السعة الحالية</p>
            </div>
          </Card>

          {/* Traffic Stats */}
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              title="دخلوا"
              value={trafficData.entered}
              change={76}
              changeType="increase"
              icon={<ArrowUp className="h-5 w-5" />}
            />
            <StatCard
              title="خرجوا"
              value={trafficData.exited}
              change={51}
              changeType="decrease"
              icon={<ArrowDown className="h-5 w-5" />}
            />
          </div>

          {/* Location Map */}
          <LocationMap />
        </div>
      </div>

      {/* Bottom Charts Section */}
      <div className="grid grid-cols-3 gap-6">
        <LiveChart
          type="line"
          title="توفر المقاعد"
          data={seatAvailabilityData}
          color="hsl(var(--primary))"
        />
        
        <LiveChart
          type="pie"
          title="أنواع المركبات"
          data={vehicleTypesData}
        />
        
        <LiveChart
          type="bar"
          title="الدخول والخروج"
          data={entriesExitsData}
          color="hsl(var(--success))"
        />
      </div>

      {/* System Performance Footer */}
      <Card className="p-4 bg-card-elevated border-border/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-success" />
              <span className="text-sm font-medium text-foreground">أداء النظام</span>
            </div>
            <Badge variant="secondary" className="bg-success/10 text-success">
              ممتاز
            </Badge>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <div>
              <span>دقة الكشف: </span>
              <span className="font-medium text-foreground">95.2%</span>
            </div>
            <div>
              <span>زمن المعالجة: </span>
              <span className="font-medium text-foreground">18ms</span>
            </div>
            <div>
              <span>وقت التشغيل: </span>
              <span className="font-medium text-foreground">24 ساعة</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{currentTime.toLocaleTimeString('ar-SA')}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}