tsParticles
  .loadJSON("particleloader", "./particles.json")
  .then((container) => {
    console.log("callback - tsparticles config loaded");
  })
  .catch((error) => {
    console.error(error);
  });
