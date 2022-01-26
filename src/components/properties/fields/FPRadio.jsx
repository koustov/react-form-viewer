import * as React from 'react'
import { useState, useEffect } from 'react'
import {
  RTFRadio,
  RTFFormControlLabel,
  RTFFormLabel,
  RTFRadioGroup
} from 'react-themed-fields'
import { FormControl } from '@mui/material'

const RTFRadioControl = ({ field, onChange, ...props }) => {
  const [localValue, setLocalvalue] = useState(field.value)

  const onValueChanged = (e) => {
    setLocalvalue(e.target.value)
    if (onChange) {
      const retValue = field.data.filter((f) => {
        return f.value.toString() === e.target.value.toString()
      })
      if (retValue && retValue.length && retValue[0].returnvalue) {
        onChange(field, retValue[0].returnvalue, field)
      } else {
        onChange(field, e.target.value, field)
      }
    }
  }

  useEffect(() => {}, [])

  return (
    <div>
      <FormControl component='fieldset'>
        {field.label ? (
          <RTFFormLabel component='legend'>{field.label}</RTFFormLabel>
        ) : null}

        <RTFRadioGroup
          aria-label={field.datafield}
          name={field.datafield}
          value={localValue}
          onChange={onValueChanged}
        >
          {field.data.map((d, di) => {
            return (
              <RTFFormControlLabel
                key={di}
                value={d.value}
                control={<RTFRadio {...props} />}
                label={d.name}
              />
            )
          })}
        </RTFRadioGroup>
      </FormControl>
    </div>
  )
}

export default RTFRadioControl
