export type Language = 'en' | 'am' | 'om';

export interface Translations {
  title: string;
  model: string;
  baseSelect: string;
  inputValue: string;
  readyInput: string;
  signal: string;
  power: string;
  activeOutput: string;
  decimal: string;
  binary: string;
  octal: string;
  hexadecimal: string;
  octToHex: string;
  octToDec: string;
  sysLog: string;
  status: string;
  copied: string;
  copy: string;
  copyAll: string;
  copyAllSuccess: string;
  reset: string;
  online: string;
  stable: string;
  error: string;
  checksum: string;
  interrupt: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    title: "Universal System Converter",
    model: "Model: Unit-X | Core: V1.0.42",
    baseSelect: "Base Select",
    inputValue: "Input Value",
    readyInput: "READY_INPUT...",
    signal: "Signal",
    power: "Power",
    activeOutput: "Active Output Trace",
    decimal: "Decimal Result",
    binary: "Binary Matrix",
    octal: "Octal Matrix",
    hexadecimal: "Hexadecimal Trace",
    octToHex: "Oct ➔ Hex Bridge",
    octToDec: "Oct ➔ Dec Bridge",
    sysLog: "System Log / Bit-Trace Analytics",
    status: "Status",
    copied: "Copied",
    copy: "Copy",
    copyAll: "Copy All Results",
    copyAllSuccess: "All Traces Copied",
    reset: "Reset",
    online: "Online",
    stable: "Stable",
    error: "Error",
    checksum: "Checksum verified",
    interrupt: "Trace interrupt"
  },
  am: {
    title: "ሁለንተናዊ የቁጥር ስርዓት መቀየሪያ",
    model: "ሞዴል: ዩኒት-X | ኮር: V1.0.42",
    baseSelect: "መነሻ ምረጥ",
    inputValue: "የመግቢያ እሴት",
    readyInput: "እሴት ያስገቡ...",
    signal: "ሲግናል",
    power: "ኃይል",
    activeOutput: "ንቁ የውጤት ፍለጋ",
    decimal: "የአስርዮሽ ውጤት",
    binary: "የሁለትዮሽ ውጤት",
    octal: "የስምንትዮሽ ውጤት",
    hexadecimal: "የአስራ ስድስትዮሽ ውጤት",
    octToHex: "ስምንትዮሽ ➔ አስራ ስድስትዮሽ",
    octToDec: "ስምንትዮሽ ➔ አስርዮሽ",
    sysLog: "የስርዓት ምዝግብ ማስታወሻ",
    status: "ሁኔታ",
    copied: "ተገልብጧል",
    copy: "ገልብጥ",
    copyAll: "ሁሉንም ገልብጥ",
    copyAllSuccess: "ሁሉም ተገልብጠዋል",
    reset: "አፅዳ",
    online: "ኦንላይን",
    stable: "የተስተካከለ",
    error: "ስህተት",
    checksum: "ተረጋግጧል",
    interrupt: "ተቋርጧል"
  },
  om: {
    title: "Jijjiiraa Sirna Lakkoofsaa",
    model: "Moodela: Unit-X | Core: V1.0.42",
    baseSelect: "Baasii Filadhu",
    inputValue: "Gatii Galchii",
    readyInput: "Gatii Galchi...",
    signal: "Siingalii",
    power: "Humna",
    activeOutput: "Hordoffii Bu'aa",
    decimal: "Bu'aa Deasimaalii",
    binary: "Bu'aa Baayinariii",
    octal: "Bu'aa Oktaalii",
    hexadecimal: "Bu'aa Heeksadeasimaalii",
    octToHex: "Oktaalii ➔ Heeksa",
    octToDec: "Oktaalii ➔ Deasimaalii",
    sysLog: "Logii Sirnaa",
    status: "Haala",
    copied: "Garagalchameera",
    copy: "Garagalchi",
    copyAll: "Hunda Garagalchi",
    copyAllSuccess: "Hundi Garagalchameera",
    reset: "Haqi",
    online: "Toora Irra",
    stable: "Tasgabbaa'aa",
    error: "Dogoggora",
    checksum: "Mirkanaa'eera",
    interrupt: "Addaan Citeera"
  }
};
