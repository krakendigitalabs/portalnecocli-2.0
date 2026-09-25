import { BetaAnalyticsDataClient } from "@google-analytics/data";

// Singleton instance to avoid re-initializing on every request
let analyticsClient: BetaAnalyticsDataClient | null = null;

function getAnalyticsClient() {
  if (analyticsClient) return analyticsClient;

  try {
    const credentialsJsonStr = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
    if (!credentialsJsonStr || credentialsJsonStr === "{}" || credentialsJsonStr.trim() === "") {
      console.warn("No GOOGLE_APPLICATION_CREDENTIALS_JSON provided. Using mock data.");
      return null;
    }

    const credentials = JSON.parse(credentialsJsonStr);
    analyticsClient = new BetaAnalyticsDataClient({
      credentials,
    });
    return analyticsClient;
  } catch (error) {
    console.error("Failed to initialize Google Analytics client:", error);
    return null;
  }
}

export type TrafficData = {
  date: string;
  sessions: number;
  activeUsers: number;
  screenPageViews: number;
};

export type TrafficSummary = {
  totalSessions: number;
  totalActiveUsers: number;
  totalPageViews: number;
  trafficByDate: TrafficData[];
};

export async function getTrafficSummary(): Promise<TrafficSummary> {
  const propertyId = process.env.GA4_PROPERTY_ID;
  const client = getAnalyticsClient();

  if (!client || !propertyId || propertyId === "123456789") {
    // Return mock data for UI testing if not configured
    return getMockTrafficSummary();
  }

  try {
    const [response] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: "30daysAgo",
          endDate: "today",
        },
      ],
      dimensions: [
        {
          name: "date", // YYYYMMDD
        },
      ],
      metrics: [
        {
          name: "sessions",
        },
        {
          name: "activeUsers",
        },
        {
          name: "screenPageViews",
        },
      ],
      orderBys: [
        {
          dimension: {
            dimensionName: "date",
          },
          desc: false,
        },
      ],
    });

    let totalSessions = 0;
    let totalActiveUsers = 0;
    let totalPageViews = 0;
    const trafficByDate: TrafficData[] = [];

    if (response.rows) {
      response.rows.forEach((row) => {
        const dateRaw = row.dimensionValues?.[0]?.value ?? "";
        // Format YYYYMMDD to YYYY-MM-DD for easier reading
        const formattedDate =
          dateRaw.length === 8
            ? `${dateRaw.slice(0, 4)}-${dateRaw.slice(4, 6)}-${dateRaw.slice(6, 8)}`
            : dateRaw;

        const sessions = Number(row.metricValues?.[0]?.value ?? 0);
        const activeUsers = Number(row.metricValues?.[1]?.value ?? 0);
        const screenPageViews = Number(row.metricValues?.[2]?.value ?? 0);

        totalSessions += sessions;
        totalActiveUsers += activeUsers;
        totalPageViews += screenPageViews;

        trafficByDate.push({
          date: formattedDate,
          sessions,
          activeUsers,
          screenPageViews,
        });
      });
    }

    return {
      totalSessions,
      totalActiveUsers,
      totalPageViews,
      trafficByDate,
    };
  } catch (error) {
    console.error("Error fetching GA4 traffic data:", error);
    return getMockTrafficSummary();
  }
}

function getMockTrafficSummary(): TrafficSummary {
  // Generate fake data for the last 15 days
  const trafficByDate: TrafficData[] = [];
  const today = new Date();

  let totalSessions = 0;
  let totalActiveUsers = 0;
  let totalPageViews = 0;

  for (let i = 14; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const formattedDate = d.toISOString().split("T")[0];

    // Randomize some realistic looking data
    const sessions = Math.floor(Math.random() * 50) + 20;
    const activeUsers = Math.floor(sessions * (0.7 + Math.random() * 0.3));
    const screenPageViews = Math.floor(sessions * (1.5 + Math.random() * 2));

    totalSessions += sessions;
    totalActiveUsers += activeUsers;
    totalPageViews += screenPageViews;

    trafficByDate.push({
      date: formattedDate,
      sessions,
      activeUsers,
      screenPageViews,
    });
  }

  return {
    totalSessions,
    totalActiveUsers,
    totalPageViews,
    trafficByDate,
  };
}
