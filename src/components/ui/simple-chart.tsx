import { Card } from "@/components/ui/card";

interface ChartData {
  name: string;
  value: number;
}

interface SimpleChartProps {
  type: "line" | "bar" | "pie";
  title: string;
  data: ChartData[];
  color?: string;
}

export function SimpleChart({ type, title, data, color = "#3b82f6" }: SimpleChartProps) {
  const colors = ['hsl(var(--vehicle-small-car))', 'hsl(var(--vehicle-suv))', 'hsl(var(--vehicle-minivan))', 'hsl(var(--vehicle-fullbus))'];

  const renderBarChart = () => {
    const maxValue = Math.max(...data.map(d => d.value));
    
    return (
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center space-x-3">
            <span className="text-xs w-8 text-muted-foreground">{item.name}</span>
            <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
              <div 
                className="h-full transition-all duration-300 rounded-full"
                style={{ 
                  width: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: color
                }}
              />
            </div>
            <span className="text-sm font-medium w-8 text-foreground">{item.value}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderLineChart = () => {
    const maxValue = Math.max(...data.map(d => d.value));
    const points = data.map((item, index) => {
      const x = (index / (data.length - 1)) * 200;
      const y = 100 - (item.value / maxValue) * 80;
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="space-y-4">
        <svg width="100%" height="120" viewBox="0 0 200 100" className="border border-border/20 rounded">
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="2"
            points={points}
          />
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 200;
            const y = 100 - (item.value / maxValue) * 80;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="3"
                fill={color}
              />
            );
          })}
        </svg>
        <div className="flex justify-between text-xs text-muted-foreground">
          {data.map(item => (
            <span key={item.name}>{item.name}</span>
          ))}
        </div>
      </div>
    );
  };

  const renderPieChart = () => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let cumulativePercentage = 0;

    return (
      <div className="space-y-4">
        <div className="flex justify-center">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="2"
            />
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const startAngle = (cumulativePercentage / 100) * 360;
              const endAngle = ((cumulativePercentage + percentage) / 100) * 360;
              
              const startX = 60 + 50 * Math.cos((startAngle - 90) * Math.PI / 180);
              const startY = 60 + 50 * Math.sin((startAngle - 90) * Math.PI / 180);
              const endX = 60 + 50 * Math.cos((endAngle - 90) * Math.PI / 180);
              const endY = 60 + 50 * Math.sin((endAngle - 90) * Math.PI / 180);
              
              const largeArcFlag = percentage > 50 ? 1 : 0;
              
              const pathData = [
                `M 60 60`,
                `L ${startX} ${startY}`,
                `A 50 50 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                'Z'
              ].join(' ');

              cumulativePercentage += percentage;

              return (
                <path
                  key={index}
                  d={pathData}
                  fill={colors[index % colors.length]}
                  opacity={0.8}
                />
              );
            })}
          </svg>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {data.map((item, index) => (
            <div key={item.name} className="flex items-center space-x-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="text-foreground">{item.name}</span>
              <span className="text-muted-foreground">({item.value})</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className="p-4 bg-gradient-card border-border/50">
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      {type === "bar" && renderBarChart()}
      {type === "line" && renderLineChart()}
      {type === "pie" && renderPieChart()}
    </Card>
  );
}