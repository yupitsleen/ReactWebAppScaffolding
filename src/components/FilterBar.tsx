import { memo } from 'react'
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip
} from '@mui/material'
import { FilterList as FilterListIcon } from '@mui/icons-material'

export interface FilterConfig {
  field: string
  label: string
  type: 'select' | 'text' | 'date' | 'dateRange' | 'multiselect'
  options?: { value: string; label: string }[]
}

interface FilterBarProps {
  filters: FilterConfig[]
  values: Record<string, any>
  onChange: (values: Record<string, any>) => void
}

export const FilterBar = memo(({ filters, values, onChange }: FilterBarProps) => {
  if (filters.length === 0) return null

  const handleChange = (field: string, value: any) => {
    onChange({
      ...values,
      [field]: value
    })
  }

  const handleClearFilter = (field: string) => {
    const newValues = { ...values }
    delete newValues[field]
    onChange(newValues)
  }

  const activeFilterCount = Object.keys(values).length

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <FilterListIcon color="action" />
        <Box sx={{ fontWeight: 500 }}>Filters</Box>
        {activeFilterCount > 0 && (
          <Chip
            label={`${activeFilterCount} active`}
            size="small"
            color="primary"
            onDelete={() => onChange({})}
          />
        )}
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {filters.map((filter) => {
          const value = values[filter.field]

          switch (filter.type) {
            case 'select':
              return (
                <FormControl key={filter.field} size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>{filter.label}</InputLabel>
                  <Select
                    value={value || ''}
                    label={filter.label}
                    onChange={(e) => handleChange(filter.field, e.target.value)}
                  >
                    <MenuItem value="">
                      <em>All</em>
                    </MenuItem>
                    {filter.options?.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )

            case 'multiselect':
              return (
                <FormControl key={filter.field} size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>{filter.label}</InputLabel>
                  <Select
                    multiple
                    value={value || []}
                    label={filter.label}
                    onChange={(e) => handleChange(filter.field, e.target.value)}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((val) => (
                          <Chip
                            key={val}
                            label={filter.options?.find(opt => opt.value === val)?.label || val}
                            size="small"
                          />
                        ))}
                      </Box>
                    )}
                  >
                    {filter.options?.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )

            case 'text':
              return (
                <TextField
                  key={filter.field}
                  label={filter.label}
                  size="small"
                  value={value || ''}
                  onChange={(e) => handleChange(filter.field, e.target.value)}
                  sx={{ minWidth: 200 }}
                />
              )

            case 'date':
              return (
                <TextField
                  key={filter.field}
                  label={filter.label}
                  type="date"
                  size="small"
                  value={value || ''}
                  onChange={(e) => handleChange(filter.field, e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ minWidth: 200 }}
                />
              )

            case 'dateRange':
              return (
                <Box key={filter.field} sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    label={`${filter.label} From`}
                    type="date"
                    size="small"
                    value={value?.from || ''}
                    onChange={(e) =>
                      handleChange(filter.field, { ...value, from: e.target.value })
                    }
                    InputLabelProps={{ shrink: true }}
                    sx={{ minWidth: 150 }}
                  />
                  <TextField
                    label={`${filter.label} To`}
                    type="date"
                    size="small"
                    value={value?.to || ''}
                    onChange={(e) =>
                      handleChange(filter.field, { ...value, to: e.target.value })
                    }
                    InputLabelProps={{ shrink: true }}
                    sx={{ minWidth: 150 }}
                  />
                </Box>
              )

            default:
              return null
          }
        })}
      </Box>

      {/* Active filter chips */}
      {activeFilterCount > 0 && (
        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {Object.entries(values).map(([field, value]) => {
            const filter = filters.find((f) => f.field === field)
            if (!filter) return null

            let displayValue: string
            if (Array.isArray(value)) {
              displayValue = value
                .map(v => filter.options?.find(opt => opt.value === v)?.label || v)
                .join(', ')
            } else if (typeof value === 'object' && value !== null) {
              displayValue = `${value.from || ''} - ${value.to || ''}`
            } else {
              displayValue = filter.options?.find(opt => opt.value === value)?.label || String(value)
            }

            return (
              <Chip
                key={field}
                label={`${filter.label}: ${displayValue}`}
                size="small"
                onDelete={() => handleClearFilter(field)}
              />
            )
          })}
        </Box>
      )}
    </Box>
  )
})

FilterBar.displayName = 'FilterBar'
