import React from 'react'
import { Box, Text, RoundedBox } from '@react-three/drei'

// 入口大厅装饰 - 真实博物馆风格
export const EntranceHall = React.memo(() => {
    return (
        <group position={[0, 0, -110]}>
            {/* 入口门框 */}
            <Box args={[12, 8, 0.3]} position={[0, 4, 0]}>
                <meshStandardMaterial color="#c9a55c" roughness={0.3} metalness={0.6} />
            </Box>
            
            {/* 信息展示屏幕 */}
            <group position={[0, 4, 0.16]}>
                {/* 屏幕边框 */}
                <Box args={[11.5, 7.5, 0.1]} position={[0, 0, 0]}>
                    <meshStandardMaterial color="#2a2a2a" roughness={0.4} metalness={0.7} />
                </Box>
                {/* 屏幕内容区域 */}
                <Box args={[11, 7, 0.02]} position={[0, 0, 0.06]}>
                    <meshStandardMaterial color="#1a1a1a" roughness={0.1} metalness={0.9} emissive="#0a0a0a" emissiveIntensity={0.1} />
                </Box>
                {/* 屏幕内容文字 */}
                <Text 
                    position={[0, 2.5, 0.2]} 
                    fontSize={0.5} 
                    color="#c9a55c"
                    anchorX="center"
                    anchorY="middle"
                    fontWeight="bold"
                    renderOrder={100}
                >
                    兵工博物馆
                </Text>
                <Text 
                    position={[0, 1.8, 0.2]} 
                    fontSize={0.25} 
                    color="#888"
                    anchorX="center"
                    anchorY="middle"
                    renderOrder={100}
                >
                    Military Industry Museum
                </Text>
                <Text 
                    position={[0, 0.5, 0.2]} 
                    fontSize={0.18} 
                    color="#ffffff"
                    anchorX="center"
                    anchorY="middle"
                    maxWidth={10}
                    renderOrder={100}
                >
                    欢迎来到人民兵工博物馆
                </Text>
                <Text 
                    position={[0, 0, 0.2]} 
                    fontSize={0.15} 
                    color="#aaa"
                    anchorX="center"
                    anchorY="middle"
                    maxWidth={10}
                    renderOrder={100}
                >
                    展示中国近百年兵器工业发展历程
                </Text>
                <Text 
                    position={[0, -0.5, 0.2]} 
                    fontSize={0.15} 
                    color="#aaa"
                    anchorX="center"
                    anchorY="middle"
                    maxWidth={10}
                    renderOrder={100}
                >
                    从1931年官田兵工厂到现代化强军之路
                </Text>
                <Text 
                    position={[0, -1.5, 0.2]} 
                    fontSize={0.12} 
                    color="#666"
                    anchorX="center"
                    anchorY="middle"
                    maxWidth={10}
                    renderOrder={100}
                >
                    操作提示：点击屏幕锁定鼠标 | WASD 移动 | 鼠标转向 | Z 切换视角 | 空格跳跃
                </Text>
                <Text 
                    position={[0, -2.2, 0.2]} 
                    fontSize={0.12} 
                    color="#666"
                    anchorX="center"
                    anchorY="middle"
                    maxWidth={10}
                    renderOrder={100}
                >
                    点击展品查看详细信息
                </Text>
            </group>
            
            {/* 入口标题牌 */}
            <group position={[0, 7, 0.2]}>
                <RoundedBox args={[10, 1.5, 0.2]} radius={0.1} position={[0, 0, 0]}>
                    <meshStandardMaterial color="#c9a55c" roughness={0.3} metalness={0.6} />
                </RoundedBox>
                <Text 
                    position={[0, 0, 0.1]} 
                    fontSize={0.8} 
                    color="#1a1a1a"
                    anchorX="center"
                    anchorY="middle"
                    fontWeight="bold"
                >
                    兵工博物馆
                </Text>
                <Text 
                    position={[0, -0.6, 0.1]} 
                    fontSize={0.3} 
                    color="#666"
                    anchorX="center"
                    anchorY="middle"
                >
                    Military Industry Museum
                </Text>
            </group>
            
            {/* 入口装饰柱 */}
            <Box args={[0.8, 6, 0.8]} position={[-6, 3, 0]}>
                <meshStandardMaterial color="#c9a55c" roughness={0.3} metalness={0.6} />
            </Box>
            <Box args={[0.8, 6, 0.8]} position={[6, 3, 0]}>
                <meshStandardMaterial color="#c9a55c" roughness={0.3} metalness={0.6} />
            </Box>
            
            {/* 欢迎地毯 */}
            <Box args={[8, 0.05, 4]} position={[0, 0.025, 2]}>
                <meshStandardMaterial color="#8b0000" roughness={0.6} />
            </Box>
            
            {/* 入口照明 - 优化：减少到1个主光源 */}
            <pointLight position={[0, 7, 0]} intensity={1.5} distance={25} color="#fff8f0" />
        </group>
    )
})

// 出口标识 - 放在前墙顶部
export const ExitSign = React.memo(() => {
    return (
        <group position={[0, 9.5, 79.5]}>
            <Box args={[4, 0.8, 0.1]} position={[0, 0, 0]}>
                <meshStandardMaterial color="#1a5c1a" roughness={0.4} metalness={0.5} />
            </Box>
            <Text 
                position={[0, 0, 0.06]} 
                fontSize={0.35} 
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
                fontWeight="bold"
            >
                出口 EXIT →
            </Text>
        </group>
    )
})

