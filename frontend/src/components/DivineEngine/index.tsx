import React, { useState, useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Stars, Box, Cylinder, RoundedBox } from '@react-three/drei'
import { ConfigProvider, theme, message, Modal, Button, Space, Popconfirm } from 'antd'
import { EyeOutlined, DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { ThunderboltOutlined, ExperimentOutlined } from '@ant-design/icons'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { aiApi, AIDesignResult, SavedDesign } from '../../services/aiApi'
import { 
    Type99Tank,
    J20Fighter, J15CarrierFighter,
    Rainbow5Drone,
    LiaoningCarrier,
    Type152Cannon,
    DF21DMissile
} from '../StarFireHeritage/models/EquipmentModels'
import './DivineEngine.css'

// Reusing simple Tank Model for visualization
function GeneratedTank({ color = "#5a6a4a", position }: any) {
    const group = useRef<any>()

    useFrame((state) => {
        if (group.current) {
            // Slight hover animation
            group.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1
        }
    })

    return (
        <group ref={group} position={position}>
            <Box args={[3, 0.8, 2]} position={[0, 0.4, 0]}>
                <meshStandardMaterial color={color} metalness={0.6} roughness={0.4} />
            </Box>
            <Cylinder args={[0.8, 0.8, 0.6]} position={[0, 1.3, 0]}>
                <meshStandardMaterial color={color} metalness={0.6} roughness={0.4} />
            </Cylinder>
            <Cylinder args={[0.1, 0.1, 2.5]} rotation={[0, 0, Math.PI / 2]} position={[1.5, 1.3, 0]}>
                <meshStandardMaterial color="#2a2a2a" metalness={0.8} />
            </Cylinder>
            <Box args={[3.2, 0.3, 0.4]} position={[0, 0.15, -1]}>
                <meshStandardMaterial color="#111" />
            </Box>
            <Box args={[3.2, 0.3, 0.4]} position={[0, 0.15, 1]}>
                <meshStandardMaterial color="#111" />
            </Box>
        </group>
    )
}

function DroneModel({ color = "#333" }: any) {
    const group = useRef<any>()
    useFrame((state) => {
        if (group.current) {
            group.current.rotation.y += 0.01
            group.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.2 + 2
        }
    })
    return (
        <group ref={group}>
            <Box args={[1, 0.2, 1]}>
                <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
            </Box>
            {[[-1, 0, -1], [1, 0, -1], [-1, 0, 1], [1, 0, 1]].map((pos, i) => (
                <Cylinder key={i} args={[0.5, 0.5, 0.1]} position={[pos[0] * 0.8, 0, pos[2] * 0.8]}>
                    <meshStandardMaterial color="#222" />
                </Cylinder>
            ))}
        </group>
    )
}

// 战斗机模型（未使用，保留以备后用）
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function FighterModel({ color = "#2a2a2a" }: any) {
    const group = useRef<any>()
    useFrame((state) => {
        if (group.current) {
            group.current.rotation.y += 0.005
            group.current.position.y = Math.sin(state.clock.elapsedTime) * 0.15
        }
    })
    return (
        <group ref={group} position={[0, 0, 0]}>
            {/* 机身 */}
            <RoundedBox args={[8, 1.2, 1.0]} radius={0.2} position={[0, 0.6, 0]}>
                <meshStandardMaterial color={color} metalness={0.8} roughness={0.3} />
            </RoundedBox>
            {/* 机头 */}
            <Box args={[2.0, 1.0, 0.9]} position={[-3.5, 0.6, 0]} rotation={[0, 0, 0.1]}>
                <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
            </Box>
            {/* 座舱 */}
            <Box args={[1.0, 0.6, 1.0]} position={[-2.0, 0.8, 0]}>
                <meshStandardMaterial color="#0a0a0a" metalness={0.1} roughness={0.1} transparent opacity={0.3} />
            </Box>
            {/* 主翼 */}
            <Box args={[0.2, 0.1, 6.0]} position={[0.5, 0.6, 0]} rotation={[0, 0, -0.03]}>
                <meshStandardMaterial color={color} metalness={0.7} roughness={0.4} />
            </Box>
            {/* 尾翼 */}
            <Box args={[0.18, 0.9, 2.0]} position={[3.5, 0.9, 0]}>
                <meshStandardMaterial color={color} metalness={0.7} roughness={0.4} />
            </Box>
            {/* 垂直尾翼 */}
            <Box args={[0.18, 1.8, 0.4]} position={[3.5, 1.6, 0]}>
                <meshStandardMaterial color={color} metalness={0.7} roughness={0.4} />
            </Box>
            {/* 发动机尾喷口 */}
            <Cylinder args={[0.4, 0.35, 0.7, 16]} position={[4.0, 0.6, 0]} rotation={[0, 0, Math.PI / 2]}>
                <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.1} />
            </Cylinder>
        </group>
    )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function GridFloor() {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial color="#000" />
            <gridHelper args={[100, 50, '#1a1a1a', '#0a0a0a']} position={[0, 0.01, 0]} rotation={[Math.PI / 2, 0, 0]} />
        </mesh>
    )
}

