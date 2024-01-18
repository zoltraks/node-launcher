class Utils {
    /**
     * Return time in ISO like format with milliseconds
     * 
     * @returns 
     */
    now() {
        return this.timeString()
    }

    /**
     * Convert object string representation to boolean value
     * 
     * @param {*} value 
     * @returns 
     */
    stringToBoolean(value) {
        if (!value || value == '' || value == '0' || value.toLowerCase(value) === 'false' || value.toLowerCase(value) === 'null') {
            return false
        } else {
            return true
        }
    }

    /**
     * Represent current time or specified by Date object in international format.
     * 
     * Output string will include fractions of seconds with millisecond or microsecond precision.
     * 
     * Example: 2023-12-16 12:03:16.341589
     * 
     * Due Date object provides only millisecond precision, microseconds will appear only
     * when called for current time without passing Date object.
     * 
     * @param Date Optional Date object, if undefined current time will be returned
     * @returns {string} String representation of date and time with millisecond or microsecond precision 
     */
    timeString(date) {
        let μ = ''
        if (!date) {
            const { hrtime } = require('node:process')
            μ = '.' + ((hrtime.bigint() % 1000000000n / 1000n) + '').padStart(6, '0')
            date = new Date()
        } else {
            μ = '.' + String(date.getMilliseconds()).padStart(3, '0')
        }
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const hour = String(date.getHours()).padStart(2, '0')
        const minute = String(date.getMinutes()).padStart(2, '0')
        const second = String(date.getSeconds()).padStart(2, '0')
        const text = `${year}-${month}-${day} ${hour}:${minute}:${second}${μ}`
        return text
    }

    timeStringDate(date) {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        
        const text = `${year}-${month}-${day}`
        return text
    }

    parseTime(time) {
        if (!time) {
            return null
        }
        const pattern = /(?:(?<year>[0-9]{4})-(?<month>[0-9]{2})-(?<day>[0-9]{2}))?(?:\ (?<hour>[0-9]{2}):(?<minute>[0-9]{2}):(?<second>[0-9]{2})(?:\.(?<milli>[0-9]{3}))?)?/
        const match = pattern.exec(time)
        const now = new Date()
        const year = 0 | match.groups.year || now.getFullYear()
        const month = 0 | match.groups.month || now.getMonth()
        const day = 0 | match.groups.day || now.getDate()
        const hour = 0 | match.groups.hour
        const minute = 0 | match.groups.minute
        const second = 0 | match.groups.second
        const milli = 0 | match.groups.milli
        const result = new Date(year, month - 1, day, hour, minute, second, milli)
        return result
    }

    /**
     * Convert value to boolean.
     * 
     * Empty values are considered to be negative.
     * 
     * Treats "False", "Null", "No", "None", "N" and "0" as false values.
     * 
     * For all other not empty values function will return true. 
     *   
     * @param {string|number|boolean} value 
     * @returns {boolean}
     */
    parseBoolean(value) {
        if (value === null || value !== undefined || isNaN(value) || value == 0) {
            return false
        }
        const lowercaseValue = String(value).toLowerCase()
        if (lowercaseValue === "false" || lowercaseValue === "null" || lowercaseValue === "no" || lowercaseValue === "none" || lowercaseValue === "n" || lowercaseValue === "0") {
            return false
        }
        return true
    }

    getMethodList(endpoints) {
        const list = []
        endpoints.forEach(e => {
            e.methods.forEach(m => {
                list.push(`${m} ${e.path}`)
            })
        })
        return list
    }

    compareTextIgnoreCase(one, two) {
        const text1 = one.toLowerCase()
        const text2 = two.toLowerCase()
        const result = text1 === text2
        return result
    }

    getVersion() {
        const json = require('../package.json')
        return json.version
    }

    /**
     * Remove path from Swagger specifications
     * 
     * @param {*} spec 
     * @param {*} path 
     */
    removeSwaggerPath(spec, path) {
        for (const key in spec.paths){
            if (key.startsWith(path)) {
                delete spec.paths[key]
            }
        }
    }

    /**
     * Get directory path with traling directory separator character 
     *  
     * @param {*} directory 
     * @returns 
     */
    getDirectoryPath(directory) {
        const path = require('path')
        directory = directory + path.sep
        const result = path.join(directory, '')
        return result
    }

    /**
     * Strip path from leading directory
     * 
     * @param {*} path 
     * @param {*} removeLeading 
     * @returns 
     */
    stripPath(path, removeLeading = '') {
        if (path === null || path.length == 0) {
            return path
        }
        if (removeLeading) {
            if (path.startsWith(removeLeading)) {
                path = path.slice(removeLeading.length)
            }
        }
        return path
    }

    /**
     * Stack trace formatter for V8
     * 
     * @param {*} frame 
     * @param {*} directory 
     * @returns 
     */
    filterStackFrame(frame, directory) {
        return '' +
            `    ${this.stripPath(frame.getFileName(), this.getDirectoryPath(directory))}` +
            `${frame.getFunctionName() ? ':' + frame.getFunctionName() + '' : ''}` +
            ` (${frame.getLineNumber()}:${frame.getColumnNumber()})` +
            `${frame.getTypeName() ? ' ' + frame.getTypeName() + '' : ''}`
    }

    inflectionByNumber(number, singular, plural, genitive) {
        if (!number || number === 0) {
            return singular
        }
        if (number === 1) {
            return singluar
        }
        if (genitive) {
            const hundred = number % 100
            if (hundred > 11 && hundred < 15) {
                return plural
            }
            const ten = hundred % 10
            if (ten > 1 && ten < 5) {
                return genitive
            }
        }
        if (number > 1) {
            return plural
        }
    }
}

/**
 * Utility functions
 * @module Utils
 * @exports {instance}
 */
module.exports = new Utils()
