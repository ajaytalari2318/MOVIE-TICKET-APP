// src/pages/Navbar.jsx - Updated with Guest Experience
import React, { useState, useEffect } from 'react';
import { Layout, Input, Button, Avatar, Dropdown, Space, Typography, Badge, message, Drawer } from 'antd';
import {
  SearchOutlined,
  UserOutlined,
  LogoutOutlined,
  EnvironmentOutlined,
  BellOutlined,
  SettingOutlined,
  MenuOutlined,
  LoginOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;
const { Title, Text } = Typography;

export default function Navbar() {
  const [searchValue, setSearchValue] = useState('');
  const [user, setUser] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    message.success('Logged out successfully!');
    setTimeout(() => {
      navigate('/home');
    }, 500);
  };

  const handleGuestAction = (action) => {
    message.info({
      content: 'Please sign in or register for a better experience',
      duration: 3,
    });
    setDrawerVisible(false);
  };

  const userMenuItems = user ? [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'My Profile',
      onClick: () => {
        if (user.role === "admin") {
          navigate('/profile');
        } else {
          navigate('/user-profile');
        }
        setDrawerVisible(false);
      }
    },
    {
      key: 'bookings',
      icon: <SettingOutlined />,
      label: 'My Bookings',
      onClick: () => {
        message.info('Bookings page coming soon!');
        setDrawerVisible(false);
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
  ] : [];

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'G';
  };

  return (
    <>
      <Header
        style={{
          position: 'fixed',
          zIndex: 1000,
          width: '100%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: isMobile ? '0 16px' : '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          height: '64px'
        }}
      >
        {/* Logo */}
        <Title
          level={3}
          style={{
            margin: 0,
            color: '#fff',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: isMobile ? '18px' : '24px'
          }}
          onClick={() => navigate('/home')}
        >
          BookMyShow
        </Title>

        {/* Desktop Search */}
        {/* {!isMobile && (
          <Input
            placeholder="Search movies..."
            prefix={<SearchOutlined style={{ color: '#999' }} />}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            style={{
              width: '400px',
              borderRadius: '8px',
            }}
            size="large"
          />
        )} */}

        {/* Desktop Menu */}
        {!isMobile ? (
          <Space size="large">
            <Button
              type="text"
              icon={<EnvironmentOutlined />}
              style={{ color: '#fff', fontWeight: '500' }}
            >
              Bengaluru
            </Button>

            {user && (
              <Badge  size="small">
                <Button
                  type="text"
                  icon={<BellOutlined style={{ fontSize: '20px' }} />}
                  style={{ color: '#fff' }}
                  onClick={() => message.info('No new notifications')}
                />
              </Badge>
            )}

            {user ? (
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
                    {getInitial(user.name)}
                  </Avatar>

                  <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                    <Text style={{ color: '#fff', fontWeight: '600', fontSize: '14px' }}>
                      Hi, {user.name}
                    </Text>
                    {user.email && (
                      <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>
                        {user.email}
                      </Text>
                    )}
                  </div>
                </div>
              </Dropdown>
            ) : (
              <Space>
                <Button
                  type="text"
                  icon={<LoginOutlined />}
                  onClick={() => navigate('/login')}
                  style={{
                    color: '#fff',
                    fontWeight: '600',
                    fontSize: '15px'
                  }}
                >
                  Sign In
                </Button>
                <Button
                  type="primary"
                  onClick={() => navigate('/register')}
                  style={{
                    background: '#fff',
                    color: '#667eea',
                    border: 'none',
                    fontWeight: '600',
                    height: '40px',
                    paddingLeft: '24px',
                    paddingRight: '24px'
                  }}
                >
                  Register
                </Button>
              </Space>
            )}
          </Space>
        ) : (
          <Button
            type="text"
            icon={<MenuOutlined style={{ fontSize: '24px', color: '#fff' }} />}
            onClick={() => setDrawerVisible(true)}
          />
        )}
      </Header>

      {/* Mobile Drawer */}
      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={280}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* User Info or Guest Welcome */}
          {user ? (
            <div style={{
              textAlign: 'center',
              padding: '20px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '12px',
              color: '#fff'
            }}>
              <Avatar
                size={64}
                style={{
                  backgroundColor: '#f56a00',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  marginBottom: '12px'
                }}
              >
                {getInitial(user.name)}
              </Avatar>
              <Title level={4} style={{ color: '#fff', margin: '8px 0' }}>
                {user.name}
              </Title>
              {user.email && (
                <Text style={{ color: 'rgba(255,255,255,0.9)' }}>
                  {user.email}
                </Text>
              )}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '20px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '12px',
              color: '#fff'
            }}>
              <Avatar
                size={64}
                icon={<UserOutlined />}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  fontSize: '24px',
                  marginBottom: '12px'
                }}
              />
              <Title level={4} style={{ color: '#fff', margin: '8px 0' }}>
                Welcome, Guest!
              </Title>
              <Text style={{ color: 'rgba(255,255,255,0.9)', display: 'block', marginBottom: '16px' }}>
                Sign in for a better experience
              </Text>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button
                  block
                  icon={<LoginOutlined />}
                  onClick={() => {
                    navigate('/login');
                    setDrawerVisible(false);
                  }}
                  style={{
                    background: '#fff',
                    color: '#667eea',
                    fontWeight: '600',
                    height: '40px'
                  }}
                >
                  Sign In
                </Button>
                <Button
                  block
                  onClick={() => {
                    navigate('/register');
                    setDrawerVisible(false);
                  }}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.4)',
                    fontWeight: '600',
                    height: '40px'
                  }}
                >
                  Register
                </Button>
              </Space>
            </div>
          )}

          {/* Mobile Search */}
          <Input
            placeholder="Search movies..."
            prefix={<SearchOutlined />}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            size="large"
            style={{ borderRadius: '8px' }}
          />

          {/* Menu Items */}
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Button
              block
              size="large"
              icon={<EnvironmentOutlined />}
              style={{ textAlign: 'left', height: '48px' }}
            >
              Bengaluru
            </Button>

            {user ? (
              <>
                <Button
                  block
                  size="large"
                  icon={<BellOutlined />}
                  style={{ textAlign: 'left', height: '48px' }}
                  onClick={() => {
                    message.info('No new notifications');
                    setDrawerVisible(false);
                  }}
                >
                  Notifications
                  <Badge count={3} style={{ marginLeft: 'auto' }} />
                </Button>

                <Button
                  block
                  size="large"
                  icon={<UserOutlined />}
                  style={{ textAlign: 'left', height: '48px' }}
                  onClick={() => {
                    if (user.role === 'admin') {
                      navigate('/profile');
                    } else {
                      navigate('/user-profile');
                    }
                    setDrawerVisible(false);
                  }}
                >
                  My Profile
                </Button>

                <Button
                  block
                  size="large"
                  icon={<SettingOutlined />}
                  style={{ textAlign: 'left', height: '48px' }}
                  onClick={() => {
                    message.info('Bookings page coming soon!');
                    setDrawerVisible(false);
                  }}
                >
                  My Bookings
                </Button>

                <Button
                  block
                  size="large"
                  danger
                  icon={<LogoutOutlined />}
                  style={{ textAlign: 'left', height: '48px' }}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  block
                  size="large"
                  icon={<BellOutlined />}
                  style={{ textAlign: 'left', height: '48px' }}
                  onClick={handleGuestAction}
                >
                  Notifications
                </Button>

                <Button
                  block
                  size="large"
                  icon={<UserOutlined />}
                  style={{ textAlign: 'left', height: '48px' }}
                  onClick={handleGuestAction}
                >
                  My Profile
                </Button>

                <Button
                  block
                  size="large"
                  icon={<SettingOutlined />}
                  style={{ textAlign: 'left', height: '48px' }}
                  onClick={handleGuestAction}
                >
                  My Bookings
                </Button>
              </>
            )}
          </Space>
        </Space>
      </Drawer>
    </>
  );
}