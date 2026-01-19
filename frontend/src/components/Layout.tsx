import { ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { LockOutlined } from '@ant-design/icons'
import './Layout.css'

interface LayoutProps {
    children: ReactNode
}

export function Layout({ children }: LayoutProps) {
    const location = useLocation()
    const navigate = useNavigate()
    const { isAuthenticated } = useAuth()

    const handleProtectedLink = (e: React.MouseEvent, path: string) => {
        if (!isAuthenticated) {
            e.preventDefault()
            navigate('/admin')
        }
    }

    return (
        <div className="layout">
            <nav className="navbar">
                <div className="navbar-brand">
                    <h1>铸剑乾坤</h1>
                    <span className="subtitle">沉浸式3D兵工文化体验平台</span>
                </div>
                <div className="navbar-menu">
                    <Link
                        to="/"
                        className={location.pathname === '/' ? 'active' : ''}
                    >
                        首页
                    </Link>
                    <Link
                        to="/heritage"
                        className={location.pathname === '/heritage' ? 'active' : ''}
                    >
                        星火传承
                    </Link>
                    {isAuthenticated ? (
                        <Link
                            to="/equipment"
                            className={location.pathname === '/equipment' ? 'active' : ''}
                        >
                            装备操控
                        </Link>
                    ) : (
                        <span
                            className="navbar-link-disabled"
                            onClick={(e) => handleProtectedLink(e, '/equipment')}
                            title="请先登录"
                        >
                            装备操控 <LockOutlined style={{ fontSize: '10px', marginLeft: '4px' }} />
                        </span>
                    )}
                    {isAuthenticated ? (
                        <Link
                            to="/ai-design"
                            className={location.pathname === '/ai-design' ? 'active' : ''}
                        >
                            神机演武
                        </Link>
                    ) : (
                        <span
                            className="navbar-link-disabled"
                            onClick={(e) => handleProtectedLink(e, '/ai-design')}
                            title="请先登录"
                        >
                            神机演武 <LockOutlined style={{ fontSize: '10px', marginLeft: '4px' }} />
                        </span>
                    )}
                    <Link
                        to="/admin"
                        className={location.pathname === '/admin' ? 'active' : ''}
                    >
                        管理
                    </Link>
                </div>
            </nav>

            <main className="main-content">
                {children}
            </main>

            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-brand">
                        <h3>铸剑乾坤</h3>
                        <p>
                            沉浸式3D兵工文化体验平台，通过游戏化的方式让年轻一代了解中国兵工发展历程。
                            传承红色基因，弘扬兵工精神，让兵工文化"活"起来。
                        </p>
                    </div>

                    <div className="footer-section">
                        <h4>核心模块</h4>
                        <ul>
                            <li><Link to="/heritage">星火传承</Link></li>
                            <li><Link to="/equipment">装备操控</Link></li>
                            <li><Link to="/ai-design">神机演武</Link></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>关于我们</h4>
                        <ul>
                            <li><Link to="/about">团队介绍</Link></li>
                            <li><Link to="/about">新闻动态</Link></li>
                            <li><Link to="/about">合作伙伴</Link></li>
                            <li><Link to="/about">联系我们</Link></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>技术支持</h4>
                        <ul>
                            <li><Link to="/support">技术文档</Link></li>
                            <li><Link to="/support">API接口</Link></li>
                            <li><Link to="/support">常见问题</Link></li>
                            <li><Link to="/support">在线支持</Link></li>
                            <li><Link to="/admin">系统管理</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; 2026 铸剑乾坤平台 · 沉浸式3D兵工文化体验平台 · 保留所有权利</p>
                </div>
            </footer>
        </div>
    )
}
