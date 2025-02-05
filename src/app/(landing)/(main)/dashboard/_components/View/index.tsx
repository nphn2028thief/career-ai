"use client";

import { useRef } from "react";
import {
  Brain,
  BriefcaseIcon,
  LineChart,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { DemandLevel, IndustryInsight, MarketOutlook } from "@prisma/client";
import { format, formatDistanceToNow } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { IMarketOutlookInfo, ISalary, ISalaryRange } from "@/types/dashboard";

interface IProps {
  industryInsight: IndustryInsight;
}

function DashboardView({ industryInsight }: IProps) {
  const salaryDataRef = useRef<ISalary[]>(
    (industryInsight.salaryRanges as unknown as ISalaryRange[]).map((item) => ({
      name: item.role,
      min: item.min / 1000,
      max: item.max / 1000,
      medium: item.medium / 1000,
    }))
  );
  const lastUpdatedDateRef = useRef<string>(
    format(new Date(industryInsight.lastUpdated), "dd/MM/yyyy")
  );
  const nextUpdateDistanceRef = useRef<string>(
    formatDistanceToNow(new Date(industryInsight.nextUpdated), {
      addSuffix: true,
    })
  );

  const getDemandLevelColor = (level: DemandLevel): string => {
    switch (level) {
      case DemandLevel.LOW:
        return "bg-red-500";
      case DemandLevel.MEDIUM:
        return "bg-yello-500";
      case DemandLevel.HIGH:
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getMarketOutlookInfo = (
    marketOutlook: MarketOutlook
  ): IMarketOutlookInfo => {
    switch (marketOutlook) {
      case MarketOutlook.POSITIVE:
        return { icon: TrendingUp, color: "text-green-500" };
      case MarketOutlook.NEUTRAL:
        return { icon: LineChart, color: "text-yellow-500" };
      case MarketOutlook.NEGATIVE:
        return { icon: TrendingDown, color: "text-red-500" };
      default:
        return { icon: LineChart, color: "text-gray-500" };
    }
  };

  const { icon: MarketOutLookIcon, color: marketOutlookColor } =
    getMarketOutlookInfo(industryInsight.marketOutlook);

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <Badge variant="outline" className="py-1">
          Last updated: {lastUpdatedDateRef.current}
        </Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Market outlook */}
        <Card>
          <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Market outlook
            </CardTitle>
            <MarketOutLookIcon className={`w-4 h-4 ${marketOutlookColor}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {industryInsight.marketOutlook}
            </div>
            <p className="text-xs text-muted-foreground">
              Next update: {nextUpdateDistanceRef.current}
            </p>
          </CardContent>
        </Card>

        {/* Industry growth */}
        <Card>
          <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Industry growth
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {industryInsight.growthRate.toFixed(1)}%
            </div>
            <Progress value={industryInsight.growthRate} className="mt-1.5" />
          </CardContent>
        </Card>

        {/* Demand level */}
        <Card>
          <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Demand level</CardTitle>
            <BriefcaseIcon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {industryInsight.demandLevel}
            </div>
            <div
              className={`h-2 rounded-full mt-2 ${getDemandLevelColor(
                industryInsight.demandLevel
              )}`}
            ></div>
          </CardContent>
        </Card>

        {/* Top skills */}
        <Card>
          <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top skills</CardTitle>
            <Brain className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1.5">
              {industryInsight.topSkills.map((item) => (
                <Badge key={item} variant="secondary">
                  {item}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Salary ranges (chart) */}
      <Card>
        <CardHeader>
          <CardTitle>Salary ranges by role</CardTitle>
          <CardDescription>
            Displaying minimum, medium and maximum salaries (in thousands)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                width={500}
                height={300}
                data={salaryDataRef.current}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border rounded-lg p-2 shadow-md">
                          <div className="font-medium">{label}</div>
                          {payload.map((item) => (
                            <p key={item.name} className="text-sm">
                              {item.name}: ${item.value}K
                            </p>
                          ))}
                        </div>
                      );
                    }
                  }}
                />
                <Bar dataKey="min" fill="#94a3b8" name="Min Salary (K)" />
                <Bar dataKey="medium" fill="#64748b" name="Medium Salary (K)" />
                <Bar dataKey="max" fill="#475569" name="Max Salary (K)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Key industry trends</CardTitle>
            <CardDescription>
              Current trends shaping the industry
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {industryInsight.keyTrends.map((item, index) => (
                <li key={index} className="flex gap-2">
                  <div className="w-2 h-2 mt-2 rounded-full bg-primary"></div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommend skills</CardTitle>
            <CardDescription>Skill to consider developing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {industryInsight.recommendSkills.map((item) => (
                <Badge key={item} variant="outline">
                  {item}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default DashboardView;
