#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RECIPES_DIR = path.join(__dirname, '../src/pages/recipes');
const NL_RECIPES_DIR = path.join(__dirname, '../src/pages/nl/recipes');

/**
 * Translation workflow for recipe content
 * 
 * This script provides several approaches:
 * 1. API-based translation (requires API key)
 * 2. Template-based translation (predefined mappings)
 * 3. Manual translation workflow (creates TODO files)
 */

// Common recipe term translations
const TRANSLATION_MAP = {
  // Measurements stay the same
  // Ingredients - common terms
  'olive oil': 'olijfolie',
  'garlic': 'knoflook',
  'onion': 'ui',
  'salt': 'zout',
  'pepper': 'peper',
  'water': 'water',
  
  // Recipe terms
  'Ingredients': 'Ingrediënten',
  'Instructions': 'Instructies',
  'Method': 'Bereidingswijze',
  'Prep Time': 'Bereidingstijd',
  'Cook Time': 'Kooktijd',
  'Total Time': 'Totale tijd',
  'Yield': 'Portie',
  'servings': 'porties',
  
  // Actions
  'Heat': 'Verhit',
  'Add': 'Voeg toe',
  'Cook': 'Kook',
  'Simmer': 'Sudder',
  'Boil': 'Kook',
  'Fry': 'Bak',
  'Sauté': 'Bak',
  'Mix': 'Meng',
  'Stir': 'Roer',
  'Season': 'Breng op smaak',
  'Serve': 'Serveer',
};

/**
 * API-based translation using Claude
 */
async function translateWithAPI(content, apiKey) {
  try {
    const { Anthropic } = await import('@anthropic-ai/sdk');
    
    const anthropic = new Anthropic({ apiKey });
    
    const prompt = `
You are a professional recipe translator. Translate this ENTIRE English recipe to Dutch. 

CRITICAL REQUIREMENTS:
1. TRANSLATE THE COMPLETE RECIPE - no shortcuts, no "[Rest of sections...]" notes, no meta-commentary
2. Return ONLY the translated content - no explanations, notes, or incomplete sections

FRONTMATTER RULES:
- TRANSLATE: title, description, recipeIngredient array items, recipeInstructions array text
- KEEP UNCHANGED: date, image, tags, prepTime, cookTime, totalTime, recipeYield, layout
- For recipeIngredient: Translate ingredient names but keep measurements and brand names exactly
- For recipeInstructions: Translate the "text" field completely

INGREDIENT TRANSLATION EXAMPLES:
"500g potato gnocchi" -> "500g aardappel gnocchi"
"1 can Mutti San Marzano tomatoes" -> "1 blik Mutti San Marzano tomaten"
"2 tbsp olive oil" -> "2 el olijfolie"

INSTRUCTION TRANSLATION:
Translate cooking steps naturally into Dutch while keeping:
- All measurements exact (2 min, 180°C, etc.)
- Brand names unchanged (Mutti, KitchenAid)
- Technical terms where appropriate (al dente, sauté)

MARKDOWN CONTENT:
- Translate ALL content sections completely
- Keep all formatting (##, *, -, emojis, etc.)
- Translate ingredients lists, instructions, cultural notes - everything
- NO incomplete sections or placeholder text

Recipe to translate:
${content}

IMPORTANT: Provide the COMPLETE translation with every section fully translated.
    `;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 8000,
      messages: [{ role: 'user', content: prompt }]
    });

    return response.content[0].text;
  } catch (error) {
    console.error('API translation failed:', error.message);
    return null;
  }
}

/**
 * Template-based translation using structured approach
 * Only translates frontmatter fields and section headers to avoid mixed languages
 */
