# My Recipe Website (Astro, Tailwind, TypeScript)

A personal recipe collection site built with [Astro](https://astro.build), [Tailwind CSS](https://tailwindcss.com/), and TypeScript. Recipes are written in Markdown and rendered with beautiful, responsive layouts.

## ✨ Features
- Recipes stored as Markdown with frontmatter (title, date, tags)
- Dynamic recipe listing on the homepage
- Consistent, mobile-friendly design with Tailwind CSS
- Easy to add new recipes—just drop a `.md` file in `src/pages/recipes/`
- Ready for deployment on Netlify

## 🚀 Project Structure

```text
/
├── public/
│   └── images/
├── src/
│   ├── components/
│   │   ├── Nav.astro
│   │   └── Footer.astro
│   ├── layouts/
│   │   └── RecipeLayout.astro
│   └── pages/
│       ├── index.astro
│       └── recipes/
│           ├── shiitake-umami-burger.md
│           └── gnocchi-amatriciana.md
├── tailwind.config.js
├── postcss.config.js
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

## 🌱 Learning Resources
- [Astro Docs](https://docs.astro.build/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🌍 Deployment
- Connect your repo to [Netlify](https://netlify.com/) and it will auto-deploy on push.
- Netlify config: `netlify.toml`

---

*Built for learning and delicious experimentation!*
