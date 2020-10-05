import { exec } from "child_process";
import { platform } from "os";

const ddcctlDisplayIndex = 1;
const ddctlInputRegex = /[\s\S]*current: (\d*),.*/m;

//Breaks naming conventions due to use as command line arg
export enum InputCode {
  usbc = 15,
  dp1 = 15,
  dp = 16,
  dp2 = 16,
  hdmi = 17,
  hdmi1 = 17,
  hdmi2 = 18,
  usbcnative = 27,
  dvi1 = 3,
  dvi2 = 4,
}

function getInputSourceOsx(): Promise<Number> {
  return new Promise((resolve) =>
    exec(`ddcctl -d ${ddcctlDisplayIndex} -i ?`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Failed to read OSX Input Source: ${error.message}`);
        return resolve(-1);
      }
      const match = stdout.match(ddctlInputRegex);
      if (match === null) {
        console.error(`Failed to read OSX Input Source: ${stdout}`);
        return resolve(-1);
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
            `Failed to change OSX Input Source: ${stderr.replace("\n", "")}`
          );
          return;
        }
        resolve();
      }
    );
  });
}

export async function getInputSource(): Promise<InputCode | null> {
  if (platform() === "darwin") {
    return (await getInputSourceOsx()) as InputCode;
  } else {
    throw Error("Unsupported platform");
  }
}

export async function setInputSource(inputCode: InputCode) {
  if (platform() === "darwin") {
    await setInputSourceOsx(inputCode);
  } else {
    throw Error("Unsupported platform");
  }
}
