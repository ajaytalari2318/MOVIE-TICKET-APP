import React, { useState, useEffect } from 'react';
import { Table, Image, Button, Modal, Form, Input, DatePicker, message, Tabs, Space } from 'antd';
import { getAllMovies, addMovies, updateMovie, deleteMovie } from '../calls/movieCalls.js';
import dayjs from 'dayjs';

const Profile = () => {
  const [movies, setMovies] = useState([]);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const [editingMovie, setEditingMovie] = useState(null); // track edit mode

  const fetchMovies = async () => {
    try {
      const response = await getAllMovies();
      setMovies(response.movies || []);
    } catch (error) {
      message.error('Failed to fetch movies.');
    } finally {
      setConfirmLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleEdit = (record) => {
    setEditingMovie(record);
    form.setFieldsValue({
      ...record,
      releaseDate: record.releaseDate ? dayjs(record.releaseDate) : null,
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteMovie(id);
      message.success('Movie deleted successfully!');
      await fetchMovies();
    } catch (error) {
      message.error('Failed to delete movie.');
    }
  };

  const movieColumns = [
    { title: 'Poster', dataIndex: 'posterURL', key: 'poster',
      render: (poster) => <Image src={poster} width={70} height={100} style={{ objectFit: 'cover', borderRadius: '6px' }} /> },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Genre', dataIndex: 'genre', key: 'genre' },
    { title: 'Language', dataIndex: 'language', key: 'language' },
    { title: 'Description', dataIndex: 'description', key: 'description', ellipsis: true },
    { title: 'Release Date', dataIndex: 'releaseDate', key: 'releaseDate',
      render: (date) => date ? dayjs(date).format('DD-MM-YYYY') : '' },
    { title: 'Rating', dataIndex: 'rating', key: 'rating' },
    { title: 'Action', key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
          <Button type="link" danger onClick={() => handleDelete(record._id)}>Delete</Button>
        </Space>
      ) },
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
    <Tabs defaultActiveKey="movies">
      <Tabs.TabPane tab="Movies" key="movies">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '5px' }}>
          <Button type="primary" onClick={() => { setEditingMovie(null); form.resetFields(); setOpen(true); }}>
            Add Movie
          </Button>
        </div>

        <Table columns={movieColumns} dataSource={movies} rowKey="_id" />

        <Modal
          title={editingMovie ? "Edit Movie" : "Add New Movie"}
          open={open}
          onCancel={() => { setOpen(false); setEditingMovie(null); }}
          confirmLoading={confirmLoading}
          footer={null}
          width={800}
          bodyStyle={{ maxHeight: '450px', overflowY: 'auto' }}
        >
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item name="posterURL" label="Poster URL" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item name="title" label="Title" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item name="genre" label="Genre" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item name="language" label="Language" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item name="description" label="Description"><Input.TextArea /></Form.Item>
            <Form.Item name="releaseDate" label="Release Date" rules={[{ required: true }]}><DatePicker /></Form.Item>
            <Form.Item name="rating" label="Rating"><Input /></Form.Item>
            <Button type="primary" htmlType="submit">{editingMovie ? "Update" : "Save"}</Button>
          </Form>
        </Modal>
      </Tabs.TabPane>

      <Tabs.TabPane tab="Theatres" key="theatres">
        <p>Theatres</p>
      </Tabs.TabPane>
    </Tabs>
  );
};

export default Profile;
