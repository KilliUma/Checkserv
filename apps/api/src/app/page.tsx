export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>🧪 WearCheck API</h1>
      <p>Backend API for WearCheck Online System</p>
      
      <h2>Available Endpoints:</h2>
      <ul>
        <li><code>GET /api/health</code> - Health check</li>
        <li><code>GET /api/v1/samples</code> - List samples</li>
        <li><code>POST /api/v1/samples</code> - Create sample</li>
        <li><code>GET /api/v1/samples/[id]</code> - Get sample details</li>
        <li><code>GET /api/v1/reports</code> - List reports</li>
        <li><code>GET /api/v1/equipment</code> - List equipment</li>
        <li><code>POST /api/v1/equipment</code> - Create equipment</li>
      </ul>
      
      <p style={{ marginTop: '2rem', color: '#666' }}>
        Version: 1.0.0 | Environment: {process.env.NODE_ENV}
      </p>
    </main>
  )
}
