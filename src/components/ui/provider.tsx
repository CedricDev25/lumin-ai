import React, { ReactNode } from 'react';
import { ChakraProvider, createSystem, defineConfig, defaultConfig } from "@chakra-ui/react"

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#eef2ff" },
          100: { value: "#e0e7ff" },
          500: { value: "#6366f1" },
          600: { value: "#4f46e5" },
          700: { value: "#4338ca" },
        },
      },
    },
    semanticTokens: {
      colors: {
        bg: {
          default: { value: "{colors.white}" },
          _dark: { value: "#0a0a0a" },
        },
        sidebarBg: {
          default: { value: "{colors.white}" },
          _dark: { value: "#121212" },
        },
        cardBg: {
          default: { value: "{colors.white}" },
          _dark: { value: "#1e1e1e" },
        },
      },
    },
  },
})

export const system = createSystem(defaultConfig, config)

export function Provider(props: { children: ReactNode }) {
  return (
    <ChakraProvider value={system}>
      <div className="chakra-dark" style={{ colorScheme: 'dark', minHeight: '100vh', backgroundColor: '#0a0a0a', color: 'white' }}>
        {props.children}
      </div>
    </ChakraProvider>
  )
}
