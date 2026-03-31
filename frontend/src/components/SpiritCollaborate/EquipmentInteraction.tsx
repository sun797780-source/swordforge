import React, { useState, useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera, Html, Box, Cylinder, Sphere } from '@react-three/drei'
import * as THREE from 'three'
import { 
    Type99Tank, Type59Tank, Type15Tank,
    Type56Rifle, Type81Rifle, Type95Rifle,
    Type92Pistol,
    J20Fighter, J10Fighter,
    Rainbow5Drone,
    Type152Cannon,
    PHL03RocketLauncher
} from '../StarFireHeritage/models/EquipmentModels'
import { Card, Tag, message } from 'antd'

// 装备类型
type EquipmentType = 'tank' | 'rifle' | 'pistol' | 'fighter' | 'drone' | 'cannon' | 'rocket'

// 坦克属性配置
interface TankStats {
    speed: number        // 最大速度 km/h
    fireRate: number     // 射击间隔 ms
    reloadTime: number   // 装弹时间 ms
    damage: number       // 伤害值
    ammo: number         // 弹药容量
    armor: number        // 装甲厚度
    explosionRadius: number // 爆炸范围
    shellSpeed: number   // 炮弹速度
    color: string        // 主色调
    accentColor: string  // 强调色
}

// 武器属性配置
interface WeaponStats {
    damage: number       // 单发伤害
    fireRate: number     // 射击间隔 ms
    reloadTime: number   // 装弹时间 ms
    ammo: number         // 弹药容量
    range: number        // 有效射程
    bulletSpeed: number  // 子弹速度
    accuracy: number     // 精度 (0-1)
    penetration: number  // 穿透力
}

const TANK_STATS: Record<string, TankStats> = {
    type99: {
        speed: 65,
        fireRate: 800,
        reloadTime: 2500,
        damage: 100,
        ammo: 40,
        armor: 800,
        explosionRadius: 8,
        shellSpeed: 1.2,
        color: '#3d5c3d',      // 深军绿
        accentColor: '#2d4a2d'
    },
    type59: {
        speed: 45,
        fireRate: 1200,
        reloadTime: 4000,
        damage: 70,
        ammo: 34,
        armor: 500,
        explosionRadius: 6,
        shellSpeed: 1.0,
        color: '#5a5a4a',      // 橄榄灰
        accentColor: '#4a4a3a'
    },
    type15: {
        speed: 75,
        fireRate: 600,
        reloadTime: 2000,
        damage: 60,
        ammo: 38,
        armor: 400,
        explosionRadius: 5,
        shellSpeed: 1.3,
        color: '#4a6b8a',      // 蓝灰色
        accentColor: '#3a5a7a'
    }
}

// 武器属性配置
const WEAPON_STATS: Record<string, WeaponStats> = {
    type56: {
        damage: 45,
        fireRate: 200,      // 半自动，较慢
        reloadTime: 2500,
        ammo: 30,
        range: 400,
        bulletSpeed: 2.5,
        accuracy: 0.95,
        penetration: 30
    },
    type81: {
        damage: 40,
        fireRate: 100,      // 全自动，快速
        reloadTime: 3000,
        ammo: 30,
        range: 350,
        bulletSpeed: 2.3,
        accuracy: 0.85,
        penetration: 25
    },
    type95: {
        damage: 42,
        fireRate: 120,      // 全自动，中等
        reloadTime: 2800,
        ammo: 30,
        range: 380,
        bulletSpeed: 2.4,
        accuracy: 0.90,
        penetration: 28
    },
    type92: {
        damage: 35,
        fireRate: 300,      // 手枪，较慢
        reloadTime: 2000,
        ammo: 15,
        range: 150,
        bulletSpeed: 2.0,
        accuracy: 0.80,
        penetration: 20
    }
}

// 装备配置
interface EquipmentConfig {
    id: string
    name: string
    type: EquipmentType
    model: React.ComponentType<any>
    description: string
    controls: string[]
    icon: string
}

const EQUIPMENT_CONFIGS: EquipmentConfig[] = [
    {
        id: 'type99',
        name: '99式主战坦克',
        type: 'tank',
        model: Type99Tank,
        description: '第三代主战坦克 | 火力猛 | 装甲厚 | 速度65km/h',
        controls: ['WASD: 移动', '鼠标: 控制炮塔', '空格: 开火', 'R: 装弹', 'ESC: 退出'],
        icon: '🛡️'
    },
    {
        id: 'type59',
        name: '59式主战坦克',
        type: 'tank',
        model: Type59Tank,
        description: '第一代经典坦克 | 射速慢 | 伤害中等 | 速度45km/h',
        controls: ['WASD: 移动', '鼠标: 控制炮塔', '空格: 开火', 'R: 装弹', 'ESC: 退出'],
        icon: '⚙️'
    },
    {
        id: 'type15',
        name: '15式轻型坦克',
        type: 'tank',
        model: Type15Tank,
        description: '新型轻坦 | 速度快75km/h | 射速快 | 装甲薄',
        controls: ['WASD: 移动', '鼠标: 控制炮塔', '空格: 开火', 'R: 装弹', 'ESC: 退出'],
        icon: '🔰'
    },
    {
        id: 'type56',
        name: '56式半自动步枪',
        type: 'rifle',
        model: Type56Rifle,
        description: '经典半自动步枪，精度高',
        controls: ['鼠标移动: 瞄准', '左键: 射击', 'R: 装弹', '右键: 开镜', 'ESC: 退出'],
        icon: '🎯'
    },
    {
        id: 'type81',
        name: '81式自动步枪',
        type: 'rifle',
        model: Type81Rifle,
        description: '可靠的全自动步枪',
        controls: ['鼠标移动: 瞄准', '左键: 射击', 'R: 装弹', '右键: 开镜', 'ESC: 退出'],
        icon: '🔫'
    },
    {
        id: 'type95',
        name: '95式自动步枪',
        type: 'rifle',
        model: Type95Rifle,
        description: '无托结构，现代化设计',
        controls: ['鼠标移动: 瞄准', '左键: 射击', 'R: 装弹', '右键: 开镜', 'ESC: 退出'],
        icon: '💥'
    },
    {
        id: 'type92',
        name: '92式手枪',
        type: 'pistol',
        model: Type92Pistol,
        description: '制式手枪，精度高',
        controls: ['鼠标移动: 瞄准', '左键: 射击', 'R: 装弹', 'ESC: 退出'],
        icon: '🔫'
    },
    {
        id: 'j20',
        name: '歼-20战斗机',
        type: 'fighter',
        model: J20Fighter,
        description: '第五代隐身战斗机',
        controls: ['W/S: 俯仰', 'A/D: 滚转', 'Q/E: 偏航', '空格: 加速', 'Shift: 减速', 'F: 发射导弹', 'ESC: 退出'],
        icon: '✈️'
    },
    {
        id: 'j10',
        name: '歼-10战斗机',
        type: 'fighter',
        model: J10Fighter,
        description: '第三代多用途战斗机',
        controls: ['W/S: 俯仰', 'A/D: 滚转', 'Q/E: 偏航', '空格: 加速', 'Shift: 减速', 'F: 发射导弹', 'ESC: 退出'],
        icon: '🛩️'
    },
    {
        id: 'rainbow5',
        name: '彩虹-5无人机',
        type: 'drone',
        model: Rainbow5Drone,
        description: '察打一体无人机',
        controls: ['WASD: 方向控制', '空格/Shift: 升降', 'F: 发射导弹', 'C: 切换摄像头', 'ESC: 退出'],
        icon: '📡'
    },
    {
        id: 'type152',
        name: '152mm加农炮',
        type: 'cannon',
        model: Type152Cannon,
        description: '大口径压制火炮',
        controls: ['A/D: 水平旋转', 'W/S: 调整仰角', '空格: 开火', 'R: 装填', 'ESC: 退出'],
        icon: '💣'
    },
    {
        id: 'phl03',
        name: 'PHL-03火箭炮',
        type: 'rocket',
        model: PHL03RocketLauncher,
        description: '远程火箭炮系统',
        controls: ['A/D: 水平旋转', 'W/S: 调整仰角', '空格: 发射', '1-6: 选择发射管', 'ESC: 退出'],
        icon: '🚀'
    }
]

// 可破坏物体接口
interface DestructibleObject {
    id: string
    position: [number, number, number]
    health: number
    maxHealth: number
    type: 'tank' | 'building' | 'tree' | 'rock'
    size: number // 碰撞半径
}

// 可破坏物体接口（已定义，用于类型检查）

// 爆炸效果组件 - 带伤害计算
function Explosion({ 
    position, 
    onComplete, 
    damage = 100, 
    radius = 8,
    onDamage 
}: {
    position: [number, number, number]
    onComplete: () => void
    damage?: number
    radius?: number
    onDamage?: (pos: [number, number, number], dmg: number, r: number) => void
}) {
    const [scale, setScale] = useState(0.1)
    const [opacity, setOpacity] = useState(1)
    const startTime = useRef(Date.now())
    const damageApplied = useRef(false)
    
    useFrame(() => {
        const elapsed = (Date.now() - startTime.current) / 1000
        
        // 爆炸扩大
        const currentScale = Math.min(elapsed * 15, radius)
        setScale(currentScale)
        
        // 在爆炸开始瞬间应用伤害
        if (!damageApplied.current && elapsed > 0.05) {
            damageApplied.current = true
            if (onDamage) {
                onDamage(position, damage, radius)
            }
        }
        
        // 逐渐消失
        setOpacity(Math.max(0, 1 - elapsed * 2))
        
        // 动画完成后移除
        if (elapsed > 0.8) {
            onComplete()
        }
    })
    
    return (
        <group position={position}>
            {/* 主爆炸球 */}
            <mesh scale={[scale, scale, scale]}>
                <sphereGeometry args={[1, 16, 16]} />
                <meshStandardMaterial 
                    color="#ff4400" 
                    emissive="#ff2200" 
                    emissiveIntensity={3}
                    transparent 
                    opacity={opacity * 0.8} 
                />
            </mesh>
            {/* 内核 */}
            <mesh scale={[scale * 0.5, scale * 0.5, scale * 0.5]}>
                <sphereGeometry args={[1, 12, 12]} />
                <meshStandardMaterial 
                    color="#ffff00" 
                    emissive="#ffaa00" 
                    emissiveIntensity={5}
                    transparent 
                    opacity={opacity} 
                />
            </mesh>
            {/* 冲击波环 */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} scale={[scale * 1.5, scale * 1.5, 1]}>
                <ringGeometry args={[0.8, 1, 32]} />
                <meshStandardMaterial 
                    color="#ff6600" 
                    emissive="#ff3300" 
                    emissiveIntensity={2}
                    transparent 
                    opacity={opacity * 0.5}
                    side={2}
                />
            </mesh>
            {/* 烟雾 */}
            <mesh scale={[scale * 1.2, scale * 0.8, scale * 1.2]} position={[0, scale * 0.3, 0]}>
                <sphereGeometry args={[1, 8, 8]} />
                <meshStandardMaterial 
                    color="#333333" 
                    transparent 
                    opacity={opacity * 0.4} 
                />
            </mesh>
        </group>
    )
}

// 子弹/炮弹组件 - 带重力的抛物线轨迹
function Projectile({ position, direction, speed, onRemove, onExplode, isShell = false, targets = [] }: {
    position: [number, number, number]
    direction: THREE.Vector3
    speed: number
    onRemove: () => void
    onExplode?: (pos: [number, number, number]) => void
    isShell?: boolean
    targets?: Array<{ id: string, position: [number, number, number], health: number, type?: string }>
}) {
    const ref = useRef<THREE.Mesh>(null)
    const velocity = useRef(direction.clone().multiplyScalar(speed))
    const startTime = useRef(Date.now())
    const gravity = isShell ? 0.015 : 0.008
    
    useFrame(() => {
        if (ref.current) {
            const shellPos = ref.current.position
            
            // 应用速度
            shellPos.x += velocity.current.x
            shellPos.y += velocity.current.y
            shellPos.z += velocity.current.z
            
            // 应用重力
            velocity.current.y -= gravity
            
            // 空气阻力
            if (isShell) {
                velocity.current.x *= 0.998
                velocity.current.z *= 0.998
            } else {
                velocity.current.x *= 0.997
                velocity.current.z *= 0.997
            }
            
            // 检测与目标碰撞（仅炮弹）
            if (isShell && onExplode) {
                for (const target of targets) {
                    if (target.health <= 0) continue
                    
                    const dx = shellPos.x - target.position[0]
                    const dy = shellPos.y - target.position[1]
                    const dz = shellPos.z - target.position[2]
                    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)
                    
                    // 根据目标类型设置碰撞半径
                    let collisionRadius = 2
                    if (target.type === 'tank') collisionRadius = 3
                    if (target.type === 'building') collisionRadius = 5
                    
                    if (distance < collisionRadius) {
                        // 碰撞！在目标位置爆炸
                        onExplode([target.position[0], target.position[1], target.position[2]])
                        onRemove()
                        return
                    }
                }
            }
            
            // 碰到地面 - 触发爆炸
            if (shellPos.y < 0.5) {
                if (onExplode && isShell) {
                    onExplode([
                        shellPos.x,
                        0.5,
                        shellPos.z
                    ])
                }
                onRemove()
                return
            }
            
            // 超时移除（炮弹更快超时）
            const timeout = isShell ? 5000 : 10000
            if (Date.now() - startTime.current > timeout) {
                if (onExplode && isShell) {
                    onExplode([shellPos.x, shellPos.y, shellPos.z])
                }
                onRemove()
            }
        }
    })
    
    return (
        <group>
            <mesh ref={ref} position={position}>
                <sphereGeometry args={[isShell ? 0.2 : 0.08, 8, 8]} />
                <meshStandardMaterial 
                    color={isShell ? "#ff6600" : "#ffaa00"} 
                    emissive={isShell ? "#ff3300" : "#ff6600"} 
                    emissiveIntensity={2} 
                />
            </mesh>
            {/* 炮弹尾焰 */}
            {isShell && ref.current && (
                <mesh position={[
                    ref.current.position.x - velocity.current.x * 2,
                    ref.current.position.y - velocity.current.y * 2,
                    ref.current.position.z - velocity.current.z * 2
                ]}>
                    <sphereGeometry args={[0.1, 6, 6]} />
                    <meshStandardMaterial color="#ffaa00" emissive="#ff6600" emissiveIntensity={3} transparent opacity={0.6} />
                </mesh>
            )}
        </group>
    )
}

// 导弹组件 - 用于飞机发射
function Missile({ 
    position, 
    direction, 
    speed, 
    onRemove, 
    onExplode 
}: {
    position: [number, number, number]
    direction: THREE.Vector3
    speed: number
    onRemove: () => void
    onExplode: (pos: [number, number, number]) => void
}) {
    const ref = useRef<THREE.Mesh>(null)
    const velocity = useRef(direction.clone().multiplyScalar(speed))
    const startTime = useRef(Date.now())
    
    useFrame(() => {
        if (ref.current) {
            // 应用速度
            ref.current.position.x += velocity.current.x
            ref.current.position.y += velocity.current.y
            ref.current.position.z += velocity.current.z
            
            // 轻微重力
            velocity.current.y -= 0.005
            
            // 让导弹朝向飞行方向
            const dir = velocity.current.clone().normalize()
            ref.current.lookAt(
                ref.current.position.x + dir.x,
                ref.current.position.y + dir.y,
                ref.current.position.z + dir.z
            )
            
            // 碰到地面 - 触发爆炸
            if (ref.current.position.y < 1) {
                onExplode([
                    ref.current.position.x,
                    1,
                    ref.current.position.z
                ])
                onRemove()
            }
            
            // 飞行距离限制
            const elapsed = Date.now() - startTime.current
            if (elapsed > 8000 || 
                Math.abs(ref.current.position.x) > 300 || 
                Math.abs(ref.current.position.z) > 300) {
                // 超时爆炸
                onExplode([
                    ref.current.position.x,
                    ref.current.position.y,
                    ref.current.position.z
                ])
                onRemove()
            }
        }
    })
    
    return (
        <group>
            {/* 导弹主体 */}
            <mesh ref={ref} position={position}>
                <cylinderGeometry args={[0.1, 0.15, 1.5, 8]} />
                <meshStandardMaterial color="#ff4444" emissive="#ff0000" emissiveIntensity={0.5} />
            </mesh>
            {/* 尾焰 */}
            {ref.current && (
                <mesh position={[
                    ref.current.position.x - velocity.current.x * 0.5,
                    ref.current.position.y - velocity.current.y * 0.5,
                    ref.current.position.z - velocity.current.z * 0.5
                ]}>
                    <sphereGeometry args={[0.3, 6, 6]} />
                    <meshStandardMaterial color="#ff6600" emissive="#ff4400" emissiveIntensity={2} transparent opacity={0.7} />
                </mesh>
            )}
        </group>
    )
}

