import React from 'react'
import { Box, Text } from '@react-three/drei'

// 展品说明牌 - 真实博物馆风格
export const ExhibitLabel = React.memo(({ 
    position, 
    title, 
    year, 
    description 
}: { 
    position: [number, number, number]
    title: string
    year: string
    description?: string
}) => {
    return (
        <group position={position}>
            {/* 说明牌底座 */}
            <Box args={[0.8, 0.05, 0.4]} position={[0, 0.025, 0]}>
                <meshStandardMaterial color="#2a2a2a" roughness={0.4} metalness={0.6} />
            </Box>
            
            {/* 说明牌主体 */}
            <Box args={[0.75, 0.3, 0.02]} position={[0, 0.2, 0.01]}>
                <meshStandardMaterial color="#ffffff" roughness={0.2} />
            </Box>
            
            {/* 文字 */}
            <Text 
                position={[0, 0.25, 0.02]} 
                fontSize={0.08} 
                color="#1a1a1a"
                anchorX="center"
                anchorY="middle"
            >
                {title}
            </Text>
            <Text 
                position={[0, 0.15, 0.02]} 
                fontSize={0.06} 
                color="#666"
                anchorX="center"
                anchorY="middle"
            >
                {year}
            </Text>
        </group>
    )
})

// 区域标识牌
export const AreaSign = React.memo(({ 
    position, 
    title, 
    subtitle,
    rotation = [0, 0, 0] as [number, number, number]
}: { 
    position: [number, number, number]
    title: string
    subtitle?: string
    rotation?: [number, number, number]
}) => {
    return (
        <group position={position} rotation={rotation}>
            {/* 标识牌背景 */}
            <Box args={[2.5, 1.2, 0.1]} position={[0, 0.6, 0]}>
                <meshStandardMaterial color="#c9a55c" roughness={0.3} metalness={0.6} />
            </Box>
            
            {/* 标识牌边框 */}
            <Box args={[2.4, 1.1, 0.05]} position={[0, 0.6, 0.06]}>
                <meshStandardMaterial color="#ffffff" roughness={0.2} />
            </Box>
            
            {/* 标题 */}
            <Text 
                position={[0, 0.75, 0.08]} 
                fontSize={0.2} 
                color="#1a1a1a"
                anchorX="center"
                anchorY="middle"
                fontWeight="bold"
            >
                {title}
            </Text>
            
            {/* 副标题 */}
            {subtitle && (
                <Text 
                    position={[0, 0.45, 0.08]} 
                    fontSize={0.12} 
                    color="#666"
                    anchorX="center"
                    anchorY="middle"
                >
                    {subtitle}
                </Text>
            )}
        </group>
    )
})

// 历史时间线标识
export const TimelineMarker = React.memo(({ 
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
            {/* 时间线标记 */}
            <Box args={[0.1, 0.1, 0.1]} position={[0, 0.05, 0]}>
                <meshStandardMaterial color="#c9a55c" roughness={0.3} metalness={0.7} />
            </Box>
            
            {/* 说明牌 */}
            <Box args={[1.2, 0.4, 0.05]} position={[0, 0.3, 0]}>
                <meshStandardMaterial color="#ffffff" roughness={0.2} />
            </Box>
            
            <Text 
                position={[0, 0.35, 0.01]} 
                fontSize={0.1} 
                color="#1a1a1a"
                anchorX="center"
                anchorY="middle"
            >
                {era}
            </Text>
            <Text 
                position={[0, 0.2, 0.01]} 
                fontSize={0.08} 
                color="#666"
                anchorX="center"
                anchorY="middle"
            >
                {yearRange}
            </Text>
        </group>
    )
})

// 方向指示牌
export const DirectionSign = React.memo(({ 
    position, 
    direction, 
    target 
}: { 
    position: [number, number, number]
    direction: 'left' | 'right' | 'forward' | 'back'
    target: string
}) => {
    const rotation: [number, number, number] = direction === 'left' ? [0, Math.PI / 2, 0] : 
                     direction === 'right' ? [0, -Math.PI / 2, 0] :
                     direction === 'back' ? [0, Math.PI, 0] : [0, 0, 0]
    
    return (
        <group position={position} rotation={rotation}>
            <Box args={[0.6, 0.8, 0.05]} position={[0, 0.4, 0]}>
                <meshStandardMaterial color="#2a2a2a" roughness={0.4} metalness={0.6} />
            </Box>
            <Text 
                position={[0, 0.4, 0.01]} 
                fontSize={0.12} 
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
            >
                →
            </Text>
            <Text 
                position={[0, 0.2, 0.01]} 
                fontSize={0.08} 
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
            >
                {target}
            </Text>
        </group>
    )
})

