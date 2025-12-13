import React, { useState } from 'react';
import { Button, Checkbox, Input, message, Typography, Divider, Space } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined, FacebookOutlined, AppleOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom'

const { Title, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const navigate = useNavigate();
  const handleSubmit = async () => {
    if (!email || !password) {
      message.warning("Please fill all required fields!");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      message.error("Please enter a valid email!");
      return;
    }

    if (password.length < 6) {
      message.error("Password must be at least 6 characters!");
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const userData = { success: true, message: "Login successful!" };

      if (userData.success) {
        message.success(userData.message || "Login successful!");
        navigate('/home'); // ✅ redirect to home page
      } else {
        message.error(userData.message || "Login failed!");
      }

      console.log("Login values:", { email, password, remember });
    } catch (error) {
      console.error("Error:", error);
      message.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const handleSocialLogin = (provider) => {
    message.info(`${provider} login coming soon!`);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: '#fff',
        padding: '48px 40px',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        width: '100%',
        maxWidth: '440px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: '32px',
            color: '#fff',
            fontWeight: 'bold'
          }}>
            B
          </div>
          <Title level={2} style={{ margin: '0 0 8px 0' }}>
            Welcome Back
          </Title>
          <Text type="secondary">
            Sign in to continue to BookMyShow
          </Text>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <Input
              prefix={<UserOutlined style={{ color: '#999' }} />}
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size="large"
              style={{ borderRadius: '8px' }}
              onPressEnter={handleSubmit}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <Input.Password
              prefix={<LockOutlined style={{ color: '#999' }} />}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              size="large"
              style={{ borderRadius: '8px' }}
              onPressEnter={handleSubmit}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <Checkbox
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            >
              Remember me
            </Checkbox>
            <Button type="link" style={{ padding: 0, color: '#667eea' }}>
              Forgot password?

            </Button>

          </div>

          <Button
            type="primary"
            block
            loading={loading}
            onClick={handleSubmit}
            style={{
              height: '48px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            Sign In
          </Button>
        </div>

        <Divider style={{ margin: '24px 0' }}>
          <Text type="secondary" style={{ fontSize: '14px' }}>Or continue with</Text>
        </Divider>

        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Button
            block
            icon={<GoogleOutlined />}
            onClick={() => handleSocialLogin('Google')}
            style={{
              height: '48px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '15px'
            }}
          >
            Continue with Google
          </Button>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Button
              icon={<FacebookOutlined />}
              onClick={() => handleSocialLogin('Facebook')}
              style={{
                flex: 1,
                height: '48px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            />
            <Button
              icon={<AppleOutlined />}
              onClick={() => handleSocialLogin('Apple')}
              style={{
                flex: 1,
                height: '48px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            />
          </div>
        </Space>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Text type="secondary">
            Don't have an account?{' '}
            <Button type="link" style={{ padding: 0, color: '#667eea', fontWeight: '600' }}>
              <Link to="/register"> Sign up</Link>
            </Button>
          </Text>
        </div>
      </div>
    </div>
  );
};

export default Login;