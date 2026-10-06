// Renders a module's form fields from its config — grouped into titled sections when the config has `groups`.
function Field({ field, value, onChange }) {
  const label = <span>{field.label}{field.required ? ' *' : ''}</span>
  const className = `form-control ${field.wide ? 'full' : ''}`
  if (field.type === 'select') {
    return (
      <label className={className}>
        {label}
        <select value={value ?? ''} onChange={(event) => onChange(event.target.value)} required={field.required}>
          <option value="">Select {field.label.toLowerCase()}</option>
          {field.options.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      </label>
    )
  }
  const isPercent = field.type === 'percent'
  const type = isPercent ? 'number' : field.format === 'phone' ? 'tel' : field.type || 'text'
  return (
    <label className={className}>
      {label}
      <span className={isPercent ? 'input-suffix' : undefined}>
        <input
          type={type}
          step={isPercent ? '0.1' : field.step}
          min={isPercent ? 0 : field.min}
          max={isPercent ? 100 : field.max}
          value={value ?? ''}
          onChange={(event) => onChange(event.target.value)}
          placeholder={field.placeholder}
          required={field.required}
          inputMode={field.format === 'phone' ? 'tel' : undefined}
        />
        {isPercent && <em aria-hidden="true">%</em>}
      </span>
    </label>
  )
}

export default function RecordFields({ config, values, onChange }) {
  const update = (key) => (value) => onChange(key, value)
  if (!config.groups?.length) {
    return <div className="form-grid">{config.fields.map((field) => <Field key={field.key} field={field} value={values[field.key]} onChange={update(field.key)} />)}</div>
  }
  return (
    <div className="form-sections">
      {config.groups.map((group) => {
        const fields = config.fields.filter((field) => (field.group || config.groups[0].key) === group.key)
        if (!fields.length) return null
        return (
          <fieldset key={group.key} className="form-section">
            <legend>{group.title}</legend>
            <div className="form-grid">{fields.map((field) => <Field key={field.key} field={field} value={values[field.key]} onChange={update(field.key)} />)}</div>
          </fieldset>
        )
      })}
    </div>
  )
}
