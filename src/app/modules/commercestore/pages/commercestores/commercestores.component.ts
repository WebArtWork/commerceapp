import { Component } from '@angular/core';
import { AlertService, CoreService } from 'wacom';
import { CommercestoreService } from '../../services/commercestore.service';
import { Commercestore } from '../../interfaces/commercestore.interface';
import { FormService } from 'src/app/core/modules/form/form.service';
import { TranslateService } from 'src/app/core/modules/translate/translate.service';
import { FormInterface } from 'src/app/core/modules/form/interfaces/form.interface';
import { commercestoreFormComponents } from '../../formcomponents/commercestore.formcomponents';

@Component({
	templateUrl: './commercestores.component.html',
	styleUrls: ['./commercestores.component.scss'],
	standalone: false
})
export class CommercestoresComponent {
	columns = ['name', 'description'];

	form: FormInterface = this._form.getForm('commercestore', commercestoreFormComponents);

	config = {
		create: (): void => {
			this._form.modal<Commercestore>(this.form, {
				label: 'Create',
				click: (created: unknown, close: () => void) => {
					this._commercestoreService.create(created as Commercestore);

					close();
				}
			});
		},
		update: (doc: Commercestore): void => {
			this._form.modal<Commercestore>(this.form, [], doc).then((updated: Commercestore) => {
				this._core.copy(updated, doc);

				this._commercestoreService.update(doc);
			});
		},
		delete: (doc: Commercestore): void => {
			this._alert.question({
				text: this._translate.translate(
					'Common.Are you sure you want to delete this commercestore?'
				),
				buttons: [
					{
						text: this._translate.translate('Common.No')
					},
					{
						text: this._translate.translate('Common.Yes'),
						callback: (): void => {
							this._commercestoreService.delete(doc);
						}
					}
				]
			});
		},
		buttons: [
			{
				icon: 'cloud_download',
				click: (doc: Commercestore): void => {
					this._form.modalUnique<Commercestore>('commercestore', 'url', doc);
				}
			}
		],
		headerButtons: [
			{
				icon: 'playlist_add',
				click: this._bulkManagement(),
				class: 'playlist',
			},
			{
				icon: 'edit_note',
				click: this._bulkManagement(false),
				class: 'edit',
			},
		]
	};

	get rows(): Commercestore[] {
		return this._commercestoreService.commercestores;
	}

	constructor(
		private _translate: TranslateService,
		private _commercestoreService: CommercestoreService,
		private _alert: AlertService,
		private _form: FormService,
		private _core: CoreService
	) { }

	private _bulkManagement(create = true): () => void {
		return (): void => {
			this._form
				.modalDocs<Commercestore>(create ? [] : this.rows)
				.then((commercestores: Commercestore[]) => {
					if (create) {
						for (const commercestore of commercestores) {
							this._commercestoreService.create(commercestore);
						}
					} else {
						for (const commercestore of this.rows) {
							if (!commercestores.find(
								localCommercestore => localCommercestore._id === commercestore._id
							)) {
								this._commercestoreService.delete(commercestore);
							}
						}

						for (const commercestore of commercestores) {
							const localCommercestore = this.rows.find(
								localCommercestore => localCommercestore._id === commercestore._id
							);

							if (localCommercestore) {
								this._core.copy(commercestore, localCommercestore);

								this._commercestoreService.update(localCommercestore);
							} else {
								commercestore.__created = false;

								this._commercestoreService.create(commercestore);
							}
						}
					}
				});
		};
	}
}