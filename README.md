# fuey-scorecard

# TODO:
* Move taking/bidding to an enum constant
* Allow to unlock app to edit old fields (have to re-work currentPhase)
* add git hook to make sure dist is compiled before committing
* Replace input number up downs with a react component that handles validations


Move the state of bid/taken up from turn into round. This will allow round to handle horizontal validations, while the state of "score" is still handled at the game level for vertical validations and calculations
