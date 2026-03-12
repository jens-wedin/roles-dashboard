import { formatToList, getBadgeColor } from '@/utils/utils'
import type { Role } from '@/types'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface RoleCardProps {
  role: Role
  onFilterClick: (category: string, value: string) => void
}

const RoleCard = ({ role, onFilterClick }: RoleCardProps) => {
  const responsibilities = formatToList(role.responsibilities)
  const skills = formatToList(role.skills)
  const industries = role.industry
    ? role.industry.split(',').map((i) => i.trim())
    : []
  const orgLevel = role['org-level']?.trim()
  const medium = role.medium?.trim()

  return (
    <Card
      className="transition-all hover:-translate-y-1 hover:shadow-lg hover:ring-primary/30"
      role="article"
      aria-labelledby={`role-title-${role.id}`}
    >
      <CardHeader className="flex-row items-start justify-between gap-2">
        <CardTitle>
          <h3 id={`role-title-${role.id}`} className="text-lg font-bold">
            {role['role-name']}
          </h3>
        </CardTitle>
        <div className="flex flex-wrap gap-1">
          {orgLevel && (
            <Badge
              className="cursor-pointer transition-transform active:scale-95"
              style={{
                backgroundColor: getBadgeColor(orgLevel),
                color: 'white',
                borderColor: 'transparent',
              }}
              onClick={() => onFilterClick('level', orgLevel)}
              render={
                <button
                  type="button"
                  aria-label={`Filter by level: ${orgLevel}`}
                />
              }
            >
              {orgLevel}
            </Badge>
          )}
          {medium && (
            <Badge
              className="cursor-pointer transition-transform active:scale-95"
              style={{
                backgroundColor: getBadgeColor(medium),
                color: 'white',
                borderColor: 'transparent',
              }}
              onClick={() => onFilterClick('medium', medium)}
              render={
                <button
                  type="button"
                  aria-label={`Filter by medium: ${medium}`}
                />
              }
            >
              {medium}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {role.description}
        </p>

        {responsibilities.length > 0 && (
          <section>
            <h4 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Responsibilities
            </h4>
            <ul className="list-disc space-y-1 pl-5 text-sm text-foreground">
              {responsibilities.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {skills.length > 0 && (
          <section>
            <h4 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Skills
            </h4>
            <div className="flex flex-wrap gap-1">
              {skills.map((skill, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </section>
        )}
      </CardContent>

      {industries.length > 0 && (
        <CardFooter className="flex flex-wrap gap-1">
          {industries.map((industry, idx) => (
            <Button
              key={idx}
              variant="ghost"
              size="xs"
              onClick={() => onFilterClick('industry', industry)}
              aria-label={`Filter by industry: ${industry}`}
            >
              {industry}
            </Button>
          ))}
        </CardFooter>
      )}
    </Card>
  )
}

export default RoleCard
