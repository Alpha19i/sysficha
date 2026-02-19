function mostrarCarregamento(texto) {
  const overlay = document.createElement('div');
  overlay.id = 'loading-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  `;
  
  overlay.innerHTML = `
    <div style="background: white; padding: 30px; border-radius: 8px; text-align: center;">
      <div style="width: 40px; height: 40px; border: 4px solid #f3f3f3; 
                  border-top: 4px solid #3498db; border-radius: 50%; 
                  animation: spin 1s linear infinite; margin: 0 auto 15px;">
      </div>
      <p style="margin: 0; font-size: 16px; color: #333;">${texto}</p>
    </div>
  `;

  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
  
  document.body.appendChild(overlay);
  return overlay;
}

function esconderCarregamento(loader) {
  if (loader && loader.parentNode) {
    loader.remove();
  }
}

function mostrarErro(mensagem) {
  alert(`❌ ${mensagem}`);
}

function mostrarSucesso(mensagem) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #4CAF50;
    color: white;
    padding: 15px 20px;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
  `;
  notification.textContent = `✓ ${mensagem}`;
  
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideIn 0.3s ease-out reverse';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}