import { Directive, Renderer2, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { screenSizes } from './responsive.interface';

@Directive({
  selector: '[appResponsive]',
})
export class ResponsiveDirective {
  private _screenSize: screenSizes = 'sm';
  @Input('appResponsive')
  set permissionIf(value: screenSizes) {
    this._screenSize = value;
    this.updateView(window.innerWidth);
  }

  // ListenerFn to remove listener on Destroy
  listenerFn: () => void;

  breakPoints = {
    md: 960,
    lg: 1280,
  };

  viewExists: boolean = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef,
    private renderer: Renderer2
  ) {
    this.listenerFn = this.renderer.listen(
      window,
      'resize',
      this.onResize.bind(this)
    );
  }

  onResize(event: any): void {
    this.updateView(event.target.innerWidth);
  }

  private updateView(width: number): void {
    if (this.checkVisibility(width) && !this.viewExists) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
      this.viewExists = true;
    } else if (!this.checkVisibility(width) && this.viewExists) {
      this.viewContainerRef.clear();
      this.viewExists = false;
    }
  }

  private checkVisibility(width: number): boolean {
    switch (this._screenSize) {
      case 'sm': {
        return width < this.breakPoints.md;
      }
      case 'md': {
        return width < this.breakPoints.lg && width >= this.breakPoints.md;
      }
      default:
        return width >= this.breakPoints.lg;
    }
  }

  ngOnDestroy() {
    if (this.listenerFn) {
      this.listenerFn();
    }
  }
}
