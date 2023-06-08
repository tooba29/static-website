const http = require('http');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');




require('dotenv').config();
console.log(process.env.MONGODB_PASSWORD)
// Connect to your MongoDB database
mongoose.connect(`mongodb+srv://tooba29:${process.env.MONGODB_PASSWORD}@cluster0.nvuxqat.mongodb.net/`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Create a schema for your data
const contactSchema = new mongoose.Schema({
  name: String,
  contact: Number,
  message: String,
});

// Create a model based on the schema
const Contact = mongoose.model('Contact', contactSchema);

const server = http.createServer((req, res) => {
    if (req.url === '/submit-form' && req.method === 'POST') {
      // Handle the contact form submission
      let body = '';
      req.on('data', (data) => {
        body += data;
      });
      req.on('end', () => {
        // Parse the form data
        const formData = new URLSearchParams(body);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
  
        // Create a new instance of the Contact model
        const contactData = new Contact({
          name,
          email,
          message,
        });
  
        // Save the contact data to the database
        contactData.save()
          .then(() => {
            // Redirect the user to a success page or send a success response
            res.writeHead(302, { 'Location': '/success.html' });
            res.end();
          })
          .catch((error) => {
            // Handle any errors that occur during saving
            console.error('Error saving contact:', error);
            // Redirect the user to an error page or send an error response
            res.writeHead(302, { 'Location': '/error.html' });
            res.end();
          });
      });
    } else {
      // Serve the requested HTML file
      const filePath = path.join(__dirname, 'index.html');
  
      fs.readFile(filePath, (err, data) => {
        if (err) {
          // Handle error if the file couldn't be read
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
        } else {
          // Send the file content as the response
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(data);
        }
      });
    }
  });
  
  // Set the port number for your server to listen on
  const port = 3000;
  
  server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
