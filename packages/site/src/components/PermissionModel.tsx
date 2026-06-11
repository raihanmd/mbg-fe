const PermissionModel = () => (
  <section className="section permission-section">
    <div className="container permission-grid">
      <div className="permission-copy">
        <p className="eyebrow">Permission model</p>
        <h2>Permissioned execution, not autonomous wallet control.</h2>
        <p>
          The user grants bounded permissions. The backend can only execute
          approved actions inside that delegation scope. AI can suggest an
          execute or skip decision when a skill enables reasoning, but AI
          never signs transactions and never receives private keys.
        </p>
      </div>
      <div className="permission-columns">
        <article className="permission-box">
          <h3>What AI can do</h3>
          <ul>
            <li>Read skill context</li>
            <li>Consume optional x402 data</li>
            <li>Return execute / skip decision</li>
            <li>Provide a reason</li>
          </ul>
        </article>
        <article className="permission-box permission-box-muted">
          <h3>What AI cannot do</h3>
          <ul>
            <li>Access private keys</li>
            <li>Sign transactions</li>
            <li>Bypass delegation limits</li>
            <li>Execute outside approved scope</li>
          </ul>
        </article>
      </div>
    </div>
  </section>
);

export default PermissionModel;
