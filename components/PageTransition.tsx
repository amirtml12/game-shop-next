"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} // حالت شروع (کمی پایین‌تر و محو)
      animate={{ opacity: 1, y: 0 }}  // حالت نمایش (جای اصلی و واضح)
      exit={{ opacity: 0, y: -20 }}   // حالت خروج (کمی بالاتر و محو)
      transition={{ duration: 0.4, ease: "easeOut" }} // زمان‌بندی
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;