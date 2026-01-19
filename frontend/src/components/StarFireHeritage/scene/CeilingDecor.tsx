import React from 'react'
import { Box, Cylinder, Sphere, Torus, Text } from '@react-three/drei'
import * as THREE from 'three'

// 共享材质 - 优化性能
const goldMaterial = new THREE.MeshStandardMaterial({ 
    color: "#c9a55c", 
    roughness: 0.3, 
    metalness: 0.7 
})
const panelMaterial = new THREE.MeshStandardMaterial({ 
    color: "#f0ebe0", 
    roughness: 0.5 
})
const borderMaterial = new THREE.MeshStandardMaterial({ 
    color: "#c9a55c", 
    roughness: 0.3, 
    metalness: 0.6 
})

// 齿轮装饰组件 - 兵工主题
const GearDecoration = React.memo(() => {
    return (
        <group>
            {/* 外圈齿轮 */}
            {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i * Math.PI * 2) / 12
                const radius = 0.8
                return (
                    <Box 
                        key={i}
                        args={[0.15, 0.1, 0.3]} 
                        position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}
                        rotation={[0, angle, 0]}
                    >
                        <primitive object={goldMaterial} attach="material" />
                    </Box>
                )
            })}
            {/* 中心圆 */}
            <Cylinder args={[0.4, 0.4, 0.1, 16]} position={[0, 0, 0]}>
                <primitive object={goldMaterial} attach="material" />
            </Cylinder>
        </group>
    )
})

// 星徽装饰组件
const StarDecoration = React.memo(() => {
    return (
        <group>
            {/* 五角星 - 简化版 */}
            {[0, 72, 144, 216, 288].map((angle, i) => {
                const rad = (angle * Math.PI) / 180
                const radius = 0.5
                return (
                    <Box 
                        key={i}
                        args={[0.2, 0.1, 0.6]} 
                        position={[Math.cos(rad) * radius, 0, Math.sin(rad) * radius]}
                        rotation={[0, rad, 0]}
                    >
                        <primitive object={goldMaterial} attach="material" />
                    </Box>
                )
            })}
            <Cylinder args={[0.2, 0.2, 0.1, 8]} position={[0, 0, 0]}>
                <primitive object={goldMaterial} attach="material" />
            </Cylinder>
        </group>
    )
})

// 通风口装饰
const VentDecoration = React.memo(() => {
    return (
        <group>
            {/* 通风口网格 */}
            <Box args={[1.5, 0.05, 1.5]} position={[0, 0, 0]}>
                <meshStandardMaterial color="#2a2a2a" roughness={0.4} metalness={0.7} />
            </Box>
            {/* 网格线条 */}
            {[-0.5, 0, 0.5].map((x) => (
                <Box key={`v-${x}`} args={[0.02, 0.06, 1.5]} position={[x, 0, 0]}>
                    <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
                </Box>
            ))}
            {[-0.5, 0, 0.5].map((z) => (
                <Box key={`h-${z}`} args={[1.5, 0.06, 0.02]} position={[0, 0, z]}>
                    <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
                </Box>
            ))}
        </group>
    )
})

// 天花板装饰穹顶 - 优化版
export const CeilingDome = React.memo(({ position }: { position: [number, number, number] }) => {
    return (
        <group position={position}>
            {/* 穹顶底座 - 金色装饰环 */}
            <Cylinder args={[5, 5, 0.2, 16]} position={[0, 0, 0]}>
                <primitive object={goldMaterial} attach="material" />
            </Cylinder>
            
            {/* 内圈装饰 */}
            <Cylinder args={[4.8, 4.8, 0.15, 16]} position={[0, -0.05, 0]}>
                <meshStandardMaterial color="#8b7355" roughness={0.4} metalness={0.6} />
            </Cylinder>
            
            {/* 简化的穹顶 */}
            <Cylinder args={[4.5, 0.5, 3, 16]} position={[0, 1.5, 0]}>
                <meshStandardMaterial color="#f8f5ef" roughness={0.4} />
            </Cylinder>
            
            {/* 顶部装饰 - 星徽 */}
            <group position={[0, 3.2, 0]}>
                <StarDecoration />
            </group>
            
            {/* 吊灯 - 优化设计 */}
            <Cylinder args={[0.04, 0.04, 1.5, 8]} position={[0, 2, 0]}>
                <primitive object={goldMaterial} attach="material" />
            </Cylinder>
            <Sphere args={[0.4, 8, 6]} position={[0, 1, 0]}>
                <meshStandardMaterial 
                    color="#fff8e0" 
                    emissive="#fff8e0" 
                    emissiveIntensity={0.3} 
                />
            </Sphere>
            <pointLight position={[0, 0.5, 0]} intensity={1.2} distance={25} color="#fff5e0" />
        </group>
    )
})

// 天花板面板 - 优化设计，添加兵工主题装饰
export const CeilingPanel = React.memo(({ position }: { position: [number, number, number] }) => {
    return (
        <group position={position}>
            {/* 主面板 */}
            <Box args={[8, 0.15, 8]}>
                <primitive object={panelMaterial} attach="material" />
            </Box>
            
            {/* 四边金色边框 */}
            <Box args={[8.1, 0.1, 0.1]} position={[0, -0.08, 4]}>
                <primitive object={borderMaterial} attach="material" />
            </Box>
            <Box args={[8.1, 0.1, 0.1]} position={[0, -0.08, -4]}>
                <primitive object={borderMaterial} attach="material" />
            </Box>
            <Box args={[0.1, 0.1, 8.1]} position={[4, -0.08, 0]}>
                <primitive object={borderMaterial} attach="material" />
            </Box>
            <Box args={[0.1, 0.1, 8.1]} position={[-4, -0.08, 0]}>
                <primitive object={borderMaterial} attach="material" />
            </Box>
            
            {/* 四角装饰 - 齿轮 */}
            <group position={[-2.5, -0.05, -2.5]}>
                <GearDecoration />
            </group>
            <group position={[2.5, -0.05, -2.5]}>
                <GearDecoration />
            </group>
            <group position={[-2.5, -0.05, 2.5]}>
                <GearDecoration />
            </group>
            <group position={[2.5, -0.05, 2.5]}>
                <GearDecoration />
            </group>
            
            {/* 中心装饰 - 星徽 */}
            <group position={[0, -0.05, 0]}>
                <StarDecoration />
            </group>
            
            {/* 通风口装饰 */}
            <group position={[-3, -0.05, 0]}>
                <VentDecoration />
            </group>
            <group position={[3, -0.05, 0]}>
                <VentDecoration />
            </group>
            <group position={[0, -0.05, -3]}>
                <VentDecoration />
            </group>
            <group position={[0, -0.05, 3]}>
                <VentDecoration />
            </group>
        </group>
    )
})


