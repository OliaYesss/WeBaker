import { Paper, Table, TableBody, TableCell, TableContainer, TableRow, TableHead } from '@mui/material'
import React from 'react'
import { ALIGN } from '../utils/base'

function TableRowWrapper(props) {
  return (
    <TableRow>
      {
        props.row.map((cell, index) => 
          <TableCell
            sx={props.sx}
            key={index}
            align={ALIGN}>
              {cell}
          </TableCell>
        )
      }
    </TableRow>
  )
}

export function TableWrapper(props) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRowWrapper row={props.head} />
        </TableHead>
        <TableBody>
          {
            props.rows
              .map((row, rowIndex) =>
                <TableRowWrapper
                  key={rowIndex}
                  row={row}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                />
              )
          }
        </TableBody>
      </Table>
    </TableContainer>
  )
}