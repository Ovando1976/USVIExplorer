const { createApp } = require('./app');

const PORT = Number(process.env.PORT || 8787);
const app = createApp();

app.listen(PORT, () => {
  console.log(`USVI Explorer API listening on ${PORT}`);
});
