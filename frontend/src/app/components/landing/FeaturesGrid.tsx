"use client";

import React from "react";
import { FEATURES } from "@/lib/constants";
import { motion } from "framer-motion";

const FeaturesGrid: React.FC = () => {
  return (
    <section
      id="features"
      className="relative py-24 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50"
    >
      {/* Subtle Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[size:70px_70px]" />

      {/* Soft Glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-300/30 blur-[140px]" />

      <div className="relative container mx-auto px-6">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Powerful Features
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Everything you need to manage tasks smarter with AI assistance
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: { transition: { staggerChildren: 0.12 } },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {FEATURES.map((feature, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.4 }}
              className="group relative rounded-2xl"
            >
              <div className="h-full rounded-2xl bg-white border border-slate-200 p-6 transition-all group-hover:-translate-y-2 group-hover:shadow-xl">

                {/* Icon bubble */}
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 mb-4 text-2xl">
                  {feature.icon}
                </div>

                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {feature.description}
                </p>

              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default FeaturesGrid;
