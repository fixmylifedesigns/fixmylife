# FixMyLife - YouTube Automation Platform

FixMyLife is a Next.js application that helps content creators automate their YouTube posting workflow, particularly for repurposing TikTok content to YouTube.

## Features

- YouTube OAuth integration
- Schedule posts from TikTok to YouTube
- Post content immediately
- Google Sheets as database (with future PostgreSQL scalability)
- Dashboard with analytics
- SEO optimization
- Responsive design with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js with YouTube OAuth
- **Database**: Google Sheets API (initial version)
- **Deployment**: Vercel (recommended)

## Project Structure

```
/src
  ├── /app
  │   ├── /layout.js        # Global layout with meta tags
  │   ├── /page.js          # Landing page
  │   ├── /dashboard        # Dashboard home
  │   ├── /login            # Login page (YouTube OAuth)
  │   ├── /schedule         # Form to schedule posts
  │   ├── /post-now         # Instant YouTube posting
  │   ├── /api              # API routes
  │   ├── /sitemap.js       # SEO optimization
  │   └── /privacy          # Privacy policy
  ├── /components           # Reusable UI components
  ├── /styles               # Global Tailwind styles
  └── /utils                # Helper functions
```

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Google Cloud Platform account (for YouTube API and Google Sheets API)

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# Google OAuth (for YouTube)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Google Sheets
GOOGLE_SHEETS_SPREADSHEET_ID=your-spreadsheet-id
GOOGLE_SHEETS_CLIENT_EMAIL=your-service-account-email
GOOGLE_SHEETS_PRIVATE_KEY="your-private-key"
```

### Google Cloud Platform Setup

1. Create a new project in Google Cloud Console
2. Enable the YouTube Data API v3
3. Enable the Google Sheets API
4. Create OAuth 2.0 credentials (for YouTube OAuth)
5. Create a service account (for Google Sheets API)
6. Share your Google Sheet with the service account email

### Google Sheets Structure

Create a Google Sheet with the following structure:

**Scheduled Posts** (Sheet 1):
- Column A: id
- Column B: tiktokUrl
- Column C: youtubeTitle
- Column D: youtubeDescription
- Column E: scheduledFor
- Column F: status
- Column G: tags
- Column H: visibility
- Column I: category

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/fixmylife.git
cd fixmylife
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

### Deploying to Vercel

1. Push your code to a GitHub repository
2. Create a new project in Vercel
3. Connect your GitHub repository
4. Configure environment variables in Vercel
5. Deploy

## Future Enhancements

- Migration to PostgreSQL database
- Multiple YouTube account support
- Automated cron jobs for scheduled uploads
- Enhanced analytics dashboard
- API-first architecture

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by Berry React Material Admin Dashboard