"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, CheckCircle2, Brain } from "lucide-react";

const features = [
  "AI Powered Smart Todos",
  "Realtime Collaboration",
  "Productivity Analytics",
];

const HeroSection = () => {
  return (
<section className="relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-indigo-900 to-[#020617] text-white">

      {/* Floating Orbs */}
<div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.25),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.25),transparent_40%)]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />

      <div className="relative z-10 container mx-auto px-6 py-28">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6 backdrop-blur">
            <Sparkles size={16} />
            <span className="text-sm">Next-Gen AI Todo Platform</span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Organize Smarter.
            <br />
            <span className="text-blue-200">Achieve Faster.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            An AI-powered task management platform built for creators, students, and teams to plan, prioritize, and execute effortlessly.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {features.map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur"
              >
                <CheckCircle2 size={16} />
                <span className="text-sm">{f}</span>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-5">

            <Link
              href="/signup"
              className="group relative px-10 py-4 rounded-xl bg-white text-indigo-700 font-semibold shadow-xl hover:shadow-2xl transition-all"
            >
              <span className="relative z-10 flex items-center gap-2 justify-center">
                <Brain size={18} />
                Get Started Free
              </span>
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 bg-gradient-to-r from-indigo-200 to-blue-200 transition" />
            </Link>

            <Link
              href="/signin"
              className="px-10 py-4 rounded-xl border border-white/40 backdrop-blur hover:bg-white hover:text-indigo-700 transition-all font-semibold"
            >
              Login
            </Link>

          </div>

          {/* Trust */}
          <p className="mt-10 text-sm text-blue-200">
            Trusted by developers & students • No credit card required
          </p>
        </motion.div>

      </div>
    </section>
  );
};

export default HeroSection;
