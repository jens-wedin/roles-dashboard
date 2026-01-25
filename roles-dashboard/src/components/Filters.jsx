import React from 'react';
import Select from 'react-select';

/**
 * Filters Component: Logic for searching and filtering roles.
 * Follows coding standards for layout and accessibility.
 */
const Filters = ({
    searchTerm,
    setSearchTerm,
    selectedIndustry,
    setSelectedIndustry,
    uniqueIndustries,
    selectedLevel,
    setSelectedLevel,
    uniqueLevels,
    selectedMedium,
    setSelectedMedium,
    uniqueMediums
}) => {
    return (
        <section className="filters" aria-label="Role filters">
            <div className="filter-group">
                <label htmlFor="search-filter">Search Roles</label>
                <input
                    id="search-filter"
                    type="text"
                    placeholder="Search by role name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            <div className="filter-group">
                <label htmlFor="industry-filter">Industry</label>
                <Select
                    id="industry-filter"
                    isMulti
                    options={uniqueIndustries}
                    value={selectedIndustry}
                    onChange={(options) => setSelectedIndustry(options || [])}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    placeholder="Select Industries"
                />
            </div>

            <div className="filter-group">
                <label htmlFor="level-filter">Org-Level</label>
                <Select
                    id="level-filter"
                    isMulti
                    options={uniqueLevels}
                    value={selectedLevel}
                    onChange={(options) => setSelectedLevel(options || [])}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    placeholder="Select Levels"
                />
            </div>

            <div className="filter-group">
                <label htmlFor="medium-filter">Medium</label>
                <Select
                    id="medium-filter"
                    isMulti
                    options={uniqueMediums}
                    value={selectedMedium}
                    onChange={(options) => setSelectedMedium(options || [])}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    placeholder="Select Mediums"
                />
            </div>
        </section>
    );
};

export default Filters;
