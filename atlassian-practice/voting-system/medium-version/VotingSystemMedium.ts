/**
 * In a special ranking system, each voter gives a rank from highest to lowest to all teams participated in the competition.
 *
 * THIS IS JUST LEXIOGRAPHICAL ORDERING!! EXPLAINED IN A VERY COMPLICATED WAY.
 * The ordering of teams is decided by who received the most position-one votes.
 * If two or more teams tie in the first position, we consider the second position to resolve the conflict,
 * if they tie again, we continue this process until the ties are resolved.
 * If two or more teams are still tied after considering all positions, we rank them alphabetically based on their team
 * letter.
 * Given an array of strings votes which is the votes of all voters in the ranking systems.
 * Sort all teams according to the ranking system described above.
 * Return a string of all teams sorted by the ranking system.
 *
 * based on https://leetcode.com/problems/rank-teams-by-votes/
 */
import {VotingSystemEasyAttempt1} from "../easy-version/attempt1/VotingSystemEasyAttempt1";

export class VotingSystemMedium {
    pickWinner(votes: string[]) {
        const countedVotes = this.countVotes(votes);

        const sorted = this.sortCountedVotes(countedVotes);

        const answer = sorted.map(s => s[0]).join('');

        return {answer, sorted};
    }

    /**
     * Sorts the counted votes using a lexiographic-like approach
     * @param countedVotes
     * @private
     */
    private sortCountedVotes(countedVotes: {[key: string]: number[]}){
        return Object
            .entries(countedVotes)
            .sort(([letterA, votesA], [letterB, votesB])=>{
                let i = 0;
                let comparison = 0;

                // Comparing across vote arrays
                while(i < votesA.length - 1) {
                    if (votesA[i] < votesB[i]) {
                        comparison = 1;
                        break;
                    } else if (votesB[i] < votesA[i]) {
                        comparison = -1;
                        break;
                    }
                    i++;
                }
                if (comparison !== 0) {
                    return comparison;
                }

                // Fallback to lexiographic ordering
                return letterA.localeCompare(letterB);
            });
    }

    /**
     *
     * @param votes
     * @private
     */
    private countVotes(votes: string[]) {
        const numberOfVotes = votes[0].length;
        const counter: {[key: string]: number[]} = {};
        votes.forEach((voteForVoter) => {
            voteForVoter.split('').forEach((voteInRound, round) =>{
                if (!counter[voteInRound]) {
                    counter[voteInRound] = new Array(numberOfVotes).fill(0);
                }
                counter[voteInRound][round] += 1;
            });
        });

        return counter;
    }
}