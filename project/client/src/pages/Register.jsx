import React, { useState } from 'react';
import { Button, Checkbox, Input, message, Typography, Divider, Space } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, GoogleOutlined, FacebookOutlined, AppleOutlined } from '@ant-design/icons';
import {Link} from 'react-router-dom'
const { Title, Text } = Typography;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSubmit = async () => {
    // Validation
    if (!name || !email || !password || !confirmPassword) {
      message.warning("Please fill all required fields!");
      return;
    }

    if (name.length < 3) {
      message.error("Name must be at least 3 characters!");
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

    if (password !== confirmPassword) {
      message.error("Passwords do not match!");
      return;
    }

    if (!agreeTerms) {
      message.warning("Please agree to the Terms and Conditions!");
      return;
    }

    setLoading(true);
    try {
      // Simulating API call - replace with your actual register function
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // const response = await register({ name, email, password });
      // if (response && response.data) {
      //   const userData = response.data;
      //   if (userData.success) {
      //     message.success(userData.message || "Registration successful!");
      //     navigate('/login');
      //   } else {
      //     message.error(userData.message || "Registration failed!");
      //   }
      // }

      // Simulated response
      message.success("Registration successful! Redirecting to login...");
      console.log("Register values:", { name, email, password });
      
      // Uncomment to navigate after successful registration
      // setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      console.error("Error:", error);
      message.error("Unexpected error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialRegister = (provider) => {
    message.info(`${provider} registration coming soon!`);
  };

  return (
    <div style={{
      minHeight: '90vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '50px'
    }}>
      <div style={{
        background: '#fff',
        padding: '14px 14px',
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
            Create Account
          </Title>
          <Text type="secondary">
            Join BookMyShow today
          </Text>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <Input 
              prefix={<UserOutlined style={{ color: '#999' }} />}
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              size="large"
              style={{ borderRadius: '8px' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <Input 
              prefix={<MailOutlined style={{ color: '#999' }} />}
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size="large"
              style={{ borderRadius: '8px' }}
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
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <Input.Password 
              prefix={<LockOutlined style={{ color: '#999' }} />}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              size="large"
              style={{ borderRadius: '8px' }}
              onPressEnter={handleSubmit}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <Checkbox 
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
            >
              I agree to the{' '}
              <Button type="link" style={{ padding: 0, height: 'auto', color: '#667eea' }}>
                Terms and Conditions
              </Button>
            </Checkbox>
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
            Create Account
          </Button>
        </div>

        <Divider style={{ margin: '24px 0' }}>
          <Text type="secondary" style={{ fontSize: '14px' }}>Or sign up with</Text>
        </Divider>

        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Button 
            block 
            icon={<GoogleOutlined />}
            onClick={() => handleSocialRegister('Google')}
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
              onClick={() => handleSocialRegister('Facebook')}
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
              onClick={() => handleSocialRegister('Apple')}
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
            Already have an account?{' '}
            <Button type="link" style={{ padding: 0, color: '#667eea', fontWeight: '600' }}>
                <Link to="/login">Login here</Link> 
            </Button>
          </Text>
        </div>
      </div>
    </div>
  );
};

export default Register;