import React, { useState, useRef, useEffect } from 'react'
import { SoundOutlined, VideoCameraOutlined, CloseOutlined, PauseOutlined } from '@ant-design/icons'

interface ExhibitInfoPanelProps {
    title: string
    content: string
    audioUrl?: string
    videoUrl?: string
    onClose: () => void
    onPlayAudio?: () => void
    onPlayVideo?: () => void
}

export const ExhibitInfoPanel: React.FC<ExhibitInfoPanelProps> = ({
    title,
    content,
    audioUrl,
    videoUrl,
    onClose,
    onPlayAudio,
    onPlayVideo
}) => {
    const [isPlayingAudio, setIsPlayingAudio] = useState(false)
    const [isPlayingVideo, setIsPlayingVideo] = useState(false)
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const videoRef = useRef<HTMLVideoElement | null>(null)

    // 处理语音播报 - 改进版，使用更专业的TTS
    const handlePlayAudio = () => {
        // 停止之前的语音
        if ('speechSynthesis' in window) {
            speechSynthesis.cancel()
        }
        const currentAudio = audioRef.current
        if (currentAudio) {
            currentAudio.pause()
            audioRef.current = null
        }

        if (audioUrl) {
            const existingAudio = audioRef.current
            if (existingAudio) {
                if (isPlayingAudio) {
                    existingAudio.pause()
                    setIsPlayingAudio(false)
                } else {
                    existingAudio.play().catch((err: Error) => {
                        console.error('播放音频失败:', err)
                        setIsPlayingAudio(false)
                    })
                    setIsPlayingAudio(true)
                }
            } else {
                const audio = new Audio(audioUrl)
                audioRef.current = audio
                audio.play()
                setIsPlayingAudio(true)
                audio.onended = () => {
                    setIsPlayingAudio(false)
                    audioRef.current = null
                }
                audio.onerror = () => {
                    console.warn('语音文件加载失败，使用TTS:', audioUrl)
                    setIsPlayingAudio(false)
                    audioRef.current = null
                    // 使用专业的TTS
                    if ('speechSynthesis' in window) {
                        const utterance = new SpeechSynthesisUtterance(content)
                        utterance.lang = 'zh-CN'
                        utterance.rate = 0.85  // 稍慢，更专业
                        utterance.pitch = 1.0
                        utterance.volume = 1.0
                        // 等待语音列表加载
                        const speakWithVoice = () => {
                            const voices = speechSynthesis.getVoices()
                            const chineseVoice = voices.find(v => 
                                v.lang.includes('zh') && 
                                (v.name.includes('Female') || v.name.includes('女') || v.name.includes('Microsoft'))
                            ) || voices.find(v => v.lang.includes('zh'))
                            if (chineseVoice) {
                                utterance.voice = chineseVoice
                            }
                            speechSynthesis.speak(utterance)
                            setIsPlayingAudio(true)
                            utterance.onend = () => setIsPlayingAudio(false)
                        }
                        if (speechSynthesis.getVoices().length > 0) {
                            speakWithVoice()
                        } else {
                            speechSynthesis.onvoiceschanged = speakWithVoice
                        }
                    }
                }
            }
        } else if (onPlayAudio) {
            onPlayAudio()
        } else if ('speechSynthesis' in window) {
            // 直接使用TTS
            const utterance = new SpeechSynthesisUtterance(content)
            utterance.lang = 'zh-CN'
            utterance.rate = 0.85
            utterance.pitch = 1.0
            utterance.volume = 1.0
            const speakWithVoice = () => {
                const voices = speechSynthesis.getVoices()
                const chineseVoice = voices.find(v => 
                    v.lang.includes('zh') && 
                    (v.name.includes('Female') || v.name.includes('女') || v.name.includes('Microsoft'))
                ) || voices.find(v => v.lang.includes('zh'))
                if (chineseVoice) {
                    utterance.voice = chineseVoice
                }
                speechSynthesis.speak(utterance)
                setIsPlayingAudio(true)
                utterance.onend = () => setIsPlayingAudio(false)
            }
            if (speechSynthesis.getVoices().length > 0) {
                speakWithVoice()
            } else {
                speechSynthesis.onvoiceschanged = speakWithVoice
            }
        }
    }

    // 处理视频播放
    const handlePlayVideo = () => {
        if (videoUrl) {
            setIsPlayingVideo(true)
            if (onPlayVideo) {
                onPlayVideo()
            }
        } else if (onPlayVideo) {
            onPlayVideo()
        }
    }

    // 清理音频
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause()
                audioRef.current = null
            }
        }
    }, [])

    return (
        <div style={{
            background: 'rgba(255, 255, 255, 0.98)',
            padding: '20px 24px',
            borderRadius: '12px',
            border: '2px solid #c9a55c',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            color: '#333',
            width: '360px',
            maxWidth: '90vw',
            pointerEvents: 'auto',
            position: 'relative'
        }}>
            {/* 关闭按钮 */}
            <button
                onClick={onClose}
                style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'transparent',
                    border: 'none',
                    fontSize: '18px',
                    color: '#999',
                    cursor: 'pointer',
                    padding: '4px',
                    lineHeight: 1,
                    borderRadius: '4px',
                    transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#c9a55c'
                    e.currentTarget.style.background = '#f5f5f5'
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#999'
                    e.currentTarget.style.background = 'transparent'
                }}
            >
                <CloseOutlined />
            </button>

            {/* 标题 */}
            <h3 style={{
                margin: '0 0 12px 0',
                color: '#c9a55c',
                fontSize: '20px',
                fontWeight: 600,
                paddingRight: '30px'
            }}>
                {title}
            </h3>

            {/* 内容 */}
            <p style={{
                margin: '0 0 16px 0',
                fontSize: '14px',
                lineHeight: '1.8',
                color: '#555'
            }}>
                {content}
            </p>

            {/* 操作按钮 */}
            <div style={{
                display: 'flex',
                gap: '12px',
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: '1px solid #eee'
            }}>
                {/* 语音播报按钮 */}
                <button
                    onClick={handlePlayAudio}
                    style={{
                        flex: 1,
                        padding: '10px 16px',
                        background: isPlayingAudio ? '#c9a55c' : '#f0f0f0',
                        color: isPlayingAudio ? '#fff' : '#333',
                        border: `2px solid ${isPlayingAudio ? '#c9a55c' : '#ddd'}`,
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        if (!isPlayingAudio) {
                            e.currentTarget.style.background = '#e8e8e8'
                            e.currentTarget.style.borderColor = '#c9a55c'
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!isPlayingAudio) {
                            e.currentTarget.style.background = '#f0f0f0'
                            e.currentTarget.style.borderColor = '#ddd'
                        }
                    }}
                >
                    {isPlayingAudio ? <PauseOutlined /> : <SoundOutlined />}
                    {isPlayingAudio ? '暂停' : '语音讲解 (1)'}
                </button>

                {/* 视频介绍按钮 */}
                <button
                    onClick={handlePlayVideo}
                    style={{
                        flex: 1,
                        padding: '10px 16px',
                        background: isPlayingVideo ? '#c9a55c' : '#f0f0f0',
                        color: isPlayingVideo ? '#fff' : '#333',
                        border: `2px solid ${isPlayingVideo ? '#c9a55c' : '#ddd'}`,
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        if (!isPlayingVideo) {
                            e.currentTarget.style.background = '#e8e8e8'
                            e.currentTarget.style.borderColor = '#c9a55c'
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!isPlayingVideo) {
                            e.currentTarget.style.background = '#f0f0f0'
                            e.currentTarget.style.borderColor = '#ddd'
                        }
                    }}
                >
                    <VideoCameraOutlined />
                    视频介绍 (2)
                </button>
            </div>

            {/* 快捷键提示 */}
            <div style={{
                marginTop: '12px',
                fontSize: '12px',
                color: '#999',
                textAlign: 'center'
            }}>
                快捷键：按 1 播放语音 | 按 2 播放视频 | 按 3 全屏视频
            </div>
        </div>
    )
}

