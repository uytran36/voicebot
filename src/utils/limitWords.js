export default function limitWords(string = '', limitNum = 23, charSpread = '; ') {
  if (string.split(/[\s]+/).length > limitNum) {
    return `${string.split(/[\s]+/).slice(0, limitNum).join(charSpread)}...`;
  }
  return string.split(/[\s]+/).join(charSpread);
}
