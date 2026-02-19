function handleFotoChange(event) {
  if (event.target.id !== "foto") return;
  
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    mostrarErro('Por favor, selecione uma imagem válida.');
    return;
  }
  
  const reader = new FileReader();
  
  reader.onload = (e) => {
    DOM.fotoPerfil.src = e.target.result;
  };
  
  reader.onerror = () => {
    mostrarErro('Erro ao carregar imagem.');
  };
  
  reader.readAsDataURL(file);
}