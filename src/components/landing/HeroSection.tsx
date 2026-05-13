"use client";

import { motion } from "framer-motion";
import { CheckCircle, Play, Leaf } from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import DailyTaskCard from "./DailyTaskCard";

const trustItems = ["Pulsuz Qeydiyyat", "Sertifikatlı Fermalar", "Təhlükəsiz Ödəniş"];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-primary flex items-center overflow-hidden">
      {/* Gradient bg orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary-dark opacity-80 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left */}
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge variant="accent" className="gap-1.5">
              <Leaf size={12} />
              Azərbaycanın Aqroturizm Platforması
            </Badge>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="font-serif text-5xl lg:text-6xl font-bold leading-[1.1] text-text-dark">
            Kəndi<br />
            <span className="text-accent">Yenidən</span><br />
            Kəşf Et
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-muted text-lg leading-relaxed max-w-lg">
            Təbiəti yaşa, yerli fermalarla tanış ol, hər addımında əsl Azərbaycan
            kəndi təcrübəsi qazanmaq üçün koin yığ.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="flex flex-wrap gap-3">
            <Button size="lg" variant="gradient">Kəşfə Başla →</Button>
            <Button variant="ghost" size="lg" className="gap-2">
              <Play size={16} fill="currentColor" /> Videoya Bax
            </Button>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-wrap gap-4 pt-2">
            {trustItems.map(item => (
              <div key={item} className="flex items-center gap-1.5 text-sm text-muted">
                <CheckCircle size={14} className="text-accent" />
                {item}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right */}
        <div className="relative flex justify-center lg:justify-end">
          <div className="absolute inset-0 bg-accent/10 rounded-full blur-3xl scale-75" />
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-4 right-4 lg:-top-6 lg:right-0 z-10">
            <Badge variant="accent" className="text-sm shadow-lg rotate-6 px-4 py-2">
              +80 KOİN
            </Badge>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}>
            <DailyTaskCard />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
