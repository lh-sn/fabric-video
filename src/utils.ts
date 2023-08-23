export function formatTime(milliseconds: number) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const millisecondsPart = Math.floor((milliseconds % 1000) / 10);

  const formattedTime = `${appendZero(minutes)}:${appendZero(
    seconds
  )}:${appendZero(millisecondsPart, 2)}`;
  return formattedTime;
}

function appendZero(value: number, minDigits: number = 2) {
  return value.toString().padStart(minDigits, "0");
}
