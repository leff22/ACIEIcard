// Consultar dados do Supabase
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function consultarDados() {
  console.log('📊 Consultando dados do Supabase...\n');
  
  // Administradores
  const { data: admins, error: adminError } = await supabase
    .from('administradores')
    .select('id, nome, email, status')
    .eq('status', 'ativo');
  
  console.log('👥 Administradores ativos:', admins?.length || 0);
  admins?.forEach(admin => {
    console.log(`  - ${admin.nome} (${admin.email})`);
  });
  
  // Empresas
  const { data: empresas, error: empError } = await supabase
    .from('empresas')
    .select('id, razao_social, cnpj, status')
    .eq('status', 'ativo');
  
  console.log('\n🏢 Empresas ativas:', empresas?.length || 0);
  empresas?.forEach(empresa => {
    console.log(`  - ${empresa.razao_social} (${empresa.cnpj})`);
  });
  
  // Beneficiarios
  const { data: beneficiarios, error: benError } = await supabase
    .from('beneficiarios')
    .select('id, nome, cpf, status')
    .eq('status', 'ativo');
  
  console.log('\n👤 Beneficiários ativos:', beneficiarios?.length || 0);
  beneficiarios?.forEach(beneficiario => {
    console.log(`  - ${beneficiario.nome} (${beneficiario.cpf})`);
  });
  
  // Conveniados
  const { data: conveniados, error: convError } = await supabase
    .from('conveniados')
    .select('id, razao_social, cnpj, status')
    .eq('status', 'ativo');
  
  console.log('\n🏪 Conveniados ativos:', conveniados?.length || 0);
  conveniados?.forEach(conveniado => {
    console.log(`  - ${conveniado.razao_social} (${conveniado.cnpj})`);
  });
}

consultarDados().catch(console.error);