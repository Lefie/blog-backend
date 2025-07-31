const format_date = require('../utils/processDate')

describe("format date", ()=>{
    test(`should result in 07 30, 2025`, ()=>{
        expect(format_date()).toBe("July 31, 2025")
    })
})