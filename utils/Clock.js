// import Clock from './wxTick'
// const Clock = require('./wxTick')
function Clock(init) {
    // 用户设置：
    this.startTime = init.startTime || '00:00:00' // 设置开始时间
    this.endTime = init.endTime || '00:00:00' // 设置结束时间 
    this.completeTask = init.completeTask || null // 设置成功结束后，执行任务
    this.displayEle = init.displayEle || null // 设置展示元素，用于显示当前的运行时间

    // 私有变量：
    this.processingTime = this.startTime // 当前运行时间（用于显示以及每次暂停后开始的时间）
    this.intervalID = null // 循环id，创建=>保存=>销毁

    // 用于返回：
    this.duration = null // 33333 s        // 从开始到结束/暂停，时钟的运行时长
    this.finishOrNot = false //这个倒计时是否完整完成
    // todo
    // this.interval = init.interval // 2s
    // this.intervalFn = init.intervalFn // function() {}
}

function getTime(startTime, endTime) { // 将"00:00:00" 转换为 Date() 型时间
    _StartArr = startTime.split(':').reduce((init, i) => {
        init.push(parseInt(i));
        return init
    }, [])
    _ResolveStartTime = new Date(1999, 3, 3, _StartArr[0], _StartArr[1], _StartArr[2])
    _EndArr = endTime.split(':').reduce((init, i) => {
        init.push(parseInt(i));
        return init
    }, [])
    _ResolveEndTime = new Date(1999, 3, 3, _EndArr[0], _EndArr[1], _EndArr[2])
    return {
        startTime: _ResolveStartTime,
        endTime: _ResolveEndTime,
    }
}

function convertTimeToDate(time) {
    let arr = time.split(':').reduce((init, i) => {
        init.push(parseInt(i));
        return init
    }, [])
    return {
        time: new Date(1999, 3, 3, arr[0], arr[1], arr[2])
    }
}

Clock.prototype = {
    _begin: function (resolve) { // 用于进行processing时间的维护
        let _this = this
        let time = getTime(_this.processingTime, _this.endTime)
        _this.displayEle.innerHTML = _this.processingTime // 用于赋值
        if (time.startTime - time.endTime > 0) {
            time.startTime -= 1000 // 此时减时间
            _this.processingTime = new Date(time.startTime).toString().substr(16, 8) // 运行了1s， 此时应该更新。
        } else { // 自然结束
            // 此时不需要对_this.processingTime进行处理。
            if (_this.completeTask) {
                _this.completeTask()
            }
            clearInterval(_this.intervalID)
            _this.finishOrNot = true
            resolve(_this._returnValue())
            _this.processingTime = _this.startTime
            console.log('完成啦！！！！！！！！！！！')
        }
    },
    _returnValue: function () {
        let _this = this
        return {
            startTime: _this.startTime,
            plannedEndTime: _this.endTime,
            duration: (new Date('1998-08-08T' + _this.startTime) - new Date('1998-08-08T' + _this.processingTime)) / 1000,
            processingTime: _this.processingTime,
            finishOrNot: _this.finishOrNot
        }
    },
    start: function () {
        let _this = this // 保存this
        _this.finishOrNot = false
        return new Promise((resolve) => {
            _this._begin(resolve)
            _this.intervalID = setInterval(function () {
                _this._begin(resolve)
            }, 1000)
        })
    },
    stop: function () { // 停止。
        console.log('I am called')
        let _this = this
        clearInterval(_this.intervalID)
        return new Promise((resolve) => {
            resolve(_this._returnValue())
            _this.processingTime = _this.startTime
        })
    },
    pause: function () { // 暂停，是不会操作completeTask的。
        let _this = this
        clearInterval(_this.intervalID)
        console.log('Now I am paused')
        let a = convertTimeToDate(_this.processingTime) //  因为shutdown了，所以要处理在begin()中多减去的1000ms
        a.time -= -1000 // why can't plus 1000???????
        _this.processingTime = new Date(a.time).toString().substr(16, 8)
        return new Promise((resolve) => {
            resolve(_this._returnValue())
        })
    },
    restart: function () {
        let _this = this
        // 进行重置
        _this.processingTime = _this.startTime
        _this.finishOrNot = false
        clearInterval(_this.intervalID)

        console.log('now begin from the beginning')
        return new Promise((resolve) => {
            _this._begin(resolve)
            _this.intervalID = setInterval(function () {
                _this._begin(resolve)
            }, 1000)
        })
    }
}

module.exports = Clock