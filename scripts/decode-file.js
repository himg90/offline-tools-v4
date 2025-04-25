#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { recursivelyDecode } from '../src/string-decoder.js';
import { prettyPrintJson } from 'pretty-print-json';

// Check for the correct number of arguments
if (process.argv.length < 3) {
  console.error('Usage: node decode-file.js <input-file> [output-file]');
  process.exit(1);
}

// Get input and output file paths
const inputFile = process.argv[2];
const outputFile = process.argv[3] || inputFile + '.decoded.json';

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
  
  console.log('Done!');
  console.log(`Decoded content saved to ${outputFile}`);
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
} 