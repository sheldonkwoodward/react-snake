import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function inBody(pos, body) {
  for (let p of body) {
    // break at end of snake
    if (p[0] === null && p[1] === null) {
      return false;
    }
    // check for current position
    if (p[0] === pos[0] && p[1] === pos[1]) {
      return true;
    }
  }
  return false
}

class ActionPanel extends React.Component {
  constructor(props){
    super(props);
    this.pressKey = this.pressKey.bind(this);
  }
  pressKey(event) {
    if (event.keyCode >= 37 && event.keyCode <= 40) {
      this.props.press(event.keyCode);
    }
  }
  componentDidMount() {
    document.addEventListener("keydown", this.pressKey, false);
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.pressKey, false);
  }
  render() {
    return ( 
      <input/>
    );
  }
}

class Square extends React.Component {
  render() {
    return (
      <button className="square">
        {this.props.value}
      </button>
    );
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: Date.now(),      
    }
  } 
  renderSquare(x, y) {
    let value = "";
    const pos = [x, y];
    const food = this.props.food;
    const body = this.props.body;
    
    // display character
    if (pos[0] === food[0] && pos[1] === food[1]) {
      value = "·"
    } else if (inBody(pos, body)) {
      value = "o";
    }
    
    return (
      <Square 
        value={value}
      />
    );
  }
  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0, 0)}
          {this.renderSquare(1, 0)}
          {this.renderSquare(2, 0)}
          {this.renderSquare(3, 0)}
          {this.renderSquare(4, 0)}
        </div>
        <div className="board-row">
          {this.renderSquare(0, 1)}
          {this.renderSquare(1, 1)}
          {this.renderSquare(2, 1)}
          {this.renderSquare(3, 1)}
          {this.renderSquare(4, 1)}
        </div>
        <div className="board-row">
          {this.renderSquare(0, 2)}
          {this.renderSquare(1, 2)}
          {this.renderSquare(2, 2)}
          {this.renderSquare(3, 2)}
          {this.renderSquare(4, 2)}
        </div>
        <div className="board-row">
          {this.renderSquare(0, 3)}
          {this.renderSquare(1, 3)}
          {this.renderSquare(2, 3)}
          {this.renderSquare(3, 3)}
          {this.renderSquare(4, 3)}
        </div>
        <div className="board-row">
          {this.renderSquare(0, 4)}
          {this.renderSquare(1, 4)}
          {this.renderSquare(2, 4)}
          {this.renderSquare(3, 4)}
          {this.renderSquare(4, 4)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      food: [0, 0],
      body: Array(25).fill([null, null]),
      length: 2,
      alive: true,
      key: 38,
    };
    
    // set initial body
    let state = this.state;
    state.body[0] = [2, 2];
    state.body[1] = [2, 3];
    state.food = this.newFoodPos();
    this.setState(state);
    
  }
  move() {
    let state = this.state;
    
    // move body back
    for (let i = this.state.length - 1; i >= 0; i--) {
      state.body[i + 1] = state.body[i];
    }
    
    // left
    if (this.state.key === 37) {
      state.body[0] = [state.body[1][0] - 1, state.body[1][1]]
    }
    // up
    if (this.state.key === 38) {
      state.body[0] = [state.body[1][0], state.body[1][1] - 1]
    }
    // right
    if (this.state.key === 39) {
      state.body[0] = [state.body[1][0] + 1, state.body[1][1]]
    }
    // down
    if (this.state.key === 40) {
      state.body[0] = [state.body[1][0], state.body[1][1] + 1]
    }
    
    // eat or dont grow
    if (state.body[0][0] === state.food[0] && state.body[0][1] === state.food[1]) {
      state.length++;
      state.food = this.newFoodPos();
    } else {
      state.body[state.length] = [null, null];
    }
    
    // dead
    if (this.dead()) {
      clearInterval(this.interval);
      alert("Your snake died!");
      window.location.reload();
    }
    
    // set new state
    this.setState(state);
  }
  start() {
    this.interval = setInterval(() => this.move(this.state.key), 300);
  }
  dead() {
    let length = this.state.length;
    let body = this.state.body;
    
    for (let i = 1; i < length; i++) {
      // hit self
      if (body[0][0] === body[i][0] && body[0][1] === body[i][1]) {
        return true;
      }
      // hit wall
      if (body[0][0] < 0 || body[0][0] > 4 ||
          body[0][1] < 0 || body[0][1] > 4) {
        return true;
      }
      // checked whole snake
      if (body[i][0] === null && body[i][1] === null) {
        break;
      }
    }
    return false;
  }
  newFoodPos() {
    let food = [0, 0];
    do {
      food = [Math.floor(Math.random() * 5), Math.floor(Math.random() * 5)];
    } while(inBody(food, this.state.body));
    return food;
  }
  setKey(keyCode) {
    let state = this.state;
    state.key = keyCode;
    this.setState(state);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  render() {
    const food = this.state.food;
    const body = this.state.body;
    return (
      <div>
        <ActionPanel
          press={keyCode => this.setKey(keyCode)}
        />
        <Board 
          food={food}
          body={body}
        />
        <button
          onClick={() => this.start()}
        >
          Start!
        </button>
      </div>
    );
  }
}

ReactDOM.render(<Game className="game" />, document.getElementById("root"));