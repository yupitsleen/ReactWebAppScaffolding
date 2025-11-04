import { memo } from 'react'
import {
  TextField,
  Select,
  MenuItem,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  Radio,
  RadioGroup,
  Autocomplete,
  Grid
} from '@mui/material'
import type { FormFieldSchema } from '../../types/portal'

interface FormFieldProps {
  schema: FormFieldSchema
  value: any
  error?: string
  onChange: (value: any) => void
  onBlur?: () => void
}

/**
 * FormField Component
 *
 * Renders different field types based on schema configuration.
 * Integrates with Material-UI components for consistent styling.
 */
export const FormField = memo(({
  schema,
  value,
  error,
  onChange,
  onBlur
}: FormFieldProps) => {
  const {
    name,
    label,
    type,
    placeholder,
    helperText,
    required,
    disabled,
    options,
    rows,
    min,
    max,
    step,
    fullWidth = true,
    grid = { xs: 12 }
  } = schema

  const fieldId = String(name)
  const hasError = !!error

  // Render field based on type
  const renderField = () => {
    switch (type) {
      case 'text':
      case 'email':
        return (
          <TextField
            id={fieldId}
            name={fieldId}
            label={label}
            type={type}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder={placeholder}
            helperText={error || helperText}
            error={hasError}
            required={required}
            disabled={disabled}
            fullWidth={fullWidth}
            variant="outlined"
          />
        )

      case 'number':
        return (
          <TextField
            id={fieldId}
            name={fieldId}
            label={label}
            type="number"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
            onBlur={onBlur}
            placeholder={placeholder}
            helperText={error || helperText}
            error={hasError}
            required={required}
            disabled={disabled}
            fullWidth={fullWidth}
            variant="outlined"
            inputProps={{ min, max, step }}
          />
        )

      case 'textarea':
        return (
          <TextField
            id={fieldId}
            name={fieldId}
            label={label}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder={placeholder}
            helperText={error || helperText}
            error={hasError}
            required={required}
            disabled={disabled}
            fullWidth={fullWidth}
            variant="outlined"
            multiline
            rows={rows || 4}
          />
        )

      case 'select':
        return (
          <FormControl
            fullWidth={fullWidth}
            error={hasError}
            required={required}
            disabled={disabled}
            variant="outlined"
          >
            <InputLabel id={`${fieldId}-label`}>{label}</InputLabel>
            <Select
              labelId={`${fieldId}-label`}
              id={fieldId}
              name={fieldId}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              onBlur={onBlur}
              label={label}
            >
              {options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {(error || helperText) && (
              <FormHelperText>{error || helperText}</FormHelperText>
            )}
          </FormControl>
        )

      case 'multiselect':
        return (
          <FormControl
            fullWidth={fullWidth}
            error={hasError}
            required={required}
            disabled={disabled}
            variant="outlined"
          >
            <InputLabel id={`${fieldId}-label`}>{label}</InputLabel>
            <Select
              labelId={`${fieldId}-label`}
              id={fieldId}
              name={fieldId}
              multiple
              value={value || []}
              onChange={(e) => onChange(e.target.value)}
              onBlur={onBlur}
              label={label}
            >
              {options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {(error || helperText) && (
              <FormHelperText>{error || helperText}</FormHelperText>
            )}
          </FormControl>
        )

      case 'checkbox':
        return (
          <FormControl error={hasError} disabled={disabled}>
            <FormControlLabel
              control={
                <Checkbox
                  id={fieldId}
                  name={fieldId}
                  checked={!!value}
                  onChange={(e) => onChange(e.target.checked)}
                  onBlur={onBlur}
                />
              }
              label={label}
            />
            {(error || helperText) && (
              <FormHelperText>{error || helperText}</FormHelperText>
            )}
          </FormControl>
        )

      case 'radio':
        return (
          <FormControl
            error={hasError}
            required={required}
            disabled={disabled}
          >
            <InputLabel>{label}</InputLabel>
            <RadioGroup
              id={fieldId}
              name={fieldId}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              onBlur={onBlur}
            >
              {options?.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
            {(error || helperText) && (
              <FormHelperText>{error || helperText}</FormHelperText>
            )}
          </FormControl>
        )

      case 'date':
      case 'datetime':
        return (
          <TextField
            id={fieldId}
            name={fieldId}
            label={label}
            type={type === 'datetime' ? 'datetime-local' : 'date'}
            value={value ? new Date(value).toISOString().split('T')[0] : ''}
            onChange={(e) => onChange(e.target.value ? new Date(e.target.value).toISOString() : null)}
            onBlur={onBlur}
            helperText={error || helperText}
            error={hasError}
            required={required}
            disabled={disabled}
            fullWidth={fullWidth}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            inputProps={{ min, max }}
          />
        )

      case 'autocomplete':
        return (
          <Autocomplete
            id={fieldId}
            options={options || []}
            getOptionLabel={(option) => option.label}
            value={options?.find(opt => opt.value === value) || null}
            onChange={(_, newValue) => onChange(newValue?.value || null)}
            onBlur={onBlur}
            disabled={disabled}
            renderInput={(params) => (
              <TextField
                {...params}
                name={fieldId}
                label={label}
                placeholder={placeholder}
                helperText={error || helperText}
                error={hasError}
                required={required}
                variant="outlined"
              />
            )}
          />
        )

      default:
        return (
          <TextField
            id={fieldId}
            name={fieldId}
            label={label}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            helperText={error || helperText}
            error={hasError}
            required={required}
            disabled={disabled}
            fullWidth={fullWidth}
            variant="outlined"
          />
        )
    }
  }

  return (
    <Grid {...grid}>
      {renderField()}
    </Grid>
  )
})

FormField.displayName = 'FormField'
