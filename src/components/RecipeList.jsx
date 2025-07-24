import React from 'react';
import { Image } from 'astro:assets';

// RecipeList: renders recipe cards with image, title, description, times, yield, and tags
export default function RecipeList({ recipes }) {
  if (!recipes.length) {
    return <div className="text-gray-400">No recipes found.</div>;
  }
  return (
    <section className="mt-8 grid gap-8">
      {recipes.map(({ url, frontmatter }) => (
        <article className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col md:flex-row gap-4" key={url}>
          {frontmatter.image && (
            <a href={url} className="block md:w-48 flex-shrink-0">
              <img
                src={`/images/${frontmatter.image.split('/').pop()}`}
                alt={frontmatter.title}
                className="object-cover w-full h-32 md:h-full"
                width={300}
                height={200}
                onError={e => { e.currentTarget.src = '/images/placeholder.jpg'; }}
              />
            </a>
          )}
          <div className="flex-1 p-4 flex flex-col gap-2">
            <h2 className="text-xl font-semibold">
              <a href={url} className="hover:underline">{frontmatter.title}</a>
            </h2>
            {frontmatter.description && <p className="text-gray-700 text-base">{frontmatter.description}</p>}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-1">
              {frontmatter.prepTime && <span>Prep: {frontmatter.prepTime}</span>}
              {frontmatter.cookTime && <span>Cook: {frontmatter.cookTime}</span>}
              {frontmatter.totalTime && <span>Total: {frontmatter.totalTime}</span>}
              {frontmatter.yield && <span>Yield: {frontmatter.yield}</span>}
            </div>
            {frontmatter.tags && frontmatter.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {frontmatter.tags.map(tag => (
                  <a href={`/tags/${encodeURIComponent(tag)}/`} className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs hover:bg-blue-100" key={tag}>{tag}</a>
                ))}
              </div>
            )}
          </div>
        </article>
      ))}
    </section>
  );
}
