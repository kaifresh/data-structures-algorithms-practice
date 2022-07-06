function countInstances(votes: string[], position: number, previousWinners: string[]) {
    const counts: {[key: string]: number} = {};
    for (let i = 0; i < votes.length; i++) {
        const c = votes[i].charAt(position);

        if (previousWinners.includes(c)) {
            continue;
        }

        if (!counts[c]) {
            counts[c] = 0;
        }
        counts[c] += 1;
    }

    return counts;
}

function chooseWinners(counts: {[key: string]: number}, previousTies: {[key: string]: number}) {
    const arrayOfWins = Object
        .entries(counts)
        .map(([team, count])=> {
            count += previousTies[team] || 0;
            return [team, count];
        }) as [string, number][];


    const largest = arrayOfWins.reduce((acc, [_team, count]) => {
        return (count > acc ? count : acc) as number;
        }, -1);

    return arrayOfWins.filter(([team, count]) => count === largest);
}

function revertWinnersToCounts(winners: [string, number][]) {
    return winners.reduce((acc, [team, count]) => {
        acc[team] = count;
        return acc;
    }, {} as {[key: string]: number});
}

function rankTeams(votes: string[]): string {
    const numRounds = votes[0].length;

    const previousWinners: string[] = [];

    let ties: {[key: string]: number} = {};

    for (let i = 0; i < numRounds; i ++) {
        const counts = countInstances(votes, i, previousWinners);

        const winners = chooseWinners(counts, ties);

        if (winners.length === 1) {
            previousWinners.push(winners[0][0]);
            const remainingTies = Object.keys(ties);
            if (remainingTies.length > 0) {
                // Add all the broken ties in
                for (let tiedTeam of remainingTies) {
                    if (tiedTeam !== winners[0][0]){
                        previousWinners.push(tiedTeam);
                    }
                }
            }
            ties = {};
        } else {
            ties = revertWinnersToCounts(winners);
        }
    }

    // if there are still ties add them here alphabetically

    // console.log(counts, winners);

    return previousWinners.join('');
}

// const bestTeam = rankTeams(["ABC","ACB","ABC","ACB","ACB"])
const bestTeam = rankTeams( ["WXYZ","XYZW"])

console.log(`The best team was ${bestTeam}`);