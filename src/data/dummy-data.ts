import type { Authorization, PermissionChange, DataSourceType } from './types';

const workspaces = [
  'SampleCompany-NA',
  'SampleCompany-EMEA',
  'SampleCompany-LATAM',
  'SampleCompany-APAC'
];

const dataSources: DataSourceType[] = [
  'Meta',
  'Google Ads',
  'Amazon Advertising',
  'Google Sheets',
  'LinkedIn Ads',
  'TikTok Ads',
  'Twitter Ads'
];

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
  ],
  'LinkedIn Ads': [
    'LinkedIn_CampaignAnalytics', 'LinkedIn_SponsoredContent', 'LinkedIn_TextAds_Performance',
    'LinkedIn_VideoAds_Stats', 'LinkedIn_AudienceInsights'
  ],
  'TikTok Ads': [
    'TikTok_CampaignPerformance', 'TikTok_AdGroupStats', 'TikTok_CreativeInsights',
    'TikTok_AudienceData', 'TikTok_ConversionTracking'
  ],
  'Twitter Ads': [
    'Twitter_CampaignMetrics', 'Twitter_TweetEngagement', 'Twitter_AudienceInsights',
    'Twitter_ConversionEvents', 'Twitter_VideoMetrics'
  ]
};

// Generate authorizations
export const generateAuthorizations = (): Authorization[] => {
  const authorizations: Authorization[] = [];

  dataSources.forEach((dataSource, index) => {
    workspaces.forEach((workspace, wsIndex) => {
      if (index + wsIndex < 20) { // Generate 15-20 authorizations total
        const id = `auth-${dataSource.toLowerCase().replace(/\s+/g, '-')}-${wsIndex + 1}`;
        const created = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000); // Last 90 days
        const lastUsed = Math.random() > 0.2 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : null; // 80% chance of being used

        authorizations.push({
          id,
          name: `${dataSource} ${workspace.split('-')[1]} Account`,
          type: dataSource,
          workspace,
          created,
          lastUsed,
          entitiesCount: Math.floor(Math.random() * 25) + 5, // 5-30 entities
          datastreamsCount: Math.floor(Math.random() * 10) + 2, // 2-12 datastreams
          status: Math.random() > 0.1 ? 'Connected' : (Math.random() > 0.5 ? 'Expired' : 'Pending')
        });
      }
    });
  });

  return authorizations;
};

// Generate permission changes
export const generatePermissionChanges = (authorizations: Authorization[]): PermissionChange[] => {
  const permissionChanges: PermissionChange[] = [];
  const now = new Date();
  // Extend to 90 days to include August and September
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

  // Generate 200+ permission changes over the last 90 days
  for (let i = 0; i < 200; i++) {
    const auth = authorizations[Math.floor(Math.random() * authorizations.length)];
    const dataSource = auth.type;
    const availableDatastreams = datastreamNames[dataSource as keyof typeof datastreamNames] || [];

    // Random date within last 90 days
    const randomDate = new Date(ninetyDaysAgo.getTime() + Math.random() * (now.getTime() - ninetyDaysAgo.getTime()));

    // Select 1-5 datastreams for this permission
    const selectedDatastreams: string[] = [];
    const numDatastreams = Math.floor(Math.random() * 5) + 1;
    for (let j = 0; j < numDatastreams; j++) {
      const randomDatastream = availableDatastreams[Math.floor(Math.random() * availableDatastreams.length)];
      if (!selectedDatastreams.includes(randomDatastream)) {
        selectedDatastreams.push(randomDatastream);
      }
    }

    const permissionTypes = [
      'Campaign Read Access',
      'Campaign Write Access',
      'Audience Data Access',
      'Conversion Tracking',
      'Reporting API Access',
      'Creative Management',
      'Budget Management',
      'Analytics Data',
      'User Management',
      'Account Settings'
    ];

    permissionChanges.push({
      id: `perm-${i + 1}`,
      authorizationId: auth.id,
      permissionName: `${dataSource} ${permissionTypes[Math.floor(Math.random() * permissionTypes.length)]} ${Math.floor(Math.random() * 1000)}`,
      action: Math.random() > 0.6 ? 'Added' : 'Removed', // 40% removed, 60% added
      dateTime: randomDate,
      workspace: auth.workspace,
      dataSource: dataSource,
      datastreamNames: selectedDatastreams,
      usedInDatastreams: selectedDatastreams.length
    });
  }

  // Sort by date descending
  return permissionChanges.sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime());
};

// Generate the data
export const authorizations = generateAuthorizations();
export const permissionChanges = generatePermissionChanges(authorizations);

// Helper function to get permission changes for a specific authorization
export const getPermissionChangesForAuth = (authId: string): PermissionChange[] => {
  return permissionChanges.filter(change => change.authorizationId === authId);
};

// Helper function to get recent permission changes for email notification
export const getRecentPermissionChanges = (days: number = 1): PermissionChange[] => {
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return permissionChanges.filter(change => change.dateTime >= cutoff);
};