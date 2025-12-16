// src/pages/Profile.jsx - Enhanced Responsive Version
import React, { useState, useEffect } from 'react';
import { Layout, Table, Image, Button, Modal, Form, Input, DatePicker, message, Tabs, Space, Card, Spin, Empty } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getAllMovies, addMovies, updateMovie, deleteMovie } from '../calls/movieCalls.js';
import Navbar from './Navbar';
import dayjs from 'dayjs';

const { Content } = Layout;

const Profile = () => {
  const [movies, setMovies] = useState([]);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const [editingMovie, setEditingMovie] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies();

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
      setConfirmLoading(false);
      setLoading(false);
    }
  };

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
                    <Input.TextArea rows={4} placeholder="Movie description..." />
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
                      <Button type="primary" htmlType="
submit" loading={confirmLoading}>
                        {editingMovie ? "Update" : "Save"}
                      </Button>
                      <Button onClick={() => { setOpen(false); setEditingMovie(null); }}>
                        Cancel
                      </Button>
                    </Space>
                  </Form.Item>
                </Form>
              </Modal>
            </Tabs.TabPane>

            <Tabs.TabPane tab="Theatres" key="theatres">
              <Card style={{ textAlign: 'center', padding: '40px' }}>
                <p style={{ fontSize: '16px', color: '#999' }}>
                  Theatre management coming soon...
                </p>
              </Card>
            </Tabs.TabPane>
          </Tabs>
        </Card>
      </Content>
    </Layout>
  );
};

export default Profile;