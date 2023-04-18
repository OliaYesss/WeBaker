import React from "react";

export function IconButton(props) {
  const style = {
    fontSize: "16px",
    cursor: "pointer",
    ...(props.styles ?? {})
  }
  return(
    <div style={style} onClick={props.onClick}>
      {props.text}
    </div>
  )
}