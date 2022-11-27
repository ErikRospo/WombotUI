import React from "react";

export default function Button(props): JSX.Element {
  return (
    <button onClick={props.callback(this)} className={props}>
      {props.text}
    </button>
  );
}
