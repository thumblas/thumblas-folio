import { motion, type MotionProps } from "framer-motion";
import type { PropsWithChildren } from "react";

type RevealProps = PropsWithChildren<{
  delay?: number;
  y?: number;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}> & MotionProps;

export default function Reveal({
  children,
  delay = 0,
  y = 20,
  as = "div",
  className,
  ...rest
}: RevealProps) {
  const Component = motion[as as "div"] as any;
  return (
    <Component
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      viewport={{ once: true, margin: "-80px" }}
      className={className}
      {...rest}
    >
      {children}
    </Component>
  );
}

