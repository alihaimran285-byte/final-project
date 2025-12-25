import React from "react";
import { motion } from "framer-motion";

export default function AboutHeader() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16 text-center">

      <motion.h1
        className="text-5xl font-extrabold text-orange-800"
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        About Panda School
      </motion.h1>

      <motion.p
        className="mt-4 text-lg text-orange-900/80 max-w-3xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        Panda School is a fun and friendly school management system with
        playful UI, smooth animations and simple tools for teachers & students.
      </motion.p>
    </section>
  );
}
