// Helper function to calculate final payout
function calculatePayout(driver) {
    const revenuePercentage = parseFloat(document.getElementById('revenue-percentage').value) / 100;
    const withTax = document.getElementById('tax-calculation').checked;
    const keepCash = document.getElementById('cash-handling').checked;
    
    // Calculate base amount based on tax selection
    const revenueWithoutTips = driver.totalRevenue - driver.tips;
    let baseAmount;
    
    if (withTax) {
        // With tax - use values as is
        baseAmount = revenueWithoutTips * revenuePercentage;
    } else {
        // Without tax - remove 19% tax first
        baseAmount = (revenueWithoutTips / 1.19) * revenuePercentage;
    }

    // Calculate final payout
    let finalPayout = baseAmount + driver.tips;
    
    // If driver keeps cash, subtract it from final payout
    if (keepCash) {
        finalPayout -= Math.abs(driver.cashCollected);
    }

    return {
        baseAmount: baseAmount.toFixed(2),
        finalPayout: finalPayout.toFixed(2),
        revenueWithoutTips: revenueWithoutTips.toFixed(2)
    };
}

// UI Handler Module
const UIHandler = {
    displayResults(processedData) {
        const tbody = document.getElementById('results-body');
        tbody.innerHTML = '';

        // Update table headers
        const thead = document.querySelector('.result-table thead tr');
        thead.innerHTML = `
            <th>Fahrer</th>
            <th>Gesamtumsatz</th>
            <th>Gesamtumsatz (ohne Trinkgeld)</th>
            <th>Bargeld</th>
            <th>Trinkgeld</th>
            <th>Basis Auszahlung</th>
            <th>Finale Auszahlung</th>
        `;

        const withTax = document.getElementById('tax-calculation').checked;
        const taxInfo = withTax ? 'mit MwSt' : 'ohne MwSt';

        processedData.forEach(driver => {
            const payout = calculatePayout(driver);
            const row = document.createElement('tr');
            
            const cashClass = driver.cashCollected >= 0 ? 'positive-cash' : 'negative-cash';
            const cashAmount = Math.abs(driver.cashCollected).toFixed(2);
            
            row.innerHTML = `
                <td>${driver.firstName} ${driver.lastName}</td>
                <td class="amount-column">${driver.totalRevenue.toFixed(2)}€</td>
                <td class="amount-column">${payout.revenueWithoutTips}€</td>
                <td class="amount-column ${cashClass}">${cashAmount}€</td>
                <td class="amount-column">${driver.tips.toFixed(2)}€</td>
                <td class="amount-column base-amount">${payout.baseAmount}€</td>
                <td class="amount-column final-amount">${payout.finalPayout}€</td>
            `;
            tbody.appendChild(row);
        });

        document.getElementById('results').classList.add('visible');

        // Log detailed information to console
        console.group('Fahrer Details');
        processedData.forEach(driver => {
            const payout = calculatePayout(driver);
            const cashAmount = Math.abs(driver.cashCollected).toFixed(2);
            console.group(`${driver.firstName} ${driver.lastName}`);
            console.log('Gesamtumsatz:', `${driver.totalRevenue.toFixed(2)}€`);
            console.log('Gesamtumsatz (ohne Trinkgeld):', `${payout.revenueWithoutTips}€`);
            console.log('Bargeld:', `${cashAmount}€`);
            console.log('Trinkgeld:', `${driver.tips.toFixed(2)}€`);
            console.log(`Basis Auszahlung (${taxInfo}):`, `${payout.baseAmount}€`);
            console.log(`Finale Auszahlung (${taxInfo}):`, `${payout.finalPayout}€`);
            console.groupEnd();
        });
        console.groupEnd();
    },

    showError(message) {
        const errorDiv = document.getElementById('file-error');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
};

// CSV Parser Module
const CSVParser = {
    parseCSV(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (event) => {
                try {
                    const csv = event.target.result;
                    const lines = csv.split('\n');
                    const headers = lines[0].split(',').map(header => header.trim());
                    
                    const driverData = [];
                    
                    for (let i = 1; i < lines.length; i++) {
                        if (!lines[i].trim()) continue;
                        
                        const values = lines[i].split(',').map(value => value.trim());
                        const driver = {};
                        
                        headers.forEach((header, index) => {
                            let value = values[index];
                            
                            // Convert numeric values
                            if (!isNaN(value)) {
                                value = parseFloat(value);
                            }
                            
                            switch(header) {
                                case 'Vorname des Fahrers':
                                    driver.firstName = value;
                                    break;
                                case 'Nachname des Fahrers':
                                    driver.lastName = value;
                                    break;
                                case 'Gesamtumsätze':
                                    driver.totalRevenue = value;
                                    break;
                                case 'Auszahlungen : Eingenommenes Bargeld':
                                    driver.cashCollected = value;
                                    break;
                                case 'Gesamtumsätze:Trinkgeld':
                                    driver.tips = value;
                                    break;
                            }
                        });
                        
                        driverData.push(driver);
                    }
                    
                    resolve(driverData);
                } catch (error) {
                    reject('Fehler beim Verarbeiten der CSV-Datei');
                }
            };
            
            reader.onerror = () => reject('Fehler beim Lesen der Datei');
            reader.readAsText(file);
        });
    }
};

// File Drop Zone Handler
const FileDropHandler = {
    init() {
        const dropZone = document.getElementById('drop-zone');
        const fileInput = document.getElementById('csv-file');

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, this.preventDefaults, false);
            document.body.addEventListener(eventName, this.preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => {
                dropZone.classList.add('drag-over');
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => {
                dropZone.classList.remove('drag-over');
            });
        });

        dropZone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            fileInput.files = files;
            
            // Trigger form submission if a file was dropped
            if (files.length > 0) {
                document.getElementById('calculator-form').dispatchEvent(new Event('submit'));
            }
        });
    },

    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('csv-file');
    const form = document.getElementById('calculator-form');

    // Initialize file drop zone
    FileDropHandler.init();

    // Add change event listeners to checkboxes for immediate recalculation
    const checkboxes = ['tax-calculation', 'cash-handling'];
    checkboxes.forEach(id => {
        const checkbox = document.getElementById(id);
        checkbox.addEventListener('change', () => {
            if (fileInput.files[0]) {
                form.dispatchEvent(new Event('submit'));
            }
        });
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const file = fileInput.files[0];
        if (!file) {
            UIHandler.showError('Bitte wählen Sie eine CSV-Datei aus');
            return;
        }

        try {
            const driverData = await CSVParser.parseCSV(file);
            UIHandler.displayResults(driverData);
        } catch (error) {
            UIHandler.showError(error);
        }
    });
}); 