const CONFIG = {
  secoes: [
    "sections/pessoais.html",
    "sections/documentos.html",
    "sections/funcionais.html",
    "sections/dependentes.html",
    "sections/observacoes.html"
  ],
  
  camposContrato: [
    'nome', 'estado_civil', 'cpf', 'rg', 'endereco', 
    'bairro', 'cargo', 'lotacao', 'numero', 'carga_horaria', 'cidade'
  ],
  
  camposData: ['data_por_extenso', 'data_inicio', 'data_final'],
  
  pdfOptions: {
    margin: 0,
    image: { type: 'jpeg', quality: 0.92 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      logging: false,
      letterRendering: true
    },
    jsPDF: { 
      unit: "mm", 
      format: "a4", 
      orientation: "portrait",
      compress: true
    },
    pagebreak: { 
      mode: ['avoid-all', 'css'],
      before: '.pdf-page-break'
    }
  }
};