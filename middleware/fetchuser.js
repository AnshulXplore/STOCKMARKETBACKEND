const jwt = require('jsonwebtoken');

const fetchuser = (req, res, next) => {
  const token = req.header('auth-token'); // ye auth-token header ka namke hai aapm apne accoriding bh rakh sakte ho
  if (!token) {
    return res.status(401).send('Invalid token, access denied, code 401');
  }
  const JWT_SECRET = "anshul";
  try {
    const tokenVerify = jwt.verify(token, JWT_SECRET);
    console.log('Decoded token:', tokenVerify);  // Debug log
    req.userData = tokenVerify;    // yeha par ye userId user ki id hai jo hum auth token main send kar rhe hai is name se auth token matlab auth-token name ke header main abhi tokenverify ek objkect hai is type ka userData{id:"bla bla"} ok agar hum ise aisa likh de tokenverify.userData tab ye Id ban jayegi ok id bole to "bla bla" kyuki humne id bla bla di na. aur is condition main hum seedha likhne req.Id theek agar jaisa li8kha hai vaise main hame object mil rha hai tab hum likhne req.userData.Id ok
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).send(error);
  }
};

module.exports = fetchuser;
