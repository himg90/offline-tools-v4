#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { recursivelyDecode } from '../src/string-decoder.js';
import { prettyPrintJson } from 'pretty-print-json';

// Check for the correct number of arguments
if (process.argv.length < 3) {
  console.error('Usage: node decode-file.js <input-file> [expected-output-file]');
  console.error('  <input-file>: File containing encoded data to decode');
  console.error('  [expected-output-file]: File with expected output to compare against (optional)');
  process.exit(1);
}

// Get file paths
const inputFile = process.argv[2];
const outputFile = inputFile + '.decoded.json';
const expectedOutputFile = process.argv[3];

try {
  // Read the input file
  console.log(`Reading from ${inputFile}...`);
  const fileContent = fs.readFileSync(inputFile, 'utf8');
  
  // Decode the content
  console.log('Decoding content...');
  const decodedContent = recursivelyDecode(fileContent.trim());
  
  // Format the result
  console.log('Formatting result...');
  
  // Format based on content type
  let formattedOutput;
  if (typeof decodedContent === 'object') {
    // For JSON, create a pretty-printed version using JSON.stringify
    formattedOutput = JSON.stringify(decodedContent, null, 2);
  } else {
    // For strings or other types, just convert to string
    formattedOutput = String(decodedContent);
  }
  
  // Write the result to the output file
  console.log(`Writing result to ${outputFile}...`);
  fs.writeFileSync(outputFile, formattedOutput);
  
  // If expected output file is provided, compare results
  if (expectedOutputFile) {
    console.log(`Comparing with expected output in ${expectedOutputFile}...`);
    
    if (!fs.existsSync(expectedOutputFile)) {
      console.error(`Error: Expected output file ${expectedOutputFile} not found`);
      process.exit(1);
    }
    
    const expectedContent = fs.readFileSync(expectedOutputFile, 'utf8');
    
    // Normalize both JSON objects for comparison (in case of formatting differences)
    let actualObj, expectedObj;
    
    try {
      // Try parsing as JSON
      actualObj = typeof decodedContent === 'object' ? decodedContent : JSON.parse(formattedOutput);
      expectedObj = JSON.parse(expectedContent);
      
      // Deep equality check for objects
      const areEqual = JSON.stringify(actualObj) === JSON.stringify(expectedObj);
      
      if (areEqual) {
        console.log('✅ SUCCESS: Decoded output matches expected output');
      } else {
        console.log('❌ FAIL: Decoded output does not match expected output');
        console.log('\nDifferences:');
        compareObjects(expectedObj, actualObj);
      }
    } catch (error) {
      // If not JSON, compare as strings
      if (formattedOutput.trim() === expectedContent.trim()) {
        console.log('✅ SUCCESS: Decoded output matches expected output');
      } else {
        console.log('❌ FAIL: Decoded output does not match expected output');
        console.log(`\nExpected: ${expectedContent}`);
        console.log(`\nActual: ${formattedOutput}`);
      }
    }
  }
  
  console.log('Done!');
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}

// Helper function to compare objects and find differences
function compareObjects(expected, actual, path = '') {
  if (typeof expected !== typeof actual) {
    console.log(`${path || 'root'}: Type mismatch - Expected ${typeof expected}, got ${typeof actual}`);
    return;
  }
  
  if (typeof expected !== 'object' || expected === null) {
    if (expected !== actual) {
      console.log(`${path || 'root'}: Value mismatch - Expected ${expected}, got ${actual}`);
    }
    return;
  }
  
  // Check for array vs object mismatch
  if (Array.isArray(expected) !== Array.isArray(actual)) {
    console.log(`${path || 'root'}: Structure mismatch - Expected ${Array.isArray(expected) ? 'array' : 'object'}, got ${Array.isArray(actual) ? 'array' : 'object'}`);
    return;
  }
  
  // For arrays, check length and elements
  if (Array.isArray(expected)) {
    if (expected.length !== actual.length) {
      console.log(`${path || 'root'}: Array length mismatch - Expected ${expected.length}, got ${actual.length}`);
    }
    
    const minLength = Math.min(expected.length, actual.length);
    for (let i = 0; i < minLength; i++) {
      compareObjects(expected[i], actual[i], `${path}[${i}]`);
    }
    return;
  }
  
  // For objects, check properties
  const expectedKeys = Object.keys(expected);
  const actualKeys = Object.keys(actual);
  
  // Check for missing keys
  for (const key of expectedKeys) {
    if (!actualKeys.includes(key)) {
      console.log(`${path ? path + '.' : ''}${key}: Missing in actual output`);
    } else {
      compareObjects(expected[key], actual[key], `${path ? path + '.' : ''}${key}`);
    }
  }
  
  // Check for extra keys
  for (const key of actualKeys) {
    if (!expectedKeys.includes(key)) {
      console.log(`${path ? path + '.' : ''}${key}: Extra in actual output`);
    }
  }
} 