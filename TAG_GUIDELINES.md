# Recipe Tagging Guidelines

## Streamlined Tag System (12 Core Tags)

This document defines the standardized tagging system for recipe categorization. Use **2-4 tags per recipe** from the categories below.

### 🍽️ **Dish Type** (Choose 1 if applicable)
- `soup` - Liquid-based dishes (Tom Kha Goong)
- `curry` - Curry-based dishes (Thai Red Curry, Rendang)
- `pasta` - Pasta dishes (Gnocchi Amatriciana)
- `rice` - Rice-based dishes (Fried Rice)

### 🥩 **Protein** (Choose 1)
- `beef` - Beef dishes (Miso Ribeye, Rendang)
- `seafood` - Fish, shrimp, shellfish (King Prawn Curry, Tom Kha)
- `vegetarian` - Meat-free dishes (Shiitake Burger, Sweet Potato Brûlée)

### 🌍 **Cuisine** (Choose 1)
- `asian` - Thai, Chinese, Japanese, Indonesian cuisine
- `italian` - Italian dishes
- `mediterranean` - Mediterranean/Middle Eastern cuisine

### ⏰ **Meal Type** (Choose 1)
- `dinner` - Main meals (most recipes)
- `brunch` - Brunch/breakfast dishes

## Tagging Examples

```yaml
# Asian Curry
tags: [curry, seafood, asian, dinner]

# Italian Pasta  
tags: [pasta, italian, dinner]

# Vegetarian Brunch
tags: [vegetarian, brunch]
```

## Guidelines for New Recipes

1. **Use 2-4 tags maximum** - Keep it focused
2. **Choose from core tags only** - Don't create new tags
3. **Be consistent** - Same dish types should have same tags
4. **Think about discovery** - How would users search for this?

## Tag Hierarchy Priority

1. **Dish Type** (if distinctive like curry, soup, pasta)
2. **Protein** (always include one)
3. **Cuisine** (always include one)  
4. **Meal Type** (dinner is default, specify others)

## Migration Summary

**Before**: 30+ granular tags (gnocchi, technique, bright, spicy, etc.)
**After**: 12 core tags covering dish type, protein, cuisine, and meal timing

This system scales better and makes recipe discovery more intuitive for users.