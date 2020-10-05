import { startMonitoring, on } from "usb-detection";
import { InputCode, setInputSource, getInputSource } from "./ddcController";
const args = process.argv.slice(2);

const insertInputArg = (<any>InputCode)[args[0].toLowerCase()];
const removeInputArg = (<any>InputCode)[args[1].toLowerCase()];

const hubVendorId = args[2]; //Example: 1507;
const hubProductId = args[3]; //Example: 1552;

if (insertInputArg === undefined) {
  console.error("Failed to parse input code for insert");
  process.exit(-1);
}

if (removeInputArg === undefined) {
  console.error("Failed to parse input code for removal");
  process.exit(-1);
}
var currentInput: InputCode | null = null;
var debouncing = false;

function startDebounce() {
  if (debouncing) {
    return false;
  }
  debouncing = true;
  setTimeout(() => (debouncing = false), 5000);
  return true;
}

function updateInputSource(inputCode: InputCode) {
  if (!startDebounce()) {
    console.log("Ignoring hub detection event due to debounce");
    return;
  }

  if (currentInput == inputCode) {
    console.log("Skipped changing input source, already selected.");
    return;
  }
  currentInput = inputCode;
  setInputSource(insertInputArg)
    .then(() => console.log(`Changed input source to ${inputCode}`))
    .catch((error) => console.error("Failed to change input source", error));
}

async function run() {
  currentInput = await getInputSource();

  startMonitoring();

  on(`insert:${hubVendorId}:${hubProductId}`, () => {
    updateInputSource(insertInputArg);
  });

  on(`remove:${hubVendorId}:${hubProductId}`, () => {
    updateInputSource(removeInputArg);
  });

  console.log(`Monitoring for Hub ${hubVendorId}:${hubProductId}`);
}

run();
