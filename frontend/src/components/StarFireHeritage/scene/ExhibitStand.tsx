import React from 'react'
import { Box, Cylinder, Text, Html } from '@react-three/drei'

interface ExhibitStandProps {
    position: [number, number, number]
    year: string
    label: string
    description?: string
    children: React.ReactNode
}

// 简化版展台 - 明亮风格
export const ExhibitStand = React.memo(({ position, year, label, description, children }: ExhibitStandProps) => {
    return (
        <group position={position} userData={{ 
            isExhibit: true, 
            isCollider: true,  // 标记为碰撞体
            name: label, 
            year, 
            description: description || `这是 ${label} 的详细介绍`,
            colliderRadius: 3.5,  // 碰撞半径
            colliderHeight: 5.0   // 碰撞高度
        }}>
            {/* 碰撞盒 - 不可见但可碰撞 */}
            <Box args={[7, 5, 7]} position={[0, 2.5, 0]}>
                <meshStandardMaterial visible={false} />
            </Box>
            
            {/* 底座 - 简洁设计 */}
            <Cylinder args={[3, 3.2, 0.3, 24]} position={[0, 0.15, 0]}>
                <meshStandardMaterial color="#2a2a30" roughness={0.2} metalness={0.8} />
            </Cylinder>
            <Cylinder args={[2.8, 3, 0.5, 24]} position={[0, 0.5, 0]}>
                <meshStandardMaterial color="#e8e4df" roughness={0.3} metalness={0.2} />
            </Cylinder>
            
            {/* 金色顶环 */}
            <Cylinder args={[2.6, 2.7, 0.1, 24]} position={[0, 0.8, 0]}>
                <meshStandardMaterial color="#c9a55c" roughness={0.3} metalness={0.8} />
            </Cylinder>

            {/* 展品容器 */}
            <group position={[0, 1.3, 0]}>
                {children}
            </group>

            {/* 说明牌 - 竖立样式，更清晰可见 */}
            <group position={[0, 3.8, 3]} rotation={[0.1, 0, 0]}>
                {/* 白色背景板 */}
                <mesh>
                    <planeGeometry args={[2.8, 1.2]} />
                    <meshStandardMaterial color="#ffffff" roughness={0.3} opacity={0.98} transparent />
                </mesh>
                {/* 边框 */}
                <mesh>
                    <planeGeometry args={[2.85, 1.25]} />
                    <meshStandardMaterial color="#c9a55c" roughness={0.3} opacity={0.3} transparent />
                </mesh>
                {/* 年份文字 */}
                <Text
                    position={[0, 0.25, 0.01]}
                    color="#c9a55c"
                    fontSize={0.35}
                    anchorX="center"
                    anchorY="middle"
                    fontWeight="bold"
                    renderOrder={100}
                >
                    {year}
                </Text>
                {/* 名称文字 */}
                <Text
                    position={[0, -0.15, 0.01]}
                    color="#333333"
                    fontSize={0.28}
                    anchorX="center"
                    anchorY="middle"
                    fontWeight="600"
                    renderOrder={100}
                >
                    {label}
                </Text>
            </group>
        </group>
    )
})


