import { assert } from 'chai';
import {VotingSystem} from "./v";

describe('VotingSystem', function () {
    it('should count votes', async function () {
        // arrange
        const votes = ["A", "C", "E", "B", "A", "B", "C", "B", "D", "B", "A"];
        const votingSystem = new VotingSystem();

        // act
        const winner = votingSystem.countVotes(votes);

        // assert
        assert.equal(winner, "B");
    });
    it('should count votes and fall back to voting order to determine a winner in the case of a tie', async function () {
        const votes = ["A", "C", "E", "B", "A", "B", "C", "B", "D", "A", "A", "B"];
        const votingSystem = new VotingSystem();
        const winner = votingSystem.countVotes(votes);
        assert.equal(winner, "A");
    });
});