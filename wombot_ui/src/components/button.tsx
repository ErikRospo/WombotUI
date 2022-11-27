import React from "react";


export default class Button extends React.Component{
    props: any;
    render(){
        return (
            <button onClick={this.props.callback} className={this.props.className}>
              {this.props.text}
            </button>
          ); 
    }
}