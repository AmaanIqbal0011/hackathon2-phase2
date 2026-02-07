"use client";

import React from "react";
import { motion } from "framer-motion";

const HowItWorks: React.FC = () => {
  const steps = [
    {
      title: "Create Account",
      description: "Sign up in less than a minute with your email address",
      icon: "📝",
    },
    {
      title: "Add Tasks",
      description: "Create, organize, and prioritize using smart tools",
      icon: "➕",
    },
    {
      title: "Stay Productive",
      description: "Track progress and let AI optimize your workflow",
      icon: "🚀",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="relative py-24 bg-gradient-to-br from-white via-slate-50 to-indigo-50 overflow-hidden"
    >
      {/* Soft Glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-200/40 blur-[140px]" />

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
            How It Works
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Start managing tasks in three simple steps
          </p>
        </motion.div>

        {/* Timeline line (desktop) */}
        <div className="hidden md:block absolute left-1/2 top-[260px] w-[70%] -translate-x-1/2 h-px bg-indigo-200" />

        {/* Steps */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: { transition: { staggerChildren: 0.15 } },
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-10"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.4 }}
              className="group relative"
            >
              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center transition-all group-hover:-translate-y-2 group-hover:shadow-xl">

                {/* Step Number */}
                <div className="mx-auto mb-4 w-10 h-10 flex items-center justify-center rounded-full bg-indigo-600 text-white font-semibold">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="text-4xl mb-4">{step.icon}</div>

                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {step.title}
                </h3>

                <p className="text-slate-600 text-sm leading-relaxed">
                  {step.description}
                </p>

              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default HowItWorks;
