import { useState, useEffect, useMemo } from 'react'
import { supabase } from './supabaseClient'
import RoleList from './components/RoleList'
import Filters from './components/Filters'
import './App.css'

/**
 * App Component: Orchestrates the Roles Dashboard.
 * Handles data fetching, state management, and filtering.
 */
function App() {
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedIndustry, setSelectedIndustry] = useState([])
  const [selectedLevel, setSelectedLevel] = useState([])
  const [selectedMedium, setSelectedMedium] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    const getRoles = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase.from('design_roles').select('*')
        if (error) throw error
        setRoles(data || [])
      } catch (err) {
        console.error('Error fetching roles:', err.message)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    getRoles()
  }, [])

  const uniqueIndustries = useMemo(() => {
    const allIndustries = roles.flatMap((role) =>
      role.industry ? role.industry.split(',').map((item) => item.trim()) : []
    ).filter(Boolean);
    return [...new Set(allIndustries)].sort().map((ind) => ({ value: ind, label: ind }));
  }, [roles]);

  const uniqueLevels = useMemo(() => {
    const levels = roles.map((role) => role['org-level']?.trim()).filter(Boolean);
    return [...new Set(levels)].sort().map((lvl) => ({ value: lvl, label: lvl }));
  }, [roles]);

  const uniqueMediums = useMemo(() => {
    const mediums = roles.map((role) => role.medium?.trim()).filter(Boolean);
    return [...new Set(mediums)].sort().map((med) => ({ value: med, label: med }));
  }, [roles]);

  const filteredRoles = useMemo(() => {
    return roles.filter((role) => {
      const roleIndustries = role.industry ? role.industry.split(',').map(i => i.trim()) : [];
      const selectedIndValues = selectedIndustry.map(o => o.value);
      const matchesIndustry = selectedIndValues.length === 0 ||
        selectedIndValues.some(v => roleIndustries.includes(v));

      const selectedLvlValues = selectedLevel.map(o => o.value);
      const matchesLevel = selectedLvlValues.length === 0 ||
        selectedLvlValues.includes(role['org-level']?.trim());

      const selectedMedValues = selectedMedium.map(o => o.value);
      const matchesMedium = selectedMedValues.length === 0 ||
        selectedMedValues.includes(role.medium?.trim());

      const matchesSearch = debouncedSearchTerm.length < 2 ||
        role['role-name']?.toLowerCase().includes(debouncedSearchTerm.toLowerCase());

      return matchesIndustry && matchesLevel && matchesMedium && matchesSearch;
    });
  }, [roles, selectedIndustry, selectedLevel, selectedMedium, debouncedSearchTerm]);

  const searchStatus = useMemo(() => {
    const count = filteredRoles.length;
    const total = roles.length;
    let message = `Showing ${count} out of ${total} roles.`;
    
    if (debouncedSearchTerm.length >= 2) {
      message = `Showing ${count} out of ${total} roles for "${debouncedSearchTerm}".`;
    }
    
    return message;
  }, [filteredRoles.length, roles.length, debouncedSearchTerm]);

  /**
   * Toggles a filter value. If the value is not selected, adds it.
   * Also scrolls the window to the top to show the filtered results.
   * @param {string} category - The filter category ('industry', 'level', or 'medium')
   * @param {string} value - The value to toggle
   */
  const handleFilterClick = (category, value) => {
    const trimmedValue = value?.trim();
    if (!trimmedValue) return;

    const filterMap = {
      industry: { state: selectedIndustry, setter: setSelectedIndustry },
      level: { state: selectedLevel, setter: setSelectedLevel },
      medium: { state: selectedMedium, setter: setSelectedMedium }
    };

    const { state, setter } = filterMap[category];
    
    // Check if the value is already selected to avoid duplicates
    if (!state.some(item => item.value === trimmedValue)) {
      setter([...state, { value: trimmedValue, label: trimmedValue }]);
    }

    // Scroll to top to show the filters and results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return (
    <div className="status-container">
      <div className="spinner"></div>
      <p>Loading roles...</p>
    </div>
  )

  if (error) return <p className="error-message">Error: {error}</p>

  return (
    <main className="App">
      <header className="app-header">
        <h1>Design roles Index</h1>
        <p className="app-subtitle">A curated collection of {roles.length} industry roles and responsibilities.</p>
      </header>

      <Filters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedIndustry={selectedIndustry}
        setSelectedIndustry={setSelectedIndustry}
        uniqueIndustries={uniqueIndustries}
        selectedLevel={selectedLevel}
        setSelectedLevel={setSelectedLevel}
        uniqueLevels={uniqueLevels}
        selectedMedium={selectedMedium}
        setSelectedMedium={setSelectedMedium}
        uniqueMediums={uniqueMediums}
      />

      <div role="status" aria-live="polite" className="sr-only">
        {searchStatus}
      </div>

      <RoleList 
        roles={filteredRoles} 
        onFilterClick={handleFilterClick}
      />
    </main>
  )
}

export default App
