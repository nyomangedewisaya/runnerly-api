/**
 * @param {Date} dateObject 
 * @returns {string} 
 */
export function formatDuration(dateObject) {
  if (!dateObject || !(dateObject instanceof Date)) {
    return "00:00:00";
  }
  const hours = String(dateObject.getUTCHours()).padStart(2, '0');
  const minutes = String(dateObject.getUTCMinutes()).padStart(2, '0');
  const seconds = String(dateObject.getUTCSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

/**
 * @param {number} totalMilliseconds 
 * @returns {string}
 */
export function formatTotalDuration(totalMilliseconds) {
    if (isNaN(totalMilliseconds) || totalMilliseconds < 0) {
        return "00:00:00";
    }
    const totalSeconds = Math.floor(totalMilliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}