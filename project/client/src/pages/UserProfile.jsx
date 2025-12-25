// src/pages/UserProfile.jsx - Modern User Profile Page
import React, { useState, useEffect } from 'react';
import { Layout, Card, Avatar, Typography, Row, Col, Button, Space, Tabs, List, Tag, Empty, Divider, Input, Form, message, Modal } from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  CalendarOutlined, 
  EditOutlined, 
  LockOutlined,
  HeartOutlined,
  StarOutlined,
  EnvironmentOutlined,
  CreditCardOutlined,
  BellOutlined,
  SafetyOutlined
} from '@ant-design/icons';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  // Mock booking data - replace with actual API call
  const [bookings, setBookings] = useState([]);


  // Mock favorites - replace with actual API call
  const [favorites] = useState([
    
  ]);

  useEffect(() => {
     const storedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    setBookings(storedBookings);
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/login');
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, [navigate]);

  const handleEditProfile = () => {
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      location: user.location || ''
    });
    setEditModalVisible(true);
  };

  const handleUpdateProfile = async (values) => {
    try {
      // TODO: Add API call to update profile
      const updatedUser = { ...user, ...values };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      message.success('Profile updated successfully!');
      setEditModalVisible(false);
    } catch (error) {
      message.error('Failed to update profile');
    }
  };

  const handleChangePassword = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('Passwords do not match!');
      return;
    }

    try {
      // TODO: Add API call to change password
      message.success('Password changed successfully!');
      setPasswordModalVisible(false);
      passwordForm.resetFields();
    } catch (error) {
      message.error('Failed to change password');
    }
  };

  if (!user) return null;

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  const ProfileHeader = () => (
    <Card
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '16px',
        marginBottom: '24px',
        border: 'none'
      }}
      bodyStyle={{ padding: isMobile ? '24px' : '40px' }}
    >
      <Row gutter={[24, 24]} align="middle">
        <Col xs={24} md={6} style={{ textAlign: isMobile ? 'center' : 'left' }}>
          <Avatar
            size={isMobile ? 100 : 120}
            style={{
              backgroundColor: '#f56a00',
              fontSize: isMobile ? '40px' : '48px',
              fontWeight: 'bold',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
            }}
          >
            {getInitial(user.name)}
          </Avatar>
        </Col>
        
        <Col xs={24} md={14}>
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Title level={isMobile ? 3 : 2} style={{ color: '#fff', margin: 0 }}>
              {user.name}
            </Title>
            <Space direction={isMobile ? 'vertical' : 'horizontal'} size="middle" wrap>
              <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px' }}>
                <MailOutlined /> {user.email}
              </Text>
              {user.phone && (
                <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px' }}>
                  <PhoneOutlined /> {user.phone}
                </Text>
              )}
              {user.location && (
                <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px' }}>
                  <EnvironmentOutlined /> {user.location}
                </Text>
              )}
            </Space>
            <Space wrap style={{ marginTop: '12px' }}>
              <Tag color="gold" style={{ fontSize: '14px', padding: '4px 12px' }}>
                <StarOutlined /> Member since 2024
              </Tag>
              <Tag color="blue" style={{ fontSize: '14px', padding: '4px 12px' }}>
                {bookings.length} Bookings
              </Tag>
            </Space>
          </Space>
        </Col>
        
        <Col xs={24} md={4} style={{ textAlign: isMobile ? 'center' : 'right' }}>
          <Button
            type="primary"
            size="large"
            icon={<EditOutlined />}
            onClick={handleEditProfile}
            style={{
              background: '#fff',
              color: '#667eea',
              border: 'none',
              fontWeight: '600',
              height: '48px',
              minWidth: '140px'
            }}
          >
            Edit Profile
          </Button>
        </Col>
      </Row>
    </Card>
  );

  const BookingsTab = () => (
    <div>
      {bookings.length === 0 ? (
        <Empty
          description="No bookings yet"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ padding: '60px 0' }}
        >
          <Button 
            type="primary" 
            size="large"
            onClick={() => navigate('/home')}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none'
            }}
          >
            Book Now
          </Button>
        </Empty>
      ) : (
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 1,
            md: 2,
            lg: 2,
            xl: 2,
          }}
          dataSource={bookings}
          renderItem={(booking) => (
            <List.Item>
              <Card
                hoverable
                style={{ borderRadius: '12px' }}
                bodyStyle={{ padding: '20px' }}
              >
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div>
                    <Title level={4} style={{ margin: '0 0 8px 0' }}>
                      {booking.movieTitle}
                    </Title>
                    <Text type="secondary">
                      <EnvironmentOutlined /> {booking.theatre}
                    </Text>
                  </div>
                  
                  <Divider style={{ margin: '8px 0' }} />
                  
                  <Row gutter={[16, 8]}>
                    <Col span={12}>
                      <Text type="secondary" style={{ display: 'block', marginBottom: '4px' }}>
                        <CalendarOutlined /> Date
                      </Text>
                      <Text strong>{booking.date}</Text>
                    </Col>
                    <Col span={12}>
                      <Text type="secondary" style={{ display: 'block', marginBottom: '4px' }}>
                        Time
                      </Text>
                      <Text strong>{booking.time}</Text>
                    </Col>
                    <Col span={12}>
                      <Text type="secondary" style={{ display: 'block', marginBottom: '4px' }}>
                        Seats
                      </Text>
                      <Text strong>{booking.seats.join(', ')}</Text>
                    </Col>
                    <Col span={12}>
                      <Text type="secondary" style={{ display: 'block', marginBottom: '4px' }}>
                        Amount
                      </Text>
                      <Text strong style={{ color: '#52c41a' }}>₹{booking.amount}</Text>
                    </Col>
                  </Row>
                  
                  <Tag color="green" style={{ marginTop: '8px' }}>
                    {booking.status.toUpperCase()}
                  </Tag>
                  
                  <Space style={{ marginTop: '8px' }}>
                    <Button size="small">View Details</Button>
                    <Button size="small">Download Ticket</Button>
                  </Space>
                </Space>
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  );

  const FavoritesTab = () => (
    <div>
      {favorites.length === 0 ? (
        <Empty
          description="No favorites yet"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ padding: '60px 0' }}
        />
      ) : (
        <List
          grid={{
            gutter: 16,
            xs: 2,
            sm: 3,
            md: 4,
            lg: 5,
            xl: 6,
          }}
          dataSource={favorites}
          renderItem={(movie) => (
            <List.Item>
              <Card
                hoverable
                style={{ borderRadius: '12px' }}
                bodyStyle={{ padding: '12px' }}
              >
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <Title level={5} style={{ margin: 0 }} ellipsis>
                    {movie.title}
                  </Title>
                  <Text type="secondary">{movie.genre}</Text>
                  <Text strong>⭐ {movie.rating}</Text>
                  <Button 
                    type="primary" 
                    size="small" 
                    block
                    style={{
                      background: '#f84464',
                      borderColor: '#f84464'
                    }}
                  >
                    Book Now
                  </Button>
                </Space>
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  );

  const SettingsTab = () => (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={12}>
        <Card
          hoverable
          style={{ borderRadius: '12px', height: '100%' }}
          bodyStyle={{ padding: '24px' }}
          onClick={() => setPasswordModalVisible(true)}
        >
          <Space direction="vertical" size="middle">
            <LockOutlined style={{ fontSize: '32px', color: '#667eea' }} />
            <div>
              <Title level={4} style={{ margin: 0 }}>Change Password</Title>
              <Text type="secondary">Update your account password</Text>
            </div>
          </Space>
        </Card>
      </Col>
      
      <Col xs={24} md={12}>
        <Card
          hoverable
          style={{ borderRadius: '12px', height: '100%' }}
          bodyStyle={{ padding: '24px' }}
          onClick={() => message.info('Payment methods coming soon!')}
        >
          <Space direction="vertical" size="middle">
            <CreditCardOutlined style={{ fontSize: '32px', color: '#667eea' }} />
            <div>
              <Title level={4} style={{ margin: 0 }}>Payment Methods</Title>
              <Text type="secondary">Manage your payment options</Text>
            </div>
          </Space>
        </Card>
      </Col>
      
      <Col xs={24} md={12}>
        <Card
          hoverable
          style={{ borderRadius: '12px', height: '100%' }}
          bodyStyle={{ padding: '24px' }}
          onClick={() => message.info('Notification settings coming soon!')}
        >
          <Space direction="vertical" size="middle">
            <BellOutlined style={{ fontSize: '32px', color: '#667eea' }} />
            <div>
              <Title level={4} style={{ margin: 0 }}>Notifications</Title>
              <Text type="secondary">Manage notification preferences</Text>
            </div>
          </Space>
        </Card>
      </Col>
      
      <Col xs={24} md={12}>
        <Card
          hoverable
          style={{ borderRadius: '12px', height: '100%' }}
          bodyStyle={{ padding: '24px' }}
          onClick={() => message.info('Privacy settings coming soon!')}
        >
          <Space direction="vertical" size="middle">
            <SafetyOutlined style={{ fontSize: '32px', color: '#667eea' }} />
            <div>
              <Title level={4} style={{ margin: 0 }}>Privacy & Security</Title>
              <Text type="secondary">Control your privacy settings</Text>
            </div>
          </Space>
        </Card>
      </Col>
    </Row>
  );

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Navbar />
      <Content style={{
        marginTop: 64,
        padding: isMobile ? '16px' : '24px',
        maxWidth: '1400px',
        margin: '64px auto 0',
        width: '100%'
      }}>
        <ProfileHeader />

        <Card style={{ borderRadius: '16px' }}>
          <Tabs defaultActiveKey="bookings" size={isMobile ? 'small' : 'large'}>
            <Tabs.TabPane 
              tab={
                <span>
                  
                  {!isMobile && ' My Bookings'}
                </span>
              } 
              key="bookings"
            >
              <BookingsTab />
            </Tabs.TabPane>
            
            <Tabs.TabPane 
              tab={
                <span>
                  <HeartOutlined />
                  {!isMobile && ' Favorites'}
                </span>
              } 
              key="favorites"
            >
              <FavoritesTab />
            </Tabs.TabPane>
            
            <Tabs.TabPane 
              tab={
                <span>
                  <LockOutlined />
                  {!isMobile && ' Settings'}
                </span>
              } 
              key="settings"
            >
              <SettingsTab />
            </Tabs.TabPane>
          </Tabs>
        </Card>

        {/* Edit Profile Modal */}
        <Modal
          title="Edit Profile"
          open={editModalVisible}
          onCancel={() => setEditModalVisible(false)}
          footer={null}
          width={isMobile ? '95%' : 600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleUpdateProfile}
            style={{ marginTop: '24px' }}
          >
            <Form.Item
              name="name"
              label="Full Name"
              rules={[{ required: true, message: 'Please enter your name' }]}
            >
              <Input size="large" prefix={<UserOutlined />} />
            </Form.Item>
            
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
            >
              <Input size="large" prefix={<MailOutlined />} />
            </Form.Item>
            
            <Form.Item
              name="phone"
              label="Phone Number"
            >
              <Input size="large" prefix={<PhoneOutlined />} />
            </Form.Item>
            
            <Form.Item
              name="location"
              label="Location"
            >
              <Input size="large" prefix={<EnvironmentOutlined />} />
            </Form.Item>
            
            <Form.Item>
              <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                <Button onClick={() => setEditModalVisible(false)}>
                  Cancel
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none'
                  }}
                >
                  Save Changes
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* Change Password Modal */}
        <Modal
          title="Change Password"
          open={passwordModalVisible}
          onCancel={() => setPasswordModalVisible(false)}
          footer={null}
          width={isMobile ? '95%' : 500}
        >
          <Form
            form={passwordForm}
            layout="vertical"
            onFinish={handleChangePassword}
            style={{ marginTop: '24px' }}
          >
            <Form.Item
              name="currentPassword"
              label="Current Password"
              rules={[{ required: true, message: 'Please enter your current password' }]}
            >
              <Input.Password size="large" prefix={<LockOutlined />} />
            </Form.Item>
            
            <Form.Item
              name="newPassword"
              label="New Password"
              rules={[
                { required: true, message: 'Please enter a new password' },
                { min: 6, message: 'Password must be at least 6 characters' }
              ]}
            >
              <Input.Password size="large" prefix={<LockOutlined />} />
            </Form.Item>
            
            <Form.Item
              name="confirmPassword"
              label="Confirm New Password"
              rules={[{ required: true, message: 'Please confirm your new password' }]}
            >
              <Input.Password size="large" prefix={<LockOutlined />} />
            </Form.Item>
            
            <Form.Item>
              <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                <Button onClick={() => setPasswordModalVisible(false)}>
                  Cancel
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none'
                  }}
                >
                  Change Password
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
}

export default UserProfile;