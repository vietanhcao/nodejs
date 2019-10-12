import http from "http";
import fs from 'fs';

const server = http.createServer(function (req, res) {
    //get
    const url = req.url;
    const method = req.method;
    if(url === '/'){
        res.setHeader('Conten-Type', 'text/html');
        res.write('<html>');
        res.write('<form action="/message" method="POST"><input type="text" name="massage"><button type="submit">home</button></form>');
        res.write('</html>');
        return res.end();
    }
    //send
    console.log('sss1')
    if(url === '/message' && method === "POST"){
        // console.log(req)
        const body :any[] = [];
        req.on('data',(chunk) => {      
            body.push(chunk);
        })
        return req.on('end',() => {
            const parseBody = Buffer.concat(body).toString(); //converse
            console.log('11', parseBody, body)//massage = ... 
            const mesage = parseBody.split('=')[1];
            fs.writeFile('message.txt', mesage,err => {
                res.statusCode = 302;
                res.setHeader('Location', '/');
                return res.end();

            });
        })
        

    }
    console.log('sss')
    res.setHeader('Conten-Type','text/html');
    res.write('<html>');
    res.write('<h1>message</h1>');
    res.write('</html>');
    res.end();
    // process.exit();
});

server.listen(3000);