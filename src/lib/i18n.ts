export const translations = {
  en: {
    nav: {
      home: 'Home',
      recipes: 'Recipes',
      tags: 'Tags'
    },
    home: {
      title: 'Recipes',
      searchPlaceholder: 'Search recipes...',
      filterByTags: 'Filter by tags',
      allTags: 'All Tags',
      noRecipesFound: 'No recipes found matching your search.'
    },
    recipe: {
      prepTime: 'Prep Time',
      cookTime: 'Cook Time',
      totalTime: 'Total Time',
      yield: 'Yield',
      ingredients: 'Ingredients',
      instructions: 'Instructions'
    },
    footer: {
      madeWith: 'Made with',
      and: 'and'
    }
  },
  nl: {
    nav: {
      home: 'Home',
      recipes: 'Recepten',
      tags: 'Tags'
    },
    home: {
      title: 'Recepten',
      searchPlaceholder: 'Zoek recepten...',
      filterByTags: 'Filter op tags',
      allTags: 'Alle Tags',
      noRecipesFound: 'Geen recepten gevonden die overeenkomen met uw zoekopdracht.'
    },
    recipe: {
      prepTime: 'Bereidingstijd',
      cookTime: 'Kooktijd',
      totalTime: 'Totale tijd',
      yield: 'Opbrengst',
      ingredients: 'Ingrediënten',
      instructions: 'Instructies'
    },
    footer: {
      madeWith: 'Gemaakt met',
      and: 'en'
    }
  }
} as const;

export type Locale = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;

export function getTranslation(locale: Locale = 'en') {
  return translations[locale] || translations.en;
}

export function t(locale: Locale, key: string): string {
  const translation = getTranslation(locale);
  const keys = key.split('.');
  let result: any = translation;
  
  for (const k of keys) {
    result = result?.[k];
  }
  
  return result || key;
}