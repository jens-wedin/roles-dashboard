import * as React from "react"
import { X, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

export interface MultiSelectOption {
  value: string
  label: string
}

interface MultiSelectProps {
  options: MultiSelectOption[]
  value: MultiSelectOption[]
  onChange: (value: MultiSelectOption[]) => void
  placeholder?: string
  inputId?: string
  "aria-describedby"?: string
  className?: string
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select options...",
  inputId,
  "aria-describedby": ariaDescribedby,
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (option: MultiSelectOption) => {
    const isSelected = value.some((v) => v.value === option.value)
    if (isSelected) {
      onChange(value.filter((v) => v.value !== option.value))
    } else {
      onChange([...value, option])
    }
  }

  const handleRemove = (option: MultiSelectOption, e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(value.filter((v) => v.value !== option.value))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && value.length > 0) {
      const input = e.target as HTMLInputElement
      if (input.value === "") {
        onChange(value.slice(0, -1))
      }
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-describedby={ariaDescribedby}
            id={inputId}
            className={cn(
              "h-auto min-h-8 w-full justify-between font-normal",
              className
            )}
          >
            <div className="flex flex-1 flex-wrap gap-1">
              {value.length === 0 && (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
              {value.map((option) => (
                <Badge
                  key={option.value}
                  variant="secondary"
                  className="gap-0.5 pr-0.5"
                >
                  {option.label}
                  <span
                    role="button"
                    tabIndex={0}
                    className="ml-0.5 inline-flex size-4 items-center justify-center rounded-full hover:bg-foreground/20"
                    onClick={(e) => handleRemove(option, e)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        handleRemove(option, e as unknown as React.MouseEvent)
                      }
                    }}
                    aria-label={`Remove ${option.label}`}
                  >
                    <X className="size-3" />
                  </span>
                </Badge>
              ))}
            </div>
            <ChevronsUpDown className="ml-1 size-4 shrink-0 opacity-50" />
          </Button>
        }
      />
      <PopoverContent className="w-(--anchor-width) p-0" align="start">
        <Command>
          <CommandInput
            placeholder={`Search...`}
            onKeyDown={handleKeyDown}
          />
          <CommandList>
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = value.some((v) => v.value === option.value)
                return (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    data-checked={isSelected}
                    onSelect={() => handleSelect(option)}
                  >
                    {option.label}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
