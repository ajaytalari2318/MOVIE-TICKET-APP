// src/pages/MovieDetails.jsx - Updated with Guest Experience
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout, Card, Row, Col, Typography, Button, Tag, Spin, Space, Divider, Modal, Alert } from 'antd';
import { ArrowLeftOutlined, CalendarOutlined, GlobalOutlined, StarFilled, HeartOutlined, HeartFilled, ShareAltOutlined } from '@ant-design/icons';
import Navbar from './Navbar';
import axios from 'axios';
import { API_BASE_URL } from '../calls/config';
import dayjs from 'dayjs';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const isGuest = !token;
  
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchMovieDetails();
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/movie/movieById/${id}`);
      if (response.data.success) {
        setMovie(response.data.movie);
      }
    } catch (error) {
      console.error('Error fetching movie:', error);
    } finally {
      setLoading(false);
    }
  };

  const showSignInPrompt = (action = 'book tickets') => {
    Modal.confirm({
      title: 'Sign In Required',
      content: (
        <div style={{ padding: '20px 0' }}>
          <Text style={{ fontSize: '16px', display: 'block', marginBottom: '16px' }}>
            Please sign in or register to {action} and enjoy a complete booking experience!
          </Text>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text type="secondary">🎬 Book movie tickets instantly</Text>
            <Text type="secondary">💳 Secure payment options</Text>
            <Text type="secondary">🎫 Easy ticket management</Text>
            <Text type="secondary">⭐ Exclusive member benefits</Text>
          </Space>
        </div>
      ),
      icon: null,
      okText: 'Sign In',
      cancelText: 'Register',
      onOk: () => navigate('/login'),
      onCancel: () => navigate('/register'),
      width: 500,
      centered: true,
    });
  };

  const handleBookTickets = () => {
    if (isGuest) {
      showSignInPrompt('book tickets');
    } else {
      Modal.info({
        title: 'Coming Soon',
        content: 'Ticket booking feature will be available soon!',
      });
    }
  };

  const handleFavorite = () => {
    if (isGuest) {
      showSignInPrompt('add to favorites');
    } else {
      setIsFavorite(!isFavorite);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: movie.title,
        text: `Check out ${movie.title} on BookMyShow!`,
        url: window.location.href,
      });
    } else {
      Modal.info({
        title: 'Share',
        content: 'Copy this link to share: ' + window.location.href,
      });
    }
  };

  if (loading) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Navbar />
        <Content style={{ 
          marginTop: 64, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: 'calc(100vh - 64px)'
        }}>
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
          <Text>Movie not found</Text>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Navbar />
      <Content style={{ marginTop: 64, padding: '20px' }}>
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

          {/* Guest Banner */}
          {isGuest && (
            <Alert
              message="Browse as Guest"
              description={
                <Space direction="vertical">
                  <Text>You're currently browsing as a guest. Sign in to book tickets and access exclusive features!</Text>
                  <Space>
                    <Button 
                      type="primary" 
                      size="small"
                      onClick={() => navigate('/login')}
                      style={{ background: '#f84464', borderColor: '#f84464' }}
                    >
                      Sign In
                    </Button>
                    <Button size="small" onClick={() => navigate('/register')}>
                      Register
                    </Button>
                  </Space>
                </Space>
              }
              type="warning"
              showIcon
              style={{ marginBottom: '20px', borderRadius: '8px' }}
            />
          )}

          <Card style={{ borderRadius: '12px', overflow: 'hidden' }}>
            <Row gutter={[32, 32]}>
              {/* Movie Poster */}
              <Col xs={24} md={8}>
                <div style={{
                  width: '100%',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  position: 'relative'
                }}>
                  <img
                    src={movie.posterURL}
                    alt={movie.title}
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block'
                    }}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
                    }}
                  />
                  
                  {/* Action Buttons on Poster */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    display: 'flex',
                    gap: '8px'
                  }}>
                    <Button
                      type="text"
                      icon={isFavorite ? <HeartFilled /> : <HeartOutlined />}
                      onClick={handleFavorite}
                      style={{
                        background: 'rgba(255,255,255,0.9)',
                        color: isFavorite ? '#f84464' : '#666',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                      }}
                    />
                    <Button
                      type="text"
                      icon={<ShareAltOutlined />}
                      onClick={handleShare}
                      style={{
                        background: 'rgba(255,255,255,0.9)',
                        color: '#666',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                      }}
                    />
                  </div>
                </div>
              </Col>

              {/* Movie Details */}
              <Col xs={24} md={16}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  {/* Title and Rating */}
                  <div>
                    <Title level={1} style={{ margin: 0, fontSize: 'clamp(24px, 5vw, 42px)' }}>
                      {movie.title}
                    </Title>
                    <Space size="middle" wrap style={{ marginTop: '12px' }}>
                      <Tag color="blue" style={{ fontSize: '14px', padding: '4px 12px' }}>
                        {movie.genre}
                      </Tag>
                      <Tag color="green" style={{ fontSize: '14px', padding: '4px 12px' }}>
                        <GlobalOutlined /> {movie.language}
                      </Tag>
                      <Tag 
                        color="gold" 
                        style={{ fontSize: '16px', padding: '4px 12px', fontWeight: 'bold' }}
                      >
                        <StarFilled /> {movie.rating}/10
                      </Tag>
                    </Space>
                  </div>

                  <Divider style={{ margin: '8px 0' }} />

                  {/* Release Date */}
                  <div>
                    <Space>
                      <CalendarOutlined style={{ fontSize: '18px', color: '#667eea' }} />
                      <Text strong style={{ fontSize: '16px' }}>Release Date:</Text>
                      <Text style={{ fontSize: '16px' }}>
                        {dayjs(movie.releaseDate).format('MMMM DD, YYYY')}
                      </Text>
                    </Space>
                  </div>

                  {/* Description */}
                  {movie.description && (
                    <div>
                      <Title level={4}>About the Movie</Title>
                      <Paragraph style={{ fontSize: '16px', lineHeight: '1.8' }}>
                        {movie.description}
                      </Paragraph>
                    </div>
                  )}

                  {/* Book Button */}
                  <Button
                    type="primary"
                    size="large"
                    block
                    onClick={handleBookTickets}
                    style={{
                      height: '56px',
                      fontSize: '18px',
                      fontWeight: '600',
                      background: isGuest 
                        ? 'linear-gradient(135deg, #ffa940 0%, #ff7a00 100%)'
                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      borderRadius: '8px',
                      marginTop: '20px'
                    }}
                  >
                    {isGuest ? '🔐 Sign In to Book Tickets' : '🎫 Book Tickets'}
                  </Button>

                  {isGuest && (
                    <Text type="secondary" style={{ display: 'block', textAlign: 'center' }}>
                      Create an account to book tickets instantly
                    </Text>
                  )}
                </Space>
              </Col>
            </Row>
          </Card>
        </div>
      </Content>
    </Layout>
  );
}

export default MovieDetails;