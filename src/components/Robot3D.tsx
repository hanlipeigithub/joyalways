import { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, ContactShadows, Environment } from '@react-three/drei'
import * as THREE from 'three'

function Robot({ speaking = false }) {
  const group = useRef<THREE.Group>(null)
  const bodyRef = useRef<THREE.Mesh>(null)
  const headRef = useRef<THREE.Group>(null)
  const leftEyeRef = useRef<THREE.Mesh>(null)
  const rightEyeRef = useRef<THREE.Mesh>(null)
  const mouthRef = useRef<THREE.Mesh>(null)
  const leftArmRef = useRef<THREE.Group>(null)
  const rightArmRef = useRef<THREE.Group>(null)
  const antennaLightRef = useRef<THREE.Mesh>(null)
  const glowRingRef = useRef<THREE.Mesh>(null)

  const [blinkTimer, setBlinkTimer] = useState(0)
  const [waveTimer, setWaveTimer] = useState(0)
  const [headTiltDir, setHeadTiltDir] = useState(1)

  // Blink every 2.5-4s
  useEffect(() => {
    const interval = setInterval(() => setBlinkTimer(t => (t + 1) % 12), 250)
    return () => clearInterval(interval)
  }, [])

  // Wave periodically + head tilt
  useEffect(() => {
    const interval = setInterval(() => setWaveTimer(t => (t + 1) % 160), 60)
    return () => clearInterval(interval)
  }, [])

  // Head tilt direction change
  useEffect(() => {
    const interval = setInterval(() => setHeadTiltDir(d => -d), 3000)
    return () => clearInterval(interval)
  }, [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    // === BODY: big noticeable breath ===
    if (bodyRef.current) {
      const breath = Math.sin(t * 1.8) * 0.06
      bodyRef.current.position.y = breath
      bodyRef.current.scale.y = 1 + Math.sin(t * 1.8) * 0.015
      bodyRef.current.scale.x = 1 + Math.sin(t * 1.8 + Math.PI) * 0.008
    }

    // === HEAD: gentle sway + tilt ===
    if (headRef.current) {
      headRef.current.rotation.z = Math.sin(t * 0.6) * 0.04 + Math.sin(t * 1.2) * 0.02
      headRef.current.rotation.x = Math.sin(t * 0.4) * 0.03 + headTiltDir * 0.02
      headRef.current.rotation.y = Math.sin(t * 0.3) * 0.05
    }

    // === EYES: blink ===
    const isBlinking = blinkTimer === 0 || blinkTimer === 1 || blinkTimer === 2
    const eyeScaleY = isBlinking ? 0.08 : 1
    if (leftEyeRef.current) leftEyeRef.current.scale.y = eyeScaleY
    if (rightEyeRef.current) rightEyeRef.current.scale.y = eyeScaleY

    // === MOUTH: animated (bigger when speaking) ===
    if (mouthRef.current) {
      const freq = speaking ? 6 : 1.5
      const amp = speaking ? 0.15 : 0.04
      mouthRef.current.scale.y = 1 + Math.sin(t * freq) * amp
      mouthRef.current.scale.x = 1 + Math.sin(t * freq * 0.7) * amp * 0.5
      mouthRef.current.position.y = -0.04 + Math.sin(t * freq) * amp * 0.4
    }

    // === ANTENNA: dramatic pulsing glow ===
    if (antennaLightRef.current) {
      const mat = antennaLightRef.current.material as THREE.MeshStandardMaterial
      const glow = 0.5 + Math.sin(t * 3) * 0.5
      mat.emissiveIntensity = glow
    }

    // === GLOW RING: rotating light ring ===
    if (glowRingRef.current) {
      glowRingRef.current.rotation.y = t * 0.5
      const mat = glowRingRef.current.material as THREE.MeshStandardMaterial
      mat.opacity = 0.15 + Math.sin(t * 2) * 0.1
    }

    // === ARMS: expressive movement ===
    // Left arm: gentle swing
    if (leftArmRef.current) {
      leftArmRef.current.rotation.z = -0.2 + Math.sin(t * 0.7) * 0.15
      leftArmRef.current.rotation.x = Math.sin(t * 0.5) * 0.1
    }

    // Right arm: periodic big wave (every ~9.6s)
    if (rightArmRef.current) {
      const isWaving = waveTimer < 30
      if (isWaving) {
        // Big excited wave
        const waveSpeed = t * 6
        rightArmRef.current.rotation.z = -0.3 + Math.sin(waveSpeed) * 0.5
        rightArmRef.current.rotation.x = Math.sin(waveSpeed * 0.5) * 0.2
      } else {
        // Idle gentle swing
        rightArmRef.current.rotation.z = 0.3 + Math.sin(t * 0.4) * 0.08
        rightArmRef.current.rotation.x = Math.sin(t * 0.3) * 0.05
      }
    }

    // === WHOLE BODY: bouncy float ===
    if (group.current) {
      group.current.position.y = Math.sin(t * 0.9) * 0.06
      group.current.rotation.z = Math.sin(t * 0.5) * 0.02
    }
  })

  const blueColor = '#3b82f6'
  const lightBlue = '#60a5fa'
  const whiteColor = '#f0f4ff'
  const skinColor = '#fce4ec'

  return (
    <group ref={group}>
      {/* 浮动光环 */}
      <mesh ref={glowRingRef} position={[0, -0.55, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.3, 0.45, 32]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.15} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>

      {/* 身体 */}
      <mesh ref={bodyRef} position={[0, -0.1, 0]}>
        <capsuleGeometry args={[0.35, 0.5, 8, 16]} />
        <meshStandardMaterial color={whiteColor} metalness={0.15} roughness={0.25} />
      </mesh>

      {/* 胸前蓝色灯条 */}
      <mesh position={[0, -0.1, 0.36]}>
        <boxGeometry args={[0.3, 0.02, 0.02]} />
        <meshStandardMaterial color={lightBlue} emissive={lightBlue} emissiveIntensity={0.5} />
      </mesh>
      {/* 第二根灯条 */}
      <mesh position={[0, -0.06, 0.36]}>
        <boxGeometry args={[0.2, 0.015, 0.015]} />
        <meshStandardMaterial color="#93c5fd" emissive="#93c5fd" emissiveIntensity={0.3} />
      </mesh>

      {/* 蝴蝶结 */}
      <mesh position={[0, 0.28, 0.36]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color={blueColor} emissive={blueColor} emissiveIntensity={0.3} />
      </mesh>

      {/* 头部 */}
      <group ref={headRef} position={[0, 0.55, 0]}>
        <mesh>
          <sphereGeometry args={[0.25, 24, 24]} />
          <meshStandardMaterial color={whiteColor} metalness={0.08} roughness={0.15} />
        </mesh>

        {/* 耳朵 */}
        <mesh position={[-0.28, 0.03, 0]}>
          <sphereGeometry args={[0.055, 8, 8]} />
          <meshStandardMaterial color={lightBlue} metalness={0.3} roughness={0.3} />
        </mesh>
        <mesh position={[0.28, 0.03, 0]}>
          <sphereGeometry args={[0.055, 8, 8]} />
          <meshStandardMaterial color={lightBlue} metalness={0.3} roughness={0.3} />
        </mesh>

        {/* 眼睛 */}
        <mesh ref={leftEyeRef} position={[-0.1, 0.06, 0.22]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[-0.09, 0.075, 0.245]}>
          <sphereGeometry args={[0.018, 8, 8]} />
          <meshStandardMaterial color="white" />
        </mesh>

        <mesh ref={rightEyeRef} position={[0.1, 0.06, 0.22]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0.11, 0.075, 0.245]}>
          <sphereGeometry args={[0.018, 8, 8]} />
          <meshStandardMaterial color="white" />
        </mesh>

        {/* 嘴巴 */}
        <mesh ref={mouthRef} position={[0, -0.04, 0.22]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshStandardMaterial color={skinColor} />
        </mesh>

        {/* 腮红 */}
        <mesh position={[-0.15, -0.02, 0.2]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshStandardMaterial color="#ffcdd2" transparent opacity={0.5} />
        </mesh>
        <mesh position={[0.15, -0.02, 0.2]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshStandardMaterial color="#ffcdd2" transparent opacity={0.5} />
        </mesh>

        {/* 天线 */}
        <mesh position={[0, 0.32, 0]}>
          <cylinderGeometry args={[0.015, 0.025, 0.08, 6]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.5} roughness={0.3} />
        </mesh>
        <mesh ref={antennaLightRef} position={[0, 0.38, 0]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color={lightBlue} emissive={lightBlue} emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* 左臂 */}
      <group ref={leftArmRef} position={[-0.42, 0.1, 0]}>
        <mesh position={[0, -0.15, 0]}>
          <capsuleGeometry args={[0.065, 0.25, 6, 12]} />
          <meshStandardMaterial color={whiteColor} metalness={0.1} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.33, 0]}>
          <sphereGeometry args={[0.055, 8, 8]} />
          <meshStandardMaterial color={skinColor} />
        </mesh>
      </group>

      {/* 右臂 */}
      <group ref={rightArmRef} position={[0.42, 0.1, 0]}>
        <mesh position={[0, -0.15, 0]}>
          <capsuleGeometry args={[0.065, 0.25, 6, 12]} />
          <meshStandardMaterial color={whiteColor} metalness={0.1} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.33, 0]}>
          <sphereGeometry args={[0.055, 8, 8]} />
          <meshStandardMaterial color={skinColor} />
        </mesh>
      </group>

      {/* 腿 */}
      <mesh position={[-0.1, -0.5, 0]}>
        <capsuleGeometry args={[0.065, 0.2, 6, 12]} />
        <meshStandardMaterial color={blueColor} metalness={0.2} roughness={0.4} />
      </mesh>
      <mesh position={[0.1, -0.5, 0]}>
        <capsuleGeometry args={[0.065, 0.2, 6, 12]} />
        <meshStandardMaterial color={blueColor} metalness={0.2} roughness={0.4} />
      </mesh>

      {/* 底座阴影 */}
      <mesh position={[0, -0.62, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.15, 0.3, 16]} />
        <meshBasicMaterial color={blueColor} transparent opacity={0.12} />
      </mesh>
    </group>
  )
}

function SceneBackground() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 5, 4]} intensity={0.9} color="#ffffff" />
      <directionalLight position={[-3, 2, -3]} intensity={0.35} color="#60a5fa" />
      <spotLight position={[0, 3, 2]} intensity={0.5} color="#93c5fd" />
      <pointLight position={[0, -1, 2]} intensity={0.35} color="#3b82f6" />
      <ContactShadows position={[0, -0.65, 0]} opacity={0.35} scale={1.3} blur={2.5} far={1} />
      <Environment preset="city" />
    </>
  )
}

function CameraController() {
  const { camera } = useThree()
  useEffect(() => {
    camera.position.set(0, 0.08, 3.6)
    camera.lookAt(0, 0.1, 0)
  }, [camera])
  return null
}

interface Robot3DProps {
  speaking?: boolean
  size?: number
}

export default function Robot3D({ speaking = false, size = 120 }: Robot3DProps) {
  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      <Canvas
        style={{ width: '100%', height: '100%' }}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0.08, 3.6], fov: 30 }}
      >
        <CameraController />
        <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.05}>
          <Robot speaking={speaking} />
        </Float>
        <SceneBackground />
      </Canvas>
    </div>
  )
}
