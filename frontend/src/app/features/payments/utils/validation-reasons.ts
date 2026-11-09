import { VALIDATION_REASONS } from '../config/validation-reasons';
export function validationReasonLabel(code: string): string {
  return Object.prototype.hasOwnProperty.call(VALIDATION_REASONS, code)
    ? VALIDATION_REASONS[code as keyof typeof VALIDATION_REASONS]
    : `System zwrócił kod odrzucenia: ${code}`;
}
