import React, { useState } from 'react';
import { Modal, Form, Input, InputNumber, Switch, Row, Col, Button, Space, message } from 'antd';
import { ShopOutlined, EnvironmentOutlined, PhoneOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';

const AddTheatreModal = ({ visible, onCancel, onSuccess, userEmail }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const theatreData = {
        name: values.name,
        location: {
          address: values.address,
          city: values.city,
          state: values.state,
          country: values.country || 'India',
          pincode: values.pincode
        },
        totalScreens: values.totalScreens,
        facilities: {
          parking: values.parking || false,
          foodCourt: values.foodCourt || false,
          wheelchairAccess: values.wheelchairAccess || false
        },
        contact: {
          owner: values.owner,
          phone: values.phone,
          email: userEmail || values.email
        },
        status: 'pending'
      };

      const response = await fetch('https://bookmyshow-zklm.onrender.com/api/theatre/addTheatre', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(theatreData)
      });

      const data = await response.json();

      if (data.success) {
        message.success('Theatre request submitted successfully! Waiting for admin approval.');
        form.resetFields();
        onSuccess();
        onCancel();
      } else {
        message.error(data.message || 'Failed to submit theatre request');
      }
    } catch (error) {
      console.error('Error adding theatre:', error);
      message.error('Failed to submit theatre request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <Space>
          <ShopOutlined style={{ fontSize: '24px', color: '#667eea' }} />
          <span style={{ fontSize: '20px', fontWeight: 'bold' }}>Add New Theatre</span>
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ marginTop: '24px' }}
        initialValues={{
          country: 'India',
          parking: false,
          foodCourt: false,
          wheelchairAccess: false
        }}
      >
        {/* Theatre Name */}
        <Form.Item
          name="name"
          label="Theatre Name"
          rules={[{ required: true, message: 'Please enter theatre name' }]}
        >
          <Input
            size="large"
            placeholder="e.g., PVR Cinemas"
            prefix={<ShopOutlined />}
          />
        </Form.Item>

        {/* Location Details */}
        <div style={{ 
          background: '#f5f5f5', 
          padding: '16px', 
          borderRadius: '8px', 
          marginBottom: '16px' 
        }}>
          <h4 style={{ margin: '0 0 16px 0', color: '#667eea' }}>
            <EnvironmentOutlined /> Location Details
          </h4>

          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: 'Please enter address' }]}
          >
            <Input.TextArea
              rows={2}
              placeholder="Street address"
              size="large"
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="city"
                label="City"
                rules={[{ required: true, message: 'Required' }]}
              >
                <Input size="large" placeholder="e.g., Bangalore" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="state"
                label="State"
              >
                <Input size="large" placeholder="e.g., Karnataka" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="pincode"
                label="Pincode"
              >
                <Input size="large" placeholder="e.g., 560001" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="country" label="Country">
                <Input size="large" placeholder="India" />
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* Theatre Details */}
        <Form.Item
          name="totalScreens"
          label="Total Screens"
          rules={[
            { required: true, message: 'Please enter number of screens' },
            { type: 'number', min: 1, message: 'Must be at least 1' }
          ]}
        >
          <InputNumber
            size="large"
            style={{ width: '100%' }}
            min={1}
            placeholder="Number of screens"
          />
        </Form.Item>

        {/* Facilities */}
        <div style={{ 
          background: '#f5f5f5', 
          padding: '16px', 
          borderRadius: '8px', 
          marginBottom: '16px' 
        }}>
          <h4 style={{ margin: '0 0 16px 0', color: '#667eea' }}>Facilities</h4>
          
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Form.Item name="parking" valuePropName="checked" style={{ marginBottom: 0 }}>
                <Space>
                  <Switch />
                  <span>Parking</span>
                </Space>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="foodCourt" valuePropName="checked" style={{ marginBottom: 0 }}>
                <Space>
                  <Switch />
                  <span>Food Court</span>
                </Space>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="wheelchairAccess" valuePropName="checked" style={{ marginBottom: 0 }}>
                <Space>
                  <Switch />
                  <span>Wheelchair Access</span>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* Contact Information */}
        <div style={{ 
          background: '#f5f5f5', 
          padding: '16px', 
          borderRadius: '8px', 
          marginBottom: '16px' 
        }}>
          <h4 style={{ margin: '0 0 16px 0', color: '#667eea' }}>Contact Information</h4>

          <Form.Item
            name="owner"
            label="Owner Name"
            rules={[{ required: true, message: 'Please enter owner name' }]}
          >
            <Input
              size="large"
              placeholder="Owner/Manager name"
              prefix={<UserOutlined />}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Contact Phone"
                rules={[
                  { required: true, message: 'Required' },
                  { pattern: /^[0-9]{10}$/, message: 'Enter valid 10-digit number' }
                ]}
              >
                <Input
                  size="large"
                  placeholder="10-digit phone number"
                  prefix={<PhoneOutlined />}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Contact Email"
                rules={[
                  { type: 'email', message: 'Enter valid email' }
                ]}
              >
                <Input
                  size="large"
                  placeholder="Contact email"
                  prefix={<MailOutlined />}
                  disabled={!!userEmail}
                />
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* Submit Buttons */}
        <Form.Item style={{ marginBottom: 0, marginTop: '24px' }}>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button size="large" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              loading={loading}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none'
              }}
            >
              Submit Theatre Request
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddTheatreModal;