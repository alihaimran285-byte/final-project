import { motion } from "framer-motion";
import panda1 from "../../../assets/panda-mascro1.png";
import panda2 from "../../../assets/panda-2.png";
import panda3 from "../../../assets/panda-3.png";

export default function AboutMascot() {
  return (
    <div className="py-16 bg-orange-50">
      <h2 className="text-center text-3xl font-bold text-orange-800 mb-10">
        Meet Our Panda Mascots
      </h2>

      <div className="flex flex-col md:flex-row items-center justify-center gap-10">

        {/* Panda 1 */}
        <motion.div
          className="text-center w-64 md:w-72"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <img src={panda1} className="w-full drop-shadow-xl" />
          <p className="mt-3 text-orange-700 font-semibold">Playful Panda</p>
          <p className="text-orange-900/70 text-sm">Always ready for new adventures!</p>
        </motion.div>

        {/* Panda 2 */}
        <motion.div
          className="text-center w-64 md:w-72"
          animate={{ y: [0, -18, 0] }}
          transition={{ duration: 2.2, repeat: Infinity }}
        >
          <img src={panda2} className="w-full drop-shadow-xl" />
          <p className="mt-3 text-orange-700 font-semibold">Smart Panda</p>
          <p className="text-orange-900/70 text-sm">Loves learning & teaching.</p>
        </motion.div>

        {/* Panda 3 */}
        <motion.div
          className="text-center w-64 md:w-72"
          animate={{ y: [0, -16, 0] }}
          transition={{ duration: 2.3, repeat: Infinity }}
        >
          <img src={panda3} className="w-full drop-shadow-xl" />
          <p className="mt-3 text-orange-700 font-semibold">Cute Panda</p>
          <p className="text-orange-900/70 text-sm">Brings joy to Panda School!</p>
        </motion.div>

      </div>
    </div>
  );
}
