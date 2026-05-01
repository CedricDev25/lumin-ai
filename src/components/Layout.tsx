import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Flex, 
  Icon, 
  Text, 
  IconButton, 
  useDisclosure,
  HStack,
  Avatar,
  VStack,
  MenuRoot,
  MenuTrigger,
  MenuContent,
  MenuItem
} from '@chakra-ui/react';
import { 
  LayoutDashboard, 
  BrainCircuit, 
  MessageSquare,
  History as HistoryIcon, 
  Settings as SettingsIcon, 
  LogOut, 
  Menu, 
  X,
  ChevronRight,
  User,
  Bot
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface NavItemProps {
  icon: any;
  label: string;
  href: string;
  active?: boolean;
  key?: string;
}

const NavItem = ({ icon, label, href, active }: NavItemProps) => {
  return (
    <Link to={href} style={{ textDecoration: 'none', width: '100%' }}>
      <HStack
        px="4"
        py="3"
        borderRadius="lg"
        bg={active ? 'brand.500' : 'transparent'}
        color={active ? 'white' : 'gray.600'}
        _hover={{
          bg: active ? 'brand.600' : 'gray.100',
          color: active ? 'white' : 'brand.600',
        }}
        transition="all 0.2s"
        gap="3"
        cursor="pointer"
      >
        <Icon as={icon} size="20" />
        <Text fontWeight="medium" fontSize="sm">{label}</Text>
        {active && <Icon as={ChevronRight} ml="auto" size="14" />}
      </HStack>
    </Link>
  );
};

export default function Layout() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { icon: LayoutDashboard, label: t('dashboard'), href: '/' },
    { icon: BrainCircuit, label: t('aiTools'), href: '/ai-tools' },
    { icon: MessageSquare, label: t('chat'), href: '/chat' },
    { icon: HistoryIcon, label: t('history'), href: '/history' },
    { icon: SettingsIcon, label: t('settings'), href: '/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Flex h="100vh" bg="gray.50">
      {/* Sidebar */}
      <Box
        w={isSidebarOpen ? "260px" : "0"}
        h="full"
        bg="white"
        borderRight="1px"
        borderColor="gray.200"
        transition="all 0.3s"
        overflow="hidden"
        display={{ base: 'none', md: 'block' }}
      >
        <VStack h="full" py="8" px="4" align="start" gap="8">
          <HStack px="4" gap="2">
            <Box bg="brand.500" p="2" borderRadius="lg">
              <Icon as={Bot} color="white" size="24" />
            </Box>
            <Text fontSize="xl" fontWeight="bold" color="brand.600">
              Lumina AI
            </Text>
          </HStack>

          <VStack w="full" gap="1" align="stretch">
            {navItems.map((item) => (
              <NavItem 
                key={item.href}
                icon={item.icon}
                label={item.label}
                href={item.href}
                active={location.pathname === item.href}
              />
            ))}
          </VStack>

          <Box mt="auto" w="full">
            <HStack
              w="full"
              px="4"
              py="3"
              borderRadius="lg"
              color="red.500"
              _hover={{ bg: 'red.50' }}
              cursor="pointer"
              onClick={handleLogout}
              gap="3"
            >
              <Icon as={LogOut} size="20" />
              <Text fontWeight="medium" fontSize="sm">{t('logout')}</Text>
            </HStack>
          </Box>
        </VStack>
      </Box>

      {/* Main Content */}
      <Flex flex="1" direction="column" overflow="hidden">
        {/* Navbar */}
        <Flex
          h="70px"
          px="8"
          bg="white"
          align="center"
          justify="space-between"
          borderBottom="1px"
          borderColor="gray.200"
        >
          <HStack gap="4">
            <IconButton
              aria-label="Toggle Sidebar"
              variant="ghost"
               onClick={() => setSidebarOpen(!isSidebarOpen)}
              display={{ base: 'none', md: 'flex' }}
            >
              <Icon as={Menu} />
            </IconButton>
            <Text fontWeight="semibold" color="gray.700" fontSize="md">
              {navItems.find(item => item.href === location.pathname)?.label || 'Study Assistant'}
            </Text>
          </HStack>

          <HStack gap="4">
            <HStack gap="3" px="2">
              <VStack align="end" gap="0" display={{ base: 'none', sm: 'flex' }}>
                <Text fontWeight="bold" fontSize="sm">{user?.name}</Text>
                <Text fontSize="xs" color="gray.500">{user?.email}</Text>
              </VStack>
              <Avatar.Root size="sm">
                <Avatar.Fallback>
                  <Icon as={User} size="16" />
                </Avatar.Fallback>
                <Avatar.Image src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} />
              </Avatar.Root>
            </HStack>
          </HStack>
        </Flex>

        {/* Page Container */}
        <Box flex="1" p="8" overflowY="auto">
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
}