// 加农炮专用炮弹 - 可配置物理参数
function CannonShell({ 
    position, 
    direction, 
    speed, 
    gravity,
    airResistance,
    onRemove, 
    onExplode,
    targets = []
}: {
    position: [number, number, number]
    direction: THREE.Vector3
    speed: number
    gravity: number
    airResistance: number
    onRemove: () => void
    onExplode: (pos: [number, number, number]) => void
    targets?: Array<{ id: string, pos: [number, number, number], size: [number, number, number], health: number }>
}) {
    const ref = useRef<THREE.Mesh>(null)
    const trailRef = useRef<THREE.Mesh>(null)
    const velocity = useRef(direction.clone().multiplyScalar(speed))
    const startTime = useRef(Date.now())
    const [trail, setTrail] = useState<[number, number, number]>([...position])
    
    useFrame(() => {
        if (ref.current) {
            const shellPos = ref.current.position
            
            // 保存上一帧位置用于尾焰
            setTrail([shellPos.x, shellPos.y, shellPos.z])
            
            // 应用速度
            shellPos.x += velocity.current.x
            shellPos.y += velocity.current.y
            shellPos.z += velocity.current.z
            
            // 应用重力
            velocity.current.y -= gravity
            
            // 空气阻力
            velocity.current.x *= airResistance
            velocity.current.z *= airResistance
            
            // 让炮弹朝向飞行方向
            const dir = velocity.current.clone().normalize()
            ref.current.lookAt(
                shellPos.x + dir.x,
                shellPos.y + dir.y,
                shellPos.z + dir.z
            )
            
            // 检测与目标碰撞
            if (targets && targets.length > 0) {
                for (const target of targets) {
                    if (target.health <= 0) continue
                    
                    const dx = shellPos.x - target.pos[0]
                    const dy = shellPos.y - (target.pos[1] + target.size[1] / 2)
                    const dz = shellPos.z - target.pos[2]
                    
                    // 检查是否在目标边界框内（扩大检测范围，确保能命中）
                    const halfX = target.size[0] / 2 + 2  // 增加2米容差
                    const halfY = target.size[1] / 2 + 2
                    const halfZ = target.size[2] / 2 + 2
                    
                    if (Math.abs(dx) < halfX && 
                        Math.abs(dy) < halfY && 
                        Math.abs(dz) < halfZ) {
                        // 碰撞！在目标中心爆炸
                        console.log(`🎯 炮弹直接命中目标 ${target.id}！位置:`, shellPos, '目标位置:', target.pos)
                        onExplode([target.pos[0], target.pos[1] + target.size[1] / 2, target.pos[2]])
                        onRemove()
                        return
                    }
                }
            }
            
            // 碰到地面 - 触发爆炸
            if (shellPos.y < 0.5) {
                console.log('💥 炮弹落地爆炸！位置:', [shellPos.x, 0.5, shellPos.z])
                onExplode([
                    shellPos.x,
                    0.5,
                    shellPos.z
                ])
                onRemove()
                return
            }
            
            // 超时移除
            if (Date.now() - startTime.current > 15000) {
                onExplode([shellPos.x, shellPos.y, shellPos.z])
                onRemove()
            }
        }
    })
    
    return (
        <group>
            {/* 炮弹主体 */}
            <mesh ref={ref} position={position}>
                <cylinderGeometry args={[0.15, 0.1, 0.8, 8]} />
                <meshStandardMaterial 
                    color="#444444" 
                    metalness={0.8}
                    roughness={0.3}
                />
            </mesh>
            {/* 炮弹尾焰 */}
            <mesh ref={trailRef} position={trail}>
                <sphereGeometry args={[0.3, 8, 8]} />
                <meshStandardMaterial 
                    color="#ff6600" 
                    emissive="#ff3300" 
                    emissiveIntensity={3} 
                    transparent 
                    opacity={0.7} 
                />
            </mesh>
            {/* 烟迹 */}
            <mesh position={[
                trail[0] - velocity.current.x * 3,
                trail[1] - velocity.current.y * 3,
                trail[2] - velocity.current.z * 3
            ]}>
                <sphereGeometry args={[0.2, 6, 6]} />
                <meshStandardMaterial 
                    color="#888888" 
                    transparent 
                    opacity={0.4} 
                />
            </mesh>
        </group>
    )
}

// 自定义坦克模型（带可旋转炮塔）- 根据类型显示不同外观
function CustomTank({ turretRotation, cannonElevation, tankType }: { 
    turretRotation: number
    cannonElevation: number
    tankType: string 
}) {
    const stats = TANK_STATS[tankType] || TANK_STATS.type99
    const { color, accentColor } = stats
    
    // 根据坦克类型调整尺寸
    const scale = tankType === 'type15' ? 0.85 : tankType === 'type59' ? 0.95 : 1
    const bodyLength = tankType === 'type15' ? 4.5 : tankType === 'type59' ? 5.5 : 5
    const turretSize = tankType === 'type15' ? 0.9 : tankType === 'type59' ? 1.1 : 1
    const cannonLength = tankType === 'type99' ? 5 : tankType === 'type15' ? 4 : 4.2
    
    return (
        <group scale={[scale, scale, scale]}>
            {/* 车体 */}
            <Box args={[3.5, 1, bodyLength]} position={[0, 0.7, 0]}>
                <meshStandardMaterial color={color} metalness={0.5} roughness={0.6} />
            </Box>
            {/* 车体斜面装甲 - 99式有更明显的楔形装甲 */}
            <Box args={[3.5, tankType === 'type99' ? 1 : 0.6, 1.5]} position={[0, 1.1, bodyLength/2]} rotation={[-0.4, 0, 0]}>
                <meshStandardMaterial color={accentColor} metalness={0.5} roughness={0.6} />
            </Box>
            
            {/* 59式特有的圆形炮塔底座 */}
            {tankType === 'type59' && (
                <Cylinder args={[1.5, 1.5, 0.3, 16]} position={[0, 1.3, 0]}>
                    <meshStandardMaterial color={accentColor} metalness={0.6} />
                </Cylinder>
            )}
            
            {/* 履带 */}
            <Box args={[0.6, 0.8, bodyLength + 0.5]} position={[-2, 0.4, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
            </Box>
            <Box args={[0.6, 0.8, bodyLength + 0.5]} position={[2, 0.4, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
            </Box>
            
            {/* 负重轮 - 15式轮子更小更多 */}
            {(tankType === 'type15' ? [-2.2, -1.3, -0.4, 0.4, 1.3, 2.2] : [-2, -1, 0, 1, 2]).map((z, i) => (
                <group key={i}>
                    <Cylinder args={[tankType === 'type15' ? 0.28 : 0.35, tankType === 'type15' ? 0.28 : 0.35, 0.3, 12]} rotation={[0, 0, Math.PI/2]} position={[-2, 0.4, z]}>
                        <meshStandardMaterial color="#2a2a2a" metalness={0.7} />
                    </Cylinder>
                    <Cylinder args={[tankType === 'type15' ? 0.28 : 0.35, tankType === 'type15' ? 0.28 : 0.35, 0.3, 12]} rotation={[0, 0, Math.PI/2]} position={[2, 0.4, z]}>
                        <meshStandardMaterial color="#2a2a2a" metalness={0.7} />
                    </Cylinder>
                </group>
            ))}
            
            {/* 15式特有的侧裙板 */}
            {tankType === 'type15' && (
                <>
                    <Box args={[0.1, 0.5, 4]} position={[-2.4, 0.6, 0]}>
                        <meshStandardMaterial color={accentColor} metalness={0.4} />
                    </Box>
                    <Box args={[0.1, 0.5, 4]} position={[2.4, 0.6, 0]}>
                        <meshStandardMaterial color={accentColor} metalness={0.4} />
                    </Box>
                </>
            )}
            
            {/* 可旋转炮塔 */}
            <group rotation={[0, turretRotation, 0]} position={[0, 1.5, -0.3]}>
                {/* 炮塔主体 - 不同形状 */}
                {tankType === 'type59' ? (
                    // 59式半球形炮塔
                    <Sphere args={[1.3 * turretSize, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} position={[0, 0.2, 0]}>
                        <meshStandardMaterial color={color} metalness={0.5} roughness={0.5} />
                    </Sphere>
                ) : tankType === 'type15' ? (
                    // 15式扁平楔形炮塔
                    <Box args={[2.2 * turretSize, 0.6, 2.5]} position={[0, 0.3, 0]}>
                        <meshStandardMaterial color={color} metalness={0.5} roughness={0.5} />
                    </Box>
                ) : (
                    // 99式棱角分明的炮塔
                    <>
                        <Box args={[2.5 * turretSize, 0.8, 2.8]} position={[0, 0.4, 0]}>
                            <meshStandardMaterial color={color} metalness={0.5} roughness={0.5} />
                        </Box>
                        {/* 99式爆反装甲块 */}
                        {[-0.8, 0, 0.8].map((x, i) => (
                            <Box key={i} args={[0.4, 0.15, 0.6]} position={[x, 0.9, 1.2]}>
                                <meshStandardMaterial color="#2a3a2a" metalness={0.3} />
                            </Box>
                        ))}
                    </>
                )}
                
                {/* 炮塔顶部 */}
                <Cylinder args={[0.8 * turretSize, 1 * turretSize, 0.4, 8]} position={[0, 0.8, 0]}>
                    <meshStandardMaterial color={accentColor} metalness={0.5} roughness={0.5} />
                </Cylinder>
                
                {/* 指挥塔 */}
                <Cylinder args={[0.25, 0.25, 0.35, 8]} position={[0.5, 1.1, -0.3]}>
                    <meshStandardMaterial color={accentColor} metalness={0.6} />
                </Cylinder>
                
                {/* 炮管组（可俯仰）- 正值向上，负值向下 */}
                <group rotation={[-cannonElevation, 0, 0]} position={[0, 0.5, 1.2]}>
                    {/* 炮管 - 99式更长更粗 */}
                    <Cylinder args={[
                        tankType === 'type99' ? 0.16 : 0.13, 
                        tankType === 'type99' ? 0.19 : 0.15, 
                        cannonLength, 
                        12
                    ]} rotation={[Math.PI/2, 0, 0]} position={[0, 0, cannonLength/2]}>
                        <meshStandardMaterial color={accentColor} metalness={0.7} roughness={0.3} />
                    </Cylinder>
                    {/* 炮口制退器 */}
                    <Cylinder args={[
                        tankType === 'type99' ? 0.24 : 0.18, 
                        tankType === 'type99' ? 0.24 : 0.18, 
                        tankType === 'type99' ? 0.5 : 0.35, 
                        12
                    ]} rotation={[Math.PI/2, 0, 0]} position={[0, 0, cannonLength + 0.2]}>
                        <meshStandardMaterial color="#1a2a1a" metalness={0.8} roughness={0.2} />
                    </Cylinder>
                    {/* 防盾 */}
                    <Box args={[0.7, 0.5, 0.25]} position={[0, 0, 0.15]}>
                        <meshStandardMaterial color={color} metalness={0.5} />
                    </Box>
                </group>
                
                {/* 99式特有的激光测距仪 */}
                {tankType === 'type99' && (
                    <Box args={[0.3, 0.2, 0.4]} position={[-0.9, 0.7, 0.8]}>
                        <meshStandardMaterial color="#1a1a1a" metalness={0.8} />
                    </Box>
                )}
            </group>
            
            {/* 坦克编号标识 */}
            <Box args={[0.8, 0.4, 0.05]} position={[0, 0.8, -bodyLength/2 - 0.03]}>
                <meshStandardMaterial 
                    color={tankType === 'type99' ? '#cc0000' : tankType === 'type15' ? '#0066cc' : '#ccaa00'} 
                    emissive={tankType === 'type99' ? '#660000' : tankType === 'type15' ? '#003366' : '#665500'}
                    emissiveIntensity={0.3}
                />
            </Box>
        </group>
    )
}

// 坦克驾驶模式
function TankControlMode({ 
    equipment, 
    onExit,
    onHUDUpdate,
    onMouseUpdate,
    onDamage,
    destructibleObjects
}: { 
    equipment: EquipmentConfig
    onExit: () => void
    onHUDUpdate: (state: Partial<HUDState>) => void
    onMouseUpdate: (x: number, y: number) => void
    onDamage?: (position: [number, number, number], damage: number, radius: number) => void
    destructibleObjects?: Map<string, DestructibleObject>
}) {
    const tankRef = useRef<THREE.Group>(null)
    const { camera, size } = useThree()
    
    const [projectiles, setProjectiles] = useState<{id: number, pos: [number, number, number], dir: THREE.Vector3, isShell?: boolean}[]>([])
    const [explosions, setExplosions] = useState<{id: number, pos: [number, number, number]}[]>([])
    const explosionId = useRef(0)
    
    // 获取坦克属性
    const tankStats = TANK_STATS[equipment.id] || TANK_STATS.type99
    
    const speedRef = useRef(0)
    const ammoRef = useRef(tankStats.ammo)
    const isReloadingRef = useRef(false)
    const turretRotRef = useRef(0)
    const cannonElevRef = useRef(0)
    const mousePos = useRef({ x: size.width / 2, y: size.height / 2 })
    
    const keys = useRef({ w: false, a: false, s: false, d: false, space: false })
    const projectileId = useRef(0)
    const fireShot = useRef(0)
    
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const k = e.key.toLowerCase()
            if (k === 'w') keys.current.w = true
            if (k === 'a') keys.current.a = true
            if (k === 's') keys.current.s = true
            if (k === 'd') keys.current.d = true
            if (e.code === 'Space') {
                keys.current.space = true
                e.preventDefault()
            }
            if (k === 'r' && !isReloadingRef.current && ammoRef.current < tankStats.ammo) {
                isReloadingRef.current = true
                onHUDUpdate({ isReloading: true })
                message.loading(`装弹中... (${tankStats.reloadTime/1000}秒)`)
                setTimeout(() => {
                    ammoRef.current = tankStats.ammo
                    isReloadingRef.current = false
                    onHUDUpdate({ ammo: tankStats.ammo, maxAmmo: tankStats.ammo, isReloading: false })
                    message.success('装弹完成！')
                }, tankStats.reloadTime)
            }
            if (e.key === 'Escape') onExit()
        }
        
        const handleKeyUp = (e: KeyboardEvent) => {
            const k = e.key.toLowerCase()
            if (k === 'w') keys.current.w = false
            if (k === 'a') keys.current.a = false
            if (k === 's') keys.current.s = false
            if (k === 'd') keys.current.d = false
            if (e.code === 'Space') keys.current.space = false
        }
        
        const handleMouseMove = (e: MouseEvent) => {
            // 鼠标位置 - 准星跟随鼠标
            mousePos.current.x = e.clientX
            mousePos.current.y = e.clientY
            onMouseUpdate(e.clientX, e.clientY)
        }
        
        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)
        window.addEventListener('mousemove', handleMouseMove)
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
            window.removeEventListener('mousemove', handleMouseMove)
        }
    }, [onExit, onHUDUpdate, onMouseUpdate])
    
    // HUD更新节流
    const lastHUDUpdate = useRef(0)
    
    useFrame((_, delta) => {
        if (!tankRef.current) return
        
        // 根据坦克类型调整速度
        const maxSpeed = tankStats.speed
        const moveSpeed = (maxSpeed / 50) * delta * 8
        const rotationSpeed = (tankStats.speed > 60 ? 2.5 : 1.8) * delta
        
        // 移动
        if (keys.current.w) {
            tankRef.current.position.x += Math.sin(tankRef.current.rotation.y) * moveSpeed
            tankRef.current.position.z += Math.cos(tankRef.current.rotation.y) * moveSpeed
            speedRef.current = maxSpeed
        } else if (keys.current.s) {
            tankRef.current.position.x -= Math.sin(tankRef.current.rotation.y) * moveSpeed * 0.5
            tankRef.current.position.z -= Math.cos(tankRef.current.rotation.y) * moveSpeed * 0.5
            speedRef.current = -maxSpeed * 0.4
        } else {
            speedRef.current = 0
        }
        
        // A/D 控制车体转向
        if (keys.current.a) tankRef.current.rotation.y += rotationSpeed
        if (keys.current.d) tankRef.current.rotation.y -= rotationSpeed
        
        // 根据鼠标位置计算炮塔瞄准角度
        const tankPos = tankRef.current.position
        const tankRotY = tankRef.current.rotation.y
        
        // 将屏幕鼠标位置转换为相对于屏幕中心的偏移
        const screenCenterX = size.width / 2
        const screenCenterY = size.height / 2
        const mouseOffsetX = (mousePos.current.x - screenCenterX) / screenCenterX // -1 到 1
        const mouseOffsetY = (mousePos.current.y - screenCenterY) / screenCenterY // -1 到 1
        
        // 炮塔水平旋转（相对于车体）- 反转方向
        const targetTurretRot = -mouseOffsetX * Math.PI * 0.5 // 最大旋转90度
        turretRotRef.current += (targetTurretRot - turretRotRef.current) * 0.15 // 平滑过渡
        
        // 炮管俯仰角 - 鼠标上移炮管抬起（正角度），下移炮管下压（负角度）
        // 反转mouseOffsetY：屏幕Y轴向下为正，但炮管向上为正
        const targetCannonElev = -mouseOffsetY * 0.25 // 上下15度左右
        cannonElevRef.current += (targetCannonElev - cannonElevRef.current) * 0.15 // 平滑过渡
        cannonElevRef.current = Math.max(-0.15, Math.min(0.25, cannonElevRef.current)) // 向上最大0.25，向下最大-0.15
        
        // 开火 - 从炮管前端发射（射击间隔根据坦克类型不同）
        if (keys.current.space && ammoRef.current > 0 && !isReloadingRef.current && Date.now() - fireShot.current > tankStats.fireRate) {
            fireShot.current = Date.now()
            ammoRef.current -= 1
            onHUDUpdate({ ammo: ammoRef.current })
            
            const fireAngle = tankRotY + turretRotRef.current
            // 炮管俯仰角：正值=向上，负值=向下
            const elevAngle = cannonElevRef.current
            
            const dir = new THREE.Vector3(
                Math.sin(fireAngle) * Math.cos(elevAngle),
                Math.sin(elevAngle),
                Math.cos(fireAngle) * Math.cos(elevAngle)
            ).normalize()
            
            // 炮弹从炮管前端发射
            const muzzleDistance = 6
            setProjectiles(prev => [...prev, {
                id: projectileId.current++,
                pos: [
                    tankPos.x + Math.sin(fireAngle) * muzzleDistance, 
                    tankPos.y + 2.2 + Math.sin(elevAngle) * 2, 
                    tankPos.z + Math.cos(fireAngle) * muzzleDistance
                ],
                dir,
                isShell: true
            }])
            message.info('💥 开火！')
        }
        
        // 相机固定在坦克后方，不跟随炮塔
        camera.position.x = tankPos.x - Math.sin(tankRotY) * 14
        camera.position.z = tankPos.z - Math.cos(tankRotY) * 14
        camera.position.y = tankPos.y + 6
        camera.lookAt(tankPos.x, tankPos.y + 2, tankPos.z)
        camera.up.set(0, 1, 0)
        
        // 定期更新HUD（每100ms）
        if (Date.now() - lastHUDUpdate.current > 100) {
            lastHUDUpdate.current = Date.now()
            onHUDUpdate({ 
                speed: speedRef.current,
                turretAngle: turretRotRef.current,
                cannonAngle: cannonElevRef.current,
                damage: tankStats.damage,
                armor: tankStats.armor,
                explosionRadius: tankStats.explosionRadius,
                maxSpeed: tankStats.speed
            })
        }
    })
    
    return (
        <>
            <group ref={tankRef} position={[0, 0, 0]}>
                <CustomTank turretRotation={turretRotRef.current} cannonElevation={cannonElevRef.current} tankType={equipment.id} />
            </group>
            
            {/* 炮弹 */}
            {projectiles.map(p => (
                <Projectile 
                    key={p.id}
                    position={p.pos}
                    direction={p.dir}
                    speed={tankStats.shellSpeed}
                    isShell={p.isShell}
                    targets={destructibleObjects ? Array.from(destructibleObjects.values()).map(obj => ({
                        id: obj.id,
                        position: obj.position,
                        health: obj.health,
                        type: obj.type
                    })) : []}
                    onRemove={() => setProjectiles(prev => prev.filter(pp => pp.id !== p.id))}
                    onExplode={(pos) => {
                        setExplosions(prev => [...prev, { id: explosionId.current++, pos }])
                        message.success(`爆炸! 伤害: ${tankStats.damage} | 范围: ${tankStats.explosionRadius}m`)
                    }}
                />
            ))}
            
            {/* 爆炸效果 */}
            {explosions.map(e => (
                <Explosion 
                    key={e.id}
                    position={e.pos}
                    damage={tankStats.damage}
                    radius={tankStats.explosionRadius}
                    onDamage={onDamage}
                    onComplete={() => setExplosions(prev => prev.filter(ee => ee.id !== e.id))}
                />
            ))}
            
        </>
    )
}

