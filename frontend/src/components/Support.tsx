import React, { useState } from 'react'
import { Card, Collapse, Form, Input, Button, message } from 'antd'
import { QuestionCircleOutlined, MailOutlined } from '@ant-design/icons'
import { API_BASE } from '../config/api'

const { Panel } = Collapse

const Support = () => {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (values: any) => {
        setLoading(true)
        try {
            const res = await fetch(`${API_BASE}/support/feedback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    description: values.description,
                    email: values.email
                })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || '提交失败')
            }

            message.success(data.message || '问题反馈已提交，我们会尽快处理')
            form.resetFields()
        } catch (error: any) {
            if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                message.error('无法连接到服务器，请稍后重试')
            } else {
                message.error(error.message || '提交失败，请稍后重试')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ padding: '3rem', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ color: 'var(--primary-gold)', marginBottom: '2rem' }}>技术支持中心</h2>

            <Card title="常见问题 (FAQ)" style={{ marginBottom: '2rem' }}>
                <Collapse ghost>
                    <Panel header="如何申请装备操控模块的试用账号？" key="1">
                        <p>请联系您的单位管理员或发送邮件至 support@zhujian.com 提交申请，我们将在1-3个工作日内审核。</p>
                    </Panel>
                    <Panel header="神机演武模块的仿真数据准确度如何？" key="2">
                        <p>我们的仿真引擎V4.2基于历史实测数据校准，准确度达到90%以上，为玩家提供真实的装备操控体验。</p>
                    </Panel>
                    <Panel header="系统支持哪些浏览器？" key="3">
                        <p>推荐使用 Chrome 90+ 或 Edge 90+ 以获得最佳的 WebGL 3D 渲染体验。</p>
                    </Panel>
                </Collapse>
            </Card>

            <Card title="联系支持团队">
                <Form 
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item 
                        name="description" 
                        label="问题描述"
                        rules={[
                            { required: true, message: '请输入问题描述' },
                            { min: 10, message: '问题描述至少10个字符' }
                        ]}
                    >
                        <Input.TextArea 
                            rows={4} 
                            placeholder="请详细描述您遇到的技术问题..." 
                        />
                    </Form.Item>
                    <Form.Item 
                        name="email" 
                        label="联系邮箱"
                        rules={[
                            { required: true, message: '请输入联系邮箱' },
                            { type: 'email', message: '邮箱格式不正确' }
                        ]}
                    >
                        <Input 
                            prefix={<MailOutlined />} 
                            placeholder="your@email.com" 
                        />
                    </Form.Item>
                    <Button 
                        type="primary" 
                        htmlType="submit"
                        block
                        loading={loading}
                    >
                        {loading ? '提交中...' : '提交工单'}
                    </Button>
                </Form>
            </Card>
        </div>
    )
}

export default Support
