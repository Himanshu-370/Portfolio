"use client"

import { useRef, useState, useEffect, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, Float } from "@react-three/drei"
import { Suspense } from "react"
import * as THREE from "three"

const _targetScale = new THREE.Vector3()

function InteractiveTorus({ reducedMotion }: { reducedMotion: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const mousePosition = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mousePosition.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      }
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x = mousePosition.current.y * 0.3
      meshRef.current.rotation.y = mousePosition.current.x * 0.3
      if (!reducedMotion) meshRef.current.rotation.z += 0.01
      const s = hovered ? 1.2 : 1
      _targetScale.set(s, s, s)
      meshRef.current.scale.lerp(_targetScale, 0.1)
    }
  })

  return (
    <Float speed={reducedMotion ? 0 : 1.5} rotationIntensity={reducedMotion ? 0 : 0.5} floatIntensity={reducedMotion ? 0 : 0.5}>
      <mesh ref={meshRef} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
        <torusGeometry args={[2, 0.8, 16, 100]} />
        <meshStandardMaterial color={hovered ? "#3b82f6" : "#10b981"} wireframe transparent opacity={0.8} />
      </mesh>
    </Float>
  )
}

function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null)
  const particlesCount = 100

  const positions = useMemo(() => {
    const arr = new Float32Array(particlesCount * 3)
    for (let i = 0; i < arr.length; i++) {
      arr[i] = (Math.random() - 0.5) * 10
    }
    return arr
  }, [])

  useFrame(() => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.002
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#ffffff" transparent opacity={0.6} />
    </points>
  )
}

function Scene({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
      <InteractiveTorus reducedMotion={reducedMotion} />
      <FloatingParticles />
      <Environment preset="night" />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={!reducedMotion}
        autoRotateSpeed={0.5}
      />
    </>
  )
}

export default function ThreeScene() {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  return (
    <Canvas camera={{ position: [0, 0, 8] }}>
      <Suspense fallback={null}>
        <Scene reducedMotion={reducedMotion} />
      </Suspense>
    </Canvas>
  )
}
