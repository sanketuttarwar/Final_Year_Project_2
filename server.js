//server setup
const express = require("express");
const routes = require("./routes");
const next = require("next");
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = routes.getRequestHandler(app);
const Encryptor = require("file-encryptor-promise");
const axios = require("axios");
const path = require("path");
const port = process.env.PORT || 3000;

//file upload
var multer = require("multer");
var cors = require("cors");
var http = require("http");

//file system
var fs = require("fs");

//file compress
var archiver = require("archiver");

//file encrypt
var encryptor = require("file-encryptor");

//ipfs
const ipfsAPI = require("ipfs-api");

//delete folder and all its content
var deleteFolderRecursive = function (path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file, index) {
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

//create file directory
const createDir = (dirPath) => {
  fs.mkdirSync(dirPath, { recursive: true }, (error) => {
    if (error) {
      console.error("An error occurred:", error);
    } else {
      console.log("Your directory is made!");
    }
  });
};

//compress function
function compress(now) {}



app
  .prepare()
  .then(() => {
    const server = express();
    server.use(cors());

    server.post("/new", function (req, res) {
      encrypt(req.now);
    });

    //file upload
    server.post("/upload", async function (req, res) {
      var options = { algorithm: 'aes256' };
      let now = Date.now();
      let output;
      let newPathForStorage;
      var storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, newPathForStorage);
        },
        filename: function (req, file, cb) {
          cb(null, Date.now() + "-" + file.originalname);
        },
      });
      var upload = multer({ storage: storage }).array("file");

      newPathForStorage = "public/" + now;
      createDir(newPathForStorage);

      let up = new Promise((resolve, reject) => {
        upload(req, res, async function (err) {
          if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            return res.status(500).json(err);
          } else if (err) {
            // An unknown error occurred when uploading.
            return res.status(500).json(err);
          } else {
            let compress = new Promise((resolve, reject) => {
              //compress stage
              //= create a file to stream archive data to.
              createDir(newPathForStorage + "/compress");
              var output = fs.createWriteStream(
                "public/" + now + "/compress/" + now + ".zip"
              );
              var archive = archiver("zip", {
                zlib: { level: 9 }, // Sets the compression level.
              });

              //= listen for all archive data to be written
              //= 'close' event is fired only when a file descriptor is involved
              output.on("close", async function () {
                console.log(archive.pointer() + " total bytes");
                console.log(
                  "archiver has been finalized and the output file descriptor has closed."
                );
                //encrypt function
                resolve();
              });

              //= This event is fired when the data source is drained no matter what was the data source.
              //= It is not part of this library but rather from the NodeJS Stream API.
              //= @see: https://nodejs.org/api/stream.html#stream_event_end
              output.on("end", function () {
                encrypt(now);
                console.log("Data has been drained");
              });

              //= good practice to catch warnings (ie stat failures and other non-blocking errors)
              archive.on("warning", function (err) {
                if (err.code === "ENOENT") {
                  //= log warning
                } else {
                  //= throw error
                  throw err;
                }
              });

              //= good practice to catch this error explicitly
              archive.on("error", function (err) {
                throw err;
              });

              //= pipe archive data to the file
              archive.pipe(output);

              fs.readdirSync(newPathForStorage).forEach(function (file, index) {
                console.log(index + "    " + file);
                if (file != "compress") {
                  var curPath = newPathForStorage + "/" + file;
                  archive.append(fs.createReadStream(curPath), { name: file });
                }
              });

              //= finalize the archive (ie we are done appending files but streams have to finish yet)
              //= 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
              archive.finalize();
            });
            await compress;
            console.log("Password "+req.query.password);
            let encrypt = new Promise((resolve, reject) => {
              var key = req.query.password;
              encryptor.encryptFile(
                "public/" + now + "/compress/" + now + ".zip",
                "public/" + now + "/compress/" + now + ".dat",
                key,
                options,
                async function (err) {
                  // Encryption complete.
                  const ipfs = ipfsAPI("ipfs.infura.io", "5001", {
                    protocol: "https",
                  });

                  let testFile = fs.readFileSync(
                    "public/" + now + "/compress/" + now + ".dat"
                  );
                  let testBuffer = new Buffer(testFile);
                  let fileHash;

                  ipfs.files.add(testBuffer, function (err, file) {
                    if (err) {
                      console.log(err);
                    }
                    if (file != null) fileHash = file.map((a) => a.hash)[0];
                    console.log(fileHash);
                    resolve(fileHash);
                  });
                }
              );
            });
            output = await encrypt;

            resolve("Done");
          }
          console.log("ppppppppsss");
        });
      });
      await up;
      //deleteFolderRecursive(newPathForStorage);
      return res.status(200).send(output);
    });

    
      server.get("/download", function (req, res) {
        try {	
          var options = { algorithm: 'aes256' };	
          let now = Date.now();	
          new Promise(async function (resolve, reject) {	
            console.log(" entry");	
      
            newPathForStorage = "public/" + now;	
            createDir(newPathForStorage);	
            let ips = ipfsAPI("ipfs.infura.io", "5001", { protocol: "https" });	
            //ips.files.get('QmS9JV65Wx3dmuoPCDcgptakwreBVdhGzULE2Y6ohxGxqG', function (err, files) {	
            // fs.writeFile( newPathForStorage + '/' + now + '.dat', files.content, function(err) {	
            //   console.log(';;;;;;;;;;;;;;;;;;;;;dddddddd')	
            //   if(err) {	
            //     console.log( err )	
            //   } else {	
            //     console.log(' successssssssssss')	
            //     resolve('Done')	
            //   }	
            // });	
      
            // console.log(files.path)	
            // console.log(files.content)	
            // const data = new Uint8Array(files.content);	
            // fs.writeFile(newPathForStorage + '/' + now + '.dat', data, (err) => {	
            //   if (err) throw err;	
            //   console.log('The file has been saved!');	
            // });	
      
            var file = fs.createWriteStream(newPathForStorage + "/" + now + ".dat");	
            console.log("{{{{{{{{{{{{{{ sanket" + req.query.data);	
            await http.get(	
              "http://gateway.ipfs.io/ipfs/".concat(req.query.data),	
              function (response) {	
                response.pipe(file);	
                console.log("[[[[[[[[[[[[[[[[[[[[[[[");	
                file.on("finish", function () {	
                  file.close(() => {	
                    console.log("Done");	
                    resolve("Done");	
                  });	
                });	
              }	
            );	
            //})	
          }).then(function (result) {	
            console.log("Inside");	
            console.log("Password "+req.query.password);	
            var key = req.query.password;	
            encryptor.decryptFile(	
              newPathForStorage + "/" + now + ".dat",	
              newPathForStorage + "/download.zip",	
              key,	
              options,	
              function (err) {	
                // Decryption complete	
                if (err) {	
                  return console.log(err);	
                } else {	
                  console.log("Inside yyyyy ");	
                  let filePath = newPathForStorage + "/download.zip";	
      
                  var filename = path.basename(filePath);	
      
                  res.set({	
                    "content-type": "application/json",	
                    "content-length": "100",	
                    "warning":	
                      "with content type charset encoding will be added by default",	
                      "flag": "true",	
                  });	
                  res.download(filePath, function(err){	
                    //CHECK FOR ERROR	
                      
                    //deleteFolderRecursive(newPathForStorage);	
                  });	
                  //res.download( newPathForStorage + '/download.zip', 'user-facinname.zip');	
      
                }	
              }	
            );	
          });	
          // fs.readdirSync(newPathForStorage).forEach(function(file,index){	
          //   if( file != 'compress' ) {	
          //     var curPath = newPathForStorage + "/" + file;	
          console.log("444444444444444444444");	
        } catch( err ) {	
          res.set({	
            "content-type": "application/json",	
            "content-length": "100",	
            "warning":	
              "with content type charset encoding will be added by default",	
              "flag": "false",	
          });	
          res.download(filePath, function(err){	
            //CHECK FOR ERROR	
              
            deleteFolderRecursive(newPathForStorage);	
          });	
        }	
      });
      

    server.get("*", (req, res) => {
      return handle(req, res);
    });

    server.use(handle).listen(port, (err) => {
      if (err) throw err;
      console.log("> Ready on http://localhost:3000");
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });