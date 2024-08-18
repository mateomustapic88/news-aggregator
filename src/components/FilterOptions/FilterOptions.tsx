import React from "react";
import "./FilterOptions.scss";

interface FilterOptionsProps {
  categories: string[];
  sources: { name: string; id: string; api: string }[];
  onFilterChange: (filter: {
    category?: string;
    source?: string;
    date?: string;
  }) => void;
}

const FilterOptions: React.FC<FilterOptionsProps> = ({
  categories,
  sources,
  onFilterChange,
}) => {
  const [category, setCategory] = React.useState<string>("");
  const [source, setSource] = React.useState<string>("");
  const [date, setDate] = React.useState<string>("");

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    setCategory(newCategory);
    onFilterChange({ category: newCategory, source, date });
  };

  const handleSourceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSource = e.target.value;
    setSource(newSource);
    onFilterChange({ category, source: newSource, date });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setDate(newDate);
    onFilterChange({ category, source, date: newDate });
  };

  return (
    <div className='filter-options'>
      <div className='filter-options__select-group'>
        <select
          value={category}
          onChange={handleCategoryChange}
          className='filter-options__select'
        >
          <option value=''>All Categories</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={source}
          onChange={handleSourceChange}
          className='filter-options__select'
        >
          <option value=''>All Sources</option>
          {sources.map((src) => (
            <option key={src.id} value={src.id}>
              {src.name}
            </option>
          ))}
        </select>
      </div>

      <div className='filter-options__date-group'>
        <input
          type='date'
          value={date}
          onChange={handleDateChange}
          className='filter-options__input'
        />
      </div>
    </div>
  );
};

export default FilterOptions;
