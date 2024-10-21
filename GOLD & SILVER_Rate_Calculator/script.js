let isGold = true;

// Function to get formatted date
function getFormattedDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = String(today.getFullYear()).slice(2);
    return day + '-' + month + '-' + year;
}

// Function to show rate entry form
function showForm(option) {
    document.getElementById('selection').classList.add('hidden');
    document.getElementById('form-container').classList.remove('hidden');
    document.getElementById('form-title').innerText = `Enter ${option} rates`;
    isGold = option === 'gold';
    document.getElementById('buyRate').placeholder = isGold ? 'નવું (તોલા)' : 'નવું (કિલો)';
    document.getElementById('sellRate').placeholder = isGold ? 'જૂનું (તોલા)' : 'જૂનું (કિલો)';
}

// Function to go back to the selection page
function goBackToSelection() {
    document.getElementById('form-container').classList.add('hidden');
    document.getElementById('table-container').classList.add('hidden');
    document.getElementById('edit-form-container').classList.add('hidden');
    document.getElementById('selection').classList.remove('hidden');
}

// Function to go back to the rate entry page
function goBackToRateEntry() {
    document.getElementById('table-container').classList.add('hidden');
    document.getElementById('edit-form-container').classList.add('hidden');
    document.getElementById('modified-table-container').classList.add('hidden'); // Hide modified table container if visible
    document.getElementById('form-container').classList.remove('hidden');
}

// Function to go back to the main rate table
function goBackToMainTable() {
    document.getElementById('edit-form-container').classList.add('hidden');
    document.getElementById('table-container').classList.remove('hidden');
}

// Function to go back to the edit values page
function goBackToEditValuesPage() {
    document.getElementById('modified-table-container').classList.add('hidden');
    document.getElementById('edit-form-container').classList.remove('hidden');
}

function customRoundRate(rate, isBuying) {
    if (isBuying) {
        rate = Math.ceil(rate);
        let rateStr = rate.toString();
        let lastDigit = parseInt(rateStr[rateStr.length - 1]);
        if (lastDigit >= 1 && lastDigit <= 4) {
            rate = rate - lastDigit + 5;
        } else if (lastDigit >= 6 && lastDigit <= 9) {
            rate = rate + (10 - lastDigit);
        }
    } else {
        rate = Math.floor(rate);
        let rateStr = rate.toString();
        let lastDigit = parseInt(rateStr[rateStr.length - 1]);
        if (lastDigit >= 1 && lastDigit <= 4) {
            rate = rate - lastDigit;
        } else if (lastDigit >= 6 && lastDigit <= 9) {
            rate = rate - lastDigit + 5;
        }
    }
    return rate;
}