// 自定义枪械模型
function CustomRifle() {
    return (
        <group>
            {/* 枪身 */}
            <Box args={[0.08, 0.12, 0.8]} position={[0, 0, 0]}>
                <meshStandardMaterial color="#2d2d2d" metalness={0.7} roughness={0.3} />
            </Box>
            {/* 枪管 */}
            <Cylinder args={[0.02, 0.025, 0.5, 8]} rotation={[Math.PI/2, 0, 0]} position={[0, 0.02, 0.6]}>
                <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
            </Cylinder>
            {/* 弹匣 */}
            <Box args={[0.06, 0.2, 0.12]} position={[0, -0.15, -0.1]}>
                <meshStandardMaterial color="#3d3d3d" metalness={0.6} />
            </Box>
            {/* 握把 */}
            <Box args={[0.06, 0.15, 0.08]} position={[0, -0.12, -0.25]} rotation={[0.3, 0, 0]}>
                <meshStandardMaterial color="#4a3a2a" roughness={0.8} />
            </Box>
            {/* 枪托 */}
            <Box args={[0.06, 0.1, 0.25]} position={[0, -0.02, -0.5]}>
                <meshStandardMaterial color="#3d3d3d" metalness={0.5} />
            </Box>
            {/* 瞄准镜 */}
            <Cylinder args={[0.025, 0.025, 0.15, 8]} rotation={[0, 0, Math.PI/2]} position={[0, 0.1, 0.1]}>
                <meshStandardMaterial color="#1a1a1a" metalness={0.9} />
            </Cylinder>
            {/* 准星 */}
            <Box args={[0.01, 0.04, 0.01]} position={[0, 0.08, 0.35]}>
                <meshStandardMaterial color="#ff6600" emissive="#ff3300" emissiveIntensity={0.5} />
            </Box>
        </group>
    )
}

// 枪械射击模式
function WeaponControlMode({ 
    equipment, 
    onExit,
    onHUDUpdate,
    onDamage,
    onMouseUpdate
}: { 
    equipment: EquipmentConfig
    onExit: () => void
    onHUDUpdate: (state: Partial<HUDState>) => void
    onDamage?: (position: [number, number, number], damage: number, radius: number) => void
    onMouseUpdate?: (x: number, y: number) => void
}) {
    const weaponRef = useRef<THREE.Group>(null)
    const playerRef = useRef({ x: 0, y: 1.7, z: 0 })
    const { camera } = useThree()
    
    // 获取武器属性
    const weaponStats = WEAPON_STATS[equipment.id] || WEAPON_STATS.type56
    
    const ammoRef = useRef(weaponStats.ammo)
    const isReloadingRef = useRef(false)
    const [isAiming, setIsAiming] = useState(false)
    const mousePosRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
    const [projectiles, setProjectiles] = useState<{id: number, pos: [number, number, number], dir: THREE.Vector3, damage: number}[]>([])
    
    const projectileId = useRef(0)
    const cameraRot = useRef({ x: 0, y: 0 })
    const keys = useRef({ w: false, a: false, s: false, d: false })
    const lastFire = useRef(0)
    const hudUpdateFrameCount = useRef(0)
    const isFiring = useRef(false)
    const lastPosition = useRef({ x: 0, y: 1.7, z: 0 })
    const currentSpeed = useRef(0)
    
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const k = e.key.toLowerCase()
            if (k === 'w') keys.current.w = true
            if (k === 'a') keys.current.a = true
            if (k === 's') keys.current.s = true
            if (k === 'd') keys.current.d = true
            if (k === 'r' && !isReloadingRef.current && ammoRef.current < weaponStats.ammo) {
                isReloadingRef.current = true
                onHUDUpdate({ isReloading: true })
                message.loading('换弹中...')
                setTimeout(() => {
                    ammoRef.current = weaponStats.ammo
                    isReloadingRef.current = false
                    onHUDUpdate({ ammo: weaponStats.ammo, isReloading: false })
                    message.success('换弹完成！')
                }, weaponStats.reloadTime)
            }
            if (e.key === 'Escape') onExit()
        }
        
        const handleKeyUp = (e: KeyboardEvent) => {
            const k = e.key.toLowerCase()
            if (k === 'w') keys.current.w = false
            if (k === 'a') keys.current.a = false
            if (k === 's') keys.current.s = false
            if (k === 'd') keys.current.d = false
        }
        
        const handleMouseMove = (e: MouseEvent) => {
            mousePosRef.current = { x: e.clientX, y: e.clientY }
            if (onMouseUpdate) {
                onMouseUpdate(e.clientX, e.clientY)
            }
            
            if (isAiming) return
            
            const mouseSensitivity = 0.008
            if (e.movementX !== undefined && e.movementY !== undefined) {
                cameraRot.current.y -= e.movementX * mouseSensitivity
                cameraRot.current.x -= e.movementY * mouseSensitivity
                cameraRot.current.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, cameraRot.current.x))
            }
        }
        
        const handleMouseDown = (e: MouseEvent) => {
            if (e.button === 0) {
                e.preventDefault()
                e.stopPropagation()
                isFiring.current = true
            } else if (e.button === 2) {
                e.preventDefault()
                e.stopPropagation()
                setIsAiming(true)
            }
        }
        
        const handleMouseUp = (e: MouseEvent) => {
            if (e.button === 0) {
                isFiring.current = false
            } else if (e.button === 2) {
                setIsAiming(false)
            }
        }
        
        const handleContextMenu = (e: MouseEvent) => e.preventDefault()
        
        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)
        window.addEventListener('mousemove', handleMouseMove, { passive: true })
        window.addEventListener('mousedown', handleMouseDown, { capture: true })
        window.addEventListener('mouseup', handleMouseUp, { capture: true })
        window.addEventListener('contextmenu', handleContextMenu)
        
        const canvas = document.querySelector('canvas')
        const handleCanvasClick = () => {
            if (canvas && document.pointerLockElement !== canvas) {
                canvas.requestPointerLock().catch(() => {
                    message.info('请点击画面以启用鼠标控制', 2)
                })
            }
        }
        
        if (canvas) {
            canvas.addEventListener('mousedown', handleMouseDown, { capture: true })
            canvas.addEventListener('mouseup', handleMouseUp, { capture: true })
            canvas.addEventListener('click', handleCanvasClick)
        }
        
        document.body.style.cursor = 'none'
        
        // 初始化HUD
        onHUDUpdate({
            speed: 0,
            equipmentType: equipment.type,
            ammo: weaponStats.ammo,
            maxAmmo: weaponStats.ammo,
            damage: weaponStats.damage,
            range: weaponStats.range,
            accuracy: weaponStats.accuracy,
            penetration: weaponStats.penetration
        })
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mousedown', handleMouseDown)
            window.removeEventListener('mouseup', handleMouseUp)
            window.removeEventListener('contextmenu', handleContextMenu)
            if (canvas) {
                canvas.removeEventListener('mousedown', handleMouseDown)
                canvas.removeEventListener('mouseup', handleMouseUp)
                canvas.removeEventListener('click', handleCanvasClick)
            }
            document.exitPointerLock()
            document.body.style.cursor = 'default'
        }
    }, [weaponStats, onExit, onHUDUpdate, equipment.type])
    
    useFrame((_, delta) => {
        const moveSpeed = 5 * delta
        const yaw = cameraRot.current.y
        
        // 连续射击
        if (isFiring.current) {
            const now = Date.now()
            const canFire = ammoRef.current > 0 && !isReloadingRef.current && (now - lastFire.current) >= weaponStats.fireRate
            
            if (canFire) {
                lastFire.current = now
                ammoRef.current -= 1
                
                const raycaster = new THREE.Raycaster()
                raycaster.setFromCamera(new THREE.Vector2(0, 0), camera)
                let dir = raycaster.ray.direction.clone()
                
                const spread = (1 - weaponStats.accuracy) * 0.1
                const right = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 1, 0)).normalize()
                const up = new THREE.Vector3().crossVectors(right, dir).normalize()
                dir.add(right.multiplyScalar((Math.random() - 0.5) * spread))
                dir.add(up.multiplyScalar((Math.random() - 0.5) * spread))
                dir.normalize()
                
                const firePos: [number, number, number] = [
                    playerRef.current.x + dir.x * 0.5,
                    playerRef.current.y + dir.y * 0.5,
                    playerRef.current.z + dir.z * 0.5
                ]
                
                setProjectiles(prev => {
                    const newProjectiles = [...prev, {
                        id: projectileId.current++,
                        pos: firePos,
                        dir,
                        damage: weaponStats.damage
                    }]
                    return newProjectiles.slice(-20)
                })
            } else if (ammoRef.current === 0) {
                isFiring.current = false
            }
        }
        
        // WASD移动 - 修正方向
        // W向前：沿当前朝向移动
        if (keys.current.w) {
            playerRef.current.x -= Math.sin(yaw) * moveSpeed
            playerRef.current.z -= Math.cos(yaw) * moveSpeed
        }
        // S向后：沿当前朝向的反方向移动
        if (keys.current.s) {
            playerRef.current.x += Math.sin(yaw) * moveSpeed
            playerRef.current.z += Math.cos(yaw) * moveSpeed
        }
        // A向左：垂直于当前朝向的左侧
        if (keys.current.a) {
            playerRef.current.x -= Math.cos(yaw) * moveSpeed
            playerRef.current.z += Math.sin(yaw) * moveSpeed
        }
        // D向右：垂直于当前朝向的右侧
        if (keys.current.d) {
            playerRef.current.x += Math.cos(yaw) * moveSpeed
            playerRef.current.z -= Math.sin(yaw) * moveSpeed
        }
        
        // 计算速度（km/h）- 平滑处理
        const dx = playerRef.current.x - lastPosition.current.x
        const dy = playerRef.current.y - lastPosition.current.y
        const dz = playerRef.current.z - lastPosition.current.z
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)
        const newSpeed = (distance / delta) * 3.6 // 转换为km/h
        // 平滑速度变化，避免闪烁
        currentSpeed.current = currentSpeed.current * 0.7 + newSpeed * 0.3
        lastPosition.current = { ...playerRef.current }
        
        // 相机位置和朝向
        camera.position.set(playerRef.current.x, playerRef.current.y, playerRef.current.z)
        camera.rotation.order = 'YXZ'
        camera.rotation.y = cameraRot.current.y
        camera.rotation.x = cameraRot.current.x
        
        // 枪械跟随相机
        if (weaponRef.current) {
            weaponRef.current.position.set(
                playerRef.current.x + Math.sin(yaw) * 0.3 + Math.cos(yaw) * (isAiming ? 0 : 0.15),
                playerRef.current.y - 0.15,
                playerRef.current.z + Math.cos(yaw) * 0.3 - Math.sin(yaw) * (isAiming ? 0 : 0.15)
            )
            weaponRef.current.rotation.set(cameraRot.current.x, cameraRot.current.y, 0)
        }
        
        if (onMouseUpdate) {
            onMouseUpdate(mousePosRef.current.x, mousePosRef.current.y)
        }
        
        // 每2帧更新一次，平衡性能和稳定性
        hudUpdateFrameCount.current++
        if (hudUpdateFrameCount.current % 2 === 0) {
            onHUDUpdate({
                speed: currentSpeed.current,
                ammo: ammoRef.current,
                isReloading: isReloadingRef.current,
                isAiming: isAiming,
                pitchAngle: cameraRot.current.x,
                yawAngle: cameraRot.current.y
            })
        }
        
        // 更新子弹 - 优化性能
        setProjectiles(prev => {
            if (prev.length === 0) return prev
            
            const speed = weaponStats.bulletSpeed * delta * 60
            const rangeSq = weaponStats.range * weaponStats.range
            const playerX = playerRef.current.x
            const playerY = playerRef.current.y
            const playerZ = playerRef.current.z
            
            return prev.map(p => {
                const newPos: [number, number, number] = [
                    p.pos[0] + p.dir.x * speed,
                    p.pos[1] + p.dir.y * speed,
                    p.pos[2] + p.dir.z * speed
                ]
                
                // 检测地面碰撞
                if (newPos[1] <= 0) {
                    if (onDamage) onDamage(newPos, p.damage, 0.3)
                    return null
                }
                
                // 检测超出射程（使用平方距离避免开方运算）
                const dx = newPos[0] - playerX
                const dy = newPos[1] - playerY
                const dz = newPos[2] - playerZ
                const distanceSq = dx * dx + dy * dy + dz * dz
                if (distanceSq > rangeSq) {
                    return null
                }
                
                // 每20帧检测一次碰撞，优化性能
                const frameCount = (p as any).frameCount || 0
                if (frameCount % 20 === 0 && onDamage) {
                    onDamage(newPos, p.damage, 0.5)
                }
                (p as any).frameCount = frameCount + 1
                
                return { ...p, pos: newPos }
            }).filter((p): p is typeof prev[0] => p !== null)
        })
    })
    
    return (
        <>
            <group ref={weaponRef}>
                <CustomRifle />
            </group>
            
            {/* 子弹 */}
            {projectiles.map(p => (
                <Projectile 
                    key={p.id}
                    position={p.pos}
                    direction={p.dir}
                    speed={weaponStats.bulletSpeed}
                    isShell={false}
                    onRemove={() => setProjectiles(prev => prev.filter(pp => pp.id !== p.id))}
                />
            ))}
            
            {/* 靶子 - 减少数量优化性能 */}
            {[[0, 1.5, 20], [-8, 1.5, 25], [8, 1.5, 25]].map((pos, i) => (
                <group key={i} position={pos as [number, number, number]}>
                    <Cylinder args={[1, 1, 0.1, 12]} rotation={[Math.PI / 2, 0, 0]}>
                        <meshStandardMaterial color="#fff" />
                    </Cylinder>
                    <Cylinder args={[0.7, 0.7, 0.11, 12]} rotation={[Math.PI / 2, 0, 0]}>
                        <meshStandardMaterial color="#ff0000" />
                    </Cylinder>
                    <Cylinder args={[0.4, 0.4, 0.12, 12]} rotation={[Math.PI / 2, 0, 0]}>
                        <meshStandardMaterial color="#fff" />
                    </Cylinder>
                    <Cylinder args={[0.15, 0.15, 0.13, 12]} rotation={[Math.PI / 2, 0, 0]}>
                        <meshStandardMaterial color="#ff0000" />
                    </Cylinder>
                    {/* 靶架 */}
                    <Box args={[0.1, 2, 0.1]} position={[0, -1, 0]}>
                        <meshStandardMaterial color="#5d4037" />
                    </Box>
                </group>
            ))}
            
        </>
    )
}

