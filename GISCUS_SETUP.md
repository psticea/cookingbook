# Giscus Setup Instructions

This document provides step-by-step instructions for setting up Giscus comments on the About page.

## What is Giscus?

Giscus is a free, open-source commenting system powered by GitHub Discussions. It provides:
- ✅ Completely free, no ads
- ✅ No backend required
- ✅ Privacy-friendly (GDPR compliant)
- ✅ Users comment with GitHub accounts
- ✅ Supports reactions and replies
- ✅ Markdown formatting support
- ✅ Automatic spam protection via GitHub
- ✅ Easy moderation via GitHub Discussions
- ✅ Themes match site (light/dark auto-switching)

## Prerequisites

- A GitHub account
- A public GitHub repository for this project
- GitHub Discussions enabled on your repository

## Setup Steps

### 1. Enable GitHub Discussions

1. Go to your GitHub repository
2. Click on **Settings** tab
3. Scroll down to the **Features** section
4. Check the box next to **Discussions**
5. Click **Set up discussions** if prompted

### 2. Install the Giscus App

1. Visit https://github.com/apps/giscus
2. Click **Install**
3. Select your repository
4. Grant the necessary permissions

### 3. Configure Giscus

1. Go to https://giscus.app
2. Fill in the configuration form:
   - **Repository**: Enter your repository in the format `username/repo-name`
   - **Page ↔️ Discussions Mapping**: Select **pathname** (recommended)
   - **Discussion Category**: Select **General** or create a new category
   - **Features**: Enable **reactions** (recommended)
   - **Theme**: This is handled automatically by the app (light/dark switching)

3. The site will generate your configuration values:
   - `data-repo`: Your repository name
   - `data-repo-id`: Your repository ID
   - `data-category-id`: Your discussion category ID

### 4. Update the AboutPage Component

Open `src/pages/AboutPage.tsx` and replace the placeholder values:

```typescript
// Find these lines (around line 25-27):
script.setAttribute('data-repo', 'YOUR_USERNAME/YOUR_REPO'); // TODO: Replace with actual repo
script.setAttribute('data-repo-id', 'YOUR_REPO_ID'); // TODO: Replace with actual repo ID
script.setAttribute('data-category-id', 'YOUR_CATEGORY_ID'); // TODO: Replace with actual category ID

// Replace with your actual values from giscus.app:
script.setAttribute('data-repo', 'your-username/your-repo-name');
script.setAttribute('data-repo-id', 'R_kgDOxxxxxxx');
script.setAttribute('data-category-id', 'DIC_kwDOxxxxxxx');
```

### 5. Test the Integration

1. Build and deploy your site
2. Navigate to the About page
3. You should see the Giscus comment section at the bottom
4. Try posting a test comment (requires GitHub login)
5. Check your repository's Discussions tab to see the comment

## Features

### Automatic Theme Switching

The Giscus component automatically switches between light and dark themes based on the user's theme preference. This is handled by the `useTheme` hook.

### Language Support

The Giscus interface language automatically switches between Romanian and English based on the user's language preference. This is handled by the `useLanguage` hook.

### Moderation

All comments are stored in your GitHub repository's Discussions section. You can:
- View all comments in the **Discussions** tab
- Edit or delete comments
- Lock discussions to prevent further comments
- Block users if needed
- Use all standard GitHub moderation tools

## Privacy

Giscus is privacy-friendly:
- No tracking cookies
- No personal data collected beyond what GitHub provides
- GDPR compliant by default
- Users control their GitHub data
- No consent banner required

## Troubleshooting

### Comments not showing up?

1. Verify GitHub Discussions is enabled on your repository
2. Check that the Giscus app is installed on your repository
3. Verify the `data-repo`, `data-repo-id`, and `data-category-id` values are correct
4. Check the browser console for any errors
5. Ensure your repository is public (Giscus requires public repos)

### Theme not switching?

The theme should automatically switch based on the user's preference. If it's not working:
1. Check that the `useTheme` hook is properly imported
2. Verify the theme value is being passed to the Giscus script
3. Clear your browser cache and reload

### Language not switching?

The language should automatically switch based on the user's preference. If it's not working:
1. Check that the `useLanguage` hook is properly imported
2. Verify the language value is being passed to the Giscus script
3. The Giscus script needs to reload when language changes (handled by the useEffect)

## Additional Resources

- Giscus Documentation: https://giscus.app
- GitHub Discussions Documentation: https://docs.github.com/en/discussions
- Giscus GitHub Repository: https://github.com/giscus/giscus
