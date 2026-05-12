import React, { useState, useEffect } from 'react';
import { Container, Stack, Avatar, Text, Loader, Center, Alert } from '@mantine/core';
import Service from '../../utils/http';
import { USER_PROFILE } from '../../utils/urls';

export default function ProfilePage() {
    const service = new Service();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUser = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await service.get(USER_PROFILE);
            setUser(response.data || response);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch user profile');
            console.error('Error fetching user:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    if (loading) {
        return (
            <Container>
                <Center h={300}>
                    <Loader />
                </Center>
            </Container>
        );
    }

    if (error || !user) {
        return (
            <Container>
                <Center h={300}>
                    <Alert title="Error" color="red">
                        {error || 'User not found'}
                    </Alert>
                </Center>
            </Container>
        );
    }

    return (
        <Container>
            <Stack
                h={300}
                bg="var(--mantine-color-body)"
                align="center"
                justify="center"
                gap="lg"
            >
                <Avatar src={user.avatar} size={150} radius={150} alt={user.name} />
                <Text fw={500} size="lg">{user.name}</Text>
                <Text c="dimmed">{user.email}</Text>
                <Text c="dimmed" size="sm">
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                </Text>
            </Stack>
        </Container>
    );
}
