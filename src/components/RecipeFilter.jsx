import React, { useState } from 'react';
import RecipeList from './RecipeList.jsx';

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
      <RecipeList recipes={filtered} />
    </div>
  );
}
