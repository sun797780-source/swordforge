import React from 'react'
import { Box, Text } from '@react-three/drei'

// 画框组件
export const Painting = React.memo(({ position, rotation, title, year, color }: { 
    position: [number, number, number], 
    rotation?: [number, number, number],
    title: string,
    year: string,
    color: string 
}) => {
    return (
        <group position={position} rotation={rotation || [0, 0, 0]}>
            <Box args={[2.2, 1.6, 0.1]} position={[0, 0, 0]}>
                <meshStandardMaterial color="#c9a55c" roughness={0.3} metalness={0.5} />
            </Box>
            <Box args={[1.9, 1.3, 0.02]} position={[0, 0, 0.06]}>
                <meshStandardMaterial color={color} roughness={0.8} />
            </Box>
            <Text position={[0, -1, 0.1]} fontSize={0.15} color="#c9a55c">{title}</Text>
            <Text position={[0, -1.2, 0.1]} fontSize={0.1} color="#888">{year}</Text>
        </group>
    )
})

// 简化的墙壁图案
export const WallPattern = React.memo(({ position, rotation }: { 
    position: [number, number, number], 
    rotation?: [number, number, number] 
}) => {
    return (
        <Box args={[0.3, 0.3, 0.01]} position={position} rotation={rotation || [0, 0, 0]}>
            <meshStandardMaterial color="#c9a55c" opacity={0.2} transparent />
        </Box>
    )
})




















