// minheap.js
//
// custom min heap implementation
//
// used in dijkstra algorithm
// because javascript does not have
// built-in priority queue
//
// heap item format:
// [distance, node]

class MinHeap
{
    constructor()
    {
        this.heap = [];
    }

    // insert new item
    push(item)
    {
        this.heap.push(item);

        this.bubbleUp(
            this.heap.length - 1
        );
    }

    // remove smallest element
    pop()
    {
        // empty heap
        if (this.heap.length === 0)
            return null;

        const top = this.heap[0];

        const last = this.heap.pop();

        // if heap still has elements
        if (this.heap.length > 0)
        {
            this.heap[0] = last;

            this.bubbleDown(0);
        }

        return top;
    }

    // returns current heap size
    size()
    {
        return this.heap.length;
    }

    // move node upwards
    bubbleUp(index)
    {
        while (index > 0)
        {
            const parent =
                Math.floor((index - 1) / 2);

            // compare distances
            if (
                this.heap[parent][0] >
                this.heap[index][0]
            )
            {
                // swap
                [
                    this.heap[parent],
                    this.heap[index]
                ]
                =
                [
                    this.heap[index],
                    this.heap[parent]
                ];

                index = parent;
            }
            else
            {
                break;
            }
        }
    }

    // move node downwards
    bubbleDown(index)
    {
        const n = this.heap.length;

        while (true)
        {
            let smallest = index;

            const left =
                2 * index + 1;

            const right =
                2 * index + 2;

            // check left child
            if (
                left < n &&
                this.heap[left][0] <
                this.heap[smallest][0]
            )
            {
                smallest = left;
            }

            // check right child
            if (
                right < n &&
                this.heap[right][0] <
                this.heap[smallest][0]
            )
            {
                smallest = right;
            }

            // already valid heap
            if (smallest === index)
                break;

            // swap
            [
                this.heap[index],
                this.heap[smallest]
            ]
            =
            [
                this.heap[smallest],
                this.heap[index]
            ];

            index = smallest;
        }
    }

    // helper function
    printHeap()
    {
        console.log(this.heap);
    }
}