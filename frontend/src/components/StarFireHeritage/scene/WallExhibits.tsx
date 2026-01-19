import React, { useMemo, Suspense } from 'react'
import { Box, Text, RoundedBox, useTexture, Cylinder } from '@react-three/drei'
import * as THREE from 'three'

// 共享材质 - 优化性能，移除闪烁的emissive
const goldFrameMaterial = new THREE.MeshStandardMaterial({ 
    color: "#c9a55c", 
    roughness: 0.3, 
    metalness: 0.7
})
const innerFrameMaterial = new THREE.MeshStandardMaterial({ 
    color: "#1a1a1a", 
    roughness: 0.3, 
    metalness: 0.9 
})
const lightStripMaterial = new THREE.MeshStandardMaterial({ 
    color: "#d4af37", 
    roughness: 0.3,
    metalness: 0.7
})

// 图片加载错误边界组件
class ImageErrorBoundary extends React.Component<
    { children: React.ReactNode; fallback: React.ReactNode },
    { hasError: boolean; error?: Error }
> {
    constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('图片加载错误:', error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return <>{this.props.fallback}</>
        }
        return <>{this.props.children}</>
    }
}

// 带图片纹理的照片组件
const PhotoWithTexture = ({ imageUrl }: { imageUrl: string }) => {
    // 处理图片路径：如果是绝对路径，转换为相对路径；如果是相对路径，确保以 / 开头
    const getImagePath = (url: string): string => {
        if (!url || url.trim() === '') {
            console.warn('⚠️ 图片URL为空')
            return ''
        }
        
        // 如果是绝对路径（Windows格式），提取文件名
        if (url.includes(':\\') || url.includes(':/')) {
            const fileName = url.split(/[/\\]/).pop() || ''
            const normalizedPath = `/image/${fileName}`
            console.log(`📁 路径转换: ${url} -> ${normalizedPath}`)
            return normalizedPath
        }
        // 如果已经是相对路径，确保以 / 开头
        if (!url.startsWith('/')) {
            return `/${url}`
        }
        return url
    }
    
    const normalizedUrl = getImagePath(imageUrl)
    
    if (!normalizedUrl) {
        console.warn('⚠️ 图片路径无效，使用占位符')
        return <PhotoWithoutTexture />
    }
    
    // 使用 useTexture 加载图片，如果失败会自动抛出错误
    console.log(`🖼️ 尝试加载图片: ${normalizedUrl}`)
    console.log(`💡 提示: 请确保图片文件存在于 public${normalizedUrl} 路径下`)
    
    try {
        const texture = useTexture(normalizedUrl)
        // 修复图片倒置：Three.js 默认纹理是倒置的，需要翻转
        texture.flipY = true
        
        // 设置纹理参数以优化大图片
        texture.minFilter = THREE.LinearMipMapLinearFilter
        texture.magFilter = THREE.LinearFilter
        texture.generateMipmaps = true
        
        console.log(`✅ 图片加载成功: ${normalizedUrl}`)
        
        return (
            <Box args={[2.6, 1.8, 0.02]} position={[0, 1.1, 0.12]} renderOrder={100}>
                <meshStandardMaterial 
                    map={texture} 
                    roughness={0.8} 
                    side={THREE.FrontSide}
                    depthWrite={true}
                    depthTest={true}
                />
            </Box>
        )
    } catch (error) {
        console.error(`❌ 图片加载失败: ${normalizedUrl}`, error)
        console.error(`💡 请检查:`)
        console.error(`   1. 文件是否存在: frontend/public${normalizedUrl}`)
        console.error(`   2. 文件名是否正确（区分大小写）`)
        console.error(`   3. 文件格式是否支持（jpg, png, webp）`)
        console.error(`   4. 开发服务器是否已重启`)
        return <PhotoWithoutTexture />
    }
}

// 不带图片的照片组件（使用纯色，添加纹理效果）
const PhotoWithoutTexture = () => {
    return (
        <group>
            {/* 背景渐变效果 */}
            <Box args={[2.6, 1.8, 0.02]} position={[0, 1.1, 0.12]} renderOrder={100}>
                <meshStandardMaterial 
                    color="#3a3a3a" 
                    roughness={0.8} 
                    depthWrite={true}
                    depthTest={true}
                />
            </Box>
            {/* 添加一些装饰线条，模拟照片纹理 */}
            {[0.3, 0, -0.3].map((y, i) => (
                <Box key={i} args={[2.4, 0.02, 0.01]} position={[0, 1.1 + y, 0.13]} renderOrder={101}>
                    <meshStandardMaterial 
                        color="#2a2a2a" 
                        roughness={0.7}
                        depthWrite={false}
                        depthTest={true}
                    />
                </Box>
            ))}
            {/* 中心装饰图标 */}
            <Box args={[0.3, 0.3, 0.01]} position={[0, 1.1, 0.13]} renderOrder={101}>
                <meshStandardMaterial 
                    color="#1a1a1a" 
                    roughness={0.6}
                    depthWrite={false}
                    depthTest={true}
                />
            </Box>
        </group>
    )
}

