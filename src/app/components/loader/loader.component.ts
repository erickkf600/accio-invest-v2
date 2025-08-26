import { Component } from '@angular/core'
import { LoadingService } from './loading.service'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-loader',
  template: `
    <div
      class="fixed top-0 left-0 w-full h-full flex align-items-center justify-content-center"
      style="z-index: 999; background: var(--highlight-bg)"
      *ngIf="loadingService.loading$ | async"
    >
      <p-progressSpinner></p-progressSpinner>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule],
})
export class LoaderComponent {
  constructor(public loadingService: LoadingService) {}
}
