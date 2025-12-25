// src/pages/BookingHistory.jsx
import React, { useState, useEffect } from 'react';
import {
  Layout, Card, Typography, Button, Space, Tabs, List, Tag, Empty, Divider, Row, Col
} from 'antd';
import {
  CalendarOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;
const { Title, Text } = Typography;

function BookingHistory() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const storedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    setBookings(storedBookings);

    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/login');
    }

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [navigate]);

  const BookingsTab = () => (
    <div>
      {bookings.length === 0 ? (
        <Empty
          description="No bookings yet"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ padding: '60px 0' }}
        >
          <Button
            type="primary"
            size="large"
            onClick={() => navigate('/home')}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none'
            }}
          >
            Book Now
          </Button>
        </Empty>
      ) : (
        <List
          grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }}
          dataSource={bookings}
          renderItem={(booking) => (
            <List.Item>
              <Card hoverable style={{ borderRadius: '12px' }} bodyStyle={{ padding: '20px' }}>
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div>
                    <Title level={4} style={{ margin: '0 0 8px 0' }}>
                      {booking.movie}
                    </Title>
                    <Text type="secondary">
                      <EnvironmentOutlined /> {booking.theatre}
                    </Text>
                  </div>

                  <Divider style={{ margin: '8px 0' }} />

                  <Row gutter={[16, 8]}>
                    <Col span={12}>
                      <Text type="secondary"> <CalendarOutlined /> Date </Text>
                      <Text strong>{` : ${booking.date}`}</Text>
                    </Col>
                    <Col span={12}>
                      <Text type="secondary">Time</Text>
                      <Text strong>{` : ${booking.time}`}</Text>
                    </Col>
                    <Col span={12}>
                      <Text type="secondary">Seats</Text>
                      <Text strong>{` : ${booking.seats.join(' , ')}`}</Text>
                    </Col>
                    <Col span={12}>
                      <Text type="secondary">Amount : </Text>
                      <Text strong style={{ color: '#52c41a' }}>₹{booking.amount}</Text>
                    </Col>
                  </Row>

                  <Tag color="green" style={{ marginTop: '8px' }}>
                    {booking.status?.toUpperCase()}
                  </Tag>

                  <Space style={{ marginTop: '8px' }}>
                    <Button size="small">View Details</Button>
                    <Button size="small">Download Ticket</Button>
                  </Space>
                </Space>
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  );

  // ✅ Return JSX here
  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Navbar />
      <Content style={{ marginTop: 64, padding: isMobile ? '16px' : '20px' }}>
        <Card style={{ borderRadius: '16px' }}>
          <Tabs defaultActiveKey="bookings" size={isMobile ? 'small' : 'large'}>
            <Tabs.TabPane tab={<span>My Bookings</span>} key="bookings">
              <BookingsTab />
            </Tabs.TabPane>
          </Tabs>
        </Card>
      </Content>
    </Layout>
  );
}

export default BookingHistory;