function translateWithTemplate(content) {
  const lines = content.split('\n');
  const translatedLines = [];
  let inFrontmatter = false;
  let inYamlArray = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let translatedLine = line;
    
    // Track frontmatter boundaries
    if (line.trim() === '---') {
      inFrontmatter = !inFrontmatter;
      translatedLines.push(line);
      continue;
    }
    
    if (inFrontmatter) {
      // Translate specific frontmatter fields
      if (line.includes('recipeYield:') && line.includes('servings')) {
        translatedLine = line.replace('servings', 'porties');
      }
      
      // Don't translate ingredients or instructions arrays in frontmatter
      // They're meant to be consumed by the layout which handles translation
      
    } else {
      // Only translate standalone section headers in markdown content
      if (line.match(/^#{1,6}\s/)) {
        // Translate common section headers
        translatedLine = line
          .replace(/^(#{1,6}\s*)🧂\s*Ingredients/i, '$1🧂 Ingrediënten')
          .replace(/^(#{1,6}\s*)🥩\s*Ingredients/i, '$1🥩 Ingrediënten')
          .replace(/^(#{1,6}\s*)Ingredients/i, '$1Ingrediënten')
          .replace(/^(#{1,6}\s*)🔪\s*Method/i, '$1🔪 Bereidingswijze')
          .replace(/^(#{1,6}\s*)🔥\s*Instructions/i, '$1🔥 Instructies')
          .replace(/^(#{1,6}\s*)Method/i, '$1Bereidingswijze')
          .replace(/^(#{1,6}\s*)Instructions/i, '$1Instructies')
          .replace(/^(#{1,6}\s*)Cultural Notes/i, '$1Culturele notities')
          .replace(/^(#{1,6}\s*)Tips/i, '$1Tips');
      }
    }
    
    translatedLines.push(translatedLine);
  }
  
  return translatedLines.join('\n');
}

/**
 * Check if Dutch translation needs updating
 */
function needsTranslation(englishPath, dutchPath) {
  if (!fs.existsSync(dutchPath)) return true;
  
  const englishStats = fs.statSync(englishPath);
  const dutchStats = fs.statSync(dutchPath);
  
  return englishStats.mtime > dutchStats.mtime;
}

/**
 * Main translation function
 */
async function translateRecipes(options = {}) {
  const { 
    force = false, 
    useAPI = false, 
    apiKey = process.env.ANTHROPIC_API_KEY,
    specific = null 
  } = options;

  // Ensure Dutch recipes directory exists
  if (!fs.existsSync(NL_RECIPES_DIR)) {
    fs.mkdirSync(NL_RECIPES_DIR, { recursive: true });
  }

  // Get recipe files
  const recipeFiles = fs.readdirSync(RECIPES_DIR)
    .filter(file => file.endsWith('.md'))
    .filter(file => !specific || file === `${specific}.md`);

  console.log(`🔄 Translating ${recipeFiles.length} recipe(s)...`);

  const results = {
    translated: 0,
    skipped: 0,
    errors: 0
  };

  for (const file of recipeFiles) {
    const englishPath = path.join(RECIPES_DIR, file);
    const dutchPath = path.join(NL_RECIPES_DIR, file);

    // Skip if translation is up-to-date
    if (!force && !needsTranslation(englishPath, dutchPath)) {
      console.log(`⏭️  Skipping ${file} (up-to-date)`);
      results.skipped++;
      continue;
    }

    try {
      console.log(`📝 Translating ${file}...`);
      
      const englishContent = fs.readFileSync(englishPath, 'utf8');
      let dutchContent;

      if (useAPI && apiKey) {
        console.log(`  🤖 Using API translation...`);
        dutchContent = await translateWithAPI(englishContent, apiKey);
        
        if (!dutchContent) {
          console.log(`  ⚠️  API failed, falling back to template...`);
          dutchContent = translateWithTemplate(englishContent);
        }
      } else {
        console.log(`  📋 Using template translation...`);
        dutchContent = translateWithTemplate(englishContent);
      }

      // Update layout path for Dutch version
      dutchContent = dutchContent.replace(
        'layout: ../../layouts/RecipeLayout.astro',
        'layout: ../../../layouts/RecipeLayout.astro'
      );

      fs.writeFileSync(dutchPath, dutchContent, 'utf8');
      console.log(`  ✅ Translated ${file}`);
      results.translated++;

    } catch (error) {
      console.error(`  ❌ Error translating ${file}:`, error.message);
      results.errors++;
    }
  }

  console.log(`\n📊 Translation Summary:`);
  console.log(`  ✅ Translated: ${results.translated}`);
  console.log(`  ⏭️  Skipped: ${results.skipped}`);
  console.log(`  ❌ Errors: ${results.errors}`);

  if (useAPI && !apiKey) {
    console.log(`\n💡 Tip: Set ANTHROPIC_API_KEY environment variable for better translations`);
  }
}

/**
 * CLI interface
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  
  const options = {
    force: args.includes('--force'),
    useAPI: args.includes('--api'),
    specific: args.find(arg => !arg.startsWith('--'))
  };

  if (args.includes('--help')) {
    console.log(`
🔄 Recipe Translation Script

Usage:
  node scripts/translate-recipes.js [options] [recipe-name]

Options:
  --api        Use API translation (requires ANTHROPIC_API_KEY)
  --force      Force retranslation of all recipes
  --help       Show this help

Examples:
  npm run translate                    # Translate all modified recipes
  npm run translate --api              # Use API translation
  npm run translate --force            # Force translate all
  npm run translate gnocchi-amatriciana # Translate specific recipe
  
Environment Variables:
  ANTHROPIC_API_KEY    API key for Claude translations
    `);
    process.exit(0);
  }

  translateRecipes(options).catch(console.error);
}

export { translateRecipes };