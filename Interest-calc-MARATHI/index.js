function resetPage() {
    location.reload();
} 

let selectedOption = 1;
document.getElementById('option1').style.backgroundColor = '#ff5733';

function toggleManualEndDate() {
    const manualEndDate = document.getElementById('manualEndDate');
    const todayCheckbox = document.getElementById('todayCheckbox');
    const manualEndDateCheckbox = document.getElementById('manualEndDateCheckbox');

    if (todayCheckbox.checked) {
        manualEndDate.style.display = 'none';
    } else if (manualEndDateCheckbox.checked) {
        manualEndDate.style.display = 'block';
    }
}

function toggleOptions(show) {
    const options = document.getElementById('options');
    if (show) {
        options.style.display = 'block';
    } else {
        options.style.display = 'none';
    }
}

function toggleButtons(show) {
    const additionalButtons = document.getElementById('additionalButtons');
    if (show) {
        additionalButtons.style.display = 'block';
        document.getElementById('countButton').style.backgroundColor = 'black';
    } else {
        additionalButtons.style.display = 'none';
    }
}

function toggleResultSection() {
    const resultSection = document.getElementById('resultSection');
    resultSection.style.display = 'block';
    resultSection.scrollIntoView({ behavior: 'smooth' });
}

function updateResult() {
    const result = document.getElementById('result');
    result.innerHTML = '';
}

function displayCalculatedDuration(originalDuration, replacedDuration) {
    const resultDurationElement = document.querySelector('.result-duration');

    if (replacedDuration) {
        // Replacer group generated, display both original and replaced duration
        resultDurationElement.innerHTML = `${originalDuration} = ${replacedDuration}`;
    } else {
        // Replacer group not generated, display the original duration
        resultDurationElement.innerHTML = originalDuration;
    }
}

function setOption(option) {
    selectedOption = option;
    document.querySelectorAll('.option-button').forEach(button => {
        button.style.backgroundColor = '#007BFF';
    });
    document.getElementById(`option${option}`).style.backgroundColor = '#ff5733';
    calculateDuration();
}

function checkFieldsBeforeCalculate() {
    const monthlyInterest = document.getElementById('monthlyInterest').value.trim();
    const amount = document.getElementById('amount').value.trim();

    if (monthlyInterest === '' || amount === '') {
        document.getElementById('result').innerHTML = 'काही खाली आहे';
        toggleButtons(false);
    } else {
        calculateDuration();
    }
}

function calculateReplacedDuration(originalDuration, option) {
    if (option === 1) {
        return null; // Return null for option1
    }
    let initialMonths = Math.floor(originalDuration / 30);
    let replacedDuration;

    switch (option) {
        case 1:
            replacedDuration = `${originalDuration}`;
            break;
        case 30:
            replacedDuration = `${initialMonths + 1} महिने `;
            break;
        case 21:
            replacedDuration = `${initialMonths} महिने 3 आठवडे`;
            break;
        case 15:
            replacedDuration = `${initialMonths} महिने 2 आठवडे`;
            break;
        case 7:
            replacedDuration = `${initialMonths} महिने 1 आठवडे`;
            break;
        case 0:
            replacedDuration = `${initialMonths} महिने 0 आठवडे`;
            break;
        default:
            replacedDuration = `${initialMonths} महिने`;
    }

    return replacedDuration;
}

