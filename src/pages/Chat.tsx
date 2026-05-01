import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Stack, 
  Input, 
  Button, 
  Flex, 
  Text, 
  Icon, 
  VStack, 
  HStack,
  Avatar,
  Card,
  Spinner
} from '@chakra-ui/react';
import { Send, BrainCircuit, User, Bot } from 'lucide-react';
import { chatWithAi } from '../services/geminiService';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export default function Chat() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      role: 'model', 
      text: 'Hello! I am your AI Study Assistant. You can ask me questions about your subjects, request explanations, or just chat about your learning progress. How can I help you today?', 
      timestamp: Date.now() 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const aiResponse = await chatWithAi(input, history);
      
      const modelMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: aiResponse,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error(error);
      alert('Failed to get AI response. Please check your setup.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex direction="column" h="calc(100vh - 150px)" bg="white" p="4" borderRadius="2xl" shadow="sm">
      <Box flex="1" overflowY="auto" p="4" gap="4" hideScrollbar ref={scrollRef}>
        <VStack align="stretch" gap="6">
          {messages.map((msg) => (
            <HStack 
              key={msg.id} 
              alignSelf={msg.role === 'user' ? 'flex-end' : 'flex-start'} 
              maxW="80%" 
              gap="3"
            >
              {msg.role === 'model' && (
                <Avatar.Root size="sm">
                  <Avatar.Fallback bg="brand.500" color="white">
                    <Icon as={Bot} />
                  </Avatar.Fallback>
                </Avatar.Root>
              )}
              <Box 
                bg={msg.role === 'user' ? 'brand.500' : 'gray.100'} 
                color={msg.role === 'user' ? 'white' : 'gray.800'}
                p="4" 
                borderRadius="2xl"
                borderBottomRightRadius={msg.role === 'user' ? '4px' : '2xl'}
                borderTopLeftRadius={msg.role === 'model' ? '4px' : '2xl'}
                boxShadow="sm"
              >
                <Text fontSize="md" whiteSpace="pre-wrap">{msg.text}</Text>
              </Box>
              {msg.role === 'user' && (
                <Avatar.Root size="sm">
                  <Avatar.Fallback bg="gray.300">
                    <Avatar.Image src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} />
                  </Avatar.Fallback>
                </Avatar.Root>
              )}
            </HStack>
          ))}
          {isLoading && (
            <HStack alignSelf="flex-start" gap="3">
              <Avatar.Root size="sm">
                <Avatar.Fallback bg="brand.500" color="white">
                  <Icon as={Bot} />
                </Avatar.Fallback>
              </Avatar.Root>
              <Box bg="gray.100" p="4" borderRadius="2xl" borderTopLeftRadius="4px">
                <Spinner size="sm" color="brand.500" />
              </Box>
            </HStack>
          )}
        </VStack>
      </Box>

      <Box pt="4" borderTop="1px" borderColor="gray.100">
        <HStack gap="3">
          <Input 
            placeholder={t('placeholder')} 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            h="50px"
            borderRadius="full"
            bg="gray.50"
            border="none"
            _focus={{ bg: 'white', ring: '1px', ringColor: 'brand.500' }}
          />
          <Button 
            bg="brand.500" 
            color="white" 
            borderRadius="full" 
            boxSize="50px" 
            p="0"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
          >
            <Icon as={Send} size="20" />
          </Button>
        </HStack>
      </Box>
    </Flex>
  );
}
