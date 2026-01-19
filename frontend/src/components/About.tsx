
import React from 'react'
import { Card, Typography, Divider } from 'antd'

const { Title, Paragraph } = Typography

const About = () => {
    return (
        <div style={{ padding: '3rem', maxWidth: '1200px', margin: '0 auto' }}>
            <Card>
                <Title level={2} style={{ color: 'var(--primary-gold)' }}>关于我们</Title>
                <Divider />
                <Title level={3}>团队介绍</Title>
                <Paragraph>
                    铸剑乾坤团队由一群热爱兵工事业、深耕数字技术的青年工程师组成。我们致力于将最前沿的人工智能、数字孪生与云计算技术应用于国防科技工业领域。
                </Paragraph>
                <Paragraph>
                    我们的使命是通过数字化手段，保护和传承珍贵的兵工历史文化，同时为未来的装备研发提供智能化的协同工具。
                </Paragraph>

                <Title level={3}>愿景</Title>
                <Paragraph>
                    打造国内领先的沉浸式3D兵工文化体验平台，通过游戏化的方式吸引年轻一代，
                    传承红色基因，弘扬兵工精神，成为连接历史与未来的数字桥梁。
                </Paragraph>
            </Card>
        </div>
    )
}

export default About
