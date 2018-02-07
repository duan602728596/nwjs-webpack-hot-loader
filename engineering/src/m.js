import React from 'react';
import ReactDOM from 'react-dom';

class Chunk extends React.Component{
  render(){
    return (
      <div>
        <h1>This is chunk.</h1>
        <p>你好</p>
      </div>
    );
  }
}

ReactDOM.render(<Chunk />, document.getElementById('react-chunk'));