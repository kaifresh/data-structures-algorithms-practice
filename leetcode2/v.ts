import {Heap} from "mnemonist";
/**
 * 2. Given a list of candidates, find the winner only.
 * Also for handling a tie, the candidate (out of all the candidates who had the same vote count),
 * who secured highest votes first should be the winner.
 */

interface IVote {
    candidate: string;
    voteCount: number;
    lastVotedRound: number;
    votes: number[];
}

export class VotingSystem {
    countVotes(votes: string[]) {
        const { best } = this.aggregateVotesAndGetBest(votes);
        console.log(best);
        const countedVotes = this.aggregateVotes(votes);
        const winner = this.selectWinner(countedVotes);
        return winner!.candidate;
    }

    private aggregateVotes(votes: string[]) {
        const counter: {[key: string]: IVote} = {};

        for (let i = 0; i < votes.length; i++) {
            const vote = votes[i];
            if (!counter[vote]) {
                counter[vote] = {
                    candidate: vote,
                    voteCount: 1,
                    lastVotedRound: i,
                    votes: (new Array(votes.length).fill(0)),
                };
                counter[vote].votes[i] = 1;
            } else {
                counter[vote].voteCount += 1;
                counter[vote].lastVotedRound = i;
                counter[vote].votes[i] = 1;
            }
        }

        return counter;
    }

    /**
     * example of doing it in one pass
     * @param votes
     * @private
     */
    private aggregateVotesAndGetBest(votes: string[]) {
        let best: IVote = {
            candidate: '',
            voteCount: -1,
            lastVotedRound: -1,
            votes: (new Array(votes.length)).fill(0),
        };

        const counter: {[key: string]: IVote} = {};

        for (let i = 0; i < votes.length; i++) {
            const vote = votes[i];
            if (!counter[vote]) {
                counter[vote] = {
                    candidate: vote,
                    voteCount: 0,
                    lastVotedRound: 0,
                    votes: (new Array(votes.length).fill(0)),
                };
            }
            counter[vote].voteCount += 1;
            counter[vote].lastVotedRound = i;
            counter[vote].votes[i] = 1;
            // Track best in one pass
            if (this.compareVotes(best, counter[vote]) > 0) {
                best = counter[vote];
            }
        }

        return {best, counter};
    }

    private compareVotes(voteA: IVote, voteB: IVote) {
        // const result = this.compareBinaryVotes(voteA, voteB);
        // return result;
        // The winner should be determined by vote count
        if (voteA.voteCount > voteB.voteCount) {
            return -1;
        } else if (voteA.voteCount < voteB.voteCount) {
            return 1;
        }

        // In the case of a tie, fall back to the last round
        // We assume its not possible to tie on the last round because of the input
        return voteA.lastVotedRound < voteB.lastVotedRound ? -1 : 1;
    }

    // private compareBinaryVotes(voteA: IVote, voteB: IVote) {
    //     const aVotesBinary = voteA.votes.join('');
    //     const bVotesBinary = voteB.votes.join('');
    //
    //     return aVotesBinary.localeCompare(bVotesBinary);
    // }

    private selectWinner(countedVotes: {[key: string]: IVote}) {
        const votes = Object.values(countedVotes);
        const priorityQueue = Heap<IVote>.from(votes, this.compareVotes);
        return priorityQueue.peek();
    }
}