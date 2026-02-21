import {
  AfterViewInit,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core'
import { TabView } from 'primeng/tabview'
import { TabItemComponent } from './tab-item.component'

@Component({
  selector: 'accio-tabs',
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class TabsComponent implements AfterViewInit {
  @ContentChildren(TabItemComponent)
  tabComponents!: QueryList<TabItemComponent>
  @ViewChild('tabView') tabView: TabView

  @Input() activeIndex = 0
  @Input() styleClass?: string
  @Input() tabContainerClass?: string
  @Output() onChange = new EventEmitter<{ index: number }>()

  ngAfterViewInit(): void {
    const tabContainer = this.tabView.el.nativeElement.querySelector('.p-tabview-nav-container')
    this.addClasses(tabContainer, this.tabContainerClass)
  }

  handleChange(index: number) {
    this.onChange.emit({ index })
  }

  private addClasses(element: HTMLElement | null, classesStr: string | undefined): void {
    if (element && classesStr) {
      const classes = classesStr.split(' ').filter(c => !!c)
      element.classList.add(...classes)
    }
  }
}
