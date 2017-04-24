import React  from 'react';
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
      // Current round is 1 indexed. This is the programs round number, so even if
      // we have gone up to 10 and one our way back down, the number keeps increasing
      currentRound: 1,
      // Boolean to control if we are increasing round or decreasing
      goingUp: true,
      currentPhase: 'bidding',
      // Array of Arrays of integers. Outer array is number of current rounds + 1,
      // values are previous round scores + current rounds score. Score set 0 is all 0's
      // Since round 1's previous score was 0.
      scores: [
        [0,0,0,0],
        [null,null,null,null],
      ],
    };
    // 52 cards in a deck. So the number of rounds is dictated by the number of players
    // By default we also only allow up to 10 rounds
    // Logical Round Count where 7 means we play up to 7 and back down
    this.maxLogicalRoundCount = Math.min(10, Math.floor(52/this.props.numberOfPlayers));
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
              // the previous rounds score since scores are 1 indexed.
              [...Array(this.state.currentRound).keys()].map((round) => {
                const logicalRound = this.state.goingUp ? (round + 1) : (round + 1 - this.maxLogicalRoundCount);
                return(
                  <Round
                    key={'round_' + logicalRound}
                    roundNumber={logicalRound}
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