function calculate() {
    let buyRatePerUnit = parseInt(document.getElementById('buyRate').value);
    let sellRatePerUnit = parseInt(document.getElementById('sellRate').value);

    if (isNaN(buyRatePerUnit) || isNaN(sellRatePerUnit)) {
        alert('Please enter valid buy and sell rates');
        return;
    }

    const factor = isGold ? 10 : 1000;
    const buyRate = buyRatePerUnit / factor;
    const sellRate = sellRatePerUnit / factor;

    document.getElementById('form-container').classList.add('hidden');
    document.getElementById('table-container').classList.remove('hidden');

    const meltings = isGold ? [100, 92, 84, 76, 68, 50] : [100, 90, 70, 50];
    const margins = [0, 5, 10, 15, 20];

    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';

    const table = document.getElementById('rateTable');
    table.classList.toggle('gold', isGold);
    table.classList.toggle('silver', !isGold);

    // Insert today's date into the first cell of the table
    const formattedDate = getFormattedDate();
    document.getElementById('dateCell').innerText = formattedDate;

    // Set table heading
    document.getElementById('table-heading').innerText = `${isGold ? 'GOLD' : 'SILVER'}: ${buyRatePerUnit}/${sellRatePerUnit}`;

    // Populate the rest of the table
    for (let i = 0; i < meltings.length; i++) {
        let row = document.createElement('tr');
        row.classList.add('margin-row');

        let meltingCell = document.createElement('td');
        meltingCell.classList.add('melting-column');
        meltingCell.innerText = meltings[i];
        row.appendChild(meltingCell);

        for (let j = 0; j < margins.length; j++) {
            let cell = document.createElement('td');
            let currentBuyRate, currentSellRate;

            if (isGold) {
                // Gold calculations
                if (i === 0) {
                    currentBuyRate = buyRate;
                    currentSellRate = sellRate;
                } else if (i === 1) {
                    currentBuyRate = buyRate * 0.98;
                    currentSellRate = sellRate * 0.915;
                } else if (i === 2) {
                    currentBuyRate = buyRate * 0.90;
                    currentSellRate = sellRate * 0.832;
                } else if (i === 3) {
                    currentBuyRate = buyRate * 0.84;
                    currentSellRate = sellRate * 0.75;
                } else if (i === 4) {
                    currentBuyRate = buyRate * 0.76;
                    currentSellRate = sellRate * 0.665;
                } else if (i === 5) {
                    currentBuyRate = buyRate * 0.58;
                    currentSellRate = sellRate * 0.45;
                }

                let buyRateWithMargin, sellRateWithMargin;
                if (margins[j] === 0) {
                    buyRateWithMargin = currentBuyRate;
                    sellRateWithMargin = currentSellRate;
                } else {
                    buyRateWithMargin = currentBuyRate / (1 - margins[j] / 100);
                    sellRateWithMargin = currentSellRate / (1 + margins[j] / 100);
                }

                buyRateWithMargin = customRoundRate(buyRateWithMargin, true);
                sellRateWithMargin = customRoundRate(sellRateWithMargin, false);

                cell.innerText = `${buyRateWithMargin} / ${sellRateWithMargin}`;

                if (j === 0) {
                    cell.innerHTML += `<br>${i === 0 ? '(100/100)' : i === 1 ? '(98/91.50)' : i === 2 ? '(90/83.20)' : i === 3 ? '(84/75)' : i === 4 ? '(76/66.50)' : '(58/45)'}`;
                }
            } else {
                // Silver calculations
                if (i === 0) {
                    currentBuyRate = buyRate;
                    currentSellRate = sellRate;
                } else if (i === 1) {
                    currentBuyRate = buyRate * 1;
                    currentSellRate = sellRate * 0.88;
                } else if (i === 2) {
                    currentBuyRate = buyRate * 0.87;
                    currentSellRate = sellRate * 0.68;
                } else if (i === 3) {
                    currentBuyRate = buyRate * 0.67;
                    currentSellRate = sellRate * 0.43;
                }

                let buyRateWithMargin, sellRateWithMargin;
                if (margins[j] === 0) {
                    buyRateWithMargin = currentBuyRate;
                    sellRateWithMargin = currentSellRate;
                } else {
                    buyRateWithMargin = currentBuyRate / (1 - margins[j] / 100);
                    sellRateWithMargin = currentSellRate / (1 + margins[j] / 100);
                }

                buyRateWithMargin = Math.ceil(buyRateWithMargin);
                sellRateWithMargin = Math.floor(sellRateWithMargin);

                cell.innerText = `${buyRateWithMargin} / ${sellRateWithMargin}`;

                // Append the fixed text for the 0% margin column
                if (j === 0) {
                    cell.innerHTML += `<br>${i === 0 ? '(100/100)' : i === 1 ? '(100/88)' : i === 2 ? '(87/68)' : '(67/43)'}`;
                }
            }

            row.appendChild(cell);
        }

        tableBody.appendChild(row);
    }
}

