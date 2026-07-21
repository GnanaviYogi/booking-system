export default function Unauthorized() {
  return (
    <div
      style={{
        color: "white",
        textAlign: "center",
        marginTop: "100px",
      }}
    >
      <h1>403 - Unauthorized</h1>

      <p>
        You do not have permission to
        access this page.
      </p>
    </div>
  );
}