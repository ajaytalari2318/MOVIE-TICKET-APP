// src/pages/Homepage.jsx - Updated with Guest Experience
import React, { useState, useEffect } from 'react';
import { Layout, Button, Typography, Row, Col, Card, Space, Input, Select, Spin, Empty, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { SearchOutlined, FilterOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';
import Navbar from './Navbar';
import { getAllMovies } from '../calls/movieCalls';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

function Homepage() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const isGuest = !token;
  
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchMovies();
  }, []);

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

  const showSignInPrompt = (action = 'access this feature') => {
    Modal.confirm({
      title: 'Sign In Required',
      content: (
        <div style={{ padding: '20px 0' }}>
          <Text style={{ fontSize: '16px', display: 'block', marginBottom: '16px' }}>
            Please sign in or register to {action} and enjoy a personalized experience!
          </Text>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text type="secondary">🎬 Book movie tickets</Text>
            <Text type="secondary">❤️ Save your favorite movies</Text>
            <Text type="secondary">🎫 View booking history</Text>
            <Text type="secondary">⭐ Get personalized recommendations</Text>
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

  const handleBookNow = (movieId) => {
    if (isGuest) {
      showSignInPrompt('book tickets');
    } else {
      navigate(`/movie/${movieId}`);
    }
  };

  const handleFavorite = (movieId) => {
    if (isGuest) {
      showSignInPrompt('add to favorites');
      return;
    }
    
    setFavorites(prev => {
      if (prev.includes(movieId)) {
        return prev.filter(id => id !== movieId);
      }
      return [...prev, movieId];
    });
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const genres = [...new Set(movies.map(m => m.genre))];
  const languages = [...new Set(movies.map(m => m.language))];

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
            {isGuest ? 'Welcome to BookMyShow! 🎬' : 'Discover Amazing Movies 🍿'}
          </Title>
          <Text style={{ fontSize: 'clamp(14px, 2vw, 16px)', color: '#fff' }}>
            {isGuest 
              ? 'Browse movies and sign in to book tickets for the latest blockbusters' 
              : 'Book tickets for the latest blockbusters and upcoming releases'
            }
          </Text>
        </div>

        {/* Guest Banner */}
        {isGuest && (
          <Card 
            style={{ 
              marginBottom: '30px', 
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #fff5e6 0%, #ffe0b3 100%)',
              border: '2px solid #ffa940'
            }}
          >
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} md={18}>
                <Space direction="vertical">
                  <Title level={4} style={{ margin: 0, color: '#d46b08' }}>
                    🎉 Sign in for exclusive benefits!
                  </Title>
                  <Text style={{ fontSize: '15px' }}>
                    Create an account to book tickets, save favorites, and get personalized recommendations
                  </Text>
                </Space>
              </Col>
              <Col xs={24} md={6} style={{ textAlign: 'right' }}>
                <Space>
                  <Button 
                    type="primary"
                    size="large"
                    onClick={() => navigate('/login')}
                    style={{
                      background: '#f84464',
                      borderColor: '#f84464',
                      fontWeight: '600'
                    }}
                  >
                    Sign In
                  </Button>
                  <Button 
                    size="large"
                    onClick={() => navigate('/register')}
                    style={{
                      fontWeight: '600'
                    }}
                  >
                    Register
                  </Button>
                </Space>
              </Col>
            </Row>
          </Card>
        )}

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
                      <div 
                        style={{ 
                          width: '100%', 
                          height: 'clamp(200px, 30vw, 350px)', 
                          overflow: 'hidden',
                          background: '#f0f0f0',
                          position: 'relative',
                          cursor: 'pointer'
                        }}
                        onClick={() => handleMovieClick(movie._id)}
                      >
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
                        {/* Favorite Button */}
                        <Button
                          type="text"
                          icon={favorites.includes(movie._id) ? <HeartFilled /> : <HeartOutlined />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFavorite(movie._id);
                          }}
                          style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            background: 'rgba(255,255,255,0.9)',
                            color: favorites.includes(movie._id) ? '#f84464' : '#666',
                            borderRadius: '50%',
                            width: '36px',
                            height: '36px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '18px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
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
                  >
                    <div style={{ flex: 1 }}>
                      <Title 
                        level={5} 
                        style={{ 
                          margin: '0 0 8px 0',
                          fontSize: 'clamp(12px, 2vw, 16px)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          cursor: 'pointer'
                        }}
                        onClick={() => handleMovieClick(movie._id)}
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
                      onClick={() => handleBookNow(movie._id)}
                      style={{ 
                        marginTop: '12px',
                        background: isGuest ? '#ffa940' : '#f84464',
                        borderColor: isGuest ? '#ffa940' : '#f84464',
                        height: 'clamp(32px, 5vw, 40px)',
                        fontSize: 'clamp(12px, 2vw, 14px)',
                        fontWeight: '600'
                      }}
                    >
                      {isGuest ? 'Sign In to Book' : 'Book Now'}
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