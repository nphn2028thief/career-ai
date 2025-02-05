"use client";

import { useEffect, useState } from "react";
import { Assessment } from "@prisma/client";
import { format } from "date-fns";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IPerformanceChart } from "@/types/interview";

function InterviewPerformanceChart({
  assessments,
}: {
  assessments: Assessment[];
}) {
  const [chartData, setChartData] = useState<IPerformanceChart[]>([]);

  useEffect(() => {
    if (assessments.length) {
      const formattedData: IPerformanceChart[] = assessments.map((item) => ({
        date: format(new Date(item.createdAt), "MMM dd"),
        score: item.quizScore,
      }));

      setChartData(formattedData);
    }
  }, [assessments]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="gradient-title text-3xl md:text-4xl">
          Performance trend
        </CardTitle>
        <CardDescription>Your quiz scores over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload?.length) {
                    return (
                      <div className="bg-background border rounded-lg p-2 space-y-1 shadow-md">
                        <p className="text-sm font-medium">
                          Score: {payload[0].value}%
                        </p>
                        <div className="text-xs text-muted-foreground">
                          {payload[0].payload.date}
                        </div>
                      </div>
                    );
                  }
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export default InterviewPerformanceChart;
