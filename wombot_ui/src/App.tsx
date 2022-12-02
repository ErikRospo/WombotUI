import React from "react";
import "./App.css";
//@ts-ignore
import Controls from "./components/controls.tsx";
//@ts-ignore
import { baseADDR } from "./constants.ts";
//@ts-ignore
export default class App extends React.Component {
  state: { controls: Controls };
  constructor(props: { src: string }) {
    super(props);
    this.state = {
      controls: (
        <Controls
          img={
            <img
              id="preview"
              className="max-w-full max-h-screen m-auto"
              alt=""
              src={baseADDR+"/new"}
            />
          }
          parent={this}
        />
      )
    };
  }
  render() {
    return (
      <div className="App bg-black">
        <div className="bg-black">
          <div className="grid h-full bg-gray-900">
            {this.state.controls.image}

          </div>
          {this.state.controls}
        </div>
      </div>
    );
  }
}
