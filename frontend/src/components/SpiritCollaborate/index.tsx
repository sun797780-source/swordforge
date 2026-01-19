import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Grid, Stage, Float, Text, Html, PerspectiveCamera } from '@react-three/drei'
import { ConfigProvider, theme } from 'antd'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import EquipmentInteraction from './EquipmentInteraction'
import {
    TeamOutlined,
    CodeSandboxOutlined,
    CommentOutlined,
    ShareAltOutlined,
    SettingOutlined,
    EditOutlined,
    ScissorOutlined,
    HistoryOutlined,
    RobotOutlined,
    CloudSyncOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
    CheckCircleOutlined,
    WarningOutlined,
    FileTextOutlined,
    BranchesOutlined,
    SaveOutlined,
    ReloadOutlined,
    SyncOutlined,
    UploadOutlined,
    DownloadOutlined,
    PlayCircleOutlined
} from '@ant-design/icons'
import {
    projectApi,
    annotationApi,
    disassemblyApi,
    versionApi,
    gjbApi,
    syncApi,
    monitoringApi,
    collaborateSocket,
    type Project,
    type Annotation as ApiAnnotation,
    type Version,
    type GJBRule,
    type GJBCheckResult,
    type GJBCheckSummary,
    type SyncRecord
} from '../../services/collaborateApi'
import {
    Layout,
    Menu,
    Card,
    Badge,
    Tooltip,
    Button,
    Drawer,
    Input,
    List,
    Tag,
    Timeline,
    Modal,
    Form,
    Select,
    Switch,
    Progress,
    Tabs,
    Avatar,
    Space,
    Divider,
    message,
    Popover,
    Dropdown
} from 'antd'
import './SpiritCollaborate.css'
import * as THREE from 'three'
import { Box, Cylinder, RoundedBox, Torus, Sphere, Cone, Octahedron } from '@react-three/drei'
import { Type99Tank, Rainbow5Drone } from '../StarFireHeritage/models/EquipmentModels'

const { Sider, Content } = Layout
const { TextArea } = Input
const { Option } = Select

// 可拆解的部件接口
interface PartProps {
    name: string
    position: [number, number, number]
    color: string
    visible: boolean
    selected: boolean
    onSelect: () => void
    modelType: 'tank' | 'drone' | 'armor' | 'exoskeleton'
}

// 动力核心部件
function PowerCore({ position, visible, selected, onSelect }: Omit<PartProps, 'name' | 'color' | 'modelType'>) {
    const groupRef = useRef<THREE.Group>(null)
    const mainMeshRef = useRef<THREE.Mesh>(null)
    const [hovered, setHovered] = useState(false)

    useFrame((state) => {
        if (groupRef.current && selected) {
            groupRef.current.rotation.y += 0.01
        }
    })

    if (!visible) return null

    return (
        <group 
            ref={groupRef} 
            position={position}
        >
            <Cylinder 
                ref={mainMeshRef}
                args={[0.6, 0.6, 1.2, 32]} 
                position={[0, 0.6, 0]}
                onPointerOver={(e) => {
                    e.stopPropagation()
                    setHovered(true)
                    document.body.style.cursor = 'pointer'
                }}
                onPointerOut={(e) => {
                    e.stopPropagation()
                    setHovered(false)
                    document.body.style.cursor = 'auto'
                }}
                onClick={(e) => {
                    e.stopPropagation()
                    onSelect()
                }}
            >
                    <meshStandardMaterial
                    color={selected ? '#c9a55c' : '#3d4a3d'}
                    emissive={selected ? '#c9a55c' : hovered ? '#4a5a4a' : '#000'}
                    emissiveIntensity={selected ? 0.5 : hovered ? 0.2 : 0}
                    metalness={0.9}
                        roughness={0.2}
                    />
            </Cylinder>
            <Cylinder args={[0.5, 0.5, 1.0, 32]} position={[0, 0.6, 0]}>
                    <meshStandardMaterial
                    color="#2a3a2a"
                    metalness={0.95}
                    roughness={0.1}
                        transparent
                    opacity={0.6}
                />
            </Cylinder>
            {Array.from({ length: 8 }).map((_, i) => (
                <Cylinder 
                    key={i} 
                    args={[0.05, 0.05, 1.2, 12]} 
                    position={[
                        Math.cos(i * Math.PI / 4) * 0.55,
                        0.6,
                        Math.sin(i * Math.PI / 4) * 0.55
                    ]}
                >
                    <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
                </Cylinder>
            ))}
            {selected && (
                <Text position={[0, 1.8, 0]} fontSize={0.3} color="#c9a55c" anchorX="center">
                    动力核心
                </Text>
            )}
        </group>
    )
}

// 冷却系统部件
function CoolingSystem({ position, visible, selected, onSelect }: Omit<PartProps, 'name' | 'color' | 'modelType'>) {
    const groupRef = useRef<THREE.Group>(null)
    const mainMeshRef = useRef<THREE.Mesh>(null)
    const [hovered, setHovered] = useState(false)

    if (!visible) return null

    return (
        <group 
            ref={groupRef} 
            position={position}
        >
            <Box 
                ref={mainMeshRef}
                args={[1.0, 0.8, 0.6]} 
                position={[0, 0.4, 0]}
                onPointerOver={(e) => {
                    e.stopPropagation()
                    setHovered(true)
                    document.body.style.cursor = 'pointer'
                }}
                onPointerOut={(e) => {
                    e.stopPropagation()
                    setHovered(false)
                    document.body.style.cursor = 'auto'
                }}
                onClick={(e) => {
                    e.stopPropagation()
                    onSelect()
                }}
            >
                <meshStandardMaterial
                    color={selected ? '#52c41a' : '#2d4a2d'}
                    emissive={selected ? '#52c41a' : hovered ? '#3a5a3a' : '#000'}
                    emissiveIntensity={selected ? 0.4 : hovered ? 0.15 : 0}
                        metalness={0.8}
                    roughness={0.3}
                />
            </Box>
            {Array.from({ length: 12 }).map((_, i) => (
                <Cylinder 
                    key={i} 
                    args={[0.03, 0.03, 0.6, 8]} 
                    position={[
                        -0.4 + (i % 4) * 0.27,
                        0.4,
                        -0.25 + Math.floor(i / 4) * 0.17
                    ]}
                >
                    <meshStandardMaterial color="#1a2a1a" metalness={0.7} roughness={0.4} />
                </Cylinder>
            ))}
            {selected && (
                <Text position={[0, 1.2, 0]} fontSize={0.25} color="#52c41a" anchorX="center">
                    冷却系统
                </Text>
            )}
        </group>
    )
}

// 传动装置部件
function Transmission({ position, visible, selected, onSelect }: Omit<PartProps, 'name' | 'color' | 'modelType'>) {
    const groupRef = useRef<THREE.Group>(null)
    const mainMeshRef = useRef<THREE.Mesh>(null)
    const [hovered, setHovered] = useState(false)

    if (!visible) return null

    return (
        <group 
            ref={groupRef} 
            position={position}
        >
            <RoundedBox 
                ref={mainMeshRef}
                args={[0.8, 0.6, 1.0]} 
                radius={0.1} 
                position={[0, 0.3, 0]}
                onPointerOver={(e) => {
                    e.stopPropagation()
                    setHovered(true)
                    document.body.style.cursor = 'pointer'
                }}
                onPointerOut={(e) => {
                    e.stopPropagation()
                    setHovered(false)
                    document.body.style.cursor = 'auto'
                }}
                onClick={(e) => {
                    e.stopPropagation()
                    onSelect()
                }}
            >
                <meshStandardMaterial
                    color={selected ? '#1890ff' : '#2d3a4a'}
                    emissive={selected ? '#1890ff' : hovered ? '#3a4a5a' : '#000'}
                    emissiveIntensity={selected ? 0.4 : hovered ? 0.15 : 0}
                    metalness={0.85}
                    roughness={0.25}
                />
            </RoundedBox>
            <Cylinder args={[0.3, 0.3, 0.6, 16]} position={[0, 0.3, 0]}>
                <meshStandardMaterial color="#1a2a3a" metalness={0.9} roughness={0.2} />
            </Cylinder>
            {Array.from({ length: 6 }).map((_, i) => (
                <Box 
                    key={i} 
                    args={[0.05, 0.3, 0.05]} 
                    position={[
                        Math.cos(i * Math.PI / 3) * 0.35,
                        0.3,
                        Math.sin(i * Math.PI / 3) * 0.35
                    ]}
                >
                    <meshStandardMaterial color="#1a1a2a" metalness={0.8} roughness={0.3} />
                </Box>
            ))}
            {selected && (
                <Text position={[0, 1.0, 0]} fontSize={0.25} color="#1890ff" anchorX="center">
                    传动装置
                </Text>
            )}
        </group>
    )
}

// 控制模块部件
function ControlModule({ position, visible, selected, onSelect }: Omit<PartProps, 'name' | 'color' | 'modelType'>) {
    const groupRef = useRef<THREE.Group>(null)
    const mainMeshRef = useRef<THREE.Mesh>(null)
    const [hovered, setHovered] = useState(false)

    if (!visible) return null

    return (
        <group 
            ref={groupRef} 
            position={position}
        >
            <Box 
                ref={mainMeshRef}
                args={[0.6, 0.5, 0.6]} 
                position={[0, 0.25, 0]}
                onPointerOver={(e) => {
                    e.stopPropagation()
                    setHovered(true)
                    document.body.style.cursor = 'pointer'
                }}
                onPointerOut={(e) => {
                    e.stopPropagation()
                    setHovered(false)
                    document.body.style.cursor = 'auto'
                }}
                onClick={(e) => {
                    e.stopPropagation()
                    onSelect()
                }}
            >
                <meshStandardMaterial
                    color={selected ? '#ff4d4f' : '#4a2d2d'}
                    emissive={selected ? '#ff4d4f' : hovered ? '#5a3a3a' : '#000'}
                    emissiveIntensity={selected ? 0.5 : hovered ? 0.2 : 0}
                    metalness={0.75}
                    roughness={0.3}
                />
            </Box>
            {Array.from({ length: 4 }).map((_, i) => (
                <Box 
                    key={i} 
                    args={[0.08, 0.08, 0.08]} 
                    position={[
                        -0.2 + (i % 2) * 0.4,
                        0.5,
                        -0.2 + Math.floor(i / 2) * 0.4
                    ]}
                >
                    <meshStandardMaterial color="#2a1a1a" emissive="#ff4d4f" emissiveIntensity={0.3} metalness={0.8} />
                </Box>
            ))}
            {selected && (
                <Text position={[0, 0.9, 0]} fontSize={0.25} color="#ff4d4f" anchorX="center">
                    控制模块
                </Text>
            )}
        </group>
    )
}

