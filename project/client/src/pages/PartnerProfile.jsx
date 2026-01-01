import React, { useState, useEffect } from 'react';
import {
  Layout, Card, Avatar, Typography, Row, Col, Space, Tabs,
  Statistic, Progress, Empty, Button, Form, Input, message,
  Modal, Divider, Tag, List, Badge, Table, Descriptions, InputNumber, Switch
} from 'antd';
import {
  UserOutlined, MailOutlined, PhoneOutlined, EditOutlined,
  LockOutlined, ShopOutlined, DashboardOutlined, RiseOutlined,
  CheckCircleOutlined, ClockCircleOutlined, PlusOutlined,
  TrophyOutlined, CalendarOutlined, EnvironmentOutlined,
  StarOutlined, FireOutlined, ThunderboltOutlined, EyeOutlined
} from '@ant-design/icons';
import AddTheatreModal from '../components/AddTheatreModal';
import { getAllTheatres, getTheatresByOwner } from '../calls/theatreCalls';



const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

function PartnerProfile() {
  const [user, setUser] = useState(null);
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [viewTheatreModal, setViewTheatreModal] = useState(false);
  const [addTheatreModal, setAddTheatreModal] = useState(false);
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [theatreForm] = Form.useForm();

  const analytics = {
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
  };

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchTheatres(parsedUser.email);
    }

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchTheatres = async (userEmail) => {
    try {
      setLoading(true);
      const data = await getAllTheatres();


      const userTheatres = (data.theatres || []).filter(
        theatre => theatre.contact?.email === userEmail
      );
      setTheatres(userTheatres);
    } catch (error) {
      message.error('Failed to fetch theatres');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTheatre = async (values) => {
    try {
      const theatreData = {
        name: values.name,
        location: {
          address: values.address,
          city: values.city,
          state: values.state,
          country: values.country || 'India',
          pincode: values.pincode
        },
        totalScreens: values.totalScreens,
        facilities: {
          parking: values.parking || false,
          foodCourt: values.foodCourt || false,
          wheelchairAccess: values.wheelchairAccess || false
        },
        contact: {
          owner: values.owner,
          phone: values.phone,
          email: user.email
        },
        status: 'pending'
      };

      const response = await fetch('https://bookmyshow-zklm.onrender.com/api/theatre/addTheatre', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(theatreData)
      });

      const data = await response.json();

      if (data.success) {
        message.success('Theatre request submitted successfully!');
        theatreForm.resetFields();
        setAddTheatreModal(false);
        fetchTheatres(user.email);
      } else {
        message.error(data.message || 'Failed to submit theatre request');
      }
    } catch (error) {
      message.error('Failed to submit theatre request');
    }
  };

  const handleViewTheatre = (theatre) => {
    setSelectedTheatre(theatre);
    setViewTheatreModal(true);
  };

  if (!user) return null;

  const getInitial = (name) => name ? name.charAt(0).toUpperCase() : 'P';

  const approvedCount = theatres.filter(t => t.status === 'approved').length;
  const pendingCount = theatres.filter(t => t.status === 'pending').length;
  const totalScreens = theatres.reduce((sum, t) => sum + (t.totalScreens || 0), 0);

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
            onClick={() => setEditModalVisible(true)}
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

  const TheatresTab = () => (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
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

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => setAddTheatreModal(true)}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            fontWeight: '600'
          }}
        >
          Add Theatre
        </Button>
      </div>

      {theatres.length === 0 ? (
        <Empty
          description="No theatres added yet"
          style={{ padding: '60px 0' }}
        >
          <Button
            type="primary"
            size="large"
            icon={<ShopOutlined />}
            onClick={() => setAddTheatreModal(true)}
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
          grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2 }}
          dataSource={theatres}
          renderItem={(theatre) => (
            <List.Item>
              <Card hoverable style={{ borderRadius: '12px', height: '100%' }} bodyStyle={{ padding: '20px' }}>
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <Title level={4} style={{ margin: 0 }}>{theatre.name}</Title>
                    <Tag color={theatre.status === 'approved' ? 'green' : theatre.status === 'rejected' ? 'red' : 'orange'}>
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

  return (
    <>
      <Content style={{ marginTop: 64, padding: isMobile ? '16px' : '24px', maxWidth: '1400px', margin: '64px auto 0', width: '100%' }}>
        <ProfileHeader />

        <Card style={{ borderRadius: '16px' }}>
          <Tabs defaultActiveKey="theatres" size={isMobile ? 'small' : 'large'}>
            <Tabs.TabPane tab={<span><ShopOutlined />{!isMobile && ' My Theatres'}</span>} key="theatres">
              <TheatresTab />
            </Tabs.TabPane>
          </Tabs>
        </Card>

        {/* Add Theatre Modal */}
        <AddTheatreModal
          visible={addTheatreModal}
          onCancel={() => setAddTheatreModal(false)}
          onSuccess={() => fetchTheatres(user.email)}
          userEmail={user.email}
        />

        {/* View Theatre Modal */}
        <Modal
          title="Theatre Details"
          open={viewTheatreModal}
          onCancel={() => { setViewTheatreModal(false); setSelectedTheatre(null); }}
          footer={null}
          width={isMobile ? '95%' : 700}
        >
          {selectedTheatre && (
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Card style={{ background: '#f5f5f5' }}>
                <Title level={4}>{selectedTheatre.name}</Title>
                <Tag color={selectedTheatre.status === 'approved' ? 'green' : selectedTheatre.status === 'rejected' ? 'red' : 'orange'}>
                  {selectedTheatre.status.toUpperCase()}
                </Tag>
              </Card>

              <Descriptions bordered column={1}>
                <Descriptions.Item label="Address">{selectedTheatre.location?.address || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="City">{selectedTheatre.location?.city || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="State">{selectedTheatre.location?.state || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Pincode">{selectedTheatre.location?.pincode || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Total Screens">{selectedTheatre.totalScreens || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Contact Phone">{selectedTheatre.contact?.phone || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Owner">{selectedTheatre.contact?.owner || 'N/A'}</Descriptions.Item>
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

      </Content>
    </>
  );
}

export default PartnerProfile;