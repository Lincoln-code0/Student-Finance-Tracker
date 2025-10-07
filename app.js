// Data model and localStorage
const DATA_KEY = "financeRecords";
const STAT_KEY = "financeStats";
let records = JSON.parse(localStorage.getItem(DATA_KEY)) || [];

// Regex rules
const regex = {
  description: /^(?!.*? {2,})[^\s].*[^\s]$/, // No leading/trailing/collapsed
  amount: /^(0|[1-9]\d*)(\.\d{1,2})?$/, // Decimal
  date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, // YYYY-MM-DD
  category: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/, // Words
  advDuplicate: /\b(\w+)\s+\1\b/ // Duplicate words
};

// Utility: Save + load
function saveRecords() {
  localStorage.setItem(DATA_KEY, JSON.stringify(records));
  announce("Records saved");
}

// CRUD example
function addRecord(rec) {
  if (!isValid(rec)) return false;
  rec.id = Date.now();
  rec.created = new Date().toISOString();
  records.push(rec);
  saveRecords();
  updateUI();
  return true;
}

function isValid(rec) {
  if (!regex.description.test(rec.description) ||
      !regex.amount.test(rec.amount) ||
      !regex.date.test(rec.date) ||
      !regex.category.test(rec.category) ||
      regex.advDuplicate.test(rec.description)) {
    announce("Validation failed"); return false;
  }
  return true;
}

// Event binding, table/rendering, keyboard navigation, ARIA updates skipped for brevity
function announce(msg) {
  const live = document.getElementById("live-status");
  live.textContent = msg;
}

// Initial load
document.addEventListener("DOMContentLoaded", updateUI);

function updateUI() {
  // Populate table/stats here...
  announce(`Loaded ${records.length} record(s).`);
}

// Export to JSON, import
function exportRecords() {
  const json = JSON.stringify(records, null, 2);
  // Download logic...
}

function importRecords(jsonTxt) {
  try {
    const arr = JSON.parse(jsonTxt);
    if (!Array.isArray(arr)) throw new Error("Not an array");
    arr.forEach(rec => { if (isValid(rec)) records.push(rec); });
    saveRecords();
    updateUI();
    announce("Records imported");
  } catch (e) {
    announce("Import failed");
  }
}
