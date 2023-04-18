import { Typography, Button, TextField } from '@mui/material'
import React from 'react'

export function PopupConfigureSite(props) {
  const [name, setName] = React.useState({
    value: props.initialNameValue ?? "",
    error: undefined
  })
  const [domain, setDomain] = React.useState({
    value: props.initialDomainValue ?? "",
    error: undefined
  })

  const handleSave = () => {
    let isValid = true
    const isEnglishRegexp = /^[A-Za-z0-9]*$/
    const isDomainRegexp = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/

    if (name.value.trim().length === 0) {
      isValid = false
      setName({
        value: name.value,
        error: "Name is required!"
      })
    } else if (!isEnglishRegexp.test((name.value))) {
      isValid = false
      setName({
        value: name.value,
        error: "Name is not valid!"
      })
    }

    if (domain.value.trim().length === 0) {
      isValid = false
      setDomain({
        value: domain.value,
        error: "Domain is required!"
      })
    } else if (!isDomainRegexp.test(domain.value)) {
      isValid = false
      setDomain({
        value: domain.value,
        error: "Domain is not valid!"
      })
    }


    if (isValid) {
      props.addSite(name.value, domain.value)
    }
  }

  return (
    <div className="popupConfirm">
      <div className="popupConfirmOverlay" onClick={props.onClose} />

      <div className="popupConfirmContent">
        <div className="popupConfirmText">
          <Typography>{props.title}</Typography>
        </div>

        <div className="popupConfirmInput">
          <TextField
            fullWidth
            error={Boolean(name.error)}
            label="Site Name"
            variant="outlined"
            value={name.value}
            onChange={e => setName({ value: e.target.value })}
            helperText={name.error}
          />
        </div>

        <div className="popupConfirmText">
          <TextField
            fullWidth
            error={Boolean(domain.error)}
            label="Site Domain"
            variant="outlined"
            value={domain.value}
            onChange={e => setDomain({ value: e.target.value })}
            helperText={domain.error}
          />
        </div>

        <Button onClick={handleSave} variant="outlined">{props.buttonText}</Button>
      </div>
    </div>
  )
}