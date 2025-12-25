// src/pages/SeatSelection.jsx - Interactive Seat Selection
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {Layout, Card, Row, Col, Typography, Button, Space, Tag, Divider,message, Modal} from 'antd';
import {ArrowLeftOutlined, CheckCircleFilled, MinusCircleFilled,CloseCircleFilled} from '@ant-design/icons';
import Navbar from './Navbar';

const { Content } = Layout;
const { Title, Text } = Typography;

function SeatSelection() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theatre, show, movie, date } = location.state || {};
  
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (!theatre || !show || !movie) {
      message.error('Invalid booking details');
      navigate('/home');
      return;
    }

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Generate seat layout
  const generateSeats = () => {
    const sections = [
      { name: 'Premium', rows: 3, cols: 16, price: show.price + 100, type: 'premium' },
      { name: 'Regular', rows: 6, cols: 16, price: show.price, type: 'regular' },
      { name: 'Economy', rows: 4, cols: 18, price: show.price - 50, type: 'economy' }
    ];

    return sections.map(section => {
      const seats = [];
      for (let row = 0; row < section.rows; row++) {
        const rowSeats = [];
        const rowLetter = String.fromCharCode(65 + row + (section.name === 'Regular' ? 3 : section.name === 'Economy' ? 9 : 0));
        
        for (let col = 1; col <= section.cols; col++) {
          const seatNumber = `${rowLetter}${col}`;
          const isBooked = Math.random() < 0.15; // 15% random booked seats
          
          rowSeats.push({
            id: seatNumber,
            number: seatNumber,
            status: isBooked ? 'booked' : 'available',
            type: section.type,
            price: section.price
          });
        }
        seats.push(rowSeats);
      }
      return { ...section, seats };
    });
  };

  const [seatLayout] = useState(generateSeats());

  const handleSeatClick = (seat) => {
    if (seat.status === 'booked') {
      message.warning('This seat is already booked');
      return;
    }

    if (selectedSeats.find(s => s.id === seat.id)) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
    } else {
      if (selectedSeats.length >= 10) {
        message.warning('Maximum 10 seats can be selected');
        return;
      }
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const calculateTotal = () => {
    return selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  };

  const handleProceedToPayment = () => {
    if (selectedSeats.length === 0) {
      message.warning('Please select at least one seat');
      return;
    }

    navigate('/payment', {
      state: {
        theatre,
        show,
        movie,
        date,
        selectedSeats,
        totalAmount: calculateTotal()
      }
    });
  };

  const getSeatColor = (seat) => {
    if (selectedSeats.find(s => s.id === seat.id)) return '#52c41a';
    if (seat.status === 'booked') return '#d9d9d9';
    if (seat.type === 'premium') return '#722ed1';
    if (seat.type === 'regular') return '#1890ff';
    return '#fa8c16';
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Navbar />
      <Content style={{ marginTop: 64, padding: isMobile ? '16px' : '20px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            style={{ marginBottom: '20px' }}
            size="large"
          >
            Back
          </Button>

          {/* Movie & Show Info */}
          <Card style={{ borderRadius: '12px', marginBottom: '24px' }}>
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} md={18}>
                <Space direction={isMobile ? 'vertical' : 'horizontal'} size="large">
                  <div>
                    <Title level={4} style={{ margin: 0 }}>{movie.title}</Title>
                    <Text type="secondary">{theatre.name}</Text>
                  </div>
                  <Divider type={isMobile ? 'horizontal' : 'vertical'} />
                  <Space direction="vertical" size="small">
                    <Text>{date}</Text>
                    <Text strong>{show.time}</Text>
                    <Tag color="purple">{show.format}</Tag>
                  </Space>
                </Space>
              </Col>
              <Col xs={24} md={6} style={{ textAlign: isMobile ? 'left' : 'right' }}>
                <Space direction="vertical" size="small">
                  <Text type="secondary">Selected Seats</Text>
                  <Title level={3} style={{ margin: 0, color: '#52c41a' }}>
                    {selectedSeats.length}
                  </Title>
                </Space>
              </Col>
            </Row>
          </Card>

          {/* Legend */}
          <Card style={{ borderRadius: '12px', marginBottom: '24px' }}>
            <Space wrap size="large">
              <Space>
                <CheckCircleFilled style={{ fontSize: '20px', color: '#52c41a' }} />
                <Text>Selected</Text>
              </Space>
              <Space>
                <MinusCircleFilled style={{ fontSize: '20px', color: '#722ed1' }} />
                <Text>Premium (₹{show.price + 100})</Text>
              </Space>
              <Space>
                <MinusCircleFilled style={{ fontSize: '20px', color: '#1890ff' }} />
                <Text>Regular (₹{show.price})</Text>
              </Space>
              <Space>
                <MinusCircleFilled style={{ fontSize: '20px', color: '#fa8c16' }} />
                <Text>Economy (₹{show.price - 50})</Text>
              </Space>
              <Space>
                <CloseCircleFilled style={{ fontSize: '20px', color: '#d9d9d9' }} />
                <Text>Booked</Text>
              </Space>
            </Space>
          </Card>

          {/* Seat Layout */}
          <Card style={{ borderRadius: '12px', marginBottom: '24px', overflow: 'auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff',
                  padding: '12px',
                  borderRadius: '8px',
                  maxWidth: '600px',
                  margin: '0 auto',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                🎬 SCREEN THIS WAY 🎬
              </div>
            </div>

            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {seatLayout.map((section, sectionIdx) => (
                <div key={sectionIdx}>
                  <Title level={5} style={{ marginBottom: '16px', color: '#667eea' }}>
                    {section.name} - ₹{section.price}
                  </Title>
                  
                  <div style={{ overflowX: 'auto' }}>
                    <div style={{ minWidth: isMobile ? '600px' : 'auto' }}>
                      {section.seats.map((row, rowIdx) => (
                        <div
                          key={rowIdx}
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginBottom: '8px',
                            gap: '6px'
                          }}
                        >
                          {row.map((seat, seatIdx) => (
                            <button
                              key={seatIdx}
                              onClick={() => handleSeatClick(seat)}
                              disabled={seat.status === 'booked'}
                              style={{
                                width: '32px',
                                height: '32px',
                                border: 'none',
                                borderRadius: '6px 6px 0 0',
                                background: getSeatColor(seat),
                                cursor: seat.status === 'booked' ? 'not-allowed' : 'pointer',
                                fontSize: '10px',
                                color: '#fff',
                                fontWeight: 'bold',
                                transition: 'all 0.2s',
                                opacity: seat.status === 'booked' ? 0.5 : 1
                              }}
                            >
                              {seat.number}
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {sectionIdx < seatLayout.length - 1 && (
                    <Divider style={{ margin: '20px 0' }} />
                  )}
                </div>
              ))}
            </Space>
          </Card>

          {/* Bottom Bar - Selected Seats & Payment */}
          <Card
            style={{
              position: 'sticky',
              bottom: 0,
              borderRadius: '12px',
              boxShadow: '0 -4px 12px rgba(0,0,0,0.1)',
              zIndex: 100
            }}
          >
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} md={12}>
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <Text strong>Selected Seats ({selectedSeats.length})</Text>
                  {selectedSeats.length > 0 ? (
                    <Space wrap>
                      {selectedSeats.map(seat => (
                        <Tag
                          key={seat.id}
                          closable
                          onClose={() => handleSeatClick(seat)}
                          color="green"
                        >
                          {seat.number}
                        </Tag>
                      ))}
                    </Space>
                  ) : (
                    <Text type="secondary">No seats selected</Text>
                  )}
                </Space>
              </Col>
              
              <Col xs={24} md={12}>
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text strong>Total Amount:</Text>
                    <Title level={3} style={{ margin: 0, color: '#52c41a' }}>
                      ₹{calculateTotal()}
                    </Title>
                  </div>
                  <Button
                    type="primary"
                    size="large"
                    block
                    onClick={handleProceedToPayment}
                    disabled={selectedSeats.length === 0}
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      height: '48px',
                      fontSize: '16px',
                      fontWeight: 'bold'
                    }}
                  >Proceed to Payment
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

export default SeatSelection;