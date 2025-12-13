import React, { useState, useEffect } from 'react';
import { Table, Image, Button, Modal, Form, Input, DatePicker, message, Tabs, Space } from 'antd';
import { getAllMovies, addMovies } from '../calls/movieCalls.js';
import dayjs from 'dayjs';

const Profile = () => {
    const [movies, setMovies] = useState([]);
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [form] = Form.useForm();

    // Fetch movies from backend
    const fetchMovies = async () => {
        try {
            const response = await getAllMovies();
            setMovies(response.movies || []);
        } catch (error) {
            console.error('Error fetching movies:', error);
            message.error('Failed to fetch movies. Please try again.');
        } finally {
            setConfirmLoading(false);
        }
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    const movieColumns = [
        {
            title: 'Poster',
            dataIndex: 'posterURL',
            key: 'poster',
            render: (poster) => (
                <Image
                    src={poster}
                    alt="Movie Poster"
                    width={70}
                    height={100}
                    style={{ objectFit: 'cover', borderRadius: '6px' }}
                />
            ),
        },
        { title: 'Title', dataIndex: 'title', key: 'title' },
        { title: 'Genre', dataIndex: 'genre', key: 'genre' },
        { title: 'Language', dataIndex: 'language', key: 'language' },
        { title: 'Description', dataIndex: 'description', key: 'description', ellipsis: true },
        {
            title: 'Release Date',
            dataIndex: 'releaseDate',
            key: 'releaseDate',
            render: (date) => date ? dayjs(date).format('DD-MM-YYYY') : ''
        },

        { title: 'Rating', dataIndex: 'rating', key: 'rating' },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
                    <Button type="link" danger onClick={() => handleDelete(record._id)}>Delete</Button>
                </Space>
            ),
        },
    ];


    const onFinish = async (values) => {
        const newMovie = {
            posterURL: values.posterURL,
            title: values.title,
            genre: values.genre,
            language: values.language,
            description: values.description,
            releaseDate: values.releaseDate.format('YYYY-MM-DD'),
            rating: values.rating,
            Action: EditDelete
        };

        setConfirmLoading(true);

        try {
            await addMovies([newMovie]); // backend expects array
            message.success('Movie added successfully!');
            await fetchMovies();
            form.resetFields();
            setOpen(false);
        } catch (error) {
            console.error('Error adding movie:', error.response?.data || error.message);
            message.error(error.response?.data?.message || 'Failed to add movie. Please try again.');
        } finally {
            setConfirmLoading(false);
        }
    };

    return (
        <Tabs defaultActiveKey="movies">
            {/* Movies Tab */}
            <Tabs.items tab="Movies" key="movies">
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '5px' }}>
                    <Button type="primary" onClick={() => setOpen(true)}>
                        Add Movie
                    </Button>
                </div>

                <Table columns={movieColumns} dataSource={movies} rowKey="_id" />

                <Modal
                    title="Add New Movie"
                    open={open}
                    onCancel={() => setOpen(false)}
                    confirmLoading={confirmLoading}
                    footer={null}
                    width={800}
                    styles={{ maxHeight: '450px', overflowY: 'auto' }}
                >
                    <Form form={form} layout="vertical" onFinish={onFinish}>
                        <Form.Item name="posterURL" label="Poster URL" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="genre" label="Genre" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="language" label="Language" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="description" label="Description">
                            <Input.TextArea />
                        </Form.Item>
                        <Form.Item name="releaseDate" label="Release Date" rules={[{ required: true }]}>
                            <DatePicker />
                        </Form.Item>
                        <Form.Item name="rating" label="Rating">
                            <Input />
                        </Form.Item>
                        <Button type="primary" htmlType="submit">Save</Button>
                    </Form>
                </Modal>
            </Tabs.items>

            {/* Theatres Tab */}
            <Tabs.items tab="Theatres" key="theatres">
                <p>Theatres </p>
            </Tabs.items>
        </Tabs>
    );
};

export default Profile;
