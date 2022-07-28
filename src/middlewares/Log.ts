import { existsSync, open, appendFile, close } from 'node:fs'
import { homedir } from 'os'
import { resolve } from 'node:path'

class Log {
    public baseDir: string | undefined
    public fileName: string
    public linePrefix: string

    public today: Date = new Date()

    constructor() {
        const _dateString = `${this.today.getFullYear()}-${
            this.today.getMonth() + 1
        }-${this.today.getDate()}`
        const _timeString = `${this.today.getHours()}:${this.today.getMinutes()}:${this.today.getSeconds()}`

        const logDirs = [
            `${homedir()}/.config/mpd-web/.logs/`,
            resolve('.logs') + '/',
        ]

        this.baseDir = logDirs.find((path) => existsSync(path)) || ''

        this.fileName = `${_dateString}.log`
        this.linePrefix = `[${_dateString} ${_timeString}]`
    }

    public info(_string: string): void {
        this.addLog('INFO', _string)
    }

    public warn(_string: string): void {
        this.addLog('WARN', _string)
    }

    public error(_string: string): void {
        console.log(
            '\x1b[31m%s\x1b[0m',
            '[ERROR] :: ' + _string.split(/r?\n/)[0]
        )

        this.addLog('ERROR', _string)
    }

    public custom(_filename: string, _string: string): void {
        this.addLog(_filename, _string)
    }

    private addLog(_kind: string, _string: string): void {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const _that = this
        _kind = _kind.toUpperCase()
        open(
            `${_that.baseDir}${_that.fileName}`,
            'a',
            (_err, _fileDescriptor) => {
                if (!_err && _fileDescriptor) {
                    appendFile(
                        _fileDescriptor,
                        `${_that.linePrefix} [${_kind}] ${_string}\n`,
                        (_err) => {
                            if (!_err) {
                                close(_fileDescriptor, (_err) => {
                                    if (!_err) {
                                        return true
                                    } else {
                                        return console.log(
                                            '\x1b[31m%s\x1b[0m',
                                            'Error closing log file that was being appended'
                                        )
                                    }
                                })
                            } else {
                                return console.log(
                                    '\x1b[31m%s\x1b[0m',
                                    'Error appending to the log file'
                                )
                            }
                        }
                    )
                } else {
                    return console.log(
                        '\x1b[31m%s\x1b[0m',
                        "Error cloudn't open the log file for appending"
                    )
                }
            }
        )
    }

    public clean(): void {
        //
    }
}

export default new Log()
