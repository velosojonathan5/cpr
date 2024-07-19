export class FormatterUtil {
  static formatCNPJ(cnpj: string) {
    return cnpj.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      '$1.$2.$3/$4-$5',
    );
  }

  static formatCPF(cpf: string): string {
    return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
  }

  static formatPostalCode(postalCode: string) {
    return postalCode.replace(/^(\d{5})(\d{3})$/, '$1-$2');
  }

  static formatPhone(phone) {
    if (phone.length === 10) {
      return phone.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
    }
    return phone.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  }

  static formatDateBR(date: Date) {
    return date.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
  }

  static toNumberPTBR(
    value: number,
    maximumFractionDigits = 2,
    minimumFractionDigits = 2,
  ) {
    return value.toLocaleString('pt-BR', {
      maximumFractionDigits,
      minimumFractionDigits,
    });
  }
}
