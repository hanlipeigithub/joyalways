import VideoPlayer from '@/components/VideoPlayer'

const VIDEOS = [
  {
    src: '/videos/production-line.mp4',
    title: '智能制造生产线',
    desc: '全自动机器人生产线，AGV 无人搬运与 AI 视觉质检协同作业',
  },
  {
    src: '/videos/lab-research.mp4',
    title: '研发创新中心',
    desc: '理化与微生物实验室，近百名科研人员守护每一片产品的品质',
  },
]

export default function VideoShowcase() {
  return (
    <section className="relative overflow-hidden py-24" style={{ backgroundColor: '#0a0e1a' }}>
      {/* 背景装饰 */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full opacity-[0.03]" style={{ backgroundColor: '#3b82f6' }} />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full opacity-[0.03]" style={{ backgroundColor: '#3b82f6' }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* 标题 */}
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.35em] text-blue-400">
            VIDEO SHOWCASE
          </span>
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            走进<span className="text-blue-400">洁雅</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-400">
            通过视频镜头，深入了解洁雅的智能制造实力与研发创新成果
          </p>
        </div>

        {/* 视频网格 */}
        <div className="grid gap-8 md:grid-cols-2">
          {VIDEOS.map((v, i) => (
            <div key={i} className="group">
              <VideoPlayer
                src={v.src}
                title={v.title}
                className="shadow-2xl transition-shadow duration-500 group-hover:shadow-blue-500/20"
                autoPlay={false}
                loop
                muted
              />
              <div className="mt-4 px-1">
                <h3 className="text-lg font-semibold text-white">{v.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-400">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
