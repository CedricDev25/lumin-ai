import React, { useState, useRef } from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  Stack, 
  Textarea, 
  Button, 
  HStack, 
  Icon, 
  Card,
  Spinner,
  Flex,
  Grid,
  Separator,
  IconButton
} from '@chakra-ui/react';
import { 
  Zap, 
  BookOpen, 
  Brain, 
  Copy, 
  Share2,
  FileUp,
  FileText,
  X
} from 'lucide-react';
import { summarizeText, generateQuiz, explainSimply, StudyResult } from '../services/geminiService';
import { saveToHistory } from '../utils/historyService';
import { useLanguage } from '../context/LanguageContext';

const toaster = {
  success: (msg: string) => alert(msg),
  error: (msg: string) => alert(msg)
};

export default function AiTools() {
  const { t } = useLanguage();
  const [input, setInput] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeType, setActiveType] = useState<StudyResult['type'] | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/plain') {
      alert('Only .txt files are supported in this demo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInput(content);
      setFileName(file.name);
    };
    reader.readAsText(file);
  };

  const removeFile = () => {
    setFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setInput('');
  };

  const handleAction = async (type: StudyResult['type']) => {
    if (!input.trim()) {
      alert('Please enter some text or notes first.');
      return;
    }

    setIsLoading(true);
    setActiveType(type);
    setResult(null);

    try {
      let output = '';
      if (type === 'summarize') output = await summarizeText(input);
      else if (type === 'quiz') output = await generateQuiz(input);
      else if (type === 'explain') output = await explainSimply(input);

      setResult(output);
      
      // Save to history
      const studyResult: StudyResult = {
        id: Date.now().toString(),
        type,
        input,
        output,
        timestamp: Date.now()
      };
      saveToHistory(studyResult);
      toaster.success('AI generated successfully!');
    } catch (error) {
      console.error(error);
      toaster.error('Failed to generate. Please check your API key.');
      alert('Failed to generate. Make sure your GEMINI_API_KEY is set in the secrets panel.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      alert('Copied to clipboard!');
    }
  };

  return (
    <Stack gap="8" maxW="1000px" mx="auto">
      <Box>
        <Heading size="2xl" mb="2">AI Study Tools</Heading>
        <Text color="gray.600">Transform your notes into powerful learning materials in seconds.</Text>
      </Box>

      <Card.Root shadow="md" borderRadius="2xl" border="none">
        <Card.Body>
          <Stack gap="6">
            <Flex justify="space-between" align="center" wrap="wrap" gap="4">
              <Text fontWeight="semibold" fontSize="lg">{t('pasteNotes')}</Text>
              <Box>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  style={{ display: 'none' }} 
                  accept=".txt"
                />
                <Button 
                  variant="outline" 
                   borderColor="brand.500" 
                  color="brand.500" 
                  onClick={() => fileInputRef.current?.click()}
                  gap="2"
                  size="sm"
                >
                  <Icon as={FileUp} size="16" /> {t('uploadFile')}
                </Button>
              </Box>
            </Flex>

            {fileName && (
              <HStack bg="brand.50" p="3" borderRadius="xl" gap="3">
                <Icon as={FileText} color="brand.500" />
                <Text fontSize="sm" fontWeight="medium" flex="1">{fileName}</Text>
                <IconButton 
                  aria-label="Remove file" 
                  variant="ghost" 
                  size="xs" 
                   onClick={removeFile}
                >
                  <Icon as={X} />
                </IconButton>
              </HStack>
            )}

            <Textarea
              placeholder={t('placeholder')}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              minH="250px"
              borderRadius="xl"
              bg="gray.50"
              p="6"
              _focus={{ borderColor: 'brand.500', bg: 'white' }}
            />
            
            <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap="4">
              <Button 
                onClick={() => handleAction('summarize')}
                loading={isLoading && activeType === 'summarize'}
                bg="orange.500" 
                color="white"
                _hover={{ bg: 'orange.600' }}
                h="60px"
                borderRadius="xl"
                fontSize="md"
                gap="3"
                disabled={isLoading}
              >
                <Icon as={Zap} /> {t('summarize')}
              </Button>
              <Button 
                onClick={() => handleAction('quiz')}
                loading={isLoading && activeType === 'quiz'}
                bg="blue.500" 
                color="white"
                _hover={{ bg: 'blue.600' }}
                h="60px"
                borderRadius="xl"
                fontSize="md"
                gap="3"
                disabled={isLoading}
              >
                <Icon as={BookOpen} /> {t('quiz')}
              </Button>
              <Button 
                onClick={() => handleAction('explain')}
                loading={isLoading && activeType === 'explain'}
                bg="green.500" 
                color="white"
                _hover={{ bg: 'green.600' }}
                h="60px"
                borderRadius="xl"
                fontSize="md"
                gap="3"
                disabled={isLoading}
              >
                <Icon as={Brain} /> {t('explain')}
              </Button>
            </Grid>
          </Stack>
        </Card.Body>
      </Card.Root>

      {isLoading && (
        <Flex direction="column" align="center" gap="4" py="12">
          <Spinner size="xl" color="brand.500" thickness="4px" />
          <Text fontWeight="medium" color="gray.600">Lumina AI is thinking...</Text>
        </Flex>
      )}

      {result && (
        <Stack gap="6" animation="fade-in 0.5s ease-out">
          <HStack justify="space-between">
            <Heading size="xl">Result</Heading>
            <HStack gap="2">
              <Button variant="outline" size="sm" onClick={copyToClipboard} gap="2">
                <Icon as={Copy} size="16" /> Copy
              </Button>
              <Button variant="outline" size="sm" gap="2">
                <Icon as={Share2} size="16" /> Share
              </Button>
            </HStack>
          </HStack>

          <Card.Root variant="elevated" borderRadius="2xl" borderTop="4px solid" borderColor="brand.500">
            <Card.Body p="8">
              <Box className="markdown-body" whiteSpace="pre-wrap">
                {result}
              </Box>
            </Card.Body>
          </Card.Root>
        </Stack>
      )}
    </Stack>
  );
}

// Helper to use Grid in v3 if not explicitly imported
// (Removed duplicate import)
