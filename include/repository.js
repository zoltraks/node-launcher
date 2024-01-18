class Repository {
    records = []

    add(record) {
        this.records.push(record)
        return record
    }

    all() {
        return this.records
    }

    index(compare) {
        return this.records.findIndex(compare)
    }

    get(index) {
        return this.records[index]
    }

    replace(index, value) {
        this.records[index] = value
    }

    delete(index) {
        this.records.splice(index, 1)
    }

    find(compare) {
        for (const record of this.records) {
            if (compare(record)) {
                return record
            }
        }
        return null
    }

    size() {
        return this.records.length
    }

    filter(compare) {
        return this.result.filter(compare)
    }

    clear() {
        this.records = []
    }
}

/**
 * Repository
 * @module Repository
 * @exports {class}
 */
module.exports = Repository
