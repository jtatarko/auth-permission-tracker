# Adverity Entities Tracking Demo

A browser-based demo application for user testing of Adverity's authorization entities tracking system. This demo simulates the complete user flow from email notifications to detailed permission management without requiring a backend.

## Features

- **Email Notification View**: Daily permission changes summary with email-like styling
- **Entities Drawer**: Detailed permission history with filtering, search, and export
- **Authorization Detail**: Comprehensive view of individual authorizations
- **Authorizations Dashboard**: Main list with charts, filters, and bulk actions
- **Interactive Charts**: Permission changes over time with Recharts
- **CSV Export**: Comprehensive export functionality for all data
- **Responsive Design**: Works across desktop and mobile devices

## Tech Stack

- **Frontend Framework**: React 18+ with TypeScript
- **UI Library**: shadcn/ui (https://ui.shadcn.com/)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Data**: Static dummy data (no backend required)

## Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup Steps

1. **Navigate to the project**
   ```bash
   cd adverity-entities-demo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5174 (or the port shown in terminal)
   ```

##  User Flows

### Flow 1: Email → Authorization Detail → Drawer (Auto-opened)
1. Start at `/email` - view daily email notification
2. Click "See details" → navigates to authorization detail page
3. **EntitiesDrawer opens automatically** with:
   - Date range pre-filtered to email date range
   - Data filtered to specific authorization
   - Drawer slides in from the right side
4. Close drawer to see authorization detail
5. Reopen drawer with "View changes" button

### Flow 2: Authorizations List → Detail → Drawer
1. Start at `/authorizations` - main dashboard
2. Click authorization name → navigates to detail page
3. Click "View changes" → opens EntitiesDrawer
4. Export data from drawer

### Flow 3: Navigation via Breadcrumb
1. From authorization detail page
2. Click "Authorizations" in breadcrumb → back to main list
3. Maintains any existing filters/search state

### Flow 4: Bulk Actions from Authorizations List
1. Select multiple authorizations via checkboxes
2. Bulk action buttons become enabled
3. Export permission changes for selected items

## 📱 Pages & Components

### Email Notification (`/email`)
- **Component**: `EmailNotification.tsx`
- **Features**:
  - Permission changes summary table
  - Color-coded actions (green=added, red=removed)
  - Quick stats overview
  - "See details" navigation

### Authorizations Dashboard (`/authorizations`)
- **Component**: `AuthorizationsPage.tsx`
- **Features**:
  - Stacked bar chart showing permission trends
  - Advanced filtering (workspace, data source, status)
  - Search functionality
  - Sortable table with bulk selection
  - Export capabilities

### Authorization Detail (`/authorization/:id`)
- **Component**: `AuthorizationDetail.tsx`
- **Features**:
  - Breadcrumb navigation
  - Authorization metadata display
  - Recent activity sidebar
  - Datastreams integration
  - Settings panel

### Entities Drawer
- **Component**: `EntitiesDrawer.tsx`
- **Features**:
  - Slides from right side of viewport
  - Date range filtering
  - Action filtering (Added/Removed)
  - Search across entities and datastreams
  - Sortable columns
  - CSV export

## Data Models

The application uses comprehensive TypeScript interfaces:

- **PermissionChange**: Individual permission modifications
- **Authorization**: Data source authorization details
- **DataSourceType**: Supported platforms (Meta, Google Ads, etc.)

Sample data includes:
- **Authorizations**: 15-20 items across 4 workspaces
- **Permission Changes**: 100+ items spanning 30 days
- **Datastreams**: Multiple per authorization with realistic naming

##  UI Components

Built with shadcn/ui components:
- Tables with sorting and selection
- Modals and drawers
- Form inputs and selectors
- Charts and data visualization
- Responsive cards and layouts

## Export Features

### Permission Changes Export
- Filter by date range
- Include/exclude added/removed actions
- CSV format with comprehensive data
- Automatic filename generation

### Authorization Export
- Bulk selection support
- Complete authorization metadata
- Usage statistics included

## Testing Scenarios

1. **Email Flow**: Starting from email notification to permission details
2. **Bulk Operations**: Selecting multiple authorizations and performing actions
3. **Search & Filter**: Finding specific authorizations or permission changes
4. **Export Functionality**: Exporting different data sets as CSV
5. **Chart Interaction**: Understanding permission trends over time
6. **Navigation**: Using breadcrumbs to move between pages

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run tsc

# Linting
npm run lint
```

## 🚀 Deployment

### Vercel Deployment
This project is configured for deployment on Vercel:

- **Framework**: Automatically detected as Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **SPA Routing**: Configured via `vercel.json`

To deploy:
1. Connect your GitHub repository to Vercel
2. Import the project (settings will be auto-detected)
3. Deploy

The `vercel.json` configuration handles SPA routing by redirecting all routes to `index.html`.

## 🏗 Project Structure

```
src/
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── EmailNotification.tsx   # Email summary component
│   ├── EntitiesDrawer.tsx   # Permission changes drawer
│   ├── AuthorizationDetail.tsx # Authorization detail page
│   ├── AuthorizationsPage.tsx  # Main authorizations list
│   ├── EntitiesChart.tsx    # Stacked chart component
│   └── ExportModal.tsx         # CSV export modal
├── data/
│   ├── dummy-data.ts          # Generated dummy data
│   └── types.ts               # TypeScript interfaces
├── utils/
│   ├── date-utils.ts          # Date formatting utilities
│   └── csv-export.ts          # CSV export functionality
├── App.tsx                    # Main app with routing
└── main.tsx                   # App entry point
```

## 🎛 Configuration

The application is configured for:
- TypeScript strict mode
- Path mapping (`@/` imports)
- Tailwind CSS with shadcn/ui
- Vite hot reload
- Date-fns for date handling

## Contributing

This is a demo application for user testing. To modify:

1. Update dummy data in `src/data/dummy-data.ts`
2. Modify components for different behaviors
3. Adjust styling via Tailwind classes
4. Add new routes in `App.tsx`

## Support

For questions about this demo:
- Review the component implementations
- Check browser console for any errors
- Verify all dependencies are installed
- Ensure you're using Node.js 18+

---

**Demo URL**: http://localhost:5174 (when running `npm run dev`)

This demo provides a complete simulation of the Adverity entities tracking system, designed for comprehensive user testing and feedback collection.
