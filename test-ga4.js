const fs = require('fs');
const envContent = fs.readFileSync('.env.local', 'utf-8');
const match = envContent.match(/GOOGLE_APPLICATION_CREDENTIALS_JSON='(.*?)'/);
if(match) process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON = match[1];
const propMatch = envContent.match(/GA4_PROPERTY_ID=(.*)/);
if(propMatch) process.env.GA4_PROPERTY_ID = propMatch[1];
const { BetaAnalyticsDataClient } = require('@google-analytics/data');

async function testGA4() {
  try {
    const creds = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
    const client = new BetaAnalyticsDataClient({ credentials: creds });
    const propertyId = process.env.GA4_PROPERTY_ID;
    
    console.log("Checking property:", propertyId);
    console.log("Using email:", creds.client_email);

    const [response] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      metrics: [{ name: 'sessions' }]
    });
    
    console.log("Success! Data:", JSON.stringify(response.rows));
  } catch (err) {
    console.error("API Error:", err.message);
  }
}
testGA4();
