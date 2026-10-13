(() => {
  'use strict';
  const halfWidth = 0.68;
  // theta parametrizes RP¹ once over 180 degrees; phi parametrizes the
  // central circle once over 2π. surface(theta+180,t)=surface(theta,-t).
  function surface(theta, t) {
    const phi = theta * Math.PI / 90;
    const radius = 1.55 + t * Math.cos(phi / 2);
    return [radius * Math.cos(phi), radius * Math.sin(phi), t * Math.sin(phi / 2)];
  }
  function point(theta, rho) { return surface(theta, halfWidth * Math.tanh(rho)); }
  function representative(theta, rho) {
    const turns = Math.floor(theta / 180);
    return {theta:theta - turns * 180, rho:turns % 2 === 0 ? rho : -rho};
  }
  window.AxisBlowupGeometry = Object.freeze({halfWidth, surface, point, representative});
})();
