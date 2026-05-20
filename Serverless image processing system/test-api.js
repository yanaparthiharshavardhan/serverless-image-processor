import fs from 'fs';

const URL = "https://o2k1mb7pul.execute-api.us-east-1.amazonaws.com/upload";

try {
  const res = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      image: "test",
      fileName: "test.jpg",
      fileType: "image/jpeg",
      bucket: "test-bucket"
    })
  });
  const text = await res.text();
  const output = `STATUS: ${res.status}\nCORS: ${res.headers.get("access-control-allow-origin")}\nBODY: ${text}`;
  fs.writeFileSync('output.txt', output);
  console.log(output);
} catch (err) {
  const output = `FETCH ERROR: ${err}`;
  fs.writeFileSync('output.txt', output);
  console.log(output);
}
