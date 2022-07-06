function countInstances(votes: string[], position: number) {//, previousWinners: string[]) {
    const counts: {[key: string]: number} = {};
    for (let i = 0; i < votes.length; i++) {
        const c = votes[i].charAt(position);

        if (!counts[c]) {
            counts[c] = 0;
        }
        counts[c] += 1;
    }

    return counts;
}


function chooseWinners(counts: {[key: string]: number}) {
    const largest = Object.entries(counts)
        .reduce((acc, [_team, count]) => {
        return (count > acc ? count : acc) as number;
    }, -1);

    return Object.entries(counts)
        .reduce((acc, [team, count])=> {
            if (count === largest){
                acc[team] = count;
            }
            return acc;
        }, {} as {[key: string]: number});
}

function mergeCounterObjects(lastTie: {[key: string]: number}, winners: {[key: string]: number}) {
    return Object.entries(lastTie)
        .reduce((acc, [team, score])=>{
            acc[team] = score;
            acc[team] += winners[team] || 0;
            return acc;
        }, {} as {[key: string]: number});
}

function getKeysInOrderOfValue(object: {[key: string]: number}) {
    return Object
        .entries(object)
        .sort(([teamA, scoreA], [teamB, scoreB])=>scoreA < scoreB ? 1 : -1)
        .map(([team, score])=> team);
}

function rankTeams(votes: string[]): string {
    const solution: string[] = [];
    const numRounds = votes[0].length;

    const allCounts: {[key: string]: number}[] = [];
    for (let i = 0; i < numRounds; i ++) {
        allCounts.push(countInstances(votes, i));
    }

    // The real work
    const q = [];
    for (let round of allCounts) {
        const winners = chooseWinners(round);

        for (let alreadyUsed of solution) {
            delete winners[alreadyUsed];
        }

        if (q.length > 0) {
            const lastTie = q.pop()!;
            const merged = mergeCounterObjects(lastTie, winners);

            const winnersAfterTie = chooseWinners(merged);
            if (Object.keys(winnersAfterTie).length > 1) {
                // Still no tie break
                q.unshift(winnersAfterTie);
            } else {
                solution.push(...getKeysInOrderOfValue(merged));
                for (let alreadyUsed of solution) {
                    delete winners[alreadyUsed];
                }
            }

            q.unshift(winners);
            // console.log(lastTie, merged);
            // resolve the tie with the winners

        }
        else if (Object.keys(winners).length === 1) {
            // Unambiguous winning case
            solution.push(Object.keys(winners)[0]);
        }
        else if (Object.keys(winners).length > 1) {
            q.unshift(winners);
            // Try to break the tie using the state of the previous round
        }
    }

    while (q.length > 0) {
        const remaining = q.pop()!;
        for (let alreadyUsed of solution) {
            delete remaining[alreadyUsed];
        }
        solution.push(
            ...Object.keys(remaining).sort((a, b) => a.localeCompare(b))
        );
    }
    // console.log(allCounts, q);
    return solution.join('');
}

// const bestTeam = rankTeams(["ABC","ACB","ABC","ACB","ACB"])
// const bestTeam = rankTeams( ["WXYZ","XYZW"])
// const bestTeam = rankTeams(["AXYB","AYXB","AXYB","AYXB"]);
const bestTeam = rankTeams(["FVSHJIEMNGYPTQOURLWCZKAX","AITFQORCEHPVJMXGKSLNZWUY","OTERVXFZUMHNIYSCQAWGPKJL","VMSERIJYLZNWCPQTOKFUHAXG","VNHOZWKQCEFYPSGLAMXJIUTR","ANPHQIJMXCWOSKTYGULFVERZ","RFYUXJEWCKQOMGATHZVILNSP","SCPYUMQJTVEXKRNLIOWGHAFZ","VIKTSJCEYQGLOMPZWAHFXURN","SVJICLXKHQZTFWNPYRGMEUAO","JRCTHYKIGSXPOZLUQAVNEWFM","NGMSWJITREHFZVQCUKXYAPOL","WUXJOQKGNSYLHEZAFIPMRCVT","PKYQIOLXFCRGHZNAMJVUTWES","FERSGNMJVZXWAYLIKCPUQHTO","HPLRIUQMTSGYJVAXWNOCZEKF","JUVWPTEGCOFYSKXNRMHQALIZ","MWPIAZCNSLEYRTHFKQXUOVGJ","EZXLUNFVCMORSIWKTYHJAQPG","HRQNLTKJFIEGMCSXAZPYOVUW","LOHXVYGWRIJMCPSQENUAKTZF","XKUTWPRGHOAQFLVYMJSNEIZC","WTCRQMVKPHOSLGAXZUEFYNJI"]);
// const bestTeam = rankTeams( ["BCA","CAB","CBA","ABC","ACB","BAC"]);

console.log(`The best team was ${bestTeam}`);