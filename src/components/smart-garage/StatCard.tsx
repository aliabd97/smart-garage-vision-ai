import { Card } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: "increase" | "decrease" | "neutral";
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({ 
  title, 
  value, 
  change, 
  changeType = "neutral", 
  icon,
  className 
}: StatCardProps) {
  const getChangeColor = () => {
    switch (changeType) {
      case "increase":
        return "text-success";
      case "decrease":
        return "text-danger";
      default:
        return "text-muted-foreground";
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case "increase":
        return <ArrowUp className="h-4 w-4" />;
      case "decrease":
        return <ArrowDown className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Card className={cn("p-6 bg-gradient-card border-border/50 hover:shadow-md transition-all duration-300", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-center space-x-2">
            <h3 className="text-3xl font-bold text-foreground">{value}</h3>
            {change !== undefined && (
              <div className={cn("flex items-center space-x-1 text-sm", getChangeColor())}>
                {getChangeIcon()}
                <span>{Math.abs(change)}</span>
              </div>
            )}
          </div>
        </div>
        {icon && (
          <div className="p-3 bg-primary/10 rounded-full">
            <div className="text-primary">{icon}</div>
          </div>
        )}
      </div>
    </Card>
  );
}