const { response } = require("express")


const baseUrl = `http://localhost:5050/blogs/`
const endpoints = {
    1: "all",
    2:"all-paginated?page=5&limit=10",
    3:"all-paginated?page=100&limit=10",
    4:"blog/author/lemon",
    5:"blog-paginated/author/lemon",
    6:"authors",

}

async function measureSingleRequest(num){
    const start = performance.now()
    try {
        const resp = await fetch(baseUrl + endpoints[num])
        const data = await resp.json()
        
       
        let dataArray = [];
        
        if (Array.isArray(data)) {
            dataArray = data
        }else if(num === 2 || num === 3 || num === 5){
            dataArray = data.blog_data
        }else{
            if (num === 6) {
                dataArray = data["authors"]
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

    try {
        const result = await runMultipleTests(10, 5)
        test_results.push(result)

    }catch(err) {
        console.error("Test failed", err.message)
    }

    try {
        const result = await runMultipleTests(10, 6)
        test_results.push(result)

    }catch(err) {
        console.error("Test failed", err.message)
    }


    displaySummary(test_results)
    displayImprovement(test_results)
    
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

function displayImprovement(results) {
    const endpoint_all = results[0]
    const endpoint_all_paginated_1 = results[1]


    const timeImprovement = ((endpoint_all.averageResponse - endpoint_all_paginated_1.averageResponse) / endpoint_all.averageResponse * 100).toFixed(1)
    const payloadSizeImprovement = ((endpoint_all.dataSize - endpoint_all_paginated_1.dataSize) / endpoint_all.dataSize * 100).toFixed(1)

    console.log(`Retrieving all blogs (~1000 records) in one sitting on average takes ${endpoint_all.averageResponse} ms. 
                Retrieving all blogs using pagination (10/page) on average takes ${endpoint_all_paginated_1.averageResponse} ms. 
                the Average response rate of blog retrieval increased by ${timeImprovement} %`)
   
    console.log(` `)

    
    console.log(`The payload size of all blogs (~1000 records) is ${endpoint_all.dataSize} bytes. 
                The payload size of all blogs using pagination (10/page) is ${endpoint_all_paginated_1.dataSize} bytes. 
                the Average response rate of blog payload size decreased by ${payloadSizeImprovement} %`)

    console.log(` `)
    const endpoint_author = results[4]
    const endpoints_author_paginated = results[5]

    const timeImprovement_author = ((endpoint_author.averageResponse - endpoints_author_paginated.averageResponse) / endpoint_author.averageResponse * 100).toFixed(1)
    const payloadSizeImprovement_author = ((endpoint_author.dataSize - endpoints_author_paginated.dataSize) / endpoint_author.dataSize * 100).toFixed(1)


    console.log(`Retrieving all blogs by this author (~100 records) in one sitting on average takes ${endpoint_author.averageResponse} ms. 
                Retrieving all blogs by this author using pagination (10/page) on average takes ${endpoints_author_paginated.averageResponse} ms. 
                the Average response rate of blog retrieval increased by ${timeImprovement_author} %`)
   
    console.log(` `)

    
    console.log(`The payload size of all blogs by this author (~100 records) is ${endpoint_author.dataSize} bytes. 
                The payload size of all blogs by this author using pagination(10/page) is ${endpoints_author_paginated.dataSize} bytes. 
                the Average response rate of blog payload size decreased by ${payloadSizeImprovement_author} %`)



}

runPerformanceTests()





