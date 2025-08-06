import React, { useState } from 'react';
import RecipeList from './RecipeList.jsx';

// RecipeFilter: React island for tag filtering and search on the recipe index and tag pages
// Props: recipes (array of recipe objects with frontmatter), translations (object with localized strings)
export default function RecipeFilter({ recipes, translations }) {
  // State for selected tags (multi-select) and search query
  const [selectedTags, setSelectedTags] = useState([]);
  const [search, setSearch] = useState('');
  const [showAllTags, setShowAllTags] = useState(false);

  // Collect all unique tags from recipes with counts
  const tagCounts = recipes.reduce((acc, recipe) => {
    (recipe.frontmatter.tags || []).forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {});
  
  // Sort tags by frequency (most popular first)
  const sortedTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a]);
  
  // Show only top 8 tags initially, or all if showAllTags is true
  // Always include selected tags even if they're not in the top 8  
  const topTags = sortedTags.slice(0, 8);
  const visibleTags = showAllTags ? sortedTags : [
    ...topTags,
    ...selectedTags.filter(tag => !topTags.includes(tag))
  ].filter((tag, index, arr) => arr.indexOf(tag) === index); // Remove duplicates
  const hasMoreTags = sortedTags.length > 8;

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
      {/* Search input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder={translations?.home?.searchPlaceholder || "Search recipes..."}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-base"
        />
      </div>
      
      {/* Tag filter section */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">{translations?.home?.filterByTags || "Filter by tags:"}:</h3>
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedTags.length === 0 
                ? 'bg-yellow-500 text-white shadow-sm' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setSelectedTags([])}
          >
            {translations?.home?.allTags || "All"} ({recipes.length})
          </button>
          {visibleTags.map(tag => {
            const count = tagCounts[tag];
            return (
              <button
                key={tag}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-yellow-500 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => toggleTag(tag)}
              >
                {tag} ({count})
              </button>
            );
          })}
          {hasMoreTags && (
            <button
              className="px-3 py-2 rounded-full text-sm font-medium bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors border-2 border-dashed border-gray-300"
              onClick={() => setShowAllTags(!showAllTags)}
            >
              {showAllTags ? '− Show Less' : `+ ${sortedTags.length - 8} More Tags`}
            </button>
          )}
        </div>
        {selectedTags.length > 0 && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Showing {filtered.length} recipe{filtered.length !== 1 ? 's' : ''}
            </span>
            <button
              className="text-sm text-red-600 hover:text-red-800 underline"
              onClick={() => setSelectedTags([])}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
      <RecipeList recipes={filtered} />
    </div>
  );
}
