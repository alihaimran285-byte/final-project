import { motion } from "framer-motion";

export default function AboutStats() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-8 text-center">

      {[
        { num: "10,000+", label: "Students Helped" },
        { num: "500+", label: "Teachers Using Daily" },
        { num: "120+", label: "Schools Connected" },
      ].map((s, i) => (
        <motion.div
          key={i}
          className="p-8 bg-orange-200 shadow-md rounded-2xl border border-orange-300"
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-4xl font-extrabold text-orange-800">{s.num}</h3>
          <p className="text-orange-900/70 mt-2">{s.label}</p>
        </motion.div>
      ))}

    </section>
  );
}
