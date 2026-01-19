import React, { useRef, useEffect, useState } from 'react'
import { CloseOutlined, FullscreenOutlined } from '@ant-design/icons'

interface VideoPlayerProps {
    videoUrl: string
    title: string
    position: [number, number, number]
    onClose: () => void
    onFullscreen?: () => void
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
    videoUrl,
    title,
    position,
    onClose,
    onFullscreen
}) => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [isFullscreen, setIsFullscreen] = useState(false)

    // 检测是否为 Bilibili 视频链接
    const isBilibiliUrl = videoUrl.includes('bilibili.com/video/')
    
    // 如果是 Bilibili 链接，提取 BV 号并转换为嵌入链接
    const getBilibiliEmbedUrl = (url: string): string => {
        const bvMatch = url.match(/BV[\w]+/)
        if (bvMatch) {
            return `https://player.bilibili.com/player.html?bvid=${bvMatch[0]}&autoplay=false&page=1`
        }
        return url
    }

    useEffect(() => {
        if (!isBilibiliUrl) {
            const video = videoRef.current
            if (video) {
                video.play().catch(e => {
                    console.warn('视频自动播放失败:', e)
                })
            }
        }

        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement)
        }

        document.addEventListener('fullscreenchange', handleFullscreenChange)
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange)
        }
    }, [isBilibiliUrl])

    const handleFullscreen = () => {
        const video = videoRef.current
        if (video) {
            if (!isFullscreen) {
                video.requestFullscreen?.() || 
                (video as any).webkitRequestFullscreen?.() || 
                (video as any).mozRequestFullScreen?.()
            } else {
                document.exitFullscreen?.() || 
                (document as any).webkitExitFullscreen?.() || 
                (document as any).mozCancelFullScreen?.()
            }
        }
        if (onFullscreen) {
            onFullscreen()
        }
    }

    return (
        <div style={{
            position: 'relative',
            width: '800px',
            maxWidth: '85vw',
            background: 'rgba(255, 255, 255, 0.98)',
            borderRadius: '12px',
            border: '3px solid #c9a55c',
            boxShadow: '0 12px 48px rgba(0, 0, 0, 0.4)',
            overflow: 'hidden',
            pointerEvents: 'auto',
            backdropFilter: 'blur(10px)'
        }}>
            {/* 标题栏 */}
            <div style={{
                background: 'linear-gradient(to bottom, #c9a55c, #b8954a)',
                padding: '16px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <h3 style={{
                    margin: 0,
                    color: '#fff',
                    fontSize: '18px',
                    fontWeight: 600
                }}>
                    {title}
                </h3>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={handleFullscreen}
                        style={{
                            background: 'rgba(255, 255, 255, 0.2)',
                            border: 'none',
                            color: '#fff',
                            fontSize: '16px',
                            padding: '6px 10px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
                        }}
                        title="全屏 (3)"
                    >
                        <FullscreenOutlined />
                    </button>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'rgba(255, 255, 255, 0.2)',
                            border: 'none',
                            color: '#fff',
                            fontSize: '16px',
                            padding: '6px 10px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
                        }}
                        title="关闭 (ESC)"
                    >
                        <CloseOutlined />
                    </button>
                </div>
            </div>

            {/* 视频容器 - 保持16:9比例 */}
            <div style={{
                position: 'relative',
                width: '100%',
                paddingBottom: '56.25%', // 16:9 比例
                background: '#000',
                overflow: 'hidden'
            }}>
                {isBilibiliUrl ? (
                    <iframe
                        src={getBilibiliEmbedUrl(videoUrl)}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            border: 'none'
                        }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                ) : (
                    <video
                        ref={videoRef}
                        src={videoUrl}
                        controls
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            display: 'block',
                            objectFit: 'contain'
                        }}
                        onError={(e) => {
                            console.warn('视频加载失败:', videoUrl)
                        }}
                    />
                )}
            </div>

            {/* 提示 */}
            <div style={{
                padding: '12px 20px',
                background: '#f5f5f5',
                fontSize: '12px',
                color: '#666',
                textAlign: 'center',
                borderTop: '1px solid #eee'
            }}>
                按 3 全屏 | 按 ESC 关闭
            </div>
        </div>
    )
}

