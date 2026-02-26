import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"
import { randomUUID } from "crypto"



// ==============================
// TIPOS DE RESULTADO DE SERVIÇO
// ==============================

// Tipo de resultado genérico para serviços, com sucesso ou erro
type ServiceSuccess<T> = {
  success: true
  data: T
}

// Tipo de erro genérico para serviços, com mensagem de erro
type ServiceError = {
  success: false
  error: string
}

export type ServiceResult<T> = ServiceSuccess<T> | ServiceError

// ==============================
// REGISTRO
// ==============================

// Serviço para registrar um novo usuário, com verificação de email
export async function registerUserService(params: {
  name: string
  email: string
  password: string
}): Promise<ServiceResult<{ verificationToken: string }>> {
  const { name, email, password } = params

  // Verificar se email já existe
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })


  // Segurança: não revelar se email existe, mas para fins de demonstração, retornamos erro específico
  if (existingUser) {
    return { success: false, error: "EMAIL_ALREADY_EXISTS" }
  }

  const hashedPassword = await bcrypt.hash(password, 10)


  // Criar usuário e token de verificação
  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: hashedPassword,
    },
  })

  // Gerar token de verificação e salvar no banco
  const token = randomUUID()

  await prisma.verificationToken.create({
    data: {
      token,
      userId: user.id,
    },
  })

  return {
    success: true,
    data: { verificationToken: token },
  }
}

// ==============================
// AUTENTICAÇÃO
// ==============================

// Serviço para autenticar usuário, com verificação de email e bloqueio de conta
export async function authenticateUserService(
  email: string,
  password: string
): Promise<
  ServiceResult<{
    id: string
    name: string
    email: string
  }>
> {
  const user = await prisma.user.findUnique({
    where: { email },
  })

  // Se: Credenciais inválidas
  if (!user) {
    return { success: false, error: "INVALID_CREDENTIALS" }
  }

  // Se: Conta bloqueada
  if (user.lockUntil && user.lockUntil > new Date()) {
    return { success: false, error: "ACCOUNT_LOCKED" }
  }

  // Se: Email não verificado
  if (!user.emailVerified) {
    return { success: false, error: "EMAIL_NOT_VERIFIED" }
  }

  // Se: Usuário sem senha (OAuth futuro)
  if (!user.passwordHash) {
    return { success: false, error: "NO_PASSWORD_SET" }
  }

  const passwordMatch = await bcrypt.compare(
    password,
    user.passwordHash
  )

  // Se: Senha é incorreta
  if (!passwordMatch) {
    // Aguarda: Incrementação de tentativa de login
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: {
          increment: 1,
        },
      },
    })

    //Retorna: Erro genérico para evitar enumeração de contas
    return { success: false, error: "INVALID_CREDENTIALS" }
  }

  // Aguarda: Resetar tentativas de login e desbloquear conta
  await prisma.user.update({
    where: { id: user.id },
    data: {
      failedLoginAttempts: 0,
      lockUntil: null,
    },
  })

  // Retorna: Dados do usuário autenticado
  return {
    success: true,
    data: {
      id: user.id,
      name: user.name ?? "",
      email: user.email,
    },
  }
}

// ==============================
// VERIFICAR EMAIL
// ==============================

// Serviço para verificar email do usuário usando token
export async function verifyEmailService(
  token: string
): Promise<ServiceResult<null>> {
  const verification = await prisma.verificationToken.findUnique({
    where: { token },
  })

  // Se: Token é inválido
  if (!verification) {
    return { success: false, error: "INVALID_TOKEN" }
  }

  // Aguarda: Marcação email como verificado
  await prisma.user.update({
    where: { id: verification.userId },
    data: { emailVerified: true },
  })

  // Aguarda: Deletar token de verificação
  await prisma.verificationToken.delete({
    where: { token },
  })

  // Retornar sucesso
  return { success: true, data: null }
}

// ==============================
// CREAR RESET DE TOKEN
// ==============================

// Exporta: Serviço para criar token de reset de senha, sem revelar se email existe
export async function createPasswordResetService(
  email: string
): Promise<ServiceResult<{ resetToken?: string }>> {
  const user = await prisma.user.findUnique({
    where: { email },
  })

  // Se: Usuário não existe, retornar sucesso genérico para segurança
  if (!user) {
    return { success: true, data: {} }
  }

  const token = randomUUID()

  // Aguarda: Criar token de reset no banco
  await prisma.passwordResetToken.create({
    data: {
      token,
      userId: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60), // 1h
    },
  })

  // Retorna: Token de reset (em produção, enviar por email)
  return {
    success: true,
    data: { resetToken: token },
  }
}


// ==============================
// RESETAR SENHA
// ==============================

// Serviço para resetar senha usando token de reset, com validação de token e segurança
export async function resetPasswordService(
  token: string,
  newPassword: string
): Promise<ServiceResult<null>> {
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  })

  // Se: Token é inválido OU expirado
  if (!resetToken || resetToken.expiresAt < new Date()) {
    return { success: false, error: "INVALID_OR_EXPIRED_TOKEN" }
  }

  const hashed = await bcrypt.hash(newPassword, 10)

  // Aguarda: Atualização de senha do usuário
  await prisma.user.update({
    where: { id: resetToken.userId },
    data: { passwordHash: hashed },
  })
  
  // Aguarda: Deletar token de reset
  await prisma.passwordResetToken.delete({
    where: { token },
  })
  
  // Retornar sucesso
  return { success: true, data: null }
}