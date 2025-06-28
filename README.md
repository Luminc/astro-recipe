# My Recipe Website (Astro, Tailwind, TypeScript)

A personal recipe collection site built with [Astro](https://astro.build), [Tailwind CSS](https://tailwindcss.com/), and TypeScript. Recipes are written in Markdown and rendered with beautiful, responsive layouts.

## ✨ Features
- Recipes stored as Markdown with frontmatter (title, date, tags)
- Dynamic recipe listing on the homepage
- **Interactive tag filtering and search** (multi-tag selection, instant filtering)
- **Dynamic tag pages**: `/tags/` (all tags) and `/tags/[tag]` (recipes by tag)
- **Breadcrumb navigation** for easy context and navigation
- Consistent, mobile-friendly design with Tailwind CSS
- Easy to add new recipes—just drop a `.md` file in `src/pages/recipes/`
- Ready for deployment on Netlify
- Uses React islands for interactivity (tag filtering/search)

## 🚀 Project Structure

```text
/
├── public/
│   └── images/
├── src/
│   ├── components/
│   │   ├── Nav.astro
│   │   ├── Footer.astro
│   │   └── RecipeFilter.jsx  # React island for tag filtering/search
│   ├── layouts/
│   │   └── RecipeLayout.astro
│   └── pages/
│       ├── index.astro
│       ├── tags/
│       │   ├── index.astro   # All tags page
│       │   └── [tag].astro   # Dynamic tag page
│       └── recipes/
│           ├── shiitake-umami-burger.md
│           └── gnocchi-amatriciana.md
├── tailwind.config.js
├── postcss.config.cjs
├── netlify.toml
└── package.json
```

## 🧑‍💻 Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Run the dev server:**
   ```sh
   npm run dev
   ```
3. **Build for production:**
   ```sh
   npm run build
   ```
4. **Preview production build:**
   ```sh
   npm run preview
   ```

## 📝 Adding Recipes
- Add new Markdown files to `src/pages/recipes/`.
- Use frontmatter for `title`, `date`, `tags`, and `layout`:
  ```markdown
  ---
  title: "Recipe Title"
  date: 2025-06-28
  tags: [tag1, tag2]
  layout: ../../layouts/RecipeLayout.astro
  ---
  # Recipe Content
  ...
  ```

## 🔎 Tag Filtering & Search
- Use the tag buttons and search box on the homepage or tag pages to instantly filter recipes.
- Select multiple tags for broader results.
- Click any tag in a recipe to view all recipes with that tag.

## 🏷️ Tag Pages
- `/tags/` lists all tags as links.
- `/tags/[tag]` shows all recipes for a specific tag, with breadcrumbs for navigation.

## 🌱 Learning Resources
- [Astro Docs](https://docs.astro.build/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🌍 Deployment
- Connect your repo to [Netlify](https://netlify.com/) and it will auto-deploy on push.
- Netlify config: `netlify.toml`

---

*Built for learning and delicious experimentation!*
