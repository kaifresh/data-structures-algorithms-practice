import {assert} from 'chai';
import {TopVotedCandidate} from "./TopVotedCandidate";

describe('TopVotedCandidate', function () {
    describe('tst input 2', function () {
        let voting: TopVotedCandidate;
        // ["TopVotedCandidate","q","q","q","q","q","q","q","q","q","q"]
        //     [[,],[45],[49],[59],[68],[42],[37],[99],[26],[78],[43]]
        beforeEach(() => {
            voting = new TopVotedCandidate(
                [0,0,0,0,1],
                [0,6,39,52,75]
            );
        });
        it('should get index at time 45', async function () {
            const index = voting.findIdxForTime(99);
            assert.equal(index, 1);
        });
        it('should query at time 45', async function () {
            const winner = voting.q(37);
            console.log(winner);
        });

    });
    describe('test input 1', function () {
        let voting: TopVotedCandidate;
        beforeEach(() => {
            voting = new TopVotedCandidate(
                [0, 1, 1, 0, 0, 1, 0],
                [0, 5, 10, 15, 20, 25, 30]
            );
        });
        describe('finding the right index', function () {

            it('should find an index for an exact time correctly using binary search', async function () {
                const index = voting.findIdxForTime(5);
                assert.equal(index, 1);
            });
            it('should find an index for a high exact time', async function () {
                const index = voting.findIdxForTime(25);
                assert.equal(index, 5);
            });
            it('should find an index for a high inexact time', async function () {
                const index = voting.findIdxForTime(24);
                assert.equal(index, 4);
            });
            it('should find an index for a time which is lower than a provided time', async function () {
                const index = voting.findIdxForTime(4);
                assert.equal(index, 0);
            });
            it('should find an index for a time which is higher than a provided time', async function () {
                const index = voting.findIdxForTime(10);
                assert.equal(index, 2);
            });
        });
        describe('Selecting a winner at a time', function () {
            it('should query the votes at time 12', async function () {
                const winner = voting.q(12);
                assert.equal(winner, 1);
            });
            it('should query the votes at time 25', async function () {
                const winner = voting.q(25);
                assert.equal(winner, 1);
            });
            it('should query the votes at time 24', async function () {
                const winner = voting.q(24);
                assert.equal(winner, 0);
            });
            it('should query the votes at time 3', async function () {
                const winner = voting.q(3);
                assert.equal(winner, 0);
            });
        });
    });
});