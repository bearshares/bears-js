const bears = require('../lib');

/* Generate private active WIF */
const username = process.env.BEARS_USERNAME;
const password = process.env.BEARS_PASSWORD;
const privActiveWif = bears.auth.toWif(username, password, 'active');

/** Add posting key auth */
bears.broadcast.addKeyAuth({
    signingKey: privActiveWif,
    username,
    authorizedKey: 'SHR88CPfhCmeEzCnvC1Cjc3DNd1DTjkMcmihih8SSxmm4LBqRq5Y9',
    role: 'posting',
  },
  (err, result) => {
    console.log(err, result);
  }
);
