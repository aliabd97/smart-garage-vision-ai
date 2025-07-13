import { SimpleChart } from "@/components/ui/simple-chart";

interface LiveChartProps {
  type: "line" | "bar" | "pie";
  title: string;
  data: any[];
  color?: string;
}

export function LiveChart({ type, title, data, color = "hsl(var(--primary))" }: LiveChartProps) {
  return (
    <SimpleChart 
      type={type}
      title={title}
      data={data}
      color={color}
    />
  );
}