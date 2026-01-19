import { Link } from 'react-router-dom'
import './Home.css'

export default function Home() {
    return (
        <div className="home">
            {/* 英雄区 */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">铸剑乾坤</h1>
                    <p className="hero-subtitle">
                        沉浸式3D兵工文化体验平台 · 传承红色基因 · 弘扬兵工精神
                    </p>
                    <div className="hero-description">
                        <p>
                            以游戏化的方式让年轻一代了解中国兵工发展历程。
                            通过3D交互体验、装备操控模拟、AI装备生成等创新技术，
                            让兵工文化"活"起来，让红色精神代代相传。
                        </p>
                    </div>
                    <div className="hero-actions">
                        <Link to="/heritage" className="btn btn-primary">探索平台</Link>
                        <a href="#features" className="btn btn-outline">了解更多</a>
                    </div>
                </div>
            </section>

            {/* 核心模块区 */}
            <section className="modules-section">
                <div className="section-header">
                    <h2 className="section-title">核心模块</h2>
                    <p className="section-subtitle">三大核心玩法，沉浸式体验兵工文化</p>
                </div>

                <div className="modules-grid">
                    <Link to="/heritage" className="module-card">
                        <div className="module-icon">🔥</div>
                        <h3>星火传承</h3>
                        <p>3D元宇宙博物馆 · 沉浸式历史之旅</p>
                        <ul>
                            <li>穿越时空的虚拟博物馆</li>
                            <li>与历史装备零距离接触</li>
                            <li>感人至深的兵工故事</li>
                            <li>互动式历史剧情体验</li>
                        </ul>
                    </Link>

                    <Link to="/equipment" className="module-card">
                        <div className="module-icon">🎮</div>
                        <h3>装备操控</h3>
                        <p>硬核军事模拟 · 亲手驾驭经典</p>
                        <ul>
                            <li>驾驶历史名机翱翔蓝天</li>
                            <li>操控经典坦克驰骋沙场</li>
                            <li>体验各型火炮轰鸣</li>
                            <li>真实物理引擎加持</li>
                        </ul>
                    </Link>

                    <Link to="/ai-design" className="module-card">
                        <div className="module-icon">⚡</div>
                        <h3>神机演武</h3>
                        <p>AI创意工坊 · 设计你的装备</p>
                        <ul>
                            <li>用语言描述生成3D装备</li>
                            <li>自定义外观与性能参数</li>
                            <li>虚拟试验场实战测试</li>
                            <li>分享你的创意设计</li>
                        </ul>
                    </Link>
                </div>
            </section>

            {/* 核心特色 */}
            <section className="features-section" id="features">
                <div className="features-container">
                    <div className="section-header">
                        <h2 className="section-title">游戏特色</h2>
                        <p className="section-subtitle">用最潮的方式，讲最硬核的历史</p>
                    </div>

                    <div className="features-grid">
                        <div className="feature-item">
                            <h3>沉浸式3D体验</h3>
                            <p>
                                基于WebGL与Three.js打造的高品质3D画面，
                                无需下载即可在浏览器中体验流畅的3D游戏，
                                让历史装备触手可及。
                            </p>
                        </div>
                        <div className="feature-item">
                            <h3>真实装备操控</h3>
                            <p>
                                驾驶战斗机、操控坦克、发射火炮，
                                物理引擎驱动的真实体验，让你亲身感受
                                兵工前辈们创造的国之重器。
                            </p>
                        </div>
                        <div className="feature-item">
                            <h3>穿越历史长河</h3>
                            <p>
                                从抗战时期的兵工厂到现代化军工，
                                时间轴叙事带你穿越百年兵工历史，
                                感受一代代兵工人的奋斗精神。
                            </p>
                        </div>
                        <div className="feature-item">
                            <h3>AI智能生成</h3>
                            <p>
                                用自然语言描述你想象中的装备，
                                AI即刻生成3D模型，成为你自己的装备设计师，
                                激发创造力与想象力。
                            </p>
                        </div>
                        <div className="feature-item">
                            <h3>互动剧情故事</h3>
                            <p>
                                不只是冷冰冰的装备展示，
                                每一件装备背后都有感人的故事，
                                通过互动剧情了解兵工前辈的家国情怀。
                            </p>
                        </div>
                        <div className="feature-item">
                            <h3>社交分享系统</h3>
                            <p>
                                与好友一起探索博物馆，
                                分享你的游戏成就与创意设计，
                                让更多年轻人加入传承队伍。
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 新闻动态 */}
            <section className="news-section">
                <div className="section-header">
                    <h2 className="section-title">最新动态</h2>
                    <p className="section-subtitle">平台更新与活动资讯</p>
                </div>

                <div className="news-grid">
                    <div className="news-card">
                        <div className="news-image">🎉</div>
                        <div className="news-content">
                            <div className="news-date">2026-01-10</div>
                            <h3>平台正式上线</h3>
                            <p>
                                铸剑乾坤平台正式上线！首发500+历史装备3D模型，
                                多款经典装备可供操控体验，欢迎各位年轻玩家前来探索！
                            </p>
                        </div>
                    </div>

                    <div className="news-card">
                        <div className="news-image">🎮</div>
                        <div className="news-content">
                            <div className="news-date">2025-12-20</div>
                            <h3>装备操控模式上线</h3>
                            <p>
                                全新装备操控模式震撼登场！驾驶战斗机、操控坦克、
                                发射火炮，硬核军事模拟等你来战！
                            </p>
                        </div>
                    </div>

                    <div className="news-card">
                        <div className="news-image">🤖</div>
                        <div className="news-content">
                            <div className="news-date">2025-11-15</div>
                            <h3>AI生成功能升级</h3>
                            <p>
                                神机演武AI生成能力大幅提升，生成速度提升300%，
                                更多样化的装备风格供你选择！
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 用户评价 */}
            <section className="team-section">
                <div className="team-container">
                    <div className="section-header">
                        <h2 className="section-title">玩家评价</h2>
                        <p className="section-subtitle">来自年轻玩家的真实反馈</p>
                    </div>

                    <div className="team-intro">
                        <p>
                            "以前觉得兵工历史很枯燥，没想到这个平台这么好玩！
                            操控战斗机的时候真的很燃，还学到了很多历史知识。"
                        </p>
                    </div>

                    <div className="team-grid">
                        <div className="team-member">
                            <div className="team-avatar">👨‍🎓</div>
                            <h4>大学生玩家</h4>
                            <div className="team-role">军事爱好者</div>
                            <p className="team-desc">"装备操控太真实了！"</p>
                        </div>

                        <div className="team-member">
                            <div className="team-avatar">👩‍💻</div>
                            <h4>高中生玩家</h4>
                            <div className="team-role">历史爱好者</div>
                            <p className="team-desc">"学历史从未如此有趣"</p>
                        </div>

                        <div className="team-member">
                            <div className="team-avatar">👨‍🎨</div>
                            <h4>设计专业学生</h4>
                            <div className="team-role">创意设计达人</div>
                            <p className="team-desc">"AI生成功能太酷了"</p>
                        </div>

                        <div className="team-member">
                            <div className="team-avatar">👴</div>
                            <h4>退休兵工人</h4>
                            <div className="team-role">历史见证者</div>
                            <p className="team-desc">"年轻人终于了解我们了"</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 合作伙伴 */}
            <section className="partners-section">
                <div className="section-header">
                    <h2 className="section-title">合作单位</h2>
                    <p className="section-subtitle">共同传承红色基因</p>
                </div>

                <div className="partners-grid">
                    <div className="partner-logo">
                        <span>🏛️</span>
                    </div>
                    <div className="partner-logo">
                        <span>🎓</span>
                    </div>
                    <div className="partner-logo">
                        <span>🏭</span>
                    </div>
                    <div className="partner-logo">
                        <span>📚</span>
                    </div>
                    <div className="partner-logo">
                        <span>🎖️</span>
                    </div>
                </div>
            </section>
        </div>
    )
}
