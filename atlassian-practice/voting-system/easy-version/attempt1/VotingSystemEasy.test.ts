import { assert } from 'chai';
import {VotingSystemEasyAttempt1} from "./VotingSystemEasyAttempt1";

describe('VotingSystem', function () {
    it('should count votes', async function () {
        const votes = ["A", "C", "E", "B", "A", "B", "C", "B", "D", "B", "A"];

        const vs = new VotingSystemEasyAttempt1();
        const winner = vs.pickWinnerOneRound(votes);

        assert.equal(winner, 'B');
    });
    it('should count votes and choose the winner with the max score reached earlier in the case of a tie', async function () {
        const votes = ["A", "C", "E", "B", "A", "B", "C", "B", "D", "B", "A", 'A'];

        const vs = new VotingSystemEasyAttempt1();
        const winner = vs.pickWinnerOneRound(votes);

        assert.equal(winner, 'B');
    });
});