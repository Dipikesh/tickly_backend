// const fs = require('fs');

// // fs.writeFile('example.txt','Hello world',(err)=>{
// //     if(err)
// //     throw err;
// //     console.log("File created ");
// // })

// // fs.readFile('example.txt',(err,data)=>{
// //     if(err)
// //     throw new Error('an');
// //     console.log(data.toString())
// // })

// const p1 = Promise.resolve(3);
// const p2 = Promise.reject(1);

// Promise.all([p1,p2]).the

const cluster = require('cluster');

const http = require('http'); 
const numCPUs = require('os').cpus().length;

if(cluster.isMaster) {

console.log(`Master $(process.pid] is running`);

// Fork workers.

for (let i=0;i<numCPUs; i++) {

cluster.fork();

cluster.on('exit', (worker, code, signal) => {

console.log(' worker S(worker.process.pid) died')

})}
} else {

// Workers can share any TCP connection #In this case it is an HTTP server

http.createServer((req, res) => {

res.writeHead(200);

res.end('hello world\n'); 
console.log( `Worker ${process.pid} started`);

}).listen(8000);
}
