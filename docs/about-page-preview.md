# About Page Preview

This document describes the implemented About Page component.

## Layout Structure

```
┌─────────────────────────────────────────────────────┐
│ Header (Home | Search | Menu)                       │
├─────────────────────────────────────────────────────┤
│                                                      │
│  About the Recipe Website                           │
│  ═══════════════════════                            │
│                                                      │
│  Welcome to our collection of traditional and       │
│  modern recipes. Here you will find delicious       │
│  recipes with clear instructions and easy-to-find   │
│  ingredients.                                       │
│                                                      │
│  About This Site / Despre Acest Site                │
│  ────────────────────────────────────               │
│  [Detailed description about the site]              │
│                                                      │
│  Features / Caracteristici                          │
│  ────────────────────────                           │
│  • Recipes organized into 8 categories              │
│  • Automatic ingredient scaling                     │
│  • Romanian and English support                     │
│  • Dark and light themes                            │
│  • Text size adjustment                             │
│  • Advanced filtering                               │
│  • Quick search                                     │
│  • Responsive design                                │
│                                                      │
│  Our Philosophy / Filosofia Noastră                 │
│  ────────────────────────────────────               │
│  [Description of cooking philosophy]                │
│                                                      │
│  ─────────────────────────────────────────────      │
│                                                      │
│  Comments / Comentarii                              │
│  ────────────────────                               │
│  [Giscus Comment Section]                           │
│  - Sign in with GitHub to comment                   │
│  - Reactions and replies supported                  │
│  - Markdown formatting                              │
│                                                      │
├─────────────────────────────────────────────────────┤
│ Footer (Language | Text Size | Theme)               │
└─────────────────────────────────────────────────────┘
```

## Features Implemented

### 1. Multilingual Content
- **Romanian (default)**: Full content in Romanian
- **English**: Full content in English
- Automatic switching based on user preference
- Uses `useLanguage` hook and `getTranslation` utility

### 2. Content Sections

#### Romanian Version:
- **Despre Acest Site**: Introduction to the website
- **Caracteristici**: List of 8 key features
- **Filosofia Noastră**: Cooking philosophy and approach

#### English Version:
- **About This Site**: Introduction to the website
- **Features**: List of 8 key features
- **Our Philosophy**: Cooking philosophy and approach

### 3. Giscus Comment System

#### Configuration:
- **Platform**: GitHub Discussions
- **Mapping**: pathname (each page gets its own discussion)
- **Theme**: Auto-switches between light/dark based on user preference
- **Language**: Auto-switches between Romanian/English based on user preference
- **Features**: Reactions enabled, bottom input position

#### Dynamic Loading:
- Script loads dynamically via `useEffect`
- Reloads when theme or language changes
- Proper cleanup on component unmount

#### Setup Required:
1. Enable GitHub Discussions on repository
2. Install Giscus app on GitHub repo
3. Get configuration from https://giscus.app
4. Update placeholder values in `AboutPage.tsx`:
   - `data-repo`: Replace `YOUR_USERNAME/YOUR_REPO`
   - `data-repo-id`: Replace `YOUR_REPO_ID`
   - `data-category-id`: Replace `YOUR_CATEGORY_ID`

### 4. Styling

#### Responsive Design:
- Max width: 4xl (56rem / 896px)
- Centered content with padding
- Mobile-friendly spacing

#### Typography:
- Title: 3xl on mobile, 4xl on desktop
- Section headings: 2xl
- Body text: lg with relaxed leading
- Proper spacing between sections

#### Dark Mode Support:
- Text colors adapt to theme
- Border colors adapt to theme
- Prose styling for dark mode
- Giscus theme matches site theme

### 5. Accessibility

- Semantic HTML structure (`<article>`, `<section>`)
- Proper heading hierarchy (h1 → h2)
- Descriptive section titles
- Readable text with good contrast
- Responsive and touch-friendly

## Technical Implementation

### Hooks Used:
- `useLanguage()`: Access current language preference
- `useTheme()`: Access current theme preference
- `useEffect()`: Dynamic Giscus script loading
- `useRef()`: Reference to Giscus container

### Components Used:
- `Header`: Top navigation
- `Footer`: Bottom preference selectors
- Giscus: Comment system (loaded dynamically)

### Utilities Used:
- `getTranslation()`: Fetch translated strings

## User Experience

### Navigation:
1. User clicks "About" in side menu
2. Page loads with content in user's preferred language
3. Theme matches user's preference (dark/light)
4. User can read about the site
5. User can scroll down to comment section
6. User can sign in with GitHub to leave comments

### Preference Changes:
- **Language Switch**: Content and Giscus interface update immediately
- **Theme Switch**: Page theme and Giscus theme update immediately
- **Text Size**: All text scales according to preference

## Privacy & Security

### Giscus Privacy:
- No tracking cookies
- No personal data collected (beyond GitHub profile)
- GDPR compliant by default
- Users control their GitHub data
- No consent banner required

### Data Storage:
- Comments stored in GitHub Discussions
- Moderation via GitHub interface
- All data in your repository

## Moderation

### Via GitHub Discussions:
1. Go to repository → Discussions tab
2. View all comments from the About page
3. Edit, delete, or lock discussions
4. Block users if needed
5. Use GitHub's moderation tools

## Testing Checklist

- [ ] Page loads without errors
- [ ] Content displays in Romanian by default
- [ ] Content switches to English when language changed
- [ ] Theme switches between light and dark
- [ ] Text size adjusts properly
- [ ] Giscus section loads at bottom
- [ ] Giscus theme matches site theme
- [ ] Giscus language matches site language
- [ ] Comments can be posted (after GitHub login)
- [ ] Footer displays correctly
- [ ] Responsive on mobile and desktop
- [ ] No TypeScript errors
- [ ] No console errors

## Next Steps

1. **Setup Giscus** (see GISCUS_SETUP.md):
   - Enable GitHub Discussions
   - Install Giscus app
   - Get configuration values
   - Update AboutPage.tsx with real values

2. **Test Comments**:
   - Deploy the site
   - Navigate to About page
   - Sign in with GitHub
   - Post a test comment
   - Verify it appears in GitHub Discussions

3. **Customize Content** (optional):
   - Add more sections if needed
   - Include images or screenshots
   - Add links to social media
   - Include contact information
