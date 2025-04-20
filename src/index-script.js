import { recursivelyDecode } from './string-decoder.js';
import JSONFormatter from 'json-formatter-js';
import { prettyPrintJson } from 'pretty-print-json';
import 'pretty-print-json/css/pretty-print-json.css';

document.addEventListener('DOMContentLoaded', function() {
    // Navigation menu functionality
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            pages.forEach(page => page.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Show corresponding page
            const pageId = this.getAttribute('data-page');
            document.getElementById(pageId).classList.add('active');
        });
    });
    
    // Base64 decoding functionality
    const decodeButton = document.getElementById('decode-button');
    const encodedInput = document.getElementById('encoded-input');
    const decodedOutput = document.getElementById('decoded-output');
    const jsonPrettyPrintOutput = document.getElementById('json-pretty-print-output');
    const exampleButtons = document.querySelectorAll('.example-btn');

    // Handle example buttons
    exampleButtons.forEach(button => {
        button.addEventListener('click', () => {
            encodedInput.value = button.dataset.example;
            // Trigger the decode button click
            decodeButton.click();
        });
    });

    decodeButton.addEventListener('click', function() {
        try {
            const encodedText = encodedInput.value.trim();
            if (!encodedText) {
                decodedOutput.textContent = "Please enter an encoded string.";
                return;
            }
            
            // Attempt to decode
            const decodedText = recursivelyDecode(encodedText);
            const formatter = new JSONFormatter(decodedText);
            decodedOutput.innerHTML = ""; // Clear previous output
            decodedOutput.appendChild(formatter.render());

            jsonPrettyPrintOutput.innerHTML = prettyPrintJson.toHtml(decodedText);
        } catch (error) {
            decodedOutput.textContent = "Error: " + error.message;
        }
    });
});
