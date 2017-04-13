import React, { PropTypes }  from 'react';
import ReactDOM from 'react-dom';
import Round from './round.jsx';

const propTypes = {
  numberOfPlayers: React.PropTypes.number.isRequired,
  playerNames: React.PropTypes.array.isRequired
};

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // Current round is 1 indexed
      currentRound: 1,
      currentPhase: 'bidding',
      // Array of Arrays of integers. Outer array is number of current rounds + 1,
      // values are previous round scores + current rounds score. Score set 0 is all 0's
      // Since round 1's previous score was 0.
      scores: [
        [0,0,0,0],
        [0,0,0,0],
      ],
    };
    this.maxRounds = Math.floor(52/this.props.numberOfPlayers);
    this.nextPhase = this.nextPhase.bind(this);
    this.scoreChangeCallback = this.scoreChangeCallback.bind(this);
  }

  // Round number is expected to be 1 indexed, player is 0 indexed
  scoreChangeCallback(roundNumber, player, value){
    if(this.state.scores.length == this.state.currentRound){
      this.setState({
        scores: this.state.scores.concat([[null, null, null, null]])
      });
    }
    // TODO: If we just set the state, its async so this will fail
    let newScores = this.state.scores;
    newScores[roundNumber][player] = value;
    this.setState({
      scores: newScores
    });
  }

  nextPhase() {
    if(this.state.currentPhase == 'bidding'){
      // TODO: Catch if any bid values aren't set yet and thow an error
      // TODO: How do I inspect childrens state. (need to know if each turn has bid set)
      this.setState({
        currentPhase: 'taking'
      });
    } else if(this.state.currentPhase == 'taking') {
      // If all current scores are set, we can contiue to the next round. otherwise alert
      if(this.state.scores[this.state.currentRound].includes(null)){
        alert('Must fill out all of the taken scores');
      } else {
        this.setState({
          currentRound: this.state.currentRound + 1,
          currentPhase: 'bidding',
          scores: this.state.scores.concat([[null,null,null,null]])
        });
      }
    }
  }

  render() {
    return (
      <div>
        <table>
          <tbody>
            <tr>
              <th>Rounds</th>
              {
                this.props.playerNames.map((playerName) => {
                  return (<th key={'playerName_' + playerName}>{playerName}</th>);
                })
              }
            </tr>
            {
              // Round is the 0 indexed round number. So using it to index scores gives you
              // the previous rounds score.
              [...Array(this.state.currentRound).keys()].map((round) => {
                return(
                  <Round
                    key={'round_' + round+1}
                    roundNumber={round+1}
                    previousRoundScores={this.state.scores[round]}
                    currentPhase={((round + 1) == this.state.currentRound ? this.state.currentPhase : 'done')}
                    scoreChangeCallback={this.scoreChangeCallback}
                  />
                );
              })
            }
          </tbody>
        </table>
        <p>Current phase is {this.state.currentPhase}.</p>
        <button type="button" onClick={this.nextPhase}>Continue</button>
      </div>
    );
  }
}

Game.propTypes = propTypes;

ReactDOM.render(
  <Game
    numberOfPlayers={4}
    playerNames={['Alex', 'Kitty', 'Dale', 'Lori']}
  />,
  document.getElementById('game')
);
