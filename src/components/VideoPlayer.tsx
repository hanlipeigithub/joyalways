import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react'

interface VideoPlayerProps {
  src: string
  poster?: string
  title?: string
  className?: string
  overlay?: boolean
  autoPlay?: boolean
  loop?: boolean
  muted?: boolean
  controls?: boolean
}

export default function VideoPlayer({
  src,
  poster,
  title,
  className = '',
  overlay = true,
  autoPlay = false,
  loop = false,
  muted = false,
  controls = true,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(autoPlay)
  const [isMuted, setIsMuted] = useState(muted)
  const [progress, setProgress] = useState(0)
  const [showControls, setShowControls] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const onTimeUpdate = () => setProgress((video.currentTime / (video.duration || 1)) * 100)
    const onLoaded = () => setLoaded(true)
    const onEnded = () => setPlaying(false)

    video.addEventListener('timeupdate', onTimeUpdate)
    video.addEventListener('loadeddata', onLoaded)
    video.addEventListener('ended', onEnded)

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate)
      video.removeEventListener('loadeddata', onLoaded)
      video.removeEventListener('ended', onEnded)
    }
  }, [])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.play()
      setPlaying(true)
    } else {
      video.pause()
      setPlaying(false)
    }
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setIsMuted(!isMuted)
  }

  const handleFullscreen = () => {
    const el = containerRef.current
    if (!el) return
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      el.requestFullscreen()
    }
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current
    if (!video) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pos = (e.clientX - rect.left) / rect.width
    video.currentTime = pos * video.duration
  }

  return (
    <div
      ref={containerRef}
      className={`group relative overflow-hidden rounded-2xl ${className}`}
      style={{ backgroundColor: '#0f172a' }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* 视频元素 */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline
        className="h-full w-full object-cover"
        style={{ aspectRatio: '16/9' }}
      />

      {/* 加载状态 - 精美渐变骨架 */}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: '#0f172a' }}>
          <div className="flex flex-col items-center gap-3">
            <div className="h-12 w-12 animate-pulse rounded-full border-2 border-t-transparent" style={{ borderColor: '#1d4ed8', borderTopColor: 'transparent' }} />
            <span className="text-xs text-gray-500">加载视频中...</span>
          </div>
        </div>
      )}

      {/* 渐变叠加层 - 底部到透明 */}
      {overlay && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      )}

      {/* 中间播放按钮（暂停时显示） */}
      {!playing && loaded && (
        <button
          onClick={togglePlay}
          className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full p-4 text-white transition-all duration-300 hover:scale-110"
          style={{ backgroundColor: 'rgba(29,78,216,0.85)', backdropFilter: 'blur(4px)' }}
        >
          <Play size={28} fill="white" />
        </button>
      )}

      {/* 控制栏 - 底部浮出 */}
      {controls && loaded && (
        <div
          className={`absolute bottom-0 left-0 right-0 z-10 transition-all duration-300 ${
            showControls || !playing ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
          }`}
        >
          {/* 进度条 */}
          <div
            className="mx-3 mb-1 h-1 cursor-pointer rounded-full transition-all hover:h-1.5"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            onClick={handleProgressClick}
          >
            <div
              className="h-full rounded-full transition-all duration-150"
              style={{ width: `${progress}%`, backgroundColor: '#3b82f6' }}
            />
          </div>

          {/* 按钮栏 */}
          <div className="flex items-center gap-2 px-3 pb-2">
            <button onClick={togglePlay} className="rounded-full p-1.5 text-white/80 transition-colors hover:text-white">
              {playing ? <Pause size={14} /> : <Play size={14} />}
            </button>
            <button onClick={toggleMute} className="rounded-full p-1.5 text-white/80 transition-colors hover:text-white">
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
            {title && <span className="flex-1 truncate text-xs text-white/60 px-2">{title}</span>}
            <button onClick={handleFullscreen} className="rounded-full p-1.5 text-white/80 transition-colors hover:text-white">
              <Maximize size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ──── 全屏背景视频组件 ────
interface HeroVideoProps {
  src: string
  poster?: string
  children?: React.ReactNode
}

export function HeroVideo({ src, poster, children }: HeroVideoProps) {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* 背景视频 */}
      <video
        src={src}
        poster={poster}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* 深色渐变叠加 */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
      {/* 子内容 */}
      <div className="relative z-10 flex h-full w-full items-center justify-center">
        {children}
      </div>
    </div>
  )
}
