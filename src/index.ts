import { startMonitoring, on } from "usb-detection";
import { InputCode, setInputSource } from "./ddcController";
const args = process.argv.slice(2);

// Pascal Case: https://stackoverflow.com/a/4068586

const inputArg = args[0].replace(/\w+/g, (w) => {
  return w[0].toUpperCase() + w.slice(1).toLowerCase();
});

const targetInputCode = (<any>InputCode)[inputArg];

const hubVendorId = args[1]; //Example: 1507;
const hubProductId = args[2]; //Example: 1552;

startMonitoring();
on(`insert:${hubVendorId}:${hubProductId}`, () => {
  setInputSource(targetInputCode).catch(console.error);
});

console.log("Monitoring");
