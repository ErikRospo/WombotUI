import React from "react";
//@ts-ignore
import Button from "./button.tsx";
export default class Controls extends React.Component {
  state: {
    stylemap: Map<any, any>;
    prompt: string;
    style: string;
    left: string | number;
    status: string;
  };
  HOSTNAME = "localhost";
  PORT = "8080";
  baseADDR = `http://${this.HOSTNAME}:${this.PORT}`;
  TIMEOUT = 1000;
  image: any;
  props: any;
  context: any;
  setState: any;
  refs: any;
  forceUpdate: any;
  constructor(props: any) {
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
    console.log(this);
  }
  componentDidMount() {
    let r = fetch(`${this.baseADDR}/getleft`).then(res => {
      res.text().then(value => {
        this.setState({ left: Number(value) });
      });
    });
    this.image.addEventListener("load", () => {
      fetch(`${this.baseADDR}/current/id`).then(val => {
        val.text().then(value => {
          let l = JSON.parse(atob(value));
          this.setState({ prompt: l[0] });

          if (this.state.stylemap.has(l[1])) {
            this.setState({
              style: `Style: ${this.state.stylemap.get(l[1])} (${l[1]})`
            });
          } else {
            fetch(`${this.baseADDR}/style/` + l[1]).then(resvalue => {
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
    });
    r.then(() => {
      this.refresh_img();
    });
  }
  refresh_img() {
    fetch(`${this.baseADDR}/getleft`).then(value => {
      value
        .text()
        .then(value => {
          return Number(value);
        })
        .then(value => {
          this.setState({ left: value });
          if (value > 0) {
            this.image.src = `${this.baseADDR}/new`;
          }
        });
    });
  }
  componentWillUnmount() {}
  accept() {
    let refimage = this.refresh_img;
    let setstate = this.setState;
    let timeout = this.TIMEOUT;
    fetch(`${this.baseADDR}/accept`).then(() => {
      refimage();
      setstate({ status: "accept" });

      setTimeout(() => {
        setstate.setState({ status: "" });
      }, timeout);
    });
  }
  reject() {
    let refimage = this.refresh_img;
    let setstate = this.setState;
    let timeout = this.TIMEOUT;
    fetch(`${this.baseADDR}/reject`).then(() => {
      refimage();
      setstate({ status: "Rejected" });

      setTimeout(() => {
        setstate.setState({ status: "" });
      }, timeout);
    });
  }
  skip() {
    this.refresh_img();
  }
  more(): void {
    let setstate = this.setState;
    
    fetch(`${this.baseADDR}/genmore`).then(val => {
      val.text().then(value => {
        setstate({ status: value });
      });
    });
  }
  render(): JSX.Element {
    return (
      <div id="controls" className="fixed right-0 box-border bottom-0">
        <Button
          callback={this.reject}
          id="reject-button"
          className="button bg-red-500"
          text={"REJECT"}
        />
        <Button
          callback={this.accept}
          id="accept-button"
          className="button bg-lime-500"
          text={"ACCEPT"}
        />
        <Button
          callback={this.skip}
          id="skip-button"
          className="button bg-yellow-500"
          text={"SKIP"}
        />
        <Button
          callback={this.more}
          id="more-button"
          className="button bg-purple-500"
          text={"GENERATE"}
        />
        <br />
        <pre id="prompt" className="w-fit">
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
