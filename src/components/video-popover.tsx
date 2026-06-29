"use client"

import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import {
  VideoPlayer,
  VideoPlayerContent,
  VideoPlayerControlBar,
  VideoPlayerPlayButton,
  VideoPlayerTimeRange,
  VideoPlayerMuteButton,
} from './ui/skiper-ui/skiper67'

interface VideoPopOverProps {
  src: string
  open: boolean
  onClose: () => void
  aspectRatio?: number
  showMute?: boolean
  autoPlay?: boolean
}

const CLIP_CLOSED = "inset(63.5% 43.5% 33.5% 43.5%)"
const CLIP_OPEN   = "inset(0 0 0 0)"

const SPRING = {
  type: 'spring' as const,
  stiffness: 150,
  damping: 20,
  duration: .5,
}

export function VideoPopOver({
  src,
  open,
  onClose,
  aspectRatio,
  showMute = true,
  autoPlay = true,
}: VideoPopOverProps) {
  const ratio = aspectRatio ?? 16 / 9
  const isPortrait = ratio < 1

  const panelStyle = isPortrait
  ? {
      width: 'min(95vw, 40vh)',
      height: `calc(min(95vw, 40vh) / ${ratio})`,
      maxHeight: '95vh',
    }
  : {
      width: '100%',
      maxWidth: '80rem',
      aspectRatio: ratio,
    }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[101] flex items-center justify-center">

          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-lg"
            onClick={onClose}
          />

          {/* Video panel */}
          <motion.div
            initial={{ clipPath: CLIP_CLOSED, opacity: 0 }}
            animate={{ clipPath: CLIP_OPEN, opacity: 1 }}
            exit={{
              clipPath: CLIP_CLOSED,
              opacity: 0,
              transition: {
                ...SPRING,
                opacity: { duration: 0.2, delay: 0.8 },
              },
            }}
            transition={SPRING}
            className="relative"
            style={panelStyle}
          >
            <VideoPlayer style={{ width: '100%', height: '100%' }}>
              <VideoPlayerContent
                src={src}
                autoPlay={autoPlay}
                slot="media"
                className="w-full object-cover"
                style={{ width: '100%', height: '100%' }}
              />

              <span
                onClick={onClose}
                className="absolute right-2 top-2 z-10 cursor-pointer rounded-full p-1"
              >
                <Plus className="size-5 rotate-45 text-white" />
              </span>

              <VideoPlayerControlBar className="absolute bottom-0 left-1/2 flex w-full max-w-7xl -translate-x-1/2 items-center justify-center px-5 mix-blend-exclusion md:px-10 md:py-5">
                <VideoPlayerPlayButton className="h-4 bg-transparent" />
                <VideoPlayerTimeRange className="bg-transparent" />
                {showMute && (
                  <VideoPlayerMuteButton className="size-4 bg-transparent" />
                )}
              </VideoPlayerControlBar>

            </VideoPlayer>
          </motion.div>

        </div>
      )}
    </AnimatePresence>
  )
}