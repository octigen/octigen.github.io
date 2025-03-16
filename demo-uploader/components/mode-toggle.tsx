"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ModeToggle() {
  const [isDark, setIsDark] = useState(false);

  // Ensure the correct class is applied on mount
  useEffect(() => {
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme === "dark" || (!currentTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  // Toggle dark mode manually
  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    setIsDark(!isDark);

    document.documentElement.classList.toggle("dark", !isDark); // 🔥 Manually add/remove class
    localStorage.setItem("theme", newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-8 flex items-center bg-gray-300 dark:bg-gray-700 rounded-full p-1 transition-all duration-500 shadow-inner"
    >
      <motion.div
        className="absolute left-1 w-6 h-6 flex items-center justify-center rounded-full bg-white dark:bg-gray-900"
        animate={{ x: isDark ? 24 : 0 }} // Fix: Smooth transition
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <AnimatePresence mode="popLayout">
          {isDark ? (
            <motion.div
              key="moon"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.3 }}
            >
              <Moon className="w-5 h-5 text-yellow-400" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.3 }}
            >
              <Sun className="w-5 h-5 text-yellow-500" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </button>
  );
}