// T-99 动力系统模型 - 超精细动力系统建模
function TankPowerSystem({ position, visible, selected, onSelect }: Omit<PartProps, 'name' | 'color' | 'modelType'>) {
    const groupRef = useRef<THREE.Group>(null)
    const engineRef = useRef<THREE.Group>(null)
    const [hovered, setHovered] = useState(false)

    useFrame((state) => {
        if (groupRef.current && selected) {
            groupRef.current.rotation.y += 0.005
        }
        if (engineRef.current) {
            engineRef.current.rotation.z += 0.02
        }
    })

    if (!visible) return null

    return (
        <group 
            ref={groupRef} 
            position={[position[0], position[1], position[2]]}
            scale={[1.0, 1.0, 1.0]}
            onPointerOver={(e) => {
                e.stopPropagation()
                setHovered(true)
                document.body.style.cursor = 'pointer'
            }}
            onPointerOut={(e) => {
                e.stopPropagation()
                setHovered(false)
                document.body.style.cursor = 'auto'
            }}
            onClick={(e) => {
                e.stopPropagation()
                onSelect()
            }}
        >
            {/* 使用真实的99式坦克模型 - 增强版 */}
            <Type99Tank position={[0, 0, 0]} rotation={[0, 0, 0]} />
            
            {/* 增强光照效果 */}
            <pointLight position={[2, 2, 2]} intensity={0.5} color="#c9a55c" />
            <pointLight position={[-2, 1, -2]} intensity={0.3} color="#b87333" />
            
            {/* 动力系统细节展示 - 超精细发动机舱 */}
            <group position={[0, 0.3, -0.8]}>
                {/* 发动机舱盖 - 多层结构 */}
                <RoundedBox args={[1.9, 0.45, 1.3]} radius={0.06} position={[0, 0.225, 0]}>
                    <meshStandardMaterial
                        color={selected ? '#52c41a' : '#2a3a2a'}
                        emissive={selected ? '#52c41a' : hovered ? '#3a5a3a' : '#000'}
                        emissiveIntensity={selected ? 0.3 : hovered ? 0.1 : 0}
                        metalness={0.85}
                        roughness={0.25}
                    />
                </RoundedBox>
                
                {/* 舱盖边缘装饰 */}
                <Box args={[1.85, 0.05, 1.25]} position={[0, 0.45, 0]}>
                    <meshStandardMaterial color="#1a2a1a" metalness={0.9} roughness={0.2} />
                </Box>
                
                {/* 散热格栅 - 双层设计 */}
                {Array.from({ length: 10 }).map((_, i) => (
                    <group key={i} position={[-0.9 + (i * 0.2), 0.225, 0]}>
                        <Box args={[0.04, 0.35, 1.2]} position={[0, 0, 0]}>
                            <meshStandardMaterial color="#0a0a0a" metalness={0.95} roughness={0.15} />
                        </Box>
                        <Box args={[0.06, 0.02, 1.2]} position={[0, 0.15, 0]}>
                            <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
                        </Box>
                        <Box args={[0.06, 0.02, 1.2]} position={[0, -0.15, 0]}>
                            <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
                        </Box>
                    </group>
                ))}
                
                {/* 发动机主体 - V12柴油机结构 - 超精细版 */}
                <group ref={engineRef} position={[0, 0.225, 0]}>
                    {/* 发动机缸体 - 铸铁材质 */}
                    <RoundedBox args={[0.75, 0.55, 0.85]} radius={0.06} position={[0, 0, 0]}>
                        <meshStandardMaterial color="#0a0a0a" metalness={0.96} roughness={0.08} />
                    </RoundedBox>
                    
                    {/* 缸体表面细节 */}
                    {Array.from({ length: 8 }).map((_, i) => (
                        <Box key={i} args={[0.7, 0.02, 0.8]} position={[0, -0.25 + (i * 0.07), 0]}>
                            <meshStandardMaterial color="#1a1a1a" metalness={0.94} roughness={0.1} />
                        </Box>
                    ))}
                    
                    {/* 气缸盖 - 12缸V型排列 */}
                    {Array.from({ length: 12 }).map((_, i) => {
                        const row = Math.floor(i / 6)
                        const col = i % 6
                        const x = -0.3 + (col * 0.12)
                        const z = -0.35 + (row * 0.35)
                        const y = 0.3 + (row * 0.05)
                        return (
                            <group key={i} position={[x, y, z]}>
                                <Cylinder args={[0.09, 0.09, 0.18, 18]} rotation={[0, 0, 0]}>
                                    <meshStandardMaterial color="#1a1a1a" metalness={0.92} roughness={0.1} />
                                </Cylinder>
                                <Cylinder args={[0.07, 0.07, 0.06, 14]} position={[0, 0.12, 0]}>
                                    <meshStandardMaterial color="#2a2a2a" metalness={0.96} roughness={0.06} />
                                </Cylinder>
                                {/* 火花塞 */}
                                <Cylinder args={[0.015, 0.015, 0.08, 8]} position={[0, 0.15, 0]}>
                                    <meshStandardMaterial color="#3a3a3a" metalness={0.95} roughness={0.08} />
                                </Cylinder>
                            </group>
                        )
                    })}
                    
                    {/* 曲轴箱 - 强化结构 */}
                    <RoundedBox args={[0.7, 0.25, 0.8]} radius={0.04} position={[0, -0.3, 0]}>
                        <meshStandardMaterial color="#0a0a0a" metalness={0.96} roughness={0.08} />
                    </RoundedBox>
                    
                    {/* 油底壳 */}
                    <RoundedBox args={[0.65, 0.15, 0.75]} radius={0.05} position={[0, -0.425, 0]}>
                        <meshStandardMaterial color="#1a1a1a" metalness={0.94} roughness={0.12} />
                    </RoundedBox>
                    
                    {/* 进气管 - 双进气道 */}
                    {[-0.45, 0.45].map((x, i) => (
                        <group key={i} position={[x, 0.15, 0]}>
                            <Cylinder args={[0.06, 0.06, 0.45, 14]} rotation={[0, 0, Math.PI / 2]}>
                                <meshStandardMaterial color="#1a1a1a" metalness={0.92} roughness={0.18} />
                            </Cylinder>
                            {/* 进气歧管 */}
                            <Cylinder args={[0.08, 0.06, 0.15, 14]} rotation={[0, 0, Math.PI / 2]} position={[-0.2, 0, 0]}>
                                <meshStandardMaterial color="#2a2a2a" metalness={0.9} roughness={0.2} />
                            </Cylinder>
                        </group>
                    ))}
                    
                    {/* 凸轮轴盖 */}
                    <Box args={[0.7, 0.08, 0.8]} position={[0, 0.35, 0]}>
                        <meshStandardMaterial color="#1a1a1a" metalness={0.93} roughness={0.1} />
                    </Box>
                    
                    {/* 发动机标识 */}
                    <Box args={[0.2, 0.05, 0.1]} position={[0, 0.4, 0.4]}>
                        <meshStandardMaterial color="#ffff00" metalness={0.1} roughness={0.5} />
                    </Box>
                </group>
                
                {/* 涡轮增压器 */}
                <group position={[0.5, 0.225, 0.3]}>
                    <Cylinder args={[0.1, 0.1, 0.2, 16]} rotation={[0, 0, Math.PI / 2]}>
                        <meshStandardMaterial color="#1a1a1a" metalness={0.95} roughness={0.1} />
                    </Cylinder>
                    <Torus args={[0.12, 0.03, 16, 32]} rotation={[0, 0, Math.PI / 2]}>
                        <meshStandardMaterial color="#2a2a2a" metalness={0.9} roughness={0.15} />
                    </Torus>
                </group>
                
                {/* 排气管系统 - 双排气管 */}
                {[-0.15, 0.15].map((z, i) => (
                    <group key={i} position={[0.95, 0.225, z]}>
                        <Cylinder args={[0.1, 0.1, 0.6, 12]} rotation={[0, 0, Math.PI / 2]}>
                            <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.25} />
                        </Cylinder>
                        <Cylinder args={[0.12, 0.1, 0.15, 12]} rotation={[0, 0, Math.PI / 2]} position={[0.3, 0, 0]}>
                            <meshStandardMaterial color="#1a1a1a" metalness={0.85} roughness={0.3} />
                        </Cylinder>
                    </group>
                ))}
                
                {/* 冷却液管路 */}
                {Array.from({ length: 4 }).map((_, i) => (
                    <Cylinder key={i} args={[0.02, 0.02, 0.3, 8]} rotation={[0, 0, Math.PI / 2]} position={[-0.6 + (i * 0.4), 0.4, 0]}>
                        <meshStandardMaterial color="#00aaff" metalness={0.7} roughness={0.3} />
                    </Cylinder>
                ))}
                
                {/* 燃油管路 */}
                {Array.from({ length: 3 }).map((_, i) => (
                    <Cylinder key={i} args={[0.015, 0.015, 0.25, 8]} rotation={[0, 0, Math.PI / 2]} position={[-0.4 + (i * 0.4), 0.35, 0]}>
                        <meshStandardMaterial color="#ffaa00" metalness={0.8} roughness={0.2} />
                    </Cylinder>
                ))}
            </group>
            
            {selected && (
                <Text position={[0, 3, 0]} fontSize={0.4} color="#c9a55c" anchorX="center">
                    T-99 动力系统
                </Text>
            )}
        </group>
    )
}

