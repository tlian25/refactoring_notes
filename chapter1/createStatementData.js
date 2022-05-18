// create statement data



function createStatementData(invoice, plays) {

    const result = {};
    result.customer = invoice.customer;
    result.performances = invoice.performances.map(enrichPerformance);
    result.totalAmount = totalAmount(statementData);
    result.totalVolumeCredits = totalVolumeCredits(statementData);
    return result;

    // make a copy of performance object
    function enrichPerformance(aPerformance) {
        const calculator = createPerformanceCalculator(aPerformance, playFor(aPerformance));
        const result = Object.assign({}, aPerformance);
        result.play = calculator.play;
        result.amount = calculator.amount;
        result.volumeCredits = calculator.volumeCredits;
        return result;
    }

    // get play details based on performance
    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }

    // embed loop over total amount
    function totalAmount(data) {
        return data.performances.reduce((total, p) => total + p.amount, 0);
    }

    // embed loop over volume credits
    function totalVolumeCredits(data) {
        return data.performances.reduce((total, p) => total + p.volumeCredits, 0);
    }

    // constructor factory
    function createPerformanceCalculator(aPerformance, aPlay) {
        switch(aPlay.type) {
            case "tragedy": return new TragedyCalculator(aPerformance, aPlay);
            case "comedy": return new ComedyCalculator(aPerformance, aPlay);
            default:
                throw new Error(`unknown type: ${this.play.type}`)
        }
    }

    // Parent Class and Subclasses
    class PerformanceCalculator {
        constructor(aPerformance, play){
            this.performance = aPerformance;
            this.play = play;
        }

        get amount() {
            throw new Error('subclass responsibility');
        }

        get volumeCredits() {
            return Math.max(this.performance.audience - 30, 0);
        }
    }

    class TragedyCalculator extends PerformanceCalculator {
        get amount() {
            let result = 40000;
            if (this.performance.audience > 30) {
                result += 1000 * (this.performance.audience - 30);
            }
            return result;
        }
    }

    class ComedyCalculator extends PerformanceCalculator {
        get amount() {
            let result = 30000;
            if (this.performance.audience > 20) {
                result += 10000 + 500 * (this.performance.audience - 20);
            }
            result += 300 * aPerformance.audience;
            return result;
        }

        get volumeCredits() {
            return super.volumeCredits + Math.floor(this.performance.audience / 5);
        }
    }

}


module.exports = { createStatementData };
