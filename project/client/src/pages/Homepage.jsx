import React from 'react';
import { Layout } from 'antd';
import Navbar from '../pages/Navbar';
import MovieCard from '../pages/movieCard';
import Profile from '../pages/Profile';

const { Content } = Layout;

function Homepage() {
  return (
    <Layout>
      <Navbar />
      <Content>
        <MovieCard />
      </Content>
    </Layout>
  );
}

export default Homepage;
