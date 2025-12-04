import app from './app.ts';
import dotenv from 'dotenv';
import { connectDB } from './services/dbService.ts';

dotenv.config();

const PORT = process.env.PORT || 8080;

connectDB();

app.listen(PORT, () => {
  console.log(`🚀 EpiGimp server running on http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
});
