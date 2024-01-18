const Repository = require('./include/repository')
const Utils = require('./include/utils')

describe("Repository Tests", () => {
    test("Object creation", () => {
        const o = new Repository()
        expect(o.size()).toBe(0)
        o.add({})
        expect(o.size()).toBe(1)
    })

    test("Element lookup", () => {
        const o = new Repository()
        o.add({ key: 'A' })
        o.add({ key: 'B' })
        o.add({ key: 'C' })
        expect(o.size()).toBe(3)
        expect(o.index((e) => e.key == 'B')).toBe(1)
        expect(o.index((e) => e.key == 'C')).toBe(2)
        expect(o.index((e) => e.key == '-')).toBe(-1)
    })
    
    test("Element deletion", () => {
        const o = new Repository()
        o.add({ key: 'A' })
        expect(o.index((e) => e.key == 'A')).toBe(0)
        o.delete(0)
        expect(o.index((e) => e.key == 'A')).toBe(-1)
    })
    
    test("Element replace", () => {
        const o = new Repository()
        o.add({ key: 'A' })
        expect(o.index((e) => e.key == 'A')).toBe(0)
        expect(o.index((e) => e.key == 'B')).toBe(-1)
        o.replace(0, { key: 'B'})
        expect(o.index((e) => e.key == 'A')).toBe(-1)
        expect(o.index((e) => e.key == 'B')).toBe(0)
    })
})

describe("Utils Tests", () => {
    test("Date and time", () => {
        let now
        now = Utils.timeString(new Date())
        expect(now).not.toBeNull()
        expect(now.length).toBe(23)
        now = Utils.timeString()
        expect(now).not.toBeNull()
        expect(now.length).toBe(26)
    })

    test("Time parse", () => {
        let check, result
        check = '2020-01-01'
        result = Utils.parseTime(check)
        expect(result.getTime()).toBe(new Date(2020, 0, 1).getTime())
    })
})
