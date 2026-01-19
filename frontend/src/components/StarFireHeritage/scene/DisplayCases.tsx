import React, { useMemo } from 'react'
import { Box, RoundedBox } from '@react-three/drei'

// 玻璃展示柜 - 优化版（减少mesh和灯光）
export const GlassDisplayCase = React.memo(({ 
    position, 
    width = 3, 
    height = 2, 
    depth = 1.5 
}: { 
    position: [number, number, number]
    width?: number
    height?: number
    depth?: number
}) => {
    return (
        <group position={position}>
            {/* 底座 */}
            <RoundedBox args={[width + 0.2, 0.3, depth + 0.2]} radius={0.05} position={[0, 0.15, 0]}>
                <meshStandardMaterial color="#2a2a2a" roughness={0.4} metalness={0.7} />
            </RoundedBox>
            
            {/* 展示台 */}
            <RoundedBox args={[width, 0.1, depth]} radius={0.05} position={[0, 0.35, 0]}>
                <meshStandardMaterial color="#f5f5f5" roughness={0.3} metalness={0.1} />
            </RoundedBox>
            
            {/* 简化的玻璃框架 - 合并为4个面 */}
            <Box args={[width + 0.1, height, 0.08]} position={[0, height / 2 + 0.35, depth / 2 + 0.04]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.8} />
            </Box>
            <Box args={[width + 0.1, height, 0.08]} position={[0, height / 2 + 0.35, -depth / 2 - 0.04]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.8} />
            </Box>
            <Box args={[0.08, height, depth]} position={[-width / 2 - 0.04, height / 2 + 0.35, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.8} />
            </Box>
            <Box args={[0.08, height, depth]} position={[width / 2 + 0.04, height / 2 + 0.35, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.8} />
            </Box>
            
            {/* 移除玻璃面（减少透明渲染）和顶部照明（减少灯光） */}
            <Box args={[width - 0.2, 0.1, depth - 0.2]} position={[0, height + 0.4, 0]}>
                <meshStandardMaterial color="#2a2a2a" roughness={0.3} metalness={0.7} />
            </Box>
        </group>
    )
})

// 大型展示柜 - 用于大型装备
export const LargeDisplayCase = React.memo(({ position }: { position: [number, number, number] }) => {
    return (
        <GlassDisplayCase position={position} width={5} height={3} depth={2.5} />
    )
})

// 中型展示柜
export const MediumDisplayCase = React.memo(({ position }: { position: [number, number, number] }) => {
    return (
        <GlassDisplayCase position={position} width={3} height={2} depth={1.5} />
    )
})

// 小型展示柜 - 用于小型武器
export const SmallDisplayCase = React.memo(({ position }: { position: [number, number, number] }) => {
    return (
        <GlassDisplayCase position={position} width={1.5} height={1.2} depth={0.8} />
    )
})

// 展示柜组 - 预定义位置
export const DisplayCasesGroup = React.memo(() => {
    const casePositions = useMemo(() => [
        // 左侧展示柜
        { pos: [-14, 0, -40] as [number, number, number], type: 'medium' },
        { pos: [-14, 0, -20] as [number, number, number], type: 'small' },
        { pos: [-14, 0, 0] as [number, number, number], type: 'medium' },
        { pos: [-14, 0, 20] as [number, number, number], type: 'small' },
        { pos: [-14, 0, 40] as [number, number, number], type: 'medium' },
        // 右侧展示柜
        { pos: [14, 0, -40] as [number, number, number], type: 'medium' },
        { pos: [14, 0, -20] as [number, number, number], type: 'small' },
        { pos: [14, 0, 0] as [number, number, number], type: 'medium' },
        { pos: [14, 0, 20] as [number, number, number], type: 'small' },
        { pos: [14, 0, 40] as [number, number, number], type: 'medium' },
    ], [])

    return (
        <group>
            {casePositions.map((item, i) => (
                <React.Fragment key={i}>
                    {item.type === 'large' && <LargeDisplayCase position={item.pos} />}
                    {item.type === 'medium' && <MediumDisplayCase position={item.pos} />}
                    {item.type === 'small' && <SmallDisplayCase position={item.pos} />}
                </React.Fragment>
            ))}
        </group>
    )
})

