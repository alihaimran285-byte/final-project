import { motion } from "framer-motion";

export default function AboutMission() {
  return (
    <section className="bg-orange-200/50 py-16 mt-10 text-center">
      <motion.h2
        className="text-4xl font-bold text-orange-800"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Our Mission
      </motion.h2>

      <motion.p
        className="mt-4 max-w-3xl mx-auto text-orange-900/80"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        To make school management modern, joyful and stress-free with cute designs
        & powerful tools.
      </motion.p>
    </section>
  );
}
