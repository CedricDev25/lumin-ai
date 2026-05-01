import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Flex, 
  Heading, 
  Input, 
  Stack, 
  Text, 
  Link as ChakraLink,
  Icon,
  Card,
  Field
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { BrainCircuit, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simplified login for demo
    login(email, 'Demo User');
    navigate('/');
  };

  return (
    <Flex h="100vh" align="center" justify="center" bg="gray.50">
      <Stack gap="8" w="full" maxW="400px" px="6">
        <Stack align="center" gap="2">
          <Box bg="brand.500" p="3" borderRadius="xl">
            <Icon as={BrainCircuit} color="white" size="32" />
          </Box>
          <Heading size="3xl" fontWeight="bold" color="brand.600">Lumina AI</Heading>
          <Text color="gray.600">Welcome back! Please login to your account.</Text>
        </Stack>

        <Card.Root p="8" shadow="xl" borderRadius="2xl">
          <Card.Body>
            <form onSubmit={handleSubmit}>
              <Stack gap="4">
                <Field.Root>
                  <Field.Label>Email address</Field.Label>
                  <Input 
                    type="email" 
                    placeholder="you@email.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Field.Root>
                <Field.Root>
                  <Field.Label>Password</Field.Label>
                  <Input 
                    type="password" 
                    placeholder="********" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Field.Root>
                <Button 
                  type="submit" 
                  bg="brand.500" 
                  color="white" 
                  _hover={{ bg: 'brand.600' }}
                  size="lg"
                  w="full"
                  mt="4"
                >
                  Sign in
                </Button>
              </Stack>
            </form>
          </Card.Body>
        </Card.Root>

        <Text textAlign="center" color="gray.600">
          Don't have an account?{' '}
          <Link to="/signup">
            <Text as="span" color="brand.500" fontWeight="bold" cursor="pointer">
              Sign up
            </Text>
          </Link>
        </Text>
      </Stack>
    </Flex>
  );
}
