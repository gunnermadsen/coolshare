import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicShareComponent } from './components/public-share/public-share.component';

const routes: Routes = [
    { 
        path: '', 
        component: PublicShareComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PublicShareRoutingModule {}