// 无人机模型 - 超精细无人机集群建模
function DroneModel({ position, visible, selected, onSelect }: Omit<PartProps, 'name' | 'color' | 'modelType'>) {
    const groupRef = useRef<THREE.Group>(null)
    const propRefs = useRef<THREE.Group[]>([])
    const [hovered, setHovered] = useState(false)

    useFrame((state) => {
        if (groupRef.current && selected) {
            groupRef.current.rotation.y += 0.01
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1
        }
        // 螺旋桨旋转
        propRefs.current.forEach((prop) => {
            if (prop) prop.rotation.z += 0.3
        })
    })

    if (!visible) return null

    return (
        <group 
            ref={groupRef} 
            position={[position[0], position[1], position[2]]}
            scale={[1.0, 1.0, 1.0]}
            onPointerOver={(e) => {
                e.stopPropagation()
                setHovered(true)
                document.body.style.cursor = 'pointer'
            }}
            onPointerOut={(e) => {
                e.stopPropagation()
                setHovered(false)
                document.body.style.cursor = 'auto'
            }}
            onClick={(e) => {
                e.stopPropagation()
                onSelect()
            }}
        >
            {/* 使用真实的彩虹-5无人机模型 - 增强版 */}
            <Rainbow5Drone position={[0, 0, 0]} rotation={[0, 0, 0]} />
            
            {/* 增强光照效果 */}
            <pointLight position={[1, 1, 1]} intensity={0.4} color="#1890ff" />
            <pointLight position={[-1, 0.5, -1]} intensity={0.2} color="#52c41a" />
            
            {/* 增强细节 - 超精细传感器和天线系统 */}
            <group position={[0, 0.4, -1.2]}>
                {/* 雷达罩 - 大型合成孔径雷达 */}
                <group position={[-1.35, 0, 0]}>
                    <Sphere args={[0.18, 20, 20]}>
                        <meshStandardMaterial color="#1a1a1a" metalness={0.1} roughness={0.05} />
                    </Sphere>
                    {/* 雷达内部结构 */}
                    <Sphere args={[0.15, 16, 16]}>
                        <meshStandardMaterial color="#0a0a0a" metalness={0.2} roughness={0.1} />
                    </Sphere>
                    {/* 雷达支架 */}
                    <Cylinder args={[0.04, 0.04, 0.15, 12]} position={[0, -0.2, 0]}>
                        <meshStandardMaterial color="#2a2a2a" metalness={0.9} roughness={0.2} />
                    </Cylinder>
                </group>
                
                {/* 光电转塔 - 多光谱传感器 */}
                <group position={[-1.35, 0.15, 0]}>
                    <RoundedBox args={[0.15, 0.12, 0.12]} radius={0.02}>
                        <meshStandardMaterial color="#0a0a0a" metalness={0.95} roughness={0.08} />
                    </RoundedBox>
                    {/* 镜头 */}
                    <Cylinder args={[0.06, 0.06, 0.03, 16]} position={[0, 0, 0.08]}>
                        <meshStandardMaterial color="#000000" metalness={0.1} roughness={0.05} />
                    </Cylinder>
                    {/* 红外传感器 */}
                    <Cylinder args={[0.04, 0.04, 0.02, 12]} position={[0.05, 0, 0.08]}>
                        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.3} />
                    </Cylinder>
                </group>
                
                {/* 通信天线阵列 */}
                <group position={[0, 0.35, 0]}>
                    <Cylinder args={[0.025, 0.025, 0.4, 8]} position={[0, 0, 0]}>
                        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
                    </Cylinder>
                    {/* 天线顶部 */}
                    <Sphere args={[0.03, 8, 8]} position={[0, 0.2, 0]}>
                        <meshStandardMaterial color="#2a2a2a" metalness={0.9} roughness={0.15} />
                    </Sphere>
                    {/* 侧向天线 */}
                    {[-0.05, 0.05].map((x, i) => (
                        <Cylinder key={i} args={[0.015, 0.015, 0.15, 8]} rotation={[0, 0, Math.PI / 2]} position={[x, 0.1, 0]}>
                            <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
                        </Cylinder>
                    ))}
                </group>
                
                {/* GPS/北斗导航天线 */}
                <Sphere args={[0.04, 12, 12]} position={[0.5, 0.2, 0]}>
                    <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
                </Sphere>
            </group>
            
            {/* 挂载武器系统 - 精确制导武器 - 超精细版 */}
            {[-1.0, -0.5, 0, 0.5, 1.0].map((x, i) => (
                <group key={i} position={[x, 0.05, 0]}>
                    {/* 挂载点 - 强化结构 */}
                    <Cylinder args={[0.12, 0.12, 0.25, 14]} rotation={[Math.PI / 2, 0, 0]}>
                        <meshStandardMaterial color="#1a1a1a" metalness={0.88} roughness={0.22} />
                    </Cylinder>
                    {/* 挂载连接器 - 多级连接 */}
                    <Cylinder args={[0.09, 0.09, 0.12, 12]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.18]}>
                        <meshStandardMaterial color="#2a2a2a" metalness={0.92} roughness={0.18} />
                    </Cylinder>
                    <Cylinder args={[0.07, 0.07, 0.08, 10]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.25]}>
                        <meshStandardMaterial color="#3a3a3a" metalness={0.9} roughness={0.2} />
                    </Cylinder>
                    {/* 导弹/炸弹 - 精确制导武器 */}
                    <group position={[0, 0, 0.4]}>
                        <Cylinder args={[0.055, 0.055, 0.6, 14]} rotation={[0, 0, Math.PI / 2]}>
                            <meshStandardMaterial color="#2a2a2a" metalness={0.82} roughness={0.28} />
                        </Cylinder>
                        {/* 弹体标识 */}
                        <Box args={[0.5, 0.02, 0.05]} position={[0, 0, 0]}>
                            <meshStandardMaterial color="#ffff00" metalness={0.1} roughness={0.6} />
                        </Box>
                        {/* 弹头 - 精确制导头 */}
                        <group position={[0.3, 0, 0]}>
                            <Cone args={[0.055, 0.18, 10]} rotation={[0, 0, Math.PI / 2]}>
                                <meshStandardMaterial color="#1a1a1a" metalness={0.92} roughness={0.18} />
                            </Cone>
                            {/* 导引头 */}
                            <Sphere args={[0.04, 12, 12]} position={[0.1, 0, 0]}>
                                <meshStandardMaterial color="#0a0a0a" metalness={0.1} roughness={0.05} />
                            </Sphere>
                        </group>
                        {/* 尾翼 - 十字形布局 */}
                        {[0, 1, 2, 3].map((j) => (
                            <group key={j} rotation={[0, 0, j * Math.PI / 2]} position={[0, 0, -0.25]}>
                                <Box args={[0.1, 0.025, 0.18]}>
                                    <meshStandardMaterial color="#2a2a2a" metalness={0.75} roughness={0.35} />
                                </Box>
                                {/* 尾翼控制面 */}
                                <Box args={[0.08, 0.02, 0.06]} position={[0, 0, 0.06]}>
                                    <meshStandardMaterial color="#3a3a3a" metalness={0.7} roughness={0.4} />
                                </Box>
                            </group>
                        ))}
                        {/* 推进器喷口 */}
                        <Cylinder args={[0.04, 0.05, 0.08, 12]} rotation={[0, 0, Math.PI / 2]} position={[-0.3, 0, 0]}>
                            <meshStandardMaterial color="#0a0a0a" metalness={0.95} roughness={0.15} />
                        </Cylinder>
                    </group>
                </group>
            ))}
            
            {/* 数据链天线 */}
            <group position={[0.3, 0.3, 0.5]}>
                <Cylinder args={[0.02, 0.02, 0.2, 8]} rotation={[0, 0, Math.PI / 2]}>
                    <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
                </Cylinder>
                <Sphere args={[0.025, 8, 8]} position={[0.1, 0, 0]}>
                    <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.5} />
                </Sphere>
            </group>
            
            {selected && (
                <Text position={[0, 2, 0]} fontSize={0.3} color="#1890ff" anchorX="center">
                    无人机集群
                </Text>
            )}
        </group>
    )
}

// 复合装甲模型 - 超精细多层复合装甲结构
function CompositeArmor({ position, visible, selected, onSelect }: Omit<PartProps, 'name' | 'color' | 'modelType'>) {
    const groupRef = useRef<THREE.Group>(null)
    const mainMeshRef = useRef<THREE.Mesh>(null)
    const [hovered, setHovered] = useState(false)

    if (!visible) return null

    return (
        <group 
            ref={groupRef} 
            position={[position[0], position[1], position[2]]}
            scale={[1.5, 1.5, 1.5]}
            onPointerOver={(e) => {
                e.stopPropagation()
                setHovered(true)
                document.body.style.cursor = 'pointer'
            }}
            onPointerOut={(e) => {
                e.stopPropagation()
                setHovered(false)
                document.body.style.cursor = 'auto'
            }}
            onClick={(e) => {
                e.stopPropagation()
                onSelect()
            }}
        >
            {/* 增强光照效果 */}
            <pointLight position={[1, 1, 1]} intensity={0.4} color="#52c41a" />
            <pointLight position={[-1, 0.5, -1]} intensity={0.2} color="#73d13d" />
            
            {/* 外层反应装甲模块 - ERA爆炸反应装甲 */}
            <group position={[0, 0.35, 0]}>
                {Array.from({ length: 16 }).map((_, i) => {
                    const x = -1.4 + (i % 4) * 0.93
                    const z = -0.7 + Math.floor(i / 4) * 0.47
                    return (
                        <group key={i} position={[x, 0, z]}>
                            <RoundedBox 
                                args={[0.28, 0.1, 0.28]} 
                                radius={0.025}
                                position={[0, 0, 0]}
                            >
                                <meshStandardMaterial
                                    color={selected ? '#52c41a' : '#3a4a3a'}
                                    emissive={selected ? '#52c41a' : hovered ? '#4a5a4a' : '#000'}
                                    emissiveIntensity={selected ? 0.3 : hovered ? 0.1 : 0}
                                    metalness={0.9}
                                    roughness={0.12}
                                />
                            </RoundedBox>
                            {/* 反应装甲内部结构 */}
                            <Box args={[0.24, 0.06, 0.24]} position={[0, -0.02, 0]}>
                                <meshStandardMaterial color="#1a1a1a" metalness={0.95} roughness={0.1} />
                            </Box>
                            {/* 固定螺栓 */}
                            {[-0.1, 0.1].map((x, j) => (
                                [-0.1, 0.1].map((z, k) => (
                                    <Cylinder key={`${j}-${k}`} args={[0.02, 0.02, 0.1, 8]} position={[x, 0.05, z]}>
                                        <meshStandardMaterial color="#0a0a0a" metalness={0.95} roughness={0.08} />
                                    </Cylinder>
                                ))
                            ))}
                        </group>
                    )
                })}
            </group>
            
            {/* 主装甲板 - 多层复合结构 - 增强版 */}
            <RoundedBox 
                ref={mainMeshRef}
                args={[3.0, 0.4, 2.2]} 
                radius={0.08}
                position={[0, 0.2, 0]}
            >
                <meshStandardMaterial
                    color={selected ? '#52c41a' : '#2d4a2d'}
                    emissive={selected ? '#52c41a' : hovered ? '#3a5a3a' : '#000'}
                    emissiveIntensity={selected ? 0.4 : hovered ? 0.15 : 0}
                    metalness={0.88}
                    roughness={0.18}
                />
            </RoundedBox>
            
            {/* 装甲板表面纹理 - 真实金属质感 */}
            {Array.from({ length: 20 }).map((_, i) => {
                const x = -1.3 + (i % 5) * 0.65
                const z = -1.0 + Math.floor(i / 5) * 0.5
                return (
                    <Box key={i} args={[0.5, 0.005, 0.4]} position={[x, 0.42, z]}>
                        <meshStandardMaterial 
                            color="#1a2a1a" 
                            metalness={0.9} 
                            roughness={0.15}
                        />
                    </Box>
                )
            })}
            
            {/* 陶瓷复合层 - 多层防护 */}
            {[0.38, 0.32, 0.26, 0.20, 0.14, 0.08, 0.02, -0.04].map((y, i) => (
                <Box key={i} args={[2.95, 0.03, 2.15]} position={[0, y, 0]}>
                    <meshStandardMaterial 
                        color={i % 2 === 0 ? '#1a2a1a' : '#2a3a2a'} 
                        metalness={0.7} 
                        roughness={0.3} 
                    />
                </Box>
            ))}
            
            {/* 金属加强层 - 高密度钢 */}
            {Array.from({ length: 5 }).map((_, i) => (
                <Box 
                    key={i} 
                    args={[2.9, 0.02, 2.1]} 
                    position={[0, 0.2 + (i * 0.04), 0]}
                >
                    <meshStandardMaterial color="#1a1a1a" metalness={0.95} roughness={0.1} />
                </Box>
            ))}
            
            {/* 加强筋 - 真实装甲结构 */}
            {Array.from({ length: 8 }).map((_, i) => (
                <Box 
                    key={i} 
                    args={[0.08, 0.4, 2.2]} 
                    position={[-1.4 + (i * 0.4), 0.2, 0]}
                >
                    <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.15} />
                </Box>
            ))}
            {Array.from({ length: 6 }).map((_, i) => (
                <Box 
                    key={i} 
                    args={[3.0, 0.4, 0.08]} 
                    position={[0, 0.2, -1.06 + (i * 0.4)]}
                >
                    <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.15} />
                </Box>
            ))}
            
            {/* 连接螺栓 - 高强度螺栓 */}
            {Array.from({ length: 24 }).map((_, i) => {
                const x = -1.2 + (i % 6) * 0.48
                const z = -0.9 + Math.floor(i / 6) * 0.45
                return (
                    <Cylinder key={i} args={[0.06, 0.06, 0.4, 12]} position={[x, 0.2, z]}>
                        <meshStandardMaterial color="#0a0a0a" metalness={0.95} roughness={0.1} />
                    </Cylinder>
                )
            })}
            
            {/* 表面纹理细节 - 真实磨损和划痕 */}
            {Array.from({ length: 60 }).map((_, i) => {
                const x = -1.4 + (i % 10) * 0.28
                const z = -1.0 + Math.floor(i / 10) * 0.22
                const rotation = (i * 0.3) % Math.PI
                return (
                    <Box 
                        key={i} 
                        args={[0.08, 0.008, 0.08]} 
                        position={[x, 0.42, z]}
                        rotation={[0, rotation, 0]}
                    >
                        <meshStandardMaterial color="#0a1a0a" metalness={0.7} roughness={0.65} />
                    </Box>
                )
            })}
            
            {/* 防护标识和警告标记 */}
            <group position={[1.2, 0.35, 0.8]}>
                <Box args={[0.35, 0.18, 0.025]}>
                    <meshStandardMaterial color="#ffff00" metalness={0.1} roughness={0.4} />
                </Box>
                <Box args={[0.32, 0.15, 0.03]} position={[0, 0, 0.01]}>
                    <meshStandardMaterial color="#000000" metalness={0.1} roughness={0.5} />
                </Box>
            </group>
            
            {/* 测试标记点 */}
            {Array.from({ length: 8 }).map((_, i) => {
                const x = -1.0 + (i % 4) * 0.67
                const z = -0.8 + Math.floor(i / 4) * 1.6
                return (
                    <Sphere key={i} args={[0.02, 8, 8]} position={[x, 0.43, z]}>
                        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.4} />
                    </Sphere>
                )
            })}
            
            {/* 边缘保护条 */}
            <Box args={[3.1, 0.05, 0.08]} position={[0, 0.45, 1.14]}>
                <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
            </Box>
            <Box args={[3.1, 0.05, 0.08]} position={[0, 0.45, -1.14]}>
                <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
            </Box>
            <Box args={[0.08, 0.05, 2.3]} position={[1.54, 0.45, 0]}>
                <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
            </Box>
            <Box args={[0.08, 0.05, 2.3]} position={[-1.54, 0.45, 0]}>
                <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
            </Box>
            
            {selected && (
                <Text position={[0, 0.8, 0]} fontSize={0.3} color="#52c41a" anchorX="center">
                    复合装甲系统
                </Text>
            )}
        </group>
    )
}

