// Testar login com Supabase
const http = require('http');

function testLogin() {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      cpf_cnpj: '12345678901',
      senha: 'password',
      tipo_usuario: 'beneficiario'
    });

    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(responseData);
          if (res.statusCode === 200) {
            console.log('✅ Login bem-sucedido!');
            console.log('Token:', response.token);
            console.log('Usuário:', response.usuario);
            resolve(response);
          } else {
            console.error('❌ Erro no login:', response);
            reject(response);
          }
        } catch (error) {
          console.error('❌ Erro ao processar resposta:', responseData);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Erro na requisição:', error.message);
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

testLogin();