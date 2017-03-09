import React, { PropTypes }  from 'react';
import Turn from './turn.jsx'

const propTypes = {
  roundNumber: React.PropTypes.number.isRequired,
  previousRoundScores: React.PropTypes.array.isRequired,
  currentPhase: React.PropTypes.oneOf(['bidding', 'taking', 'edit', 'done']).isRequired
};

// React representation of a full round
class Round extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    if(this.props.previousRoundScores == null){
      return null;
    }
    return (
      <tr key={"round_tr_" + this.props.roundNumber}>
        <th>
          Round: {this.props.roundNumber}
        </th>
        {
          this.props.previousRoundScores.map((previousRoundScore, index) => {
            return(
              <Turn
                key={"turn_" + index}
                roundNumber={this.props.roundNumber}
                playerNumber={index}
                previousRoundScore={previousRoundScore}
                currentPhase={this.props.currentPhase}
                scoreChangeCallback={this.props.scoreChangeCallback}
              />
            )
          })
        }
      </tr>
    )
  }
}

Round.propTypes = propTypes;

export default Round;
