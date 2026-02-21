import { DOCUMENT } from '@angular/common'
import { Component, Inject, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router'
import { HeaderComponent } from '@components/header/header.component'
import { SidemenuComponent } from '@components/sidemenu/sidemenu.component'
import { LayoutService } from '@services/app.layout.service'
import { PrimeNGConfig } from 'primeng/api'
import { Subscription, filter, map, startWith } from 'rxjs'
import { pt } from 'primelocale/pt.json'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  showHeaderMenu = false
  public subscriptions: Subscription[] = []
  menuOutsideClickListener: any

  @ViewChild(SidemenuComponent) appSidebar!: SidemenuComponent
  @ViewChild(HeaderComponent) appTopbar!: HeaderComponent

  get containerClass() {
    return {
      'layout-overlay': this.layoutService.config().menuMode === 'overlay',
      'layout-static': this.layoutService.config().menuMode === 'static',
      'layout-static-inactive':
        this.layoutService.state.staticMenuDesktopInactive &&
        this.layoutService.config().menuMode === 'static',
      'layout-overlay-active': this.layoutService.state.overlayMenuActive,
      'layout-mobile-active': this.layoutService.state.staticMenuMobileActive,
    }
  }
  constructor(
    private router: Router,
    private layoutService: LayoutService,
    private renderer: Renderer2,
    private config: PrimeNGConfig,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  ngOnInit(): void {
    this.verifyRoute()
    this.config.setTranslation(pt)

    this.subscriptions.push(
      this.layoutService.overlayOpen$.subscribe(() => {
        this.menuOutsideClickListener = this.renderer.listen('document', 'click', event => {
          const isOutsideClicked = !(
            this.appSidebar.el.nativeElement.isSameNode(event.target) ||
            this.appSidebar.el.nativeElement.contains(event.target) ||
            this.appTopbar.menuButton.nativeElement.isSameNode(event.target) ||
            this.appTopbar.menuButton.nativeElement.contains(event.target)
          )
          if (isOutsideClicked) {
            this.hideMenu()
          }
        })

        if (this.layoutService.state.staticMenuMobileActive) {
          this.blockBodyScroll()
        }
      }),
      this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
        this.hideMenu()
      }),
    )
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe)
  }

  private verifyRoute() {
    this.router.events
      .pipe(
        startWith(this.router),
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        map(rt => {
          const exceptions = ['login'].includes(rt.urlAfterRedirects.split('/')?.[1])
          this.showHeaderMenu = !exceptions
        }),
      )
      .subscribe()
  }

  hideMenu() {
    this.layoutService.state.overlayMenuActive = false
    this.layoutService.state.staticMenuMobileActive = false
    this.layoutService.state.menuHoverActive = false
    if (this.menuOutsideClickListener) {
      this.menuOutsideClickListener()
      this.menuOutsideClickListener = null
    }
    this.unblockBodyScroll()
  }

  blockBodyScroll(): void {
    if (this.document.body.classList) {
      this.document.body.classList.add('blocked-scroll')
    } else {
      this.document.body.className += ' blocked-scroll'
    }
  }

  unblockBodyScroll(): void {
    if (this.document.body.classList) {
      this.document.body.classList.remove('blocked-scroll')
    } else {
      this.document.body.className = this.document.body.className.replace(
        new RegExp('(^|\\b)' + 'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'),
        ' ',
      )
    }
  }
}
