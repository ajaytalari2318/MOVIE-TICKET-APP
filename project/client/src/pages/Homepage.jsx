// src/pages/Homepage.jsx - Enhanced Version
import React, { useState, useEffect } from 'react';
import { Layout, Button, Typography, Row, Col, Card, Space, Input, Select, Spin, Empty } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import Navbar from './Navbar';
import { getAllMovies } from '../calls/movieCalls';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

function Homepage() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');

  useEffect(() => {
    if (token) {
      fetchMovies();
    }
  }, [token]);

  useEffect(() => {
    filterMovies();
  }, [searchQuery, selectedGenre, selectedLanguage, movies]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await getAllMovies();
      setMovies(response.movies || []);
      setFilteredMovies(response.movies || []);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterMovies = () => {
    let filtered = [...movies];

    if (searchQuery) {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedGenre !== 'all') {
      filtered = filtered.filter(movie => movie.genre === selectedGenre);
    }

    if (selectedLanguage !== 'all') {
      filtered = filtered.filter(movie => movie.language === selectedLanguage);
    }

    setFilteredMovies(filtered);
  };

  const genres = [...new Set(movies.map(m => m.genre))];
  const languages = [...new Set(movies.map(m => m.language))];

  if (!token) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Navbar />
        <Content style={{ 
          marginTop: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            maxWidth: '600px',
            width: '100%',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '16px',
            padding: '60px 40px',
            color: '#fff',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
          }}>
            <Title level={1} style={{ color: '#fff', fontSize: 'clamp(24px, 5vw, 36px)' }}>
              Welcome to BookMyShow 🎬
            </Title>
            <Text style={{ fontSize: 'clamp(14px, 3vw, 18px)', color: '#fff', display: 'block', marginBottom: '30px' }}>
              Login or Register to book tickets and get the best experience
            </Text>
            <Space size="large" wrap style={{ justifyContent: 'center' }}>
              <Button
                type="primary"
                size="large"
                onClick={() => navigate('/login')}
                style={{
                  background: '#f84464',
                  borderColor: '#f84464',
                  height: '50px',
                  minWidth: '140px',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
              >
                Login
              </Button>
              <Button
                size="large"
                onClick={() => navigate('/register')}
                style={{
                  background: '#fff',
                  color: '#667eea',
                  height: '50px',
                  minWidth: '140px',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
              >
                Register
              </Button>
            </Space>
          </div>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Navbar />
      <Content style={{ 
        marginTop: 64, 
        padding: '20px',
        maxWidth: '1400px',
        margin: '64px auto 0',
        width: '100%'
      }}>
        {/* Hero Section */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: 'clamp(20px, 5vw, 40px)',
          borderRadius: '12px',
          marginBottom: '30px',
          color: '#fff'
        }}>
          <Title level={2} style={{ color: '#fff', margin: 0, fontSize: 'clamp(20px, 4vw, 32px)' }}>
            Discover Amazing Movies 🍿
          </Title>
          <Text style={{ fontSize: 'clamp(14px, 2vw, 16px)', color: '#fff' }}>
            Book tickets for the latest blockbusters and upcoming releases
          </Text>
        </div>

        {/* Search & Filter Section */}
        <Card style={{ marginBottom: '30px', borderRadius: '12px' }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Input
                size="large"
                placeholder="Search movies..."
                prefix={<SearchOutlined />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ borderRadius: '8px' }}
              />
            </Col>
            <Col xs={12} md={6}>
              <Select
                size="large"
                value={selectedGenre}
                onChange={setSelectedGenre}
                style={{ width: '100%', borderRadius: '8px' }}
                suffixIcon={<FilterOutlined />}
              >
                <Option value="all">All Genres</Option>
                {genres.map(genre => (
                  <Option key={genre} value={genre}>{genre}</Option>
                ))}
              </Select>
            </Col>
            <Col xs={12} md={6}>
              <Select
                size="large"
                value={selectedLanguage}
                onChange={setSelectedLanguage}
                style={{ width: '100%', borderRadius: '8px' }}
                suffixIcon={<FilterOutlined />}
              >
                <Option value="all">All Languages</Option>
                {languages.map(lang => (
                  <Option key={lang} value={lang}>{lang}</Option>
                ))}
              </Select>
            </Col>
          </Row>
        </Card>

        {/* Movies Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <Spin size="large" />
          </div>
        ) : filteredMovies.length === 0 ? (
          <Empty
            description="No movies found"
            style={{ padding: '60px 0' }}
          />
        ) : (
          <>
            <Title level={3} style={{ marginBottom: '20px', fontSize: 'clamp(18px, 3vw, 24px)' }}>
              Now Showing ({filteredMovies.length})
            </Title>
            <Row gutter={[16, 16]}>
              {filteredMovies.map((movie) => (
                <Col xs={12} sm={8} md={6} lg={4} key={movie._id}>
                  <Card
                    hoverable
                    cover={
                      <div style={{ 
                        width: '100%', 
                        height: 'clamp(200px, 30vw, 350px)', 
                        overflow: 'hidden',
                        background: '#f0f0f0'
                      }}>
                        <img
                          alt={movie.title}
                          src={movie.posterURL}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
                          }}
                        />
                      </div>
                    }
                    style={{ 
                      borderRadius: '12px', 
                      overflow: 'hidden',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                    bodyStyle={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column' }}
                    onClick={() => navigate(`/movie/${movie._id}`)}
                  >
                    <div style={{ flex: 1 }}>
                      <Title 
                        level={5} 
                        style={{ 
                          margin: '0 0 8px 0',
                          fontSize: 'clamp(12px, 2vw, 16px)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {movie.title}
                      </Title>
                      <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <Text type="secondary" style={{ fontSize: 'clamp(10px, 1.5vw, 14px)' }}>
                          {movie.genre}
                        </Text>
                        <Text strong style={{ fontSize: 'clamp(10px, 1.5vw, 14px)' }}>
                          ⭐ {movie.rating}/10
                        </Text>
                      </Space>
                    </div>
                    <Button
                      type="primary"
                      block
                      style={{ 
                        marginTop: '12px',
                        background: '#f84464',
                        borderColor: '#f84464',
                        height: 'clamp(32px, 5vw, 40px)',
                        fontSize: 'clamp(12px, 2vw, 14px)'
                      }}
                    >
                      Book Now
                    </Button>
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        )}
      </Content>
    </Layout>
  );
}

export default Homepage;