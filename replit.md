# TalentBridge HR Company Website

## Overview

TalentBridge is a modern HR company website built as a full-stack web application with React/TypeScript frontend and Express.js backend. The application provides job listings, application submission, and admin management functionality. It's designed to be lightweight, responsive, and user-friendly for both job seekers and HR administrators.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query for server state management
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful API with JSON responses
- **Storage**: In-memory storage with interface for future database integration
- **Validation**: Zod schemas shared between frontend and backend
- **Development**: Hot reloading with Vite integration

## Key Components

### Pages
- **Home** (`/`): Landing page with hero section and company features
- **About** (`/about`): Company information and team details
- **Jobs** (`/jobs`): Job listings with search and filtering
- **Apply** (`/apply`): Job application form with file upload
- **Contact** (`/contact`): Contact form and company details
- **Admin** (`/admin`): Administrative dashboard for job and application management
- **404**: Not found page for unmatched routes

### Shared Components
- **Navigation**: Responsive header with mobile menu
- **Footer**: Site-wide footer with links and company info
- **UI Components**: Comprehensive set of reusable components (buttons, forms, dialogs, etc.)

### API Endpoints
- `GET /api/jobs` - Retrieve all job postings
- `GET /api/jobs/:id` - Retrieve specific job
- `POST /api/jobs` - Create new job posting
- `PUT /api/jobs/:id` - Update job posting
- `DELETE /api/jobs/:id` - Delete job posting
- `GET /api/applications` - Retrieve all applications
- `GET /api/applications/:id` - Retrieve specific application
- `POST /api/applications` - Submit job application
- `PUT /api/applications/:id/status` - Update application status

## Data Flow

### Job Listings Flow
1. Frontend requests jobs from `/api/jobs`
2. Backend retrieves jobs from memory storage
3. Frontend displays jobs with search/filter capabilities
4. Users can view job details and navigate to application form

### Application Submission Flow
1. User fills out application form with job ID parameter
2. Form data validated with Zod schema
3. Frontend submits to `/api/applications` endpoint
4. Backend validates and stores application
5. Success/error feedback provided to user

### Admin Management Flow
1. Admin accesses dashboard at `/admin`
2. Can create new job postings through form
3. Can view all applications in tabbed interface
4. Can update application status
5. Real-time updates through TanStack Query

## External Dependencies

### Frontend Dependencies
- **React Ecosystem**: React, React DOM, React Hook Form
- **UI Library**: Radix UI primitives, Shadcn/ui components
- **Styling**: Tailwind CSS, class-variance-authority, clsx
- **State Management**: TanStack React Query
- **Validation**: Zod, @hookform/resolvers
- **Utilities**: date-fns, lucide-react icons
- **File Upload**: Custom file upload component

### Backend Dependencies
- **Core**: Express.js, Node.js built-ins
- **Database**: Drizzle ORM configured for PostgreSQL (currently using memory storage)
- **Validation**: Zod for schema validation
- **Session**: connect-pg-simple for PostgreSQL sessions
- **Development**: tsx for TypeScript execution

### Build Tools
- **Vite**: Frontend build tool and dev server
- **TypeScript**: Type checking and compilation
- **ESBuild**: Backend bundling for production
- **PostCSS**: CSS processing with Tailwind

## Deployment Strategy

### Development
- Frontend served by Vite dev server with HMR
- Backend runs with tsx for TypeScript execution
- Integrated development with proxy setup
- Hot reloading for both frontend and backend changes

### Production Build
1. Frontend built with `vite build` to `dist/public`
2. Backend bundled with `esbuild` to `dist/index.js`
3. Static files served by Express in production
4. Environment variables for database configuration

### Database Configuration
- Drizzle ORM configured for PostgreSQL
- Database URL from environment variables
- Migrations stored in `./migrations` directory
- Currently using in-memory storage for development
- Ready for PostgreSQL deployment with existing schema

### Key Features
- Responsive design for mobile and desktop
- File upload capability for resumes
- Form validation on both client and server
- Search and filtering for job listings
- Admin dashboard with job and application management
- Toast notifications for user feedback
- Loading states and error handling
- Type safety across the entire stack