// 战斗机驾驶模式
// 歼-20战斗机模型（黑色隐身）
function J20Model() {
    return (
        <group scale={[1.2, 1.2, 1.2]}>
            {/* 机身 */}
            <Box args={[6, 0.6, 0.8]} position={[0, 0, 0]}>
                <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
            </Box>
            {/* 机头 */}
            <Box args={[2, 0.5, 0.7]} position={[-3.5, 0, 0]} rotation={[0, 0, 0.05]}>
                <meshStandardMaterial color="#0a0a0a" metalness={0.95} roughness={0.1} />
            </Box>
            {/* 座舱 */}
            <Box args={[1.2, 0.4, 0.6]} position={[-1.5, 0.4, 0]}>
                <meshStandardMaterial color="#1e90ff" transparent opacity={0.4} />
            </Box>
            {/* 主翼 */}
            <Box args={[2, 0.08, 5]} position={[0.5, 0, 0]}>
                <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
            </Box>
            {/* 鸭翼 */}
            <Box args={[0.8, 0.05, 1.8]} position={[-2.5, 0.1, 0]}>
                <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
            </Box>
            {/* 垂尾 */}
            <Box args={[1.5, 1, 0.1]} position={[2.5, 0.5, 0.8]}>
                <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
            </Box>
            <Box args={[1.5, 1, 0.1]} position={[2.5, 0.5, -0.8]}>
                <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
            </Box>
            {/* 发动机喷口 */}
            <Cylinder args={[0.25, 0.2, 0.8, 12]} rotation={[0, 0, Math.PI/2]} position={[3.2, 0, 0.4]}>
                <meshStandardMaterial color="#ff4500" emissive="#ff2200" emissiveIntensity={0.5} />
            </Cylinder>
            <Cylinder args={[0.25, 0.2, 0.8, 12]} rotation={[0, 0, Math.PI/2]} position={[3.2, 0, -0.4]}>
                <meshStandardMaterial color="#ff4500" emissive="#ff2200" emissiveIntensity={0.5} />
            </Cylinder>
        </group>
    )
}

// 歼-10战斗机模型（银灰色）
function J10Model() {
    return (
        <group scale={[1, 1, 1]}>
            {/* 机身 */}
            <Box args={[5, 0.7, 0.9]} position={[0, 0, 0]}>
                <meshStandardMaterial color="#708090" metalness={0.8} roughness={0.3} />
            </Box>
            {/* 机头 */}
            <Cylinder args={[0.35, 0.2, 2, 12]} rotation={[0, 0, -Math.PI/2]} position={[-3, 0, 0]}>
                <meshStandardMaterial color="#505050" metalness={0.9} roughness={0.2} />
            </Cylinder>
            {/* 进气道 */}
            <Box args={[1.5, 0.6, 1.2]} position={[-1, -0.3, 0]}>
                <meshStandardMaterial color="#404040" metalness={0.7} roughness={0.4} />
            </Box>
            {/* 座舱 */}
            <Box args={[1, 0.5, 0.7]} position={[-1.2, 0.5, 0]}>
                <meshStandardMaterial color="#87ceeb" transparent opacity={0.5} />
            </Box>
            {/* 三角翼 */}
            <Box args={[3, 0.06, 4]} position={[0.5, 0, 0]}>
                <meshStandardMaterial color="#708090" metalness={0.8} roughness={0.3} />
            </Box>
            {/* 鸭翼 */}
            <Box args={[0.6, 0.04, 1.5]} position={[-2, 0.15, 0]}>
                <meshStandardMaterial color="#708090" metalness={0.8} roughness={0.3} />
            </Box>
            {/* 垂尾 */}
            <Box args={[1.2, 1.2, 0.08]} position={[2, 0.6, 0]}>
                <meshStandardMaterial color="#708090" metalness={0.8} roughness={0.3} />
            </Box>
            {/* 发动机 */}
            <Cylinder args={[0.35, 0.3, 1, 12]} rotation={[0, 0, Math.PI/2]} position={[2.8, 0, 0]}>
                <meshStandardMaterial color="#ff6600" emissive="#ff4400" emissiveIntensity={0.6} />
            </Cylinder>
        </group>
    )
}

// 彩虹-5无人机模型（白灰色）
function DroneModel() {
    return (
        <group scale={[1.5, 1.5, 1.5]}>
            {/* 细长机身 */}
            <Box args={[4, 0.35, 0.4]} position={[0, 0, 0]}>
                <meshStandardMaterial color="#e0e0e0" metalness={0.5} roughness={0.5} />
            </Box>
            {/* 机头（圆润） */}
            <Sphere args={[0.25, 12, 12]} position={[-2.2, 0, 0]} scale={[1.5, 1, 1]}>
                <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
            </Sphere>
            {/* 大展弦比机翼 */}
            <Box args={[0.8, 0.04, 6]} position={[-0.3, 0.1, 0]}>
                <meshStandardMaterial color="#d0d0d0" metalness={0.5} roughness={0.5} />
            </Box>
            {/* V尾 */}
            <Box args={[0.6, 0.5, 0.06]} position={[1.8, 0.25, 0.4]} rotation={[0.3, 0, 0]}>
                <meshStandardMaterial color="#e0e0e0" metalness={0.5} roughness={0.5} />
            </Box>
            <Box args={[0.6, 0.5, 0.06]} position={[1.8, 0.25, -0.4]} rotation={[-0.3, 0, 0]}>
                <meshStandardMaterial color="#e0e0e0" metalness={0.5} roughness={0.5} />
            </Box>
            {/* 螺旋桨 */}
            <Cylinder args={[0.08, 0.08, 0.3, 8]} rotation={[0, 0, Math.PI/2]} position={[2.2, 0, 0]}>
                <meshStandardMaterial color="#333333" />
            </Cylinder>
            <Box args={[0.05, 0.02, 1]} position={[2.35, 0, 0]}>
                <meshStandardMaterial color="#666666" />
            </Box>
            {/* 挂载点 */}
            <Cylinder args={[0.08, 0.08, 0.4, 8]} position={[-0.3, -0.25, 1.5]}>
                <meshStandardMaterial color="#555555" />
            </Cylinder>
            <Cylinder args={[0.08, 0.08, 0.4, 8]} position={[-0.3, -0.25, -1.5]}>
                <meshStandardMaterial color="#555555" />
            </Cylinder>
        </group>
    )
}

function FighterControlMode({ 
    equipment, 
    onExit 
}: { 
    equipment: EquipmentConfig
    onExit: () => void 
}) {
    const fighterRef = useRef<THREE.Group>(null)
    const { camera } = useThree()
    
    const [speed, setSpeed] = useState(300)
    const [altitude, setAltitude] = useState(500)
    const [missiles, setMissiles] = useState(6)
    const [projectiles, setProjectiles] = useState<{id: number, pos: [number, number, number], dir: THREE.Vector3}[]>([])
    const [explosions, setExplosions] = useState<{id: number, pos: [number, number, number]}[]>([])
    const [targets, setTargets] = useState([
        { id: '敌方战机A', pos: [100, 60, 150] as [number, number, number], health: 300, maxHealth: 300 },
        { id: '敌方战机B', pos: [-80, 45, 120] as [number, number, number], health: 300, maxHealth: 300 },
        { id: '地面目标', pos: [50, 5, 200] as [number, number, number], health: 500, maxHealth: 500 },
    ])
    const [totalDamage, setTotalDamage] = useState(0)
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
    
    const keys = useRef({ w: false, s: false, a: false, d: false, q: false, e: false, space: false, shift: false, f: false })
    const rotation = useRef({ x: 0, y: 0, z: 0 })
    const position = useRef({ x: 0, y: 50, z: 0 })
    const projectileId = useRef(0)
    const explosionId = useRef(0)
    const lastFire = useRef(0)
    
    const MISSILE_DAMAGE = 150
    const EXPLOSION_RADIUS = 20
    
    // 处理导弹爆炸伤害
    const handleMissileExplosion = (explosionPos: [number, number, number]) => {
        let damageDealt = 0
        
        setTargets(prev => prev.map(target => {
            const dx = target.pos[0] - explosionPos[0]
            const dy = target.pos[1] - explosionPos[1]
            const dz = target.pos[2] - explosionPos[2]
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)
            
            if (distance < EXPLOSION_RADIUS) {
                const damageMultiplier = Math.max(0.3, 1 - distance / EXPLOSION_RADIUS)
                const damage = Math.floor(MISSILE_DAMAGE * damageMultiplier)
                damageDealt += damage
                
                const newHealth = Math.max(0, target.health - damage)
                
                if (damage > 0) {
                    message.success(`💥 命中 ${target.id}！造成 ${damage} 点伤害`)
                }
                
                if (newHealth <= 0 && target.health > 0) {
                    message.success(`🎯 ${target.id} 已被摧毁！`)
                }
                
                return { ...target, health: newHealth }
            }
            return target
        }))
        
        if (damageDealt > 0) {
            setTotalDamage(prev => prev + damageDealt)
        }
    }
    
    const handleMissileExplode = (pos: [number, number, number]) => {
        setExplosions(prev => [...prev, { id: explosionId.current++, pos }])
        handleMissileExplosion(pos)
    }
    
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // 计算鼠标相对于屏幕中心的位置（-1 到 1）
            const centerX = window.innerWidth / 2
            const centerY = window.innerHeight / 2
            const mouseX = (e.clientX - centerX) / centerX
            const mouseY = (e.clientY - centerY) / centerY
            
            setMousePos({ x: mouseX, y: mouseY })
        }
        
        const handleKeyDown = (e: KeyboardEvent) => {
            const k = e.key.toLowerCase()
            if (k === 'w') keys.current.w = true
            if (k === 's') keys.current.s = true
            if (k === 'a') keys.current.a = true
            if (k === 'd') keys.current.d = true
            if (k === 'q') keys.current.q = true
            if (k === 'e') keys.current.e = true
            if (e.code === 'Space') { keys.current.space = true; e.preventDefault() }
            if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') keys.current.shift = true
            if (k === 'f') keys.current.f = true
            // 换弹功能 - R键
            if (k === 'r' && missiles < 6) {
                setMissiles(6)
                message.success('🔄 导弹装填完成！')
            }
            if (e.key === 'Escape') onExit()
        }
        
        const handleKeyUp = (e: KeyboardEvent) => {
            const k = e.key.toLowerCase()
            if (k === 'w') keys.current.w = false
            if (k === 's') keys.current.s = false
            if (k === 'a') keys.current.a = false
            if (k === 'd') keys.current.d = false
            if (k === 'q') keys.current.q = false
            if (k === 'e') keys.current.e = false
            if (e.code === 'Space') keys.current.space = false
            if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') keys.current.shift = false
            if (k === 'f') keys.current.f = false
        }
        
        // 绑定事件
        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('keydown', handleKeyDown)
        document.addEventListener('keyup', handleKeyUp)
        
        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('keydown', handleKeyDown)
            document.removeEventListener('keyup', handleKeyUp)
        }
    }, [onExit, missiles])
    
    useFrame((_, delta) => {
        if (!fighterRef.current) return
        
        // 速度控制
        if (keys.current.space) setSpeed(prev => Math.min(prev + 150 * delta, 900))
        if (keys.current.shift) setSpeed(prev => Math.max(prev - 150 * delta, 100))
        
        // 俯仰 W/S
        if (keys.current.w) rotation.current.x -= 2 * delta
        if (keys.current.s) rotation.current.x += 2 * delta
        rotation.current.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, rotation.current.x))
        
        // 滚转 A/D
        if (keys.current.a) rotation.current.z += 2.5 * delta
        if (keys.current.d) rotation.current.z -= 2.5 * delta
        
        // 偏航 Q/E
        if (keys.current.q) rotation.current.y += 1.5 * delta
        if (keys.current.e) rotation.current.y -= 1.5 * delta
        
        // 发射导弹 F键 - 使用鼠标瞄准方向
        if (keys.current.f && missiles > 0 && Date.now() - lastFire.current > 500) {
            lastFire.current = Date.now()
            setMissiles(prev => prev - 1)
            
            // 根据鼠标位置计算瞄准方向
            // 鼠标偏移转换为3D方向
            const maxOffset = 0.8
            const offsetX = Math.max(-maxOffset, Math.min(maxOffset, mousePos.x))
            const offsetY = Math.max(-maxOffset, Math.min(maxOffset, mousePos.y))
            
            // 基于飞机当前朝向和鼠标偏移计算瞄准方向
            const yaw = rotation.current.y
            const pitch = rotation.current.x
            
            // 计算瞄准方向向量（鼠标控制左右上下）
            const dir = new THREE.Vector3(
                -Math.sin(yaw) * Math.cos(pitch) + offsetX * Math.cos(pitch),
                -Math.sin(pitch) - offsetY,
                -Math.cos(yaw) * Math.cos(pitch) - offsetX * Math.sin(yaw)
            ).normalize()
            
            setProjectiles(prev => [...prev, {
                id: projectileId.current++,
                pos: [position.current.x, position.current.y, position.current.z],
                dir
            }])
            
            message.info('🚀 导弹发射！')
        }
        
        // 移动 - 飞机朝向负Z方向飞行
        const moveSpeed = speed * 0.015 * delta
        position.current.x -= Math.sin(rotation.current.y) * Math.cos(rotation.current.x) * moveSpeed
        position.current.z -= Math.cos(rotation.current.y) * Math.cos(rotation.current.x) * moveSpeed
        position.current.y -= Math.sin(rotation.current.x) * moveSpeed
        position.current.y = Math.max(5, Math.min(200, position.current.y))
        
        setAltitude(Math.round(position.current.y * 10))
        
        fighterRef.current.position.set(position.current.x, position.current.y, position.current.z)
        fighterRef.current.rotation.set(rotation.current.x, rotation.current.y, rotation.current.z)
        
        // 相机跟随（从后上方看）
        const cameraOffset = 20
        camera.position.x = position.current.x + Math.sin(rotation.current.y) * cameraOffset
        camera.position.z = position.current.z + Math.cos(rotation.current.y) * cameraOffset
        camera.position.y = position.current.y + 8
        camera.lookAt(position.current.x, position.current.y, position.current.z)
    })
    
    // 根据装备类型选择不同模型
    const isJ20 = equipment.id === 'j20'
    const isJ10 = equipment.id === 'j10'
    const isDrone = equipment.type === 'drone'
    
    return (
        <>
            {/* 飞机模型 - 根据类型使用不同建模 */}
            <group ref={fighterRef} position={[0, 50, 0]}>
                {isJ20 && <J20Model />}
                {isJ10 && <J10Model />}
                {isDrone && <DroneModel />}
            </group>
            
            {/* 导弹 - 带范围伤害 */}
            {projectiles.map(p => (
                <Missile 
                    key={p.id}
                    position={p.pos}
                    direction={p.dir}
                    speed={3}
                    onRemove={() => setProjectiles(prev => prev.filter(pp => pp.id !== p.id))}
                    onExplode={handleMissileExplode}
                />
            ))}
            
            {/* 爆炸效果 */}
            {explosions.map(e => (
                <Explosion
                    key={e.id}
                    position={e.pos}
                    damage={MISSILE_DAMAGE}
                    radius={EXPLOSION_RADIUS}
                    onComplete={() => setExplosions(prev => prev.filter(ee => ee.id !== e.id))}
                />
            ))}
            
            {/* 目标 - 敌方飞机和地面目标 */}
            {targets.map(target => target.health > 0 && (
                <group key={target.id} position={target.pos}>
                    {target.id.includes('战机') ? (
                        <Box args={[3, 1, 1.5]} rotation={[0, Math.random() * Math.PI, 0]}>
                            <meshStandardMaterial color="#cc0000" />
                        </Box>
                    ) : (
                        <Box args={[6, 4, 6]}>
                            <meshStandardMaterial color="#8b4513" />
                        </Box>
                    )}
                    <Html position={[0, 3, 0]} center>
                        <div style={{
                            background: 'rgba(0,0,0,0.8)',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            minWidth: '80px'
                        }}>
                            <div style={{
                                height: '6px',
                                background: '#333',
                                borderRadius: '3px',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    height: '100%',
                                    width: `${(target.health / target.maxHealth) * 100}%`,
                                    background: target.health > target.maxHealth * 0.3 ? '#52c41a' : '#ff4d4f',
                                    transition: 'width 0.3s'
                                }} />
                            </div>
                            <div style={{ color: '#fff', fontSize: '10px', textAlign: 'center', marginTop: '2px' }}>
                                {target.health}/{target.maxHealth}
                            </div>
                        </div>
                    </Html>
                </group>
            ))}
            
            {/* 云朵 */}
            {Array.from({ length: 6 }).map((_, i) => (
                <Sphere 
                    key={i} 
                    args={[10, 4, 4]} 
                    position={[
                        (i % 3) * 80 - 80,
                        60 + (i % 2) * 20,
                        i * 50
                    ]}
                >
                    <meshStandardMaterial color="#fff" transparent opacity={0.4} />
                </Sphere>
            ))}
            
            {/* 地面 */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                <planeGeometry args={[1000, 1000]} />
                <meshStandardMaterial color="#228b22" />
            </mesh>
            
            <Html fullscreen>
                <div style={{
                    position: 'absolute',
                    bottom: '30px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(0, 0, 0, 0.9)',
                    padding: '20px 30px',
                    borderRadius: '12px',
                    color: '#fff',
                    minWidth: '500px',
                    border: '2px solid #c9a55c',
                    fontFamily: 'monospace'
                }}>
                    <div style={{ marginBottom: '15px', fontSize: '22px', fontWeight: 'bold', color: '#c9a55c', textAlign: 'center' }}>
                        {isDrone ? '🛸' : '✈️'} {equipment.name}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px', fontSize: '15px' }}>
                        <div>
                            <span style={{ color: '#888' }}>速度:</span> 
                            <span style={{ color: '#52c41a', marginLeft: '8px', fontWeight: 'bold' }}>
                                {speed.toFixed(0)} km/h
                            </span>
                        </div>
                        <div>
                            <span style={{ color: '#888' }}>高度:</span> 
                            <span style={{ marginLeft: '8px', fontWeight: 'bold' }}>{altitude} m</span>
                        </div>
                        <div>
                            <span style={{ color: '#888' }}>导弹:</span> 
                            <span style={{ color: missiles > 2 ? '#52c41a' : '#ff4d4f', marginLeft: '8px', fontWeight: 'bold' }}>
                                {missiles}/6
                            </span>
                        </div>
                        <div>
                            <span style={{ color: '#888' }}>伤害:</span> 
                            <span style={{ color: '#faad14', marginLeft: '8px', fontWeight: 'bold' }}>
                                {totalDamage}
                            </span>
                        </div>
                    </div>
                    <div style={{ fontSize: '12px', color: '#aaa', marginTop: '12px', textAlign: 'center', borderTop: '1px solid #444', paddingTop: '10px' }}>
                        <span style={{ color: '#1890ff' }}>鼠标</span> 瞄准 · 
                        <span style={{ color: '#1890ff' }}>W/S</span> 俯仰 · 
                        <span style={{ color: '#52c41a' }}>A/D</span> 滚转 · 
                        <span style={{ color: '#faad14' }}>Q/E</span> 偏航 · 
                        <span style={{ color: '#ff4d4f' }}>空格</span> 加速 · 
                        <span style={{ color: '#888' }}>Shift</span> 减速 · 
                        <span style={{ color: '#ff0000' }}>F</span> 发射导弹 · 
                        <span style={{ color: '#faad14' }}>R</span> 换弹
                    </div>
                </div>
                
                {/* HUD准星 - 跟随鼠标 */}
                <div style={{
                    position: 'absolute',
                    top: `calc(50% + ${mousePos.y * 150}px)`,
                    left: `calc(50% + ${mousePos.x * 150}px)`,
                    transform: 'translate(-50%, -50%)',
                    pointerEvents: 'none',
                    width: '200px',
                    height: '200px',
                    transition: 'top 0.05s linear, left 0.05s linear'
                }}>
                    <div style={{ 
                        width: '200px', 
                        height: '200px', 
                        border: '2px solid rgba(0, 255, 0, 0.6)', 
                        borderRadius: '50%',
                        position: 'absolute'
                    }} />
                    <div style={{ width: '80px', height: '2px', background: '#00ff00', position: 'absolute', left: '60px', top: '99px' }} />
                    <div style={{ width: '2px', height: '80px', background: '#00ff00', position: 'absolute', left: '99px', top: '60px' }} />
                    <div style={{ 
                        width: '10px', 
                        height: '10px', 
                        background: '#ff0000',
                        borderRadius: '50%',
                        position: 'absolute',
                        left: '95px',
                        top: '95px'
                    }} />
                </div>
            </Html>
        </>
    )
}

