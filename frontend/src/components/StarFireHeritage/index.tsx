import React, { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import { HeritageMuseum } from './HeritageMuseum'
import { EquipmentViewer } from './EquipmentViewer'
import './StarFireHeritage.css'

const StarFireHeritage: React.FC = () => {
    const [playerGender, setPlayerGender] = useState<'male' | 'female' | null>(null)
    const [showGenderSelect, setShowGenderSelect] = useState(true)

    const handleGenderSelect = (gender: 'male' | 'female') => {
        setPlayerGender(gender)
        setShowGenderSelect(false)
    }

    // 如果还没选择性别，显示选择界面
    if (showGenderSelect) {
        return (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999
            }}>
                <div style={{
                    background: 'rgba(26, 26, 46, 0.95)',
                    padding: '60px 80px',
                    borderRadius: '20px',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                    border: '2px solid rgba(201, 165, 92, 0.3)',
                    textAlign: 'center',
                    maxWidth: '600px'
                }}>
                    <h2 style={{
                        color: '#c9a55c',
                        fontSize: '32px',
                        marginBottom: '10px',
                        fontWeight: 'bold'
                    }}>
                        🏛️ 欢迎来到兵工博物馆
                    </h2>
                    <p style={{
                        color: '#ccc',
                        fontSize: '16px',
                        marginBottom: '40px'
                    }}>
                        请选择您的角色
                    </p>
                    
                    <div style={{
                        display: 'flex',
                        gap: '30px',
                        justifyContent: 'center',
                        marginBottom: '30px'
                    }}>
                        {/* 男性角色 */}
                        <div
                            onClick={() => handleGenderSelect('male')}
                            style={{
                                background: 'rgba(201, 165, 92, 0.1)',
                                border: '3px solid rgba(201, 165, 92, 0.3)',
                                borderRadius: '15px',
                                padding: '30px 40px',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                flex: 1,
                                maxWidth: '200px'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(201, 165, 92, 0.2)'
                                e.currentTarget.style.borderColor = '#c9a55c'
                                e.currentTarget.style.transform = 'translateY(-5px)'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(201, 165, 92, 0.1)'
                                e.currentTarget.style.borderColor = 'rgba(201, 165, 92, 0.3)'
                                e.currentTarget.style.transform = 'translateY(0)'
                            }}
                        >
                            <div style={{
                                fontSize: '60px',
                                marginBottom: '15px'
                            }}>👨</div>
                            <div style={{
                                color: '#c9a55c',
                                fontSize: '20px',
                                fontWeight: 'bold',
                                marginBottom: '5px'
                            }}>男性角色</div>
                            <div style={{
                                color: '#999',
                                fontSize: '14px'
                            }}>选择男性角色</div>
                        </div>

                        {/* 女性角色 */}
                        <div
                            onClick={() => handleGenderSelect('female')}
                            style={{
                                background: 'rgba(201, 165, 92, 0.1)',
                                border: '3px solid rgba(201, 165, 92, 0.3)',
                                borderRadius: '15px',
                                padding: '30px 40px',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                flex: 1,
                                maxWidth: '200px'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(201, 165, 92, 0.2)'
                                e.currentTarget.style.borderColor = '#c9a55c'
                                e.currentTarget.style.transform = 'translateY(-5px)'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(201, 165, 92, 0.1)'
                                e.currentTarget.style.borderColor = 'rgba(201, 165, 92, 0.3)'
                                e.currentTarget.style.transform = 'translateY(0)'
                            }}
                        >
                            <div style={{
                                fontSize: '60px',
                                marginBottom: '15px'
                            }}>👩</div>
                            <div style={{
                                color: '#c9a55c',
                                fontSize: '20px',
                                fontWeight: 'bold',
                                marginBottom: '5px'
                            }}>女性角色</div>
                            <div style={{
                                color: '#999',
                                fontSize: '14px'
                            }}>选择女性角色</div>
                        </div>
                    </div>

                    <div style={{
                        color: '#666',
                        fontSize: '12px',
                        marginTop: '20px'
                    }}>
                        💡 提示：选择后即可进入博物馆开始探索
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="heritage-container">
            {/* 左侧：装备时间线 */}
            <div 
                className="heritage-sidebar"
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="sidebar-header">
                    <h2>星火传承</h2>
                    <p className="sidebar-subtitle">人民兵工近百年发展历程</p>
                </div>
                
                <EquipmentViewer />
            </div>

            {/* 右侧：3D博物馆 */}
            <div className="heritage-viewer" style={{ position: 'relative' }}>
                {/* 博物馆标题 */}
                <div className="museum-title">
                    <span className="museum-icon">🏛️</span>
                    <span>兵工博物馆</span>
                    <span className="museum-hint">WASD移动 · 鼠标转向 · 空格跳跃</span>
                </div>

                {/* 准星 */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10,
                    pointerEvents: 'none',
                }}>
                    <div style={{
                        width: '6px',
                        height: '6px',
                        backgroundColor: '#c9a55c',
                        borderRadius: '50%',
                        boxShadow: '0 0 8px rgba(201, 165, 92, 0.8), 0 0 16px rgba(201, 165, 92, 0.4)',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                    }} />
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                    }}>
                        <div style={{ 
                            position: 'absolute', 
                            width: '16px', 
                            height: '1px', 
                            background: 'linear-gradient(90deg, transparent, rgba(201, 165, 92, 0.8), transparent)',
                            left: '-8px',
                            top: '0',
                        }} />
                        <div style={{ 
                            position: 'absolute', 
                            width: '1px', 
                            height: '16px', 
                            background: 'linear-gradient(180deg, transparent, rgba(201, 165, 92, 0.8), transparent)',
                            left: '0',
                            top: '-8px',
                        }} />
                    </div>
                </div>

                <Canvas 
                    shadows={false}
                    dpr={[1, 1.2]}
                    gl={{ 
                        antialias: false,
                        powerPreference: 'high-performance',
                        stencil: false,
                        depth: true,
                        alpha: false,
                        preserveDrawingBuffer: false,
                    }}
                    frameloop="always"
                    performance={{ min: 0.5, max: 1 }}
                    onCreated={(state) => {
                        // 优化渲染设置
                        state.gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
                        state.gl.shadowMap.enabled = false
                    }}
                >
                    <PerspectiveCamera makeDefault position={[0, 8, -50]} fov={55} near={0.5} far={200} />
                    {/* 米白色背景 */}
                    <color attach="background" args={['#f8f4e8']} />
                    
                    {/* 轻微雾效 */}
                    <fog attach="fog" args={['#f8f4e8', 80, 180]} />

                    {/* 3D博物馆场景 */}
                    <HeritageMuseum playerGender={playerGender || 'male'} />
                </Canvas>
            </div>
        </div>
    )
}

export default StarFireHeritage
