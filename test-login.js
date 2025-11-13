// Script de teste para verificar login de empresas e conveniados
const testLogin = async () => {
  console.log('🧪 Testando login de empresa...');
  
  try {
    const empresaResponse = await fetch('http://localhost:3002/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cpf_cnpj: '12345678000195',
        senha: 'admin123',
        tipo_usuario: 'empresa'
      })
    });

    const empresaData = await empresaResponse.json();
    console.log('✅ Login empresa:', empresaData.usuario.nome, '- Tipo:', empresaData.usuario.tipo);

    console.log('🧪 Testando login de conveniado...');
    
    const conveniadoResponse = await fetch('http://localhost:3002/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cpf_cnpj: '12345678000195',
        senha: 'admin123',
        tipo_usuario: 'conveniado'
      })
    });

    const conveniadoData = await conveniadoResponse.json();
    console.log('✅ Login conveniado:', conveniadoData.usuario.nome, '- Tipo:', conveniadoData.usuario.tipo);

    console.log('🎉 Testes concluídos com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro nos testes:', error);
  }
};

testLogin();