import React, { useMemo } from 'react'
import { Box, Cylinder, Torus, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

// 共享材质 - 优化性能，移除闪烁的emissive
const stripeMaterial = new THREE.MeshStandardMaterial({ 
    color: "#e8e0d5", 
    roughness: 0.5 
})
const accentMaterial = new THREE.MeshStandardMaterial({ 
    color: "#c9a55c", 
    roughness: 0.3, 
    metalness: 0.6
})
const patternMaterial = new THREE.MeshStandardMaterial({ 
    color: "#d5c9b5", 
    roughness: 0.6,
    opacity: 0.4,
    transparent: true
})
const goldAccentMaterial = new THREE.MeshStandardMaterial({ 
    color: "#e6c200", 
    roughness: 0.2, 
    metalness: 0.8
})
const borderMaterial = new THREE.MeshStandardMaterial({ 
    color: "#8b7355", 
    roughness: 0.4, 
    metalness: 0.5 
})

// 墙壁装饰条纹组件
export const WallStripes = React.memo(({ 
    position, 
    rotation = [0, 0, 0] as [number, number, number],
    width = 0.2,
    height = 11,
    length = 190
}: { 
    position: [number, number, number]
    rotation?: [number, number, number]
    width?: number
    height?: number
    length?: number
}) => {
    // 水平条纹 - 增加更多层次
    const horizontalStripes = useMemo(() => {
        const stripes = []
        // 主要水平条纹
        for (let i = 0; i < 12; i++) {
            const y = (i - 5.5) * 0.9 + 5.5
            stripes.push(
                <Box 
                    key={`h-${i}`}
                    args={[length, 0.04, 0.01]} 
                    position={[0, y, 0.01]}
                >
                    <primitive object={stripeMaterial} attach="material" />
                </Box>
            )
            // 添加细线装饰
            if (i % 2 === 0) {
                stripes.push(
                    <Box 
                        key={`h-thin-${i}`}
                        args={[length, 0.01, 0.01]} 
                        position={[0, y + 0.45, 0.01]}
                    >
                        <primitive object={accentMaterial} attach="material" />
                    </Box>
                )
            }
        }
        return stripes
    }, [length])

    // 垂直装饰线 - 增加更多装饰
    const verticalAccents = useMemo(() => {
        const accents = []
        // 主要垂直装饰线
        for (let i = 0; i < 7; i++) {
            const z = (i - 3) * 30 - 15
            accents.push(
                <Box 
                    key={`v-${i}`}
                    args={[0.03, height, 0.01]} 
                    position={[0, height / 2, z]}
                >
                    <primitive object={accentMaterial} attach="material" />
                </Box>
            )
            // 添加装饰环
            accents.push(
                <Torus 
                    key={`torus-${i}`}
                    args={[0.15, 0.02, 8, 16]} 
                    position={[0, height * 0.7, z]}
                    rotation={[Math.PI / 2, 0, 0]}
                >
                    <primitive object={goldAccentMaterial} attach="material" />
                </Torus>
            )
            accents.push(
                <Torus 
                    key={`torus-b-${i}`}
                    args={[0.15, 0.02, 8, 16]} 
                    position={[0, height * 0.3, z]}
                    rotation={[Math.PI / 2, 0, 0]}
                >
                    <primitive object={goldAccentMaterial} attach="material" />
                </Torus>
            )
        }
        return accents
    }, [height])

    // 装饰图案 - 增强版齿轮和星徽
    const gearPatterns = useMemo(() => {
        const positions = [
            [-75, 2.5, 0.02], [-45, 2.5, 0.02], [-15, 2.5, 0.02], [15, 2.5, 0.02], [45, 2.5, 0.02], [75, 2.5, 0.02],
            [-75, 5.5, 0.02], [-45, 5.5, 0.02], [-15, 5.5, 0.02], [15, 5.5, 0.02], [45, 5.5, 0.02], [75, 5.5, 0.02],
            [-75, 8.5, 0.02], [-45, 8.5, 0.02], [-15, 8.5, 0.02], [15, 8.5, 0.02], [45, 8.5, 0.02], [75, 8.5, 0.02],
        ]
        return positions.map((pos, i) => (
            <group key={i} position={pos as [number, number, number]}>
                {/* 外圈齿轮 */}
                {Array.from({ length: 12 }).map((_, j) => {
                    const angle = (j * Math.PI * 2) / 12
                    const radius = 0.2
                    return (
                        <Box 
                            key={j}
                            args={[0.04, 0.04, 0.01]} 
                            position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]}
                        >
                            <primitive object={patternMaterial} attach="material" />
                        </Box>
                    )
                })}
                {/* 中圈 */}
                <Cylinder args={[0.12, 0.12, 0.01, 12]} position={[0, 0, 0]}>
                    <primitive object={accentMaterial} attach="material" />
                </Cylinder>
                {/* 中心 */}
                <Cylinder args={[0.06, 0.06, 0.02, 8]} position={[0, 0, 0.005]}>
                    <primitive object={goldAccentMaterial} attach="material" />
                </Cylinder>
                {/* 装饰边框 */}
                <Torus args={[0.22, 0.015, 8, 16]} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <primitive object={borderMaterial} attach="material" />
                </Torus>
            </group>
        ))
    }, [])
    
    // 添加星徽装饰
    const starPatterns = useMemo(() => {
        const positions = [
            [-60, 1.5, 0.02], [0, 1.5, 0.02], [60, 1.5, 0.02],
            [-60, 9.5, 0.02], [0, 9.5, 0.02], [60, 9.5, 0.02],
        ]
        return positions.map((pos, i) => (
            <group key={`star-${i}`} position={pos as [number, number, number]}>
                {/* 五角星 */}
                {[0, 72, 144, 216, 288].map((angle, j) => {
                    const rad = (angle * Math.PI) / 180
                    const radius = 0.25
                    return (
                        <Box 
                            key={j}
                            args={[0.06, 0.06, 0.01]} 
                            position={[Math.cos(rad) * radius, Math.sin(rad) * radius, 0]}
                        >
                            <primitive object={goldAccentMaterial} attach="material" />
                        </Box>
                    )
                })}
                <Cylinder args={[0.1, 0.1, 0.01, 8]} position={[0, 0, 0]}>
                    <primitive object={goldAccentMaterial} attach="material" />
                </Cylinder>
                {/* 外圈装饰 */}
                <Torus args={[0.3, 0.02, 8, 16]} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <primitive object={accentMaterial} attach="material" />
                </Torus>
            </group>
        ))
    }, [])

    // 添加装饰边框
    const decorativeBorders = useMemo(() => {
        return (
            <>
                {/* 顶部装饰边框 */}
                <Box args={[length, 0.08, 0.02]} position={[0, height - 0.04, 0.01]}>
                    <primitive object={accentMaterial} attach="material" />
                </Box>
                {/* 底部装饰边框 */}
                <Box args={[length, 0.08, 0.02]} position={[0, 0.04, 0.01]}>
                    <primitive object={accentMaterial} attach="material" />
                </Box>
                {/* 左右装饰边框 */}
                <Box args={[0.08, height, 0.02]} position={[-length/2 + 0.04, height/2, 0.01]}>
                    <primitive object={accentMaterial} attach="material" />
                </Box>
                <Box args={[0.08, height, 0.02]} position={[length/2 - 0.04, height/2, 0.01]}>
                    <primitive object={accentMaterial} attach="material" />
                </Box>
            </>
        )
    }, [length, height])

    return (
        <group position={position} rotation={rotation}>
            {horizontalStripes}
            {verticalAccents}
            {gearPatterns}
            {starPatterns}
            {decorativeBorders}
        </group>
    )
})

