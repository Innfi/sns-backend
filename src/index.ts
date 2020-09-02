import express from 'express';


const express1 = express();

express1.listen(3000, () => {
    console.log('starting point');
});

express1.get('/', (req: express.Request, res: express.Response) => {
    res.send('initial response');
});