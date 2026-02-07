"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const CallToAction: React.FC = () => {
  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-br from-indigo-700 via-blue-600 to-indigo-500 text-white">

      {/* Soft Floating Glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-400/30 blur-[140px] animate-pulse" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-400/20 blur-[140px]" />

      <div className="relative container mx-auto px-6 text-center">

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold mb-6"
        >
          Ready to boost your productivity?
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-lg md:text-xl mb-12 max-w-2xl mx-auto text-blue-100"
        >
          Join thousands of users who have transformed their workflow with our AI-powered task management platform
        </motion.p>

        {/* Button */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/signup"
            className="relative inline-block px-10 py-4 rounded-xl bg-white text-indigo-700 font-semibold shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 hover:scale-105"
          >
            Create Free Account
          </Link>
        </motion.div>

        {/* Trust Text */}
        <p className="mt-8 text-sm text-blue-200">
          No credit card required • Start for free today
        </p>
      </div>
    </section>
  );
};

export default CallToAction;
