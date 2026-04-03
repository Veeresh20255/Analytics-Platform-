# Excel Analytics Platform

A full-stack application for Excel data analytics with AI-powered insights.

## Project Structure

- `backend/` - Node.js/Express server with authentication, file uploads, and AI integration
- `frontend/` - React/Vite application for data visualization and user interface

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation and Running

### Option 1: Automated Script (Recommended)

Run the PowerShell script to start both servers:

```powershell
powershell -ExecutionPolicy Bypass -File .\run-servers.ps1
```

This will install dependencies and launch backend and frontend in separate windows.

### Option 2: Manual Setup

#### Backend
```bash
cd backend
npm install
node server.js
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Ports

- Backend: http://localhost:3000
- Frontend: http://localhost:5173

## Features

- User authentication and authorization
- Excel file upload and processing
- AI-powered data analysis
- Interactive charts and visualizations
- Admin dashboard
- Rate limiting and security

## Development

- Backend uses Express.js with JWT authentication
- Frontend uses React with Plotly.js for charts
- Database configuration in `backend/config/db.js`
- AI integration with Google Generative AI

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC