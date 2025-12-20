// client/src/pages/Profile.jsx - Admin Profile with Theatre Management
import React, { useState, useEffect } from 'react';
import { Layout, Table, Image, Button, Modal, Form, Input, DatePicker, message, Tabs, Space, Card, Spin, Empty, Tag, Badge, Row, Col, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
import { getAllMovies, addMovies, updateMovie, deleteMovie } from '../calls/movieCalls.js';
import { getAllTheatres, approveTheatre, rejectTheatre } from '../calls/theatreCalls.js';
import Navbar from './Navbar';
import dayjs from 'dayjs';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const Profile = () => {
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const [editingMovie, setEditingMovie] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [theatreLoading, setTheatreLoading] = useState(true);
  const [viewTheatreModal, setViewTheatreModal] = useState(false);
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [rejectModal, setRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchMovies();
  fetchTheatres();


    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await getAllMovies();
      setMovies(response.movies || []);
    } catch (error) {
      message.error('Failed to fetch movies.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTheatres = async () => {
  try {
    setTheatreLoading(true);
    const response = await getAllTheatres();
    console.log('Fetched theatres:', response.theatres); 
    setTheatres(response.theatres || []);
  } catch (error) {
    message.error('Failed to fetch theatres.');
  } finally {
    setTheatreLoading(false);
  }
};


  // Movie handlers
  const handleEdit = (record) => {
    setEditingMovie(record);
    form.setFieldsValue({
      ...record,
      releaseDate: record.releaseDate ? dayjs(record.releaseDate) : null,
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: 'Delete Movie',
      content: 'Are you sure you want to delete this movie?',
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteMovie(id);
          message.success('Movie deleted successfully!');
          await fetchMovies();
        } catch (error) {
          message.error('Failed to delete movie.');
        }
      }
    });
  };

  const onFinish = async (values) => {
    const movieData = {
      posterURL: values.posterURL,
      title: values.title,
      genre: values.genre,
      language: values.language,
      description: values.description,
      releaseDate: values.releaseDate.format('YYYY-MM-DD'),
      rating: values.rating,
    };

    setConfirmLoading(true);

    try {
      if (editingMovie) {
        await updateMovie(editingMovie._id, movieData);
        message.success('Movie updated successfully!');
      } else {
        await addMovies([movieData]);
        message.success('Movie added successfully!');
      }
      await fetchMovies();
      form.resetFields();
      setOpen(false);
      setEditingMovie(null);
    } catch (error) {
      message.error('Operation failed.');
    } finally {
      setConfirmLoading(false);
    }
  };

  // Theatre handlers
  const handleViewTheatre = (theatre) => {
    setSelectedTheatre(theatre);
    setViewTheatreModal(true);
  };

  const handleApprove = async (theatreId) => {
    Modal.confirm({
      title: 'Approve Theatre',
      content: 'Are you sure you want to approve this theatre?',
      okText: 'Approve',
      okType: 'primary',
      onOk: async () => {
        try {
          await approveTheatre(theatreId, user._id);
          message.success('Theatre approved successfully!');
          await fetchTheatres();
        } catch (error) {
          message.error('Failed to approve theatre.');
        }
      }
    });
  };

  const handleRejectClick = (theatre) => {
    setSelectedTheatre(theatre);
    setRejectModal(true);
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) {
      message.error('Please provide a reason for rejection');
      return;
    }

    try {
      await rejectTheatre(selectedTheatre._id, user._id, rejectReason);
      message.success('Theatre rejected');
      setRejectModal(false);
      setRejectReason('');
      setSelectedTheatre(null);
      await fetchTheatres();
    } catch (error) {
      message.error('Failed to reject theatre.');
    }
  };

  // Movie columns
  const movieColumns = [
    {
      title: 'Poster',
      dataIndex: 'posterURL',
      key: 'poster',
      width: isMobile ? 80 : 100,
      render: (poster) => (
        <Image
          src={poster}
          width={isMobile ? 60 : 70}
          height={isMobile ? 90 : 100}
          style={{ objectFit: 'cover', borderRadius: '6px' }}
        />
      )
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      responsive: ['sm']
    },
    {
      title: 'Genre',
      dataIndex: 'genre',
      key: 'genre',
      responsive: ['md']
    },
    {
      title: 'Language',
      dataIndex: 'language',
      key: 'language',
      responsive: ['md']
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      responsive: ['lg']
    },
    {
      title: 'Action',
      key: 'action',
      width: isMobile ? 80 : 150,
      render: (_, record) => (
        <Space size="small" direction={isMobile ? 'vertical' : 'horizontal'}>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size={isMobile ? 'small' : 'middle'}
          >
            {!isMobile && 'Edit'}
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
            size={isMobile ? 'small' : 'middle'}
          >
            {!isMobile && 'Delete'}
          </Button>
        </Space>
      )
    },
  ];

  // Theatre columns
  const theatreColumns = [
    {
      title: 'Theatre Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: 'Location',
      key: 'location',
      render: (_, record) => (
        <Text>{record.location.city}, {record.location.state}</Text>
      ),
      responsive: ['md']
    },
  {
  title: 'Owner',
  key: 'owner',
  render: (_, record) => (
    <Space direction="vertical" size="small">
      <Text strong>{record.contact?.owner}</Text>
      <Text type="secondary" style={{ fontSize: '12px' }}>{record.contact?.email}</Text>
    </Space>
  ),
  responsive: ['lg']
},


    {
      title: 'Screens',
      dataIndex: 'totalScreens',
      key: 'totalScreens',
      responsive: ['sm']
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colorMap = {
          pending: 'orange',
          approved: 'green',
          rejected: 'red'
        };
        return (
          <Tag color={colorMap[status]}>
            {status}
          </Tag>
        );
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="small" direction={isMobile ? 'vertical' : 'horizontal'} wrap>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewTheatre(record)}
            size="small"
          >
            View
          </Button>
          {record.status === 'pending' && (
            <>
              <Button
                type="link"
                icon={<CheckOutlined />}
                onClick={() => handleApprove(record._id)}
                size="small"
                style={{ color: '#52c41a' }}
              >
                Approve
              </Button>
              <Button
                type="link"
                danger
                icon={<CloseOutlined />}
                onClick={() => handleRejectClick(record)}
                size="small"
              >
                Reject
              </Button>
            </>
          )}
        </Space>
      )
    },
  ];

  // Statistics cards
  const pendingCount = theatres.filter(t => t.status === 'pending').length;
  const approvedCount = theatres.filter(t => t.status === 'approved').length;
  const rejectedCount = theatres.filter(t => t.status === 'rejected').length;

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
        <Card style={{ borderRadius: '12px' }}>
          <Tabs defaultActiveKey="movies">
            {/* Movies Tab */}
            <Tabs.TabPane tab="Movies" key="movies">
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginBottom: '16px'
              }}>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setEditingMovie(null);
                    form.resetFields();
                    setOpen(true);
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none'
                  }}
                  size={isMobile ? 'middle' : 'large'}
                >
                  {isMobile ? 'Add' : 'Add Movie'}
                </Button>
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <Spin size="large" />
                </div>
              ) : movies.length === 0 ? (
                <Empty
                  description="No movies found"
                  style={{ padding: '60px 0' }}
                />
              ) : (
                <Table
                  columns={movieColumns}
                  dataSource={movies}
                  rowKey="_id"
                  scroll={{ x: true }}
                  pagination={{
                    pageSize: isMobile ? 5 : 10,
                    showSizeChanger: !isMobile
                  }}
                />
              )}
            </Tabs.TabPane>

            {/* Theatres Tab */}
            <Tabs.TabPane
              tab={
                <Badge count={pendingCount} offset={[10, 0]}>
                  Theatres
                </Badge>
              }
              key="theatres"
            >
              {/* Statistics */}
              <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={8}>
                  <Card style={{ background: '#fff3e0', border: 'none' }}>
                    <Space direction="vertical" size="small">
                      <Text type="secondary">Pending Approval</Text>
                      <Title level={2} style={{ margin: 0, color: '#ff9800' }}>
                        {pendingCount}
                      </Title>
                    </Space>
                  </Card>
                </Col>
                <Col xs={24} sm={8}>
                  <Card style={{ background: '#e8f5e9', border: 'none' }}>
                    <Space direction="vertical" size="small">
                      <Text type="secondary">Approved</Text>
                      <Title level={2} style={{ margin: 0, color: '#4caf50' }}>
                        {approvedCount}
                      </Title>
                    </Space>
                  </Card>
                </Col>
                <Col xs={24} sm={8}>
                  <Card style={{ background: '#ffebee', border: 'none' }}>
                    <Space direction="vertical" size="small">
                      <Text type="secondary">Rejected</Text>
                      <Title level={2} style={{ margin: 0, color: '#f44336' }}>
                        {rejectedCount}
                      </Title>
                    </Space>
                  </Card>
                </Col>
              </Row>

              {theatreLoading ? (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <Spin size="large" />
                </div>
              ) : theatres.length === 0 ? (
                <Empty
                  description="No theatre requests yet"
                  style={{ padding: '60px 0' }}
                />
              ) : (
                <Table
                  columns={theatreColumns}
                  dataSource={theatres}
                  rowKey="_id"
                  scroll={{ x: true }}
                  pagination={{
                    pageSize: isMobile ? 5 : 10,
                    showSizeChanger: !isMobile
                  }}
                />
              )}
            </Tabs.TabPane>
          </Tabs>
        </Card>

        {/* Movie Modal */}
        <Modal
          title={editingMovie ? "Edit Movie" : "Add New Movie"}
          open={open}
          onCancel={() => { setOpen(false); setEditingMovie(null); }}
          confirmLoading={confirmLoading}
          footer={null}
          width={isMobile ? '95%' : 800}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            style={{ maxHeight: isMobile ? '70vh' : '450px', overflowY: 'auto', padding: '10px' }}
          >
            <Form.Item
              name="posterURL"
              label="Poster URL"
              rules={[{ required: true, message: 'Please enter poster URL' }]}
            >
              <Input placeholder="https://example.com/poster.jpg" />
            </Form.Item>

            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: 'Please enter title' }]}
            >
              <Input placeholder="Movie Title" />
            </Form.Item>

            <Form.Item
              name="genre"
              label="Genre"
              rules={[{ required: true, message: 'Please enter genre' }]}
            >
              <Input placeholder="Action, Drama, Comedy..." />
            </Form.Item>

            <Form.Item
              name="language"
              label="Language"
              rules={[{ required: true, message: 'Please enter language' }]}
            >
              <Input placeholder="English, Hindi, Tamil..." />
            </Form.Item>

            <Form.Item name="description" label="Description">
              <TextArea rows={4} placeholder="Movie description..." />
            </Form.Item>

            <Form.Item
              name="releaseDate"
              label="Release Date"
              rules={[{ required: true, message: 'Please select release date' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item name="rating" label="Rating (0-10)">
              <Input type="number" min={0} max={10} step={0.1} placeholder="7.5" />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" loading={confirmLoading}>
                  {editingMovie ? "Update" : "Save"}
                </Button>
                <Button onClick={() => { setOpen(false); setEditingMovie(null); }}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* View Theatre Modal */}
        {/* View Theatre Modal */}
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
                <Title level={4}>{selectedTheatre?.name || 'Unnamed Theatre'}</Title>
                <Tag
                  color={
                    selectedTheatre?.status === 'approved'
                      ? 'green'
                      : selectedTheatre?.status === 'rejected'
                        ? 'red'
                        : 'orange'
                  }
                >
                  {selectedTheatre?.status
                    ? selectedTheatre.status.toUpperCase()
                    : 'UNKNOWN'}
                </Tag>
              </Card>

              <div>
                <Text strong>Location:</Text>
                <Paragraph>
                  {selectedTheatre?.location?.address || 'N/A'} <br />
                  {selectedTheatre?.location?.city || ''}{' '}
                  {selectedTheatre?.location?.state || ''} <br />
                  {selectedTheatre?.location?.pincode || ''}
                </Paragraph>
              </div>

              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Text strong>Total Screens:</Text>
                  <Paragraph>{selectedTheatre?.totalScreens || 'N/A'}</Paragraph>
                </Col>
                <Col span={12}>
                  <Text strong>Contact:</Text>
                  <Paragraph>
                    {selectedTheatre?.contact?.phone || 'N/A'} <br />
                    {selectedTheatre?.contact?.email || 'N/A'}
                  </Paragraph>
                </Col>
              </Row>

              <div>
                <Text strong>Facilities:</Text>
                <Space wrap style={{ marginTop: '8px' }}>
                  {selectedTheatre?.facilities?.parking && (
                    <Tag color="blue">Parking</Tag>
                  )}
                  {selectedTheatre?.facilities?.foodCourt && (
                    <Tag color="blue">Food Court</Tag>
                  )}
                  {selectedTheatre?.facilities?.wheelchairAccess && (
                    <Tag color="blue">Wheelchair Access</Tag>
                  )}
                  {selectedTheatre?.facilities?.threeDScreen && (
                    <Tag color="blue">3D Screen</Tag>
                  )}
                  {selectedTheatre?.facilities?.reclinerSeats && (
                    <Tag color="blue">Recliner Seats</Tag>
                  )}
                </Space>
              </div>

              {/* <div>
                <Text strong>Owner:</Text>
                <Paragraph>
                  {selectedTheatre?.owner|| 'N/A'} <br />
                  {selectedTheatre?.owner || 'N/A'}
                </Paragraph>
              </div> */}

              {selectedTheatre?.rejectionReason && (
                <Card style={{ background: '#fff1f0', border: '1px solid #ffccc7' }}>
                  <Text strong style={{ color: '#cf1322' }}>Rejection Reason:</Text>
                  <Paragraph>{selectedTheatre.rejectionReason}</Paragraph>
                </Card>
              )}

              {selectedTheatre?.status === 'pending' && (
                <Space>
                  <Button
                    type="primary"
                    icon={<CheckOutlined />}
                    onClick={() => {
                      handleApprove(selectedTheatre?._id);
                      setViewTheatreModal(false);
                    }}
                    style={{ background: '#52c41a', borderColor: '#52c41a' }}
                  >
                    Approve
                  </Button>
                  <Button
                    danger
                    icon={<CloseOutlined />}
                    onClick={() => {
                      setViewTheatreModal(false);
                      handleRejectClick(selectedTheatre);
                    }}
                  >
                    Reject
                  </Button>
                </Space>
              )}
            </Space>
          )}
        </Modal>

        {/* Reject Modal */}
        <Modal
          title="Reject Theatre"
          open={rejectModal}
          onCancel={() => {
            setRejectModal(false);
            setRejectReason('');
            setSelectedTheatre(null);
          }}
          footer={[
            <Button
              key="cancel"
              onClick={() => {
                setRejectModal(false);
                setRejectReason('');
                setSelectedTheatre(null);
              }}
            >
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              danger
              onClick={handleRejectSubmit}
            >
              Reject Theatre
            </Button>,
          ]}
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Text>Please provide a reason for rejecting this theatre:</Text>
            <TextArea
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
            />
          </Space>
        </Modal>
      </Content>
    </Layout>
  );
};

export default Profile;