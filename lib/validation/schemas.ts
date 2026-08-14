import { z } from 'zod';

export const checkoutSchema = z.object({
  fullName: z.string().min(3, 'Nome completo deve ter pelo menos 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  cpf: z.string().min(11, 'CPF deve ter 11 dígitos').max(14),
  phone: z.string().min(10, 'Telefone inválido'),
  cep: z.string().min(8, 'CEP deve ter 8 dígitos'),
  street: z.string().min(3, 'Rua é obrigatória'),
  number: z.string().min(1, 'Número é obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, 'Bairro é obrigatório'),
  city: z.string().min(2, 'Cidade é obrigatória'),
  state: z.string().length(2, 'Estado (UF) deve ter 2 letras'),
  shippingMethod: z.enum(['normal', 'express']),
  paymentMethod: z.enum(['pix', 'credit_card']),
  cardToken: z.string().optional(),
  installments: z.number().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export const registerSchema = z.object({
  fullName: z.string().min(3, 'Nome completo é obrigatório'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'Confirmação de senha é obrigatória'),
  cpf: z.string().optional(),
  phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

export const productSchema = z.object({
  name: z.string().min(3, 'Nome é obrigatório'),
  brand_id: z.string().uuid('Marca inválida'),
  category_id: z.string().uuid('Categoria inválida'),
  description: z.string().min(10, 'Descrição é obrigatória'),
  sku: z.string().min(3, 'SKU é obrigatório'),
  price: z.number().positive('Preço deve ser maior que zero'),
  compare_at_price: z.number().positive().optional(),
  gender: z.enum(['unisex', 'masculino', 'feminino', 'infantil']),
  sport: z.string().optional(),
  featured: z.boolean().default(false),
  is_new: z.boolean().default(false),
  is_sale: z.boolean().default(false),
});
