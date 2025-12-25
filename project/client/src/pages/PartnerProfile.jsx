// src/pages/PartnerProfile.jsx - Updated with Theatre Details Modal
import React, { useState, useEffect } from 'react';
import { 
  Layout, Card, Avatar, Typography, Row, Col, Space, Tabs, 
  Statistic, Progress, Empty, Button, Form, Input, message, 
  Modal, Divider, Tag, List, Badge, Table, Descriptions
} from 'antd';
import {
  UserOutlined, MailOutlined, PhoneOutlined, EditOutlined,
  LockOutlined, ShopOutlined, DashboardOutlined, RiseOutlined,
  CheckCircleOutlined, ClockCircleOutlined, PlusOutlined,
  TrophyOutlined, CalendarOutlined, EnvironmentOutlined,
  StarOutlined, FireOutlined, ThunderboltOutlined, EyeOutlined
} from '@ant-design/icons';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { getAllTheatres } from '../calls/theatreCalls';
import dayjs from 'dayjs';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

function PartnerProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [viewTheatreModal, setViewTheatreModal] = useState(false);
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  

  // Mock analytics data
  const [analytics] = useState({
    totalBookings: 1247,
    monthlyRevenue: 245680,
    averageRating: 9.0,
    growthRate: 23.5,
    topMovies: [
      { title: 'Varanasi', bookings: 342, revenue: 68400 },
      { title: 'RRR', bookings: 298, revenue: 59600 },
      { title: 'Avatar', bookings: 267, revenue: 53400 },
    ],
    recentBookings: [
      { id: 'BK1234', movie: 'Avatar', date: '2024-12-20', amount: 1200, seats: 4 },
      { id: 'BK1235', movie: 'RRR', date: '2024-12-19', amount: 900, seats: 3 },
      { id: 'BK1236', movie: 'Varanasi', date: '2024-12-19', amount: 1500, seats: 5 },
    ],
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchTheatres(parsedUser.email);
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

  const fetchTheatres = async (userEmail) => {
    try {
      setLoading(true);
      const response = await getAllTheatres();
      const userTheatres = (response.theatres || []).filter(
        theatre => theatre.contact?.email === userEmail
      );
      setTheatres(userTheatres);
    } catch (error) {
      message.error('Failed to fetch theatres');
    } finally {
      setLoading(false);
    }
  };

  const handleViewTheatre = (theatre) => {
    setSelectedTheatre(theatre);
    setViewTheatreModal(true);
  };

  const handleEditProfile = () => {
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
    });
    setEditModalVisible(true);
  };

  const handleUpdateProfile = async (values) => {
    try {
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
      message.success('Password changed successfully!');
      setPasswordModalVisible(false);
      passwordForm.resetFields();
    } catch (error) {
      message.error('Failed to change password');
    }
  };

  if (!user) return null;

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'P';
  };

  const approvedCount = theatres.filter(t => t.status === 'approved').length;
  const pendingCount = theatres.filter(t => t.status === 'pending').length;
  const totalScreens = theatres.reduce((sum, t) => sum + (t.totalScreens || 0), 0);
  const totalCapacity = theatres.reduce((sum, t) => sum + (t.seatingCapacity || 0), 0);

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
          <Badge count={pendingCount} offset={[-10, 10]}>
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
          </Badge>
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
            </Space>
            <Space wrap style={{ marginTop: '12px' }}>
              <Tag color="gold" style={{ fontSize: '14px', padding: '4px 12px' }}>
                <TrophyOutlined /> Theatre Partner
              </Tag>
              <Tag color="blue" style={{ fontSize: '14px', padding: '4px 12px' }}>
                {approvedCount} Active Theatres
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

  const DashboardTab = () => (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ background: '#e3f2fd', borderRadius: '12px' }}>
            <Statistic
              title="Total Bookings"
              value={analytics.totalBookings}
              prefix={<CalendarOutlined style={{ color: '#2196f3' }} />}
              valueStyle={{ color: '#2196f3' }}
            />
            <Progress percent={75} strokeColor="#2196f3" showInfo={false} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ background: '#e8f5e9', borderRadius: '12px' }}>
            <Statistic
              title="Monthly Revenue"
              value={analytics.monthlyRevenue}
              prefix="₹"
              valueStyle={{ color: '#4caf50' }}
            />
            <Space>
              <RiseOutlined style={{ color: '#4caf50' }} />
              <Text style={{ color: '#4caf50' }}>+{analytics.growthRate}%</Text>
            </Space>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ background: '#fff3e0', borderRadius: '12px' }}>
            <Statistic
              title="Average Rating"
              value={analytics.averageRating}
              prefix={<StarOutlined style={{ color: '#7ab184ff' }} />}
              suffix="/ 10"
              valueStyle={{ color: '#5dac77ff' }}
            />
            <Progress 
              percent={(analytics.averageRating / 10) * 100} 
              strokeColor="#5fa473ff" 
              showInfo={false} 
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ background: '#f3e5f5', borderRadius: '12px' }}>
            <Statistic
              title="Total Screens"
              value={totalScreens}
              prefix={<DashboardOutlined style={{ color: '#9c27b0' }} />}
              valueStyle={{ color: '#9c27b0' }}
            />
            <Text type="secondary">{totalCapacity} total seats</Text>
          </Card>
        </Col>
      </Row>

      <Card 
        title={
          <Space>
            <FireOutlined style={{ color: '#f44336' }} />
            Top Performing Movies
          </Space>
        }
        style={{ borderRadius: '12px' }}
      >
        <List
          dataSource={analytics.topMovies}
          renderItem={(movie, index) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar 
                    style={{ 
                      backgroundColor: index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : '#cd7f32',
                      fontWeight: 'bold'
                    }}
                  >
                    {index + 1}
                  </Avatar>
                }
                title={<Text strong>{movie.title}</Text>}
                description={`${movie.bookings} bookings`}
              />
              <div>
                <Text strong style={{ color: '#52c41a', fontSize: '16px' }}>
                  ₹{movie.revenue.toLocaleString()}
                </Text>
              </div>
            </List.Item>
          )}
        />
      </Card>

      <Card 
        title={
          <Space>
            <ThunderboltOutlined style={{ color: '#1890ff' }} />
            Recent Bookings
          </Space>
        }
        style={{ borderRadius: '12px' }}
      >
        <Table
          dataSource={analytics.recentBookings}
          pagination={false}
          columns={[
            {
              title: 'Booking ID',
              dataIndex: 'id',
              key: 'id',
              render: (text) => <Tag color="blue">{text}</Tag>
            },
            {
              title: 'Movie',
              dataIndex: 'movie',
              key: 'movie',
            },
            {
              title: 'Date',
              dataIndex: 'date',
              key: 'date',
              render: (date) => dayjs(date).format('DD MMM YYYY')
            },
            {
              title: 'Seats',
              dataIndex: 'seats',
              key: 'seats',
            },
            {
              title: 'Amount',
              dataIndex: 'amount',
              key: 'amount',
              render: (amount) => <Text strong style={{ color: '#52c41a' }}>₹{amount}</Text>
            },
          ]}
        />
      </Card>
    </Space>
  );

  const TheatresTab = () => (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* Theatre Stats */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card style={{ background: '#e8f5e9', borderRadius: '12px', border: 'none' }}>
            <Space direction="vertical" size="small">
              <Text type="secondary">Active Theatres</Text>
              <Title level={2} style={{ margin: 0, color: '#4caf50' }}>
                {approvedCount}
              </Title>
              <CheckCircleOutlined style={{ fontSize: '24px', color: '#4caf50' }} />
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ background: '#fff3e0', borderRadius: '12px', border: 'none' }}>
            <Space direction="vertical" size="small">
              <Text type="secondary">Pending Approval</Text>
              <Title level={2} style={{ margin: 0, color: '#ff9800' }}>
                {pendingCount}
              </Title>
              <ClockCircleOutlined style={{ fontSize: '24px', color: '#ff9800' }} />
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ background: '#e3f2fd', borderRadius: '12px', border: 'none' }}>
            <Space direction="vertical" size="small">
              <Text type="secondary">Total Screens</Text>
              <Title level={2} style={{ margin: 0, color: '#2196f3' }}>
                {totalScreens}
              </Title>
              <DashboardOutlined style={{ fontSize: '24px', color: '#2196f3' }} />
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Add Theatre Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => message.info('Add Theatre form coming soon!')}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            fontWeight: '600'
          }}
        >
          Add Theatre
        </Button>
      </div>

      {/* Theatres List */}
      {theatres.length === 0 ? (
        <Empty
          description="No theatres added yet"
          style={{ padding: '60px 0' }}
        >
          <Button
            type="primary"
            size="large"
            icon={<ShopOutlined />}
            onClick={() => message.info('Add Theatre form coming soon!')}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none'
            }}
          >
            Add Your First Theatre
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
          }}
          dataSource={theatres}
          renderItem={(theatre) => (
            <List.Item>
              <Card
                hoverable
                style={{ borderRadius: '12px', height: '100%' }}
                bodyStyle={{ padding: '20px' }}
              >
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <Title level={4} style={{ margin: 0 }}>
                      {theatre.name}
                    </Title>
                    <Tag 
                      color={
                        theatre.status === 'approved' ? 'green' : 
                        theatre.status === 'rejected' ? 'red' : 'orange'
                      }
                    >
                      {theatre.status.toUpperCase()}
                    </Tag>
                  </div>

                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <Text type="secondary">
                      <EnvironmentOutlined /> {theatre.location?.city}, {theatre.location?.state}
                    </Text>
                    <Space>
                      <Tag color="blue">{theatre.totalScreens} Screens</Tag>
                      <Tag color="green">{theatre.seatingCapacity || 'N/A'} Seats</Tag>
                    </Space>
                  </Space>

                  <Divider style={{ margin: '8px 0' }} />

                  <Row gutter={[8, 8]}>
                    <Col span={12}>
                      <Text type="secondary" style={{ fontSize: '12px' }}>Contact</Text>
                      <Paragraph ellipsis style={{ margin: 0, fontSize: '13px' }}>
                        {theatre.contact?.phone}
                      </Paragraph>
                    </Col>
                    <Col span={12}>
                      <Text type="secondary" style={{ fontSize: '12px' }}>Email</Text>
                      <Paragraph ellipsis style={{ margin: 0, fontSize: '13px' }}>
                        {theatre.contact?.email}
                      </Paragraph>
                    </Col>
                  </Row>

                  <Button
                    block
                    icon={<EyeOutlined />}
                    onClick={() => handleViewTheatre(theatre)}
                    style={{ marginTop: '8px' }}
                  >
                    View Details
                  </Button>
                </Space>
              </Card>
            </List.Item>
          )}
        />
      )}
    </Space>
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
          onClick={() => message.info('Add Theatre form coming soon!')}
        >
          <Space direction="vertical" size="middle">
            <ShopOutlined style={{ fontSize: '32px', color: '#667eea' }} />
            <div>
              <Title level={4} style={{ margin: 0 }}>Manage Theatres</Title>
              <Text type="secondary">Add or edit your theatres</Text>
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
          <Tabs defaultActiveKey="dashboard" size={isMobile ? 'small' : 'large'}>
            <Tabs.TabPane 
              tab={
                <span>
                  <DashboardOutlined />
                  {!isMobile && ' Dashboard'}
                </span>
              } 
              key="dashboard"
            >
              <DashboardTab />
            </Tabs.TabPane>
            
            <Tabs.TabPane 
              tab={
                <span>
                  <ShopOutlined />
                  {!isMobile && ' My Theatres'}
                </span>
              } 
              key="theatres"
            >
              <TheatresTab />
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

        {/* View Theatre Details Modal */}
        <Modal
          title="Theatre Details"
          open={viewTheatreModal}
          onCancel={() => {
            setViewTheatreModal(false);
            setSelectedTheatre(null);
          }}
          footer={null}
          width={isMobile ? '95%' : 700}
        >
          {selectedTheatre && (
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Card style={{ background: '#f5f5f5' }}>
                <Title level={4}>{selectedTheatre.name}</Title>
                <Tag
                  color={
                    selectedTheatre.status === 'approved' ? 'green' :
                    selectedTheatre.status === 'rejected' ? 'red' : 'orange'
                  }
                >
                  {selectedTheatre.status.toUpperCase()}
                </Tag>
              </Card>

              <Descriptions bordered column={1}>
                <Descriptions.Item label="Address">
                  {selectedTheatre.location?.address || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="City">
                  {selectedTheatre.location?.city || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="State">
                  {selectedTheatre.location?.state || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Pincode">
                  {selectedTheatre.location?.pincode || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Total Screens">
                  {selectedTheatre.totalScreens || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Contact Phone">
                  {selectedTheatre.contact?.phone || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Contact Email">
                  {selectedTheatre.contact?.email || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Owner">
                  {selectedTheatre.contact?.owner || 'N/A'}
                </Descriptions.Item>
              </Descriptions>

              <div>
                <Text strong>Facilities:</Text>
                <Space wrap style={{ marginTop: '8px' }}>
                  {selectedTheatre.facilities?.parking && <Tag color="blue">Parking</Tag>}
                  {selectedTheatre.facilities?.foodCourt && <Tag color="blue">Food Court</Tag>}
                  {selectedTheatre.facilities?.wheelchairAccess && <Tag color="blue">Wheelchair Access</Tag>}
                </Space>
              </div>

              {selectedTheatre.rejectionReason && (
                <Card style={{ background: '#fff1f0', border: '1px solid #ffccc7' }}>
                  <Text strong style={{ color: '#cf1322' }}>Rejection Reason:</Text>
                  <Paragraph>{selectedTheatre.rejectionReason}</Paragraph>
                </Card>
              )}
            </Space>
          )}
        </Modal>

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
            
            <Form.Item name="phone" label="Phone Number">
              <Input size="large" prefix={<PhoneOutlined />} />
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
              <Input.Password size="large" prefix={<LockOutlined />}/>
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

export default PartnerProfile;