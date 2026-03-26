import { parentPort, workerData } from 'worker_threads'
import { Logger } from '@common/model/Logger'

Logger.log('child-process.ts', workerData.type)
;(async () => {
    parentPort?.postMessage('terminate')
})()
