import React from 'react'
import { Box, Cylinder, Sphere } from '@react-three/drei'

// 盆栽 - 简化
export const PlantPot = React.memo(({ position }: { position: [number, number, number] }) => {
    return (
        <group position={position}>
            <Cylinder args={[0.35, 0.25, 0.7, 8]} position={[0, 0.35, 0]}>
                <meshStandardMaterial color="#8b4513" roughness={0.7} />
            </Cylinder>
            <Sphere args={[0.45, 6, 4]} position={[0, 1, 0]}>
                <meshStandardMaterial color="#228b22" roughness={0.8} />
            </Sphere>
        </group>
    )
})

// 旗帜 - 简化
export const Banner = React.memo(({ position, color }: { 
    position: [number, number, number], 
    color: string 
}) => {
    return (
        <group position={position}>
            <Cylinder args={[0.03, 0.03, 2.5, 6]} position={[0, 1.25, 0]}>
                <meshStandardMaterial color="#c9a55c" roughness={0.3} metalness={0.8} />
            </Cylinder>
            <Box args={[1, 1.5, 0.02]} position={[0.5, 1.8, 0]}>
                <meshStandardMaterial color={color} roughness={0.7} />
            </Box>
        </group>
    )
})

// 展示柜 - 简化
export const DisplayCase = React.memo(({ position }: { position: [number, number, number] }) => {
    return (
        <group position={position}>
            <Box args={[1, 0.6, 0.5]} position={[0, 0.3, 0]}>
                <meshStandardMaterial color="#2a2a2a" roughness={0.3} metalness={0.5} />
            </Box>
            <Box args={[0.9, 1, 0.4]} position={[0, 1.1, 0]}>
                <meshStandardMaterial color="#ffffff" opacity={0.2} transparent />
            </Box>
        </group>
    )
})

// 柱子 - 华丽装饰版
export const Column = React.memo(({ position }: { position: [number, number, number] }) => {
    return (
        <group position={position}>
            {/* 柱体主体 */}
            <Cylinder args={[0.5, 0.7, 10, 16]} position={[0, 5, 0]}>
                <meshStandardMaterial color="#f5f0e5" roughness={0.35} metalness={0.1} />
            </Cylinder>
            
            {/* 柱体装饰条纹 */}
            {[2, 4, 6, 8].map((y) => (
                <Cylinder key={y} args={[0.52, 0.52, 0.05, 16]} position={[0, y, 0]}>
                    <meshStandardMaterial color="#c9a55c" roughness={0.3} metalness={0.6} />
                </Cylinder>
            ))}
            
            {/* 柱体装饰环 */}
            {[1, 3, 5, 7, 9].map((y) => (
                <Cylinder key={y} args={[0.48, 0.48, 0.02, 16]} position={[0, y, 0]}>
                    <meshStandardMaterial color="#ffd700" roughness={0.2} metalness={0.8} opacity={0.5} transparent />
                </Cylinder>
            ))}
            
            {/* 底座 - 增强版 */}
            <Box args={[1.8, 0.4, 1.8]} position={[0, 0.2, 0]}>
                <meshStandardMaterial color="#c9a55c" roughness={0.3} metalness={0.6} />
            </Box>
            <Box args={[1.6, 0.15, 1.6]} position={[0, 0.35, 0]}>
                <meshStandardMaterial color="#8b7355" roughness={0.4} metalness={0.5} />
            </Box>
            <Box args={[1.4, 0.1, 1.4]} position={[0, 0.45, 0]}>
                <meshStandardMaterial color="#e6c200" roughness={0.2} metalness={0.8} opacity={0.7} transparent />
            </Box>
            
            {/* 柱头 - 增强版 */}
            <Box args={[1.6, 0.3, 1.6]} position={[0, 10.15, 0]}>
                <meshStandardMaterial color="#c9a55c" roughness={0.3} metalness={0.6} />
            </Box>
            <Box args={[1.4, 0.15, 1.4]} position={[0, 10, 0]}>
                <meshStandardMaterial color="#8b7355" roughness={0.4} metalness={0.5} />
            </Box>
            <Box args={[1.2, 0.1, 1.2]} position={[0, 9.9, 0]}>
                <meshStandardMaterial color="#e6c200" roughness={0.2} metalness={0.8} opacity={0.7} transparent />
            </Box>
            
            {/* 柱头装饰 - 四角装饰 */}
            {[
                [-0.7, 10.3, -0.7],
                [0.7, 10.3, -0.7],
                [-0.7, 10.3, 0.7],
                [0.7, 10.3, 0.7]
            ].map((pos, i) => (
                <Cylinder key={i} args={[0.08, 0.08, 0.15, 8]} position={pos as [number, number, number]}>
                    <meshStandardMaterial color="#e6c200" roughness={0.2} metalness={0.8} />
                </Cylinder>
            ))}
        </group>
    )
})


