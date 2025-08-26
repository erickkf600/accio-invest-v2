import { Injectable } from '@angular/core'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import htmlToPdfmake from 'html-to-pdfmake'
pdfMake.vfs = pdfFonts.vfs
@Injectable({
  providedIn: 'root',
})
export class PdfGenService {
  constructor() {}

  genPdf(htmlContent: string) {
    const converted = htmlToPdfmake(htmlContent, { tableAutoSize: true })
    const docDefinition = { content: converted }
    pdfMake.createPdf(docDefinition).open()
  }
}
