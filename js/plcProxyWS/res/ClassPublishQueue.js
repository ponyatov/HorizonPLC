class PublishQueue {
    constructor(capacity, delay) {
        this._Queue = [];
        this._Capacity = capacity;
        this._Delay = delay || 0;
        this._IsOnProcess = false;
    }
    /**
     * @method
     * @param {Function} task 
     */
    AddTask(task) {
        if (this._Queue.length < this._Capacity) this._Queue.unshift(task);
        else this._Queue[0] = task;

        if (!this._IsOnProcess) this.ProcessTask();
    }

    ProcessTask() {
        this._IsOnProcess = true;
        let t = this._Queue.pop();
        t();
        console.log(t.name);
 
        setTimeout(() => {
            this._IsOnProcess = false;  
            if (this._Queue.length) this.ProcessTask();
        }, this._Delay);
    }
}
let q = new PublishQueue(5, 300);
// for (let i = 0; i < 6; i++) {
//     let cb = () => {console.log(`task ${i}`);};
//     cb.name = `task ${i}`;
//     q.AddTask(cb);
// }
// q.AddTask(() => {console.log(`task ${7}`);});
// console.log(q._Queue.length);
// console.log(q._Queue);
q.AddTask(() => {console.log(`task 1`);});
q.AddTask(() => {console.log(`task 2`);});
q.AddTask(() => {console.log(`task 3`);});
q.AddTask(() => {console.log(`task 4`);});
q.AddTask(() => {console.log(`task 5`);});
setTimeout(() => {
    q.AddTask(() => {console.log(`task 6`);});
}, 6);

setTimeout(() => {
    q.AddTask(() => {console.log(`task 54`);});
}, 5);