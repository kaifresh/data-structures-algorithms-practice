import { assert } from "chai";
import {VotingSystemAttempt2} from "./VotingSystemAttempt2";

describe('VotingSystem', function () {
    it('should pick a winner', async function () {
        const votes = ["A", "C", "E", "B", "A", "B", "C", "B", "D", "B", "A"];
        const winner = new VotingSystemAttempt2(votes);
        console.log(winner);
    });
    it('should throw an error if a vote is in an invalid format', async function () {
        assert.throws(() => new VotingSystemAttempt2(['AA']));
    });
});