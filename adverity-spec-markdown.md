# Adverity Permissions Tracking Demo - Technical Specification (Updated)

## Project Overview
Create a browser-based demo application for user testing of Adverity's authorization permissions tracking system. The demo will simulate the complete user flow from email notifications to detailed permission management without requiring a backend.

## Tech Stack
- **Frontend Framework**: React 18+ with TypeScript
- **UI Library**: shadcn/ui (https://ui.shadcn.com/)
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Dev Server**: localhost:3000 (or available port)
- **Icons**: Lucide React (included with shadcn/ui)
- **Data**: Static dummy data (no backend required)

## Project Structure
```
adverity-permissions-demo/
├── src/
│   ├── components/
│   │   ├── ui/                     # shadcn/ui components
│   │   ├── EmailNotification.tsx   # Email summary component
│   │   ├── PermissionsDrawer.tsx   # Permission changes drawer
│   │   ├── AuthorizationDetail.tsx # Authorization detail page
│   │   ├── AuthorizationsPage.tsx  # Main authorizations list
│   │   ├── PermissionsChart.tsx    # Stacked chart component
│   │   └── ExportModal.tsx         # CSV export modal
│   ├── data/
│   │   ├── dummy-data.ts          # Generated dummy data
│   │   └── types.ts               # TypeScript interfaces
│   ├── utils/
│   │   ├── date-utils.ts          # Date formatting utilities
│   │   └── csv-export.ts          # CSV export functionality
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

## Data Models

### Permission Change
```typescript
interface PermissionChange {
  id: string;
  authorizationId: string;
  permissionName: string;
  action: 'Added' | 'Removed';
  dateTime: Date;
  workspace: string;
  dataSource: string;
  datastreamNames: string[]; // Multiple datastreams
  usedInDatastreams: number;
}
```

### Authorization
```typescript
interface Authorization {
  id: string;
  name: string;
  type: DataSourceType;
  workspace: string;
  created: Date;
  lastUsed: Date | null;
  permissionsCount: number;
  datastreamsCount: number;
  status: 'Connected' | 'Expired' | 'Pending';
}
```

### Data Source Types
```typescript
type DataSourceType = 'Meta' | 'Google Ads' | 'Amazon Advertising' | 'Google Sheets' | 
                     'Facebook Ads' | 'LinkedIn Ads' | 'TikTok Ads' | 'Twitter Ads';
```

### Datastream Names
```typescript
// Sample datastream naming patterns for different data sources:
interface DatastreamExamples {
  'Amazon Advertising': ['Amazon_Campaigns_v2', 'Amazon_Keywords_Daily', 'Amazon_ProductAds_Performance'];
  'Google Ads': ['GoogleAds_CampaignStats', 'GoogleAds_Keywords_Hourly', 'GoogleAds_AdGroups_v1'];
  'Meta': ['Meta_CampaignInsights', 'Meta_AdSetPerformance', 'Meta_CreativeStats'];
  'Google Sheets': ['GoogleSheets_MarketingBudget', 'GoogleSheets_CampaignMapping', 'GoogleSheets_KPIDashboard'];
  // ... etc
}
```

## Component Specifications

### 1. EmailNotification Component
**Purpose**: Simulates the daily email notification users receive

**Features**:
- Display permission changes summary table
- Show removed permissions (red highlight)
- Show added permissions (green highlight)
- "See details" button to navigate to authorization detail with drawer pre-opened
- Email-like styling with header and metadata

**Props**:
```typescript
interface EmailNotificationProps {
  permissionChanges: PermissionChange[];
  onSeeDetails: (authId: string, emailDateRange: { from: Date; to: Date }) => void;
}
```

### 2. PermissionsDrawer Component
**Purpose**: Side drawer sliding from right showing detailed permission changes

**Features**:
- Slides in from the right side of viewport
- Date range filter (auto-populated from email data when opened from email)
- Action filter (All, Added, Removed)
- Search functionality
- Sortable table with columns:
  - Date and time
  - Action (Added/Removed with color coding)
  - Permission name
  - Permission ID
  - Used in datastreams (multiple datastream names, clickable links)
- Export as CSV button
- Close on backdrop click or X button

**Props**:
```typescript
interface PermissionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  authorizationId: string;
  initialDateRange?: { from: Date; to: Date };
  initialFilters?: { action?: 'Added' | 'Removed' | 'All' };
}
```

### 3. AuthorizationDetail Component
**Purpose**: Shows detailed view of a single authorization

**Features**:
- Breadcrumb navigation: Testing > Authorizations > [Authorization Name]
- Authorization metadata (name, workspace, created date, etc.)
- "View changes" button to open permissions drawer
- Status indicator (badge component)
- Used by X datastreams section with links
- Settings section

**Props**:
```typescript
interface AuthorizationDetailProps {
  authorization: Authorization;
  onViewChanges: () => void;
  onNavigateToList: () => void; // For breadcrumb navigation
}
```

### 4. AuthorizationsPage Component
**Purpose**: Main page listing all authorizations

**Features**:
- Permissions changes chart (stacked bar chart)
  - Light blue for added permissions
  - Yellow for removed permissions
  - Date range selector
  - Hover tooltips showing exact numbers
- Filters:
  - Workspace dropdown
  - Data source dropdown  
  - Status dropdown
- Search functionality
- Sortable table with columns:
  - **Type**: Data source type {DataSource} with data source icons
  - Name
  - Workspace
  - Created
  - Last used
  - Permissions count
  - Datastreams count
  - Status (with colored badges)
- Bulk selection with checkboxes
- Bulk action buttons (Delete, Sync metadata, Validate, Export)
- Pagination

**State Management**:
```typescript
interface AuthorizationsPageState {
  selectedItems: string[];
  filters: {
    workspace: string;
    dataSource: string;
    status: string;
  };
  searchTerm: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  chartDateRange: { from: Date; to: Date };
}
```

### 5. PermissionsChart Component
**Purpose**: Stacked bar chart showing permission changes over time

**Features**:
- Stacked bars (added: light blue, removed: yellow)
- Date range selector
- Hover tooltips
- Data aggregation by day

**Tech**: Chart.js or Recharts for visualization

### 6. ExportModal Component
**Purpose**: Modal for exporting permission changes to CSV

**Features**:
- Date range picker
- Checkboxes for "Added" and "Removed" actions
- "Export as CSV" button
- "Cancel" button
- Form validation

## Dummy Data Requirements

### Workspaces:
- SampleCompany-NA
- SampleCompany-EMEA  
- SampleCompany-LATAM
- SampleCompany-APAC

### Data Sources to Include:
- Meta (Facebook/Instagram)
- Google Ads
- Amazon Advertising
- Google Sheets
- LinkedIn Ads
- TikTok Ads
- Twitter Ads

### Datastream Naming Patterns:
```typescript
const datastreamNames = {
  'Amazon Advertising': [
    'Amazon_Campaigns_v2', 'Amazon_Keywords_Daily', 'Amazon_ProductAds_Performance',
    'Amazon_SponsoredBrands_Stats', 'Amazon_DSP_Audiences', 'Amazon_AttributionReports'
  ],
  'Google Ads': [
    'GoogleAds_CampaignStats', 'GoogleAds_Keywords_Hourly', 'GoogleAds_AdGroups_v1',
    'GoogleAds_SearchTerms', 'GoogleAds_Extensions_Performance', 'GoogleAds_Shopping_Data'
  ],
  'Meta': [
    'Meta_CampaignInsights', 'Meta_AdSetPerformance', 'Meta_CreativeStats',
    'Meta_AudienceInsights', 'Meta_VideoMetrics', 'Meta_ConversionData'
  ],
  'Google Sheets': [
    'GoogleSheets_MarketingBudget', 'GoogleSheets_CampaignMapping', 'GoogleSheets_KPIDashboard',
    'GoogleSheets_CostAllocation', 'GoogleSheets_PerformanceTargets'
  ]
  // ... similar patterns for other data sources
};
```

### Sample Data Volume:
- **Authorizations**: 15-20 items across different data sources
- **Permission Changes**: 100+ items spanning the last 30 days
- **Each Permission Change**: 1-5 associated datastreams

### Realistic Naming Patterns:
- **Authorizations**: "{DataSource} Authorization {Number}", "{DataSource} {Region} Account"
- **Permissions**: "{DataSource} Campaign {ID}", "{DataSource} {AdType} Access", "{DataSource} Audience {Name}"

## User Flow Implementation

### Flow 1: Email → Authorization Detail → Drawer (Auto-opened)
1. User starts at email notification
2. Clicks "See details" → navigates to AuthorizationDetail
3. **PermissionsDrawer opens automatically** with:
   - Date range pre-filtered to email date range (e.g., 2024-08-18 to 2024-08-19)
   - Data filtered to match the specific authorization from email
   - Drawer slides in from the right side
4. User can close drawer to see authorization detail
5. User can reopen drawer with "View changes" button

### Flow 2: Authorizations List → Detail → Drawer
1. User starts at AuthorizationsPage
2. Clicks authorization name → navigates to AuthorizationDetail  
3. User clicks "View changes" → opens PermissionsDrawer (slides from right)
4. User can export data from drawer

### Flow 3: Navigation via Breadcrumb
1. User is on AuthorizationDetail page
2. User clicks "Authorizations" in breadcrumb → navigates back to AuthorizationsPage
3. Maintains any existing filters/search state

### Flow 4: Bulk Actions from Authorizations List
1. User selects multiple authorizations via checkboxes
2. Bulk action buttons become enabled
3. User can export permission changes for selected items

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation Steps
```bash
# 1. Create new Vite React project
npm create vite@latest adverity-permissions-demo -- --template react-ts

