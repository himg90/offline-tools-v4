import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { recursivelyDecode } from '../src/string-decoder.js';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fixturesDir = path.join(__dirname, 'fixtures');

console.log('===== RUNNING STRING DECODER TESTS =====\n');

// Get all test files
const testFiles = fs.readdirSync(fixturesDir)
  .filter(file => file.endsWith('.input'))
  .map(file => file.replace('.input', ''));

let passedTests = 0;
let failedTests = 0;

// Process each test file
for (const testName of testFiles) {
  console.log(`\nTest: ${testName}`);
  
  try {
    // Read input and expected output
    const inputPath = path.join(fixturesDir, `${testName}.input`);
    const expectedPath = path.join(fixturesDir, `${testName}.expected`);
    
    if (!fs.existsSync(expectedPath)) {
      console.log(`❌ FAILED: Expected output file not found: ${expectedPath}`);
      failedTests++;
      continue;
    }
    
    const input = fs.readFileSync(inputPath, 'utf8').trim();
    const expectedOutput = fs.readFileSync(expectedPath, 'utf8').trim();
    
    console.log(`Input: ${input.length > 100 ? input.substring(0, 100) + '...' : input}`);
    
    // Run the decoder
    const result = recursivelyDecode(input);
    
    // Convert result to string for comparison
    let resultStr;
    if (typeof result === 'object' && result !== null) {
      resultStr = JSON.stringify(result, null, 2);
    } else {
      resultStr = String(result);
    }
    
    // Compare with expected
    let expectedObj, resultObj;
    let comparisonPassed = false;
    
    try {
      // Try to parse both as JSON for structural comparison
      expectedObj = JSON.parse(expectedOutput);
      resultObj = typeof result === 'object' ? result : JSON.parse(resultStr);
      
      // Compare the stringified versions (normalized)
      const normalizedExpected = JSON.stringify(expectedObj);
      const normalizedResult = JSON.stringify(resultObj);

      console.log(normalizedExpected);
      console.log(normalizedResult);
      
      comparisonPassed = normalizedExpected === normalizedResult;
    } catch (e) {
      // If not valid JSON, compare as strings
      comparisonPassed = expectedOutput.trim() === resultStr.trim();
    }
    
    if (comparisonPassed) {
      console.log('✅ PASSED');
      passedTests++;
    } else {
      console.log('❌ FAILED: Output does not match expected');
      console.log(`\nExpected:\n${expectedOutput}`);
      console.log(`\nActual:\n${resultStr}`);
      failedTests++;
    }
  } catch (error) {
    console.log(`❌ FAILED with error: ${error.message}`);
    console.error(error);
    failedTests++;
  }
}

// Print summary
console.log('\n===== TEST SUMMARY =====');
console.log(`${passedTests} of ${passedTests + failedTests} tests passed`);

// Exit with appropriate code
process.exit(failedTests > 0 ? 1 : 0); 