// 历史照片墙 - 优化设计，增加沈阳理工特色
const HistoricalPhotoWallInner = ({ 
    position, 
    rotation = [0, 0, 0] as [number, number, number],
    title, 
    year, 
    description,
    imageUrl
}: { 
    position: [number, number, number]
    rotation?: [number, number, number]
    title: string
    year: string
    description?: string
    imageUrl?: string
}) => {

    return (
        <group position={position} rotation={rotation}>
            {/* 外框 - 金色金属质感 */}
            <RoundedBox args={[3.2, 2.4, 0.18]} radius={0.08} position={[0, 1.1, 0]}>
                <primitive object={goldFrameMaterial} attach="material" />
            </RoundedBox>
            
            {/* 内框 - 黑色金属边框，添加装饰纹理 */}
            <RoundedBox args={[2.9, 2.1, 0.16]} radius={0.05} position={[0, 1.1, 0.01]}>
                <primitive object={innerFrameMaterial} attach="material" />
            </RoundedBox>
            
            {/* 内框装饰线 - 增加层次感 */}
            <RoundedBox args={[2.85, 2.05, 0.14]} radius={0.04} position={[0, 1.1, 0.02]}>
                <meshStandardMaterial color="#0a0a0a" roughness={0.2} metalness={0.95} />
            </RoundedBox>
            
            {/* 内框四角装饰 */}
            {[
                [-1.35, 2.05, 0.03],
                [1.35, 2.05, 0.03],
                [-1.35, 0.15, 0.03],
                [1.35, 0.15, 0.03]
            ].map((pos, i) => (
                <Box key={i} args={[0.08, 0.08, 0.05]} position={pos as [number, number, number]}>
                    <meshStandardMaterial color="#c9a55c" roughness={0.2} metalness={0.8} />
                </Box>
            ))}
            
            {/* 顶部装饰条 - 灯带效果 */}
            <Box args={[2.7, 0.05, 0.12]} position={[0, 2.15, 0.06]}>
                <primitive object={lightStripMaterial} attach="material" />
            </Box>
            
            {/* 底部装饰条 */}
            <Box args={[2.7, 0.05, 0.12]} position={[0, 0.05, 0.06]}>
                <primitive object={lightStripMaterial} attach="material" />
            </Box>
            
            {/* 四角装饰钉 */}
            {[
                [-1.35, 2.15, 0.1],
                [1.35, 2.15, 0.1],
                [-1.35, 0.05, 0.1],
                [1.35, 0.05, 0.1]
            ].map((pos, i) => (
                <Cylinder key={i} args={[0.04, 0.04, 0.08, 8]} position={pos as [number, number, number]}>
                    <meshStandardMaterial color="#8b6914" roughness={0.2} metalness={0.9} />
                </Cylinder>
            ))}
            
            {/* 照片 - 根据是否有图片URL决定使用纹理或纯色 */}
            {imageUrl && imageUrl.trim() !== '' ? (
                <ImageErrorBoundary fallback={<PhotoWithoutTexture />}>
                    <Suspense fallback={<PhotoWithoutTexture />}>
                        <PhotoWithTexture imageUrl={imageUrl} />
                    </Suspense>
                </ImageErrorBoundary>
            ) : (
                <PhotoWithoutTexture />
            )}
            
            {/* 标题背景板 */}
            <RoundedBox args={[2.8, 0.35, 0.05]} radius={0.02} position={[0, -0.3, 0.08]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.6} opacity={0.95} transparent depthWrite={false} />
            </RoundedBox>
            
            {/* 标题 */}
            <Text 
                position={[0, -0.3, 0.2]} 
                fontSize={0.2} 
                color="#c9a55c"
                anchorX="center"
                anchorY="middle"
                fontWeight="bold"
                renderOrder={100}
            >
                {title}
            </Text>
            
            {/* 年份徽章 */}
            <RoundedBox args={[0.6, 0.25, 0.05]} radius={0.05} position={[0, -0.6, 0.08]}>
                <meshStandardMaterial color="#8b0000" roughness={0.3} metalness={0.7} depthWrite={false} />
            </RoundedBox>
            <Text 
                position={[0, -0.6, 0.2]} 
                fontSize={0.14} 
                color="#ffd700"
                anchorX="center"
                anchorY="middle"
                fontWeight="bold"
                renderOrder={100}
            >
                {year}
            </Text>
            
            {/* 描述文字背景 */}
            {description && (
                <>
                    <RoundedBox args={[2.6, 0.5, 0.05]} radius={0.02} position={[0, -0.95, 0.08]}>
                        <meshStandardMaterial color="#2a2a2a" roughness={0.5} metalness={0.4} opacity={0.9} transparent depthWrite={false} />
                    </RoundedBox>
                    <Text 
                        position={[0, -0.95, 0.2]} 
                        fontSize={0.11} 
                        color="#e0e0e0"
                        anchorX="center"
                        anchorY="middle"
                        maxWidth={2.4}
                        renderOrder={100}
                    >
                        {description}
                    </Text>
                </>
            )}
        </group>
    )
};

