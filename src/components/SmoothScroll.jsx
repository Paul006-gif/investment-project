import { motion, useScroll, useSpring, useTransform } from "framer-motion";

export default function SmoothScroll({ children }) {
  const { scrollY } = useScroll();

  // Smooth scrolling with spring physics
  const smoothY = useSpring(scrollY, {
    stiffness: 100,
    damping: 30,
    mass: 1,
  });

  // Parallax effect - moves slower than scroll
  const parallaxY = useTransform(scrollY, [0, 1000], [0, -200], {
    clamp: false,
  });

  // Opacity fade based on scroll
  const opacity = useTransform(scrollY, [0, 300], [1, 0.8], {
    clamp: false,
  });

  // Scale effect based on scroll
  const scale = useTransform(scrollY, [0, 500], [1, 0.98], {
    clamp: false,
  });

  // Rotation effect
  const rotate = useTransform(scrollY, [0, 1000], [0, 2], {
    clamp: false,
  });

  return (
    <motion.div
      style={{
        y: smoothY,
        opacity,
        scale,
        rotate,
        willChange: "transform, opacity",
      }}
      transition={{
        type: "spring",
        stiffness: 50,
        damping: 25,
      }}
    >
      {children}
    </motion.div>
  );
}
