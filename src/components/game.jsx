import React from 'react';
import RouletteButton from './rouletteButton';
import io from 'socket.io-client';
import UserList from './userList';
import UsernameModel from './modal';

class Game extends React.Component{
  constructor(props) {
    super(props);
    this.reduceShots = this.reduceShots.bind(this);
    this.onMongoData = this.onMongoData.bind(this);
    this.notYourTurn = this.notYourTurn.bind(this);
    this.state = {
      users: '',
      shots: 6,
      deadlyBullet: null,
      dead: false,
      testSocket: '',
      turn: 1,
      gameOn: false,
      player1: null,
      player2: null,
      yourTurn: false,
      winner: false,
    }
  }

  componentDidMount() {
    setInterval(() => {
      const req = new XMLHttpRequest();
      req.addEventListener('load', this.onMongoData);
      req.open('GET', 'http://localhost:5000/data');
      req.send();
    }, 1000)

    let array = [];

    let that = this;

    var socket = io('http://clickclickbang.2016.nodeknockout.com/')
    socket.on('join room', function(param) {
      that.setState({ player1: socket.id, player2: param.opponentId });
      that.setState({ gameOn: true });
      that.setState({ deadlyBullet: param.deadlyBullet });
    })

    socket.on('yourTurn', function(data) {
      that.setState({ yourTurn: true });
      that.setState({ shots: data.bullets });
    })

    socket.on('winner', function(data) {
      that.setState({ gameOn: false });
      that.setState({ yourTurn: false });
      that.setState({ winner: true });
    })

    array.push(socket);
    this.setState({ testSocket: array });
  }

  onMongoData(data) {
    let people = JSON.parse(data.currentTarget.response);
    this.setState({ users: people });
  }

  reduceShots() {
    if (this.state.deadlyBullet === this.state.shots) {
      this.setState({ dead: true });
      this.state.testSocket[0].emit('rip', { id: this.state.testSocket[0].id });
    } else {
      this.setState({ shots: this.state.shots - 1 });
    }
  }

  notYourTurn() {
    this.setState({ yourTurn: false });
  }

  render() {
    return(
      <div>
        <div id="users">
          <UsernameModel socket={this.state.testSocket}/>
          <h3>Users</h3>
          <UserList users={this.state.users} />
        </div>
        <div id="shots">
          Shots Remaining: {this.state.shots}
        </div>
        {(this.state.gameOn && this.state.yourTurn)
          ?<RouletteButton
              socket={this.state.testSocket}
              reduceShots={this.reduceShots}
              notYourTurn={this.notYourTurn}
              />
          : null
        }
        {
          this.state.dead
          ? <h3>BANG</h3>
          : null
        }
        {
          this.state.winner
          ? <h3>YOU WIN</h3>
          : null
        }
      </div>
    )
  }
}

export default Game;
