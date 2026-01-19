import { useState, useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Text, PointerLockControls, Html, Box, Cylinder, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

// 导入拆分后的组件
import { 
    Type15Tank, Type191Pistol, Type20Rifle,
    Type59Tank, Type99Tank,
    Type56Rifle, Type81Rifle, Type95Rifle,
    Type92Pistol,
    PHL03RocketLauncher, Rainbow5Drone, Type69RocketLauncher,
    J5Fighter, J10Fighter, J20Fighter,
    Type152Cannon,
    LiaoningCarrier, J15CarrierFighter
} from './models/EquipmentModels'
import { Player } from './scene/Player'
import { MuseumHall } from './scene/MuseumHall'
import { ExhibitStand } from './scene/ExhibitStand'
import { EQUIPMENT_MEDIA } from './data/EquipmentMedia'
import { ExhibitInfoPanel } from './components/ExhibitInfoPanel'
import { VideoPlayer } from './components/VideoPlayer'

// 预创建向量对象 - 避免每帧 new
const _forward = new THREE.Vector3()
const _right = new THREE.Vector3()
const _moveVec = new THREE.Vector3()
const _up = new THREE.Vector3(0, 1, 0)
const _viewDir = new THREE.Vector3()
const _targetPos = new THREE.Vector3()

interface HeritageMuseumProps {
    playerGender?: 'male' | 'female'
}

export function HeritageMuseum({ playerGender = 'male' }: HeritageMuseumProps) {
    const playerRef = useRef<THREE.Group>(null)
    const { camera, scene } = useThree()
    const raycaster = useRef(new THREE.Raycaster())

    const [viewMode, setViewMode] = useState<'third' | 'first'>('third')
    const [activeInfo, setActiveInfo] = useState<{ 
        pos: [number, number, number], 
        title: string, 
        content: string,
        audioUrl?: string,
        videoUrl?: string
    } | null>(null)
    const [showVideo, setShowVideo] = useState(false)
    const [currentVideoUrl, setCurrentVideoUrl] = useState('')
    const [currentVideoTitle, setCurrentVideoTitle] = useState('')
    const audioRef = useRef<HTMLAudioElement | null>(null)

    const keys = useRef({ w: false, a: false, s: false, d: false, space: false })
    const yVelocity = useRef(0)
    const isGrounded = useRef(true)

    // 键盘事件
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const k = e.key.toLowerCase()
            if (k === 'w') keys.current.w = true
            if (k === 'a') keys.current.a = true
            if (k === 's') keys.current.s = true
            if (k === 'd') keys.current.d = true
            if (e.code === 'Space' || e.key === ' ') {
                keys.current.space = true
                e.preventDefault()
            }
            if (k === 'z') setViewMode(prev => prev === 'third' ? 'first' : 'third')
        }
        const handleKeyUp = (e: KeyboardEvent) => {
            const k = e.key.toLowerCase()
            if (k === 'w') keys.current.w = false
            if (k === 'a') keys.current.a = false
            if (k === 's') keys.current.s = false
            if (k === 'd') keys.current.d = false
            if (e.code === 'Space' || e.key === ' ') keys.current.space = false
        }

        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)

        camera.position.set(0, 4, -70)
        camera.lookAt(0, 2, -85)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
        }
    }, [camera])

    // 快捷键处理 - 单独处理，确保activeInfo变化时能响应
    useEffect(() => {
        const handleShortcut = (e: KeyboardEvent) => {
            if (!activeInfo) return

            // 按键1：播放语音
            if (e.key === '1' || e.code === 'Digit1') {
                e.preventDefault()
                e.stopPropagation()
                
                // 停止之前的语音
                if ('speechSynthesis' in window) {
                    speechSynthesis.cancel()
                }

                if (activeInfo.audioUrl) {
                    // 停止之前的音频
                    if (audioRef.current) {
                        audioRef.current.pause()
                        audioRef.current = null
                    }
                    const audio = new Audio(activeInfo.audioUrl)
                    audioRef.current = audio
                    audio.play().catch(err => {
                        console.warn('语音文件播放失败，使用TTS:', err)
                        audioRef.current = null
                        // 使用专业的TTS
                        if ('speechSynthesis' in window) {
                            const utterance = new SpeechSynthesisUtterance(activeInfo.content)
                            utterance.lang = 'zh-CN'
                            utterance.rate = 0.85  // 稍慢，更专业
                            utterance.pitch = 1.0  // 正常音调
                            utterance.volume = 1.0
                            // 尝试选择更好的语音
                            const selectVoice = () => {
                                const voices = speechSynthesis.getVoices()
                                const chineseVoice = voices.find(v => 
                                    v.lang.includes('zh') && 
                                    (v.name.includes('Female') || v.name.includes('女') || v.name.includes('Microsoft') || v.name.includes('Xiaoxiao'))
                                ) || voices.find(v => v.lang.includes('zh'))
                                if (chineseVoice) {
                                    utterance.voice = chineseVoice
                                }
                                speechSynthesis.speak(utterance)
                            }
                            if (speechSynthesis.getVoices().length > 0) {
                                selectVoice()
                            } else {
                                speechSynthesis.onvoiceschanged = selectVoice
                            }
                        }
                    })
                    audio.onended = () => {
                        audioRef.current = null
                    }
                    audio.onerror = () => {
                        audioRef.current = null
                    }
                } else if ('speechSynthesis' in window) {
                    const utterance = new SpeechSynthesisUtterance(activeInfo.content)
                    utterance.lang = 'zh-CN'
                    utterance.rate = 0.85
                    utterance.pitch = 1.0
                    utterance.volume = 1.0
                    const selectVoice = () => {
                        const voices = speechSynthesis.getVoices()
                        const chineseVoice = voices.find(v => 
                            v.lang.includes('zh') && 
                            (v.name.includes('Female') || v.name.includes('女') || v.name.includes('Microsoft') || v.name.includes('Xiaoxiao'))
                        ) || voices.find(v => v.lang.includes('zh'))
                        if (chineseVoice) {
                            utterance.voice = chineseVoice
                        }
                        speechSynthesis.speak(utterance)
                    }
                    if (speechSynthesis.getVoices().length > 0) {
                        selectVoice()
                    } else {
                        speechSynthesis.onvoiceschanged = selectVoice
                    }
                }
            }
            
            // 按键2：播放视频
            if (e.key === '2' || e.code === 'Digit2') {
                e.preventDefault()
                e.stopPropagation()
                if (activeInfo.videoUrl) {
                    setCurrentVideoUrl(activeInfo.videoUrl)
                    setCurrentVideoTitle(activeInfo.title)
                    setShowVideo(true)
                }
            }

            // 按键3：全屏视频（如果视频正在播放）
            if ((e.key === '3' || e.code === 'Digit3') && showVideo) {
                e.preventDefault()
                e.stopPropagation()
                const video = document.querySelector('video') as HTMLVideoElement
                if (video) {
                    if (!document.fullscreenElement) {
                        video.requestFullscreen?.() || 
                        (video as any).webkitRequestFullscreen?.() || 
                        (video as any).mozRequestFullScreen?.()
                    } else {
                        document.exitFullscreen?.() || 
                        (document as any).webkitExitFullscreen?.() || 
                        (document as any).mozCancelFullScreen?.()
                    }
                }
            }

            // ESC键：关闭视频或停止语音
            if (e.key === 'Escape' || e.key === 'Esc') {
                e.preventDefault()
                e.stopPropagation()
                
                // 如果视频正在播放，关闭视频
                if (showVideo) {
                    setShowVideo(false)
                    setCurrentVideoUrl('')
                    setCurrentVideoTitle('')
                }
                
                // 停止语音讲解
                if ('speechSynthesis' in window) {
                    speechSynthesis.cancel()
                }
                if (audioRef.current) {
                    audioRef.current.pause()
                    audioRef.current = null
                }
            }
        }

        window.addEventListener('keydown', handleShortcut, true) // 使用capture阶段确保能捕获
        return () => {
            window.removeEventListener('keydown', handleShortcut, true)
        }
    }, [activeInfo, showVideo])

    // 点击交互
    useEffect(() => {
        const handleMouseDown = (e: MouseEvent) => {
            if (e.button !== 0) return

            raycaster.current.setFromCamera(new THREE.Vector2(0, 0), camera)
            const intersects = raycaster.current.intersectObjects(scene.children, true)

            if (intersects.length > 0) {
                let hit: THREE.Object3D | null = intersects[0].object
                let foundExhibit = null

                while (hit) {
                    if (hit.userData?.isExhibit) {
                        foundExhibit = hit
                        break
                    }
                    hit = hit.parent
                }

                if (foundExhibit) {
                    const exhibitName = foundExhibit.userData.name
                    const media = EQUIPMENT_MEDIA[exhibitName]
                    setActiveInfo({
                        pos: [foundExhibit.position.x, foundExhibit.position.y + 4, foundExhibit.position.z],
                        title: exhibitName,
                        content: foundExhibit.userData.description,
                        audioUrl: media?.audioUrl,
                        videoUrl: media?.videoUrl
                    })
                } else {
                    setActiveInfo(null)
                }
            }
        }

        window.addEventListener('mousedown', handleMouseDown)
        return () => window.removeEventListener('mousedown', handleMouseDown)
    }, [camera, scene])

    // 碰撞检测函数
    const checkCollision = (pos: THREE.Vector3): boolean => {
        const playerRadius = 0.5  // 玩家碰撞半径
        const playerHeight = 1.8  // 玩家高度
        
        let hasCollision = false
        
        // 遍历场景中的所有对象，查找展台
        scene.traverse((obj) => {
            if (hasCollision) return  // 如果已经检测到碰撞，提前退出
            
            if (obj.userData?.isCollider && obj.position) {
                const exhibitPos = obj.position
                const colliderRadius = obj.userData.colliderRadius || 3.5
                const colliderHeight = obj.userData.colliderHeight || 5.0
                
                // 计算水平距离
                const dx = pos.x - exhibitPos.x
                const dz = pos.z - exhibitPos.z
                const horizontalDist = Math.sqrt(dx * dx + dz * dz)
                
                // 检查水平碰撞
                if (horizontalDist < playerRadius + colliderRadius) {
                    // 检查垂直碰撞（玩家是否在展台高度范围内）
                    const playerBottom = pos.y
                    const playerTop = pos.y + playerHeight
                    const exhibitBottom = exhibitPos.y
                    const exhibitTop = exhibitPos.y + colliderHeight
                    
                    if (playerTop > exhibitBottom && playerBottom < exhibitTop) {
                        hasCollision = true  // 发生碰撞
                    }
                }
            }
        })
        
        return hasCollision
    }

    // 帧更新 - 优化版（带碰撞检测）
    useFrame((_, delta) => {
        if (!playerRef.current) return

        const dt = Math.min(delta, 0.05)
        const moveSpeed = 10 * dt

        camera.getWorldDirection(_forward)
        _forward.y = 0
        _forward.normalize()
        _right.crossVectors(_forward, _up).normalize()
        _moveVec.set(0, 0, 0)

        if (keys.current.w) _moveVec.add(_forward)
        if (keys.current.s) _moveVec.sub(_forward)
        if (keys.current.a) _moveVec.sub(_right)
        if (keys.current.d) _moveVec.add(_right)

        // 记录移动速度用于动画
        const isMoving = _moveVec.lengthSq() > 0
        playerRef.current.userData.velocity = isMoving ? 1 : 0

        if (isMoving) {
            // 计算移动方向的角度，让玩家面向移动方向
            const moveAngle = Math.atan2(_moveVec.x, _moveVec.z)
            playerRef.current.rotation.y = moveAngle
            
            _moveVec.normalize().multiplyScalar(moveSpeed)
            
            // 保存移动前的位置
            const prevPos = playerRef.current.position.clone()
            
            // 尝试移动
            playerRef.current.position.add(_moveVec)
            
            // 边界检查 - 允许走到墙边（墙在x=-19和19，墙厚0.2，内侧在-18.9和18.9；z在-110和80，墙厚0.2，内侧在-109.9和79.9）
            // 留0.05的边距，让玩家可以非常接近墙
            playerRef.current.position.x = THREE.MathUtils.clamp(playerRef.current.position.x, -18.85, 18.85)
            playerRef.current.position.z = THREE.MathUtils.clamp(playerRef.current.position.z, -109.85, 79.85)
            
            // 碰撞检测 - 如果碰撞则回退
            if (checkCollision(playerRef.current.position)) {
                playerRef.current.position.copy(prevPos)
            }
        }

        // 简化物理
        if (keys.current.space && isGrounded.current) {
            yVelocity.current = 8
            isGrounded.current = false
        }

        yVelocity.current -= 18 * dt
        playerRef.current.position.y += yVelocity.current * dt

        if (playerRef.current.position.y <= 0) {
            playerRef.current.position.y = 0
            yVelocity.current = 0
            isGrounded.current = true
        }

        // 边界限制已在移动时处理，这里不需要重复限制

        // 相机跟随
        const playerPos = playerRef.current.position

        if (viewMode === 'first') {
            camera.position.set(playerPos.x, playerPos.y + 1.6, playerPos.z)
        } else {
            camera.getWorldDirection(_viewDir)
            _targetPos.copy(playerPos).sub(_viewDir.clone().multiplyScalar(5))
            _targetPos.y = playerPos.y + 2
            camera.position.lerp(_targetPos, 0.4)
        }
    })

    return (
        <group>
            <PointerLockControls selector="canvas" />

            {/* 博物馆 */}
            <MuseumHall />

            {/* 玩家 */}
            <Player ref={playerRef} position={[0, 0, -70]} rotation={[0, 0, 0]} gender={playerGender} />

            {/* ========== 展品 - 严格按历史时间轴排列（从早到晚）========== */}
            
            {/* 1950年代 */}
            <ExhibitStand position={[-8, 0, -80]} year="1954" label="54式手枪" description="54式手枪是中国第一代制式军用手枪，仿制自苏联托卡列夫TT-33。采用7.62×25mm手枪弹，有效射程50米，弹匣容量8发。该枪结构简单、可靠性高，在抗美援朝战争后开始大量装备中国人民解放军，服役时间长达数十年，是中国轻武器发展史上的重要里程碑。">
                <Type92Pistol position={[0, 0.3, 0]} rotation={[0, Math.PI / 2, 0]} />
            </ExhibitStand>

            <ExhibitStand position={[8, 0, -80]} year="1956" label="56式半自动步枪" description="56式半自动步枪是中国人民解放军第一代制式步枪，仿制自苏联SKS半自动步枪。使用7.62×39mm中间威力弹，采用导气式自动原理，有效射程400米，弹仓容量10发。该枪精度高、后坐力小，在1962年中印边境自卫反击战和对越自卫还击战中表现优异，是中国轻武器史上的经典之作。">
                <Type56Rifle position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
            </ExhibitStand>

            <ExhibitStand position={[-8, 0, -70]} year="1956" label="歼-5战斗机" description="歼-5是中国第一代喷气式战斗机，仿制自苏联米格-17F。采用单发涡喷发动机，最大速度1145公里/小时，实用升限16600米，航程1560公里。1956年首飞成功，标志着中国航空工业从螺旋桨时代进入喷气时代。该机在国土防空作战中击落多架敌机，为中国航空工业发展奠定了坚实基础。">
                <J5Fighter position={[0, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} />
            </ExhibitStand>

            <ExhibitStand position={[8, 0, -70]} year="1959" label="59式主战坦克" description="59式主战坦克是中国第一代主战坦克，仿制自苏联T-54A。战斗全重36吨，装备100mm线膛炮，最大速度50公里/小时，最大行程560公里。1959年定型生产，是中国坦克工业从无到有的重大突破。该坦克在1962年中印边境自卫反击战和对越自卫还击战中发挥了重要作用，生产数量超过1万辆，是中国装甲力量的基础。">
                <Type59Tank position={[0, 0, 0]} rotation={[0, -Math.PI / 4, 0]} />
            </ExhibitStand>

            {/* 1960年代 */}
            <ExhibitStand position={[-8, 0, -60]} year="1965" label="152mm加农炮" description="152mm加农炮是中国自行研制的大口径压制火炮，最大射程17.2公里，可发射多种弹药包括榴弹、穿甲弹、火箭增程弹等。该炮火力强大、精度高，主要用于远程火力支援、反装甲作战和摧毁坚固工事。在历次边境冲突中发挥了重要作用，是中国炮兵装备现代化的重要标志。">
                <Type152Cannon position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
            </ExhibitStand>

            <ExhibitStand position={[8, 0, -60]} year="1969" label="69式火箭筒" description="69式40mm火箭筒是中国自行研制的单兵反坦克武器，仿制自苏联RPG-7。有效射程300米，可击穿300mm均质钢装甲，全重6.3公斤，便于单兵携带。该武器结构简单、操作方便、威力大，在对越自卫还击战中大量使用，是中国步兵反坦克能力的重要装备。">
                <Type69RocketLauncher position={[0, 0.2, 0]} rotation={[0, Math.PI / 2, 0]} />
            </ExhibitStand>

            {/* 1980年代 */}
            <ExhibitStand position={[-8, 0, -50]} year="1981" label="81式自动步枪" description="81式自动步枪是对越自卫还击战经验总结的产物，采用7.62×39mm弹药，有效射程400米，弹匣容量30发。该枪可靠性极高，在恶劣环境下仍能正常工作，精度优于56式，深受部队欢迎。在对越自卫还击战后期和两山轮战中表现突出，被誉为'战场上的可靠伙伴'，是中国轻武器自主创新的重要成果。">
                <Type81Rifle position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
            </ExhibitStand>

            {/* 1990年代 */}
            <ExhibitStand position={[8, 0, -50]} year="1992" label="92式手枪" description="92式手枪是中国自行研制的新一代制式手枪，有9mm和5.8mm两种口径。9mm版本广泛装备公安、武警和军队，采用双排双进弹匣设计，弹匣容量15发，有效射程50米。该枪精度高、可靠性好、人机工效优秀，在反恐维稳、执法执勤等任务中表现优异，是中国手枪发展的重要里程碑。">
                <Type92Pistol position={[0, 0.3, 0]} rotation={[0, Math.PI / 2, 0]} />
            </ExhibitStand>

            <ExhibitStand position={[-8, 0, -40]} year="1995" label="95式自动步枪" description="95式自动步枪是中国第二代制式步枪，采用无托结构设计，使用5.8×42mm小口径弹药。全枪长746mm，比传统有托步枪短200mm以上，更适合现代战争环境。有效射程400米，弹匣容量30发，精度高、后坐力小。该枪的列装标志着中国轻武器进入小口径时代，是中国轻武器现代化的标志性产品。">
                <Type95Rifle position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
            </ExhibitStand>

            <ExhibitStand position={[8, 0, -40]} year="1998" label="歼-10战斗机" description="歼-10是中国自主研制的第三代多用途战斗机，采用鸭翼+三角翼布局，单发设计。最大速度2.2马赫，实用升限18000米，最大航程2500公里。装备先进的火控雷达和多种精确制导武器，具备超视距空战和对地攻击能力。1998年首飞成功，标志着中国航空工业从仿制走向自主创新，是中国空军现代化的核心装备。">
                <J10Fighter position={[0, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} />
            </ExhibitStand>

            <ExhibitStand position={[-8, 0, -30]} year="1999" label="99式主战坦克" description="99式主战坦克是中国第三代主战坦克，战斗全重55吨，装备125mm滑膛炮，最大速度70公里/小时。采用复合装甲和反应装甲，防护能力强；配备先进的火控系统和信息化设备，具备'猎-歼'能力。该坦克综合性能达到世界先进水平，在'和平使命'等联合军演中表现优异，是中国陆军现代化的标志性装备。">
                <Type99Tank position={[0, 0, 0]} rotation={[0, -Math.PI / 4, 0]} />
            </ExhibitStand>

            {/* 2000年代 */}
            <ExhibitStand position={[8, 0, -30]} year="2004" label="PHL-03远程火箭炮" description="PHL-03是300mm远程多管火箭炮系统，12管联装，最大射程150公里，可发射多种精确制导火箭弹。采用轮式底盘，机动性强；配备先进的火控系统，可同时打击多个目标。该武器系统火力密度大、覆盖范围广、反应速度快，是中国陆军远程火力打击的核心装备，在现代化战争中具有重要地位。">
                <PHL03RocketLauncher position={[0, 0, 0]} rotation={[0, -Math.PI / 4, 0]} />
            </ExhibitStand>

            {/* 2010年代 */}
            <ExhibitStand position={[-8, 0, -20]} year="2012" label="辽宁舰" description="辽宁舰是中国第一艘航空母舰，由乌克兰瓦良格号改造而成，满载排水量6.75万吨。采用滑跃式甲板设计，可搭载24架歼-15舰载机和多架直升机。2012年正式服役，标志着中国海军进入航母时代，实现了从近海防御向远海防卫的战略转型。辽宁舰的服役极大提升了中国海军的远海作战能力和战略威慑力。">
                <LiaoningCarrier position={[0, 0.5, 0]} rotation={[0, Math.PI / 2, 0]} />
            </ExhibitStand>

            <ExhibitStand position={[8, 0, -20]} year="2013" label="歼-15舰载机" description="歼-15是中国第一代舰载战斗机，基于苏-33设计改进，采用双发设计。最大速度2.4马赫，最大航程3500公里，可挂载多种精确制导武器。该机可在辽宁舰和山东舰上滑跃起飞，具备强大的对海、对空、对地打击能力。歼-15的列装使中国成为世界上少数几个能够自主研制舰载战斗机的国家之一。">
                <J15CarrierFighter position={[0, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} />
            </ExhibitStand>

            <ExhibitStand position={[-8, 0, -10]} year="2015" label="15式轻型坦克" description="15式轻型坦克是中国新一代轻型主战坦克，战斗全重约35吨，装备105mm线膛炮。采用先进的动力系统和悬挂系统，最大速度70公里/小时，适合高原、山地、水网等复杂地形作战。该坦克信息化程度高，具备网络化作战能力，在高原边境地区具有重要战略价值，是中国陆军装备现代化的最新成果。">
                <Type15Tank position={[0, 0, 0]} rotation={[0, -Math.PI / 4, 0]} />
            </ExhibitStand>

            <ExhibitStand position={[8, 0, -10]} year="2017" label="歼-20战斗机" description="歼-20是中国第五代隐身战斗机，采用双发、鸭翼、全动垂尾设计。最大速度2.5马赫，具备超音速巡航能力，最大航程5500公里。采用先进的隐身技术和综合航电系统，配备有源相控阵雷达和多种精确制导武器。2017年正式服役，使中国成为世界上第二个装备第五代战斗机的国家，标志着中国航空工业达到世界顶尖水平。">
                <J20Fighter position={[0, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} />
            </ExhibitStand>

            <ExhibitStand position={[-8, 0, 0]} year="2017" label="彩虹-5无人机" description="彩虹-5是中国研制的大型察打一体无人机，翼展21米，最大起飞重量3.3吨。最大航时60小时，最大航程6500公里，可挂载多种精确制导武器，包括空地导弹、精确制导炸弹等。该无人机具备长航时、大载荷、多任务能力，可用于侦察监视、精确打击、电子对抗等多种任务，是中国无人机技术的代表作品。">
                <Rainbow5Drone position={[0, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} />
            </ExhibitStand>


            {/* 2020年代 */}
            <ExhibitStand position={[8, 0, 0]} year="2020" label="191式手枪" description="191式手枪是中国新一代制式军用手枪，采用模块化设计，有5.8mm和9mm两种口径可选。采用聚合物套筒座，重量轻、人机工效好；配备皮卡汀尼导轨，可加装战术灯、激光指示器等附件。该枪精度高、可靠性好，代表了中国手枪设计的最新水平，是未来中国军队和执法部门的主要装备。">
                <Type191Pistol position={[0, 0.3, 0]} rotation={[0, Math.PI / 2, 0]} />
            </ExhibitStand>

            <ExhibitStand position={[-8, 0, 10]} year="2020" label="20式模块化步枪" description="20式枪族是中国新一代单兵综合作战系统的核心装备，采用模块化设计理念。包括突击步枪、精确射手步枪、短突击步枪等多种型号，使用统一的5.8×42mm弹药。配备先进的光学瞄准镜、夜视仪、战术附件等，具备网络化作战能力。该枪族精度高、可靠性好、扩展性强，是中国轻武器发展的最新成果，代表了世界先进水平。">
                <Type20Rifle position={[0, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />
            </ExhibitStand>

            <ExhibitStand position={[8, 0, 10]} year="2020" label="99A2主战坦克" description="99A2是99式主战坦克的最新改进型，战斗全重58吨，装备125mm滑膛炮和先进的火控系统。采用新型复合装甲和主动防护系统，防护能力大幅提升；配备数字化战场管理系统，具备网络中心战能力。该坦克火力、防护、机动、信息化四大性能均衡，综合战力达到世界顶尖水平，是中国陆军的主战装备。">
                <Type99Tank position={[0, 0, 0]} rotation={[0, -Math.PI / 4, 0]} />
            </ExhibitStand>

            {/* 中央展区 - 大型展品 */}
            <ExhibitStand position={[0, 0, 30]} year="2022" label="福建舰" description="福建舰是中国第三艘航空母舰，也是第一艘完全自主设计建造的航母，满载排水量超过8万吨。采用平直甲板和电磁弹射系统，可搭载更多舰载机和更重的飞机。配备先进的综合电子系统和武器系统，作战能力大幅提升。福建舰的服役标志着中国航母技术达到世界先进水平，使中国成为世界上少数几个能够自主建造大型航母的国家。">
                <LiaoningCarrier position={[0, 0.5, 0]} rotation={[0, 0, 0]} />
            </ExhibitStand>

            <ExhibitStand position={[0, 0, 50]} year="2024" label="歼-35战斗机" description="歼-35是中国新一代隐身舰载战斗机，采用双发设计，具备优秀的隐身性能和超音速巡航能力。该机可在福建舰等采用电磁弹射的航母上起降，可挂载多种精确制导武器，具备强大的对空、对海、对地打击能力。歼-35的列装将大幅提升中国航母编队的作战能力，使中国海军远海作战能力达到新的高度。">
                <J20Fighter position={[0, 1.5, 0]} rotation={[0, 0, 0]} />
            </ExhibitStand>

            {/* 信息弹窗 - 如果视频正在播放则不显示 */}
            {activeInfo && !showVideo && (
                <Html position={activeInfo.pos} center>
                    <ExhibitInfoPanel
                        title={activeInfo.title}
                        content={activeInfo.content}
                        audioUrl={activeInfo.audioUrl}
                        videoUrl={activeInfo.videoUrl}
                        onClose={() => setActiveInfo(null)}
                        onPlayAudio={() => {
                            // 停止之前的语音
                            if ('speechSynthesis' in window) {
                                speechSynthesis.cancel()
                            }
                            
                            if (activeInfo.audioUrl) {
                                const audio = new Audio(activeInfo.audioUrl)
                                audio.play().catch(err => {
                                    console.warn('语音文件播放失败，使用TTS:', err)
                                    // 使用专业的TTS
                                    if ('speechSynthesis' in window) {
                                        const utterance = new SpeechSynthesisUtterance(activeInfo.content)
                                        utterance.lang = 'zh-CN'
                                        utterance.rate = 0.85
                                        utterance.pitch = 1.0
                                        utterance.volume = 1.0
                                        const selectVoice = () => {
                                            const voices = speechSynthesis.getVoices()
                                            const chineseVoice = voices.find(v => 
                                                v.lang.includes('zh') && 
                                                (v.name.includes('Female') || v.name.includes('女') || v.name.includes('Microsoft') || v.name.includes('Xiaoxiao'))
                                            ) || voices.find(v => v.lang.includes('zh'))
                                            if (chineseVoice) {
                                                utterance.voice = chineseVoice
                                            }
                                            speechSynthesis.speak(utterance)
                                        }
                                        if (speechSynthesis.getVoices().length > 0) {
                                            selectVoice()
                                        } else {
                                            speechSynthesis.onvoiceschanged = selectVoice
                                        }
                                    }
                                })
                            } else if ('speechSynthesis' in window) {
                                const utterance = new SpeechSynthesisUtterance(activeInfo.content)
                                utterance.lang = 'zh-CN'
                                utterance.rate = 0.85
                                utterance.pitch = 1.0
                                utterance.volume = 1.0
                                const selectVoice = () => {
                                    const voices = speechSynthesis.getVoices()
                                    const chineseVoice = voices.find(v => 
                                        v.lang.includes('zh') && 
                                        (v.name.includes('Female') || v.name.includes('女') || v.name.includes('Microsoft') || v.name.includes('Xiaoxiao'))
                                    ) || voices.find(v => v.lang.includes('zh'))
                                    if (chineseVoice) {
                                        utterance.voice = chineseVoice
                                    }
                                    speechSynthesis.speak(utterance)
                                }
                                if (speechSynthesis.getVoices().length > 0) {
                                    selectVoice()
                                } else {
                                    speechSynthesis.onvoiceschanged = selectVoice
                                }
                            }
                        }}
                        onPlayVideo={() => {
                            if (activeInfo.videoUrl) {
                                setCurrentVideoUrl(activeInfo.videoUrl)
                                setCurrentVideoTitle(activeInfo.title)
                                setShowVideo(true)
                            }
                        }}
                    />
                </Html>
            )}

            {/* 视频播放器 - 在3D场景中显示，位置在信息面板上方 */}
            {showVideo && activeInfo && (
                <Html 
                    position={[activeInfo.pos[0], activeInfo.pos[1] + 6, activeInfo.pos[2]]} 
                    center
                    zIndexRange={[100, 0]}
                >
                    <VideoPlayer
                        videoUrl={currentVideoUrl}
                        title={currentVideoTitle}
                        position={activeInfo.pos}
                        onClose={() => {
                            setShowVideo(false)
                            setCurrentVideoUrl('')
                            setCurrentVideoTitle('')
                        }}
                        onFullscreen={() => {
                            // 全屏处理已在VideoPlayer内部完成
                        }}
                    />
                </Html>
            )}

            {/* 明亮灯光系统 */}
            <ambientLight intensity={1.2} color="#ffffff" />
            <hemisphereLight intensity={0.8} color="#ffffff" groundColor="#f5f5f5" />
            <directionalLight position={[20, 30, 10]} intensity={1} color="#fff8f0" />
            <directionalLight position={[-20, 30, -10]} intensity={0.6} color="#f0f5ff" />

            {/* 展品聚光灯 - 覆盖所有展品 */}
            {[-80, -70, -60, -50, -40, -30, -20, -10, 0, 10, 30, 50].map((z, i) => (
                <spotLight key={i} position={[i % 2 === 0 ? -8 : 8, 10, z]} angle={0.4} penumbra={0.5} intensity={1.2} color="#fff8f0" distance={15} />
            ))}
            {/* 中央展区聚光灯 */}
            <spotLight position={[0, 12, 30]} angle={0.5} penumbra={0.4} intensity={1.5} color="#fff8f0" distance={18} />
            <spotLight position={[0, 12, 50]} angle={0.5} penumbra={0.4} intensity={1.5} color="#fff8f0" distance={18} />

            {/* ========== 投影仪系统 ========== */}
            
            {/* 投影仪 - 安装在天花板，朝向前墙 */}
            <group position={[0, 10.5, 60]}>
                {/* 投影仪主体 */}
                <Box args={[1.4, 0.6, 1.0]} position={[0, 0, 0]}>
                    <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.8} />
                </Box>
                {/* 投影仪底座 */}
                <Box args={[1.2, 0.15, 0.8]} position={[0, -0.38, 0]}>
                    <meshStandardMaterial color="#2a2a2a" roughness={0.3} metalness={0.7} />
                </Box>
                {/* 投影仪镜头 - 朝前墙斜下方 */}
                <Cylinder args={[0.18, 0.22, 0.35, 16]} position={[0, -0.25, 0.45]} rotation={[-0.28, 0, 0]}>
                    <meshStandardMaterial color="#0a0a0a" roughness={0.1} metalness={0.9} />
                </Cylinder>
                {/* 镜头玻璃 - 发光效果 */}
                <Cylinder args={[0.14, 0.14, 0.06, 16]} position={[0, -0.35, 0.55]} rotation={[-0.28, 0, 0]}>
                    <meshBasicMaterial color="#66bbff" opacity={0.9} transparent />
                </Cylinder>
                {/* 投影仪指示灯 */}
                <Box args={[0.08, 0.08, 0.02]} position={[0.5, 0.15, 0.5]}>
                    <meshBasicMaterial color="#00ff00" />
                </Box>
                <Box args={[0.06, 0.06, 0.02]} position={[0.38, 0.15, 0.5]}>
                    <meshBasicMaterial color="#ff6600" />
                </Box>
                {/* 投影仪吊架 */}
                <Cylinder args={[0.08, 0.08, 0.5, 8]} position={[0, 0.55, 0]}>
                    <meshStandardMaterial color="#333" roughness={0.4} metalness={0.6} />
                </Cylinder>
            </group>
            
            {/* 投影光束 - 从投影仪直接照向投影对话框 */}
            <mesh position={[0, 8, 69]} rotation={[-0.27, 0, 0]}>
                <coneGeometry args={[5, 12, 32, 1, true]} />
                <meshBasicMaterial 
                    color="#88ccff" 
                    opacity={0.05} 
                    transparent 
                    side={2}
                    depthWrite={false}
                />
            </mesh>
            {/* 内层光束 - 更亮更集中 */}
            <mesh position={[0, 8, 69]} rotation={[-0.27, 0, 0]}>
                <coneGeometry args={[3.5, 12, 32, 1, true]} />
                <meshBasicMaterial 
                    color="#aaddff" 
                    opacity={0.04} 
                    transparent 
                    side={2}
                    depthWrite={false}
                />
            </mesh>
            
            {/* 聚光灯照亮投影对话框 - 直接照向文字 */}
            <spotLight 
                position={[0, 10.5, 60]} 
                angle={0.4} 
                penumbra={0.3} 
                intensity={3} 
                color="#aaddff"
                distance={30}
                target-position={[0, 5.5, 78]}
            />
            {/* 补充光源确保文字亮度 */}
            <pointLight position={[0, 8, 75]} intensity={1.5} color="#aaddff" distance={15} />
            
            {/* ========== 投影对话框 - 贴在前墙内侧，面向馆内 ========== */}
            <group position={[0, 5.5, 78]} rotation={[0, Math.PI, 0]}>
                {/* 投影光晕效果 - 外层 */}
                <mesh position={[0, 0, -0.3]}>
                    <planeGeometry args={[20, 9]} />
                    <meshBasicMaterial 
                        color="#77aadd" 
                        opacity={0.12} 
                        transparent 
                        depthWrite={false}
                        side={2}
                    />
                </mesh>
                {/* 投影光晕效果 - 中层 */}
                <mesh position={[0, 0, -0.25]}>
                    <planeGeometry args={[17, 7]} />
                    <meshBasicMaterial 
                        color="#99ccff" 
                        opacity={0.15} 
                        transparent 
                        depthWrite={false}
                        side={2}
                    />
                </mesh>
                
                {/* 对话框背景 */}
                <RoundedBox args={[15, 5.5, 0.12]} radius={0.25} position={[0, 0, -0.15]}>
                    <meshStandardMaterial 
                        color="#0a1828" 
                        opacity={0.96} 
                        transparent 
                        roughness={0.1}
                        metalness={0.05}
                    />
                </RoundedBox>
                
                {/* 投影边缘光效 */}
                <RoundedBox args={[15.5, 6, 0.03]} radius={0.3} position={[0, 0, -0.22]}>
                    <meshBasicMaterial 
                        color="#66aadd" 
                        opacity={0.45} 
                        transparent
                        depthWrite={false}
                    />
                </RoundedBox>
                
                {/* 内部投影区域 */}
                <RoundedBox args={[14.2, 4.8, 0.08]} radius={0.18} position={[0, 0, -0.08]}>
                    <meshStandardMaterial 
                        color="#0c1c30" 
                        opacity={0.98} 
                        transparent 
                        roughness={0.05}
                    />
                </RoundedBox>
                
                {/* 标题文字 */}
                <Text 
                    position={[0, 1.3, 0.02]} 
                    fontSize={1.2} 
                    color="#ffdd66"
                    anchorX="center"
                    anchorY="middle"
                    fontWeight="bold"
                    renderOrder={100}
                >
                    欢迎来到兵工博物馆
                </Text>
                
                {/* 英文副标题 */}
                <Text 
                    position={[0, 0.35, 0.02]} 
                    fontSize={0.38} 
                    color="#88ccff"
                    anchorX="center"
                    anchorY="middle"
                    renderOrder={100}
                >
                    Welcome to Military Industry Museum
                </Text>
                
                {/* 分隔线 */}
                <Box args={[11, 0.025, 0.01]} position={[0, -0.15, 0.01]}>
                    <meshBasicMaterial color="#4488bb" opacity={0.7} transparent />
                </Box>
                
                {/* 操作提示 */}
                <Text 
                    position={[0, -0.85, 0.02]} 
                    fontSize={0.3} 
                    color="#99ccee"
                    anchorX="center"
                    anchorY="middle"
                    renderOrder={100}
                >
                    点击屏幕锁定鼠标 | WASD 移动 | Z 切换人称
                </Text>
                
                {/* 底部装饰条 */}
                <Box args={[13, 0.07, 0.02]} position={[0, -1.7, 0.01]}>
                    <meshBasicMaterial color="#5599cc" opacity={0.55} transparent />
                </Box>
                <Box args={[9, 0.04, 0.02]} position={[0, -1.88, 0.01]}>
                    <meshBasicMaterial color="#4488bb" opacity={0.35} transparent />
                </Box>
                
                {/* 四角投影光点 */}
                {[
                    [-6.8, 2], [6.8, 2],
                    [-6.8, -2], [6.8, -2]
                ].map(([x, y], i) => (
                    <group key={i} position={[x, y, 0.02]}>
                        <Cylinder args={[0.18, 0.18, 0.02, 16]} rotation={[Math.PI / 2, 0, 0]}>
                            <meshBasicMaterial color="#55aadd" opacity={0.6} transparent />
                        </Cylinder>
                        <Cylinder args={[0.1, 0.1, 0.03, 16]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
                            <meshBasicMaterial color="#aaddff" opacity={0.8} transparent />
                        </Cylinder>
                    </group>
                ))}
                
                {/* 顶部投影光源效果 */}
                <pointLight position={[0, 3, -2]} intensity={0.6} color="#aaddff" distance={10} />
            </group>
        </group>
    )
}
