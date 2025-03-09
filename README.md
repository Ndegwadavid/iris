<<<<<<< main
### Optical Company SAAS
=======
### Iris Eyewear Client Management System Documentation

## Project Overview

Iris is a comprehensive client management system designed for eyewear professionals, featuring client management, examination records, sales tracking, and administrative functions.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- next-themes for dark mode
- Lucide React icons


## Setup Instructions

1. **Create Project**


```shellscript
npx create-next-app@latest iris-client-management --typescript --tailwind --app
```

2. **Install Dependencies**


```shellscript
cd iris-client-management
npm install @radix-ui/react-dropdown-menu @radix-ui/react-slot @radix-ui/react-toast lucide-react class-variance-authority clsx tailwind-merge next-themes date-fns @radix-ui/react-popover @radix-ui/react-label @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-tabs
```

3. **Run Development Server**


```shellscript
npm run dev
```

4. **Access the Application**


- Main application: [http://localhost:3000](http://localhost:3000)
- Admin panel: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)


## Features

### 1. Client Management

- Client registration with automatic ID generation
- Client search and filtering
- Detailed client profiles
- Client history tracking


### 2. Examination System

- Digital prescription records
- Examination history
- IPD measurements
- Clinical notes


### 3. Sales Management

- Frame and lens details
- Payment processing (Cash/M-Pesa/Card)
- Order tracking
- Sales history
- Pricing in KES


### 4. Admin Dashboard

- Revenue tracking
- Staff management
- Analytics
- System settings


## Access Credentials

### Admin Login

- URL: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- Username: `admin`
- Password: `admin123`


## File Structure

```plaintext
iris-client-management/
├── app/
│   ├── admin/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── clients/
│   │   └── page.tsx
│   ├── examination/
│   │   └── page.tsx
│   ├── reception/
│   │   └── page.tsx
│   ├── sales/
│   │   └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── sidebar.tsx
│   └── theme-provider.tsx
├── lib/
│   ├── constants.ts
│   ├── types.ts
│   └── utils/
│       ├── auth.ts
│       ├── format.ts
│       └── generate-client-id.ts
└── public/
```

## Key Features Documentation

### 1. Client Registration

- Automatic registration number format: M/YYYY/MM/`<client_id>`
- Required fields: name, DOB, contact information
- Optional fields: email, previous prescriptions


### 2. Examination Records

- Comprehensive eye examination form
- Prescription details for both eyes
- IPD measurements
- Clinical notes section


### 3. Sales Management

- Frame details (brand, model, color)
- Lens specifications
- Payment processing
- Order tracking
- Pricing in KES


### 4. Admin Features

- Staff management
- Revenue tracking
- Analytics dashboard
- System settings


## Currency Handling

- All monetary values are in Kenya Shillings (KES)
- Format: KSh XX,XXX.XX
- VAT calculation: 16%


## Future Backend Integration

### 1. Database Setup

Prepare the following tables:

- clients
- examinations
- prescriptions
- sales
- staff
- orders


### 2. API Routes

Create endpoints for:

- Client management
- Examination records
- Sales processing
- Admin functions


### 3. Authentication

Implement:

- JWT authentication
- Role-based access control
- Session management


### 4. File Storage

Set up:

- Prescription document storage
- Client documents
- Backup system


## Responsive Design

The application is fully responsive with:

- Mobile-first approach
- Tablet optimization
- Desktop layouts
- Dark/light mode support


## Error Handling

Currently implemented:

- Form validation
- User feedback
- Loading states
- Error messages


## Performance Considerations

- Optimized image loading
- Component lazy loading
- Client-side caching
- Server-side rendering where appropriate


## Security Features

- Protected admin routes
- Input sanitization
- XSS protection
- CORS configuration


## Support and Maintenance

For support or questions:

1. Check the documentation
2. Review the code comments
3. Contact system administrator


## Next Steps

1. Set up your database
2. Configure environment variables
3. Implement API routes
4. Add authentication service
5. Deploy to production



>>>>>>> backend
