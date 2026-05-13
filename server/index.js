import { app } from './app.js';

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Marketing Ops Hub API running on http://localhost:${port}`);
});
