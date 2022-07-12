interface ICounter {
    count: number;
    round: number;
}


/**
 * I am assuming its this: https://www.glassdoor.com/Interview/2-Given-a-list-of-candidates-find-the-winner-only-Also-for-handling-a-tie-the-candidate-out-of-all-the-candidates-who-QTN_3942501.html
 * OR This: https://practice.geeksforgeeks.org/problems/winner-of-an-election-where-votes-are-represented-as-candidate-names-1587115621/1
 */
export class VotingSystemEasyAttempt1 {

    /**
     * Given a list of candidates, find the winner only.
     * Also for handling a tie, the candidate (out of all the candidates who had the same vote count),
     * who secured highest votes first should be the winner.
     * @param votes
     */
    pickWinnerOneRound(votes: string[]) {
        // TODO: input validation
        const voteCount = VotingSystemEasyAttempt1.countVotesForIteration(votes);

        const votesUsingSorting = VotingSystemEasyAttempt1.pickWinnerUsingSorting(voteCount);

        return votesUsingSorting[0][0];
    }

    private static pickWinnerUsingSorting(voteCount: {[key: string]: ICounter}) {
        // Do it with sorting
        return Object
            .entries(voteCount)
            .sort((
                [letterA, {count: countA, round: roundA}],
                [letterB, {count: countB, round: roundB}]
            )=>{
                // Handle the core sorting criteria
                if (countA !== countB) {
                    return countA < countB ? 1 : -1; // Votes are sorted descending
                }

                // Handle tie breaks successively
                if (roundA !== roundB) {
                    return roundA < roundB ? -1 : 1;  // Round is sorted ascending
                }

                // If the question was about doing a lexiographic comparison to break the final tie
                return letterA.charCodeAt(0) < letterB.charCodeAt(0) ? 1 : -1;
            });
    }

    private static countVotesForIteration(votes: string[]): {[key: string]: ICounter} {
        const counter: {[key: string]: {
                count: number;
                round: number;
            }} = {};

        for (let i = 0; i < votes.length; i++) {
            const vote = votes[i];
            if (!counter[vote]) {
                counter[vote] = <ICounter>{
                    count: 1,
                    round: i,
                };
            } else {
                const previousCount = counter[vote];
                previousCount.count += 1;
                previousCount.round = i;
                counter[vote] = previousCount; // This could be redundant (check later), but its also more readable this way!
            }
        }

        return counter;
    }

    /**
     * @note takes O(n) time as we're iterating over the input
     * @note O(n) space because we're using a collection in the size of the input
     * @param votes
     */
    private static countVotesForRound(votes: string[]) {
        const counter: {[key: string]: number} = {};

        for (let vote of votes) {
            if (!counter[vote]) {
                counter[vote] = 1;
            } else {
                counter[vote] += 1;
            }
        }

        return counter;
    }
}