// 外骨骼模型 - 超精细外骨骼装备结构
function ExoskeletonModel({ position, visible, selected, onSelect }: Omit<PartProps, 'name' | 'color' | 'modelType'>) {
    const groupRef = useRef<THREE.Group>(null)
    const mainMeshRef = useRef<THREE.Mesh>(null)
    const [hovered, setHovered] = useState(false)

    useFrame((state) => {
        if (groupRef.current && selected) {
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
        }
    })

    if (!visible) return null

    return (
        <group 
            ref={groupRef} 
            position={[position[0], position[1], position[2]]}
            scale={[1.2, 1.2, 1.2]}
            onPointerOver={(e) => {
                e.stopPropagation()
                setHovered(true)
                document.body.style.cursor = 'pointer'
            }}
            onPointerOut={(e) => {
                e.stopPropagation()
                setHovered(false)
                document.body.style.cursor = 'auto'
            }}
            onClick={(e) => {
                e.stopPropagation()
                onSelect()
            }}
        >
            {/* 增强光照效果 */}
            <pointLight position={[0.5, 1, 0.5]} intensity={0.5} color="#ff4d4f" />
            <pointLight position={[-0.5, 0.5, -0.5]} intensity={0.3} color="#ff7875" />
            
            {/* 背部主框架 - 碳纤维复合材料 - 增强版 */}
            <RoundedBox 
                ref={mainMeshRef}
                args={[0.6, 1.6, 0.4]} 
                radius={0.06}
                position={[0, 0.8, 0]}
            >
                <meshStandardMaterial
                    color={selected ? '#ff4d4f' : '#4a2d2d'}
                    emissive={selected ? '#ff4d4f' : hovered ? '#5a3a3a' : '#000'}
                    emissiveIntensity={selected ? 0.5 : hovered ? 0.2 : 0}
                    metalness={0.88}
                    roughness={0.18}
                />
            </RoundedBox>
            
            {/* 碳纤维纹理 - 真实编织效果 */}
            {Array.from({ length: 12 }).map((_, i) => {
                const y = 0.1 + (i * 0.13)
                const pattern = i % 2 === 0 ? 'horizontal' : 'vertical'
                return pattern === 'horizontal' ? (
                    <Box key={i} args={[0.55, 0.01, 0.35]} position={[0, y, 0]}>
                        <meshStandardMaterial color="#3a1d1d" metalness={0.9} roughness={0.12} />
                    </Box>
                ) : (
                    <Box key={i} args={[0.01, 1.5, 0.35]} position={[-0.25 + (i % 3) * 0.25, 0.8, 0]}>
                        <meshStandardMaterial color="#3a1d1d" metalness={0.9} roughness={0.12} />
                    </Box>
                )
            })}
            
            {/* 背部加强筋 - 增强版 */}
            {Array.from({ length: 3 }).map((_, i) => (
                <Box key={i} args={[0.55, 1.55, 0.05]} position={[-0.25 + (i * 0.25), 0.8, 0.2]}>
                    <meshStandardMaterial color="#3a1d1d" metalness={0.92} roughness={0.12} />
                </Box>
            ))}
            
            {/* 框架边缘装饰 */}
            <Box args={[0.62, 0.05, 0.42]} position={[0, 1.625, 0]}>
                <meshStandardMaterial color="#2a0d0d" metalness={0.95} roughness={0.1} />
            </Box>
            <Box args={[0.62, 0.05, 0.42]} position={[0, -0.025, 0]}>
                <meshStandardMaterial color="#2a0d0d" metalness={0.95} roughness={0.1} />
            </Box>
            
            {/* 肩部连接板 - 高强度合金 */}
            <RoundedBox args={[0.9, 0.3, 0.4]} radius={0.05} position={[0, 1.35, 0]}>
                <meshStandardMaterial color="#3a1d1d" metalness={0.9} roughness={0.15} />
            </RoundedBox>
            
            {/* 肩部关节 - 液压驱动关节 */}
            {[-0.4, 0.4].map((x, i) => (
                <group key={i} position={[x, 1.2, 0]}>
                    <Cylinder args={[0.15, 0.15, 0.4, 16]} rotation={[0, 0, Math.PI / 2]}>
                        <meshStandardMaterial color="#2a1a1a" metalness={0.95} roughness={0.1} />
                    </Cylinder>
                    {/* 关节连接器 */}
                    <Cylinder args={[0.12, 0.12, 0.15, 12]} rotation={[0, 0, Math.PI / 2]} position={[0, 0, 0.2]}>
                        <meshStandardMaterial color="#1a0a0a" metalness={0.95} roughness={0.08} />
                    </Cylinder>
                    <Cylinder args={[0.12, 0.12, 0.15, 12]} rotation={[0, 0, Math.PI / 2]} position={[0, 0, -0.2]}>
                        <meshStandardMaterial color="#1a0a0a" metalness={0.95} roughness={0.08} />
                    </Cylinder>
                </group>
            ))}
            
            {/* 上臂支撑 - 左右对称 */}
            {[-0.4, 0.4].map((x, i) => (
                <group key={i} position={[x, 1.0, 0]}>
                    <RoundedBox args={[0.2, 0.5, 0.15]} radius={0.03} position={[0, -0.25, 0]}>
                        <meshStandardMaterial color="#3a2a2a" metalness={0.85} roughness={0.2} />
                    </RoundedBox>
                    {/* 肘关节 */}
                    <Cylinder args={[0.1, 0.1, 0.2, 12]} rotation={[0, 0, Math.PI / 2]} position={[0, -0.5, 0]}>
                        <meshStandardMaterial color="#2a1a1a" metalness={0.95} roughness={0.1} />
                    </Cylinder>
                    {/* 前臂支撑 */}
                    <RoundedBox args={[0.18, 0.4, 0.12]} radius={0.03} position={[0, -0.7, 0]}>
                        <meshStandardMaterial color="#3a2a2a" metalness={0.85} roughness={0.2} />
                    </RoundedBox>
                </group>
            ))}
            
            {/* 腰部支撑框架 */}
            <RoundedBox args={[0.7, 0.3, 0.4]} radius={0.05} position={[0, 0.15, 0]}>
                <meshStandardMaterial color="#3a2a2a" metalness={0.9} roughness={0.15} />
            </RoundedBox>
            
            {/* 髋关节 - 左右对称 */}
            {[-0.3, 0.3].map((x, i) => (
                <group key={i} position={[x, 0, 0]}>
                    <Cylinder args={[0.12, 0.12, 0.3, 16]} rotation={[Math.PI / 2, 0, 0]}>
                        <meshStandardMaterial color="#2a1a1a" metalness={0.95} roughness={0.1} />
                    </Cylinder>
                    {/* 大腿支撑 */}
                    <RoundedBox args={[0.2, 0.6, 0.15]} radius={0.03} position={[0, -0.3, 0]}>
                        <meshStandardMaterial color="#3a2a2a" metalness={0.85} roughness={0.2} />
                    </RoundedBox>
                    {/* 膝关节 */}
                    <Cylinder args={[0.1, 0.1, 0.2, 12]} rotation={[Math.PI / 2, 0, 0]} position={[0, -0.6, 0]}>
                        <meshStandardMaterial color="#2a1a1a" metalness={0.95} roughness={0.1} />
                    </Cylinder>
                    {/* 小腿支撑 */}
                    <RoundedBox args={[0.18, 0.5, 0.12]} radius={0.03} position={[0, -0.85, 0]}>
                        <meshStandardMaterial color="#3a2a2a" metalness={0.85} roughness={0.2} />
                    </RoundedBox>
                </group>
            ))}
            
            {/* 动力系统 - 超精细电池和电机模块 */}
            <group position={[0, 0.5, 0.22]}>
                {/* 主电池组 */}
                <RoundedBox args={[0.45, 0.35, 0.28]} radius={0.03} position={[0, 0, 0]}>
                    <meshStandardMaterial color="#1a0a0a" metalness={0.9} roughness={0.1} />
                </RoundedBox>
                {/* 电池单元 */}
                {Array.from({ length: 6 }).map((_, i) => (
                    <Box key={i} args={[0.12, 0.3, 0.12]} position={[-0.15 + (i % 3) * 0.15, 0, -0.06 + Math.floor(i / 3) * 0.12]}>
                        <meshStandardMaterial color="#0a0a0a" metalness={0.95} roughness={0.08} />
                    </Box>
                ))}
                {/* 电池接口 */}
                <Box args={[0.1, 0.05, 0.15]} position={[0, 0.2, 0]}>
                    <meshStandardMaterial color="#2a1a1a" metalness={0.9} roughness={0.15} />
                </Box>
                
                {/* 电机模块 */}
                <group position={[0, -0.25, 0]}>
                    <Cylinder args={[0.12, 0.12, 0.2, 16]} rotation={[0, 0, Math.PI / 2]}>
                        <meshStandardMaterial color="#1a0a0a" metalness={0.95} roughness={0.1} />
                    </Cylinder>
                    {/* 电机散热片 */}
                    {Array.from({ length: 8 }).map((_, i) => (
                        <Box key={i} args={[0.15, 0.02, 0.2]} rotation={[0, 0, i * Math.PI / 4]} position={[0, 0, 0]}>
                            <meshStandardMaterial color="#2a1a1a" metalness={0.9} roughness={0.15} />
                        </Box>
                    ))}
                </group>
                
                {/* 冷却系统 - 高效散热器 */}
                {Array.from({ length: 8 }).map((_, i) => (
                    <group key={i} position={[-0.2 + (i * 0.057), 0.5, 0]}>
                        <Box args={[0.04, 0.3, 0.22]}>
                            <meshStandardMaterial color="#2a1a1a" metalness={0.85} roughness={0.18} />
                        </Box>
                        {/* 散热片细节 */}
                        {Array.from({ length: 5 }).map((_, j) => (
                            <Box key={j} args={[0.04, 0.02, 0.2]} position={[0, -0.12 + (j * 0.06), 0]}>
                                <meshStandardMaterial color="#3a2a2a" metalness={0.8} roughness={0.2} />
                            </Box>
                        ))}
                    </group>
                ))}
            </group>
            
            {/* 液压管路系统 - 完整管路网络 */}
            {Array.from({ length: 10 }).map((_, i) => {
                const y = 0.1 + (i * 0.18)
                return (
                    <group key={i} position={[0.32, y, 0]}>
                        {/* 主液压管 */}
                        <Cylinder args={[0.025, 0.025, 0.65, 10]} rotation={[0, 0, Math.PI / 2]}>
                            <meshStandardMaterial color="#ff0000" metalness={0.75} roughness={0.25} />
                        </Cylinder>
                        {/* 管路保护套 */}
                        <Cylinder args={[0.03, 0.03, 0.65, 10]} rotation={[0, 0, Math.PI / 2]}>
                            <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.3} />
                        </Cylinder>
                        {/* 连接接头 */}
                        <Cylinder args={[0.035, 0.035, 0.05, 12]} rotation={[0, 0, Math.PI / 2]} position={[0, 0, 0.3]}>
                            <meshStandardMaterial color="#2a1a1a" metalness={0.9} roughness={0.2} />
                        </Cylinder>
                        <Cylinder args={[0.035, 0.035, 0.05, 12]} rotation={[0, 0, Math.PI / 2]} position={[0, 0, -0.3]}>
                            <meshStandardMaterial color="#2a1a1a" metalness={0.9} roughness={0.2} />
                        </Cylinder>
                    </group>
                )
            })}
            
            {/* 电控线路 */}
            {Array.from({ length: 6 }).map((_, i) => {
                const y = 0.2 + (i * 0.25)
                return (
                    <Cylinder key={i} args={[0.01, 0.01, 0.5, 6]} rotation={[0, 0, Math.PI / 2]} position={[0.28, y, 0]}>
                        <meshStandardMaterial color="#ffff00" metalness={0.6} roughness={0.4} />
                    </Cylinder>
                )
            })}
            
            {/* 传感器和指示灯 - 增强版 */}
            <group position={[0, 1.4, 0.22]}>
                <Sphere args={[0.06, 12, 12]}>
                    <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={1.0} />
                </Sphere>
                <Sphere args={[0.05, 10, 10]} position={[0, 0, 0]}>
                    <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
                </Sphere>
                {/* 指示灯底座 */}
                <Cylinder args={[0.07, 0.07, 0.02, 12]} position={[0, -0.04, 0]}>
                    <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
                </Cylinder>
            </group>
            {[-0.2, 0.2].map((x, i) => (
                <group key={i} position={[x, 1.3, 0.22]}>
                    <Sphere args={[0.05, 10, 10]}>
                        <meshStandardMaterial color="#ffaa00" emissive="#ffaa00" emissiveIntensity={0.8} />
                    </Sphere>
                    <Sphere args={[0.04, 8, 8]} position={[0, 0, 0]}>
                        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.2} />
                    </Sphere>
                    <Cylinder args={[0.06, 0.06, 0.02, 12]} position={[0, -0.035, 0]}>
                        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
                    </Cylinder>
                </group>
            ))}
            
            {/* 状态显示屏 */}
            <Box args={[0.15, 0.1, 0.02]} position={[0, 1.15, 0.22]}>
                <meshStandardMaterial color="#000000" metalness={0.1} roughness={0.9} />
            </Box>
            <Box args={[0.13, 0.08, 0.025]} position={[0, 1.15, 0.23]}>
                <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.5} />
            </Box>
            
            {/* 连接线和接口 */}
            {Array.from({ length: 4 }).map((_, i) => (
                <Cylinder key={i} args={[0.015, 0.015, 0.3, 8]} rotation={[0, 0, Math.PI / 2]} position={[-0.25 + (i * 0.17), 0.3, 0.22]}>
                    <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.3} />
                </Cylinder>
            ))}
            
            {selected && (
                <Text position={[0, 2, 0]} fontSize={0.3} color="#ff4d4f" anchorX="center">
                    外骨骼系统
                </Text>
            )}
        </group>
    )
}

