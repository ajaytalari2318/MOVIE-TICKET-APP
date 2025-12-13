import React from 'react';
import { Layout, Button, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../pages/Navbar';
import MovieCard from '../pages/movieCard';

const { Content } = Layout;
const { Title, Text } = Typography;

function Homepage() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // check if user is logged in

  return (
    <Layout>
      <Navbar />
      <Content style={{ padding: '20px' }}>
        {token ? (
          // ✅ Logged-in user sees movies
          <MovieCard />
        ) : (
          // ✅ New/guest user sees login/register prompt
          <div
            style={{
              minHeight: '93vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '12px',
              padding: '10px',
              color: '#fff',
              marginTop: '60px'
            }}
          >
            <Title level={2} style={{ color: '#fff' ,marginTop: '10px' }}>
              Welcome to BookMyShow 🎬
            </Title>
            <Text style={{ fontSize: '16px', color: '#fff' }}>
              Login or Register to book tickets and get the best experience
            </Text>

            <div style={{ marginTop: '20px', display: 'flex', gap: '16px' }}>
              <Button
                type="primary"
                size="large"
                onClick={() => navigate('/login')}
                style={{
                  background: '#f84464',
                  borderColor: '#f84464',
                  borderRadius: '8px',
                  fontWeight: '600',
                }}
              >
                Login
              </Button>
              <Button
                size="large"
                onClick={() => navigate('/register')}
                style={{
                  borderRadius: '8px',
                  fontWeight: '600',
                  background: '#fff',
                  color: '#667eea',
                }}
              >
                Register
              </Button>
            </div>
          </div>
        )}
      </Content>
    </Layout>
  );
}

export default Homepage;