// 加农炮底座组件
function CannonBase() {
    return (
        <group>
            {/* 底座平台 */}
            <Box args={[3.5, 0.4, 2.5]} position={[0, 0.2, 0]}>
                <meshStandardMaterial color="#3d3d3d" metalness={0.7} roughness={0.4} />
            </Box>
            {/* 后部配重 */}
            <Box args={[1.5, 0.8, 2]} position={[-1.5, 0.5, 0]}>
                <meshStandardMaterial color="#4a4a4a" metalness={0.6} roughness={0.5} />
            </Box>
            {/* 轮子左 */}
            <Cylinder args={[0.8, 0.8, 0.25, 16]} rotation={[0, 0, Math.PI/2]} position={[0, 0.5, 1.5]}>
                <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.3} />
            </Cylinder>
            {/* 轮子右 */}
            <Cylinder args={[0.8, 0.8, 0.25, 16]} rotation={[0, 0, Math.PI/2]} position={[0, 0.5, -1.5]}>
                <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.3} />
            </Cylinder>
            {/* 旋转座环 */}
            <Cylinder args={[0.8, 0.9, 0.4, 24]} position={[0, 0.8, 0]}>
                <meshStandardMaterial color="#5c5c5c" metalness={0.85} roughness={0.2} />
            </Cylinder>
        </group>
    )
}

// 加农炮炮管组件（可旋转）
function CannonBarrel() {
    return (
        <group>
            {/* 炮闩/后膛 */}
            <Cylinder args={[0.45, 0.5, 1.2, 16]} rotation={[Math.PI/2, 0, 0]} position={[0, 0, -0.3]}>
                <meshStandardMaterial color="#3a3a3a" metalness={0.85} roughness={0.25} />
            </Cylinder>
            {/* 炮身主体 */}
            <Cylinder args={[0.28, 0.35, 4, 20]} rotation={[Math.PI/2, 0, 0]} position={[0, 0, 2.2]}>
                <meshStandardMaterial color="#2d2d2d" metalness={0.88} roughness={0.2} />
            </Cylinder>
            {/* 炮身加强环1 */}
            <Cylinder args={[0.38, 0.38, 0.15, 16]} rotation={[Math.PI/2, 0, 0]} position={[0, 0, 0.8]}>
                <meshStandardMaterial color="#444444" metalness={0.9} roughness={0.15} />
            </Cylinder>
            {/* 炮身加强环2 */}
            <Cylinder args={[0.35, 0.35, 0.12, 16]} rotation={[Math.PI/2, 0, 0]} position={[0, 0, 2.5]}>
                <meshStandardMaterial color="#444444" metalness={0.9} roughness={0.15} />
            </Cylinder>
            {/* 炮口制退器 */}
            <Cylinder args={[0.32, 0.28, 0.6, 16]} rotation={[Math.PI/2, 0, 0]} position={[0, 0, 4.5]}>
                <meshStandardMaterial color="#222222" metalness={0.9} roughness={0.15} />
            </Cylinder>
            {/* 炮口 */}
            <Cylinder args={[0.22, 0.22, 0.1, 16]} rotation={[Math.PI/2, 0, 0]} position={[0, 0, 4.85]}>
                <meshStandardMaterial color="#1a1a1a" metalness={0.95} roughness={0.1} />
            </Cylinder>
            {/* 瞄准镜座 */}
            <Box args={[0.15, 0.25, 0.4]} position={[0, 0.35, 0.5]}>
                <meshStandardMaterial color="#3d3d3d" metalness={0.7} roughness={0.4} />
            </Box>
        </group>
    )
}

// 火箭炮底座组件
function RocketBase() {
    return (
        <group>
            {/* 卡车底盘 */}
            <Box args={[6, 0.6, 2.8]} position={[0, 0.3, 0]}>
                <meshStandardMaterial color="#2d3a2d" metalness={0.6} roughness={0.5} />
            </Box>
            {/* 驾驶室 */}
            <Box args={[1.8, 1.4, 2.2]} position={[-2.5, 1.0, 0]}>
                <meshStandardMaterial color="#1d2a1d" metalness={0.7} roughness={0.4} />
            </Box>
            {/* 驾驶室窗户 */}
            <Box args={[0.1, 0.6, 1.6]} position={[-1.65, 1.2, 0]}>
                <meshStandardMaterial color="#87ceeb" metalness={0.3} roughness={0.1} transparent opacity={0.7} />
            </Box>
            {/* 前轮左 */}
            <Cylinder args={[0.5, 0.5, 0.3, 16]} rotation={[0, 0, Math.PI/2]} position={[-2.2, 0.3, 1.6]}>
                <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.8} />
            </Cylinder>
            {/* 前轮右 */}
            <Cylinder args={[0.5, 0.5, 0.3, 16]} rotation={[0, 0, Math.PI/2]} position={[-2.2, 0.3, -1.6]}>
                <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.8} />
            </Cylinder>
            {/* 后轮左1 */}
            <Cylinder args={[0.5, 0.5, 0.3, 16]} rotation={[0, 0, Math.PI/2]} position={[1.0, 0.3, 1.6]}>
                <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.8} />
            </Cylinder>
            {/* 后轮右1 */}
            <Cylinder args={[0.5, 0.5, 0.3, 16]} rotation={[0, 0, Math.PI/2]} position={[1.0, 0.3, -1.6]}>
                <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.8} />
            </Cylinder>
            {/* 后轮左2 */}
            <Cylinder args={[0.5, 0.5, 0.3, 16]} rotation={[0, 0, Math.PI/2]} position={[2.2, 0.3, 1.6]}>
                <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.8} />
            </Cylinder>
            {/* 后轮右2 */}
            <Cylinder args={[0.5, 0.5, 0.3, 16]} rotation={[0, 0, Math.PI/2]} position={[2.2, 0.3, -1.6]}>
                <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.8} />
            </Cylinder>
            {/* 旋转基座 */}
            <Cylinder args={[0.6, 0.7, 0.4, 20]} position={[0.5, 0.9, 0]}>
                <meshStandardMaterial color="#3d4a3d" metalness={0.8} roughness={0.3} />
            </Cylinder>
        </group>
    )
}

// 火箭炮发射管组件（可旋转）- 12管火箭炮
function RocketLauncher() {
    return (
        <group>
            {/* 发射架框架 */}
            <Box args={[2.2, 1.6, 2.0]} position={[0, 0, 1.5]}>
                <meshStandardMaterial color="#2a3a2a" metalness={0.7} roughness={0.4} transparent opacity={0.3} />
            </Box>
            {/* 12个发射管 - 3行4列 */}
            {[0, 1, 2].map((row) => (
                [0, 1, 2, 3].map((col) => (
                    <Cylinder 
                        key={`tube-${row}-${col}`} 
                        args={[0.18, 0.18, 4, 12]} 
                        rotation={[Math.PI/2, 0, 0]} 
                        position={[col * 0.45 - 0.675, row * 0.45 - 0.45, 2.5]}
                    >
                        <meshStandardMaterial color="#1a2a1a" metalness={0.85} roughness={0.2} />
                    </Cylinder>
                ))
            ))}
            {/* 发射管内部（深色） */}
            {[0, 1, 2].map((row) => (
                [0, 1, 2, 3].map((col) => (
                    <Cylinder 
                        key={`inner-${row}-${col}`} 
                        args={[0.14, 0.14, 0.3, 12]} 
                        rotation={[Math.PI/2, 0, 0]} 
                        position={[col * 0.45 - 0.675, row * 0.45 - 0.45, 4.6]}
                    >
                        <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.1} />
                    </Cylinder>
                ))
            ))}
            {/* 线圈 - 在发射管后面（装弹处） */}
            {[0, 1, 2].map((row) => (
                [0, 1, 2, 3].map((col) => (
                    <Cylinder 
                        key={`coil-${row}-${col}`} 
                        args={[0.2, 0.2, 0.15, 16]} 
                        rotation={[Math.PI/2, 0, 0]} 
                        position={[col * 0.45 - 0.675, row * 0.45 - 0.45, 0.3]}
                    >
                        <meshStandardMaterial color="#3a3a3a" metalness={0.8} roughness={0.3} />
                    </Cylinder>
                ))
            ))}
            {/* 液压支撑杆 */}
            <Cylinder args={[0.08, 0.06, 2, 8]} rotation={[Math.PI/4, 0, 0]} position={[-0.8, -0.6, 0.5]}>
                <meshStandardMaterial color="#555555" metalness={0.9} roughness={0.2} />
            </Cylinder>
            <Cylinder args={[0.08, 0.06, 2, 8]} rotation={[Math.PI/4, 0, 0]} position={[0.8, -0.6, 0.5]}>
                <meshStandardMaterial color="#555555" metalness={0.9} roughness={0.2} />
            </Cylinder>
        </group>
    )
}

