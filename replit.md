# JOY - Fashion E-commerce Platform

## Overview

JOY is a luxury fashion e-commerce platform built as a full-stack web application featuring a React frontend and Express.js backend. The application showcases premium clothing collections for men, women, and children, with a sophisticated French luxury brand aesthetic.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: React Context API for cart management
- **Data Fetching**: TanStack React Query for server state management
- **UI Components**: Radix UI primitives with custom styling
- **Styling**: Tailwind CSS with custom design system
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API endpoints
- **Session Management**: Express sessions with PostgreSQL storage
- **Development**: Hot module replacement via Vite integration

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: PostgreSQL (configured for Neon serverless)
- **Schema Management**: Type-safe schema definitions with Zod validation
- **Storage**: In-memory fallback storage for development

## Key Components

### Data Models
The application uses three primary data models:
1. **Products**: Core product catalog with multilingual support (French)
   - Attributes: name, description, price, category, images, sizes, colors, stock
   - Categories: hommes, femmes, enfants, accessoires
2. **Cart Items**: Shopping cart functionality with session management
   - Attributes: product reference, quantity, size/color selection, session ID
3. **Contact Messages**: Customer inquiry system
   - Attributes: customer details and message content

### User Interface Components
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Component Library**: Comprehensive UI component system based on shadcn/ui
- **Accessibility**: ARIA-compliant components with keyboard navigation
- **Internationalization**: French language support throughout the interface

### Shopping Cart System
- **Session-Based**: Cart persistence using browser sessions
- **Real-Time Updates**: Optimistic updates with error handling
- **Variant Selection**: Support for size and color variants
- **Sidebar Interface**: Slide-out cart with item management

## Data Flow

1. **Product Catalog**: Products are fetched from the backend API and cached using React Query
2. **Cart Operations**: Cart state is managed through React Context with server synchronization
3. **User Interactions**: Form submissions use React Hook Form with Zod validation
4. **Session Management**: Server maintains session state for cart persistence
5. **Contact Forms**: Customer inquiries are processed through dedicated API endpoints

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless driver
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI primitives
- **react-hook-form**: Form state management
- **zod**: Runtime type validation

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Static type checking
- **Tailwind CSS**: Utility-first CSS framework
- **PostCSS**: CSS processing pipeline

## Deployment Strategy

The application is configured for deployment on Replit with the following setup:
- **Build Process**: Vite builds the frontend, esbuild bundles the backend
- **Production Server**: Express serves both API and static files
- **Database**: PostgreSQL integration with environment-based configuration
- **Port Configuration**: Runs on port 5000 with external port 80 mapping
- **Auto-scaling**: Configured for autoscale deployment target

The deployment process separates build and runtime phases, with the frontend compiled to static assets and the backend bundled as a single executable module.

## Changelog

- June 19, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.