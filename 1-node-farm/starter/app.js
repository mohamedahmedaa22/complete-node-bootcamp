const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceHtml = require('./modules/createTemplate');
const slugify = require('slugify');

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

const server = http.createServer((req, res) => {
    // get requested url
    const {pathname, query} = url.parse(req.url, true);
    // sulgyify all urls
    const slugs = dataObj.map(el => slugify(el.productName, { lower: true }));
    console.log(slugs);
    
    

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