// 火炮控制模式
function CannonControlMode({ 
    equipment, 
    onExit 
}: { 
    equipment: EquipmentConfig
    onExit: () => void 
}) {
    const cannonRef = useRef<THREE.Group>(null)
    const barrelRef = useRef<THREE.Group>(null)
    const { camera } = useThree()
    
    const [ammo, setAmmo] = useState(30)
    const [isReloading, setIsReloading] = useState(false)
    const [azimuth, setAzimuth] = useState(0)
    const [elevation, setElevation] = useState(30)
    const [projectiles, setProjectiles] = useState<{id: number, pos: [number, number, number], dir: THREE.Vector3}[]>([])
    const [explosions, setExplosions] = useState<{id: number, pos: [number, number, number]}[]>([])
    const [targets, setTargets] = useState([
        { id: '建筑A', pos: [-20, 0, 35] as [number, number, number], health: 1000, maxHealth: 1000, size: [8, 12, 8] as [number, number, number] },
        { id: '敌方坦克', pos: [15, 0, 40] as [number, number, number], health: 500, maxHealth: 500, size: [4, 2, 6] as [number, number, number] },
        { id: '建筑B', pos: [30, 0, 50] as [number, number, number], health: 800, maxHealth: 800, size: [6, 8, 6] as [number, number, number] },
    ])
    const [totalDamage, setTotalDamage] = useState(0)
    const [predictedLanding, setPredictedLanding] = useState<[number, number, number]>([0, 0, 50])
    
    const keys = useRef({ w: false, s: false, a: false, d: false, space: false })
    const projectileId = useRef(0)
    const explosionId = useRef(0)
    const lastFire = useRef(0)
    // 使用 ref 存储当前角度，确保计算时使用最新值
    const currentAzimuth = useRef(0)
    const currentElevation = useRef(30)
    
    // 炮弹属性
    const SHELL_DAMAGE = 250  // 增加伤害
    const EXPLOSION_RADIUS = 20  // 增加爆炸范围
    const SHELL_SPEED = 1.2  // 降低炮弹速度，让射程更近
    const GRAVITY = 0.04     // 增加重力，让炮弹更快落地
    const AIR_RESISTANCE = 0.995  // 增加空气阻力，更快减速
    
    // 计算抛物线落点预测
    const calculateLandingPoint = (elev: number, az: number): [number, number, number] => {
        const azRad = az * Math.PI / 180
        const elRad = elev * Math.PI / 180
        
        // 初始位置（炮口）- 与发射位置一致，从炮的基座位置（原点）开始计算
        const muzzleOffset = 5  // 炮管长度
        const barrelHeight = 1.2  // 炮管基座高度
        
        // 炮口在世界坐标系中的位置（炮在原点，所以就是相对于原点的位置）
        const muzzleX = Math.sin(azRad) * Math.cos(elRad) * muzzleOffset
        const muzzleY = barrelHeight + Math.sin(elRad) * muzzleOffset
        const muzzleZ = Math.cos(azRad) * Math.cos(elRad) * muzzleOffset
        
        // 初始速度方向（与炮管方向一致）
        let vx = Math.sin(azRad) * Math.cos(elRad) * SHELL_SPEED
        let vy = Math.sin(elRad) * SHELL_SPEED
        let vz = Math.cos(azRad) * Math.cos(elRad) * SHELL_SPEED
        
        // 从炮口位置开始模拟轨迹
        let x = muzzleX
        let y = muzzleY
        let z = muzzleZ
        
        // 模拟轨迹直到落地
        for (let i = 0; i < 500; i++) {
            x += vx
            y += vy
            z += vz
            
            vy -= GRAVITY
            vx *= AIR_RESISTANCE
            vz *= AIR_RESISTANCE
            
            if (y <= 0) {
                return [x, 0.1, z]
            }
        }
        
        return [x, 0.1, z]
    }
    
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const k = e.key.toLowerCase()
            if (k === 'w') keys.current.w = true
            if (k === 's') keys.current.s = true
            if (k === 'a') keys.current.a = true
            if (k === 'd') keys.current.d = true
            if (e.code === 'Space') { keys.current.space = true; e.preventDefault() }
            if (k === 'r' && !isReloading && ammo < 30) {
                setIsReloading(true)
                message.loading('装填炮弹中...')
                setTimeout(() => {
                    setAmmo(30)
                    setIsReloading(false)
                    message.success('装填完成！弹药已满')
                }, 4000)
            }
            if (e.key === 'Escape') onExit()
        }
        
        const handleKeyUp = (e: KeyboardEvent) => {
            const k = e.key.toLowerCase()
            if (k === 'w') keys.current.w = false
            if (k === 's') keys.current.s = false
            if (k === 'a') keys.current.a = false
            if (k === 'd') keys.current.d = false
            if (e.code === 'Space') keys.current.space = false
        }
        
        // 使用document确保键盘事件能被接收
        document.addEventListener('keydown', handleKeyDown)
        document.addEventListener('keyup', handleKeyUp)
        
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.removeEventListener('keyup', handleKeyUp)
        }
    }, [ammo, isReloading, onExit])
    
    // 处理爆炸范围伤害
    const handleExplosionDamage = (explosionPos: [number, number, number]) => {
        console.log('💥 爆炸发生！位置:', explosionPos)
        
        setTargets(prev => {
            let damageDealt = 0
            let hitCount = 0
            
            const newTargets = prev.map(target => {
                if (target.health <= 0) return target
                
                // 计算3D距离（包括高度）
                const targetCenterY = target.pos[1] + target.size[1] / 2
                const dx = target.pos[0] - explosionPos[0]
                const dy = targetCenterY - explosionPos[1]
                const dz = target.pos[2] - explosionPos[2]
                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)
                
                // 在爆炸范围内（包括目标大小，扩大范围确保能命中）
                const targetRadius = Math.max(...target.size) / 2
                const effectiveRadius = EXPLOSION_RADIUS + targetRadius + 3  // 额外增加3米容差
                
                console.log(`检查目标 ${target.id}: 距离=${distance.toFixed(1)}m, 有效半径=${effectiveRadius.toFixed(1)}m`)
                
                if (distance < effectiveRadius) {
                    // 伤害随距离衰减（中心100%，边缘30%）
                    const damageMultiplier = Math.max(0.3, 1 - (distance / effectiveRadius) * 0.7)
                    const damage = Math.floor(SHELL_DAMAGE * damageMultiplier)
                    
                    if (damage > 0) {
                        damageDealt += damage
                        hitCount++
                        const newHealth = Math.max(0, target.health - damage)
                        
                        console.log(`✅ 命中 ${target.id}！造成 ${damage} 点伤害，剩余血量 ${newHealth}`)
                        message.success(`💥 命中 ${target.id}！造成 ${damage} 点伤害 (距离: ${distance.toFixed(1)}m)`)
                        
                        if (newHealth <= 0 && target.health > 0) {
                            message.success(`🎯 ${target.id} 已被摧毁！`)
                        }
                        
                        return { ...target, health: newHealth }
                    }
                }
                return target
            })
            
            // 如果没有命中任何目标，显示调试信息
            if (hitCount === 0) {
                console.warn('❌ 没有命中任何目标！')
                console.log('爆炸位置:', explosionPos)
                console.log('目标列表:', prev.map(t => {
                    const targetCenterY = t.pos[1] + t.size[1] / 2
                    const dist = Math.sqrt(
                        Math.pow(t.pos[0] - explosionPos[0], 2) + 
                        Math.pow(targetCenterY - explosionPos[1], 2) + 
                        Math.pow(t.pos[2] - explosionPos[2], 2)
                    )
                    return { id: t.id, pos: t.pos, size: t.size, distance: dist.toFixed(1) }
                }))
            } else {
                console.log(`✅ 总共命中 ${hitCount} 个目标，总伤害 ${damageDealt}`)
                setTotalDamage(prev => prev + damageDealt)
            }
            
            return newTargets
        })
    }
    
    // 处理炮弹爆炸
    const handleShellExplode = (pos: [number, number, number]) => {
        console.log('🚀 handleShellExplode 被调用！位置:', pos)
        setExplosions(prev => [...prev, { id: explosionId.current++, pos }])
        // 直接调用伤害处理
        handleExplosionDamage(pos)
    }
    
    useFrame((_, delta) => {
        // W/S 调整仰角（俯仰）
        if (keys.current.w) {
            currentElevation.current = Math.min(currentElevation.current + 25 * delta, 75)
            setElevation(currentElevation.current)
        }
        if (keys.current.s) {
            currentElevation.current = Math.max(currentElevation.current - 25 * delta, 5)
            setElevation(currentElevation.current)
        }
        // A/D 水平旋转
        if (keys.current.a) {
            currentAzimuth.current = currentAzimuth.current + 35 * delta
            setAzimuth(currentAzimuth.current)
        }
        if (keys.current.d) {
            currentAzimuth.current = currentAzimuth.current - 35 * delta
            setAzimuth(currentAzimuth.current)
        }
        
        // 实时计算落点预测 - 使用 ref 中的最新值
        const landing = calculateLandingPoint(currentElevation.current, currentAzimuth.current)
        setPredictedLanding(landing)
        
        // 开火 - 空格键
        if (keys.current.space && ammo > 0 && !isReloading && Date.now() - lastFire.current > 1500) {
            lastFire.current = Date.now()
            setAmmo(prev => prev - 1)
            
            // 使用 ref 中的最新角度值
            const azRad = currentAzimuth.current * Math.PI / 180
            const elRad = currentElevation.current * Math.PI / 180
            const dir = new THREE.Vector3(
                Math.sin(azRad) * Math.cos(elRad),
                Math.sin(elRad),
                Math.cos(azRad) * Math.cos(elRad)
            ).normalize()
            
            // 炮弹从炮口位置发射
            const muzzleOffset = 5  // 炮管长度
            const barrelHeight = 1.2  // 炮管基座高度
            const startPos: [number, number, number] = [
                Math.sin(azRad) * Math.cos(elRad) * muzzleOffset,
                barrelHeight + Math.sin(elRad) * muzzleOffset,
                Math.cos(azRad) * Math.cos(elRad) * muzzleOffset
            ]
            
            setProjectiles(prev => [...prev, {
                id: projectileId.current++,
                pos: startPos,
                dir
            }])
            
            message.info('💥 开火！')
        }
        
        // 更新炮身旋转 - 使用 ref 中的最新值
        if (cannonRef.current) {
            cannonRef.current.rotation.y = currentAzimuth.current * Math.PI / 180
        }
        // 更新炮管仰角 - 使用 ref 中的最新值
        if (barrelRef.current) {
            barrelRef.current.rotation.x = -currentElevation.current * Math.PI / 180
        }
        
        // 相机位置：从炮的后面（装弹处）向前看炮口方向 - 使用 ref 中的最新值
        const azRad = currentAzimuth.current * Math.PI / 180
        const elRad = currentElevation.current * Math.PI / 180
        
        // 计算炮口位置
        const muzzleOffset = 5  // 炮管长度
        const barrelHeight = 1.2  // 炮管基座高度
        const muzzleX = Math.sin(azRad) * Math.cos(elRad) * muzzleOffset
        const muzzleY = barrelHeight + Math.sin(elRad) * muzzleOffset
        const muzzleZ = Math.cos(azRad) * Math.cos(elRad) * muzzleOffset
        
        // 相机放在炮的后面15米处，高度略高于炮口
        const cameraDistance = 15
        camera.position.x = -Math.sin(azRad) * cameraDistance
        camera.position.z = -Math.cos(azRad) * cameraDistance
        camera.position.y = muzzleY + 2
        
        // 相机看向炮口位置
        camera.lookAt(muzzleX, muzzleY, muzzleZ)
        camera.up.set(0, 1, 0)
    })
    
    // 计算落点距离
    const landingDistance = Math.sqrt(predictedLanding[0] * predictedLanding[0] + predictedLanding[2] * predictedLanding[2])
    
    const isRocket = equipment.type === 'rocket'
    
    return (
        <>
            {/* 武器模型 - 水平旋转 + 仰俯 */}
            <group ref={cannonRef} position={[0, 0, 0]}>
                {/* 底座（不随仰角变化） */}
                {isRocket ? <RocketBase /> : <CannonBase />}
                {/* 炮管/发射管部分（随仰角变化）*/}
                <group ref={barrelRef} position={isRocket ? [0.5, 1.1, 0] : [0, 1.2, 0]}>
                    {isRocket ? <RocketLauncher /> : <CannonBarrel />}
                </group>
            </group>
            
            {/* 炮弹 - 启用爆炸效果，使用新速度和重力参数 */}
            {projectiles.map(p => (
                <CannonShell 
                    key={p.id}
                    position={p.pos}
                    direction={p.dir}
                    speed={SHELL_SPEED}
                    gravity={GRAVITY}
                    airResistance={AIR_RESISTANCE}
                    targets={targets}
                    onRemove={() => setProjectiles(prev => prev.filter(pp => pp.id !== p.id))}
                    onExplode={handleShellExplode}
                />
            ))}
            
            {/* 爆炸效果 */}
            {explosions.map(e => (
                <Explosion
                    key={e.id}
                    position={e.pos}
                    damage={SHELL_DAMAGE}
                    radius={EXPLOSION_RADIUS}
                    onComplete={() => setExplosions(prev => prev.filter(ee => ee.id !== e.id))}
                />
            ))}
            
            {/* 目标 - 建筑物和敌方单位 */}
            {targets.map(target => target.health > 0 && (
                <group key={target.id} position={target.pos}>
                    {/* 目标模型 */}
                    {target.id.includes('建筑') ? (
                        <Box args={target.size} position={[0, target.size[1]/2, 0]}>
                            <meshStandardMaterial color="#666666" />
                        </Box>
                    ) : (
                        <Box args={target.size} position={[0, target.size[1]/2, 0]}>
                            <meshStandardMaterial color="#cc3333" />
                        </Box>
                    )}
                    {/* 血条 */}
                    <Html position={[0, target.size[1] + 2, 0]} center>
                        <div style={{
                            background: 'rgba(0,0,0,0.7)',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            minWidth: '80px'
                        }}>
                            <div style={{
                                height: '8px',
                                background: '#333',
                                borderRadius: '4px',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    height: '100%',
                                    width: `${(target.health / target.maxHealth) * 100}%`,
                                    background: target.health > target.maxHealth * 0.3 ? '#52c41a' : '#ff4d4f',
                                    transition: 'width 0.3s'
                                }} />
                            </div>
                            <div style={{ 
                                color: '#fff', 
                                fontSize: '12px', 
                                textAlign: 'center',
                                marginTop: '2px'
                            }}>
                                {target.health}/{target.maxHealth}
                            </div>
                        </div>
                    </Html>
                </group>
            ))}
            
            {/* 真实抛物线落点预测圈 */}
            <group position={predictedLanding}>
                {/* 外圈 - 爆炸范围 */}
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[EXPLOSION_RADIUS - 1, EXPLOSION_RADIUS, 48]} />
                    <meshBasicMaterial color="#ff0000" transparent opacity={0.6} />
                </mesh>
                {/* 中圈 */}
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[EXPLOSION_RADIUS * 0.5, EXPLOSION_RADIUS * 0.6, 32]} />
                    <meshBasicMaterial color="#ff6600" transparent opacity={0.5} />
                </mesh>
                {/* 中心点 */}
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                    <circleGeometry args={[1, 16]} />
                    <meshBasicMaterial color="#ffff00" transparent opacity={0.8} />
                </mesh>
                {/* 十字准星 */}
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[0.5, EXPLOSION_RADIUS * 2]} />
                    <meshBasicMaterial color="#ffff00" transparent opacity={0.4} />
                </mesh>
                <mesh rotation={[-Math.PI / 2, Math.PI / 2, 0]}>
                    <planeGeometry args={[0.5, EXPLOSION_RADIUS * 2]} />
                    <meshBasicMaterial color="#ffff00" transparent opacity={0.4} />
                </mesh>
                {/* 落点距离标注 */}
                <Html position={[0, 2, 0]} center>
                    <div style={{
                        background: 'rgba(0,0,0,0.8)',
                        color: '#ffff00',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap'
                    }}>
                        {landingDistance.toFixed(0)}m
                    </div>
                </Html>
            </group>
            
            {/* 地面网格 */}
            <gridHelper args={[200, 40, '#444444', '#333333']} position={[0, 0.01, 0]} />
            
            <Html fullscreen>
                <div style={{
                    position: 'absolute',
                    bottom: '30px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(0, 0, 0, 0.9)',
                    padding: '20px 30px',
                    borderRadius: '12px',
                    color: '#fff',
                    minWidth: '500px',
                    border: '2px solid #c9a55c',
                    fontFamily: 'monospace'
                }}>
                    <div style={{ marginBottom: '15px', fontSize: '22px', fontWeight: 'bold', color: '#c9a55c', textAlign: 'center' }}>
                        💣 {equipment.name}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px', fontSize: '15px' }}>
                        <div>
                            <span style={{ color: '#888' }}>弹药:</span> 
                            <span style={{ color: ammo > 10 ? '#52c41a' : '#ff4d4f', marginLeft: '8px', fontWeight: 'bold' }}>
                                {ammo}/30
                            </span>
                        </div>
                        <div>
                            <span style={{ color: '#888' }}>状态:</span> 
                            <span style={{ color: isReloading ? '#ff4d4f' : '#52c41a', marginLeft: '8px' }}>
                                {isReloading ? '装填中' : '就绪'}
                            </span>
                        </div>
                        <div>
                            <span style={{ color: '#888' }}>总伤害:</span> 
                            <span style={{ color: '#faad14', marginLeft: '8px', fontWeight: 'bold' }}>
                                {totalDamage}
                            </span>
                        </div>
                        <div>
                            <span style={{ color: '#888' }}>落点距离:</span> 
                            <span style={{ color: '#ffff00', marginLeft: '8px', fontWeight: 'bold' }}>
                                {landingDistance.toFixed(0)}m
                            </span>
                        </div>
                        <div>
                            <span style={{ color: '#888' }}>方位角:</span> 
                            <span style={{ marginLeft: '8px' }}>{azimuth.toFixed(1)}°</span>
                        </div>
                        <div>
                            <span style={{ color: '#888' }}>仰角:</span> 
                            <span style={{ marginLeft: '8px', color: '#1890ff', fontWeight: 'bold' }}>{elevation.toFixed(1)}°</span>
                        </div>
                        <div>
                            <span style={{ color: '#888' }}>爆炸范围:</span> 
                            <span style={{ color: '#ff4d4f', marginLeft: '8px' }}>{EXPLOSION_RADIUS}m</span>
                        </div>
                        <div>
                            <span style={{ color: '#888' }}>伤害:</span> 
                            <span style={{ color: '#ff6600', marginLeft: '8px' }}>{SHELL_DAMAGE}</span>
                        </div>
                    </div>
                    <div style={{ fontSize: '12px', color: '#aaa', marginTop: '15px', textAlign: 'center', borderTop: '1px solid #444', paddingTop: '10px' }}>
                        <span style={{ color: '#1890ff' }}>W/S</span> 调整仰角(俯仰) · 
                        <span style={{ color: '#52c41a' }}>A/D</span> 水平旋转 · 
                        <span style={{ color: '#ff4d4f' }}>空格</span> 开火 · 
                        <span style={{ color: '#faad14' }}>R</span> 装填 · 
                        <span style={{ color: '#888' }}>ESC</span> 退出
                    </div>
                </div>
            </Html>
        </>
    )
}

// 树木组件 - 简化版
function Tree({ position }: { position: [number, number, number] }) {
    return (
        <group position={position}>
            {/* 树干 */}
            <Cylinder args={[0.2, 0.3, 2, 6]} position={[0, 1, 0]}>
                <meshStandardMaterial color="#5d4037" />
            </Cylinder>
            {/* 树冠 */}
            <Sphere args={[1.8, 6, 6]} position={[0, 3.5, 0]}>
                <meshStandardMaterial color="#2e7d32" />
            </Sphere>
        </group>
    )
}

