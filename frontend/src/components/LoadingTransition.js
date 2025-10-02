import React from "react";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";

const LoadingTransition = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ display: "inline-block" }}
        >
          <Loader size={32} color="#404040" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-3 mb-0"
          style={{
            color: "#404040",
            fontSize: "0.9rem",
            fontWeight: "500",
          }}
        >
          Loading...
        </motion.p>
      </div>
    </motion.div>
  );
};

export default LoadingTransition;
