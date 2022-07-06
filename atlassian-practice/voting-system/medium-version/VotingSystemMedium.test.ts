import { assert } from 'chai';
import {VotingSystemMedium} from "./VotingSystemMedium";

describe('VotingSystemMedium', function () {
    it('should count some votes', async function () {
        const votes = ["ABC","ACB","ABC","ACB","ACB"];
        const v = new VotingSystemMedium();
        v.pickWinner(votes);
    });
    it('should count some votes where the tie breaking rule is needed', async function () {
        const votes = ["WXYZ","XYZW"];
        const v = new VotingSystemMedium();
        const {answer} = v.pickWinner(votes);

        assert.equal(answer, 'XWYZ');
    });
});