require('dotenv').config();

const throng = require('throng');
const getServer = require('./server');

const port = process.env.PORT || 3000;

throng({
	workers: 2,
	master: () => {
	  console.log('Starting master process');
	},
	start: async (id) => {
	  const app = await getServer();
	  app.listen(port, () => console.log(`Worker ${id} listening on port ${port}`))
	}
 });