// 建筑物组件 - 可破坏
function Building({ 
    id: _id,
    position, 
    size,
    health = 1000,
    maxHealth = 1000,
    onDestroy
}: { 
    id: string
    position: [number, number, number]
    size: [number, number, number]
    health?: number
    maxHealth?: number
    onDestroy?: () => void
}) {
    const healthPercent = health / maxHealth
    const isDestroyed = health <= 0
    
    if (isDestroyed && onDestroy) {
        setTimeout(() => onDestroy(), 100)
    }
    
    // 根据生命值调整外观
    const baseColor = isDestroyed ? '#4a4a4a' : healthPercent > 0.5 ? '#78909c' : healthPercent > 0.2 ? '#8a9aac' : '#9a9a9c'
    const roofColor = isDestroyed ? '#3a3a3a' : '#546e7a'
    
    return (
        <group position={position}>
            {/* 主体 - 损坏时倾斜 */}
            <Box 
                args={size} 
                position={[0, size[1] / 2, 0]}
                rotation={isDestroyed ? [0, 0, Math.PI / 12] : [0, 0, 0]}
            >
                <meshStandardMaterial 
                    color={baseColor} 
                    roughness={0.8}
                    emissive={healthPercent < 0.3 && !isDestroyed ? '#ff3300' : '#000000'}
                    emissiveIntensity={healthPercent < 0.3 && !isDestroyed ? 0.2 : 0}
                />
            </Box>
            {/* 屋顶 */}
            {healthPercent > 0.3 && (
                <Box args={[size[0] + 0.3, 0.3, size[2] + 0.3]} position={[0, size[1] + 0.15, 0]}>
                    <meshStandardMaterial color={roofColor} />
                </Box>
            )}
            
            {/* 损坏效果 - 碎片 */}
            {healthPercent < 0.5 && !isDestroyed && (
                <group>
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Box 
                            key={i} 
                            args={[0.3, 0.3, 0.3]} 
                            position={[
                                (Math.random() - 0.5) * size[0],
                                Math.random() * size[1] * 0.5,
                                (Math.random() - 0.5) * size[2]
                            ]}
                        >
                            <meshStandardMaterial color="#666666" />
                        </Box>
                    ))}
                </group>
            )}
            
            {/* 生命值条 */}
            {!isDestroyed && (
                <Html position={[0, size[1] + 1, 0]} center>
                    <div style={{
                        background: 'rgba(0, 0, 0, 0.8)',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        minWidth: '80px',
                        border: '1px solid #666'
                    }}>
                        <div style={{
                            width: '100%',
                            height: '4px',
                            background: '#333',
                            borderRadius: '2px',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                width: `${healthPercent * 100}%`,
                                height: '100%',
                                background: healthPercent > 0.5 ? '#52c41a' : healthPercent > 0.2 ? '#faad14' : '#ff4d4f',
                                transition: 'width 0.3s'
                            }} />
                        </div>
                        <div style={{
                            fontSize: '10px',
                            color: '#fff',
                            textAlign: 'center',
                            marginTop: '2px'
                        }}>
                            {Math.round(health)}/{maxHealth}
                        </div>
                    </div>
                </Html>
            )}
        </group>
    )
}

// 岩石组件
function Rock({ position, scale }: { position: [number, number, number], scale: number }) {
    return (
        <group position={position} scale={scale}>
            <Sphere args={[1, 6, 5]} position={[0, 0.3, 0]}>
                <meshStandardMaterial color="#616161" roughness={1} />
            </Sphere>
            <Sphere args={[0.6, 5, 4]} position={[0.5, 0.2, 0.3]}>
                <meshStandardMaterial color="#757575" roughness={1} />
            </Sphere>
        </group>
    )
}

