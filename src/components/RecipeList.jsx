import React from 'react';
// Dynamically import all images from src/assets
const images = import.meta.glob('../assets/*.{jpg,png,webp,gif}');

// RecipeList: renders recipe cards with image, title, description, times, yield, and tags
export default function RecipeList({ recipes }) {
  if (!recipes.length) {
    return <div className="text-gray-400">No recipes found.</div>;
  }
  return (
    <section className="mt-8 grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
      {recipes.map(({ url, frontmatter }) => (
        <article className="rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full" key={url}>
          {frontmatter.image && (
            <a href={url} className="block aspect-video overflow-hidden">
              <RecipeImage image={frontmatter.image} alt={frontmatter.title} />
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
              {frontmatter.recipeYield && <span>Yield: {frontmatter.recipeYield}</span>}
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

// Helper component for dynamic asset import and fallback
function RecipeImage({ image, alt }) {
  const [src, setSrc] = React.useState('/images/placeholder.svg');
  React.useEffect(() => {
    const filename = image.split('/').pop();
    // Find matching path by checking if the path contains the filename
    const match = Object.keys(images).find(path => {
      const pathFilename = path.split('/').pop();
      return pathFilename === filename;
    });
    
    if (match) {
      images[match]().then(mod => {
        // The module might have different structures, try multiple properties
        const imageUrl = mod.default?.src || mod.default || mod.src || mod;
        if (typeof imageUrl === 'string') {
          setSrc(imageUrl);
        } else {
          console.warn('Image URL is not a string:', imageUrl, 'Module:', mod);
          setSrc('/images/placeholder.svg');
        }
      }).catch(err => {
        console.error('Failed to load image:', err);
        setSrc('/images/placeholder.svg');
      });
    } else {
      setSrc('/images/placeholder.svg');
    }
  }, [image]);
  return (
    <img
      src={src || '/images/placeholder.svg'}
      alt={alt}
      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
      width={300}
      height={200}
      onError={e => { e.currentTarget.src = '/images/placeholder.svg'; }}
    />
  );
}
