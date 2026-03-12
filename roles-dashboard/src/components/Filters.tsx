import type { FilterOption } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { MultiSelect } from '@/components/ui/multi-select'

interface FiltersProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedIndustry: FilterOption[]
  setSelectedIndustry: (options: FilterOption[]) => void
  uniqueIndustries: FilterOption[]
  selectedLevel: FilterOption[]
  setSelectedLevel: (options: FilterOption[]) => void
  uniqueLevels: FilterOption[]
  selectedMedium: FilterOption[]
  setSelectedMedium: (options: FilterOption[]) => void
  uniqueMediums: FilterOption[]
}

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
  uniqueMediums,
}: FiltersProps) => {
  return (
    <Card className="mb-8">
      <CardContent>
        <section
          className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6"
          aria-label="Role filters"
        >
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="search-filter"
              className="text-sm font-semibold text-muted-foreground"
            >
              Search Roles
            </label>
            <Input
              id="search-filter"
              type="text"
              aria-describedby="search-desc"
              placeholder="Search by role name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span id="search-desc" className="sr-only">
              Enter at least 2 characters to filter roles by name.
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="industry-filter"
              className="text-sm font-semibold text-muted-foreground"
            >
              Industry
            </label>
            <MultiSelect
              inputId="industry-filter"
              aria-describedby="industry-desc"
              options={uniqueIndustries}
              value={selectedIndustry}
              onChange={setSelectedIndustry}
              placeholder="Select Industries"
            />
            <span id="industry-desc" className="sr-only">
              Filter roles by industry. You can select multiple options.
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="level-filter"
              className="text-sm font-semibold text-muted-foreground"
            >
              Org-Level
            </label>
            <MultiSelect
              inputId="level-filter"
              aria-describedby="level-desc"
              options={uniqueLevels}
              value={selectedLevel}
              onChange={setSelectedLevel}
              placeholder="Select Levels"
            />
            <span id="level-desc" className="sr-only">
              Filter roles by organizational level. You can select multiple
              options.
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="medium-filter"
              className="text-sm font-semibold text-muted-foreground"
            >
              Medium
            </label>
            <MultiSelect
              inputId="medium-filter"
              aria-describedby="medium-desc"
              options={uniqueMediums}
              value={selectedMedium}
              onChange={setSelectedMedium}
              placeholder="Select Mediums"
            />
            <span id="medium-desc" className="sr-only">
              Filter roles by medium (Digital, Physical, or Sound). You can
              select multiple options.
            </span>
          </div>
        </section>
      </CardContent>
    </Card>
  )
}

export default Filters
