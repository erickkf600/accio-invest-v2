export const TimeUtils = {
  /**
   * Formata tempo (HH:MM:SS) para formato escrito arredondando horas
   * @param timeString String no formato HH:MM:SS
   * @returns String formatada (ex: "24h")
   */
  formatRoundedHours(timeString: string): string {
    try {
      if (!timeString || typeof timeString !== 'string') return '0h'

      const [h, m] = timeString.split(':').map(Number)

      // Arredondamento condicional
      const hours = m > 30 ? h + 1 : h

      return `${hours}h`
    } catch {
      return '0h'
    }
  },

  /**
   * Versão alternativa que retorna objeto com detalhes
   * @param timeString String no formato HH:MM:SS
   * @returns { hours: number, text: string }
   */
  getDetailedTime(timeString: string): { hours: number; text: string } {
    const hours = this.formatRoundedHours(timeString).replace('h', '')
    return {
      hours: parseInt(hours, 10),
      text: `${hours}h`,
    }
  },
}
