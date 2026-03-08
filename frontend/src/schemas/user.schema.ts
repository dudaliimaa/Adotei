import { z } from 'zod';
import { cpf } from 'cpf-cnpj-validator';

// ─── Sub-schema: endereço ─────────────────────────────────────────────────────

export const addressSchema = z.object({
  street: z.string().min(1, 'Rua obrigatória'),
  number: z.string().min(1, 'Número obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, 'Bairro obrigatório'),
  city: z.string().min(1, 'Cidade obrigatória'),
  state: z
    .string()
    .length(2, 'Use a sigla do estado (ex: SP)')
    .toUpperCase(),
  zipCode: z
    .string()
    .regex(/^\d{8}$/, 'CEP inválido — informe 8 dígitos numéricos'),
});

// ─── Schema principal: cadastro de usuário ────────────────────────────────────

export const userSchema = z.object({
  fullName: z
    .string()
    .min(3, 'Nome deve ter ao menos 3 caracteres'),

  email: z
    .string()
    .email('E-mail inválido'),

  password: z
    .string()
    .min(6, 'Senha deve ter ao menos 6 caracteres'),

  cpf: z
    .string()
    .min(1, 'CPF obrigatório')
    .refine((val) => cpf.isValid(val), 'CPF inválido'),

  phone: z
    .string()
    .min(10, 'Telefone deve ter DDD + número (mín. 10 dígitos)')
    .regex(/^\d+$/, 'Telefone deve conter apenas dígitos'),

  address: addressSchema,
});

// ─── Schema: login ────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Senha obrigatória'),
});

// ─── Tipos inferidos ──────────────────────────────────────────────────────────

export type UserFormData = z.infer<typeof userSchema>;
export type AddressFormData = z.infer<typeof addressSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
