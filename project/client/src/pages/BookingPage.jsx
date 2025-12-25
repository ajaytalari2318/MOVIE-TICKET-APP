// src/pages/BookingPage.jsx - Theatre & Show Selection
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Layout, Card, Row, Col, Typography, Button, Space, Tag, Divider,
    Spin, Empty, DatePicker, Radio, message, Modal, Tabs
} from 'antd';
import {
    ArrowLeftOutlined, EnvironmentOutlined, CalendarOutlined,
    ClockCircleOutlined, StarFilled, ThunderboltOutlined
} from '@ant-design/icons';
import Navbar from './Navbar';
import axios from 'axios';
import { API_BASE_URL } from '../calls/config';
import dayjs from 'dayjs';
import { getAllTheatres } from '../calls/theatreCalls';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

function BookingPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [theatres, setTheatres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [selectedShow, setSelectedShow] = useState(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        fetchMovieAndTheatres();
    }, [id, selectedDate]);

    const fetchMovieAndTheatres = async () => {
        try {
            setLoading(true);

            // Fetch movie details
            const movieResponse = await axios.get(`${API_BASE_URL}/api/movie/movieById/${id}`);
            if (movieResponse.data.success) {
                setMovie(movieResponse.data.movie);
                //console.log(movieResponse.data.movie)
            }

            // Fetch approved theatres
        const theatreResponse = await getAllTheatres();
            //console.log(theatreResponse)
            if (theatreResponse.success) {
  const theatresWithShows = generateShowTimings(theatreResponse.theatres);
  setTheatres(theatresWithShows);
  //console.log(theatresWithShows);
  //console.log(theatreResponse);        
}


        }catch (error) {
  console.error('Error in fetchMovieAndTheatres:', error.response?.data || error.message);
  message.error('Failed to load booking details');
}
 finally {
            setLoading(false);
        }
    };

    const generateShowTimings = (theatreList) => {
        const showTimings = ['09:00 AM', '12:30 PM', '03:45 PM', '06:30 PM', '09:45 PM'];
        const formats = ['2D', '3D', 'IMAX'];

        return theatreList.map(theatre => ({
            ...theatre,
            shows: showTimings.map((time, index) => ({
                id: `${theatre._id}_${index}`,
                time,
                format: formats[Math.floor(Math.random() * formats.length)],
                price: Math.floor(Math.random() * (400 - 150 + 1)) + 150,
                availableSeats: Math.floor(Math.random() * (200 - 50 + 1)) + 50,
                totalSeats: 250,
                screen: `Screen ${Math.floor(Math.random() * theatre.totalScreens) + 1}`
            }))
        }));
    };

    const handleShowSelect = (theatre, show) => {
        setSelectedShow({
            theatre,
            show,
            movie,
            date: selectedDate.format('YYYY-MM-DD')
        });

        Modal.confirm({
            title: 'Confirm Show Selection',
            content: (
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <div>
                        <Text strong>{movie.title}</Text>
                        <br />
                        <Text type="secondary">{theatre.name}</Text>
                    </div>
                    <Divider style={{ margin: '8px 0' }} />
                    <div>
                        <Text>Date: {selectedDate.format('DD MMM YYYY')}</Text>
                        <br />
                        <Text>Time: {show.time}</Text>
                        <br />
                        <Text>Format: {show.format}</Text>
                        <br />
                        <Text>Screen: {show.screen}</Text>
                    </div>
                    <Divider style={{ margin: '8px 0' }} />
                    <Text strong style={{ fontSize: '16px' }}>
                        Price: ₹{show.price} per seat
                    </Text>
                </Space>
            ),
            okText: 'Proceed to Seat Selection',
            cancelText: 'Cancel',
            onOk: () => {
                navigate('/seat-selection', {
                    state: {
                        theatre,
                        show,
                        movie,
                        date: selectedDate.format('YYYY-MM-DD')
                    }
                });
            },
            width: isMobile ? '95%' : 500,
        });
    };

    const disabledDate = (current) => {
        return current && current < dayjs().startOf('day');
    };

    if (loading) {
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <Navbar />
                <Content style={{ marginTop: 64, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 64px)' }}>
                    <Spin size="large" />
                </Content>
            </Layout>
        );
    }

    if (!movie) {
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <Navbar />
                <Content style={{ marginTop: 64, padding: '20px' }}>
                    <Empty description="Movie not found" />
                </Content>
            </Layout>
        );
    }

    return (
        <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
            <Navbar />
            <Content style={{ marginTop: 64, padding: isMobile ? '16px' : '20px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    {/* Back Button */}
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate(-1)}
                        style={{ marginBottom: '20px' }}
                        size="large"
                    >
                        Back
                    </Button>

                    {/* Movie Info Card */}
                    <Card style={{ borderRadius: '12px', marginBottom: '24px' }}>
                        <Row gutter={[24, 24]} align="middle">
                            <Col xs={8} sm={6} md={4}>
                                <img
                                    src={movie.posterURL}
                                    alt={movie.title}
                                    style={{
                                        width: '100%',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                    }}
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/150x225?text=No+Image';
                                    }}
                                />
                            </Col>
                            <Col xs={16} sm={18} md={20}>
                                <Space direction="vertical" size="small">
                                    <Title level={isMobile ? 4 : 2} style={{ margin: 0 }}>
                                        {movie.title}
                                    </Title>
                                    <Space wrap>
                                        <Tag color="blue">{movie.genre}</Tag>
                                        <Tag color="green">{movie.language}</Tag>
                                        <Tag color="gold">
                                            <StarFilled /> {movie.rating}/10
                                        </Tag>
                                    </Space>
                                    {!isMobile && movie.description && (
                                        <Paragraph ellipsis={{ rows: 2 }} style={{ marginTop: '8px' }}>
                                            {movie.description}
                                        </Paragraph>
                                    )}
                                </Space>
                            </Col>
                        </Row>
                    </Card>

                    {/* Date Selection */}
                    <Card style={{ borderRadius: '12px', marginBottom: '24px' }}>
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            <div>
                                <CalendarOutlined style={{ fontSize: '20px', marginRight: '8px', color: '#667eea' }} />
                                <Text strong style={{ fontSize: '16px' }}>Select Date</Text>
                            </div>

                            <Radio.Group
                                value={selectedDate.format('YYYY-MM-DD')}
                                onChange={(e) => setSelectedDate(dayjs(e.target.value))}
                                style={{ width: '100%' }}
                            >
                                <Space wrap>
                                    {[0, 1, 2, 3, 4, 5, 6].map(days => {
                                        const date = dayjs().add(days, 'day');
                                        return (
                                            <Radio.Button
                                                key={days}
                                                value={date.format('YYYY-MM-DD')}
                                                style={{
                                                    height: 'auto',
                                                    padding: '12px 16px',
                                                    borderRadius: '8px'
                                                }}
                                            >
                                                <div style={{ textAlign: 'center' }}>
                                                    <div style={{ fontSize: '12px', color: '#888' }}>
                                                        {date.format('ddd')}
                                                    </div>
                                                    <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                                                        {date.format('DD')}
                                                    </div>
                                                    <div style={{ fontSize: '12px', color: '#888' }}>
                                                        {date.format('MMM')}
                                                    </div>
                                                </div>
                                            </Radio.Button>
                                        );
                                    })}
                                </Space>
                            </Radio.Group>
                        </Space>
                    </Card>

                    {/* Theatres List */}
                    {theatres.length === 0 ? (
                        <Empty
                            description="No theatres available"
                            style={{ padding: '60px 0' }}
                        />
                    ) : (
                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                            {theatres.map(theatre => (
                                <Card
                                    key={theatre._id}
                                    style={{ borderRadius: '12px' }}
                                    bodyStyle={{ padding: isMobile ? '16px' : '24px' }}
                                >
                                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                        {/* Theatre Header */}
                                        <div>
                                            <Title level={isMobile ? 5 : 4} style={{ margin: '0 0 8px 0' }}>
                                                {theatre.name}
                                            </Title>
                                            <Space wrap>
                                                <Text type="secondary">
                                                    <EnvironmentOutlined /> {theatre.location.city}, {theatre.location.state}
                                                </Text>
                                                {theatre.facilities?.parking && (
                                                    <Tag color="blue">Parking</Tag>
                                                )}
                                                {theatre.facilities?.foodCourt && (
                                                    <Tag color="green">Food Court</Tag>
                                                )}
                                            </Space>
                                        </div>

                                        <Divider style={{ margin: '8px 0' }} />

                                        {/* Show Timings */}
                                        <div>
                                            <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '12px' }}>
                                                <ClockCircleOutlined /> Available Shows
                                            </Text>

                                            <Space wrap size="middle">
                                                {theatre.shows.map(show => (
                                                    <Card
                                                        key={show.id}
                                                        hoverable
                                                        onClick={() => handleShowSelect(theatre, show)}
                                                        style={{
                                                            borderRadius: '8px',
                                                            border: '1px solid #e0e0e0',
                                                            minWidth: isMobile ? '120px' : '140px',
                                                            cursor: 'pointer'
                                                        }}
                                                        bodyStyle={{ padding: isMobile ? '12px' : '16px' }}
                                                    >
                                                        <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                                            <Text strong style={{ fontSize: isMobile ? '14px' : '16px', color: '#52c41a' }}>
                                                                {show.time}
                                                            </Text>
                                                            <Space>
                                                                <Tag color="purple">{show.format}</Tag>
                                                            </Space>
                                                            <Text type="secondary" style={{ fontSize: '12px' }}>
                                                                {show.screen}
                                                            </Text>
                                                            <Text strong style={{ color: '#667eea' }}>
                                                                ₹{show.price}
                                                            </Text>
                                                            <Text type="secondary" style={{ fontSize: '11px' }}>
                                                                {show.availableSeats} seats
                                                            </Text>
                                                        </Space>
                                                    </Card>
                                                ))}
                                            </Space>
                                        </div>
                                    </Space>
                                </Card>
                            ))}
                        </Space>
                    )}

                    {/* Info Banner */}
                    <Card
                        style={{
                            marginTop: '24px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            border: 'none',
                            borderRadius: '12px'
                        }}
                    >
                        <Space>
                            <ThunderboltOutlined style={{ fontSize: '24px', color: '#fff' }} />
                            <Text style={{ color: '#fff', fontSize: '14px' }}>
                                Select your preferred show time to continue with seat selection
                            </Text>
                        </Space>
                    </Card>
                </div>
            </Content>
        </Layout>
    );
}

export default BookingPage;