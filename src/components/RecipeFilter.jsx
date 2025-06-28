import React, { useState } from 'react';

export default function RecipeFilter({ recipes }) {
  const [selectedTag, setSelectedTag] = useState('');
  const [search, setSearch] = useState('');

  // Collect unique tags
  const tags = Array.from(new Set(recipes.flatMap(r => r.frontmatter.tags || [])));

  // Filter recipes
  const filtered = recipes.filter(r => {
    const matchesTag = !selectedTag || (r.frontmatter.tags || []).includes(selectedTag);
    const matchesSearch = r.frontmatter.title.toLowerCase().includes(search.toLowerCase());
    return matchesTag && matchesSearch;
  });

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          className={`px-3 py-1 rounded border ${selectedTag === '' ? 'bg-yellow-200' : 'bg-gray-100'}`}
          onClick={() => setSelectedTag('')}
        >
          All
        </button>
        {tags.map(tag => (
          <button
            key={tag}
            className={`px-3 py-1 rounded border ${selectedTag === tag ? 'bg-yellow-200' : 'bg-gray-100'}`}
            onClick={() => setSelectedTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
      <input
        type="text"
        placeholder="Search recipes..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-4 px-3 py-2 border rounded w-full"
      />
      <ul className="space-y-4">
        {filtered.map(recipe => (
          <li key={recipe.url}>
            <a href={recipe.url} className="text-xl font-semibold hover:underline">
              {recipe.frontmatter.title || recipe.url}
            </a>
            <div className="text-gray-500 text-sm">
              {recipe.frontmatter.date ? new Date(recipe.frontmatter.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
            </div>
            <div className="flex flex-wrap gap-2 mt-1">
              {(recipe.frontmatter.tags || []).map(tag => (
                <span key={tag} className="text-xs bg-gray-200 rounded px-2 py-0.5">{tag}</span>
              ))}
            </div>
          </li>
        ))}
        {filtered.length === 0 && <li className="text-gray-400">No recipes found.</li>}
      </ul>
    </div>
  );
}
