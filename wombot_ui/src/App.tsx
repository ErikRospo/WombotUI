import React from "react";
import "./App.css";
//@ts-ignore
import Button from "./components/button.tsx";
//@ts-ignore
import { baseADDR, TIMEOUT } from "./constants.ts";
//@ts-ignore
let nop = () => {};
export default class App extends React.Component {
  state: {
    stylemap: Map<any, any>;
    prompt: string;
    style: string;
    left: string | number;
    status: string;
    image: JSX.Element;
  };

  props: { src: string; img: any };
  constructor(props: { img: any; src: any }) {
    super(props);
    this.props = props;
    this.state = {
      prompt: "",
      style: "",
      left: "",
      status: "",
      stylemap: new Map(),
      image: <img alt=""></img>,
    };
  }
  componentDidMount(): void {
    let rpromise = fetch(`${baseADDR}/getleft`)
      .then((res) => {
        res.text().then((value) => {
          this.setState({ left: Number(value) });
        });
      })
      .then(() => {
        this.img_refresh(this, () => {
          this.refresh(this);
        });
      });
  }
  updater: undefined;
  refresh(thisobj: this): void {
    fetch(`${baseADDR}/current/id`).then((val) => {
      val.text().then((value): void => {
        let l = JSON.parse(atob(value));
        thisobj.setState({ prompt: l[0] });
        if (this.state.stylemap.has(l[1])) {
          thisobj.setState({
            style: `Style: ${this.state.stylemap.get(l[1])} (${l[1]})`,
          });
        } else {
          fetch(`${baseADDR}/style/` + l[1]).then((resvalue) => {
            resvalue.text().then((strvalue) => {
              this.state.stylemap.set(l[1], strvalue);

              thisobj.setState({
                style: `Style: ${this.state.stylemap.get(l[1])} (${l[1]})`,
              });
            });
          });
        }
      });
    });
  }

  img_refresh(pobject: this, callback: Function): void {
    fetch(`${baseADDR}/getleft`).then((value) => {
      value
        .text()
        .then((value) => {
          return Number(value);
        })
        .then((value) => {
          pobject.setState({ left: value });
          if (value > 0) {
            pobject.setState({
              image: (
                <img
                  id="preview"
                  className="max-w-full max-h-screen m-auto bg-black"
                  alt=""
                  src={`${baseADDR}/new?${Date.now()}`}
                  onLoad={callback()}
                />
              ),
            });
            console.log(pobject);
          }
        });
    });
  }
  accept(pobject: this): void {
    fetch(`${baseADDR}/accept`).then(() => {
      pobject.img_refresh(this, nop);
      pobject.setState({ status: "Accepted" });

      setTimeout(() => {
        pobject.setState({ status: " " });
      }, TIMEOUT);
    });
  }
  reject(pobject: this): void {
    fetch(`${baseADDR}/reject`).then(() => {
      pobject.img_refresh(pobject, nop);
      pobject.setState({ status: "Rejected" });

      setTimeout(() => {
        pobject.setState({ status: " " });
      }, TIMEOUT);
    });
  }
  more(pobject: this): void {
    fetch(`${baseADDR}/genmore`).then((val) => {
      val.text().then((value) => {
        pobject.setState({ status: value });
        setTimeout(() => {
          pobject.setState({ status: " " });
        }, TIMEOUT);
      });
    });
  }
  render() {
    return (
      <div className="App bg-black">
        <div className="bg-black">
          <div className="grid h-full bg-gray-900">{this.state.image}</div>
          <div
            id="controls"
            className="fixed right-0 box-border bottom-0 bg-slate-700"
          >
            <Button
              callback={() => {
                this.reject(this);
              }}
              id="reject-button"
              className="button bg-red-500"
              text={"REJECT"}
              parent={this}
            />
            <Button
              callback={() => {
                this.accept(this);
              }}
              id="accept-button"
              className="button bg-lime-500"
              text={"ACCEPT"}
              parent={this}
            />
            <Button
              callback={() => {
                this.img_refresh(this, nop);
              }}
              id="skip-button"
              className="button bg-yellow-500"
              text={"SKIP"}
              parent={this}
            />
            <Button
              callback={() => {
                this.more(this);
              }}
              id="more-button"
              className="button bg-purple-500"
              text={"GENERATE"}
              parent={this}
            />
            <br />
            <pre id="prompt" className="w-fit text-white text-lg m-1 p-1">
              Prompt: "{this.state.prompt}"
            </pre>
            <pre id="style_int" className="text-lg m-1 p-1 text-white">
              {this.state.style}
            </pre>
            <pre id="images_left" className="text-lg m-1 p-1 text-white">
              Images left: {this.state.left}
            </pre>
            <pre id="status_bar" className="text-lg m-1 p-1 text-white">
              {this.state.status}
            </pre>
          </div>
        </div>
      </div>
    );
  }
}
