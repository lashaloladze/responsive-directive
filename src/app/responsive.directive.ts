import { Directive, Renderer2, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { screenSizes } from './responsive.interface';

@Directive({
  selector: '[appResponsive]'
})
export class ResponsiveDirective {

  private _screenSize: screenSizes = 'sm';
  @Input('appResponsive') 
  set permissionIf(value: screenSizes) {
    this._screenSize=value;
    this.updateView(window.innerWidth);
    this.renderer.listen(window, 'resize', this.onResize.bind(this)); 
  }

  BREAKPOINTS = {
    "md": 960,
    "lg": 1280,
  }

  viewExists: boolean = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef,
    private renderer: Renderer2,
  ) { }

  onResize(event: any): void{
    this.updateView(event.target.innerWidth);
  }

  private updateView(width: number): void{
    if(this.checkVisibility(width) && !this.viewExists) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
      this.viewExists = true;
    } else if (!this.checkVisibility(width) && this.viewExists) {
      this.viewContainerRef.clear();
      this.viewExists = false;
    }
  }

  private checkVisibility(width: number): boolean{
    switch(this._screenSize) {
      case 'sm': {
        return width < this.BREAKPOINTS.md;
      }
      case 'md': {
        return width < this.BREAKPOINTS.lg && width >= this.BREAKPOINTS.md;
      }
      default: return width >= this.BREAKPOINTS.lg;
    }
  }

}
