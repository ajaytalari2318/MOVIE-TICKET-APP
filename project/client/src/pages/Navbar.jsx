// src/pages/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Layout, Input, Button, Avatar, Dropdown, Space, Typography, Badge, message } from 'antd';
import { SearchOutlined, UserOutlined, LogoutOutlined, EnvironmentOutlined, BellOutlined, SettingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;
const { Title, Text } = Typography;

export default function Navbar() {
    const [searchValue, setSearchValue] = useState('');
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Get user data from localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleLogout = () => {
        // Clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        message.success('Logged out successfully!');

        // Redirect to login
        setTimeout(() => {
            navigate('/login');
        }, 500);
    };

    const userMenuItems = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'My Profile',
            onClick: () => {
                message.info('Profile page coming soon!');
            }
        },
        {
            key: 'bookings',
            icon: <SettingOutlined />,
            label: 'My Bookings',
            onClick: () => {
                message.info('Bookings page coming soon!');
            }
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Logout',
            danger: true,
            onClick: handleLogout
        },
    ];
    const getInitial = (name) => {
        return name ? name.charAt(0).toUpperCase() : 'U';
    };

    return (
        <Header
            style={{
                position: 'fixed',
                zIndex: 1000,
                width: '99.5%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '0 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                borderRadius: '15px'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '282px' }}>
                <Title level={3} style={{ margin: 0, color: '#fff', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => navigate('/home')}>
                    BookMyShow
                </Title>

                <Input
                    placeholder="Search for Movies, Events, Plays, Sports and Activities"
                    prefix={<SearchOutlined style={{ color: '#999' }} />}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    style={{
                        width: '500px',
                        borderRadius: '8px',
                    }}
                    size="large"
                />
            </div>

            <Space size="large">
                <Button
                    type="text"
                    icon={<EnvironmentOutlined />}
                    style={{ color: '#fff', fontWeight: '500' }}
                >
                    Bengaluru
                </Button>

                <Badge count={3} size="small">
                    <Button
                        type="text"
                        icon={<BellOutlined style={{ fontSize: '20px' }} />}
                        style={{ color: '#fff' }}
                        onClick={() => message.info('No new notifications')}
                    />
                </Badge>

                <Dropdown
                    menu={{ items: userMenuItems }}
                    trigger={['click']}
                    placement="bottomRight"
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            cursor: 'pointer',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            transition: 'background 0.3s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                        <Avatar
                            size="large"
                            style={{
                                backgroundColor: '#f56a00',
                                fontSize: '18px',
                                fontWeight: 'bold'
                            }}
                        >
                            {user ? getInitial(user.name) : 'U'}
                        </Avatar>

                        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                            <Text style={{ color: '#fff', fontWeight: '600', fontSize: '14px' }}>
                                Hi, {user ? user.name : 'Guest'}
                            </Text>
                            {user && user.email && (
                                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>
                                    {user.email}
                                </Text>
                            )}
                        </div>
                    </div>
                </Dropdown>

            </Space>
        </Header>
    );
}