import { recursivelyDecode, tryUnescapeJsonString } from './string-decoder.js';

// Helper function to create test data
function createTestData() {
  // Simple test cases
  const simpleJson = JSON.stringify({ name: "Test User", age: 30 });
  const base64Encoded = btoa("Hello World");
  const jsonInBase64 = btoa(simpleJson);
  
  // Nested JSON
  const nestedJson = JSON.stringify({
    user: {
      details: JSON.stringify({
        address: JSON.stringify({
          street: "123 Main St",
          city: "Techville"
        })
      })
    }
  });
  
  // Escaped JSON string
  const escapedJson = JSON.stringify(JSON.stringify({ key: "value" }));
  const escapedJson2 = "{\\r\\n\\\"a\\\" : 1\\r\\n}";
  
  // Multiple levels of encoding
  const multiLevelEncoding = btoa(
    JSON.stringify({
      data: btoa(
        JSON.stringify({
          innerData: btoa("Secret message")
        })
      )
    })
  );
  
  // Complex nested structure with mixed encodings
  const complexNested = JSON.stringify({
    level1: btoa(
      JSON.stringify({
        level2: btoa(
          JSON.stringify({
            level3: "Plain text at level 3",
            encoded: btoa("Base64 at level 3")
          })
        ),
        plainAtLevel2: "Plain text at level 2"
      })
    ),
    plainAtLevel1: "Plain text at level 1"
  });

  return {
    simpleJson,
    base64Encoded,
    jsonInBase64,
    nestedJson,
    escapedJson,
    escapedJson2,
    multiLevelEncoding,
    complexNested
  };
}

// Run tests
function runTests() {
  const testData = createTestData();
  const testCases = [
    {
      name: "Simple JSON",
      input: testData.simpleJson,
      expectedType: "object",
      validationFn: result => result.name === "Test User" && result.age === 30
    },
    {
      name: "Base64 encoded string",
      input: testData.base64Encoded,
      expectedType: "string",
      validationFn: result => result === "Hello World"
    },
    {
      name: "JSON in Base64",
      input: testData.jsonInBase64,
      expectedType: "object",
      validationFn: result => result.name === "Test User" && result.age === 30
    },
    {
      name: "Nested JSON with multiple levels",
      input: testData.nestedJson,
      expectedType: "object",
      validationFn: result => {
        try {
          const details = result.user.details;
          const address = details.address;
          return address.street === "123 Main St" && address.city === "Techville";
        } catch {
          return false;
        }
      }
    },
    {
      name: "Escaped JSON string",
      input: testData.escapedJson,
      expectedType: "object",
      validationFn: result => result.key === "value"
    },
    {
      name: "Escaped JSON string 2",
      input: testData.escapedJson2,
      expectedType: "object",
      validationFn: result => result.a === 1
    },
    {
      name: "Multiple levels of encoding",
      input: testData.multiLevelEncoding,
      expectedType: "object",
      validationFn: result => {
        try {
          return result.data.innerData === "Secret message";
        } catch {
          return false;
        }
      }
    },
    {
      name: "Complex nested structure",
      input: testData.complexNested,
      expectedType: "object", 
      validationFn: result => {
        try {
          const level1 = result;
          return level1.plainAtLevel1 === "Plain text at level 1" && 
                 typeof level1.level1 === 'object';
        } catch {
          return false;
        }
      }
    }
  ];

  // Run each test case
  console.log("===== RUNNING STRING DECODER TESTS =====");
  let passedTests = 0;
  
  testCases.forEach((test, index) => {
    console.log(`\nTest ${index + 1}: ${test.name}`);
    console.log(`Input: ${typeof test.input === 'string' ? test.input : JSON.stringify(test.input)}`);
    
    try {
      const result = recursivelyDecode(test.input);
      console.log(`Result type: ${typeof result}`);
      console.log(`Result: ${typeof result === 'string' ? result : JSON.stringify(result)}`);
      
      const typeCheck = typeof result === test.expectedType;
      const validationCheck = test.validationFn(result);
      
      if (typeCheck && validationCheck) {
        console.log("✅ PASSED");
        passedTests++;
      } else {
        console.log("❌ FAILED");
        if (!typeCheck) console.log(`  Expected type: ${test.expectedType}, Got: ${typeof result}`);
        if (!validationCheck) console.log("  Validation failed");
      }
    } catch (error) {
      console.log(`❌ FAILED with error: ${error.message}`);
    }
  });
  
  console.log(`\n===== TEST SUMMARY =====`);
  console.log(`${passedTests} of ${testCases.length} tests passed`);
}

// Execute tests
runTests();