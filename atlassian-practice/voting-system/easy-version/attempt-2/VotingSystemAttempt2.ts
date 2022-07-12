/**
 *  {"A", "C", "E", "B", "A", "B", "C", "B", "D", "B", "A"}
 */
export class VotingSystemAttempt2 {
    constructor(votes: string[]) {
        // count the votes
        const voteCounts = this.countVotes(votes);

        // pick a winner
        const winner = this.selectWinner(voteCounts);
        console.log(winner);
    }

    /**
     * Aggregate the votes by summing
     * Time complexity O(N)
     * Space complexity is O(N) in the worst case
     * @param votes
     * @private
     */
    private countVotes(votes: string[]) {
        return votes.reduce((counts, vote) => {
            this.isValidVote(vote);

            if (!counts[vote]) {
                counts[vote] = 1;
            } else {
                counts[vote] += 1;
            }
            return counts;
        }, {} as {[key: string]: number});
    }

    private selectWinner(voteCounts: {[key: string]: number}) {
        return Object
            .entries(voteCounts)
            .sort(([voteA, countA], [voteB, countB])=>{
                if (countA < countB) {
                    return 1;
                } else if (countA > countB) {
                    return -1;
                } else {
                    return voteA.localeCompare(voteB);
                }
            });
    }

    private isValidVote(vote: string) {
        if (vote.length !== 1) {
            throw new Error('Votes can only be one character long');
        }
    }
}