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
                    aria-describedby="search-desc"
                    placeholder="Search by role name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <span id="search-desc" className="sr-only">
                    Enter at least 2 characters to filter roles by name.
                </span>
            </div>

            <div className="filter-group">
                <label htmlFor="industry-filter">Industry</label>
                <Select
                    inputId="industry-filter"
                    aria-describedby="industry-desc"
                    isMulti
                    options={uniqueIndustries}
                    value={selectedIndustry}
                    onChange={(options) => setSelectedIndustry(options || [])}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    placeholder="Select Industries"
                />
                <span id="industry-desc" className="sr-only">
                    Filter roles by industry. You can select multiple options.
                </span>
            </div>

            <div className="filter-group">
                <label htmlFor="level-filter">Org-Level</label>
                <Select
                    inputId="level-filter"
                    aria-describedby="level-desc"
                    isMulti
                    options={uniqueLevels}
                    value={selectedLevel}
                    onChange={(options) => setSelectedLevel(options || [])}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    placeholder="Select Levels"
                />
                <span id="level-desc" className="sr-only">
                    Filter roles by organizational level. You can select multiple options.
                </span>
            </div>

            <div className="filter-group">
                <label htmlFor="medium-filter">Medium</label>
                <Select
                    inputId="medium-filter"
                    aria-describedby="medium-desc"
                    isMulti
                    options={uniqueMediums}
                    value={selectedMedium}
                    onChange={(options) => setSelectedMedium(options || [])}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    placeholder="Select Mediums"
                />
                <span id="medium-desc" className="sr-only">
                    Filter roles by medium (Digital, Physical, or Sound). You can select multiple options.
                </span>
            </div>
        </section>
    );
};

export default Filters;
