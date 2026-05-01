import React, { useState } from 'react';
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
  Field,
  Switch,
  Separator,
  Flex
} from '@chakra-ui/react';
import { 
  User, 
  Moon, 
  Sun, 
  Trash2, 
  ShieldCheck, 
  Bell,
  LogOut,
  Languages
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { clearHistory } from '../utils/historyService';

export default function Settings() {
  const { user, updateName, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [name, setName] = useState(user?.name || '');
  const [isSaving, setIsSaving] = useState(false);
  
  // Chakra v3 color mode toggle placeholder
  const [colorMode, setColorMode] = useState('light');
  const toggleColorMode = () => setColorMode(prev => prev === 'light' ? 'dark' : 'light');

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      updateName(name);
      setIsSaving(false);
      alert('Profile updated successfully!');
    }, 500);
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to delete all study history? This action is permanent.')) {
      clearHistory();
      alert('All clear! Your history has been deleted.');
    }
  };

  return (
    <Stack gap="8" maxW="800px">
      <Box>
        <Heading size="2xl" mb="2">{t('settings')}</Heading>
        <Text color="gray.600">Manage your account preferences and application settings.</Text>
      </Box>

      <Stack gap="6">
        {/* Profile Section */}
        <Card.Root border="none" shadow="sm">
          <Card.Header pb="2">
            <HStack gap="3">
              <Icon as={User} color="brand.500" />
              <Heading size="lg">Profile Settings</Heading>
            </HStack>
          </Card.Header>
          <Card.Body>
            <form onSubmit={handleUpdateProfile}>
              <Stack gap="4">
                <Field.Root>
                  <Field.Label>Display Name</Field.Label>
                  <Input 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                  />
                </Field.Root>
                <Field.Root>
                  <Field.Label>Email Address</Field.Label>
                  <Input 
                    value={user?.email}
                    disabled
                    bg="gray.50"
                  />
                  <Field.HelperText>Your email is managed by your account provider.</Field.HelperText>
                </Field.Root>
                <Button 
                  type="submit" 
                  bg="brand.500" 
                  color="white" 
                  w="fit-content"
                  loading={isSaving}
                  disabled={name === user?.name}
                >
                  Save Changes
                </Button>
              </Stack>
            </form>
          </Card.Body>
        </Card.Root>

        {/* Appearance Section */}
        <Card.Root border="none" shadow="sm">
          <Card.Header pb="2">
            <HStack gap="3">
              <Icon as={Moon} color="brand.500" />
              <Heading size="lg">Appearance & Language</Heading>
            </HStack>
          </Card.Header>
          <Card.Body>
            <Stack gap="4" divider={<Separator />}>
              <Flex justify="space-between" align="center">
                <Box>
                  <Text fontWeight="semibold">{t('darkMode')}</Text>
                  <Text fontSize="sm" color="gray.500">Enable dark theme for late-night study sessions.</Text>
                </Box>
                <Switch.Root 
                  colorPalette="brand" 
                  checked={colorMode === 'dark'}
                  onCheckedChange={toggleColorMode}
                >
                  <Switch.Control>
                    <Switch.Thumb />
                  </Switch.Control>
                </Switch.Root>
              </Flex>
              
              <Flex justify="space-between" align="center">
                <Box>
                  <Text fontWeight="semibold">{t('language')}</Text>
                  <Text fontSize="sm" color="gray.500">Select your preferred interface language.</Text>
                </Box>
                <HStack>
                  <Button 
                    variant={language === 'en' ? 'solid' : 'outline'} 
                    bg={language === 'en' ? 'brand.500' : 'transparent'}
                    color={language === 'en' ? 'white' : 'brand.500'}
                    size="sm"
                    onClick={() => setLanguage('en')}
                  >
                    English
                  </Button>
                  <Button 
                    variant={language === 'fr' ? 'solid' : 'outline'} 
                    bg={language === 'fr' ? 'brand.500' : 'transparent'}
                    color={language === 'fr' ? 'white' : 'brand.500'}
                    size="sm"
                    onClick={() => setLanguage('fr')}
                  >
                    Français
                  </Button>
                </HStack>
              </Flex>
            </Stack>
          </Card.Body>
        </Card.Root>

        {/* Security & Data Section */}
        <Card.Root border="none" shadow="sm">
          <Card.Header pb="2">
            <HStack gap="3">
              <Icon as={ShieldCheck} color="brand.500" />
              <Heading size="lg">Security & Privacy</Heading>
            </HStack>
          </Card.Header>
          <Card.Body>
            <Stack gap="4">
              <Box>
                <Text fontWeight="semibold" color="red.500">Danger Zone</Text>
                <Text fontSize="sm" color="gray.500" mb="4">Once you delete your history, there is no going back. Please be certain.</Text>
                <Button 
                  variant="outline" 
                  color="red.500" 
                  borderColor="red.200"
                  _hover={{ bg: 'red.50' }}
                  onClick={handleClearData}
                  gap="2"
                >
                  <Icon as={Trash2} size="16" /> Delete All Study Data
                </Button>
              </Box>
            </Stack>
          </Card.Body>
        </Card.Root>

        <Button 
          variant="ghost" 
          color="gray.500" 
          onClick={logout}
          w="fit-content"
          gap="2"
        >
          <Icon as={LogOut} size="16" /> Log out of account
        </Button>
      </Stack>
    </Stack>
  );
}
