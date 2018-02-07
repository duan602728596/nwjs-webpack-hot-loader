import React from 'react';
import ReactDOM from 'react-dom';
import m from 'bundle-loader?name=m!./m';

class App extends React.Component{
  render(){
    return (
      <div>
        <h1>Hello, world.</h1>
        <p>HaHaHa!!</p>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('react-app'));