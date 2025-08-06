# 🌐 Recipe Translation Workflow

This document outlines how to translate recipes and manage multilingual content for the recipe website.

## 📋 Quick Start

### Option 1: Template-Based Translation (No API needed)
```bash
npm run translate                 # Translate all modified recipes
npm run translate:force          # Force translate all recipes
npm run translate gnocchi-amatriciana # Translate specific recipe
```

### Option 2: AI-Powered Translation (Recommended)
```bash
# Set up API key (one-time)
export ANTHROPIC_API_KEY=your_key_here

# Or add to .env file
echo "ANTHROPIC_API_KEY=your_key_here" >> .env

# Translate with AI
npm run translate:api
npm run translate:api gnocchi-amatriciana  # Single recipe
```

## 🔄 Workflow Options

### 1. **Build-Time Translation** (Current Setup)
- ✅ Runs automatically on `npm run build`
- ✅ Only translates modified recipes (smart caching)
- ✅ Version controlled translations

**How it works:**
```bash
npm run build  # Translates → then builds
```

### 2. **Manual Translation Workflow**
```bash
# Translate specific recipes
npm run translate recipe-name

# Force retranslate everything
npm run translate:force

# Build without translation
npm run build:no-translate
```

### 3. **API-Powered Translation**
```bash
# One-time setup
npm install @anthropic-ai/sdk

# Set API key
export ANTHROPIC_API_KEY=your_key_here

# Translate with AI
npm run translate:api
```

## 📁 File Structure

```
src/pages/
├── recipes/              # English recipes (source)
│   ├── gnocchi-amatriciana.md
│   └── king-prawn-curry.md
└── nl/recipes/          # Dutch recipes (generated)
    ├── gnocchi-amatriciana.md
    └── king-prawn-curry.md
```

## ✏️ Adding New Recipes

### For English-First Workflow:

1. **Create English recipe:**
```bash
# Add new recipe to src/pages/recipes/
touch src/pages/recipes/new-recipe.md
```

2. **Auto-translate:**
```bash
npm run translate        # Template-based
# OR
npm run translate:api    # AI-powered
```

3. **Build and deploy:**
```bash
npm run build           # Includes translation
```

### For Bilingual Workflow:

1. **Create both versions manually:**
```bash
# English
src/pages/recipes/new-recipe.md
# Dutch  
src/pages/nl/recipes/new-recipe.md
```

2. **Build:**
```bash
npm run build:no-translate  # Skip auto-translation
```

## 🤖 API Translation Setup

### Step 1: Install Dependencies
```bash
npm install @anthropic-ai/sdk
```

### Step 2: Get API Key
- Sign up at [Anthropic Console](https://console.anthropic.com)
- Create API key
- Add to environment

### Step 3: Set Environment Variable
```bash
# Option A: Export in shell
export ANTHROPIC_API_KEY=your_key_here

# Option B: Add to .env file
echo "ANTHROPIC_API_KEY=your_key_here" >> .env

# Option C: Add to hosting platform (Netlify, Vercel, etc.)
```

### Step 4: Use API Translation
```bash
npm run translate:api
```

## 📊 Translation Quality

### Template Translation (Improved):
- ✅ Fast and free
- ✅ Preserves original content integrity
- ✅ No mixed-language issues
- ✅ Translates section headers and key terms
- ⚠️ Content stays in English (relies on UI translations)
- ⚠️ Limited to structural translations

### AI Translation:
- ✅ Full content translation (ingredients, instructions, descriptions)
- ✅ High quality and contextual
- ✅ Understands cooking terminology
- ✅ Preserves tone and style
- 💰 Requires API costs (~$0.01-0.05 per recipe)

## 🔧 Customizing Translations

### Adding Translation Terms
Edit `scripts/translate-recipes.js`:

```js
const TRANSLATION_MAP = {
  // Add your terms here
  'olive oil': 'olijfolie',
  'garlic': 'knoflook',
  // ... more terms
};
```

### Custom AI Prompts
Modify the `translateWithAPI` function to customize how Claude translates:

```js
const prompt = `
Translate this recipe with these specific requirements:
1. Use informal Dutch ("je" instead of "u")
2. Keep Italian food terms untranslated
3. Use metric measurements
...
`;
```

## 🚀 Production Workflows

### CI/CD Integration
```yaml
# .github/workflows/build.yml
- name: Translate recipes
  env:
    ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
  run: npm run translate:api

- name: Build site  
  run: npm run build:no-translate
```

### Netlify/Vercel Deployment
```bash
# Build command
npm run translate:api && npm run build:no-translate

# Environment variables
ANTHROPIC_API_KEY=your_key_here
```

## 📝 Content Guidelines

### Recipe Translation Best Practices:

1. **Keep measurements consistent:** 500g stays 500g
2. **Preserve brand names:** Mutti, Pecorino Romano
3. **Maintain cooking terminology:** al dente, mise en place
4. **Adapt cultural context:** Dutch cooking preferences
5. **Keep formatting:** Markdown structure, emoji usage

### What Gets Translated:
- ✅ Recipe titles and descriptions
- ✅ Ingredients (when appropriate)
- ✅ Instructions and methods
- ✅ Cultural notes and tips
- ❌ Brand names (Mutti, KitchenAid)
- ❌ Measurements (500g, 1 cup)
- ❌ Technical terms (al dente, sauté)

## 🔍 Troubleshooting

### Translation Script Errors:
```bash
# Check permissions
chmod +x scripts/translate-recipes.js

# Check dependencies
node --version  # Should be 18+
npm list @anthropic-ai/sdk  # If using API
```

### Build Issues:
```bash
# Build without translation
npm run build:no-translate

# Clear cache and rebuild
rm -rf dist/ && npm run build
```

### Missing Translations:
```bash
# Force retranslate all
npm run translate:force

# Check file timestamps
ls -la src/pages/recipes/
ls -la src/pages/nl/recipes/
```

## 💡 Tips & Tricks

- **Fast iteration:** Use `npm run build:no-translate` during development
- **Quality check:** Compare AI vs template translations for key recipes
- **Caching:** Translation script only updates changed files
- **Backup:** Keep manual translations by avoiding `--force` flag
- **Cost control:** Use template translation for bulk, API for important recipes