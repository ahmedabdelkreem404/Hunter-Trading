import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Text, Stars } from '@react-three/drei'
import * as THREE from 'three'

function Candlestick({ position, height, color, isBullish }) {
  const bodyHeight = Math.abs(height) * 0.6
  const wickHeight = Math.abs(height) * 0.4
  const bodyY = position[1] + height / 2 - bodyHeight / 2
  
  return (
    <group position={position}>
      {/* Candle body */}
      <mesh position={[0, bodyY, 0]}>
        <boxGeometry args={[0.15, bodyHeight, 0.15]} />
        <meshStandardMaterial 
          color={isBullish ? '#00ff88' : '#ff4757'} 
          emissive={isBullish ? '#00ff88' : '#ff4757'}
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      {/* Upper wick */}
      <mesh position={[0, position[1] + height + wickHeight / 2, 0]}>
        <boxGeometry args={[0.03, wickHeight, 0.03]} />
        <meshStandardMaterial color={isBullish ? '#00ff88' : '#ff4757'} />
      </mesh>
      {/* Lower wick */}
      <mesh position={[0, position[1] - wickHeight / 2, 0]}>
        <boxGeometry args={[0.03, wickHeight, 0.03]} />
        <meshStandardMaterial color={isBullish ? '#00ff88' : '#ff4757'} />
      </mesh>
    </group>
  )
}

function CandlestickChart() {
  const groupRef = useRef()
  const candlesRef = useRef([])
  
  const candleData = useMemo(() => {
    const data = []
    let basePrice = 0
    for (let i = 0; i < 20; i++) {
      const change = (Math.random() - 0.5) * 0.5
      const high = Math.random() * 0.3 + 0.1
      const low = Math.random() * 0.3 + 0.1
      basePrice += change
      data.push({
        open: basePrice,
        high: basePrice + high,
        low: basePrice - low,
        close: basePrice + (Math.random() - 0.5) * 0.4,
        isBullish: Math.random() > 0.4
      })
    }
    return data
  }, [])
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(time * 0.5) * 0.1
    }
  })
  
  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {candleData.map((candle, i) => (
        <Candlestick
          key={i}
          position={[(i - 10) * 0.4, candle.close * 0.5, 0]}
          height={(candle.high - candle.low) * 0.5}
          color={candle.isBullish ? '#00ff88' : '#ff4757'}
          isBullish={candle.isBullish}
        />
      ))}
    </group>
  )
}

function Globe() {
  const globeRef = useRef()
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (globeRef.current) {
      globeRef.current.rotation.y = time * 0.1
    }
  })
  
  return (
    <group position={[-3, 0.5, -2]}>
      <mesh ref={globeRef}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial 
          color="#0066ff"
          wireframe
          transparent
          opacity={0.3}
          emissive="#0066ff"
          emissiveIntensity={0.2}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.19, 32, 32]} />
        <meshStandardMaterial 
          color="#0a0a0f"
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  )
}

function FloatingLine({ position, rotation, color }) {
  const lineRef = useRef()
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (lineRef.current) {
      lineRef.current.position.y = position[1] + Math.sin(time + position[0]) * 0.3
    }
  })
  
  const points = useMemo(() => {
    const pts = []
    for (let i = 0; i < 20; i++) {
      pts.push(new THREE.Vector3(i * 0.3 - 3, Math.sin(i * 0.5) * 0.5, 0))
    }
    return pts
  }, [])
  
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(points)
    return geo
  }, [points])
  
  return (
    <line ref={lineRef} geometry={geometry} position={position}>
      <lineBasicMaterial color={color} transparent opacity={0.6} />
    </line>
  )
}

function FloatingProfit({ position, text, color }) {
  const meshRef = useRef()
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(time * 2) * 0.2
      meshRef.current.material.opacity = 0.5 + Math.sin(time * 3) * 0.3
    }
  })
  
  return (
    <Float speed={2} rotationIntensity={0} floatIntensity={0.5}>
      <Text
        ref={meshRef}
        position={position}
        fontSize={0.25}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {text}
      </Text>
    </Float>
  )
}

function TradingParticles() {
  const particlesRef = useRef()
  const count = 100
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4
    }
    return pos
  }, [])
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.05
      const positions = particlesRef.current.geometry.attributes.position.array
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] += Math.sin(time + i) * 0.002
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#00ff88"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

export default function TradingScene() {
  return (
    <group>
      <ambientLight intensity={0.3} color="#1a1a2e" />
      <pointLight position={[5, 5, 5]} intensity={1.5} color="#00ff88" />
      <pointLight position={[-5, -3, 3]} intensity={0.8} color="#0066ff" />
      <pointLight position={[0, -5, 0]} intensity={0.5} color="#ff6b35" />
      
      <CandlestickChart />
      <Globe />
      
      <FloatingLine position={[0, -1.5, 1]} rotation={[0, 0, 0]} color="#00ff88" />
      <FloatingLine position={[0, 0.5, 1.5]} rotation={[0, 0, 0]} color="#0066ff" />
      <FloatingLine position={[0, -0.5, 2]} rotation={[0, 0, 0]} color="#ff6b35" />
      
      <FloatingProfit position={[2, 1.5, 1]} text="+$1,247" color="#00ff88" />
      <FloatingProfit position={[-1.5, 2, 0.5]} text="+52 PIPS" color="#00ff88" />
      <FloatingProfit position={[1, -1, 1.5]} text="87% WIN" color="#ff6b35" />
      
      <TradingParticles />
      <Stars radius={20} depth={50} count={500} factor={2} saturation={0} fade speed={0.5} />
      
      {/* Grid floor */}
      <gridHelper args={[20, 20, '#1a1a2e', '#1a1a2e']} position={[0, -2.5, 0]} />
    </group>
  )
}
