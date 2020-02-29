const fs = require('fs');
const http = require('http');
const url = require('url');

//blocking, sync
//const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
//console.log(textIn);
//const textOut = `this is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
//console.log(textOut);
//fs.writeFileSync('./txt/output.txt', textOut);

//ublocking, async

// fs.readFile('./txt/start.txt', 'utf-8', (err, data) => {
//     console.log(data);
// });

//api json data
const apiData = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
//api json data object
const dataObj = JSON.parse(apiData);
// overview template
const overview = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8');
// card template
const card = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
// product template
const product = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

//replace element function : to replace cards in the overview page
const replaceHtml = (temp, pro) => {
    let output = temp.replace(/{%PRODUCTNAME%}/, pro.productName);
    output = output.replace(/{%IMAGE%}/g, pro.image);
    output = output.replace(/{%PRODUCTCOUNTERY%}/g, pro.from);
    output = output.replace(/{%PRODUCTQUANTITY%}/g, pro.quantity);
    output = output.replace(/{%PRICE%}/g, pro.price);
    output = output.replace(/{%PRODUCTNAME%}/g, pro.productName);
    if (!pro.organic) {
        output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    }
    output = output.replace(/{%ID%}/g, pro.id);
    output = output.replace(/{%PRODUCTNUTRIANS%}/g, pro.nutrients);
    output = output.replace(/{%PRODUCTPRICE%}/g, pro.price);
    output = output.replace(/{%DESCRIPTION%}/g, pro.description);
    return output;
}

const server = http.createServer((req, res) => {
    // get requested url
    const {pathname, query} = url.parse(req.url, true);
    

    switch (pathname) {
        //the overview as root
        case '/':
            res.writeHead(200, {
                'Content-type': 'text/html'
            });
            const cardHtml = dataObj.map(el => replaceHtml(card, el)).join('');
            const output = overview.replace('{%PRODUCT_CARDS%}', cardHtml);
            res.end(output);
            break;
        
        //the overview as overview
        case '/overview': 
            res.writeHead(200, {
                'Content-type': 'text/html'
            });
            const cardHtml2 = dataObj.map(el => replaceHtml(card, el)).join('');
            const output2 = overview.replace('{%PRODUCT_CARDS%}', cardHtml2);
            res.end(output2);
            break;

        // the product page
        case '/product':
            res.writeHead(200, { 'Content-type': 'text/html' });
            const resolvedData = dataObj[query.id];
            const newProduct = replaceHtml(product, resolvedData);
            res.end(newProduct);
            break;
        // the simple api
        case '/api':
            res.writeHead(200, {
                'Content-type': 'application/json'
            })
            res.end(apiData);
            break;
        default:
            res.writeHead(404, {'Content-type': 'text/html'});
            res.end('<h1>Page cannot be Found!</h1>');
            break;
    }
});

server.listen(3000, '127.0.0.1', () => {
    console.log('listening to request on port 3000!.');
});