const DivineEngine: React.FC = () => {
    const { isAuthenticated, loading: authLoading, token } = useAuth()
    const navigate = useNavigate()
    
    // 登录检查
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate('/admin')
            return
        }
    }, [isAuthenticated, authLoading, navigate])
    
    // 如果正在加载，显示加载状态
    if (authLoading) {
        return (
            <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
                <div style={{ 
                    height: '100vh', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    background: '#050505',
                    color: '#fff'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>加载中...</div>
                        <div style={{ color: '#888' }}>正在验证登录状态...</div>
                    </div>
                </div>
            </ConfigProvider>
        )
    }
    
    // 如果未登录，显示提示
    if (!isAuthenticated) {
        return (
            <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
                <div style={{ 
                    height: '100vh', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    background: '#050505',
                    color: '#fff'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>请先登录</div>
                        <div style={{ color: '#888', marginBottom: '2rem' }}>您需要登录才能使用神机演武功能</div>
                        <Button type="primary" onClick={() => navigate('/admin')}>
                            前往登录
                        </Button>
                    </div>
                </div>
            </ConfigProvider>
        )
    }
    
    const [prompt, setPrompt] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)
    const [currentModel, setCurrentModel] = useState<'tank' | 'drone' | 'armor' | 'exoskeleton' | 'fighter' | 'carrier' | 'artillery' | 'missile' | null>('tank')
    const [stats, setStats] = useState({ speed: 45, armor: 88, firepower: 92, stealth: 30 })
    const [aiResult, setAiResult] = useState<AIDesignResult | null>(null)
    const [savedSchemes, setSavedSchemes] = useState<SavedDesign[]>([])
    const [selectedSchemeId, setSelectedSchemeId] = useState<string | null>(null)
    const [detailModalVisible, setDetailModalVisible] = useState(false)
    const [selectedDetailScheme, setSelectedDetailScheme] = useState<SavedDesign | null>(null)

    // 加载保存的设计方案
    const loadSavedDesigns = async () => {
        if (!token) {
            console.log('⚠️  无法加载设计方案：没有token')
            return
        }
        try {
            console.log('📥 开始加载设计方案...')
            const designs = await aiApi.getDesigns(token)
            console.log('✅ 加载到设计方案:', designs.length, '个')
            console.log('设计方案列表:', designs)
            setSavedSchemes(designs)
            if (designs.length > 0 && !selectedSchemeId) {
                // 默认选择最新的方案
                setSelectedSchemeId(designs[0].id)
                const latest = designs[0]
                setAiResult(latest.result)
                
                // 智能匹配模型类型
                let modelType: 'tank' | 'drone' | 'armor' | 'exoskeleton' | 'fighter' | 'carrier' | 'artillery' | 'missile' = latest.result.modelType as any
                const lowerName = latest.result.name?.toLowerCase() || ''
                if (lowerName.includes('东风') || lowerName.includes('导弹') || lowerName.includes('df-') || 
                    lowerName.includes('df') || lowerName.includes('missile') || lowerName.includes('rocket') ||
                    lowerName.includes('弹道') || lowerName.includes('洲际') || lowerName.includes('战略')) {
                    modelType = 'missile'
                } else if (lowerName.includes('航母') || lowerName.includes('辽宁') || lowerName.includes('舰')) {
                    modelType = 'carrier'
                } else if (lowerName.includes('飞机') || lowerName.includes('战斗机') || lowerName.includes('战机') || lowerName.includes('歼')) {
                    modelType = 'fighter'
                } else if (lowerName.includes('无人') || lowerName.includes('drone')) {
                    modelType = 'drone'
                } else if (lowerName.includes('装甲') || lowerName.includes('armor')) {
                    modelType = 'armor'
                } else if (lowerName.includes('外骨骼')) {
                    modelType = 'exoskeleton'
                } else if (lowerName.includes('坦克') || lowerName.includes('tank')) {
                    modelType = 'tank'
                } else if (lowerName.includes('火炮') || lowerName.includes('cannon')) {
                    modelType = 'artillery'
                }
                
                setCurrentModel(modelType)
                setStats(latest.result.stats)
                setPrompt(latest.prompt)
            }
        } catch (error: any) {
            console.error('❌ 加载设计方案失败:', error)
            console.error('错误详情:', error.message, error.stack)
            // 即使加载失败，也显示默认方案（空数组会触发显示默认方案）
            setSavedSchemes([])
        }
    }

    useEffect(() => {
        if (token && isAuthenticated) {
            loadSavedDesigns()
        }
    }, [token, isAuthenticated])

    const handleGenerate = async () => {
        if (!prompt.trim()) return
        if (!token) {
            message.error('请先登录')
            return
        }

        setIsGenerating(true)
        message.loading({ content: 'AI正在分析设计需求...', key: 'ai-generate', duration: 0 })

        try {
            // 调用真实AI API
            const result = await aiApi.analyzeDesign(token, prompt)
            
            // 更新状态
            setAiResult(result)
            
            // 智能匹配模型类型 - 更完善的识别
            let modelType: 'tank' | 'drone' | 'armor' | 'exoskeleton' | 'fighter' | 'carrier' | 'artillery' | 'missile' = result.modelType as any
            const lowerName = result.name?.toLowerCase() || ''
            const lowerType = result.equipmentType?.toLowerCase() || ''
            
            // 如果AI返回的是导弹/火箭类型，使用missile模型
            if (lowerName.includes('东风') || lowerName.includes('导弹') || lowerName.includes('df-') || 
                lowerName.includes('df') || lowerName.includes('missile') || lowerName.includes('rocket') ||
                lowerName.includes('弹道') || lowerName.includes('洲际') || lowerName.includes('战略') ||
                lowerType.includes('missile') || lowerType.includes('rocket')) {
                modelType = 'missile'
            } else if (lowerName.includes('航母') || lowerName.includes('辽宁') || lowerName.includes('山东') || 
                lowerName.includes('carrier') || lowerName.includes('舰') || lowerName.includes('船')) {
                modelType = 'carrier'
            } else if (lowerName.includes('飞机') || lowerName.includes('战斗机') || lowerName.includes('战机') || 
                lowerName.includes('歼') || lowerName.includes('j-') || lowerName.includes('j20') || 
                lowerName.includes('j10') || lowerName.includes('j15') || lowerName.includes('j11') ||
                lowerName.includes('fighter') || lowerType.includes('aircraft') || lowerType.includes('fighter')) {
                modelType = 'fighter'
            } else if (lowerName.includes('无人') || lowerName.includes('drone') || lowerName.includes('uav') ||
                lowerName.includes('彩虹') || lowerName.includes('rainbow')) {
                modelType = 'drone'
            } else if (lowerName.includes('装甲') || lowerName.includes('armor') || lowerName.includes('防护')) {
                modelType = 'armor'
            } else if (lowerName.includes('外骨骼') || lowerName.includes('exoskeleton')) {
                modelType = 'exoskeleton'
            } else if (lowerName.includes('坦克') || lowerName.includes('tank') || lowerName.includes('99式') ||
                lowerName.includes('59式') || lowerName.includes('15式')) {
                modelType = 'tank'
            } else if (lowerName.includes('火炮') || lowerName.includes('cannon') || lowerName.includes('火箭炮')) {
                modelType = 'artillery'
            } else {
                // 默认根据modelType判断
                modelType = result.modelType as any || 'tank'
            }
            
            setCurrentModel(modelType)
            setStats({
                speed: result.stats.speed,
                armor: result.stats.armor,
                firepower: result.stats.firepower,
                stealth: result.stats.stealth
            })

            // 设计方案已自动保存到数据库，重新加载列表
            console.log('💾 设计方案已保存，重新加载列表...')
            await loadSavedDesigns()
            
            // 设置当前选中的方案（最新的）
            try {
                const designs = await aiApi.getDesigns(token)
                console.log('📋 获取到设计方案:', designs.length, '个')
                if (designs.length > 0) {
                    const latest = designs[0]
                    console.log('✅ 选择最新方案:', latest.id, latest.name)
                    setSelectedSchemeId(latest.id)
                }
            } catch (error) {
                console.error('获取设计方案列表失败:', error)
            }

            message.success({ 
                content: `AI分析完成: ${result.name}`, 
                key: 'ai-generate',
                duration: 3
            })
        } catch (error: any) {
            console.error('AI分析失败:', error)
            message.error({ 
                content: error.message || 'AI分析失败，请检查后端配置', 
                key: 'ai-generate',
                duration: 5
            })
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
            <div className="divine-container">
                <div className="divine-header">
                    <div className="divine-title">神机演武 AI</div>
                    <div className="ai-input-group">
                        <input
                            className="ai-input"
                            placeholder="输入装备设计需求，例如：'高机动性隐身侦察坦克'..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                        />
                        <button
                            className="generate-btn"
                            onClick={handleGenerate}
                            disabled={isGenerating || !prompt}
                        >
                            {isGenerating ? '生成中...' : '开始演练'} <ThunderboltOutlined />
                        </button>
                    </div>
                </div>

                <div className="simulation-arena">
                    <Canvas shadows>
                        <PerspectiveCamera makeDefault position={[10, 5, 10]} fov={60} />
                        <color attach="background" args={['#050508']} />
                        <fog attach="fog" args={['#050508', 10, 50]} />

                        {/* 增强光照 - 让模型更清晰可见 - 优化版 */}
                        <ambientLight intensity={1.4} />
                        <directionalLight position={[10, 10, 5]} intensity={3.0} castShadow color="#ffffff" />
                        <directionalLight position={[-10, 8, -5]} intensity={2.0} color="#c9a55c" />
                        <directionalLight position={[0, 15, 0]} intensity={1.5} color="#ffffff" />
                        <pointLight position={[-10, 5, -10]} intensity={2.0} color="#c9a55c" />
                        <pointLight position={[10, 5, 10]} intensity={1.8} color="#ffffff" />
                        <pointLight position={[0, 8, 0]} intensity={1.2} color="#ffffff" />
                        <spotLight position={[10, 10, 5]} angle={0.5} penumbra={1} intensity={4} castShadow color="#ffffff" />
                        <spotLight position={[-10, 8, -5]} angle={0.6} penumbra={1} intensity={2.5} color="#c9a55c" />
                        <spotLight position={[0, 12, 0]} angle={0.8} penumbra={1} intensity={2} color="#ffffff" />

                        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade />

                        {/* Simulation Grid - 网格位置调整 */}
                        <gridHelper args={[100, 40, '#00ffaa', '#111']} position={[0, 0, 0]} />

                        {/* Content - 完善的3D模型库 - 放大并提高位置 */}
                        {!isGenerating && (
                            <>
                                {/* 坦克模型 - 放大2倍，提高位置，添加地面和环境细节 */}
                                {currentModel === 'tank' && (
                                    <group position={[0, 1.5, 0]} scale={[1.8, 1.8, 1.8]}>
                                        <Type99Tank position={[0, 0, 0]} />
                                        
                                        {/* 添加地面效果 - 改进版 */}
                                        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
                                            <planeGeometry args={[12, 12, 12, 12]} />
                                            <meshStandardMaterial color="#2a2a1a" roughness={0.9} metalness={0.1} />
                                        </mesh>
                                        
                                        {/* 添加地面纹理细节 - 更多细节 */}
                                        {Array.from({ length: 36 }).map((_, i) => {
                                            const x = -5 + (i % 6) * 2
                                            const z = -5 + Math.floor(i / 6) * 2
                                            return (
                                                <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[x, -0.09, z]}>
                                                    <boxGeometry args={[1.8, 1.8, 0.02]} />
                                                    <meshStandardMaterial 
                                                        color={i % 2 === 0 ? "#1a1a1a" : "#252525"} 
                                                        roughness={0.95} 
                                                    />
                                                </mesh>
                                            )
                                        })}
                                        
                                        {/* 添加地面裂缝和细节 */}
                                        {Array.from({ length: 8 }).map((_, i) => {
                                            const angle = (i / 8) * Math.PI * 2
                                            const x = Math.cos(angle) * 3
                                            const z = Math.sin(angle) * 3
                                            return (
                                                <mesh key={`crack-${i}`} rotation={[-Math.PI / 2, angle, 0]} position={[x, -0.08, z]}>
                                                    <boxGeometry args={[0.05, 2, 0.01]} />
                                                    <meshStandardMaterial color="#0a0a0a" />
                                                </mesh>
                                            )
                                        })}
                                        
                                        {/* 添加碎石和杂物 */}
                                        {Array.from({ length: 15 }).map((_, i) => {
                                            const x = -4 + Math.random() * 8
                                            const z = -4 + Math.random() * 8
                                            const size = 0.1 + Math.random() * 0.2
                                            return (
                                                <mesh key={`debris-${i}`} position={[x, -0.07, z]} rotation={[Math.random(), Math.random(), Math.random()]}>
                                                    <boxGeometry args={[size, size * 0.5, size]} />
                                                    <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
                                                </mesh>
                                            )
                                        })}
                                        
                                        {/* 添加阴影效果 */}
                                        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]} receiveShadow>
                                            <planeGeometry args={[10, 10]} />
                                            <shadowMaterial opacity={0.4} />
                                        </mesh>
                                        
                                        {/* 添加环境光效 */}
                                        <pointLight position={[2, 2, 2]} intensity={0.5} color="#c9a55c" />
                                        <pointLight position={[-2, 1, -2]} intensity={0.3} color="#888" />
                                    </group>
                                )}
                                
                                {/* 战斗机模型 - 放大2倍，提高位置，添加云层和细节 */}
                                {currentModel === 'fighter' && (
                                    <group position={[0, 2, 0]} scale={[1.5, 1.5, 1.5]}>
                                        <J20Fighter position={[0, 0, 0]} />
                                        
                                        {/* 添加更多云层效果 - 多层云 */}
                                        {Array.from({ length: 12 }).map((_, i) => {
                                            const x = -4 + (i % 4) * 2.5
                                            const y = -1.5 + Math.floor(i / 4) * 0.5
                                            const z = -3 + (i % 3) * 1.5
                                            return (
                                                <mesh key={i} position={[x, y, z]} rotation={[0, Math.random() * Math.PI, 0]}>
                                                    <boxGeometry args={[1.5 + Math.random() * 0.5, 0.2 + Math.random() * 0.2, 0.8 + Math.random() * 0.3]} />
                                                    <meshStandardMaterial 
                                                        color="#4a4a5a" 
                                                        transparent 
                                                        opacity={0.2 + Math.random() * 0.2} 
                                                    />
                                                </mesh>
                                            )
                                        })}
                                        
                                        {/* 添加尾迹效果 - 多层尾迹 */}
                                        {Array.from({ length: 3 }).map((_, i) => (
                                            <mesh key={`trail-${i}`} position={[-2 - i * 0.3, 0, 0]} rotation={[0, 0, 0]}>
                                                <coneGeometry args={[0.3 - i * 0.05, 1.5 - i * 0.3, 8]} />
                                                <meshStandardMaterial 
                                                    color="#888" 
                                                    transparent 
                                                    opacity={0.2 - i * 0.05} 
                                                    emissive="#888"
                                                    emissiveIntensity={0.1}
                                                />
                                            </mesh>
                                        ))}
                                        
                                        {/* 添加音爆效果 */}
                                        <mesh position={[-1, 0, 0]} rotation={[0, 0, 0]}>
                                            <ringGeometry args={[0.8, 1.2, 16]} />
                                            <meshStandardMaterial 
                                                color="#ffffff" 
                                                transparent 
                                                opacity={0.1} 
                                                side={2}
                                                emissive="#ffffff"
                                                emissiveIntensity={0.2}
                                            />
                                        </mesh>
                                        
                                        {/* 添加武器挂载点细节 */}
                                        {[-1.5, 0, 1.5].map((x, i) => (
                                            <mesh key={`pylon-${i}`} position={[x, 0.5, 0.6]}>
                                                <boxGeometry args={[0.1, 0.15, 0.2]} />
                                                <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
                                            </mesh>
                                        ))}
                                        
                                        {/* 添加环境光效 */}
                                        <pointLight position={[2, 2, 2]} intensity={0.8} color="#ffffff" />
                                        <pointLight position={[-2, 1, -2]} intensity={0.4} color="#4a4a5a" />
                                    </group>
                                )}
                                
                                {/* 无人机模型 - 放大2倍，提高位置，添加飞行轨迹和细节 */}
                                {currentModel === 'drone' && (
                                    <group position={[0, 2.5, 0]} scale={[1.6, 1.6, 1.6]}>
                                        <Rainbow5Drone position={[0, 0, 0]} />
                                        
                                        {/* 添加更多飞行轨迹线 - 动态效果 */}
                                        {Array.from({ length: 20 }).map((_, i) => (
                                            <mesh key={i} position={[-3 + i * 0.3, Math.sin(i * 0.5) * 0.2, -1.5 + Math.cos(i * 0.3) * 0.5]} rotation={[0, 0, 0]}>
                                                <sphereGeometry args={[0.05, 8, 8]} />
                                                <meshStandardMaterial 
                                                    color="#00ff00" 
                                                    emissive="#00ff00" 
                                                    emissiveIntensity={0.5 + Math.sin(i) * 0.2} 
                                                />
                                            </mesh>
                                        ))}
                                        
                                        {/* 添加多层扫描线效果 */}
                                        {[0, 0.3, 0.6].map((offset, i) => (
                                            <mesh key={`scan-${i}`} position={[0, offset, 0]} rotation={[0, 0, 0]}>
                                                <ringGeometry args={[1.5 + i * 0.2, 1.6 + i * 0.2, 32]} />
                                                <meshStandardMaterial 
                                                    color="#00ff00" 
                                                    transparent 
                                                    opacity={0.3 - i * 0.1} 
                                                    side={2}
                                                    emissive="#00ff00"
                                                    emissiveIntensity={0.2}
                                                />
                                            </mesh>
                                        ))}
                                        
                                        {/* 添加数据链信号 */}
                                        {Array.from({ length: 8 }).map((_, i) => {
                                            const angle = (i / 8) * Math.PI * 2
                                            const x = Math.cos(angle) * 2
                                            const z = Math.sin(angle) * 2
                                            return (
                                                <mesh key={`signal-${i}`} position={[x, 0, z]}>
                                                    <sphereGeometry args={[0.08, 8, 8]} />
                                                    <meshStandardMaterial 
                                                        color="#00ffff" 
                                                        emissive="#00ffff" 
                                                        emissiveIntensity={0.6}
                                                        transparent
                                                        opacity={0.7}
                                                    />
                                                </mesh>
                                            )
                                        })}
                                        
                                        {/* 添加环境光效 */}
                                        <pointLight position={[0, 1, 0]} intensity={0.6} color="#00ff00" />
                                        <pointLight position={[1, 0, 1]} intensity={0.4} color="#00ffff" />
                                    </group>
                                )}
                                
                                {/* 航母模型 - 放大并添加大量细节模组 */}
                                {currentModel === 'carrier' && (
                                    <group position={[0, 2, 0]} scale={[1.0, 1.0, 1.0]}>
                                        <LiaoningCarrier position={[0, 0, 0]} rotation={[0, Math.PI / 4, 0]} />
                                        
                                        {/* 添加更多舰载机模型 - 8架歼-15，分布在甲板各处 */}
                                        {[-28, -20, -12, -4, 4, 12, 20, 28].map((x, i) => (
                                            <group key={i} position={[x, 0, i % 2 === 0 ? 2 : -2]} scale={[0.3, 0.3, 0.3]}>
                                                <J15CarrierFighter position={[0, 0, 0]} rotation={[0, i % 2 === 0 ? Math.PI / 2 : -Math.PI / 2, 0]} />
                                            </group>
                                        ))}
                                        
                                        {/* 添加更多直升机 - 4架，不同位置 */}
                                        {[-25, -8, 8, 25].map((x, i) => (
                                            <group key={`helo-${i}`} position={[x, 0, i % 2 === 0 ? -4 : 4]} scale={[0.3, 0.3, 0.3]}>
                                                {/* 机身 */}
                                                <mesh position={[0, 0.5, 0]}>
                                                    <boxGeometry args={[1, 0.8, 0.6]} />
                                                    <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.4} />
                                                </mesh>
                                                {/* 主旋翼 */}
                                                <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.8, 0]}>
                                                    <cylinderGeometry args={[0.02, 0.02, 2.5, 8]} />
                                                    <meshStandardMaterial color="#1a1a1a" />
                                                </mesh>
                                                {/* 尾桨 */}
                                                <mesh rotation={[0, 0, Math.PI / 2]} position={[0.5, 0.5, 0]}>
                                                    <cylinderGeometry args={[0.01, 0.01, 0.8, 8]} />
                                                    <meshStandardMaterial color="#1a1a1a" />
                                                </mesh>
                                                {/* 起落架 */}
                                                {[[-0.3, 0, -0.3], [0.3, 0, -0.3], [0, 0, 0.3]].map((pos, j) => (
                                                    <mesh key={j} position={[pos[0], 0.2, pos[2]]}>
                                                        <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
                                                        <meshStandardMaterial color="#1a1a1a" />
                                                    </mesh>
                                                ))}
                                            </group>
                                        ))}
                                        
                                        {/* 添加甲板设备 - 牵引车 */}
                                        {[-18, 18].map((x, i) => (
                                            <group key={`tug-${i}`} position={[x, 0, 0]} scale={[0.2, 0.2, 0.2]}>
                                                <mesh position={[0, 0.2, 0]}>
                                                    <boxGeometry args={[1.5, 0.4, 0.8]} />
                                                    <meshStandardMaterial color="#3a3a3a" metalness={0.5} roughness={0.6} />
                                                </mesh>
                                                {/* 轮子 */}
                                                {[-0.5, 0.5].map((z, j) => (
                                                    <mesh key={j} position={[0, 0.1, z]} rotation={[0, 0, Math.PI / 2]}>
                                                        <cylinderGeometry args={[0.2, 0.2, 0.1, 12]} />
                                                        <meshStandardMaterial color="#1a1a1a" />
                                                    </mesh>
                                                ))}
                                            </group>
                                        ))}
                                        
                                        {/* 添加甲板标记和细节 */}
                                        {Array.from({ length: 15 }).map((_, i) => {
                                            const x = -30 + (i * 4)
                                            return (
                                                <mesh key={`mark-${i}`} position={[x, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                                                    <boxGeometry args={[0.05, 0.01, 12]} />
                                                    <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.3} />
                                                </mesh>
                                            )
                                        })}
                                        
                                        {/* 添加水面效果 - 改进版 */}
                                        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
                                            <planeGeometry args={[200, 200, 30, 30]} />
                                            <meshStandardMaterial 
                                                color="#1a2a3a" 
                                                roughness={0.1} 
                                                metalness={0.3}
                                                transparent
                                                opacity={0.8}
                                            />
                                        </mesh>
                                        
                                        {/* 添加更多海浪细节 - 动态波浪 */}
                                        {Array.from({ length: 50 }).map((_, i) => {
                                            const angle = (i / 50) * Math.PI * 2
                                            const radius = 35 + Math.random() * 15
                                            const x = Math.cos(angle) * radius
                                            const z = Math.sin(angle) * radius
                                            const height = Math.random() * 0.15
                                            return (
                                                <mesh key={i} position={[x, -0.45 + height, z]} rotation={[-Math.PI / 2, 0, 0]}>
                                                    <boxGeometry args={[1.5 + Math.random() * 0.5, 0.08, 0.2 + Math.random() * 0.1]} />
                                                    <meshStandardMaterial color="#2a3a4a" transparent opacity={0.4 + Math.random() * 0.2} />
                                                </mesh>
                                            )
                                        })}
                                        
                                        {/* 添加水花效果 */}
                                        {Array.from({ length: 20 }).map((_, i) => {
                                            const angle = (i / 20) * Math.PI * 2
                                            const radius = 25 + Math.random() * 5
                                            const x = Math.cos(angle) * radius
                                            const z = Math.sin(angle) * radius
                                            return (
                                                <mesh key={`spray-${i}`} position={[x, -0.4, z]}>
                                                    <sphereGeometry args={[0.1 + Math.random() * 0.1, 8, 8]} />
                                                    <meshStandardMaterial color="#4a5a6a" transparent opacity={0.3} />
                                                </mesh>
                                            )
                                        })}
                                    </group>
                                )}
                                
                                {/* 装甲模型 - 放大2倍，提高位置，添加防护效果和细节 */}
                                {currentModel === 'armor' && (
                                    <group position={[0, 1.5, 0]} scale={[2.5, 2.5, 2.5]}>
                                        <GeneratedTank position={[0, 0, 0]} color="#4a5a4a" />
                                        
                                        {/* 添加多层防护力场效果 */}
                                        {[0, 0.2, 0.4].map((offset, i) => (
                                            <mesh key={`shield-${i}`} position={[0, 0.5 + offset, 0]}>
                                                <sphereGeometry args={[2 + i * 0.3, 16, 16]} />
                                                <meshStandardMaterial 
                                                    color="#4a5a4a" 
                                                    transparent 
                                                    opacity={0.1 - i * 0.03} 
                                                    wireframe
                                                    emissive="#4a5a4a"
                                                    emissiveIntensity={0.2 - i * 0.05}
                                                />
                                            </mesh>
                                        ))}
                                        
                                        {/* 添加能量流动效果 */}
                                        {Array.from({ length: 12 }).map((_, i) => {
                                            const angle = (i / 12) * Math.PI * 2
                                            const x = Math.cos(angle) * 1.8
                                            const z = Math.sin(angle) * 1.8
                                            return (
                                                <mesh key={`energy-${i}`} position={[x, 0.5, z]}>
                                                    <boxGeometry args={[0.1, 0.5, 0.1]} />
                                                    <meshStandardMaterial 
                                                        color="#4a5a4a" 
                                                        emissive="#4a5a4a" 
                                                        emissiveIntensity={0.4}
                                                    />
                                                </mesh>
                                            )
                                        })}
                                        
                                        {/* 添加地面 - 改进版 */}
                                        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
                                            <planeGeometry args={[10, 10, 10, 10]} />
                                            <meshStandardMaterial color="#2a2a1a" roughness={0.9} />
                                        </mesh>
                                        
                                        {/* 添加地面纹理 */}
                                        {Array.from({ length: 25 }).map((_, i) => {
                                            const x = -4 + (i % 5) * 2
                                            const z = -4 + Math.floor(i / 5) * 2
                                            return (
                                                <mesh key={`ground-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, -0.09, z]}>
                                                    <boxGeometry args={[1.8, 1.8, 0.02]} />
                                                    <meshStandardMaterial 
                                                        color={i % 2 === 0 ? "#1a1a1a" : "#252525"} 
                                                        roughness={0.95} 
                                                    />
                                                </mesh>
                                            )
                                        })}
                                        
                                        {/* 添加环境光效 */}
                                        <pointLight position={[2, 2, 2]} intensity={0.6} color="#4a5a4a" />
                                        <pointLight position={[-2, 1, -2]} intensity={0.3} color="#2a3a2a" />
                                    </group>
                                )}
                                
                                {/* 外骨骼模型 - 放大2倍，提高位置，添加细节 */}
                                {currentModel === 'exoskeleton' && (
                                    <group position={[0, 2, 0]} scale={[2.5, 2.5, 2.5]}>
                                        <DroneModel color="#3a4a3a" />
                                        
                                        {/* 添加能量核心效果 */}
                                        <mesh position={[0, 0.5, 0]}>
                                            <sphereGeometry args={[0.3, 16, 16]} />
                                            <meshStandardMaterial 
                                                color="#3a4a3a" 
                                                emissive="#3a4a3a" 
                                                emissiveIntensity={0.8}
                                                transparent
                                                opacity={0.9}
                                            />
                                        </mesh>
                                        
                                        {/* 添加能量流动线 */}
                                        {Array.from({ length: 8 }).map((_, i) => {
                                            const angle = (i / 8) * Math.PI * 2
                                            const x = Math.cos(angle) * 0.5
                                            const z = Math.sin(angle) * 0.5
                                            return (
                                                <mesh key={`energy-line-${i}`} position={[x, 0.5, z]}>
                                                    <cylinderGeometry args={[0.02, 0.02, 0.6, 8]} />
                                                    <meshStandardMaterial 
                                                        color="#3a4a3a" 
                                                        emissive="#3a4a3a" 
                                                        emissiveIntensity={0.6}
                                                    />
                                                </mesh>
                                            )
                                        })}
                                        
                                        {/* 添加关节连接点 */}
                                        {[[-0.3, 0.3, 0], [0.3, 0.3, 0], [0, 0.8, 0], [0, 0.2, 0]].map((pos, i) => (
                                            <mesh key={`joint-${i}`} position={pos as [number, number, number]}>
                                                <sphereGeometry args={[0.1, 12, 12]} />
                                                <meshStandardMaterial 
                                                    color="#2a3a2a" 
                                                    metalness={0.9} 
                                                    roughness={0.2}
                                                    emissive="#3a4a3a"
                                                    emissiveIntensity={0.3}
                                                />
                                            </mesh>
                                        ))}
                                        
                                        {/* 添加地面 */}
                                        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
                                            <planeGeometry args={[8, 8]} />
                                            <meshStandardMaterial color="#2a2a1a" roughness={0.9} />
                                        </mesh>
                                        
                                        {/* 添加环境光效 */}
                                        <pointLight position={[1, 1, 1]} intensity={0.6} color="#3a4a3a" />
                                        <pointLight position={[-1, 0.5, -1]} intensity={0.4} color="#2a3a2a" />
                                    </group>
                                )}
                                
                                {/* 导弹模型 - 东风-41等战略导弹 */}
                                {currentModel === 'missile' && (
                                    <group position={[0, 2, 0]} scale={[1.2, 1.2, 1.2]}>
                                        {/* 使用DF21D模型作为基础，优化为东风-41 */}
                                        <DF21DMissile position={[0, 0, 0]} rotation={[0, 0, 0]} />
                                        
                                        {/* 添加发射车细节 */}
                                        <mesh position={[0, 0.2, 0]}>
                                            <boxGeometry args={[4, 0.5, 2]} />
                                            <meshStandardMaterial color="#2a2a2a" roughness={0.5} metalness={0.6} />
                                        </mesh>
                                        
                                        {/* 添加更多车轮 */}
                                        {[-1.5, -0.5, 0.5, 1.5].map((x, i) => (
                                            <mesh key={i} position={[x, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
                                                <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
                                                <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.7} />
                                            </mesh>
                                        ))}
                                        
                                        {/* 添加导弹尾焰效果 */}
                                        <mesh position={[0, 0.5, 0]} rotation={[0, 0, 0]}>
                                            <coneGeometry args={[0.3, 1.5, 8]} />
                                            <meshStandardMaterial 
                                                color="#ff6600" 
                                                emissive="#ff6600" 
                                                emissiveIntensity={1.2}
                                                transparent
                                                opacity={0.8}
                                            />
                                        </mesh>
                                        
                                        {/* 添加烟雾效果 */}
                                        {Array.from({ length: 10 }).map((_, i) => {
                                            const angle = (i / 10) * Math.PI * 2
                                            const x = Math.cos(angle) * 0.4
                                            const z = Math.sin(angle) * 0.4
                                            return (
                                                <mesh key={`smoke-${i}`} position={[x, 0.3, z]}>
                                                    <sphereGeometry args={[0.2 + Math.random() * 0.1, 8, 8]} />
                                                    <meshStandardMaterial 
                                                        color="#666666" 
                                                        transparent 
                                                        opacity={0.4}
                                                        emissive="#666666"
                                                        emissiveIntensity={0.2}
                                                    />
                                                </mesh>
                                            )
                                        })}
                                        
                                        {/* 添加地面 */}
                                        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
                                            <planeGeometry args={[12, 12]} />
                                            <meshStandardMaterial color="#2a2a1a" roughness={0.9} />
                                        </mesh>
                                        
                                        {/* 添加地面纹理 */}
                                        {Array.from({ length: 36 }).map((_, i) => {
                                            const x = -5 + (i % 6) * 2
                                            const z = -5 + Math.floor(i / 6) * 2
                                            return (
                                                <mesh key={`ground-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, -0.09, z]}>
                                                    <boxGeometry args={[1.8, 1.8, 0.02]} />
                                                    <meshStandardMaterial 
                                                        color={i % 2 === 0 ? "#1a1a1a" : "#252525"} 
                                                        roughness={0.95} 
                                                    />
                                                </mesh>
                                            )
                                        })}
                                        
                                        {/* 添加环境光效 */}
                                        <pointLight position={[2, 2, 2]} intensity={0.8} color="#ff6600" />
                                        <pointLight position={[-2, 1, -2]} intensity={0.4} color="#888" />
                                    </group>
                                )}
                                
                                {/* 火炮模型 - 放大2倍，提高位置，添加发射效果和细节 */}
                                {currentModel === 'artillery' && (
                                    <group position={[0, 1.5, 0]} scale={[1.5, 1.5, 1.5]}>
                                        <Type152Cannon position={[0, 0, 0]} rotation={[0, Math.PI / 4, 0]} />
                                        
                                        {/* 添加多层炮口火焰效果 */}
                                        {[0, 0.2, 0.4].map((offset, i) => (
                                            <mesh key={`flame-${i}`} position={[1 + offset * 0.5, 1, 1]} rotation={[0, Math.PI / 4, 0]}>
                                                <coneGeometry args={[0.2 - i * 0.05, 0.8 - i * 0.2, 8]} />
                                                <meshStandardMaterial 
                                                    color={i === 0 ? "#ff6600" : i === 1 ? "#ff8800" : "#ffaa00"}
                                                    emissive={i === 0 ? "#ff6600" : i === 1 ? "#ff8800" : "#ffaa00"}
                                                    emissiveIntensity={1.0 - i * 0.3}
                                                    transparent
                                                    opacity={0.7 - i * 0.2}
                                                />
                                            </mesh>
                                        ))}
                                        
                                        {/* 添加烟雾效果 */}
                                        {Array.from({ length: 8 }).map((_, i) => {
                                            const angle = (i / 8) * Math.PI * 2
                                            const x = 1.5 + Math.cos(angle) * 0.3
                                            const z = 1.5 + Math.sin(angle) * 0.3
                                            return (
                                                <mesh key={`smoke-${i}`} position={[x, 1.2, z]}>
                                                    <sphereGeometry args={[0.15 + Math.random() * 0.1, 8, 8]} />
                                                    <meshStandardMaterial 
                                                        color="#666666" 
                                                        transparent 
                                                        opacity={0.3}
                                                        emissive="#666666"
                                                        emissiveIntensity={0.1}
                                                    />
                                                </mesh>
                                            )
                                        })}
                                        
                                        {/* 添加弹壳 */}
                                        {Array.from({ length: 3 }).map((_, i) => (
                                            <mesh key={`shell-${i}`} position={[0.5, 0.3, 0.5 + i * 0.3]} rotation={[Math.PI / 4, 0, 0]}>
                                                <cylinderGeometry args={[0.08, 0.08, 0.3, 12]} />
                                                <meshStandardMaterial color="#8a8a8a" metalness={0.9} roughness={0.2} />
                                            </mesh>
                                        ))}
                                        
                                        {/* 添加地面 - 改进版 */}
                                        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
                                            <planeGeometry args={[12, 12, 12, 12]} />
                                            <meshStandardMaterial color="#2a2a1a" roughness={0.9} />
                                        </mesh>
                                        
                                        {/* 添加地面纹理 */}
                                        {Array.from({ length: 36 }).map((_, i) => {
                                            const x = -5 + (i % 6) * 2
                                            const z = -5 + Math.floor(i / 6) * 2
                                            return (
                                                <mesh key={`ground-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, -0.09, z]}>
                                                    <boxGeometry args={[1.8, 1.8, 0.02]} />
                                                    <meshStandardMaterial 
                                                        color={i % 2 === 0 ? "#1a1a1a" : "#252525"} 
                                                        roughness={0.95} 
                                                    />
                                                </mesh>
                                            )
                                        })}
                                        
                                        {/* 添加环境光效 */}
                                        <pointLight position={[2, 2, 2]} intensity={0.8} color="#ff6600" />
                                        <pointLight position={[-2, 1, -2]} intensity={0.4} color="#888" />
                                    </group>
                                )}
                                
                                {/* 默认显示坦克 - 放大2倍，提高位置 */}
                                {!currentModel && (
                                    <group position={[0, 1.5, 0]} scale={[1.8, 1.8, 1.8]}>
                                        <Type99Tank position={[0, 0, 0]} />
                                    </group>
                                )}
                            </>
                        )}

                        <OrbitControls autoRotate autoRotateSpeed={0.5} maxPolarAngle={Math.PI / 2 - 0.1} />
                    </Canvas>

                    {/* HUD Overlay */}
                    <div className="stats-hud">
                        <h4 style={{ color: '#fff', borderBottom: '2px solid #00ffaa', paddingBottom: '10px' }}>
                            <ExperimentOutlined /> {aiResult ? `${aiResult.name} - AI评估报告` : '仿真评估报告'}
                        </h4>
                        {aiResult && (
                            <div style={{ marginBottom: '1rem', fontSize: '0.85rem', color: '#ccc', lineHeight: '1.4' }}>
                                {aiResult.description}
                            </div>
                        )}
                        <div className="hud-row">
                            <span>机动性 (MOBILITY)</span>
                            <span className="hud-value">{stats.speed} / 100</span>
                        </div>
                        <div className="hud-row">
                            <span>防护力 (ARMOR)</span>
                            <span className="hud-value">{stats.armor} / 100</span>
                        </div>
                        <div className="hud-row">
                            <span>火力指数 (FIREPOWER)</span>
                            <span className="hud-value">{stats.firepower} / 100</span>
                        </div>
                        <div className="hud-row">
                            <span>隐身性能 (STEALTH)</span>
                            <span className="hud-value">{stats.stealth} / 100</span>
                        </div>
                        {aiResult && aiResult.designSuggestions.length > 0 && (
                            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                <div style={{ fontSize: '0.85rem', color: '#00ffaa', marginBottom: '0.5rem' }}>AI设计建议:</div>
                                {aiResult.designSuggestions.slice(0, 3).map((suggestion, i) => (
                                    <div key={i} style={{ fontSize: '0.75rem', color: '#ccc', marginBottom: '0.3rem', lineHeight: '1.3' }}>
                                        • {suggestion}
                                    </div>
                                ))}
                            </div>
                        )}
                        <div style={{ marginTop: '1rem', fontSize: '0.8rem', opacity: 0.7 }}>
                            * {aiResult ? '基于AI大模型分析' : '基于虚拟风洞与弹道仿真引擎 V4.2'}
                        </div>
                    </div>

                    {isGenerating && (
                        <div className="generation-overlay">
                            <h2 className="animate-pulse">正在解析设计意图...</h2>
                            <p>Loading Neural Geometry Kernels...</p>
                        </div>
                    )}
                </div>

                <div className="history-panel">
                    {savedSchemes.map((scheme) => (
                        <div 
                            key={scheme.id}
                            className={`history-item ${selectedSchemeId === scheme.id ? 'active' : ''}`}
                        >
                            <div 
                                className="history-item-content"
                                onClick={async () => {
                                    if (!token) return
                                    try {
                                        const design = await aiApi.getDesign(token, scheme.id)
                                        setSelectedSchemeId(scheme.id)
                                        setAiResult(design)
                                        
                                        // 智能匹配模型类型
                                    let modelType: 'tank' | 'drone' | 'armor' | 'exoskeleton' | 'fighter' | 'carrier' | 'artillery' | 'missile' = design.modelType as any
                                    const lowerName = design.name?.toLowerCase() || ''
                                    if (lowerName.includes('东风') || lowerName.includes('导弹') || lowerName.includes('df-') || 
                                        lowerName.includes('df') || lowerName.includes('missile') || lowerName.includes('rocket') ||
                                        lowerName.includes('弹道') || lowerName.includes('洲际') || lowerName.includes('战略')) {
                                        modelType = 'missile'
                                    } else if (lowerName.includes('航母') || lowerName.includes('辽宁') || lowerName.includes('舰')) {
                                        modelType = 'carrier'
                                    } else if (lowerName.includes('飞机') || lowerName.includes('战斗机') || lowerName.includes('战机') || lowerName.includes('歼') || lowerName.includes('fighter')) {
                                        modelType = 'fighter'
                                    } else if (lowerName.includes('无人') || lowerName.includes('drone')) {
                                        modelType = 'drone'
                                    } else if (lowerName.includes('装甲') || lowerName.includes('armor')) {
                                        modelType = 'armor'
                                    } else if (lowerName.includes('外骨骼')) {
                                        modelType = 'exoskeleton'
                                    } else if (lowerName.includes('坦克') || lowerName.includes('tank')) {
                                        modelType = 'tank'
                                    } else if (lowerName.includes('火炮') || lowerName.includes('cannon')) {
                                        modelType = 'artillery'
                                    }
                                        
                                        setCurrentModel(modelType)
                                        setStats(design.stats)
                                        setPrompt(scheme.prompt)
                                    } catch (error) {
                                        console.error('加载设计方案失败:', error)
                                        message.error('加载设计方案失败')
                                    }
                                }}
                            >
                                <span className="history-item-name">{scheme.name}</span>
                            </div>
                            <div className="history-item-actions" onClick={(e) => e.stopPropagation()}>
                                <Button
                                    type="text"
                                    size="small"
                                    icon={<EyeOutlined />}
                                    onClick={() => {
                                        setSelectedDetailScheme(scheme)
                                        setDetailModalVisible(true)
                                    }}
                                    title="查看详情"
                                />
                                <Popconfirm
                                    title="确定要删除这个设计方案吗？"
                                    onConfirm={async () => {
                                        if (!token) return
                                        try {
                                            await aiApi.deleteDesign(token, scheme.id)
                                            await loadSavedDesigns()
                                            message.success('设计方案已删除')
                                            if (selectedSchemeId === scheme.id) {
                                                setAiResult(null)
                                                setPrompt('')
                                                setSelectedSchemeId(null)
                                            }
                                        } catch (error) {
                                            message.error('删除失败')
                                        }
                                    }}
                                    okText="确定"
                                    cancelText="取消"
                                >
                                    <Button
                                        type="text"
                                        size="small"
                                        danger
                                        icon={<DeleteOutlined />}
                                        title="删除"
                                    />
                                </Popconfirm>
                            </div>
                        </div>
                    ))}
                    {savedSchemes.length === 0 && (
                        <>
                            <div className="history-item" onClick={() => {
                                setCurrentModel('tank')
                                setStats({ speed: 45, armor: 88, firepower: 92, stealth: 30 })
                                setAiResult(null)
                            }}>重型坦克方案 A</div>
                            <div className="history-item" onClick={() => {
                                setCurrentModel('drone')
                                setStats({ speed: 95, armor: 20, firepower: 70, stealth: 85 })
                                setAiResult(null)
                            }}>无人机方案 B</div>
                            <div className="history-item" onClick={() => {
                                setCurrentModel('tank')
                                setStats({ speed: 35, armor: 95, firepower: 98, stealth: 15 })
                                setAiResult(null)
                            }}>自行火炮方案 C</div>
                        </>
                    )}
                    <div className="history-item" onClick={() => {
                        setPrompt('')
                        setAiResult(null)
                        setSelectedSchemeId(null)
                    }}>+ 新建草稿</div>
                    
                </div>
                
                {/* 详情Modal */}
                <Modal
                    title={
                        <Space>
                            <InfoCircleOutlined />
                            <span>设计方案详情 - {selectedDetailScheme?.name}</span>
                        </Space>
                    }
                    open={detailModalVisible}
                    onCancel={() => setDetailModalVisible(false)}
                    footer={[
                        <Button key="close" onClick={() => setDetailModalVisible(false)}>
                            关闭
                        </Button>
                    ]}
                    width={800}
                    className="divine-detail-modal"
                >
                    {selectedDetailScheme && (
                        <div style={{ color: '#e0e0e0' }}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <h3 style={{ color: '#c9a55c', marginBottom: '0.5rem' }}>设计需求</h3>
                                <p style={{ background: '#1a1a1a', padding: '0.8rem', borderRadius: '4px' }}>
                                    {selectedDetailScheme.prompt}
                                </p>
                            </div>
                            
                            <div style={{ marginBottom: '1.5rem' }}>
                                <h3 style={{ color: '#c9a55c', marginBottom: '0.5rem' }}>装备描述</h3>
                                <p style={{ background: '#1a1a1a', padding: '0.8rem', borderRadius: '4px' }}>
                                    {selectedDetailScheme.result.description}
                                </p>
                            </div>
                            
                            <div style={{ marginBottom: '1.5rem' }}>
                                <h3 style={{ color: '#c9a55c', marginBottom: '0.5rem' }}>性能参数</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                                    <div style={{ background: '#1a1a1a', padding: '0.8rem', borderRadius: '4px' }}>
                                        <div style={{ color: '#888', fontSize: '0.9rem' }}>机动性</div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{selectedDetailScheme.result.stats.speed} / 100</div>
                                    </div>
                                    <div style={{ background: '#1a1a1a', padding: '0.8rem', borderRadius: '4px' }}>
                                        <div style={{ color: '#888', fontSize: '0.9rem' }}>防护力</div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{selectedDetailScheme.result.stats.armor} / 100</div>
                                    </div>
                                    <div style={{ background: '#1a1a1a', padding: '0.8rem', borderRadius: '4px' }}>
                                        <div style={{ color: '#888', fontSize: '0.9rem' }}>火力指数</div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{selectedDetailScheme.result.stats.firepower} / 100</div>
                                    </div>
                                    <div style={{ background: '#1a1a1a', padding: '0.8rem', borderRadius: '4px' }}>
                                        <div style={{ color: '#888', fontSize: '0.9rem' }}>隐身性能</div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{selectedDetailScheme.result.stats.stealth} / 100</div>
                                    </div>
                                </div>
                            </div>
                            
                            {selectedDetailScheme.result.designSuggestions && selectedDetailScheme.result.designSuggestions.length > 0 && (
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <h3 style={{ color: '#c9a55c', marginBottom: '0.5rem' }}>AI设计建议</h3>
                                    <ul style={{ background: '#1a1a1a', padding: '1rem', borderRadius: '4px', listStyle: 'none' }}>
                                        {selectedDetailScheme.result.designSuggestions.map((suggestion, idx) => (
                                            <li key={idx} style={{ marginBottom: '0.5rem', paddingLeft: '1rem', position: 'relative' }}>
                                                <span style={{ position: 'absolute', left: 0 }}>•</span>
                                                {suggestion}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            
                            {selectedDetailScheme.result.technicalSpecs && Object.keys(selectedDetailScheme.result.technicalSpecs).length > 0 && (
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <h3 style={{ color: '#c9a55c', marginBottom: '0.5rem' }}>技术规格</h3>
                                    <div style={{ background: '#1a1a1a', padding: '0.8rem', borderRadius: '4px' }}>
                                        {Object.entries(selectedDetailScheme.result.technicalSpecs).map(([key, value]) => (
                                            <div key={key} style={{ marginBottom: '0.5rem' }}>
                                                <span style={{ color: '#888' }}>{key}:</span> <span>{value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {selectedDetailScheme.result.analysis && (
                                <div>
                                    <h3 style={{ color: '#c9a55c', marginBottom: '0.5rem' }}>详细分析</h3>
                                    <p style={{ background: '#1a1a1a', padding: '0.8rem', borderRadius: '4px', lineHeight: '1.6' }}>
                                        {selectedDetailScheme.result.analysis}
                                    </p>
                                </div>
                            )}
                            
                            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #333', color: '#888', fontSize: '0.9rem' }}>
                                创建时间: {new Date(selectedDetailScheme.createdAt).toLocaleString('zh-CN')}
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
        </ConfigProvider>
    )
}

export default DivineEngine
