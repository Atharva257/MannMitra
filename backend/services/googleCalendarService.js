import { google } from 'googleapis';
import { v4 as uuidv4 } from 'uuid';

// OAuth2 client is initialized lazily inside createMeeting()
// so that dotenv has time to load env vars before they are read.

/**
 * Creates a Google Calendar event with a Google Meet link
 * @param {string} summary - Title of the meeting
 * @param {string} startTime - ISO String of start time
 * @param {number} duration - Duration in minutes
 * @returns {Promise<{link: string, eventId: string}>}
 */
export const createMeeting = async (summary, startTime, duration = 30) => {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN } = process.env;

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN) {
    throw new Error('Google Calendar env vars (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN) are not set.');
  }

  const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
  );

  oauth2Client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const start = new Date(startTime);
  const end = new Date(start.getTime() + duration * 60000);

  const event = {
    summary: summary,
    description: 'MannMitra Wellness Session',
    start: {
      dateTime: start.toISOString(),
      timeZone: 'UTC',
    },
    end: {
      dateTime: end.toISOString(),
      timeZone: 'UTC',
    },
    conferenceData: {
      createRequest: {
        requestId: uuidv4(),
        conferenceSolutionKey: {
          type: 'hangoutsMeet',
        },
      },
    },
  };

  const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';

  try {
    // Attempt to create event with Google Meet
    const response = await calendar.events.insert({
      calendarId: calendarId,
      resource: event,
      conferenceDataVersion: 1,
    });

    console.log('Google Calendar event created with Meet link:', response.data.hangoutLink);
    return {
      link: response.data.hangoutLink,
      eventId: response.data.id,
    };
  } catch (conferenceError) {
    // If conference creation fails, fallback to creating a normal event
    console.error('Failed to create event with Google Meet! CONFERENCE ERROR:', conferenceError.response?.data || conferenceError.stack || conferenceError.message);

    const { conferenceData, ...eventWithoutConference } = event;

    const fallbackResponse = await calendar.events.insert({
      calendarId: calendarId,
      resource: eventWithoutConference,
    });

    console.log('Google Calendar event created (no Meet link)');
    return {
      link: null, // No Meet link
      eventId: fallbackResponse.data.id,
    };
  }
};