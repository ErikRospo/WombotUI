import React from "react";
import "./App.css";
//@ts-ignore
import Controls from "./components/controls.tsx";
import { baseADDR } from "./constants.ts";
//@ts-ignore
export default class App extends React.Component {
  state: any;
  constructor(props: any) {
    super(props);
    this.state={img:<img id="preview" className="max-w-full max-h-screen m-auto" alt="" src={`${baseADDR}/new`}/>};
    
  }
  render() {
    return (
      <div className="App">
        <div className="bg-black">
          <div className="grid h-full bg-gray-900">
            {this.state.img}
          </div>
          <Controls img={this.state.img}/>
        </div>
      </div>
    );
  }
}
