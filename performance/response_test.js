const { response } = require("express")


const baseUrl = `http://localhost:5050/blogs/`
const endpoints = {
    1: "all",
    2:"blog/author/lemon",
    3:"authors",
    4:"blog/687e8249ec7acd1c4d9fce57"
}

async function measureSingleRequest(num){
    const start = performance.now()
    try {
        const resp = await fetch(baseUrl + endpoints[num])
        const data = await resp.json()
        let dataArray = [];
        if (Array.isArray(data)) {
            dataArray = data
        }else{
            if (num === 3) {
                dataArray = data["authors"]
            }else if (num === 4) {
                dataArray.push(data)
            }
        }
        // calculate dataSize in bytes
        const json_string = JSON.stringify(dataArray)
        const sizeInBytes = new TextEncoder().encode(json_string).length;

        // get record count 
        const data_size = dataArray.length 

        // get response time / duration 
        const end = performance.now()
        const response_time = (end - start)

        return {
            responseTime:response_time,
            recordsCount: data_size,
            dataSize: sizeInBytes,
            success:true
        }
    }
    catch(error) {
        console.log("Error fetching data", error)
        const end = performance.now()
        const response_time = (end - start) 
        return {
            responseTime:response_time,
            success: false
        }
    }
}

async function runMultipleTests(num_of_tests = 10, endpoint_id) {
    let results = []
    for (let i = 0; i < num_of_tests; i ++) {
        const res = await measureSingleRequest(endpoint_id)
        results.push(res)
        await new Promise(resolve => setTimeout(resolve, 100));
        
    }
    return calculation(results, endpoint_id)
}

// calculation next 
async function calculation(results, endpoint_id){

    const success_results =results.filter(result => result.success === true)

    if (success_results.length === 0) {
        return {
            endpoint: endpoints[endpoint_id],
            error: 'all requests failed',
            successRate: 0
        }
    }

    const response_time_list = success_results.map(r => r.responseTime)
    const avg = response_time_list.reduce((acc,cur) => acc+cur,0 ) / response_time_list.length
    const minResponseTime = Math.min(...response_time_list)
    const maxResponseTime = Math.max(...response_time_list)
 
    const success_rate = (success_results.length / results.length) * 100 
    const single_success = success_results[0]
    const dataSize = single_success["dataSize"]
    const recordsCount = single_success["recordsCount"]

    const summary = {
        endpoint: endpoints[endpoint_id],
        successRate:success_rate,
        averageResponse: avg,
        minResponseTime:minResponseTime,
        maxResponseTime:maxResponseTime,
        dataSize:dataSize,
        recordsCount:recordsCount,
        totalRequest: results.length,
        successfulRequests: success_results.length,
        failedRequests: results.length - success_results.length
    }

    return summary
    
}


async function runPerformanceTests(){
    console.log("Running performance tests")
    const test_results = []

    try {
        const result = await runMultipleTests(10, 1)
        test_results.push(result)

    }catch(err) {
        console.error("Test failed", err.message)
    }
  

    try {
        const result = await runMultipleTests(10, 2)
        test_results.push(result)

    }catch(err) {
        console.error("Test failed", err.message)
    }

 

    try {
        const result = await runMultipleTests(10, 3)
        test_results.push(result)

    }catch(err) {
        console.error("Test failed", err.message)
    }
    

    try {
        const result = await runMultipleTests(10, 4)
        test_results.push(result)

    }catch(err) {
        console.error("Test failed", err.message)
    }

    displaySummary(test_results)
    
}

function displaySummary(results){
    results.forEach((res) => {
        console.log("Tested endpoint: ", res.endpoint)
        console.log("Success Rate: ", `${res.successRate} %` )
        console.log("Average Response: ", `${res.averageResponse} ms`)
        console.log("Min Response Time: ", `${res.minResponseTime} ms`)
        console.log("Max Response Time: ", `${res.maxResponseTime} ms`)
        console.log("Data Size in Bytes: ", `${res.dataSize} bytes`)
        console.log("Data Size in MB: ", `${res.dataSize / (1024 * 1024)} MB`)
        console.log("Record Count: ", res.recordsCount)
        console.log("Total Requests", res.totalRequest)
        console.log("Successful Requests", res.successfulRequests)
        console.log("Failed Requests: ", res.failedRequests)
        
        if (res.recordsCount <= 10) {
            console.log("*****There are less than 10 documents in the record. Add more docs to test if possible*****")
        }

        else if (res.recordsCount < 50) {
            console.log("*****You have fewer than 50 documents in the record. Add more docs to test if possible*****")
        }

        if (res.averageResponse > 1000){
            console.log("The average response rate is over 1000 ms. SLOW! ")
        }else if (res.averageResponse > 500) {
            console.log("The average response rate is of medium speed at around 500 ms. ")
            console.log("Try to speed it up!")
        }else {
            console.log("Good response rate !!")
        }
        console.log("################################")
       
    })


}

runPerformanceTests()






