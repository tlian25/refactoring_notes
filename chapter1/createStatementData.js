// create statement data
function createStatementData(invoice, plays) {

    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    statementData.totalAmount = totalAmount(statementData);
    statementData.totalVolumeCredits = totalVolumeCredits(statementData);
    return statementData;

    // make a copy of performance object
    function enrichPerformance(aPerformance) {
        const result = Object.assign({}, aPerformance);
        result.play = playFor(result);
        result.amount = amountFor(result);
        result.volumeCredits = volumeCreditsFor(result);
        return result;
    }


    // get play details based on performance
    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }

    // replace switch statement with amountFor function
    function amountFor(aPerformance) {
        let result = 0;

        switch (aPerformance.play.type) {
            case "tragedy":
                result = 40000;
                if (aPerformance.audience > 30) {
                    result += 1000 * (aPerformance.audience - 30);
                }
                break;
            case "comedy":
                result = 30000;
                if (aPerformance.audience > 20) {
                    result += 10000 + 500 * (aPerformance.audience - 20);
                }
                result += 300 * aPerformance.audience;
                break;
            default:
                throw new Error(`unknown type: ${aPerformance.play.type}`)
        }
        return result;
    }


    // calculate volume credits
    function volumeCreditsFor(aPerformance) {
        let result = 0;
        //add volume credits
        result += Math.max(aPerformance.audience - 30, 0);
        //add extra credit for every 10 comedy attendees
        if (aPerformance.play.type === "comedy") result += Math.floor(aPerformance.audience / 5);
        return result;
    }

    // embed loop over volume credits
    function totalVolumeCredits(data) {
        return data.performances.reduce((total, p) => total + p.volumeCredits, 0);
    }

    // embed loop over total amount
    function totalAmount(data) {
        return data.performances.reduce((total, p) => total + p.amount, 0);
    }
}


module.exports = { createStatementData };
