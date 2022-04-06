import assert from 'assert';
import jwt from 'jsonwebtoken';

describe('jwt', () => {
  const jwtObject = { secret: 'notsosafesecret' };

  it('current: valid token ', () => {
    const token = jwt.sign({ email: 'innfi@test.com' }, jwtObject.secret, {
      expiresIn: '10m',
    });

    try {
      jwt.verify(token, jwtObject.secret);
    } catch (err: any) {
      assert.fail();
    }
  });

  it('current: expired token', () => {
    const token = jwt.sign(
      { email: 'innfi@test.com', iat: Math.floor(Date.now() / 1000) - 5000 },
      jwtObject.secret,
      { expiresIn: '2s' },
    );

    try {
      const decoded: string | object = jwt.verify(token, jwtObject.secret);
    } catch (err: any) {
      return;
    }

    assert.fail();
  });

  // it('current: check timestamp', () => {
  //   const gap: number = 5000;

  //   const futureToken = jwt.sign(
  //     { email: 'innfi@test.com', iat: Math.floor(Date.now() / 1000) + gap },
  //     jwtObject.secret,
  //     { expiresIn: '10m' },
  //   );
  //   const currentToken = jwt.sign(
  //     { email: 'innfi@test.com' },
  //     jwtObject.secret,
  //     { expiresIn: '10m' },
  //   );

  //   const futureDecoded: object = jwt.verify(
  //     futureToken,
  //     jwtObject.secret,
  //   ) as object;
  //   const currentDecoded: object = jwt.verify(
  //     currentToken,
  //     jwtObject.secret,
  //   ) as object;

  //   assert.strictEqual(futureDecoded['iat'] - currentDecoded['iat'], gap);
  // });
});
