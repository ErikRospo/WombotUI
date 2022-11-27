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
  parent: this;
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
  }
  componentDidMount() {
    fetch(`${this.baseADDR}/getleft`).then(res => {
      res.text().then(value => {
        this.setState({ left: Number(value) });
      });
    }).then(()=>{
        this.img_refresh()
    });
    this.image.props.onload= (): void => {
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
    };
  }
  img_refresh(): void {
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
  accept(): void {
    fetch(`${this.parent.baseADDR}/accept`).then(() => {
      this.parent.img_refresh();
      this.parent.setState({ status: "Accepted" });

      setTimeout(() => {
        this.parent.setState({ status: "" });
      }, this.parent.TIMEOUT);
    });
  }
  reject(): void {
    fetch(`${this.parent.baseADDR}/reject`).then(() => {
      this.parent.img_refresh();
      this.parent.setState({ status: "Rejected" });

      setTimeout(() => {
        this.parent.setState({ status: "" });
      }, this.parent.TIMEOUT);
    });
  }
  skip(): void {
    this.parent.img_refresh();
  }
  more(): void {

    fetch(`${this.parent.baseADDR}/genmore`).then(val => {
      val.text().then(value => {
        this.parent.setState({ status: value });
      });
    });
  }
  render(): JSX.Element {
    return (
      <div id="controls" className="fixed right-0 box-border bottom-0 bg-slate-700">
        <Button
          callback={this.reject}
          id="reject-button"
          className="button bg-red-500"
          text={"REJECT"}
          parent={this}
        />
        <Button
          callback={this.accept}
          id="accept-button"
          className="button bg-lime-500"
          text={"ACCEPT"}
          parent={this}
        />
        <Button
          callback={this.skip}
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
