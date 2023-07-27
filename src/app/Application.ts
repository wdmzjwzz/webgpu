export class Application {
    constructor() { }

    fps = 0

    private _start: boolean = false
    private _startTime = -1
    private _lastTime = -1
    private _requestId: number | undefined

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
            this.fps = Math.floor(1000.0 / intervalSec);
        }

        // 我们update使用的是秒为单位，因此转换为秒表示
        intervalSec /= 1000.0;

        //记录上一次的时间戳
        this._lastTime = timeStamp;

        // 后渲染
        this.render();
        // 递归调用，形成周而复始的前进
        this._requestId = requestAnimationFrame((elapsedMsec: number): void => {
            this.step(elapsedMsec);
        });
    }

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