import { Worker as NodeWorker, type WorkerOptions } from 'worker_threads'
import { Logger } from '@common/model/Logger'
import type { T_WorkerData, T_WorkerChannels } from '@src/types'

export class Worker<T extends T_WorkerChannels> extends NodeWorker {
    constructor(workerData?: T_WorkerData<T>, options?: WorkerOptions) {
        super('./.build/child.js', { ...options, workerData })

        this.on('message', (message) => {
            if (message === 'terminate') {
                Logger.log('terminate worker')
                this.terminate()
            }
        })
    }
}
