import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/supabaseClient'
import RoleList from '@/components/RoleList'
import Filters from '@/components/Filters'
import { ModeToggle } from '@/components/mode-toggle'
import type { Role, FilterOption } from '@/types'

function App() {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedIndustry, setSelectedIndustry] = useState<FilterOption[]>([])
  const [selectedLevel, setSelectedLevel] = useState<FilterOption[]>([])
  const [selectedMedium, setSelectedMedium] = useState<FilterOption[]>([])
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
        setRoles((data as Role[]) || [])
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        console.error('Error fetching roles:', message)
        setError(message)
      } finally {
        setLoading(false)
      }
    }
    getRoles()
  }, [])

  const uniqueIndustries = useMemo(() => {
    const allIndustries = roles
      .flatMap((role) =>
        role.industry ? role.industry.split(',').map((item) => item.trim()) : []
      )
      .filter(Boolean)
    return [...new Set(allIndustries)]
      .sort()
      .map((ind) => ({ value: ind, label: ind }))
  }, [roles])

  const uniqueLevels = useMemo(() => {
    const levels = roles
      .map((role) => role['org-level']?.trim())
      .filter((v): v is string => Boolean(v))
    return [...new Set(levels)]
      .sort()
      .map((lvl) => ({ value: lvl, label: lvl }))
  }, [roles])

  const uniqueMediums = useMemo(() => {
    const mediums = roles
      .map((role) => role.medium?.trim())
      .filter((v): v is string => Boolean(v))
    return [...new Set(mediums)]
      .sort()
      .map((med) => ({ value: med, label: med }))
  }, [roles])

  const filteredRoles = useMemo(() => {
    return roles.filter((role) => {
      const roleIndustries = role.industry
        ? role.industry.split(',').map((i) => i.trim())
        : []
      const selectedIndValues = selectedIndustry.map((o) => o.value)
      const matchesIndustry =
        selectedIndValues.length === 0 ||
        selectedIndValues.some((v) => roleIndustries.includes(v))

      const selectedLvlValues = selectedLevel.map((o) => o.value)
      const matchesLevel =
        selectedLvlValues.length === 0 ||
        selectedLvlValues.includes(role['org-level']?.trim() ?? '')

      const selectedMedValues = selectedMedium.map((o) => o.value)
      const matchesMedium =
        selectedMedValues.length === 0 ||
        selectedMedValues.includes(role.medium?.trim() ?? '')

      const matchesSearch =
        debouncedSearchTerm.length < 2 ||
        role['role-name']
          ?.toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase())

      return matchesIndustry && matchesLevel && matchesMedium && matchesSearch
    })
  }, [roles, selectedIndustry, selectedLevel, selectedMedium, debouncedSearchTerm])

  const searchStatus = useMemo(() => {
    const count = filteredRoles.length
    const total = roles.length
    let message = `Showing ${count} out of ${total} roles.`

    if (debouncedSearchTerm.length >= 2) {
      message = `Showing ${count} out of ${total} roles for "${debouncedSearchTerm}".`
    }

    return message
  }, [filteredRoles.length, roles.length, debouncedSearchTerm])

  const handleFilterClick = (category: string, value: string) => {
    const trimmedValue = value?.trim()
    if (!trimmedValue) return

    const filterMap: Record<
      string,
      { state: FilterOption[]; setter: (options: FilterOption[]) => void }
    > = {
      industry: { state: selectedIndustry, setter: setSelectedIndustry },
      level: { state: selectedLevel, setter: setSelectedLevel },
      medium: { state: selectedMedium, setter: setSelectedMedium },
    }

    const filter = filterMap[category]
    if (!filter) return

    const { state, setter } = filter

    if (!state.some((item) => item.value === trimmedValue)) {
      setter([...state, { value: trimmedValue, label: trimmedValue }])
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading)
    return (
      <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4">
        <div className="size-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
        <p className="text-muted-foreground">Loading roles...</p>
      </div>
    )

  if (error)
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-destructive">Error: {error}</p>
      </div>
    )

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="relative mb-8 text-center">
        <div className="absolute right-0 top-0">
          <ModeToggle />
        </div>
        <h1 className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
          Design Roles Index
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          A curated collection of {roles.length} industry roles and
          responsibilities.
        </p>
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

      <RoleList roles={filteredRoles} onFilterClick={handleFilterClick} />
    </main>
  )
}

export default App
