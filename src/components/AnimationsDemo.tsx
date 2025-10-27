"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Bookmark,
  Heart,
  MessageCircle,
  Minus,
  Plus,
  RotateCcw,
  Share,
  Star,
  ThumbsUp,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AnimationsDemo() {
  const [isVisible, setIsVisible] = useState(true);
  const [count, setCount] = useState(0);
  const [items, setItems] = useState([
    { id: 1, text: "First item", color: "bg-blue-500" },
    { id: 2, text: "Second item", color: "bg-green-500" },
    { id: 3, text: "Third item", color: "bg-purple-500" },
  ]);

  const addItem = () => {
    const newItem = {
      id: Date.now(),
      text: `Item ${items.length + 1}`,
      color: `bg-${["red", "yellow", "pink", "indigo", "teal"][Math.floor(Math.random() * 5)]}-500`,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">
          Framer Motion Animations Demo
        </h2>
        <p className="text-muted-foreground">
          Showcasing complex animations, transitions, and interactive elements
        </p>
      </div>

      {/* Basic Animations */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Basic Animations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Fade In/Out</CardTitle>
              <CardDescription>
                Simple fade animations with AnimatePresence
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setIsVisible(!isVisible)} className="mb-4">
                {isVisible ? "Hide" : "Show"} Element
              </Button>
              <AnimatePresence>
                {isVisible && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 bg-primary/10 rounded-lg"
                  >
                    <p className="text-primary font-medium">
                      This element fades in and out smoothly!
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Scale Animation</CardTitle>
              <CardDescription>
                Hover and click animations with scale effects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-4 bg-secondary rounded-lg cursor-pointer"
                >
                  <Heart className="h-6 w-6 text-red-500" />
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-4 bg-secondary rounded-lg cursor-pointer"
                >
                  <Star className="h-6 w-6 text-yellow-500" />
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-4 bg-secondary rounded-lg cursor-pointer"
                >
                  <ThumbsUp className="h-6 w-6 text-blue-500" />
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Counter Animation */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Counter Animation</h3>
        <Card>
          <CardHeader>
            <CardTitle>Animated Counter</CardTitle>
            <CardDescription>
              Counter with smooth number transitions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setCount(count - 1)}
                variant="outline"
                size="icon"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <motion.div
                key={count}
                initial={{ scale: 1.2, color: "#ef4444" }}
                animate={{ scale: 1, color: "#000000" }}
                transition={{ duration: 0.2 }}
                className="text-2xl font-bold min-w-12 text-center"
              >
                {count}
              </motion.div>
              <Button
                onClick={() => setCount(count + 1)}
                variant="outline"
                size="icon"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button onClick={() => setCount(0)} variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* List Animations */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">List Animations</h3>
        <Card>
          <CardHeader>
            <CardTitle>Animated List</CardTitle>
            <CardDescription>
              Add and remove items with smooth animations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Button onClick={addItem} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
            <div className="space-y-2">
              <AnimatePresence>
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${item.color}`} />
                      <span>{item.text}</span>
                    </div>
                    <Button
                      onClick={() => removeItem(item.id)}
                      variant="ghost"
                      size="sm"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Complex Animations */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Complex Animations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Staggered Animation</CardTitle>
              <CardDescription>
                Multiple elements animating in sequence
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.1,
                      type: "spring",
                      stiffness: 100,
                    }}
                    className="p-2 bg-primary/10 rounded text-sm"
                  >
                    Staggered item {i}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Spring Animation</CardTitle>
              <CardDescription>Physics-based spring animations</CardDescription>
            </CardHeader>
            <CardContent>
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-16 h-16 bg-linear-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto"
              >
                <Zap className="h-8 w-8 text-white" />
              </motion.div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Interactive Elements */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Interactive Elements</h3>
        <Card>
          <CardHeader>
            <CardTitle>Social Media Buttons</CardTitle>
            <CardDescription>
              Animated social media interaction buttons
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                <Heart className="h-4 w-4" />
                <span>Like</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Comment</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg"
              >
                <Share className="h-4 w-4" />
                <span>Share</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg"
              >
                <Bookmark className="h-4 w-4" />
                <span>Save</span>
              </motion.button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Features Highlight */}
      <Card>
        <CardHeader>
          <CardTitle>Framer Motion Features</CardTitle>
          <CardDescription>
            Key features and capabilities demonstrated
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold">✅ AnimatePresence</h4>
              <p className="text-sm text-muted-foreground">
                Smooth enter/exit animations for conditional rendering
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">✅ Gesture Animations</h4>
              <p className="text-sm text-muted-foreground">
                whileHover, whileTap, and other gesture-based animations
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">✅ Staggered Animations</h4>
              <p className="text-sm text-muted-foreground">
                Sequential animations with delays and spring physics
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">✅ Layout Animations</h4>
              <p className="text-sm text-muted-foreground">
                Automatic layout animations for dynamic content
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">✅ Spring Physics</h4>
              <p className="text-sm text-muted-foreground">
                Natural, physics-based animations with spring configurations
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">✅ Performance</h4>
              <p className="text-sm text-muted-foreground">
                Optimized animations using GPU acceleration
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
