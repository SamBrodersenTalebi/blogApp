const http = require('http');
const express = require('express');
const app = express();
const cors = require('cors');

const mongoUrl = 'mongodb://localhost/bloglist';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(express.json());

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
