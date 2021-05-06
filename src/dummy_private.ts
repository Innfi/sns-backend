import express from 'express';
import passport from 'passport';


const tempRouter = express.Router();

tempRouter.get('/', 
    passport.authenticate('jwt', {
        session: false,
        failureRedirect: '/error'
    }),
    (req: express.Request, res: express.Response) => {
        res.status(200)
        .send({
            msg: 'entered private route successfully',
            date: new Date()
        })
        .end();
    });

export default tempRouter;