import { useState, useEffect, useMemo } from 'react'
import Select from 'react-select'
import { supabase } from './supabaseClient'
import RoleList from './components/RoleList'
import './App.css'

function App() {
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedIndustry, setSelectedIndustry] = useState([])
  const [selectedLevel, setSelectedLevel] = useState([])
  const [selectedMedium, setSelectedMedium] = useState([])

  useEffect(() => {
    getRoles()
  }, [])

  async function getRoles() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('design_roles')
        .select('*')
      if (error) throw error
      console.log('Fetched roles:', data)
      setRoles(data)
    } catch (error) {
      console.error('Error fetching roles:', error.message)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const uniqueIndustries = useMemo(() => {
    const allIndustries = roles.flatMap((role) =>
      role.industry ? role.industry.split(',').map((item) => item.trim()) : []
    ).filter(Boolean);
    const options = [...new Set(allIndustries)].sort().map((industry) => ({ value: industry, label: industry }));
    return [{ value: '', label: 'All Industries' }, ...options];
  }, [roles]);

  const uniqueLevels = useMemo(() => {
    const levels = roles.map((role) => role['org-level']).filter(Boolean);
    const options = [...new Set(levels)].sort().map((level) => ({ value: level, label: level }));
    return [{ value: '', label: 'All Org-Levels' }, ...options];
  }, [roles]);

  const uniqueMediums = useMemo(() => {
    const mediums = roles.map((role) => role.medium).filter(Boolean);
    const options = [...new Set(mediums)].sort().map((medium) => ({ value: medium, label: medium }));
    return [{ value: '', label: 'All Mediums' }, ...options];
  }, [roles]);

  const filteredRoles = useMemo(() => {
    return roles.filter((role) => {
      // Industry filter (handles comma-separated values)
      const roleIndustries = role.industry ? role.industry.split(',').map(item => item.trim()) : [];
      const selectedIndustryValues = selectedIndustry.map(option => option.value);
      const matchesIndustry =
        selectedIndustryValues.length === 0 ||
        selectedIndustryValues.some((filterVal) => roleIndustries.includes(filterVal));

      // Org-Level filter
      const selectedLevelValues = selectedLevel.map(option => option.value);
      const matchesLevel =
        selectedLevelValues.length === 0 ||
        selectedLevelValues.includes(role['org-level']);

      // Medium filter
      const selectedMediumValues = selectedMedium.map(option => option.value);
      const matchesMedium =
        selectedMediumValues.length === 0 ||
        selectedMediumValues.includes(role.medium);

      return matchesIndustry && matchesLevel && matchesMedium;
    });
  }, [roles, selectedIndustry, selectedLevel, selectedMedium]);

  if (loading) return <p>Loading roles...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div className="App">
      <h1>Design Roles Dashboard</h1>

      <div className="filters" style={{ marginBottom: '20px' }}>
        <label htmlFor="industry-filter">Industry:</label>
        <Select
          id="industry-filter"
          isMulti
          options={uniqueIndustries}
          value={selectedIndustry}
          onChange={(selectedOptions) => {
            if (selectedOptions && selectedOptions.some(option => option.value === '')) {
              setSelectedIndustry([]);
            } else {
              setSelectedIndustry(selectedOptions);
            }
          }}
          className="react-select-container"
          classNamePrefix="react-select"
          placeholder="Select Industries"
        />

        <label htmlFor="level-filter">Org-Level:</label>
        <Select
          id="level-filter"
          isMulti
          options={uniqueLevels}
          value={selectedLevel}
          onChange={(selectedOptions) => {
            if (selectedOptions && selectedOptions.some(option => option.value === '')) {
              setSelectedLevel([]);
            } else {
              setSelectedLevel(selectedOptions);
            }
          }}
          className="react-select-container"
          classNamePrefix="react-select"
          placeholder="Select Org-Levels"
        />

        <label htmlFor="medium-filter">Medium:</label>
        <Select
          id="medium-filter"
          isMulti
          options={uniqueMediums}
          value={selectedMedium}
          onChange={(selectedOptions) => {
            if (selectedOptions && selectedOptions.some(option => option.value === '')) {
              setSelectedMedium([]);
            } else {
              setSelectedMedium(selectedOptions);
            }
          }}
          className="react-select-container"
          classNamePrefix="react-select"
          placeholder="Select Mediums"
        />
      </div>

      <RoleList roles={filteredRoles} />
    </div>
  )
}

export default App
