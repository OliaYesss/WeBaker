import { Typography, Stack, Button } from '@mui/material'
import React from 'react'

export function PopupConfirm(props) {
  return (
    <div class="popupConfirm">
      <div className="popupConfirmOverlay" onClick={props.onReject} />

      <div className="popupConfirmContent">
        <div className="popupConfirmText">
          <Typography>{props.text ?? 'Are you sure?'}</Typography>
        </div>

        <Stack spacing={2} direction="row">
          <Button onClick={props.onAccept} variant="contained">Yes</Button>
          <Button onClick={props.onReject} variant="outlined">No</Button>
        </Stack>
      </div>
    </div>
  )
}