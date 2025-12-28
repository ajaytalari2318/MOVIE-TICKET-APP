import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Layout, Card, Row, Col, Typography, Button, Space, Radio, Input,
  Form, Divider, message, Modal, Spin
} from 'antd';
import {
  ArrowLeftOutlined, CreditCardOutlined, WalletOutlined,
  BankOutlined, MobileOutlined, SafetyOutlined, CheckCircleOutlined
} from '@ant-design/icons';
import Navbar from './Navbar';
import dayjs from 'dayjs';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theatre, show, movie, date, selectedSeats, totalAmount } = location.state || {};
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (!theatre || !show || !movie || !selectedSeats) {
      message.error('Invalid booking details');
      navigate('/home');
      return;
    }

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const convenienceFee = Math.round(totalAmount * 0.02); // 2% convenience fee
  const gst = Math.round((totalAmount + convenienceFee) * 0.18); // 18% GST
  const grandTotal = totalAmount + convenienceFee + gst;

  const handlePayment = async (values) => {
    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      
      const bookingId = `BMS${Date.now()}`;
      
      Modal.success({
        title: 'Booking Confirmed! 🎉',
        content: (
          <Space direction="vertical" size="large" style={{ width: '100%', marginTop: '20px' }}>
            <div style={{ textAlign: 'center' }}>
              <CheckCircleOutlined style={{ fontSize: '64px', color: '#52c41a' }} />
            </div>
            
            <Card style={{ background: '#f6ffed', border: '1px solid #b7eb8f' }}>
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Text strong style={{ fontSize: '16px' }}>Booking ID: {bookingId}</Text>
                <Divider style={{ margin: '8px 0' }} />
                <Text>{movie.title}</Text>
                <Text type="secondary">{theatre.name}</Text>
                <Text type="secondary">{date} | {show.time}</Text>
                <Text type="secondary">Seats: {selectedSeats.map(s => s.number).join(', ')}</Text>
              </Space>
            </Card>

            <Paragraph style={{ textAlign: 'center', marginBottom: 0 }}>
              Your tickets have been sent to your email.
              <br />
              Enjoy your movie! 🍿
            </Paragraph>
          </Space>
        ),
        okText: 'View Booking',
        width: isMobile ? '95%' : 500,
        onOk: () => {
          // Store booking in localStorage (replace with actual API call)
          const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
          bookings.push({
            bookingId,
            movie: movie.title,
            theatre: theatre.name,
            date,
            time: show.time,
            seats: selectedSeats.map(s => s.number),
            amount: grandTotal,
            status: 'confirmed',
            createdAt: new Date().toISOString()
          });
          localStorage.setItem('bookings', JSON.stringify(bookings));
          navigate('/user-profile');
        }
      });
    }, 2500);
  };

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: <CreditCardOutlined style={{ fontSize: '24px' }} />,
      description: 'Visa, Mastercard, Amex'
    },
    {
      id: 'upi',
      name: 'UPI',
      icon: <MobileOutlined style={{ fontSize: '24px' }} />,
      description: 'Google Pay, PhonePe, Paytm'
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: <BankOutlined style={{ fontSize: '24px' }} />,
      description: 'All major banks'
    },
    {
      id: 'wallet',
      name: 'Wallet',
      icon: <WalletOutlined style={{ fontSize: '24px' }} />,
      description: 'Paytm, PhonePe, Amazon Pay'
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Navbar />
      <Content style={{ marginTop: 64, padding: isMobile ? '16px' : '20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            style={{ marginBottom: '20px' }}
            size="large"
          >
            Back
          </Button>

          <Row gutter={[24, 24]}>
            {/* Payment Methods */}
            <Col xs={24} md={14}>
              <Card style={{ borderRadius: '12px', marginBottom: '24px' }}>
                <Title level={4}>Select Payment Method</Title>
                
                <Radio.Group
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    {paymentMethods.map(method => (
                      <Card
                        key={method.id}
                        hoverable
                        style={{
                          border: paymentMethod === method.id ? '2px solid #667eea' : '1px solid #e0e0e0',
                          borderRadius: '8px'
                        }}
                        bodyStyle={{ padding: '16px' }}
                      >
                        <Radio value={method.id} style={{ width: '100%' }}>
                          <Space size="middle">
                            {method.icon}
                            <div>
                              <Text strong style={{ display: 'block' }}>{method.name}</Text>
                              <Text type="secondary" style={{ fontSize: '12px' }}>
                                {method.description}
                              </Text>
                            </div>
                          </Space>
                        </Radio>
                      </Card>
                    ))}
                  </Space>
                </Radio.Group>
              </Card>

              {/* Payment Form */}
              <Card style={{ borderRadius: '12px' }}>
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handlePayment}
                >
                  {paymentMethod === 'card' && (
                    <>
                      <Form.Item
                        name="cardNumber"
                        label="Card Number"
                        rules={[{ required: true, message: 'Please enter card number' }]}
                      >
                        <Input
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          size="large"
                        />
                      </Form.Item>

                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item
                            name="expiry"
                            label="Expiry Date"
                            rules={[{ required: true, message: 'Required' }]}
                          >
                            <Input placeholder="MM/YY" maxLength={5} size="large" />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            name="cvv"
                            label="CVV"
                            rules={[{ required: true, message: 'Required' }]}
                          >
                            <Input.Password placeholder="123" maxLength={3} size="large" />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Form.Item
                        name="cardName"
                        label="Cardholder Name"
                        rules={[{ required: true, message: 'Please enter name on card' }]}
                      >
                        <Input placeholder="John Doe" size="large" />
                      </Form.Item>
                    </>
                  )}

                  {paymentMethod === 'upi' && (
                    <Form.Item
                      name="upiId"
                      label="UPI ID"
                      rules={[
                        { required: true, message: 'Please enter UPI ID' },
                        { pattern: /^[\w.-]+@[\w.-]+$/, message: 'Invalid UPI ID' }
                      ]}
                    >
                      <Input
                        placeholder="yourname@upi"
                        size="large"
                        suffix={<MobileOutlined />}
                      />
                    </Form.Item>
                  )}

                  {paymentMethod === 'netbanking' && (
                    <Form.Item
                      name="bank"
                      label="Select Bank"
                      rules={[{ required: true, message: 'Please select a bank' }]}
                    >
                      <Radio.Group style={{ width: '100%' }}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                          <Radio value="hdfc">HDFC Bank</Radio>
                          <Radio value="icici">ICICI Bank</Radio>
                          <Radio value="sbi">State Bank of India</Radio>
                          <Radio value="axis">Axis Bank</Radio>
                        </Space>
                      </Radio.Group>
                    </Form.Item>
                  )}

                  {paymentMethod === 'wallet' && (
                    <Form.Item
                      name="wallet"
                      label="Select Wallet"
                      rules={[{ required: true, message: 'Please select a wallet' }]}
                    >
                      <Radio.Group style={{ width: '100%' }}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                          <Radio value="paytm">Paytm</Radio>
                          <Radio value="phonepe">PhonePe</Radio>
                          <Radio value="amazonpay">Amazon Pay</Radio>
                          <Radio value="mobikwik">MobiKwik</Radio>
                        </Space>
                      </Radio.Group>
                    </Form.Item>
                  )}

                  <Divider />

                  <Space direction="vertical" size="small" style={{ width: '100%', marginBottom: '16px' }}>
                    <Space>
                      <SafetyOutlined style={{ color: '#52c41a' }} />
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        Your payment information is secure and encrypted
                      </Text>
                    </Space>
                  </Space>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      block
                      loading={processing}
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        height: '56px',
                        fontSize: '18px',
                        fontWeight: 'bold'
                      }}
                    >
                      {processing ? 'Processing Payment...' : `Pay ₹${grandTotal}`}
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>

            {/* Booking Summary */}
            <Col xs={24} md={10}>
              <Card
                style={{
                  borderRadius: '12px',
                  position: isMobile ? 'relative' : 'sticky',
                  top: isMobile ? 0 : 84
                }}
              >
                <Title level={4}>Booking Summary</Title>
                
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  {/* Movie Info */}
                  <div>
                    <Text strong style={{ fontSize: '16px', display: 'block', marginBottom: '8px' }}>
                      {movie.title}
                    </Text>
                    <Text type="secondary" style={{ display: 'block' }}>
                      {movie.genre} | {movie.language}
                    </Text>
                  </div>

                  <Divider style={{ margin: '12px 0' }} />

                  {/* Theatre & Show Details */}
                  <div>
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text type="secondary">Theatre:</Text>
                        <Text strong>{theatre.name}</Text>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text type="secondary">Date:</Text>
                        <Text strong>{dayjs(date).format('DD MMM YYYY')}</Text>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text type="secondary">Time:</Text>
                        <Text strong>{show.time}</Text>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text type="secondary">Screen:</Text>
                        <Text strong>{show.screen}</Text>
                      </div>
                    </Space>
                  </div>

                  <Divider style={{ margin: '12px 0' }} />

                  {/* Seats */}
                  <div>
                    <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>
                      Selected Seats ({selectedSeats.length})
                    </Text>
                    <Space wrap>
                      {selectedSeats.map(seat => (
                        <Card
                          key={seat.id}
                          size="small"
                          style={{ textAlign: 'center', minWidth: '60px' }}
                        >
                          <Text strong>{seat.number}</Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: '11px' }}>
                            ₹{seat.price}
                          </Text>
                        </Card>
                      ))}
                    </Space>
                  </div>

                  <Divider style={{ margin: '12px 0' }} />

                  {/* Price Breakdown */}
                  <div>
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text>Ticket Price ({selectedSeats.length} seats)</Text>
                        <Text>₹{totalAmount}</Text>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text>Convenience Fee</Text>
                        <Text>₹{convenienceFee}</Text>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text>GST (18%)</Text>
                        <Text>₹{gst}</Text>
                      </div>
                    </Space>
                  </div>

                  <Divider style={{ margin: '12px 0' }} />

                  {/* Total */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '16px',
                      background: '#f0f5ff',
                      borderRadius: '8px'
                    }}
                  >
                    <Text strong style={{ fontSize: '18px' }}>Total Amount</Text>
                    <Title level={3} style={{ margin: 0, color: '#667eea' }}>
                      ₹{grandTotal}
                    </Title>
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Processing Overlay */}
        {processing && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999
            }}
          >
            <Card style={{ textAlign: 'center', borderRadius: '12px' }}>
              <Space direction="vertical" size="large">
                <Spin size="large" />
                <Title level={4} style={{ margin: 0 }}>Processing Payment...</Title>
                <Text type="secondary">Please do not close or refresh this page</Text>
              </Space>
            </Card>
          </div>
        )}
      </Content>
    </Layout>
  );
}

export default Payment;