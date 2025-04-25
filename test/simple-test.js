import { recursivelyDecode, tryDecodeBase64 } from '../src/string-decoder.js';


const input = "eyJ1c2VyIjp7Im5hbWUiOiJKb2huIERvZSIsImVtYWlsIjoiam9obkBleGFtcGxlLmNvbSIsImFkZHJlc3MiOnsiY2l0eSI6IlNhbiBGcmFuY2lzY28iLCJzdGF0ZSI6IkNBIiwiemlwIjoiOTQxMDEifSwicm9sZXMiOlsiYWRtaW4iLCJ1c2VyIl19fQ==";
console.log(recursivelyDecode(input, 10, 0, true));
