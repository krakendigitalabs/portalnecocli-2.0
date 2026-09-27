fetch("http://localhost:3000/api/test-dispatch")
  .then(async (res) => {
    console.log("Status:", res.status);
    console.log("Body:", await res.text());
  })
  .catch(console.error);
