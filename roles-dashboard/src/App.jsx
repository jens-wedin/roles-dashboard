import { useState, useEffect, useMemo } from 'react'
import { supabase } from './supabaseClient'
import RoleList from './components/RoleList'
import './App.css'

function App() {
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedIndustry, setSelectedIndustry] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('')
  const [selectedMedium, setSelectedMedium] = useState('')

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
    const industries = roles.map((role) => role.industry).filter(Boolean);
    return ['', ...new Set(industries)];
  }, [roles]);

  const uniqueLevels = useMemo(() => {
    const levels = roles.map((role) => role['org-level']).filter(Boolean);
    return ['', ...new Set(levels)];
  }, [roles]);

  const uniqueMediums = useMemo(() => {
    const mediums = roles.map((role) => role.medium).filter(Boolean);
    return ['', ...new Set(mediums)];
  }, [roles]);

  const filteredRoles = useMemo(() => {
    return roles.filter((role) => {
      const matchesIndustry = selectedIndustry ? role.industry === selectedIndustry : true;
      const matchesLevel = selectedLevel ? role['org-level'] === selectedLevel : true;
      const matchesMedium = selectedMedium ? role.medium === selectedMedium : true;
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
          value={selectedIndustry}
          onChange={(e) => setSelectedIndustry(e.target.value)}
          style={{ marginRight: '10px' }}
        >
          {uniqueIndustries.map((industry) => (
            <option key={industry} value={industry}>
              {industry || 'All Industries'}
            </option>
          ))}
        </select>

        <label htmlFor="level-filter">Org-Level:</label>
        <select
          id="level-filter"
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
          style={{ marginRight: '10px' }}
        >
          {uniqueLevels.map((level) => (
            <option key={level} value={level}>
              {level || 'All Levels'}
            </option>
          ))}
        </select>

        <label htmlFor="medium-filter">Medium:</label>
        <select
          id="medium-filter"
          value={selectedMedium}
          onChange={(e) => setSelectedMedium(e.target.value)}
        >
          {uniqueMediums.map((medium) => (
            <option key={medium} value={medium}>
              {medium || 'All Mediums'}
            </option>
          ))}
        </select>
      </div>

      <RoleList roles={filteredRoles} />
    </div>
  )
}

export default App
