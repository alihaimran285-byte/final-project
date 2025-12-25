import React from "react";
import { motion } from "framer-motion";

export default function AboutCards({ title, items }) {
  return (
    <section className="max-w-6xl mx-auto px-6 py-12">

      <h2 className="text-3xl font-bold text-orange-800 text-center">
        {title}
      </h2>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.3, y: 60 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: i * 0.15,
              type: "spring",
              stiffness: 180,
              damping: 12,
            }}
            viewport={{ once: true }}
            whileHover={{
              scale: 1.12,
              rotate: 1.5,
              transition: { type: "spring", stiffness: 300 },
            }}
            className="text-center border border-orange-300 shadow-md p-6 rounded-xl bg-orange-200"
          >
            {item.icon && (
              <motion.i
                className={`${item.icon} text-4xl text-orange-700`}
                initial={{ rotate: -10, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{
                  duration: 0.6,
                  delay: 0.3,
                  type: "spring",
                  stiffness: 200,
                }}
              />
            )}

            <motion.h3
              className="mt-4 text-xl font-bold text-orange-800"
              initial={{ y: 10, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.15 + 0.2, type: "spring", stiffness: 200 }}
            >
              {item.title}
            </motion.h3>

            <motion.p
              className="mt-2 text-orange-900/70"
              initial={{ y: 12, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.15 + 0.3 }}
            >
              {item.text}
            </motion.p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
