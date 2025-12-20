// src/pages/Partner.jsx - Enhanced Theatre Owner Dashboard
import React, { useState, useEffect } from 'react';
import { 
  Layout, Card, Button, Modal, Form, Input, InputNumber, Switch, 
  Table, Tag, Space, Row, Col, Typography, Spin, Empty, message, 
  Steps, Checkbox, Timeline, Statistic, Progress, Alert, Descriptions,
  Tooltip, Badge
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined,
  CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined,
  EnvironmentOutlined, PhoneOutlined, MailOutlined, HomeOutlined,
  ShopOutlined, TeamOutlined, DashboardOutlined, WarningOutlined,
  InfoCircleOutlined, RiseOutlined
} from '@ant-design/icons';
import Navbar from './Navbar';
import { 
  addTheatre, 
  getTheatresByOwner, 
  updateTheatre, 
  deleteTheatre 
} from '../calls/theatreCalls';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;
const { TextArea } = Input;

function Partner() {
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editingTheatre, setEditingTheatre] = useState(null);
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [form] = Form.useForm();

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (user) {
      fetchTheatres();
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchTheatres = async () => {
    try {
      setLoading(true);
      const response = await getTheatresByOwner(user._id);
      setTheatres(response.theatres || []);
    } catch (error) {
      message.error('Failed to fetch theatres');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTheatre = () => {
    setEditingTheatre(null);
    setCurrentStep(0);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditTheatre = (theatre) => {
    setEditingTheatre(theatre);
    setCurrentStep(0);
    form.setFieldsValue({
      name: theatre.name,
      address: theatre.location?.address,
      city: theatre.location?.city,
      state: theatre.location?.state,
      pincode: theatre.location?.pincode,
      phone: theatre.contact?.phone,
      email: theatre.contact?.email,
      totalScreens: theatre.totalScreens,
      seatingCapacity: theatre.seatingCapacity,
      parking: theatre.facilities?.parking,
      foodCourt: theatre.facilities?.foodCourt,
      wheelchairAccess: theatre.facilities?.wheelchairAccess,
      threeDScreen: theatre.facilities?.threeDScreen,
      reclinerSeats: theatre.facilities?.reclinerSeats,
    });
    setModalVisible(true);
  };

  const handleViewTheatre = (theatre) => {
    setSelectedTheatre(theatre);
    setViewModalVisible(true);
  };

  const handleDeleteTheatre = (theatreId) => {
    Modal.confirm({
      title: 'Delete Theatre',
      content: 'Are you sure you want to delete this theatre? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteTheatre(theatreId);
          message.success('Theatre deleted successfully!');
          fetchTheatres();
        } catch (error) {
          message.error('Failed to delete theatre');
        }
      }
    });
  };

  const onFinish = async (values) => {
    try {
      const theatreData = {
        name: values.name,
        location: {
          address: values.address,
          city: values.city,
          state: values.state,
          pincode: values.pincode,
        },
        contact: {
          phone: values.phone,
          email: values.email,
        },
        totalScreens: values.totalScreens,
        seatingCapacity: values.seatingCapacity,
        facilities: {
          parking: values.parking || false,
          foodCourt: values.foodCourt || false,
          wheelchairAccess: values.wheelchairAccess || false,
          threeDScreen: values.threeDScreen || false,
          reclinerSeats: values.reclinerSeats || false,
        },
        owner: user._id,
      };

      if (editingTheatre) {
        await updateTheatre(editingTheatre._id, theatreData);
        message.success('Theatre updated successfully! Pending admin approval.');
      } else {
        await addTheatre(theatreData);
        message.success('Theatre added successfully! Pending admin approval.');
      }

      setModalVisible(false);
      form.resetFields();
      fetchTheatres();
    } catch (error) {
      message.error('Operation failed. Please try again.');
    }
  };

  const nextStep = async () => {
    try {
      if (currentStep === 0) {
        await form.validateFields(['name', 'totalScreens', 'seatingCapacity']);
      } else if (currentStep === 1) {
        await form.validateFields(['address', 'city', 'state', 'pincode']);
      } else if (currentStep === 2) {
        await form.validateFields(['phone', 'email']);
      }
      setCurrentStep(currentStep + 1);
    } catch (error) {
      message.error('Please fill all required fields');
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Statistics
  const pendingCount = theatres.filter(t => t.status === 'pending').length;
  const approvedCount = theatres.filter(t => t.status === 'approved').length;
  const rejectedCount = theatres.filter(t => t.status === 'rejected').length;
  const totalScreens = theatres.reduce((sum, t) => sum + (t.totalScreens || 0), 0);
  const totalCapacity = theatres.reduce((sum, t) => sum + (t.seatingCapacity || 0), 0);

  const getStatusColor = (status) => {
    const colorMap = {
      pending: 'orange',
      approved: 'green',
      rejected: 'red'
    };
    return colorMap[status] || 'default';
  };

  const getStatusIcon = (status) => {
    const iconMap = {
      pending: <ClockCircleOutlined />,
      approved: <CheckCircleOutlined />,
      rejected: <CloseCircleOutlined />
    };
    return iconMap[status] || <InfoCircleOutlined />;
  };

  const columns = [
    {
      title: 'Theatre Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space direction="vertical" size="small">
          <Text strong style={{ fontSize: '15px' }}>{text}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            <EnvironmentOutlined /> {record.location?.city}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Screens',
      dataIndex: 'totalScreens',
      key: 'totalScreens',
      responsive: ['md'],
      render: (screens) => (
        <Tag color="blue" style={{ fontSize: '13px' }}>
          {screens} Screens
        </Tag>
      ),
    },
    {
      title: 'Capacity',
      dataIndex: 'seatingCapacity',
      key: 'seatingCapacity',
      responsive: ['lg'],
      render: (capacity) => (
        <Text strong>{capacity} seats</Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Space direction="vertical" size="small">
          <Tag 
            icon={getStatusIcon(status)} 
            color={getStatusColor(status)}
            style={{ fontSize: '13px', padding: '4px 12px' }}
          >
            {status.toUpperCase()}
          </Tag>
          {record.approvedAt && (
            <Text type="secondary" style={{ fontSize: '11px' }}>
              {dayjs(record.approvedAt).fromNow()}
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="small" wrap>
          <Tooltip title="View Details">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => handleViewTheatre(record)}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Edit Theatre">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEditTheatre(record)}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Delete Theatre">
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteTheatre(record._id)}
              size="small"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const steps = [
    {
      title: 'Basic Info',
      icon: <HomeOutlined />,
    },
    {
      title: 'Location',
      icon: <EnvironmentOutlined />,
    },
    {
      title: 'Contact',
      icon: <PhoneOutlined />,
    },
    {
      title: 'Facilities',
      icon: <ShopOutlined />,
    },
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <Form.Item
              name="name"
              label="Theatre Name"
              rules={[{ required: true, message: 'Please enter theatre name' }]}
            >
              <Input size="large" placeholder="e.g., PVR Cinemas" prefix={<ShopOutlined />} />
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="totalScreens"
                  label="Total Screens"
                  rules={[{ required: true, message: 'Required' }]}
                >
                  <InputNumber 
                    size="large" 
                    min={1} 
                    style={{ width: '100%' }} 
                    placeholder="e.g., 5"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="seatingCapacity"
                  label="Total Seating Capacity"
                  rules={[{ required: true, message: 'Required' }]}
                >
                  <InputNumber 
                    size="large" 
                    min={1} 
                    style={{ width: '100%' }} 
                    placeholder="e.g., 1200"
                  />
                </Form.Item>
              </Col>
            </Row>
          </>
        );
      case 1:
        return (
          <>
            <Form.Item
              name="address"
              label="Street Address"
              rules={[{ required: true, message: 'Please enter address' }]}
            >
              <TextArea rows={2} placeholder="Building name, street, area" />
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="city"
                  label="City"
                  rules={[{ required: true, message: 'Required' }]}
                >
                  <Input size="large" placeholder="e.g., Bangalore" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="state"
                  label="State"
                  rules={[{ required: true, message: 'Required' }]}
                >
                  <Input size="large" placeholder="e.g., Karnataka" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="pincode"
              label="Pincode"
              rules={[{ required: true, message: 'Required' }]}
            >
              <Input size="large" placeholder="e.g., 560001" />
            </Form.Item>
          </>
        );
      case 2:
        return (
          <>
            <Form.Item
              name="phone"
              label="Contact Phone"
              rules={[{ required: true, message: 'Please enter phone number' }]}
            >
              <Input size="large" placeholder="e.g., +91 9876543210" prefix={<PhoneOutlined />} />
            </Form.Item>
            <Form.Item
              name="email"
              label="Contact Email"
              rules={[
                { required: true, message: 'Please enter email' },
                { type: 'email', message: 'Please enter valid email' }
              ]}
            >
              <Input size="large" placeholder="e.g., info@theatre.com" prefix={<MailOutlined />} />
            </Form.Item>
          </>
        );
      case 3:
        return (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Alert
              message="Select Available Facilities"
              description="Choose the facilities available at your theatre to attract more customers"
              type="info"
              showIcon
            />
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item name="parking" valuePropName="checked">
                  <Card hoverable>
                    <Space>
                      <Switch />
                      <Text strong>Parking</Text>
                    </Space>
                  </Card>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="foodCourt" valuePropName="checked">
                  <Card hoverable>
                    <Space>
                      <Switch />
                      <Text strong>Food Court</Text>
                    </Space>
                  </Card>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="wheelchairAccess" valuePropName="checked">
                  <Card hoverable>
                    <Space>
                      <Switch />
                      <Text strong>Wheelchair Access</Text>
                    </Space>
                  </Card>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="threeDScreen" valuePropName="checked">
                  <Card hoverable>
                    <Space>
                      <Switch />
                      <Text strong>3D Screen</Text>
                    </Space>
                  </Card>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="reclinerSeats" valuePropName="checked">
                  <Card hoverable>
                    <Space>
                      <Switch />
                      <Text strong>Recliner Seats</Text>
                    </Space>
                  </Card>
                </Form.Item>
              </Col>
            </Row>
          </Space>
        );
      default:
        return null;
    }
  };

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
        {/* Welcome Header */}
        <Card
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '16px',
            marginBottom: '24px',
            border: 'none'
          }}
          bodyStyle={{ padding: isMobile ? '24px' : '40px' }}
        >
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={18}>
              <Space direction="vertical" size="small">
                <Title level={2} style={{ color: '#fff', margin: 0 }}>
                  Welcome, {user?.name}! 🎭
                </Title>
                <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px' }}>
                  Manage your theatres and track approval status
                </Text>
              </Space>
            </Col>
            <Col xs={24} md={6} style={{ textAlign: isMobile ? 'left' : 'right' }}>
              <Button
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                onClick={handleAddTheatre}
                style={{
                  background: '#fff',
                  color: '#667eea',
                  border: 'none',
                  fontWeight: '600',
                  height: '48px'
                }}
              >
                Add Theatre
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Statistics Dashboard */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={12} sm={6}>
            <Card bordered={false} style={{ background: '#fff3e0', borderRadius: '12px' }}>
              <Statistic
                title="Pending Approval"
                value={pendingCount}
                prefix={<ClockCircleOutlined style={{ color: '#ff9800' }} />}
                valueStyle={{ color: '#ff9800' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card bordered={false} style={{ background: '#e8f5e9', borderRadius: '12px' }}>
              <Statistic
                title="Approved"
                value={approvedCount}
                prefix={<CheckCircleOutlined style={{ color: '#4caf50' }} />}
                valueStyle={{ color: '#4caf50' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card bordered={false} style={{ background: '#e3f2fd', borderRadius: '12px' }}>
              <Statistic
                title="Total Screens"
                value={totalScreens}
                prefix={<DashboardOutlined style={{ color: '#2196f3' }} />}
                valueStyle={{ color: '#2196f3' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card bordered={false} style={{ background: '#f3e5f5', borderRadius: '12px' }}>
              <Statistic
                title="Total Capacity"
                value={totalCapacity}
                prefix={<TeamOutlined style={{ color: '#9c27b0' }} />}
                valueStyle={{ color: '#9c27b0' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Main Content */}
        <Card style={{ borderRadius: '16px' }}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={3} style={{ margin: 0 }}>
                My Theatres ({theatres.length})
              </Title>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <Spin size="large" />
              </div>
            ) : theatres.length === 0 ? (
              <Empty
                description={
                  <Space direction="vertical" size="middle">
                    <Text>No theatres added yet</Text>
                    <Text type="secondary">
                      Add your first theatre to start managing bookings
                    </Text>
                  </Space>
                }
                style={{ padding: '60px 0' }}
              >
                <Button
                  type="primary"
                  size="large"
                  icon={<PlusOutlined />}
                  onClick={handleAddTheatre}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none'
                  }}
                >
                  Add Your First Theatre
                </Button>
              </Empty>
            ) : (
              <Table
                columns={columns}
                dataSource={theatres}
                rowKey="_id"
                scroll={{ x: true }}
                pagination={{
                  pageSize: isMobile ? 5 : 10,
                  showSizeChanger: !isMobile
                }}
              />
            )}
          </Space>
        </Card>

        {/* Add/Edit Theatre Modal */}
        <Modal
          title={
            <Space>
              {editingTheatre ? <EditOutlined /> : <PlusOutlined />}
              {editingTheatre ? 'Edit Theatre' : 'Add New Theatre'}
            </Space>
          }
          open={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            setEditingTheatre(null);
            form.resetFields();
          }}
          footer={null}
          width={isMobile ? '95%' : 800}
          destroyOnClose
        >
          <Steps current={currentStep} style={{ marginBottom: '32px' }} size="small">
            {steps.map((item, index) => (
              <Step key={index} title={!isMobile && item.title} icon={item.icon} />
            ))}
          </Steps>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
          >
            <div style={{ 
              minHeight: '300px', 
              maxHeight: isMobile ? '50vh' : '400px', 
              overflowY: 'auto',
              padding: '0 10px'
            }}>
              {renderStepContent()}
            </div>

            {/* <Divider /> */}

            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              {currentStep > 0 && (
                <Button onClick={prevStep}>
                  Previous
                </Button>
              )}
              <div style={{ flex: 1 }} />
              {currentStep < steps.length - 1 ? (
                <Button type="primary" onClick={nextStep}>
                  Next
                </Button>
              ) : (
                <Button type="primary" htmlType="submit">
                  {editingTheatre ? 'Update Theatre' : 'Submit for Approval'}
                </Button>
              )}
            </Space>
          </Form>
        </Modal>

        {/* View Theatre Details Modal */}
        <Modal
          title="Theatre Details"
          open={viewModalVisible}
          onCancel={() => {
            setViewModalVisible(false);
            setSelectedTheatre(null);
          }}
          footer={[
            <Button key="close" onClick={() => setViewModalVisible(false)}>
              Close
            </Button>,
            selectedTheatre?.status === 'approved' && (
              <Button
                key="edit"
                type="primary"
                icon={<EditOutlined />}
                onClick={() => {
                  setViewModalVisible(false);
                  handleEditTheatre(selectedTheatre);
                }}
              >
                Edit Theatre
              </Button>
            ),
          ]}
          width={isMobile ? '95%' : 700}
        >
          {selectedTheatre && (
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {/* Status Banner */}
              <Card
                style={{
                  background: selectedTheatre.status === 'approved'
                    ? 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)'
                    : selectedTheatre.status === 'rejected'
                    ? 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)'
                    : 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
                  border: 'none',
                  borderRadius: '12px'
                }}
              >
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <Space>
                    <Tag
                      icon={getStatusIcon(selectedTheatre.status)}
                      color={getStatusColor(selectedTheatre.status)}
                      style={{ fontSize: '14px', padding: '6px 16px' }}
                    >
                      {selectedTheatre.status.toUpperCase()}
                    </Tag>
                  </Space>
                  {selectedTheatre.status === 'pending' && (
                    <Text type="secondary">
                      Your theatre is under review. You'll be notified once it's approved.
                    </Text>
                  )}
                  {selectedTheatre.status === 'approved' && (
                    <Text style={{ color: '#2e7d32' }}>
                      ✓ Your theatre is live and ready to accept bookings!
                    </Text>
                  )}
                  {selectedTheatre.rejectionReason && (
                    <Alert
                      message="Rejection Reason"
                      description={selectedTheatre.rejectionReason}
                      type="error"
                      showIcon
                      style={{ marginTop: '8px' }}
                    />
                  )}
                </Space>
              </Card>

              {/* Theatre Information */}
              <Descriptions bordered column={1}>
                <Descriptions.Item label="Theatre Name">
                  <Text strong style={{ fontSize: '16px' }}>
                    {selectedTheatre.name}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Location">
                  {selectedTheatre.location?.address}<br />
                  {selectedTheatre.location?.city}, {selectedTheatre.location?.state}<br />
                  PIN: {selectedTheatre.location?.pincode}
                </Descriptions.Item>
                <Descriptions.Item label="Contact">
                  <PhoneOutlined /> {selectedTheatre.contact?.phone}<br />
                  <MailOutlined /> {selectedTheatre.contact?.email}
                </Descriptions.Item>
                <Descriptions.Item label="Capacity">
                  <Space>
                    <Tag color="blue">{selectedTheatre.totalScreens} Screens</Tag>
                    <Tag color="green">{selectedTheatre.seatingCapacity} Seats</Tag>
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Facilities">
                  <Space wrap>
                    {selectedTheatre.facilities?.parking && <Tag color="blue">Parking</Tag>}
                    {selectedTheatre.facilities?.foodCourt && <Tag color="orange">Food Court</Tag>}
                    {selectedTheatre.facilities?.wheelchairAccess && <Tag color="green">Wheelchair Access</Tag>}
                    {selectedTheatre.facilities?.threeDScreen && <Tag color="purple">3D Screen</Tag>}
                    {selectedTheatre.facilities?.reclinerSeats && <Tag color="gold">Recliner Seats</Tag>}
                  </Space>
                </Descriptions.Item>
              </Descriptions>

              {/* Timeline */}
              {selectedTheatre.status !== 'pending' && (
                <Card title="Approval Timeline" style={{ borderRadius: '12px' }}>
                  <Timeline>
                    <Timeline.Item color="green">
                      <Text strong>Theatre Submitted</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {dayjs(selectedTheatre.createdAt).format('DD MMM YYYY, hh:mm A')}
                      </Text>
                    </Timeline.Item>
                    {selectedTheatre.approvedAt && (
                      <Timeline.Item 
                        color={selectedTheatre.status === 'approved' ? 'green' : 'red'}
                      >
                        <Text strong>
                          {selectedTheatre.status === 'approved' ? 'Approved' : 'Rejected'}
                        </Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {dayjs(selectedTheatre.approvedAt).format('DD MMM YYYY, hh:mm A')}
                        </Text>
                      </Timeline.Item>
                    )}
                  </Timeline>
                </Card>
              )}
            </Space>
          )}
        </Modal>
      </Content>
    </Layout>
  );
}

export default Partner;