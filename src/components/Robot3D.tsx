import { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, ContactShadows, Environment } from '@react-three/drei'
import * as THREE from 'three'

// ---- 3D 女性机器人模型 ----
function Robot({ speaking = false }) {
  const group = useRef<THREE.Group>(null)
  const bodyRef = useRef<THREE.Mesh>(null)
  const headRef = useRef<THREE.Mesh>(null)
  const leftEyeRef = useRef<THREE.Mesh>(null)
  const rightEyeRef = useRef<THREE.Mesh>(null)
  const mouthRef = useRef<THREE.Mesh>(null)
  const leftArmRef = useRef<THREE.Group>(null)
  const rightArmRef = useRef<THREE.Group>(null)
  const antennaLightRef = useRef<THREE.Mesh>(null)

  const [blinkFrame, setBlinkFrame] = useState(0)
  const [wavePhase, setWavePhase] = useState(0)

  // 眨眼定时器
  useEffect(() => {
    const interval = setInterval(() => {
      setBlinkFrame(prev => (prev + 1) % 10) // 每10帧眨一次眼（约2秒）
    }, 200)
    return () => clearInterval(interval)
  }, [])

  // 挥手定时器
  useEffect(() => {
    const interval = setInterval(() => {
      setWavePhase(prev => (prev + 1) % 120) // 每120帧挥一次手（约6秒）
    }, 50)
    return () => clearInterval(interval)
  }, [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    // 身体呼吸动画
    if (bodyRef.current) {
      bodyRef.current.position.y = Math.sin(t * 1.5) * 0.03
      bodyRef.current.scale.y = 1 + Math.sin(t * 1.5) * 0.008
    }

    // 头部轻微摇摆
    if (headRef.current) {
      headRef.current.rotation.z = Math.sin(t * 0.8) * 0.02
      headRef.current.rotation.x = Math.sin(t * 0.5) * 0.015
    }

    // 眨眼动画
    const isBlinking = blinkFrame === 0 || blinkFrame === 1
    if (leftEyeRef.current) {
      leftEyeRef.current.scale.y = isBlinking ? 0.1 : 1
    }
    if (rightEyeRef.current) {
      rightEyeRef.current.scale.y = isBlinking ? 0.1 : 1
    }

    // 说话时嘴巴动
    if (mouthRef.current) {
      const mouthFreq = speaking ? 5 : 1
      const mouthAmp = speaking ? 0.08 : 0.02
      mouthRef.current.scale.y = 1 + Math.sin(t * mouthFreq) * mouthAmp
      mouthRef.current.position.y = -0.28 + Math.sin(t * mouthFreq) * mouthAmp * 0.5
    }

    // 天线发光闪烁
    if (antennaLightRef.current) {
      const glow = 0.6 + Math.sin(t * 2) * 0.4
      ;(antennaLightRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = glow
    }

    // 左手缓慢挥手
    if (leftArmRef.current) {
      const wave = Math.sin(t * 0.5) * 0.1
      leftArmRef.current.rotation.z = -0.3 + wave
    }

    // 右手偶尔挥手（wavePhase触发）
    if (rightArmRef.current) {
      const isWaving = wavePhase < 20
      if (isWaving) {
        rightArmRef.current.rotation.z = -0.3 + Math.sin(t * 8) * 0.3
      } else {
        rightArmRef.current.rotation.z = 0.3 + Math.sin(t * 0.3) * 0.05
      }
    }

    // 整体微浮动
    if (group.current) {
      group.current.position.y = Math.sin(t * 0.8) * 0.05
    }
  })

  const blueColor = '#3b82f6'
  const lightBlue = '#60a5fa'
  const whiteColor = '#f0f4ff'
  const skinColor = '#fce4ec'

  return (
    <group ref={group}>
      {/* ---- 身体（圆润椭圆） ---- */}
      <mesh ref={bodyRef} position={[0, -0.1, 0]}>
        <capsuleGeometry args={[0.35, 0.5, 8, 16]} />
        <meshStandardMaterial color={whiteColor} metalness={0.1} roughness={0.3} />
      </mesh>

      {/* 身体上的蓝色装饰条 */}
      <mesh position={[0, -0.1, 0.36]}>
        <boxGeometry args={[0.3, 0.02, 0.02]} />
        <meshStandardMaterial color={lightBlue} emissive={lightBlue} emissiveIntensity={0.3} />
      </mesh>

      {/* 领结/蝴蝶结装饰 */}
      <mesh position={[0, 0.28, 0.36]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color={blueColor} emissive={blueColor} emissiveIntensity={0.2} />
      </mesh>

      {/* ---- 头部 ---- */}
      <group position={[0, 0.55, 0]}>
        {/* 头部主体 */}
        <mesh ref={headRef}>
          <sphereGeometry args={[0.25, 24, 24]} />
          <meshStandardMaterial color={whiteColor} metalness={0.05} roughness={0.2} />
        </mesh>

        {/* 耳朵装饰（小圆球） */}
        <mesh position={[-0.28, 0.03, 0]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color={lightBlue} metalness={0.3} roughness={0.3} />
        </mesh>
        <mesh position={[0.28, 0.03, 0]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color={lightBlue} metalness={0.3} roughness={0.3} />
        </mesh>

        {/* 左眼 */}
        <mesh ref={leftEyeRef} position={[-0.1, 0.06, 0.22]}>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        {/* 左眼高光 */}
        <mesh position={[-0.09, 0.07, 0.24]}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshStandardMaterial color="white" />
        </mesh>

        {/* 右眼 */}
        <mesh ref={rightEyeRef} position={[0.1, 0.06, 0.22]}>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        {/* 右眼高光 */}
        <mesh position={[0.11, 0.07, 0.24]}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshStandardMaterial color="white" />
        </mesh>

        {/* 嘴巴 */}
        <mesh ref={mouthRef} position={[0, -0.04, 0.22]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color={skinColor} />
        </mesh>

        {/* 腮红 */}
        <mesh position={[-0.15, -0.02, 0.2]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color="#ffcdd2" transparent opacity={0.4} />
        </mesh>
        <mesh position={[0.15, -0.02, 0.2]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color="#ffcdd2" transparent opacity={0.4} />
        </mesh>

        {/* 天线 */}
        <mesh position={[0, 0.32, 0]}>
          <cylinderGeometry args={[0.015, 0.025, 0.08, 6]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.5} roughness={0.3} />
        </mesh>
        <mesh ref={antennaLightRef} position={[0, 0.38, 0]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshStandardMaterial color={lightBlue} emissive={lightBlue} emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* ---- 左臂 ---- */}
      <group ref={leftArmRef} position={[-0.42, 0.1, 0]}>
        <mesh position={[0, -0.15, 0]}>
          <capsuleGeometry args={[0.06, 0.25, 6, 12]} />
          <meshStandardMaterial color={whiteColor} metalness={0.1} roughness={0.3} />
        </mesh>
        {/* 手 */}
        <mesh position={[0, -0.33, 0]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color={skinColor} />
        </mesh>
      </group>

      {/* ---- 右臂 ---- */}
      <group ref={rightArmRef} position={[0.42, 0.1, 0]}>
        <mesh position={[0, -0.15, 0]}>
          <capsuleGeometry args={[0.06, 0.25, 6, 12]} />
          <meshStandardMaterial color={whiteColor} metalness={0.1} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.33, 0]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color={skinColor} />
        </mesh>
      </group>

      {/* ---- 腿部 ---- */}
      <mesh position={[-0.1, -0.5, 0]}>
        <capsuleGeometry args={[0.06, 0.2, 6, 12]} />
        <meshStandardMaterial color={blueColor} metalness={0.2} roughness={0.4} />
      </mesh>
      <mesh position={[0.1, -0.5, 0]}>
        <capsuleGeometry args={[0.06, 0.2, 6, 12]} />
        <meshStandardMaterial color={blueColor} metalness={0.2} roughness={0.4} />
      </mesh>

      {/* 底座阴影 */}
      <mesh position={[0, -0.62, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.15, 0.25, 16]} />
        <meshStandardMaterial color={blueColor} transparent opacity={0.15} />
      </mesh>
    </group>
  )
}

// ---- 场景背景 ----
function SceneBackground() {
  return (
    <>
      {/* 环境光 */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
      <directionalLight position={[-3, 2, -3]} intensity={0.3} color="#60a5fa" />
      <spotLight position={[0, 3, 2]} intensity={0.4} color="#93c5fd" />
      <pointLight position={[0, -1, 2]} intensity={0.3} color="#3b82f6" />
      
      <ContactShadows 
        position={[0, -0.65, 0]} 
        opacity={0.3} 
        scale={1.2} 
        blur={2} 
        far={1} 
      />
      <Environment preset="city" />
    </>
  )
}

// ---- 摄像机控制器 ----
function CameraController({ mobile = false }) {
  const { camera } = useThree()
  useEffect(() => {
    camera.position.set(0, 0.08, 4.0)
    camera.lookAt(0, 0.1, 0)
  }, [camera, mobile])
  return null
}

// ---- 主组件 ----
interface Robot3DProps {
  speaking?: boolean
  size?: number
}

export default function Robot3D({ speaking = false, size = 120 }: Robot3DProps) {
  const [mobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 640)

  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      <Canvas
        style={{ width: '100%', height: '100%' }}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0.08, 4.0], fov: 28 }}
      >
        <CameraController mobile={mobile} />
        <Float speed={1.0} rotationIntensity={0.05} floatIntensity={0.03}>
          <Robot speaking={speaking} />
        </Float>
        <SceneBackground />
      </Canvas>
    </div>
  )
}
