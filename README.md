# Gitfolio: Your AI-Powered Developer Portfolio

Welcome to Gitfolio! This application generates a personalized, feature-rich developer portfolio website by analyzing a user's GitHub profile and allowing extensive manual customization. It leverages Generative AI to create professional summaries and suggest relevant skills, providing a comprehensive and polished showcase of a developer's work.

## Table of Contents

1.  [Core Purpose](#core-purpose)
2.  [Key Features](#key-features)
    - [GitHub Profile Analysis](#github-profile-analysis)
    - [AI-Powered Content Generation](#ai-powered-content-generation)
    - [Customizable Sections](#customizable-sections)
    - [Dynamic Theming](#dynamic-theming)
    - [Portfolio Sharing & Export](#portfolio-sharing--export)
3.  [Workflows & Functionality](#workflows--functionality)
    - [Generating a Portfolio](#generating-a-portfolio)
    - [Theming and Customization](#theming-and-customization)
    - [Editing and Previewing](#editing-and-previewing)
    - [Managing Content](#managing-content)
4.  [Styling Architecture](#styling-architecture)
5.  [Getting Started (Setup)](#getting-started-setup)

## Core Purpose

Gitfolio is designed to solve a common problem for developers: creating a compelling portfolio is time-consuming. This application streamlines the process by automatically fetching and beautifully presenting your GitHub projects, and then enriches this foundation with AI-generated insights and manual additions. The result is a professional, modern, and highly personal portfolio that can be created in minutes, not hours.

## Key Features

### GitHub Profile Analysis

-   **Automatic Data Fetching**: Simply enter a GitHub username to fetch the user's profile information (bio, location, stats) and public repositories.
-   **Top Projects Showcase**: Automatically filters out forked repositories and sorts projects by stars to highlight your most popular work.
-   **Language Analysis**: Visualizes your primary programming languages in a bar chart, giving an at-a-glance view of your technical expertise.
-   **Contribution Graph**: Displays your GitHub contribution history for the past year.
-   **Visitor Analytics**: Tracks unique page views for each portfolio using Firebase, displaying a view count to showcase popularity.

### User Authentication
-   **GitHub Login**: Securely sign in with your GitHub account to manage your session.
-   **Personalized Experience**: Authentication lays the foundation for future features like saving customizations (coming soon).

### AI-Powered Content Generation

-   **Professional Summary**: An AI flow analyzes your GitHub bio, repository descriptions, and (optionally) your resume text to generate a concise, professional summary that highlights your key skills and experience patterns.
-   **Skill Suggestions**: Based on your repositories, summary, and career history, the AI can suggest relevant technical skills, tools, and methodologies (e.g., 'React', 'Docker', 'Agile') to add to your profile.
-   **Article Summarization**: When you add an article you've written, the AI reads the content and produces a succinct 3-sentence summary, perfect for giving visitors a quick takeaway.

### Customizable Sections

-   **Career Journey**: Manually add or let the AI extract your work experience and education from your resume. Each entry is displayed chronologically on a timeline.
-   **Skills & Tools**: Add custom tags for your skills and tools. These are displayed as distinct badges. You can add them manually or use the AI to suggest them.
-   **External Projects**: Showcase work that isn't on GitHub. The form allows you to add a project with a title, description, thumbnail image URL, and a link to the live project.
-   **My Articles**: Add links to blog posts or articles you've written. Paste the full content to get an AI-generated summary for each one.
-   **Resume Integration**: Link to an external resume file (e.g., PDF) or upload one directly. You can also paste your resume text to significantly improve the AI-generated summary and career journey.

### Dynamic Theming

-   **Theme Switcher**: A theme switcher in the header (paintbrush icon) allows for instant visual transformation of the entire portfolio.
-   **Brutalist Theme (Default)**: A bold, modern design featuring hard shadows, solid borders, and a striking primary color.
-   **Minimalist Theme**: A clean, understated design with softer shadows, no-fill cards, and a more subtle color palette.
-   **Neon Theme**: A dark, high-contrast theme with vibrant colors and glowing effects, perfect for a futuristic look.
-   **Playful Theme**: A fun, colorful theme with rounded corners and a friendly vibe.
-   **Professional Theme**: A polished, corporate-friendly design with a neutral color palette and elegant typography.

### Portfolio Sharing & Export

-   **Preview Mode**: Toggle between the "Editing" view (with forms and buttons) and a clean "Preview" mode that shows how visitors will see your portfolio.
-   **Shareable Link**: A dedicated "Share" button copies a direct link to the clean, preview version of your portfolio to your clipboard.
-   **Download as PDF**: Generate and download a high-quality PDF of your portfolio for offline sharing or job applications.

## Workflows & Functionality

This section details the step-by-step user interactions.

### Generating a Portfolio

1.  **Homepage**: The user lands on the homepage, which features a prominent input field.
2.  **Enter Username**: The user types a valid GitHub username into the input.
3.  **Click "Generate Portfolio"**: This submits the form.
4.  **Redirection & Data Fetching**: The app redirects to `/[username]` and fetches the user's data from the GitHub API. Simultaneously, it triggers the `analyzeGithubProfile` AI flow.
5.  **Display Portfolio**: The portfolio page is rendered with all the fetched and generated content.

### Theming and Customization

1.  **Locate Switcher**: The user clicks the paintbrush icon in the header.
2.  **Select Theme**: A dropdown appears with "Brutalist" and "Minimalist" options.
3.  **Apply Theme**: Clicking a theme name instantly updates the site's CSS variables, changing colors, shadows, borders, and other visual properties site-wide. The choice is saved for future visits.

### Editing and Previewing

-   **Toggle Preview Mode**: The floating action button with the **Eye** icon toggles Preview Mode.
    -   **Off (Editing)**: All forms, "Add" buttons, and "Remove" buttons are visible.
    -   **On (Preview)**: All editing controls are hidden, showing a clean, visitor-facing version of the portfolio. Sections with no content are also hidden in this mode.

### Managing Content

-   **Adding an Item**: In any section (e.g., Articles, External Projects, Skills), the user fills out the respective form and clicks the "Add" or "Summarize" button. The new item immediately appears in the list.
-   **Removing an Item**: Next to each manually added item (article, project, skill, or career entry), a **Trash Can** icon is visible in editing mode. Clicking it removes the item from the list.
-   **AI Skill Generation**: In the "Skills & Tools" section, clicking "Suggest Skills with AI" calls the `generateSkills` flow. New, non-duplicate skills are automatically added as badges.
-   **Enhancing with Resume**:
    1.  Go to the "Resume" section.
    2.  Upload a file or link to a resume URL.
    3.  Paste the resume's text content into the large textarea.
    4.  Click "Enhance Portfolio with Resume". This re-runs the AI analysis using the new text, updating the "AI Professional Summary" and "Career Journey" sections.

## Styling Architecture

The dynamic theming is built on a robust system of CSS variables and Tailwind CSS.

-   **`src/app/globals.css`**: This is the core of the theming system. It defines two main classes: `.theme-brutalist` and `.theme-minimalist`. Each class contains a comprehensive set of CSS variables (`--background`, `--primary`, `--shadow-hard`, `--radius`, etc.).
-   **`tailwind.config.ts`**: The Tailwind configuration is set up to use these CSS variables instead of hardcoded values. For example, the background color is `bg-background` which maps to `hsl(var(--background))`. This allows Tailwind's utility classes to be theme-aware.
-   **`ThemeProvider` (`next-themes`)**: This provider wraps the application in `src/app/layout.tsx` and manages which theme class is applied to the root `<html>` element based on user selection.

This architecture makes it easy to add new themes in the future by simply defining a new class with a different set of variable values in `globals.css`.

## Getting Started (Setup)

Follow these steps to set up and run the project locally.

### Prerequisites

-   Node.js (v18 or later)
-   npm, yarn, or pnpm

### Environment Variables

To allow the application to make authenticated requests to the GitHub API and avoid rate limits, you need to create a Personal Access Token. You also need a Google AI API key for the generative AI features.

1.  Create a GitHub Personal Access Token with the `public_repo` and `read:user` scopes. You can create one [here](https://github.com/settings/tokens).
2.  Obtain a Google AI API Key from [Google AI Studio](https://aistudio.google.com/app/apikey).
3.  Create a file named `.env.local` in the root of the project.
4.  Add your keys to the `.env.local` file:

    ```bash
    # GitHub Token (Existing)
    GITHUB_TOKEN=your_github_personal_access_token

    # Gemini API Key (Existing)
    GEMINI_API_KEY=your_google_ai_api_key

    # Firebase Configuration (Required for Auth & Analytics)
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    ```

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository_url>
    cd gitfolio
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

### Running the Development Server

To start the development server, run:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.
