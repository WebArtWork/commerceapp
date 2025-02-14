import { UserService } from 'src/app/modules/user/services/user.service';
import { coreAnimation } from '../../animations/core.animations';
import { environment } from 'src/environments/environment';
import { Platform } from '@angular/cdk/platform';
import { Component } from '@angular/core';

@Component({
	selector: 'app-user',
	templateUrl: './user.component.html',
	styleUrls: ['./user.component.scss'],
	animations: [coreAnimation],
	standalone: false
})
export class UserComponent {
	readonly url = environment.url;
	forceAvatarUrl = '';
	showSidebar = false;
	hideSidebar(): void {
		if (!this._platform.ANDROID && !this._platform.IOS) {
			this.showSidebar = false;
		}
	}
	readonly usePortfolio =
		typeof (environment as { usePortfolio: boolean }).usePortfolio ===
		'boolean'
			? (environment as { usePortfolio: boolean }).usePortfolio
			: true;
	readonly useProduct =
		typeof (environment as { useProduct: boolean }).useProduct === 'boolean'
			? (environment as { useProduct: boolean }).useProduct
			: true;
	readonly useService =
		typeof (environment as { useService: boolean }).useService === 'boolean'
			? (environment as { useService: boolean }).useService
			: true;

	constructor(public us: UserService, private _platform: Platform) {}
}
