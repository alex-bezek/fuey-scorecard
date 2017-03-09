import React, { PropTypes }  from 'react';

const propTypes = {
  roundNumber: React.PropTypes.number.isRequired,
  playerNumber: React.PropTypes.number.isRequired,
  previousRoundScore: React.PropTypes.number.isRequired,
  currentPhase: React.PropTypes.oneOf(['bidding', 'taking', 'edit', 'done']).isRequired
  // TODO: callback for when calculateScore happens for calling back to game and changing state
};



// React representation a single players turn of a round
class Turn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bid: null,
      taken: null,
      score: null,
    };
    this.setScore = this.setScore.bind(this);
    this.setBid = this.setBid.bind(this);
    this.setTaken = this.setTaken.bind(this);
  }

  setBid(event){
    this.setState({bid: parseInt(event.target.value)}, () => { this.setScore() });
  }

  setTaken(event){
    this.setState({taken: parseInt(event.target.value)}, () => { this.setScore() });
  }

  setScore(){
    let newScore = this.calculateScore();
    if(newScore != this.state.score){
      this.setState({
        score: newScore
      });
      this.props.scoreChangeCallback(this.props.roundNumber, this.props.playerNumber, newScore);
    }
  }

  calculateScore(){
    let bid = this.state.bid;
    let taken = this.state.taken;
    let previousRoundScore = this.props.previousRoundScore;
    if(bid === null || taken === null){
      return null;
    }
    // They bid fuey
    if(bid == 0){
      // And got it so they get 5 points
      if(bid == taken){
        return previousRoundScore + 5;
      } else { // They didn't get fuey but their score stays the same
        return previousRoundScore;
      }
    } else { // They bid non fuey
      // And got it so give them 10 plus what they bid
      if(bid == taken){
        return previousRoundScore + 10 + bid;
      } else { // And failed so they lose points
        return previousRoundScore - bid;
      }
    }
  }

  render() {
    // TODO: Make taken/bid field display as empty if null AND allow 0 to be entered
    return (
      <td>
        <div>
          <input
            type="number"
            name="bid"
            min="0"
            disabled={!["edit", "bidding"].includes(this.props.currentPhase)}
            max={this.props.roundNumber}
            value={this.state.bid == null ? '' : this.state.bid}
            onChange={this.setBid}
          />
        </div>
        <div>
          <input
          type="number"
          name="taken"
          min="0"
          disabled={!["edit","taking"].includes(this.props.currentPhase)}
          max={this.props.roundNumber}
          value={this.state.taken == null ? '' : this.state.taken} onChange={this.setTaken}
        />
        </div>
        <div>{this.state.score}</div>
      </td>
    )
  }
}

Turn.propTypes = propTypes;

export default Turn;
