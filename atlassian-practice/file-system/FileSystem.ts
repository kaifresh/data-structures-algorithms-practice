export interface IFileInfo {
    collection: string;
    size: number;
}

export interface ICollection {
    collectionName: string;
    size: number;
}

import {MaxHeap, IGetCompareValue} from '@datastructures-js/heap';

export class FileSystem {
    allFileInfo: IFileInfo[];

    constructor(files: string) {
        this.allFileInfo = this.parse(files);
        const totalFileSize = this.getTotalSum(this.allFileInfo);

        const topK = this.getTopKCollectionsBySize(5);
        console.log(`Total size of files processed: ${totalFileSize}.\nTop ${topK.length} collections:\n${topK.map(c => `${c.collectionName}: ${c.size}`).join('\n')}`)
    }

    /**
     *
     * @param k
     */
    public getTopKCollectionsBySize(k: number) {
        // TODO: validity checks on k

        const allAggregatedCollections = this.aggregateCollectionsSize();

        const comparator: IGetCompareValue<ICollection> = (collection: ICollection) => collection.size;
        const heap = new MaxHeap(comparator);
        allAggregatedCollections.forEach(c => heap.push(c));

        const out = [];
        while (!heap.isEmpty() && k > 0) {
            out.push(heap.pop());
            k -= 1;
        }

        return out;
    }

    /**
     *
     * @param allFileInfo
     */
    public getTotalSum(allFileInfo: IFileInfo[]) {
        return allFileInfo.reduce((total, cur) => {
            return total + cur.size;
        }, 0);
    }

    /**
     *
     * @private
     */
    private aggregateCollectionsSize() {
        const aggregated = this.allFileInfo.reduce((all, cur) => {
            // What to do if there is no collection?
            if (!cur.collection) {
                return  all;
            }

            if (!all[cur.collection]) {
                all[cur.collection] = cur.size;
            } else {
                all[cur.collection] += cur.size;
            }
            return all;
        },
            {} as {[key: string]: number});

        return Object.entries(aggregated).map(([name, size]) => ({collectionName: name, size})) as ICollection[];
    }

    /**
     *
     * @param files
     * @private
     */
    private parse (files: string) {
        const sizeRegex = /size: (?<size>\d+)/;
        const collectionRegex = /in collection "(?<collection>.*)"/;
        return files
            .split("\n")
            .map(line => {
                const size = sizeRegex.exec(line);
                const collection = collectionRegex.exec(line);
                if (!size) {
                    return null;
                }
                const maybeCollectionGroups = collection ? collection.groups: {};
                return {
                    ...maybeCollectionGroups,
                    ...size.groups,
                }
            })
            .filter(f => !!f)
            .map(f => {
                return {
                    ...f,
                    size: parseInt(f!.size),
                }
            }) as unknown as IFileInfo[];
    }
}

