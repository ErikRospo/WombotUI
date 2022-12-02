import React from "react";
//@ts-ignore
import { baseADDR, TIMEOUT } from "../constants.ts";
//@ts-ignore
import Button from "./button.tsx";
let a = <image />;
export default class Controls extends React.Component {
  state: {
    stylemap: Map<any, any>;
    prompt: string;
    style: string;
    left: string | number;
    status: string;
  };

  image: typeof a;
  props: { src: string; img: any };
  parent: this;
  constructor(props: { img: JSX.Element; src: string }) {
    super(props);
    this.props = props;
    this.image = props.img;
    this.state = {
      prompt: "",
      style: "",
      left: "",
      status: "",
      stylemap: new Map()
    };
  }
  componentDidMount() {
    let rpromise = fetch(`${baseADDR}/getleft`).then(res => {
      res.text().then(value => {
        this.setState({ left: Number(value) });
      });
    });
    // return <image onLoad={this.componentDidUpdate}></image>

    this.componentDidUpdate = (): void => {
      fetch(`${baseADDR}/current/id`).then(val => {
        val.text().then(value => {
          let l = JSON.parse(atob(value));
          this.setState({ prompt: l[0] });

          if (this.state.stylemap.has(l[1])) {
            this.setState({
              style: `Style: ${this.state.stylemap.get(l[1])} (${l[1]})`
            });
          } else {
            fetch(`${baseADDR}/style/` + l[1]).then(resvalue => {
              resvalue.text().then(strvalue => {
                this.state.stylemap.set(l[1], strvalue);

                this.setState({
                  style: `Style: ${this.state.stylemap.get(l[1])} (${l[1]})`
                });
              });
            });
          }
        });
      });
    };
    rpromise.then(() => {
      this.img_refresh(this);
    });
  }
  img_refresh(pobject: this): void {
    fetch(`${baseADDR}/getleft`).then(value => {
      value
        .text()
        .then(value => {
          return Number(value);
        })
        .then(value => {
          pobject.setState({ left: value });
          if (value > 0) {
            pobject.image = (
              <img
                id="preview"
                className="max-w-full max-h-screen m-auto"
                alt=""
                src={"http://localhost:8080/new"}
              />
            );
            console.log(pobject);
          }
        });
    });
  }
  accept(pobject: this): void {
    fetch(`${baseADDR}/accept`).then(() => {
      pobject.img_refresh(this);
      pobject.setState({ status: "Accepted" });

      setTimeout(() => {
        pobject.setState({ status: "" });
      }, TIMEOUT);
    });
  }
  reject(pobject: this): void {
    fetch(`${baseADDR}/reject`).then(() => {
      pobject.img_refresh(pobject);
      pobject.setState({ status: "Rejected" });

      setTimeout(() => {
        pobject.setState({ status: "" });
      }, TIMEOUT);
    });
  }
  more(): void {
    fetch(`${baseADDR}/genmore`).then(val => {
      val.text().then(value => {
        this.parent.setState({ status: value });
      });
    });
  }
  render(): JSX.Element {
    return (
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
            this.img_refresh(this);
          }}
          id="skip-button"
          className="button bg-yellow-500"
          text={"SKIP"}
          parent={this}
        />
        <Button
          callback={this.more}
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
    );
  }
}
