const requiredInProduction = ['DATABASE_URL', 'DIRECT_URL', 'NEXTAUTH_SECRET', 'NEXTAUTH_URL']

function isProductionLike() {
  const value = (process.env.VERCEL_ENV || process.env.NODE_ENV || '').toLowerCase()
  return value === 'production' || value === 'preview'
}

function validateRequiredEnv() {
  if (!isProductionLike()) {
    console.log('[env-check] Ambiente local/dev detetado. Verificacao estrita ignorada.')
    return
  }

  const missing = requiredInProduction.filter((name) => {
    const value = process.env[name]
    return !value || value.trim().length === 0
  })

  if (missing.length > 0) {
    console.error('[env-check] Variaveis obrigatorias ausentes:')
    for (const name of missing) {
      console.error(`- ${name}`)
    }
    console.error('[env-check] Configure as variaveis no projeto apps/api da Vercel e refaca o deploy.')
    process.exit(1)
  }

  console.log('[env-check] Variaveis obrigatorias presentes para deploy/execucao.')
}

validateRequiredEnv()
