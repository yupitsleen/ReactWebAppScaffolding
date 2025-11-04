import { memo, type ReactNode } from 'react'
import { motion, type Variants } from 'framer-motion'

interface AnimatedGridProps {
  children: ReactNode
  staggerDelay?: number
  initialDelay?: number
  className?: string
}

const containerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Delay between each child animation
      delayChildren: 0, // Initial delay before starting animations
    },
  },
}

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
    },
  },
}

const AnimatedGrid = memo<AnimatedGridProps>(({
  children,
  staggerDelay = 0.1,
  initialDelay = 0,
  className
}) => {
  const customContainerVariants: Variants = {
    ...containerVariants,
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: initialDelay,
      },
    },
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={customContainerVariants}
      className={className}
    >
      {children}
    </motion.div>
  )
})

AnimatedGrid.displayName = 'AnimatedGrid'

export const AnimatedGridItem = memo<{ children: ReactNode; className?: string }>(
  ({ children, className }) => {
    return (
      <motion.div variants={itemVariants} className={className}>
        {children}
      </motion.div>
    )
  }
)

AnimatedGridItem.displayName = 'AnimatedGridItem'

export default AnimatedGrid
