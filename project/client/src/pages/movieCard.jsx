import React, { useState, useEffect } from 'react';
import { Layout, Button, Space, Typography, Card, Row, Col } from 'antd';
import { getAllMovies } from '../calls/movieCalls.js';

const { Content } = Layout;
const { Title, Text } = Typography;

export default function MovieCard() {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await getAllMovies();
                // assuming backend returns { success, movies: [...] }
                setMovies(response.movies || []);
            } catch (error) {
                console.error('Error fetching movies:', error);
            }
        };

        fetchMovies();
    }, []);

    return (
        <Content style={{ marginTop: 64, padding: '10px' }}>
            <div style={{ maxWidth: '1450px', margin: '10px' }}>
                <div
                    style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        padding: '1px',
                        borderRadius: '12px',
                        marginBottom: '2px',
                        color: '#fff',
                    }}
                >
                    <Title level={2} style={{ color: '#fff', marginBottom: '1px' }}>
                        Welcome,
                    </Title>
                    <Text style={{ fontSize: '16px', color: '#fff' }}>
                        Book tickets for the latest movies, events, plays, and sports activities
                    </Text>
                </div>

                <Title level={3} style={{ marginBottom: '1px' }}>
                    Recommended Movies
                </Title>

                <Row gutter={[16, 16]}>
                    {movies.map((movie) => (
                        <Col xs={24} sm={12} md={4} key={movie._id || movie.id}>
                            <Card
                                hoverable
                                cover={
                                    <img
                                        alt={movie.title}
                                        src={movie.posterURL}
                                        style={{
                                            width: "100%",
                                            height: "auto",          
                                            objectFit: "contain",   
                                            borderTopLeftRadius: "1px",
                                            borderTopRightRadius: "1px"

                                        }}
                                    />
                                }
                                style={{ borderRadius: '8px', overflow: 'hidden' }}
                            >
                                <Card.Meta
                                    title={movie.title}
                                    description={
                                        <Space orientation="vertical" size="small">
                                            <Text type="secondary">{movie.genre}</Text>
                                            <Text strong>⭐ {movie.rating}</Text>
                                        </Space>
                                    }
                                />
                                <Button
                                    type="primary"
                                    block
                                    style={{ marginTop: '2px', background: '#f84464', borderColor: '#f84464' }}
                                >
                                    Book Now
                                </Button>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        </Content>
    );
}
