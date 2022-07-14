import { assert } from 'chai';
import {FileReporter, IFile} from "./FileReporter";

describe('FileSystem', function () {
    it('should return the total size of the files', async function () {
        // arrange
        const files: IFile[] = [
            {name: 'file1.txt', size: 100},
            {name: 'file2.txt', size: 200, collections: ['collection1']},
            {name: 'file3.txt', size: 300, collections: ['collection2']},
            {name: 'file4.txt', size: 400, collections: ['collection2']},
        ];

        // act
        const fileReporter = new FileReporter();
        const result  = fileReporter.processFiles(files);

        // assert
        assert.equal(result.totalSize, 1000);
    });
    it('should return the aggregated sizes of each collection', async function () {
        // arrange
        const files: IFile[] = [
            {name: 'file1.txt', size: 100},
            {name: 'file2.txt', size: 200, collections: ['collection1']},
            {name: 'file3.txt', size: 300, collections: ['collection2']},
            {name: 'file4.txt', size: 400, collections: ['collection2']},
        ];

        // act
        const fileReporter = new FileReporter();
        const result  = fileReporter.processFiles(files);

        // assert
        assert.equal(result.collections['collection1'].size, 200);
        assert.equal(result.collections['collection2'].size, 700);
    });
    it('should return the top 2 collections', async function () {
        // arrange
        const files: IFile[] = [
            {name: 'file1.txt', size: 100},
            {name: 'file2.txt', size: 200, collections: ['collection1']},
            {name: 'file3.txt', size: 300, collections: ['collection2']},
            {name: 'file4.txt', size: 400, collections: ['collection2']},
            {name: 'file5.txt', size: 1000, collections:[ 'collection3']},
            {name: 'file6.txt', size: 1000, collections:[ 'collection3']},
        ];

        // act
        const fileReporter = new FileReporter();
        const {collections}  = fileReporter.processFiles(files);
        const topN = fileReporter.findTopNCollections(collections, 3);

        // assert
        assert.equal(topN[0].name, 'collection3');
        assert.equal(topN[1].name, 'collection2');
    });
    it('should error out if we request a topN greater than the number of collections', async function () {
        // arrange
        const files: IFile[] = [
            {name: 'file1.txt', size: 100},
            {name: 'file2.txt', size: 200, collections: ['collection1']},
            {name: 'file3.txt', size: 300, collections: ['collection2']},
            {name: 'file4.txt', size: 400, collections: ['collection2']},
            {name: 'file5.txt', size: 1000, collections:[ 'collection3']},
            {name: 'file6.txt', size: 1000, collections:[ 'collection3']},
        ];

        // act
        const fileReporter = new FileReporter();
        const {collections}  = fileReporter.processFiles(files);

        // assert
        assert.throws( () => fileReporter.findTopNCollections(collections, 20));

    });
    it('should process files in multiple collections', async function () {
        // arrange
        const files: IFile[] = [
            {name: 'file1.txt', size: 100},
            {name: 'file2.txt', size: 200, collections: ['collection1', 'collection5']},
            {name: 'file3.txt', size: 300, collections: ['collection2']},
            {name: 'file4.txt', size: 400, collections: ['collection2']},
            {name: 'file5.txt', size: 1000, collections:[ 'collection3']},
            {name: 'file6.txt', size: 1000, collections:[ 'collection3']},
        ];

        // act
        const fileReporter = new FileReporter();
        const {collections}  = fileReporter.processFiles(files);

        assert.equal(collections['collection1'].size,  200);
        assert.equal(collections['collection5'].size,  200);
    });
});