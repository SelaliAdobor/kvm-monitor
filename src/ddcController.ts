import { exec } from "child_process";
import { platform } from "os";
const ddcctlDisplayIndex = 1;
const ddctlInputRegex = /[\s\S]*current: (\d*),.*/m;
export enum InputCode {
  UsbC = 15,
  DisplayPort = 16,
}

function getInputSourceOsx(): Promise<Number> {
  return new Promise((resolve, reject) =>
    exec(`ddcctl -d ${ddcctlDisplayIndex} -i ?`, (error, stdout, stderr) => {
      if (error) {
        return reject(`Failed to read OSX Input Source: ${error.message}`);
      }
      const match = stdout.match(ddctlInputRegex);
      if (match === null) {
        return reject(`Failed to read OSX Input Source: ${stdout}`);
      }
      const inputCode = Number(match[1]);
      resolve(inputCode);
    })
  );
}

function setInputSourceOsx(inputCode: InputCode): Promise<void> {
  return new Promise((resolve, reject) => {
    exec(
      `ddcctl -d ${ddcctlDisplayIndex} -i ${inputCode}`,
      (error, _, stderr) => {
        if (error || stderr) {
          reject(
            `Failed to change OSX Input Source: ${stderr} ${error?.message}`
          );
          return;
        }
        resolve();
      }
    );
  });
}

export async function setInputSource(inputCode: InputCode) {
  if (platform() === "darwin") {
    console.log("Changing input source");
    let currentInput = await getInputSourceOsx();
    if (currentInput != inputCode) {
      await setInputSourceOsx(inputCode);
      console.log("Changed input source successfully.");
    }
  } else if (platform() === "win32") {
    //Placeholder
  } else {
    console.error("Unsupported platform");
  }
}
