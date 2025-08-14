import { CommonModule, DOCUMENT } from '@angular/common'
import { Component, ElementRef, Inject, ViewChild } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { LayoutService } from '@services/app.layout.service'
import { HandleThemeService } from '@services/handle-theme.service'
import { ToggleButtonModule } from 'primeng/togglebutton'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, ToggleButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @ViewChild('menubutton') menuButton!: ElementRef
  public subscriptions: Subscription[] = []
  userName: string = 'Erick Ferreira'
  client: any[] = []
  selectedClient: any
  public light: boolean = false
  constructor(
    public layoutService: LayoutService,
    @Inject(DOCUMENT) private document: Document,
    private handleTheme: HandleThemeService,
  ) {
    const theme = localStorage.getItem('theme')
    if (theme) {
      this.light = theme === 'light'
      this.setTheme(this.light)
      this.handleTheme.setLightTheme(this.light)
    }
  }

  setTheme(state: boolean) {
    const themeName = state ? 'light' : 'dark'
    localStorage.setItem('theme', themeName)
    const setTheme = this.document.getElementById('theme') as HTMLLinkElement
    this.handleTheme.setLightTheme(state)
    setTheme.href = `${themeName}-theme.css`
  }
}
