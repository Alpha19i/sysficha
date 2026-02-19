"use client";

export default function FormSection() {
  return (
    <>
      <form
        id="formulario"
        onSubmit={(event) => {
          event.preventDefault();
          if (typeof window !== "undefined" && window.gerarFicha) {
            window.gerarFicha();
          }
        }}
      >
        <div id="form-content" />

        <div className="botoes">
          <button type="button" id="btnAnterior" disabled>
            Anterior
          </button>
          <button type="button" id="btnProximo">
            Proximo
          </button>
        </div>

        <div className="line" style={{ marginTop: "20px", gap: "10px" }}>
          <label className="f2">
            Adicionar backup JSON
            <br />
            <input type="file" id="inputArquivoJSON" className="file" accept=".json" />
          </label>
          <button
            type="button"
            id="btnLimpar"
            style={{
              backgroundColor: "#dc3545",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Limpar Tudo
          </button>
        </div>
      </form>
      <hr />
    </>
  );
}
