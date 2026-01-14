import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import RoleList from './components/RoleList'
import './App.css'

function App() {
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
      console.log('Fetched roles:', data) // Add this line
      setRoles(data)
    } catch (error) {
      console.error('Error fetching roles:', error.message)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <p>Loading roles...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div className="App">
      <h1>Design Roles Dashboard</h1>
      <RoleList roles={roles} />
    </div>
  )
}

export default App
