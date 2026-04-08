export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

export function isValidPassword(password: string, minLength: number = 8): boolean {
  if (password.length < minLength) return false
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
  return hasUppercase && hasLowercase && hasNumber && hasSpecial
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function isValidPhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '')
  return cleaned.length >= 10 && cleaned.length <= 15
}

export function validateRequired(value: unknown, fieldName: string): string | null {
  if (value === null || value === undefined || value === '') {
    return `${fieldName} is required`
  }
  return null
}

export function validateMinLength(value: string, min: number, fieldName: string): string | null {
  if (value.length < min) {
    return `${fieldName} must be at least ${min} characters`
  }
  return null
}

export function validateMaxLength(value: string, max: number, fieldName: string): string | null {
  if (value.length > max) {
    return `${fieldName} must be at most ${max} characters`
  }
  return null
}

export function validateRange(
  value: number,
  min: number,
  max: number,
  fieldName: string,
): string | null {
  if (value < min || value > max) {
    return `${fieldName} must be between ${min} and ${max}`
  }
  return null
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type)
}

export function validateFileSize(file: File, maxSizeBytes: number): boolean {
  return file.size <= maxSizeBytes
}
