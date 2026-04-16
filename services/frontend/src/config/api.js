// Nếu chạy trên Vercel, nó sẽ lấy link Render. Nếu chạy ở máy (Local), nó dùng localhost:8000
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';