function saveTable() {
    const tableContainer = document.getElementById('table-container');
    const buttonsContainer = document.getElementById('buttons-container');
    buttonsContainer.style.display = 'none'; // Hide buttons

    html2canvas(tableContainer).then(canvas => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/jpeg');
        link.download = 'rateTable.jpg';
        link.click();

        buttonsContainer.style.display = 'block'; // Show buttons again
    });
}
function saveModifiedTable() {
    const tableContainer = document.getElementById('modified-table-container');
    const buttonsContainer = document.getElementById('modified-buttons-container');
    buttonsContainer.style.display = 'none'; // Hide buttons
    html2canvas(tableContainer).then((canvas) => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/jpeg');
        link.download = 'modified_rate_table.jpg';
        link.click();

        buttonsContainer.style.display = 'block'; // Show buttons again
    });
}

function resetPage() {
    location.reload();
}

function showEditForm() {
    document.getElementById('table-container').classList.add('hidden');
    document.getElementById('edit-form-container').classList.remove('hidden');
}

function showTableContainer() {
    document.getElementById('modified-table-container').classList.add('hidden');
    document.getElementById('table-container').classList.remove('hidden');
}

function calculateEdit() {
    let buyRatePerUnit = parseInt(document.getElementById('buyRate').value);
    let sellRatePerUnit = parseInt(document.getElementById('sellRate').value);
    let touch = parseFloat(document.getElementById('touch').value);
    let male = parseFloat(document.getElementById('male').value);
    let kharoTouch = parseFloat(document.getElementById('kharoTouch').value);

    if (isNaN(touch) || isNaN(male) || isNaN(kharoTouch)) {
        alert('Please enter valid values');
        return;
    }

    const factor = isGold ? 10 : 1000;
    const buyRate = buyRatePerUnit / factor;
    const sellRate = sellRatePerUnit / factor;

    document.getElementById('edit-form-container').classList.add('hidden');
    document.getElementById('modified-table-container').classList.remove('hidden');

    const meltings = [touch];
    const margins = [0, 5, 10, 15, 20];

    const tableBody = document.getElementById('modifiedTableBody');
    tableBody.innerHTML = '';

    const table = document.getElementById('modifiedRateTable');
    table.classList.toggle('gold', isGold);
    table.classList.toggle('silver', !isGold);

    const formattedDate = getFormattedDate();
    document.getElementById('modified-dateCell').innerText = formattedDate;

    document.getElementById('modified-table-heading').innerText = `${isGold ? 'GOLD' : 'SILVER'}: ${buyRatePerUnit} / ${sellRatePerUnit}`;

    for (let i = 0; i < meltings.length; i++) {
        let row = document.createElement('tr');
        row.classList.add('margin-row');

        let meltingCell = document.createElement('td');
        meltingCell.classList.add('melting-column');
        meltingCell.innerText = meltings[i];
        row.appendChild(meltingCell);

    for (let j = 0; j < margins.length; j++) {
        let cell = document.createElement('td');
        let currentBuyRate = buyRate * (male / 100);
        let currentSellRate = sellRate * (kharoTouch / 100);

        let buyRateWithMargin, sellRateWithMargin;
        if (margins[j] === 0) {
            buyRateWithMargin = currentBuyRate;
            sellRateWithMargin = currentSellRate;
        } else {
            buyRateWithMargin = currentBuyRate / (1 - margins[j] / 100);
            sellRateWithMargin = currentSellRate / (1 + margins[j] / 100);
        }

        if (isGold) {
            buyRateWithMargin = customRoundRate(buyRateWithMargin, true);
            sellRateWithMargin = customRoundRate(sellRateWithMargin, false);
        } else {
            buyRateWithMargin = Math.ceil(buyRateWithMargin);
            sellRateWithMargin = Math.floor(sellRateWithMargin);
        }

        cell.innerText = `${buyRateWithMargin} / ${sellRateWithMargin}`;

        if (j === 0) {
            cell.innerHTML += `<br>(${male}/${kharoTouch})`;
        }

        row.appendChild(cell);
    }

tableBody.appendChild(row);
}
}