// 根据项目类型渲染对应的模型
function ModelPart({ name, position, color, visible, selected, onSelect, modelType }: PartProps) {
    const modelComponents: Record<string, React.ComponentType<any>> = {
        'tank': TankPowerSystem,
        'drone': DroneModel,
        'armor': CompositeArmor,
        'exoskeleton': ExoskeletonModel,
    }

    const Component = modelComponents[modelType] || TankPowerSystem

    return <Component position={position} visible={visible} selected={selected} onSelect={onSelect} />
}

// 3D标注组件
interface AnnotationProps {
    position: [number, number, number]
    text: string
    author: string
    onClose: () => void
}

function Annotation3D({ position, text, author, onClose }: AnnotationProps) {
    return (
        <group position={position}>
            <mesh>
                <sphereGeometry args={[0.1, 16, 16]} />
                <meshStandardMaterial color="#ff4d4f" emissive="#ff4d4f" emissiveIntensity={0.5} />
                </mesh>
            <Html position={[0, 0.3, 0]} center>
                <div className="annotation-popup">
                    <div className="annotation-header">
                        <span>{author}</span>
                        <Button type="text" size="small" onClick={onClose}>×</Button>
                    </div>
                    <div className="annotation-content">{text}</div>
                </div>
            </Html>
        </group>
    )
}

// 主3D场景
function Scene3D({
    parts,
    annotations,
    onPartSelect,
    onAddAnnotation,
    mode
}: {
    parts: any[]
    annotations: any[]
    onPartSelect: (id: string) => void
    onAddAnnotation: (pos: [number, number, number]) => void
    mode: 'view' | 'annotate' | 'disassemble'
}) {
    return (
        <>
            <color attach="background" args={['#1a1f2e']} />
            <ambientLight intensity={1.2} />
            <directionalLight position={[15, 15, 10]} intensity={2.5} color="#ffffff" castShadow />
            <directionalLight position={[-15, 10, -10]} intensity={1.5} color="#e8e8e8" />
            <pointLight position={[10, 10, 10]} intensity={2.0} color="#ffffff" />
            <pointLight position={[-10, 10, -10]} intensity={1.5} color="#e0e0e0" />
            <pointLight position={[0, 15, 0]} intensity={1.8} color="#ffffff" />
            <pointLight position={[0, -5, 0]} intensity={0.8} color="#c9a55c" />
            {/* 展示平台 - 大型工业平台 */}
            <group position={[0, 0, 0]}>
                {/* 主平台 - 大型金属平台 */}
                <RoundedBox args={[15, 0.2, 15]} radius={0.3} position={[0, 0.1, 0]}>
                    <meshStandardMaterial 
                        color="#2a3441" 
                        roughness={0.4} 
                        metalness={0.6}
                    />
                </RoundedBox>
                
                {/* 平台表面纹理 - 金属网格 */}
                {Array.from({ length: 8 }).map((_, i) => {
                    const x = -7 + (i * 2)
                    return (
                        <Box key={`grid-x-${i}`} args={[0.02, 0.22, 15]} position={[x, 0.1, 0]}>
                            <meshStandardMaterial color="#1a2330" metalness={0.7} roughness={0.3} />
                        </Box>
                    )
                })}
                {Array.from({ length: 8 }).map((_, i) => {
                    const z = -7 + (i * 2)
                    return (
                        <Box key={`grid-z-${i}`} args={[15, 0.22, 0.02]} position={[0, 0.1, z]}>
                            <meshStandardMaterial color="#1a2330" metalness={0.7} roughness={0.3} />
                        </Box>
                    )
                })}
                
                {/* 平台边缘装饰 - 金色边框 */}
                <Box args={[15.2, 0.03, 0.2]} position={[0, 0.2, 7.6]}>
                    <meshStandardMaterial color="#c9a55c" metalness={0.9} roughness={0.2} />
                </Box>
                <Box args={[15.2, 0.03, 0.2]} position={[0, 0.2, -7.6]}>
                    <meshStandardMaterial color="#c9a55c" metalness={0.9} roughness={0.2} />
                </Box>
                <Box args={[0.2, 0.03, 15.2]} position={[7.6, 0.2, 0]}>
                    <meshStandardMaterial color="#c9a55c" metalness={0.9} roughness={0.2} />
                </Box>
                <Box args={[0.2, 0.03, 15.2]} position={[-7.6, 0.2, 0]}>
                    <meshStandardMaterial color="#c9a55c" metalness={0.9} roughness={0.2} />
                </Box>
                
                {/* 平台支撑柱 - 四角 */}
                {[[-7, -7], [7, -7], [-7, 7], [7, 7]].map(([x, z], i) => (
                    <group key={`pillar-${i}`} position={[x, -1.5, z]}>
                        <Cylinder args={[0.3, 0.3, 3, 16]}>
                            <meshStandardMaterial color="#1a2330" metalness={0.8} roughness={0.3} />
                        </Cylinder>
                        <Cylinder args={[0.35, 0.3, 0.15, 16]} position={[0, 1.5, 0]}>
                            <meshStandardMaterial color="#c9a55c" metalness={0.9} roughness={0.2} />
                        </Cylinder>
                        <Cylinder args={[0.3, 0.35, 0.15, 16]} position={[0, -1.5, 0]}>
                            <meshStandardMaterial color="#c9a55c" metalness={0.9} roughness={0.2} />
                        </Cylinder>
                    </group>
                ))}
            </group>
            
            {/* 背景装饰 - 工业框架结构（缩小并后移） */}
            <group position={[0, 4, -12]}>
                {/* 大型框架结构 */}
                {[-6, 0, 6].map((x, i) => (
                    <group key={`frame-${i}`} position={[x, 0, 0]}>
                        {/* 垂直支柱 */}
                        <Box args={[0.2, 8, 0.2]} position={[-1.5, 4, 0]}>
                            <meshStandardMaterial color="#2a3441" metalness={0.7} roughness={0.4} />
                        </Box>
                        <Box args={[0.2, 8, 0.2]} position={[1.5, 4, 0]}>
                            <meshStandardMaterial color="#2a3441" metalness={0.7} roughness={0.4} />
                        </Box>
                        {/* 横向连接 */}
                        <Box args={[3.2, 0.2, 0.2]} position={[0, 8, 0]}>
                            <meshStandardMaterial color="#2a3441" metalness={0.7} roughness={0.4} />
                        </Box>
                        <Box args={[3.2, 0.2, 0.2]} position={[0, 4, 0]}>
                            <meshStandardMaterial color="#2a3441" metalness={0.7} roughness={0.4} />
                        </Box>
                        <Box args={[3.2, 0.2, 0.2]} position={[0, 0, 0]}>
                            <meshStandardMaterial color="#2a3441" metalness={0.7} roughness={0.4} />
                        </Box>
                        {/* 装饰性发光点 */}
                        {[0, 4, 8].map((y, j) => (
                            <Sphere key={`light-${j}`} args={[0.12, 12, 12]} position={[0, y, 0]}>
                                <meshStandardMaterial 
                                    color="#c9a55c" 
                                    emissive="#c9a55c" 
                                    emissiveIntensity={0.6}
                                />
                            </Sphere>
                        ))}
                    </group>
                ))}
            </group>
            
            {/* 侧边装饰 - 科技感元素（缩小并后移） */}
            <group position={[-10, 2.5, -5]}>
                {/* 数据面板装饰 */}
                <RoundedBox args={[1.5, 2.5, 0.15]} radius={0.08} position={[0, 0, 0]}>
                    <meshStandardMaterial color="#1a2330" metalness={0.6} roughness={0.5} />
                </RoundedBox>
                {Array.from({ length: 5 }).map((_, i) => (
                    <Box key={`panel-${i}`} args={[1.3, 0.12, 0.2]} position={[0, -1 + i * 0.4, 0.08]}>
                        <meshStandardMaterial 
                            color={i % 2 === 0 ? "#c9a55c" : "#4a5d6a"} 
                            emissive={i % 2 === 0 ? "#c9a55c" : "#000"}
                            emissiveIntensity={i % 2 === 0 ? 0.2 : 0}
                        />
                    </Box>
                ))}
            </group>
            
            <group position={[10, 2.5, -5]}>
                <RoundedBox args={[1.5, 2.5, 0.15]} radius={0.08} position={[0, 0, 0]}>
                    <meshStandardMaterial color="#1a2330" metalness={0.6} roughness={0.5} />
                </RoundedBox>
                {Array.from({ length: 5 }).map((_, i) => (
                    <Box key={`panel-r-${i}`} args={[1.3, 0.12, 0.2]} position={[0, -1 + i * 0.4, 0.08]}>
                        <meshStandardMaterial 
                            color={i % 2 === 0 ? "#c9a55c" : "#4a5d6a"} 
                            emissive={i % 2 === 0 ? "#c9a55c" : "#000"}
                            emissiveIntensity={i % 2 === 0 ? 0.2 : 0}
                        />
                    </Box>
                ))}
            </group>
            
            {/* 顶部装饰 - 工业照明（缩小） */}
            {[-5, 0, 5].map((x, i) => (
                <group key={`light-${i}`} position={[x, 7, -6]}>
                    <Cylinder args={[0.2, 0.2, 0.4, 16]} position={[0, 0, 0]}>
                        <meshStandardMaterial color="#2a3441" metalness={0.8} roughness={0.3} />
                    </Cylinder>
                    <Sphere args={[0.2, 16, 16]} position={[0, 0.25, 0]}>
                        <meshStandardMaterial 
                            color="#ffffff" 
                            emissive="#ffffff" 
                            emissiveIntensity={1.2}
                        />
                    </Sphere>
                </group>
            ))}
            
            <Stage environment="city" intensity={1.2} adjustCamera={false}>
                {/* 模型组 - 确保在平台上方，坦克模型底部大约在y=0.3，所以需要提升到y=2.5以上 */}
                <group position={[0, 2.5, 0]}>
                    {parts.filter(p => p.visible).map((part) => (
                        <ModelPart 
                            key={part.id} 
                            {...part} 
                            onSelect={() => onPartSelect(part.id)}
                        />
                    ))}
                </group>
                {annotations.map((ann, idx) => (
                    <Annotation3D key={idx} {...ann} onClose={() => {}} />
                ))}
            </Stage>
            <OrbitControls 
                makeDefault 
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={3}
                maxDistance={30}
                enableDamping={true}
                dampingFactor={0.05}
                target={[0, 2.5, 0]}
            />
            {mode === 'annotate' && (
                <Html position={[0, 3, 0]} center>
                    <div style={{
                        background: 'rgba(201, 165, 92, 0.2)',
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        border: '1px solid #c9a55c',
                        color: '#c9a55c',
                        fontSize: '0.9rem',
                        pointerEvents: 'none'
                    }}>
                        点击模型添加标注
                    </div>
                </Html>
            )}
        </>
    )
}

