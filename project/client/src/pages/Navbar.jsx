import React, { useState } from 'react';
import { Layout, Input, Button, Avatar, Dropdown, Space, Typography, Card, Row, Col, Badge } from 'antd';
import { SearchOutlined, UserOutlined, LogoutOutlined, EnvironmentOutlined, BellOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
import MovieCard from '../pages/movieCard'
// Navbar Component
export default function Navbar() {
    const [searchValue, setSearchValue] = useState('');

    const userMenuItems = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'My Profile',
        },
        {
            key: 'bookings',
            label: 'My Bookings',
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Logout',
            danger: true,
        },
    ];

    const handleMenuClick = (e) => {
        if (e.key === 'logout') {
            console.log('Logging out...');
            // Add logout logic here
        } else if (e.key === 'profile') {
            console.log('Navigate to profile');
            // Add navigation logic here
        }
    };

    return (
        <div
            style={{
                position: 'fixed',
                zIndex: 1000,
                width: '100%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '0 15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                borderRadius:'10px'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '275px' }}>
                <Title level={3} style={{ margin: 0, color: '#fff', fontWeight: 'bold' }}>
                    BookMyShow
                </Title>

                <Input
                    placeholder="Search for Movies, Events, Plays, Sports and Activities"
                    prefix={<SearchOutlined style={{ color: '#999' }} />}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    style={{
                        width: '420px',
                        borderRadius: '4px',
                    }}
                    size="large"
                />
            </div>

            <Space size="large">
                <Button
                    type="text"
                    icon={<EnvironmentOutlined />}
                    style={{ color: '#fff' }}
                >
                    Bengaluru
                </Button>

                <Badge count={3} size="small">
                    <Button
                        type="text"
                        icon={<BellOutlined style={{ fontSize: '18px' }} />}
                        style={{ color: '#fff' }}
                    />
                </Badge>

                <Dropdown
                    menu={{
                        items: userMenuItems,
                        onClick: handleMenuClick
                    }}
                    trigger={['click']}
                    placement="bottomRight"
                >
                    <Space style={{ cursor: 'pointer' }}>
                        <Avatar
                            size="default"
                            icon={<UserOutlined />}
                            style={{ backgroundColor: '#f56a00' }}
                        />
                        <Text style={{ color: '#fff' }}>Hi, Guest</Text>
                    </Space>
                </Dropdown>
            </Space>
        </div>
    );
}