// 地板装饰图案组件 - 美观大理石风格
export const FloorPatterns = React.memo(() => {
    // 共享地板材质 - 不闪烁
    const floorTileMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
        color: "#e8e0d0", 
        roughness: 0.4,
        metalness: 0.1
    }), [])
    
    const floorAccentMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
        color: "#d4c4a8", 
        roughness: 0.5,
        metalness: 0.1
    }), [])
    
    const floorBorderMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
        color: "#8b7355", 
        roughness: 0.4,
        metalness: 0.3
    }), [])
    
    const floorGoldMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
        color: "#b8a070", 
        roughness: 0.4,
        metalness: 0.4
    }), [])

    // 中央走道装饰 - 深色大理石带
    const centralCarpet = useMemo(() => {
        return (
            <group>
                {/* 中央深色走道 */}
                <Box args={[6, 0.02, 185]} position={[0, 0.01, -15]} rotation={[0, 0, 0]}>
                    <meshStandardMaterial color="#4a4035" roughness={0.3} metalness={0.1} />
                </Box>
                {/* 走道边框 - 金色镶边 */}
                <Box args={[0.15, 0.025, 185]} position={[-3.1, 0.015, -15]}>
                    <primitive object={floorGoldMaterial} attach="material" />
                </Box>
                <Box args={[0.15, 0.025, 185]} position={[3.1, 0.015, -15]}>
                    <primitive object={floorGoldMaterial} attach="material" />
                </Box>
                {/* 内侧装饰线 */}
                <Box args={[0.08, 0.022, 185]} position={[-2.8, 0.012, -15]}>
                    <meshStandardMaterial color="#6b5c4a" roughness={0.4} metalness={0.2} />
                </Box>
                <Box args={[0.08, 0.022, 185]} position={[2.8, 0.012, -15]}>
                    <meshStandardMaterial color="#6b5c4a" roughness={0.4} metalness={0.2} />
                </Box>
            </group>
        )
    }, [floorGoldMaterial])

    // 两侧地板砖块区域 - 完美对齐版
    const sideTiles = useMemo(() => {
        const tiles = []
        // 博物馆范围：z从-110到80，总共190单位
        // 砖块大小：14单位，间距15单位，确保完美对齐
        // 从-103开始（留出边距），到77结束
        const tileSize = 14
        const tileSpacing = 15
        const startZ = -103
        const endZ = 77
        
        for (let z = startZ; z <= endZ; z += tileSpacing) {
            // 左侧区域 - 中心在x=-12
            tiles.push(
                <group key={`left-tile-${z}`}>
                    {/* 大方块 */}
                    <Box args={[12, 0.015, tileSize]} position={[-12, 0.008, z]}>
                        <primitive object={floorTileMaterial} attach="material" />
                    </Box>
                    {/* 内嵌装饰框 */}
                    <Box args={[10, 0.018, 12]} position={[-12, 0.01, z]}>
                        <primitive object={floorAccentMaterial} attach="material" />
                    </Box>
                </group>
            )
            // 右侧区域（完全对称）- 中心在x=12
            tiles.push(
                <group key={`right-tile-${z}`}>
                    {/* 大方块 */}
                    <Box args={[12, 0.015, tileSize]} position={[12, 0.008, z]}>
                        <primitive object={floorTileMaterial} attach="material" />
                    </Box>
                    {/* 内嵌装饰框 */}
                    <Box args={[10, 0.018, 12]} position={[12, 0.01, z]}>
                        <primitive object={floorAccentMaterial} attach="material" />
                    </Box>
                </group>
            )
        }
        return tiles
    }, [floorTileMaterial, floorAccentMaterial])

    // 边框装饰
    const edgeBorders = useMemo(() => {
        return (
            <group>
                {/* 左侧墙边装饰带 */}
                <Box args={[1, 0.02, 185]} position={[-18.5, 0.01, -15]}>
                    <primitive object={floorBorderMaterial} attach="material" />
                </Box>
                {/* 右侧墙边装饰带 */}
                <Box args={[1, 0.02, 185]} position={[18.5, 0.01, -15]}>
                    <primitive object={floorBorderMaterial} attach="material" />
                </Box>
                {/* 前后装饰带 */}
                <Box args={[38, 0.02, 1]} position={[0, 0.01, -109]}>
                    <primitive object={floorBorderMaterial} attach="material" />
                </Box>
                <Box args={[38, 0.02, 1]} position={[0, 0.01, 79]}>
                    <primitive object={floorBorderMaterial} attach="material" />
                </Box>
            </group>
        )
    }, [floorBorderMaterial])

    // 走道节点装饰
    const pathwayNodes = useMemo(() => {
        const nodes = []
        for (let z = -90; z <= 60; z += 30) {
            nodes.push(
                <group key={`node-${z}`} position={[0, 0.02, z]}>
                    {/* 菱形装饰 */}
                    <Box args={[1.5, 0.015, 1.5]} position={[0, 0, 0]} rotation={[0, Math.PI / 4, 0]}>
                        <primitive object={floorGoldMaterial} attach="material" />
                    </Box>
                    <Box args={[1, 0.02, 1]} position={[0, 0.005, 0]} rotation={[0, Math.PI / 4, 0]}>
                        <meshStandardMaterial color="#5a4a3a" roughness={0.3} metalness={0.2} />
                    </Box>
                </group>
            )
        }
        return nodes
    }, [floorGoldMaterial])

    return (
        <group>
            {centralCarpet}
            {sideTiles}
            {edgeBorders}
            {pathwayNodes}
        </group>
    )
})

