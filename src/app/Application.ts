export class Application {
    constructor() { }

    fps = "0"

    private _start: boolean = false
    private _startTime = -1
    private _lastTime = -1
    private _requestId: number | undefined
    private _timer: null | Function = null;
    private _timerStamp = 500;
    private _timeFlag = 0
    public setTimer(fun: Function, time: number) {
        this._timer = fun;
        this._timerStamp = time
    }
    deleteTimer() {
        if (this._timer) {
            this._timer = null
        }
    }
    // 启动动画循环
    public start(): void {
        if (this._start === false) {
            this._start = true;
            //this . _requestId = -1 ; // 将_requestId设置为-1
            // 在start和stop函数中，_lastTime和_startTime都设置为-1
            this._lastTime = -1;
            this._startTime = -1;
            // 启动更新渲染循环

            this.step(0);
        }
    }

    // 不停的周而复始运动
    protected step(timeStamp: number): void {
        if (this._startTime === -1) this._startTime = timeStamp;
        if (this._lastTime === -1) this._lastTime = timeStamp;


        let intervalSec = timeStamp - this._lastTime;

        // 第一帧的时候,intervalSec为0,防止0作分母
        if (intervalSec !== 0) {
            // 计算fps
            this.fps = (1000.0 / intervalSec).toFixed(1);
        } 
        //记录上一次的时间戳
        this._lastTime = timeStamp;
        this._timeFlag += intervalSec
        if (this._timer && this._timeFlag > this._timerStamp) {
            this._timer();
            this._timeFlag = 0
        }
        // 我们update使用的是秒为单位，因此转换为秒表示
        intervalSec /= 1000.0;
        // 先更新
        this.update(intervalSec);
        // 后渲染
        this.render();
        // 递归调用，形成周而复始的前进
        this._requestId = requestAnimationFrame((elapsedMsec: number): void => {
            this.step(elapsedMsec);
        });
    }
    /**
     * @param _intervalSec 上一帧到这一帧执行的时间
     */
    update(_intervalSec: number) { }
    render() { }
    // 停止动画循环
    public stop(): void {
        if (!this._requestId) {
            console.warn('requestAnimationFrame 不存在')
            return
        }
        if (this._start) {
            cancelAnimationFrame(this._requestId);
            this._lastTime = -1;
            this._startTime = -1;
            this._start = false;
        }
    }

}