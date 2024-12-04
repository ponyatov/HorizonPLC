class PublishQueue {
    constructor(delay, capacity) {
        if (!delay) throw new Error();

        this._Queue = [];
        this._Capacity = capacity || 10;
        this._Delay = delay;
        this._IsOnProcess = false;
    }
    /**
     * @method
     * @param {Function} task 
     */
    AddTask(task, isPrioritized) {
        if (this._Queue.length >= this._Capacity - 1) this._Queue.shift();

        if (isPrioritized) this._Queue.push(task);
        else this._Queue.unshift(task);

        if (!this._IsOnProcess) this.ProcessTask();
    }

    ProcessTask() {
        this._IsOnProcess = true;
        let task = this._Queue.pop();
        task();
 
        setTimeout(() => {
            this._IsOnProcess = false;  
            if (this._Queue.length) this.ProcessTask();
        }, this._Delay);
    }
}
