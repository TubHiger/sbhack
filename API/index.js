const cors = require("cors");
const express = require("express");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const multer = require("multer");
const pdfParse = require("pdf-parse");

//const { models, db } = require("./db");
const initializeDatabase = require("./db");

const { ApolloServer } = require("apollo-server-express");
const { connect } = require("mongoose");
//import { Pool, Client } from "pg";
const Pool = require("pg").Pool;
//const { typeDefs, resolvers } = require('./graphql');

require("dotenv").config({ path: ".env" });

const PORT = process.env.PORT || 3000;

// const config = {
//   user: "bruh",
//   password: "Shashi@123",
//   database: "postgres",
//   host: "34.173.198.96",
// };

const startServer = async () => {
  //const db = await connectToMongoDB();
  const { models, db } = await initializeDatabase();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context() {
      //({ db });
      return { models, db };
    },
  });

  const app = express();

  //const upload = multer({ dest: "uploads/" });
  const storage = multer.memoryStorage();
  const upload = multer({ storage: storage });

  //using the graphql server as a middleware for the express server accessible via /graphql endpoint
  server.applyMiddleware({ app });

  //app.use(express.json());
  app.use(express.json({ limit: "50mb" }));
  app.use(
    cors({
      origin: "*",
      credentials: true,
      methods: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
      allowedHeaders:
        "X-CSRF-Token,X-Requested-With,Accept,Accept-Version,Content-Length,Content-MD5,Content-Type,Date,X-Api-Version",
      preflightContinue: true,
      maxAge: 999999999,
    })
  );

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong!");
  });

  //normal endpoints accessible as well
  app.post("/test", (req, res) => {
    res.send("Hello World");
  });

  app.post("/upload", upload.single("file"), async (req, res) => {
    // req.file is the uploaded file's metadata and buffer
    console.log("upload endpoint accessed");
    console.log(req.file);
    const { buffer, originalname, mimetype } = req.file;

    // Check if the file is a PDF
    if (mimetype !== "application/pdf") {
      return res.status(400).send("File must be a PDF.");
    }

    try {
      // Process the PDF file using pdf-parse library
      const pdfData = await pdfParse(buffer);

      // Print out the PDF content
      console.log("PDF content:\n", pdfData.text);

      function extractHeadings(text) {
        const headings = {};
        const headingRegex = /^([A-Z][A-Za-z\s\-\(\)]+):?$/gm;
        let match;

        while ((match = headingRegex.exec(text)) !== null) {
          const heading = match[1];
          const nextHeadingRegex = /^[A-Z][A-Za-z\s\-\(\)]+:?$/gm;
          const endOfHeadingIndex = headingRegex.lastIndex;
          nextHeadingRegex.lastIndex = endOfHeadingIndex;
          const nextMatch = nextHeadingRegex.exec(text);
          const nextHeadingIndex = nextMatch ? nextMatch.index : text.length;

          const content = text
            .slice(endOfHeadingIndex, nextHeadingIndex)
            .trim();
          headings[heading] = content;
        }

        return headings;
      }

      const headings = extractHeadings(pdfData.text);
      console.log("Extracted headings:", headings);

      // Send a response
      //res.send("PDF file processed successfully");

      return "pdf handler accessed";
    } catch (error) {
      console.error("Error processing PDF file:", error);
      res.status(500).send("Failed to process PDF file.");
    }

    // Process the PDF file (e.g., extract text, analyze content, etc.)
    // This part depends on the specific PDF processing library you choose.
    // See the following example for a simple way to read the PDF content
    // TODO: Process the PDF content using a PDF processing library

    // Send a response
    //res.send("PDF file processed successfully");
    return "pdf handler accessed";
  });

  app.listen(PORT, () => {
    console.log(`listening for requests on port ${PORT}`);
  });
};

startServer();
