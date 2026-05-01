import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Grid, 
  Heading, 
  Text, 
  Stack, 
  HStack, 
  Icon, 
  Button,
  Card,
  Badge,
  Flex,
  IconButton
} from '@chakra-ui/react';
import { 
  Zap, 
  BookOpen, 
  Clock, 
  ChevronRight,
  TrendingUp,
  Brain
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getHistory } from '../utils/historyService';
import { StudyResult } from '../services/geminiService';
import { useLanguage } from '../context/LanguageContext';

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [recentHistory, setRecentHistory] = useState<StudyResult[]>([]);

  useEffect(() => {
    const history = getHistory();
    setRecentHistory(history.slice(0, 3));
  }, []);

  const stats = [
    { label: 'Total Sessions', value: getHistory().length, icon: Brain, color: 'blue.500' },
    { label: 'AI Summaries', value: getHistory().filter(h => h.type === 'summarize').length, icon: Zap, color: 'orange.500' },
    { label: 'Practice Quizzes', value: getHistory().filter(h => h.type === 'quiz').length, icon: BookOpen, color: 'green.500' },
  ];

  return (
    <Stack gap="8">
      <Box>
        <Heading size="2xl" mb="2">{t('welcome')}, {user?.name} 👋</Heading>
        <Text color="gray.600">Here's what's happening with your study sessions today.</Text>
      </Box>

      <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap="6">
        {stats.map((stat, i) => (
          <Card.Root key={i} border="none" shadow="sm">
            <Card.Body>
              <HStack justify="space-between" align="start">
                <Stack gap="1">
                  <Text color="gray.500" fontSize="sm" fontWeight="medium">{stat.label}</Text>
                  <Heading size="3xl">{stat.value}</Heading>
                </Stack>
                <Box p="3" bg={`${stat.color.split('.')[0]}.50`} borderRadius="xl">
                  <Icon as={stat.icon} color={stat.color} size="24" />
                </Box>
              </HStack>
            </Card.Body>
          </Card.Root>
        ))}
      </Grid>

      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap="8">
        <Stack gap="6">
          <HStack justify="space-between">
            <Heading size="xl">Recent History</Heading>
            <Link to="/history">
              <Button variant="ghost" size="sm" color="brand.500">View All</Button>
            </Link>
          </HStack>

          {recentHistory.length > 0 ? (
            <Stack gap="4">
              {recentHistory.map((item) => (
                <Card.Root key={item.id} variant="outline" _hover={{ shadow: 'sm', borderColor: 'brand.500' }} transition="all 0.2s">
                  <Card.Body>
                    <HStack gap="4">
                      <Box p="2" bg="brand.50" borderRadius="lg">
                        <Icon 
                          as={item.type === 'summarize' ? Zap : item.type === 'quiz' ? BookOpen : Brain} 
                          color="brand.500" 
                        />
                      </Box>
                      <Stack gap="0" flex="1">
                        <Text fontWeight="bold" noOfLines={1}>
                          {item.input.substring(0, 60)}...
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {new Date(item.timestamp).toLocaleDateString()} • {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        </Text>
                      </Stack>
                      <Link to="/history">
                        <IconButton aria-label="View" variant="ghost" size="sm">
                          <Icon as={ChevronRight} />
                        </IconButton>
                      </Link>
                    </HStack>
                  </Card.Body>
                </Card.Root>
              ))}
            </Stack>
          ) : (
            <Card.Root variant="subtle" p="8" textAlign="center">
              <Card.Body>
                <Stack align="center" gap="4">
                  <Icon as={Clock} size="40" color="gray.300" />
                  <Text color="gray.500">No recent activity. Start studying with Lumina AI!</Text>
                  <Link to="/ai-tools">
                    <Button bg="brand.500" color="white" _hover={{ bg: 'brand.600' }}>Try AI Tools</Button>
                  </Link>
                </Stack>
              </Card.Body>
            </Card.Root>
          )}
        </Stack>

        <Stack gap="6">
          <Heading size="xl">Study Tips</Heading>
          <Card.Root bg="brand.500" color="white" border="none">
            <Card.Body>
              <Stack gap="4">
                <Icon as={TrendingUp} size="32" />
                <Text fontWeight="bold" fontSize="lg">Active Recall</Text>
                <Text fontSize="sm" opacity="0.9">
                  Don't just read your notes. Use our Quiz Generator to test your knowledge! Testing yourself is 3x more effective than passive reading.
                </Text>
                <Button bg="white" color="brand.600" size="sm" _hover={{ bg: 'gray.100' }}>Learn More</Button>
              </Stack>
            </Card.Body>
          </Card.Root>
        </Stack>
      </Grid>
    </Stack>
  );
}
