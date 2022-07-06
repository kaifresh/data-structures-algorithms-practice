import {FileSystem} from './FileSystem';
describe('FileSystem', function () {
    describe('constructor', function () {
        it('should parse an input string into files', async function () {
            const testData = `file1.txt(size: 100)
file2.txt(size: 200) in collection "collection1"
file3.txt(size: 200) in collection "collection1"
file4.txt(size: 300) in collection "collection2"
file5.txt(size: 100)`;
            const fs = new FileSystem(testData);
            console.log(fs);
        });
    });
});