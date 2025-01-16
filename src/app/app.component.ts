import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations'
@Component({
    selector: 'app-root',
    imports: [RouterOutlet, CommonModule, ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    animations: [
      trigger('routeAnimations', [
        transition('* <=> *', [
          style({ opacity: 0 }),
          animate('500ms', style({ opacity: 1 })),
        ]),
      ]),
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent { 
  title = 'BikeVille';
  prepareRoute(outlet: any) {
    return outlet?.activatedRouteData?.['animation'];
  }
}
