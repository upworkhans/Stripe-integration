import { useState } from 'react';
import { redactSecrets } from '@/lib/redact';

export function LogPanel() {
  const [logs, setLogs] = useState<string[]>([]);

  function addLog(entry: unknown) {
    const safe = typeof entry === 'string' ? entry : JSON.stringify(redactSecrets(entry), null, 2);
    setLogs((prev) => [safe, ...prev]);
  }

  return (
    <div className="bg-gray-900 text-gray-100 rounded-lg p-3 text-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="font-medium">Live Logs</div>
        <button
          type="button"
          className="text-xs text-gray-300 hover:text-white"
          onClick={() => setLogs([])}
        >
          Clear
        </button>
      </div>
      <div className="space-y-2 max-h-64 overflow-auto">
        {logs.length === 0 ? (
          <div className="text-gray-400">No logs yet</div>
        ) : (
          logs.map((l, idx) => (
            <pre key={idx} className="whitespace-pre-wrap break-words">
              {l}
            </pre>
          ))
        )}
      </div>
      {/* Expose control to parents via custom event */}
      <div className="hidden" data-log-api>
        {((window as any).addDemoLog = addLog) && null}
      </div>
    </div>
  );
}

