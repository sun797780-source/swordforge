import React, { useEffect, useMemo, useState } from 'react'
import { message, Modal, Form, Input, Select, Table, Tag, Space, Button } from 'antd'
import { EyeOutlined, EyeInvisibleOutlined, UserOutlined, LockOutlined, PlusOutlined, KeyOutlined, StopOutlined, CheckOutlined } from '@ant-design/icons'
import { authApi, adminApi, AuthUser } from '../../services/authApi'
import './Admin.css'

const { Option } = Select

const Admin: React.FC = () => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('admin_token'))
    const [user, setUser] = useState<AuthUser | null>(null)
    const [loading, setLoading] = useState(false)
    const [loginLoading, setLoginLoading] = useState(false)
    const [users, setUsers] = useState<any[]>([])
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [keyword, setKeyword] = useState('')
    const [createVisible, setCreateVisible] = useState(false)
    const [resetVisible, setResetVisible] = useState(false)
    const [resetUserId, setResetUserId] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [loginError, setLoginError] = useState('')
    const [form] = Form.useForm()
    const [resetForm] = Form.useForm()
    const [profileForm] = Form.useForm()
    const [passwordForm] = Form.useForm()
    const [profileLoading, setProfileLoading] = useState(false)
    const [passwordLoading, setPasswordLoading] = useState(false)
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [oldPasswordVisible, setOldPasswordVisible] = useState(false)
    const [loginForm, setLoginForm] = useState({ username: '', password: '' })
    const [isRegisterMode, setIsRegisterMode] = useState(false)
    const [registerLoading, setRegisterLoading] = useState(false)
    const [registerError, setRegisterError] = useState('')
    const [registerForm] = Form.useForm()
    const [showRegisterPassword, setShowRegisterPassword] = useState(false)
    const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false)

    const canManage = useMemo(() => user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN', [user])

    const loadUsers = async (currentPage = page) => {
        if (!token) return
        setLoading(true)
        try {
            const data = await adminApi.listUsers(token, currentPage, 20, keyword)
            setUsers(data.data || [])
            setTotal(data.total || 0)
        } catch (e) {
            message.error('加载用户失败')
        } finally {
            setLoading(false)
        }
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!loginForm.username || !loginForm.password) {
            setLoginError('请输入用户名和密码')
            return
        }
        setLoginLoading(true)
        setLoginError('')
        try {
            const res = await authApi.login(loginForm.username, loginForm.password)
            localStorage.setItem('admin_token', res.token)
            setToken(res.token)
            setUser(res.user)
            message.success('登录成功')
        } catch (e: any) {
            setLoginError(e.message || '登录失败，请检查用户名和密码')
        } finally {
            setLoginLoading(false)
        }
    }

    const handleLogout = async () => {
        if (!token) return
        try {
            await authApi.logout(token)
        } catch {
            // ignore
        }
        localStorage.removeItem('admin_token')
        setToken(null)
        setUser(null)
        setUsers([])
    }

    const handleCreateUser = async (values: any) => {
        if (!token) return
        try {
            await adminApi.createUser(token, values)
            message.success('用户已创建')
            setCreateVisible(false)
            form.resetFields()
            loadUsers(1)
        } catch (e) {
            message.error('创建用户失败')
        }
    }

    const handleResetPassword = async (values: any) => {
        if (!token || !resetUserId) return
        try {
            await adminApi.resetPassword(token, resetUserId, values.newPassword)
            message.success('密码已重置')
            setResetVisible(false)
            resetForm.resetFields()
        } catch (e) {
            message.error('重置密码失败')
        }
    }

    const handleToggleStatus = async (record: any) => {
        if (!token) return
        try {
            await adminApi.updateUserStatus(token, record.id, !record.isActive)
            message.success('状态已更新')
            loadUsers(page)
        } catch (e) {
            message.error('更新失败')
        }
    }

    useEffect(() => {
        if (!token) return
        authApi.me(token)
            .then(setUser)
            .catch(() => {
                localStorage.removeItem('admin_token')
                setToken(null)
                setUser(null)
            })
    }, [token])

    useEffect(() => {
        if (token && canManage) {
            loadUsers(1)
        }
    }, [token, canManage])

    // 初始化个人信息表单数据
    useEffect(() => {
        if (user && !canManage) {
            profileForm.setFieldsValue({
                name: user.name,
                department: user.department || '',
                position: user.position || ''
            })
        }
    }, [user, canManage, profileForm])

    const handleUpdateProfile = async (values: any) => {
        if (!token) return
        setProfileLoading(true)
        try {
            const updated = await authApi.updateProfile(token, values)
            setUser(updated)
            message.success('个人信息已更新')
        } catch (e: any) {
            message.error(e.message || '更新失败')
        } finally {
            setProfileLoading(false)
        }
    }

    const handleChangePassword = async (values: any) => {
        if (!token) return
        setPasswordLoading(true)
        try {
            await authApi.changePassword(token, values.oldPassword, values.newPassword)
            message.success('密码已修改')
            passwordForm.resetFields()
        } catch (e: any) {
            message.error(e.message || '修改密码失败')
        } finally {
            setPasswordLoading(false)
        }
    }

    const handleRegister = async (values: any) => {
        setRegisterLoading(true)
        setRegisterError('')
        try {
            await authApi.register(
                values.username,
                values.password,
                values.name,
                values.department,
                values.position
            )
            message.success('注册成功，请登录')
            setIsRegisterMode(false)
            registerForm.resetFields()
        } catch (e: any) {
            setRegisterError(e.message || '注册失败')
        } finally {
            setRegisterLoading(false)
        }
    }

    // 登录页面 - 高端设计
    if (!token) {
        return (
            <div className="admin-login-page">
                <div className="admin-login-container">
                    {/* 品牌区域 */}
                    <div className="admin-brand">
                        <div className="admin-brand-logo">铸剑乾坤</div>
                        <div className="admin-brand-subtitle">沉浸式3D兵工文化体验平台</div>
                    </div>

                    {/* 登录/注册卡片 */}
                    <div className="admin-login-card">
                        <div className="admin-card-title">
                            <h2>{isRegisterMode ? '用户注册' : '管理中心'}</h2>
                            <p>{isRegisterMode ? '创建您的账户' : '权限审计与用户管理控制台'}</p>
                        </div>

                        {(loginError || registerError) && (
                            <div className="admin-error-msg">
                                <span>⚠</span> {loginError || registerError}
                            </div>
                        )}

                        {!isRegisterMode ? (
                            <form className="admin-login-form" onSubmit={handleLogin}>
                                <div className="admin-form-item">
                                    <label className="admin-form-label">
                                        <span className="required">*</span>用户名
                                    </label>
                                    <div className="admin-input-wrapper">
                                        <input
                                            type="text"
                                            className="admin-input"
                                            placeholder="请输入用户名"
                                            value={loginForm.username}
                                            onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                                            autoComplete="username"
                                        />
                                    </div>
                                </div>

                                <div className="admin-form-item">
                                    <label className="admin-form-label">
                                        <span className="required">*</span>密码
                                    </label>
                                    <div className="admin-input-wrapper">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            className="admin-input"
                                            placeholder="请输入密码"
                                            value={loginForm.password}
                                            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                                            autoComplete="current-password"
                                        />
                                        <button
                                            type="button"
                                            className="admin-password-toggle"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="admin-submit-btn"
                                    disabled={loginLoading}
                                >
                                    {loginLoading ? '登录中...' : '安 全 登 录'}
                                </button>

                                <div className="admin-switch-mode">
                                    <span>还没有账号？</span>
                                    <button
                                        type="button"
                                        className="admin-link-btn"
                                        onClick={() => {
                                            setIsRegisterMode(true)
                                            setLoginError('')
                                            setRegisterError('')
                                        }}
                                    >
                                        立即注册
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <Form
                                form={registerForm}
                                className="admin-login-form"
                                layout="vertical"
                                onFinish={handleRegister}
                            >
                                <Form.Item
                                    name="username"
                                    label="用户名"
                                    rules={[
                                        { required: true, message: '请输入用户名' },
                                        { min: 3, message: '用户名至少3个字符' }
                                    ]}
                                >
                                    <Input placeholder="请输入用户名（至少3个字符）" />
                                </Form.Item>

                                <Form.Item
                                    name="password"
                                    label="密码"
                                    rules={[
                                        { required: true, message: '请输入密码' },
                                        { min: 6, message: '密码长度至少6位' }
                                    ]}
                                >
                                    <Input.Password
                                        placeholder="请输入密码（至少6位）"
                                        visibilityToggle={{ visible: showRegisterPassword, onVisibleChange: setShowRegisterPassword }}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="confirmPassword"
                                    label="确认密码"
                                    dependencies={['password']}
                                    rules={[
                                        { required: true, message: '请确认密码' },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('password') === value) {
                                                    return Promise.resolve()
                                                }
                                                return Promise.reject(new Error('两次输入的密码不一致'))
                                            }
                                        })
                                    ]}
                                >
                                    <Input.Password
                                        placeholder="请再次输入密码"
                                        visibilityToggle={{ visible: showRegisterConfirmPassword, onVisibleChange: setShowRegisterConfirmPassword }}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="name"
                                    label="姓名"
                                    rules={[{ required: true, message: '请输入姓名' }]}
                                >
                                    <Input placeholder="请输入您的姓名" />
                                </Form.Item>

                                <Form.Item name="department" label="部门">
                                    <Input placeholder="请输入部门（可选）" />
                                </Form.Item>

                                <Form.Item name="position" label="职位">
                                    <Input placeholder="请输入职位（可选）" />
                                </Form.Item>

                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="admin-submit-btn"
                                    loading={registerLoading}
                                    block
                                >
                                    {registerLoading ? '注册中...' : '注 册'}
                                </Button>

                                <div className="admin-switch-mode">
                                    <span>已有账号？</span>
                                    <button
                                        type="button"
                                        className="admin-link-btn"
                                        onClick={() => {
                                            setIsRegisterMode(false)
                                            setLoginError('')
                                            setRegisterError('')
                                            registerForm.resetFields()
                                        }}
                                    >
                                        立即登录
                                    </button>
                                </div>
                            </Form>
                        )}
                    </div>

                    <div className="admin-login-footer">
                        © 2026 铸剑乾坤 · 沉浸式3D兵工文化体验平台
                    </div>
                </div>
            </div>
        )
    }

    // 普通用户个人信息管理界面
    if (!canManage) {

        return (
            <div className="admin-layout">
                <div className="admin-content">
                    {/* 头部 */}
                    <div className="admin-header">
                        <div className="admin-header-left">
                            <h1>个人信息管理</h1>
                            <p className="admin-subtitle">管理您的个人信息和账户设置</p>
                        </div>
                        <div className="admin-user-info">
                            <div className="admin-user-detail">
                                <div className="admin-user-name">{user?.name}</div>
                                <div className="admin-user-role">
                                    {user?.role === 'ENGINEER' ? '工程师' : user?.role === 'VIEWER' ? '访客' : '普通用户'}
                                </div>
                            </div>
                            <div className="admin-user-avatar">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                            <button className="admin-btn admin-btn-danger" onClick={handleLogout}>
                                退出
                            </button>
                        </div>
                    </div>

                    {/* 个人信息表单 */}
                    <div className="admin-profile-section">
                        <div className="admin-section-title">
                            <UserOutlined /> 基本信息
                        </div>
                        <Form
                            form={profileForm}
                            layout="vertical"
                            onFinish={handleUpdateProfile}
                            className="admin-profile-form"
                        >
                            <Form.Item label="用户名">
                                <Input value={user?.username} disabled />
                            </Form.Item>
                            <Form.Item 
                                name="name" 
                                label="姓名" 
                                rules={[{ required: true, message: '请输入姓名' }]}
                            >
                                <Input placeholder="请输入姓名" />
                            </Form.Item>
                            <Form.Item name="department" label="部门">
                                <Input placeholder="请输入部门" />
                            </Form.Item>
                            <Form.Item name="position" label="职位">
                                <Input placeholder="请输入职位" />
                            </Form.Item>
                            <Form.Item>
                                <Button 
                                    type="primary" 
                                    htmlType="submit" 
                                    loading={profileLoading}
                                    className="admin-btn admin-btn-primary"
                                >
                                    保存修改
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>

                    {/* 修改密码表单 */}
                    <div className="admin-profile-section">
                        <div className="admin-section-title">
                            <LockOutlined /> 修改密码
                        </div>
                        <Form
                            form={passwordForm}
                            layout="vertical"
                            onFinish={handleChangePassword}
                            className="admin-profile-form"
                        >
                            <Form.Item 
                                name="oldPassword" 
                                label="当前密码" 
                                rules={[{ required: true, message: '请输入当前密码' }]}
                            >
                                <Input.Password 
                                    placeholder="请输入当前密码"
                                    visibilityToggle={{ visible: oldPasswordVisible, onVisibleChange: setOldPasswordVisible }}
                                />
                            </Form.Item>
                            <Form.Item 
                                name="newPassword" 
                                label="新密码" 
                                rules={[
                                    { required: true, message: '请输入新密码' },
                                    { min: 6, message: '密码长度至少6位' }
                                ]}
                            >
                                <Input.Password 
                                    placeholder="请输入新密码（至少6位）"
                                    visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
                                />
                            </Form.Item>
                            <Form.Item 
                                name="confirmPassword" 
                                label="确认新密码"
                                dependencies={['newPassword']}
                                rules={[
                                    { required: true, message: '请确认新密码' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('newPassword') === value) {
                                                return Promise.resolve()
                                            }
                                            return Promise.reject(new Error('两次输入的密码不一致'))
                                        }
                                    })
                                ]}
                            >
                                <Input.Password placeholder="请再次输入新密码" />
                            </Form.Item>
                            <Form.Item>
                                <Button 
                                    type="primary" 
                                    htmlType="submit" 
                                    loading={passwordLoading}
                                    className="admin-btn admin-btn-primary"
                                >
                                    修改密码
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
        )
    }

    // 角色显示
    const getRoleDisplay = (role: string) => {
        switch (role) {
            case 'SUPER_ADMIN':
                return <span className="admin-role-super">超级管理员</span>
            case 'ADMIN':
                return <span className="admin-role-admin">管理员</span>
            default:
                return <span className="admin-role-user">{role === 'ENGINEER' ? '工程师' : role === 'VIEWER' ? '访客' : '用户'}</span>
        }
    }

    const columns = [
        { title: '用户名', dataIndex: 'username', key: 'username' },
        { title: '姓名', dataIndex: 'name', key: 'name' },
        { 
            title: '角色', 
            dataIndex: 'role', 
            key: 'role',
            render: (role: string) => getRoleDisplay(role)
        },
        { title: '部门', dataIndex: 'department', key: 'department', render: (v: string) => v || '-' },
        { 
            title: '状态', 
            dataIndex: 'isActive', 
            key: 'isActive',
            render: (active: boolean) => (
                active 
                    ? <span className="admin-status-active">正常</span>
                    : <span className="admin-status-inactive">禁用</span>
            )
        },
        { 
            title: '最后登录', 
            dataIndex: 'lastLoginAt', 
            key: 'lastLoginAt',
            render: (v: string) => v ? new Date(v).toLocaleString('zh-CN') : '-'
        },
        {
            title: '操作',
            key: 'actions',
            render: (_: any, record: any) => (
                <Space size="small">
                    <button
                        className="admin-action-btn"
                        onClick={() => { setResetUserId(record.id); setResetVisible(true) }}
                    >
                        <KeyOutlined /> 重置密码
                    </button>
                    <button
                        className={`admin-action-btn ${record.isActive ? 'admin-action-btn-danger' : ''}`}
                        onClick={() => handleToggleStatus(record)}
                    >
                        {record.isActive ? <><StopOutlined /> 禁用</> : <><CheckOutlined /> 启用</>}
                    </button>
                </Space>
            )
        }
    ]

    return (
        <div className="admin-layout">
            <div className="admin-content">
                {/* 头部 */}
                <div className="admin-header">
                    <div className="admin-header-left">
                        <h1>用户管理中心</h1>
                        <p className="admin-subtitle">管理系统用户、权限分配与安全审计</p>
                    </div>
                    <div className="admin-user-info">
                        <div className="admin-user-detail">
                            <div className="admin-user-name">{user?.name}</div>
                            <div className="admin-user-role">{user?.role === 'SUPER_ADMIN' ? '超级管理员' : '管理员'}</div>
                        </div>
                        <div className="admin-user-avatar">
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                        <button className="admin-btn admin-btn-danger" onClick={handleLogout}>
                            退出
                        </button>
                    </div>
                </div>

                {/* 工具栏 */}
                <div className="admin-toolbar">
                    <input
                        type="text"
                        className="admin-search-input"
                        placeholder="搜索用户名或姓名..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && loadUsers(1)}
                    />
                    <button className="admin-btn admin-btn-primary" onClick={() => loadUsers(1)}>
                        搜索
                    </button>
                    <button className="admin-btn admin-btn-primary" onClick={() => setCreateVisible(true)}>
                        <PlusOutlined /> 创建用户
                    </button>
                </div>

                {/* 数据表格 */}
                <div className="admin-table-wrapper">
                    <Table
                        columns={columns}
                        dataSource={users}
                        rowKey="id"
                        loading={loading}
                        pagination={{
                            current: page,
                            total,
                            pageSize: 20,
                            onChange: (p) => { setPage(p); loadUsers(p) }
                        }}
                    />
                </div>

                {/* 创建用户弹窗 */}
                <Modal
                    title="创建新用户"
                    open={createVisible}
                    onCancel={() => setCreateVisible(false)}
                    footer={null}
                    className="admin-modal"
                >
                    <Form form={form} layout="vertical" onFinish={handleCreateUser}>
                        <Form.Item name="username" label="用户名" rules={[{ required: true, message: '请输入用户名' }]}>
                            <Input placeholder="请输入用户名" />
                        </Form.Item>
                        <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' }]}>
                            <Input.Password placeholder="请输入密码" />
                        </Form.Item>
                        <Form.Item name="name" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}>
                            <Input placeholder="请输入姓名" />
                        </Form.Item>
                        <Form.Item name="role" label="角色" initialValue="USER">
                            <Select>
                                <Option value="USER">普通用户</Option>
                                <Option value="ENGINEER">工程师</Option>
                                <Option value="VIEWER">访客</Option>
                                <Option value="ADMIN">管理员</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="department" label="部门">
                            <Input placeholder="请输入部门" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" block>
                                创建
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>

                {/* 重置密码弹窗 */}
                <Modal
                    title="重置密码"
                    open={resetVisible}
                    onCancel={() => { setResetVisible(false); setResetUserId(null) }}
                    footer={null}
                    className="admin-modal"
                >
                    <Form form={resetForm} layout="vertical" onFinish={handleResetPassword}>
                        <Form.Item name="newPassword" label="新密码" rules={[{ required: true, message: '请输入新密码' }]}>
                            <Input.Password placeholder="请输入新密码" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" block>
                                确认重置
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </div>
    )
}

export default Admin
