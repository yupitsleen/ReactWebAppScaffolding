import { memo, type ReactNode } from 'react'
import { motion, type Variants } from 'framer-motion'

interface AnimatedSectionProps {
  children: ReactNode
  delay?: number
  className?: string
}

const sectionVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1], // cubic-bezier for smooth easing
    },
  },
}

const AnimatedSection = memo<AnimatedSectionProps>(({ children, delay = 0, className }) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={sectionVariants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
})

AnimatedSection.displayName = 'AnimatedSection'

export default AnimatedSection
