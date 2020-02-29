//replace element function : to replace cards in the overview page
module.exports = (temp, pro) => {
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