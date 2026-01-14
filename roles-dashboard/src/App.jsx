import { useState, useEffect, useMemo } from 'react'
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
    return ['', ...new Set(allIndustries)];
  }, [roles]);

  const uniqueLevels = useMemo(() => {
    const levels = roles.map((role) => role['org-level']).filter(Boolean);
    return ['', ...new Set(levels)].sort();
  }, [roles]);

  const uniqueMediums = useMemo(() => {
    const mediums = roles.map((role) => role.medium).filter(Boolean);
    return ['', ...new Set(mediums)].sort();
  }, [roles]);

  const filteredRoles = useMemo(() => {
    return roles.filter((role) => {
      // Industry filter (handles comma-separated values)
      const roleIndustries = role.industry ? role.industry.split(',').map(item => item.trim()) : [];
      const matchesIndustry =
        selectedIndustry.length === 0 ||
        selectedIndustry.some((filterVal) => roleIndustries.includes(filterVal));

      // Org-Level filter
      const matchesLevel =
        selectedLevel.length === 0 ||
        selectedLevel.includes(role['org-level']);

      // Medium filter
      const matchesMedium =
        selectedMedium.length === 0 ||
        selectedMedium.includes(role.medium);

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
        <select
          id="industry-filter"
          multiple
          value={selectedIndustry}
          onChange={(e) =>
            setSelectedIndustry(
              Array.from(e.target.selectedOptions, (option) => option.value)
            )
          }
          style={{ marginRight: '10px', minWidth: '150px', minHeight: '80px' }}
        >
          {uniqueIndustries.map((industry) => (
            <option key={industry} value={industry}>
              {industry === '' ? 'All Industries' : industry}
            </option>
          ))}
        </select>

        <label htmlFor="level-filter">Org-Level:</label>
        <select
          id="level-filter"
          multiple
          value={selectedLevel}
          onChange={(e) =>
            setSelectedLevel(
              Array.from(e.target.selectedOptions, (option) => option.value)
            )
          }
          style={{ marginRight: '10px', minWidth: '150px', minHeight: '80px' }}
        >
          {uniqueLevels.map((level) => (
            <option key={level} value={level}>
              {level === '' ? 'All Org-Levels' : level}
            </option>
          ))}
        </select>

        <label htmlFor="medium-filter">Medium:</label>
        <select
          id="medium-filter"
          multiple
          value={selectedMedium}
          onChange={(e) =>
            setSelectedMedium(
              Array.from(e.target.selectedOptions, (option) => option.value)
            )
          }
          style={{ minWidth: '150px', minHeight: '80px' }}
        >
          {uniqueMediums.map((medium) => (
            <option key={medium} value={medium}>
              {medium === '' ? 'All Mediums' : medium}
            </option>
          ))}
        </select>
      </div>

      <RoleList roles={filteredRoles} />
    </div>
  )
}

export default App
