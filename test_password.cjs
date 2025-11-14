const bcrypt = require('bcryptjs');

// Testar hash
const hash = '$2a$10$iru54wPZF.u0rLJwXIC.genmR/hbU9HwF/AA54DIjLOQ8VZG1LkUm';
const password = 'password';

console.log('Testando senha:');
console.log('Hash:', hash);
console.log('Senha:', password);
console.log('Validação:', bcrypt.compareSync(password, hash));

// Gerar novo hash se necessário
console.log('\nNovo hash:');
console.log(bcrypt.hashSync('password', 10));