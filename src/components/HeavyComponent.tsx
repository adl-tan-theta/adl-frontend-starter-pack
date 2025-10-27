"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Cpu,
  Database,
  HardDrive,
  Network,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HeavyComponent() {
  const [data, setData] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate heavy computation
    const timer = setTimeout(() => {
      const randomData = Array.from({ length: 20 }, () =>
        Math.floor(Math.random() * 100),
      );
      setData(randomData);
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Heavy Component Loading...</CardTitle>
          <CardDescription>
            This component simulates heavy computation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Cpu className="h-8 w-8 text-primary" />
            </motion.div>
            <span className="ml-2">Processing...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Heavy Component Loaded</CardTitle>
        <CardDescription>
          This component was dynamically imported and contains heavy
          computations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2 p-3 bg-secondary rounded-lg"
            >
              <Database className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Database</p>
                <p className="text-xs text-muted-foreground">Connected</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 p-3 bg-secondary rounded-lg"
            >
              <Network className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Network</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2 p-3 bg-secondary rounded-lg"
            >
              <HardDrive className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Storage</p>
                <p className="text-xs text-muted-foreground">85% Used</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2 p-3 bg-secondary rounded-lg"
            >
              <Activity className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium">CPU</p>
                <p className="text-xs text-muted-foreground">45% Usage</p>
              </div>
            </motion.div>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Performance Metrics
            </h4>
            <div className="grid grid-cols-5 gap-2">
              {data.map((value, index) => (
                <motion.div
                  key={`data-${index}-${value}`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  className="h-16 bg-gradient-to-t from-primary/20 to-primary/5 rounded-lg flex items-end justify-center p-2"
                >
                  <div
                    className="w-full bg-primary rounded-sm"
                    style={{ height: `${value}%` }}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex gap-2"
          >
            <Button size="sm" variant="outline">
              <Zap className="h-4 w-4 mr-2" />
              Optimize
            </Button>
            <Button size="sm" variant="outline">
              <Activity className="h-4 w-4 mr-2" />
              Monitor
            </Button>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
}
