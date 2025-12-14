// src/pages/MovieDetails.jsx - NEW FILE
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout, Card, Row, Col, Typography, Button, Tag, Spin, Space, Divider } from 'antd';
import { ArrowLeftOutlined, CalendarOutlined, GlobalOutlined, StarFilled } from '@ant-design/icons';
import Navbar from './Navbar';
import axios from 'axios';
import { API_BASE_URL } from '../calls/config';
import dayjs from 'dayjs';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

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

          <Card style={{ borderRadius: '12px', overflow: 'hidden' }}>
            <Row gutter={[32, 32]}>
              {/* Movie Poster */}
              <Col xs={24} md={8}>
                <div style={{
                  width: '100%',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
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
                    style={{
                      height: '56px',
                      fontSize: '18px',
                      fontWeight: '600',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      borderRadius: '8px',
                      marginTop: '20px'
                    }}
                  >
                    Book Tickets
                  </Button>
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