// 导出组件
export const HistoricalPhotoWall = React.memo(HistoricalPhotoWallInner);

// 时间线连接线组件
const TimelineConnector = React.memo(({ startZ, endZ, side }: { startZ: number, endZ: number, side: 'left' | 'right' }) => {
    const x = side === 'left' ? -18.85 : 18.85
    const length = Math.abs(endZ - startZ)
    const centerZ = (startZ + endZ) / 2
    
    return (
        <group>
            {/* 主时间线 */}
            <Box args={[0.03, 0.03, length]} position={[x, 5.5, centerZ]}>
                <meshStandardMaterial color="#c9a55c" roughness={0.3} metalness={0.7} />
            </Box>
            {/* 时间节点标记 */}
            {[startZ, endZ].map((z, i) => (
                <Cylinder key={i} args={[0.08, 0.08, 0.1, 8]} position={[x, 5.5, z]}>
                    <meshStandardMaterial color="#d4af37" roughness={0.3} metalness={0.7} />
                </Cylinder>
            ))}
        </group>
    )
})

// 校训墙组件 - 沈阳理工大学特色
const SchoolMottoWall = React.memo(() => {
    const mottoMaterial = new THREE.MeshStandardMaterial({ 
        color: "#8b0000", 
        roughness: 0.4, 
        metalness: 0.5,
        depthWrite: false
    })
    
    return (
        <group position={[0, 8.5, -110]}>
            {/* 背景板 */}
            <RoundedBox args={[35, 2.5, 0.2]} radius={0.1} position={[0, 0, 0]}>
                <primitive object={mottoMaterial} attach="material" />
            </RoundedBox>
            
            {/* 金色边框 */}
            <RoundedBox args={[35.2, 2.7, 0.15]} radius={0.12} position={[0, 0, -0.03]}>
                <meshStandardMaterial color="#c9a55c" roughness={0.2} metalness={0.8} depthWrite={false} />
            </RoundedBox>
            
            {/* 文字背景层 - 确保文字始终可见 */}
            <RoundedBox args={[34, 2.3, 0.05]} radius={0.08} position={[0, 0, 0.15]}>
                <meshStandardMaterial color="#8b0000" roughness={0.3} metalness={0.6} opacity={0.95} transparent depthWrite={false} />
            </RoundedBox>
            
            {/* 校训标题 */}
            <Text 
                position={[0, 0.8, 0.3]} 
                fontSize={0.35} 
                color="#ffd700"
                anchorX="center"
                anchorY="middle"
                fontWeight="bold"
                renderOrder={200}
            >
                沈阳理工大学校训
            </Text>
            
            {/* 校训内容 */}
            <Text 
                position={[0, 0.1, 0.3]} 
                fontSize={0.25} 
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
                fontWeight="bold"
                renderOrder={200}
            >
                弘志励学、德才并蓄
            </Text>
            
            {/* 英文校训 */}
            <Text 
                position={[0, -0.5, 0.3]} 
                fontSize={0.15} 
                color="#e0e0e0"
                anchorX="center"
                anchorY="middle"
                renderOrder={200}
            >
                Aspire to Learn, Uphold Virtue and Ability
            </Text>
        </group>
    )
})

