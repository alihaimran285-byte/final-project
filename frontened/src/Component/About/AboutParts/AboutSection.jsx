import React from "react";
import { motion } from "framer-motion";
import hero from "../../../assets/about-pic.png";

export default function AboutSection() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center gap-10">

      <motion.img
        src={hero}
        alt="panda"
        className="w-[24rem] md:w-[28rem] drop-shadow-xl"
        animate={{ y: [0, -15, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
      />

      <div>
        <h2 className="text-3xl font-bold text-orange-800">Why Panda School?</h2>

        <p className="mt-4 text-orange-900/80 leading-relaxed">
          We create a joyful digital experience with a warm panda theme,
          modern UI and smooth dashboards that make school management fun.
        </p>

        <ul className="mt-6 space-y-2 text-orange-800 font-medium">
          <li>✔ Easy Attendance System</li>
          <li>✔ Class & Fees Management</li>
          <li>✔ Teacher & Student Portals</li>
          <li>✔ Smooth Dashboard Experience</li>
          <li>✔ Fully Responsive</li>
        </ul>
      </div>
    </section>
  );
}
