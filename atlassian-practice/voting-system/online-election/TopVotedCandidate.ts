export class TopVotedCandidate {
    persons: number[];
    times: number[];

    constructor(persons: number[], times: number[]) {
        this.persons = persons;
        this.times = times;
    }

    q(t: number): number {
        const idxForTime = this.findIdxForTime(t);
        const counts = this.aggregateVotesUpToIndex(idxForTime);
        return this.findWinnerForTime(counts);
    }

    findWinnerForTime(counts: { [key: number]: { voteOrder: number[], sum: number} }) {
        const sorted = Object
            .entries(counts)
            .sort(([candidateA, votesA], [candidateB, votesB]) => {
                // Compare total votes
                if (votesA.sum > votesB.sum) {
                    return -1;
                } else if (votesA.sum < votesB.sum) {
                    return 1;
                }

                // If there is a tie fall back to vote order
                let i = votesA.voteOrder.length - 1;
                while (i >= 0) {
                    if (votesA.voteOrder[i] > votesB.voteOrder[i]) {
                        return -1
                    } else if (votesA.voteOrder[i] < votesB.voteOrder[i]) {
                        return 1
                    }

                    i -= 1;
                }
                throw new Error('Couldn\'t find a winner');
            });

        return sorted[0][0] as unknown as number;
    }

    /**
     * @todo CACAE MORE STUFF + Optimise
     * @param indexOfQueryTime
     */
    aggregateVotesUpToIndex(indexOfQueryTime: number) {
        const counter: { [key: number]: { voteOrder: number[], sum: number} } = {};
        for (let i = 0; i <= indexOfQueryTime; i++) {
            const voteAtTime = this.persons[i];
            if (!counter[voteAtTime]) {
                counter[voteAtTime] = {
                    voteOrder: new Array(indexOfQueryTime + 1).fill(0),
                    sum: 0,
                };
            }

            counter[voteAtTime].voteOrder[i] = 1;
            counter[voteAtTime].sum += 1;
        }
        return counter;
    }

    findIdxForTime(t: number): number {
        let start = 0;
        let end = this.times.length - 1;
        let mid = Math.floor((end - start) / 2);


        if (t > this.times[end]) {
            return end;
        } else if (t < this.times[start]) {
            return start;
        }

        while (true) {
            if (t === this.times[mid]){
                return mid
            } else if  (t <= this.times[mid] && t > this.times[mid - 1]) {
                return mid - 1;
            } else if (t > this.times[mid] && t < this.times[mid + 1]) {
                return mid;
            } else if (t < this.times[mid]) {
                end = mid;
            } else if (t > this.times[mid]) {
                start = mid;
            }

            mid = start + Math.floor((end - start) / 2);
        }
    }
}

/**
 * Your TopVotedCandidate object will be instantiated and called as such:
 * var obj = new TopVotedCandidate(persons, times)
 * var param_1 = obj.q(t)
 */