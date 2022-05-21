/**
 * Convierte una string del tipo "00:00:00 | 00:00:00" a segundos en numeros
 * @param duration String Duracion de cada cancion.
 * @returns Resultado de la @method convertSegToHourMinSeg
 */
export const convertStringHourToNumberSeg = (duration: string) => {
  let totalDuration = 0;
  const durationSongs = duration.split("|");
  durationSongs.splice(durationSongs.length - 1, 1);
  console.log("Duracion de las canciones: ", durationSongs);

  durationSongs.forEach((durationSong) => {
    const partdurationSong = durationSong.split(":");
    totalDuration +=
      parseInt(partdurationSong[0]) * 3600 +
      parseInt(partdurationSong[1]) * 60 +
      parseInt(partdurationSong[2]);
  });

  return convertSegToHourMinSeg(totalDuration);
};

/**
 * Convierte de segundos a 00:00:00
 * @param duration Number Segundos
 * @returns String 00:00:00
 */
export const convertSegToHourMinSeg = (duration: number) => {
  let hour: number | string = parseInt((duration / 3600).toFixed(0));
  let min: number | string = parseInt((duration / 60).toFixed(0)) - 1;
  let seg: number | string = duration % 60;
  if (hour < 10 && hour >= 0) {
    hour = "0" + hour;
  }
  if (min < 10 && min >= 0) {
    min = "0" + min;
  }
  if (seg < 10 && seg >= 0) {
    seg = "0" + seg;
  }

  return `${hour}:${min}:${seg}`;
};