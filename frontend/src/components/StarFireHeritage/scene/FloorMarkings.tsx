import React, { useMemo } from 'react'
import { Box } from '@react-three/drei'

// 地面引导线 - 增强版
export const FloorGuideline = React.memo(() => {
    return (
        <group>
            {/* 主引导线 */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -15]}>
                <planeGeometry args={[0.8, 188]} />
                <meshStandardMaterial color="#c9a55c" roughness={0.3} metalness={0.6} />
            </mesh>
            {/* 两侧装饰线 */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.5, 0.011, -15]}>
                <planeGeometry args={[0.1, 188]} />
                <meshStandardMaterial color="#e6c200" roughness={0.2} metalness={0.8} opacity={0.7} transparent />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.5, 0.011, -15]}>
                <planeGeometry args={[0.1, 188]} />
                <meshStandardMaterial color="#e6c200" roughness={0.2} metalness={0.8} opacity={0.7} transparent />
            </mesh>
            {/* 装饰点 - 正常颜色 */}
            {Array.from({ length: 20 }).map((_, i) => {
                const z = -109 + (i * 9.5)
                return (
                    <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, z]}>
                        <circleGeometry args={[0.08, 16]} />
                        <meshStandardMaterial color="#e6c200" roughness={0.2} metalness={0.8} />
                    </mesh>
                )
            })}
        </group>
    )
})

// 区域分隔线 - 增强版
export const AreaDivider = React.memo(({ position }: { position: [number, number, number] }) => {
    return (
        <group position={position}>
            {/* 主分隔线 */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[38, 0.25]} />
                <meshStandardMaterial color="#c9a55c" roughness={0.3} metalness={0.6} />
            </mesh>
            {/* 两侧装饰 */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-18.5, 0.001, 0]}>
                <planeGeometry args={[0.15, 0.25]} />
                <meshStandardMaterial color="#ffd700" roughness={0.2} metalness={0.8} opacity={0.7} transparent />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[18.5, 0.001, 0]}>
                <planeGeometry args={[0.15, 0.25]} />
                <meshStandardMaterial color="#ffd700" roughness={0.2} metalness={0.8} opacity={0.7} transparent />
            </mesh>
            {/* 中心装饰 */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
                <circleGeometry args={[0.2, 16]} />
                <meshStandardMaterial color="#e6c200" roughness={0.2} metalness={0.8} />
            </mesh>
        </group>
    )
})

// 时代标识区域 - 增强版
export const EraZone = React.memo(({ 
    position, 
    era, 
    yearRange 
}: { 
    position: [number, number, number]
    era: string
    yearRange: string
}) => {
    return (
        <group position={position}>
            {/* 区域标识 - 渐变效果 */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[36, 2]} />
                <meshStandardMaterial color="#f5f5f5" roughness={0.4} opacity={0.4} transparent />
            </mesh>
            
            {/* 边框装饰 */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-18, 0.001, 0]}>
                <planeGeometry args={[0.1, 2]} />
                <meshStandardMaterial color="#c9a55c" roughness={0.3} metalness={0.6} opacity={0.8} transparent />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[18, 0.001, 0]}>
                <planeGeometry args={[0.1, 2]} />
                <meshStandardMaterial color="#c9a55c" roughness={0.3} metalness={0.6} opacity={0.8} transparent />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, -1]}>
                <planeGeometry args={[36, 0.1]} />
                <meshStandardMaterial color="#c9a55c" roughness={0.3} metalness={0.6} opacity={0.8} transparent />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 1]}>
                <planeGeometry args={[36, 0.1]} />
                <meshStandardMaterial color="#c9a55c" roughness={0.3} metalness={0.6} opacity={0.8} transparent />
            </mesh>
            
            {/* 文字标识 - 增强版 */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
                <planeGeometry args={[2.5, 0.35]} />
                <meshStandardMaterial color="#c9a55c" roughness={0.3} metalness={0.6} />
            </mesh>
            {/* 文字标识边框 */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.011, 0]}>
                <ringGeometry args={[1.15, 1.25, 16]} />
                <meshStandardMaterial color="#e6c200" roughness={0.2} metalness={0.8} opacity={0.7} transparent />
            </mesh>
        </group>
    )
})

// 地面标识系统
export const FloorMarkingSystem = React.memo(() => {
    const eraZones = useMemo(() => [
        { z: -90, era: '创业初期', yearRange: '1931-1949' },
        { z: -70, era: '建设发展', yearRange: '1950-1965' },
        { z: -50, era: '自主探索', yearRange: '1966-1978' },
        { z: -30, era: '改革开放', yearRange: '1979-1999' },
        { z: -10, era: '跨越腾飞', yearRange: '2000-2015' },
        { z: 20, era: '强军新时代', yearRange: '2016-2025' },
    ], [])

    return (
        <group>
            <FloorGuideline />
            {eraZones.map((zone, i) => (
                <EraZone 
                    key={i}
                    position={[0, 0.01, zone.z] as [number, number, number]}
                    era={zone.era}
                    yearRange={zone.yearRange}
                />
            ))}
        </group>
    )
})

