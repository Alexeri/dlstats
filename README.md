# 🎮 Deadlock Tracker - Competitive Game Analytics Platform

## 📖 Description

Deadlock Tracker is a modern web application where players can explore in-depth game analytics, hero statistics, player leaderboards, match data, and performance insights for the game Deadlock.
Built with **Next.js 15**, **TypeScript**, and **TanStack Query**, the app provides real-time data fetching, interactive tables, and a sleek, responsive UI for competitive analysis and personal progress tracking.

## 📑 Table of Contents

- ✨ [Features](#-features)
- 🛠️ [Technologies](#-technologies)
- 🎨 [Screenshots](#-screenshots)
- ⚡ [Installation](#-installation)
- 📂 [Project Structure](#-project-structure)

## ✨ Features

- **Meta Insights:** Explore the current hero meta, including win rates, pick rates, and performance tiers across ranks and timeframes.
- **Hero Pages:** View detailed hero statistics, counters, builds, and rankings based on aggregated game data.
- **Hero Search:** Quickly find heroes by name to view their detailed stats, counters, and performance data.
- **Leaderboards:** Browse regional player leaderboards, ranked by performance and signature heroes.
- **Match Data:** Access recently played matches with metadata, detailed team compositions, and player performance summaries.
- **Player Profiles:** View player information, match history, hero performance stats, and overall win rate analytics.
- **Filtering & Sorting:** Filter data by region, rank, timeframe, or hero; sort tables dynamically to reveal top performers or trends.
- **Server-Side Prefetching:** Faster page loads with pre-hydrated TanStack Query data on the server.
- **Live API Integration:** Powered by the [Deadlock API](https://deadlock-api.com/) for up-to-date stats and match information.

## 🛠 Technologies

- [Next.js 15 (App Router)](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tanstack Query v5](https://tanstack.com/query/latest)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Tanstack Table v8](https://tanstack.com/table/latest)
- [Deadlock API](https://deadlock-api.com/)

## 🎨 Screenshots

### Frontpage
<img width="1920" height="917" alt="brave_eZqrz8U6Yf" src="https://github.com/user-attachments/assets/59592852-6b85-4608-8ae1-4774dcfc7735" />

### Tierlist Page
<img width="1920" height="917" alt="image" src="https://github.com/user-attachments/assets/4ff5d8f2-3a07-4c4e-aadc-4bde7dceaace" />

### Individual Hero Page
<img width="1920" height="917" alt="image" src="https://github.com/user-attachments/assets/44ea2a88-0e22-4c8a-9214-0714c65a5226" />

### Recent Matches Page
<img width="1920" height="917" alt="image" src="https://github.com/user-attachments/assets/d64184ff-c755-40a9-b419-ef4867018053" />

### Match Page
<img width="1920" height="917" alt="image" src="https://github.com/user-attachments/assets/e7a6526c-aa20-4fae-9af3-5047fca9cfbe" />

### Profile Page
<img width="1920" height="917" alt="image" src="https://github.com/user-attachments/assets/ea5d30fe-9260-4548-8ae8-d30c72561742" />

### Leaderboards Page
<img width="1920" height="917" alt="image" src="https://github.com/user-attachments/assets/1c79ab76-bfa7-4836-8709-dd0a539ad23e" />

## ⚡ Installation

1.  **Clone repository:**

    ```bash
    https://github.com/Alexeri/dlstats.git
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Run development server:**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## 📂 Project Structure

```
app/
├── src/
│   ├── app/             # Next.js routes
│   ├── components/      # React components
│   ├── lib/             # Utility functions and data
├── next.config.ts       # Next.js configuration
├── package.json         # Project dependencies
```
