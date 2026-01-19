import React from 'react'
import { Box, Cylinder, Torus, RoundedBox } from '@react-three/drei'

// 15式轻型坦克 - 深度优化版（超精细建模）
export const Type15Tank = React.memo(({ position, rotation }: { position: [number, number, number], rotation?: [number, number, number] }) => {
    return (
        <group position={position} rotation={rotation || [0, 0, 0]}>
            {/* 车体主体 - 优化材质和细节 */}
            <RoundedBox args={[3.5, 0.9, 2.4]} radius={0.1} position={[0, 0.45, 0]}>
                <meshStandardMaterial color="#3d4a3d" roughness={0.35} metalness={0.75} />
            </RoundedBox>
            
            {/* 车体表面细节 - 更多铆钉和焊缝 */}
            {[-1.6, -1.0, -0.3, 0.3, 1.0, 1.6].map((x, i) => (
                <Cylinder key={i} args={[0.025, 0.025, 0.06, 12]} position={[x, 0.92, 1.05]}>
                    <meshStandardMaterial color="#1a1a1a" roughness={0.25} metalness={0.85} />
                </Cylinder>
            ))}
            {/* 侧边铆钉 */}
            {[-0.8, 0, 0.8].map((z, i) => (
                <Cylinder key={i} args={[0.02, 0.02, 0.05, 8]} position={[1.78, 0.9, z]}>
                    <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
                </Cylinder>
            ))}
            {[-0.8, 0, 0.8].map((z, i) => (
                <Cylinder key={i} args={[0.02, 0.02, 0.05, 8]} position={[-1.78, 0.9, z]}>
                    <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
                </Cylinder>
            ))}
            
            {/* 车体前装甲板 */}
            <Box args={[3.5, 0.9, 0.15]} position={[0, 0.45, 1.275]} rotation={[0.1, 0, 0]}>
                <meshStandardMaterial color="#3a4a3a" roughness={0.4} metalness={0.7} />
            </Box>
            
            {/* 车体后装甲板 */}
            <Box args={[3.5, 0.9, 0.15]} position={[0, 0.45, -1.275]} rotation={[-0.1, 0, 0]}>
                <meshStandardMaterial color="#3a4a3a" roughness={0.4} metalness={0.7} />
            </Box>
            
            {/* 侧装甲板 */}
            <Box args={[0.15, 0.9, 2.4]} position={[1.775, 0.45, 0]}>
                <meshStandardMaterial color="#3a4a3a" roughness={0.4} metalness={0.7} />
            </Box>
            <Box args={[0.15, 0.9, 2.4]} position={[-1.775, 0.45, 0]}>
                <meshStandardMaterial color="#3a4a3a" roughness={0.4} metalness={0.7} />
            </Box>
            
            {/* 履带系统 - 增强版 */}
            {[-1.3, -0.65, 0, 0.65, 1.3].map((x, i) => (
                <group key={i}>
                    {/* 负重轮外圈 */}
                    <Cylinder args={[0.33, 0.33, 0.26, 20]} rotation={[Math.PI / 2, 0, 0]} position={[x, 0.25, 0]}>
                        <meshStandardMaterial color="#0f0f0f" roughness={0.4} metalness={0.75} />
                    </Cylinder>
                    {/* 负重轮主体 */}
                    <Cylinder args={[0.32, 0.32, 0.25, 20]} rotation={[Math.PI / 2, 0, 0]} position={[x, 0.25, 0]}>
                        <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
                    </Cylinder>
                    {/* 轮毂外圈 */}
                    <Cylinder args={[0.16, 0.16, 0.27, 12]} rotation={[Math.PI / 2, 0, 0]} position={[x, 0.25, 0]}>
                        <meshStandardMaterial color="#2a2a2a" roughness={0.2} metalness={0.9} />
                    </Cylinder>
                    {/* 轮毂中心 */}
                    <Cylinder args={[0.15, 0.15, 0.26, 12]} rotation={[Math.PI / 2, 0, 0]} position={[x, 0.25, 0]}>
                        <meshStandardMaterial color="#3a3a3a" roughness={0.15} metalness={0.95} />
                    </Cylinder>
                    {/* 轮辐 - 更精细 */}
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((j) => (
                        <Box key={j} args={[0.04, 0.22, 0.27]} rotation={[0, 0, j * Math.PI / 4]} position={[x, 0.25, 0]}>
                            <meshStandardMaterial color="#2a2a2a" roughness={0.25} metalness={0.8} />
                        </Box>
                    ))}
                    {/* 轮缘装饰 */}
                    <Torus args={[0.31, 0.02, 8, 20]} rotation={[Math.PI / 2, 0, 0]} position={[x, 0.25, 0]}>
                        <meshStandardMaterial color="#0a0a0a" roughness={0.5} metalness={0.7} />
                    </Torus>
                </group>
            ))}
            
            {/* 履带 - 增强版 */}
            <Box args={[3.2, 0.16, 2.5]} position={[0, 0.1, 0]}>
                <meshStandardMaterial color="#0a0a0a" roughness={0.85} metalness={0.25} />
            </Box>
            {/* 履带纹理 - 更密集更真实 */}
            {Array.from({ length: 24 }).map((_, i) => (
                <Box key={i} args={[0.12, 0.16, 0.18]} position={[-1.6 + (i * 0.13), 0.1, 1.25]}>
                    <meshStandardMaterial color="#1a1a1a" roughness={0.75} metalness={0.2} />
                </Box>
            ))}
            {Array.from({ length: 24 }).map((_, i) => (
                <Box key={i} args={[0.12, 0.16, 0.18]} position={[-1.6 + (i * 0.13), 0.1, -1.25]}>
                    <meshStandardMaterial color="#1a1a1a" roughness={0.75} metalness={0.2} />
                </Box>
            ))}
            {/* 履带连接销 */}
            {Array.from({ length: 12 }).map((_, i) => (
                <Cylinder key={i} args={[0.03, 0.03, 0.16, 8]} rotation={[0, 0, Math.PI / 2]} position={[-1.4 + (i * 0.26), 0.1, 1.25]}>
                    <meshStandardMaterial color="#0a0a0a" roughness={0.6} metalness={0.4} />
                </Cylinder>
            ))}
            {Array.from({ length: 12 }).map((_, i) => (
                <Cylinder key={i} args={[0.03, 0.03, 0.16, 8]} rotation={[0, 0, Math.PI / 2]} position={[-1.4 + (i * 0.26), 0.1, -1.25]}>
                    <meshStandardMaterial color="#0a0a0a" roughness={0.6} metalness={0.4} />
                </Cylinder>
            ))}
            
            {/* 诱导轮 */}
            <Cylinder args={[0.28, 0.28, 0.2, 16]} rotation={[Math.PI / 2, 0, 0]} position={[-1.6, 0.25, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
            </Cylinder>
            <Cylinder args={[0.28, 0.28, 0.2, 16]} rotation={[Math.PI / 2, 0, 0]} position={[1.6, 0.25, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
            </Cylinder>
            
            {/* 炮塔主体 - 增强版 */}
            <group position={[0, 0.9, 0]}>
                <RoundedBox args={[2.0, 0.7, 1.8]} radius={0.15} position={[0, 0.35, 0]}>
                    <meshStandardMaterial color="#4a5a4a" roughness={0.45} metalness={0.65} />
                </RoundedBox>
                
                {/* 炮塔顶部 */}
                <Box args={[2.0, 0.12, 1.8]} position={[0, 0.76, 0]}>
                    <meshStandardMaterial color="#3a4a3a" roughness={0.4} metalness={0.7} />
                </Box>
                
                {/* 炮塔前装甲 - 复合装甲效果 */}
                <Box args={[2.0, 0.7, 0.18]} position={[0, 0.35, 0.98]} rotation={[0.15, 0, 0]}>
                    <meshStandardMaterial color="#3a4a3a" roughness={0.4} metalness={0.7} />
                </Box>
                {/* 前装甲装饰条 */}
                <Box args={[1.8, 0.05, 0.2]} position={[0, 0.6, 1.05]} rotation={[0.15, 0, 0]}>
                    <meshStandardMaterial color="#2a3a2a" roughness={0.5} metalness={0.6} />
                </Box>
                
                {/* 炮塔侧装甲 */}
                <Box args={[0.18, 0.7, 1.8]} position={[1.09, 0.35, 0]}>
                    <meshStandardMaterial color="#3a4a3a" roughness={0.4} metalness={0.7} />
                </Box>
                <Box args={[0.18, 0.7, 1.8]} position={[-1.09, 0.35, 0]}>
                    <meshStandardMaterial color="#3a4a3a" roughness={0.4} metalness={0.7} />
                </Box>
                
                {/* 炮塔细节 - 观察窗 - 增强版 */}
                <Box args={[0.35, 0.18, 0.06]} position={[-0.5, 0.5, 1.02]}>
                    <meshStandardMaterial color="#0a0a0a" roughness={0.05} metalness={0.95} />
                </Box>
                <Box args={[0.35, 0.18, 0.06]} position={[0.5, 0.5, 1.02]}>
                    <meshStandardMaterial color="#0a0a0a" roughness={0.05} metalness={0.95} />
                </Box>
                {/* 观察窗边框 */}
                <Box args={[0.38, 0.21, 0.07]} position={[-0.5, 0.5, 1.015]}>
                    <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
                </Box>
                <Box args={[0.38, 0.21, 0.07]} position={[0.5, 0.5, 1.015]}>
                    <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
                </Box>
                
                {/* 炮塔顶部细节 - 传感器和天线 */}
                <Box args={[0.45, 0.14, 0.45]} position={[-0.6, 0.81, 0.3]}>
                    <meshStandardMaterial color="#2a2a2a" roughness={0.5} metalness={0.6} />
                </Box>
                <Box args={[0.45, 0.14, 0.45]} position={[0.6, 0.81, 0.3]}>
                    <meshStandardMaterial color="#2a2a2a" roughness={0.5} metalness={0.6} />
                </Box>
                {/* 传感器细节 */}
                <Cylinder args={[0.08, 0.08, 0.1, 12]} position={[-0.6, 0.88, 0.3]}>
                    <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.9} />
                </Cylinder>
                <Cylinder args={[0.08, 0.08, 0.1, 12]} position={[0.6, 0.88, 0.3]}>
                    <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.9} />
                </Cylinder>
                {/* 炮塔顶部天线 */}
                <Cylinder args={[0.03, 0.03, 0.25, 8]} position={[0, 0.9, -0.3]}>
                    <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.9} />
                </Cylinder>
            </group>
            
            {/* 主炮管 - 增强版 */}
            <Cylinder args={[0.125, 0.125, 3.8, 20]} rotation={[0, 0, -Math.PI / 2]} position={[2.9, 1.05, 0]}>
                <meshStandardMaterial color="#2a2a2a" roughness={0.28} metalness={0.88} />
            </Cylinder>
            
            {/* 炮管根部 - 更精细 */}
            <Cylinder args={[0.19, 0.19, 0.45, 20]} rotation={[0, 0, -Math.PI / 2]} position={[2.0, 1.05, 0]}>
                <meshStandardMaterial color="#3a3a3a" roughness={0.4} metalness={0.8} />
            </Cylinder>
            {/* 炮管根部装饰环 */}
            <Torus args={[0.18, 0.02, 8, 20]} rotation={[0, Math.PI / 2, 0]} position={[2.0, 1.05, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.85} />
            </Torus>
            
            {/* 炮口制退器 - 更精细 */}
            <Cylinder args={[0.16, 0.125, 0.35, 20]} rotation={[0, 0, -Math.PI / 2]} position={[4.775, 1.05, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.18} metalness={0.92} />
            </Cylinder>
            {/* 制退器细节 */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
                <Box key={i} args={[0.02, 0.08, 0.35]} rotation={[0, 0, i * Math.PI / 3]} position={[4.775, 1.05, 0]}>
                    <meshStandardMaterial color="#0a0a0a" roughness={0.15} metalness={0.95} />
                </Box>
            ))}
            
            {/* 炮管细节 - 热护套 - 增强版 */}
            <Cylinder args={[0.145, 0.145, 2.5, 20]} rotation={[0, 0, -Math.PI / 2]} position={[3.5, 1.05, 0]}>
                <meshStandardMaterial color="#4a4a4a" roughness={0.65} metalness={0.25} />
            </Cylinder>
            {/* 热护套固定环 */}
            <Torus args={[0.14, 0.015, 8, 20]} rotation={[0, Math.PI / 2, 0]} position={[2.5, 1.05, 0]}>
                <meshStandardMaterial color="#3a3a3a" roughness={0.5} metalness={0.5} />
            </Torus>
            <Torus args={[0.14, 0.015, 8, 20]} rotation={[0, Math.PI / 2, 0]} position={[4.5, 1.05, 0]}>
                <meshStandardMaterial color="#3a3a3a" roughness={0.5} metalness={0.5} />
            </Torus>
            
            {/* 同轴机枪 - 增强版 */}
            <Cylinder args={[0.035, 0.035, 0.45, 12]} rotation={[0, 0, -Math.PI / 2]} position={[2.225, 1.0, 0.2]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.18} metalness={0.92} />
            </Cylinder>
            {/* 机枪支架 */}
            <Box args={[0.08, 0.06, 0.1]} position={[2.0, 0.95, 0.2]}>
                <meshStandardMaterial color="#2a2a2a" roughness={0.3} metalness={0.8} />
            </Box>
            
            {/* 车体细节 - 工具箱 - 增强版 */}
            <Box args={[0.32, 0.22, 0.42]} position={[-1.2, 0.7, -1.0]}>
                <meshStandardMaterial color="#3a3a3a" roughness={0.5} metalness={0.5} />
            </Box>
            <Box args={[0.32, 0.22, 0.42]} position={[1.2, 0.7, -1.0]}>
                <meshStandardMaterial color="#3a3a3a" roughness={0.5} metalness={0.5} />
            </Box>
            {/* 工具箱把手 */}
            <Box args={[0.15, 0.03, 0.05]} position={[-1.2, 0.81, -1.0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
            </Box>
            <Box args={[0.15, 0.03, 0.05]} position={[1.2, 0.81, -1.0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
            </Box>
            {/* 工具箱锁 */}
            <Cylinder args={[0.04, 0.04, 0.02, 8]} position={[-1.2, 0.7, -0.75]}>
                <meshStandardMaterial color="#0a0a0a" roughness={0.2} metalness={0.9} />
            </Cylinder>
            <Cylinder args={[0.04, 0.04, 0.02, 8]} position={[1.2, 0.7, -0.75]}>
                <meshStandardMaterial color="#0a0a0a" roughness={0.2} metalness={0.9} />
            </Cylinder>
            
            {/* 车体细节 - 天线基座 - 增强版 */}
            <Cylinder args={[0.06, 0.06, 0.18, 12]} position={[-0.8, 0.86, -1.1]}>
                <meshStandardMaterial color="#2a2a2a" roughness={0.3} metalness={0.8} />
            </Cylinder>
            <Cylinder args={[0.025, 0.025, 0.35, 8]} position={[-0.8, 1.08, -1.1]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.9} />
            </Cylinder>
            {/* 天线顶部 */}
            <Cylinder args={[0.03, 0.01, 0.08, 8]} position={[-0.8, 1.26, -1.1]}>
                <meshStandardMaterial color="#0a0a0a" roughness={0.15} metalness={0.95} />
            </Cylinder>
            
            {/* 车体细节 - 附加装甲板 - 增强版 */}
            <Box args={[0.45, 0.32, 0.12]} position={[-1.0, 0.6, 1.1]} rotation={[0, 0, 0.1]}>
                <meshStandardMaterial color="#2a3a2a" roughness={0.5} metalness={0.6} />
            </Box>
            <Box args={[0.45, 0.32, 0.12]} position={[1.0, 0.6, 1.1]} rotation={[0, 0, -0.1]}>
                <meshStandardMaterial color="#2a3a2a" roughness={0.5} metalness={0.6} />
            </Box>
            {/* 装甲板固定螺栓 */}
            {[-0.7, 0, 0.7].map((x, i) => (
                <Cylinder key={i} args={[0.02, 0.02, 0.12, 8]} position={[x, 0.6, 1.16]} rotation={[Math.PI / 2, 0, 0]}>
                    <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
                </Cylinder>
            ))}
            
            {/* 车体细节 - 侧裙板 - 增强版 */}
            <Box args={[0.06, 0.42, 2.2]} position={[1.8, 0.3, 0]}>
                <meshStandardMaterial color="#2a2a2a" roughness={0.6} metalness={0.5} />
            </Box>
            <Box args={[0.06, 0.42, 2.2]} position={[-1.8, 0.3, 0]}>
                <meshStandardMaterial color="#2a2a2a" roughness={0.6} metalness={0.5} />
            </Box>
            {/* 侧裙板固定点 */}
            {[-0.8, 0, 0.8].map((z, i) => (
                <Cylinder key={i} args={[0.03, 0.03, 0.06, 8]} position={[1.8, 0.5, z]} rotation={[0, 0, Math.PI / 2]}>
                    <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.7} />
                </Cylinder>
            ))}
            {[-0.8, 0, 0.8].map((z, i) => (
                <Cylinder key={i} args={[0.03, 0.03, 0.06, 8]} position={[-1.8, 0.5, z]} rotation={[0, 0, Math.PI / 2]}>
                    <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.7} />
                </Cylinder>
            ))}
            
            {/* 车体细节 - 通风口 */}
            {[-0.8, 0.8].map((x, i) => (
                <Box key={i} args={[0.15, 0.08, 0.1]} position={[x, 0.85, -1.15]}>
                    <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.7} />
                </Box>
            ))}
            {/* 通风口格栅 */}
            {[-0.8, 0.8].map((x, i) => (
                Array.from({ length: 5 }).map((_, j) => (
                    <Box key={`${i}-${j}`} args={[0.02, 0.08, 0.12]} position={[x, 0.85, -1.15 + (j - 2) * 0.02]}>
                        <meshStandardMaterial color="#0a0a0a" roughness={0.5} metalness={0.6} />
                    </Box>
                ))
            ))}
            
            {/* 车体细节 - 标识牌 */}
            <Box args={[0.2, 0.1, 0.02]} position={[0, 0.75, 1.2]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
            </Box>
            <Box args={[0.18, 0.08, 0.03]} position={[0, 0.75, 1.21]}>
                <meshStandardMaterial color="#ffff00" roughness={0.4} metalness={0.1} />
            </Box>
        </group>
    )
})

// 191式手枪 - 精细建模
export const Type191Pistol = React.memo(({ position, rotation }: { position: [number, number, number], rotation?: [number, number, number] }) => {
    return (
        <group position={position} rotation={rotation || [0, 0, 0]} scale={[3.5, 3.5, 3.5]}>
            {/* 套筒主体 */}
            <RoundedBox args={[1.6, 0.32, 0.22]} radius={0.05} position={[0.1, 0.55, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.9} />
            </RoundedBox>
            
            {/* 套筒前部 */}
            <Box args={[0.4, 0.32, 0.22]} position={[0.9, 0.55, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.9} />
            </Box>
            
            {/* 套筒后部 - 击锤区域 */}
            <Box args={[0.3, 0.35, 0.24]} position={[-0.65, 0.57, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.9} />
            </Box>
            
            {/* 套筒顶部 - 瞄具座 */}
            <Box args={[1.2, 0.08, 0.15]} position={[0, 0.7, 0]}>
                <meshStandardMaterial color="#0a0a0a" roughness={0.15} metalness={0.95} />
            </Box>
            
            {/* 前瞄具 */}
            <Box args={[0.08, 0.12, 0.1]} position={[0.75, 0.72, 0]}>
                <meshStandardMaterial color="#0a0a0a" roughness={0.1} metalness={0.95} />
            </Box>
            
            {/* 后瞄具 */}
            <Box args={[0.12, 0.1, 0.1]} position={[-0.5, 0.72, 0]}>
                <meshStandardMaterial color="#0a0a0a" roughness={0.1} metalness={0.95} />
            </Box>
            
            {/* 套筒防滑纹 */}
            {Array.from({ length: 12 }).map((_, i) => (
                <Box key={i} args={[0.02, 0.3, 0.22]} position={[-0.5 + (i * 0.1), 0.55, 0]}>
                    <meshStandardMaterial color="#0a0a0a" roughness={0.3} metalness={0.8} />
                </Box>
            ))}
            
            {/* 套筒座/下机匣 */}
            <RoundedBox args={[1.5, 0.4, 0.2]} radius={0.05} position={[0, 0.15, 0]}>
                <meshStandardMaterial color="#2a2a2a" roughness={0.3} metalness={0.85} />
            </RoundedBox>
            
            {/* 握把 */}
            <Box args={[0.5, 0.9, 0.22]} position={[-0.6, -0.25, 0]} rotation={[0, 0, -0.15]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.7} />
            </Box>
            
            {/* 握把纹理 */}
            {Array.from({ length: 8 }).map((_, i) => (
                <Box key={i} args={[0.45, 0.05, 0.23]} position={[-0.6, -0.3 + (i * 0.12), 0]} rotation={[0, 0, -0.15]}>
                    <meshStandardMaterial color="#0a0a0a" roughness={0.6} metalness={0.5} />
                </Box>
            ))}
            
            {/* 扳机护圈 */}
            <Torus args={[0.2, 0.03, 8, 16]} position={[-0.3, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1.3, 1]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.85} />
            </Torus>
            
            {/* 扳机 */}
            <Box args={[0.15, 0.25, 0.05]} position={[-0.3, -0.05, 0.15]} rotation={[0.2, 0, 0]}>
                <meshStandardMaterial color="#0a0a0a" roughness={0.2} metalness={0.9} />
            </Box>
            
            {/* 弹匣 */}
            <Box args={[0.4, 0.7, 0.18]} position={[-0.6, -0.5, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.85} />
            </Box>
            
            {/* 弹匣底部 */}
            <Box args={[0.42, 0.1, 0.2]} position={[-0.6, -0.85, 0]}>
                <meshStandardMaterial color="#0a0a0a" roughness={0.2} metalness={0.9} />
            </Box>
            
            {/* 套筒座细节 - 导轨 */}
            <Box args={[0.6, 0.05, 0.12]} position={[0.3, 0.35, 0]}>
                <meshStandardMaterial color="#0a0a0a" roughness={0.2} metalness={0.9} />
            </Box>
            
            {/* 套筒座细节 - 弹匣井 */}
            <Box args={[0.35, 0.15, 0.2]} position={[-0.6, -0.15, 0]} rotation={[0, 0, -0.15]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.85} />
            </Box>
            
            {/* 套筒座细节 - 空仓挂机杆 */}
            <Box args={[0.08, 0.12, 0.05]} position={[0.7, 0.2, 0.12]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.85} />
            </Box>
            
            {/* 套筒座细节 - 弹匣释放按钮 */}
            <Cylinder args={[0.04, 0.04, 0.08, 8]} rotation={[0, 0, Math.PI / 2]} position={[-0.75, -0.1, 0.12]}>
                <meshStandardMaterial color="#0a0a0a" roughness={0.2} metalness={0.9} />
            </Cylinder>
        </group>
    )
})

// 20式模块化步枪 - 精细建模
export const Type20Rifle = React.memo(({ position, rotation }: { position: [number, number, number], rotation?: [number, number, number] }) => {
    return (
        <group position={position} rotation={rotation || [0, 0, 0]} scale={[2.2, 2.2, 2.2]}>
            {/* 上机匣/护木 */}
            <RoundedBox args={[2.8, 0.32, 0.25]} radius={0.05} position={[0.3, 0.25, 0]}>
                <meshStandardMaterial color="#2a2a2a" roughness={0.4} metalness={0.8} />
            </RoundedBox>
            
            {/* 下机匣 */}
            <RoundedBox args={[1.8, 0.28, 0.22]} radius={0.05} position={[-0.4, 0.15, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.85} />
            </RoundedBox>
            
            {/* 枪管 */}
            <Cylinder args={[0.06, 0.06, 2.2, 16]} rotation={[0, 0, -Math.PI / 2]} position={[1.5, 0.25, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.9} />
            </Cylinder>
            
            {/* 枪管前部 - 消焰器 */}
            <Cylinder args={[0.08, 0.06, 0.15, 16]} rotation={[0, 0, -Math.PI / 2]} position={[2.6, 0.25, 0]}>
                <meshStandardMaterial color="#0a0a0a" roughness={0.15} metalness={0.95} />
            </Cylinder>
            
            {/* 消焰器细节 */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
                <Box key={i} args={[0.02, 0.1, 0.15]} rotation={[0, 0, i * Math.PI / 3]} position={[2.6, 0.25, 0]}>
                    <meshStandardMaterial color="#0a0a0a" roughness={0.1} metalness={0.95} />
                </Box>
            ))}
            
            {/* 导气系统 */}
            <Cylinder args={[0.05, 0.05, 0.4, 8]} rotation={[0, 0, -Math.PI / 2]} position={[1.0, 0.35, 0]}>
                <meshStandardMaterial color="#2a2a2a" roughness={0.3} metalness={0.8} />
            </Cylinder>
            
            {/* 导气管 */}
            <Cylinder args={[0.03, 0.03, 0.6, 8]} rotation={[0, 0, -Math.PI / 2]} position={[0.7, 0.4, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.85} />
            </Cylinder>
            
            {/* 前准星 */}
            <group position={[1.8, 0.3, 0]}>
                <Box args={[0.08, 0.15, 0.08]} position={[0, 0.08, 0]}>
                    <meshStandardMaterial color="#0a0a0a" roughness={0.1} metalness={0.95} />
                </Box>
                <Cylinder args={[0.02, 0.02, 0.1, 8]} position={[0, 0.2, 0]}>
                    <meshStandardMaterial color="#ffff00" roughness={0.1} metalness={0.1} emissive="#ffff00" emissiveIntensity={0.3} />
                </Cylinder>
            </group>
            
            {/* 后照门 */}
            <group position={[-0.2, 0.3, 0]}>
                <Box args={[0.12, 0.2, 0.1]} position={[0, 0.1, 0]}>
                    <meshStandardMaterial color="#0a0a0a" roughness={0.1} metalness={0.95} />
                </Box>
                <Box args={[0.08, 0.05, 0.12]} position={[0, 0.25, 0]}>
                    <meshStandardMaterial color="#0a0a0a" roughness={0.1} metalness={0.95} />
                </Box>
            </group>
            
            {/* 提把/瞄具座 */}
            <Box args={[1.2, 0.12, 0.15]} position={[0.2, 0.45, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.85} />
            </Box>
            
            {/* 提把支撑 */}
            <Box args={[0.05, 0.2, 0.15]} position={[-0.4, 0.35, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.85} />
            </Box>
            <Box args={[0.05, 0.2, 0.15]} position={[0.8, 0.35, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.85} />
            </Box>
            
            {/* 弹匣 */}
            <Box args={[0.35, 0.6, 0.2]} position={[-0.4, -0.2, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.85} />
            </Box>
            
            {/* 弹匣底部 */}
            <Box args={[0.37, 0.08, 0.22]} position={[-0.4, -0.5, 0]}>
                <meshStandardMaterial color="#0a0a0a" roughness={0.2} metalness={0.9} />
            </Box>
            
            {/* 弹匣卡榫 */}
            <Box args={[0.1, 0.15, 0.05]} position={[-0.55, -0.15, 0.12]}>
                <meshStandardMaterial color="#0a0a0a" roughness={0.2} metalness={0.9} />
            </Box>
            
            {/* 握把 */}
            <Box args={[0.4, 0.5, 0.18]} position={[-0.4, -0.05, 0]} rotation={[0, 0, 0.15]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.7} />
            </Box>
            
            {/* 握把纹理 */}
            {Array.from({ length: 6 }).map((_, i) => (
                <Box key={i} args={[0.35, 0.06, 0.19]} position={[-0.4, -0.1 + (i * 0.1), 0]} rotation={[0, 0, 0.15]}>
                    <meshStandardMaterial color="#0a0a0a" roughness={0.6} metalness={0.5} />
                </Box>
            ))}
            
            {/* 扳机护圈 */}
            <Torus args={[0.25, 0.04, 8, 16]} position={[-0.4, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1.2, 1]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.85} />
            </Torus>
            
            {/* 扳机 */}
            <Box args={[0.12, 0.3, 0.06]} position={[-0.4, -0.05, 0.2]} rotation={[0.3, 0, 0]}>
                <meshStandardMaterial color="#0a0a0a" roughness={0.2} metalness={0.9} />
            </Box>
            
            {/* 枪托 */}
            <Box args={[0.8, 0.25, 0.15]} position={[-1.6, 0.1, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.6} />
            </Box>
            
            {/* 枪托底板 */}
            <Box args={[0.82, 0.08, 0.17]} position={[-1.6, -0.15, 0]}>
                <meshStandardMaterial color="#0a0a0a" roughness={0.3} metalness={0.8} />
            </Box>
            
            {/* 枪托贴腮板 */}
            <Box args={[0.5, 0.15, 0.16]} position={[-1.3, 0.2, 0]}>
                <meshStandardMaterial color="#2a2a2a" roughness={0.4} metalness={0.7} />
            </Box>
            
            {/* 拉机柄 */}
            <group position={[0.2, 0.2, 0.15]}>
                <Cylinder args={[0.04, 0.04, 0.15, 8]} rotation={[0, 0, -Math.PI / 2]}>
                    <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.85} />
                </Cylinder>
                <Box args={[0.08, 0.08, 0.1]} position={[0.08, 0, 0]}>
                    <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.85} />
                </Box>
            </group>
            
            {/* 快慢机 */}
            <Cylinder args={[0.05, 0.05, 0.12, 8]} rotation={[0, 0, Math.PI / 2]} position={[-0.5, 0.25, 0.15]}>
                <meshStandardMaterial color="#0a0a0a" roughness={0.2} metalness={0.9} />
            </Cylinder>
            
            {/* 保险/快慢机指示 */}
            <Box args={[0.08, 0.05, 0.05]} position={[-0.5, 0.3, 0.18]}>
                <meshStandardMaterial color="#0a0a0a" roughness={0.2} metalness={0.9} />
            </Box>
            
            {/* 护木细节 - 散热孔 */}
            {Array.from({ length: 8 }).map((_, i) => (
                <Box key={i} args={[0.05, 0.25, 0.05]} position={[0.1 + (i * 0.15), 0.25, 0.15]}>
                    <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.85} />
                </Box>
            ))}
            
            {/* 护木细节 - 导轨接口 */}
            <Box args={[0.4, 0.06, 0.12]} position={[0.8, 0.35, 0]}>
                <meshStandardMaterial color="#0a0a0a" roughness={0.2} metalness={0.9} />
            </Box>
            <Box args={[0.4, 0.06, 0.12]} position={[0.8, 0.15, 0]}>
                <meshStandardMaterial color="#0a0a0a" roughness={0.2} metalness={0.9} />
            </Box>
            
            {/* 下机匣细节 - 空仓挂机杆 */}
            <Box args={[0.08, 0.12, 0.05]} position={[0.6, 0.1, 0.12]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.85} />
            </Box>
            
            {/* 下机匣细节 - 弹匣释放按钮 */}
            <Cylinder args={[0.05, 0.05, 0.1, 8]} rotation={[0, 0, Math.PI / 2]} position={[-0.55, -0.1, 0.15]}>
                <meshStandardMaterial color="#0a0a0a" roughness={0.2} metalness={0.9} />
            </Cylinder>
        </group>
    )
})

// 59式主战坦克 - 深度优化版（超精细建模）
export const Type59Tank = React.memo(({ position, rotation }: { position: [number, number, number], rotation?: [number, number, number] }) => {
    return (
        <group position={position} rotation={rotation || [0, 0, 0]}>
            {/* 车体主体 - 经典绿色涂装 */}
            <RoundedBox args={[4.0, 1.0, 2.8]} radius={0.1} position={[0, 0.5, 0]}>
                <meshStandardMaterial color="#2d4a2d" roughness={0.45} metalness={0.65} />
            </RoundedBox>
            
            {/* 车体表面细节 - 铆钉 */}
            {[-1.8, -1.0, -0.2, 0.2, 1.0, 1.8].map((x, i) => (
                <Cylinder key={i} args={[0.025, 0.025, 0.06, 12]} position={[x, 1.03, 1.5]}>
                    <meshStandardMaterial color="#1a1a1a" roughness={0.25} metalness={0.85} />
                </Cylinder>
            ))}
            
            {/* 车体前装甲板 */}
            <Box args={[4.0, 1.0, 0.22]} position={[0, 0.5, 1.51]} rotation={[0.15, 0, 0]}>
                <meshStandardMaterial color="#1d3a1d" roughness={0.4} metalness={0.7} />
            </Box>
            {/* 前装甲装饰条 */}
            <Box args={[3.8, 0.06, 0.24]} position={[0, 0.7, 1.52]} rotation={[0.15, 0, 0]}>
                <meshStandardMaterial color="#1a2a1a" roughness={0.5} metalness={0.6} />
            </Box>
            
            {/* 履带系统 - 增强版 */}
            {[-1.5, -0.75, 0, 0.75, 1.5].map((x, i) => (
                <group key={i}>
                    <Cylinder args={[0.36, 0.36, 0.31, 20]} rotation={[Math.PI / 2, 0, 0]} position={[x, 0.3, 0]}>
                        <meshStandardMaterial color="#0f0f0f" roughness={0.4} metalness={0.75} />
                    </Cylinder>
                    <Cylinder args={[0.35, 0.35, 0.3, 20]} rotation={[Math.PI / 2, 0, 0]} position={[x, 0.3, 0]}>
                        <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
                    </Cylinder>
                    <Cylinder args={[0.19, 0.19, 0.32, 12]} rotation={[Math.PI / 2, 0, 0]} position={[x, 0.3, 0]}>
                        <meshStandardMaterial color="#2a2a2a" roughness={0.2} metalness={0.9} />
                    </Cylinder>
                    <Cylinder args={[0.18, 0.18, 0.31, 12]} rotation={[Math.PI / 2, 0, 0]} position={[x, 0.3, 0]}>
                        <meshStandardMaterial color="#3a3a3a" roughness={0.15} metalness={0.95} />
                    </Cylinder>
                    {/* 轮辐 */}
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((j) => (
                        <Box key={j} args={[0.04, 0.25, 0.32]} rotation={[0, 0, j * Math.PI / 4]} position={[x, 0.3, 0]}>
                            <meshStandardMaterial color="#2a2a2a" roughness={0.25} metalness={0.8} />
                        </Box>
                    ))}
                    <Torus args={[0.34, 0.02, 8, 20]} rotation={[Math.PI / 2, 0, 0]} position={[x, 0.3, 0]}>
                        <meshStandardMaterial color="#0a0a0a" roughness={0.5} metalness={0.7} />
                    </Torus>
                </group>
            ))}
            
            {/* 履带 - 增强版 */}
            <Box args={[3.8, 0.19, 2.9]} position={[0, 0.15, 0]}>
                <meshStandardMaterial color="#0a0a0a" roughness={0.85} metalness={0.25} />
            </Box>
            {/* 履带纹理 */}
            {Array.from({ length: 22 }).map((_, i) => (
                <Box key={i} args={[0.12, 0.19, 0.18]} position={[-1.7 + (i * 0.15), 0.15, 1.45]}>
                    <meshStandardMaterial color="#1a1a1a" roughness={0.75} metalness={0.2} />
                </Box>
            ))}
            {Array.from({ length: 22 }).map((_, i) => (
                <Box key={i} args={[0.12, 0.19, 0.18]} position={[-1.7 + (i * 0.15), 0.15, -1.45]}>
                    <meshStandardMaterial color="#1a1a1a" roughness={0.75} metalness={0.2} />
                </Box>
            ))}
            
            {/* 炮塔主体 - 半球形设计 - 增强版 */}
            <group position={[0, 1.0, 0]}>
                <RoundedBox args={[2.2, 0.8, 2.0]} radius={0.2} position={[0, 0.4, 0]}>
                    <meshStandardMaterial color="#2d4a2d" roughness={0.45} metalness={0.65} />
                </RoundedBox>
                
                {/* 炮塔顶部 */}
                <Cylinder args={[1.02, 1.02, 0.16, 36]} position={[0, 0.8, 0]}>
                    <meshStandardMaterial color="#1d3a1d" roughness={0.4} metalness={0.7} />
                </Cylinder>
                
                {/* 炮塔细节 - 观察窗 - 增强版 */}
                <Box args={[0.28, 0.14, 0.06]} position={[-0.4, 0.5, 1.06]}>
                    <meshStandardMaterial color="#0a0a0a" roughness={0.05} metalness={0.95} />
                </Box>
                <Box args={[0.28, 0.14, 0.06]} position={[0.4, 0.5, 1.06]}>
                    <meshStandardMaterial color="#0a0a0a" roughness={0.05} metalness={0.95} />
                </Box>
                {/* 观察窗边框 */}
                <Box args={[0.31, 0.17, 0.07]} position={[-0.4, 0.5, 1.055]}>
                    <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
                </Box>
                <Box args={[0.31, 0.17, 0.07]} position={[0.4, 0.5, 1.055]}>
                    <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
                </Box>
                
                {/* 指挥塔 - 增强版 */}
                <Cylinder args={[0.26, 0.26, 0.22, 20]} position={[-0.6, 0.91, 0]}>
                    <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
                </Cylinder>
                {/* 指挥塔顶部 */}
                <Cylinder args={[0.24, 0.24, 0.05, 16]} position={[-0.6, 1.02, 0]}>
                    <meshStandardMaterial color="#0a0a0a" roughness={0.2} metalness={0.9} />
                </Cylinder>
                {/* 指挥塔观察窗 */}
                <Box args={[0.1, 0.08, 0.23]} position={[-0.6, 0.91, 0.26]}>
                    <meshStandardMaterial color="#0a0a0a" roughness={0.05} metalness={0.95} />
                </Box>
            </group>
            
            {/* 主炮管 - 100mm线膛炮 - 增强版 */}
            <Cylinder args={[0.145, 0.145, 4.2, 20]} rotation={[0, 0, -Math.PI / 2]} position={[3.1, 1.2, 0]}>
                <meshStandardMaterial color="#2a2a2a" roughness={0.28} metalness={0.88} />
            </Cylinder>
            
            {/* 炮管根部 - 增强版 */}
            <Cylinder args={[0.23, 0.23, 0.52, 20]} rotation={[0, 0, -Math.PI / 2]} position={[2.0, 1.2, 0]}>
                <meshStandardMaterial color="#3a3a3a" roughness={0.4} metalness={0.8} />
            </Cylinder>
            <Torus args={[0.21, 0.02, 8, 20]} rotation={[0, Math.PI / 2, 0]} position={[2.0, 1.2, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.85} />
            </Torus>
            
            {/* 炮口制退器 - 增强版 */}
            <Cylinder args={[0.19, 0.145, 0.42, 20]} rotation={[0, 0, -Math.PI / 2]} position={[5.21, 1.2, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.18} metalness={0.92} />
            </Cylinder>
            {/* 制退器细节 */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
                <Box key={i} args={[0.02, 0.1, 0.42]} rotation={[0, 0, i * Math.PI / 3]} position={[5.21, 1.2, 0]}>
                    <meshStandardMaterial color="#0a0a0a" roughness={0.15} metalness={0.95} />
                </Box>
            ))}
            
            {/* 同轴机枪 - 增强版 */}
            <Cylinder args={[0.045, 0.045, 0.52, 12]} rotation={[0, 0, -Math.PI / 2]} position={[2.325, 1.15, 0.25]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.18} metalness={0.92} />
            </Cylinder>
            <Box args={[0.1, 0.08, 0.12]} position={[2.0, 1.1, 0.25]}>
                <meshStandardMaterial color="#2a2a2a" roughness={0.3} metalness={0.8} />
            </Box>
            
            {/* 高射机枪 - 增强版 */}
            <group position={[-0.6, 1.0, 0]}>
                <Cylinder args={[0.035, 0.035, 0.62, 12]} rotation={[0, 0, -Math.PI / 2]} position={[0.3, 0, 0]}>
                    <meshStandardMaterial color="#1a1a1a" roughness={0.18} metalness={0.92} />
                </Cylinder>
                <Box args={[0.18, 0.18, 0.12]} position={[0, 0, 0]}>
                    <meshStandardMaterial color="#2a2a2a" roughness={0.3} metalness={0.8} />
                </Box>
                {/* 机枪支架 */}
                <Box args={[0.08, 0.3, 0.08]} position={[0, -0.15, 0]}>
                    <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.7} />
                </Box>
            </group>
            
            {/* 车体细节 - 工具箱 */}
            <Box args={[0.35, 0.25, 0.45]} position={[-1.3, 0.75, -1.2]}>
                <meshStandardMaterial color="#3a3a3a" roughness={0.5} metalness={0.5} />
            </Box>
            <Box args={[0.35, 0.25, 0.45]} position={[1.3, 0.75, -1.2]}>
                <meshStandardMaterial color="#3a3a3a" roughness={0.5} metalness={0.5} />
            </Box>
            {/* 工具箱把手 */}
            <Box args={[0.18, 0.04, 0.06]} position={[-1.3, 0.88, -1.2]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
            </Box>
            <Box args={[0.18, 0.04, 0.06]} position={[1.3, 0.88, -1.2]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
            </Box>
            
            {/* 车体细节 - 标识牌 */}
            <Box args={[0.25, 0.12, 0.02]} position={[0, 0.8, 1.55]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
            </Box>
            <Box args={[0.23, 0.1, 0.03]} position={[0, 0.8, 1.56]}>
                <meshStandardMaterial color="#ffff00" roughness={0.4} metalness={0.1} />
            </Box>
            
            {/* 车体细节 - 通风口 */}
            {[-1.2, 1.2].map((x, i) => (
                <Box key={i} args={[0.2, 0.1, 0.12]} position={[x, 0.9, -1.3]}>
                    <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.7} />
                </Box>
            ))}
            {/* 通风口格栅 */}
            {[-1.2, 1.2].map((x, i) => (
                Array.from({ length: 6 }).map((_, j) => (
                    <Box key={`${i}-${j}`} args={[0.02, 0.1, 0.14]} position={[x, 0.9, -1.3 + (j - 2.5) * 0.02]}>
                        <meshStandardMaterial color="#0a0a0a" roughness={0.5} metalness={0.6} />
                    </Box>
                ))
            ))}
        </group>
    )
})

// 99式主战坦克 - 深度优化版（超精细建模）
export const Type99Tank = React.memo(({ position, rotation }: { position: [number, number, number], rotation?: [number, number, number] }) => {
    return (
        <group position={position} rotation={rotation || [0, 0, 0]}>
            {/* 车体主体 - 现代迷彩涂装 */}
            <RoundedBox args={[4.5, 1.1, 3.0]} radius={0.12} position={[0, 0.55, 0]}>
                <meshStandardMaterial color="#3d4a3d" roughness={0.35} metalness={0.75} />
            </RoundedBox>
            
            {/* 车体表面细节 - 更多铆钉 */}
            {[-2.0, -1.2, -0.4, 0.4, 1.2, 2.0].map((x, i) => (
                <Cylinder key={i} args={[0.025, 0.025, 0.06, 12]} position={[x, 1.13, 1.6]}>
                    <meshStandardMaterial color="#1a1a1a" roughness={0.25} metalness={0.85} />
                </Cylinder>
            ))}
            
            {/* 车体前装甲板 - 楔形装甲 - 增强版 */}
            <Box args={[4.5, 1.1, 0.28]} position={[0, 0.55, 1.64]} rotation={[0.2, 0, 0]}>
                <meshStandardMaterial color="#2d3a2d" roughness={0.4} metalness={0.7} />
            </Box>
            {/* 楔形装甲装饰条 */}
            <Box args={[4.3, 0.08, 0.3]} position={[0, 0.8, 1.65]} rotation={[0.2, 0, 0]}>
                <meshStandardMaterial color="#1a2a1a" roughness={0.5} metalness={0.6} />
            </Box>
            
            {/* 履带系统 - 增强版 */}
            {[-1.8, -1.0, -0.2, 0.6, 1.4, 2.2].map((x, i) => (
                <group key={i}>
                    <Cylinder args={[0.39, 0.39, 0.29, 20]} rotation={[Math.PI / 2, 0, 0]} position={[x, 0.3, 0]}>
                        <meshStandardMaterial color="#0f0f0f" roughness={0.4} metalness={0.75} />
                    </Cylinder>
                    <Cylinder args={[0.38, 0.38, 0.28, 20]} rotation={[Math.PI / 2, 0, 0]} position={[x, 0.3, 0]}>
                        <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
                    </Cylinder>
                    <Cylinder args={[0.21, 0.21, 0.3, 12]} rotation={[Math.PI / 2, 0, 0]} position={[x, 0.3, 0]}>
                        <meshStandardMaterial color="#2a2a2a" roughness={0.2} metalness={0.9} />
                    </Cylinder>
                    <Cylinder args={[0.2, 0.2, 0.29, 12]} rotation={[Math.PI / 2, 0, 0]} position={[x, 0.3, 0]}>
                        <meshStandardMaterial color="#3a3a3a" roughness={0.15} metalness={0.95} />
                    </Cylinder>
                    {/* 轮辐 */}
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((j) => (
                        <Box key={j} args={[0.04, 0.28, 0.3]} rotation={[0, 0, j * Math.PI / 4]} position={[x, 0.3, 0]}>
                            <meshStandardMaterial color="#2a2a2a" roughness={0.25} metalness={0.8} />
                        </Box>
                    ))}
                    <Torus args={[0.37, 0.02, 8, 20]} rotation={[Math.PI / 2, 0, 0]} position={[x, 0.3, 0]}>
                        <meshStandardMaterial color="#0a0a0a" roughness={0.5} metalness={0.7} />
                    </Torus>
                </group>
            ))}
            
            {/* 履带 - 增强版 */}
            <Box args={[4.2, 0.21, 3.1]} position={[0, 0.15, 0]}>
                <meshStandardMaterial color="#0a0a0a" roughness={0.85} metalness={0.25} />
            </Box>
            {/* 履带纹理 */}
            {Array.from({ length: 26 }).map((_, i) => (
                <Box key={i} args={[0.12, 0.21, 0.18]} position={[-2.0 + (i * 0.15), 0.15, 1.55]}>
                    <meshStandardMaterial color="#1a1a1a" roughness={0.75} metalness={0.2} />
                </Box>
            ))}
            {Array.from({ length: 26 }).map((_, i) => (
                <Box key={i} args={[0.12, 0.21, 0.18]} position={[-2.0 + (i * 0.15), 0.15, -1.55]}>
                    <meshStandardMaterial color="#1a1a1a" roughness={0.75} metalness={0.2} />
                </Box>
            ))}
            
            {/* 炮塔主体 - 现代化设计 - 增强版 */}
            <group position={[0, 1.1, 0]}>
                <RoundedBox args={[2.4, 0.9, 2.2]} radius={0.2} position={[0, 0.45, 0]}>
                    <meshStandardMaterial color="#3d4a3d" roughness={0.45} metalness={0.65} />
                </RoundedBox>
                
                {/* 炮塔前装甲 - 复合装甲 - 增强版 */}
                <Box args={[2.4, 0.9, 0.22]} position={[0, 0.45, 1.21]} rotation={[0.2, 0, 0]}>
                    <meshStandardMaterial color="#2d3a2d" roughness={0.4} metalness={0.7} />
                </Box>
                {/* 复合装甲装饰层 */}
                <Box args={[2.2, 0.85, 0.24]} position={[0, 0.45, 1.22]} rotation={[0.2, 0, 0]}>
                    <meshStandardMaterial color="#1a2a1a" roughness={0.5} metalness={0.6} />
                </Box>
                
                {/* 炮塔顶部细节 - 传感器 */}
                <Box args={[0.52, 0.16, 0.52]} position={[-0.7, 0.96, 0.4]}>
                    <meshStandardMaterial color="#2a2a2a" roughness={0.5} metalness={0.6} />
                </Box>
                <Box args={[0.52, 0.16, 0.52]} position={[0.7, 0.96, 0.4]}>
                    <meshStandardMaterial color="#2a2a2a" roughness={0.5} metalness={0.6} />
                </Box>
                {/* 传感器细节 */}
                <Cylinder args={[0.1, 0.1, 0.12, 16]} position={[-0.7, 1.04, 0.4]}>
                    <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.9} />
                </Cylinder>
                <Cylinder args={[0.1, 0.1, 0.12, 16]} position={[0.7, 1.04, 0.4]}>
                    <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.9} />
                </Cylinder>
                
                {/* 激光告警系统 - 增强版 */}
                <Cylinder args={[0.09, 0.09, 0.12, 12]} position={[0.8, 0.91, 0.8]}>
                    <meshStandardMaterial color="#ff0000" roughness={0.1} metalness={0.1} emissive="#ff0000" emissiveIntensity={0.6} />
                </Cylinder>
                <Cylinder args={[0.09, 0.09, 0.12, 12]} position={[-0.8, 0.91, 0.8]}>
                    <meshStandardMaterial color="#ff0000" roughness={0.1} metalness={0.1} emissive="#ff0000" emissiveIntensity={0.6} />
                </Cylinder>
                {/* 告警系统底座 */}
                <Cylinder args={[0.12, 0.12, 0.05, 12]} position={[0.8, 0.85, 0.8]}>
                    <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
                </Cylinder>
                <Cylinder args={[0.12, 0.12, 0.05, 12]} position={[-0.8, 0.85, 0.8]}>
                    <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
                </Cylinder>
                
                {/* 炮塔顶部天线 */}
                <Cylinder args={[0.04, 0.04, 0.3, 8]} position={[0, 0.95, -0.4]}>
                    <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.9} />
                </Cylinder>
            </group>
            
            {/* 主炮管 - 125mm滑膛炮 - 增强版 */}
            <Cylinder args={[0.165, 0.165, 5.0, 20]} rotation={[0, 0, -Math.PI / 2]} position={[3.5, 1.35, 0]}>
                <meshStandardMaterial color="#2a2a2a" roughness={0.28} metalness={0.88} />
            </Cylinder>
            
            {/* 炮管根部 - 增强版 */}
            <Cylinder args={[0.26, 0.26, 0.65, 20]} rotation={[0, 0, -Math.PI / 2]} position={[2.2, 1.35, 0]}>
                <meshStandardMaterial color="#3a3a3a" roughness={0.4} metalness={0.8} />
            </Cylinder>
            <Torus args={[0.24, 0.02, 8, 20]} rotation={[0, Math.PI / 2, 0]} position={[2.2, 1.35, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.85} />
            </Torus>
            
            {/* 炮口制退器 - 增强版 */}
            <Cylinder args={[0.21, 0.165, 0.55, 20]} rotation={[0, 0, -Math.PI / 2]} position={[6.025, 1.35, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.18} metalness={0.92} />
            </Cylinder>
            {/* 制退器细节 */}
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <Box key={i} args={[0.02, 0.12, 0.55]} rotation={[0, 0, i * Math.PI / 3.5]} position={[6.025, 1.35, 0]}>
                    <meshStandardMaterial color="#0a0a0a" roughness={0.15} metalness={0.95} />
                </Box>
            ))}
            
            {/* 炮管热护套 - 增强版 */}
            <Cylinder args={[0.185, 0.185, 3.5, 20]} rotation={[0, 0, -Math.PI / 2]} position={[4.0, 1.35, 0]}>
                <meshStandardMaterial color="#4a4a4a" roughness={0.65} metalness={0.25} />
            </Cylinder>
            {/* 热护套固定环 */}
            <Torus args={[0.18, 0.015, 8, 20]} rotation={[0, Math.PI / 2, 0]} position={[2.8, 1.35, 0]}>
                <meshStandardMaterial color="#3a3a3a" roughness={0.5} metalness={0.5} />
            </Torus>
            <Torus args={[0.18, 0.015, 8, 20]} rotation={[0, Math.PI / 2, 0]} position={[5.2, 1.35, 0]}>
                <meshStandardMaterial color="#3a3a3a" roughness={0.5} metalness={0.5} />
            </Torus>
            
            {/* 同轴机枪 - 增强版 */}
            <Cylinder args={[0.045, 0.045, 0.62, 12]} rotation={[0, 0, -Math.PI / 2]} position={[2.525, 1.3, 0.3]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.18} metalness={0.92} />
            </Cylinder>
            <Box args={[0.12, 0.1, 0.14]} position={[2.2, 1.25, 0.3]}>
                <meshStandardMaterial color="#2a2a2a" roughness={0.3} metalness={0.8} />
            </Box>
            
            {/* 车体附加装甲 - 增强版 */}
            <Box args={[0.55, 0.42, 0.14]} position={[-1.5, 0.7, 1.21]} rotation={[0, 0, 0.15]}>
                <meshStandardMaterial color="#2a3a2a" roughness={0.5} metalness={0.6} />
            </Box>
            <Box args={[0.55, 0.42, 0.14]} position={[1.5, 0.7, 1.21]} rotation={[0, 0, -0.15]}>
                <meshStandardMaterial color="#2a3a2a" roughness={0.5} metalness={0.6} />
            </Box>
            {/* 附加装甲固定螺栓 */}
            {[-1.0, 0, 1.0].map((x, i) => (
                <Cylinder key={i} args={[0.025, 0.025, 0.14, 8]} position={[x, 0.7, 1.28]} rotation={[Math.PI / 2, 0, 0]}>
                    <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
                </Cylinder>
            ))}
            
            {/* 车体细节 - 工具箱 */}
            <Box args={[0.4, 0.28, 0.5]} position={[-1.6, 0.8, -1.3]}>
                <meshStandardMaterial color="#3a3a3a" roughness={0.5} metalness={0.5} />
            </Box>
            <Box args={[0.4, 0.28, 0.5]} position={[1.6, 0.8, -1.3]}>
                <meshStandardMaterial color="#3a3a3a" roughness={0.5} metalness={0.5} />
            </Box>
            {/* 工具箱把手 */}
            <Box args={[0.2, 0.05, 0.07]} position={[-1.6, 0.94, -1.3]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
            </Box>
            <Box args={[0.2, 0.05, 0.07]} position={[1.6, 0.94, -1.3]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
            </Box>
            
            {/* 车体细节 - 标识牌 */}
            <Box args={[0.3, 0.14, 0.02]} position={[0, 0.85, 1.65]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
            </Box>
            <Box args={[0.28, 0.12, 0.03]} position={[0, 0.85, 1.66]}>
                <meshStandardMaterial color="#ffff00" roughness={0.4} metalness={0.1} />
            </Box>
            
            {/* 车体细节 - 传感器 */}
            <Cylinder args={[0.08, 0.08, 0.1, 12]} position={[-1.8, 0.9, 1.0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.9} />
            </Cylinder>
            <Cylinder args={[0.08, 0.08, 0.1, 12]} position={[1.8, 0.9, 1.0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.9} />
            </Cylinder>
        </group>
    )
})

// 56式半自动步枪 - 精细建模
export const Type56Rifle = React.memo(({ position, rotation }: { position: [number, number, number], rotation?: [number, number, number] }) => {
    return (
        <group position={position} rotation={rotation || [0, 0, 0]} scale={[2.0, 2.0, 2.0]}>
            {/* 枪托 */}
            <Box args={[1.0, 0.3, 0.2]} position={[-1.2, 0.1, 0]}>
                <meshStandardMaterial color="#3a2a1a" roughness={0.6} metalness={0.2} />
            </Box>
            
            {/* 机匣 */}
            <RoundedBox args={[2.0, 0.3, 0.25]} radius={0.05} position={[0, 0.2, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.85} />
            </RoundedBox>
            
            {/* 枪管 */}
            <Cylinder args={[0.05, 0.05, 1.8, 16]} rotation={[0, 0, -Math.PI / 2]} position={[1.2, 0.2, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.9} />
            </Cylinder>
            
            {/* 准星 */}
            <Box args={[0.06, 0.12, 0.06]} position={[1.6, 0.25, 0]}>
                <meshStandardMaterial color="#0a0a0a" roughness={0.1} metalness={0.95} />
            </Box>
            
            {/* 照门 */}
            <Box args={[0.1, 0.15, 0.08]} position={[-0.3, 0.25, 0]}>
                <meshStandardMaterial color="#0a0a0a" roughness={0.1} metalness={0.95} />
            </Box>
            
            {/* 弹仓 */}
            <Box args={[0.3, 0.4, 0.2]} position={[0.2, -0.1, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.85} />
            </Box>
            
            {/* 扳机护圈 */}
            <Torus args={[0.22, 0.035, 8, 16]} position={[-0.2, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1.2, 1]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.85} />
            </Torus>
            
            {/* 扳机 */}
            <Box args={[0.1, 0.25, 0.05]} position={[-0.2, -0.05, 0.18]} rotation={[0.25, 0, 0]}>
                <meshStandardMaterial color="#0a0a0a" roughness={0.2} metalness={0.9} />
            </Box>
        </group>
    )
})

// 81式自动步枪 - 精细建模
export const Type81Rifle = React.memo(({ position, rotation }: { position: [number, number, number], rotation?: [number, number, number] }) => {
    return (
        <group position={position} rotation={rotation || [0, 0, 0]} scale={[2.0, 2.0, 2.0]}>
            {/* 枪托 */}
            <Box args={[0.9, 0.28, 0.18]} position={[-1.1, 0.1, 0]}>
                <meshStandardMaterial color="#2a2a2a" roughness={0.5} metalness={0.6} />
            </Box>
            
            {/* 上机匣 */}
            <RoundedBox args={[2.2, 0.3, 0.24]} radius={0.05} position={[0.1, 0.2, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.85} />
            </RoundedBox>
            
            {/* 下机匣 */}
            <RoundedBox args={[1.6, 0.28, 0.22]} radius={0.05} position={[-0.3, 0.15, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.85} />
            </RoundedBox>
            
            {/* 枪管 */}
            <Cylinder args={[0.055, 0.055, 2.0, 16]} rotation={[0, 0, -Math.PI / 2]} position={[1.3, 0.2, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.9} />
            </Cylinder>
            
            {/* 准星 */}
            <Box args={[0.07, 0.14, 0.07]} position={[1.7, 0.25, 0]}>
                <meshStandardMaterial color="#0a0a0a" roughness={0.1} metalness={0.95} />
            </Box>
            
            {/* 照门 */}
            <Box args={[0.12, 0.18, 0.1]} position={[-0.2, 0.25, 0]}>
                <meshStandardMaterial color="#0a0a0a" roughness={0.1} metalness={0.95} />
            </Box>
            
            {/* 弹匣 */}
            <Box args={[0.32, 0.55, 0.2]} position={[-0.3, -0.15, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.85} />
            </Box>
            
            {/* 握把 */}
            <Box args={[0.38, 0.45, 0.16]} position={[-0.3, -0.05, 0]} rotation={[0, 0, 0.12]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.7} />
            </Box>
            
            {/* 扳机护圈 */}
            <Torus args={[0.24, 0.04, 8, 16]} position={[-0.3, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1.2, 1]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.85} />
            </Torus>
            
            {/* 扳机 */}
            <Box args={[0.11, 0.28, 0.06]} position={[-0.3, -0.05, 0.2]} rotation={[0.3, 0, 0]}>
                <meshStandardMaterial color="#0a0a0a" roughness={0.2} metalness={0.9} />
            </Box>
            
            {/* 拉机柄 */}
            <group position={[0.3, 0.15, 0.15]}>
                <Cylinder args={[0.04, 0.04, 0.12, 8]} rotation={[0, 0, -Math.PI / 2]}>
                    <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.85} />
                </Cylinder>
                <Box args={[0.08, 0.08, 0.08]} position={[0.06, 0, 0]}>
                    <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.85} />
                </Box>
            </group>
        </group>
    )
})

// 95式自动步枪 - 精细建模（无托结构）
export const Type95Rifle = React.memo(({ position, rotation }: { position: [number, number, number], rotation?: [number, number, number] }) => {
    return (
        <group position={position} rotation={rotation || [0, 0, 0]} scale={[2.0, 2.0, 2.0]}>
            {/* 机匣主体 - 无托设计 */}
            <RoundedBox args={[2.5, 0.35, 0.28]} radius={0.06} position={[0.2, 0.2, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.85} />
            </RoundedBox>
            
            {/* 枪管 */}
            <Cylinder args={[0.055, 0.055, 1.6, 16]} rotation={[0, 0, -Math.PI / 2]} position={[1.1, 0.2, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.9} />
            </Cylinder>
            
            {/* 准星 */}
            <Box args={[0.08, 0.16, 0.08]} position={[1.5, 0.25, 0]}>
                <meshStandardMaterial color="#0a0a0a" roughness={0.1} metalness={0.95} />
            </Box>
            
            {/* 提把/瞄具座 */}
            <Box args={[1.0, 0.14, 0.16]} position={[0.2, 0.4, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.85} />
            </Box>
            
            {/* 弹匣 */}
            <Box args={[0.3, 0.5, 0.18]} position={[0.2, -0.2, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.85} />
            </Box>
            
            {/* 握把 */}
            <Box args={[0.35, 0.4, 0.15]} position={[0.2, 0, 0]} rotation={[0, 0, 0.1]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.7} />
            </Box>
            
            {/* 扳机护圈 */}
            <Torus args={[0.22, 0.035, 8, 16]} position={[0.2, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1.2, 1]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.85} />
            </Torus>
            
            {/* 扳机 */}
            <Box args={[0.1, 0.22, 0.05]} position={[0.2, -0.02, 0.15]} rotation={[0.25, 0, 0]}>
                <meshStandardMaterial color="#0a0a0a" roughness={0.2} metalness={0.9} />
            </Box>
            
            {/* 枪托 */}
            <Box args={[0.6, 0.25, 0.2]} position={[-0.8, 0.15, 0]}>
                <meshStandardMaterial color="#2a2a2a" roughness={0.5} metalness={0.6} />
            </Box>
        </group>
    )
})

// 92式手枪 - 精细建模
export const Type92Pistol = React.memo(({ position, rotation }: { position: [number, number, number], rotation?: [number, number, number] }) => {
    return (
        <group position={position} rotation={rotation || [0, 0, 0]} scale={[3.5, 3.5, 3.5]}>
            {/* 套筒主体 */}
            <RoundedBox args={[1.5, 0.3, 0.2]} radius={0.05} position={[0, 0.55, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.9} />
            </RoundedBox>
            
            {/* 套筒前部 */}
            <Box args={[0.35, 0.3, 0.2]} position={[0.85, 0.55, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.9} />
            </Box>
            
            {/* 套筒顶部 - 瞄具座 */}
            <Box args={[1.1, 0.07, 0.14]} position={[0, 0.7, 0]}>
                <meshStandardMaterial color="#0a0a0a" roughness={0.15} metalness={0.95} />
            </Box>
            
            {/* 前瞄具 */}
            <Box args={[0.07, 0.1, 0.08]} position={[0.7, 0.72, 0]}>
                <meshStandardMaterial color="#0a0a0a" roughness={0.1} metalness={0.95} />
            </Box>
            
            {/* 后瞄具 */}
            <Box args={[0.1, 0.08, 0.08]} position={[-0.45, 0.72, 0]}>
                <meshStandardMaterial color="#0a0a0a" roughness={0.1} metalness={0.95} />
            </Box>
            
            {/* 套筒座/下机匣 */}
            <RoundedBox args={[1.4, 0.38, 0.18]} radius={0.05} position={[0, 0.15, 0]}>
                <meshStandardMaterial color="#2a2a2a" roughness={0.3} metalness={0.85} />
            </RoundedBox>
            
            {/* 握把 */}
            <Box args={[0.48, 0.85, 0.2]} position={[-0.55, -0.25, 0]} rotation={[0, 0, -0.12]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.7} />
            </Box>
            
            {/* 握把纹理 */}
            {Array.from({ length: 7 }).map((_, i) => (
                <Box key={i} args={[0.43, 0.04, 0.21]} position={[-0.55, -0.3 + (i * 0.13), 0]} rotation={[0, 0, -0.12]}>
                    <meshStandardMaterial color="#0a0a0a" roughness={0.6} metalness={0.5} />
                </Box>
            ))}
            
            {/* 扳机护圈 */}
            <Torus args={[0.19, 0.03, 8, 16]} position={[-0.25, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1.3, 1]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.85} />
            </Torus>
            
            {/* 扳机 */}
            <Box args={[0.14, 0.23, 0.05]} position={[-0.25, -0.05, 0.15]} rotation={[0.2, 0, 0]}>
                <meshStandardMaterial color="#0a0a0a" roughness={0.2} metalness={0.9} />
            </Box>
            
            {/* 弹匣 */}
            <Box args={[0.38, 0.65, 0.16]} position={[-0.55, -0.5, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.85} />
            </Box>
            
            {/* 弹匣底部 */}
            <Box args={[0.4, 0.08, 0.18]} position={[-0.55, -0.85, 0]}>
                <meshStandardMaterial color="#0a0a0a" roughness={0.2} metalness={0.9} />
            </Box>
        </group>
    )
})

// PHL-03远程火箭炮 - 精细建模
export const PHL03RocketLauncher = React.memo(({ position, rotation }: { position: [number, number, number], rotation?: [number, number, number] }) => {
    return (
        <group position={position} rotation={rotation || [0, 0, 0]}>
            {/* 底盘 */}
            <RoundedBox args={[5.0, 0.8, 2.5]} radius={0.1} position={[0, 0.4, 0]}>
                <meshStandardMaterial color="#2d3a2d" roughness={0.5} metalness={0.6} />
            </RoundedBox>
            
            {/* 驾驶室 */}
            <RoundedBox args={[1.5, 1.2, 1.8]} radius={0.1} position={[-1.5, 1.0, 0]}>
                <meshStandardMaterial color="#1d2a1d" roughness={0.4} metalness={0.7} />
            </RoundedBox>
            
            {/* 发射箱 - 12管 */}
            <group position={[1.0, 1.2, 0]}>
                {[0, 1, 2].map((row) => (
                    [0, 1, 2, 3].map((col) => (
                        <Cylinder key={`${row}-${col}`} args={[0.12, 0.12, 3.5, 16]} rotation={[0, 0, 0]} position={[col * 0.35 - 0.525, row * 0.35 - 0.35, 0]}>
                            <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
                        </Cylinder>
                    ))
                ))}
                
                {/* 发射箱框架 */}
                <Box args={[1.6, 1.2, 0.1]} position={[0, 0, -1.8]}>
                    <meshStandardMaterial color="#2a2a2a" roughness={0.4} metalness={0.7} />
                </Box>
                <Box args={[1.6, 1.2, 0.1]} position={[0, 0, 1.8]}>
                    <meshStandardMaterial color="#2a2a2a" roughness={0.4} metalness={0.7} />
                </Box>
            </group>
            
            {/* 轮胎 */}
            {[-1.8, -0.6, 0.6, 1.8].map((x, i) => (
                <group key={i}>
                    <Cylinder args={[0.4, 0.4, 0.3, 16]} rotation={[0, 0, Math.PI / 2]} position={[x, 0.4, 0]}>
                        <meshStandardMaterial color="#0a0a0a" roughness={0.8} metalness={0.2} />
                    </Cylinder>
                    <Cylinder args={[0.25, 0.25, 0.32, 8]} rotation={[0, 0, Math.PI / 2]} position={[x, 0.4, 0]}>
                        <meshStandardMaterial color="#2a2a2a" roughness={0.6} metalness={0.4} />
                    </Cylinder>
                </group>
            ))}
        </group>
    )
})

// 彩虹-5无人机 - 精细建模
export const Rainbow5Drone = React.memo(({ position, rotation }: { position: [number, number, number], rotation?: [number, number, number] }) => {
    return (
        <group position={position} rotation={rotation || [0, 0, 0]} scale={[0.8, 0.8, 0.8]}>
            {/* 机身主体 */}
            <RoundedBox args={[3.5, 0.4, 0.6]} radius={0.1} position={[0, 0.2, 0]}>
                <meshStandardMaterial color="#2a2a2a" roughness={0.4} metalness={0.7} />
            </RoundedBox>
            
            {/* 机头 */}
            <Box args={[0.8, 0.4, 0.6]} position={[-1.35, 0.2, 0]} rotation={[0, 0, 0.1]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
            </Box>
            
            {/* 机翼 */}
            <Box args={[0.15, 0.1, 4.5]} position={[0, 0.2, 0]}>
                <meshStandardMaterial color="#2a2a2a" roughness={0.4} metalness={0.7} />
            </Box>
            
            {/* 尾翼 */}
            <Box args={[0.1, 0.3, 1.2]} position={[1.2, 0.35, 0]}>
                <meshStandardMaterial color="#2a2a2a" roughness={0.4} metalness={0.7} />
            </Box>
            
            {/* 垂直尾翼 */}
            <Box args={[0.1, 0.8, 0.15]} position={[1.2, 0.6, 0]}>
                <meshStandardMaterial color="#2a2a2a" roughness={0.4} metalness={0.7} />
            </Box>
            
            {/* 发动机 */}
            <Cylinder args={[0.15, 0.15, 0.3, 16]} position={[-0.5, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
            </Cylinder>
            <Cylinder args={[0.15, 0.15, 0.3, 16]} position={[0.5, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
            </Cylinder>
            
            {/* 螺旋桨 */}
            {[-0.5, 0.5].map((x, i) => (
                <group key={i} position={[x, 0.2, 0]}>
                    <Cylinder args={[0.05, 0.05, 0.1, 8]} rotation={[0, 0, Math.PI / 2]}>
                        <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.9} />
                    </Cylinder>
                    {[0, 1, 2, 3].map((j) => (
                        <Box key={j} args={[0.02, 0.8, 0.05]} rotation={[0, 0, j * Math.PI / 2]} position={[0, 0, 0]}>
                            <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.7} />
                        </Box>
                    ))}
                </group>
            ))}
            
            {/* 挂载点 */}
            {[-1.0, -0.5, 0, 0.5, 1.0].map((x, i) => (
                <Cylinder key={i} args={[0.08, 0.08, 0.15, 8]} position={[x, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
                </Cylinder>
            ))}
        </group>
    )
})

// 69式火箭筒 - 精细建模
export const Type69RocketLauncher = React.memo(({ position, rotation }: { position: [number, number, number], rotation?: [number, number, number] }) => {
    return (
        <group position={position} rotation={rotation || [0, 0, 0]} scale={[2.5, 2.5, 2.5]}>
            {/* 发射管 */}
            <Cylinder args={[0.08, 0.08, 1.2, 16]} rotation={[0, 0, -Math.PI / 2]} position={[0.6, 0.15, 0]}>
                <meshStandardMaterial color="#2a2a2a" roughness={0.4} metalness={0.7} />
            </Cylinder>
            
            {/* 发射管前部 */}
            <Cylinder args={[0.1, 0.08, 0.15, 16]} rotation={[0, 0, -Math.PI / 2]} position={[1.275, 0.15, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
            </Cylinder>
            
            {/* 瞄准具 */}
            <Box args={[0.12, 0.08, 0.1]} position={[0.3, 0.2, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
            </Box>
            
            {/* 握把 */}
            <Box args={[0.15, 0.3, 0.1]} position={[0.2, -0.05, 0]} rotation={[0, 0, 0.2]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.7} />
            </Box>
            
            {/* 扳机 */}
            <Box args={[0.08, 0.15, 0.05]} position={[0.2, -0.1, 0.08]} rotation={[0.3, 0, 0]}>
                <meshStandardMaterial color="#0a0a0a" roughness={0.2} metalness={0.9} />
            </Box>
            
            {/* 肩托 */}
            <Box args={[0.2, 0.15, 0.08]} position={[-0.3, 0.1, 0]}>
                <meshStandardMaterial color="#2a2a2a" roughness={0.5} metalness={0.6} />
            </Box>
        </group>
    )
})

// 歼-5战斗机 - 精细建模
export const J5Fighter = React.memo(({ position, rotation }: { position: [number, number, number], rotation?: [number, number, number] }) => {
    return (
        <group position={position} rotation={rotation || [0, 0, 0]} scale={[0.6, 0.6, 0.6]}>
            {/* 机身 */}
            <RoundedBox args={[8, 1.2, 1.0]} radius={0.2} position={[0, 0.6, 0]}>
                <meshStandardMaterial color="#2a3a2a" roughness={0.4} metalness={0.7} />
            </RoundedBox>
            
            {/* 机头 */}
            <Box args={[1.5, 1.0, 0.8]} position={[-3.25, 0.6, 0]} rotation={[0, 0, 0.15]}>
                <meshStandardMaterial color="#1a2a1a" roughness={0.3} metalness={0.8} />
            </Box>
            
            {/* 座舱 */}
            <Box args={[1.0, 0.6, 0.9]} position={[-1.5, 0.8, 0]}>
                <meshStandardMaterial color="#0a0a0a" roughness={0.1} metalness={0.1} transparent opacity={0.3} />
            </Box>
            
            {/* 主翼 */}
            <Box args={[0.2, 0.1, 5.5]} position={[0, 0.6, 0]}>
                <meshStandardMaterial color="#2a3a2a" roughness={0.4} metalness={0.7} />
            </Box>
            
            {/* 尾翼 */}
            <Box args={[0.15, 0.8, 1.8]} position={[3.0, 0.9, 0]}>
                <meshStandardMaterial color="#2a3a2a" roughness={0.4} metalness={0.7} />
            </Box>
            
            {/* 垂直尾翼 */}
            <Box args={[0.15, 1.5, 0.3]} position={[3.0, 1.35, 0]}>
                <meshStandardMaterial color="#2a3a2a" roughness={0.4} metalness={0.7} />
            </Box>
            
            {/* 发动机进气道 */}
            <Cylinder args={[0.3, 0.3, 2.0, 16]} position={[-1.0, 0.6, 0]} rotation={[0, 0, Math.PI / 2]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
            </Cylinder>
            
            {/* 起落架 */}
            <Box args={[0.1, 0.6, 0.1]} position={[-2.0, 0.3, 0.5]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
            </Box>
            <Box args={[0.1, 0.6, 0.1]} position={[-2.0, 0.3, -0.5]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
            </Box>
        </group>
    )
})

// 歼-10战斗机 - 精细建模
export const J10Fighter = React.memo(({ position, rotation }: { position: [number, number, number], rotation?: [number, number, number] }) => {
    return (
        <group position={position} rotation={rotation || [0, 0, 0]} scale={[0.5, 0.5, 0.5]}>
            {/* 机身 */}
            <RoundedBox args={[12, 1.5, 1.2]} radius={0.2} position={[0, 0.75, 0]}>
                <meshStandardMaterial color="#3d4a3d" roughness={0.4} metalness={0.7} />
            </RoundedBox>
            
            {/* 机头 - 鸭翼布局 */}
            <Box args={[2.0, 1.2, 1.0]} position={[-5.0, 0.75, 0]} rotation={[0, 0, 0.1]}>
                <meshStandardMaterial color="#2d3a2d" roughness={0.3} metalness={0.8} />
            </Box>
            
            {/* 鸭翼 */}
            <Box args={[0.15, 0.1, 2.5]} position={[-3.5, 0.9, 0]} rotation={[0, 0, -0.1]}>
                <meshStandardMaterial color="#2d3a2d" roughness={0.4} metalness={0.7} />
            </Box>
            
            {/* 座舱 */}
            <Box args={[1.2, 0.7, 1.1]} position={[-3.0, 0.95, 0]}>
                <meshStandardMaterial color="#0a0a0a" roughness={0.1} metalness={0.1} transparent opacity={0.3} />
            </Box>
            
            {/* 主翼 - 三角翼 */}
            <Box args={[0.2, 0.12, 7.0]} position={[1.0, 0.75, 0]} rotation={[0, 0, -0.05]}>
                <meshStandardMaterial color="#3d4a3d" roughness={0.4} metalness={0.7} />
            </Box>
            
            {/* 尾翼 */}
            <Box args={[0.18, 1.0, 2.2]} position={[4.5, 1.1, 0]}>
                <meshStandardMaterial color="#3d4a3d" roughness={0.4} metalness={0.7} />
            </Box>
            
            {/* 垂直尾翼 */}
            <Box args={[0.18, 2.0, 0.4]} position={[4.5, 1.8, 0]}>
                <meshStandardMaterial color="#3d4a3d" roughness={0.4} metalness={0.7} />
            </Box>
            
            {/* 发动机尾喷口 */}
            <Cylinder args={[0.4, 0.35, 0.8, 16]} position={[5.0, 0.75, 0]} rotation={[0, 0, Math.PI / 2]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.9} />
            </Cylinder>
            
            {/* 挂载点 */}
            {[-2.0, 0, 2.0, 4.0].map((x, i) => (
                <Cylinder key={i} args={[0.1, 0.1, 0.2, 8]} position={[x, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
                </Cylinder>
            ))}
        </group>
    )
})

// 歼-20战斗机 - 深度优化版（超精细建模）
export const J20Fighter = React.memo(({ position, rotation }: { position: [number, number, number], rotation?: [number, number, number] }) => {
    return (
        <group position={position} rotation={rotation || [0, 0, 0]} scale={[0.4, 0.4, 0.4]}>
            {/* 机身 - 隐身设计 - 增强版 */}
            <RoundedBox args={[18, 1.8, 1.5]} radius={0.3} position={[0, 0.9, 0]}>
                <meshStandardMaterial color="#2a2a2a" roughness={0.25} metalness={0.85} />
            </RoundedBox>
            
            {/* 机身表面细节 - 隐身涂层纹理 */}
            {[-6, -3, 0, 3, 6].map((x, i) => (
                <Box key={i} args={[0.5, 0.02, 1.5]} position={[x, 1.81, 0]}>
                    <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
                </Box>
            ))}
            
            {/* 机头 - 隐身设计 - 增强版 */}
            <Box args={[3.0, 1.5, 1.3]} position={[-7.5, 0.9, 0]} rotation={[0, 0, 0.08]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.18} metalness={0.92} />
            </Box>
            {/* 机头雷达罩 */}
            <Box args={[2.8, 1.3, 1.1]} position={[-8.4, 0.9, 0]} rotation={[0, 0, 0.08]}>
                <meshStandardMaterial color="#0a0a0a" roughness={0.1} metalness={0.95} />
            </Box>
            
            {/* 座舱 - 一体化设计 - 增强版 */}
            <Box args={[1.5, 0.8, 1.4]} position={[-5.0, 1.1, 0]}>
                <meshStandardMaterial color="#0a0a0a" roughness={0.1} metalness={0.1} transparent opacity={0.25} />
            </Box>
            
            {/* 主翼 - 鸭翼布局 */}
            <Box args={[0.25, 0.15, 9.0]} position={[0, 0.9, 0]} rotation={[0, 0, -0.03]}>
                <meshStandardMaterial color="#2a2a2a" roughness={0.3} metalness={0.8} />
            </Box>
            
            {/* 鸭翼 */}
            <Box args={[0.2, 0.12, 3.5]} position={[-4.0, 1.0, 0]} rotation={[0, 0, -0.05]}>
                <meshStandardMaterial color="#2a2a2a" roughness={0.3} metalness={0.8} />
            </Box>
            
            {/* 尾翼 - 全动尾翼 */}
            <Box args={[0.2, 1.2, 2.8]} position={[7.0, 1.3, 0]}>
                <meshStandardMaterial color="#2a2a2a" roughness={0.3} metalness={0.8} />
            </Box>
            
            {/* 垂直尾翼 - 倾斜设计 */}
            <Box args={[0.2, 2.5, 0.5]} position={[7.0, 2.15, 0]} rotation={[0, 0, 0.2]}>
                <meshStandardMaterial color="#2a2a2a" roughness={0.3} metalness={0.8} />
            </Box>
            
            {/* 内置弹仓 */}
            <Box args={[2.0, 0.3, 0.8]} position={[2.0, 0.6, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.7} />
            </Box>
            
            {/* 发动机尾喷口 - 隐身设计 */}
            <Cylinder args={[0.5, 0.45, 1.0, 16]} position={[8.0, 0.9, 0]} rotation={[0, 0, Math.PI / 2]}>
                <meshStandardMaterial color="#0a0a0a" roughness={0.2} metalness={0.95} />
            </Cylinder>
        </group>
    )
})

// 152mm加农炮 - 深度优化版（超精细建模）
export const Type152Cannon = React.memo(({ position, rotation }: { position: [number, number, number], rotation?: [number, number, number] }) => {
    return (
        <group position={position} rotation={rotation || [0, 0, 0]} scale={[1.2, 1.2, 1.2]}>
            {/* 炮管 - 增强版 */}
            <Cylinder args={[0.205, 0.185, 4.5, 20]} rotation={[0, 0, -Math.PI / 2]} position={[2.25, 1.2, 0]}>
                <meshStandardMaterial color="#2a2a2a" roughness={0.28} metalness={0.88} />
            </Cylinder>
            
            {/* 炮管根部 - 增强版 */}
            <Cylinder args={[0.29, 0.29, 0.85, 20]} rotation={[0, 0, -Math.PI / 2]} position={[0.5, 1.2, 0]}>
                <meshStandardMaterial color="#3a3a3a" roughness={0.4} metalness={0.8} />
            </Cylinder>
            <Torus args={[0.27, 0.02, 8, 20]} rotation={[0, Math.PI / 2, 0]} position={[0.5, 1.2, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.85} />
            </Torus>
            
            {/* 炮口制退器 - 增强版 */}
            <Cylinder args={[0.26, 0.205, 0.65, 20]} rotation={[0, 0, -Math.PI / 2]} position={[4.825, 1.2, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.18} metalness={0.92} />
            </Cylinder>
            {/* 制退器细节 */}
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <Box key={i} args={[0.02, 0.15, 0.65]} rotation={[0, 0, i * Math.PI / 3.5]} position={[4.825, 1.2, 0]}>
                    <meshStandardMaterial color="#0a0a0a" roughness={0.15} metalness={0.95} />
                </Box>
            ))}
            
            {/* 炮架 - 增强版 */}
            <Box args={[1.6, 0.32, 1.3]} position={[0, 0.8, 0]}>
                <meshStandardMaterial color="#2a2a2a" roughness={0.4} metalness={0.7} />
            </Box>
            {/* 炮架装饰条 */}
            <Box args={[1.4, 0.05, 1.3]} position={[0, 0.96, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.6} />
            </Box>
            
            {/* 炮轮 - 增强版 */}
            {[-0.6, 0.6].map((x, i) => (
                <group key={i}>
                    <Cylinder args={[0.52, 0.52, 0.32, 20]} rotation={[0, 0, Math.PI / 2]} position={[x, 0.5, 0]}>
                        <meshStandardMaterial color="#0f0f0f" roughness={0.55} metalness={0.55} />
                    </Cylinder>
                    <Cylinder args={[0.5, 0.5, 0.3, 20]} rotation={[0, 0, Math.PI / 2]} position={[x, 0.5, 0]}>
                        <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.6} />
                    </Cylinder>
                    <Cylinder args={[0.32, 0.32, 0.33, 12]} rotation={[0, 0, Math.PI / 2]} position={[x, 0.5, 0]}>
                        <meshStandardMaterial color="#2a2a2a" roughness={0.4} metalness={0.7} />
                    </Cylinder>
                    <Cylinder args={[0.3, 0.3, 0.32, 12]} rotation={[0, 0, Math.PI / 2]} position={[x, 0.5, 0]}>
                        <meshStandardMaterial color="#3a3a3a" roughness={0.35} metalness={0.75} />
                    </Cylinder>
                    {/* 轮辐 */}
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((j) => (
                        <Box key={j} args={[0.04, 0.5, 0.33]} rotation={[0, 0, j * Math.PI / 4]} position={[x, 0.5, 0]}>
                            <meshStandardMaterial color="#2a2a2a" roughness={0.45} metalness={0.65} />
                        </Box>
                    ))}
                    <Torus args={[0.49, 0.02, 8, 20]} rotation={[0, Math.PI / 2, 0]} position={[x, 0.5, 0]}>
                        <meshStandardMaterial color="#0a0a0a" roughness={0.6} metalness={0.5} />
                    </Torus>
                </group>
            ))}
            
            {/* 驻锄 - 增强版 */}
            <Box args={[0.35, 0.22, 0.85]} position={[-0.8, 0.3, 0]} rotation={[0, 0, 0.3]}>
                <meshStandardMaterial color="#2a2a2a" roughness={0.5} metalness={0.6} />
            </Box>
            <Box args={[0.35, 0.22, 0.85]} position={[0.8, 0.3, 0]} rotation={[0, 0, -0.3]}>
                <meshStandardMaterial color="#2a2a2a" roughness={0.5} metalness={0.6} />
            </Box>
            {/* 驻锄固定螺栓 */}
            <Cylinder args={[0.03, 0.03, 0.22, 8]} position={[-0.8, 0.41, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
            </Cylinder>
            <Cylinder args={[0.03, 0.03, 0.22, 8]} position={[0.8, 0.41, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
            </Cylinder>
            
            {/* 瞄准具 */}
            <Box args={[0.15, 0.12, 0.1]} position={[1.0, 1.35, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
            </Box>
            <Cylinder args={[0.04, 0.04, 0.12, 8]} position={[1.0, 1.41, 0]}>
                <meshStandardMaterial color="#0a0a0a" roughness={0.2} metalness={0.9} />
            </Cylinder>
        </group>
    )
})

// 辽宁舰（航母） - 精细建模
export const LiaoningCarrier = React.memo(({ position, rotation }: { position: [number, number, number], rotation?: [number, number, number] }) => {
    return (
        <group position={position} rotation={rotation || [0, 0, 0]} scale={[0.15, 0.15, 0.15]}>
            {/* 船体主体 */}
            <RoundedBox args={[80, 6, 12]} radius={1.0} position={[0, 3, 0]}>
                <meshStandardMaterial color="#2a3a4a" roughness={0.5} metalness={0.6} />
            </RoundedBox>
            
            {/* 船首 */}
            <Box args={[8, 5, 10]} position={[-36, 2.5, 0]} rotation={[0, 0, 0.1]}>
                <meshStandardMaterial color="#1a2a3a" roughness={0.4} metalness={0.7} />
            </Box>
            
            {/* 飞行甲板 */}
            <Box args={[70, 0.2, 14]} position={[0, 6.1, 0]}>
                <meshStandardMaterial color="#3a4a5a" roughness={0.6} metalness={0.5} />
            </Box>
            
            {/* 甲板标记线 */}
            {[-30, -20, -10, 0, 10, 20, 30].map((x, i) => (
                <Box key={i} args={[0.1, 0.21, 14]} position={[x, 6.11, 0]}>
                    <meshStandardMaterial color="#ffff00" roughness={0.8} metalness={0.2} />
                </Box>
            ))}
            
            {/* 甲板编号 */}
            <Box args={[2, 0.21, 0.3]} position={[-25, 6.11, 6.5]}>
                <meshStandardMaterial color="#ffff00" roughness={0.8} metalness={0.2} />
            </Box>
            
            {/* 舰岛 */}
            <RoundedBox args={[12, 8, 6]} radius={0.5} position={[15, 6.2, 3]}>
                <meshStandardMaterial color="#2a3a4a" roughness={0.4} metalness={0.7} />
            </RoundedBox>
            
            {/* 舰岛顶部 */}
            <Box args={[10, 2, 5]} position={[15, 10.2, 3]}>
                <meshStandardMaterial color="#1a2a3a" roughness={0.3} metalness={0.8} />
            </Box>
            
            {/* 雷达 */}
            <Cylinder args={[1.5, 1.5, 1.0, 16]} position={[15, 11.5, 3]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.9} />
            </Cylinder>
            
            {/* 舰载机升降机 */}
            <Box args={[8, 0.1, 6]} position={[-20, 6.1, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.5} />
            </Box>
            
            {/* 起飞滑跃甲板 */}
            <Box args={[20, 0.2, 14]} position={[-25, 6.1, 0]} rotation={[0.1, 0, 0]}>
                <meshStandardMaterial color="#3a4a5a" roughness={0.6} metalness={0.5} />
            </Box>
            
            {/* 近防武器系统 */}
            {[-30, -10, 10, 30].map((x, i) => (
                <group key={i} position={[x, 6.2, 6.5]}>
                    <Cylinder args={[0.4, 0.4, 0.8, 8]} rotation={[0, 0, Math.PI / 2]}>
                        <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
                    </Cylinder>
                    <Cylinder args={[0.2, 0.2, 1.2, 8]} rotation={[0, 0, Math.PI / 2]} position={[0.3, 0, 0]}>
                        <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
                    </Cylinder>
                </group>
            ))}
            
            {/* 船体细节 - 水线 */}
            <Box args={[82, 0.3, 12.2]} position={[0, 0.15, 0]}>
                <meshStandardMaterial color="#1a2a3a" roughness={0.5} metalness={0.6} />
            </Box>
        </group>
    )
})

// 歼-15舰载机 - 精细建模
export const J15CarrierFighter = React.memo(({ position, rotation }: { position: [number, number, number], rotation?: [number, number, number] }) => {
    return (
        <group position={position} rotation={rotation || [0, 0, 0]} scale={[0.5, 0.5, 0.5]}>
            {/* 机身 */}
            <RoundedBox args={[14, 1.6, 1.3]} radius={0.25} position={[0, 0.8, 0]}>
                <meshStandardMaterial color="#2a3a2a" roughness={0.4} metalness={0.7} />
            </RoundedBox>
            
            {/* 机头 */}
            <Box args={[2.5, 1.3, 1.1]} position={[-5.75, 0.8, 0]} rotation={[0, 0, 0.1]}>
                <meshStandardMaterial color="#1a2a1a" roughness={0.3} metalness={0.8} />
            </Box>
            
            {/* 座舱 */}
            <Box args={[1.3, 0.7, 1.2]} position={[-4.0, 1.0, 0]}>
                <meshStandardMaterial color="#0a0a0a" roughness={0.1} metalness={0.1} transparent opacity={0.3} />
            </Box>
            
            {/* 主翼 - 可折叠设计 */}
            <Box args={[0.22, 0.13, 8.0]} position={[0.5, 0.8, 0]} rotation={[0, 0, -0.02]}>
                <meshStandardMaterial color="#2a3a2a" roughness={0.4} metalness={0.7} />
            </Box>
            
            {/* 尾翼 */}
            <Box args={[0.2, 1.0, 2.5]} position={[5.5, 1.2, 0]}>
                <meshStandardMaterial color="#2a3a2a" roughness={0.4} metalness={0.7} />
            </Box>
            
            {/* 垂直尾翼 */}
            <Box args={[0.2, 2.0, 0.45]} position={[5.5, 1.9, 0]}>
                <meshStandardMaterial color="#2a3a2a" roughness={0.4} metalness={0.7} />
            </Box>
            
            {/* 着舰钩 */}
            <Box args={[0.1, 0.3, 0.1]} position={[4.0, 0.5, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
            </Box>
            
            {/* 发动机尾喷口 */}
            <Cylinder args={[0.45, 0.4, 0.9, 16]} position={[6.5, 0.8, 0]} rotation={[0, 0, Math.PI / 2]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.9} />
            </Cylinder>
            
            {/* 挂载点 */}
            {[-2.0, 0, 2.0, 4.0].map((x, i) => (
                <Cylinder key={i} args={[0.12, 0.12, 0.25, 8]} position={[x, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
                </Cylinder>
            ))}
        </group>
    )
})

// 中正式步枪 - 精细建模（1930年代）
export const Type24Rifle = React.memo(({ position, rotation }: { position: [number, number, number], rotation?: [number, number, number] }) => {
    return (
        <group position={position} rotation={rotation || [0, 0, 0]} scale={[2.0, 2.0, 2.0]}>
            {/* 枪托 */}
            <Box args={[1.2, 0.3, 0.2]} position={[-1.4, 0.1, 0]}>
                <meshStandardMaterial color="#3a2a1a" roughness={0.6} metalness={0.2} />
            </Box>
            {/* 上机匣 */}
            <RoundedBox args={[2.5, 0.3, 0.25]} radius={0.05} position={[0.1, 0.2, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.85} />
            </RoundedBox>
            {/* 枪管 */}
            <Cylinder args={[0.06, 0.06, 2.2, 16]} rotation={[0, 0, -Math.PI / 2]} position={[1.4, 0.2, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.9} />
            </Cylinder>
            {/* 准星 */}
            <Box args={[0.08, 0.16, 0.08]} position={[1.8, 0.25, 0]}>
                <meshStandardMaterial color="#0a0a0a" roughness={0.1} metalness={0.95} />
            </Box>
            {/* 照门 */}
            <Box args={[0.12, 0.18, 0.1]} position={[-0.3, 0.25, 0]}>
                <meshStandardMaterial color="#0a0a0a" roughness={0.1} metalness={0.95} />
            </Box>
            {/* 弹仓 */}
            <Box args={[0.3, 0.4, 0.2]} position={[0.2, -0.1, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.85} />
            </Box>
            {/* 扳机护圈 */}
            <Torus args={[0.22, 0.035, 8, 16]} position={[-0.2, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1.2, 1]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.85} />
            </Torus>
            {/* 扳机 */}
            <Box args={[0.1, 0.25, 0.05]} position={[-0.2, -0.05, 0.18]} rotation={[0.25, 0, 0]}>
                <meshStandardMaterial color="#0a0a0a" roughness={0.2} metalness={0.9} />
            </Box>
        </group>
    )
})

// 歼-6战斗机 - 精细建模（1960年代）
export const J6Fighter = React.memo(({ position, rotation }: { position: [number, number, number], rotation?: [number, number, number] }) => {
    return (
        <group position={position} rotation={rotation || [0, 0, 0]} scale={[0.6, 0.6, 0.6]}>
            {/* 机身 */}
            <RoundedBox args={[9, 1.3, 1.1]} radius={0.2} position={[0, 0.65, 0]}>
                <meshStandardMaterial color="#2a3a2a" roughness={0.4} metalness={0.7} />
            </RoundedBox>
            {/* 机头 */}
            <Box args={[1.8, 1.0, 0.9]} position={[-3.6, 0.65, 0]} rotation={[0, 0, 0.12]}>
                <meshStandardMaterial color="#1a2a1a" roughness={0.3} metalness={0.8} />
            </Box>
            {/* 座舱 */}
            <Box args={[1.0, 0.6, 0.95]} position={[-2.0, 0.85, 0]}>
                <meshStandardMaterial color="#0a0a0a" roughness={0.1} metalness={0.1} transparent opacity={0.3} />
            </Box>
            {/* 主翼 */}
            <Box args={[0.2, 0.1, 6.0]} position={[0, 0.65, 0]}>
                <meshStandardMaterial color="#2a3a2a" roughness={0.4} metalness={0.7} />
            </Box>
            {/* 尾翼 */}
            <Box args={[0.15, 0.9, 2.0]} position={[3.5, 1.0, 0]}>
                <meshStandardMaterial color="#2a3a2a" roughness={0.4} metalness={0.7} />
            </Box>
            {/* 垂直尾翼 */}
            <Box args={[0.15, 1.6, 0.35]} position={[3.5, 1.5, 0]}>
                <meshStandardMaterial color="#2a3a2a" roughness={0.4} metalness={0.7} />
            </Box>
            {/* 发动机进气道 */}
            <Cylinder args={[0.35, 0.35, 2.5, 16]} position={[-1.5, 0.65, 0]} rotation={[0, 0, Math.PI / 2]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
            </Cylinder>
        </group>
    )
})

// 79式狙击步枪 - 精细建模（1980年代）
export const Type79SniperRifle = React.memo(({ position, rotation }: { position: [number, number, number], rotation?: [number, number, number] }) => {
    return (
        <group position={position} rotation={rotation || [0, 0, 0]} scale={[2.0, 2.0, 2.0]}>
            {/* 枪托 */}
            <Box args={[1.0, 0.3, 0.2]} position={[-1.2, 0.1, 0]}>
                <meshStandardMaterial color="#2a2a2a" roughness={0.5} metalness={0.6} />
            </Box>
            {/* 上机匣 */}
            <RoundedBox args={[2.8, 0.32, 0.26]} radius={0.05} position={[0.2, 0.2, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.85} />
            </RoundedBox>
            {/* 枪管 */}
            <Cylinder args={[0.07, 0.07, 2.5, 16]} rotation={[0, 0, -Math.PI / 2]} position={[1.6, 0.2, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.9} />
            </Cylinder>
            {/* 瞄准镜 */}
            <Box args={[0.12, 0.12, 1.8]} position={[0.5, 0.45, 0]}>
                <meshStandardMaterial color="#0a0a0a" roughness={0.1} metalness={0.95} />
            </Box>
            {/* 瞄准镜支架 */}
            <Box args={[0.15, 0.08, 0.1]} position={[0.5, 0.35, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
            </Box>
            {/* 两脚架 */}
            <Box args={[0.05, 0.4, 0.05]} position={[1.2, -0.1, 0.15]} rotation={[0.3, 0, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.7} />
            </Box>
            <Box args={[0.05, 0.4, 0.05]} position={[1.2, -0.1, -0.15]} rotation={[-0.3, 0, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.7} />
            </Box>
        </group>
    )
})

// 03式自动步枪 - 精细建模（2000年代）
export const Type03Rifle = React.memo(({ position, rotation }: { position: [number, number, number], rotation?: [number, number, number] }) => {
    return (
        <group position={position} rotation={rotation || [0, 0, 0]} scale={[2.0, 2.0, 2.0]}>
            {/* 枪托 */}
            <Box args={[0.9, 0.28, 0.18]} position={[-1.1, 0.1, 0]}>
                <meshStandardMaterial color="#2a2a2a" roughness={0.5} metalness={0.6} />
            </Box>
            {/* 上机匣 */}
            <RoundedBox args={[2.3, 0.3, 0.24]} radius={0.05} position={[0.1, 0.2, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.85} />
            </RoundedBox>
            {/* 下机匣 */}
            <RoundedBox args={[1.7, 0.28, 0.22]} radius={0.05} position={[-0.3, 0.15, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.85} />
            </RoundedBox>
            {/* 枪管 */}
            <Cylinder args={[0.055, 0.055, 2.0, 16]} rotation={[0, 0, -Math.PI / 2]} position={[1.3, 0.2, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.9} />
            </Cylinder>
            {/* 准星 */}
            <Box args={[0.07, 0.14, 0.07]} position={[1.7, 0.25, 0]}>
                <meshStandardMaterial color="#0a0a0a" roughness={0.1} metalness={0.95} />
            </Box>
            {/* 照门 */}
            <Box args={[0.12, 0.18, 0.1]} position={[-0.2, 0.25, 0]}>
                <meshStandardMaterial color="#0a0a0a" roughness={0.1} metalness={0.95} />
            </Box>
            {/* 弹匣 */}
            <Box args={[0.32, 0.55, 0.2]} position={[-0.3, -0.15, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.85} />
            </Box>
            {/* 握把 */}
            <Box args={[0.38, 0.45, 0.16]} position={[-0.3, -0.05, 0]} rotation={[0, 0, 0.12]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.7} />
            </Box>
        </group>
    )
})

// 歼-11战斗机 - 精细建模（2000年代）
export const J11Fighter = React.memo(({ position, rotation }: { position: [number, number, number], rotation?: [number, number, number] }) => {
    return (
        <group position={position} rotation={rotation || [0, 0, 0]} scale={[0.5, 0.5, 0.5]}>
            {/* 机身 */}
            <RoundedBox args={[13, 1.6, 1.3]} radius={0.25} position={[0, 0.8, 0]}>
                <meshStandardMaterial color="#3d4a3d" roughness={0.4} metalness={0.7} />
            </RoundedBox>
            {/* 机头 */}
            <Box args={[2.2, 1.3, 1.1]} position={[-5.4, 0.8, 0]} rotation={[0, 0, 0.08]}>
                <meshStandardMaterial color="#2d3a2d" roughness={0.3} metalness={0.8} />
            </Box>
            {/* 座舱 */}
            <Box args={[1.2, 0.7, 1.2]} position={[-3.5, 1.0, 0]}>
                <meshStandardMaterial color="#0a0a0a" roughness={0.1} metalness={0.1} transparent opacity={0.3} />
            </Box>
            {/* 主翼 */}
            <Box args={[0.2, 0.12, 7.5]} position={[0.5, 0.8, 0]} rotation={[0, 0, -0.03]}>
                <meshStandardMaterial color="#3d4a3d" roughness={0.4} metalness={0.7} />
            </Box>
            {/* 尾翼 */}
            <Box args={[0.18, 1.1, 2.5]} position={[5.0, 1.2, 0]}>
                <meshStandardMaterial color="#3d4a3d" roughness={0.4} metalness={0.7} />
            </Box>
            {/* 垂直尾翼 */}
            <Box args={[0.18, 2.2, 0.45]} position={[5.0, 2.0, 0]}>
                <meshStandardMaterial color="#3d4a3d" roughness={0.4} metalness={0.7} />
            </Box>
            {/* 双发动机尾喷口 */}
            <Cylinder args={[0.45, 0.4, 0.9, 16]} position={[5.5, 0.8, -0.3]} rotation={[0, 0, Math.PI / 2]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.9} />
            </Cylinder>
            <Cylinder args={[0.45, 0.4, 0.9, 16]} position={[5.5, 0.8, 0.3]} rotation={[0, 0, Math.PI / 2]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.9} />
            </Cylinder>
        </group>
    )
})

// 东风-21D导弹 - 精细建模（2010年代）
export const DF21DMissile = React.memo(({ position, rotation }: { position: [number, number, number], rotation?: [number, number, number] }) => {
    return (
        <group position={position} rotation={rotation || [0, 0, 0]} scale={[0.8, 0.8, 0.8]}>
            {/* 弹体主体 */}
            <Cylinder args={[0.4, 0.4, 8, 20]} position={[0, 4, 0]}>
                <meshStandardMaterial color="#2a2a2a" roughness={0.3} metalness={0.8} />
            </Cylinder>
            {/* 弹头 */}
            <Cylinder args={[0.4, 0.1, 1.5, 20]} position={[0, 8.75, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.9} />
            </Cylinder>
            {/* 弹翼 */}
            {[0, 1, 2, 3].map((i) => (
                <Box key={i} args={[0.1, 1.2, 0.6]} position={[0, 5, 0]} rotation={[0, i * Math.PI / 2, 0]}>
                    <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
                </Box>
            ))}
            {/* 发射车底盘 */}
            <Box args={[3, 0.4, 1.5]} position={[0, 0.2, 0]}>
                <meshStandardMaterial color="#3a3a3a" roughness={0.5} metalness={0.6} />
            </Box>
            {/* 车轮 */}
            {[-1, 0, 1].map((x, i) => (
                <Cylinder key={i} args={[0.3, 0.3, 0.2, 16]} rotation={[0, 0, Math.PI / 2]} position={[x, 0.2, 0]}>
                    <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.7} />
                </Cylinder>
            ))}
        </group>
    )
})

// 运-20运输机 - 精细建模（2010年代）
export const Y20Transport = React.memo(({ position, rotation }: { position: [number, number, number], rotation?: [number, number, number] }) => {
    return (
        <group position={position} rotation={rotation || [0, 0, 0]} scale={[0.3, 0.3, 0.3]}>
            {/* 机身 */}
            <RoundedBox args={[35, 4.5, 4.0]} radius={0.5} position={[0, 2.25, 0]}>
                <meshStandardMaterial color="#2a3a2a" roughness={0.4} metalness={0.7} />
            </RoundedBox>
            {/* 机头 */}
            <Box args={[5, 4.0, 3.5]} position={[-15, 2.25, 0]} rotation={[0, 0, 0.05]}>
                <meshStandardMaterial color="#1a2a1a" roughness={0.3} metalness={0.8} />
            </Box>
            {/* 主翼 */}
            <Box args={[0.3, 0.2, 25]} position={[2, 2.25, 0]}>
                <meshStandardMaterial color="#2a3a2a" roughness={0.4} metalness={0.7} />
            </Box>
            {/* 尾翼 */}
            <Box args={[0.25, 3.5, 6]} position={[14, 4.0, 0]}>
                <meshStandardMaterial color="#2a3a2a" roughness={0.4} metalness={0.7} />
            </Box>
            {/* 垂直尾翼 */}
            <Box args={[0.25, 6, 1.5]} position={[14, 6.5, 0]}>
                <meshStandardMaterial color="#2a3a2a" roughness={0.4} metalness={0.7} />
            </Box>
            {/* 发动机 */}
            {[-8, 8].map((x, i) => (
                <Cylinder key={i} args={[0.8, 0.8, 2.5, 16]} position={[x, 2.25, 2.5]} rotation={[0, 0, Math.PI / 2]}>
                    <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
                </Cylinder>
            ))}
        </group>
    )
})

// 直-20直升机 - 精细建模（2010年代）
export const Z20Helicopter = React.memo(({ position, rotation }: { position: [number, number, number], rotation?: [number, number, number] }) => {
    return (
        <group position={position} rotation={rotation || [0, 0, 0]} scale={[0.6, 0.6, 0.6]}>
            {/* 机身 */}
            <RoundedBox args={[8, 2.0, 1.8]} radius={0.3} position={[0, 1.0, 0]}>
                <meshStandardMaterial color="#2a3a2a" roughness={0.4} metalness={0.7} />
            </RoundedBox>
            {/* 机头 */}
            <Box args={[1.5, 1.8, 1.6]} position={[-3.25, 1.0, 0]} rotation={[0, 0, 0.1]}>
                <meshStandardMaterial color="#1a2a1a" roughness={0.3} metalness={0.8} />
            </Box>
            {/* 主旋翼 */}
            <Cylinder args={[0.1, 0.1, 0.3, 8]} position={[0, 2.5, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
            </Cylinder>
            {[0, 1, 2, 3, 4].map((i) => (
                <Box key={i} args={[0.05, 6, 0.1]} rotation={[0, 0, i * Math.PI / 2.5]} position={[0, 2.5, 0]}>
                    <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.7} />
                </Box>
            ))}
            {/* 尾桨 */}
            <Box args={[0.08, 0.08, 1.5]} position={[3.5, 1.5, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
            </Box>
            {/* 起落架 */}
            <Box args={[0.1, 0.6, 0.1]} position={[-2, 0.3, 0.6]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
            </Box>
            <Box args={[0.1, 0.6, 0.1]} position={[-2, 0.3, -0.6]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
            </Box>
            <Box args={[0.1, 0.6, 0.1]} position={[2, 0.3, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
            </Box>
        </group>
    )
})

// 红旗-2防空导弹 - 精细建模（1960年代）
export const HQ2SAM = React.memo(({ position, rotation }: { position: [number, number, number], rotation?: [number, number, number] }) => {
    return (
        <group position={position} rotation={rotation || [0, 0, 0]} scale={[1.0, 1.0, 1.0]}>
            {/* 发射架 */}
            <Box args={[2.5, 0.3, 2.5]} position={[0, 0.15, 0]}>
                <meshStandardMaterial color="#2a2a2a" roughness={0.4} metalness={0.7} />
            </Box>
            {/* 导弹 */}
            <Cylinder args={[0.15, 0.15, 3.5, 16]} position={[0, 2.0, 0]}>
                <meshStandardMaterial color="#2a2a2a" roughness={0.3} metalness={0.8} />
            </Cylinder>
            {/* 弹头 */}
            <Cylinder args={[0.15, 0.05, 0.8, 16]} position={[0, 3.9, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.9} />
            </Cylinder>
            {/* 弹翼 */}
            {[0, 1, 2, 3].map((i) => (
                <Box key={i} args={[0.05, 0.8, 0.3]} position={[0, 2.5, 0]} rotation={[0, i * Math.PI / 2, 0]}>
                    <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
                </Box>
            ))}
            {/* 发射架支撑 */}
            {[-1, 1].map((x, i) => (
                <Box key={i} args={[0.1, 0.8, 0.1]} position={[x, 0.5, 0]}>
                    <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.7} />
                </Box>
            ))}
        </group>
    )
})

// 63式水陆两栖坦克 - 精细建模（1960年代）
export const Type63AmphibiousTank = React.memo(({ position, rotation }: { position: [number, number, number], rotation?: [number, number, number] }) => {
    return (
        <group position={position} rotation={rotation || [0, 0, 0]}>
            {/* 车体主体 */}
            <RoundedBox args={[3.8, 0.95, 2.6]} radius={0.12} position={[0, 0.475, 0]}>
                <meshStandardMaterial color="#2d4a2d" roughness={0.4} metalness={0.7} />
            </RoundedBox>
            {/* 履带系统 */}
            {[-1.4, -0.7, 0, 0.7, 1.4].map((x, i) => (
                <group key={i}>
                    <Cylinder args={[0.33, 0.33, 0.28, 20]} rotation={[Math.PI / 2, 0, 0]} position={[x, 0.28, 0]}>
                        <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
                    </Cylinder>
                </group>
            ))}
            {/* 炮塔 */}
            <RoundedBox args={[2.0, 0.75, 1.9]} radius={0.15} position={[0, 0.95, 0]}>
                <meshStandardMaterial color="#2d4a2d" roughness={0.5} metalness={0.6} />
            </RoundedBox>
            {/* 主炮 */}
            <Cylinder args={[0.13, 0.13, 3.5, 16]} rotation={[0, 0, -Math.PI / 2]} position={[2.75, 1.1, 0]}>
                <meshStandardMaterial color="#2a2a2a" roughness={0.3} metalness={0.85} />
            </Cylinder>
            {/* 浮箱 */}
            <Box args={[0.2, 0.6, 2.4]} position={[2.0, 0.5, 0]}>
                <meshStandardMaterial color="#1a2a1a" roughness={0.5} metalness={0.6} />
            </Box>
            <Box args={[0.2, 0.6, 2.4]} position={[-2.0, 0.5, 0]}>
                <meshStandardMaterial color="#1a2a1a" roughness={0.5} metalness={0.6} />
            </Box>
        </group>
    )
})

// 红箭-8反坦克导弹 - 精细建模（1980年代）
export const HJ8ATGM = React.memo(({ position, rotation }: { position: [number, number, number], rotation?: [number, number, number] }) => {
    return (
        <group position={position} rotation={rotation || [0, 0, 0]} scale={[1.2, 1.2, 1.2]}>
            {/* 发射筒 */}
            <Cylinder args={[0.12, 0.12, 1.5, 16]} rotation={[0, 0, -Math.PI / 2]} position={[0.75, 0.3, 0]}>
                <meshStandardMaterial color="#2a2a2a" roughness={0.4} metalness={0.7} />
            </Cylinder>
            {/* 发射架 */}
            <Box args={[0.15, 0.4, 0.3]} position={[0, 0.2, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
            </Box>
            {/* 瞄准具 */}
            <Box args={[0.12, 0.1, 0.15]} position={[-0.3, 0.35, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
            </Box>
            {/* 三脚架 */}
            <Box args={[0.05, 0.5, 0.05]} position={[0, -0.15, 0.2]} rotation={[0.3, 0, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.7} />
            </Box>
            <Box args={[0.05, 0.5, 0.05]} position={[0, -0.15, -0.2]} rotation={[-0.3, 0, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.7} />
            </Box>
            <Box args={[0.05, 0.5, 0.05]} position={[-0.2, -0.15, 0]} rotation={[0, 0, 0.3]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.7} />
            </Box>
        </group>
    )
})

// 052D驱逐舰 - 精细建模（2010年代）
export const Type052DDestroyer = React.memo(({ position, rotation }: { position: [number, number, number], rotation?: [number, number, number] }) => {
    return (
        <group position={position} rotation={rotation || [0, 0, 0]} scale={[0.15, 0.15, 0.15]}>
            {/* 船体 */}
            <RoundedBox args={[120, 8, 16]} radius={1} position={[0, 4, 0]}>
                <meshStandardMaterial color="#2a3a2a" roughness={0.4} metalness={0.7} />
            </RoundedBox>
            {/* 舰桥 */}
            <Box args={[15, 12, 8]} position={[20, 10, 0]}>
                <meshStandardMaterial color="#1a2a1a" roughness={0.3} metalness={0.8} />
            </Box>
            {/* 主炮 */}
            <Cylinder args={[1.2, 1.2, 6, 16]} position={[45, 8, 0]} rotation={[0, 0, Math.PI / 2]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
            </Cylinder>
            {/* 垂直发射系统 */}
            {[30, 35, 40].map((x, i) => (
                <Box key={i} args={[3, 0.5, 3]} position={[x, 8.5, 0]}>
                    <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
                </Box>
            ))}
            {/* 烟囱 */}
            <Box args={[4, 8, 4]} position={[10, 8, 0]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.7} />
            </Box>
        </group>
    )
})

// 055驱逐舰 - 精细建模（2010年代）
export const Type055Destroyer = React.memo(({ position, rotation }: { position: [number, number, number], rotation?: [number, number, number] }) => {
    return (
        <group position={position} rotation={rotation || [0, 0, 0]} scale={[0.15, 0.15, 0.15]}>
            {/* 船体 */}
            <RoundedBox args={[140, 9, 18]} radius={1.2} position={[0, 4.5, 0]}>
                <meshStandardMaterial color="#2a2a2a" roughness={0.3} metalness={0.8} />
            </RoundedBox>
            {/* 一体化隐身舰桥 */}
            <Box args={[18, 15, 10]} position={[25, 12, 0]} rotation={[0, 0, 0.05]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.9} />
            </Box>
            {/* 主炮 */}
            <Cylinder args={[1.3, 1.3, 7, 16]} position={[50, 9, 0]} rotation={[0, 0, Math.PI / 2]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
            </Cylinder>
            {/* 垂直发射系统 - 前后各一组 */}
            {[35, 40, 45].map((x, i) => (
                <Box key={i} args={[3.5, 0.6, 3.5]} position={[x, 9.5, 0]}>
                    <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
                </Box>
            ))}
            {[-35, -40, -45].map((x, i) => (
                <Box key={i} args={[3.5, 0.6, 3.5]} position={[x, 9.5, 0]}>
                    <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
                </Box>
            ))}
            {/* 双烟囱 */}
            <Box args={[5, 10, 5]} position={[15, 9, -2]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.7} />
            </Box>
            <Box args={[5, 10, 5]} position={[15, 9, 2]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.7} />
            </Box>
        </group>
    )
})