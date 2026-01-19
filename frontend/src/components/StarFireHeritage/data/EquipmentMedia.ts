// 武器媒体资源配置
// 语音文件路径：/audio/武器名称.mp3
// 视频文件路径：/videos/武器名称.mp4

export interface EquipmentMedia {
    name: string
    audioUrl?: string  // 语音播报文件路径
    videoUrl?: string  // 视频介绍文件路径
}

export const EQUIPMENT_MEDIA: Record<string, EquipmentMedia> = {
    '54式手枪': {
        name: '54式手枪',
        audioUrl: '/audio/54式手枪.mp3',
        videoUrl: 'https://www.bilibili.com/video/BV1DwptzNEw5?vd_source=1bbfa23b2a2b8777865e7847a6b5bda3'
    },
    '56式半自动步枪': {
        name: '56式半自动步枪',
        audioUrl: '/audio/56式半自动步枪.mp3',
        videoUrl: 'https://www.bilibili.com/video/BV1jx4y1h73A?vd_source=1bbfa23b2a2b8777865e7847a6b5bda3'
    },
    '59式主战坦克': {
        name: '59式主战坦克',
        audioUrl: '/audio/59式主战坦克.mp3',
        videoUrl: 'https://www.bilibili.com/video/BV1DHQoY1EKz?vd_source=1bbfa23b2a2b8777865e7847a6b5bda3'
    },
    '69式火箭筒': {
        name: '69式火箭筒',
        audioUrl: '/audio/69式火箭筒.mp3',
        videoUrl: 'https://www.bilibili.com/video/BV1Li421h7Wq?vd_source=1bbfa23b2a2b8777865e7847a6b5bda3'
    },
    '152mm加农炮': {
        name: '152mm加农炮',
        audioUrl: '/audio/152mm加农炮.mp3',
        videoUrl: 'https://www.bilibili.com/video/BV1aD4y1w7mG?vd_source=1bbfa23b2a2b8777865e7847a6b5bda3'
    },
    '81式自动步枪': {
        name: '81式自动步枪',
        audioUrl: '/audio/81式自动步枪.mp3',
        videoUrl: 'https://www.bilibili.com/video/BV1su4y1n7w9?vd_source=1bbfa23b2a2b8777865e7847a6b5bda3'
    },
    '92式手枪': {
        name: '92式手枪',
        audioUrl: '/audio/92式手枪.mp3',
        videoUrl: 'https://www.bilibili.com/video/BV1iEiQBZEJc?vd_source=1bbfa23b2a2b8777865e7847a6b5bda3'
    },
    '95式自动步枪': {
        name: '95式自动步枪',
        audioUrl: '/audio/95式自动步枪.mp3',
        videoUrl: 'https://www.bilibili.com/video/BV14P411C7Az?vd_source=1bbfa23b2a2b8777865e7847a6b5bda3'
    },
    '歼-10战斗机': {
        name: '歼-10战斗机',
        audioUrl: '/audio/歼-10战斗机.mp3',
        videoUrl: 'https://www.bilibili.com/video/BV15F411N7HS?vd_source=1bbfa23b2a2b8777865e7847a6b5bda3'
    },
    '99式主战坦克': {
        name: '99式主战坦克',
        audioUrl: '/audio/99式主战坦克.mp3',
        videoUrl: 'https://www.bilibili.com/video/BV1oH4y1d7AP?vd_source=1bbfa23b2a2b8777865e7847a6b5bda3'
    },
    'PHL-03远程火箭炮': {
        name: 'PHL-03远程火箭炮',
        audioUrl: '/audio/PHL-03远程火箭炮.mp3',
        videoUrl: 'https://www.bilibili.com/video/BV1Ne4y1Z7qJ?vd_source=1bbfa23b2a2b8777865e7847a6b5bda3'
    },
    '辽宁舰': {
        name: '辽宁舰',
        audioUrl: '/audio/辽宁舰.mp3',
        videoUrl: 'https://www.bilibili.com/video/BV1LcLezyEfM?vd_source=1bbfa23b2a2b8777865e7847a6b5bda3'
    },
    '歼-15舰载机': {
        name: '歼-15舰载机',
        audioUrl: '/audio/歼-15舰载机.mp3',
        videoUrl: 'https://www.bilibili.com/video/BV1N5LtzrEzG?vd_source=1bbfa23b2a2b8777865e7847a6b5bda3'
    },
    '15式轻型坦克': {
        name: '15式轻型坦克',
        audioUrl: '/audio/15式轻型坦克.mp3',
        videoUrl: 'https://www.bilibili.com/video/BV19qrsBbEBz?vd_source=1bbfa23b2a2b8777865e7847a6b5bda3'
    },
    '歼-20战斗机': {
        name: '歼-20战斗机',
        audioUrl: '/audio/歼-20战斗机.mp3',
        videoUrl: 'https://www.bilibili.com/video/BV1P9onY2EFT?vd_source=1bbfa23b2a2b8777865e7847a6b5bda3'
    },
    '彩虹-5无人机': {
        name: '彩虹-5无人机',
        audioUrl: '/audio/彩虹-5无人机.mp3',
        videoUrl: 'https://www.bilibili.com/video/BV1y8411f7bE?vd_source=1bbfa23b2a2b8777865e7847a6b5bda3'
    },
    '191式手枪': {
        name: '191式手枪',
        audioUrl: '/audio/191式手枪.mp3',
        videoUrl: 'https://www.bilibili.com/video/BV13D4fzqE1N?vd_source=1bbfa23b2a2b8777865e7847a6b5bda3'
    },
    '20式模块化步枪': {
        name: '20式模块化步枪',
        audioUrl: '/audio/20式模块化步枪.mp3',
        videoUrl: 'https://www.bilibili.com/video/BV1mHTtz4Evs?vd_source=1bbfa23b2a2b8777865e7847a6b5bda3'
    },
    '99A2主战坦克': {
        name: '99A2主战坦克',
        audioUrl: '/audio/99A2主战坦克.mp3',
        videoUrl: 'https://www.bilibili.com/video/BV1wGdZYjEmQ?vd_source=1bbfa23b2a2b8777865e7847a6b5bda3'
    },
    '歼-5战斗机': {
        name: '歼-5战斗机',
        audioUrl: '/audio/歼-5战斗机.mp3',
        videoUrl: 'https://www.bilibili.com/video/BV1Ss411L7aS?vd_source=1bbfa23b2a2b8777865e7847a6b5bda3'
    },
    '福建舰': {
        name: '福建舰',
        audioUrl: '/audio/福建舰.mp3',
        videoUrl: 'https://www.bilibili.com/video/BV18M7yzqE3y?vd_source=1bbfa23b2a2b8777865e7847a6b5bda3'
    },
    '歼-35战斗机': {
        name: '歼-35战斗机',
        audioUrl: '/audio/歼-35战斗机.mp3',
        videoUrl: 'https://www.bilibili.com/video/BV1HDxkzzEYY?vd_source=1bbfa23b2a2b8777865e7847a6b5bda3'
    },
    '中正式步枪': {
        name: '中正式步枪',
        audioUrl: '/audio/中正式步枪.mp3',
        videoUrl: 'https://www.bilibili.com/video/BV1ZG411K7qb?vd_source=1bbfa23b2a2b8777865e7847a6b5bda3'
    },
    '歼-6战斗机': {
        name: '歼-6战斗机',
        audioUrl: '/audio/歼-6战斗机.mp3',
        videoUrl: 'https://www.bilibili.com/video/BV1LxKRz1Edo?vd_source=1bbfa23b2a2b8777865e7847a6b5bda3'
    },
    '79式狙击步枪': {
        name: '79式狙击步枪',
        audioUrl: '/audio/79式狙击步枪.mp3',
        videoUrl: 'https://www.bilibili.com/video/BV14e411o75D?vd_source=1bbfa23b2a2b8777865e7847a6b5bda3'
    },
    '03式自动步枪': {
        name: '03式自动步枪',
        audioUrl: '/audio/03式自动步枪.mp3',
        videoUrl: 'https://www.bilibili.com/video/BV1NS411A76m?vd_source=1bbfa23b2a2b8777865e7847a6b5bda3'
    },
    '歼-11战斗机': {
        name: '歼-11战斗机',
        audioUrl: '/audio/歼-11战斗机.mp3',
        videoUrl: 'https://www.bilibili.com/video/BV1ww4m1k7AS?vd_source=1bbfa23b2a2b8777865e7847a6b5bda3'
    },
    '东风-21D导弹': {
        name: '东风-21D导弹',
        audioUrl: '/audio/东风-21D导弹.mp3',
        videoUrl: 'https://www.bilibili.com/video/BV1pQbQz6EFS?vd_source=1bbfa23b2a2b8777865e7847a6b5bda3'
    },
    '运-20运输机': {
        name: '运-20运输机',
        audioUrl: '/audio/运-20运输机.mp3',
        videoUrl: 'https://www.bilibili.com/video/BV1GPGRzpEc2?vd_source=1bbfa23b2a2b8777865e7847a6b5bda3'
    },
    '直-20直升机': {
        name: '直-20直升机',
        audioUrl: '/audio/直-20直升机.mp3',
        videoUrl: 'https://www.bilibili.com/video/BV1KhTXztEh9?vd_source=1bbfa23b2a2b8777865e7847a6b5bda3'
    },
    '红旗-2防空导弹': {
        name: '红旗-2防空导弹',
        audioUrl: '/audio/红旗-2防空导弹.mp3',
        videoUrl: 'https://www.bilibili.com/video/BV1RxbaejEqR?vd_source=1bbfa23b2a2b8777865e7847a6b5bda3'
    },
    '63式水陆两栖坦克': {
        name: '63式水陆两栖坦克',
        audioUrl: '/audio/63式水陆两栖坦克.mp3',
        videoUrl: 'https://www.bilibili.com/video/BV1U4gDzAEBm?vd_source=1bbfa23b2a2b8777865e7847a6b5bda3'
    },
    '红箭-8反坦克导弹': {
        name: '红箭-8反坦克导弹',
        audioUrl: '/audio/红箭-8反坦克导弹.mp3',
        videoUrl: 'https://www.bilibili.com/video/BV1RZ421q7Vk?vd_source=1bbfa23b2a2b8777865e7847a6b5bda3'
    },
    '052D驱逐舰': {
        name: '052D驱逐舰',
        audioUrl: '/audio/052D驱逐舰.mp3',
        videoUrl: 'https://www.bilibili.com/video/BV1mNg8e7EoG?vd_source=1bbfa23b2a2b8777865e7847a6b5bda3'
    },
    '055驱逐舰': {
        name: '055驱逐舰',
        audioUrl: '/audio/055驱逐舰.mp3',
        videoUrl: 'https://www.bilibili.com/video/BV16TawzMESm?vd_source=1bbfa23b2a2b8777865e7847a6b5bda3'
    }
}

