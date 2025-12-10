import React from "react";
import { motion } from "framer-motion";
import hero from "../assets/panda.png";
import About from "../Component/About/About";
import Contact from "../Component/Contact/Contact";

export default function Home() {
  return (
    <>
      <section className="min-h-[85vh] bg-gradient-to-b from-orange-50 to-orange-200 overflow-hidden pt-24 pb-10">

        {/* Floating soft blobs */}
        <motion.div
          className="absolute -z-10 left-12 top-20 w-60 h-32 bg-white/60 rounded-full blur-3xl"
          animate={{ y: [0, 30, 0], opacity: [0.8, 1, 0.8] }}
          transition={{ repeat: Infinity, duration: 6 }}
        />

        <motion.div
          className="absolute -z-10 right-12 top-40 w-52 h-28 bg-orange-100/70 rounded-full blur-2xl"
          animate={{ y: [0, -25, 0], opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 5 }}
        />

        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col-reverse md:flex-row items-center gap-10">

          {/* Left Text Section */}
          <div className="md:w-1/2">
            <motion.h1
              className="text-5xl md:text-6xl font-extrabold text-orange-700"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              Welcome to<br /> 
              <span className="text-orange-800">Panda School </span>
            </motion.h1>

            <p className="mt-4 text-lg text-orange-900/80 leading-relaxed">
              A cute and friendly school management system for students, teachers
              and parents — simple, safe and joyful.
            </p>

            <motion.div
              className="mt-6 bg-orange-800 shadow-xl p-4 rounded-xl border border-orange-100 w-fit text-white"
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              💛 Trusted by kids & teachers
            </motion.div>
          </div>

          {/* Panda Image Section */}
          <div className="md:w-1/2 flex justify-center">
            <motion.img
              src={hero}
              alt="cute panda"
              className="w-[25rem] md:w-[32rem] drop-shadow-2xl"
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            />
          </div>
        </div>

        {/* Cute Feature Cards */}
        <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Attendance", desc: "Simple & fast tracking." },
            { title: "Fees", desc: "Easy payment management." },
            { title: "Classes", desc: "Organize lessons easily." },
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-orange-100 p-6 rounded-2xl shadow-md text-center border border-orange-200"
            >
              <h3 className="text-xl font-semibold text-orange-800">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-orange-700/80">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <About />
      <Contact />
    </>
  );
}
