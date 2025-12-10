import React from "react";
import { motion } from "framer-motion";

import AboutHeader from "../About/AboutParts/AboutHeader";
import AboutSection from "../About/AboutParts/AboutSection";
import AboutCards from "../About/AboutParts/AboutCards";

import AboutMission from "../About/AboutParts/AboutMission";
import AboutLoved from "../About/AboutParts/AboutLoved";
import AboutStats from "../About/AboutParts/AboutStats";
import AboutMascot from "../About/AboutParts/AboutMascot";

export default function About() {
  return (
    <motion.div
      className="bg-gradient-to-b from-orange-50 to-orange-100 pt-12"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <AboutHeader />
      </motion.div>

      {/* Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <AboutSection />
      </motion.div>

      {/* Feature Cards */}
      <AboutCards
        title="What Makes Us Special?"
        items={[
          {
            icon: "fa-regular fa-face-smile",
            title: "Cute & Friendly UI",
            text: "Soft peach-orange colors creating comfort and fun.",
          },
          {
            icon: "fa-solid fa-gauge-high",
            title: "Fast Performance",
            text: "Optimized for smooth performance everywhere.",
          },
          {
            icon: "fa-solid fa-shield-halved",
            title: "Secure & Reliable",
            text: "Safeguarding school data with top-level security.",
          },
        ]}
      />

      {/* Mascot Section */}
      <AboutMascot />

      {/* Mission */}
      <AboutMission />

      {/* Loved */}
      <AboutLoved />

      {/* Stats Section */}
      <AboutStats />

      {/* Value Cards */}
      <AboutCards
        title="Our Core Values"
        items={[
          { title: "Simplicity", text: "Clean, simple & easy to use." },
          { title: "Joyful Design", text: "Cute panda theme with animations." },
          { title: "Trust & Security", text: "Data is protected always." },
        ]}
      />
    </motion.div>
  );
}