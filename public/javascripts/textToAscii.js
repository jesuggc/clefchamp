const asciiNumbers = {
  '0': [

      " ▄▄▄▄ ",
      "█    █",
      "█ ▀▀ █",
      "█▄▄▄█"
  ],
  '1': [
      "  █  ",
      "  █  ",
      "  █  ",
      "  █  "
  ],
  '2': [
      " ▄▄▄▄ ",
      "    █ ",
      " ▀▀▀█ ",
      " ▄▄▄█ "
  ],
  '3': [
      " ▄▄▄▄ ",
      "    █ ",
      " ▀▀▀█ ",
      " ▄▄▄█ "
  ],
  '4': [
      "█  █  ",
      "█  █  ",
      "▀▀▀█ ",
      "   █  "
  ],
  '5': [
      " ▄▄▄▄ ",
      "█     ",
      "▀▀▀█ ",
      "▄▄▄█ "
  ],
  '6': [
      " ▄▄▄▄ ",
      "█     ",
      "█▀▀█ ",
      "█▄▄█ "
  ],
  '7': [
      " ▄▄▄▄ ",
      "    █ ",
      "   █  ",
      "  █   "
  ],
  '8': [
      " ▄▄▄▄ ",
      "█▀▀█ █",
      "█▄▄█ █",
      " ▀▀▀▀ "
  ],
  '9': [
    "▄▄▄▄", 
    "█  █", 
    "▀▀▀█",
    "▄▄▄█"
  ]
};

function textToAscii(text) {
  let lines = ["", "", "", ""];
  for (let char of text) {
      if (asciiNumbers[char]) {
          for (let i = 0; i < 4; i++) {
              lines[i] += asciiNumbers[char] [i] + " ";
          }
      }
  }
  return lines.join("\n");
}

const input = "0123456789";
console.log(textToAscii(input));
