import React, { useMemo } from 'react'
import { Box, Cylinder } from '@react-three/drei'

// 展品聚光灯
export const ExhibitSpotlight = React.memo(({ 
    position
}: { 
    position: [number, number, number]
}) => {
    return (
        <group position={position}>
            {/* 灯架 */}
            <Cylinder args={[0.05, 0.05, 0.3, 8]} position={[0, 0.15, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
            </Cylinder>
            
            {/* 灯头 */}
            <Box args={[0.2, 0.15, 0.2]} position={[0, 0.3, 0]}>
                <meshStandardMaterial color="#2a2a2a" roughness={0.3} metalness={0.7} />
            </Box>
            
            {/* 聚光灯 */}
            <spotLight 
                position={[0, 0.25, 0]} 
                angle={0.4} 
                penumbra={0.5} 
                intensity={1.5} 
                color="#fff8f0" 
                distance={15}
            />
        </group>
    )
})

// 环境照明灯
export const AmbientLightFixture = React.memo(({ position }: { position: [number, number, number] }) => {
    return (
        <group position={position}>
            {/* 灯座 */}
            <Cylinder args={[0.15, 0.15, 0.2, 8]} position={[0, 0.1, 0]}>
                <meshStandardMaterial color="#c9a55c" roughness={0.3} metalness={0.7} />
            </Cylinder>
            
            {/* 灯罩 */}
            <Cylinder args={[0.3, 0.25, 0.15, 16]} position={[0, 0.25, 0]}>
                <meshStandardMaterial color="#fff8e0" emissive="#fff8e0" emissiveIntensity={0.2} />
            </Cylinder>
            
            {/* 点光源 */}
            <pointLight position={[0, 0.25, 0]} intensity={0.6} distance={12} color="#fff5e0" />
        </group>
    )
})

// 专业照明系统 - 优化版（减少灯光数量，使用更高效的照明）
export const ProfessionalLightingSystem = React.memo(() => {
    // 展品位置（从HeritageMuseum.tsx获取）
    const exhibitPositions = useMemo(() => [
        -100, -95, -90, -85, -75, -70, -60, -50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50, 60, 70
    ], [])

    return (
        <group>
            {/* 优化：只为关键展品添加聚光灯，减少到10个 */}
            {exhibitPositions.filter((_, i) => i % 2 === 0).map((z, i) => (
                <ExhibitSpotlight 
                    key={`spotlight-${z}`}
                    position={[i % 2 === 0 ? -8 : 8, 10, z] as [number, number, number]}
                />
            ))}
            
            {/* 优化：减少环境灯数量，只保留4个关键位置 */}
            {[[-8, 10.5, -40], [8, 10.5, -40], [-8, 10.5, 40], [8, 10.5, 40]].map((pos, i) => (
                <AmbientLightFixture 
                    key={`ambient-${i}`}
                    position={pos as [number, number, number]}
                />
            ))}
        </group>
    )
})

