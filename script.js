function calculateStampDuty() {
    let propertyValue = parseFloat(document.getElementById('property-value').value.replace(/,/g, ''));
    let residency = document.getElementById('residency').value;
    let existingProperties = parseInt(document.getElementById('existing-properties').value);
    let purchaseType = document.getElementById('purchase-type').value;
    let partnerResidency = document.getElementById('partner-residency') ? document.getElementById('partner-residency').value : null;

    if (!propertyValue || propertyValue <= 0) {
        alert("Please enter a valid property value.");
        return;
    }

    // Buyer's Stamp Duty (BSD) Calculation
    let bsd = 0;
    if (propertyValue <= 180000) {
        bsd = propertyValue * 0.01;
    } else if (propertyValue <= 360000) {
        bsd = (180000 * 0.01) + ((propertyValue - 180000) * 0.02);
    } else if (propertyValue <= 1000000) {
        bsd = (180000 * 0.01) + (180000 * 0.02) + ((propertyValue - 360000) * 0.03);
    } else {
        bsd = (180000 * 0.01) + (180000 * 0.02) + (640000 * 0.03) + ((propertyValue - 1000000) * 0.04);
    }

    bsd = Math.round(bsd);

    // Additional Buyer's Stamp Duty (ABSD) Logic
    let absd = 0;
    let absdRate = "0%";

    if (purchaseType === "single") {
        if (residency === "foreigner" && existingProperties === 0) {
            absd = propertyValue * 0.60;
            absdRate = "60%";
        }
    } else if (purchaseType === "joint-married" || purchaseType === "joint-not-married") {
        if (residency === "singaporean" && partnerResidency === "singaporean") {
            if (existingProperties === 0) {
                absd = 0; // No ABSD for Singaporeans buying a property
                absdRate = "0%";
            } else if (existingProperties === 1) {
                absd = propertyValue * 0.30;
                absdRate = "30%";
            } else if (existingProperties >= 2) {
                absd = propertyValue * 0.35;
                absdRate = "35%";
            }
        } else if ((residency === "singaporean" && partnerResidency === "foreigner") || 
                   (residency === "foreigner" && partnerResidency === "singaporean")) {
            absd = propertyValue * 0.60;
            absdRate = "60%";
        } else if ((residency === "pr" && partnerResidency === "pr")) {
            if (existingProperties === 0) {
                absd = propertyValue * 0.05;
                absdRate = "5%";
            } else if (existingProperties === 1) {
                absd = propertyValue * 0.30;
                absdRate = "30%";
            } else if (existingProperties >= 2) {
                absd = propertyValue * 0.35;
                absdRate = "35%";
            }
        } else if ((residency === "pr" && partnerResidency === "foreigner") || 
                   (residency === "foreigner" && partnerResidency === "pr") || 
                   (residency === "foreigner" && partnerResidency === "foreigner")) {
            absd = propertyValue * 0.60;
            absdRate = "60%";
        }
    }

    absd = Math.round(absd);

    // Total Stamp Duty
    let totalStampDuty = bsd + absd;

    // Update the UI with formatted values
    document.getElementById('property-value-result').innerHTML = propertyValue.toLocaleString();
    document.getElementById('bsd-result').innerHTML = bsd.toLocaleString();
    document.getElementById('absd-result').innerHTML = absd.toLocaleString();
    document.getElementById('total-result').innerHTML = totalStampDuty.toLocaleString();
    document.getElementById('total-result-table').innerHTML = totalStampDuty.toLocaleString();
    document.getElementById('absd-rate').innerHTML = absdRate;

    document.getElementById('bsd-legend-amount').innerHTML = bsd.toLocaleString();
    document.getElementById('absd-legend-amount').innerHTML = absd.toLocaleString();

    let total = bsd + absd;
    document.getElementById('bsd-bar').style.width = `${(bsd / total) * 100}%`;
    document.getElementById('absd-bar').style.width = `${(absd / total) * 100}%`;

    document.getElementById('intro-section').style.display = "none";
    document.querySelector('.result-summary').style.display = "block";
    document.querySelector('.result-details').style.display = "block";
    document.getElementById('calculate-button').innerText = 'Calculate Again';
}