// 荣誉成就墙组件 - 左右对称
const HonorWall = React.memo(() => {
    const honors = [
        { z: -70, title: '兵工精神', content: '传承红色基因，弘扬兵工文化' },
        { z: -20, title: '国防特色', content: '服务国防建设，培养军工人才' },
        { z: 40, title: '科技创新', content: '推动科技进步，引领行业发展' },
    ]
    
    return (
        <group>
            {/* 左侧荣誉墙 */}
            {honors.map((honor, i) => (
                <group key={`left-${i}`} position={[-18.85, 7, honor.z]}>
                    {/* 荣誉牌背景 */}
                    <RoundedBox args={[2.5, 1.5, 0.12]} radius={0.05} position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                        <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.7} />
                    </RoundedBox>
                    
                    {/* 金色边框 */}
                    <RoundedBox args={[2.6, 1.6, 0.1]} radius={0.06} position={[0, 0, 0.01]} rotation={[0, Math.PI / 2, 0]}>
                        <meshStandardMaterial color="#c9a55c" roughness={0.2} metalness={0.8} />
                    </RoundedBox>
                    
                    {/* 标题 */}
                    <Text 
                        position={[0, 0.4, -0.2]} 
                        fontSize={0.2} 
                        color="#ffd700"
                        anchorX="center"
                        anchorY="middle"
                        fontWeight="bold"
                        rotation={[0, Math.PI / 2, 0]}
                        renderOrder={100}
                    >
                        {honor.title}
                    </Text>
                    
                    {/* 内容 */}
                    <Text 
                        position={[0, -0.2, -0.2]} 
                        fontSize={0.12} 
                        color="#e0e0e0"
                        anchorX="center"
                        anchorY="middle"
                        maxWidth={2.2}
                        rotation={[0, Math.PI / 2, 0]}
                        renderOrder={100}
                    >
                        {honor.content}
                    </Text>
                </group>
            ))}
            
            {/* 右侧荣誉墙 */}
            {honors.map((honor, i) => (
                <group key={`right-${i}`} position={[18.85, 7, honor.z]}>
                    {/* 荣誉牌背景 */}
                    <RoundedBox args={[2.5, 1.5, 0.12]} radius={0.05} position={[0, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
                        <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.7} />
                    </RoundedBox>
                    
                    {/* 金色边框 */}
                    <RoundedBox args={[2.6, 1.6, 0.1]} radius={0.06} position={[0, 0, -0.01]} rotation={[0, -Math.PI / 2, 0]}>
                        <meshStandardMaterial color="#c9a55c" roughness={0.2} metalness={0.8} />
                    </RoundedBox>
                    
                    {/* 标题 */}
                    <Text 
                        position={[0, 0.4, 0.2]} 
                        fontSize={0.2} 
                        color="#ffd700"
                        anchorX="center"
                        anchorY="middle"
                        fontWeight="bold"
                        rotation={[0, -Math.PI / 2, 0]}
                        renderOrder={100}
                    >
                        {honor.title}
                    </Text>
                    
                    {/* 内容 */}
                    <Text 
                        position={[0, -0.2, 0.2]} 
                        fontSize={0.12} 
                        color="#e0e0e0"
                        anchorX="center"
                        anchorY="middle"
                        maxWidth={2.2}
                        rotation={[0, -Math.PI / 2, 0]}
                        renderOrder={100}
                    >
                        {honor.content}
                    </Text>
                </group>
            ))}
        </group>
    )
})

