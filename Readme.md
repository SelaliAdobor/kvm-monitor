# kvm-monitor: USB Hub - Monitor Sync

Monitors a USB switch and sends a monitor input change commands when the selected device changes

Allows a monitor to switch inputs in sync with USB switch

Currently only supports OS X, relies on a local install of https://github.com/kfix/ddcctl

# Example usage

    node build/index.js usbc dp 1507 1552

This invocation will monitor for a USB switch with the Vendor ID 1507, and the Product Id 1552, and switch to USB-C when the switch is present, and DisplayPort when the switch changes to another device.
