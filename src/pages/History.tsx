import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  Stack, 
  HStack, 
  Icon, 
  Button,
  Card,
  Input,
  Flex,
  Portal,
  Badge,
  Grid,
  DialogRoot,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogCloseTrigger,
  DialogFooter
} from '@chakra-ui/react';
import { 
  Search, 
  Zap, 
  BookOpen, 
  Brain, 
  Calendar,
  Trash2,
  ChevronRight,
  History as HistoryIcon
} from 'lucide-react';
import { getHistory, clearHistory } from '../utils/historyService';
import { StudyResult } from '../services/geminiService';

export default function History() {
  const [history, setHistory] = useState<StudyResult[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<StudyResult | null>(null);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const filteredHistory = history.filter(item => 
    item.input.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.output.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear all history? This action cannot be undone.')) {
      clearHistory();
      setHistory([]);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'summarize': return Zap;
      case 'quiz': return BookOpen;
      case 'explain': return Brain;
      default: return HistoryIcon;
    }
  };

  return (
    <Stack gap="8">
      <Flex justify="space-between" align="center" wrap="wrap" gap="4">
        <Box>
          <Heading size="2xl" mb="2">Study History</Heading>
          <Text color="gray.600">Review and revisit all your previous AI-powered study sessions.</Text>
        </Box>
        <Button 
          variant="outline" 
          color="red.500" 
          borderColor="red.200"
          _hover={{ bg: 'red.50' }}
          onClick={handleClearHistory}
          gap="2"
        >
          <Icon as={Trash2} size="16" /> Clear History
        </Button>
      </Flex>

      <HStack bg="white" p="2" borderRadius="xl" shadow="sm" border="1px" borderColor="gray.100">
        <Icon as={Search} ml="3" color="gray.400" />
        <Input 
          placeholder="Search through your notes and results..." 
          border="none"
          _focus={{ ring: 0 }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </HStack>

      {filteredHistory.length > 0 ? (
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' }} gap="6">
          {filteredHistory.map((item) => (
            <Card.Root 
              key={item.id} 
              p="6" 
              cursor="pointer" 
              _hover={{ shadow: 'md', transform: 'translateY(-2px)' }} 
              transition="all 0.2s"
              onClick={() => setSelectedItem(item)}
              border="none"
              shadow="sm"
            >
              <Card.Body p="0">
                <Stack gap="4">
                  <HStack justify="space-between">
                    <Box p="2" bg="brand.50" borderRadius="lg">
                      <Icon as={getIcon(item.type)} color="brand.500" size="20" />
                    </Box>
                    <HStack color="gray.500" fontSize="xs">
                      <Icon as={Calendar} size="12" />
                      <Text>{new Date(item.timestamp).toLocaleDateString()}</Text>
                    </HStack>
                  </HStack>
                  
                  <Stack gap="2">
                    <Text fontWeight="bold" fontSize="lg" noOfLines={2}>
                      {item.input.substring(0, 100)}...
                    </Text>
                    <Text fontSize="sm" color="gray.600" noOfLines={3}>
                      {item.output.substring(0, 150)}...
                    </Text>
                  </Stack>

                  <HStack justify="space-between" mt="2">
                    <Badge colorPalette={item.type === 'summarize' ? 'orange' : item.type === 'quiz' ? 'blue' : 'green'}>
                      {item.type.toUpperCase()}
                    </Badge>
                    <Icon as={ChevronRight} size="16" color="brand.500" />
                  </HStack>
                </Stack>
              </Card.Body>
            </Card.Root>
          ))}
        </Grid>
      ) : (
        <Flex direction="column" align="center" py="20" gap="4">
          <Icon as={HistoryIcon} size="64" color="gray.200" />
          <Text color="gray.500" fontSize="lg">No history found matching your search.</Text>
        </Flex>
      )}

      {/* Detail View Modal/Dialog */}
      {selectedItem && (
        <DialogRoot open={!!selectedItem} onOpenChange={() => setSelectedItem(null)} size="lg">
          <Portal>
            <DialogContent borderRadius="2xl">
              <DialogHeader borderBottom="1px" borderColor="gray.100" pb="4">
                <HStack gap="4">
                  <Box p="2" bg="brand.50" borderRadius="lg">
                    <Icon as={getIcon(selectedItem.type)} color="brand.500" size="24" />
                  </Box>
                  <Stack gap="0">
                    <DialogTitle>{selectedItem.type.charAt(0) + selectedItem.type.slice(1)} Result</DialogTitle>
                    <Text fontSize="xs" color="gray.500">{new Date(selectedItem.timestamp).toLocaleString()}</Text>
                  </Stack>
                </HStack>
              </DialogHeader>
              <DialogBody py="6">
                <Stack gap="8">
                  <Box>
                    <Text fontWeight="bold" color="gray.400" fontSize="xs" textTransform="uppercase" mb="2">Original Input</Text>
                    <Box p="4" bg="gray.50" borderRadius="lg" fontSize="sm" maxHeight="150px" overflowY="auto">
                      {selectedItem.input}
                    </Box>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" color="gray.400" fontSize="xs" textTransform="uppercase" mb="2">AI Response</Text>
                    <Box whiteSpace="pre-wrap" fontSize="md">
                      {selectedItem.output}
                    </Box>
                  </Box>
                </Stack>
              </DialogBody>
              <DialogFooter>
                <Button bg="brand.500" color="white" onClick={() => setSelectedItem(null)}>Close</Button>
              </DialogFooter>
              <DialogCloseTrigger />
            </DialogContent>
          </Portal>
        </DialogRoot>
      )}
    </Stack>
  );
}

// Grid for v3
// (Removed duplicate import)
