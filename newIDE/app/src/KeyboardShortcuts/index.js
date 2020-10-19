// @flow
import * as React from 'react';
import isDialogOpen from '../UI/OpenedDialogChecker';
import { isMacLike } from '../Utils/Platform';
import reservedShortcuts from './ReservedShortcuts';
import PreferencesContext from '../MainFrame/Preferences/PreferencesContext';
import commandsList, { type CommandName } from '../CommandPalette/CommandsList';
import isUserTyping from './IsUserTyping';
import defaultShortcuts, { type ShortcutMap } from './DefaultShortcuts';
import optionalRequire from '../Utils/OptionalRequire.js';
const electron = optionalRequire('electron');

// Valid action keys
type KeyType =
  | 'alphabet' // A-Z
  | 'number' // Numrow 0-9
  | 'fn-row' // F1-F12
  | 'numpad-arith' // Numpad+, Numpad-
  | 'numrow-arith' // Numrow-, Numrow=
  | 'other'; // Tab, Space

/**
 * Given a key code, gives the associated KeyType.
 * Returns null if the key code can't be categorised.
 */
const getKeyTypeFromCode = (code: string): KeyType | null => {
  if (code.indexOf('Key') === 0) return 'alphabet';
  if (code.indexOf('Digit') === 0) return 'number';
  if (code.indexOf('F') === 0) return 'fn-row';
  if (code === 'NumpadAdd' || code === 'NumpadSubtract') return 'numpad-arith';
  if (code === 'Equal' || code === 'Minus') return 'numrow-arith';
  if (code === 'Tab' || code === 'Space') return 'other';
  return null;
};

/**
 * Returns possibly partial shortcut string corresponding to given event object
 */
export const getShortcutStringFromEvent = (e: KeyboardEvent): string => {
  let shortcutString = '';
  if (e.ctrlKey || e.metaKey) shortcutString += 'CmdOrCtrl+';
  if (e.shiftKey) shortcutString += 'Shift+';
  if (e.altKey) shortcutString += 'Alt+';

  const keyType = getKeyTypeFromCode(e.code);
  if (keyType) shortcutString += e.code;
  return shortcutString;
};

/**
 * Checks if the given event corresponds to a valid shortcut press.
 * Does not check if shortcut is reserved or not.
 */
export const isValidShortcutEvent = (e: KeyboardEvent): boolean => {
  // Check if action key is a shortcut supported key
  const keyType = getKeyTypeFromCode(e.code);
  if (!keyType) return false;

  const ctrlOrCmdPressed = e.ctrlKey || e.metaKey;
  const altPressed = e.altKey;

  // Check keytype-specific restrictions
  if (keyType === 'other') {
    // Tab and Space may clash with keyboard navigation - Ctrl or Alt required
    if (!ctrlOrCmdPressed && !altPressed) return false;
  }

  return true;
};

/**
 * Extracts shortcut-related information from given event object
 */
export const getShortcutMetadataFromEvent = (
  e: KeyboardEvent
): {| shortcutString: string, isValid: boolean, invalidType?: string |} => {
  const shortcutString = getShortcutStringFromEvent(e);
  const isValidKey = isValidShortcutEvent(e);
  const isReserved = reservedShortcuts.includes(shortcutString);
  return { shortcutString, isValid: isValidKey && !isReserved };
};

/**
 * Patches default shortcuts set with user's custom shortcuts and
 * returns the full shortcut map obtained.
 */
export const useShortcutMap = (): ShortcutMap => {
  const preferences = React.useContext(PreferencesContext);
  const userShortcutMap = preferences.values.userShortcutMap;
  return { ...defaultShortcuts, ...userShortcutMap };
};

/**
 * Listens for keyboard shortcuts and launches
 * callback with corresponding command
 */
export const useKeyboardShortcuts = (onRunCommand: CommandName => void) => {
  const shortcutMap = useShortcutMap();

  React.useEffect(
    () => {
      const handler = (e: KeyboardEvent) => {
        // Extract shortcut from event object and check if it's valid
        const shortcutData = getShortcutMetadataFromEvent(e);
        if (!shortcutData.isValid) return;

        // Get corresponding command, if it exists
        const commandName = Object.keys(shortcutMap).find(
          name => shortcutMap[name] === shortcutData.shortcutString
        );
        if (!commandName) return;

        // On desktop app, ignore shortcuts that are handled by Electron
        if (electron && commandsList[commandName].handledByElectron) return;

        // e.preventDefault tends to block user from typing,
        // so do it only if user is not typing.
        if (isUserTyping()) return;
        e.preventDefault();

        // Discard shortcut presses if a dialog is open
        if (isDialogOpen()) return;

        onRunCommand(commandName);
      };

      document.addEventListener('keydown', handler);
      return () => document.removeEventListener('keydown', handler);
    },
    [onRunCommand, shortcutMap]
  );
};

/**
 * Converts an action key's e.code value to user-friendly string
 * For example, "KeyA" -> "A", "NumpadAdd" -> "Plus"
 */
const getKeyDisplayName = (code: string) => {
  const keyType = getKeyTypeFromCode(code);
  if (keyType === 'alphabet') return code.slice(3);
  if (keyType === 'number') return code.slice(5);
  if (keyType === 'fn-row') return code;
  if (keyType === 'numpad-arith') return code === 'NumpadAdd' ? 'Num+' : 'Num-';
  if (keyType === 'numrow-arith') return code === 'Minus' ? '-' : '=';
  return code; // Tab, Space
};

/**
 * Parses shortcut string into array of platform-specific key strings
 */
export const getShortcutDisplayName = (shortcutString: string) => {
  return shortcutString
    .split('+')
    .map<string>(keyCode => {
      if (keyCode === 'CmdOrCtrl') return isMacLike() ? 'Cmd' : 'Ctrl';
      if (keyCode === 'Shift' || keyCode === 'Alt') return keyCode;
      return getKeyDisplayName(keyCode);
    })
    .join(' + ');
};

/**
 * Takes key code and returns Electron string for the key
 */
const getElectronKeyString = (code: string) => {
  const keyType = getKeyTypeFromCode(code);
  if (keyType === 'alphabet') return code.slice(3);
  if (keyType === 'number') return code.slice(5);
  if (keyType === 'fn-row') return code;
  if (keyType === 'numpad-arith')
    return code === 'NumpadAdd' ? 'numadd' : 'numsub';
  if (keyType === 'numrow-arith') return code === 'Minus' ? '-' : '=';
  return code; // Tab, Space
};

/**
 * Converts given shortcut string into an Electron accelerator string
 */
export const getElectronAccelerator = (shortcutString: string) => {
  return shortcutString
    .split('+')
    .map<string>(keyCode => {
      if (keyCode === 'CmdOrCtrl') return 'CmdOrCtrl';
      if (keyCode === 'Shift' || keyCode === 'Alt') return keyCode;
      return getElectronKeyString(keyCode);
    })
    .join('+');
};