// 历史时间线墙 - 优化设计，增加沈阳理工特色
export const HistoryTimelineWall = React.memo(() => {
    const timelineItems = useMemo(() => [
        { 
            z: -50, 
            title: '官田兵工厂', 
            year: '1931', 
            description: '中央红军第1个兵工厂，人民兵工的起点',
            imageUrl: '/image/官田兵工厂.jpg'  // 图片需要放在 public/image/ 目录下
        },
        { 
            z: -30, 
            title: '抗战岁月', 
            year: '1937-1945', 
            description: '抗日战争时期，兵工人在艰苦条件下坚持生产',
            imageUrl: '/image/抗日战争时期.jpg'
        },
        { 
            z: -10, 
            title: '建国初期', 
            year: '1949', 
            description: '新中国成立后，兵器工业开始恢复和发展',
            imageUrl: '/image/新中国成立.jpg'
        },
        { 
            z: 10, 
            title: '两弹一星', 
            year: '1964', 
            description: '原子弹、氢弹、人造卫星，国防科技重大突破',
            imageUrl: '/image/两弹一星.jpg'
        },
        { 
            z: 30, 
            title: '改革开放', 
            year: '1978', 
            description: '改革开放推动兵器工业现代化进程',
            imageUrl: '/image/改革开放.jpg'
        },
        { 
            z: 50, 
            title: '强军之路', 
            year: '2020', 
            description: '新时代强军目标，兵器工业迈向世界1流',
            imageUrl: '/image/新时代.jpg'
        },
    ], [])

    return (
        <group>
            {/* 校训墙 - 后墙中央 */}
            <SchoolMottoWall />
            
            {/* 左侧历史照片墙 - 6个相框 */}
            {timelineItems.map((item, i) => (
                <HistoricalPhotoWall
                    key={`left-${i}`}
                    position={[-18.85, 5.5, item.z] as [number, number, number]}
                    rotation={[0, Math.PI / 2, 0]}
                    title={item.title}
                    year={item.year}
                    description={item.description}
                    imageUrl={item.imageUrl}
                />
            ))}
            
            {/* 左侧时间线连接 */}
            {timelineItems.slice(0, -1).map((item, i) => (
                <TimelineConnector 
                    key={`left-connector-${i}`}
                    startZ={item.z}
                    endZ={timelineItems[i + 1].z}
                    side="left"
                />
            ))}
            
            {/* 右侧历史照片墙 - 6个相框，与左侧对称 */}
            {timelineItems.map((item, i) => (
                <HistoricalPhotoWall
                    key={`right-${i}`}
                    position={[18.85, 5.5, item.z] as [number, number, number]}
                    rotation={[0, -Math.PI / 2, 0]}
                    title={item.title}
                    year={item.year}
                    description={item.description}
                    imageUrl={item.imageUrl}
                />
            ))}
            
            {/* 右侧时间线连接 - 与左侧对称 */}
            {timelineItems.slice(0, -1).map((item, i) => (
                <TimelineConnector 
                    key={`right-connector-${i}`}
                    startZ={item.z}
                    endZ={timelineItems[i + 1].z}
                    side="right"
                />
            ))}
            
            {/* 荣誉成就墙 - 左右对称 */}
            <HonorWall />
        </group>
    )
})

// 信息展示板 - 优化设计
export const InformationBoard = React.memo(({ 
    position, 
    rotation = [0, 0, 0] as [number, number, number],
    title, 
    content 
}: { 
    position: [number, number, number]
    rotation?: [number, number, number]
    title: string
    content: string
}) => {
    const boardBgMaterial = new THREE.MeshStandardMaterial({ 
        color: "#f5f5f5", 
        roughness: 0.3,
        metalness: 0.1
    })
    const boardFrameMaterial = new THREE.MeshStandardMaterial({ 
        color: "#c9a55c", 
        roughness: 0.2, 
        metalness: 0.8 
    })
    
    return (
        <group position={position} rotation={rotation}>
            {/* 外框 */}
            <RoundedBox args={[2.7, 2.0, 0.12]} radius={0.06} position={[0, 0.9, 0]}>
                <primitive object={boardFrameMaterial} attach="material" />
            </RoundedBox>
            
            {/* 展板背景 */}
            <RoundedBox args={[2.5, 1.8, 0.1]} radius={0.05} position={[0, 0.9, 0.01]}>
                <primitive object={boardBgMaterial} attach="material" />
            </RoundedBox>
            
            {/* 标题背景条 */}
            <Box args={[2.4, 0.35, 0.08]} position={[0, 1.3, 0.06]}>
                <meshStandardMaterial color="#8b0000" roughness={0.3} metalness={0.6} />
            </Box>
            
            {/* 标题 */}
            <Text 
                position={[0, 1.3, 0.2]} 
                fontSize={0.2} 
                color="#ffd700"
                anchorX="center"
                anchorY="middle"
                fontWeight="bold"
                renderOrder={100}
            >
                {title}
            </Text>
            
            {/* 内容 */}
            <Text 
                position={[0, 0.6, 0.2]} 
                fontSize={0.12} 
                color="#333"
                anchorX="center"
                anchorY="middle"
                maxWidth={2.2}
                renderOrder={100}
            >
                {content}
            </Text>
            
            {/* 底部装饰线 */}
            <Box args={[2.4, 0.03, 0.08]} position={[0, 0.15, 0.06]}>
                <meshStandardMaterial color="#c9a55c" roughness={0.2} metalness={0.8} />
            </Box>
        </group>
    )
})