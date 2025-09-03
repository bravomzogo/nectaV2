import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Apply dark mode
  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [isDarkMode]);

  return (
    <motion.header
      className="sticky top-0 z-50"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Glassy navbar */}
      <div
        className={`backdrop-blur-md bg-white/80 dark:bg-gray-900/80 transition-all duration-500 ${
          isScrolled ? "shadow-md" : "shadow-none"
        }`}
      >
        <div className="container mx-auto px-6 py-6 flex items-center justify-between">
          {/* Logo */}
          <motion.div whileTap={{ scale: 0.95 }} className="flex-1 flex justify-start">
            <Link
              to="/"
              className="text-2xl font-bold flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <motion.div
                className="w-11 h-11 bg-gradient-to-br from-amber-400 to-amber-600 dark:from-amber-600 dark:to-amber-800 rounded-2xl flex items-center justify-center mr-3 shadow-md"
                whileHover={{ rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="text-white font-bold text-xl">N</span>
              </motion.div>
              <span
                className={`transition-colors duration-500 ${
                  isScrolled
                    ? "text-gray-900 dark:text-gray-100"
                    : "text-gray-900 dark:text-gray-100"
                }`}
              >
                NECTA Rankings
              </span>
            </Link>
          </motion.div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-2 text-lg font-medium">
            {["/", "/rankings/ACSEE/2023"].map((path, idx) => (
              <motion.div
                key={idx}
                whileTap={{ scale: 0.92 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <Link
                  to={path}
                  className={`px-5 py-3 rounded-xl transition-all duration-500 relative overflow-hidden group ${
                    location.pathname === path
                      ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 font-semibold"
                      : "hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100 hover:text-amber-600 dark:hover:text-amber-400"
                  }`}
                >
                  {path === "/" ? "Home" : "Rankings"}
                  <span className="absolute inset-0 rounded-xl scale-0 group-active:scale-100 bg-amber-300/30 dark:bg-amber-500/20 transition-transform duration-500"></span>
                </Link>
              </motion.div>
            ))}
            {["About", "Contact"].map((label, idx) => (
              <motion.div
                key={idx}
                whileTap={{ scale: 0.92 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <a
                  href="#"
                  className="px-5 py-3 rounded-xl transition-colors duration-500 relative overflow-hidden group hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100 hover:text-amber-600 dark:hover:text-amber-400"
                >
                  {label}
                  <span className="absolute inset-0 rounded-xl scale-0 group-active:scale-100 bg-amber-300/30 dark:bg-amber-500/20 transition-transform duration-500"></span>
                </a>
              </motion.div>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center space-x-3">
            {/* Menu button */}
            <motion.button
              className="md:hidden p-2 rounded-full relative overflow-hidden group"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle menu"
            >
              <div className="w-6 h-6 relative">
                <motion.span
                  className={`absolute left-0 top-1/2 w-full h-0.5 rounded-full transition-all duration-300 ${
                    isMenuOpen ? "rotate-45" : "-translate-y-1.5"
                  } ${isScrolled ? "bg-gray-800 dark:bg-white" : "bg-gray-700 dark:bg-white"}`}
                  animate={{ rotate: isMenuOpen ? 45 : 0, y: isMenuOpen ? 0 : -6 }}
                />
                <motion.span
                  className={`absolute left-0 top-1/2 w-full h-0.5 rounded-full transition-all duration-300 ${
                    isMenuOpen ? "opacity-0" : "opacity-100"
                  } ${isScrolled ? "bg-gray-800 dark:bg-white" : "bg-gray-700 dark:bg-white"}`}
                />
                <motion.span
                  className={`absolute left-0 top-1/2 w-full h-0.5 rounded-full transition-all duration-300 ${
                    isMenuOpen ? "-rotate-45" : "translate-y-1.5"
                  } ${isScrolled ? "bg-gray-800 dark:bg-white" : "bg-gray-700 dark:bg-white"}`}
                  animate={{ rotate: isMenuOpen ? -45 : 0, y: isMenuOpen ? 0 : 6 }}
                />
              </div>
              <span className="absolute inset-0 rounded-full scale-0 group-active:scale-100 bg-gray-400/20 dark:bg-gray-600/20 transition-transform duration-500"></span>
            </motion.button>

            {/* Dark Mode Toggle */}
            <motion.button
              className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 shadow-sm relative overflow-hidden group"
              onClick={() => setIsDarkMode(!isDarkMode)}
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle dark mode"
            >
              <AnimatePresence mode="wait">
                {!isDarkMode ? (
                  <motion.svg
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-5 h-5 text-amber-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3
                        m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707
                        m12.728 0l-.707.707M6.343 17.657l-.707.707
                        M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </motion.svg>
                ) : (
                  <motion.svg
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-5 h-5 text-amber-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 
                         9.003 9.003 0 0012 21a9.003 9.003 0 
                         008.354-5.646z"
                    />
                  </motion.svg>
                )}
              </AnimatePresence>
              <span className="absolute inset-0 rounded-full scale-0 group-active:scale-100 bg-amber-400/20 transition-transform duration-500"></span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.nav
              className="absolute top-16 left-4 right-4 rounded-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-2xl overflow-hidden"
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {["Home", "Rankings", "About", "Contact"].map((label, idx) => (
                <Link
                  key={idx}
                  to={idx === 0 ? "/" : idx === 1 ? "/rankings/ACSEE/2023" : "#"}
                  className="block py-4 px-6 text-gray-900 dark:text-gray-100 active:bg-gray-200 dark:active:bg-gray-800 transition-colors text-lg font-medium border-b border-gray-200/50 dark:border-gray-800/50 relative overflow-hidden group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {label}
                  <span className="absolute inset-0 scale-0 group-active:scale-100 bg-amber-300/20 dark:bg-amber-500/20 transition-transform duration-500"></span>
                </Link>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
