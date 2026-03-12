import RoleCard from '@/components/RoleCard'
import type { Role } from '@/types'

interface RoleListProps {
  roles: Role[]
  onFilterClick: (category: string, value: string) => void
}

const RoleList = ({ roles, onFilterClick }: RoleListProps) => {
  return (
    <section aria-labelledby="roles-heading">
      <h2 id="roles-heading" className="sr-only">
        Design Roles List
      </h2>

      {roles.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          <p>No roles match your current filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-6">
          {roles.map((role) => (
            <RoleCard
              key={role.id}
              role={role}
              onFilterClick={onFilterClick}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default RoleList
