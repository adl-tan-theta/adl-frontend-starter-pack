"use client";

import { motion } from "framer-motion";
import { BarChart3, PieChart } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LazyChart() {
  const chartData = [
    { label: "Q1", value: 65, color: "bg-blue-500" },
    { label: "Q2", value: 80, color: "bg-green-500" },
    { label: "Q3", value: 45, color: "bg-yellow-500" },
    { label: "Q4", value: 90, color: "bg-purple-500" },
  ];

  const pieData = [
    { label: "Desktop", value: 45, color: "bg-blue-500" },
    { label: "Mobile", value: 35, color: "bg-green-500" },
    { label: "Tablet", value: 20, color: "bg-orange-500" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics Dashboard</CardTitle>
        <CardDescription>Dynamically loaded chart components</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Bar Chart */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Quarterly Performance
            </h4>
            <div className="flex items-end gap-2 h-32">
              {chartData.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ height: 0 }}
                  animate={{ height: `${item.value}%` }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.1,
                    ease: "easeOut",
                  }}
                  className={`${item.color} rounded-t-sm flex-1 flex flex-col items-center justify-end p-1`}
                >
                  <span className="text-white text-xs font-medium mb-1">
                    {item.value}%
                  </span>
                  <span className="text-white text-xs">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Pie Chart */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Device Usage
            </h4>
            <div className="flex items-center gap-6">
              <div className="flex-1">
                <div className="space-y-2">
                  {pieData.map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-center gap-2"
                    >
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <span className="text-sm">{item.label}</span>
                      <span className="text-sm font-medium ml-auto">
                        {item.value}%
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <div className="relative w-24 h-24 mx-auto">
                  <svg
                    className="w-24 h-24 transform -rotate-90"
                    viewBox="0 0 100 100"
                    role="img"
                    aria-label="Performance chart"
                  >
                    {pieData.map((item, index) => {
                      const startAngle = pieData
                        .slice(0, index)
                        .reduce((acc, curr) => acc + curr.value * 3.6, 0);
                      const endAngle = startAngle + item.value * 3.6;
                      const largeArcFlag = item.value > 50 ? 1 : 0;

                      const x1 =
                        50 + 40 * Math.cos((startAngle * Math.PI) / 180);
                      const y1 =
                        50 + 40 * Math.sin((startAngle * Math.PI) / 180);
                      const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
                      const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);

                      const pathData = [
                        `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`,
                      ].join(" ");

                      return (
                        <motion.path
                          key={item.label}
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{
                            duration: 1,
                            delay: 0.8 + index * 0.2,
                            ease: "easeInOut",
                          }}
                          d={pathData}
                          fill={item.color
                            .replace("bg-", "")
                            .replace("-500", "")}
                          className="opacity-80"
                        />
                      );
                    })}
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="grid grid-cols-3 gap-4 pt-4 border-t"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">+12%</div>
              <div className="text-sm text-muted-foreground">Growth</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">1.2K</div>
              <div className="text-sm text-muted-foreground">Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">98%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
}
