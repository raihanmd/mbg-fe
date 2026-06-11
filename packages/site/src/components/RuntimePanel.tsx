const RuntimePanel = () => (
  <aside className="runtime-panel" aria-label="Skill runtime preview">
    <div className="panel-header">
      <div>
        <p className="panel-kicker">Skill install</p>
        <h2>AI-Powered DCA</h2>
      </div>
      <span className="status-pill">active</span>
    </div>
    <div className="config-block">
      <div className="config-title">Permission</div>
      <dl className="config-list">
        <div>
          <dt>Scope</dt>
          <dd>USDC transfer limit</dd>
        </div>
        <div>
          <dt>Schedule</dt>
          <dd>weekly</dd>
        </div>
        <div>
          <dt>Max spend</dt>
          <dd>bounded</dd>
        </div>
        <div>
          <dt>Execution</dt>
          <dd>delegated</dd>
        </div>
        <div>
          <dt>AI</dt>
          <dd>reasoning only</dd>
        </div>
      </dl>
    </div>
    <div className="config-block">
      <div className="config-title">Runtime status</div>
      <div className="runtime-rows">
        <div>
          <span>User permission</span>
          <strong>active</strong>
        </div>
        <div>
          <span>AI decision</span>
          <strong>execute / skip</strong>
        </div>
        <div>
          <span>Backend executor</span>
          <strong>ready</strong>
        </div>
        <div>
          <span>Wallet signer</span>
          <strong>user-controlled</strong>
        </div>
      </div>
    </div>
    <div className="terminal-line">
      <span>runtime</span>
      <code>permission.check → decision → bounded.execution</code>
    </div>
  </aside>
);

export default RuntimePanel;
