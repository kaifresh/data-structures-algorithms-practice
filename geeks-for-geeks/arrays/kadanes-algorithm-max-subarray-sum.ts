// taken from https://practice.geeksforgeeks.org/problems/kadanes-algorithm-1587115620/1

const input = [1, 2, 3, -2, 5];
const N = input.length;

//////////
let idxStart = 0;
let idxStop = 0;
let max = input[idxStart];
// At each number you want decide whether to
// - Keep the current string
// - Start a new string


// Decision function OPT is Math.max()
for (let i = 1; i <= N; i++) {
    const withThisElement = max + input[i];

    if (withThisElement > input[i]) {
        if (withThisElement > max){
            max = withThisElement;
        }
        idxStop = i;
    } else {
        idxStart = i;
        idxStop = i; // if this is legit move it
    }
}

let sum = 0;
for (let i = idxStart; i <= idxStop; i++) {
    sum += input[i];
}

console.log(sum);