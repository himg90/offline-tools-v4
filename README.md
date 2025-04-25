# Offline Tools

A collection of useful offline tools for developers, including a Universal Decoder for handling various encoded strings and JSON formats.

## Features

### Universal Decoder
- Decodes base64 encoded strings
- Handles nested JSON structures
- Supports escaped JSON strings
- Pretty prints decoded output
- Works completely offline
- No data is sent to external servers

## Installation

### Prerequisites
- Node.js (v14 or higher)

### Setup
1. Clone the repository:
```bash
git clone https://github.com/yourusername/offline-tools-v4.git
cd offline-tools-v4
```

2. Install dependencies:
```bash
npm install
```
3. Build chrome extension:
```bash
npm run build
```

2. Load the extension in your browser:
   - Chrome/Edge: Go to `chrome://extensions/`
   - Click "Load unpacked" and select the `dist` directory

## Usage

### Universal Decoder
1. Enter your encoded string in the textarea
2. Click the "Decode" button
3. View the decoded result in the output area

#### Example Inputs
- Simple JSON: `{"name":"Test User","age":30}`
- Base64 encoded string: `SGVsbG8gV29ybGQ=`
- Nested JSON: `eyJ1c2VyIjp7ImRldGFpbHMiOnsiYWRkcmVzcyI6eyJzdHJlZXQiOiIxMjMgTWFpbiBTdCIsImNpdHkiOiJUZWNodmlsbGUifX19fQ==`
- Complex Mixed JSON: `{"base64_encoded_json":"eyAidGVzdCI6ICJ2YWx1ZSIgfQ==","escaped_json":"{\"test\": \"value\"}","escaped_and_base64_encoded_json":"e1widGVzdFwiOiBcInZhbHVlXCJ9"}`


### Features
- Access the Universal Decoder directly from your browser
- Works offline
- No permissions required
- Secure - all processing happens locally

## Command Line Tools

### File Decoder

Decode files from the command line:

```bash
# Usage
npm run decode-file <input-file> [output-file]

# Example - Decode a file and save to default output (input-file.decoded.json)
npm run decode-file encoded-data.txt

# Example - Decode a file and save to specific output
npm run decode-file encoded-data.txt decoded-result.json
```

This tool:
- Reads encoded content from a file
- Decodes it using the Universal Decoder
- Pretty-prints the result (if it's JSON)
- Saves the decoded content to a file
