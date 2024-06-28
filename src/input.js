import React from "react";

class Input extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchTerm: "React",
    };
  }

  render() {
    const { searchTerm } = this.state;
    return (
      <div>
        <h1>Input Class Component</h1>
        <Input
          id="search"
          value={searchTerm}
          //   onChange={() => this.setState({ searchTerm: event.target.value })}
        />
      </div>
    );
  }
}
export default Input;
