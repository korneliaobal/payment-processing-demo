import { Component } from '@angular/core';
import { WorkspaceComponent } from './layout/workspace/workspace.component';

@Component({
  selector: 'app-root',
  imports: [WorkspaceComponent],
  templateUrl: './app.html',
})
export class App {}