function calculateDuration() {
    const startDay = parseInt(document.getElementById('startDay').value);
    const startMonth = parseInt(document.getElementById('startMonth').value);
    const startYear = parseInt(document.getElementById('startYear').value);
    const monthlyInterest = parseFloat(document.getElementById('monthlyInterest').value);
    const amount = parseFloat(document.getElementById('amount').value) || 0;

    if (isNaN(startDay) || isNaN(startMonth) || isNaN(startYear) ||
        startDay < 1 || startDay > 31 || startMonth < 1 || startMonth > 12) {
        document.getElementById('result').innerHTML = 'मान्य तारीख टाका';
        toggleButtons(false);
        return;
    }

    const startDate = new Date(startYear, startMonth - 1, startDay);

    let endDate;

    if (document.getElementById('todayCheckbox').checked) {
        endDate = new Date();
    } else if (document.getElementById('manualEndDateCheckbox').checked) {
        const endDay = parseInt(document.getElementById('endDay').value);
        const endMonth = parseInt(document.getElementById('endMonth').value);
        const endYear = parseInt(document.getElementById('endYear').value);

        if (isNaN(endDay) || isNaN(endMonth) || isNaN(endYear)) {
            document.getElementById('result').innerHTML = 'मान्य तारीख टाका';
            toggleButtons(false);
            return;
        }

        endDate = new Date(endYear, endMonth - 1, endDay);
    }

    let months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
    let days = endDate.getDate() - startDate.getDate();

    if (days < 0) {
        months--;
        const tempEndDate = new Date(endDate);
        tempEndDate.setMonth(tempEndDate.getMonth() - 1);
        days += new Date(tempEndDate.getFullYear(), tempEndDate.getMonth() + 1, 0).getDate();
    }

    if (months < 0) {
        document.getElementById('result').innerHTML = 'प्रारंभिक तारीख चुकीची आहे';
        toggleButtons(false);
        return;
    }

    let resultText = '';
    let durationText = '';
    let additionalCalculations = ''; // This will store the additional calculations

    if (months > 0) {
        resultText += months + ' महिने ';
        durationText += months + ' महिने ';
    }
    if (days > 0) {
        resultText += days + ' दिवस ';
        durationText += days + ' दिवस ';
    }

    let exdays=days
    const weeks = Math.floor(days / 7);
    days %= 7;

    resultText += '\n(';

    if (months > 0) {
        resultText += months + ' महिने ';
    }

    if (weeks > 0) {
        resultText += weeks + ' आठवडे ';
    }

    if (days > 0) {
        resultText += days + ' दिवस ';
    }

    resultText += ')';

    document.querySelector('.result-title').innerHTML = '<span class="total-amount"> रक्कम: ' + amount;
    document.querySelector('.date-range').innerHTML = formatDate(startDate) + ' - ' + formatDate(endDate);
    document.getElementById('result').innerHTML = resultText;

    const replacedDuration = calculateReplacedDuration(months * 30 + days, selectedOption);
    if (selectedOption === 1) {
        // If option1 is selected, display the duration without any replacement
        displayCalculatedDuration(durationText, null);
    } else {
        // For other options, display the duration with replacement
        displayCalculatedDuration(durationText, replacedDuration);
    } // Pass both original and replaced durations

    if (durationText.includes('दिवस')) {
        toggleOptions(true); // Display replacer group

        // Additional calculations based on selected option
        switch (selectedOption) {
            case 1:
   
                const totalInterest = ((months + 1) * amount * monthlyInterest) / 100;
                const originalInterest = (months * amount * monthlyInterest) / 100;
                const extraDaysInterest = (exdays * amount * monthlyInterest) / (30 * 100); // Calculate interest 
                const totalAmount = amount + totalInterest;

                additionalCalculations = `
                ${amount} ₹ X ${monthlyInterest} % = ${(amount * monthlyInterest) / 100} ₹<br><br>
                ${months} X ${(amount * monthlyInterest) / 100} ₹ = ${((months) * (amount * monthlyInterest) / 100)} ₹<br>
                + ${exdays} दिवस X ${(amount * monthlyInterest) / (30 * 100)} ₹ = ${extraDaysInterest} ₹<br>
                -------------------------------------------<br>
                ${((months) * (amount * monthlyInterest) / 100) + extraDaysInterest} ₹<br><br>
                <span class="total-amount">
                ${amount} + ${((months) * (amount * monthlyInterest) / 100) + extraDaysInterest} = ${(amount) + ((months) * (amount * monthlyInterest) / 100) + extraDaysInterest} ₹</span>`;
                break;

            case 30:
                additionalCalculations = `
               ${amount} ₹ X ${monthlyInterest} % = ${(amount * monthlyInterest) / 100} ₹<br><br>
                ${replacedDuration} X ${(amount * monthlyInterest) / 100} ₹ = ${((months + 1) * (amount * monthlyInterest) / 100)} ₹<br><br>
                <span class="total-amount">
                ${amount} + ${((months + 1) * (amount * monthlyInterest) / 100)} = ${(amount) + ((months + 1) * (amount * monthlyInterest) / 100)} ₹</span>`;
                break;
            case 21:
                additionalCalculations = `
                ${amount} ₹ X ${monthlyInterest} % = ${(amount * monthlyInterest) / 100} ₹<br><br>
                ${months} X ${(amount * monthlyInterest) / 100} ₹ = ${((months) * (amount * monthlyInterest) / 100)} ₹<br>
                + 3 आठवडे X ${((amount * monthlyInterest) / 100)} ₹ = ${0.75 * (amount * monthlyInterest) / 100} ₹<br>
                -------------------------------------------<br>
                ${((months) * (amount * monthlyInterest) / 100) + (0.75 * (amount * monthlyInterest) / 100)} ₹<br><br>
               <span class="total-amount">
                ${amount} + ${((months) * (amount * monthlyInterest) / 100) + (0.75 * (amount * monthlyInterest) / 100)}= ${(amount) + ((months) * (amount * monthlyInterest) / 100) + (0.75 * (amount * monthlyInterest) / 100)} ₹</span>`;
                break;
            case 15:
                additionalCalculations = `
                ${amount} ₹ X ${monthlyInterest} % = ${(amount * monthlyInterest) / 100} ₹<br><br>
                ${months} X ${(amount * monthlyInterest) / 100} ₹ = ${((months) * (amount * monthlyInterest) / 100)} ₹<br>
                + 2 आठवडे X ${((amount * monthlyInterest) / 100)} ₹ = ${0.50 * (amount * monthlyInterest) / 100} ₹<br>
                -------------------------------------------<br>
                ${((months) * (amount * monthlyInterest) / 100) + (0.50 * (amount * monthlyInterest) / 100)} ₹<br><br>
                <span class="total-amount">
                ${amount} + ${((months) * (amount * monthlyInterest) / 100) + (0.50 * (amount * monthlyInterest) / 100)}= ${(amount) + ((months) * (amount * monthlyInterest) / 100) + (0.50 * (amount * monthlyInterest) / 100)} ₹</span>`;
                break;
            case 7:
                additionalCalculations = `
                ${amount} ₹ X ${monthlyInterest} % = ${(amount * monthlyInterest) / 100} ₹<br><br>
                ${months} X ${(amount * monthlyInterest) / 100} ₹ = ${((months) * (amount * monthlyInterest) / 100)} ₹<br>
                + 1 आठवडे X ${((amount * monthlyInterest) / 100)} ₹ = ${0.25 * (amount * monthlyInterest) / 100} ₹<br>
                -------------------------------------------<br>
                ${((months) * (amount * monthlyInterest) / 100) + (0.25 * (amount * monthlyInterest) / 100)} ₹<br><br>
                <span class="total-amount">
                ${amount} + ${((months) * (amount * monthlyInterest) / 100) + (0.25 * (amount * monthlyInterest) / 100)}= ${(amount) + ((months) * (amount * monthlyInterest) / 100) + (0.25 * (amount * monthlyInterest) / 100)} ₹</span>`;
                break;
            case 0:
                additionalCalculations = `
                ${amount} ₹ X ${monthlyInterest} % = ${(amount * monthlyInterest) / 100} ₹<br><br>
                ${replacedDuration} X ${(amount * monthlyInterest) / 100} ₹ = ${((months) * (amount * monthlyInterest) / 100)} ₹<br><br>
                <span class="total-amount">
                ${amount} + ${((months) * (amount * monthlyInterest) / 100)} = ${(amount) + ((months) * (amount * monthlyInterest) / 100)} ₹</span>`;
                break;
            default:
                // Add calculations for other cases here
        }
    } else {
        toggleOptions(false); // Hide replacer group
        displayCalculatedDuration(durationText, ""); // Pass original duration

        additionalCalculations = `
        ${amount} ₹ X ${monthlyInterest} % = ${(amount * monthlyInterest) / 100} ₹<br>
        ${durationText} X ${(amount * monthlyInterest) / 100} ₹ = ${((months) * (amount * monthlyInterest) / 100)} ₹<br><br>
        <span class="total-amount">
        ${amount} + ${((months) * (amount * monthlyInterest) / 100)} = ${(amount) + ((months) * (amount * monthlyInterest) / 100)} ₹
        </span>`;
    }
    // Append additional calculations to the "result section"
    const resultSection = document.getElementById('resultSection');
    resultSection.querySelector('.additional-calculations').innerHTML = additionalCalculations;

    if (durationText.includes('महिने') || durationText.includes('दिवस')) {
        toggleButtons(true); // Display "gano" and "upad2" buttons
    } else {
        toggleButtons(false); // Hide "gano" and "upad2" buttons
    }
}

function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}
