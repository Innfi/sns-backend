import { Container } from 'typedi';

import SnsApp from './app';

const app = Container.get(SnsApp);

app.start();
