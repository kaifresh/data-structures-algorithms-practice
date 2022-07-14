import {Heap} from "mnemonist";

/**
 *
 * The question was initially about a list of files where each file had a collection name and size associated with it. 
 * I was required to calculate the total size of all the files
 * and the total size of each collection.
 * The question was then scaled up where I had to find the top n largest collection sizes
 * and then scaled again to each file having multiple collection names.
 */

export interface IFile {
    name: string;
    size: number;
    collections?: string[];
}

export interface ICollection {
    name: string;
    size: number;
}

export class FileReporter {
    processFiles (files: IFile[]) {
        // calculate the total size of all files
        let totalSize = 0;

        // calculate the total size of each collection
        const collections: {[key: string]: ICollection} = {};

        for (const file of files) {
            totalSize += file.size;

            if (!file.collections) {
                continue;
            }

            for (const collection of file.collections) {
                if (!collections[collection]) {
                    collections[collection] = {
                        name: collection,
                        size: file.size,
                    };
                } else {
                    collections[collection].size += file.size;
                }
            }
        }

        return {totalSize, collections};
    }

    findTopNCollections(collections: {[key: string]: ICollection} | ICollection[], topN: number) {
        const collectionArray = Array.isArray(collections) ? collections : Object.values(collections);

        if (topN > collectionArray.length) {
            throw new Error(`You can only request a topN which is less than or equal to the number of available collections`);
        }

        const collectionHeap = Heap.from(collectionArray, this.compareCollections); // O(N) because we're using heapify()

        const topNCollections: ICollection[] = [];
        for (let i = 0; i < topN; i++) {
            if (collectionHeap.size === 0) {
                break;
            }
            topNCollections.push(collectionHeap.pop()!)
        }

        return topNCollections;
    }


    private compareCollections(collectionA: ICollection, collectionB: ICollection) {
        if (collectionA.size === collectionB.size) {
            return 0;
        }
        return collectionA.size < collectionB.size ? 1 : -1;
    }
}