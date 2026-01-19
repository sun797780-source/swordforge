import React, { useMemo } from 'react'
import { Box, Cylinder, Torus, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

// 共享材质 - 移除闪烁的emissive
const goldMaterial = new THREE.MeshStandardMaterial({ 
    color: "#c9a55c", 
    roughness: 0.3, 
    metalness: 0.6
})
const accentMaterial = new THREE.MeshStandardMaterial({ 
    color: "#e6c200", 
    roughness: 0.2, 
    metalness: 0.8
})

// 墙壁装饰板组件
export const WallDecorativePanel = React.memo(({ 
    position, 
    rotation = [0, 0, 0] as [number, number, number]
}: { 
    position: [number, number, number]
    rotation?: [number, number, number]
}) => {
    return (
        <group position={position} rotation={rotation}>
            {/* 主面板 */}
            <RoundedBox args={[2, 1.5, 0.05]} radius={0.05} position={[0, 0, 0]}>
                <meshStandardMaterial color="#f5f0e5" roughness={0.5} />
            </RoundedBox>
            
            {/* 边框 */}
            <RoundedBox args={[2.1, 1.6, 0.04]} radius={0.06} position={[0, 0, -0.005]}>
                <primitive object={goldMaterial} attach="material" />
            </RoundedBox>
            
            {/* 内部装饰 - 星徽 */}
            <group position={[0, 0, 0.03]}>
                {[0, 72, 144, 216, 288].map((angle, i) => {
                    const rad = (angle * Math.PI) / 180
                    const radius = 0.4
                    return (
                        <Box 
                            key={i}
                            args={[0.08, 0.08, 0.01]} 
                            position={[Math.cos(rad) * radius, Math.sin(rad) * radius, 0]}
                        >
                            <primitive object={accentMaterial} attach="material" />
                        </Box>
                    )
                })}
                <Cylinder args={[0.15, 0.15, 0.01, 8]} position={[0, 0, 0]}>
                    <primitive object={accentMaterial} attach="material" />
                </Cylinder>
            </group>
            
            {/* 四角装饰 */}
            {[
                [-0.9, 0.7, 0.03],
                [0.9, 0.7, 0.03],
                [-0.9, -0.7, 0.03],
                [0.9, -0.7, 0.03]
            ].map((pos, i) => (
                <Cylinder key={i} args={[0.06, 0.06, 0.02, 8]} position={pos as [number, number, number]}>
                    <primitive object={accentMaterial} attach="material" />
                </Cylinder>
            ))}
        </group>
    )
})

// 墙壁装饰系统
export const WallDecorationSystem = React.memo(() => {
    // 左侧墙装饰板位置
    const leftPanels = useMemo(() => {
        return [
            { z: -85, y: 3 },
            { z: -65, y: 7 },
            { z: -45, y: 3 },
            { z: -25, y: 7 },
            { z: -5, y: 3 },
            { z: 15, y: 7 },
            { z: 35, y: 3 },
            { z: 55, y: 7 },
        ]
    }, [])
    
    // 右侧墙装饰板位置
    const rightPanels = useMemo(() => {
        return [
            { z: -80, y: 3 },
            { z: -60, y: 7 },
            { z: -40, y: 3 },
            { z: -20, y: 7 },
            { z: 0, y: 3 },
            { z: 20, y: 7 },
            { z: 40, y: 3 },
            { z: 60, y: 7 },
        ]
    }, [])

    return (
        <group>
            {/* 左侧墙装饰板 */}
            {leftPanels.map((panel, i) => (
                <WallDecorativePanel
                    key={`left-${i}`}
                    position={[-18.9, panel.y, panel.z]}
                    rotation={[0, Math.PI / 2, 0]}
                />
            ))}
            
            {/* 右侧墙装饰板 */}
            {rightPanels.map((panel, i) => (
                <WallDecorativePanel
                    key={`right-${i}`}
                    position={[18.9, panel.y, panel.z]}
                    rotation={[0, -Math.PI / 2, 0]}
                />
            ))}
        </group>
    )
})

