import React, { useState } from 'react';

// RecipeFilter: React island for tag filtering and search on the recipe index and tag pages
// Props: recipes (array of recipe objects with frontmatter)
export default function RecipeFilter({ recipes }) {
  // State for selected tags (multi-select) and search query
  const [selectedTags, setSelectedTags] = useState([]);
  const [search, setSearch] = useState('');

  // Collect all unique tags from recipes
  const tags = Array.from(new Set(recipes.flatMap(r => r.frontmatter.tags || [])));

  // Toggle a tag in the selectedTags array
  const toggleTag = (tag) => {
    setSelectedTags(selectedTags =>
      selectedTags.includes(tag)
        ? selectedTags.filter(t => t !== tag)
        : [...selectedTags, tag]
    );
  };

  // Filter recipes by selected tags and search query
  // Matches if any selected tag is present (OR logic)
  const filtered = recipes.filter(r => {
    const matchesTags = selectedTags.length === 0 || (r.frontmatter.tags || []).some(tag => selectedTags.includes(tag));
    const matchesSearch = r.frontmatter.title.toLowerCase().includes(search.toLowerCase());
    return matchesTags && matchesSearch;
  });

  return (
    <div>
      {/* Tag filter buttons and reset */}
      <div className="mb-4 flex flex-wrap gap-2 items-center">
        <button
          className={`px-3 py-1 rounded border ${selectedTags.length === 0 ? 'bg-yellow-200' : 'bg-gray-100'}`}
          onClick={() => setSelectedTags([])}
        >
          All
        </button>
        {tags.map(tag => (
          <button
            key={tag}
            className={`px-3 py-1 rounded border ${selectedTags.includes(tag) ? 'bg-yellow-200' : 'bg-gray-100'}`}
            onClick={() => toggleTag(tag)}
          >
            {tag}
          </button>
        ))}
        {selectedTags.length > 0 && (
          <button
            className="ml-2 px-3 py-1 rounded border bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
            onClick={() => setSelectedTags([])}
            title="Reset tag filters"
          >
            Reset
          </button>
        )}
      </div>
      {/* Search input */}
      <input
        type="text"
        placeholder="Search recipes..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-4 px-3 py-2 border rounded w-full"
      />
      {/* Recipe list */}
      <ul className="space-y-4">
        {filtered.map(recipe => (
          <li key={recipe.url}>
            {/* Recipe title link */}
            <a href={recipe.url} className="text-xl font-semibold hover:underline">
              {recipe.frontmatter.title || recipe.url}
            </a>
            {/* Date */}
            <div className="text-gray-500 text-sm">
              {recipe.frontmatter.date ? new Date(recipe.frontmatter.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
            </div>
            {/* Tag links */}
            <div className="flex flex-wrap gap-2 mt-1">
              {(recipe.frontmatter.tags || []).map(tag => (
                <a
                  key={tag}
                  href={`/tags/${encodeURIComponent(tag)}`}
                  className="text-xs bg-gray-200 rounded px-2 py-0.5 hover:bg-yellow-200 transition-colors"
                  title={`See all recipes tagged '${tag}'`}
                >
                  {tag}
                </a>
              ))}
            </div>
          </li>
        ))}
        {/* No results message */}
        {filtered.length === 0 && <li className="text-gray-400">No recipes found.</li>}
      </ul>
    </div>
  );
}
