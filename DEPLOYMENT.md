# GitHub Pages Deployment Instructions

## Issue: 404 Error for main.tsx

If you see an error like:
```
GET https://psticea.github.io/src/main.tsx net::ERR_ABORTED 404 (Not Found)
```

This means GitHub Pages is serving the source `index.html` instead of the built version from `dist/`.

## Solution

### 1. Check GitHub Pages Settings

Go to your repository settings → Pages and ensure:
- **Source** is set to **"GitHub Actions"** (NOT "Deploy from a branch")
- This allows the workflow in `.github/workflows/deploy.yml` to handle deployment

### 2. Verify Workflow Ran Successfully

- Go to the "Actions" tab in your GitHub repository
- Check that the "Deploy to GitHub Pages" workflow completed successfully
- If it failed, check the logs for errors

### 3. Clear Browser Cache

After fixing the settings:
- Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
- Or open in incognito/private mode

### 4. Verify Correct URL

Make sure you're visiting:
```
https://psticea.github.io/cookingbook/
```

NOT:
```
https://psticea.github.io/
```

## How It Works

1. The workflow builds the project: `npm run build`
2. This creates optimized files in the `dist/` folder
3. The `dist/index.html` references `/cookingbook/assets/index-[hash].js`
4. GitHub Actions uploads and deploys the `dist/` folder contents
5. GitHub Pages serves the built files from `dist/`

## Current Configuration

- **Base path**: `/cookingbook/` (set in `vite.config.ts`)
- **Build output**: `dist/` folder
- **Deployment**: GitHub Actions workflow
- **SPA routing**: Handled by `404.html` and redirect script in `index.html`

## Troubleshooting

If the issue persists:

1. **Re-run the workflow**:
   - Go to Actions tab
   - Click on the latest workflow run
   - Click "Re-run all jobs"

2. **Check the deployed files**:
   - The deployed site should serve `dist/index.html`
   - Which references `/cookingbook/assets/index-[hash].js`
   - NOT `/src/main.tsx`

3. **Verify base path**:
   - In `vite.config.ts`, `base` should be `'/cookingbook/'`
   - This matches your repository name

## Manual Deployment (Alternative)

If GitHub Actions deployment doesn't work, you can deploy manually:

```bash
# Build the project
npm run build

# The dist folder now contains the production build
# You can deploy this folder to any static hosting service
```

For GitHub Pages manual deployment:
1. Create a `gh-pages` branch
2. Copy contents of `dist/` to the root of `gh-pages` branch
3. Push to GitHub
4. Set Pages source to "Deploy from branch: gh-pages"
