const express = require('express');
const path = require('path');
require('dotenv').config();
const app = express();
// Serve static files from the project directory
app.use(express.static(path.join(__dirname)));
// Expose environment variables to the client-side
app.get('/env.js', (req, res) => {
const envData = {
    ALCHEMY_MAIN : process.env.ALCHEMY_MAIN,
    ALCHEMY_SEPOLIA : process.env.ALCHEMY_SEPOLIA,
    ALCHEMY_OPTIMISM : process.env.ALCHEMY_OPTIMISM,
    ALCHEMY_BASE : process.env.ALCHEMY_BASE,
    ALCHEMY_ARBITRUM : process.env.ALCHEMY_ARBITRUM,
};
res.setHeader('Content-Type', 'application/javascript');
res.send(`window.ENV = ${JSON.stringify(envData)}`);
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
console.log(`Server is running on port ${port}`);
});