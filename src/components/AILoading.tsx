import { motion } from "framer-motion";

const AILoading = () => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.05 },
      },
    }}
    className="flex items-center text-xs text-gray-400 mt-1"
  >
    {"Loading".split("").map((char, index) => (
      <motion.span
        key={index}
        variants={{
          hidden: { opacity: 0, y: 10 },
          visible: { opacity: 1, y: 0 },
        }}
        className="inline-block"
      >
        {char}
      </motion.span>
    ))}
    <motion.span
      className="inline-block ml-1"
      animate={{ opacity: [0, 1, 0] }}
      transition={{ repeat: Infinity, duration: 1 }}
    >
      ...
    </motion.span>
  </motion.div>
);

export default AILoading;