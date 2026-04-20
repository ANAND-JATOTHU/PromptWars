import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import StadiumMap from './components/StadiumMap';
import './index.css';

// Identify the backend server URL. In production/Docker, it's served on the same origin.
// In dev Vite, it will connect to localhost:8080.
const SOCKET_URL = import.meta.env.PROD ? '/' : 'http://localhost:8080';

let socket: Socket;

function App() {
  const [stadiumState, setStadiumState] = useState<Record<string, any>>({});
  const [activityLog, setActivityLog] = useState<any[]>([]);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState<string | null>(null);

  useEffect(() => {
    socket = io(SOCKET_URL);

    socket.on('initialState', (data) => {
      setStadiumState(data.stadiumState);
      setActivityLog(data.activityLog || []);
    });

    socket.on('stateUpdate', (data) => {
      setStadiumState(data.stadiumState);
      setActivityLog(data.activityLog || []);
    });
    
    socket.on('announcement', (msg) => {
      setAnnouncement(msg);
      setTimeout(() => setAnnouncement(null), 8000);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleZoneClick = (zoneId: string) => {
    setSelectedZone(zoneId);
  };

  const reportStatus = (status: string) => {
    if (selectedZone && socket) {
      socket.emit('reportIssue', { zoneId: selectedZone, status });
      setSelectedZone(null);
    }
  };

  const triggerAnnouncement = () => {
    const msg = window.prompt("Enter a global staff announcement to broadcast:");
    if (msg && socket) {
      socket.emit('sendAnnouncement', msg);
    }
  };

  return (
    <>
      {announcement && (
        <div className="global-announcement">
          <span className="blink-icon">⚠️</span> STAFF ALERT: {announcement}
        </div>
      )}

      <header className="glass-panel app-header">
        <div className="title-container">
          <h1>VenueFlow.</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Live Crowd Management</p>
        </div>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center'}}>
          <button className="btn btn-announce" onClick={triggerAnnouncement}>
            📢 Send Broadcast
          </button>
          <div className="pulse-indicator">
            <div className="pulse-dot"></div>
            Live Sync Active
          </div>
        </div>
      </header>

      <div className="dashboard">
        <div className="glass-panel map-container">
          <StadiumMap stadiumState={stadiumState} onZoneClick={handleZoneClick} />
        </div>

        <div className="glass-panel side-panel">
          <div className="panel-header">FanFlare Live Feed</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Click on any zone in the map to report an event or update the crowd status.
          </p>
          <div className="zone-list">
            {Object.values(stadiumState).map((zone) => (
              <div key={zone.id} className="zone-item">
                <span style={{ fontWeight: 600 }}>{zone.name}</span>
                <span className={`text-${zone.status}`} style={{ textTransform: 'capitalize', fontWeight: 800 }}>
                  {zone.status}
                </span>
              </div>
            ))}
          </div>
          <div className="panel-header" style={{marginTop: '1rem'}}>Live Activity Feed</div>
          <div className="activity-feed">
             {activityLog.length === 0 && <span style={{color: 'var(--text-secondary)'}}>No recent activity...</span>}
             {activityLog.map((log) => (
               <div key={log.id} className="feed-item">
                 <div className="feed-time">{log.time}</div>
                 <div className="feed-content">
                   <strong>{log.zoneName}</strong> reported as <span className={`text-${log.status}`}>{log.status}</span>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>

      {selectedZone && (
        <div className="modal-overlay" onClick={() => setSelectedZone(null)}>
          <div className="glass-panel modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Update Status</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Reporting for: <strong style={{ color: 'white' }}>{stadiumState[selectedZone]?.name}</strong>
            </p>
            <div className="status-buttons">
              <button className="btn btn-clear" onClick={() => reportStatus('clear')}>All Clear</button>
              <button className="btn btn-busy" onClick={() => reportStatus('busy')}>Busy / Bottleneck</button>
              <button className="btn btn-incident" onClick={() => reportStatus('incident')}>Incident / Hazard</button>
              <button className="btn btn-close" onClick={() => setSelectedZone(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
