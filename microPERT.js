/*
    This file is part of microPERT.

    microPERT is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    microPERT is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with microPERT.  If not, see <https://www.gnu.org/licenses/>.
*/

// Events

function btnCalculateOnClick() {
    var isValid = validateFields();
    if (isValid) {
        hideError();
        var resultsSet = performCalculations();
        writeResults(resultsSet.ExpectedValue, resultsSet.StandardDeviation);
        showResults();
    } else {
        hideResults();
        showError();
    }
}

function btnClearOnClick() {
    resetFields();
    hideError();
    hideResults();
}

// Validators

var validateFields = function () {
    if (isEmptyOrNumber(document.getElementById("unit").value.trim()) ||
        isEmptyOrNaN(document.getElementById("optimistic").value) ||
        isEmptyOrNaN(document.getElementById("nominal").value) ||
        isEmptyOrNaN(document.getElementById("pessimistic").value) ||
        !leastToGreatestOrder(
            document.getElementById("optimistic").value,
            document.getElementById("nominal").value,
            document.getElementById("pessimistic").value)) {
        return false;
    }
    return true;
}

function leastToGreatestOrder(sm, md, lg) {
    return (parseFloat(sm) <= parseFloat(md)) &&
        (parseFloat(md) <= parseFloat(lg));
}

function isEmptyOrNaN(w) {
    return isNullOrEmpty(w) || !isNumber(w);
}

function isEmptyOrNumber(x) {
    return isNullOrEmpty(x) || isNumber(x);
}

function isNumber(y) {
    return !isNaN(parseFloat(y)) && isFinite(y);
}

function isNullOrEmpty(z) {
    return z === undefined || z === null || z === "";
}

// Calculations

function performCalculations() {
    var optimistic = parseFloat(document.getElementById("optimistic").value);
    var nominal = parseFloat(document.getElementById("nominal").value);
    var pessimistic = parseFloat(document.getElementById("pessimistic").value);

    var expectedValue = calculateExpectedValue(optimistic, nominal, pessimistic);
    var standardDeviation = calculateStandardDeviation(pessimistic, optimistic);

    if (document.getElementById("roundUp").checked) {
        expectedValue = Math.ceil(expectedValue);
        standardDeviation = Math.ceil(standardDeviation);
    }

    return { "ExpectedValue": expectedValue, "StandardDeviation": standardDeviation };
}

function calculateExpectedValue(opt, nom, pes) {
    if (document.getElementById("standardWeighting").checked) {
        return (opt + (4 * nom) + pes) / 6;
    }
    else if (document.getElementById("pessimisticWeighting").checked) {
        return (opt + (3 * nom) + (2 * pes)) / 6;
    }
}

function calculateStandardDeviation(pes, opt) {
    return (pes - opt) / 6;
}

// Set/Reset Messages/Fields

function writeResults(exp, std) {
    document.getElementById("expectedValue").innerHTML = exp + " " + document.getElementById("unit").value.trim();
    document.getElementById("standardDeviation").innerHTML = std + " " + document.getElementById("unit").value.trim();
}

function resetFields() {
    document.getElementById("unit").value = "";
    document.getElementById("nominal").value = "";
    document.getElementById("pessimistic").value = "";
    document.getElementById("optimistic").value = "";
    document.getElementById("roundUp").checked = false;
    document.getElementById("standardWeighting").checked = "checked";
    document.getElementById("pessimisticWeighting").checked = false;
}

// Show/Hide Messages

function showError() {
    var errorDiv = document.getElementById("error");
    errorDiv.style.display = "block";
}

function hideError() {
    var errorDiv = document.getElementById("error");
    errorDiv.style.display = "none";
}

function showResults() {
    var resultsDiv = document.getElementById("results");
    resultsDiv.style.display = "block";
}

function hideResults() {
    var resultsDiv = document.getElementById("results");
    resultsDiv.style.display = "none";
}
