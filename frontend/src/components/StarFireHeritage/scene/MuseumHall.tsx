import React, { useMemo } from 'react'
import { Box } from '@react-three/drei'
import { CeilingDome, CeilingPanel } from './CeilingDecor'
import { Column } from './Decorations'
// 分离的装饰组件 - 按需加载，提升性能
import { DisplayCasesGroup } from './DisplayCases'
import { AreaSign } from './MuseumSignage'
import { ProfessionalLightingSystem } from './LightingSystem'
import { EntranceHall, ExitSign } from './EntranceHall'
import { FloorMarkingSystem } from './FloorMarkings'
import { HistoryTimelineWall } from './WallExhibits'
import { FloorPatterns } from './WallPatterns'
import { WallDecorationSystem } from './WallDecorations'

// 优化后的博物馆展厅
export const MuseumHall = React.memo(() => {
    // 缓存位置数组
    const columnPositions = useMemo(() => [-60, -20, 20, 60], [])
    
    // 区域标识位置
    const areaSigns = useMemo(() => [
        { z: -90, title: '创业初期', subtitle: '1931-1949' },
        { z: -70, title: '建设发展', subtitle: '1950-1965' },
        { z: -50, title: '自主探索', subtitle: '1966-1978' },
        { z: -30, title: '改革开放', subtitle: '1979-1999' },
        { z: -10, title: '跨越腾飞', subtitle: '2000-2015' },
        { z: 20, title: '强军新时代', subtitle: '2016-2025' },
    ], [])

    return (
        <group>
            {/* ===== 地板 ===== */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, -15]}>
                <planeGeometry args={[40, 190]} />
                <meshStandardMaterial color="#f0ebe0" roughness={0.25} metalness={0.1} />
            </mesh>

            {/* 地板装饰图案 */}
            <FloorPatterns />

            {/* 地面标识系统 */}
            <FloorMarkingSystem />

            {/* ===== 柱子 (减少到8根) ===== */}
            {columnPositions.map((z) => (
                <React.Fragment key={z}>
                    <Column position={[-17, 0, z]} />
                    <Column position={[17, 0, z]} />
                </React.Fragment>
            ))}

            {/* ===== 墙壁 ===== */}
            {/* 左右侧墙 - 延长到完全覆盖后墙位置（z=-110到z=80） */}
            <Box args={[0.2, 11, 190]} position={[-19, 5.5, -15]}>
                <meshStandardMaterial color="#f5f0e5" roughness={0.5} />
            </Box>
            <Box args={[0.2, 11, 190]} position={[19, 5.5, -15]}>
                <meshStandardMaterial color="#f5f0e5" roughness={0.5} />
            </Box>
            {/* 后墙 - 完全封闭入口处 */}
            <Box args={[38, 11, 0.2]} position={[0, 5.5, -110]}>
                <meshStandardMaterial color="#f5f0e5" roughness={0.5} />
            </Box>
            
            {/* 前墙 - 完全封闭前端 */}
            <Box args={[38, 11, 0.2]} position={[0, 5.5, 80]}>
                <meshStandardMaterial color="#f5f0e5" roughness={0.5} />
            </Box>
            
            {/* 碰撞墙已移除，使用边界限制防止穿墙 */}

            {/* 历史照片墙 - 按时间轴摆放 */}
            <HistoryTimelineWall />
            
            {/* 墙壁装饰系统 */}
            <WallDecorationSystem />
            
            {/* 区域标识牌 */}
            {areaSigns.map((area, i) => (
                <AreaSign
                    key={i}
                    position={[0, 8, area.z] as [number, number, number]}
                    title={area.title}
                    subtitle={area.subtitle}
                />
            ))}

            {/* ===== 天花板 ===== */}
            {/* 主天花板板 */}
            <Box args={[40, 0.3, 190]} position={[0, 11, -15]}>
                <meshStandardMaterial color="#faf8f2" roughness={0.4} />
            </Box>
            
            {/* 天花板装饰线条 - 纵向 */}
            {[-30, -15, 0, 15, 30].map((x) => (
                <Box key={`v-${x}`} args={[0.05, 0.1, 188]} position={[x, 10.95, -15]}>
                    <meshStandardMaterial color="#e8e0d5" roughness={0.5} />
                </Box>
            ))}
            
            {/* 天花板装饰线条 - 横向 */}
            {[-90, -60, -30, 0, 30, 60, 90].map((z) => (
                <Box key={`h-${z}`} args={[38, 0.1, 0.05]} position={[0, 10.95, z - 15]}>
                    <meshStandardMaterial color="#e8e0d5" roughness={0.5} />
                </Box>
            ))}

            {/* 天花板穹顶 (减少到2个) */}
            <CeilingDome position={[0, 11, -40]} />
            <CeilingDome position={[0, 11, 40]} />

            {/* 天花板面板 (减少数量) */}
            <CeilingPanel position={[-9, 11, -70]} />
            <CeilingPanel position={[9, 11, -70]} />
            <CeilingPanel position={[-9, 11, 70]} />
            <CeilingPanel position={[9, 11, 70]} />

            {/* 天花板横梁 (减少数量) - 优化设计 */}
            {[-80, -40, 0, 40, 80].map((z) => (
                <React.Fragment key={z}>
                    {/* 主横梁 */}
                    <Box args={[38, 0.15, 0.3]} position={[0, 10.8, z]}>
                        <meshStandardMaterial color="#c9a55c" roughness={0.3} metalness={0.6} />
                    </Box>
                    {/* 横梁装饰线 */}
                    <Box args={[38, 0.05, 0.1]} position={[0, 10.9, z]}>
                        <meshStandardMaterial color="#8b7355" roughness={0.4} metalness={0.5} />
                    </Box>
                </React.Fragment>
            ))}

            {/* 基础环境光 - 由ProfessionalLightingSystem提供更专业的照明 */}

            {/* 展示柜组已移除 */}

            {/* ===== 入口大厅 ===== */}
            <EntranceHall />
            
            {/* ===== 出口标识 ===== */}
            <ExitSign />
            
            {/* ===== 专业照明系统 ===== */}
            <ProfessionalLightingSystem />
        </group>
    )
})
