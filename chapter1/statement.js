// Refactored Example

const lib = require("./createStatementData.js");

function statement(invoice, plays) {
    return renderPlainText(lib.createStatementData(invoice, plays));
}



function renderPlainText(data) {

    // Main function portion
    let result = `Statement for ${data.customer}\n`;    

    for (let perf of data.performances) {
        //print line for this order
        result += ` ${perf.play.name}: ${usd(perf.amount)} (${perf.audience} seats)\n`;
    }

    result += `Amount owed is ${usd(data.totalAmount)}\n`;
    result += `You earned ${data.totalVolumeCredits} credits \n`;
    return result;


    // HELPER FUNCTIONS - REFACTORINGS

    // format number
    function usd(aNumber) {
        return new Intl.NumberFormat("en-US",
            {style: "currency", currency: "USD",
            minimumFractionDigits: 2}).format(aNumber / 100);
    }
}



invoice = require("./invoices.json")[0]
plays = require("./plays.json")

var result = statement(invoice, plays);
console.log();
console.log(result);