const EquipmentControl: React.FC = () => {
    const { user, isAuthenticated, loading: authLoading, token } = useAuth()
    const navigate = useNavigate()
    
    // 登录检查
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate('/admin')
        }
    }, [isAuthenticated, authLoading, navigate])
    
    if (authLoading) {
        return <div style={{ padding: '100px', textAlign: 'center', color: '#fff' }}>加载中...</div>
    }
    
    if (!isAuthenticated || !user) {
        return (
            <div style={{ padding: '100px', textAlign: 'center', color: '#fff' }}>
                <h2>请先登录</h2>
                <p>您需要登录才能使用装备操控功能</p>
                <button onClick={() => navigate('/admin')} style={{ marginTop: '20px', padding: '10px 20px' }}>
                    前往登录
                </button>
            </div>
        )
    }
    
    // 项目状态
    const [activeProject, setActiveProject] = useState(0)
    const [activeTab, setActiveTab] = useState('view')
    
    // 3D场景状态
    const [selectedPart, setSelectedPart] = useState<string | null>(null)
    const [parts, setParts] = useState([
        { id: 'main', name: 'main', position: [0, 0, 0] as [number, number, number], color: '#c9a55c', visible: true, selected: false, modelType: 'tank' as const },
    ])
    
    // 实时监控数据状态 - 完整物理模型系统
    const [monitoringData, setMonitoringData] = useState({
        structuralStress: 65.0,    // 结构应力 (MPa)
        thermalLoad: 42.0,          // 热负荷 (°C)
        collaborationDelay: 15.0,   // 协同延迟 (ms)
        powerOutput: 900.0,          // 功率输出 (kW)
        efficiency: 85.0,           // 系统效率 (%)
        vibration: 2.5,             // 振动幅度 (mm)
        pressure: 1.2,              // 系统压力 (MPa)
        flowRate: 45.0              // 流量 (L/min)
    })
    
    // 历史数据记录（用于趋势分析）
    const [dataHistory, setDataHistory] = useState<{
        structuralStress: number[]
        thermalLoad: number[]
        collaborationDelay: number[]
    }>({
        structuralStress: [],
        thermalLoad: [],
        collaborationDelay: []
    })
    
    // 根据项目类型设置详细物理参数
    const getProjectPhysicsParams = (projectType: string) => {
        const params: Record<string, any> = {
            'tank': {
                // T-99动力系统：高功率柴油发动机系统
                powerBase: 1200,           // 额定功率 (kW)
                powerRange: [800, 1500],   // 功率范围
                loadFactor: 0.75,        // 当前负载系数
                coolingEfficiency: 0.68,   // 冷却系统效率
                networkLatency: 8,         // 基础网络延迟 (ms)
                materialYoungsModulus: 200, // 材料弹性模量 (GPa)
                thermalConductivity: 50,   // 热导率 (W/m·K)
                specificHeat: 0.5,        // 比热容 (kJ/kg·K)
                mass: 5000,                // 系统质量 (kg)
                ambientTemp: 25,           // 环境温度 (°C)
                maxStress: 450,            // 最大允许应力 (MPa)
                maxTemp: 120,              // 最大允许温度 (°C)
                stressMultiplier: 0.037,   // 应力-功率系数
                thermalCoeff: 0.031,      // 热-功率系数
                efficiencyBase: 88,        // 基础效率 (%)
                vibrationBase: 1.8,        // 基础振动 (mm)
                pressureBase: 1.5          // 基础压力 (MPa)
            },
            'drone': {
                // 无人机集群：多旋翼动力系统
                powerBase: 45,
                powerRange: [20, 65],
                loadFactor: 0.85,
                coolingEfficiency: 0.78,
                networkLatency: 15,
                materialYoungsModulus: 70,
                thermalConductivity: 200,
                specificHeat: 0.9,
                mass: 15,
                ambientTemp: 20,
                maxStress: 280,
                maxTemp: 80,
                stressMultiplier: 6.2,
                thermalCoeff: 0.78,
                efficiencyBase: 82,
                vibrationBase: 0.5,
                pressureBase: 0.1
            },
            'armor': {
                // 复合装甲：静态压力测试
                powerBase: 5,
                powerRange: [0, 10],
                loadFactor: 0.95,
                coolingEfficiency: 0.88,
                networkLatency: 6,
                materialYoungsModulus: 300,
                thermalConductivity: 25,
                specificHeat: 0.4,
                mass: 200,
                ambientTemp: 22,
                maxStress: 800,
                maxTemp: 60,
                stressMultiplier: 150,
                thermalCoeff: 7.6,
                efficiencyBase: 95,
                vibrationBase: 0.1,
                pressureBase: 0.05
            },
            'exoskeleton': {
                // 外骨骼：人体辅助系统
                powerBase: 2.5,
                powerRange: [0.5, 4.0],
                loadFactor: 0.70,
                coolingEfficiency: 0.62,
                networkLatency: 18,
                materialYoungsModulus: 150,
                thermalConductivity: 15,
                specificHeat: 0.6,
                mass: 25,
                ambientTemp: 22,
                maxStress: 350,
                maxTemp: 50,
                stressMultiplier: 140,
                thermalCoeff: 16.0,
                efficiencyBase: 75,
                vibrationBase: 0.3,
                pressureBase: 0.8
            }
        }
        return params[projectType] || params['tank']
    }
    
    // 根据当前项目更新模型类型
    useEffect(() => {
        const currentProject = projects[activeProject]
        if (currentProject) {
            setParts([{
                id: 'main',
                name: 'main',
                position: [0, 0, 0] as [number, number, number],
                color: '#c9a55c',
                visible: true,
                selected: false,
                modelType: currentProject.modelType as any
            }])
            setSelectedPart(null)
            
            // 重置历史数据
            setDataHistory({
                structuralStress: [],
                thermalLoad: [],
                collaborationDelay: []
            })
        }
    }, [activeProject])
    
    // 实时监控数据更新 - 完整物理模型系统
    useEffect(() => {
        const startTime = Date.now()
        const params = getProjectPhysicsParams(projects[activeProject]?.modelType || 'tank')
        
        // 系统状态变量（模拟真实系统）
        let systemState = {
            // 动力系统状态
            currentPower: params.powerBase * params.loadFactor,
            targetPower: params.powerBase * params.loadFactor,
            powerRampRate: 50, // kW/s
            
            // 热力学状态
            coreTemp: params.ambientTemp + 10,
            surfaceTemp: params.ambientTemp + 5,
            coolantTemp: params.ambientTemp,
            heatCapacity: params.mass * params.specificHeat,
            
            // 结构力学状态
            baseStress: 0,
            dynamicStress: 0,
            fatigueAccumulation: 0,
            
            // 网络状态
            networkLatency: params.networkLatency,
            networkJitter: 0,
            packetLoss: 0,
            bandwidth: 100, // Mbps
            
            // 系统性能
            efficiency: params.efficiencyBase,
            vibration: params.vibrationBase,
            pressure: params.pressureBase,
            flowRate: 0,
            
            // 时间状态
            lastUpdate: Date.now(),
            operationTime: 0
        }
        
        const interval = setInterval(() => {
            const elapsed = (Date.now() - startTime) / 1000
            const deltaTime = Math.min((Date.now() - systemState.lastUpdate) / 1000, 0.5) // 限制最大时间步
            systemState.lastUpdate = Date.now()
            systemState.operationTime += deltaTime
            
            // ========== 功率系统模拟 ==========
            // 工作循环：启动-运行-负载变化-冷却
            const cyclePhase = (elapsed % 120) / 120 // 2分钟周期
            let targetPowerMultiplier = 1.0
            
            if (cyclePhase < 0.1) {
                // 启动阶段：功率逐渐增加
                targetPowerMultiplier = cyclePhase * 10
            } else if (cyclePhase < 0.7) {
                // 正常运行：有负载波动
                targetPowerMultiplier = 1.0 + Math.sin(elapsed * 0.5) * 0.12 + Math.sin(elapsed * 2.3) * 0.06
            } else if (cyclePhase < 0.9) {
                // 高负载阶段
                targetPowerMultiplier = 1.15 + Math.sin(elapsed * 0.8) * 0.08
            } else {
                // 冷却阶段：功率降低
                targetPowerMultiplier = 1.15 - (cyclePhase - 0.9) * 15
            }
            
            systemState.targetPower = params.powerBase * params.loadFactor * Math.max(0.3, Math.min(1.2, targetPowerMultiplier))
            
            // 功率平滑变化（模拟真实响应）
            const powerDiff = systemState.targetPower - systemState.currentPower
            systemState.currentPower += Math.sign(powerDiff) * Math.min(Math.abs(powerDiff), systemState.powerRampRate * deltaTime)
            systemState.currentPower = Math.max(params.powerRange[0], Math.min(params.powerRange[1], systemState.currentPower))
            
            // ========== 热力学系统模拟 ==========
            // 热生成：Q = P × (1 - η) × 热系数
            const heatGeneration = systemState.currentPower * params.thermalCoeff * (1 - params.coolingEfficiency)
            
            // 核心温度：基于热生成和热容量
            const coreHeatInput = heatGeneration * deltaTime
            systemState.coreTemp += coreHeatInput / systemState.heatCapacity
            
            // 热传导：从核心到表面（基于热导率）
            const tempGradient = systemState.coreTemp - systemState.surfaceTemp
            const heatTransfer = params.thermalConductivity * tempGradient * deltaTime * 0.1
            systemState.coreTemp -= heatTransfer / systemState.heatCapacity
            systemState.surfaceTemp += heatTransfer / (systemState.heatCapacity * 0.3)
            
            // 表面散热：对流和辐射
            const surfaceArea = 10 // m²
            const convectionCoeff = 25 // W/m²·K
            const heatLoss = convectionCoeff * surfaceArea * (systemState.surfaceTemp - params.ambientTemp) * deltaTime / systemState.heatCapacity
            systemState.surfaceTemp -= heatLoss
            
            // 冷却系统：冷却液循环
            const coolantFlow = 45 + Math.sin(elapsed * 0.3) * 5 // L/min
            const coolingEffect = params.coolingEfficiency * coolantFlow * 0.1 * (systemState.coreTemp - systemState.coolantTemp) * deltaTime / systemState.heatCapacity
            systemState.coreTemp -= coolingEffect
            systemState.coolantTemp = params.ambientTemp + (systemState.coreTemp - params.ambientTemp) * 0.2
            
            // 环境温度波动
            const ambientVariation = Math.sin(elapsed * 0.05) * 2 + Math.sin(elapsed * 0.2) * 1
            const effectiveAmbient = params.ambientTemp + ambientVariation
            systemState.surfaceTemp = effectiveAmbient + (systemState.surfaceTemp - effectiveAmbient) * 0.98
            
            const thermalLoad = Math.max(20, Math.min(100, systemState.surfaceTemp + (Math.random() - 0.5) * 0.5))
            
            // ========== 结构力学系统模拟 ==========
            // 静态应力：基于功率和材料特性
            const staticStress = systemState.currentPower * params.stressMultiplier
            
            // 动态应力：振动和冲击
            const vibrationFreq = 50 + Math.sin(elapsed * 0.1) * 10 // Hz
            const vibrationAmp = systemState.vibration
            systemState.dynamicStress = vibrationAmp * vibrationFreq * 0.15 * Math.sin(elapsed * vibrationFreq * Math.PI * 2)
            
            // 温度对材料性能的影响（高温降低强度）
            const tempEffect = (thermalLoad - params.ambientTemp) * 0.15
            
            // 疲劳累积（长期效应）
            systemState.fatigueAccumulation += (staticStress + Math.abs(systemState.dynamicStress)) * deltaTime * 0.0001
            const fatigueFactor = 1 + systemState.fatigueAccumulation * 0.01
            
            // 总应力
            const structuralStress = Math.max(20, Math.min(95, 
                (staticStress + systemState.dynamicStress) * fatigueFactor - tempEffect + (Math.random() - 0.5) * 1.2
            ))
            
            // ========== 网络系统模拟 ==========
            // 基础延迟
            let networkDelay = params.networkLatency
            
            // 网络抖动（随机游走模型）
            systemState.networkJitter += (Math.random() - 0.5) * 1.5
            systemState.networkJitter *= 0.9 // 衰减
            systemState.networkJitter = Math.max(-8, Math.min(8, systemState.networkJitter))
            networkDelay += systemState.networkJitter
            
            // 系统负载对网络的影响
            const loadFactor = systemState.currentPower / params.powerBase
            const loadImpact = (loadFactor - 0.5) * 4
            
            // 网络拥塞（周期性）
            const congestionFactor = Math.max(0, Math.sin(elapsed * 0.25) * 1.5 + Math.sin(elapsed * 0.7) * 0.8)
            
            // 数据包丢失导致的延迟
            systemState.packetLoss = Math.max(0, Math.min(5, congestionFactor * 2))
            const packetLossDelay = systemState.packetLoss * 1.2
            
            const collaborationDelay = Math.max(3, Math.min(35, 
                networkDelay + loadImpact + congestionFactor + packetLossDelay + (Math.random() - 0.5) * 0.8
            ))
            
            // ========== 系统性能参数 ==========
            // 效率：基于负载和温度
            const efficiencyDrop = (thermalLoad - params.ambientTemp) * 0.15 + (loadFactor - 0.7) * 5
            systemState.efficiency = Math.max(60, Math.min(98, params.efficiencyBase - efficiencyDrop + (Math.random() - 0.5) * 1))
            
            // 振动：基于功率和负载
            systemState.vibration = params.vibrationBase * (1 + loadFactor * 0.3) + Math.sin(elapsed * 10) * 0.2 + (Math.random() - 0.5) * 0.1
            systemState.vibration = Math.max(0.1, Math.min(5.0, systemState.vibration))
            
            // 压力：基于功率和系统状态
            systemState.pressure = params.pressureBase * (0.8 + loadFactor * 0.4) + Math.sin(elapsed * 0.4) * 0.1 + (Math.random() - 0.5) * 0.05
            systemState.pressure = Math.max(0.1, Math.min(3.0, systemState.pressure))
            
            // 流量：基于冷却需求
            systemState.flowRate = 30 + (thermalLoad - params.ambientTemp) * 0.8 + Math.sin(elapsed * 0.3) * 3 + (Math.random() - 0.5) * 2
            systemState.flowRate = Math.max(20, Math.min(80, systemState.flowRate))
            
            // 更新监控数据
            const newData = {
                structuralStress: Math.round(structuralStress * 10) / 10,
                thermalLoad: Math.round(thermalLoad * 10) / 10,
                collaborationDelay: Math.round(collaborationDelay * 10) / 10,
                powerOutput: Math.round(systemState.currentPower * 10) / 10,
                efficiency: Math.round(systemState.efficiency * 10) / 10,
                vibration: Math.round(systemState.vibration * 100) / 100,
                pressure: Math.round(systemState.pressure * 100) / 100,
                flowRate: Math.round(systemState.flowRate * 10) / 10
            }
            
            setMonitoringData(newData)
            
            // 更新历史数据（保留最近100个数据点）
            setDataHistory(prev => ({
                structuralStress: [...prev.structuralStress.slice(-99), structuralStress],
                thermalLoad: [...prev.thermalLoad.slice(-99), thermalLoad],
                collaborationDelay: [...prev.collaborationDelay.slice(-99), collaborationDelay]
            }))
        }, 200) // 每200ms更新，高频率采样
        
        return () => clearInterval(interval)
    }, [activeProject])
    const [annotations, setAnnotations] = useState<any[]>([])
    
    // UI状态
    const [annotationDrawerVisible, setAnnotationDrawerVisible] = useState(false)
    const [versionDrawerVisible, setVersionDrawerVisible] = useState(false)
    const [gjbDrawerVisible, setGjbDrawerVisible] = useState(false)
    const [syncDrawerVisible, setSyncDrawerVisible] = useState(false)
    const [disassembleMode, setDisassembleMode] = useState(false)
    const [explodeLevel, setExplodeLevel] = useState(0) // 0-3级爆炸视图
    const [newAnnotation, setNewAnnotation] = useState({ 
        text: '', 
        author: '当前用户',
        type: 'info' as 'info' | 'warning' | 'error' | 'success',
        partId: ''
    })
    const [editingAnnotation, setEditingAnnotation] = useState<any>(null)
    
    // API数据状态
    const [apiProjects, setApiProjects] = useState<Project[]>([])
    const [apiAnnotations, setApiAnnotations] = useState<ApiAnnotation[]>([])
    const [apiVersions, setApiVersions] = useState<Version[]>([])
    const [gjbRules, setGjbRules] = useState<GJBRule[]>([])
    const [gjbResults, setGjbResults] = useState<GJBCheckResult[]>([])
    const [gjbSummary, setGjbSummary] = useState<GJBCheckSummary | null>(null)
    const [syncRecords, setSyncRecords] = useState<SyncRecord[]>([])
    const [syncStatus, setSyncStatus] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isGjbChecking, setIsGjbChecking] = useState(false)
    const [isSyncing, setIsSyncing] = useState(false)
    const [syncProgress, setSyncProgress] = useState(0)
    
    // 当前用户信息 - 从认证上下文获取
    const currentUser = useMemo(() => ({
        id: user?.id || 'unknown',
        name: user?.name || '未知用户',
        role: user?.role || 'USER'
    }), [user])
    
    // 项目映射
    const projectIdMap = useMemo(() => ({
        0: 'proj-001',
        1: 'proj-002',
        2: 'proj-003',
        3: 'proj-004'
    }), [])
    
    const projects = useMemo(() => [
        { id: 0, name: 'T-99 动力系统优化', status: '进行中', progress: 75, version: 'v2.3.1', modelType: 'tank' as const },
        { id: 1, name: '无人机集群控制算法', status: '代码审查', progress: 90, version: 'v1.8.2', modelType: 'drone' as const },
        { id: 2, name: '新型复合装甲测试', status: '待启动', progress: 0, version: 'v0.1.0', modelType: 'armor' as const },
        { id: 3, name: '外骨骼支撑结构设计', status: '进行中', progress: 45, version: 'v3.0.5', modelType: 'exoskeleton' as const },
    ], [])

    const members = [
        { name: '孙经理', role: '项目经理', color: '#f56a00', online: true, action: '正在编辑动力核心' },
        { name: '江副经理', role: '副项目经理', color: '#7265e6', online: true, action: '查看版本历史' },
    ]

    // 从API加载版本数据
    const versions = useMemo(() => 
        apiVersions.map(v => ({
            id: v.version,
            author: v.authorName,
            time: new Date(v.createdAt).toLocaleString('zh-CN'),
            desc: v.commitMessage,
            changes: v.changes.length,
            apiId: v.id
        })), [apiVersions])

    // 从API加载GJB检查结果
    const gjbChecks = useMemo(() => 
        gjbResults.map(r => ({
            rule: r.ruleId,
            name: r.ruleName || r.ruleId,
            status: r.status === 'passed' ? 'pass' : r.status,
            desc: r.details,
            score: r.score
        })), [gjbResults])
    
    // 初始化：加载API数据
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setIsLoading(true)
                const [projectsData, rulesData] = await Promise.all([
                    projectApi.getAll(),
                    gjbApi.getRules()
                ])
                setApiProjects(projectsData)
                setGjbRules(rulesData)
            } catch (error) {
                console.error('加载初始数据失败:', error)
            } finally {
                setIsLoading(false)
            }
        }
        loadInitialData()
        
        // 连接WebSocket
        const socket = collaborateSocket.connect()
        
        // 监听实时事件
        collaborateSocket.on('annotation-added', (annotation: ApiAnnotation) => {
            setApiAnnotations(prev => [...prev, annotation])
            message.info(`${annotation.authorName} 添加了新标注`)
        })
        
        collaborateSocket.on('annotation-updated', (annotation: ApiAnnotation) => {
            setApiAnnotations(prev => prev.map(a => a.id === annotation.id ? annotation : a))
        })
        
        collaborateSocket.on('annotation-deleted', (id: string) => {
            setApiAnnotations(prev => prev.filter(a => a.id !== id))
        })
        
        collaborateSocket.on('version-created', (version: Version) => {
            setApiVersions(prev => [version, ...prev])
            message.success(`新版本 ${version.version} 已创建`)
        })
        
        collaborateSocket.on('gjb-check-completed', (summary: GJBCheckSummary) => {
            setGjbSummary(summary)
            setGjbResults(summary.results)
            message.success(`GJB检查完成，合规率: ${summary.complianceRate}%`)
        })
        
        collaborateSocket.on('sync-progress', (data: { id: string; progress: number }) => {
            setSyncProgress(data.progress)
        })
        
        collaborateSocket.on('sync-completed', (record: SyncRecord) => {
            setSyncRecords(prev => [record, ...prev.filter(r => r.id !== record.id)])
            setIsSyncing(false)
            setSyncProgress(100)
            message.success('同步完成')
        })
        
        return () => {
            collaborateSocket.disconnect()
        }
    }, [])
    
    // 项目切换时加载数据
    useEffect(() => {
        const loadProjectData = async () => {
            const projectId = projectIdMap[activeProject as keyof typeof projectIdMap]
            if (!projectId) return
            
            try {
                setIsLoading(true)
                const [annotationsData, versionsData, resultsData, syncRecordsData, syncStatusData] = await Promise.all([
                    annotationApi.getByProject(projectId),
                    versionApi.getByProject(projectId),
                    gjbApi.getResults(projectId),
                    syncApi.getRecords(projectId),
                    syncApi.getStatus(projectId)
                ])
                
                setApiAnnotations(annotationsData)
                setApiVersions(versionsData)
                setGjbResults(resultsData)
                setSyncRecords(syncRecordsData)
                setSyncStatus(syncStatusData)
                
                // 加入项目协作房间
                collaborateSocket.joinProject(projectId, currentUser.id, currentUser.name)
            } catch (error) {
                console.error('加载项目数据失败:', error)
            } finally {
                setIsLoading(false)
            }
        }
        loadProjectData()
        
        return () => {
            const projectId = projectIdMap[activeProject as keyof typeof projectIdMap]
            if (projectId) {
                collaborateSocket.leaveProject(projectId, currentUser.id)
            }
        }
    }, [activeProject, projectIdMap, currentUser])

    const handlePartSelect = useCallback((id: string) => {
        console.log('Part selected:', id)
        setParts(prevParts => prevParts.map(p => ({
            ...p,
            selected: p.id === id
        })))
        setSelectedPart(id)
        
        // 同步部件选择到其他协作者
        const projectId = projectIdMap[activeProject as keyof typeof projectIdMap]
        if (projectId) {
            collaborateSocket.syncPartSelection(projectId, currentUser.id, currentUser.name, id)
        }
        
        message.success(`已选择部件: ${id === 'part1' ? '动力核心' : id === 'part2' ? '冷却系统' : id === 'part3' ? '传动装置' : '控制模块'}`)
    }, [activeProject, projectIdMap, currentUser])

    const handleAddAnnotation = (position: [number, number, number]) => {
        setAnnotationDrawerVisible(true)
    }

    // 保存标注 - 使用真实API - 支持新增和编辑
    const handleSaveAnnotation = useCallback(async () => {
        if (newAnnotation.text && newAnnotation.partId) {
            const projectId = projectIdMap[activeProject as keyof typeof projectIdMap]
            try {
                if (editingAnnotation) {
                    // 更新已有标注
                    const updated = await annotationApi.update(editingAnnotation.id, {
                        content: newAnnotation.text,
                        type: newAnnotation.type,
                        partId: newAnnotation.partId
                    })
                    setApiAnnotations(prev => prev.map(a => a.id === editingAnnotation.id ? updated : a))
                    message.success('标注已更新')
                } else {
                    // 创建新标注 - 传递token以确保使用正确的用户
                    const annotation = await annotationApi.create({
                        projectId,
                        partId: newAnnotation.partId || selectedPart || 'general',
                        position: { x: 0, y: 0, z: 0 },
                        content: newAnnotation.text,
                        type: newAnnotation.type,
                        author: currentUser.id,
                        authorName: currentUser.name
                    }, token || undefined)
                    
                    // 本地状态也更新
                    setAnnotations([...annotations, {
                        position: [0, 0, 0],
                        text: newAnnotation.text,
                        author: newAnnotation.author,
                        time: new Date().toLocaleString()
                    }])
                    setApiAnnotations(prev => [...prev, annotation])
                    message.success('标注已保存')
                }
                
                setNewAnnotation({ text: '', author: '当前用户', type: 'info', partId: '' })
                setEditingAnnotation(null)
                setAnnotationDrawerVisible(false)
            } catch (error: any) {
                console.error('保存标注失败:', error)
                const errorMsg = error?.message || '保存标注失败，请重试'
                message.error(errorMsg)
            }
        } else {
            message.warning('请填写标注内容并选择关联部件')
        }
    }, [newAnnotation, editingAnnotation, activeProject, projectIdMap, selectedPart, currentUser, annotations])

    // 切换部件可见性 - 使用真实API
    const handleTogglePartVisibility = useCallback(async (id: string) => {
        const projectId = projectIdMap[activeProject as keyof typeof projectIdMap]
        try {
            await disassemblyApi.togglePart(projectId, id)
            setParts(parts.map(p => 
                p.id === id ? { ...p, visible: !p.visible } : p
            ))
        } catch (error) {
            console.error('切换部件可见性失败:', error)
            // 即使API失败也更新本地状态
            setParts(parts.map(p => 
                p.id === id ? { ...p, visible: !p.visible } : p
            ))
        }
    }, [activeProject, projectIdMap, parts])

    // 拆解模式 - 使用真实API - 支持多级爆炸视图
    const handleDisassemble = useCallback(async () => {
        const projectId = projectIdMap[activeProject as keyof typeof projectIdMap]
        const newMode = !disassembleMode
        setDisassembleMode(newMode)
        
        try {
            if (newMode) {
                await disassemblyApi.setExplodeLevel(projectId, 1)
                setExplodeLevel(1)
                applyExplodeLevel(1)
                message.success('已进入拆解模式 (1级)')
            } else {
                await disassemblyApi.reset(projectId)
                setExplodeLevel(0)
                applyExplodeLevel(0)
                message.success('已退出拆解模式')
            }
        } catch (error) {
            console.error('拆解操作失败:', error)
            if (newMode) {
                setExplodeLevel(1)
                applyExplodeLevel(1)
            } else {
                setExplodeLevel(0)
                applyExplodeLevel(0)
            }
        }
    }, [disassembleMode, activeProject, projectIdMap])
    
    // 应用爆炸视图级别
    const applyExplodeLevel = useCallback((level: number) => {
        const explosionDistances = [0, 1.5, 2.5, 4] // 不同级别的爆炸距离
        const distance = explosionDistances[level] || 0
        
        setParts(prevParts => prevParts.map((p, idx) => {
            if (level === 0) {
                return { ...p, position: [0, 0, 0] as [number, number, number] }
            }
            const angle = (idx * Math.PI * 2) / prevParts.length
            const verticalOffset = (idx % 2) * 0.5 - 0.25 // 上下错开
            return {
                ...p,
                position: [
                    Math.cos(angle) * distance,
                    verticalOffset * distance,
                    Math.sin(angle) * distance
                ] as [number, number, number]
            }
        }))
    }, [])
    
    // 设置爆炸级别 - 使用真实API
    const handleSetExplodeLevel = useCallback(async (level: number) => {
        const projectId = projectIdMap[activeProject as keyof typeof projectIdMap]
        setExplodeLevel(level)
        setDisassembleMode(level > 0)
        
        try {
            if (level === 0) {
                await disassemblyApi.reset(projectId)
            } else {
                await disassemblyApi.setExplodeLevel(projectId, level)
            }
            applyExplodeLevel(level)
            message.success(level === 0 ? '已恢复组装状态' : `已设置${level}级爆炸视图`)
        } catch (error) {
            console.error('设置爆炸级别失败:', error)
            applyExplodeLevel(level)
        }
    }, [activeProject, projectIdMap, applyExplodeLevel])
    
    // 创建新版本 - 使用真实API
    const handleCreateVersion = useCallback(async (commitMessage: string) => {
        const projectId = projectIdMap[activeProject as keyof typeof projectIdMap]
        try {
            const version = await versionApi.create({
                projectId,
                commitMessage,
                author: currentUser.id,
                authorName: currentUser.name,
                changeType: 'patch',
                changes: [{ type: 'modify', description: commitMessage }]
            })
            message.success(`版本 ${version.version} 已创建`)
            return version
        } catch (error) {
            console.error('创建版本失败:', error)
            message.error('创建版本失败')
            throw error
        }
    }, [activeProject, projectIdMap, currentUser])
    
    // 版本回滚 - 使用真实API
    const handleRollback = useCallback(async (versionId: string) => {
        try {
            const rollbackVersion = await versionApi.rollback(versionId, currentUser.id, currentUser.name)
            message.success(`已回滚到 ${rollbackVersion.commitMessage}`)
        } catch (error) {
            console.error('版本回滚失败:', error)
            message.error('版本回滚失败')
        }
    }, [currentUser])
    
    // GJB合规检查 - 使用真实API
    const handleGjbCheck = useCallback(async () => {
        const projectId = projectIdMap[activeProject as keyof typeof projectIdMap]
        setIsGjbChecking(true)
        try {
            const summary = await gjbApi.runCheck(projectId)
            setGjbSummary(summary)
            setGjbResults(summary.results)
            message.success(`GJB检查完成，合规率: ${summary.complianceRate}%`)
        } catch (error) {
            console.error('GJB检查失败:', error)
            message.error('GJB检查失败')
        } finally {
            setIsGjbChecking(false)
        }
    }, [activeProject, projectIdMap])
    
    // 云同步上传 - 使用真实API
    const handleSyncUpload = useCallback(async () => {
        const projectId = projectIdMap[activeProject as keyof typeof projectIdMap]
        const project = projects[activeProject]
        setIsSyncing(true)
        setSyncProgress(0)
        try {
            const record = await syncApi.upload(
                projectId,
                `${project.name}-${project.version}.glb`,
                Math.floor(Math.random() * 10000000) + 5000000,
                currentUser.id
            )
            setSyncRecords(prev => [record, ...prev])
            message.info('开始上传同步...')
        } catch (error) {
            console.error('上传同步失败:', error)
            message.error('上传同步失败')
            setIsSyncing(false)
        }
    }, [activeProject, projectIdMap, projects, currentUser])
    
    // 云同步下载 - 使用真实API
    const handleSyncDownload = useCallback(async () => {
        const projectId = projectIdMap[activeProject as keyof typeof projectIdMap]
        const latestVersion = apiVersions[0]
        setIsSyncing(true)
        setSyncProgress(0)
        try {
            const record = await syncApi.download(
                projectId,
                latestVersion?.id || '',
                currentUser.id
            )
            setSyncRecords(prev => [record, ...prev])
            message.info('开始下载同步...')
        } catch (error) {
            console.error('下载同步失败:', error)
            message.error('下载同步失败')
            setIsSyncing(false)
        }
    }, [activeProject, projectIdMap, apiVersions, currentUser])

    return (
        <ConfigProvider theme={{
            algorithm: theme.darkAlgorithm,
            token: { colorPrimary: '#c9a55c' }
        }}>
            <EquipmentInteraction />
        </ConfigProvider>
    )
}

export default EquipmentControl
