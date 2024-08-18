import React, { useState } from "react";
import "./FilterOptions.scss";

interface FilterOptionsProps {
  categories: string[];
  sources: { name: string; id: string; api: string }[];
  onFilterChange: (filter: {
    category?: string;
    source?: string;
    date?: string;
    hasImage?: boolean;
  }) => void;
}

const FilterOptions: React.FC<FilterOptionsProps> = ({
  categories,
  sources,
  onFilterChange,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSource, setSelectedSource] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [hasImage, setHasImage] = useState(false);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    onFilterChange({
      category: e.target.value,
      source: selectedSource,
      date: selectedDate,
      hasImage,
    });
  };

  const handleSourceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSource(e.target.value);
    onFilterChange({
      category: selectedCategory,
      source: e.target.value,
      date: selectedDate,
      hasImage,
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
    onFilterChange({
      category: selectedCategory,
      source: selectedSource,
      date: e.target.value,
      hasImage,
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasImage(e.target.checked);
    onFilterChange({
      category: selectedCategory,
      source: selectedSource,
      date: selectedDate,
      hasImage: e.target.checked,
    });
  };

  return (
    <div className='filter-options'>
      <div className='filter-options__select-group'>
        <select
          className='filter-options__select'
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value=''>All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          className='filter-options__select'
          value={selectedSource}
          onChange={handleSourceChange}
        >
          <option value=''>All Sources</option>
          {sources.map((source) => (
            <option key={source.id} value={source.id}>
              {source.name}
            </option>
          ))}
        </select>
      </div>

      <div className='filter-options__date-group'>
        <input
          type='date'
          className='filter-options__input'
          value={selectedDate}
          onChange={handleDateChange}
        />
      </div>

      <div className='filter-options__checkbox'>
        <input
          type='checkbox'
          checked={hasImage}
          onChange={handleCheckboxChange}
        />
        Articles with images
      </div>
    </div>
  );
};

export default FilterOptions;
