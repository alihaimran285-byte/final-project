import { motion } from "framer-motion";

export default function AboutLoved() {
  return (
    <section className="py-16 text-center">
      <motion.h2
        className="text-3xl font-bold text-orange-800"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Loved By Students & Teachers
      </motion.h2>

      <p className="mt-3 text-orange-900/70 max-w-xl mx-auto">
        Panda School is used daily because it feels friendly, soft and easy.
      </p>
    </section>
  );
}
