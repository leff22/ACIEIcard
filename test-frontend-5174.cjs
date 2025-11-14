// Testar conexão frontend-backend na porta correta
const http = require('http');

function testFrontendConnection() {
  return new Promise((resolve, reject) => {
    // Testar através do proxy do frontend (porta 5174)
    const data = JSON.stringify({
      cpf_cnpj: 'admin@aciei.com.br',
      senha: 'password',
      tipo_usuario: 'admin'
    });

    const options = {
      hostname: 'localhost',
      port: 5174, // Porta correta do frontend
      path: '/api/auth/login', // Proxy para backend
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    console.log('🧪 Testando conexão frontend-backend...');
    console.log(`📡 Requisição: ${options.method} ${options.hostname}:${options.port}${options.path}`);

    const req = http.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        console.log(`📊 Status: ${res.statusCode}`);
        console.log(`📦 Resposta: ${responseData}`);
        
        if (res.statusCode === 200) {
          try {
            const response = JSON.parse(responseData);
            console.log('✅ Conexão bem-sucedida!');
            console.log('Token:', response.token);
            resolve(response);
          } catch (error) {
            console.error('❌ Erro ao processar JSON:', error.message);
            reject(error);
          }
        } else {
          console.error('❌ Erro na conexão:', responseData);
          reject(responseData);
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

testFrontendConnection().catch(console.error);