# 2. Install dependencies
cd adverity-permissions-demo
npm install

# 3. Install shadcn/ui
npx shadcn-ui@latest init

# 4. Add required shadcn/ui components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add table
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add select
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add calendar
npx shadcn-ui@latest add sheet
npx shadcn-ui@latest add dropdown-menu

# 5. Install additional packages
npm install lucide-react date-fns recharts

# 6. Start development server
npm run dev
```

## Development Guidelines

### Code Style
- Use TypeScript for all components
- Follow React functional components with hooks
- Use shadcn/ui components for consistent UI
- Implement proper error boundaries
- Add loading states for better UX

## Testing Requirements

### User Testing Scenarios
1. **Email Flow**: Starting from email notification to permission details with auto-opened drawer
2. **Bulk Operations**: Selecting multiple authorizations and performing actions
3. **Search & Filter**: Finding specific authorizations or permission changes
4. **Export Functionality**: Exporting different data sets as CSV
5. **Chart Interaction**: Understanding permission trends over time
6. **Navigation**: Using breadcrumbs to move between pages

### Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Deliverables

1. **Complete React Application**: Fully functional demo running on localhost
2. **Setup Documentation**: README with installation and running instructions
3. **User Guide**: Brief guide for demo navigation and features
4. **Sample Data**: Realistic dummy data representing various scenarios with multiple datastreams per permission
5. **Export Samples**: Example CSV files showing expected export format

This specification provides a comprehensive blueprint for building the Adverity permissions tracking demo with shadcn/ui components, ensuring a professional, user-friendly interface suitable for user testing with the requested updates implemented.