// 敌方坦克（可破坏）
function EnemyTank({ 
    id: _id, 
    position, 
    rotation = 0, 
    health = 500, 
    maxHealth = 500,
    onDestroy 
}: { 
    id: string
    position: [number, number, number]
    rotation?: number
    health?: number
    maxHealth?: number
    onDestroy?: () => void
}) {
    const healthPercent = health / maxHealth
    const isDestroyed = health <= 0
    
    // 根据生命值调整颜色和效果
    const bodyColor = isDestroyed ? '#333333' : healthPercent > 0.5 ? '#8b0000' : healthPercent > 0.2 ? '#a52a2a' : '#cc0000'
    const turretColor = isDestroyed ? '#1a1a1a' : healthPercent > 0.5 ? '#a52a2a' : '#cc3333'
    
    if (isDestroyed && onDestroy) {
        // 延迟销毁，让爆炸动画播放
        setTimeout(() => onDestroy(), 100)
    }
    
    return (
        <group position={position} rotation={[0, rotation, 0]}>
            {/* 车体 */}
            <Box args={[3, 0.8, 4]} position={[0, 0.6, 0]}>
                <meshStandardMaterial 
                    color={bodyColor} 
                    roughness={0.7}
                    emissive={healthPercent < 0.3 ? '#ff3300' : '#000000'}
                    emissiveIntensity={healthPercent < 0.3 ? 0.3 : 0}
                />
            </Box>
            {/* 炮塔 */}
            <Cylinder args={[0.8, 1, 0.6, 8]} position={[0, 1.3, 0]}>
                <meshStandardMaterial 
                    color={turretColor} 
                    roughness={0.6}
                    emissive={healthPercent < 0.3 ? '#ff3300' : '#000000'}
                    emissiveIntensity={healthPercent < 0.3 ? 0.2 : 0}
                />
            </Cylinder>
            {/* 炮管 */}
            <Cylinder args={[0.12, 0.12, 2.5, 8]} rotation={[Math.PI / 2, 0, 0]} position={[0, 1.3, 1.5]}>
                <meshStandardMaterial color={isDestroyed ? '#1a1a1a' : '#5d0000'} roughness={0.5} />
            </Cylinder>
            {/* 履带 */}
            <Box args={[0.5, 0.6, 4.2]} position={[-1.5, 0.3, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
            </Box>
            <Box args={[0.5, 0.6, 4.2]} position={[1.5, 0.3, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
            </Box>
            {/* 标记 */}
            <Box args={[0.5, 2, 0.1]} position={[0, 2.5, 0]}>
                <meshStandardMaterial 
                    color="#ff0000" 
                    emissive="#ff0000" 
                    emissiveIntensity={isDestroyed ? 0 : 0.5} 
                />
            </Box>
            
            {/* 损坏效果 - 冒烟 */}
            {healthPercent < 0.5 && !isDestroyed && (
                <group>
                    {[0, 0.3, -0.3].map((x, i) => (
                        <Sphere key={i} args={[0.3, 4, 4]} position={[x, 2 + i * 0.2, 0]}>
                            <meshStandardMaterial 
                                color="#333333" 
                                transparent 
                                opacity={0.6 - i * 0.15}
                            />
                        </Sphere>
                    ))}
                </group>
            )}
            
            {/* 生命值条 */}
            {!isDestroyed && (
                <Html position={[0, 3, 0]} center>
                    <div style={{
                        background: 'rgba(0, 0, 0, 0.8)',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        minWidth: '60px',
                        border: '1px solid #666'
                    }}>
                        <div style={{
                            width: '100%',
                            height: '4px',
                            background: '#333',
                            borderRadius: '2px',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                width: `${healthPercent * 100}%`,
                                height: '100%',
                                background: healthPercent > 0.5 ? '#52c41a' : healthPercent > 0.2 ? '#faad14' : '#ff4d4f',
                                transition: 'width 0.3s'
                            }} />
                        </div>
                        <div style={{
                            fontSize: '10px',
                            color: '#fff',
                            textAlign: 'center',
                            marginTop: '2px'
                        }}>
                            {Math.round(health)}/{maxHealth}
                        </div>
                    </div>
                </Html>
            )}
        </group>
    )
}

// 沙袋掩体
function Sandbags({ position }: { position: [number, number, number] }) {
    return (
        <group position={position}>
            {Array.from({ length: 5 }).map((_, i) => (
                <Cylinder key={i} args={[0.25, 0.25, 1, 8]} rotation={[0, 0, Math.PI / 2]} position={[i * 0.5 - 1, 0.25, 0]}>
                    <meshStandardMaterial color="#8d6e63" roughness={1} />
                </Cylinder>
            ))}
            {Array.from({ length: 4 }).map((_, i) => (
                <Cylinder key={`2-${i}`} args={[0.25, 0.25, 1, 8]} rotation={[0, 0, Math.PI / 2]} position={[i * 0.5 - 0.75, 0.7, 0]}>
                    <meshStandardMaterial color="#795548" roughness={1} />
                </Cylinder>
            ))}
        </group>
    )
}


// 主交互场景
function InteractionScene({ 
    equipment, 
    onExit,
    onHUDUpdate,
    onMouseUpdate
}: { 
    equipment: EquipmentConfig | null
    onExit: () => void
    onHUDUpdate: (state: Partial<HUDState>) => void
    onMouseUpdate: (x: number, y: number) => void
}) {
    if (!equipment) return null
    
    // 可破坏物体状态管理
    const [destructibleObjects, setDestructibleObjects] = useState<Map<string, DestructibleObject>>(new Map())
    
    // 初始化可破坏物体
    React.useEffect(() => {
        const objects = new Map<string, DestructibleObject>()
        
        // 敌方坦克
        objects.set('enemy-tank-1', {
            id: 'enemy-tank-1',
            position: [30, 0, -40],
            health: 500,
            maxHealth: 500,
            type: 'tank',
            size: 3
        })
        objects.set('enemy-tank-2', {
            id: 'enemy-tank-2',
            position: [-25, 0, 35],
            health: 500,
            maxHealth: 500,
            type: 'tank',
            size: 3
        })
        
        // 建筑物
        objects.set('building-1', {
            id: 'building-1',
            position: [-40, 0, -30],
            health: 1000,
            maxHealth: 1000,
            type: 'building',
            size: 6
        })
        objects.set('building-2', {
            id: 'building-2',
            position: [50, 0, 40],
            health: 1200,
            maxHealth: 1200,
            type: 'building',
            size: 7
        })
        
        setDestructibleObjects(objects)
    }, [])
    
    // 伤害计算函数
    const applyDamage = React.useCallback((position: [number, number, number], damage: number, radius: number) => {
        setDestructibleObjects(prev => {
            const newMap = new Map(prev)
            let totalDamage = 0
            
            newMap.forEach((obj, id) => {
                // 计算距离
                const dx = obj.position[0] - position[0]
                const dy = obj.position[1] - position[1]
                const dz = obj.position[2] - position[2]
                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)
                
                // 在爆炸范围内
                if (distance <= radius + obj.size) {
                    // 距离越远伤害越小（线性衰减）
                    const damagePercent = Math.max(0, 1 - distance / (radius + obj.size))
                    const actualDamage = damage * damagePercent
                    
                    const newHealth = Math.max(0, obj.health - actualDamage)
                    totalDamage += actualDamage
                    
                    newMap.set(id, {
                        ...obj,
                        health: newHealth
                    })
                    
                    if (newHealth <= 0) {
                        message.success(`💥 ${obj.type === 'tank' ? '敌方坦克' : '建筑物'}被摧毁！`)
                    } else {
                        message.info(`⚡ 造成 ${Math.round(actualDamage)} 点伤害`)
                    }
                }
            })
            
            return newMap
        })
    }, [])
    
    // 生成随机树木位置 - 减少数量优化性能
    const treePositions = React.useMemo(() => {
        const positions: [number, number, number][] = []
        for (let i = 0; i < 25; i++) {
            const x = (Math.random() - 0.5) * 150
            const z = (Math.random() - 0.5) * 150
            if (Math.abs(x) > 20 || Math.abs(z) > 20) {
                positions.push([x, 0, z])
            }
        }
        return positions
    }, [])
    
    // 生成随机岩石位置 - 减少数量优化性能
    const rockPositions = React.useMemo(() => {
        const positions: { pos: [number, number, number], scale: number }[] = []
        for (let i = 0; i < 10; i++) {
            const x = (Math.random() - 0.5) * 100
            const z = (Math.random() - 0.5) * 100
            if (Math.abs(x) > 15 || Math.abs(z) > 15) {
                positions.push({ pos: [x, 0, z], scale: 0.8 + Math.random() * 1 })
            }
        }
        return positions
    }, [])
    
    return (
        <>
            {/* 天空渐变 */}
            <color attach="background" args={['#87ceeb']} />
            <fog attach="fog" args={['#a8c8d8', 50, 200]} />
            
            {/* 光照系统 */}
            <ambientLight intensity={0.6} />
            <directionalLight 
                position={[50, 80, 30]} 
                intensity={1.5} 
                castShadow
                shadow-mapSize={[2048, 2048]}
                shadow-camera-far={200}
                shadow-camera-left={-100}
                shadow-camera-right={100}
                shadow-camera-top={100}
                shadow-camera-bottom={-100}
            />
            <hemisphereLight args={['#87ceeb', '#3d5c3d', 0.4]} />
            
            {/* 地面 - 多层次 */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                <planeGeometry args={[500, 500]} />
                <meshStandardMaterial color="#4a6741" roughness={0.95} />
            </mesh>
            
            {/* 道路 */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
                <planeGeometry args={[8, 200]} />
                <meshStandardMaterial color="#5d4e37" roughness={1} />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
                <planeGeometry args={[200, 8]} />
                <meshStandardMaterial color="#5d4e37" roughness={1} />
            </mesh>
            
            {/* 树木 */}
            {treePositions.map((pos, i) => (
                <Tree key={i} position={pos} />
            ))}
            
            {/* 岩石 */}
            {rockPositions.map((rock, i) => (
                <Rock key={i} position={rock.pos} scale={rock.scale} />
            ))}
            
            {/* 建筑物 - 可破坏 */}
            {Array.from(destructibleObjects.values())
                .filter(obj => obj.type === 'building' && obj.health > 0)
                .map(obj => (
                    <Building 
                        key={obj.id}
                        id={obj.id}
                        position={obj.position} 
                        size={obj.id === 'building-1' ? [8, 10, 6] : [10, 8, 8]}
                        health={obj.health}
                        maxHealth={obj.maxHealth}
                        onDestroy={() => {
                            setDestructibleObjects(prev => {
                                const newMap = new Map(prev)
                                newMap.delete(obj.id)
                                return newMap
                            })
                        }}
                    />
                ))}
            
            {/* 敌方坦克目标 - 可破坏 */}
            {Array.from(destructibleObjects.values())
                .filter(obj => obj.type === 'tank' && obj.health > 0)
                .map(obj => (
                    <EnemyTank 
                        key={obj.id}
                        id={obj.id}
                        position={obj.position} 
                        rotation={obj.id === 'enemy-tank-1' ? Math.PI / 4 : -Math.PI / 3}
                        health={obj.health}
                        maxHealth={obj.maxHealth}
                        onDestroy={() => {
                            setDestructibleObjects(prev => {
                                const newMap = new Map(prev)
                                newMap.delete(obj.id)
                                return newMap
                            })
                        }}
                    />
                ))}
            
            {/* 沙袋掩体 */}
            <Sandbags position={[15, 0, 10]} />
            <Sandbags position={[-15, 0, -10]} />
            
            {/* 草地装饰 - 减少数量 */}
            
            {/* 根据装备类型选择控制模式 */}
            {equipment.type === 'tank' && (
                <TankControlMode 
                    equipment={equipment} 
                    onExit={onExit} 
                    onHUDUpdate={onHUDUpdate} 
                    onMouseUpdate={onMouseUpdate}
                    onDamage={applyDamage}
                    destructibleObjects={destructibleObjects}
                />
            )}
            {(equipment.type === 'rifle' || equipment.type === 'pistol') && (
                <WeaponControlMode 
                    equipment={equipment} 
                    onExit={onExit} 
                    onHUDUpdate={onHUDUpdate}
                    onDamage={applyDamage}
                    onMouseUpdate={onMouseUpdate}
                />
            )}
            {equipment.type === 'fighter' && <FighterControlMode equipment={equipment} onExit={onExit} />}
            {(equipment.type === 'cannon' || equipment.type === 'rocket') && <CannonControlMode equipment={equipment} onExit={onExit} />}
            {equipment.type === 'drone' && <FighterControlMode equipment={equipment} onExit={onExit} />}
        </>
    )
}

// 装备图标组件
const EquipmentIcon = ({ type, name: _name }: { type: EquipmentType, name: string }) => {
    const iconStyle: React.CSSProperties = {
        width: '80px',
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 15px',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, rgba(201, 165, 92, 0.2) 0%, rgba(201, 165, 92, 0.05) 100%)',
        border: '2px solid rgba(201, 165, 92, 0.3)'
    }
    
    // 根据装备类型返回SVG图标
    if (type === 'tank') {
        return (
            <div style={iconStyle}>
                <svg width="50" height="50" viewBox="0 0 64 64" fill="none">
                    <rect x="8" y="35" width="48" height="14" rx="2" fill="#4a5568"/>
                    <rect x="15" y="25" width="34" height="15" rx="3" fill="#718096"/>
                    <rect x="35" y="28" width="30" height="5" rx="1" fill="#2d3748"/>
                    <circle cx="16" cy="45" r="5" fill="#2d3748"/>
                    <circle cx="28" cy="45" r="5" fill="#2d3748"/>
                    <circle cx="40" cy="45" r="5" fill="#2d3748"/>
                    <circle cx="52" cy="45" r="5" fill="#2d3748"/>
                    <rect x="5" y="40" width="54" height="8" rx="2" fill="#1a202c"/>
                </svg>
            </div>
        )
    }
    
    if (type === 'rifle' || type === 'pistol') {
        return (
            <div style={iconStyle}>
                <svg width="50" height="50" viewBox="0 0 64 64" fill="none">
                    <rect x="5" y="28" width="50" height="8" rx="2" fill="#4a5568"/>
                    <rect x="45" y="25" width="15" height="14" rx="2" fill="#718096"/>
                    <rect x="35" y="32" width="12" height="18" rx="2" fill="#2d3748"/>
                    <rect x="8" y="30" width="8" height="4" fill="#1a202c"/>
                    <circle cx="58" cy="32" r="2" fill="#c9a55c"/>
                </svg>
            </div>
        )
    }
    
    if (type === 'fighter') {
        return (
            <div style={iconStyle}>
                <svg width="50" height="50" viewBox="0 0 64 64" fill="none">
                    <path d="M32 5 L36 25 L55 35 L36 38 L34 55 L32 45 L30 55 L28 38 L9 35 L28 25 Z" fill="#718096"/>
                    <path d="M32 10 L34 25 L32 28 L30 25 Z" fill="#4a5568"/>
                    <circle cx="32" cy="30" r="3" fill="#c9a55c"/>
                    <rect x="28" y="35" width="8" height="15" rx="1" fill="#4a5568"/>
                </svg>
            </div>
        )
    }
    
    if (type === 'drone') {
        return (
            <div style={iconStyle}>
                <svg width="50" height="50" viewBox="0 0 64 64" fill="none">
                    <ellipse cx="32" cy="32" rx="25" ry="8" fill="#718096"/>
                    <rect x="28" y="28" width="8" height="8" rx="2" fill="#4a5568"/>
                    <circle cx="12" cy="32" r="6" fill="#2d3748"/>
                    <circle cx="52" cy="32" r="6" fill="#2d3748"/>
                    <line x1="18" y1="32" x2="26" y2="32" stroke="#1a202c" strokeWidth="2"/>
                    <line x1="38" y1="32" x2="46" y2="32" stroke="#1a202c" strokeWidth="2"/>
                    <circle cx="32" cy="32" r="2" fill="#c9a55c"/>
                </svg>
            </div>
        )
    }
    
    if (type === 'cannon' || type === 'rocket') {
        return (
            <div style={iconStyle}>
                <svg width="50" height="50" viewBox="0 0 64 64" fill="none">
                    <rect x="10" y="40" width="44" height="10" rx="2" fill="#4a5568"/>
                    <rect x="20" y="20" width="24" height="25" rx="3" fill="#718096"/>
                    <rect x="28" y="5" width="8" height="20" rx="2" fill="#2d3748"/>
                    <circle cx="20" cy="50" r="4" fill="#1a202c"/>
                    <circle cx="44" cy="50" r="4" fill="#1a202c"/>
                    <rect x="30" y="8" width="4" height="5" fill="#c9a55c"/>
                </svg>
            </div>
        )
    }
    
    return <div style={iconStyle}><span style={{ fontSize: '40px' }}>🔧</span></div>
}

// HUD状态类型
interface HUDState {
    speed: number
    ammo: number
    maxAmmo: number
    turretAngle: number
    cannonAngle: number
    pitchAngle?: number
    yawAngle?: number
    isReloading: boolean
    isAiming?: boolean
    equipmentName: string
    equipmentType: string
    damage?: number
    armor?: number
    explosionRadius?: number
    maxSpeed?: number
    range?: number
    accuracy?: number
    penetration?: number
}

// 装备交互主组件
const EquipmentInteraction: React.FC = () => {
    const [selectedEquipment, setSelectedEquipment] = useState<EquipmentConfig | null>(null)
    const [showEquipmentList, setShowEquipmentList] = useState(true)
    const [hudState, setHudState] = useState<HUDState>({
        speed: 0,
        ammo: 30,
        maxAmmo: 30,
        turretAngle: 0,
        cannonAngle: 0,
        isReloading: false,
        equipmentName: '',
        equipmentType: ''
    })
    
    const handleSelectEquipment = (equipment: EquipmentConfig) => {
        setSelectedEquipment(equipment)
        setShowEquipmentList(false)
        
        const tankStats = TANK_STATS[equipment.id]
        setHudState(prev => ({ 
            ...prev, 
            equipmentName: equipment.name,
            equipmentType: equipment.type,
            ammo: equipment.type === 'pistol' ? 15 : (tankStats?.ammo || 30),
            maxAmmo: equipment.type === 'pistol' ? 15 : (tankStats?.ammo || 30),
            damage: tankStats?.damage,
            armor: tankStats?.armor,
            explosionRadius: tankStats?.explosionRadius,
            maxSpeed: tankStats?.speed
        }))
        message.success(`已选择 ${equipment.name}，点击画面开始操作`)
    }
    
    const handleExit = () => {
        setSelectedEquipment(null)
        setShowEquipmentList(true)
        document.exitPointerLock()
    }
    
    const handleHUDUpdate = (state: Partial<HUDState>) => {
        setHudState(prev => ({ ...prev, ...state }))
    }
    
    const handleMouseUpdate = (_x: number, _y: number) => {
        // 鼠标位置更新（保留接口，以备将来使用）
    }
    
    return (
        <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
            {/* 装备选择界面 */}
            {showEquipmentList && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, #0f1419 0%, #1a2634 50%, #0f1419 100%)',
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    padding: '120px 40px 40px',
                    overflow: 'auto'
                }}>
                    <div style={{
                        background: 'rgba(15, 20, 25, 0.95)',
                        padding: '40px',
                        borderRadius: '20px',
                        maxWidth: '1400px',
                        width: '100%',
                        border: '2px solid rgba(201, 165, 92, 0.4)',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
                    }}>
                        <h2 style={{
                            color: '#c9a55c',
                            fontSize: '36px',
                            marginBottom: '10px',
                            textAlign: 'center',
                            textShadow: '0 0 20px rgba(201, 165, 92, 0.3)'
                        }}>
                            🎮 装备操作系统
                        </h2>
                        <p style={{
                            color: '#888',
                            fontSize: '16px',
                            marginBottom: '40px',
                            textAlign: 'center'
                        }}>
                            选择装备进行真实操作体验 · 支持键鼠控制
                        </p>
                        
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                            gap: '25px'
                        }}>
                            {EQUIPMENT_CONFIGS.map((equipment) => (
                                <Card
                                    key={equipment.id}
                                    hoverable
                                    onClick={() => handleSelectEquipment(equipment)}
                                    style={{
                                        background: 'linear-gradient(145deg, rgba(201, 165, 92, 0.08) 0%, rgba(26, 38, 52, 0.9) 100%)',
                                        border: '2px solid rgba(201, 165, 92, 0.2)',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        borderRadius: '16px'
                                    }}
                                    bodyStyle={{ padding: '25px' }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'linear-gradient(145deg, rgba(201, 165, 92, 0.15) 0%, rgba(26, 38, 52, 0.95) 100%)'
                                        e.currentTarget.style.borderColor = '#c9a55c'
                                        e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)'
                                        e.currentTarget.style.boxShadow = '0 15px 40px rgba(201, 165, 92, 0.2)'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'linear-gradient(145deg, rgba(201, 165, 92, 0.08) 0%, rgba(26, 38, 52, 0.9) 100%)'
                                        e.currentTarget.style.borderColor = 'rgba(201, 165, 92, 0.2)'
                                        e.currentTarget.style.transform = 'translateY(0) scale(1)'
                                        e.currentTarget.style.boxShadow = 'none'
                                    }}
                                >
                                    <div style={{ textAlign: 'center' }}>
                                        <EquipmentIcon type={equipment.type} name={equipment.name} />
                                        <h3 style={{ 
                                            color: '#c9a55c', 
                                            margin: '10px 0', 
                                            fontSize: '18px',
                                            fontWeight: 'bold'
                                        }}>
                                            {equipment.name}
                                        </h3>
                                        <p style={{ 
                                            color: '#888', 
                                            fontSize: '13px', 
                                            marginBottom: '15px',
                                            lineHeight: '1.5'
                                        }}>
                                            {equipment.description}
                                        </p>
                                        <div style={{ 
                                            display: 'flex', 
                                            flexWrap: 'wrap', 
                                            gap: '6px',
                                            justifyContent: 'center'
                                        }}>
                                            {equipment.controls.slice(0, 3).map((control, i) => (
                                                <Tag 
                                                    key={i} 
                                                    color="blue" 
                                                    style={{ 
                                                        fontSize: '11px',
                                                        padding: '2px 8px',
                                                        borderRadius: '4px'
                                                    }}
                                                >
                                                    {control}
                                                </Tag>
                                            ))}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            
            {/* 3D交互场景 */}
            <Canvas 
                shadows 
                camera={{ position: [0, 5, 10], fov: 75 }}
                gl={{ antialias: true }}
                style={{ outline: 'none' }}
            >
                <PerspectiveCamera makeDefault position={[0, 5, 10]} fov={75} />
                <InteractionScene equipment={selectedEquipment} onExit={handleExit} onHUDUpdate={handleHUDUpdate} onMouseUpdate={handleMouseUpdate} />
            </Canvas>
            
            {/* 准星 - 固定在屏幕中心（FPS标准） */}
            {!showEquipmentList && (selectedEquipment?.type === 'rifle' || selectedEquipment?.type === 'pistol') && (
                <div 
                    id="crosshair"
                    style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        pointerEvents: 'none',
                        zIndex: 1000
                    }}
                >
                    {/* 外圈 - 瞄准时变小 */}
                    <div style={{ 
                        width: hudState.isAiming ? '30px' : '50px', 
                        height: hudState.isAiming ? '30px' : '50px', 
                        border: '2px solid rgba(201, 165, 92, 0.7)', 
                        borderRadius: '50%',
                        position: 'absolute',
                        left: hudState.isAiming ? '-15px' : '-25px',
                        top: hudState.isAiming ? '-15px' : '-25px',
                        transition: 'all 0.2s ease'
                    }} />
                    {/* 十字线 - 瞄准时变短 */}
                    <div style={{ 
                        width: hudState.isAiming ? '20px' : '40px', 
                        height: '2px', 
                        background: '#c9a55c', 
                        position: 'absolute', 
                        left: hudState.isAiming ? '-10px' : '-20px', 
                        top: '-1px', 
                        boxShadow: '0 0 4px rgba(0,0,0,0.8)',
                        transition: 'all 0.2s ease'
                    }} />
                    <div style={{ 
                        width: '2px', 
                        height: hudState.isAiming ? '20px' : '40px', 
                        background: '#c9a55c', 
                        position: 'absolute', 
                        left: '-1px', 
                        top: hudState.isAiming ? '-10px' : '-20px', 
                        boxShadow: '0 0 4px rgba(0,0,0,0.8)',
                        transition: 'all 0.2s ease'
                    }} />
                    {/* 中心红点 */}
                    <div style={{ 
                        width: '6px', 
                        height: '6px', 
                        background: '#ff3333', 
                        borderRadius: '50%', 
                        position: 'absolute', 
                        left: '-3px', 
                        top: '-3px',
                        boxShadow: '0 0 6px #ff0000'
                    }} />
                    {/* 外圈刻度 - 瞄准时隐藏 */}
                    {!hudState.isAiming && (
                        <>
                            <div style={{ width: '10px', height: '2px', background: '#c9a55c', position: 'absolute', left: '-32px', top: '-1px' }} />
                            <div style={{ width: '10px', height: '2px', background: '#c9a55c', position: 'absolute', left: '22px', top: '-1px' }} />
                            <div style={{ width: '2px', height: '10px', background: '#c9a55c', position: 'absolute', left: '-1px', top: '-32px' }} />
                            <div style={{ width: '2px', height: '10px', background: '#c9a55c', position: 'absolute', left: '-1px', top: '22px' }} />
                        </>
                    )}
                </div>
            )}
            
            {/* 固定HUD信息框 - 左上角 */}
            {!showEquipmentList && (
                <div style={{
                    position: 'fixed',
                    top: '80px',
                    left: '20px',
                    background: 'rgba(0, 0, 0, 0.85)',
                    padding: '15px 20px',
                    borderRadius: '10px',
                    color: '#fff',
                    minWidth: '240px',
                    border: '2px solid #c9a55c',
                    fontFamily: 'monospace',
                    zIndex: 1000
                }}>
                    <div style={{ marginBottom: '10px', fontSize: '18px', fontWeight: 'bold', color: '#c9a55c' }}>
                        🛡️ {hudState.equipmentName}
                    </div>
                    <div style={{ fontSize: '13px', lineHeight: '1.8' }}>
                        <div>
                            <span style={{ color: '#888' }}>速度:</span> 
                            <span style={{ color: hudState.speed > 0 ? '#52c41a' : hudState.speed < 0 ? '#ff4d4f' : '#fff', marginLeft: '8px', fontWeight: 'bold' }}>
                                {hudState.speed.toFixed(0)}/{hudState.maxSpeed || 0} km/h
                            </span>
                        </div>
                        <div>
                            <span style={{ color: '#888' }}>弹药:</span> 
                            <span style={{ color: hudState.ammo > hudState.maxAmmo * 0.3 ? '#52c41a' : hudState.ammo > hudState.maxAmmo * 0.1 ? '#faad14' : '#ff4d4f', marginLeft: '8px', fontWeight: 'bold' }}>
                                {hudState.ammo}/{hudState.maxAmmo}
                            </span>
                        </div>
                        {hudState.equipmentType === 'tank' && (
                            <>
                                <div>
                                    <span style={{ color: '#888' }}>炮塔:</span> 
                                    <span style={{ marginLeft: '8px' }}>{((hudState.turretAngle % (Math.PI * 2)) * 180 / Math.PI).toFixed(1)}°</span>
                                </div>
                                <div>
                                    <span style={{ color: '#888' }}>仰角:</span> 
                                    <span style={{ marginLeft: '8px' }}>{(hudState.cannonAngle * 180 / Math.PI).toFixed(1)}°</span>
                                </div>
                                {hudState.damage && (
                                    <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #333' }}>
                                        <div>
                                            <span style={{ color: '#888' }}>伤害:</span> 
                                            <span style={{ color: '#ff4d4f', marginLeft: '8px', fontWeight: 'bold' }}>{hudState.damage}</span>
                                        </div>
                                        <div>
                                            <span style={{ color: '#888' }}>装甲:</span> 
                                            <span style={{ color: '#52c41a', marginLeft: '8px', fontWeight: 'bold' }}>{hudState.armor}</span>
                                        </div>
                                        <div>
                                            <span style={{ color: '#888' }}>爆炸范围:</span> 
                                            <span style={{ color: '#faad14', marginLeft: '8px', fontWeight: 'bold' }}>{hudState.explosionRadius}m</span>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                        {(hudState.equipmentType === 'rifle' || hudState.equipmentType === 'pistol') && (
                            <>
                                {hudState.pitchAngle !== undefined && (
                                    <div>
                                        <span style={{ color: '#888' }}>俯仰:</span> 
                                        <span style={{ marginLeft: '8px' }}>{(hudState.pitchAngle * 180 / Math.PI).toFixed(1)}°</span>
                                    </div>
                                )}
                                {hudState.yawAngle !== undefined && (
                                    <div>
                                        <span style={{ color: '#888' }}>偏航:</span> 
                                        <span style={{ marginLeft: '8px' }}>{(hudState.yawAngle * 180 / Math.PI).toFixed(1)}°</span>
                                    </div>
                                )}
                                {hudState.isAiming && (
                                    <div style={{ color: '#52c41a', marginTop: '5px' }}>🎯 瞄准中</div>
                                )}
                                {hudState.damage && (
                                    <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #333' }}>
                                        <div>
                                            <span style={{ color: '#888' }}>伤害:</span> 
                                            <span style={{ color: '#ff4d4f', marginLeft: '8px', fontWeight: 'bold' }}>{hudState.damage}</span>
                                        </div>
                                        {hudState.range && (
                                            <div>
                                                <span style={{ color: '#888' }}>射程:</span> 
                                                <span style={{ color: '#52c41a', marginLeft: '8px', fontWeight: 'bold' }}>{hudState.range}m</span>
                                            </div>
                                        )}
                                        {hudState.accuracy !== undefined && (
                                            <div>
                                                <span style={{ color: '#888' }}>精度:</span> 
                                                <span style={{ color: '#faad14', marginLeft: '8px', fontWeight: 'bold' }}>{(hudState.accuracy * 100).toFixed(0)}%</span>
                                            </div>
                                        )}
                                        {hudState.penetration && (
                                            <div>
                                                <span style={{ color: '#888' }}>穿透:</span> 
                                                <span style={{ color: '#1890ff', marginLeft: '8px', fontWeight: 'bold' }}>{hudState.penetration}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                        {hudState.isReloading && (
                            <div style={{ color: '#ff4d4f', marginTop: '5px' }}>⏳ 装弹中...</div>
                        )}
                    </div>
                    <div style={{ fontSize: '10px', color: '#666', marginTop: '10px', borderTop: '1px solid #333', paddingTop: '8px' }}>
                        {hudState.equipmentType === 'tank' 
                            ? 'WASD移动 | 鼠标炮塔 | 空格开火'
                            : 'WASD移动 | 鼠标瞄准 | 左键射击'}
                        <br />R装弹 | ESC退出
                    </div>
                </div>
            )}
        </div>
    )
}

export default EquipmentInteraction
