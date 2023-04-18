import React from 'react'
import FormControlLabel from '@mui/material/FormControlLabel'
import { AntSwitch } from './ANTSwitcher'
import { Item } from './Item'

export function Toggle(props) {
  return (
    <Item>
      <FormControlLabel
        control={<AntSwitch checked={props.value} onClick={props.onClick} />}
        label={props.label}
      />
    </Item>
  )
}
