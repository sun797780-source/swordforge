import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Box, Cylinder } from '@react-three/drei'
import * as THREE from 'three'

interface PlayerProps {
    position: [number, number, number]
    rotation?: [number, number, number]
    gender?: 'male' | 'female'
}

export const Player = React.forwardRef<THREE.Group, PlayerProps>(
    ({ position, rotation, gender = 'male' }, ref) => {
        const leftArmRef = useRef<THREE.Group>(null)
        const rightArmRef = useRef<THREE.Group>(null)
        const leftLegRef = useRef<THREE.Group>(null)
        const rightLegRef = useRef<THREE.Group>(null)
        
        const animTime = useRef(0)

        // 走路动画
        useFrame((_, delta) => {
            if (!leftArmRef.current || !rightArmRef.current || 
                !leftLegRef.current || !rightLegRef.current) return

            animTime.current += delta * 10

            const parent = (ref as any)?.current
            const velocity = parent?.userData?.velocity || 0
            const moving = velocity > 0.1

            if (moving) {
                // 手臂摆动
                leftArmRef.current.rotation.x = Math.sin(animTime.current) * 0.7
                rightArmRef.current.rotation.x = -Math.sin(animTime.current) * 0.7
                // 腿部摆动
                leftLegRef.current.rotation.x = -Math.sin(animTime.current) * 0.5
                rightLegRef.current.rotation.x = Math.sin(animTime.current) * 0.5
            } else {
                // 站立时缓慢恢复
                leftArmRef.current.rotation.x *= 0.85
                rightArmRef.current.rotation.x *= 0.85
                leftLegRef.current.rotation.x *= 0.85
                rightLegRef.current.rotation.x *= 0.85
            }
        })

        return (
            <group ref={ref} position={position} rotation={rotation}>
                {/* ====== 头部 ====== */}
                <group position={[0, 1.62, 0]}>
                    {/* 头 */}
                    <Box args={gender === 'female' ? [0.42, 0.42, 0.42] : [0.45, 0.45, 0.45]}>
                        <meshStandardMaterial color={gender === 'female' ? "#f8dcc0" : "#f5d0a9"} roughness={0.7} />
                    </Box>
                    
                    {/* 头发 - 根据性别不同 */}
                    {gender === 'female' ? (
                        // 女性：长发
                        <>
                            <Box args={[0.45, 0.3, 0.4]} position={[0, 0.12, -0.1]}>
                                <meshStandardMaterial color="#4a2c1a" roughness={0.9} />
                            </Box>
                            <Box args={[0.45, 0.45, 0.15]} position={[0, 0, -0.22]}>
                                <meshStandardMaterial color="#4a2c1a" roughness={0.9} />
                            </Box>
                            {/* 马尾辫 */}
                            <Box args={[0.12, 0.4, 0.12]} position={[0, -0.15, -0.25]}>
                                <meshStandardMaterial color="#4a2c1a" roughness={0.9} />
                            </Box>
                        </>
                    ) : (
                        // 男性：短发
                        <>
                            <Box args={[0.47, 0.25, 0.35]} position={[0, 0.15, -0.08]}>
                                <meshStandardMaterial color="#2c1810" roughness={0.9} />
                            </Box>
                            <Box args={[0.47, 0.47, 0.12]} position={[0, 0, -0.2]}>
                                <meshStandardMaterial color="#2c1810" roughness={0.9} />
                            </Box>
                        </>
                    )}
                    
                    {/* 眼睛 - 在正面(+Z方向)，玩家看背面所以看不到 */}
                    <Box args={[0.08, 0.06, 0.02]} position={[-0.1, 0.02, 0.23]}>
                        <meshStandardMaterial color="#1a1a1a" />
                    </Box>
                    <Box args={[0.08, 0.06, 0.02]} position={[0.1, 0.02, 0.23]}>
                        <meshStandardMaterial color="#1a1a1a" />
                    </Box>
                    {/* 眼白 */}
                    <Box args={[0.04, 0.04, 0.02]} position={[-0.1, 0.03, 0.235]}>
                        <meshStandardMaterial color="#ffffff" />
                    </Box>
                    <Box args={[0.04, 0.04, 0.02]} position={[0.1, 0.03, 0.235]}>
                        <meshStandardMaterial color="#ffffff" />
                    </Box>
                </group>

                {/* ====== 身体 ====== */}
                <group position={[0, 1.05, 0]}>
                    {gender === 'female' ? (
                        // 女性：粉色/紫色系服装
                        <>
                            {/* 主体 - 粉色上衣，修身设计 */}
                            <Box args={[0.42, 0.6, 0.24]}>
                                <meshStandardMaterial color="#d4a5c7" roughness={0.5} />
                            </Box>
                            
                            {/* 女性胸部特征 */}
                            <Box args={[0.12, 0.15, 0.12]} position={[-0.1, 0.15, 0.13]}>
                                <meshStandardMaterial color="#d4a5c7" roughness={0.5} />
                            </Box>
                            <Box args={[0.12, 0.15, 0.12]} position={[0.1, 0.15, 0.13]}>
                                <meshStandardMaterial color="#d4a5c7" roughness={0.5} />
                            </Box>
                            
                            {/* 衣领 - 浅紫色 */}
                            <Box args={[0.32, 0.12, 0.26]} position={[0, 0.32, 0]}>
                                <meshStandardMaterial color="#c895b8" roughness={0.5} />
                            </Box>
                            
                            {/* 装饰花边 - 胸前 */}
                            <Box args={[0.08, 0.04, 0.01]} position={[0, 0.2, 0.13]}>
                                <meshStandardMaterial color="#e8b8d9" roughness={0.4} />
                            </Box>
                            
                            {/* 背部装饰线 - 粉色 */}
                            <Box args={[0.02, 0.5, 0.01]} position={[0, 0, -0.135]}>
                                <meshStandardMaterial color="#c895b8" />
                            </Box>
                            
                            {/* 口袋 - 浅粉色 */}
                            <Box args={[0.1, 0.1, 0.02]} position={[-0.1, -0.1, -0.14]}>
                                <meshStandardMaterial color="#e8b8d9" roughness={0.6} />
                            </Box>
                            <Box args={[0.1, 0.1, 0.02]} position={[0.1, -0.1, -0.14]}>
                                <meshStandardMaterial color="#e8b8d9" roughness={0.6} />
                            </Box>
                            
                            {/* 腰带 - 紫色 */}
                            <Box args={[0.44, 0.06, 0.26]} position={[0, -0.28, 0]}>
                                <meshStandardMaterial color="#9d7ba8" roughness={0.4} metalness={0.2} />
                            </Box>
                            {/* 腰带扣 - 金色蝴蝶结 */}
                            <Box args={[0.08, 0.08, 0.02]} position={[0, -0.28, -0.15]}>
                                <meshStandardMaterial color="#ffd700" roughness={0.2} metalness={0.9} />
                            </Box>
                        </>
                    ) : (
                        // 男性：军绿色夹克
                        <>
                            <Box args={[0.48, 0.65, 0.26]}>
                                <meshStandardMaterial color="#4a5d23" roughness={0.6} />
                            </Box>
                            <Box args={[0.35, 0.1, 0.28]} position={[0, 0.32, 0]}>
                                <meshStandardMaterial color="#3d4d1c" roughness={0.6} />
                            </Box>
                            <Box args={[0.02, 0.5, 0.01]} position={[0, 0, -0.135]}>
                                <meshStandardMaterial color="#3a4a1a" />
                            </Box>
                            <Box args={[0.12, 0.12, 0.02]} position={[-0.12, -0.1, -0.14]}>
                                <meshStandardMaterial color="#3d4d1c" roughness={0.7} />
                            </Box>
                            <Box args={[0.12, 0.12, 0.02]} position={[0.12, -0.1, -0.14]}>
                                <meshStandardMaterial color="#3d4d1c" roughness={0.7} />
                            </Box>
                            <Box args={[0.5, 0.08, 0.28]} position={[0, -0.28, 0]}>
                                <meshStandardMaterial color="#2a2a2a" roughness={0.4} metalness={0.3} />
                            </Box>
                            <Box args={[0.06, 0.06, 0.02]} position={[0, -0.28, -0.15]}>
                                <meshStandardMaterial color="#c9a55c" roughness={0.3} metalness={0.8} />
                            </Box>
                        </>
                    )}
                </group>

                {/* ====== 左手臂 ====== */}
                <group ref={leftArmRef} position={gender === 'female' ? [-0.3, 1.25, 0] : [-0.34, 1.25, 0]}>
                    {/* 上臂 - 根据性别不同颜色 */}
                    <Box args={gender === 'female' ? [0.16, 0.33, 0.16] : [0.18, 0.35, 0.18]} position={[0, -0.15, 0]}>
                        <meshStandardMaterial 
                            color={gender === 'female' ? "#d4a5c7" : "#4a5d23"} 
                            roughness={0.6} 
                        />
                    </Box>
                    {/* 下臂 - 皮肤 */}
                    <Box args={gender === 'female' ? [0.13, 0.28, 0.13] : [0.15, 0.3, 0.15]} position={[0, -0.45, 0]}>
                        <meshStandardMaterial color={gender === 'female' ? "#f8dcc0" : "#f5d0a9"} roughness={0.7} />
                    </Box>
                    {/* 手 */}
                    <Box args={gender === 'female' ? [0.1, 0.1, 0.07] : [0.12, 0.12, 0.08]} position={[0, -0.62, 0]}>
                        <meshStandardMaterial color={gender === 'female' ? "#f8dcc0" : "#f5d0a9"} roughness={0.7} />
                    </Box>
                </group>

                {/* ====== 右手臂 ====== */}
                <group ref={rightArmRef} position={gender === 'female' ? [0.3, 1.25, 0] : [0.34, 1.25, 0]}>
                    <Box args={gender === 'female' ? [0.16, 0.33, 0.16] : [0.18, 0.35, 0.18]} position={[0, -0.15, 0]}>
                        <meshStandardMaterial 
                            color={gender === 'female' ? "#d4a5c7" : "#4a5d23"} 
                            roughness={0.6} 
                        />
                    </Box>
                    <Box args={gender === 'female' ? [0.13, 0.28, 0.13] : [0.15, 0.3, 0.15]} position={[0, -0.45, 0]}>
                        <meshStandardMaterial color={gender === 'female' ? "#f8dcc0" : "#f5d0a9"} roughness={0.7} />
                    </Box>
                    <Box args={gender === 'female' ? [0.1, 0.1, 0.07] : [0.12, 0.12, 0.08]} position={[0, -0.62, 0]}>
                        <meshStandardMaterial color={gender === 'female' ? "#f8dcc0" : "#f5d0a9"} roughness={0.7} />
                    </Box>
                </group>

                {/* ====== 左腿 ====== */}
                <group ref={leftLegRef} position={gender === 'female' ? [-0.1, 0.7, 0] : [-0.12, 0.7, 0]}>
                    {gender === 'female' ? (
                        // 女性：裙子 + 浅色丝袜
                        <>
                            {/* 裙子 - 紫色/粉色 */}
                            <Box args={[0.22, 0.25, 0.22]} position={[0, -0.15, 0]}>
                                <meshStandardMaterial color="#b88ab5" roughness={0.6} />
                            </Box>
                            {/* 裙子下摆装饰 */}
                            <Box args={[0.24, 0.05, 0.24]} position={[0, -0.27, 0]}>
                                <meshStandardMaterial color="#d4a5c7" roughness={0.5} />
                            </Box>
                            {/* 小腿 - 浅色丝袜 */}
                            <Box args={[0.16, 0.33, 0.16]} position={[0, -0.55, 0]}>
                                <meshStandardMaterial color="#f0d0e0" roughness={0.3} />
                            </Box>
                            {/* 靴子 - 粉色/紫色 */}
                            <Box args={[0.18, 0.16, 0.26]} position={[0, -0.78, -0.02]}>
                                <meshStandardMaterial color="#c895b8" roughness={0.5} />
                            </Box>
                            <Box args={[0.2, 0.04, 0.28]} position={[0, -0.86, -0.02]}>
                                <meshStandardMaterial color="#9d7ba8" roughness={0.4} />
                            </Box>
                        </>
                    ) : (
                        // 男性：深色裤子
                        <>
                            <Box args={[0.2, 0.4, 0.2]} position={[0, -0.2, 0]}>
                                <meshStandardMaterial color="#2d3a4d" roughness={0.7} />
                            </Box>
                            <Box args={[0.18, 0.35, 0.18]} position={[0, -0.55, 0]}>
                                <meshStandardMaterial color="#2d3a4d" roughness={0.7} />
                            </Box>
                            <Box args={[0.2, 0.18, 0.28]} position={[0, -0.78, -0.02]}>
                                <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
                            </Box>
                            <Box args={[0.22, 0.04, 0.3]} position={[0, -0.86, -0.02]}>
                                <meshStandardMaterial color="#0d0d0d" roughness={0.4} />
                            </Box>
                        </>
                    )}
                </group>

                {/* ====== 右腿 ====== */}
                <group ref={rightLegRef} position={gender === 'female' ? [0.1, 0.7, 0] : [0.12, 0.7, 0]}>
                    {gender === 'female' ? (
                        // 女性：裙子 + 浅色丝袜
                        <>
                            <Box args={[0.22, 0.25, 0.22]} position={[0, -0.15, 0]}>
                                <meshStandardMaterial color="#b88ab5" roughness={0.6} />
                            </Box>
                            <Box args={[0.24, 0.05, 0.24]} position={[0, -0.27, 0]}>
                                <meshStandardMaterial color="#d4a5c7" roughness={0.5} />
                            </Box>
                            <Box args={[0.16, 0.33, 0.16]} position={[0, -0.55, 0]}>
                                <meshStandardMaterial color="#f0d0e0" roughness={0.3} />
                            </Box>
                            <Box args={[0.18, 0.16, 0.26]} position={[0, -0.78, -0.02]}>
                                <meshStandardMaterial color="#c895b8" roughness={0.5} />
                            </Box>
                            <Box args={[0.2, 0.04, 0.28]} position={[0, -0.86, -0.02]}>
                                <meshStandardMaterial color="#9d7ba8" roughness={0.4} />
                            </Box>
                        </>
                    ) : (
                        // 男性：深色裤子
                        <>
                            <Box args={[0.2, 0.4, 0.2]} position={[0, -0.2, 0]}>
                                <meshStandardMaterial color="#2d3a4d" roughness={0.7} />
                            </Box>
                            <Box args={[0.18, 0.35, 0.18]} position={[0, -0.55, 0]}>
                                <meshStandardMaterial color="#2d3a4d" roughness={0.7} />
                            </Box>
                            <Box args={[0.2, 0.18, 0.28]} position={[0, -0.78, -0.02]}>
                                <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
                            </Box>
                            <Box args={[0.22, 0.04, 0.3]} position={[0, -0.86, -0.02]}>
                                <meshStandardMaterial color="#0d0d0d" roughness={0.4} />
                            </Box>
                        </>
                    )}
                </group>
            </group>
        )
    }
)
