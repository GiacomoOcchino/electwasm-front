import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
        backgroundColor: "#f8f9fa",
        color: "#212529",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Accesso Negato</h1>
      <p style={{ marginBottom: "2rem" }}>
        Non sei autenticato per accedere a questa pagina. Per favore effettua l'accesso o torna alla
        <strong> home</strong>.
      </p>
      <Link
        href="/"
        style={{
          padding: "10px 20px",
          backgroundColor: "#0070f3",
          color: "#fff",
          textDecoration: "none",
          borderRadius: "5px",
          fontWeight: "bold",
        }}
      >
        Torna alla Home
      </Link>
    </main>
  );
}
